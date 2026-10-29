import type { Spell } from './data/spells';
import { FEATS, type Feat } from './data/feats';
import { RACES } from './data/races';
import { ITEMS } from './data/items';
import { COMPANION_PRESETS, type CompanionPreset } from './data/companionPresets';

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
    defId?: string;
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


export interface CompanionAttribute {
    value: number;
    modifier: number;
}

export interface CompanionAttributes {
    str: CompanionAttribute;
    dex: CompanionAttribute;
    con: CompanionAttribute;
    int: CompanionAttribute;
    wis: CompanionAttribute;
    cha: CompanionAttribute;
}

export interface CompanionAttack {
    name: string;
    attackBonus: number;
    damage: string; // e.g. "1d8 + 4"
    damageType: string; // e.g. "Cortante", "Perfurante", "Concussão", "Veneno"
    range?: string; // e.g. "1,5m" ou "18m"
    description?: string;
}

export interface CompanionFeature {
    name: string;
    description: string;
}

export interface Companion {
    id: string;
    presetId?: string;
    name: string;
    type: 'beast_companion' | 'familiar' | 'steed' | 'homunculus' | 'summon' | 'custom';
    creatureType: string; // e.g. "Besta da Terra", "Besta do Céu", "Diabrete", "Coruja", "Cavalo de Guerra"
    avatarUrl?: string;
    size: 'Miúdo' | 'Pequeno' | 'Médio' | 'Grande' | 'Enorme';
    hp: {
        current: number;
        max: number;
        temp?: number;
    };
    baseHp?: number;
    hpPerLevel?: number;
    baseAc?: number;
    acAddsPb?: boolean;
    acOverride?: number; // GM / Player Manual Override (e.g. Barding or Spells)
    acBreakdown?: string;
    ac: number;
    speed: string; // e.g. "12m", "18m voo", "12m escalada"
    visionRange?: number; // Metros de visão no escuro
    attributes: CompanionAttributes;
    attacks: CompanionAttack[];
    features: CompanionFeature[];
    skills?: string;
    notes?: string;
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
    subrace?: string; // Sub-espécie / Linhagem / Ancestralidade (Elfo, Draconato, Golias, Tiefling, Gnomo)
    class: string;
    subclass?: string;
    level: number;
    background: string;
    alignment: string;
    size?: 'Médio' | 'Pequeno'; // Tamanho do personagem
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
    acBreakdown?: string; // Transparent formula breakdown (e.g. Cota de Malha 16 + Escudo 2 = 18)
    initiative: number;
    baseSpeed?: number; // Deslocamento base racial (metros), sem bônus acumulativos
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
    companions?: Companion[];
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
    backstory?: string;

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
    levelUpTarget?: number;
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
    baseSpeed: 9,
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
    companions: [],
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
    backstory: '',
    pendingLevelUp: false
};

/**
 * Determina o deslocamento racial base de forma determinística (nunca lendo `char.speed` já somado),
 * evitando regressão de soma infinita (+3m a cada salvamento).
 */
export const resolveRacialBaseSpeed = (char: Partial<Character>): number => {
    const raceStr = (char.race || '').trim();
    if (raceStr) {
        const raceLower = raceStr.toLowerCase();

        // Sub-raças / linhagens específicas com 10,5m (35ft)
        if (/elfo da floresta|wood elf|aen seidhe|golias|goliath/i.test(raceStr)) {
            return 10.5;
        }

        // Busca exata em RACES (por nome ou id)
        const exactMatch = RACES.find(
            r => r.name.toLowerCase() === raceLower || r.id.toLowerCase() === raceLower
        );
        if (exactMatch && typeof exactMatch.speed === 'number') {
            return exactMatch.speed;
        }

        // Busca parcial para presets como "Anão (Dwarf)", "Alta Elfa (High Elf)", etc.
        const partialMatch = RACES.find(
            r => raceLower.includes(r.name.toLowerCase()) || raceLower.includes(r.id.toLowerCase())
        );
        if (partialMatch && typeof partialMatch.speed === 'number') {
            return partialMatch.speed;
        }
    }

    if (typeof char.baseSpeed === 'number' && Number.isFinite(char.baseSpeed) && char.baseSpeed > 0) {
        return char.baseSpeed;
    }

    return 9;
};

