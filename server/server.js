import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

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

// Health check endpoints
app.get('/', (req, res) => {
    res.json({
        name: 'RPG Tabletop Socket Server',
        status: 'online',
        uptime: process.uptime(),
        activeRooms: rooms.size
    });
});

app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: Date.now(),
        activeRooms: rooms.size
    });
});

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
    socket.on('join_room', ({ roomId, playerName, isHost, character, userId }, callback) => {
        if (!roomId) {
            if (callback) callback({ success: false, error: 'roomId is required' });
            return;
        }

        socket.join(roomId);
        joinedRooms.add(roomId);

        let room = rooms.get(roomId);
        if (!room) {
            room = {
                roomId,
                hostSocketId: isHost ? socket.id : null,
                hostUserId: isHost ? userId : null,
                hostName: isHost ? playerName : null,
                members: new Map(),
                gameState: {
                    map: null,
                    combat: null,
                    chatHistory: []
                }
            };
            rooms.set(roomId, room);
        }

        if (isHost) {
            room.hostSocketId = socket.id;
            room.hostUserId = userId;
            room.hostName = playerName;
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

        console.log(`[Room ${roomId}] ${memberData.playerName} (${memberData.isHost ? 'Host' : 'Player'}) joined. Members: ${room.members.size}`);

        // Broadcast to existing room members
        socket.to(roomId).emit('player_joined', memberData);

        // Prepare existing members array to return to the joined player
        const currentMembers = Array.from(room.members.values());

        const responsePayload = {
            success: true,
            roomId,
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
        if (!roomId || !message) return;

        const room = rooms.get(roomId);
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
        socket.to(roomId).emit('peer_message', message);
    });

    // 3. BROADCAST TO ALL IN ROOM (including sender if requested)
    socket.on('room_broadcast', ({ roomId, event, data, includeSender }) => {
        if (!roomId || !event) return;
        if (includeSender) {
            io.to(roomId).emit(event, data);
        } else {
            socket.to(roomId).emit(event, data);
        }
    });

    // 4. LEAVE ROOM
    socket.on('leave_room', ({ roomId }) => {
        if (!roomId) return;
        handleSocketLeaveRoom(socket, roomId);
    });

    // 5. DISCONNECT
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

    // If room is empty, clean it up after a brief grace period (5 minutes)
    if (room.members.size === 0) {
        setTimeout(() => {
            const currentRoom = rooms.get(roomId);
            if (currentRoom && currentRoom.members.size === 0) {
                rooms.delete(roomId);
                console.log(`[Room ${roomId}] Expired and cleaned up.`);
            }
        }, 5 * 60 * 1000);
    }
}

// Start server listening
if (process.env.NODE_ENV !== 'test') {
    server.listen(PORT, () => {
        console.log(`===============================================`);
        console.log(`🚀 RPG Tabletop Server listening on port ${PORT}`);
        console.log(`📡 WebSocket ready for connections`);
        console.log(`===============================================`);
    });
}

export { app, server, io, rooms };
