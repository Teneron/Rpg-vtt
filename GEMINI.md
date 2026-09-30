<!-- GSD:project-start source:PROJECT.md -->

## Project

**RPG Tabletop (VTT Modernization)**

Virtual Tabletop (VTT) completo para RPG de mesa web focado em D&D 5e e The Witcher TTRPG, com dados 3D físicos, névoa de guerra dinâmica via raycasting 2D, combate em turnos e som imersivo. Esta iniciativa visa modernizar a arquitetura da aplicação: substituindo o Firebase por um backend leve em Node.js com Socket.io (permitindo hospedagem gratuita do frontend na Vercel/Netlify e servidor no Render/local), eliminando o limite de 5MB do LocalStorage através da migração para IndexedDB (Dexie), e otimizando o carregamento inicial via code-splitting.

**Core Value:** Sincronização em tempo real fluida, responsiva e confiável entre Mestre e Jogadores em um ambiente VTT imersivo, sem limites de armazenamento local e sem dependência de serviços proprietários de banco de dados na nuvem.

### Constraints

- **Tecnologia de Rede**: Node.js + Socket.io para comunicação em tempo real bidirecional
- **Armazenamento**: IndexedDB via Dexie como persistência local primária
- **Compatibilidade**: Navegadores modernos com suporte a WebGL, WebSockets e IndexedDB
- **Segurança de Dados**: Migração retrocompatível (não perder personagens criados anteriormente no `localStorage`)

<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->

## Technology Stack

## Languages

- TypeScript ~5.9.3 - Core application logic, React components, state contexts, physics simulations, and data models across `src/`
- TSX (React JSX) - Component rendering and template syntax in all UI modules
- JavaScript (ES2020 / ES Modules) - Tooling configurations (`eslint.config.js`, `.agents/gsd-core/bin/gsd-tools.cjs`)
- CSS3 (Vanilla CSS with CSS Custom Properties) - Styling across `src/index.css`, `src/styles/theme.css`, and feature-specific component stylesheets
- HTML5 - Base markup structure and entry point in `index.html`
- PowerShell - Token image automation utility script (`process_token_v14.ps1`)

## Runtime

- Browser: Modern evergreen browsers (Chrome, Edge, Firefox, Safari) supporting WebGL2, Web Audio API, Canvas 2D, IndexedDB, and ES2022+ features
- Development/Build: Node.js (v20+ / v24+ verified during inspection)
- npm
- Lockfile: `package-lock.json` present (npm v10+ lockfileVersion 3)

## Frameworks

- React 19.2.0 (`react`, `react-dom`) - Client-side UI component tree, hook lifecycle, and context-based state management
- Vite 7.2.4 (`vite`, `@vitejs/plugin-react`) - Development server with Hot Module Replacement (HMR) and production bundling via Rollup/ESBuild
- Three.js 0.182.0 (`three`, `@types/three`) - 3D scene rendering, lighting, materials, and geometries
- @react-three/fiber 9.4.2 - Declarative React wrapper for Three.js render pipeline
- @react-three/drei 10.7.7 - Helpers and abstractions for Three.js scene environments
- @react-three/cannon 6.6.0 - Real-time rigid-body physics engine for 3D dice rolls in `src/features/dice/DiceScene.tsx`
- react-player 3.4.0 - Embedded stream playback component in `src/features/audio/`
- Web Audio API (Native browser) - Low-latency positional and soundboard effects in `src/features/audio/AudioContext.tsx`
- None detected - No test runner (`vitest`, `jest`, `playwright`) configured in `package.json`
- TypeScript compiler (`tsc -b`) - Type checking and build orchestration in `package.json`
- ESLint 9.39.1 (`eslint`, `@eslint/js`, `typescript-eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`) - Static code analysis and linting

## Key Dependencies

- `firebase` (v12.7.0) - Realtime Database (`firebase/database`) and Cloud Storage (`firebase/storage`) for live multiplayer synchronization and media hosting in `src/features/multiplayer/FirebaseContext.tsx`
- `dexie` (v4.2.1) & `dexie-react-hooks` (v4.2.0) - IndexedDB client wrapper for persistent local campaign scenes, maps, walls, and asset storage in `src/db/RPGDatabase.ts`
- `lucide-react` (v0.562.0) - Icon library utilized across headers, toolbar controls, character panels, and GM screen
- `peerjs` (v1.5.5) - Previously used WebRTC P2P mesh library; listed in `package.json` dependencies but superseded by Firebase Realtime Database in active runtime paths

## Configuration

- Local storage and IndexedDB keys:
- Firebase configuration defined in `src/services/firebase.ts` (API key, auth domain, database URL, project ID, storage bucket)
- CORS settings for Firebase Storage / assets defined in `cors.json`
- `vite.config.ts`:
- `tsconfig.json` & `tsconfig.app.json`:
- `eslint.config.js`:
- `firebase.json`:

