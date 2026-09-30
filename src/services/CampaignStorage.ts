
export const CampaignStorage = {
    get: (adventureId: string, key: string) => {
        const fullKey = `rpg_${adventureId}_${key}`;
        const item = localStorage.getItem(fullKey);
        if (!item || item === 'undefined' || item === 'null') return null;
        try {
            return JSON.parse(item);
        } catch (e) {
            console.error(`Error parsing storage key ${fullKey}:`, e);
            return null;
        }
    },

    set: (adventureId: string, key: string, value: any) => {
        const fullKey = `rpg_${adventureId}_${key}`;
        localStorage.setItem(fullKey, JSON.stringify(value));
    },

    remove: (adventureId: string, key: string) => {
        const fullKey = `rpg_${adventureId}_${key}`;
        localStorage.removeItem(fullKey);
    },

    // Migração de dados antigos (se necessário) ou limpeza
    clearAdventure: (adventureId: string) => {
        Object.keys(localStorage).forEach(k => {
            if (k.startsWith(`rpg_${adventureId}_`)) {
                localStorage.removeItem(k);
            }
        });
    }
};
