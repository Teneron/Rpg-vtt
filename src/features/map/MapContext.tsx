import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { initialMapConfig } from './mapTypes';
import type { MapConfig, MapToken, Wall } from './mapTypes';
import { usePeer } from '../multiplayer/FirebaseContext';
import type { PeerMessage } from '../multiplayer/FirebaseContext';
import { db } from '../../db/RPGDatabase'; // Import DB
import { database } from '../../services/firebase';
import { ref, set, onValue, get } from 'firebase/database';
import { sanitizePayload } from '../../utils/firebaseUtils';

interface MapContextType {
    config: MapConfig;
    setConfig: (config: MapConfig) => void;
    tokens: MapToken[];
    addToken: (token: MapToken) => void;
    updateTokenPosition: (id: string, x: number, y: number) => void;
    updateToken: (id: string, updates: Partial<MapToken>) => void;
    removeToken: (id: string) => void;

    // Walls
    walls: Wall[];
    addWall: (wall: Wall) => void;
    updateWall: (id: string, updates: Partial<Wall>) => void;
    removeWall: (id: string) => void;
    forceSync: () => void; // Debug/Manual Sync

    interactionMode: 'select' | 'measure' | 'draw' | 'wall' | 'fog';
    setInteractionMode: (mode: 'select' | 'measure' | 'draw' | 'wall' | 'fog') => void;
    setFullState?: (config: MapConfig, tokens: MapToken[], walls: Wall[]) => void;
}

const MapContext = createContext<MapContextType | undefined>(undefined);

