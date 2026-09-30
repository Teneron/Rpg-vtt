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
    languageChoices?: { count: number; options?: string[] }; // Optional choice (e.g. Human chooses 1)
    cantripChoices?: {
        count: number;
        classList?: string; // e.g. 'wizard'
        ability: string;
    };
}

export const RACES: RaceData[] = [
    // --- COMMON RACES ---
    {
        id: 'human',
        name: 'Humano',
        description: "Os humanos são, de longe, a raça mais jovem, versátil e comum no multiverso. Eles são inovadores, impulsionados pela ambição e conhecidos por sua capacidade de adaptação. Embora suas vidas sejam curtas em comparação com anões e elfos, os humanos constroem instituições duradouras, reinos vastos e deixam um legado que perdura por milênios.",
        age: "Humanos chegam à idade adulta no final da adolescência e vivem menos de um século.",
        size: "Médio",
        speed: 9,
        alignment: "Humanos não possuem tendência inata, variando do melhor ao pior.",
        bonus: { str: 1, dex: 1, con: 1, int: 1, wis: 1, cha: 1 },
        languages: ['Comum'],
        languageChoices: { count: 1 },
        traits: [
            { name: "Versatilidade Humana", description: "Seus valores de habilidade aumentam em 1." },
            { name: "Idiomas", description: "Você sabe falar, ler e escrever Comum e um idioma adicional à sua escolha." }
        ]
    },
    {
        id: 'elf_high',
        name: 'Elfo (Alto)',
        description: "Como um alto elfo, você possui uma mente afiada e um domínio da magia básica. Em muitos mundos de D&D, existem dois tipos de altos elfos. Um tipo (que inclui os elfos cinzentos e os elfos do vale de Greyhawk, os Silvanesti de Dragonlance e os elfos do sol de Forgotten Realms) é altivo e recluso, acreditando ser superior aos não-elfos e até mesmo a outros elfos. O outro tipo (incluindo os altos elfos de Greyhawk, os Qualinesti de Dragonlance e os elfos da lua de Forgotten Realms) é mais comum e mais amigável, e muitas vezes encontrado entre humanos e outras raças.",
        age: "Embora atinjam a maturidade física na mesma idade que os humanos, a compreensão élfica da idade adulta vai além do crescimento físico, abrangendo a experiência do mundo. Tipicamente, reivindicam a idade adulta e um nome adulto por volta dos 100 anos e podem viver 750 anos.",
        size: "Médio",
        speed: 9,
        alignment: "Elfos amam a liberdade, variedade e autoexpressão, então eles inclinam-se fortemente para características gentis do caos.",
        bonus: { dex: 2, int: 1 },
        languages: ['Comum', 'Língua Antiga'],
        languageChoices: { count: 1 },
        cantripChoices: {
            count: 1,
            classList: 'wizard',
            ability: 'int'
        },
        traits: [
            { name: "Visão no Escuro", description: "Acostumado às florestas crepusculares e ao céu noturno, você possui uma visão superior no escuro e na penumbra." },
            { name: "Sentidos Aguçados", description: "Você tem proficiência na perícia Percepção." },
            { name: "Ancestralidade Feérica", description: "Você tem vantagem nos testes de resistência para resistir a ser enfeitiçado e a magia não pode colocá-lo para dormir." },
            { name: "Transe", description: "Elfos não precisam dormir. Em vez disso, meditam profundamente, permanecendo semiconscientes, durante 4 horas por dia." },
            { name: "Treinamento Élfico com Armas", description: "Você tem proficiência com espadas curtas, espadas longas, arcos curtos e arcos longos." },
            { name: "Truque", description: "Você conhece um truque à sua escolha da lista de magias de mago. Inteligência é a sua habilidade usada para conjurar este truque." },
            { name: "Idioma Extra", description: "Você sabe falar, ler e escrever um idioma adicional à sua escolha." }
        ]
    },
    {
        id: 'elf_wood',
        name: 'Elfo (Floresta)',
        description: "Como um elfo da floresta, você tem sentidos aguçados e intuição. Seus pés ligeiros carregam-no rápida e furtivamente através de suas florestas nativas. Esta categoria inclui os elfos selvagens (grugach) de Greyhawk e os Kagonesti de Dragonlance, bem como as raças chamadas de elfos da floresta em Greyhawk e Forgotten Realms.",
        age: "Idêntico aos Altos Elfos.",
        size: "Médio",
        speed: 10.5,
        alignment: "Elfos da floresta tendem a ser caóticos e bons, valorizando a liberdade e a compaixão.",
        bonus: { dex: 2, wis: 1 },
        languages: ['Comum', 'Língua Antiga'],
        traits: [
            { name: "Visão no Escuro", description: "Visão superior no escuro e na penumbra." },
            { name: "Sentidos Aguçados", description: "Proficiência em Percepção." },
            { name: "Ancestralidade Feérica", description: "Vantagem contra ser enfeitiçado; imune a sono mágico." },
            { name: "Transe", description: "Medita 4h em vez de dormir 8h." },
            { name: "Treinamento Élfico com Armas", description: "Proficiência com espadas curtas, longas, arcos curtos e longos." },
            { name: "Pés Ligeiros", description: "Seu deslocamento base de caminhada aumenta para 10,5 metros." },
            { name: "Máscara da Natureza", description: "Você pode tentar se esconder mesmo quando estiver apenas levemente obscurecido por folhagem, chuva forte, neve caindo, névoa ou outro fenômeno natural." }
        ]
    },
    {
        id: 'dwarf_hill',
        name: 'Anão (Colina)',
        description: "Como um anão da colina, você tem sentidos aguçados, intuição profunda e uma resistência notável. Os anões dourados de Faerûn, em seu poderoso reino ao sul, são anões da colina, assim como os exilados Neidar e os degradados Klar de Krynn, no cenário de Dragonlance.",
        age: "Anões tornam-se adultos por volta dos 50 anos e vivem até cerca de 350 anos.",
        size: "Médio",
        speed: 7.5,
        alignment: "A maioria dos anões é leal, acreditando firmemente nos benefícios de uma sociedade bem organizada.",
        bonus: { con: 2, wis: 1 },
        languages: ['Comum', 'Anão'],
        traits: [
            { name: "Visão no Escuro", description: "Acostumado à vida subterrânea, você enxerga no escuro como se fosse penumbra." },
            { name: "Resiliência Anã", description: "Você tem vantagem nos testes de resistência contra veneno e resistência contra dano de veneno." },
            { name: "Treinamento Anão em Combate", description: "Você tem proficiência com machados de batalha, machadinhas, martelos leves e martelos de guerra." },
            { name: "Tenacidade Anã", description: "Seus pontos de vida máximos aumentam em 1, e aumentam em 1 sempre que você sobe um nível." }
        ]
    },
    {
        id: 'dwarf_mountain',
        name: 'Anão (Montanha)',
        description: "Como um anão da montanha, você é forte e robusto, acostumado a uma vida difícil em terrenos acidentados. Você provavelmente descende de anões com mais altura (para um anão) e tende a ter uma coloração mais clara. Os anões de escudo do norte de Faerûn, bem como o clã governante Hylar e o clã nobre Daewar de Dragonlance, são anões da montanha.",
        age: "Idêntico aos Anões da Colina.",
        size: "Médio",
        speed: 7.5,
        alignment: "Geralmente leais e bons, mas alguns tendem ao neutro.",
        bonus: { con: 2, str: 2 },
        languages: ['Comum', 'Anão'],
        traits: [
            { name: "Visão no Escuro", description: "Visão superior no escuro e na penumbra." },
            { name: "Resiliência Anã", description: "Vantagem contra veneno e resistência a dano venenoso." },
            { name: "Treinamento Anão em Combate", description: "Proficiência com machados e martelos." },
            { name: "Treinamento com Armaduras", description: "Você tem proficiência com armaduras leves e médias." }
        ]
    },
    {
        id: 'halfling_lightfoot',
        name: 'Halfling (Pés Leves)',
        description: "Como um halfling pés-leves, você pode se esconder facilmente, usando até mesmo outras pessoas como cobertura. Você tende a ser afável e se dar bem com os outros. Em Forgotten Realms, os halflings pés-leves espalharam-se mais e, portanto, são a variedade mais comum.",
        age: "Um halfling atinge a idade adulta aos 20 anos e geralmente vive até meados do seu segundo século.",
        size: "Pequeno",
        speed: 7.5,
        alignment: "Maioria é Leal e Boa.",
        bonus: { dex: 2, cha: 1 },
        languages: ['Comum'],
        traits: [
            { name: "Sorte", description: "Quando você rolar um 1 natural em uma jogada de ataque, teste de habilidade ou teste de resistência, você pode jogar o dado novamente e deve utilizar o novo resultado." },
            { name: "Bravura", description: "Você tem vantagem em testes de resistência contra ficar amedrontado." },
            { name: "Agilidade Halfling", description: "Você pode mover-se através do espaço de qualquer criatura que for de um tamanho maior que o seu." },
            { name: "Furtividade Natural", description: "Você pode tentar se esconder mesmo quando possuir apenas a cobertura de uma criatura que for no mínimo um tamanho maior que o seu." }
        ]
    },
    {
        id: 'halfling_stout',
        name: 'Halfling (Robusto)',
        description: "Como um halfling robusto, você é mais resistente que a média e tem alguma resistência contra venenos. Alguns dizem que os robustos têm sangue de anão. Nos Reinos Esquecidos, esses halflings são chamados de fortes e são mais comuns no sul.",
        age: "Idêntico aos Pés Leves.",
        size: "Pequeno",
        speed: 7.5,
        alignment: 'Caótico Bom',
        bonus: { dex: 2, con: 1 },
        languages: ['Comum', 'Língua Antiga'],
        traits: [
            { name: "Sorte", description: "Rerolar 1s naturais." },
            { name: "Bravura", description: "Vantagem contra medo." },
            { name: "Agilidade Halfling", description: "Mover-se pelo espaço de criaturas maiores." },
            { name: "Resiliência dos Robustos", description: "Você tem vantagem em testes de resistência contra veneno e tem resistência contra dano de veneno." }
        ]
    },

    {
        id: 'tiefling',
        name: 'Tiefling',
        description: "Ser recebido com olhares e sussurros, sofrer violência e insultos na rua, ver a desconfiança e o medo em cada olhar: esse é o fardo do tiefling. E para contornar tudo isso, um tiefling sabe que isso é graças a um pacto feito gerações atrás que infundiu a essência de Asmodeus - senhor supremo dos Nove Infernos - em sua linhagem.",
        age: "Tieflings amadurecem ao mesmo tempo que humanos, mas vivem alguns anos a mais.",
        size: "Médio",
        speed: 9,
        alignment: 'Caótico Neutro',
        bonus: { cha: 2, int: 1 },
        languages: ['Comum', 'Língua Antiga'],
        traits: [
            { name: "Visão no Escuro", description: "Graças à sua herança infernal, você tem uma visão superior no escuro e na penumbra." },
            { name: "Resistência Infernal", description: "Você tem resistência a dano de fogo." },
            { name: "Legado Infernal", description: "Você conhece o truque Thaumaturgy. No 3º nível, pode conjurar Hellish Rebuke. No 5º nível, pode conjurar Darkness." }
        ]
    },

    // --- SPECIAL / CUSTOM ---
    {
        id: 'witcher',
        name: 'Humano (Bruxo)',
        description: "Um mutante treinado especificamente para caçar monstros. Seus olhos felinos, cicatrizes e espadas duplas são marcas inconfundíveis. Eles passam pelo violento processo conhecido como a Prova das Ervas, que concede reflexos, força e longevidade sobre-humanos, mas retira a capacidade de reprodução e amortece as emoções (segundo dizem).",
        age: "Graças às mutações, bruxos envelhecem muito lentamente e são imunes à maioria das doenças, vivendo séculos se não morrerem em combate.",
        size: "Médio",
        speed: 9,
        alignment: "Geralmente Neutros, focados no trabalho e pragmatismo.",
        bonus: { con: 2, str: 1, dex: 1 },
        languages: ['Comum'],
        traits: [
            { name: "Visão no Escuro", description: "Suas pupilas verticais permitem enxergar na escuridão total (18m)." },
            { name: "Metabolismo Aprimorado", description: "Você é imune a doenças mundanas e tem vantagem em testes de resistência contra venenos de monstros." },
            { name: "Prova das Ervas", description: "Seus reflexos são sobrenaturais. Você ganha proficiência em Percepção e Sobrevivência." },
            { name: "Sinais", description: "Você pode conjurar sinais básicos (magia rudimentar) utilizando Vigor ou Sabedoria." }
        ]
    },
];
