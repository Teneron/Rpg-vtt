export type FeatEffectType =
    | 'speed'
    | 'initiative'
    | 'passive_perception'
    | 'attribute'
    | 'hp_per_level'
    | 'hp_flat';

export type AbilityScoreKey = 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha';

export interface FeatEffect {
    type: FeatEffectType;
    value: number;
    target?: string;
}

export type FeatCategory = 'Origem' | 'Geral' | 'Estilo de Luta' | 'Dádiva Épica';

export interface Feat {
    id: string;
    name: string;
    description: string;
    category?: FeatCategory;
    prerequisite?: string;
    descriptionFull?: string;
    effects?: FeatEffect[];
    /** Quais atributos podem receber +1 ao escolher este talento (D&D 5.5e / 2024) */
    abilityBonusOptions?: AbilityScoreKey[] | 'any';
    /** Valor de aumento de atributo concedido pelo talento (padrão: 1) */
    abilityBonusAmount?: number;
    /** Limite máximo do atributo ao aplicar este talento (20 padrão, 30 em Dádivas Épicas) */
    maxAttributeCap?: number;
    /** Concede proficiência na Salvaguarda do atributo escolhido (ex: Resiliente) */
    grantsSaveProficiency?: boolean;
    /** Pode ser escolhido múltiplas vezes */
    repeatable?: boolean;
    /** Atributo escolhido pelo jogador quando o talento foi adquirido (persistido na ficha) */
    chosenAbilityBonus?: AbilityScoreKey;
    /** Nível em que o talento foi adquirido (persistido na ficha) */
    acquiredAtLevel?: number;
}

