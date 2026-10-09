export interface Position {
    x: number;
    y: number;
}

export interface MapToken {
    id: string;
    characterId?: string; // Linked Character ID (PC)
    monsterId?: string; // Linked Bestiary Monster ID (NPC/Monster)
    combatantId?: string; // Linked Combat Tracker ID (Active Instance)
    name: string;
    color: string;
    position: Position;
    size: number; // in grid cells
    imageUrl?: string;

    // Vision & Light
    visionRange?: number; // Metros que o token enxerga na escuridão (Darkvision)
    lightRadius?: number; // Metros de luz brilhante que emite
    dimLightRadius?: number; // Metros de luz baixa (além da luz brilhante)
    lightColor?: string; // Cor da luz emitida

    // NPC Stats (Optional - for tokens not linked to a full Character Sheet)
    hp?: { current: number; max: number; temp?: number };
    ac?: number;

    // GM Controls
    invisible?: boolean; // If true, only GM sees this token (as ghost)
    visibleStats?: boolean; // If true, everyone sees HP bar (normally only GM/Owner)
    isAsset?: boolean; // If true, renders as full image (square/rect) instead of circular token
    rotation?: number; // Rotation in degrees (0-360)
    isLocked?: boolean; // If true, prevents movement (even by GM)
    lightEnabled?: boolean; // If true (or undefined), emits light. If false, light is off.
    elevation?: number; // Metros de elevação / voo acima do chão
    conditions?: string[]; // Condições ativas no combate (ex: 'Caído', 'Cego', 'Amedrontado')
}

export interface Wall {
    id: string;
    start: Position;
    end: Position;
    type: 'wall' | 'door' | 'window';
    isOpen?: boolean; // For doors
    color?: string;
}

export interface MapConfig {
    gridSize: number; // pixels per cell
    width: number;    // cells
    height: number;   // cells
    scale: number;    // Zoom level
    offsetX: number;  // Pan X
    offsetY: number;  // Pan Y
    backgroundColor?: string;
    backgroundImage?: string;
    backgroundImageType?: 'image' | 'video'; // Support for animated maps
    globalLight: 'dim' | 'bright' | 'dark'; // 'dim' = sombras manuais, 'bright' = tudo visto, 'dark' = apenas luzes
    fogEnabled?: boolean; // Mestre pode desativar globalmente
    gridColor: string;
    walls: Wall[];
    fogData?: string; // DataURL of exploration mask
}

export interface Scene {
    id: string;
    name: string;
    thumbnail?: string; // Optional preview
    config: MapConfig;
    tokens: MapToken[];
    walls: Wall[]; // Include walls in the scene
}

export const initialMapConfig: MapConfig = {
    width: 20,
    height: 15,
    gridSize: 50,
    scale: 1,
    offsetX: 0,
    offsetY: 0,
    globalLight: 'dim',
    fogEnabled: true,
    gridColor: '#444',
    walls: [],
    backgroundImageType: 'image'
};

export const defaultScene: Scene = {
    id: 'default',
    name: 'Nova Cena',
    config: initialMapConfig,
    tokens: [],
    walls: []
};
