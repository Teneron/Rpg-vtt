import type { Monster } from './monsterTypes';
import { MONSTERS_5E } from './data/monsters5e';
import { MONSTERS_WITCHER } from './data/monstersWitcher';

export class MonsterRepository {
    // Base monsters moved to getAll for safe lazy loading

    static getCustomMonsters(): Monster[] {
        try {
            const stored = localStorage.getItem('rpg_custom_monsters');
            const parsed = stored ? JSON.parse(stored) : [];
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            console.error('Failed to load custom monsters', e);
            return [];
        }
    }

    static saveCustomMonster(monster: Monster) {
        const customs = this.getCustomMonsters();
        const index = customs.findIndex(m => m.id === monster.id);

        if (index >= 0) {
            customs[index] = monster;
        } else {
            customs.push(monster);
        }

        localStorage.setItem('rpg_custom_monsters', JSON.stringify(customs));
    }

    static deleteCustomMonster(id: string) {
        let customs = this.getCustomMonsters();
        customs = customs.filter(m => m.id !== id);
        localStorage.setItem('rpg_custom_monsters', JSON.stringify(customs));
    }

    static getAll(): Monster[] {
        const custom = this.getCustomMonsters();

        const base5e: Monster[] = MONSTERS_5E || [];
        const baseWitcher: Monster[] = MONSTERS_WITCHER || [];

        return [...base5e, ...baseWitcher, ...custom].sort((a, b) => a.name.localeCompare(b.name));
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

        // Specific overrides for Famous Characters (Mental note: Generate these specific images next)
        if (name.includes('geralt')) return '/tokens/token_witcher_geralt.png'; // Todo: Generate

        // Category Fallbacks
        if (name.includes('witcher') || name.includes('bruxo') || cat.includes('bruxo')) return '/tokens/token_witcher.png';
        if (cat.includes('dragon') || cat.includes('dragão')) return '/tokens/token_dragon.png';
        if (cat.includes('undead') || cat.includes('morto-vivo') || cat.includes('espectro')) return '/tokens/token_undead.png';
        if (cat.includes('beast') || cat.includes('besta') || cat.includes('animal')) return '/tokens/token_beast.png';
        if (cat.includes('humanoid') || cat.includes('humanoide')) return '/tokens/token_humanoid.png';

        return '/tokens/token_default.png';
    }
}
