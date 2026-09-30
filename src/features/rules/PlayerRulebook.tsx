import React from 'react';
import { RulebookViewer, type RuleSection } from './RulebookViewer';

import { ZoomableImage } from '../../components/ZoomableImage';

const sections: RuleSection[] = [
    {
        id: 'world_map',
        title: 'Mapa do Continente',
        content: (
            <div style={{ textAlign: 'center' }}>
                <p>O Continente, palco de nossas aventuras.</p>
                <ZoomableImage src="/assets/maps/continent_map.webp" alt="Mapa do Continente" />
                <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '5px' }}>Role para ver detalhes.</p>
            </div>
        )
    },
    {
        id: 'intro',
        title: 'Fundamentos',
        content: (
            <>
                <p>O D&D é um jogo de narrativa e dados. A mecânica central é o teste d20.</p>
                <h3>A Mecânica Central</h3>
                <p>1. <strong>O Mestre descreve o ambiente.</strong></p>
                <p>2. <strong>Os jogadores descrevem o que querem fazer.</strong></p>
                <p>3. <strong>O Mestre narra os resultados.</strong></p>
                <br />
                <p><strong>Vantagem e Desvantagem:</strong> Role 2d20. Vantagem usa o maior, Desvantagem usa o menor.</p>
                <p><strong>Arredondamento:</strong> Sempre para baixo, a menos que especificado.</p>
                <p><strong>Múltiplos Efeitos:</strong> Efeitos com o mesmo nome não se acumulam (ex: duas magias <em>Bênção</em>).</p>
            </>
        )
    },
    {
        id: 'setting',
        title: 'O Mundo (Lore)',
        content: (
            <>
                <p>Bem-vindo ao Continente. Um lugar onde os monstros são reais, mas os humanos costumam ser piores.</p>

                <h3>Geopolítica e Guerra</h3>
                <p>Estamos na era da <strong>3ª Guerra do Norte</strong>. O Império de Nilfgaard avança implacavelmente para o norte, cruzando o rio Yaruga.</p>

                <h4>Os Reinos do Norte</h4>
                <p>Divididos e orgulhosos, mas unidos pelo medo do "Sol Negro" (Nilfgaard).</p>
                <ul>
                    <li><strong>Redania:</strong> Rica em grãos e comércio. Atualmente sob lei marcial ou regência severa. Caçadores de Bruxas perseguem magos e não-humanos.</li>
                    <li><strong>Temeria:</strong> A "Pérola do Norte", agora devastada pela guerra e disputada. Onde os lírios prateados ainda tremulam.</li>
                    <li><strong>Kaedwen:</strong> O maior reino, frio e coberto de florestas. Inimigos históricos de Aedirn.</li>
                    <li><strong>Aedirn:</strong> Com suas terras férteis e indústrias, foi um dos primeiros a cair ou sofrer com o avanço.</li>
                    <li><strong>Skellige:</strong> Ilhas de invasores vikings que respeitam a força e honra. Odeiam Nilfgaard acima de tudo.</li>
                </ul>

                <h4>O Império de Nilfgaard</h4>
                <p>Uma potência militar disciplinada do sul. Trazem ordem, lei e escravidão. Adoram o "Sol Negro" e veem os nortistas como bárbaros. Magos em Nilfgaard são ferramentas do estado, não conselheiros.</p>

                <h3>História Antiga</h3>
                <p><strong>A Conjunção das Esferas (1.500 anos atrás):</strong> Uma catástrofe cósmica que fundiu vários universos. Foi quando monstros (ghouls, vampiros, grabes) e a própria Magia chegaram a este mundo. Os humanos chegaram pouco depois, colonizando e guerreando.</p>

                <h3>Sociedade e Tensões</h3>
                <p><strong>Racismo Élfico/Anão:</strong> Os "Não-Humanos" são cidadãos de segunda classe. Guetos são comuns. Em resposta, os <strong>Scoia'tael</strong> (Esquilos) formaram guerrilhas terroristas nas florestas, matando humanos em nome da liberdade antiga.</p>
                <p><strong>A Magia:</strong> Feiticeiras e Magos são poderosos e influentes no Norte, conselheiros de reis. Mas o povo comum os teme (e agora, os queima). A magia extrai força do Caos primordial e pode ser letal para quem não a controla.</p>
                <p><strong>Bruxos:</strong> Criados séculos atrás para combater os monstros da Conjunção. Hoje, são poucos. As Escolas (Lobo, Gato, Urso, Víbora, Grifo) estão em ruínas ou desbandadas. Um bruxo é um mal necessário, pago para matar, mas nunca convidado para jantar.</p>
            </>
        )
    },
    {
        id: 'races',
        title: 'Raças Disponíveis',
        content: (
            <>
                <p>As raças disponíveis para criação de personagem:</p>

                <h3>Humano</h3>
                <p><strong>Atributos:</strong> +1 em todos (Padrão) OU +1 em dois, uma Perícia e um Talento (Variante).</p>
                <p><strong>Traços:</strong> Versatilidade extrema. Humanos fundam impérios e exploram o desconhecido.</p>

                <h3>Elfo (Alto)</h3>
                <p><strong>Atributos:</strong> +2 DES, +1 INT.</p>
                <p><strong>Traços:</strong> Visão no Escuro, Sentidos Aguçados, Ancestralidade Feérica, Transe.</p>
                <p><strong>Extra:</strong> Conhecem 1 truque de mago. Linguagem extra.</p>

                <h3>Elfo (Floresta)</h3>
                <p><strong>Atributos:</strong> +2 DES, +1 SAB.</p>
                <p><strong>Traços:</strong> Visão no Escuro, Sentidos Aguçados, Ancestralidade Feérica, Transe.</p>
                <p><strong>Extra:</strong> Velozes (10,5m). Máscara da Natureza (Esconder-se em chuva/neve/folhagem).</p>

                <h3>Anão (Colina)</h3>
                <p><strong>Atributos:</strong> +2 CON, +1 SAB.</p>
                <p><strong>Traços:</strong> Visão no Escuro, Resistência a Veneno, Proficiência com Ferramentas/Machados.</p>
                <p><strong>Extra:</strong> Tenacidade Anã (+1 PV por nível).</p>

                <h3>Anão (Montanha)</h3>
                <p><strong>Atributos:</strong> +2 CON, +2 FOR.</p>
                <p><strong>Traços:</strong> Visão no Escuro, Resistência a Veneno, Proficiência com Ferramentas/Machados.</p>
                <p><strong>Extra:</strong> Proficiência com Armaduras Leves e Médias.</p>

                <h3>Halfling (Pés Leves)</h3>
                <p><strong>Atributos:</strong> +2 DES, +1 CAR.</p>
                <p><strong>Traços:</strong> Sortudo, Bravura, Agilidade Halfling.</p>
                <p><strong>Extra:</strong> Furtividade Natural (Esconder-se atrás de criaturas maiores).</p>

                <h3>Halfling (Robusto)</h3>
                <p><strong>Atributos:</strong> +2 DES, +1 CON.</p>
                <p><strong>Traços:</strong> Sortudo, Bravura, Agilidade Halfling.</p>
                <p><strong>Extra:</strong> Resiliência (Vantagem/Resistência contra veneno).</p>

                <h3>Tiefling</h3>
                <p><strong>Atributos:</strong> +2 CAR, +1 INT.</p>
                <p><strong>Traços:</strong> Visão no Escuro, Resistência Infernal (Fogo), Legado Infernal (Magias raciais).</p>

                <h3>Humano (Bruxo)</h3>
                <p><em>Humanos mutantes que sobreviveram ao Teste das Ervas.</em></p>
                <p><strong>Atributos:</strong> +2 DES, +1 CON (ou +2 FOR, +1 CON).</p>
                <p><strong>Traços:</strong> Visão no Escuro (18m), Metabolismo Alquímico (Vantagem vs Veneno), Longevidade.</p>
            </>
        )
    },
    {
        id: 'classes',
        title: 'Classes Disponíveis',
        content: (
            <>
                <p>Neste cenário, apenas as seguintes classes estão disponíveis:</p>

                <h3>Bárbaro (Barbarian)</h3>
                <p><strong>Dado de Vida:</strong> d12. <strong>Primário:</strong> FOR.</p>
                <p><strong>Flavor:</strong> Guerreiros tribais de Skellige ou nômades das montanhas. A Fúria é um transe de batalha.</p>

                <h3>Bardo (Bard)</h3>
                <p><strong>Dado de Vida:</strong> d8. <strong>Primário:</strong> CAR.</p>
                <p><strong>Flavor:</strong> Poetas, espiões e diplomatas. Formados em Oxenfurt. A magia deles é sutil ou social.</p>

                <h3>Bruxo (Witcher - Custom)</h3>
                <p><strong>Dado de Vida:</strong> d10. <strong>Primário:</strong> DES ou FOR, e SAB.</p>
                <p><strong>Flavor:</strong> Os infames caçadores de monstros.</p>
                <p><strong>Características:</strong></p>
                <ul>
                    <li><strong>Sinais:</strong> Magias rápidas e menores (Aard, Igni, Quen, Axii, Yrden).</li>
                    <li><strong>Alquimia:</strong> Uso de poções tóxicas que matariam um humano comum.</li>
                    <li><strong>Estilo de Luta:</strong> Especialista em espadas (Prata para monstros, Aço para humanos).</li>
                </ul>

                <h3>Clérigo (Cleric)</h3>
                <p><strong>Dado de Vida:</strong> d8. <strong>Primário:</strong> SAB.</p>
                <p><strong>Flavor:</strong> Sacerdotes do Fogo Eterno (Novigrad), Freya (Skellige) ou Melitele. Curam e protegem, ou queimam hereges.</p>

                <h3>Guerreiro (Fighter)</h3>
                <p><strong>Dado de Vida:</strong> d10. <strong>Primário:</strong> FOR ou DES.</p>
                <p><strong>Flavor:</strong> Soldados de Temeria, Mercenários da Companhia Livre. Subclasses incluem Campeão, Mestre de Batalha e o <strong>Arqueiro Arcano</strong> (magia élfica).</p>

                <h3>Ladino (Rogue)</h3>
                <p><strong>Dado de Vida:</strong> d8. <strong>Primário:</strong> DES.</p>
                <p><strong>Flavor:</strong> Espiões reais, assassinos, bandidos de estrada ou membros das gangues de Novigrad.</p>

                <h3>Mago (Wizard)</h3>
                <p><strong>Dado de Vida:</strong> d6. <strong>Primário:</strong> INT.</p>
                <p><strong>Flavor:</strong> Formados em Aretuza (Mulheres) ou Ban Ard (Homens). Poderosos, políticos e temidos. A magia requer estudo.</p>

                <h3>Paladino (Paladin)</h3>
                <p><strong>Dado de Vida:</strong> d10. <strong>Primário:</strong> FOR e CAR.</p>
                <p><strong>Flavor:</strong> Cavaleiros da Rosa Branca ou fanáticos da Ordem da Chama Flamejante. Juramentos de honra ou purificação.</p>

                <h3>Patrulheiro (Ranger)</h3>
                <p><strong>Dado de Vida:</strong> d10. <strong>Primário:</strong> DES e SAB.</p>
                <p><strong>Flavor:</strong> Batedores de fronteira, caçadores de bestas. Inclui o <strong>Caçador das Sombras (Gloom Stalker)</strong>, especialista em emboscadas escuras (Xanathar).</p>
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
                        <tr style={{ borderBottom: '1px solid #666', textAlign: 'left' }}>
                            <th>Armadura</th><th>Custo</th><th>CA (Classe de Armadura)</th><th>Força?</th><th>Furtividade</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td colSpan={5} style={{ paddingTop: '10px', fontWeight: 'bold' }}>Armaduras Leves</td></tr>
                        <tr><td>Acolchoada</td><td>5 po</td><td>11 + mod DES</td><td>-</td><td>Desvantagem</td></tr>
                        <tr><td>Couro</td><td>10 po</td><td>11 + mod DES</td><td>-</td><td>-</td></tr>
                        <tr><td>Couro Batido</td><td>45 po</td><td>12 + mod DES</td><td>-</td><td>-</td></tr>
                        <tr><td colSpan={5} style={{ paddingTop: '10px', fontWeight: 'bold' }}>Armaduras Médias</td></tr>
                        <tr><td>Corselete de Couro</td><td>10 po</td><td>13 + mod DES (máx 2)</td><td>-</td><td>-</td></tr>
                        <tr><td>Cota de Malha</td><td>50 po</td><td>13 + mod DES (máx 2)</td><td>-</td><td>-</td></tr>
                        <tr><td>Escamas</td><td>50 po</td><td>14 + mod DES (máx 2)</td><td>-</td><td>Desvantagem</td></tr>
                        <tr><td>Peitoral</td><td>400 po</td><td>14 + mod DES (máx 2)</td><td>-</td><td>-</td></tr>
                        <tr><td>Meia-Armadura</td><td>750 po</td><td>15 + mod DES (máx 2)</td><td>-</td><td>Desvantagem</td></tr>
                        <tr><td colSpan={5} style={{ paddingTop: '10px', fontWeight: 'bold' }}>Armaduras Pesadas</td></tr>
                        <tr><td>Cota de Anéis</td><td>30 po</td><td>14</td><td>-</td><td>Desvantagem</td></tr>
                        <tr><td>Cota de Malha (Pesada)</td><td>75 po</td><td>16</td><td>For 13</td><td>Desvantagem</td></tr>
                        <tr><td>Cota de Talas</td><td>200 po</td><td>17</td><td>For 15</td><td>Desvantagem</td></tr>
                        <tr><td>Placas</td><td>1500 po</td><td>18</td><td>For 15</td><td>Desvantagem</td></tr>
                        <tr><td colSpan={5} style={{ paddingTop: '10px', fontWeight: 'bold' }}>Escudo</td></tr>
                        <tr><td>Escudo</td><td>10 po</td><td>+2</td><td>-</td><td>-</td></tr>
                    </tbody>
                </table>

                <h3>Armas Simples</h3>
                <ul style={{ fontSize: '0.9rem' }}>
                    <li><strong>Adaga:</strong> 1d4 perfurante (Acuidade, Leve, Arremesso 6/18)</li>
                    <li><strong>Azagaia:</strong> 1d6 perfurante (Arremesso 9/36)</li>
                    <li><strong>Bordão:</strong> 1d6 concussão (Versátil 1d8)</li>
                    <li><strong>Lança:</strong> 1d6 perfurante (Arremesso 6/18, Versátil 1d8)</li>
                    <li><strong>Maça:</strong> 1d6 concussão</li>
                    <li><strong>Arco Curto:</strong> 1d6 perfurante (Duas mãos, 24/96)</li>
                </ul>

                <h3>Armas Marciais</h3>
                <ul style={{ fontSize: '0.9rem' }}>
                    <li><strong>Espada Longa:</strong> 1d8 cortante (Versátil 1d10)</li>
                    <li><strong>Espada Grande:</strong> 2d6 cortante (Pesada, Duas mãos)</li>
                    <li><strong>Machado Grande:</strong> 1d12 cortante (Pesada, Duas mãos)</li>
                    <li><strong>Rapieira:</strong> 1d8 perfurante (Acuidade)</li>
                    <li><strong>Arco Longo:</strong> 1d8 perfurante (Pesada, Duas mãos, 45/180)</li>
                    <li><strong>Besta Pesada:</strong> 1d10 perfurante (Pesada, Duas mãos, Recarga, 30/120)</li>
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
                <p><strong>Terreno Difícil:</strong> Custa 1,5m extra por 1,5m percorrido.</p>
                <p><strong>Levantar-se:</strong> Custa metade do seu deslocamento.</p>
                <p><strong>Rastejar (Prone):</strong> Custa 1,5m extra por 1,5m percorrido.</p>

                <h3>Ações em Combate</h3>
                <p><strong>Ataque:</strong> Teste corpo a corpo (FOR) ou à distância (DES). Armas de Acuidade podem usar DES no corpo a corpo.</p>
                <p><strong>Agarrar (Grapple):</strong> Substitui um ataque. Teste de Atletismo (Você) vs Atletismo ou Acrobacia (Alvo).</p>
                <p><strong>Empurrar (Shove):</strong> Substitui um ataque. Teste de Atletismo (Você) vs Atletismo ou Acrobacia (Alvo). Sucesso: Derruba (Prone) ou empurra 1,5m.</p>
                <p><strong>Esconder (Hide):</strong> Fica invisível se não puderem te ver. Vantagem no próximo ataque.</p>
                <p><strong>Preparar (Ready):</strong> "Se X acontecer, eu faço Y". Gasta sua Reação. Se for magia, requer Concentração.</p>

                <h3>Dano e Cura</h3>
                <p><strong>Resistência:</strong> Reduz o dano pela metade.</p>
                <p><strong>Vulnerabilidade:</strong> Dobra o dano.</p>
                <p><strong>0 Pontos de Vida:</strong> Inconsciente. Turno começa: Teste contra morte (d20). 10+ Sucesso, 9- Falha. 3 Sucessos estabiliza, 3 Falhas morre. Crítico (20) levanta com 1 PV. Crítico (1) conta 2 falhas.</p>
                <p><strong>Dano Massivo:</strong> Se o dano exceder seu PV máximo atual enquanto em 0 ou levar a 0 com sobra igual ao máx, morte instantânea.</p>
            </>
        )
    },
    {
        id: 'magic',
        title: 'Conjuração',
        content: (
            <>
                <p><strong>CD de Resistência:</strong> 8 + Proficiência + Mod. Atributo</p>
                <p><strong>Ataque Mágico:</strong> Proficiência + Mod. Atributo + d20</p>

                <h3>Componentes</h3>
                <ul>
                    <li><strong>Verbal (V):</strong> Requer fala e entonação. Silêncio impede.</li>
                    <li><strong>Somático (S):</strong> Requer mãos livres. Mãos atadas impedem.</li>
                    <li><strong>Material (M):</strong> Requer os materiais (ou foco arcano/bolsa de componentes). Se tiver custo em ouro, deve ter o item específico.</li>
                </ul>

                <h3>Áreas de Efeito</h3>
                <p><strong>Cone:</strong> Largura final igual ao comprimento.</p>
                <p><strong>Cubo:</strong> Tamanho do lado.</p>
                <p><strong>Cilindro:</strong> Raio e Altura.</p>
                <p><strong>Linha:</strong> Largura e Comprimento.</p>
                <p><strong>Esfera:</strong> Raio.</p>

                <h3>Concentração</h3>
                <p>Algumas magias exigem foco. Perde se:</p>
                <ul>
                    <li>Conjurar outra magia de concentração.</li>
                    <li>Levar dano (Teste CON, CD 10 ou metade do dano, o que for maior).</li>
                    <li>Ficar incapacitado ou morto.</li>
                </ul>
            </>
        )
    },
    {
        id: 'env',
        title: 'Ambiente',
        content: (
            <>
                <p><strong>Visão no Escuro:</strong> Vê na escuridão como penumbra (tons de cinza). Penumbra = Desvantagem em Percepção vs visão.</p>
                <p><strong>Escuridão Leve:</strong> Penumbra. Desvantagem em Percepção.</p>
                <p><strong>Escuridão Densa:</strong> Escuridão total. Considerado "Cego".</p>
                <p><strong>Sufocamento:</strong> Pode segurar a respiração por 1 + mod CON minutos (mínimo 30 seg). Depois, sobrebive mod CON rodadas. Depois, 0 PV e morrendo.</p>
                <p><strong>Queda:</strong> 1d6 concussão por 3m (máx 20d6). Cai Prone.</p>
            </>
        )
    }
];

export const PlayerRulebook: React.FC = () => {
    return <RulebookViewer title="Referência Completa do Jogador" sections={sections} />;
};
