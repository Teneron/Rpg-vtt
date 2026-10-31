export interface WarlockInvocation {
    id: string;
    name: string;
    nameEn: string;
    minLevel: number;
    prerequisite?: string;
    description: string;
    grantsSpellId?: string;
    grantsAttackBonus?: boolean;
    system?: 'dnd55e' | 'all';
}

/**
 * Tabela Oficial de Quantidade de Invocações Místicas do Bruxo (D&D 2024 / 5.5e)
 * Nível 1: 1 invocação
 * Nível 2 a 4: 3 invocações
 * Nível 5 a 6: 5 invocações
 * Nível 7 a 8: 6 invocações
 * Nível 9 a 11: 7 invocações
 * Nível 12 a 14: 8 invocações
 * Nível 15 a 17: 9 invocações
 * Nível 18 a 20: 10 invocações
 */
export function getMaxInvocations(level: number): number {
    const safeLvl = Math.max(1, Math.min(20, Math.floor(level || 1)));
    if (safeLvl >= 18) return 10;
    if (safeLvl >= 15) return 9;
    if (safeLvl >= 12) return 8;
    if (safeLvl >= 9) return 7;
    if (safeLvl >= 7) return 6;
    if (safeLvl >= 5) return 5;
    if (safeLvl >= 2) return 3;
    return 1;
}

/**
 * Catálogo Oficial de Invocações Místicas (D&D 2024 / 5.5e)
 */
