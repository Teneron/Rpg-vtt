
export interface SkillRule {
    name: string;
    attribute: string;
    description: string;
    examples: string[];
}

export const SKILL_RULES: Record<string, SkillRule> = {
    'Acrobacia': {
        name: 'Acrobacia',
        attribute: 'dex',
        description: 'Cobre sua tentativa de manter o equilíbrio em situações complicadas, como correr sobre o gelo, se equilibrar em uma corda bamba ou permanecer de pé em um convés de navio balançando. O Mestre também pode pedir um teste de Destreza (Acrobacia) para ver se você consegue realizar manobras acrobáticas, como mergulhos, giros, cambalhotas e saltos.',
        examples: ['Andar em corda bamba', 'Escapar de agarrão', 'Pousar em pé']
    },
    'Adestrar Animais': {
        name: 'Adestrar Animais',
        attribute: 'wis',
        description: 'Quando houver uma dúvida se você consegue acalmar um animal domesticado, manter uma montaria sob controle ou intuir as intenções de um animal, o Mestre pede um teste de Sabedoria (Adestrar Animais).',
        examples: ['Acalmar cavalo assustado', 'Controlar montaria', 'Prever comportamento animal']
    },
    'Arcanismo': {
        name: 'Arcanismo',
        attribute: 'int',
        description: 'Mede seu conhecimento sobre magias, itens mágicos, símbolos místicos, tradições mágicas, os planos de existência e os habitantes desses planos.',
        examples: ['Identificar magia', 'Reconhecer glifo', 'Lembrar lendas sobre planos']
    },
    'Atletismo': {
        name: 'Atletismo',
        attribute: 'str',
        description: 'Cobre situações difíceis que você encontra ao escalar, saltar ou nadar.',
        examples: ['Escalar parede escorregadia', 'Saltar uma distância longa', 'Nadar em corredeiras', 'Agarrar criatura']
    },
    'Atuação': {
        name: 'Atuação',
        attribute: 'cha',
        description: 'Determina quão bem você pode deleitar uma plateia com música, dança, atuação, contação de histórias ou alguma outra forma de entretenimento.',
        examples: ['Tocar instrumento', 'Contar história', 'Dançar']
    },
    'Enganação': {
        name: 'Enganação',
        attribute: 'cha',
        description: 'Determina se você consegue esconder a verdade de forma convincente, seja por palavras ou ações. Abrange tudo, desde enganar os outros através de ambiguidade até contar mentiras descaradas.',
        examples: ['Mentir para guarda', 'Disfarçar', 'Trapacear em jogo']
    },
    'Furtividade': {
        name: 'Furtividade',
        attribute: 'dex',
        description: 'Faça um teste de Destreza (Furtividade) quando tentar se esconder de inimigos, esgueirar-se por guardas, escapar sem ser notado ou aproximar-se de alguém sem ser visto ou ouvido.',
        examples: ['Esconder-se nas sombras', 'Andar silenciosamente', 'Seguir alguém']
    },
    'História': {
        name: 'História',
        attribute: 'int',
        description: 'Mede seu conhecimento sobre eventos históricos, pessoas lendárias, reinos antigos, disputas passadas, guerras recentes e civilizações perdidas.',
        examples: ['Lembrar de batalhas antigas', 'Conhecer linhagem real', 'Identificar arquitetura antiga']
    },
    'Intimidação': {
        name: 'Intimidação',
        attribute: 'cha',
        description: 'Quando você tenta influenciar alguém através de ameaças abertas, ações hostis ou violência física.',
        examples: ['Ameaçar prisioneiro', 'Impor autoridade', 'Quebrar objetos para assustar']
    },
    'Intuição': {
        name: 'Intuição',
        attribute: 'wis',
        description: 'Decide se você pode determinar as verdadeiras intenções de uma criatura, como ao perceber uma mentira ou prever o próximo movimento de alguém. Isso envolve observar a linguagem corporal, hábitos de fala e mudanças nos maneirismos.',
        examples: ['Detectar mentira', 'Ler intenções', 'Perceber nervosismo']
    },
    'Investigação': {
        name: 'Investigação',
        attribute: 'int',
        description: 'Quando você olha ao redor em busca de pistas e faz deduções com base nelas. Você pode deduzir a localização de um objeto escondido, discernir a aparência de uma ferida para determinar que arma a causou, ou determinar o ponto mais fraco em um túnel que pode causar seu colapso.',
        examples: ['Procurar armadilhas', 'Deduzir causa da morte', 'Vasculhar sala']
    },
    'Medicina': {
        name: 'Medicina',
        attribute: 'wis',
        description: 'Permite que você tente estabilizar um companheiro moribundo ou diagnosticar uma doença.',
        examples: ['Estabilizar moribundo', 'Diagnosticar doença', 'Identificar veneno']
    },
    'Natureza': {
        name: 'Natureza',
        attribute: 'int',
        description: 'Mede seu conhecimento sobre terreno, plantas e animais, o clima e ciclos naturais.',
        examples: ['Identificar planta/animal', 'Prever clima', 'Reconhecer terreno']
    },
    'Percepção': {
        name: 'Percepção',
        attribute: 'wis',
        description: 'Permite que você perceba, ouça ou detecte a presença de algo. Mede sua consciência geral dos arredores e a agudeza de seus sentidos.',
        examples: ['Ouvir conversa', 'Ver inimigo escondido', 'Sentir cheiro de fumaça']
    },
    'Persuasão': {
        name: 'Persuasão',
        attribute: 'cha',
        description: 'Quando você tenta influenciar alguém ou um grupo de pessoas com tato, graças sociais ou boa natureza. Tipicamente usado ao agir de boa fé, promover amizades, fazer pedidos cordiais ou exibir etiqueta adequada.',
        examples: ['Convencer guarda', 'Negociar paz', 'Pedir favor']
    },
    'Prestidigitação': {
        name: 'Prestidigitação',
        attribute: 'dex',
        description: 'Sempre que você tentar um ato de legerdemain (mãos leves) ou destreza manual, como plantar algo em outra pessoa ou esconder um objeto em sua pessoa.',
        examples: ['Bater carteira', 'Esconder objeto', 'Desarmar armadilha (com ferramentas)']
    },
    'Religião': {
        name: 'Religião',
        attribute: 'int',
        description: 'Mede seu conhecimento sobre divindades, ritos e orações, hierarquias religiosas, símbolos sagrados e as práticas de cultos secretos.',
        examples: ['Reconhecer divindade', 'Lembrar rito sagrado', 'Identificar seita']
    },
    'Sobrevivência': {
        name: 'Sobrevivência',
        attribute: 'wis',
        description: 'O Mestre pode pedir um teste de Sabedoria (Sobrevivência) para seguir rastros, caçar animais selvagens, guiar seu grupo através de terrenos baldios congelados, identificar sinais de que ursos-coruja vivem nas proximidades, prever o tempo ou evitar areia movediça e outros perigos naturais.',
        examples: ['Rastrear', 'Caçar', 'Evitar perigos naturais']
    }
};

