import { CLASS_PROGRESSIONS, type FullClassProgression } from './classProgressions';
import { CLASSES } from './classes';
import { SPELLS, type Spell } from './spells';
import type { ClassFeature, ClassResource } from '../characterTypes';

/**
 * Normaliza qualquer nome de classe (em pt-BR ou id canônico) para o id da classe em CLASS_PROGRESSIONS.
 */
export function normalizeClassId(nameOrId?: string | null): string {
    if (!nameOrId) return 'fighter';
    const lower = nameOrId.trim().toLowerCase();

    // The Witcher
    if (lower.includes('witcher') || lower === 'bruxo (the witcher)') return 'witcher';

    // D&D 5.5e
    if (lower.includes('barb') || lower.includes('bárbaro') || lower.includes('barbaro')) return 'barbarian';
    if (lower.includes('bard') || lower.includes('bardo')) return 'bard';
    if (lower.includes('cleric') || lower.includes('clérigo') || lower.includes('clerigo')) return 'cleric';
    if (lower.includes('druid') || lower.includes('druida')) return 'druid';
    if (lower.includes('fighter') || lower.includes('guerreiro')) return 'fighter';
    if (lower.includes('monk') || lower.includes('monge')) return 'monk';
    if (lower.includes('paladin') || lower.includes('paladino')) return 'paladin';
    if (lower.includes('ranger') || lower.includes('guardião') || lower.includes('guardiao') || lower.includes('patrulheiro')) return 'ranger';
    if (lower.includes('rogue') || lower.includes('ladino')) return 'rogue';
    if (lower.includes('sorcerer') || lower.includes('feiticeiro')) return 'sorcerer';
    if (lower.includes('warlock') || lower.includes('bruxo')) return 'warlock';
    if (lower.includes('wizard') || lower.includes('mago')) return 'wizard';

    // Fallback: check if id exists directly in CLASS_PROGRESSIONS
    if (CLASS_PROGRESSIONS[lower]) return lower;

    return 'fighter';
}

/**
 * Retorna os dados completos da progressão da classe (1 a 20).
 */
export function getClassProgression(classIdOrName?: string | null): FullClassProgression {
    const classId = normalizeClassId(classIdOrName);
    return CLASS_PROGRESSIONS[classId] || CLASS_PROGRESSIONS['fighter'];
}

/**
 * Calcula o bônus de proficiência oficial pelo nível (1-20).
 */
export function getProficiencyBonus(level: number): number {
    const safeLvl = Math.max(1, Math.min(20, Math.floor(level || 1)));
    return Math.floor((safeLvl - 1) / 4) + 2;
}

/**
 * Níveis onde a classe ganha Aumento de Atributo ou Talento (ASI).
 * Em D&D 5.5e:
 * - Padrão: 4, 8, 12, 16, 19
 * - Guerreiro: 4, 6, 8, 12, 14, 16, 19
 * - Ladino: 4, 8, 10, 12, 16, 19
 */
export function getAsiLevels(classIdOrName?: string | null): number[] {
    const classId = normalizeClassId(classIdOrName);
    if (classId === 'fighter') {
        return [4, 6, 8, 12, 14, 16, 19];
    }
    if (classId === 'rogue') {
        return [4, 8, 10, 12, 16, 19];
    }
    return [4, 8, 12, 16, 19];
}

/**
 * Verifica se um nível específico é nível de ASI para a classe.
 */
export function isAsiLevel(classIdOrName: string | null | undefined, level: number): boolean {
    const asiLevels = getAsiLevels(classIdOrName);
    return asiLevels.includes(level);
}

/**
 * Nível em que a subclasse é escolhida.
 * No D&D 5.5e (regras 2024), todas as classes escolhem subclasse no nível 3.
 */
export function getSubclassLevel(classIdOrName?: string | null): number {
    const classId = normalizeClassId(classIdOrName);
    const prog = CLASS_PROGRESSIONS[classId];
    if (prog?.subclasses && prog.subclasses.length > 0) {
        return prog.subclasses[0].milestoneLevels?.[0] || 3;
    }
    return 3;
}

/**
 * Extrai os espaços de magia (spell slots) da classe para o nível alvo (1 a 20).
 * Retorna um mapa de slots prontos para a ficha: { [slotLevel]: { max, used } }.
 */
