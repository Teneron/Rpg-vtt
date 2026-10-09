import type { RuleSection } from '../RulebookViewer';

// ============================================================================
// D&D 5E: LIVRO DO JOGADOR (PLAYER'S HANDBOOK / SRD 5.1)
// ============================================================================
export const DND5E_PLAYER_SECTIONS: RuleSection[] = [
    {
        id: 'dnd_intro',
        title: 'Fundamentos & O Teste de d20',
        content: (
            <>
                <p>O <strong>Dungeons & Dragons 5ª Edição (SRD 5.1)</strong> é o RPG de mesa mais jogado do mundo, estruturado sobre heroísmo clássico, fantasia medieval e a mecânica central do <strong>d20</strong>.</p>

                <h3>O Ciclo de Jogo</h3>
                <ol style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
                    <li><strong>O Mestre descreve o ambiente:</strong> Apresenta a sala da masmorra, monstros em emboscada ou NPCs em uma taverna.</li>
                    <li><strong>Os jogadores declaram suas ações:</strong> Descrevem o que seus heróis pretendem fazer.</li>
                    <li><strong>O Mestre arbitra e narra os resultados:</strong> Quando a ação possui risco ou oposição, solicita-se uma rolagem de d20.</li>
                </ol>

                <div style={{ background: 'rgba(225, 29, 72, 0.1)', border: '1px solid #be123c', padding: '12px', borderRadius: '6px', margin: '15px 0' }}>
                    <code>Resultado = 1d20 + Modificador de Atributo + Bônus de Proficiência (se aplicável) &ge; CD ou CA</code>
                </div>
                <p>Se o <strong>Resultado igualar ou superar a Classe de Dificuldade (CD)</strong> ou a <strong>Classe de Armadura (CA)</strong> do alvo, o teste é um <strong>SUCESSO</strong>. O empate sempre beneficia quem jogou o dado!</p>

                <h3>Vantagem e Desvantagem</h3>
                <ul>
                    <li><strong>Vantagem:</strong> Role dois d20 e utilize o <em>maior</em> resultado obtido.</li>
                    <li><strong>Desvantagem:</strong> Role dois d20 e utilize o <em>menor</em> resultado obtido.</li>
                    <li><strong>Regra do Cancelamento:</strong> Não importa quantas fontes de Vantagem ou Desvantagem você possua. Se houver pelo menos uma de cada ativa, elas se anulam mutualmente e você rola 1d20 simples.</li>
                </ul>

                <h3>Acertos e Erros Críticos</h3>
                <p>Nas jogadas de ataque, um <strong>20 natural</strong> no d20 é um acerto crítico automático: você rola <strong>todos os dados de dano do ataque duas vezes</strong> antes de somar seus modificadores. Um <strong>1 natural</strong> no d20 é um erro automático, independente do total de seus bônus.</p>
                <p><em>Arredondamento:</em> Sempre arredonde números fracionários para baixo no D&D, a menos que uma regra declare especificamente o contrário.</p>
            </>
        )
    },
    {
        id: 'dnd_attributes',
        title: 'Os 6 Atributos & Proficiência',
        content: (
            <>
                <p>Cada personagem em D&D é definido por seis atributos centrais (escala típica de 1 a 20 em mortais):</p>

                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', marginBottom: '20px' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '2px solid #be123c', color: '#fda4af' }}>
                            <th style={{ padding: '8px' }}>Atributo</th>
                            <th style={{ padding: '8px' }}>Foco Principal</th>
                            <th style={{ padding: '8px' }}>Perícias Associadas</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                            <td style={{ padding: '8px' }}><strong>Força (FOR)</strong></td>
                            <td style={{ padding: '8px' }}>Potência muscular, ataques corpo a corpo, capacidade de carga e salto.</td>
                            <td style={{ padding: '8px' }}>Atletismo</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                            <td style={{ padding: '8px' }}><strong>Destreza (DES)</strong></td>
                            <td style={{ padding: '8px' }}>Agilidade corporal, reflexos, iniciativa, pontaria à distância e bônus na CA.</td>
                            <td style={{ padding: '8px' }}>Acrobacia, Furtividade, Prestidigitação</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                            <td style={{ padding: '8px' }}><strong>Constituição (CON)</strong></td>
                            <td style={{ padding: '8px' }}>Saúde celular, vigor, pontos de vida adicionais e manter Concentração mágica.</td>
                            <td style={{ padding: '8px' }}>Salvamento contra veneno, frio, calor e esforço contínuo</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                            <td style={{ padding: '8px' }}><strong>Inteligência (INT)</strong></td>
                            <td style={{ padding: '8px' }}>Memória, raciocínio lógico, dedução investigativa e conjuração de magos.</td>
                            <td style={{ padding: '8px' }}>Arcanismo, História, Investigação, Natureza, Religião</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                            <td style={{ padding: '8px' }}><strong>Sabedoria (SAB)</strong></td>
                            <td style={{ padding: '8px' }}>Sensibilidade ao meio, intuição moral, percepção sensorial e fé divina.</td>
                            <td style={{ padding: '8px' }}>Adestrar Animais, Intuição, Medicina, Percepção, Sobrevivência</td>
                        </tr>
                        <tr>
                            <td style={{ padding: '8px' }}><strong>Carisma (CAR)</strong></td>
                            <td style={{ padding: '8px' }}>Magnetismo pessoal, liderança, eloquência e projeção mágica inata.</td>
                            <td style={{ padding: '8px' }}>Atuação, Enganação, Intimidação, Persuasão</td>
                        </tr>
                    </tbody>
                </table>

                <h3>Cálculo do Modificador</h3>
                <p>O modificador de qualquer atributo é derivado da fórmula matemática: <code>(Valor - 10) / 2</code> (arredondado para baixo):</p>
                <ul>
                    <li>10 ou 11 = <strong>+0</strong> | 12 ou 13 = <strong>+1</strong> | 14 ou 15 = <strong>+2</strong></li>
                    <li>16 ou 17 = <strong>+3</strong> | 18 ou 19 = <strong>+4</strong> | 20 = <strong>+5</strong></li>
                </ul>

                <h3>Bônus de Proficiência (PB) por Nível</h3>
                <p>O bônus de proficiência aplica-se a todas as armas, salvamentos e perícias treinadas do personagem:</p>
                <ul>
                    <li><strong>Níveis 1 ao 4:</strong> +2</li>
                    <li><strong>Níveis 5 ao 8:</strong> +3</li>
                    <li><strong>Níveis 9 ao 12:</strong> +4</li>
                    <li><strong>Níveis 13 ao 16:</strong> +5</li>
                    <li><strong>Níveis 17 ao 20:</strong> +6</li>
                </ul>
            </>
        )
    },
    {
        id: 'dnd_classes',
        title: 'As 12 Classes Oficiais (SRD 5.1)',
        content: (
            <>
                <p>D&D 5e oferece 12 classes arquétipas completas, cada uma com mecânicas de progressão e Dados de Vida distintos:</p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '12px', margin: '15px 0' }}>
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #e11d48' }}>
                        <strong style={{ color: '#fda4af', fontSize: '1rem' }}>Bárbaro (Barbarian)</strong>
                        <p style={{ margin: '4px 0', fontSize: '0.85rem' }}><strong>Dado de Vida:</strong> d12 | <strong>Primário:</strong> FOR e CON</p>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#cbd5e1' }}>Guerreiro primal impulsionado por Fúria (+2 dano, resistência a concussão/perfurante/cortante), Defesa Sem Armadura e Ataque Imprudente.</p>
                    </div>

                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #a855f7' }}>
                        <strong style={{ color: '#d8b4fe', fontSize: '1rem' }}>Bardo (Bard)</strong>
                        <p style={{ margin: '4px 0', fontSize: '0.85rem' }}><strong>Dado de Vida:</strong> d8 | <strong>Primário:</strong> CAR</p>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#cbd5e1' }}>Mestre das palavras e do ritmo. Inspiração de Bardo (concede d6-d12 para aliados), Conjurador Pleno versátil e Pau para Toda Obra.</p>
                    </div>

                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #eab308' }}>
                        <strong style={{ color: '#fef08a', fontSize: '1rem' }}>Clérigo (Cleric)</strong>
                        <p style={{ margin: '4px 0', fontSize: '0.85rem' }}><strong>Dado de Vida:</strong> d8 | <strong>Primário:</strong> SAB</p>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#cbd5e1' }}>Canalizador de poder divino. Domínio Divino (Vida, Luz, Guerra, etc.), Canalizar Divindade, Destruir Mortos-Vivos e magias curativas.</p>
                    </div>

                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #10b981' }}>
                        <strong style={{ color: '#86efac', fontSize: '1rem' }}>Druida (Druid)</strong>
                        <p style={{ margin: '4px 0', fontSize: '0.85rem' }}><strong>Dado de Vida:</strong> d8 | <strong>Primário:</strong> SAB</p>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#cbd5e1' }}>Guardião dos segredos primordiais. Transforma-se em animais através da Forma Selvagem (Wild Shape) e conjura fúrias da natureza.</p>
                    </div>

                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #3b82f6' }}>
                        <strong style={{ color: '#93c5fd', fontSize: '1rem' }}>Guerreiro (Fighter)</strong>
                        <p style={{ margin: '4px 0', fontSize: '0.85rem' }}><strong>Dado de Vida:</strong> d10 | <strong>Primário:</strong> FOR ou DES</p>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#cbd5e1' }}>Mestre marcial supremo. Retomar o Fôlego (cura de 1d10+nível), Surto de Ação (ação extra no turno) e até 4 ataques por turno.</p>
                    </div>

                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #06b6d4' }}>
                        <strong style={{ color: '#67e8f9', fontSize: '1rem' }}>Monge (Monk)</strong>
                        <p style={{ margin: '4px 0', fontSize: '0.85rem' }}><strong>Dado de Vida:</strong> d8 | <strong>Primário:</strong> DES e SAB</p>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#cbd5e1' }}>Combatente ascético desarmado. Defesa Sem Armadura, Artes Marciais ágeis e Pontos de Ki (Rajada de Golpes, Passo do Vento, Desarmar).</p>
                    </div>

                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #f59e0b' }}>
                        <strong style={{ color: '#fde68a', fontSize: '1rem' }}>Paladino (Paladin)</strong>
                        <p style={{ margin: '4px 0', fontSize: '0.85rem' }}><strong>Dado de Vida:</strong> d10 | <strong>Primário:</strong> FOR e CAR</p>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#cbd5e1' }}>Guerreiro sagrado do juramento. Destruição Divina (Divine Smite consome slots para dano radiante massivo), Impor as Mãos e Auras.</p>
                    </div>

                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #16a34a' }}>
                        <strong style={{ color: '#bbf7d0', fontSize: '1rem' }}>Patrulheiro (Ranger)</strong>
                        <p style={{ margin: '4px 0', fontSize: '0.85rem' }}><strong>Dado de Vida:</strong> d10 | <strong>Primário:</strong> DES e SAB</p>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#cbd5e1' }}>Batedor implacável de fronteira. Inimigo Favorito, Explorador Natural em terrenos ermos, combate com duas armas ou arco e magias de caça.</p>
                    </div>

                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #64748b' }}>
                        <strong style={{ color: '#cbd5e1', fontSize: '1rem' }}>Ladino (Rogue)</strong>
                        <p style={{ margin: '4px 0', fontSize: '0.85rem' }}><strong>Dado de Vida:</strong> d8 | <strong>Primário:</strong> DES</p>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#cbd5e1' }}>Especialista em precisão e furtividade. Ataque Furtivo (Sneak Attack d6 escalonado com vantagem), Ação Astuta e Evasão contra dano em área.</p>
                    </div>

                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #ec4899' }}>
                        <strong style={{ color: '#fbcfe8', fontSize: '1rem' }}>Feiticeiro (Sorcerer)</strong>
                        <p style={{ margin: '4px 0', fontSize: '0.85rem' }}><strong>Dado de Vida:</strong> d6 | <strong>Primário:</strong> CAR</p>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#cbd5e1' }}>Canalizador nato de magia no sangue. Pontos de Feitiçaria flexíveis e Metamagia (Acelerar Magia, Duplicar Feitiço, Magia Sutil).</p>
                    </div>

                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #8b5cf6' }}>
                        <strong style={{ color: '#c4b5fd', fontSize: '1rem' }}>Bruxo (Warlock)</strong>
                        <p style={{ margin: '4px 0', fontSize: '0.85rem' }}><strong>Dado de Vida:</strong> d8 | <strong>Primário:</strong> CAR</p>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#cbd5e1' }}>Pacto místico com uma entidade de outro mundo. Magia de Pacto no nível máximo que recarrega em Descanso Curto, Raio Místico e Invocações.</p>
                    </div>

                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #6366f1' }}>
                        <strong style={{ color: '#c7d2fe', fontSize: '1rem' }}>Mago (Wizard)</strong>
                        <p style={{ margin: '4px 0', fontSize: '0.85rem' }}><strong>Dado de Vida:</strong> d6 | <strong>Primário:</strong> INT</p>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#cbd5e1' }}>O erudito supremo das artes arcanas. Constrói um Grimório com centenas de magias, especializa-se em uma Tradição Arcana e conjura Rituais.</p>
                    </div>
                </div>
            </>
        )
    },
    {
        id: 'dnd_races',
        title: 'As 9 Raças Oficiais (SRD 5.1)',
        content: (
            <>
                <p>As 9 linhagens ancestrais clássicas de D&D 5e:</p>

                <ul>
                    <li><strong>Humano:</strong> Versáteis e ambiciosos (+1 em todos os atributos OU Humano Variante com +1 em dois atributos, 1 perícia livre e 1 Talento inicial).</li>
                    <li><strong>Elfo:</strong> Graça atemporal (+2 Destreza). Visão no Escuro (18m), Sentidos Aguçados (Percepção), Ancestralidade Feérica (imunidade a sono mágico) e Transe (4h de descanso diário). Sub-raças: <em>Alto Elfo</em> (+1 INT, Truque de Mago), <em>Elfo da Floresta</em> (+1 SAB, 10,5m de deslocamento) e <em>Drow</em> (+1 CAR, Visão Superior 36m).</li>
                    <li><strong>Anão:</strong> Robustez subterrânea (+2 Constituição). Visão no Escuro (18m), Resiliência Anã (resistência e vantagem contra venenos), Treinamento em Armas Anãs e Pedraria. Sub-raças: <em>Anão da Colina</em> (+1 SAB, +1 PV por nível) e <em>Anão da Montanha</em> (+2 FOR, armaduras médias).</li>
                    <li><strong>Halfling:</strong> Pequenos e destemidos (+2 Destreza). Sorte (rola novamente qualquer 1 natural no d20), Bravura contra medo e Agilidade Halfling. Sub-raças: <em>Pés Leves</em> (+1 CAR, Furtividade Natural) e <em>Robusto</em> (+1 CON, resistência a veneno).</li>
                    <li><strong>Draconato (Dragonborn):</strong> Sangue dracônico majestoso (+2 Força, +1 Carisma). Herança de Dragão (Resistência elemental a fogo, frio, raio, ácido ou veneno) e Arma de Sopro devastadora (cone ou linha).</li>
                    <li><strong>Gnomo:</strong> Engenhosos e curiosos (+2 Inteligência). Visão no Escuro (18m) e Astúcia Gnômica (Vantagem em salvamentos mentais de INT, SAB e CAR contra magia). Sub-raças: <em>Gnomo da Floresta</em> (+1 DES, falar com animais) e <em>Gnomo das Rochas</em> (+1 CON, engenhocas mecânicas).</li>
                    <li><strong>Meio-Elfo:</strong> Carisma diplomático (+2 Carisma, +1 em dois outros atributos). Duas proficiências em perícias à escolha, Visão no Escuro e Ancestralidade Feérica.</li>
                    <li><strong>Meio-Orc:</strong> Feras temíveis de combate (+2 Força, +1 Constituição). Visão no Escuro, Intimidador nato, Ataques Selvagens (+1 dado extra no dano crítico) e Resistência Implacável (recusa cair a 0 PV, ficando com 1 PV uma vez por descanso longo).</li>
                    <li><strong>Tiefling:</strong> Linhagem tocada pelos Nove Infernos (+2 Carisma, +1 Inteligência). Visão no Escuro (18m), Resistência Infernal (metade do dano de fogo) e Legado Infernal (magias inatas: Taumaturgia, Repreensão Infernal, Escuridão).</li>
                </ul>
            </>
        )
    },
    {
        id: 'dnd_equipment',
        title: 'Tabela de Armaduras & Armas',
        content: (
            <>
                <h3>Tabela de Armaduras Oficiais</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', marginBottom: '20px' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '2px solid #be123c', color: '#fda4af' }}>
                            <th style={{ padding: '6px' }}>Armadura</th><th style={{ padding: '6px' }}>Custo</th><th style={{ padding: '6px' }}>CA</th><th style={{ padding: '6px' }}>Força Mín.</th><th style={{ padding: '6px' }}>Furtividade</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style={{ background: 'rgba(255,255,255,0.03)' }}><td colSpan={5} style={{ padding: '6px', fontWeight: 'bold', color: '#38bdf8' }}>Armaduras Leves (Soma mod DES total)</td></tr>
                        <tr><td>Acolchoada</td><td>5 po</td><td>11 + DES</td><td>-</td><td>Desvantagem</td></tr>
                        <tr><td>Couro</td><td>10 po</td><td>11 + DES</td><td>-</td><td>Normal</td></tr>
                        <tr><td>Couro Batido</td><td>45 po</td><td>12 + DES</td><td>-</td><td>Normal</td></tr>
                        <tr style={{ background: 'rgba(255,255,255,0.03)' }}><td colSpan={5} style={{ padding: '6px', fontWeight: 'bold', color: '#eab308' }}>Armaduras Médias (Soma mod DES máx +2)</td></tr>
                        <tr><td>Gibão de Peles</td><td>10 po</td><td>12 + DES (máx 2)</td><td>-</td><td>Normal</td></tr>
                        <tr><td>Camisão de Cota de Malha</td><td>50 po</td><td>13 + DES (máx 2)</td><td>-</td><td>Normal</td></tr>
                        <tr><td>Brunea de Escamas</td><td>50 po</td><td>14 + DES (máx 2)</td><td>-</td><td>Desvantagem</td></tr>
                        <tr><td>Peitoral de Aço</td><td>400 po</td><td>14 + DES (máx 2)</td><td>-</td><td>Normal</td></tr>
                        <tr><td>Meia-Armadura</td><td>750 po</td><td>15 + DES (máx 2)</td><td>-</td><td>Desvantagem</td></tr>
                        <tr style={{ background: 'rgba(255,255,255,0.03)' }}><td colSpan={5} style={{ padding: '6px', fontWeight: 'bold', color: '#ef4444' }}>Armaduras Pesadas (Não soma DES)</td></tr>
                        <tr><td>Cota de Anéis</td><td>30 po</td><td>14</td><td>-</td><td>Desvantagem</td></tr>
                        <tr><td>Cota de Malha</td><td>75 po</td><td>16</td><td>FOR 13</td><td>Desvantagem</td></tr>
                        <tr><td>Cota de Talas</td><td>200 po</td><td>17</td><td>FOR 15</td><td>Desvantagem</td></tr>
                        <tr><td>Placas Completas</td><td>1.500 po</td><td>18</td><td>FOR 15</td><td>Desvantagem</td></tr>
                        <tr style={{ background: 'rgba(255,255,255,0.03)' }}><td colSpan={5} style={{ padding: '6px', fontWeight: 'bold', color: '#a855f7' }}>Escudo</td></tr>
                        <tr><td>Escudo de Carvalho/Metal</td><td>10 po</td><td>+2 na CA</td><td>-</td><td>Normal</td></tr>
                    </tbody>
                </table>

                <h3>Armas Marciais e Simples Mais Utilizadas</h3>
                <ul style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                    <li><strong>Espada Longa:</strong> 15 po | 1d8 cortante | Versátil (1d10 com duas mãos)</li>
                    <li><strong>Espada Grande (Montante):</strong> 50 po | 2d6 cortante | Pesada, Duas mãos</li>
                    <li><strong>Machado Grande:</strong> 30 po | 1d12 cortante | Pesada, Duas mãos</li>
                    <li><strong>Rapieira:</strong> 25 po | 1d8 perfurante | Acuidade (pode usar DES no ataque e dano)</li>
                    <li><strong>Adaga:</strong> 2 po | 1d4 perfurante | Acuidade, Leve, Arremesso (6/18m)</li>
                    <li><strong>Arco Longo:</strong> 50 po | 1d8 perfurante | Munição (45/180m), Pesada, Duas mãos</li>
                    <li><strong>Besta Pesada:</strong> 50 po | 1d10 perfurante | Munição (30/120m), Pesada, Recarga</li>
                </ul>
            </>
        )
    },
    {
        id: 'dnd_combat_economy',
        title: 'Economia do Turno em Combate',
        content: (
            <>
                <p>Em combate, cada rodada dura aproximadamente <strong>6 segundos</strong> no mundo de jogo. No seu turno, você tem acesso a:</p>

                <h3>1. Movimento (Movement)</h3>
                <p>Você pode se deslocar até o valor do seu Deslocamento base (tipicamente 9 metros / 30 pés). Esse movimento pode ser dividido livremente antes, entre e depois de suas ações.</p>
                <ul>
                    <li><strong>Terreno Difícil:</strong> Custa o dobro do deslocamento (1,5m custa 3m).</li>
                    <li><strong>Levantar do Chão (Prone):</strong> Custa metade do seu deslocamento total.</li>
                </ul>

                <h3>2. Ação (Action)</h3>
                <p>Seu esforço principal da rodada (Atacar, Conjurar Magia, Disparada, etc. - veja a próxima seção).</p>

                <h3>3. Ação Bônus (Bonus Action)</h3>
                <p>Uma ação rápida concedida por habilidades de classe ou magias (ex: <em>Fúria</em> do Bárbaro, <em>Ação Astuta</em> do Ladino, <em>Palavra Curativa</em>). Você só pode realizar <strong>1 Ação Bônus por turno</strong>.</p>
                <div style={{ background: 'rgba(217, 119, 6, 0.1)', border: '1px solid #d97706', padding: '10px', borderRadius: '6px' }}>
                    <strong>Regra de Magias com Ação Bônus:</strong> Se conjurar uma magia como Ação Bônus, a única outra magia que pode conjurar com sua Ação regular é um Truque (Cantrip) de 1 ação.
                </div>

                <h3>4. Reação (Reaction)</h3>
                <p>Uma resposta instantânea a um gatilho ocorrido fora ou dentro do seu turno (ex: Ataque de Oportunidade quando um inimigo sai do seu alcance sem desengajar; magia <em>Escudo Arcano</em>). Recarrega no início do seu próximo turno (máximo de 1 por rodada).</p>

                <h3>5. Interação Livre com Objeto</h3>
                <p>Você pode realizar uma interação ambiental sem custo (sacar ou embainhar 1 arma, abrir 1 porta destrancada, apanhar 1 poção). Uma segunda interação no mesmo turno requer a ação dedicada <em>Usar Objeto</em>.</p>
            </>
        )
    },
    {
        id: 'dnd_combat_actions',
        title: 'As 10 Ações Oficiais de Combate',
        content: (
            <>
                <p>Durante o combate, você pode escolher uma das seguintes ações oficiais em seu turno:</p>

                <ol style={{ paddingLeft: '20px', lineHeight: '1.7' }}>
                    <li><strong>Atacar (Attack):</strong> Desfira um golpe corpo a corpo ou à distância com arma. Classes marciais recebem <em>Ataque Extra</em> a partir do 5º nível.
                        <ul>
                            <li><em>Agarrar (Grapple):</em> Substitui um ataque por um teste de Força (Atletismo) vs Força (Atletismo) ou Destreza (Acrobacia). Reduz o deslocamento do alvo a 0.</li>
                            <li><em>Empurrar (Shove):</em> Substitui um ataque por um teste resistido para empurrar o alvo 1,5m para trás ou derrubá-lo no chão (Caído / Prone).</li>
                        </ul>
                    </li>
                    <li><strong>Conjurar uma Magia (Cast a Spell):</strong> Canaliza um feitiço com tempo de conjuração de 1 Ação.</li>
                    <li><strong>Disparada (Dash):</strong> Dobra seu deslocamento para o turno atual.</li>
                    <li><strong>Desengajar (Disengage):</strong> Seu movimento no restante da rodada não provoca Ataques de Oportunidade.</li>
                    <li><strong>Esquivar (Dodge):</strong> Até o início do seu próximo turno, qualquer ataque contra você tem Desvantagem (se você puder ver o atacante) e você tem Vantagem em Salvaguardas de Destreza.</li>
                    <li><strong>Ajudar (Help):</strong> Concede Vantagem a um aliado no próximo teste de perícia dele OU na primeira jogada de ataque dele contra um inimigo adjacente a você.</li>
                    <li><strong>Esconder (Hide):</strong> Rola Destreza (Furtividade) contra a Percepção Passiva dos inimigos para se ocultar. Exige cobertura ou escuridão.</li>
                    <li><strong>Preparar Ação (Ready):</strong> Define um gatilho perceptível e prepara uma reação ("Se o goblin passar da porta, atiro minha flecha"). Se preparar magia, gasta o espaço e exige concentração.</li>
                    <li><strong>Procurar (Search):</strong> Dedica a atenção para localizar criaturas invisíveis, armadilhas ou segredos (Percepção ou Investigação).</li>
                    <li><strong>Usar um Objeto (Use an Object):</strong> Aciona itens especiais, bebe poções ou opera mecanismos complexos.</li>
                </ol>
            </>
        )
    },
    {
        id: 'dnd_magic',
        title: 'Regras de Magia & Concentração',
        content: (
            <>
                <p>A magia em D&D é tecida a partir da <strong>Trama (The Weave)</strong>, sustentada pela deusa Mystra nos Reinos Esquecidos.</p>

                <h3>Espaços de Magia (Spell Slots)</h3>
                <p>Representam o limite diário de poder mágico do personagem. Truques (Cantrips) são preces ou técnicas básicas que não gastam espaços e podem ser conjurados à vontade.</p>

                <h3>Componentes Mágicos</h3>
                <ul>
                    <li><strong>Verbal (V):</strong> Entonação mística em voz alta. O conjurador não pode estar silenciado ou amordaçado.</li>
                    <li><strong>Somático (S):</strong> Gestos manuais precisos. Exige pelo menos uma mão livre para executar.</li>
                    <li><strong>Material (M):</strong> Ingredientes físicos. Um <em>Foco Arcano</em> ou <em>Bolsa de Componentes</em> substitui qualquer material que não tenha custo em moedas de ouro indicado na descrição da magia.</li>
                </ul>

                <h3>Regra de Concentração</h3>
                <p>Um conjurador só pode manter <strong>uma magia de concentração por vez</strong>. A concentração é quebrada imediatamente se:</p>
                <ul>
                    <li>Conjurar outra magia que exija concentração.</li>
                    <li><strong>Sofrer Dano:</strong> O conjurador deve passar em um teste de resistência de <strong>Constituição</strong> com CD igual a <strong>10 ou metade do dano sofrido</strong> (o que for maior). Cada ataque que cause dano exige um teste separado!</li>
                    <li>Ficar <strong>Incapacitado</strong>, Inconsciente ou morto.</li>
                </ul>

                <h3>Fórmulas Mágicas Oficiais</h3>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '6px', margin: '10px 0' }}>
                    <p><strong>CD de Resistência de Magia:</strong> <code>8 + PB + Modificador de Conjuração</code></p>
                    <p><strong>Ataque de Magia:</strong> <code>1d20 + PB + Modificador de Conjuração</code></p>
                </div>
            </>
        )
    },
    {
        id: 'dnd_health_death',
        title: 'Pontos de Vida, Descansos & Morte',
        content: (
            <>
                <h3>Descanso Curto (Short Rest)</h3>
                <p>Pelo menos 1 hora de vigília leve e curativos. O personagem pode gastar um ou mais de seus <strong>Dados de Vida</strong> disponíveis para rolar e somar seu Modificador de CON em cura de PV.</p>

                <h3>Descanso Longo (Long Rest)</h3>
                <p>Pelo menos 8 horas contínuas (máximo 1 por período de 24 horas). Recupera <strong>todos os Pontos de Vida</strong>, metade do total de Dados de Vida e todos os espaços de magia.</p>

                <h3>Testes de Morte (Death Saves)</h3>
                <p>Ao cair a <strong>0 Pontos de Vida</strong> sem morrer de imediato, o personagem cai Inconsciente e Moribundo. No início de cada turno, rola 1d20 puro:</p>
                <ul>
                    <li><strong>10 ou mais:</strong> Sucesso (3 sucessos estabilizam o personagem).</li>
                    <li><strong>9 ou menos:</strong> Falha (3 falhas causam a <strong>morte</strong>).</li>
                    <li><strong>1 Natural:</strong> Conta como <strong>DUAS FALHAS</strong>.</li>
                    <li><strong>20 Natural:</strong> O personagem recupera <strong>1 PV</strong> imediatamente e acorda!</li>
                    <li><strong>Sofrer dano a 0 PV:</strong> Conta como 1 falha de morte automática (ou 2 falhas se o golpe for um Acerto Crítico).</li>
                </ul>
                <p><strong>Morte Instantânea por Dano Massivo:</strong> Se o dano restante após levar o personagem a 0 PV igualar ou exceder seu valor máximo de PV, ele morre imediatamente sem realizar testes de morte.</p>
            </>
        )
    },
    {
        id: 'dnd_lore',
        title: 'O Cenário: Reinos Esquecidos & Costa da Espada',
        content: (
            <>
                <p>O universo canônico de D&D 5e situa-se nos <strong>Reinos Esquecidos (Forgotten Realms)</strong>, no continente de <strong>Faerûn</strong>.</p>

                <h3>A Costa da Espada (Sword Coast)</h3>
                <p>Uma região fronteiriça lendária cercada pelo Mar das Espadas a oeste e ermos inóspitos a leste:</p>
                <ul>
                    <li><strong>Águas Profundas (Waterdeep):</strong> A "Cidade dos Esplendores", governada em segredo pelos Lordes Mascarados e situada logo acima do infame megacalabouço de <em>Undermountain</em>.</li>
                    <li><strong>Portal de Baldur (Baldur's Gate):</strong> Uma metrópole mercantil, pragmática e implacável, policiada pela milícia dos Punhos Flamejantes.</li>
                    <li><strong>Neverwinter (Inverno Remoto):</strong> A elegante "Joia do Norte", mantida aquecida pelas águas termais do Monte Hotenow.</li>
                    <li><strong>Candlekeep (Fortaleza da Vela):</strong> A imponente fortaleza-biblioteca no topo das falésias marinhas, guardiã de todo o saber arcano do multiverso.</li>
                </ul>

                <h3>As Grandes Facções</h3>
                <ul>
                    <li><strong>Os Harpistas (The Harpers):</strong> Bardos e espiões altruístas que combatem a tirania pelas sombras.</li>
                    <li><strong>A Ordem da Manopla:</strong> Paladinos e clérigos honrados de Tyr e Helm que combatem o mal abertamente.</li>
                    <li><strong>O Enclave Esmeralda:</strong> Druidas e patrulheiros que defendem o equilíbrio da natureza selvagem.</li>
                    <li><strong>A Aliança dos Lordes:</strong> Coalizão militar das grandes cidades para segurança e comércio.</li>
                    <li><strong>Os Zhentarim (A Rede Negra):</strong> Sindicato mercenário implacável de comércio de armas e contrabando.</li>
                </ul>
            </>
        )
    }
];

