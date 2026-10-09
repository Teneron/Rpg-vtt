import type { RuleSection } from '../../RulebookViewer';

export const DND55E_SPECIES_SECTIONS: RuleSection[] = [
    // 1. AASIMAR
    {
        id: 'phb_species_aasimar',
        title: 'Aasimar (Celestial)',
        category: 'Espécies de D&D (Cap. 4)',
        content: (
            <div>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <img
                        src="/assets/species/aasimar.jpeg"
                        alt="Aasimar Oficial D&D 5.5e"
                        style={{ maxWidth: '100%', maxHeight: '420px', borderRadius: '8px', border: '1px solid #e11d48', objectFit: 'contain', boxShadow: '0 8px 24px rgba(0,0,0,0.6)' }}
                    />
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '8px' }}>
                        <em>Mortais tocados pela centelha dos Planos Superiores, portadores de bênçãos sagradas e asas espirituais.</em>
                    </p>
                </div>

                <div style={{ background: 'rgba(225, 29, 72, 0.08)', border: '1px solid #e11d48', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
                    <h3 style={{ color: '#f43f5e', margin: '0 0 8px 0' }}>Estatísticas Fundamentais</h3>
                    <p style={{ margin: 0, fontSize: '0.92rem', color: '#fecdd3', lineHeight: '1.6' }}>
                        <strong>Tipo de Criatura:</strong> Humanoide | <strong>Tamanho:</strong> Médio (1,20m–2,10m) ou Pequeno (0,60m–1,20m), escolhido na criação | <strong>Deslocamento:</strong> 9 metros.
                    </p>
                </div>

                <h3 style={{ color: '#c5a059', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>Traços Raciais Canônicos</h3>
                <ul style={{ lineHeight: '1.8' }}>
                    <li>
                        <strong>Visão no Escuro (18 metros):</strong> Você enxerga na penumbra a até 18 metros como se fosse luz plena, e na escuridão como se fosse penumbra.
                    </li>
                    <li>
                        <strong>Resistência Celestial:</strong> Você possui Resistência contínua a dano <strong>Necrótico</strong> e a dano <strong>Radiante</strong>.
                    </li>
                    <li>
                        <strong>Mãos Curativas (Healing Hands):</strong> Como ação Usar Magia (Magic action), você toca uma criatura e rola uma quantidade de <strong>d4s igual ao seu Bônus de Proficiência (PB)</strong>. A criatura recupera uma quantidade de Pontos de Vida igual ao total rolado. Você recupera o uso dessa habilidade ao terminar um Descanso Longo.
                    </li>
                    <li>
                        <strong>Portador da Luz (Light Bearer):</strong> Você conhece o truque <em>Luz (Light)</em>. Carisma é o seu atributo de conjuração para este truque.
                    </li>
                    <li>
                        <strong>Revelação Celestial (Celestial Revelation - Nível 3+):</strong> Ao atingir o 3º nível, você desperta uma centelha divina latente. Como Ação Bônus, você se transforma por 1 minuto (ou até encerrar a forma com outra Ação Bônus). Enquanto transformada, <strong>uma vez em cada um dos seus turnos ao causar dano a um alvo</strong> com um ataque ou magia, você causa dano extra igual ao seu <strong>Bônus de Proficiência (PB)</strong>. Você escolhe uma das três revelações abaixo na criação do personagem (1 uso por Descanso Longo, ou gaste um espaço de magia de nível 1+ para reutilizar):
                        <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                            <li><strong>Asas Celestiais (Heavenly Wings):</strong> Duas asas luminosas e etéreas brotam das suas costas. Você ganha Deslocamento de Voo igual ao seu deslocamento de caminhada, e seu dano adicional de Revelação Celestial é <em>Radiante</em>.</li>
                            <li><strong>Manto Necrótico (Necrotic Shroud):</strong> Seus olhos tornam-se fossas de trevas e asas cadavéricas sem penas surgem. Criaturas à sua escolha em até 3 metros devem passar em salvaguarda de Carisma (CD 8 + PB + mod Carisma) ou sofrem a condição <em>Amedrontado</em> até o fim do seu próximo turno. O dano adicional é <em>Necrótico</em>.</li>
                            <li><strong>Transfiguração Radiante (Radiant Consumption):</strong> Chamas solares ardem de seus olhos e boca. Uma aura brilhante de 3 metros queima o ambiente: no final de cada um dos seus turnos, você e criaturas a até 3 metros sofrem dano Radiante igual ao seu PB. Seu dano adicional por turno é <em>Radiante</em>.</li>
                        </ul>
                    </li>
                </ul>
            </div>
        )
    },

    // 2. ANÃO
    {
        id: 'phb_species_dwarf',
        title: 'Anão (Dwarf)',
        category: 'Espécies de D&D (Cap. 4)',
        content: (
            <div>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <img
                        src="/assets/species/dwarf.jpeg"
                        alt="Anão Oficial D&D 5.5e"
                        style={{ maxWidth: '100%', maxHeight: '420px', borderRadius: '8px', border: '1px solid #e11d48', objectFit: 'contain', boxShadow: '0 8px 24px rgba(0,0,0,0.6)' }}
                    />
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '8px' }}>
                        <em>Mestres da pedra, forja e montanhas profundas. Resilientes, corajosos e dotados de conexão mística com a terra.</em>
                    </p>
                </div>

                <div style={{ background: 'rgba(225, 29, 72, 0.08)', border: '1px solid #e11d48', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
                    <h3 style={{ color: '#f43f5e', margin: '0 0 8px 0' }}>Estatísticas Fundamentais</h3>
                    <p style={{ margin: 0, fontSize: '0.92rem', color: '#fecdd3', lineHeight: '1.6' }}>
                        <strong>Tipo de Criatura:</strong> Humanoide | <strong>Tamanho:</strong> Médio (1,20m–1,50m) | <strong>Deslocamento:</strong> 9 metros (9 metros).
                    </p>
                </div>

                <h3 style={{ color: '#c5a059', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>Traços Raciais Canônicos</h3>
                <ul style={{ lineHeight: '1.8' }}>
                    <li>
                        <strong>Visão no Escuro Superior (36 metros / 120 pés):</strong> Habituado às profundezas abissais das minas, você enxerga no escuro a até impressionantes 36 metros de distância!
                    </li>
                    <li>
                        <strong>Resiliência Anã:</strong> Você tem <strong>Vantagem em salvaguardas contra a condição Envenenado</strong> e possui <strong>Resistência a dano de Veneno</strong>.
                    </li>
                    <li>
                        <strong>Tenacidade Anã (Dwarven Toughness):</strong> O vigor do clã corre em suas veias. Seus Pontos de Vida máximos aumentam em <strong>+1</strong>, e aumentam em <strong>+1 adicional a cada avanço de nível</strong> que seu personagem receber.
                    </li>
                    <li>
                        <strong>Especialização em Rochas (Stonecunning - Sentido Sísmico Oficial):</strong> Como Ação Bônus enquanto estiver sobre pedra natural ou trabalhada, você adquire <strong>Sentido Sísmico (Tremorsense) com alcance de 18 metros</strong> durante 10 minutos. Você detecta a localização exata de criaturas e objetos em contato com a pedra, mesmo através de paredes ou invisibilidade! Você pode usar esta habilidade uma quantidade de vezes igual ao seu Bônus de Proficiência (PB) por Descanso Longo.
                    </li>
                </ul>
            </div>
        )
    },

    // 3. DRACONATO
    {
        id: 'phb_species_dragonborn',
        title: 'Draconato (Dragonborn)',
        category: 'Espécies de D&D (Cap. 4)',
        content: (
            <div>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <img
                        src="/assets/species/dragonborn.jpeg"
                        alt="Draconato Oficial D&D 5.5e"
                        style={{ maxWidth: '100%', maxHeight: '420px', borderRadius: '8px', border: '1px solid #e11d48', objectFit: 'contain', boxShadow: '0 8px 24px rgba(0,0,0,0.6)' }}
                    />
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '8px' }}>
                        <em>Descendentes nobres dos dragões verdadeiros, imbuídos de fúria elemental e asas dracônicas ancestrais.</em>
                    </p>
                </div>

                <div style={{ background: 'rgba(225, 29, 72, 0.08)', border: '1px solid #e11d48', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
                    <h3 style={{ color: '#f43f5e', margin: '0 0 8px 0' }}>Estatísticas Fundamentais</h3>
                    <p style={{ margin: 0, fontSize: '0.92rem', color: '#fecdd3', lineHeight: '1.6' }}>
                        <strong>Tipo de Criatura:</strong> Humanoide | <strong>Tamanho:</strong> Médio (1,70m–2,10m) | <strong>Deslocamento:</strong> 9 metros.
                    </p>
                </div>

                <h3 style={{ color: '#c5a059', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>Traços Raciais Canônicos</h3>
                <ul style={{ lineHeight: '1.8' }}>
                    <li>
                        <strong>Visão no Escuro (18 metros):</strong> Enxerga na penumbra e escuridão a até 18 metros.
                    </li>
                    <li>
                        <strong>Ancestralidade Dracônica & Resistência:</strong> Escolha sua linhagem (Preto/Cobre: Ácido; Azul/Bronze: Eletricidade; Latão/Ouro/Vermelho: Fogo; Verde: Veneno; Prata/Branco: Frio). Você possui <strong>Resistência contínua</strong> ao elemento escolhido.
                    </li>
                    <li>
                        <strong>Arma de Sopro (Breath Weapon):</strong> Ao realizar a Ação Atacar (Attack action), você pode substituir <strong>um único ataque da sua rodada</strong> pela liberação de um sopro (Cone de 4,5m ou Linha de 9m × 1,5m). Inimigos na área devem fazer salvaguarda de DES ou CON (CD 8 + mod CON + PB). Em falha sofrem <strong>1d10</strong> de dano do seu elemento (2d10 no nv 5, 3d10 no nv 11, 4d10 no nv 17) ou metade no sucesso. Usos = PB por Descanso Longo!
                    </li>
                    <li>
                        <strong>Voo Dracônico (Draconic Flight - Nível 5+):</strong> Ao atingir o 5º nível, como Ação Bônus você projeta asas dracônicas cintilantes por 10 minutos (1x por Descanso Longo). Durante a transformação, seu <strong>Deslocamento de Voo</strong> é igual à sua velocidade de caminhada.
                    </li>
                </ul>
            </div>
        )
    },

    // 4. ELFO
    {
        id: 'phb_species_elf',
        title: 'Elfo (Elf)',
        category: 'Espécies de D&D (Cap. 4)',
        content: (
            <div>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <img
                        src="/assets/species/elf.jpeg"
                        alt="Elfo Oficial D&D 5.5e"
                        style={{ maxWidth: '100%', maxHeight: '420px', borderRadius: '8px', border: '1px solid #e11d48', objectFit: 'contain', boxShadow: '0 8px 24px rgba(0,0,0,0.6)' }}
                    />
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '8px' }}>
                        <em>Criaturas graciosas com elos profundos com a magia de Faerie, vida secular e sentidos ultra-aguçados.</em>
                    </p>
                </div>

                <div style={{ background: 'rgba(225, 29, 72, 0.08)', border: '1px solid #e11d48', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
                    <h3 style={{ color: '#f43f5e', margin: '0 0 8px 0' }}>Estatísticas Fundamentais</h3>
                    <p style={{ margin: 0, fontSize: '0.92rem', color: '#fecdd3', lineHeight: '1.6' }}>
                        <strong>Tipo de Criatura:</strong> Humanoide | <strong>Tamanho:</strong> Médio (1,50m–1,85m) | <strong>Deslocamento:</strong> 9 metros (10,5m para Elfo da Floresta).
                    </p>
                </div>

                <h3 style={{ color: '#c5a059', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>Traços Raciais Canônicos</h3>
                <ul style={{ lineHeight: '1.8' }}>
                    <li>
                        <strong>Visão no Escuro (18 metros / 36 metros para Drow):</strong> Enxerga na penumbra e escuridão com clareza extraordinária.
                    </li>
                    <li>
                        <strong>Sentidos Aguçados:</strong> Proficiência automática garantida na perícia <strong>Percepção</strong>.
                    </li>
                    <li>
                        <strong>Ancestralidade Feérica (Fey Ancestry):</strong> Você tem <strong>Vantagem em salvaguardas para evitar ou encerrar a condição Enfeitiçado</strong>. Magia não pode colocar você para dormir.
                    </li>
                    <li>
                        <strong>Transe (Trance):</strong> Você não precisa dormir. Pode concluir um <strong>Descanso Longo em apenas 4 horas</strong> meditando profundamente e mantendo plena consciência do ambiente.
                    </li>
                    <li>
                        <strong>Linhagens Élficas (Escolha 1 na criação):</strong>
                        <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                            <li><strong>Alto Elfo (High Elf):</strong> Conhece 1 truque de Mago à escolha (pode trocá-lo após cada descanso longo). No nível 3 aprende <em>Detecção de Magia (Detect Magic)</em> e no nível 5 aprende <em>Passo Nebuloso (Misty Step)</em>. Pode conjurar cada uma 1x/descanso longo sem gastar slots.</li>
                            <li><strong>Elfo da Floresta (Wood Elf):</strong> Seu Deslocamento aumenta permanentemente para <strong>10,5 metros</strong>. Conhece o truque <em>Artimanha (Druidcraft)</em>. No nível 3 aprende <em>Passadas Longas (Longstrider)</em> e no nível 5 aprende <em>Passos sem Pegadas (Pass without Trace)</em>.</li>
                            <li><strong>Drow (Elfo Negro):</strong> Sua Visão no Escuro é ampliada para <strong>36 metros (120 pés)</strong>. Conhece o truque <em>Globos de Luz (Dancing Lights)</em>. No nível 3 aprende <em>Fogo das Fadas (Faerie Fire)</em> e no nível 5 aprende <em>Escuridão (Darkness)</em>.</li>
                        </ul>
                    </li>
                </ul>
            </div>
        )
    },

    // 5. GNOMO
    {
        id: 'phb_species_gnome',
        title: 'Gnomo (Gnome)',
        category: 'Espécies de D&D (Cap. 4)',
        content: (
            <div>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <img
                        src="/assets/species/gnome.jpeg"
                        alt="Gnomo Oficial D&D 5.5e"
                        style={{ maxWidth: '100%', maxHeight: '420px', borderRadius: '8px', border: '1px solid #e11d48', objectFit: 'contain', boxShadow: '0 8px 24px rgba(0,0,0,0.6)' }}
                    />
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '8px' }}>
                        <em>Mentes brilhantes, inventores audaciosos e protegidos por uma muralha psíquica inquebrável contra magias.</em>
                    </p>
                </div>

                <div style={{ background: 'rgba(225, 29, 72, 0.08)', border: '1px solid #e11d48', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
                    <h3 style={{ color: '#f43f5e', margin: '0 0 8px 0' }}>Estatísticas Fundamentais</h3>
                    <p style={{ margin: 0, fontSize: '0.92rem', color: '#fecdd3', lineHeight: '1.6' }}>
                        <strong>Tipo de Criatura:</strong> Humanoide | <strong>Tamanho:</strong> Pequeno (0,90m–1,20m) | <strong>Deslocamento:</strong> 9 metros.
                    </p>
                </div>

                <h3 style={{ color: '#c5a059', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>Traços Raciais Canônicos</h3>
                <ul style={{ lineHeight: '1.8' }}>
                    <li>
                        <strong>Visão no Escuro (18 metros):</strong> Enxerga na penumbra e escuridão a até 18 metros.
                    </li>
                    <li>
                        <strong>Astúcia Gnômica (Gnomish Cunning - O Maior Poder Mental do Jogo):</strong> Você possui <strong>Vantagem em TODAS as salvaguardas de Inteligência, Sabedoria e Carisma</strong> contra qualquer efeito mágico ou sobrenatural!
                    </li>
                    <li>
                        <strong>Linhagens Gnômicas:</strong>
                        <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                            <li><strong>Gnomo da Floresta (Forest Gnome):</strong> Conhece o truque <em>Ilusão Menor (Minor Illusion)</em>. Pode conjurar a magia <em>Falar com Animais (Speak with Animals)</em> um número de vezes igual ao seu Bônus de Proficiência (PB) por Descanso Longo (ou gastando espaços de magia normais).</li>
                            <li><strong>Gnomo das Rochas (Rock Gnome):</strong> Conhece os truques <em>Consertar (Mending)</em> e <em>Prestidigitação (Prestidigitation)</em>. Gastando 10 minutos e 10 PO de sucata com ferramentas de artesão, pode construir engenhocas operacionais: Despertador Sonoro, Isqueiro Automático, Caixa de Música Arcana ou Animais de Corda mecânicos.</li>
                        </ul>
                    </li>
                </ul>
            </div>
        )
    },

    // 6. GOLIAS
    {
        id: 'phb_species_goliath',
        title: 'Golias (Goliath)',
        category: 'Espécies de D&D (Cap. 4)',
        content: (
            <div>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <img
                        src="/assets/species/goliath.jpeg"
                        alt="Golias Oficial D&D 5.5e"
                        style={{ maxWidth: '100%', maxHeight: '420px', borderRadius: '8px', border: '1px solid #e11d48', objectFit: 'contain', boxShadow: '0 8px 24px rgba(0,0,0,0.6)' }}
                    />
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '8px' }}>
                        <em>Titãs montanheses com sangue dos gigantes primordiais, passadas colossais e poder de aumentar de tamanho.</em>
                    </p>
                </div>

                <div style={{ background: 'rgba(225, 29, 72, 0.08)', border: '1px solid #e11d48', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
                    <h3 style={{ color: '#f43f5e', margin: '0 0 8px 0' }}>Estatísticas Fundamentais</h3>
                    <p style={{ margin: 0, fontSize: '0.92rem', color: '#fecdd3', lineHeight: '1.6' }}>
                        <strong>Tipo de Criatura:</strong> Humanoide | <strong>Tamanho:</strong> Médio (2,10m–2,45m) | <strong>Deslocamento:</strong> 10,5 metros!
                    </p>
                </div>

                <h3 style={{ color: '#c5a059', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>Traços Raciais Canônicos</h3>
                <ul style={{ lineHeight: '1.8' }}>
                    <li>
                        <strong>Constituição Poderosa (Little Giant):</strong> Você conta como uma categoria de tamanho maior para capacidade de carga, empurrar, arrastar ou levantar peso. Você também tem proficiência em <strong>Atletismo</strong>.
                    </li>
                    <li>
                        <strong>Ancestralidade Gigante (6 Linhagens Únicas - Usos = PB por Descanso Longo):</strong>
                        <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                            <li><strong>Gigante das Nuvens:</strong> Como Ação Bônus, teletransporte-se magicamente até 9 metros para um ponto desocupado visível.</li>
                            <li><strong>Gigante do Fogo:</strong> Ao acertar um ataque com arma ou golpe desarmado, cause <strong>+1d10 de dano de fogo</strong> adicional.</li>
                            <li><strong>Gigante do Gelo:</strong> Ao acertar um ataque com arma, cause <strong>+1d6 de dano de frio</strong> e reduza a velocidade do inimigo em 3 metros até o início do seu próximo turno.</li>
                            <li><strong>Gigante das Colinas:</strong> Ao acertar um ataque com arma corpo a corpo, derrube o inimigo <strong>Caído (Prone) automaticamente</strong> se o tamanho dele for Enorme ou menor!</li>
                            <li><strong>Gigante de Pedra:</strong> Como Reação ao sofrer dano, reduza o dano em <code>1d12 + mod de Constituição</code>.</li>
                            <li><strong>Gigante da Tempestade:</strong> Como Reação ao sofrer dano de uma criatura a até 18 metros, cause <strong>1d8 de choque elétrico</strong> nela.</li>
                        </ul>
                    </li>
                    <li>
                        <strong>Forma Agigantada (Large Form - Nível 5+):</strong> Como Ação Bônus, você amplia sua massa corporal e se torna de <strong>Tamanho Grande (Large)</strong> por 10 minutos (1x por Descanso Longo). Enquanto transformado, você tem <strong>Vantagem em testes de Força</strong> e seu deslocamento aumenta em <strong>+3 metros</strong>!
                    </li>
                </ul>
            </div>
        )
    },

    // 7. HUMANO
    {
        id: 'phb_species_human',
        title: 'Humano (Human)',
        category: 'Espécies de D&D (Cap. 4)',
        content: (
            <div>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <img
                        src="/assets/species/human.jpeg"
                        alt="Humano Oficial D&D 5.5e"
                        style={{ maxWidth: '100%', maxHeight: '420px', borderRadius: '8px', border: '1px solid #e11d48', objectFit: 'contain', boxShadow: '0 8px 24px rgba(0,0,0,0.6)' }}
                    />
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '8px' }}>
                        <em>Versáteis, determinados e dinâmicos. A força motriz que constrói civilizações com inspiração e talento incansáveis.</em>
                    </p>
                </div>

                <div style={{ background: 'rgba(225, 29, 72, 0.08)', border: '1px solid #e11d48', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
                    <h3 style={{ color: '#f43f5e', margin: '0 0 8px 0' }}>Estatísticas Fundamentais</h3>
                    <p style={{ margin: 0, fontSize: '0.92rem', color: '#fecdd3', lineHeight: '1.6' }}>
                        <strong>Tipo de Criatura:</strong> Humanoide | <strong>Tamanho:</strong> Médio (1,50m–1,95m) ou Pequeno (0,60m–1,20m) | <strong>Deslocamento:</strong> 9 metros.
                    </p>
                </div>

                <h3 style={{ color: '#c5a059', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>Traços Raciais Canônicos</h3>
                <ul style={{ lineHeight: '1.8' }}>
                    <li>
                        <strong>Desenvolvedor de Recursos (Resourceful - Inspiração Heroica Garantida):</strong> Sua ambição inabalável renova suas forças. Sempre que terminar um <strong>Descanso Longo</strong>, você ganha <strong>Inspiração Heroica</strong> se ainda não a possuir!
                    </li>
                    <li>
                        <strong>Hábil (Skillful):</strong> Você ganha proficiência em <strong>1 perícia adicional à sua livre escolha</strong>.
                    </li>
                    <li>
                        <strong>Versátil (Versatile - Talento de Origem Extra):</strong> Você recebe um <strong>Talento de Origem de 1º nível adicional</strong> à sua escolha (além do talento concedido pelo seu Antecedente!). Isso permite começar com combinações táticas devastadoras (ex: Alerta + Brigão de Taverna, ou Curandeiro + Iniciado em Magia).
                    </li>
                    <li>
                        <strong>Idiomas:</strong> Sabe falar, ler e escrever em Comum e mais um idioma adicional à sua escolha.
                    </li>
                </ul>
            </div>
        )
    },

    // 8. ORC
    {
        id: 'phb_species_orc',
        title: 'Orc',
        category: 'Espécies de D&D (Cap. 4)',
        content: (
            <div>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <img
                        src="/assets/species/orc.jpeg"
                        alt="Orc Oficial D&D 5.5e"
                        style={{ maxWidth: '100%', maxHeight: '420px', borderRadius: '8px', border: '1px solid #e11d48', objectFit: 'contain', boxShadow: '0 8px 24px rgba(0,0,0,0.6)' }}
                    />
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '8px' }}>
                        <em>Guerreiros valorosos abençoados com vitalidade indomável, arrancadas adrenérgicas e recusa em perecer.</em>
                    </p>
                </div>

                <div style={{ background: 'rgba(225, 29, 72, 0.08)', border: '1px solid #e11d48', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
                    <h3 style={{ color: '#f43f5e', margin: '0 0 8px 0' }}>Estatísticas Fundamentais</h3>
                    <p style={{ margin: 0, fontSize: '0.92rem', color: '#fecdd3', lineHeight: '1.6' }}>
                        <strong>Tipo de Criatura:</strong> Humanoide | <strong>Tamanho:</strong> Médio (1,80m–2,15m) | <strong>Deslocamento:</strong> 9 metros.
                    </p>
                </div>

                <h3 style={{ color: '#c5a059', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>Traços Raciais Canônicos</h3>
                <ul style={{ lineHeight: '1.8' }}>
                    <li>
                        <strong>Visão no Escuro Superior (36 metros / 120 pés):</strong> Enxerga na escuridão a até impressionantes 36 metros.
                    </li>
                    <li>
                        <strong>Investida Adrenérgica (Adrenaline Rush):</strong> Como Ação Bônus, você pode realizar a ação <strong>Disparada (Dash)</strong>. Sempre que usar esta ação bônus, você ganha <strong>Pontos de Vida Temporários iguais ao seu Bônus de Proficiência (PB)</strong>. Você pode usar esta habilidade PB vezes por Descanso Longo.
                    </li>
                    <li>
                        <strong>Resistência Implacável (Relentless Endurance):</strong> Quando for reduzido a 0 Pontos de Vida sem ser morto imediatamente, você cai para <strong>1 Ponto de Vida</strong> em vez de cair inconsciente (1 uso por Descanso Longo).
                    </li>
                </ul>
            </div>
        )
    },

    // 9. PEQUENINO / HALFLING
    {
        id: 'phb_species_halfling',
        title: 'Pequenino / Halfling',
        category: 'Espécies de D&D (Cap. 4)',
        content: (
            <div>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <img
                        src="/assets/species/halfling.jpeg"
                        alt="Halfling Oficial D&D 5.5e"
                        style={{ maxWidth: '100%', maxHeight: '420px', borderRadius: '8px', border: '1px solid #e11d48', objectFit: 'contain', boxShadow: '0 8px 24px rgba(0,0,0,0.6)' }}
                    />
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '8px' }}>
                        <em>Povo caloroso, afável e lendariamente afortunado, enfrentando dragões e horrores com coragem inabalável.</em>
                    </p>
                </div>

                <div style={{ background: 'rgba(225, 29, 72, 0.08)', border: '1px solid #e11d48', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
                    <h3 style={{ color: '#f43f5e', margin: '0 0 8px 0' }}>Estatísticas Fundamentais</h3>
                    <p style={{ margin: 0, fontSize: '0.92rem', color: '#fecdd3', lineHeight: '1.6' }}>
                        <strong>Tipo de Criatura:</strong> Humanoide | <strong>Tamanho:</strong> Pequeno (0,60m–0,90m) | <strong>Deslocamento:</strong> 9 metros (9 metros).
                    </p>
                </div>

                <h3 style={{ color: '#c5a059', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>Traços Raciais Canônicos</h3>
                <ul style={{ lineHeight: '1.8' }}>
                    <li>
                        <strong>Sorte Lendária (Lucky):</strong> Sempre que rolar um <strong>1 natural em um d20</strong> (jogada de ataque, teste de perícia ou salvaguarda), você pode <strong>rerolar o dado</strong> e utilizar obrigatoriamente o novo resultado!
                    </li>
                    <li>
                        <strong>Bravura (Brave):</strong> Você possui <strong>Vantagem em salvaguardas</strong> para evitar ou encerrar a condição <em>Amedrontado</em>.
                    </li>
                    <li>
                        <strong>Agilidade dos Pequeninos (Halfling Nimbleness):</strong> Você pode se mover livremente através do espaço ocupado por qualquer criatura de tamanho Médio ou maior.
                    </li>
                    <li>
                        <strong>Furtividade Natural (Naturally Stealthy):</strong> Você pode tentar a ação <strong>Esconder-se</strong> mesmo se estiver apenas sob a cobertura de uma criatura que seja de tamanho maior que o seu.
                    </li>
                </ul>
            </div>
        )
    },

    // 10. TIEFLING
    {
        id: 'phb_species_tiefling',
        title: 'Tiferino / Tiefling',
        category: 'Espécies de D&D (Cap. 4)',
        content: (
            <div>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <img
                        src="/assets/species/tiefling.jpeg"
                        alt="Tiefling Oficial D&D 5.5e"
                        style={{ maxWidth: '100%', maxHeight: '420px', borderRadius: '8px', border: '1px solid #e11d48', objectFit: 'contain', boxShadow: '0 8px 24px rgba(0,0,0,0.6)' }}
                    />
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '8px' }}>
                        <em>Mortais marcados pelo sangue e magia dos Planos Inferiores, empunhando poderes arcanos sombrios e chifres imponentes.</em>
                    </p>
                </div>

                <div style={{ background: 'rgba(225, 29, 72, 0.08)', border: '1px solid #e11d48', padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
                    <h3 style={{ color: '#f43f5e', margin: '0 0 8px 0' }}>Estatísticas Fundamentais</h3>
                    <p style={{ margin: 0, fontSize: '0.92rem', color: '#fecdd3', lineHeight: '1.6' }}>
                        <strong>Tipo de Criatura:</strong> Humanoide | <strong>Tamanho:</strong> Médio (1,50m–1,95m) ou Pequeno (0,60m–1,20m) | <strong>Deslocamento:</strong> 9 metros.
                    </p>
                </div>

                <h3 style={{ color: '#c5a059', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>Traços Raciais Canônicos</h3>
                <ul style={{ lineHeight: '1.8' }}>
                    <li>
                        <strong>Visão no Escuro (18 metros):</strong> Enxerga na penumbra e escuridão a até 18 metros.
                    </li>
                    <li>
                        <strong>Legados Infernais (3 Linhagens - Escolha Inteligência, Sabedoria ou Carisma como atributo de conjuração):</strong>
                        <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                            <li>
                                <strong>Legado Infernal (Os Nove Infernos / Diabos):</strong> Resistência a dano de <strong>Fogo</strong>. Conhece o truque <em>Taumaturgia (Thaumaturgy)</em>. No nível 3 aprende <em>Repreensão Infernal (Hellish Rebuke)</em> e no nível 5 aprende <em>Escuridão (Darkness)</em>.
                            </li>
                            <li>
                                <strong>Legado Abissal (O Abismo / Demônios):</strong> Resistência a dano de <strong>Veneno</strong>. Conhece o truque <em>Rajada de Veneno (Poison Spray)</em>. No nível 3 aprende <em>Raio de Doença (Ray of Sickness)</em> e no nível 5 aprende <em>Imobilizar Pessoa (Hold Person)</em>.
                            </li>
                            <li>
                                <strong>Legado Ctoniano (Hades & Carceri / Yugoloths):</strong> Resistência a dano <strong>Necrótico</strong>. Conhece o truque <em>Toque Arrepiante (Chill Touch)</em>. No nível 3 aprende <em>Vitalidade Falsa (False Life)</em> e no nível 5 aprende <em>Raio do Enfraquecimento (Ray of Enfeeblement)</em>.
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        )
    }
];
