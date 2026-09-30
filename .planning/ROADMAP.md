# Roadmap: RPG Tabletop (VTT Modernization)

## Overview

Modernização da infraestrutura do VTT para eliminar a dependência do Firebase, garantir armazenamento ilimitado no navegador através do IndexedDB e otimizar o desempenho do carregamento do frontend para hospedagem gratuita na Vercel/Netlify.

## Phases

- [ ] **Phase 1: Servidor Socket.io & Backend Realtime** - Servidor Node.js leve para gerenciamento de salas e troca de mensagens.
- [ ] **Phase 2: Integração Multiplayer do Cliente & Remoção do Firebase** - Adaptação do frontend ao Socket.io e eliminação do Firebase/PeerJS.
- [ ] **Phase 3: Persistência IndexedDB & Migração do LocalStorage** - Eliminação do teto de 5MB migrando fichas e monstros para o Dexie com importação automática.
- [ ] **Phase 4: Otimização de Performance e Code-Splitting** - Divisão de chunks no Vite para isolar Three.js/física e acelerar o carregamento.

## Phase Details

### Phase 1: Servidor Socket.io & Backend Realtime
**Goal**: Construir um servidor independente em Node.js com Socket.io para gerenciar salas em memória e transmitir mensagens de jogo em tempo real.
**Mode**: mvp
**Depends on**: Nothing (primeira fase)
**Requirements**: SRV-01, SRV-02, SRV-03, SRV-04
**Success Criteria** (what must be TRUE):
  1. Servidor Node.js inicia na porta configurada com suporte a CORS flexível (Vercel, Netlify, localhost).
  2. Mestre consegue registrar sala e jogadores conseguem se conectar usando o código da sala.
  3. Mensagens do protocolo `PeerMessage` são retransmitidas instantaneamente para todos os membros da sala.
  4. Desconexões de clientes são detectadas e notificadas para manter a lista de presença atualizada.
**Plans**: 1 plan

Plans:
- [ ] 01-01: Implementar servidor Node.js com Socket.io, handlers de sala e protocolo de eventos.

### Phase 2: Integração Multiplayer do Cliente & Remoção do Firebase
**Goal**: Conectar o frontend ao novo servidor Socket.io via `useMultiplayer`, adaptar contextos e desinstalar completamente pacotes e arquivos do Firebase.
**Mode**: mvp
**Depends on**: Phase 1
**Requirements**: CLI-01, CLI-02, CLI-03
**Success Criteria** (what must be TRUE):
  1. Jogador e Mestre conseguem criar e entrar em partidas via Socket.io com sincronização de tokens, combate, chat e dados 3D.
  2. Nenhuma menção a Firebase ou PeerJS permanece no código fonte (`src/`).
  3. `package.json` sem as dependências `firebase` e `peerjs`, com build (`npm run build`) passando com sucesso.
**Plans**: 1 plan

Plans:
- [ ] 02-01: Criar SocketContext, migrar chamadas de contexto e remover arquivos/dependências do Firebase.

### Phase 3: Persistência IndexedDB & Migração do LocalStorage
**Goal**: Migrar personagens, monstros customizados e históricos do `localStorage` para o IndexedDB (Dexie), com rotina de migração transparente.
**Mode**: mvp
**Depends on**: Phase 2
**Requirements**: STG-01, STG-02, STG-03
**Success Criteria** (what must be TRUE):
  1. Fichas de personagens e monstros novos são salvos diretamente no Dexie sem limite de 5MB.
  2. Personagens preexistentes no `localStorage` são automaticamente importados para o Dexie na inicialização.
  3. Edição, listagem e exclusão de fichas no IndexedDB funcionam sem erros.
**Plans**: 1 plan

Plans:
- [ ] 03-01: Expandir schema do RPGDatabase e refatorar repositórios com auto-migração de dados.

### Phase 4: Otimização de Performance e Code-Splitting
**Goal**: Otimizar a configuração do Vite e aplicar carregamento sob demanda para bibliotecas pesadas de 3D e física.
**Mode**: mvp
**Depends on**: Phase 3
**Requirements**: OPT-01, OPT-02
**Success Criteria** (what must be TRUE):
  1. `vite build` separa Three.js, React Three Fiber e Cannon em chunk vendor dedicado.
  2. O bundle inicial da aplicação tem tamanho substancialmente reduzido (abaixo de 500kB para o código de aplicação).
**Plans**: 1 plan

Plans:
- [ ] 04-01: Configurar manualChunks no Vite e lazy loading de componentes pesados.

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Servidor Socket.io & Backend Realtime | 0/1 | Not started | - |
| 2. Integração Multiplayer & Remoção Firebase | 0/1 | Not started | - |
| 3. Persistência IndexedDB & Migração LocalStorage | 0/1 | Not started | - |
| 4. Otimização de Performance e Code-Splitting | 0/1 | Not started | - |
