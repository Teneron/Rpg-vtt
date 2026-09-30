
export type ItemType = 'weapon' | 'armor' | 'gear' | 'tool' | 'consumable';
export type DamageType = 'concussão' | 'cortante' | 'perfurante';

export interface ItemDefinition {
    id: string;
    name: string;
    type: ItemType;
    cost: number; // in gp (gold pieces) roughly, or cp. Let's use gp for simplicity or string '10 po'.
    weight: number; // in kg
    description?: string;

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
    // --- SIMPLE MELEE WEAPONS ---
    { id: 'adaga', name: 'Adaga', type: 'weapon', cost: 2, weight: 0.5, damage: '1d4', damageType: 'perfurante', properties: ['acuidade', 'leve', 'arremesso (6/18)'], range: '6/18' },
    { id: 'azagaia', name: 'Azagaia', type: 'weapon', cost: 0.5, weight: 1, damage: '1d6', damageType: 'perfurante', properties: ['arremesso (9/36)'], range: '9/36' },
    { id: 'bordao', name: 'Bordão', type: 'weapon', cost: 0.2, weight: 2, damage: '1d6', damageType: 'concussão', properties: ['versátil (1d8)'] },
    { id: 'clava_grande', name: 'Clava Grande', type: 'weapon', cost: 0.2, weight: 5, damage: '1d8', damageType: 'concussão', properties: ['duas mãos'] },
    { id: 'foice_curta', name: 'Foice Curta', type: 'weapon', cost: 1, weight: 1, damage: '1d4', damageType: 'cortante', properties: ['leve'] },
    { id: 'lanca', name: 'Lança', type: 'weapon', cost: 1, weight: 1.5, damage: '1d6', damageType: 'perfurante', properties: ['arremesso (6/18)', 'versátil (1d8)'], range: '6/18' },
    { id: 'maca', name: 'Maça', type: 'weapon', cost: 5, weight: 2, damage: '1d6', damageType: 'concussão', properties: [] },
    { id: 'machadinha', name: 'Machadinha', type: 'weapon', cost: 5, weight: 1, damage: '1d6', damageType: 'cortante', properties: ['leve', 'arremesso (6/18)'], range: '6/18' },
    { id: 'martelo_leve', name: 'Martelo Leve', type: 'weapon', cost: 2, weight: 1, damage: '1d4', damageType: 'concussão', properties: ['leve', 'arremesso (6/18)'], range: '6/18' },
    { id: 'porrete', name: 'Porrete', type: 'weapon', cost: 0.1, weight: 1, damage: '1d4', damageType: 'concussão', properties: ['leve'] },

    // --- SIMPLE RANGED WEAPONS ---
    { id: 'arco_curto', name: 'Arco Curto', type: 'weapon', cost: 25, weight: 1, damage: '1d6', damageType: 'perfurante', properties: ['munição', 'duas mãos'], range: '24/96' },
    { id: 'besta_leve', name: 'Besta Leve', type: 'weapon', cost: 25, weight: 2.5, damage: '1d8', damageType: 'perfurante', properties: ['munição', 'recarga', 'duas mãos'], range: '24/96' },
    { id: 'dardo', name: 'Dardo', type: 'weapon', cost: 0.05, weight: 0.1, damage: '1d4', damageType: 'perfurante', properties: ['acuidade', 'arremesso (6/18)'], range: '6/18' },
    { id: 'funda', name: 'Funda', type: 'weapon', cost: 0.1, weight: 0, damage: '1d4', damageType: 'concussão', properties: ['munição'], range: '9/36' },

