import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { initialMapConfig } from './mapTypes';
import type { Scene } from './mapTypes';
import { usePeer } from '../multiplayer/SocketContext';
import { useMap } from './MapContext';
import { db } from '../../db/RPGDatabase';

interface SceneContextType {
    scenes: Scene[];
    activeSceneId: string | null;
    createScene: (name: string) => Scene;
    updateScene: (id: string, updates: Partial<Scene>) => void;
    deleteScene: (id: string) => void;
    activateScene: (id: string) => void;
    saveCurrentStateAsScene: (sceneId: string) => void;
}

const SceneContext = createContext<SceneContextType | undefined>(undefined);

const persistActiveSceneSelection = (adventureId: string, sceneId: string | null) => {
    if (!adventureId) return;
    try {
        if (sceneId) {
            localStorage.setItem('rpg_active_scene_' + adventureId, sceneId);
        } else {
            localStorage.removeItem('rpg_active_scene_' + adventureId);
        }
    } catch {
        // Ignore storage quota errors
    }

    if (adventureId !== 'default') {
        db.campaigns.update(adventureId, { activeSceneId: sceneId }).catch(err => {
            console.warn('[SceneContext] Failed to persist activeSceneId to campaign:', err);
        });
    }
};

export const SceneProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { currentAdventureId, isHost } = usePeer();
    const { config, tokens, walls, setFullState } = useMap();

    const safeAdventureId = currentAdventureId || '';

    const mapStateRef = useRef({ config, tokens, walls });
    const scenesRef = useRef<Scene[]>([]);
    const lastSavedStateRef = useRef<string>('');

    useEffect(() => {
        mapStateRef.current = { config, tokens, walls };
    }, [config, tokens, walls]);

    const [scenes, setScenes] = useState<Scene[]>([]);
    const [activeSceneId, setActiveSceneId] = useState<string | null>(() => {
        if (!safeAdventureId) return null;
        try {
            return localStorage.getItem('rpg_active_scene_' + safeAdventureId) || null;
        } catch {
            return null;
        }
    });

    useEffect(() => {
        scenesRef.current = scenes;
    }, [scenes]);

    // Load Scenes & Active Scene ID from Dexie IndexedDB (with localStorage instant fallback)
    useEffect(() => {
        if (!safeAdventureId) return;
        let isCancelled = false;
        lastSavedStateRef.current = '';

        let syncStoredId: string | null = null;
        try {
            syncStoredId = localStorage.getItem('rpg_active_scene_' + safeAdventureId);
        } catch {
            syncStoredId = null;
        }

        const loadScenes = async () => {
            try {
                const [savedScenes, campaign] = await Promise.all([
                    db.scenes.where('campaignId').equals(safeAdventureId).toArray(),
                    safeAdventureId !== 'default' ? db.campaigns.get(safeAdventureId) : Promise.resolve(undefined)
                ]);
                if (isCancelled) return;

                setScenes(savedScenes);
                scenesRef.current = savedScenes;

                const candidateId = campaign?.activeSceneId || syncStoredId || null;
                if (candidateId && savedScenes.some(s => s.id === candidateId)) {
                    setActiveSceneId(candidateId);
                    persistActiveSceneSelection(safeAdventureId, candidateId);
                } else if (savedScenes.length === 1) {
                    // Link activeSceneId to initial scene WITHOUT overwriting MapContext (db.maps has fresher live state)
                    const initialId = savedScenes[0].id;
                    setActiveSceneId(initialId);
                    persistActiveSceneSelection(safeAdventureId, initialId);
                } else {
                    setActiveSceneId(null);
                }
            } catch (error) {
                console.error("Error loading scenes from DB:", error);
            }
        };

        loadScenes();
        return () => {
            isCancelled = true;
        };
    }, [safeAdventureId]);

    // Helper to persist scene changes to Dexie while preserving thumbnail, gridSnap, and metadata
    const persistScene = useCallback(async (scene: Scene) => {
        if (!safeAdventureId) return;
        try {
            const existingInMem = scenesRef.current.find(s => s.id === scene.id);
            const existingInDb = await db.scenes.get(scene.id);
            const base = existingInDb || existingInMem;

            const sceneWithExtras = scene as Scene & { gridSnap?: boolean };
            const baseWithExtras = base as (Scene & { gridSnap?: boolean }) | undefined;

            const merged: Scene & { campaignId: string; gridSnap?: boolean } = {
                ...(base || {}),
                ...scene,
                campaignId: safeAdventureId,
                thumbnail: scene.thumbnail !== undefined ? scene.thumbnail : base?.thumbnail,
                gridSnap: sceneWithExtras.gridSnap !== undefined ? sceneWithExtras.gridSnap : baseWithExtras?.gridSnap
            };

            await db.scenes.put(merged as unknown as Scene);
        } catch (e) {
            console.error("Error saving scene:", e);
        }
    }, [safeAdventureId]);

    // Helper to delete scene from Dexie
    const removeSceneFromDb = async (id: string) => {
        try {
            await db.scenes.delete(id);
        } catch (e) {
            console.error("Error deleting scene:", e);
        }
    };

    const createScene = (name: string): Scene => {
        const newScene: Scene = {
            id: crypto.randomUUID(),
            name,
            config: { ...initialMapConfig },
            tokens: [],
            walls: []
        };
        setScenes(prev => {
            const next = [...prev, newScene];
            scenesRef.current = next;
            return next;
        });
        persistScene(newScene);
        return newScene;
    };

    const updateScene = useCallback((id: string, updates: Partial<Scene>) => {
        setScenes(prev => {
            const next = prev.map(s => {
                if (s.id === id) {
                    const sExtras = s as Scene & { gridSnap?: boolean };
                    const uExtras = updates as Partial<Scene> & { gridSnap?: boolean };
                    const updated: Scene & { gridSnap?: boolean } = {
                        ...s,
                        ...updates,
                        thumbnail: updates.thumbnail !== undefined ? updates.thumbnail : s.thumbnail,
                        gridSnap: uExtras.gridSnap !== undefined ? uExtras.gridSnap : sExtras.gridSnap
                    };
                    persistScene(updated);
                    return updated;
                }
                return s;
            });
            scenesRef.current = next;
            return next;
        });
    }, [persistScene]);

    const deleteScene = (id: string) => {
        setScenes(prev => {
            const next = prev.filter(s => s.id !== id);
            scenesRef.current = next;
            return next;
        });
        removeSceneFromDb(id);
        if (activeSceneId === id) {
            setActiveSceneId(null);
            if (safeAdventureId) {
                persistActiveSceneSelection(safeAdventureId, null);
            }
        }
    };

    // Sync LIVE MAP state back into the active Scene entry (without ever overwriting MapContext)
    const syncActiveSceneWithLiveMap = useCallback(async () => {
        if (!isHost || !activeSceneId || !safeAdventureId) return;

        const currentState = {
            config: mapStateRef.current.config || initialMapConfig,
            tokens: mapStateRef.current.tokens || [],
            walls: mapStateRef.current.walls || []
        };

        // Guard against unhydrated MapContext state right after F5 before db.maps resolves
        const existingScene = scenesRef.current.find(s => s.id === activeSceneId);
        const isLiveEmpty = currentState.tokens.length === 0
            && currentState.walls.length === 0
            && !currentState.config.backgroundImage;
        const hadSceneContent = existingScene && (
            (existingScene.tokens?.length || 0) > 0 ||
            (existingScene.walls?.length || 0) > 0 ||
            !!existingScene.config?.backgroundImage
        );

        if (isLiveEmpty && hadSceneContent) {
            const mapInDb = await db.maps.where('campaignId').equals(safeAdventureId).first();
            if (mapInDb && ((mapInDb.tokens?.length || 0) > 0 || (mapInDb.walls?.length || 0) > 0 || !!mapInDb.config?.backgroundImage)) {
                return;
            }
        }

        const stateStr = JSON.stringify(currentState);
        if (stateStr !== lastSavedStateRef.current) {
            updateScene(activeSceneId, currentState);
            lastSavedStateRef.current = stateStr;
        }
    }, [isHost, activeSceneId, safeAdventureId, updateScene]);

    // Debounced sync when live map changes
    useEffect(() => {
        if (!isHost || !activeSceneId || !safeAdventureId) return;

        const debounceTimer = setTimeout(() => {
            syncActiveSceneWithLiveMap().catch(console.error);
        }, 1500);

        return () => clearTimeout(debounceTimer);
    }, [config, tokens, walls, isHost, activeSceneId, safeAdventureId, syncActiveSceneWithLiveMap]);

    // Periodic safety sync every 10s
    useEffect(() => {
        if (!isHost || !activeSceneId || !safeAdventureId) return;

        const timer = setInterval(() => {
            syncActiveSceneWithLiveMap().catch(console.error);
        }, 10000);

        return () => clearInterval(timer);
    }, [activeSceneId, safeAdventureId, isHost, syncActiveSceneWithLiveMap]);

    // Save on Unload (Refresh/Close) preserving thumbnail & gridSnap
    useEffect(() => {
        const handleUnload = () => {
            if (!isHost || !activeSceneId || !safeAdventureId) return;
            const finalState = mapStateRef.current;
            const existingScene = scenesRef.current.find(s => s.id === activeSceneId);
            if (!existingScene) return;

            persistScene({
                ...existingScene,
                id: activeSceneId,
                name: existingScene.name || 'Untitled',
                config: finalState.config,
                tokens: finalState.tokens,
                walls: finalState.walls
            });
        };
        window.addEventListener('beforeunload', handleUnload);
        return () => window.removeEventListener('beforeunload', handleUnload);
    }, [isHost, activeSceneId, safeAdventureId, persistScene]);

    const activateScene = (id: string) => {
        if (activeSceneId === id) {
            return;
        }

        // 1. Auto-Save CURRENT scene before leaving (if we were in one)
        if (activeSceneId) {
            updateScene(activeSceneId, { config, tokens, walls });
        }

        const scene = scenes.find(s => s.id === id);
        if (!scene) return;

        console.log('[SceneContext] Activating Scene (GM):', scene.name);
        setActiveSceneId(id);
        if (safeAdventureId) {
            persistActiveSceneSelection(safeAdventureId, id);
        }

        lastSavedStateRef.current = JSON.stringify({
            config: scene.config || initialMapConfig,
            tokens: scene.tokens || [],
            walls: scene.walls || []
        });

        // 2. EXPLICITLY Hydrate the Live Map
        if (setFullState) {
            setFullState(scene.config, scene.tokens, scene.walls);
        }
    };

    const saveCurrentStateAsScene = (sceneId: string) => {
        if (!sceneId) return;

        updateScene(sceneId, {
            config: config,
            tokens: tokens,
            walls: walls
        });
        console.log('[SceneContext] Saved current state to scene:', sceneId);
        alert(`Cena salva!`);
    };

    return (
        <SceneContext.Provider value={{
            scenes,
            activeSceneId,
            createScene,
            updateScene,
            deleteScene,
            activateScene,
            saveCurrentStateAsScene
        }}>
            {children}
        </SceneContext.Provider>
    );
};

export const useScene = () => {
    const context = useContext(SceneContext);
    if (!context) throw new Error('useScene must be used within SceneProvider');
    return context;
};
