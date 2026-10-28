import type { RuleSection } from '../../RulebookViewer';

export const DND55E_DMG_TREASURE_SECTIONS: RuleSection[] = [
    // =========================================================================
    // 1. TABELAS OFICIAIS DE TESOURO INDIVIDUAL & PILHAS DE TESOURO (DMG)
    // =========================================================================
    {
        id: 'dmg_treasure_hoards_cr',
        title: 'Cap. 7: Tabelas Oficiais de Tesouro por Nível de Desafio (ND)',
        category: 'Tesouro & Economia do Mestre (Cap. 7)',
        content: (
            <div>
                <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '16px' }}>
                    O <em>Dungeon Master's Guide</em> (Guia do Mestre) fornece tabelas de d100 para determinar com precisão os tesouros que monstros e chefes de masmorra acumulam.
                </p>

                <h3 style={{ color: '#c5a059', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>Tabela de Tesouro Individual por ND</h3>
                <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                        <thead>
                            <tr style={{ background: '#1c1926', color: '#38bdf8', textAlign: 'left' }}>
                                <th style={{ padding: '8px', border: '1px solid #3730a3' }}>Nível de Desafio (ND)</th>
                                <th style={{ padding: '8px', border: '1px solid #3730a3' }}>d100</th>
                                <th style={{ padding: '8px', border: '1px solid #3730a3' }}>Moedas Encontradas</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td><strong>ND 0 &ndash; 4</strong> (Goblin, Kobold, Esqueleto)</td><td>01&ndash;30<br/>31&ndash;60<br/>61&ndash;95<br/>96&ndash;00</td><td>5d6 PC (17 PC)<br/>4d6 PP (14 PP)<br/>3d6 PO (10 PO)<br/>1d6 PL (3 PL)</td></tr>
                            <tr><td><strong>ND 5 &ndash; 10</strong> (Ogro, Trol, Manticora)</td><td>01&ndash;30<br/>31&ndash;60<br/>61&ndash;95<br/>96&ndash;00</td><td>4d6 &times; 100 PC + 1d6 &times; 10 PE<br/>6d6 &times; 10 PP + 2d6 &times; 10 PO<br/>4d6 &times; 10 PO<br/>2d6 &times; 10 PO + 3d6 PL</td></tr>
                            <tr><td><strong>ND 11 &ndash; 16</strong> (Dragão Jovem, Beholder)</td><td>01&ndash;20<br/>21&ndash;75<br/>76&ndash;00</td><td>4d6 &times; 100 PP + 1d6 &times; 100 PO<br/>1d6 &times; 1.000 PO + 1d6 &times; 100 PL<br/>2d6 &times; 1.000 PO + 2d6 &times; 100 PL</td></tr>
                            <tr><td><strong>ND 17+</strong> (Dragão Ancião, Lich, Balor)</td><td>01&ndash;15<br/>16&ndash;55<br/>56&ndash;00</td><td>2d6 &times; 1.000 PO + 8d6 &times; 1.000 PP<br/>1d6 &times; 10.000 PO + 1d6 &times; 1.000 PL<br/>2d6 &times; 10.000 PO + 2d6 &times; 1.000 PL</td></tr>
                        </tbody>
                    </table>
                </div>

                <h3 style={{ color: '#c5a059', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>Pilha de Tesouro Acumulada (Treasure Hoards)</h3>
                <div style={{ background: '#181b2a', padding: '14px', borderRadius: '8px', borderLeft: '4px solid #c5a059' }}>
                    <p style={{ margin: '0 0 10px 0', color: '#f8fafc', fontWeight: 'bold' }}>
                        Como premiar o Covil do Chefe de Masmorra:
                    </p>
                    <ul style={{ margin: 0, paddingLeft: '20px', color: '#cbd5e1', lineHeight: '1.6' }}>
                        <li><strong>ND 0 &ndash; 4:</strong> 6d6 &times; 100 PC + 3d6 &times; 100 PP + 2d6 &times; 10 PO. Além de rolar d100 para gemas de 10 PO ou 50 PO e 1d6 rolagens na <strong>Tabela Mágica A ou B</strong>!</li>
                        <li><strong>ND 5 &ndash; 10:</strong> 2d6 &times; 100 PP + 2d6 &times; 1.000 PO + 3d6 &times; 100 PL. Mais 2d4 gemas de 100 PO ou obras de arte de 250 PO e 1d4 rolagens na <strong>Tabela Mágica C, D ou F</strong>!</li>
                        <li><strong>ND 11 &ndash; 16:</strong> 4d6 &times; 1.000 PO + 5d6 &times; 1.000 PL. Mais 3d6 gemas de 500 PO ou obras de arte de 750 PO e 1d4 rolagens na <strong>Tabela Mágica F, G ou H</strong>!</li>
                        <li><strong>ND 17+:</strong> 12d6 &times; 1.000 PO + 8d6 &times; 1.000 PL. Mais 3d6 gemas de 1.000 PO ou 5.000 PO e 1d4 itens mágicos da <strong>Tabela Mágica H ou I (Lendários)</strong>!</li>
                    </ul>
                </div>
            </div>
        )
    },

    // =========================================================================
    // 2. TABELAS DE GEMAS, OBRAS DE ARTE & ITENS MÁGICOS A-I
    // =========================================================================
    {
        id: 'dmg_gems_art_tables',
        title: 'Cap. 7: Gemas Preciosas, Obras de Arte & Tabelas A a I',
        category: 'Tesouro & Economia do Mestre (Cap. 7)',
        content: (
            <div>
                <h3 style={{ color: '#c5a059', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>Tabela Oficial de Pedras Preciosas & Gemas</h3>
                <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                        <thead>
                            <tr style={{ background: '#1c1926', color: '#c084fc', textAlign: 'left' }}>
                                <th style={{ padding: '8px', border: '1px solid #3730a3' }}>Valor da Gema</th>
                                <th style={{ padding: '8px', border: '1px solid #3730a3' }}>Exemplos de Gemas Canônicas</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td><strong>10 PO</strong></td><td>Azurita, Quartzo Azul, Ágata Ocular, Hematita, Lápis-Lazúli, Malaquita, Obsidiana, Olho de Tigre, Turquesa.</td></tr>
                            <tr><td><strong>50 PO</strong></td><td>Jaspe Vermelho, Pedra da Lua, Ônix Preto, Quartzo Rosa, Calcedônia, Crisoprásio, Zircônio.</td></tr>
                            <tr><td><strong>100 PO</strong></td><td>Âmbar Dourado, Ametista Púrpura, Crisoberilo, Granada Vermelha, Jade Escuro, Pérola Natural, Espinélio.</td></tr>
                            <tr><td><strong>500 PO</strong></td><td>Alexandrita, Água-Marinha, Pérola Negra, Topázio Azul, Peridoto Nobre.</td></tr>
                            <tr><td><strong>1.000 PO</strong></td><td>Esmeralda Brilhante, Opala de Fogo, Safira Estelar, Rubi da Estrela.</td></tr>
                            <tr><td><strong>5.000 PO</strong></td><td>Diamante Lapidado Transparente, Jacinto Negro, Rubi Real Brilhante, Safira Imperial.</td></tr>
                        </tbody>
                    </table>
                </div>

                <h3 style={{ color: '#c5a059', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>Guia das Tabelas de Itens Mágicos do DMG (A até I)</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
                    <div style={{ background: '#1c1926', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #38bdf8' }}>
                        <strong style={{ color: '#38bdf8' }}>Tabela A & B (Comuns e Incomuns Menores):</strong> Poções de Cura normais e maiores, pergaminhos de truques a 2º nível, bolsa de carga, corda da escalada.
                    </div>
                    <div style={{ background: '#1c1926', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #38bdf8' }}>
                        <strong style={{ color: '#38bdf8' }}>Tabela C & D (Incomuns e Raros Menores):</strong> Poções de cura superior, pergaminhos de 3º a 5º nível, varinhas elementais, ferraduras da velocidade.
                    </div>
                    <div style={{ background: '#1c1926', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #38bdf8' }}>
                        <strong style={{ color: '#38bdf8' }}>Tabela F & G (Armas e Armaduras Marciais):</strong> Armas +1 a +2, Armaduras de Couro/Malha/Placas +1, Armaduras de Adamante, Espadas Flamejantes, Manto de Proteção.
                    </div>
                    <div style={{ background: '#1c1926', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #38bdf8' }}>
                        <strong style={{ color: '#38bdf8' }}>Tabela H & I (Muito Raros & Lendários):</strong> Armas +3, Espadas Vorpais, Lâminas da Sorte, Veste do Arquimago, Cajado do Poder, Anéis dos Três Desejos.
                    </div>
                </div>
            </div>
        )
    }
];
