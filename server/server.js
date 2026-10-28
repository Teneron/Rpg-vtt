import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, '..', 'dist');

const PORT = process.env.PORT || 3001;

// Origens permitidas (CORS). Padrão '*' para manter compatibilidade; em produção defina
// ALLOWED_ORIGINS="https://meu-app.vercel.app,https://outro.dominio" para restringir.
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || '*')
    .split(',')
    .map(s => s.trim())
    .map(s => (s === '*' ? '*' : s.replace(/\/+$/, '')))
    .filter(Boolean);
const CORS_ORIGIN = ALLOWED_ORIGINS.includes('*') ? '*' : ALLOWED_ORIGINS;

// Tamanho máximo de um pacote do Socket.io. Padrão 10MB (imagens de mapa / músicas em data-URL
// ainda trafegam pelo socket). Reduza via env quando os assets migrarem para upload dedicado.
const MAX_PAYLOAD_BYTES = Number(process.env.MAX_PAYLOAD_BYTES) || 1e7;

// Limites defensivos contra abuso / esgotamento de memória
const LIMITS = {
    roomIdLength: 64,
    nameLength: 40,
    userIdLength: 64,
    systemLength: 32,
    eventTypeLength: 40,
    characterBytes: 2 * 1024 * 1024,   // ficha completa (pode conter avatar em base64)
    chatMessageBytes: 16 * 1024,       // mensagem de chat cacheada no histórico
    broadcastDataBytes: 4 * 1024,      // dados auxiliares de room_broadcast
    maxRooms: Number(process.env.MAX_ROOMS) || 1000,
    maxMembersPerRoom: Number(process.env.MAX_MEMBERS_PER_ROOM) || 64,
    rateCapacity: 300,                 // rajada máxima de eventos por socket
    rateRefillPerSec: 150,             // reposição de tokens por segundo
    maxRateViolations: 500             // acima disso o socket é desconectado
};

// Eventos que um cliente (Mestre) pode pedir para o servidor retransmitir via room_broadcast.
// Qualquer outro nome é descartado (inclusive nomes reservados do Socket.io, que lançariam exceção).
const ALLOWED_BROADCAST_EVENTS = new Set(['force_refresh']);

// Política de autoridade das mensagens retransmitidas por `peer_message`:
//  - HOST_ONLY: só o Mestre autenticado (hostToken) pode emitir; para jogadores é descartada.
//  - MEMBER: qualquer membro da sala pode emitir (com regras extras em `authorizeAndStamp`).
//  - Qualquer outro `type` é descartado.
const HOST_ONLY_MESSAGE_TYPES = new Set(['COMBAT_UPDATE', 'AUDIO_UPDATE', 'SFX_TRIGGER', 'JOIN_RESPONSE', 'WELCOME']);
const MEMBER_MESSAGE_TYPES = new Set([
    'CHAT_MESSAGE', 'CHAT', 'ROLL_RESULT', 'EPHEMERAL_GESTURE', 'COMBAT_ACTION',
    'SYNC_REQUEST', 'JOIN_REQUEST', 'PLAYER_UPDATE', 'MAP_UPDATE', 'MAP_PING'
]);

const CONTROL_CHARS = /[\u0000-\u001f\u007f]/;
const CONTROL_CHARS_GLOBAL = /[\u0000-\u001f\u007f]/g;

const app = express();
app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());

// In-memory rooms repository:
// roomId -> {
//   hostSocketId: string | null,   // null enquanto o Mestre estiver offline
//   hostUserId: string,
//   members: Map<string, { socketId: string, userId: string, playerName: string, isHost: boolean, character: any }>,
//   gameState: {
//     map: any,
//     combat: any,
//     chatHistory: any[]
//   }
// }
const rooms = new Map();

// ---------------------------------------------------------------------------
// Helpers de validação / sanitização
// ---------------------------------------------------------------------------

const isPlainObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);

/**
 * Sanitiza configurações de sala (ex: nível inicial dos personagens 1 a 20).
 */
const sanitizeRoomSettings = (rawSettings) => {
    if (!isPlainObject(rawSettings)) {
        return { startingLevel: 1 };
    }
    let lvl = parseInt(rawSettings.startingLevel, 10);
    if (isNaN(lvl) || lvl < 1) lvl = 1;
    if (lvl > 20) lvl = 20;
    return { startingLevel: lvl };
};

/** Texto curto sanitizado (remove caracteres de controle e limita o tamanho). */
const cleanString = (v, max) => {
    if (typeof v !== 'string') return '';
    return v.replace(CONTROL_CHARS_GLOBAL, '').trim().slice(0, max);
};

