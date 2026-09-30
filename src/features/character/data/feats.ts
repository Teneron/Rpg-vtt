
export type FeatEffectType = 'speed' | 'initiative' | 'passive_perception' | 'attribute' | 'hp_per_level';

export interface FeatEffect {
    type: FeatEffectType;
    value: number;
    target?: string; // e.g. 'str', 'wis'
}

export interface Feat {
    id: string;
    name: string;
    description: string;
    prerequisite?: string;
    descriptionFull?: string;
    effects?: FeatEffect[];
}

export const FEATS: Feat[] = [
    {
        id: 'alert',
        name: 'Alerta',
        description: '+5 na Iniciativa. Não pode ser surpreendido enquanto consciente. Outras criaturas não ganham vantagem em ataques contra você por estarem escondidas.',
        descriptionFull: 'Sempre atento ao perigo, você ganha os seguintes benefícios: +5 de bônus na Iniciativa; Você não pode ser surpreendido enquanto estiver consciente; Outras criaturas não ganham vantagem nas jogadas de ataque contra você por não serem vistas por você.',
        effects: [{ type: 'initiative', value: 5 }]
    },
    {
        id: 'athlete',
        name: 'Atleta',
        description: '+1 For ou Des. Levantar-se custa 1.5m. Escalada rápida.',
        descriptionFull: 'Você submeteu-se a extensivo treinamento físico para ganhar os seguintes benefícios: Aumente sua Força ou Destreza em 1, até o máximo de 20; Quando estiver caído, levantar-se requer apenas 1,5 m de deslocamento; Escalar não custa movimento extra; Você pode fazer um salto em distância ou em altura correndo se mover apenas 1,5 m antes do salto.'
        // Attribute choice is manual in Level Up currently, effects here would duplicate or need complex logic. Leaving manual for attributes for now.
    },
    {
        id: 'actor',
        name: 'Ator',
        description: '+1 Car. Vantagem em Deception/Performance para se passar por outro. Mímica.',
        descriptionFull: 'Habilidoso em mímica e dramaturgia, você ganha os seguintes benefícios: Aumente seu valor de Carisma em 1, até o máximo de 20; Você tem vantagem em testes de Carisma (Decepção) e Carisma (Performance) ao tentar se passar por uma pessoa diferente; Você pode imitar a fala de outra pessoa ou os sons feitos por outras criaturas.'
    },
    {
        id: 'charger',
        name: 'Investida',
        description: 'Ao usar Ação de Disparada, pode fazer ataque ou empurrão com Ação Bônus (+5 dano ou empurrão 3m).',
        descriptionFull: 'Quando você usa sua ação para realizar uma Disparada, você pode usar uma ação bônus para fazer um ataque corpo-a-corpo com arma ou empurrar uma criatura. Se você se mover pelo menos 3 metros em linha reta imediatamente antes de realizar essa ação bônus, você ganha +5 de bônus na jogada de dano do ataque (se acertar) ou empurra o alvo até 3 metros de distância de você (se obtiver sucesso).'
    },
    {
        id: 'observant',
        name: 'Observador',
        description: '+1 Int ou Sab. Leitura labial. +5 em Percepção Passiva e Investigação Passiva.',
        descriptionFull: 'Rápido em notar detalhes do seu ambiente, você ganha os seguintes benefícios: Aumente seu valor de Inteligência ou Sabedoria em 1, até o máximo de 20; Se você puder ver a boca de uma criatura enquanto ela fala um idioma que você compreende, você pode interpretar o que ela está dizendo lendo seus lábios; Você tem +5 de bônus nos seus valores passivos de Sabedoria (Percepção) e Inteligência (Investigação).',
        effects: [{ type: 'passive_perception', value: 5 }]
    },
    {
        id: 'grappler',
        name: 'Agarrador',
        description: 'Vantagem em ataques contra quem você agarrou. Pode tentar imobilizar.',
        descriptionFull: 'Você desenvolveu as habilidades necessárias para prender seus oponentes em combate corpo-a-corpo. Você tem vantagem nas jogadas de ataque contra uma criatura que você esteja agarrando. Você pode usar sua ação para tentar imobilizar uma criatura agarrada por você.'
    },
    {
        id: 'healer',
        name: 'Curandeiro',
        description: 'Uso melhorado do Kit de Curandeiro (1d6+4+Nível HP). Estabilizar cura 1 HP.',
        descriptionFull: 'Você é um médico capaz, permitindo que cure ferimentos rapidamente e leve seus aliados de volta a luta. Quando você usa um kit de curandeiro para estabilizar uma criatura morrendo, ela também recupera 1 ponto de vida. Como uma ação, você pode gastar um uso do kit de curandeiro para cuidar de uma criatura e restaurar 1d6 + 4 pontos de vida, mais um número de pontos de vida igual ao número máximo de Dados de Vida da criatura. A criatura não pode recuperar pontos de vida dessa forma novamente até terminar um descanso curto ou longo.'
    },
    {
        id: 'keen_mind',
        name: 'Mente Afiada',
        description: '+1 Int. Sempre sabe o norte, horas e lembra tudo do último mês.',
        descriptionFull: 'Você tem uma mente que pode rastrear o tempo, direção e detalhes com precisão misteriosa. Você ganha os seguintes benefícios: Aumente seu valor de Inteligência em 1, até o máximo de 20; Você sempre sabe a direção do norte; Você sempre sabe o número de horas que faltam para o próximo nascer ou pôr do sol; Você pode relembrar com precisão qualquer coisa que tenha visto ou ouvido no último mês.'
    },
    {
        id: 'lucky',
        name: 'Sortudo',
        description: '3 pontos de sorte por dia para rolar d20 extra ou fazer inimigo rolar de novo.',
        descriptionFull: 'Você tem uma sorte inexplicável que parece surgir nos momentos exatos. Você tem 3 pontos de sorte. Sempre que realizar uma jogada de ataque, um teste de habilidade ou um teste de resistência, você pode gastar um ponto de sorte para rolar um d20 adicional. Você pode escolher gastar um de seus pontos de sorte depois de rolar o dado, mas antes de saber o resultado da jogada. Você escolhe qual dos d20s irá usar para a jogada de ataque, teste de habilidade ou teste de resistência. Você também pode gastar um ponto de sorte quando uma jogada de ataque for feita contra você. Role um d20 e, então, escolha se o ataque usará a jogada do atacante ou a sua. Se mais de uma criatura gastar um ponto de sorte para influenciar o resultado de uma jogada, os pontos se cancelam; nenhum dado adicional é rolado. Você recupera seus pontos de sorte gastos após terminar um descanso longo.'
    },
    {
        id: 'mobile',
        name: 'Móvel',
        description: '+3m deslocamento. Dash em terreno difícil não custa extra. Ataque impede oportunidade.',
        descriptionFull: 'Você é excepcionalmente rápido e ágil. Você ganha os seguintes benefícios: Seu deslocamento aumenta em 3 metros; Quando você usa a ação de Disparada, terreno difícil não custa movimento extra neste turno; Quando você realiza um ataque corpo-a-corpo contra uma criatura, você não provoca ataques de oportunidade dessa criatura pelo resto do turno, independente de ter acertado ou não.',
        effects: [{ type: 'speed', value: 3 }]
    },
    {
        id: 'sharpshooter',
        name: 'Franco-Atirador',
        description: 'Ignora cobertura 1/2 e 3/4. Alcance longo sem desvantagem. -5 hit / +10 dano.',
        descriptionFull: 'Você dominou o uso de armas à distância e pode realizar tiros que outros consideram impossíveis. Atacar com alcance longo não impõe desvantagem nas suas jogadas de ataque com arma à distância. Seus ataques com armas à distância ignoram meia cobertura e três quartos de cobertura. Antes de realizar um ataque com uma arma à distância na qual você seja proficiente, você pode escolher sofrer –5 de penalidade na jogada de ataque. Se o ataque acertar, você adiciona +10 no dano do ataque.'
    },
    {
        id: 'tavern_brawler',
        name: 'Brigão de Taverna',
        description: '+1 For ou Con. Proficiência armas improvisadas/desarmado (1d4). Agarrar com bônus.',
        descriptionFull: 'Acostumado a pancadarias, você espera o inesperado. Aumente seu valor de Força ou Constituição em 1, até o máximo de 20. Você é proficiente com armas improvisadas e golpes desarmados. Seu golpe desarmado causa 1d4 de dano. Quando você acerta uma criatura com um golpe desarmado ou arma improvisada no seu turno, você pode usar uma ação bônus para tentar agarrar o alvo.'
    },
    {
        id: 'tough',
        name: 'Resistente',
        description: '+2 HP por nível.',
        descriptionFull: 'Sua pele é dura como couro e você aguenta pancadas que derrubariam outros. Seus pontos de vida máximos aumentam em uma quantidade igual a duas vezes seu nível quando você adquire esse talento. Toda vez que você ganhar um nível após isso, seus pontos de vida máximos aumentam em 2 pontos de vida adicionais.',
        effects: [{ type: 'hp_per_level', value: 2 }]
    },
    {
        id: 'warcaster',
        name: 'Conjurador de Guerra',
        description: 'Vantagem em Con Save para concentração. Somático com armas na mão. Magia como oportunidade.',
        descriptionFull: 'Você praticou a conjuração de magias no meio do combate, aprendendo técnicas que concedem os seguintes benefícios: Você tem vantagem em testes de resistência de Constituição para manter sua concentração em uma magia quando você sofrer dano; Você pode realizar os componentes somáticos de magias mesmo quando estiver com armas ou um escudo em uma ou ambas as mãos; Quando o movimento de uma criatura hostil provocar um ataque de oportunidade para você, você pode usar sua reação para conjurar uma magia na criatura, ao invés de realizar um ataque de oportunidade. A magia deve ter tempo de conjuração de 1 ação e deve ter apenas a criatura como alvo.'
    },
    {
        id: 'great_weapon_master',
        name: 'Mestre de Armas Grandes',
        description: 'Crítico/abate dá ataque extra. -5 hit / +10 dano com armas pesadas.',
        descriptionFull: 'Você aprendeu a usar o peso de uma arma em sua vantagem, deixando seu balanço ganhar inércia para potencializar seus golpes. No seu turno, quando você realizar um acerto crítico com uma arma corpo-a-corpo ou reduzir os pontos de vida de uma criatura a 0 com um, você pode realizar um ataque com arma corpo-a-corpo como uma ação bônus. Antes de realizar um ataque corpo-a-corpo com uma arma pesada na qual você seja proficiente, você pode escolher sofrer –5 de penalidade na jogada de ataque. Se o ataque acertar, você adiciona +10 no dano do ataque.'
    },
    {
        id: 'sentinel',
        name: 'Sentinela',
        description: 'Ataque de oportunidade reduz velocidade a 0. Ataca quem desengaja. Reação contra quem ataca aliado.',
        descriptionFull: 'Você dominou técnicas para ganhar vantagem sempre que qualquer inimigo baixar a guarda, ganhando os seguintes benefícios: Quando você atinge uma criatura com um ataque de oportunidade, o deslocamento da criatura se torna 0 pelo resto do turno; As criaturas provocam ataques de oportunidade de você mesmo se realizarem a ação de Desengajar antes de sair do seu alcance; Quando uma criatura, a até 1,5 metro de você, realizar um ataque contra um alvo diferente de você (e o alvo não possuir esse talento), você pode usar sua reação para realizar um ataque com arma corpo-a-corpo contra a criatura atacante.'
    },
    {
        id: 'polearm_master',
        name: 'Mestre de Armas de Haste',
        description: 'Ataque extra com cabo (1d4). Oportunidade ao entrar no alcance.',
        descriptionFull: 'Você pode manter seus inimigos à distância com armas de longo alcance. Quando você realizar a ação de Ataque e atacar com apenas uma glaive, alabarda, bordão ou lança, você pode usar uma ação bônus para realizar um ataque corpo-a-corpo com a outra ponta da arma. Esse ataque usa o mesmo modificador de habilidade do ataque primário. O dado de dano da arma para esse ataque é um d4, e o ataque causa dano de concussão. Enquanto você estiver empunhando uma glaive, alabarda, pique, bordão ou lança, outras criaturas provocam um ataque de oportunidade de você quando entrarem no seu alcance.'
    },
    {
        id: 'resilient',
        name: 'Resiliente',
        description: '+1 em um atributo e ganha proficiência no teste de resistência dele.',
        descriptionFull: 'Escolha um valor de habilidade. Você ganha os seguintes benefícios: Aumente o valor de habilidade escolhido em 1, até o máximo de 20; Você ganha proficiência em testes de resistência usando a habilidade escolhida.'
    },
    {
        id: 'ritual_caster',
        name: 'Conjurador de Ritual',
        description: 'Aprende 2 rituais de uma classe. Pode copiar novos rituais.',
        descriptionFull: 'Você aprendeu um número de magias que pode conjurar como rituais. Essas magias são escritas em um livro de rituais, o qual você deve ter em mãos para conjurar uma de suas magias. Ao adquirir esse talento, você adquire um livro de rituais contendo duas magias de 1° nível, à sua escolha. (Ver regras completas de rituais).'
    },
    {
        id: 'shield_master',
        name: 'Mestre de Escudos',
        description: 'Empurrão com bônus. Bônus de escudo em Dex Save. Reação para anular dano em Dex Save.',
        descriptionFull: 'Você usa escudos não apenas para proteção, mas também para ataque. Você ganha os seguintes benefícios enquanto estiver empunhando um escudo: Se você realizar a ação de Ataque no seu turno, você pode usar uma ação bônus para tentar empurrar uma criatura, a até 1,5 metro de você, com seu escudo; Se você não estiver incapacitado, você pode adicionar seu bônus de escudo em qualquer teste de resistência de Destreza que você fizer contra uma magia ou outro efeito nocivo que tenha você como alvo; Se você for alvo de um efeito que permita um teste de resistência de Destreza para sofrer metade do dano, você pode usar sua reação para não sofrer dano se passar no teste de resistência, interpondo seu escudo entre você e a fonte do efeito.'
    }
];
