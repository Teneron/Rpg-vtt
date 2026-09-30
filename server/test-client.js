import { io } from 'socket.io-client';
import { server } from './server.js';

const TEST_PORT = process.env.PORT || 3001;
const SERVER_URL = `http://localhost:${TEST_PORT}`;

console.log(`Starting/verifying test server on ${SERVER_URL}...`);

async function runTests() {
    // If not already listening, start server on TEST_PORT
    if (!server.listening) {
        await new Promise((resolve) => server.listen(TEST_PORT, resolve));
        console.log(`✓ Test server started on port ${TEST_PORT}`);
    }

    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            reject(new Error('Test timed out after 10 seconds'));
        }, 10000);

        const host = io(SERVER_URL, { reconnection: false });
        const player = io(SERVER_URL, { reconnection: false });

        let hostJoined = false;
        let playerJoined = false;
        let messageReceived = false;

        host.on('connect', () => {
            console.log('✓ Host connected to server');
            host.emit('join_room', {
                roomId: 'test-room-1',
                playerName: 'Mestre Teste',
                isHost: true,
                userId: 'host-user-1'
            }, (response) => {
                if (response.success && response.isHost) {
                    console.log('✓ Host created and joined room successfully');
                    hostJoined = true;
                    // Connect player now that room exists
                    connectPlayer();
                } else {
                    reject(new Error('Host failed to join room'));
                }
            });
        });

        function connectPlayer() {
            player.emit('join_room', {
                roomId: 'test-room-1',
                playerName: 'Geralt de Rivia',
                isHost: false,
                userId: 'player-user-2'
            }, (response) => {
                if (response.success && !response.isHost && response.members.length === 2) {
                    console.log('✓ Player joined room successfully and sees 2 members');
                    playerJoined = true;

                    // Send test peer_message from Host to Player
                    const testMessage = {
                        type: 'ROLL_RESULT',
                        payload: {
                            playerName: 'Mestre Teste',
                            roll: { formula: '1d20+5', total: 25, isCrit: true }
                        }
                    };

                    console.log('✓ Host broadcasting ROLL_RESULT event...');
                    host.emit('peer_message', {
                        roomId: 'test-room-1',
                        message: testMessage
                    });
                } else {
                    reject(new Error('Player failed to join room or see members'));
                }
            });
        }

        player.on('peer_message', (msg) => {
            if (msg.type === 'ROLL_RESULT' && msg.payload.roll.total === 25) {
                console.log('✓ Player received broadcasted ROLL_RESULT peer_message perfectly!');
                messageReceived = true;

                // Test player disconnect notification to host
                player.disconnect();
            }
        });

        host.on('player_left', (data) => {
            if (data.playerName === 'Geralt de Rivia') {
                console.log('✓ Host received player_left notification on disconnect');
                clearTimeout(timeout);
                host.disconnect();
                server.close(() => {
                    resolve();
                });
            }
        });

        host.on('connect_error', (err) => reject(new Error(`Host connection error: ${err.message}`)));
        player.on('connect_error', (err) => reject(new Error(`Player connection error: ${err.message}`)));
    });
}

runTests()
    .then(() => {
        console.log('\n🎉 ALL TESTS PASSED SUCCESSFULLY! Socket.io server is fully operational.');
        process.exit(0);
    })
    .catch((err) => {
        console.error('\n❌ TEST FAILED:', err.message);
        try { server.close(); } catch (e) {}
        process.exit(1);
    });
