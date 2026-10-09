export interface MonsterAttribute {
    value: number;
    modifier: number;
}

export interface MonsterAction {
    id: string;
    name: string;
    type: 'melee' | 'ranged' | 'spell' | 'ability' | 'reaction';
    description: string;
    damage?: string;
    toHit?: number;
    range?: string;
}

export interface Monster {
    id: string;
    name: string;
    category: string; // e.g. "Necrophage", "Humanoid", "Aberration", "Dragon"
    source: 'DnD5e' | 'Witcher' | 'PF2e' | 'Daggerheart' | 'Custom' | (string & {});
    campaignId?: string; // Optional: Scope monster to a specific adventure
    system?: string; // Optional: System tag (e.g. "dnd5e", "witcher", "pf2e", "daggerheart")
    description?: string;
    size?: string; // "Small", "Medium", "Large", "Huge", "Gargantuan"

    // Stats
    cr: number; // Challenge Rating, Danger or Tier
    hp: {
        current: number;
        max: number;
    };
    ac: number; // Armor Class, Evasion, or Defense
    speed: number;
    initiativeModifier?: number;

    // Attributes
    attributes: {
        str: MonsterAttribute;
        dex: MonsterAttribute;
        con: MonsterAttribute;
        int: MonsterAttribute;
        wis: MonsterAttribute;
        cha: MonsterAttribute;
        // Witcher / Daggerheart extras
        ref?: MonsterAttribute;
        will?: MonsterAttribute;
    };

    // Skills/Saves (Simplified)
    skills: string[]; // e.g. "Stealth +6"
    senses: string[]; // e.g. "Darkvision 60ft"

    // Resistances & Vulnerabilities
    damageVulnerabilities?: string[];
    damageResistances?: string[];
    damageImmunities?: string[];
    conditionImmunities?: string[];

    // Combat
    actions: MonsterAction[];
    reactions?: MonsterAction[];

    // Vision for Map
    visionRange: number;
    lightRadius?: number;

    // Appearance
    imageUrl?: string; // URL for token image
}