export const WARLOCK_INVOCATIONS: WarlockInvocation[] = [
    // --- NÍVEL 1+ / PACTOS & BÁSICOS ---
    {
        id: 'pact_of_the_blade',
        name: 'Pacto da Lâmina (Pact of the Blade)',
        nameEn: 'Pact of the Blade',
        minLevel: 1,
        description: 'Você conjura ou vincula uma arma mágica usando Carisma para jogadas de ataque e dano no lugar de Força ou Destreza, causando dano de Força, Radiante ou Necrótico.'
    },
    {
        id: 'pact_of_the_tome',
        name: 'Pacto do Tomo (Pact of the Tome)',
        nameEn: 'Pact of the Tome',
        minLevel: 1,
        description: 'Seu patrono lhe concede o Livro das Sombras com 3 truques adicionais de qualquer classe e magias de ritual de 1º círculo.'
    },
    {
        id: 'pact_of_the_chain',
        name: 'Pacto da Corrente (Pact of the Chain)',
        nameEn: 'Pact of the Chain',
        minLevel: 1,
        grantsSpellId: 'find_familiar',
        description: 'Você aprende Encontrar Familiar e adquire formas sobrenaturais inteligentes (como Sprite, Pseudodragão, Diabrete, Esqueleto ou Quasit), podendo atacar através dele.'
    },

    // --- NÍVEL 2+ / COMBATE & UTILIDADE ---
    {
        id: 'agonizing_blast',
        name: 'Explosão Agonizante (Agonizing Blast)',
        nameEn: 'Agonizing Blast',
        minLevel: 2,
        prerequisite: 'Truque de Bruxo que cause dano (ex: Rajada Mística)',
        grantsAttackBonus: true,
        description: 'Escolha um dos seus truques de bruxo conhecidos que cause dano (ex: Rajada Mística). Você adiciona seu modificador de Carisma às jogadas de dano dessa magia.'
    },
    {
        id: 'fiendish_vigor',
        name: 'Vigor Ínfero (Fiendish Vigor)',
        nameEn: 'Fiendish Vigor',
        minLevel: 2,
        grantsSpellId: 'false_life',
        description: 'Você pode conjurar Vitalidade Vazia em si mesmo sem gastar espaço de magia. No D&D 2024, você recebe automaticamente o número máximo no dado (12 PV Temporários).'
    },
    {
        id: 'repelling_blast',
        name: 'Repulsão Mística (Repelling Blast)',
        nameEn: 'Repelling Blast',
        minLevel: 2,
        prerequisite: 'Truque Rajada Mística',
        description: 'Ao acertar uma criatura com a Rajada Mística, você pode empurrá-la até 3 metros em linha reta para longe de você.'
    },
    {
        id: 'eldritch_spear',
        name: 'Lança Mística (Eldritch Spear)',
        nameEn: 'Eldritch Spear',
        minLevel: 2,
        prerequisite: 'Truque Rajada Mística',
        description: 'O alcance da sua Rajada Mística aumenta para 90 metros (300 pés).'
    },
    {
        id: 'devils_sight',
        name: 'Visão Diabólica (Devil\'s Sight)',
        nameEn: 'Devil\'s Sight',
        minLevel: 2,
        description: 'Você enxerga normalmente na escuridão mágica e não mágica até 36 metros de distância.'
    },
    {
        id: 'armor_of_shadows',
        name: 'Armadura das Sombras (Armor of Shadows)',
        nameEn: 'Armor of Shadows',
        minLevel: 2,
        grantsSpellId: 'mage_armor',
        description: 'Você pode conjurar Armadura Arcana sobre si mesmo à vontade, sem gastar espaços de magia ou componentes materiais.'
    },
    {
        id: 'mask_of_many_faces',
        name: 'Máscara de Muitas Faces (Mask of Many Faces)',
        nameEn: 'Mask of Many Faces',
        minLevel: 2,
        grantsSpellId: 'disguise_self',
        description: 'Você pode conjurar Disfarçar-se sobre si mesmo à vontade, sem gastar espaços de magia ou componentes.'
    },
    {
        id: 'eldritch_mind',
        name: 'Mente Mística (Eldritch Mind)',
        nameEn: 'Eldritch Mind',
        minLevel: 2,
        description: 'Você possui Vantagem em testes de resistência de Constituição para manter a concentração em suas magias.'
    },
    {
        id: 'eyes_rune_keeper',
        name: 'Olhos do Guardião das Runas (Eyes of the Rune Keeper)',
        nameEn: 'Eyes of the Rune Keeper',
        minLevel: 2,
        description: 'Você consegue ler e compreender qualquer escrita, runa ou idioma escrito.'
    },
    {
        id: 'lessons_of_the_first_ones',
        name: 'Lições dos Primeiros (Lessons of the First Ones)',
        nameEn: 'Lessons of the First Ones',
        minLevel: 2,
        description: 'Seu patrono lhe concede segredos antigos. Você recebe 1 Talento de Origem adicional à sua escolha (ex: Alerta, Sortudo, Duro de Matar ou Iniciado em Magia).'
    },
    {
        id: 'otherworldly_leap',
        name: 'Salto de Outro Mundo (Otherworldly Leap)',
        nameEn: 'Otherworldly Leap',
        minLevel: 2,
        grantsSpellId: 'jump',
        description: 'Você pode conjurar Salto (Jump) sobre si mesmo à vontade, sem gastar espaços de magia.'
    },
    {
        id: 'beast_speech',
        name: 'Voz das Feras (Beast Speech)',
        nameEn: 'Beast Speech',
        minLevel: 2,
        grantsSpellId: 'speak_with_animals',
        description: 'Você pode conjurar Falar com Animais à vontade, sem gastar espaços de magia.'
    },
    {
        id: 'misty_visions',
        name: 'Visões Nebulosas (Misty Visions)',
        nameEn: 'Misty Visions',
        minLevel: 2,
        grantsSpellId: 'silent_image',
        description: 'Você pode conjurar Imagem Silenciosa à vontade, sem gastar espaços de magia ou componentes materiais.'
    },

    // --- NÍVEL 5+ ---
    {
        id: 'one_with_shadows',
        name: 'Um com as Sombras (One with Shadows)',
        nameEn: 'One with Shadows',
        minLevel: 5,
        description: 'Quando você estiver em uma área de penumbra ou escuridão, pode usar sua ação para ficar invisível até se mover ou realizar uma ação.'
    },
    {
        id: 'gaze_of_two_minds',
        name: 'Olhar de Duas Mentes (Gaze of Two Minds)',
        nameEn: 'Gaze of Two Minds',
        minLevel: 5,
        description: 'Você pode usar sua ação bônus para tocar um aliado voluntário e perceber através de seus sentidos e conjurar magias partindo do espaço dele.'
    },

    // --- NÍVEL 9+ ---
    {
        id: 'ascendant_step',
        name: 'Passo Ascendente (Ascendant Step)',
        nameEn: 'Ascendant Step',
        minLevel: 9,
        grantsSpellId: 'levitate',
        description: 'Você pode conjurar Levitação sobre si mesmo à vontade, sem gastar espaços de magia ou componentes materiais.'
    },
    {
        id: 'whispers_of_the_grave',
        name: 'Sussurros do Túmulo (Whispers of the Grave)',
        nameEn: 'Whispers of the Grave',
        minLevel: 9,
        grantsSpellId: 'speak_with_dead',
        description: 'Você pode conjurar Falar com os Mortos à vontade, sem gastar espaços de magia.'
    }
];

export function getAvailableInvocations(level: number): WarlockInvocation[] {
    const safeLvl = Math.max(1, Math.floor(level || 1));
    return WARLOCK_INVOCATIONS.filter(inv => inv.minLevel <= safeLvl);
}
