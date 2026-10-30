import type { Monster } from '../monsterTypes';

export const MONSTERS_5E: Monster[] = [
    {
        id: 'goblin',
        name: 'Goblin',
        category: 'Humanoid',
        description: 'Pequenos humanoides maliciosos que vivem em cavernas e ruínas. Atacam em bando e são covardes se estiverem em desvantagem.',
        // type: 'Humanoid (Goblinoid)', // Removed to match interface
        cr: 0.25,
        imageUrl: '/tokens/token_goblin.png',
        // size: 1, // Small (treated as medium for grid simplific)
        hp: { current: 7, max: 7 },
        ac: 15,
        speed: 6, // 30ft ~ 6 squares/m logic? In 5e 30ft is 6 squares.
        initiativeModifier: 2,
        attributes: {
            str: { value: 8, modifier: -1 },
            dex: { value: 14, modifier: 2 },
            con: { value: 10, modifier: 0 },
            int: { value: 10, modifier: 0 },
            wis: { value: 8, modifier: -1 },
            cha: { value: 8, modifier: -1 }
        },
        skills: ['Stealth +6'],
        senses: ['Darkvision 60ft', 'Passive Perception 9'],
        visionRange: 18, // Darkvision 60ft
        source: 'DnD5e',
        actions: [
            {
                id: 'goblin_scimitar',
                name: 'Scimitar',
                type: 'melee',
                description: 'Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 5 (1d6 + 2) slashing damage.',
                damage: '1d6 + 2',
                toHit: 4
            },
            {
                id: 'goblin_shortbow',
                name: 'Shortbow',
                type: 'ranged',
                description: 'Ranged Weapon Attack: +4 to hit, range 80/320 ft., one target. Hit: 5 (1d6 + 2) piercing damage.',
                damage: '1d6 + 2',
                toHit: 4
            }
        ]
    },
    {
        id: 'orc',
        name: 'Orc',
        category: 'Humanoid',
        description: 'Guerreiros tribais selvagens com pele acinzentada e presas proeminentes. Vivem para a batalha e conquista.',
        cr: 0.5,
        imageUrl: '/tokens/token_orc.png',
        hp: { current: 15, max: 15 },
        ac: 13,
        speed: 6,
        initiativeModifier: 1,
        attributes: {
            str: { value: 16, modifier: 3 },
            dex: { value: 12, modifier: 1 },
            con: { value: 16, modifier: 3 },
            int: { value: 7, modifier: -2 },
            wis: { value: 11, modifier: 0 },
            cha: { value: 10, modifier: 0 }
        },
        skills: ['Intimidation +2'],
        senses: ['Darkvision 60ft', 'Passive Perception 10'],
        visionRange: 18,
        source: 'DnD5e',
        actions: [
            {
                id: 'orc_greataxe',
                name: 'Greataxe',
                type: 'melee',
                description: 'Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 9 (1d12 + 3) slashing damage.',
                damage: '1d12 + 3',
                toHit: 5
            },
            {
                id: 'orc_javelin',
                name: 'Javelin',
                type: 'ranged',
                description: 'Melee or Ranged Weapon Attack: +5 to hit, reach 5 ft. or range 30/120 ft., one target. Hit: 6 (1d6 + 3) piercing damage.',
                damage: '1d6 + 3',
                toHit: 5
            }
        ]
    },
    {
        id: 'skeleton',
        name: 'Skeleton',
        category: 'Undead',
        description: 'Ossos animados por magia negra. Seguem ordens literalmente e não possuem mente própria.',
        cr: 0.25,
        imageUrl: '/tokens/token_skeleton.png',
        hp: { current: 13, max: 13 },
        ac: 13,
        speed: 6,
        initiativeModifier: 2,
        attributes: {
            str: { value: 10, modifier: 0 },
            dex: { value: 14, modifier: 2 },
            con: { value: 15, modifier: 2 },
            int: { value: 6, modifier: -2 },
            wis: { value: 8, modifier: -1 },
            cha: { value: 5, modifier: -3 }
        },
        skills: [],
        senses: ['Darkvision 60ft', 'Passive Perception 9'],
        visionRange: 18,
        source: 'DnD5e',
        actions: [
            {
                id: 'skeleton_shortsword',
                name: 'Shortsword',
                type: 'melee',
                description: 'Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 5 (1d6 + 2) piercing damage.',
                damage: '1d6 + 2',
                toHit: 4
            },
            {
                id: 'skeleton_shortbow',
                name: 'Shortbow',
                type: 'ranged',
                description: 'Ranged Weapon Attack: +4 to hit, range 80/320 ft., one target. Hit: 5 (1d6 + 2) piercing damage.',
                damage: '1d6 + 2',
                toHit: 4
            }
        ]
    },

    {
        id: 'zombie',
        name: 'Zombie',
        category: 'Undead',
        description: 'Um cadáver reanimado por magia negra, movido apenas pela fome de carne viva.',
        cr: 0.25,
        imageUrl: '/tokens/token_zombie.png',
        hp: { current: 22, max: 22 },
        ac: 8,
        speed: 4,
        initiativeModifier: -2,
        attributes: {
            str: { value: 13, modifier: 1 },
            dex: { value: 6, modifier: -2 },
            con: { value: 16, modifier: 3 },
            int: { value: 3, modifier: -4 },
            wis: { value: 6, modifier: -2 },
            cha: { value: 5, modifier: -3 }
        },
        skills: [],
        senses: ['Darkvision 60ft', 'Passive Perception 8'],
        visionRange: 18,
        source: 'DnD5e',
        actions: [
            {
                id: 'zombie_slam',
                name: 'Slam',
                type: 'melee',
                description: 'Melee Weapon Attack: +3 to hit, reach 5 ft., one target. Hit: 4 (1d6 + 1) bludgeoning damage.',
                damage: '1d6 + 1',
                toHit: 3
            }
        ]
    },
    {
        id: 'wolf',
        name: 'Wolf',
        category: 'Beast',
        description: 'Um predador social que caça em matilhas.',
        cr: 0.25,
        imageUrl: '/tokens/token_wolf.png',
        hp: { current: 11, max: 11 },
        ac: 13,
        speed: 8,
        initiativeModifier: 2,
        attributes: {
            str: { value: 12, modifier: 1 },
            dex: { value: 15, modifier: 2 },
            con: { value: 12, modifier: 1 },
            int: { value: 3, modifier: -4 },
            wis: { value: 12, modifier: 1 },
            cha: { value: 6, modifier: -2 }
        },
        skills: ['Perception +3', 'Stealth +4'],
        senses: ['Passive Perception 13'],
        visionRange: 0,
        source: 'DnD5e',
        actions: [
            {
                id: 'wolf_bite',
                name: 'Bite',
                type: 'melee',
                description: 'Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 7 (2d4 + 2) piercing damage. Target must succeed on a DC 11 STR save or be knocked prone.',
                damage: '2d4 + 2',
                toHit: 4
            }
        ]
    },
    {
        id: 'owlbear',
        name: 'Owlbear',
        category: 'Monstrosity',
        description: 'Uma fusão monstruosa de urso e coruja, conhecida por sua agressividade territorial.',
        cr: 3,
        imageUrl: '/tokens/token_owlbear.png',
        hp: { current: 59, max: 59 },
        ac: 13,
        speed: 8,
        initiativeModifier: 1,
        attributes: {
            str: { value: 20, modifier: 5 },
            dex: { value: 12, modifier: 1 },
            con: { value: 17, modifier: 3 },
            int: { value: 3, modifier: -4 },
            wis: { value: 12, modifier: 1 },
            cha: { value: 7, modifier: -2 }
        },
        skills: ['Perception +3'],
        senses: ['Darkvision 60ft', 'Passive Perception 13'],
        visionRange: 18,
        source: 'DnD5e',
        actions: [
            {
                id: 'owlbear_multiattack',
                name: 'Multiattack',
                type: 'ability',
                description: 'The owlbear makes two attacks: one with its beak and one with its claws.'
            },
            {
                id: 'owlbear_beak',
                name: 'Beak',
                type: 'melee',
                description: 'Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 10 (1d10 + 5) piercing damage.',
                damage: '1d10 + 5',
                toHit: 7
            },
            {
                id: 'owlbear_claws',
                name: 'Claws',
                type: 'melee',
                description: 'Melee Weapon Attack: +7 to hit, reach 5 ft., one target. Hit: 14 (2d8 + 5) slashing damage.',
                damage: '2d8 + 5',
                toHit: 7
            }
        ]
    },
    {
        id: 'gelatinous_cube',
        name: 'Gelatinous Cube',
        category: 'Ooze',
        description: 'Um cubo de gosma transparente que varre masmorras dissolvendo matéria orgânica.',
        cr: 2,
        imageUrl: '/tokens/token_ooze.png',
        hp: { current: 84, max: 84 },
        ac: 6,
        speed: 3,
        initiativeModifier: -4,
        attributes: {
            str: { value: 14, modifier: 2 },
            dex: { value: 3, modifier: -4 },
            con: { value: 20, modifier: 5 },
            int: { value: 1, modifier: -5 },
            wis: { value: 6, modifier: -2 },
            cha: { value: 1, modifier: -5 }
        },
        skills: [],
        senses: ['Blindsight 60ft', 'Passive Perception 8'],
        visionRange: 0,
        source: 'DnD5e',
        actions: [
            {
                id: 'cube_pseudopod',
                name: 'Pseudopod',
                type: 'melee',
                description: 'Melee Weapon Attack: +4 to hit, reach 5 ft., one creature. Hit: 10 (3d6) acid damage.',
                damage: '3d6',
                toHit: 4
            },
            {
                id: 'cube_engulf',
                name: 'Engulf',
                type: 'ability',
                description: 'The cube moves up to its speed. While doing so, it can enter Large or smaller creatures spaces. Creature must make DC 12 DEX save or be engulfed (restrained, 6d6 acid damage/turn).'
            }
        ]
    },
    {
        id: 'young_red_dragon',
        name: 'Young Red Dragon',
        category: 'Dragon',
        description: 'Um dragão cromático jovem, mas imensamente perigoso e ganancioso.',
        cr: 10,
        imageUrl: '/tokens/token_dragon.png',
        hp: { current: 178, max: 178 },
        ac: 18,
        speed: 8,
        initiativeModifier: 0,
        attributes: {
            str: { value: 23, modifier: 6 },
            dex: { value: 10, modifier: 0 },
            con: { value: 21, modifier: 5 },
            int: { value: 14, modifier: 2 },
            wis: { value: 11, modifier: 0 },

            cha: { value: 19, modifier: 4 }
        },
        skills: ['Perception +8', 'Stealth +4'],
        senses: ['Blindsight 30ft', 'Darkvision 120ft', 'Passive Perception 18'],
        visionRange: 36,
        source: 'DnD5e',
        actions: [
            {
                id: 'dragon_multiattack',
                name: 'Multiattack',
                type: 'ability',
                description: 'The dragon makes three attacks: one with its bite and two with its claws.'
            },
            {
                id: 'dragon_breath',
                name: 'Fire Breath (Recharge 5-6)',
                type: 'ability',
                description: 'The dragon exhales fire in a 30-foot cone. DC 17 DEX save, 56 (16d6) fire damage on failed save, or half on success.',
                damage: '16d6'
            }
        ]
    },
    // --- Dragons ---
    {
        id: 'ancient_red_dragon',
        name: 'Dragão Vermelho Ancião',
        category: 'Dragão',
        description: 'Um dos seres mais poderosos do plano material, uma força da natureza feita de fogo e ódio.',
        cr: 24,
        hp: { current: 546, max: 546 },
        ac: 22,
        speed: 8,
        initiativeModifier: 0,
        attributes: { str: { value: 30, modifier: 10 }, dex: { value: 10, modifier: 0 }, con: { value: 29, modifier: 9 }, int: { value: 18, modifier: 4 }, wis: { value: 15, modifier: 2 }, cha: { value: 23, modifier: 6 } },
        skills: ['Percepção +16', 'Furtividade +7'],
        senses: ['Visão Cega 18m', 'Visão no Escuro 36m'],
        visionRange: 36,
        source: 'DnD5e',
        actions: [
            { id: 'ancient_red_multiattack', name: 'Ataque Múltiplo', type: 'ability', description: 'Usa Presença Aterradora, depois faz três ataques: uma mordida e duas garras.' },
            { id: 'ancient_red_breath', name: 'Sopro de Fogo', type: 'ability', description: 'Cone de 27m. CD 24 DES. 91 (26d6) dano de fogo.', damage: '26d6' }
        ]
    },
    // --- Giants ---
    {
        id: 'hill_giant',
        name: 'Gigante da Colina',
        category: 'Gigante',
        description: 'Gigantes brutais e simplórios que devoram tudo o que encontram.',
        cr: 5,
        hp: { current: 105, max: 105 },
        ac: 13,
        speed: 8,
        initiativeModifier: -1,
        attributes: { str: { value: 21, modifier: 5 }, dex: { value: 8, modifier: -1 }, con: { value: 19, modifier: 4 }, int: { value: 5, modifier: -3 }, wis: { value: 9, modifier: -1 }, cha: { value: 6, modifier: -2 } },
        skills: ['Percepção +2'],
        senses: ['Percepção Passiva 12'],
        visionRange: 0,
        source: 'DnD5e',
        actions: [
            { id: 'hill_giant_club', name: 'Grande Clava', type: 'melee', description: 'Ataque Corpo-a-corpo: +8 para acertar. Dano: 18 (3d8 + 5) contundente.', damage: '3d8+5', toHit: 8 },
            { id: 'hill_giant_rock', name: 'Arremesso de Rocha', type: 'ranged', description: 'Ataque à Distância: +8 para acertar, alcance 18/72m. Dano: 21 (3d10 + 5) contundente.', damage: '3d10+5', toHit: 8 }
        ]
    },
    {
        id: 'troll',
        name: 'Troll',
        category: 'Gigante',
        description: 'Monstro regenerativo que só teme o fogo e o ácido.',
        cr: 5,
        hp: { current: 84, max: 84 },
        ac: 15,
        speed: 6,
        initiativeModifier: 1,
        attributes: { str: { value: 18, modifier: 4 }, dex: { value: 13, modifier: 1 }, con: { value: 20, modifier: 5 }, int: { value: 7, modifier: -2 }, wis: { value: 9, modifier: -1 }, cha: { value: 7, modifier: -2 } },
        skills: ['Percepção +1'],
        senses: ['Visão no Escuro 18m'],
        visionRange: 18,
        source: 'DnD5e',
        actions: [
            { id: 'troll_multiattack', name: 'Ataque Múltiplo', type: 'ability', description: 'Três ataques: uma mordida e duas garras.' },
            { id: 'troll_claw', name: 'Garra', type: 'melee', description: 'Corpo-a-corpo: +7 para acertar. Dano: 11 (2d6 + 4) cortante.', damage: '2d6+4', toHit: 7 }
        ]
    },
    // --- Undead ---
    {
        id: 'lich',
        name: 'Lich',
        category: 'Morto-Vivo',
        description: 'Um mago morto-vivo de poder incomensurável, que escondeu sua alma em uma filactéria.',
        cr: 21,
        hp: { current: 135, max: 135 },
        ac: 17,
        speed: 6,
        initiativeModifier: 3,
        attributes: { str: { value: 11, modifier: 0 }, dex: { value: 16, modifier: 3 }, con: { value: 16, modifier: 3 }, int: { value: 20, modifier: 5 }, wis: { value: 14, modifier: 2 }, cha: { value: 16, modifier: 3 } },
        skills: ['Arcanismo +18', 'História +12'],
        senses: ['Visão Verdadeira 36m'],
        visionRange: 36,
        source: 'DnD5e',
        actions: [
            { id: 'lich_spellcasting', name: 'Conjuração', type: 'spell', description: 'Palavra de Poder Matar, Dedo da Morte, Desintegrar, etc.' },
            { id: 'lich_touch', name: 'Toque Paralisante', type: 'melee', description: 'Ataque Mágico: +12 para acertar. Dano: 10 (3d6) gélido e CD 18 CON ou paralisado.', damage: '3d6', toHit: 12 }
        ]
    },
    {
        id: 'banshee',
        name: 'Banshee',
        category: 'Morto-Vivo',
        description: 'O espírito lamentoso de uma elfa, cujo grito pode matar.',
        cr: 4,
        hp: { current: 58, max: 58 },
        ac: 12,
        speed: 0, // Hover 40ft
        initiativeModifier: 2,
        attributes: { str: { value: 1, modifier: -5 }, dex: { value: 14, modifier: 2 }, con: { value: 10, modifier: 0 }, int: { value: 12, modifier: 1 }, wis: { value: 11, modifier: 0 }, cha: { value: 17, modifier: 3 } },
        skills: [],
        senses: ['Visão no Escuro 18m'],
        visionRange: 18,
        source: 'DnD5e',
        actions: [
            { id: 'banshee_wail', name: 'Lamento', type: 'ability', description: 'Todos a 9m, CD 13 CON. Falha: 0 HP. Sucesso: 3d6 psíquico.' }
        ]
    },
    // --- Fiends ---
    {
        id: 'balor',
        name: 'Balor',
        category: 'Corruptor',
        description: 'Um general dos exércitos abissais, envolto em fogo e sombras.',
        cr: 19,
        hp: { current: 262, max: 262 },
        ac: 19,
        speed: 8, // Fly 80
        initiativeModifier: 2,
        attributes: { str: { value: 26, modifier: 8 }, dex: { value: 15, modifier: 2 }, con: { value: 22, modifier: 6 }, int: { value: 20, modifier: 5 }, wis: { value: 16, modifier: 3 }, cha: { value: 22, modifier: 6 } },
        skills: [],
        senses: ['Visão Verdadeira 36m'],
        visionRange: 36,
        source: 'DnD5e',
        actions: [
            { id: 'balor_whip', name: 'Chicote', type: 'melee', description: 'Alcance 9m. Dano: 15 (2d6 + 8) cortante + 10 (3d6) fogo. Puxa o alvo.', damage: '2d6+8', toHit: 14 },
            { id: 'balor_sword', name: 'Espada Longa', type: 'melee', description: 'Dano: 21 (3d8 + 8) cortante + 13 (3d8) elétrico.', damage: '3d8+8', toHit: 14 }
        ]
    },
    // --- Monstrosities ---
    {
        id: 'mimic',
        name: 'Mímico',
        category: 'Monstruosidade',
        description: 'Metamorfo predador que assume a forma de objetos (baús, portas).',
        cr: 2,
        hp: { current: 58, max: 58 },
        ac: 12,
        speed: 3,
        initiativeModifier: 1,
        attributes: { str: { value: 17, modifier: 3 }, dex: { value: 12, modifier: 1 }, con: { value: 15, modifier: 2 }, int: { value: 5, modifier: -3 }, wis: { value: 13, modifier: 1 }, cha: { value: 8, modifier: -1 } },
        skills: ['Furtividade +5'],
        senses: ['Visão no Escuro 18m'],
        visionRange: 18,
        source: 'DnD5e',
        actions: [
            { id: 'mimic_bite', name: 'Mordida', type: 'melee', description: 'Dano: 7 (1d8 + 3) perfurante + 4 (1d8) ácido.', damage: '1d8+3', toHit: 5 }
        ]
    },
    {
        id: 'minotaur',
        name: 'Minotauro',
        category: 'Monstruosidade',
        description: 'Monstro com cabeça de touro que habita labirintos.',
        cr: 3,
        hp: { current: 76, max: 76 },
        ac: 14,
        speed: 8,
        initiativeModifier: 0,
        attributes: { str: { value: 18, modifier: 4 }, dex: { value: 11, modifier: 0 }, con: { value: 16, modifier: 3 }, int: { value: 6, modifier: -2 }, wis: { value: 16, modifier: 3 }, cha: { value: 9, modifier: -1 } },
        skills: ['Percepção +7'],
        senses: ['Visão no Escuro 18m'],
        visionRange: 18,
        source: 'DnD5e',
        actions: [
            { id: 'minotaur_gore', name: 'Chifrada', type: 'melee', description: 'Investida. Dano: 13 (2d8 + 4) perfurante.', damage: '2d8+4', toHit: 6 },
            { id: 'minotaur_greataxe', name: 'Machado Grande', type: 'melee', description: 'Dano: 17 (2d12 + 4) cortante.', damage: '2d12+4', toHit: 6 }
        ]
    },
    // --- Humanoids ---
    {
        id: 'kobold',
        name: 'Kobold',
        category: 'Humanoid',
        description: 'Pequenos reptilianos que compensam sua fraqueza com números e armadilhas.',
        cr: 0.12,
        hp: { current: 5, max: 5 },
        ac: 12,
        speed: 6,
        initiativeModifier: 2,
        attributes: { str: { value: 7, modifier: -2 }, dex: { value: 15, modifier: 2 }, con: { value: 9, modifier: -1 }, int: { value: 8, modifier: -1 }, wis: { value: 7, modifier: -2 }, cha: { value: 8, modifier: -1 } },
        skills: [],
        senses: ['Visão no Escuro 18m'],
        visionRange: 18,
        source: 'DnD5e',
        actions: [
            { id: 'kobold_dagger', name: 'Adaga', type: 'melee', description: 'Dano: 4 (1d4 + 2) perfurante.', damage: '1d4+2', toHit: 4 }
        ]
    },
    // --- Elementals ---
    {
        id: 'fire_elemental',
        name: 'Elemental de Fogo',
        category: 'Elemental',
        description: 'Uma força viva de chamas destruidoras.',
        cr: 5,
        hp: { current: 102, max: 102 },
        ac: 13,
        speed: 10,
        initiativeModifier: 3,
        attributes: { str: { value: 10, modifier: 0 }, dex: { value: 17, modifier: 3 }, con: { value: 16, modifier: 3 }, int: { value: 6, modifier: -2 }, wis: { value: 10, modifier: 0 }, cha: { value: 7, modifier: -2 } },
        skills: [],
        senses: ['Visão no Escuro 18m'],
        visionRange: 18,
        source: 'DnD5e',
        actions: [
            { id: 'fire_touch', name: 'Toque', type: 'melee', description: 'Dano: 10 (2d6 + 3) fogo. Alvo pega fogo.', damage: '2d6+3', toHit: 6 }
        ]
    },
    // --- NPCs (Xanathar/MM Vibe) ---
    {
        id: 'spy',
        name: 'Espião (Spy)',
        category: 'Humanoide',
        description: 'Um agente encoberto treinado em subterfúgio e assassinato silencioso. Ótimo para emboscadas urbanas.',
        cr: 1,
        hp: { current: 27, max: 27 },
        ac: 12,
        speed: 9,
        initiativeModifier: 3,
        attributes: { str: { value: 10, modifier: 0 }, dex: { value: 15, modifier: 2 }, con: { value: 10, modifier: 0 }, int: { value: 12, modifier: 1 }, wis: { value: 14, modifier: 2 }, cha: { value: 16, modifier: 3 } },
        skills: ['Enganação +5', 'Furtividade +4', 'Prestidigitação +4'],
        senses: ['Percepção Passiva 12'],
        visionRange: 0,
        source: 'DnD5e',
        actions: [
            { id: 'spy_multi', name: 'Ataque Múltiplo', type: 'ability', description: 'Dois ataques de espada curta.' },
            { id: 'spy_shortsword', name: 'Espada Curta', type: 'melee', description: '+4 p/ acertar. Dano: 5 (1d6+2).', damage: '1d6+2', toHit: 4 },
            { id: 'spy_sneak', name: 'Ataque Furtivo', type: 'ability', description: 'Causa +2d6 de dano se tiver vantagem ou aliado a 1.5m.' }
        ]
    },
    {
        id: 'veteran',
        name: 'Veterano',
        category: 'Humanoide',
        description: 'Um guerreiro experiente de muitas batalhas, equipado com armadura pesada e múltiplas armas.',
        cr: 3,
        hp: { current: 58, max: 58 },
        ac: 17,
        speed: 9,
        initiativeModifier: 1,
        attributes: { str: { value: 16, modifier: 3 }, dex: { value: 13, modifier: 1 }, con: { value: 14, modifier: 2 }, int: { value: 10, modifier: 0 }, wis: { value: 11, modifier: 0 }, cha: { value: 10, modifier: 0 } },
        skills: ['Atletismo +5', 'Percepção +2'],
        senses: ['Percepção Passiva 12'],
        visionRange: 0,
        source: 'DnD5e',
        actions: [
            { id: 'vet_multi', name: 'Ataque Múltiplo', type: 'ability', description: 'Dois ataques de espada longa e um de espada curta.' },
            { id: 'vet_longsword', name: 'Espada Longa', type: 'melee', description: '+5 p/ acertar. Dano: 7 (1d8+3).', damage: '1d8+3', toHit: 5 },
            { id: 'vet_shortsword', name: 'Espada Curta', type: 'melee', description: '+5 p/ acertar. Dano: 6 (1d6+3).', damage: '1d6+3', toHit: 5 }
        ]
    },
    {
        id: 'priest',
        name: 'Sacerdote (Priest)',
        category: 'Humanoide',
        description: 'Um devoto capaz de conjurar magia divina para curar aliados ou punir hereges.',
        cr: 2,
        hp: { current: 27, max: 27 },
        ac: 13,
        speed: 9,
        initiativeModifier: 0,
        attributes: { str: { value: 10, modifier: 0 }, dex: { value: 10, modifier: 0 }, con: { value: 12, modifier: 1 }, int: { value: 13, modifier: 1 }, wis: { value: 16, modifier: 3 }, cha: { value: 13, modifier: 1 } },
        skills: ['Medicina +7', 'Religião +4'],
        senses: ['Percepção Passiva 13'],
        visionRange: 0,
        source: 'DnD5e',
        actions: [
            { id: 'priest_mace', name: 'Maça', type: 'melee', description: '+2 p/ acertar. Dano: 3 (1d6).', damage: '1d6', toHit: 2 },
            { id: 'priest_heal', name: 'Curar Ferimentos (1/dia)', type: 'spell', description: 'Cura 2d8+3 HP de um aliado tocado.' },
            { id: 'priest_bolt', name: 'Chama Sagrada', type: 'ranged', description: 'Alcance 18m. CD 13 DES ou 1d8 radiante.' }
        ]
    },
    {
        id: 'assassin',
        name: 'Assassino',
        category: 'Humanoide',
        description: 'Mestre em eliminar alvos rapidamente. Frequente em guildas de ladrões como o Xanathar.',
        cr: 8,
        hp: { current: 78, max: 78 },
        ac: 15,
        speed: 9,
        initiativeModifier: 3,
        attributes: { str: { value: 11, modifier: 0 }, dex: { value: 16, modifier: 3 }, con: { value: 14, modifier: 2 }, int: { value: 13, modifier: 1 }, wis: { value: 11, modifier: 0 }, cha: { value: 10, modifier: 0 } },
        skills: ['Furtividade +9', 'Venenos +4'],
        senses: ['Percepção Passiva 13'],
        visionRange: 0,
        source: 'DnD5e',
        actions: [
            { id: 'assassin_multi', name: 'Ataque Múltiplo', type: 'ability', description: 'Dois ataques com espada curta.' },
            { id: 'assassin_sword', name: 'Espada Curta Envenenada', type: 'melee', description: '+6 p/ acertar. Dano: 6 (1d6+3) + 24 (7d6) veneno (CD 15 CON metade).' },
            { id: 'assassin_snipe', name: 'Besta Leve', type: 'ranged', description: '+6 p/ acertar. Dano: 7 (1d8+3) + veneno.' }
        ]
    },
    {
        id: 'archmage',
        name: 'Arquimago',
        category: 'Humanoide',
        description: 'Um conjurador arcano de imenso poder, capaz de alterar a realidade e parar o tempo.',
        cr: 12,
        hp: { current: 99, max: 99 },
        ac: 12, // 15 com Armadura Arcana
        speed: 9,
        initiativeModifier: 2,
        attributes: { str: { value: 10, modifier: 0 }, dex: { value: 14, modifier: 2 }, con: { value: 12, modifier: 1 }, int: { value: 20, modifier: 5 }, wis: { value: 15, modifier: 2 }, cha: { value: 16, modifier: 3 } },
        skills: ['Arcanismo +13', 'História +13'],
        senses: ['Percepção Passiva 12'],
        visionRange: 0,
        source: 'DnD5e',
        actions: [
            { id: 'mage_dagger', name: 'Adaga', type: 'melee', description: '+6 p/ acertar. Dano 4 (1d4+2).' },
            { id: 'mage_fireball', name: 'Bola de Fogo (Nível 3+)', type: 'spell', description: 'Raio de 6m. 8d6 fogo. CD 17.' },
            { id: 'mage_cone', name: 'Cone de Frio (Nível 5)', type: 'spell', description: 'Cone de 18m. 8d8 frio. CD 17.' },
            { id: 'mage_time', name: 'Parar o Tempo', type: 'spell', description: '1d4+1 turnos seguidos.' }
        ]
    },
    {
        id: 'gladiator',
        name: 'Gladiador',
        category: 'Humanoide',
        description: 'Guerreiro de arena que luta pelo espetáculo e sangue. Mais forte e brutal que um veterano.',
        cr: 5,
        hp: { current: 112, max: 112 },
        ac: 16,
        speed: 9,
        initiativeModifier: 2,
        attributes: { str: { value: 20, modifier: 5 }, dex: { value: 15, modifier: 2 }, con: { value: 16, modifier: 3 }, int: { value: 10, modifier: 0 }, wis: { value: 12, modifier: 1 }, cha: { value: 15, modifier: 2 } },
        skills: ['Atletismo +10', 'Intimidação +5'],
        senses: ['Percepção Passiva 11'],
        visionRange: 0,
        source: 'DnD5e',
        actions: [
            { id: 'glad_multi', name: 'Ataque Múltiplo', type: 'ability', description: 'Três ataques corpo-a-corpo ou dois à distância.' },
            { id: 'glad_spear', name: 'Lança', type: 'melee', description: '+8 p/ acertar. Dano: 11 (2d6+5) perfurante.' },
            { id: 'glad_shield', name: 'Escudada', type: 'melee', description: '+8 p/ acertar. Dano: 9 (2d4+5) contundente. Se alvo for médio ou menor, cai no chão (CD 15 FOR).' }
        ]
    },
    // --- Chromatic Dragons (Young & Ancient) ---
    {
        id: 'young_black_dragon',
        name: 'Dragão Negro Jovem',
        category: 'Dragão',
        description: 'Dragão sádico que vive em pântanos. Cospe ácido.',
        cr: 7,
        hp: { current: 127, max: 127 },
        ac: 18,
        speed: 8,
        initiativeModifier: 2,
        attributes: { str: { value: 19, modifier: 4 }, dex: { value: 14, modifier: 2 }, con: { value: 17, modifier: 3 }, int: { value: 12, modifier: 1 }, wis: { value: 11, modifier: 0 }, cha: { value: 15, modifier: 2 } },
        skills: ['Furtividade +5', 'Percepção +6'],
        senses: ['Visão no Escuro (36m)'],
        visionRange: 36,
        source: 'DnD5e',
        actions: [
            { id: 'black_multi', name: 'Ataque Múltiplo', type: 'ability', description: 'Uma mordida e duas garras.' },
            { id: 'black_breath', name: 'Sopro Ácido', type: 'ability', description: 'Linha de 9m. 11d8 ácido. CD 14 DES.' }
        ]
    },
    {
        id: 'ancient_black_dragon',
        name: 'Dragão Negro Ancião',
        category: 'Dragão',
        description: 'O mais cruel dos dragões cromáticos.',
        cr: 21,
        hp: { current: 367, max: 367 },
        ac: 22,
        speed: 8,
        initiativeModifier: 2,
        attributes: { str: { value: 27, modifier: 8 }, dex: { value: 14, modifier: 2 }, con: { value: 25, modifier: 7 }, int: { value: 16, modifier: 3 }, wis: { value: 15, modifier: 2 }, cha: { value: 19, modifier: 4 } },
        skills: ['Furtividade +9', 'Percepção +16'],
        senses: ['Visão Cega 18m', 'Visão no Escuro 36m'],
        visionRange: 36,
        source: 'DnD5e',
        actions: [
            { id: 'ablack_breath', name: 'Sopro Ácido', type: 'ability', description: 'Linha de 27m. 15d8 ácido. CD 22 DES.' }
        ]
    },
    {
        id: 'young_blue_dragon',
        name: 'Dragão Azul Jovem',
        category: 'Dragão',
        description: 'Dragão do deserto que cospe raios.',
        cr: 9,
        hp: { current: 152, max: 152 },
        ac: 19,
        speed: 8, // Fly 80ft
        initiativeModifier: 0,
        attributes: { str: { value: 21, modifier: 5 }, dex: { value: 10, modifier: 0 }, con: { value: 19, modifier: 4 }, int: { value: 14, modifier: 2 }, wis: { value: 13, modifier: 1 }, cha: { value: 17, modifier: 3 } },
        skills: ['Percepção +9', 'Furtividade +4'],
        senses: ['Visão no Escuro 36m'],
        visionRange: 36,
        source: 'DnD5e',
        actions: [
            { id: 'blue_breath', name: 'Sopro Elétrico', type: 'ability', description: 'Linha de 18m. 10d10 elétrico. CD 16 DES.' }
        ]
    },
    {
        id: 'ancient_blue_dragon',
        name: 'Dragão Azul Ancião',
        category: 'Dragão',
        description: 'Senhor das tempestades e desertos.',
        cr: 23,
        hp: { current: 481, max: 481 },
        ac: 22,
        speed: 8,
        initiativeModifier: 0,
        attributes: { str: { value: 29, modifier: 9 }, dex: { value: 10, modifier: 0 }, con: { value: 27, modifier: 8 }, int: { value: 18, modifier: 4 }, wis: { value: 17, modifier: 3 }, cha: { value: 21, modifier: 5 } },
        skills: [],
        senses: ['Visão Cega 18m'],
        visionRange: 36,
        source: 'DnD5e',
        actions: [
            { id: 'ablue_breath', name: 'Sopro Elétrico', type: 'ability', description: 'Linha de 36m. 16d10 elétrico. CD 23 DES.' }
        ]
    },
    {
        id: 'young_green_dragon',
        name: 'Dragão Verde Jovem',
        category: 'Dragão',
        description: 'Dragão manipulador de florestas. Sopro venenoso.',
        cr: 8,
        hp: { current: 136, max: 136 },
        ac: 18,
        speed: 8,
        initiativeModifier: 1,
        attributes: { str: { value: 19, modifier: 4 }, dex: { value: 12, modifier: 1 }, con: { value: 17, modifier: 3 }, int: { value: 16, modifier: 3 }, wis: { value: 13, modifier: 1 }, cha: { value: 15, modifier: 2 } },
        skills: ['Enganação +5', 'Percepção +7'],
        senses: ['Visão no Escuro 36m'],
        visionRange: 36,
        source: 'DnD5e',
        actions: [
            { id: 'green_breath', name: 'Sopro Venenoso', type: 'ability', description: 'Cone de 9m. 12d6 veneno. CD 14 CON.' }
        ]
    },
    {
        id: 'young_white_dragon',
        name: 'Dragão Branco Jovem',
        category: 'Dragão',
        description: 'O menor e mais bestial dos dragões. Sopro frio.',
        cr: 6,
        hp: { current: 133, max: 133 },
        ac: 17,
        speed: 8,
        initiativeModifier: 0,
        attributes: { str: { value: 18, modifier: 4 }, dex: { value: 10, modifier: 0 }, con: { value: 18, modifier: 4 }, int: { value: 6, modifier: -2 }, wis: { value: 11, modifier: 0 }, cha: { value: 12, modifier: 1 } },
        skills: ['Percepção +6', 'Furtividade +3'],
        senses: ['Visão no Escuro 36m'],
        visionRange: 36,
        source: 'DnD5e',
        actions: [
            { id: 'white_breath', name: 'Sopro Congelante', type: 'ability', description: 'Cone de 9m. 10d8 frio. CD 15 CON.' }
        ]
    },
    // --- Legendary Monsters ---
    {
        id: 'tarrasque',
        name: 'Tarrasque',
        category: 'Monstruosidade',
        description: 'O fim de tudo. A encarnação da destruição.',
        cr: 30,
        hp: { current: 676, max: 676 },
        ac: 25,
        speed: 8,
        initiativeModifier: 0,
        attributes: { str: { value: 30, modifier: 10 }, dex: { value: 11, modifier: 0 }, con: { value: 30, modifier: 10 }, int: { value: 3, modifier: -4 }, wis: { value: 11, modifier: 0 }, cha: { value: 11, modifier: 0 } },
        skills: [],
        senses: ['Visão Cega 36m'],
        visionRange: 36,
        source: 'DnD5e',
        actions: [
            { id: 'tarrasque_multi', name: 'Ataque Múltiplo', type: 'ability', description: 'Mordida, Garras (x2), Chifres, Cauda. 5 ataques.' },
            { id: 'tarrasque_swallow', name: 'Engolir', type: 'ability', description: 'Se morder criatura agarrada, engole. 16d6 ácido/turno.' }
        ]
    },
    {
        id: 'pit_fiend',
        name: 'Diabo das Profundezas (Pit Fiend)',
        category: 'Corruptor',
        description: 'Lorde dos Nove Infernos, general dos diabos.',
        cr: 20,
        hp: { current: 300, max: 300 },
        ac: 19,
        speed: 6,
        initiativeModifier: 2,
        attributes: { str: { value: 26, modifier: 8 }, dex: { value: 14, modifier: 2 }, con: { value: 24, modifier: 7 }, int: { value: 22, modifier: 6 }, wis: { value: 18, modifier: 4 }, cha: { value: 24, modifier: 7 } },
        skills: [],
        senses: ['Visão Verdadeira 36m'],
        visionRange: 36,
        source: 'DnD5e',
        actions: [
            { id: 'pit_multi', name: 'Ataque Múltiplo', type: 'ability', description: 'Quatro ataques: mordida, garra, maça, cauda.' },
            { id: 'pit_mace', name: 'Maça', type: 'melee', description: 'Dano: 2d6+8 + 6d6 fogo.' }
        ]
    },
    {
        id: 'planetar',
        name: 'Planetar',
        category: 'Celestial',
        description: 'A arma da justiça dos deuses.',
        cr: 16,
        hp: { current: 200, max: 200 },
        ac: 19,
        speed: 8,
        initiativeModifier: 5,
        attributes: { str: { value: 24, modifier: 7 }, dex: { value: 20, modifier: 5 }, con: { value: 24, modifier: 7 }, int: { value: 19, modifier: 4 }, wis: { value: 22, modifier: 6 }, cha: { value: 25, modifier: 7 } },
        skills: ['Percepção +11'],
        senses: ['Visão Verdadeira 36m'],
        visionRange: 36,
        source: 'DnD5e',
        actions: [
            { id: 'planetar_gs', name: 'Espada Grande', type: 'melee', description: '+12 acerto. 4d6+7 cortante + 5d8 radiante.' }
        ]
    },
    // --- Underdark ---
    {
        id: 'mind_flayer',
        name: 'Devorador de Mentes',
        category: 'Aberração',
        description: 'Terror psíquico que escraviza mentes e devora cérebros.',
        cr: 7,
        hp: { current: 71, max: 71 },
        ac: 15,
        speed: 6,
        initiativeModifier: 1,
        attributes: { str: { value: 11, modifier: 0 }, dex: { value: 12, modifier: 1 }, con: { value: 12, modifier: 1 }, int: { value: 19, modifier: 4 }, wis: { value: 17, modifier: 3 }, cha: { value: 17, modifier: 3 } },
        skills: ['Arcanismo +7', 'Furtividade +4'],
        senses: ['Visão no Escuro 36m'],
        visionRange: 36,
        source: 'DnD5e',
        actions: [
            { id: 'mf_blast', name: 'Rajada Mental', type: 'ability', description: 'Cone 18m. CD 15 INT. 4d8+4 psíquico e atordoado.' },
            { id: 'mf_extract', name: 'Extrair Cérebro', type: 'melee', description: 'Dano: 10d10 perfurante. Se 0 HP, mata instantaneamente.' }
        ]
    },
    {
        id: 'drow_mage',
        name: 'Drow Mago',
        category: 'Humanoide',
        description: 'Elfo negro feiticeiro das profundezas.',
        cr: 7,
        hp: { current: 45, max: 45 },
        ac: 12, // 15 com Armadura Arcana
        speed: 6,
        initiativeModifier: 2,
        attributes: { str: { value: 9, modifier: -1 }, dex: { value: 14, modifier: 2 }, con: { value: 10, modifier: 0 }, int: { value: 17, modifier: 3 }, wis: { value: 13, modifier: 1 }, cha: { value: 12, modifier: 1 } },
        skills: ['Furtividade +5', 'Arcanismo +6'],
        senses: ['Visão no Escuro Superior 36m'],
        visionRange: 36,
        source: 'DnD5e',
        actions: [
            { id: 'drow_staff', name: 'Cajado', type: 'melee', description: 'Dano 1d6+2 + 1d6 veneno.' },
            { id: 'drow_summon', name: 'Invocar Demônio', type: 'ability', description: 'Chance de invocar um demônio sombra.' }
        ]
    },
    // --- Misc ---
    {
        id: 't_rex',
        name: 'T-Rex',
        category: 'Besta',
        description: 'O rei dos dinossauros.',
        cr: 8,
        hp: { current: 136, max: 136 },
        ac: 13,
        speed: 10,
        initiativeModifier: 0,
        attributes: { str: { value: 25, modifier: 7 }, dex: { value: 10, modifier: 0 }, con: { value: 19, modifier: 4 }, int: { value: 2, modifier: -4 }, wis: { value: 12, modifier: 1 }, cha: { value: 9, modifier: -1 } },
        skills: ['Percepção +4'],
        senses: ['Percepção Passiva 14'],
        visionRange: 0,
        source: 'DnD5e',
        actions: [
            { id: 'trex_bite', name: 'Mordida', type: 'melee', description: '+10 acerto. 4d12+7 perfurante. Agarra o alvo.' },
            { id: 'trex_tail', name: 'Cauda', type: 'melee', description: '+10 acerto. 3d8+7 contundente.' }
        ]
    },
    // --- Standard NPCs (Monster Manual Appendix) ---
    {
        id: 'commoner',
        name: 'Plebeu (Commoner)',
        category: 'Humanoide',
        description: 'Camponeses, servos, aldeões. A base da sociedade.',
        cr: 0,
        hp: { current: 4, max: 4 },
        ac: 10,
        speed: 6,
        initiativeModifier: 0,
        attributes: { str: { value: 10, modifier: 0 }, dex: { value: 10, modifier: 0 }, con: { value: 10, modifier: 0 }, int: { value: 10, modifier: 0 }, wis: { value: 10, modifier: 0 }, cha: { value: 10, modifier: 0 } },
        skills: [],
        senses: ['Percepção Passiva 10'],
        visionRange: 0,
        source: 'DnD5e',
        actions: [
            { id: 'commoner_club', name: 'Porrete', type: 'melee', description: '+2 acerto. 1d4 concussão.', damage: '1d4', toHit: 2 }
        ]
    },
    {
        id: 'guard',
        name: 'Guarda',
        category: 'Humanoide',
        description: 'Soldados rasos que protegem cidades e portões.',
        cr: 0.12,
        hp: { current: 11, max: 11 },
        ac: 16,
        speed: 6,
        initiativeModifier: 1,
        attributes: { str: { value: 13, modifier: 1 }, dex: { value: 12, modifier: 1 }, con: { value: 12, modifier: 1 }, int: { value: 10, modifier: 0 }, wis: { value: 11, modifier: 0 }, cha: { value: 10, modifier: 0 } },
        skills: ['Percepção +2'],
        senses: ['Percepção Passiva 12'],
        visionRange: 0,
        source: 'DnD5e',
        actions: [
            { id: 'guard_spear', name: 'Lança', type: 'melee', description: '+3 acerto. 1d6+1 perfurante.', damage: '1d6+1', toHit: 3 }
        ]
    },
    {
        id: 'cultist',
        name: 'Cultista',
        category: 'Humanoide',
        description: 'Seguidores fanáticos de poderes sombrios.',
        cr: 0.12,
        hp: { current: 9, max: 9 },
        ac: 12,
        speed: 6,
        initiativeModifier: 1,
        attributes: { str: { value: 11, modifier: 0 }, dex: { value: 12, modifier: 1 }, con: { value: 10, modifier: 0 }, int: { value: 10, modifier: 0 }, wis: { value: 11, modifier: 0 }, cha: { value: 10, modifier: 0 } },
        skills: ['Enganação +2', 'Religião +2'],
        senses: ['Percepção Passiva 10'],
        visionRange: 0,
        source: 'DnD5e',
        actions: [
            { id: 'cultist_scimitar', name: 'Cimitarra', type: 'melee', description: '+3 acerto. 1d6+1 cortante.', damage: '1d6+1', toHit: 3 }
        ]
    },
    {
        id: 'bandit',
        name: 'Bandido',
        category: 'Humanoide',
        description: 'Criminosos comuns que assaltam viajantes.',
        cr: 0.12,
        hp: { current: 11, max: 11 },
        ac: 12,
        speed: 6,
        initiativeModifier: 1,
        attributes: { str: { value: 11, modifier: 0 }, dex: { value: 12, modifier: 1 }, con: { value: 12, modifier: 1 }, int: { value: 10, modifier: 0 }, wis: { value: 10, modifier: 0 }, cha: { value: 10, modifier: 0 } },
        skills: [],
        senses: ['Percepção Passiva 10'],
        visionRange: 0,
        source: 'DnD5e',
        actions: [
            { id: 'bandit_scimitar', name: 'Cimitarra', type: 'melee', description: '+3 acerto. 1d6+1 cortante.', damage: '1d6+1', toHit: 3 },
            { id: 'bandit_xbow', name: 'Besta Leve', type: 'ranged', description: '+3 acerto. 1d8+1 perfurante.', damage: '1d8+1', toHit: 3 }
        ]
    },
    {
        id: 'thug',
        name: 'Capanga (Thug)',
        category: 'Humanoide',
        description: 'Criminosos brutais que usam a força para intimidar.',
        cr: 0.5,
        hp: { current: 32, max: 32 },
        ac: 11,
        speed: 6,
        initiativeModifier: 0,
        attributes: { str: { value: 15, modifier: 2 }, dex: { value: 11, modifier: 0 }, con: { value: 14, modifier: 2 }, int: { value: 10, modifier: 0 }, wis: { value: 10, modifier: 0 }, cha: { value: 11, modifier: 0 } },
        skills: ['Intimidação +2'],
        senses: ['Percepção Passiva 10'],
        visionRange: 0,
        source: 'DnD5e',
        actions: [
            { id: 'thug_multi', name: 'Ataque Múltiplo', type: 'ability', description: 'Dois ataques corpo-a-corpo.' },
            { id: 'thug_mace', name: 'Maça', type: 'melee', description: '+4 acerto. 1d6+2 concussão.', damage: '1d6+2', toHit: 4 }
        ]
    },
    {
        id: 'acolyte',
        name: 'Acólito',
        category: 'Humanoide',
        description: 'Aprendizes de sacerdotes que realizam ritos menores.',
        cr: 0.25,
        hp: { current: 9, max: 9 },
        ac: 10,
        speed: 6,
        initiativeModifier: 0,
        attributes: { str: { value: 10, modifier: 0 }, dex: { value: 10, modifier: 0 }, con: { value: 10, modifier: 0 }, int: { value: 10, modifier: 0 }, wis: { value: 14, modifier: 2 }, cha: { value: 11, modifier: 0 } },
        skills: ['Medicina +4', 'Religião +2'],
        senses: ['Percepção Passiva 12'],
        visionRange: 0,
        source: 'DnD5e',
        actions: [
            { id: 'acolyte_club', name: 'Porrete', type: 'melee', description: '+2 acerto. 1d4 concussão.', damage: '1d4', toHit: 2 },
            { id: 'acolyte_spells', name: 'Magias', type: 'spell', description: 'Chama Sagrada (CD 12), Curar Ferimentos (1 slot).' }
        ]
    },
    {
        id: 'mage',
        name: 'Mago (Mage)',
        category: 'Humanoide',
        description: 'Conjurador arcano treinado, capaz de lançar bolas de fogo e voar.',
        cr: 6,
        hp: { current: 40, max: 40 },
        ac: 12, // 15 Mage Armor
        speed: 6,
        initiativeModifier: 2,
        attributes: { str: { value: 9, modifier: -1 }, dex: { value: 14, modifier: 2 }, con: { value: 11, modifier: 0 }, int: { value: 17, modifier: 3 }, wis: { value: 12, modifier: 1 }, cha: { value: 11, modifier: 0 } },
        skills: ['Arcanismo +6', 'História +6'],
        senses: ['Percepção Passiva 11'],
        visionRange: 0,
        source: 'DnD5e',
        actions: [
            { id: 'mage_dagger', name: 'Adaga', type: 'melee', description: '+5 acerto. 1d4+2 perfurante.', damage: '1d4+2', toHit: 5 },
            { id: 'mage_spells', name: 'Conjuração (Nv 9)', type: 'spell', description: 'Bola de Fogo, Voo, Invisibilidade, Mísseis Mágicos.' }
        ]
    },
    {
        id: 'knight',
        name: 'Cavaleiro (Knight)',
        category: 'Humanoide',
        description: 'Guerreiro nobre montado, protegido por armadura de placas.',
        cr: 3,
        hp: { current: 52, max: 52 },
        ac: 18,
        speed: 6,
        initiativeModifier: 0,
        attributes: { str: { value: 16, modifier: 3 }, dex: { value: 11, modifier: 0 }, con: { value: 14, modifier: 2 }, int: { value: 11, modifier: 0 }, wis: { value: 11, modifier: 0 }, cha: { value: 15, modifier: 2 } },
        skills: [],
        senses: ['Percepção Passiva 10'],
        visionRange: 0,
        source: 'DnD5e',
        actions: [
            { id: 'knight_multi', name: 'Ataque Múltiplo', type: 'ability', description: 'Dois ataques de montante.' },
            { id: 'knight_gs', name: 'Montante', type: 'melee', description: '+5 acerto. 2d6+3 cortante.', damage: '2d6+3', toHit: 5 },
            { id: 'knight_leadership', name: 'Liderança', type: 'ability', description: 'Aliados a 9m ganham 1d4 nas jogadas de ataque/salvaguarda por 1 min.' }
        ]
    },
    {
        id: 'berserker',
        name: 'Berserker',
        category: 'Humanoide',
        description: 'Guerreiro selvagem que luta com fúria imprudente.',
        cr: 2,
        hp: { current: 67, max: 67 },
        ac: 13,
        speed: 6,
        initiativeModifier: 1,
        attributes: { str: { value: 16, modifier: 3 }, dex: { value: 12, modifier: 1 }, con: { value: 17, modifier: 3 }, int: { value: 9, modifier: -1 }, wis: { value: 11, modifier: 0 }, cha: { value: 9, modifier: -1 } },
        skills: [],
        senses: ['Percepção Passiva 10'],
        visionRange: 0,
        source: 'DnD5e',
        actions: [
            { id: 'berserker_axe', name: 'Machado Grande', type: 'melee', description: '+5 acerto. 1d12+3 cortante.', damage: '1d12+3', toHit: 5 },
            { id: 'berserker_reckless', name: 'Ataque Imprudente', type: 'ability', description: 'Vantagem nos ataques, mas inimigos têm vantagem contra ele.' }
        ]
    },
    {
        id: 'druid',
        name: 'Druida',
        category: 'Humanoide',
        description: 'Protetor da natureza capaz de usar magia primal.',
        cr: 2,
        hp: { current: 27, max: 27 },
        ac: 11, // 16 com Barkskin
        speed: 6,
        initiativeModifier: 1,
        attributes: { str: { value: 10, modifier: 0 }, dex: { value: 12, modifier: 1 }, con: { value: 13, modifier: 1 }, int: { value: 12, modifier: 1 }, wis: { value: 15, modifier: 2 }, cha: { value: 11, modifier: 0 } },
        skills: ['Natureza +4', 'Percepção +4', 'Medicina +4'],
        senses: ['Percepção Passiva 14'],
        visionRange: 0,
        source: 'DnD5e',
        actions: [
            { id: 'druid_staff', name: 'Bordão', type: 'melee', description: '+2 acerto. 1d6 (ou 1d8) concussão.', damage: '1d6', toHit: 2 },
            { id: 'druid_spells', name: 'Magia', type: 'spell', description: 'Pele de Árvore, Onda Trovejante, Enredar, Criar Chamas.' }
        ]
    },
    {
        id: 'beholder',
        name: 'Beholder (Observador)',
        category: 'Aberração',
        description: 'Uma aberração tirânica e paranoica flutuante com um olho central enorme que projeta um cone de antimagia e dez tentáculos oculares que disparam raios mágicos letais.',
        cr: 13,
        size: 'Large',
        imageUrl: '/tokens/token_beholder.png',
        hp: { current: 180, max: 180 },
        ac: 18,
        speed: 4, // 6m voo (flutuar)
        initiativeModifier: 2,
        attributes: {
            str: { value: 10, modifier: 0 },
            dex: { value: 14, modifier: 2 },
            con: { value: 18, modifier: 4 },
            int: { value: 17, modifier: 3 },
            wis: { value: 15, modifier: 2 },
            cha: { value: 17, modifier: 3 }
        },
        skills: ['Percepção +12'],
        senses: ['Visão no Escuro 36m', 'Percepção Passiva 22'],
        visionRange: 36,
        conditionImmunities: ['Caído'],
        source: 'DnD5e',
        system: 'dnd5e',
        actions: [
            {
                id: 'beholder_antimagic',
                name: 'Cone de Antimagia',
                type: 'ability',
                description: 'O olho central emite um cone de 45 metros de antimagia suprimindo todas as magias na área.'
            },
            {
                id: 'beholder_bite',
                name: 'Mordida Voraz',
                type: 'melee',
                description: 'Ataque corpo a corpo: +5 para acertar. Dano: 14 (4d6) perfurante.',
                damage: '4d6',
                toHit: 5
            },
            {
                id: 'beholder_eye_rays',
                name: 'Raios Oculares (3 Alvos Aleatórios)',
                type: 'ranged',
                description: 'Dispara 3 raios oculares a até 36m (Charme CD 16, Paralisia CD 16, Medo CD 16, Desintegração 10d8 força CD 16, Raio da Morte 10d10 necrótico CD 16).'
            }
        ]
    },
    {
        id: 'capitao_carniceiro',
        name: 'Capitão Carniceiro',
        category: 'Humanoide',
        description: 'Líder brutal dos Carniceiros da Fenda. Empunha um machado de batalha pesado e canaliza fúria ígnea fanática em seus ataques.',
        cr: 2,
        size: 'Medium',
        imageUrl: '/tokens/token_enemy_capitao_carniceiro_1793324616093.jpg',
        hp: { current: 35, max: 35 },
        ac: 14,
        speed: 9,
        initiativeModifier: 1,
        attributes: {
            str: { value: 16, modifier: 3 },
            dex: { value: 12, modifier: 1 },
            con: { value: 14, modifier: 2 },
            int: { value: 9, modifier: -1 },
            wis: { value: 11, modifier: 0 },
            cha: { value: 10, modifier: 0 }
        },
        skills: ['Atletismo +5', 'Intimidação +2'],
        senses: ['Percepção Passiva 10'],
        visionRange: 18,
        source: 'DnD5e',
        system: 'dnd5e',
        actions: [
            {
                id: 'capitao_multiattack',
                name: 'Ataque Múltiplo',
                type: 'ability',
                description: 'O Capitão Carniceiro faz dois ataques com o Machado de Batalha.'
            },
            {
                id: 'capitao_battleaxe',
                name: 'Machado de Batalha',
                type: 'melee',
                description: 'Ataque com arma corpo a corpo: +5 para acertar, alcance 1,5 m, um alvo. Dano: 1d8 + 3 cortante (ou 1d10 + 3 com as duas mãos).',
                damage: '1d8 + 3',
                toHit: 5,
                range: '1,5 m'
            },
            {
                id: 'capitao_grito_furia',
                name: 'Grito de Fúria (Recarrega 5-6)',
                type: 'ability',
                description: 'Com uma ação bônus, o Capitão solta um brado de guerra e seus ataques causam +1d4 de dano de fogo até o fim do seu próximo turno.'
            }
        ]
    },
    {
        id: 'sabujo_corrompido',
        name: 'Sabujo Corrompido',
        category: 'Monstruosidade',
        description: 'Fera retorcida com espinhos ósseos protuberantes ao longo do dorso e mandíbulas que estraçalham carne e derrubam presas.',
        cr: 0.5,
        size: 'Medium',
        imageUrl: '/tokens/token_enemy_sabujo_corrompido_1793324650921.jpg',
        hp: { current: 18, max: 18 },
        ac: 13,
        speed: 12,
        initiativeModifier: 2,
        attributes: {
            str: { value: 13, modifier: 1 },
            dex: { value: 15, modifier: 2 },
            con: { value: 12, modifier: 1 },
            int: { value: 3, modifier: -4 },
            wis: { value: 12, modifier: 1 },
            cha: { value: 6, modifier: -2 }
        },
        skills: ['Percepção +3'],
        senses: ['Faro e Audição Aguçados (Vantagem)', 'Visão no Escuro 18m', 'Percepção Passiva 13'],
        visionRange: 18,
        source: 'DnD5e',
        system: 'dnd5e',
        actions: [
            {
                id: 'sabujo_faro_audicao',
                name: 'Faro e Audição Aguçados',
                type: 'ability',
                description: 'Vantagem em testes de Percepção baseados em cheiro ou som.'
            },
            {
                id: 'sabujo_bite',
                name: 'Mordida de Espinhos',
                type: 'melee',
                description: 'Ataque com arma corpo a corpo: +4 para acertar, alcance 1,5 m, um alvo. Dano: 1d6 + 2 perfurante. Se o alvo for uma criatura, deve passar em Salvaguarda de FOR CD 11 ou cair Caído.',
                damage: '1d6 + 2',
                toHit: 4,
                range: '1,5 m'
            }
        ]
    },
    {
        id: 'arqueiro_das_sombras',
        name: 'Arqueiro das Sombras',
        category: 'Humanoide',
        description: 'Atirador de emboscada ágil que utiliza as colunas e relevos para abater viajantes com disparos cirúrgicos.',
        cr: 0.5,
        size: 'Medium',
        imageUrl: '/tokens/token_enemy_arqueiro_sombras_1793324700133.jpg',
        hp: { current: 16, max: 16 },
        ac: 12,
        speed: 9,
        initiativeModifier: 2,
        attributes: {
            str: { value: 10, modifier: 0 },
            dex: { value: 15, modifier: 2 },
            con: { value: 12, modifier: 1 },
            int: { value: 10, modifier: 0 },
            wis: { value: 13, modifier: 1 },
            cha: { value: 9, modifier: -1 }
        },
        skills: ['Furtividade +4', 'Percepção +3'],
        senses: ['Percepção Passiva 13'],
        visionRange: 18,
        source: 'DnD5e',
        system: 'dnd5e',
        actions: [
            {
                id: 'arqueiro_shortbow',
                name: 'Arco Curto',
                type: 'ranged',
                description: 'Ataque com arma à distância: +4 para acertar, alcance 24/96 m, um alvo. Dano: 1d6 + 2 perfurante.',
                damage: '1d6 + 2',
                toHit: 4,
                range: '24/96 m'
            },
            {
                id: 'arqueiro_dagger',
                name: 'Adaga',
                type: 'melee',
                description: 'Ataque com arma corpo a corpo: +4 para acertar, alcance 1,5 m, um alvo. Dano: 1d4 + 2 perfurante.',
                damage: '1d4 + 2',
                toHit: 4,
                range: '1,5 m'
            }
        ]
    },
    {
        id: 'criatura_de_cinzas',
        name: 'A Criatura de Cinzas',
        category: 'Elemental',
        description: 'Entidade ígnea elemental forjada nas fendas vulcânicas do Hipogeu para o Duelo do Golias. Seu corpo arde com brasas incandescentes.',
        cr: 1,
        size: 'Medium',
        imageUrl: '/tokens/token_enemy_criatura_cinzas_1793324750467.jpg',
        hp: { current: 28, max: 28 },
        ac: 13,
        speed: 9,
        initiativeModifier: 1,
        attributes: {
            str: { value: 16, modifier: 3 },
            dex: { value: 12, modifier: 1 },
            con: { value: 15, modifier: 2 },
            int: { value: 6, modifier: -2 },
            wis: { value: 10, modifier: 0 },
            cha: { value: 7, modifier: -2 }
        },
        skills: ['Atletismo +5'],
        senses: ['Visão no Escuro 18m', 'Percepção Passiva 10'],
        damageResistances: ['Fogo'],
        damageVulnerabilities: ['Frio'],
        visionRange: 18,
        source: 'DnD5e',
        system: 'dnd5e',
        actions: [
            {
                id: 'cinzas_pancada',
                name: 'Pancada Incandescente',
                type: 'melee',
                description: 'Ataque corpo a corpo: +5 para acertar, alcance 1,5 m, um alvo. Dano: 1d8 + 3 de concussão + 1d4 de fogo.',
                damage: '1d8 + 3 + 1d4',
                toHit: 5,
                range: '1,5 m'
            }
        ]
    },
    {
        id: 'espectro_do_massacre',
        name: 'O Espectro do Massacre',
        category: 'Morto-Vivo',
        description: 'Espírito guerreiro retorcido do massacre draconato (Duelo de Drakthar). Carrega a essência da culpa e o frio do túmulo.',
        cr: 1,
        size: 'Medium',
        imageUrl: '/tokens/token_enemy_espectro_massacre_1793324797108.jpg',
        hp: { current: 26, max: 26 },
        ac: 13,
        speed: 9,
        initiativeModifier: 3,
        attributes: {
            str: { value: 6, modifier: -2 },
            dex: { value: 16, modifier: 3 },
            con: { value: 13, modifier: 1 },
            int: { value: 10, modifier: 0 },
            wis: { value: 12, modifier: 1 },
            cha: { value: 14, modifier: 2 }
        },
        skills: ['Furtividade +5', 'Percepção +3'],
        senses: ['Visão no Escuro 18m', 'Percepção Passiva 13'],
        damageResistances: ['Necrótico', 'Concussão, perfurante e cortante de armas não mágicas'],
        damageVulnerabilities: ['Radiante'],
        visionRange: 18,
        source: 'DnD5e',
        system: 'dnd5e',
        actions: [
            {
                id: 'espectro_lamina_sombras',
                name: 'Lâmina de Sombras',
                type: 'melee',
                description: 'Ataque corpo a corpo com energia espectral: +5 para acertar, alcance 1,5 m, um alvo. Dano: 1d8 + 3 necrótico.',
                damage: '1d8 + 3',
                toHit: 5,
                range: '1,5 m'
            }
        ]
    },
    {
        id: 'duplo_de_vidro',
        name: 'O Duplo de Vidro',
        category: 'Constructo',
        description: 'Cópia reflexiva ilusória no Salão dos Espelhos (Duelo de Le Frey). Emite disparos perfurantes de vidro negro, mas estilhaça sob impacto contundente ou força.',
        cr: 1,
        size: 'Medium',
        imageUrl: '/tokens/token_enemy_duplo_vidro_1793324850140.jpg',
        hp: { current: 22, max: 22 },
        ac: 12,
        speed: 9,
        initiativeModifier: 2,
        attributes: {
            str: { value: 10, modifier: 0 },
            dex: { value: 14, modifier: 2 },
            con: { value: 12, modifier: 1 },
            int: { value: 12, modifier: 1 },
            wis: { value: 10, modifier: 0 },
            cha: { value: 16, modifier: 3 }
        },
        skills: ['Enganação +5', 'Percepção +2'],
        senses: ['Visão no Escuro 18m', 'Percepção Passiva 12'],
        damageVulnerabilities: ['Força', 'Concussão'],
        visionRange: 18,
        source: 'DnD5e',
        system: 'dnd5e',
        actions: [
            {
                id: 'duplo_raio_vidro',
                name: 'Raio de Vidro Negro',
                type: 'ranged',
                description: 'Ataque mágico à distância: +5 para acertar, alcance 18 m, um alvo. Dano: 1d10 + 2 perfurante.',
                damage: '1d10 + 2',
                toHit: 5,
                range: '18 m'
            }
        ]
    },
    {
        id: 'automato_do_vento',
        name: 'O Autômato do Vento',
        category: 'Constructo',
        description: 'Guardião mecânico veloz da câmara de engrenagens (Duelo de DoomFist). Forjado em placas de latão com lâminas afiadas giratórias.',
        cr: 1,
        size: 'Medium',
        imageUrl: '/tokens/token_enemy_automato_vento.svg',
        hp: { current: 24, max: 24 },
        ac: 14,
        speed: 9,
        initiativeModifier: 3,
        attributes: {
            str: { value: 15, modifier: 2 },
            dex: { value: 16, modifier: 3 },
            con: { value: 13, modifier: 1 },
            int: { value: 4, modifier: -3 },
            wis: { value: 10, modifier: 0 },
            cha: { value: 1, modifier: -5 }
        },
        skills: ['Acrobacia +5', 'Percepção +2'],
        senses: ['Visão no Escuro 18m', 'Percepção Passiva 12'],
        damageImmunities: ['Veneno'],
        conditionImmunities: ['Envenenado'],
        visionRange: 18,
        source: 'DnD5e',
        system: 'dnd5e',
        actions: [
            {
                id: 'automato_laminas_duplas',
                name: 'Lâminas Duplas',
                type: 'melee',
                description: 'O autômato faz dois ataques velozes com suas lâminas cortantes de latão: +5 para acertar, alcance 1,5 m, um alvo. Dano: 1d6 + 2 cortante cada.',
                damage: '1d6 + 2',
                toHit: 5,
                range: '1,5 m'
            }
        ]
    }
];
