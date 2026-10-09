import type { Character } from '../characterTypes';

export interface CharacterPreset extends Omit<Character, 'id' | 'owner' | 'adventureId'> {
    presetId: string;
    system: 'witcher' | 'dnd55e' | string;
    systemName: string;
    badgeIcon: string;
    roleDescription: string;
    quote: string;
}

export const CHARACTER_PRESETS: CharacterPreset[] = [
    // =========================================================================
    // D&D 5.5E (2024 CORE RULES) PRESETS
    // =========================================================================
    {
        presetId: 'dnd55e_thorne',
        name: 'Thorne Ironbreaker',
        system: 'dnd55e',
        systemName: 'D&D 5.5e',
        badgeIcon: 'D&D 5.5e',
        race: 'Anão (Dwarf)',
        class: 'Guerreiro (Fighter)',
        subclass: 'Campeão',
        level: 1,
        background: 'Soldado (Soldier)',
        alignment: 'Ordeiro e Bom',
        experience: 0,
        nextLevelExperience: 300,
        roleDescription: 'Vanguarda inabalável com Maestria de Armas (Topple no machado, Push no martelo, Slow na besta), Talento Atacante Selvagem e Mente Tática.',
        quote: '"Em 2024, um verdadeiro guerreiro não apenas bate — ele derruba, empurra e quebra a formação inimiga a cada golpe magistral."',
        proficiencyBonus: 2,
        inspiration: true,
        armorClass: 18,
        initiative: 1,
        speed: 9, // Anão 2024 tem deslocamento 9m!
        visionRange: 36, // Visão no Escuro de 36m (120ft) em 2024!
        hp: { current: 15, max: 15, temp: 0 }, // 10 (d10) + 3 (CON) + 1 (Robustez Anã) + 1 (Bônus 2024) = 15
        hitDice: { current: 1, max: 1, dieFace: 'd10' },
        deathSaves: { successes: 0, failures: 0 },
        spellSaveDC: 13,
        spellAttackBonus: 0,
        attributes: {
            str: { name: 'Força (+3)', value: 16, modifier: 3, saveProficiency: true },
            dex: { name: 'Destreza (+1)', value: 12, modifier: 1, saveProficiency: false },
            con: { name: 'Constituição (+3)', value: 16, modifier: 3, saveProficiency: true },
            int: { name: 'Inteligência (+0)', value: 10, modifier: 0, saveProficiency: false },
            wis: { name: 'Sabedoria (+1)', value: 13, modifier: 1, saveProficiency: false },
            cha: { name: 'Carisma (-1)', value: 8, modifier: -1, saveProficiency: false }
        },
        skills: [
            { name: 'Atletismo', attribute: 'str', proficient: true, expertise: false, value: 5 },
            { name: 'Intimidação', attribute: 'cha', proficient: true, expertise: false, value: 1 },
            { name: 'Percepção', attribute: 'wis', proficient: true, expertise: false, value: 3 },
            { name: 'Sobrevivência', attribute: 'wis', proficient: true, expertise: false, value: 3 }
        ],
        attacks: [
            { id: 'axe_topple', name: 'Machado de Batalha (Maestria: Topple)', attackBonus: 5, damageDice: '1d8 + 3', damageType: 'Cortante', properties: 'Versátil (1d10). Topple: Alvo faz Salva CON CD 13 ou cai Caído (Prone)!' },
            { id: 'hammer_push', name: 'Martelo de Guerra (Maestria: Push)', attackBonus: 5, damageDice: '1d8 + 3', damageType: 'Concussão', properties: 'Versátil (1d10). Push: Empurra o alvo 3m em linha reta!' },
            { id: 'xbow_slow', name: 'Besta Leve (Maestria: Slow)', attackBonus: 3, damageDice: '1d8 + 1', damageType: 'Perfurante', range: '24/96m', properties: 'Slow: Reduz o deslocamento do alvo em 3m!' }
        ],
        classResources: [
            { id: 'second_wind', name: 'Retomar o Fôlego (2 Usos)', current: 2, max: 2, rechargesOn: 'short' }
        ],
        features: [
            { name: 'Maestria de Armas (Weapon Mastery)', level: 1, description: 'Desbloqueia as propriedades Topple (Machado), Push (Martelo) e Slow (Besta).', type: 'passive' },
            { name: 'Retomar o Fôlego (Second Wind 2024)', level: 1, description: 'Ação Bônus: recupera 1d10 + 1 PV (possui 2 usos por descanso curto).', type: 'bonus_action' },
            { name: 'Mente Tática (Tactical Mind - Nv 2)', level: 2, description: 'Ao falhar em teste de perícia, gasta 1 Retomar o Fôlego para somar +1d10. Se ainda falhar, o uso NÃO é consumido!', type: 'reaction' },
            { name: 'Talento de Origem: Atacante Selvagem', level: 1, description: 'Uma vez por turno ao acertar com arma, role o dano duas vezes e escolha o maior total.', type: 'passive' },
            { name: 'Robustez Anã & Percepção de Pedra', level: 1, description: '+1 PV por nível e Ação Bônus para ganhar Sentido Sísmico 18m em pedra.', type: 'passive' }
        ],
        spells: [],
        feats: [],
        proficiencies: ['Todas as Armaduras', 'Escudos', 'Armas Simples', 'Armas Marciais', 'Ferramentas de Pedreiro'],
        languages: ['Comum', 'Anão', 'Gigante'],
        inventory: [
            { id: 'item_chainmail', name: 'Cota de Malha 2024', quantity: 1, description: 'Armadura pesada. CA 16.', type: 'armor', ac: 16, equipped: true },
            { id: 'item_shield', name: 'Escudo de Aço de Greyhawk', quantity: 1, description: '+2 na CA.', type: 'armor', ac: 2, equipped: true },
            { id: 'item_axe', name: 'Machado de Batalha (Topple)', quantity: 1, description: 'Arma marcial versátil com propriedade Topple.', type: 'weapon', damage: '1d8', damageType: 'Cortante', equipped: true },
            { id: 'item_hammer', name: 'Martelo de Guerra (Push)', quantity: 1, description: 'Arma marcial versátil com propriedade Push.', type: 'weapon', damage: '1d8', damageType: 'Concussão', equipped: false },
            { id: 'item_xbow', name: 'Besta Leve (Slow) & 20 Virotes', quantity: 1, description: 'Besta leve de recarga rápida.', type: 'weapon', damage: '1d8', damageType: 'Perfurante', equipped: false }
        ],
        currency: { cp: 0, sp: 0, ep: 0, gp: 25, pp: 0 },
        spellSlots: {},
        personalityTraits: 'Disciplinado e protetor. Avalio os pontos fracos de qualquer estrutura antes de desembainhar o aço.',
        ideals: 'Dever e Lealdade. Uma ordem dada deve ser cumprida com excelência.',
        bonds: 'Luto em nome da milícia livre de Greyhawk e dos anões das Colinas Cairn.',
        flaws: 'Às vezes sou teimoso demais para recuar diante de perigo evidente.',
        notes: 'Ficha oficial atualizada para as regras D&D 5.5e (2024) com Weapon Mastery e Background 2024.'
    },
    {
        presetId: 'dnd55e_lyra',
        name: 'Lyra Moonwhisper',
        system: 'dnd55e',
        systemName: 'D&D 5.5e',
        badgeIcon: 'D&D 5.5e',
        race: 'Alta Elfa (High Elf)',
        class: 'Maga (Wizard)',
        subclass: 'Evocação',
        level: 1,
        background: 'Sábia (Sage)',
        alignment: 'Caótico e Bom',
        experience: 0,
        nextLevelExperience: 300,
        roleDescription: 'Conjuradora arcana de elite de Greyhawk. Possui o Talento de Origem Iniciado em Magia, Grimório como Foco Arcano e Recuperação Arcana.',
        quote: '"A magia é tão fluida quanto o pensamento. Um truque com a mão livre e uma explosão mágica decidem a batalha."',
        proficiencyBonus: 2,
        inspiration: true,
        armorClass: 12, // 15 com Armadura Arcana
        initiative: 2,
        speed: 9,
        visionRange: 18,
        hp: { current: 8, max: 8, temp: 0 },
        hitDice: { current: 1, max: 1, dieFace: 'd6' },
        deathSaves: { successes: 0, failures: 0 },
        spellSaveDC: 13, // 8 + 2 (PB) + 3 (INT)
        spellAttackBonus: 5, // 2 (PB) + 3 (INT)
        attributes: {
            str: { name: 'Força (-1)', value: 8, modifier: -1, saveProficiency: false },
            dex: { name: 'Destreza (+2)', value: 14, modifier: 2, saveProficiency: false },
            con: { name: 'Constituição (+2)', value: 14, modifier: 2, saveProficiency: false },
            int: { name: 'Inteligência (+3)', value: 16, modifier: 3, saveProficiency: true },
            wis: { name: 'Sabedoria (+1)', value: 12, modifier: 1, saveProficiency: true },
            cha: { name: 'Carisma (+0)', value: 10, modifier: 0, saveProficiency: false }
        },
        skills: [
            { name: 'Arcanismo', attribute: 'int', proficient: true, expertise: false, value: 5 },
            { name: 'História', attribute: 'int', proficient: true, expertise: false, value: 5 },
            { name: 'Investigação', attribute: 'int', proficient: true, expertise: false, value: 5 },
            { name: 'Percepção', attribute: 'wis', proficient: true, expertise: false, value: 3 }
        ],
        attacks: [
            { id: 'firebolt_dnd', name: 'Raio de Fogo (Fire Bolt)', attackBonus: 5, damageDice: '1d10', damageType: 'Ígneo', range: '36m', properties: 'Incendeia objetos inflamáveis' },
            { id: 'dagger_nick', name: 'Adaga Élfica (Maestria: Nick)', attackBonus: 4, damageDice: '1d4 + 2', damageType: 'Perfurante', range: '6/18m', properties: 'Acuidade, Leve, Nick' }
        ],
        classResources: [
            { id: 'arcane_recovery', name: 'Recuperação Arcana (1 Slot)', current: 1, max: 1, rechargesOn: 'long' }
        ],
        features: [
            { name: 'Grimório como Foco Arcano', level: 1, description: 'Seu próprio livro de magias atua como foco de conjuração.', type: 'passive' },
            { name: 'Recuperação Arcana', level: 1, description: 'Durante descanso curto recupera 1 espaço de magia de 1º círculo.', type: 'action' },
            { name: 'Talento de Origem: Iniciado em Magia (Clérigo)', level: 1, description: 'Aprendeu Orientação, Chave Sagrada e Curar Ferimentos (1x grátis/descanso longo).', type: 'passive' },
            { name: 'Ancestralidade Feérica & Transe', level: 1, description: 'Vantagem contra encanto, imune a sono e descanso longo em 4 horas.', type: 'passive' }
        ],
        spells: [
            { id: 'fire_bolt', name: 'Raio de Fogo', level: 0, school: 'Evocação', castingTime: '1 Ação', range: '36m', components: 'V, S', duration: 'Instantânea', description: 'Feixe de fogo flamejante causa 1d10 de dano.', classes: ['wizard'] },
            { id: 'mage_hand', name: 'Mãos Mágicas', level: 0, school: 'Conjuração', castingTime: '1 Ação', range: '9m', components: 'V, S', duration: '1 minuto', description: 'Manipula objetos a distância até 4,5kg.', classes: ['wizard'] },
            { id: 'guidance', name: 'Orientação (Guidance)', level: 0, school: 'Adivinhação', castingTime: '1 Ação', range: 'Toque', components: 'V, S', duration: 'Concentração 1 min', description: 'Alvo soma +1d4 em um teste de atributo.', classes: ['cleric'] },
            { id: 'magic_missile', name: 'Mísseis Mágicos', level: 1, school: 'Evocação', castingTime: '1 Ação', range: '36m', components: 'V, S', duration: 'Instantânea', description: 'Dispara 3 dardos infalíveis causando 1d4 + 1 de dano de força cada.', classes: ['wizard'] },
            { id: 'mage_armor', name: 'Armadura Arcana', level: 1, school: 'Abjuração', castingTime: '1 Ação', range: 'Toque', components: 'V, S, M', duration: '8 horas', description: 'A CA do alvo torna-se 13 + Modificador de Destreza (Total CA 15).', classes: ['wizard'] },
            { id: 'cure_wounds', name: 'Curar Ferimentos (1x Grátis)', level: 1, school: 'Abjuração', castingTime: '1 Ação', range: 'Toque', components: 'V, S', duration: 'Instantânea', description: 'Recupera 2d8 + SAB de Pontos de Vida.', classes: ['cleric'] }
        ],
        feats: [],
        proficiencies: ['Adagas', 'Dardos', 'Fundas', 'Bordões', 'Besta Leve', 'Suprimentos de Calígrafo'],
        languages: ['Comum', 'Élfico', 'Dracônico', 'Celestial'],
        inventory: [
            { id: 'item_spellbook', name: 'Grimório Iluminado de Greyhawk', quantity: 1, description: 'Tomo com anotações arcanas do Círculo dos Oito.', type: 'gear' },
            { id: 'item_staff', name: 'Bordão com Cristal de Foco', quantity: 1, description: 'Foco arcano.', type: 'weapon', damage: '1d6', damageType: 'Concussão', equipped: true },
            { id: 'item_dagger', name: 'Adaga Élfica (Nick)', quantity: 1, description: 'Adaga leve.', type: 'weapon', damage: '1d4', damageType: 'Perfurante', equipped: true }
        ],
        currency: { cp: 0, sp: 0, ep: 0, gp: 35, pp: 0 },
        spellSlots: { 1: { max: 2, used: 0 } },
        personalityTraits: 'Curiosa, acadêmica e fascinada pelos mistérios das ruínas de Zagyg.',
        ideals: 'Descoberta. O conhecimento arcano deve iluminar o caminho das civilizações.',
        bonds: 'Pretendo decifrar os tomos ancestrais do Grande Colégio de Magia de Greyhawk.',
        flaws: 'Subestimo monstros brutais quando há inscrições rúnicas na sala.',
        notes: 'Maga oficial com antecedentes e talentos de origem integrados.'
    },
    {
        presetId: 'dnd55e_varis',
        name: 'Varis Shadowstep',
        system: 'dnd55e',
        systemName: 'D&D 5.5e',
        badgeIcon: 'D&D 5.5e',
        race: 'Halfling',
        class: 'Ladino (Rogue)',
        subclass: 'Ladrão',
        level: 1,
        background: 'Criminoso (Criminal)',
        alignment: 'Caótico e Neutro',
        experience: 0,
        nextLevelExperience: 300,
        roleDescription: 'Infiltrador acrobático com Maestria de Armas (Vex e Nick), Talento Alerta (+PB na iniciativa e troca tática), Sorte de Halfling e Golpe Ladino.',
        quote: '"Se eu acertar com a rapieira, a próxima lâmina já entra com Vantagem garantida por Vex."',
        proficiencyBonus: 2,
        inspiration: true,
        armorClass: 15, // 11 Couro + 4 DES = 15
        initiative: 6, // 4 DES + 2 PB (Talento Alerta!)
        speed: 9,
        visionRange: 15,
        hp: { current: 10, max: 10, temp: 0 },
        hitDice: { current: 1, max: 1, dieFace: 'd8' },
        deathSaves: { successes: 0, failures: 0 },
        spellSaveDC: 12,
        spellAttackBonus: 0,
        attributes: {
            str: { name: 'Força (+0)', value: 10, modifier: 0, saveProficiency: false },
            dex: { name: 'Destreza (+4)', value: 18, modifier: 4, saveProficiency: true },
            con: { name: 'Constituição (+2)', value: 14, modifier: 2, saveProficiency: false },
            int: { name: 'Inteligência (+1)', value: 12, modifier: 1, saveProficiency: true },
            wis: { name: 'Sabedoria (+1)', value: 12, modifier: 1, saveProficiency: false },
            cha: { name: 'Carisma (+0)', value: 10, modifier: 0, saveProficiency: false }
        },
        skills: [
            { name: 'Acrobacia', attribute: 'dex', proficient: true, expertise: false, value: 6 },
            { name: 'Furtividade', attribute: 'dex', proficient: true, expertise: true, value: 8 },
            { name: 'Prestidigitação', attribute: 'dex', proficient: true, expertise: true, value: 8 },
            { name: 'Enganação', attribute: 'cha', proficient: true, expertise: false, value: 2 },
            { name: 'Percepção', attribute: 'wis', proficient: true, expertise: false, value: 3 }
        ],
        attacks: [
            { id: 'rapier_vex', name: 'Rapieira (Maestria: Vex)', attackBonus: 6, damageDice: '1d8 + 4', damageType: 'Perfurante', properties: 'Acuidade. Vex: Acertar concede Vantagem no próximo ataque contra o alvo!' },
            { id: 'dagger_nick_rogue', name: 'Adaga Secundária (Maestria: Nick)', attackBonus: 6, damageDice: '1d4 + 4', damageType: 'Perfurante', properties: 'Nick: Ataque extra feito como parte da ação Atacar!' },
            { id: 'shortbow_slow', name: 'Arco Curto (Maestria: Slow)', attackBonus: 6, damageDice: '1d6 + 4', damageType: 'Perfurante', range: '24/96m', properties: 'Slow: Reduz 3m de deslocamento do alvo.' }
        ],
        classResources: [
            { id: 'sneak_attack', name: 'Ataque Furtivo (+1d6)', current: 1, max: 1, rechargesOn: 'short' }
        ],
        features: [
            { name: 'Ataque Furtivo (Sneak Attack)', level: 1, description: 'Causa +1d6 de dano se tiver vantagem ou se houver aliado adjacente ao alvo.', type: 'passive' },
            { name: 'Maestria de Armas (Vex & Nick)', level: 1, description: 'Desbloqueia vantagens táticas automáticas ao acertar com rapieira e adaga.', type: 'passive' },
            { name: 'Talento de Origem: Alerta (Alert)', level: 1, description: 'Soma +2 PB na Iniciativa e pode trocar sua pontuação com um aliado voluntário no combate!', type: 'passive' },
            { name: 'Sorte de Halfling', level: 1, description: 'Rerrola qualquer 1 natural tirado em testes de d20.', type: 'passive' }
        ],
        spells: [],
        feats: [],
        proficiencies: ['Armas Simples', 'Rapieira', 'Espada Curta', 'Armaduras Leves', 'Ferramentas de Ladrão'],
        languages: ['Comum', 'Pequenino', 'Gíria de Ladrão'],
        inventory: [
            { id: 'item_leather', name: 'Armadura de Couro Tratado', quantity: 1, description: 'CA 11.', type: 'armor', ac: 11, equipped: true },
            { id: 'item_rapier', name: 'Rapieira Balanceada (Vex)', quantity: 1, description: 'Arma com maestria Vex.', type: 'weapon', damage: '1d8', damageType: 'Perfurante', equipped: true },
            { id: 'item_dagger_rogue', name: 'Adaga Fina (Nick)', quantity: 1, description: 'Arma leve.', type: 'weapon', damage: '1d4', damageType: 'Perfurante', equipped: true },
            { id: 'item_thieves_tools', name: 'Gazuas de Precisão de Greyhawk', quantity: 1, description: 'Kit para trancas e armadilhas.', type: 'gear' }
        ],
        currency: { cp: 0, sp: 0, ep: 0, gp: 40, pp: 0 },
        spellSlots: {},
        personalityTraits: 'Rápido no raciocínio e silencioso como a névoa das Colinas dos Ladrões.',
        ideals: 'Liberdade. Nenhuma grade ou baú deve conter quem nasceu para caminhar livre.',
        bonds: 'Protejo meus parceiros de golpe porque lealdade na rua vale mais do que ouro.',
        flaws: 'Não resisto a inspecionar uma fechadura que me disseram ser impossível de abrir.',
        notes: 'Ladino oficial com Ataque Furtivo, Vex e Nick integrados.'
    },

    // =========================================================================
    // THE WITCHER PRESETS
    // =========================================================================
    {
        presetId: 'witcher_geralt',
        name: 'Geralt de Rívia (Lobo Branco)',
        system: 'witcher',
        systemName: 'The Witcher',
        badgeIcon: 'WITCHER',
        race: 'Humano (Bruxo Mutante)',
        class: 'Bruxo',
        subclass: 'Escola do Lobo',
        level: 1,
        background: 'Lobo Branco / Andarilho de Velen',
        alignment: 'Neutro Pragmático',
        experience: 0,
        nextLevelExperience: 300,
        roleDescription: 'Predador profissional de monstros forjado na Prova das Ervas. Mestre em lâminas duplas, sinais arcanos e toxicidade alquímica.',
        quote: '"O mal é o mal. Menor, maior, de meio termo... Se eu tiver que escolher entre um mal e outro, prefiro não escolher nada."',
        proficiencyBonus: 2,
        inspiration: true,
        armorClass: 16,
        initiative: 3,
        speed: 9,
        visionRange: 24,
        hp: { current: 45, max: 45, temp: 0 },
        hitDice: { current: 1, max: 1, dieFace: 'd10' },
        deathSaves: { successes: 0, failures: 0 },
        spellSaveDC: 14,
        spellAttackBonus: 6,
        attributes: {
            str: { name: 'Força', value: 16, modifier: 3, saveProficiency: true },
            dex: { name: 'Destreza', value: 16, modifier: 3, saveProficiency: true },
            con: { name: 'Constituição', value: 16, modifier: 3, saveProficiency: true },
            int: { name: 'Inteligência', value: 12, modifier: 1, saveProficiency: false },
            wis: { name: 'Sabedoria', value: 14, modifier: 2, saveProficiency: true },
            cha: { name: 'Carisma', value: 8, modifier: -1, saveProficiency: false }
        },
        skills: [
            { name: 'Atletismo', attribute: 'str', proficient: true, expertise: false, value: 5 },
            { name: 'Acrobacia', attribute: 'dex', proficient: true, expertise: true, value: 7 },
            { name: 'Percepção', attribute: 'wis', proficient: true, expertise: true, value: 6 },
            { name: 'Sobrevivência', attribute: 'wis', proficient: true, expertise: true, value: 6 },
            { name: 'Intimidação', attribute: 'str', proficient: true, expertise: false, value: 3 }
        ],
        attacks: [
            { id: 'steel_sword', name: 'Espada de Aço Meteorítico', attackBonus: 5, damageDice: '1d8 + 3', damageType: 'Cortante', properties: 'Aço. Versátil (1d10)' },
            { id: 'silver_sword', name: 'Espada de Prata Kaer Morhen', attackBonus: 5, damageDice: '1d8 + 3', damageType: 'Prata', properties: 'Prata. +2d6 contra Necrófagos e Espectros' }
        ],
        classResources: [
            { id: 'vigor', name: 'Vigor para Sinais', current: 4, max: 4, rechargesOn: 'short' },
            { id: 'toxicity', name: 'Toxicidade Alquímica (%)', current: 0, max: 100, rechargesOn: 'short' }
        ],
        features: [
            { name: 'Sentidos de Bruxo', level: 1, description: 'Rastreia odores, pegadas e resíduos mágicos sem desvantagem por escuridão.', type: 'passive' },
            { name: 'Sinal de Igni (Fogo)', level: 1, description: 'Cone de chamas de 4,5m: 2d6 de dano de fogo e chance de queimar.', type: 'action' },
            { name: 'Sinal de Quen (Escudo)', level: 1, description: 'Escudo arcano: absorve até 12 pontos de dano.', type: 'reaction' },
            { name: 'Sinal de Aard (Telecinese)', level: 1, description: 'Onda cinética derruba e empurra inimigos.', type: 'action' }
        ],
        spells: [],
        feats: [],
        proficiencies: ['Espadas de Bruxo', 'Armaduras Médias', 'Alquimia'],
        languages: ['Comum', 'Fala Antiga'],
        inventory: [
            { id: 'item_steel', name: 'Espada de Aço', quantity: 1, description: 'Lâmina para homens e bestas mundanas.', type: 'weapon', damage: '1d8', damageType: 'Cortante', equipped: true },
            { id: 'item_silver', name: 'Espada de Prata', quantity: 1, description: 'Forjada para monstros sobrenaturais.', type: 'weapon', damage: '1d8', damageType: 'Prata', equipped: true },
            { id: 'item_potion_swallow', name: 'Poção Andorinha x2', quantity: 2, description: 'Recupera PV ao longo de 5 rodadas (Gera 20% Toxicidade).', type: 'consumable' }
        ],
        currency: { cp: 0, sp: 25, ep: 0, gp: 50, pp: 0 },
        spellSlots: {},
        personalityTraits: 'Calculista, cínico e profissional. Nunca trabalho de graça.',
        ideals: 'Neutralidade. O destino conduz, mas a lâmina decide.',
        bonds: 'Kaer Morhen e o destino de Ciri.',
        flaws: 'Dificuldade de confiar em políticos e feiticeiras manipuladoras.',
        notes: 'Ficha oficial adaptada de The Witcher para o sistema D&D 5e.'
    },
    {
        presetId: 'witcher_roche',
        name: 'Vernon Roche',
        system: 'witcher',
        systemName: 'The Witcher',
        badgeIcon: 'WITCHER',
        race: 'Humano (Teméria)',
        class: 'Guerreiro',
        subclass: 'Comandante dos Listras Azuis',
        level: 1,
        background: 'Soldado Veterano',
        alignment: 'Ordeiro e Neutro',
        experience: 0,
        nextLevelExperience: 300,
        roleDescription: 'Comandante de forças especiais temeriano. Especialista em táticas de emboscada, brigandina pesada e disciplina militar.',
        quote: '"Um homem luta pelo que acredita. Eu acredito em uma Teméria livre e soberana."',
        proficiencyBonus: 2,
        inspiration: false,
        armorClass: 16,
        initiative: 2,
        speed: 9,
        visionRange: 15,
        hp: { current: 38, max: 38, temp: 0 },
        hitDice: { current: 1, max: 1, dieFace: 'd10' },
        deathSaves: { successes: 0, failures: 0 },
        spellSaveDC: 10,
        spellAttackBonus: 0,
        attributes: {
            str: { name: 'Força', value: 16, modifier: 3, saveProficiency: true },
            dex: { name: 'Destreza', value: 14, modifier: 2, saveProficiency: false },
            con: { name: 'Constituição', value: 16, modifier: 3, saveProficiency: true },
            int: { name: 'Inteligência', value: 12, modifier: 1, saveProficiency: false },
            wis: { name: 'Sabedoria', value: 12, modifier: 1, saveProficiency: false },
            cha: { name: 'Carisma', value: 10, modifier: 0, saveProficiency: false }
        },
        skills: [
            { name: 'Atletismo', attribute: 'str', proficient: true, expertise: false, value: 5 },
            { name: 'Intimidação', attribute: 'str', proficient: true, expertise: true, value: 7 },
            { name: 'Percepção', attribute: 'wis', proficient: true, expertise: false, value: 3 },
            { name: 'Furtividade', attribute: 'dex', proficient: true, expertise: false, value: 4 }
        ],
        attacks: [
            { id: 'military_sword', name: 'Espada Larga Temeriana', attackBonus: 5, damageDice: '1d8 + 3', damageType: 'Cortante', properties: 'Versátil (1d10)' },
            { id: 'heavy_xbow', name: 'Besta Pesada Militar', attackBonus: 4, damageDice: '1d10 + 2', damageType: 'Perfurante', range: '30/120m', properties: 'Munição, Recarga' }
        ],
        classResources: [
            { id: 'stamina_roche', name: 'Stamina Tática', current: 3, max: 3, rechargesOn: 'short' }
        ],
        features: [
            { name: 'Grito de Comando', level: 1, description: 'Concede +2 de iniciativa e +1 de ataque a aliados adjacentes na 1ª rodada.', type: 'action' },
            { name: 'Disciplina de Ferro', level: 1, description: 'Vantagem em testes contra medo e intimidação.', type: 'passive' }
        ],
        spells: [],
        feats: [],
        proficiencies: ['Todas as Armas Marciais', 'Armaduras Pesadas', 'Bestas'],
        languages: ['Comum', 'Nilfgaardiano'],
        inventory: [
            { id: 'item_brigandine', name: 'Brigandina com Lírios Temerianos', quantity: 1, description: 'Armadura pesada. CA 16.', type: 'armor', ac: 16, equipped: true },
            { id: 'item_sword_roche', name: 'Espada Militar dos Listras Azuis', quantity: 1, description: 'Lâmina forjada em Wyzima.', type: 'weapon', damage: '1d8', damageType: 'Cortante', equipped: true }
        ],
        currency: { cp: 0, sp: 50, ep: 0, gp: 80, pp: 0 },
        spellSlots: {},
        personalityTraits: 'Duro, patriota inabalável e desconfiado de espiões nilfgaardianos.',
        ideals: 'Pátria. Teméria prevalecerá enquanto seus filhos respirarem.',
        bonds: 'Meus soldados dos Listras Azuis.',
        flaws: 'Não tenho tolerância para traidores e ajo com brutalidade quando provocado.',
        notes: 'Comandante militar clássico de The Witcher adaptado para o VTT.'
    }
];
