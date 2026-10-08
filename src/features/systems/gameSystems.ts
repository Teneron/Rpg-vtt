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
}

export const GAME_SYSTEMS: GameSystem[] = [
    {
        id: 'dnd5e',
        name: 'Fantasia Medieval & The Witcher',
        genre: 'Dark Fantasy & D&D 5e',
        tagline: 'Espadas de Prata, Magia Ancestral, Bestas e Destino',
        description: 'Mergulhe no Continente e nos Reinos Esquecidos. Caçadores de monstros, conjuradores arcanos e guerreiros lendários enfrentam relíquias, escuridão e conspirações políticas.',
        accentColor: '#c5a059',
        secondaryColor: '#950740',
        glowColor: 'rgba(197, 160, 89, 0.4)',
        bgGradient: 'linear-gradient(145deg, rgba(30, 20, 15, 0.95) 0%, rgba(15, 10, 12, 0.98) 100%)',
        borderColor: '#805d26',
        badgeIcon: '⚔️🐺',
        badgeText: 'Fantasia Medieval',
        tags: ['D&D 5e', 'The Witcher', 'Grimório Arcano', 'Bestiário Sombrio'],
        features: [
            'Ficha completa com magias, sinais arcanos e alquimia',
            'Bestiário com necrofagos, espectros e dragões',
            'Rolagens 3D realistas com Cannon Physics',
            'Visão no escuro e tochas com raycasting dinâmico'
        ],
        recommendedDice: 'd20 + d6, d8, d10, d12, d100',
        loreIntro: 'O vento uiva através das florestas ancestrais de Velen enquanto magos e bruxos preparam suas lâminas.'
    },
    {
        id: 'cyberpunk',
        name: 'Cyberpunk & Sci-Fi',
        genre: 'Distopia Futurista & Alta Tecnologia',
        tagline: 'Cromado, Neon, Megacorporações e Sobrevivência Urbana',
        description: 'Ruas chuvosas iluminadas por neon e arranha-céus corporativos. Mercenários cibernéticos, netrunners e solos lutam por reputação em um futuro implacável onde estilo é tudo.',
        accentColor: '#00f3ff',
        secondaryColor: '#ff0055',
        glowColor: 'rgba(0, 243, 255, 0.35)',
        bgGradient: 'linear-gradient(145deg, rgba(8, 20, 30, 0.95) 0%, rgba(18, 8, 25, 0.98) 100%)',
        borderColor: '#00b8c4',
        badgeIcon: '⚡🦾',
        badgeText: 'Cyberpunk Neon',
        tags: ['Cyberware', 'Netrunning', 'Armas Tecnológicas', 'Combate Urbano'],
        features: [
            'Iniciativa tática com foco em reflexos rápidos',
            'Combate urbano e armas de longo alcance',
            'Grid com tema high-tech e névoa tática digital',
            'Suporte a fichas de alta tecnologia e cibernética'
        ],
        recommendedDice: 'd10 + d6, d20, d100',
        loreIntro: 'Em meio ao brilho dos hologramas e cabos de fibra ótica, mercenários aceitam contratos letais nos becos da metrópole.'
    },
    {
        id: 'cthulhu',
        name: 'Terror Cósmico & Investigação',
        genre: 'Horror Lovecraftiano & Mistério',
        tagline: 'Segredos Arcanos, Cultos Proibidos e a Fragilidade da Mente',
        description: 'Ambientado nos anos 1920 ou na era moderna. Detetives, arqueólogos e estudiosos desvendam conspirações obscuras antes que os Grandes Antigos despertem.',
        accentColor: '#00ff9d',
        secondaryColor: '#0d5c3a',
        glowColor: 'rgba(0, 255, 157, 0.35)',
        bgGradient: 'linear-gradient(145deg, rgba(5, 25, 18, 0.95) 0%, rgba(6, 12, 10, 0.98) 100%)',
        borderColor: '#066d44',
        badgeIcon: '👁️🐙',
        badgeText: 'Horror Cósmico',
        tags: ['Investigação', 'Sanidade', 'Ocultismo', 'Grimórios'],
        features: [
            'Foco em pistas, testes de perícia e investigação',
            'Névoa de guerra densa e opressiva',
            'Atmosfera sonora de suspense e suspense psicológico',
            'Combate brutal onde a astúcia supera a força bruta'
        ],
        recommendedDice: 'd100 (Percentual) + d20, d6',
        loreIntro: 'Nas profundezas esquecidas do oceano e em bibliotecas proibidas, verdades que desafiam a sanidade aguardam.'
    },
    {
        id: 'custom',
        name: 'Mundo Personalizado & Sandbox',
        genre: 'Sistema Livre / Qualquer Cenário',
        tagline: 'Sua História, Suas Regras, Seu Universo',
        description: 'Crie ou adapte qualquer história: pós-apocalíptico, piratas, super-heróis, anime ou seu próprio RPG caseiro. A engine disponibiliza dados 3D, mapas e combate sem impor amarras.',
        accentColor: '#a855f7',
        secondaryColor: '#f59e0b',
        glowColor: 'rgba(168, 85, 247, 0.35)',
        bgGradient: 'linear-gradient(145deg, rgba(22, 12, 35, 0.95) 0%, rgba(12, 8, 20, 0.98) 100%)',
        borderColor: '#7e22ce',
        badgeIcon: '🎲✨',
        badgeText: 'Livre / Sandbox',
        tags: ['Qualquer Cenário', 'Regras Customizadas', 'Total Liberdade'],
        features: [
            'Agnóstico a regras: use qualquer sistema de RPG',
            'Gerenciamento flexível de monstros e tokens',
            'Total controle de mapas com iluminação 2D e paredes',
            'Sessões isoladas sem interferir em outras mesas'
        ],
        recommendedDice: 'Todos os tipos (d4 a d100)',
        loreIntro: 'Uma folha em branco diante do mestre. Dê vida a qualquer aventura imaginada.'
    }
];

export const getGameSystem = (id?: string | null): GameSystem => {
    if (!id) return GAME_SYSTEMS[0];
    const found = GAME_SYSTEMS.find(s => s.id === id);
    return found || GAME_SYSTEMS[0];
};
