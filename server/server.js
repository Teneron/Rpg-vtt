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

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

// In-memory rooms repository:
// roomId -> {
//   hostSocketId: string,
//   hostUserId: string,
//   members: Map<string, { socketId: string, userId: string, playerName: string, isHost: boolean, character: any }>,
//   gameState: {
//     map: any,
//     combat: any,
//     chatHistory: any[]
//   }
// }
const rooms = new Map();

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
    app.get('*', (req, res, next) => {
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
        origin: '*',
        methods: ['GET', 'POST']
    },
    maxHttpBufferSize: 1e7 // 10MB for map images / rich sync payloads
});

io.on('connection', (socket) => {
    console.log(`[Socket] Client connected: ${socket.id}`);

    // Track rooms this socket is currently in for cleanup on disconnect
    const joinedRooms = new Set();

    // 1. JOIN ROOM
    socket.on('join_room', ({ roomId, playerName, isHost, character, userId, system }, callback) => {
        const cleanRoomId = roomId ? String(roomId).trim() : '';
        if (!cleanRoomId) {
            if (callback) callback({ success: false, error: 'roomId is required' });
            return;
        }

        let room = rooms.get(cleanRoomId);
        if (!room) {
            if (!isHost) {
                console.log(`[Socket] Player ${playerName || socket.id} attempted to join non-existent room: ${cleanRoomId}`);
                if (callback) callback({ success: false, error: 'A sala informada não existe ou o Mestre ainda não abriu a mesa. Verifique o código digitado!' });
                return;
            }
            room = {
                roomId: cleanRoomId,
                system: system || (cleanRoomId.toUpperCase().startsWith('WTC') ? 'witcher' : 'dnd55e'),
                hostSocketId: socket.id,
                hostUserId: userId || null,
                hostName: playerName || 'Mestre',
                members: new Map(),
                gameState: {
                    map: null,
                    combat: null,
                    chatHistory: []
                }
            };
            rooms.set(cleanRoomId, room);
        } else {
            if (!isHost && !room.hostSocketId) {
                console.log(`[Socket] Player ${playerName || socket.id} attempted to join room with offline host: ${cleanRoomId}`);
                if (callback) callback({ success: false, error: 'O Mestre desta mesa está desconectado no momento.' });
                return;
            }
        }

        socket.join(cleanRoomId);
        joinedRooms.add(cleanRoomId);

        if (isHost) {
            room.hostSocketId = socket.id;
            room.hostUserId = userId;
            room.hostName = playerName;
            if (system) room.system = system;
        }

        // Clean up any stale socket entries for the same userId in this room
        if (userId) {
            for (const [existingSocketId, existingMember] of room.members.entries()) {
                if (existingMember.userId === userId && existingSocketId !== socket.id) {
                    console.log(`[Room ${cleanRoomId}] Pruning stale socket ${existingSocketId} for user ${userId}`);
                    room.members.delete(existingSocketId);
                }
            }
        }

        const memberData = {
            socketId: socket.id,
            userId: userId || socket.id,
            playerName: playerName || (isHost ? 'Mestre' : 'Jogador'),
            isHost: !!isHost,
            character: character || null,
            isOnline: true
        };

        room.members.set(socket.id, memberData);

        console.log(`[Room ${cleanRoomId}] [System: ${room.system}] ${memberData.playerName} (${memberData.isHost ? 'Host' : 'Player'}) joined. Members: ${room.members.size}`);

        // Broadcast to existing room members
        socket.to(cleanRoomId).emit('player_joined', memberData);

        // Prepare existing members array to return to the joined player
        const currentMembers = Array.from(room.members.values());

        const responsePayload = {
            success: true,
            roomId: cleanRoomId,
            system: room.system,
            isHost: !!isHost,
            hostName: room.hostName,
            members: currentMembers,
            gameState: room.gameState
        };

        if (callback) callback(responsePayload);
        socket.emit('room_state', responsePayload);
    });

    // 2. PEER MESSAGE RELAY (Matches PeerMessage protocol)
    socket.on('peer_message', ({ roomId, message }) => {
        const cleanRoomId = roomId ? String(roomId).trim() : '';
        if (!cleanRoomId || !message) return;

        const room = rooms.get(cleanRoomId);
        if (!room) return;

        // Optionally cache state updates to accelerate sync for late-joining players
        if (message.type === 'MAP_UPDATE' && message.payload?.type === 'full_sync') {
            room.gameState.map = message.payload.data;
        } else if (message.type === 'COMBAT_UPDATE') {
            room.gameState.combat = message.payload;
        } else if (message.type === 'CHAT_MESSAGE') {
            if (!room.gameState.chatHistory) room.gameState.chatHistory = [];
            room.gameState.chatHistory.push(message.payload);
            if (room.gameState.chatHistory.length > 100) {
                room.gameState.chatHistory.shift();
            }
        }

        // Broadcast to all other peers in the room
        socket.to(cleanRoomId).emit('peer_message', message);
    });

    // 3. BROADCAST TO ALL IN ROOM (including sender if requested)
    socket.on('room_broadcast', ({ roomId, event, data, includeSender }) => {
        const cleanRoomId = roomId ? String(roomId).trim() : '';
        if (!cleanRoomId || !event) return;
        if (includeSender) {
            io.to(cleanRoomId).emit(event, data);
        } else {
            socket.to(cleanRoomId).emit(event, data);
        }
    });

    // 4. CLOSE ROOM (Explicitly by Host)
    socket.on('close_room', ({ roomId }) => {
        const cleanRoomId = roomId ? String(roomId).trim() : '';
        if (!cleanRoomId) return;
        const room = rooms.get(cleanRoomId);
        if (!room) return;

        const sender = room.members.get(socket.id);
        const isHost = sender?.isHost || room.hostSocketId === socket.id;

        if (isHost) {
            console.log(`[Room ${cleanRoomId}] Room closed by Host (${socket.id}). Notifying all players.`);
            io.to(cleanRoomId).emit('room_closed', {
                roomId: cleanRoomId,
                reason: 'A mesa foi encerrada pelo Mestre.'
            });
            io.in(cleanRoomId).socketsLeave(cleanRoomId);
            rooms.delete(cleanRoomId);
            joinedRooms.delete(cleanRoomId);
        }
    });

    // 5. LEAVE ROOM
    socket.on('leave_room', ({ roomId, closeRoom }) => {
        const cleanRoomId = roomId ? String(roomId).trim() : '';
        if (!cleanRoomId) return;

        const room = rooms.get(cleanRoomId);
        const sender = room?.members.get(socket.id);
        const isHost = sender?.isHost || room?.hostSocketId === socket.id;

        if (isHost && closeRoom) {
            console.log(`[Room ${cleanRoomId}] Host left with closeRoom flag. Terminating room.`);
            io.to(cleanRoomId).emit('room_closed', {
                roomId: cleanRoomId,
                reason: 'A mesa foi encerrada pelo Mestre.'
            });
            io.in(cleanRoomId).socketsLeave(cleanRoomId);
            rooms.delete(cleanRoomId);
            joinedRooms.delete(cleanRoomId);
            return;
        }

        socket.leave(cleanRoomId);
        joinedRooms.delete(cleanRoomId);
        handleSocketLeaveRoom(socket, cleanRoomId);
    });

    // 6. KICK / REMOVE PLAYER (Host Only)
    socket.on('kick_player', ({ roomId, userId }) => {
        const cleanRoomId = roomId ? String(roomId).trim() : '';
        if (!cleanRoomId || !userId) return;
        const room = rooms.get(cleanRoomId);
        if (!room) return;

        const sender = room.members.get(socket.id);
        const isHost = sender?.isHost || room.hostSocketId === socket.id;
        if (!isHost) return;

        for (const [memberSocketId, member] of room.members.entries()) {
            if (member.userId === userId) {
                console.log(`[Room ${cleanRoomId}] Host kicked player: ${member.playerName} (${userId})`);
                const targetSocket = io.sockets.sockets.get(memberSocketId);
                if (targetSocket) {
                    targetSocket.emit('player_kicked', {
                        reason: 'Voce foi removido da mesa pelo Mestre.'
                    });
                    targetSocket.leave(cleanRoomId);
                }
                room.members.delete(memberSocketId);
                socket.to(cleanRoomId).emit('player_left', {
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
            handleSocketLeaveRoom(socket, roomId);
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
