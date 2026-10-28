import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import type { Character } from '../character/characterTypes';
import { CharacterRepository } from '../character/characterRepository';

export type PeerMessage = (
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
    | { type: 'SFX_TRIGGER'; payload: { track: any } }
    | { type: 'MAP_PING'; payload: { id: string; x: number; y: number; color: string; senderName: string; senderId?: string; timestamp: number } }
) & {
    // Carimbados pelo SERVIDOR em toda mensagem retransmitida (o cliente nunca deve confiar em
    // identidades declaradas dentro do payload).
    senderUserId?: string;
    senderIsHost?: boolean;
    fromHistory?: boolean;
};

export type ConnectionState = 'connected' | 'reconnecting' | 'disconnected';

// Tipos que só o Mestre pode emitir (espelha HOST_ONLY_MESSAGE_TYPES do servidor; defesa em profundidade).
const HOST_ONLY_MESSAGE_TYPES: ReadonlySet<string> = new Set([
    'COMBAT_UPDATE', 'AUDIO_UPDATE', 'SFX_TRIGGER', 'JOIN_RESPONSE', 'WELCOME'
]);

const MAX_PLAYER_REJOIN_RETRIES = 20;
const PLAYER_REJOIN_RETRY_DELAY_MS = 3000;

const isTransientPlayerRoomError = (errMsg?: string): boolean => {
    if (!errMsg) return false;
    const lower = errMsg.toLowerCase();
    return (
        lower.includes('não existe') ||
        lower.includes('nao existe') ||
        lower.includes('não abriu') ||
        lower.includes('nao abriu') ||
        lower.includes('desconectado') ||
        lower.includes('offline')
    );
};

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
    connectionState: ConnectionState;
    reconnectNow: () => void;
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

const getMyId = (): string => {
    try {
        let id = localStorage.getItem('rpg_my_id');
        if (!id) {
            id = crypto.randomUUID();
            localStorage.setItem('rpg_my_id', id);
        }
        return id;
    } catch {
        return crypto.randomUUID();
    }
};

const getDefaultServerUrl = (): string => {
    if (import.meta.env.VITE_SOCKET_SERVER_URL) {
        return String(import.meta.env.VITE_SOCKET_SERVER_URL).trim().replace(/\/+$/, '');
    }
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    return isLocalhost ? 'http://localhost:3001' : window.location.origin;
};

// O endereço do servidor não é mais configurável pelo usuário: vem do build (VITE_SOCKET_SERVER_URL)
// ou da origem atual. Remove overrides antigos salvos no navegador para não apontarem para
// um servidor obsoleto (ex.: localhost de testes anteriores).
const purgeLegacyServerOverrides = (): void => {
    try {
        localStorage.removeItem('rpg_server_url');
        localStorage.removeItem('rpg_server_url_override');
    } catch {
        // Ignore storage errors
    }
};
purgeLegacyServerOverrides();

