export type FeatEffectType = 'speed' | 'initiative' | 'passive_perception' | 'attribute' | 'hp_per_level';

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
}

export const FEATS: Feat[] = [
    // =========================================================================
    // TALENTOS DE ORIGEM (1º NÍVEL - D&D 2024)
    // =========================================================================
    {
        id: 'alert',
        name: 'Alerta (Alert)',
        category: 'Origem',
        description: '+Bônus de Proficiência na Iniciativa. Pode trocar o valor de iniciativa com um aliado disposto no início do combate.',
        descriptionFull: 'Sempre atento ao perigo, você ganha os seguintes benefícios: Você adiciona seu Bônus de Proficiência à sua jogada de Iniciativa; Imediatamente após jogar a Iniciativa no início de um combate, você pode trocar o seu valor de iniciativa com o valor de um aliado voluntário no mesmo combate.',
        effects: [{ type: 'initiative', value: 2 }]
    },
    {
        id: 'crafter',
        name: 'Artifista (Crafter)',
        category: 'Origem',
        description: 'Proficiência com 3 Ferramentas de Artesão. 20% de desconto em itens não mágicos. Fabrica itens rápidos em descanso longo.',
        descriptionFull: 'Você adquire proficiência com três Ferramentas de Artesão à sua escolha. Sempre que comprar um item não mágico, recebe 20% de desconto. Ao terminar um Descanso Longo, pode fabricar um item não mágico da tabela de Fabricação Rápida.'
    },
    {
        id: 'savage_attacker',
        name: 'Atacante Selvagem (Savage Attacker)',
        category: 'Origem',
        description: 'Uma vez por turno ao acertar com uma arma, você pode rolar o dano duas vezes e escolher o maior resultado.',
        descriptionFull: 'Uma vez por turno, ao atingir um alvo com uma arma, você pode rolar os dados de dano da arma duas vezes e escolher qualquer um dos dois resultados.'
    },
    {
        id: 'healer',
        name: 'Curandeiro (Healer)',
        category: 'Origem',
        description: 'Rerrola qualquer 1 em dados de cura. Pode gastar kit de curandeiro para restaurar 1d4 + PB + Dado de Vida de um aliado.',
        descriptionFull: 'Tendo um Kit de Curandeiro, você pode gastar um uso dele como uma ação Usar Objeto em uma criatura a até 1,5 metro: a criatura pode gastar um de seus Dados de Vida e recupera PVs iguais ao resultado rolado + seu PB. Além disso, sempre que você rolar um dado para recuperar PV, se o resultado for 1, você pode jogá-lo novamente.'
    },
    {
        id: 'skilled',
        name: 'Habilidoso (Skilled)',
        category: 'Origem',
        description: 'Ganha proficiência imediata em quaisquer 3 perícias ou ferramentas à sua escolha.',
        descriptionFull: 'Você adquire proficiência em qualquer combinação de três perícias ou ferramentas à sua escolha. Pode ser adquirido múltiplas vezes.'
    },
    {
        id: 'magic_initiate',
        name: 'Iniciado em Magia (Magic Initiate)',
        category: 'Origem',
        description: 'Aprende 2 truques e 1 magia de 1º círculo de Clérigo, Druida ou Mago. Conjura a magia 1x grátis por Descanso Longo.',
        descriptionFull: 'Você aprende dois truques e uma magia de 1º círculo à sua escolha da lista de Clérigo, Druida ou Mago. O atributo de conjuração é Int, Sab ou Car. Você tem a magia sempre preparada e pode conjurá-la uma vez sem gastar espaço por Descanso Longo, ou usando seus próprios espaços normais.'
    },
    {
        id: 'musician',
        name: 'Músico (Musician)',
        category: 'Origem',
        description: 'Proficiência em 3 instrumentos musicais. Ao terminar descanso curto ou longo, concede Inspiração Heroica a aliados.',
        descriptionFull: 'Você ganha proficiência com três Instrumentos Musicais. Ao completar um Descanso Curto ou Longo, você pode tocar uma canção em um instrumento proficiente e conceder Inspiração Heroica para um número de aliados igual ao seu Bônus de Proficiência.'
    },
    {
        id: 'lucky',
        name: 'Sortudo (Lucky)',
        category: 'Origem',
        description: 'Pontos de Sorte iguais ao PB. Gaste 1 ponto para ter Vantagem em teste d20 ou impor Desvantagem em ataque inimigo.',
        descriptionFull: 'Você possui uma reserva de Pontos de Sorte igual ao seu Bônus de Proficiência. Gaste 1 ponto para ganhar Vantagem em uma jogada de d20 ou para impor Desvantagem em um ataque contra você. Recupera todos em Descanso Longo.'
    },
    {
        id: 'tavern_brawler',
        name: 'Valentão de Taverna (Tavern Brawler)',
        category: 'Origem',
        description: 'Dano desarmado 1d4 + Força. Rerrola 1s no dano. Proficiência em armas improvisadas. Empurra alvo 1,5m em acerto.',
        descriptionFull: 'O dano do seu Ataque Desarmado torna-se 1d4 + Mod. de Força. Sempre que rolar 1 em dano desarmado, pode rolar novamente. Proficiência com armas improvisadas. Uma vez por turno ao acertar com ataque desarmado na ação Atacar, pode empurrar o alvo 1,5m.'
    },
    {
        id: 'tough',
        name: 'Vigoroso (Tough)',
        category: 'Origem',
        description: '+2 PV por nível do personagem retroativamente e a cada novo nível ganho.',
        descriptionFull: 'Seus pontos de vida máximos aumentam em uma quantidade igual a duas vezes seu nível quando você adquire esse talento. Toda vez que você ganhar um nível após isso, seus pontos de vida máximos aumentam em 2 pontos de vida adicionais.',
        effects: [{ type: 'hp_per_level', value: 2 }]
    },

    // =========================================================================
    // TALENTOS GERAIS (4º NÍVEL+)
    // =========================================================================
    {
        id: 'war_caster',
        name: 'Conjurador Bélico (War Caster)',
        category: 'Geral',
        prerequisite: 'Nível 4+, Conjuração',
        description: 'Vantagem em Con Save para concentração. Somático com armas na mão. Reação para conjurar magia em oportunidade.',
        descriptionFull: 'Vantagem em testes de resistência de Constituição para manter concentração ao sofrer dano; pode realizar componentes somáticos com armas ou escudo nas mãos; pode conjurar uma magia como Reação em vez de ataque de oportunidade.'
    },
    {
        id: 'great_weapon_master',
        name: 'Mestre em Armas Grandes',
        category: 'Geral',
        prerequisite: 'Nível 4+, Força 13+',
        description: 'Soma PB no dano de armas pesadas. Ataque extra com Ação Bônus ao abater ou obter acerto crítico.',
        descriptionFull: 'Ao acertar um ataque com arma Pesada proficiente na ação Atacar, soma seu Bônus de Proficiência no dano. Ao realizar um acerto crítico ou reduzir criatura a 0 PV, pode fazer um ataque corpo a corpo como Ação Bônus.'
    },
    {
        id: 'sentinel',
        name: 'Sentinela (Sentinel)',
        category: 'Geral',
        prerequisite: 'Nível 4+, Força ou Destreza 13+',
        description: 'Ataque de oportunidade reduz velocidade a 0. Ataca quem desengaja. Reação para golpear quem ataca aliado adjacente.',
        descriptionFull: 'Acerto de oportunidade reduz deslocamento a 0; inimigos provocam oportunidade mesmo ao Desengajar; Reação para atacar inimigo que golpeia aliado a até 1,5m.'
    },
    {
        id: 'polearm_master',
        name: 'Mestre em Armas de Haste',
        category: 'Geral',
        prerequisite: 'Nível 4+, Força ou Destreza 13+',
        description: 'Ataque com a coronha como Ação Bônus (1d4). Provoca ataque de oportunidade quando o inimigo entra no alcance.',
        descriptionFull: 'Ao atacar com glaive, alabarda, bordão ou lança, pode usar Ação Bônus para atacar com a outra ponta (1d4 dano). Inimigos provocam ataque de oportunidade ao entrarem no seu alcance.'
    },
    {
        id: 'shield_master',
        name: 'Mestre em Escudos',
        category: 'Geral',
        prerequisite: 'Nível 4+, Escudos',
        description: 'Golpe com escudo empurra 1,5m ou derruba caído. Interpor escudo anula dano em salvaguarda de Destreza.',
        descriptionFull: 'Ao acertar na ação Atacar empunhando escudo, pode forçar o alvo a salvar Força ou ser empurrado 1,5m / derrubado Caído. Soma CA do escudo em Dex saves contra efeitos de alvo único. Reação para não sofrer dano em sucesso de Dex save.'
    },
    {
        id: 'sharpshooter',
        name: 'Mestre-Atirador (Sharpshooter)',
        category: 'Geral',
        prerequisite: 'Nível 4+, Destreza 13+',
        description: 'Ignora desvantagem de alcance longo. Ignora meia cobertura e três quartos. Não tem desvantagem corpo a corpo.',
        descriptionFull: 'Ataques à distância ignoram desvantagem por alcance longo; ignoram meia cobertura e cobertura de três quartos; e atirar enquanto adjacente a inimigos não impõe desvantagem.'
    },
    {
        id: 'resilient',
        name: 'Resiliente (Resilient)',
        category: 'Geral',
        prerequisite: 'Nível 4+',
        description: '+1 em um atributo à sua escolha e ganha proficiência na salvaguarda desse atributo.',
        descriptionFull: 'Aumente um atributo em 1 (até o máximo de 20). Você ganha proficiência nas Salvaguardas que utilizam o atributo escolhido.'
    }
];
