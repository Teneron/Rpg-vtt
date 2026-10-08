/**
 * Agnostic Combat and Initiative Utility
 * 
 * Supports D&D 5e, The Witcher TTRPG, and arbitrary multi-lore systems
 * without hardcoding rulebook assumptions into the core turn engine.
 */

export interface InitiativeResult {
    bonus: number;
    roll: number;
    total: number;
    formula: string;
    diceSides: number;
}

/**
 * Resolves the initiative modifier for any character sheet structure safely.
 */
export function getInitiativeBonus(character: any): number {
    if (!character) return 0;

    // 1. Explicit initiative bonus property on character
    if (typeof character.initiative === 'number' && !isNaN(character.initiative)) {
        return character.initiative;
    }
    if (typeof character.initiativeBonus === 'number' && !isNaN(character.initiativeBonus)) {
        return character.initiativeBonus;
    }
    if (typeof character.initiativeMod === 'number' && !isNaN(character.initiativeMod)) {
        return character.initiativeMod;
    }

    // 2. D&D 5e style attributes (attributes.dex)
    const dex = character.attributes?.dex;
    if (dex) {
        if (typeof dex.modifier === 'number' && !isNaN(dex.modifier)) {
            return dex.modifier;
        }
        if (typeof dex.value === 'number' && !isNaN(dex.value)) {
            return Math.floor((dex.value - 10) / 2);
        }
    }

    // 3. The Witcher TTRPG / Cyberpunk style stats (REF / Reflexes)
    const ref = character.stats?.ref || character.attributes?.ref || character.attributes?.reflexes;
    if (ref) {
        if (typeof ref.modifier === 'number' && !isNaN(ref.modifier)) {
            return ref.modifier;
        }
        if (typeof ref.value === 'number' && !isNaN(ref.value)) {
            return ref.value;
        }
    }

    // 4. Flat dexterity / agility / reflexes number
    if (typeof character.dexterity === 'number' && !isNaN(character.dexterity)) {
        return Math.floor((character.dexterity - 10) / 2);
    }
    if (typeof character.reflexes === 'number' && !isNaN(character.reflexes)) {
        return character.reflexes;
    }

    return 0;
}

/**
 * Rolls initiative for a character and returns standard roll metadata.
 */
export function rollInitiative(character: any, diceSides = 20): InitiativeResult {
    const bonus = getInitiativeBonus(character);
    const roll = Math.floor(Math.random() * diceSides) + 1;
    const total = roll + bonus;
    const sign = bonus >= 0 ? '+' : '';
    const formula = bonus !== 0 ? `1d${diceSides} ${sign} ${bonus}` : `1d${diceSides}`;

    return {
        bonus,
        roll,
        total,
        formula,
        diceSides
    };
}
