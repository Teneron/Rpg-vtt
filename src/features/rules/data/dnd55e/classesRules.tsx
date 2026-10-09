import type { RuleSection } from '../../RulebookViewer';

export const DND55E_CLASSES_SECTIONS: RuleSection[] = [
    // 1. BÁRBARO
    {
        id: 'phb_class_barbarian',
        title: 'Bárbaro (Barbarian)',
        category: 'Classes de D&D (Cap. 3)',
        content: (
            <div>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <img
                        src="/assets/classes/barbarian.jpeg"
                        alt="Bárbaro Oficial D&D 5.5e"
                        style={{ maxWidth: '100%', maxHeight: '440px', borderRadius: '8px', border: '1px solid #e11d48', objectFit: 'contain', boxShadow: '0 8px 24px rgba(0,0,0,0.6)' }}
                    />
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '8px' }}>
                        <em>Um combatente feroz movido pela Fúria Primitiva, vitalidade descomunal e golpes devastadores.</em>
                    </p>
                </div>

                <div style={{ background: 'rgba(225, 29, 72, 0.08)', border: '1px solid #e11d48', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
                    <h3 style={{ color: '#f43f5e', margin: '0 0 8px 0' }}>Ficha Técnica da Classe</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px', fontSize: '0.88rem' }}>
                        <div><strong>Dado de Vida:</strong> d12 por nível de bárbaro</div>
                        <div><strong>Atributo Primário:</strong> Força</div>
                        <div><strong>Salvaguardas:</strong> Força, Constituição</div>
                        <div><strong>Armaduras:</strong> Leves, Médias, Escudos</div>
                        <div><strong>Armas:</strong> Simples, Marciais</div>
                        <div><strong>Maestrias de Arma:</strong> 2 armas à sua escolha</div>
                    </div>
                </div>

                <h3 style={{ color: '#c5a059', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>Habilidades Fundamentais (Níveis 1 a 5)</h3>
                <ul style={{ lineHeight: '1.8' }}>
                    <li>
                        <strong>Fúria (Rage - 10 Minutos de Duração no 2024):</strong> Como Ação Bônus, você entra em um transe de batalha selvagem. Enquanto furioso e sem armadura pesada:
                        <br />&bull; Você tem <strong>Vantagem em testes de Força e salvaguardas de Força</strong>.
                        <br />&bull; Ao desferir ataques com Força, adiciona o <strong>Dano de Fúria (+2 no Nv 1, +3 no Nv 9, +4 no Nv 16)</strong> ao dano.
                        <br />&bull; Você possui <strong>Resistência a dano de Concussão, Cortante e Perfurante</strong>.
                        <br />&bull; A fúria dura 10 minutos ou até você ficar Inconsciente. Nas regras de 2024, você pode gastar uma Ação Bônus para estender a fúria se não tiver atacado nem sofrido dano na rodada!
                    </li>
                    <li>
                        <strong>Defesa sem Armadura (Unarmored Defense):</strong> Quando não estiver vestindo armadura, sua CA é igual a <code>10 + mod Destreza + mod Constituição</code>. Você pode empunhar um escudo e ainda manter este benefício.
                    </li>
                    <li>
                        <strong>Maestria de Armas (Weapon Mastery):</strong> Você desbloqueia as propriedades especiais de maestria (como Cleave, Graze ou Topple) de duas armas que você domina.
                    </li>
                    <li>
                        <strong>Ataque Descuidado (Reckless Attack - Nv 2):</strong> Ao fazer o seu primeiro ataque no turno, você pode abandonar a cautela. Você ganha <strong>Vantagem em todas as jogadas de ataque corpo a corpo com Força</strong> durante o turno, mas ataques desferidos contra você têm Vantagem até o início do seu próximo turno.
                    </li>
                    <li>
                        <strong>Sentido de Perigo (Danger Sense - Nv 2):</strong> Você tem Vantagem em salvaguardas de Destreza contra efeitos que você possa ver (como armadilhas e sopros de dragão), a menos que esteja Incapacitado.
                    </li>
                    <li>
                        <strong>Conhecimento Primitivo (Primal Knowledge - Regra Oficial 2024 no Nv 3):</strong> Enquanto sua Fúria estiver ativa, você pode realizar testes de <strong>Acrobacia, Furtividade, Intimidação, Percepção e Sobrevivência utilizando o seu modificador de FORÇA</strong>!
                    </li>
                    <li>
                        <strong>Ataque Extra (Extra Attack - Nv 5):</strong> Você pode atacar duas vezes ao realizar a Ação Atacar.
                    </li>
                    <li>
                        <strong>Movimento Rápido (Fast Movement - Nv 5):</strong> Seu Deslocamento aumenta em +3 metros enquanto você não estiver usando armadura pesada.
                    </li>
                </ul>

                <h3 style={{ color: '#c5a059', borderBottom: '1px solid #334155', paddingBottom: '6px', marginTop: '24px' }}>As 4 Subclasses Oficiais (Nível 3)</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                    <div style={{ background: '#181b2a', border: '1px solid #334155', padding: '12px', borderRadius: '8px' }}>
                        <strong style={{ color: '#f43f5e' }}>1. Trilha do Berserker (Path of the Berserker)</strong>
                        <p style={{ fontSize: '0.85rem', margin: '6px 0', color: '#cbd5e1' }}>
                            &bull; <em>Frenesi (Frenzy 2024):</em> Ao entrar em fúria, desfira dano frenético devastador! Uma vez por turno ao acertar um ataque com Força, cause <strong>+2d6 de dano</strong> do tipo da arma (aumenta para 3d6 no nv 10 e 4d6 no nv 14).
                            <br />&bull; <em>Fúria Desenfreada (Mindless Rage):</em> Você se torna totalmente imune às condições Enfeitiçado e Amedrontado enquanto em fúria.
                        </p>
                    </div>

                    <div style={{ background: '#181b2a', border: '1px solid #334155', padding: '12px', borderRadius: '8px' }}>
                        <strong style={{ color: '#f43f5e' }}>2. Trilha do Coração Selvagem (Path of the Wild Heart)</strong>
                        <p style={{ fontSize: '0.85rem', margin: '6px 0', color: '#cbd5e1' }}>
                            &bull; <em>Espírito Animal (Totêmico 2024):</em> Escolha Urso (Resistência a TODOS os tipos de dano do jogo, exceto Psíquico!), Águia (Disparada e Desengajar com Ação Bônus) ou Lobo (aliados a 1,5m têm Vantagem nos ataques contra seu alvo).
                            <br />&bull; <em>Aspecto da Fera:</em> Ganha sentidos aguçados e natação/escalada primais.
                        </p>
                    </div>

                    <div style={{ background: '#181b2a', border: '1px solid #334155', padding: '12px', borderRadius: '8px' }}>
                        <strong style={{ color: '#f43f5e' }}>3. Trilha da Árvore do Mundo (Path of the World Tree)</strong>
                        <p style={{ fontSize: '0.85rem', margin: '6px 0', color: '#cbd5e1' }}>
                            &bull; <em>Vitalidade de Yggdrasil (Nova Subclasse 2024):</em> Ao entrar em fúria, você e um aliado a até 9m ganham Pontos de Vida Temporários iguais ao seu nível de bárbaro.
                            <br />&bull; <em>Galhos da Árvore Cósmica:</em> Raízes espectrais surgem para puxar inimigos a até 9m para perto de você ou teleportá-lo pelo campo.
                        </p>
                    </div>

                    <div style={{ background: '#181b2a', border: '1px solid #334155', padding: '12px', borderRadius: '8px' }}>
                        <strong style={{ color: '#f43f5e' }}>4. Trilha do Fanático (Path of the Zealot)</strong>
                        <p style={{ fontSize: '0.85rem', margin: '6px 0', color: '#cbd5e1' }}>
                            &bull; <em>Fúria Divina:</em> Seu primeiro ataque de cada turno causa <strong>1d6 + metade do nível de bárbaro</strong> em dano Radiante ou Necrótico extra.
                            <br />&bull; <em>Guerreiro dos Deuses:</em> Magias de reviver lançadas em você não consomem componentes materiais de ouro/diamante!
                        </p>
                    </div>
                </div>
            </div>
        )
    },

    // 2. BARDO
    {
        id: 'phb_class_bard',
        title: 'Bardo (Bard)',
        category: 'Classes de D&D (Cap. 3)',
        content: (
            <div>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <img
                        src="/assets/classes/bard.jpeg"
                        alt="Bardo Oficial D&D 5.5e"
                        style={{ maxWidth: '100%', maxHeight: '440px', borderRadius: '8px', border: '1px solid #e11d48', objectFit: 'contain', boxShadow: '0 8px 24px rgba(0,0,0,0.6)' }}
                    />
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '8px' }}>
                        <em>Mestre do improviso, encanto e magia artística, canalizando as palavras que moldaram a Criação.</em>
                    </p>
                </div>

                <div style={{ background: 'rgba(225, 29, 72, 0.08)', border: '1px solid #e11d48', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
                    <h3 style={{ color: '#f43f5e', margin: '0 0 8px 0' }}>Ficha Técnica da Classe</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px', fontSize: '0.88rem' }}>
                        <div><strong>Dado de Vida:</strong> d8 por nível</div>
                        <div><strong>Atributo Primário:</strong> Carisma</div>
                        <div><strong>Salvaguardas:</strong> Destreza, Carisma</div>
                        <div><strong>Armaduras:</strong> Leves</div>
                        <div><strong>Armas:</strong> Simples</div>
                        <div><strong>Ferramentas:</strong> 3 Instrumentos Musicais</div>
                    </div>
                </div>

                <h3 style={{ color: '#c5a059', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>Habilidades Fundamentais (Níveis 1 a 5)</h3>
                <ul style={{ lineHeight: '1.8' }}>
                    <li>
                        <strong>Conjuração de Bardo (Spellcasting):</strong> Você conjura magias de Bardo utilizando Carisma como atributo de conjuração. Você prepara uma quantidade de magias da lista de Bardo a cada descanso longo.
                    </li>
                    <li>
                        <strong>Inspiração Bárdica (Bardic Inspiration - Duração de 1 HORA no 2024!):</strong> Como Ação Bônus, conceda um Dado de Inspiração (d6 no Nv 1, d8 no Nv 5, d10 no Nv 10, d12 no Nv 15) a um aliado a até 18 metros. <strong>O dado permanece com o aliado por 1 hora completa</strong> (e não apenas 10 minutos como antigamente!). Ele pode somar o dado a uma rolagem de d20 que falhar, ou a rolagens de cura/dano dependendo da subclasse! Usos = mod Carisma (mínimo 1).
                    </li>
                    <li>
                        <strong>Especialista (Expertise - Nv 2 e 9):</strong> Escolha duas das suas proficiências em perícias. O seu bônus de proficiência é **dobrado** em qualquer teste de atributo que use uma dessas perícias!
                    </li>
                    <li>
                        <strong>Canção de Descanso & Fonte de Inspiração (Font of Inspiration - Nv 5):</strong> Você recupera todos os usos gastos de Inspiração Bárdica ao completar um **Descanso Curto** ou Longo!
                    </li>
                </ul>

                <h3 style={{ color: '#c5a059', borderBottom: '1px solid #334155', paddingBottom: '6px', marginTop: '24px' }}>As 4 Subclasses Oficiais (Nível 3)</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                    <div style={{ background: '#181b2a', border: '1px solid #334155', padding: '12px', borderRadius: '8px' }}>
                        <strong style={{ color: '#f43f5e' }}>1. Colégio da Dança (College of Dance - Sensação 2024)</strong>
                        <p style={{ fontSize: '0.85rem', margin: '6px 0', color: '#cbd5e1' }}>
                            &bull; <em>Dança Deslumbrante:</em> Quando não usa armadura nem escudo, sua CA é <code>10 + mod DES + mod CAR</code>!
                            <br />&bull; <em>Golpes Desarmados Ágeis:</em> Seus golpes desarmados usam Destreza e causam dano igual ao seu Dado de Inspiração Bárdica. Ao gastar inspiração, mova-se até metade da velocidade sem provocar ataques de oportunidade!
                        </p>
                    </div>

                    <div style={{ background: '#181b2a', border: '1px solid #334155', padding: '12px', borderRadius: '8px' }}>
                        <strong style={{ color: '#f43f5e' }}>2. Colégio do Saber (College of Lore)</strong>
                        <p style={{ fontSize: '0.85rem', margin: '6px 0', color: '#cbd5e1' }}>
                            &bull; <em>Perícias Extras:</em> Ganha proficiência em 3 perícias à sua escolha.
                            <br />&bull; <em>Palavras Cortantes (Cutting Words):</em> Como Reação a até 18 metros, gasta 1 dado de inspiração para SUBTRAIR o valor da jogada de ataque, teste de perícia ou dano do inimigo!
                            <br />&bull; <em>Segredos Mágicos Extras (Nv 6):</em> Aprende 2 magias de qualquer classe do jogo!
                        </p>
                    </div>

                    <div style={{ background: '#181b2a', border: '1px solid #334155', padding: '12px', borderRadius: '8px' }}>
                        <strong style={{ color: '#f43f5e' }}>3. Colégio da Bravura (College of Valor)</strong>
                        <p style={{ fontSize: '0.85rem', margin: '6px 0', color: '#cbd5e1' }}>
                            &bull; <em>Proficiências Marciais:</em> Armaduras Médias, Escudos e Armas Marciais.
                            <br />&bull; <em>Inspiração em Combate:</em> Aliados inspirados podem somar o dado de inspiração diretamente à sua Classe de Armadura ou ao dano de suas armas.
                            <br />&bull; <em>Ataque Extra (Nv 6):</em> Pode substituir um ataque pela conjuração de um truque de bardo!
                        </p>
                    </div>

                    <div style={{ background: '#181b2a', border: '1px solid #334155', padding: '12px', borderRadius: '8px' }}>
                        <strong style={{ color: '#f43f5e' }}>4. Colégio do Glamour (College of Glamour)</strong>
                        <p style={{ fontSize: '0.85rem', margin: '6px 0', color: '#cbd5e1' }}>
                            &bull; <em>Manto de Inspiração:</em> Como Ação Bônus, concede PV Temporários (2x o dado) a até 5 aliados que podem se mover imediatamente sem provocar ataques de oportunidade.
                            <br />&bull; <em>Presença Enfeitiçante:</em> Conjura a magia <em>Comando (Command)</em> como Ação Bônus sem gastar espaços de magia!
                        </p>
                    </div>
                </div>
            </div>
        )
    },

    // 3. BRUXO
    {
        id: 'phb_class_warlock',
        title: 'Bruxo (Warlock)',
        category: 'Classes de D&D (Cap. 3)',
        content: (
            <div>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <img
                        src="/assets/classes/warlock.jpeg"
                        alt="Bruxo Oficial D&D 5.5e"
                        style={{ maxWidth: '100%', maxHeight: '440px', borderRadius: '8px', border: '1px solid #e11d48', objectFit: 'contain', boxShadow: '0 8px 24px rgba(0,0,0,0.6)' }}
                    />
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '8px' }}>
                        <em>Pactuante com entidades arcanas ancestrais, empunhando invocações místicas desde o 1º nível e pactos profundos.</em>
                    </p>
                </div>

                <div style={{ background: 'rgba(225, 29, 72, 0.08)', border: '1px solid #e11d48', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
                    <h3 style={{ color: '#f43f5e', margin: '0 0 8px 0' }}>Ficha Técnica da Classe</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px', fontSize: '0.88rem' }}>
                        <div><strong>Dado de Vida:</strong> d8 por nível</div>
                        <div><strong>Atributo Primário:</strong> Carisma</div>
                        <div><strong>Salvaguardas:</strong> Sabedoria, Carisma</div>
                        <div><strong>Armaduras:</strong> Leves</div>
                        <div><strong>Armas:</strong> Simples</div>
                        <div><strong>Magia:</strong> Magia de Pacto (Recupera em Descanso Curto)</div>
                    </div>
                </div>

                <h3 style={{ color: '#c5a059', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>Habilidades Fundamentais (Níveis 1 a 5)</h3>
                <ul style={{ lineHeight: '1.8' }}>
                    <li>
                        <strong>Magia de Pacto (Pact Magic):</strong> Seus espaços de magia são sempre lançados no <strong>nível máximo disponível</strong> e são totalmente recarregados ao concluir um **Descanso Curto** (ou Descanso Longo).
                    </li>
                    <li>
                        <strong>Invocações Místicas desde o 1º Nível (Eldritch Invocations - Oficial 2024):</strong> Você recebe 1 invocação mística no 1º nível, 2 no nível 2 e escala até 10 invocações no nível 20!
                    </li>
                    <li>
                        <strong>Os Grandes Pactos são Invocações de 1º Nível:</strong>
                        <ul style={{ marginTop: '6px', paddingLeft: '20px' }}>
                            <li><strong>Pacto da Lâmina (Pact of the Blade):</strong> Como Ação Bônus, conjura uma arma mágica de pacto. Você utiliza o seu modificador de <strong>CARISMA em vez de Força ou Destreza</strong> nas jogadas de ataque e dano, e pode fazer o dano ser de <strong>Força (Force damage)</strong>!</li>
                            <li><strong>Pacto do Tomo (Pact of the Tome):</strong> Recebe o Livro das Sombras com 3 truques e 2 rituais de 1º nível de qualquer lista de classes à sua escolha.</li>
                            <li><strong>Pacto da Corrente (Pact of the Chain):</strong> Conjura um familiar sobrenatural (Diabrete, Quasit, Pseudodragão, Esfingezinha ou Rato Esquelético) com ataque aprimorado.</li>
                        </ul>
                    </li>
                    <li>
                        <strong>Astúcia Mágica (Magical Cunning - Nv 2 Oficial 2024):</strong> Uma vez por Descanso Longo, você pode realizar um ritual de 1 minuto para recuperar imediatamente metade dos seus espaços de magia de pacto!
                    </li>
                </ul>

                <h3 style={{ color: '#c5a059', borderBottom: '1px solid #334155', paddingBottom: '6px', marginTop: '24px' }}>As 4 Subclasses Oficiais (Nível 3)</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                    <div style={{ background: '#181b2a', border: '1px solid #334155', padding: '12px', borderRadius: '8px' }}>
                        <strong style={{ color: '#f43f5e' }}>1. Patrono Corruptor (Fiend Patron)</strong>
                        <p style={{ fontSize: '0.85rem', margin: '6px 0', color: '#cbd5e1' }}>
                            &bull; <em>Bênção do Obscuro:</em> Ao reduzir um inimigo a 0 PV, você ganha Pontos de Vida Temporários iguais a <code>mod Carisma + nível de bruxo</code>.
                            <br />&bull; <em>Sorte do Obscuro (Nv 6):</em> Soma +1d10 em uma salvaguarda ou teste de perícia à sua escolha por descanso curto!
                        </p>
                    </div>

                    <div style={{ background: '#181b2a', border: '1px solid #334155', padding: '12px', borderRadius: '8px' }}>
                        <strong style={{ color: '#f43f5e' }}>2. Patrono Arquifada (Archfey Patron)</strong>
                        <p style={{ fontSize: '0.85rem', margin: '6px 0', color: '#cbd5e1' }}>
                            &bull; <em>Passos Feéricos:</em> Conjura <em>Passo Nebuloso (Misty Step)</em> PB vezes por descanso longo sem gastar slots. Cada teleporte pode ativar: Evasão Invisível, Pavor Feérico (medo na chegada) ou Provocação sedutora.
                        </p>
                    </div>

                    <div style={{ background: '#181b2a', border: '1px solid #334155', padding: '12px', borderRadius: '8px' }}>
                        <strong style={{ color: '#f43f5e' }}>3. Patrono Grande Antigo (Great Old One Patron)</strong>
                        <p style={{ fontSize: '0.85rem', margin: '6px 0', color: '#cbd5e1' }}>
                            &bull; <em>Mente Desperta:</em> Telepatia em mão dupla a até 9 metros com qualquer criatura que compreenda um idioma.
                            <br />&bull; <em>Feitiçaria Psíquica:</em> Suas magias de encantamento e ilusão não exigem componentes verbais e causam dano psíquico estarrecedor.
                        </p>
                    </div>

                    <div style={{ background: '#181b2a', border: '1px solid #334155', padding: '12px', borderRadius: '8px' }}>
                        <strong style={{ color: '#f43f5e' }}>4. Patrono Celestial (Celestial Patron)</strong>
                        <p style={{ fontSize: '0.85rem', margin: '6px 0', color: '#cbd5e1' }}>
                            &bull; <em>Luz Curativa:</em> Reserva de dados d6 (1 + nível de bruxo). Como Ação Bônus a até 18m, gaste dados da reserva para curar aliados instantaneamente!
                            <br />&bull; <em>Magias Sagradas:</em> Aprende <em>Cura</em>, <em>Fogo Sagrado</em> e <em>Restauração Menor</em>.
                        </p>
                    </div>
                </div>
            </div>
        )
    },

    // 4. CLÉRIGO
    {
        id: 'phb_class_cleric',
        title: 'Clérigo (Cleric)',
        category: 'Classes de D&D (Cap. 3)',
        content: (
            <div>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <img
                        src="/assets/classes/cleric.jpeg"
                        alt="Clérigo Oficial D&D 5.5e"
                        style={{ maxWidth: '100%', maxHeight: '440px', borderRadius: '8px', border: '1px solid #e11d48', objectFit: 'contain', boxShadow: '0 8px 24px rgba(0,0,0,0.6)' }}
                    />
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '8px' }}>
                        <em>Campeão sacerdotal investido com a chama e milagres das divindades maiores do multiverso.</em>
                    </p>
                </div>

                <div style={{ background: 'rgba(225, 29, 72, 0.08)', border: '1px solid #e11d48', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
                    <h3 style={{ color: '#f43f5e', margin: '0 0 8px 0' }}>Ficha Técnica da Classe</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px', fontSize: '0.88rem' }}>
                        <div><strong>Dado de Vida:</strong> d8 por nível</div>
                        <div><strong>Atributo Primário:</strong> Sabedoria</div>
                        <div><strong>Salvaguardas:</strong> Sabedoria, Carisma</div>
                        <div><strong>Armaduras:</strong> Leves, Médias, Escudos (+ Pesadas com Protetor)</div>
                        <div><strong>Armas:</strong> Simples (+ Marciais com Protetor)</div>
                    </div>
                </div>

                <h3 style={{ color: '#c5a059', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>Habilidades Fundamentais (Níveis 1 a 5)</h3>
                <ul style={{ lineHeight: '1.8' }}>
                    <li>
                        <strong>Ordem Divina (Divine Order - Nível 1):</strong> Escolha na criação o seu caminho sacerdotal:
                        <ul style={{ marginTop: '6px', paddingLeft: '20px' }}>
                            <li><strong>Protetor (Protector):</strong> Você ganha proficiência com <strong>Armaduras Pesadas</strong> e com <strong>Armas Marciais</strong>!</li>
                            <li><strong>Taumaturgo (Thaumaturge):</strong> Você aprende 1 truque extra de clérigo e soma seu modificador de <strong>Sabedoria em testes de Arcanismo e Religião</strong>.</li>
                        </ul>
                    </li>
                    <li>
                        <strong>Canalizar Divindade (Channel Divinity - Nv 2):</strong> 2 usos recarregados em descanso curto ou longo:
                        <ul style={{ marginTop: '6px', paddingLeft: '20px' }}>
                            <li><strong>Centelha Divina (Divine Spark):</strong> Como ação Usar Magia a até 9m, cura `1d8 + mod SAB` em PV de um aliado OU causa `1d8 + mod SAB` de dano Radiante ou Necrótico a um inimigo (salva de CON para metade). Escala para 2d8 no Nv 7, 3d8 no Nv 13 e 4d8 no Nv 18!</li>
                            <li><strong>Expulsar Mortos-Vivos (Turn Undead):</strong> Força mortos-vivos em até 9m a fugir aterrorizados se falharem na salvaguarda de Sabedoria.</li>
                        </ul>
                    </li>
                    <li>
                        <strong>Golpe Abençoado ou Conjuração Potente (Nv 7):</strong> Causa +1d8 de dano radiante nos ataques ou adiciona Sabedoria ao dano dos seus truques.
                    </li>
                </ul>

                <h3 style={{ color: '#c5a059', borderBottom: '1px solid #334155', paddingBottom: '6px', marginTop: '24px' }}>As 4 Subclasses Oficiais (Nível 3)</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                    <div style={{ background: '#181b2a', border: '1px solid #334155', padding: '12px', borderRadius: '8px' }}>
                        <strong style={{ color: '#f43f5e' }}>1. Domínio da Vida (Life Domain)</strong>
                        <p style={{ fontSize: '0.85rem', margin: '6px 0', color: '#cbd5e1' }}>
                            &bull; <em>Discípulo da Vida:</em> Suas magias de cura restauram <code>2 + nível da magia</code> em PVs extras.
                            <br />&bull; <em>Preservar a Vida:</em> Cura em massa que restaura até 5x o nível de clérigo divididos entre aliados abaixo de 50% de PV.
                        </p>
                    </div>

                    <div style={{ background: '#181b2a', border: '1px solid #334155', padding: '12px', borderRadius: '8px' }}>
                        <strong style={{ color: '#f43f5e' }}>2. Domínio da Luz (Light Domain)</strong>
                        <p style={{ fontSize: '0.85rem', margin: '6px 0', color: '#cbd5e1' }}>
                            &bull; <em>Clarão Protetor:</em> Reação para impor Desvantagem no ataque de quem atacar você ou um aliado a até 9m.
                            <br />&bull; <em>Radiância do Amanhecer:</em> Dissipa trevas mágicas e causa 2d10 + nível em dano Radiante em raio de 9 metros!
                        </p>
                    </div>

                    <div style={{ background: '#181b2a', border: '1px solid #334155', padding: '12px', borderRadius: '8px' }}>
                        <strong style={{ color: '#f43f5e' }}>3. Domínio da Guerra (War Domain)</strong>
                        <p style={{ fontSize: '0.85rem', margin: '6px 0', color: '#cbd5e1' }}>
                            &bull; <em>Sacerdote de Guerra:</em> Desfere um ataque corpo a corpo extra como Ação Bônus PB vezes por descanso longo.
                            <br />&bull; <em>Golpe Guiado:</em> Soma +10 na jogada de ataque usando Canalizar Divindade após errar o golpe!
                        </p>
                    </div>

                    <div style={{ background: '#181b2a', border: '1px solid #334155', padding: '12px', borderRadius: '8px' }}>
                        <strong style={{ color: '#f43f5e' }}>4. Domínio da Trapaça (Trickery Domain)</strong>
                        <p style={{ fontSize: '0.85rem', margin: '6px 0', color: '#cbd5e1' }}>
                            &bull; <em>Bênção do Trapaceiro:</em> Concede Vantagem contínua em Furtividade a um aliado.
                            <br />&bull; <em>Invocar Duplicidade:</em> Cria uma cópia ilusória perfeita que você usa para conjurar magias e ganhar vantagem no combate.
                        </p>
                    </div>
                </div>
            </div>
        )
    },

    // 5. DRUIDA
    {
        id: 'phb_class_druid',
        title: 'Druida (Druid)',
        category: 'Classes de D&D (Cap. 3)',
        content: (
            <div>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <img
                        src="/assets/classes/druid.jpeg"
                        alt="Druida Oficial D&D 5.5e"
                        style={{ maxWidth: '100%', maxHeight: '440px', borderRadius: '8px', border: '1px solid #e11d48', objectFit: 'contain', boxShadow: '0 8px 24px rgba(0,0,0,0.6)' }}
                    />
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '8px' }}>
                        <em>Guardião dos segredos primordiais da terra, tempestades e metamorfoses de feras selvagens.</em>
                    </p>
                </div>

                <div style={{ background: 'rgba(225, 29, 72, 0.08)', border: '1px solid #e11d48', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
                    <h3 style={{ color: '#f43f5e', margin: '0 0 8px 0' }}>Ficha Técnica da Classe</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px', fontSize: '0.88rem' }}>
                        <div><strong>Dado de Vida:</strong> d8 por nível</div>
                        <div><strong>Atributo Primário:</strong> Sabedoria</div>
                        <div><strong>Salvaguardas:</strong> Inteligência, Sabedoria</div>
                        <div><strong>Armaduras:</strong> Leves, Médias, Escudos (sem tabu de metal!)</div>
                        <div><strong>Armas:</strong> Simples (+ Marciais com Protetor)</div>
                    </div>
                </div>

                <h3 style={{ color: '#c5a059', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>Habilidades Fundamentais (Níveis 1 a 5)</h3>
                <ul style={{ lineHeight: '1.8' }}>
                    <li>
                        <strong>Ordem Primitiva (Primal Order - Nv 1):</strong> Escolha Mago (1 truque extra + soma Sabedoria em Natureza) ou Protetor (Armaduras Médias e Armas Marciais).
                    </li>
                    <li>
                        <strong>Forma Selvagem como Ação Bônus Nativa (Wild Shape 2024):</strong> Você se transforma em uma besta como uma **Ação Bônus**! Você ganha **Pontos de Vida Temporários iguais ao seu nível de Druida**, mantendo seus PV reais e estatísticas mentais intactos, e usando a velocidade, sentidos e ataques da fera.
                    </li>
                    <li>
                        <strong>Companheiro Selvagem (Wild Companion):</strong> Conjura a magia <em>Encontrar Familiar</em> gastando 1 uso de Forma Selvagem sem gastar componentes materiais.
                    </li>
                </ul>

                <h3 style={{ color: '#c5a059', borderBottom: '1px solid #334155', paddingBottom: '6px', marginTop: '24px' }}>As 4 Subclasses Oficiais (Nível 3)</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                    <div style={{ background: '#181b2a', border: '1px solid #334155', padding: '12px', borderRadius: '8px' }}>
                        <strong style={{ color: '#f43f5e' }}>1. Círculo da Lua (Circle of the Moon)</strong>
                        <p style={{ fontSize: '0.85rem', margin: '6px 0', color: '#cbd5e1' }}>
                            &bull; <em>Formas de Combate:</em> CA em forma de fera é igual a <code>13 + mod Sabedoria</code>.
                            <br />&bull; <em>Golpes Lunares:</em> Seus ataques de fera usam Sabedoria, causam dano Radiante e você ganha 3x o nível de druida em PV temporários na transformação!
                        </p>
                    </div>

                    <div style={{ background: '#181b2a', border: '1px solid #334155', padding: '12px', borderRadius: '8px' }}>
                        <strong style={{ color: '#f43f5e' }}>2. Círculo do Mar (Circle of the Sea - Subclasse 2024)</strong>
                        <p style={{ fontSize: '0.85rem', margin: '6px 0', color: '#cbd5e1' }}>
                            &bull; <em>Ira do Mar:</em> Como Ação Bônus, crie uma aura tempestuosa de 3m. Inimigos sofrem dano de Frio ou Choque e são empurrados 4,5m se falharem em salva de Constituição!
                        </p>
                    </div>

                    <div style={{ background: '#181b2a', border: '1px solid #334155', padding: '12px', borderRadius: '8px' }}>
                        <strong style={{ color: '#f43f5e' }}>3. Círculo da Terra (Circle of the Land)</strong>
                        <p style={{ fontSize: '0.85rem', margin: '6px 0', color: '#cbd5e1' }}>
                            &bull; <em>Recuperação Natural:</em> Recupera espaços de magia após descanso curto.
                            <br />&bull; <em>Biomas Preparados:</em> Escolha Ártico, Costa, Deserto ou Floresta para magias temáticas sempre preparadas.
                        </p>
                    </div>

                    <div style={{ background: '#181b2a', border: '1px solid #334155', padding: '12px', borderRadius: '8px' }}>
                        <strong style={{ color: '#f43f5e' }}>4. Círculo das Estrelas (Circle of the Stars)</strong>
                        <p style={{ fontSize: '0.85rem', margin: '6px 0', color: '#cbd5e1' }}>
                            &bull; <em>Forma Estelar:</em> Arqueiro (ataque bônus radiante d8), Cálice (cura duplicada em aliados) ou Dragão (resultado mínimo 10 em testes de concentração).
                        </p>
                    </div>
                </div>
            </div>
        )
    },

    // 6. FEITICEIRO
    {
        id: 'phb_class_sorcerer',
        title: 'Feiticeiro (Sorcerer)',
        category: 'Classes de D&D (Cap. 3)',
        content: (
            <div>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <img
                        src="/assets/classes/sorcerer.jpeg"
                        alt="Feiticeiro Oficial D&D 5.5e"
                        style={{ maxWidth: '100%', maxHeight: '440px', borderRadius: '8px', border: '1px solid #e11d48', objectFit: 'contain', boxShadow: '0 8px 24px rgba(0,0,0,0.6)' }}
                    />
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '8px' }}>
                        <em>Magia bruta e deslumbrante correndo diretamente nas veias, metamorfoseando feitiços à vontade.</em>
                    </p>
                </div>

                <div style={{ background: 'rgba(225, 29, 72, 0.08)', border: '1px solid #e11d48', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
                    <h3 style={{ color: '#f43f5e', margin: '0 0 8px 0' }}>Ficha Técnica da Classe</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px', fontSize: '0.88rem' }}>
                        <div><strong>Dado de Vida:</strong> d6 por nível</div>
                        <div><strong>Atributo Primário:</strong> Carisma</div>
                        <div><strong>Salvaguardas:</strong> Constituição, Carisma</div>
                        <div><strong>Armaduras:</strong> Nenhuma</div>
                        <div><strong>Armas:</strong> Simples</div>
                    </div>
                </div>

                <h3 style={{ color: '#c5a059', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>Habilidades Fundamentais (Níveis 1 a 5)</h3>
                <ul style={{ lineHeight: '1.8' }}>
                    <li>
                        <strong>Feitiçaria Inata (Innate Sorcery - A Grande Mecânica Nova 2024):</strong> Como Ação Bônus, libere a energia arcana em seu sangue por 1 minuto (2 usos por Descanso Longo). Enquanto ativa:
                        <br />&bull; Você ganha <strong>Vantagem em TODAS as jogadas de ataque com magias</strong> de Feiticeiro!
                        <br />&bull; A <strong>Classe de Dificuldade (CD) das suas magias de Feiticeiro aumenta em +1</strong>!
                    </li>
                    <li>
                        <strong>Pontos de Feitiçaria & Metamagia (Nv 2):</strong> Converta slots em pontos ou gaste pontos para dobrar o poder de suas magias (Magia Acelerada, Magia Cuidadosa, Magia Potencializada, Magia Sutil).
                    </li>
                    <li>
                        <strong>Encarnação da Feitiçaria (Sorcerous Incarnation - Nv 5):</strong> Recupere pontos de feitiçaria em descanso curto e amplie seus poderes inatos.
                    </li>
                </ul>

                <h3 style={{ color: '#c5a059', borderBottom: '1px solid #334155', paddingBottom: '6px', marginTop: '24px' }}>As 4 Subclasses Oficiais (Nível 3)</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                    <div style={{ background: '#181b2a', border: '1px solid #334155', padding: '12px', borderRadius: '8px' }}>
                        <strong style={{ color: '#f43f5e' }}>1. Feitiçaria Dracônica (Draconic Sorcery)</strong>
                        <p style={{ fontSize: '0.85rem', margin: '6px 0', color: '#cbd5e1' }}>
                            &bull; <em>Resiliência Dracônica:</em> CA sem armadura = <code>10 + DES + CAR</code> e +1 PV por nível de feiticeiro.
                            <br />&bull; <em>Afinidade Elemental:</em> Soma Carisma ao dano das magias do elemento do seu dragão.
                        </p>
                    </div>

                    <div style={{ background: '#181b2a', border: '1px solid #334155', padding: '12px', borderRadius: '8px' }}>
                        <strong style={{ color: '#f43f5e' }}>2. Magia Selvagem (Wild Magic)</strong>
                        <p style={{ fontSize: '0.85rem', margin: '6px 0', color: '#cbd5e1' }}>
                            &bull; <em>Surtos de Magia Selvagem:</em> Tabela oficial de 1d100 com efeitos imprevisíveis ao lançar magias.
                            <br />&bull; <em>Marés do Caos:</em> Vantagem gratuita em uma rolagem de d20 à escolha.
                        </p>
                    </div>

                    <div style={{ background: '#181b2a', border: '1px solid #334155', padding: '12px', borderRadius: '8px' }}>
                        <strong style={{ color: '#f43f5e' }}>3. Feitiçaria Aberrante (Aberrant Sorcery)</strong>
                        <p style={{ fontSize: '0.85rem', margin: '6px 0', color: '#cbd5e1' }}>
                            &bull; <em>Telepatia de Mente Aberrante:</em> Comunicação mental silenciosa.
                            <br />&bull; <em>Conjuração Psíquica:</em> Lança magias psíquicas preparadas sem gastar componentes somáticos e verbais!
                        </p>
                    </div>

                    <div style={{ background: '#181b2a', border: '1px solid #334155', padding: '12px', borderRadius: '8px' }}>
                        <strong style={{ color: '#f43f5e' }}>4. Feitiçaria da Tempestade (Storm Sorcery)</strong>
                        <p style={{ fontSize: '0.85rem', margin: '6px 0', color: '#cbd5e1' }}>
                            &bull; <em>Magia Tempestuosa:</em> Como Ação Bônus ao lançar magia, voe 3m sem provocar ataques de oportunidade.
                            <br />&bull; <em>Coração da Tempestade:</em> Causa dano de eletricidade e trovão a inimigos próximos.
                        </p>
                    </div>
                </div>
            </div>
        )
    },

    // 7. GUARDIÃO / RANGER
    {
        id: 'phb_class_ranger',
        title: 'Guardião (Ranger)',
        category: 'Classes de D&D (Cap. 3)',
        content: (
            <div>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <img
                        src="/assets/classes/ranger.jpeg"
                        alt="Guardião Oficial D&D 5.5e"
                        style={{ maxWidth: '100%', maxHeight: '440px', borderRadius: '8px', border: '1px solid #e11d48', objectFit: 'contain', boxShadow: '0 8px 24px rgba(0,0,0,0.6)' }}
                    />
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '8px' }}>
                        <em>Rastreador mestre das fronteiras selvagens com Marca do Caçador inata e comunhão com a natureza.</em>
                    </p>
                </div>

                <div style={{ background: 'rgba(225, 29, 72, 0.08)', border: '1px solid #e11d48', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
                    <h3 style={{ color: '#f43f5e', margin: '0 0 8px 0' }}>Ficha Técnica da Classe</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px', fontSize: '0.88rem' }}>
                        <div><strong>Dado de Vida:</strong> d10 por nível</div>
                        <div><strong>Atributos Primários:</strong> Destreza, Sabedoria</div>
                        <div><strong>Salvaguardas:</strong> Força, Destreza</div>
                        <div><strong>Armaduras:</strong> Leves, Médias, Escudos</div>
                        <div><strong>Armas:</strong> Simples, Marciais</div>
                        <div><strong>Maestrias:</strong> 2 armas</div>
                    </div>
                </div>

                <h3 style={{ color: '#c5a059', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>Habilidades Fundamentais (Níveis 1 a 5)</h3>
                <ul style={{ lineHeight: '1.8' }}>
                    <li>
                        <strong>Conjuração no 1º Nível (Spellcasting):</strong> Prepara magias da lista de Guardião desde o 1º nível usando Sabedoria como atributo de conjuração.
                    </li>
                    <li>
                        <strong>Marca do Caçador Inata Gratuita (Hunter's Mark 2024):</strong> Você tem a magia *Marca do Caçador* sempre preparada e pode conjurá-la **2 vezes por Descanso Longo sem gastar espaços de magia**!
                    </li>
                    <li>
                        <strong>Especialista (Expertise - Nv 2):</strong> Dobra o bônus de proficiência em uma perícia à sua escolha (como Percepção ou Furtividade).
                    </li>
                    <li>
                        <strong>Andarilho (Deft Explorer - Nv 2):</strong> Velocidade de escalada e natação iguais ao seu deslocamento de caminhada; +3m de velocidade a partir do nível 6.
                    </li>
                    <li>
                        <strong>Ataque Extra (Extra Attack - Nv 5):</strong> Dois ataques ao realizar a ação Atacar.
                    </li>
                </ul>

                <h3 style={{ color: '#c5a059', borderBottom: '1px solid #334155', paddingBottom: '6px', marginTop: '24px' }}>As 4 Subclasses Oficiais (Nível 3)</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                    <div style={{ background: '#181b2a', border: '1px solid #334155', padding: '12px', borderRadius: '8px' }}>
                        <strong style={{ color: '#f43f5e' }}>1. Caçador (Hunter)</strong>
                        <p style={{ fontSize: '0.85rem', margin: '6px 0', color: '#cbd5e1' }}>
                            &bull; <em>Presa do Colosso:</em> Causa +1d8 de dano na primeira vez por turno que acertar uma criatura que esteja abaixo do máximo de PV.
                            <br />&bull; <em>Defesa Multi-ataque:</em> Ganha +4 na CA contra ataques subsequentes do mesmo inimigo.
                        </p>
                    </div>

                    <div style={{ background: '#181b2a', border: '1px solid #334155', padding: '12px', borderRadius: '8px' }}>
                        <strong style={{ color: '#f43f5e' }}>2. Senhor das Feras (Beast Master)</strong>
                        <p style={{ fontSize: '0.85rem', margin: '6px 0', color: '#cbd5e1' }}>
                            &bull; <em>Companheiro Primordial:</em> Invoque a Besta da Terra, do Ar ou do Mar. Ela age com sua Ação Bônus e escala PV com o seu nível de ranger.
                        </p>
                    </div>

                    <div style={{ background: '#181b2a', border: '1px solid #334155', padding: '12px', borderRadius: '8px' }}>
                        <strong style={{ color: '#f43f5e' }}>3. Vigilante das Sombras (Gloom Stalker)</strong>
                        <p style={{ fontSize: '0.85rem', margin: '6px 0', color: '#cbd5e1' }}>
                            &bull; <em>Emboscador do Pavor:</em> Visão no escuro +18m; invisível para criaturas que usam visão no escuro na escuridão plena; no 1º turno ganha +3m e golpe de pavor extra!
                        </p>
                    </div>

                    <div style={{ background: '#181b2a', border: '1px solid #334155', padding: '12px', borderRadius: '8px' }}>
                        <strong style={{ color: '#f43f5e' }}>4. Andarilho Feérico (Fey Wanderer)</strong>
                        <p style={{ fontSize: '0.85rem', margin: '6px 0', color: '#cbd5e1' }}>
                            &bull; <em>Presença Sobrenatural:</em> Adiciona seu modificador de Sabedoria em todos os testes de Carisma.
                            <br />&bull; <em>Golpes Feéricos:</em> Causa +1d4 de dano Psíquico em acertos de arma.
                        </p>
                    </div>
                </div>
            </div>
        )
    },

    // 8. GUERREIRO
    {
        id: 'phb_class_fighter',
        title: 'Guerreiro (Fighter)',
        category: 'Classes de D&D (Cap. 3)',
        content: (
            <div>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <img
                        src="/assets/classes/fighter.jpeg"
                        alt="Guerreiro Oficial D&D 5.5e"
                        style={{ maxWidth: '100%', maxHeight: '440px', borderRadius: '8px', border: '1px solid #e11d48', objectFit: 'contain', boxShadow: '0 8px 24px rgba(0,0,0,0.6)' }}
                    />
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '8px' }}>
                        <em>Mestre supremo de todas as armas, táticas e manobras marciais do campo de batalha.</em>
                    </p>
                </div>

                <div style={{ background: 'rgba(225, 29, 72, 0.08)', border: '1px solid #e11d48', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
                    <h3 style={{ color: '#f43f5e', margin: '0 0 8px 0' }}>Ficha Técnica da Classe</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px', fontSize: '0.88rem' }}>
                        <div><strong>Dado de Vida:</strong> d10 por nível</div>
                        <div><strong>Atributos Primários:</strong> Força ou Destreza</div>
                        <div><strong>Salvaguardas:</strong> Força, Constituição</div>
                        <div><strong>Armaduras:</strong> Todas + Escudos</div>
                        <div><strong>Armas:</strong> Simples, Marciais</div>
                        <div><strong>Maestrias:</strong> 3 armas no Nv 1!</div>
                    </div>
                </div>

                <h3 style={{ color: '#c5a059', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>Habilidades Fundamentais (Níveis 1 a 5)</h3>
                <ul style={{ lineHeight: '1.8' }}>
                    <li>
                        <strong>Maestria de Armas (Weapon Mastery - 3 Armas):</strong> Você domina as propriedades táticas (Topple, Push, Slow, Vex, Nick, etc.) de 3 armas diferentes desde o 1º nível.
                    </li>
                    <li>
                        <strong>Retomar o Fôlego Oficial 2024 (Second Wind - Múltiplos Usos!):</strong> Você começa com **2 usos no 1º nível** (e escala até 4 usos nos níveis altos!). Com uma Ação Bônus, cura <code>1d10 + nível de guerreiro</code> em PV. Recupera **1 uso em Descanso Curto** e todos em Descanso Longo.
                    </li>
                    <li>
                        <strong>Mente Tática (Tactical Mind - Regra Revolucionária 2024 no Nv 2):</strong> Se falhar num teste de atributo/perícia, você pode gastar 1 uso de Retomar o Fôlego para rolar **1d10 e somar ao resultado**. Se ainda assim você falhar, **O USO NÃO É CONSUMIDO**!
                    </li>
                    <li>
                        <strong>Surto de Ação (Action Surge - Nv 2):</strong> Realize uma ação adicional completa no seu turno (1 uso por descanso curto/longo).
                    </li>
                    <li>
                        <strong>Turno Tático (Tactical Shift - Nv 5):</strong> Ao acionar Retomar o Fôlego, mova-se até metade do seu deslocamento sem provocar nenhum ataque de oportunidade.
                    </li>
                    <li>
                        <strong>Ataque Extra (Extra Attack - Nv 5):</strong> Dois ataques por ação Atacar (três no nível 11 e quatro no nível 20!).
                    </li>
                </ul>

                <h3 style={{ color: '#c5a059', borderBottom: '1px solid #334155', paddingBottom: '6px', marginTop: '24px' }}>As 4 Subclasses Oficiais (Nível 3)</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                    <div style={{ background: '#181b2a', border: '1px solid #334155', padding: '12px', borderRadius: '8px' }}>
                        <strong style={{ color: '#f43f5e' }}>1. Campeão (Champion)</strong>
                        <p style={{ fontSize: '0.85rem', margin: '6px 0', color: '#cbd5e1' }}>
                            &bull; <em>Crítico Aprimorado:</em> Seus ataques conseguem acerto crítico em rolagens de <strong>19 ou 20</strong>!
                            <br />&bull; <em>Atleta Notável:</em> Vantagem na iniciativa e soma Força em saltos.
                            <br />&bull; <em>Guerreiro Heroico:</em> Ganha Inspiração Heroica no início de cada turno de combate se não possuir!
                        </p>
                    </div>

                    <div style={{ background: '#181b2a', border: '1px solid #334155', padding: '12px', borderRadius: '8px' }}>
                        <strong style={{ color: '#f43f5e' }}>2. Mestre da Batalha (Battle Master)</strong>
                        <p style={{ fontSize: '0.85rem', margin: '6px 0', color: '#cbd5e1' }}>
                            &bull; <em>Dados de Superioridade:</em> 4 dados d8 para manobras táticas (Ataque de Desarme, Ataque Provocador, Rasteira, Ataque Ameaçador, Golpe com Finta).
                        </p>
                    </div>

                    <div style={{ background: '#181b2a', border: '1px solid #334155', padding: '12px', borderRadius: '8px' }}>
                        <strong style={{ color: '#f43f5e' }}>3. Cavaleiro Místico (Eldritch Knight)</strong>
                        <p style={{ fontSize: '0.85rem', margin: '6px 0', color: '#cbd5e1' }}>
                            &bull; <em>Magias de Mago:</em> Prepara truques e magias arcanas de Abjuração e Evocação (Escudo, Mísseis Mágicos).
                            <br />&bull; <em>Magia de Guerra:</em> Substitui um ataque pela conjuração de um truque de mago!
                        </p>
                    </div>

                    <div style={{ background: '#181b2a', border: '1px solid #334155', padding: '12px', borderRadius: '8px' }}>
                        <strong style={{ color: '#f43f5e' }}>4. Combatente Psíquico (Psi Warrior)</strong>
                        <p style={{ fontSize: '0.85rem', margin: '6px 0', color: '#cbd5e1' }}>
                            &bull; <em>Dados de Energia Psiônica:</em> Ergue barreiras telecinéticas para reduzir dano de aliados e infunde armas com dano psíquico cortante.
                        </p>
                    </div>
                </div>
            </div>
        )
    },

    // 9. LADINO
    {
        id: 'phb_class_rogue',
        title: 'Ladino (Rogue)',
        category: 'Classes de D&D (Cap. 3)',
        content: (
            <div>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <img
                        src="/assets/classes/rogue.jpeg"
                        alt="Ladino Oficial D&D 5.5e"
                        style={{ maxWidth: '100%', maxHeight: '440px', borderRadius: '8px', border: '1px solid #e11d48', objectFit: 'contain', boxShadow: '0 8px 24px rgba(0,0,0,0.6)' }}
                    />
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '8px' }}>
                        <em>Especialista em furtividade letal, perícia inigualável e os novos e revolucionários Golpes Ladinos.</em>
                    </p>
                </div>

                <div style={{ background: 'rgba(225, 29, 72, 0.08)', border: '1px solid #e11d48', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
                    <h3 style={{ color: '#f43f5e', margin: '0 0 8px 0' }}>Ficha Técnica da Classe</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px', fontSize: '0.88rem' }}>
                        <div><strong>Dado de Vida:</strong> d8 por nível</div>
                        <div><strong>Atributo Primário:</strong> Destreza</div>
                        <div><strong>Salvaguardas:</strong> Destreza, Inteligência</div>
                        <div><strong>Armaduras:</strong> Leves</div>
                        <div><strong>Armas:</strong> Simples, Marciais Ágeis ou à Distância</div>
                        <div><strong>Maestrias:</strong> 2 armas</div>
                    </div>
                </div>

                <h3 style={{ color: '#c5a059', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>Habilidades Fundamentais (Níveis 1 a 5)</h3>
                <ul style={{ lineHeight: '1.8' }}>
                    <li>
                        <strong>Ataque Furtivo (Sneak Attack):</strong> Causa dano extra (1d6 no Nv 1, 2d6 no Nv 3, 3d6 no Nv 5, etc.) uma vez por turno ao atingir com arma ágil ou à distância se tiver Vantagem ou se um aliado estiver a 1,5m do alvo.
                    </li>
                    <li>
                        <strong>Especialista (Expertise - Nv 1 e 6):</strong> Dobra proficiência em duas perícias (ex: Furtividade e Prestidigitação/Ferramentas de Ladrão).
                    </li>
                    <li>
                        <strong>Ação Astuta (Cunning Action - Nv 2):</strong> Realize a ação Disparada, Desengajar ou Esconder-se como uma **Ação Bônus**.
                    </li>
                    <li>
                        <strong>Golpe Ladino (Cunning Strike):</strong> Ao desferir um Ataque Furtivo, você pode **sacrificar dados de dano furtivo** para aplicar efeitos debilitantes no inimigo:
                        <ul style={{ marginTop: '6px', paddingLeft: '20px' }}>
                            <li><strong>Derrubar (Trip - Custa 1d6):</strong> O alvo faz salvaguarda de Destreza (CD 8 + mod DES + PB) ou cai <strong>Caído (Prone)</strong> no chão!</li>
                            <li><strong>Desarmar (Disarm - Custa 1d6):</strong> O alvo faz salvaguarda de Destreza ou solta um item empunhado.</li>
                            <li><strong>Envenenar (Poison - Custa 1d6):</strong> O alvo faz salvaguarda de Constituição ou fica com a condição <strong>Envenenado por 1 minuto</strong>!</li>
                            <li><strong>Retirar-se (Withdraw - Custa 1d6):</strong> Mova-se até metade da velocidade sem provocar ataques de oportunidade.</li>
                        </ul>
                    </li>
                    <li>
                        <strong>Esquiva Sobrenatural (Uncanny Dodge - Nv 5):</strong> Reação para reduzir o dano de um ataque que o atinja pela metade!
                    </li>
                </ul>

                <h3 style={{ color: '#c5a059', borderBottom: '1px solid #334155', paddingBottom: '6px', marginTop: '24px' }}>As 4 Subclasses Oficiais (Nível 3)</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                    <div style={{ background: '#181b2a', border: '1px solid #334155', padding: '12px', borderRadius: '8px' }}>
                        <strong style={{ color: '#f43f5e' }}>1. Ladrão (Thief)</strong>
                        <p style={{ fontSize: '0.85rem', margin: '6px 0', color: '#cbd5e1' }}>
                            &bull; <em>Mãos Rápidas:</em> Arrombar fechaduras, desarmar armadilhas ou Usar Objeto com Ação Bônus.
                            <br />&bull; <em>Usar Itens Mágicos:</em> No nível 6 pode usar itens mágicos como Ação Bônus e ganha 4º espaço de sintonização!
                        </p>
                    </div>

                    <div style={{ background: '#181b2a', border: '1px solid #334155', padding: '12px', borderRadius: '8px' }}>
                        <strong style={{ color: '#f43f5e' }}>2. Assassino (Assassin)</strong>
                        <p style={{ fontSize: '0.85rem', margin: '6px 0', color: '#cbd5e1' }}>
                            &bull; <em>Assassinar:</em> Vantagem na rolagem de iniciativa; no primeiro turno ganha Vantagem em ataques e causa dano furtivo extra massivo!
                        </p>
                    </div>

                    <div style={{ background: '#181b2a', border: '1px solid #334155', padding: '12px', borderRadius: '8px' }}>
                        <strong style={{ color: '#f43f5e' }}>3. Trapaceiro Arcano (Arcane Trickster)</strong>
                        <p style={{ fontSize: '0.85rem', margin: '6px 0', color: '#cbd5e1' }}>
                            &bull; <em>Mão Mágica Ladina:</em> Mão espectral invisível que furta bolsos e destranca portas à distância.
                            <br />&bull; <em>Magias de Mago:</em> Conhece magias de Ilusão e Encantamento com Inteligência.
                        </p>
                    </div>

                    <div style={{ background: '#181b2a', border: '1px solid #334155', padding: '12px', borderRadius: '8px' }}>
                        <strong style={{ color: '#f43f5e' }}>4. Lâmina Espiritual (Soulknife)</strong>
                        <p style={{ fontSize: '0.85rem', margin: '6px 0', color: '#cbd5e1' }}>
                            &bull; <em>Lâminas Psíquicas:</em> Convoque punhais mentais de pura energia psíquica (1d6 dano psíquico e 1d4 ataque bônus) e telepatia de grupo ilimitada.
                        </p>
                    </div>
                </div>
            </div>
        )
    },

    // 10. MAGO
    {
        id: 'phb_class_wizard',
        title: 'Mago (Wizard)',
        category: 'Classes de D&D (Cap. 3)',
        content: (
            <div>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <img
                        src="/assets/classes/wizard.jpeg"
                        alt="Mago Oficial D&D 5.5e"
                        style={{ maxWidth: '100%', maxHeight: '440px', borderRadius: '8px', border: '1px solid #e11d48', objectFit: 'contain', boxShadow: '0 8px 24px rgba(0,0,0,0.6)' }}
                    />
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '8px' }}>
                        <em>O erudito mestre do Cosmos Arcano, portador do Grimório e senhor das forças místicas da realidade.</em>
                    </p>
                </div>

                <div style={{ background: 'rgba(225, 29, 72, 0.08)', border: '1px solid #e11d48', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
                    <h3 style={{ color: '#f43f5e', margin: '0 0 8px 0' }}>Ficha Técnica da Classe</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px', fontSize: '0.88rem' }}>
                        <div><strong>Dado de Vida:</strong> d6 por nível</div>
                        <div><strong>Atributo Primário:</strong> Inteligência</div>
                        <div><strong>Salvaguardas:</strong> Inteligência, Sabedoria</div>
                        <div><strong>Armaduras:</strong> Nenhuma</div>
                        <div><strong>Armas:</strong> Adagas, Bordões, Bestas Leves</div>
                    </div>
                </div>

                <h3 style={{ color: '#c5a059', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>Habilidades Fundamentais (Níveis 1 a 5)</h3>
                <ul style={{ lineHeight: '1.8' }}>
                    <li>
                        <strong>Grimório Arcano & Rituais Universais:</strong> Começa com 6 magias de 1º nível e aprende 2 novas a cada nível. Pode copiar novas magias de pergaminhos por 50 PO e 2h por nível. <strong>Pode conjurar qualquer magia marcada como Ritual do seu grimório sem precisar prepará-la</strong>!
                    </li>
                    <li>
                        <strong>Recuperação Arcana (Arcane Recovery):</strong> Uma vez ao dia em Descanso Curto, recupera espaços de magia cujo total de níveis combinados seja igual a até metade do seu nível de Mago.
                    </li>
                    <li>
                        <strong>Memorizar Magia (Memorize Spell):</strong> Ao concluir um Descanso Curto, você pode consultar seu grimório e **trocar uma das suas magias preparadas** por outra do mesmo nível presente no tomo!
                    </li>
                </ul>

                <h3 style={{ color: '#c5a059', borderBottom: '1px solid #334155', paddingBottom: '6px', marginTop: '24px' }}>As 4 Subclasses Oficiais (Nível 3)</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                    <div style={{ background: '#181b2a', border: '1px solid #334155', padding: '12px', borderRadius: '8px' }}>
                        <strong style={{ color: '#f43f5e' }}>1. Escola de Evocação (Evocation)</strong>
                        <p style={{ fontSize: '0.85rem', margin: '6px 0', color: '#cbd5e1' }}>
                            &bull; <em>Esculpir Magias:</em> Seus aliados passam automaticamente nas salvaguardas das suas magias de área (como Bola de Fogo) e não sofrem dano algum!
                            <br />&bull; <em>Truques Potentes:</em> Inimigos que passam na salvaguarda dos seus truques ainda sofrem metade do dano.
                        </p>
                    </div>

                    <div style={{ background: '#181b2a', border: '1px solid #334155', padding: '12px', borderRadius: '8px' }}>
                        <strong style={{ color: '#f43f5e' }}>2. Escola de Adivinhação (Divination)</strong>
                        <p style={{ fontSize: '0.85rem', margin: '6px 0', color: '#cbd5e1' }}>
                            &bull; <em>Portento (Portent):</em> Role <strong>2d20</strong> após cada descanso longo e guarde os valores. Use-os para substituir rolagens de ataque, salvaguardas ou testes de qualquer criatura durante o dia!
                        </p>
                    </div>

                    <div style={{ background: '#181b2a', border: '1px solid #334155', padding: '12px', borderRadius: '8px' }}>
                        <strong style={{ color: '#f43f5e' }}>3. Escola de Abjuração (Abjuration)</strong>
                        <p style={{ fontSize: '0.85rem', margin: '6px 0', color: '#cbd5e1' }}>
                            &bull; <em>Proteção Arcana (Arcane Ward):</em> Escudo mágico que absorve dano direcionado a você ou aliados a até 9m, recarregando sempre que lançar magias de proteção.
                        </p>
                    </div>

                    <div style={{ background: '#181b2a', border: '1px solid #334155', padding: '12px', borderRadius: '8px' }}>
                        <strong style={{ color: '#f43f5e' }}>4. Escola de Ilusão (Illusion)</strong>
                        <p style={{ fontSize: '0.85rem', margin: '6px 0', color: '#cbd5e1' }}>
                            &bull; <em>Ilusão Menor Aprimorada:</em> Cria som e imagem simultaneamente no mesmo truque.
                            <br />&bull; <em>Ilusões Maleáveis:</em> Altere o formato de ilusões ativas à vontade.
                        </p>
                    </div>
                </div>
            </div>
        )
    },

    // 11. MONGE
    {
        id: 'phb_class_monk',
        title: 'Monk (Monk)',
        category: 'Classes de D&D (Cap. 3)',
        content: (
            <div>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <img
                        src="/assets/classes/monk.jpeg"
                        alt="Monge Oficial D&D 5.5e"
                        style={{ maxWidth: '100%', maxHeight: '440px', borderRadius: '8px', border: '1px solid #e11d48', objectFit: 'contain', boxShadow: '0 8px 24px rgba(0,0,0,0.6)' }}
                    />
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '8px' }}>
                        <em>Mestre do corpo e espírito, canalizando a energia do Foco em golpes supersônicos e aparando projéteis e espadas.</em>
                    </p>
                </div>

                <div style={{ background: 'rgba(225, 29, 72, 0.08)', border: '1px solid #e11d48', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
                    <h3 style={{ color: '#f43f5e', margin: '0 0 8px 0' }}>Ficha Técnica da Classe</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px', fontSize: '0.88rem' }}>
                        <div><strong>Dado de Vida:</strong> d8 por nível</div>
                        <div><strong>Atributos Primários:</strong> Destreza, Sabedoria</div>
                        <div><strong>Salvaguardas:</strong> Força, Destreza</div>
                        <div><strong>Armaduras:</strong> Nenhuma</div>
                        <div><strong>Armas:</strong> Simples, Armas Marciais Leves</div>
                    </div>
                </div>

                <h3 style={{ color: '#c5a059', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>Habilidades Fundamentais (Níveis 1 a 5)</h3>
                <ul style={{ lineHeight: '1.8' }}>
                    <li>
                        <strong>Defesa sem Armadura:</strong> Quando sem armadura e sem escudo, sua CA é <code>10 + mod Destreza + mod Sabedoria</code>.
                    </li>
                    <li>
                        <strong>Artes Marciais (Martial Arts - 1d6 no 1º Nível):</strong> Você ataca e causa dano usando Destreza. Seu dano desarmado começa em **1d6** (escala para 1d8 nv 5, 1d10 nv 11, 1d12 nv 17) e você pode desferir um golpe desarmado como Ação Bônus após atacar!
                    </li>
                    <li>
                        <strong>Pontos de Foco & Movimentos Ágeis (Nv 2):</strong> Reserva de Foco igual ao nível de monge.
                        <br />&bull; <em>Rajada de Golpes (Flurry of Blows):</em> Gasta 1 foco para fazer **dois golpes desarmados extras** como ação bônus.
                        <br />&bull; <em>Defesa Paciente:</em> Como Ação Bônus, use **Desengajar de graça sem gastar foco**; ou gaste 1 foco para **Desengajar E Esquivar (Dodge)** juntos!
                        <br />&bull; <em>Passo do Vento:</em> Como Ação Bônus, use **Disparada de graça sem gastar foco**; ou gaste 1 foco para Disparar e Desengajar com salto dobrado!
                    </li>
                    <li>
                        <strong>Aparar Ataques (Deflect Attacks):</strong> Como Reação ao sofrer dano de um ataque corpo a corpo OU projétil à distância, reduza o dano em <code>1d10 + mod DES + nível de monge</code>. Se reduzir o dano a zero, pode gastar 1 foco para contra-atacar ou rebater o golpe no inimigo!
                    </li>
                    <li>
                        <strong>Movimento sem Armadura (Nv 2):</strong> +3 metros de deslocamento no Nv 2, escalando até +9m.
                    </li>
                    <li>
                        <strong>Ataque Extra & Golpe Atordoante (Stunning Strike - Nv 5):</strong> Pode gastar foco para atordoar um inimigo até o início do seu próximo turno se ele falhar na salva de Constituição.
                    </li>
                </ul>

                <h3 style={{ color: '#c5a059', borderBottom: '1px solid #334155', paddingBottom: '6px', marginTop: '24px' }}>As 4 Subclasses Oficiais (Nível 3)</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                    <div style={{ background: '#181b2a', border: '1px solid #334155', padding: '12px', borderRadius: '8px' }}>
                        <strong style={{ color: '#f43f5e' }}>1. Guerreiro da Mão Espalmada (Open Hand)</strong>
                        <p style={{ fontSize: '0.85rem', margin: '6px 0', color: '#cbd5e1' }}>
                            &bull; <em>Técnica da Mão Aberta:</em> Ao acertar a Rajada de Golpes, aplique: Derrubar Caído (salva DES), Empurrar 4,5m (salva FOR) ou cancelar a reação do inimigo sem salvaguarda!
                        </p>
                    </div>

                    <div style={{ background: '#181b2a', border: '1px solid #334155', padding: '12px', borderRadius: '8px' }}>
                        <strong style={{ color: '#f43f5e' }}>2. Guerreiro das Sombras (Shadow)</strong>
                        <p style={{ fontSize: '0.85rem', margin: '6px 0', color: '#cbd5e1' }}>
                            &bull; <em>Manto de Trevas:</em> Cria escuridão mágica que você enxerga perfeitamente.
                            <br />&bull; <em>Passo das Sombras:</em> Teleporte de 18 metros entre sombras como Ação Bônus com Vantagem no próximo ataque!
                        </p>
                    </div>

                    <div style={{ background: '#181b2a', border: '1px solid #334155', padding: '12px', borderRadius: '8px' }}>
                        <strong style={{ color: '#f43f5e' }}>3. Guerreiro dos Elementos (Elements)</strong>
                        <p style={{ fontSize: '0.85rem', margin: '6px 0', color: '#cbd5e1' }}>
                            &bull; <em>Alcance Elemental:</em> Seus golpes desarmados ganham alcance de 4,5m e causam dano de Fogo, Frio, Ácido, Choque ou Trovão à sua escolha!
                        </p>
                    </div>

                    <div style={{ background: '#181b2a', border: '1px solid #334155', padding: '12px', borderRadius: '8px' }}>
                        <strong style={{ color: '#f43f5e' }}>4. Guerreiro da Misericórdia (Mercy)</strong>
                        <p style={{ fontSize: '0.85rem', margin: '6px 0', color: '#cbd5e1' }}>
                            &bull; <em>Mãos da Cura:</em> Gasta foco para curar aliados ao invés de bater.
                            <br />&bull; <em>Mãos do Dano:</em> Causa dano necrótico extra e envenena o alvo sem teste de resistência!
                        </p>
                    </div>
                </div>
            </div>
        )
    },

    // 12. PALADINO
    {
        id: 'phb_class_paladin',
        title: 'Paladino (Paladin)',
        category: 'Classes de D&D (Cap. 3)',
        content: (
            <div>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <img
                        src="/assets/classes/paladin.jpeg"
                        alt="Paladino Oficial D&D 5.5e"
                        style={{ maxWidth: '100%', maxHeight: '440px', borderRadius: '8px', border: '1px solid #e11d48', objectFit: 'contain', boxShadow: '0 8px 24px rgba(0,0,0,0.6)' }}
                    />
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '8px' }}>
                        <em>Guerreiro santo investido de votos inquebráveis, auras de proteção e punições radiantes devastadoras.</em>
                    </p>
                </div>

                <div style={{ background: 'rgba(225, 29, 72, 0.08)', border: '1px solid #e11d48', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
                    <h3 style={{ color: '#f43f5e', margin: '0 0 8px 0' }}>Ficha Técnica da Classe</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px', fontSize: '0.88rem' }}>
                        <div><strong>Dado de Vida:</strong> d10 por nível</div>
                        <div><strong>Atributos Primários:</strong> Força, Carisma</div>
                        <div><strong>Salvaguardas:</strong> Sabedoria, Carisma</div>
                        <div><strong>Armaduras:</strong> Todas + Escudos</div>
                        <div><strong>Armas:</strong> Simples, Marciais</div>
                        <div><strong>Maestrias:</strong> 2 armas</div>
                    </div>
                </div>

                <h3 style={{ color: '#c5a059', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>Habilidades Fundamentais (Níveis 1 a 5)</h3>
                <ul style={{ lineHeight: '1.8' }}>
                    <li>
                        <strong>Conjuração Divina no 1º Nível (Spellcasting):</strong> Paladinos preparam magias divinas desde o nível 1 usando Carisma como atributo de conjuração.
                    </li>
                    <li>
                        <strong>Imposição das Mãos como Ação Bônus (Lay on Hands):</strong> Como uma **AÇÃO BÔNUS** (e não mais ação comum!), toque uma criatura e restaure Pontos de Vida de uma reserva igual a <code>5 × nível de paladino</code>. Pode gastar 5 PVs da reserva para remover a condição Envenenado!
                    </li>
                    <li>
                        <strong>Punição Divina (Divine Smite):</strong> *Divine Smite* é agora uma magia de Ação Bônus de 1º nível conjurada imediatamente após atingir um ataque corpo a corpo (+2d8 de dano Radiante, +1d8 por nível de slot superior). Você tem a magia sempre preparada e pode conjurá-la **1 vez por Descanso Longo sem gastar espaço de magia**!
                    </li>
                    <li>
                        <strong>Aura de Proteção (Aura of Protection - Nv 6):</strong> Você e todos os aliados a até 3 metros somam o seu modificador de **CARISMA em TODAS as salvaguardas** (uma das habilidades defensivas mais poderosas de D&D!).
                    </li>
                </ul>

                <h3 style={{ color: '#c5a059', borderBottom: '1px solid #334155', paddingBottom: '6px', marginTop: '24px' }}>As 4 Subclasses Oficiais (Nível 3)</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                    <div style={{ background: '#181b2a', border: '1px solid #334155', padding: '12px', borderRadius: '8px' }}>
                        <strong style={{ color: '#f43f5e' }}>1. Juramento da Devoção (Oath of Devotion)</strong>
                        <p style={{ fontSize: '0.85rem', margin: '6px 0', color: '#cbd5e1' }}>
                            &bull; <em>Arma Sagrada:</em> Como Ação Bônus, infunde sua arma com luz solar: soma Carisma nas jogadas de ataque e causa dano radiante mágico.
                            <br />&bull; <em>Aura de Devoção:</em> Imunidade contínua à condição Enfeitiçado para si e aliados em até 3m.
                        </p>
                    </div>

                    <div style={{ background: '#181b2a', border: '1px solid #334155', padding: '12px', borderRadius: '8px' }}>
                        <strong style={{ color: '#f43f5e' }}>2. Juramento da Vingança (Oath of Vengeance)</strong>
                        <p style={{ fontSize: '0.85rem', margin: '6px 0', color: '#cbd5e1' }}>
                            &bull; <em>Voto de Inimizade (Vow of Enmity):</em> Como Ação Bônus a até 9m, marque um inimigo. Você ganha **Vantagem em TODAS as jogadas de ataque** contra ele durante 1 minuto!
                        </p>
                    </div>

                    <div style={{ background: '#181b2a', border: '1px solid #334155', padding: '12px', borderRadius: '8px' }}>
                        <strong style={{ color: '#f43f5e' }}>3. Juramento dos Anciões (Oath of the Ancients)</strong>
                        <p style={{ fontSize: '0.85rem', margin: '6px 0', color: '#cbd5e1' }}>
                            &bull; <em>Ira da Natureza:</em> Vinhas espectrais brotam para aprisionar inimigos com Ação Bônus.
                            <br />&bull; <em>Aura de Proteção Mágica:</em> Concede Resistência a dano de magias para todos os aliados próximos.
                        </p>
                    </div>

                    <div style={{ background: '#181b2a', border: '1px solid #334155', padding: '12px', borderRadius: '8px' }}>
                        <strong style={{ color: '#f43f5e' }}>4. Juramento da Glória (Oath of Glory)</strong>
                        <p style={{ fontSize: '0.85rem', margin: '6px 0', color: '#cbd5e1' }}>
                            &bull; <em>Atleta Incomparável:</em> Vantagem em testes de Atletismo e salto aprimorado.
                            <br />&bull; <em>Golpe Inspirador:</em> Concede 2d8 + nível em PV Temporários divididos entre aliados ao acionar punições divinas!
                        </p>
                    </div>
                </div>
            </div>
        )
    }
];
