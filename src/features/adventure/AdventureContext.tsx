import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, type Campaign, type AssetData, type RollLogEntry } from '../../db/RPGDatabase';
import { AdventureRepository } from './adventureRepository'; // Kept for migration
import { CampaignStorage } from '../../services/CampaignStorage'; // Kept for migration
import { SYSTEM_SCENARIOS } from './data/systemScenarios';
import { useMultiplayer } from '../multiplayer/SocketContext';
import { MonsterRepository } from '../monsters/MonsterRepository';
import { CharacterRepository } from '../character/characterRepository';

// Alias Campaign to Adventure for backward compatibility
export type Adventure = Campaign;

export interface AdventureSummary {
    id: string;
    name: string;
    system?: string;
    description?: string;
    settings?: Campaign['settings'];
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
    assets?: any[];
    rollLogs?: RollLogEntry[];
}

interface AdventureContextType {
    currentAdventure: Adventure | null;
    adventures: AdventureSummary[];
    loadAdventure: (id: string) => Promise<void>;
    createAdventure: (name: string, system?: string, customId?: string, settings?: Campaign['settings']) => Promise<Adventure>;
    deleteAdventure: (id: string) => Promise<void>;
    closeAdventure: () => void;
    updateAdventurePatch: (patch: Partial<Campaign>) => Promise<void>;
    updateAdventureJournal: (journal: string, description?: string) => Promise<void>;
    rebindAdventureId: (oldId: string, newId: string) => Promise<Adventure | null>;
    exportCampaign: (campaignId: string) => Promise<string>;
    downloadCampaignBackup: (campaignId: string) => Promise<void>;
    importCampaign: (jsonString: string, options?: { newId?: string }) => Promise<Campaign>;
    isLoading: boolean;
}

const AdventureContext = createContext<AdventureContextType | undefined>(undefined);

const normalizeSystemKey = (sys?: string | null): string => {
    if (!sys) return '';
    const lower = sys.toLowerCase();
    if (lower === 'dnd5e' || lower === 'dnd55e' || lower === '5e' || lower === '5.5e') {
        return 'dnd55e';
    }
    return lower;
};

const blobToDataUrl = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        if (typeof FileReader !== 'undefined') {
            const reader = new FileReader();
            reader.onloadend = () => resolve(typeof reader.result === 'string' ? reader.result : '');
            reader.onerror = () => reject(reader.error || new Error('Falha ao ler Blob de asset'));
            reader.readAsDataURL(blob);
        } else {
            blob.arrayBuffer().then(buf => {
                const bytes = new Uint8Array(buf);
                let binary = '';
                for (let i = 0; i < bytes.byteLength; i++) {
                    binary += String.fromCharCode(bytes[i]);
                }
                const mime = blob.type || 'application/octet-stream';
                resolve(`data:${mime};base64,${btoa(binary)}`);
            }).catch(reject);
        }
    });
};

const generateUniqueCampaignCode = async (prefix: 'DND-' | 'WTC-'): Promise<string> => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    for (let attempt = 0; attempt < 50; attempt++) {
        let code = '';
        for (let i = 0; i < 4; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        const candidate = `${prefix}${code}`;
        const existing = await db.campaigns.get(candidate);
        if (!existing) {
            return candidate;
        }
    }
    return `${prefix}${Date.now().toString(36).slice(-4).toUpperCase()}`;
};

const reloadAllRepositories = async (): Promise<void> => {
    await MonsterRepository.reloadFromDb();
    const charRepoWithReload = CharacterRepository as typeof CharacterRepository & {
        reloadFromDb?: () => Promise<void>;
    };
    if (typeof charRepoWithReload.reloadFromDb === 'function') {
        await charRepoWithReload.reloadFromDb();
    }
};

