# RPG Tabletop (VTT Modernization)

## What This Is

Virtual Tabletop (VTT) completo para RPG de mesa web focado em D&D 5e e The Witcher TTRPG, com dados 3D físicos, névoa de guerra dinâmica via raycasting 2D, combate em turnos e som imersivo. Esta iniciativa visa modernizar a arquitetura da aplicação: substituindo o Firebase por um backend leve em Node.js com Socket.io (permitindo hospedagem gratuita do frontend na Vercel/Netlify e servidor no Render/local), eliminando o limite de 5MB do LocalStorage através da migração para IndexedDB (Dexie), e otimizando o carregamento inicial via code-splitting.

## Core Value

Sincronização em tempo real fluida, responsiva e confiável entre Mestre e Jogadores em um ambiente VTT imersivo, sem limites de armazenamento local e sem dependência de serviços proprietários de banco de dados na nuvem.

## Requirements

### Validated

- ✓ Rolagem de dados 3D com física realista (@react-three/cannon) — existing
- ✓ Grid tático interativo com pan, zoom e posicionamento de tokens — existing
- ✓ Iluminação dinâmica e névoa de guerra com raycasting 2D (`LightingSystem`) — existing
- ✓ Ficha de personagem interativa para D&D 5e e The Witcher — existing
- ✓ Rastreador de iniciativa e combate em turnos — existing
- ✓ Bestiário com dezenas de criaturas e spawn de tokens — existing
- ✓ Soundboard e player de música ambiente integrados — existing
- ✓ Livros de regras embutidos (Player e Mestre) — existing
- ✓ Banco de dados local inicial com Dexie (`RPGDatabase`) — existing

### Active

- [ ] Servidor de WebSockets independente (Node.js + Socket.io) com gerenciamento de salas, mestre/jogadores e encaminhamento de eventos em tempo real
- [ ] Substituição do `FirebaseContext` por `SocketContext` (ou cliente `socket.io-client`), mantendo a compatibilidade com a interface existente
- [ ] Remoção completa das dependências e arquivos de configuração do Firebase (`firebase.json`, `cors.json`, scripts e pacotes) e limpeza de restos legados (`peerjs`)
- [ ] Migração do armazenamento de personagens, monstros customizados e históricos do `localStorage` para o IndexedDB via Dexie (`RPGDatabase.ts`), com rotina de importação transparente de dados preexistentes
- [ ] Otimização de performance no Vite: divisão de chunks (`manualChunks`) e lazy loading para Three.js/Cannon, reduzindo o bundle inicial de 2.4MB

### Out of Scope

- Autenticação complexa com banco de dados SQL na nuvem — manter acesso leve e imediato via apelido e código de sala
- Reescrever o motor de renderização do mapa ou o sistema de física dos dados — manter o que já está funcionando perfeitamente
- Monetização ou cobranças integradas

## Context

- Brownfield codebase com React 19, TypeScript e Vite.
- O projeto dependia do Firebase Realtime Database para multiplayer e hosting, mas precisa ser desacoplado para operar com autonomia e poder ser hospedado gratuitamente na Vercel/Netlify com servidor Socket.io no Render ou localmente.
- O navegador impõe limite rígido de ~5MB no `localStorage`, o que gerava risco de estouro de cota com avatares e fichas detalhadas; a migração para IndexedDB (Dexie) remove esse gargalo.
- O bundle JavaScript atual compila em um único arquivo de ~2.4MB devido à inclusão do Three.js e Cannon na carga inicial.

## Constraints

- **Tecnologia de Rede**: Node.js + Socket.io para comunicação em tempo real bidirecional
- **Armazenamento**: IndexedDB via Dexie como persistência local primária
- **Compatibilidade**: Navegadores modernos com suporte a WebGL, WebSockets e IndexedDB
- **Segurança de Dados**: Migração retrocompatível (não perder personagens criados anteriormente no `localStorage`)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Node.js + Socket.io para tempo real | Elimina custos de banco proprietário (Firebase), garante soberania total e roda local ou nuvem | — Pending |
| Frontend estático separado do backend de sockets | Permite deploy gratuito na Vercel/Netlify com CDN global e backend contínuo no Render ou local | — Pending |
| IndexedDB (Dexie) unificado | Substitui o `localStorage` (5MB) para personagens e monstros, eliminando risco de QuotaExceededError | — Pending |
| Code-splitting do Three.js / Cannon no Vite | Reduz o bundle inicial de 2.4MB e acelera o carregamento em redes móveis/lentas | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-09-30 after initialization*