/**
 * Normaliza um roomId. Retorna '' quando inválido (tipo errado, vazio, longo demais ou com
 * caracteres de controle). Não trunca: truncar poderia fazer duas salas colidirem.
 */
const cleanRoomId = (v) => {
    if (typeof v !== 'string' && typeof v !== 'number') return '';
    const s = String(v).trim();
    if (!s || s.length > LIMITS.roomIdLength || CONTROL_CHARS.test(s)) return '';
    return s;
};

/** Tamanho aproximado (bytes) do JSON de um valor; Infinity se não serializável (ex.: circular). */
const jsonSize = (value) => {
    try {
        const json = JSON.stringify(value);
        return json === undefined ? 0 : Buffer.byteLength(json, 'utf8');
    } catch {
        return Infinity;
    }
};

const createRateLimiter = (capacity, refillPerSec) => {
    let tokens = capacity;
    let last = Date.now();
    return () => {
        const now = Date.now();
        tokens = Math.min(capacity, tokens + ((now - last) / 1000) * refillPerSec);
        last = now;
        if (tokens >= 1) {
            tokens -= 1;
            return true;
        }
        return false;
    };
};

/**
 * Envolve um handler de evento do socket garantindo que:
 *  - o payload seja um objeto simples (senão responde erro e ignora);
 *  - o callback (ack) seja opcional e nunca derrube o handler;
 *  - exceções internas sejam capturadas (um evento malformado jamais derruba o processo);
 *  - o socket respeite um rate limit (token bucket) com desconexão em caso de abuso.
 */
const safeHandler = (socket, eventName, rateLimiter, state, handler) => (...args) => {
    const callback = args.find(a => typeof a === 'function') || null;
    const hasCallback = typeof callback === 'function';
    const reply = (response) => {
        if (!callback) return;
        try {
            callback(response);
        } catch (err) {
            console.error(`[Socket] Ack error on '${eventName}':`, err.message);
        }
    };

    const now = Date.now();
    if (state.violations > 0) {
        const decaySteps = Math.floor((now - state.lastDecayAt) / 10000);
        if (decaySteps > 0) {
            state.violations = Math.max(0, state.violations - decaySteps);
            state.lastDecayAt += decaySteps * 10000;
        }
    } else {
        state.lastDecayAt = now;
    }

    if (!rateLimiter()) {
        state.violations += 1;
        state.lastViolationAt = now;
        if (state.violations === 1 || state.violations % 100 === 0) {
            console.warn(`[Socket] Rate limit exceeded by ${socket.id} on '${eventName}' (${state.violations} dropped)`);
        }
        reply({ success: false, error: 'Muitas requisições. Aguarde um instante.' });
        if (state.violations >= LIMITS.maxRateViolations) {
            console.warn(`[Socket] Disconnecting abusive client ${socket.id}`);
            socket.disconnect(true);
        }
        return;
    }

    // Decaimento gradual em tráfego legítimo após período sem infrações (evita acumular em sessões de 5h+)
    if (state.violations > 0 && now - state.lastViolationAt >= 1000) {
        state.violations = Math.max(0, state.violations - 1);
    }

    const payload = args[0];
    if (!isPlainObject(payload)) {
        reply({ success: false, error: 'Payload inválido.' });
        return;
    }

    try {
        handler(payload, reply, hasCallback);
    } catch (err) {
        console.error(`[Socket] Handler '${eventName}' failed for ${socket.id}:`, err);
        reply({ success: false, error: 'Erro interno do servidor.' });
    }
};

/** O socket é o Mestre atual da sala? (membro marcado como host só existe após autenticar com hostToken) */
const isRoomHost = (room, socketId) => {
    const member = room.members.get(socketId);
    return !!(member?.isHost || room.hostSocketId === socketId);
};

/** Comparação em tempo constante do hostToken informado com o da sala. */
const tokensMatch = (expected, given) => {
    if (typeof expected !== 'string' || typeof given !== 'string') return false;
    const a = Buffer.from(expected);
    const b = Buffer.from(given);
    return a.length === b.length && crypto.timingSafeEqual(a, b);
};

/**
 * Autoriza uma mensagem de `peer_message` e devolve uma cópia "carimbada" com a identidade REAL
 * do remetente (o servidor não confia em senderId/playerName vindos do cliente).
 * Retorna null quando a mensagem deve ser descartada.
 */
