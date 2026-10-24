import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { initialMapConfig } from './mapTypes';
import type { MapConfig, MapToken, Wall, MapInteractionMode } from './mapTypes';
import { usePeer } from '../multiplayer/SocketContext';
import type { PeerMessage } from '../multiplayer/SocketContext';
import { db } from '../../db/RPGDatabase';
import { isValidCoord, sanitizeWall, sanitizeToken } from './mapUtils';

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

    interactionMode: MapInteractionMode;
    setInteractionMode: (mode: MapInteractionMode) => void;
    setFullState?: (config: MapConfig, tokens: MapToken[], walls: Wall[]) => void;
}

const sanitizeMapConfig = (raw: any): MapConfig => {
    if (!raw || typeof raw !== 'object') return initialMapConfig;
    return {
        ...initialMapConfig,
        ...raw,
        width: isValidCoord(raw.width) && raw.width > 0 ? Math.min(300, Math.round(raw.width)) : initialMapConfig.width,
        height: isValidCoord(raw.height) && raw.height > 0 ? Math.min(300, Math.round(raw.height)) : initialMapConfig.height,
        gridSize: isValidCoord(raw.gridSize) && raw.gridSize >= 10 ? Math.min(300, Math.round(raw.gridSize)) : initialMapConfig.gridSize,
        gridColor: typeof raw.gridColor === 'string' && raw.gridColor.trim() ? raw.gridColor : initialMapConfig.gridColor
    };
};

const MapContext = createContext<MapContextType | undefined>(undefined);

