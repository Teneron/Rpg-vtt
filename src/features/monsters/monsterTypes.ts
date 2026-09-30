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
    category: string; // e.g. "Necrophage", "Humanoid"
    source: 'DnD5e' | 'Witcher' | 'Custom';
    description?: string;
    size?: string; // "Medium", "Large", "Huge", etc.

    // Stats
    cr: number; // Challenge Rating or Danger
    hp: {
        current: number;
        max: number;
    };
    ac: number; // Armor Class (or Dodge/Defense in Witcher)
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
        // Witcher extras (mapped or ignored? We'll stick to 6 for compatibility or add optional)
        ref?: MonsterAttribute; // Reflex (Witcher)
        will?: MonsterAttribute; // Will (Witcher) since 5e uses Wis/Cha
    };

    // Skills/Saves (Simplified)
    skills: string[]; // e.g. "Stealth +6"
    senses: string[]; // e.g. "Darkvision 60ft"

    // Resistances & Vulnerabilities (For Witcher Knowledge)
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
