import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { initialMapConfig } from './mapTypes';
import type { MapConfig, MapToken, Wall } from './mapTypes';
import { usePeer } from '../multiplayer/FirebaseContext';
import type { PeerMessage } from '../multiplayer/FirebaseContext';
import { db } from '../../db/RPGDatabase'; // Import DB
// MapContext.tsx - Powered by Socket Multiplayer & Dexie IndexedDB

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

import { isValidCoord, sanitizeWall, sanitizeToken } from './mapUtils';

const MapContext = createContext<MapContextType | undefined>(undefined);

export const MapProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { broadcast, isHost, currentAdventureId, isConnected } = usePeer();

    // Helper to get safe ID
    const safeAdventureId = currentAdventureId || 'default';

    const [config, setLocalConfig] = useState<MapConfig>(initialMapConfig);
    const [tokens, setTokens] = useState<MapToken[]>([]);
    const [walls, setWalls] = useState<Wall[]>([]);
    const [interactionMode, setInteractionMode] = useState<'select' | 'measure' | 'draw' | 'wall' | 'fog'>('select');

    const [loadedAdventureId, setLoadedAdventureId] = useState<string | null>(null);
    const mapDbId = useRef<number | null>(null);
    const tokensRef = useRef<MapToken[]>([]);
    useEffect(() => { tokensRef.current = tokens; }, [tokens]);

    // Load Data from Dexie IndexedDB
    useEffect(() => {
        const loadMapData = async () => {
            if (!safeAdventureId) return;

            if (loadedAdventureId !== safeAdventureId) {
                setLoadedAdventureId(null);
            }

            try {
                const mapEntry = await db.maps.where('campaignId').equals(safeAdventureId).first();

                if (currentAdventureId && safeAdventureId !== currentAdventureId && safeAdventureId !== 'default') return;

                if (mapEntry) {
                    const cfg = mapEntry.config || initialMapConfig;
                    setLocalConfig(cfg);
                    const validTokens = (mapEntry.tokens || []).map((t: any) => sanitizeToken(t, cfg.width, cfg.height)).filter((t: any): t is MapToken => t !== null);
                    const validWalls = (mapEntry.walls || []).map(sanitizeWall).filter((w: any): w is Wall => w !== null);
                    setTokens(validTokens);
                    setWalls(validWalls);
                    mapDbId.current = mapEntry.id!;
                    console.log(`[MapContext] Loaded map from DB for: ${safeAdventureId}`);
                    setLoadedAdventureId(safeAdventureId);
                } else {
                    setLocalConfig(initialMapConfig);
                    setTokens([]);
                    setWalls([]);
                    mapDbId.current = null;
                    setLoadedAdventureId(safeAdventureId);
                }
            } catch (e) {
                console.error("Error loading map from IndexedDB", e);
            }
        };

        loadMapData();
    }, [safeAdventureId]);

    // Request initial sync when client connects
    useEffect(() => {
        if (!isHost && isConnected) {
            broadcast({ type: 'SYNC_REQUEST', payload: { target: 'MAP' } });
        }
    }, [isHost, isConnected]);

    // Local DB Persistence (Backup/Offline optimized)
    useEffect(() => {
        if (!safeAdventureId) return;
        // CRÍTICO (M2): Não salvar antes que os dados desta aventura tenham sido carregados do DB
        if (loadedAdventureId !== safeAdventureId) return;

        let isCancelled = false;
        const timer = setTimeout(async () => {
            try {
                if (mapDbId.current) {
                    await db.maps.update(mapDbId.current, {
                        config,
                        tokens,
                        walls,
                        lastUpdated: Date.now()
                    });
                } else {
                    const existing = await db.maps.where('campaignId').equals(safeAdventureId).first();
                    if (isCancelled) return;
                    if (existing && existing.id) {
                        mapDbId.current = existing.id;
                        await db.maps.update(existing.id, {
                            config,
                            tokens,
                            walls,
                            lastUpdated: Date.now()
                        });
                    } else {
                        const id = await db.maps.add({
                            campaignId: safeAdventureId,
                            name: 'Default Map',
                            config,
                            tokens,
                            walls
                        });
                        if (!isCancelled) {
                            mapDbId.current = id as number;
                        }
                    }
                }
            } catch (e) {
                console.error("Error saving map to DB", e);
            }
        }, 300);

        return () => {
            isCancelled = true;
            clearTimeout(timer);
        };
    }, [config, tokens, walls, safeAdventureId, loadedAdventureId]);

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
        const safe = sanitizeToken(token, config.width, config.height);
        if (!safe) return;
        setTokens(prev => [...(prev || []), safe]);
        sendUpdate({ type: 'add', data: safe });
    };

    const updateTokenPosition = (id: string, x: number, y: number) => {
        if (!id || !isValidCoord(x) || !isValidCoord(y)) return;
        const currentList = tokensRef.current || [];
        const target = currentList.find(t => t.id === id);
        const tokenSize = target?.size || 1;
        const safeX = Math.max(0, Math.min(Math.round(x), Math.max(0, config.width - tokenSize)));
        const safeY = Math.max(0, Math.min(Math.round(y), Math.max(0, config.height - tokenSize)));

        // M1: Efeito de rede fora do updater do React
        sendUpdate({ type: 'move', data: { id, x: safeX, y: safeY } });
        setTokens(prev => (prev || []).map(t => t.id === id ? { ...t, position: { x: safeX, y: safeY } } : t));
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
        const safe = sanitizeWall(wall);
        if (!safe) return;
        setWalls(prev => (prev || []).some(w => w.id === safe.id) ? prev : [...(prev || []), safe]);
        sendUpdate({ type: 'add_wall', data: safe });
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
                    case 'add': {
                        const safe = sanitizeToken(data, config.width, config.height);
                        if (safe) {
                            setTokens(prev => {
                                if ((prev || []).some(t => t.id === safe.id)) return prev;
                                return [...(prev || []), safe];
                            });
                        }
                        break;
                    }
                    case 'move':
                        if (data && data.id && isValidCoord(data.x) && isValidCoord(data.y)) {
                            setTokens(prev => {
                                const list = prev || [];
                                const target = list.find(t => t.id === data.id);
                                const tokenSize = target?.size || 1;
                                const safeX = Math.max(0, Math.min(Math.round(data.x), Math.max(0, config.width - tokenSize)));
                                const safeY = Math.max(0, Math.min(Math.round(data.y), Math.max(0, config.height - tokenSize)));
                                return list.map(t => t.id === data.id ? { ...t, position: { x: safeX, y: safeY } } : t);
                            });
                        }
                        break;
                    case 'update_token':
                        setTokens(prev => (prev || []).map(t => t.id === data.id ? { ...t, ...data.updates } : t));
                        break;
                    case 'remove':
                        setTokens(prev => (prev || []).filter(t => t.id !== data.id));
                        break;

                    // Walls
                    case 'add_wall': {
                        const safe = sanitizeWall(data);
                        if (safe) {
                            setWalls(prev => (prev || []).some(w => w.id === safe.id) ? prev : [...(prev || []), safe]);
                        }
                        break;
                    }
                    case 'update_wall':
                        setWalls(prev => (prev || []).map(w => w.id === data.id ? { ...w, ...data.updates } : w));
                        break;
                    case 'remove_wall':
                        setWalls(prev => (prev || []).filter(w => w.id !== data.id));
                        break;

                    case 'config':
                        setLocalConfig(data);
                        break;
                    case 'full_sync': {
                        console.log('[MapContext] Received Full Sync');
                        const syncConfig = data.config || initialMapConfig;
                        setLocalConfig(syncConfig);
                        if (Array.isArray(data.tokens)) {
                            const sanitizedTokens = data.tokens
                                .map((t: any) => sanitizeToken(t, syncConfig.width, syncConfig.height))
                                .filter((t: any): t is MapToken => t !== null);
                            setTokens(sanitizedTokens);
                        }
                        if (Array.isArray(data.walls)) {
                            const sanitizedWalls = data.walls
                                .map(sanitizeWall)
                                .filter((w: any): w is Wall => w !== null);
                            setWalls(sanitizedWalls);
                        }
                        break;
                    }
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
        const validConfig = newConfig || initialMapConfig;
        const validTokens = (newTokens || [])
            .map(t => sanitizeToken(t, validConfig.width, validConfig.height))
            .filter((t): t is MapToken => t !== null);
        const validWalls = (newWalls || [])
            .map(sanitizeWall)
            .filter((w): w is Wall => w !== null);

        setLocalConfig(validConfig);
        setTokens(validTokens);
        setWalls(validWalls);

        // Broadcast to players
        broadcast({
            type: 'MAP_UPDATE',
            payload: {
                type: 'full_sync',
                data: { config: validConfig, tokens: validTokens, walls: validWalls }
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