export function getSpellSlotsForLevel(
    classIdOrName: string | null | undefined,
    level: number
): Record<number, { max: number; used: number }> {
    const classId = normalizeClassId(classIdOrName);
    const prog = getClassProgression(classId);
    const safeLvl = Math.max(1, Math.min(20, Math.floor(level || 1)));
    const row = prog.rows[safeLvl - 1];

    const slots: Record<number, { max: number; used: number }> = {
        1: { max: 0, used: 0 },
        2: { max: 0, used: 0 },
        3: { max: 0, used: 0 },
        4: { max: 0, used: 0 },
        5: { max: 0, used: 0 },
        6: { max: 0, used: 0 },
        7: { max: 0, used: 0 },
        8: { max: 0, used: 0 },
        9: { max: 0, used: 0 },
    };

    if (!row || !prog.hasSpellcasting) {
        return slots;
    }

    // Warlock (Pact Magic): slots de pacto de um círculo específico
    if (prog.spellcastingType === 'pact') {
        const pactSlotsCount = parseInt(row.values['pactSlots'] || '0', 10) || 0;
        const slotLevelStr = row.values['slotLevel'] || '1º';
        const slotLevelNum = parseInt(slotLevelStr.replace(/[^0-9]/g, '') || '1', 10) || 1;

        if (pactSlotsCount > 0 && slotLevelNum >= 1 && slotLevelNum <= 9) {
            slots[slotLevelNum] = { max: pactSlotsCount, used: 0 };
        }
        return slots;
    }

    // Conjuradores normais (Mago, Clérigo, Druida, Feiticeiro, Bardo, Paladino, Guardião)
    for (let circle = 1; circle <= 9; circle++) {
        const rawVal = row.values[`slot${circle}`];
        if (rawVal && rawVal !== '-' && rawVal !== '—') {
            const count = parseInt(rawVal, 10) || 0;
            slots[circle] = { max: count, used: 0 };
        }
    }

    return slots;
}

/**
 * Quantidade de Truques (Cantrips) conhecidos pela classe no nível.
 */
export function getCantripsKnownCount(classIdOrName: string | null | undefined, level: number): number {
    const classId = normalizeClassId(classIdOrName);
    const prog = getClassProgression(classId);
    const safeLvl = Math.max(1, Math.min(20, Math.floor(level || 1)));
    const row = prog.rows[safeLvl - 1];
    if (!row || !row.values['cantrips']) return 0;
    return parseInt(row.values['cantrips'], 10) || 0;
}

/**
 * Quantidade de Magias Preparadas/Conhecidas no nível.
 */
export function getSpellsPreparedCount(classIdOrName: string | null | undefined, level: number): number {
    const classId = normalizeClassId(classIdOrName);
    const prog = getClassProgression(classId);
    const safeLvl = Math.max(1, Math.min(20, Math.floor(level || 1)));
    const row = prog.rows[safeLvl - 1];
    if (!row || !row.values['prepSpells']) return 0;
    return parseInt(row.values['prepSpells'], 10) || 0;
}

/**
 * Retorna os recursos de classe configurados para o nível indicado.
 */
