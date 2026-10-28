import type { Companion } from '../characterTypes';

export interface CompanionPreset {
    id: string;
    name: string;
    creatureType: string;
    type: Companion['type'];
    description: string;
    size: Companion['size'];
    baseHp: number;
    hpPerLevel?: number; // Para companheiros que escalam com nível do personagem (ex: Besta do Guardião)
    baseAc: number;
    acAddsPb?: boolean;
    speed: string;
    visionRange?: number;
    avatarUrl: string;
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
    // --- 1. PATRULHEIRO: MESTRE DAS BESTAS (BEAST MASTER 2024) ---
    {
        id: 'beast_land',
        name: 'Besta da Terra',
        creatureType: 'Besta Primordial (Terrestre)',
        type: 'beast_companion',
        description: 'Espírito primordial vinculado ao Guardião. Ágil, leal e feroz, ideal para linha de frente.',
        size: 'Médio',
        baseHp: 5,
        hpPerLevel: 5, // 5 + 5x Nível
        baseAc: 13,
        acAddsPb: true, // 13 + PB
        speed: '12m, Escalada 12m',
        visionRange: 18,
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
                name: 'Vínculo Primal',
                description: 'Adiciona seu Bônus de Proficiência à CA da criatura, salvaguardas e dano dos ataques.'
            },
            {
                name: 'Comando com Ação Bônus',
                description: 'Em combate, você pode gastar sua Ação Bônus para ordenar que a Besta faça a ação Atacar, Disparar, Desengajar ou Esquivar.'
            }
        ],
        skills: 'Percepção +4, Furtividade +4'
    },
    {
        id: 'beast_sky',
        name: 'Besta do Céu',
        creatureType: 'Besta Primordial (Aérea)',
        type: 'beast_companion',
        description: 'Espírito primordial alado. Rápido como um relâmpago, voa pelos céus sem provocar ataques de oportunidade.',
        size: 'Pequeno',
        baseHp: 4,
        hpPerLevel: 4, // 4 + 4x Nível
        baseAc: 13,
        acAddsPb: true,
        speed: '3m, Voo 18m',
        visionRange: 18,
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
                name: 'Vínculo Primal',
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
        description: 'Espírito das águas profundas e pântanos. Anfíbia e perita em imobilizar presas com constrição.',
        size: 'Médio',
        baseHp: 5,
        hpPerLevel: 5,
        baseAc: 13,
        acAddsPb: true,
        speed: '1,5m, Natação 18m',
        visionRange: 18,
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

    // --- 2. BRUXO: PACTO DA CORRENTE (PACT OF THE CHAIN) ---
    {
        id: 'imp',
        name: 'Diabrete (Imp)',
        creatureType: 'Corruptor Menor',
        type: 'familiar',
        description: 'Espírito infernal astuto, capaz de ficar invisível à vontade e ferroar com veneno mortal.',
        size: 'Miúdo',
        baseHp: 10,
        baseAc: 13,
        speed: '6m, Voo 12m',
        visionRange: 36, // Visão Diabólica (36m inclusive escuridão mágica!)
        avatarUrl: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=150',
        attributes: { str: 6, dex: 17, con: 13, int: 11, wis: 12, cha: 14 },
        attacks: [
            {
                name: 'Ferrão Venenoso',
                baseAttackBonus: 5,
                damageDice: '1d4 + 3',
                damageType: 'Perfurante + 3d6 Veneno',
                range: '1,5m',
                description: 'Alvo sofre 1d4+3 perfurante e deve passar em TR de Constituição CD 11 ou sofrer 3d6 de dano de veneno (metade se passar).'
            }
        ],
        features: [
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
            },
            {
                name: 'Metamorfose',
                description: 'Pode usar sua ação para se metamorfosear em rato, corvo ou aranha.'
            }
        ],
        skills: 'Enganação +4, Furtividade +5, Percepção +3'
    },
    {
        id: 'pseudodragon',
        name: 'Pseudodragão',
        creatureType: 'Dragão Menor',
        type: 'familiar',
        description: 'Pequeno dragão fiel com ferrão anestésico e forte ligação empática com seu conjurador.',
        size: 'Miúdo',
        baseHp: 7,
        baseAc: 13,
        speed: '4,5m, Voo 18m',
        visionRange: 18,
        avatarUrl: 'https://images.unsplash.com/photo-1579202673506-ca3ce28943ef?w=150',
        attributes: { str: 6, dex: 15, con: 13, int: 10, wis: 12, cha: 10 },
        attacks: [
            {
                name: 'Ferrão Sonífero',
                baseAttackBonus: 4,
                damageDice: '1d4 + 2',
                damageType: 'Perfurante',
                range: '1,5m',
                description: 'Alvo deve ter sucesso em TR Constituição CD 11 ou fica Envenenado por 1 hora. Se falhar por 5 ou mais, o alvo cai Inconsciente!'
            },
            {
                name: 'Mordida',
                baseAttackBonus: 4,
                damageDice: '1d4 + 2',
                damageType: 'Perfurante',
                range: '1,5m'
            }
        ],
        features: [
            {
                name: 'Sentidos Aguçados & Percepção às Cegas',
                description: 'Percepção às cegas de 3m e vantagem em testes de Sabedoria (Percepção) baseados em visão, olfato e audição.'
            },
            {
                name: 'Resistência à Magia',
                description: 'Vantagem em testes de resistência contra magias e outros efeitos mágicos.'
            },
            {
                name: 'Telepatia Limitada',
                description: 'Pode transmitir pensamentos, imagens e emoções telepatia a até 30m.'
            }
        ],
        skills: 'Percepção +3, Furtividade +4'
    },
    {
        id: 'quasit',
        name: 'Quasit',
        creatureType: 'Demônio Menor',
        type: 'familiar',
        description: 'Demônio caótico e sorrateiro que aterroriza inimigos e se camufla com invisibilidade.',
        size: 'Miúdo',
        baseHp: 7,
        baseAc: 13,
        speed: '12m',
        visionRange: 36,
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
            },
            {
                name: 'Resistência à Magia',
                description: 'Vantagem em salvaguardas contra magias.'
            }
        ],
        skills: 'Furtividade +5'
    },

    // --- 3. FAMILIARES COMUNS (ENCONTRAR FAMILIAR / COMPANHEIRO SELVAGEM) ---
    {
        id: 'owl',
        name: 'Coruja (Familiar)',
        creatureType: 'Besta / Familiar',
        type: 'familiar',
        description: 'Excelente batedora aérea noturna. Possui sobrevoo para aplicar a ação Ajudar sem se expor.',
        size: 'Miúdo',
        baseHp: 3,
        baseAc: 11,
        speed: '1,5m, Voo 18m',
        visionRange: 18,
        avatarUrl: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=150',
        attributes: { str: 3, dex: 13, con: 8, int: 2, wis: 12, cha: 7 },
        attacks: [
            {
                name: 'Garras',
                baseAttackBonus: 3,
                damageDice: '1',
                damageType: 'Cortante',
                range: '1,5m'
            }
        ],
        features: [
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
        description: 'Silencioso e ágil, especialista em se infiltrar e espreitar em ambientes urbanos.',
        size: 'Miúdo',
        baseHp: 2,
        baseAc: 12,
        speed: '12m, Escalada 9m',
        visionRange: 12,
        avatarUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=150',
        attributes: { str: 3, dex: 15, con: 10, int: 3, wis: 12, cha: 7 },
        attacks: [
            {
                name: 'Garras',
                baseAttackBonus: 0,
                damageDice: '1',
                damageType: 'Cortante',
                range: '1,5m'
            }
        ],
        features: [
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
        description: 'Pássaro inteligente com capacidade de mímica vocal e comunicação.',
        size: 'Miúdo',
        baseHp: 2,
        baseAc: 12,
        speed: '3m, Voo 15m',
        avatarUrl: 'https://images.unsplash.com/photo-1522858547137-f1dcec554f55?w=150',
        attributes: { str: 2, dex: 14, con: 8, int: 2, wis: 12, cha: 6 },
        attacks: [
            {
                name: 'Bico',
                baseAttackBonus: 4,
                damageDice: '1',
                damageType: 'Perfurante',
                range: '1,5m'
            }
        ],
        features: [
            {
                name: 'Mímica',
                description: 'Pode imitar sons simples que ouviu, como vozes curtas ou passos. Teste de Intuição CD 10 para discernir.'
            }
        ],
        skills: 'Percepção +3'
    },
    {
        id: 'poison_snake',
        name: 'Serpente Venenosa',
        creatureType: 'Besta / Familiar',
        type: 'familiar',
        description: 'Répteis furtivos capazes de nadar e ver na escuridão por percepção às cegas.',
        size: 'Miúdo',
        baseHp: 2,
        baseAc: 13,
        speed: '9m, Natação 9m',
        visionRange: 3, // Percepção às cegas 3m
        avatarUrl: 'https://images.unsplash.com/photo-1531386151447-fd76ad50012f?w=150',
        attributes: { str: 2, dex: 16, con: 11, int: 1, wis: 10, cha: 3 },
        attacks: [
            {
                name: 'Mordida Venenosa',
                baseAttackBonus: 5,
                damageDice: '1',
                damageType: 'Perfurante + 2d4 Veneno',
                range: '1,5m',
                description: 'Causa 1 ponto perfurante + 2d4 veneno (TR Constituição CD 10 reduz pela metade).'
            }
        ],
        features: [
            {
                name: 'Percepção às Cegas 3m',
                description: 'Detecta arredores imediatos sem depender da visão.'
            }
        ]
    },

    // --- 4. MONTARIA FIEL (PALADINO / ENCONTRAR MONTARIA) ---
    {
        id: 'warhorse_steed',
        name: 'Corcel de Guerra Fiel',
        creatureType: 'Celestial / Besta Mágica',
        type: 'steed',
        description: 'Montaria corajosa concedida por juramento ou vínculo celestial. Atropela inimigos com cascos pesados.',
        size: 'Grande',
        baseHp: 19,
        hpPerLevel: 5,
        baseAc: 12,
        speed: '18m',
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
                name: 'Vínculo com Montaria',
                description: 'Magias conjuradas pelo cavaleiro com alcance "Pessoal" também afetam o corcel enquanto montado.'
            }
        ]
    },

    // --- 5. ARTÍFICE: DEFENSOR DE AÇO (STEEL DEFENDER) ---
    {
        id: 'steel_defender',
        name: 'Defensor de Aço',
        creatureType: 'Constructo Autômato',
        type: 'homunculus',
        description: 'Constructo metálico bípede ou quadrúpede criado pelo Artífice para proteção de seus aliados.',
        size: 'Médio',
        baseHp: 2,
        hpPerLevel: 5, // 2 + Int + 5x Nível
        baseAc: 15,
        speed: '12m',
        visionRange: 18,
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
                description: 'Ação mágica: o construto ou outro constructo/objeto adjacente recupera 2d8 + PB pontos de vida.'
            },
            {
                name: 'Reação Defensiva',
                description: 'Impõe desvantagem na jogada de ataque de um atacante visível a até 1,5m contra um alvo que não seja o Defensor.'
            }
        ],
        skills: 'Percepção +4, Atletismo +4'
    }
];

