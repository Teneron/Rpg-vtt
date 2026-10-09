
export interface Spell {
    id: string;
    name: string;
    level: number; // 0 = Cantrip
    school: string;
    castingTime: string;
    range: string;
    components: string; // V, S, M
    duration: string;
    description: string;
    classes: string[]; // IDs das classes que podem usar
}

export const SPELLS: Spell[] = [
    // --- TRUQUES (CANTRIPS) ---
    {
        id: 'eldritch_blast', name: 'Rajada Mística', level: 0, school: 'Evocação',
        castingTime: '1 ação', range: '36m', components: 'V, S', duration: 'Instantânea',
        description: 'Um feixe de energia crepitante ataca a criatura. 1d10 de dano de força.',
        classes: ['warlock']
    },
    {
        id: 'mage_hand', name: 'Mãos Mágicas', level: 0, school: 'Conjuração',
        castingTime: '1 ação', range: '9m', components: 'V, S', duration: '1 minuto',
        description: 'Uma mão espectral flutuante que pode manipular objetos.',
        classes: ['bard', 'sorcerer', 'warlock', 'wizard']
    },
    {
        id: 'vicious_mockery', name: 'Zombaria Viciosa', level: 0, school: 'Encantamento',
        castingTime: '1 ação', range: '18m', components: 'V', duration: 'Instantânea',
        description: 'Insultos encantados. 1d4 psíquico e desvantagem no próximo ataque.',
        classes: ['bard']
    },
    {
        id: 'sacred_flame', name: 'Chama Sagrada', level: 0, school: 'Evocação',
        castingTime: '1 ação', range: '18m', components: 'V, S', duration: 'Instantânea',
        description: 'Fogo radiante desce sobre o alvo (Dex Save). 1d8 radiante.',
        classes: ['cleric']
    },
    {
        id: 'fire_bolt', name: 'Raio de Fogo', level: 0, school: 'Evocação',
        castingTime: '1 ação', range: '36m', components: 'V, S', duration: 'Instantânea',
        description: 'Um feixe de fogo. 1d10 de dano de fogo.',
        classes: ['sorcerer', 'wizard']
    },
    {
        id: 'minor_illusion', name: 'Ilusão Menor', level: 0, school: 'Ilusão',
        castingTime: '1 ação', range: '9m', components: 'S, M', duration: '1 minuto',
        description: 'Cria som ou imagem de objeto estático.',
        classes: ['bard', 'sorcerer', 'warlock', 'wizard', 'gnome'] // Gnome logic separate usually
    },
    {
        id: 'guidance', name: 'Orientação', level: 0, school: 'Adivinhação',
        castingTime: '1 ação', range: 'Toque', components: 'V, S', duration: 'Concentração, 1 min',
        description: 'Alvo adiciona 1d4 em um teste de habilidade.',
        classes: ['cleric', 'druid']
    },
    {
        id: 'shillelagh', name: 'Bordão Místico', level: 0, school: 'Transmutação',
        castingTime: '1 bônus', range: 'Toque', components: 'V, S, M', duration: '1 minuto',
        description: 'Arma de madeira usa seu atributo de conjuração e causa 1d8.',
        classes: ['druid']
    },
    {
        id: 'light', name: 'Luz', level: 0, school: 'Evocação',
        castingTime: '1 ação', range: 'Toque', components: 'V, M', duration: '1 hora',
        description: 'Toca um objeto que emite luz plena num raio de 6m e penumbra por mais 6m.',
        classes: ['bard', 'cleric', 'sorcerer', 'wizard']
    },
    {
        id: 'prestidigitation', name: 'Prestidigitação', level: 0, school: 'Transmutação',
        castingTime: '1 ação', range: '3m', components: 'V, S', duration: 'Até 1 hora',
        description: 'Efeitos sensoriais inofensivos: acender/apagar velas, limpar/sujar, aquecer/esfriar ou criar ilusão tátil menor.',
        classes: ['bard', 'sorcerer', 'warlock', 'wizard']
    },
    {
        id: 'thaumaturgy', name: 'Taumaturgia', level: 0, school: 'Transmutação',
        castingTime: '1 ação', range: '9m', components: 'V', duration: 'Até 1 minuto',
        description: 'Manifestações menores de poder divino: voz 3x mais alta, chamas tremeluzentes, tremores e portas abertas bruscamente.',
        classes: ['cleric']
    },
    {
        id: 'message', name: 'Mensagem', level: 0, school: 'Transmutação',
        castingTime: '1 ação', range: '36m', components: 'V, S, M', duration: '1 rodada',
        description: 'Aponta o dedo e sussurra uma mensagem secreta que apenas o alvo escuta e pode responder em sussurro.',
        classes: ['bard', 'sorcerer', 'wizard']
    },
    {
        id: 'mending', name: 'Conserto', level: 0, school: 'Transmutação',
        castingTime: '1 minuto', range: 'Toque', components: 'V, S, M', duration: 'Instantânea',
        description: 'Repara uma única quebra ou rasgo em um objeto de até 30 centímetros (ex: elo de corrente, manto rasgado, chave partida).',
        classes: ['bard', 'cleric', 'druid', 'sorcerer', 'wizard']
    },
    {
        id: 'shocking_grasp', name: 'Toque Chocante', level: 0, school: 'Evocação',
        castingTime: '1 ação', range: 'Toque', components: 'V, S', duration: 'Instantânea',
        description: 'Ataque mágico corpo a corpo elétrico. 1d8 dano elétrico, vantagem contra alvos de armadura metálica e impede reações do alvo.',
        classes: ['sorcerer', 'wizard']
    },
    {
        id: 'ray_of_frost', name: 'Raio de Gelo', level: 0, school: 'Evocação',
        castingTime: '1 ação', range: '18m', components: 'V, S', duration: 'Instantânea',
        description: 'Feixe de luz azul e frio cortante. 1d8 de dano de frio e o deslocamento do alvo é reduzido em 3 metros.',
        classes: ['sorcerer', 'wizard']
    },
    {
        id: 'chill_touch', name: 'Toque Arrepiante', level: 0, school: 'Necromancia',
        castingTime: '1 ação', range: '36m', components: 'V, S', duration: '1 rodada',
        description: 'Mão esquelética espectral envolve o alvo. 1d8 de dano necrótico e impede que o alvo recupere pontos de vida até o próximo turno.',
        classes: ['sorcerer', 'warlock', 'wizard']
    },
    {
        id: 'poison_spray', name: 'Rajada de Veneno', level: 0, school: 'Necromancia',
        castingTime: '1 ação', range: '9m', components: 'V, S', duration: 'Instantânea',
        description: 'Projeta uma nuvem densa de fumaça tóxica. O alvo sofre 1d12 de dano de veneno se falhar na salvaguarda de Constituição.',
        classes: ['druid', 'sorcerer', 'warlock', 'wizard']
    },
    {
        id: 'druidcraft', name: 'Druidismo', level: 0, school: 'Transmutação',
        castingTime: '1 ação', range: '9m', components: 'V, S', duration: 'Instantânea',
        description: 'Prevê o clima das próximas 24h, faz brotos e flores desabrocharem ou cria brisas sutis e aromas silvestres.',
        classes: ['druid']
    },
    {
        id: 'thorn_whip', name: 'Chicote de Espinhos', level: 0, school: 'Transmutação',
        castingTime: '1 ação', range: '9m', components: 'V, S, M', duration: 'Instantânea',
        description: 'Chicote de vinhas espinhosas. 1d6 de dano perfurante e puxa o alvo Grande ou menor até 3 metros em sua direção.',
        classes: ['druid']
    },
    {
        id: 'resistance', name: 'Resistência', level: 0, school: 'Abjuração',
        castingTime: '1 ação', range: 'Toque', components: 'V, S, M', duration: 'Conc, 1 min',
        description: 'Toca uma criatura disposta. Ela pode adicionar 1d4 a uma salvaguarda à sua escolha antes da duração expirar.',
        classes: ['cleric', 'druid']
    },
    {
        id: 'spare_the_dying', name: 'Poupar os Moribundos', level: 0, school: 'Necromancia',
        castingTime: '1 ação', range: 'Toque', components: 'V, S', duration: 'Instantânea',
        description: 'Toca uma criatura viva com 0 Pontos de Vida. Ela se torna estável imediatamente.',
        classes: ['cleric']
    },
    {
        id: 'true_strike', name: 'Ataque Certeiro (2024)', level: 0, school: 'Adivinhação',
        castingTime: '1 ação', range: 'Alcance da Arma', components: 'S, M', duration: 'Instantânea',
        description: 'Guia misticamente seu golpe. Realiza um ataque com arma usando seu modificador de magia e o ataque causa dano Radiante.',
        classes: ['bard', 'sorcerer', 'warlock', 'wizard']
    },
    {
        id: 'dancing_lights', name: 'Globos de Luz', level: 0, school: 'Evocação',
        castingTime: '1 ação', range: '36m', components: 'V, S, M', duration: 'Conc, 1 min',
        description: 'Cria até quatro luzes cintilantes semelhantes a tochas ou vaga-lumes que flutuam sob seu comando mental.',
        classes: ['bard', 'sorcerer', 'wizard']
    },

    // --- NÍVEL 1 ---
    {
        id: 'cure_wounds', name: 'Curar Ferimentos', level: 1, school: 'Evocação',
        castingTime: '1 ação', range: 'Toque', components: 'V, S', duration: 'Instantânea',
        description: 'Recupera 1d8 + mod de habilidade de HP.',
        classes: ['bard', 'cleric', 'druid', 'paladin', 'ranger']
    },
    {
        id: 'healing_word', name: 'Palavra Curativa', level: 1, school: 'Evocação',
        castingTime: '1 bônus', range: '18m', components: 'V', duration: 'Instantânea',
        description: 'Recupera 1d4 + mod de habilidade de HP à distância.',
        classes: ['bard', 'cleric', 'druid']
    },
    {
        id: 'magic_missile', name: 'Mísseis Mágicos', level: 1, school: 'Evocação',
        castingTime: '1 ação', range: '36m', components: 'V, S', duration: 'Instantânea',
        description: '3 dardos que acertam automaticamente. 1d4+1 cada.',
        classes: ['sorcerer', 'wizard']
    },
    {
        id: 'shield', name: 'Escudo Arcano', level: 1, school: 'Abjuração',
        castingTime: '1 reação', range: 'Pessoal', components: 'V, S', duration: '1 rodada',
        description: '+5 na CA e imune a mísseis mágicos até o início do próximo turno.',
        classes: ['sorcerer', 'wizard']
    },
    {
        id: 'burning_hands', name: 'Mãos Flamejantes', level: 1, school: 'Evocação',
        castingTime: '1 ação', range: 'Cone 4.5m', components: 'V, S', duration: 'Instantânea',
        description: 'Cone de fogo causa 3d6 dano de fogo (Dex Save metade).',
        classes: ['sorcerer', 'wizard']
    },
    {
        id: 'bless', name: 'Bênção', level: 1, school: 'Encantamento',
        castingTime: '1 ação', range: '9m', components: 'V, S, M', duration: 'Conc, 1 min',
        description: '3 criaturas somam 1d4 em ataques e saves.',
        classes: ['cleric', 'paladin']
    },
    {
        id: 'hex', name: 'Bruxaria (Hex)', level: 1, school: 'Encantamento',
        castingTime: '1 bônus', range: '27m', components: 'V, S, M', duration: 'Conc, 1 hora',
        description: 'Dano extra de 1d6 necrótico e desvantagem em testes de um atributo.',
        classes: ['warlock']
    },
    {
        id: 'hunter_mark', name: 'Marca do Caçador', level: 1, school: 'Adivinhação',
        castingTime: '1 bônus', range: '27m', components: 'V', duration: 'Conc, 1 hora',
        description: 'Dano extra de 1d6 e vantagem em rastrear o alvo.',
        classes: ['ranger']
    },

    // --- NEW LEVEL 1 (PALADIN/BARD EXPANSION) ---
    {
        id: 'command', name: 'Comando', level: 1, school: 'Encantamento',
        castingTime: '1 ação', range: '18m', components: 'V', duration: '1 rodada',
        description: 'Força criatura a obedecer comando de uma palavra (Wis Save).',
        classes: ['cleric', 'paladin']
    },
    {
        id: 'compelled_duel', name: 'Duelo Compelido', level: 1, school: 'Encantamento',
        castingTime: '1 bônus', range: '9m', components: 'V', duration: 'Conc, 1 min',
        description: 'Obriga inimigo a focar em você (Wis Save).',
        classes: ['paladin']
    },
    {
        id: 'divine_favor', name: 'Favor Divino', level: 1, school: 'Evocação',
        castingTime: '1 bônus', range: 'Pessoal', components: 'V, S', duration: 'Conc, 1 min',
        description: 'Ataques com arma causam +1d4 radiante.',
        classes: ['paladin']
    },
    {
        id: 'heroism', name: 'Heroísmo', level: 1, school: 'Encantamento',
        castingTime: '1 ação', range: 'Toque', components: 'V, S', duration: 'Conc, 1 min',
        description: 'Alvo imune a medo e ganha HP temporário todo turno.',
        classes: ['bard', 'paladin']
    },
    {
        id: 'protection_evil_good', name: 'Proteção vs Mal e Bem', level: 1, school: 'Abjuração',
        castingTime: '1 ação', range: 'Toque', components: 'V, S, M', duration: 'Conc, 10 min',
        description: 'Proteção contra aberrações, celestiais, elementais, fadas, demônios e mortos-vivos.',
        classes: ['cleric', 'druid', 'paladin', 'warlock', 'wizard']
    },
    {
        id: 'shield_of_faith', name: 'Escudo da Fé', level: 1, school: 'Abjuração',
        castingTime: '1 bônus', range: '18m', components: 'V, S, M', duration: 'Conc, 10 min',
        description: '+2 na CA do alvo.',
        classes: ['cleric', 'paladin']
    },
    {
        id: 'thunderous_smite', name: 'Destruição Trovejante', level: 1, school: 'Evocação',
        castingTime: '1 bônus', range: 'Pessoal', components: 'V', duration: 'Conc, 1 min',
        description: 'Ataque causa +2d6 trovão e empurra 3m (Str Save).',
        classes: ['paladin']
    },
    {
        id: 'wrathful_smite', name: 'Destruição Colérica', level: 1, school: 'Evocação',
        castingTime: '1 bônus', range: 'Pessoal', components: 'V', duration: 'Conc, 1 min',
        description: 'Ataque causa +1d6 psíquico e amedronta (Wis Save).',
        classes: ['paladin']
    },
    {
        id: 'charm_person', name: 'Enfeitiçar Pessoa', level: 1, school: 'Encantamento',
        castingTime: '1 ação', range: '9m', components: 'V, S', duration: '1 hora',
        description: 'Humanoide vê você como amigo (Wis Save).',
        classes: ['bard', 'druid', 'sorcerer', 'warlock', 'wizard']
    },
    {
        id: 'dissonant_whispers', name: 'Sussurros Dissonantes', level: 1, school: 'Encantamento',
        castingTime: '1 ação', range: '18m', components: 'V', duration: 'Instantânea',
        description: '3d6 psíquico e alvo foge (Wis Save).',
        classes: ['bard']
    },
    {
        id: 'faerie_fire', name: 'Fogo das Fadas', level: 1, school: 'Evocação',
        castingTime: '1 ação', range: '18m', components: 'V', duration: 'Conc, 1 min',
        description: 'Luzes contornam criaturas. Vantagem para atacar (Dex Save).',
        classes: ['bard', 'druid']
    },
    {
        id: 'tashas_hideous_laughter', name: 'Riso Histérico de Tasha', level: 1, school: 'Encantamento',
        castingTime: '1 ação', range: '9m', components: 'V, S, M', duration: 'Conc, 1 min',
        description: 'Alvo cai na gargalhada e fica incapacitado (Wis Save).',
        classes: ['bard', 'wizard']
    },

    // --- NEW LEVEL 1 (GENERAL EXPANSION) ---
    {
        id: 'bane', name: 'Maldição (Bane)', level: 1, school: 'Encantamento',
        castingTime: '1 ação', range: '9m', components: 'V, S, M', duration: 'Conc, 1 min',
        description: '3 criaturas subtraem 1d4 em ataques e saves.',
        classes: ['bard', 'cleric']
    },
    {
        id: 'guiding_bolt', name: 'Raio Guiador', level: 1, school: 'Evocação',
        castingTime: '1 ação', range: '36m', components: 'V, S', duration: '1 rodada',
        description: '4d6 radiante e próximo ataque contra o alvo tem vantagem.',
        classes: ['cleric']
    },
    {
        id: 'sanctuary', name: 'Santuário', level: 1, school: 'Abjuração',
        castingTime: '1 bônus', range: '9m', components: 'V, S, M', duration: '1 minuto',
        description: 'Inimigos devem passar em Wis Save para atacar o alvo.',
        classes: ['cleric', 'artificer']
    },
    {
        id: 'entangle', name: 'Constrição', level: 1, school: 'Conjuração',
        castingTime: '1 ação', range: '27m', components: 'V, S', duration: 'Conc, 1 min',
        description: 'Plantas seguram criaturas em quadrado de 6m (Str Save).',
        classes: ['druid']
    },
    {
        id: 'goodberry', name: 'Bom Fruto', level: 1, school: 'Transmutação',
        castingTime: '1 ação', range: 'Toque', components: 'V, S, M', duration: 'Instantânea',
        description: 'Cria 10 frutos que curam 1 HP cada e nutrem por um dia.',
        classes: ['druid', 'ranger']
    },
    {
        id: 'thunderwave', name: 'Onda Trovejante', level: 1, school: 'Evocação',
        castingTime: '1 ação', range: 'Cubo 4.5m', components: 'V, S', duration: 'Instantânea',
        description: 'Onda de som. 2d8 trovejante e empurra 3m (Con Save).',
        classes: ['bard', 'druid', 'sorcerer', 'wizard']
    },
    {
        id: 'chromatic_orb', name: 'Orbe Cromática', level: 1, school: 'Evocação',
        castingTime: '1 ação', range: '27m', components: 'V, S, M', duration: 'Instantânea',
        description: 'Esfera de energia (escolha o tipo). 3d8 dano.',
        classes: ['sorcerer', 'wizard']
    },
    {
        id: 'find_familiar', name: 'Localizar Familiar', level: 1, school: 'Conjuração',
        castingTime: '1 hora', range: '3m', components: 'V, S, M', duration: 'Instantânea',
        description: 'Invoca espírito animal servo.',
        classes: ['wizard']
    },
    {
        id: 'identify', name: 'Identificação', level: 1, school: 'Adivinhação',
        castingTime: '1 min', range: 'Toque', components: 'V, S, M', duration: 'Instantânea',
        description: 'Descobre propriedades mágicas de um objeto.',
        classes: ['bard', 'wizard', 'artificer']
    },
    {
        id: 'armor_of_agathys', name: 'Armadura de Agathys', level: 1, school: 'Abjuração',
        castingTime: '1 ação', range: 'Pessoal', components: 'V, S, M', duration: '1 hora',
        description: 'Ganha 5 HP temporário. Melee attackers levam 5 frio.',
        classes: ['warlock']
    },
    {
        id: 'hellish_rebuke', name: 'Repreensão Infernal', level: 1, school: 'Evocação',
        castingTime: '1 reação', range: '18m', components: 'V, S', duration: 'Instantânea',
        description: 'Ao levar dano, reage com fogo. 2d10 dano (Dex Save).',
        classes: ['warlock']
    },
    {
        id: 'ensnaring_strike', name: 'Golpe Constritor', level: 1, school: 'Conjuração',
        castingTime: '1 bônus', range: 'Pessoal', components: 'V', duration: 'Conc, 1 min',
        description: 'Ataque prende alvo em vinhas (Str Save).',
        classes: ['ranger']
    },
    {
        id: 'hail_of_thorns', name: 'Saraivada de Espinhos', level: 1, school: 'Conjuração',
        castingTime: '1 bônus', range: 'Pessoal', components: 'V', duration: 'Conc, 1 min',
        description: 'Próximo ataque à distância explode em espinhos. 1d10 perfurante em área.',
        classes: ['ranger']
    },
    {
        id: 'sleep', name: 'Sono', level: 1, school: 'Encantamento',
        castingTime: '1 ação', range: '27m', components: 'V, S, M', duration: 'Conc, 1 min',
        description: 'Criaturas em esfera de 1,5m realizam Wisdom Save ou caem Inconscientes/Incapacitadas até levar dano ou serem acordadas.',
        classes: ['bard', 'sorcerer', 'wizard']
    },
    {
        id: 'feather_fall', name: 'Queda Suave', level: 1, school: 'Transmutação',
        castingTime: '1 reação', range: '18m', components: 'V, M', duration: '1 min',
        description: 'Diminui a velocidade de queda de até 5 criaturas caindo para 18m por rodada sem sofrer dano de queda.',
        classes: ['bard', 'sorcerer', 'wizard']
    },
    {
        id: 'detect_magic', name: 'Detectar Magia', level: 1, school: 'Adivinhação',
        castingTime: '1 ação (Ritual)', range: 'Pessoal (9m)', components: 'V, S', duration: 'Conc, 10 min',
        description: 'Sente a presença de magia num raio de 9m e identifica a escola de magia visível.',
        classes: ['bard', 'cleric', 'druid', 'paladin', 'ranger', 'sorcerer', 'warlock', 'wizard']
    },
    {
        id: 'comprehend_languages', name: 'Compreender Idiomas', level: 1, school: 'Adivinhação',
        castingTime: '1 ação (Ritual)', range: 'Pessoal', components: 'V, S, M', duration: '1 hora',
        description: 'Entende o sentido literal de qualquer idioma falado ou texto escrito tocado.',
        classes: ['bard', 'sorcerer', 'warlock', 'wizard']
    },
    {
        id: 'grease', name: 'Graxa', level: 1, school: 'Conjuração',
        castingTime: '1 ação', range: '18m', components: 'V, S, M', duration: '1 min',
        description: 'Cobre quadrado de 3m com graxa escorregadia (terreno difícil). Entrar ou iniciar turno exige Dex Save ou fica Caído.',
        classes: ['sorcerer', 'wizard']
    },
    {
        id: 'fog_cloud', name: 'Nuvem de Nevoeiro', level: 1, school: 'Conjuração',
        castingTime: '1 ação', range: '36m', components: 'V, S', duration: 'Conc, 1 hora',
        description: 'Cria esfera de 6m de raio com névoa densa que bloqueia visão (área pesadamente obscurecida).',
        classes: ['druid', 'ranger', 'sorcerer', 'wizard']
    },
    {
        id: 'speak_with_animals', name: 'Falar com Animais', level: 1, school: 'Adivinhação',
        castingTime: '1 ação (Ritual)', range: 'Pessoal', components: 'V, S', duration: '10 min',
        description: 'Ganha a habilidade de compreender e comunicar-se verbalmente com feras.',
        classes: ['bard', 'druid', 'ranger', 'warlock']
    },
    {
        id: 'inflict_wounds', name: 'Infligir Ferimentos', level: 1, school: 'Necromancia',
        castingTime: '1 ação', range: 'Toque', components: 'V, S', duration: 'Instantânea',
        description: 'Ataque mágico corpo a corpo canalizando energia necrosante, causando 3d10 de dano necrótico.',
        classes: ['cleric']
    },
    {
        id: 'false_life', name: 'Vida Falsa', level: 1, school: 'Necromancia',
        castingTime: '1 ação', range: 'Pessoal', components: 'V, S, M', duration: '1 hora',
        description: 'Reforça-se com vitalidade necromântica, ganhando 2d4 + 4 pontos de vida temporários.',
        classes: ['sorcerer', 'wizard']
    },
    {
        id: 'witch_bolt', name: 'Raio de Bruxa', level: 1, school: 'Evocação',
        castingTime: '1 ação', range: '9m', components: 'V, S, M', duration: 'Conc, 1 min',
        description: 'Raio de energia elétrica sustentada que causa 2d12 de dano de eletricidade no acerto e pode repetir o dano com Ação Bônus em turnos subsequentes.',
        classes: ['sorcerer', 'warlock', 'wizard']
    },
    {
        id: 'divine_smite', name: 'Punição Divina', level: 1, school: 'Evocação',
        castingTime: '1 bônus', range: 'Pessoal', components: 'V', duration: 'Instantânea',
        description: 'Conjurada imediatamente após acertar um ataque corpo a corpo com arma ou desarmado. Causa 2d8 de dano radiante extra (+1d8 contra mortos-vivos ou ínferos).',
        classes: ['paladin']
    },
    {
        id: 'searing_smite', name: 'Punição Ardente', level: 1, school: 'Evocação',
        castingTime: '1 bônus', range: 'Pessoal', components: 'V', duration: 'Conc, 1 min',
        description: 'Próximo ataque com arma causa 1d6 extra de fogo e incendeia o alvo, que sofre 1d6 de fogo no início de seus turnos até passar em Con Save.',
        classes: ['paladin', 'ranger']
    },
    {
        id: 'unseen_servant', name: 'Servo Invisível', level: 1, school: 'Conjuração',
        castingTime: '1 ação (Ritual)', range: '18m', components: 'V, S, M', duration: '1 hora',
        description: 'Manifesta uma força invisível e irracional que executa tarefas manuais simples a seu comando.',
        classes: ['bard', 'warlock', 'wizard']
    },
    {
        id: 'longstrider', name: 'Passos Longos', level: 1, school: 'Transmutação',
        castingTime: '1 ação', range: 'Toque', components: 'V, S, M', duration: '1 hora',
        description: 'Toca uma criatura aumentando o seu deslocamento terrestre em 3 metros durante toda a duração.',
        classes: ['bard', 'druid', 'ranger', 'wizard']
    },
    {
        id: 'jump', name: 'Salto', level: 1, school: 'Transmutação',
        castingTime: '1 bônus', range: 'Toque', components: 'V, S, M', duration: '1 min',
        description: 'Toca uma criatura. Uma vez em cada um de seus turnos, pode gastar 3m de movimento para saltar até 9m.',
        classes: ['druid', 'ranger', 'sorcerer', 'wizard']
    },
    {
        id: 'silent_image', name: 'Imagem Silenciosa', level: 1, school: 'Ilusão',
        castingTime: '1 ação', range: '18m', components: 'V, S, M', duration: 'Conc, 10 min',
        description: 'Cria a imagem ilusória de um objeto, criatura ou fenômeno visível em cubo de 4,5m.',
        classes: ['bard', 'sorcerer', 'wizard']
    },
    {
        id: 'disguise_self', name: 'Disfarçar-se', level: 1, school: 'Ilusão',
        castingTime: '1 ação', range: 'Pessoal', components: 'V, S', duration: '1 hora',
        description: 'Modifica magicamente a sua aparência, roupas e equipamentos ilusoriamente por até 1 hora.',
        classes: ['bard', 'sorcerer', 'wizard']
    },
    // ------------------------------------
    // ------------------------------------
    // --- WITCHER SIGNS (SINAIS BÁSICOS) & FEITIÇOS ---
    {
        id: 'aard', name: 'Sinal: Aard', level: 0, school: 'Evocação',
        castingTime: '1 ação', range: 'Cone 6m', components: 'S', duration: 'Instantânea',
        description: 'Explosão de força telecinética. 2d6 de dano de concussão e empurra o alvo 4,5m ou derruba caído (Str Save).',
        classes: ['witcher']
    },
    {
        id: 'igni', name: 'Sinal: Igni', level: 0, school: 'Evocação',
        castingTime: '1 ação', range: 'Cone 4.5m', components: 'S', duration: 'Instantânea',
        description: 'Jato cônico de chamas. 2d8 de dano de fogo e incendeia alvos vulneráveis (Dex Save).',
        classes: ['witcher']
    },
    {
        id: 'quen', name: 'Sinal: Quen', level: 0, school: 'Abjuração',
        castingTime: '1 bônus', range: 'Pessoal', components: 'S', duration: 'Conc, 1 min',
        description: 'Escudo arcano protetor que envolve o corpo do bruxo. Concede +2 na CA e salvaguardas enquanto ativo.',
        classes: ['witcher']
    },
    {
        id: 'axii', name: 'Sinal: Axii', level: 0, school: 'Encantamento',
        castingTime: '1 ação', range: '9m', components: 'S', duration: 'Instantânea',
        description: 'Onda mental hipnótica que confunde o alvo (Wis Save). Causa 2d6 psíquico e impõe desvantagem.',
        classes: ['witcher']
    },
    {
        id: 'yrden', name: 'Sinal: Yrden', level: 0, school: 'Abjuração',
        castingTime: '1 ação', range: '9m', components: 'S', duration: '1 minuto',
        description: 'Armadilha mágica circular de 4,5m de raio no chão. Cria terreno difícil para inimigos e materializa espectros.',
        classes: ['witcher']
    },
    {
        id: 'heliotrope', name: 'Sinal: Heliotropo', level: 1, school: 'Abjuração',
        castingTime: '1 reação', range: 'Pessoal', components: 'S', duration: 'Instantânea',
        description: 'Gesto defensivo reflexivo ao sofrer dano mágico ou físico. Reduz o dano recebido em 2d8 + mod.',
        classes: ['witcher']
    },
    {
        id: 'somne', name: 'Sinal: Somne', level: 1, school: 'Encantamento',
        castingTime: '1 ação', range: '9m', components: 'S', duration: '1 minuto',
        description: 'Gesto arcano calmante que induz sonolência rápida no alvo (Wis Save ou fica Inconsciente/Adormecido até sofrer dano).',
        classes: ['witcher']
    },
    {
        id: 'alchemical_vigor', name: 'Vigor Alquímico', level: 1, school: 'Transmutação',
        castingTime: '1 bônus', range: 'Pessoal', components: 'S, M', duration: '1 hora',
        description: 'Catalisa os mutagênicos no organismo. Concede 1d10 + mod PV temporários e vantagem em salvaguardas contra veneno.',
        classes: ['witcher']
    },
    {
        id: 'cat_vision', name: 'Elixir: Gato (Visão Noturna)', level: 1, school: 'Transmutação',
        castingTime: '1 bônus', range: 'Pessoal', components: 'S, M', duration: '1 hora',
        description: 'Dilata as pupilas felinas. Concede visão no escuro total (36m) e imunidade à penumbra.',
        classes: ['witcher']
    },
    {
        id: 'glacies', name: 'Glacies', level: 3, school: 'Evocação',
        castingTime: '1 ação', range: '18m', components: 'S', duration: '1 minuto',
        description: 'Rajada congelante profunda. 5d8 frio e imobiliza o alvo (Str Save).',
        classes: ['witcher']
    },
    {
        id: 'produce_flame', name: 'Produzir Chama', level: 0, school: 'Evocação',
        castingTime: '1 ação', range: '9m', components: 'V, S', duration: '10 min',
        description: 'Chama na mão (ilumina) ou arremessa (1d8 fogo).',
        classes: ['druid', 'witcher']
    },

    // --- XANATHAR'S GUIDE TO EVERYTHING (XGtE) ---
    // Cantrips
    {
        id: 'control_flames', name: 'Controlar Chamas', level: 0, school: 'Transmutação',
        castingTime: '1 ação', range: '18m', components: 'S', duration: 'Instantânea ou 1 hora',
        description: 'Expande, extingue ou muda a cor de chamas não mágicas.',
        classes: ['druid', 'sorcerer', 'wizard']
    },
    {
        id: 'create_bonfire', name: 'Criar Fogueira', level: 0, school: 'Conjuração',
        castingTime: '1 ação', range: '18m', components: 'V, S', duration: 'Conc, 1 min',
        description: 'Cria uma fogueira mágica. 1d8 dano de fogo (Dex Save).',
        classes: ['druid', 'sorcerer', 'warlock', 'wizard']
    },
    {
        id: 'frostbite', name: 'Picada Congelante', level: 0, school: 'Evocação',
        castingTime: '1 ação', range: '18m', components: 'V, S', duration: 'Instantânea',
        description: '1d6 frio e desvantagem no próximo ataque com arma (Con Save).',
        classes: ['druid', 'sorcerer', 'warlock', 'wizard']
    },
    {
        id: 'gust', name: 'Gustavo (Gust)', level: 0, school: 'Transmutação',
        castingTime: '1 ação', range: '9m', components: 'V, S', duration: 'Instantânea',
        description: 'Cria lufada de vento inofensiva ou empurra criatura 1.5m (Str Save).',
        classes: ['druid', 'sorcerer', 'wizard']
    },
    {
        id: 'infestation', name: 'Infestação', level: 0, school: 'Conjuração',
        castingTime: '1 ação', range: '9m', components: 'V, S, M', duration: 'Instantânea',
        description: 'Invoca ácaros/pulgas. 1d6 veneno e move 1.5m em direção aleatória (Con Save).',
        classes: ['druid', 'sorcerer', 'warlock', 'wizard']
    },
    {
        id: 'magic_stone', name: 'Pedra Mágica', level: 0, school: 'Transmutação',
        castingTime: '1 bônus', range: 'Toque', components: 'V, S', duration: '1 minuto',
        description: 'Encanta 3 pedras. Ataque à distância (Spell Attack), 1d6+Mod contundente.',
        classes: ['druid', 'warlock']
    },
    {
        id: 'mold_earth', name: 'Moldar Terra', level: 0, school: 'Transmutação',
        castingTime: '1 ação', range: '9m', components: 'S', duration: 'Instantânea ou 1 hora',
        description: 'Escava, move ou muda terreno difícil/normal de terra solta.',
        classes: ['druid', 'sorcerer', 'wizard']
    },
    {
        id: 'primal_savagery', name: 'Selvageria Primal', level: 0, school: 'Transmutação',
        castingTime: '1 ação', range: 'Pessoal', components: 'S', duration: 'Instantânea',
        description: 'Garras ácidas. Ataque corpo-a-corpo (Spell Attack), 1d10 ácido.',
        classes: ['druid']
    },
    {
        id: 'shape_water', name: 'Moldar Água', level: 0, school: 'Transmutação',
        castingTime: '1 ação', range: '9m', components: 'S', duration: 'Instantânea ou 1 hora',
        description: 'Congela, move ou muda cor da água.',
        classes: ['druid', 'sorcerer', 'wizard']
    },
    {
        id: 'thunderclap', name: 'Toque Chocante (Thunderclap)', level: 0, school: 'Evocação',
        castingTime: '1 ação', range: '1.5m (raio)', components: 'S', duration: 'Instantânea',
        description: 'Explosão de som. 1d6 trovejante em todos num raio de 1.5m (Con Save).',
        classes: ['bard', 'druid', 'sorcerer', 'warlock', 'wizard']
    },
    {
        id: 'toll_the_dead', name: 'Dobrar os Mortos', level: 0, school: 'Necromancia',
        castingTime: '1 ação', range: '18m', components: 'V, S', duration: 'Instantânea',
        description: 'Som de sino fúnebre. 1d8 necrótico (ou 1d12 se alvo ferido) (Wis Save).',
        classes: ['cleric', 'warlock', 'wizard']
    },
    {
        id: 'word_of_radiance', name: 'Palavra Radiante', level: 0, school: 'Evocação',
        castingTime: '1 ação', range: '1.5m (raio)', components: 'V, M', duration: 'Instantânea',
        description: 'Luz divina. 1d6 radiante em criaturas escolhidas num raio de 1.5m (Con Save).',
        classes: ['cleric']
    },

    // Level 1
    {
        id: 'absorb_elements', name: 'Absorver Elementos', level: 1, school: 'Abjuração',
        castingTime: '1 reação', range: 'Pessoal', components: 'S', duration: '1 rodada',
        description: 'Resistência a dano elemental recebido. Próximo ataque melee causa +1d6 do tipo.',
        classes: ['druid', 'ranger', 'sorcerer', 'wizard']
    },
    {
        id: 'catapult', name: 'Catapulta', level: 1, school: 'Transmutação',
        castingTime: '1 ação', range: '45m', components: 'S', duration: 'Instantânea',
        description: 'Lança objeto de 0.5 a 2kg. 3d8 dano de concussão (Dex Save).',
        classes: ['sorcerer', 'wizard', 'artificer']
    },
    {
        id: 'cause_fear', name: 'Causar Medo', level: 1, school: 'Necromancia',
        castingTime: '1 ação', range: '18m', components: 'V', duration: 'Conc, 1 min',
        description: 'Desperta medo mortal. Alvo fica Amedrontado (Wis Save).',
        classes: ['warlock', 'wizard']
    },
    {
        id: 'chaos_bolt', name: 'Raio do Caos', level: 1, school: 'Evocação',
        castingTime: '1 ação', range: '36m', components: 'V, S', duration: 'Instantânea',
        description: 'Raio de energia instável. 2d8 + 1d6 dano (tipo aleatório). Pode ricochetear.',
        classes: ['sorcerer']
    },
    {
        id: 'ceremony', name: 'Cerimônia', level: 1, school: 'Abjuração',
        castingTime: '1 hora', range: 'Toque', components: 'V, S, M', duration: 'Instantânea',
        description: 'Ritos religiosos (Casamento, Funeral, etc.) com benefícios menores.',
        classes: ['cleric', 'paladin']
    },
    {
        id: 'ice_knife', name: 'Faca de Gelo', level: 1, school: 'Conjuração',
        castingTime: '1 ação', range: '18m', components: 'S, M', duration: 'Instantânea',
        description: 'Arremessa fragmento (1d10 perfurante). Explode em frio (2d6 frio, Dex Save).',
        classes: ['druid', 'sorcerer', 'wizard']
    },
    {
        id: 'zephyr_strike', name: 'Golpe Zéfiro', level: 1, school: 'Transmutação',
        castingTime: '1 bônus', range: 'Pessoal', components: 'V', duration: 'Conc, 1 min',
        description: 'Move sem provocar oportunidade. Uma vez, ganha vantagem e +1d8 força no ataque.',
        classes: ['ranger']
    },
    {
        id: 'snare', name: 'Armadilha', level: 1, school: 'Abjuração',
        castingTime: '1 min', range: 'Toque', components: 'V, S, M', duration: '8 horas',
        description: 'Cria armadilha mágica invisível que puxa criatura para o ar (Dex Save).',
        classes: ['druid', 'ranger', 'wizard']
    },

    // --- NÍVEL 2 ---
    {
        id: 'aid', name: 'Ajuda', level: 2, school: 'Abjuração',
        castingTime: '1 ação', range: '9m', components: 'V, S, M', duration: '8 horas',
        description: '3 aliados ganham +5 HP máximo e atual.',
        classes: ['cleric', 'paladin']
    },
    {
        id: 'branding_smite', name: 'Destruição Marcante', level: 2, school: 'Evocação',
        castingTime: '1 bônus', range: 'Pessoal', components: 'V', duration: 'Conc, 1 min',
        description: 'Ataque brilha. +2d6 radiante e impede invisibilidade.',
        classes: ['paladin']
    },
    {
        id: 'find_steed', name: 'Invocar Montaria', level: 2, school: 'Conjuração',
        castingTime: '10 min', range: '9m', components: 'V, S', duration: 'Instantânea',
        description: 'Invoca um espírito que assume forma de montaria leal.',
        classes: ['paladin']
    },
    {
        id: 'zone_of_truth', name: 'Zona da Verdade', level: 2, school: 'Encantamento',
        castingTime: '1 ação', range: '18m', components: 'V, S', duration: '10 min',
        description: 'Criaturas na área não podem mentir deliberadamente (Cha Save).',
        classes: ['bard', 'cleric', 'paladin']
    },
    {
        id: 'cloud_of_daggers', name: 'Nuvem de Adagas', level: 2, school: 'Conjuração',
        castingTime: '1 ação', range: '18m', components: 'V, S, M', duration: 'Conc, 1 min',
        description: 'Cubo de adagas giratórias. 4d4 cortante.',
        classes: ['bard', 'sorcerer', 'warlock', 'wizard']
    },
    {
        id: 'heat_metal', name: 'Esquentar Metal', level: 2, school: 'Transmutação',
        castingTime: '1 ação', range: '18m', components: 'V, S, M', duration: 'Conc, 1 min',
        description: 'Metal incandescente causa 2d8 fogo e desvantagem.',
        classes: ['bard', 'druid']
    },
    {
        id: 'see_invisibility', name: 'Ver o Invisível', level: 2, school: 'Adivinhação',
        castingTime: '1 ação', range: 'Pessoal', components: 'V, S, M', duration: '1 hora',
        description: 'Vê criaturas invisíveis e no plano etéreo.',
        classes: ['bard', 'sorcerer', 'wizard']
    },
    {
        id: 'augury', name: 'Augúrio', level: 2, school: 'Adivinhação',
        castingTime: '1 min', range: 'Pessoal', components: 'V, S, M', duration: 'Instantânea',
        description: 'Recebe presságio sobre ação futura (Bom/Ruim).',
        classes: ['cleric']
    },
    {
        id: 'barkskin', name: 'Pele de Árvore', level: 2, school: 'Transmutação',
        castingTime: '1 ação', range: 'Toque', components: 'V, S, M', duration: 'Conc, 1 hora',
        description: 'CA do alvo não pode ser menor que 16.',
        classes: ['druid', 'ranger']
    },
    {
        id: 'moonbeam', name: 'Raio Lunar', level: 2, school: 'Evocação',
        castingTime: '1 ação', range: '36m', components: 'V, S, M', duration: 'Conc, 1 min',
        description: 'Feixe de luz pálida. 2d10 radiante (Con Save). Metamorfos tem desvantagem.',
        classes: ['druid']
    },
    {
        id: 'pass_without_trace', name: 'Passos sem Pegadas', level: 2, school: 'Abjuração',
        castingTime: '1 ação', range: 'Pessoal', components: 'V, S, M', duration: 'Conc, 1 hora',
        description: '+10 em Furtividade para o grupo e não deixa rastros.',
        classes: ['druid', 'ranger']
    },
    {
        id: 'spike_growth', name: 'Crescer Espinhos', level: 2, school: 'Transmutação',
        castingTime: '1 ação', range: '45m', components: 'V, S, M', duration: 'Conc, 10 min',
        description: 'Terreno difícil causa 2d4 perfurante a cada 1.5m movido.',
        classes: ['druid', 'ranger']
    },
    {
        id: 'mirror_image', name: 'Imagem Espelhada', level: 2, school: 'Ilusão',
        castingTime: '1 ação', range: 'Pessoal', components: 'V, S', duration: '1 minuto',
        description: '3 duplicatas ilusórias absorvem ataques por você.',
        classes: ['sorcerer', 'warlock', 'wizard']
    },
    {
        id: 'darkness', name: 'Escuridão', level: 2, school: 'Evocação',
        castingTime: '1 ação', range: '18m', components: 'V, M', duration: 'Conc, 10 min',
        description: 'Escuridão mágica em raio de 4.5m. Visão no escuro não penetra.',
        classes: ['sorcerer', 'warlock', 'wizard']
    },
    {
        id: 'darkvision', name: 'Visão no Escuro', level: 2, school: 'Transmutação',
        castingTime: '1 ação', range: 'Toque', components: 'V, S, M', duration: '8 horas',
        description: 'Concede 18m de visão no escuro.',
        classes: ['druid', 'ranger', 'sorcerer', 'wizard']
    },
    {
        id: 'detect_thoughts', name: 'Detectar Pensamentos', level: 2, school: 'Adivinhação',
        castingTime: '1 ação', range: 'Pessoal', components: 'V, S, M', duration: 'Conc, 1 min',
        description: 'Lê pensamentos superficiais ou profundos (Wis Save).',
        classes: ['bard', 'sorcerer', 'wizard']
    },
    {
        id: 'enhance_ability', name: 'Aprimorar Habilidade', level: 2, school: 'Transmutação',
        castingTime: '1 ação', range: 'Toque', components: 'V, S, M', duration: 'Conc, 1 hora',
        description: 'Vantagem em testes de um atributo escolhido e benefícios extras.',
        classes: ['bard', 'cleric', 'druid', 'sorcerer']
    },
    {
        id: 'flaming_sphere', name: 'Esfera Flamejante', level: 2, school: 'Conjuração',
        castingTime: '1 ação', range: '18m', components: 'V, S, M', duration: 'Conc, 1 min',
        description: 'Esfera de fogo causa 2d6 fogo em quem terminar turno perto (Dex Save).',
        classes: ['druid', 'wizard']
    },
    {
        id: 'hold_person', name: 'Imobilizar Pessoa', level: 2, school: 'Encantamento',
        castingTime: '1 ação', range: '18m', components: 'V, S, M', duration: 'Conc, 1 min',
        description: 'Humanoide fica Paralisado (Wis Save).',
        classes: ['bard', 'cleric', 'druid', 'sorcerer', 'warlock', 'wizard']
    },
    {
        id: 'invisibility', name: 'Invisibilidade', level: 2, school: 'Ilusão',
        castingTime: '1 ação', range: 'Toque', components: 'V, S, M', duration: 'Conc, 1 hora',
        description: 'Criatura tocada fica invisível até atacar ou conjurar.',
        classes: ['bard', 'sorcerer', 'warlock', 'wizard']
    },
    {
        id: 'lesser_restoration', name: 'Restauração Menor', level: 2, school: 'Abjuração',
        castingTime: '1 ação', range: 'Toque', components: 'V, S', duration: 'Instantânea',
        description: 'Cura doença ou condição (cego, surdo, paralisado, envenenado).',
        classes: ['bard', 'cleric', 'druid', 'paladin', 'ranger']
    },
    {
        id: 'misty_step', name: 'Passo Nebuloso', level: 2, school: 'Conjuração',
        castingTime: '1 bônus', range: 'Pessoal', components: 'V', duration: 'Instantânea',
        description: 'Teletransporte 9m para espaço visível.',
        classes: ['sorcerer', 'warlock', 'wizard']
    },
    {
        id: 'scorching_ray', name: 'Raio Ardente', level: 2, school: 'Evocação',
        castingTime: '1 ação', range: '36m', components: 'V, S', duration: 'Instantânea',
        description: '3 raios de fogo. Ataque mágico, 2d6 fogo cada.',
        classes: ['sorcerer', 'wizard']
    },
    {
        id: 'shatter', name: 'Despedaçar', level: 2, school: 'Evocação',
        castingTime: '1 ação', range: '18m', components: 'V, S, M', duration: 'Instantânea',
        description: 'Explosão sônica raio 3m. 3d8 trovejante (Con Save).',
        classes: ['bard', 'sorcerer', 'warlock', 'wizard']
    },
    {
        id: 'silence', name: 'Silêncio', level: 2, school: 'Ilusão',
        castingTime: '1 ação', range: '36m', components: 'V, S', duration: 'Conc, 10 min',
        description: 'Esfera de 6m de silêncio absoluto. Imune a dano trovejante, sem verbal.',
        classes: ['bard', 'cleric', 'ranger']
    },
    {
        id: 'spider_climb', name: 'Patas de Aranha', level: 2, school: 'Transmutação',
        castingTime: '1 ação', range: 'Toque', components: 'V, S, M', duration: 'Conc, 1 hora',
        description: 'Caminha em paredes e tetos sem usar as mãos.',
        classes: ['sorcerer', 'warlock', 'wizard']
    },
    {
        id: 'spiritual_weapon', name: 'Arma Espiritual', level: 2, school: 'Evocação',
        castingTime: '1 bônus', range: '18m', components: 'V, S', duration: '1 minuto',
        description: 'Arma espectral ataca como bônus (1d8 + Mod).',
        classes: ['cleric']
    },
    {
        id: 'suggestion', name: 'Sugestão', level: 2, school: 'Encantamento',
        castingTime: '1 ação', range: '9m', components: 'V, M', duration: 'Conc, 8 horas',
        description: 'Sugere curso de ação (Wis Save).',
        classes: ['bard', 'sorcerer', 'warlock', 'wizard']
    },
    {
        id: 'web', name: 'Teia', level: 2, school: 'Conjuração',
        castingTime: '1 ação', range: '18m', components: 'V, S, M', duration: 'Conc, 1 hora',
        description: 'Cria teias em cubo de 6m. Contenção (Str Save).',
        classes: ['sorcerer', 'wizard']
    },

    // --- NÍVEL 3 ---
    {
        id: 'aura_of_vitality', name: 'Aura de Vitalidade', level: 3, school: 'Evocação',
        castingTime: '1 ação', range: 'Pessoal (9m)', components: 'V', duration: 'Conc, 1 min',
        description: 'Aura cura 2d6 como ação bônus.',
        classes: ['paladin']
    },
    {
        id: 'blinding_smite', name: 'Destruição Cegante', level: 3, school: 'Evocação',
        castingTime: '1 bônus', range: 'Pessoal', components: 'V', duration: 'Conc, 1 min',
        description: 'Ataque causa +3d8 radiante e cega (Con Save).',
        classes: ['paladin']
    },
    {
        id: 'crusaders_mantle', name: 'Manto do Cruzado', level: 3, school: 'Evocação',
        castingTime: '1 ação', range: 'Pessoal (9m)', components: 'V', duration: 'Conc, 1 min',
        description: 'Aliados próximos causam +1d4 radiante em ataques.',
        classes: ['paladin']
    },
    {
        id: 'leomunds_tiny_hut', name: 'Pequena Cabana de Leomund', level: 3, school: 'Evocação',
        castingTime: '1 min', range: 'Pessoal (3m)', components: 'V, S, M', duration: '8 horas',
        description: 'Cúpula impenetrável e confortável para descanso.',
        classes: ['bard', 'wizard']
    },
    {
        id: 'major_image', name: 'Imagem Maior', level: 3, school: 'Ilusão',
        castingTime: '1 ação', range: '36m', components: 'V, S, M', duration: 'Conc, 10 min',
        description: 'Cria ilusão complexa (visual, som, cheiro, temperatura).',
        classes: ['bard', 'sorcerer', 'warlock', 'wizard']
    },
    {
        id: 'remove_curse', name: 'Remover Maldição', level: 3, school: 'Abjuração',
        castingTime: '1 ação', range: 'Toque', components: 'V, S', duration: 'Instantânea',
        description: 'Remove todas as maldições de um objeto ou criatura.',
        classes: ['cleric', 'paladin', 'warlock', 'wizard']
    },
    {
        id: 'speak_with_dead', name: 'Falar com os Mortos', level: 3, school: 'Necromancia',
        castingTime: '1 ação', range: '3m', components: 'V, S, M', duration: '10 min',
        description: 'Cadáver responde a 5 perguntas.',
        classes: ['bard', 'cleric']
    },
    {
        id: 'plant_growth', name: 'Crescer Plantas', level: 3, school: 'Transmutação',
        castingTime: '1 ação ou 8h', range: '45m', components: 'V, S', duration: 'Instantânea',
        description: 'Plantas crescem excessivamente (terreno difícil x4) ou enriquecem colheita.',
        classes: ['bard', 'druid', 'ranger']
    },
    {
        id: 'hunger_of_hadar', name: 'Fome de Hadar', level: 3, school: 'Conjuração',
        castingTime: '1 ação', range: '45m', components: 'V, S, M', duration: 'Conc, 1 min',
        description: 'Esfera de escuridão fria e tentáculos ácidos. 2d6 frio + 2d6 ácido.',
        classes: ['warlock']
    },
    {
        id: 'slow', name: 'Lentidão', level: 3, school: 'Transmutação',
        castingTime: '1 ação', range: '36m', components: 'V, S, M', duration: 'Conc, 1 min',
        description: 'Até 6 criaturas ficam lentas (-2 CA, sem reações, meia velocidade).',
        classes: ['sorcerer', 'wizard']
    },
    {
        id: 'animate_dead', name: 'Animar Mortos', level: 3, school: 'Necromancia',
        castingTime: '1 minuto', range: '3m', components: 'V, S, M', duration: 'Instantânea',
        description: 'Cria esqueleto ou zumbi servo de cadáver.',
        classes: ['cleric', 'wizard']
    },
    {
        id: 'call_lightning', name: 'Convocar Relâmpagos', level: 3, school: 'Conjuração',
        castingTime: '1 ação', range: '36m', components: 'V, S', duration: 'Conc, 10 min',
        description: 'Relâmpagos caem em ponto da nuvem. 3d10 elétrico (Dex Save).',
        classes: ['druid']
    },
    {
        id: 'counterspell', name: 'Contramágica', level: 3, school: 'Abjuração',
        castingTime: '1 reação', range: '18m', components: 'S', duration: 'Instantânea',
        description: 'Interrompe conjuração de criatura.',
        classes: ['sorcerer', 'warlock', 'wizard']
    },
    {
        id: 'dispel_magic', name: 'Dissipar Magia', level: 3, school: 'Abjuração',
        castingTime: '1 ação', range: '36m', components: 'V, S', duration: 'Instantânea',
        description: 'Encerra magias no alvo.',
        classes: ['bard', 'cleric', 'druid', 'paladin', 'sorcerer', 'warlock', 'wizard']
    },
    {
        id: 'fireball', name: 'Bola de Fogo', level: 3, school: 'Evocação',
        castingTime: '1 ação', range: '45m', components: 'V, S, M', duration: 'Instantânea',
        description: 'Explosão de fogo raio 6m. 8d6 fogo (Dex Save).',
        classes: ['sorcerer', 'wizard']
    },
    {
        id: 'fly', name: 'Voo', level: 3, school: 'Transmutação',
        castingTime: '1 ação', range: 'Toque', components: 'V, S, M', duration: 'Conc, 10 min',
        description: 'Alvo ganha deslocamento de voo 18m.',
        classes: ['sorcerer', 'warlock', 'wizard']
    },
    {
        id: 'haste', name: 'Velocidade', level: 3, school: 'Transmutação',
        castingTime: '1 ação', range: '9m', components: 'V, S, M', duration: 'Conc, 1 min',
        description: 'Dobro de velocidade, +2 CA, ação extra limitada.',
        classes: ['sorcerer', 'wizard']
    },
    {
        id: 'hypnotic_pattern', name: 'Padrão Hipnótico', level: 3, school: 'Ilusão',
        castingTime: '1 ação', range: '36m', components: 'S, M', duration: 'Conc, 1 min',
        description: 'Padrão de cores encanta criaturas em cubo 9m (Wis Save).',
        classes: ['bard', 'sorcerer', 'warlock', 'wizard']
    },
    {
        id: 'lightning_bolt', name: 'Relâmpago', level: 3, school: 'Evocação',
        castingTime: '1 ação', range: 'Pessoal (30m linha)', components: 'V, S, M', duration: 'Instantânea',
        description: 'Linha de raio causa 8d6 elétrico (Dex Save).',
        classes: ['sorcerer', 'wizard']
    },
    {
        id: 'mass_healing_word', name: 'Palavra Curativa em Massa', level: 3, school: 'Evocação',
        castingTime: '1 bônus', range: '18m', components: 'V', duration: 'Instantânea',
        description: 'Cura 1d4 + mod de 6 criaturas.',
        classes: ['cleric']
    },
    {
        id: 'revivify', name: 'Revivificar', level: 3, school: 'Necromancia',
        castingTime: '1 ação', range: 'Toque', components: 'V, S, M', duration: 'Instantânea',
        description: 'Retorna criatura morta no último minuto à vida com 1 HP.',
        classes: ['cleric', 'paladin', 'ranger']
    },
    {
        id: 'spirit_guardians', name: 'Espíritos Guardiões', level: 3, school: 'Conjuração',
        castingTime: '1 ação', range: 'Pessoal (4.5m)', components: 'V, S, M', duration: 'Conc, 10 min',
        description: 'Espíritos protegem você. 3d8 radiante/necrótico em inimigos próximos (Wis Save).',
        classes: ['cleric']
    },

    // --- NÍVEL 4 ---
    {
        id: 'arcane_eye', name: 'Olho Arcano', level: 4, school: 'Adivinhação',
        castingTime: '1 ação', range: '9m', components: 'V, S, M', duration: 'Conc, 1 hora',
        description: 'Olho invisível flutuante que você controla remotamente.',
        classes: ['wizard']
    },
    {
        id: 'banishment', name: 'Banimento', level: 4, school: 'Abjuração',
        castingTime: '1 ação', range: '18m', components: 'V, S, M', duration: 'Conc, 1 min',
        description: 'Bane criatura para outro plano (Cha Save).',
        classes: ['cleric', 'paladin', 'sorcerer', 'warlock', 'wizard']
    },
    {
        id: 'blight', name: 'Definhar', level: 4, school: 'Necromancia',
        castingTime: '1 ação', range: '9m', components: 'V, S', duration: 'Instantânea',
        description: 'Drena umidade vital. 8d8 necrótico (Con Save).',
        classes: ['druid', 'sorcerer', 'warlock', 'wizard']
    },
    {
        id: 'dimension_door', name: 'Porta Dimensional', level: 4, school: 'Conjuração',
        castingTime: '1 ação', range: '150m', components: 'V', duration: 'Instantânea',
        description: 'Teleporta você e mais uma criatura para local visualizado ou conhecido.',
        classes: ['bard', 'sorcerer', 'warlock', 'wizard']
    },
    {
        id: 'greater_invisibility', name: 'Invisibilidade Maior', level: 4, school: 'Ilusão',
        castingTime: '1 ação', range: 'Toque', components: 'V, S', duration: 'Conc, 1 min',
        description: 'Invisibilidade que não quebra ao atacar.',
        classes: ['bard', 'sorcerer', 'wizard']
    },
    {
        id: 'polymorph', name: 'Polimorfia', level: 4, school: 'Transmutação',
        castingTime: '1 ação', range: '18m', components: 'V, S, M', duration: 'Conc, 1 hora',
        description: 'Transforma criatura em fera (Wis Save).',
        classes: ['bard', 'druid', 'sorcerer', 'wizard']
    },
    {
        id: 'wall_of_fire', name: 'Muralha de Fogo', level: 4, school: 'Evocação',
        castingTime: '1 ação', range: '36m', components: 'V, S, M', duration: 'Conc, 1 min',
        description: 'Cria muro de fogo opaco. 5d8 fogo ao atravessar ou iniciar dentro (Dex Save).',
        classes: ['druid', 'sorcerer', 'wizard']
    },

    // --- NÍVEL 5 ---
    {
        id: 'animate_objects', name: 'Animar Objetos', level: 5, school: 'Transmutação',
        castingTime: '1 ação', range: '36m', components: 'V, S', duration: 'Conc, 1 min',
        description: 'Anima até 10 objetos pequenos que atacam inimigos.',
        classes: ['bard', 'sorcerer', 'wizard']
    },
    {
        id: 'cloudkill', name: 'Névoa Mortal', level: 5, school: 'Conjuração',
        castingTime: '1 ação', range: '36m', components: 'V, S', duration: 'Conc, 10 min',
        description: 'Esfera de gás venenoso 6m. 5d8 veneno (Con Save).',
        classes: ['sorcerer', 'wizard']
    },
    {
        id: 'cone_of_cold', name: 'Cone de Frio', level: 5, school: 'Evocação',
        castingTime: '1 ação', range: 'Cone 18m', components: 'V, S, M', duration: 'Instantânea',
        description: 'Cone de ar congelante. 8d8 frio (Con Save).',
        classes: ['sorcerer', 'wizard']
    },
    {
        id: 'flame_strike', name: 'Coluna de Chamas', level: 5, school: 'Evocação',
        castingTime: '1 ação', range: '18m', components: 'V, S, M', duration: 'Instantânea',
        description: 'Coluna divina de fogo. 4d6 fogo + 4d6 radiante (Dex Save).',
        classes: ['cleric']
    },
    {
        id: 'greater_restoration', name: 'Restauração Maior', level: 5, school: 'Abjuração',
        castingTime: '1 ação', range: 'Toque', components: 'V, S, M', duration: 'Instantânea',
        description: 'Remove um nível de exaustão, charme, petrificação ou maldição.',
        classes: ['bard', 'cleric', 'druid']
    },
    {
        id: 'hold_monster', name: 'Imobilizar Monstro', level: 5, school: 'Encantamento',
        castingTime: '1 ação', range: '27m', components: 'V, S, M', duration: 'Conc, 1 min',
        description: 'Qualquer criatura fica Paralisada (Wis Save).',
        classes: ['bard', 'sorcerer', 'warlock', 'wizard']
    },
    {
        id: 'mass_cure_wounds', name: 'Curar Ferimentos em Massa', level: 5, school: 'Evocação',
        castingTime: '1 ação', range: '18m', components: 'V, S', duration: 'Instantânea',
        description: 'Cura 3d8 + mod em ponto de raio 9m.',
        classes: ['bard', 'cleric', 'druid']
    },
    {
        id: 'raise_dead', name: 'Reviver os Mortos', level: 5, school: 'Necromancia',
        castingTime: '1 hora', range: 'Toque', components: 'V, S, M', duration: 'Instantânea',
        description: 'Retorna a vida criatura morta a até 10 dias.',
        classes: ['bard', 'cleric', 'paladin']
    },
    {
        id: 'scrying', name: 'Vidência', level: 5, school: 'Adivinhação',
        castingTime: '10 min', range: 'Pessoal', components: 'V, S, M', duration: 'Conc, 10 min',
        description: 'Espiona criatura à distância invisivelmente.',
        classes: ['bard', 'cleric', 'druid', 'warlock', 'wizard']
    },
    {
        id: 'wall_of_force', name: 'Muralha de Força', level: 5, school: 'Evocação',
        castingTime: '1 ação', range: '36m', components: 'V, S, M', duration: 'Conc, 10 min',
        description: 'Cria muro invisível indestrutível.',
        classes: ['wizard']
    }
];
