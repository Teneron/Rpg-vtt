import type { Companion, Character } from '../characterTypes';

export type CompanionCategory =
    | 'beast_master'
    | 'chain_warlock'
    | 'find_familiar'
    | 'steed'
    | 'market_animal'
    | 'artificer';

export interface CompanionPreset {
    id: string;
    name: string;
    creatureType: string;
    type: Companion['type'];
    category: CompanionCategory;
    requiredSource: string; // Regra/Requisito Oficial do Livro
    description: string;
    size: Companion['size'];
    baseHp: number;
    hpPerLevel?: number; // Para Bestas Primordiais que escalam com o nível do Ranger
    baseAc: number;
    acAddsPb?: boolean; // 13 + PB
    speed: string;
    visionRange?: number;
    avatarUrl: string;
    canAttack?: boolean; // Pelo PHB oficial, familiares comuns não realizam ataque
    attributes: {
        str: number;
        dex: number;
        con: number;
        int: number;
        wis: number;
        cha: number;
    };
    attacks: Array<{
        name: string;
        baseAttackBonus: number;
        damageDice: string;
        damageType: string;
        range?: string;
        description?: string;
        scalesWithPb?: boolean;
    }>;
    features: Array<{
        name: string;
        description: string;
    }>;
    skills?: string;
}

