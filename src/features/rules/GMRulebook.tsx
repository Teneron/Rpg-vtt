import React from 'react';
import { RulebookViewer, type RuleSection } from './RulebookViewer';

import { ZoomableImage } from '../../components/ZoomableImage';

const sections: RuleSection[] = [
    {
        id: 'world_map',
        title: 'Mapa do Continente',
        content: (
            <div style={{ textAlign: 'center' }}>
                <ZoomableImage src="/assets/maps/continent_map.webp" alt="Mapa do Continente" />
            </div>
        )
    },
    {
        id: 'gm-quickref',
        title: 'Referência Rápida',
        content: (
            <>
                <h3>Classes de Dificuldade (CD)</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', marginBottom: '20px' }}>
                    <thead><tr style={{ textAlign: 'left', borderBottom: '1px solid #666' }}><th>Dificuldade</th><th>CD</th></tr></thead>
                    <tbody>
                        <tr><td>Muito Fácil</td><td>5</td></tr>
                        <tr><td>Fácil</td><td>10</td></tr>
                        <tr><td>Média</td><td>15</td></tr>
                        <tr><td>Difícil</td><td>20</td></tr>
                        <tr><td>Muito Difícil</td><td>25</td></tr>
                        <tr><td>Quase Impossível</td><td>30</td></tr>
                    </tbody>
                </table>

                <h3>CDs Típicas de Itens</h3>
                <p><strong>Quebrar Porta de Madeira:</strong> CD 15 | <strong>Porta Reforçada:</strong> CD 20 | <strong>Porta de Ferro:</strong> CD 25</p>
                <p><strong>Arrombar Fechadura Simples:</strong> CD 15 | <strong>Complexa:</strong> CD 20+</p>
                <p><strong>Detectar Armadilha:</strong> CD 10-20</p>
            </>
        )
    },
    {
        id: 'conditions',
        title: 'Condições (Detalhado)',
        content: (
            <>
                <ul style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                    <li><strong>Agarrado (Grappled):</strong> Deslocamento 0. Termina se o agarrador ficar incapacitado ou se um efeito mover o agarrado para fora do alcance.</li>
                    <li><strong>Amedrontado (Frightened):</strong> Desvantagem em testes e ataques enquanto a fonte estiver visível. Não pode se aproximar voluntariamente.</li>
                    <li><strong>Atordoado (Stunned):</strong> Incapacitado. Não move, fala mal. Falha automática em testes de FOR e DES. Ataques contra têm Vantagem.</li>
                    <li><strong>Caído (Prone):</strong> Só pode rastejar. Desvantagem em ataques (exceto besta). Ataques contra: Vantagem (se atacante a 1,5m), caso contrário Desvantagem.</li>
                    <li><strong>Cego (Blinded):</strong> Falha auto em testes que exigem visão. Ataques contra têm Vantagem. Seus ataques têm Desvantagem.</li>
                    <li><strong>Enfeitiçado (Charmed):</strong> Não ataca o encantador. O encantador tem Vantagem em interações sociais.</li>
                    <li><strong>Envenenado (Poisoned):</strong> Desvantagem em ataques e testes de habilidade.</li>
                    <li><strong>Invisível:</strong> Considerado em "Escuridão Densa" para fins de se esconder. Ataques contra têm Desvantagem. Seus ataques têm Vantagem.</li>
                    <li><strong>Paralisado:</strong> Incapacitado. Não move/fala. Falha auto em FOR/DES. Crítico automático se atacante a 1,5m.</li>
                    <li><strong>Petrificado:</strong> Peso x10. Incapacitado. Não envelhece. Resistência total a dano. Venenos já no sistema são suspensos.</li>
                    <li><strong>Surdo:</strong> Falha auto em testes de audição.</li>
                </ul>
            </>
        )
    },
    {
        id: 'environment_hazards',
        title: 'Perigos Ambientais',
        content: (
            <>
                <h3>Clima Extremo</h3>
                <p><strong>Frio Extremo:</strong> CD 10 CON a cada hora ou ganha 1 nível de Exaustão (a menos que tenha roupa de frio).</p>
                <p><strong>Calor Extremo:</strong> Se beber água, sem teste. Sem água: CD 5 CON (+5/hora) ou Exaustão. Armadura pesada/média dá Desvantagem.</p>
                <p><strong>Vento Forte (Areia/Tempestade):</strong> Desvantagem em ataques à distância e Percepção auditiva. Voadores pousam ou caem.</p>

                <h3>Outros Perigos</h3>
                <p><strong>Areia Movediça:</strong> 1d4x3m profundidade. Teste FOR para sair (1,5m). Se afundar, risco de sufocamento.</p>
                <p><strong>Gelo Fino:</strong> CD 10-15 DES ou quebra. Água frígida causa dano e exaustão rápida.</p>
                <p><strong>Fogo/Lava:</strong> 1d10 (perto), 4d10 (atravessar), 10d10 (mergulhar). Lava causa 10d10/18d10.</p>
            </>
        )
    },
    {
        id: 'objects',
        title: 'Estatísticas de Objetos',
        content: (
            <>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', marginBottom: '20px' }}>
                    <thead><tr style={{ textAlign: 'left', borderBottom: '1px solid #666' }}><th>Material</th><th>CA</th><th>PV (Pequeno)</th><th>PV (Médio)</th></tr></thead>
                    <tbody>
                        <tr><td>Tecido/Papel</td><td>11</td><td>1-2</td><td>3-4</td></tr>
                        <tr><td>Vidro/Cristal</td><td>13</td><td>1-3</td><td>4-8</td></tr>
                        <tr><td>Madeira/Osso</td><td>15</td><td>3-10</td><td>10-25</td></tr>
                        <tr><td>Pedra</td><td>17</td><td>5-15</td><td>25-50</td></tr>
                        <tr><td>Ferro/Aço</td><td>19</td><td>10-25</td><td>50-100</td></tr>
                        <tr><td>Mithral</td><td>21</td><td>--</td><td>--</td></tr>
                        <tr><td>Adamante</td><td>23</td><td>--</td><td>--</td></tr>
                    </tbody>
                </table>
                <p><strong>Limiar de Dano (Optional):</strong> Objetos grandes podem ter imunidade a danos abaixo de X (ex: 10).</p>
            </>
        )
    },
    {
        id: 'madness',
        title: 'Insanidade (Opcional)',
        content: (
            <>
                <p>Para jogos de terror/Lovecraftianos.</p>
                <h3>Efeitos de Curto Prazo (1d10 min)</h3>
                <p>1-10: Alucinações, gritos, ou estado catatônico.</p>
                <h3>Efeitos de Longo Prazo (1d10x10 horas)</h3>
                <p>Paranoia extrema, perda de memória, compulsão (mentir, roubar).</p>
            </>
        )
    },
    {
        id: 'poisons',
        title: 'Venenos (Exemplos)',
        content: (
            <>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                    <thead><tr style={{ textAlign: 'left', borderBottom: '1px solid #666' }}><th>Nome</th><th>Tipo</th><th>Efeito</th></tr></thead>
                    <tbody>
                        <tr><td>Sangue de Assassino</td><td>Ingerido</td><td>CD 10 CON. 1d12 dano + Envenenado 24h.</td></tr>
                        <tr><td>Essência de Éter</td><td>Inalado</td><td>CD 15 CON. Inconsciente 8h.</td></tr>
                        <tr><td>Veneno da Verdade</td><td>Ingerido</td><td>CD 11 CON. Não pode mentir 1h.</td></tr>
                        <tr><td>Veneno de Verme Púrpura</td><td>Ferimento</td><td>CD 19 CON. 12d6 veneno.</td></tr>
                        <tr><td>Veneno Drow</td><td>Ferimento</td><td>CD 13 CON. Envenenado 1h. Se falhar por 5+, Inconsciente.</td></tr>
                    </tbody>
                </table>
            </>
        )
    }
];

export const GMRulebook: React.FC = () => {
    return <RulebookViewer title="Referência do Mestre (Avançado)" sections={sections} />;
};
