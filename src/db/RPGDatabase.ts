import Dexie, { type EntityTable } from 'dexie';
import type { MapConfig, MapToken, Wall, Scene } from '../features/map/mapTypes';
import type { RollEvent } from '../features/dice/RollHistoryContext';

// --- Interfaces ---

export interface Campaign {
    id: string; // UUID
    name: string;
    createdAt: number;
    updatedAt: number;
    logs: RollEvent[]; // Chat/Roll logs stored here for now
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
    data: Blob | string; // Base64 or BlobURL if we can store it? IndexedDB stores Blobs well.
    category?: string; // e.g. "Music", "SFX", "Token"
}

// --- Database Class ---

export class RPGDatabase extends Dexie {
    campaigns!: EntityTable<Campaign, 'id'>;
    maps!: EntityTable<MapData, 'id'>; // Primary Key is number, we query by campaignId
    scenes!: EntityTable<Scene, 'id'>; // Use Scene type directly from mapTypes
    assets!: EntityTable<AssetData, 'id'>;

    constructor() {
        super('RPG_Tabletop_DB');

        this.version(1).stores({
            campaigns: 'id, name, createdAt, updatedAt', // Primary Key: id
            maps: '++id, campaignId', // Index campaignId for fast lookup
            scenes: 'id, campaignId', // Scenes are identified by UUID string ID, and linked to campaign
            assets: '++id, campaignId, type'
        });
    }
}

export const db = new RPGDatabase();
