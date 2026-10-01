import Dexie, { type EntityTable } from 'dexie';
import type { MapConfig, MapToken, Wall, Scene } from '../features/map/mapTypes';
import type { RollEvent } from '../features/dice/RollHistoryContext';
import type { Character } from '../features/character/characterTypes';
import type { Monster } from '../features/monsters/monsterTypes';

// --- Interfaces ---

export interface Campaign {
    id: string; // UUID
    name: string;
    createdAt: number;
    updatedAt: number;
    logs: RollEvent[]; // Chat/Roll logs stored here
}

export interface MapData {
    id?: number; // Auto-increment ID specifically for the DB entry
    campaignId: string; // Foreign Key to Campaign
    name: string; // "Default Map", "Dungeon Level 1", etc.
    config: MapConfig;
    tokens: MapToken[];
    walls: Wall[];
    lastUpdated?: number;
}

export interface AssetData {
    id?: number;
    campaignId: string;
    type: 'audio' | 'image';
    name: string;
    data: Blob | string; // Base64 or Blob
    category?: string; // e.g. "Music", "SFX", "Token"
}

export interface RollLogEntry extends RollEvent {
    campaignId?: string;
}

// --- Database Class ---

export class RPGDatabase extends Dexie {
    campaigns!: EntityTable<Campaign, 'id'>;
    maps!: EntityTable<MapData, 'id'>; // Primary Key is number, we query by campaignId
    scenes!: EntityTable<Scene, 'id'>; // Use Scene type directly from mapTypes
    assets!: EntityTable<AssetData, 'id'>;
    characters!: EntityTable<Character, 'id'>;
    customMonsters!: EntityTable<Monster, 'id'>;
    rollLogs!: EntityTable<RollLogEntry, 'id'>;

    constructor() {
        super('RPG_Tabletop_DB');

        this.version(1).stores({
            campaigns: 'id, name, createdAt, updatedAt',
            maps: '++id, campaignId',
            scenes: 'id, campaignId',
            assets: '++id, campaignId, type'
        });

        this.version(2).stores({
            campaigns: 'id, name, createdAt, updatedAt',
            maps: '++id, campaignId',
            scenes: 'id, campaignId',
            assets: '++id, campaignId, type',
            characters: 'id, name, owner, adventureId, lastModified',
            customMonsters: 'id, name, category, source, cr',
            rollLogs: 'id, campaignId, timestamp, playerName'
        });
    }
}

export const db = new RPGDatabase();