export function getClassResourcesForLevel(
    classIdOrName: string | null | undefined,
    level: number,
    existingResources: ClassResource[] = [],
    chaModifier = 1,
    subclassIdOrName?: string | null
): ClassResource[] {
    const classId = normalizeClassId(classIdOrName);
    const prog = getClassProgression(classId);
    const safeLvl = Math.max(1, Math.min(20, Math.floor(level || 1)));
    const row = prog.rows[safeLvl - 1];

    const resources: ClassResource[] = existingResources.map(r => ({ ...r }));

    const upsertResource = (
        id: string,
        name: string,
        maxVal: number,
        recharge: 'short' | 'long'
    ) => {
        const idx = resources.findIndex(r => r.id === id);
        if (idx >= 0) {
            resources[idx].name = name;
            resources[idx].max = maxVal;
            resources[idx].current = Math.min(resources[idx].current, maxVal);
        } else {
            resources.push({
                id,
                name,
                max: maxVal,
                current: maxVal,
                rechargesOn: recharge
            });
        }
    };

    if (!row) return resources;

    switch (classId) {
        case 'barbarian': {
            const rages = parseInt(row.values['rages'] || '2', 10) || 2;
            upsertResource('rage', 'Fúria (Rage)', rages, 'long');
            break;
        }
        case 'bard': {
            const die = row.values['bardicDie'] || 'd6';
            const count = Math.max(1, chaModifier);
            upsertResource('bardic_inspiration', `Inspiração de Bardo (${die})`, count, 'short');
            break;
        }
        case 'cleric': {
            const uses = parseInt(row.values['channelDivinity'] || '0', 10) || (safeLvl >= 2 ? 2 : 0);
            if (uses > 0) {
                upsertResource('channel_divinity', 'Canalizar Divindade', uses, 'short');
            }
            break;
        }
        case 'druid': {
            const ws = parseInt(row.values['wildShape'] || '0', 10) || (safeLvl >= 2 ? 2 : 0);
            if (ws > 0) {
                upsertResource('wild_shape', 'Forma Selvagem (Wild Shape)', ws, 'short');
            }
            break;
        }
        case 'fighter': {
            if (safeLvl >= 2) {
                const actionSurgeUses = safeLvl >= 17 ? 2 : 1;
                upsertResource('action_surge', 'Surto de Ação (Action Surge)', actionSurgeUses, 'short');
            }
            const secondWindUses = parseInt(row.values['secondWind'] || '2', 10) || 2;
            upsertResource('second_wind', 'Retomar o Fôlego (Second Wind)', secondWindUses, 'short');
            if (safeLvl >= 9) {
                const indomitableUses = parseInt(row.values['indomitable'] || '1', 10) || 1;
                upsertResource('indomitable', 'Indomável (Indomitable)', indomitableUses, 'long');
            }
            break;
        }
        case 'monk': {
            const focus = parseInt(row.values['focusPoints'] || String(safeLvl), 10) || safeLvl;
            upsertResource('focus_points', 'Pontos de Foco (Ki)', focus, 'short');
            break;
        }
        case 'paladin': {
            if (safeLvl >= 2) {
                const cdUses = parseInt(row.values['channelDivinity'] || '2', 10) || 2;
                upsertResource('channel_divinity', 'Canalizar Divindade', cdUses, 'short');
            }
            break;
        }
        case 'sorcerer': {
            if (safeLvl >= 2) {
                const sp = parseInt(row.values['sorceryPoints'] || String(safeLvl), 10) || safeLvl;
                upsertResource('sorcery_points', 'Pontos de Feitiçaria (Fonte de Magia)', sp, 'long');
            }
            break;
        }
        case 'warlock': {
            const invocations = parseInt(row.values['invocations'] || '0', 10) || 0;
            if (invocations > 0) {
                upsertResource('invocations', 'Invocações Místicas Ativas', invocations, 'long');
            }
            break;
        }
        case 'witcher': {
            const vigor = parseInt(row.values['vigor'] || '12', 10) || 12;
            const toxStr = (row.values['toxicity'] || '100%').replace('%', '');
            const tox = parseInt(toxStr, 10) || 100;
            upsertResource('witcher_vigor', 'Vigor Mágico (Sinais)', vigor, 'short');
            upsertResource('witcher_toxicity', 'Tolerância a Toxicidade (%)', tox, 'long');
            break;
        }
    }

    // --- Subclass Specific Resources ---
    if (subclassIdOrName) {
        const subLower = subclassIdOrName.toLowerCase();
        if (subLower.includes('battle') || subLower.includes('batalha')) {
            const count = safeLvl >= 15 ? 6 : (safeLvl >= 7 ? 5 : 4);
            const die = safeLvl >= 18 ? 'd12' : (safeLvl >= 10 ? 'd10' : 'd8');
            upsertResource('combat_superiority', `Dados de Superioridade (${die})`, count, 'short');
        } else if (subLower.includes('archfey') || subLower.includes('arquifada')) {
            const uses = Math.max(1, chaModifier);
            upsertResource('steps_of_the_fey', 'Passos Feéricos (Teleporte Grátis)', uses, 'long');
        } else if (subLower.includes('celestial')) {
            const pool = 1 + safeLvl;
            upsertResource('healing_light', 'Luz Curativa (d6s)', pool, 'long');
        } else if (subLower.includes('psi') || subLower.includes('psíquico') || subLower.includes('psiquico') || subLower.includes('soulknife')) {
            const count = safeLvl >= 5 ? 6 : 4;
            upsertResource('psionic_dice', 'Dados de Energia Psiônica', count, 'short');
        }
    }

    return resources;
}

/**
 * Retorna as características (features) da classe desbloqueadas no nível específico.
 */
