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
                id: 'berserker',
                name: 'Trilha do Berserker',
                description: 'Violência desmedida e fúria desenfreada.',
                features: [
                    { level: 3, name: "Frenesi Furioso", description: "Uma vez por turno ao acertar um alvo com Ataque Descuidado em Fúria, cause +2d6 de dano adicional do tipo da arma." },
                    { level: 6, name: "Fúria Insensível", description: "Enquanto estiver em Fúria, você é imune às condições Enfeitiçado e Amedrontado." }
                ]
            },
            {
                id: 'wild_heart',
                name: 'Trilha do Coração Selvagem',
                description: 'Conexão xamânica com espíritos de animais e feras.',
                features: [
                    { level: 3, name: "Coração Furioso (Fera)", description: "Na Fúria, escolha: Urso (resistência a todo dano exceto Psíquico), Águia (Disparada e Desengajar com bônus) ou Lobo (vantagem para aliados em ataques corpo a corpo)." }
                ]
            },
            {
                id: 'world_tree',
                name: 'Trilha da Árvore do Mundo',
                description: 'Canaliza as raízes protetoras e cósmicas de Yggdrasil.',
                features: [
                    { level: 3, name: "Vitalidade da Árvore", description: "Ao entrar em Fúria, ganhe PVs temporários iguais ao seu nível de bárbaro. No início de cada turno, conceda PV temporários a um aliado a até 3m." }
                ]
            },
            {
                id: 'zealot',
                name: 'Trilha do Fanático',
                description: 'Guerreiro sagrado tocado pela fúria divina dos deuses.',
                features: [
                    { level: 3, name: "Fúria Divina", description: "O primeiro alvo que acertar em cada turno durante a Fúria sofre +1d6 + metade do nível de bárbaro em dano Radiante ou Necrótico." },
                    { level: 3, name: "Guerreiro dos Deuses", description: "Magias para ressuscitá-lo não exigem componentes materiais caros." }
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
                id: 'lore',
                name: 'Colégio do Conhecimento (Lore)',
                description: 'Colecionador de segredos arcanos e enigmas do multiverso.',
                features: [
                    { level: 3, name: "Palavras Cortantes", description: "Como Reação ao ver uma criatura a até 18m rolar um d20 de ataque, teste ou dano, gaste 1 uso de Inspiração para subtrair o dado rolado do total dela." },
                    { level: 3, name: "Perícias Bônus", description: "Ganhe proficiência em 3 perícias adicionais à sua escolha." }
                ]
            },
            {
                id: 'valor',
                name: 'Colégio da Bravura (Valor)',
                description: 'Contador de sagas heroicas e combatente de linha de frente.',
                features: [
                    { level: 3, name: "Treinamento Marcial", description: "Proficiência com Armaduras Médias, Escudos e Armas Marciais." },
                    { level: 3, name: "Inspiração em Combate", description: "Criaturas com sua inspiração podem adicionar o dado à CA contra um ataque ou à jogada de dano de uma arma." }
                ]
            },
            {
                id: 'dance',
                name: 'Colégio da Dança',
                description: 'Ritmo hipnótico corporal, passos ágeis e combate desarmado.',
                features: [
                    { level: 3, name: "Movimento Deslumbrante", description: "CA = 10 + Mod DES + Mod CAR quando sem armadura e sem escudo. Seus ataques desarmados causam dano igual ao dado de Inspiração de Bardo." }
                ]
            },
            {
                id: 'glamour',
                name: 'Colégio do Glamour',
                description: 'Magia hipnótica da corte feérica e beleza avassaladora.',
                features: [
                    { level: 3, name: "Manto de Inspiração", description: "Gaste 1 uso de Inspiração como ação bônus para conceder 5 PVs temporários a até PB aliados a 18m, permitindo que eles se movam imediatamente sem provocar oportunidade." }
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
                id: 'fiend',
                name: 'Patrono Ínfero (Fiend)',
                description: 'Pacto com arquidemônios ou lordes diabólicos dos Nove Infernos.',
                features: [
                    { level: 3, name: "Bênção do Obscuro", description: "Ao reduzir um inimigo a 0 PV, ganhe Pontos de Vida Temporários iguais ao seu Mod. de Carisma + nível de bruxo." },
                    { level: 6, name: "Sorte do Próprio Obscuro", description: "Adicione 1d10 a um teste de atributo ou salvaguarda após ver o resultado (1/descanso curto ou longo)." }
                ]
            },
            {
                id: 'archfey',
                name: 'Patrono Arquifada (Archfey)',
                description: 'Pacto com nobres das cortes de verão e inverno de Faerie.',
                features: [
                    { level: 3, name: "Passos Enevoado Feérico", description: "Você tem Passo Enevoado preparado gratuitamente e pode conjurá-lo PB vezes por descanso longo com efeitos de névoa taumatúrgica." }
                ]
            },
            {
                id: 'celestial',
                name: 'Patrono Celestial',
                description: 'Pacto com solares, unicórnios ou serafins sagrados.',
                features: [
                    { level: 3, name: "Luz Curativa", description: "Você possui uma reserva de d6s igual a 1 + nível de bruxo. Com ação bônus, gaste dados para curar uma criatura a até 18m." }
                ]
            },
            {
                id: 'great_old_one',
                name: 'Patrono O Grande Antigo',
                description: 'Pacto com entidades cósmicas insondáveis do Reino Distante.',
                features: [
                    { level: 3, name: "Mente Desperta", description: "Telepatia bidirecional com qualquer criatura visível a até 9 metros, independente do idioma." }
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
                id: 'life',
                name: 'Domínio da Vida',
                description: 'Focado em cura radiante e preservação da vida.',
                features: [
                    { level: 3, name: "Discípulo da Vida", description: "Suas magias de cura de 1º círculo ou superior recuperam +2 + nível da magia em PV adicionais ao alvo." },
                    { level: 3, name: "Preservar a Vida", description: "Gaste Canalizar Divindade para restaurar uma reserva de 5x nível de clérigo em PV entre aliados feridos em área de 9m." }
                ]
            },
            {
                id: 'light',
                name: 'Domínio da Luz',
                description: 'Poder solar, labaredas purificadoras e fogo divino.',
                features: [
                    { level: 3, name: "Labareda Protetora", description: "Como Reação ao ser atacado por criatura a até 9m, imponha Desvantagem no ataque dela usando luz cegante." },
                    { level: 3, name: "Radiância do Amanhecer", description: "Dispare uma explosão de luz solar de 9m que dissipa escuridão mágica e causa 2d10 + nível em dano Radiante." }
                ]
            },
            {
                id: 'war',
                name: 'Domínio da Guerra',
                description: 'Batalha campal sagrada e glória marcial dos deuses.',
                features: [
                    { level: 3, name: "Sacerdote da Guerra", description: "Ao usar a ação Atacar, você pode realizar um ataque com arma adicional usando Ação Bônus (usos = Mod SAB/dia)." },
                    { level: 3, name: "Golpe Guiado", description: "Adicione +10 a uma jogada de ataque sua ou de aliado próximo usando Canalizar Divindade." }
                ]
            },
            {
                id: 'trickery',
                name: 'Domínio da Trapaça',
                description: 'Ilusões, subterfúgios divinos e ironia do destino.',
                features: [
                    { level: 3, name: "Bênção do Trapaceiro", description: "Toque um aliado voluntário para conceder-lhe Vantagem contínua em testes de Furtividade." },
                    { level: 3, name: "Invocar Duplicata", description: "Com ação bônus, crie uma cópia ilusória perfeita com Canalizar Divindade para conjurar magias e distrair inimigos." }
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
                id: 'moon',
                name: 'Círculo da Lua (Moon)',
                description: 'Especialista supremo em combate feroz na Forma Selvagem.',
                features: [
                    { level: 3, name: "Formas de Combate", description: "CA em Forma Selvagem é 13 + Mod SAB. Seus PV temporários em Forma Selvagem são triplicados (3x nível de druida), e seus ataques causam dano Radiante." }
                ]
            },
            {
                id: 'land',
                name: 'Círculo da Terra (Land)',
                description: 'Mestres de biomas específicos e magia ambiental.',
                features: [
                    { level: 3, name: "Recuperação Natural", description: "Recupera espaços de magia gastos durante um Descanso Curto (metade do nível de druida)." },
                    { level: 3, name: "Auxílio da Terra", description: "Magias temáticas de Ártico, Costa, Deserto ou Floresta sempre preparadas." }
                ]
            },
            {
                id: 'stars',
                name: 'Círculo das Estrelas (Stars)',
                description: 'Astrônomos e místicos que desenham constelações vivas.',
                features: [
                    { level: 3, name: "Forma Estelar", description: "Gaste Forma Selvagem para assumir constelação luminosa: Arqueiro (disparo com ação bônus), Cálice (cura extra) ou Dragão (salvaguardas confiáveis)." }
                ]
            },
            {
                id: 'sea',
                name: 'Círculo do Mar (Sea)',
                description: 'Fúria das marés, tempestades costeiras e ondas devastadoras.',
                features: [
                    { level: 3, name: "Ira do Mar", description: "Emana uma aura de tempestade de 3m que chicoteia inimigos com dano de Gelo ou Trovão e os empurra 4,5m." }
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
            spellsKnown: 4
        },
        resources: [
            { id: 'sorcery_points', name: 'Pontos de Feitiçaria', max: 2, current: 2, rechargesOn: 'long' },
            { id: 'innate_sorcery', name: 'Feitiçaria Inata', max: 2, current: 2, rechargesOn: 'long' }
        ],
        subclasses: [
            {
                id: 'draconic',
                name: 'Feitiçaria Dracônica',
                description: 'Sangue de dragões antigos com escamas duras e asas.',
                features: [
                    { level: 3, name: "Resiliência Dracônica", description: "Sua CA sem armadura é 10 + Mod DES + Mod CAR, e seus PV máximos aumentam em +1 por nível de feiticeiro." }
                ]
            },
            {
                id: 'wild_magic',
                name: 'Feitiçaria Selvagem',
                description: 'Caos cósmico descontrolado e surtos imprevisíveis.',
                features: [
                    { level: 3, name: "Marés do Caos", description: "Ganhe Vantagem em uma jogada de d20 à sua escolha; recupera quando o Mestre disparar um Surto de Magia Selvagem (1d100)." }
                ]
            },
            {
                id: 'aberrant',
                name: 'Feitiçaria Aberrante',
                description: 'Mente psíquica alterada por entidades psíquicas e horrores cósmicos.',
                features: [
                    { level: 3, name: "Telepatia Psíquica", description: "Crie um elo telepático com uma criatura a até 9 metros. Conjure magias psíquicas sem componentes usando pontos de feitiçaria." }
                ]
            },
            {
                id: 'clockwork',
                name: 'Feitiçaria Mecânica',
                description: 'A ordem primordial e a simetria cósmica de Mechanus.',
                features: [
                    { level: 3, name: "Restauração da Ordem", description: "Como Reação ao ver uma criatura a 18m rolar com Vantagem ou Desvantagem, anule esse modificador na rolagem dela." }
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
                id: 'champion',
                name: 'Campeão (Champion)',
                description: 'Focado em força física, acertos críticos brutais e heroísmo.',
                features: [
                    { level: 3, name: "Crítico Aprimorado", description: "Seus ataques com armas acertam crítico em jogadas de 19 ou 20 no d20." },
                    { level: 3, name: "Atleta Notável", description: "Adicione seu Bônus de Proficiência a testes de iniciativa e saltos." }
                ]
            },
            {
                id: 'battle_master',
                name: 'Mestre da Batalha (Battle Master)',
                description: 'Estrategista marcial mestre com Dados de Superioridade e manobras.',
                features: [
                    { level: 3, name: "Manobras de Combate (4d8)", description: "Você tem 4 Dados de Superioridade d8 para manobras como Desarmar, Riposta, Derrubar, Finta e Ataque de Precisão." }
                ]
            },
            {
                id: 'eldritch_knight',
                name: 'Cavaleiro Místico (Eldritch Knight)',
                description: 'Combina maestria com armas com magia de Mago.',
                features: [
                    { level: 3, name: "Arma Vinculada", description: "Vincule-se ritualmente a uma arma para invocá-la instantaneamente na sua mão como ação bônus." },
                    { level: 3, name: "Conjuração de Mago", description: "Aprende truques e magias preparadas de Mago com Inteligência." }
                ]
            },
            {
                id: 'psi_warrior',
                name: 'Combatente Psíquico (Psi Warrior)',
                description: 'Guerreiro que amplifica seus golpes e escudos com poder telecinético.',
                features: [
                    { level: 3, name: "Poder Telecinético", description: "Reserva de Dados de Energia Psiônica d6 para Golpe Telecinético (+dano) e Campo de Proteção (-dano de aliados)." }
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
                id: 'gloom_stalker',
                name: 'Vigilante das Sombras (Gloom Stalker)',
                description: 'Especialista em emboscadas sombrias e túneis do Subterrâneo.',
                features: [
                    { level: 3, name: "Emboscador Medonho", description: "Adicione seu Mod. de Sabedoria à sua jogada de iniciativa. No seu primeiro turno de combate, ganhe +3m de deslocamento e faça um ataque extra causando +1d8 de dano." },
                    { level: 3, name: "Visão Umbral", description: "Visão no Escuro aumentada em +9m (ou 18m). Você é invisível para criaturas que dependem de visão no escuro para enxergá-lo na escuridão." }
                ]
            },
            {
                id: 'hunter',
                name: 'Caçador (Hunter)',
                description: 'Mestre no abatimento de monstros gigantescos e hordas.',
                features: [
                    { level: 3, name: "Presa do Caçador", description: "Matador de Colossos: Uma vez por turno ao acertar uma criatura com PV abaixo do máximo, cause +1d8 de dano extra." }
                ]
            },
            {
                id: 'beast_master',
                name: 'Senhor das Feras (Beast Master)',
                description: 'Companheiro animal leal que luta em perfeita sincronia.',
                features: [
                    { level: 3, name: "Fera Primitiva", description: "Invoque uma besta da terra, do céu ou do mar. Ela age no seu comando usando sua Ação Bônus ou substituindo um dos seus ataques." }
                ]
            },
            {
                id: 'fey_wanderer',
                name: 'Andarilho Feérico (Fey Wanderer)',
                description: 'Navega nos limites do Reino Feérico com presença sedutora.',
                features: [
                    { level: 3, name: "Golpes Medonhos", description: "Seus ataques causam +1d4 de dano Psíquico adicional. Você adiciona Mod SAB em testes de Carisma." }
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
                id: 'thief',
                name: 'Ladrão (Thief)',
                description: 'Mãos incrivelmente rápidas, acrobata de telhados e uso de itens mágicos.',
                features: [
                    { level: 3, name: "Mãos Rápidas", description: "Use Ferramentas de Ladrão, bater carteiras ou a ação Usar Objeto com uma Ação Bônus." },
                    { level: 3, name: "Trabalho no Segundo Andar", description: "Escalar superfícies não custa movimento extra e distância de salto baseada em Destreza." }
                ]
            },
            {
                id: 'assassin',
                name: 'Assassino (Assassin)',
                description: 'Especialista em venenos letais, emboscadas e disfarces perfeitos.',
                features: [
                    { level: 3, name: "Assassinar", description: "Você tem Vantagem em ataques contra qualquer criatura que ainda não tenha agido no combate. No primeiro turno, acertos causam dano adicional igual ao seu nível de ladino." }
                ]
            },
            {
                id: 'arcane_trickster',
                name: 'Trapaceiro Arcano (Arcane Trickster)',
                description: 'Combina furtividade ladina com ilusões e encantos de Mago.',
                features: [
                    { level: 3, name: "Mãos Mágicas Ladinas", description: "Sua mão espectral é invisível e pode destrancar portas e bater carteiras à distância." },
                    { level: 3, name: "Conjuração Arcana", description: "Conjura magias de Ilusão e Encantamento de Mago utilizando Inteligência." }
                ]
            },
            {
                id: 'soulknife',
                name: 'Adaga Espiritual (Soulknife)',
                description: 'Manifesta lâminas de pura energia psíquica mental.',
                features: [
                    { level: 3, name: "Lâminas Psíquicas", description: "Manifeste adagas de energia psíquica brilhante (dano 1d6 psíquico) que desaparecem após o acerto." },
                    { level: 3, name: "Dados de Poder Psíquico", description: "Dados d6 para somar em perícias falhas e estabelecer telepatia com aliados." }
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
        weaponProficiency: ['Adagas', 'Dardos', 'Fundas', 'Bordões', 'Bestas Leves'],
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
                id: 'evocation',
                name: 'Escola de Evocação (Evocation)',
                description: 'Especialista em manipular energias elementais catastróficas.',
                features: [
                    { level: 3, name: "Escultor de Magias", description: "Crie bolsões de segurança ao conjurar magias de área (ex: Bola de Fogo): aliados escolhidos passam automaticamente na salvaguarda e não sofrem nenhum dano." }
                ]
            },
            {
                id: 'abjuration',
                name: 'Escola de Abjuração (Abjuration)',
                description: 'Mestres de barreiras protetoras, escudos arcanos e dissipação.',
                features: [
                    { level: 3, name: "Proteção Arcana", description: "Ao conjurar magia de abjuração, crie uma barreira mágica com PVs iguais a 2x nível de mago + Mod INT que absorve dano direcionado a você." }
                ]
            },
            {
                id: 'divination',
                name: 'Escola de Adivinhação (Divination)',
                description: 'Manipuladores do tempo, presciência e linhas do destino.',
                features: [
                    { level: 3, name: "Portento", description: "Ao terminar um Descanso Longo, role dois d20s e anote os resultados. Você pode substituir qualquer d20 futuro (seu, de aliado ou de inimigo) por um desses números gravados!" }
                ]
            },
            {
                id: 'illusion',
                name: 'Escola de Ilusão (Illusion)',
                description: 'Tece miragens, cópias fantasmagóricas e enganos sensoriais perfeitos.',
                features: [
                    { level: 3, name: "Ilusão Aprimorada", description: "Conhece Ilusão Menor com som e imagem simultâneos. Pode conjurá-la como Ação Bônus." }
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
        weaponProficiency: ['Simples', 'Espadas Curtas'],
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
                id: 'open_hand',
                name: 'Combatente da Mão Espalmada',
                description: 'Controle absoluto do campo de batalha com golpes nos meridianos.',
                features: [
                    { level: 3, name: "Técnica da Mão Espalmada", description: "Ao acertar com Golpe de Rajada, escolha: derrubar o inimigo Caído, empurrá-lo 4,5m ou impedi-lo de realizar reações." }
                ]
            },
            {
                id: 'shadow',
                name: 'Combatente das Sombras',
                description: 'Ninjas místicos que tecem escuridão e teleporte sombrio.',
                features: [
                    { level: 3, name: "Artes das Sombras", description: "Gaste foco para conjurar Escuridão (enxergando através dela), Passos Sem Pegadas ou Ilusão Menor." }
                ]
            },
            {
                id: 'mercy',
                name: 'Combatente da Misericórdia',
                description: 'Médicos do ki que curam com um toque e drenam a vida com outro.',
                features: [
                    { level: 3, name: "Mãos da Cura e Dano", description: "Gaste 1 Ponto de Foco para restaurar 1d6 + SAB em um aliado ou causar dano Necrótico extra ao atingir um golpe." }
                ]
            },
            {
                id: 'elements',
                name: 'Combatente dos Elementos',
                description: 'Canaliza chamas, raios, gelo e ventanias primordiais.',
                features: [
                    { level: 3, name: "Sintonização Elemental", description: "Golpes desarmados ganham alcance de 4,5m e causam dano de Ácido, Frio, Fogo ou Eletricidade." }
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
                id: 'devotion',
                name: 'Juramento da Devoção (Devotion)',
                description: 'Ideal supremo de cavaleiro sagrado em armadura brilhante.',
                features: [
                    { level: 3, name: "Arma Sagrada", description: "Com Ação Bônus usando Canalizar Divindade, adicione Mod CAR às jogadas de ataque com sua arma por 1 minuto; ela brilha com luz solar e causa dano Radiante." }
                ]
            },
            {
                id: 'glory',
                name: 'Juramento da Glória (Glory)',
                description: 'Proezas físicas épicas, destino glorioso e heroísmo atlético.',
                features: [
                    { level: 3, name: "Atleta Incomparável", description: "Vantagem em testes de Atletismo e Acrobacia, e distância de salto aumentada." },
                    { level: 3, name: "Golpe Inspirador", description: "Ao acertar com Punição Divina, conceda 2d8 + nível em PV temporários a aliados a até 9m." }
                ]
            },
            {
                id: 'ancients',
                name: 'Juramento dos Anciões (Ancients)',
                description: 'Cavaleiros da luz féerica e protetores da beleza do mundo.',
                features: [
                    { level: 3, name: "Ira da Natureza", description: "Com Canalizar Divindade, invoque vinhas espectrais para aprisionar uma criatura a até 9m." }
                ]
            },
            {
                id: 'vengeance',
                name: 'Juramento da Vingança (Vengeance)',
                description: 'Punição implacável àqueles que cometeram atrocidades hediondas.',
                features: [
                    { level: 3, name: "Voto de Inimizade", description: "Com uma Ação Bônus, ganhe Vantagem em TODAS as jogadas de ataque contra um inimigo escolhido a até 9m durante 1 minuto!" }
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
                id: 'school_wolf',
                name: 'Escola do Lobo',
                description: 'Equilíbrio e versatilidade marcial lendária de Kaer Morhen.',
                startingEquipment: ['Armadura de Couro Batido', 'Poção Raio'],
                features: [
                    { level: 1, name: "Técnica de Kaer Morhen", description: "+1 em jogadas de ataque com Espadas Longas e +1 na CD de salvaguarda de todos os seus Sinais." }
                ]
            },
            {
                id: 'school_cat',
                name: 'Escola do Gato',
                description: 'Assassinos rápidos, acrobáticos e letais com armaduras leves.',
                startingEquipment: ['Armadura de Couro', 'Besta de Mão', 'Virotes (x20)'],
                features: [
                    { level: 1, name: "Reflexos Felinos", description: "+3 metros de deslocamento e seus ataques acertam acerto crítico em rolagens de 19 ou 20 usando armadura leve." }
                ]
            },
            {
                id: 'school_bear',
                name: 'Escola do Urso',
                description: 'Guerreiros colossais de Skellige acostumados a armaduras pesadas.',
                startingEquipment: ['Cota de Malha', 'Poção Lua Superior'],
                features: [
                    { level: 1, name: "Fortaleza de Ferro", description: "Proficiência com Armaduras Pesadas. Seus PV máximos aumentam em +2 por nível de bruxo." }
                ]
            },
            {
                id: 'school_griffin',
                name: 'Escola do Grifo',
                description: 'Mestres supremos na canalização de magia e Sinais.',
                startingEquipment: ['Meia-Armadura', 'Cristal de Foco'],
                features: [
                    { level: 1, name: "Mestre dos Sinais", description: "O alcance dos seus sinais é dobrado. Você pode conjurar Sinais com Ação Bônus um número de vezes igual ao seu Modificador de Sabedoria por descanso." }
                ]
            },
            {
                id: 'school_viper',
                name: 'Escola da Víbora',
                description: 'Especialistas em emboscadas venenosas e lâminas gêmeas.',
                startingEquipment: ['Corselete de Couro', 'Adaga (x2)', 'Veneno de Lagarto'],
                features: [
                    { level: 1, name: "Presas da Víbora", description: "Você pode aplicar veneno em armas como Ação Bônus e causa +1d6 de dano de veneno ao atacar inimigos distraídos." }
                ]
            }
        ]
    }
];
