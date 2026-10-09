import type { RuleSection } from '../RulebookViewer';

// ============================================================================
// DAGGERHEART: LIVRO DO JOGADOR (PLAYER'S RULES)
// ============================================================================
export const DAGGERHEART_PLAYER_SECTIONS: RuleSection[] = [
    {
        id: 'dh_duality_dice',
        title: 'Dados de Dualidade (2d12): Esperança & Medo',
        content: (
            <>
                <p>O <strong>Daggerheart</strong> (Darrington Press / Critical Role) abandona o d20 tradicional em prol de uma narrativa cinematográfica guiada pelos <strong>Dados de Dualidade</strong>.</p>

                <h3>Como Funciona a Rolagem</h3>
                <p>O jogador rola simultaneamente <strong>dois dados de 12 faces (2d12)</strong> com cores distintas:</p>
                <ul>
                    <li><strong style={{ color: '#fbbf24' }}>1 Dado de Esperança (Hope Die)</strong> (Dourado / Luminoso)</li>
                    <li><strong style={{ color: '#c084fc' }}>1 Dado de Medo (Fear Die)</strong> (Púrpura / Escuro)</li>
                </ul>

                <div style={{ background: 'rgba(139, 92, 246, 0.12)', border: '1px solid #7c3aed', padding: '12px', borderRadius: '6px', margin: '15px 0' }}>
                    <code>Resultado = Dado de Esperança + Dado de Medo + Modificador de Atributo</code>
                </div>

                <h3>Os 4 Desfechos Narrativos</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', marginBottom: '15px' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '2px solid #7c3aed', color: '#c4b5fd' }}>
                            <th style={{ padding: '8px' }}>Desfecho</th>
                            <th style={{ padding: '8px' }}>Condição</th>
                            <th style={{ padding: '8px' }}>Consequência em Jogo</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                            <td style={{ padding: '8px', color: '#fef08a' }}><strong>Sucesso com Esperança</strong></td>
                            <td style={{ padding: '8px' }}>Total &ge; Dificuldade<br />Esperança &gt; Medo</td>
                            <td style={{ padding: '8px' }}>Você triunfa! Ganha <strong>1 Ficha de Esperança</strong> e mantém o holofote com os jogadores.</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                            <td style={{ padding: '8px', color: '#e9d5ff' }}><strong>Sucesso com Medo</strong></td>
                            <td style={{ padding: '8px' }}>Total &ge; Dificuldade<br />Medo &gt; Esperança</td>
                            <td style={{ padding: '8px' }}>Você consegue, mas surge uma complicação tensa. O Mestre ganha <strong>1 Ficha de Medo</strong>.</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                            <td style={{ padding: '8px', color: '#fef08a' }}><strong>Falha com Esperança</strong></td>
                            <td style={{ padding: '8px' }}>Total &lt; Dificuldade<br />Esperança &gt; Medo</td>
                            <td style={{ padding: '8px' }}>A ação falha, mas há uma bênção imprevista. O jogador ganha <strong>1 Ficha de Esperança</strong>.</td>
                        </tr>
                        <tr>
                            <td style={{ padding: '8px', color: '#f87171' }}><strong>Falha com Medo</strong></td>
                            <td style={{ padding: '8px' }}>Total &lt; Dificuldade<br />Medo &gt; Esperança</td>
                            <td style={{ padding: '8px' }}>O pior acontece. A ação falha, o Mestre ganha <strong>1 Ficha de Medo</strong> e faz um Movimento duro!</td>
                        </tr>
                    </tbody>
                </table>

                <h3>Sucesso Crítico (Duplas)</h3>
                <p>Se tirar <strong>números idênticos nos dois d12</strong> (ex: dois 4s, dois 8s, dois 12s), é um <strong>Sucesso Crítico automático</strong>! Você limpa 1 Estresse, ganha 1 Esperança e o dano é calculado somando o <em>valor máximo de todos os dados de dano</em> mais a rolagem normal!</p>
            </>
        )
    },
    {
        id: 'dh_tokens',
        title: 'Economia de Esperança (Jogadores) & Medo (Mestre)',
        content: (
            <>
                <p>A tensão dramática em Daggerheart é sustentada pelo ciclo contínuo de recursos entre a mesa e o Mestre:</p>

                <h3>Fichas de Esperança (Hope Tokens - Máximo 6)</h3>
                <p>Cada jogador acumula até 6 fichas de Esperança. São gastas para:</p>
                <ul>
                    <li><strong>Usar uma Experiência:</strong> Gasta 1 Esperança para adicionar o modificador de uma Experiência (+2) à sua rolagem.</li>
                    <li><strong>Ajudar um Aliado:</strong> Gasta 1 Esperança para conceder um <strong>dado d6 de Vantagem</strong> à rolagem de um colega.</li>
                    <li><strong>Ativar Cartas de Domínio:</strong> Canalizar habilidades lendárias dos seus domínios mágicos.</li>
                </ul>

                <h3>Fichas de Medo (Fear Tokens - Máximo 12)</h3>
                <p>O Mestre acumula até 12 fichas de Medo quando os jogadores rolam dados com Medo mais alto. São gastas para:</p>
                <ul>
                    <li>Interromper a iniciativa dos jogadores para acionar monstros ou armadilhas.</li>
                    <li>Ativar ataques devastadores e habilidades especiais dos chefes.</li>
                    <li>Desabar pontes, invocar reforços e complicar o cenário.</li>
                </ul>
            </>
        )
    },
    {
        id: 'dh_damage_thresholds',
        title: 'Limiares de Dano, Armadura & Estresse',
        content: (
            <>
                <p>Daggerheart elimina a contagem de dezenas ou centenas de PV numéricos. O dano é comparado diretamente contra seus <strong>Limiares de Dano</strong>:</p>

                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #7c3aed', margin: '15px 0' }}>
                    <p style={{ margin: '0 0 6px 0' }}><strong>1. Dano Menor (Minor Damage)</strong> (&lt; Limiar Maior): Marca <strong>1 Ponto de Vida (1 HP)</strong>.</p>
                    <p style={{ margin: '0 0 6px 0' }}><strong>2. Dano Maior (Major Damage)</strong> (&ge; Limiar Maior e &lt; Severo): Marca <strong>2 Pontos de Vida (2 HP)</strong>.</p>
                    <p style={{ margin: 0 }}><strong>3. Dano Severo (Severe Damage)</strong> (&ge; Limiar Severo): Marca <strong>3 Pontos de Vida (3 HP)</strong>.</p>
                </div>

                <h3>Slots de Armadura (Armor Slots)</h3>
                <p>Quando sofre dano, você pode <strong>marcar 1 ou mais Slots de Armadura</strong> disponíveis. Cada slot marcado reduz o dano sofrido em <strong>1 patamar</strong> (ex: de Severo para Maior, ou de Maior para Menor)!</p>

                <h3>Slots de Estresse (Stress Slots)</h3>
                <p>Representa esgotamento mental e cansaço heroico. Se todos os seus slots de Estresse estiverem marcados e precisar marcar mais um, você é forçado a marcar <strong>1 Ponto de Vida</strong> no lugar.</p>
            </>
        )
    },
    {
        id: 'dh_classes',
        title: 'As 9 Classes de Daggerheart',
        content: (
            <>
                <p>Cada classe em Daggerheart possui acesso exclusivo a <strong>dois Domínios Mágicos</strong> e um conjunto de habilidades heroicas:</p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '12px', margin: '15px 0' }}>
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #ef4444' }}>
                        <strong style={{ color: '#fca5a5', fontSize: '1rem' }}>Guerreiro (Warrior)</strong>
                        <p style={{ margin: '4px 0', fontSize: '0.85rem' }}><strong>Domínios:</strong> Blade & Bone | <strong>Evasão Inicial:</strong> 9</p>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#cbd5e1' }}>Combatente marcial implacável. Domina todas as armas, canaliza vigor bruto para superar golpes e ataca com fúria devastadora.</p>
                    </div>

                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #3b82f6' }}>
                        <strong style={{ color: '#93c5fd', fontSize: '1rem' }}>Guardião (Guardian)</strong>
                        <p style={{ margin: '4px 0', fontSize: '0.85rem' }}><strong>Domínios:</strong> Valor & Blade | <strong>Evasão Inicial:</strong> 8</p>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#cbd5e1' }}>Muralha viva do grupo. Possui o maior número de slots de armadura e pode interceptar golpes destinados a aliados próximos.</p>
                    </div>

                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #64748b' }}>
                        <strong style={{ color: '#cbd5e1', fontSize: '1rem' }}>Ladino (Rogue)</strong>
                        <p style={{ margin: '4px 0', fontSize: '0.85rem' }}><strong>Domínios:</strong> Midnight & Grace | <strong>Evasão Inicial:</strong> 12</p>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#cbd5e1' }}>Mestre das sombras e da agilidade. Evasão altíssima, ataques surpresa devastadores e facilidade de se ocultar em combate.</p>
                    </div>

                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #16a34a' }}>
                        <strong style={{ color: '#bbf7d0', fontSize: '1rem' }}>Rastreador (Ranger)</strong>
                        <p style={{ margin: '4px 0', fontSize: '0.85rem' }}><strong>Domínios:</strong> Bone & Sage | <strong>Evasão Inicial:</strong> 10</p>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#cbd5e1' }}>Tirador de elite e caçador selvagem. Pode contar com um Companheiro Animal leal ou especializar-se em flechas elementais.</p>
                    </div>

                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #6366f1' }}>
                        <strong style={{ color: '#c7d2fe', fontSize: '1rem' }}>Mago (Wizard)</strong>
                        <p style={{ margin: '4px 0', fontSize: '0.85rem' }}><strong>Domínios:</strong> Codex & Arcana | <strong>Evasão Inicial:</strong> 7</p>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#cbd5e1' }}>Manipulador do conhecimento cósmico. Conjura magias de destruição massiva, barreiras protetoras e teleporte.</p>
                    </div>

                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #8b5cf6' }}>
                        <strong style={{ color: '#c4b5fd', fontSize: '1rem' }}>Feiticeiro (Sorcerer)</strong>
                        <p style={{ margin: '4px 0', fontSize: '0.85rem' }}><strong>Domínios:</strong> Arcana & Midnight | <strong>Evasão Inicial:</strong> 9</p>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#cbd5e1' }}>Magia bruta pulsando nas veias. Converte Estresse em dano adicional catastrófico e molda sombras arcanas.</p>
                    </div>

                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #ec4899' }}>
                        <strong style={{ color: '#fbcfe8', fontSize: '1rem' }}>Bardo (Bard)</strong>
                        <p style={{ margin: '4px 0', fontSize: '0.85rem' }}><strong>Domínios:</strong> Grace & Codex | <strong>Evasão Inicial:</strong> 10</p>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#cbd5e1' }}>Artista e orador magnético. Inspira o grupo gerando Esperança adicional e desorienta adversários com ilusões verbais.</p>
                    </div>

                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #10b981' }}>
                        <strong style={{ color: '#6ee7b7', fontSize: '1rem' }}>Druida (Druid)</strong>
                        <p style={{ margin: '4px 0', fontSize: '0.85rem' }}><strong>Domínios:</strong> Sage & Arcana | <strong>Evasão Inicial:</strong> 9</p>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#cbd5e1' }}>Guardião dos espíritos primordiais. Assume formas bestiais com ataques selvagens e comanda raízes e relâmpagos.</p>
                    </div>

                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #eab308' }}>
                        <strong style={{ color: '#fde047', fontSize: '1rem' }}>Serafim (Seraph)</strong>
                        <p style={{ margin: '4px 0', fontSize: '0.85rem' }}><strong>Domínios:</strong> Splendor & Valor | <strong>Evasão Inicial:</strong> 8</p>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#cbd5e1' }}>Manifestação da luz divina. Concede asas radiantes, cura ferimentos graves dos companheiros e pune a escuridão.</p>
                    </div>
                </div>
            </>
        )
    },
    {
        id: 'dh_domains',
        title: 'Os 9 Domínios & Cartas de Habilidade',
        content: (
            <>
                <p>Os 9 Domínios compõem o baralho de habilidades equipáveis em Daggerheart:</p>

                <ul>
                    <li><strong>Blade:</strong> Maestria no combate corpo a corpo, aparar golpes e desferir cortes precisos.</li>
                    <li><strong>Bone:</strong> Resiliência física bruta, tolerância à dor e instintos corporais primais.</li>
                    <li><strong>Codex:</strong> Tomos antigos, círculos de invocação e estudos de geometria mágica.</li>
                    <li><strong>Grace:</strong> Magnetismo social, acrobacias deslumbrantes e liderança de grupo.</li>
                    <li><strong>Midnight:</strong> Furtividade nas sombras, venenos, truques sujos e invisibilidade.</li>
                    <li><strong>Arcana:</strong> Magia cósmica pura, telecinese, raios de energia e manipulação do espaço.</li>
                    <li><strong>Splendor:</strong> Cura de Pontos de Vida, purificação de aflições e bênçãos douradas.</li>
                    <li><strong>Valor:</strong> Armadura inabalável, defesa de aliados e coragem heroica inquebrável.</li>
                    <li><strong>Sage:</strong> Comunicação com bestas, sabedoria botânica e forças dos elementos naturais.</li>
                </ul>
            </>
        )
    },
    {
        id: 'dh_experiences',
        title: 'O Sistema de Experiências',
        content: (
            <>
                <p>Em vez de uma lista engessada de perícias pré-definidas, cada personagem cria <strong>Experiências Narrativas Livres</strong> baseadas no seu passado (ex: <em>"Guarda Real de Vesper"</em>, <em>"Navegador de Tempestades"</em>, <em>"Furtador de Bolsos de Baixa Renda"</em>):</p>

                <ul>
                    <li>Cada Experiência concede um bônus estático de <strong>+2</strong> na rolagem de dados.</li>
                    <li>Para ativar uma Experiência em um teste onde seu histórico faça sentido narrativo, você gasta <strong>1 Ficha de Esperança</strong> e adiciona o +2 ao total do teste de Dualidade!</li>
                </ul>
            </>
        )
    }
];

