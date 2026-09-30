<!-- refreshed: 2026-09-30 -->
# Architecture

**Analysis Date:** 2026-09-30

## System Overview

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                      UI / View Layer (React 19)                         │
│  `src/App.tsx` (AppContent, Tab Routing, View Mode Switcher)            │
├───────────────────┬───────────────────┬─────────────────────────────────┤
│   Battle Map      │ Character Sheet   │ Combat & Audio                  │
│  `src/features/`  │ `src/features/`   │ `src/features/combat/`          │
│   `map/BattleMap` │  `character/`     │ `src/features/audio/`           │
│   `map/Token`     │  `CharacterSheet` │ `src/features/dice/DiceScene`   │
└─────────┬─────────┴─────────┬─────────┴────────────────┬────────────────┘
          │                   │                          │
          ▼                   ▼                          ▼
┌─────────────────────────────────────────────────────────────────────────┐
│             Domain Context Providers (React Context API)                 │
│  `src/features/multiplayer/FirebaseContext.tsx`                         │
│  `src/features/map/MapContext.tsx` & `SceneContext.tsx`                 │
│  `src/features/combat/CombatContext.tsx`                                │
│  `src/features/dice/DiceContext.tsx` & `RollHistoryContext.tsx`         │
│  `src/features/chat/ChatContext.tsx` & `AudioContext.tsx`               │
│  `src/features/adventure/AdventureContext.tsx`                          │
└─────────┬───────────────────┬──────────────────────────┬────────────────┘
          │                   │                          │
          ▼                   ▼                          ▼
┌─────────────────────────────────────────────────────────────────────────┐
│            Domain Logic, Calculators & Repositories                     │
│  `src/features/map/LightingSystem.ts` (Raycasting Visibility)          │
│  `src/features/character/characterRepository.ts` (CRUD & Deep Clones)   │
│  `src/features/adventure/adventureRepository.ts`                        │
│  `src/features/monsters/MonsterRepository.ts`                           │
│  `src/features/audio/AudioRepository.ts`                                │
└─────────┬───────────────────┬──────────────────────────┬────────────────┘
          │                   │                          │
          ▼                   ▼                          ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    Persistence & Network Engines                        │
│  Firebase Realtime DB (`src/services/firebase.ts`)                      │
│  IndexedDB Dexie (`src/db/RPGDatabase.ts`)                              │
│  IndexedDB Audio (`src/features/audio/AudioRepository.ts`)              │
│  LocalStorage (`src/services/CampaignStorage.ts`)                       │
│  Three.js & Cannon Physics (`src/features/dice/DiceScene.tsx`)          │
└─────────────────────────────────────────────────────────────────────────┘
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

**Overall:** Modular Feature-Sliced React Architecture with Context-Driven State & Repository Persistence.

**Key Characteristics:**
- **Feature Encapsulation:** Code is grouped by domain feature under `src/features/*` (e.g. `map`, `combat`, `character`, `dice`, `audio`, `multiplayer`).
- **Context-as-a-Service:** Each major domain owns a dedicated React Context providing state and action dispatches, avoiding prop-drilling.
- **Repository Pattern:** Persistence logic (IndexedDB and LocalStorage) is abstracted behind static repository classes/objects (`CharacterRepository`, `AdventureRepository`, `MonsterRepository`, `AudioRepository`).
- **Hybrid Realtime Synchronization:** Combines local optimistic state updates with Firebase Realtime Database event listeners and broadcast primitives.

## Layers

**UI View Layer:**
- Purpose: Present visual components, gather user input, render 2D canvas and 3D WebGL viewports
- Location: `src/features/**/components/`, `src/features/**/` (e.g., `src/features/map/BattleMap.tsx`, `src/features/dice/DiceRoller.tsx`)
- Contains: React TSX functional components and scoped CSS files
- Depends on: Domain Context hooks (`useMap`, `useCombat`, `useMultiplayer`, `useDice`)
- Used by: `src/App.tsx`

**State & Context Layer:**
- Purpose: Manage shared runtime domain state, bridge local state changes to network broadcasts
- Location: `src/features/**/*Context.tsx`
- Contains: React context providers, hooks, and sync logic
- Depends on: Services (`firebase.ts`, `CampaignStorage.ts`), Repositories, Domain models
- Used by: UI View Layer

**Domain & Logic Layer:**
- Purpose: Pure calculations, geometry, dice maths, and rules processing
- Location: `src/features/map/LightingSystem.ts`, `src/features/dice/diceUtils.ts`, `src/features/character/data/`
- Contains: Raycaster algorithms, dice parsing, 5e / Witcher rulesets, type definitions
- Depends on: Primitive math and data definitions
- Used by: State layer and UI components

**Data Access & Repository Layer:**
- Purpose: Provide structured CRUD interfaces over browser storage mechanisms
- Location: `src/features/**/characterRepository.ts`, `src/features/**/adventureRepository.ts`, `src/features/**/MonsterRepository.ts`, `src/features/**/AudioRepository.ts`
- Contains: Static repository objects managing serialization, deserialization, deep copying, and indexing
- Depends on: Dexie (`src/db/RPGDatabase.ts`), LocalStorage, IndexedDB
- Used by: Domain Contexts and UI modals

