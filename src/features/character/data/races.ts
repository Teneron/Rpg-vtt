import type { CharacterAttributes } from "../characterTypes";

export interface RaceTrait {
    name: string;
    description: string;
}

export interface SubraceData {
    id: string;
    name: string;
    description: string;
    speed?: number; // e.g. Elfo da Floresta 10.5m
    visionRange?: number; // e.g. Drow 36m
    traits?: RaceTrait[];
    bonus?: Partial<Record<keyof CharacterAttributes, number>>;
    cantripChoices?: {
        count: number;
        classList?: string;
        options?: string[];
        ability: string;
    };
    spellsGranted?: {
        level: number;
        spellId: string;
        name: string;
    }[];
    damageResistance?: string; // e.g. "Fogo", "Ácido", "Veneno"
    breathWeapon?: {
        damageType: string;
        shape: 'cone' | 'line';
        area: string;
        save: 'dex' | 'con';
    };
}

export interface RaceData {
    id: string;
    name: string;
    description: string; // Lore/Fluff
    age: string; // Aging rules
    size: 'Médio' | 'Pequeno'; // Size category
    speed: number;
    alignment: string; // Alignment tendencies
    bonus: Partial<Record<keyof CharacterAttributes, number>>;
    traits: RaceTrait[]; // Detailed traits object
    languages: string[]; // Fixed languages (e.g. ['Comum', 'Élfico'])
    languageChoices?: { count: number; options?: string[] }; // Optional choice
    cantripChoices?: {
        count: number;
        classList?: string; // e.g. 'wizard'
        options?: string[]; // Specific cantrip IDs
        ability: string;
    };
    subraces?: SubraceData[];
    subraceLabel?: string;
    allowSizeChoice?: boolean;
    toolChoices?: { count: number; options: string[] };
    originFeatChoice?: boolean;
    skillChoices?: { count: number };
    system?: 'dnd55e' | 'witcher';
}

