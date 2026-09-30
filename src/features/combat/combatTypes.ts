export interface Combatant {
    id: string; // PeerID or generated ID for NPCs
    name: string;
    initiative: number;
    characterId?: string; // Links to Character Sheet
    isNPC: boolean;
    hp?: { current: number, max: number }; // Optional for quick tracking
    monsterId?: string; // Links to Bestiary Monster ID
    ac?: number; // Armor Class for reference
    imageUrl?: string; // Avatar URL
    roll?: number; // Raw dice roll
    bonus?: number; // Modifier added
    status?: 'normal' | 'dodging' | 'dashing' | 'hiding' | 'help' | 'ready'; // Current tactical status
}

export interface CombatState {
    isActive: boolean;
    round: number;
    activeTurnId: string | null; // ID of the combatant
    currentTargetId?: string | null; // ID of the targeted token
    combatants: Combatant[];
}