export const COMPANION_PRESETS: CompanionPreset[] = [
    // --- 1. PATRULHEIRO: MESTRE DAS BESTAS (D&D 5.5e 2024 / TASHA) ---
    {
        id: 'beast_land',
        name: 'Besta da Terra',
        creatureType: 'Besta Primordial (Terrestre)',
        type: 'beast_companion',
        category: 'beast_master',
        requiredSource: 'Guardião: Mestre das Bestas (Nível 3+)',
        description: 'Espírito primordial vinculado ao Guardião. Ágil, leal e feroz, ideal para a linha de frente.',
        size: 'Médio',
        baseHp: 5,
        hpPerLevel: 5, // 5 + 5x Nível do Guardião
        baseAc: 13,
        acAddsPb: true, // 13 + PB do Guardião
        speed: '12m, Escalada 12m',
        visionRange: 18,
        canAttack: true,
        avatarUrl: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=150',
        attributes: { str: 14, dex: 14, con: 15, int: 8, wis: 14, cha: 11 },
        attacks: [
            {
                name: 'Golpe da Fera',
                baseAttackBonus: 2, // Mod Sabedoria + PB
                damageDice: '1d8 + 2',
                damageType: 'Cortante ou Perfurante',
                range: '1,5m',
                scalesWithPb: true,
                description: 'Ataque corpo a corpo usando sabedoria primal.'
            },
            {
                name: 'Bote Agressivo (Mauling Pounce)',
                baseAttackBonus: 2,
                damageDice: '1d8 + 2',
                damageType: 'Concussão',
                range: '1,5m',
                scalesWithPb: true,
                description: 'Se a besta se mover pelo menos 6m em linha reta antes de acertar, o alvo deve ter sucesso em Salvaguarda de Força (CD de Conjurador) ou fica Caído.'
            }
        ],
        features: [
            {
                name: 'Vínculo Primal (Livro do Jogador)',
                description: 'A criatura adiciona seu Bônus de Proficiência (PB) à CA, a todas as salvaguardas e ao dano dos ataques.'
            },
            {
                name: 'Comando com Ação Bônus',
                description: 'Em combate, você gasta sua Ação Bônus para ordenar que a Besta realize a ação Atacar, Disparar, Desengajar ou Esquivar.'
            }
        ],
        skills: 'Percepção +4, Furtividade +4'
    },
    {
        id: 'beast_sky',
        name: 'Besta do Céu',
        creatureType: 'Besta Primordial (Aérea)',
        type: 'beast_companion',
        category: 'beast_master',
        requiredSource: 'Guardião: Mestre das Bestas (Nível 3+)',
        description: 'Espírito primordial alado. Rápido como um relâmpago, voa pelos céus sem provocar ataques de oportunidade.',
        size: 'Pequeno',
        baseHp: 4,
        hpPerLevel: 4, // 4 + 4x Nível do Guardião
        baseAc: 13,
        acAddsPb: true,
        speed: '3m, Voo 18m',
        visionRange: 18,
        canAttack: true,
        avatarUrl: 'https://images.unsplash.com/photo-1611689342806-0863700ce1e4?w=150',
        attributes: { str: 6, dex: 16, con: 13, int: 8, wis: 14, cha: 11 },
        attacks: [
            {
                name: 'Garras Despedaçadoras (Shred)',
                baseAttackBonus: 2,
                damageDice: '1d4 + 3',
                damageType: 'Cortante',
                range: '1,5m',
                scalesWithPb: true,
                description: 'Golpe aéreo rasgante com as garras.'
            }
        ],
        features: [
            {
                name: 'Sobrevoo (Flyby)',
                description: 'A besta não provoca ataques de oportunidade ao voar para fora do alcance de um inimigo.'
            },
            {
                name: 'Vínculo Primal (Livro do Jogador)',
                description: 'Soma o PB do Guardião à CA, salvaguardas e dano.'
            }
        ],
        skills: 'Percepção +4'
    },
    {
        id: 'beast_sea',
        name: 'Besta do Mar',
        creatureType: 'Besta Primordial (Aquática)',
        type: 'beast_companion',
        category: 'beast_master',
        requiredSource: 'Guardião: Mestre das Bestas (Nível 3+)',
        description: 'Espírito das águas profundas e pântanos. Anfíbia e perita em imobilizar presas com constrição.',
        size: 'Médio',
        baseHp: 5,
        hpPerLevel: 5,
        baseAc: 13,
        acAddsPb: true,
        speed: '1,5m, Natação 18m',
        visionRange: 18,
        canAttack: true,
        avatarUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=150',
        attributes: { str: 14, dex: 14, con: 15, int: 8, wis: 14, cha: 11 },
        attacks: [
            {
                name: 'Golpe Aprisionador (Binding Strike)',
                baseAttackBonus: 2,
                damageDice: '1d6 + 2',
                damageType: 'Perfurante ou Concussão',
                range: '1,5m',
                scalesWithPb: true,
                description: 'Ao acertar, o alvo fica Agarrado pela besta (CD de escape igual à CD de magia do Guardião).'
            }
        ],
        features: [
            {
                name: 'Anfíbia',
                description: 'A criatura respira debaixo dágua e em terra firme livremente.'
            }
        ],
        skills: 'Percepção +4, Atletismo +4'
    },

    // --- 2. BRUXO: PACTO DA CORRENTE (D&D 5e / 2024 PACT OF THE CHAIN) ---
    {
        id: 'imp',
        name: 'Diabrete (Imp)',
        creatureType: 'Corruptor Menor',
        type: 'familiar',
        category: 'chain_warlock',
        requiredSource: 'Bruxo: Pacto da Corrente (Nível 3+)',
        description: 'Espírito infernal astuto concedido pelo patrono. Fica invisível à vontade e ferroa com veneno mortal.',
        size: 'Miúdo',
        baseHp: 10,
        baseAc: 13,
        speed: '6m, Voo 12m',
        visionRange: 36, // Visão Diabólica (36m inclusive escuridão mágica!)
        canAttack: true,
        avatarUrl: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=150',
        attributes: { str: 6, dex: 17, con: 13, int: 11, wis: 12, cha: 14 },
        attacks: [
            {
                name: 'Ferrão Venenoso',
                baseAttackBonus: 5,
                damageDice: '1d4 + 3',
                damageType: 'Perfurante + 3d6 Veneno',
                range: '1,5m',
                description: 'Alvo sofre 1d4+3 perfurante e deve passar em TR de Constituição CD 11 ou sofrer 3d6 de veneno (metade se passar).'
            }
        ],
        features: [
            {
                name: 'Ataque do Bruxo (Regra PHB)',
                description: 'Quando o Bruxo usa a ação Atacar, pode abrir mão de um ataque para que o Diabrete ataque com sua Reação.'
            },
            {
                name: 'Invisibilidade (Ação)',
                description: 'O diabrete fica magicamente invisível até atacar ou perder concentração.'
            },
            {
                name: 'Visão Diabólica',
                description: 'Escuridão mágica não impede a visão no escuro de 36m do diabrete.'
            },
            {
                name: 'Resistência à Magia',
                description: 'Vantagem em salvaguardas contra magias e outros efeitos mágicos.'
            }
        ],
        skills: 'Enganação +4, Furtividade +5, Percepção +3'
    },
    {
        id: 'pseudodragon',
        name: 'Pseudodragão',
        creatureType: 'Dragão Menor',
        type: 'familiar',
        category: 'chain_warlock',
        requiredSource: 'Bruxo: Pacto da Corrente (Nível 3+)',
        description: 'Pequeno dragão fiel com ferrão anestésico e forte ligação empática com seu bruxo.',
        size: 'Miúdo',
        baseHp: 7,
        baseAc: 13,
        speed: '4,5m, Voo 18m',
        visionRange: 18,
        canAttack: true,
        avatarUrl: 'https://images.unsplash.com/photo-1579202673506-ca3ce28943ef?w=150',
        attributes: { str: 6, dex: 15, con: 13, int: 10, wis: 12, cha: 10 },
        attacks: [
            {
                name: 'Ferrão Sonífero',
                baseAttackBonus: 4,
                damageDice: '1d4 + 2',
                damageType: 'Perfurante',
                range: '1,5m',
                description: 'Alvo faz TR Constituição CD 11 ou fica Envenenado por 1 hora. Se falhar por 5 ou mais, o alvo cai Inconsciente!'
            }
        ],
        features: [
            {
                name: 'Sentidos Aguçados & Percepção às Cegas 3m',
                description: 'Detecta arredores imediatos sem depender da visão e tem vantagem em Percepção.'
            },
            {
                name: 'Resistência à Magia',
                description: 'Vantagem em testes de resistência contra magias e outros efeitos mágicos.'
            },
            {
                name: 'Telepatia Limitada (30m)',
                description: 'Transmite pensamentos, imagens e emoções telepatia a até 30m.'
            }
        ],
        skills: 'Percepção +3, Furtividade +4'
    },
    {
        id: 'quasit',
        name: 'Quasit',
        creatureType: 'Demônio Menor',
        type: 'familiar',
        category: 'chain_warlock',
        requiredSource: 'Bruxo: Pacto da Corrente (Nível 3+)',
        description: 'Demônio caótico e sorrateiro que aterroriza inimigos e se camufla com invisibilidade.',
        size: 'Miúdo',
        baseHp: 7,
        baseAc: 13,
        speed: '12m',
        visionRange: 36,
        canAttack: true,
        avatarUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=150',
        attributes: { str: 5, dex: 17, con: 10, int: 7, wis: 10, cha: 10 },
        attacks: [
            {
                name: 'Garras Venenosas',
                baseAttackBonus: 4,
                damageDice: '1d4 + 3',
                damageType: 'Cortante + 2d4 Veneno',
                range: '1,5m',
                description: 'Causa 1d4+3 cortante e alvo faz TR Constituição CD 10 ou sofre 2d4 veneno e fica Envenenado por 1 minuto.'
            }
        ],
        features: [
            {
                name: 'Invisibilidade (Ação)',
                description: 'Fica invisível até atacar ou usar Amedrontar.'
            },
            {
                name: 'Amedrontar (1x/Dia)',
                description: 'Uma criatura a até 6m deve passar em TR Sabedoria CD 10 ou ficar Amedrontada por 1 minuto.'
            }
        ],
        skills: 'Furtividade +5'
    },

    // --- 3. FAMILIARES COMUNS (MAGIA: ENCONTRAR FAMILIAR / COMPANHEIRO SELVAGEM) ---
    {
        id: 'owl',
        name: 'Coruja (Familiar)',
        creatureType: 'Besta / Familiar',
        type: 'familiar',
        category: 'find_familiar',
        requiredSource: 'Magia: Encontrar Familiar (Mago/Druida)',
        description: 'Excelente batedora aérea noturna. Possui sobrevoo para dar a ação Ajudar sem se expor a ataques.',
        size: 'Miúdo',
        baseHp: 3,
        baseAc: 11,
        speed: '1,5m, Voo 18m',
        visionRange: 18,
        canAttack: false, // Regra oficial: familiares comuns não atacam!
        avatarUrl: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=150',
        attributes: { str: 3, dex: 13, con: 8, int: 2, wis: 12, cha: 7 },
        attacks: [],
        features: [
            {
                name: 'Regra Oficial de Familiar (PHB)',
                description: 'Familiares comuns NÃO podem atacar em combate. Devem usar ações como Ajudar (concedendo vantagem em ataque/teste ao mestre), Desengajar, Disparar, Esconder-se ou Descarregar magias de toque conjuradas pelo mestre.'
            },
            {
                name: 'Sobrevoo (Flyby)',
                description: 'A coruja não provoca ataques de oportunidade ao voar para fora do alcance de um inimigo.'
            },
            {
                name: 'Visão e Audição Aguçadas',
                description: 'Vantagem em testes de Percepção baseados em visão ou audição.'
            }
        ],
        skills: 'Percepção +3, Furtividade +3'
    },
    {
        id: 'cat',
        name: 'Gato (Familiar)',
        creatureType: 'Besta / Familiar',
        type: 'familiar',
        category: 'find_familiar',
        requiredSource: 'Magia: Encontrar Familiar (Mago/Druida)',
        description: 'Silencioso e ágil, especialista em se infiltrar e espreitar em ambientes urbanos e masmorras.',
        size: 'Miúdo',
        baseHp: 2,
        baseAc: 12,
        speed: '12m, Escalada 9m',
        visionRange: 12,
        canAttack: false,
        avatarUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=150',
        attributes: { str: 3, dex: 15, con: 10, int: 3, wis: 12, cha: 7 },
        attacks: [],
        features: [
            {
                name: 'Regra Oficial de Familiar (PHB)',
                description: 'Familiares comuns NÃO atacam em combate. Podem usar ação Ajudar, Desengajar, Esconder-se ou canalizar magias de toque do mestre.'
            },
            {
                name: 'Faro e Audição Aguçados',
                description: 'Vantagem em testes de Percepção baseados em olfato e audição.'
            }
        ],
        skills: 'Furtividade +4, Percepção +3'
    },
    {
        id: 'raven',
        name: 'Corvo (Familiar)',
        creatureType: 'Besta / Familiar',
        type: 'familiar',
        category: 'find_familiar',
        requiredSource: 'Magia: Encontrar Familiar (Mago/Druida)',
        description: 'Pássaro inteligente com capacidade de mímica vocal e comunicação à distância.',
        size: 'Miúdo',
        baseHp: 2,
        baseAc: 12,
        speed: '3m, Voo 15m',
        canAttack: false,
        avatarUrl: 'https://images.unsplash.com/photo-1522858547137-f1dcec554f55?w=150',
        attributes: { str: 2, dex: 14, con: 8, int: 2, wis: 12, cha: 6 },
        attacks: [],
        features: [
            {
                name: 'Regra Oficial de Familiar (PHB)',
                description: 'Familiares comuns NÃO atacam em combate. Atuam como batedores, apoio com Ajudar e canalizadores de magias de toque.'
            },
            {
                name: 'Mímica',
                description: 'Pode imitar sons simples que ouviu, como vozes curtas ou passos. Teste de Intuição CD 10 para discernir.'
            }
        ],
        skills: 'Percepção +3'
    },
    {
        id: 'bat',
        name: 'Morcego (Familiar)',
        creatureType: 'Besta / Familiar',
        type: 'familiar',
        category: 'find_familiar',
        requiredSource: 'Magia: Encontrar Familiar (Mago/Druida)',
        description: 'Perfeito para exploração em cavernas e escuridão mágica total devido à ecolocalização.',
        size: 'Miúdo',
        baseHp: 1,
        baseAc: 12,
        speed: '1,5m, Voo 9m',
        visionRange: 18,
        canAttack: false,
        avatarUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=150',
        attributes: { str: 2, dex: 15, con: 8, int: 2, wis: 12, cha: 4 },
        attacks: [],
        features: [
            {
                name: 'Ecolocalização (Percepção às Cegas 18m)',
                description: 'Enxerga perfeitamente na escuridão mundana ou mágica desde que não esteja ensurdecido.'
            },
            {
                name: 'Audição Aguçada',
                description: 'Vantagem em testes de Percepção baseados em audição.'
            }
        ]
    },

    // --- 4. MONTARIA CELESTIAL (MAGIA: ENCONTRAR MONTARIA / PALADINO) ---
    {
        id: 'warhorse_steed',
        name: 'Corcel Celestial de Guerra',
        creatureType: 'Celestial / Besta Mágica',
        type: 'steed',
        category: 'steed',
        requiredSource: 'Paladino: Magia Encontrar Montaria',
        description: 'Montaria corajosa concedida por juramento ou vínculo celestial. Atropela inimigos com cascos pesados.',
        size: 'Grande',
        baseHp: 19,
        baseAc: 12,
        speed: '18m',
        canAttack: true,
        avatarUrl: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=150',
        attributes: { str: 18, dex: 12, con: 13, int: 6, wis: 12, cha: 8 },
        attacks: [
            {
                name: 'Cascos de Guerra',
                baseAttackBonus: 6,
                damageDice: '2d6 + 4',
                damageType: 'Concussão',
                range: '1,5m',
                description: 'Golpe poderoso com os cascos.'
            },
            {
                name: 'Atropelar (Trampling Charge)',
                baseAttackBonus: 6,
                damageDice: '2d6 + 4',
                damageType: 'Concussão',
                range: '1,5m',
                description: 'Se mover pelo menos 6m em linha reta até o alvo e acertar com os Cascos, alvo faz TR de Força CD 14 ou cai no chão, permitindo 1 ataque bônus de cascos.'
            }
        ],
        features: [
            {
                name: 'Vínculo com Montaria (Livro do Jogador)',
                description: 'Magias conjuradas pelo cavaleiro com alcance "Pessoal" também afetam o corcel enquanto montado.'
            }
        ]
    },

    // --- 5. ANIMAIS NORMAIS DE MERCADO (PHB CAPÍTULO 5 - EQUIPAMENTO) ---
    {
        id: 'mastiff_pet',
        name: 'Mastim (Cão de Guarda)',
        creatureType: 'Besta Comum',
        type: 'custom',
        category: 'market_animal',
        requiredSource: 'Mercado Comum (PHB Cap. 5 - Custo: 25 PO)',
        description: 'Cão de guarda robusto treinado para proteger o acampamento e derrubar intrusos. Ficha estática do Livro dos Monstros.',
        size: 'Médio',
        baseHp: 5,
        baseAc: 12,
        speed: '12m',
        canAttack: true,
        avatarUrl: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=150',
        attributes: { str: 13, dex: 14, con: 12, int: 3, wis: 12, cha: 7 },
        attacks: [
            {
                name: 'Mordida',
                baseAttackBonus: 3,
                damageDice: '1d6 + 1',
                damageType: 'Perfurante',
                range: '1,5m',
                description: 'Se o alvo for uma criatura, deve passar em Salvaguarda de Força CD 11 ou cair Caído.'
            }
        ],
        features: [
            {
                name: 'Faro e Audição Aguçados',
                description: 'Vantagem em testes de Percepção que dependam de olfato ou audição.'
            },
            {
                name: 'Criatura Mundana',
                description: 'Animal comum sem vínculo mágico de ressurreição. Se morrer, deve ser adquirido outro no mercado.'
            }
        ],
        skills: 'Percepção +3'
    },
    {
        id: 'mule_pet',
        name: 'Mula de Carga',
        creatureType: 'Besta Comum',
        type: 'custom',
        category: 'market_animal',
        requiredSource: 'Mercado Comum (PHB Cap. 5 - Custo: 8 PO)',
        description: 'Animal de carga paciente e resistente para transportar tesouros e mochilas pesadas da expedição.',
        size: 'Médio',
        baseHp: 11,
        baseAc: 10,
        speed: '12m',
        canAttack: true,
        avatarUrl: 'https://images.unsplash.com/photo-1587574293340-e0011c4e8ecf?w=150',
        attributes: { str: 14, dex: 10, con: 13, int: 2, wis: 10, cha: 5 },
        attacks: [
            {
                name: 'Coice',
                baseAttackBonus: 2,
                damageDice: '1d4 + 2',
                damageType: 'Concussão',
                range: '1,5m'
            }
        ],
        features: [
            {
                name: 'Besta de Carga',
                description: 'A mula é considerada uma criatura Grande para efeitos de capacidade de transporte de carga.'
            }
        ]
    },

    // --- 6. ARTÍFICE: DEFENSOR DE AÇO (TCE) ---
    {
        id: 'steel_defender',
        name: 'Defensor de Aço',
        creatureType: 'Constructo Autômato',
        type: 'homunculus',
        category: 'artificer',
        requiredSource: 'Artífice: Batalhador Bélico (Nível 3+)',
        description: 'Constructo protetor construído pelo Artífice para absorver impactos e proteger seus companheiros.',
        size: 'Médio',
        baseHp: 2,
        hpPerLevel: 5,
        baseAc: 15,
        speed: '12m',
        visionRange: 18,
        canAttack: true,
        avatarUrl: 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=150',
        attributes: { str: 14, dex: 12, con: 14, int: 4, wis: 10, cha: 6 },
        attacks: [
            {
                name: 'Golpe de Força',
                baseAttackBonus: 4,
                damageDice: '1d8 + 2',
                damageType: 'Energia',
                range: '1,5m',
                scalesWithPb: true
            }
        ],
        features: [
            {
                name: 'Reparo Rápido (3x/Dia)',
                description: 'Ação mágica: recupera 2d8 + PB pontos de vida.'
            },
            {
                name: 'Reação Defensiva',
                description: 'Impõe desvantagem no ataque de um inimigo adjacente contra um aliado.'
            }
        ],
        skills: 'Percepção +4, Atletismo +4'
    }
];