export const MultiplayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [myId] = useState(getMyId);
    const [username, setUsername] = useState('');
    const [isHost, setIsHost] = useState(false);
    const [currentAdventureId, setCurrentAdventureId] = useState<string | null>(null);
    const [currentAdventureName, setCurrentAdventureName] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected');
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
        } catch {
            // Ignore parse errors on cached session
        }
        return 'dnd55e';
    });
    const [serverUrl] = useState<string>(getDefaultServerUrl);

    const socketRef = useRef<Socket | null>(null);
    const myCharacterRef = useRef<Character | null>(null);
    useEffect(() => { myCharacterRef.current = myCharacter; }, [myCharacter]);

    const usernameRef = useRef(username);
    useEffect(() => { usernameRef.current = username; }, [username]);

    const isHostRef = useRef(isHost);
    useEffect(() => { isHostRef.current = isHost; }, [isHost]);

    const currentAdventureIdRef = useRef(currentAdventureId);
    useEffect(() => { currentAdventureIdRef.current = currentAdventureId; }, [currentAdventureId]);

    const roomSystemRef = useRef<string>(roomSystem);
    useEffect(() => { roomSystemRef.current = roomSystem; }, [roomSystem]);

    const pendingExplicitJoinRef = useRef(false);
    const isJoinedRoomRef = useRef(false);
    const rejoinRetryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const rejoinRetryCountRef = useRef(0);
    const hostReconnectSyncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const hasAttemptedSessionRestoreRef = useRef(false);

    const messageListenersRef = useRef<Set<(data: PeerMessage) => void>>(new Set());
    const hostTokenRef = useRef<string | null>((() => {
        try {
            const saved = localStorage.getItem('rpg_session');
            if (saved) {
                const parsed = JSON.parse(saved);
                return parsed.hostToken || null;
            }
        } catch { /* ignore */ }
        return null;
    })());

    const connections = Object.values(connectedPlayersData)
        .filter(p => p.isOnline && p.peerId !== myId)
        .map(p => ({
            peer: p.peerId,
            metadata: { name: p.name }
        }));

    const hostConnection = !isHost && isConnected ? { open: true } : null;

    const clearRejoinTimer = useCallback(() => {
        if (rejoinRetryTimerRef.current) {
            clearTimeout(rejoinRetryTimerRef.current);
            rejoinRetryTimerRef.current = null;
        }
    }, []);

    const clearHostReconnectSyncTimer = useCallback(() => {
        if (hostReconnectSyncTimerRef.current) {
            clearTimeout(hostReconnectSyncTimerRef.current);
            hostReconnectSyncTimerRef.current = null;
        }
    }, []);

    const persistHostToken = useCallback((token: string, fallbackSession?: Record<string, any>) => {
        hostTokenRef.current = token;
        try {
            const raw = localStorage.getItem('rpg_session');
            const parsed = raw ? JSON.parse(raw) : (fallbackSession ? { ...fallbackSession } : null);
            if (parsed && typeof parsed === 'object') {
                parsed.hostToken = token;
                localStorage.setItem('rpg_session', JSON.stringify(parsed));
            }
        } catch {
            // Ignore localStorage quota/access errors
        }
    }, []);

    const mirrorPlayerCharacterForHost = useCallback((char: Character | null | undefined, advIdOverride?: string | null) => {
        if (!char || !char.id) return;
        try {
            CharacterRepository.save({
                ...char,
                adventureId: advIdOverride || currentAdventureIdRef.current || char.adventureId || 'default'
            });
        } catch (e) {
            console.error('[Socket] Error mirroring player character on host:', e);
        }
    }, []);

    const scheduleHostReconnectedSync = useCallback(() => {
        clearHostReconnectSyncTimer();
        hostReconnectSyncTimerRef.current = setTimeout(() => {
            hostReconnectSyncTimerRef.current = null;
            if (isHostRef.current && isJoinedRoomRef.current) {
                console.log('[Socket] Dispatching rpg_host_reconnected to push authoritative map/combat state');
                window.dispatchEvent(new CustomEvent('rpg_host_reconnected'));
            }
        }, 500);
    }, [clearHostReconnectSyncTimer]);

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

    // Apply remote game state (map, combat, audio, chat history) to local contexts
    const applyGameState = useCallback((gameState: any, forHost: boolean = isHostRef.current) => {
        if (!gameState) return;

        // CRÍTICO: O Mestre NUNCA deve sobrescrever seu mapa local (db.maps / MapContext) com gameState.map do servidor!
        if (!forHost && gameState.map) {
            console.log('[Socket] Applying initial map gameState');
            dispatchPeerMessageLocally({
                type: 'MAP_UPDATE',
                payload: { type: 'full_sync', data: gameState.map }
            });
        }

        if (gameState.combat) {
            const shouldApplyCombat = !forHost || Boolean(gameState.combat.isActive || gameState.combat.isInCombat);
            if (shouldApplyCombat) {
                console.log('[Socket] Applying initial combat gameState');
                dispatchPeerMessageLocally({
                    type: 'COMBAT_UPDATE',
                    payload: gameState.combat
                });
            }
        }

        if (!forHost && gameState.audio) {
            console.log('[Socket] Applying initial audio gameState');
            dispatchPeerMessageLocally({
                type: 'AUDIO_UPDATE',
                payload: gameState.audio,
                senderIsHost: true
            });
        }

        if (Array.isArray(gameState.chatHistory) && gameState.chatHistory.length > 0) {
            console.log('[Socket] Applying initial chat history:', gameState.chatHistory.length, 'messages');
            gameState.chatHistory.forEach((chatMsg: any) => {
                dispatchPeerMessageLocally({
                    type: 'CHAT_MESSAGE',
                    payload: chatMsg,
                    fromHistory: true
                });
            });
        }
    }, [dispatchPeerMessageLocally]);

    // Handle full room state update (members + gameState)
    const handleRoomState = useCallback((state: any) => {
        if (!state) return;

        const forHost = Boolean(state.isHost ?? isHostRef.current);
        const roomAdvId = state.roomId || currentAdventureIdRef.current;

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
                if (forHost && !m.isHost && m.character) {
                    mirrorPlayerCharacterForHost(m.character, roomAdvId);
                }
            });
            setConnectedPlayersData(mapped);

            if (mapped[myId]?.character && !myCharacterRef.current) {
                myCharacterRef.current = mapped[myId].character;
                setMyCharacter(mapped[myId].character);
            }
        }

        if (state.system) {
            console.log('[Socket] Setting roomSystem from server state:', state.system);
            roomSystemRef.current = state.system;
            setRoomSystem(state.system);
        }

        if (state.gameState) {
            applyGameState(state.gameState, forHost);
        }
    }, [myId, applyGameState, mirrorPlayerCharacterForHost]);

    // Disconnect & timer cleanup on unmount
    useEffect(() => {
        return () => {
            clearRejoinTimer();
            clearHostReconnectSyncTimer();
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [clearRejoinTimer, clearHostReconnectSyncTimer]);

    const attemptRejoinRoomRef = useRef<(socket: Socket) => void>(() => {});

    const attemptRejoinRoom = useCallback((socket: Socket) => {
        const activeRoomId = currentAdventureIdRef.current;
        const activeUsername = usernameRef.current;
        if (!activeRoomId || !activeUsername) return;

        console.log('[Socket] Re-joining room:', activeRoomId);
        setConnectionState('reconnecting');
        setIsConnecting(true);

        socket.emit('join_room', {
            roomId: activeRoomId,
            playerName: activeUsername,
            isHost: isHostRef.current,
            hostToken: isHostRef.current ? (hostTokenRef.current || undefined) : undefined,
            character: myCharacterRef.current,
            userId: myId,
            system: roomSystemRef.current || undefined
        }, (response: any) => {
            if (response?.success) {
                isJoinedRoomRef.current = true;
                rejoinRetryCountRef.current = 0;
                clearRejoinTimer();
                setPeerError(null);
                setIsConnected(true);
                setIsConnecting(false);
                setConnectionState('connected');

                if (response.hostToken) {
                    persistHostToken(response.hostToken);
                }
                if (response.system) {
                    roomSystemRef.current = response.system;
                    setRoomSystem(response.system);
                }
                handleRoomState(response);

                if (response.isHost || isHostRef.current) {
                    scheduleHostReconnectedSync();
                }
                console.log('[Socket] Successfully rejoined room:', activeRoomId);
            } else {
                console.warn('[Socket] Reconnect join_room failed:', response?.error);
                isJoinedRoomRef.current = false;
                setIsConnected(false);
                setIsConnecting(false);
                setPeerError(response?.error || 'Não foi possível entrar na sala.');

                if (
                    !isHostRef.current &&
                    isTransientPlayerRoomError(response?.error) &&
                    currentAdventureIdRef.current &&
                    rejoinRetryCountRef.current < MAX_PLAYER_REJOIN_RETRIES
                ) {
                    rejoinRetryCountRef.current += 1;
                    setConnectionState('reconnecting');
                    clearRejoinTimer();
                    rejoinRetryTimerRef.current = setTimeout(() => {
                        rejoinRetryTimerRef.current = null;
                        if (currentAdventureIdRef.current && socketRef.current?.connected && !isJoinedRoomRef.current) {
                            attemptRejoinRoomRef.current(socketRef.current);
                        }
                    }, PLAYER_REJOIN_RETRY_DELAY_MS);
                } else {
                    setConnectionState('disconnected');
                }
            }
        });
    }, [myId, clearRejoinTimer, persistHostToken, handleRoomState, scheduleHostReconnectedSync]);

    useEffect(() => {
        attemptRejoinRoomRef.current = attemptRejoinRoom;
    }, [attemptRejoinRoom]);

    const initSocket = useCallback((url: string): Socket => {
        if (socketRef.current) {
            if (!socketRef.current.connected) {
                setConnectionState('reconnecting');
                socketRef.current.connect();
            } else if (!isJoinedRoomRef.current) {
                setConnectionState('reconnecting');
            }
            return socketRef.current;
        }

        const socket = io(url, {
            transports: ['polling', 'websocket'],
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            timeout: 20000
        });

        socketRef.current = socket;
        setConnectionState('reconnecting');

        socket.on('connect', () => {
            console.log('[Socket] Transport connected to server:', url, 'Socket ID:', socket.id);
            setPeerError(null);

            // Se startHosting, connectToHost ou a restauração de montagem já enfileiraram um join_room explícito,
            // não dispara um segundo join_room duplicado nem marca 'connected' antes do ACK da sala!
            if (pendingExplicitJoinRef.current) {
                setConnectionState('reconnecting');
                return;
            }

            const activeRoomId = currentAdventureIdRef.current;
            const activeUsername = usernameRef.current;
            if (activeRoomId && activeUsername) {
                setConnectionState('reconnecting');
                attemptRejoinRoomRef.current(socket);
            } else {
                setIsConnecting(false);
            }
        });

        socket.on('connect_error', (err) => {
            console.error('[Socket] Connection error:', err.message);
            isJoinedRoomRef.current = false;
            setIsConnected(false);
            setPeerError(`Erro ao conectar ao servidor (${url}): ${err.message}`);
            if (!socket.active) {
                setConnectionState('disconnected');
                setIsConnecting(false);
            } else {
                setConnectionState('reconnecting');
            }
        });

        socket.on('disconnect', (reason) => {
            console.log('[Socket] Disconnected from server:', reason);
            isJoinedRoomRef.current = false;
            pendingExplicitJoinRef.current = false;
            clearRejoinTimer();
            clearHostReconnectSyncTimer();
            setIsConnected(false);
            if (reason === 'io server disconnect' || reason === 'io client disconnect') {
                setConnectionState('disconnected');
                setIsConnecting(false);
                if (reason === 'io server disconnect') {
                    setPeerError('Desconectado pelo servidor.');
                }
            } else {
                setConnectionState('reconnecting');
            }
        });

        // Socket.io Reconnection Manager Events (apenas transporte; estado 'connected' depende do join_room ACK)
        socket.io.on('reconnect_attempt', (attempt) => {
            console.log(`[Socket] Tentativa de reconexão #${attempt}...`);
            setConnectionState('reconnecting');
            setIsConnecting(true);
        });

        socket.io.on('reconnect', (attempt) => {
            console.log(`[Socket] Transporte reconectado na tentativa #${attempt}; aguardando confirmação da sala...`);
            if (currentAdventureIdRef.current) {
                setConnectionState('reconnecting');
            }
        });

        socket.io.on('reconnect_failed', () => {
            console.warn('[Socket] Falha final nas tentativas de reconexão.');
            isJoinedRoomRef.current = false;
            setIsConnected(false);
            setConnectionState('disconnected');
            setIsConnecting(false);
            setPeerError('Falha ao restabelecer conexão com o servidor.');
        });

        socket.on('player_joined', (member) => {
            console.log('[Socket] Player joined:', member.playerName);
            if (isHostRef.current && !member.isHost && member.character) {
                mirrorPlayerCharacterForHost(member.character);
            }
            setConnectedPlayersData(prev => ({
                ...prev,
                [member.userId]: {
                    name: member.playerName,
                    character: member.character || prev[member.userId]?.character || null,
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
            // Defesa em profundidade: mensagens exclusivas do Mestre só são aceitas se carimbadas como tal pelo servidor
            if (HOST_ONLY_MESSAGE_TYPES.has(msg.type) && !msg.senderIsHost) {
                console.warn('[Socket] Descartando mensagem host-only não autorizada:', msg.type);
                return;
            }

            dispatchPeerMessageLocally(msg);

            // Handle PLAYER_UPDATE: update connectedPlayersData, mirror on Host DB, and update local myCharacter if targeted
            if (msg.type === 'PLAYER_UPDATE') {
                const targetPeerId = msg.payload.peerId;
                const senderIsHost = !!msg.senderIsHost;
                const senderUserId = msg.senderUserId;

                // Segurança: apenas o Mestre ou o próprio dono da ficha podem emitir PLAYER_UPDATE para esse peerId
                const isAuthorized = senderIsHost || (!!senderUserId && senderUserId === targetPeerId);
                if (!isAuthorized) {
                    console.warn('[Socket] Descartando PLAYER_UPDATE não autorizado para', targetPeerId, 'vindo de', senderUserId);
                    return;
                }

                // Espelha a ficha do jogador no IndexedDB do Mestre para entrar nos Backups .json da campanha
                if (isHostRef.current && msg.payload.character) {
                    mirrorPlayerCharacterForHost(msg.payload.character);
                }

                // 1. Update list of player data for GM and peers (cria entrada caso ainda não exista)
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
                    return {
                        ...prev,
                        [targetPeerId]: {
                            name: msg.payload.playerName || msg.payload.character?.name || 'Jogador',
                            character: msg.payload.character,
                            peerId: targetPeerId,
                            isOnline: true
                        }
                    };
                });

                // 2. Update myCharacter if this update was aimed at me (APENAS se veio do Mestre!)
                // Se foi edição local minha, já salvamos no momento da edição. Evita que outro jogador sobrescreva minha ficha.
                const isForMe = targetPeerId === myId || (myCharacterRef.current && msg.payload.character?.id === myCharacterRef.current.id);
                if (isForMe && msg.payload.character && senderIsHost) {
                    console.log('[Socket] Updating local character from remote PLAYER_UPDATE (from GM):', msg.payload.character.name);
                    myCharacterRef.current = msg.payload.character;
                    setMyCharacter(msg.payload.character);
                    try {
                        CharacterRepository.save(msg.payload.character);
                    } catch (e) {
                        console.error('[Socket] Error saving remote character update:', e);
                    }
                }
            }
        });

        socket.on('player_kicked', (data: { reason?: string }) => {
            console.log('[Socket] Player was removed from room:', data);
            clearRejoinTimer();
            clearHostReconnectSyncTimer();
            isJoinedRoomRef.current = false;
            pendingExplicitJoinRef.current = false;
            alert(data?.reason || 'Você foi removido da mesa pelo Mestre.');
            setIsConnected(false);
            setIsConnecting(false);
            setConnectionState('disconnected');
            currentAdventureIdRef.current = null;
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
            clearRejoinTimer();
            clearHostReconnectSyncTimer();
            isJoinedRoomRef.current = false;
            pendingExplicitJoinRef.current = false;
            setIsConnected(false);
            setIsConnecting(false);
            setConnectionState('disconnected');
            currentAdventureIdRef.current = null;
            setCurrentAdventureId(null);
            setConnectedPlayersData({});
            localStorage.removeItem('rpg_session');
            sessionStorage.removeItem('rpg_game_started');
            window.dispatchEvent(new CustomEvent('rpg_room_closed', { detail: data }));
        });

        return socket;
    }, [myId, handleRoomState, dispatchPeerMessageLocally, clearRejoinTimer, clearHostReconnectSyncTimer, mirrorPlayerCharacterForHost]);

    const reconnectNow = useCallback(() => {
        console.log('[Socket] Reconexão manual solicitada.');
        clearRejoinTimer();
        rejoinRetryCountRef.current = 0;
        setPeerError(null);

        if (socketRef.current) {
            if (socketRef.current.connected) {
                if (currentAdventureIdRef.current && usernameRef.current) {
                    setConnectionState('reconnecting');
                    setIsConnecting(true);
                    attemptRejoinRoomRef.current(socketRef.current);
                } else {
                    setIsConnecting(false);
                    setConnectionState(isJoinedRoomRef.current ? 'connected' : 'disconnected');
                }
            } else {
                setConnectionState('reconnecting');
                setIsConnecting(true);
                socketRef.current.connect();
            }
        } else {
            setConnectionState('reconnecting');
            setIsConnecting(true);
            initSocket(serverUrl);
        }
    }, [serverUrl, initSocket, clearRejoinTimer]);

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
        if (hasAttemptedSessionRestoreRef.current) return;
        hasAttemptedSessionRestoreRef.current = true;

        let savedSession: string | null = null;
        try {
            savedSession = localStorage.getItem('rpg_session');
        } catch {
            return;
        }
        if (!savedSession) return;

        try {
            const session = JSON.parse(savedSession);
            if (session?.adventureId && session?.username) {
                console.log('[Socket] Restoring session from localStorage:', session);
                const restoredHost = !!session.isHost;
                const restoredSystem = session.system || (session.adventureId?.toUpperCase().startsWith('WTC') ? 'witcher' : 'dnd55e');
                const preferredHostToken = restoredHost ? (hostTokenRef.current || session.hostToken || undefined) : undefined;

                if (preferredHostToken) {
                    hostTokenRef.current = preferredHostToken;
                }

                usernameRef.current = session.username;
                isHostRef.current = restoredHost;
                currentAdventureIdRef.current = session.adventureId;
                roomSystemRef.current = restoredSystem;

                setUsername(session.username);
                setIsHost(restoredHost);
                setCurrentAdventureId(session.adventureId);
                setCurrentAdventureName(session.adventureName || null);
                setRoomSystem(restoredSystem);
                setIsConnecting(true);
                setConnectionState('reconnecting');

                pendingExplicitJoinRef.current = true;
                isJoinedRoomRef.current = false;

                const socket = initSocket(serverUrl);
                socket.emit('join_room', {
                    roomId: session.adventureId,
                    playerName: session.username,
                    isHost: restoredHost,
                    hostToken: preferredHostToken,
                    character: myCharacterRef.current || null,
                    userId: myId,
                    system: restoredSystem
                }, (response: any) => {
                    pendingExplicitJoinRef.current = false;
                    if (response?.success) {
                        isJoinedRoomRef.current = true;
                        rejoinRetryCountRef.current = 0;
                        clearRejoinTimer();
                        setPeerError(null);
                        setIsConnected(true);
                        setIsConnecting(false);
                        setConnectionState('connected');

                        if (response.hostToken) {
                            persistHostToken(response.hostToken, session);
                        }
                        if (response.system) {
                            roomSystemRef.current = response.system;
                            setRoomSystem(response.system);
                        }
                        handleRoomState(response);

                        if (response.isHost || restoredHost) {
                            scheduleHostReconnectedSync();
                        }
                        console.log('[Socket] Session restored successfully for room:', session.adventureId);
                    } else {
                        console.warn('[Socket] Session recovery failed on server:', response?.error);
                        isJoinedRoomRef.current = false;
                        setIsConnected(false);
                        setIsConnecting(false);
                        setPeerError(response?.error || 'Não foi possível entrar na sala.');

                        if (!restoredHost && isTransientPlayerRoomError(response?.error) && currentAdventureIdRef.current) {
                            // Cold-start / Mestre reconectando: mantém sessão e tenta novamente a cada 3s
                            rejoinRetryCountRef.current = 1;
                            setConnectionState('reconnecting');
                            clearRejoinTimer();
                            rejoinRetryTimerRef.current = setTimeout(() => {
                                rejoinRetryTimerRef.current = null;
                                if (currentAdventureIdRef.current && socketRef.current?.connected && !isJoinedRoomRef.current) {
                                    attemptRejoinRoomRef.current(socketRef.current);
                                }
                            }, PLAYER_REJOIN_RETRY_DELAY_MS);
                        } else {
                            localStorage.removeItem('rpg_session');
                            currentAdventureIdRef.current = null;
                            setCurrentAdventureId(null);
                            setConnectionState('disconnected');
                        }
                    }
                });
            }
        } catch (e) {
            console.error('[Socket] Failed to parse saved session:', e);
            localStorage.removeItem('rpg_session');
        }
    }, [myId, serverUrl, initSocket, handleRoomState, clearRejoinTimer, persistHostToken, scheduleHostReconnectedSync]);

    const startHosting = async (hostName: string, _initialAdventureId = 'default', initialAdventureName = 'Aventura Padrão', system = 'dnd55e') => {
        clearRejoinTimer();
        clearHostReconnectSyncTimer();
        rejoinRetryCountRef.current = 0;
        isJoinedRoomRef.current = false;
        setIsConnected(false);
        setIsConnecting(true);
        setConnectionState('reconnecting');
        setPeerError(null);

        const roomId = (_initialAdventureId && _initialAdventureId !== 'default') ? _initialAdventureId : myId;

        usernameRef.current = hostName;
        isHostRef.current = true;
        currentAdventureIdRef.current = roomId;
        roomSystemRef.current = system;

        setUsername(hostName);
        setIsHost(true);
        setCurrentAdventureId(roomId);
        setCurrentAdventureName(initialAdventureName);
        setRoomSystem(system);

        try {
            pendingExplicitJoinRef.current = true;
            const socket = initSocket(serverUrl);
            socket.emit('join_room', {
                roomId,
                playerName: hostName,
                isHost: true,
                hostToken: hostTokenRef.current || undefined,
                character: null,
                userId: myId,
                system
            }, (response: any) => {
                pendingExplicitJoinRef.current = false;
                setIsConnecting(false);
                if (response?.success) {
                    isJoinedRoomRef.current = true;
                    rejoinRetryCountRef.current = 0;
                    clearRejoinTimer();
                    setPeerError(null);
                    setIsConnected(true);
                    setConnectionState('connected');

                    const finalHostToken = response.hostToken || hostTokenRef.current || null;
                    if (finalHostToken) {
                        hostTokenRef.current = finalHostToken;
                    }
                    const finalSystem = response.system || system;
                    roomSystemRef.current = finalSystem;
                    setRoomSystem(finalSystem);

                    try {
                        localStorage.setItem('rpg_session', JSON.stringify({
                            adventureId: roomId,
                            username: hostName,
                            isHost: true,
                            hostToken: finalHostToken,
                            adventureName: initialAdventureName,
                            system: finalSystem
                        }));
                    } catch {
                        // Ignore localStorage quota/access errors
                    }

                    handleRoomState(response);
                    console.log('[Socket] Hosting room successfully:', roomId, 'System:', finalSystem);
                } else {
                    isJoinedRoomRef.current = false;
                    setIsConnected(false);
                    setConnectionState('disconnected');
                    currentAdventureIdRef.current = null;
                    setCurrentAdventureId(null);
                    setPeerError(response?.error || 'Erro ao criar sala no servidor.');
                }
            });
        } catch (err: any) {
            pendingExplicitJoinRef.current = false;
            isJoinedRoomRef.current = false;
            console.error('[Socket] Start hosting error:', err);
            setPeerError(err.message || 'Erro ao conectar ao servidor.');
            setIsConnected(false);
            setIsConnecting(false);
            setConnectionState('disconnected');
        }
    };

    const connectToHost = async (targetId: string, playerName: string) => {
        clearRejoinTimer();
        clearHostReconnectSyncTimer();
        rejoinRetryCountRef.current = 0;
        isJoinedRoomRef.current = false;
        setIsConnected(false);
        setIsConnecting(true);
        setConnectionState('reconnecting');
        setPeerError(null);

        const cleanTargetId = targetId.trim().toUpperCase();
        const derivedSystem = cleanTargetId.startsWith('WTC') ? 'witcher' : 'dnd55e';

        usernameRef.current = playerName;
        isHostRef.current = false;
        currentAdventureIdRef.current = cleanTargetId;
        roomSystemRef.current = derivedSystem;

        setRoomSystem(derivedSystem);
        setUsername(playerName);
        setIsHost(false);
        setCurrentAdventureId(cleanTargetId);

        try {
            pendingExplicitJoinRef.current = true;
            const socket = initSocket(serverUrl);
            socket.emit('join_room', {
                roomId: cleanTargetId,
                playerName,
                isHost: false,
                character: myCharacterRef.current,
                userId: myId,
                system: derivedSystem
            }, (response: any) => {
                pendingExplicitJoinRef.current = false;
                setIsConnecting(false);
                if (response?.success) {
                    isJoinedRoomRef.current = true;
                    rejoinRetryCountRef.current = 0;
                    clearRejoinTimer();
                    setPeerError(null);
                    setIsConnected(true);
                    setConnectionState('connected');

                    const finalSystem = response.system || derivedSystem;
                    roomSystemRef.current = finalSystem;
                    setRoomSystem(finalSystem);
                    handleRoomState(response);
                    setCurrentAdventureName(response.hostName ? `Mesa de ${response.hostName}` : 'Aventura');
                    console.log('[Socket] Connected to host room successfully:', cleanTargetId, 'System:', finalSystem);

                    try {
                        localStorage.setItem('rpg_session', JSON.stringify({
                            adventureId: cleanTargetId,
                            username: playerName,
                            isHost: false,
                            adventureName: response.hostName || 'Aventura',
                            system: finalSystem
                        }));
                    } catch {
                        // Ignore localStorage quota/access errors
                    }
                } else {
                    isJoinedRoomRef.current = false;
                    setIsConnected(false);
                    setConnectionState('disconnected');
                    currentAdventureIdRef.current = null;
                    setCurrentAdventureId(null);
                    setPeerError(response?.error || 'Erro ao ingressar na sala. Verifique o ID.');
                }
            });
        } catch (err: any) {
            pendingExplicitJoinRef.current = false;
            isJoinedRoomRef.current = false;
            console.error('[Socket] Connect to host error:', err);
            currentAdventureIdRef.current = null;
            setCurrentAdventureId(null);
            setPeerError(err.message || 'Erro ao conectar ao servidor.');
            setIsConnected(false);
            setIsConnecting(false);
            setConnectionState('disconnected');
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
        myCharacterRef.current = character;
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
        myCharacterRef.current = char;
        setMyCharacter(char);
    }, []);

    const updateRemotePlayerCharacter = useCallback((targetPeerId: string, char: Character) => {
        if (isHostRef.current && char) {
            mirrorPlayerCharacterForHost(char);
        }

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
            return {
                ...prev,
                [targetPeerId]: {
                    name: char.name || 'Jogador',
                    character: char,
                    peerId: targetPeerId,
                    isOnline: true
                }
            };
        });

        broadcast({
            type: 'PLAYER_UPDATE',
            payload: {
                playerName: char.name,
                character: char,
                peerId: targetPeerId
            }
        });
    }, [broadcast, mirrorPlayerCharacterForHost]);

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
        void _id;
    };

    const disconnect = useCallback(() => {
        clearRejoinTimer();
        clearHostReconnectSyncTimer();
        isJoinedRoomRef.current = false;
        pendingExplicitJoinRef.current = false;
        rejoinRetryCountRef.current = 0;

        const roomId = currentAdventureIdRef.current;
        if (socketRef.current && roomId) {
            socketRef.current.emit('leave_room', { roomId, closeRoom: isHostRef.current });
            socketRef.current.disconnect();
            socketRef.current = null;
        } else if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
        }
        hostTokenRef.current = null;
        currentAdventureIdRef.current = null;
        setIsConnected(false);
        setIsConnecting(false);
        setConnectionState('disconnected');
        setCurrentAdventureId(null);
        setConnectedPlayersData({});
        localStorage.removeItem('rpg_session');
        sessionStorage.removeItem('rpg_game_started');
    }, [clearRejoinTimer, clearHostReconnectSyncTimer]);

    const closeRoom = useCallback(() => {
        clearRejoinTimer();
        clearHostReconnectSyncTimer();
        isJoinedRoomRef.current = false;
        pendingExplicitJoinRef.current = false;
        rejoinRetryCountRef.current = 0;

        const roomId = currentAdventureIdRef.current;
        if (socketRef.current && roomId) {
            socketRef.current.emit('close_room', { roomId });
            socketRef.current.disconnect();
            socketRef.current = null;
        } else if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
        }
        hostTokenRef.current = null;
        currentAdventureIdRef.current = null;
        setIsConnected(false);
        setIsConnecting(false);
        setConnectionState('disconnected');
        setCurrentAdventureId(null);
        setConnectedPlayersData({});
        localStorage.removeItem('rpg_session');
        sessionStorage.removeItem('rpg_game_started');
        window.dispatchEvent(new CustomEvent('rpg_room_closed', { detail: { reason: 'Você encerrou a mesa.' } }));
    }, [clearRejoinTimer, clearHostReconnectSyncTimer]);

    const onMessage = useCallback((callback: (data: PeerMessage) => void) => {
        messageListenersRef.current.add(callback);
        return () => {
            messageListenersRef.current.delete(callback);
        };
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
            connectionState,
            reconnectNow,
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
            serverUrl
        }}>
            {children}
        </MultiplayerContext.Provider>
    );
};