export const FEATS: Feat[] = [
    // =========================================================================
    // TALENTOS DE ORIGEM (1º NÍVEL - D&D 2024 / 5.5e)
    // =========================================================================
    {
        id: 'alert',
        name: 'Alerta (Alert)',
        category: 'Origem',
        description: '+Bônus de Proficiência na Iniciativa. Pode trocar o valor de iniciativa com um aliado disposto no início do combate.',
        descriptionFull: 'Sempre atento ao perigo, você ganha os seguintes benefícios: Proficiência em Iniciativa — adicione seu Bônus de Proficiência à sua jogada de Iniciativa; Troca de Iniciativa — imediatamente após jogar a Iniciativa, você pode trocar seu valor de iniciativa com o de um aliado voluntário no mesmo combate (desde que nenhum dos dois esteja Incapacitado).',
        effects: [{ type: 'initiative', value: 2 }]
    },
    {
        id: 'crafter',
        name: 'Artifista (Crafter)',
        category: 'Origem',
        description: 'Proficiência com 3 Ferramentas de Artesão. 20% de desconto em itens não mágicos. Fabrica itens rápidos em descanso longo.',
        descriptionFull: 'Você adquire proficiência com três Ferramentas de Artesão diferentes à sua escolha. Sempre que comprar um item não mágico, recebe 20% de desconto. Ao terminar um Descanso Longo, pode fabricar um equipamento básico da tabela de Fabricação Rápida que dura até o próximo Descanso Longo.'
    },
    {
        id: 'savage_attacker',
        name: 'Atacante Selvagem (Savage Attacker)',
        category: 'Origem',
        description: 'Uma vez por turno ao acertar com uma arma, você pode rolar o dano duas vezes e escolher o maior resultado.',
        descriptionFull: 'Você treinou para desferir golpes particularmente devastadores. Uma vez por turno, ao atingir um alvo com uma arma como parte da ação Atacar, você pode rolar os dados de dano da arma duas vezes e usar qualquer um dos resultados contra o alvo.'
    },
    {
        id: 'healer',
        name: 'Curandeiro (Healer)',
        category: 'Origem',
        description: 'Rerrola qualquer 1 em dados de cura. Pode gastar Kit de Curandeiro para restaurar Dado de Vida + PB de um aliado.',
        descriptionFull: 'Médico de Batalha: tendo um Kit de Curandeiro, você pode gastar um uso dele com uma ação Utilizar para cuidar de uma criatura a até 1,5m — ela gasta um de seus Dados de Vida e recupera PV iguais ao dado rolado + seu Bônus de Proficiência. Rerrolagem de Cura: sempre que rolar um dado para determinar PV restaurados com magia ou com este talento, pode rerrolar resultados 1.'
    },
    {
        id: 'skilled',
        name: 'Habilidoso (Skilled)',
        category: 'Origem',
        repeatable: true,
        description: 'Ganha proficiência imediata em quaisquer 3 perícias ou ferramentas à sua escolha. Repetível.',
        descriptionFull: 'Você adquire proficiência em qualquer combinação de três perícias ou ferramentas à sua escolha. Você pode escolher este talento mais de uma vez.'
    },
    {
        id: 'magic_initiate',
        name: 'Iniciado em Magia (Magic Initiate)',
        category: 'Origem',
        repeatable: true,
        description: 'Aprende 2 truques e 1 magia de 1º círculo de Clérigo, Druida ou Mago. Conjura a magia 1x grátis por Descanso Longo.',
        descriptionFull: 'Você aprende dois truques e uma magia de 1º círculo à sua escolha da lista de Clérigo, Druida ou Mago. Escolha Inteligência, Sabedoria ou Carisma como atributo de conjuração. Você tem a magia sempre preparada, pode conjurá-la uma vez sem gastar espaço por Descanso Longo e também usando seus espaços normais de magia. Repetível escolhendo outra lista de magias.'
    },
    {
        id: 'musician',
        name: 'Músico (Musician)',
        category: 'Origem',
        description: 'Proficiência em 3 instrumentos musicais. Ao terminar descanso curto ou longo, concede Inspiração Heroica a aliados.',
        descriptionFull: 'Você ganha proficiência com três Instrumentos Musicais à sua escolha. Canção Encorajadora: ao terminar um Descanso Curto ou Longo, você pode tocar uma canção em um instrumento com o qual seja proficiente e conceder Inspiração Heroica a um número de aliados que a ouvirem igual ao seu Bônus de Proficiência.'
    },
    {
        id: 'lucky',
        name: 'Sortudo (Lucky)',
        category: 'Origem',
        description: 'Pontos de Sorte iguais ao PB. Gaste 1 ponto para ter Vantagem em teste d20 ou impor Desvantagem em ataque inimigo.',
        descriptionFull: 'Você possui Pontos de Sorte iguais ao seu Bônus de Proficiência (recuperados em Descanso Longo). Você pode gastar 1 Ponto de Sorte imediatamente após rolar um d20 para si mesmo a fim de ganhar Vantagem na rolagem, ou gastar 1 Ponto de Sorte quando uma criatura rolar um d20 para atacar você a fim de impor Desvantagem.'
    },
    {
        id: 'tavern_brawler',
        name: 'Valentão de Taverna (Tavern Brawler)',
        category: 'Origem',
        description: 'Dano desarmado 1d4 + Força. Rerrola 1s no dano. Proficiência em armas improvisadas. Empurra alvo 1,5m em acerto.',
        descriptionFull: 'Ataque Desarmado Aprimorado: seu golpe desarmado causa 1d4 + modificador de Força de dano de concussão. Rerrolagem de Dano: ao rolar 1 no dado de dano desarmado, pode rerrolar. Armas Improvisadas: você tem proficiência com armas improvisadas. Empurrão: 1x por turno ao acertar com ataque desarmado na ação Atacar, pode causar dano e empurrar o alvo 1,5m.'
    },
    {
        id: 'tough',
        name: 'Vigoroso (Tough)',
        category: 'Origem',
        description: '+2 PV por nível do personagem retroativamente e a cada novo nível ganho.',
        descriptionFull: 'Seus pontos de vida máximos aumentam em uma quantidade igual ao dobro do seu nível de personagem quando você adquire este talento. Sempre que você ganhar um nível de personagem depois disso, seus pontos de vida máximos aumentam em +2 PV adicionais.',
        effects: [{ type: 'hp_per_level', value: 2 }]
    },

    // =========================================================================
    // TALENTOS GERAIS (4º NÍVEL+ — TODOS CONCEDEM +1 EM ATRIBUTO NO D&D 2024)
    // =========================================================================
    {
        id: 'actor',
        name: 'Ator (Actor)',
        category: 'Geral',
        prerequisite: 'Nível 4+, Carisma 13+',
        abilityBonusOptions: ['cha'],
        description: '+1 Carisma. Vantagem em Atuação e Enganação para se passar por outra pessoa; imita vozes e sons (Mimetismo).',
        descriptionFull: 'Aumente seu Carisma em +1 (máx. 20). Impersonação: enquanto estiver disfarçado como uma pessoa real ou fictícia, você tem Vantagem em testes de Carisma (Atuação e Enganação) para convencer outros. Mimetismo: você pode imitar sons de criaturas e vozes humanas que tenha ouvido (CD 8 + Car + PB de Sabedoria/Intuição para perceber).'
    },
    {
        id: 'athlete',
        name: 'Atleta (Athlete)',
        category: 'Geral',
        prerequisite: 'Nível 4+, Força ou Destreza 13+',
        abilityBonusOptions: ['str', 'dex'],
        description: '+1 Força ou Destreza. Ganha deslocamento de Escalada, levanta-se gastando apenas 1,5m e salta após correr 1,5m.',
        descriptionFull: 'Aumente sua Força ou Destreza em +1 (máx. 20). Velocidade de Escalada: você ganha deslocamento de Escalada igual ao seu deslocamento de caminhada. Levantar-se Rápido: quando estiver Caído, levantar-se consome apenas 1,5m de movimento. Salto em Movimento: você pode realizar saltos em distância ou altura correndo apenas 1,5m antes.'
    },
    {
        id: 'charger',
        name: 'Investidor (Charger)',
        category: 'Geral',
        prerequisite: 'Nível 4+, Força ou Destreza 13+',
        abilityBonusOptions: ['str', 'dex'],
        description: '+1 Força ou Destreza. +3m na Disparada; após mover 3m em linha reta até o alvo, causa +1d8 de dano ou empurra 3m.',
        descriptionFull: 'Aumente sua Força ou Destreza em +1 (máx. 20). Disparada Aprimorada: ao realizar a ação Disparada, seu deslocamento aumenta em +3m adicionais naquele turno. Ataque de Investida: se você se mover pelo menos 3m em linha reta imediatamente antes de atingir um ataque corpo a corpo, escolha causar +1d8 de dano extra (1x/turno) ou empurrar o alvo até 3m.'
    },
    {
        id: 'chef',
        name: 'Chef (Chef)',
        category: 'Geral',
        prerequisite: 'Nível 4+',
        abilityBonusOptions: ['con', 'wis'],
        description: '+1 Constituição ou Sabedoria. Cura +1d8 extra em Descanso Curto para o grupo e prepara quitutes de PV Temporários.',
        descriptionFull: 'Aumente sua Constituição ou Sabedoria em +1 (máx. 20). Você ganha proficiência com Utensílios de Cozinheiro. Refeição revigorante: em Descanso Curto, até 4 + PB criaturas que gastarem Dados de Vida recuperam +1d8 PV extras. Guloseimas: após descanso longo (ou 1h de preparo), cria PB guloseimas que concedem PB PV Temporários com uma Ação Bônus.'
    },
    {
        id: 'crossbow_expert',
        name: 'Especialista em Besta (Crossbow Expert)',
        category: 'Geral',
        prerequisite: 'Nível 4+, Destreza 13+',
        abilityBonusOptions: ['dex'],
        description: '+1 Destreza. Ignora Recarga em bestas, atira corpo a corpo sem desvantagem e melhora combate duplo com bestas leves.',
        descriptionFull: 'Aumente sua Destreza em +1 (máx. 20). Ignorar Recarga: você ignora a propriedade Recarga de bestas (mesmo com a outra mão ocupada). Disparo à Queima-Roupa: estar a 1,5m de um inimigo não impõe Desvantagem nas suas jogadas de ataque com bestas. Duas Bestas: ao fazer o ataque extra da propriedade Leve com uma besta de mão, some seu modificador de atributo no dano.'
    },
    {
        id: 'crusher',
        name: 'Esmagador (Crusher)',
        category: 'Geral',
        prerequisite: 'Nível 4+',
        abilityBonusOptions: ['str', 'con'],
        description: '+1 Força ou Constituição. Dano de concussão move o alvo 1,5m; crítico dá Vantagem a todos os ataques contra o alvo.',
        descriptionFull: 'Aumente sua Força ou Constituição em +1 (máx. 20). Empurrar: 1x por turno, ao acertar uma criatura com ataque que cause dano de Concussão, você pode movê-la 1,5m para um espaço desocupado (se não for mais que um tamanho maior que você). Crítico Aprimorado: ao obter Acerto Crítico de Concussão, jogadas de ataque contra aquela criatura têm Vantagem até o início do seu próximo turno.'
    },
    {
        id: 'defensive_duelist',
        name: 'Duelista Defensivo (Defensive Duelist)',
        category: 'Geral',
        prerequisite: 'Nível 4+, Destreza 13+',
        abilityBonusOptions: ['dex'],
        description: '+1 Destreza. Empunhando arma de Acuidade, usa Reação para somar +PB na CA contra ataques corpo a corpo até seu próximo turno.',
        descriptionFull: 'Aumente sua Destreza em +1 (máx. 20). Aparar: se estiver empunhando uma arma Corpo a Corpo com a propriedade Acuidade e outra criatura atingir você com um ataque corpo a corpo, você pode usar sua Reação para adicionar seu Bônus de Proficiência à sua CA, potencialmente fazendo o ataque errar, mantendo esse bônus contra ataques corpo a corpo até o início do seu próximo turno.'
    },
    {
        id: 'dual_wielder',
        name: 'Combate Duplo / Ambidestro (Dual Wielder)',
        category: 'Geral',
        prerequisite: 'Nível 4+, Força ou Destreza 13+',
        abilityBonusOptions: ['str', 'dex'],
        description: '+1 Força ou Destreza. Ataque extra aprimorado com Ação Bônus usando qualquer arma de uma mão sem propriedade Pesada.',
        descriptionFull: 'Aumente sua Força ou Destreza em +1 (máx. 20). Combate Duplo Aprimorado: quando realizar a ação Atacar com uma arma que possua a propriedade Leve, você pode fazer um ataque extra como Ação Bônus com outra arma Corpo a Corpo diferente de uma mão que não tenha a propriedade Duas Mãos (acumulando com Nick). Saque Duplo: você pode sacar ou guardar duas armas de uma vez.'
    },
    {
        id: 'durable',
        name: 'Durável (Durable)',
        category: 'Geral',
        prerequisite: 'Nível 4+',
        abilityBonusOptions: ['con'],
        description: '+1 Constituição. Vantagem em Testes contra a Morte e pode gastar 1 Dado de Vida como Ação Bônus para se curar em combate.',
        descriptionFull: 'Aumente sua Constituição em +1 (máx. 20). Desafiar a Morte: você tem Vantagem em Testes de Resistência contra a Morte. Recuperação Rápida: como uma Ação Bônus em combate, você pode gastar um de seus Dados de Vida, rolá-lo e recuperar um número de Pontos de Vida igual ao valor rolado.'
    },
    {
        id: 'elemental_adept',
        name: 'Adepto Elemental (Elemental Adept)',
        category: 'Geral',
        prerequisite: 'Nível 4+, Conjuração ou Magia de Pacto',
        abilityBonusOptions: ['int', 'wis', 'cha'],
        repeatable: true,
        description: '+1 Int, Sab ou Car. Escolha Ácido, Frio, Fogo, Elétrico ou Trovão: magias ignoram Resistência e 1s no dano contam como 2.',
        descriptionFull: 'Aumente sua Inteligência, Sabedoria ou Carisma em +1 (máx. 20). Escolha um tipo de dano: Ácido, Elétrico, Fogo, Frio ou Trovão. Magias que você conjurar ignoram Resistência a esse tipo de dano. Além disso, ao rolar o dano de uma magia conjurada desse tipo, trate qualquer resultado 1 nos dados de dano como 2. Repetível para outros elementos.'
    },
    {
        id: 'fey_touched',
        name: 'Tocado pelas Fadas (Fey-Touched)',
        category: 'Geral',
        prerequisite: 'Nível 4+',
        abilityBonusOptions: ['int', 'wis', 'cha'],
        description: '+1 Int, Sab ou Car. Aprende Passo Nebuloso e 1 magia de 1º círculo de Adivinhação/Encantamento (1x grátis por Descanso Longo).',
        descriptionFull: 'Sua exposição à magia de Faéria lhe concede: +1 em Inteligência, Sabedoria ou Carisma (máx. 20). Magia Feérica: escolha uma magia de 1º círculo das escolas de Adivinhação ou Encantamento. Você sempre tem essa magia e Passo Nebuloso (Misty Step) preparadas; pode conjurar cada uma 1x sem gastar espaço de magia por Descanso Longo, além de conjurá-las com espaços normais.'
    },
    {
        id: 'grappler',
        name: 'Lutador de Agarrão (Grappler)',
        category: 'Geral',
        prerequisite: 'Nível 4+, Força ou Destreza 13+',
        abilityBonusOptions: ['str', 'dex'],
        description: '+1 Força ou Destreza. Causa dano e Agarra no mesmo ataque desarmado, tem Vantagem contra agarrados e move sem lentidão.',
        descriptionFull: 'Aumente sua Força ou Destreza em +1 (máx. 20). Golpear e Agarrar: 1x por turno ao acertar um Ataque Desarmado na ação Atacar, você pode causar o dano E iniciar o Agarrão simultaneamente. Vantagem no Ataque: você tem Vantagem nas jogadas de ataque contra criaturas Agarradas por você. Lutador Ágil: você não sofre custo dobrado de movimento ao mover criaturas agarradas do seu tamanho ou menores.'
    },
    {
        id: 'great_weapon_master',
        name: 'Mestre em Armas Grandes (Great Weapon Master)',
        category: 'Geral',
        prerequisite: 'Nível 4+, Força 13+',
        abilityBonusOptions: ['str'],
        description: '+1 Força. Soma PB no dano de armas Pesadas na ação Atacar. Ataque extra com Ação Bônus ao critar ou reduzir a 0 PV.',
        descriptionFull: 'Aumente sua Força em +1 (máx. 20). Maestria em Armas Pesadas: quando acertar uma criatura com uma arma que possua a propriedade Pesada como parte da ação Atacar no seu turno, você causa dano adicional igual ao seu Bônus de Proficiência. Talho: imediatamente após obter um Acerto Crítico ou reduzir uma criatura a 0 PV com arma corpo a corpo, pode fazer um ataque com ela usando Ação Bônus.'
    },
    {
        id: 'heavy_armor_master',
        name: 'Mestre em Armaduras Pesadas (Heavy Armor Master)',
        category: 'Geral',
        prerequisite: 'Nível 4+, Treinamento em Armadura Pesada',
        abilityBonusOptions: ['str', 'con'],
        description: '+1 Força ou Constituição. Vestindo armadura pesada, reduz danos de Concussão, Cortante e Perfurante em valor igual ao PB.',
        descriptionFull: 'Aumente sua Força ou Constituição em +1 (máx. 20). Redução de Dano: quando você for atingido por um ataque enquanto estiver vestindo uma Armadura Pesada, qualquer dano de Concussão, Cortante e Perfurante causado a você por aquele ataque é reduzido em uma quantidade igual ao seu Bônus de Proficiência.'
    },
    {
        id: 'inspiring_leader',
        name: 'Líder Inspirador (Inspiring Leader)',
        category: 'Geral',
        prerequisite: 'Nível 4+, Sabedoria ou Carisma 13+',
        abilityBonusOptions: ['wis', 'cha'],
        description: '+1 Sabedoria ou Carisma. Ao final de Descanso Curto ou Longo, concede Nível + Mod de PV Temporários para até 6 aliados.',
        descriptionFull: 'Aumente sua Sabedoria ou Carisma em +1 (máx. 20). Performance Motivadora: ao terminar um Descanso Curto ou Longo, você pode fazer um discurso ou performance inspiradora para até 6 criaturas amigáveis (incluindo você) em até 9m: cada uma ganha Pontos de Vida Temporários iguais ao seu Nível de personagem + o modificador do atributo aumentado por este talento.'
    },
    {
        id: 'keen_mind',
        name: 'Mente Aguçada (Keen Mind)',
        category: 'Geral',
        prerequisite: 'Nível 4+, Inteligência 13+',
        abilityBonusOptions: ['int'],
        description: '+1 Inteligência. Proficiência ou Especialização em perícia de conhecimento e realiza a ação Estudar como Ação Bônus.',
        descriptionFull: 'Aumente sua Inteligência em +1 (máx. 20). Conhecimento Erudito: escolha uma das seguintes perícias: Arcanismo, História, Investigação, Natureza ou Religião. Se não tiver proficiência nela, ganha proficiência; se já tiver, ganha Especialização (dobro de PB). Estudo Rápido: você pode realizar a ação Estudar como uma Ação Bônus.'
    },
    {
        id: 'lightly_armored',
        name: 'Levemente Protegido (Lightly Armored)',
        category: 'Geral',
        prerequisite: 'Nível 4+',
        abilityBonusOptions: ['str', 'dex'],
        description: '+1 Força ou Destreza. Você adquire treinamento com Armaduras Leves e Escudos.',
        descriptionFull: 'Aumente sua Força ou Destreza em +1 (máx. 20). Treinamento com Armaduras: você ganha treinamento e proficiência com Armaduras Leves e com Escudos.'
    },
    {
        id: 'mage_slayer',
        name: 'Matador de Magos (Mage Slayer)',
        category: 'Geral',
        prerequisite: 'Nível 4+',
        abilityBonusOptions: ['str', 'dex'],
        description: '+1 Força ou Destreza. Seus golpes dão Desvantagem na Concentração inimiga; 1x/descanso passa automaticamente em Save mental.',
        descriptionFull: 'Aumente sua Força ou Destreza em +1 (máx. 20). Quebrador de Concentração: quando você causar dano a uma criatura que esteja se concentrando, ela tem Desvantagem na salvaguarda feita para manter a Concentração. Mente Guardada: se você falhar em uma salvaguarda de Inteligência, Sabedoria ou Carisma, pode escolher passar no teste! (1 uso recuperado em Descanso Curto ou Longo).'
    },
    {
        id: 'medium_armor_master',
        name: 'Mestre em Armaduras Médias (Medium Armor Master)',
        category: 'Geral',
        prerequisite: 'Nível 4+, Treinamento em Armadura Média',
        abilityBonusOptions: ['str', 'dex'],
        description: '+1 Força ou Destreza. Enquanto vestir Armadura Média e tiver Destreza 16+, soma até +3 de Destreza na CA (em vez de +2).',
        descriptionFull: 'Aumente sua Força ou Destreza em +1 (máx. 20). Portador Ágil: enquanto estiver usando uma Armadura Média, você pode adicionar +3 (em vez de +2) à sua CA se tiver Destreza 16 ou superior.'
    },
    {
        id: 'moderately_armored',
        name: 'Moderadamente Protegido (Moderately Armored)',
        category: 'Geral',
        prerequisite: 'Nível 4+, Treinamento em Armadura Leve',
        abilityBonusOptions: ['str', 'dex'],
        description: '+1 Força ou Destreza. Você adquire treinamento com Armaduras Médias.',
        descriptionFull: 'Aumente sua Força ou Destreza em +1 (máx. 20). Treinamento com Armaduras: você adquire treinamento e proficiência com Armaduras Médias.'
    },
    {
        id: 'mounted_combatant',
        name: 'Combatente Montado (Mounted Combatant)',
        category: 'Geral',
        prerequisite: 'Nível 4+',
        abilityBonusOptions: ['str', 'dex', 'wis'],
        description: '+1 Força, Destreza ou Sabedoria. Vantagem contra alvos menores que a montaria, Evasão para a montaria e desvio de ataques.',
        descriptionFull: 'Aumente sua Força, Destreza ou Sabedoria em +1 (máx. 20). Enquanto estiver montado: Golpe Montado — Vantagem em ataques contra criaturas desmontadas a 1,5m da montaria que sejam menores que ela; Saltar de Lado — se a montaria fizer salvaguarda de Destreza para metade do dano, sofre zero no sucesso e metade na falha; Desviar Ataque — pode redirecionar ataques contra a montaria para você.'
    },
    {
        id: 'observant',
        name: 'Observador (Observant)',
        category: 'Geral',
        prerequisite: 'Nível 4+, Inteligência ou Sabedoria 13+',
        abilityBonusOptions: ['int', 'wis'],
        description: '+1 Inteligência ou Sabedoria. Proficiência ou Especialização em Percepção/Investigação/Intuição e Procurar como Ação Bônus.',
        descriptionFull: 'Aumente sua Inteligência ou Sabedoria em +1 (máx. 20). Observador Aguçado: escolha Intuição, Investigação ou Percepção — ganha proficiência nela ou Especialização caso já seja proficiente. Busca Rápida: você pode realizar a ação Procurar como Ação Bônus.'
    },
    {
        id: 'piercer',
        name: 'Perfurador (Piercer)',
        category: 'Geral',
        prerequisite: 'Nível 4+',
        abilityBonusOptions: ['str', 'dex'],
        description: '+1 Força ou Destreza. 1x/turno rerrola um dado de dano Perfurante; crítico adiciona +1 dado extra de dano Perfurante.',
        descriptionFull: 'Aumente sua Força ou Destreza em +1 (máx. 20). Perfurar: uma vez por turno, ao atingir uma criatura com um ataque que cause dano Perfurante, você pode rerrolar um dos dados de dano do ataque (usando o novo valor). Crítico Aprimorado: ao obter Acerto Crítico que cause dano Perfurante, você pode rolar um dado de dano adicional.'
    },
    {
        id: 'poisoner',
        name: 'Envenenador (Poisoner)',
        category: 'Geral',
        prerequisite: 'Nível 4+',
        abilityBonusOptions: ['dex', 'int'],
        description: '+1 Destreza ou Inteligência. Ignora Resistência a Veneno; prepara doses potentes (2d8 + Envenenado) aplicadas com Ação Bônus.',
        descriptionFull: 'Aumente sua Destreza ou Inteligência em +1 (máx. 20). Seus ataques e magias ignoram Resistência a dano de Veneno. Você ganha proficiência com Kit de Venenos, podendo preparar PB doses de veneno potente (50 PO de materiais em 1h) e aplicá-las na arma com Ação Bônus (alvo faz Save de CON CD 8 + Mod + PB ou sofre 2d8 Veneno e fica Envenenado).'
    },
    {
        id: 'polearm_master',
        name: 'Mestre em Armas de Haste (Polearm Master)',
        category: 'Geral',
        prerequisite: 'Nível 4+, Força ou Destreza 13+',
        abilityBonusOptions: ['str', 'dex'],
        description: '+1 Força ou Destreza. Golpe com a coronha na Ação Bônus (1d4) e Reação para golpear inimigos que entram no seu alcance.',
        descriptionFull: 'Aumente sua Força ou Destreza em +1 (máx. 20). Golpe de Haste: imediatamente após realizar a ação Atacar com bordão, lança ou arma Pesada com Alcance (alabarda, glaive, pique), você pode usar uma Ação Bônus para fazer um ataque corpo a corpo com a outra ponta (1d4 Concussão + atributo). Golpe Reativo: quando um inimigo entrar no seu alcance, você pode usar sua Reação para golpeá-lo.'
    },
    {
        id: 'resilient',
        name: 'Resiliente (Resilient)',
        category: 'Geral',
        prerequisite: 'Nível 4+',
        abilityBonusOptions: 'any',
        grantsSaveProficiency: true,
        description: '+1 em um atributo à sua escolha e ganha proficiência na Salvaguarda desse atributo.',
        descriptionFull: 'Escolha um atributo no qual você ainda não tenha proficiência em Salvaguarda: aumente o atributo escolhido em +1 (até o máximo de 20) e você ganha proficiência nas Salvaguardas que utilizam esse atributo.'
    },
    {
        id: 'ritual_caster',
        name: 'Conjurador de Rituais (Ritual Caster)',
        category: 'Geral',
        prerequisite: 'Nível 4+; Int, Sab ou Car 13+',
        abilityBonusOptions: ['int', 'wis', 'cha'],
        description: '+1 Int, Sab ou Car. Aprende magias com tag Ritual sempre preparadas (escalando com PB) e conjura 1 ritual rápido por Descanso Longo.',
        descriptionFull: 'Aumente sua Inteligência, Sabedoria ou Carisma em +1 (máx. 20). Magias de Ritual: escolha um número de magias de 1º círculo com a marcação Ritual igual ao seu Bônus de Proficiência — você as tem sempre preparadas (ganhando mais conforme seu PB sobe). Ritual Rápido: 1x por Descanso Longo, você pode conjurar uma magia de Ritual usando o tempo normal de conjuração sem gastar espaço de magia.'
    },
    {
        id: 'sentinel',
        name: 'Sentinela (Sentinel)',
        category: 'Geral',
        prerequisite: 'Nível 4+, Força ou Destreza 13+',
        abilityBonusOptions: ['str', 'dex'],
        description: '+1 Força ou Destreza. Ataque de oportunidade zera deslocamento, pega quem Desengaja e usa Reação para punir ataque a aliado.',
        descriptionFull: 'Aumente sua Força ou Destreza em +1 (máx. 20). Guardião: imediatamente após uma criatura a até 1,5m usar Desengajar ou atingir um alvo diferente de você com um ataque, você pode fazer um Ataque de Oportunidade contra ela. Deter: quando você atinge uma criatura com Ataque de Oportunidade, o deslocamento dela cai para 0 pelo restante do turno.'
    },
    {
        id: 'shadow_touched',
        name: 'Tocado pelas Sombras (Shadow-Touched)',
        category: 'Geral',
        prerequisite: 'Nível 4+',
        abilityBonusOptions: ['int', 'wis', 'cha'],
        description: '+1 Int, Sab ou Car. Aprende Invisibilidade e 1 magia de 1º círculo de Ilusão/Necromancia (1x grátis por Descanso Longo).',
        descriptionFull: 'Sua exposição à magia de Umbra lhe concede: +1 em Inteligência, Sabedoria ou Carisma (máx. 20). Magia Sombria: escolha uma magia de 1º círculo das escolas de Ilusão ou Necromancia. Você tem essa magia e Invisibilidade sempre preparadas; pode conjurar cada uma 1x sem gastar espaço de magia por Descanso Longo, além de conjurá-las com espaços normais.'
    },
    {
        id: 'sharpshooter',
        name: 'Mestre-Atirador (Sharpshooter)',
        category: 'Geral',
        prerequisite: 'Nível 4+, Destreza 13+',
        abilityBonusOptions: ['dex'],
        description: '+1 Destreza. Ignora meia cobertura e 3/4, atira em alcance longo sem desvantagem e não tem desvantagem corpo a corpo.',
        descriptionFull: 'Aumente sua Destreza em +1 (máx. 20). Ignorar Cobertura: seus ataques à distância com armas ignoram Meia Cobertura e Cobertura de Três Quartos. Disparo Corpo a Corpo: estar a 1,5m de um inimigo não impõe Desvantagem nas suas jogadas de ataque com armas à distância. Tiros Longos: atacar no alcance longo não impõe Desvantagem.'
    },
    {
        id: 'shield_master',
        name: 'Mestre em Escudos (Shield Master)',
        category: 'Geral',
        prerequisite: 'Nível 4+, Treinamento em Escudos',
        abilityBonusOptions: ['str'],
        description: '+1 Força. Golpe com escudo empurra 1,5m ou derruba Caído; Reação interpondo escudo anula dano em sucesso de salvaguarda de DES.',
        descriptionFull: 'Aumente sua Força em +1 (máx. 20). Golpear com Escudo: se você atacar uma criatura a 1,5m na ação Atacar empunhando um Escudo, pode forçá-la a fazer salvaguarda de Força (CD 8 + FOR + PB) ou ser empurrada 1,5m / ficar Caída (1x/turno). Interpor Escudo: se passar em salvaguarda de Destreza para metade do dano, use sua Reação para não sofrer nenhum dano.'
    },
    {
        id: 'skill_expert',
        name: 'Especialista em Perícia (Skill Expert)',
        category: 'Geral',
        prerequisite: 'Nível 4+',
        abilityBonusOptions: 'any',
        description: '+1 em qualquer atributo. Ganha proficiência em 1 perícia à escolha e Especialização (dobro de PB) em 1 perícia proficiente.',
        descriptionFull: 'Aumente um atributo à sua escolha em +1 (máx. 20). Proficiência em Perícia: você ganha proficiência em uma perícia à sua escolha. Especialização: escolha uma perícia na qual você tenha proficiência mas não tenha Especialização — você ganha Especialização nela (dobrando o Bônus de Proficiência).'
    },
    {
        id: 'skulker',
        name: 'Sorrateiro (Skulker)',
        category: 'Geral',
        prerequisite: 'Nível 4+, Destreza 13+',
        abilityBonusOptions: ['dex'],
        description: '+1 Destreza. Ganha Visão às Cegas 3m, Vantagem em Furtividade para esconder-se em combate e tiros errados não revelam você.',
        descriptionFull: 'Aumente sua Destreza em +1 (máx. 20). Visão às Cegas: você tem Visão às Cegas com alcance de 3m (10 pés). Névoa de Guerra: você tem Vantagem em qualquer teste de Destreza (Furtividade) que realizar como parte da ação Esconder-se durante o combate. Atirador Oculto: se fizer um ataque enquanto estiver escondido e errar, o ataque não revela sua localização.'
    },
    {
        id: 'slasher',
        name: 'Retalhador (Slasher)',
        category: 'Geral',
        prerequisite: 'Nível 4+',
        abilityBonusOptions: ['str', 'dex'],
        description: '+1 Força ou Destreza. 1x/turno dano Cortante reduz velocidade do alvo em 3m; crítico impõe Desvantagem nos ataques do alvo.',
        descriptionFull: 'Aumente sua Força ou Destreza em +1 (máx. 20). Jarretar: 1x por turno ao acertar uma criatura com ataque que cause dano Cortante, você pode reduzir o deslocamento dela em 3m até o início do seu próximo turno. Crítico Aprimorado: ao obter Acerto Crítico que cause dano Cortante, o alvo tem Desvantagem nas jogadas de ataque até o início do seu próximo turno.'
    },
    {
        id: 'speedy',
        name: 'Veloz (Speedy)',
        category: 'Geral',
        prerequisite: 'Nível 4+, Destreza ou Constituição 13+',
        abilityBonusOptions: ['dex', 'con'],
        description: '+1 Destreza ou Constituição. +3m de deslocamento base, Disparada ignora Terreno Difícil e ataques de oportunidade têm Desvantagem.',
        descriptionFull: 'Aumente sua Destreza ou Constituição em +1 (máx. 20). Aumento de Deslocamento: seu deslocamento aumenta em +3 metros (10 pés). Disparar por Terreno Difícil: ao realizar a ação Disparada no seu turno, Terreno Difícil não lhe custa movimento adicional. Movimento Ágil: Ataques de Oportunidade têm Desvantagem contra você.',
        effects: [{ type: 'speed', value: 3 }]
    },
    {
        id: 'spell_sniper',
        name: 'Atirador de Magia (Spell Sniper)',
        category: 'Geral',
        prerequisite: 'Nível 4+, Conjuração ou Magia de Pacto',
        abilityBonusOptions: ['int', 'wis', 'cha'],
        description: '+1 Int, Sab ou Car. Magias de ataque ignoram cobertura, não têm desvantagem corpo a corpo e ganham +18m de alcance.',
        descriptionFull: 'Aumente sua Inteligência, Sabedoria ou Carisma em +1 (máx. 20). Ignorar Cobertura: suas jogadas de ataque para magias ignoram Meia Cobertura e Cobertura de Três Quartos. Conjuração Corpo a Corpo: estar a 1,5m de um inimigo não impõe Desvantagem nas suas jogadas de ataque com magias. Alcance Aumentado: quando conjurar magia com alcance de pelo menos 3m e que exija jogada de ataque, seu alcance aumenta em +18m.'
    },
    {
        id: 'telekinetic',
        name: 'Telecinético (Telekinetic)',
        category: 'Geral',
        prerequisite: 'Nível 4+',
        abilityBonusOptions: ['int', 'wis', 'cha'],
        description: '+1 Int, Sab ou Car. Aprende Mãos Mágicas invisível (+9m) e usa Ação Bônus para empurrar ou puxar criaturas em 1,5m.',
        descriptionFull: 'Aumente sua Inteligência, Sabedoria ou Carisma em +1 (máx. 20). Telecinese Menor: você aprende o truque Mãos Mágicas (invisível, sem componentes V/S; se já conhecer, o alcance aumenta em +9m). Empurrão Telecinético: como Ação Bônus, escolha uma criatura visível a até 9m — ela faz salvaguarda de Força (CD 8 + Mod + PB) ou é empurrada/puxada 1,5m.'
    },
    {
        id: 'telepathic',
        name: 'Telepático (Telepathic)',
        category: 'Geral',
        prerequisite: 'Nível 4+',
        abilityBonusOptions: ['int', 'wis', 'cha'],
        description: '+1 Int, Sab ou Car. Fala telepaticamente até 18m e aprende Detectar Pensamentos (1x grátis por Descanso Longo).',
        descriptionFull: 'Aumente sua Inteligência, Sabedoria ou Carisma em +1 (máx. 20). Fala Telepática: você pode falar telepaticamente com qualquer criatura visível a até 18m que conheça um idioma. Detectar Pensamentos: você sempre tem a magia Detectar Pensamentos preparada e pode conjurá-la 1x sem espaço de magia ou componentes por Descanso Longo (além de usar espaços normais).'
    },
    {
        id: 'war_caster',
        name: 'Conjurador Bélico (War Caster)',
        category: 'Geral',
        prerequisite: 'Nível 4+, Conjuração ou Magia de Pacto',
        abilityBonusOptions: ['int', 'wis', 'cha'],
        description: '+1 Int, Sab ou Car. Vantagem em salvaguarda de Concentração, somático com armas/escudo e magia como Reação de oportunidade.',
        descriptionFull: 'Aumente sua Inteligência, Sabedoria ou Carisma em +1 (máx. 20). Concentração: você tem Vantagem em salvaguardas de Constituição para manter Concentração. Magia Reativa: quando uma criatura provoca um Ataque de Oportunidade saindo do seu alcance, use sua Reação para conjurar uma magia de 1 ação mirando apenas nela. Componentes Somáticos: realiza componentes S mesmo com armas/escudo nas duas mãos.'
    },
    {
        id: 'weapon_master',
        name: 'Mestre de Armas (Weapon Master)',
        category: 'Geral',
        prerequisite: 'Nível 4+',
        abilityBonusOptions: ['str', 'dex'],
        description: '+1 Força ou Destreza. Você desbloqueia a Propriedade de Maestria de um tipo de arma simples ou marcial à sua escolha.',
        descriptionFull: 'Aumente sua Força ou Destreza em +1 (máx. 20). Propriedade de Maestria: seu treinamento permite usar a propriedade de Maestria (Cleave, Graze, Nick, Push, Sap, Slow, Topple ou Vex) de um tipo de arma Simples ou Marcial à sua escolha com a qual tenha proficiência. Sempre que terminar um Descanso Longo, você pode trocar o tipo de arma escolhido.'
    },

    // =========================================================================
    // ESTILOS DE LUTA (TALENTOS DE ESTILO DE LUTA - D&D 2024)
    // =========================================================================
    {
        id: 'fighting_style_archery',
        name: 'Estilo de Luta: Arquearia (Archery)',
        category: 'Estilo de Luta',
        prerequisite: 'Característica Estilo de Luta',
        description: '+2 de bônus nas jogadas de ataque realizadas com armas de ataque à distância.',
        descriptionFull: 'Você ganha um bônus de +2 nas jogadas de ataque que fizer com armas de Ataque à Distância.'
    },
    {
        id: 'fighting_style_blind_fighting',
        name: 'Estilo de Luta: Luta às Cegas (Blind Fighting)',
        category: 'Estilo de Luta',
        prerequisite: 'Característica Estilo de Luta',
        description: 'Você ganha Visão às Cegas com alcance de 3 metros (10 pés).',
        descriptionFull: 'Você tem Visão às Cegas com alcance de 3 metros (10 pés), permitindo enxergar na escuridão total e perceber inimigos invisíveis dentro desse raio.'
    },
    {
        id: 'fighting_style_defense',
        name: 'Estilo de Luta: Defesa (Defense)',
        category: 'Estilo de Luta',
        prerequisite: 'Característica Estilo de Luta',
        description: '+1 de bônus na Classe de Armadura (CA) enquanto estiver vestindo armadura Leve, Média ou Pesada.',
        descriptionFull: 'Enquanto você estiver vestindo uma armadura Leve, Média ou Pesada, ganha um bônus de +1 na Classe de Armadura (CA) — aplicado automaticamente na ficha.'
    },
    {
        id: 'fighting_style_dueling',
        name: 'Estilo de Luta: Duelismo (Dueling)',
        category: 'Estilo de Luta',
        prerequisite: 'Característica Estilo de Luta',
        description: '+2 nas jogadas de dano ao empunhar arma corpo a corpo em uma mão e nenhuma outra arma.',
        descriptionFull: 'Quando você estiver empunhando uma arma Corpo a Corpo em uma mão e nenhuma outra arma (pode usar escudo), ganha um bônus de +2 nas jogadas de dano com essa arma.'
    },
    {
        id: 'fighting_style_great_weapon',
        name: 'Estilo de Luta: Combate com Armas Grandes',
        category: 'Estilo de Luta',
        prerequisite: 'Característica Estilo de Luta',
        description: 'Em armas de Duas Mãos ou Versáteis com 2 mãos, qualquer 1 ou 2 nos dados de dano conta automaticamente como 3 (D&D 2024).',
        descriptionFull: 'Quando você rolar o dano de um ataque feito com uma arma Corpo a Corpo empunhada com duas mãos (propriedade Duas Mãos ou Versátil), você pode tratar qualquer resultado 1 ou 2 em um dado de dano como um 3.'
    },
    {
        id: 'fighting_style_interception',
        name: 'Estilo de Luta: Interceptação (Interception)',
        category: 'Estilo de Luta',
        prerequisite: 'Característica Estilo de Luta',
        description: 'Reação com escudo ou arma para reduzir o dano sofrido por um aliado adjacente (1,5m) em 1d10 + PB.',
        descriptionFull: 'Quando uma criatura que você possa ver atingir outra criatura a até 1,5m de você com uma jogada de ataque, você pode usar sua Reação para reduzir o dano causado ao alvo em 1d10 + seu Bônus de Proficiência (exige escudo ou arma simples/marcial).'
    },
    {
        id: 'fighting_style_protection',
        name: 'Estilo de Luta: Proteção (Protection)',
        category: 'Estilo de Luta',
        prerequisite: 'Característica Estilo de Luta',
        description: 'Reação com escudo para impor Desvantagem em todas as jogadas de ataque contra um aliado a 1,5m até seu próximo turno.',
        descriptionFull: 'Quando uma criatura visível atacar um alvo diferente de você a até 1,5m, você pode usar sua Reação com seu Escudo para impor Desvantagem naquela jogada de ataque e em todas as outras jogadas de ataque contra o aliado até o início do seu próximo turno enquanto permanecer a 1,5m dele.'
    },
    {
        id: 'fighting_style_thrown_weapon',
        name: 'Estilo de Luta: Armas de Arremesso (Thrown Weapon)',
        category: 'Estilo de Luta',
        prerequisite: 'Característica Estilo de Luta',
        description: '+2 nas jogadas de dano em ataques à distância realizados com armas que possuam a propriedade Arremesso.',
        descriptionFull: 'Sempre que você atingir um ataque à distância usando uma arma que tenha a propriedade Arremesso, você ganha um bônus de +2 na jogada de dano.'
    },
    {
        id: 'fighting_style_two_weapon',
        name: 'Estilo de Luta: Combate com Duas Armas (Two-Weapon)',
        category: 'Estilo de Luta',
        prerequisite: 'Característica Estilo de Luta',
        description: 'Soma seu modificador de atributo também na jogada de dano do ataque extra feito com arma Leve.',
        descriptionFull: 'Quando você realizar um ataque extra como resultado de usar uma arma que possua a propriedade Leve, você pode adicionar seu modificador de atributo ao dano desse ataque.'
    },
    {
        id: 'fighting_style_unarmed',
        name: 'Estilo de Luta: Combate Desarmado (Unarmed Fighting)',
        category: 'Estilo de Luta',
        prerequisite: 'Característica Estilo de Luta',
        description: 'Golpes desarmados causam 1d6 + FOR (ou 1d8 + FOR com mãos livres) e causam 1d4 automático no início do turno em alvo agarrado.',
        descriptionFull: 'Seus Ataques Desarmados causam dano de Concussão igual a 1d6 + modificador de Força (ou 1d8 + Força se não estiver empunhando nenhuma arma nem escudo). No início de cada turno seu, você pode causar 1d4 de dano de Concussão a uma criatura Agarrada por você.'
    },

    // =========================================================================
    // DÁDIVAS ÉPICAS (19º NÍVEL+ — AUMENTAM ATRIBUTO EM +1 ATÉ O LIMITE DE 30)
    // =========================================================================
    {
        id: 'boon_of_combat_prowess',
        name: 'Dádiva da Proeza em Combate (Boon of Combat Prowess)',
        category: 'Dádiva Épica',
        prerequisite: 'Nível 19+',
        abilityBonusOptions: 'any',
        maxAttributeCap: 30,
        description: '+1 em qualquer atributo (máx. 30). 1x por turno, ao errar uma jogada de ataque, você pode escolher acertar automaticamente!',
        descriptionFull: 'Aumente um atributo à sua escolha em +1 (até o máximo de 30). Mira Impecável: quando você errar uma jogada de ataque, pode escolher acertar em vez disso. Depois de usar este benefício, não pode usá-lo novamente até o início do seu próximo turno.'
    },
    {
        id: 'boon_of_dimensional_travel',
        name: 'Dádiva da Viagem Dimensional (Boon of Dimensional Travel)',
        category: 'Dádiva Épica',
        prerequisite: 'Nível 19+',
        abilityBonusOptions: 'any',
        maxAttributeCap: 30,
        description: '+1 em qualquer atributo (máx. 30). Imediatamente após usar a ação Atacar ou Magia, você pode se teleportar até 9 metros.',
        descriptionFull: 'Aumente um atributo à sua escolha em +1 (até o máximo de 30). Passos Piscantes: imediatamente após realizar a ação Atacar ou a ação Magia, você pode se teleportar até 9 metros para um espaço desocupado que possa ver.'
    },
    {
        id: 'boon_of_energy_resistance',
        name: 'Dádiva da Resistência a Energia (Boon of Energy Resistance)',
        category: 'Dádiva Épica',
        prerequisite: 'Nível 19+',
        abilityBonusOptions: 'any',
        maxAttributeCap: 30,
        description: '+1 em qualquer atributo (máx. 30). Ganha Resistência a 2 tipos de energia elemental/mágica e redireciona dano com Reação.',
        descriptionFull: 'Aumente um atributo à sua escolha em +1 (até o máximo de 30). Escolha dois tipos entre Ácido, Elétrico, Fogo, Frio, Necrótico, Psíquico, Radiante, Trovão ou Veneno (trocáveis em Descanso Longo): você tem Resistência a eles e pode usar Reação ao sofrer dano deles para causar 2d12 + CON a um inimigo em 18m.'
    },
    {
        id: 'boon_of_fate',
        name: 'Dádiva do Destino (Boon of Fate)',
        category: 'Dádiva Épica',
        prerequisite: 'Nível 19+',
        abilityBonusOptions: 'any',
        maxAttributeCap: 30,
        description: '+1 em qualquer atributo (máx. 30). Soma ou subtrai 2d4 do teste de d20 de uma criatura a até 18m (recarrega na Iniciativa/Descanso).',
        descriptionFull: 'Aumente um atributo à sua escolha em +1 (até o máximo de 30). Aprimorar Destino: quando você ou outra criatura a até 18m passar ou falhar em um Teste de d20, você pode rolar 2d4 e aplicar o total rolado como bônus ou penalidade ao resultado (1x até rolar Iniciativa ou terminar Descanso Curto/Longo).'
    },
    {
        id: 'boon_of_fortitude',
        name: 'Dádiva da Fortitude (Boon of Fortitude)',
        category: 'Dádiva Épica',
        prerequisite: 'Nível 19+',
        abilityBonusOptions: 'any',
        maxAttributeCap: 30,
        description: '+1 em qualquer atributo (máx. 30). Seus PV Máximos aumentam em +40 e você soma seu mod de CON em curas recebidas (1x/turno).',
        descriptionFull: 'Aumente um atributo à sua escolha em +1 (até o máximo de 30). Saúde Fortificada: seus Pontos de Vida máximos aumentam imediatamente em +40 PV. Além disso, uma vez por turno, sempre que você recuperar Pontos de Vida, pode recuperar PV adicionais iguais ao seu modificador de Constituição.',
        effects: [{ type: 'hp_flat', value: 40 }]
    },
    {
        id: 'boon_of_irresistible_offense',
        name: 'Dádiva da Ofensiva Irresistível (Boon of Irresistible Offense)',
        category: 'Dádiva Épica',
        prerequisite: 'Nível 19+',
        abilityBonusOptions: ['str', 'dex'],
        maxAttributeCap: 30,
        description: '+1 Força ou Destreza (máx. 30). Seus ataques ignoram Resistência física e um 20 natural causa dano extra igual ao valor do atributo!',
        descriptionFull: 'Aumente sua Força ou Destreza em +1 (até o máximo de 30). Superar Defesas: o dano de Concussão, Cortante e Perfurante que você causar sempre ignora Resistência. Golpe Avassalador: ao rolar um 20 natural em uma jogada de ataque, você causa dano extra igual ao valor total do atributo aumentado por este talento.'
    },
    {
        id: 'boon_of_recovery',
        name: 'Dádiva da Recuperação (Boon of Recovery)',
        category: 'Dádiva Épica',
        prerequisite: 'Nível 19+',
        abilityBonusOptions: 'any',
        maxAttributeCap: 30,
        description: '+1 em qualquer atributo (máx. 30). Ao cair a 0 PV, recupera metade dos PV máximos 1x/dia e ganha reserva extra de 10d10 de cura.',
        descriptionFull: 'Aumente um atributo à sua escolha em +1 (até o máximo de 30). Última Resistência: ao ser reduzido a 0 PV, você pode cair para metade dos seus PV máximos (1x por Descanso Longo). Recuperar Vitalidade: você tem uma reserva de dez d10s — como Ação Bônus pode gastar dados dessa reserva para se curar (recarrega em Descanso Longo).'
    },
    {
        id: 'boon_of_skill',
        name: 'Dádiva da Perícia (Boon of Skill)',
        category: 'Dádiva Épica',
        prerequisite: 'Nível 19+',
        abilityBonusOptions: 'any',
        maxAttributeCap: 30,
        description: '+1 em qualquer atributo (máx. 30). Você ganha proficiência em TODAS as perícias do jogo e Especialização em mais 1 perícia!',
        descriptionFull: 'Aumente um atributo à sua escolha em +1 (até o máximo de 30). Adepto Universal: você ganha proficiência em todas as perícias. Especialização: escolha uma perícia para receber Especialização (dobro de proficiência).'
    },
    {
        id: 'boon_of_speed',
        name: 'Dádiva da Velocidade (Boon of Speed)',
        category: 'Dádiva Épica',
        prerequisite: 'Nível 19+',
        abilityBonusOptions: 'any',
        maxAttributeCap: 30,
        description: '+1 em qualquer atributo (máx. 30). Seu deslocamento aumenta em +9 metros e Ação Bônus Desengajar encerra condição Agarrado.',
        descriptionFull: 'Aumente um atributo à sua escolha em +1 (até o máximo de 30). Artista de Fuga: como Ação Bônus, você pode realizar a ação Desengajar, o que também encerra qualquer condição Agarrado sobre você. Rapidez: seu deslocamento aumenta permanentemente em +9 metros (30 pés).',
        effects: [{ type: 'speed', value: 9 }]
    },
    {
        id: 'boon_of_spell_recall',
        name: 'Dádiva da Recordação de Magia (Boon of Spell Recall)',
        category: 'Dádiva Épica',
        prerequisite: 'Nível 19+, Conjuração ou Magia de Pacto',
        abilityBonusOptions: ['int', 'wis', 'cha'],
        maxAttributeCap: 30,
        description: '+1 Int, Sab ou Car (máx. 30). Ao conjurar magia de 1º a 4º círculo, role 1d4: se igualar o círculo da magia, o espaço não é gasto!',
        descriptionFull: 'Aumente sua Inteligência, Sabedoria ou Carisma em +1 (até o máximo de 30). Conjuração Gratuita: sempre que você conjurar uma magia usando um espaço de magia de 1º a 4º círculo, role 1d4. Se o número rolado for igual ao círculo daquele espaço, o espaço de magia não é gasto.'
    },
    {
        id: 'boon_of_the_night_spirit',
        name: 'Dádiva do Espírito da Noite (Boon of the Night Spirit)',
        category: 'Dádiva Épica',
        prerequisite: 'Nível 19+',
        abilityBonusOptions: 'any',
        maxAttributeCap: 30,
        description: '+1 em qualquer atributo (máx. 30). Em penumbra ou escuridão, fica Invisível com Ação Bônus e tem Resistência a quase todo dano!',
        descriptionFull: 'Aumente um atributo à sua escolha em +1 (até o máximo de 30). Fundir-se às Sombras: enquanto estiver em Penumbra ou Escuridão, você pode se tornar Invisível com uma Ação Bônus. Forma Sombria: enquanto estiver em Penumbra ou Escuridão, você tem Resistência a todos os tipos de dano, exceto Psíquico e Radiante.'
    },
    {
        id: 'boon_of_truesight',
        name: 'Dádiva da Visão Verdadeira (Boon of Truesight)',
        category: 'Dádiva Épica',
        prerequisite: 'Nível 19+',
        abilityBonusOptions: 'any',
        maxAttributeCap: 30,
        description: '+1 em qualquer atributo (máx. 30). Você adquire Visão Verdadeira permanente com alcance de 18 metros (60 pés).',
        descriptionFull: 'Aumente um atributo à sua escolha em +1 (até o máximo de 30). Visão Verdadeira: você possui Visão Verdadeira com alcance de 18 metros (60 pés), enxergando na escuridão normal e mágica, criaturas invisíveis, ilusões visuais, metamorfos e no Plano Etéreo.'
    }
];
