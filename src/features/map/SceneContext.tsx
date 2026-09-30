import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialMapConfig } from './mapTypes';
import type { Scene } from './mapTypes';
import { sanitizePayload } from '../../utils/firebaseUtils';
import { usePeer } from '../multiplayer/FirebaseContext';
import { useMap } from './MapContext';
import { db } from '../../db/RPGDatabase';
import { database } from '../../services/firebase';
import { ref, set, onValue, remove } from 'firebase/database';

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

export const SceneProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { currentAdventureId, isHost } = usePeer();
    const { config, tokens, walls, setFullState } = useMap() as any; // Cast to any until we update MapContext interface

    // Refs for Auto-Save to avoid stale closures in effects/listeners
    const mapStateRef = React.useRef({ config, tokens, walls });
    const lastSavedStateRef = React.useRef<string>(''); // For Dirty Check
    useEffect(() => {
        mapStateRef.current = { config, tokens, walls };
    }, [config, tokens, walls]);

    const [scenes, setScenes] = useState<Scene[]>([]);
    const [activeSceneId, setActiveSceneId] = useState<string | null>(null);

    // Load Scenes from Dexie AND Sync with Firebase
    useEffect(() => {
        if (!currentAdventureId) return;

        // 1. Load Local
        const loadScenes = async () => {
            try {
                const savedScenes = await db.scenes.where('campaignId').equals(currentAdventureId).toArray();
                setScenes(savedScenes);
            } catch (error) {
                console.error("Error loading scenes from DB:", error);
            }
        };
        loadScenes();

        // 2. Listen to Firebase (Cloud Source of Truth)
        const scenesRef = ref(database, `adventures/${currentAdventureId}/scenes`);
        const unsub = onValue(scenesRef, async (snapshot) => {
            const val = snapshot.val();
            if (val) {
                const cloudScenes: Scene[] = Object.values(val);
                console.log('[SceneContext] Syncing from Cloud...', cloudScenes.length);

                // Update Local DB (Dexie) with Cloud Data
                await db.transaction('rw', db.scenes, async () => {
                    for (const s of cloudScenes) {
                        await db.scenes.put({ ...s, campaignId: currentAdventureId } as any);
                    }
                });

                // Update State
                setScenes(cloudScenes);
            }
        });

        return () => unsub();
    }, [currentAdventureId]);

    // Helper to persist scene changes
    const persistScene = async (scene: Scene) => {
        if (!currentAdventureId) return;
        try {
            // 1. Save to Local Dexie (Optimistic)
            await db.scenes.put({ ...scene, campaignId: currentAdventureId } as any);

            // 2. Save to Firebase (Cloud Persistence)
            // SAFETY CHECK: Verify payload size roughly
            const jsonSize = JSON.stringify(scene).length;
            if (jsonSize > 10000000) { // ~10MB safety limit (Firebase absolute max)
                // Keeping silent as requested.
            }

            const sceneRef = ref(database, `adventures/${currentAdventureId}/scenes/${scene.id}`);
            // SANITIZE: Remove undefined values to prevent Firebase rejection
            const safeScene = sanitizePayload(scene);
            await set(sceneRef, safeScene);
        } catch (e) {
            console.error("Error saving scene:", e);
        }
    };

    // Helper to delete scene
    const removeSceneFromDb = async (id: string) => {
        try {
            await db.scenes.delete(id);
            if (currentAdventureId) {
                const sceneRef = ref(database, `adventures/${currentAdventureId}/scenes/${id}`);
                await remove(sceneRef);
            }
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
        // State update happens via listener or optimistic?
        // Let's do optimistic
        setScenes(prev => [...prev, newScene]);
        persistScene(newScene);
        return newScene;
    };

    const updateScene = (id: string, updates: Partial<Scene>) => {
        // SAFETY CHECK: Prevent massive Base64 strings from crashing Firebase
        // Firebase has a 10MB limit per write. We limit background images to ~5MB to allow room for other data.
        if (updates.config?.backgroundImage && updates.config.backgroundImage.length > 5000000) {
            // console.warn('[SceneContext] Background Image > 5MB. This may cause sync issues, but trying anyway.');
        }

        setScenes(prev => prev.map(s => {
            if (s.id === id) {
                const updated = { ...s, ...updates };
                persistScene(updated);
                return updated;
            }
            return s;
        }));
    };

    const deleteScene = (id: string) => {
        setScenes(prev => prev.filter(s => s.id !== id));
        removeSceneFromDb(id);
        if (activeSceneId === id) setActiveSceneId(null);
    };

    // 3. Listen to Active Scene ID (Global State) - JUST FOR UI/SYNC
    useEffect(() => {
        if (!currentAdventureId) return;
        const activeRef = ref(database, `adventures/${currentAdventureId}/state/activeSceneId`);
        const unsub = onValue(activeRef, (snapshot) => {
            const cloudActiveId = snapshot.val();
            if (cloudActiveId && cloudActiveId !== activeSceneId) {
                // Just update the pointer, DO NOT RESET THE MAP
                setActiveSceneId(cloudActiveId);
            }
        });
        return () => unsub();
    }, [currentAdventureId, activeSceneId]);

    // 4. AUTO-SAVE & SYNC:

    // Periodically sync the LIVE MAP state back to the SCENE LIBRARY Entry
    // This ensures that if we crash or refresh, the "Scene" entity is up to date,
    // not just the "Live Map" entity.
    useEffect(() => {
        if (!activeSceneId || !currentAdventureId) return;

        const timer = setInterval(() => {
            // OPTIMIZATION: ONLY HOST SAVES
            if (!isHost) return;

            if (activeSceneId) {
                const currentState = {
                    config: mapStateRef.current.config || initialMapConfig,
                    tokens: mapStateRef.current.tokens || [],
                    walls: mapStateRef.current.walls || []
                };

                // OPTIMIZATION: DIRTY CHECK
                // Calculate simple checksum/string of the critical data
                // We use JSON.stringify but we can exclude some volatile fields if needed.
                const stateStr = JSON.stringify(currentState);

                if (stateStr !== lastSavedStateRef.current) {
                    console.log('[SceneContext] Auto-Syncing Active Scene (Changes Detected)...');
                    updateScene(activeSceneId, currentState);
                    lastSavedStateRef.current = stateStr;
                }
            }
        }, 10000); // Every 10 seconds

        return () => clearInterval(timer);
    }, [activeSceneId, currentAdventureId, isHost]);

    // 5. Save on Unload (Refresh/Close)
    useEffect(() => {
        const handleUnload = () => {
            if (activeSceneId && currentAdventureId) {
                // Attempt to save synchronously? No, async is best we can do.
                // Firebase REST API via navigator.sendBeacon might be better but let's try direct update.
                // Note: React state might be gone, rely on Ref.
                const finalState = mapStateRef.current;
                console.log('[SceneContext] Unload Save...', activeSceneId);
                // We can't easily await here, but we can trigger the update.
                // Direct DB put if possible?
                // updateScene is async-ish.
                persistScene({
                    id: activeSceneId,
                    name: scenes.find(s => s.id === activeSceneId)?.name || 'Untitled',
                    ...finalState
                } as Scene);
            }
        };
        window.addEventListener('beforeunload', handleUnload);
        return () => window.removeEventListener('beforeunload', handleUnload);
    }, [activeSceneId, currentAdventureId, scenes]);

    // PREVIOUSLY: Effect to hydrate map from scene
    // REMOVED: We do not want to auto-load scene data onto the live map 
    // just because the ID changed or we refreshed. 
    // The Live Map (MapContext) is the Source of Truth.

    const activateScene = (id: string) => {
        // 1. Auto-Save CURRENT scene before leaving (if we were in one)
        if (activeSceneId) {
            // We can optionally save the current state back to the OLD scene before switching
            // But for now, let's just switch.
            // Ideally: updateScene(activeSceneId, { config, tokens, walls }); 
            // But 'config/tokens/walls' here might be stale if we don't pull from MapContext.
            // MapContext passed them in config/tokens/walls props earlier? 
            // Yes, pulled from useMap(). So they are current.
            updateScene(activeSceneId, { config, tokens, walls });
        }

        const scene = scenes.find(s => s.id === id);
        if (!scene) return;

        console.log('[SceneContext] Activating Scene (GM):', scene.name);
        setActiveSceneId(id);

        // 2. EXPLICITLY Hydrate the Live Map
        // This overwrites the current live map with the Scene's stored data
        if (setFullState) {
            setFullState(scene.config, scene.tokens, scene.walls);
        }

        // 3. Persist Global Choice to Firebase
        if (currentAdventureId) {
            const activeRef = ref(database, `adventures/${currentAdventureId}/state/activeSceneId`);
            set(activeRef, id);
        }
    };

    const saveCurrentStateAsScene = (sceneId: string) => {
        if (!sceneId) return;

        updateScene(sceneId, {
            config: config,
            tokens: tokens, // Current tokens
            walls: walls    // Current walls
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