## Platform Requirements

- Node.js 18+ (Node.js 20 or 24 recommended)
- Modern web browser with WebGL2 and Web Audio support
- PowerShell (for image processing script `process_token_v14.ps1`)
- Firebase Hosting (configured in `firebase.json`) or static web server serving the `dist/` directory
- Firebase Realtime Database and Firebase Storage backend instances

<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->

## Conventions

## Naming Patterns

- Use PascalCase for React component files: `CharacterSheet.tsx`, `BattleMap.tsx`, `InitiativeTracker.tsx`
- Use camelCase for TypeScript modules, utilities, and repositories: `characterRepository.ts`, `imageUtils.ts`, `diceUtils.ts`
- Use PascalCase for database classes and complex math systems: `RPGDatabase.ts`, `LightingSystem.ts`
- Use matching PascalCase with `.css` extension for component-scoped stylesheets: `CharacterSheet.css`, `BattleMap.css`, `StatsBlock.css`
- Use suffix `Types.ts` for domain type definitions: `characterTypes.ts`, `mapTypes.ts`, `combatTypes.ts`
- Use camelCase for standard functions, methods, and hooks: `calculateVisibilityPolygon`, `updateTokenPosition`, `useMultiplayer`, `saveCustomMonster`
- Prefix custom React hooks with `use`: `useMultiplayer`, `usePeer`, `useMap`, `useCombat`
- Prefix boolean state accessors and getters with `is`, `has`, or `can`: `isConnected`, `isHost`, `hasNotified`, `isOnline`
- Prefix event handler callbacks with `handle` or `on`: `handleDieRest`, `handleOpenRequest`, `handleSpawnToken`, `onRollComplete`
- Use camelCase for local variables and state identifiers: `selectedCharacterId`, `activeTab`, `connectedPlayersData`
- Use UPPER_SNAKE_CASE for top-level constants, lookup maps, and default configs: `STORAGE_KEY_PREFIX`, `INDEX_KEY`, `INITIAL_CHARACTER`, `MONSTERS_5E`
- Use PascalCase for TypeScript interfaces and type aliases: `MapToken`, `Character`, `PeerMessage`, `Combatant`, `RollEvent`
- Avoid `I` prefixes for interfaces (prefer `MapConfig` over `IMapConfig`)
- Use discriminated union string literals in lowercase or UPPER_SNAKE_CASE:

## Code Style

- Indentation: 2 spaces or 4 spaces (consistent within individual files; 4 spaces prevalent in older services, 2 spaces prevalent in newer components)
- Quotes: Single quotes preferred for TypeScript imports and string literals (`'react'`, `'#c5a059'`); double quotes accepted in JSON and JSX attributes
- Semicolons: Semicolons used consistently throughout TypeScript codebases
- Line Length: Soft limit of ~100 characters; long SVG or math pipelines broken across multiple lines
- Tool: ESLint v9 flat config (`eslint.config.js`)
- Rules:
- TypeScript Strictness: `strict: true`, `noUnusedLocals: true`, `noUnusedParameters: true` in `tsconfig.app.json`

## Import Organization

- Relative path imports used throughout (`../`, `../../`); no `@/` path alias currently configured in `tsconfig.json` or `vite.config.ts`. Always use clean relative paths.

## Error Handling

- Always wrap `localStorage.getItem` and `JSON.parse` operations in `try/catch` blocks, returning sensible fallbacks (`null`, `[]`, or initial objects) to prevent application crashes from corrupted client cache:
- Wrap standalone panels in `<ErrorBoundary name="...">` (see `src/App.tsx:L216-L253` and `src/components/ErrorBoundary.tsx`), so a crash in 3D dice or battle map canvas does not crash the chat or character sheet.
- Firebase Realtime Database throws errors when receiving `undefined` properties. Always sanitize payloads before transmitting (`FirebaseContext.tsx:L394`):

## Logging

- Native browser `console` (`console.log`, `console.warn`, `console.error`, `console.debug`).
- Prefix log statements with component or service domain tags for easy filtering in developer tools:

## Comments

- Explain the **why** behind race condition mitigations, synchronization guards, or mathematical edge cases:
- Add `// FIX:` or `// CRITICAL FIX:` notes when resolving a subtle cross-tab or multiplayer synchronization bug.
- Use interface documentation for shared data contracts (e.g. `src/features/map/mapTypes.ts`).
- Avoid redundant JSDoc comments on self-explanatory React components.

## Function Design

