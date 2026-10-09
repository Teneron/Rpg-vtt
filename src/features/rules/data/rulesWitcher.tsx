import type { RuleSection } from '../RulebookViewer';
import { ZoomableImage } from '../../../components/ZoomableImage';

// ============================================================================
// THE WITCHER (ADAPTADO PARA D&D 5E): LIVRO DO JOGADOR
// ============================================================================
export const WITCHER_PLAYER_SECTIONS: RuleSection[] = [
    {
        id: 'world_map',
        title: 'Mapa do Continente',
        content: (
            <div style={{ textAlign: 'center' }}>
                <p style={{ color: '#cbd5e1', marginBottom: '12px' }}>O Continente, palco de nossas aventuras.</p>
                <ZoomableImage src="/assets/maps/continent_map.webp" alt="Mapa do Continente" />
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '8px' }}>Role com o scroll para aproximar/afastar e arraste para navegar pelo mapa em alta definição.</p>
            </div>
        )
    },
    {
        id: 'intro',
        title: 'Fundamentos',
        content: (
            <>
                <p>O RPG de mesa é um jogo de narrativa compartilhada e dados. A mecânica central é o teste d20 no sistema D&D 5e adaptado.</p>
                <h3>A Mecânica Central</h3>
                <ol style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
                    <li><strong>O Mestre descreve o ambiente e a situação.</strong></li>
                    <li><strong>Os jogadores descrevem o que seus personagens pretendem fazer.</strong></li>
                    <li><strong>O Mestre narra os resultados</strong>, solicitando testes de atributos ou perícias quando há risco de falha.</li>
                </ol>
                <br />
                <div style={{ background: 'rgba(197, 160, 89, 0.1)', border: '1px solid #c5a059', padding: '12px', borderRadius: '6px', marginBottom: '16px' }}>
                    <strong>Fórmula do Teste:</strong> <code>1d20 + Modificador de Atributo + Bônus de Proficiência (se aplicável) &ge; Classe de Dificuldade (CD)</code>
                </div>
                <p><strong>Vantagem e Desvantagem:</strong> Role 2d20. Na Vantagem, utilize o maior resultado; na Desvantagem, utilize o menor.</p>
                <p><strong>Arredondamento:</strong> Sempre para baixo em divisões matemáticas, a menos que especificado o contrário.</p>
                <p><strong>Múltiplos Efeitos:</strong> Efeitos mágicos com o mesmo nome não se acumulam (ex: duas magias <em>Bênção</em> no mesmo alvo).</p>
            </>
        )
    },
    {
        id: 'setting',
        title: 'O Mundo (Lore do Continente)',
        content: (
            <>
                <p>Bem-vindo ao <strong>Continente</strong>. Um lugar brutal e cinzento onde os monstros são reais, mas a crueldade dos humanos costuma ser muito pior.</p>

                <h3>Geopolítica e Guerra</h3>
                <p>O mundo encontra-se consumido pelas cinzas da <strong>3ª Guerra do Norte</strong>. O temido <strong>Império de Nilfgaard</strong> avança implacavelmente sobre as províncias nortistas, transpondo o caudaloso Rio Yaruga.</p>

                <h4>Os Reinos do Norte</h4>
                <p>Divididos por rivalidades históricas e orgulho ferido, mas unidos pelo pavor do "Sol Negro" de Nilfgaard:</p>
                <ul>
                    <li><strong>Redania:</strong> O reino mais rico em comércio e grãos, sob lei marcial draconiana. Nas ruas de Novigrad e Oxenfurt, os fanáticos <em>Caçadores de Bruxas</em> do Fogo Eterno queimam magos, curandeiros e não-humanos em piras públicas.</li>
                    <li><strong>Temeria:</strong> A outrora gloriosa "Pérola do Norte", terra dos lírios prateados, agora fragmentada e ocupada por guarnições imperiais e bandos de guerrilheiros leais à coroa.</li>
                    <li><strong>Kaedwen:</strong> O maior dos reinos do norte, gélido, cercado por florestas impenetráveis e pelas ruínas da lendária fortaleza de Kaer Morhen.</li>
                    <li><strong>Aedirn:</strong> Fértil e industrializado, com o vale de Pontar assolado por invasões e cerco militar contínuo.</li>
                    <li><strong>Skellige:</strong> Arquipélago de clãs guerreiros destemidos. Navegam em dracares, respeitam a honra e o sangue e nutrem um ódio mortal por Nilfgaard.</li>
                </ul>

                <h4>O Império de Nilfgaard</h4>
                <p>Uma superpotência imperialista do sul, guiada pelo estandarte do Sol Negro. Trazem ordem rígida, burocracia eficiente e escravidão implacável. Veem os nortistas como bárbaros indisciplinados. Em Nilfgaard, magos são servidores estritos submetidos ao imperador, e não conselheiros reais independentes.</p>

                <h3>História Antiga</h3>
                <p><strong>A Conjunção das Esferas (1.500 anos atrás):</strong> Um cataclismo cósmico colidiu múltiplas dimensões paralelas. Bestas demoníacas (necrófagos, espectros, draconídeos, vampiros) e a própria <em>Magia do Caos</em> foram derramadas sobre o mundo. Logo após, os primeiros humanos aportaram em caravelas, colonizando as terras ancestrais com ferro e sangue.</p>

                <h3>Sociedade e Tensões</h3>
                <p><strong>Racismo contra Não-Humanos:</strong> Elfos e anões são confinados em guetos insalubres e tratados como cidadãos de segunda classe. Em retaliação, rebeldes élficos formaram os <strong>Scoia'tael</strong> (os Esquilos), travando uma guerrilha impiedosa nas matas.</p>
                <p><strong>A Magia:</strong> O poder arcano provém do Caos primordial. Magos e feiticeiras formados nas academias de Aretuza e Ban Ard dominaram as cortes reais, mas agora são caçados sem piedade pelo populacho ensandecido.</p>
                <p><strong>Bruxos:</strong> Mutantes forjados séculos atrás na Prova das Ervas para exterminar bestas da Conjunção. As antigas Escolas (Lobo, Gato, Urso, Grifo, Víbora) estão em ruínas. Um bruxo é um mal necessário: tolerado para limpar carniçais de um poço, mas expulso a pedradas logo após receber suas moedas.</p>
            </>
        )
    },
    {
        id: 'races',
        title: 'Raças Disponíveis',
        content: (
            <>
                <p>Raças autênticas do Continente disponíveis para os jogadores:</p>

                <h3>Humano</h3>
                <p><strong>Atributos:</strong> +1 em todos (Padrão) OU +1 em dois atributos, uma Perícia à escolha e um Talento (Humano Variante).</p>
                <p><strong>Traços:</strong> Ambição sem limites e rápida expansão. Fundaram impérios e dominam os Reinos do Norte.</p>

                <h3>Elfo (Alto)</h3>
                <p><strong>Atributos:</strong> +2 Destreza, +1 Inteligência.</p>
                <p><strong>Traços:</strong> Visão no Escuro (18m), Sentidos Aguçados, Ancestralidade Feérica (imunidade a sono mágico), Transe meditativo.</p>
                <p><strong>Herança Nobre:</strong> Conhecem 1 Truque de Mago à escolha e dominam a Fala Antiga (Élfico).</p>

                <h3>Elfo (da Floresta)</h3>
                <p><strong>Atributos:</strong> +2 Destreza, +1 Sabedoria.</p>
                <p><strong>Traços:</strong> Visão no Escuro (18m), Sentidos Aguçados, Ancestralidade Feérica, Transe.</p>
                <p><strong>Mobilidade Silvestre:</strong> Deslocamento ampliado para 10,5m e <em>Máscara da Natureza</em> (podem se esconder mesmo sob chuva leve, névoa ou folhagens).</p>

                <h3>Anão (da Colina)</h3>
                <p><strong>Atributos:</strong> +2 Constituição, +1 Sabedoria.</p>
                <p><strong>Traços:</strong> Visão no Escuro (18m), Resiliência Anã (vantagem e resistência a veneno), Proficiência com machados e martelos.</p>
                <p><strong>Tenacidade Anã:</strong> Pontos de Vida máximos aumentam em +1 por nível.</p>

                <h3>Anão (da Montanha - Mahakam)</h3>
                <p><strong>Atributos:</strong> +2 Constituição, +2 Força.</p>
                <p><strong>Traços:</strong> Visão no Escuro (18m), Resiliência Anã, Proficiência com ferramentas de ferreiro.</p>
                <p><strong>Armadura de Mahakam:</strong> Proficiência natural com Armaduras Leves e Médias.</p>

                <h3>Halfling (Pés Leves)</h3>
                <p><strong>Atributos:</strong> +2 Destreza, +1 Carisma.</p>
                <p><strong>Traços:</strong> Sortudo (rola novamente o 1 natural em d20), Bravura contra medo, Agilidade Halfling.</p>
                <p><strong>Furtividade Natural:</strong> Podem tentar se esconder atrás de qualquer criatura que seja de tamanho Médio ou maior.</p>

                <h3>Halfling (Robusto)</h3>
                <p><strong>Atributos:</strong> +2 Destreza, +1 Constituição.</p>
                <p><strong>Traços:</strong> Sortudo, Bravura, Agilidade Halfling e Resiliência contra venenos.</p>

                <h3>Tiefling (Tocado pelo Caos)</h3>
                <p><strong>Atributos:</strong> +2 Carisma, +1 Inteligência.</p>
                <p><strong>Traços:</strong> Visão no Escuro (18m), Resistência ao Fogo, e manifestações mágicas espontâneas da Conjunção.</p>

                <h3>Humano (Bruxo Mutante)</h3>
                <p><em>Humanos submetidos à sinistra Prova das Ervas na infância, com mutações celulares permanentes.</em></p>
                <p><strong>Atributos:</strong> +2 Destreza, +1 Constituição (ou +2 Força, +1 Constituição).</p>
                <p><strong>Traços Únicos:</strong></p>
                <ul>
                    <li><strong>Olhos Felinos:</strong> Visão no Escuro de 18m com pupilas verticais douradas.</li>
                    <li><strong>Metabolismo Alquímico:</strong> Vantagem em salvamentos contra venenos e doenças mundanas.</li>
                    <li><strong>Longevidade Estendida:</strong> Não envelhecem como humanos comuns e são estéreis.</li>
                </ul>
            </>
        )
    },
    {
        id: 'classes',
        title: 'Classes Disponíveis',
        content: (
            <>
                <p>No Continente, o papel de cada aventureiro reflete a dura realidade do cenário:</p>

                <h3>Bruxo (Witcher - Custom 5e)</h3>
                <p><strong>Dado de Vida:</strong> d10. <strong>Atributos Primários:</strong> Destreza ou Força, e Sabedoria.</p>
                <p><strong>Flavor:</strong> Caçadores profissionais de monstros forjados para sobreviver onde outros perecem.</p>
                <p><strong>Mecânicas Especiais:</strong></p>
                <ul>
                    <li><strong>Espadas Duplas:</strong> Espada de Prata para monstros da Conjunção e Espada de Aço para humanos e bestas.</li>
                    <li><strong>Sinais de Bruxo:</strong> Canalizações arcanas rápidas de mão (Aard, Igni, Quen, Yrden, Axii).</li>
                    <li><strong>Alquimia de Combate:</strong> Capacidade de ingerir elixires altamente tóxicos através do recurso de <strong>Toxicidade</strong> na ficha.</li>
                    <li><strong>5 Escolas de Treinamento:</strong> Escola do Lobo (equilíbrio e Kaer Morhen), Escola do Gato (agilidade e críticos), Escola do Urso (armaduras pesadas e robustez), Escola do Grifo (potência de Sinais arcanos) e Escola da Víbora (lâminas envenenadas e emboscadas).</li>
                </ul>

                <h3>Guerreiro (Fighter)</h3>
                <p><strong>Dado de Vida:</strong> d10. <strong>Atributo Primário:</strong> Força ou Destreza.</p>
                <p><strong>Flavor:</strong> Soldados de linha temerianos, cavaleiros da infantaria redaniana ou mercenários de companhias livres. Subclasses incluem Campeão, Mestre de Batalha e o lendário <strong>Arqueiro Arcano</strong> (tradição élfica das matas).</p>

                <h3>Bárbaro (Barbarian)</h3>
                <p><strong>Dado de Vida:</strong> d12. <strong>Atributo Primário:</strong> Força e Constituição.</p>
                <p><strong>Flavor:</strong> Berserkers destemidos de Skellige, guerreiros do Urso e nômades das montanhas Azuis. A Fúria é um transe primal de batalha com sangue fervente.</p>

                <h3>Ladino (Rogue)</h3>
                <p><strong>Dado de Vida:</strong> d8. <strong>Atributo Primário:</strong> Destreza.</p>
                <p><strong>Flavor:</strong> Espiões do serviço secreto redaniano de Dijkstra, assassinos a soldo, contrabandistas nos canais de Novigrad ou batedores Scoia'tael.</p>

                <h3>Mago (Wizard)</h3>
                <p><strong>Dado de Vida:</strong> d6. <strong>Atributo Primário:</strong> Inteligência.</p>
                <p><strong>Flavor:</strong> Eruditos que estudaram nas academias arcanas de Aretuza ou Ban Ard. Manipulam o Caos com fórmulas precisas, grimórios e foco mental.</p>

                <h3>Clérigo (Cleric)</h3>
                <p><strong>Dado de Vida:</strong> d8. <strong>Atributo Primário:</strong> Sabedoria.</p>
                <p><strong>Flavor:</strong> Devotos do Fogo Eterno em Novigrad, sacerdotisas curandeiras da deusa Melitele em Ellander ou sacerdotes de Freya em Skellige.</p>

                <h3>Paladino (Paladin)</h3>
                <p><strong>Dado de Vida:</strong> d10. <strong>Atributos Primários:</strong> Força e Carisma.</p>
                <p><strong>Flavor:</strong> Cavaleiros da Ordem da Rosa Branca ou cruzados fanáticos da Ordem da Chama Flamejante, movidos por juramentos sagrados inabaláveis.</p>

                <h3>Patrulheiro (Ranger)</h3>
                <p><strong>Dado de Vida:</strong> d10. <strong>Atributos Primários:</strong> Destreza e Sabedoria.</p>
                <p><strong>Flavor:</strong> Rastreadores dos pântanos de Velen e caçadores de fronteira. Inclui o <strong>Caçador das Sombras (Gloom Stalker)</strong>, mestre em emboscar criaturas na escuridão.</p>

                <h3>Bardo (Bard)</h3>
                <p><strong>Dado de Vida:</strong> d8. <strong>Atributo Primário:</strong> Carisma.</p>
                <p><strong>Flavor:</strong> Trovadores, poetas e espiões formados na célebre Universidade de Oxenfurt. Suas canções inspiram aliados e desestabilizam cortes inteiras.</p>
            </>
        )
    },
    {
        id: 'equipment',
        title: 'Equipamentos',
        content: (
            <>
                <h3>Armaduras</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', marginBottom: '20px' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #666', textAlign: 'left', color: '#fef08a' }}>
                            <th>Armadura</th><th>Custo</th><th>CA (Classe de Armadura)</th><th>Força Requerida</th><th>Furtividade</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style={{ background: 'rgba(255,255,255,0.03)' }}><td colSpan={5} style={{ paddingTop: '10px', fontWeight: 'bold', color: '#38bdf8' }}>Armaduras Leves</td></tr>
                        <tr><td>Acolchoada</td><td>5 po</td><td>11 + mod DES</td><td>-</td><td>Desvantagem</td></tr>
                        <tr><td>Couro Simples</td><td>10 po</td><td>11 + mod DES</td><td>-</td><td>-</td></tr>
                        <tr><td>Couro Batido Reforçado</td><td>45 po</td><td>12 + mod DES</td><td>-</td><td>-</td></tr>
                        <tr style={{ background: 'rgba(255,255,255,0.03)' }}><td colSpan={5} style={{ paddingTop: '10px', fontWeight: 'bold', color: '#eab308' }}>Armaduras Médias</td></tr>
                        <tr><td>Corselete de Couro</td><td>10 po</td><td>13 + mod DES (máx 2)</td><td>-</td><td>-</td></tr>
                        <tr><td>Cota de Malha Leve</td><td>50 po</td><td>13 + mod DES (máx 2)</td><td>-</td><td>-</td></tr>
                        <tr><td>Escamas de Metal</td><td>50 po</td><td>14 + mod DES (máx 2)</td><td>-</td><td>Desvantagem</td></tr>
                        <tr><td>Peitoral de Aço</td><td>400 po</td><td>14 + mod DES (máx 2)</td><td>-</td><td>-</td></tr>
                        <tr><td>Meia-Armadura Temeriana</td><td>750 po</td><td>15 + mod DES (máx 2)</td><td>-</td><td>Desvantagem</td></tr>
                        <tr style={{ background: 'rgba(255,255,255,0.03)' }}><td colSpan={5} style={{ paddingTop: '10px', fontWeight: 'bold', color: '#ef4444' }}>Armaduras Pesadas</td></tr>
                        <tr><td>Cota de Anéis</td><td>30 po</td><td>14</td><td>-</td><td>Desvantagem</td></tr>
                        <tr><td>Cota de Malha Pesada</td><td>75 po</td><td>16</td><td>For 13</td><td>Desvantagem</td></tr>
                        <tr><td>Cota de Talas</td><td>200 po</td><td>17</td><td>For 15</td><td>Desvantagem</td></tr>
                        <tr><td>Placas de Aço Redanianas</td><td>1500 po</td><td>18</td><td>For 15</td><td>Desvantagem</td></tr>
                        <tr style={{ background: 'rgba(255,255,255,0.03)' }}><td colSpan={5} style={{ paddingTop: '10px', fontWeight: 'bold', color: '#a855f7' }}>Escudo</td></tr>
                        <tr><td>Escudo Reforçado</td><td>10 po</td><td>+2 na CA</td><td>-</td><td>-</td></tr>
                    </tbody>
                </table>

                <h3>Armas Simples</h3>
                <ul style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                    <li><strong>Adaga:</strong> 1d4 perfurante (Acuidade, Leve, Arremesso 6/18m)</li>
                    <li><strong>Azagaia:</strong> 1d6 perfurante (Arremesso 9/36m)</li>
                    <li><strong>Bordão de Carvalho:</strong> 1d6 concussão (Versátil 1d8)</li>
                    <li><strong>Lança de Infantaria:</strong> 1d6 perfurante (Arremesso 6/18m, Versátil 1d8)</li>
                    <li><strong>Maça de Ferro:</strong> 1d6 concussão</li>
                    <li><strong>Arco Curto:</strong> 1d6 perfurante (Duas mãos, 24/96m)</li>
                </ul>

                <h3>Armas Marciais & Lâminas de Bruxo</h3>
                <ul style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                    <li><strong>Espada Longa de Aço:</strong> 1d8 cortante (Versátil 1d10) — Eficaz contra humanos e bestas normais.</li>
                    <li><strong>Espada de Prata de Bruxo:</strong> 1d8 cortante (Versátil 1d10, Dano Prateado) — Letal contra Necrófagos, Espectros e Vampiros da Conjunção.</li>
                    <li><strong>Espada Grande (Montante):</strong> 2d6 cortante (Pesada, Duas mãos)</li>
                    <li><strong>Machado de Batalha:</strong> 1d8 cortante (Versátil 1d10)</li>
                    <li><strong>Machado Grande:</strong> 1d12 cortante (Pesada, Duas mãos)</li>
                    <li><strong>Rapieira de Duelo:</strong> 1d8 perfurante (Acuidade)</li>
                    <li><strong>Arco Longo:</strong> 1d8 perfurante (Pesada, Duas mãos, 45/180m)</li>
                    <li><strong>Besta Pesada:</strong> 1d10 perfurante (Pesada, Duas mãos, Recarga, 30/120m)</li>
                </ul>
            </>
        )
    },
    {
        id: 'combat',
        title: 'Combate Detalhado',
        content: (
            <>
                <h3>Movimento e Posição</h3>
                <p><strong>Terreno Difícil:</strong> Pântanos de Velen, lamaçal, escombros ou neve exigem 1,5m extra por 1,5m percorrido.</p>
                <p><strong>Levantar-se:</strong> Custa metade do seu deslocamento total do turno.</p>
                <p><strong>Rastejar (Caído / Prone):</strong> Custa 1,5m extra por 1,5m percorrido.</p>

                <h3>Ações em Combate</h3>
                <p><strong>Ataque:</strong> Teste corpo a corpo (Força) ou à distância (Destreza). Armas com propriedade Acuidade podem utilizar Destreza no corpo a corpo.</p>
                <p><strong>Agarrar (Grapple):</strong> Substitui um ataque. Teste de Atletismo (Você) vs Atletismo ou Acrobacia (Alvo).</p>
                <p><strong>Empurrar (Shove):</strong> Substitui um ataque. Teste de Atletismo (Você) vs Atletismo ou Acrobacia (Alvo). Sucesso: Derruba Caído (Prone) ou empurra o alvo 1,5m para trás.</p>
                <p><strong>Esconder (Hide):</strong> Fica furtivo caso não esteja em linha de visão direta. Concede Vantagem na próxima jogada de ataque.</p>
                <p><strong>Preparar (Ready):</strong> Declara "Se o gatilho X acontecer, realizo a reação Y". Consome sua Reação quando disparado. Caso seja uma magia, exige Concentração prévia.</p>

                <h3>Dano, Cura e Morte</h3>
                <p><strong>Resistência:</strong> Reduz o dano sofrido pela metade.</p>
                <p><strong>Vulnerabilidade:</strong> Dobra o dano sofrido (ex: Necrófagos queimando com Igni ou sofrendo golpes de lâminas de prata).</p>
                <p><strong>0 Pontos de Vida:</strong> O personagem cai inconsciente. No início de cada turno, realiza um <strong>Teste contra a Morte (d20 sem modificador)</strong>:</p>
                <ul>
                    <li><strong>10 ou mais:</strong> 1 Sucesso. Com 3 Sucessos, estabiliza.</li>
                    <li><strong>9 ou menos:</strong> 1 Falha. Com 3 Falhas, o personagem morre.</li>
                    <li><strong>20 Natural (Crítico):</strong> Recupera a consciência imediatamente com 1 PV!</li>
                    <li><strong>1 Natural:</strong> Conta como 2 Falhas automáticas!</li>
                </ul>
                <p><strong>Dano Massivo:</strong> Se o dano que reduziu a criatura a 0 PV exceder o seu valor máximo total de PV, morte instantânea sem salvamentos.</p>
            </>
        )
    },
    {
        id: 'magic',
        title: 'Conjuração & Sinais',
        content: (
            <>
                <p><strong>CD de Resistência de Magia:</strong> <code>8 + Bônus de Proficiência + Modificador do Atributo de Conjuração</code></p>
                <p><strong>Bônus de Ataque Mágico:</strong> <code>Bônus de Proficiência + Modificador de Atributo + 1d20</code></p>

                <h3>Componentes de Magia</h3>
                <ul>
                    <li><strong>Verbal (V):</strong> Pronúncia audível de palavras místicas do Caos. Silêncio ou mordaça impedem a conjuração.</li>
                    <li><strong>Somático (S):</strong> Gestos manuais precisos. Mãos atadas impedem a execução.</li>
                    <li><strong>Material (M):</strong> Componentes físicos, foco arcano ou bolsa de componentes. Se o feitiço declarar um custo em ouro (ex: diamante de 300 po), o item específico é consumido ou exigido.</li>
                </ul>

                <h3>Áreas de Efeito</h3>
                <p><strong>Cone:</strong> Largura final na ponta igual ao comprimento do cone (ex: Igni).</p>
                <p><strong>Cubo:</strong> O tamanho é a medida de cada uma das arestas do cubo.</p>
                <p><strong>Cilindro:</strong> Definido por raio e altura.</p>
                <p><strong>Linha:</strong> Definida por largura e comprimento linear (ex: relâmpagos).</p>
                <p><strong>Esfera:</strong> Definida pelo raio medido a partir do ponto central.</p>

                <h3>Concentração</h3>
                <p>Feitiços contínuos exigem foco constante. A concentração é quebrada se:</p>
                <ul>
                    <li>O conjurador iniciar outra magia que exija concentração.</li>
                    <li>Sofrer dano: deve passar num teste de Constituição (CD 10 ou metade do dano sofrido, o que for maior).</li>
                    <li>Ficar incapacitado ou morto.</li>
                </ul>
            </>
        )
    },
    {
        id: 'witcher_alchemy',
        title: 'Alquimia, Poções & Toxicidade',
        content: (
            <>
                <p>Bruxos possuem um metabolismo alterado que processa elixires letais. Na ficha, a barra de <strong>Toxicidade (0 a 100%)</strong> rastreia os elixires ativos:</p>

                <h3>Poções Icônicas</h3>
                <ul>
                    <li><strong>Andorinha (Swallow):</strong> Regenera +3 PV por turno durante 5 turnos. Eleva a Toxicidade em +25%.</li>
                    <li><strong>Gato (Cat):</strong> Concede visão no escuro perfeita através de trevas absolutas por 2 horas. Eleva a Toxicidade em +15%.</li>
                    <li><strong>Trovão (Thunderbolt):</strong> Concede +3 de bônus em todas as jogadas de dano corpo a corpo por 1 hora. Eleva a Toxicidade em +30%.</li>
                    <li><strong>Mel Branco (White Honey):</strong> Purga imediatamente todas as toxinas do sangue, zerando a Toxicidade e encerrando efeitos de poções ativas.</li>
                </ul>

                <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', padding: '12px', borderRadius: '6px', margin: '15px 0' }}>
                    <strong>Alerta de Toxicidade:</strong> Caso a Toxicidade exceda 100%, o bruxo sofre envenenamento severo: desvantagem em todos os testes e perda contínua de 2 PV por rodada até consumir Mel Branco ou descansar.
                </div>
            </>
        )
    },
    {
        id: 'env',
        title: 'Ambiente & Sobrevivência',
        content: (
            <>
                <p><strong>Visão no Escuro:</strong> Permite enxergar na escuridão como se fosse penumbra (em tons de cinza). Em penumbra, há Desvantagem em testes de Percepção baseados em visão.</p>
                <p><strong>Escuridão Plena:</strong> A criatura sofre a condição "Cego" para alvos dentro da área escura.</p>
                <p><strong>Sufocamento e Afogamento:</strong> Uma criatura pode prender a respiração por <code>1 + Modificador de CON</code> minutos (mínimo de 30 segundos). Após isso, sobrevive por rodadas iguais ao Modificador de CON antes de cair a 0 PV e iniciar testes de morte.</p>
                <p><strong>Queda:</strong> Causa 1d6 de dano de concussão para cada 3 metros de queda (máximo de 20d6). Ao atingir o solo, a criatura cai Caída (Prone).</p>
            </>
        )
    }
];

