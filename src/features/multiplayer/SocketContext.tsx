import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import type { Character } from '../character/characterTypes';

export type PeerMessage =
    | { type: 'JOIN_REQUEST'; payload: { name: string } }
    | { type: 'JOIN_RESPONSE'; payload: { success: boolean; error?: string; hostName?: string; adventureId?: string; adventureName?: string } }
    | { type: 'ROLL_RESULT'; payload: { playerName: string; roll: any } }
    | { type: 'CHAT'; payload: { sender: string; text: string } }
    | { type: 'CHAT_MESSAGE'; payload: any }
    | { type: 'WELCOME'; payload: { hostName: string } }
    | { type: 'MAP_UPDATE'; payload: { type: 'move' | 'add' | 'remove' | 'config' | 'update_token' | 'full_sync' | 'add_wall' | 'update_wall' | 'remove_wall'; data: any } }
    | { type: 'PLAYER_UPDATE'; payload: { playerName: string; character: Character; peerId: string } }
    | { type: 'EPHEMERAL_GESTURE'; payload: { type: 'stroke' | 'stream_points'; points: any[]; color: string; id?: string } }
    | { type: 'COMBAT_UPDATE'; payload: any }
    | { type: 'COMBAT_ACTION'; payload: { action: string; combatantId?: string; value?: any } }
    | { type: 'SYNC_REQUEST'; payload: { target: 'MAP' | 'PLAYERS' } }
    | { type: 'AUDIO_UPDATE'; payload: { track: any; playing: boolean } }
    | { type: 'SFX_TRIGGER'; payload: { track: any } };

export interface MultiplayerContextState {
    peerId: string | null;
    isHost: boolean;
    connections: any[];
    hostConnection: any | null;
    connectToHost: (hostId: string, playerName: string) => void;
    startHosting: (hostName: string, adventureId?: string, adventureName?: string, system?: string) => void;
    broadcast: (msg: PeerMessage) => void;
    username: string;
    isConnected: boolean;
    peerError: string | null;
    currentAdventureId: string | null;
    currentAdventureName: string | null;
    roomSystem: string;
    hostAdventureId: (id: string) => void;
    connectedPlayersData: Record<string, { name: string; character: Character; peerId: string; isOnline?: boolean; isHost?: boolean }>;
    broadcastCharacterUpdate: (character: Character) => void;
    isConnecting: boolean;
    myCharacter: Character | null;
    updateMyCharacter: (character: Character) => void;
    disconnect: () => void;
    closeRoom: () => void;
    updateRemotePlayerCharacter: (targetPeerId: string, character: Character) => void;
    removePlayer: (targetPeerId: string) => Promise<void>;
    triggerForceRefresh: () => Promise<void>;
    myId: string | null;
    myName: string;
    onMessage: (callback: (data: PeerMessage) => void) => () => void;
    serverUrl: string;
    setServerUrl: (url: string) => void;
}

const MultiplayerContext = createContext<MultiplayerContextState | undefined>(undefined);

export const useMultiplayer = () => {
    const context = useContext(MultiplayerContext);
    if (!context) {
        throw new Error('useMultiplayer must be used within a MultiplayerProvider');
    }
    return context;
};

export const usePeer = useMultiplayer;

const getMyId = () => {
    let id = localStorage.getItem('rpg_my_id');
    if (!id) {
        id = crypto.randomUUID();
        localStorage.setItem('rpg_my_id', id);
    }
    return id;
};

const getDefaultServerUrl = () => {
    if (import.meta.env.VITE_SOCKET_SERVER_URL) {
        return import.meta.env.VITE_SOCKET_SERVER_URL;
    }
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    return isLocalhost ? 'http://localhost:3001' : window.location.origin;
};