export const MapProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { broadcast, isHost, currentAdventureId, isConnected } = usePeer();

    // Helper to get safe ID
    const safeAdventureId = currentAdventureId || 'default';

    const [config, setLocalConfig] = useState<MapConfig>(initialMapConfig);
    const [tokens, setTokens] = useState<MapToken[]>([]);
    const [walls, setWalls] = useState<Wall[]>([]);
    const [interactionMode, setInteractionMode] = useState<'select' | 'measure' | 'draw' | 'wall' | 'fog'>('select');

    // Safety Latch: Prevent saving empty state over cloud state
    // We track WHICH adventure ID is currently loaded in memory.
    // We only save if loadedAdventureId === safeAdventureId.
    const [loadedAdventureId, setLoadedAdventureId] = useState<string | null>(null);

    // DB ID for the current map (to update the same entry)
    const mapDbId = useRef<number | null>(null);

    // Load Data from DB (or Cloud if DB empty)
    useEffect(() => {
        const loadMapData = async () => {
            if (!safeAdventureId) return;

            // Reset loaded state when ID changes to prevent leaking old state
            if (loadedAdventureId !== safeAdventureId) {
                setLoadedAdventureId(null);
            }

            try {
                // 1. Try Local DB first
                const mapEntry = await db.maps.where('campaignId').equals(safeAdventureId).first();

                // Double check race condition: if adventureId changed while awaiting, abort
                if (currentAdventureId && safeAdventureId !== currentAdventureId && safeAdventureId !== 'default') return;

                if (mapEntry) {
                    setLocalConfig(mapEntry.config);
                    setTokens(mapEntry.tokens || []);
                    setWalls(mapEntry.walls || []);
                    mapDbId.current = mapEntry.id!;
                    console.log(`[MapContext] Loaded map from DB for: ${safeAdventureId}`);
                    setLoadedAdventureId(safeAdventureId);
                } else {
                    // 2. If no Local DB, check Cloud
                    console.log(`[MapContext] No local DB map. Checking Cloud for: ${safeAdventureId}`);
                    const mapRef = ref(database, `adventures/${safeAdventureId}/map`);
                    const snapshot = await get(mapRef);

                    if (snapshot.exists()) {
                        const val = snapshot.val();
                        setLocalConfig(val.config || initialMapConfig);
                        setTokens(val.tokens || []);
                        setWalls(val.walls || []);
                        console.log(`[MapContext] Restored map from Cloud.`);
                    } else {
                        // 3. Really new map
                        console.log(`[MapContext] No Cloud map either. Using defaults.`);
                        setLocalConfig(initialMapConfig);
                        setTokens([]);
                        setWalls([]);
                    }
                    mapDbId.current = null;
                    setLoadedAdventureId(safeAdventureId);
                }
            } catch (e) {
                console.error("Error loading map", e);
            }
        };

        loadMapData();
    }, [safeAdventureId]);

    // 4. Persistence: Cloud Map (Source of Truth)
    // Host writes to Firebase. Players listen to Firebase.
    // This ensures state recovery on refresh for everyone.

    // 4. Persistence: Cloud Map (Source of Truth) -> SPLIT into 3 Effects

    // Host: Save CONFIG (Rare, Heavy)
    useEffect(() => {
        if (!isHost || !safeAdventureId || loadedAdventureId !== safeAdventureId) return;
        const timer = setTimeout(() => {
            const refConfig = ref(database, `adventures/${safeAdventureId}/map/config`);
            const payload = sanitizePayload(config);
            set(refConfig, payload).catch(e => console.error("Map Config Save Error:", e));
        }, 1000);
        return () => clearTimeout(timer);
    }, [config, isHost, safeAdventureId, loadedAdventureId]);

    // Host: Save TOKENS (Frequent, Light)
    useEffect(() => {
        if (!isHost || !safeAdventureId || loadedAdventureId !== safeAdventureId) return;

        // Use a shorter debounce for tokens to feel more responsive, 
        // or just rely on the fact that writes are cheap.
        const timer = setTimeout(() => {
            const refTokens = ref(database, `adventures/${safeAdventureId}/map/tokens`);
            // Sanitize list
            const payload = sanitizePayload(tokens);
            set(refTokens, payload).catch(e => console.error("Map Tokens Save Error:", e));
        }, 500); // 500ms debounce
        return () => clearTimeout(timer);
    }, [tokens, isHost, safeAdventureId, loadedAdventureId]);

    // Host: Save WALLS (Occasional)
    useEffect(() => {
        if (!isHost || !safeAdventureId || loadedAdventureId !== safeAdventureId) return;
        const timer = setTimeout(() => {
            const refWalls = ref(database, `adventures/${safeAdventureId}/map/walls`);
            const payload = sanitizePayload(walls);
            set(refWalls, payload).catch(e => console.error("Map Walls Save Error:", e));
        }, 1000);
        return () => clearTimeout(timer);
    }, [walls, isHost, safeAdventureId, loadedAdventureId]);

    // Players: Listen to Cloud -> SPLIT into 3 Listeners
    useEffect(() => {
        if (isHost || !safeAdventureId) return;

        console.log('[MapContext] Subscribing to Cloud Map Channels...');

        // 1. Config Channel
        const refConfig = ref(database, `adventures/${safeAdventureId}/map/config`);
        const unsubConfig = onValue(refConfig, (snap) => {
            const val = snap.val();
            if (val) setLocalConfig(val);
        });

        // 2. Tokens Channel
        const refTokens = ref(database, `adventures/${safeAdventureId}/map/tokens`);
        const unsubTokens = onValue(refTokens, (snap) => {
            const val = snap.val();
            setTokens(val || []); // Handle null as empty array
        });

        // 3. Walls Channel
        const refWalls = ref(database, `adventures/${safeAdventureId}/map/walls`);
        const unsubWalls = onValue(refWalls, (snap) => {
            const val = snap.val();
            setWalls(val || []);
        });

        return () => {
            unsubConfig();
            unsubTokens();
            unsubWalls();
        };
    }, [isHost, safeAdventureId]);

    // Local DB Persistence (Backup/Offline optimized)
    // (We keep this for good measure, but Cloud is now Primary for Sync)
    useEffect(() => {
        if (!safeAdventureId) return;

        const saveMapData = async () => {
            try {
                if (mapDbId.current) {
                    // Update existing
                    await db.maps.update(mapDbId.current, {
                        config,
                        tokens,
                        walls,
                        lastUpdated: Date.now()
                    });
                } else {
                    // Create new if strictly Host and missing?
                    // Yes, lazy creation if not exists.
                    const id = await db.maps.add({
                        campaignId: safeAdventureId,
                        name: 'Default Map',
                        config,
                        tokens,
                        walls
                    });
                    mapDbId.current = id as number;
                }
            } catch (e) {
                console.error("Error saving map to DB", e);
            }
        };

        // Debounce? For now, raw execution.
        // It might be too frequent if tokens move every frame.
        // If movement is just "drop", it's fine. 
        // If continuous drag updates state, we need debounce.
        // Current implementation: updates state on drop/end? 
        // Token drag usually updates state on 'stop' or 'drag'?
        // The implementation in BattleMap usually updates on 'drag end'.
        // So frequency is "per move", which is fine.

        saveMapData();
    }, [config, tokens, walls, isHost, safeAdventureId]);

    // Request Sync when Connected (Client Only) - DEPRECATED by Cloud Listener
    // But kept as fallback if Firebase listener is slow?
    // Actually, onValue is immediate if cached. We can remove explicit SYNC_REQUEST or keep it for forcing.
    useEffect(() => {
        if (!isHost && isConnected && currentAdventureId) {
            // Optional: Force a redownload? Not needed with onValue.
        }
    }, [isHost, isConnected, currentAdventureId]);

    // Broadcast wrapper
    const sendUpdate = (payload: { type: 'move' | 'add' | 'remove' | 'config' | 'update_token' | 'full_sync' | 'add_wall' | 'update_wall' | 'remove_wall'; data: any }) => {
        broadcast({ type: 'MAP_UPDATE', payload });
    };

    const setConfig = (newConfig: MapConfig) => {
        setLocalConfig(newConfig);
        sendUpdate({ type: 'config', data: newConfig });
    };

    const addToken = (token: MapToken) => {
        setTokens(prev => [...(prev || []), token]);
        sendUpdate({ type: 'add', data: token });
    };

    const updateTokenPosition = (id: string, x: number, y: number) => {
        setTokens(prev => (prev || []).map(t => t.id === id ? { ...t, position: { x, y } } : t));
        sendUpdate({ type: 'move', data: { id, x, y } });
    };

    const updateToken = (id: string, updates: Partial<MapToken>) => {
        setTokens(prev => (prev || []).map(t => t.id === id ? { ...t, ...updates } : t));
        sendUpdate({ type: 'update_token', data: { id, updates } });
    };

    const removeToken = (id: string) => {
        setTokens(prev => (prev || []).filter(t => t.id !== id));
        sendUpdate({ type: 'remove', data: { id } });
    };

    // --- Wall Operations ---
    const addWall = (wall: Wall) => {
        setWalls(prev => [...prev, wall]);
        sendUpdate({ type: 'add_wall', data: wall });
    };

    const updateWall = (id: string, updates: Partial<Wall>) => {
        setWalls(prev => (prev || []).map(w => w.id === id ? { ...w, ...updates } : w));
        sendUpdate({ type: 'update_wall', data: { id, updates } });
    };

    const removeWall = (id: string) => {
        setWalls(prev => (prev || []).filter(w => w.id !== id));
        sendUpdate({ type: 'remove_wall', data: { id } });
    };
    // -----------------------

    // Listen for Peer Events
    useEffect(() => {
        const handlePeerEvent = (e: CustomEvent<PeerMessage>) => {
            if (e.detail.type === 'MAP_UPDATE') {
                const { type, data } = e.detail.payload;

                switch (type) {
                    case 'add':
                        setTokens(prev => {
                            if ((prev || []).some(t => t.id === data.id)) return prev; // Dedup
                            return [...(prev || []), data];
                        });
                        break;
                    case 'move':
                        setTokens(prev => (prev || []).map(t => t.id === data.id ? { ...t, position: { x: data.x, y: data.y } } : t));
                        break;
                    case 'update_token':
                        setTokens(prev => (prev || []).map(t => t.id === data.id ? { ...t, ...data.updates } : t));
                        break;
                    case 'remove':
                        setTokens(prev => prev.filter(t => t.id !== data.id));
                        break;

                    // Walls
                    case 'add_wall':
                        setWalls(prev => [...prev, data]);
                        break;
                    case 'update_wall':
                        setWalls(prev => (prev || []).map(w => w.id === data.id ? { ...w, ...data.updates } : w));
                        break;
                    case 'remove_wall':
                        setWalls(prev => (prev || []).filter(w => w.id !== data.id));
                        break;

                    case 'config':
                        setLocalConfig(data);
                        break;
                    case 'full_sync':
                        console.log('[MapContext] Received Full Sync');
                        setLocalConfig(data.config);
                        setTokens(data.tokens);
                        if (data.walls) setWalls(data.walls);
                        break;
                }
            } else if (e.detail.type === 'SYNC_REQUEST' && isHost) {
                const req = e.detail.payload;
                if (req.target === 'MAP') {
                    console.log('[MapContext] Received SYNC_REQUEST. Broadcasting Full State...');
                    broadcast({
                        type: 'MAP_UPDATE',
                        payload: {
                            type: 'full_sync',
                            data: { config, tokens, walls }
                        }
                    });
                }
            }
        };

        window.addEventListener('rpg_peer_event' as any, handlePeerEvent);
        return () => window.removeEventListener('rpg_peer_event' as any, handlePeerEvent);
    }, [isHost, config, tokens, walls]);

    const forceSync = () => {
        if (isHost) {
            broadcast({ type: 'MAP_UPDATE', payload: { type: 'full_sync', data: { config, tokens, walls } } });
        }
    };

    const setFullState = (newConfig: MapConfig, newTokens: MapToken[], newWalls: Wall[]) => {
        setLocalConfig(newConfig || initialMapConfig);
        setTokens(newTokens || []);
        setWalls(newWalls || []);

        // Broadcast to players
        broadcast({
            type: 'MAP_UPDATE',
            payload: {
                type: 'full_sync',
                data: { config: newConfig, tokens: newTokens, walls: newWalls }
            }
        });
    };



    // 7. TOKEN HEALTH SYNC (Host Strategy: Event-Based)
    // We listen for Character Updates (Local or Remote) and update the Tokens directly.
    // This avoids "Presence Loops" and supports NPCs/Offline Characters.

    const handleCharacterUpdateForTokens = React.useCallback((character: any) => {
        if (!character || !character.id) return;

        setTokens(prevTokens => {
            let hasChanges = false;
            const newTokens = prevTokens.map(t => {
                if (t.characterId === character.id) {
                    // Check if update is needed
                    const charHp = character.hp.current;
                    const charMax = character.hp.max;

                    if (t.hp?.current !== charHp || t.hp?.max !== charMax) {
                        hasChanges = true;
                        console.log(`[MapContext] Syncing Token ${t.name} HP to ${charHp}/${charMax}`);
                        return {
                            ...t,
                            hp: {
                                current: charHp,
                                max: charMax,
                                temp: character.hp.temp
                            }
                        };
                    }
                }
                return t;
            });

            return hasChanges ? newTokens : prevTokens;
        });
    }, []); // No deps, functional update

    useEffect(() => {
        // Only HOST syncs Map State to DB.
        // But Clients might want to see update instantly visually?
        // Actually, if Host updates 'tokens', it saves to DB, then DB syncs to Clients.
        // So Clients just wait for DB. Host drives the change.
        if (!isHost) return;

        // A. Listen for Local Saves (GM editing Sheet)
        const handleLocalSave = (e: Event) => {
            const char = (e as CustomEvent).detail;
            handleCharacterUpdateForTokens(char);
        };

        // B. Listen for Remote Updates (Player editing Sheet)
        const handleRemoteEvent = (e: Event) => {
            const data = (e as CustomEvent).detail;
            if (data.type === 'PLAYER_UPDATE' && data.payload?.character) {
                handleCharacterUpdateForTokens(data.payload.character);
            }
        };

        window.addEventListener('rpg_local_char_save', handleLocalSave);
        window.addEventListener('rpg_peer_event', handleRemoteEvent);

        return () => {
            window.removeEventListener('rpg_local_char_save', handleLocalSave);
            window.removeEventListener('rpg_peer_event', handleRemoteEvent);
        };
    }, [isHost, handleCharacterUpdateForTokens]);

    return (
        <MapContext.Provider value={{
            config, setConfig,
            tokens, addToken, updateTokenPosition, updateToken, removeToken,
            walls, addWall, updateWall, removeWall, forceSync,
            interactionMode, setInteractionMode,
            setFullState
        }}>
            {children}
        </MapContext.Provider>
    );
};

export const useMap = () => {
    const context = useContext(MapContext);
    if (!context) throw new Error('useMap must be used within MapProvider');
    return context;
};