// ============================================================================
// THE WITCHER (ADAPTADO PARA D&D 5E): GUIA DO MESTRE
// ============================================================================
export const WITCHER_GM_SECTIONS: RuleSection[] = [
    {
        id: 'world_map_gm',
        title: 'Mapa do Continente (Visão do Mestre)',
        content: (
            <div style={{ textAlign: 'center' }}>
                <p style={{ color: '#cbd5e1', marginBottom: '12px' }}>O Continente com visão panorâmica de posições estratégicas e caminhos.</p>
                <ZoomableImage src="/assets/maps/continent_map.webp" alt="Mapa do Continente" />
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '8px' }}>Use o mapa para planejar jornadas entre vilarejos, acampamentos de tropas e tocas de monstros.</p>
            </div>
        )
    },
    {
        id: 'gm-quickref',
        title: 'Referência Rápida & CDs',
        content: (
            <>
                <h3>Classes de Dificuldade (CD)</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', marginBottom: '20px' }}>
                    <thead><tr style={{ textAlign: 'left', borderBottom: '2px solid #c5a059', color: '#fef08a' }}><th>Dificuldade</th><th>CD</th><th>Exemplo de Tarefa</th></tr></thead>
                    <tbody>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}><td>Muito Fácil</td><td>5</td><td>Notar algo óbvio sob luz plena; pular uma vala rasa.</td></tr>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}><td>Fácil</td><td>10</td><td>Subir uma cerca de madeira; identificar pegadas recentes de lobo.</td></tr>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}><td>Média</td><td>15</td><td>Arrombar uma fechadura típica; decifrar um dialeto élfico antigo.</td></tr>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}><td>Difícil</td><td>20</td><td>Nadar contra a correnteza de um rio bravio; convencer um guarda subornado.</td></tr>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}><td>Muito Difícil</td><td>25</td><td>Rastrear um katakan na chuva torrencial; saltar um precipício largo.</td></tr>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}><td>Quase Impossível</td><td>30</td><td>Desarmar uma armadilha arcana ancestral; intimidar um lorde feudal cercado de seu exército.</td></tr>
                    </tbody>
                </table>

                <h3>CDs Típicas de Obstáculos e Portas</h3>
                <p><strong>Quebrar Porta de Madeira:</strong> CD 15 | <strong>Porta Reforçada com Ferro:</strong> CD 20 | <strong>Porta de Ferro Maciço:</strong> CD 25</p>
                <p><strong>Arrombar Fechadura Simples:</strong> CD 15 | <strong>Fechadura Complexa de Cofre:</strong> CD 20+</p>
                <p><strong>Detectar Armadilha Oculta:</strong> CD 10 a 20 (Percepção ou Investigação)</p>
            </>
        )
    },
    {
        id: 'conditions',
        title: 'Condições de Combate (Detalhado)',
        content: (
            <>
                <p>Efeitos de combate canônicos aplicados a heróis e criaturas:</p>
                <ul style={{ fontSize: '0.9rem', lineHeight: '1.8' }}>
                    <li><strong>Agarrado (Grappled):</strong> Deslocamento 0. Termina se o agarrador ficar incapacitado ou se um efeito afastar a criatura.</li>
                    <li><strong>Amedrontado (Frightened):</strong> Desvantagem em testes de habilidade e jogadas de ataque enquanto a fonte do medo estiver em linha de visão. Não pode se aproximar voluntariamente da fonte.</li>
                    <li><strong>Atordoado (Stunned):</strong> Incapacitado (não pode realizar ações ou reações), só balbucia. Falha automática em salvamentos de Força e Destreza. Ataques contra têm Vantagem.</li>
                    <li><strong>Caído (Prone):</strong> Só pode rastejar. Desvantagem em seus próprios ataques (exceto besta). Ataques contra: Vantagem se o atacante estiver a até 1,5m; caso contrário, Desvantagem.</li>
                    <li><strong>Cego (Blinded):</strong> Falha automática em testes que exigem visão. Ataques contra a criatura têm Vantagem; os ataques da criatura têm Desvantagem.</li>
                    <li><strong>Enfeitiçado (Charmed):</strong> Não pode atacar quem a encantou. O encantador possui Vantagem em interações sociais com ela.</li>
                    <li><strong>Envenenado (Poisoned):</strong> Desvantagem em todas as jogadas de ataque e testes de habilidade.</li>
                    <li><strong>Invisível:</strong> Impossível de ser vista visualmente sem magia. Ataques contra ela têm Desvantagem; os ataques dela têm Vantagem.</li>
                    <li><strong>Paralisado:</strong> Incapacitado, não pode falar nem se mover. Falha automática em salvamentos de Força e Destreza. Ataques a 1,5m que acertarem são automaticamente acertos críticos!</li>
                    <li><strong>Petrificado:</strong> O corpo é transformado em pedra sólida (peso multiplicado por 10). Incapacitado. Resistência total a todo tipo de dano. Venenos e doenças ficam suspensos.</li>
                    <li><strong>Surdo:</strong> Falha automática em testes que exigem audição.</li>
                </ul>
            </>
        )
    },
    {
        id: 'environment_hazards',
        title: 'Perigos Ambientais & Clima',
        content: (
            <>
                <h3>Clima Extremo</h3>
                <p><strong>Frio Extremo:</strong> Teste de Constituição CD 10 a cada hora exposto sem agasalhos apropriados, ou ganha 1 nível de Exaustão.</p>
                <p><strong>Calor Escaldante:</strong> Sem água abundante, exige salvamento de CON CD 5 (+5 por hora adicional) ou sofre 1 nível de Exaustão. Armaduras médias e pesadas impõem Desvantagem.</p>
                <p><strong>Vento Forte & Tempestade:</strong> Desvantagem em ataques à distância com arcos/bestas e em testes de Percepção auditiva. Criaturas voadoras são forçadas a pousar.</p>

                <h3>Armadilhas Naturais</h3>
                <p><strong>Areia Movediça / Lodo Fundo:</strong> Profundidade de 1d4 &times; 3m. Teste de Força CD 10 para avançar 1,5m. Se afundar além da cabeça, inicia regras de sufocamento.</p>
                <p><strong>Gelo Fino:</strong> Teste de Destreza CD 10 a 15 ao pisar ou o gelo se rompe, submergindo o personagem em água frígida com risco de choque térmico.</p>
                <p><strong>Fogo & Lava:</strong> Tocar em chamas abertas causa 1d10 de fogo; atravessar causa 4d10; mergulhar em lava causa 10d10 a 18d10 de dano contínuo devastador.</p>
            </>
        )
    },
    {
        id: 'objects',
        title: 'Estatísticas de Materiais & Objetos',
        content: (
            <>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', marginBottom: '20px' }}>
                    <thead><tr style={{ textAlign: 'left', borderBottom: '2px solid #c5a059', color: '#fef08a' }}><th>Material</th><th>Classe de Armadura (CA)</th><th>PV (Objeto Pequeno)</th><th>PV (Objeto Médio)</th></tr></thead>
                    <tbody>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}><td>Tecido / Pergaminho</td><td>11</td><td>1 a 2</td><td>3 a 4</td></tr>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}><td>Vidro / Cristal / Frasco</td><td>13</td><td>1 a 3</td><td>4 a 8</td></tr>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}><td>Madeira / Osso / Carvalho</td><td>15</td><td>3 a 10</td><td>10 a 25</td></tr>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}><td>Pedra / Alvenaria</td><td>17</td><td>5 a 15</td><td>25 a 50</td></tr>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}><td>Ferro Maciço / Aço</td><td>19</td><td>10 a 25</td><td>50 a 100</td></tr>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}><td>Mithral</td><td>21</td><td>--</td><td>--</td></tr>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}><td>Adamante</td><td>23</td><td>--</td><td>--</td></tr>
                    </tbody>
                </table>
                <p><strong>Limiar de Dano (Regra Opcional):</strong> Estruturas maciças (portões de fortaleza, paredes) podem possuir imunidade contra qualquer dano individual inferior ao limiar (ex: Limiar 15).</p>
            </>
        )
    },
    {
        id: 'witcher_hunts',
        title: 'Prata vs Aço & Condução de Caçadas',
        content: (
            <>
                <p>O Mestre deve recompensar o preparo e punir a negligência nas caçadas aos monstros do Continente:</p>

                <h3>Prata Sagrada vs Aço Meteorítico</h3>
                <ul>
                    <li><strong>Necrófagos, Espectros e Vampiros:</strong> Possuem resistência ou imunidade a armas que não sejam banhadas em prata pura. O toque de uma lâmina de prata queima a carne dessas criaturas e impede regeneração.</li>
                    <li><strong>Humanos, Elfos, Bandidos e Feras Mundanas:</strong> Devem ser enfrentados com a espada de aço. Lâminas de prata usadas contra armaduras humanas se desgastam e sofrem lascas severas.</li>
                </ul>

                <h3>As 3 Fases de um Contrato de Bruxo</h3>
                <ol style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
                    <li><strong>Investigação & Rastreio:</strong> Examine o vilarejo, colha depoimentos e use Percepção para rastrear sangue, marcas de garras e carcaças.</li>
                    <li><strong>Preparação no Acampamento:</strong> Descubra a espécie exata no Bestiário, aplique o Óleo correto na lâmina de prata e beba elixires com cálculo de Toxicidade.</li>
                    <li><strong>A Emboscada Tática:</strong> Atraia a besta com isca ou armadilha rúnica (Yrden) no horário em que ela estiver mais vulnerável.</li>
                </ol>
            </>
        )
    },
    {
        id: 'poisons',
        title: 'Venenos & Óleos Nefastos',
        content: (
            <>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                    <thead><tr style={{ textAlign: 'left', borderBottom: '2px solid #c5a059', color: '#fef08a' }}><th>Nome</th><th>Tipo</th><th>Efeito Mecânico</th></tr></thead>
                    <tbody>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}><td>Sangue de Assassino</td><td>Ingerido</td><td>Salvamento CON CD 10. Causa 1d12 de veneno e impõe condição Envenenado por 24 horas.</td></tr>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}><td>Essência de Éter</td><td>Inalado</td><td>Salvamento CON CD 15. A criatura cai Inconsciente por 8 horas.</td></tr>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}><td>Veneno da Verdade</td><td>Ingerido</td><td>Salvamento CON CD 11. O alvo torna-se incapaz de mentir deliberadamente por 1 hora.</td></tr>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}><td>Veneno de Verme Púrpura</td><td>Ferimento</td><td>Salvamento CON CD 19. Causa devastadores 12d6 de dano de veneno (ou metade no sucesso).</td></tr>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}><td>Extrato Drow Paralisante</td><td>Ferimento</td><td>Salvamento CON CD 13. Envenenado por 1 hora. Se falhar por 5 ou mais na CD, cai Inconsciente.</td></tr>
                    </tbody>
                </table>
            </>
        )
    },
    {
        id: 'madness',
        title: 'Insanidade & Terror da Escuridão',
        content: (
            <>
                <p>Para encontros com horrores cósmicos e aberrações da Conjunção das Esferas:</p>
                <h3>Efeitos de Curto Prazo (1d10 minutos)</h3>
                <p>Alucinações apavorantes, paralisia pelo medo, gritos incontroláveis ou estado catatônico temporário.</p>
                <h3>Efeitos de Longo Prazo (1d10 &times; 10 horas)</h3>
                <p>Paranoia aguda contra aliados, perda temporária de memória recente, ou compulsões severas de vigília.</p>
            </>
        )
    }
];
