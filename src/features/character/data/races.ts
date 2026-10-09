import type { CharacterAttributes } from "../characterTypes";

export interface RaceTrait {
    name: string;
    description: string;
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
        description: "Os humanos são versáteis, ambiciosos e cheios de determinação. Destacam-se pela capacidade incomparável de adaptação cultural, recebendo inspiração contínua e talentos de origem extras que ampliam suas capacidades desde o início da jornada.",
        age: "Humanos chegam à maturidade no final da adolescência e vivem menos de um século.",
        size: "Médio",
        speed: 9,
        alignment: "Humanos não possuem tendência inata, abrangendo todos os espectros morais.",
        bonus: { str: 1, dex: 1, con: 1, int: 1, wis: 1, cha: 1 },
        languages: ['Comum'],
        languageChoices: { count: 1 },
        traits: [
            {
                name: "Inspiração Heroica Recorrente",
                description: "Sua determinação inabalável lhe dá ânimo renovado. Sempre que terminar um Descanso Longo, você adquire Inspiração Heroica se ainda não a possuir."
            },
            {
                name: "Versátil (Talento de Origem Extra)",
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
        traits: [
            {
                name: "Visão no Escuro (18m)",
                description: "Você enxerga na escuridão a até 18 metros."
            },
            {
                name: "Ancestralidade Dracônica & Resistência",
                description: "Escolha sua linhagem (Negro/Cobre: Ácido; Azul/Bronze: Eletricidade; Latão/Ouro/Vermelho: Fogo; Verde: Veneno; Prata/Branco: Frio). Você possui Resistência a este tipo de dano."
            },
            {
                name: "Arma de Sopro",
                description: "Quando executa a ação Atacar, você pode substituir um ataque por uma baforada (cone de 4,5m ou linha de 9m × 1,5m). Inimigos sofrem 1d10 de dano do seu elemento (2d10 no 5º nv, 3d10 no 11º nv, 4d10 no 17º nv) ou metade se passarem na salvaguarda de DES ou CON (CD 8 + mod. CON + PB). Usos iguais ao Bônus de Proficiência por Descanso Longo."
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
        description: "Mestres da pedra, forja e clãs subterrâneos. Possuem velocidade completa de 9 metros, Visão no Escuro superior de 36m, Sentido Sísmico através de rocha e pontos de vida adicionais a cada nível.",
        age: "Tornam-se adultos por volta dos 50 anos e vivem até cerca de 350 anos.",
        size: "Médio",
        speed: 9,
        alignment: "A maioria é leal e voltada para a ordem de seus clãs e a honra de suas tradições.",
        bonus: { con: 2, str: 1 },
        languages: ['Comum', 'Anão'],
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
        cantripChoices: { count: 1, classList: 'wizard', ability: 'int' },
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
            },
            {
                name: "Linhagem Élfica (Alto Elfo, Floresta ou Drow)",
                description: "Alto Elfo: Truque de Mago à escolha + Detecção de Magia (nv 3) e Passo Nebuloso (nv 5). Elfo da Floresta: Deslocamento 10,5m + Artimanha + Passos Sem Pegadas (nv 5). Drow: Visão no Escuro 36m + Globos de Luz + Fogo das Fadas (nv 3) e Escuridão (nv 5)."
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
        cantripChoices: { count: 1, classList: 'wizard', ability: 'int' },
        traits: [
            {
                name: "Visão no Escuro (18m)",
                description: "Você enxerga na escuridão a até 18 metros."
            },
            {
                name: "Astúcia Gnômica",
                description: "Você possui Vantagem em todas as salvaguardas de Inteligência, Sabedoria e Carisma contra efeitos mágicos."
            },
            {
                name: "Linhagem Gnômica (Floresta ou Rocha)",
                description: "Gnomo da Floresta: Truque Ilusão Menor e conjuração de Falar com Animais PB vezes por Descanso Longo. Gnomo das Rochas: Truques Consertar e Prestidigitação, e capacidade de construir pequenos inventos mecânicos em 10 minutos."
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
        traits: [
            {
                name: "Ancestralidade Gigante",
                description: "Escolha uma herança (usos = Bônus de Proficiência por Descanso Longo): Gigante das Nuvens (teleporte de 9m como ação bônus); Gigante do Fogo (+1d10 dano ígneo); Gigante do Gelo (+1d6 frio e -3m deslocamento inimigo); Gigante das Colinas (derruba criatura Enorme ou menor Caída ao acertar ataque); Gigante de Pedra (reação reduz dano em 1d12 + CON); Gigante da Tempestade (reação causa 1d8 elétrico a quem te atacou)."
            },
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
        description: "Mortais marcados pela essência dos Planos Inferiores. Podem pertencer a três legados místicos distintos (Infernal, Abissal ou Ctoniano), cada um conferindo resistência elemental e magias arcanas próprias.",
        age: "Amadurecem no mesmo ritmo dos humanos e vivem cerca de um século.",
        size: "Médio",
        speed: 9,
        alignment: "Tendência caótica e independente, desconfiados de autoritarismos rígidos.",
        bonus: { cha: 2, int: 1 },
        languages: ['Comum', 'Infernal'],
        cantripChoices: { count: 1, options: ['thaumaturgy', 'poison_spray', 'chill_touch'], ability: 'cha' },
        traits: [
            {
                name: "Visão no Escuro (18m)",
                description: "Enxerga na escuridão a até 18 metros."
            },
            {
                name: "Legado Sobrenatural (Infernal, Abissal ou Ctoniano)",
                description: "Infernal: Resistência a Fogo, truque Taumaturgia, Repreensão Infernal (nv 3), Escuridão (nv 5). Abissal: Resistência a Veneno, Rajada de Veneno, Raio de Doença (nv 3), Imobilizar Pessoa (nv 5). Ctoniano: Resistência a Necrótico, Toque Arrepiante, Vitalidade Falsa (nv 3), Raio do Enfraquecimento (nv 5)."
            },
            {
                name: "Conjuração de Herança",
                description: "Carisma é o seu atributo de conjuração para as magias concedidas pelo seu legado."
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
