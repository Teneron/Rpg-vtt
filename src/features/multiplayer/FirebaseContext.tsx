import React, { createContext, useContext, useState, useEffect } from 'react';
import { database } from '../../services/firebase';
import { ref, set, onValue, push, onDisconnect, update, get, onChildAdded, query, limitToLast, remove } from 'firebase/database';
import type { Character } from '../character/characterTypes';

// Message Protocol (Moved from PeerContext)
export type PeerMessage =
    | { type: 'JOIN_REQUEST'; payload: { name: string } }
    | { type: 'JOIN_RESPONSE'; payload: { success: boolean; error?: string; hostName?: string; adventureId?: string; adventureName?: string } }
    | { type: 'ROLL_RESULT'; payload: { playerName: string; roll: any } }
    | { type: 'CHAT'; payload: { sender: string; text: string } } // Old simple chat
    | { type: 'CHAT_MESSAGE'; payload: any } // NEW Rich Chat
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
    peerId: string | null; // Now acts as "My User ID"
    isHost: boolean;
    // connections/hostConnection are deprecated but kept for compatibility types if needed, 
    // though we should try to remove their usage.
    connections: any[]; // Shim for UI compatibility
    hostConnection: any | null; // Shim
    connectToHost: (hostId: string, playerName: string) => void;
    startHosting: (hostName: string, adventureId?: string, adventureName?: string) => void;
    broadcast: (msg: PeerMessage) => void;
    username: string;
    isConnected: boolean;
    peerError: string | null;
    currentAdventureId: string | null; // This is the "Room ID" (Host's ID)
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

    // Compatibility Shims
    myId: string | null;
    myName: string;
    onMessage: (callback: (data: PeerMessage) => void) => () => void;
}

const MultiplayerContext = createContext<MultiplayerContextState | undefined>(undefined);

export const useMultiplayer = () => {
    const context = useContext(MultiplayerContext);
    if (!context) {
        throw new Error('useMultiplayer must be used within a MultiplayerProvider');
    }
    return context;
};

export const usePeer = useMultiplayer; // Alias for backward compatibility

// Generate a random ID for this session if not stored
const getMyId = () => {
    // CRITICAL FIX: Use sessionStorage to allow multiple tabs (GM + Player) to work on same machine
    // CRITICAL FIX: Use localStorage to allow persistence across tabs/refresh (Fix Duplicates)
    // WARNING: This means tabs share identity. User must use Incognito for multi-user test.
    let id = localStorage.getItem('rpg_my_id');
    if (!id) {
        id = crypto.randomUUID();
        localStorage.setItem('rpg_my_id', id);
    }
    return id;
};