- Aim for focused components under 200 lines where practical.
- When complex UI components grow large (e.g. `CharacterSheet.tsx`, `CharacterBuilder.tsx`), extract distinct tabs or panels into subcomponents located in a `components/` subdirectory (e.g. `src/features/character/components/InventoryPanel.tsx`).
- For components, define an explicit `Props` interface:
- Use object parameter destructuring with default fallback values.
- Explicitly type return values on public repository and calculation methods (`calculateVisibilityPolygon(...): Point[]`, `listAll(): CharacterSummary[]`).

## Module Design

- Use named exports for components and context hooks (`export const BattleMap: React.FC = ...`, `export const useMap = ...`).
- Use default export for the root `App` component (`export default App`).
- Avoid sprawling index barrel re-exports; import directly from the implementing module file to ensure fast Vite HMR and clean dependency graphs.

<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->

## Architecture

## System Overview

```text

```

## Component Responsibilities

| Component | Responsibility | File |
|-----------|----------------|------|
| `App` & `AppContent` | Root provider hierarchy, top header, view mode switching (`connection`, `game`, `character-setup`), tab dispatch | `src/App.tsx` |
| `FirebaseContext` | Peer session management, room creation/joining, remote state broadcast, sync hooks, onDisconnect presence | `src/features/multiplayer/FirebaseContext.tsx` |
| `BattleMap` | Canvas rendering for battle grid, pan/zoom interaction, token dragging, wall and fog layers | `src/features/map/BattleMap.tsx` |
| `LightingSystem` | Raycasting 2D visibility polygon generation from wall segment intersections | `src/features/map/LightingSystem.ts` |
| `FogOfWarLayer` | Canvas masking for explored and currently visible map regions based on token light/vision | `src/features/map/FogOfWarLayer.tsx` |
| `CharacterSheet` | Character inspection, editing, leveling, spell slots, inventory, equipment, bio | `src/features/character/CharacterSheet.tsx` |
| `CharacterBuilder` | Wizard-style character creator (Ability scores, class features, backgrounds) | `src/features/character/CharacterBuilder.tsx` |
| `InitiativeTracker` | Turn order queue, round counter, combatant HP, and tactical state toggling | `src/features/combat/InitiativeTracker.tsx` |
| `DiceScene` & `PhysicsDie` | 3D canvas with Cannon rigid-body physics for realistic polygonal dice rolling | `src/features/dice/DiceScene.tsx`, `src/features/dice/PhysicsDie.tsx` |
| `GMScreen` | Dungeon Master dashboard for player monitoring, token spawning, scene selection, soundboard | `src/features/gm/GMScreen.tsx` |
| `BestiarySidebar` | Monster directory with 5e and Witcher stats, search, filter, and token spawn controls | `src/features/monsters/BestiarySidebar.tsx` |
| `AudioContext` & `Soundboard` | Background music loops, SFX playback, volume control, track database access | `src/features/audio/AudioContext.tsx`, `src/features/audio/Soundboard.tsx` |
| `ChatWindow` & `ChatContext` | Text messaging, emote formatting, dice roll result embeds, unread badges | `src/features/chat/ChatWindow.tsx`, `src/features/chat/ChatContext.tsx` |
| `RPGDatabase` | Dexie ORM configuration for persistent campaign, scene, map, and asset storage | `src/db/RPGDatabase.ts` |

## Pattern Overview

- **Feature Encapsulation:** Code is grouped by domain feature under `src/features/*` (e.g. `map`, `combat`, `character`, `dice`, `audio`, `multiplayer`).
- **Context-as-a-Service:** Each major domain owns a dedicated React Context providing state and action dispatches, avoiding prop-drilling.
- **Repository Pattern:** Persistence logic (IndexedDB and LocalStorage) is abstracted behind static repository classes/objects (`CharacterRepository`, `AdventureRepository`, `MonsterRepository`, `AudioRepository`).
- **Hybrid Realtime Synchronization:** Combines local optimistic state updates with Firebase Realtime Database event listeners and broadcast primitives.

## Layers

