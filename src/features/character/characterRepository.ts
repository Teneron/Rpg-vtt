import { type Character, initialCharacter, regenerateCharacterStats } from './characterTypes';
import type { CharacterPreset } from './data/characterPresets';
import { db } from '../../db/RPGDatabase';

const STORAGE_KEY_PREFIX = 'rpg_char_';
const INDEX_KEY = 'rpg_char_index';
const MIGRATION_FLAG_KEY = 'rpg_char_migrated_v2';

export interface CharacterSummary {
    id: string;
    name: string;
    race?: string;
    class?: string;
    level?: number;
    adventureId?: string;
    system?: string;
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

const dispatchCharactersUpdated = () => {
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('rpg_characters_updated'));
    }
};

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

                // 2. Hydrate cache from Dexie (the single source of truth) respeitando lastModified
                const allChars = await db.characters.toArray();
                for (const char of allChars) {
                    const existing = characterCache.get(char.id);
                    if (!existing || (char.lastModified || 0) >= (existing.lastModified || 0)) {
                        characterCache.set(char.id, char);
                    } else if (existing && (existing.lastModified || 0) > (char.lastModified || 0)) {
                        // Cache mais recente que o banco (ex: editado antes do término do init assíncrono)
                        await db.characters.put(existing);
                    }
                }

                isInitialized = true;
                dispatchCharactersUpdated();
            } catch (err) {
                console.error('[CharacterRepo] Failed to initialize from IndexedDB:', err);
            }
        })();

        return initPromise;
    },

    /**
     * Reloads the in-memory character cache directly from IndexedDB (Dexie),
     * used after campaign backup import or campaign deletion.
     */
    async reloadFromDb(): Promise<void> {
        if (!isInitialized) {
            await this.init();
        }

        try {
            characterCache.clear();
            const allChars = await db.characters.toArray();
            for (const char of allChars) {
                if (char && char.id) {
                    characterCache.set(char.id, char);
                }
            }

            // Remove orphaned localStorage fallback entries that were deleted from Dexie
            if (typeof window !== 'undefined' && window.localStorage) {
                try {
                    const keysToRemove: string[] = [];
                    for (let i = 0; i < localStorage.length; i++) {
                        const key = localStorage.key(i);
                        if (key && key.startsWith(STORAGE_KEY_PREFIX) && !key.startsWith(INDEX_KEY) && key !== MIGRATION_FLAG_KEY) {
                            const id = key.slice(STORAGE_KEY_PREFIX.length);
                            if (id && !characterCache.has(id)) {
                                keysToRemove.push(key);
                            }
                        }
                    }
                    keysToRemove.forEach(k => localStorage.removeItem(k));
                } catch {
                    // Ignore localStorage cleanup errors
                }
            }

            isInitialized = true;
            dispatchCharactersUpdated();
        } catch (err) {
            console.error('[CharacterRepo] Failed to reload characters from IndexedDB:', err);
        }
    },

    /**
     * Synchronous list of all characters matching owner and adventureId from cache.
     * Resilient and non-destructive: prioritizes matching owner/adventure, but ensures
     * that all characters saved in local storage remain accessible and never vanish.
     */
    listAll(owner?: string, adventureId: string = 'default'): CharacterSummary[] {
        const targetOwner = (owner || '').trim().toLowerCase();
        const targetAdvId = (adventureId || 'default').trim().toLowerCase();
        const summaries: CharacterSummary[] = [];
        const seenIds = new Set<string>();

        const toSummary = (char: Character): CharacterSummary => ({
            id: char.id,
            name: char.name || 'Sem Nome',
            race: char.race || '',
            class: char.class || '',
            level: typeof char.level === 'number' && Number.isFinite(char.level) ? char.level : 1,
            adventureId: char.adventureId || 'default',
            system: char.system
        });

        // 1. Exact matches: owner AND adventureId
        for (const char of characterCache.values()) {
            if (!char || !char.id || seenIds.has(char.id)) continue;
            const cOwner = (char.owner || 'default').trim().toLowerCase();
            const cAdvId = (char.adventureId || 'default').trim().toLowerCase();

            if (targetOwner && cOwner === targetOwner && cAdvId === targetAdvId) {
                seenIds.add(char.id);
                summaries.push(toSummary(char));
            }
        }

        // 2. Owner matches across other adventures (so the player can use their characters in any room!)
        if (targetOwner) {
            for (const char of characterCache.values()) {
                if (!char || !char.id || seenIds.has(char.id)) continue;
                const cOwner = (char.owner || 'default').trim().toLowerCase();
                if (cOwner === targetOwner) {
                    seenIds.add(char.id);
                    summaries.push(toSummary(char));
                }
            }
        }

        // 3. Characters matching this adventureId (even if owner nickname was slightly different)
        if (targetAdvId && targetAdvId !== 'default') {
            for (const char of characterCache.values()) {
                if (!char || !char.id || seenIds.has(char.id)) continue;
                const cAdvId = (char.adventureId || 'default').trim().toLowerCase();
                if (cAdvId === targetAdvId) {
                    seenIds.add(char.id);
                    summaries.push(toSummary(char));
                }
            }
        }

        // 4. Fallback: Include all characters stored locally on this client so nothing is ever hidden or lost
        for (const char of characterCache.values()) {
            if (!char || !char.id || seenIds.has(char.id)) continue;
            seenIds.add(char.id);
            summaries.push(toSummary(char));
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
    async listAllAsync(owner?: string, adventureId: string = 'default'): Promise<CharacterSummary[]> {
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
     * Persists the exact stamped record from characterCache so lastModified is never reverted.
     */
    async saveAsync(character: Character): Promise<void> {
        this.save(character);
        const charToPersist = characterCache.get(character.id) || { ...character, lastModified: Date.now() };
        await db.characters.put(charToPersist);
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
    create(owner: string, adventureId: string = 'default', system: string = 'dnd5e'): Character {
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
            owner: (owner || 'default').trim(),
            adventureId: adventureId || 'default',
            system,
            lastModified: Date.now()
        };

        this.save(newChar);
        dispatchCharactersUpdated();
        return newChar;
    },

    /**
     * Create a character from an official system preset template.
     */
    createFromPreset(preset: CharacterPreset, owner: string, adventureId: string = 'default'): Character {
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

        const clone: any = JSON.parse(JSON.stringify(preset));
        delete clone.presetId;
        delete clone.systemName;
        delete clone.badgeIcon;
        delete clone.roleDescription;
        delete clone.quote;

        const newChar: Character = {
            ...clone,
            id: generateUUID(),
            owner: (owner || 'default').trim(),
            adventureId: adventureId || 'default',
            lastModified: Date.now()
        };

        this.save(newChar);
        dispatchCharactersUpdated();
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

        dispatchCharactersUpdated();
    },

    /**
     * Asynchronous delete waiting for Dexie completion.
     */
    async deleteAsync(id: string, owner: string, adventureId: string = 'default'): Promise<void> {
        this.delete(id, owner, adventureId);
        await db.characters.delete(id);
    },

    /**
     * Export a character as formatted JSON string with versioned backup envelope.
     */
    exportCharacter(id: string): string {
        const char = this.load(id);
        if (!char) {
            throw new Error(`Personagem com ID "${id}" não encontrado no cache ou banco.`);
        }

        const backupPayload = {
            version: 1,
            type: 'rpg-character-backup',
            exportedAt: Date.now(),
            character: char
        };

        return JSON.stringify(backupPayload, null, 2);
    },

    /**
     * Import a character from JSON string, validating fields, generating a new UUID to prevent collisions,
     * binding to given owner and adventureId, and regenerating derived stats.
     */
    async importCharacter(jsonString: string, owner: string, adventureId: string = 'default'): Promise<Character> {
        let parsed: any;
        try {
            parsed = JSON.parse(jsonString);
        } catch (e: any) {
            throw new Error('Arquivo JSON inválido ou corrompido: ' + (e?.message || 'erro de leitura'));
        }

        if (parsed && (parsed.type === 'rpg-campaign-backup' || (parsed.campaign && Array.isArray(parsed.maps)))) {
            throw new Error("Este arquivo é um Backup de Campanha. Use 'Importar Aventura' no painel do Mestre.");
        }

        // Support both enveloped backup and direct Character object
        const rawChar: any = (parsed && parsed.type === 'rpg-character-backup' && parsed.character)
            ? parsed.character
            : parsed;

        if (!rawChar || typeof rawChar !== 'object' || Array.isArray(rawChar)) {
            throw new Error('Conteúdo do arquivo não corresponde a uma ficha de personagem válida.');
        }

        if (!rawChar.name || typeof rawChar.name !== 'string' || !rawChar.name.trim()) {
            throw new Error('A ficha importada não possui um nome válido.');
        }

        if (rawChar.attributes !== undefined && (typeof rawChar.attributes !== 'object' || Array.isArray(rawChar.attributes))) {
            throw new Error('A ficha importada não possui estrutura de atributos válida.');
        }

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

        // Deep merge with initialCharacter base template to ensure missing nested fields exist
        const baseClone: Character = JSON.parse(JSON.stringify(initialCharacter));
        const rawAttrs = (rawChar.attributes && typeof rawChar.attributes === 'object') ? rawChar.attributes : {};
        const mergedAttributes: Character['attributes'] = {
            str: { ...baseClone.attributes.str, ...(rawAttrs.str || {}) },
            dex: { ...baseClone.attributes.dex, ...(rawAttrs.dex || {}) },
            con: { ...baseClone.attributes.con, ...(rawAttrs.con || {}) },
            int: { ...baseClone.attributes.int, ...(rawAttrs.int || {}) },
            wis: { ...baseClone.attributes.wis, ...(rawAttrs.wis || {}) },
            cha: { ...baseClone.attributes.cha, ...(rawAttrs.cha || {}) }
        };

        const mergedChar: Character = {
            ...baseClone,
            ...rawChar,
            attributes: mergedAttributes,
            hp: { ...baseClone.hp, ...(rawChar.hp && typeof rawChar.hp === 'object' ? rawChar.hp : {}) },
            hitDice: { ...baseClone.hitDice, ...(rawChar.hitDice && typeof rawChar.hitDice === 'object' ? rawChar.hitDice : {}) },
            deathSaves: { ...baseClone.deathSaves, ...(rawChar.deathSaves && typeof rawChar.deathSaves === 'object' ? rawChar.deathSaves : {}) },
            currency: { ...baseClone.currency, ...(rawChar.currency && typeof rawChar.currency === 'object' ? rawChar.currency : {}) },
            spellSlots: { ...baseClone.spellSlots, ...(rawChar.spellSlots && typeof rawChar.spellSlots === 'object' ? rawChar.spellSlots : {}) },
            skills: Array.isArray(rawChar.skills) ? rawChar.skills : baseClone.skills,
            inventory: Array.isArray(rawChar.inventory) ? rawChar.inventory : [],
            spells: Array.isArray(rawChar.spells) ? rawChar.spells : [],
            feats: Array.isArray(rawChar.feats) ? rawChar.feats : [],
            features: Array.isArray(rawChar.features) ? rawChar.features : [],
            classResources: Array.isArray(rawChar.classResources) ? rawChar.classResources : [],
            proficiencies: Array.isArray(rawChar.proficiencies) ? rawChar.proficiencies : [],
            languages: Array.isArray(rawChar.languages) ? rawChar.languages : ['Comum'],
            conditions: Array.isArray(rawChar.conditions) ? rawChar.conditions : [],
            id: generateUUID(), // Always generate a fresh UUID to avoid overwriting existing characters
            owner: (owner || 'default').trim(),
            adventureId: adventureId || 'default',
            lastModified: Date.now()
        };

        const finalChar = regenerateCharacterStats(mergedChar);
        await this.saveAsync(finalChar);
        dispatchCharactersUpdated();
        return finalChar;
    },

    /**
     * Download character backup file in browser via Blob and anchor.
     */
    downloadCharacterFile(character: Character): void {
        const jsonStr = this.exportCharacter(character.id);
        const sanitizedName = (character.name || 'personagem').trim().replace(/[^a-zA-Z0-9_-]/g, '_');
        const filename = `${sanitizedName}_ficha.json`;

        const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
};

// Automatically initiate hydration on module load
if (typeof window !== 'undefined') {
    CharacterRepository.init().catch(console.error);
}
