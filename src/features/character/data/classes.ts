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
    system?: 'dnd55e' | 'witcher';

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
    // =========================================================================
    // 1. BÁRBARO (BARBARIAN)
    // =========================================================================
    {
        id: 'barbarian',
        name: 'Bárbaro',
        system: 'dnd55e',
        description: "Um guerreiro feroz impulsionado por fúria primal instintiva, maestria com armas colossais e sentidos aguçados de sobrevivência.",
        fullDescription: "Bárbaros canalizam uma fúria selvagem primordial que lhes concede vigor hercúleo, resistência sobrenatural a ferimentos e a capacidade de usar Força até mesmo em perícias de exploração.",
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
            { level: 1, name: "Fúria (Rage)", description: "Ação Bônus por 10 min. Vantagem em testes e salvaguardas de Força, +2 dano de fúria, e Resistência a dano de concussão, cortante e perfurante. Mantida atacando ou usando Ação Bônus.", type: 'bonus_action' },
            { level: 1, name: "Defesa Sem Armadura", description: "Enquanto não estiver usando nenhuma armadura, sua Classe de Armadura é igual a 10 + Mod. de Destreza + Mod. de Constituição (pode usar escudo).", type: 'passive' },
            { level: 1, name: "Maestria de Armas", description: "Você pode invocar as propriedades de Maestria (Cleave, Graze, Topple, etc.) de dois tipos de armas simples ou marciais à sua escolha.", type: 'passive' },
            { level: 2, name: "Ataque Descuidado (Reckless Attack)", description: "Ao fazer seu primeiro ataque no turno, ganhe Vantagem em todas as jogadas de ataque corpo a corpo com Força neste turno; ataques contra você ganham Vantagem até seu próximo turno.", type: 'action' },
            { level: 2, name: "Sentido de Perigo (Danger Sense)", description: "Você tem Vantagem em salvaguardas de Destreza, a menos que esteja Incapacitado.", type: 'passive' },
            { level: 3, name: "Conhecimento Primitivo (Primal Knowledge)", description: "Enquanto estiver em Fúria, você pode realizar testes de Acrobacia, Intimidação, Percepção, Furtividade e Sobrevivência usando FORÇA em vez do atributo usual.", type: 'passive' },
            { level: 3, name: "Caminho Primitivo (Subclasse)", description: "Você escolhe seu Caminho Primitivo: Berserker, Coração Selvagem, Árvore do Mundo ou Fanático.", type: 'passive' },
            { level: 5, name: "Ataque Extra", description: "Você pode atacar duas vezes em vez de uma sempre que realizar a ação Atacar no seu turno.", type: 'action' },
            { level: 5, name: "Movimento Rápido", description: "Seu deslocamento de caminhada aumenta em +3 metros se você não estiver vestindo armadura pesada.", type: 'passive' }
        ],
        resources: [
            { id: 'furia', name: 'Usos de Fúria', max: 2, current: 2, rechargesOn: 'long' }
        ],
        subclasses: [
                {
                        id: "berserker",
                        name: "Trilha do Berserker",
                        description: "Guerreiros que abraçam a violência avassaladora e a fúria desenfreada. Canalizam fúria em golpes brutais contínuos.\n\n🛡️ O que você ganha: Dano massivo extra por turno com Ataque Descuidado, imunidade total a Enfeitiçado e Amedrontado na fúria, ataques imediatos como Reação ao sofrer dano e presença aterradora.\n⚔️ O que você pode fazer: Liderar o combate corpo a corpo causando dano devastador em cada rodada, ignorando feitiços de controle mental de monstros e punindo qualquer inimigo que ousar atacá-lo.",
                        features: [
                                {
                                        level: 3,
                                        name: "Frenesi Furioso (Frenzy)",
                                        type: "passive",
                                        description: "Uma vez por turno ao acertar um ataque corpo a corpo usando Força e Ataque Descuidado enquanto em Fúria, cause +2d6 de dano adicional do tipo da sua arma (aumenta para +3d6 no Nv 10 e +4d6 no Nv 14)."
                                },
                                {
                                        level: 6,
                                        name: "Fúria Insensível (Mindless Rage)",
                                        type: "passive",
                                        description: "Enquanto estiver em Fúria, você é imune às condições Enfeitiçado e Amedrontado. Se entrar em Fúria já sob efeito dessas condições, o efeito fica suspenso enquanto durar a Fúria."
                                },
                                {
                                        level: 10,
                                        name: "Retaliação (Retaliation)",
                                        type: "reaction",
                                        description: "Quando sofrer dano de uma criatura que esteja a até 1,5m de você, você pode usar sua Reação para desferir um ataque corpo a corpo imediato com arma contra essa criatura."
                                },
                                {
                                        level: 14,
                                        name: "Presença Intimidante",
                                        type: "bonus_action",
                                        description: "Como Ação Bônus, solte um rugido aterrador. Criaturas à sua escolha em um raio de 9m devem passar em salvaguarda de Sabedoria (CD 8 + PB + Mod. Força) ou ficarão Amedrontadas por 1 minuto."
                                }
                        ]
                },
                {
                        id: "wild_heart",
                        name: "Trilha do Coração Selvagem",
                        description: "Conexão xamânica profunda com os espíritos totêmicos das grandes feras da natureza.\n\n🛡️ O que você ganha: Sintonização totêmica a cada Fúria (Urso para absorver quase todo dano, Águia para mobilidade aérea e desengajar veloz, Lobo para conceder vantagem aos aliados adjacentes), além de sentidos animais e saltos portentosos.\n⚔️ O que você pode fazer: Adaptar seu papel a cada batalha: ser o tanque supremo inabalável que absorve dano elementar ou o caçador móvel que comanda o flanqueamento do grupo.",
                        features: [
                                {
                                        level: 3,
                                        name: "Fúria do Coração Feroz",
                                        type: "passive",
                                        description: "Ao entrar em Fúria, escolha um aspecto totêmico: • Urso: Resistência a todos os tipos de dano, exceto Psíquico. • Águia: Disparada e Desengajar com Ação Bônus, e ataques de oportunidade contra você têm Desvantagem. • Lobo: Seus aliados têm Vantagem em ataques corpo a corpo contra inimigos a até 1,5m de você."
                                },
                                {
                                        level: 6,
                                        name: "Aspecto da Fera",
                                        type: "passive",
                                        description: "Ganhe uma dádiva animal permanente: Olhos de Águia (visão nítida até 1,5 km sem desvantagem em penumbra), Vigor de Urso (capacidade de carga e peso suportado dobrados) ou Faro de Lobo (rastreia presas com facilidade em ritmo veloz)."
                                },
                                {
                                        level: 14,
                                        name: "Sintonia Totêmica Suprema",
                                        type: "bonus_action",
                                        description: "Durante a Fúria, manifeste o poder supremo da sua fera: derrubar inimigos voadores ao acertar golpes (Águia), pisotear oponentes caídos (Urso) ou impulsionar investidas de aliados (Lobo)."
                                }
                        ]
                },
                {
                        id: "world_tree",
                        name: "Trilha da Árvore do Mundo",
                        description: "Canalizadores das raízes protetoras e cósmicas de Yggdrasil, a Árvore da Vida do multiverso.\n\n🛡️ O que você ganha: Pontos de vida temporários regenerativos automáticos a cada turno para você e aliados, raízes espectrais que puxam inimigos distantes para o combate corpo a corpo e alcance ampliado de armas pesadas.\n⚔️ O que você pode fazer: Proteger companheiros frágeis com um manto vegetal inesgotável de vitalidade e arrastar conjuradores e arqueiros inimigos diretamente para o fio do seu machado.",
                        features: [
                                {
                                        level: 3,
                                        name: "Vitalidade da Árvore",
                                        type: "passive",
                                        description: "Ao entrar em Fúria, receba PVs temporários iguais ao seu nível de Bárbaro. No início de cada um dos seus turnos enfurecido, conceda a si mesmo ou a um aliado a até 3m um número de PVs temporários igual a 1d6 + seu bônus de dano de Fúria."
                                },
                                {
                                        level: 6,
                                        name: "Ramos da Árvore (Branches of the Tree)",
                                        type: "reaction",
                                        description: "Quando uma criatura a até 6m de você iniciar seu turno ou se mover, use sua Reação para fazer raízes espectrais brotarem e puxá-la para até 1,5m de você (salvaguarda de Força contra CD da classe anula o movimento)."
                                },
                                {
                                        level: 10,
                                        name: "Raízes Esmagadoras (Battering Roots)",
                                        type: "passive",
                                        description: "Durante seu turno, qualquer arma corpo a corpo com propriedade Pesada ou Versátil empunhada por você tem seu alcance estendido em +3 metros através de galhos espirituais entrelaçados."
                                }
                        ]
                },
                {
                        id: "zealot",
                        name: "Trilha do Fanático",
                        description: "Guerreiros sagrados tocados pela fúria divina dos deuses da batalha e da justiça cósmica.\n\n🛡️ O que você ganha: Dano sagrado radiante ou necrótico adicional no primeiro acerto de cada rodada, ressurreição sem custo de diamantes por magias divinas, re-rolar salvaguardas falhadas na fúria e aura de fanatismo coletivo.\n⚔️ O que você pode fazer: Lutar como uma força sagrada imparável da vanguarda que dizima mortos-vivos e corruptores sem temer a morte.",
                        features: [
                                {
                                        level: 3,
                                        name: "Fúria Divina (Divine Fury)",
                                        type: "passive",
                                        description: "O primeiro alvo que acertar com arma em cada turno durante a Fúria sofre +1d6 + metade do seu nível de Bárbaro em dano Radiante ou Necrótico adicional (escolha ao sintonizar a subclasse)."
                                },
                                {
                                        level: 3,
                                        name: "Guerreiro dos Deuses (Warrior of the Gods)",
                                        type: "passive",
                                        description: "Magias que tenham o propósito único de reviver você dos mortos (como Revivificar ou Ressurreição) não exigem componentes materiais caros em dinheiro ou gemas."
                                },
                                {
                                        level: 6,
                                        name: "Foco Fanático (Fanatical Focus)",
                                        type: "passive",
                                        description: "Uma vez por uso de Fúria, se você falhar em uma salvaguarda, você pode re-rolar o dado e deve usar o novo resultado obtido."
                                },
                                {
                                        level: 10,
                                        name: "Presença Fanática (Zealous Presence)",
                                        type: "bonus_action",
                                        description: "Como Ação Bônus, solte um brado heróico abençoado: até 10 aliados a até 18 metros ganham Vantagem em jogadas de ataque e salvaguardas até o início do seu próximo turno (1 uso por descanso longo)."
                                }
                        ]
                }
        ]
    },

    // =========================================================================
    // 2. BARDO (BARD)
    // =========================================================================
    {
        id: 'bard',
        name: 'Bardo',
        system: 'dnd55e',
        description: "Mestre da música, palavras de poder e versatilidade mágica, capaz de inspirar companheiros e dobrar o destino.",
        fullDescription: "Bardos manipulam a Canção da Criação com magia artística, palavras encantadas e conhecimento amplo de todas as tradições.",
        hitDie: 'd8',
        primaryAbility: 'Carisma',
        savingThrows: ['dex', 'cha'],
        armorProficiency: ['Leve'],
        weaponProficiency: ['Simples'],
        toolChoices: {
            count: 3,
            options: ['Instrumentos Musicais (Alaúde)', 'Instrumentos Musicais (Flauta)', 'Instrumentos Musicais (Lira)', 'Instrumentos Musicais (Tambor)']
        },
        skillChoices: {
            count: 3,
            options: ['Acrobacia', 'Adestrar Animais', 'Arcanismo', 'Atletismo', 'Atuação', 'Enganação', 'Furtividade', 'História', 'Intimidação', 'Intuição', 'Investigação', 'Medicina', 'Natureza', 'Percepção', 'Persuasão', 'Prestidigitação', 'Religião', 'Sobrevivência']
        },
        startingEquipment: [
            'Espada Curta', 'Pacote de Artista', 'Alaúde', 'Armadura de Couro', 'Adaga'
        ],
        features: [
            { level: 1, name: "Inspiração de Bardo (d6)", description: "Com uma Ação Bônus, conceda 1d6 de Inspiração a uma criatura a até 18m para somar em um d20 dentro de 1 hora. Usos = Mod CAR (mínimo 1).", type: 'bonus_action' },
            { level: 1, name: "Conjuração de Bardo", description: "Conhece truques e magias preparadas da lista de Bardo utilizando Carisma.", type: 'passive' },
            { level: 2, name: "Pau pra Toda Obra (Jack of All Trades)", description: "Você pode adicionar metade do seu Bônus de Proficiência (arredondado para baixo) a qualquer teste de d20 que ainda não inclua seu PB.", type: 'passive' },
            { level: 2, name: "Especialização (Expertise)", description: "Escolha duas de suas perícias proficientes; seu Bônus de Proficiência é dobrado em testes com elas.", type: 'passive' },
            { level: 3, name: "Colégio de Bardo (Subclasse)", description: "Escolha seu Colégio de Bardo: Conhecimento, Bravura, Dança ou Glamour.", type: 'passive' },
            { level: 5, name: "Inspiração de Bardo (d8)", description: "O dado de Inspiração de Bardo aumenta para 1d8.", type: 'passive' },
            { level: 5, name: "Fonte de Inspiração", description: "Você recupera todos os usos gastos de Inspiração de Bardo ao completar um Descanso Curto ou Longo.", type: 'passive' }
        ],
        spellcastingConfig: {
            ability: 'cha',
            cantripsKnown: 2,
            spellsKnown: 4
        },
        resources: [
            { id: 'inspiration', name: 'Inspiração de Bardo', max: 3, current: 3, rechargesOn: 'short' }
        ],
        subclasses: [
                {
                        id: "lore",
                        name: "Colégio do Conhecimento (Lore)",
                        description: "Mestres supremos da erudição, segredos arcanos proibidos e manipulação do destino alheio.\n\n🛡️ O que você ganha: 3 proficiências extras em qualquer perícia, Palavras Cortantes para subtrair rolagens de ataque e dano dos inimigos como Reação usando Inspiração, e Magias Secretas Adicionais desbloqueadas mais cedo que qualquer outra classe (no 6º nível).\n⚔️ O que você pode fazer: Sabotar oponentes no momento crítico para fazê-los errar ataques mortais e conjurar as magias mais icônicas de magos, clérigos e paladinos no seu próprio repertório.",
                        features: [
                                {
                                        level: 3,
                                        name: "Proficiências Adicionais",
                                        type: "passive",
                                        description: "Você ganha proficiência em três perícias à sua livre escolha entre todas as 18 perícias existentes no sistema."
                                },
                                {
                                        level: 3,
                                        name: "Palavras Cortantes (Cutting Words)",
                                        type: "reaction",
                                        description: "Quando uma criatura a até 18m realizar uma jogada de ataque, teste de atributo ou rolagem de dano, use sua Reação e gaste 1 Inspiração de Bardo para subtrair o valor rolado na Inspiração do total dela."
                                },
                                {
                                        level: 6,
                                        name: "Segredos Mágicos Adicionais",
                                        type: "passive",
                                        description: "Você aprende duas magias de qualquer lista de classes (Bruxo, Clérigo, Druida, Feiticeiro, Mago, Paladino ou Guardião) de até 3º círculo. Elas contam como magias de Bardo para você."
                                }
                        ]
                },
                {
                        id: "valor",
                        name: "Colégio da Bravura (Valor)",
                        description: "Bardos de vanguarda que entoam baladas de guerra empunhando escudos pesados e armas marciais.\n\n🛡️ O que você ganha: Proficiência com Armaduras Médias, Escudos e Armas Marciais, Inspiração de Combate (que aliados podem somar ao dano ou à sua CA defensiva), e Ataque Extra no 6º nível permitindo substituir um golpe por um truque mágico.\n⚔️ O que você pode fazer: Lutar na linha de frente com CA elevada, mesclando ataques de espada e magia no mesmo turno enquanto turbina a letalidade e proteção dos aliados.",
                        features: [
                                {
                                        level: 3,
                                        name: "Proficiências Marciais",
                                        type: "passive",
                                        description: "Você ganha proficiência com armaduras médias, escudos e todas as armas marciais simples e pesadas."
                                },
                                {
                                        level: 3,
                                        name: "Inspiração de Combate (Combat Inspiration)",
                                        type: "passive",
                                        description: "Uma criatura com seu dado de Inspiração pode adicioná-lo à rolagem de dano de um ataque com arma acertado OU, como Reação ao ser atacada, somá-lo à sua CA para fazer o ataque inimigo errar."
                                },
                                {
                                        level: 6,
                                        name: "Ataque Extra Bélico",
                                        type: "action",
                                        description: "Você pode atacar duas vezes em vez de uma na ação Atacar. Além disso, você pode substituir um desses ataques pela conjuração de um truque de bardo de 1 ação."
                                }
                        ]
                },
                {
                        id: "dance",
                        name: "Colégio da Dança",
                        description: "Bailarinos graciosos que canalizam magia harmônica em combate desarmado veloz e passos acrobáticos.\n\n🛡️ O que você ganha: CA sem armadura baseada em Destreza + Carisma, golpes desarmados ágeis que usam o dado de Inspiração de Bardo para dano, e movimento fluido compartilhado com aliados.\n⚔️ O que você pode fazer: Mover-se pelo campo de batalha sem sofrer ataques de oportunidade, golpeando com artes marciais elegantes e reposicionando companheiros em perigo a cada turno.",
                        features: [
                                {
                                        level: 3,
                                        name: "Movimento Deslumbrante (Dazzling Footwork)",
                                        type: "passive",
                                        description: "Sem armadura nem escudo, sua CA é 10 + Mod. Destreza + Mod. Carisma. Seus ataques desarmados podem usar Destreza para ataque e dano, causando dano igual ao seu dado de Inspiração de Bardo."
                                },
                                {
                                        level: 3,
                                        name: "Passos Inspiradores",
                                        type: "reaction",
                                        description: "Quando você gasta um dado de Inspiração de Bardo, você e um aliado visível a até 9m podem se mover até metade do seu deslocamento imediatamente sem provocar ataques de oportunidade."
                                },
                                {
                                        level: 6,
                                        name: "Dança Sincronizada",
                                        type: "action",
                                        description: "Coordene movimentos com um aliado adjacente: ambos ganham Vantagem em salvaguardas de Destreza e resistência contra ataques de área até seu próximo turno."
                                }
                        ]
                },
                {
                        id: "glamour",
                        name: "Colégio do Glamour",
                        description: "Bardos imbuidos com a majestade estonteante e o fascínio hipnótico da Corte das Fadas de Faéria.\n\n🛡️ O que você ganha: Manto de Inspiração concedendo PVs temporários imediatos e reposicionamento livre para toda a equipe, Manto de Majestade que permite conjurar Comando (Command) como Ação Bônus sem gastar magias a cada rodada.\n⚔️ O que você pode fazer: Controlar a mente de adversários e reorganizar formações táticas inteiras no campo de batalha em um piscar de olhos.",
                        features: [
                                {
                                        level: 3,
                                        name: "Manto de Inspiração (Mantle of Inspiration)",
                                        type: "bonus_action",
                                        description: "Gaste 1 Inspiração de Bardo para tecer glamour feérico: escolha até um número de criaturas visíveis a até 18m igual ao seu Mod. Carisma. Cada uma ganha 2x o valor máximo da sua Inspiração em PVs temporários e pode se mover seu deslocamento total como Reação sem provocar ataques de oportunidade."
                                },
                                {
                                        level: 3,
                                        name: "Presença Envolvente",
                                        type: "action",
                                        description: "Apresente-se por 1 minuto para hipnotizar uma audiência: humanoides que falharem em salvaguarda de Sabedoria ficam Enfeitiçados por 1 hora, idolatrando você abertamente."
                                },
                                {
                                        level: 6,
                                        name: "Manto de Majestade (Mantle of Majesty)",
                                        type: "bonus_action",
                                        description: "Por 1 minuto, em cada um de seus turnos, você pode conjurar o feitiço Comando (Command) como uma Ação Bônus sem gastar espaços de magia. Criaturas enfeitiçadas falham automaticamente na salvaguarda."
                                }
                        ]
                }
        ]
    },

    // =========================================================================
    // 3. BRUXO / WARLOCK (D&D 5.5e)
    // =========================================================================
    {
        id: 'warlock',
        name: 'Bruxo',
        system: 'dnd55e',
        description: "Conjurador que forjou um pacto com uma entidade do além em troca de invocações místicas e magia de pacto veloz.",
        fullDescription: "Bruxos buscam conhecimento proibido forjando barganhas com Arquifadas, Senhores Ínferos, Celestiais ou Grandes Antigos. Suas Invocações Místicas começam já no 1º nível.",
        hitDie: 'd8',
        primaryAbility: 'Carisma',
        savingThrows: ['wis', 'cha'],
        armorProficiency: ['Leve'],
        weaponProficiency: ['Simples'],
        skillChoices: {
            count: 2,
            options: ['Arcanismo', 'Enganação', 'História', 'Intimidação', 'Investigação', 'Natureza', 'Religião']
        },
        startingEquipment: [
            'Adaga (x2)', 'Armadura de Couro', 'Bolsa de Componentes', 'Foco Arcano', 'Pacote de Estudioso'
        ],
        features: [
            { level: 1, name: "Magia de Pacto", description: "Espaços de magia de círculo máximo que se recuperam inteiramente após um Descanso Curto ou Longo.", type: 'passive' },
            { level: 1, name: "Invocações Místicas (Nível 1!)", description: "Você aprende 1 Invocação Mística imediatamente (ex: Pacto da Lâmina para atacar com Carisma, Pacto do Tomo com truques extras ou Pacto da Corrente com familiar inteligente).", type: 'passive' },
            { level: 2, name: "Mais Invocações Místicas", description: "Você ganha invocações adicionais (ex: Rajada Agonizante para somar CAR no dano de Rajada Mística).", type: 'passive' },
            { level: 3, name: "Patrono Transcendental (Subclasse)", description: "Escolha seu Patrono: Ínfero, Arquifada, Celestial ou O Grande Antigo.", type: 'passive' },
            { level: 5, name: "Espaços de 3º Círculo", description: "Seus espaços de magia de pacto avançam para o 3º círculo.", type: 'passive' }
        ],
        spellcastingConfig: {
            ability: 'cha',
            cantripsKnown: 2,
            spellsKnown: 2
        },
        subclasses: [
                {
                        id: "fiend",
                        name: "Patrono Ínfero (Fiend)",
                        description: "Pacto forjado com grandes lordes dos Nove Infernos ou senhores das profundezas do Abismo.\n\n🛡️ O que você ganha: Bênção do Obscuro (PVs temporários ao derrotar inimigos), Sorte do Próprio Demônio para adicionar +1d10 em salvaguardas e testes cruciais, e feitiços pirotécnicos destrutivos (Bola de Fogo, Mãos Flamejantes e Muralha de Fogo).\n⚔️ O que você pode fazer: Atuar como um conjurador ofensivo implacável de alta resistência, dizimando bandos com tempestades de fogo e mantendo sua reserva de vida alta com a morte dos oponentes.",
                        features: [
                                {
                                        level: 3,
                                        name: "Bênção do Obscuro (Dark One's Blessing)",
                                        type: "passive",
                                        description: "Ao reduzir uma criatura hostil a 0 pontos de vida, receba imediatamente pontos de vida temporários iguais ao seu Modificador de Carisma + seu nível de Bruxo (mínimo 1)."
                                },
                                {
                                        level: 3,
                                        name: "Magias do Pacto Ínfero",
                                        type: "passive",
                                        description: "Você ganha magias preparadas temáticas: Mãos Flamejantes, Fogo das Fadas, Raio Ardente e a icônica Bola de Fogo (no nível 5)."
                                },
                                {
                                        level: 6,
                                        name: "Sorte do Próprio Demônio",
                                        type: "passive",
                                        description: "Ao realizar um teste de atributo ou salvaguarda, adicione 1d10 ao resultado após ver a rolagem inicial, mas antes dos efeitos ocorrerem (recupera em descanso curto ou longo)."
                                },
                                {
                                        level: 10,
                                        name: "Resistência Demoníaca",
                                        type: "action",
                                        description: "Ao concluir um descanso curto ou longo, escolha um tipo de dano (exceto Força). Você ganha resistência permanente àquele tipo até escolher outro."
                                }
                        ]
                },
                {
                        id: "archfey",
                        name: "Patrono Arquifada (Archfey)",
                        description: "Pacto selado com governantes caprichosos e antigos das cortes feéricas da Faéria.\n\n🛡️ O que você ganha: Presença Feérica para aterrorizar ou enfeitiçar criaturas em área, Passo Nebuloso (Misty Step) aprimorado com efeitos adicionais gratuitos (teleporte com dano tóxico, invisibilidade ou provocação de charme), e feitiços ilusórios.\n⚔️ O que você pode fazer: Teleportar-se constantemente pelo cenário de batalha, escapando do perigo sem sofrer dano enquanto confunde a mente dos alvos.",
                        features: [
                                {
                                        level: 3,
                                        name: "Presença Feérica (Fey Presence)",
                                        type: "action",
                                        description: "Como uma Ação, faça com que cada criatura em um cubo de 3m originado de você faça uma salvaguarda de Sabedoria contra sua CD de magia ou fique Enfeitiçada ou Amedrontada por você até o fim do seu próximo turno (recupera em descanso)."
                                },
                                {
                                        level: 3,
                                        name: "Magias do Pacto Feérico",
                                        type: "passive",
                                        description: "Você ganha Passo Nebuloso e Sono preparadas, além de poder conjurar Passo Nebuloso sem gastar espaços de magia um número de vezes igual ao seu Mod. de Carisma por descanso longo."
                                },
                                {
                                        level: 6,
                                        name: "Fuga Nebulosa Aprimorada",
                                        type: "reaction",
                                        description: "Ao conjurar Passo Nebuloso, ative um efeito especial: criar névoa tóxica (dano psíquico nos arredores), provocar taunt ou ficar Invisível até o final do seu turno atual."
                                }
                        ]
                },
                {
                        id: "celestial",
                        name: "Patrono Celestial",
                        description: "Vínculo sagrado com entidades dos Planos Superiores: solares, empíreos, fênixes ou ki-rins sagrados.\n\n🛡️ O que você ganha: Luz Curativa (reserva de d6s para restaurar vida de aliados com Ação Bônus sem gastar magias), truques sagrados gratuitos (Luz e Chama Sagrada), e bônus de Carisma em rolagens de dano radiante e de fogo.\n⚔️ O que você pode fazer: Unir cura à distância instantânea com bombardeio de feitiços radiantes, mantendo os aliados conscientes enquanto destrói mortos-vivos.",
                        features: [
                                {
                                        level: 3,
                                        name: "Luz Curativa (Healing Light)",
                                        type: "bonus_action",
                                        description: "Você possui uma reserva de dados d6s igual a 1 + seu nível de Bruxo. Como Ação Bônus, gaste até seu Mod. Carisma em dados para curar uma criatura visível a até 18m pelo total rolado (reserva recarrega em descanso longo)."
                                },
                                {
                                        level: 3,
                                        name: "Truques Sagrados do Pacto",
                                        type: "passive",
                                        description: "Você aprende os truques Chama Sagrada e Luz gratuitamente sem consumir limite de truques conhecidos."
                                },
                                {
                                        level: 6,
                                        name: "Alma Radiante (Radiant Soul)",
                                        type: "passive",
                                        description: "Você ganha resistência a dano Radiante. Além disso, ao conjurar uma magia que cause dano Radiante ou de Fogo, adicione seu Modificador de Carisma a uma rolagem de dano daquela magia."
                                }
                        ]
                },
                {
                        id: "great_old_one",
                        name: "Patrono O Grande Antigo",
                        description: "Comunhão mística com entidades alienígenas ancestrais que habitam o vazio estrelado do Reino Distante.\n\n🛡️ O que você ganha: Telepatia Desperta de duas vias que ignora idiomas, Escudo Entrópico para desviar ataques e ganhar vantagem na retaliação, e transformar feitiços e Rajada Mística em dano psíquico.\n⚔️ O que você pode fazer: Comunicar-se silenciosamente com seu time, governar missões de espionagem e estraçalhar a sanidade mental de adversários à distância.",
                        features: [
                                {
                                        level: 3,
                                        name: "Telepatia Desperta (Awakened Mind)",
                                        type: "passive",
                                        description: "Você pode se comunicar telepaticamente com qualquer criatura que você veja a até 9 metros, desde que ela compreenda ao menos um idioma (não precisa compartilhar o mesmo idioma com você)."
                                },
                                {
                                        level: 3,
                                        name: "Magias da Mente Cósmica",
                                        type: "passive",
                                        description: "Aprende Sussurros Dissonantes, Braços de Hadar e Coroa da Loucura preparadas como magias de patrono."
                                },
                                {
                                        level: 6,
                                        name: "Escudo Entrópico (Entropic Ward)",
                                        type: "reaction",
                                        description: "Quando uma criatura realizar um ataque contra você, use sua Reação para impor Desvantagem naquele ataque. Se errar, sua próxima jogada de ataque contra aquela criatura até o fim do seu próximo turno ganha Vantagem."
                                }
                        ]
                }
        ]
    },

    // =========================================================================
    // 4. CLÉRIGO (CLERIC)
    // =========================================================================
    {
        id: 'cleric',
        name: 'Clérigo',
        system: 'dnd55e',
        description: "Campeão sacerdotal que empunha magia divina, expulsão de mortos-vivos e autoridade cósmica dos deuses.",
        fullDescription: "Clérigos servem a princípios divinos universais. Escolhem sua Ordem Divina (Protetor ou Taumaturgo) no nível 1 e seu Domínio no nível 3.",
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
            { level: 1, name: "Conjuração Divina", description: "Prepara magias da lista de Clérigo utilizando Sabedoria. Pode conjurar rituais.", type: 'passive' },
            { level: 1, name: "Ordem Divina", description: "Escolha: Protetor (proficiência com Armaduras Pesadas e Armas Marciais) ou Taumaturgo (1 truque extra e adiciona Mod SAB em testes de Arcanismo e Religião).", type: 'passive' },
            { level: 2, name: "Canalizar Divindade (2/descanso)", description: "Canaliza poder cósmico para Expulsar Mortos-Vivos ou Centelha Divina (curar aliado ou causar dano radiante/necrótico). Recupera 1 uso em descanso curto.", type: 'action' },
            { level: 3, name: "Domínio Divino (Subclasse)", description: "Escolha seu Domínio Sagrado: Vida, Luz, Guerra ou Trapaça.", type: 'passive' },
            { level: 5, name: "Destruir Mortos-Vivos", description: "Quando falham na salvaguarda contra Expulsar Mortos-Vivos, eles sofrem dano radiante severo imediato.", type: 'passive' }
        ],
        spellcastingConfig: {
            ability: 'wis',
            cantripsKnown: 3,
            spellsKnown: 4
        },
        resources: [
            { id: 'channel_divinity', name: 'Canalizar Divindade', max: 2, current: 2, rechargesOn: 'short' }
        ],
        subclasses: [
                {
                        id: "life",
                        name: "Domínio da Vida",
                        description: "Sacerdotes dedicados aos deuses da cura, da saúde e da preservação inabalável de toda a vida.\n\n🛡️ O que você ganha: Proficiência com Armaduras Pesadas, Discípulo da Vida que soma bônus fixo a todas as suas curas, Canalizar Divindade para curar feridos em massa sem gastar magias, e curar a si mesmo ao curar os outros.\n⚔️ O que você pode fazer: Operar como a âncora médica suprema do grupo, vestindo armadura pesada na vanguarda e resgatando aliados à beira da morte turno após turno.",
                        features: [
                                {
                                        level: 3,
                                        name: "Discípulo da Vida (Disciple of Life)",
                                        type: "passive",
                                        description: "Sempre que conjurar uma magia de 1º círculo ou superior que restaure pontos de vida, o alvo recupera PVs adicionais iguais a 2 + o círculo da magia."
                                },
                                {
                                        level: 3,
                                        name: "Canalizar Divindade: Preservar a Vida",
                                        type: "action",
                                        description: "Como uma ação, gaste um uso de Canalizar Divindade para restaurar uma quantidade de pontos de vida igual a 5x o seu nível de Clérigo, distribuída entre criaturas visíveis a até 9m (não pode curar acima de 50% dos PVs máximos)."
                                },
                                {
                                        level: 6,
                                        name: "Curador Abençoado (Blessed Healer)",
                                        type: "passive",
                                        description: "Ao conjurar uma magia de cura em outra criatura, você recupera pontos de vida para si mesmo iguais a 2 + o círculo da magia conjurada."
                                }
                        ]
                },
                {
                        id: "light",
                        name: "Domínio da Luz",
                        description: "Canalizadores do fogo solar sagrado e da radiância dos deuses solares que banem as trevas.\n\n🛡️ O que você ganha: Chama Protetora para cegar atacantes como Reação e impor desvantagem, Canalizar Divindade para incinerar trevas mágicas e explodir hordas com dano radiante em área, e magias destrutivas (Mãos Flamejantes e Bola de Fogo).\n⚔️ O que você pode fazer: Castigar exércitos de monstros com dano em área colossal, banindo a escuridão e protegendo seus companheiros com clarões cegantes.",
                        features: [
                                {
                                        level: 3,
                                        name: "Chama Protetora (Warding Flare)",
                                        type: "reaction",
                                        description: "Quando uma criatura visível a até 9m atacar você ou um aliado, use sua Reação para disparar um clarão que impõe Desvantagem no ataque (usos iguais ao Mod. Sabedoria por descanso longo)."
                                },
                                {
                                        level: 3,
                                        name: "Canalizar Divindade: Radiância da Alvorada",
                                        type: "action",
                                        description: "Dispare um pulso de luz sagrada em um raio de 9 metros. Dissipa qualquer escuridão mágica e criaturas hostis sofrem 2d10 + nível de Clérigo em dano Radiante (salvaguarda de Constituição reduz pela metade)."
                                },
                                {
                                        level: 6,
                                        name: "Clarão Aprimorado",
                                        type: "passive",
                                        description: "Você pode estender o uso da sua Chama Protetora para proteger qualquer aliado visível a até 9 metros de você."
                                }
                        ]
                },
                {
                        id: "war",
                        name: "Domínio da Guerra",
                        description: "Comandantes marciais e capelães de aço inspirados pelos deuses da vitória, do conflito e da bravura.\n\n🛡️ O que você ganha: Proficiência com Armaduras Pesadas e Armas Marciais, Sacerdote da Guerra para desferir ataques com arma usando Ação Bônus, e Canalizar Divindade com bônus de +10 garantido no acerto.\n⚔️ O que você pode fazer: Lutar ombro a ombro na vanguarda junto aos guerreiros mais fortes, garantindo que ataques decisivos e críticos atinjam o alvo sem errar.",
                        features: [
                                {
                                        level: 3,
                                        name: "Sacerdote da Guerra (War Priest)",
                                        type: "bonus_action",
                                        description: "Ao realizar a ação Atacar, você pode desferir um ataque com arma adicional usando sua Ação Bônus (usos iguais ao Mod. Sabedoria por descanso longo)."
                                },
                                {
                                        level: 3,
                                        name: "Canalizar Divindade: Golpe Guiado",
                                        type: "reaction",
                                        description: "Ao realizar uma jogada de ataque com arma e ver o resultado, gaste seu Canalizar Divindade para adicionar um bônus devastador de +10 à jogada, garantindo acerto letal."
                                },
                                {
                                        level: 6,
                                        name: "Bênção do Deus da Guerra",
                                        type: "reaction",
                                        description: "Você pode conceder o bônus de +10 de Golpe Guiado para uma jogada de ataque realizada por um aliado visível a até 9 metros de você."
                                }
                        ]
                },
                {
                        id: "trickery",
                        name: "Domínio da Trapaça",
                        description: "Agentes divinos da astúcia, do engano e do caos fértil dos deuses velhacos e rebeldes.\n\n🛡️ O que você ganha: Bênção do Trapaceiro concedendo Vantagem em Furtividade para aliados, Duplicata Ilusória que canaliza suas próprias magias e distrai adversários, e magias furtivas (Invisibilidade, Passo Nebuloso e Imagem Maior).\n⚔️ O que você pode fazer: Flanquear inimigos com seu clone espectral, conjurar feitiços de toque à distância com segurança e liderar invasões sem ser notado.",
                        features: [
                                {
                                        level: 3,
                                        name: "Bênção do Trapaceiro",
                                        type: "action",
                                        description: "Toque uma criatura voluntária (que não seja você) para conceder-lhe Vantagem em testes de Destreza (Furtividade) por 1 hora ou até você usar novamente."
                                },
                                {
                                        level: 3,
                                        name: "Canalizar Divindade: Invocar Duplicata",
                                        type: "bonus_action",
                                        description: "Crie uma duplicata ilusória perfeita de si mesmo a até 9m por 1 minuto. Você pode movê-la 9m com ação bônus e conjurar magias como se estivesse no espaço dela. Se você e a duplicata estiverem a até 1,5m do alvo, você ganha Vantagem em jogadas de ataque contra ele."
                                },
                                {
                                        level: 6,
                                        name: "Manto das Sombras",
                                        type: "action",
                                        description: "Gaste um uso de Canalizar Divindade para ficar completamente invisível até o final do seu próximo turno ou até atacar/conjurar uma magia."
                                }
                        ]
                }
        ]
    },

    // =========================================================================
    // 5. DRUIDA (DRUID)
    // =========================================================================
    {
        id: 'druid',
        name: 'Druida',
        system: 'dnd55e',
        description: "Guardião da natureza primal que assume Formas Selvagens com ação bônus e canaliza a fúria das feras e dos mares.",
        fullDescription: "Druidas veneram as forças vitais elementais do cosmos. A Forma Selvagem é uma Ação Bônus nativa para todos os druidas e sua Ordem Primitiva define seus treinamentos no nível 1.",
        hitDie: 'd8',
        primaryAbility: 'Sabedoria',
        savingThrows: ['int', 'wis'],
        armorProficiency: ['Leve', 'Média', 'Escudos'],
        weaponProficiency: ['Simples'],
        skillChoices: {
            count: 2,
            options: ['Adestrar Animais', 'Arcanismo', 'Intuição', 'Medicina', 'Natureza', 'Percepção', 'Religião', 'Sobrevivência']
        },
        startingEquipment: [
            'Bordão', 'Armadura de Couro', 'Escudo de Madeira', 'Foco Druídico', 'Pacote de Explorador'
        ],
        features: [
            { level: 1, name: "Conjuração Primal", description: "Prepara magias da lista de Druida com Sabedoria. Rituais primais inclusos.", type: 'passive' },
            { level: 1, name: "Ordem Primitiva", description: "Escolha: Mago (conhece 1 truque extra e adiciona Mod SAB em Natureza) ou Protetor (proficiência com Armaduras Marciais e Armas Marciais).", type: 'passive' },
            { level: 2, name: "Forma Selvagem (Ação Bônus!)", description: "Com uma Ação Bônus, assuma a forma de uma fera. Ganhe PV temporários iguais ao seu nível de druida, use os ataques da fera e mantenha suas estatísticas mentais (2 usos por descanso curto ou longo).", type: 'bonus_action' },
            { level: 2, name: "Companheiro Selvagem", description: "Você pode gastar 1 uso de Forma Selvagem para conjurar Encontrar Familiar temporário.", type: 'action' },
            { level: 3, name: "Círculo Druídico (Subclasse)", description: "Escolha seu Círculo: Lua, Terra, Estrelas ou Mar.", type: 'passive' },
            { level: 5, name: "Formas Selvagens com Natação", description: "Você pode assumir formas de feras com deslocamento de natação.", type: 'passive' }
        ],
        spellcastingConfig: {
            ability: 'wis',
            cantripsKnown: 2,
            spellsKnown: 4
        },
        resources: [
            { id: 'wild_shape', name: 'Forma Selvagem', max: 2, current: 2, rechargesOn: 'short' }
        ],
        subclasses: [
                {
                        id: "moon",
                        name: "Círculo da Lua (Moon)",
                        description: "Guardiões ferozes do equilíbrio natural que combatem na forma de predadores colossais e feras primordiais.\n\n🛡️ O que você ganha: Forma Selvagem de Combate com Ação Bônus para assumir feras de grande porte com CA e PVs ampliados, cura consumindo espaços de magia em forma animal, e ataques mágicos que causam dano radiante.\n⚔️ O que você pode fazer: Atuar como o tanque devastador e resistente da linha de combate, absorvendo centenas de pontos de dano e dilacerando adversários com garras luminosas.",
                        features: [
                                {
                                        level: 3,
                                        name: "Forma Selvagem de Combate",
                                        type: "bonus_action",
                                        description: "Você pode usar Forma Selvagem como Ação Bônus. Na forma animal, sua CA mínima é 13 + Mod. Sabedoria e você ganha 3x o seu nível de Druida em pontos de vida temporários ao se transformar."
                                },
                                {
                                        level: 3,
                                        name: "Radiância Primitiva",
                                        type: "passive",
                                        description: "Seus ataques naturais em Forma Selvagem podem causar dano Radiante em vez de físico e ignoram resistências a ataques não mágicos."
                                },
                                {
                                        level: 6,
                                        name: "Recuperação Lunar na Forma",
                                        type: "bonus_action",
                                        description: "Enquanto transformado em besta, você pode gastar um espaço de magia como Ação Bônus para recuperar 1d8 de PVs por círculo do espaço gasto."
                                }
                        ]
                },
                {
                        id: "land",
                        name: "Círculo da Terra (Land)",
                        description: "Místicos sintonizados com os biomas sagrados do planeta e os fluxos telúricos da terra.\n\n🛡️ O que você ganha: Recuperação Natural para regenerar espaços de magia em descansos curtos, magias de bioma sempre preparadas (Ártico, Costa, Deserto, Floresta, Montanha ou Pântano), e travessia sem esforço por terrenos difíceis.\n⚔️ O que você pode fazer: Funcionar como um conjurador controlador de campo primário supremo, invocando tempestades, névoas e barreiras vegetais contínuas.",
                        features: [
                                {
                                        level: 3,
                                        name: "Magias da Terra (Circle Spells)",
                                        type: "passive",
                                        description: "Ao sintonizar seu bioma (Ártico, Costa, Floresta, etc.), você ganha um pacote de magias sempre preparadas que não contam no seu limite diário."
                                },
                                {
                                        level: 3,
                                        name: "Recuperação Natural (Natural Recovery)",
                                        type: "action",
                                        description: "Durante um descanso curto, você pode recuperar espaços de magia gastos cujo total de círculos somados seja menor ou igual a metade do seu nível de Druida (1x por descanso longo)."
                                },
                                {
                                        level: 6,
                                        name: "Passo da Terra (Land's Stride)",
                                        type: "passive",
                                        description: "Mover-se por terreno difícil não mágico não consome deslocamento extra, e você tem Vantagem em salvaguardas contra efeitos vegetais de aprisionamento."
                                }
                        ]
                },
                {
                        id: "stars",
                        name: "Círculo das Estrelas (Stars)",
                        description: "Astrólogos druídicos que mapeiam o cosmos e canalizam a radiância das constelações celestes.\n\n🛡️ O que você ganha: Mapa Estelar que concede Orientação e Raio Guia gratuitos, e Forma Estelar com 3 constelações distintas (Arqueiro para dano radiante extra, Cálice para cura dupla, Dragão para garantir sucesso em concentração).\n⚔️ O que você pode fazer: Alternar livremente entre um artilheiro radiante, um curandeiro potente ou uma âncora inabalável que nunca perde a concentração de suas magias.",
                        features: [
                                {
                                        level: 3,
                                        name: "Mapa Estelar Sagrado",
                                        type: "passive",
                                        description: "Você aprende o truque Orientação e pode conjurar Raio Guia (Guiding Bolt) sem gastar espaços de magia um número de vezes igual ao seu Mod. Sabedoria por descanso longo."
                                },
                                {
                                        level: 3,
                                        name: "Forma Estelar (Starry Form)",
                                        type: "bonus_action",
                                        description: "Gaste 1 Forma Selvagem para assumir uma silhueta cósmica brilhante por 10 min. Escolha: • Arqueiro: Ação Bônus para disparar flecha estelar a até 18m causando 1d8 + Mod. Sabedoria em dano Radiante. • Cálice: Ao conjurar cura, restaure 1d8 + Mod. Sabedoria adicional a outra criatura a até 9m. • Dragão: Em testes de concentração ou Sabedoria/Inteligência, rolagens menores que 9 tornam-se 10."
                                },
                                {
                                        level: 6,
                                        name: "Presságio Cósmico",
                                        type: "reaction",
                                        description: "Após descanso longo, role 1d6 (Woe ou Weal) para adicionar ou subtrair 1d6 de rolagens de ataque, salvaguardas ou testes de criaturas a até 9m."
                                }
                        ]
                },
                {
                        id: "sea",
                        name: "Círculo do Mar (Sea)",
                        description: "Druidas dos oceanos tempestuosos que comandam as marés, vendavais e a fúria das correntes marítimas.\n\n🛡️ O que você ganha: Ira do Mar emanando uma aura de água e tempestade que empurra adversários e causa dano de frio ou choque como Ação Bônus, natação veloz e respiração anfíbia.\n⚔️ O que você pode fazer: Afastar monstros corpo a corpo para longe de companheiros frágeis com jatos de alta pressão e castigar atacantes com choques elétricos constantes.",
                        features: [
                                {
                                        level: 3,
                                        name: "Ira do Mar (Wrath of the Sea)",
                                        type: "bonus_action",
                                        description: "Gaste 1 uso de Forma Selvagem para emanar uma aura tempestuosa de 3m por 10 min. Ao ativá-la e como Ação Bônus nos turnos seguintes, cause dano de Frio ou Elétrico igual a 1d6 + Mod. Sabedoria e empurre uma criatura a até 3m em 1,5m."
                                },
                                {
                                        level: 3,
                                        name: "Afinidade Aquática",
                                        type: "passive",
                                        description: "Você ganha deslocamento de natação igual ao seu deslocamento terrestre e pode respirar debaixo d'água perfeitamente."
                                },
                                {
                                        level: 6,
                                        name: "Neblina Protetora Marítima",
                                        type: "passive",
                                        description: "Sua aura tempestuosa concede meia cobertura contra ataques à distância para você e seus aliados, e o dano da tempestade sobe para 2d6."
                                }
                        ]
                }
        ]
    },

    // =========================================================================
    // 6. FEITICEIRO (SORCERER)
    // =========================================================================
    {
        id: 'sorcerer',
        name: 'Feiticeiro',
        system: 'dnd55e',
        description: "Conjurador de magia inata pura no sangue, com Feitiçaria Inata para vantagem mágica e Metamagia revolucionária.",
        fullDescription: "A magia dos feiticeiros pulsa em suas veias como uma força bruta da natureza. Possuem a característica Feitiçaria Inata (vantagem em magias) e Metamagia aprimorada.",
        hitDie: 'd6',
        primaryAbility: 'Carisma',
        savingThrows: ['con', 'cha'],
        armorProficiency: ['Nenhuma'],
        weaponProficiency: ['Simples'],
        skillChoices: {
            count: 2,
            options: ['Arcanismo', 'Enganação', 'Intimidação', 'Intuição', 'Persuasão', 'Religião']
        },
        startingEquipment: [
            'Adaga (x2)', 'Foco Arcano', 'Pacote de Masmorra', 'Roupas Simples'
        ],
        features: [
            { level: 1, name: "Feitiçaria Inata (Innate Sorcery)", description: "Com uma Ação Bônus, desperte sua centelha mágica por 1 min: você tem Vantagem em jogadas de ataque com magias de feiticeiro e a CD de suas magias aumenta em +1! (2 usos por Descanso Longo).", type: 'bonus_action' },
            { level: 1, name: "Conjuração de Feiticeiro", description: "Conjura magias inatas de feiticeiro utilizando Carisma.", type: 'passive' },
            { level: 2, name: "Fonte de Magia (Pontos de Feitiçaria)", description: "Você ganha Pontos de Feitiçaria iguais ao seu nível de feiticeiro para criar espaços de magia ou ativar Metamagia.", type: 'passive' },
            { level: 2, name: "Metamagia", description: "Escolha duas opções de Metamagia: Magia Acelerada (transforma magia de ação em Ação Bônus), Magia Sutil (sem somático/verbal), Magia Estendida, etc.", type: 'passive' },
            { level: 3, name: "Origem da Feitiçaria (Subclasse)", description: "Escolha sua Origem: Feitiçaria Dracônica, Feitiçaria Selvagem, Feitiçaria Aberrante ou Feitiçaria Mecânica.", type: 'passive' },
            { level: 5, name: "Magias de 3º Círculo", description: "Acesso a Bola de Fogo, Relâmpago e outras magias destrutivas.", type: 'passive' }
        ],
        spellcastingConfig: {
            ability: 'cha',
            cantripsKnown: 4,
            spellsKnown: 2
        },
        resources: [
            { id: 'sorcery_points', name: 'Pontos de Feitiçaria', max: 2, current: 2, rechargesOn: 'long' },
            { id: 'innate_sorcery', name: 'Feitiçaria Inata', max: 2, current: 2, rechargesOn: 'long' }
        ],
        subclasses: [
                {
                        id: "draconic",
                        name: "Feitiçaria Dracônica",
                        description: "Herdeiros diretos da majestade, das escamas e do sopro elemental dos dragões ancestrais.\n\n🛡️ O que você ganha: Resiliência Dracônica (armadura natural CA 13 + Destreza e +1 PV máximo por nível), Afinidade Elemental somando Carisma no dano das suas magias e resistência ao elemento correspondente.\n⚔️ O que você pode fazer: Atuar como um feiticeiro muito mais resistente na linha de combate, infligindo dano elemental avassalador que incinera ou congela formações inimigas.",
                        features: [
                                {
                                        level: 3,
                                        name: "Resiliência Dracônica (Draconic Resilience)",
                                        type: "passive",
                                        description: "Suas escamas aumentam seus PVs máximos em +1 por nível de Feiticeiro. Sem armadura, sua Classe de Armadura base é igual a 13 + seu Modificador de Destreza."
                                },
                                {
                                        level: 3,
                                        name: "Ancestralidade Dracônica",
                                        type: "passive",
                                        description: "Escolha seu tipo de dragão ancestral (Fogo, Frio, Relâmpago, Ácido ou Veneno). Suas magias sintonizam essa energia primordial."
                                },
                                {
                                        level: 6,
                                        name: "Afinidade Elemental (Elemental Affinity)",
                                        type: "passive",
                                        description: "Ao conjurar uma magia que cause o tipo de dano do seu dragão ancestral, adicione seu Modificador de Carisma a uma rolagem de dano da magia. Você também pode gastar 1 Ponto de Feitiçaria para ganhar resistência a esse tipo de dano por 1 hora."
                                }
                        ]
                },
                {
                        id: "wild_magic",
                        name: "Feitiçaria Selvagem",
                        description: "Conjuradores que canalizam o caos puro, cru e imprevisível que reside nas frestas da realidade.\n\n🛡️ O que você ganha: Ondas de Caos para ganhar Vantagem sob demanda em jogadas decisivas, Surto de Magia Selvagem desencadeando efeitos extraordinários (desde explosões de cura até teleporte e relâmpagos), e dobrar a sorte dos aliados.\n⚔️ O que você pode fazer: Manipular a probabilidade das rolagens para garantir acertos críticos e reverter o rumo do combate através do poder caótico imprevisível.",
                        features: [
                                {
                                        level: 3,
                                        name: "Ondas de Caos (Tides of Chaos)",
                                        type: "passive",
                                        description: "Ganhe Vantagem em uma jogada de ataque, teste de atributo ou salvaguarda à sua escolha (1x por descanso longo, ou recarrega imediatamente ao ocorrer um Surto de Magia Selvagem)."
                                },
                                {
                                        level: 3,
                                        name: "Surto de Magia Selvagem",
                                        type: "passive",
                                        description: "Ao conjurar uma magia de 1º círculo ou superior, role um d20. Se tirar 1 (ou a critério narrativo/após Ondas de Caos), role na Tabela de Magia Selvagem para desencadear um efeito mágico caótico espetacular."
                                },
                                {
                                        level: 6,
                                        name: "Dobrar a Sorte (Bend Luck)",
                                        type: "reaction",
                                        description: "Quando outra criatura fizer uma rolagem de ataque, teste ou salvaguarda, gaste 2 Pontos de Feitiçaria como Reação para rolar 1d4 e somar ou subtrair o resultado da rolagem dela."
                                }
                        ]
                },
                {
                        id: "aberrant",
                        name: "Feitiçaria Aberrante",
                        description: "Marcados pelo toque psíquico alienígena do Reino Distante ou contaminação por devoradores de mentes.\n\n🛡️ O que você ganha: Fala Telepática de longo alcance, Magias Psíquicas preparadas adicionais que podem ser conjuradas gastando Pontos de Feitiçaria sem componentes verbais ou somáticos (totalmente imperceptíveis).\n⚔️ O que você pode fazer: Lançar feitiços de controle mental bem na frente de guardas e monarcas sem ninguém perceber, e aniquilar a sanidade de oponentes com dano psíquico.",
                        features: [
                                {
                                        level: 3,
                                        name: "Fala Telepática (Telepathic Speech)",
                                        type: "bonus_action",
                                        description: "Conecte sua mente com uma criatura visível a até 9 metros. Vocês podem se comunicar telepaticamente a quilômetros de distância por minutos iguais ao seu nível."
                                },
                                {
                                        level: 3,
                                        name: "Magias da Mente Aberrante",
                                        type: "passive",
                                        description: "Você aprende Sussurros Dissonantes, Braços de Hadar, Detectar Pensamentos e Mente Calma preparadas sem ocupar espaço no limite."
                                },
                                {
                                        level: 6,
                                        name: "Feitiçaria Psíquica Sutil",
                                        type: "passive",
                                        description: "Ao conjurar magias da sua lista psíquica, pague o custo diretamente em Pontos de Feitiçaria. Ao fazer isso, a magia não exige componentes verbais, somáticos nem materiais comuns (impossível de contramagicar)."
                                }
                        ]
                },
                {
                        id: "clockwork",
                        name: "Feitiçaria Mecânica",
                        description: "Sintonizados com as engrenagens perfeitamente afinadas e a ordem cósmica imutável de Mecanus.\n\n🛡️ O que você ganha: Restaurar o Equilíbrio para anular vantagens e desvantagens de qualquer criatura com uma Reação, magias de ordem sempre preparadas (Armadura de Agathys, Auxílio, Muralha de Força), e Baluarte da Lei para forjar escudos de energia.\n⚔️ O que você pode fazer: Neutralizar bônus de monstros perigosos, proteger aliados com barreiras de dano e impor ordem absoluta no caos do combate.",
                        features: [
                                {
                                        level: 3,
                                        name: "Restaurar o Equilíbrio (Restore Balance)",
                                        type: "reaction",
                                        description: "Quando uma criatura a até 18m estiver prestes a rolar com Vantagem ou Desvantagem, use sua Reação para cancelar esse efeito, fazendo-a rolar normalmente (usos iguais ao Mod. Carisma por descanso longo)."
                                },
                                {
                                        level: 3,
                                        name: "Magias da Engrenagem Cósmica",
                                        type: "passive",
                                        description: "Você ganha Armadura de Agathys, Alarme e Auxílio preparadas sem contar no seu limite diário."
                                },
                                {
                                        level: 6,
                                        name: "Baluarte da Lei (Bastion of Law)",
                                        type: "action",
                                        description: "Gaste de 1 a 5 Pontos de Feitiçaria para erguer um escudo protetor em você ou em um aliado a até 9m. A barreira absorve dano igual aos pontos gastos multiplicados por 1d8."
                                }
                        ]
                }
        ]
    },

    // =========================================================================
    // 7. GUERREIRO (FIGHTER)
    // =========================================================================
    {
        id: 'fighter',
        name: 'Guerreiro',
        system: 'dnd55e',
        description: "Mestre marcial supremo com Maestria de Armas (3 tipos), Retomar o Fôlego multifuncional com Mente Tática e Surto de Ação lendário.",
        fullDescription: "Guerreiros dominam a técnica marcial com perfeição. Possuem 3 armas com Maestria ativa, Retomar o Fôlego com múltiplos usos que pode ser gasto para somar 1d10 em perícias (Mente Tática), e o lendário Surto de Ação.",
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
            { level: 1, name: "Estilo de Luta", description: "Escolha um estilo: Defesa (+1 CA), Duelo (+2 dano), Combate com Armas Grandes (rerrola 1 e 2 no dano), Arquearia (+2 acerto), etc.", type: 'passive' },
            { level: 1, name: "Retomar o Fôlego (2 Usos)", description: "Como Ação Bônus, recupere 1d10 + nível de guerreiro em PV. Você tem 2 usos no nv 1, recuperando 1 uso em descanso curto e todos em longo.", type: 'bonus_action' },
            { level: 1, name: "Maestria de Armas (3 Armas)", description: "Você pode usar as propriedades de maestria (Topple, Cleave, Graze, Vex, Nick, Slow, Push, Sap) de TRÊS tipos de armas simples ou marciais.", type: 'passive' },
            { level: 2, name: "Mente Tática (Tactical Mind)", description: "Se você falhar em um teste de perícia, gaste 1 uso de Retomar o Fôlego para somar 1d10 ao resultado. Se ainda assim falhar, o uso NÃO É GASTO!", type: 'passive' },
            { level: 2, name: "Surto de Ação (Action Surge)", description: "Você pode realizar uma ação adicional completa no seu turno (1/descanso curto ou longo).", type: 'action' },
            { level: 3, name: "Arquétipo Marcial (Subclasse)", description: "Escolha seu Arquétipo: Campeão, Mestre da Batalha, Cavaleiro Místico ou Combatente Psíquico.", type: 'passive' },
            { level: 5, name: "Ataque Extra", description: "Você pode atacar duas vezes em vez de uma na ação Atacar.", type: 'action' },
            { level: 5, name: "Turno Tático (Tactical Shift)", description: "Sempre que ativar Retomar o Fôlego, você pode se mover até metade do seu deslocamento sem provocar ataques de oportunidade.", type: 'passive' }
        ],
        resources: [
            { id: 'second_wind', name: 'Retomar o Fôlego', max: 2, current: 2, rechargesOn: 'short' },
            { id: 'action_surge', name: 'Surto de Ação', max: 1, current: 1, rechargesOn: 'short' }
        ],
        subclasses: [
                {
                        id: "champion",
                        name: "Campeão (Champion)",
                        description: "O ápice da perfeição atlética, precisão marcial mortal e vigor físico inabalável.\n\n🛡️ O que você ganha: Crítico Aprimorado acertando ataques decisivos em rolagens de 19 ou 20 no d20 (dobra a frequência de acertos críticos devastadores), Atleta Notável em testes físicos e saltos heróicos, e Segundo Estilo de Luta.\n⚔️ O que você pode fazer: Desferir uma torrente contínua de golpes críticos com armas pesadas ou arcos, mantendo o dano médio por rodada mais consistente e alto do grupo.",
                        features: [
                                {
                                        level: 3,
                                        name: "Crítico Aprimorado (Improved Critical)",
                                        type: "passive",
                                        description: "Suas jogadas de ataque com armas obtêm um Acerto Crítico em uma rolagem de 19 ou 20 no d20."
                                },
                                {
                                        level: 3,
                                        name: "Atleta Notável (Remarkable Athlete)",
                                        type: "passive",
                                        description: "Adicione metade do seu PB a testes de Força ou Destreza que não usem sua proficiência. Além disso, a distância de salto em comprimento e altura aumentam consideravelmente."
                                },
                                {
                                        level: 7,
                                        name: "Estilo de Luta Adicional",
                                        type: "passive",
                                        description: "Você escolhe uma segunda opção da lista de Estilos de Luta (como Defesa, Duelismo, Armas Grandes ou Arquearia)."
                                },
                                {
                                        level: 10,
                                        name: "Crítico Heróico",
                                        type: "passive",
                                        description: "Ao desferir um Acerto Crítico, você pode se mover até metade do seu deslocamento imediatamente sem provocar ataques de oportunidade."
                                }
                        ]
                },
                {
                        id: "battle_master",
                        name: "Mestre da Batalha (Battle Master)",
                        description: "Táticos de elite que tratam a luta como uma partida de xadrez militar de alta precisão.\n\n🛡️ O que você ganha: 4 Dados de Superioridade (d8) que recarregam a cada descanso curto, 3 Manobras Táticas especializadas (Riposte, Desarmar, Derrubar, Investida, Empurrão) e análise de estatísticas do inimigo.\n⚔️ O que você pode fazer: Desarmar vilões perigosos, derrubar monstros colossais para o grupo bater com vantagem e atacar fora do seu turno com reações fulminantes.",
                        features: [
                                {
                                        level: 3,
                                        name: "Superioridade em Combate",
                                        type: "passive",
                                        description: "Você ganha 4 Dados de Superioridade (d8s) recuperados em descanso curto ou longo. Gaste um dado para executar uma manobra tática ao atacar ou reagir."
                                },
                                {
                                        level: 3,
                                        name: "Três Manobras Táticas",
                                        type: "action",
                                        description: "Aprende 3 manobras: • Golpe de Derrubada: Some o d8 ao dano e o alvo deve passar em salvaguarda de Força ou cair Caído. • Riposte: Quando errarem um ataque contra você, use Reação para atacar e somar o d8 ao dano. • Empurrão: Some o d8 ao dano e empurre o alvo até 4,5m."
                                },
                                {
                                        level: 7,
                                        name: "Conhecer o Inimigo (Know Your Enemy)",
                                        type: "action",
                                        description: "Observe uma criatura por 1 minuto para descobrir se ela é superior, igual ou inferior a você em CA, PVs máximos e atributos físicos."
                                }
                        ]
                },
                {
                        id: "eldritch_knight",
                        name: "Cavaleiro Místico (Eldritch Knight)",
                        description: "Guerreiros que fundiram o treino com a espada com feitiços arcanos de Evocação e Abjuração de Mago.\n\n🛡️ O que você ganha: Conjuração Arcana com Inteligência, Vínculo com a Arma (imune a ser desarmado e invoca armas à mão como Ação Bônus à distância), e Magia Bélica para atacar ao lançar truques.\n⚔️ O que você pode fazer: Erguer sua CA a patamares invulneráveis usando a magia Escudo (Shield), punir grupos com feitiços elementais e arremessar lanças que voltam à mão voando.",
                        features: [
                                {
                                        level: 3,
                                        name: "Conjuração de Magias Arcanas",
                                        type: "passive",
                                        description: "Você aprende truques de Mago e magias de 1º círculo (focadas em Evocação e Abjuração como Escudo e Mãos Flamejantes) usando Inteligência como atributo de conjuração."
                                },
                                {
                                        level: 3,
                                        name: "Vínculo com a Arma (Weapon Bond)",
                                        type: "bonus_action",
                                        description: "Você vincula até 2 armas via ritual: você não pode ser desarmado delas e pode invocá-las para a sua mão instantaneamente como Ação Bônus de qualquer lugar do mesmo plano."
                                },
                                {
                                        level: 7,
                                        name: "Magia Bélica (War Magic)",
                                        type: "action",
                                        description: "Ao usar sua ação para conjurar um truque mágico, você pode realizar um ataque com arma corpo a corpo ou à distância como parte da mesma ação."
                                }
                        ]
                },
                {
                        id: "psi_warrior",
                        name: "Combatente Psíquico (Psi Warrior)",
                        description: "Mestres de armas que despertaram o poder da telecinésia psíquica oculta em suas mentes.\n\n🛡️ O que você ganha: Dados de Energia Psiônica (d6s) para arremessar inimigos, Campo Protetor para erguer barreiras telecinéticas de redução de dano em aliados e saltos propulsionados pela mente.\n⚔️ O que você pode fazer: Reduzir o dano sofrido por companheiros vulneráveis com uma reação e golpear alvos com dano de Força telecinética que os arremessa pelo ar.",
                        features: [
                                {
                                        level: 3,
                                        name: "Poder Psiônico (Psionic Power)",
                                        type: "passive",
                                        description: "Você ganha uma reserva de Dados Psiônicos (d6s) igual a 2x seu Bônus de Proficiência, recuperados em descanso curto ou longo."
                                },
                                {
                                        level: 3,
                                        name: "Golpe Telecinético (Psionic Strike)",
                                        type: "passive",
                                        description: "Uma vez por turno ao acertar um ataque com arma a até 9m, gaste 1 dado psiônico para infligir dano de Força extra igual à rolagem do dado + seu Modificador de Inteligência."
                                },
                                {
                                        level: 3,
                                        name: "Campo de Força Protetor",
                                        type: "reaction",
                                        description: "Quando você ou uma criatura visível a até 9m sofrer dano, use sua Reação e gaste 1 dado psiônico para reduzir o dano sofrido pela rolagem do dado + Mod. Inteligência."
                                },
                                {
                                        level: 7,
                                        name: "Salto Telecinético",
                                        type: "bonus_action",
                                        description: "Ganhe deslocamento de voo igual ao dobro do seu deslocamento de caminhada até o final do seu turno atual."
                                }
                        ]
                }
        ]
    },

    // =========================================================================
    // 8. GUARDIÃO / PATRULHEIRO (RANGER)
    // =========================================================================
    {
        id: 'ranger',
        name: 'Guardião',
        system: 'dnd55e',
        description: "Rastreador e predador das fronteiras com Marca do Caçador inata, magia primal desde o nível 1 e Maestria de Armas.",
        fullDescription: "Guardiões protegem os limites da civilização contra abominações selvagens. Possuem magias primais a partir do 1º nível, Marca do Caçador gratuita e Maestria de Armas.",
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
            'Arco Longo', 'Aljava (20 flechas)', 'Espada Curta (x2)', 'Armadura de Couro Batido', 'Pacote de Explorador'
        ],
        features: [
            { level: 1, name: "Conjuração Primal", description: "Guardiões preparam e conjuram magias desde o nível 1 utilizando Sabedoria.", type: 'passive' },
            { level: 1, name: "Inimigo Favorito (Marca do Caçador Gratuita)", description: "Você tem a magia Marca do Caçador sempre preparada e pode conjurá-la 2 vezes por descanso longo sem gastar espaços de magia.", type: 'bonus_action' },
            { level: 1, name: "Maestria de Armas", description: "Você pode invocar as propriedades de Maestria (ex: Vex, Nick, Slow) de dois tipos de armas simples ou marciais.", type: 'passive' },
            { level: 2, name: "Estilo de Luta", description: "Escolha um estilo: Arquearia (+2 ataque), Combate com Duas Armas, Defesa (+1 CA), etc.", type: 'passive' },
            { level: 2, name: "Explorador Nato (Deft Explorer)", description: "Ganhe Especialização (dobra PB) em uma perícia à sua escolha e aprenda 2 idiomas adicionais.", type: 'passive' },
            { level: 3, name: "Conclave de Patrulheiro (Subclasse)", description: "Escolha seu Conclave: Vigilante das Sombras, Caçador, Senhor das Feras ou Andarilho Feérico.", type: 'passive' },
            { level: 5, name: "Ataque Extra", description: "Você ataca duas vezes na ação Atacar.", type: 'action' }
        ],
        spellcastingConfig: {
            ability: 'wis',
            cantripsKnown: 0,
            spellsKnown: 2
        },
        subclasses: [
                {
                        id: "gloom_stalker",
                        name: "Vigilante das Sombras (Gloom Stalker)",
                        description: "Os temidos predadores e emboscadores do Subterrâneo e das trevas perpétuas.\n\n🛡️ O que você ganha: Emboscador Temível (Sabedoria somada na Iniciativa, ataque extra com dano ampliado no primeiro turno), Visão no Escuro aprimorada e Invisibilidade total contra visão no escuro.\n⚔️ O que você pode fazer: Atuar primeiro em quase todas as batalhas, eliminar sentinelas prioritárias no primeiro segundo do combate e ser um fantasma indetectável nas sombras.",
                        features: [
                                {
                                        level: 3,
                                        name: "Emboscador Temível (Dread Ambusher)",
                                        type: "passive",
                                        description: "Adicione seu Modificador de Sabedoria à jogada de Iniciativa. No primeiro turno do combate, seu deslocamento aumenta em +3m e, ao realizar a ação Atacar, faça um ataque adicional que causa +1d8 de dano extra se acertar."
                                },
                                {
                                        level: 3,
                                        name: "Visão Umbrática (Umbral Sight)",
                                        type: "passive",
                                        description: "Sua visão no escuro aumenta em +9m. Enquanto estiver na escuridão, você é completamente Invisível para qualquer criatura que dependa exclusivamente de visão no escuro para enxergar."
                                },
                                {
                                        level: 3,
                                        name: "Magias das Sombras",
                                        type: "passive",
                                        description: "Você ganha Disfarçar-se e Truque de Corda preparadas como magias adicionais de subclasse."
                                }
                        ]
                },
                {
                        id: "hunter",
                        name: "Caçador (Hunter)",
                        description: "Especialistas lendários em abater as maiores pragas do mundo: hordas de lacaios e gigantes colossais.\n\n🛡️ O que você ganha: Presa do Caçador com manobras letais (Matador de Colossos para dano extra em alvos feridos, Quebrador de Hordas para ataque livre contra inimigos adjacentes) e defesas multiataque adaptativas.\n⚔️ O que você pode fazer: Focar monstros chefes com acertos de alto calibre contínuos ou limpar enxames inteiros de lacaios com flechadas e talhadas consecutivas.",
                        features: [
                                {
                                        level: 3,
                                        name: "Presa do Caçador (Hunter's Prey)",
                                        type: "passive",
                                        description: "Escolha uma especialização: • Matador de Colossos: Uma vez por turno ao acertar com arma uma criatura que não esteja com PVs máximos, cause +1d8 de dano extra. • Quebrador de Hordas: Uma vez por turno ao atacar com arma, faça outro ataque livre contra uma criatura adjacente a até 1,5m do alvo inicial."
                                },
                                {
                                        level: 7,
                                        name: "Táticas Defensivas",
                                        type: "passive",
                                        description: "Escolha: Escapar da Horda (ataques de oportunidade contra você têm desvantagem) ou Defesa Multiataque (+4 na sua CA contra ataques seguintes da mesma criatura no mesmo turno)."
                                }
                        ]
                },
                {
                        id: "beast_master",
                        name: "Senhor das Feras (Beast Master)",
                        description: "Guardiões que compartilham um elo espiritual inquebrável com um companheiro animal primal.\n\n🛡️ O que você ganha: Companheiro Primal (Besta da Terra, do Mar ou do Céu) que evolui com seu nível e bônus de proficiência, atacando com Ação Bônus e canalizando seus feitiços.\n⚔️ O que você pode fazer: Flanquear oponentes em perfeita sintonia tática com sua fera, montá-la como montaria de combate ou enviar o falcão para vigilância e ataques aéreos.",
                        features: [
                                {
                                        level: 3,
                                        name: "Companheiro Primal (Primal Companion)",
                                        type: "action",
                                        description: "Invoque uma besta mágica primal (Terra, Céu ou Mar). Ela obedece aos seus comandos, age após o seu turno e soma seu Bônus de Proficiência e Modificador de Sabedoria em suas estatísticas."
                                },
                                {
                                        level: 3,
                                        name: "Comando de Combate",
                                        type: "bonus_action",
                                        description: "Use sua Ação Bônus para comandar sua besta a Atacar, Disparar, Desengajar ou Ajudar. Se você não der ordens, ela se defende automaticamente."
                                },
                                {
                                        level: 7,
                                        name: "Ataques Mágicos da Fera",
                                        type: "passive",
                                        description: "Os ataques da sua besta contam como mágicos para superar resistências e imunidades a dano físico."
                                }
                        ]
                },
                {
                        id: "fey_wanderer",
                        name: "Andarilho Feérico (Fey Wanderer)",
                        description: "Caçadores abençoados pelo glamour e astúcia hipnótica da corte feérica.\n\n🛡️ O que você ganha: Presença Feérica que adiciona Sabedoria em todos os testes de Carisma (Persuasão, Intimidação, Enganação), Golpe Terrível causando dano psíquico extra a cada inimigo atingido por turno, e resistência a encantos.\n⚔️ O que você pode fazer: Ser o diplomata astuto do grupo sem perder a agressividade nas selvas, desferindo dano mental constante em múltiplos alvos e refletindo magias de charme nos inimigos.",
                        features: [
                                {
                                        level: 3,
                                        name: "Presença do Outro Mundo",
                                        type: "passive",
                                        description: "Ganhe proficiência em Enganação, Performance ou Persuasão. Além disso, sempre que realizar qualquer teste de Carisma, adicione seu Modificador de Sabedoria ao resultado."
                                },
                                {
                                        level: 3,
                                        name: "Golpes Terríveis (Dreadful Strikes)",
                                        type: "passive",
                                        description: "Ao acertar uma criatura com arma, cause +1d4 de dano Psíquico extra. Você pode causar esse dano uma vez por turno para cada criatura diferente que acertar."
                                },
                                {
                                        level: 7,
                                        name: "Torção Feérica (Beguiling Twist)",
                                        type: "reaction",
                                        description: "Vantagem contra ser Enfeitiçado ou Amedrontado. Se qualquer criatura a até 36m tiver sucesso contra tais efeitos, use sua Reação para forçar outra criatura a passar em salvaguarda de Sabedoria ou ficar Enfeitiçada/Amedrontada por você."
                                }
                        ]
                }
        ]
    },

    // =========================================================================
    // 9. LADINO (ROGUE)
    // =========================================================================
    {
        id: 'rogue',
        name: 'Ladino',
        system: 'dnd55e',
        description: "Mestre da furtividade, perícia incomparável, Ataque Furtivo letal e os novos Golpes Ladinos (Cunning Strike).",
        fullDescription: "Ladinos exploram qualquer fraqueza do oponente com astúcia. Utilizam Ataque Furtivo, Ação Astuta e os novos Golpes Ladinos (Cunning Strike) no nível 5 para desarmar, derrubar ou envenenar sacrificando dados de furtivo.",
        hitDie: 'd8',
        primaryAbility: 'Destreza',
        savingThrows: ['dex', 'int'],
        armorProficiency: ['Leve'],
        weaponProficiency: ['Simples', 'Marciais com propriedade Acuidade ou Leve (Rapiers, Espadas Curtas, Bestas)'],
        skillChoices: {
            count: 4,
            options: ['Acrobacia', 'Atletismo', 'Atuação', 'Enganação', 'Furtividade', 'Intimidação', 'Intuição', 'Investigação', 'Percepção', 'Persuasão', 'Prestidigitação']
        },
        startingEquipment: [
            'Rapieira', 'Arco Curto', 'Aljava (20 flechas)', 'Armadura de Couro', 'Adaga (x2)', 'Ferramentas de Ladrão', 'Pacote de Assaltante'
        ],
        features: [
            { level: 1, name: "Ataque Furtivo (1d6)", description: "Uma vez por turno ao acertar com arma de acuidade ou à distância tendo Vantagem ou aliado a 1,5m do alvo, cause +1d6 de dano extra (escala a cada 2 níveis).", type: 'passive' },
            { level: 1, name: "Especialização (2 Perícias)", description: "Dobre seu Bônus de Proficiência em duas perícias à sua escolha (ou 1 perícia e ferramentas de ladrão).", type: 'passive' },
            { level: 1, name: "Gíria de Ladrão", description: "Conhece o dialeto secreto dos submundo do crime e uma língua exótica adicional.", type: 'passive' },
            { level: 1, name: "Maestria de Armas (2 Armas)", description: "Pode usar as propriedades de Maestria de 2 tipos de armas (como Vex em rapieira ou Nick em adagas).", type: 'passive' },
            { level: 2, name: "Ação Astuta (Cunning Action)", description: "Com uma Ação Bônus, você pode realizar a ação Disparada, Desengajar ou Esconder-se.", type: 'bonus_action' },
            { level: 3, name: "Arquétipo Ladino (Subclasse)", description: "Escolha seu Arquétipo: Assassino, Ladrão, Trapaceiro Arcano ou Adaga Espiritual.", type: 'passive' },
            { level: 5, name: "Esquiva Sobrenatural (Uncanny Dodge)", description: "Como Reação ao sofrer dano de um ataque visível, reduza esse dano pela metade.", type: 'reaction' },
            { level: 5, name: "Golpe Ladino (Cunning Strike)", description: "Ao acertar Ataque Furtivo, você pode subtrair dados de dano para aplicar efeitos: Desarmar (sacrifica 1d6; alvo salva FOR ou solta arma), Derrubar (sacrifica 1d6; salva DES ou cai Caído) ou Envenenar (sacrifica 1d6; salva CON ou fica Envenenado por 1 min).", type: 'passive' }
        ],
        subclasses: [
                {
                        id: "thief",
                        name: "Ladrão (Thief)",
                        description: "Mestres supremos da agilidade incomparável, mãos leves e arrombamento relâmpago.\n\n🛡️ O que você ganha: Mãos Rápidas para beber poções, usar objetos mágicos, arrombar fechaduras e desarmar armadilhas usando Ação Bônus, escalada veloz sem custo de movimento, e furtividade impecável.\n⚔️ O que você pode fazer: Ativar poções de cura, jogar bombas ou disparar pergaminhos com ação bônus enquanto desfere Ataque Furtivo letal no mesmo turno.",
                        features: [
                                {
                                        level: 3,
                                        name: "Mãos Rápidas (Fast Hands)",
                                        type: "bonus_action",
                                        description: "Use a Ação Bônus da Ação Astuta para: fazer teste de Prestidigitação, usar Ferramentas de Ladrão para desarmar armadilhas/fechaduras OU realizar a ação Usar um Objeto."
                                },
                                {
                                        level: 3,
                                        name: "Gatuno de Telhado (Second-Story Work)",
                                        type: "passive",
                                        description: "Escalar superfícies não consome movimento adicional. Além disso, a distância de salto em comprimento com corrida aumenta em metros iguais ao seu Modificador de Destreza."
                                },
                                {
                                        level: 9,
                                        name: "Furtividade Suprema",
                                        type: "passive",
                                        description: "Você ganha Vantagem em testes de Destreza (Furtividade) se não se mover mais do que a metade do seu deslocamento no turno."
                                }
                        ]
                },
                {
                        id: "assassin",
                        name: "Assassino (Assassin)",
                        description: "Executores gélidos que dominam a arte dos venenos letais, infiltração sob disfarce e abates fulminantes.\n\n🛡️ O que você ganha: Assassinato (Vantagem contra qualquer criatura que ainda não agiu e acerto crítico automático garantido em inimigos Surpresos), proficiência com Kit de Disfarce e Kit de Envenenador.\n⚔️ O que você pode fazer: Iniciar o combate eliminando o comandante adversário com um único golpe crítico letal e infiltrar-se em bastiões sob identidades falsas inatacáveis.",
                        features: [
                                {
                                        level: 3,
                                        name: "Assassinato (Assassinate)",
                                        type: "passive",
                                        description: "Você tem Vantagem em jogadas de ataque contra qualquer criatura que ainda não tenha agido no combate. Qualquer acerto que desferir contra uma criatura Surpreendida é um Acerto Crítico automático."
                                },
                                {
                                        level: 3,
                                        name: "Ferramentas do Ofício",
                                        type: "passive",
                                        description: "Você ganha proficiência com o Kit de Disfarce e com o Kit de Envenenador."
                                },
                                {
                                        level: 9,
                                        name: "Infiltração Especializada",
                                        type: "action",
                                        description: "Você consegue criar identidades falsas impecáveis com histórico, documentos e conexões que resistem a qualquer investigação ordinária."
                                }
                        ]
                },
                {
                        id: "arcane_trickster",
                        name: "Trapaceiro Arcano (Arcane Trickster)",
                        description: "Ladinos brilhantes que combinam destreza de dedos com feitiços arcanos das escolas de Ilusão e Encantamento.\n\n🛡️ O que você ganha: Mão Mágica Legerdemain invisível capaz de bater carteiras e destrancar portas à distância, conjuração com Inteligência de truques e magias arcanas de Mago, e emboscada mágica.\n⚔️ O que você pode fazer: Roubar chaves de guardas a 9m de distância, criar distrações visuais ilusórias e escapar com Passo Nebuloso após golpear furtivamente.",
                        features: [
                                {
                                        level: 3,
                                        name: "Conjuração de Trapaceiro",
                                        type: "passive",
                                        description: "Aprenda truques de Mago (incluindo Mão Mágica) e magias de 1º círculo (focadas em Ilusão e Encantamento) usando Inteligência como atributo de conjuração."
                                },
                                {
                                        level: 3,
                                        name: "Mão Mágica Invisível (Mage Hand Legerdemain)",
                                        type: "bonus_action",
                                        description: "Sua Mão Mágica é invisível. Como Ação Bônus, use-a para desarmar armadilhas e abrir fechaduras à distância, ou furtar objetos de recipientes inimigos."
                                },
                                {
                                        level: 9,
                                        name: "Emboscada Mágica (Magical Ambush)",
                                        type: "passive",
                                        description: "Se estiver escondido de uma criatura ao conjurar uma magia sobre ela, o alvo terá Desvantagem em qualquer salvaguarda contra essa magia neste turno."
                                }
                        ]
                },
                {
                        id: "soulknife",
                        name: "Adaga Espiritual (Soulknife)",
                        description: "Espiões mentais que manifestam lâminas letais de puro pensamento luminoso cintilante a partir das mãos.\n\n🛡️ O que você ganha: Lâminas Psíquicas que surgem na mão livre causando dano psíquico puro com alcance de arremesso de 18m, Dados de Poder Psiônico para salvar testes de perícia que falhariam e rede de telepatia mental sussurrada entre aliados.\n⚔️ O que você pode fazer: Nunca ser desarmado, infiltrar-se em fortalezas sem armas de metal e executar alvos sem deixar ferimentos físicos ou vestígios de sangue.",
                        features: [
                                {
                                        level: 3,
                                        name: "Lâminas Psíquicas (Psychic Blades)",
                                        type: "action",
                                        description: "Ao atacar, materialize uma lâmina de energia mental na mão livre. Causa 1d6 de dano Psíquico (+ Mod. Destreza) com propriedade Acuidade e Arremesso (18m). Não deixa vestígios físicos."
                                },
                                {
                                        level: 3,
                                        name: "Talento Psiônico (Psi-Bolstered Knack)",
                                        type: "passive",
                                        description: "Ao falhar em um teste de perícia com proficiência, gaste 1 dado psiônico (d6) para adicionar o valor à rolagem; se ainda falhar, o dado NÃO é gasto."
                                },
                                {
                                        level: 3,
                                        name: "Conexão Psíquica Sussurrada",
                                        type: "action",
                                        description: "Estabeleça um link telepático seguro entre você e um grupo de aliados a até 1,5 km por horas iguais ao resultado de 1 dado psiônico."
                                }
                        ]
                }
        ]
    },

    // =========================================================================
    // 10. MAGO (WIZARD)
    // =========================================================================
    {
        id: 'wizard',
        name: 'Mago',
        system: 'dnd55e',
        description: "Pesquisador escolástico supremo da manipulação arcana, com Grimório, rituais universais e especialização no nível 3.",
        fullDescription: "Magos moldam a trama arcana do multiverso com estudo rigoroso e cálculos esotéricos. Possuem rituais universais, Recuperação Arcana e escolhem sua Ordem Acadêmica no nível 3.",
        hitDie: 'd6',
        primaryAbility: 'Inteligência',
        savingThrows: ['int', 'wis'],
        armorProficiency: ['Nenhuma'],
        weaponProficiency: ['Simples'],
        skillChoices: {
            count: 2,
            options: ['Arcanismo', 'História', 'Intuição', 'Investigação', 'Medicina', 'Religião']
        },
        startingEquipment: [
            'Bordão', 'Bolsa de Componentes', 'Pacote de Estudioso', 'Grimório', 'Adaga'
        ],
        features: [
            { level: 1, name: "Conjuração Arcana (Grimório)", description: "Você possui um Grimório com 6 magias de 1º círculo. Conjura magias preparadas e rituais sem precisar prepará-los.", type: 'passive' },
            { level: 1, name: "Recuperação Arcana", description: "Uma vez por dia após um Descanso Curto, recupere espaços de magia gastos com soma de níveis igual a até metade do seu nível de mago.", type: 'action' },
            { level: 2, name: "Memorizar Magia", description: "Ao terminar um Descanso Curto, você pode consultar seu grimório e trocar uma de suas magias preparadas por outra do livro.", type: 'passive' },
            { level: 3, name: "Ordem Acadêmica / Tradição (Subclasse)", description: "Escolha sua Tradição Arcana: Evocação, Abjuração, Adivinhação ou Ilusão.", type: 'passive' },
            { level: 5, name: "Magias Arcanas de 3º Círculo", description: "Acesso a Bola de Fogo, Contramágica, Dissipar Magia e Voo.", type: 'passive' }
        ],
        spellcastingConfig: {
            ability: 'int',
            cantripsKnown: 3,
            spellsKnown: 6
        },
        subclasses: [
                {
                        id: "evocation",
                        name: "Escola de Evocação (Evocation)",
                        description: "Mestres absolutos das energias primordiais da destruição: bolas de fogo, nevascas e relâmpagos.\n\n🛡️ O que você ganha: Esculpir Magias para abrir bolsões de segurança perfeita (aliados dentro de Bolas de Fogo e Tempestades não sofrem dano algum), Truque Potente para causar dano mesmo se o alvo passar no teste, e dano potencializado.\n⚔️ O que você pode fazer: Lançar as maiores magias destrutivas da mesa sem medo de atingir seus companheiros que lutam corpo a corpo.",
                        features: [
                                {
                                        level: 3,
                                        name: "Esculpir Magias (Sculpt Spells)",
                                        type: "passive",
                                        description: "Ao conjurar magias de Evocação de área, escolha até (1 + círculo da magia) criaturas visíveis. Elas passam automaticamente na salvaguarda e não sofrem dano algum se normalmente sofreriam metade."
                                },
                                {
                                        level: 6,
                                        name: "Truque Potente (Potent Cantrip)",
                                        type: "passive",
                                        description: "Quando uma criatura for bem-sucedida em uma salvaguarda contra um de seus truques, ela ainda sofre metade do dano normal (em vez de nenhum dano)."
                                },
                                {
                                        level: 10,
                                        name: "Evocação Potencializada",
                                        type: "passive",
                                        description: "Adicione seu Modificador de Inteligência a uma rolagem de dano de qualquer magia de evocação de mago que você conjurar."
                                }
                        ]
                },
                {
                        id: "abjuration",
                        name: "Escola de Abjuração (Abjuration)",
                        description: "Protetores arcanos dedicados a erguer escudos mágicos impenetráveis, banir maldições e anular feitiços inimigos.\n\n🛡️ O que você ganha: Proteção Arcana (Arcane Ward) que absorve dano antes dos seus PVs serem tocados e regenera ao lançar abjurações, projetar sua proteção em aliados, e bônus em Contramágica e Dissipar Magia.\n⚔️ O que você pode fazer: Atuar como o mago mais resistente da mesa, anulando os maiores feitiços dos conjuradores oponentes e defendendo companheiros feridos.",
                        features: [
                                {
                                        level: 3,
                                        name: "Proteção Arcana (Arcane Ward)",
                                        type: "passive",
                                        description: "Ao conjurar uma magia de Abjuração, crie uma barreira com PVs iguais a (2x nível de Mago + Mod. Inteligência). Ela absorve todo o dano sofrido por você. Ao conjurar novas abjurações, ela recupera 2x o círculo da magia em PVs."
                                },
                                {
                                        level: 6,
                                        name: "Proteção Projetada (Projected Ward)",
                                        type: "reaction",
                                        description: "Quando uma criatura visível a até 9m sofrer dano, use sua Reação para fazer sua Proteção Arcana interceptar o dano no lugar dela."
                                },
                                {
                                        level: 10,
                                        name: "Abjuração Aprimorada",
                                        type: "passive",
                                        description: "Ao fazer testes de atributo para Contramágica ou Dissipar Magia, adicione seu Bônus de Proficiência à rolagem."
                                }
                        ]
                },
                {
                        id: "divination",
                        name: "Escola de Adivinhação (Divination)",
                        description: "Videntes e astrólogos que rasgam o véu do tempo para manipular as rolagens do destino.\n\n🛡️ O que você ganha: Portento (Preságio) permitindo rolar dois d20s no início do dia e substituir rolagens de ataque, teste ou salvaguarda de QUALQUER criatura por esses resultados fixos, e recuperar espaços de magia menores ao lançar adivinhações.\n⚔️ O que você pode fazer: Forçar um chefe inimigo a falhar automaticamente em um feitiço de paralisia mortal ou garantir que o golpe crítico do paladino atinja o monstro sem errar.",
                        features: [
                                {
                                        level: 3,
                                        name: "Portento / Preságio (Portent)",
                                        type: "passive",
                                        description: "Após descanso longo, role 2 dados d20. Você pode substituir qualquer jogada de ataque, salvaguarda ou teste realizado por você ou criatura visível por um dos dados antes da rolagem ser feita (recarrega em descanso longo)."
                                },
                                {
                                        level: 6,
                                        name: "Adivinho Especialista (Expert Divination)",
                                        type: "passive",
                                        description: "Ao conjurar uma magia de Adivinhação de 2º círculo ou superior, recupere um espaço de magia gasto de círculo inferior ao conjurado (máximo 5º círculo)."
                                },
                                {
                                        level: 10,
                                        name: "O Terceiro Olho",
                                        type: "action",
                                        description: "Ganhe visão no escuro de 18m, visão etérea ou leitura de qualquer idioma até seu próximo descanso."
                                }
                        ]
                },
                {
                        id: "illusion",
                        name: "Escola de Ilusão (Illusion)",
                        description: "Mestres do engano visual e sensorial que dobram a luz e o som para criar fantasmas que se tornam tangíveis.\n\n🛡️ O que você ganha: Ilusão Menor aprimorada combinando som e imagem em um único truque com Ação Bônus, Maleabilidade Ilusória para alterar a natureza de ilusões ativas, e criar duplos ilusórios defensivos.\n⚔️ O que você pode fazer: Enganar sentinelas, criar coberturas falsas impenetráveis e desviar ataques mortais com duplos ilusórios instantâneos.",
                        features: [
                                {
                                        level: 3,
                                        name: "Ilusão Menor Aprimorada",
                                        type: "passive",
                                        description: "Aprenda Ilusão Menor. Ao conjurá-lo, crie simultaneamente som e imagem em vez de apenas um deles. Pode conjurá-lo como Ação Bônus."
                                },
                                {
                                        level: 6,
                                        name: "Maleabilidade Ilusória (Malleable Illusions)",
                                        type: "action",
                                        description: "Ao conjurar uma magia de Ilusão com duração de 1 min ou mais, use sua Ação para alterar completamente a natureza e aparência da ilusão ativa."
                                },
                                {
                                        level: 10,
                                        name: "Eu Ilusório Defensivo",
                                        type: "reaction",
                                        description: "Quando uma criatura realizar um ataque contra você, crie um duplo ilusório instantâneo que faz o ataque errar automaticamente (1 uso por descanso curto)."
                                }
                        ]
                }
        ]
    },

    // =========================================================================
    // 11. MONGE (MONK)
    // =========================================================================
    {
        id: 'monk',
        name: 'Monge',
        system: 'dnd55e',
        description: "Mestre marcial que domina artes marciais desarmadas (d6 no nv 1!), Foco místico e Aparar Ataques contra corpo a corpo e à distância.",
        fullDescription: "Monges canalizam a energia do próprio corpo e espírito. Seu dado de artes marciais começa em d6, Aparar Ataques funciona contra ataques corpo a corpo e projéteis, e seus recursos de Foco são mais fluidos.",
        hitDie: 'd8',
        primaryAbility: 'Destreza e Sabedoria',
        savingThrows: ['str', 'dex'],
        armorProficiency: ['Nenhuma'],
        weaponProficiency: ['Simples', 'Marciais com propriedade Leve'],
        skillChoices: {
            count: 2,
            options: ['Acrobacia', 'Atletismo', 'História', 'Intuição', 'Religião', 'Furtividade']
        },
        startingEquipment: [
            'Lança', 'Dardo (x10)', 'Pacote de Explorador'
        ],
        features: [
            { level: 1, name: "Artes Marciais (1d6)", description: "Use Destreza para ataques e dano desarmado. Seu dano desarmado é 1d6 (escala para d8, d10, d12). Pode fazer um ataque desarmado extra com Ação Bônus ao usar a ação Atacar.", type: 'passive' },
            { level: 1, name: "Defesa Sem Armadura", description: "Sua CA é 10 + Mod DES + Mod SAB quando você não estiver usando nenhuma armadura nem escudo.", type: 'passive' },
            { level: 2, name: "Foco do Monge (Pontos de Foco)", description: "Você ganha Pontos de Foco iguais ao seu nível: Golpe de Rajada (2 ataques desarmados extras com bônus), Defesa Paciente (Esquiva com bônus) e Passo do Vento (Disparada e Desengajar com bônus). Recupera em Descanso Curto.", type: 'passive' },
            { level: 2, name: "Movimento Sem Armadura", description: "Seu deslocamento aumenta em +3 metros enquanto estiver sem armadura.", type: 'passive' },
            { level: 3, name: "Aparar Ataques (Deflect Attacks)", description: "Como Reação ao sofrer dano de um ataque corpo a corpo ou à distância, reduza o dano em 1d10 + Mod DES + nível de monge. Se zerar o dano, pode gastar 1 ponto de foco para rebater o ataque!", type: 'reaction' },
            { level: 3, name: "Tradição Monástica (Subclasse)", description: "Escolha sua Ordem: Mão Espalmada, Sombras, Misericórdia ou Elementos.", type: 'passive' },
            { level: 5, name: "Ataque Extra", description: "Você ataca duas vezes na ação Atacar.", type: 'action' },
            { level: 5, name: "Golpe Atordoante (Stunning Strike)", description: "Ao acertar com arma ou desarmado, gaste 1 Ponto de Foco: o alvo faz salvaguarda de CON ou fica Atordoado até seu próximo turno (se passar, seu deslocamento cai pela metade).", type: 'action' }
        ],
        resources: [
            { id: 'focus_points', name: 'Pontos de Foco', max: 2, current: 2, rechargesOn: 'short' }
        ],
        subclasses: [
                {
                        id: "open_hand",
                        name: "Combatente da Mão Espalmada",
                        description: "Mestres tradicionais do controle corporal absoluto e manipulação do fluxo de energia Ki desarmada.\n\n🛡️ O que você ganha: Técnica da Mão Espalmada adicionando efeitos extras aos golpes da Rajada de Golpes (derrubar Caído, empurrar 4,5m ou bloquear reações do alvo), cura do próprio corpo e controle físico supremo.\n⚔️ O que você pode fazer: Tirar reações de monstros para aliados fugirem com segurança, arremessar oponentes de despenhadeiros e controlar todo o posicionamento do combate corpo a corpo.",
                        features: [
                                {
                                        level: 3,
                                        name: "Técnica da Mão Espalmada (Open Hand)",
                                        type: "passive",
                                        description: "Ao acertar uma criatura com a Rajada de Golpes, imponha um efeito: • Derrubar: Passa em salvaguarda de Destreza ou cai Caído. • Empurrar: Passa em salvaguarda de Força ou é empurrado até 4,5m. • Bloquear Reação: Não pode fazer reações até o fim do seu próximo turno."
                                },
                                {
                                        level: 6,
                                        name: "Plenitude do Corpo (Wholeness of Body)",
                                        type: "action",
                                        description: "Como uma Ação, recupere pontos de vida iguais a 3x o seu nível de Monge (1 uso por descanso longo)."
                                },
                                {
                                        level: 11,
                                        name: "Tranquilidade Sagrada",
                                        type: "passive",
                                        description: "Você ganha o efeito da magia Santuário ao final de cada descanso longo."
                                }
                        ]
                },
                {
                        id: "shadow",
                        name: "Combatente das Sombras",
                        description: "Ninjas místicos e assassinos silenciosos que dominam o poder da escuridão e da Umbra.\n\n🛡️ O que você ganha: Artes das Sombras para conjurar Escuridão mágica enxergando perfeitamente dentro dela, Passo das Sombras para se teleportar de sombra a sombra a até 18m com Ação Bônus e ganhar Vantagem no ataque.\n⚔️ O que você pode fazer: Surgir pelas costas de arqueiros e magos inimigos no escuro, cegar formações adversárias e desaparecer sem deixar rastros.",
                        features: [
                                {
                                        level: 3,
                                        name: "Artes das Sombras (Shadow Arts)",
                                        type: "action",
                                        description: "Gaste 1 Ponto de Foco para conjurar a magia Escuridão (podendo movê-la). Você consegue enxergar perfeitamente dentro da escuridão criada por essa magia. Aprende também o truque Ilusão Menor."
                                },
                                {
                                        level: 6,
                                        name: "Passo das Sombras (Shadow Step)",
                                        type: "bonus_action",
                                        description: "Em penumbra ou escuridão, use sua Ação Bônus para se teleportar até 18m para outro ponto em penumbra ou escuridão. Seu primeiro ataque corpo a corpo antes do fim do turno ganha Vantagem."
                                },
                                {
                                        level: 11,
                                        name: "Manto das Sombras",
                                        type: "action",
                                        description: "Em penumbra ou escuridão, fique completamente invisível até atacar ou conjurar uma magia."
                                }
                        ]
                },
                {
                        id: "mercy",
                        name: "Combatente da Misericórdia",
                        description: "Médicos marciais tradicionais que usam máscaras simbólicas para manipular as energias da vida e da morte.\n\n🛡️ O que você ganha: Mãos Curativas para restaurar vida de aliados substituindo um golpe desarmado da Rajada de Golpes, Mãos do Dano para causar dano necrótico extra e curar doenças e condições debilitantes.\n⚔️ O que você pode fazer: Atuar como o suporte médico ágil do grupo, curando aliados caídos durante seus combos desarmados sem desperdiçar seu potencial ofensivo.",
                        features: [
                                {
                                        level: 3,
                                        name: "Mãos Curativas (Hands of Healing)",
                                        type: "action",
                                        description: "Gaste 1 Ponto de Foco para tocar uma criatura e curar PVs iguais ao seu Dado de Artes Marciais + Mod. Sabedoria. Ao usar Rajada de Golpes, substitua um ataque por esta cura sem gastar foco extra."
                                },
                                {
                                        level: 3,
                                        name: "Mãos do Dano (Hands of Harm)",
                                        type: "passive",
                                        description: "Ao acertar ataque desarmado, gaste 1 Ponto de Foco para causar dano Necrótico extra igual ao seu Dado de Artes Marciais + Mod. Sabedoria."
                                },
                                {
                                        level: 6,
                                        name: "Toque do Médico Restaurador",
                                        type: "passive",
                                        description: "Suas Mãos Curativas também removem uma doença ou a condição Cego, Surdo, Paralisado, Envenenado ou Atordoado do alvo."
                                }
                        ]
                },
                {
                        id: "elements",
                        name: "Combatente dos Elementos",
                        description: "Mestres que canalizam a fúria primordial dos quatro elementos: fogo, terra, gelo e tempestade.\n\n🛡️ O que você ganha: Afinidade Elemental estendendo o alcance dos seus golpes desarmados para 4,5m com dano trocado para Fogo, Frio, Ácido, Elétrico ou Trovão, empurrar ou puxar oponentes pelo cenário e deslocamento aéreo.\n⚔️ O que você pode fazer: Atacar inimigos à distância segura com chicotes flamejantes ou correntes de choque, arrastando alvos pelo cenário de batalha.",
                        features: [
                                {
                                        level: 3,
                                        name: "Afinidade Elemental (Elemental Attunement)",
                                        type: "bonus_action",
                                        description: "Gaste 1 Ponto de Foco para se infundir por 10 min. Seus ataques desarmados têm alcance ampliado em +3 metros (total 4,5m) e causam dano de Ácido, Frio, Fogo, Relâmpago ou Trovão."
                                },
                                {
                                        level: 3,
                                        name: "Manipulação Ambiental",
                                        type: "passive",
                                        description: "Ao acertar um golpe elemental com alcance ampliado, puxe o alvo até 3 metros para perto de você ou empurre-o até 3 metros para longe."
                                },
                                {
                                        level: 6,
                                        name: "Salto Elemental",
                                        type: "passive",
                                        description: "Você ganha deslocamento de voo e natação igual ao seu deslocamento de caminhada enquanto sua Afinidade Elemental estiver ativa."
                                }
                        ]
                }
        ]
    },

    // =========================================================================
    // 12. PALADINO (PALADIN)
    // =========================================================================
    {
        id: 'paladin',
        name: 'Paladino',
        system: 'dnd55e',
        description: "Guerreiro sagrado jurado à justiça cósmica, com Imposição das Mãos como Ação Bônus, magia no nível 1 e Punição Divina (Smite).",
        fullDescription: "Paladinos canalizam a força pura de seus juramentos sagrados. Imposição das Mãos é uma Ação Bônus nativa, conjuram magias desde o nível 1 e Punição Divina é uma magia verbal de ação bônus castada no impacto.",
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
            'Espada Longa', 'Escudo', 'Azagaia (x5)', 'Cota de Malha', 'Símbolo Sagrado', 'Pacote de Sacerdote'
        ],
        features: [
            { level: 1, name: "Conjuração Sagrada", description: "Paladinos preparam e conjuram magias divinas desde o nível 1 com Carisma.", type: 'passive' },
            { level: 1, name: "Imposição das Mãos (Ação Bônus!)", description: "Com uma Ação Bônus, cure criaturas tocadas usando uma reserva de 5x nível de paladino em PVs, ou gaste 5 pontos para purificar a condição Envenenado.", type: 'bonus_action' },
            { level: 1, name: "Maestria de Armas", description: "Pode usar propriedades de maestria de dois tipos de armas à sua escolha.", type: 'passive' },
            { level: 2, name: "Estilo de Luta", description: "Escolha um estilo: Defesa (+1 CA), Duelo (+2 dano), Armas Grandes ou Guerreiro Abençoado (ganha 2 truques de clérigo).", type: 'passive' },
            { level: 2, name: "Punição Divina (Divine Smite)", description: "Ao acertar um ataque corpo a corpo, você pode conjurar Punição Divina com Ação Bônus causando +2d8 de dano Radiante extra (+1d8 por círculo acima do 1º).", type: 'bonus_action' },
            { level: 3, name: "Canalizar Divindade (2/descanso)", description: "Canaliza poder sagrado para Sentido Divino (detecta celestiais, ínferos e mortos-vivos) e poderes do juramento.", type: 'action' },
            { level: 3, name: "Juramento Sagrado (Subclasse)", description: "Escolha seu Juramento: Devoção, Glória, Anciões ou Vingança.", type: 'passive' },
            { level: 5, name: "Ataque Extra", description: "Você ataca duas vezes na ação Atacar.", type: 'action' },
            { level: 5, name: "Montaria Fiel (Find Steed Grátis)", description: "Você tem a magia Montaria Fiel sempre preparada e pode conjurá-la 1 vez por Descanso Longo sem gastar espaço de magia.", type: 'action' }
        ],
        spellcastingConfig: {
            ability: 'cha',
            cantripsKnown: 0,
            spellsKnown: 2
        },
        resources: [
            { id: 'lay_on_hands', name: 'Imposição das Mãos (PV)', max: 5, current: 5, rechargesOn: 'long' },
            { id: 'channel_divinity', name: 'Canalizar Divindade', max: 2, current: 2, rechargesOn: 'short' }
        ],
        subclasses: [
                {
                        id: "devotion",
                        name: "Juramento da Devoção (Devotion)",
                        description: "O nobre paladino clássico da honra sagrada, retidão inquebrável e luz divina.\n\n🛡️ O que você ganha: Canalizar Divindade: Arma Sagrada somando Carisma no ataque com luz brilhante e dano radiante, Aura de Devoção que torna você e aliados imunes a encantamento mental, e magias de proteção sagrada.\n⚔️ O que você pode fazer: Liderar a vanguarda com acertos de alta precisão cirúrgica de Punição Divina e impedir que demônios e feiticeiros controlem a mente do seu pelotão.",
                        features: [
                                {
                                        level: 3,
                                        name: "Canalizar Divindade: Arma Sagrada",
                                        type: "action",
                                        description: "Imbua uma arma com energia divina por 10 min: ela emite luz em 6m, você adiciona seu Modificador de Carisma em todas as jogadas de ataque realizadas com ela (mínimo +1) e o dano torna-se Radiante."
                                },
                                {
                                        level: 3,
                                        name: "Magias do Juramento da Devoção",
                                        type: "passive",
                                        description: "Você tem Santuário e Proteção contra o Bem e Mal preparadas como magias sagradas de juramento."
                                },
                                {
                                        level: 7,
                                        name: "Aura de Devoção (Aura of Devotion)",
                                        type: "passive",
                                        description: "Você e criaturas aliadas a até 3 metros de você são completamente imunes a ficarem Enfeitiçadas enquanto você estiver consciente."
                                }
                        ]
                },
                {
                        id: "glory",
                        name: "Juramento da Glória (Glory)",
                        description: "Heróis lendários inspirados pelo triunfo atlético épico, superação de limites e feitos heróicos divinos.\n\n🛡️ O que você ganha: Atleta Incomparável para vantagens físicas e saltos monumentais, Golpe Inspirador distribuindo PVs temporários ao grupo com Punição Divina, e Aura de Rapidez acelerando todo o grupo.\n⚔️ O que você pode fazer: Investir a velocidades relâmpago contra chefes, saltando por cima de trincheiras e mantendo a vitalidade do time alta com escudos de glória.",
                        features: [
                                {
                                        level: 3,
                                        name: "Canalizar Divindade: Atleta Incomparável",
                                        type: "bonus_action",
                                        description: "Ganhe Vantagem em testes de Atletismo e Acrobacia por 10 minutos, dobre a distância de todos os saltos e reduza em 3m o custo de movimento para se levantar de caído."
                                },
                                {
                                        level: 3,
                                        name: "Golpe Inspirador (Inspiring Smite)",
                                        type: "reaction",
                                        description: "Após desferir uma Punição Divina (Divine Smite), use seu Canalizar Divindade para distribuir PVs temporários iguais a 2d8 + seu nível de Paladino entre aliados a até 9m."
                                },
                                {
                                        level: 7,
                                        name: "Aura de Rapidez (Aura of Alacrity)",
                                        type: "passive",
                                        description: "O deslocamento de caminhada de você e de todos os aliados que iniciarem o turno a até 3 metros de você aumenta em +3 metros."
                                }
                        ]
                },
                {
                        id: "ancients",
                        name: "Juramento dos Anciões (Ancients)",
                        description: "Cavaleiros Verdes dedicados a preservar o amor, a alegria, a luz e a santidade da natureza viva.\n\n🛡️ O que você ganha: Ira da Natureza para prender alvos em vinhas espectrais espinhosas, Aura de Proteção Mística concedendo Resistência a TODO dano de magias para você e aliados, e magias druídicas (Passo Nebuloso e Fogo das Fadas).\n⚔️ O que você pode fazer: Formar a barreira anti-magia mais resistente do jogo, cortando pela metade o impacto de Bolas de Fogo e feitiços hostis no grupo.",
                        features: [
                                {
                                        level: 3,
                                        name: "Canalizar Divindade: Ira da Natureza",
                                        type: "action",
                                        description: "Invoque vinhas espectrais contra um alvo a até 9m: ele deve passar em salvaguarda de Força ou Destreza contra sua CD ou ficará Aprisionado (Restrained) até se libertar."
                                },
                                {
                                        level: 3,
                                        name: "Expulsar os Infiéis",
                                        type: "action",
                                        description: "Canalize energia ancestral para expulsar fadas e corruptores (fiends) como se fossem mortos-vivos."
                                },
                                {
                                        level: 7,
                                        name: "Aura Protetora Arcana (Aura of Warding)",
                                        type: "passive",
                                        description: "Você e criaturas aliadas a até 3 metros de você ganham Resistência a todo o dano causado por magias."
                                }
                        ]
                },
                {
                        id: "vengeance",
                        name: "Juramento da Vingança (Vengeance)",
                        description: "Cavaleiros implacáveis que juraram punir os maiores vilões e monstros a qualquer custo.\n\n🛡️ O que você ganha: Voto de Inimizade concedendo VANTAGEM em todos os ataques contra o alvo escolhido por 1 minuto, Caçador Implacável perseguindo alvos em fuga com Reação, e magias de caça (Marca do Caçador, Passo Nebuloso e Imobilizar Pessoa).\n⚔️ O que você pode fazer: Focar o monstro mais perigoso da luta com 100% de precisão e acertar críticos devastadores repletos de Punição Divina sem permitir sua fuga.",
                        features: [
                                {
                                        level: 3,
                                        name: "Canalizar Divindade: Voto de Inimizade",
                                        type: "bonus_action",
                                        description: "Aponte para uma criatura a até 9 metros: ganhe Vantagem em todas as jogadas de ataque realizadas contra ela por 1 minuto ou até ela ser reduzida a 0 PVs."
                                },
                                {
                                        level: 3,
                                        name: "Poder Abjurador",
                                        type: "action",
                                        description: "Aterrorize uma criatura a até 18m; se falhar em salvaguarda de Sabedoria, seu deslocamento se torna 0 e ela fica Amedrontada por 1 minuto."
                                },
                                {
                                        level: 7,
                                        name: "Vingador Implacável (Relentless Avenger)",
                                        type: "reaction",
                                        description: "Ao acertar uma criatura com um ataque de oportunidade, mova-se até metade do seu deslocamento como parte da reação sem provocar novos ataques."
                                }
                        ]
                }
        ]
    },

    // =========================================================================
    // 13. BRUXO / THE WITCHER (PRESERVADO INTEGRALMENTE - ADAPTADO 5E)
    // =========================================================================
    {
        id: 'witcher',
        name: 'Bruxo',
        system: 'witcher',
        description: "Um caçador de monstros profissional, mutante e treinado da Prova das Ervas com espadas de aço/prata, toxicidade de poções e sinais.",
        fullDescription: "Bruxos passam pela dolorosa Prova das Ervas, tornando-se mutantes com reflexos inumanos e resistência química. Empunham duas espadas (aço para homens, prata para monstros), preparam óleos e elixires alquímicos e canalizam os cinco sinais arcanos clássicos (Aard, Igni, Quen, Yrden, Axii).",
        hitDie: 'd10',
        primaryAbility: 'Destreza ou Força',
        savingThrows: ['dex', 'wis'],
        armorProficiency: ['Leve', 'Média'],
        weaponProficiency: ['Simples', 'Marciais', 'Espada de Prata'],
        skillChoices: {
            count: 3,
            options: ['Acrobacia', 'Atletismo', 'Arcanismo', 'Investigação', 'Natureza', 'Percepção', 'Sobrevivência', 'Intimidação']
        },
        startingEquipment: [
            'Espada de Prata', 'Espada de Aço', 'Kit de Alquimia', 'Poção Andorinha (x2)', 'Armadura de Couro Batido'
        ],
        features: [
            { level: 1, name: "Treinamento de Kaer Morhen", description: "Proficiência com espadas longas, de prata e armaduras leves/médias.", type: 'passive' },
            { level: 1, name: "Medalhão de Bruxo", description: "Seu medalhão vibra avisando sobre a presença de magia, anomalias e monstros a até 18 metros.", type: 'passive' },
            { level: 1, name: "Sinais de Bruxo", description: "Você pode conjurar os 5 sinais básicos (Aard para empurrão cinético, Igni para fogo, Quen para escudo protetor, Yrden para armadilha mágica e Axii para confusão mental) utilizando Vigor ou Sabedoria.", type: 'action' },
            { level: 1, name: "Escola de Bruxo", description: "Escolha sua Escola de Bruxo: Lobo, Gato, Urso, Grifo ou Víbora.", type: 'passive' },
            { level: 2, name: "Alquimia de Combate", description: "Você pode beber ou aplicar um elixir alquímico como uma Ação Bônus em combate.", type: 'bonus_action' },
            { level: 5, name: "Ataque Extra", description: "Você pode atacar duas vezes por ação Atacar.", type: 'action' }
        ],
        spellcastingConfig: {
            ability: 'wis',
            cantripsKnown: 5,
            spellsKnown: 2
        },
        resources: [
            { id: 'toxicity', name: 'Toxicidade', max: 100, current: 0, rechargesOn: 'short' }
        ],
        subclasses: [
                {
                        id: "school_wolf",
                        name: "Escola do Lobo",
                        description: "A tradição versátil e pragmática de Kaer Morhen, lar lendário de Geralt e Vesemir.\n\n🛡️ O que você ganha: Postura da Espada de Aço e Prata, encadeamento de Sinais de Bruxo como Ação Bônus logo após acertar ataques de espada, e vantagem em iniciativa.\n⚔️ O que você pode fazer: Executar combos rápidos de esgrima seguidos imediatamente de jatos de fogo Igni ou explosões cinéticas Aard para derrubar monstros vulneráveis.",
                        startingEquipment: [
                                "Armadura de Couro Batido",
                                "Poção Raio"
                        ],
                        features: [
                                {
                                        level: 3,
                                        name: "Esgrima Versátil de Kaer Morhen",
                                        type: "passive",
                                        description: "Ao empunhar uma espada longa ou espada de prata, você pode alternar livremente entre postura rápida (+1 no ataque e pode usar Destreza) e postura forte (+2 no dano com Força)."
                                },
                                {
                                        level: 3,
                                        name: "Canalização Fluida de Sinais",
                                        type: "bonus_action",
                                        description: "Imediatamente após acertar um ataque corpo a corpo com espada, você pode conjurar um Sinal de Bruxo simples usando sua Ação Bônus em vez de sua Ação padrão."
                                },
                                {
                                        level: 6,
                                        name: "Instinto de Predador",
                                        type: "passive",
                                        description: "Você ganha Vantagem em jogadas de iniciativa e não pode ser surpreendido enquanto estiver consciente."
                                }
                        ]
                },
                {
                        id: "school_cat",
                        name: "Escola do Gato",
                        description: "Assassinos letais, acrobatas sobre-humanos e duelistas ágeis especializados em lâminas leves.\n\n🛡️ O que você ganha: Deslocamento veloz com armaduras leves, ataques críticos em rolagens de 19 ou 20 com armas leves/acuidade, e reflexos para desviar de ataques.\n⚔️ O que você pode fazer: Saltar pelas costas de monstros colossais, escapar de armadilhas e desferir golpes cortantes cirúrgicos em alta cadência.",
                        startingEquipment: [
                                "Armadura de Couro",
                                "Besta de Mão",
                                "Virotes (x20)"
                        ],
                        features: [
                                {
                                        level: 3,
                                        name: "Dança da Lâmina Felina",
                                        type: "passive",
                                        description: "Seu deslocamento aumenta em +3 metros enquanto estiver de armadura leve. Suas jogadas de ataque com armas de acuidade obtêm Acerto Crítico em rolagens de 19 ou 20 no d20."
                                },
                                {
                                        level: 3,
                                        name: "Reflexos Felinos",
                                        type: "reaction",
                                        description: "Ao ser alvo de um ataque corpo a corpo que você possa ver, use sua Reação para adicionar seu Bônus de Proficiência à sua CA contra aquele ataque."
                                },
                                {
                                        level: 6,
                                        name: "Passo Fantasma",
                                        type: "bonus_action",
                                        description: "Você pode usar Desengajar e Disparada simultaneamente como Ação Bônus no mesmo turno."
                                }
                        ]
                },
                {
                        id: "school_bear",
                        name: "Escola do Urso",
                        description: "Guerreiros colossais de Skellige acostumados a armaduras pesadas e escudos Quen reforçados.\n\n🛡️ O que você ganha: Proficiência com Armaduras Pesadas, +2 PVs máximos adicionais por nível de Bruxo, e fortificação do Sinal Quen que devolve dano ao romper.\n⚔️ O que você pode fazer: Lutar na vanguarda suportando o impacto frontal de monstros titânicos como Grifos, Fiascos e Dragões sem recuar um milímetro.",
                        startingEquipment: [
                                "Cota de Malha",
                                "Poção Lua Superior"
                        ],
                        features: [
                                {
                                        level: 3,
                                        name: "Vigor de Ursídeo",
                                        type: "passive",
                                        description: "Você ganha proficiência com Armaduras Pesadas. Seus pontos de vida máximos aumentam em +2 para cada nível de Bruxo que você possui (incluindo retroativamente)."
                                },
                                {
                                        level: 3,
                                        name: "Quen Fortificado",
                                        type: "bonus_action",
                                        description: "Ao ativar o Sinal Quen, a barreira protetora absorve 5 PVs adicionais por nível. Ao se romper, explode em estilhaços causando dano de concussão aos inimigos a até 1,5m."
                                },
                                {
                                        level: 6,
                                        name: "Inércia Inabalável",
                                        type: "passive",
                                        description: "Você não pode ser empurrado, derrubado ou movido contra sua vontade por criaturas de tamanho Grande ou menor."
                                }
                        ]
                },
                {
                        id: "school_griffin",
                        name: "Escola do Grifo",
                        description: "Bruxos eruditos que elevaram o domínio dos Sinais Mágicos a um nível comparável ao dos magos de corte.\n\n🛡️ O que você ganha: Intensidade aumentada de todos os Sinais somando Inteligência ao dano e salvaguardas, e capacidade de disparar dois Sinais no mesmo turno.\n⚔️ O que você pode fazer: Lançar vagas consecutivas de fogo com Igni, armadilhas mágicas Yrden e barreiras defensivas em alta frequência.",
                        startingEquipment: [
                                "Meia-Armadura",
                                "Cristal de Foco"
                        ],
                        features: [
                                {
                                        level: 3,
                                        name: "Intensidade dos Sinais (Sign Intensity)",
                                        type: "passive",
                                        description: "A CD de salvaguarda de todos os seus Sinais de Bruxo aumenta em +1, e você adiciona seu Modificador de Inteligência às rolagens de dano de Sinais (como Igni e Aard)."
                                },
                                {
                                        level: 3,
                                        name: "Fluxo de Vigor Acelerado",
                                        type: "passive",
                                        description: "Sua reserva de Vigor mágico regenera com o dobro da velocidade fora de combate e recarrega 1 uso adicional por descanso curto."
                                },
                                {
                                        level: 6,
                                        name: "Eco de Sinais",
                                        type: "bonus_action",
                                        description: "Ao conjurar um Sinal como sua Ação, você pode gastar vigor para conjurar um segundo Sinal diferente como Ação Bônus no mesmo turno."
                                }
                        ]
                },
                {
                        id: "school_viper",
                        name: "Escola da Víbora",
                        description: "Assassinos clandestinos especialistas em venenos paralisantes, lâminas gêmeas e anatomia das feras.\n\n🛡️ O que você ganha: Proficiência com Kit de Envenenador e Disfarce, aplicar óleos e venenos em armas com Ação Bônus, e dano venenoso extra que debilita oponentes.\n⚔️ O que você pode fazer: Estudar as fraquezas da presa, cobrir suas adagas em óleos mortais rapidamente e enfraquecer monstros com cortes nos pontos vitais.",
                        startingEquipment: [
                                "Corselete de Couro",
                                "Adaga (x2)",
                                "Veneno de Lagarto"
                        ],
                        features: [
                                {
                                        level: 3,
                                        name: "Toxicologia da Víbora",
                                        type: "bonus_action",
                                        description: "Ganhe proficiência com o Kit de Envenenador e Kit de Disfarce. Você pode aplicar Óleos de Bruxo ou Venenos em suas armas como Ação Bônus."
                                },
                                {
                                        level: 3,
                                        name: "Mordida Venenosa",
                                        type: "passive",
                                        description: "Seus ataques com armas envenenadas causam +1d6 de dano de Veneno extra. Criaturas envenenadas por você têm Desvantagem em testes de ataque e salvaguardas de Força."
                                },
                                {
                                        level: 6,
                                        name: "Anatomia Crítica",
                                        type: "passive",
                                        description: "Você adiciona seu Bônus de Proficiência ao dano contra alvos sob o efeito de Óleos específicos para a sua categoria biológica."
                                }
                        ]
                }
        ]
    }
];
