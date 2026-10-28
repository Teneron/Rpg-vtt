import type { RuleSection } from '../../RulebookViewer';

export const DND55E_DMG_HAZARDS_SECTIONS: RuleSection[] = [
    // =========================================================================
    // 1. ARMADILHAS MECÂNICAS & MÁGICAS (DMG CAP. 4 & 5)
    // =========================================================================
    {
        id: 'dmg_traps_mechanics_catalog',
        title: 'Cap. 4 & 5: Armadilhas Mecânicas, Mágicas & Desarme',
        category: 'Perigos, Portas & Exploração (Cap. 4 & 5)',
        content: (
            <div>
                <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '16px' }}>
                    Armadilhas protegem tumbas antigas, passagens secretas e cofres contra intrusos. O Guia do Mestre classifica as armadilhas por gravidade: <strong>Inconveniente (Setback)</strong>, <strong>Perigosa (Dangerous)</strong> e <strong>Letal (Deadly)</strong>.
                </p>

                <h3 style={{ color: '#c5a059', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>Gravidade das Armadilhas & Escalas de Dano</h3>
                <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                        <thead>
                            <tr style={{ background: '#1c1926', color: '#38bdf8', textAlign: 'left' }}>
                                <th style={{ padding: '8px', border: '1px solid #3730a3' }}>Nível do Grupo</th>
                                <th style={{ padding: '8px', border: '1px solid #3730a3' }}>Inconveniente</th>
                                <th style={{ padding: '8px', border: '1px solid #3730a3' }}>Perigosa</th>
                                <th style={{ padding: '8px', border: '1px solid #3730a3' }}>Letal</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td><strong>1º &ndash; 4º Nível</strong></td><td>1d10 de dano | CD 10 &ndash; 11</td><td>2d10 de dano | CD 12 &ndash; 15</td><td>4d10 de dano | CD 16 &ndash; 20</td></tr>
                            <tr><td><strong>5º &ndash; 10º Nível</strong></td><td>2d10 de dano | CD 10 &ndash; 11</td><td>4d10 de dano | CD 12 &ndash; 15</td><td>10d10 de dano | CD 16 &ndash; 20</td></tr>
                            <tr><td><strong>11º &ndash; 16º Nível</strong></td><td>4d10 de dano | CD 10 &ndash; 11</td><td>10d10 de dano | CD 12 &ndash; 15</td><td>18d10 de dano | CD 16 &ndash; 20</td></tr>
                            <tr><td><strong>17º &ndash; 20º Nível</strong></td><td>10d10 de dano | CD 10 &ndash; 11</td><td>18d10 de dano | CD 12 &ndash; 15</td><td>24d10 de dano | CD 16 &ndash; 20</td></tr>
                        </tbody>
                    </table>
                </div>

                <h3 style={{ color: '#c5a059', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>Armadilhas Prontas Oficiais do DMG</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
                    <div style={{ background: '#181b2a', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #ef4444' }}>
                        <strong style={{ color: '#ef4444' }}>Fosso Camuflado com Estacas (Pit Trap):</strong><br />
                        <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Detectar: Percepção Passiva CD 15. Ao pisar no alçapão falso, o herói cai 3 metros (1d6 de concussão) sobre estacas de ferro afiadas (Ataque +5, 2d10 perfurante).</span>
                    </div>
                    <div style={{ background: '#181b2a', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #ef4444' }}>
                        <strong style={{ color: '#ef4444' }}>Dardos Envenenados na Parede:</strong><br />
                        <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Fio de tropeço (Investigação CD 13, Ferramentas de Ladrão CD 15 para desarmar). Dispara 4 dardos (+8 para acertar, 1d4 perfurante + salvaguarda de CON CD 15 ou 2d10 de veneno e Envenenado).</span>
                    </div>
                    <div style={{ background: '#181b2a', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #ef4444' }}>
                        <strong style={{ color: '#ef4444' }}>Esfera Rolante Esmagadora (Rolling Sphere):</strong><br />
                        <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Ao abrir sarcófago, esfera maciça de pedra de 3 metros rola rampa abaixo a 18m por turno. Criaturas no caminho devem passar em Destreza CD 15 ou sofrer 10d10 de concussão e ficar Caídas.</span>
                    </div>
                    <div style={{ background: '#181b2a', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #ef4444' }}>
                        <strong style={{ color: '#ef4444' }}>Glifo Protetor Arcano:</strong><br />
                        <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Símbolo rúnico gravado em livro ou baú (Arcanismo CD 15 para detectar). Quando aberto sem a senha mágica, detona explosão de relâmpagos (salvaguarda de Destreza CD 15, 5d8 de dano elétrico).</span>
                    </div>
                </div>
            </div>
        )
    },

    // =========================================================================
    // 2. REGRAS DE COBERTURA, SUFOCAMENTO & DOENÇAS (DMG)
    // =========================================================================
    {
        id: 'dmg_cover_suffocation_diseases',
        title: 'Cap. 8: Cobertura Tática, Sufocamento & Doenças Canônicas',
        category: 'Perigos, Portas & Exploração (Cap. 4 & 5)',
        content: (
            <div>
                <h3 style={{ color: '#c5a059', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>Regras Oficiais de Cobertura em Combate</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px', marginBottom: '24px' }}>
                    <div style={{ background: '#1c1926', padding: '12px', borderRadius: '6px' }}>
                        <strong style={{ color: '#38bdf8' }}>Meia Cobertura (Half Cover):</strong> O alvo tem pelo menos metade do corpo oculto por uma mureta baixa, barril ou outra criatura. Concede <strong>+2 na CA</strong> e <strong>+2 em salvaguardas de Destreza</strong>.
                    </div>
                    <div style={{ background: '#1c1926', padding: '12px', borderRadius: '6px' }}>
                        <strong style={{ color: '#38bdf8' }}>Três Quartos de Cobertura (Three-Quarters):</strong> Cerca de três quartos do corpo ocultos (como fresta de flecheira ou tronco largo). Concede <strong>+5 na CA</strong> e <strong>+5 em salvaguardas de Destreza</strong>!
                    </div>
                    <div style={{ background: '#1c1926', padding: '12px', borderRadius: '6px' }}>
                        <strong style={{ color: '#38bdf8' }}>Cobertura Total (Total Cover):</strong> O alvo está inteiramente encoberto por um obstáculo sólido. <strong>Não pode ser alvejado diretamente</strong> por ataques ou magias que exijam linha de visão!
                    </div>
                </div>

                <h3 style={{ color: '#c5a059', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>Regras de Sufocamento & Afogamento</h3>
                <div style={{ background: '#181b2a', padding: '14px', borderRadius: '8px', marginBottom: '20px', borderLeft: '4px solid #38bdf8' }}>
                    <ul style={{ margin: 0, paddingLeft: '20px', color: '#cbd5e1', lineHeight: '1.6' }}>
                        <li><strong>Prender a Respiração:</strong> Uma criatura pode prender a respiração por <strong>1 + Modificador de Constituição em minutos</strong> (mínimo de 30 segundos).</li>
                        <li><strong>Sem Ar / Sufocando:</strong> Quando o ar acabar, a criatura sobrevive por rodadas iguais ao seu <strong>Modificador de Constituição</strong> (mínimo de 1 rodada). No início do próximo turno, ela <strong>cai a 0 Pontos de Vida, fica moribunda e não pode recuperar PV</strong> até voltar a respirar!</li>
                    </ul>
                </div>

                <h3 style={{ color: '#c5a059', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>Doenças Canônicas do Guia do Mestre</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
                    <div style={{ background: '#181b2a', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #eab308' }}>
                        <strong style={{ color: '#eab308' }}>Febre do Esgoto (Sewer Plague):</strong><br />
                        <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Transmitida por mordidas de ratos e carniçais. Exige salvaguarda de CON CD 11. Causa fadiga extrema: a criatura recupera apenas metade dos PV em descansos e ganha 1 nível de exaustão a cada amanhecer que falhar no salvamento.</span>
                    </div>
                    <div style={{ background: '#181b2a', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #eab308' }}>
                        <strong style={{ color: '#eab308' }}>Olhos Viscosos (Sight Rot):</strong><br />
                        <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Infecção aquática em selvas e pântanos (CON CD 15). Causa hemorragia ocular e perda gradual de visão: penalidade cumulativa de -1 nas jogadas de ataque até causar a condição <strong>Cego permanente</strong> após 24 horas.</span>
                    </div>
                    <div style={{ background: '#181b2a', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #eab308' }}>
                        <strong style={{ color: '#eab308' }}>Praga Escarlate (Cackle Fever):</strong><br />
                        <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Doença mental que provoca crises incontroláveis de riso histérico (CON CD 13). O doente tem desvantagem em testes de Carisma e Sabedoria, e sempre que sofrer dano deve passar em salvaguarda ou cairá gargalhando incapacitado por 1 minuto.</span>
                    </div>
                </div>
            </div>
        )
    }
];