const authorizeAndStamp = (room, socketId, message) => {
    const member = room.members.get(socketId);
    if (!member) return null;

    const fromHost = isRoomHost(room, socketId);
    const type = message.type;

    if (HOST_ONLY_MESSAGE_TYPES.has(type)) {
        if (!fromHost) return null;
    } else if (!MEMBER_MESSAGE_TYPES.has(type)) {
        return null;
    }

    const stamped = { ...message, senderUserId: member.userId, senderIsHost: fromHost };
    const payload = message.payload;

    switch (type) {
        case 'MAP_UPDATE': {
            if (fromHost) break;
            // Jogadores só podem mover tokens (a UI já limita aos tokens que possuem).
            const data = isPlainObject(payload) ? payload.data : null;
            if (!isPlainObject(payload) || payload.type !== 'move' || !isPlainObject(data)
                || typeof data.id !== 'string' || !Number.isFinite(data.x) || !Number.isFinite(data.y)) {
                return null;
            }
            break;
        }
        case 'PLAYER_UPDATE': {
            if (!isPlainObject(payload) || typeof payload.peerId !== 'string') return null;
            if (!isPlainObject(payload.character) || jsonSize(payload.character) > LIMITS.characterBytes) return null;
            // Jogador só atualiza a PRÓPRIA ficha; o Mestre pode atualizar a de qualquer um.
            if (!fromHost && payload.peerId !== member.userId) return null;
            break;
        }
        case 'CHAT_MESSAGE': {
            if (!isPlainObject(payload)) return null;
            stamped.payload = { ...payload, senderId: member.userId, senderName: member.playerName };
            break;
        }
        case 'ROLL_RESULT': {
            if (!isPlainObject(payload)) return null;
            stamped.payload = { ...payload, playerName: member.playerName };
            break;
        }
        case 'MAP_PING': {
            if (!isPlainObject(payload)) return null;
            if (!Number.isFinite(payload.x) || !Number.isFinite(payload.y)
                || Math.abs(payload.x) > 10000 || Math.abs(payload.y) > 10000) {
                return null;
            }
            const safeColor = (typeof payload.color === 'string' && /^#[0-9a-fA-F]{3,8}$/.test(payload.color))
                ? payload.color
                : (member.isHost ? '#ef4444' : '#38bdf8');
            stamped.payload = {
                id: cleanString(payload.id, 64) || crypto.randomUUID(),
                x: payload.x,
                y: payload.y,
                color: safeColor,
                senderName: member.playerName || (member.isHost ? 'Mestre' : 'Jogador'),
                senderId: member.userId,
                timestamp: Date.now()
            };
            break;
        }
        default:
            break;
    }

    return stamped;
};

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: Date.now(),
        activeRooms: rooms.size
    });
});

// Serve static frontend build if available (Production All-in-One mode)
if (fs.existsSync(distPath)) {
    console.log(`[Server] Serving production frontend build from: ${distPath}`);
    app.use(express.static(distPath));
    app.use((req, res, next) => {
        if (req.path.startsWith('/socket.io') || req.path === '/health') return next();
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        res.sendFile(path.join(distPath, 'index.html'));
    });
} else {
    // Health check endpoints in dev / standalone API mode
    app.get('/', (req, res) => {
        res.json({
            name: 'RPG Tabletop Socket Server',
            status: 'online',
            uptime: process.uptime(),
            activeRooms: rooms.size
        });
    });
}

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: CORS_ORIGIN,
        methods: ['GET', 'POST']
    },
    maxHttpBufferSize: MAX_PAYLOAD_BYTES
});

io.engine.on('connection_error', (err) => {
    console.warn('[Socket] Engine connection error:', err.code, err.message);
});

