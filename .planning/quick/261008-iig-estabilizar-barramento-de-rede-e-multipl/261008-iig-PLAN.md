# Quick Plan: Estabilizar Barramento de Rede e Multiplayer

**ID:** `261008-iig`
**Slug:** `estabilizar-barramento-de-rede-e-multipl`
**Data:** 2026-10-08

## Objetivo
Estabilizar o barramento de rede e multiplayer do RPG Tabletop (Base Engine), corrigindo a sincronização de dados 3D/rolagens, sincronização de fichas de personagens editadas pelo Mestre, reconexão transparente do Socket.io, recuperação de sessão ativa após reload e configuração de URL do servidor para LAN/Deploy.

## Tarefas

### Tarefa 1: Estabilizar Barramento de Eventos e Ciclo de Vida em `SocketContext.tsx`
- **Arquivos:** `src/features/multiplayer/SocketContext.tsx`
- **Ações:**
  1. Escutar evento `rpg_broadcast_roll` no `window` e disparar `broadcast({ type: 'ROLL_RESULT', payload: { playerName, roll } })`.
  2. Corrigir lógica de `PLAYER_UPDATE` em `peer_message`: atualizar `connectedPlayersData` para todos os pares e atualizar `myCharacter` quando o alvo for o jogador (`peerId === myId` ou ID do personagem correspondente).
  3. Adicionar lógica de reconexão automática: no evento `connect` do socket, re-emitir `join_room` com credenciais salvas se houver sessão ativa.
  4. Tratar `room_state.gameState` no `join_room` e no evento `room_state`: despachar `MAP_UPDATE (full_sync)`, `COMBAT_UPDATE` e `CHAT_MESSAGE` para sincronizar novos jogadores com o estado atual da mesa.
  5. Adicionar recuperação de sessão no mount a partir de `rpg_session` no `localStorage`.
  6. Limpar `rpg_session` no `localStorage` ao chamar `disconnect()`.

### Tarefa 2: Configuração de Servidor no `ConnectionScreen.tsx` e Suporte a Reload no `App.tsx`
- **Arquivos:** `src/features/multiplayer/ConnectionScreen.tsx`, `src/App.tsx`
- **Ações:**
  1. Adicionar componente retrátil/modal de configuração de Servidor (`serverUrl` / `setServerUrl`) no `ConnectionScreen.tsx`, permitindo alterar a URL do servidor (ex: LAN `http://192.168.x.x:3001` ou cloud `https://...`) e salvar no `localStorage`.
  2. Em `App.tsx`, garantir que a transição de visualização (`viewMode`) respeite sessões restauradas e reconexões ativas.

### Tarefa 3: Testes de Integração e Verificação de Build
- **Arquivos:** `server/test-client.js`
- **Ações:**
  1. Ampliar testes do servidor para cobrir:
     - Revezamento de rolagens (`ROLL_RESULT`)
     - Atualização remota de fichas (`PLAYER_UPDATE`)
     - Entrega de `gameState` inicial para novos membros
     - Reconexão e re-ingresso em sala
  2. Executar `npm run test:server` e `npm run test:storage`.
  3. Executar `npm run build` (`tsc -b && vite build`) garantindo 0 erros de compilação TypeScript.
