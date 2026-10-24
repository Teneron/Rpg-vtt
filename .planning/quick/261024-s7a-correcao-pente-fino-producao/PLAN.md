# Quick Plan: 261024-s7a-correcao-pente-fino-producao

## Objetivo
Corrigir todas as falhas críticas, regressões, lacunas de persistência/backup e gargalos de produção (1 Mestre + 5 Jogadores) identificados na verificação pós-implementação (`verificacao_final.md`):

1. **Frente 1 — Servidor & Rede (`server/server.js`, `src/features/multiplayer/SocketContext.tsx`, `.env.example`, `vercel.json`):**
   - Proteger `isHost` contra sobrescrita do `db.maps` local por `gameState.map` defasado do servidor no `F5` / oscilação de rede, e aplicar deltas incrementais (`move`, `add`, `remove`, `update_token`, `add_wall`, `update_wall`, `remove_wall`, `config`) em `room.gameState.map` no servidor.
   - Re-emitir `rpg_host_reconnected` quando o Mestre reconectar para sincronizar mapa/combate com o servidor (ex.: após cold-start do Render).
   - Definir `isConnected = true` / `connectionState = 'connected'` **somente após** `join_room` confirmar `success: true`, eliminando sessão fantasma e badge "Online" falso.
   - Eliminar duplo disparo de `join_room` na conexão inicial (`pendingExplicitJoinRef`).
   - Persistir novo `hostToken` no `localStorage('rpg_session')` e enviar `system` no auto-rejoin; retry periódico de `join_room` para jogadores caso reconectem antes do Mestre em cold-start; `reconnectionAttempts: Infinity`; corrigir `reconnectNow()` quando o transporte já está conectado.
   - Espelhar fichas recebidas via `PLAYER_UPDATE` / `room_state` no `CharacterRepository` do Mestre (com `adventureId = activeRoomId`) para entrarem no Backup `.json`.
   - Servidor: cancelar timer órfão de 10 min (`room.cleanupTimer`) ao reentrar; podar sockets órfãos do mesmo `userId` antes de checar `maxMembersPerRoom`; remover envio duplicado de `room_state` junto ao `reply` em `join_room`; sanitizar coordenadas/cor/id de `MAP_PING`; remover barra final (`/`) em `ALLOWED_ORIGINS`; decaimento temporal em `rateState.violations`.

2. **Frente 2 — Persistência, Backup Completo, Cenas & Diário da História (`src/db/RPGDatabase.ts`, `src/features/adventure/AdventureContext.tsx`, `src/features/multiplayer/ConnectionScreen.tsx`, `src/features/map/SceneContext.tsx`, `src/features/gm/GMScreen.tsx`, `src/features/monsters/MonsterEditor.tsx`, `src/features/monsters/MonsterRepository.ts`, `src/features/monsters/BestiarySidebar.tsx`):**
   - Auto-restaurar `currentAdventure` em `AdventureContext` a partir de `currentAdventureId` após `F5` (restaurando salvamento de `rollLogs`).
   - Adicionar **Diário da Campanha / Notas da História** (`campaign.journal` + `campaign.description`) no `GMScreen.tsx` com salvamento automático (debounce) no Dexie e inclusão automática no Backup `.json`.
   - Persistir `activeSceneId` por campanha e sincronizar `SceneContext` sem sobrescrever `db.maps` após `F5`.
   - Salvar `campaignId` e `system` em `MonsterEditor.tsx`; exportar também monstros globais sem `campaignId` daquele sistema; recarregar caches em memória (`CharacterRepository.reloadFromDb()`, `MonsterRepository.reloadFromDb()`) ao importar/deletar campanha; limpar `db.rollLogs` no `deleteAdventure`.
   - Remapear `token.characterId` e `token.monsterId` em `maps` e `scenes` durante `importCampaign`, sempre gerando IDs seguros quando colidirem com outras campanhas, e gerar código de sala válido (`DND-XXXX` / `WTC-XXXX`) ao importar com conflito para que `ConnectionScreen` hospede a campanha importada perfeitamente.

