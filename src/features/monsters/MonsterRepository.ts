import type { Monster } from './monsterTypes';
import { MONSTERS_5E } from './data/monsters5e';
import { MONSTERS_WITCHER } from './data/monstersWitcher';
import { MONSTERS_PF2E } from './data/monstersPF2e';
import { MONSTERS_DAGGERHEART } from './data/monstersDaggerheart';
import { db } from '../../db/RPGDatabase';

const STORAGE_KEY = 'rpg_custom_monsters';
const MIGRATION_FLAG_KEY = 'rpg_monsters_migrated_v2';

let customMonstersCache: Monster[] = [];
let isInitialized = false;
let initPromise: Promise<void> | null = null;

// Synchronous bootstrap from localStorage so UI and Canvas have data immediately
if (typeof window !== 'undefined' && window.localStorage) {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) {
                customMonstersCache = parsed;
            }
        }
    } catch (e) {
        console.warn('[MonsterRepo] Synchronous cache pre-load skipped:', e);
    }
}

export class MonsterRepository {
    /**
     * Initializes the repository, migrates legacy localStorage custom monsters to Dexie,
     * and hydrates the in-memory cache.
     */
    static async init(): Promise<void> {
        if (isInitialized) return;
        if (initPromise) return initPromise;

        initPromise = (async () => {
            try {
                // 1. Transparent migration from localStorage
                const hasMigrated = localStorage.getItem(MIGRATION_FLAG_KEY);
                if (!hasMigrated) {
                    console.log('[MonsterRepo] Checking for legacy custom monsters to migrate...');
                    const legacyJson = localStorage.getItem(STORAGE_KEY);
                    if (legacyJson) {
                        try {
                            const parsed: Monster[] = JSON.parse(legacyJson);
                            if (Array.isArray(parsed) && parsed.length > 0) {
                                await db.customMonsters.bulkPut(parsed);
                                console.log(`[MonsterRepo] Successfully migrated ${parsed.length} custom monsters to Dexie.`);
                            }
                        } catch (parseErr) {
                            console.warn('[MonsterRepo] Corrupted legacy monsters skipped:', parseErr);
                        }
                    }
                    localStorage.setItem(MIGRATION_FLAG_KEY, 'true');
                }

                // 2. Hydrate cache from Dexie
                const fromDb = await db.customMonsters.toArray();
                customMonstersCache = fromDb;
                isInitialized = true;
            } catch (err) {
                console.error('[MonsterRepo] Failed to initialize custom monsters from Dexie:', err);
            }
        })();

        return initPromise;
    }

    static getCustomMonsters(campaignId?: string): Monster[] {
        if (!isInitialized) {
            this.init().catch(console.error);
        }
        if (campaignId) {
            return customMonstersCache.filter(m => !m.campaignId || m.campaignId === campaignId);
        }
        return customMonstersCache;
    }

    static saveCustomMonster(monster: Monster) {
        const index = customMonstersCache.findIndex(m => m.id === monster.id);
        if (index >= 0) {
            customMonstersCache[index] = monster;
        } else {
            customMonstersCache.push(monster);
        }

        // Persist to Dexie (IndexedDB)
        db.customMonsters.put(monster).catch(err => {
            console.error('[MonsterRepo] Failed to persist custom monster to Dexie:', err);
        });

        // LocalStorage fallback (swallowing quota errors)
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(customMonstersCache));
        } catch {
            // Ignored if quota exceeded
        }
    }

    static async saveCustomMonsterAsync(monster: Monster): Promise<void> {
        this.saveCustomMonster(monster);
        await db.customMonsters.put(monster);
    }

    static deleteCustomMonster(id: string) {
        customMonstersCache = customMonstersCache.filter(m => m.id !== id);

        // Delete from Dexie
        db.customMonsters.delete(id).catch(err => {
            console.error('[MonsterRepo] Failed to delete custom monster from Dexie:', err);
        });

        // LocalStorage fallback
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(customMonstersCache));
        } catch {
            // Ignored
        }
    }

    static async deleteCustomMonsterAsync(id: string): Promise<void> {
        this.deleteCustomMonster(id);
        await db.customMonsters.delete(id);
    }

    static getAll(filter?: { source?: string; campaignId?: string; system?: string }): Monster[] {
        const custom = this.getCustomMonsters(filter?.campaignId);
        const base5e: Monster[] = MONSTERS_5E || [];
        const baseWitcher: Monster[] = MONSTERS_WITCHER || [];
        const basePf2e: Monster[] = MONSTERS_PF2E || [];
        const baseDaggerheart: Monster[] = MONSTERS_DAGGERHEART || [];

        let all = [...base5e, ...baseWitcher, ...basePf2e, ...baseDaggerheart, ...custom];
        if (filter?.source) {
            all = all.filter(m => m.source === filter.source);
        }
        if (filter?.system) {
            all = all.filter(m => !m.system || m.system === filter.system);
        }

        return all.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }

    static async getAllAsync(filter?: { source?: string; campaignId?: string; system?: string }): Promise<Monster[]> {
        await this.init();
        return this.getAll(filter);
    }

    static getById(id: string): Monster | undefined {
        return this.getAll().find(m => m.id === id);
    }

    static listCategories(): string[] {
        return Array.from(new Set(this.getAll().map(m => m.category))).sort();
    }

    static listSources(): string[] {
        return Array.from(new Set(this.getAll().map(m => m.source))).sort();
    }

    static getTokenUrl(monster: Monster): string {
        if (monster.imageUrl) return monster.imageUrl;

        const cat = (monster.category || '').toLowerCase();
        const name = monster.name.toLowerCase();

        if (name.includes('geralt')) return '/tokens/token_witcher_geralt.png';
        if (name.includes('witcher') || name.includes('bruxo') || cat.includes('bruxo')) return '/tokens/token_witcher.png';
        if (cat.includes('dragon') || cat.includes('dragão')) return '/tokens/token_dragon.png';
        if (cat.includes('undead') || cat.includes('morto-vivo') || cat.includes('espectro')) return '/tokens/token_undead.png';
        if (cat.includes('beast') || cat.includes('besta') || cat.includes('animal')) return '/tokens/token_beast.png';
        if (cat.includes('humanoid') || cat.includes('humanoide')) return '/tokens/token_humanoid.png';

        return '/tokens/token_default.png';
    }
}

// Automatically initiate hydration on module load
if (typeof window !== 'undefined') {
    MonsterRepository.init().catch(console.error);
}