export const SUBCLASS_SPELL_IDS: Record<string, { level: number; spellId: string }[]> = {
    vengeance: [
        { level: 3, spellId: 'bane' },
        { level: 3, spellId: 'hunter_mark' },
        { level: 5, spellId: 'hold_person' },
        { level: 5, spellId: 'misty_step' }
    ],
    devotion: [
        { level: 3, spellId: 'protection_from_evil_and_good' },
        { level: 3, spellId: 'shield_of_faith' },
        { level: 5, spellId: 'aid' },
        { level: 5, spellId: 'zone_of_truth' }
    ],
    ancients: [
        { level: 3, spellId: 'ensnaring_strike' },
        { level: 3, spellId: 'speak_with_animals' },
        { level: 5, spellId: 'moonbeam' },
        { level: 5, spellId: 'misty_step' }
    ],
    glory: [
        { level: 3, spellId: 'guiding_bolt' },
        { level: 3, spellId: 'heroism' }
    ],
    archfey: [
        { level: 3, spellId: 'sleep' },
        { level: 3, spellId: 'misty_step' },
        { level: 5, spellId: 'calm_emotions' },
        { level: 5, spellId: 'phantasmal_force' }
    ],
    fiend: [
        { level: 3, spellId: 'burning_hands' },
        { level: 3, spellId: 'command' },
        { level: 5, spellId: 'scorching_ray' },
        { level: 5, spellId: 'blindness_deafness' }
    ],
    celestial: [
        { level: 3, spellId: 'cure_wounds' },
        { level: 3, spellId: 'guiding_bolt' },
        { level: 5, spellId: 'flaming_sphere' },
        { level: 5, spellId: 'lesser_restoration' }
    ]
};

/**
 * Retorna magias concedidas automaticamente pela subclasse até o nível indicado.
 */
export function getSubclassGrantedSpells(
    subclassIdOrName: string | null | undefined,
    level: number
): Spell[] {
    if (!subclassIdOrName) return [];
    const lower = subclassIdOrName.toLowerCase();
    let key = '';
    if (lower.includes('vengeance') || lower.includes('vingança') || lower.includes('vinganca')) key = 'vengeance';
    else if (lower.includes('devotion') || lower.includes('devoção') || lower.includes('devocao')) key = 'devotion';
    else if (lower.includes('ancients') || lower.includes('anciões') || lower.includes('ancioes')) key = 'ancients';
    else if (lower.includes('glory') || lower.includes('glória') || lower.includes('gloria')) key = 'glory';
    else if (lower.includes('archfey') || lower.includes('arquifada')) key = 'archfey';
    else if (lower.includes('fiend') || lower.includes('ínfero') || lower.includes('infero')) key = 'fiend';
    else if (lower.includes('celestial')) key = 'celestial';

    if (!key || !SUBCLASS_SPELL_IDS[key]) return [];

    const granted = SUBCLASS_SPELL_IDS[key].filter(item => item.level <= level);
    return granted
        .map(item => SPELLS.find(s => s.id === item.spellId))
        .filter((s): s is Spell => s !== undefined);
}

export function getFeaturesForLevel(
    classIdOrName: string | null | undefined,
    level: number
): ClassFeature[] {
    const classId = normalizeClassId(classIdOrName);
    const clsDef = CLASSES.find(c => c.id === classId);
    const clsFeatures = (clsDef?.features || [])
        .filter(f => f.level === level)
        .map(f => ({ ...f, type: f.type || 'passive' } as ClassFeature));

    // Também complementa com nomes de features presentes em CLASS_PROGRESSIONS se não existirem
    const prog = getClassProgression(classId);
    const safeLvl = Math.max(1, Math.min(20, Math.floor(level || 1)));
    const row = prog.rows[safeLvl - 1];

    if (row && Array.isArray(row.features)) {
        for (const featName of row.features) {
            if (!clsFeatures.some(cf => cf.name.toLowerCase() === featName.toLowerCase())) {
                clsFeatures.push({
                    name: featName,
                    description: `Característica concedida no Nível ${safeLvl} da classe ${prog.className}.`,
                    level: safeLvl,
                    type: 'passive'
                });
            }
        }
    }

    return clsFeatures;
}

/**
 * Retorna todas as características de classe até o nível indicado (1 a targetLevel).
 */
export function getFeaturesUpToLevel(
    classIdOrName: string | null | undefined,
    targetLevel: number
): ClassFeature[] {
    const allFeatures: ClassFeature[] = [];
    const seen = new Set<string>();

    for (let lvl = 1; lvl <= targetLevel; lvl++) {
        const lvlFeatures = getFeaturesForLevel(classIdOrName, lvl);
        for (const feat of lvlFeatures) {
            const key = feat.name.toLowerCase();
            if (!seen.has(key)) {
                seen.add(key);
                allFeatures.push(feat);
            }
        }
    }

    return allFeatures;
}
