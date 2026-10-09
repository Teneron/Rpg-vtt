import type { RuleSection } from '../../RulebookViewer';
import { ZoomableImage } from '../../../../components/ZoomableImage';

export const DND55E_CORE_PLAYER_SECTIONS: RuleSection[] = [
    // =========================================================================
    // 1. INTRODUÇÃO & O CENÁRIO DE GREYHAWK
    // =========================================================================
    {
        id: 'phb_intro_world',
        title: 'O Cenário de Greyhawk & Oerth',
        category: 'Introdução & Cenário',
        content: (
            <div>
                <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '16px' }}>
                    Bem-vindo a <strong>Greyhawk</strong>, o berço lendário das aventuras de <em>Dungeons & Dragons</em>, oficializado como o cenário central das regras revisadas de 2024.
                    No mundo de <strong>Oerth</strong>, o continente de <strong>Flanaess</strong> se recupera de guerras antigas e cataclismos mágicos, enquanto a gloriosa <strong>Cidade Livre de Greyhawk</strong> atrai aventureiros, sábios e mercenários de todos os cantos.
                </p>

                <div style={{ background: 'rgba(225, 29, 72, 0.08)', border: '1px solid #e11d48', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
                    <h3 style={{ color: '#f43f5e', margin: '0 0 8px 0' }}>Cartografia Interativa de Greyhawk (Role com o scroll para aproximar)</h3>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#fda4af' }}>
                        Utilize a ferramenta de zoom interativo para navegar pelos distritos da Cidade Livre, as estradas das Colinas Cairn e os reinos de Flanaess Oriental.
                    </p>
                </div>

                <h3 style={{ color: '#e11d48', marginBottom: '8px' }}>1. A Cidade Livre de Greyhawk (Planta Urbana Oficial)</h3>
                <ZoomableImage src="/assets/maps/greyhawk_city_map.jpg" alt="Mapa da Cidade Livre de Greyhawk" />
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '6px', marginBottom: '24px', textAlign: 'center' }}>
                    <em>A Cidade Joia de Flanaess: Da Colina dos Ladrões e Cidade Velha ao Bairro Nobre, Escriburgo e a Grande Cidadela.</em>
                </p>

                <h3 style={{ color: '#e11d48', marginBottom: '8px' }}>2. O Domínio de Greyhawk e as Colinas Cairn (Hex Regional)</h3>
                <ZoomableImage src="/assets/maps/greyhawk_region_map.jpg" alt="Mapa Regional de Greyhawk e Colinas Cairn" />
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '6px', marginBottom: '24px', textAlign: 'center' }}>
                    <em>A região circunvizinha: O Rio Selintan, as ruínas do Castelo Greyhawk de Zagyg, Lago Diamante e as Colinas Cairn.</em>
                </p>

                <h3 style={{ color: '#e11d48', marginBottom: '8px' }}>3. Flanaess Oriental (Oerth - Mapa Continental)</h3>
                <ZoomableImage src="/assets/maps/greyhawk_world_map.jpg" alt="Mapa Continental de Flanaess" />
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '6px', marginBottom: '24px', textAlign: 'center' }}>
                    <em>Flanaess: As terras de Furyondy, Veluna, as Terras do Escudo, o Império de Iuz e os limites do Mar Sem Sol.</em>
                </p>

                <h3 style={{ color: '#c5a059' }}>Os Três Pilares da Aventura</h3>
                <ul style={{ lineHeight: '1.8' }}>
                    <li><strong>Exploração:</strong> Mover-se por masmorras, ruínas ancestrais e ermos perigosos, decifrando armadilhas e navegando pelo ambiente.</li>
                    <li><strong>Interação Social:</strong> Dialogar com plebeus, nobres, mercadores e monstros inteligentes, negociando alianças ou desmascarando mentiras.</li>
                    <li><strong>Combate:</strong> Batalhas táticas por turnos, onde heróis combinam perícias marciais, maestria de armas e magias para derrotar inimigos mortais.</li>
                </ul>
            </div>
        )
    },

    // =========================================================================
    // 2. CRIAÇÃO DE PERSONAGEM PASSO A PASSO (CAPÍTULO 2)
    // =========================================================================
    {
        id: 'phb_char_creation_step_by_step',
        title: 'Criação de Personagem Passo a Passo (Cap. 2)',
        category: 'Criação de Personagens (Cap. 2)',
        content: (
            <div>
                <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '16px' }}>
                    Em D&D 5.5e, a criação de personagem foi aperfeiçoada em uma sequência lógica e balanceada onde sua história de vida e treinamento (<strong>Antecedente</strong>) moldam seus atributos primários e fornecem um talento de origem no nível 1!
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', marginBottom: '24px' }}>
                    <div style={{ background: '#1e1b2e', border: '1px solid #7c3aed', padding: '14px', borderRadius: '8px' }}>
                        <h4 style={{ color: '#c084fc', margin: '0 0 6px 0' }}>Passo 1: Escolha a Classe</h4>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#e9d5ff' }}>
                            Determina seu Dado de Vida (PV), proficiências de armas/armaduras, salvaguardas primárias, maestrias de armas e progressão inicial de habilidades.
                        </p>
                    </div>

                    <div style={{ background: '#1e1b2e', border: '1px solid #7c3aed', padding: '14px', borderRadius: '8px' }}>
                        <h4 style={{ color: '#c084fc', margin: '0 0 6px 0' }}>Passo 2: Determine os Atributos</h4>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#e9d5ff' }}>
                            Utilize o sistema de Compra por Pontos (Point Buy: 27 pontos, custos de 8 a 15) ou a Matriz Padrão oficial: <strong>15, 14, 13, 12, 10, 8</strong>.
                        </p>
                    </div>

                    <div style={{ background: '#1e1b2e', border: '1px solid #7c3aed', padding: '14px', borderRadius: '8px' }}>
                        <h4 style={{ color: '#c084fc', margin: '0 0 6px 0' }}>Passo 3: Escolha o Antecedente (Background)</h4>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#e9d5ff' }}>
                            Concede <strong>+2 em um atributo e +1 em outro</strong> (ou +1 em três), proficiência em 2 perícias, 1 conjunto de ferramentas e o crucial <strong>Talento de Origem obrigatório</strong>!
                        </p>
                    </div>

                    <div style={{ background: '#1e1b2e', border: '1px solid #7c3aed', padding: '14px', borderRadius: '8px' }}>
                        <h4 style={{ color: '#c084fc', margin: '0 0 6px 0' }}>Passo 4: Escolha a Espécie (Species)</h4>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#e9d5ff' }}>
                            Define traços biológicos: tamanho, deslocamento (9m padrão), visão no escuro e traços ancestrais como sopro dracônico, transe ou astúcia gnômica.
                        </p>
                    </div>

                    <div style={{ background: '#1e1b2e', border: '1px solid #7c3aed', padding: '14px', borderRadius: '8px' }}>
                        <h4 style={{ color: '#c084fc', margin: '0 0 6px 0' }}>Passo 5: Alinhamento & Equipamento</h4>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#e9d5ff' }}>
                            Escolha a bússola moral do seu personagem (Leal, Caótico, Bom, Mau, Neutro) e selecione o pacote de equipamento inicial de classe e antecedente (ou 50 PO).
                        </p>
                    </div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid #334155', padding: '14px', borderRadius: '8px' }}>
                    <h4 style={{ color: '#c5a059', margin: '0 0 6px 0' }}>Cálculo dos Pontos de Vida (PV) Iniciais</h4>
                    <code style={{ color: '#f43f5e', fontSize: '0.95rem' }}>
                        PV Nível 1 = Valor Máximo do Dado de Vida da Classe + Modificador de Constituição (+ bônus de espécie/talento)
                    </code>
                    <p style={{ margin: '6px 0 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>
                        Exemplo: Um Guerreiro com Dado d10 e CON 16 (+3) começa com <code>10 + 3 = 13 PV</code>. Se for da espécie Anão (+1 PV por nível), começa com 14 PV!
                    </p>
                </div>
            </div>
        )
    },

    // =========================================================================
    // 3. CAPÍTULO 1: JOGANDO O JOGO & REGRAS CENTRAIS
    // =========================================================================
    {
        id: 'phb_core_rules',
        title: 'Cap. 1: Testes de D20, Vantagem & Inspiração',
        category: 'Regras Centrais (Cap. 1)',
        content: (
            <div>
                <p>
                    Dungeons & Dragons 5.5e é fundamentado sobre a mecânica de <strong>Testes de D20 (D20 Tests)</strong>.
                    Sempre que seu herói tenta um ato com chance de falha ou desafio, você rola um d20, adiciona modificadores e compara ao número alvo estipulado.
                </p>

                <div style={{ background: 'rgba(225, 29, 72, 0.12)', border: '1px solid #e11d48', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
                    <h4 style={{ color: '#f43f5e', margin: '0 0 8px 0' }}>A Fórmula Universal do Teste de D20:</h4>
                    <code style={{ fontSize: '1.05rem', color: '#fecdd3', display: 'block', padding: '6px', background: 'rgba(0,0,0,0.3)', borderRadius: '4px' }}>
                        Resultado = 1d20 + Modificador de Atributo + Bônus de Proficiência (se aplicável)
                    </code>
                    <p style={{ margin: '8px 0 0 0', fontSize: '0.9rem', color: '#fda4af' }}>
                        Se o total final for <strong>igual ou maior</strong> que a Classe de Dificuldade (CD) ou Classe de Armadura (CA), a ação é um <strong>Sucesso</strong>!
                    </p>
                </div>

                <h3>Os Três Tipos de Teste de D20</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', marginBottom: '20px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #38bdf8' }}>
                        <strong style={{ color: '#38bdf8' }}>1. Teste de Atributo (Ability Check)</strong>
                        <p style={{ fontSize: '0.85rem', margin: '6px 0 0 0', color: '#cbd5e1' }}>
                            Superar desafios contra uma CD determinada pelo Mestre (ex: arrombar uma fechadura com Prestidigitação, escalar uma muralha com Atletismo).
                        </p>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #4ade80' }}>
                        <strong style={{ color: '#4ade80' }}>2. Salvaguarda (Saving Throw)</strong>
                        <p style={{ fontSize: '0.85rem', margin: '6px 0 0 0', color: '#cbd5e1' }}>
                            Resistência involuntária a perigos mortais como sopros de dragão, venenos, magias ou desmoronamentos.
                        </p>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #f43f5e' }}>
                        <strong style={{ color: '#f43f5e' }}>3. Jogada de Ataque (Attack Roll)</strong>
                        <p style={{ fontSize: '0.85rem', margin: '6px 0 0 0', color: '#cbd5e1' }}>
                            Desferir ataques com armas, magias ou desarmado contra a Classe de Armadura (CA) do defensor.
                        </p>
                    </div>
                </div>

                <h3>Inspiração Heroica (Heroic Inspiration)</h3>
                <p>
                    A Inspiração Heroica é um recurso tático fundamental no D&D 5.5e:
                </p>
                <ul>
                    <li><strong>Como Usar:</strong> Imediatamente após rolar um d20 em qualquer Teste de D20, você pode gastar sua Inspiração Heroica para <strong>rerolar o d20 e escolher qual dos dois resultados utilizar</strong>!</li>
                    <li><strong>Como Obter:</strong> O Mestre pode conceder Inspiração por interpretação memorável, resolução genial de problemas ou sacrifício altruísta. Algumas espécies (como Humano) e habilidades de classe concedem Inspiração automaticamente após descansos ou sucessos críticos!</li>
                    <li><strong>Passar Inspiração:</strong> Se você ganhar Inspiração Heroica e já possuir uma, pode transferi-la imediatamente para outro personagem jogador aliado que não a possua!</li>
                </ul>

                <h3>Vantagem e Desvantagem</h3>
                <p>
                    Quando circunstâncias externas favorecem ou prejudicam o teste:
                    <br />&bull; <strong>Vantagem:</strong> Role dois d20s e utilize o <strong>maior</strong> número.
                    <br />&bull; <strong>Desvantagem:</strong> Role dois d20s e utilize o <strong>menor</strong> número.
                    <br />&bull; Múltiplas fontes de vantagem ou desvantagem não se acumulam; se você tiver ao menos uma vantagem e ao menos uma desvantagem ativas no mesmo teste, elas se anulam mutuamente.
                </p>
            </div>
        )
    },

    // =========================================================================
    // 4. COMBATE TÁTICO, AÇÕES & ATAQUES DESARMADOS
    // =========================================================================
    {
        id: 'phb_combat_actions',
        title: 'Combate Tático, Ações & Ataques Desarmados',
        category: 'Regras Centrais (Cap. 1)',
        content: (
            <div>
                <p>
                    O combate em D&D 5.5e se divide em rodadas de 6 segundos. Cada criatura age em sua iniciativa e dispõe de uma economia tática de turnos:
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginBottom: '20px' }}>
                    <div style={{ background: '#1c1917', border: '1px solid #78350f', padding: '10px', borderRadius: '6px' }}>
                        <strong style={{ color: '#f59e0b' }}>Ação (Action)</strong>
                        <p style={{ fontSize: '0.8rem', margin: '4px 0 0 0', color: '#d6d3d1' }}>Sua atividade principal no turno (Atacar, Conjurar Magia, Disparar, etc.).</p>
                    </div>
                    <div style={{ background: '#1c1917', border: '1px solid #78350f', padding: '10px', borderRadius: '6px' }}>
                        <strong style={{ color: '#f59e0b' }}>Ação Bônus (Bonus Action)</strong>
                        <p style={{ fontSize: '0.8rem', margin: '4px 0 0 0', color: '#d6d3d1' }}>Ação rápida desbloqueada por magias (ex: Passo Nebuloso) ou traços (Fúria, Retomar o Fôlego).</p>
                    </div>
                    <div style={{ background: '#1c1917', border: '1px solid #78350f', padding: '10px', borderRadius: '6px' }}>
                        <strong style={{ color: '#f59e0b' }}>Reação (Reaction)</strong>
                        <p style={{ fontSize: '0.8rem', margin: '4px 0 0 0', color: '#d6d3d1' }}>Resposta imediata a um gatilho fora ou dentro do seu turno (Ataque de Oportunidade, Escudo).</p>
                    </div>
                    <div style={{ background: '#1c1917', border: '1px solid #78350f', padding: '10px', borderRadius: '6px' }}>
                        <strong style={{ color: '#f59e0b' }}>Movimento (Movement)</strong>
                        <p style={{ fontSize: '0.8rem', margin: '4px 0 0 0', color: '#d6d3d1' }}>Pode dividir seu deslocamento total antes, entre e após suas ações e ataques.</p>
                    </div>
                </div>

                <div style={{ background: 'rgba(225, 29, 72, 0.15)', border: '2px solid #e11d48', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
                    <h3 style={{ color: '#f43f5e', margin: '0 0 8px 0' }}>Ataque Desarmado (Unarmed Strike)</h3>
                    <p style={{ fontSize: '0.92rem', color: '#fecdd3', lineHeight: '1.6', margin: 0 }}>
                        No D&D 5.5e, ao realizar um Ataque Desarmado, você escolhe uma das <strong>três opções a seguir</strong>. Não há mais testes contestados de Atletismo!
                    </p>
                    <ul style={{ color: '#fda4af', paddingLeft: '20px', marginTop: '10px', lineHeight: '1.7' }}>
                        <li>
                            <strong>1. Dano (Damage):</strong> Faça uma jogada de ataque corpo a corpo contra a CA do alvo. Se acertar, causa <code>1 + mod de Força</code> de dano de Concussão (ou dado de Artes Marciais do Monge).
                        </li>
                        <li>
                            <strong>2. Agarrar (Grapple):</strong> Você não faz jogada de ataque! Em vez disso, o alvo deve fazer uma <strong>salvaguarda de Força ou Destreza</strong> (à escolha dele) contra a sua CD de Agarrar:
                            <code style={{ display: 'block', margin: '4px 0', padding: '4px 8px', background: 'rgba(0,0,0,0.4)', borderRadius: '4px' }}>
                                CD de Agarrar / Escape = 8 + seu Modificador de Força + seu Bônus de Proficiência (PB)
                            </code>
                            Se o alvo falhar na salvaguarda, ele sofre a condição <strong>Agarrado (Grappled)</strong>!
                        </li>
                        <li>
                            <strong>3. Empurrar (Shove):</strong> O alvo realiza uma salvaguarda de Força ou Destreza contra a sua CD (<code>8 + FOR + PB</code>). Se falhar, você escolhe: <strong>empurrá-lo 1,5 metro</strong> para longe de você OU derrubá-lo <strong>Caído (Prone)</strong> no chão!
                        </li>
                    </ul>
                </div>

                <h3>Catálogo de Ações em Combate</h3>
                <ul style={{ lineHeight: '1.8' }}>
                    <li><strong>Atacar (Attack):</strong> Desferir ataques com armas corpo a corpo, à distância ou desarmados.</li>
                    <li><strong>Conjurar Magia (Cast a Spell / Magic):</strong> Lançar um feitiço cujo tempo de conjuração seja 1 Ação.</li>
                    <li><strong>Disparada (Dash):</strong> Ganha movimento adicional igual ao seu Deslocamento atual para a rodada.</li>
                    <li><strong>Desengajar (Disengage):</strong> Seu movimento não provoca ataques de oportunidade até o fim do turno.</li>
                    <li><strong>Esquivar (Dodge):</strong> Até o início do seu próximo turno, qualquer ataque contra você tem Desvantagem (se você puder ver o atacante) e você tem Vantagem em salvaguardas de Destreza.</li>
                    <li><strong>Ajudar (Help):</strong> Concede Vantagem a um aliado em seu próximo teste de atributo ou jogada de ataque contra um inimigo a até 1,5m.</li>
                    <li><strong>Esconder-se (Hide):</strong> Faz um teste de Destreza (Furtividade) CD 15 para adquirir a condição <em>Invisível</em> enquanto permanecer oculto.</li>
                    <li><strong>Preparar (Ready):</strong> Define um gatilho perceptível e prepara uma ação para acionar como Reação quando o evento ocorrer.</li>
                    <li><strong>Procurar (Search):</strong> Dedica seu foco com Sabedoria (Percepção) ou Inteligência (Investigação) para localizar criaturas ou pistas.</li>
                    <li><strong>Usar Objeto (Utilize):</strong> Interagir com poções, alavancas, lanternas ou mecanismos complexos.</li>
                </ul>
            </div>
        )
    },

    // =========================================================================
    // 5. DANO, MORTE, DESCANSOS & AS 15 CONDIÇÕES OFICIAIS
    // =========================================================================
    {
        id: 'phb_damage_conditions',
        title: 'Dano, Morte, Descansos & 15 Condições',
        category: 'Regras Centrais (Cap. 1)',
        content: (
            <div>
                <h3 style={{ color: '#c5a059', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>Regras de Dano & Sobrevivência</h3>
                <ul>
                    <li><strong>Queda:</strong> Ao cair de uma altura superior a 3 metros, sofre <strong>1d6 de dano de Concussão para cada 3 metros</strong> caídos (máximo de 20d6) e cai Caído (Prone) a menos que evite todo o dano.</li>
                    <li><strong>Sufocamento:</strong> Uma criatura pode prender a respiração por <code>1 + mod CON</code> minutos (mínimo de 30 segundos). Ao ficar sem ar, sobrevive uma quantidade de rodadas igual ao mod de Constituição antes de cair a 0 PV e começar a morrer.</li>
                    <li><strong>Testes contra a Morte (Death Saves):</strong> Ao iniciar seu turno com 0 PV, role 1d20 puro. 10 ou mais é <strong>Sucesso</strong>; 9 ou menos é <strong>Falha</strong>. Acumule 3 sucessos para estabilizar; 3 falhas causam a morte. Um <strong>20 natural recupera 1 PV imediatamente</strong> e permite agir no mesmo turno! Um <strong>1 natural conta como 2 falhas</strong>.</li>
                </ul>

                <h3 style={{ color: '#c5a059', borderBottom: '1px solid #334155', paddingBottom: '6px', marginTop: '20px' }}>Descansos (Resting)</h3>
                <ul>
                    <li><strong>Descanso Curto (Short Rest - 1 Hora):</strong> Permite gastar Dados de Vida (Hit Dice) rolando-os e somando o modificador de Constituição para recuperar Pontos de Vida. Conjuradores como Bruxo recuperam todos os seus espaços de pacto.</li>
                    <li><strong>Descanso Longo (Long Rest - 8 Horas):</strong> Recupera todos os Pontos de Vida máximos perdidos e restaura metade do total máximo de Dados de Vida do herói.</li>
                </ul>

                <h3 style={{ color: '#e11d48', marginTop: '24px' }}>As 15 Condições Oficiais</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
                    <div style={{ background: '#1c1926', border: '1px solid #4338ca', padding: '10px', borderRadius: '6px' }}>
                        <strong style={{ color: '#a5b4fc' }}>Amedrontado (Frightened):</strong> Desvantagem em testes de perícia e ataques enquanto a fonte do medo estiver na linha de visão; incapaz de se mover voluntariamente para perto da fonte.
                    </div>
                    <div style={{ background: '#1c1926', border: '1px solid #4338ca', padding: '10px', borderRadius: '6px' }}>
                        <strong style={{ color: '#a5b4fc' }}>Agarrado (Grappled):</strong> Deslocamento torna-se 0; sofre Desvantagem em ataques contra qualquer alvo que não seja quem o está agarrando.
                    </div>
                    <div style={{ background: '#1c1926', border: '1px solid #4338ca', padding: '10px', borderRadius: '6px' }}>
                        <strong style={{ color: '#a5b4fc' }}>Caído (Prone):</strong> Deslocamento só pode ser rastejado (metade do custo); ataques desferidos a até 1,5m contra o caído têm Vantagem; ataques à distância contra o caído têm Desvantagem. Levantar gasta metade do deslocamento total.
                    </div>
                    <div style={{ background: '#1c1926', border: '1px solid #4338ca', padding: '10px', borderRadius: '6px' }}>
                        <strong style={{ color: '#a5b4fc' }}>Cego (Blinded):</strong> Não pode ver nada e falha automaticamente em testes que exigem visão; jogadas de ataque contra o alvo cego têm Vantagem e os ataques do alvo têm Desvantagem.
                    </div>
                    <div style={{ background: '#1c1926', border: '1px solid #4338ca', padding: '10px', borderRadius: '6px' }}>
                        <strong style={{ color: '#a5b4fc' }}>Contido (Restrained):</strong> Deslocamento 0; ataques contra o alvo têm Vantagem e os seus têm Desvantagem; Desvantagem em salvaguardas de Destreza.
                    </div>
                    <div style={{ background: '#1c1926', border: '1px solid #4338ca', padding: '10px', borderRadius: '6px' }}>
                        <strong style={{ color: '#a5b4fc' }}>Enfeitiçado (Charmed):</strong> Incapaz de atacar ou ferir quem o enfeitiçou; o encantador tem Vantagem em testes sociais contra o alvo.
                    </div>
                    <div style={{ background: '#1c1926', border: '1px solid #4338ca', padding: '10px', borderRadius: '6px' }}>
                        <strong style={{ color: '#a5b4fc' }}>Envenenado (Poisoned):</strong> Desvantagem em todas as jogadas de ataque e testes de atributo.
                    </div>
                    <div style={{ background: '#1c1926', border: '1px solid #4338ca', padding: '10px', borderRadius: '6px' }}>
                        <strong style={{ color: '#a5b4fc' }}>Incapacitado (Incapacitated):</strong> Não pode realizar nenhuma ação, ação bônus nem reação. Quebra imediatamente qualquer Concentração ativa!
                    </div>
                    <div style={{ background: '#1c1926', border: '1px solid #4338ca', padding: '10px', borderRadius: '6px' }}>
                        <strong style={{ color: '#a5b4fc' }}>Invisível (Invisible):</strong> Impossível de ser visto por visão comum (benefício de cobertura total contra efeitos visuais); ataques contra o invisível têm Desvantagem e os seus ataques têm Vantagem.
                    </div>
                    <div style={{ background: '#1c1926', border: '1px solid #4338ca', padding: '10px', borderRadius: '6px' }}>
                        <strong style={{ color: '#a5b4fc' }}>Paralisado (Paralyzed):</strong> Incapacitado e não pode se mover nem falar; falha automaticamente em salvaguardas de Força e Destreza; ataques a até 1,5m são acertos críticos automáticos!
                    </div>
                    <div style={{ background: '#1c1926', border: '1px solid #4338ca', padding: '10px', borderRadius: '6px' }}>
                        <strong style={{ color: '#a5b4fc' }}>Petrificado (Petrified):</strong> Transformado em substância inanimada sólida; peso multiplicado por 10; Incapacitado; Resistência a todos os tipos de dano e imune a veneno.
                    </div>
                    <div style={{ background: '#1c1926', border: '1px solid #4338ca', padding: '10px', borderRadius: '6px' }}>
                        <strong style={{ color: '#a5b4fc' }}>Atordoado (Stunned):</strong> Incapacitado; não pode se mover e fala apenas balbuciando; falha automática em salvaguardas de Força e Destreza; ataques contra ele têm Vantagem.
                    </div>
                    <div style={{ background: '#1c1926', border: '1px solid #4338ca', padding: '10px', borderRadius: '6px' }}>
                        <strong style={{ color: '#a5b4fc' }}>Surdo (Deafened):</strong> Não pode ouvir nada e falha automaticamente em testes que exigem audição.
                    </div>
                    <div style={{ background: '#1c1926', border: '1px solid #4338ca', padding: '10px', borderRadius: '6px' }}>
                        <strong style={{ color: '#a5b4fc' }}>Inconsciente (Unconscious):</strong> Incapacitado e Caído no chão; larga o que estiver segurando; falha automática em Força e Destreza; qualquer ataque que acerte a até 1,5m é Acerto Crítico automático!
                    </div>
                </div>

                <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', padding: '14px', borderRadius: '8px', marginTop: '16px' }}>
                    <h4 style={{ color: '#f87171', margin: '0 0 6px 0' }}>Exaustão (Exhaustion - Regra de 10 Níveis)</h4>
                    <p style={{ margin: 0, fontSize: '0.88rem', color: '#fecaca', lineHeight: '1.6' }}>
                        No D&D 5.5e, a Exaustão varia de <strong>Nível 1 a 10</strong>.
                        <br />&bull; Para cada nível acumulado de exaustão, você sofre uma <strong>penalidade de -1 em TODAS as suas jogadas de d20</strong> (ataques, perícias e salvaguardas) e a <strong>CD das suas magias é reduzida em -1</strong>!
                        <br />&bull; Seu deslocamento é reduzido em <code>1,5m × nível de exaustão</code>.
                        <br />&bull; Ao atingir o <strong>Nível 10 de Exaustão, o personagem morre instantaneamente</strong>!
                        <br />&bull; Concluir um Descanso Longo com comida e água remove 1 nível de exaustão acumulado.
                    </p>
                </div>
            </div>
        )
    },

    // =========================================================================
    // 6. MAESTRIA DE ARMAS (WEAPON MASTERY - CAPÍTULO 6)
    // =========================================================================
    {
        id: 'phb_weapon_mastery',
        title: 'Cap. 6: Maestria de Armas (Weapon Mastery)',
        category: 'Mecânicas de Combate (Cap. 6)',
        content: (
            <div>
                <p style={{ color: '#cbd5e1', lineHeight: '1.6' }}>
                    A <strong>Maestria de Armas</strong> é a maior inovação marcial do D&D 5.5e. Guerreiros, Bárbaros, Ladinos, Guardiões e Paladinos desbloqueiam propriedades especiais que transformam armas normais em instrumentos de controle tático sem gastar recursos!
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', marginTop: '16px' }}>
                    <div style={{ background: '#1c1926', border: '1px solid #e11d48', padding: '14px', borderRadius: '8px' }}>
                        <strong style={{ color: '#f43f5e', fontSize: '1.05rem' }}>Cleave (Trespassar)</strong>
                        <p style={{ fontSize: '0.88rem', margin: '6px 0', color: '#cbd5e1' }}>
                            Ao acertar um ataque corpo a corpo, você pode desferir um segundo ataque imediato contra uma criatura diferente a até 1,5m do alvo inicial que também esteja ao seu alcance. Se acertar, causa apenas o dano dos dados da arma (sem modificador de atributo).
                        </p>
                        <span style={{ fontSize: '0.78rem', color: '#fda4af' }}>Armas: Machado Grande (Greataxe), Alabarda (Halberd).</span>
                    </div>

                    <div style={{ background: '#1c1926', border: '1px solid #e11d48', padding: '14px', borderRadius: '8px' }}>
                        <strong style={{ color: '#f43f5e', fontSize: '1.05rem' }}>Graze (Raspar)</strong>
                        <p style={{ fontSize: '0.88rem', margin: '6px 0', color: '#cbd5e1' }}>
                            Se você errar a jogada de ataque contra um alvo, o poder do golpe ainda raspa na armadura dele e você causa <strong>dano igual ao seu modificador de Força automaticamente</strong>! Você nunca desperdiça um turno sem causar dano!
                        </p>
                        <span style={{ fontSize: '0.78rem', color: '#fda4af' }}>Armas: Espada Grande (Greatsword), Glaive.</span>
                    </div>

                    <div style={{ background: '#1c1926', border: '1px solid #e11d48', padding: '14px', borderRadius: '8px' }}>
                        <strong style={{ color: '#f43f5e', fontSize: '1.05rem' }}>Nick (Golpe Rápido)</strong>
                        <p style={{ fontSize: '0.88rem', margin: '6px 0', color: '#cbd5e1' }}>
                            Permite fazer o ataque extra da propriedade <em>Leve (Light)</em> como parte da própria Ação Atacar, em vez de consumir a sua Ação Bônus! Isso deixa sua Ação Bônus 100% livre para outras manobras e magias!
                        </p>
                        <span style={{ fontSize: '0.78rem', color: '#fda4af' }}>Armas: Adaga (Dagger), Foice Curta, Cimitarra.</span>
                    </div>

                    <div style={{ background: '#1c1926', border: '1px solid #e11d48', padding: '14px', borderRadius: '8px' }}>
                        <strong style={{ color: '#f43f5e', fontSize: '1.05rem' }}>Push (Empurrão)</strong>
                        <p style={{ fontSize: '0.88rem', margin: '6px 0', color: '#cbd5e1' }}>
                            Ao atingir uma criatura de tamanho Grande ou menor, você pode empurrá-la <strong>3 metros em linha reta</strong> para longe de você <strong>sem nenhum teste de resistência</strong>!
                        </p>
                        <span style={{ fontSize: '0.78rem', color: '#fda4af' }}>Armas: Malho (Maul), Pique, Lança Montada.</span>
                    </div>

                    <div style={{ background: '#1c1926', border: '1px solid #e11d48', padding: '14px', borderRadius: '8px' }}>
                        <strong style={{ color: '#f43f5e', fontSize: '1.05rem' }}>Sap (Atordoamento Fraco)</strong>
                        <p style={{ fontSize: '0.88rem', margin: '6px 0', color: '#cbd5e1' }}>
                            Se acertar o alvo, ele sofre <strong>Desvantagem</strong> na próxima jogada de ataque que fizer antes do início do seu próximo turno.
                        </p>
                        <span style={{ fontSize: '0.78rem', color: '#fda4af' }}>Armas: Espada Longa, Maça, Mangual.</span>
                    </div>

                    <div style={{ background: '#1c1926', border: '1px solid #e11d48', padding: '14px', borderRadius: '8px' }}>
                        <strong style={{ color: '#f43f5e', fontSize: '1.05rem' }}>Slow (Lentidão)</strong>
                        <p style={{ fontSize: '0.88rem', margin: '6px 0', color: '#cbd5e1' }}>
                            Se você acertar uma criatura e causar dano, o deslocamento dela é reduzido em <strong>3 metros</strong> até o início do seu próximo turno.
                        </p>
                        <span style={{ fontSize: '0.78rem', color: '#fda4af' }}>Armas: Arco Longo, Besta Leve, Lança, Porrete.</span>
                    </div>

                    <div style={{ background: '#1c1926', border: '1px solid #e11d48', padding: '14px', borderRadius: '8px' }}>
                        <strong style={{ color: '#f43f5e', fontSize: '1.05rem' }}>Topple (Derrubada)</strong>
                        <p style={{ fontSize: '0.88rem', margin: '6px 0', color: '#cbd5e1' }}>
                            Ao acertar um alvo, você pode forçá-lo a fazer uma salvaguarda de Constituição (CD 8 + mod Atributo + PB). Em falha, ele cai <strong>Caído (Prone)</strong> no chão!
                        </p>
                        <span style={{ fontSize: '0.78rem', color: '#fda4af' }}>Armas: Machado de Batalha, Tridente, Martelo de Guerra.</span>
                    </div>

                    <div style={{ background: '#1c1926', border: '1px solid #e11d48', padding: '14px', borderRadius: '8px' }}>
                        <strong style={{ color: '#f43f5e', fontSize: '1.05rem' }}>Vex (Perturbação)</strong>
                        <p style={{ fontSize: '0.88rem', margin: '6px 0', color: '#cbd5e1' }}>
                            Ao atingir uma criatura e causar dano, você ganha <strong>Vantagem</strong> na sua próxima jogada de ataque contra aquele mesmo alvo antes do final do seu próximo turno.
                        </p>
                        <span style={{ fontSize: '0.78rem', color: '#fda4af' }}>Armas: Rapieira, Espada Curta, Besta de Mão, Dardo.</span>
                    </div>
                </div>
            </div>
        )
    },

    // =========================================================================
    // 7. ANTECEDENTES & TALENTOS DE ORIGEM (CAPÍTULOS 4 & 5)
    // =========================================================================
    {
        id: 'phb_backgrounds_feats',
        title: 'Os 16 Antecedentes & Talentos de Origem',
        category: 'Antecedentes & Talentos (Cap. 4 & 5)',
        content: (
            <div>
                <p style={{ color: '#cbd5e1', lineHeight: '1.6' }}>
                    No D&D 5.5e, o <strong>Antecedente (Background)</strong> é onde você recebe seus bônus de atributo (+2/+1 ou +1/+1/+1), duas perícias treinadas, proficiência com ferramenta e um <strong>Talento de Origem de 1º nível</strong>!
                </p>

                <h3 style={{ color: '#c5a059', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>Tabela Oficial dos 16 Antecedentes</h3>
                <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                        <thead>
                            <tr style={{ background: '#27121c', color: '#f43f5e', textAlign: 'left' }}>
                                <th style={{ padding: '8px', border: '1px solid #471a2b' }}>Antecedente</th>
                                <th style={{ padding: '8px', border: '1px solid #471a2b' }}>Atributos Concedidos</th>
                                <th style={{ padding: '8px', border: '1px solid #471a2b' }}>Perícias</th>
                                <th style={{ padding: '8px', border: '1px solid #471a2b' }}>Talento de Origem (Nv 1)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td><strong>Acólito</strong></td><td>INT, SAB, CAR</td><td>Intuição, Religião</td><td>Iniciado em Magia (Clérigo)</td></tr>
                            <tr><td><strong>Andarilho</strong></td><td>DES, CON, SAB</td><td>Furtividade, Sobrevivência</td><td>Alerta</td></tr>
                            <tr><td><strong>Artesão</strong></td><td>FOR, DES, CON</td><td>Investigação, Persuasão</td><td>Artesão (Crafter)</td></tr>
                            <tr><td><strong>Artista</strong></td><td>DES, CAR, SAB</td><td>Acrobacia, Atuação</td><td>Músico (Musician)</td></tr>
                            <tr><td><strong>Charlatão</strong></td><td>DES, CON, CAR</td><td>Decepção, Prestidigitação</td><td>Hábil (Skilled)</td></tr>
                            <tr><td><strong>Criminoso</strong></td><td>DES, CON, INT</td><td>Furtividade, Prestidigitação</td><td>Alerta</td></tr>
                            <tr><td><strong>Eremita</strong></td><td>CON, SAB, CAR</td><td>Medicina, Religião</td><td>Curandeiro (Healer)</td></tr>
                            <tr><td><strong>Escriba</strong></td><td>DES, INT, SAB</td><td>História, Investigação</td><td>Hábil (Skilled)</td></tr>
                            <tr><td><strong>Fazendeiro</strong></td><td>FOR, CON, SAB</td><td>Adestrar Animais, Natureza</td><td>Resistente (Tough)</td></tr>
                            <tr><td><strong>Guarda</strong></td><td>FOR, INT, SAB</td><td>Atletismo, Percepção</td><td>Alerta</td></tr>
                            <tr><td><strong>Guia</strong></td><td>DES, CON, SAB</td><td>Furtividade, Sobrevivência</td><td>Iniciado em Magia (Druida)</td></tr>
                            <tr><td><strong>Marinheiro</strong></td><td>FOR, DES, CON</td><td>Atletismo, Percepção</td><td>Brigão de Taverna</td></tr>
                            <tr><td><strong>Mercador</strong></td><td>CON, INT, CAR</td><td>Investigação, Persuasão</td><td>Sortudo (Lucky)</td></tr>
                            <tr><td><strong>Nobre</strong></td><td>FOR, INT, CAR</td><td>História, Persuasão</td><td>Hábil (Skilled)</td></tr>
                            <tr><td><strong>Sábio</strong></td><td>CON, INT, SAB</td><td>Arcanismo, História</td><td>Iniciado em Magia (Mago)</td></tr>
                            <tr><td><strong>Soldado</strong></td><td>FOR, DES, CON</td><td>Atletismo, Intimidação</td><td>Atacante Selvagem (Savage Attacker)</td></tr>
                        </tbody>
                    </table>
                </div>

                <h3 style={{ color: '#c5a059', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>Catálogo dos Talentos de Origem Canônicos (Nível 1)</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
                    <div style={{ background: '#1c1926', border: '1px solid #334155', padding: '10px', borderRadius: '6px' }}>
                        <strong style={{ color: '#38bdf8' }}>Alerta (Alert):</strong> Adiciona seu Bônus de Proficiência à iniciativa e pode trocar sua iniciativa rolada com um aliado voluntário no início do combate!
                    </div>
                    <div style={{ background: '#1c1926', border: '1px solid #334155', padding: '10px', borderRadius: '6px' }}>
                        <strong style={{ color: '#38bdf8' }}>Brigão de Taverna (Tavern Brawler):</strong> Dano desarmado d4; ao acertar com ataque desarmado, empurre o alvo 1,5m; rerola resultado 1 no dano desarmado.
                    </div>
                    <div style={{ background: '#1c1926', border: '1px solid #334155', padding: '10px', borderRadius: '6px' }}>
                        <strong style={{ color: '#38bdf8' }}>Curandeiro (Healer):</strong> Ao gastar kit de curandeiro, o alvo gasta um Dado de Vida e recupera <code>Dado + PB</code> PVs; pode rerolar dados 1 em rolagens de cura de magias!
                    </div>
                    <div style={{ background: '#1c1926', border: '1px solid #334155', padding: '10px', borderRadius: '6px' }}>
                        <strong style={{ color: '#38bdf8' }}>Hábil (Skilled):</strong> Ganha proficiência em 3 perícias ou ferramentas à sua escolha.
                    </div>
                    <div style={{ background: '#1c1926', border: '1px solid #334155', padding: '10px', borderRadius: '6px' }}>
                        <strong style={{ color: '#38bdf8' }}>Iniciado em Magia (Magic Initiate):</strong> Aprende 2 truques e 1 magia de 1º nível de Clérigo, Druida ou Mago. Pode conjurar a magia 1x/descanso longo sem gastar espaço ou usar slots normais!
                    </div>
                    <div style={{ background: '#1c1926', border: '1px solid #334155', padding: '10px', borderRadius: '6px' }}>
                        <strong style={{ color: '#38bdf8' }}>Músico (Musician):</strong> Ao terminar um descanso curto ou longo, você toca para os aliados e concede Inspiração Heroica a uma quantidade de companheiros igual ao seu PB!
                    </div>
                    <div style={{ background: '#1c1926', border: '1px solid #334155', padding: '10px', borderRadius: '6px' }}>
                        <strong style={{ color: '#38bdf8' }}>Resistente (Tough):</strong> Seus PV máximos aumentam em <code>2 × seu nível</code> (ex: +2 no Nv 1, +4 no Nv 2, até +40 no Nv 20).
                    </div>
                    <div style={{ background: '#1c1926', border: '1px solid #334155', padding: '10px', borderRadius: '6px' }}>
                        <strong style={{ color: '#38bdf8' }}>Atacante Selvagem (Savage Attacker):</strong> Uma vez por turno ao acertar com arma, role o dano da arma duas vezes e escolha o maior resultado!
                    </div>
                    <div style={{ background: '#1c1926', border: '1px solid #334155', padding: '10px', borderRadius: '6px' }}>
                        <strong style={{ color: '#38bdf8' }}>Sortudo (Lucky):</strong> Reserva de Pontos de Sorte iguais ao seu PB. Gaste 1 ponto para ter Vantagem em um teste de d20 ou impor Desvantagem em um ataque contra você.
                    </div>
                </div>
            </div>
        )
    },

    // =========================================================================
    // 8. EQUIPAMENTOS, ARMADURAS & ARMAS (CAPÍTULO 6)
    // =========================================================================
    {
        id: 'phb_equipment_catalog',
        title: 'Cap. 6: Equipamentos, Armaduras & Armas',
        category: 'Equipamentos & Magia (Cap. 6 & 7)',
        content: (
            <div>
                <p style={{ color: '#cbd5e1', lineHeight: '1.6' }}>
                    O catálogo de equipamentos de 2024 integra os valores de Classe de Armadura, penalidades de furtividade e as propriedades de maestria de cada arma.
                </p>

                <h3 style={{ color: '#c5a059', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>Tabela Oficial de Armaduras e Escudos (PHB Oficial)</h3>
                <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                        <thead>
                            <tr style={{ background: '#1e1b2e', color: '#c084fc', textAlign: 'left' }}>
                                <th style={{ padding: '8px', border: '1px solid #3730a3' }}>Armadura</th>
                                <th style={{ padding: '8px', border: '1px solid #3730a3' }}>Custo</th>
                                <th style={{ padding: '8px', border: '1px solid #3730a3' }}>Classe de Armadura (CA)</th>
                                <th style={{ padding: '8px', border: '1px solid #3730a3' }}>Força Mínima</th>
                                <th style={{ padding: '8px', border: '1px solid #3730a3' }}>Furtividade</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style={{ background: 'rgba(255,255,255,0.02)' }}><td colSpan={5}><strong>Armaduras Leves (Soma Modificador de Destreza Completo)</strong></td></tr>
                            <tr><td>Acolchoada</td><td>5 PO</td><td>11 + mod DES</td><td>&mdash;</td><td>Desvantagem</td></tr>
                            <tr><td>Couro</td><td>10 PO</td><td>11 + mod DES</td><td>&mdash;</td><td>Normal</td></tr>
                            <tr><td>Couro Batido</td><td>45 PO</td><td>12 + mod DES</td><td>&mdash;</td><td>Normal</td></tr>
                            <tr style={{ background: 'rgba(255,255,255,0.02)' }}><td colSpan={5}><strong>Armaduras Médias (Soma Modificador de Destreza até +2)</strong></td></tr>
                            <tr><td>Gibão de Peles</td><td>10 PO</td><td>12 + mod DES (máx. +2)</td><td>&mdash;</td><td>Normal</td></tr>
                            <tr><td>Camisa de Cota de Malha</td><td>50 PO</td><td>13 + mod DES (máx. +2)</td><td>&mdash;</td><td>Normal</td></tr>
                            <tr><td>Brunea</td><td>50 PO</td><td>14 + mod DES (máx. +2)</td><td>&mdash;</td><td>Desvantagem</td></tr>
                            <tr><td>Peitoral de Aço</td><td>400 PO</td><td>14 + mod DES (máx. +2)</td><td>&mdash;</td><td>Normal</td></tr>
                            <tr><td>Meia-Armadura</td><td>750 PO</td><td>15 + mod DES (máx. +2)</td><td>&mdash;</td><td>Desvantagem</td></tr>
                            <tr style={{ background: 'rgba(255,255,255,0.02)' }}><td colSpan={5}><strong>Armaduras Pesadas (Não Soma Modificador de Destreza)</strong></td></tr>
                            <tr><td>Cota de Anéis</td><td>30 PO</td><td>CA 14 fixo</td><td>&mdash;</td><td>Desvantagem</td></tr>
                            <tr><td>Cota de Malha</td><td>75 PO</td><td>CA 16 fixo</td><td>FOR 13</td><td>Desvantagem</td></tr>
                            <tr><td>Cota de Talas</td><td>200 PO</td><td>CA 17 fixo</td><td>FOR 15</td><td>Desvantagem</td></tr>
                            <tr><td>Armadura de Placas (Full Plate)</td><td>1.500 PO</td><td>CA 18 fixo</td><td>FOR 15</td><td>Desvantagem</td></tr>
                            <tr style={{ background: 'rgba(255,255,255,0.02)' }}><td colSpan={5}><strong>Escudos</strong></td></tr>
                            <tr><td>Escudo</td><td>10 PO</td><td>+2 na CA</td><td>&mdash;</td><td>Normal</td></tr>
                        </tbody>
                    </table>
                </div>

                <h3 style={{ color: '#c5a059', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>Armas Icônicas e suas Maestrias</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
                    <div style={{ background: '#1c1926', padding: '10px', borderRadius: '6px' }}>
                        <strong style={{ color: '#e11d48' }}>Espada Longa:</strong> 1d8 cortante (Versátil 1d10) | Maestria: <strong>Sap</strong>
                    </div>
                    <div style={{ background: '#1c1926', padding: '10px', borderRadius: '6px' }}>
                        <strong style={{ color: '#e11d48' }}>Espada Grande:</strong> 2d6 cortante (Duas Mãos, Pesada) | Maestria: <strong>Graze</strong>
                    </div>
                    <div style={{ background: '#1c1926', padding: '10px', borderRadius: '6px' }}>
                        <strong style={{ color: '#e11d48' }}>Machado de Batalha:</strong> 1d8 cortante (Versátil 1d10) | Maestria: <strong>Topple</strong>
                    </div>
                    <div style={{ background: '#1c1926', padding: '10px', borderRadius: '6px' }}>
                        <strong style={{ color: '#e11d48' }}>Machado Grande:</strong> 1d12 cortante (Duas Mãos, Pesada) | Maestria: <strong>Cleave</strong>
                    </div>
                    <div style={{ background: '#1c1926', padding: '10px', borderRadius: '6px' }}>
                        <strong style={{ color: '#e11d48' }}>Rapieira:</strong> 1d8 perfurante (Acuidade/Finesse) | Maestria: <strong>Vex</strong>
                    </div>
                    <div style={{ background: '#1c1926', padding: '10px', borderRadius: '6px' }}>
                        <strong style={{ color: '#e11d48' }}>Cimitarra:</strong> 1d6 cortante (Acuidade, Leve) | Maestria: <strong>Nick</strong>
                    </div>
                    <div style={{ background: '#1c1926', padding: '10px', borderRadius: '6px' }}>
                        <strong style={{ color: '#e11d48' }}>Malho:</strong> 2d6 concussão (Duas Mãos, Pesada) | Maestria: <strong>Push</strong>
                    </div>
                    <div style={{ background: '#1c1926', padding: '10px', borderRadius: '6px' }}>
                        <strong style={{ color: '#e11d48' }}>Arco Longo:</strong> 1d8 perfurante (Alcance 45/180m) | Maestria: <strong>Slow</strong>
                    </div>
                </div>
            </div>
        )
    },

    // =========================================================================
    // 9. REGRAS DE MAGIA, CONJURAÇÃO & RITUAIS (CAPÍTULO 7)
    // =========================================================================
    {
        id: 'phb_spells_rules',
        title: 'Cap. 7: Regras de Magia, Conjuração & Rituais',
        category: 'Equipamentos & Magia (Cap. 6 & 7)',
        content: (
            <div>
                <p style={{ color: '#cbd5e1', lineHeight: '1.6' }}>
                    O Capítulo 7 do Livro do Jogador 2024 clarifica as regras de conjuração, componentes mágicos e introduz uma regra mais limpa sobre limite de magias com espaços por turno!
                </p>

                <div style={{ background: 'rgba(225, 29, 72, 0.12)', border: '1px solid #e11d48', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
                    <h3 style={{ color: '#f43f5e', margin: '0 0 8px 0' }}>A Regra Oficial de Limite de Magia 2024</h3>
                    <p style={{ margin: 0, fontSize: '0.92rem', color: '#fecdd3', lineHeight: '1.6' }}>
                        Em seu turno, <strong>você só pode gastar UM único espaço de magia</strong>! Se você lançar uma magia utilizando um espaço de magia (seja como Ação ou Ação Bônus), qualquer outra magia que lançar naquele mesmo turno deve ser um <strong>Truque (Cantrip)</strong> que não consuma espaços!
                    </p>
                </div>

                <h3>Componentes Mágicos</h3>
                <ul>
                    <li><strong>Verbal (V):</strong> Entoação de palavras mágicas místicas em voz clara. Estar amordaçado ou em área de silêncio mágico impede o lançamento.</li>
                    <li><strong>Somático (S):</strong> Gestos precisos e vigorosos com pelo menos uma das mãos livres.</li>
                    <li><strong>Material (M):</strong> Ingredientes específicos guardados em uma bolsa de componentes ou canalizados por um Foco de Conjuração (Varinha, Cajado, Símbolo Sagrado). Componentes com custo monetário em PO especificado (como diamante para reviver) devem ser consumidos ou fornecidos.</li>
                </ul>

                <h3>Concentração (Concentration)</h3>
                <p>
                    Certas magias exigem foco contínuo. Você só pode manter a concentração em <strong>uma magia por vez</strong>. Ao sofrer dano enquanto concentrado, você deve fazer uma salvaguarda de Constituição (CD 10 ou metade do dano sofrido, o que for maior). Se falhar, a magia se encerra imediatamente.
                </p>

                <h3>Conjuração de Rituais (Ritual Casting 2024)</h3>
                <p>
                    Magias com a marcação <em>Ritual</em> podem ser conjuradas gastando <strong>10 minutos adicionais</strong> de tempo de lançamento. Ao fazer isso, o conjurador <strong>não gasta nenhum espaço de magia</strong>! No D&D 5.5e, Magos, Clérigos, Druidas e Bardos possuem capacidade ritualística nativa sem necessitar de talentos especiais.
                </p>
            </div>
        )
    }
];
