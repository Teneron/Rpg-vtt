import type { Scene } from '../../map/mapTypes';

export interface SystemScenario {
    systemId: 'witcher' | 'dnd55e' | string;
    scenarioTitle: string;
    scenarioDescription: string;
    scene: Scene;
}

export const SYSTEM_SCENARIOS: Record<string, SystemScenario> = {
    // =========================================================================
    // THE WITCHER (ADAPTADO D&D 5E COM MAPA DO CONTINENTE E TOKENS)
    // =========================================================================
    witcher: {
        systemId: 'witcher',
        scenarioTitle: 'O Continente: Terras de Velen & Conjunção',
        scenarioDescription: 'O mapa oficial do Continente nas terras de ninguém de Velen. Bruxos e monstros em uma terra devastada por guerras e bestas sobrenaturais.',
        scene: {
            id: 'scenario_witcher_continent',
            name: 'O Continente: Velen (The Witcher)',
            config: {
                width: 25,
                height: 18,
                gridSize: 50,
                scale: 1,
                offsetX: 0,
                offsetY: 0,
                backgroundColor: '#0a0d0b',
                backgroundImage: '/assets/maps/continent_map.webp',
                backgroundImageType: 'image',
                gridColor: 'rgba(197, 160, 89, 0.25)',
                globalLight: 'dim',
                fogEnabled: false, // Permite admirar o belíssimo mapa do Continente
                walls: [
                    { id: 'w_fence_1', start: { x: 200, y: 250 }, end: { x: 500, y: 250 }, type: 'wall', color: '#c5a059' },
                    { id: 'w_fence_2', start: { x: 500, y: 250 }, end: { x: 500, y: 500 }, type: 'wall', color: '#c5a059' },
                    { id: 'w_fence_door', start: { x: 500, y: 500 }, end: { x: 500, y: 600 }, type: 'door', isOpen: true, color: '#eab308' },
                    { id: 'w_fence_3', start: { x: 500, y: 600 }, end: { x: 200, y: 600 }, type: 'wall', color: '#c5a059' }
                ]
            },
            walls: [
                { id: 'w_fence_1', start: { x: 200, y: 250 }, end: { x: 500, y: 250 }, type: 'wall', color: '#c5a059' },
                { id: 'w_fence_2', start: { x: 500, y: 250 }, end: { x: 500, y: 500 }, type: 'wall', color: '#c5a059' },
                { id: 'w_fence_door', start: { x: 500, y: 500 }, end: { x: 500, y: 600 }, type: 'door', isOpen: true, color: '#eab308' },
                { id: 'w_fence_3', start: { x: 500, y: 600 }, end: { x: 200, y: 600 }, type: 'wall', color: '#c5a059' }
            ],
            tokens: [
                // Heróis do Witcher
                {
                    id: 'token_geralt_pc',
                    name: 'Geralt de Rívia (Lobo Branco)',
                    imageUrl: '/tokens/token_witcher_geralt.png',
                    color: '#c5a059',
                    position: { x: 5, y: 7 },
                    size: 1,
                    hp: { current: 45, max: 45 },
                    ac: 16,
                    visionRange: 18,
                    lightRadius: 6,
                    dimLightRadius: 12,
                    lightColor: '#c5a059',
                    lightEnabled: true,
                    visibleStats: true
                },
                {
                    id: 'token_ciri_pc',
                    name: 'Ciri de Cintra',
                    imageUrl: '/tokens/token_ciri.png',
                    color: '#38bdf8',
                    position: { x: 6, y: 8 },
                    size: 1,
                    hp: { current: 35, max: 35 },
                    ac: 15,
                    visionRange: 15,
                    visibleStats: true
                },
                // Monstros com tokens oficiais
                {
                    id: 'token_drowner_mob',
                    name: 'Afogador do Pântano',
                    monsterId: 'drowner',
                    imageUrl: '/tokens/token_drowner.png',
                    color: '#0284c7',
                    position: { x: 13, y: 6 },
                    size: 1,
                    hp: { current: 25, max: 25 },
                    ac: 12,
                    visibleStats: true
                },
                {
                    id: 'token_ghoul_mob',
                    name: 'Carniçal Faminto (Ghoul)',
                    monsterId: 'ghoul',
                    imageUrl: '/tokens/token_ghoul.png',
                    color: '#eab308',
                    position: { x: 15, y: 9 },
                    size: 1,
                    hp: { current: 22, max: 22 },
                    ac: 12,
                    visibleStats: true
                },
                {
                    id: 'token_katakan_boss',
                    name: 'Katakan (Vampiro Superior)',
                    monsterId: 'katakan',
                    imageUrl: '/tokens/token_katakan.png',
                    color: '#a855f7',
                    position: { x: 18, y: 11 },
                    size: 1.5,
                    hp: { current: 65, max: 65 },
                    ac: 15,
                    visibleStats: true
                },
                {
                    id: 'token_wolf_pack',
                    name: 'Lobo Selvagem',
                    imageUrl: '/tokens/token_wolf.png',
                    color: '#64748b',
                    position: { x: 11, y: 13 },
                    size: 1,
                    hp: { current: 11, max: 11 },
                    ac: 13,
                    visibleStats: true
                }
            ]
        }
    },

    // =========================================================================
    // D&D 5.5E (2024 CORE RULES COM MAPA DE GREYHAWK E REGRAS REVISADAS)
    // =========================================================================
    dnd55e: {
        systemId: 'dnd55e',
        scenarioTitle: 'A Cidade Livre de Greyhawk & Oerth (D&D 5.5e 2024)',
        scenarioDescription: 'O cenário oficial de D&D 2024. Aventure-se pelos becos e masmorras de Greyhawk com Maestria de Armas, Ataques Desarmados 2024 e Inspiração Heroica.',
        scene: {
            id: 'scenario_dnd55e_greyhawk',
            name: 'A Cidade Livre de Greyhawk (D&D 2024)',
            config: {
                width: 26,
                height: 18,
                gridSize: 50,
                scale: 1,
                offsetX: 0,
                offsetY: 0,
                backgroundColor: '#120f18',
                backgroundImage: '/assets/maps/greyhawk_city_map.jpg',
                backgroundImageType: 'image',
                gridColor: 'rgba(225, 29, 72, 0.2)',
                globalLight: 'dim',
                fogEnabled: false,
                walls: [
                    { id: 'gh_w1', start: { x: 150, y: 100 }, end: { x: 600, y: 100 }, type: 'wall', color: '#be123c' },
                    { id: 'gh_w2', start: { x: 600, y: 100 }, end: { x: 600, y: 350 }, type: 'wall', color: '#be123c' },
                    { id: 'gh_door_1', start: { x: 600, y: 350 }, end: { x: 600, y: 450 }, type: 'door', isOpen: false, color: '#f59e0b' },
                    { id: 'gh_w3', start: { x: 600, y: 450 }, end: { x: 600, y: 700 }, type: 'wall', color: '#be123c' }
                ]
            },
            walls: [
                { id: 'gh_w1', start: { x: 150, y: 100 }, end: { x: 600, y: 100 }, type: 'wall', color: '#be123c' },
                { id: 'gh_w2', start: { x: 600, y: 100 }, end: { x: 600, y: 350 }, type: 'wall', color: '#be123c' },
                { id: 'gh_door_1', start: { x: 600, y: 350 }, end: { x: 600, y: 450 }, type: 'door', isOpen: false, color: '#f59e0b' },
                { id: 'gh_w3', start: { x: 600, y: 450 }, end: { x: 600, y: 700 }, type: 'wall', color: '#be123c' }
            ],
            tokens: [
                // Heróis D&D 2024
                {
                    id: 'token_pc_thorne_2024',
                    name: 'Thorne (Guerreiro 2024)',
                    imageUrl: '/tokens/token_humanoid.png',
                    color: '#e11d48',
                    position: { x: 4, y: 5 },
                    size: 1,
                    hp: { current: 15, max: 15 },
                    ac: 18,
                    lightRadius: 6,
                    dimLightRadius: 12,
                    lightColor: '#ff9900',
                    lightEnabled: true,
                    visibleStats: true
                },
                {
                    id: 'token_pc_lyra_2024',
                    name: 'Lyra (Maga 2024)',
                    imageUrl: '/tokens/token_ciri.png',
                    color: '#8b5cf6',
                    position: { x: 3, y: 6 },
                    size: 1,
                    hp: { current: 8, max: 8 },
                    ac: 15,
                    visibleStats: true
                },
                {
                    id: 'token_pc_varis_2024',
                    name: 'Varis (Ladino 2024)',
                    imageUrl: '/tokens/token_humanoid.png',
                    color: '#a855f7',
                    position: { x: 5, y: 4 },
                    size: 1,
                    hp: { current: 10, max: 10 },
                    ac: 16,
                    visibleStats: true
                },
                // Monstros D&D 2024
                {
                    id: 'token_goblin_1',
                    name: 'Goblin Sentinela',
                    monsterId: 'goblin',
                    imageUrl: '/tokens/token_goblin.png',
                    color: '#84cc16',
                    position: { x: 12, y: 5 },
                    size: 1,
                    hp: { current: 7, max: 7 },
                    ac: 15,
                    visibleStats: true
                },
                {
                    id: 'token_orc_1',
                    name: 'Orc Guerreiro',
                    monsterId: 'orc',
                    imageUrl: '/tokens/token_orc.png',
                    color: '#e11d48',
                    position: { x: 15, y: 6 },
                    size: 1,
                    hp: { current: 15, max: 15 },
                    ac: 13,
                    visibleStats: true
                },
                {
                    id: 'token_skeleton_1',
                    name: 'Esqueleto da Cripta',
                    monsterId: 'skeleton',
                    imageUrl: '/tokens/token_skeleton.png',
                    color: '#e2e8f0',
                    position: { x: 17, y: 4 },
                    size: 1,
                    hp: { current: 13, max: 13 },
                    ac: 13,
                    visibleStats: true
                },
                {
                    id: 'token_red_dragon',
                    name: 'Dragão Vermelho Jovem',
                    monsterId: 'young_red_dragon',
                    imageUrl: '/tokens/token_dragon.png',
                    color: '#ef4444',
                    position: { x: 18, y: 10 },
                    size: 2,
                    hp: { current: 178, max: 178 },
                    ac: 18,
                    visibleStats: true
                }
            ]
        }
    }
};

export const getScenarioForSystem = (systemId: string): SystemScenario => {
    if (systemId === 'dnd5e') return SYSTEM_SCENARIOS.dnd55e;
    return SYSTEM_SCENARIOS[systemId] || SYSTEM_SCENARIOS.witcher;
};
