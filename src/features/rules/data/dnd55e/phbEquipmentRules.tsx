import type { RuleSection } from '../../RulebookViewer';

export const DND55E_EQUIPMENT_SECTIONS: RuleSection[] = [
    // =========================================================================
    // 1. ARMAS & PROPRIEDADES DE MAESTRIA (PHB OFICIAL)
    // =========================================================================
    {
        id: 'phb_weapons_complete',
        title: 'Cap. 6: Catálogo Completo de Armas & Maestrias',
        category: 'Equipamentos & Armas (Cap. 6)',
        content: (
            <div>
                <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '16px' }}>
                    O catálogo de armas do <em>Player's Handbook</em> (Livro do Jogador) organiza as armas em <strong>Simples</strong> e <strong>Marciais</strong>, divididas entre <strong>Corpo a Corpo (Melee)</strong> e <strong>À Distância (Ranged)</strong>.
                    As regras de 2024 integram as <strong>Maestrias de Armas (Weapon Masteries)</strong>, concedendo efeitos táticos únicos aos personagens que possuem treino marcial.
                </p>

                {/* ARMAS SIMPLES CORPO A CORPO */}
                <h3 style={{ color: '#c5a059', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>Armas Simples Corpo a Corpo</h3>
                <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                        <thead>
                            <tr style={{ background: '#1c1926', color: '#c084fc', textAlign: 'left' }}>
                                <th style={{ padding: '8px', border: '1px solid #3730a3' }}>Arma</th>
                                <th style={{ padding: '8px', border: '1px solid #3730a3' }}>Custo</th>
                                <th style={{ padding: '8px', border: '1px solid #3730a3' }}>Dano</th>
                                <th style={{ padding: '8px', border: '1px solid #3730a3' }}>Peso</th>
                                <th style={{ padding: '8px', border: '1px solid #3730a3' }}>Propriedades</th>
                                <th style={{ padding: '8px', border: '1px solid #3730a3' }}>Maestria (2024)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td><strong>Adaga (Dagger)</strong></td><td>2 PO</td><td>1d4 perfurante</td><td>0,5 kg</td><td>Acuidade, Leve, Arremesso (distância 6/18m)</td><td><strong style={{ color: '#38bdf8' }}>Nick</strong></td></tr>
                            <tr><td><strong>Azagaia (Javelin)</strong></td><td>5 PP</td><td>1d6 perfurante</td><td>1 kg</td><td>Arremesso (distância 9/36m)</td><td><strong style={{ color: '#38bdf8' }}>Slow</strong></td></tr>
                            <tr><td><strong>Bordão (Quarterstaff)</strong></td><td>2 PP</td><td>1d6 concussão</td><td>2 kg</td><td>Versátil (1d8)</td><td><strong style={{ color: '#38bdf8' }}>Topple</strong></td></tr>
                            <tr><td><strong>Clava Grande (Greatclub)</strong></td><td>2 PP</td><td>1d8 concussão</td><td>4,5 kg</td><td>Duas Mãos</td><td><strong style={{ color: '#38bdf8' }}>Push</strong></td></tr>
                            <tr><td><strong>Foice Curta (Sickle)</strong></td><td>1 PO</td><td>1d4 cortante</td><td>1 kg</td><td>Leve</td><td><strong style={{ color: '#38bdf8' }}>Nick</strong></td></tr>
                            <tr><td><strong>Lança (Spear)</strong></td><td>1 PO</td><td>1d6 perfurante</td><td>1,5 kg</td><td>Arremesso (distância 6/18m), Versátil (1d8)</td><td><strong style={{ color: '#38bdf8' }}>Sap</strong></td></tr>
                            <tr><td><strong>Maça (Mace)</strong></td><td>5 PO</td><td>1d6 concussão</td><td>2 kg</td><td>&mdash;</td><td><strong style={{ color: '#38bdf8' }}>Sap</strong></td></tr>
                            <tr><td><strong>Machadinha (Handaxe)</strong></td><td>5 PO</td><td>1d6 cortante</td><td>1 kg</td><td>Leve, Arremesso (distância 6/18m)</td><td><strong style={{ color: '#38bdf8' }}>Vex</strong></td></tr>
                            <tr><td><strong>Martelo Leve (Light Hammer)</strong></td><td>2 PO</td><td>1d4 concussão</td><td>1 kg</td><td>Leve, Arremesso (distância 6/18m)</td><td><strong style={{ color: '#38bdf8' }}>Nick</strong></td></tr>
                            <tr><td><strong>Porrete (Club)</strong></td><td>1 PP</td><td>1d4 concussão</td><td>1 kg</td><td>Leve</td><td><strong style={{ color: '#38bdf8' }}>Slow</strong></td></tr>
                        </tbody>
                    </table>
                </div>

                {/* ARMAS SIMPLES À DISTÂNCIA */}
                <h3 style={{ color: '#c5a059', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>Armas Simples à Distância</h3>
                <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                        <thead>
                            <tr style={{ background: '#1c1926', color: '#c084fc', textAlign: 'left' }}>
                                <th style={{ padding: '8px', border: '1px solid #3730a3' }}>Arma</th>
                                <th style={{ padding: '8px', border: '1px solid #3730a3' }}>Custo</th>
                                <th style={{ padding: '8px', border: '1px solid #3730a3' }}>Dano</th>
                                <th style={{ padding: '8px', border: '1px solid #3730a3' }}>Peso</th>
                                <th style={{ padding: '8px', border: '1px solid #3730a3' }}>Propriedades</th>
                                <th style={{ padding: '8px', border: '1px solid #3730a3' }}>Maestria (2024)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td><strong>Arco Curto (Shortbow)</strong></td><td>25 PO</td><td>1d6 perfurante</td><td>1 kg</td><td>Munição (distância 24/96m), Duas Mãos</td><td><strong style={{ color: '#38bdf8' }}>Vex</strong></td></tr>
                            <tr><td><strong>Besta Leve (Light Crossbow)</strong></td><td>25 PO</td><td>1d8 perfurante</td><td>2,5 kg</td><td>Munição (distância 24/96m), Carregamento, Duas Mãos</td><td><strong style={{ color: '#38bdf8' }}>Slow</strong></td></tr>
                            <tr><td><strong>Dardo (Dart)</strong></td><td>5 PC</td><td>1d4 perfurante</td><td>0,1 kg</td><td>Acuidade, Arremesso (distância 6/18m)</td><td><strong style={{ color: '#38bdf8' }}>Vex</strong></td></tr>
                            <tr><td><strong>Funda (Sling)</strong></td><td>1 PP</td><td>1d4 concussão</td><td>&mdash;</td><td>Munição (distância 9/36m)</td><td><strong style={{ color: '#38bdf8' }}>Slow</strong></td></tr>
                        </tbody>
                    </table>
                </div>

                {/* ARMAS MARCIAIS CORPO A CORPO */}
                <h3 style={{ color: '#c5a059', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>Armas Marciais Corpo a Corpo</h3>
                <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                        <thead>
                            <tr style={{ background: '#1c1926', color: '#c084fc', textAlign: 'left' }}>
                                <th style={{ padding: '8px', border: '1px solid #3730a3' }}>Arma</th>
                                <th style={{ padding: '8px', border: '1px solid #3730a3' }}>Custo</th>
                                <th style={{ padding: '8px', border: '1px solid #3730a3' }}>Dano</th>
                                <th style={{ padding: '8px', border: '1px solid #3730a3' }}>Peso</th>
                                <th style={{ padding: '8px', border: '1px solid #3730a3' }}>Propriedades</th>
                                <th style={{ padding: '8px', border: '1px solid #3730a3' }}>Maestria (2024)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td><strong>Alabarda (Halberd)</strong></td><td>20 PO</td><td>1d10 cortante</td><td>3 kg</td><td>Pesada, Alcance, Duas Mãos</td><td><strong style={{ color: '#38bdf8' }}>Cleave</strong></td></tr>
                            <tr><td><strong>Chicote (Whip)</strong></td><td>2 PO</td><td>1d4 cortante</td><td>1,5 kg</td><td>Acuidade, Alcance</td><td><strong style={{ color: '#38bdf8' }}>Slow</strong></td></tr>
                            <tr><td><strong>Cimitarra (Scimitar)</strong></td><td>25 PO</td><td>1d6 cortante</td><td>1,5 kg</td><td>Acuidade, Leve</td><td><strong style={{ color: '#38bdf8' }}>Nick</strong></td></tr>
                            <tr><td><strong>Espada Curta (Shortsword)</strong></td><td>10 PO</td><td>1d6 perfurante</td><td>1 kg</td><td>Acuidade, Leve</td><td><strong style={{ color: '#38bdf8' }}>Vex</strong></td></tr>
                            <tr><td><strong>Espada Grande (Greatsword)</strong></td><td>50 PO</td><td>2d6 cortante</td><td>3 kg</td><td>Pesada, Duas Mãos</td><td><strong style={{ color: '#38bdf8' }}>Graze</strong></td></tr>
                            <tr><td><strong>Espada Longa (Longsword)</strong></td><td>15 PO</td><td>1d8 cortante</td><td>1,5 kg</td><td>Versátil (1d10)</td><td><strong style={{ color: '#38bdf8' }}>Sap</strong></td></tr>
                            <tr><td><strong>Estrela da Manhã (Morningstar)</strong></td><td>15 PO</td><td>1d8 perfurante</td><td>2 kg</td><td>&mdash;</td><td><strong style={{ color: '#38bdf8' }}>Sap</strong></td></tr>
                            <tr><td><strong>Glaive</strong></td><td>20 PO</td><td>1d10 cortante</td><td>3 kg</td><td>Pesada, Alcance, Duas Mãos</td><td><strong style={{ color: '#38bdf8' }}>Graze</strong></td></tr>
                            <tr><td><strong>Lança de Montaria (Lance)</strong></td><td>10 PO</td><td>1d12 perfurante</td><td>3 kg</td><td>Pesada, Alcance, Duas Mãos (uma mão montado)</td><td><strong style={{ color: '#38bdf8' }}>Topple</strong></td></tr>
                            <tr><td><strong>Machado de Batalha (Battleaxe)</strong></td><td>10 PO</td><td>1d8 cortante</td><td>2 kg</td><td>Versátil (1d10)</td><td><strong style={{ color: '#38bdf8' }}>Topple</strong></td></tr>
                            <tr><td><strong>Machado Grande (Greataxe)</strong></td><td>30 PO</td><td>1d12 cortante</td><td>3,5 kg</td><td>Pesada, Duas Mãos</td><td><strong style={{ color: '#38bdf8' }}>Cleave</strong></td></tr>
                            <tr><td><strong>Malho (Maul)</strong></td><td>10 PO</td><td>2d6 concussão</td><td>4,5 kg</td><td>Pesada, Duas Mãos</td><td><strong style={{ color: '#38bdf8' }}>Topple</strong></td></tr>
                            <tr><td><strong>Mangual (Flail)</strong></td><td>10 PO</td><td>1d8 concussão</td><td>1 kg</td><td>&mdash;</td><td><strong style={{ color: '#38bdf8' }}>Sap</strong></td></tr>
                            <tr><td><strong>Martelo de Guerra (Warhammer)</strong></td><td>15 PO</td><td>1d8 concussão</td><td>1 kg</td><td>Versátil (1d10)</td><td><strong style={{ color: '#38bdf8' }}>Push</strong></td></tr>
                            <tr><td><strong>Picareta de Guerra (War Pick)</strong></td><td>5 PO</td><td>1d8 perfurante</td><td>1 kg</td><td>Versátil (1d10)</td><td><strong style={{ color: '#38bdf8' }}>Sap</strong></td></tr>
                            <tr><td><strong>Pique (Pike)</strong></td><td>5 PO</td><td>1d10 perfurante</td><td>8 kg</td><td>Pesada, Alcance, Duas Mãos</td><td><strong style={{ color: '#38bdf8' }}>Push</strong></td></tr>
                            <tr><td><strong>Rapieira (Rapier)</strong></td><td>25 PO</td><td>1d8 perfurante</td><td>1 kg</td><td>Acuidade</td><td><strong style={{ color: '#38bdf8' }}>Vex</strong></td></tr>
                            <tr><td><strong>Tridente (Trident)</strong></td><td>5 PO</td><td>1d8 perfurante</td><td>2 kg</td><td>Arremesso (distância 6/18m), Versátil (1d10)</td><td><strong style={{ color: '#38bdf8' }}>Topple</strong></td></tr>
                        </tbody>
                    </table>
                </div>

                {/* ARMAS MARCIAIS À DISTÂNCIA */}
                <h3 style={{ color: '#c5a059', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>Armas Marciais à Distância</h3>
                <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                        <thead>
                            <tr style={{ background: '#1c1926', color: '#c084fc', textAlign: 'left' }}>
                                <th style={{ padding: '8px', border: '1px solid #3730a3' }}>Arma</th>
                                <th style={{ padding: '8px', border: '1px solid #3730a3' }}>Custo</th>
                                <th style={{ padding: '8px', border: '1px solid #3730a3' }}>Dano</th>
                                <th style={{ padding: '8px', border: '1px solid #3730a3' }}>Peso</th>
                                <th style={{ padding: '8px', border: '1px solid #3730a3' }}>Propriedades</th>
                                <th style={{ padding: '8px', border: '1px solid #3730a3' }}>Maestria (2024)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td><strong>Arco Longo (Longbow)</strong></td><td>50 PO</td><td>1d8 perfurante</td><td>1 kg</td><td>Munição (distância 45/180m), Pesada, Duas Mãos</td><td><strong style={{ color: '#38bdf8' }}>Slow</strong></td></tr>
                            <tr><td><strong>Besta de Mão (Hand Crossbow)</strong></td><td>75 PO</td><td>1d6 perfurante</td><td>1,5 kg</td><td>Munição (distância 9/36m), Leve, Carregamento</td><td><strong style={{ color: '#38bdf8' }}>Vex</strong></td></tr>
                            <tr><td><strong>Besta Pesada (Heavy Crossbow)</strong></td><td>50 PO</td><td>1d10 perfurante</td><td>8 kg</td><td>Munição (distância 30/120m), Pesada, Carregamento, Duas Mãos</td><td><strong style={{ color: '#38bdf8' }}>Push</strong></td></tr>
                            <tr><td><strong>Zarabatana (Blowgun)</strong></td><td>10 PO</td><td>1 perfurante</td><td>0,5 kg</td><td>Munição (distância 7,5/30m), Carregamento</td><td><strong style={{ color: '#38bdf8' }}>Nick</strong></td></tr>
                            <tr><td><strong>Rede (Net)</strong></td><td>1 PO</td><td>Especial (Contido)</td><td>1,5 kg</td><td>Especial, Arremesso (distância 1,5/4,5m)</td><td>&mdash;</td></tr>
                        </tbody>
                    </table>
                </div>

                {/* DETALHAMENTO DAS 8 MAESTRIAS */}
                <h3 style={{ color: '#c5a059', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>As 8 Propriedades de Maestria em Combate (2024)</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
                    <div style={{ background: '#181b2a', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #38bdf8' }}>
                        <strong style={{ color: '#38bdf8' }}>Cleave (Trespassar):</strong> Se acertar um ataque corpo a corpo, você pode fazer outro ataque imediato contra uma segunda criatura a até 1,5m da primeira. Se acertar, causa dano da arma (sem modificador de atributo).
                    </div>
                    <div style={{ background: '#181b2a', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #38bdf8' }}>
                        <strong style={{ color: '#38bdf8' }}>Graze (Arranhão):</strong> Mesmo se o seu ataque errar o alvo, você ainda causa dano igual ao seu <strong>Modificador de Atributo</strong> (Força ou Destreza) correspondente.
                    </div>
                    <div style={{ background: '#181b2a', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #38bdf8' }}>
                        <strong style={{ color: '#38bdf8' }}>Nick (Golpe Rápido):</strong> Permite fazer o ataque extra da propriedade <em>Leve (Light)</em> como parte da sua Ação de Ataque padrão, em vez de gastar sua Ação Bônus.
                    </div>
                    <div style={{ background: '#181b2a', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #38bdf8' }}>
                        <strong style={{ color: '#38bdf8' }}>Push (Empurrão):</strong> Se acertar uma criatura Grande ou menor, você pode empurrá-la até 3 metros (10 pés) em linha reta para longe de você. Não exige salvaguarda.
                    </div>
                    <div style={{ background: '#181b2a', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #38bdf8' }}>
                        <strong style={{ color: '#38bdf8' }}>Sap (Debilitar):</strong> Ao acertar um inimigo, o próximo ataque que ele fizer antes do início do seu próximo turno terá <strong>Desvantagem</strong>.
                    </div>
                    <div style={{ background: '#181b2a', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #38bdf8' }}>
                        <strong style={{ color: '#38bdf8' }}>Slow (Lentidão):</strong> Se acertar e causar dano, o deslocamento da criatura é reduzido em 3 metros (10 pés) até o início do seu próximo turno.
                    </div>
                    <div style={{ background: '#181b2a', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #38bdf8' }}>
                        <strong style={{ color: '#38bdf8' }}>Topple (Derrubar):</strong> Ao acertar, a criatura deve passar em um Teste de Resistência de Constituição (CD = 8 + Bônus de Proficiência + mod de atributo de ataque) ou cairá <strong>Caída (Prone)</strong>.
                    </div>
                    <div style={{ background: '#181b2a', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #38bdf8' }}>
                        <strong style={{ color: '#38bdf8' }}>Vex (Afligir):</strong> Ao acertar e causar dano, você ganha <strong>Vantagem</strong> no seu próximo ataque contra essa mesma criatura antes do final do seu próximo turno.
                    </div>
                </div>
            </div>
        )
    },

    // =========================================================================
    // 2. ARMADURAS, ESCUDOS & TEMPOS DE VESTIR (PHB OFICIAL)
    // =========================================================================
    {
        id: 'phb_armor_shields_complete',
        title: 'Cap. 6: Armaduras, Escudos & Tempos de Vestir',
        category: 'Equipamentos & Armas (Cap. 6)',
        content: (
            <div>
                <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '16px' }}>
                    O D&D 2024 define as armaduras em três categorias: <strong>Leve</strong>, <strong>Média</strong> e <strong>Pesada</strong>, além dos <strong>Escudos</strong>.
                    O uso de armaduras exige proficiência adequada da classe para evitar penalidades severas em testes de atributo e impossibilidade de conjurar magias.
                </p>

                <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                        <thead>
                            <tr style={{ background: '#1e1b2e', color: '#c084fc', textAlign: 'left' }}>
                                <th style={{ padding: '8px', border: '1px solid #3730a3' }}>Armadura</th>
                                <th style={{ padding: '8px', border: '1px solid #3730a3' }}>Custo</th>
                                <th style={{ padding: '8px', border: '1px solid #3730a3' }}>Classe de Armadura (CA)</th>
                                <th style={{ padding: '8px', border: '1px solid #3730a3' }}>Força Mínima</th>
                                <th style={{ padding: '8px', border: '1px solid #3730a3' }}>Furtividade</th>
                                <th style={{ padding: '8px', border: '1px solid #3730a3' }}>Peso</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style={{ background: 'rgba(255,255,255,0.03)' }}><td colSpan={6}><strong style={{ color: '#e11d48' }}>Armaduras Leves (Soma Modificador de Destreza Completo)</strong></td></tr>
                            <tr><td>Acolchoada (Padded)</td><td>5 PO</td><td>11 + mod DES</td><td>&mdash;</td><td>Desvantagem</td><td>4 kg</td></tr>
                            <tr><td>Couro (Leather)</td><td>10 PO</td><td>11 + mod DES</td><td>&mdash;</td><td>Normal</td><td>5 kg</td></tr>
                            <tr><td>Couro Batido (Studded Leather)</td><td>45 PO</td><td>12 + mod DES</td><td>&mdash;</td><td>Normal</td><td>6,5 kg</td></tr>

                            <tr style={{ background: 'rgba(255,255,255,0.03)' }}><td colSpan={6}><strong style={{ color: '#e11d48' }}>Armaduras Médias (Soma Modificador de Destreza até no máximo +2)</strong></td></tr>
                            <tr><td>Gibão de Peles (Hide)</td><td>10 PO</td><td>12 + mod DES (máx. +2)</td><td>&mdash;</td><td>Normal</td><td>6 kg</td></tr>
                            <tr><td>Camisão de Malha (Chain Shirt)</td><td>50 PO</td><td>13 + mod DES (máx. +2)</td><td>&mdash;</td><td>Normal</td><td>10 kg</td></tr>
                            <tr><td>Brunea (Scale Mail)</td><td>50 PO</td><td>14 + mod DES (máx. +2)</td><td>&mdash;</td><td>Desvantagem</td><td>20 kg</td></tr>
                            <tr><td>Peitoral de Aço (Breastplate)</td><td>400 PO</td><td>14 + mod DES (máx. +2)</td><td>&mdash;</td><td>Normal</td><td>10 kg</td></tr>
                            <tr><td>Meia-Armadura (Half Plate)</td><td>750 PO</td><td>15 + mod DES (máx. +2)</td><td>&mdash;</td><td>Desvantagem</td><td>20 kg</td></tr>

                            <tr style={{ background: 'rgba(255,255,255,0.03)' }}><td colSpan={6}><strong style={{ color: '#e11d48' }}>Armaduras Pesadas (Não Soma Modificador de Destreza)</strong></td></tr>
                            <tr><td>Cota de Anéis (Ring Mail)</td><td>30 PO</td><td>CA 14 fixo</td><td>&mdash;</td><td>Desvantagem</td><td>20 kg</td></tr>
                            <tr><td>Cota de Malha (Chain Mail)</td><td>75 PO</td><td>CA 16 fixo</td><td>FOR 13</td><td>Desvantagem</td><td>25 kg</td></tr>
                            <tr><td>Cota de Talas (Splint)</td><td>200 PO</td><td>CA 17 fixo</td><td>FOR 15</td><td>Desvantagem</td><td>27 kg</td></tr>
                            <tr><td>Armadura de Placas (Plate)</td><td>1.500 PO</td><td>CA 18 fixo</td><td>FOR 15</td><td>Desvantagem</td><td>30 kg</td></tr>

                            <tr style={{ background: 'rgba(255,255,255,0.03)' }}><td colSpan={6}><strong style={{ color: '#e11d48' }}>Escudos</strong></td></tr>
                            <tr><td>Escudo (Shield)</td><td>10 PO</td><td>+2 na CA</td><td>&mdash;</td><td>Normal</td><td>3 kg</td></tr>
                        </tbody>
                    </table>
                </div>

                {/* TEMPOS DE VESTIR E DESPIR */}
                <h3 style={{ color: '#c5a059', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>Tempos de Vestir e Despir Armadura (Donning & Doffing)</h3>
                <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                        <thead>
                            <tr style={{ background: '#1c1926', color: '#38bdf8', textAlign: 'left' }}>
                                <th style={{ padding: '8px', border: '1px solid #3730a3' }}>Categoria</th>
                                <th style={{ padding: '8px', border: '1px solid #3730a3' }}>Tempo para Vestir (Don)</th>
                                <th style={{ padding: '8px', border: '1px solid #3730a3' }}>Tempo para Despir (Doff)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td><strong>Armadura Leve</strong></td><td>1 minuto</td><td>1 minuto</td></tr>
                            <tr><td><strong>Armadura Média</strong></td><td>5 minutos</td><td>1 minuto</td></tr>
                            <tr><td><strong>Armadura Pesada</strong></td><td>10 minutos</td><td>5 minutos</td></tr>
                            <tr><td><strong>Escudo</strong></td><td>1 Ação (ou 1 Ação Bônus em certas regras)</td><td>1 Ação</td></tr>
                        </tbody>
                    </table>
                </div>

                <div style={{ background: 'rgba(225, 29, 72, 0.08)', border: '1px solid #e11d48', padding: '14px', borderRadius: '8px' }}>
                    <h4 style={{ color: '#f43f5e', margin: '0 0 6px 0' }}>Penalidade de Força Mínima em Armaduras Pesadas</h4>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#cbd5e1', lineHeight: '1.5' }}>
                        Se um aventureiro vestir uma armadura que exija um valor de Força superior ao seu atributo atual, o seu <strong>Deslocamento é reduzido em 3 metros (10 pés)</strong> enquanto a estiver vestindo.
                    </p>
                </div>
            </div>
        )
    },

    // =========================================================================
    // 3. EQUIPAMENTOS DE AVENTURA, VESTUÁRIO & FERRAMENTAS (PHB OFICIAL)
    // =========================================================================
    {
        id: 'phb_adventuring_gear_tools',
        title: 'Cap. 6: Equipamentos de Aventura, Vestuário & Ferramentas',
        category: 'Equipamentos & Armas (Cap. 6)',
        content: (
            <div>
                <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '16px' }}>
                    O sucesso de uma expedição nas masmorras depende tanto de cordas, tochas e kits de primeiros socorros quanto de espadas afiadas.
                </p>

                {/* VESTUÁRIO E CLARIFICAÇÃO DE CA */}
                <h3 style={{ color: '#c5a059', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>Vestuário, Roupas e Regra de CA</h3>
                <div style={{ background: 'rgba(56, 189, 248, 0.08)', border: '1px solid #38bdf8', padding: '14px', borderRadius: '8px', marginBottom: '20px' }}>
                    <strong style={{ color: '#38bdf8' }}>Regra Fundamental de Roupas no D&D:</strong>
                    <p style={{ margin: '6px 0 0 0', color: '#cbd5e1', fontSize: '0.9rem', lineHeight: '1.5' }}>
                        Nenhum conjunto de roupas comuns, de campanha, nobres ou de viajante concede bônus de Classe de Armadura (CA). O personagem vestindo apenas roupa é considerado <strong>Sem Armadura</strong> (CA = 10 + modificador de Destreza).
                    </p>
                </div>

                <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                        <thead>
                            <tr style={{ background: '#1c1926', color: '#c084fc', textAlign: 'left' }}>
                                <th style={{ padding: '8px', border: '1px solid #3730a3' }}>Item de Vestuário</th>
                                <th style={{ padding: '8px', border: '1px solid #3730a3' }}>Custo</th>
                                <th style={{ padding: '8px', border: '1px solid #3730a3' }}>Peso</th>
                                <th style={{ padding: '8px', border: '1px solid #3730a3' }}>Efeito / Descrição Mecânica</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td><strong>Roupas Comuns (Common Clothes)</strong></td><td>5 PP</td><td>1,5 kg</td><td>Roupas rústicas de plebeu ou camponês. <strong>CA: +0 (Sem Armadura)</strong>.</td></tr>
                            <tr><td><strong>Roupas de Campanha / Viajante (Traveler's)</strong></td><td>2 PO</td><td>2 kg</td><td>Capa resistente, botas de couro tratadas e túnica reforçada para marchas e intempéries. <strong>CA: +0</strong>.</td></tr>
                            <tr><td><strong>Roupas Finas / Nobres (Fine Clothes)</strong></td><td>15 PO</td><td>3 kg</td><td>Sedas, veludos e adornos para audiências com realeza e bailes de nobreza. <strong>CA: +0</strong>.</td></tr>
                            <tr><td><strong>Traje de Fantasia / Disfarce (Costume)</strong></td><td>5 PO</td><td>2 kg</td><td>Trajes temáticos para bardos, atores teatrais e infiltrações sociais. <strong>CA: +0</strong>.</td></tr>
                            <tr><td><strong>Manto com Capuz (Robes)</strong></td><td>1 PO</td><td>2 kg</td><td>Vestimenta tradicional de monges, acólitos e conjuradores arcanos. <strong>CA: +0</strong>.</td></tr>
                        </tbody>
                    </table>
                </div>

                {/* EQUIPAMENTOS GERAIS DE EXPLORAÇÃO */}
                <h3 style={{ color: '#c5a059', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>Equipamentos Gerais de Aventura (PHB Oficial)</h3>
                <div style={{ overflowX: 'auto', marginBottom: '24px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                        <thead>
                            <tr style={{ background: '#1c1926', color: '#c084fc', textAlign: 'left' }}>
                                <th style={{ padding: '8px', border: '1px solid #3730a3' }}>Item</th>
                                <th style={{ padding: '8px', border: '1px solid #3730a3' }}>Custo</th>
                                <th style={{ padding: '8px', border: '1px solid #3730a3' }}>Peso</th>
                                <th style={{ padding: '8px', border: '1px solid #3730a3' }}>Utilidade / Efeito</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td><strong>Kit de Curandeiro (Healer's Kit)</strong></td><td>5 PO</td><td>1,5 kg</td><td>Possui 10 usos. Com 1 Ação, estabiliza uma criatura moribunda com 0 PV sem teste de Sabedoria (Medicina).</td></tr>
                            <tr><td><strong>Pé de Cabra (Crowbar)</strong></td><td>2 PO</td><td>2,5 kg</td><td>Concede <strong>Vantagem</strong> em testes de Força para forçar portas, grades e baús trancados.</td></tr>
                            <tr><td><strong>Corda de Cânhamo (15 metros)</strong></td><td>1 PO</td><td>5 kg</td><td>Possui 2 PV e pode ser arrebentada com um teste de Força CD 17.</td></tr>
                            <tr><td><strong>Corda de Seda (15 metros)</strong></td><td>10 PO</td><td>2,5 kg</td><td>Leve e resistente. Possui 2 PV e exige teste de Força CD 17 para arrebentar.</td></tr>
                            <tr><td><strong>Lanterna Furta-Fogo (Bullseye Lantern)</strong></td><td>10 PO</td><td>1 kg</td><td>Projeta cone de 18m de luz plena e 18m de luz penumbrosa por 6 horas com 1 frasco de óleo.</td></tr>
                            <tr><td><strong>Lanterna Coberta (Hooded Lantern)</strong></td><td>5 PO</td><td>1 kg</td><td>Emite luz plena num raio de 9m por 6 horas. O postigo pode ser fechado para luz penumbrosa de 1,5m.</td></tr>
                            <tr><td><strong>Tocha (Torch)</strong></td><td>1 PC</td><td>0,5 kg</td><td>Queima por 1 hora, iluminando 6m em raio de luz plena e mais 6m de luz penumbrosa. Pode atacar como clava (1 de dano de fogo).</td></tr>
                            <tr><td><strong>Rações de Viagem (1 dia)</strong></td><td>5 PP</td><td>1 kg</td><td>Alimentos desidratados e secos com calorias suficientes para 1 dia completo de marcha forçada.</td></tr>
                            <tr><td><strong>Cantil (Waterskin)</strong></td><td>2 PP</td><td>2,5 kg (cheio)</td><td>Comporta até 2 litros de água ou vinho.</td></tr>
                            <tr><td><strong>Arpéu (Grappling Hook)</strong></td><td>2 PO</td><td>2 kg</td><td>Gancho metálico de ancoragem fixado em cordas para escalar muralhas e despenhadeiros.</td></tr>
                            <tr><td><strong>Pítons de Ferro (10 unidades)</strong></td><td>5 PP</td><td>2,5 kg</td><td>Estacas de aço cravadas em rochas para amarrar cordas de segurança em escaladas verticais.</td></tr>
                            <tr><td><strong>Mochila (Backpack)</strong></td><td>2 PO</td><td>2,5 kg</td><td>Capacidade para até 30 litros ou 15 kg de equipamentos.</td></tr>
                            <tr><td><strong>Grimório de Mago (Spellbook)</strong></td><td>50 PO</td><td>1,5 kg</td><td>Tomo com 100 páginas de pergaminho encadernado em couro para registro de magias.</td></tr>
                            <tr><td><strong>Símbolo Sagrado (Relicário / Amuleto)</strong></td><td>5 PO</td><td>0,5 kg</td><td>Foco de conjuração para Clérigos e Paladinos.</td></tr>
                            <tr><td><strong>Foco Arcano (Varinha, Cajado, Cristal)</strong></td><td>5 a 10 PO</td><td>0,5 a 2 kg</td><td>Canalizador arcano para Magos, Bruxos, Feiticeiros e Bardos.</td></tr>
                        </tbody>
                    </table>
                </div>

                {/* FERRAMENTAS E KITS DE PROFICIÊNCIA */}
                <h3 style={{ color: '#c5a059', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>Ferramentas & Kits Especializados</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
                    <div style={{ background: '#1c1926', padding: '12px', borderRadius: '6px' }}>
                        <strong style={{ color: '#e11d48' }}>Ferramentas de Ladrão (Thieves' Tools - 25 PO):</strong> Gazua, alicates e espelhos para desarmar armadilhas e abrir fechaduras mecânicas.
                    </div>
                    <div style={{ background: '#1c1926', padding: '12px', borderRadius: '6px' }}>
                        <strong style={{ color: '#e11d48' }}>Kit de Herbalismo (Herbalism Kit - 5 PO):</strong> Bolsas, tesouras e pilão para colher plantas medicinais e produzir <em>Poções de Cura</em>.
                    </div>
                    <div style={{ background: '#1c1926', padding: '12px', borderRadius: '6px' }}>
                        <strong style={{ color: '#e11d48' }}>Kit de Disfarce (Disguise Kit - 25 PO):</strong> Cosméticos, perucas e adereços para alterar a aparência física com testes de Carisma (Enganação).
                    </div>
                    <div style={{ background: '#1c1926', padding: '12px', borderRadius: '6px' }}>
                        <strong style={{ color: '#e11d48' }}>Kit de Falsificação (Forgery Kit - 15 PO):</strong> Papéis finos, tintas especiais, cera e carimbos para duplicar documentos e decretos régios.
                    </div>
                    <div style={{ background: '#1c1926', padding: '12px', borderRadius: '6px' }}>
                        <strong style={{ color: '#e11d48' }}>Kit de Envenenador (Poisoner's Kit - 50 PO):</strong> Vidraria e reagentes para extrair toxinas animais/vegetais e confeccionar venenos letais.
                    </div>
                    <div style={{ background: '#1c1926', padding: '12px', borderRadius: '6px' }}>
                        <strong style={{ color: '#e11d48' }}>Ferramentas de Navegador (25 PO):</strong> Astrolábio, sextante e mapas para traçar rotas marítimas e evitar se perder em alto-mar.
                    </div>
                </div>
            </div>
        )
    },

    // =========================================================================
    // 4. MONTARIAS, VEÍCULOS & ESTILO DE VIDA (PHB OFICIAL)
    // =========================================================================
    {
        id: 'phb_mounts_vehicles_services',
        title: 'Cap. 6: Montarias, Veículos & Estilo de Vida',
        category: 'Equipamentos & Armas (Cap. 6)',
        content: (
            <div>
                <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '16px' }}>
                    Montarias e carruagens aceleram o deslocamento em longas viagens, transportam espólios de masmorras e concedem vantagens táticas no combate em campo aberto.
                </p>

                <h3 style={{ color: '#c5a059', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>Montarias e Criaturas de Carga</h3>
                <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                        <thead>
                            <tr style={{ background: '#1c1926', color: '#c084fc', textAlign: 'left' }}>
                                <th style={{ padding: '8px', border: '1px solid #3730a3' }}>Criatura</th>
                                <th style={{ padding: '8px', border: '1px solid #3730a3' }}>Custo</th>
                                <th style={{ padding: '8px', border: '1px solid #3730a3' }}>Velocidade</th>
                                <th style={{ padding: '8px', border: '1px solid #3730a3' }}>Capacidade de Carga</th>
                                <th style={{ padding: '8px', border: '1px solid #3730a3' }}>Pontos de Vida (PV)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td><strong>Cavalo de Montaria (Riding Horse)</strong></td><td>75 PO</td><td>18 metros (60 pés)</td><td>240 kg</td><td>13 PV</td></tr>
                            <tr><td><strong>Cavalo de Guerra (Warhorse)</strong></td><td>400 PO</td><td>18 metros (60 pés)</td><td>270 kg</td><td>19 PV (Pisotear)</td></tr>
                            <tr><td><strong>Mula (Mule)</strong></td><td>8 PO</td><td>12 metros (40 pés)</td><td>210 kg (Fera de Carga)</td><td>11 PV</td></tr>
                            <tr><td><strong>Pônei (Pony)</strong></td><td>30 PO</td><td>12 metros (40 pés)</td><td>112 kg</td><td>11 PV</td></tr>
                            <tr><td><strong>Camelo (Camel)</strong></td><td>50 PO</td><td>15 metros (50 pés)</td><td>240 kg</td><td>15 PV</td></tr>
                            <tr><td><strong>Mastim (Mastiff)</strong></td><td>25 PO</td><td>12 metros (40 pés)</td><td>97 kg</td><td>5 PV</td></tr>
                        </tbody>
                    </table>
                </div>

                <h3 style={{ color: '#c5a059', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>Despesas Diárias de Estilo de Vida (Lifestyle Expenses)</h3>
                <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                        <thead>
                            <tr style={{ background: '#1c1926', color: '#38bdf8', textAlign: 'left' }}>
                                <th style={{ padding: '8px', border: '1px solid #3730a3' }}>Estilo de Vida</th>
                                <th style={{ padding: '8px', border: '1px solid #3730a3' }}>Custo / Dia</th>
                                <th style={{ padding: '8px', border: '1px solid #3730a3' }}>Condições de Acomodação & Refeições</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td><strong>Miserável (Wretched)</strong></td><td>0 PO</td><td>Dorme na lama ou celeiros abandonados; consome restos de lixo. Risco alto de doenças.</td></tr>
                            <tr><td><strong>Pobre (Poor)</strong></td><td>2 PP</td><td>Cama coletiva em estábulos ou albergues sujos; sopa rala e pão duro.</td></tr>
                            <tr><td><strong>Modesto (Modest)</strong></td><td>1 PO</td><td>Quarto privativo em estalagem simples; refeições quentes e água limpa.</td></tr>
                            <tr><td><strong>Confortável (Comfortable)</strong></td><td>2 PO</td><td>Quarto espaçoso em taverna respeitada; roupas limpas e comida farta.</td></tr>
                            <tr><td><strong>Rico (Wealthy)</strong></td><td>4 PO</td><td>Suíte luxuosa, refeições requintadas e serviçais à disposição.</td></tr>
                            <tr><td><strong>Aristocrático (Aristocratic)</strong></td><td>10+ PO</td><td>Palacetes particulares, alta costura, banquetes e influência política com a corte.</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
];
