export type TacticalStatus = 'normal' | 'dodging' | 'dashing' | 'hiding' | 'help' | 'ready' | 'defending' | 'downed' | string;

export interface Combatant {
    id: string; // PeerID or generated ID for NPCs
    name: string;
    initiative: number;
    characterId?: string; // Links to Character Sheet
    isNPC: boolean;
    hp?: { current: number; max: number }; // Optional for quick tracking
    monsterId?: string; // Links to Bestiary Monster ID
    ac?: number; // Armor Class or Defense Value
    imageUrl?: string; // Avatar URL
    roll?: number; // Raw dice roll
    bonus?: number; // Modifier added
    status?: TacticalStatus; // Current tactical status or condition
    systemId?: string; // Game mode / lore identifier ('dnd5e', 'witcher', 'custom')
    customStats?: Record<string, any>; // System-agnostic properties
}

export interface CombatState {
    isActive: boolean;
    round: number;
    activeTurnId: string | null; // ID of the active combatant
    currentTargetId?: string | null; // ID of the targeted token
    combatants: Combatant[];
}