io.on('connection', (socket) => {
    console.log(`[Socket] Client connected: ${socket.id}`);

    // Track rooms this socket is currently in for cleanup on disconnect
    const joinedRooms = new Set();

    const rateLimiter = createRateLimiter(LIMITS.rateCapacity, LIMITS.rateRefillPerSec);
    const rateState = { violations: 0, lastViolationAt: 0, lastDecayAt: Date.now() };
    const on = (eventName, handler) =>
        socket.on(eventName, safeHandler(socket, eventName, rateLimiter, rateState, handler));

    socket.on('error', (err) => {
        console.warn(`[Socket] Socket error on ${socket.id}:`, err?.message || err);
    });

    // 1. JOIN ROOM
    on('join_room', (payload, reply, hasCallback) => {
        const { playerName, isHost, character, userId, system } = payload;

        const cleanedRoomId = cleanRoomId(payload.roomId);
        if (!cleanedRoomId) {
            reply({ success: false, error: 'roomId is required' });
            return;
        }

        const safeName = cleanString(playerName, LIMITS.nameLength);
        const safeUserId = cleanString(userId, LIMITS.userIdLength);
        const safeSystem = cleanString(system, LIMITS.systemLength);
        const wantsHost = isHost === true;
        const safeCharacter = isPlainObject(character) ? character : null;

        if (character != null && (!isPlainObject(character) || jsonSize(character) > LIMITS.characterBytes)) {
            reply({ success: false, error: 'Ficha de personagem inválida ou grande demais.' });
            return;
        }

        // Mestre só é reconhecido se criar a sala (recebe o hostToken) ou reentrar com o hostToken correto.
        let isAuthenticatedHost = false;
        let existingCharacter = null;

        let room = rooms.get(cleanedRoomId);
        if (!room) {
            if (!wantsHost) {
                console.log(`[Socket] Player ${safeName || socket.id} attempted to join non-existent room: ${cleanedRoomId}`);
                reply({ success: false, error: 'A sala informada não existe ou o Mestre ainda não abriu a mesa. Verifique o código digitado!' });
                return;
            }
            if (rooms.size >= LIMITS.maxRooms) {
                console.warn(`[Server] Room limit reached (${LIMITS.maxRooms}); rejecting new room ${cleanedRoomId}`);
                reply({ success: false, error: 'O servidor atingiu o limite de mesas ativas. Tente novamente mais tarde.' });
                return;
            }
            room = {
                roomId: cleanedRoomId,
                system: safeSystem || (cleanedRoomId.toUpperCase().startsWith('WTC') ? 'witcher' : 'dnd55e'),
                settings: sanitizeRoomSettings(payload.settings),
                hostToken: crypto.randomUUID(),
                hostSocketId: socket.id,
                hostUserId: safeUserId || null,
                hostName: safeName || 'Mestre',
                cleanupTimer: null,
                members: new Map(),
                gameState: {
                    map: null,
                    combat: null,
                    audio: null,
                    chatHistory: []
                }
            };
            rooms.set(cleanedRoomId, room);
            isAuthenticatedHost = true;
        } else {
            if (wantsHost) {
                if (!tokensMatch(room.hostToken, payload.hostToken)) {
                    console.warn(`[Socket] Host takeover attempt rejected for room ${cleanedRoomId} by ${socket.id}`);
                    reply({ success: false, error: 'Esta mesa já pertence a outro Mestre (token de Mestre inválido). Escolha outro código de sala.' });
                    return;
                }
                isAuthenticatedHost = true;
            } else if (!room.hostSocketId) {
                console.log(`[Socket] Player ${safeName || socket.id} attempted to join room with offline host: ${cleanedRoomId}`);
                reply({ success: false, error: 'O Mestre desta mesa está desconectado no momento.' });
                return;
            }

            // Antes de checar maxMembersPerRoom, identifica e poda sockets órfãos/reconectados do mesmo userId
            // preservando a segurança S5 (não permite que um estranho com outro nome sequestre userId ativo).
            const effectiveName = safeName || (isAuthenticatedHost ? 'Mestre' : 'Jogador');
            const staleSocketsToPrune = [];

            if (safeUserId) {
                for (const [existingSocketId, existingMember] of room.members.entries()) {
                    if (existingMember.userId !== safeUserId) continue;

                    if (existingSocketId === socket.id) {
                        if (existingMember.character) existingCharacter = existingMember.character;
                        continue;
                    }

                    const activeOldSocket = io.sockets.sockets.get(existingSocketId);
                    const isStillConnected = Boolean(activeOldSocket?.connected);

                    if (existingMember.isHost && !isAuthenticatedHost) {
                        reply({ success: false, error: 'Conflito de identificador com o Mestre da sala.' });
                        return;
                    }

                    const canReplace = !isStillConnected
                        || isAuthenticatedHost
                        || existingMember.playerName === effectiveName;

                    if (!canReplace) {
                        reply({ success: false, error: 'Este identificador de jogador já está ativo na mesa.' });
                        return;
                    }

                    if (existingMember.character) {
                        existingCharacter = existingMember.character;
                    }
                    staleSocketsToPrune.push(existingSocketId);
                }
            } else if (room.members.has(socket.id)) {
                existingCharacter = room.members.get(socket.id)?.character || null;
            }

            const effectiveNewSize = room.members.size - staleSocketsToPrune.length;
            if (!room.members.has(socket.id) && effectiveNewSize >= LIMITS.maxMembersPerRoom) {
                reply({ success: false, error: 'A mesa está lotada.' });
                return;
            }

            for (const staleSid of staleSocketsToPrune) {
                console.log(`[Room ${cleanedRoomId}] Pruning stale socket ${staleSid} for user ${safeUserId}`);
                const oldSock = io.sockets.sockets.get(staleSid);
                if (oldSock) oldSock.leave(cleanedRoomId);
                room.members.delete(staleSid);
            }
        }

        // Cancela qualquer timer pendente de expiração de sala vazia
        if (room.cleanupTimer) {
            clearTimeout(room.cleanupTimer);
            room.cleanupTimer = null;
        }

        socket.join(cleanedRoomId);
        joinedRooms.add(cleanedRoomId);

        if (isAuthenticatedHost) {
            room.hostSocketId = socket.id;
            room.hostUserId = safeUserId || room.hostUserId;
            room.hostName = safeName || room.hostName;
            if (safeSystem) room.system = safeSystem;
            if (payload.settings) room.settings = sanitizeRoomSettings(payload.settings);
        }

        const memberData = {
            socketId: socket.id,
            userId: safeUserId || socket.id,
            playerName: safeName || (isAuthenticatedHost ? 'Mestre' : 'Jogador'),
            isHost: isAuthenticatedHost,
            character: safeCharacter || existingCharacter || null,
            isOnline: true
        };

        room.members.set(socket.id, memberData);

        console.log(`[Room ${cleanedRoomId}] [System: ${room.system}] ${memberData.playerName} (${memberData.isHost ? 'Host' : 'Player'}) joined. Members: ${room.members.size}`);

        // Broadcast to existing room members
        socket.to(cleanedRoomId).emit('player_joined', memberData);

        // Prepare existing members array to return to the joined player
        const currentMembers = Array.from(room.members.values());

        const responsePayload = {
            success: true,
            roomId: cleanedRoomId,
            system: room.system,
            settings: room.settings || { startingLevel: 1 },
            isHost: isAuthenticatedHost,
            hostName: room.hostName,
            members: currentMembers,
            gameState: room.gameState
        };

        // O hostToken é segredo do Mestre: só ele recebe (nunca jogadores, nem player_joined).
        if (isAuthenticatedHost) {
            responsePayload.hostToken = room.hostToken;
        }

        if (hasCallback) {
            reply(responsePayload);
        } else {
            socket.emit('room_state', responsePayload);
        }
    });

    // 2. PEER MESSAGE RELAY (Matches PeerMessage protocol)
    on('peer_message', (payload) => {
        const cleanedRoomId = cleanRoomId(payload.roomId);
        const message = payload.message;
        if (!cleanedRoomId || !isPlainObject(message)) return;
        if (typeof message.type !== 'string' || !message.type || message.type.length > LIMITS.eventTypeLength) return;

        const room = rooms.get(cleanedRoomId);
        if (!room) return;

        // Somente membros da sala podem enviar mensagens, e apenas tipos permitidos para o seu papel.
        // A mensagem retransmitida é uma cópia com a identidade real do remetente.
        const stamped = authorizeAndStamp(room, socket.id, message);
        if (!stamped) return;

        // Mantém a ficha do membro atualizada no servidor (entrada tardia / reconexão do Mestre).
        if (stamped.type === 'PLAYER_UPDATE') {
            for (const m of room.members.values()) {
                if (m.userId === stamped.payload.peerId) m.character = stamped.payload.character;
            }
        }

        // Cacheia estado completo e deltas incrementais para sincronização imediata de reconexões / late-joiners
        if (stamped.type === 'MAP_UPDATE' && isPlainObject(stamped.payload)) {
            const p = stamped.payload;
            const d = isPlainObject(p.data) ? p.data : null;

            if (p.type === 'full_sync' && d) {
                room.gameState.map = {
                    ...d,
                    tokens: Array.isArray(d.tokens) ? [...d.tokens] : [],
                    walls: Array.isArray(d.walls) ? [...d.walls] : []
                };
            } else if (isPlainObject(room.gameState.map)) {
                if (!Array.isArray(room.gameState.map.tokens)) room.gameState.map.tokens = [];
                if (!Array.isArray(room.gameState.map.walls)) room.gameState.map.walls = [];

                switch (p.type) {
                    case 'config': {
                        if (stamped.senderIsHost && d) {
                            room.gameState.map.config = isPlainObject(room.gameState.map.config)
                                ? { ...room.gameState.map.config, ...d }
                                : { ...d };
                        }
                        break;
                    }
                    case 'move': {
                        const moveId = typeof d?.id === 'string' ? d.id : (typeof p.id === 'string' ? p.id : null);
                        const moveX = Number.isFinite(d?.x) ? d.x : (Number.isFinite(p.x) ? p.x : null);
                        const moveY = Number.isFinite(d?.y) ? d.y : (Number.isFinite(p.y) ? p.y : null);
                        if (moveId && moveX !== null && moveY !== null) {
                            room.gameState.map.tokens = room.gameState.map.tokens.map(t =>
                                (isPlainObject(t) && t.id === moveId)
                                    ? { ...t, position: { ...(isPlainObject(t.position) ? t.position : {}), x: moveX, y: moveY } }
                                    : t
                            );
                        }
                        break;
                    }
                    case 'add': {
                        const tokenObj = (d && typeof d.id === 'string')
                            ? d
                            : (isPlainObject(p.token) && typeof p.token.id === 'string' ? p.token : null);
                        if (stamped.senderIsHost && tokenObj) {
                            const exists = room.gameState.map.tokens.some(t => isPlainObject(t) && t.id === tokenObj.id);
                            room.gameState.map.tokens = exists
                                ? room.gameState.map.tokens.map(t => (isPlainObject(t) && t.id === tokenObj.id) ? tokenObj : t)
                                : [...room.gameState.map.tokens, tokenObj];
                        }
                        break;
                    }
                    case 'remove': {
                        const remId = typeof d?.id === 'string' ? d.id : (typeof p.id === 'string' ? p.id : null);
                        if (stamped.senderIsHost && remId) {
                            room.gameState.map.tokens = room.gameState.map.tokens.filter(t => !isPlainObject(t) || t.id !== remId);
                        }
                        break;
                    }
                    case 'update_token': {
                        const updId = typeof d?.id === 'string' ? d.id : (typeof p.id === 'string' ? p.id : null);
                        const updates = isPlainObject(d?.updates) ? d.updates : (isPlainObject(p.updates) ? p.updates : null);
                        if (stamped.senderIsHost && updId && updates) {
                            room.gameState.map.tokens = room.gameState.map.tokens.map(t =>
                                (isPlainObject(t) && t.id === updId) ? { ...t, ...updates } : t
                            );
                        }
                        break;
                    }
                    case 'add_wall': {
                        const wallObj = (d && typeof d.id === 'string')
                            ? d
                            : (isPlainObject(p.wall) && typeof p.wall.id === 'string' ? p.wall : null);
                        if (stamped.senderIsHost && wallObj) {
                            const exists = room.gameState.map.walls.some(w => isPlainObject(w) && w.id === wallObj.id);
                            room.gameState.map.walls = exists
                                ? room.gameState.map.walls.map(w => (isPlainObject(w) && w.id === wallObj.id) ? wallObj : w)
                                : [...room.gameState.map.walls, wallObj];
                        }
                        break;
                    }
                    case 'update_wall': {
                        const wallId = typeof d?.id === 'string' ? d.id : (typeof p.id === 'string' ? p.id : null);
                        const updates = isPlainObject(d?.updates) ? d.updates : (isPlainObject(p.updates) ? p.updates : null);
                        if (stamped.senderIsHost && wallId && updates) {
                            room.gameState.map.walls = room.gameState.map.walls.map(w =>
                                (isPlainObject(w) && w.id === wallId) ? { ...w, ...updates } : w
                            );
                        }
                        break;
                    }
                    case 'remove_wall': {
                        const wallId = typeof d?.id === 'string' ? d.id : (typeof p.id === 'string' ? p.id : null);
                        if (stamped.senderIsHost && wallId) {
                            room.gameState.map.walls = room.gameState.map.walls.filter(w => !isPlainObject(w) || w.id !== wallId);
                        }
                        break;
                    }
                    default:
                        break;
                }
            }
        } else if (stamped.type === 'COMBAT_UPDATE' && isPlainObject(stamped.payload)) {
            room.gameState.combat = stamped.payload;
        } else if (stamped.type === 'AUDIO_UPDATE' && isPlainObject(stamped.payload)) {
            room.gameState.audio = stamped.payload;
        } else if (stamped.type === 'CHAT_MESSAGE' && jsonSize(stamped.payload) <= LIMITS.chatMessageBytes) {
            if (!room.gameState.chatHistory) room.gameState.chatHistory = [];
            room.gameState.chatHistory.push(stamped.payload);
            if (room.gameState.chatHistory.length > 100) {
                room.gameState.chatHistory.shift();
            }
        }

        // Unicast SYNC_REQUEST apenas para o Mestre (evita broadcast desnecessário aos demais jogadores)
        if (stamped.type === 'SYNC_REQUEST') {
            if (room.hostSocketId && room.hostSocketId !== socket.id) {
                io.to(room.hostSocketId).emit('peer_message', stamped);
            }
            return;
        }

        // Broadcast to all other peers in the room
        socket.to(cleanedRoomId).emit('peer_message', stamped);
    });

    // 3. BROADCAST TO ALL IN ROOM (host only, whitelisted events only)
    on('room_broadcast', (payload) => {
        const cleanedRoomId = cleanRoomId(payload.roomId);
        const event = payload.event;
        if (!cleanedRoomId || typeof event !== 'string' || !ALLOWED_BROADCAST_EVENTS.has(event)) return;

        const room = rooms.get(cleanedRoomId);
        if (!room || !room.members.has(socket.id) || !isRoomHost(room, socket.id)) return;

        const data = isPlainObject(payload.data) && jsonSize(payload.data) <= LIMITS.broadcastDataBytes
            ? payload.data
            : {};

        if (payload.includeSender === true) {
            io.to(cleanedRoomId).emit(event, data);
        } else {
            socket.to(cleanedRoomId).emit(event, data);
        }
    });

    // 4. CLOSE ROOM (Explicitly by Host)
    on('close_room', (payload) => {
        const cleanedRoomId = cleanRoomId(payload.roomId);
        if (!cleanedRoomId) return;
        const room = rooms.get(cleanedRoomId);
        if (!room) return;

        if (isRoomHost(room, socket.id)) {
            console.log(`[Room ${cleanedRoomId}] Room closed by Host (${socket.id}). Notifying all players.`);
            if (room.cleanupTimer) {
                clearTimeout(room.cleanupTimer);
                room.cleanupTimer = null;
            }
            io.to(cleanedRoomId).emit('room_closed', {
                roomId: cleanedRoomId,
                reason: 'A mesa foi encerrada pelo Mestre.'
            });
            io.in(cleanedRoomId).socketsLeave(cleanedRoomId);
            rooms.delete(cleanedRoomId);
            joinedRooms.delete(cleanedRoomId);
        }
    });

    // 5. LEAVE ROOM
    on('leave_room', (payload) => {
        const cleanedRoomId = cleanRoomId(payload.roomId);
        if (!cleanedRoomId) return;

        const room = rooms.get(cleanedRoomId);
        const isHost = room ? isRoomHost(room, socket.id) : false;

        if (isHost && payload.closeRoom === true) {
            console.log(`[Room ${cleanedRoomId}] Host left with closeRoom flag. Terminating room.`);
            if (room.cleanupTimer) {
                clearTimeout(room.cleanupTimer);
                room.cleanupTimer = null;
            }
            io.to(cleanedRoomId).emit('room_closed', {
                roomId: cleanedRoomId,
                reason: 'A mesa foi encerrada pelo Mestre.'
            });
            io.in(cleanedRoomId).socketsLeave(cleanedRoomId);
            rooms.delete(cleanedRoomId);
            joinedRooms.delete(cleanedRoomId);
            return;
        }

        socket.leave(cleanedRoomId);
        joinedRooms.delete(cleanedRoomId);
        handleSocketLeaveRoom(socket, cleanedRoomId);
    });

    // 6. KICK / REMOVE PLAYER (Host Only)
    on('kick_player', (payload) => {
        const cleanedRoomId = cleanRoomId(payload.roomId);
        const targetUserId = cleanString(payload.userId, LIMITS.userIdLength);
        if (!cleanedRoomId || !targetUserId) return;
        const room = rooms.get(cleanedRoomId);
        if (!room) return;

        if (!isRoomHost(room, socket.id)) return;

        for (const [memberSocketId, member] of room.members.entries()) {
            if (member.userId === targetUserId) {
                console.log(`[Room ${cleanedRoomId}] Host kicked player: ${member.playerName} (${targetUserId})`);
                const targetSocket = io.sockets.sockets.get(memberSocketId);
                if (targetSocket) {
                    targetSocket.emit('player_kicked', {
                        reason: 'Voce foi removido da mesa pelo Mestre.'
                    });
                    targetSocket.leave(cleanedRoomId);
                }
                room.members.delete(memberSocketId);
                socket.to(cleanedRoomId).emit('player_left', {
                    socketId: memberSocketId,
                    userId: member.userId,
                    playerName: member.playerName,
                    wasHost: false
                });
                break;
            }
        }
    });

    // 7. ATUALIZAR CONFIGURAÇÕES DA SALA (Host Only, ex: startingLevel)
    on('update_room_settings', (payload, reply) => {
        const hasCallback = typeof reply === 'function';
        if (!isPlainObject(payload)) {
            if (hasCallback) reply({ success: false, error: 'Payload inválido.' });
            return;
        }

        const cleanedRoomId = cleanRoomId(payload.roomId);
        if (!cleanedRoomId) {
            if (hasCallback) reply({ success: false, error: 'Código de sala inválido.' });
            return;
        }

        const room = rooms.get(cleanedRoomId);
        if (!room) {
            if (hasCallback) reply({ success: false, error: 'Sala não encontrada.' });
            return;
        }

        if (!tokensMatch(room.hostToken, payload.hostToken) && !isRoomHost(room, socket.id)) {
            console.warn(`[Socket] Unauthorized update_room_settings attempt for room ${cleanedRoomId} by ${socket.id}`);
            if (hasCallback) reply({ success: false, error: 'Apenas o Mestre pode alterar as configurações da sala.' });
            return;
        }

        const sanitized = sanitizeRoomSettings(payload.settings);
        room.settings = { ...(room.settings || {}), ...sanitized };
        console.log(`[Room ${cleanedRoomId}] Settings updated:`, room.settings);

        io.to(cleanedRoomId).emit('room_settings_updated', {
            roomId: cleanedRoomId,
            settings: room.settings
        });

        if (hasCallback) reply({ success: true, settings: room.settings });
    });

    // 8. DISCONNECT
    socket.on('disconnect', () => {
        console.log(`[Socket] Client disconnected: ${socket.id}`);
        for (const roomId of joinedRooms) {
            try {
                handleSocketLeaveRoom(socket, roomId);
            } catch (err) {
                console.error(`[Room ${roomId}] Error handling disconnect:`, err);
            }
        }
        joinedRooms.clear();
    });
});

