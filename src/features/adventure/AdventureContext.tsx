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

export interface CampaignBundle {
    version: number;
    type: 'rpg-campaign-backup';
    exportedAt: number;
    campaign: Campaign;
    maps: any[];
    scenes: any[];
    customMonsters: any[];
    characters: any[];
}

interface AdventureContextType {
    currentAdventure: Adventure | null;
    adventures: AdventureSummary[];
    loadAdventure: (id: string) => Promise<void>;
    createAdventure: (name: string, system?: string, customId?: string) => Promise<Adventure>;
    deleteAdventure: (id: string) => Promise<void>;
    closeAdventure: () => void;
    exportCampaign: (campaignId: string) => Promise<string>;
    downloadCampaignBackup: (campaignId: string) => Promise<void>;
    importCampaign: (jsonString: string, options?: { newId?: string }) => Promise<Campaign>;
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

    const exportCampaign = async (campaignId: string): Promise<string> => {
        const campaign = await db.campaigns.get(campaignId);
        if (!campaign) {
            throw new Error(`Campanha com ID "${campaignId}" não encontrada.`);
        }

        const [maps, scenes, customMonsters, characters] = await Promise.all([
            db.maps.where('campaignId').equals(campaignId).toArray(),
            db.scenes.where('campaignId').equals(campaignId).toArray(),
            db.customMonsters.where('campaignId').equals(campaignId).toArray(),
            db.characters.where('adventureId').equals(campaignId).toArray()
        ]);

        // Remove auto-increment ID from maps to avoid insertion conflicts on import
        const sanitizedMaps = maps.map(({ id, ...m }) => m);

        const bundle: CampaignBundle = {
            version: 1,
            type: 'rpg-campaign-backup',
            exportedAt: Date.now(),
            campaign,
            maps: sanitizedMaps,
            scenes,
            customMonsters,
            characters
        };

        return JSON.stringify(bundle, null, 2);
    };

    const downloadCampaignBackup = async (campaignId: string): Promise<void> => {
        const jsonStr = await exportCampaign(campaignId);
        const campaign = await db.campaigns.get(campaignId);
        const safeName = (campaign?.name || 'campanha').trim().replace(/[^a-zA-Z0-9_-]/g, '_');
        const filename = `${safeName}_backup.json`;

        const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const importCampaign = async (jsonString: string, options?: { newId?: string }): Promise<Campaign> => {
        let parsed: any;
        try {
            parsed = JSON.parse(jsonString);
        } catch (e: any) {
            throw new Error('Arquivo JSON inválido: ' + (e?.message || 'erro de leitura'));
        }

        if (!parsed || parsed.type !== 'rpg-campaign-backup' || !parsed.campaign) {
            throw new Error('Formato de backup de campanha inválido. Estrutura não reconhecida.');
        }

        const originalCampaign: Campaign = parsed.campaign;
        if (!originalCampaign.name) {
            throw new Error('A campanha importada não possui um nome válido.');
        }

        const exists = await db.campaigns.get(originalCampaign.id);
        const targetCampaignId = options?.newId || (exists ? crypto.randomUUID() : originalCampaign.id);
        const isNewId = targetCampaignId !== originalCampaign.id;

        const campaignToSave: Campaign = {
            ...originalCampaign,
            id: targetCampaignId,
            name: isNewId ? `${originalCampaign.name} (Importada)` : originalCampaign.name,
            updatedAt: Date.now()
        };

        const mapsToSave = (parsed.maps || []).map((m: any) => {
            const { id: _, ...rest } = m;
            return {
                ...rest,
                campaignId: targetCampaignId
            };
        });

        const scenesToSave = (parsed.scenes || []).map((s: any) => ({
            ...s,
            campaignId: targetCampaignId,
            id: isNewId ? crypto.randomUUID() : (s.id || crypto.randomUUID())
        }));

        const monstersToSave = (parsed.customMonsters || []).map((m: any) => ({
            ...m,
            campaignId: targetCampaignId,
            id: isNewId ? crypto.randomUUID() : (m.id || crypto.randomUUID())
        }));

        const charactersToSave = (parsed.characters || []).map((c: any) => ({
            ...c,
            adventureId: targetCampaignId,
            id: isNewId ? crypto.randomUUID() : (c.id || crypto.randomUUID())
        }));

        // Atomic Dexie transaction across all collections
        await db.transaction('rw', [db.campaigns, db.maps, db.scenes, db.customMonsters, db.characters], async () => {
            await db.campaigns.put(campaignToSave);
            if (mapsToSave.length > 0) await db.maps.bulkAdd(mapsToSave);
            if (scenesToSave.length > 0) await db.scenes.bulkPut(scenesToSave);
            if (monstersToSave.length > 0) await db.customMonsters.bulkPut(monstersToSave);
            if (charactersToSave.length > 0) await db.characters.bulkPut(charactersToSave);
        });

        setCurrentAdventure(campaignToSave);
        return campaignToSave;
    };

    return (
        <AdventureContext.Provider value={{
            currentAdventure,
            adventures,
            loadAdventure,
            createAdventure,
            deleteAdventure,
            closeAdventure,
            exportCampaign,
            downloadCampaignBackup,
            importCampaign,
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
