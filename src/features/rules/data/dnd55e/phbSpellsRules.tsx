import type { RuleSection } from '../../RulebookViewer';

export const DND55E_SPELLS_SECTIONS: RuleSection[] = [
    // =========================================================================
    // 1. REGRAS GERAIS DE CONJURAÇÃO (PHB OFICIAL)
    // =========================================================================
    {
        id: 'phb_spellcasting_rules_complete',
        title: 'Cap. 7: Regras Oficiais de Magia & Conjuração',
        category: 'Regras de Magia & Grimório (Cap. 7)',
        content: (
            <div>
                <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '16px' }}>
                    Magia é a força fundamental que molda o multiverso de Dungeons & Dragons. Seja através do estudo arcano rigoroso dos Magos, da devoção piedosa dos Clérigos ou do sangue dracônico dos Feiticeiros, conjurar magias segue regras estritas de economia de ações e componentes.
                </p>

                <div style={{ background: 'rgba(192, 132, 252, 0.08)', border: '1px solid #c084fc', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
                    <h3 style={{ color: '#c084fc', margin: '0 0 10px 0' }}>Os Três Componentes de Conjuração (V, S, M)</h3>
                    <ul style={{ margin: 0, paddingLeft: '20px', color: '#e9d5ff', lineHeight: '1.7' }}>
                        <li><strong>Verbal (V):</strong> Pronunciamento claro de palavras arcanas ou cânticos divinos. Um conjurador amordaçado ou sob efeito da magia <em>Silêncio</em> não pode conjurar magias com componente V.</li>
                        <li><strong>Somático (S):</strong> Gesto manual vigoroso e preciso. O conjurador deve ter pelo menos uma das mãos livres para gesticular.</li>
                        <li><strong>Material (M):</strong> Objetos físicos específicos. Podem ser substituídos por uma <strong>Bolsa de Componentes</strong> ou um <strong>Foco de Conjuração</strong> (Varinha, Cajado, Símbolo Sagrado), a menos que o componente tenha um <strong>custo específico em PO</strong> listado na magia (ex: diamante de 300 PO para <em>Revivificar</em>), o qual deve ser fornecido e é consumido conforme o texto da magia.</li>
                    </ul>
                </div>

                <h3 style={{ color: '#c5a059', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>Regras Críticas de Concentração</h3>
                <div style={{ background: '#1c1926', padding: '14px', borderRadius: '8px', marginBottom: '20px', borderLeft: '4px solid #e11d48' }}>
                    <p style={{ margin: '0 0 8px 0', color: '#fda4af', fontWeight: 'bold' }}>
                        Regra de Concentração em D&D:
                    </p>
                    <ul style={{ margin: 0, paddingLeft: '20px', color: '#cbd5e1', lineHeight: '1.6' }}>
                        <li>Você só pode manter concentração em <strong>uma única magia por vez</strong>. Se conjurar outra magia que exige concentração, a magia anterior encerra-se instantaneamente.</li>
                        <li><strong>Dano Sofrido:</strong> Sempre que você sofrer dano enquanto se concentra, você deve fazer imediatamente um <strong>Teste de Resistência de Constituição</strong>. A CD é igual a <strong>10 ou metade do dano sofrido</strong> (o que for maior). Se falhar, sua concentração é rompida e a magia acaba.</li>
                        <li><strong>Incapacitado ou Morto:</strong> Ficar sob as condições Incapacitado, Inconsciente ou Paralisado rompe a concentração na hora.</li>
                    </ul>
                </div>

                <h3 style={{ color: '#c5a059', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>Magias de Ação Bônus & Limite de Conjuração</h3>
                <p style={{ color: '#cbd5e1', lineHeight: '1.6' }}>
                    Se você conjurar uma magia com tempo de <strong>Ação Bônus</strong> (como <em>Passo Nebuloso</em> ou <em>Palavra Sagrada</em>), você não pode conjurar outra magia no mesmo turno usando sua Ação, <strong>exceto se for um Truque (Cantrip)</strong> com tempo de conjuração de 1 Ação.
                </p>

                <h3 style={{ color: '#c5a059', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>Áreas de Efeito (Shapes)</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
                    <div style={{ background: '#181b2a', padding: '10px', borderRadius: '6px' }}>
                        <strong style={{ color: '#38bdf8' }}>Cone:</strong> Expande-se a partir do conjurador; a largura na extremidade é igual ao comprimento.
                    </div>
                    <div style={{ background: '#181b2a', padding: '10px', borderRadius: '6px' }}>
                        <strong style={{ color: '#38bdf8' }}>Cubo:</strong> Você escolhe a origem em qualquer face externa ou centro do cubo.
                    </div>
                    <div style={{ background: '#181b2a', padding: '10px', borderRadius: '6px' }}>
                        <strong style={{ color: '#38bdf8' }}>Cilindro:</strong> Ponto central no chão que se projeta em raio e sobe até a altura definida.
                    </div>
                    <div style={{ background: '#181b2a', padding: '10px', borderRadius: '6px' }}>
                        <strong style={{ color: '#38bdf8' }}>Esfera:</strong> Expande-se em todas as direções a partir de um ponto de origem.
                    </div>
                    <div style={{ background: '#181b2a', padding: '10px', borderRadius: '6px' }}>
                        <strong style={{ color: '#38bdf8' }}>Linha:</strong> Estende-se do conjurador em linha reta com largura padrão de 1,5m.
                    </div>
                </div>
            </div>
        )
    },

    // =========================================================================
    // 2. GRIMÓRIO CANÔNICO DE MAGIAS ICÔNICAS (PHB OFICIAL)
    // =========================================================================
    {
        id: 'phb_grimoire_iconic_spells',
        title: 'Cap. 7: Grimório Canônico de Magias por Círculo',
        category: 'Regras de Magia & Grimório (Cap. 7)',
        content: (
            <div>
                <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '16px' }}>
                    Compilado oficial das magias mais utilizadas e emblemáticas de Dungeons & Dragons, detalhando parâmetros mecânicos, componentes e descrições de efeito.
                </p>

                {/* TRUQUES (CANTRIPS) */}
                <h3 style={{ color: '#c5a059', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>Truques (Nível 0 - Custo Zero de Espaço)</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '12px', marginBottom: '24px' }}>
                    <div style={{ background: '#181b2a', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #c084fc' }}>
                        <strong style={{ color: '#c084fc' }}>Rajada Mística (Eldritch Blast):</strong> Evocação | 1 Ação | 36m | V, S | Instantâneo.<br />
                        <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Dispara um raio de energia crepitante. Ataque mágico à distância que causa 1d10 de dano de força. No 5º, 11º e 17º níveis, cria raios adicionais.</span>
                    </div>
                    <div style={{ background: '#181b2a', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #c084fc' }}>
                        <strong style={{ color: '#c084fc' }}>Raio de Fogo (Fire Bolt):</strong> Evocação | 1 Ação | 36m | V, S | Instantâneo.<br />
                        <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Ataque mágico que causa 1d10 de dano de fogo e incendeia objetos inflamáveis desacompanhados. Escala para 2d10 (5º), 3d10 (11º), 4d10 (17º).</span>
                    </div>
                    <div style={{ background: '#181b2a', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #c084fc' }}>
                        <strong style={{ color: '#c084fc' }}>Mão de Mago (Mage Hand):</strong> Transmutação | 1 Ação | 9m | V, S | 1 minuto.<br />
                        <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Cria mão espectral fantasmagórica que manipula objetos, abre portas destrancadas e carrega até 5 kg.</span>
                    </div>
                    <div style={{ background: '#181b2a', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #c084fc' }}>
                        <strong style={{ color: '#c084fc' }}>Orientação (Guidance):</strong> Adivinhação | 1 Ação Bônus / Reação | Toque | V, S | Concentração, até 1 min.<br />
                        <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>O alvo abençoado adiciona 1d4 a um teste de atributo à sua escolha antes ou após rolar o d20.</span>
                    </div>
                    <div style={{ background: '#181b2a', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #c084fc' }}>
                        <strong style={{ color: '#c084fc' }}>Chama Sagrada (Sacred Flame):</strong> Evocação | 1 Ação | 18m | V, S | Instantâneo.<br />
                        <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Radiação divina desce sobre o alvo. O inimigo deve passar em salvaguarda de Destreza ou sofrer 1d8 de dano radiante (ignora cobertura).</span>
                    </div>
                    <div style={{ background: '#181b2a', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #c084fc' }}>
                        <strong style={{ color: '#c084fc' }}>Prestidigitação (Prestidigitation):</strong> Transmutação | 1 Ação | 3m | V, S | Até 1 hora.<br />
                        <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Pequenos truques mágicos: acende tochas, limpa ou suja roupas, aquece/esfria alimentos e cria aromas e marcas.</span>
                    </div>
                </div>

                {/* 1º CÍRCULO */}
                <h3 style={{ color: '#c5a059', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>1º Círculo de Magia</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '12px', marginBottom: '24px' }}>
                    <div style={{ background: '#181b2a', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #38bdf8' }}>
                        <strong style={{ color: '#38bdf8' }}>Mísseis Mágicos (Magic Missile):</strong> Evocação | 1 Ação | 36m | V, S | Instantâneo.<br />
                        <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Cria 3 dardos de força teleguiados. Cada dardo atinge infalivelmente o alvo causando <strong>1d4 + 1 de dano de força</strong> sem teste de ataque ou salvaguarda!</span>
                    </div>
                    <div style={{ background: '#181b2a', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #38bdf8' }}>
                        <strong style={{ color: '#38bdf8' }}>Escudo Arcano (Shield):</strong> Abjuração | 1 Reação | Pessoal | V, S | 1 rodada.<br />
                        <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Conjurado quando você for atingido por um ataque ou alvejado por <em>Mísseis Mágicos</em>. Concede <strong>+5 na CA</strong> até o início do seu próximo turno e anula completamente mísseis mágicos.</span>
                    </div>
                    <div style={{ background: '#181b2a', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #38bdf8' }}>
                        <strong style={{ color: '#38bdf8' }}>Curar Ferimentos (Cure Wounds):</strong> Abjuração / Evocação | 1 Ação | Toque | V, S | Instantâneo.<br />
                        <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Toca uma criatura restaurando <strong>2d8 + mod de conjuração</strong> em PV (2024 dobrou a base para 2d8!). Em círculos superiores soma +2d8 por nível.</span>
                    </div>
                    <div style={{ background: '#181b2a', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #38bdf8' }}>
                        <strong style={{ color: '#38bdf8' }}>Palavra Sagrada (Healing Word):</strong> Evocação | 1 Ação Bônus | 18m | V | Instantâneo.<br />
                        <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Cura à distância com ação bônus: restaura <strong>2d4 + mod de conjuração</strong> em PV a uma criatura visível a até 18m.</span>
                    </div>
                    <div style={{ background: '#181b2a', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #38bdf8' }}>
                        <strong style={{ color: '#38bdf8' }}>Armadura Arcana (Mage Armor):</strong> Abjuração | 1 Ação | Toque | V, S, M | 8 horas.<br />
                        <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Toca uma criatura voluntária sem armadura. Sua CA base torna-se <strong>13 + mod de Destreza</strong>. Dura 8 horas sem exigir concentração!</span>
                    </div>
                    <div style={{ background: '#181b2a', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #38bdf8' }}>
                        <strong style={{ color: '#38bdf8' }}>Bênção (Bless):</strong> Encantamento | 1 Ação | 9m | V, S, M | Concentração, até 1 min.<br />
                        <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Abençoa até 3 criaturas. Sempre que um alvo fizer um ataque ou teste de resistência, ele joga <strong>1d4 extra</strong> e soma ao resultado.</span>
                    </div>
                </div>

                {/* 2º E 3º CÍRCULOS */}
                <h3 style={{ color: '#c5a059', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>2º e 3º Círculos de Magia</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '12px', marginBottom: '24px' }}>
                    <div style={{ background: '#181b2a', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #f59e0b' }}>
                        <strong style={{ color: '#f59e0b' }}>Passo Nebuloso (Misty Step - 2º):</strong> Conjuração | 1 Ação Bônus | Pessoal | V | Instantâneo.<br />
                        <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Teletransporta-se instantaneamente até 9 metros para um espaço desocupado que você possa ver sem provocar ataques de oportunidade.</span>
                    </div>
                    <div style={{ background: '#181b2a', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #f59e0b' }}>
                        <strong style={{ color: '#f59e0b' }}>Invisibilidade (Invisibility - 2º):</strong> Ilusão | 1 Ação | Toque | V, S, M | Concentração, até 1 hora.<br />
                        <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Toca uma criatura tornando-a invisível. Encerra-se precocemente se o alvo atacar ou conjurar uma magia.</span>
                    </div>
                    <div style={{ background: '#181b2a', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #f59e0b' }}>
                        <strong style={{ color: '#f59e0b' }}>Bola de Fogo (Fireball - 3º):</strong> Evocação | 1 Ação | 45m | V, S, M | Instantâneo.<br />
                        <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Explosão devastadora em esfera de 6m de raio. Cada criatura na área deve fazer salvaguarda de Destreza, sofrendo <strong>8d6 de dano de fogo</strong> (metade se passar).</span>
                    </div>
                    <div style={{ background: '#181b2a', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #f59e0b' }}>
                        <strong style={{ color: '#f59e0b' }}>Contramágica (Counterspell - 3º):</strong> Abjuração | 1 Reação | 18m | S | Instantâneo.<br />
                        <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Tentativa de anular uma magia inimiga conjurada a até 18m. Anula automaticamente magias de 3º nível ou menor; para níveis superiores, exige teste de atributo de conjuração (CD 10 + nível da magia).</span>
                    </div>
                    <div style={{ background: '#181b2a', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #f59e0b' }}>
                        <strong style={{ color: '#f59e0b' }}>Revivificar (Revivify - 3º):</strong> Necromancia | 1 Ação | Toque | V, S, M (Diamante de 300 PO consumido) | Instantâneo.<br />
                        <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Toca uma criatura que tenha morrido no último minuto, trazendo-a de volta à vida com 1 Ponto de Vida.</span>
                    </div>
                    <div style={{ background: '#181b2a', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #f59e0b' }}>
                        <strong style={{ color: '#f59e0b' }}>Espíritos Guardiões (Spirit Guardians - 3º):</strong> Conjuração | 1 Ação | Pessoal (raio de 4,5m) | V, S, M | Concentração, até 10 min.<br />
                        <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Espíritos celestiais ou abissais giram ao redor do conjurador. Inimigos têm deslocamento reduzido pela metade e sofrem 3d8 de dano radiante/necrótico ao entrar ou iniciar o turno na área.</span>
                    </div>
                </div>

                {/* 4º AO 9º CÍRCULO */}
                <h3 style={{ color: '#c5a059', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>Magias de Alto Nível (4º ao 9º Círculo)</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '12px' }}>
                    <div style={{ background: '#181b2a', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #ef4444' }}>
                        <strong style={{ color: '#ef4444' }}>Polimorfia (Polymorph - 4º):</strong> Transmutação | 1 Ação | 18m | V, S, M | Concentração, até 1 hora.<br />
                        <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Transforma uma criatura voluntária ou inimiga (salvaguarda de Sabedoria) em uma besta com ND igual ou menor que o nível do alvo (ex: Tiranossauro Rex!).</span>
                    </div>
                    <div style={{ background: '#181b2a', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #ef4444' }}>
                        <strong style={{ color: '#ef4444' }}>Muralha de Força (Wall of Force - 5º):</strong> Evocação | 1 Ação | 36m | V, S, M | Concentração, até 10 min.<br />
                        <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Cria barreira invisível e indestrutível. Nada físico ou mágico pode atravessá-la, exceto através do plano etéreo ou <em>Desintegrar</em>.</span>
                    </div>
                    <div style={{ background: '#181b2a', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #ef4444' }}>
                        <strong style={{ color: '#ef4444' }}>Desintegrar (Disintegrate - 6º):</strong> Transmutação | 1 Ação | 18m | V, S, M | Instantâneo.<br />
                        <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Raio verde fino que causa <strong>10d6 + 40 de dano de força</strong> em falha de Destreza. Se reduzir o alvo a 0 PV, ele é transformado em cinzas finas.</span>
                    </div>
                    <div style={{ background: '#181b2a', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #ef4444' }}>
                        <strong style={{ color: '#ef4444' }}>Desejo (Wish - 9º):</strong> Conjuração | 1 Ação | Pessoal | V | Instantâneo.<br />
                        <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>A magia suprema de um mortal. Pode duplicar qualquer outra magia de 8º nível ou menor sem custo ou requisitos, ou alterar o tecido da própria realidade a critério do Mestre.</span>
                    </div>
                </div>
            </div>
        )
    }
];
