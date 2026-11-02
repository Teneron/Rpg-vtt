---
phase: quick-261102-oo0
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/features/character/data/feats.ts
  - src/features/character/data/warlockInvocations.ts
  - src/features/character/data/progression.ts
  - src/features/character/characterTypes.ts
  - src/features/character/utils/levelUtils.ts
  - src/features/character/components/LevelUpModal.tsx
  - src/features/character/components/LevelUpModal.css
  - src/features/character/components/LevelDownModal.tsx
  - src/features/character/components/FeatsPanel.tsx
  - src/features/character/CharacterSheet.tsx
  - src/features/gm/GMScreen.tsx
  - src/features/multiplayer/SocketContext.tsx
  - server/server.js
  - src/features/character/data/progression.test.ts
autonomous: true
must_haves:
  truths:
    - "Subir para o Nível 4 (e demais níveis de ASI) permite escolher qualquer Talento (com +1 de atributo dos talentos gerais de D&D 5.5e e Salvaguarda em Resiliente) OU Aumento no Valor de Atributo (+2 em um atributo ou +1 em dois atributos) com seletores visuais completos e botão Avançar funcional"
    - "Tanto o Jogador quanto o Mestre podem abrir o modal Configurar Nível X na ficha, e o ganho de PV do LevelUpModal (incluindo bônus retroativo de Constituição e Vigoroso) é aceito pelo servidor e pelo Host mesmo quando pendingLevelUp já estava ativo no nível 4"
    - "Conjuradores no Nível 4 podem escolher novos Truques desbloqueados no nível e apenas círculos de magia realmente disponíveis pelos seus espaços de magia (ex.: Paladino/Guardião apenas 1º círculo no Nível 4)"
    - "Reduzir o nível (ex.: Nível 4 para Nível 3) pela Ficha ou pelo Escudo do Mestre reverte PV, atributos (ASI/+1 de talento), talentos, habilidades, espaços de magia e recursos de classe via snapshot automático (levelHistory) ou modal interativo LevelDownModal para fichas antigas"
    - "O catálogo de Talentos inclui todos os Talentos de Origem, Talentos Gerais (Nv 4+), Estilos de Luta e Dádivas Épicas (Nv 19+) do D&D 5.5e (2024), além das Invocações Místicas essenciais e descrições completas das habilidades de classe de nível 6 a 20"
---

<objective>
Corrigir integralmente a evolução de Nível 4+ (`LevelUpModal`), implementar reversão completa ao reduzir de nível (`LevelDownModal` + `levelHistory` em `CharacterSheet` e `GMScreen`), sincronizar o ganho/redução de PV e atributos no multiplayer (`server.js` e `SocketContext.tsx`), e completar o catálogo oficial de Talentos, Estilos de Luta, Dádivas Épicas, Invocações Místicas e descrições de habilidades de classe do D&D 5.5e (2024).
</objective>

<tasks>

<task type="auto">
  <name>Task 1: Catálogo completo de Talentos 5.5e, Invocações Místicas e Descrições de Progressão</name>
  <files>
    src/features/character/data/feats.ts,
    src/features/character/data/warlockInvocations.ts,
    src/features/character/data/progression.ts,
    src/features/character/characterTypes.ts
  </files>
  <action>
    1. Expandir `Feat` e `FEATS` em `feats.ts` com metadados de half-feat (`abilityBonusOptions`, `abilityBonusAmount`, `maxAttributeCap`, `grantsSaveProficiency`, `repeatable`) e incluir todos os ~40 Talentos Gerais de Nível 4+, 10 Estilos de Luta e 12 Dádivas Épicas (Nível 19+) do D&D 5.5e (2024) em português.
    2. Expandir `WARLOCK_INVOCATIONS` em `warlockInvocations.ts` com Lâmina Sedenta, Destruição Mística, Investidura do Mestre da Corrente, Dádiva dos Protetores, Sugador de Vida, Lâmina Devoradora, Visões de Reinos Distantes e Visão da Bruxa.
    3. Atualizar `getFeaturesForLevel` e `getClassResourcesForLevel` em `progression.ts` para puxar descrições e tipos de ação reais de `CLASS_FEATURE_DESCRIPTIONS` nos níveis 6–20 e remover recursos bloqueados quando o nível cai abaixo do requisito.
    4. Adicionar `LevelUpSnapshot` / `levelHistory` em `Character` (`characterTypes.ts`) e suportar efeitos mecânicos de novos talentos (`medium_armor_master`, `tavern_brawler`, `fighting_style_unarmed`, `speedy`, `boon_of_fortitude`) em `regenerateCharacterStats`.
  </action>
</task>

<task type="auto">
  <name>Task 2: Correção completa do LevelUpModal (Nível 4+, ASI, Half-Feats, Truques/Magias e CSS)</name>
  <files>
    src/features/character/components/LevelUpModal.tsx,
    src/features/character/components/LevelUpModal.css,
    src/features/character/components/FeatsPanel.tsx
  </files>
  <action>
    1. Corrigir seletores de Atributo no modo ASI (`+2` em um atributo ou `+1/+1` em dois atributos distintos) e a validação `isNextDisabled`.
    2. Adicionar filtros de categoria e busca de Talentos no passo 6, seletor de `+1 Atributo` elegível para Talentos Gerais / Dádivas Épicas, proficiência automática na salvaguarda escolhida em *Resiliente*, cálculo retroativo de PV ao aumentar Constituição ou escolher *Vigoroso* / *Dádiva da Fortitude*, e exibição completa na tela de Revisão (`finish`).
    3. Corrigir filtro de magias no passo 5 usando `getSpellSlotsForLevel` (círculo máximo real) e `getCantripsKnownCount` (permitindo aprender o novo Truque do Nível 4/10).
    4. Salvar snapshot em `character.levelHistory[newLevel]` ao concluir cada nível.
    5. Completar o CSS faltante em `LevelUpModal.css` e permitir gerenciar/adicionar/remover talentos na aba `FeatsPanel.tsx`.
  </action>
</task>

<task type="auto">
  <name>Task 3: Reversão completa de Nível (LevelDownModal) e Sincronização Servidor/Host</name>
  <files>
    src/features/character/utils/levelUtils.ts,
    src/features/character/components/LevelDownModal.tsx,
    src/features/character/CharacterSheet.tsx,
    src/features/gm/GMScreen.tsx,
    src/features/multiplayer/SocketContext.tsx,
    server/server.js,
    src/features/character/data/progression.test.ts
  </files>
  <action>
    1. Criar `levelUtils.ts` e `LevelDownModal.tsx` para reverter níveis de forma exata (via `levelHistory` quando disponível, ou assistida com ajuste de PV, remoção de talentos e reversão de ASI `-2` / `-1/-1` para fichas antigas sem histórico).
    2. Integrar `LevelDownModal` tanto em `CharacterSheet.tsx` quanto em `GMScreen.tsx`, liberar o botão `Configurar Nível X!` também para o Mestre, exibir sempre a aba `Talentos` na ficha e sincronizar tokens/combate/rede ao alterar nível.
    3. Atualizar `server/server.js` e `SocketContext.tsx` para aceitar o novo PV máximo/atual quando o jogador conclui `pendingLevelUp` (ex.: Nível 4 já definido pelo Mestre com `pendingLevelUp: true` -> `false`) ou gasta Dados de Vida em Descanso Curto.
    4. Adicionar testes automatizados em `progression.test.ts` validando catálogo de talentos, descrições de nível 6–20 e reversão de nível (`4 -> 3`).
  </action>
</task>

</tasks>
