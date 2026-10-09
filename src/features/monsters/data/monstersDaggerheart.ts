import type { Monster } from '../monsterTypes';

export const MONSTERS_DAGGERHEART: Monster[] = [
    {
        id: 'dh_goblin_prowler',
        name: 'Goblin Espreitador (Daggerheart)',
        category: 'Humanoide / Lacaio',
        description: 'Tier 1 Minion (Lacaio). Dificuldade 12. Possui a regra Minion 4: se sofrer 4 ou mais de dano, é destruído e o dano excedente elimina lacaios goblins adjacentes.',
        cr: 1, // Tier 1
        size: 'Small',
        source: 'Daggerheart',
        system: 'daggerheart',
        imageUrl: '/tokens/token_goblin.png',
        hp: { current: 1, max: 1 },
        ac: 12, // Difficulty 12
        speed: 6,
        initiativeModifier: 2,
        attributes: {
            str: { value: 8, modifier: -1 },
            dex: { value: 14, modifier: 2 },
            con: { value: 10, modifier: 0 },
            int: { value: 10, modifier: 0 },
            wis: { value: 8, modifier: -1 },
            cha: { value: 8, modifier: -1 }
        },
        skills: ['Furtividade +2', 'Ataque em Grupo'],
        senses: ['Visão Noturna'],
        visionRange: 18,
        actions: [
            {
                id: 'dh_goblin_dagger',
                name: 'Adaga Enferrujada (Ataque do Mestre)',
                type: 'melee',
                description: 'Ataque contra a Evasão do herói. Dano: 3 físico. Lacaios adjacentes podem juntar-se para Ataque em Grupo (+2 dano por goblin extra).',
                damage: '3',
                toHit: 1
            }
        ]
    },
    {
        id: 'dh_dire_wolf',
        name: 'Lobo Atroz (Daggerheart)',
        category: 'Besta / Emboscador',
        description: 'Tier 1 Skulk (Emboscador). Dificuldade 13. Limiares de Dano: Maior 6 | Severo 11. Tática de Alcateia concede Vantagem (+1d6) se aliado estiver adjacente à presa.',
        cr: 1, // Tier 1
        size: 'Medium',
        source: 'Daggerheart',
        system: 'daggerheart',
        imageUrl: '/tokens/token_beast.png',
        hp: { current: 4, max: 4 }, // 4 HP slots
        ac: 13, // Difficulty 13
        speed: 8,
        initiativeModifier: 3,
        attributes: {
            str: { value: 14, modifier: 2 },
            dex: { value: 14, modifier: 2 },
            con: { value: 12, modifier: 1 },
            int: { value: 4, modifier: -3 },
            wis: { value: 12, modifier: 1 },
            cha: { value: 6, modifier: -2 }
        },
        skills: ['Percepção +3', 'Furtividade +2'],
        senses: ['Olfato Apurado', 'Visão na Penumbra'],
        visionRange: 20,
        actions: [
            {
                id: 'dh_wolf_bite',
                name: 'Mordida Serrilhada & Derrubada',
                type: 'melee',
                description: 'Ataque contra Evasão (+2). Dano: 1d8+3 físico. Se causar Dano Maior ou Severo, o herói deve passar em Reação de Força DC 13 ou fica Vulnerável.',
                damage: '1d8 + 3',
                toHit: 2
            }
        ]
    },
    {
        id: 'dh_crypt_skeleton',
        name: 'Esqueleto Guardião de Tumba (Daggerheart)',
        category: 'Morto-Vivo / Brutamontes',
        description: 'Tier 1 Bruiser (Brutamontes). Dificuldade 11. Limiares de Dano: Maior 8 | Severo 15. Resistência Óssea: reduz severidade de dano perfurante e cortante em 1 grau.',
        cr: 1, // Tier 1
        size: 'Medium',
        source: 'Daggerheart',
        system: 'daggerheart',
        imageUrl: '/tokens/token_skeleton.png',
        hp: { current: 5, max: 5 }, // 5 HP slots
        ac: 11, // Difficulty 11
        speed: 5,
        initiativeModifier: 0,
        attributes: {
            str: { value: 16, modifier: 3 },
            dex: { value: 10, modifier: 0 },
            con: { value: 14, modifier: 2 },
            int: { value: 6, modifier: -2 },
            wis: { value: 8, modifier: -1 },
            cha: { value: 6, modifier: -2 }
        },
        skills: ['Atletismo +3'],
        senses: ['Visão no Escuro'],
        visionRange: 18,
        damageResistances: ['Cortante', 'Perfurante'],
        actions: [
            {
                id: 'dh_skeleton_greataxe',
                name: 'Machado Ancestral de Duas Mãos',
                type: 'melee',
                description: 'Ataque contra Evasão (+1). Dano: 1d12+2 físico.',
                damage: '1d12 + 2',
                toHit: 1
            },
            {
                id: 'dh_skeleton_cleave',
                name: 'Golpe Esmagador em Arco (Gasta 1 Medo)',
                type: 'ability',
                description: 'O esqueleto gira o machado. Todos os heróis a alcance corpo a corpo fazem Reação de Agilidade DC 12 ou sofrem 1d10 de dano físico e são arremessados.',
                damage: '1d10'
            }
        ]
    },
    {
        id: 'dh_cinder_dragon',
        name: 'Dragão Jovem das Cinzas (Daggerheart)',
        category: 'Dragão / Solo',
        description: 'Tier 3 Solo (Chefão Épico). Dificuldade 17. Limiares: Maior 18 | Severo 32. HP: 9 slots. Traço Relentless 2 (age duas vezes por turno do Mestre sem gastar Medo).',
        cr: 3, // Tier 3
        size: 'Large',
        source: 'Daggerheart',
        system: 'daggerheart',
        imageUrl: '/tokens/token_dragon.png',
        hp: { current: 9, max: 9 }, // 9 HP slots
        ac: 17, // Difficulty 17
        speed: 8,
        initiativeModifier: 4,
        attributes: {
            str: { value: 20, modifier: 5 },
            dex: { value: 14, modifier: 2 },
            con: { value: 18, modifier: 4 },
            int: { value: 12, modifier: 1 },
            wis: { value: 14, modifier: 2 },
            cha: { value: 16, modifier: 3 }
        },
        skills: ['Intimidação +4', 'Percepção +3'],
        senses: ['Visão no Escuro', 'Sentido Sísmico'],
        visionRange: 30,
        damageImmunities: ['Fogo'],
        actions: [
            {
                id: 'dh_dragon_claws_bite',
                name: 'Presas & Garras Flamejantes',
                type: 'melee',
                description: 'Ataque contra Evasão (+3). Dano: 2d10+6 físico/mágico.',
                damage: '2d10 + 6',
                toHit: 3
            },
            {
                id: 'dh_dragon_breath',
                name: 'Sopro de Cinzas e Labaredas (Gasta 2 Medo)',
                type: 'ability',
                description: 'Cone devastador de fogo close-range. Reação de Agilidade DC 16 ou sofrem 3d8+4 de dano mágico de fogo e ficam Vulneráveis.',
                damage: '3d8 + 4'
            }
        ],
        reactions: [
            {
                id: 'dh_dragon_wings',
                name: 'Bater de Asas da Tempestade [Reação]',
                type: 'reaction',
                description: 'Quando atacado corpo a corpo, gasta 1 Estresse para empurrar todos os atacantes para alcance Close (Reação de Força DC 14 ou caem).'
            }
        ]
    }
];
