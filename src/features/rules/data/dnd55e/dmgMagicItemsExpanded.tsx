import type { RuleSection } from '../../RulebookViewer';

export const DND55E_DMG_MAGIC_ITEMS_SECTIONS: RuleSection[] = [
    // =========================================================================
    // 1. REGRAS DE ITENS MÁGICOS, SINTONIZAÇÃO & IDENTIFICAÇÃO (DMG)
    // =========================================================================
    {
        id: 'dmg_magic_items_rules',
        title: 'Cap. 7: Regras Oficiais de Itens Mágicos & Sintonização',
        category: 'Itens Mágicos & Relíquias (Cap. 7)',
        content: (
            <div>
                <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '16px' }}>
                    Itens mágicos são os tesouros mais cobiçados do multiverso de D&D. Eles variam de poções comuns de uso único até relíquias lendárias que alteram o destino de impérios inteiros.
                </p>

                <div style={{ background: 'rgba(225, 29, 72, 0.08)', border: '1px solid #e11d48', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
                    <h3 style={{ color: '#f43f5e', margin: '0 0 10px 0' }}>Regras Canônicas de Sintonização (Attunement)</h3>
                    <ul style={{ margin: 0, paddingLeft: '20px', color: '#fecdd3', lineHeight: '1.7' }}>
                        <li><strong>Limite Máximo:</strong> Um personagem pode estar sintonizado com no máximo <strong>3 itens mágicos simultaneamente</strong> (ou 4 para Ladinos Ladrões de 10º nível e 6 para Artífices).</li>
                        <li><strong>Processo de Sintonização:</strong> Exige um <strong>Descanso Curto</strong> dedicado exclusivamente à comunhão mental e física com o item (empunhando a arma, vestindo o anel ou meditando).</li>
                        <li><strong>Rompimento de Sintonização:</strong> A sintonização é encerrada se o personagem passar mais de 24 horas a mais de 30 metros do item, se morrer, ou se outro herói se sintonizar com ele após um descanso.</li>
                        <li><strong>Itens com Pré-requisitos:</strong> Alguns itens exigem classes, atributos ou alinhamentos específicos (ex: <em>"Requer sintonização por um Clérigo ou Paladino"</em>). Se o personagem perder o pré-requisito, a sintonização se desfaz imediatamente.</li>
                    </ul>
                </div>

                <h3 style={{ color: '#c5a059', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>Como Identificar um Item Mágico</h3>
                <p style={{ color: '#cbd5e1', lineHeight: '1.6' }}>
                    O Mestre pode revelar as propriedades de um item mágico através de três métodos oficiais do DMG:
                </p>
                <ul>
                    <li><strong>Magia Identificar (Identify):</strong> Ritual de 1 minuto ou 1 Ação com pérola de 100 PO. Revela instantaneamente todas as propriedades, maldições e se exige sintonização.</li>
                    <li><strong>Descanso Curto de Inspeção:</strong> Um personagem que passe 1 hora manuseando o item descobre suas propriedades normais (embora maldições permaneçam ocultas até serem ativadas).</li>
                    <li><strong>Experimentação / Consumíveis:</strong> Provar um gole microscópico de uma poção revela seu efeito sem consumi-la.</li>
                </ul>
            </div>
        )
    },

    // =========================================================================
    // 2. CATÁLOGO COMPLETO: ITENS COMUNS & INCOMUNS (DMG)
    // =========================================================================
    {
        id: 'dmg_magic_items_common_uncommon',
        title: 'Cap. 7: Catálogo: Itens Comuns & Incomuns',
        category: 'Itens Mágicos & Relíquias (Cap. 7)',
        content: (
            <div>
                <h3 style={{ color: '#c5a059', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>Itens Mágicos Comuns (Common - 50 a 100 PO)</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px', marginBottom: '24px' }}>
                    <div style={{ background: '#181b2a', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #94a3b8' }}>
                        <strong style={{ color: '#f8fafc' }}>Poção de Cura (Potion of Healing):</strong> Poção | Comum.<br />
                        <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Líquido vermelho brilhante. Beber ou administrar em um aliado com 1 Ação restaura <strong>2d4 + 2 Pontos de Vida</strong>.</span>
                    </div>
                    <div style={{ background: '#181b2a', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #94a3b8' }}>
                        <strong style={{ color: '#f8fafc' }}>Pergaminho de Magia (Truque a 1º Nível):</strong> Pergaminho | Comum.<br />
                        <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Permite a um conjurador lançar a magia escrita sem gastar espaço de magia. Se estiver na sua lista de classe, o pergaminho se consome em pó após o uso.</span>
                    </div>
                    <div style={{ background: '#181b2a', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #94a3b8' }}>
                        <strong style={{ color: '#f8fafc' }}>Manto de Muitas Modas (Cloak of Many Fashions):</strong> Maravilhoso | Comum.<br />
                        <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Como ação bônus, você altera a cor, corte e aparência do manto para qualquer estilo mundano desejado.</span>
                    </div>
                </div>

                <h3 style={{ color: '#c5a059', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>Itens Mágicos Incomuns (Uncommon - 101 a 500 PO)</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
                    <div style={{ background: '#181b2a', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #22c55e' }}>
                        <strong style={{ color: '#22c55e' }}>Arma +1 (Qualquer Arma):</strong> Arma | Incomum.<br />
                        <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Você ganha <strong>+1 nas jogadas de ataque e dano</strong> feitas com esta arma mágica, superando imunidades a armas mundanas.</span>
                    </div>
                    <div style={{ background: '#181b2a', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #22c55e' }}>
                        <strong style={{ color: '#22c55e' }}>Escudo +1 (Shield +1):</strong> Armadura | Incomum.<br />
                        <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Concede um bônus de <strong>+3 na CA</strong> no total (+2 base do escudo e +1 de bônus mágico).</span>
                    </div>
                    <div style={{ background: '#181b2a', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #22c55e' }}>
                        <strong style={{ color: '#22c55e' }}>Bolsa de Carga (Bag of Holding):</strong> Maravilhoso | Incomum.<br />
                        <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Pesa 7 kg, mas suporta internamente até <strong>250 kg</strong> e 1,8 metros cúbicos em uma dimensão de bolso. Se for perfurada ou colocada dentro de outro espaço extradimensional, explode em portal para o Plano Astral!</span>
                    </div>
                    <div style={{ background: '#181b2a', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #22c55e' }}>
                        <strong style={{ color: '#22c55e' }}>Botas Aladas (Winged Boots):</strong> Maravilhoso | Incomum (Sintonização).<br />
                        <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Concede <strong>Deslocamento de Voo</strong> igual ao seu deslocamento de caminhada por até 4 horas cumulativas por dia.</span>
                    </div>
                    <div style={{ background: '#181b2a', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #22c55e' }}>
                        <strong style={{ color: '#22c55e' }}>Manto de Proteção (Cloak of Protection):</strong> Maravilhoso | Incomum (Sintonização).<br />
                        <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Você ganha <strong>+1 na Classe de Armadura (CA)</strong> e <strong>+1 em todos os Testes de Resistência</strong> enquanto o vestir.</span>
                    </div>
                    <div style={{ background: '#181b2a', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #22c55e' }}>
                        <strong style={{ color: '#22c55e' }}>Manoplas de Força do Ogro:</strong> Maravilhoso | Incomum (Sintonização).<br />
                        <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>O seu valor de Força torna-se <strong>19 fixo (+4)</strong> enquanto as usar. Não tem efeito se sua Força já for 19 ou maior.</span>
                    </div>
                    <div style={{ background: '#181b2a', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #22c55e' }}>
                        <strong style={{ color: '#22c55e' }}>Tiara do Intelecto (Headband of Intellect):</strong> Maravilhoso | Incomum (Sintonização).<br />
                        <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>O seu valor de Inteligência torna-se <strong>19 fixo (+4)</strong> enquanto a usar.</span>
                    </div>
                    <div style={{ background: '#181b2a', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #22c55e' }}>
                        <strong style={{ color: '#22c55e' }}>Varinha de Mísseis Mágicos:</strong> Varinha | Incomum.<br />
                        <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Possui 7 cargas. Com 1 Ação, gaste 1 ou mais cargas para conjurar <em>Mísseis Mágicos</em> (1 dardo extra por carga gasta). Recupera 1d6 + 1 cargas ao amanhecer.</span>
                    </div>
                    <div style={{ background: '#181b2a', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #22c55e' }}>
                        <strong style={{ color: '#22c55e' }}>Arma de Advertência (Weapon of Warning):</strong> Arma | Incomum (Sintonização).<br />
                        <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Você e seus aliados a até 9 metros ganham <strong>Vantagem em Iniciativa</strong> e nunca podem ser surpreendidos em combate!</span>
                    </div>
                </div>
            </div>
        )
    },

    // =========================================================================
    // 3. CATÁLOGO COMPLETO: ITENS RAROS & MUITO RAROS (DMG)
    // =========================================================================
    {
        id: 'dmg_magic_items_rare_very_rare',
        title: 'Cap. 7: Catálogo: Itens Raros & Muito Raros',
        category: 'Itens Mágicos & Relíquias (Cap. 7)',
        content: (
            <div>
                <h3 style={{ color: '#c5a059', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>Itens Mágicos Raros (Rare - 501 a 5.000 PO)</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px', marginBottom: '24px' }}>
                    <div style={{ background: '#181b2a', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #38bdf8' }}>
                        <strong style={{ color: '#38bdf8' }}>Arma +2 (Qualquer Arma):</strong> Arma | Raro.<br />
                        <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Concede <strong>+2 nas jogadas de ataque e dano</strong> de combate.</span>
                    </div>
                    <div style={{ background: '#181b2a', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #38bdf8' }}>
                        <strong style={{ color: '#38bdf8' }}>Espada Flamejante (Flame Tongue):</strong> Arma | Raro (Sintonização).<br />
                        <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Com 1 ação bônus, pronuncie a palavra de comando para acender a lâmina em fogo abrasador. Causa <strong>+2d6 de dano de fogo extra</strong> em cada golpe e ilumina 12m com luz plena!</span>
                    </div>
                    <div style={{ background: '#181b2a', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #38bdf8' }}>
                        <strong style={{ color: '#38bdf8' }}>Armadura de Adamante:</strong> Armadura (Média ou Pesada) | Incomum a Raro.<br />
                        <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Forjada no metal mais resistente do cosmos. <strong>Converte qualquer Acerto Crítico sofrido pelo portador em um acerto normal!</strong></span>
                    </div>
                    <div style={{ background: '#181b2a', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #38bdf8' }}>
                        <strong style={{ color: '#38bdf8' }}>Amuleto da Saúde (Amulet of Health):</strong> Maravilhoso | Raro (Sintonização).<br />
                        <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>O seu valor de Constituição torna-se <strong>19 fixo (+4)</strong>, aumentando seus Pontos de Vida máximos e salvaguardas de concentração!</span>
                    </div>
                    <div style={{ background: '#181b2a', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #38bdf8' }}>
                        <strong style={{ color: '#38bdf8' }}>Cinturão de Força do Gigante da Colina:</strong> Maravilhoso | Raro (Sintonização).<br />
                        <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>O seu valor de Força torna-se <strong>21 fixo (+5)</strong> enquanto o estiver usando.</span>
                    </div>
                    <div style={{ background: '#181b2a', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #38bdf8' }}>
                        <strong style={{ color: '#38bdf8' }}>Manto do Deslocamento (Cloak of Displacement):</strong> Maravilhoso | Raro (Sintonização).<br />
                        <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Projeta ilusão deslocada do portador. <strong>Qualquer criatura tem Desvantagem nas jogadas de ataque contra você</strong> até você sofrer dano (reativa no início do seu próximo turno).</span>
                    </div>
                    <div style={{ background: '#181b2a', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #38bdf8' }}>
                        <strong style={{ color: '#38bdf8' }}>Varinha de Bolas de Fogo (Wand of Fireballs):</strong> Varinha | Raro (Sintonização por Conjurador).<br />
                        <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>7 cargas. Com 1 Ação, conjure <em>Bola de Fogo</em> (CD 15) causando 8d6 de fogo (ou +1d6 por carga adicional gasta).</span>
                    </div>
                </div>

                <h3 style={{ color: '#c5a059', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>Itens Muito Raros (Very Rare - 5.001 a 50.000 PO)</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
                    <div style={{ background: '#181b2a', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #a855f7' }}>
                        <strong style={{ color: '#a855f7' }}>Arma +3 (Qualquer Arma):</strong> Arma | Muito Raro.<br />
                        <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Concede bônus colossal de <strong>+3 nas jogadas de ataque e dano</strong>.</span>
                    </div>
                    <div style={{ background: '#181b2a', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #a855f7' }}>
                        <strong style={{ color: '#a855f7' }}>Espada Congelante (Frost Brand):</strong> Arma | Muito Raro (Sintonização).<br />
                        <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Causa <strong>+1d6 de dano de frio extra</strong>, concede <strong>Resistência a dano de fogo</strong> e extingue chamas a até 9 metros.</span>
                    </div>
                    <div style={{ background: '#181b2a', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #a855f7' }}>
                        <strong style={{ color: '#a855f7' }}>Veste do Arquimago (Robe of the Archmagi):</strong> Maravilhoso | Muito Raro (Sintonização por Feiticeiro, Bruxo ou Mago).<br />
                        <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Sua CA base torna-se <strong>15 + mod de Destreza</strong>, concede <strong>Vantagem em testes de resistência contra magias</strong> e aumenta a CD de suas magias e bônus de ataque mágico em <strong>+2</strong>!</span>
                    </div>
                    <div style={{ background: '#181b2a', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #a855f7' }}>
                        <strong style={{ color: '#a855f7' }}>Cajado do Poder (Staff of Power):</strong> Cajado | Muito Raro (Sintonização por Conjurador).<br />
                        <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Arma mágica +2 que concede <strong>+2 na CA e em salvamentos</strong>. Possui 20 cargas para conjurar <em>Cone de Frio, Muralha de Força, Bola de Fogo, Raio Relâmpago e Globo de Invulnerabilidade</em>.</span>
                    </div>
                </div>
            </div>
        )
    },

    // =========================================================================
    // 4. ITENS LENDÁRIOS & ARTEFATOS (DMG)
    // =========================================================================
    {
        id: 'dmg_magic_items_legendary',
        title: 'Cap. 7: Catálogo: Itens Lendários & Relíquias Arcanas',
        category: 'Itens Mágicos & Relíquias (Cap. 7)',
        content: (
            <div>
                <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '16px' }}>
                    Relíquias de poder quase divino forjadas pelos deuses, arquimagos da antiguidade ou dragões anciões. Sua posse atrai a atenção dos poderes cósmicos.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '12px' }}>
                    <div style={{ background: '#181b2a', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #f59e0b' }}>
                        <strong style={{ color: '#f59e0b' }}>Espada Vorpal (Vorpal Sword):</strong> Arma | Lendário (Sintonização).<br />
                        <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Arma +3 que ignora resistência a dano cortante. <strong>Ao rolar um 20 natural na jogada de ataque, você decepa uma das cabeças da criatura</strong> (matando-a instantaneamente se ela não puder viver sem ela, como a maioria dos humanoides!).</span>
                    </div>
                    <div style={{ background: '#181b2a', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #f59e0b' }}>
                        <strong style={{ color: '#f59e0b' }}>Anel dos Três Desejos (Ring of Three Wishes):</strong> Anel | Lendário.<br />
                        <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Contém 3 cargas. Com 1 Ação, gaste 1 carga para conjurar a magia <strong>Desejo (Wish)</strong>. Quando a última carga for gasta, o anel perde a magia e vira joia não mágica.</span>
                    </div>
                    <div style={{ background: '#181b2a', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #f59e0b' }}>
                        <strong style={{ color: '#f59e0b' }}>Manto de Invisibilidade (Cloak of Invisibility):</strong> Maravilhoso | Lendário (Sintonização).<br />
                        <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Puxe o capuz como ação para se tornar <strong>completamente invisível por até 2 horas cumulativas por dia</strong>. Diferente de magias normais, atacar ou conjurar magias NÃO encerra a invisibilidade!</span>
                    </div>
                    <div style={{ background: '#181b2a', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #f59e0b' }}>
                        <strong style={{ color: '#f59e0b' }}>Vara da Ressurreição (Rod of Resurrection):</strong> Vara | Lendário (Sintonização por Clérigo, Druida ou Paladino).<br />
                        <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Possui 5 cargas. Pode gastar 1 carga para <em>Curar Ferimentos</em> (5º círculo) ou 5 cargas para conjurar <em>Ressurreição</em> e trazer mortos há séculos à vida!</span>
                    </div>
                    <div style={{ background: '#181b2a', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #f59e0b' }}>
                        <strong style={{ color: '#f59e0b' }}>Martelo do Trovão (Hammer of Thunderbolts):</strong> Arma | Lendário (Sintonização).<br />
                        <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Arma mágica +1 (ou +5 se usado com Manoplas do Ogro e Cinto de Gigante!). Aumenta seu valor de Força em +4 (podendo superar 20 até o máximo de 30) e pode ser arremessado para liberar trovoada ensurdecedora que atordoa inimigos!</span>
                    </div>
                </div>
            </div>
        )
    }
];
