
export interface ClassFeature {
    level: number;
    name: string;
    description: string;
    type?: 'passive' | 'action' | 'bonus_action' | 'reaction';
}

export interface ClassData {
    id: string;
    name: string;
    description: string; // Brief Flavor
    fullDescription: string; // Long Flavor
    hitDie: string; // d6, d8, d10, d12
    primaryAbility: string;

    // Proficiencies
    savingThrows: string[];
    armorProficiency: string[];
    weaponProficiency: string[];
    toolProficiencies?: string[];
    toolChoices?: {
        count: number;
        options: string[];
    };
    skillChoices: {
        count: number;
        options: string[];
    };

    // Equipment
    startingEquipment?: string[]; // List of default items
    equipmentChoices?: Array<{
        label: string;
        options: Array<{
            label: string;
            items: string[];
        }>;
    }>;

    features: ClassFeature[];

    spellcastingConfig?: {
        ability: string;
        cantripsKnown: number;
        spellsKnown: number;
    };

    resources?: {
        id: string;
        name: string;
        max: number;
        current: number;
        rechargesOn: 'short' | 'long';
    }[];
    subclasses?: Subclass[];
}

export interface Subclass {
    id: string;
    name: string;
    description: string;
    features: ClassFeature[];
    startingEquipment?: string[];
}