export const MapProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { broadcast, isHost, currentAdventureId, isConnected } = usePeer();

    // Helper to get safe ID
    const safeAdventureId = currentAdventureId || 'default';

    const [config, setLocalConfig] = useState<MapConfig>(initialMapConfig);
    const [tokens, setTokens] = useState<MapToken[]>([]);
    const [walls, setWalls] = useState<Wall[]>([]);
    const [interactionMode, setInteractionMode] = useState<MapInteractionMode>('select');

    const [loadedAdventureId, setLoadedAdventureId] = useState<string | null>(null);
    const mapDbId = useRef<number | null>(null);
    const tokensRef = useRef<MapToken[]>([]);
    useEffect(() => { tokensRef.current = tokens; }, [tokens]);

    // M4: Latest state ref so event listeners never tear down / re-register on every token drag
    const stateRef = useRef({
        config,
        tokens,
        walls,
        isHost,
        isConnected,
        loadedAdventureId,
        safeAdventureId
    });
    useEffect(() => {
        stateRef.current = {
            config,
            tokens,
            walls,
            isHost,
            isConnected,
            loadedAdventureId,
            safeAdventureId
        };
    }, [config, tokens, walls, isHost, isConnected, loadedAdventureId, safeAdventureId]);

    const broadcastRef = useRef(broadcast);
    useEffect(() => { broadcastRef.current = broadcast; }, [broadcast]);

    // N1: Coalesce simultaneous SYNC_REQUEST bursts into a single full_sync
    const syncReplyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const pendingHostReconnectSyncRef = useRef<boolean>(false);

    // Load Data from Dexie IndexedDB (with M2 cancellation flag)
    useEffect(() => {
        let cancelled = false;

        const loadMapData = async () => {
            if (!safeAdventureId) return;

            setLoadedAdventureId(prev => (prev !== safeAdventureId ? null : prev));

            try {
                const mapEntry = await db.maps.where('campaignId').equals(safeAdventureId).first();
                if (cancelled) return;

                if (mapEntry) {
                    const cfg = sanitizeMapConfig(mapEntry.config);
                    const validTokens = (mapEntry.tokens || [])
                        .map((t: any) => sanitizeToken(t, cfg.width, cfg.height))
                        .filter((t: any): t is MapToken => t !== null);
                    const validWalls = (mapEntry.walls || [])
                        .map(sanitizeWall)
                        .filter((w: any): w is Wall => w !== null);

                    if (cancelled) return;
                    setLocalConfig(cfg);
                    setTokens(validTokens);
                    setWalls(validWalls);
                    mapDbId.current = mapEntry.id ?? null;
                    console.log(`[MapContext] Loaded map from DB for: ${safeAdventureId}`);
                    setLoadedAdventureId(safeAdventureId);
                } else {
                    if (cancelled) return;
                    setLocalConfig(initialMapConfig);
                    setTokens([]);
                    setWalls([]);
                    mapDbId.current = null;
                    setLoadedAdventureId(safeAdventureId);
                }
            } catch (e) {
                if (!cancelled) {
                    console.error("Error loading map from IndexedDB", e);
                }
            }
        };

        loadMapData();

        return () => {
            cancelled = true;
        };
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

    // Broadcast wrapper
    const sendUpdate = (payload: { type: 'move' | 'add' | 'remove' | 'config' | 'update_token' | 'full_sync' | 'add_wall' | 'update_wall' | 'remove_wall'; data: any }) => {
        broadcastRef.current({ type: 'MAP_UPDATE', payload });
    };

    const setConfig = (newConfig: MapConfig) => {
        const safeConfig = sanitizeMapConfig(newConfig);
        setLocalConfig(safeConfig);
        sendUpdate({ type: 'config', data: safeConfig });
    };

    const addToken = (token: MapToken) => {
        const { width, height } = stateRef.current.config;
        const safe = sanitizeToken(token, width, height);
        if (!safe) return;
        setTokens(prev => [...(prev || []), safe]);
        sendUpdate({ type: 'add', data: safe });
    };

    const updateTokenPosition = (id: string, x: number, y: number) => {
        if (!id || !isValidCoord(x) || !isValidCoord(y)) return;
        const { width, height } = stateRef.current.config;
        const currentList = tokensRef.current || [];
        const target = currentList.find(t => t.id === id);
        const tokenSize = target?.size || 1;
        const safeX = Math.max(0, Math.min(Math.round(x), Math.max(0, width - tokenSize)));
        const safeY = Math.max(0, Math.min(Math.round(y), Math.max(0, height - tokenSize)));

        // M1: Efeito de rede fora do updater do React
        sendUpdate({ type: 'move', data: { id, x: safeX, y: safeY } });
        setTokens(prev => (prev || []).map(t => t.id === id ? { ...t, position: { x: safeX, y: safeY } } : t));
    };

    const updateToken = (id: string, updates: Partial<MapToken>) => {
        if (!id || !updates || typeof updates !== 'object') return;
        const { width, height } = stateRef.current.config;
        setTokens(prev => (prev || []).map(t => {
            if (t.id !== id) return t;
            const merged = { ...t, ...updates, id: t.id };
            return sanitizeToken(merged, width, height) || t;
        }));
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
        if (!id || !updates || typeof updates !== 'object') return;
        setWalls(prev => (prev || []).map(w => {
            if (w.id !== id) return w;
            const merged = { ...w, ...updates, id: w.id };
            return sanitizeWall(merged) || w;
        }));
        sendUpdate({ type: 'update_wall', data: { id, updates } });
    };

    const removeWall = (id: string) => {
        setWalls(prev => (prev || []).filter(w => w.id !== id));
        sendUpdate({ type: 'remove_wall', data: { id } });
    };
    // -----------------------

    // H3: Repopulate server map state when Host reconnects (e.g., after server restart or Wi-Fi blip)
    useEffect(() => {
        const handleHostReconnected = () => {
            const {
                isHost: curIsHost,
                loadedAdventureId: curLoadedId,
                safeAdventureId: curSafeId,
                config: curConfig,
                tokens: curTokens,
                walls: curWalls
            } = stateRef.current;

            if (!curIsHost) return;

            if (curLoadedId === curSafeId) {
                pendingHostReconnectSyncRef.current = false;
                console.log('[MapContext] Host reconnected -> Broadcasting MAP_UPDATE (full_sync)');
                broadcastRef.current({
                    type: 'MAP_UPDATE',
                    payload: {
                        type: 'full_sync',
                        data: { config: curConfig, tokens: curTokens, walls: curWalls }
                    }
                });
            } else {
                // DB load still in flight; flush immediately once loadedAdventureId catches up
                pendingHostReconnectSyncRef.current = true;
            }
        };

        window.addEventListener('rpg_host_reconnected', handleHostReconnected);
        return () => window.removeEventListener('rpg_host_reconnected', handleHostReconnected);
    }, []);

    // Flush deferred Host reconnect sync once DB finishes loading the active adventure
    useEffect(() => {
        if (pendingHostReconnectSyncRef.current && isHost && isConnected && loadedAdventureId === safeAdventureId) {
            pendingHostReconnectSyncRef.current = false;
            console.log('[MapContext] Flushing deferred Host reconnect MAP_UPDATE (full_sync)');
            broadcastRef.current({
                type: 'MAP_UPDATE',
                payload: {
                    type: 'full_sync',
                    data: { config, tokens, walls }
                }
            });
        }
    }, [isHost, isConnected, loadedAdventureId, safeAdventureId, config, tokens, walls]);

    // Listen for Peer Events (M4: stable listener using stateRef; N1: 250ms coalesced SYNC_REQUEST; M3: sanitized merges)
    useEffect(() => {
        const handlePeerEvent = (e: CustomEvent<PeerMessage>) => {
            const detail = e.detail;
            if (!detail) return;

            if (detail.type === 'MAP_UPDATE' && detail.payload) {
                const { type, data } = detail.payload;
                const { width: mapW, height: mapH } = stateRef.current.config;

                switch (type) {
                    case 'add': {
                        const safe = sanitizeToken(data, mapW, mapH);
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
                                const safeX = Math.max(0, Math.min(Math.round(data.x), Math.max(0, mapW - tokenSize)));
                                const safeY = Math.max(0, Math.min(Math.round(data.y), Math.max(0, mapH - tokenSize)));
                                return list.map(t => t.id === data.id ? { ...t, position: { x: safeX, y: safeY } } : t);
                            });
                        }
                        break;
                    case 'update_token':
                        if (data && data.id && data.updates && typeof data.updates === 'object') {
                            setTokens(prev => (prev || []).map(t => {
                                if (t.id !== data.id) return t;
                                const merged = { ...t, ...data.updates, id: t.id };
                                return sanitizeToken(merged, mapW, mapH) || t;
                            }));
                        }
                        break;
                    case 'remove':
                        if (data && data.id) {
                            setTokens(prev => (prev || []).filter(t => t.id !== data.id));
                        }
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
                        if (data && data.id && data.updates && typeof data.updates === 'object') {
                            setWalls(prev => (prev || []).map(w => {
                                if (w.id !== data.id) return w;
                                const merged = { ...w, ...data.updates, id: w.id };
                                return sanitizeWall(merged) || w;
                            }));
                        }
                        break;
                    case 'remove_wall':
                        if (data && data.id) {
                            setWalls(prev => (prev || []).filter(w => w.id !== data.id));
                        }
                        break;

                    case 'config':
                        if (data && typeof data === 'object') {
                            setLocalConfig(sanitizeMapConfig(data));
                        }
                        break;
                    case 'full_sync': {
                        if (!data || typeof data !== 'object') break;
                        console.log('[MapContext] Received Full Sync');
                        const syncConfig = sanitizeMapConfig(data.config);
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
            } else if (detail.type === 'SYNC_REQUEST' && stateRef.current.isHost) {
                const req = detail.payload;
                if (req && req.target === 'MAP') {
                    // N1: Coalesce multiple SYNC_REQUESTs within 250ms into a single full_sync broadcast
                    if (!syncReplyTimerRef.current) {
                        syncReplyTimerRef.current = setTimeout(() => {
                            syncReplyTimerRef.current = null;
                            const {
                                isHost: curIsHost,
                                config: curConfig,
                                tokens: curTokens,
                                walls: curWalls
                            } = stateRef.current;
                            if (!curIsHost) return;
                            console.log('[MapContext] Coalesced SYNC_REQUEST -> Broadcasting single Full State');
                            broadcastRef.current({
                                type: 'MAP_UPDATE',
                                payload: {
                                    type: 'full_sync',
                                    data: { config: curConfig, tokens: curTokens, walls: curWalls }
                                }
                            });
                        }, 250);
                    }
                }
            }
        };

        window.addEventListener('rpg_peer_event' as any, handlePeerEvent);
        return () => {
            window.removeEventListener('rpg_peer_event' as any, handlePeerEvent);
            if (syncReplyTimerRef.current) {
                clearTimeout(syncReplyTimerRef.current);
                syncReplyTimerRef.current = null;
            }
        };
    }, []);

    const forceSync = () => {
        if (isHost) {
            broadcast({ type: 'MAP_UPDATE', payload: { type: 'full_sync', data: { config, tokens, walls } } });
        }
    };

    const setFullState = (newConfig: MapConfig, newTokens: MapToken[], newWalls: Wall[]) => {
        const validConfig = sanitizeMapConfig(newConfig);
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
        if (!character || !character.id || !character.hp) return;

        setTokens(prevTokens => {
            let hasChanges = false;
            const newTokens = prevTokens.map(t => {
                if (t.characterId === character.id) {
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
    }, []);

    useEffect(() => {
        if (!isHost) return;

        // A. Listen for Local Saves (GM editing Sheet)
        const handleLocalSave = (e: Event) => {
            const char = (e as CustomEvent).detail;
            handleCharacterUpdateForTokens(char);
        };

        // B. Listen for Remote Updates (Player editing Sheet)
        const handleRemoteEvent = (e: Event) => {
            const data = (e as CustomEvent).detail;
            if (data?.type === 'PLAYER_UPDATE' && data.payload?.character) {
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
