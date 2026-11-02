# Quick Summary: 261102-s8a-dados-3d-e-sincronizacao-hp

## O que foi realizado

### 1. Sistema de Dados 3D (`d10`, `d100`, `d4`, `d6` e sincronia com a Ficha)
- **`src/features/dice/PhysicsDie.tsx`:**
  - Substituído o placeholder `DodecahedronGeometry` (12 faces) em `createD10Geometry()` por um **Trapezoedro Pentagonal** planar real de 10 pipas (`1..10`, faces opostas somando `11`, normais e UVs exatas), eliminando definitivamente resultados `11` e `12` no `1d10`.
  - Corrigido o cálculo do centro de face em `extractFaceData` (`divideScalar(f.count)`) para centralizar a numeração em faces compostas (`d10` e `d12`).
  - Adicionado suporte nativo a `d100` com par físico `d100_tens` (`00..90`) + `d10` (`1..10`) gerando distribuição uniforme `1..100`.
  - Corrigida a leitura do `d4` pela face única apoiada na base (`minDot`) com numeração nos vértices apontando o topo.
  - Corrigida condição de corrida de carregamento de textura no `d6` (`BoxDie`).
- **`src/features/dice/DiceContext.tsx` & `src/features/character/components/CombatPanel.tsx`:**
  - Adicionado callback `onComplete` em `triggerRoll` e integrados `rollDeathSave` e `handleShortRest` para aplicar na ficha exatamente o valor rolado pelo dado 3D na tela.

### 2. Blindagem de Sincronização de Vida (PV) e Autoridade do Mestre
- **`server/server.js` & `src/features/multiplayer/SocketContext.tsx`:**
  - Bloqueada sobrescrita de `hp` por pacotes `PLAYER_UPDATE` ou reconexões (`join_room`) de jogadores não-Mestre (exceto Level Up ou `20` natural em Teste contra a Morte).
  - Adicionada reconciliação no Host (`reconcilePlayerCharacterOnHost`) que preserva edições locais mais recentes do Mestre (`CharacterRepository` / `last_gm_edit_`) e reenvia a ficha atualizada ao jogador reconectado.
- **`src/App.tsx` & `src/features/character/CharacterSheet.tsx`:**
  - Corrigido bug onde o Mestre abrir ficha de jogador pelo token do mapa disparava auto-sync como `myCharacter` do Mestre.
  - Sincronização síncrona de `characterRef`, fast-save de `150ms` para PV, flush imediato ao fechar no botão `X` (`handleCloseSheet`) e atualizações funcionais de PV sem closures obsoletas.
- **`src/features/gm/GMScreen.tsx`, `src/features/map/MapContext.tsx`, `src/features/map/BattleMap.tsx`, `src/features/map/TokenSettingsModal.tsx`, `src/features/combat/InitiativeTracker.tsx`, `src/features/monsters/EditableMonsterSheet.tsx`:**
  - Priorização da ficha com maior `lastModified`, absorção de PV Temporário em dano rápido, persistência local para jogadores offline na Iniciativa, broadcast de `MAP_UPDATE` (`update_token`) na atualização de PV e salvamento garantido ao fechar `EditableMonsterSheet`.

### 3. Imagem de Token para Monstros e NPCs
- **`src/utils/imageUtils.ts` (`compressTokenImage`):** Compressão automática WebP `512x512` preservando transparência.
- **`src/features/monsters/MonsterRepository.ts`:** Deduplicação por `id` permitindo customizar arte/atributos de monstros e NPCs oficiais (`5e` / `Witcher`) sem duplicar entradas.
- **`src/features/monsters/MonsterEditor.tsx`:** Seção de Imagem do Token com preview circular, upload local, URL e presets rápidos de categoria (`NPC` / `Monstro`).
- **`src/features/monsters/BestiarySidebar.tsx`:** Upload de imagem em 1 clique direto na miniatura do token de qualquer Monstro/NPC, edição liberada para todos e botão **"No Mapa"** para posicionar direto no grid.
- **`src/features/monsters/EditableMonsterSheet.tsx`:** Troca rápida de imagem do token (upload local ou URL) direto na ficha flutuante do tabuleiro.
- **`src/features/map/AddAssetModal.tsx` & `src/features/map/MapToolbar.tsx`:** Seletor de modo **"Token (Monstro / NPC)"** vs **"Asset / Cenário"** para criar tokens com imagem, PV, CA, cor de borda e iniciativa direto pela barra do mapa.