export const TOOLS_LIST = [
    // Artesão
    "Ferramentas de Alquimista",
    "Suprimentos de Cervejeiro",
    "Suprimentos de Caligrafia",
    "Ferramentas de Carpinteiro",
    "Ferramentas de Cartógrafo",
    "Ferramentas de Sapateiro",
    "Utensílios de Cozinheiro",
    "Ferramentas de Vidreiro",
    "Ferramentas de Joalheiro",
    "Ferramentas de Couraria",
    "Ferramentas de Pedreiro",
    "Ferramentas de Pintor",
    "Ferramentas de Oleiro",
    "Ferramentas de Ferreiro",
    "Ferramentas de Latoeiro",
    "Ferramentas de Costureiro",
    "Ferramentas de Tecelão",
    "Ferramentas de Entalhador",

    // Outros
    "Kit de Disfarce",
    "Kit de Falsificação",
    "Kit de Jogos (Dados)",
    "Kit de Jogos (Cartas)",
    "Kit de Jogos (Xadrez de Dragão)",
    "Kit de Herborismo",
    "Instrumentos Musicais (Alaúde)",
    "Instrumentos Musicais (Flauta)",
    "Instrumentos Musicais (Lira)",
    "Instrumentos Musicais (Tambor)",
    "Ferramentas de Navegador",
    "Kit de Venenos",
    "Ferramentas de Ladrão"
];

export const LANGUAGES_LIST = [
    "Comum",
    "Língua Antiga",
    "Anão",
    "Nilfgaardiano",
    "Skellige",
    "Gnomo"
];

export interface ToolRule {
    name: string;
    description: string;
    ability: string; // Sugestão
}

// Xanathar's Guide Snippets (Simplificado)
export const TOOL_RULES: Record<string, ToolRule> = {
    "Ferramentas de Ladrão": {
        name: "Ferramentas de Ladrão",
        description: "Permite desarmar armadilhas e abrir fechaduras. Se tiver proficiência, adiciona o bônus aos testes.",
        ability: "dex"
    },
    "Ferramentas de Alquimista": {
        name: "Ferramentas de Alquimista",
        description: "Permite criar poções, ácidos e identificar substâncias alquímicas.",
        ability: "int"
    },
    "Kit de Herborismo": {
        name: "Kit de Herborismo",
        description: "Permite identificar plantas e criar poções de cura e antídotos.",
        ability: "wis"
    },
    // ... Adicionar mais conforme necessidade
};
