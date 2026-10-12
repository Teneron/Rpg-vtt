// Regression tests for server hardening (Fase 0 of the audit plan).
// Spawns the real server as a child process, fuzzes every socket event with malformed payloads,
// and asserts that the process survives and that authorization rules hold.
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';
import net from 'net';
import { io } from 'socket.io-client';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SERVER_ENTRY = path.join(__dirname, 'server.js');

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const getFreePort = () => new Promise((resolve, reject) => {
    const srv = net.createServer();
    srv.listen(0, () => {
        const { port } = srv.address();
        srv.close(() => resolve(port));
    });
    srv.on('error', reject);
});

let failures = 0;
const check = (cond, label) => {
    if (cond) {
        console.log(`✓ ${label}`);
    } else {
        failures += 1;
        console.error(`✗ ${label}`);
    }
};

const connect = (url) => new Promise((resolve, reject) => {
    const socket = io(url, { reconnection: false, transports: ['websocket'] });
    socket.once('connect', () => resolve(socket));
    socket.once('connect_error', reject);
});

const join = (socket, payload) => new Promise((resolve) => {
    socket.emit('join_room', payload, (res) => resolve(res));
    setTimeout(() => resolve(null), 2000);
});

const collect = (socket, eventName) => {
    const received = [];
    socket.on(eventName, (data) => received.push(data));
    return received;
};

