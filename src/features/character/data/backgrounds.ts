
import type { SkillName } from '../characterTypes';

export interface BackgroundData {
    id: string;
    name: string;
    description: string;
    skillProficiencies: SkillName[];
    toolProficiencies?: string[];
    languages?: number; // Count of extra languages
    equipment: string[];
    feature: {
        name: string;
        description: string;
    };
}

export const BACKGROUNDS: BackgroundData[] = [
    {
        id: 'acolyte',
        name: 'Acólito',
        description: "Você passou sua vida a serviço de um templo ou divindade específica. Você age como um intermediário entre o reino sagrado e o mundo mortal.",
        skillProficiencies: ['Intuição', 'Religião'],
        languages: 2,
        equipment: ['Um símbolo sagrado', 'Um livro de preces', '5 palitos de incenso', 'Vestimentas', 'Algibeira com 15 po'],
        feature: {
            name: "Abrigo dos Fiéis",
            description: "Como um acólito, você comanda o respeito daqueles que compartilham sua fé, e você pode realizar as cerimônias religiosas de sua divindade. Você e seus companheiros de aventura podem esperar receber cura e cuidados gratuitos em um templo, santuário ou outra presença estabelecida de sua fé."
        }
    },
    {
        id: 'criminal',
        name: 'Criminoso',
        description: "Você é um criminoso experiente com um histórico de infringir a lei. Você passou muito tempo entre outros criminosos e ainda tem contatos no submundo do crime.",
        skillProficiencies: ['Enganação', 'Furtividade'],
        toolProficiencies: ['Ferramentas de Ladrão', 'Um kit de jogos (a sua escolha)'],
        equipment: ['Um pé de cabra', 'Um conjunto de roupas escuras comuns com capuz', 'Algibeira com 15 po'],
        feature: {
            name: "Contato Criminal",
            description: "Você tem um contato confiável e de confiança que age como seu elo com uma rede de outros criminosos. Você sabe como enviar e receber mensagens para o seu contato, mesmo a grandes distâncias."
        }
    },
    {
        id: 'folk_hero',
        name: 'Herói do Povo',
        description: "Você vem de uma classe social humilde, mas está destinado a muito mais. Já o povo de sua vila natal o considera um campeão, e o seu destino o chama para ficar contra os tiranos e monstros.",
        skillProficiencies: ['Adestrar Animais', 'Sobrevivência'],
        toolProficiencies: ['Um tipo de ferramenta de artesão', 'Veículos (terrestres)'],
        equipment: ['Um conjunto de ferramentas de artesão', 'Uma pá', 'Um pote de ferro', 'Roupas comuns', 'Algibeira com 10 po'],
        feature: {
            name: "Hospitalidade Rústica",
            description: "Visto que você vem das massas populares, você se mistura facilmente entre elas. Você pode encontrar lugar para se esconder, descansar ou recuperar entre outros plebeus, a menos que você tenha se mostrado um perigo para eles."
        }
    },
    {
        id: 'noble',
        name: 'Nobre',
        description: "Você entende de riqueza, poder e privilégio. Você carrega um título de nobreza, e sua família possui terras, coleta impostos e exerce influência política significativa.",
        skillProficiencies: ['História', 'Persuasão'],
        toolProficiencies: ['Um kit de jogos'],
        languages: 1,
        equipment: ['Um conjunto de roupas finas', 'Um anel de sinete', 'Um pergaminho de pedigree', 'Algibeira com 25 po'],
        feature: {
            name: "Posição de Privilégio",
            description: "Graças à sua nobreza, as pessoas tendem a pensar o melhor de você. Você é bem-vindo na alta sociedade e as pessoas assumem que você tem o direito de estar onde quer que esteja. As pessoas comuns fazem todos os esforços para acomodá-lo e evitar desagradar você."
        }
    },
    {
        id: 'sage',
        name: 'Sábio',
        description: "Você passou anos aprendendo a tradição do multiverso. Você vasculhou manuscritos, estudou pergaminhos e ouviu os maiores especialistas nos assuntos que lhe interessam.",
        skillProficiencies: ['Arcanismo', 'História'],
        languages: 2,
        equipment: ['Um vidro de tinta preto', 'Uma pena', 'Uma faca pequena', 'Uma carta de um colega morto com uma pergunta que você ainda não conseguiu responder', 'Roupas comuns', 'Algibeira com 10 po'],
        feature: {
            name: "Pesquisador",
            description: "Quando você tenta recordar um pedaço de informação, se você não sabe essa informação, você geralmente sabe onde e de quem você pode obtê-la. Geralmente, esta informação vem de uma biblioteca, scriptorium, universidade ou um sábio ou outra pessoa ou criatura instruída."
        }
    },
    {
        id: 'soldier',
        name: 'Soldado',
        description: "A guerra tem sido sua vida por tanto tempo quanto você se lembra. Você treinou na juventude, estudou o uso de armas e armaduras, aprendeu técnicas básicas de sobrevivência, e ficou na linha de frente em batalhas.",
        skillProficiencies: ['Atletismo', 'Intimidação'],
        toolProficiencies: ['Um kit de jogos', 'Veículos (terrestres)'],
        equipment: ['Uma insígnia de posto', 'Um troféu de um inimigo caído', 'Um conjunto de dados de osso ou baralho', 'Roupas comuns', 'Algibeira com 10 po'],
        feature: {
            name: "Patente Militar",
            description: "Você tem uma patente militar de sua carreira como soldado. Soldados leais à sua antiga organização militar ainda reconhecem sua autoridade e influência, e eles deferem a você se forem de patente inferior. Você pode invocar sua patente para exercer influência sobre outros soldados e requisitar equipamentos simples ou cavalos para uso temporário."
        }
    }
];
