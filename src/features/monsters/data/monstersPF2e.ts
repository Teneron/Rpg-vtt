import type { Monster } from '../monsterTypes';

export const MONSTERS_PF2E: Monster[] = [
    {
        id: 'pf2e_goblin_warrior',
        name: 'Guerreiro Goblin (PF2e)',
        category: 'Humanoide',
        description: 'Pequeno combatente goblin astuto e imprevisível. Utiliza a reação Escapulida Goblin (Goblin Scuttle) para reposicionar-se quando aliados avançam.',
        cr: 0.5, // Level -1
        size: 'Small',
        source: 'PF2e',
        system: 'pf2e',
        imageUrl: '/tokens/token_goblin.png',
        hp: { current: 6, max: 6 },
        ac: 16,
        speed: 5, // 7.5m (25ft)
        initiativeModifier: 2,
        attributes: {
            str: { value: 10, modifier: 0 },
            dex: { value: 16, modifier: 3 },
            con: { value: 12, modifier: 1 },
            int: { value: 10, modifier: 0 },
            wis: { value: 8, modifier: -1 },
            cha: { value: 8, modifier: -1 }
        },
        skills: ['Acrobacia +5', 'Atletismo +2', 'Furtividade +5'],
        senses: ['Visão no Escuro (Darkvision)'],
        visionRange: 18,
        actions: [
            {
                id: 'pf2e_goblin_shortsword',
                name: 'Golpe: Espada Curta [1 Ação]',
                type: 'melee',
                description: 'Ataque corpo a corpo ágil e de acuidade. Dano: 1d6 cortante.',
                damage: '1d6',
                toHit: 8
            },
            {
                id: 'pf2e_goblin_shortbow',
                name: 'Golpe: Arco Curto [1 Ação]',
                type: 'ranged',
                description: 'Ataque à distância (18m). Traço Deadly d10 em acertos críticos. Dano: 1d6 perfurante.',
                damage: '1d6',
                toHit: 8,
                range: '18m'
            }
        ],
        reactions: [
            {
                id: 'pf2e_goblin_scuttle',
                name: 'Escapulida Goblin [Reação]',
                type: 'reaction',
                description: 'Gatilho: Um aliado termina um movimento adjacente ao goblin. Efeito: O goblin dá um Passo Ajustado (Step) de 1,5m sem provocar reações.'
            }
        ]
    },
    {
        id: 'pf2e_zombie_shambler',
        name: 'Zumbi Vagaroso (PF2e)',
        category: 'Morto-Vivo',
        description: 'Cadáver ambulante reanimado por necromancia. Possui a condição Permanente Lento (Slowed 1), agindo com apenas 2 ações por turno, mas é implacável e agarra suas presas.',
        cr: 0.5, // Level -1
        size: 'Medium',
        source: 'PF2e',
        system: 'pf2e',
        imageUrl: '/tokens/token_skeleton.png',
        hp: { current: 20, max: 20 },
        ac: 12,
        speed: 5, // 7.5m
        initiativeModifier: 0,
        attributes: {
            str: { value: 16, modifier: 3 },
            dex: { value: 6, modifier: -2 },
            con: { value: 14, modifier: 2 },
            int: { value: 1, modifier: -5 },
            wis: { value: 10, modifier: 0 },
            cha: { value: 6, modifier: -2 }
        },
        skills: ['Atletismo +5'],
        senses: ['Visão no Escuro'],
        visionRange: 18,
        damageVulnerabilities: ['Cortante 5', 'Vitalidade (Dano Sagrado) 5'],
        damageImmunities: ['Veneno', 'Efeitos de Morte', 'Paralisia'],
        conditionImmunities: ['Inconsciente'],
        actions: [
            {
                id: 'pf2e_zombie_fist',
                name: 'Golpe: Punho Podre [1 Ação]',
                type: 'melee',
                description: 'Ataque corpo a corpo. Dano: 1d6+3 contundente. Se acertar, pode gastar [1 Ação] para Agarrar (Grab) automaticamente.',
                damage: '1d6 + 3',
                toHit: 7
            },
            {
                id: 'pf2e_zombie_jaws',
                name: 'Mordida Voraz [1 Ação]',
                type: 'melee',
                description: 'Ataque corpo a corpo contra um alvo que esteja com a condição Agarrado. Dano: 1d8+3 perfurante.',
                damage: '1d8 + 3',
                toHit: 7
            }
        ]
    },
    {
        id: 'pf2e_ogre_warrior',
        name: 'Brutamontes Ogro (PF2e)',
        category: 'Gigante',
        description: 'Um gigante selvagem monstruoso armado com uma clava devastadora de alcance. Possui Ataque Reativo (Reactive Strike) em 3 metros.',
        cr: 3, // Level 3
        size: 'Large',
        source: 'PF2e',
        system: 'pf2e',
        imageUrl: '/tokens/token_orc.png',
        hp: { current: 50, max: 50 },
        ac: 17,
        speed: 6, // 9m (30ft)
        initiativeModifier: 1,
        attributes: {
            str: { value: 20, modifier: 5 },
            dex: { value: 8, modifier: -1 },
            con: { value: 18, modifier: 4 },
            int: { value: 6, modifier: -2 },
            wis: { value: 10, modifier: 0 },
            cha: { value: 6, modifier: -2 }
        },
        skills: ['Atletismo +12', 'Intimidação +9'],
        senses: ['Visão na Penumbra (Low-Light)'],
        visionRange: 15,
        actions: [
            {
                id: 'pf2e_ogre_greatclub',
                name: 'Golpe: Clava Pesada [1 Ação]',
                type: 'melee',
                description: 'Ataque corpo a corpo com alcance de 3 metros (10ft) e traço Empurrão (Shove). Dano: 1d10+7 contundente.',
                damage: '1d10 + 7',
                toHit: 12,
                range: '3m'
            },
            {
                id: 'pf2e_ogre_javelin',
                name: 'Arremesso: Azagaia [1 Ação]',
                type: 'ranged',
                description: 'Ataque à distância (alcance 9m). Dano: 1d6+7 perfurante.',
                damage: '1d6 + 7',
                toHit: 6,
                range: '9m'
            }
        ],
        reactions: [
            {
                id: 'pf2e_ogre_reactive_strike',
                name: 'Ataque Reativo [Reação]',
                type: 'reaction',
                description: 'Gatilho: Um inimigo dentro de 3 metros usa uma ação de movimento ou manipular. Efeito: O ogro desfere um Golpe corpo a corpo imediato com a clava pesada.'
            }
        ]
    },
    {
        id: 'pf2e_young_red_dragon',
        name: 'Dragão Vermelho Jovem (PF2e)',
        category: 'Dragão',
        description: 'Um predador supremo dracônico com sopro flamejante em cone, aura férvida ardente e múltiplos ataques devastadores.',
        cr: 10, // Level 10
        size: 'Large',
        source: 'PF2e',
        system: 'pf2e',
        imageUrl: '/tokens/token_dragon.png',
        hp: { current: 210, max: 210 },
        ac: 30,
        speed: 8, // 12m chão, 36m voo
        initiativeModifier: 4,
        attributes: {
            str: { value: 22, modifier: 6 },
            dex: { value: 14, modifier: 2 },
            con: { value: 20, modifier: 5 },
            int: { value: 14, modifier: 2 },
            wis: { value: 18, modifier: 4 },
            cha: { value: 16, modifier: 3 }
        },
        skills: ['Acrobacia +18', 'Arcanismo +18', 'Atletismo +22', 'Intimidação +21', 'Furtividade +16'],
        senses: ['Visão no Escuro 36m', 'Olfato Apurado 18m'],
        visionRange: 36,
        damageImmunities: ['Fogo', 'Paralisia', 'Sono'],
        damageVulnerabilities: ['Frio 10'],
        actions: [
            {
                id: 'pf2e_dragon_breath',
                name: 'Sopro de Fogo [2 Ações]',
                type: 'ability',
                description: 'Cone de 9 metros de chamas ardentes. Dano: 11d6 de fogo (Salvamento Básico de Reflexos CD 30). Recarga 1d4 rodadas.',
                damage: '11d6'
            },
            {
                id: 'pf2e_dragon_jaws',
                name: 'Golpe: Mandíbulas Flamejantes [1 Ação]',
                type: 'melee',
                description: 'Alcance 3m. Dano: 2d12+10 perfurante mais 2d6 de fogo.',
                damage: '2d12 + 10 + 2d6',
                toHit: 23,
                range: '3m'
            },
            {
                id: 'pf2e_dragon_claws',
                name: 'Golpe: Garras Dracônicas [1 Ação]',
                type: 'melee',
                description: 'Ágil, alcance 2,5m. Dano: 2d8+10 cortante.',
                damage: '2d8 + 10',
                toHit: 23
            }
        ],
        reactions: [
            {
                id: 'pf2e_dragon_reactive_strike',
                name: 'Ataque Reativo [Reação]',
                type: 'reaction',
                description: 'Gatilho: Um inimigo a até 3m usa ação de movimento ou manipular. O dragão morde com mandíbulas.'
            }
        ]
    }
];