**Infrastructure & External Services:**
- Purpose: Cloud communication and browser platform bindings
- Location: `src/services/firebase.ts`, `src/db/RPGDatabase.ts`, `src/utils/firebaseUtils.ts`
- Contains: Firebase app initialization, Realtime Database references, Cloud Storage references, Dexie instance
- Depends on: `firebase` package, `dexie` package
- Used by: Contexts and Repositories

## Data Flow

### Primary Request Path (Token Move & Sync)

1. **User Interaction:** Player or GM drags a token on the battle map (`src/features/map/BattleMap.tsx:L120-L150`)
2. **Local State Update:** `updateTokenPosition(id, newPos)` called in `src/features/map/MapContext.tsx`
3. **Lighting & Visibility Recalculation:** `FogOfWarLayer.tsx` recalculates vision polygons via `src/features/map/LightingSystem.ts:L9`
4. **Network Broadcast:** `broadcast({ type: 'MAP_UPDATE', payload: { type: 'move', data: ... } })` dispatched via `src/features/multiplayer/FirebaseContext.tsx:L31`
5. **Firebase Realtime Write:** Update written to room path `/rooms/{roomId}/map`
6. **Remote Client Ingestion:** Remote clients receive listener trigger via `onValue` in `FirebaseContext.tsx`, updating their local `MapContext`

### Dice Roll Flow

1. **Trigger:** User clicks a die icon in `src/features/dice/DiceRoller.tsx` or an attack action on `src/features/character/CharacterSheet.tsx`
2. **Physics Simulation:** `DiceContext.tsx` triggers 3D roll; `src/features/dice/DiceScene.tsx` spawns `src/features/dice/PhysicsDie.tsx` with rigid-body impulse
3. **Result Detection:** When dice come to rest on the floor plane, `onRollComplete` reads final face orientation
4. **History & Chat Injection:** `RollHistoryContext.tsx` logs the event, while `ChatContext.tsx:L70` broadcasts a rich roll card to all connected players

**State Management:**
- Runtime UI state is distributed across scoped React Contexts nested in `src/App.tsx:L325-L348`
- Local persistence uses LocalStorage for fast synchronous reads and IndexedDB (Dexie) for large binary assets and scene collections
- Multiplayer sync uses Firebase Realtime Database as an event and state exchange bus

## Key Abstractions

**`MapToken`:**
- Purpose: Represents a character, monster, or prop placed on the spatial battle grid
- Examples: `src/features/map/mapTypes.ts:L6`, `src/features/map/Token.tsx`
- Pattern: Spatial entity with optional linkage to a character (`characterId`), monster (`monsterId`), or combatant (`combatantId`)

**`PeerMessage`:**
- Purpose: Discriminated union typing all real-time events sent across the network
- Examples: `src/features/multiplayer/FirebaseContext.tsx:L7-L21`
- Pattern: Tagged union / Action payload protocol (`type`, `payload`)

**`Character` & `CharacterRepository`:**
- Purpose: Full tabletop RPG character definition, progression stats, inventory, and lifecycle
- Examples: `src/features/character/characterTypes.ts:L1-L150`, `src/features/character/characterRepository.ts:L15`
- Pattern: Repository with indexed JSON document serialization and deep clone protection

**`LightingSystem`:**
- Purpose: Static raycasting engine computing visible 2D polygons around light sources against wall segment blockers
- Examples: `src/features/map/LightingSystem.ts:L7`
- Pattern: Static computational utility

## Entry Points

**Web Application Entry:**
- Location: `src/main.tsx:L6`
- Triggers: Browser page load (`index.html`)
- Responsibilities: Mounts React root inside `ErrorBoundary` and renders `App`

**Application Router / Mode Switcher:**
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
**What happens:** Remote character updates from Firebase overwriting active user typing inputs in the sheet.
**Why it's wrong:** Input focus is lost or user changes are clobbered mid-edit.
**Do this instead:** Maintain a `dirtyRef` and timestamp lock during user edits as implemented in `src/features/character/CharacterSheet.tsx:L108-L115`.

### Direct Object Mutation in Context
**What happens:** Mutating nested objects on `character` or `mapConfig` directly before calling state setters.
**Why it's wrong:** React fails to detect reference changes and does not trigger re-renders.
**Do this instead:** Perform deep copies (`JSON.parse(JSON.stringify(...))`) or immutable spreading as enforced in `src/features/character/characterRepository.ts:L90`.

## Error Handling

**Strategy:** Layered React Error Boundaries with graceful console reporting and fallback UI.

**Patterns:**
- Root Error Boundary in `src/main.tsx` catching catastrophic render crashes
- Targeted Component Boundaries in `src/components/ErrorBoundary.tsx` wrapping sidebar panels, dice overlay, and battle map, allowing other features to remain functional if one fails
- Defensive JSON parsing in all repositories (`try { JSON.parse(...) } catch (e) { ... }`) returning empty defaults on corrupt local data

## Cross-Cutting Concerns

**Logging:** Prefixed browser console logs (`[DiceScene]`, `[AdventureRepo]`, `[FirebaseContext]`).
**Validation:** Sanitization of `undefined` values before sending payloads to Firebase (`FirebaseContext.tsx:L394`).
**Authentication:** Anonymous UUID session tokens with Host vs Player privilege gating evaluated in UI components (`isHost && <GMScreen />`).

---

*Architecture analysis: 2026-09-30*