export const CLASSES: ClassData[] = [
    {
        id: 'barbarian',
        name: 'Bárbaro',
        description: "Um guerreiro feroz de origem primitiva que pode entrar em fúria durante o combate.",
        fullDescription: "Para alguns, sua fúria brota da comunhão com ferozes espíritos animais. Outros extraem de um reservatório turvo de raiva...",
        hitDie: 'd12',
        primaryAbility: 'Força',
        savingThrows: ['str', 'con'],
        armorProficiency: ['Leve', 'Média', 'Escudos'],
        weaponProficiency: ['Simples', 'Marciais'],
        toolProficiencies: [],
        skillChoices: {
            count: 2,
            options: ['Adestrar Animais', 'Atletismo', 'Intimidação', 'Natureza', 'Percepção', 'Sobrevivência']
        },
        startingEquipment: [
            'Machado Grande', 'Machadinha (x2)', 'Azagaia (x4)', 'Pacote de Explorador'
        ],
        features: [
            { level: 1, name: "Fúria", description: "Em batalha, você luta com uma ferocidade primitiva. Ação bônus para entrar em fúria. Vantagem em Força, +2 dano raiva, resistência a concussão/cortante/perfurante." },
            { level: 1, name: "Defesa Sem Armadura", description: "CA = 10 + Des + Con (se sem armadura)." },
            { level: 2, name: "Ataque Descuidado", description: "Vantagem no ataque, mas inimigos têm vantagem contra você." },
            { level: 2, name: "Sentido de Perigo", description: "Vantagem em Dex Saves contra efeitos visíveis." },
            { level: 3, name: "Caminho Primitivo", description: "Escolha um Caminho Primitivo (Berserker, Totem, etc)." },
            { level: 5, name: "Ataque Extra", description: "Dois ataques por ação." },
            { level: 5, name: "Movimento Rápido", description: "+3m de deslocamento." }
        ],
        resources: [
            { id: 'furia', name: 'Usos de Fúria', max: 2, current: 2, rechargesOn: 'long' }
        ]
    },
    {
        id: 'bard',
        name: 'Bardo',
        description: "Um mestre da canção, discurso e magia que contém o poder de inspirar aliados e manipular mentes.",
        fullDescription: "Bardo tece magia através de palavras e música para inspirar aliados...",
        hitDie: 'd8',
        primaryAbility: 'Carisma',
        savingThrows: ['dex', 'cha'],
        armorProficiency: ['Leve'],
        weaponProficiency: ['Simples', 'Bestas de Mão', 'Espadas Longas', 'Rapiers', 'Espadas Curtas'],
        toolChoices: {
            count: 3,
            options: ['Instrumentos Musicais (Alaúde)', 'Instrumentos Musicais (Flauta)', 'Instrumentos Musicais (Lira)', 'Instrumentos Musicais (Tambor)']
        },
        skillChoices: {
            count: 3,
            options: ['Acrobacia', 'Adestrar Animais', 'Arcanismo', 'Atletismo', 'Atuação', 'Enganação', 'Furtividade', 'História', 'Intimidação', 'Intuição', 'Investigação', 'Medicina', 'Natureza', 'Percepção', 'Persuasão', 'Prestidigitação', 'Religião', 'Sobrevivência']
        },
        startingEquipment: [
            'Rapieira', 'Pacote de Artista', 'Alaúde', 'Armadura de Couro', 'Adaga'
        ],
        features: [
            { level: 1, name: "Conjuração", description: "Conjura magias de bardo." },
            { level: 1, name: "Inspiração de Bardo (d6)", description: "Ação bônus: conceder 1d6 para aliado usar em d20." },
            { level: 2, name: "Pau pra Toda Obra", description: "+Metade proficiência em testes não proficientes." },
            { level: 2, name: "Canção de Descanso (d6)", description: "Cura extra em descanso curto." },
            { level: 3, name: "Colégio de Bardo", description: "Escolha um Colégio (Saber, Bravura)." },
            { level: 3, name: "Especialização", description: "Dobra proficiência em 2 perícias." },
            { level: 5, name: "Inspiração de Bardo (d8)", description: "Dado vira d8." },
            { level: 5, name: "Fonte de Inspiração", description: "Recupera inspiração em descanso curto." }
        ],
        spellcastingConfig: {
            ability: 'cha',
            cantripsKnown: 2,
            spellsKnown: 4
        },
        resources: [
            { id: 'inspiration', name: 'Inspiração de Bardo', max: 3, current: 3, rechargesOn: 'long' }
        ]
    },
    {
        id: 'cleric',
        name: 'Clérigo',
        description: "Um campeão sacerdotal que empunha magia divina a serviço de um poder superior.",
        fullDescription: "Clérigos são intermediários entre o mundo mortal e os planos distantes dos deuses...",
        hitDie: 'd8',
        primaryAbility: 'Sabedoria',
        savingThrows: ['wis', 'cha'],
        armorProficiency: ['Leve', 'Média', 'Escudos'],
        weaponProficiency: ['Simples'],
        skillChoices: {
            count: 2,
            options: ['História', 'Intuição', 'Medicina', 'Persuasão', 'Religião']
        },
        startingEquipment: [
            'Maça', 'Cota de Escamas', 'Pacote de Sacerdote', 'Escudo', 'Símbolo Sagrado'
        ],
        features: [
            { level: 1, name: "Conjuração", description: "Conjura magias divinas." },
            { level: 1, name: "Domínio Divino", description: "Escolha um Domínio (Vida, Guerra, etc)." },
            { level: 2, name: "Canalizar Divindade (1/descanso)", description: "Efeito mágico divino." },
            { level: 5, name: "Destruir Mortos-Vivos (ND 1/2)", description: "Expulsar destrói mortos-vivos fracos." }
        ],
        spellcastingConfig: {
            ability: 'wis',
            cantripsKnown: 3,
            spellsKnown: 4
        },
        resources: [
            { id: 'channel_divinity', name: 'Canalizar Divindade', max: 1, current: 1, rechargesOn: 'short' }
        ],
        subclasses: [
            {
                id: 'life',
                name: 'Domínio da Vida',
                description: 'Focado em cura e vitalidade.',
                features: [
                    { level: 1, name: "Discípulo da Vida", description: "Magias de cura (nv 1+) curam +2 + nível da magia HP extra." },
                    { level: 1, name: "Proficiência Bônus", description: "Proficiência em Armaduras Pesadas." }
                ]
            },
            {
                id: 'war',
                name: 'Domínio da Guerra',
                description: 'Focado em combate marcial e glória.',
                features: [
                    { level: 1, name: "Sacerdote da Guerra", description: "Quando usa ação Ataque, pode atacar com bônus (Wis mod/dia)." },
                    { level: 1, name: "Proficiência Bônus", description: "Proficiência em Armaduras Pesadas e Armas Marciais." }
                ]
            }
        ]
    },
    {
        id: 'rogue',
        name: 'Ladino',
        description: "Um trapaceiro que usa furtividade e astúcia para superar obstáculos e inimigos.",
        fullDescription: "Ladinos contam com perícia, furtividade e as vulnerabilidades de seus inimigos...",
        hitDie: 'd8',
        primaryAbility: 'Destreza',
        savingThrows: ['dex', 'int'],
        armorProficiency: ['Leve'],
        weaponProficiency: ['Simples', 'Bestas de Mão', 'Espadas Longas', 'Rapiers', 'Espadas Curtas'],
        skillChoices: {
            count: 4,
            options: ['Acrobacia', 'Atletismo', 'Atuação', 'Enganação', 'Furtividade', 'Intimidação', 'Intuição', 'Investigação', 'Percepção', 'Persuasão', 'Prestidigitação']
        },
        startingEquipment: [
            'Pacote de Assaltante', 'Armadura de Couro', 'Adaga (2)', 'Ferramentas de Ladrão'
        ],
        equipmentChoices: [
            {
                label: "Arma Principal",
                options: [
                    { label: "Rapieira", items: ["Rapieira"] },
                    { label: "Arco Curto + Flechas", items: ["Arco Curto", "Flechas (20)"] }
                ]
            }
        ],
        features: [
            { level: 1, name: "Ataque Furtivo (1d6)", description: "+1d6 dano se tiver vantagem ou aliado a 1.5m." },
            { level: 1, name: "Especialização", description: "Dobra proficiência em 2 perícias." },
            { level: 1, name: "Gíria de Ladrão", description: "Linguagem secreta." },
            { level: 2, name: "Ação Astuta", description: "Bônus: Disparada, Desengajar, Esconder." },
            { level: 3, name: "Arquétipo Ladino", description: "Ladrão, Assassino, Trapaceiro Arc." },
            { level: 5, name: "Esquiva Sobrenatural", description: "Reação para reduzir dano pela metade." }
        ]
    },
    {
        id: 'fighter',
        name: 'Guerreiro',
        description: "Um mestre do combate marcial, perito em uma variedade de armas e armaduras.",
        fullDescription: "Guerreiros aprendem o básico de todos os estilos de combate...",
        hitDie: 'd10',
        primaryAbility: 'Força ou Destreza',
        savingThrows: ['str', 'con'],
        armorProficiency: ['Todas', 'Escudos'],
        weaponProficiency: ['Simples', 'Marciais'],
        skillChoices: {
            count: 2,
            options: ['Acrobacia', 'Adestrar Animais', 'Atletismo', 'História', 'Intimidação', 'Intuição', 'Percepção', 'Sobrevivência']
        },
        startingEquipment: [
            'Cota de Malha', 'Espada Longa', 'Escudo', 'Pacote de Aventureiro'
        ],
        features: [
            { level: 1, name: "Estilo de Luta", description: "+1 CA, +2 Dano Duelo, etc." },
            { level: 1, name: "Retomar o Fôlego", description: "Bônus: Cura 1d10 + Nível." },
            { level: 2, name: "Surto de Ação", description: "Uma ação extra no turno (1/descanso)." },
            { level: 3, name: "Arquétipo Marcial", description: "Campeão, Mestre de Batalha, etc." },
            { level: 5, name: "Ataque Extra", description: "Dois ataques por ação." }
        ],
        resources: [
            { id: 'second_wind', name: 'Retomar o Fôlego', max: 1, current: 1, rechargesOn: 'short' },
            { id: 'action_surge', name: 'Surto de Ação', max: 1, current: 1, rechargesOn: 'short' }
        ],
        subclasses: [
            {
                id: 'champion',
                name: 'Campeão',
                description: 'Focado em poder físico bruto.',
                features: [
                    { level: 3, name: "Crítico Aprimorado", description: "Crítico rolando 19 ou 20." }
                ]
            },
            {
                id: 'battle_master',
                name: 'Mestre de Batalha',
                description: 'Tático e estratégico.',
                features: [
                    { level: 3, name: "Superioridade em Combate", description: "4 dados de superioridade (d8) para manobras." }
                ]
            },
            {
                id: 'arcane_archer',
                name: 'Arqueiro Arcano (Xanathar)',
                description: 'Combina magia élfica com arquearia.',
                features: [
                    { level: 3, name: "Conhecimento Arcano", description: "Proficiência em Arcanismo ou Natureza. Prestigitação ou Druidcraft." },
                    { level: 3, name: "Disparo Arcano (2/descanso)", description: "Opções mágicas ao disparar (ex: Flecha Explosiva, Flecha das Sombras)." }
                ]
            }
        ]
    },
    {
        id: 'paladin',
        name: 'Paladino',
        description: "Um guerreiro sagrado preso a um juramento sagrado.",
        fullDescription: "Paladinos são jurados a um caminho de justiça...",
        hitDie: 'd10',
        primaryAbility: 'Força e Carisma',
        savingThrows: ['wis', 'cha'],
        armorProficiency: ['Todas', 'Escudos'],
        weaponProficiency: ['Simples', 'Marciais'],
        skillChoices: {
            count: 2,
            options: ['Atletismo', 'Intimidação', 'Intuição', 'Medicina', 'Persuasão', 'Religião']
        },
        startingEquipment: [
            'Espada Longa', 'Escudo', 'Azagaia (5)', 'Pacote de Sacerdote', 'Cota de Malha', 'Símbolo Sagrado'
        ],
        features: [
            { level: 1, name: "Sentido Divino", description: "Detecta celestiais, infernais, mortos-vivos (1 + Cha Mod vezes)." },
            { level: 1, name: "Impor as Mãos", description: "Pool de cura = 5 * Nível." },
            { level: 2, name: "Estilo de Luta", description: "+1 CA, Duelo, etc." },
            { level: 2, name: "Destruição Divina (Smite)", description: "Gasta slot para +2d8 dano radiante." },
            { level: 3, name: "Saúde Divina", description: "Imune a doenças." },
            { level: 3, name: "Juramento Sagrado", description: "Devoção, Anciões, Vingança." },
            { level: 5, name: "Ataque Extra", description: "Dois ataques por ação." }
        ],
        spellcastingConfig: {
            ability: 'cha',
            cantripsKnown: 0,
            spellsKnown: 0
        },
        resources: [
            { id: 'lay_on_hands', name: 'Impor as Mãos (PV)', max: 5, current: 5, rechargesOn: 'long' },
            { id: 'divine_sense', name: 'Sentido Divino', max: 4, current: 4, rechargesOn: 'long' }
        ]
    },
    {
        id: 'wizard',
        name: 'Mago',
        description: "Um usuário de magia escolástico capaz de manipular as estruturas da realidade.",
        fullDescription: "Magos estudam a magia como ciência...",
        hitDie: 'd6',
        primaryAbility: 'Inteligência',
        savingThrows: ['int', 'wis'],
        armorProficiency: ['Nenhuma'],
        weaponProficiency: ['Adagas', 'Dardos', 'Fundas', 'Bordões', 'Bestas Leves'],
        skillChoices: {
            count: 2,
            options: ['Arcanismo', 'História', 'Intuição', 'Investigação', 'Medicina', 'Religião']
        },
        startingEquipment: [
            'Bordão', 'Bolsa de Componentes', 'Pacote de Estudioso', 'Grimório'
        ],
        features: [
            { level: 1, name: "Conjuração", description: "Usa Int para conjurar. Precisa de Grimório." },
            { level: 1, name: "Recuperação Arcana", description: "Recupera slots (metade do nível) em short rest." },
            { level: 2, name: "Tradição Arcana", description: "Evocação, Necromancia, etc." }
        ],
        spellcastingConfig: {
            ability: 'int',
            cantripsKnown: 3,
            spellsKnown: 6
        },
        subclasses: [
            {
                id: 'evoc',
                name: 'Escola de Evocação',
                description: 'Especialista em magias destrutivas.',
                features: [
                    { level: 2, name: "Escultor de Magias", description: "Pode criar bolsões de segurança em magias de área (aliados não tomam dano)." }
                ]
            }
        ]
    },
    {
        id: 'ranger',
        name: 'Patrulheiro (Ranger)',
        description: "Um guerreiro que usa proeza marcial e magia da natureza para combater ameaças nos limites da civilização.",
        fullDescription: "Longe da agitação das cidades e vilas, passando as cercas vivas que protegem as fazendas...",
        hitDie: 'd10',
        primaryAbility: 'Destreza e Sabedoria',
        savingThrows: ['str', 'dex'],
        armorProficiency: ['Leve', 'Média', 'Escudos'],
        weaponProficiency: ['Simples', 'Marciais'],
        skillChoices: {
            count: 3,
            options: ['Adestrar Animais', 'Atletismo', 'Furtividade', 'Intuição', 'Investigação', 'Natureza', 'Percepção', 'Sobrevivência']
        },
        startingEquipment: [
            'Arco Longo', 'Aljava (20)', 'Espada Curta (x2)', 'Pacote de Explorador', 'Armadura de Couro'
        ],
        features: [
            { level: 1, name: "Inimigo Favorito", description: "Vantagem em Sobrevivência/Inteligência contra um tipo de inimigo. Linguagem extra." },
            { level: 1, name: "Explorador Natural", description: "Ignora terreno difícil, vantagem em iniciativa, vantagem no primeiro turno se o inimigo não agiu (Revisado)." },
            { level: 2, name: "Estilo de Luta", description: "+2 em Arquearia, Defesa, etc." },
            { level: 2, name: "Conjuração", description: "Magias de Ranger (Wisdom)." },
            { level: 3, name: "Arquétipo de Patrulheiro", description: "Conclave (Caçador, Gloom Stalker, etc)." },
            { level: 5, name: "Ataque Extra", description: "Dois ataques por ação." }
        ],
        spellcastingConfig: {
            ability: 'wis',
            cantripsKnown: 0,
            spellsKnown: 2
        },
        subclasses: [
            {
                id: 'gloom_stalker',
                name: 'Caçador das Sombras (Gloom Stalker)',
                description: 'Especialista em emboscadas e escuridão (Xanathar).',
                features: [
                    { level: 3, name: "Magia das Sombras", description: "Aprende Disfarçar-se (Disguise Self)." },
                    { level: 3, name: "Emboscador Medonho", description: "+Wis na Iniciativa. 1º turno: +3m deslocamento e +1 ataque que causa +1d8 dano." },
                    { level: 3, name: "Visão Umbral", description: "Visão no escuro 18m (ou +9m). Invisível para visão no escuro de criaturas." }
                ]
            },
            {
                id: 'hunter',
                name: 'Caçador (Hunter)',
                description: 'Defensor clássico contra hordas ou monstros gigantes.',
                features: [
                    { level: 3, name: "Presa do Caçador", description: "Escolha: Colosso (d8 extra em feridos), Matador de Gigantes, ou Quebrador de Hordas." }
                ]
            }
        ]
    }, // <-- END RANGER
    {
        id: 'witcher',
        name: 'Bruxo (Custom)',

        description: "Um caçador de monstros profissional, mutante e treinado.",
        fullDescription: "Bruxos são mutantes caçadores...",
        hitDie: 'd10',
        primaryAbility: 'Dexteridade ou Força',
        savingThrows: ['dex', 'wis'],
        armorProficiency: ['Leve', 'Média'],
        weaponProficiency: ['Simples', 'Marciais', 'Espada de Prata'],
        skillChoices: {
            count: 3,
            options: ['Acrobacia', 'Atletismo', 'Arcanismo', 'Investigação', 'Natureza', 'Percepção', 'Sobrevivência', 'Intimidação']
        },
        startingEquipment: [
            'Espada de Prata', 'Espada de Aço', 'Kit de Alquimia', 'Poção Andorinha (x2)'
        ],
        features: [
            { level: 1, name: "Treinamento de Bruxo", description: "Proficiência com espadas, armaduras leves/médias." },
            { level: 1, name: "Medalhão", description: "Vibra com magia/monstros." },
            { level: 1, name: "Escola de Bruxo", description: "Escolha uma Escola (Lobo, Gato, Urso, etc)." },
            { level: 1, name: "Sinais", description: "Conjura Aard, Igni, Quen, Yrden, Axii." },
            { level: 2, name: "Alquimia de Combate", description: "Bebe poção como bônus." },
            { level: 5, name: "Ataque Extra", description: "Dois ataques por ação." }
        ],
        spellcastingConfig: {
            ability: 'wis',
            cantripsKnown: 5,
            spellsKnown: 2
        },
        resources: [
            { id: 'toxicity', name: 'Toxicidade', max: 100, current: 0, rechargesOn: 'short' } // Custom mechanic simulation
        ],
        subclasses: [
            {
                id: 'school_wolf',
                name: 'Escola do Lobo',
                description: 'Equilíbrio e versatilidade. Guerreiros de Kaer Morhen.',
                startingEquipment: ['Armadura de Couro Batido', 'Poção Raio'],
                features: [
                    { level: 1, name: "Técnica de Kaer Morhen", description: "+1 Ataque Espadas Longas, +1 CD Sinais." }
                ]
            },
            {
                id: 'school_cat',
                name: 'Escola do Gato',
                description: 'Assassinos ágeis e letais. Armaduras leves.',
                startingEquipment: ['Armadura de Couro', 'Besta de Mão', 'Virotes (20)'],
                features: [
                    { level: 1, name: "Reflexos Felinos", description: "+3m movimento e Crítico no 19-20 usando armadura leve." }
                ]
            },
            {
                id: 'school_bear',
                name: 'Escola do Urso',
                description: 'Tanques robustos. Armaduras pesadas.',
                startingEquipment: ['Cota de Malha', 'Poção Lua Superior'],
                features: [
                    { level: 1, name: "Fortaleza", description: "Proficiência Pesada. +2 PV/Nível." }
                ]
            },
            {
                id: 'school_griffin',
                name: 'Escola do Grifo',
                description: 'Mestres dos Sinais e magia.',
                startingEquipment: ['Meia-Armadura', 'Cristal de Foco'],
                features: [
                    { level: 1, name: "Mestre dos Sinais", description: "Alcance x2. Sinais como Bônus (Wis mod/descanso)." }
                ]
            },
            {
                id: 'school_viper',
                name: 'Escola da Víbora',
                description: 'Venenos e lâminas curtas.',
                startingEquipment: ['Corselete de Couro', 'Adaga (2)', 'Veneno de Lagarto'],
                features: [
                    { level: 1, name: "Presas da Víbora", description: "Aplica veneno como bônus. +1d6 veneno em sneak attack." }
                ]
            }
        ]
    }
];
