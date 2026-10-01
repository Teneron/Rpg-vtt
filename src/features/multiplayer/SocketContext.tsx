import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
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
    startHosting: (hostName: string, adventureId?: string, adventureName?: string) => void;
    broadcast: (msg: PeerMessage) => void;
    username: string;
    isConnected: boolean;
    peerError: string | null;
    currentAdventureId: string | null;
    currentAdventureName: string | null;
    hostAdventureId: (id: string) => void;
    connectedPlayersData: Record<string, { name: string; character: Character; peerId: string; isOnline?: boolean }>;
    broadcastCharacterUpdate: (character: Character) => void;
    isConnecting: boolean;
    myCharacter: Character | null;
    updateMyCharacter: (character: Character) => void;
    disconnect: () => void;
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
    const [connectedPlayersData, setConnectedPlayersData] = useState<Record<string, { name: string; character: Character; peerId: string; isOnline?: boolean }>>({});
    const [myCharacter, setMyCharacter] = useState<Character | null>(null);
    const [serverUrl, setServerUrl] = useState<string>(() => {
        return localStorage.getItem('rpg_server_url') || getDefaultServerUrl();
    });

    const socketRef = useRef<Socket | null>(null);
    const myCharacterRef = useRef<Character | null>(null);
    useEffect(() => { myCharacterRef.current = myCharacter; }, [myCharacter]);

    const messageListenersRef = useRef<Set<(data: PeerMessage) => void>>(new Set());

    const connections = Object.values(connectedPlayersData)
        .filter(p => p.isOnline)
        .map(p => ({
            peer: p.peerId,
            metadata: { name: p.name }
        }));

    const hostConnection = !isHost && isConnected ? { open: true } : null;

    // Disconnect cleanup on unmount
    useEffect(() => {
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, []);

    const initSocket = (url: string): Socket => {
        if (socketRef.current && socketRef.current.connected) {
            return socketRef.current;
        }

        const socket = io(url, {
            transports: ['websocket', 'polling'],
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            timeout: 10000
        });

        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('[Socket] Connected to server:', url, 'Socket ID:', socket.id);
            setPeerError(null);
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
                    isOnline: true
                }
            }));
        });

        socket.on('player_left', (data) => {
            console.log('[Socket] Player left:', data.playerName);
            setConnectedPlayersData(prev => {
                const next = { ...prev };
                if (next[data.userId]) {
                    next[data.userId] = { ...next[data.userId], isOnline: false };
                }
                return next;
            });
        });

        socket.on('room_state', (state) => {
            if (!state || !state.members) return;
            const mapped: Record<string, any> = {};
            state.members.forEach((m: any) => {
                mapped[m.userId] = {
                    name: m.playerName,
                    character: m.character,
                    peerId: m.userId,
                    isOnline: m.isOnline
                };
            });
            setConnectedPlayersData(mapped);

            if (mapped[myId]?.character && !myCharacterRef.current) {
                setMyCharacter(mapped[myId].character);
            }
        });

        socket.on('peer_message', (msg: PeerMessage) => {
            // Dispatch locally to custom event bus
            window.dispatchEvent(new CustomEvent('rpg_peer_event', { detail: msg }));

            // Invoke registered onMessage listeners
            messageListenersRef.current.forEach(callback => {
                try { callback(msg); } catch (e) { console.error('Error in onMessage listener', e); }
            });

            // Handle PLAYER_UPDATE targeting me
            if (msg.type === 'PLAYER_UPDATE') {
                const isForMe = msg.payload.peerId === myId || (myCharacterRef.current && msg.payload.character?.id === myCharacterRef.current.id);
                if (isForMe && msg.payload.peerId !== myId) {
                    setMyCharacter(msg.payload.character);
                }
            }
        });

        socket.on('force_refresh', () => {
            alert('O Mestre solicitou recarregamento da versão do jogo.');
            window.location.reload();
        });

        return socket;
    };

    const startHosting = async (hostName: string, _initialAdventureId = 'default', initialAdventureName = 'Aventura Padrão') => {
        if (isConnecting || isConnected) return;
        setIsConnecting(true);
        setPeerError(null);

        const roomId = (_initialAdventureId && _initialAdventureId !== 'default') ? _initialAdventureId : myId;
        setUsername(hostName);
        setIsHost(true);
        setCurrentAdventureId(roomId);
        setCurrentAdventureName(initialAdventureName);

        try {
            const socket = initSocket(serverUrl);
            socket.emit('join_room', {
                roomId,
                playerName: hostName,
                isHost: true,
                character: null,
                userId: myId
            }, (response: any) => {
                setIsConnecting(false);
                if (response?.success) {
                    setIsConnected(true);
                    console.log('[Socket] Hosting room successfully:', roomId);
                    localStorage.setItem('rpg_session', JSON.stringify({
                        adventureId: roomId,
                        username: hostName,
                        isHost: true,
                        adventureName: initialAdventureName
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
        if (isConnecting || isConnected) return;
        setIsConnecting(true);
        setPeerError(null);

        setUsername(playerName);
        setIsHost(false);
        setCurrentAdventureId(targetId);

        try {
            const socket = initSocket(serverUrl);
            socket.emit('join_room', {
                roomId: targetId,
                playerName,
                isHost: false,
                character: myCharacterRef.current,
                userId: myId
            }, (response: any) => {
                setIsConnecting(false);
                if (response?.success) {
                    setIsConnected(true);
                    setCurrentAdventureName(response.hostName ? `Mesa de ${response.hostName}` : 'Aventura');
                    console.log('[Socket] Connected to host room successfully:', targetId);
                    localStorage.setItem('rpg_session', JSON.stringify({
                        adventureId: targetId,
                        username: playerName,
                        isHost: false,
                        adventureName: response.hostName || 'Aventura'
                    }));
                } else {
                    setPeerError(response?.error || 'Erro ao ingressar na sala. Verifique o ID.');
                }
            });
        } catch (err: any) {
            console.error('[Socket] Connect to host error:', err);
            setPeerError(err.message || 'Erro ao conectar ao servidor.');
            setIsConnecting(false);
        }
    };

    const broadcast = (msg: PeerMessage) => {
        if (!currentAdventureId || !socketRef.current) return;
        const safeMsg = JSON.parse(JSON.stringify(msg));
        socketRef.current.emit('peer_message', {
            roomId: currentAdventureId,
            message: safeMsg
        });
    };

    const broadcastCharacterUpdate = (character: Character) => {
        setMyCharacter(character);
        if (!currentAdventureId || !socketRef.current) return;
        const safeChar = JSON.parse(JSON.stringify(character));
        broadcast({
            type: 'PLAYER_UPDATE',
            payload: {
                playerName: username || character.name,
                character: safeChar,
                peerId: myId
            }
        });
    };

    const updateMyCharacter = (char: Character) => {
        setMyCharacter(char);
    };

    const updateRemotePlayerCharacter = (targetPeerId: string, char: Character) => {
        broadcast({
            type: 'PLAYER_UPDATE',
            payload: {
                playerName: char.name,
                character: char,
                peerId: targetPeerId
            }
        });
    };

    const removePlayer = async (targetPeerId: string) => {
        if (!socketRef.current || !currentAdventureId) return;
        socketRef.current.emit('room_broadcast', {
            roomId: currentAdventureId,
            event: 'player_left',
            data: { userId: targetPeerId },
            includeSender: true
        });
    };

    const triggerForceRefresh = async () => {
        if (!socketRef.current || !currentAdventureId) return;
        socketRef.current.emit('room_broadcast', {
            roomId: currentAdventureId,
            event: 'force_refresh',
            data: {},
            includeSender: false
        });
    };

    const hostAdventureId = (_id: string) => {
        // Compatibility method
    };

    const disconnect = () => {
        if (socketRef.current && currentAdventureId) {
            socketRef.current.emit('leave_room', { roomId: currentAdventureId });
            socketRef.current.disconnect();
            socketRef.current = null;
        }
        setIsConnected(false);
        setIsConnecting(false);
        setCurrentAdventureId(null);
        setConnectedPlayersData({});
    };

    const onMessage = (callback: (data: PeerMessage) => void) => {
        messageListenersRef.current.add(callback);
        return () => {
            messageListenersRef.current.delete(callback);
        };
    };

    const handleSetServerUrl = (url: string) => {
        setServerUrl(url);
        localStorage.setItem('rpg_server_url', url);
    };

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
            hostAdventureId,
            connectedPlayersData,
            broadcastCharacterUpdate,
            isConnecting,
            myCharacter,
            updateMyCharacter,
            disconnect,
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