export const calculateMod = (val: number): number => Math.floor((val - 10) / 2);

/**
 * Verifica se um personagem atende às regras oficiais do livro para aquele companheiro.
 */
export const checkMeetsRequirement = (
    character: Character,
    preset: CompanionPreset
): { meets: boolean; reason: string } => {
    const cls = (character.class || '').toLowerCase();
    const sub = (character.subclass || '').toLowerCase();
    const spells = (character.spells || []).map(s => (s.name || '').toLowerCase());
    const hasFindFamiliar = spells.some(s => s.includes('familiar'));
    const hasFindSteed = spells.some(s => s.includes('montaria') || s.includes('steed'));

    if (preset.category === 'beast_master') {
        const isRanger = cls.includes('ranger') || cls.includes('guardi') || cls.includes('patrulheiro');
        const isBeastMaster = sub.includes('besta') || sub.includes('beast');
        if (isRanger && isBeastMaster) {
            return { meets: true, reason: 'Atendido: Você é um Guardião Mestre das Bestas!' };
        }
        return { meets: false, reason: 'Requer: Patrulheiro (Ranger) com a subclasse Mestre das Bestas (Nível 3+).' };
    }

    if (preset.category === 'chain_warlock') {
        const isWarlock = cls.includes('warlock') || cls.includes('bruxo');
        const isChain = sub.includes('corrente') || sub.includes('chain') || (character.features || []).some(f => (f.name || '').toLowerCase().includes('corrente'));
        if (isWarlock && isChain) {
            return { meets: true, reason: 'Atendido: Você possui o Pacto da Corrente!' };
        }
        return { meets: false, reason: 'Requer: Bruxo com o Pacto da Corrente (Nível 3+).' };
    }

    if (preset.category === 'find_familiar') {
        const isWizard = cls.includes('mago') || cls.includes('wizard');
        const isDruid = cls.includes('druida') || cls.includes('druid');
        if (hasFindFamiliar || isWizard || isDruid) {
            return { meets: true, reason: 'Atendido: Você tem acesso à magia Encontrar Familiar ou Companheiro Selvagem.' };
        }
        return { meets: false, reason: 'Requer: Magia Encontrar Familiar ou recurso de Druida (Companheiro Selvagem).' };
    }

    if (preset.category === 'steed') {
        const isPaladin = cls.includes('paladin') || cls.includes('paladino');
        if (hasFindSteed || isPaladin) {
            return { meets: true, reason: 'Atendido: Você possui acesso à Montaria Fiel de Paladino.' };
        }
        return { meets: false, reason: 'Requer: Paladino com a magia Encontrar Montaria.' };
    }

    if (preset.category === 'market_animal') {
        return { meets: true, reason: 'Animal comum disponível para compra com ouro no mercado (PHB Cap. 5).' };
    }

    if (preset.category === 'artificer') {
        const isArtificer = cls.includes('artif') || cls.includes('artífice');
        if (isArtificer) {
            return { meets: true, reason: 'Atendido: Você é um Artífice Batalhador Bélico!' };
        }
        return { meets: false, reason: 'Requer: Classe Artífice.' };
    }

    return { meets: true, reason: 'Autorizado.' };
};

