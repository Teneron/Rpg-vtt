import type { SkillName, CharacterAttributes } from '../characterTypes';

export interface BackgroundData {
    id: string;
    name: string;
    description: string;
    abilityOptions?: (keyof CharacterAttributes)[]; // Ability scores eligible for +2/+1 or +1/+1/+1
    featId?: string; // Origin feat ID
    featName?: string; // Origin feat display name
    skillProficiencies: SkillName[];
    toolProficiencies?: string[];
    languages?: number; // Count of extra languages
    equipment: string[];
    feature?: {
        name: string;
        description: string;
    };
    system?: 'dnd55e' | 'witcher';
}

export const BACKGROUNDS: BackgroundData[] = [
    // =========================================================================
    // D&D 5.5e OFFICIAL BACKGROUNDS (16 ANTECEDENTES)
    // =========================================================================
    {
        id: 'acolyte',
        name: 'Acólito',
        system: 'dnd55e',
        description: "Você se dedicou ao serviço em um templo ou bosque sagrado, realizando ritos e estudando religião. Sob a orientação de sacerdotes, aprendeu a canalizar o poder divino e orar pelo povo.",
        abilityOptions: ['int', 'wis', 'cha'],
        featId: 'magic_initiate',
        featName: 'Iniciado em Magia (Clérigo)',
        skillProficiencies: ['Intuição', 'Religião'],
        toolProficiencies: ['Suprimentos de Calígrafo'],
        equipment: ['Suprimentos de Calígrafo', 'Livro (Orações)', 'Símbolo Sagrado', 'Pergaminho (10 folhas)', 'Túnica', '8 PO (ou 50 PO)'],
        feature: {
            name: "Iniciado em Magia Divina",
            description: "Você conhece dois truques divinos e uma magia de 1º círculo de Clérigo, podendo conjurá-la uma vez sem gastar espaço de magia por Descanso Longo."
        }
    },
    {
        id: 'wayfarer',
        name: 'Andarilho',
        system: 'dnd55e',
        description: "Você cresceu nas ruas e becos cercado por rejeitados malfadados. Dormia onde podia, aprendendo a sobreviver com furtividade, esperteza e a sorte dos desfavorecidos.",
        abilityOptions: ['dex', 'wis', 'cha'],
        featId: 'lucky',
        featName: 'Sortudo (Lucky)',
        skillProficiencies: ['Furtividade', 'Intuição'],
        toolProficiencies: ['Ferramentas de Ladrão'],
        equipment: ['2 Adagas', 'Ferramentas de Ladrão', 'Kit de Jogos', '2 Algibeiras', 'Roupas de Viagem', 'Saco de Dormir', '16 PO (ou 50 PO)'],
        feature: {
            name: "Sorte das Ruas",
            description: "Você tem pontos de Sorte iguais ao seu Bônus de Proficiência para rolar dados adicionais ou impor desvantagem em inimigos."
        }
    },
    {
        id: 'artisan',
        name: 'Artesão',
        system: 'dnd55e',
        description: "Você foi aprendiz de artesãos conceituados, aprendendo a fabricar manufaturas finas, lidar com clientes exigentes e apurar os olhos para detalhes e qualidade de materiais.",
        abilityOptions: ['str', 'dex', 'int'],
        featId: 'crafter',
        featName: 'Artifista (Crafter)',
        skillProficiencies: ['Investigação', 'Persuasão'],
        toolProficiencies: ['Ferramentas de Artesão (à escolha)'],
        equipment: ['Ferramentas de Artesão', '2 Algibeiras', 'Roupas de Viagem', '32 PO (ou 50 PO)'],
        feature: {
            name: "Mestre Manufatureiro",
            description: "Proficiência com 3 ferramentas de artesão, 20% de desconto na compra de equipamentos não mágicos e habilidade de fabricar itens em descanso longo."
        }
    },
    {
        id: 'entertainer',
        name: 'Artista',
        system: 'dnd55e',
        description: "Você passou a juventude em feiras, palcos e festivais itinerantes. Aprendeu acrobacias, música e retórica poética impecável para encantar multidões e confortar corações.",
        abilityOptions: ['str', 'dex', 'cha'],
        featId: 'musician',
        featName: 'Músico (Musician)',
        skillProficiencies: ['Acrobacia', 'Atuação'],
        toolProficiencies: ['Instrumento Musical (à escolha)'],
        equipment: ['Instrumento Musical', 'Espelho de Aço', '2 Fantasias', 'Perfume', 'Roupas de Viagem', '11 PO (ou 50 PO)'],
        feature: {
            name: "Inspiração Musical",
            description: "Ao tocar após um Descanso Curto ou Longo, você concede Inspiração Heroica para seus companheiros de aventura."
        }
    },
    {
        id: 'charlatan',
        name: 'Charlatão',
        system: 'dnd55e',
        description: "Você aprendeu a navegar nas fraquezas humanas oferecendo mentiras reconfortantes, elixires falsos ou documentos fraudulentos, usando carisma irresistível e mãos leves.",
        abilityOptions: ['dex', 'con', 'cha'],
        featId: 'skilled',
        featName: 'Habilidoso (Skilled)',
        skillProficiencies: ['Enganação', 'Prestidigitação'],
        toolProficiencies: ['Kit de Falsificação'],
        equipment: ['Kit de Falsificação', 'Fantasia', 'Roupas Finas', '15 PO (ou 50 PO)'],
        feature: {
            name: "Versatilidade de Golpista",
            description: "Graças ao talento Habilidoso, você domina 3 perícias ou ferramentas adicionais de qualquer natureza."
        }
    },
    {
        id: 'criminal',
        name: 'Criminoso',
        system: 'dnd55e',
        description: "Você sobrevivia em becos escuros, furtando transeuntes ou arrombando estabelecimentos. Seus sentidos estão em constante alerta contra emboscadas e guardas.",
        abilityOptions: ['dex', 'con', 'int'],
        featId: 'alert',
        featName: 'Alerta (Alert)',
        skillProficiencies: ['Furtividade', 'Prestidigitação'],
        toolProficiencies: ['Ferramentas de Ladrão'],
        equipment: ['2 Adagas', 'Ferramentas de Ladrão', '2 Algibeiras', 'Pé de Cabra', 'Roupas de Viagem', '16 PO (ou 50 PO)'],
        feature: {
            name: "Sentidos em Alerta",
            description: "Você soma seu Bônus de Proficiência à iniciativa e pode trocar o seu valor de iniciativa com um aliado voluntário no início do combate."
        }
    },
    {
        id: 'hermit',
        name: 'Eremita',
        system: 'dnd55e',
        description: "Você passou anos isolado em uma cabana ou monastério contemplando os mistérios do cosmo e da vida natural, aprendendo a curar ferimentos e criar unguentos medicinais.",
        abilityOptions: ['con', 'wis', 'cha'],
        featId: 'healer',
        featName: 'Curandeiro (Healer)',
        skillProficiencies: ['Medicina', 'Religião'],
        toolProficiencies: ['Kit de Herbalismo'],
        equipment: ['Bordão', 'Kit de Herbalismo', 'Lâmpada', 'Livro de Filosofia', '3 Frascos de Óleo', 'Roupas de Viagem', 'Saco de Dormir', '16 PO (ou 50 PO)'],
        feature: {
            name: "Toque Curativo",
            description: "Você rerrola 1s em dados de cura e pode usar o Kit de Curandeiro para restaurar pontos de vida usando os Dados de Vida do alvo."
        }
    },
    {
        id: 'scribe',
        name: 'Escriba',
        system: 'dnd55e',
        description: "Formado em scriptoriums, arquivos governamentais ou monastérios de eruditos, você domina o registro meticuloso de manuscritos, literatura e leis antigas com mão firme e mente aguçada.",
        abilityOptions: ['dex', 'int', 'wis'],
        featId: 'skilled',
        featName: 'Habilidoso (Skilled)',
        skillProficiencies: ['Investigação', 'Percepção'],
        toolProficiencies: ['Suprimentos de Calígrafo'],
        equipment: ['Suprimentos de Calígrafo', 'Lâmpada', '3 Frascos de Óleo', 'Pergaminho (12 folhas)', 'Roupas Finas', '23 PO (ou 50 PO)'],
        feature: {
            name: "Erudição Ampla",
            description: "Sua formação abrangente lhe concede proficiência em três perícias ou ferramentas adicionais à sua escolha."
        }
    },
    {
        id: 'farmer',
        name: 'Fazendeiro',
        system: 'dnd55e',
        description: "Você cresceu cultivando a terra e cuidando de rebanhos. Os anos sob sol e chuva lhe concederam vigor físico formidável, paciência e profundo respeito pela força da natureza.",
        abilityOptions: ['str', 'con', 'wis'],
        featId: 'tough',
        featName: 'Vigoroso (Tough)',
        skillProficiencies: ['Adestrar Animais', 'Natureza'],
        toolProficiencies: ['Ferramentas de Carpinteiro'],
        equipment: ['Foice', 'Ferramentas de Carpinteiro', 'Kit de Curandeiro', 'Balde de Ferro', 'Pá', 'Roupas de Trabalho', '30 PO (ou 50 PO)'],
        feature: {
            name: "Vigor Físico Inabalável",
            description: "Seus pontos de vida máximos aumentam em 2 por nível do personagem retroativamente e a cada avanço."
        }
    },
    {
        id: 'guard',
        name: 'Guarda',
        system: 'dnd55e',
        description: "Treinado para vigiar muralhas, portões de cidades ou comboios de mercadores, você desenvolveu prontidão marcial e atenção vigilante contra saqueadores e encrenqueiros.",
        abilityOptions: ['str', 'int', 'wis'],
        featId: 'alert',
        featName: 'Alerta (Alert)',
        skillProficiencies: ['Atletismo', 'Percepção'],
        toolProficiencies: ['Kit de Jogos'],
        equipment: ['Lança', 'Besta Leve', '20 Virotes', 'Kit de Jogos', 'Aljava', 'Grilhões', 'Lanterna Coberta', 'Roupas de Viagem', '12 PO (ou 50 PO)'],
        feature: {
            name: "Prontidão de Sentinela",
            description: "Adiciona PB à iniciativa e pode trocar sua vez na ordem de turnos com um aliado disposto."
        }
    },
    {
        id: 'guide',
        name: 'Guia',
        system: 'dnd55e',
        description: "Você viveu nos ermos, longe das cidades, guiando caravanas por florestas densas, montanhas escarpadas e riachos, aprendendo a comunhão e a magia da natureza selvagem.",
        abilityOptions: ['dex', 'con', 'wis'],
        featId: 'magic_initiate',
        featName: 'Iniciado em Magia (Druida)',
        skillProficiencies: ['Furtividade', 'Sobrevivência'],
        toolProficiencies: ['Ferramentas de Cartógrafo'],
        equipment: ['Arco Curto', '20 Flechas', 'Ferramentas de Cartógrafo', 'Aljava', 'Roupas de Viagem', 'Saco de Dormir', 'Tenda', '3 PO (ou 50 PO)'],
        feature: {
            name: "Sussurros da Terra",
            description: "Você conhece dois truques e uma magia de 1º círculo de Druida, que pode conjurar sem espaço de magia 1 vez por Descanso Longo."
        }
    },
    {
        id: 'sailor',
        name: 'Marinheiro',
        system: 'dnd55e',
        description: "Com o vento no rosto e conveses balançando sob seus pés, você enfrentou tempestades marítimas, batalhas portuárias e aprendeu a lutar com socos e cabeçadas em tavernas do cais.",
        abilityOptions: ['str', 'dex', 'wis'],
        featId: 'tavern_brawler',
        featName: 'Valentão de Taverna (Tavern Brawler)',
        skillProficiencies: ['Acrobacia', 'Percepção'],
        toolProficiencies: ['Ferramentas de Navegador'],
        equipment: ['Adaga', 'Ferramentas de Navegador', 'Corda de Seda (15m)', 'Roupas de Viagem', '20 PO (ou 50 PO)'],
        feature: {
            name: "Lutador de Convés",
            description: "Seus ataques desarmados causam 1d4 + FOR de dano, você pode empurrar oponentes 1,5m em acertos e rerrola 1s no dano desarmado."
        }
    },
    {
        id: 'merchant',
        name: 'Mercador',
        system: 'dnd55e',
        description: "Aprendiz de comerciantes e mestres de caravanas, você viajou por feiras e capitais comprando, barganhando e negociando bens raros, contando sempre com a fortuna nos negócios.",
        abilityOptions: ['con', 'int', 'cha'],
        featId: 'lucky',
        featName: 'Sortudo (Lucky)',
        skillProficiencies: ['Adestrar Animais', 'Persuasão'],
        toolProficiencies: ['Ferramentas de Navegador'],
        equipment: ['Ferramentas de Navegador', '2 Algibeiras', 'Roupas Finas de Viagem', '22 PO (ou 50 PO)'],
        feature: {
            name: "Bênção da Fortuna",
            description: "Pontos de Sorte para alterar os ventos do destino a seu favor em jogadas de d20 cruciais."
        }
    },
    {
        id: 'noble',
        name: 'Nobre',
        system: 'dnd55e',
        description: "Criado em palácios ou mansões senhoriais, você recebeu educação de primeira classe sobre leis, política e etiqueta cortesã, acostumado a comandar e exercer liderança.",
        abilityOptions: ['str', 'int', 'cha'],
        featId: 'skilled',
        featName: 'Habilidoso (Skilled)',
        skillProficiencies: ['História', 'Persuasão'],
        toolProficiencies: ['Kit de Jogos'],
        equipment: ['Kit de Jogos', 'Perfume Exótico', 'Roupas Finas Aristocráticas', '29 PO (ou 50 PO)'],
        feature: {
            name: "Educação Aristocrática",
            description: "Três perícias ou ferramentas adicionais decorrentes de tutores e mestres da corte."
        }
    },
    {
        id: 'sage',
        name: 'Sábio',
        system: 'dnd55e',
        description: "Passou anos folheando tomos antigos em bibliotecas, academias arcanas ou torres de arquimagos, desvendando segredos do multiverso e os primeiros fundamentos da manipulação mágica.",
        abilityOptions: ['con', 'int', 'wis'],
        featId: 'magic_initiate',
        featName: 'Iniciado em Magia (Mago)',
        skillProficiencies: ['Arcanismo', 'História'],
        toolProficiencies: ['Suprimentos de Calígrafo'],
        equipment: ['Bordão', 'Suprimentos de Calígrafo', 'Livro de História Arcana', 'Pergaminho (8 folhas)', 'Túnica', '8 PO (ou 50 PO)'],
        feature: {
            name: "Iniciação Arcana",
            description: "Aprende dois truques e uma magia de 1º círculo de Mago, que pode ser conjurada 1x por Descanso Longo sem gastar espaço."
        }
    },
    {
        id: 'soldier',
        name: 'Soldado',
        system: 'dnd55e',
        description: "Você treinou para a guerra nas linhas de infantaria ou cavalaria de um exército real. O combate está no seu sangue e seus golpes atingem os pontos vitais dos inimigos com ferocidade implacável.",
        abilityOptions: ['str', 'dex', 'con'],
        featId: 'savage_attacker',
        featName: 'Atacante Selvagem (Savage Attacker)',
        skillProficiencies: ['Atletismo', 'Intimidação'],
        toolProficiencies: ['Kit de Jogos'],
        equipment: ['Lança', 'Arco Curto', '20 Flechas', 'Kit de Curandeiro', 'Kit de Jogos', 'Aljava', 'Roupas de Campanha', '14 PO (ou 50 PO)'],
        feature: {
            name: "Ataque Implacável",
            description: "Uma vez por turno ao acertar com uma arma, você pode rolar o dano duas vezes e escolher o maior resultado."
        }
    },

    // =========================================================================
    // THE WITCHER ADAPTADO (PRESERVADO)
    // =========================================================================
    {
        id: 'witcher_hunter',
        name: 'Caçador de Monstros',
        system: 'witcher',
        description: "Criado nas fortalezas isoladas como Kaer Morhen ou Gweechydd, você foi submetido a mutações dolorosas e treinado em alquimia, rastreamento de bestas e sobrevivência implacável.",
        abilityOptions: ['str', 'dex', 'con'],
        featId: 'tough',
        featName: 'Vigoroso (Tough)',
        skillProficiencies: ['Investigação', 'Sobrevivência'],
        toolProficiencies: ['Kit de Alquimia'],
        equipment: ['Kit de Alquimia', 'Óleo de Prata Básico', '2 Poções Andorinha', 'Roupas de Couro de Viagem', 'Algibeira com 25 PO'],
        feature: {
            name: "Sentidos de Bruxo",
            description: "Você tem facilidade para rastrear monstros sobrenaturais através de sangue, pegadas e resíduos mágicos, e resiste aos rigores da estrada."
        }
    },

    // =========================================================================
    // COMPATIBILIDADE RETROATIVA
    // =========================================================================
    {
        id: 'folk_hero',
        name: 'Herói do Povo',
        system: 'dnd55e',
        description: "Você vem de classe social humilde, mas se levantou contra tiranos e monstros em defesa da população.",
        abilityOptions: ['str', 'con', 'wis'],
        featId: 'tough',
        featName: 'Vigoroso',
        skillProficiencies: ['Adestrar Animais', 'Sobrevivência'],
        toolProficiencies: ['Ferramentas de Artesão', 'Veículos Terrestres'],
        equipment: ['Pá', 'Pote de Ferro', 'Roupas Comuns', 'Algibeira com 10 PO'],
        feature: {
            name: "Hospitalidade Rústica",
            description: "Você se mistura facilmente entre camponeses e plebeus, encontrando abrigo e abrigo seguro."
        }
    }
];