- Purpose: Present visual components, gather user input, render 2D canvas and 3D WebGL viewports
- Location: `src/features/**/components/`, `src/features/**/` (e.g., `src/features/map/BattleMap.tsx`, `src/features/dice/DiceRoller.tsx`)
- Contains: React TSX functional components and scoped CSS files
- Depends on: Domain Context hooks (`useMap`, `useCombat`, `useMultiplayer`, `useDice`)
- Used by: `src/App.tsx`
- Purpose: Manage shared runtime domain state, bridge local state changes to network broadcasts
- Location: `src/features/**/*Context.tsx`
- Contains: React context providers, hooks, and sync logic
- Depends on: Services (`firebase.ts`, `CampaignStorage.ts`), Repositories, Domain models
- Used by: UI View Layer
- Purpose: Pure calculations, geometry, dice maths, and rules processing
- Location: `src/features/map/LightingSystem.ts`, `src/features/dice/diceUtils.ts`, `src/features/character/data/`
- Contains: Raycaster algorithms, dice parsing, 5e / Witcher rulesets, type definitions
- Depends on: Primitive math and data definitions
- Used by: State layer and UI components
- Purpose: Provide structured CRUD interfaces over browser storage mechanisms
- Location: `src/features/**/characterRepository.ts`, `src/features/**/adventureRepository.ts`, `src/features/**/MonsterRepository.ts`, `src/features/**/AudioRepository.ts`
- Contains: Static repository objects managing serialization, deserialization, deep copying, and indexing
- Depends on: Dexie (`src/db/RPGDatabase.ts`), LocalStorage, IndexedDB
- Used by: Domain Contexts and UI modals
- Purpose: Cloud communication and browser platform bindings
- Location: `src/services/firebase.ts`, `src/db/RPGDatabase.ts`, `src/utils/firebaseUtils.ts`
- Contains: Firebase app initialization, Realtime Database references, Cloud Storage references, Dexie instance
- Depends on: `firebase` package, `dexie` package
- Used by: Contexts and Repositories

## Data Flow

### Primary Request Path (Token Move & Sync)

### Dice Roll Flow

- Runtime UI state is distributed across scoped React Contexts nested in `src/App.tsx:L325-L348`
- Local persistence uses LocalStorage for fast synchronous reads and IndexedDB (Dexie) for large binary assets and scene collections
- Multiplayer sync uses Firebase Realtime Database as an event and state exchange bus

## Key Abstractions

- Purpose: Represents a character, monster, or prop placed on the spatial battle grid
- Examples: `src/features/map/mapTypes.ts:L6`, `src/features/map/Token.tsx`
- Pattern: Spatial entity with optional linkage to a character (`characterId`), monster (`monsterId`), or combatant (`combatantId`)
- Purpose: Discriminated union typing all real-time events sent across the network
- Examples: `src/features/multiplayer/FirebaseContext.tsx:L7-L21`
- Pattern: Tagged union / Action payload protocol (`type`, `payload`)
- Purpose: Full tabletop RPG character definition, progression stats, inventory, and lifecycle
- Examples: `src/features/character/characterTypes.ts:L1-L150`, `src/features/character/characterRepository.ts:L15`
- Pattern: Repository with indexed JSON document serialization and deep clone protection
- Purpose: Static raycasting engine computing visible 2D polygons around light sources against wall segment blockers
- Examples: `src/features/map/LightingSystem.ts:L7`
- Pattern: Static computational utility

## Entry Points

- Location: `src/main.tsx:L6`
- Triggers: Browser page load (`index.html`)
- Responsibilities: Mounts React root inside `ErrorBoundary` and renders `App`
- Location: `src/App.tsx:L31-L150` (`AppContent`)
- Triggers: State change of `viewMode` (`connection`, `character-setup`, `game`, `rules-player`, `rules-gm`)
- Responsibilities: Directs user into host/join screen, character builder, or main table workspace

## Architectural Constraints

- **Single-Threaded Canvas & Physics:** The 2D Canvas raycaster (`LightingSystem`) and 3D WebGL physics (`@react-three/cannon`) run on the browser main thread; heavy wall counts (>100 walls) or high dice counts (>15 dice) can cause frame drops.
- **Client-Driven Multiplayer Authority:** There is no dedicated server-side authoritative game loop; clients write directly to Firebase Realtime Database. The Host client functions as the coordinator.
- **Dual IndexedDB Stores:** Two independent IndexedDB databases exist simultaneously (`RPG_Tabletop_DB` via Dexie and `RPG_AudioDB` via native IDB).
- **LocalStorage Quota:** Character sheets, custom monsters, and campaign logs rely on browser `localStorage`, which is capped at ~5MB per origin.

## Anti-Patterns

### Stale State Overwrites on Remote Sync

### Direct Object Mutation in Context

## Error Handling

- Root Error Boundary in `src/main.tsx` catching catastrophic render crashes
- Targeted Component Boundaries in `src/components/ErrorBoundary.tsx` wrapping sidebar panels, dice overlay, and battle map, allowing other features to remain functional if one fails
- Defensive JSON parsing in all repositories (`try { JSON.parse(...) } catch (e) { ... }`) returning empty defaults on corrupt local data

## Cross-Cutting Concerns

<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->

## Project Skills

No project skills found. Add skills to any of: `.agents/skills/`, `.agents/skills/`, `.cursor/skills/`, `.github/skills/`, or `.codex/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->

## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->

<!-- GSD:profile-start -->

## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
