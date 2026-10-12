import type { Spell } from './data/spells';
import { FEATS, type Feat } from './data/feats';

export type { Spell, Feat };

export interface Attribute {
    name: string;
    value: number;
    modifier: number;
    saveProficiency: boolean; // Salvaguarda (Saving Throw)
}

export type SkillName =
    | 'Acrobacia' | 'Adestrar Animais' | 'Arcanismo' | 'Atletismo' | 'Atuação'
    | 'Enganação' | 'Furtividade' | 'História' | 'Intimidação' | 'Intuição'
    | 'Investigação' | 'Medicina' | 'Natureza' | 'Percepção' | 'Persuasão'
    | 'Prestidigitação' | 'Religião' | 'Sobrevivência';

export interface Skill {
    name: SkillName;
    attribute: keyof CharacterAttributes; // 'str', 'dex', etc.
    proficient: boolean;
    expertise: boolean; // Especialização (dobra proficiência)
    value: number; // Valor final calculado
}

export interface Item {
    id: string;
    name: string;
    quantity: number;
    description: string;
    weight?: number;
    equipped?: boolean;

    // Extended RPG properties
    type?: 'weapon' | 'armor' | 'gear' | 'tool' | 'consumable';
    damage?: string;
    damageType?: string;
    properties?: string[];
    range?: string;
    ac?: number;
    acDexBonus?: boolean;
    acMaxDex?: number;
    stealthDisadvantage?: boolean;
    cost?: number; // Store cost if relevant for resale
    toxicity?: number; // Witcher Potion Toxicity Cost
}

export interface Attack {
    id: string;
    name: string;
    attackBonus: number;
    damageDice: string; // e.g. "1d8 + 3"
    damageType: string; // e.g. "Cortante"
    range?: string;
    properties?: string;
}

export interface ClassFeature {
    name: string;
    level: number;
    description: string;
    type: 'passive' | 'action' | 'bonus_action' | 'reaction';
}

export interface ClassResource {
    id: string;
    name: string;
    current: number;
    max: number;
    rechargesOn: 'short' | 'long' | 'other';
}

export interface CharacterAttributes {
    str: Attribute;
    dex: Attribute;
    con: Attribute;
    int: Attribute;
    wis: Attribute;
    cha: Attribute;
}

export interface Character {
    id: string;
    owner: string; // Creates isolation by username
    adventureId?: string; // Scope by Campaign/Adventure
    name: string;
    race: string;
    class: string;
    subclass?: string;
    level: number;
    background: string;
    alignment: string;
    imageUrl?: string; // Avatar URL
    experience: number;
    nextLevelExperience: number; // XP needed for next level

    // Stats Principais
    attributes: CharacterAttributes;
    proficiencyBonus: number;
    inspiration: boolean;
    conditions?: string[];

    // Combate
    armorClass: number;
    acOverride?: number; // GM Manual Override
    initiative: number;
    speed: number;
    speedOverride?: number; // GM Manual Override
    visionRange: number; // Visão no Escuro (metros)

    // Vida
    hp: {
        current: number;
        max: number;
        temp: number;
    };
    hitDice: {
        current: number;
        max: number; // Geralmente igual ao Nível
        dieFace: string; // e.g. "d10"
    };
    deathSaves: {
        successes: number; // 0-3
        failures: number; // 0-3
    };

    // Magia / Recursos
    spellSaveDC: number;
    spellAttackBonus: number;
    classResources: ClassResource[]; // Adrenalina, Usos de Sinais, etc.
    features: ClassFeature[]; // Habilidades de Classe/Raça

    skills: Skill[];
    attacks: Attack[];
    spells: Spell[]; // Magias conhecidas/preparadas
    feats: Feat[]; // Talentos
    inventory: Item[];
    notes: string;
    hpRolled?: boolean | number; // Persists the dice roll/mode
    proficiencies: string[]; // Armas, Armaduras, Ferramentas
    languages: string[]; // Comum, Élfico, Anão...

    // --- D&D 5e Expanded Fields ---
    // Bio / Appearance
    age?: string;
    height?: string;
    weight?: string;
    eyes?: string;
    skin?: string;
    hair?: string;

    // Personality
    personalityTraits?: string;
    ideals?: string;
    bonds?: string;
    flaws?: string;

    // Currency
    currency: {
        cp: number; // Copper
        sp: number; // Silver
        ep: number; // Electrum
        gp: number; // Gold
        pp: number; // Platinum
    };

    // Spell Slots Tracker
    spellSlots: {
        [level: number]: {
            max: number;
            used: number;
        };
    };
    pendingLevelUp?: boolean;
    lastModified?: number; // Timestamp for Conflict Resolution
    system?: string; // Optional game system identifier (e.g. "dnd5e", "witcher", "cyberpunk")
}

