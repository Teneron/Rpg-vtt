---
status: complete
---

# Quick Summary: 261024-s7a-correcao-pente-fino-producao

## Resultado da Execução
Executada a revisão e correção pente-fino completa em 4 frentes coordenadas para garantir estabilidade, integridade de dados e prontidão de produção (1 Mestre + 5 Jogadores).

### 1. Servidor & Rede (`server/server.js`, `SocketContext.tsx`, `.env.example`, `vercel.json`)
- **Proteção de Estado no `F5` / Oscilação:** O Mestre não aplica `gameState.map` defasado vindo do servidor por cima do seu `db.maps` local, e o servidor passa a aplicar todos os deltas incrementais (`config`, `move`, `add`, `remove`, `update_token`, `add_wall`, `update_wall`, `remove_wall`) diretamente em `room.gameState.map`, além de cachear `AUDIO_UPDATE` e unicastear `SYNC_REQUEST` exclusivamente para o Mestre.
- **Ciclo de Conexão Fiel (`ConnectionBadge`):** `isConnected` e `connectionState = 'connected'` só ativam após ACK positivo de `join_room`; eliminado o duplo disparo de `join_room` (`pendingExplicitJoinRef`); `reconnectNow()` reentra na sala quando o socket já está conectado; `reconnectionAttempts: Infinity` com `['polling', 'websocket']` e retry automático de 3s para jogadores em cold-start do Render; persistência de `hostToken` rotacionado e `system` no auto-rejoin; re-broadcast automático via `rpg_host_reconnected`.
- **Espelhamento de Fichas no Mestre:** Fichas dos jogadores conectadas/atualizadas na sala são espelhadas no `CharacterRepository` do Mestre (com `adventureId`), garantindo que entrem no Backup `.json` da campanha e possam ser inspecionadas mesmo offline.
- **Hardening Adicional:** Sanitização estrita de `MAP_PING` (coordenadas finitas, cor hex, carimbo de identidade), cancelamento de `room.cleanupTimer` órfão, poda de sockets antigos antes do limite de lotação com proteção `S5`, preservação de `character` quando o jogador dá `F5`, normalização de barra final em `ALLOWED_ORIGINS` e decaimento temporal no rate-limiter.

### 2. Persistência, Backup Completo, Cenas & Diário da História (`RPGDatabase.ts`, `AdventureContext.tsx`, `ConnectionScreen.tsx`, `SceneContext.tsx`, `GMScreen.tsx`, `Monster*`)
- **Diário da Campanha & História (`GMScreen.tsx`):** Adicionada seção dedicada de Premissa (`description`) e **Diário da História, Quests, NPCs & Sessões** (`journal`) com auto-save em debounce no Dexie e inclusão nativa no Backup `.json`.
- **Backup `.json` Integral e Remapeamento de Chaves:** `exportCampaign` / `importCampaign` agora incluem `assets` (convertendo `Blob` <-> Base64), `rollLogs`, fichas espelhadas e monstros customizados; geram códigos de sala válidos (`DND-XXXX` / `WTC-XXXX`) em colisões para hospedagem imediata no `ConnectionScreen`; remapeiam `token.characterId` e `token.monsterId` em todos os mapas/cenas/combates; e recarregam os caches em memória (`reloadFromDb`) sem exigir `F5`.
- **Restauração Pós-`F5`:** `AdventureContext` auto-restaura `currentAdventure` via `rpg_session` (preservando gravação de `rollLogs`), e `SceneContext` persiste `activeSceneId` por campanha sem sobrescrever `db.maps` nem perder `thumbnail`.

### 3. Fichas, Combate & Chat (`characterTypes.ts`, `characterRepository.ts`, `CharacterSheet.tsx`, `CharacterSelection.tsx`, `BioPanel.tsx`, `CombatContext.tsx`, `InitiativeTracker.tsx`, `TokenSettingsModal.tsx`, `ChatContext.tsx`)
- **Correção da Regressão `R4` (`speed`):** Deslocamento calculado sobre `baseSpeed` racial determinístico em vez de acumular `+3m` infinitamente sobre `char.speed`.
- **Importação Segura & Bio:** `handleSheetImport` preserva `id`, `owner` e `adventureId`, fecha `showBuilder` e dispara `handleSave`; `saveAsync` preserva `lastModified` atualizado; comparação de `owner` tolerante a maiúsculas/espaços; adicionado campo livre de **História & Diário do Personagem** em `BioPanel.tsx`.
- **Combate Persistente & Sincronia de PV/CA:** Estado do `CombatContext` persistido em `campaign.combatState` no Dexie; `startCombat` preserva iniciativas já roladas; `CombatContext` e `InitiativeTracker` sincronizam PV/CA ao vivo com `PLAYER_UPDATE` e `rpg_local_char_save`; `TokenSettingsModal` lê/grava `armorClass`/`acOverride` corretamente sem resetar CA para `10`; `COMBAT_ACTION` valida autoria/turno ativo e bloqueia duplo-clique em "Encerrar Meu Turno".
- **Chat Resiliente (`ChatContext.tsx`):** Mensagens próprias são restauradas no `F5` (`fromHistory: true`) sem inflar `unreadCount`, corrigido batching do React 19 via `seenIdsRef`, e histórico recente salvo na campanha no Dexie.

### 4. Mapa, Ping Sonar, Névoa Explorada & UI (`EphemeralLayer.tsx`, `BattleMap.tsx`, `FogOfWarLayer.tsx`, `MapContext.tsx`, `MapToolbar.tsx`, `MapSettingsModal.tsx`, `AddAssetModal.tsx`, `Token.tsx`, `imageUtils.ts`, `App.tsx`, `Layout.css`)
- **Ping Sonar:** Timestamp carimbado com o relógio local na recepção (eliminando sumiço por clock skew e pings eternos), throttle de 400ms, `zIndex: 600` consistente acima de tokens e névoa, intervalo ocioso desligado quando vazio, cursor `crosshair` sobre tokens e tecla `Esc` retornando para seleção.
- **Memória de Névoa Explorada:** Máscara offscreen persistida em `config.fogData` exibindo terreno já visitado em penumbra enquanto oculta tokens inimigos fora da visão atual para jogadores, com botão de reset para o Mestre.
- **Anti-Storm & Limite de Pacotes:** Coalescência/debounce de 250ms em `SYNC_REQUEST` no `MapContext`, debounce de 200ms no `MapSettingsModal` (evitando flood no seletor de cor da grade) e compressão WebP 1024px / limite de 4,5 MB para vídeos locais.
- **Ergonomia de Tela:** Botões de Zoom elevados acima do botão do Chat (`bottom: 92px`), aba `Ficha` reabrindo sidebar recolhida, inspeção offline de fichas pelo Mestre, fallback `webkitFullscreen` e header responsivo para telas `1280px–1440px`.
