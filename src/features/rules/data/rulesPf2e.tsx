import type { RuleSection } from '../RulebookViewer';

// ============================================================================
// PATHFINDER 2E REMASTER: LIVRO DO JOGADOR (PLAYER CORE)
// ============================================================================
export const PF2E_PLAYER_SECTIONS: RuleSection[] = [
    {
        id: 'pf2e_actions',
        title: 'A Economia de 3 Ações & Reação',
        content: (
            <>
                <p>O <strong>Pathfinder 2ª Edição (Remaster / Paizo Core)</strong> opera sob uma economia de ações revolucionária, intuitiva e profundamente tática.</p>

                <h3>As 3 Ações por Turno ([1] [2] [3])</h3>
                <p>No início do seu turno de combate, você recebe <strong>3 Ações</strong> para gastar em qualquer combinação que desejar. Algumas atividades consomem 1 ação, enquanto rituais ou feitiços consomem 2 ou 3 ações:</p>

                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', marginBottom: '15px' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '2px solid #0284c7', color: '#7dd3fc' }}>
                            <th style={{ padding: '8px' }}>Ação Típica</th>
                            <th style={{ padding: '8px' }}>Custo</th>
                            <th style={{ padding: '8px' }}>Efeito Resumido</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                            <td style={{ padding: '8px' }}><strong>Golpear (Strike)</strong></td>
                            <td style={{ padding: '8px' }}>[1 Ação]</td>
                            <td style={{ padding: '8px' }}>Desfere um ataque corpo a corpo ou à distância com arma.</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                            <td style={{ padding: '8px' }}><strong>Passo Largo (Stride)</strong></td>
                            <td style={{ padding: '8px' }}>[1 Ação]</td>
                            <td style={{ padding: '8px' }}>Move-se até o seu Deslocamento base (ex: 7,5m ou 9m).</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                            <td style={{ padding: '8px' }}><strong>Passo Ajustado (Step)</strong></td>
                            <td style={{ padding: '8px' }}>[1 Ação]</td>
                            <td style={{ padding: '8px' }}>Move-se 1,5m (1 quadrado) <strong>sem provocar Reações</strong> de ataque inimigas.</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                            <td style={{ padding: '8px' }}><strong>Erguer Escudo (Raise a Shield)</strong></td>
                            <td style={{ padding: '8px' }}>[1 Ação]</td>
                            <td style={{ padding: '8px' }}>Concede +2 de circunstância na CA até seu próximo turno e habilita a reação <em>Bloqueio com Escudo</em>.</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                            <td style={{ padding: '8px' }}><strong>Conjurar Magia (Cast a Spell)</strong></td>
                            <td style={{ padding: '8px' }}>[2 Ações]</td>
                            <td style={{ padding: '8px' }}>A vasta maioria das magias exige 2 ações (palavras de poder + gestos somáticos).</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                            <td style={{ padding: '8px' }}><strong>Buscar Cobertura (Take Cover)</strong></td>
                            <td style={{ padding: '8px' }}>[1 Ação]</td>
                            <td style={{ padding: '8px' }}>Melhora sua cobertura para Cobertura Maior (+4 de circunstância na CA e Reflexos).</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                            <td style={{ padding: '8px' }}><strong>Escapar (Escape)</strong></td>
                            <td style={{ padding: '8px' }}>[1 Ação]</td>
                            <td style={{ padding: '8px' }}>Teste de Desarmado, Atletismo ou Acrobacia contra a CD de quem o agarrou ou imobilizou.</td>
                        </tr>
                        <tr>
                            <td style={{ padding: '8px' }}><strong>Interagir (Interact)</strong></td>
                            <td style={{ padding: '8px' }}>[1 Ação]</td>
                            <td style={{ padding: '8px' }}>Sacar ou guardar armas, abrir portas, apanhar ou beber poções.</td>
                        </tr>
                    </tbody>
                </table>

                <h3>A Reação ([Reação])</h3>
                <p>Você possui <strong>1 Reação por rodada</strong>, que pode ser disparada fora do seu turno mediante gatilhos específicos (como o <em>Ataque Reativo / Reactive Strike</em> do Guerreiro ou o <em>Bloqueio com Escudo</em>). Ela recarrega no início do seu turno.</p>
            </>
        )
    },
    {
        id: 'pf2e_degrees_of_success',
        title: 'Os 4 Graus de Sucesso & Regra do +10/-10',
        content: (
            <>
                <p>No Pathfinder 2e, não basta apenas superar a CD. O grau de domínio da rolagem determina consequências narrativas profundas!</p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '10px', marginBottom: '20px' }}>
                    <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', padding: '12px', borderRadius: '6px' }}>
                        <h4 style={{ color: '#6ee7b7', margin: '0 0 5px 0' }}>1. Sucesso Crítico</h4>
                        <p style={{ margin: 0, fontSize: '0.85rem' }}>Resultado &ge; <strong>CD + 10</strong> (ou 20 Natural promovido). Dano dobrado ou efeito máximo da habilidade.</p>
                    </div>
                    <div style={{ background: 'rgba(2, 132, 199, 0.15)', border: '1px solid #0284c7', padding: '12px', borderRadius: '6px' }}>
                        <h4 style={{ color: '#7dd3fc', margin: '0 0 5px 0' }}>2. Sucesso</h4>
                        <p style={{ margin: 0, fontSize: '0.85rem' }}>Resultado &ge; <strong>CD</strong> e &lt; CD + 10. A ação atinge seu objetivo normal.</p>
                    </div>
                    <div style={{ background: 'rgba(245, 158, 11, 0.15)', border: '1px solid #f59e0b', padding: '12px', borderRadius: '6px' }}>
                        <h4 style={{ color: '#fcd34d', margin: '0 0 5px 0' }}>3. Falha</h4>
                        <p style={{ margin: 0, fontSize: '0.85rem' }}>Resultado &lt; <strong>CD</strong> e &gt; CD - 10. A ação não atinge seu propósito, mas sem desastre.</p>
                    </div>
                    <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', padding: '12px', borderRadius: '6px' }}>
                        <h4 style={{ color: '#fca5a5', margin: '0 0 5px 0' }}>4. Falha Crítica</h4>
                        <p style={{ margin: 0, fontSize: '0.85rem' }}>Resultado &le; <strong>CD - 10</strong> (ou 1 Natural rebaixado). Consequências severas ou complicação drástica.</p>
                    </div>
                </div>

                <h3>Regra do 20 e 1 Natural</h3>
                <ul>
                    <li><strong>20 Natural no d20:</strong> Promove o grau de sucesso em <strong>+1 patamar</strong> (ex: Falha vira Sucesso; Sucesso vira Sucesso Crítico).</li>
                    <li><strong>1 Natural no d20:</strong> Rebaixa o grau de sucesso em <strong>-1 patamar</strong> (ex: Sucesso vira Falha; Falha vira Falha Crítica).</li>
                </ul>
            </>
        )
    },
    {
        id: 'pf2e_map',
        title: 'Múltipla Penalidade de Ataque (MAP)',
        content: (
            <>
                <p>Para encorajar variedade tática (como mover-se, erguer escudo, agarrar ou desmoralizar), cada ataque desferido no mesmo turno sofre uma penalidade cumulativa:</p>

                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #0284c7', margin: '15px 0' }}>
                    <p style={{ margin: '0 0 8px 0' }}><strong>Armas Normais:</strong></p>
                    <p style={{ margin: 0 }}>&bull; 1º Ataque: <strong>MAP 0</strong> (Bônus total de acerto)</p>
                    <p style={{ margin: 0 }}>&bull; 2º Ataque: <strong>MAP -5</strong></p>
                    <p style={{ margin: 0 }}>&bull; 3º Ataque em diante: <strong>MAP -10</strong></p>
                    <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '10px 0' }} />
                    <p style={{ margin: '0 0 8px 0' }}><strong>Armas com Traço Ágil (Agile - Adagas, Garras, Espadas Curtas):</strong></p>
                    <p style={{ margin: 0 }}>&bull; 1º Ataque: <strong>MAP 0</strong></p>
                    <p style={{ margin: 0 }}>&bull; 2º Ataque: <strong>MAP -4</strong></p>
                    <p style={{ margin: 0 }}>&bull; 3º Ataque em diante: <strong>MAP -8</strong></p>
                </div>
                <p><em>Atenção:</em> Ações de manobra marcial como <em>Grapple (Agarrar)</em>, <em>Trip (Derrubar)</em>, <em>Shove (Empurrar)</em> e <em>Disarm (Desarmar)</em> possuem o traço Ataque e também aumentam e sofrem a penalidade do MAP!</p>
            </>
        )
    },
    {
        id: 'pf2e_proficiency',
        title: 'O Sistema de Proficiência (TEML)',
        content: (
            <>
                <p>Todas as jogadas e estatísticas (CA, Perícias, Salvamentos, Magias e Percepção) são regidas pela proficiência em 4 graus matematicamente integrados:</p>

                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', marginBottom: '15px' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '2px solid #0284c7', color: '#7dd3fc' }}>
                            <th style={{ padding: '8px' }}>Grau</th>
                            <th style={{ padding: '8px' }}>Sigla</th>
                            <th style={{ padding: '8px' }}>Bônus Adicionado ao Teste</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}><td>Destreinado (Untrained)</td><td>U</td><td><strong>+0</strong> (não soma o nível do personagem)</td></tr>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}><td>Treinado (Trained)</td><td>T</td><td><strong>+2 + Nível do Personagem</strong></td></tr>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}><td>Especialista (Expert)</td><td>E</td><td><strong>+4 + Nível do Personagem</strong></td></tr>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}><td>Mestre (Master)</td><td>M</td><td><strong>+6 + Nível do Personagem</strong></td></tr>
                        <tr><td>Lendário (Legendary)</td><td>L</td><td><strong>+8 + Nível do Personagem</strong></td></tr>
                    </tbody>
                </table>

                <h3>Os 3 Salvamentos Canônicos</h3>
                <ul>
                    <li><strong>Fortitude (CON):</strong> Resistência física a venenos, doenças e esgotamento biológico.</li>
                    <li><strong>Reflexos (DES):</strong> Velocidade de esquiva contra explosões em área, armadilhas e quedas.</li>
                    <li><strong>Vontade (SAB):</strong> Firmeza mental contra encantamentos, medo psíquico e possessões.</li>
                </ul>

                <h3>Pontos de Herói (Hero Points)</h3>
                <p>Todo personagem começa a sessão com <strong>1 Ponto de Herói</strong> (e pode acumular até 3 por feitos notáveis):</p>
                <ul>
                    <li><strong>Gasto de 1 Ponto:</strong> Rerrola qualquer teste de d20 recém-jogado.</li>
                    <li><strong>Gasto de Todos os Pontos:</strong> Se estiver com a condição <em>Morrendo (Dying)</em>, evita a morte imediata: estabiliza com 0 PV e zera a contagem de Morrendo!</li>
                </ul>
            </>
        )
    },
    {
        id: 'pf2e_classes',
        title: 'As 8 Classes do Player Core (Remaster)',
        content: (
            <>
                <p>As 8 classes basilares do Pathfinder 2e Remaster:</p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '12px', margin: '15px 0' }}>
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #0284c7' }}>
                        <strong style={{ color: '#7dd3fc', fontSize: '1rem' }}>Guerreiro (Fighter)</strong>
                        <p style={{ margin: '4px 0', fontSize: '0.85rem' }}><strong>Atributo Chave:</strong> FOR ou DES | <strong>PV:</strong> 10 + CON</p>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#cbd5e1' }}>Inicia como Especialista em armas (acerto superior a todos os outros combatentes), Ataque Reativo nativo e maestria tática de escudos e manobras.</p>
                    </div>

                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #8b5cf6' }}>
                        <strong style={{ color: '#c4b5fd', fontSize: '1rem' }}>Mago (Wizard)</strong>
                        <p style={{ margin: '4px 0', fontSize: '0.85rem' }}><strong>Atributo Chave:</strong> INT | <strong>PV:</strong> 6 + CON</p>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#cbd5e1' }}>Mestre da tradição mágica Arcana. Prepara magias do grimório, escolhe uma Escola de Magia com magias de foco e formula Teses Arcanas.</p>
                    </div>

                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #10b981' }}>
                        <strong style={{ color: '#6ee7b7', fontSize: '1rem' }}>Ladino (Rogue)</strong>
                        <p style={{ margin: '4px 0', fontSize: '0.85rem' }}><strong>Atributo Chave:</strong> DES ou outro | <strong>PV:</strong> 8 + CON</p>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#cbd5e1' }}>Ataque Furtivo (Sneak Attack d6 em alvos Off-Guard), esquema ladino (Ladrão, Rufião, Escorregadio) e progressão acelerada de perícias.</p>
                    </div>

                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #eab308' }}>
                        <strong style={{ color: '#fde047', fontSize: '1rem' }}>Clérigo (Cleric)</strong>
                        <p style={{ margin: '4px 0', fontSize: '0.85rem' }}><strong>Atributo Chave:</strong> SAB | <strong>PV:</strong> 8 + CON</p>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#cbd5e1' }}>Magia Divina sagrada. Fonte Divina (Divine Font) concede slots gratuitos extras da magia de cura ou dano baseados no Carisma; doutrinas de Guerra ou Enclausurado.</p>
                    </div>

                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #f97316' }}>
                        <strong style={{ color: '#fdba74', fontSize: '1rem' }}>Campeão (Champion)</strong>
                        <p style={{ margin: '4px 0', fontSize: '0.85rem' }}><strong>Atributo Chave:</strong> FOR ou DES | <strong>PV:</strong> 10 + CON</p>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#cbd5e1' }}>Guardião sagrado de causas nobres. Proficiência em armadura pesada, Toque de Cura com foco e Reações de Campeão que punem quem ataca seus aliados.</p>
                    </div>

                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #ec4899' }}>
                        <strong style={{ color: '#fbcfe8', fontSize: '1rem' }}>Bardo (Bard)</strong>
                        <p style={{ margin: '4px 0', fontSize: '0.85rem' }}><strong>Atributo Chave:</strong> CAR | <strong>PV:</strong> 8 + CON</p>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#cbd5e1' }}>Conjurador espontâneo da tradição Oculta. Canaliza composições mágicas (Courageous Anthem) com 1 ação para conceder bônus de status a todo o grupo.</p>
                    </div>

                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #ef4444' }}>
                        <strong style={{ color: '#fca5a5', fontSize: '1rem' }}>Bárbaro (Barbarian)</strong>
                        <p style={{ margin: '4px 0', fontSize: '0.85rem' }}><strong>Atributo Chave:</strong> FOR | <strong>PV:</strong> 12 + CON</p>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#cbd5e1' }}>Maior pool de vida do jogo. Entra em Fúria (+dano estático massivo, PV temporários), adotando um Instinto (Dragão, Gigante, Animal, Fúria Espiritual).</p>
                    </div>

                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #14b8a6' }}>
                        <strong style={{ color: '#5eead4', fontSize: '1rem' }}>Patrulheiro (Ranger)</strong>
                        <p style={{ margin: '4px 0', fontSize: '0.85rem' }}><strong>Atributo Chave:</strong> FOR ou DES | <strong>PV:</strong> 10 + CON</p>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#cbd5e1' }}>Ação Caçar Presa (Hunt Prey). Especializações: Rajada (Flurry reduz penalidade de MAP para -3/-6), Precisão (1d8 extra no primeiro acerto) ou Astúcia.</p>
                    </div>
                </div>
            </>
        )
    },
    {
        id: 'pf2e_ancestries',
        title: 'Ancestralidades de Golarion',
        content: (
            <>
                <p>As ancestralidades do Player Core fornecem atributos, PV inicial e acesso a heranças e talentos ancestrais:</p>

                <ul>
                    <li><strong>Humano (8 PV):</strong> Dois aumentos de atributo livres. Herança Versátil concede 1 talento geral adicional no nível 1.</li>
                    <li><strong>Elfo (6 PV):</strong> Aumentos em DES e INT, fraqueza em CON. Deslocamento ampliado para 9 metros e Visão na Penumbra. Heranças: Elfo da Floresta Antiga, Elfo das Cavernas, Elfo Sussurrante.</li>
                    <li><strong>Anão (10 PV):</strong> Aumentos em CON e SAB, fraqueza em CAR. Visão no Escuro total, estabilidade firme contra empurrões e resistência a venenos.</li>
                    <li><strong>Halfling (6 PV):</strong> Aumentos em DES e SAB, fraqueza em FOR. Agilidade evasiva e o lendário talento <em>Sorte dos Halflings</em> para rerrolar falhas.</li>
                    <li><strong>Goblin (6 PV):</strong> Aumentos em DES e CAR, fraqueza em SAB. Visão no Escuro, dentes afiados com ataque desarmado e afinidade explosiva com fogo e cacos.</li>
                    <li><strong>Gnomo (8 PV):</strong> Aumentos em CON e CAR, fraqueza em FOR. Visão na Penumbra, magia inata feérica e conexão íntima com o Primeiro Mundo.</li>
                    <li><strong>Orc (10 PV):</strong> Aumentos em FOR. Visão no Escuro e o talento <em>Ferocidade dos Orcs</em> para continuar lutando mesmo ao atingir 0 PV.</li>
                    <li><strong>Leshy (8 PV):</strong> Aumentos em CON e SAB, fraqueza em INT. Espíritos da natureza que habitam corpos vegetais animados; não respiram ar comum e se alimentam de fotossíntese.</li>
                </ul>
            </>
        )
    },
    {
        id: 'pf2e_exploration',
        title: 'Táticas de Exploração & Modos de Jogo',
        content: (
            <>
                <p>Fora do combate em turnos, os jogadores declaram <strong>Atividades de Exploração</strong> contínuas:</p>

                <ul>
                    <li><strong>Defender (Defend):</strong> Você caminha com o escudo erguido. No início do combate, sua CA já inclui o bônus de escudo sem gastar ações!</li>
                    <li><strong>Evitar Notar (Avoid Notice):</strong> Move-se furtivamente. No início do combate, você rola <strong>Furtividade como sua Iniciativa</strong>!</li>
                    <li><strong>Batedor (Scout):</strong> Vai na vanguarda observando ameaças. No início do combate, <strong>todo o grupo recebe +1 de bônus de circunstância na Iniciativa</strong>!</li>
                    <li><strong>Procurar (Search):</strong> Examina paredes e piso procurando passagens secretas e armadilhas ativas.</li>
                    <li><strong>Investigar (Investigate):</strong> Rola Recordar Conhecimento contínuo ao observar arquitetura, afrescos e inscrições arcanas.</li>
                </ul>
            </>
        )
    },
    {
        id: 'pf2e_lore',
        title: 'O Mundo de Golarion & Absalom',
        content: (
            <>
                <p>O cenário oficial de Pathfinder é o rico mundo de <strong>Golarion</strong>, vivendo na <strong>Era dos Presságios Perdidos (Age of Lost Omens)</strong> após a morte do deus Aroden.</p>

                <h3>Absalom: A Cidade no Centro do Mundo</h3>
                <p>Erguida há mais de 4.700 anos no centro do Mar Interior:</p>
                <ul>
                    <li><strong>A Catedral da Pedra Estelar:</strong> No meio de um abismo gigantesco dentro da cidade repousa a Pedra Estelar. Mortais que sobreviveram aos seus testes ascenderam à divindade (Iomedae, Cayden Cailean, Norgorber).</li>
                    <li><strong>A Sociedade Pathfinder:</strong> Guilda global de aventureiros, exploradores e arqueólogos que investiga as ruínas esquecidas do mundo.</li>
                </ul>

                <h3>Regiões Icônicas do Mar Interior</h3>
                <ul>
                    <li><strong>Varisia:</strong> Terra fronteiriça de monumentos ciclópicos dos antigos Senhores das Runas (*Runelords*).</li>
                    <li><strong>Cheliax:</strong> Um império aristocrático governado pela Casa Thrune em aliança direta com os diabos de Asmodeus.</li>
                    <li><strong>Mwangi Expanse:</strong> O exuberante berço de impérios ancestrais, cidades celestes e magia primária.</li>
                </ul>
            </>
        )
    }
];