/**
 * Instancia um companheiro a partir de um preset, escalando com o nível do mestre/jogador.
 */
export const instantiateCompanion = (
    presetId: string,
    ownerLevel = 1,
    ownerSpellAbilityMod = 3,
    ownerProfBonus = 2
): Companion => {
    const preset = COMPANION_PRESETS.find(p => p.id === presetId) || COMPANION_PRESETS[0];

    const safeLevel = Math.max(1, ownerLevel);
    const safePb = Math.max(2, ownerProfBonus);

    // HP calculation estrito pelas regras
    let maxHp = preset.baseHp;
    if (preset.hpPerLevel) {
        maxHp = preset.baseHp + (preset.hpPerLevel * safeLevel);
    }

    // AC calculation estrito pelas regras
    let finalAc = preset.baseAc;
    if (preset.acAddsPb) {
        finalAc = preset.baseAc + safePb;
    }

    // Attacks calculation
    const attacks = preset.attacks.map(atk => {
        let hitBonus = atk.baseAttackBonus;
        let dmg = atk.damageDice;

        if (atk.scalesWithPb) {
            hitBonus = ownerSpellAbilityMod + safePb;
            dmg = `${atk.damageDice} + ${safePb}`;
        }

        return {
            name: atk.name,
            attackBonus: hitBonus,
            damage: dmg,
            damageType: atk.damageType,
            range: atk.range,
            description: atk.description
        };
    });

    const attributes = {
        str: { value: preset.attributes.str, modifier: calculateMod(preset.attributes.str) },
        dex: { value: preset.attributes.dex, modifier: calculateMod(preset.attributes.dex) },
        con: { value: preset.attributes.con, modifier: calculateMod(preset.attributes.con) },
        int: { value: preset.attributes.int, modifier: calculateMod(preset.attributes.int) },
        wis: { value: preset.attributes.wis, modifier: calculateMod(preset.attributes.wis) },
        cha: { value: preset.attributes.cha, modifier: calculateMod(preset.attributes.cha) }
    };

    return {
        id: `comp_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
        presetId: preset.id,
        name: preset.name,
        type: preset.type,
        creatureType: preset.creatureType,
        avatarUrl: preset.avatarUrl,
        size: preset.size,
        baseHp: preset.baseHp,
        hpPerLevel: preset.hpPerLevel,
        hp: {
            current: maxHp,
            max: maxHp,
            temp: 0
        },
        baseAc: preset.baseAc,
        acAddsPb: preset.acAddsPb,
        ac: finalAc,
        acBreakdown: preset.acAddsPb
            ? `Base ${preset.baseAc} + Bônus Prof. (+${safePb}) = ${finalAc}`
            : `Base ${preset.baseAc}`,
        speed: preset.speed,
        visionRange: preset.visionRange,
        attributes,
        attacks,
        features: preset.features,
        skills: preset.skills,
        notes: `${preset.description}\n[Regra Oficial: ${preset.requiredSource}]`
    };
};
