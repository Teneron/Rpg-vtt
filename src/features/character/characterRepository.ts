import { type Character, initialCharacter } from './characterTypes';

const STORAGE_KEY_PREFIX = 'rpg_char_';
const INDEX_KEY = 'rpg_char_index'; // List of IDs

export interface CharacterSummary {
    id: string;
    name: string;
    race: string;
    class: string;
    level: number;
    adventureId?: string; // Debug/Display
}

export const CharacterRepository = {
    // List all characters for a specific owner AND adventure
    listAll(owner: string, adventureId: string = 'default'): CharacterSummary[] {
        if (!owner) return [];
        try {
            const key = INDEX_KEY + '_' + owner + '_' + adventureId;
            const indexJson = localStorage.getItem(key);
            return indexJson ? JSON.parse(indexJson) : [];
        } catch (e) {
            console.error("Error loading character index for " + owner, e);
            return [];
        }
    },

    // Save a character (and update index for its owner/adventure)
    save(character: Character) {
        try {
            // 1. Save Full Data (Global UUID key, assumed unique)
            localStorage.setItem(STORAGE_KEY_PREFIX + character.id, JSON.stringify(character));

            // 2. Update Index (Scoped by Owner AND Adventure)
            const owner = character.owner || 'default';
            const advId = character.adventureId || 'default';
            const index = this.listAll(owner, advId);

            const summary: CharacterSummary = {
                id: character.id,
                name: character.name || 'Sem Nome',
                race: character.race,
                class: character.class,
                level: character.level,
                adventureId: advId
            };

            const existingIndex = index.findIndex(c => c.id === character.id);
            if (existingIndex >= 0) {
                index[existingIndex] = summary;
            } else {
                index.push(summary);
            }

            localStorage.setItem(INDEX_KEY + '_' + owner + '_' + advId, JSON.stringify(index));
        } catch (e) {
            console.error("Error saving character", e);
        }
    },

    // Load full character data
    load(id: string): Character | null {
        try {
            const json = localStorage.getItem(STORAGE_KEY_PREFIX + id);
            if (!json) return null;
            return JSON.parse(json);
        } catch (e) {
            console.error("Error loading character " + id, e);
            return null;
        }
    },

    // Create a new character for an owner/adventure
    create(owner: string, adventureId: string = 'default'): Character {
        // Fallback or Polyfill for UUID if crypto is missing (common in HTTP LAN)
        const generateUUID = () => {
            if (typeof crypto !== 'undefined' && crypto.randomUUID) {
                return crypto.randomUUID();
            }
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        };

        // CRITICAL FIX: Deep clone initialCharacter to prevent reference pollution
        // 'initialCharacter' has nested objects (attributes, skills, etc.)
        // Spread operator only did shallow copy.
        const clone = JSON.parse(JSON.stringify(initialCharacter));

        const newChar: Character = {
            ...clone,
            id: generateUUID(),
            owner: owner || 'default',
            adventureId: adventureId || 'default'
        };

        this.save(newChar);
        return newChar;
    },

    // Delete character
    delete(id: string, owner: string, adventureId: string = 'default') {
        try {
            localStorage.removeItem(STORAGE_KEY_PREFIX + id);

            const key = INDEX_KEY + '_' + (owner || 'default') + '_' + adventureId;
            const index = this.listAll(owner, adventureId).filter(c => c.id !== id);

            localStorage.setItem(key, JSON.stringify(index));
        } catch (e) {
            console.error("Error deleting character", e);
        }
    }
};