async function main() {
    const port = await getFreePort();
    const url = `http://localhost:${port}`;
    let output = '';

    const child = spawn(process.execPath, [SERVER_ENTRY], {
        env: { ...process.env, PORT: String(port), NODE_ENV: 'production', MAX_MEMBERS_PER_ROOM: '5' },
        stdio: ['ignore', 'pipe', 'pipe']
    });
    child.stdout.on('data', d => { output += d.toString(); });
    child.stderr.on('data', d => { output += d.toString(); });

    let childExited = false;
    child.on('exit', () => { childExited = true; });

    // Wait until the server is listening
    for (let i = 0; i < 50 && !output.includes('listening on port'); i++) await sleep(100);
    check(output.includes('listening on port'), 'Server process started');

    const sockets = [];
    try {
        // --- 1. Malformed payload fuzzing: server must never crash -------------------------
        const fuzzer = await connect(url);
        sockets.push(fuzzer);

        const events = ['join_room', 'peer_message', 'room_broadcast', 'close_room', 'leave_room', 'kick_player'];
        const garbage = [
            [],
            [undefined],
            [null],
            [42],
            ['string'],
            [[]],
            [{}],
            [{ roomId: {} }],
            [{ roomId: ['a'] }],
            [{ roomId: 'x'.repeat(500) }],
            [{ roomId: 'ok-room', message: 'not-an-object' }],
            [{ roomId: 'ok-room', message: { type: 123 } }],
            [{ roomId: 'ok-room', event: 'disconnect', data: {} }],
            [{ roomId: 'ok-room', event: 'connect', data: {} }],
            [{ roomId: 'ok-room', event: 'room_closed', data: {} }],
            [{ roomId: 'ok-room', userId: { $ne: 1 } }],
            [() => {}],
            [{ roomId: 'ok-room', playerName: { a: 1 }, character: 'str', isHost: 'yes' }]
        ];

        for (const eventName of events) {
            for (const args of garbage) {
                fuzzer.emit(eventName, ...args);
            }
        }
        await sleep(500);
        check(!childExited, 'Server survives malformed payloads on every event');
        check(!output.includes('FATAL-GUARD') && !output.includes('TypeError'), 'No unhandled exception leaked from handlers');

        // Ack-based errors must be reported to the caller
        const badAck = await new Promise((resolve) => {
            fuzzer.emit('join_room', undefined, (res) => resolve(res));
            setTimeout(() => resolve(null), 1500);
        });
        check(badAck && badAck.success === false, 'join_room without payload gets an error ack instead of crashing');

        const longRoom = await join(fuzzer, { roomId: 'x'.repeat(200), playerName: 'A', isHost: true, userId: 'u-long' });
        check(longRoom && longRoom.success === false, 'Oversized roomId is rejected');

        // --- 2. room_broadcast authorization -----------------------------------------------
        const host = await connect(url);
        const player = await connect(url);
        const outsider = await connect(url);
        sockets.push(host, player, outsider);

        const hostJoin = await join(host, { roomId: 'harden-room', playerName: 'Mestre', isHost: true, userId: 'host-1' });
        check(hostJoin && hostJoin.success, 'Host creates the room');
        const playerJoin = await join(player, { roomId: 'harden-room', playerName: 'Jogador', isHost: false, userId: 'player-1' });
        check(playerJoin && playerJoin.success, 'Player joins the room');

        const playerRefresh = collect(player, 'force_refresh');
        const playerClosed = collect(player, 'room_closed');
        const playerKicked = collect(player, 'player_kicked');
        const hostRefresh = collect(host, 'force_refresh');

        // Outsider (not a member) tries to spoof control events
        for (const event of ['force_refresh', 'room_closed', 'player_kicked', 'disconnect']) {
            outsider.emit('room_broadcast', { roomId: 'harden-room', event, data: {}, includeSender: true });
        }
        // Non-host member tries the same
        for (const event of ['force_refresh', 'room_closed', 'player_kicked']) {
            player.emit('room_broadcast', { roomId: 'harden-room', event, data: {}, includeSender: false });
            player.emit('room_broadcast', { roomId: 'harden-room', event, data: {}, includeSender: true });
        }
        await sleep(400);
        check(playerRefresh.length === 0 && hostRefresh.length === 0, 'Non-members and non-hosts cannot trigger force_refresh');
        check(playerClosed.length === 0 && playerKicked.length === 0, 'Control events (room_closed/player_kicked) cannot be spoofed via room_broadcast');
        check(!childExited, 'Server still alive after reserved/spoofed broadcast events');

        // Host with a whitelisted event works; non-whitelisted is dropped even for the host
        host.emit('room_broadcast', { roomId: 'harden-room', event: 'room_closed', data: {} });
        host.emit('room_broadcast', { roomId: 'harden-room', event: 'force_refresh', data: {} });
        await sleep(400);
        check(playerRefresh.length === 1, 'Host can broadcast whitelisted force_refresh');
        check(playerClosed.length === 0, 'Even the host cannot broadcast non-whitelisted events');

        // --- 3. peer_message membership ----------------------------------------------------
        const playerMessages = collect(player, 'peer_message');
        outsider.emit('peer_message', { roomId: 'harden-room', message: { type: 'CHAT_MESSAGE', payload: { id: 'spoof', content: 'hi' } } });
        host.emit('peer_message', { roomId: 'harden-room', message: { type: 'CHAT_MESSAGE', payload: { id: 'legit', content: 'hello' } } });
        await sleep(400);
        check(playerMessages.length === 1 && playerMessages[0].payload.id === 'legit', 'Messages from non-members are not relayed');

        // --- 4. Host presence: players cannot join a room whose host is offline -----------
        const lateJoiner = await connect(url);
        sockets.push(lateJoiner);
        host.disconnect();
        await sleep(400);
        const lateRes = await join(lateJoiner, { roomId: 'harden-room', playerName: 'Atrasado', isHost: false, userId: 'late-1' });
        check(lateRes && lateRes.success === false, 'Joining a room with offline host is rejected');

        // --- 5. Room capacity -------------------------------------------------------------
        const host2 = await connect(url);
        sockets.push(host2);
        await join(host2, { roomId: 'cap-room', playerName: 'Mestre2', isHost: true, userId: 'host-cap' });
        let lastRes = null;
        for (let i = 0; i < 6; i++) {
            const s = await connect(url);
            sockets.push(s);
            lastRes = await join(s, { roomId: 'cap-room', playerName: `P${i}`, isHost: false, userId: `cap-p-${i}` });
        }
        check(lastRes && lastRes.success === false, 'Room member limit is enforced (MAX_MEMBERS_PER_ROOM=5)');

        // --- 6. Rate limiting --------------------------------------------------------------
        const flooder = await connect(url);
        sockets.push(flooder);
        for (let i = 0; i < 2000; i++) {
            flooder.emit('peer_message', { roomId: 'cap-room', message: { type: 'EPHEMERAL_GESTURE', payload: {} } });
        }
        await sleep(600);
        check(!childExited, 'Server survives a message flood');
        const healthRes = await fetch(`${url}/health`).then(r => r.json()).catch(() => null);
        check(healthRes && healthRes.status === 'healthy', 'Health endpoint responds after abuse');

        // --- 7. Fase 1: Host authority, hostToken validation, and peer message stamping -----
        const authHost = await connect(url);
        const authPlayer = await connect(url);
        const imposterHost = await connect(url);
        sockets.push(authHost, authPlayer, imposterHost);

        const authHostJoin = await join(authHost, { roomId: 'auth-room', playerName: 'MestreReal', isHost: true, userId: 'real-host-id' });
        check(authHostJoin && authHostJoin.success && typeof authHostJoin.hostToken === 'string', 'Host receives secret hostToken upon room creation');
        const secretToken = authHostJoin?.hostToken;

        const authPlayerJoin = await join(authPlayer, { roomId: 'auth-room', playerName: 'Player1', isHost: false, userId: 'player-id-1' });
        check(authPlayerJoin && authPlayerJoin.success && authPlayerJoin.hostToken === undefined, 'Player does NOT receive hostToken upon joining');

        // Imposter tries to join as host without token
        const imposterNoToken = await join(imposterHost, { roomId: 'auth-room', playerName: 'Imposter', isHost: true, userId: 'imposter-1' });
        check(imposterNoToken && imposterNoToken.success === false, 'Imposter joining as isHost without hostToken is rejected');

        // Imposter tries to join as host with fake token
        const imposterBadToken = await join(imposterHost, { roomId: 'auth-room', playerName: 'Imposter', isHost: true, hostToken: 'invalid-token-1234', userId: 'imposter-1' });
        check(imposterBadToken && imposterBadToken.success === false, 'Imposter joining with invalid hostToken is rejected');

        // Collect messages received by player and host
        const playerPeerMessages = collect(authPlayer, 'peer_message');
        const hostPeerMessages = collect(authHost, 'peer_message');

        // Player tries to send host-only messages (COMBAT_UPDATE, AUDIO_UPDATE)
        authPlayer.emit('peer_message', {
            roomId: 'auth-room',
            message: { type: 'COMBAT_UPDATE', payload: { round: 99, activeIndex: 0 } }
        });
        authPlayer.emit('peer_message', {
            roomId: 'auth-room',
            message: { type: 'AUDIO_UPDATE', payload: { playing: true, track: { title: 'spoofed' } } }
        });
        await sleep(300);
        check(hostPeerMessages.length === 0, 'Host-only messages (COMBAT_UPDATE, AUDIO_UPDATE) from non-host players are dropped by server');

        // Player tries to send PLAYER_UPDATE spoofing another player's peerId
        authPlayer.emit('peer_message', {
            roomId: 'auth-room',
            message: {
                type: 'PLAYER_UPDATE',
                payload: {
                    playerName: 'Fake Victim',
                    peerId: 'another-player-id',
                    character: { id: 'char-victim', name: 'Victim', hp: 0 }
                }
            }
        });
        await sleep(300);
        check(hostPeerMessages.length === 0, 'PLAYER_UPDATE spoofing another peerId is dropped by server');

        // Player sends legit PLAYER_UPDATE for their own peerId
        authPlayer.emit('peer_message', {
            roomId: 'auth-room',
            message: {
                type: 'PLAYER_UPDATE',
                payload: {
                    playerName: 'Player1',
                    peerId: 'player-id-1',
                    character: { id: 'char-1', name: 'Player1 Char', hp: 20 }
                }
            }
        });
        await sleep(300);
        check(
            hostPeerMessages.length === 1 &&
            hostPeerMessages[0].senderUserId === 'player-id-1' &&
            hostPeerMessages[0].senderIsHost === false,
            'Legit PLAYER_UPDATE from player is stamped with senderUserId and senderIsHost=false and relayed'
        );

        // Host sends COMBAT_UPDATE to room
        authHost.emit('peer_message', {
            roomId: 'auth-room',
            message: { type: 'COMBAT_UPDATE', payload: { round: 1, activeIndex: 0 } }
        });
        await sleep(300);
        check(
            playerPeerMessages.length === 1 &&
            playerPeerMessages[0].type === 'COMBAT_UPDATE' &&
            playerPeerMessages[0].senderIsHost === true,
            'COMBAT_UPDATE from host is stamped with senderIsHost=true and relayed to players'
        );

        // Reconnect host using valid hostToken
        const authHostRejoin = await join(authHost, {
            roomId: 'auth-room',
            playerName: 'MestreReal',
            isHost: true,
            hostToken: secretToken,
            userId: 'real-host-id'
        });
        check(authHostRejoin && authHostRejoin.success && authHostRejoin.isHost === true, 'Host can successfully reconnect and retain authority using secret hostToken');
    } finally {
        sockets.forEach(s => { try { s.disconnect(); } catch { /* ignore */ } });
        if (!childExited) child.kill();
    }

    if (failures > 0) {
        console.error(`\n❌ ${failures} HARDENING TEST(S) FAILED`);
        process.exit(1);
    }
    console.log('\n🎉 ALL SERVER HARDENING TESTS PASSED SUCCESSFULLY!');
    process.exit(0);
}

main().catch((err) => {
    console.error('Hardening test crashed:', err);
    process.exit(1);
});