export const calculateMod = (val: number): number => Math.floor((val - 10) / 2);

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

    // HP calculation
    let maxHp = preset.baseHp;
    if (preset.hpPerLevel) {
        maxHp = preset.baseHp + (preset.hpPerLevel * safeLevel);
    }

    // AC calculation
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
            // e.g. "1d8 + 2 + PB"
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
        name: preset.name,
        type: preset.type,
        creatureType: preset.creatureType,
        avatarUrl: preset.avatarUrl,
        size: preset.size,
        hp: {
            current: maxHp,
            max: maxHp,
            temp: 0
        },
        ac: finalAc,
        speed: preset.speed,
        visionRange: preset.visionRange,
        attributes,
        attacks,
        features: preset.features,
        skills: preset.skills,
        notes: preset.description
    };
};

/**
 * Cria um companheiro customizado do zero.
 */
export const createCustomCompanion = (name = 'Novo Pet / Companheiro'): Companion => {
    return {
        id: `comp_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
        name: name,
        type: 'custom',
        creatureType: 'Besta',
        size: 'Médio',
        hp: { current: 15, max: 15, temp: 0 },
        ac: 13,
        speed: '9m',
        visionRange: 0,
        attributes: {
            str: { value: 12, modifier: 1 },
            dex: { value: 14, modifier: 2 },
            con: { value: 12, modifier: 1 },
            int: { value: 6, modifier: -2 },
            wis: { value: 12, modifier: 1 },
            cha: { value: 8, modifier: -1 }
        },
        attacks: [
            {
                name: 'Mordida / Golpe',
                attackBonus: 4,
                damage: '1d6 + 2',
                damageType: 'Perfurante',
                range: '1,5m'
            }
        ],
        features: [
            {
                name: 'Fiel e Protetor',
                description: 'Protege seu dono com bravura e lealdade.'
            }
        ],
        notes: ''
    };
};
