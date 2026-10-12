import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, '..', 'dist');

const PORT = process.env.PORT || 3001;

// Origens permitidas (CORS). Padrão '*' para manter compatibilidade; em produção defina
// ALLOWED_ORIGINS="https://meu-app.vercel.app,https://outro.dominio" para restringir.
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || '*')
    .split(',')
    .map(s => s.trim())
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
    const reply = (response) => {
        if (!callback) return;
        try {
            callback(response);
        } catch (err) {
            console.error(`[Socket] Ack error on '${eventName}':`, err.message);
        }
    };

    if (!rateLimiter()) {
        state.violations += 1;
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

    const payload = args[0];
    if (!isPlainObject(payload)) {
        reply({ success: false, error: 'Payload inválido.' });
        return;
    }

    try {
        handler(payload, reply);
    } catch (err) {
        console.error(`[Socket] Handler '${eventName}' failed for ${socket.id}:`, err);
        reply({ success: false, error: 'Erro interno do servidor.' });
    }
};

/** O socket é o Mestre atual da sala? */
const isRoomHost = (room, socketId) => {
    const member = room.members.get(socketId);
    return !!(member?.isHost || room.hostSocketId === socketId);
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
    const rateState = { violations: 0 };
    const on = (eventName, handler) =>
        socket.on(eventName, safeHandler(socket, eventName, rateLimiter, rateState, handler));

    socket.on('error', (err) => {
        console.warn(`[Socket] Socket error on ${socket.id}:`, err?.message || err);
    });

    // 1. JOIN ROOM
    on('join_room', (payload, reply) => {
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

        if (character != null && (!isPlainObject(character) || jsonSize(character) > LIMITS.characterBytes)) {
            reply({ success: false, error: 'Ficha de personagem inválida ou grande demais.' });
            return;
        }

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
                hostSocketId: socket.id,
                hostUserId: safeUserId || null,
                hostName: safeName || 'Mestre',
                members: new Map(),
                gameState: {
                    map: null,
                    combat: null,
                    chatHistory: []
                }
            };
            rooms.set(cleanedRoomId, room);
        } else {
            if (!wantsHost && !room.hostSocketId) {
                console.log(`[Socket] Player ${safeName || socket.id} attempted to join room with offline host: ${cleanedRoomId}`);
                reply({ success: false, error: 'O Mestre desta mesa está desconectado no momento.' });
                return;
            }
            if (!room.members.has(socket.id) && room.members.size >= LIMITS.maxMembersPerRoom) {
                reply({ success: false, error: 'A mesa está lotada.' });
                return;
            }
        }

        socket.join(cleanedRoomId);
        joinedRooms.add(cleanedRoomId);

        // NOTE (Fase 1 do plano de correção): `isHost` ainda é declarado pelo cliente. A autoridade
        // do Mestre (hostToken) será introduzida junto com o ajuste do cliente.
        if (wantsHost) {
            room.hostSocketId = socket.id;
            room.hostUserId = safeUserId || room.hostUserId;
            room.hostName = safeName || room.hostName;
            if (safeSystem) room.system = safeSystem;
        }

        // Clean up any stale socket entries for the same userId in this room
        if (safeUserId) {
            for (const [existingSocketId, existingMember] of room.members.entries()) {
                if (existingMember.userId === safeUserId && existingSocketId !== socket.id) {
                    console.log(`[Room ${cleanedRoomId}] Pruning stale socket ${existingSocketId} for user ${safeUserId}`);
                    room.members.delete(existingSocketId);
                }
            }
        }

        const memberData = {
            socketId: socket.id,
            userId: safeUserId || socket.id,
            playerName: safeName || (wantsHost ? 'Mestre' : 'Jogador'),
            isHost: wantsHost,
            character: character || null,
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
            isHost: wantsHost,
            hostName: room.hostName,
            members: currentMembers,
            gameState: room.gameState
        };

        reply(responsePayload);
        socket.emit('room_state', responsePayload);
    });

    // 2. PEER MESSAGE RELAY (Matches PeerMessage protocol)
    on('peer_message', (payload) => {
        const cleanedRoomId = cleanRoomId(payload.roomId);
        const message = payload.message;
        if (!cleanedRoomId || !isPlainObject(message)) return;
        if (typeof message.type !== 'string' || !message.type || message.type.length > LIMITS.eventTypeLength) return;

        const room = rooms.get(cleanedRoomId);
        if (!room) return;

        // Somente membros da sala podem enviar mensagens para ela
        if (!room.members.has(socket.id)) return;

        // Optionally cache state updates to accelerate sync for late-joining players
        if (message.type === 'MAP_UPDATE' && message.payload?.type === 'full_sync' && isPlainObject(message.payload.data)) {
            room.gameState.map = message.payload.data;
        } else if (message.type === 'COMBAT_UPDATE' && isPlainObject(message.payload)) {
            room.gameState.combat = message.payload;
        } else if (message.type === 'CHAT_MESSAGE' && isPlainObject(message.payload)
            && jsonSize(message.payload) <= LIMITS.chatMessageBytes) {
            if (!room.gameState.chatHistory) room.gameState.chatHistory = [];
            room.gameState.chatHistory.push(message.payload);
            if (room.gameState.chatHistory.length > 100) {
                room.gameState.chatHistory.shift();
            }
        }

        // Broadcast to all other peers in the room
        socket.to(cleanedRoomId).emit('peer_message', message);
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

    // 7. DISCONNECT
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

    // If room is empty, clean it up quickly (15 seconds grace period for page reloads)
    if (room.members.size === 0) {
        setTimeout(() => {
            const currentRoom = rooms.get(roomId);
            if (currentRoom && currentRoom.members.size === 0) {
                rooms.delete(roomId);
                console.log(`[Room ${roomId}] Empty room expired and cleaned up.`);
            }
        }, 15 * 1000);
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