// ============================================================================
// D&D 5E: GUIA DO MESTRE (DUNGEON MASTER'S GUIDE / SRD 5.1)
// ============================================================================
export const DND5E_GM_SECTIONS: RuleSection[] = [
    {
        id: 'dnd_gm_dcs',
        title: 'Classes de Dificuldade (CD)',
        content: (
            <>
                <h3>Tabela de Dificuldades Canônicas</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', marginBottom: '20px' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '2px solid #be123c', color: '#fda4af' }}>
                            <th style={{ padding: '8px' }}>Dificuldade</th>
                            <th style={{ padding: '8px' }}>CD</th>
                            <th style={{ padding: '8px' }}>Exemplo Prático</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                            <td style={{ padding: '8px' }}>Muito Fácil</td>
                            <td style={{ padding: '8px' }}>5</td>
                            <td style={{ padding: '8px' }}>Notar um ogro em campo aberto; abrir um trinco de madeira solta.</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                            <td style={{ padding: '8px' }}>Fácil</td>
                            <td style={{ padding: '8px' }}>10</td>
                            <td style={{ padding: '8px' }}>Escalar uma muralha com apoios; arrombar um cadeado rústico.</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                            <td style={{ padding: '8px' }}>Média</td>
                            <td style={{ padding: '8px' }}>15</td>
                            <td style={{ padding: '8px' }}>Ouvir passos atrás de uma porta grossa; recordar história de um túmulo.</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                            <td style={{ padding: '8px' }}>Difícil</td>
                            <td style={{ padding: '8px' }}>20</td>
                            <td style={{ padding: '8px' }}>Nadar contra correnteza violenta; arrombar cofre de banco mercante.</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                            <td style={{ padding: '8px' }}>Muito Difícil</td>
                            <td style={{ padding: '8px' }}>25</td>
                            <td style={{ padding: '8px' }}>Escalar geleira sem corda; decifrar runas do Primeiro Império Élfico.</td>
                        </tr>
                        <tr>
                            <td style={{ padding: '8px' }}>Quase Impossível</td>
                            <td style={{ padding: '8px' }}>30</td>
                            <td style={{ padding: '8px' }}>Rastrear pegadas em rocha lisa sob chuva torrencial de 3 dias.</td>
                        </tr>
                    </tbody>
                </table>
            </>
        )
    },
    {
        id: 'dnd_gm_encounters',
        title: 'Cálculo de Encontros (CR & Orçamento de XP)',
        content: (
            <>
                <p>Em D&D 5e, o <strong>Nível de Desafio (CR)</strong> indica que um monstro representa uma luta adequada para um grupo de 4 aventureiros daquele nível.</p>

                <h3>Orçamento de XP por Personagem (DMG)</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', marginBottom: '15px' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '2px solid #be123c', color: '#fda4af' }}>
                            <th style={{ padding: '6px' }}>Nível</th>
                            <th style={{ padding: '6px' }}>Fácil</th>
                            <th style={{ padding: '6px' }}>Médio</th>
                            <th style={{ padding: '6px' }}>Difícil</th>
                            <th style={{ padding: '6px' }}>Mortal</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}><td>1º</td><td>25 XP</td><td>50 XP</td><td>75 XP</td><td>100 XP</td></tr>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}><td>2º</td><td>50 XP</td><td>100 XP</td><td>150 XP</td><td>200 XP</td></tr>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}><td>3º</td><td>75 XP</td><td>150 XP</td><td>225 XP</td><td>400 XP</td></tr>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}><td>4º</td><td>125 XP</td><td>250 XP</td><td>375 XP</td><td>500 XP</td></tr>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}><td>5º</td><td>250 XP</td><td>500 XP</td><td>750 XP</td><td>1.100 XP</td></tr>
                        <tr><td>10º</td><td>600 XP</td><td>1.200 XP</td><td>1.900 XP</td><td>2.800 XP</td></tr>
                    </tbody>
                </table>

                <h3>Multiplicadores de Horda</h3>
                <p>Multiplique o XP total dos monstros para descobrir a dificuldade real do combate:</p>
                <ul>
                    <li>1 monstro: &times;1</li>
                    <li>2 monstros: &times;1,5</li>
                    <li>3 a 6 monstros: &times;2</li>
                    <li>7 a 10 monstros: &times;2,5</li>
                    <li>11 a 14 monstros: &times;3</li>
                    <li>15+ monstros: &times;4</li>
                </ul>
                <p><em>Nota:</em> O XP distribuído aos jogadores ao final é o <strong>XP Real nominal</strong> dos monstros, sem os multiplicadores de horda!</p>
            </>
        )
    },
    {
        id: 'dnd_gm_conditions',
        title: 'As 15 Condições Oficiais (SRD 5.1)',
        content: (
            <>
                <p>Lista oficial das 15 condições de regras de combate:</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '10px' }}>
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '6px', borderLeft: '3px solid #be123c' }}>
                        <strong>Agarrado (Grappled):</strong> Deslocamento 0. Termina se o agarrador ficar incapacitado ou se o alvo for afastado por efeito forçado.
                    </div>
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '6px', borderLeft: '3px solid #be123c' }}>
                        <strong>Amedrontado (Frightened):</strong> Desvantagem em testes e ataques enquanto puder ver a fonte do medo. Não pode se aproximar voluntariamente.
                    </div>
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '6px', borderLeft: '3px solid #be123c' }}>
                        <strong>Atordoado (Stunned):</strong> Incapacitado, não pode se mover. Falha automática em testes de FOR e DES. Ataques contra têm Vantagem.
                    </div>
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '6px', borderLeft: '3px solid #be123c' }}>
                        <strong>Caído (Prone):</strong> Desvantagem em ataques. Ataques contra têm Vantagem se o atacante estiver a até 1,5m; caso contrário, Desvantagem.
                    </div>
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '6px', borderLeft: '3px solid #be123c' }}>
                        <strong>Cego (Blinded):</strong> Falha automática em testes visuais. Ataques contra têm Vantagem. Seus próprios ataques têm Desvantagem.
                    </div>
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '6px', borderLeft: '3px solid #be123c' }}>
                        <strong>Contido (Restrained):</strong> Deslocamento 0. Ataques contra têm Vantagem; seus ataques têm Desvantagem. Desvantagem em testes de DES.
                    </div>
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '6px', borderLeft: '3px solid #be123c' }}>
                        <strong>Encantado (Charmed):</strong> Não pode atacar o encantador. O encantador tem Vantagem em testes de interação social.
                    </div>
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '6px', borderLeft: '3px solid #be123c' }}>
                        <strong>Envenenado (Poisoned):</strong> Desvantagem em jogadas de ataque e testes de habilidade.
                    </div>
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '6px', borderLeft: '3px solid #be123c' }}>
                        <strong>Incapacitado (Incapacitated):</strong> Não pode realizar ações nem reações. Quebra concentração imediatamente.
                    </div>
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '6px', borderLeft: '3px solid #be123c' }}>
                        <strong>Inconsciente (Unconscious):</strong> Incapacitado, cai no chão. Falha automática em FOR e DES. Ataques a 1,5m que acertem são Críticos automáticos.
                    </div>
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '6px', borderLeft: '3px solid #be123c' }}>
                        <strong>Invisível (Invisible):</strong> Impossível de ser visto sem sentidos especiais. Seus ataques têm Vantagem; ataques contra têm Desvantagem.
                    </div>
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '6px', borderLeft: '3px solid #be123c' }}>
                        <strong>Paralisado (Paralyzed):</strong> Incapacitado, imóvel. Falha em FOR e DES. Ataques contra a 1,5m que acertem são Críticos automáticos.
                    </div>
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '6px', borderLeft: '3px solid #be123c' }}>
                        <strong>Petrificado (Petrified):</strong> Transformado em pedra. Peso &times;10. Incapacitado. Resistência a todo tipo de dano; imune a veneno.
                    </div>
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '6px', borderLeft: '3px solid #be123c' }}>
                        <strong>Surdo (Deafened):</strong> Não pode ouvir. Falha automática em testes que exijam audição.
                    </div>
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '6px', borderLeft: '3px solid #be123c' }}>
                        <strong>Exaustão (6 Níveis):</strong> 1: Desv. em perícias | 2: Desl. pela metade | 3: Desv. em ataques/saves | 4: PV máx pela metade | 5: Desl. 0 | 6: MORTE.
                    </div>
                </div>
            </>
        )
    },
    {
        id: 'dnd_gm_environment',
        title: 'Perigos, Cobertura, Queda & Iluminação',
        content: (
            <>
                <h3>Regras de Cobertura</h3>
                <ul>
                    <li><strong>Meia Cobertura (+2):</strong> Concede +2 na CA e em Salvaguardas de Destreza (barril, mureta, criatura aliada ou inimiga no caminho).</li>
                    <li><strong>Três Quartos de Cobertura (+5):</strong> Concede +5 na CA e em Salvaguardas de Destreza (seteira de castelo, grade de ferro espessa).</li>
                    <li><strong>Cobertura Total:</strong> O alvo não pode ser alvejado diretamente por ataques ou feitiços que exijam linha de visão.</li>
                </ul>

                <h3>Queda e Sufocamento</h3>
                <p><strong>Dano de Queda:</strong> 1d6 de dano de concussão para cada 3 metros (10 pés) de queda, até o teto de <strong>20d6</strong> (60 metros). A criatura aterrissa Caída (Prone).</p>
                <p><strong>Sufocamento:</strong> Pode prender a respiração por <code>1 + Mod CON minutos</code> (mínimo 30 seg). Ao esgotar o ar, sobrevive por <code>Mod CON rodadas</code> antes de cair a 0 PV e entrar em testes de morte.</p>

                <h3>Níveis de Luz e Visão</h3>
                <ul>
                    <li><strong>Luz Plena (Bright Light):</strong> Visão normal sem penalidades.</li>
                    <li><strong>Meia-Luz (Dim Light / Penumbra):</strong> Cria área de pouca visibilidade; criaturas sofrem <strong>Desvantagem em testes de Sabedoria (Percepção)</strong> baseados em visão.</li>
                    <li><strong>Escuridão (Darkness):</strong> Área de visibilidade nula. Criaturas sem visão no escuro sofrem a condição Cego.</li>
                </ul>
            </>
        )
    },
    {
        id: 'dnd_gm_magic_items',
        title: 'Itens Mágicos & Sintonização (Attunement)',
        content: (
            <>
                <p>Itens mágicos concedem poderes extraordinários e são classificados por raridade:</p>

                <h3>Escala de Raridade</h3>
                <ul>
                    <li><strong>Comum:</strong> Poção de Curar (2d4+2 PV), Pergaminho de Truque.</li>
                    <li><strong>Incomum:</strong> Espada +1, Botas Élficas, Varinha de Projéteis Mágicos.</li>
                    <li><strong>Raro:</strong> Armadura +1, Anel de Proteção, Manto de Deslocamento.</li>
                    <li><strong>Muito Raro:</strong> Arma +2, Espada da Dança, Tomo de Liderança.</li>
                    <li><strong>Lendário & Artefato:</strong> Espada Sagrada Vingadora, Olho e Mão de Vecna.</li>
                </ul>

                <h3>Regras de Sintonização (Attunement)</h3>
                <p>Certos itens poderosos exigem que um herói crie um elo místico durante um descanso curto dedicado. Cada personagem pode estar sintonizado a no <strong>máximo 3 itens mágicos simultaneamente</strong>.</p>
            </>
        )
    }
];
