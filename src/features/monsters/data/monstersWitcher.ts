import type { Monster } from '../monsterTypes';

export const MONSTERS_WITCHER: Monster[] = [
    // --- Necrophages ---
    {
        id: 'ghoul',
        name: 'Carniçal (Ghoul)',
        category: 'Necrófago',
        description: 'Humanos degenerados que devoram cadáveres. Frequentam campos de batalha e cemitérios. Embora covardes sozinhos, em bando tornam-se frenéticos e perigosos. Vulneráveis a Óleo de Necrófago e Fogo (Ignis). Seus corpos curam-se rapidamente se não forem queimados.',
        cr: 1,
        imageUrl: '/tokens/token_ghoul.png',
        hp: { current: 22, max: 22 },
        ac: 12,
        damageVulnerabilities: ['Óleo de Necrófago', 'Fogo (Igni)'],
        damageResistances: [],
        speed: 9,
        initiativeModifier: 2,
        attributes: { str: { value: 14, modifier: 2 }, dex: { value: 14, modifier: 2 }, con: { value: 14, modifier: 2 }, int: { value: 3, modifier: -4 }, wis: { value: 10, modifier: 0 }, cha: { value: 4, modifier: -3 } },
        skills: ['Percepção +2'],
        senses: ['Visão no Escuro 18m', 'Olfato Apurado'],
        visionRange: 18,
        source: 'Witcher',
        actions: [
            { id: 'ghoul_claws', name: 'Garras', type: 'melee', description: 'Ataque corpo-a-corpo: +4 para acertar. Dano: 7 (2d4 + 2) cortante. Se o alvo for criatura viva, deve passar num teste de Constituição (CD 10) ou ficar paralisado por 1 minuto (pode repetir o teste no fim de cada turno).', damage: '2d4+2', toHit: 4 },
            { id: 'ghoul_bite', name: 'Mordida', type: 'melee', description: 'Ataque corpo-a-corpo: +4 para acertar. Dano: 9 (2d6 + 2) perfurante. Causa sangramento.', damage: '2d6+2', toHit: 4 }
        ]
    },
    {
        id: 'nekker',
        name: 'Nekker',
        category: 'Ogroid',
        description: 'Pequenos, ágeis e habitantes de túneis. Atacam sempre em grandes grupos, subjugando oponentes maiores pelo número e ferocidade. "Um Nekker é um incômodo, dez são uma sentença de morte." Vulneráveis a Vento do Norte e Óleo de Ogroide.',
        cr: 0.5,
        imageUrl: '/tokens/token_nekker.png',
        hp: { current: 15, max: 15 },
        ac: 13,
        damageVulnerabilities: ['Vento do Norte', 'Óleo de Ogroide'],
        speed: 10, // Rápido
        initiativeModifier: 3,
        attributes: { str: { value: 10, modifier: 0 }, dex: { value: 16, modifier: 3 }, con: { value: 12, modifier: 1 }, int: { value: 6, modifier: -2 }, wis: { value: 8, modifier: -1 }, cha: { value: 6, modifier: -2 } },
        skills: ['Furtividade +5', 'Acrobacia +5'],
        senses: ['Visão no Escuro 18m'],
        visionRange: 18,
        source: 'Witcher',
        actions: [
            { id: 'nekker_scratch', name: 'Arranhar', type: 'melee', description: 'Ataque corpo-a-corpo: +5 para acertar. Dano: 5 (1d4 + 3) cortante.', damage: '1d4+3', toHit: 5 },
            { id: 'nekker_jump', name: 'Ataque em Salto', type: 'melee', description: 'Se mover pelo menos 6m antes do ataque, salta sobre o alvo e causa +1d6 de dano.' }
        ]
    },
    {
        id: 'drowner',
        name: 'Afogado',
        category: 'Necrófago',
        description: 'Cadáveres de homens afogados reanimados por magia vil. Habitam margens de rios e pântanos, puxando vítimas para a água. Imunes a sangramento, cegueira e veneno. Vulneráveis a Óleo de Necrófago e Fogo (Ignis).',
        cr: 1,
        imageUrl: '/tokens/token_drowner.png',
        hp: { current: 25, max: 25 },
        ac: 12,
        damageVulnerabilities: ['Óleo de Necrófago', 'Fogo (Igni)'],
        conditionImmunities: ['Sangramento', 'Cegueira', 'Veneno'],
        speed: 9, // Nadar rápido
        initiativeModifier: 1,
        attributes: { str: { value: 14, modifier: 2 }, dex: { value: 12, modifier: 1 }, con: { value: 14, modifier: 2 }, int: { value: 7, modifier: -2 }, wis: { value: 10, modifier: 0 }, cha: { value: 6, modifier: -2 } },
        skills: ['Atletismo +4', 'Furtividade +2'],
        senses: ['Visão no Escuro 18m'],
        visionRange: 18,
        source: 'Witcher',
        actions: [
            { id: 'drowner_claws', name: 'Garras Lamacentas', type: 'melee', description: 'Ataque corpo-a-corpo: +4 para acertar. Dano: 7 (2d4 + 2) cortante. Chance de envenenar o alvo (CD 11 CON).', damage: '2d4+2', toHit: 4 }
        ]
    },
    // --- Hybrids ---
    {
        id: 'griffin',
        name: 'Grifo',
        category: 'Híbrido',
        description: 'Símbolo de realeza, mas na verdade uma besta territorial que ataca gado e viajantes. Combina a ferocidade de um leão com a velocidade de uma águia. Caçam em pares. Vulneráveis a Aard (para derrubá-los do voo), Bombas de Metralha e Óleo de Híbrido.',
        cr: 6,
        imageUrl: '/tokens/token_griffin.png',
        hp: { current: 90, max: 90 },
        ac: 14,
        damageVulnerabilities: ['Aard', 'Bomba de Metralha', 'Óleo de Híbrido'],
        damageResistances: ['Contusão (se no ar)'],
        speed: 9, // Fly 24m
        initiativeModifier: 2,
        attributes: { str: { value: 18, modifier: 4 }, dex: { value: 15, modifier: 2 }, con: { value: 16, modifier: 3 }, int: { value: 4, modifier: -3 }, wis: { value: 13, modifier: 1 }, cha: { value: 8, modifier: -1 } },
        skills: ['Percepção +6'],
        senses: ['Visão Normal'],
        visionRange: 36, // Voo alto
        source: 'Witcher',
        actions: [
            { id: 'griffin_multi', name: 'Ataque Múltiplo', type: 'ability', description: 'Faz dois ataques: um com bico e um com garras. Se estiver voando, ataca com vantagem.' },
            { id: 'griffin_beak', name: 'Bico', type: 'melee', description: 'Ataque corpo-a-corpo: +7 para acertar. Dano: 10 (1d12 + 4) perfurante.', damage: '1d12+4', toHit: 7 },
            { id: 'griffin_claws', name: 'Garras', type: 'melee', description: 'Ataque corpo-a-corpo: +7 para acertar. Dano: 13 (2d8 + 4) cortante.', damage: '2d8+4', toHit: 7 },
            { id: 'griffin_scream', name: 'Grito Perfurante', type: 'ability', description: 'Todos a 18m devem passar CD 14 CON ou ficam atordoados e surdos por 1 turno.' }
        ]
    },
    // --- Specters ---
    {
        id: 'wraith',
        name: 'Aparição (Wraith)',
        category: 'Espectro',
        description: 'Almas atormentadas presas ao mundo dos vivos por dor ou ódio intenso. Imateriais e perigosas, drenam a vida com seu toque. Resistentes a danos físicos normais (metade do dano). Ficam corpóreas e vulneráveis dentro do sinal Yrden ou se atingidas por Pó de Lua. Vulneráveis a Óleo de Espectro.',
        cr: 4,
        imageUrl: '/tokens/token_wraith.png',
        hp: { current: 45, max: 45 },
        ac: 13,
        damageVulnerabilities: ['Óleo de Espectro', 'Yrden', 'Pó de Lua'],
        damageResistances: ['Físico (se fora de Yrden)', 'Veneno', 'Sangramento'],
        speed: 0, // Hover
        initiativeModifier: 3,
        attributes: { str: { value: 6, modifier: -2 }, dex: { value: 16, modifier: 3 }, con: { value: 12, modifier: 1 }, int: { value: 10, modifier: 0 }, wis: { value: 14, modifier: 2 }, cha: { value: 15, modifier: 2 } },
        skills: ['Furtividade +8'],
        senses: ['Visão no Escuro 18m'],
        visionRange: 18,
        source: 'Witcher',
        actions: [
            { id: 'wraith_touch', name: 'Toque Drenante', type: 'melee', description: 'Ataque Mágico: +5 para acertar. Dano: 14 (4d6) necrótico. O alvo tem seu máximo de HP reduzido em valor igual ao dano sofrido.', damage: '4d6', toHit: 5 },
            { id: 'wraith_teleport', name: 'Teleporte', type: 'ability', description: 'Como ação bônus, pode se teletransportar para as costas de um inimigo para atacar com vantagem.' },
            { id: 'wraith_incorporeal', name: 'Forma Incorpórea', type: 'ability', description: 'Resistência a dano não-mágico (contundente, perfurante, cortante). Imune a agarrar e derrubar.' }
        ]
    },
    // --- Relicts ---
    {
        id: 'fiend',
        name: 'Demônio (Fiend)',
        category: 'Relicto',
        description: 'Uma montanha de músculos, chifres e dentes. Possui um terceiro olho que usa para hipnotizar suas vítimas antes de despedaçá-las. Vivem em florestas densas e pântanos. Extremamente fortes e rápidos para seu tamanho. Vulneráveis a Bombas de Samum para atordoar o terceiro olho e Óleo de Relicto.',
        cr: 11,
        imageUrl: '/tokens/token_fiend.png?v=3',
        hp: { current: 160, max: 160 },
        ac: 16,
        speed: 12,
        initiativeModifier: 1,
        attributes: { str: { value: 24, modifier: 7 }, dex: { value: 10, modifier: 0 }, con: { value: 22, modifier: 6 }, int: { value: 6, modifier: -2 }, wis: { value: 12, modifier: 1 }, cha: { value: 7, modifier: -2 } },
        skills: ['Intimidação +10', 'Percepção +5'],
        senses: ['Visão no Escuro 18m'],
        visionRange: 18,
        source: 'Witcher',
        actions: [
            { id: 'fiend_gore', name: 'Investida de Chifres', type: 'melee', description: 'Ataque corpo-a-corpo: +11 para acertar. Dano: 25 (4d8 + 7) perfurante. Alvo deve passar CD 17 FOR ou ser arremessado 6m e derrubado.', damage: '4d8+7', toHit: 11 },
            { id: 'fiend_hypnotize', name: 'Olho Hipnótico', type: 'ability', description: 'Cone de 9m. Criaturas devem passar CD 16 SAB ou ficam cegas e atordoadas até o fim do seu próximo turno.' },
            { id: 'fiend_regen', name: 'Regeneração', type: 'ability', description: 'Recupera 10 HP no início de cada turno se não receber dano de fogo anteriormente.' }
        ]
    },
    {
        id: 'leshen',
        name: 'Lishen (Leshy)',
        category: 'Relicto',
        description: 'Espírito antigo da floresta que comanda animais e plantas. Marca aldeões para se manter imortal e retorna se não for destruído corretamente. Seus totens escondidos na mata são sua fonte de poder. Vulnerável a Igni (Fogo) e Bombas de Dimetrium (para bloquear magia).',
        cr: 12,
        imageUrl: '/tokens/token_leshen.png',
        hp: { current: 145, max: 145 },
        ac: 17, // Natural bark
        damageVulnerabilities: ['Fogo (Igni)', 'Bomba de Dimetrium', 'Óleo de Relicto'],
        damageResistances: ['Perfurante'],
        speed: 6,
        initiativeModifier: 0,
        attributes: { str: { value: 18, modifier: 4 }, dex: { value: 10, modifier: 0 }, con: { value: 20, modifier: 5 }, int: { value: 14, modifier: 2 }, wis: { value: 18, modifier: 4 }, cha: { value: 16, modifier: 3 } },
        skills: ['Natureza +12', 'Furtividade +8'],
        senses: ['Visão Verdadeira 36m'],
        visionRange: 36,
        source: 'Witcher',
        actions: [
            { id: 'leshen_roots', name: 'Raízes Estranguladoras', type: 'ranged', description: 'Alcance 18m. Alvo deve passar CD 16 FOR ou ficar contido e sofrer 3d8 de dano por turno. Ação para escapar.' },
            { id: 'leshen_birds', name: 'Bando de Corvos', type: 'ability', description: 'Envia um bando de corvos num cone de 9m. Dano: 14 (4d6) cortante e alvos ficam cegos por 1 turno.' },
            { id: 'leshen_summon', name: 'Chamado da Floresta', type: 'ability', description: 'Invoca 1d4 Lobos ou 1 Urso para lutar ao seu lado.' }
        ]
    },
    // --- Cursed Ones ---
    {
        id: 'werewolf',
        name: 'Lobisomem',
        category: 'Amaldiçoado',
        description: 'Besta resultante de licantropia. A ferocidade é inigualável, e se cura rapidamente a menos que seja envenenado ou queimado. Transforma-se à noite, especialmente na lua cheia. Vulneráveis a Espada de Prata, Pó de Lua (bloqueia regeneração) e Óleo de Amaldiçoado.',
        cr: 5,
        imageUrl: '/tokens/token_werewolf.png',
        hp: { current: 65, max: 65 },
        ac: 14, // Pele dura
        damageVulnerabilities: ['Prata', 'Pó de Lua', 'Óleo de Amaldiçoado', 'Fogo'],
        damageResistances: ['Aço (Corte/Perfuração nao mágico)'],
        speed: 12, // Muito rápido
        initiativeModifier: 4,
        attributes: { str: { value: 18, modifier: 4 }, dex: { value: 16, modifier: 3 }, con: { value: 16, modifier: 3 }, int: { value: 7, modifier: -2 }, wis: { value: 12, modifier: 1 }, cha: { value: 6, modifier: -2 } },
        skills: ['Atletismo +7', 'Percepção +5 (Olfato Apurado)'],
        senses: ['Visão no Escuro 18m'],
        visionRange: 18,
        source: 'Witcher',
        actions: [
            { id: 'werewolf_multi', name: 'Ataque Múltiplo', type: 'ability', description: 'O Lobisomem faz dois ataques com garras.' },
            { id: 'werewolf_claws', name: 'Garras', type: 'melee', description: 'Ataque corpo-a-corpo: +7 para acertar. Dano 11 (2d6 + 4) cortante. Causa sangramento (1d4 dano extra por turno).', damage: '2d6+4', toHit: 7 },
            { id: 'werewolf_howl', name: 'Uivo Aterrorizante', type: 'ability', description: 'Aliados a 9m recebem vantagem em ataques. Inimigos devem passar CD 13 SAB ou ficam amedrontados.' },
            { id: 'werewolf_regen', name: 'Regeneração', type: 'ability', description: 'Recupera 10HP no início do turno, a menos que tenha recebido dano de prata ou esteja sob efeito de Pó de Lua.' }
        ]
    },
    {
        id: 'striga',
        name: 'Striga',
        category: 'Amaldiçoado',
        description: 'Uma mulher transformada em um monstro hediondo por uma maldição de ódio. Geralmente sai para caçar apenas em lua cheia. Mais forte e rápida que qualquer humano. Desfazer a maldição exige passar uma noite inteira perto dela, sem matá-la. Vulnerável a Espada de Prata.',
        cr: 8,
        imageUrl: '/tokens/token_striga.png',
        hp: { current: 95, max: 95 },
        ac: 16,
        speed: 12,
        initiativeModifier: 5,
        attributes: { str: { value: 20, modifier: 5 }, dex: { value: 18, modifier: 4 }, con: { value: 18, modifier: 4 }, int: { value: 6, modifier: -2 }, wis: { value: 10, modifier: 0 }, cha: { value: 5, modifier: -3 } },
        skills: ['Atletismo +9', 'Furtividade +8'],
        senses: ['Visão no Escuro 36m'],
        visionRange: 36,
        source: 'Witcher',
        actions: [
            { id: 'striga_multi', name: 'Fúria', type: 'ability', description: 'Faz três ataques: dois com garras e um mordida.' },
            { id: 'striga_slash', name: 'Estripar', type: 'melee', description: 'Ataque corpo-a-corpo: +9 para acertar. Dano: 14 (2d8 + 5) cortante.', damage: '2d8+5', toHit: 9 },
            { id: 'striga_bite', name: 'Mordida Fatal', type: 'melee', description: 'Ataque corpo-a-corpo: +9 para acertar. Dano: 18 (3d8 + 5) perfurante.', damage: '3d8+5', toHit: 9 },
            { id: 'striga_pounce', name: 'Bote Predatório', type: 'melee', description: 'Se mover 6m em linha reta, ataca com vantagem e derruba o alvo (CD 17 FOR).' }
        ]
    },
    // --- Vampires ---
    {
        id: 'katakan',
        name: 'Katakan',
        category: 'Vampiro',
        description: 'Vampiro superior formidável. Ao contrário dos Ekkimaras, usam inteligência e estratégia, além de intangibilidade. Gostam de jóias brilhantes e de se esconder na alta sociedade. Vulneráveis a Yrden (os torna corpóreos), Igni, Pó de Lua e Óleo de Vampiro.',
        cr: 9,
        imageUrl: '/tokens/token_katakan.png',
        hp: { current: 110, max: 110 },
        ac: 17,
        speed: 10,
        initiativeModifier: 6,
        attributes: { str: { value: 22, modifier: 6 }, dex: { value: 20, modifier: 5 }, con: { value: 16, modifier: 3 }, int: { value: 16, modifier: 3 }, wis: { value: 14, modifier: 2 }, cha: { value: 15, modifier: 2 } },
        skills: ['Furtividade +10', 'Enganação +6'],
        senses: ['Visão no Escuro 36m'],
        visionRange: 36,
        source: 'Witcher',
        actions: [
            { id: 'katakan_claws', name: 'Garras', type: 'melee', description: 'Ataque corpo-a-corpo: +10 para acertar. Dano: 18 (3d8 + 5) cortante. Dano mágico.', damage: '3d8+5', toHit: 10 },
            { id: 'katakan_invis', name: 'Invisibilidade', type: 'ability', description: 'Pode se tornar invisível como ação bônus. Atacar quebra a invisibilidade.' },
            { id: 'katakan_regen', name: 'Regeneração Superior', type: 'ability', description: 'Recupera 20 HP por turno se não exposto à luz do sol ou prata.' }
        ]
    },
    {
        id: 'bruxa',
        name: 'Bruxa (Vampira)',
        category: 'Vampiro',
        description: 'Vampira suprema que assume a forma de uma bela mulher de cabelos negros ou um morcego gigante. Seu grito sônico pode derrubar paredes e estourar tímpanos. Extremamente ágil e não precisa beber sangue para sobreviver, mas o faz para se fortalecer. Vulnerável a Sangue Preto, Pó de Lua e Yrden.',
        cr: 10,
        imageUrl: '/tokens/token_bruxa.png',
        hp: { current: 100, max: 100 },
        ac: 18,
        damageVulnerabilities: ['Sangue Preto', 'Pó de Lua', 'Yrden', 'Óleo de Vampiro'],
        speed: 12,
        initiativeModifier: 8,
        attributes: { str: { value: 18, modifier: 4 }, dex: { value: 24, modifier: 7 }, con: { value: 14, modifier: 2 }, int: { value: 16, modifier: 3 }, wis: { value: 14, modifier: 2 }, cha: { value: 18, modifier: 4 } },
        skills: ['Acrobacia +15', 'Furtividade +11', 'Percepção +10'],
        senses: ['Visão no Escuro 36m'],
        visionRange: 36,
        source: 'Witcher',
        actions: [
            { id: 'bruxa_scream', name: 'Grito Sônico', type: 'ranged', description: 'Onda de choque em cone de 9m. CD 16 CON. Dano: 27 (6d8) trovejante e derruba o alvo. Empurra 3m.' },
            { id: 'bruxa_bite', name: 'Mordida', type: 'melee', description: 'Ataque corpo-a-corpo: +10 para acertar. Dano: 14 (3d6 + 4) perfurante e a Bruxa cura metade do dano causado.', damage: '3d6+4', toHit: 10 },
            { id: 'bruxa_invis', name: 'Desvanecer', type: 'ability', description: 'Torna-se invisível e move-se instantaneamente para outro ponto a 9m.' }
        ]
    },
    // --- Draconids ---
    {
        id: 'cockatrice',
        name: 'Cocatrice',
        category: 'Draconídeo',
        description: 'Monstro com cabeça de galo e corpo de lagarto alado. Prefere cavernas escuras e esgotos. Dizem que nasceu de um ovo chocado por um sapo. Seu ódio por tudo que vive é lendário. Vulnerável a Óleo de Draconídeo, Colmeia (bomba) e Aard.',
        cr: 3,
        imageUrl: '/tokens/token_cockatrice.png',
        hp: { current: 40, max: 40 },
        ac: 12,
        damageVulnerabilities: ['Óleo de Draconídeo', 'Bomba de Colmeia', 'Aard'],
        speed: 9, // Fly 12m
        initiativeModifier: 2,
        attributes: { str: { value: 12, modifier: 1 }, dex: { value: 14, modifier: 2 }, con: { value: 12, modifier: 1 }, int: { value: 2, modifier: -4 }, wis: { value: 10, modifier: 0 }, cha: { value: 4, modifier: -3 } },
        skills: [],
        senses: ['Visão no Escuro 18m'],
        visionRange: 18,
        source: 'Witcher',
        actions: [
            { id: 'cockatrice_peck', name: 'Bicada Tóxica', type: 'melee', description: 'Ataque corpo-a-corpo: +4 para acertar. Dano: 8 (1d8 + 2) perfurante. CD 11 CON ou envenenado por 1 minuto (1d4 dano/turno). Há lendas sobre petrificação, mas são exageros.', damage: '1d8+2', toHit: 4 }
        ]
    },
    {
        id: 'basilisk',
        name: 'Basilisco',
        category: 'Draconídeo',
        description: 'Frequentemente confundido com a Cocatrice, mas muito mais letal. Seu veneno é um dos ácidos mais fortes conhecidos, capaz de derreter armaduras. Costuma atacar de emboscadas em florestas ou ruínas. Vulnerável a Óleo de Draconídeo, Igni e Aard.',
        cr: 6,
        imageUrl: '/tokens/token_basilisk.png',
        hp: { current: 85, max: 85 },
        ac: 15,
        speed: 9,
        initiativeModifier: 1,
        attributes: { str: { value: 18, modifier: 4 }, dex: { value: 10, modifier: 0 }, con: { value: 16, modifier: 3 }, int: { value: 3, modifier: -4 }, wis: { value: 10, modifier: 0 }, cha: { value: 4, modifier: -3 } },
        skills: [],
        senses: ['Visão no Escuro 18m'],
        visionRange: 18,
        source: 'Witcher',
        actions: [
            { id: 'basilisk_bite', name: 'Mordida Venenosa', type: 'melee', description: 'Ataque corpo-a-corpo: +7 para acertar. Dano: 15 (2d8 + 4) perfurante + 3d6 veneno.', damage: '2d8+4', toHit: 7 },
            { id: 'basilisk_spit', name: 'Cuspir Veneno', type: 'ranged', description: 'Alcance 9m. Tiro certo. Dano: 4d6 ácido e corrói a armadura (-1 AC permanente).' }
        ]
    },
    // --- Relicts ---
    {
        id: 'chort',
        name: 'Chort',
        category: 'Relicto',
        description: 'Um primo menor do Demônio (Fiend), mas não menos perigoso. Se alimenta de Sylvanos e até outros monstros menores. Sua carga pode quebrar paredes de pedra. Vulnerável a Óleo de Relicto e a ser atordoado.',
        cr: 6,
        hp: { current: 95, max: 95 },
        ac: 15,
        speed: 10,
        initiativeModifier: 3,
        attributes: { str: { value: 20, modifier: 5 }, dex: { value: 12, modifier: 1 }, con: { value: 18, modifier: 4 }, int: { value: 4, modifier: -3 }, wis: { value: 10, modifier: 0 }, cha: { value: 5, modifier: -3 } },
        skills: ['Intimidação +8'],
        senses: ['Visão no Escuro 18m'],
        visionRange: 18,
        source: 'Witcher',
        actions: [
            { id: 'chort_ram', name: 'Investida Devastadora', type: 'melee', description: 'Ataque de carga (min 6m). Dano: 22 (3d8 + 5) contundente. CD 15 FOR ou derrubado e atordoado.', damage: '3d8+5', toHit: 8 },
            { id: 'chort_claws', name: 'Patada', type: 'melee', description: 'Ataque corpo-a-corpo: +8 para acertar. Dano: 14 (2d8 + 5) cortes.' }
        ]
    },
    // --- Necrophages ---
    {
        id: 'rotfiend',
        name: 'Podrideiro',
        category: 'Necrófago',
        description: 'Parecem cadáveres inchados por gases de decomposição. Quando feridos mortalmente, o gás em seu interior entra em ignição, causando uma explosão violenta de vísceras e veneno. Mantenha distância quando estiverem perto da morte. Vulnerável a Fogo e Óleo de Necrófago.',
        cr: 3,
        imageUrl: '/tokens/token_rotfiend.png?v=4',
        hp: { current: 35, max: 35 },
        ac: 11,
        damageVulnerabilities: ['Óleo de Necrófago', 'Fogo (Ignis)'],
        speed: 9,
        initiativeModifier: 1,
        attributes: { str: { value: 14, modifier: 2 }, dex: { value: 12, modifier: 1 }, con: { value: 14, modifier: 2 }, int: { value: 3, modifier: -4 }, wis: { value: 8, modifier: -1 }, cha: { value: 4, modifier: -3 } },
        skills: [],
        senses: ['Cheiro de Sangue'],
        visionRange: 18,
        source: 'Witcher',
        actions: [
            { id: 'rotfiend_explode', name: 'Reação Volátil', type: 'ability', description: 'Ao chegar a 0 HP, explode automaticamente. Todas as criaturas a 3m sofrem 4d6 de dano e ficam envenenadas.' },
            { id: 'rotfiend_claw', name: 'Garras', type: 'melee', description: 'Ataque corpo-a-corpo: +4 para acertar. Dano: 6 (1d6 + 2) cortante.', damage: '1d6+2', toHit: 4 }
        ]
    },
    {
        id: 'water_hag',
        name: 'Bruxa Aquática',
        category: 'Necrófago',
        description: 'Velhas repulsivas que vivem em pântanos e rios. Usam a lama para cegar oponentes e depois os estripam com garras longas. São excelentes nadadoras e expertas em emboscadas aquáticas. Vulneráveis a Fogo (Igni), Vento do Norte e Óleo de Necrófago.',
        cr: 5,
        hp: { current: 60, max: 60 },
        ac: 13,
        damageVulnerabilities: ['Fogo (Igni)', 'Vento do Norte', 'Óleo de Necrófago', 'Quen'],
        speed: 9, // Swim 12
        initiativeModifier: 3,
        attributes: { str: { value: 16, modifier: 3 }, dex: { value: 16, modifier: 3 }, con: { value: 14, modifier: 2 }, int: { value: 10, modifier: 0 }, wis: { value: 12, modifier: 1 }, cha: { value: 8, modifier: -1 } },
        skills: ['Furtividade +7', 'Sobrevivência +4'],
        senses: ['Visão no Escuro 18m'],
        visionRange: 18,
        source: 'Witcher',
        actions: [
            { id: 'hag_mud', name: 'Jogar Lama', type: 'ranged', description: 'Alcance 9m. +6 para acertar. Dano: 5 (1d10) contundente. O alvo fica cego até gastar uma ação para limpar os olhos.', damage: '1d10', toHit: 6 },
            { id: 'hag_claws', name: 'Rasgar', type: 'melee', description: 'Dois ataques. Dano: 10 (2d6 + 3) cortante cada. Se acertar ambos, causa dano extra de precisão (1d6).', damage: '2d6+3', toHit: 6 },
            { id: 'hag_dive', name: 'Mergulho na Lama', type: 'ability', description: 'Pode se esconder na água/lama como ação bônus, ficando invisível enquanto submersa.' }
        ]
    },
    // --- Insectoids ---
    {
        id: 'endrega_worker',
        name: 'Endrega Operária',
        category: 'Insetoide',
        description: 'Membros da casta mais baixa da colônia, constroem ninhos e cuidam das larvas. Embora menores, atacam em enxames e são venenosas. Resistentes a todos os tipos de aço, recomenda-se Óleo de Insetoide.',
        cr: 2,
        hp: { current: 30, max: 30 },
        ac: 14, // Carapaça
        damageVulnerabilities: ['Óleo de Insetoide', 'Oropendola'],
        damageResistances: ['Aço', 'Corte'],
        speed: 8,
        initiativeModifier: 2,
        attributes: { str: { value: 14, modifier: 2 }, dex: { value: 14, modifier: 2 }, con: { value: 14, modifier: 2 }, int: { value: 4, modifier: -3 }, wis: { value: 10, modifier: 0 }, cha: { value: 4, modifier: -3 } },
        skills: [],
        senses: ['Vibração do Solo 18m'],
        visionRange: 18,
        source: 'Witcher',
        actions: [
            { id: 'endrega_bite', name: 'Mordida Ácida', type: 'melee', description: 'Ataque corpo-a-corpo: +4 para acertar. Dano: 5 (1d6 + 2) perfurante + 1d4 ácido.', damage: '1d6+2', toHit: 4 },
            { id: 'endrega_kick', name: 'Patada', type: 'melee', description: 'Ataque corpo-a-corpo: +4 para acertar. Dano: 7 (1d8 + 2) contundente. Derruba o alvo (CD 12 FOR).' }
        ]
    },
    {
        id: 'endrega_warrior',
        name: 'Endrega Guerreira',
        category: 'Insetoide',
        description: 'Soldados que protegem o ninho. Possuem caudas longas e afiadas com veneno letal. São agressivas e territoriais. Vulneráveis a Mel de Ouro (antídoto) e Óleo de Insetoide.',
        cr: 4,
        hp: { current: 65, max: 65 },
        ac: 16,
        damageVulnerabilities: ['Mel de Ouro', 'Óleo de Insetoide', 'Igni'],
        damageResistances: ['Aço'],
        speed: 8,
        initiativeModifier: 3,
        attributes: { str: { value: 18, modifier: 4 }, dex: { value: 14, modifier: 2 }, con: { value: 16, modifier: 3 }, int: { value: 4, modifier: -3 }, wis: { value: 12, modifier: 1 }, cha: { value: 4, modifier: -3 } },
        skills: ['Intimidação +4'],
        senses: ['Vibração do Solo 18m'],
        visionRange: 18,
        source: 'Witcher',
        actions: [
            { id: 'endrega_tail', name: 'Cauda Venenosa', type: 'melee', description: 'Alcance 3m. +6 para acertar. Dano 9 (1d10 + 4) perfurante + 3d6 veneno (CD 13 CON metade).', damage: '1d10+4', toHit: 6 },
            { id: 'endrega_pincer', name: 'Pinças', type: 'melee', description: 'Ataque duplo. Dano: 8 (1d8 + 4) cada.' }
        ]
    },
    {
        id: 'arachas',
        name: 'Aracna (Arachas)',
        category: 'Insetoide',
        description: 'Enorme caranguejo/aranha blindado que habita pântanos e florestas profundas. Sua carapaça é quase impenetrável. Cospe veneno e usa suas presas para desmembrar. Vulnerável a Igni (queima a carne exposta), Aard (atordoa) e Óleo de Insetoide.',
        cr: 8,
        hp: { current: 130, max: 130 },
        ac: 19, // Blindada
        damageVulnerabilities: ['Igni', 'Aard', 'Óleo de Insetoide'],
        damageResistances: ['Aço', 'Perfuração'],
        speed: 6,
        initiativeModifier: 0,
        attributes: { str: { value: 22, modifier: 6 }, dex: { value: 10, modifier: 0 }, con: { value: 20, modifier: 5 }, int: { value: 5, modifier: -3 }, wis: { value: 12, modifier: 1 }, cha: { value: 4, modifier: -3 } },
        skills: ['Furtividade +4 (em pântanos)'],
        senses: ['Tremorsense 18m'],
        visionRange: 18,
        source: 'Witcher',
        actions: [
            { id: 'arachas_crush', name: 'Esmagar', type: 'melee', description: 'Ataque corpo-a-corpo: +9 para acertar. Dano: 20 (4d6 + 6) contundente + agarrar (escape CD 17).', damage: '4d6+6', toHit: 9 },
            { id: 'arachas_venom', name: 'Jato de Veneno', type: 'ranged', description: 'Cone de 6m ou linha de 9m. CD 16 CON. 6d6 dano de veneno.', damage: '6d6' }
        ]
    },
    // --- Specters (Additions) ---
    {
        id: 'noonwraith',
        name: 'Dama do Meio-Dia',
        category: 'Espectro',
        description: 'O espírito de uma noiva que morreu jovem e violentamente antes do casamento. Aparece ao meio-dia em campos abertos. Cega suas vítimas e cria cópias de si mesma. Só pode ser ferida se presa em Yrden ou sob efeito de Pó de Lua. Vulnerável a Óleo de Espectro.',
        cr: 5,
        hp: { current: 55, max: 55 },
        ac: 14,
        damageVulnerabilities: ['Yrden', 'Pó de Lua', 'Óleo de Espectro'],
        damageImmunities: ['Veneno', 'Sangramento', 'Fogo'],
        speed: 0, // Hover
        initiativeModifier: 4,
        attributes: { str: { value: 7, modifier: -2 }, dex: { value: 18, modifier: 4 }, con: { value: 10, modifier: 0 }, int: { value: 10, modifier: 0 }, wis: { value: 14, modifier: 2 }, cha: { value: 17, modifier: 3 } },
        skills: [],
        senses: ['Visão Normal'],
        visionRange: 36,
        source: 'Witcher',
        actions: [
            { id: 'noonwraith_blind', name: 'Luz Cegante', type: 'ability', description: 'Ação bônus. Inimigos olhando para ela devem passar CD 14 CON ou ficar cegos.' },
            { id: 'noonwraith_touch', name: 'Toque Calcinante', type: 'melee', description: 'Dano: 16 (3d10) fogo/radiante. Se alvo estiver cego, causa crítico.' },
            { id: 'noonwraith_mirror', name: 'Imagem Espelhada', type: 'ability', description: 'Cria 3 cópias com 1 HP que distraem e atacam.' }
        ]
    },
    // --- Necrophages (Additions) ---
    {
        id: 'foglet',
        name: 'Nevoroso (Foglet)',
        category: 'Necrófago',
        description: 'Monstro que habita neblinas densas, pântanos e cavernas úmidas. Pode invocar a própria neblina, onde se torna invisível e cria ilusões. Brilham como lanternas para atrair viajantes perdidos. Vulnerável a Vento do Norte, Pó de Lua e Quen.',
        cr: 4,
        hp: { current: 40, max: 40 },
        ac: 13,
        speed: 8,
        initiativeModifier: 5,
        attributes: { str: { value: 12, modifier: 1 }, dex: { value: 18, modifier: 4 }, con: { value: 12, modifier: 1 }, int: { value: 10, modifier: 0 }, wis: { value: 12, modifier: 1 }, cha: { value: 8, modifier: -1 } },
        skills: ['Furtividade +8'],
        senses: ['Visão na Neblina'],
        visionRange: 18,
        source: 'Witcher',
        actions: [
            { id: 'foglet_claws', name: 'Garras', type: 'melee', description: 'Ataque surpresa. Dano: 11 (2d6 + 4) cortante.', damage: '2d6+4', toHit: 6 },
            { id: 'foglet_fog', name: 'Invocar Névoa', type: 'ability', description: 'Cria uma área de 12m de escuridão densa. O Nevoroso fica invisível dentro dela.' }
        ]
    },
    {
        id: 'grave_hag',
        name: 'Bruxa Sepulcral',
        category: 'Necrófago',
        description: 'Bruxa velha que ronda cemitérios para desenterrar e devorar cadáveres. Tem uma língua incrivelmente longa que usa como chicote e laço. Suas garras são venenosas. Vulnerável a Yrden e Fogo Negro.',
        cr: 6,
        hp: { current: 80, max: 80 },
        ac: 14,
        damageVulnerabilities: ['Yrden', 'Fogo Negro', 'Óleo de Necrófago'],
        speed: 9,
        initiativeModifier: 2,
        attributes: { str: { value: 16, modifier: 3 }, dex: { value: 16, modifier: 3 }, con: { value: 16, modifier: 3 }, int: { value: 11, modifier: 0 }, wis: { value: 13, modifier: 1 }, cha: { value: 7, modifier: -2 } },
        skills: ['Percepção +5'],
        senses: ['Darkvision 18m'],
        visionRange: 18,
        source: 'Witcher',
        actions: [
            { id: 'grave_tongue', name: 'Língua Chicote', type: 'melee', description: 'Alcance 4.5m. +6 para acertar. Dano: 1d8+3. Alvo deve passar CD 14 DES ou ser puxado e agarrado.', damage: '1d8+3', toHit: 6 },
            { id: 'grave_claws', name: 'Garras Infectas', type: 'melee', description: 'Dano: 2d6+3 veneno. Impede recuperação de vida.' }
        ]
    },
    // --- Ogroids ---
    {
        id: 'cyclops',
        name: 'Ciclope',
        category: 'Ogroid',
        description: 'Gigante de um olho só, incrivelmente forte mas pouco inteligente. Usa troncos de árvores como armas. Seu único olho é seu ponto fraco; acertá-lo (jogada com desvantagem ou crítico) causa morte instantânea ou cegueira permanente. Vulnerável a Axii e Óleo de Ogroide.',
        cr: 7,
        hp: { current: 110, max: 110 },
        ac: 13,
        speed: 9,
        initiativeModifier: -1,
        attributes: { str: { value: 23, modifier: 6 }, dex: { value: 9, modifier: -1 }, con: { value: 20, modifier: 5 }, int: { value: 6, modifier: -2 }, wis: { value: 8, modifier: -1 }, cha: { value: 7, modifier: -2 } },
        skills: ['Intimidação +5'],
        senses: ['Percepção Ruim'],
        visionRange: 18,
        source: 'Witcher',
        actions: [
            { id: 'cyclops_club', name: 'Esmagar', type: 'melee', description: 'Alcance 3m. +9 para acertar. Dano: 19 (3d8 + 6) contundente.', damage: '3d8+6', toHit: 9 },
            { id: 'cyclops_stomp', name: 'Pisada Sísmica', type: 'ability', description: 'Todos a 6m, CD 15 DES ou caem no chão.' }
        ]
    },
    {
        id: 'ice_giant',
        name: 'Gigante de Gelo',
        category: 'Ogroid',
        description: 'O senhor das ilhas de Skellige. Comanda o inverno e constrói armaduras com restos de navios naufragados. Imune ao frio, vulnerável ao Fogo (Igni) e Óleo de Ogroide.',
        cr: 11,
        hp: { current: 180, max: 180 },
        ac: 17,
        speed: 10,
        initiativeModifier: 0,
        attributes: { str: { value: 25, modifier: 7 }, dex: { value: 10, modifier: 0 }, con: { value: 23, modifier: 6 }, int: { value: 9, modifier: -1 }, wis: { value: 12, modifier: 1 }, cha: { value: 10, modifier: 0 } },
        skills: ['Atletismo +11'],
        senses: ['Visão na Neve'],
        visionRange: 36,
        source: 'Witcher',
        actions: [
            { id: 'ice_giant_anchor', name: 'Âncora Maciça', type: 'melee', description: 'Usa uma âncora de navio. +11 para acertar. Dano: 29 (4d10 + 7) perfurante.', damage: '4d10+7', toHit: 11 },
            { id: 'ice_giant_summon', name: 'Invocar Sereias', type: 'ability', description: 'Chama 1d4 Sereias para auxiliar.' }
        ]
    },
    // --- Elementa ---
    {
        id: 'earth_elemental',
        name: 'Elemental da Terra',
        category: 'Elemento',
        description: 'Ser artificial feito de rocha e magia. Lento, mas imparável. Imune a dor, veneno e sangramento. Suas pancadas podem quebrar o chão. Vulnerável a Bomba de Dimetrium e Óleo de Construto.',
        cr: 5,
        hp: { current: 100, max: 100 },
        ac: 18,
        damageVulnerabilities: ['Bomba de Dimetrium', 'Óleo de Construto'],
        damageImmunities: ['Veneno', 'Sangramento', 'Dor'],
        speed: 4,
        initiativeModifier: -1,
        attributes: { str: { value: 20, modifier: 5 }, dex: { value: 8, modifier: -1 }, con: { value: 20, modifier: 5 }, int: { value: 4, modifier: -3 }, wis: { value: 10, modifier: 0 }, cha: { value: 1, modifier: -5 } },
        skills: [],
        senses: ['Visão no Escuro 18m'],
        visionRange: 18,
        source: 'Witcher',
        actions: [
            { id: 'earth_slam', name: 'Esmagamento', type: 'melee', description: 'Ataque corpo-a-corpo: +8 para acertar. Dano: 14 (2d8 + 5) contundente.', damage: '2d8+5', toHit: 8 },
            { id: 'earth_jump', name: 'Salto Sísmico', type: 'ability', description: 'Salta e cai criando onda de choque. Todos a 3m caem no chão (CD 15 FOR).' }
        ]
    },
    {
        id: 'fire_elemental_w',
        name: 'Ifrit (Elemental de Fogo)',
        category: 'Elemento',
        description: 'Demônio nascido do fogo. Queima tudo o que toca. Magia de gelo e Vento do Norte o enfraquecem (extinguem suas chamas momentaneamente). Imune a Fogo.',
        cr: 6,
        hp: { current: 90, max: 90 },
        ac: 14,
        speed: 8,
        initiativeModifier: 3,
        attributes: { str: { value: 14, modifier: 2 }, dex: { value: 16, modifier: 3 }, con: { value: 16, modifier: 3 }, int: { value: 6, modifier: -2 }, wis: { value: 10, modifier: 0 }, cha: { value: 8, modifier: -1 } },
        skills: [],
        senses: ['Visão no Escuro 18m'],
        visionRange: 18,
        source: 'Witcher',
        actions: [
            { id: 'ifrit_touch', name: 'Toque Flamejante', type: 'melee', description: 'Dano: 2d6+3 fogo. Se pegar fogo, 1d6 por turno.', damage: '2d6+3', toHit: 5 },
            { id: 'ifrit_flare', name: 'Explosão', type: 'ability', description: 'Todos a 1.5m sofrem 2d6 dano de fogo.' }
        ]
    },
    // --- Draconids (More) ---
    {
        id: 'wyvern',
        name: 'Wyvern',
        category: 'Draconídeo',
        description: 'Muitos confundem com dragões, mas são menores e têm apenas duas patas. Caçam ovelhas e, às vezes, pessoas. Mergulham do céu para agarrar presas. Vulnerável a Aard, Óleo de Draconídeo.',
        cr: 5,
        hp: { current: 75, max: 75 },
        ac: 13,
        speed: 8,
        initiativeModifier: 2,
        attributes: { str: { value: 19, modifier: 4 }, dex: { value: 12, modifier: 1 }, con: { value: 16, modifier: 3 }, int: { value: 5, modifier: -3 }, wis: { value: 12, modifier: 1 }, cha: { value: 6, modifier: -2 } },
        skills: ['Percepção +4'],
        senses: ['Visão no Escuro 18m'],
        visionRange: 18,
        source: 'Witcher',
        actions: [
            { id: 'wyvern_bite', name: 'Mordida', type: 'melee', description: '+7 acertar. Dano: 11 (2d6 + 4) perfurante.', damage: '2d6+4', toHit: 7 },
            { id: 'wyvern_stinger', name: 'Ferrão', type: 'melee', description: '+7 acertar. 11 (2d6 + 4) perfurante + veneno (3d6).', damage: '2d6+4', toHit: 7 },
            { id: 'wyvern_pick', name: 'Agarrar em Voo', type: 'ability', description: 'Pode carregar criaturas Pequenas/Médias.' }
        ]
    },
    {
        id: 'forktail',
        name: 'Rabogalieiro (Forktail)',
        category: 'Draconídeo',
        description: 'Nome vem da cauda bifurcada afiada. Capaz de cortar um escudo ao meio. Tão perigoso quanto um Wyvern, mas com ataques de cauda mais letais.',
        cr: 6,
        hp: { current: 85, max: 85 },
        ac: 14,
        speed: 8,
        initiativeModifier: 3,
        attributes: { str: { value: 20, modifier: 5 }, dex: { value: 14, modifier: 2 }, con: { value: 17, modifier: 3 }, int: { value: 6, modifier: -2 }, wis: { value: 12, modifier: 1 }, cha: { value: 6, modifier: -2 } },
        skills: ['Percepção +5'],
        senses: ['Visão no Escuro 18m'],
        visionRange: 18,
        source: 'Witcher',
        actions: [
            { id: 'fork_tail', name: 'Cauda Bifurcada', type: 'melee', description: 'Ataque amplo. +8 acertar. Dano: 14 (2d8 + 5) cortante.', damage: '2d8+5', toHit: 8 }
        ]
    },
    // --- Vampires (More) ---
    {
        id: 'ekimmara',
        name: 'Ekimara',
        category: 'Vampiro',
        description: 'Vampiro bestial e brutal. Invisível, rápido e incrivelmente forte. Não é sofisticado como um Katakan, apenas quer sangue. Vulnerável a Óleo de Vampiro e Igni.',
        cr: 8,
        hp: { current: 95, max: 95 },
        ac: 15,
        speed: 10,
        initiativeModifier: 4,
        attributes: { str: { value: 21, modifier: 5 }, dex: { value: 16, modifier: 3 }, con: { value: 18, modifier: 4 }, int: { value: 5, modifier: -3 }, wis: { value: 12, modifier: 1 }, cha: { value: 3, modifier: -4 } },
        skills: ['Furtividade +7'],
        senses: ['Visão no Escuro (Ecolocalização)'],
        visionRange: 36,
        source: 'Witcher',
        actions: [
            { id: 'ekimmara_claw', name: 'Garras', type: 'melee', description: '+8 acertar. Dano: 12 (2d6 + 5) cortante. Regenera 5 HP ao acertar.', damage: '2d6+5', toHit: 8 },
            { id: 'ekimmara_invis', name: 'Camuflagem', type: 'ability', description: 'Fica invisível. Atacar não quebra a invisibilidade (regenera-se).' }
        ]
    },
    // --- NPCs (Witcher World) ---
    {
        id: 'scoia_tael',
        name: 'Scoia\'tael (Arqueiro)',
        category: 'Humanoide',
        description: 'Um guerrilheiro elfo lutando pela liberdade. Mestre em emboscadas e tiro com arco. "Morte aos Dh\'oine!"',
        cr: 2,
        imageUrl: '/tokens/token_scoia_tael.png',
        hp: { current: 35, max: 35 },
        ac: 14, // Leve
        speed: 10, // Rápido
        initiativeModifier: 4,
        attributes: { str: { value: 12, modifier: 1 }, dex: { value: 18, modifier: 4 }, con: { value: 12, modifier: 1 }, int: { value: 12, modifier: 1 }, wis: { value: 14, modifier: 2 }, cha: { value: 10, modifier: 0 } },
        skills: ['Furtividade +6', 'Sobrevivência +4', 'Natureza +4'],
        senses: ['Visão no Escuro (Elfo)'],
        visionRange: 18,
        source: 'Witcher',
        actions: [
            { id: 'scoia_bow', name: 'Arco Longo Élfico', type: 'ranged', description: 'Alcance 45m. +6 acerto. Dano: 1d8+4 perfurante. Ignora meia-cobertura.' },
            { id: 'scoia_sword', name: 'Espada Curta', type: 'melee', description: '+6 acerto. Dano: 1d6+4 cortante.' }
        ]
    },
    {
        id: 'nilfgaard_soldier',
        name: 'Soldado Nilfgaardiano',
        category: 'Humanoide',
        description: 'Um soldado profissional do Império, bem treinado e equipado com armadura negra pesada. Disciplinado e leal ao Imperador.',
        cr: 1,
        hp: { current: 40, max: 40 },
        ac: 17, // Placas/Splint
        speed: 6,
        initiativeModifier: 1,
        attributes: { str: { value: 16, modifier: 3 }, dex: { value: 12, modifier: 1 }, con: { value: 14, modifier: 2 }, int: { value: 10, modifier: 0 }, wis: { value: 10, modifier: 0 }, cha: { value: 10, modifier: 0 } },
        skills: ['Atletismo +5'],
        senses: ['Percepção Passiva 10'],
        visionRange: 0,
        source: 'Witcher',
        actions: [
            { id: 'nilf_spear', name: 'Lança Militar', type: 'melee', description: 'Alcance 3m. +5 acerto. Dano: 1d8+3 perfurante.' },
            { id: 'nilf_sword', name: 'Espada Longa', type: 'melee', description: '+5 acerto. Dano: 1d8+3 cortante.' }
        ]
    },
    {
        id: 'witch_hunter',
        name: 'Caçador de Bruxas',
        category: 'Humanoide',
        description: 'Fanático religioso dedicado a erradicar magia e não-humanos. Usa bombas de dimerício e armaduras resistentes a magia.',
        cr: 4,
        hp: { current: 65, max: 65 },
        ac: 15,
        speed: 9,
        initiativeModifier: 3,
        attributes: { str: { value: 14, modifier: 2 }, dex: { value: 16, modifier: 3 }, con: { value: 14, modifier: 2 }, int: { value: 14, modifier: 2 }, wis: { value: 16, modifier: 3 }, cha: { value: 14, modifier: 2 } },
        skills: ['Intimidação +6', 'Investigação +6', 'Religião +5'],
        senses: ['Percepção Passiva 13'],
        visionRange: 0,
        source: 'Witcher',
        actions: [
            { id: 'hunter_xbow', name: 'Besta Pesada', type: 'ranged', description: '+5 acerto. Dano: 1d10+3 perfurante. Recarga.' },
            { id: 'hunter_shackles', name: 'Algemas de Dimerício', type: 'ability', description: 'Tenta prender um conjurador (CD 14 DES). Se preso, não pode usar magia.' },
            { id: 'hunter_sword', name: 'Espada de Prata', type: 'melee', description: '+5 acerto. Dano: 1d8+3. Eficaz contra monstros.' }
        ]
    },
    {
        id: 'bandit_deserter',
        name: 'Desertor',
        category: 'Humanoide',
        description: 'Ex-soldado que fugiu da guerra e agora vive de roubos em Velen. Desesperado e perigoso.',
        cr: 0.5,
        hp: { current: 22, max: 22 },
        ac: 13, // Gambeson sujo
        speed: 9,
        initiativeModifier: 1,
        attributes: { str: { value: 14, modifier: 2 }, dex: { value: 12, modifier: 1 }, con: { value: 12, modifier: 1 }, int: { value: 9, modifier: -1 }, wis: { value: 10, modifier: 0 }, cha: { value: 8, modifier: -1 } },
        skills: ['Sobrevivência +2'],
        senses: ['Percepção Passiva 10'],
        visionRange: 0,
        source: 'Witcher',
        actions: [
            { id: 'deserter_axe', name: 'Machado Enferrujado', type: 'melee', description: '+4 acerto. Dano: 1d8+2 cortante. Chance de Tétano (Doença).' },
            { id: 'deserter_dirty', name: 'Truque Sujo', type: 'ability', description: 'Joga areia nos olhos. CD 11 DES ou cego por 1 turno.' }
        ]
    },
    {
        id: 'sorceress',
        name: 'Feiticeira (Sorceress)',
        category: 'Humanoide',
        description: 'Maga poderosa e influente, muitas vezes conselheira de reis ou membro da Loja. Magia caótica e letal.',
        cr: 9,
        hp: { current: 70, max: 70 },
        ac: 12, // Magia protetora 15
        speed: 9,
        initiativeModifier: 2,
        attributes: { str: { value: 10, modifier: 0 }, dex: { value: 14, modifier: 2 }, con: { value: 12, modifier: 1 }, int: { value: 20, modifier: 5 }, wis: { value: 14, modifier: 2 }, cha: { value: 18, modifier: 4 } },
        skills: ['Arcanismo +9', 'Persuasão +8'],
        senses: ['Visão Mágica'],
        visionRange: 0,
        source: 'Witcher',
        actions: [
            { id: 'sorc_lightning', name: 'Relâmpago de Alzur', type: 'ranged', description: 'Linha. 8d6 elétrico. CD 16 DES.' },
            { id: 'sorc_teleport', name: 'Portal', type: 'ability', description: 'Teletransporte para qualquer lugar visível.' },
            { id: 'sorc_control', name: 'Dominação', type: 'spell', description: 'Tenta controlar a mente do alvo (CD 16 SAB).' }
        ]
    },
    {
        id: 'mahakam_defender',
        name: 'Defensor de Mahakam',
        category: 'Humanoide',
        description: 'Anão de Mahakam, robusto e equipado com o melhor aço do mundo. Resistente a venenos e magia.',
        cr: 3,
        hp: { current: 55, max: 55 },
        ac: 18, // Placas de Mahakam
        speed: 5,
        initiativeModifier: 0,
        attributes: { str: { value: 18, modifier: 4 }, dex: { value: 10, modifier: 0 }, con: { value: 18, modifier: 4 }, int: { value: 12, modifier: 1 }, wis: { value: 12, modifier: 1 }, cha: { value: 10, modifier: 0 } },
        skills: ['Atletismo +6'],
        senses: ['Visão no Escuro (Anão)'],
        visionRange: 18,
        source: 'Witcher',
        actions: [
            { id: 'mahakam_axe', name: 'Machado de Batalha', type: 'melee', description: '+6 acerto. Dano: 1d10+4 cortante. Crítico 19-20.' },
            { id: 'mahakam_shield', name: 'Parede de Escudos', type: 'ability', description: 'Dá +2 AC para aliados adjacentes.' }
        ]
    },
    {
        id: 'wild_hunt_warrior',
        name: 'Guerreiro da Caçada Selvagem',
        category: 'Humanoide (Espectro)',
        description: 'Um elfo Aen Elle de outra dimensão, vestindo armadura esquelética aterrorizante. Servem a Eredin.',
        cr: 5,
        hp: { current: 75, max: 75 },
        ac: 18,
        speed: 9,
        initiativeModifier: 3,
        attributes: { str: { value: 18, modifier: 4 }, dex: { value: 16, modifier: 3 }, con: { value: 16, modifier: 3 }, int: { value: 14, modifier: 2 }, wis: { value: 12, modifier: 1 }, cha: { value: 14, modifier: 2 } },
        skills: ['Intimidação +5'],
        senses: ['Visão no Escuro'],
        visionRange: 18,
        source: 'Witcher',
        actions: [
            { id: 'hunt_sword', name: 'Espada Montante', type: 'melee', description: '+7 acerto. Dano: 2d6+4 cortante + 1d6 gelo.' },
            { id: 'hunt_freeze', name: 'Aura Congelante', type: 'ability', description: 'Inimigos a 1.5m têm velocidade reduzida pela metade.' },
            { id: 'hunt_teleport', name: 'Passo Dimensional', type: 'ability', description: 'Teleporta 9m como ação bônus.' }
        ]
    },
    // --- Witchers (NPCs) ---
    {
        id: 'witcher_wolf',
        name: 'Bruxo (Escola do Lobo)',
        category: 'Humanoide (Bruxo)',
        description: 'Um caçador de monstros profissional. Versátil, usa armadura média e combina espada com sinais mágicos. Mestre no combate tático.',
        cr: 8,
        hp: { current: 85, max: 85 },
        ac: 16, // Armadura de Bruxo
        speed: 9,
        initiativeModifier: 4,
        attributes: { str: { value: 16, modifier: 3 }, dex: { value: 16, modifier: 3 }, con: { value: 14, modifier: 2 }, int: { value: 14, modifier: 2 }, wis: { value: 14, modifier: 2 }, cha: { value: 10, modifier: 0 } },
        skills: ['Atletismo +6', 'Acrobacia +6', 'Percepção +5', 'Alquimia +5'],
        senses: ['Visão no Escuro (Olhos de Gato)'],
        visionRange: 18,
        source: 'Witcher',
        actions: [
            { id: 'wolf_sword_steel', name: 'Espada de Aço', type: 'melee', description: '+7 acerto. Dano: 1d8+3 cortante. Para humanos.' },
            { id: 'wolf_sword_silver', name: 'Espada de Prata', type: 'melee', description: '+7 acerto. Dano: 1d8+3. Ignora resistência de monstros.' },
            { id: 'sign_igni', name: 'Sinal: Igni', type: 'ability', description: 'Cone de fogo (4.5m). 3d6 dano de fogo. CD 14 DES.' },
            { id: 'sign_aard', name: 'Sinal: Aard', type: 'ability', description: 'Onda telecinética. Derruba oponentes a 3m (CD 14 FOR).' }
        ]
    },
    {
        id: 'witcher_cat',
        name: 'Bruxo Renegado (Escola do Gato)',
        category: 'Humanoide (Bruxo)',
        description: 'Bruxo assassino, possivelmente louco ou mercenário. Usa armadura leve e prioriza velocidade e ataques letais. Não confie nele.',
        cr: 7,
        hp: { current: 65, max: 65 },
        ac: 15, // Leve + Dex
        speed: 12, // Muito rápido
        initiativeModifier: 6,
        attributes: { str: { value: 12, modifier: 1 }, dex: { value: 20, modifier: 5 }, con: { value: 12, modifier: 1 }, int: { value: 12, modifier: 1 }, wis: { value: 13, modifier: 1 }, cha: { value: 8, modifier: -1 } },
        skills: ['Furtividade +8', 'Acrobacia +8'],
        senses: ['Visão no Escuro Superior'],
        visionRange: 18,
        source: 'Witcher',
        actions: [
            { id: 'cat_sword', name: 'Estocada Rápida', type: 'melee', description: '+9 acerto. Dano: 1d6+5 perfurante. Crítico 19-20.' },
            { id: 'cat_backstab', name: 'Ataque Furtivo', type: 'ability', description: '+4d6 dano se tiver vantagem no ataque.' },
            { id: 'sign_axii', name: 'Sinal: Axii', type: 'spell', description: 'Atordoa um alvo por 1 turno (CD 14 SAB).' }
        ]
    },
    {
        id: 'witcher_bear',
        name: 'Bruxo (Escola do Urso)',
        category: 'Humanoide (Bruxo)',
        description: 'Uma muralha de músculos e aço. Usa armadura pesada e favorece golpes brutais que quebram defesas. Solitário e resistente.',
        cr: 9,
        hp: { current: 110, max: 110 },
        ac: 18, // Pesada
        speed: 7,
        initiativeModifier: 1,
        attributes: { str: { value: 20, modifier: 5 }, dex: { value: 10, modifier: 0 }, con: { value: 18, modifier: 4 }, int: { value: 12, modifier: 1 }, wis: { value: 12, modifier: 1 }, cha: { value: 8, modifier: -1 } },
        skills: ['Atletismo +9', 'Intimidação +5'],
        senses: ['Visão no Escuro'],
        visionRange: 18,
        source: 'Witcher',
        actions: [
            { id: 'bear_heavy', name: 'Ataque Pesado', type: 'melee', description: '+9 acerto. Dano: 2d6+5 cortante. Empurra o alvo 1.5m.' },
            { id: 'sign_quen', name: 'Sinal: Quen', type: 'ability', description: 'Cria um escudo que absorve 30 pontos de dano. Se quebrado, explode causando 2d6 dano a adjacentes.' }
        ]
    },
    {
        id: 'vesemir',
        name: 'Vesemir (Mestre Bruxo)',
        category: 'Humanoide (Bruxo)',
        description: 'O bruxo mais velho e experiente da Escola do Lobo. Conhecimento enciclopédico sobre monstros e um esgrimista lendário.',
        cr: 13,
        hp: { current: 140, max: 140 },
        ac: 17,
        speed: 9,
        initiativeModifier: 3,
        attributes: { str: { value: 18, modifier: 4 }, dex: { value: 16, modifier: 3 }, con: { value: 18, modifier: 4 }, int: { value: 18, modifier: 4 }, wis: { value: 20, modifier: 5 }, cha: { value: 14, modifier: 2 } },
        skills: ['História +10', 'Percepção +10', 'Alquimia +10'],
        senses: ['Visão no Escuro', 'Intuição de Batalha'],
        visionRange: 18,
        source: 'Witcher',
        actions: [
            { id: 'vesemir_multi', name: 'Mestre da Lâmina', type: 'ability', description: 'Três ataques com espada.' },
            { id: 'vesemir_sword', name: 'Espada Ancestral', type: 'melee', description: '+10 acerto. Dano: 1d8+4+1d6(fogo).' },
            { id: 'vesemir_yrden', name: 'Sinal: Yrden', type: 'ability', description: 'Cria armadilha mágica no chão. Inimigos dentro têm velocidade 0 e não podem ficar incorpóreos.' }
        ]
    },
    // --- Famous Characters ---
    {
        id: 'geralt_rivia',
        name: 'Geralt de Rívia (Lobo Branco)',
        category: 'Humanoide (Bruxo)',
        description: 'O bruxo mais famoso do século. Mestre espadachim, estrategista genial e possuidor de mutações avançadas. "O mal é o mal... menor, maior, médio... não faz diferença."',
        cr: 15,
        imageUrl: '/tokens/token_geralt.png',
        hp: { current: 180, max: 180 },
        ac: 19, // Armadura de Grão-Mestre
        speed: 10,
        initiativeModifier: 5,
        attributes: { str: { value: 18, modifier: 4 }, dex: { value: 20, modifier: 5 }, con: { value: 18, modifier: 4 }, int: { value: 16, modifier: 3 }, wis: { value: 16, modifier: 3 }, cha: { value: 12, modifier: 1 } },
        skills: ['Atletismo +9', 'Acrobacia +10', 'Percepção +8', 'Investigação +8', 'Persuasão +6'],
        senses: ['Visão no Escuro', 'Sentidos de Bruxo'],
        visionRange: 18,
        source: 'Witcher',
        actions: [
            { id: 'geralt_multi', name: 'Dança da Espada', type: 'ability', description: 'Geralt faz quatro ataques: uma mistura de cortes rápidos e pesados.' },
            { id: 'geralt_aerondight', name: 'Aerondight', type: 'melee', description: '+11 acerto. Dano: 1d10+5+1d6(radiante). Crítico 19-20. Dano aumenta a cada acerto consecutivo.' },
            { id: 'geralt_signs', name: 'Sinais de Mestre', type: 'spell', description: 'Igni (4d6 cone), Aard (Empurrão 6m), Quen (Escudo 40HP), Yrden (Lentidão), Axii (Dominação).' },
            { id: 'geralt_potions', name: 'Poções', type: 'ability', description: 'Pode beber uma poção como ação bônus: Andorinha (Regen), Trovoada (Vantagem) ou Gato (Visão total).' }
        ]
    },
    {
        id: 'letho_gulet',
        name: 'Letho de Gulet (Regicida)',
        category: 'Humanoide (Bruxo)',
        description: 'Uma montanha de músculos da Escola da Víbora. Frio, calculista e brutalmente eficiente. Matou reis e enganou a Loja das Feiticeiras.',
        cr: 14,
        hp: { current: 200, max: 200 },
        ac: 18,
        speed: 9,
        initiativeModifier: 4,
        attributes: { str: { value: 24, modifier: 7 }, dex: { value: 16, modifier: 3 }, con: { value: 22, modifier: 6 }, int: { value: 16, modifier: 3 }, wis: { value: 14, modifier: 2 }, cha: { value: 14, modifier: 2 } },
        skills: ['Enganação +7', 'Furtividade +8'],
        senses: ['Visão no Escuro'],
        visionRange: 18,
        source: 'Witcher',
        actions: [
            { id: 'letho_multi', name: 'Assalto Violento', type: 'ability', description: 'Três ataques com espada montante ou adagas.' },
            { id: 'letho_gs', name: 'Espada Montante', type: 'melee', description: '+11 acerto. Dano: 2d6+7 cortante. Derruba o alvo (CD 18 FOR).' },
            { id: 'letho_bombs', name: 'Bombas da Víbora', type: 'ranged', description: 'Lança bomba de gás ou dimerício. CD 16 CON/INT.' }
        ]
    },
    {
        id: 'ciri_elder_blood',
        name: 'Ciri (Cirilla)',
        category: 'Humanoide',
        description: 'A Senhora do Espaço e do Tempo. Treinada como bruxa, mas possuidora de magia ancestral incontrolável. Pode viajar entre mundos instantaneamente.',
        cr: 16,
        imageUrl: '/tokens/token_ciri.png',
        hp: { current: 150, max: 150 },
        ac: 17, // Destreza pura
        speed: 14, // Teleporte
        initiativeModifier: 8,
        attributes: { str: { value: 14, modifier: 2 }, dex: { value: 24, modifier: 7 }, con: { value: 14, modifier: 2 }, int: { value: 14, modifier: 2 }, wis: { value: 16, modifier: 3 }, cha: { value: 16, modifier: 3 } },
        skills: ['Acrobacia +12', 'Arcanismo +7'],
        senses: ['Visão Normal'],
        visionRange: 18,
        source: 'Witcher',
        actions: [
            { id: 'ciri_blink', name: 'Blink Attack', type: 'ability', description: 'Ciri se teleporta atacando até 5 inimigos diferentes. +12 acerto. Dano: 2d8+7 cada.' },
            { id: 'ciri_dash', name: 'Impulso (Blink)', type: 'ability', description: 'Teletransporte ilimitado de curto alcance (substitui movimento).' },
            { id: 'ciri_scream', name: 'Grito do Sangue', type: 'ability', description: 'Dano em área massivo (10d10) se estiver sob forte estresse emocional.' }
        ]
    },
    {
        id: 'eredin',
        name: 'Eredin Bréacc Glas',
        category: 'Humanoide (Espectro)',
        description: 'Rei da Caçada Selvagem. Um elfo imponente e tirânico que busca Ciri para conquistar todos os mundos.',
        cr: 17,
        hp: { current: 220, max: 220 },
        ac: 20,
        speed: 9,
        initiativeModifier: 2,
        attributes: { str: { value: 22, modifier: 6 }, dex: { value: 14, modifier: 2 }, con: { value: 20, modifier: 5 }, int: { value: 18, modifier: 4 }, wis: { value: 16, modifier: 3 }, cha: { value: 20, modifier: 5 } },
        skills: ['Intimidação +11'],
        senses: ['Visão Verdadeira'],
        visionRange: 18,
        source: 'Witcher',
        actions: [
            { id: 'eredin_multi', name: 'Ataque do Rei', type: 'ability', description: 'Três ataques com sua espada montante.' },
            { id: 'eredin_sword', name: 'Espada da Caçada', type: 'melee', description: '+12 acerto. Dano: 2d6+6+2d8(gelo).' },
            { id: 'eredin_portal', name: 'Invocar Reforços', type: 'ability', description: 'Abre portais trazendo Cães da Caçada ou Guerreiros.' }
        ]
    }
];