// ============================================================================
// PATHFINDER 2E REMASTER: GUIA DO MESTRE (GM CORE)
// ============================================================================
export const PF2E_GM_SECTIONS: RuleSection[] = [
    {
        id: 'pf2e_gm_dcs',
        title: 'Tabela de CDs por Nível & CDs Simples',
        content: (
            <>
                <p>O balanceamento do PF2e é ancorado na tabela de <strong>Classes de Dificuldade por Nível</strong>:</p>

                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', marginBottom: '15px' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '2px solid #0284c7', color: '#7dd3fc' }}>
                            <th style={{ padding: '6px' }}>Nível</th><th style={{ padding: '6px' }}>CD</th>
                            <th style={{ padding: '6px' }}>Nível</th><th style={{ padding: '6px' }}>CD</th>
                            <th style={{ padding: '6px' }}>Nível</th><th style={{ padding: '6px' }}>CD</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}><td>0</td><td>14</td><td>7</td><td>23</td><td>14</td><td>32</td></tr>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}><td>1</td><td>15</td><td>8</td><td>24</td><td>15</td><td>34</td></tr>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}><td>2</td><td>16</td><td>9</td><td>26</td><td>16</td><td>35</td></tr>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}><td>3</td><td>18</td><td>10</td><td>27</td><td>17</td><td>36</td></tr>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}><td>4</td><td>19</td><td>11</td><td>28</td><td>18</td><td>38</td></tr>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}><td>5</td><td>20</td><td>12</td><td>30</td><td>19</td><td>39</td></tr>
                        <tr><td>6</td><td>22</td><td>13</td><td>31</td><td>20</td><td>40</td></tr>
                    </tbody>
                </table>

                <h3>CDs Simples por Grau de Proficiência</h3>
                <ul>
                    <li>Destreinado (Untrained): <strong>CD 10</strong></li>
                    <li>Treinado (Trained): <strong>CD 15</strong></li>
                    <li>Especialista (Expert): <strong>CD 20</strong></li>
                    <li>Mestre (Master): <strong>CD 30</strong></li>
                    <li>Lendário (Legendary): <strong>CD 40</strong></li>
                </ul>
            </>
        )
    },
    {
        id: 'pf2e_gm_encounters',
        title: 'Orçamento de Encontros por XP',
        content: (
            <>
                <p>O sistema matemático de XP do PF2e é 100% calibrado e confiável:</p>

                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', marginBottom: '15px' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '2px solid #0284c7', color: '#7dd3fc' }}>
                            <th style={{ padding: '8px' }}>Ameaça do Encontro</th>
                            <th style={{ padding: '8px' }}>Orçamento Base (4 Jogadores)</th>
                            <th style={{ padding: '8px' }}>Ajuste por Jogador Extra</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}><td>Trivial</td><td>40 XP</td><td>10 XP</td></tr>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}><td>Baixo (Low)</td><td>60 XP</td><td>15 XP</td></tr>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}><td>Moderado (Moderate)</td><td>80 XP</td><td>20 XP</td></tr>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}><td>Severo (Severe)</td><td>120 XP</td><td>30 XP</td></tr>
                        <tr><td>Extremo (Extreme)</td><td>160 XP</td><td>40 XP</td></tr>
                    </tbody>
                </table>

                <h3>Custo de Criaturas em Relação ao Nível do Grupo (PL)</h3>
                <ul>
                    <li>PL - 4: <strong>10 XP</strong> (Lacaio frágil em grandes hordas)</li>
                    <li>PL - 2: <strong>20 XP</strong> (Soldado raso comum)</li>
                    <li>PL: <strong>40 XP</strong> (Equivalente 1 a 1 a um herói)</li>
                    <li>PL + 2: <strong>80 XP</strong> (Chefe de encontro solo moderado)</li>
                    <li>PL + 3: <strong>120 XP</strong> (Chefe severo altamente letal)</li>
                    <li>PL + 4: <strong>160 XP</strong> (Monstro épico de clímax de campanha)</li>
                </ul>
            </>
        )
    },
    {
        id: 'pf2e_gm_hazards',
        title: 'Perigos & Armadilhas (Hazards)',
        content: (
            <>
                <p>No PF2e, armadilhas e perigos ambientais possuem estatísticas completas, com CA, PV, Imunidades e Fraquezas:</p>

                <h3>Perigos Simples (Simple Hazards)</h3>
                <p>Disparam uma reação imediata quando ativados (ex: alçapão com estacas, dardo envenenado). Desarmados com testes de Ladinagem ou destruídos fisicamente.</p>

                <h3>Perigos Complexos (Complex Hazards)</h3>
                <p>Rola-se Iniciativa para o perigo! Ele atua com ações em cada rodada como se fosse um monstro vivo (ex: sala que se enche de água com lâminas giratórias), exigindo coordenação de todo o grupo.</p>
            </>
        )
    },
    {
        id: 'pf2e_gm_conditions',
        title: 'Condições do Remaster (Off-Guard, Frightened & Dying)',
        content: (
            <>
                <h3>Condições Centrais</h3>
                <ul>
                    <li><strong>Sob Desvantagem Tática (Off-Guard):</strong> Penalidade de circunstância de <strong>-2 na CA</strong>. Aplicada por flanqueamento no grid, estar caído, cego ou surpreso.</li>
                    <li><strong>Amedrontado (Frightened X):</strong> Penalidade de status de -X em <strong>TODOS os testes e CDs</strong> (inclusive CA). Reduz em 1 no final de cada turno da criatura.</li>
                    <li><strong>Caído (Prone):</strong> Fica Off-Guard (-2 CA) e sofre -2 em ataques. Gastar 1 ação <em>Stand</em> para levantar provoca reações de ataque!</li>
                    <li><strong>Desajeitado (Clumsy X):</strong> -X em jogadas baseadas em Destreza (ataques à distância, Reflexos, CA).</li>
                    <li><strong>Enfraquecido (Enfeebled X):</strong> -X em jogadas de Força e dano corpo a corpo.</li>
                </ul>

                <h3>Regras de Morrendo (Dying) e Ferido (Wounded)</h3>
                <p>A 0 PV, a criatura fica inconsciente e adquire <strong>Morrendo 1</strong> (ou Morrendo 2 se o golpe foi Sucesso Crítico):</p>
                <ul>
                    <li>No início do seu turno, faz um <em>Recovery Check</em> (Flat Check d20 puro contra CD 10 + Morrendo).</li>
                    <li>Falha aumenta Morrendo em +1 (Falha Crítica aumenta em +2). Sucesso reduz em 1 (Sucesso Crítico reduz em 2).</li>
                    <li>Ao atingir <strong>Morrendo 4</strong>, o personagem falece.</li>
                    <li>Ao se recuperar, ganha a condição <strong>Ferido (Wounded 1)</strong>. Se cair a 0 PV novamente, seu valor de Morrendo começa em <code>1 + Ferido</code>!</li>
                </ul>
            </>
        )
    }
];