// Helper para recalcular tudo (chamado ao atualizar atributos ou nível)
export const regenerateCharacterStats = (char: Character): Character => {
    const safeLevel = typeof char.level === 'number' && Number.isFinite(char.level) && char.level >= 1 ? char.level : 1;
    const profBonus = calculateProficiencyBonus(safeLevel);

    // Atualizar Modificadores
    // CRITICAL: Must deep clone to avoid mutating 'char' in place before we can check deltas
    const baseAttrs = initialCharacter.attributes;
    const rawAttrs = (char.attributes && typeof char.attributes === 'object') ? char.attributes : baseAttrs;
    const newAttrs: CharacterAttributes = JSON.parse(JSON.stringify({
        str: { ...baseAttrs.str, ...(rawAttrs.str || {}) },
        dex: { ...baseAttrs.dex, ...(rawAttrs.dex || {}) },
        con: { ...baseAttrs.con, ...(rawAttrs.con || {}) },
        int: { ...baseAttrs.int, ...(rawAttrs.int || {}) },
        wis: { ...baseAttrs.wis, ...(rawAttrs.wis || {}) },
        cha: { ...baseAttrs.cha, ...(rawAttrs.cha || {}) }
    }));

    (Object.keys(newAttrs) as Array<keyof CharacterAttributes>).forEach(key => {
        const val = typeof newAttrs[key].value === 'number' && Number.isFinite(newAttrs[key].value)
            ? newAttrs[key].value
            : 10;
        newAttrs[key].value = val;
        newAttrs[key].modifier = calculateModifier(val);
    });

    // Atualizar Perícias
    // FIX: Rebuild skill list from scratch using SKILL_ATTRIBUTE_MAP to ensure ALL skills exist
    // Preserves existing proficiency/expertise settings.
    const currentSkillMap = new Map((Array.isArray(char.skills) ? char.skills : []).map(s => [s.name, s]));

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
    const newDexMod = newAttrs.dex.modifier;

    // --- Feat Effects Application ---
    let extraSpeed = 0;
    let extraInitiative = 0;

    if (Array.isArray(char.feats)) {
        char.feats.forEach(feat => {
            // FIX: Lookup canonical feat definition to ensure effects are up to date
            // This fixes issues where stored feats (from older saves) refer to IDs but lack the 'effects' array
            const canonicalFeat = FEATS.find(f => f.id === feat.id);
            const effects = canonicalFeat?.effects || feat.effects;

            if (effects) {
                effects.forEach(effect => {
                    if (effect.type === 'speed') extraSpeed += effect.value;
                    if (effect.type === 'initiative') extraInitiative += effect.value;
                });
            }
        });
    }

    // --- Auto-Calculate AC (Armor + Shield + Dex) ---
    const className = (char.class || '').toLowerCase();
    const isBarbarian = /b[áa]rbar/i.test(className) || (Array.isArray(char.features) && char.features.some(f => /defesa sem armadura.*constitui/i.test(f.name + ' ' + (f.description || ''))));
    const isMonk = /mon[kg]/i.test(className) || (Array.isArray(char.features) && char.features.some(f => /defesa sem armadura.*sabedoria/i.test(f.name + ' ' + (f.description || ''))));
    const isDraconic = /drac[oô]nic/i.test((char.subclass || '') + ' ' + (Array.isArray(char.features) ? char.features.map(f => f.name).join(' ') : ''));

    let equippedArmorName = '';
    let equippedShieldName = '';
    let armorBaseAc = 0;
    let armorDexContribution = 0;
    let armorCalculatedAc = 0;
    let shieldBonus = 0;
    let magicItemAcBonus = 0;
    const magicItemNames: string[] = [];

    // Scan Inventory for Equipped Items
    if (Array.isArray(char.inventory)) {
        char.inventory.forEach(item => {
            if (!item.equipped) return;

            let def = ITEMS.find(i => i.id === item.id || (item.defId && i.id === item.defId));
            if (!def && item.name) {
                const normName = item.name.toLowerCase().trim();
                def = ITEMS.find(i => i.name.toLowerCase() === normName);
            }

            const itemType = (item.type || def?.type || '').toLowerCase();
            const isShield = itemType === 'shield' || itemType === 'escudo' || /escudo/i.test(item.name || '') || item.id.includes('escudo');
            const isArmor = itemType === 'armor' || itemType === 'armadura' || (!isShield && def?.type === 'armor');

            if (isShield) {
                // In D&D 5e: benefit from only 1 shield at a time. Pick best shield bonus.
                const thisShieldBonus = item.ac ?? def?.ac ?? 2;
                if (thisShieldBonus > shieldBonus) {
                    shieldBonus = thisShieldBonus;
                    equippedShieldName = item.name || def?.name || 'Escudo';
                }
            } else if (isArmor) {
                const thisBaseAc = item.ac ?? def?.ac ?? 10;
                const allowsDex = item.acDexBonus ?? def?.acDexBonus ?? false;
                const maxDex = item.acMaxDex ?? def?.acMaxDex;

                let thisDexBonus = 0;
                if (allowsDex) {
                    thisDexBonus = newDexMod;
                    if (maxDex !== undefined) {
                        thisDexBonus = Math.min(thisDexBonus, maxDex);
                    }
                }

                const thisTotalArmorAc = thisBaseAc + thisDexBonus;
                if (!equippedArmorName || thisTotalArmorAc > armorCalculatedAc) {
                    equippedArmorName = item.name || def?.name || 'Armadura';
                    armorBaseAc = thisBaseAc;
                    armorDexContribution = thisDexBonus;
                    armorCalculatedAc = thisTotalArmorAc;
                }
            } else if (typeof item.ac === 'number' && item.ac > 0) {
                magicItemAcBonus += item.ac;
                magicItemNames.push(`${item.name} (+${item.ac})`);
            }
        });
    }

    const isArmored = equippedArmorName !== '';
    let baseUnarmoredAc = 10 + newDexMod;
    let unarmoredFormulaText = `Sem Armadura (10 + DES ${newDexMod >= 0 ? `+${newDexMod}` : newDexMod})`;

    if (!isArmored) {
        if (isBarbarian) {
            const conMod = calculateModifier(newAttrs.con.value);
            baseUnarmoredAc = 10 + newDexMod + conMod;
            unarmoredFormulaText = `Defesa Sem Armadura: 10 + DES (${newDexMod >= 0 ? `+${newDexMod}` : newDexMod}) + CON (${conMod >= 0 ? `+${conMod}` : conMod})`;
        } else if (isMonk && shieldBonus === 0) {
            const wisMod = calculateModifier(newAttrs.wis.value);
            baseUnarmoredAc = 10 + newDexMod + wisMod;
            unarmoredFormulaText = `Defesa Sem Armadura: 10 + DES (${newDexMod >= 0 ? `+${newDexMod}` : newDexMod}) + SAB (${wisMod >= 0 ? `+${wisMod}` : wisMod})`;
        } else if (isDraconic) {
            baseUnarmoredAc = 13 + newDexMod;
            unarmoredFormulaText = `Resiliência Dracônica (13 + DES ${newDexMod >= 0 ? `+${newDexMod}` : newDexMod})`;
        }
    }

    const calculatedAcWithoutOverrides = (isArmored ? armorCalculatedAc : baseUnarmoredAc) + shieldBonus + magicItemAcBonus;

    // Build human-readable acBreakdown string
    let calculatedBreakdown = '';
    if (isArmored) {
        const armorParts: string[] = [`${equippedArmorName} (${armorBaseAc})`];
        if (armorDexContribution !== 0) {
            armorParts.push(`DES (${armorDexContribution >= 0 ? `+${armorDexContribution}` : armorDexContribution})`);
        }
        if (shieldBonus > 0) {
            armorParts.push(`${equippedShieldName || 'Escudo'} (+${shieldBonus})`);
        }
        if (magicItemAcBonus > 0) {
            armorParts.push(magicItemNames.join(' + '));
        }
        calculatedBreakdown = `${armorParts.join(' + ')} = ${calculatedAcWithoutOverrides}`;
    } else {
        const unarmoredParts: string[] = [unarmoredFormulaText];
        if (shieldBonus > 0) {
            unarmoredParts.push(`${equippedShieldName || 'Escudo'} (+${shieldBonus})`);
        }
        if (magicItemAcBonus > 0) {
            unarmoredParts.push(magicItemNames.join(' + '));
        }
        calculatedBreakdown = `${unarmoredParts.join(' + ')} = ${calculatedAcWithoutOverrides}`;
    }

    let finalAC = calculatedAcWithoutOverrides;
    let finalAcBreakdown = calculatedBreakdown;

    // Override if set (GM / Player Manual Edit)
    if (char.acOverride !== undefined) {
        finalAC = char.acOverride;
        finalAcBreakdown = `Valor Manual: ${char.acOverride} (Fórmula oficial: ${calculatedBreakdown})`;
    }

    // --- Auto-Build Attacks from Equipped Weapons ---
    const newAttacks: Attack[] = [];
    if (Array.isArray(char.inventory)) {
        char.inventory.forEach(item => {
            if (!item.equipped) return;

            let def = ITEMS.find(i => i.id === item.id || (item.defId && i.id === item.defId));
            if (!def && item.name) {
                const normName = item.name.toLowerCase().trim();
                def = ITEMS.find(i => i.name.toLowerCase() === normName);
            }

            const itemType = (item.type || def?.type || '').toLowerCase();
            const isWeapon = itemType === 'weapon' || itemType === 'arma' || def?.type === 'weapon';

            if (isWeapon) {
                const props = item.properties || def?.properties || [];
                const range = item.range || def?.range;
                const damage = item.damage || def?.damage || '1d4';
                const damageType = item.damageType || def?.damageType || 'físico';

                // Determine Attribute (Str vs Dex)
                let attrMod = newAttrs.str.modifier;
                const isFinesse = props.some(p => p.toLowerCase().includes('acuidade'));

                if (range && !props.some(p => p.toLowerCase().includes('arremesso'))) {
                    attrMod = newAttrs.dex.modifier;
                } else if (isFinesse) {
                    attrMod = Math.max(newAttrs.str.modifier, newAttrs.dex.modifier);
                }

                const hitBonus = attrMod + profBonus;
                const formattedMod = attrMod >= 0 ? `+ ${attrMod}` : `- ${Math.abs(attrMod)}`;
                const damageDice = attrMod === 0 ? damage : `${damage} ${formattedMod}`;

                newAttacks.push({
                    id: item.id,
                    name: item.name,
                    attackBonus: hitBonus,
                    damageDice: damageDice,
                    damageType: damageType,
                    range: range,
                    properties: props.join(', ')
                });
            }
        });
    }

    // Retain custom non-item attacks
    if (Array.isArray(char.attacks)) {
        char.attacks.forEach(atk => {
            if (atk.id === 'ataque_desarmado') return;
            if (char.inventory?.some(i => i.id === atk.id)) return;
            if (!newAttacks.some(a => a.id === atk.id)) {
                newAttacks.push(atk);
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

    let newSpellSaveDC = 0;
    let newSpellAttackBonus = 0;

    if (spellCastingAbility && newAttrs[spellCastingAbility]) {
        const spellMod = newAttrs[spellCastingAbility].modifier;
        newSpellSaveDC = 8 + profBonus + spellMod;
        newSpellAttackBonus = profBonus + spellMod;
    } else if (Array.isArray(char.spells) && char.spells.length > 0) {
        const intMod = newAttrs.int?.modifier || 0;
        const wisMod = newAttrs.wis?.modifier || 0;
        const chaMod = newAttrs.cha?.modifier || 0;
        const bestMentalMod = Math.max(intMod, wisMod, chaMod);
        newSpellSaveDC = 8 + profBonus + bestMentalMod;
        newSpellAttackBonus = profBonus + bestMentalMod;
    }

    // --- Initiative ---
    const finalInitiative = newDexMod + extraInitiative;

    // --- HP Max Update (Only Con Delta) ---
    const newConMod = newAttrs.con.modifier;
    const oldConMod = typeof char.attributes?.con?.modifier === 'number' && Number.isFinite(char.attributes.con.modifier)
        ? char.attributes.con.modifier
        : newConMod;
    const conDelta = newConMod - oldConMod;

    const safeHp = {
        current: typeof char.hp?.current === 'number' && Number.isFinite(char.hp.current) ? char.hp.current : 10,
        max: typeof char.hp?.max === 'number' && Number.isFinite(char.hp.max) ? char.hp.max : 10,
        temp: typeof char.hp?.temp === 'number' && Number.isFinite(char.hp.temp) ? char.hp.temp : 0
    };

    let finalHpMax = safeHp.max;
    if (conDelta !== 0) {
        finalHpMax = Math.max(1, finalHpMax + (conDelta * safeLevel));
    }

    // --- Speed Calculation (R4: usa deslocamento base racial, nunca soma sobre char.speed!) ---
    const racialBaseSpeed = resolveRacialBaseSpeed(char);
    const finalSpeed = (char.speedOverride !== undefined)
        ? char.speedOverride
        : Math.max(0, racialBaseSpeed + extraSpeed);

    // --- Scale Companions & Pets (D&D 5.5e / 2024 & Tasha Rules) ---
    let spellAbilityModForCompanions = 3;
    if (spellCastingAbility && newAttrs[spellCastingAbility]) {
        spellAbilityModForCompanions = newAttrs[spellCastingAbility].modifier;
    }

    const updatedCompanions: Companion[] = (Array.isArray(char.companions) ? char.companions : []).map(comp => {
        let preset: CompanionPreset | undefined;
        if (comp.presetId) {
            preset = COMPANION_PRESETS.find(p => p.id === comp.presetId);
        }
        if (!preset && comp.creatureType) {
            preset = COMPANION_PRESETS.find(p =>
                p.creatureType.toLowerCase() === comp.creatureType.toLowerCase() ||
                p.name.toLowerCase() === comp.name.toLowerCase()
            );
        }

        // AC calculation
        const baseAc = comp.baseAc ?? preset?.baseAc ?? comp.ac ?? 10;
        const acAddsPb = comp.acAddsPb ?? preset?.acAddsPb ?? false;
        let petCalculatedAc = baseAc;
        let petAcBreakdown = `Base ${baseAc}`;
        if (acAddsPb) {
            petCalculatedAc = baseAc + profBonus;
            petAcBreakdown = `Base ${baseAc} + Bônus Prof. (+${profBonus}) = ${petCalculatedAc}`;
        }
        const finalPetAc = comp.acOverride !== undefined ? comp.acOverride : petCalculatedAc;
        if (comp.acOverride !== undefined) {
            petAcBreakdown = `Manual / Barda: ${comp.acOverride} (Fórmula oficial: ${petCalculatedAc})`;
        }

        // HP calculation
        const baseHp = comp.baseHp ?? preset?.baseHp ?? comp.hp?.max ?? 10;
        const hpPerLevel = comp.hpPerLevel ?? preset?.hpPerLevel ?? 0;
        let finalMaxHp = baseHp;
        if (hpPerLevel > 0) {
            finalMaxHp = baseHp + (hpPerLevel * safeLevel);
        } else if (comp.hp?.max) {
            finalMaxHp = comp.hp.max;
        }

        const oldMax = comp.hp?.max || finalMaxHp;
        const currentHp = typeof comp.hp?.current === 'number' ? comp.hp.current : finalMaxHp;
        const damageTaken = Math.max(0, oldMax - currentHp);
        const finalCurrentHp = Math.max(0, Math.min(finalMaxHp, finalMaxHp - damageTaken));

        // Attack bonus and damage scaling
        const attacks = (comp.attacks || []).map((atk, idx) => {
            const presetAtk = preset?.attacks?.[idx] || preset?.attacks?.find(a => a.name.toLowerCase() === atk.name.toLowerCase());
            if (presetAtk?.scalesWithPb) {
                return {
                    ...atk,
                    attackBonus: spellAbilityModForCompanions + profBonus,
                    damage: `${presetAtk.damageDice} + ${profBonus}`
                };
            }
            return atk;
        });

        return {
            ...comp,
            presetId: comp.presetId || preset?.id,
            baseAc,
            acAddsPb,
            baseHp,
            hpPerLevel,
            ac: finalPetAc,
            acBreakdown: petAcBreakdown,
            hp: {
                current: finalCurrentHp,
                max: finalMaxHp,
                temp: comp.hp?.temp || 0
            },
            attacks
        };
    });

    return {
        ...char,
        level: safeLevel,
        attributes: newAttrs,
        proficiencyBonus: profBonus,
        skills: newSkills,
        armorClass: finalAC,
        acBreakdown: finalAcBreakdown,
        baseSpeed: racialBaseSpeed,
        speed: finalSpeed,
        hp: { ...safeHp, max: finalHpMax },
        hitDice: { ...initialCharacter.hitDice, ...(char.hitDice || {}) },
        deathSaves: { ...initialCharacter.deathSaves, ...(char.deathSaves || {}) },
        currency: { ...initialCharacter.currency, ...(char.currency || {}) },
        spellSlots: { ...initialCharacter.spellSlots, ...(char.spellSlots || {}) },
        inventory: (() => {
            const seenIds = new Set<string>();
            return (Array.isArray(char.inventory) ? char.inventory : []).map((item, idx) => {
                let id = item.id;
                if (!id || seenIds.has(id)) {
                    id = `${id || 'item'}_${idx}_${Math.random().toString(36).substring(2, 6)}`;
                }
                seenIds.add(id);
                return { ...item, id };
            });
        })(),
        companions: updatedCompanions,
        spells: Array.isArray(char.spells) ? char.spells : [],
        feats: Array.isArray(char.feats) ? char.feats : [],
        features: Array.isArray(char.features) ? char.features : [],
        classResources: Array.isArray(char.classResources) ? char.classResources : [],
        proficiencies: Array.isArray(char.proficiencies) ? char.proficiencies : [],
        languages: Array.isArray(char.languages) ? char.languages : ['Comum'],
        initiative: finalInitiative,
        attacks: newAttacks,
        spellSaveDC: newSpellSaveDC,
        spellAttackBonus: newSpellAttackBonus,
        pendingLevelUp: char.pendingLevelUp || false,
        levelUpTarget: char.levelUpTarget
    };
};

initialCharacter.skills = createDefaultSkills(initialCharacter.attributes);