    // --- MARTIAL MELEE WEAPONS ---
    { id: 'alabarda', name: 'Alabarda', type: 'weapon', cost: 20, weight: 3, damage: '1d10', damageType: 'cortante', properties: ['pesada', 'alcance', 'duas mãos'] },
    { id: 'cimitarra', name: 'Cimitarra', type: 'weapon', cost: 25, weight: 1.5, damage: '1d6', damageType: 'cortante', properties: ['acuidade', 'leve'] },
    { id: 'chicote', name: 'Chicote', type: 'weapon', cost: 2, weight: 1.5, damage: '1d4', damageType: 'cortante', properties: ['acuidade', 'alcance'] },
    { id: 'espada_curta', name: 'Espada Curta', type: 'weapon', cost: 10, weight: 1, damage: '1d6', damageType: 'perfurante', properties: ['acuidade', 'leve'] },
    { id: 'espada_grande', name: 'Espada Grande', type: 'weapon', cost: 50, weight: 3, damage: '2d6', damageType: 'cortante', properties: ['pesada', 'duas mãos'] },
    { id: 'espada_longa', name: 'Espada Longa', type: 'weapon', cost: 15, weight: 1.5, damage: '1d8', damageType: 'cortante', properties: ['versátil (1d10)'] },
    { id: 'glaive', name: 'Glaive', type: 'weapon', cost: 20, weight: 3, damage: '1d10', damageType: 'cortante', properties: ['pesada', 'alcance', 'duas mãos'] },
    { id: 'machado_batalha', name: 'Machado de Batalha', type: 'weapon', cost: 10, weight: 2, damage: '1d8', damageType: 'cortante', properties: ['versátil (1d10)'] },
    { id: 'machado_grande', name: 'Machado Grande', type: 'weapon', cost: 30, weight: 3.5, damage: '1d12', damageType: 'cortante', properties: ['pesada', 'duas mãos'] },
    { id: 'mail', name: 'Mangual', type: 'weapon', cost: 10, weight: 1, damage: '1d8', damageType: 'concussão', properties: [] },
    { id: 'martelo_guerra', name: 'Martelo de Guerra', type: 'weapon', cost: 15, weight: 1, damage: '1d8', damageType: 'concussão', properties: ['versátil (1d10)'] },
    { id: 'maul', name: 'Dormência (Maul)', type: 'weapon', cost: 10, weight: 5, damage: '2d6', damageType: 'concussão', properties: ['pesada', 'duas mãos'] },
    { id: 'picareta_guerra', name: 'Picareta de Guerra', type: 'weapon', cost: 5, weight: 1, damage: '1d8', damageType: 'perfurante', properties: [] },
    { id: 'rapieira', name: 'Rapieira', type: 'weapon', cost: 25, weight: 1, damage: '1d8', damageType: 'perfurante', properties: ['acuidade'] },
    { id: 'tridente', name: 'Tridente', type: 'weapon', cost: 5, weight: 2, damage: '1d6', damageType: 'perfurante', properties: ['arremesso (6/18)', 'versátil (1d8)'], range: '6/18' },

    // --- WITCHER WEAPONS (Aliases & Specifics) ---
    { id: 'espada_de_aco_de_bruxo', name: 'Espada de Aço de Bruxo', type: 'weapon', cost: 200, weight: 1.5, damage: '1d8', damageType: 'cortante', properties: ['versátil (1d10)', 'prata-falso (aço)'], description: 'Espada bem balanceada para matar humanos e não-monstros.' },
    { id: 'espada_de_prata_de_bruxo', name: 'Espada de Prata de Bruxo', type: 'weapon', cost: 400, weight: 1.5, damage: '1d8', damageType: 'cortante', properties: ['versátil (1d10)', 'prata'], description: 'Espada revestida de prata, letal contra monstros.' },
    // Aliases for Class Starting Gear matches
    { id: 'espada_de_aco', name: 'Espada de Aço', type: 'weapon', cost: 200, weight: 1.5, damage: '1d8', damageType: 'cortante', properties: ['versátil (1d10)', 'prata-falso (aço)'] },
    { id: 'espada_de_prata', name: 'Espada de Prata', type: 'weapon', cost: 400, weight: 1.5, damage: '1d8', damageType: 'cortante', properties: ['versátil (1d10)', 'prata'] },