export const MultiplayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [myId] = useState(getMyId());
    const [username, setUsername] = useState('');
    const [isHost, setIsHost] = useState(false);
    const [currentAdventureId, setCurrentAdventureId] = useState<string | null>(null); // The Room ID
    const [currentAdventureName, setCurrentAdventureName] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [peerError, setPeerError] = useState<string | null>(null);
    const [connectedPlayersData, setConnectedPlayersData] = useState<Record<string, { name: string; character: Character; peerId: string; isOnline?: boolean }>>({});
    const [myCharacter, setMyCharacter] = useState<Character | null>(null);

    // Derived connections for compatibility with old UI
    const connections = Object.values(connectedPlayersData)
        .filter(p => p.isOnline)
        .map(p => ({
            peer: p.peerId,
            metadata: { name: p.name }
        }));

    // Derived host connection (truthy if connected as client)
    const hostConnection = !isHost && isConnected ? { open: true } : null;

    // Refs for listeners to detach them later
    // const roomRef = useRef<any>(null);

    // 1. HOSTING
    const startHosting = async (hostName: string, _initialAdventureId = 'default', initialAdventureName = 'Aventura Padrão') => {
        if (isConnecting || isConnected) return;
        setIsConnecting(true);
        setPeerError(null);

        try {
            // Use the specific Adventure ID as the Room ID (if provided), otherwise fallback to myId
            // This ensures different adventures have different Invite Codes.
            const roomId = (_initialAdventureId && _initialAdventureId !== 'default') ? _initialAdventureId : myId;

            setUsername(hostName);
            setIsHost(true);
            setCurrentAdventureId(roomId);
            setCurrentAdventureName(initialAdventureName);

            // Initialize Room in DB
            const roomDbRef = ref(database, `adventures/${roomId}`);

            // Set initial data
            await update(roomDbRef, {
                hostId: myId,
                name: initialAdventureName,
                createdAt: Date.now()
            });

            // Register myself as a player
            const myPlayerRef = ref(database, `adventures/${roomId}/players/${myId}`);
            await set(myPlayerRef, {
                name: hostName,
                id: myId,
                isHost: true,
                isOnline: true,
                joinedAt: Date.now()
            });

            // On Disconnect: Mark offline (PERSIST DATA)
            onDisconnect(myPlayerRef).update({ isOnline: false });

            // Save Session for Auto-Reconnect
            localStorage.setItem('rpg_session', JSON.stringify({
                adventureId: roomId,
                username: hostName,
                isHost: true,
                adventureName: initialAdventureName
            }));

            setIsConnected(true);
            setIsConnecting(false);
            subscribeToRoom(roomId);

            console.log('[Firebase] Hosting Room:', roomId);
        } catch (err: any) {
            console.error('Firebase Hosting Error:', err);
            setPeerError("Erro ao criar sala offline/online.");
            setIsConnecting(false);
        }
    };

    // Auto-Reconnect REMOVED by User Request
    // We do NOT automatically connect on mount. 
    // The user must manually select their role every time.
    useEffect(() => {
        // cleanup or manual checks if needed
    }, []);

    // 2. CONNECTING
    const connectToHost = async (targetId: string, playerName: string) => {
        if (isConnecting || isConnected) return;
        setIsConnecting(true);
        setPeerError(null);

        try {
            console.log('[Firebase] Connecting to:', targetId);
            // OPTIMIZATION: Instead of fetching the WHOLE room (which includes massive 'events' history),
            // we only fetch the 'name' to verify existence. This drastically reduces download size.
            const nameRef = ref(database, `adventures/${targetId}/name`);
            const nameSnapshot = await get(nameRef);

            if (!nameSnapshot.exists()) {
                throw new Error("Sala não encontrada. Verifique o ID do Mestre.");
            }

            const roomName = nameSnapshot.val();
            // const roomData = snapshot.val(); // No longer fetching full object here
            setUsername(playerName);
            setIsHost(false);
            setCurrentAdventureId(targetId);
            setCurrentAdventureName(roomName || "Aventura");

            // Register myself
            // Register myself (using update to preserve 'character' if exists)
            const myPlayerRef = ref(database, `adventures/${targetId}/players/${myId}`);
            await update(myPlayerRef, {
                name: playerName,
                id: myId,
                isHost: false,
                isOnline: true,
                joinedAt: Date.now()
            });

            // On Disconnect: Mark as offline (PERSIST DATA)
            onDisconnect(myPlayerRef).update({ isOnline: false });

            // Save Session
            localStorage.setItem('rpg_session', JSON.stringify({
                adventureId: targetId,
                username: playerName,
                isHost: false,
                adventureName: roomName || "Aventura"
            }));

            setIsConnected(true);
            setIsConnecting(false);
            subscribeToRoom(targetId);

        } catch (err: any) {
            console.error('Firebase Join Error:', err);
            setPeerError(err.message || "Erro ao conectar.");
            setIsConnecting(false);
        }
    };

    // Refs for tracking state inside closures
    const myCharacterRef = React.useRef<Character | null>(null);
    useEffect(() => { myCharacterRef.current = myCharacter; }, [myCharacter]);

    // Presence System: Handle "Ghost Players"
    useEffect(() => {
        if (!currentAdventureId || !myId) return;

        const connectedRef = ref(database, '.info/connected');
        const myStatusRef = ref(database, `adventures/${currentAdventureId}/players/${myId}`);

        const unsub = onValue(connectedRef, (snap) => {
            if (snap.val() === true) {
                // We are connected.
                // 1. Establish the "On Disconnect" trigger FIRST.
                // This tells the Firebase Server: "If I disappear, set isOnline to false."
                onDisconnect(myStatusRef).update({ isOnline: false }).then(() => {
                    // 2. Now that the tripwire is set, mark myself as Online.
                    update(myStatusRef, { isOnline: true });
                });
            } else {
                // Client thinks it's offline (network drop)
                // Nothing effective we can do here, but UI might react.
            }
        });

        return () => unsub();
    }, [currentAdventureId, myId]);

    // 2.5 FORCE REFRESH LISTENER
    useEffect(() => {
        if (!currentAdventureId) return;

        console.log("[Firebase] Listening for Force Refresh trigger...");
        const refreshRef = ref(database, `adventures/${currentAdventureId}/forceRefresh`);

        let initialLoad = true;
        const unsub = onValue(refreshRef, (snap) => {
            const val = snap.val();

            // Ignore the first value we see (current state)
            if (initialLoad) {
                initialLoad = false;
                return;
            }

            if (val) {
                console.warn("FORCE REFRESH TRIGGERED BY HOST!");
                // Toast or visually warn user?
                // Just reload immediately as requested.
                // Maybe a small delay to ensure deployment propogation?
                alert("O Mestre atualizou a versão do jogo. A página será recarregada agora.");
                window.location.reload();
            }
        });

        return () => unsub();
    }, [currentAdventureId]);

    // 3. SUBSCRIBING TO DATA
    const subscribeToRoom = (roomId: string) => {
        // Listen to Players
        const playersRef = ref(database, `adventures/${roomId}/players`);
        onValue(playersRef, (snapshot) => {
            const val = snapshot.val();
            if (!val) {
                setConnectedPlayersData({});
                return;
            }

            // Convert DB format to App format
            const mapped: Record<string, any> = {};
            Object.values(val).forEach((p: any) => {
                mapped[p.id] = {
                    name: p.name,
                    character: p.character || null, // Character might be synced here
                    peerId: p.id,
                    isOnline: p.isOnline
                };
            });
            setConnectedPlayersData(mapped);

            // DEBUG: Log incoming players to check if imageUrl is present
            console.log('[Firebase] Received Players Data update:', Object.values(mapped).map((p: any) => ({
                id: p.peerId,
                name: p.name,
                hasCharacter: !!p.character,
                imageUrl: p.character?.imageUrl
            })));

            // CRITICAL FIX: Sync MY character if DB version is different (e.g. GM updated it)
            // We use Ref to access current state without breaking closure or dependencies
            if (mapped[myId]?.character) {
                const dbChar = mapped[myId].character;
                const localChar = myCharacterRef.current;

                // Only sync if I don't have a local character yet (Initial Load)
                // We rely on 'onChildAdded' events for live updates from GM to avoid 
                // overwriting my own pending changes with old DB state (Race Condition/Loop).
                if (!localChar) {
                    console.log("[Firebase] Initial Load of myCharacter from DB");
                    setMyCharacter(dbChar);
                }
            }
        });

        // Listen to Broadcast Messages (Chat, Rolls, etc)
        // We act on "child_added" to handle events
        // Note: For a real rigorous event bus, we might want a 'events' queue that we clean up.
        // For simplicity, we'll listen to a 'mailbox' or 'broadcast' node.
        /* 
           This part is tricky: PeerContext was event-based (ephemeral). 
           Firebase is state-based (persistent).
           To Mimic events: We push to a list, listen to child_added, and maybe ignore old ones?
           Or we just use the existing logic components that mostly sync state?
           
           ChatWindow listens to 'rpg_peer_event' (CHAT). 
           BattleMap listens to 'rpg_peer_event' (MAP_UPDATE).
        */

        // Let's rely on standard state sync for players/map, but for "Broadcast" (generic messages),
        // we push to a node.
        // const msgRef = ref(database, `adventures/${roomId}/messages`);
        // Clean up old listener if exists? onValue handles it.

        // We'll limit to last 1 item or just listen for new additions?
        // child_added is better found via query but onValue gives whole lists.
        // Let's listen to 'latest_event' node which we simply overwrite? 
        // No, overwriting misses concurrent events.
        // Pushing is safer.
    };

    // 4. BROADCAST IMPL
    const broadcast = (msg: PeerMessage) => {
        if (!currentAdventureId) return;

        // Special handling for specific types to Map to DB State
        if (msg.type === 'PLAYER_UPDATE') {
            // 1. If it's MY update, save to my DB node
            if (msg.payload.peerId === myId) {
                const playerCharRef = ref(database, `adventures/${currentAdventureId}/players/${myId}/character`);
                set(playerCharRef, msg.payload.character);
                return;
            }

            // 2. If it's for SOMEONE ELSE (GM Force Update), we let it fall through to the Event Bus
            // so the target player receives it and updates their local state.
        }

        if (msg.type === 'MAP_UPDATE') {
            // MAP SYNC LOGIC
            // Instead of broadcasting an event, we should update the 'map' state in DB.
            // But Map component expects events.
            // To be quick: We push the event to 'events' node, and everyone reads it and dispatches locally.
            const safeMapMsg = JSON.parse(JSON.stringify({
                ...msg,
                timestamp: Date.now(),
                senderId: myId
            }));

            push(ref(database, `adventures/${currentAdventureId}/events`), safeMapMsg);
            return;
        }

        // Default: Push to events
        // CRITICAL FIX: Sanitize undefined values (Firebase rejects them)
        const safeMsg = JSON.parse(JSON.stringify({
            ...msg,
            timestamp: Date.now(),
            senderId: myId
        }));

        push(ref(database, `adventures/${currentAdventureId}/events`), safeMsg);
    };

    // 5. EVENT DISPATCHER (The Bridge)
    // We need to listen to the 'events' node and dispatch 'rpg_peer_event' locally
    // 5. EVENT DISPATCHER (The Bridge)
    // We need to listen to the 'events' node and dispatch 'rpg_peer_event' locally
    useEffect(() => {
        if (!currentAdventureId || !isConnected) return;

        console.log('[Firebase] Subscribing to Event Bus (onChildAdded)...');
        console.log('[Firebase] Subscribing to Event Bus (onChildAdded)...');
        const eventsRef = ref(database, `adventures/${currentAdventureId}/events`);
        // Load last 50 events for history
        const eventsQuery = query(eventsRef, limitToLast(50));

        const unsub = onChildAdded(eventsQuery, (snapshot) => {
            const eventData = snapshot.val();
            if (!eventData) return;

            // Dispatch to window so Listeners pick it up
            // We removed the strictly > startTime check to allow History Loading.
            // Duplicate checks in contexts (ChatContext, etc) handle re-processing.
            const evt = new CustomEvent('rpg_peer_event', { detail: eventData });
            window.dispatchEvent(evt);

            // Check against Ref to avoid dependency cycles/resubscriptions
            const localChar = myCharacterRef.current;

            // Improved Check: Match by PeerID (This message is for ME)
            // OR match by Character ID if PeerID is missing (legacy)
            const isForMe = eventData.payload.peerId === myId || (eventData.payload.character?.id === localChar?.id);

            if (eventData.type === 'PLAYER_UPDATE' && isForMe && eventData.senderId !== myId) {
                // GM updated my character
                console.log('[Firebase] Received forced character update from GM');
                setMyCharacter(eventData.payload.character);
            }
        });

        return () => unsub();
    }, [currentAdventureId, isConnected]); // Removed myCharacter dependency to prevent listener resets

    const broadcastCharacterUpdate = (character: Character) => {
        setMyCharacter(character);
        if (currentAdventureId) {
            console.log(`[Firebase] Broadcasting Character Update for ${myId}`, {
                name: character.name,
                imageUrl: character.imageUrl,
                hasImage: !!character.imageUrl
            });

            const playerCharRef = ref(database, `adventures/${currentAdventureId}/players/${myId}/character`);
            // Firebase cannot handle 'undefined'. We wash the object.
            const safeChar = JSON.parse(JSON.stringify(character));

            console.log('[Firebase] Payload being sent:', safeChar.imageUrl);

            set(playerCharRef, safeChar).catch(err => {
                console.error("[Firebase] Failed to update character in DB:", err);
            });
        } else {
            console.warn('[Firebase] Cannot broadcast update, no currentAdventureId');
        }
    };

    /**
     * GM ONLY: Updates another player's character in the Database.
     * This ensures the change is persistent and syncs to all clients (including the owner).
     */
    const updateRemotePlayerCharacter = async (targetPeerId: string, character: Character) => {
        if (!currentAdventureId || !isHost) return;

        console.log(`[Firebase] GM updating remote character for peer ${targetPeerId}`);
        const targetRef = ref(database, `adventures/${currentAdventureId}/players/${targetPeerId}/character`);
        // Firebase cannot handle 'undefined'. We wash the object.
        const safeChar = JSON.parse(JSON.stringify(character));

        // 1. Persist to DB
        await set(targetRef, safeChar);

        // 2. Notify Target Client via Event Bus (Triggers their local update)
        const eventMsg = {
            type: 'PLAYER_UPDATE',
            payload: {
                playerName: character.name,
                character: safeChar,
                peerId: targetPeerId
            },
            timestamp: Date.now(),
            senderId: myId
        };
        push(ref(database, `adventures/${currentAdventureId}/events`), eventMsg);
    };

    const removePlayer = async (targetPeerId: string) => {
        if (!currentAdventureId || !isHost) return;
        if (targetPeerId === myId) return; // Don't delete self via this method

        if (confirm("Tem certeza que deseja remover este jogador/ficha da campanha?")) {
            console.log(`[Firebase] GM removing player ${targetPeerId}`);
            const targetRef = ref(database, `adventures/${currentAdventureId}/players/${targetPeerId}`);
            await remove(targetRef);
        }
    };

    // Shim for onMessage
    const onMessage = React.useCallback((callback: (data: PeerMessage) => void) => {
        const handler = (e: Event) => {
            const detail = (e as CustomEvent).detail;
            callback(detail);
        };
        window.addEventListener('rpg_peer_event', handler);
        return () => window.removeEventListener('rpg_peer_event', handler);
    }, []);

    // 6. LISTEN FOR LOCAL ROLLS TO BROADCAST
    useEffect(() => {
        const handleLocalBroadcast = (e: Event) => {
            const detail = (e as CustomEvent).detail;
            if (detail) {
                console.log("[Firebase] Broadcasting Local Roll:", detail);
                broadcast({
                    type: 'ROLL_RESULT',
                    payload: {
                        playerName: username || 'Unknown',
                        roll: detail
                    }
                });
            }
        };

        window.addEventListener('rpg_broadcast_roll', handleLocalBroadcast);
        return () => window.removeEventListener('rpg_broadcast_roll', handleLocalBroadcast);
    }, [username, currentAdventureId]); // dependenies for broadcast closure

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
            hostAdventureId: setCurrentAdventureId,
            connectedPlayersData,
            broadcastCharacterUpdate,
            updateRemotePlayerCharacter,
            removePlayer,
            isConnecting,
            myCharacter,
            updateMyCharacter: setMyCharacter,
            disconnect: () => {
                console.log("[Firebase] Disconnecting...");
                // 1. Clear Storage (Prevents Auto-Reconnect)
                localStorage.removeItem('rpg_session');

                // 2. Set Offline in DB
                if (currentAdventureId && myId) {
                    const myRef = ref(database, `adventures/${currentAdventureId}/players/${myId}`);
                    update(myRef, { isOnline: false });
                }

                // 3. Reset Local State
                setIsConnected(false);
                setIsHost(false);
                setCurrentAdventureId(null);
                setCurrentAdventureName(null);
                setConnectedPlayersData({});
                setMyCharacter(null);
            },
            triggerForceRefresh: async () => {
                if (!currentAdventureId || !isHost) return;
                if (confirm("Isso fará com que TODOS os jogadores conectados (incluindo você) recarreguem a página. Use isso após fazer um Deploy de nova versão.\n\nContinuar?")) {
                    // Update timestamp to trigger change
                    const refreshRef = ref(database, `adventures/${currentAdventureId}/forceRefresh`);
                    await set(refreshRef, Date.now());
                }
            },
            // Shims
            myId,
            myName: username,
            onMessage
        }}>
            {children}
        </MultiplayerContext.Provider>
    );
};