export const RACES: RaceData[] = [
    // ==========================================
    // D&D 5.5e (OFICIAL) ESPÉCIES
    // ==========================================
    {
        id: 'human',
        name: 'Humano',
        system: 'dnd55e',
        description: "Os humanos são versáteis, ambiciosos e cheios de determinação. Destacam-se pela capacidade incomparável de adaptação cultural, recebendo inspiração heroica contínua a cada descanso longo, proficiência em uma perícia extra e um talento de origem adicional de 1º nível.",
        age: "Humanos chegam à maturidade no final da adolescência e vivem menos de um século.",
        size: "Médio",
        allowSizeChoice: true, // Escolha entre Médio ou Pequeno
        speed: 9,
        alignment: "Humanos não possuem tendência inata, abrangendo todos os espectros morais.",
        bonus: { str: 1, dex: 1, con: 1, int: 1, wis: 1, cha: 1 },
        languages: ['Comum'],
        languageChoices: { count: 2 },
        originFeatChoice: true, // Ganha 1 Talento de Origem extra
        skillChoices: { count: 1 }, // 1 perícia extra à escolha
        traits: [
            {
                name: "Inspiração Heroica Recorrente",
                description: "Sua determinação inabalável lhe dá ânimo renovado. Sempre que terminar um Descanso Longo, você adquire Inspiração Heroica se ainda não a possuir."
            },
            {
                name: "Versátil (Talento de Origem & Perícia Extras)",
                description: "Você ganha proficiência em uma perícia à sua escolha e recebe um Talento de Origem adicional de 1º nível à sua escolha."
            }
        ]
    },
    {
        id: 'aasimar',
        name: 'Aasimar',
        system: 'dnd55e',
        description: "Mortais tocados pela graça dos Planos Superiores. Descendentes de seres celestiais ou agraciados por bênçãos divinas, os aasimars trazem luz purificadora, cura e asas espectrais para combater a escuridão.",
        age: "Aasimars amadurecem no mesmo ritmo que os humanos, mas vivem até cerca de 160 anos.",
        size: "Médio",
        speed: 9,
        alignment: "Inclinam-se frequentemente para o Bem e a Ordem, embora renegados possam cair na corrupção.",
        bonus: { cha: 2, wis: 1 },
        languages: ['Comum', 'Celestial'],
        cantripChoices: { count: 1, options: ['light'], ability: 'cha' },
        traits: [
            {
                name: "Visão no Escuro (18m)",
                description: "Você enxerga na penumbra a até 18 metros como se fosse luz plena e na escuridão como se fosse penumbra."
            },
            {
                name: "Resistência Celestial",
                description: "Você possui Resistência a dano Necrótico e a dano Radiante."
            },
            {
                name: "Mãos Curativas",
                description: "Como uma ação Usar Magia, você toca uma criatura e restaura um número de d4s igual ao seu Bônus de Proficiência em PV. Recupera após um Descanso Longo."
            },
            {
                name: "Portador da Luz",
                description: "Você conhece o truque Luz. Carisma é o seu atributo de conjuração para este truque."
            },
            {
                name: "Revelação Celestial (Nível 3+)",
                description: "Com uma Ação Bônus, você se transforma por 1 minuto (1/Descanso Longo). Uma vez em cada turno ao causar dano a um alvo, você causa dano extra igual ao seu Bônus de Proficiência (Necrótico ou Radiante). Escolha: Asas Celestiais (voo 9m), Manto Necrótico (asas sombrias e inimigos a até 3m salvam CAR CD 8+CAR+PB ou ficam Amedrontados) ou Transfiguração Radiante (luz 3m e queima inimigos adjacentes no fim do seu turno)."
            }
        ]
    },
    {
        id: 'dragonborn',
        name: 'Draconato',
        system: 'dnd55e',
        description: "Orgulhosos descendentes de dragões com escamas reluzentes e baforadas elementais devastadoras. Sua arma de sopro substitui um único ataque e ganham a habilidade de manifestar asas e voar a partir do 5º nível.",
        age: "Draconatos crescem rapidamente, atingindo a maturidade aos 15 anos e vivendo cerca de 80 anos.",
        size: "Médio",
        speed: 9,
        alignment: "Tendem aos extremos: guerreiros leais e honrados da justiça ou tiranos implacáveis.",
        bonus: { str: 2, cha: 1 },
        languages: ['Comum', 'Dracônico'],
        subraceLabel: 'Ancestralidade Dracônica',
        subraces: [
            {
                id: 'black',
                name: 'Dragão Preto',
                description: 'Ácido. Sopro em Linha de 9m × 1,5m (Salva DES). Resistência a Ácido.',
                damageResistance: 'Ácido',
                breathWeapon: { damageType: 'Ácido', shape: 'line', area: 'Linha de 9m × 1,5m', save: 'dex' }
            },
            {
                id: 'copper',
                name: 'Dragão de Cobre',
                description: 'Ácido. Sopro em Linha de 9m × 1,5m (Salva DES). Resistência a Ácido.',
                damageResistance: 'Ácido',
                breathWeapon: { damageType: 'Ácido', shape: 'line', area: 'Linha de 9m × 1,5m', save: 'dex' }
            },
            {
                id: 'blue',
                name: 'Dragão Azul',
                description: 'Eletricidade. Sopro em Linha de 9m × 1,5m (Salva DES). Resistência a Eletricidade.',
                damageResistance: 'Eletricidade',
                breathWeapon: { damageType: 'Eletricidade', shape: 'line', area: 'Linha de 9m × 1,5m', save: 'dex' }
            },
            {
                id: 'bronze',
                name: 'Dragão de Bronze',
                description: 'Eletricidade. Sopro em Linha de 9m × 1,5m (Salva DES). Resistência a Eletricidade.',
                damageResistance: 'Eletricidade',
                breathWeapon: { damageType: 'Eletricidade', shape: 'line', area: 'Linha de 9m × 1,5m', save: 'dex' }
            },
            {
                id: 'brass',
                name: 'Dragão de Latão',
                description: 'Fogo. Sopro em Linha de 9m × 1,5m (Salva DES). Resistência a Fogo.',
                damageResistance: 'Fogo',
                breathWeapon: { damageType: 'Fogo', shape: 'line', area: 'Linha de 9m × 1,5m', save: 'dex' }
            },
            {
                id: 'gold',
                name: 'Dragão de Ouro',
                description: 'Fogo. Sopro em Cone de 4,5m (Salva DES). Resistência a Fogo.',
                damageResistance: 'Fogo',
                breathWeapon: { damageType: 'Fogo', shape: 'cone', area: 'Cone de 4,5m', save: 'dex' }
            },
            {
                id: 'red',
                name: 'Dragão Vermelho',
                description: 'Fogo. Sopro em Cone de 4,5m (Salva DES). Resistência a Fogo.',
                damageResistance: 'Fogo',
                breathWeapon: { damageType: 'Fogo', shape: 'cone', area: 'Cone de 4,5m', save: 'dex' }
            },
            {
                id: 'green',
                name: 'Dragão Verde',
                description: 'Veneno. Sopro em Cone de 4,5m (Salva CON). Resistência a Veneno.',
                damageResistance: 'Veneno',
                breathWeapon: { damageType: 'Veneno', shape: 'cone', area: 'Cone de 4,5m', save: 'con' }
            },
            {
                id: 'silver',
                name: 'Dragão de Prata',
                description: 'Frio. Sopro em Cone de 4,5m (Salva CON). Resistência a Frio.',
                damageResistance: 'Frio',
                breathWeapon: { damageType: 'Frio', shape: 'cone', area: 'Cone de 4,5m', save: 'con' }
            },
            {
                id: 'white',
                name: 'Dragão Branco',
                description: 'Frio. Sopro em Cone de 4,5m (Salva CON). Resistência a Frio.',
                damageResistance: 'Frio',
                breathWeapon: { damageType: 'Frio', shape: 'cone', area: 'Cone de 4,5m', save: 'con' }
            }
        ],
        traits: [
            {
                name: "Visão no Escuro (18m)",
                description: "Você enxerga na escuridão a até 18 metros."
            },
            {
                name: "Ancestralidade Dracônica & Resistência",
                description: "Você possui Resistência ao tipo de dano associado à sua Ancestralidade Dracônica."
            },
            {
                name: "Arma de Sopro",
                description: "Quando executa a ação Atacar, você pode substituir um ataque por uma baforada (cone de 4,5m ou linha de 9m × 1,5m conforme seu dragão). Alvos sofrem 1d10 de dano elemental (2d10 no 5º nv, 3d10 no 11º nv, 4d10 no 17º nv) ou metade com salvaguarda bem-sucedida (CD 8 + mod. CON + PB). Usos iguais ao Bônus de Proficiência por Descanso Longo."
            },
            {
                name: "Voo Dracônico (Nível 5+)",
                description: "Com uma Ação Bônus, você projeta asas draconianas espectrais por 10 minutos, ganhando Deslocamento de Voo igual ao seu deslocamento de caminhada (1/Descanso Longo)."
            }
        ]
    },
    {
        id: 'dwarf',
        name: 'Anão',
        system: 'dnd55e',
        description: "Mestres da pedra, forja e clãs subterrâneos. Possuem velocidade completa de 9 metros, Visão no Escuro superior de 36m, Sentido Sísmico através de rocha, pontos de vida adicionais a cada nível e proficiência com ferramentas artesanais.",
        age: "Tornam-se adultos por volta dos 50 anos e vivem até cerca de 350 anos.",
        size: "Médio",
        speed: 9,
        alignment: "A maioria é leal e voltada para a ordem de seus clãs e a honra de suas tradições.",
        bonus: { con: 2, str: 1 },
        languages: ['Comum', 'Anão'],
        toolChoices: {
            count: 1,
            options: ['Ferramentas de Ferreiro', 'Suprimentos de Cervejeiro', 'Ferramentas de Pedreiro']
        },
        traits: [
            {
                name: "Visão no Escuro Superior (36m / 120ft)",
                description: "Acostumado às profundezas do subterrâneo, você enxerga no escuro a até 36 metros."
            },
            {
                name: "Resiliência Anã",
                description: "Você tem Vantagem em salvaguardas contra ser Envenenado e Resistência a dano Venenoso."
            },
            {
                name: "Tenacidade Anã",
                description: "Seus Pontos de Vida máximos aumentam em 1 e aumentam em +1 a cada nível subsequente."
            },
            {
                name: "Especialização em Rochas (Sentido Sísmico)",
                description: "Como Ação Bônus enquanto estiver sobre pedra ou rocha, ganhe Sentido Sísmico de 18 metros durante 10 minutos. Usos iguais ao Bônus de Proficiência por Descanso Longo."
            }
        ]
    },
    {
        id: 'elf',
        name: 'Elfo',
        system: 'dnd55e',
        description: "Seres graciosos ligados ao Reino Feérico e à longevidade ancestral. Não precisam dormir, meditando em transe por 4 horas, e possuem linhagens que concedem truques e magias inatas conforme sobem de nível.",
        age: "Reivindicam a idade adulta por volta dos 100 anos e podem viver 750 anos.",
        size: "Médio",
        speed: 9,
        alignment: "Valorizam a liberdade, arte e expressão, inclinando-se para o Caótico e Bondoso.",
        bonus: { dex: 2, int: 1 },
        languages: ['Comum', 'Élfico'],
        subraceLabel: 'Linhagem Élfica',
        subraces: [
            {
                id: 'high_elf',
                name: 'Alto Elfo',
                description: 'Ligado à magia acadêmica e planar. Conhece um truque de Mago à escolha, Detectar Magia no 3º nível e Passo Nebuloso no 5º nível.',
                cantripChoices: { count: 1, classList: 'wizard', ability: 'int' },
                spellsGranted: [
                    { level: 3, spellId: 'detect_magic', name: 'Detectar Magia' },
                    { level: 5, spellId: 'misty_step', name: 'Passo Nebuloso' }
                ],
                traits: [
                    {
                        name: 'Magia de Alto Elfo',
                        description: 'Você conhece 1 truque à sua escolha da lista de Mago (Inteligência, Sabedoria ou Carisma). No 3º nível, pode conjurar Detectar Magia sem gastar espaço (1/Descanso Longo). No 5º nível, pode conjurar Passo Nebuloso sem gastar espaço (1/Descanso Longo).'
                    }
                ]
            },
            {
                id: 'wood_elf',
                name: 'Elfo da Floresta',
                description: 'Em perfeita harmonia com matas primitivas. Deslocamento base aumentado para 10,5m, truque Druidismo e Passos Sem Pegadas no 5º nível.',
                speed: 10.5,
                cantripChoices: { count: 1, options: ['druidcraft'], ability: 'wis' },
                spellsGranted: [
                    { level: 5, spellId: 'pass_without_trace', name: 'Passos Sem Pegadas' }
                ],
                traits: [
                    {
                        name: 'Passo Rápido & Druidismo',
                        description: 'Seu deslocamento base aumenta para 10,5 metros. Você conhece o truque Druidismo. No 5º nível, pode conjurar Passos Sem Pegadas sem gastar espaço (1/Descanso Longo).'
                    }
                ]
            },
            {
                id: 'drow',
                name: 'Drow (Elfo Negro)',
                description: 'Adaptado à escuridão da Umbraeterna. Visão no Escuro Superior de 36m, truque Globos de Luz, Fogo das Fadas no 3º nível e Escuridão no 5º nível.',
                visionRange: 36,
                cantripChoices: { count: 1, options: ['dancing_lights'], ability: 'cha' },
                spellsGranted: [
                    { level: 3, spellId: 'faerie_fire', name: 'Fogo das Fadas' },
                    { level: 5, spellId: 'darkness', name: 'Escuridão' }
                ],
                traits: [
                    {
                        name: 'Magia Drow & Visão Superior',
                        description: 'Sua Visão no Escuro tem alcance de 36 metros. Você conhece o truque Globos de Luz. No 3º nível, pode conjurar Fogo das Fadas sem gastar espaço (1/Descanso Longo). No 5º nível, pode conjurar Escuridão sem gastar espaço (1/Descanso Longo).'
                    }
                ]
            }
        ],
        traits: [
            {
                name: "Visão no Escuro (18m)",
                description: "Enxerga na penumbra e escuridão a até 18 metros (36m para Drow)."
            },
            {
                name: "Sentidos Aguçados",
                description: "Proficiência garantida na perícia Percepção."
            },
            {
                name: "Ancestralidade Feérica",
                description: "Vantagem em salvaguardas para evitar ou encerrar a condição Enfeitiçado. Magia não pode colocá-lo para dormir."
            },
            {
                name: "Transe",
                description: "Você não precisa dormir. Medita semiconsciente durante 4 horas para receber todos os benefícios de um Descanso Longo."
            }
        ]
    },
    {
        id: 'gnome',
        name: 'Gnomo',
        system: 'dnd55e',
        description: "Pequenos inovadores cheios de curiosidade e engenhosidade arcana. Sua Astúcia Gnômica lhes concede proteção mágica inabalável em todas as salvaguardas mentais (Inteligência, Sabedoria e Carisma).",
        age: "Amadurecem aos 20 anos e vivem cerca de 350 a 500 anos.",
        size: "Pequeno",
        speed: 9,
        alignment: "Curiosos, benevolentes e brincalhões, pendendo para Neutro e Bom.",
        bonus: { int: 2, dex: 1 },
        languages: ['Comum', 'Gnômico'],
        subraceLabel: 'Linhagem Gnômica',
        subraces: [
            {
                id: 'forest_gnome',
                name: 'Gnomo da Floresta',
                description: 'Amigo dos animais e ilusionista natural. Conhece o truque Ilusão Menor e pode conjurar Falar com Animais PB vezes por Descanso Longo.',
                cantripChoices: { count: 1, options: ['minor_illusion'], ability: 'int' },
                spellsGranted: [
                    { level: 1, spellId: 'speak_with_animals', name: 'Falar com Animais' }
                ],
                traits: [
                    {
                        name: 'Ilusionista Natural & Falar com Animais',
                        description: 'Você conhece o truque Ilusão Menor. Além disso, pode conjurar Falar com Animais sem gastar espaço de magia um número de vezes igual ao seu Bônus de Proficiência (recupera em Descanso Longo).'
                    }
                ]
            },
            {
                id: 'rock_gnome',
                name: 'Gnomo das Rochas',
                description: 'Mestre da mecânica e da tecnologia arcana. Conhece Conserto e Prestidigitação, e cria pequenos inventos mecânicos.',
                cantripChoices: { count: 2, options: ['mending', 'prestidigitation'], ability: 'int' },
                traits: [
                    {
                        name: 'Engenho Gnômico',
                        description: 'Você conhece os truques Conserto e Prestidigitação. Com 10 minutos e 10 PO de material, você pode fabricar um Pequeno Dispositivo Mecânico (Relógio, Caixa de Música ou Isqueiro/Pederneira mágica).'
                    }
                ]
            }
        ],
        traits: [
            {
                name: "Visão no Escuro (18m)",
                description: "Você enxerga na escuridão a até 18 metros."
            },
            {
                name: "Astúcia Gnômica",
                description: "Você possui Vantagem em todas as salvaguardas de Inteligência, Sabedoria e Carisma contra magias e efeitos mágicos."
            }
        ]
    },
    {
        id: 'goliath',
        name: 'Golias',
        system: 'dnd55e',
        description: "Gigantescos guerreiros montanheses com sangue dos antigos titãs. Com deslocamento de 10,5 metros, poderes sobrenaturais de seus ancestrais gigantes e capacidade de assumir Tamanho Grande a partir do 5º nível.",
        age: "Amadurecem no final da adolescência e vivem pouco menos de um século.",
        size: "Médio",
        speed: 10.5,
        alignment: "Fortemente independentes e competitivos, prezam mérito e justiça leal.",
        bonus: { str: 2, con: 1 },
        languages: ['Comum', 'Gigante'],
        subraceLabel: 'Ancestralidade Gigante',
        subraces: [
            {
                id: 'cloud',
                name: 'Gigante das Nuvens',
                description: 'Salto da Nuvem: Teleporte de 9m como Ação Bônus (PB usos por Descanso Longo).',
                traits: [
                    {
                        name: 'Salto da Nuvem',
                        description: 'Como uma Ação Bônus, você pode se teleportar magicamente até 9 metros para um espaço desocupado visível. Você pode usar este traço um número de vezes igual ao seu Bônus de Proficiência por Descanso Longo.'
                    }
                ]
            },
            {
                id: 'fire',
                name: 'Gigante do Fogo',
                description: 'Golpe Ígneo: +1d10 dano de Fogo adicional ao acertar um ataque (PB usos por Descanso Longo).',
                traits: [
                    {
                        name: 'Golpe Ígneo',
                        description: 'Ao atingir um alvo com uma jogada de ataque, você pode causar 1d10 de dano de Fogo adicional. Você pode usar este traço um número de vezes igual ao seu Bônus de Proficiência por Descanso Longo.'
                    }
                ]
            },
            {
                id: 'frost',
                name: 'Gigante do Gelo',
                description: 'Frio Cortante: +1d6 dano de Frio e reduz 3m de movimento do alvo até o próximo turno (PB usos por Descanso Longo).',
                traits: [
                    {
                        name: 'Frio Cortante',
                        description: 'Ao atingir um alvo com uma jogada de ataque, você pode causar 1d6 de dano de Frio adicional e reduzir o deslocamento do alvo em 3 metros até o início do seu próximo turno. Usos = PB por Descanso Longo.'
                    }
                ]
            },
            {
                id: 'hill',
                name: 'Gigante das Colinas',
                description: 'Queda do Titã: Ao acertar uma criatura Grande ou menor, derrube-a Caída sem salvaguarda (PB usos por Descanso Longo).',
                traits: [
                    {
                        name: 'Queda do Titã',
                        description: 'Ao atingir uma criatura Grande ou menor com uma jogada de ataque, você pode deixá-la com a condição Caído. Usos = PB por Descanso Longo.'
                    }
                ]
            },
            {
                id: 'stone',
                name: 'Gigante de Pedra',
                description: 'Resistência da Pedra: Como Reação ao sofrer dano, reduza o dano em 1d12 + mod. CON (PB usos por Descanso Longo).',
                traits: [
                    {
                        name: 'Resistência da Pedra',
                        description: 'Como uma Reação imediatamente após sofrer dano, você joga 1d12 e adiciona seu modificador de Constituição, reduzindo o dano sofrido por esse total. Usos = PB por Descanso Longo.'
                    }
                ]
            },
            {
                id: 'storm',
                name: 'Gigante da Tempestade',
                description: 'Trovão da Tempestade: Como Reação ao sofrer dano, cause 1d8 de dano Elétrico ao atacante a até 18m (PB usos por Descanso Longo).',
                traits: [
                    {
                        name: 'Trovão da Tempestade',
                        description: 'Como uma Reação após sofrer dano de uma criatura a até 18 metros de você, você inflige 1d8 de dano Elétrico a esse atacante. Usos = PB por Descanso Longo.'
                    }
                ]
            }
        ],
        traits: [
            {
                name: "Forma Agigantada (Nível 5+)",
                description: "Com Ação Bônus, torne-se Grande por 10 minutos. Causa +1d6 dano uma vez por turno, ganha +3m de deslocamento e Vantagem em testes de Força (1/Descanso Longo)."
            },
            {
                name: "Constituição Poderosa",
                description: "Conta como uma categoria de tamanho maior para determinar capacidade de carga, arrastar e empurrar objetos pesados."
            }
        ]
    },
    {
        id: 'halfling',
        name: 'Halfling',
        system: 'dnd55e',
        description: "Povo alegre, corajoso e incrivelmente afortunado. Com deslocamento de 9 metros, possuem a lendária bênção da Sorte (rerolando qualquer 1 natural no d20) e bravura sobrenatural contra o medo.",
        age: "Amadurecem aos 20 anos e vivem cerca de 150 anos.",
        size: "Pequeno",
        speed: 9,
        alignment: "Geralmente Leais e Bons, amantes de comunidades pacíficas e boa comida.",
        bonus: { dex: 2, con: 1 },
        languages: ['Comum', 'Halfling'],
        traits: [
            {
                name: "Sorte Lendária",
                description: "Quando você rolar um 1 natural em um d20 (ataque, teste de perícia ou salvaguarda), você pode rerolar o dado e DEVE utilizar o novo resultado."
            },
            {
                name: "Bravura",
                description: "Você tem Vantagem em salvaguardas para evitar ou encerrar a condição Amedrontado."
            },
            {
                name: "Agilidade dos Pequeninos",
                description: "Você pode se mover livremente através do espaço de qualquer criatura que seja de tamanho Médio ou maior."
            },
            {
                name: "Furtividade Natural",
                description: "Você pode tentar a ação Esconder-se mesmo quando estiver apenas atrás de uma criatura de tamanho Médio ou maior."
            }
        ]
    },
    {
        id: 'orc',
        name: 'Orc',
        system: 'dnd55e',
        description: "Guerreiros resistentes, ágeis e implacáveis no campo de batalha. Orcs ganham Visão no Escuro de 36m, Investida Adrenérgica que concede PV temporários e a clássica Resistência Implacável.",
        age: "Amadurecem aos 16 anos e vivem pouco menos de um século.",
        size: "Médio",
        speed: 9,
        alignment: "Apaixonados e diretos, valorizam honra de clã, força e lealdade.",
        bonus: { str: 2, con: 1 },
        languages: ['Comum', 'Orc'],
        traits: [
            {
                name: "Visão no Escuro Superior (36m / 120ft)",
                description: "Enxerga na escuridão a até 36 metros."
            },
            {
                name: "Investida Adrenérgica",
                description: "Com uma Ação Bônus, você pode realizar a ação Disparada. Ao fazê-lo, ganhe Pontos de Vida Temporários iguais ao seu Bônus de Proficiência. Usos = Bônus de Proficiência por Descanso Longo."
            },
            {
                name: "Resistência Implacável",
                description: "Quando reduzido a 0 PV e não morto instantaneamente, você cai para 1 Ponto de Vida em vez disso (1/Descanso Longo)."
            }
        ]
    },
    {
        id: 'tiefling',
        name: 'Tiefling',
        system: 'dnd55e',
        description: "Mortais marcados pela essência dos Planos Inferiores. Podem pertencer a três legados místicos distintos (Infernal, Abissal ou Ctônico), cada um conferindo resistência elemental e magias arcanas próprias.",
        age: "Amadurecem no mesmo ritmo dos humanos e vivem cerca de um século.",
        size: "Médio",
        allowSizeChoice: true, // Pode ser Médio ou Pequeno
        speed: 9,
        alignment: "Tendência caótica e independente, desconfiados de autoritarismos rígidos.",
        bonus: { cha: 2, int: 1 },
        languages: ['Comum', 'Infernal'],
        subraceLabel: 'Legado Ínfero',
        subraces: [
            {
                id: 'infernal',
                name: 'Legado Infernal',
                description: 'Fogo. Resistência a Fogo, truque Taumaturgia, Repreensão Infernal no 3º nível e Escuridão no 5º nível.',
                damageResistance: 'Fogo',
                cantripChoices: { count: 1, options: ['thaumaturgy'], ability: 'cha' },
                spellsGranted: [
                    { level: 3, spellId: 'hellish_rebuke', name: 'Repreensão Infernal' },
                    { level: 5, spellId: 'darkness', name: 'Escuridão' }
                ],
                traits: [
                    {
                        name: 'Magia Infernal & Resistência ao Fogo',
                        description: 'Você possui Resistência a dano de Fogo. Conhece o truque Taumaturgia. No 3º nível, pode conjurar Repreensão Infernal sem gastar espaço (1/Descanso Longo). No 5º nível, pode conjurar Escuridão sem gastar espaço (1/Descanso Longo).'
                    }
                ]
            },
            {
                id: 'abyssal',
                name: 'Legado Abissal',
                description: 'Veneno. Resistência a Veneno, truque Rajada de Veneno, Raio de Doença no 3º nível e Imobilizar Pessoa no 5º nível.',
                damageResistance: 'Veneno',
                cantripChoices: { count: 1, options: ['poison_spray'], ability: 'cha' },
                spellsGranted: [
                    { level: 3, spellId: 'ray_of_sickness', name: 'Raio de Doença' },
                    { level: 5, spellId: 'hold_person', name: 'Imobilizar Pessoa' }
                ],
                traits: [
                    {
                        name: 'Magia Abissal & Resistência a Veneno',
                        description: 'Você possui Resistência a dano de Veneno. Conhece o truque Rajada de Veneno. No 3º nível, pode conjurar Raio de Doença sem gastar espaço (1/Descanso Longo). No 5º nível, pode conjurar Imobilizar Pessoa sem gastar espaço (1/Descanso Longo).'
                    }
                ]
            },
            {
                id: 'chthonic',
                name: 'Legado Ctônico',
                description: 'Necrótico. Resistência a Necrótico, truque Toque Arrepiante, Vitalidade Falsa no 3º nível e Raio do Enfraquecimento no 5º nível.',
                damageResistance: 'Necrótico',
                cantripChoices: { count: 1, options: ['chill_touch'], ability: 'cha' },
                spellsGranted: [
                    { level: 3, spellId: 'false_life', name: 'Vitalidade Falsa' },
                    { level: 5, spellId: 'ray_of_enfeeblement', name: 'Raio do Enfraquecimento' }
                ],
                traits: [
                    {
                        name: 'Magia Ctônica & Resistência Necrótica',
                        description: 'Você possui Resistência a dano Necrótico. Conhece o truque Toque Arrepiante. No 3º nível, pode conjurar Vitalidade Falsa sem gastar espaço (1/Descanso Longo). No 5º nível, pode conjurar Raio do Enfraquecimento sem gastar espaço (1/Descanso Longo).'
                    }
                ]
            }
        ],
        traits: [
            {
                name: "Visão no Escuro (18m)",
                description: "Enxerga na escuridão a até 18 metros."
            },
            {
                name: "Conjuração de Herança",
                description: "Carisma, Inteligência ou Sabedoria é o seu atributo de conjuração para as magias concedidas pelo seu legado ínfero."
            }
        ]
    },

    // ==========================================
    // THE WITCHER ADAPTADO (SISTEMA WITCHER)
    // ==========================================
    {
        id: 'witcher',
        name: 'Bruxo (Mutante)',
        system: 'witcher',
        description: "Um mutante treinado especificamente para caçar monstros no Continente. Seus olhos felinos, cicatrizes e espadas duplas são marcas inconfundíveis. Passou pela Prova das Ervas, que concede reflexos, força e longevidade sobre-humanos, mas retira a fertilidade e amortece as emoções mundanas.",
        age: "Graças às mutações, bruxos envelhecem muito lentamente e são imunes à maioria das doenças, vivendo séculos se não morrerem em combate.",
        size: "Médio",
        speed: 9,
        alignment: "Geralmente Neutros, focados no dever profissional, contratos e pragmatismo.",
        bonus: { con: 2, str: 1, dex: 1 },
        languages: ['Comum', 'Língua Antiga'],
        traits: [
            { name: "Visão no Escuro (18m)", description: "Suas pupilas verticais adaptadas permitem enxergar na escuridão total a até 18 metros." },
            { name: "Metabolismo Aprimorado", description: "Você é imune a doenças mundanas e tem vantagem em testes de resistência contra venenos e toxinas de monstros." },
            { name: "Prova das Ervas", description: "Seus reflexos são sobrenaturais. Você ganha proficiência nas perícias Percepção e Sobrevivência." },
            { name: "Sinais de Bruxo", description: "Você pode canalizar sinais básicos (Aard, Igni, Quen, Yrden, Axii) utilizando Vigor ou Sabedoria." }
        ]
    },
    {
        id: 'witcher_elf',
        name: 'Elfo do Continente (Aen Seidhe)',
        system: 'witcher',
        description: "Os elfos originários do Continente antes da Conjunção das Esferas. Orgulhosos, esguios e perseguidos pelos reinos do norte, muitos pegam em armas como guerrilheiros Scoia'tael nas florestas densas.",
        age: "Podem viver centenas de anos, mantendo vigor físico por séculos.",
        size: "Médio",
        speed: 10.5,
        alignment: "Inclinados à rebeldia e sobrevivência nas matas (Caótico e Neutro).",
        bonus: { dex: 2, wis: 1 },
        languages: ['Comum', 'Língua Antiga (Hen Llinge)'],
        traits: [
            { name: "Visão no Escuro (18m)", description: "Enxerga na escuridão a até 18 metros." },
            { name: "Sentidos Aguçados", description: "Proficiência na perícia Percepção." },
            { name: "Passos na Floresta", description: "Deslocamento de 10,5m e não sofre penalidades em terreno difícil de floresta." }
        ]
    },
    {
        id: 'witcher_dwarf',
        name: 'Anão de Mahakam',
        system: 'witcher',
        description: "Nascidos nas fortalezas rochosas do maciço de Mahakam. Conhecidos pelo artesanato incomparável de armas, armaduras e sua lendária resistência a venenos e golpes contundentes.",
        age: "Vivem cerca de 300 anos com vigor inabalável.",
        size: "Médio",
        speed: 9,
        alignment: "Leais e pragmáticos, prezam clãs, honra e contratos comerciais.",
        bonus: { con: 2, str: 1 },
        languages: ['Comum', 'Anão de Mahakam'],
        traits: [
            { name: "Visão no Escuro (18m)", description: "Enxerga na escuridão a até 18 metros." },
            { name: "Resistência de Mahakam", description: "Vantagem em testes contra venenos e resistência a dano de veneno." },
            { name: "Tradição da Forja", description: "Proficiência em Ferramentas de Ferreiro e bônus em testes de identificação de metais preciosos." }
        ]
    }
];