3. **Frente 3 — Fichas, Combate & Chat (`src/features/character/characterTypes.ts`, `src/features/character/characterRepository.ts`, `src/features/character/CharacterSheet.tsx`, `src/features/character/CharacterSelection.tsx`, `src/features/character/components/BioPanel.tsx`, `src/features/combat/CombatContext.tsx`, `src/features/combat/InitiativeTracker.tsx`, `src/features/map/TokenSettingsModal.tsx`, `src/features/chat/ChatContext.tsx`):**
   - Corrigir regressão crítica de soma infinita em `speed` (`R4`) derivando o deslocamento base racial (`baseSpeed`) antes de somar `extraSpeed`.
   - Preservar `id`, `owner`, `adventureId` e validar `system`/estrutura em `handleSheetImport` (`CharacterSheet.tsx`) + fechar `showBuilder` e acionar `handleSave`; corrigir `lastModified` em `CharacterRepository.saveAsync`; adicionar campo de História/Backstory livre em `BioPanel.tsx`.
   - Sincronizar `CombatContext` com `PLAYER_UPDATE` / `rpg_local_char_save` para manter `c.hp` atualizado; persistir estado de combate no Dexie (`campaign.combatState`) para sobreviver ao encerramento da sessão/cold-start; preservar iniciativas já roladas em `startCombat`; validar propriedade/turno em `COMBAT_ACTION` + trava anti-duplo-clique em "Encerrar Meu Turno".
   - Corrigir leitura/escrita de `armorClass` / `acOverride` e `lastModified` em `TokenSettingsModal.tsx`, e disparo de `rpg_local_char_save` quando o Mestre salva ficha de jogador.
   - Corrigir `ChatContext.tsx`: permitir restauração das próprias mensagens no `F5` (via flag `fromHistory`, sem inflar `unreadCount`), corrigir `unreadCount` no batching do React 19 e persistir histórico recente na campanha.

4. **Frente 4 — Mapa, Ping Sonar, Névoa Explorada & UI (`src/features/map/EphemeralLayer.tsx`, `src/features/map/BattleMap.tsx`, `src/features/map/FogOfWarLayer.tsx`, `src/features/map/MapContext.tsx`, `src/features/map/MapSettingsModal.tsx`, `src/features/map/AddAssetModal.tsx`, `src/features/map/Token.tsx`, `src/utils/imageUtils.ts`, `src/App.tsx`, `src/Layout.css`):**
   - `MAP_PING`: usar relógio local `Date.now()` na recepção (eliminando bug de clock skew e DoS), sanitizar `x`/`y`/`color`, throttle de 400ms no disparo e limite de 15 pings simultâneos, `zIndex: 600` consistente (visível sobre tokens e névoa), timer `setInterval` sob demanda apenas quando houver traços/pings ativos, cursor `crosshair` sobre `Token` no modo `'ping'` e tecla `Esc` voltando para `'select'`.
   - Implementar **Memória de Névoa Explorada** em `FogOfWarLayer.tsx` (canvas offscreen persistido em `config.fogData` com debounce e botão para resetar névoa).
   - Debounce de 250ms na resposta `full_sync` a `SYNC_REQUEST` em `MapContext.tsx` (evitando tempestade $O(N^2)$ com 5 jogadores) + reenvio automático em `rpg_host_reconnected`.
   - Debounce em `MapSettingsModal.tsx` (evitando streaming de 180 MB/s no color picker) e limite seguro de tamanho (< 4 MB) em vídeos/props Base64 (`MapSettingsModal.tsx`, `AddAssetModal.tsx`, `imageUtils.ts`) para nunca estourar `maxHttpBufferSize`.
   - UI/Ergonomia: reposicionar botões de Zoom em `BattleMap.tsx` acima do botão do Chat (`bottom: 92px`), expandir sidebar recolhida ao clicar em `Ficha` no `App.tsx`, fallback `webkitFullscreen`, responsividade do `.app-header` em notebooks `1280px–1366px`, e abrir ficha offline via Dexie no `App.tsx`.

## Tasks
- [x] Task 1: Frente 1 — Servidor, Reconexão, Autoridade e Hardening de Rede
- [x] Task 2: Frente 2 — Persistência, Backup Completo, Cenas e Diário da Campanha
- [x] Task 3: Frente 3 — Fichas (R4/Import/Bio), Combate Persistente, PV/CA e Chat
- [x] Task 4: Frente 4 — Ping Sonar, Névoa Explorada, Anti-Storm de Mapa e Layout/UI
- [x] Task 5: Verificação Integrada (`npx tsc -b`, `npm test`, `npm run lint`, `npm run build`) e Commit
