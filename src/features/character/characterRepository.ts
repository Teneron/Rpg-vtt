import { type Character, initialCharacter } from './characterTypes';
import { db } from '../../db/RPGDatabase';

const STORAGE_KEY_PREFIX = 'rpg_char_';
const INDEX_KEY = 'rpg_char_index';
const MIGRATION_FLAG_KEY = 'rpg_char_migrated_v2';

export interface CharacterSummary {
    id: string;
    name: string;
    race: string;
    class: string;
    level: number;
    adventureId?: string;
}

// In-memory write-through cache for instant synchronous access (critical for UI and canvas)
const characterCache = new Map<string, Character>();
let isInitialized = false;
let initPromise: Promise<void> | null = null;

// Synchronous bootstrap from localStorage so UI has data before async Dexie resolves
if (typeof window !== 'undefined' && window.localStorage) {
    try {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(STORAGE_KEY_PREFIX) && !key.startsWith(INDEX_KEY)) {
                const item = localStorage.getItem(key);
                if (item) {
                    const char = JSON.parse(item);
                    if (char && char.id) {
                        characterCache.set(char.id, char);
                    }
                }
            }
        }
    } catch (e) {
        console.warn('[CharacterRepo] Synchronous cache pre-load skipped:', e);
    }
}

export const CharacterRepository = {
    /**
     * Initializes the repository, migrates legacy localStorage data to Dexie,
     * and hydrates the in-memory cache.
     */
    async init(): Promise<void> {
        if (isInitialized) return;
        if (initPromise) return initPromise;

        initPromise = (async () => {
            try {
                // 1. Transparent migration from localStorage if not already migrated
                const hasMigrated = localStorage.getItem(MIGRATION_FLAG_KEY);
                if (!hasMigrated) {
                    console.log('[CharacterRepo] Performing transparent migration from LocalStorage to Dexie...');
                    const legacyChars: Character[] = [];

                    for (let i = 0; i < localStorage.length; i++) {
                        const key = localStorage.key(i);
                        if (key && key.startsWith(STORAGE_KEY_PREFIX) && !key.startsWith(INDEX_KEY) && key !== MIGRATION_FLAG_KEY) {
                            try {
                                const item = localStorage.getItem(key);
                                if (item) {
                                    const parsed = JSON.parse(item);
                                    if (parsed && parsed.id) {
                                        legacyChars.push(parsed);
                                    }
                                }
                            } catch (parseErr) {
                                console.warn('[CharacterRepo] Corrupted legacy character skipped:', key, parseErr);
                            }
                        }
                    }

                    if (legacyChars.length > 0) {
                        await db.characters.bulkPut(legacyChars);
                        console.log(`[CharacterRepo] Successfully migrated ${legacyChars.length} characters to IndexedDB.`);
                    }

                    localStorage.setItem(MIGRATION_FLAG_KEY, 'true');
                }

                // 2. Hydrate cache from Dexie (the single source of truth)
                const allChars = await db.characters.toArray();
                for (const char of allChars) {
                    characterCache.set(char.id, char);
                }

                isInitialized = true;
            } catch (err) {
                console.error('[CharacterRepo] Failed to initialize from IndexedDB:', err);
            }
        })();

        return initPromise;
    },

    /**
     * Synchronous list of all characters matching owner and adventureId from cache.
     */
    listAll(owner: string, adventureId: string = 'default'): CharacterSummary[] {
        if (!owner) return [];

        const targetOwner = owner || 'default';
        const targetAdvId = adventureId || 'default';
        const summaries: CharacterSummary[] = [];

        for (const char of characterCache.values()) {
            const cOwner = char.owner || 'default';
            const cAdvId = char.adventureId || 'default';
            if (cOwner === targetOwner && cAdvId === targetAdvId) {
                summaries.push({
                    id: char.id,
                    name: char.name || 'Sem Nome',
                    race: char.race,
                    class: char.class,
                    level: char.level,
                    adventureId: cAdvId
                });
            }
        }

        // Trigger background init if not already done
        if (!isInitialized) {
            this.init().catch(console.error);
        }

        return summaries;
    },

    /**
     * Asynchronous version of listAll guaranteeing Dexie synchronization.
     */
    async listAllAsync(owner: string, adventureId: string = 'default'): Promise<CharacterSummary[]> {
        await this.init();
        return this.listAll(owner, adventureId);
    },

    /**
     * Save a character: updates in-memory cache immediately, persists to Dexie,
     * and maintains a fallback in localStorage without throwing on quota exhaustion.
     */
    save(character: Character): void {
        const charToSave: Character = {
            ...character,
            lastModified: Date.now()
        };

        // 1. In-memory cache update (instant)
        characterCache.set(charToSave.id, charToSave);

        // 2. Persist to Dexie (IndexedDB - unlimited quota)
        db.characters.put(charToSave).catch(err => {
            console.error('[CharacterRepo] Failed to persist character to Dexie:', err);
        });

        // 3. Update localStorage fallback (silent catch if 5MB limit is reached)
        try {
            localStorage.setItem(STORAGE_KEY_PREFIX + charToSave.id, JSON.stringify(charToSave));

            const owner = charToSave.owner || 'default';
            const advId = charToSave.adventureId || 'default';
            const index = this.listAll(owner, advId);
            localStorage.setItem(INDEX_KEY + '_' + owner + '_' + advId, JSON.stringify(index));
        } catch {
            // QuotaExceededError is safely swallowed because IndexedDB is our primary store
        }
    },

    /**
     * Asynchronous version of save waiting for IndexedDB completion.
     */
    async saveAsync(character: Character): Promise<void> {
        this.save(character);
        await db.characters.put(character);
    },

    /**
     * Synchronous load from memory cache (or localStorage fallback).
     */
    load(id: string): Character | null {
        if (characterCache.has(id)) {
            return characterCache.get(id)!;
        }

        // Fallback check in localStorage
        try {
            const json = localStorage.getItem(STORAGE_KEY_PREFIX + id);
            if (json) {
                const parsed = JSON.parse(json);
                characterCache.set(id, parsed);
                return parsed;
            }
        } catch (e) {
            console.error('[CharacterRepo] Error loading character fallback ' + id, e);
        }

        // Trigger background init if not already done
        if (!isInitialized) {
            this.init().catch(console.error);
        }

        return null;
    },

    /**
     * Asynchronous load from IndexedDB.
     */
    async loadAsync(id: string): Promise<Character | null> {
        await this.init();
        if (characterCache.has(id)) {
            return characterCache.get(id)!;
        }
        const fromDb = await db.characters.get(id);
        if (fromDb) {
            characterCache.set(id, fromDb);
            return fromDb;
        }
        return this.load(id);
    },

    /**
     * Create a new character for owner/adventure.
     */
    create(owner: string, adventureId: string = 'default'): Character {
        const generateUUID = () => {
            if (typeof crypto !== 'undefined' && crypto.randomUUID) {
                return crypto.randomUUID();
            }
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                const r = Math.random() * 16 | 0;
                const v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        };

        const clone = JSON.parse(JSON.stringify(initialCharacter));
        const newChar: Character = {
            ...clone,
            id: generateUUID(),
            owner: owner || 'default',
            adventureId: adventureId || 'default',
            lastModified: Date.now()
        };

        this.save(newChar);
        return newChar;
    },

    /**
     * Delete a character from cache, Dexie, and localStorage.
     */
    delete(id: string, owner: string, adventureId: string = 'default'): void {
        characterCache.delete(id);

        db.characters.delete(id).catch(err => {
            console.error('[CharacterRepo] Failed to delete character from Dexie:', err);
        });

        try {
            localStorage.removeItem(STORAGE_KEY_PREFIX + id);
            const key = INDEX_KEY + '_' + (owner || 'default') + '_' + adventureId;
            const index = this.listAll(owner, adventureId).filter(c => c.id !== id);
            localStorage.setItem(key, JSON.stringify(index));
        } catch (e) {
            console.error('[CharacterRepo] Error deleting from localStorage fallback:', e);
        }
    },

    /**
     * Asynchronous delete waiting for Dexie completion.
     */
    async deleteAsync(id: string, owner: string, adventureId: string = 'default'): Promise<void> {
        this.delete(id, owner, adventureId);
        await db.characters.delete(id);
    }
};

// Automatically initiate hydration on module load
if (typeof window !== 'undefined') {
    CharacterRepository.init().catch(console.error);
}