function handleSocketLeaveRoom(socket, roomId) {
    const room = rooms.get(roomId);
    if (!room) return;

    const leavingMember = room.members.get(socket.id);
    room.members.delete(socket.id);
    socket.leave(roomId);

    // Marca o Mestre como offline para que novos jogadores não entrem numa mesa sem Mestre.
    // (Se o Mestre já reentrou com outro socket, hostSocketId aponta para o novo e é preservado.)
    if (room.hostSocketId === socket.id) {
        room.hostSocketId = null;
        console.log(`[Room ${roomId}] Host went offline.`);
    }

    console.log(`[Room ${roomId}] Member left: ${leavingMember?.playerName || socket.id}. Remaining: ${room.members.size}`);

    if (leavingMember) {
        socket.to(roomId).emit('player_left', {
            socketId: socket.id,
            userId: leavingMember.userId,
            playerName: leavingMember.playerName,
            wasHost: leavingMember.isHost
        });
    }

    // Grace period para salas vazias (padrão de 10 minutos para suportar oscilações de rede e recarregamentos)
    const gracePeriodMs = Number(process.env.ROOM_GRACE_PERIOD_MS) || (10 * 60 * 1000);
    if (room.members.size === 0) {
        if (room.cleanupTimer) {
            clearTimeout(room.cleanupTimer);
            room.cleanupTimer = null;
        }
        room.cleanupTimer = setTimeout(() => {
            const currentRoom = rooms.get(roomId);
            if (currentRoom) {
                currentRoom.cleanupTimer = null;
                if (currentRoom.members.size === 0) {
                    rooms.delete(roomId);
                    console.log(`[Room ${roomId}] Empty room expired (${gracePeriodMs / 1000}s grace period) and cleaned up.`);
                }
            }
        }, gracePeriodMs);
        room.cleanupTimer.unref?.();
    }
}

// Start server listening
if (process.env.NODE_ENV !== 'test') {
    // Rede de segurança: os handlers já são protegidos por safeHandler, mas um erro inesperado
    // em qualquer outro ponto não deve derrubar todas as mesas ativas.
    process.on('uncaughtException', (err) => {
        console.error('[Server][FATAL-GUARD] uncaughtException:', err);
    });
    process.on('unhandledRejection', (reason) => {
        console.error('[Server][FATAL-GUARD] unhandledRejection:', reason);
    });

    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.log(`Port ${PORT} is already in use by an active server instance.`);
        } else {
            console.error('Server error:', err);
        }
    });

    server.listen(PORT, () => {
        console.log(`===============================================`);
        console.log(`RPG Tabletop Server listening on port ${PORT}`);
        console.log(`WebSocket ready for connections`);
        console.log(`===============================================`);
    });
}

export { app, server, io, rooms };
