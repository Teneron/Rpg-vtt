# Requirements: RPG Tabletop (VTT Modernization)

**Defined:** 2026-09-30
**Core Value:** Sincronização em tempo real fluida, responsiva e confiável entre Mestre e Jogadores em um ambiente VTT imersivo, sem limites de armazenamento local e sem dependência de serviços proprietários de banco de dados na nuvem.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Server & Realtime Backend (SRV)

- [x] **SRV-01**: Servidor Node.js leve e independente com HTTP e Socket.io, configurado para escutar em porta configurável (`PORT` / 3001) com CORS flexível (permitindo Vercel, Netlify e localhost).
- [x] **SRV-02**: Protocolo de salas em memória (`roomId`): criação de sala pelo Mestre e entrada de jogadores com validação de nome e presença.
- [x] **SRV-03**: Retransmissão em tempo real de mensagens de jogo no padrão `PeerMessage` (`MAP_UPDATE`, `PLAYER_UPDATE`, `ROLL_RESULT`, `CHAT_MESSAGE`, `COMBAT_UPDATE`, `COMBAT_ACTION`, `EPHEMERAL_GESTURE`, `AUDIO_UPDATE`, `SFX_TRIGGER`).
- [x] **SRV-04**: Tratamento de desconexão e presença com notificação imediata aos demais membros da sala quando um jogador ou mestre desconectar.

### Client Multiplayer & Firebase Removal (CLI)

- [x] **CLI-01**: Novo `SocketContext` no frontend conectando via `socket.io-client`, fornecendo uma interface de hook idêntica (`useMultiplayer`) para compatibilidade transparente com os componentes existentes.
- [x] **CLI-02**: Adaptação de `CombatContext`, `MapContext` e `SceneContext` para usar o barramento do `SocketContext` em vez de referências diretas ao Firebase Realtime Database.
- [x] **CLI-03**: Remoção completa dos pacotes `firebase` e `peerjs` do `package.json`, e exclusão dos arquivos `src/services/firebase.ts`, `src/utils/firebaseUtils.ts`, `firebase.json` e `cors.json`.

### Storage & IndexedDB Migration (STG)

- [ ] **STG-01**: Expansão do esquema do Dexie em `src/db/RPGDatabase.ts` para incluir tabelas de `characters`, `customMonsters` e `rollLogs`.
- [ ] **STG-02**: Refatoração do `CharacterRepository` e `MonsterRepository` para persistir dados no Dexie (IndexedDB), superando a limitação de 5MB do `localStorage`.
- [ ] **STG-03**: Rotina de migração automática e silenciosa na inicialização que transfere personagens e monstros já gravados no `localStorage` para o IndexedDB sem perda de dados.

### Performance & Bundle Optimization (OPT)

- [ ] **OPT-01**: Configuração de `manualChunks` no `vite.config.ts` para isolar Three.js e Cannon (`three`, `@react-three/fiber`, `@react-three/cannon`, `@react-three/drei`) em chunk próprio.
- [ ] **OPT-02**: Carregamento sob demanda (*code-splitting* / lazy loading) dos componentes 3D e modais pesados, garantindo carregamento inicial ultrarrápido.

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Cloud Sync & Advanced Multiplayer

- **SYNC-01**: Sincronização opcional com backend persistente (MongoDB ou PostgreSQL) para salas persistentes na nuvem.
- **SYNC-02**: Suporte a áudio/vídeo conferência integrada entre jogadores via WebRTC mesh.

## Out of Scope

| Feature | Reason |
|---------|--------|
| Autenticação complexa com senha e email | O foco do projeto é entrar na sala instantaneamente via código de convite sem atrito |
| Reescrever o motor de renderização do mapa ou física dos dados | O código existente do Three.js e Canvas raycasting 2D funciona de forma exemplar |
| Monetização / assinaturas | O projeto é de código aberto e uso pessoal/comunitário |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| SRV-01 | Phase 1 | Complete |
| SRV-02 | Phase 1 | Complete |
| SRV-03 | Phase 1 | Complete |
| SRV-04 | Phase 1 | Complete |
| CLI-01 | Phase 2 | Complete |
| CLI-02 | Phase 2 | Complete |
| CLI-03 | Phase 2 | Complete |
| STG-01 | Phase 3 | Pending |
| STG-02 | Phase 3 | Pending |
| STG-03 | Phase 3 | Pending |
| OPT-01 | Phase 4 | Pending |
| OPT-02 | Phase 4 | Pending |

**Coverage:**
- v1 requirements: 12 total
- Mapped to phases: 12
- Unmapped: 0 ✓

---
*Requirements defined: 2026-09-30*
*Last updated: 2026-09-30 after initial definition*