    // --- MARTIAL RANGED WEAPONS ---
    { id: 'arco_longo', name: 'Arco Longo', type: 'weapon', cost: 50, weight: 1, damage: '1d8', damageType: 'perfurante', properties: ['munição', 'pesada', 'duas mãos'], range: '45/180' },
    { id: 'besta_mao', name: 'Besta de Mão', type: 'weapon', cost: 75, weight: 1.5, damage: '1d6', damageType: 'perfurante', properties: ['munição', 'leve', 'recarga'], range: '9/36' },
    { id: 'besta_pesada', name: 'Besta Pesada', type: 'weapon', cost: 50, weight: 9, damage: '1d10', damageType: 'perfurante', properties: ['munição', 'pesada', 'recarga', 'duas mãos'], range: '30/120' },

    // --- ARMOR ---
    // Light
    { id: 'acolchoada', name: 'Acolchoada', type: 'armor', cost: 5, weight: 4, ac: 11, acDexBonus: true, stealthDisadvantage: true },
    { id: 'armadura_couro', name: 'Armadura de Couro', type: 'armor', cost: 10, weight: 5, ac: 11, acDexBonus: true },
    { id: 'armadura_de_couro', name: 'Armadura de Couro', type: 'armor', cost: 10, weight: 5, ac: 11, acDexBonus: true }, // Alias
    { id: 'couro_batido', name: 'Couro Batido', type: 'armor', cost: 45, weight: 6.5, ac: 12, acDexBonus: true },
    { id: 'armadura_de_couro_batido', name: 'Armadura de Couro Batido', type: 'armor', cost: 45, weight: 6.5, ac: 12, acDexBonus: true }, // Alias

    // Medium
    { id: 'gibao_peles', name: 'Gibão de Peles', type: 'armor', cost: 10, weight: 6, ac: 12, acDexBonus: true, acMaxDex: 2 },
    { id: 'camisao_malha', name: 'Camisão de Malha', type: 'armor', cost: 50, weight: 10, ac: 13, acDexBonus: true, acMaxDex: 2 },
    { id: 'cota_escamas', name: 'Cota de Escamas', type: 'armor', cost: 50, weight: 22, ac: 14, acDexBonus: true, acMaxDex: 2, stealthDisadvantage: true },
    { id: 'peitoral', name: 'Peitoral', type: 'armor', cost: 400, weight: 10, ac: 14, acDexBonus: true, acMaxDex: 2 },
    { id: 'meia_armadura', name: 'Meia Armadura', type: 'armor', cost: 750, weight: 20, ac: 15, acDexBonus: true, acMaxDex: 2, stealthDisadvantage: true },

    // --- WITCHER ARMOR ---
    { id: 'armadura_de_bruxo', name: 'Armadura de Bruxo', type: 'armor', cost: 150, weight: 8, ac: 13, acDexBonus: true, description: 'Armadura reforçada com couro e cota de malha leve. Ideal para movimentos rápidos.' },

    // Heavy
    { id: 'cota_aneis', name: 'Cota de Anéis', type: 'armor', cost: 30, weight: 20, ac: 14, acDexBonus: false, stealthDisadvantage: true },
    { id: 'cota_malha', name: 'Cota de Malha', type: 'armor', cost: 75, weight: 25, ac: 16, acDexBonus: false, strengthReq: 13, stealthDisadvantage: true },
    { id: 'cota_de_malha', name: 'Cota de Malha', type: 'armor', cost: 75, weight: 25, ac: 16, acDexBonus: false, strengthReq: 13, stealthDisadvantage: true }, // Alias
    { id: 'cota_talas', name: 'Cota de Talas', type: 'armor', cost: 200, weight: 30, ac: 17, acDexBonus: false, strengthReq: 15, stealthDisadvantage: true },
    { id: 'placas', name: 'Armadura de Placas', type: 'armor', cost: 1500, weight: 32, ac: 18, acDexBonus: false, strengthReq: 15, stealthDisadvantage: true },

    // Shield
    { id: 'escudo', name: 'Escudo', type: 'armor', cost: 10, weight: 3, ac: 2, acDexBonus: false },