export const MultiplayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [myId] = useState(getMyId());
    const [username, setUsername] = useState('');
    const [isHost, setIsHost] = useState(false);
    const [currentAdventureId, setCurrentAdventureId] = useState<string | null>(null);
    const [currentAdventureName, setCurrentAdventureName] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [peerError, setPeerError] = useState<string | null>(null);
    const [connectedPlayersData, setConnectedPlayersData] = useState<Record<string, { name: string; character: Character; peerId: string; isOnline?: boolean; isHost?: boolean }>>({});
    const [myCharacter, setMyCharacter] = useState<Character | null>(null);
    const [roomSystem, setRoomSystem] = useState<string>(() => {
        try {
            const saved = localStorage.getItem('rpg_session');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed.system) return parsed.system;
                if (parsed.adventureId?.toUpperCase().startsWith('WTC')) return 'witcher';
            }
        } catch (e) {}
        return 'dnd55e';
    });
    const [serverUrl, setServerUrl] = useState<string>(() => {
        return localStorage.getItem('rpg_server_url') || getDefaultServerUrl();
    });

    const socketRef = useRef<Socket | null>(null);
    const myCharacterRef = useRef<Character | null>(null);
    useEffect(() => { myCharacterRef.current = myCharacter; }, [myCharacter]);

    const usernameRef = useRef(username);
    useEffect(() => { usernameRef.current = username; }, [username]);

    const isHostRef = useRef(isHost);
    useEffect(() => { isHostRef.current = isHost; }, [isHost]);

    const currentAdventureIdRef = useRef(currentAdventureId);
    useEffect(() => { currentAdventureIdRef.current = currentAdventureId; }, [currentAdventureId]);

    const messageListenersRef = useRef<Set<(data: PeerMessage) => void>>(new Set());

    const connections = Object.values(connectedPlayersData)
        .filter(p => p.isOnline && p.peerId !== myId)
        .map(p => ({
            peer: p.peerId,
            metadata: { name: p.name }
        }));

    const hostConnection = !isHost && isConnected ? { open: true } : null;

    // Dispatch message locally to both the CustomEvent DOM bus and registered onMessage callbacks
    const dispatchPeerMessageLocally = useCallback((msg: PeerMessage) => {
        window.dispatchEvent(new CustomEvent('rpg_peer_event', { detail: msg }));
        messageListenersRef.current.forEach(callback => {
            try {
                callback(msg);
            } catch (e) {
                console.error('[Socket] Error in onMessage listener:', e);
            }
        });
    }, []);

    // Apply remote game state (map, combat, chat history) to local contexts
    const applyGameState = useCallback((gameState: any) => {
        if (!gameState) return;

        if (gameState.map) {
            console.log('[Socket] Applying initial map gameState');
            dispatchPeerMessageLocally({
                type: 'MAP_UPDATE',
                payload: { type: 'full_sync', data: gameState.map }
            });
        }

        if (gameState.combat) {
            console.log('[Socket] Applying initial combat gameState');
            dispatchPeerMessageLocally({
                type: 'COMBAT_UPDATE',
                payload: gameState.combat
            });
        }

        if (Array.isArray(gameState.chatHistory) && gameState.chatHistory.length > 0) {
            console.log('[Socket] Applying initial chat history:', gameState.chatHistory.length, 'messages');
            gameState.chatHistory.forEach((chatMsg: any) => {
                dispatchPeerMessageLocally({
                    type: 'CHAT_MESSAGE',
                    payload: chatMsg
                });
            });
        }
    }, [dispatchPeerMessageLocally]);

    // Handle full room state update (members + gameState)
    const handleRoomState = useCallback((state: any) => {
        if (!state) return;

        if (state.members && Array.isArray(state.members)) {
            const mapped: Record<string, any> = {};
            state.members.forEach((m: any) => {
                mapped[m.userId] = {
                    name: m.playerName,
                    character: m.character,
                    peerId: m.userId,
                    isOnline: m.isOnline,
                    isHost: !!m.isHost
                };
            });
            setConnectedPlayersData(mapped);

            if (mapped[myId]?.character && !myCharacterRef.current) {
                setMyCharacter(mapped[myId].character);
            }
        }

        if (state.system) {
            console.log('[Socket] Setting roomSystem from server state:', state.system);
            setRoomSystem(state.system);
        }

        if (state.gameState) {
            applyGameState(state.gameState);
        }
    }, [myId, applyGameState]);

    // Disconnect cleanup on unmount
    useEffect(() => {
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, []);

    const initSocket = useCallback((url: string): Socket => {
        if (socketRef.current) {
            if (socketRef.current.connected) {
                return socketRef.current;
            }
            socketRef.current.connect();
            return socketRef.current;
        }

        const socket = io(url, {
            transports: ['websocket', 'polling'],
            reconnectionAttempts: 10,
            reconnectionDelay: 1000,
            timeout: 10000
        });

        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('[Socket] Connected to server:', url, 'Socket ID:', socket.id);
            setPeerError(null);

            // Transparent re-join if reconnecting with an existing room session
            const activeRoomId = currentAdventureIdRef.current;
            const activeUsername = usernameRef.current;
            if (activeRoomId && activeUsername) {
                console.log('[Socket] Re-joining room after reconnect:', activeRoomId);
                socket.emit('join_room', {
                    roomId: activeRoomId,
                    playerName: activeUsername,
                    isHost: isHostRef.current,
                    character: myCharacterRef.current,
                    userId: myId
                }, (response: any) => {
                    if (response?.success) {
                        setIsConnected(true);
                        setIsConnecting(false);
                        handleRoomState(response);
                        console.log('[Socket] Successfully rejoined room after reconnect:', activeRoomId);
                    } else {
                        console.warn('[Socket] Reconnect join_room failed:', response?.error);
                    }
                });
            }
        });

        socket.on('connect_error', (err) => {
            console.error('[Socket] Connection error:', err.message);
            setPeerError(`Erro ao conectar ao servidor (${url}): ${err.message}`);
            setIsConnecting(false);
        });

        socket.on('disconnect', (reason) => {
            console.log('[Socket] Disconnected from server:', reason);
            setIsConnected(false);
            if (reason === 'io server disconnect') {
                setPeerError('Desconectado pelo servidor.');
            }
        });

        socket.on('player_joined', (member) => {
            console.log('[Socket] Player joined:', member.playerName);
            setConnectedPlayersData(prev => ({
                ...prev,
                [member.userId]: {
                    name: member.playerName,
                    character: member.character,
                    peerId: member.userId,
                    isOnline: true,
                    isHost: !!member.isHost
                }
            }));
        });

        socket.on('player_left', (data) => {
            console.log('[Socket] Player left:', data.playerName);
            setConnectedPlayersData(prev => {
                const next = { ...prev };
                if (next[data.userId]) {
                    if (!next[data.userId].character) {
                        delete next[data.userId];
                    } else {
                        next[data.userId] = { ...next[data.userId], isOnline: false };
                    }
                }
                return next;
            });
        });

        socket.on('room_state', (state) => {
            handleRoomState(state);
        });

        socket.on('peer_message', (msg: PeerMessage) => {
            dispatchPeerMessageLocally(msg);

            // Handle PLAYER_UPDATE: update connectedPlayersData and local myCharacter if targeted
            if (msg.type === 'PLAYER_UPDATE') {
                const targetPeerId = msg.payload.peerId;

                // 1. Update list of player data for GM and peers
                setConnectedPlayersData(prev => {
                    const existing = prev[targetPeerId];
                    if (existing) {
                        return {
                            ...prev,
                            [targetPeerId]: {
                                ...existing,
                                character: msg.payload.character,
                                name: msg.payload.playerName || existing.name
                            }
                        };
                    }
                    return prev;
                });

                // 2. Update myCharacter if this update was aimed at me (e.g. GM updated player sheet)
                const isForMe = targetPeerId === myId || (myCharacterRef.current && msg.payload.character?.id === myCharacterRef.current.id);
                if (isForMe && msg.payload.character) {
                    console.log('[Socket] Updating local character from remote PLAYER_UPDATE:', msg.payload.character.name);
                    setMyCharacter(msg.payload.character);
                    import('../character/characterRepository').then(({ CharacterRepository }) => {
                        CharacterRepository.save(msg.payload.character);
                    }).catch(e => console.error('[Socket] Error saving remote character update:', e));
                }
            }
        });

        socket.on('player_kicked', (data: { reason?: string }) => {
            console.log('[Socket] Player was removed from room:', data);
            alert(data?.reason || 'Você foi removido da mesa pelo Mestre.');
            setIsConnected(false);
            setIsConnecting(false);
            setCurrentAdventureId(null);
            setConnectedPlayersData({});
            localStorage.removeItem('rpg_session');
            sessionStorage.removeItem('rpg_game_started');
            window.location.reload();
        });

        socket.on('force_refresh', () => {
            alert('O Mestre solicitou recarregamento da versão do jogo.');
            window.location.reload();
        });

        socket.on('room_closed', (data: { roomId: string; reason?: string }) => {
            console.log('[Socket] Room closed event received from server:', data);
            setIsConnected(false);
            setIsConnecting(false);
            setCurrentAdventureId(null);
            setConnectedPlayersData({});
            localStorage.removeItem('rpg_session');
            sessionStorage.removeItem('rpg_game_started');
            window.dispatchEvent(new CustomEvent('rpg_room_closed', { detail: data }));
        });

        return socket;
    }, [myId, handleRoomState, dispatchPeerMessageLocally]);

    // Listen to local 3D and combat dice rolls and broadcast ROLL_RESULT to all peers
    useEffect(() => {
        const handleBroadcastRoll = (event: Event) => {
            const customEvent = event as CustomEvent;
            const rollData = customEvent.detail;
            if (!rollData) return;

            const senderName = usernameRef.current || myCharacterRef.current?.name || 'Jogador';
            console.log('[Socket] Broadcasting roll to peers:', senderName, rollData);

            const roomId = currentAdventureIdRef.current;
            if (roomId && socketRef.current) {
                socketRef.current.emit('peer_message', {
                    roomId,
                    message: {
                        type: 'ROLL_RESULT',
                        payload: {
                            playerName: senderName,
                            roll: rollData
                        }
                    }
                });
            }
        };

        window.addEventListener('rpg_broadcast_roll', handleBroadcastRoll);
        return () => window.removeEventListener('rpg_broadcast_roll', handleBroadcastRoll);
    }, []);

    // Session auto-recovery on mount
    useEffect(() => {
        const savedSession = localStorage.getItem('rpg_session');
        if (!savedSession) return;

        try {
            const session = JSON.parse(savedSession);
            if (session?.adventureId && session?.username) {
                console.log('[Socket] Restoring session from localStorage:', session);
                setUsername(session.username);
                setIsHost(!!session.isHost);
                setCurrentAdventureId(session.adventureId);
                setCurrentAdventureName(session.adventureName || null);
                if (session.system) {
                    setRoomSystem(session.system);
                } else if (session.adventureId?.toUpperCase().startsWith('WTC')) {
                    setRoomSystem('witcher');
                }
                setIsConnecting(true);

                const socket = initSocket(serverUrl);
                socket.emit('join_room', {
                    roomId: session.adventureId,
                    playerName: session.username,
                    isHost: !!session.isHost,
                    character: null,
                    userId: myId,
                    system: session.system || (session.adventureId?.toUpperCase().startsWith('WTC') ? 'witcher' : 'dnd55e')
                }, (response: any) => {
                    setIsConnecting(false);
                    if (response?.success) {
                        setIsConnected(true);
                        if (response.system) setRoomSystem(response.system);
                        handleRoomState(response);
                        console.log('[Socket] Session restored successfully for room:', session.adventureId);
                    } else {
                        console.warn('[Socket] Session recovery failed on server:', response?.error);
                        localStorage.removeItem('rpg_session');
                        setIsConnected(false);
                    }
                });
            }
        } catch (e) {
            console.error('[Socket] Failed to parse saved session:', e);
            localStorage.removeItem('rpg_session');
        }
    }, [myId, serverUrl, initSocket, handleRoomState]);

    const startHosting = async (hostName: string, _initialAdventureId = 'default', initialAdventureName = 'Aventura Padrão', system = 'dnd55e') => {
        setIsConnecting(true);
        setPeerError(null);

        const roomId = (_initialAdventureId && _initialAdventureId !== 'default') ? _initialAdventureId : myId;
        setUsername(hostName);
        setIsHost(true);
        setCurrentAdventureId(roomId);
        setCurrentAdventureName(initialAdventureName);
        setRoomSystem(system);

        try {
            const socket = initSocket(serverUrl);
            socket.emit('join_room', {
                roomId,
                playerName: hostName,
                isHost: true,
                character: null,
                userId: myId,
                system
            }, (response: any) => {
                setIsConnecting(false);
                if (response?.success) {
                    setIsConnected(true);
                    if (response.system) setRoomSystem(response.system);
                    handleRoomState(response);
                    console.log('[Socket] Hosting room successfully:', roomId, 'System:', system);
                    localStorage.setItem('rpg_session', JSON.stringify({
                        adventureId: roomId,
                        username: hostName,
                        isHost: true,
                        adventureName: initialAdventureName,
                        system
                    }));
                } else {
                    setPeerError(response?.error || 'Erro ao criar sala no servidor.');
                }
            });
        } catch (err: any) {
            console.error('[Socket] Start hosting error:', err);
            setPeerError(err.message || 'Erro ao conectar ao servidor.');
            setIsConnecting(false);
        }
    };

    const connectToHost = async (targetId: string, playerName: string) => {
        setIsConnecting(true);
        setPeerError(null);

        const cleanTargetId = targetId.trim().toUpperCase();
        const derivedSystem = cleanTargetId.startsWith('WTC') ? 'witcher' : 'dnd55e';
        setRoomSystem(derivedSystem);

        setUsername(playerName);
        setIsHost(false);
        setCurrentAdventureId(cleanTargetId);

        try {
            const socket = initSocket(serverUrl);
            socket.emit('join_room', {
                roomId: cleanTargetId,
                playerName,
                isHost: false,
                character: myCharacterRef.current,
                userId: myId,
                system: derivedSystem
            }, (response: any) => {
                setIsConnecting(false);
                if (response?.success) {
                    setIsConnected(true);
                    const finalSystem = response.system || derivedSystem;
                    setRoomSystem(finalSystem);
                    handleRoomState(response);
                    setCurrentAdventureName(response.hostName ? `Mesa de ${response.hostName}` : 'Aventura');
                    console.log('[Socket] Connected to host room successfully:', cleanTargetId, 'System:', finalSystem);
                    localStorage.setItem('rpg_session', JSON.stringify({
                        adventureId: cleanTargetId,
                        username: playerName,
                        isHost: false,
                        adventureName: response.hostName || 'Aventura',
                        system: finalSystem
                    }));
                } else {
                    setCurrentAdventureId(null);
                    setPeerError(response?.error || 'Erro ao ingressar na sala. Verifique o ID.');
                }
            });
        } catch (err: any) {
            console.error('[Socket] Connect to host error:', err);
            setCurrentAdventureId(null);
            setPeerError(err.message || 'Erro ao conectar ao servidor.');
            setIsConnecting(false);
        }
    };

    const broadcast = useCallback((msg: PeerMessage) => {
        const roomId = currentAdventureIdRef.current;
        if (!roomId || !socketRef.current) return;
        const safeMsg = JSON.parse(JSON.stringify(msg));
        socketRef.current.emit('peer_message', {
            roomId,
            message: safeMsg
        });
    }, []);

    const broadcastCharacterUpdate = useCallback((character: Character) => {
        setMyCharacter(character);
        const roomId = currentAdventureIdRef.current;
        if (!roomId || !socketRef.current) return;
        const safeChar = JSON.parse(JSON.stringify(character));
        broadcast({
            type: 'PLAYER_UPDATE',
            payload: {
                playerName: usernameRef.current || character.name,
                character: safeChar,
                peerId: myId
            }
        });
    }, [broadcast, myId]);

    const updateMyCharacter = useCallback((char: Character) => {
        setMyCharacter(char);
    }, []);

    const updateRemotePlayerCharacter = useCallback((targetPeerId: string, char: Character) => {
        // Also update GM local state immediately
        setConnectedPlayersData(prev => {
            const existing = prev[targetPeerId];
            if (existing) {
                return {
                    ...prev,
                    [targetPeerId]: {
                        ...existing,
                        character: char,
                        name: char.name || existing.name
                    }
                };
            }
            return prev;
        });

        broadcast({
            type: 'PLAYER_UPDATE',
            payload: {
                playerName: char.name,
                character: char,
                peerId: targetPeerId
            }
        });
    }, [broadcast]);

    const removePlayer = useCallback(async (targetPeerId: string) => {
        const roomId = currentAdventureIdRef.current;
        if (!socketRef.current || !roomId) return;
        socketRef.current.emit('kick_player', {
            roomId,
            userId: targetPeerId
        });
        setConnectedPlayersData(prev => {
            const next = { ...prev };
            delete next[targetPeerId];
            return next;
        });
    }, []);

    const triggerForceRefresh = useCallback(async () => {
        const roomId = currentAdventureIdRef.current;
        if (!socketRef.current || !roomId) return;
        socketRef.current.emit('room_broadcast', {
            roomId,
            event: 'force_refresh',
            data: {},
            includeSender: false
        });
    }, []);

    const hostAdventureId = (_id: string) => {
        // Compatibility method
    };

    const disconnect = useCallback(() => {
        const roomId = currentAdventureIdRef.current;
        if (socketRef.current && roomId) {
            socketRef.current.emit('leave_room', { roomId, closeRoom: isHostRef.current });
            socketRef.current.disconnect();
            socketRef.current = null;
        }
        setIsConnected(false);
        setIsConnecting(false);
        setCurrentAdventureId(null);
        setConnectedPlayersData({});
        localStorage.removeItem('rpg_session');
        sessionStorage.removeItem('rpg_game_started');
    }, []);

    const closeRoom = useCallback(() => {
        const roomId = currentAdventureIdRef.current;
        if (socketRef.current && roomId) {
            socketRef.current.emit('close_room', { roomId });
            socketRef.current.disconnect();
            socketRef.current = null;
        }
        setIsConnected(false);
        setIsConnecting(false);
        setCurrentAdventureId(null);
        setConnectedPlayersData({});
        localStorage.removeItem('rpg_session');
        sessionStorage.removeItem('rpg_game_started');
        window.dispatchEvent(new CustomEvent('rpg_room_closed', { detail: { reason: 'Você encerrou a mesa.' } }));
    }, []);

    const onMessage = useCallback((callback: (data: PeerMessage) => void) => {
        messageListenersRef.current.add(callback);
        return () => {
            messageListenersRef.current.delete(callback);
        };
    }, []);

    const handleSetServerUrl = useCallback((url: string) => {
        const trimmed = url.trim();
        setServerUrl(trimmed);
        localStorage.setItem('rpg_server_url', trimmed);
        if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
        }
        setIsConnected(false);
    }, []);

    return (
        <MultiplayerContext.Provider value={{
            peerId: myId,
            isHost,
            connections,
            hostConnection,
            connectToHost,
            startHosting,
            broadcast,
            username,
            isConnected,
            peerError,
            currentAdventureId,
            currentAdventureName,
            roomSystem,
            hostAdventureId,
            connectedPlayersData,
            broadcastCharacterUpdate,
            isConnecting,
            myCharacter,
            updateMyCharacter,
            disconnect,
            closeRoom,
            updateRemotePlayerCharacter,
            removePlayer,
            triggerForceRefresh,
            myId,
            myName: username,
            onMessage,
            serverUrl,
            setServerUrl: handleSetServerUrl
        }}>
            {children}
        </MultiplayerContext.Provider>
    );
};
