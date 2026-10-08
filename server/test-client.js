import { io } from 'socket.io-client';
import { server, io as serverIo } from './server.js';

const TEST_PORT = process.env.PORT || 3001;
const SERVER_URL = `http://localhost:${TEST_PORT}`;

console.log(`Starting/verifying test server on ${SERVER_URL}...`);

async function runTests() {
    // If not already listening, start server on TEST_PORT
    if (!server.listening) {
        await new Promise((resolve) => {
            const onError = (err) => {
                if (err.code === 'EADDRINUSE') {
                    resolve();
                }
            };
            server.once('error', onError);
            server.listen(TEST_PORT, () => {
                server.removeListener('error', onError);
                resolve();
            });
        });
        console.log(`✓ Test server ready on port ${TEST_PORT}`);
    }

    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            reject(new Error('Test timed out after 15 seconds'));
        }, 15000);

        const host = io(SERVER_URL, { reconnection: false });
        const player1 = io(SERVER_URL, { reconnection: false });
        let player2 = null;
        let player2Reconnected = null;

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
                    step1_connectPlayer1();
                } else {
                    reject(new Error('Host failed to join room'));
                }
            });
        });

        // Step 1: Connect Player 1
        function step1_connectPlayer1() {
            player1.emit('join_room', {
                roomId: 'test-room-1',
                playerName: 'Geralt de Rivia',
                isHost: false,
                userId: 'player-user-1',
                character: { id: 'char-1', name: 'Geralt', hp: 35 }
            }, (response) => {
                if (response.success && !response.isHost && response.members.length === 2) {
                    console.log('✓ Player 1 joined room and sees 2 members');
                    step2_testRollAndCombatSync();
                } else {
                    reject(new Error('Player 1 failed to join room'));
                }
            });
        }

        // Step 2: Test ROLL_RESULT and COMBAT_UPDATE sync
        function step2_testRollAndCombatSync() {
            // Host sends COMBAT_UPDATE
            host.emit('peer_message', {
                roomId: 'test-room-1',
                message: {
                    type: 'COMBAT_UPDATE',
                    payload: { round: 2, combatants: [{ id: 'char-1', initiative: 18 }] }
                }
            });

            // Player 1 sends ROLL_RESULT
            player1.emit('peer_message', {
                roomId: 'test-room-1',
                message: {
                    type: 'ROLL_RESULT',
                    payload: {
                        playerName: 'Geralt de Rivia',
                        roll: { formula: '1d20+3', total: 20 }
                    }
                }
            });
        }

        let hostReceivedRoll = false;
        let player1ReceivedCombat = false;

        host.on('peer_message', (msg) => {
            if (msg.type === 'ROLL_RESULT' && msg.payload.roll.total === 20) {
                console.log('✓ Host received ROLL_RESULT from Player 1 perfectly');
                hostReceivedRoll = true;
                checkStep2Complete();
            }
        });

        player1.on('peer_message', (msg) => {
            if (msg.type === 'COMBAT_UPDATE' && msg.payload.round === 2) {
                console.log('✓ Player 1 received COMBAT_UPDATE from Host');
                player1ReceivedCombat = true;
                checkStep2Complete();
            } else if (msg.type === 'PLAYER_UPDATE' && msg.payload.character?.hp === 40) {
                console.log('✓ Player 1 received remote PLAYER_UPDATE (DM sheet edit) with HP 40');
                step4_testLateJoinerStateDelivery();
            }
        });

        function checkStep2Complete() {
            if (hostReceivedRoll && player1ReceivedCombat) {
                step3_testPlayerUpdate();
            }
        }

        // Step 3: Host edits Player 1 character (PLAYER_UPDATE)
        function step3_testPlayerUpdate() {
            console.log('✓ Testing DM editing Player 1 character via PLAYER_UPDATE...');
            host.emit('peer_message', {
                roomId: 'test-room-1',
                message: {
                    type: 'PLAYER_UPDATE',
                    payload: {
                        playerName: 'Geralt',
                        character: { id: 'char-1', name: 'Geralt', hp: 40 },
                        peerId: 'player-user-1'
                    }
                }
            });
        }

        // Step 4: Late joiner receives cached gameState
        function step4_testLateJoinerStateDelivery() {
            console.log('✓ Connecting Player 2 to verify initial gameState delivery...');
            player2 = io(SERVER_URL, { reconnection: false });

            player2.on('connect', () => {
                player2.emit('join_room', {
                    roomId: 'test-room-1',
                    playerName: 'Dandelion',
                    isHost: false,
                    userId: 'player-user-2'
                }, (response) => {
                    if (response.success && response.gameState?.combat?.round === 2) {
                        console.log('✓ Player 2 received cached gameState with active combat state (Round 2)');
                        step5_testReconnection();
                    } else {
                        reject(new Error('Player 2 did not receive cached combat gameState'));
                    }
                });
            });
        }

        // Step 5: Test reconnection preservation
        function step5_testReconnection() {
            console.log('✓ Testing Player 2 disconnect and reconnect...');
            player2.disconnect();

            host.once('player_left', (data) => {
                if (data.userId === 'player-user-2') {
                    console.log('✓ Host recognized Player 2 disconnect');

                    // Now reconnect Player 2
                    player2Reconnected = io(SERVER_URL, { reconnection: false });
                    player2Reconnected.on('connect', () => {
                        player2Reconnected.emit('join_room', {
                            roomId: 'test-room-1',
                            playerName: 'Dandelion',
                            isHost: false,
                            userId: 'player-user-2'
                        }, (reconnectRes) => {
                            if (reconnectRes.success) {
                                console.log('✓ Player 2 successfully re-joined room after reconnect');
                                finishAll();
                            } else {
                                reject(new Error('Player 2 failed to re-join on reconnect'));
                            }
                        });
                    });
                }
            });
        }

        function finishAll() {
            clearTimeout(timeout);
            try { if (host) host.disconnect(); } catch (e) {}
            try { if (player1) player1.disconnect(); } catch (e) {}
            try { if (player2) player2.disconnect(); } catch (e) {}
            try { if (player2Reconnected) player2Reconnected.disconnect(); } catch (e) {}
            try { if (serverIo) serverIo.close(); } catch (e) {}
            server.close(() => {
                resolve();
            });
            setTimeout(() => resolve(), 500);
        }

        host.on('connect_error', (err) => reject(new Error(`Host connection error: ${err.message}`)));
        player1.on('connect_error', (err) => reject(new Error(`Player1 connection error: ${err.message}`)));
    });
}

runTests()
    .then(() => {
        console.log('\n🎉 ALL MULTIPLAYER & BUS INTEGRATION TESTS PASSED SUCCESSFULLY!');
        process.exit(0);
    })
    .catch((err) => {
        console.error('\n❌ TEST FAILED:', err.message);
        try { server.close(); } catch (e) {}
        process.exit(1);
    });
