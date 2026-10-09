import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, type Campaign } from '../../db/RPGDatabase';
import { AdventureRepository } from './adventureRepository'; // Kept for migration
import { CampaignStorage } from '../../services/CampaignStorage'; // Kept for migration
import { SYSTEM_SCENARIOS } from './data/systemScenarios';

// Alias Campaign to Adventure for backward compatibility
export type Adventure = Campaign;

export interface AdventureSummary {
    id: string;
    name: string;
    createdAt: number;
    updatedAt: number;
}

interface AdventureContextType {
    currentAdventure: Adventure | null;
    adventures: AdventureSummary[];
    loadAdventure: (id: string) => Promise<void>;
    createAdventure: (name: string, system?: string, customId?: string) => Promise<Adventure>;
    deleteAdventure: (id: string) => Promise<void>;
    closeAdventure: () => void;
    isLoading: boolean;
}

const AdventureContext = createContext<AdventureContextType | undefined>(undefined);

export const AdventureProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentAdventure, setCurrentAdventure] = useState<Adventure | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Live Query for List (Automatic Reactivity)
    const adventures = useLiveQuery(() => db.campaigns.orderBy('updatedAt').reverse().toArray(), []) || [];

    // Migration Logic (Check on Mount)
    useEffect(() => {
        const checkMigration = async () => {
            const migratedKey = 'rpg_migrated_v1';
            if (localStorage.getItem(migratedKey)) return;

            console.log('[AdventureContext] Checking for legacy data to migrate...');
            const legacyAdventures = AdventureRepository.listAll();

            if (legacyAdventures.length > 0) {
                console.log(`[AdventureContext] Found ${legacyAdventures.length} legacy adventures. Migrating...`);
                let count = 0;
                for (const leg of legacyAdventures) {
                    const fullAdv = AdventureRepository.load(leg.id);
                    if (fullAdv) {
                        try {
                            // Check if already exists?
                            const exists = await db.campaigns.get(fullAdv.id);
                            if (!exists) {
                                await db.campaigns.add({
                                    id: fullAdv.id,
                                    name: fullAdv.name,
                                    createdAt: fullAdv.createdAt,
                                    updatedAt: fullAdv.updatedAt,
                                    logs: fullAdv.logs || []
                                });

                                // Migrate Map Data?
                                const mapConfig = CampaignStorage.get(fullAdv.id, 'map_config');
                                const mapTokens = CampaignStorage.get(fullAdv.id, 'map_tokens');
                                const mapWalls = CampaignStorage.get(fullAdv.id, 'map_walls');

                                // Only create map entry if there is data OR if it's a valid legacy adventure
                                await db.maps.add({
                                    campaignId: fullAdv.id,
                                    name: 'Default Map',
                                    config: mapConfig || { width: 20, height: 20, gridSize: 50, scale: 1, offsetX: 0, offsetY: 0, backgroundColor: '#222', gridColor: '#444', fogEnabled: true, globalLight: 'dim' }, // Use sensible defaults if missing
                                    tokens: mapTokens || [],
                                    walls: mapWalls || []
                                });
                                count++;
                            }
                        } catch (e) {
                            console.error(`Error migrating adventure ${leg.name}:`, e);
                        }
                    }
                }
                console.log(`[AdventureContext] Migration complete. Moved ${count} adventures.`);
            }

            localStorage.setItem(migratedKey, 'true');
        };

        checkMigration();
    }, []);

    const createAdventure = async (name: string, system: string = 'dnd55e', customId?: string): Promise<Adventure> => {
        const id = customId || crypto.randomUUID();
        const newAdv: Adventure = {
            id,
            name,
            system,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            logs: []
        };

        await db.campaigns.add(newAdv);

        // Initialize with authentic system scenario, map layout, walls and monsters
        const scenario = SYSTEM_SCENARIOS[system] || SYSTEM_SCENARIOS.dnd55e || SYSTEM_SCENARIOS.witcher || SYSTEM_SCENARIOS.dnd5e;
        const initialMapConfig = { ...scenario.scene.config };
        const initialTokens = JSON.parse(JSON.stringify(scenario.scene.tokens));
        const initialWalls = JSON.parse(JSON.stringify(scenario.scene.walls));

        await db.maps.add({
            campaignId: id,
            name: scenario.scene.name,
            config: initialMapConfig,
            tokens: initialTokens,
            walls: initialWalls
        });

        // Also save as an initial scene in Scene list for the GM
        await db.scenes.add({
            ...scenario.scene,
            id: crypto.randomUUID(),
            campaignId: id
        } as any);

        setCurrentAdventure(newAdv);
        return newAdv;
    };

    const loadAdventure = async (id: string) => {
        setIsLoading(true);
        try {
            const adv = await db.campaigns.get(id);
            if (adv) {
                setCurrentAdventure(adv);
            } else {
                console.error("Adventure not found:", id);
            }
        } catch (e) {
            console.error("Error loading adventure:", e);
        } finally {
            setIsLoading(false);
        }
    };

    const closeAdventure = () => {
        setCurrentAdventure(null);
    };

    const deleteAdventure = async (id: string) => {
        if (currentAdventure?.id === id) {
            setCurrentAdventure(null);
        }
        try {
            await db.transaction('rw', [db.campaigns, db.maps, db.scenes, db.assets, db.characters, db.customMonsters], async () => {
                await db.maps.where('campaignId').equals(id).delete();
                await db.scenes.where('campaignId').equals(id).delete();
                await db.assets.where('campaignId').equals(id).delete();
                await db.characters.where('adventureId').equals(id).delete();
                await db.customMonsters.where('campaignId').equals(id).delete();
                await db.campaigns.delete(id);
            });
        } catch (e) {
            console.error("Error deleting campaign:", e);
        }
    };

    return (
        <AdventureContext.Provider value={{
            currentAdventure,
            adventures,
            loadAdventure,
            createAdventure,
            deleteAdventure,
            closeAdventure,
            isLoading
        }}>
            {children}
        </AdventureContext.Provider>
    );
};

export const useAdventure = () => {
    const context = useContext(AdventureContext);
    if (!context) throw new Error('useAdventure must be used within AdventureProvider');
    return context;
};
