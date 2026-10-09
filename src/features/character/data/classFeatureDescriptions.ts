// Compêndio de Descrições de Características de Classe - D&D 5.5e & The Witcher
// Textos detalhados e oficiais para consulta interativa na Tabela de Progressão

export interface FeatureRuleInfo {
    name: string;
    type?: 'action' | 'bonus_action' | 'reaction' | 'passive';
    description: string;
}

export const CLASS_FEATURE_DESCRIPTIONS: Record<string, FeatureRuleInfo> = {
    // =========================================================================
    // CARACTERÍSTICAS UNIVERSAIS / GERAIS
    // =========================================================================
    'Aumento no Valor de Atributo (ASI / Talento)': {
        name: 'Aumento no Valor de Atributo (ASI / Talento)',
        type: 'passive',
        description: 'Você ganha a característica Aumento no Valor de Atributo ou pode escolher um Talento Geral à sua escolha. Se escolher o aumento de atributos, você pode aumentar um atributo à sua escolha em 2, ou dois atributos em 1, até o máximo de 20.'
    },
    'Dádiva Épica (Epic Boon)': {
        name: 'Dádiva Épica (Epic Boon)',
        type: 'passive',
        description: 'No 19º nível, você atinge o pináculo de poder mítico. Você escolhe um Talento de Dádiva Épica (Epic Boon) do Livro do Jogador (como Dádiva da Recuperação, Destreza Irresistível, Vontade Indomável ou Maestria Dimensional), aumentando um atributo em +1 (até o máximo de 30) e ganhando poderes cósmicos.'
    },
    'Característica de Subclasse': {
        name: 'Característica de Subclasse',
        type: 'passive',
        description: 'Você desbloqueia uma nova habilidade concedida pelo arquétipo ou caminho da sua subclasse escolhida.'
    },
    'Ataque Extra': {
        name: 'Ataque Extra',
        type: 'passive',
        description: 'Você pode atacar duas vezes em vez de uma sempre que realizar a ação Atacar no seu turno.'
    },
    'Dois Ataques Extras': {
        name: 'Dois Ataques Extras',
        type: 'passive',
        description: 'Você pode atacar três vezes em vez de uma sempre que realizar a ação Atacar no seu turno.'
    },
    'Três Ataques Extras': {
        name: 'Três Ataques Extras',
        type: 'passive',
        description: 'Você pode atacar quatro vezes sempre que realizar a ação Atacar no seu turno.'
    },
    'Maestria em Arma': {
        name: 'Maestria em Armas',
        type: 'passive',
        description: 'Seu treinamento rigoroso permite desbloquear as propriedades de Maestria das armas (Cleave, Graze, Nick, Push, Sap, Slow, Topple, Vex). Ao completar um Descanso Longo, você pode praticar e trocar os tipos de armas cuja maestria você domina.'
    },
    'Especialista': {
        name: 'Especialista (Expertise)',
        type: 'passive',
        description: 'Escolha duas de suas perícias em que você tem proficiência. Seu bônus de proficiência é DOBRADO para qualquer teste de atributo que use qualquer uma das perícias escolhidas.'
    },
    'Especialização': {
        name: 'Especialização (Expertise)',
        type: 'passive',
        description: 'Escolha duas perícias adicionais nas quais você possui proficiência. O seu bônus de proficiência é duplicado para qualquer teste de atributo com essas perícias.'
    },
    'Estilo de Luta': {
        name: 'Estilo de Luta',
        type: 'passive',
        description: 'Você adota um estilo particular de combate como sua especialidade (Arquearia, Combate com Duas Armas, Defesa, Duelo, Grande Arma ou Proteção). O estilo concede bônus permanentes em combate.'
    },

    // =========================================================================
    // BÁRBARO
    // =========================================================================
    'Fúria': {
        name: 'Fúria (Rage)',
        type: 'bonus_action',
        description: 'Como Ação Bônus, você entra em um transe de fúria primal por 10 minutos. Você ganha Vantagem em testes e salvaguardas de Força, bônus numérico de Dano de Fúria em ataques com Força, e Resistência contra danos de Concussão, Cortante e Perfurante. A fúria é mantida desferindo ataques, sofrendo dano ou gastando uma Ação Bônus para prolongá-la.'
    },
    'Defesa sem Armadura': {
        name: 'Defesa sem Armadura',
        type: 'passive',
        description: 'Enquanto você não estiver usando nenhuma armadura, sua Classe de Armadura (CA) é igual a 10 + Modificador de Destreza + Modificador de Constituição. Você ainda pode usar um escudo e manter este benefício.'
    },
    'Ataque Imprudente': {
        name: 'Ataque Imprudente (Reckless Attack)',
        type: 'action',
        description: 'Ao fazer o primeiro ataque corpo a corpo do seu turno, você pode descartar a cautela e atacar com imprudência. Você ganha VANTAGEM em todas as jogadas de ataque corpo a corpo usando Força neste turno, mas jogadas de ataque contra você ganham Vantagem até o início do seu próximo turno.'
    },
    'Sentido de Perigo': {
        name: 'Sentido de Perigo (Danger Sense)',
        type: 'passive',
        description: 'Você adquire uma sensibilidade sobrenatural contra armadilhas e perigos iminentes. Você tem Vantagem em salvaguardas de Destreza, desde que não esteja na condição Incapacitado.'
    },
    'Conhecimento Primordial': {
        name: 'Conhecimento Primordial (Primal Knowledge)',
        type: 'passive',
        description: 'Você ganha proficiência em mais uma perícia de bárbaro. Além disso, enquanto estiver em Fúria, você pode canalizar sua força bruta para testes de perícia: sempre que fizer testes de Acrobacia, Intimidação, Percepção, Furtividade ou Sobrevivência, você pode rolar usando FORÇA em vez do atributo comum.'
    },
    'Movimento Rápido': {
        name: 'Movimento Rápido',
        type: 'passive',
        description: 'Seu deslocamento de caminhada aumenta em +3 metros (10 pés) enquanto você não estiver vestindo armadura pesada.'
    },
    'Bote Instintivo': {
        name: 'Bote Instintivo (Instinctive Pounce)',
        type: 'passive',
        description: 'Como parte da Ação Bônus usada para entrar em Fúria, você pode se mover até metade do seu deslocamento imediatamente.'
    },
    'Instintos Primitivos': {
        name: 'Instintos Primitivos (Feral Instinct)',
        type: 'passive',
        description: 'Seus instintos são tão aguçados que você tem Vantagem em jogadas de Iniciativa. Além disso, se você for Surpreendido no início do combate, pode agir normalmente se entrar em Fúria no primeiro turno antes de fazer qualquer outra coisa.'
    },
    'Golpe Brutal': {
        name: 'Golpe Brutal (Brutal Strike)',
        type: 'action',
        description: 'Se você usar Ataque Imprudente, pode abdicar da Vantagem no ataque para desferir um Golpe Brutal. Se acertar, causa +1d10 de dano extra e pode aplicar um efeito tático: Quebrar Armadura (-2 CA no alvo), Empurrão Agressivo (empurra 4,5m) ou Atordoamento Leve (reduz deslocamento em 4,5m).'
    },
    'Fúria Implacável': {
        name: 'Fúria Implacável (Relentless Rage)',
        type: 'passive',
        description: 'Sua fúria o impede de cair. Se você cair a 0 pontos de vida enquanto estiver em fúria e não morrer imediatamente, pode fazer uma salvaguarda de Constituição CD 10. Se passar, seus pontos de vida caem para uma quantidade igual ao dobro do seu nível de bárbaro. A CD aumenta em +5 a cada uso subsequente antes de um Descanso Curto ou Longo.'
    },
    'Golpe Brutal Fortalecido': {
        name: 'Golpe Brutal Fortalecido',
        type: 'passive',
        description: 'O dano extra do seu Golpe Brutal aumenta para +2d10 e você ganha novos efeitos de controle de grupo devastadores.'
    },
    'Fúria Persistente': {
        name: 'Fúria Persistente (Persistent Rage)',
        type: 'passive',
        description: 'Sua Fúria se torna tão feroz que dura os 10 minutos inteiros sem precisar de ataques ou dano para ser mantida. Ela só termina prematuramente se você cair inconsciente ou decidir encerrá-la voluntariamente.'
    },
    'Força Indomável': {
        name: 'Força Indomável (Indomitable Might)',
        type: 'passive',
        description: 'Se o resultado total de qualquer teste de Força ou salvaguarda de Força for inferior ao seu valor de Força, você pode usar seu valor de atributo no lugar do resultado da rolagem.'
    },
    'Campeão Primitivo': {
        name: 'Campeão Primitivo (Primal Champion)',
        type: 'passive',
        description: 'Você incorpora os espíritos e titãs do mundo primordial. Seus valores de FORÇA e CONSTITUIÇÃO aumentam em +4 cada, e seu valor máximo para ambos os atributos agora é 25!'
    },

    // =========================================================================
    // GUERREIRO
    // =========================================================================
    'Recuperar Fôlego': {
        name: 'Retomar o Fôlego (Second Wind)',
        type: 'bonus_action',
        description: 'Como Ação Bônus, você recupera 1d10 + nível de guerreiro em pontos de vida. No D&D 5.5e, você ganha múltiplos usos por Descanso Longo (2 no nível 1 até 4 no nível 10), e recupera 1 uso a cada Descanso Curto.'
    },
    'Mente Tática': {
        name: 'Mente Tática (Tactical Mind)',
        type: 'reaction',
        description: 'Quando você falha em qualquer teste de perícia, pode gastar um uso de Retomar o Fôlego para rolar 1d10 e somar ao resultado. Se ainda assim falhar, o uso de Retomar o Fôlego NÃO é consumido!'
    },
    'Surto de Ação': {
        name: 'Surto de Ação (Action Surge)',
        type: 'action',
        description: 'Você ultrapassa seus limites físicos normais por um instante. No seu turno, você pode realizar uma AÇÃO adicional além da sua ação normal. Recarrega com Descanso Curto ou Longo (ganha 2 usos no 17º nível).'
    },
    'Ajuste Tático': {
        name: 'Ajuste Tático (Tactical Shift)',
        type: 'passive',
        description: 'Sempre que você ativa seu Retomar o Fôlego, pode se mover até metade do seu deslocamento sem provocar nenhum ataque de oportunidade.'
    },
    'Indomável': {
        name: 'Indomável (Indomitable)',
        type: 'reaction',
        description: 'Se falhar em uma salvaguarda, você pode refazer o teste somando o seu NÍVEL DE GUERREIRO ao novo resultado! Isso transforma quase qualquer falha crítica em sucesso absoluto. Recarrega com Descanso Longo.'
    },
    'Mestre Tático': {
        name: 'Mestre Tático (Tactical Master)',
        type: 'passive',
        description: 'Ao atacar com uma arma marcial com maestria, você pode substituir a propriedade de maestria padrão dela por Push (empurrar), Sap (desvantagem no ataque do alvo) ou Slow (reduzir deslocamento em 3m).'
    },
    'Ataques Estudados': {
        name: 'Ataques Estudados (Studied Attacks)',
        type: 'passive',
        description: 'Se errar uma jogada de ataque contra uma criatura, você estuda seus movimentos: sua PRÓXIMA jogada de ataque contra ela antes do final do seu próximo turno tem VANTAGEM!'
    },

    // =========================================================================
    // LADINO
    // =========================================================================
    'Ataque Furtivo': {
        name: 'Ataque Furtivo (Sneak Attack)',
        type: 'passive',
        description: 'Uma vez por turno, você pode causar dano adicional (1d6 até 10d6) a uma criatura atingida por arma com Acuidade ou à distância, se tiver Vantagem na jogada ou se outro inimigo do alvo estiver a 1,5m dele e você não estiver em desvantagem.'
    },
    'Gíria dos Ladrões': {
        name: 'Gíria dos Ladrões (Thieves\' Cant)',
        type: 'passive',
        description: 'Você aprendeu a linguagem secreta dos submundo, símbolos entalhados em paredes e códigos gestuais que transmitem mensagens ocultas.'
    },
    'Ação Ardilosa': {
        name: 'Ação Ardilosa (Cunning Action)',
        type: 'bonus_action',
        description: 'Sua agilidade mental permite agir num piscar de olhos. Você pode realizar a ação Disparada (Dash), Desengajar (Disengage) ou Esconder-se (Hide) como AÇÃO BÔNUS em cada um dos seus turnos.'
    },
    'Mira Firme': {
        name: 'Mira Firme (Steady Aim)',
        type: 'bonus_action',
        description: 'Como Ação Bônus, você ganha Vantagem na sua próxima jogada de ataque neste turno, contanto que não tenha se movido neste turno e reduza seu deslocamento para 0 até o final do turno.'
    },
    'Esquiva Sobrenatural': {
        name: 'Esquiva Sobrenatural (Uncanny Dodge)',
        type: 'reaction',
        description: 'Quando um atacante que você pode ver atinge você com um ataque, você pode usar sua REAÇÃO para reduzir o dano daquele ataque pela METADE.'
    },
    'Golpe Astuto': {
        name: 'Golpe Astuto (Cunning Strike)',
        type: 'action',
        description: 'No D&D 5.5e, ao acertar um Ataque Furtivo, você pode abrir mão de dados de dano furtivo para infligir efeitos adicionais sem teste resistido: Desarmar (sacrifica 1d6), Envenenar com desvantagem (sacrifica 1d6) ou Derrubar Caído (sacrifica 1d6).'
    },
    'Evasão': {
        name: 'Evasão (Evasion)',
        type: 'passive',
        description: 'Quando você for alvo de um efeito que exija uma salvaguarda de Destreza para sofrer metade do dano (como uma Bola de Fogo ou sopro de dragão), você não sofre nenhum dano se tiver sucesso, e apenas metade se falhar.'
    },
    'Talento Confiável': {
        name: 'Talento Confiável (Reliable Talent)',
        type: 'passive',
        description: 'Sempre que você realizar um teste de atributo que use uma perícia na qual você é proficiente, qualquer resultado no d20 igual a 9 ou menor se torna automaticamente um 10!'
    },
    'Golpe Astuto Aprimorado': {
        name: 'Golpe Astuto Aprimorado',
        type: 'passive',
        description: 'Você pode aplicar até DOIS efeitos de Golpe Astuto no mesmo ataque furtivo, distribuindo o custo em dados de furtivo.'
    },
    'Golpes Sujos': {
        name: 'Golpes Sujos (Devious Strikes)',
        type: 'passive',
        description: 'Novas opções letais para Golpe Astuto: Atordoar o alvo até o próximo turno (sacrifica 3d6), Cegar (sacrifica 2d6) ou Nocautear Inconsciente (sacrifica 6d6).'
    },
    'Mente Escorregadia': {
        name: 'Mente Escorregadia (Slippery Mind)',
        type: 'passive',
        description: 'Sua agilidade mental se torna quase impossível de dominar. Você ganha proficiência em salvaguardas de SABEDORIA e CARISMA.'
    },
    'Elusivo': {
        name: 'Elusivo (Elusive)',
        type: 'passive',
        description: 'Você é tão escorregadio em combate que nenhuma jogada de ataque contra você pode ter Vantagem, a menos que você esteja com a condição Incapacitado.'
    },
    'Golpe de Sorte': {
        name: 'Golpe de Sorte (Stroke of Luck)',
        type: 'passive',
        description: 'Se você errar uma jogada de ataque ou falhar em qualquer teste de d20, pode transformar o resultado em um 20 natural ou sucesso automático! Recarrega com Descanso Curto ou Longo.'
    },

    // =========================================================================
    // BARDO
    // =========================================================================
    'Inspiração de Bardo': {
        name: 'Inspiração de Bardo (Bardic Inspiration)',
        type: 'bonus_action',
        description: 'Como Ação Bônus, você concede um Dado de Inspiração (d6 até d12) a um aliado a até 18 metros. Nos próximos 10 minutos, o aliado pode somar esse dado a um teste de atributo, jogada de ataque, salvaguarda ou (no D&D 5.5e) cura recebida imediatamente como Reação.'
    },
    'Pau pra Toda Obra': {
        name: 'Pau pra Toda Obra (Jack of All Trades)',
        type: 'passive',
        description: 'Você pode somar metade do seu bônus de proficiência (arredondado para baixo) a qualquer teste de atributo que você realize e que ainda não inclua seu bônus de proficiência (incluindo testes de Iniciativa!).'
    },
    'Fonte de Inspiração': {
        name: 'Fonte de Inspiração (Font of Inspiration)',
        type: 'passive',
        description: 'Você agora recupera todos os seus usos de Inspiração de Bardo após completar tanto um Descanso Curto quanto um Descanso Longo.'
    },
    'Contra-Encantamento': {
        name: 'Contra-Encantamento (Countercharm)',
        type: 'reaction',
        description: 'Quando você ou um aliado a até 9 metros falha em uma salvaguarda contra efeito de Encantamento ou Medo, você pode usar sua REAÇÃO para permitir que a criatura repita o teste com Vantagem imediatamente.'
    },
    'Segredos Mágicos': {
        name: 'Segredos Mágicos (Magical Secrets)',
        type: 'passive',
        description: 'Sua maestria transcende as tradições. Você pode escolher magias preparadas das listas de magias de CLÉRIGO, DRUIDA e MAGO sempre que trocar ou preparar magias de bardo, tratando-as todas como magias de bardo!'
    },
    'Inspiração Superior': {
        name: 'Inspiração Superior (Superior Inspiration)',
        type: 'passive',
        description: 'Ao rolar Iniciativa, se você tiver menos de dois usos de Inspiração de Bardo restantes, você recupera usos imediatamente até ter dois disponíveis.'
    },
    'Palavras de Criação': {
        name: 'Palavras de Criação (Words of Creation)',
        type: 'passive',
        description: 'Você domina as palavras fundamentais que moldaram o multiverso. Sempre que conjurar magias de cura ou dano, pode gastar Inspiração para maximizar todos os dados rolados.'
    },

    // =========================================================================
    // BRUXO
    // =========================================================================
    'Invocações Místicas': {
        name: 'Invocações Místicas (Eldritch Invocations)',
        type: 'passive',
        description: 'Fragmentos de conhecimento arcano proibido que conferem habilidades mágicas permanentes (como Rajada Agonizante, Visão Diabólica, Armadura de Sombras ou Pactos da Lâmina, Tomo e Corrente agora como invocações).'
    },
    'Magia de Pacto': {
        name: 'Magia de Pacto (Pact Magic)',
        type: 'passive',
        description: 'Seus espaços de magia são limitados (1 a 4), mas SEMPRE conjurados no nível mais alto possível (até 5º círculo) e RECARREGAM COMPLETAMENTE em Descanso Curto!'
    },
    'Astúcia Mágica': {
        name: 'Astúcia Mágica (Magical Cunning)',
        type: 'action',
        description: 'Você pode realizar um ritual rápido de 1 minuto em contato com seu patrono para recuperar metade dos seus espaços de pacto gastos (arredondado para cima) sem precisar de descanso! 1x por Descanso Longo.'
    },
    'Contatar Patrono': {
        name: 'Contatar Patrono (Contact Patron)',
        type: 'action',
        description: 'Você pode conjurar a magia Contatar Outro Plano sem gastar espaço de magia e sem risco de ficar insano para conversar diretamente com seu patrono cósmico.'
    },
    'Arcana Mística (6º círculo)': {
        name: 'Arcana Mística (6º Círculo)',
        type: 'passive',
        description: 'Seu patrono lhe concede um segredo arcano: escolha uma magia de 6º círculo da lista de bruxo. Você pode conjurá-la 1x por Descanso Longo sem gastar espaços de magia.'
    },
    'Arcana Mística (7º círculo)': {
        name: 'Arcana Mística (7º Círculo)',
        type: 'passive',
        description: 'Escolha uma magia de 7º círculo de bruxo para conjurar livremente 1x por Descanso Longo.'
    },
    'Arcana Mística (8º círculo)': {
        name: 'Arcana Mística (8º Círculo)',
        type: 'passive',
        description: 'Escolha uma magia de 8º círculo de bruxo para conjurar livremente 1x por Descanso Longo.'
    },
    'Arcana Mística (9º círculo)': {
        name: 'Arcana Mística (9º Círculo)',
        type: 'passive',
        description: 'Escolha uma magia suprema de 9º círculo de bruxo (como Aprisionamento ou Metamorfose Verdadeira) para conjurar 1x por Descanso Longo.'
    },
    'Mestre Místico': {
        name: 'Mestre Místico (Eldritch Master)',
        type: 'action',
        description: 'Ao gastar 1 minuto implorando ao seu patrono, você recupera TODOS os seus espaços de magia de pacto instantaneamente!'
    },

    // =========================================================================
    // CLÉRIGO
    // =========================================================================
    'Ordem Divina': {
        name: 'Ordem Divina (Divine Order)',
        type: 'passive',
        description: 'Você dedica sua vocação a um aspecto sagrado: Protetor (ganha proficiência em Armaduras Pesadas e Armas Marciais) ou Taumaturgo (ganha um Truque extra e soma Sabedoria em Religião e História).'
    },
    'Canalizar Divindade': {
        name: 'Canalizar Divindade (Channel Divinity)',
        type: 'action',
        description: 'Você canaliza energia diretamente do seu deus para alimentar efeitos miraculosos, como Centelha Divina (cura ou dano radiante/necrótico) e Expulsar Mortos-Vivos.'
    },
    'Fulminar Mortos-Vivos': {
        name: 'Fulminar Mortos-Vivos (Destroy Undead)',
        type: 'passive',
        description: 'Quando um morto-vivo falha na salvaguarda contra o seu Expulsar Mortos-Vivos, ele não apenas foge, mas é instantaneamente pulverizado e destruído pela luz divina se seu ND for inferior ao seu limiar.'
    },
    'Golpes Abençoados': {
        name: 'Golpes Abençoados (Blessed Strikes)',
        type: 'passive',
        description: 'Escolha Golpe Radiante (causa +1d8 de dano radiante em acertos de arma 1x por turno) ou Potência Divina (soma seu mod de Sabedoria ao dano dos seus truques de clérigo).'
    },
    'Intervenção Divina': {
        name: 'Intervenção Divina (Divine Intervention)',
        type: 'action',
        description: 'No D&D 5.5e, a Intervenção Divina não depende mais de rolagem percentual de sorte! Como ação, você escolhe qualquer magia de clérigo de 5º círculo ou menor e a conjura instantaneamente sem gastar espaços de magia ou componentes materiais!'
    },
    'Golpes Abençoados Aprimorado': {
        name: 'Golpes Abençoados Aprimorado',
        type: 'passive',
        description: 'O dano extra do seu Golpe Radiante aumenta para +2d8, ou sua Potência Divina agora também concede pontos de vida temporários a aliados.'
    },
    'Intervenção Divina Maior': {
        name: 'Intervenção Divina Maior (Greater Divine Intervention)',
        type: 'action',
        description: 'O ápice da comunhão divina: você agora pode usar Intervenção Divina para conjurar a magia DESEJO (Wish) diretamente através da manifestação do seu deus!'
    },

    // =========================================================================
    // DRUIDA
    // =========================================================================
    'Ordem Primal': {
        name: 'Ordem Primal (Primal Order)',
        type: 'passive',
        description: 'Escolha o caminho da sua fé natural: Mago (ganha um truque adicional e soma Sabedoria em Natureza) ou Protetor (ganha proficiência em Armaduras Médias e Armas Marciais).'
    },
    'Forma Selvagem': {
        name: 'Forma Selvagem (Wild Shape)',
        type: 'bonus_action',
        description: 'Como AÇÃO BÔNUS, você assume magicamente a forma de uma fera que você já viu. No D&D 5.5e você retém sua fala telepática, ganha pontos de vida temporários iguais ao seu nível de druida e usa estatísticas da fera para deslocamento e sentidos.'
    },
    'Companheiro Selvagem': {
        name: 'Companheiro Selvagem (Wild Companion)',
        type: 'action',
        description: 'Você pode gastar um uso de Forma Selvagem para conjurar a magia Encontrar Familiar sem componentes materiais como um espírito feérico da natureza.'
    },
    'Ressurgimento Selvagem': {
        name: 'Ressurgimento Selvagem (Wild Resurgence)',
        type: 'bonus_action',
        description: 'Como Ação Bônus, você pode converter um espaço de magia para recuperar um uso de Forma Selvagem, ou gastar um uso de Forma Selvagem para recuperar um espaço de magia de 1º círculo.'
    },
    'Fúria Elemental': {
        name: 'Fúria Elemental (Elemental Fury)',
        type: 'passive',
        description: 'Escolha Golpe Primitivo (causa +1d8 de dano elemental de Fogo, Gelo, Eletricidade ou Trovão nos ataques) ou Conjurador Potente (soma Sabedoria no dano de truques).'
    },
    'Magias Bestiais': {
        name: 'Magias Bestiais (Beast Spells)',
        type: 'passive',
        description: 'Você pode conjurar quase qualquer magia de druida enquanto estiver transformado em Forma Selvagem, dispensando componentes somáticos e verbais.'
    },
    'Arquidruida': {
        name: 'Arquidruida (Archdruid)',
        type: 'passive',
        description: 'Você ganha usos ILIMITADOS de Forma Selvagem! Além disso, ao rolar Iniciativa sem espaços de magia disponíveis, recupera imediatamente um espaço de magia de círculo alto.'
    },

    // =========================================================================
    // FEITICEIRO
    // =========================================================================
    'Feitiçaria Inata': {
        name: 'Feitiçaria Inata (Innate Sorcery)',
        type: 'bonus_action',
        description: 'Como Ação Bônus por 1 minuto, a centelha arcana em seu sangue transborda: você ganha VANTAGEM em todas as jogadas de ataque de magia e a CD para resistir às suas magias aumenta em +1!'
    },
    'Fonte de Magia': {
        name: 'Fonte de Magia (Font of Magic)',
        type: 'passive',
        description: 'Você possui um poço de Pontos de Feitiçaria que pode usar para criar espaços de magia adicionais ou converter espaços de magia não utilizados em pontos.'
    },
    'Metamagia': {
        name: 'Metamagia (Metamagic)',
        type: 'passive',
        description: 'Você dobra as regras da magia à sua vontade gastando Pontos de Feitiçaria: Magia Cuidadosa, Magia Sutil, Magia Rápida (conjura magia com Ação Bônus), Magia Gêmea, Magia Potencializada e Magia Distante.'
    },
    'Restauração Feiticeira': {
        name: 'Restauração Feiticeira (Sorcerous Restoration)',
        type: 'passive',
        description: 'Ao terminar um Descanso Curto, você recupera pontos de feitiçaria gastos até um valor igual a um quarto do seu nível de feiticeiro.'
    },
    'Feitiçaria Encarnada': {
        name: 'Feitiçaria Encarnada (Sorcery Incarnate)',
        type: 'passive',
        description: 'Enquanto sua Feitiçaria Inata estiver ativa, você pode aplicar até DUAS opções de Metamagia diferentes na mesma magia conjurada!'
    },
    'Apoteose Arcana': {
        name: 'Apoteose Arcana (Arcane Apotheosis)',
        type: 'passive',
        description: 'Você se torna a própria magia encarnada. Enquanto estiver em Feitiçaria Inata, você pode usar uma opção de Metamagia em cada turno SEM gastar Pontos de Feitiçaria!'
    },

    // =========================================================================
    // GUARDIÃO
    // =========================================================================
    'Inimigo Favorito': {
        name: 'Inimigo Favorito (Favored Enemy)',
        type: 'bonus_action',
        description: 'No D&D 5.5e, você sempre tem Marca do Caçador (Hunter\'s Mark) preparada e pode conjurá-la um número de vezes por dia sem gastar espaços de magia e SEM exigir Concentração!'
    },
    'Explorador Hábil': {
        name: 'Explorador Hábil (Deft Explorer)',
        type: 'passive',
        description: 'Você ganha Especialização (dobro de proficiência) em uma perícia à sua escolha e aprende dois idiomas adicionais.'
    },
    'Errante': {
        name: 'Errante (Roving)',
        type: 'passive',
        description: 'Seu deslocamento de caminhada aumenta em +3 metros (10 pés), e você ganha deslocamento de Escalada e Natação iguais ao seu deslocamento de caminhada.'
    },
    'Incansável': {
        name: 'Incansável (Tireless)',
        type: 'action',
        description: 'Como Ação, você pode conceder a si mesmo pontos de vida temporários iguais a 1d8 + mod de Sabedoria. Além disso, sempre que terminar um Descanso Curto, seu nível de Exaustão diminui em 1.'
    },
    'Predador Implacável': {
        name: 'Predador Implacável (Relentless Hunter)',
        type: 'passive',
        description: 'Sofrer dano não pode quebrar a sua concentração na Marca do Caçador.'
    },
    'Véu da Natureza': {
        name: 'Véu da Natureza (Nature\'s Veil)',
        type: 'bonus_action',
        description: 'Como Ação Bônus, você invoca espíritos da natureza para se camuflar magicamente, ganhando a condição INVISÍVEL até o final do seu próximo turno.'
    },
    'Sentidos Selvagens': {
        name: 'Sentidos Selvagens (Feral Senses)',
        type: 'passive',
        description: 'Você ganha Sentido Cego (Blindsight) com alcance de 9 metros (30 pés), detectando qualquer criatura invisível ou oculta.'
    },
    'Matador de Inimigos Favoritos': {
        name: 'Matador de Inimigos Favoritos (Foe Slayer)',
        type: 'passive',
        description: 'O dado de dano extra da sua Marca do Caçador aumenta de 1d6 para 1d10, tornando cada golpe letal contra a presa marcada.'
    },

    // =========================================================================
    // MONGE
    // =========================================================================
    'Artes Marciais': {
        name: 'Artes Marciais (Martial Arts)',
        type: 'action',
        description: 'Você domina o combate desarmado e com armas de monge: pode usar Destreza em vez de Força, rola seu Dado de Artes Marciais (d6 inicial até d12) para dano desarmado e pode fazer um Ataque Desarmado adicional com Ação Bônus.'
    },
    'Foco do Monge': {
        name: 'Foco do Monge (Monk\'s Focus)',
        type: 'passive',
        description: 'Você canaliza energia ki através de Pontos de Foco para realizar manobras lendárias: Rajada de Golpes (Flurry of Blows: 2 ataques desarmados de ação bônus), Defesa Paciente (Esquiva de ação bônus) e Passo do Vento (Desengajar e Disparada com salto dobrado).'
    },
    'Movimento sem Armadura': {
        name: 'Movimento sem Armadura (Unarmored Movement)',
        type: 'passive',
        description: 'Seu deslocamento aumenta enquanto você não estiver usando armadura nem escudo (+3 metros até +9 metros no 18º nível).'
    },
    'Metabolismo Incomum': {
        name: 'Metabolismo Incomum (Uncanny Metabolism)',
        type: 'passive',
        description: 'No D&D 5.5e, ao rolar Iniciativa, você pode recuperar instantaneamente TODOS os seus Pontos de Foco gastos e rolar seu Dado de Artes Marciais + nível para recuperar PV! 1x por Descanso Longo.'
    },
    'Defletir Ataques': {
        name: 'Defletir Ataques (Deflect Attacks)',
        type: 'reaction',
        description: 'Como Reação ao sofrer dano de qualquer ataque (corpo a corpo ou à distância), você reduz o dano em 1d10 + Destreza + nível de monge! Se o dano for reduzido a 0, pode gastar 1 Foco para arremessar o projétil ou contra-atacar o agressor.'
    },
    'Golpe Atordoante': {
        name: 'Golpe Atordoante (Stunning Strike)',
        type: 'action',
        description: 'Ao acertar um ataque desarmado ou com arma de monge, gaste 1 Ponto de Foco para forçar o alvo a fazer uma salvaguarda de Constituição. Se falhar, fica ATORDOADO até o início do seu próximo turno. Mesmo se passar, o deslocamento dele é reduzido pela metade!'
    },
    'Acrobático': {
        name: 'Movimento Acrobático (Acrobatic Movement)',
        type: 'passive',
        description: 'Você ganha a habilidade de correr sobre superfícies verticais e líquidos no seu turno sem cair.'
    },
    'Autocura': {
        name: 'Autocura (Self-Restoration)',
        type: 'bonus_action',
        description: 'Como Ação Bônus, você pode purificar seu próprio corpo, encerrando em si mesmo as condições Envenenado, Cego, Surdo ou Paralisado sem gastar magia.'
    },
    'Sobrevivente Disciplinado': {
        name: 'Sobrevivente Disciplinado (Disciplined Survivor)',
        type: 'passive',
        description: 'Seu domínio físico e espiritual concede proficiência em TODAS as salvaguardas (Força, Destreza, Constituição, Inteligência, Sabedoria e Carisma)!'
    },
    'Corpo e Mente': {
        name: 'Corpo e Mente (Body and Mind)',
        type: 'passive',
        description: 'Seus valores de DESTREZA e SABEDORIA aumentam em +4 cada, e seu valor máximo para ambos os atributos agora é 25!'
    },

    // =========================================================================
    // PALADINO
    // =========================================================================
    'Imposição das Mãos': {
        name: 'Imposição das Mãos (Lay on Hands)',
        type: 'bonus_action',
        description: 'No D&D 5.5e, você pode usar Imposição das Mãos como AÇÃO BÔNUS! Você possui uma reserva de cura igual a 5 × seu nível de paladino. Pode tocar uma criatura para restaurar PV ou gastar 5 pontos da reserva para remover uma doença ou condição prejudicial.'
    },
    'Destruição do Paladino': {
        name: 'Destruição do Paladino (Paladin\'s Smite)',
        type: 'bonus_action',
        description: 'Você sempre tem a magia Punição Divina (Divine Smite) preparada e pode conjurá-la uma vez por dia sem gastar espaço de magia.'
    },
    'Montaria Fiel': {
        name: 'Montaria Fiel (Faithful Steed)',
        type: 'action',
        description: 'Você sempre tem a magia Encontrar Montaria preparada e pode conjurá-la uma vez por dia sem gastar espaços de magia, invocando um corcel celestial ou feérico leal.'
    },
    'Aura de Proteção': {
        name: 'Aura de Proteção (Aura of Protection)',
        type: 'passive',
        description: 'Sempre que você ou uma criatura amigável a até 3 metros (10 pés) fizer uma salvaguarda, a criatura ganha um bônus na salvaguarda igual ao seu MODIFICADOR DE CARISMA (mínimo de +1).'
    },
    'Aura de Coragem': {
        name: 'Aura de Coragem (Aura of Courage)',
        type: 'passive',
        description: 'Você e criaturas amigáveis a até 3 metros não podem ser Amedrontados enquanto você estiver consciente.'
    },
    'Golpes Radiantes': {
        name: 'Golpes Radiantes (Radiant Strikes)',
        type: 'passive',
        description: 'Seus golpes transbordam retribuição divina. Sempre que você atingir uma criatura com uma arma corpo a corpo, ela sofre +1d8 de dano radiante adicional automaticamente!'
    },
    'Aura Expandida': {
        name: 'Aura Expandida (Aura Expansion)',
        type: 'passive',
        description: 'O alcance de todas as suas Auras (Proteção e Coragem) aumenta de 3 metros para 9 METROS (30 pés) de raio!'
    },

    // =========================================================================
    // MAGO
    // =========================================================================
    'Recuperação Arcana': {
        name: 'Recuperação Arcana (Arcane Recovery)',
        type: 'action',
        description: 'Uma vez por dia após um Descanso Curto, você pode estudar seu grimório e recuperar espaços de magia gastos cujo círculo total somado seja igual a até metade do seu nível de mago (arredondado para cima).'
    },
    'Adepto de Ritual': {
        name: 'Adepto de Ritual (Ritual Adept)',
        type: 'passive',
        description: 'Você pode conjurar qualquer magia de ritual do seu grimório como ritual mesmo se ela não estiver preparada no momento.'
    },
    'Memorizar Magia': {
        name: 'Memorizar Magia (Memorize Spell)',
        type: 'action',
        description: 'Ao terminar um Descanso Curto, você pode consultar seu grimório e substituir uma de suas magias de mago atualmente preparadas por outra magia do seu grimório.'
    },
    'Maestria de Magias': {
        name: 'Maestria de Magias (Spell Mastery)',
        type: 'passive',
        description: 'Escolha uma magia de 1º círculo e uma de 2º círculo do seu grimório. Você pode conjurar ambas no seu círculo mais baixo à vontade, SEM gastar espaços de magia!'
    },
    'Assinatura Mágica': {
        name: 'Assinatura Mágica (Signature Spells)',
        type: 'passive',
        description: 'Escolha duas magias de 3º círculo do seu grimório como suas magias assinatura: elas estão sempre preparadas e você pode conjurar cada uma uma vez por Descanso Curto sem gastar espaços de magia.'
    },

    // =========================================================================
    // THE WITCHER (BRUXO ADAPTADO)
    // =========================================================================
    'Mutação de Bruxo': {
        name: 'Mutação de Bruxo (Witcher Mutation)',
        type: 'passive',
        description: 'O Teste das Ervas concedeu sentidos sobre-humanos, imunidade completa a doenças comuns, visão no escuro aprimorada e metabolismo adaptado a poções tóxicas letais para humanos comuns.'
    },
    'Sinais Básicos (Aard, Igni, Quen, Yrden, Axii)': {
        name: 'Sinais de Bruxo (Aard, Igni, Quen, Yrden, Axii)',
        type: 'action',
        description: 'Magia de combate rápida canalizada com uma só mão gastando Vigor: Aard (onda telecinética de empurrão), Igni (rajada de chamas), Quen (escudo protetor de absorção), Yrden (armadilha mágica de lentidão) e Axii (controle mental e atordoamento).'
    },
    'Sentidos Aguçados': {
        name: 'Sentidos de Bruxo (Witcher Senses)',
        type: 'action',
        description: 'Permite rastrear odores, pegadas térmicas, sons imperceptíveis e vestígios de monstros a grandes distâncias.'
    },
    'Alquimia & Poções': {
        name: 'Alquimia & Poções (Alchemy)',
        type: 'action',
        description: 'Capacidade de destilar poções mutagênicas (Andorinha para regeneração de PV, Gato para visão no breu total, Trovão para dano ampliado) respeitando o limiar de Toxicidade.'
    },
    'Óleos de Lâmina': {
        name: 'Óleos de Lâmina (Blade Oils)',
        type: 'action',
        description: 'Ungir a lâmina com óleos especializados (Necrófagos, Espectros, Ogroides, Bestas, Vampiros) concedendo dano massivo adicional contra a classe correspondente de monstro.'
    },
    'Modo de Sinal Alternativo': {
        name: 'Modo de Sinal Alternativo',
        type: 'action',
        description: 'Desbloqueia versões canalizadas contínuas dos Sinais: Escudo Ativo de Quen que cura ao absorver dano, Corrente Contínua de Chamas de Igni, e Marionete de Axii que vira inimigos uns contra os outros.'
    },
    'Lenda dos Bruxos do Continente': {
        name: 'Lenda dos Bruxos do Continente',
        type: 'passive',
        description: 'Você se torna uma lenda viva do calibre de Geralt de Rívia ou Vesemir: imunidade a quase todas as condições mentais, reflexos que aparam flechas e magias, e domínio de todas as escolas de combate.'
    }
};
