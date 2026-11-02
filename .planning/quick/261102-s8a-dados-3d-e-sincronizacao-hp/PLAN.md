# Quick Plan: 261102-s8a-dados-3d-e-sincronizacao-hp

## Objetivo
Corrigir definitivamente os problemas nos dados 3D (incluindo o `1d10` caindo `11`/`12`, `d100`, `d4`, `d6` e sincronia entre dado 3D e resultado mecânico), blindar a sincronização de Pontos de Vida (PV) entre Fichas, Tokens, Iniciativa, Painel GM e Servidor Socket.io para que alterações feitas pelo Mestre nunca revertam, e adicionar suporte completo a imagem de token para Monstros e NPCs.

## Escopo de Implementação

1. **Frente 1 — Geometria Real do `d10` e Precisão dos Dados 3D (`src/features/dice/PhysicsDie.tsx`, `src/features/dice/DiceContext.tsx`, `src/features/character/components/CombatPanel.tsx`):**
   - Substituir o proxy `DodecahedronGeometry` (12 faces) em `createD10Geometry()` por um **Trapezoedro Pentagonal** matemático real de 10 faces coplanares (faces numeradas estritamente de `1` a `10`, opostas somando `11`, com UVs e normais exatas).
   - Corrigir `extractFaceData` para dividir `center` por `f.count`, centralizando números em faces compostas (`d10` e `d12`).
   - Suportar `d100` real (`d100_tens` `00..90` + `d10` `1..10` somando uniformemente `1..100`).
   - Corrigir detecção de face do `d4` (tetraedro) lendo a face única apoiada na base (`minDot`) em vez do empate triplo das faces superiores, e corrigir recarga de textura na 1ª rolagem do `d6` (`BoxDie`).
   - Adicionar callback `onComplete` em `triggerRoll` (`DiceContext.tsx`) e unificar `rollDeathSave` e `handleShortRest` (`CombatPanel.tsx`) para aplicar na ficha exatamente o valor rolado pelo dado 3D físico.

2. **Frente 2 — Blindagem de Autoridade e Sincronização de Vida (`server/server.js`, `src/features/multiplayer/SocketContext.tsx`, `src/features/character/CharacterSheet.tsx`, `src/features/gm/GMScreen.tsx`, `src/features/map/MapContext.tsx`, `src/features/map/BattleMap.tsx`, `src/features/map/TokenSettingsModal.tsx`, `src/features/combat/InitiativeTracker.tsx`, `src/features/monsters/EditableMonsterSheet.tsx`, `src/App.tsx`):**
   - **Servidor & Host (`server/server.js`, `SocketContext.tsx`, `App.tsx`):** Impedir que `PLAYER_UPDATE` ou reconexão (`join_room` / auto-sync) vindos de jogadores sobrescrevam o `hp` autoritativo do Mestre (exceto em Level Up autorizado ou `20` natural em Teste de Morte), e reenviar ao jogador reconectado a ficha atualizada caso o Mestre tenha editado enquanto ele estava offline.
   - **Ficha (`CharacterSheet.tsx`):** Atualizar `characterRef.current` de forma síncrona, usar atualização funcional em `onUpdateHP`/`onUpdateMaxHP`, reduzir debounce de salvamento de PV para `150ms` e forçar flush imediato no clique em Fechar (`onExit`) e no `unmount`.
   - **Painel GM, Mapa & Iniciativa (`GMScreen.tsx`, `MapContext.tsx`, `BattleMap.tsx`, `TokenSettingsModal.tsx`, `InitiativeTracker.tsx`, `EditableMonsterSheet.tsx`):** Priorizar ficha com maior `lastModified` em `GMScreen`, gravar `last_gm_edit_<id>` e disparar `rpg_local_char_save` nos ajustes rápidos de PV do Painel GM e da Iniciativa (mesmo com jogador offline), transmitir `update_token` via `MAP_UPDATE` quando a ficha mudar PV, e salvar no fechamento do `EditableMonsterSheet`.

3. **Frente 3 — Imagem de Token para Monstros e NPCs (`src/features/monsters/MonsterEditor.tsx`, `src/features/monsters/BestiarySidebar.tsx`, `src/features/monsters/MonsterRepository.ts`, `src/features/monsters/EditableMonsterSheet.tsx`, `src/features/map/AddAssetModal.tsx`):**
   - Adicionar preview circular, upload local de imagem (compressão WebP 512x512) e campo de URL em `MonsterEditor.tsx` (Monstros e NPCs).
   - Permitir trocar rapidamente a imagem do token de qualquer monstro/NPC (inclusive oficiais 5e/Witcher, sem duplicar entradas em `MonsterRepository.getAll()`) direto pela `BestiarySidebar.tsx` + botão de 1 clique para enviar ao Mapa.
   - Permitir trocar a imagem do token de monstro/NPC já posicionado no tabuleiro direto pelo `EditableMonsterSheet.tsx`.
   - Adicionar modo **"Token de Monstro / NPC"** no modal `AddAssetModal.tsx` (barra do mapa) para criar tokens de NPC/Criatura com imagem, PV, CA e tamanho direto no mapa.

## Tasks
- [x] Task 1: Frente 1 — Geometria 3D real do `d10` e correções do sistema de dados
- [x] Task 2: Frente 2 — Blindagem de sincronização de PV (Servidor, Socket, Ficha, GM, Mapa e Iniciativa)
- [x] Task 3: Frente 3 — Upload/URL de imagem de token para Monstros e NPCs
- [x] Task 4: Verificação (`tsc -b`, `npm run build`), atualização de `STATE.md`/`SUMMARY.md`, commit e push ao GitHub
