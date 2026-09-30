import type { RollEvent } from '../dice/RollHistoryContext';

export interface Adventure {
    id: string;
    name: string;
    createdAt: number;
    updatedAt: number;
    logs: RollEvent[];
}

export interface AdventureSummary {
    id: string;
    name: string;
    createdAt: number;
    updatedAt: number;
}

const STORAGE_KEY_PREFIX = 'rpg_adv_';
const INDEX_KEY = 'rpg_adv_index';

export const AdventureRepository = {
    // List all adventures (metadata)
    listAll(): AdventureSummary[] {
        try {
            const indexJson = localStorage.getItem(INDEX_KEY);
            return indexJson ? JSON.parse(indexJson) : [];
        } catch (e) {
            console.error("Error loading adventure index", e);
            return [];
        }
    },

    // Load full adventure
    load(id: string): Adventure | null {
        try {
            const json = localStorage.getItem(STORAGE_KEY_PREFIX + id);
            return json ? JSON.parse(json) : null;
        } catch (e) {
            console.error("Error loading adventure " + id, e);
            return null;
        }
    },

    // Save/Update full adventure
    save(adventure: Adventure) {
        try {
            adventure.updatedAt = Date.now();
            localStorage.setItem(STORAGE_KEY_PREFIX + adventure.id, JSON.stringify(adventure));
            this.updateIndex(adventure);
        } catch (e) {
            console.error("Error saving adventure", e);
        }
    },

    // Create new adventure
    create(name: string): Adventure {
        const id = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString();
        const newAdv: Adventure = {
            id,
            name,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            logs: []
        };
        this.save(newAdv);
        return newAdv;
    },

    // Delete adventure
    delete(id: string) {
        console.log('[AdventureRepo] Deleting:', id);
        localStorage.removeItem(STORAGE_KEY_PREFIX + id);
        const index = this.listAll().filter(a => a.id !== id);
        localStorage.setItem(INDEX_KEY, JSON.stringify(index));
        console.log('[AdventureRepo] Deleted. New Index:', index);
    },

    // Optimized: Append Log (Auto-Save)
    // Instead of reading/writing the whole file, we assume strict consistency isn't critical 
    // BUT LocalStorage doesn't support append. We must Read-Modify-Write.
    // For performance, we rely on the Context to hold state and periodically save, 
    // OR just save on every roll (safest for "crash proof").
    // User requested "Safety", so we save on every roll.
    appendLog(id: string, roll: RollEvent) {
        const adv = this.load(id);
        if (adv) {
            // Check for duplicates just in case
            if (!adv.logs.some(r => r.id === roll.id)) {
                adv.logs.unshift(roll); // Newest first? Or append?
                // RollHistoryContext keeps new at top (unshift).
                // Let's keep consistency: Array[0] is newest? 
                // Usually logs are append-only time series. 
                // Let's stick to: Context handles order. Repo just stores the list.
                // We'll trust the Context to pass the full list or we append here.
                // Let's Just Save the whole thing via `save` called from Context to ensure sync.
                // Actually, reading full JSON for every roll might be heavy if history is huge.
                // But for a text RPG session (100-200 rolls), it's fine.
                this.save(adv);
            }
        }
    },

    updateIndex(adventure: Adventure) {
        const index = this.listAll();
        const summary: AdventureSummary = {
            id: adventure.id,
            name: adventure.name,
            createdAt: adventure.createdAt,
            updatedAt: adventure.updatedAt
        };

        const existingIdx = index.findIndex(a => a.id === adventure.id);
        if (existingIdx >= 0) {
            index[existingIdx] = summary;
        } else {
            index.push(summary);
        }
        localStorage.setItem(INDEX_KEY, JSON.stringify(index));
    }
};
