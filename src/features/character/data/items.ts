export type ItemType = 'weapon' | 'armor' | 'gear' | 'tool' | 'consumable';
export type DamageType = 'concussão' | 'cortante' | 'perfurante' | 'fogo' | 'frio' | 'elétrico' | 'ácido' | 'veneno' | 'radiante' | 'necrótico' | 'força' | 'psíquico' | 'físico';

export interface ItemDefinition {
    id: string;
    name: string;
    type: ItemType;
    cost: number; // in gp (gold pieces) roughly, or cp
    weight: number; // in kg
    description?: string;
    rarity?: 'comum' | 'incomum' | 'raro' | 'muito raro' | 'lendário';

    // Weapon specifics
    damage?: string; // e.g. '1d8'
    damageType?: DamageType;
    properties?: string[]; // 'leve', 'acuidade', 'duas mãos', 'versátil (1d10)'
    range?: string; // '6/18'
    toxicity?: number; // Witcher Potion Toxicity

    // Armor specifics
    ac?: number; // Base AC
    acDexBonus?: boolean; // Add Dex mod?
    acMaxDex?: number; // Max Dex mod allowed (2 for Medium, 0 for Heavy)
    stealthDisadvantage?: boolean;
    strengthReq?: number;
}

export const ITEMS: ItemDefinition[] = [
    // =========================================================================
    // 1. ARMAS SIMPLES CORPO A CORPO (PHB)
    // =========================================================================
    { id: 'adaga', name: 'Adaga', type: 'weapon', cost: 2, weight: 0.5, damage: '1d4', damageType: 'perfurante', properties: ['acuidade', 'leve', 'arremesso (6/18)'], range: '6/18' },
    { id: 'azagaia', name: 'Azagaia', type: 'weapon', cost: 0.5, weight: 1, damage: '1d6', damageType: 'perfurante', properties: ['arremesso (9/36)'], range: '9/36' },
    { id: 'bordao', name: 'Bordão', type: 'weapon', cost: 0.2, weight: 2, damage: '1d6', damageType: 'concussão', properties: ['versátil (1d8)'] },
    { id: 'clava', name: 'Clava', type: 'weapon', cost: 0.1, weight: 1, damage: '1d4', damageType: 'concussão', properties: ['leve'] },
    { id: 'clava_grande', name: 'Clava Grande', type: 'weapon', cost: 0.2, weight: 4.5, damage: '1d8', damageType: 'concussão', properties: ['duas mãos'] },
    { id: 'foice_curta', name: 'Foice Curta', type: 'weapon', cost: 1, weight: 1, damage: '1d4', damageType: 'cortante', properties: ['leve'] },
    { id: 'lanca', name: 'Lança', type: 'weapon', cost: 1, weight: 1.5, damage: '1d6', damageType: 'perfurante', properties: ['arremesso (6/18)', 'versátil (1d8)'], range: '6/18' },
    { id: 'maca', name: 'Maça', type: 'weapon', cost: 5, weight: 2, damage: '1d6', damageType: 'concussão', properties: [] },
    { id: 'machadinha', name: 'Machadinha', type: 'weapon', cost: 5, weight: 1, damage: '1d6', damageType: 'cortante', properties: ['leve', 'arremesso (6/18)'], range: '6/18' },
    { id: 'martelo_leve', name: 'Martelo Leve', type: 'weapon', cost: 2, weight: 1, damage: '1d4', damageType: 'concussão', properties: ['leve', 'arremesso (6/18)'], range: '6/18' },
    { id: 'porrete', name: 'Porrete', type: 'weapon', cost: 0.1, weight: 1, damage: '1d4', damageType: 'concussão', properties: ['leve'] },

    // =========================================================================
    // 2. ARMAS SIMPLES À DISTÂNCIA (PHB)
    // =========================================================================
    { id: 'arco_curto', name: 'Arco Curto', type: 'weapon', cost: 25, weight: 1, damage: '1d6', damageType: 'perfurante', properties: ['munição (24/96)', 'duas mãos'], range: '24/96' },
    { id: 'besta_leve', name: 'Besta Leve', type: 'weapon', cost: 25, weight: 2.5, damage: '1d8', damageType: 'perfurante', properties: ['munição (24/96)', 'recarga', 'duas mãos'], range: '24/96' },
    { id: 'dardo', name: 'Dardo', type: 'weapon', cost: 0.05, weight: 0.1, damage: '1d4', damageType: 'perfurante', properties: ['acuidade', 'arremesso (6/18)'], range: '6/18' },
    { id: 'funda', name: 'Funda', type: 'weapon', cost: 0.1, weight: 0.1, damage: '1d4', damageType: 'concussão', properties: ['munição (9/36)'], range: '9/36' },

    // =========================================================================
    // 3. ARMAS MARCIAIS CORPO A CORPO (PHB)
    // =========================================================================
    { id: 'alabarda', name: 'Alabarda', type: 'weapon', cost: 20, weight: 3, damage: '1d10', damageType: 'cortante', properties: ['pesada', 'alcance', 'duas mãos'] },
    { id: 'chicote', name: 'Chicote', type: 'weapon', cost: 2, weight: 1.5, damage: '1d4', damageType: 'cortante', properties: ['acuidade', 'alcance'] },
    { id: 'cimitarra', name: 'Cimitarra', type: 'weapon', cost: 25, weight: 1.5, damage: '1d6', damageType: 'cortante', properties: ['acuidade', 'leve'] },
    { id: 'espada_curta', name: 'Espada Curta', type: 'weapon', cost: 10, weight: 1, damage: '1d6', damageType: 'perfurante', properties: ['acuidade', 'leve'] },
    { id: 'espada_grande', name: 'Espada Grande', type: 'weapon', cost: 50, weight: 3, damage: '2d6', damageType: 'cortante', properties: ['pesada', 'duas mãos'] },
    { id: 'espada_longa', name: 'Espada Longa', type: 'weapon', cost: 15, weight: 1.5, damage: '1d8', damageType: 'cortante', properties: ['versátil (1d10)'] },
    { id: 'estrela_da_manha', name: 'Estrela da Manhã', type: 'weapon', cost: 15, weight: 2, damage: '1d8', damageType: 'perfurante', properties: [] },
    { id: 'glaive', name: 'Glaive', type: 'weapon', cost: 20, weight: 3, damage: '1d10', damageType: 'cortante', properties: ['pesada', 'alcance', 'duas mãos'] },
    { id: 'lanca_montaria', name: 'Lança de Montaria', type: 'weapon', cost: 10, weight: 3, damage: '1d12', damageType: 'perfurante', properties: ['alcance', 'especial'] },
    { id: 'lanca_de_montaria', name: 'Lança de Montaria', type: 'weapon', cost: 10, weight: 3, damage: '1d12', damageType: 'perfurante', properties: ['alcance', 'especial'] },
    { id: 'machado_batalha', name: 'Machado de Batalha', type: 'weapon', cost: 10, weight: 2, damage: '1d8', damageType: 'cortante', properties: ['versátil (1d10)'] },
    { id: 'machado_de_batalha', name: 'Machado de Batalha', type: 'weapon', cost: 10, weight: 2, damage: '1d8', damageType: 'cortante', properties: ['versátil (1d10)'] },
    { id: 'machado_grande', name: 'Machado Grande', type: 'weapon', cost: 30, weight: 3.5, damage: '1d12', damageType: 'cortante', properties: ['pesada', 'duas mãos'] },
    { id: 'mail', name: 'Mangual', type: 'weapon', cost: 10, weight: 1, damage: '1d8', damageType: 'concussão', properties: [] },
    { id: 'mangual', name: 'Mangual', type: 'weapon', cost: 10, weight: 1, damage: '1d8', damageType: 'concussão', properties: [] },
    { id: 'martelo_guerra', name: 'Martelo de Guerra', type: 'weapon', cost: 15, weight: 1, damage: '1d8', damageType: 'concussão', properties: ['versátil (1d10)'] },
    { id: 'martelo_de_guerra', name: 'Martelo de Guerra', type: 'weapon', cost: 15, weight: 1, damage: '1d8', damageType: 'concussão', properties: ['versátil (1d10)'] },
    { id: 'maul', name: 'Malho (Maul)', type: 'weapon', cost: 10, weight: 4.5, damage: '2d6', damageType: 'concussão', properties: ['pesada', 'duas mãos'] },
    { id: 'malho', name: 'Malho', type: 'weapon', cost: 10, weight: 4.5, damage: '2d6', damageType: 'concussão', properties: ['pesada', 'duas mãos'] },
    { id: 'picareta_guerra', name: 'Picareta de Guerra', type: 'weapon', cost: 5, weight: 1, damage: '1d8', damageType: 'perfurante', properties: ['versátil (1d10)'] },
    { id: 'picareta_de_guerra', name: 'Picareta de Guerra', type: 'weapon', cost: 5, weight: 1, damage: '1d8', damageType: 'perfurante', properties: ['versátil (1d10)'] },
    { id: 'pique', name: 'Pique', type: 'weapon', cost: 5, weight: 8, damage: '1d10', damageType: 'perfurante', properties: ['pesada', 'alcance', 'duas mãos'] },
    { id: 'rapieira', name: 'Rapieira', type: 'weapon', cost: 25, weight: 1, damage: '1d8', damageType: 'perfurante', properties: ['acuidade'] },
    { id: 'tridente', name: 'Tridente', type: 'weapon', cost: 5, weight: 2, damage: '1d6', damageType: 'perfurante', properties: ['arremesso (6/18)', 'versátil (1d8)'], range: '6/18' },

    // =========================================================================
    // 4. ARMAS MARCIAIS À DISTÂNCIA (PHB)
    // =========================================================================
    { id: 'arco_longo', name: 'Arco Longo', type: 'weapon', cost: 50, weight: 1, damage: '1d8', damageType: 'perfurante', properties: ['munição (45/180)', 'pesada', 'duas mãos'], range: '45/180' },
    { id: 'besta_mao', name: 'Besta de Mão', type: 'weapon', cost: 75, weight: 1.5, damage: '1d6', damageType: 'perfurante', properties: ['munição (9/36)', 'leve', 'recarga'], range: '9/36' },
    { id: 'besta_de_mao', name: 'Besta de Mão', type: 'weapon', cost: 75, weight: 1.5, damage: '1d6', damageType: 'perfurante', properties: ['munição (9/36)', 'leve', 'recarga'], range: '9/36' },
    { id: 'besta_pesada', name: 'Besta Pesada', type: 'weapon', cost: 50, weight: 8, damage: '1d10', damageType: 'perfurante', properties: ['munição (30/120)', 'pesada', 'recarga', 'duas mãos'], range: '30/120' },
    { id: 'zarabatana', name: 'Zarabatana', type: 'weapon', cost: 10, weight: 0.5, damage: '1', damageType: 'perfurante', properties: ['munição (7.5/30)', 'recarga'], range: '7.5/30' },
    { id: 'rede', name: 'Rede', type: 'weapon', cost: 1, weight: 1.5, damage: '0', damageType: 'concussão', properties: ['especial', 'arremesso (1.5/4.5)'], range: '1.5/4.5' },

    // =========================================================================
    // 5. ARMAS DO UNIVERSO WITCHER
    // =========================================================================
    { id: 'espada_de_aco_de_bruxo', name: 'Espada de Aço de Bruxo', type: 'weapon', cost: 200, weight: 1.5, damage: '1d8', damageType: 'cortante', properties: ['versátil (1d10)', 'prata-falso (aço)'], description: 'Espada bem balanceada para matar humanos e não-monstros.' },
    { id: 'espada_de_prata_de_bruxo', name: 'Espada de Prata de Bruxo', type: 'weapon', cost: 400, weight: 1.5, damage: '1d8', damageType: 'cortante', properties: ['versátil (1d10)', 'prata'], description: 'Espada revestida de prata, letal contra monstros.' },
    { id: 'espada_de_aco', name: 'Espada de Aço', type: 'weapon', cost: 200, weight: 1.5, damage: '1d8', damageType: 'cortante', properties: ['versátil (1d10)', 'prata-falso (aço)'] },
    { id: 'espada_de_prata', name: 'Espada de Prata', type: 'weapon', cost: 400, weight: 1.5, damage: '1d8', damageType: 'cortante', properties: ['versátil (1d10)', 'prata'] },

    // =========================================================================
    // 6. ARMADURAS & ESCUDOS (PHB & WITCHER)
    // =========================================================================
    // Armaduras Leves
    { id: 'acolchoada', name: 'Acolchoada', type: 'armor', cost: 5, weight: 4, ac: 11, acDexBonus: true, stealthDisadvantage: true, description: 'Camadas de tecido grosso acolchoado.' },
    { id: 'armadura_couro', name: 'Armadura de Couro', type: 'armor', cost: 10, weight: 5, ac: 11, acDexBonus: true, description: 'Couro flexível tratado com óleo.' },
    { id: 'armadura_de_couro', name: 'Armadura de Couro', type: 'armor', cost: 10, weight: 5, ac: 11, acDexBonus: true },
    { id: 'couro_batido', name: 'Couro Batido', type: 'armor', cost: 45, weight: 6.5, ac: 12, acDexBonus: true, description: 'Couro reforçado com rebites e cravos metálicos.' },
    { id: 'armadura_de_couro_batido', name: 'Armadura de Couro Batido', type: 'armor', cost: 45, weight: 6.5, ac: 12, acDexBonus: true },
    { id: 'corselete_de_couro', name: 'Corselete de Couro', type: 'armor', cost: 10, weight: 4.5, ac: 11, acDexBonus: true, description: 'Armadura leve de couro batido comum no Continente.' },

    // Armaduras Médias
    { id: 'gibao_peles', name: 'Gibão de Peles', type: 'armor', cost: 10, weight: 6, ac: 12, acDexBonus: true, acMaxDex: 2, description: 'Peles rústicas e couro grosso.' },
    { id: 'gibao_de_peles', name: 'Gibão de Peles', type: 'armor', cost: 10, weight: 6, ac: 12, acDexBonus: true, acMaxDex: 2 },
    { id: 'camisao_malha', name: 'Camisão de Malha', type: 'armor', cost: 50, weight: 10, ac: 13, acDexBonus: true, acMaxDex: 2, description: 'Camisa leve de elos de metal entrelaçados.' },
    { id: 'camisao_de_malha', name: 'Camisão de Malha', type: 'armor', cost: 50, weight: 10, ac: 13, acDexBonus: true, acMaxDex: 2 },
    { id: 'cota_escamas', name: 'Cota de Escamas', type: 'armor', cost: 50, weight: 20, ac: 14, acDexBonus: true, acMaxDex: 2, stealthDisadvantage: true, description: 'Escamas metálicas sobrepostas.' },
    { id: 'cota_de_escamas', name: 'Cota de Escamas', type: 'armor', cost: 50, weight: 20, ac: 14, acDexBonus: true, acMaxDex: 2, stealthDisadvantage: true },
    { id: 'brunea', name: 'Brunea (Scale Mail)', type: 'armor', cost: 50, weight: 20, ac: 14, acDexBonus: true, acMaxDex: 2, stealthDisadvantage: true },
    { id: 'peitoral', name: 'Peitoral de Aço', type: 'armor', cost: 400, weight: 10, ac: 14, acDexBonus: true, acMaxDex: 2, description: 'Placa peitoral e dorsal ajustada com alças de couro.' },
    { id: 'peitoral_de_aco', name: 'Peitoral de Aço', type: 'armor', cost: 400, weight: 10, ac: 14, acDexBonus: true, acMaxDex: 2 },
    { id: 'meia_armadura', name: 'Meia-Armadura', type: 'armor', cost: 750, weight: 20, ac: 15, acDexBonus: true, acMaxDex: 2, stealthDisadvantage: true, description: 'Placas de aço moldadas protegendo a maior parte do corpo.' },
    { id: 'armadura_de_bruxo', name: 'Armadura de Bruxo', type: 'armor', cost: 150, weight: 8, ac: 13, acDexBonus: true, description: 'Armadura reforçada com couro e cota de malha leve. Ideal para movimentos rápidos.' },

    // Armaduras Pesadas
    { id: 'cota_aneis', name: 'Cota de Anéis', type: 'armor', cost: 30, weight: 20, ac: 14, acDexBonus: false, stealthDisadvantage: true, description: 'Anéis de ferro costurados em couro.' },
    { id: 'cota_de_aneis', name: 'Cota de Anéis', type: 'armor', cost: 30, weight: 20, ac: 14, acDexBonus: false, stealthDisadvantage: true },
    { id: 'cota_malha', name: 'Cota de Malha', type: 'armor', cost: 75, weight: 25, ac: 16, acDexBonus: false, strengthReq: 13, stealthDisadvantage: true, description: 'Armadura completa de elos de metal entrelaçados.' },
    { id: 'cota_de_malha', name: 'Cota de Malha', type: 'armor', cost: 75, weight: 25, ac: 16, acDexBonus: false, strengthReq: 13, stealthDisadvantage: true },
    { id: 'cota_talas', name: 'Cota de Talas', type: 'armor', cost: 200, weight: 27, ac: 17, acDexBonus: false, strengthReq: 15, stealthDisadvantage: true, description: 'Tiras verticais de aço cravadas sobre couro acolchoado.' },
    { id: 'cota_de_talas', name: 'Cota de Talas', type: 'armor', cost: 200, weight: 27, ac: 17, acDexBonus: false, strengthReq: 15, stealthDisadvantage: true },
    { id: 'placas', name: 'Armadura de Placas (Full Plate)', type: 'armor', cost: 1500, weight: 30, ac: 18, acDexBonus: false, strengthReq: 15, stealthDisadvantage: true, description: 'Armadura de aço completa sob medida cobrindo o corpo inteiro.' },
    { id: 'armadura_de_placas', name: 'Armadura de Placas', type: 'armor', cost: 1500, weight: 30, ac: 18, acDexBonus: false, strengthReq: 15, stealthDisadvantage: true },

    // Escudos
    { id: 'escudo', name: 'Escudo', type: 'armor', cost: 10, weight: 3, ac: 2, acDexBonus: false, description: 'Escudo de madeira e aço empunhado (+2 na CA).' },
    { id: 'escudo_de_madeira', name: 'Escudo de Madeira', type: 'armor', cost: 10, weight: 2.5, ac: 2, acDexBonus: false },

    // =========================================================================
    // 7. ROUPAS & VESTUÁRIO (PHB CANÔNICO - CLARIFICAÇÃO DE CA = 0)
    // =========================================================================
    {
        id: 'roupas_comuns',
        name: 'Roupas Comuns',
        type: 'gear',
        cost: 0.5,
        weight: 1.5,
        ac: 0,
        acDexBonus: false,
        description: 'Vestimentas simples de plebeu ou camponês. Não concede bônus de CA (Sem Armadura, CA 10 + DES).'
    },
    {
        id: 'roupas_de_viajante',
        name: 'Roupas de Viajante',
        type: 'gear',
        cost: 2,
        weight: 2,
        ac: 0,
        acDexBonus: false,
        description: 'Capa com capuz, botas tratadas e túnica resistente para marchas e estradas. Não concede bônus de CA (Sem Armadura, CA 10 + DES).'
    },
    {
        id: 'roupa_de_campanha',
        name: 'Roupa de Campanha',
        type: 'gear',
        cost: 2,
        weight: 2,
        ac: 0,
        acDexBonus: false,
        description: 'Uniforme militar resistente fornecido a soldados e guardas. Não concede bônus de CA (Sem Armadura, CA 10 + DES). A proteção física vem da armadura de classe.'
    },
    {
        id: 'roupas_de_campanha',
        name: 'Roupas de Campanha',
        type: 'gear',
        cost: 2,
        weight: 2,
        ac: 0,
        acDexBonus: false,
        description: 'Uniforme militar resistente fornecido a soldados e guardas. Não concede bônus de CA (Sem Armadura, CA 10 + DES).'
    },
    {
        id: 'roupas_finas',
        name: 'Roupas Finas',
        type: 'gear',
        cost: 15,
        weight: 3,
        ac: 0,
        acDexBonus: false,
        description: 'Sedas, veludos e adereços nobres para eventos da corte. Não concede bônus de CA (Sem Armadura, CA 10 + DES).'
    },
    {
        id: 'traje_fantasia',
        name: 'Traje de Fantasia',
        type: 'gear',
        cost: 5,
        weight: 2,
        ac: 0,
        acDexBonus: false,
        description: 'Trajes teatrais para atuações bardicas e disfarces. Não concede bônus de CA (Sem Armadura).'
    },
    {
        id: 'manto_com_capuz',
        name: 'Manto com Capuz',
        type: 'gear',
        cost: 1,
        weight: 2,
        ac: 0,
        acDexBonus: false,
        description: 'Manto volumoso tradicional de monges, acólitos e conjuradores arcanos. Não concede bônus de CA.'
    },
    {
        id: 'roupas_simples',
        name: 'Roupas Simples',
        type: 'gear',
        cost: 0.2,
        weight: 1.5,
        ac: 0,
        acDexBonus: false,
        description: 'Vestes modestas de linho ou algodão. Não concede bônus de CA.'
    },

    // =========================================================================
    // 8. EQUIPAMENTOS DE AVENTURA & EXPLORAÇÃO
    // =========================================================================
    { id: 'mochila', name: 'Mochila', type: 'gear', cost: 2, weight: 2.5, description: 'Comporta até 15 kg ou 30 litros de carga.' },
    { id: 'saco_dormir', name: 'Saco de Dormir', type: 'gear', cost: 1, weight: 3.5, description: 'Acolchoado de lã para pernoitar em campo aberto.' },
    { id: 'saco_de_dormir', name: 'Saco de Dormir', type: 'gear', cost: 1, weight: 3.5 },
    { id: 'tocha', name: 'Tocha', type: 'consumable', cost: 0.01, weight: 0.5, description: 'Ilumina raio de 6m de luz plena e 6m de penumbra por 1 hora.' },
    { id: 'nacao_viagem', name: 'Ração de Viagem (1 dia)', type: 'consumable', cost: 0.5, weight: 1, description: 'Alimentos desidratados para 1 dia completo.' },
    { id: 'racao_de_viagem', name: 'Ração de Viagem (1 dia)', type: 'consumable', cost: 0.5, weight: 1 },
    { id: 'corda_canhamo', name: 'Corda de Cânhamo (15m)', type: 'gear', cost: 1, weight: 5, description: 'Suporta até 200 kg; 2 PV e CD 17 para arrebentar.' },
    { id: 'corda_de_canhamo', name: 'Corda de Cânhamo (15m)', type: 'gear', cost: 1, weight: 5 },
    { id: 'corda_seda', name: 'Corda de Seda (15m)', type: 'gear', cost: 10, weight: 2.5, description: 'Leve e resistente; CD 17 para arrebentar.' },
    { id: 'corda_de_seda', name: 'Corda de Seda (15m)', type: 'gear', cost: 10, weight: 2.5 },
    { id: 'pe_de_cabra', name: 'Pé de Cabra', type: 'gear', cost: 2, weight: 2.5, description: 'Concede Vantagem em testes de Força para arrombar portas e baús.' },
    { id: 'kit_curandeiro', name: 'Kit de Curandeiro', type: 'gear', cost: 5, weight: 1.5, description: '10 usos. Com 1 ação, estabiliza criatura com 0 PV sem teste de Medicina.' },
    { id: 'kit_de_curandeiro', name: 'Kit de Curandeiro', type: 'gear', cost: 5, weight: 1.5 },
    { id: 'lanterna_furta_fogo', name: 'Lanterna Furta-Fogo', type: 'gear', cost: 10, weight: 1, description: 'Cone de 18m de luz plena por 6 horas com 1 óleo.' },
    { id: 'lanterna_coberta', name: 'Lanterna Coberta', type: 'gear', cost: 5, weight: 1, description: 'Raio de 9m de luz plena por 6 horas com 1 óleo.' },
    { id: 'oleo_frasco', name: 'Óleo (frasco)', type: 'consumable', cost: 0.1, weight: 0.5, description: 'Combustível de lanterna ou arremesso (5 de dano de fogo se incendiado).' },
    { id: 'pederneira', name: 'Pederneira e Isqueiro', type: 'gear', cost: 0.5, weight: 0.2, description: 'Pedra de faísca para acender fogo em 1 ação.' },
    { id: 'cantil', name: 'Cantil', type: 'gear', cost: 0.2, weight: 2.5, description: 'Armazena 2 litros de água fresca.' },
    { id: 'arpeu', name: 'Arpéu', type: 'gear', cost: 2, weight: 2, description: 'Gancho de escalada para prender em muralhas.' },
    { id: 'pitons', name: 'Pítons de Ferro (10)', type: 'gear', cost: 0.5, weight: 2.5, description: 'Estacas de aço para ancoragem em rocha.' },

    // =========================================================================
    // 9. FOCOS DE CONJURAÇÃO, GRIMÓRIOS & MUNIÇÃO
    // =========================================================================
    { id: 'simbolo_sagrado', name: 'Símbolo Sagrado', type: 'gear', cost: 5, weight: 0.1, description: 'Amuleto ou relicário para Clérigos e Paladinos.' },
    { id: 'bolsa_componentes', name: 'Bolsa de Componentes', type: 'gear', cost: 25, weight: 1, description: 'Bolsa de couro com ervas, pós e pós para magias sem custo em ouro.' },
    { id: 'bolsa_de_componentes', name: 'Bolsa de Componentes', type: 'gear', cost: 25, weight: 1 },
    { id: 'grimorio', name: 'Grimório', type: 'gear', cost: 50, weight: 1.5, description: 'Livro de couro com 100 páginas para registro de magias de Mago.' },
    { id: 'foco_arcano', name: 'Foco Arcano', type: 'gear', cost: 5, weight: 0.5, description: 'Varinha, cajado, orbe ou cristal canalizador arcano.' },
    { id: 'foco_druidico', name: 'Foco Druídico', type: 'gear', cost: 1, weight: 0.5, description: 'Ramo de visco, totem ou bordão vegetal.' },
    { id: 'cristal_de_foco', name: 'Cristal de Foco', type: 'gear', cost: 10, weight: 0.5, description: 'Cristal lapidado usado para canalizar energia mágica ou Sinais.' },
    { id: 'flechas', name: 'Flechas (20)', type: 'consumable', cost: 1, weight: 1, properties: ['munição'] },
    { id: 'virotes', name: 'Virotes (20)', type: 'consumable', cost: 1, weight: 1.5, properties: ['munição'] },
    { id: 'flecha', name: 'Flecha', type: 'consumable', cost: 0.05, weight: 0.05, properties: ['munição'] },
    { id: 'virote', name: 'Virote', type: 'consumable', cost: 0.05, weight: 0.075, properties: ['munição'] },
    { id: 'aljava', name: 'Aljava (20 flechas)', type: 'gear', cost: 1, weight: 1, description: 'Contém até 20 flechas para arco.' },
    { id: 'aljava_(20_flechas)', name: 'Aljava (20 flechas)', type: 'gear', cost: 1, weight: 1, description: 'Contém até 20 flechas para arco.' },

    // =========================================================================
    // 10. INSTRUMENTOS & FERRAMENTAS ESPECIALIZADAS
    // =========================================================================
    { id: 'ferramentas_ladrao', name: 'Ferramentas de Ladrão', type: 'tool', cost: 25, weight: 0.5, description: 'Gazuas e alicates para desarmar armadilhas e abrir fechaduras.' },
    { id: 'ferramentas_de_ladrao', name: 'Ferramentas de Ladrão', type: 'tool', cost: 25, weight: 0.5 },
    { id: 'kit_disfarce', name: 'Kit de Disfarce', type: 'tool', cost: 25, weight: 1.5, description: 'Cosméticos e perucas para alterar a aparência.' },
    { id: 'kit_de_disfarce', name: 'Kit de Disfarce', type: 'tool', cost: 25, weight: 1.5 },
    { id: 'kit_falsificacao', name: 'Kit de Falsificação', type: 'tool', cost: 15, weight: 2, description: 'Tintas e selos para forjar cartas e documentos régios.' },
    { id: 'kit_de_falsificacao', name: 'Kit de Falsificação', type: 'tool', cost: 15, weight: 2 },
    { id: 'kit_herbalismo', name: 'Kit de Herbalismo', type: 'tool', cost: 5, weight: 1.5, description: 'Frascos e pilão para criar Poções de Cura e antídotos.' },
    { id: 'kit_de_herbalismo', name: 'Kit de Herbalismo', type: 'tool', cost: 5, weight: 1.5 },
    { id: 'kit_venenos', name: 'Kit de Envenenador', type: 'tool', cost: 50, weight: 1, description: 'Instrumentos para coletar e refinar toxinas letais.' },
    { id: 'kit_de_venenos', name: 'Kit de Envenenador', type: 'tool', cost: 50, weight: 1 },
    { id: 'ferramentas_navegador', name: 'Ferramentas de Navegador', type: 'tool', cost: 25, weight: 1, description: 'Sextante e bússola para navegar no mar.' },
    { id: 'alaude', name: 'Alaúde', type: 'gear', cost: 35, weight: 1, description: 'Instrumento musical de cordas.' },
    { id: 'flauta', name: 'Flauta', type: 'gear', cost: 2, weight: 0.5 },
    { id: 'lira', name: 'Lira', type: 'gear', cost: 30, weight: 1 },
    { id: 'tambor', name: 'Tambor', type: 'gear', cost: 6, weight: 1.5 },
    { id: 'kit_alquimia', name: 'Kit de Alquimia', type: 'tool', cost: 50, weight: 2.0, description: 'Usado para criar poções e óleos.' },

    // =========================================================================
    // 11. PACOTES DE EQUIPAMENTO INICIAL (STARTING PACKS)
    // =========================================================================
    { id: 'pacote_explorador', name: 'Pacote de Explorador', type: 'gear', cost: 10, weight: 25, description: 'Mochila, saco de dormir, pederneira, 10 tochas, 10 rações, cantil e 15m de corda.' },
    { id: 'pacote_de_explorador', name: 'Pacote de Explorador', type: 'gear', cost: 10, weight: 25 },
    { id: 'pacote_artista', name: 'Pacote de Artista', type: 'gear', cost: 40, weight: 15, description: 'Mochila, saco de dormir, 2 fantasias, 5 velas, 5 rações e cantil.' },
    { id: 'pacote_de_artista', name: 'Pacote de Artista', type: 'gear', cost: 40, weight: 15 },
    { id: 'pacote_sacerdote', name: 'Pacote de Sacerdote', type: 'gear', cost: 19, weight: 12, description: 'Mochila, cobertor, 10 velas, caixa de esmolas, incenso, vestes e rações.' },
    { id: 'pacote_de_sacerdote', name: 'Pacote de Sacerdote', type: 'gear', cost: 19, weight: 12 },
    { id: 'pacote_assaltante', name: 'Pacote de Assaltante', type: 'gear', cost: 16, weight: 18, description: 'Mochila, pé de cabra, martelo, pítons, lanterna furta-fogo, óleo, rações e corda.' },
    { id: 'pacote_de_assaltante', name: 'Pacote de Assaltante', type: 'gear', cost: 16, weight: 18 },
    { id: 'pacote_estudioso', name: 'Pacote de Estudioso', type: 'gear', cost: 40, weight: 5, description: 'Mochila, livro de conhecimento, tinta, pena, pergaminho e faca pequena.' },
    { id: 'pacote_de_estudioso', name: 'Pacote de Estudioso', type: 'gear', cost: 40, weight: 5 },
    { id: 'pacote_aventureiro', name: 'Pacote de Aventureiro', type: 'gear', cost: 12, weight: 20, description: 'Mochila, pé de cabra, martelo, pítons, tochas, rações e corda.' },
    { id: 'pacote_de_aventureiro', name: 'Pacote de Aventureiro', type: 'gear', cost: 12, weight: 20 },
    { id: 'pacote_masmorra', name: 'Pacote de Masmorra', type: 'gear', cost: 12, weight: 25, description: 'Mochila, pé de cabra, martelo, 10 pítons, 10 tochas, pederneira e rações.' },
    { id: 'pacote_de_masmorra', name: 'Pacote de Masmorra', type: 'gear', cost: 12, weight: 25 },

    // =========================================================================
    // 12. ITENS & POÇÕES WITCHER
    // =========================================================================
    { id: 'pocao_andorinha', name: 'Poção Andorinha', type: 'consumable', cost: 20, weight: 0.5, toxicity: 20, description: 'Acelera a regeneração de vitalidade (Cura 1d6 + Nível por turno por 3 rodadas).' },
    { id: 'pocao_gato', name: 'Poção Gato', type: 'consumable', cost: 20, weight: 0.5, toxicity: 15, description: 'Permite ver na escuridão total (Visão no Escuro 18m) por 1 hora.' },
    { id: 'pocao_raio', name: 'Poção Raio', type: 'consumable', cost: 20, weight: 0.5, toxicity: 25, description: 'Aumenta a força dos ataques temporariamente (+1d4 de dano) por 1 minuto.' },
    { id: 'pocao_mel_branco', name: 'Mel Branco', type: 'consumable', cost: 15, weight: 0.5, toxicity: 0, description: 'Limpa toda a toxicidade e cancela efeitos de poções ativas.' },
    { id: 'pocao_coruja', name: 'Coruja do Mato', type: 'consumable', cost: 25, weight: 0.5, toxicity: 20, description: 'Acelera a recuperação de Vigor (Recupera 1 Slot de Magia/Sinal Nível 1).' },
    { id: 'pocao_lua_cheia', name: 'Lua Cheia', type: 'consumable', cost: 40, weight: 0.5, toxicity: 70, description: 'Aumenta a Vitalidade Máxima temporariamente (+2d8 PV Temp) por 1 hora.' },
    { id: 'pocao_lua_superior', name: 'Poção Lua Superior', type: 'consumable', cost: 60, weight: 0.5, toxicity: 80, description: 'Poção avançada que concede +4d8 PV temporários.' },
    { id: 'veneno_de_lagarto', name: 'Veneno de Lagarto', type: 'consumable', cost: 25, weight: 0.2, description: 'Toxina paralisante aplicada em lâminas (+1d6 de dano de veneno).' },
    { id: 'trofeu_monstro', name: 'Troféu de Monstro', type: 'gear', cost: 0, weight: 2.0, description: 'A cabeça de uma besta abatida.' },
    { id: 'medalhao_bruxo', name: 'Medalhão de Bruxo', type: 'gear', cost: 0, weight: 0.2, description: 'Vibra na presença de magia.' },

    // =========================================================================
    // 13. ITENS MÁGICOS CANÔNICOS DO DMG (LIVRO DO MESTRE)
    // =========================================================================
    // Poções Mágicas de D&D
    { id: 'pocao_de_cura', name: 'Poção de Cura', type: 'consumable', cost: 50, weight: 0.2, rarity: 'comum', description: 'Beber restaura 2d4 + 2 Pontos de Vida com 1 Ação.' },
    { id: 'pocao_cura_maior', name: 'Poção de Cura Maior', type: 'consumable', cost: 200, weight: 0.2, rarity: 'incomum', description: 'Beber restaura 4d4 + 4 Pontos de Vida.' },
    { id: 'pocao_cura_superior', name: 'Poção de Cura Superior', type: 'consumable', cost: 2000, weight: 0.2, rarity: 'raro', description: 'Beber restaura 8d4 + 8 Pontos de Vida.' },
    { id: 'pocao_cura_suprema', name: 'Poção de Cura Suprema', type: 'consumable', cost: 20000, weight: 0.2, rarity: 'muito raro', description: 'Beber restaura 10d4 + 20 Pontos de Vida.' },
    { id: 'pocao_forca_gigante_colina', name: 'Poção de Força do Gigante da Colina', type: 'consumable', cost: 300, weight: 0.2, rarity: 'incomum', description: 'Fixa seu valor de Força em 21 por 1 hora.' },
    { id: 'pocao_invisibilidade', name: 'Poção de Invisibilidade', type: 'consumable', cost: 500, weight: 0.2, rarity: 'muito raro', description: 'Fica invisível por 1 hora (encerra ao atacar ou conjurar magia).' },
    { id: 'pocao_velocidade', name: 'Poção de Velocidade', type: 'consumable', cost: 400, weight: 0.2, rarity: 'raro', description: 'Ganha o efeito da magia Velocidade (Haste) por 1 minuto sem concentração.' },
    { id: 'pocao_voo', name: 'Poção de Voo', type: 'consumable', cost: 500, weight: 0.2, rarity: 'raro', description: 'Ganha deslocamento de voo de 18m por 1 hora.' },

    // Armas e Armaduras Mágicas
    { id: 'arma_plus_1', name: 'Arma +1 (Mágica)', type: 'weapon', cost: 500, weight: 1.5, damage: '1d8', damageType: 'cortante', rarity: 'incomum', properties: ['mágica (+1 atk/dmg)'], description: 'Bônus de +1 nas jogadas de ataque e dano superando imunidades mundanas.' },
    { id: 'arma_plus_2', name: 'Arma +2 (Mágica)', type: 'weapon', cost: 4000, weight: 1.5, damage: '1d8', damageType: 'cortante', rarity: 'raro', properties: ['mágica (+2 atk/dmg)'], description: 'Bônus de +2 nas jogadas de ataque e dano.' },
    { id: 'arma_plus_3', name: 'Arma +3 (Mágica)', type: 'weapon', cost: 25000, weight: 1.5, damage: '1d8', damageType: 'cortante', rarity: 'muito raro', properties: ['mágica (+3 atk/dmg)'], description: 'Bônus colossal de +3 nas jogadas de ataque e dano.' },
    { id: 'escudo_plus_1', name: 'Escudo +1 (Mágico)', type: 'armor', cost: 500, weight: 3, ac: 3, acDexBonus: false, rarity: 'incomum', description: 'Concede +3 na CA (+2 base + 1 bônus mágico).' },
    { id: 'escudo_plus_2', name: 'Escudo +2 (Mágico)', type: 'armor', cost: 4000, weight: 3, ac: 4, acDexBonus: false, rarity: 'raro', description: 'Concede +4 na CA.' },
    { id: 'armadura_adamante', name: 'Armadura de Adamante', type: 'armor', cost: 800, weight: 25, ac: 16, acDexBonus: false, rarity: 'incomum', description: 'Metal estelar inquebrável. Converte qualquer Acerto Crítico sofrido em acerto normal!' },
    { id: 'armadura_mitral', name: 'Armadura de Mitral', type: 'armor', cost: 800, weight: 15, ac: 16, acDexBonus: false, rarity: 'incomum', description: 'Metal élfico prateado. Não impõe desvantagem em Furtividade nem exige Força mínima.' },

    // Itens Maravilhosos do DMG
    { id: 'bolsa_de_carga', name: 'Bolsa de Carga (Bag of Holding)', type: 'gear', cost: 500, weight: 7, rarity: 'incomum', description: 'Pesa 7 kg, mas armazena até 250 kg internamente em uma dimensão de bolso.' },
    { id: 'botas_aladas', name: 'Botas Aladas (Winged Boots)', type: 'gear', cost: 500, weight: 1, rarity: 'incomum', description: 'Concede deslocamento de voo por até 4 horas cumulativas por dia.' },
    { id: 'manto_de_protecao', name: 'Manto de Proteção', type: 'gear', cost: 500, weight: 1, rarity: 'incomum', description: 'Concede +1 na CA e +1 em todos os Testes de Resistência.' },
    { id: 'manoplas_forca_ogro', name: 'Manoplas de Força do Ogro', type: 'gear', cost: 500, weight: 1, rarity: 'incomum', description: 'Fixa seu valor de Força em 19 (+4).' },
    { id: 'tiara_do_intelecto', name: 'Tiara do Intelecto', type: 'gear', cost: 500, weight: 0.5, rarity: 'incomum', description: 'Fixa seu valor de Inteligência em 19 (+4).' },
    { id: 'amuleto_da_saude', name: 'Amuleto da Saúde', type: 'gear', cost: 4000, weight: 0.5, rarity: 'raro', description: 'Fixa seu valor de Constituição em 19 (+4).' },
    { id: 'cinturao_forca_gigante', name: 'Cinturão de Força do Gigante da Colina', type: 'gear', cost: 4000, weight: 1.5, rarity: 'raro', description: 'Fixa seu valor de Força em 21 (+5).' },
    { id: 'espada_flamejante', name: 'Espada Flamejante (Flame Tongue)', type: 'weapon', cost: 5000, weight: 1.5, damage: '1d8', damageType: 'fogo', rarity: 'raro', properties: ['versátil (1d10)', '+2d6 fogo'], description: 'Ao pronunciar a palavra de comando, a lâmina incendeia e causa +2d6 de dano de fogo em cada ataque!' },
    { id: 'manto_do_deslocamento', name: 'Manto do Deslocamento', type: 'gear', cost: 4000, weight: 1.5, rarity: 'raro', description: 'Inimigos têm Desvantagem em ataques contra você até você sofrer dano.' },
    { id: 'anel_de_protecao', name: 'Anel de Proteção', type: 'gear', cost: 3500, weight: 0.1, rarity: 'raro', description: 'Concede +1 na CA e +1 em todos os Testes de Resistência.' },
    { id: 'anel_tres_desejos', name: 'Anel dos Três Desejos', type: 'gear', cost: 100000, weight: 0.1, rarity: 'lendário', description: 'Contém 3 desejos. Concede a magia Desejo (Wish) por carga.' },
    { id: 'espada_vorpal', name: 'Espada Vorpal', type: 'weapon', cost: 100000, weight: 1.5, damage: '1d8', damageType: 'cortante', rarity: 'lendário', properties: ['mágica (+3 atk/dmg)', 'decapitação em 20 natural'], description: 'Ao rolar um 20 natural, decapita instantaneamente a criatura atingida!' },
    { id: 'manto_invisibilidade', name: 'Manto de Invisibilidade', type: 'gear', cost: 80000, weight: 1, rarity: 'lendário', description: 'Puxe o capuz para ficar totalmente invisível por 2 horas ao dia (atacar não cancela!).' }
];