export const calculateModifier = (value: number): number => {
    return Math.floor((value - 10) / 2);
};



export const XP_TABLE: Record<number, number> = {
    1: 0,
    2: 300,
    3: 900,
    4: 2700,
    5: 6500,
    6: 14000,
    7: 23000,
    8: 34000,
    9: 48000,
    10: 64000,
    11: 85000,
    12: 100000,
    13: 120000,
    14: 140000,
    15: 165000,
    16: 195000,
    17: 225000,
    18: 265000,
    19: 305000,
    20: 355000
};

export const getLevel = (xp: number): number => {
    // Iterate downwards to find the highest level reached
    for (let lvl = 20; lvl >= 1; lvl--) {
        if (xp >= XP_TABLE[lvl]) return lvl;
    }
    return 1;
};

export const getMinXPForLevel = (level: number): number => {
    if (level < 1) return 0;
    if (level > 20) return XP_TABLE[20];
    return XP_TABLE[level];
};

export const calculateProficiencyBonus = (level: number): number => {
    return Math.ceil(1 + (level / 4));
};

// Mapa de Perícias para Atributos (D&D 5e Padrão)
export const SKILL_ATTRIBUTE_MAP: Record<SkillName, keyof CharacterAttributes> = {
    'Acrobacia': 'dex',
    'Adestrar Animais': 'wis',
    'Arcanismo': 'int',
    'Atletismo': 'str',
    'Atuação': 'cha',
    'Enganação': 'cha',
    'Furtividade': 'dex',
    'História': 'int',
    'Intimidação': 'cha',
    'Intuição': 'wis',
    'Investigação': 'int',
    'Medicina': 'wis',
    'Natureza': 'int',
    'Percepção': 'wis',
    'Persuasão': 'cha',
    'Prestidigitação': 'dex',
    'Religião': 'int',
    'Sobrevivência': 'wis'
};

export const createDefaultSkills = (attributes: CharacterAttributes): Skill[] => {
    return Object.keys(SKILL_ATTRIBUTE_MAP).map((key) => {
        const skillName = key as SkillName;
        const attrKey = SKILL_ATTRIBUTE_MAP[skillName];
        return {
            name: skillName,
            attribute: attrKey,
            proficient: false,
            expertise: false,
            value: calculateModifier(attributes[attrKey].value)
        };
    });
};

// Fallback for non-secure contexts (HTTP LAN)
const generateId = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

export const initialCharacter: Character = {
    id: generateId(),
    owner: 'default',
    adventureId: 'default',
    name: 'Novo Personagem',
    race: '', // Empty to trigger builder
    class: '', // Empty to trigger builder
    level: 1,
    background: '',
    alignment: '',
    imageUrl: '', // Default empty
    experience: 0,
    nextLevelExperience: 300,

    attributes: {
        str: { name: 'Força', value: 10, modifier: 0, saveProficiency: false },
        dex: { name: 'Destreza', value: 10, modifier: 0, saveProficiency: false },
        con: { name: 'Constituição', value: 10, modifier: 0, saveProficiency: false },
        int: { name: 'Inteligência', value: 10, modifier: 0, saveProficiency: false },
        wis: { name: 'Sabedoria', value: 10, modifier: 0, saveProficiency: false },
        cha: { name: 'Carisma', value: 10, modifier: 0, saveProficiency: false },
    },
    proficiencyBonus: 2,
    inspiration: false,
    conditions: [],

    armorClass: 10,
    initiative: 0,
    speed: 9,
    visionRange: 0,

    hp: { current: 10, max: 10, temp: 0 },
    hitDice: { current: 1, max: 1, dieFace: 'd8' },
    deathSaves: { successes: 0, failures: 0 },

    spellSaveDC: 10,
    spellAttackBonus: 2,

    classResources: [],
    features: [],

    skills: [],
    spells: [],
    feats: [],
    attacks: [],
    proficiencies: [],
    languages: ['Comum'],
    inventory: [],
    notes: '',

    // Defaults for new fields
    currency: { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 },
    spellSlots: {
        1: { max: 0, used: 0 },
        2: { max: 0, used: 0 },
        3: { max: 0, used: 0 },
        4: { max: 0, used: 0 },
        5: { max: 0, used: 0 },
        6: { max: 0, used: 0 },
        7: { max: 0, used: 0 },
        8: { max: 0, used: 0 },
        9: { max: 0, used: 0 },
    },
    personalityTraits: '',
    ideals: '',
    bonds: '',
    flaws: '',
    pendingLevelUp: false
};

// ... (existing imports)

// ...

