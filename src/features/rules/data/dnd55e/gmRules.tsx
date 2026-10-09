import type { RuleSection } from '../../RulebookViewer';
import { ZoomableImage } from '../../../../components/ZoomableImage';

export const DND55E_GM_SECTIONS: RuleSection[] = [
    // =========================================================================
    // 1. CAPÍTULOS 1 & 2: A ARTE DE NARRAR & FILOSOFIA DO MESTRE 2024
    // =========================================================================
    {
        id: 'dmg_mastery_philosophy',
        title: 'Cap. 1 & 2: A Arte de Narrar & Filosofia do Mestre',
        category: 'A Arte de Narrar (Cap. 1 & 2)',
        content: (
            <div>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <img 
                        src="/assets/dmg/dm_screen_art.jpeg" 
                        alt="A Arte do Mestre de Jogo D&D 2024" 
                        style={{ maxWidth: '100%', maxHeight: '420px', borderRadius: '10px', boxShadow: '0 8px 24px rgba(0,0,0,0.6)', border: '1px solid #e11d48' }} 
                    />
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '8px' }}>
                        <em>O Mestre de Jogo (Dungeon Master) como arquiteto da narrativa e árbitro imparcial do multiverso.</em>
                    </p>
                </div>

                <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: '1.6' }}>
                    Como Mestre em Dungeons & Dragons 2024, sua missão primordial não é derrotar os aventureiros nem seguir cegamente regras burocráticas, mas proporcionar um ambiente seguro, colaborativo e imersivo onde histórias lendárias nasçam naturalmente das decisões dos heróis.
                </p>

                <div style={{ background: 'rgba(225, 29, 72, 0.12)', border: '1px solid #e11d48', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
                    <h3 style={{ color: '#f43f5e', margin: '0 0 10px 0' }}>Os Três Grandes Axiomas do Mestre 2024</h3>
                    <ul style={{ margin: 0, paddingLeft: '20px', color: '#fecdd3', lineHeight: '1.7' }}>
                        <li><strong>As Regras Não São Física do Mundo (Rules Aren't Physics):</strong> O sistema de regras é uma abstração para resolver conflitos de jogo dramáticos, não um motor simulador de física do universo real. Nunca permita que um tecnicismo destrua a plausibilidade narrativa.</li>
                        <li><strong>O Jogo Não é uma Economia Fechada:</strong> Valores monetários de itens e serviços servem para dar senso de progresso e escolhas de aventura, e não para converter o jogo em planilha de comércio contábil.</li>
                        <li><strong>Combate é Feito para Inimigos:</strong> Habilidades que mencionam criaturas ou acertos são concebidas contra inimigos reais em perigo autêntico. Truques baratos como golpear aliados intencionalmente para acionar reações de combate devem ser sumariamente descartados.</li>
                    </ul>
                </div>

                <h3 style={{ color: '#c5a059', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>Sessão Zero & Ferramentas de Segurança</h3>
                <p>
                    Uma campanha épica começa antes do primeiro d20 ser lançado. Dedique a primeira reunião à <strong>Sessão Zero</strong>:
                </p>
                <ul>
                    <li><strong>Expectativas de Tom:</strong> Fantasia heroica nobre, intriga política, sobrevivência sombria (grimdark) ou exploração clássica de masmorras.</li>
                    <li><strong>A Regra da 1 Hora:</strong> Conclua cada sessão pontualmente. Deixar os heróis em suspense diante de uma revelação mantém o engajamento em alta para a próxima semana.</li>
                    <li><strong>Limites Rígidos (Hard Limits) & Limites Suaves (Soft Limits):</strong>
                        <ul>
                            <li><em>Limite Rígido (Cartão X):</em> Temas vetados expressamente que nunca devem aparecer na mesa sob hipótese alguma.</li>
                            <li><em>Limite Suave (Cartão ? / Fade to Black):</em> Temas aceitos desde que ocorram fora de cena ("a tela escurece e corta para a manhã seguinte").</li>
                        </ul>
                    </li>
                </ul>
            </div>
        )
    },

    // 2. OS 7 PERFIS DE JOGADOR
    {
        id: 'dmg_player_archetypes',
        title: 'Os 7 Perfis de Jogador & Dinâmicas de Grupo',
        category: 'A Arte de Narrar (Cap. 1 & 2)',
        content: (
            <div>
                <p style={{ color: '#cbd5e1', lineHeight: '1.6' }}>
                    O Guia do Mestre categoriza as motivações essenciais de cada jogador para permitir que o Mestre prepare encontros magnéticos e balanceados para toda a mesa:
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', marginBottom: '24px' }}>
                    <div style={{ background: '#181b2a', border: '1px solid #334155', padding: '12px', borderRadius: '8px' }}>
                        <strong style={{ color: '#38bdf8' }}>O Ator (Actor):</strong> Fascinado pela interpretação profunda de papéis, voz, sotaques, dilemas morais e relacionamentos de longo prazo com PNJs.
                    </div>
                    <div style={{ background: '#181b2a', border: '1px solid #334155', padding: '12px', borderRadius: '8px' }}>
                        <strong style={{ color: '#38bdf8' }}>O Construtor (World-Builder):</strong> Gosta de deixar sua marca no mundo, fundar guildas, gerenciar bastiões e governar povoados.
                    </div>
                    <div style={{ background: '#181b2a', border: '1px solid #334155', padding: '12px', borderRadius: '8px' }}>
                        <strong style={{ color: '#38bdf8' }}>O Explorador (Explorer):</strong> Motivado por descobrir áreas secretas no mapa, desvendar ruínas esquecidas e conhecer a história ancestral do cenário.
                    </div>
                    <div style={{ background: '#181b2a', border: '1px solid #334155', padding: '12px', borderRadius: '8px' }}>
                        <strong style={{ color: '#38bdf8' }}>O Instigador (Instigator):</strong> Impaciente com planejamento excessivo; gosta de abrir portas trancadas, apertar botões misteriosos e provocar o caos narrativo.
                    </div>
                    <div style={{ background: '#181b2a', border: '1px solid #334155', padding: '12px', borderRadius: '8px' }}>
                        <strong style={{ color: '#38bdf8' }}>O Matador (Slayer):</strong> Apaixonado pelo combate tático, rolagens de dano devastadoras e derrotar vilões implacáveis.
                    </div>
                    <div style={{ background: '#181b2a', border: '1px solid #334155', padding: '12px', borderRadius: '8px' }}>
                        <strong style={{ color: '#38bdf8' }}>O Otimizador (Optimizer):</strong> Encontra prazer em combinações táticas refinadas, sinergia entre talentos, magias e maestrias de armas.
                    </div>
                    <div style={{ background: '#181b2a', border: '1px solid #334155', padding: '12px', borderRadius: '8px' }}>
                        <strong style={{ color: '#38bdf8' }}>O Solucionador (Problem Solver):</strong> Focado em decifrar enigmas intelectuais, descobrir motivações de assassinos e neutralizar armadilhas sem combate.
                    </div>
                </div>
            </div>
        )
    },

    // =========================================================================
    // 3. FERRAMENTAS DO MESTRE, CDS & ADJUDICAÇÃO
    // =========================================================================
    {
        id: 'dmg_dcs_adjudication',
        title: 'Cap. 3: Classes de Dificuldade (CDs 5 a 30)',
        category: 'Ferramentas do Mestre (Cap. 3)',
        content: (
            <div>
                <p style={{ color: '#cbd5e1', lineHeight: '1.6' }}>
                    O Capítulo 3 do Guia do Mestre define os valores de referência para qualquer teste de perícia ou resistência do jogo:
                </p>

                <h3 style={{ color: '#c5a059', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>Tabela Oficial de Classes de Dificuldade (CDs 2024)</h3>
                <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                        <thead>
                            <tr style={{ background: '#27121c', color: '#f43f5e', textAlign: 'left' }}>
                                <th style={{ padding: '8px', border: '1px solid #471a2b' }}>Grau de Dificuldade</th>
                                <th style={{ padding: '8px', border: '1px solid #471a2b' }}>CD</th>
                                <th style={{ padding: '8px', border: '1px solid #471a2b' }}>Exemplo Canônico</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td><strong>Muito Fácil</strong></td><td><strong>5</strong></td><td>Notar uma fogueira no horizonte; arrombar uma porta emperrada sem tranca.</td></tr>
                            <tr><td><strong>Fácil</strong></td><td><strong>10</strong></td><td>Escalar um muro de pedra com apoios; ouvir passos no corredor quieto; acalmar animal doméstico.</td></tr>
                            <tr><td><strong>Moderado</strong></td><td><strong>15</strong></td><td>Arrombar uma fechadura comum de ferro; recordar lenda regional; identificar runa básica.</td></tr>
                            <tr><td><strong>Difícil</strong></td><td><strong>20</strong></td><td>Localizar uma porta secreta primorosamente oculta; desarmar armadilha perigosa de masmorra.</td></tr>
                            <tr><td><strong>Muito Difícil</strong></td><td><strong>25</strong></td><td>Recordar um segredo de civilização extinta há milênios; nadar contra uma correnteza violenta.</td></tr>
                            <tr><td><strong>Quase Impossível</strong></td><td><strong>30</strong></td><td>Rastrear pegadas em granito polido sob tempestade; persuadir um tirano insano a renunciar ao trono.</td></tr>
                        </tbody>
                    </table>
                </div>

                <div style={{ background: '#1c1926', border: '1px solid #6366f1', padding: '12px', borderRadius: '8px' }}>
                    <h4 style={{ color: '#818cf8', margin: '0 0 6px 0' }}>A Regra de Ouro: Quando NÃO Pedir Testes</h4>
                    <p style={{ margin: 0, fontSize: '0.88rem', color: '#c7d2fe' }}>
                        Não peça testes de d20 se não houver consequência dramática real para a falha ou se a tarefa for trivial. Se um herói tem tempo ilimitado e as ferramentas corretas para destrancar uma caixa comum, permita o sucesso narrativo sem dados.
                    </p>
                </div>
            </div>
        )
    },

    // 4. ORÇAMENTO DE ENCONTROS POR XP
    {
        id: 'dmg_encounter_budget',
        title: 'Orçamento de Encontros por XP (Níveis 1 a 20)',
        category: 'Ferramentas do Mestre (Cap. 3)',
        content: (
            <div>
                <p style={{ color: '#cbd5e1', lineHeight: '1.6' }}>
                    O Guia do Mestre atualizou a tabela de orçamento de XP por personagem para permitir que o Mestre crie encontros equilibrados para o grupo:
                </p>

                <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                        <thead>
                            <tr style={{ background: '#1e1b2e', color: '#c084fc', textAlign: 'left' }}>
                                <th style={{ padding: '6px', border: '1px solid #3730a3' }}>Nível do PJ</th>
                                <th style={{ padding: '6px', border: '1px solid #3730a3' }}>Ameaça Baixa</th>
                                <th style={{ padding: '6px', border: '1px solid #3730a3' }}>Ameaça Moderada</th>
                                <th style={{ padding: '6px', border: '1px solid #3730a3' }}>Ameaça Difícil</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td>Nível 1</td><td>50 XP</td><td>75 XP</td><td>100 XP</td></tr>
                            <tr><td>Nível 2</td><td>100 XP</td><td>150 XP</td><td>200 XP</td></tr>
                            <tr><td>Nível 3</td><td>150 XP</td><td>225 XP</td><td>400 XP</td></tr>
                            <tr><td>Nível 4</td><td>250 XP</td><td>375 XP</td><td>500 XP</td></tr>
                            <tr><td>Nível 5</td><td>500 XP</td><td>750 XP</td><td>1.100 XP</td></tr>
                            <tr><td>Nível 6</td><td>600 XP</td><td>900 XP</td><td>1.400 XP</td></tr>
                            <tr><td>Nível 7</td><td>750 XP</td><td>1.100 XP</td><td>1.700 XP</td></tr>
                            <tr><td>Nível 8</td><td>900 XP</td><td>1.400 XP</td><td>2.100 XP</td></tr>
                            <tr><td>Nível 9</td><td>1.100 XP</td><td>1.600 XP</td><td>2.400 XP</td></tr>
                            <tr><td>Nível 10</td><td>1.200 XP</td><td>1.900 XP</td><td>2.800 XP</td></tr>
                            <tr><td>Nível 11-15</td><td>1.600 - 2.800 XP</td><td>2.400 - 4.300 XP</td><td>3.600 - 6.400 XP</td></tr>
                            <tr><td>Nível 16-20</td><td>3.200 - 5.700 XP</td><td>4.800 - 8.500 XP</td><td>7.200 - 12.700 XP</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )
    },

    // 5. CATÁLOGO DE ARMADILHAS OFICIAIS
    {
        id: 'dmg_traps_hazards',
        title: 'Catálogo de Armadilhas Incômodas & Mortais (DMG p. 103)',
        category: 'Ferramentas do Mestre (Cap. 3)',
        content: (
            <div>
                <p style={{ color: '#cbd5e1', lineHeight: '1.6' }}>
                    Tabela oficial de parâmetros numéricos para construir armadilhas equilibradas de acordo com o nível dos heróis:
                </p>

                <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                        <thead>
                            <tr style={{ background: '#3b0764', color: '#f0abfc', textAlign: 'left' }}>
                                <th style={{ padding: '8px', border: '1px solid #581c87' }}>Nível do Grupo</th>
                                <th style={{ padding: '8px', border: '1px solid #581c87' }}>Incômoda (Nuisance)</th>
                                <th style={{ padding: '8px', border: '1px solid #581c87' }}>Perigosa (Dangerous)</th>
                                <th style={{ padding: '8px', border: '1px solid #581c87' }}>Mortal (Deadly)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td><strong>1º ao 4º Nível</strong></td><td>CD 10-11 | +3 ataque | 1d10 dano</td><td>CD 12-15 | +6 ataque | 2d10 dano</td><td>CD 16-20 | +9 ataque | 4d10 dano</td></tr>
                            <tr><td><strong>5º ao 10º Nível</strong></td><td>CD 12-13 | +4 ataque | 2d10 dano</td><td>CD 14-17 | +8 ataque | 4d10 dano</td><td>CD 18-20 | +11 ataque | 10d10 dano</td></tr>
                            <tr><td><strong>11º ao 16º Nível</strong></td><td>CD 14-15 | +6 ataque | 4d10 dano</td><td>CD 16-19 | +10 ataque | 10d10 dano</td><td>CD 20-22 | +13 ataque | 18d10 dano</td></tr>
                            <tr><td><strong>17º ao 20º Nível</strong></td><td>CD 16-17 | +8 ataque | 10d10 dano</td><td>CD 18-21 | +12 ataque | 18d10 dano</td><td>CD 22-25 | +15 ataque | 24d10 dano</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )
    },

    // 6. PORTAS E ESTRUTURAS
    {
        id: 'dmg_doors_objects',
        title: 'Portas, Paredes, Estruturas & Estatísticas de Objetos',
        category: 'Ferramentas do Mestre (Cap. 3)',
        content: (
            <div>
                <p style={{ color: '#cbd5e1', lineHeight: '1.6' }}>
                    Parâmetros oficiais de Classe de Armadura (CA) e Pontos de Vida (PV) por material:
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
                    <div style={{ background: '#1c1926', padding: '12px', borderRadius: '6px' }}>
                        <strong style={{ color: '#38bdf8' }}>Vidro / Cristal:</strong> CA 13 | PV 2 a 5 | Vulnerável a Concussão.
                    </div>
                    <div style={{ background: '#1c1926', padding: '12px', borderRadius: '6px' }}>
                        <strong style={{ color: '#38bdf8' }}>Madeira / Osso:</strong> CA 15 | PV Pequeno 9 (2d8), Médio 18 (4d8) | Vulnerável a Fogo.
                    </div>
                    <div style={{ background: '#1c1926', padding: '12px', borderRadius: '6px' }}>
                        <strong style={{ color: '#38bdf8' }}>Pedra / Alvenaria:</strong> CA 17 | PV Médio 18, Grande 27 (5d10) | Limiar de Dano 5.
                    </div>
                    <div style={{ background: '#1c1926', padding: '12px', borderRadius: '6px' }}>
                        <strong style={{ color: '#38bdf8' }}>Ferro / Aço:</strong> CA 19 | PV Médio 27, Grande 50 | Limiar de Dano 10.
                    </div>
                    <div style={{ background: '#1c1926', padding: '12px', borderRadius: '6px' }}>
                        <strong style={{ color: '#38bdf8' }}>Mithral:</strong> CA 21 | Imune a dano crítico.
                    </div>
                    <div style={{ background: '#1c1926', padding: '12px', borderRadius: '6px' }}>
                        <strong style={{ color: '#38bdf8' }}>Adamante:</strong> CA 23 | Resistente a quase todas as fontes físicas.
                    </div>
                </div>
            </div>
        )
    },

    // =========================================================================
    // 7. TERRENOS DE VIAGEM & CLIMA EXTREMO
    // =========================================================================
    {
        id: 'dmg_travel_terrains',
        title: 'Tabela Oficial de Terrenos de Viagem (DMG p. 66)',
        category: 'Exploração & Sobrevivência (Cap. 3 & 4)',
        content: (
            <div>
                <p style={{ color: '#cbd5e1', lineHeight: '1.6' }}>
                    Tabela oficial do Guia do Mestre para determinar velocidades, distâncias de encontro e CDs de sobrevivência nos 11 biomas do multiverso:
                </p>
                <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                        <thead>
                            <tr style={{ background: '#1e1b2e', color: '#c084fc', textAlign: 'left' }}>
                                <th style={{ padding: '8px', border: '1px solid #3730a3' }}>Terreno</th>
                                <th style={{ padding: '8px', border: '1px solid #3730a3' }}>Ritmo Máximo</th>
                                <th style={{ padding: '8px', border: '1px solid #3730a3' }}>Distância Encontro</th>
                                <th style={{ padding: '8px', border: '1px solid #3730a3' }}>CD Forragear</th>
                                <th style={{ padding: '8px', border: '1px solid #3730a3' }}>CD Navegar</th>
                                <th style={{ padding: '8px', border: '1px solid #3730a3' }}>CD Procurar</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td><strong>Ártico</strong></td><td>Rápido (com esquis)</td><td>6d6 &times; 3 m</td><td>CD 20</td><td>CD 10</td><td>CD 10</td></tr>
                            <tr><td><strong>Costeiro</strong></td><td>Normal</td><td>2d10 &times; 3 m</td><td>CD 10</td><td>CD 5</td><td>CD 15</td></tr>
                            <tr><td><strong>Deserto</strong></td><td>Normal</td><td>6d6 &times; 3 m</td><td>CD 20</td><td>CD 10</td><td>CD 10</td></tr>
                            <tr><td><strong>Floresta</strong></td><td>Normal</td><td>2d8 &times; 3 m</td><td>CD 10</td><td>CD 15</td><td>CD 15</td></tr>
                            <tr><td><strong>Campo / Planície</strong></td><td>Rápido</td><td>6d6 &times; 3 m</td><td>CD 15</td><td>CD 5</td><td>CD 15</td></tr>
                            <tr><td><strong>Colina</strong></td><td>Normal</td><td>2d10 &times; 3 m</td><td>CD 15</td><td>CD 10</td><td>CD 15</td></tr>
                            <tr><td><strong>Montanha</strong></td><td>Lento</td><td>4d10 &times; 3 m</td><td>CD 20</td><td>CD 15</td><td>CD 20</td></tr>
                            <tr><td><strong>Pântano</strong></td><td>Lento</td><td>2d8 &times; 3 m</td><td>CD 10</td><td>CD 15</td><td>CD 20</td></tr>
                            <tr><td><strong>Umbraeterna (Underdark)</strong></td><td>Normal</td><td>2d6 &times; 3 m</td><td>CD 20</td><td>CD 10</td><td>CD 20</td></tr>
                            <tr><td><strong>Urbano</strong></td><td>Normal</td><td>2d6 &times; 3 m</td><td>CD 20</td><td>CD 15</td><td>CD 15</td></tr>
                            <tr><td><strong>Aquático</strong></td><td>Especial (Embarcação)</td><td>6d6 &times; 3 m</td><td>CD 15</td><td>CD 10</td><td>CD 15</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )
    },

    // 8. CLIMA EXTREMO E RISCOS AMBIENTAIS
    {
        id: 'dmg_extreme_weather',
        title: 'Clima Extremo, Frio Severo & Sufocamento',
        category: 'Exploração & Sobrevivência (Cap. 3 & 4)',
        content: (
            <div>
                <ul>
                    <li><strong>Frio Extremo:</strong> Abaixo de 0°C sem agasalho apropriado exige salvaguarda de Constituição CD 10 a cada hora ou ganha 1 nível de Exaustão.</li>
                    <li><strong>Calor Tórrido:</strong> Acima de 38°C sem água abundante exige salvaguarda de Constituição CD 5 (aumenta em +1 a cada hora subsequente) sob risco de Exaustão. Criaturas com armadura pesada têm Desvantagem contínua!</li>
                    <li><strong>Vento Forte:</strong> Desvantagem em todas as jogadas de ataque com armas à distância e dissipa nuvens de gás ou fumaça.</li>
                </ul>
            </div>
        )
    },

    // 9. EFEITOS PLANOS
    {
        id: 'dmg_planes_effects',
        title: 'Efeitos dos Planos de Existência',
        category: 'Exploração & Sobrevivência (Cap. 3 & 4)',
        content: (
            <div>
                <p style={{ color: '#cbd5e1' }}>Mecânicas sobrenaturais ao viajar além do Plano Material:</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
                    <div style={{ background: '#181b2a', border: '1px solid #4338ca', padding: '12px', borderRadius: '6px' }}>
                        <strong style={{ color: '#818cf8' }}>Plano das Sombras (Shadowfell):</strong> Desespero sombrio. Salvaguarda de Sabedoria CD 10 após cada descanso longo ou perde a capacidade de gastar inspiração heroica.
                    </div>
                    <div style={{ background: '#181b2a', border: '1px solid #059669', padding: '12px', borderRadius: '6px' }}>
                        <strong style={{ color: '#34d399' }}>Feywild (Aglutinação Feérica):</strong> Perda de memória após cruzar de volta para o Plano Material; distorção temporal de dias para semanas.
                    </div>
                    <div style={{ background: '#181b2a', border: '1px solid #dc2626', padding: '12px', borderRadius: '6px' }}>
                        <strong style={{ color: '#f87171' }}>Gehenna:</strong> Ganância egoísta. Lançar magias benéficas ou de cura em terceiros exige teste de Carisma CD 10; em falha, a magia se perde!
                    </div>
                </div>
            </div>
        )
    },

    // =========================================================================
    // 10. CATÁLOGO DE VENENOS OFICIAIS (DMG p. 90-91)
    // =========================================================================
    {
        id: 'dmg_poisons_catalog',
        title: 'Catálogo Oficial de Venenos (DMG p. 90-91)',
        category: 'Perigos & Venenos (Cap. 3)',
        content: (
            <div>
                <p style={{ color: '#cbd5e1', lineHeight: '1.6' }}>
                    O Guia do Mestre apresenta 14 venenos canônicos com regras rigorosas de aplicação e extração.
                </p>

                <div style={{ background: '#171720', border: '1px solid #10b981', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
                    <h4 style={{ color: '#34d399', margin: '0 0 6px 0' }}>Regras de Coleta de Veneno de Criaturas</h4>
                    <p style={{ margin: 0, fontSize: '0.88rem', color: '#a7f3d0' }}>
                        Coletar veneno de uma besta ou monstro morto/incapacitado leva <strong>1d6 minutos</strong> e requer um teste de Inteligência (Natureza) <strong>CD 20</strong> utilizando um Kit de Venenos. Se a rolagem falhar por 5 ou mais, o próprio coletor é envenenado pela substância!
                    </p>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                        <thead>
                            <tr style={{ background: '#064e3b', color: '#6ee7b7', textAlign: 'left' }}>
                                <th style={{ padding: '8px', border: '1px solid #047857' }}>Veneno</th>
                                <th style={{ padding: '8px', border: '1px solid #047857' }}>Preço</th>
                                <th style={{ padding: '8px', border: '1px solid #047857' }}>Tipo</th>
                                <th style={{ padding: '8px', border: '1px solid #047857' }}>Salva (CON)</th>
                                <th style={{ padding: '8px', border: '1px solid #047857' }}>Efeito Mecânico Exato</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td><strong>Sangue de Assassino</strong></td><td>150 PO</td><td>Ingestão</td><td>CD 10</td><td>6 (1d12) veneno e Envenenado por 24h (metade dano se passar).</td></tr>
                            <tr><td><strong>Soro da Verdade</strong></td><td>150 PO</td><td>Ingestão</td><td>CD 11</td><td>Envenenado por 1h; incapaz de pronunciar mentiras deliberadas.</td></tr>
                            <tr><td><strong>Ferroada de Lolth</strong></td><td>200 PO</td><td>Lesão</td><td>CD 13</td><td>Envenenado por 1h; se falhar por 5+, cai Inconsciente (acorda se sofrer dano).</td></tr>
                            <tr><td><strong>Muco de Rastejador</strong></td><td>200 PO</td><td>Contato</td><td>CD 13</td><td>Envenenado e Paralisado por 1 minuto. Repete o teste a cada turno.</td></tr>
                            <tr><td><strong>Veneno de Serpente</strong></td><td>200 PO</td><td>Lesão</td><td>CD 11</td><td>10 (3d6) de dano Venenoso (metade no sucesso da salvaguarda).</td></tr>
                            <tr><td><strong>Malícia</strong></td><td>250 PO</td><td>Inalação</td><td>CD 15</td><td>Envenenado por 1 hora e Cego (Blinded) enquanto durar o efeito.</td></tr>
                            <tr><td><strong>Tintura Pálida</strong></td><td>250 PO</td><td>Ingestão</td><td>CD 16</td><td>3 (1d6) veneno e Envenenado. Repete salvaguarda a cada 24h (3 de dano por falha, cura impossível). Exige 7 sucessos para encerrar.</td></tr>
                            <tr><td><strong>Essência de Éter</strong></td><td>300 PO</td><td>Inalação</td><td>CD 15</td><td>Envenenado por 8 horas e Inconsciente. Acorda se sofrer dano ou ser chacoalhado com uma ação.</td></tr>
                            <tr><td><strong>Óleo de Taggit</strong></td><td>400 PO</td><td>Contato</td><td>CD 13</td><td>Envenenado por 24 horas e Inconsciente (acorda se sofrer dano).</td></tr>
                            <tr><td><strong>Vapores Causticantes de Othur</strong></td><td>500 PO</td><td>Inalação</td><td>CD 13</td><td>10 (3d6) veneno. No início de cada turno: sofre 3 (1d6) por falha até acumular 3 sucessos.</td></tr>
                            <tr><td><strong>Torpor</strong></td><td>600 PO</td><td>Ingestão</td><td>CD 15</td><td>Envenenado por 4d6 horas; deslocamento de movimento reduzido à metade.</td></tr>
                            <tr><td><strong>Veneno de Serpe (Wyvern)</strong></td><td>1.200 PO</td><td>Lesão</td><td>CD 14</td><td>24 (7d6) de dano Venenoso (metade no sucesso da salvaguarda).</td></tr>
                            <tr><td><strong>Lágrimas da Meia-Noite</strong></td><td>1.500 PO</td><td>Ingestão</td><td>CD 17</td><td>Imperceptível até a meia-noite. À meia-noite, sofre 31 (9d6) dano veneno (metade no sucesso).</td></tr>
                            <tr><td><strong>Veneno de Verme Púrpuro</strong></td><td>2.000 PO</td><td>Lesão</td><td>CD 21</td><td>35 (10d6) de dano Venenoso devastador (metade no sucesso).</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )
    },

    // =========================================================================
    // 11. O CENÁRIO OFICIAL DE GREYHAWK (576 CY)
    // =========================================================================
    {
        id: 'dmg_greyhawk_world',
        title: 'Cap. 5: O Cenário Oficial de Greyhawk (576 CY)',
        category: 'O Cenário de Greyhawk (Cap. 5)',
        content: (
            <div>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <img 
                        src="/assets/dmg/greyhawk_city.jpeg" 
                        alt="Página de Título Oficial de Greyhawk Guia do Mestre" 
                        style={{ maxWidth: '100%', maxHeight: '440px', borderRadius: '10px', boxShadow: '0 8px 24px rgba(0,0,0,0.6)', border: '1px solid #e11d48' }} 
                    />
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '8px' }}>
                        <em>Abertura canônica do Capítulo 5 do Guia do Mestre: O ano de 576 CY em Oerth e Flanaess Oriental.</em>
                    </p>
                </div>

                <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: '1.6' }}>
                    Ambientado no ano canônico de <strong>576 CY (Common Year / Calendário Comum)</strong>, <strong>Greyhawk</strong> é o berço histórico de D&D. No continente de <strong>Flanaess</strong>, antigos impérios foram pulverizados pelos Cataclismos Gêmeos: a <em>Invocação da Danação</em> e a <em>Chuva de Fogo Incolor</em>.
                </p>

                <div style={{ background: 'rgba(225, 29, 72, 0.12)', border: '1px solid #e11d48', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
                    <h3 style={{ color: '#f43f5e', margin: '0 0 8px 0' }}>Os Três Grandes Vilões da Campanha</h3>
                    <ul style={{ margin: 0, paddingLeft: '20px', color: '#fecdd3' }}>
                        <li><strong>Os Dragões Cromáticos & Tiamat:</strong> Rainha de cinco cabeças inspirando dragões vermelhos e negros a invadir as terras dos mortais.</li>
                        <li><strong>Os Cultos do Mal Elemental:</strong> Fanáticos adoradores do Olho Elemental Ancestral tentando corromper templos com fogo, terra, água e ar profanos.</li>
                        <li><strong>O Semideus Iuz:</strong> Tirano cambion que ascendeu ao poder no norte, liderando hordas de orcs e mortos-vivos com planos de escravizar toda Flanaess.</li>
                    </ul>
                </div>
            </div>
        )
    },

    // 12. CARTOGRAFIA INTERATIVA DO MESTRE
    {
        id: 'dmg_greyhawk_maps',
        title: 'Cartografia Interativa do Mestre (3 Mapas Oficiais)',
        category: 'O Cenário de Greyhawk (Cap. 5)',
        content: (
            <div>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <img 
                        src="/assets/dmg/greyhawk_art.jpeg" 
                        alt="Tiamat e Dragões atacando a cidade de Greyhawk" 
                        style={{ maxWidth: '100%', maxHeight: '400px', borderRadius: '10px', boxShadow: '0 8px 24px rgba(0,0,0,0.6)', border: '1px solid #e11d48' }} 
                    />
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '8px' }}>
                        <em>Arte Oficial Guia do Mestre: O cerco dos dragões cromáticos sobre a Cidade Joia de Flanaess.</em>
                    </p>
                </div>

                <h4 style={{ color: '#c5a059', marginBottom: '6px' }}>1. Planta Urbana da Cidade Livre de Greyhawk</h4>
                <ZoomableImage src="/assets/maps/greyhawk_city_map.jpg" alt="Planta Urbana de Greyhawk" />
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '6px', marginBottom: '20px', textAlign: 'center' }}>
                    <em>Os distritos murados: Colina dos Ladrões, Cidade Velha, Bairro dos Magos, Escriburgo e a Grande Cidadela.</em>
                </p>

                <h4 style={{ color: '#c5a059', marginBottom: '6px' }}>2. O Domínio Regional e as Colinas Cairn</h4>
                <ZoomableImage src="/assets/maps/greyhawk_region_map.jpg" alt="Mapa Regional do Domínio de Greyhawk" />
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '6px', marginBottom: '20px', textAlign: 'center' }}>
                    <em>O Rio Selintan, o Grande Lago Nyr Dyv, as ruínas do Castelo Greyhawk e as Colinas Cairn.</em>
                </p>

                <h4 style={{ color: '#c5a059', marginBottom: '6px' }}>3. O Continente de Flanaess (Oerth)</h4>
                <ZoomableImage src="/assets/maps/greyhawk_world_map.jpg" alt="Mapa Continental de Flanaess" />
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '6px', marginBottom: '24px', textAlign: 'center' }}>
                    <em>Os reinos de Furyondy, Veluna, o Império decadente do Grande Reino e as terras do semideus Iuz ao norte.</em>
                </p>
            </div>
        )
    },

    // 13. A CIDADE LIVRE & GOVERNO
    {
        id: 'dmg_greyhawk_city_lore',
        title: 'A Cidade Livre: Distritos, Tavernas & A Oligarquia',
        category: 'O Cenário de Greyhawk (Cap. 5)',
        content: (
            <div>
                <h3 style={{ color: '#c5a059', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>Governo: A Oligarquia Diretora (Directing Oligarchy)</h3>
                <p>
                    A metrópole é governada por <strong>16 Diretores</strong> chefiados pelo <strong>Lorde-Prefeito Nerof Gasgal</strong> (ex-mestre de apostas que ascendeu pela sagacidade política).
                </p>
                <ul>
                    <li><strong>A Vigília da Cidade (City Watch):</strong> Guarnição de 800 soldados comandada pelo <strong>Capitão-General Sental Nureve</strong>.</li>
                    <li><strong>Condestável Derider Fanshen:</strong> Segunda em comando, amada clériga de Pelor e heroína veterana.</li>
                    <li><strong>O Círculo dos Oito (Circle of Eight):</strong> Lendário conclave de arquimagos fundado por <strong>Mordenkainen</strong> (com Bigby, Tenser, Otiluke, Rary, Drawmij, Nystul e Jallarzi).</li>
                </ul>

                <h3 style={{ color: '#c5a059', borderBottom: '1px solid #334155', paddingBottom: '6px', marginTop: '20px' }}>Tavernas Lendárias</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
                    <div style={{ background: '#1c1926', padding: '10px', borderRadius: '6px' }}>
                        <strong style={{ color: '#a78bfa' }}>O Dragão Verde (Green Dragon Inn):</strong> A mais famosa taverna de D&D na Cidade Velha, ponto de encontro de heróis veteranos e contratação de missões.
                    </div>
                    <div style={{ background: '#1c1926', padding: '10px', borderRadius: '6px' }}>
                        <strong style={{ color: '#a78bfa' }}>A Torre Alta (High Tower):</strong> Quartel-general da guilda dos mercadores e casa da moeda oficial de Greyhawk.
                    </div>
                    <div style={{ background: '#1c1926', padding: '10px', borderRadius: '6px' }}>
                        <strong style={{ color: '#a78bfa' }}>A Colina dos Ladrões:</strong> Reduto labiríntico da Guilda dos Ladrões e dos mendigos leais ao Sindicato das Sombras.
                    </div>
                    <div style={{ background: '#1c1926', padding: '10px', borderRadius: '6px' }}>
                        <strong style={{ color: '#a78bfa' }}>O Castelo Greyhawk:</strong> As masmorras originais cavadas pelo arquimago louco Zagyg repletas de horrores e tesouros.
                    </div>
                </div>
            </div>
        )
    },

    // 14. O PANTEÃO OFICIAL DE GREYHAWK
    {
        id: 'dmg_greyhawk_pantheon',
        title: 'O Panteão Oficial de Oerth (16 Deidades - DMG p. 148)',
        category: 'O Cenário de Greyhawk (Cap. 5)',
        content: (
            <div>
                <p style={{ color: '#cbd5e1' }}>Tabela oficial das 16 deidades maiores de Greyhawk:</p>
                <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                        <thead>
                            <tr style={{ background: '#1e1b2e', color: '#e879f9', textAlign: 'left' }}>
                                <th style={{ padding: '6px', border: '1px solid #4a044e' }}>Deidade</th>
                                <th style={{ padding: '6px', border: '1px solid #4a044e' }}>Tendência</th>
                                <th style={{ padding: '6px', border: '1px solid #4a044e' }}>Domínio / Título</th>
                                <th style={{ padding: '6px', border: '1px solid #4a044e' }}>Símbolo Sagrado</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td><strong>Beory</strong></td><td>N</td><td>Deusa-Mãe, Coração de Oerth e Natureza</td><td>Disco verde gravado</td></tr>
                            <tr><td><strong>Boccob</strong></td><td>N</td><td>O Distraído, Magia e Neutralidade Arcana</td><td>Olho dentro de pentagrama</td></tr>
                            <tr><td><strong>Celestian</strong></td><td>NB</td><td>O Andarilho Celestial, Estrelas e Plano Astral</td><td>Arco de sete estrelas</td></tr>
                            <tr><td><strong>Ehlonna</strong></td><td>NB</td><td>Senhora das Florestas, Bosques e Animais</td><td>Unicórnio rampante</td></tr>
                            <tr><td><strong>Fharlanghn</strong></td><td>N</td><td>O Habitante do Horizonte, Estradas e Viagem</td><td>Disco com horizonte curvo</td></tr>
                            <tr><td><strong>Heironeous</strong></td><td>LB</td><td>O Invencível, Justiça, Honra e Cavalaria</td><td>Mão prateada com relâmpago</td></tr>
                            <tr><td><strong>Hextor</strong></td><td>LM</td><td>O Flagelo dos Fracos, Tirania e Guerra Brutal</td><td>Seis braços armados</td></tr>
                            <tr><td><strong>Incabulos</strong></td><td>NM</td><td>O Cavaleiro Negro, Pragas, Fome e Catástrofes</td><td>Olho de réptil em losango</td></tr>
                            <tr><td><strong>Istus</strong></td><td>N</td><td>A Senhora do Destino, Tempo e Teias Cósmicas</td><td>Fuso de ouro e tear</td></tr>
                            <tr><td><strong>Iuz</strong></td><td>CM</td><td>O Velho, Semideus da Opressão e Maldade</td><td>Crânio humano sorridente</td></tr>
                            <tr><td><strong>Nerull</strong></td><td>NM</td><td>O Ceifador, Morte, Escuridão e Submundo</td><td>Caveira com foice rubra</td></tr>
                            <tr><td><strong>Olidammara</strong></td><td>CN</td><td>O Ladino Risonho, Música, Vinho e Trapaça</td><td>Máscara de comédia risonha</td></tr>
                            <tr><td><strong>Pelor</strong></td><td>NB</td><td>O Brilhante, Sol, Luz, Cura e Força Vital</td><td>Sol dourado radiante</td></tr>
                            <tr><td><strong>Ralishaz</strong></td><td>CN</td><td>O Inconstante, Loucura, Desventura e Azar</td><td>Três ossos de roer cruzados</td></tr>
                            <tr><td><strong>St. Cuthbert</strong></td><td>LN</td><td>Da Clava, Retidão, Zelo e Punição</td><td>Círculo com rubi cravado</td></tr>
                            <tr><td><strong>Vecna</strong></td><td>NM</td><td>O Mutilado, Segredos Ocultos e Necromancia</td><td>Mão esquerda decepada e olho</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )
    },

    // =========================================================================
    // 15. SISTEMA OFICIAL DE BASTIÕES (CAPÍTULO 8 - NÍVEL 5+)
    // =========================================================================
    {
        id: 'dmg_bastions_system',
        title: 'Cap. 8: O Sistema Oficial de Bastiões (Nível 5+)',
        category: 'Sistema de Bastiões (Cap. 8)',
        content: (
            <div>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <img 
                        src="/assets/dmg/bastions.jpeg" 
                        alt="Bastião Oficial" 
                        style={{ maxWidth: '100%', maxHeight: '420px', borderRadius: '10px', boxShadow: '0 8px 24px rgba(0,0,0,0.6)', border: '1px solid #e11d48' }} 
                    />
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '8px' }}>
                        <em>A fortaleza viva do aventureiro: Muros, torres de vigia, oficinas e laboratórios.</em>
                    </p>
                </div>

                <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: '1.6' }}>
                    No 5º nível, cada herói adquire o direito de fundar um <strong>Bastião (Bastion)</strong>: uma torre fortificada, monastério, guilda secreta ou laboratório arcano.
                </p>

                <h3 style={{ color: '#f43f5e', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>O Turno de Bastião (Bastion Turn)</h3>
                <p>
                    A cada <strong>7 dias de tempo de jogo</strong> (ou entre aventuras), ocorre um Turno de Bastião:
                </p>
                <ul>
                    <li><strong>Emitir Ordens:</strong> Cada instalação especial recebe uma instrução (ex: a Forja forja armas mágicas, o Laboratório produz poções, a Estufa colhe ervas medicinais raras).</li>
                    <li><strong>Pontos de Bastião (Bastion Points - BP):</strong> Moeda de prestígio gerada pelas instalações para recrutar guardas e encomendar reformas.</li>
                    <li><strong>Rolar Eventos:</strong> O Mestre rola 1d100 para determinar se o bastião foi atacado por bandidos, visitado por nobres ou abençoado por descobertas.</li>
                </ul>
            </div>
        )
    },

    // 16. CATÁLOGO DAS 26 INSTALAÇÕES DE BASTIÃO
    {
        id: 'dmg_bastions_facilities',
        title: 'Catálogo das 26 Instalações Especiais de Bastião',
        category: 'Sistema de Bastiões (Cap. 8)',
        content: (
            <div>
                <p style={{ color: '#cbd5e1' }}>Instalações canônicas disponíveis por nível de personagem:</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
                    <div style={{ background: '#1c1926', padding: '12px', borderRadius: '6px' }}>
                        <strong style={{ color: '#38bdf8' }}>Forja (Smithy - Nv 5):</strong> Forja armaduras e armas de alta qualidade a preço de custo e cria escudos mágicos.
                    </div>
                    <div style={{ background: '#1c1926', padding: '12px', borderRadius: '6px' }}>
                        <strong style={{ color: '#38bdf8' }}>Laboratório Alquímico (Nv 5):</strong> Produz Poções de Cura, Fogo Alquímico e Ácidos destilados semanalmente.
                    </div>
                    <div style={{ background: '#1c1926', padding: '12px', borderRadius: '6px' }}>
                        <strong style={{ color: '#38bdf8' }}>Santuário / Templo (Nv 5):</strong> Concede Água Benta gratuita e bênçãos de proteção espiritual aos defensores.
                    </div>
                    <div style={{ background: '#1c1926', padding: '12px', borderRadius: '6px' }}>
                        <strong style={{ color: '#38bdf8' }}>Biblioteca & Arquivo (Nv 5):</strong> Vantagem em testes de História e Arcanismo sobre monstros e ruínas.
                    </div>
                    <div style={{ background: '#1c1926', padding: '12px', borderRadius: '6px' }}>
                        <strong style={{ color: '#38bdf8' }}>Oficina Arcana (Arcane Study - Nv 9):</strong> Produz Pergaminhos Mágicos de até 3º nível sem falha.
                    </div>
                    <div style={{ background: '#1c1926', padding: '12px', borderRadius: '6px' }}>
                        <strong style={{ color: '#38bdf8' }}>Quartel de Defensores (Barracks - Nv 5):</strong> Abriga até 12 guardas de elite que protegem as muralhas.
                    </div>
                    <div style={{ background: '#1c1926', padding: '12px', borderRadius: '6px' }}>
                        <strong style={{ color: '#38bdf8' }}>Teleporte / Círculo de Teletransporte (Nv 13):</strong> Portal permanente ligado à rede de Greyhawk.
                    </div>
                    <div style={{ background: '#1c1926', padding: '12px', borderRadius: '6px' }}>
                        <strong style={{ color: '#38bdf8' }}>Menagerie / Zooteca Selvagem (Nv 9):</strong> Abriga montarias exóticas (Grifos, Hipogrifos e Pégasos).
                    </div>
                </div>
            </div>
        )
    },

    // 17. TABELA DE EVENTOS DE BASTIÃO
    {
        id: 'dmg_bastions_events',
        title: 'Tabela Oficial de Eventos de Bastião (1d100)',
        category: 'Sistema de Bastiões (Cap. 8)',
        content: (
            <div>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                        <thead>
                            <tr style={{ background: '#27121c', color: '#f43f5e', textAlign: 'left' }}>
                                <th style={{ padding: '6px', border: '1px solid #471a2b' }}>1d100</th>
                                <th style={{ padding: '6px', border: '1px solid #471a2b' }}>Evento</th>
                                <th style={{ padding: '6px', border: '1px solid #471a2b' }}>Efeito Mecânico</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td>01-10</td><td><strong>Ataque de Invasores</strong></td><td>Bandidos ou monstros cercam o bastião; defensores devem lutar ou o grupo perde 100 PO em reparos.</td></tr>
                            <tr><td>11-25</td><td><strong>Solicitação de Refugiados</strong></td><td>Plebeus buscam asilo; acolhê-los concede +20 BP e mão de obra leal.</td></tr>
                            <tr><td>26-50</td><td><strong>Calmaria Próspera</strong></td><td>Nenhum incidente; todas as instalações produzem com +10% de eficiência.</td></tr>
                            <tr><td>51-75</td><td><strong>Visita Diplomática</strong></td><td>Embaixador de Greyhawk oferece aliança ou contrato lucrativo de 500 PO.</td></tr>
                            <tr><td>76-90</td><td><strong>Descoberta Arcanológica</strong></td><td>Operários encontram câmara secreta ancestral com um pergaminho ou gema de 250 PO.</td></tr>
                            <tr><td>91-00</td><td><strong>Bênção dos Deuses</strong></td><td>Milagre celestial sobre o bastião: todos os defensores ganham inspiração heroica contínua por 1 mês!</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )
    },

    // =========================================================================
    // 18. TESOURO, PREÇOS & CONFECÇÃO DE ITENS MÁGICOS (CAPÍTULO 7)
    // =========================================================================
    {
        id: 'dmg_treasure_crafting',
        title: 'Cap. 7: Tesouro, Preços & Confecção de Itens Mágicos',
        category: 'Tesouro & Itens Mágicos (Cap. 7)',
        content: (
            <div>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <img 
                        src="/assets/dmg/magic_items.jpeg" 
                        alt="Dragão Negro Guardando Tesouro Guia do Mestre" 
                        style={{ maxWidth: '100%', maxHeight: '420px', borderRadius: '10px', boxShadow: '0 8px 24px rgba(0,0,0,0.6)', border: '1px solid #e11d48' }} 
                    />
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '8px' }}>
                        <em>Arte Oficial Guia do Mestre: O tesouro ancestral e a forja de relíquias lendárias.</em>
                    </p>
                </div>

                <h3 style={{ color: '#c5a059', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>Tabela Oficial de Criação de Itens Mágicos (Guia do Mestre)</h3>
                <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                        <thead>
                            <tr style={{ background: '#1c1926', color: '#38bdf8', textAlign: 'left' }}>
                                <th style={{ padding: '8px', border: '1px solid #3730a3' }}>Raridade do Item</th>
                                <th style={{ padding: '8px', border: '1px solid #3730a3' }}>Custo de Confecção</th>
                                <th style={{ padding: '8px', border: '1px solid #3730a3' }}>Tempo de Trabalho</th>
                                <th style={{ padding: '8px', border: '1px solid #3730a3' }}>Nível Mínimo</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td><strong>Comum (Common)</strong></td><td>50 PO</td><td>5 dias de trabalho</td><td>3º Nível</td></tr>
                            <tr><td><strong>Incomum (Uncommon)</strong></td><td>200 PO</td><td>10 dias de trabalho</td><td>3º Nível</td></tr>
                            <tr><td><strong>Raro (Rare)</strong></td><td>2.000 PO</td><td>50 dias de trabalho</td><td>6º Nível</td></tr>
                            <tr><td><strong>Muito Raro (Very Rare)</strong></td><td>20.000 PO</td><td>125 dias de trabalho</td><td>11º Nível</td></tr>
                            <tr><td><strong>Lendário (Legendary)</strong></td><td>100.000 PO</td><td>250 dias de trabalho</td><td>17º Nível</td></tr>
                        </tbody>
                    </table>
                </div>

                <h3 style={{ color: '#c5a059', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>Regras de Sintonização (Attunement)</h3>
                <ul>
                    <li>Um herói pode se sintonizar com no máximo <strong>3 itens mágicos simultaneamente</strong> (ou 4 para a subclasse Ladrão do Ladino).</li>
                    <li>Sintonizar exige um Descanso Curto dedicado exclusivamente à concentração no item. Encerrar a sintonização também exige um Descanso Curto.</li>
                </ul>
            </div>
        )
    },

    // 19. CATÁLOGO DE ITENS MÁGICOS ICÔNICOS
    {
        id: 'dmg_magic_items_catalog',
        title: 'Catálogo de Itens Mágicos Icônicos',
        category: 'Tesouro & Itens Mágicos (Cap. 7)',
        content: (
            <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
                    <div style={{ background: '#181b2a', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #38bdf8' }}>
                        <strong style={{ color: '#38bdf8' }}>Arma +1 / +2 / +3 (Incomum a Muito Raro):</strong> Bônus mágico nas jogadas de ataque e dano que supera resistências normais.
                    </div>
                    <div style={{ background: '#181b2a', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #38bdf8' }}>
                        <strong style={{ color: '#38bdf8' }}>Armadura de Adamante (Incomum):</strong> Converte qualquer Acerto Crítico sofrido pelo portador em um acerto normal!
                    </div>
                    <div style={{ background: '#181b2a', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #38bdf8' }}>
                        <strong style={{ color: '#38bdf8' }}>Botas Aladas (Winged Boots - Incomum):</strong> Concede Deslocamento de Voo igual à sua caminhada por até 4 horas acumuladas por dia.
                    </div>
                    <div style={{ background: '#181b2a', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #38bdf8' }}>
                        <strong style={{ color: '#38bdf8' }}>Bolsa de Carga (Bag of Holding - Incomum):</strong> Dimensão de bolso que suporta até 250 kg pesando apenas 7 kg externamente.
                    </div>
                    <div style={{ background: '#181b2a', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #38bdf8' }}>
                        <strong style={{ color: '#38bdf8' }}>Manto de Invisibilidade (Lendário):</strong> Permite puxar o capuz como ação para se tornar invisível por até 2 horas por dia.
                    </div>
                    <div style={{ background: '#181b2a', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #38bdf8' }}>
                        <strong style={{ color: '#38bdf8' }}>Varinha de Mísseis Mágicos (Incomum):</strong> 7 cargas recarregadas ao amanhecer para conjurar rajadas teleguiadas de força sem teste de ataque!
                    </div>
                </div>
            </div>
        )
    }
];
