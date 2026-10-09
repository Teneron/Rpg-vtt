export interface GameSystem {
    id: string;
    name: string;
    genre: string;
    tagline: string;
    description: string;
    accentColor: string;
    secondaryColor: string;
    glowColor: string;
    bgGradient: string;
    borderColor: string;
    badgeIcon: string;
    badgeText: string;
    tags: string[];
    features: string[];
    recommendedDice: string;
    loreIntro: string;
    rulebookSystemKey?: string;
}

export const GAME_SYSTEMS: GameSystem[] = [
    {
        id: 'witcher',
        name: 'The Witcher (Adaptado 5e)',
        genre: 'Dark Fantasy & Conjunção das Esferas (Regras 5e)',
        tagline: 'Espadas de Aço e Prata, Sinais Arcanos, 5 Escolas de Bruxo e Toxicidade',
        description: 'O universo sombrio de The Witcher 100% nativo no VTT com a consagrada adaptação para regras D&D 5e: Classe Bruxo com 5 Escolas (Lobo, Gato, Urso, Grifo, Víbora), Sinais (Aard, Igni, Quen, Yrden, Axii), sistema de Toxicidade Alquímica e o mapa oficial do Continente em alta resolução.',
        accentColor: '#c5a059',
        secondaryColor: '#881337',
        glowColor: 'rgba(197, 160, 89, 0.4)',
        bgGradient: 'linear-gradient(145deg, rgba(30, 20, 15, 0.95) 0%, rgba(15, 10, 12, 0.98) 100%)',
        borderColor: '#805d26',
        badgeIcon: 'WITCHER',
        badgeText: 'The Witcher (5e Nativo)',
        tags: ['Regras 5e Adaptadas', 'Classe Bruxo', '5 Escolas', 'Sinais & Toxicidade', 'Mapa do Continente'],
        features: [
            'Classe Bruxo com 5 Escolas (Lobo, Gato, Urso, Grifo, Víbora) no criador de personagens',
            'Sinais de Bruxo (Aard, Igni, Quen, Yrden, Axii) e barra de Toxicidade Alquímica integrada',
            'Mapa em altíssima resolução do Continente com tokens oficiais de Geralt e Ciri',
            'Bestiário do Continente adaptado: Afogadores, Carniçais, Katakan, Liche e Feras'
        ],
        recommendedDice: 'd20 + d4, d6, d8, d10, d12',
        loreIntro: 'O vento uiva através das florestas devastadas de Velen. Entre monstros e humanos cruéis, apenas os bruxos ousam caminhar.',
        rulebookSystemKey: 'witcher'
    },
    {
        id: 'dnd55e',
        name: 'D&D 5.5e (Regras Oficiais)',
        genre: 'Fantasia Heroica Épica & Livros Oficiais',
        tagline: 'Maestria de Armas, Talentos de Origem, Novas Espécies, Bastiões e Greyhawk',
        description: 'A edição oficial e revisada de Dungeons & Dragons. Inclui o sistema completo de Maestria de Armas (Cleave, Graze, Nick, Push, Sap, Slow, Topple, Vex), Talentos de Origem no 1º nível, Antecedentes com atributos integrados, novas subclasses, regras oficiais de Bastiões e o mapa clássico de Greyhawk.',
        accentColor: '#e11d48',
        secondaryColor: '#f59e0b',
        glowColor: 'rgba(225, 29, 72, 0.45)',
        bgGradient: 'linear-gradient(145deg, rgba(38, 12, 20, 0.95) 0%, rgba(20, 8, 14, 0.98) 100%)',
        borderColor: '#be123c',
        badgeIcon: 'D&D 5.5e',
        badgeText: 'D&D 5.5e Oficial',
        tags: ['Maestria de Armas', 'Talentos de Origem', '16 Antecedentes Oficiais', '10 Espécies', 'Sistema de Bastiões', 'Greyhawk'],
        features: [
            '8 Maestrias de Armas (Cleave, Graze, Nick, Push, Sap, Slow, Topple, Vex) ativas em combate',
            'Talentos de Origem no nível 1 e Antecedentes que determinam aumentos de atributos (+2/+1)',
            'Mecânicas de classes: Cunning Strike do Ladino, Mente Tática do Guerreiro e Fúria Primitiva',
            'Livro do Jogador (397p) e Livro do Mestre (361p) totalmente integrados nativamente'
        ],
        recommendedDice: 'd20 + d4, d6, d8, d10, d12, d100',
        loreIntro: 'Na encruzilhada de Oerth e através das torres da Cidade Livre de Greyhawk, novos heróis despertam com poderes refinados e armas magistrais.',
        rulebookSystemKey: 'dnd55e'
    }
];

export const getGameSystem = (id?: string | null): GameSystem => {
    if (!id) return GAME_SYSTEMS[0];
    const found = GAME_SYSTEMS.find(s => s.id === id);
    if (found) return found;
    if (id === 'dnd5e') return GAME_SYSTEMS[1]; // fallback for legacy dnd5e -> dnd55e
    return GAME_SYSTEMS[0];
};
