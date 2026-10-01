---
phase: 02-integracao-multiplayer-do-cliente-remocao-do-firebase
plan: 01
subsystem: multiplayer
tags: [socket.io-client, cleanup, firebase-removal, peerjs-removal, react, vite]

requires:
  - phase: 01-servidor-socket-io-backend-realtime
    provides: Servidor Node.js com Socket.io e salas em memória
provides:
  - SocketContext com suporte total ao protocolo PeerMessage e API useMultiplayer
  - Desacoplamento dos contextos de combate, mapa e cenas de referências ao Firebase
  - Remoção de 86 pacotes do Firebase e PeerJS
  - Eliminação de firebase.json, cors.json e serviços legados
affects:
  - 03-persistencia-indexeddb-migracao-do-localstorage

actuals:
  tokens: 2200
  tasks: 3
  commits: 2

tech-stack:
  added: []
  removed:
    - firebase
    - peerjs
  patterns:
    - "SocketContext client wrapper with socket.io-client"
    - "Local IndexedDB (Dexie) persistence for maps and scenes with Socket broadcast"

key-files:
  created:
    - src/features/multiplayer/SocketContext.tsx
  modified:
    - src/features/multiplayer/FirebaseContext.tsx
    - src/features/combat/CombatContext.tsx
    - src/features/map/MapContext.tsx
    - src/features/map/SceneContext.tsx
    - src/features/map/MapSettingsModal.tsx
    - src/App.tsx
    - package.json
  deleted:
    - src/services/firebase.ts
    - src/utils/firebaseUtils.ts
    - firebase.json
    - cors.json

key-decisions:
  - "SocketContext fornece interface compatível para useMultiplayer e usePeer, permitindo substituição sem quebrar os 20+ componentes que a consomem"
  - "MapContext e SceneContext passam a usar Dexie como banco local primário e Socket.io para difusão entre mestre e jogadores, eliminando dependência do Firebase RTDB e Storage"
  - "Removidas 86 dependências de npm de uma vez com npm uninstall firebase peerjs"

requirements-completed:
  - CLI-01
  - CLI-02
  - CLI-03

coverage:
  - id: D1
    description: "SocketContext com socket.io-client implementado e funcional"
    requirement: "CLI-01"
    verification:
      - kind: integration
        ref: "npm run build"
        status: pass
  - id: D2
    description: "CombatContext, MapContext e SceneContext desacoplados do Firebase"
    requirement: "CLI-02"
    verification:
      - kind: integration
        ref: "npm run build"
        status: pass
  - id: D3
    description: "Remoção dos pacotes e arquivos legados do Firebase e PeerJS"
    requirement: "CLI-03"
    verification:
      - kind: integration
        ref: "npm run build"
        status: pass
---

# Summary: Phase 2 Plan 01 - Integração Multiplayer & Remoção do Firebase

## Accomplishments

1. **Implementação do SocketContext:**
   - Criado `src/features/multiplayer/SocketContext.tsx` utilizando `socket.io-client`.
   - Compatibilidade total com a interface `useMultiplayer` / `usePeer` e o protocolo `PeerMessage`.
   - Suporte dinâmico para URL do servidor via `VITE_SOCKET_SERVER_URL` ou detecção automática (localhost:3001 vs mesma origem).
   - Reexportação preservada em `FirebaseContext.tsx` para garantir retrocompatibilidade.

2. **Desacoplamento Completo dos Contextos:**
   - `CombatContext.tsx`: Removidos listeners e saves do Firebase RTDB; sincronização agora ocorre 100% via Socket.io.
   - `MapContext.tsx`: Removidas chamadas de banco do Firebase; o Dexie (IndexedDB) é o armazenamento local e as atualizações de mapa/tokens trafegam pelo Socket.io com suporte a `full_sync`.
   - `SceneContext.tsx`: Removidos listeners e gravações na nuvem do Firebase, mantendo Dexie como store persistente.
   - `MapSettingsModal.tsx`: Removido upload para Firebase Storage, utilizando compressão e persistência local direta.

3. **Remoção de Dependências e Arquivos do Firebase:**
   - Desinstalados os pacotes `firebase` e `peerjs` do `package.json` (86 pacotes removidos de `node_modules`).
   - Excluídos `src/services/firebase.ts`, `src/utils/firebaseUtils.ts`, `firebase.json` e `cors.json`.
   - Compilação validada com sucesso: `tsc -b && vite build` concluiu em ~8s com 0 erros.