// ============================================================================
// DAGGERHEART: GUIA DO MESTRE (GM'S GUIDE)
// ============================================================================
export const DAGGERHEART_GM_SECTIONS: RuleSection[] = [
    {
        id: 'dh_gm_spotlight',
        title: 'O Holofote Dinâmico (Sem Iniciativa Rígida)',
        content: (
            <>
                <p>Daggerheart <strong>não utiliza rolagens rígidas de iniciativa em turnos cíclicos</strong>. O combate flui como uma cena cinematográfica conduzida pelo <strong>Holofote (The Spotlight)</strong>:</p>

                <h3>Como Passa o Holofote</h3>
                <ol style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
                    <li>Os jogadores decidem organicamente quem age primeiro de acordo com a cena de ação.</li>
                    <li>Enquanto os jogadores obtiverem <strong>Sucessos com Esperança</strong>, o holofote permanece com eles: eles continuam agindo, combinando ataques e manobras!</li>
                    <li>Se um jogador rolar com <strong>Medo</strong> (Sucesso com Medo ou Falha com Medo) OU sofrer uma <strong>Falha</strong>, o holofote <strong>transita imediatamente para o Mestre</strong>!</li>
                </ol>
            </>
        )
    },
    {
        id: 'dh_gm_moves',
        title: 'Movimentos do Mestre (Soft & Hard Moves)',
        content: (
            <>
                <p>Quando o holofote passa para o Mestre, ele não rola dados para atacar da mesma forma que os heróis. O Mestre realiza <strong>Movimentos (GM Moves)</strong>:</p>

                <h3>1. Movimentos Suaves (Soft Moves)</h3>
                <p>Avisos de perigo iminente ou complicações de posicionamento: <em>"O chefe ergue sua maça colossal na direção de Lyra; o chão racha sob seus pés!"</em> Os heróis têm a chance de reagir.</p>

                <h3>2. Movimentos Duros (Hard Moves)</h3>
                <p>Dano direto ou perda irreparável: <em>"O chefe desaba a maça causando 18 de dano! O chão afunda e vocês são lançados na ravina!"</em></p>

                <h3>Gastando Fichas de Medo</h3>
                <p>O Mestre pode gastar 1 Ficha de Medo acumulada para interromper uma cadeia de ações dos jogadores, ativar um ataque lendário de um monstro ou invocar uma nova horda de lacaios.</p>
            </>
        )
    },
    {
        id: 'dh_gm_adversaries',
        title: 'Tiers de Adversários & Categorias Táticas',
        content: (
            <>
                <p>Os adversários são categorizados por Tiers (Tier 0 ao Tier 4) e por papéis táticos no combate:</p>

                <ul>
                    <li><strong>Lacaios (Minions):</strong> Criaturas frágeis com 1 HP compartilhado em grupo. Morrem em bando com qualquer acerto.</li>
                    <li><strong>Padrão (Standard):</strong> Soldados equilibrados que representam a linha de frente comum.</li>
                    <li><strong>Brutos (Bruisers):</strong> Tanques robustos com dano severo e múltiplos slots de vida.</li>
                    <li><strong>Líderes (Leaders):</strong> Comandantes que concedem bônus de ataque e reações a outros adversários.</li>
                    <li><strong>Chefes Solitários (Solo Adversaries):</strong> Monstros épicos projetados para lutar sozinhos contra o grupo inteiro, com múltiplas ativações por rodada e ações de Medo exclusivas.</li>
                </ul>
            </>
        )
    }
];