    // --- ADVENTURING GEAR ---
    { id: 'mochila', name: 'Mochila', type: 'gear', cost: 2, weight: 2.5 },
    { id: 'saco_dormir', name: 'Saco de Dormir', type: 'gear', cost: 1, weight: 3.5 },
    { id: 'tocha', name: 'Tocha', type: 'consumable', cost: 0.01, weight: 0.5 },
    { id: 'nacao_viagem', name: 'Ração de Viagem (1 dia)', type: 'consumable', cost: 0.5, weight: 1 },
    { id: 'corda_canhamo', name: 'Corda de Cânhamo (15m)', type: 'gear', cost: 1, weight: 5 },

    // --- WITCHER POTIONS & ITEMS ---
    { id: 'pocao_andorinha', name: 'Poção Andorinha', type: 'consumable', cost: 20, weight: 0.5, toxicity: 20, description: 'Acelera a regeneração de vitalidade (Cura 1d6 + Nível por turno por 3 rodadas).' },
    { id: 'pocao_gato', name: 'Poção Gato', type: 'consumable', cost: 20, weight: 0.5, toxicity: 15, description: 'Permite ver na escuridão total (Visão no Escuro 18m) por 1 hora.' },
    { id: 'pocao_raio', name: 'Poção Raio', type: 'consumable', cost: 20, weight: 0.5, toxicity: 25, description: 'Aumenta a força dos ataques temporariamente (+1d4 de dano) por 1 minuto.' },
    { id: 'pocao_mel_branco', name: 'Mel Branco', type: 'consumable', cost: 15, weight: 0.5, toxicity: 0, description: 'Limpa toda a toxicidade e cancela efeitos de poções ativas.' }, // Clears toxicity, no cost
    { id: 'pocao_coruja', name: 'Coruja do Mato', type: 'consumable', cost: 25, weight: 0.5, toxicity: 20, description: 'Acelera a recuperação de Vigor (Recupera 1 Slot de Magia/Sinal Nível 1).' },
    { id: 'pocao_lua_cheia', name: 'Lua Cheia', type: 'consumable', cost: 40, weight: 0.5, toxicity: 70, description: 'Aumenta a Vitalidade Máxima temporariamente (+2d8 PV Temp) por 1 hora.' },
    { id: 'trofeu_monstro', name: 'Troféu de Monstro', type: 'gear', cost: 0, weight: 2.0, description: 'A cabeça de uma besta abatida.' },
    { id: 'medalhao_bruxo', name: 'Medalhão de Bruxo', type: 'gear', cost: 0, weight: 0.2, description: 'Vibra na presença de magia.' },
    { id: 'kit_alquimia', name: 'Kit de Alquimia', type: 'tool', cost: 50, weight: 2.0, description: 'Usado para criar poções e óleos.' },

    // --- AMMUNITION ---
    { id: 'flechas', name: 'Flechas (20)', type: 'consumable', cost: 1, weight: 1, properties: ['munição'] },
    { id: 'virotes', name: 'Virotes (20)', type: 'consumable', cost: 1, weight: 1.5, properties: ['munição'] },
    { id: 'flecha', name: 'Flecha', type: 'consumable', cost: 0.05, weight: 0.05, properties: ['munição'] }, // Single
    { id: 'virote', name: 'Virote', type: 'consumable', cost: 0.05, weight: 0.075, properties: ['munição'] }, // Single

    // --- CLASS ITEMS & FOCUSES ---
    { id: 'simbolo_sagrado', name: 'Símbolo Sagrado', type: 'gear', cost: 5, weight: 0.1 },
    { id: 'bolsa_componentes', name: 'Bolsa de Componentes', type: 'gear', cost: 25, weight: 1 },
    { id: 'bolsa_de_componentes', name: 'Bolsa de Componentes', type: 'gear', cost: 25, weight: 1 }, // Alias
    { id: 'grimorio', name: 'Grimório', type: 'gear', cost: 50, weight: 1.5 },
    { id: 'foco_arcano', name: 'Foco Arcano', type: 'gear', cost: 5, weight: 0.5 },
    { id: 'alaude', name: 'Alaúde', type: 'gear', cost: 35, weight: 1, description: 'Instrumento musical.' },
    { id: 'flauta', name: 'Flauta', type: 'gear', cost: 2, weight: 0.5 },
    { id: 'lira', name: 'Lira', type: 'gear', cost: 30, weight: 1 },
    { id: 'tambor', name: 'Tambor', type: 'gear', cost: 6, weight: 1.5 },