// Helper para recalcular tudo (chamado ao atualizar atributos ou nível)
export const regenerateCharacterStats = (char: Character): Character => {
    const profBonus = calculateProficiencyBonus(char.level);

    // Atualizar Modificadores
    // CRITICAL: Must deep clone to avoid mutating 'char' in place before we can check deltas
    const newAttrs: CharacterAttributes = JSON.parse(JSON.stringify(char.attributes));

    (Object.keys(newAttrs) as Array<keyof CharacterAttributes>).forEach(key => {
        newAttrs[key].modifier = calculateModifier(newAttrs[key].value);
    });

    // Atualizar Perícias
    // FIX: Rebuild skill list from scratch using SKILL_ATTRIBUTE_MAP to ensure ALL skills exist
    // Preserves existing proficiency/expertise settings.
    const currentSkillMap = new Map((char.skills || []).map(s => [s.name, s]));

    const newSkills: Skill[] = Object.keys(SKILL_ATTRIBUTE_MAP).map((key) => {
        const skillName = key as SkillName;
        const attrKey = SKILL_ATTRIBUTE_MAP[skillName];
        const existing = currentSkillMap.get(skillName);

        const isProficient = existing?.proficient || false;
        const isExpertise = existing?.expertise || false;
        const mod = newAttrs[attrKey].modifier;

        let val = mod;
        if (isProficient) val += profBonus;
        if (isExpertise) val += profBonus;

        return {
            name: skillName,
            attribute: attrKey,
            proficient: isProficient,
            expertise: isExpertise,
            value: val
        };
    });

    // --- Variables ---
    // const oldDexMod = char.attributes.dex.modifier;
    const newDexMod = newAttrs.dex.modifier;

    // --- Feat Effects Application ---
    let extraSpeed = 0;
    let extraInitiative = 0;
    // let extraHpPerLevel = 0;
    // let passivePerceptionBonus = 0;

    if (char.feats) {
        char.feats.forEach(feat => {
            // FIX: Lookup canonical feat definition to ensure effects are up to date
            // This fixes issues where stored feats (from older saves) refer to IDs but lack the 'effects' array
            const canonicalFeat = FEATS.find(f => f.id === feat.id);
            const effects = canonicalFeat?.effects || feat.effects;

            if (effects) {
                effects.forEach(effect => {
                    if (effect.type === 'speed') extraSpeed += effect.value;
                    if (effect.type === 'initiative') extraInitiative += effect.value;
                    // if (effect.type === 'hp_per_level') extraHpPerLevel += effect.value;
                });
            }
        });
    }

    // --- Auto-Calculate AC (Armor + Shield + Dex) ---
    // Start with 10 + Dex (Unarmored)
    let baseAC = 10 + newDexMod;
    const className = (char.class || '').toLowerCase();
    const isBarbarian = /b[áa]rbar/i.test(className);
    const isMonk = /mon[kg]/i.test(className);
    const hasUnarmoredDefense = char.features?.some(f => /defesa sem armadura|unarmored defense/i.test(f.name)) || isBarbarian || isMonk;

    let armorAC = 0;
    let shieldBonus = 0;
    let isArmored = false;

    // Scan Inventory for Equipped Armor/Shield
    if (char.inventory) {
        char.inventory.forEach(item => {
            if (!item.equipped) return;

            if (item.type === 'armor') {
                const isShield = item.name === 'Escudo' || item.name === 'Escudo de Madeira' || item.id === 'escudo' || item.id === 'escudo_de_madeira' || /escudo/i.test(item.name || '');
                if (isShield) {
                    shieldBonus += (item.ac || 2);
                } else {
                    // It's body armor
                    isArmored = true;
                    let dexBonus = 0;
                    if (item.acDexBonus) {
                        dexBonus = newDexMod;
                        if (item.acMaxDex !== undefined) {
                            dexBonus = Math.min(dexBonus, item.acMaxDex);
                        }
                    }
                    if (!item.acDexBonus && dexBonus < 0) dexBonus = 0;

                    const computedAC = (item.ac || 10) + dexBonus;
                    armorAC = Math.max(armorAC, computedAC);
                }
            }
        });
    }

    if (!isArmored && hasUnarmoredDefense) {
        if (isBarbarian) {
            const conMod = calculateModifier(newAttrs.con.value);
            baseAC = 10 + newDexMod + conMod;
        } else if (isMonk) {
            // Monk UD applies only if NOT using armor AND NOT using shield
            if (shieldBonus === 0) {
                const wisMod = calculateModifier(newAttrs.wis.value);
                baseAC = 10 + newDexMod + wisMod;
            }
        }
    }

    let finalAC = isArmored ? armorAC : baseAC;
    finalAC += shieldBonus;

    // Override if set (GM Manual Edit)
    if (char.acOverride !== undefined) {
        finalAC = char.acOverride;
    }

    // --- Auto-Build Attacks from Equipped Weapons ---
    const newAttacks: Attack[] = [];
    if (char.inventory) {
        char.inventory.forEach(item => {
            if (item.type === 'weapon' && item.equipped) {
                // Determine Attribute (Str vs Dex)
                let attrMod = newAttrs.str.modifier;
                const isFinesse = item.properties?.includes('acuidade');

                if (item.type === 'weapon') {
                    if (item.range && !item.properties?.includes('arremesso')) {
                        attrMod = newAttrs.dex.modifier;
                    } else if (isFinesse) {
                        attrMod = Math.max(newAttrs.str.modifier, newAttrs.dex.modifier);
                    }
                }

                const hitBonus = attrMod + profBonus;
                const formattedMod = attrMod >= 0 ? `+ ${attrMod}` : `- ${Math.abs(attrMod)}`;
                const damageDice = attrMod === 0 ? (item.damage || '1d4') : `${item.damage || '1d4'} ${formattedMod}`;

                newAttacks.push({
                    id: item.id,
                    name: item.name,
                    attackBonus: hitBonus,
                    damageDice: damageDice,
                    damageType: item.damageType || 'físico',
                    range: item.range,
                    properties: item.properties?.join(', ')
                });
            }
        });
    }

    // Standard Unarmed Strike (Ataque Desarmado) available to all characters
    const unarmedAttrMod = isMonk ? Math.max(newAttrs.str.modifier, newAttrs.dex.modifier) : newAttrs.str.modifier;
    const unarmedModStr = unarmedAttrMod >= 0 ? `+ ${unarmedAttrMod}` : `- ${Math.abs(unarmedAttrMod)}`;
    const unarmedDamage = isMonk
        ? (unarmedAttrMod === 0 ? '1d6' : `1d6 ${unarmedModStr}`)
        : `${Math.max(1, 1 + unarmedAttrMod)}`;
    const escapeDC = 8 + profBonus + unarmedAttrMod;
    newAttacks.push({
        id: 'ataque_desarmado',
        name: isMonk ? 'Ataque Desarmado (Artes Marciais)' : 'Ataque Desarmado',
        attackBonus: unarmedAttrMod + profBonus,
        damageDice: unarmedDamage,
        damageType: 'concussão',
        range: '1,5m',
        properties: isMonk ? 'Ágil, Ação Bônus 1 atk extra' : `Agarrar / Derrubar / Empurrar (CD ${escapeDC})`
    });

    // --- Auto-Calculate Spell Save DC & Spell Attack Bonus ---
    let spellCastingAbility: keyof CharacterAttributes | null = null;
    const isWitcherSystem = char.system === 'witcher' || /witcher/i.test(className);
    if (isWitcherSystem) {
        spellCastingAbility = 'wis';
    } else {
        if (/mago|wizard/i.test(className)) spellCastingAbility = 'int';
        else if (/cl[ée]rigo|cleric|druid|druida|guardi[ãa]o|ranger/i.test(className)) spellCastingAbility = 'wis';
        else if (/bardo|bard|bruxo|warlock|feiticeiro|sorcerer|paladino|paladin/i.test(className)) spellCastingAbility = 'cha';
    }

    let newSpellSaveDC = char.spellSaveDC || (8 + profBonus);
    let newSpellAttackBonus = char.spellAttackBonus || profBonus;

    if (spellCastingAbility && newAttrs[spellCastingAbility]) {
        const spellMod = newAttrs[spellCastingAbility].modifier;
        newSpellSaveDC = 8 + profBonus + spellMod;
        newSpellAttackBonus = profBonus + spellMod;
    }

    // --- Initiative ---
    const finalInitiative = newDexMod + extraInitiative;

    // --- HP Max Update (Only Con Delta) ---
    const oldConMod = char.attributes.con.modifier;
    const newConMod = newAttrs.con.modifier;
    const conDelta = newConMod - oldConMod;

    let finalHpMax = char.hp.max;
    if (conDelta !== 0) {
        finalHpMax += (conDelta * char.level);
    }

    // --- Speed Calculation (R4) ---
    const baseSpeed = char.speed || 9;
    const finalSpeed = (char.speedOverride !== undefined) ? char.speedOverride : Math.max(0, baseSpeed + extraSpeed);

    return {
        ...char,
        attributes: newAttrs,
        proficiencyBonus: profBonus,
        skills: newSkills,
        armorClass: finalAC,
        speed: finalSpeed,
        hp: { ...char.hp, max: finalHpMax },
        initiative: finalInitiative,
        attacks: newAttacks,
        spellSaveDC: newSpellSaveDC,
        spellAttackBonus: newSpellAttackBonus,
        pendingLevelUp: char.pendingLevelUp || false
    };
};

initialCharacter.skills = createDefaultSkills(initialCharacter.attributes);