export const AdventureProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { currentAdventureId, currentAdventureName, isHost, roomSystem } = useMultiplayer();
    const [currentAdventure, setCurrentAdventure] = useState<Adventure | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const currentAdventureRef = useRef<Adventure | null>(null);
    useEffect(() => {
        currentAdventureRef.current = currentAdventure;
    }, [currentAdventure]);

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
                            const exists = await db.campaigns.get(fullAdv.id);
                            if (!exists) {
                                await db.campaigns.add({
                                    id: fullAdv.id,
                                    name: fullAdv.name,
                                    createdAt: fullAdv.createdAt,
                                    updatedAt: fullAdv.updatedAt,
                                    logs: fullAdv.logs || []
                                });

                                const mapConfig = CampaignStorage.get(fullAdv.id, 'map_config');
                                const mapTokens = CampaignStorage.get(fullAdv.id, 'map_tokens');
                                const mapWalls = CampaignStorage.get(fullAdv.id, 'map_walls');

                                await db.maps.add({
                                    campaignId: fullAdv.id,
                                    name: 'Default Map',
                                    config: mapConfig || { width: 20, height: 20, gridSize: 50, scale: 1, offsetX: 0, offsetY: 0, backgroundColor: '#222', gridColor: '#444', fogEnabled: true, globalLight: 'dim' },
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

    // Auto-restore currentAdventure after F5 or room connection so RollHistoryContext & Journal persist seamlessly
    useEffect(() => {
        let isCancelled = false;

        const restoreActiveAdventure = async () => {
            let savedSession: any = null;
            try {
                const raw = localStorage.getItem('rpg_session');
                if (raw) savedSession = JSON.parse(raw);
            } catch {
                // Ignore corrupted session cache
            }

            const targetId = currentAdventureId || savedSession?.adventureId || savedSession?.roomId || null;
            if (!targetId || targetId === 'default') return;

            if (currentAdventureRef.current?.id === targetId) return;

            try {
                const existing = await db.campaigns.get(targetId);
                if (isCancelled) return;

                if (existing) {
                    // Merge any dedicated rollLogs entries so roll history is always up to date after F5
                    const storedRolls = await db.rollLogs.where('campaignId').equals(targetId).toArray();
                    if (isCancelled) return;

                    let mergedLogs = existing.logs || [];
                    if (storedRolls.length > 0) {
                        const byId = new Map<string, any>();
                        for (const r of mergedLogs) {
                            if (r && r.id) byId.set(r.id, r);
                        }
                        for (const r of storedRolls) {
                            if (r && r.id && !byId.has(r.id)) {
                                const { campaignId: _cid, ...cleanRoll } = r;
                                byId.set(r.id, cleanRoll);
                            }
                        }
                        mergedLogs = Array.from(byId.values()).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
                    }

                    setCurrentAdventure({
                        ...existing,
                        logs: mergedLogs
                    });
                    return;
                }

                // If Host is in a room whose Campaign record doesn't exist yet in db.campaigns, auto-create it safely
                const effectiveIsHost = isHost || !!savedSession?.isHost;
                if (effectiveIsHost) {
                    const effectiveSystem = roomSystem
                        || savedSession?.system
                        || (String(targetId).toUpperCase().startsWith('WTC') ? 'witcher' : 'dnd55e');
                    const effectiveName = currentAdventureName
                        || savedSession?.adventureName
                        || `Campanha [${targetId}]`;

                    const existingMapCount = await db.maps.where('campaignId').equals(targetId).count();
                    const existingScene = await db.scenes.where('campaignId').equals(targetId).first();
                    if (isCancelled) return;

                    if (existingMapCount > 0) {
                        const createdRecord: Adventure = {
                            id: targetId,
                            name: effectiveName,
                            system: effectiveSystem,
                            activeSceneId: existingScene?.id || null,
                            createdAt: Date.now(),
                            updatedAt: Date.now(),
                            logs: []
                        };
                        await db.campaigns.put(createdRecord);
                        if (!isCancelled) {
                            setCurrentAdventure(createdRecord);
                        }
                    } else {
                        const scenario = SYSTEM_SCENARIOS[effectiveSystem] || SYSTEM_SCENARIOS.dnd55e || SYSTEM_SCENARIOS.witcher || SYSTEM_SCENARIOS.dnd5e;
                        const initialSceneId = crypto.randomUUID();
                        const createdRecord: Adventure = {
                            id: targetId,
                            name: effectiveName,
                            system: effectiveSystem,
                            activeSceneId: initialSceneId,
                            createdAt: Date.now(),
                            updatedAt: Date.now(),
                            logs: []
                        };
                        await db.campaigns.put(createdRecord);
                        await db.maps.add({
                            campaignId: targetId,
                            name: scenario.scene.name,
                            config: { ...scenario.scene.config },
                            tokens: JSON.parse(JSON.stringify(scenario.scene.tokens)),
                            walls: JSON.parse(JSON.stringify(scenario.scene.walls))
                        });
                        await db.scenes.put({
                            ...scenario.scene,
                            id: initialSceneId,
                            campaignId: targetId
                        } as any);
                        try {
                            localStorage.setItem('rpg_active_scene_' + targetId, initialSceneId);
                        } catch { /* ignore */ }
                        if (!isCancelled) {
                            setCurrentAdventure(createdRecord);
                        }
                    }
                }
            } catch (err) {
                console.error('[AdventureContext] Failed to auto-restore currentAdventure:', err);
            }
        };

        restoreActiveAdventure();

        return () => {
            isCancelled = true;
        };
    }, [currentAdventureId, currentAdventureName, isHost, roomSystem]);

    const createAdventure = async (name: string, system: string = 'dnd55e', customId?: string, settings?: Campaign['settings']): Promise<Adventure> => {
        const id = customId || crypto.randomUUID();
        const initialSceneId = crypto.randomUUID();
        const newAdv: Adventure = {
            id,
            name,
            system,
            settings: settings || { startingLevel: 1 },
            activeSceneId: initialSceneId,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            logs: []
        };

        await db.campaigns.put(newAdv);

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
        await db.scenes.put({
            ...scenario.scene,
            id: initialSceneId,
            campaignId: id
        } as any);

        try {
            localStorage.setItem('rpg_active_scene_' + id, initialSceneId);
        } catch {
            // Ignore storage quota errors
        }

        setCurrentAdventure(newAdv);
        return newAdv;
    };

    const loadAdventure = async (id: string) => {
        setIsLoading(true);
        try {
            const adv = await db.campaigns.get(id);
            if (adv) {
                const storedRolls = await db.rollLogs.where('campaignId').equals(id).toArray();
                let mergedLogs = adv.logs || [];
                if (storedRolls.length > 0) {
                    const byId = new Map<string, any>();
                    for (const r of mergedLogs) {
                        if (r && r.id) byId.set(r.id, r);
                    }
                    for (const r of storedRolls) {
                        if (r && r.id && !byId.has(r.id)) {
                            const { campaignId: _cid, ...cleanRoll } = r;
                            byId.set(r.id, cleanRoll);
                        }
                    }
                    mergedLogs = Array.from(byId.values()).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
                }
                setCurrentAdventure({
                    ...adv,
                    logs: mergedLogs
                });
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

    const updateAdventurePatch = useCallback(async (patch: Partial<Campaign>): Promise<void> => {
        const activeAdv = currentAdventureRef.current;
        const targetId = activeAdv?.id || currentAdventureId;
        if (!targetId) return;

        const updatedFields: Partial<Campaign> = {
            ...patch,
            updatedAt: Date.now()
        };

        try {
            const updatedCount = await db.campaigns.update(targetId, updatedFields);
            if (updatedCount === 0) {
                const existingInDb = await db.campaigns.get(targetId);
                if (existingInDb) {
                    await db.campaigns.update(targetId, updatedFields);
                } else if (activeAdv) {
                    await db.campaigns.put({
                        ...activeAdv,
                        ...updatedFields,
                        id: targetId
                    });
                }
            }
            setCurrentAdventure(prev => {
                if (!prev || prev.id !== targetId) return prev;
                return {
                    ...prev,
                    ...updatedFields
                };
            });
        } catch (e) {
            console.error('[AdventureContext] Error updating adventure patch:', e);
        }
    }, [currentAdventureId]);

    const updateAdventureJournal = useCallback(async (journal: string, description?: string): Promise<void> => {
        const patch: Partial<Campaign> = { journal };
        if (description !== undefined) {
            patch.description = description;
        }
        await updateAdventurePatch(patch);
    }, [updateAdventurePatch]);

    const rebindAdventureId = useCallback(async (oldId: string, newId: string): Promise<Adventure | null> => {
        if (!oldId || !newId) return null;
        if (oldId === newId) {
            const existing = await db.campaigns.get(oldId);
            if (existing) setCurrentAdventure(existing);
            return existing || null;
        }

        const existing = await db.campaigns.get(oldId);
        if (!existing) return null;

        const updatedCampaign: Campaign = {
            ...existing,
            id: newId,
            updatedAt: Date.now()
        };

        await db.transaction('rw', [db.campaigns, db.maps, db.scenes, db.assets, db.characters, db.customMonsters, db.rollLogs], async () => {
            await db.campaigns.put(updatedCampaign);
            await db.maps.where('campaignId').equals(oldId).modify({ campaignId: newId });
            await db.scenes.where('campaignId').equals(oldId).modify({ campaignId: newId } as any);
            await db.assets.where('campaignId').equals(oldId).modify({ campaignId: newId });
            await db.characters.where('adventureId').equals(oldId).modify({ adventureId: newId });
            await db.customMonsters.where('campaignId').equals(oldId).modify({ campaignId: newId });
            await db.rollLogs.where('campaignId').equals(oldId).modify({ campaignId: newId });
            await db.campaigns.delete(oldId);
        });

        try {
            const oldSceneId = localStorage.getItem('rpg_active_scene_' + oldId);
            if (oldSceneId) {
                localStorage.setItem('rpg_active_scene_' + newId, oldSceneId);
                localStorage.removeItem('rpg_active_scene_' + oldId);
            }
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith('rpg_char_') && !key.startsWith('rpg_char_index') && key !== 'rpg_char_migrated_v2') {
                    const raw = localStorage.getItem(key);
                    if (raw) {
                        const parsed = JSON.parse(raw);
                        if (parsed && parsed.adventureId === oldId) {
                            parsed.adventureId = newId;
                            localStorage.setItem(key, JSON.stringify(parsed));
                        }
                    }
                }
            }
        } catch {
            // Ignore localStorage fallback errors
        }

        await reloadAllRepositories();
        setCurrentAdventure(updatedCampaign);
        return updatedCampaign;
    }, []);

    const deleteAdventure = async (id: string) => {
        if (currentAdventure?.id === id) {
            setCurrentAdventure(null);
        }
        try {
            await db.transaction('rw', [db.campaigns, db.maps, db.scenes, db.assets, db.characters, db.customMonsters, db.rollLogs], async () => {
                await db.maps.where('campaignId').equals(id).delete();
                await db.scenes.where('campaignId').equals(id).delete();
                await db.assets.where('campaignId').equals(id).delete();
                await db.characters.where('adventureId').equals(id).delete();
                await db.customMonsters.where('campaignId').equals(id).delete();
                await db.rollLogs.where('campaignId').equals(id).delete();
                await db.campaigns.delete(id);
            });

            // Clean up localStorage keys tied to this campaign
            try {
                const keysToRemove: string[] = [];
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (!key) continue;
                    if (key === `rpg_active_scene_${id}` || (key.startsWith('rpg_char_index_') && key.endsWith(`_${id}`))) {
                        keysToRemove.push(key);
                    } else if (key.startsWith('rpg_char_') && !key.startsWith('rpg_char_index') && key !== 'rpg_char_migrated_v2') {
                        try {
                            const raw = localStorage.getItem(key);
                            if (raw) {
                                const parsed = JSON.parse(raw);
                                if (parsed && parsed.adventureId === id) {
                                    keysToRemove.push(key);
                                }
                            }
                        } catch {
                            // Ignore malformed entry
                        }
                    }
                }
                keysToRemove.forEach(k => localStorage.removeItem(k));
            } catch (lsErr) {
                console.warn('[AdventureContext] Error cleaning localStorage for deleted campaign:', lsErr);
            }

            await reloadAllRepositories();
        } catch (e) {
            console.error("Error deleting campaign:", e);
        }
    };

    const exportCampaign = async (campaignId: string): Promise<string> => {
        const campaign = await db.campaigns.get(campaignId);
        if (!campaign) {
            throw new Error(`Campanha com ID "${campaignId}" não encontrada.`);
        }

        const [maps, scenes, allCustomMonsters, campCharacters, rawAssets, rollLogs] = await Promise.all([
            db.maps.where('campaignId').equals(campaignId).toArray(),
            db.scenes.where('campaignId').equals(campaignId).toArray(),
            db.customMonsters.toArray(),
            db.characters.where('adventureId').equals(campaignId).toArray(),
            db.assets.where('campaignId').equals(campaignId).toArray(),
            db.rollLogs.where('campaignId').equals(campaignId).toArray()
        ]);

        // Include custom monsters belonging to this campaign PLUS legacy unscoped custom monsters of matching system
        const campSystemNorm = normalizeSystemKey(
            campaign.system || (campaignId.toUpperCase().startsWith('WTC-') ? 'witcher' : 'dnd55e')
        );
        const customMonsters = allCustomMonsters.filter(m => {
            if (m.campaignId === campaignId) return true;
            if (!m.campaignId || m.campaignId === 'default') {
                return !m.system || normalizeSystemKey(m.system) === campSystemNorm;
            }
            return false;
        });

        // Also include any characters explicitly referenced by tokens on maps/scenes of this campaign
        const charMap = new Map<string, any>();
        for (const c of campCharacters) {
            if (c && c.id) charMap.set(c.id, c);
        }
        const referencedCharIds = new Set<string>();
        for (const m of maps) {
            for (const t of (m.tokens || [])) {
                if (t?.characterId && !charMap.has(t.characterId)) {
                    referencedCharIds.add(t.characterId);
                }
            }
        }
        for (const s of scenes) {
            for (const t of (s.tokens || [])) {
                if (t?.characterId && !charMap.has(t.characterId)) {
                    referencedCharIds.add(t.characterId);
                }
            }
        }
        if (referencedCharIds.size > 0) {
            const extraChars = await db.characters.bulkGet(Array.from(referencedCharIds));
            for (const ec of extraChars) {
                if (ec && ec.id) charMap.set(ec.id, ec);
            }
        }
        const characters = Array.from(charMap.values());

        // Serialize assets (converting any Blob to Base64 DataURL string)
        const serializedAssets = await Promise.all(
            rawAssets.map(async ({ id: _assetId, ...asset }) => {
                let serializedData: string | Blob = asset.data;
                if (typeof Blob !== 'undefined' && asset.data instanceof Blob) {
                    serializedData = await blobToDataUrl(asset.data);
                }
                return {
                    ...asset,
                    data: serializedData
                };
            })
        );

        // Remove auto-increment ID from maps to avoid insertion conflicts on import
        const sanitizedMaps = maps.map(({ id: _mapId, ...m }) => m);

        const bundle: CampaignBundle = {
            version: 2,
            type: 'rpg-campaign-backup',
            exportedAt: Date.now(),
            campaign,
            maps: sanitizedMaps,
            scenes,
            customMonsters,
            characters,
            assets: serializedAssets,
            rollLogs
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

        const rawOrigId = String(originalCampaign.id || '').trim();
        const exists = rawOrigId ? await db.campaigns.get(rawOrigId) : undefined;
        const prefix: 'WTC-' | 'DND-' = (
            originalCampaign.system === 'witcher' ||
            rawOrigId.toUpperCase().startsWith('WTC-')
        ) ? 'WTC-' : 'DND-';

        const isValidRoomCodeFormat = /^[A-Z0-9-]+$/.test(rawOrigId) && (rawOrigId.startsWith('DND-') || rawOrigId.startsWith('WTC-'));
        const targetCampaignId = options?.newId
            || ((exists || !isValidRoomCodeFormat) ? await generateUniqueCampaignCode(prefix) : rawOrigId);
        const isNewId = targetCampaignId !== originalCampaign.id;

        // 1. Build ID remap tables to prevent global PK collisions across campaigns
        const charIdMap = new Map<string, string>();
        const charactersToSave: any[] = [];
        for (const c of (parsed.characters || [])) {
            const oldId = c.id;
            let finalId = oldId || crypto.randomUUID();
            if (oldId) {
                if (isNewId) {
                    finalId = crypto.randomUUID();
                } else {
                    const existingChar = await db.characters.get(oldId);
                    if (existingChar && existingChar.adventureId !== targetCampaignId) {
                        finalId = crypto.randomUUID();
                    }
                }
                if (finalId !== oldId) {
                    charIdMap.set(oldId, finalId);
                }
            }
            charactersToSave.push({
                ...c,
                id: finalId,
                adventureId: targetCampaignId
            });
        }

        const monsterIdMap = new Map<string, string>();
        const inferredSystem = originalCampaign.system === 'witcher' || targetCampaignId.startsWith('WTC-')
            ? 'witcher'
            : (originalCampaign.system || 'dnd55e');
        const monstersToSave: any[] = [];
        for (const m of (parsed.customMonsters || [])) {
            const oldId = m.id;
            let finalId = oldId || crypto.randomUUID();
            if (oldId) {
                if (isNewId) {
                    finalId = crypto.randomUUID();
                } else {
                    const existingMonster = await db.customMonsters.get(oldId);
                    if (existingMonster && existingMonster.campaignId !== targetCampaignId) {
                        finalId = crypto.randomUUID();
                    }
                }
                if (finalId !== oldId) {
                    monsterIdMap.set(oldId, finalId);
                }
            }
            monstersToSave.push({
                ...m,
                id: finalId,
                campaignId: targetCampaignId,
                system: m.system || inferredSystem
            });
        }

        const remapTokens = (tokens: any[] | undefined): any[] => {
            if (!Array.isArray(tokens)) return [];
            return tokens.map(t => {
                if (!t || typeof t !== 'object') return t;
                const nextToken = { ...t };
                if (nextToken.characterId && charIdMap.has(nextToken.characterId)) {
                    nextToken.characterId = charIdMap.get(nextToken.characterId);
                }
                if (nextToken.monsterId && monsterIdMap.has(nextToken.monsterId)) {
                    nextToken.monsterId = monsterIdMap.get(nextToken.monsterId);
                }
                return nextToken;
            });
        };

        const sceneIdMap = new Map<string, string>();
        const scenesToSave: any[] = [];
        for (const s of (parsed.scenes || [])) {
            const oldId = s.id;
            let finalId = oldId || crypto.randomUUID();
            if (oldId) {
                if (isNewId) {
                    finalId = crypto.randomUUID();
                } else {
                    const existingScene = await db.scenes.get(oldId) as any;
                    if (existingScene && existingScene.campaignId !== targetCampaignId) {
                        finalId = crypto.randomUUID();
                    }
                }
                if (finalId !== oldId) {
                    sceneIdMap.set(oldId, finalId);
                }
            }
            scenesToSave.push({
                ...s,
                id: finalId,
                campaignId: targetCampaignId,
                tokens: remapTokens(s.tokens)
            });
        }

        const mapsToSave = (parsed.maps || []).map((m: any) => {
            const { id: _unusedMapId, ...rest } = m;
            return {
                ...rest,
                campaignId: targetCampaignId,
                tokens: remapTokens(rest.tokens)
            };
        });

        const assetsToSave: AssetData[] = (parsed.assets || []).map((a: any) => {
            const { id: _unusedAssetId, ...rest } = a;
            return {
                ...rest,
                campaignId: targetCampaignId
            };
        });

        const rollLogsToSave: RollLogEntry[] = [];
        for (const r of (parsed.rollLogs || [])) {
            const oldId = r.id;
            let finalId = oldId || crypto.randomUUID();
            if (oldId) {
                if (isNewId) {
                    finalId = crypto.randomUUID();
                } else {
                    const existingLog = await db.rollLogs.get(oldId);
                    if (existingLog && existingLog.campaignId !== targetCampaignId) {
                        finalId = crypto.randomUUID();
                    }
                }
            }
            rollLogsToSave.push({
                ...r,
                id: finalId,
                campaignId: targetCampaignId
            });
        }

        const remappedActiveSceneId = originalCampaign.activeSceneId
            ? (sceneIdMap.get(originalCampaign.activeSceneId) || originalCampaign.activeSceneId)
            : (scenesToSave.length === 1 ? scenesToSave[0].id : (originalCampaign.activeSceneId ?? null));

        const remappedCombatState = originalCampaign.combatState
            ? {
                ...originalCampaign.combatState,
                combatants: Array.isArray(originalCampaign.combatState.combatants)
                    ? originalCampaign.combatState.combatants.map((cb: any) => {
                        if (!cb || typeof cb !== 'object') return cb;
                        const nextCb = { ...cb };
                        if (nextCb.characterId && charIdMap.has(nextCb.characterId)) {
                            nextCb.characterId = charIdMap.get(nextCb.characterId);
                        }
                        if (nextCb.monsterId && monsterIdMap.has(nextCb.monsterId)) {
                            nextCb.monsterId = monsterIdMap.get(nextCb.monsterId);
                        }
                        return nextCb;
                    })
                    : []
            }
            : originalCampaign.combatState;

        const shouldAppendImportSuffix = !!exists && !originalCampaign.name.includes('(Importada)');
        const campaignToSave: Campaign = {
            ...originalCampaign,
            id: targetCampaignId,
            system: inferredSystem,
            name: shouldAppendImportSuffix ? `${originalCampaign.name} (Importada)` : originalCampaign.name,
            activeSceneId: remappedActiveSceneId,
            combatState: remappedCombatState,
            updatedAt: Date.now()
        };

        // Atomic Dexie transaction across all 7 collections
        await db.transaction(
            'rw',
            [db.campaigns, db.maps, db.scenes, db.customMonsters, db.characters, db.assets, db.rollLogs],
            async () => {
                if (!isNewId) {
                    await db.maps.where('campaignId').equals(targetCampaignId).delete();
                    await db.assets.where('campaignId').equals(targetCampaignId).delete();
                }
                await db.campaigns.put(campaignToSave);
                if (mapsToSave.length > 0) await db.maps.bulkAdd(mapsToSave);
                if (scenesToSave.length > 0) await db.scenes.bulkPut(scenesToSave);
                if (monstersToSave.length > 0) await db.customMonsters.bulkPut(monstersToSave);
                if (charactersToSave.length > 0) await db.characters.bulkPut(charactersToSave);
                if (assetsToSave.length > 0) await db.assets.bulkAdd(assetsToSave);
                if (rollLogsToSave.length > 0) await db.rollLogs.bulkPut(rollLogsToSave);
            }
        );

        if (remappedActiveSceneId) {
            try {
                localStorage.setItem('rpg_active_scene_' + targetCampaignId, remappedActiveSceneId);
            } catch {
                // Ignore storage quota errors
            }
        }

        // Reload in-memory caches immediately so UI reflects imported monsters and characters without F5
        await reloadAllRepositories();

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
            updateAdventurePatch,
            updateAdventureJournal,
            rebindAdventureId,
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