    // --- PACKS & ALIASES ---
    // Packs (Simplified as single items for now, or bundles)
    { id: 'pacote_explorador', name: 'Pacote de Explorador', type: 'gear', cost: 10, weight: 25, description: 'Mochila, saco de dormir, mecha, pederneira, tochas, rações, cantil, corda.' },
    { id: 'pacote_de_explorador', name: 'Pacote de Explorador', type: 'gear', cost: 10, weight: 25, description: 'Mochila, saco de dormir, mecha, pederneira, tochas, rações, cantil, corda.' }, // Alias
    { id: 'pacote_artista', name: 'Pacote de Artista', type: 'gear', cost: 40, weight: 15, description: 'Mochila, saco de dormir, roupas de fantasia, velas, rações, cantil.' },
    { id: 'pacote_de_artista', name: 'Pacote de Artista', type: 'gear', cost: 40, weight: 15, description: 'Mochila, saco de dormir, roupas de fantasia, velas, rações, cantil.' }, // Alias
    { id: 'pacote_sacerdote', name: 'Pacote de Sacerdote', type: 'gear', cost: 19, weight: 12, description: 'Mochila, cobertor, velas, caixa de esmola, incenso, vestes, rações, cantil.' },
    { id: 'pacote_de_sacerdote', name: 'Pacote de Sacerdote', type: 'gear', cost: 19, weight: 12, description: 'Mochila, cobertor, velas, caixa de esmola, incenso, vestes, rações, cantil.' }, // Alias
    { id: 'pacote_assaltante', name: 'Pacote de Assaltante', type: 'gear', cost: 16, weight: 18, description: 'Mochila, esferas, linha, sino, velas, pé de cabra, martelo, pítons, lanterna furta-fogo, óleo, rações, pederneira, cantil, corda.' },
    { id: 'pacote_de_assaltante', name: 'Pacote de Assaltante', type: 'gear', cost: 16, weight: 18, description: 'Mochila, esferas, linha, sino, velas, pé de cabra, martelo, pítons, lanterna furta-fogo, óleo, rações, pederneira, cantil, corda.' }, // Alias
    { id: 'pacote_estudioso', name: 'Pacote de Estudioso', type: 'gear', cost: 40, weight: 5, description: 'Mochila, livro de lore, tinta, pena, pergaminho, areia, faca pequena.' },
    { id: 'pacote_de_estudioso', name: 'Pacote de Estudioso', type: 'gear', cost: 40, weight: 5, description: 'Mochila, livro de lore, tinta, pena, pergaminho, areia, faca pequena.' }, // Alias
    { id: 'pacote_aventureiro', name: 'Pacote de Aventureiro', type: 'gear', cost: 12, weight: 20, description: 'Mochila, pé de cabra, martelo, pítons, tochas, pederneira, rações, cantil, corda.' },
    { id: 'pacote_de_aventureiro', name: 'Pacote de Aventureiro', type: 'gear', cost: 12, weight: 20, description: 'Mochila, pé de cabra, martelo, pítons, tochas, pederneira, rações, cantil, corda.' }, // Alias

    // Tools
    { id: 'ferramentas_ladrao', name: 'Ferramentas de Ladrão', type: 'tool', cost: 25, weight: 0.5 },
    { id: 'ferramentas_de_ladrao', name: 'Ferramentas de Ladrão', type: 'tool', cost: 25, weight: 0.5 }, // Alias for mismatched strings

];
