# Quick Plan: 261013-s6a-producao-backup-ping-ux

## Objetivo
Implementar as 4 melhorias práticas para produção (1 Mestre + 5 Jogadores) identificadas na auditoria:
1. **Sistema de Backup JSON:** Exportação e Importação de Fichas de Personagem (`characterRepository.ts`, `CharacterSelection.tsx`, `CharacterSheet.tsx`) e Campanhas completas (`AdventureContext.tsx`, `ConnectionScreen.tsx`).
2. **Indicador Visual de Conexão no Header:** Estado detalhado em `SocketContext.tsx` (`connected`, `reconnecting`, `disconnected`) com reconexão manual (`reconnectNow`) e Badge animado em `App.tsx` com estilos CSS de pulso.
3. **Sistema de Ping no Mapa:** `MAP_PING` em `server/server.js` e `SocketContext.tsx`, disparo via `Alt + Clique` e botão na `MapToolbar.tsx` em `BattleMap.tsx`, e renderização sonar/radar no `EphemeralLayer.tsx` com etiqueta de jogador por 3.5s.
4. **Modo Tela Cheia & Recolhimento da Barra Lateral:** Botão Fullscreen no header e estado `isSidebarCollapsed` no `App.tsx` com botão flutuante para reabrir, liberando 100% de largura para o `BattleMap`.

## Tasks
- [x] Task 1: Sistema de Backup JSON de Personagens e Campanhas
  - [x] 1.1 `characterRepository.ts`: exportCharacter, importCharacter, downloadCharacterFile
  - [x] 1.2 `CharacterSelection.tsx`: botões de download e upload/importação (.json)
  - [x] 1.3 `CharacterSheet.tsx`: botões de download e upload/substituição (.json)
  - [x] 1.4 `AdventureContext.tsx`: exportCampaign, downloadCampaignBackup, importCampaign com transação Dexie
  - [x] 1.5 `ConnectionScreen.tsx`: botões de exportação e importação de campanha no painel do Mestre
- [x] Task 2: Indicador Visual de Conexão no Header
  - [x] 2.1 `SocketContext.tsx`: capturar ciclo completo de conexão/reconexão, expor `connectionState` e `reconnectNow`
  - [x] 2.2 `App.tsx` & `App.css`: componente `ConnectionBadge` com animação de pulso (verde/amarelo/vermelho)
- [x] Task 3: Sistema de Ping no Mapa
  - [x] 3.1 `server/server.js`: autorizar e carimbar tipo `MAP_PING`
  - [x] 3.2 `SocketContext.tsx` & `mapTypes.ts`: tipagem do `MAP_PING` e modo `'ping'`
  - [x] 3.3 `EphemeralLayer.tsx`: listeners de ping, loop de purga (3.5s), renderização SVG sonar com badge counter-scaled
  - [x] 3.4 `BattleMap.tsx` & `MapToolbar.tsx`: trigger com Alt+Clique e botão com ícone Radio
- [x] Task 4: Fullscreen API e Sidebar Retrátil
  - [x] 4.1 `App.tsx`: Fullscreen toggle no header e `isSidebarCollapsed`
  - [x] 4.2 `src/Layout.css`: estilo `.sidebar-panel.collapsed` e botão flutuante `.sidebar-floating-toggle`
- [x] Task 5: Verificação Completa e Testes
  - [x] Executar `npm test`
  - [x] Executar `npm run lint`
  - [x] Executar `npm run build`
