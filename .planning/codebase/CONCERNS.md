# Codebase Concerns

**Analysis Date:** 2026-09-30

## Tech Debt

**Multiplayer Networking Migration Remnants:**
- Issue: Package `peerjs` (v1.5.5) remains installed in `package.json` and legacy shims (`connections`, `hostConnection`, `usePeer`) are kept in `src/features/multiplayer/FirebaseContext.tsx`, even though the entire real-time synchronization layer was rewritten to use Firebase Realtime Database.
- Files: `package.json:L21`, `src/features/multiplayer/FirebaseContext.tsx:L26-L53`, `src/features/multiplayer/ConnectionScreen.tsx:L224`
- Impact: Dead dependency weight in `node_modules` and confusing legacy API terminology for developers.
- Fix approach: Remove `peerjs` dependency from `package.json`, deprecate and remove legacy shims in `FirebaseContext.tsx`, and rename alias `usePeer` to `useMultiplayer`.

**Dual Storage Engines for IndexedDB:**
- Issue: Two separate storage mechanisms for IndexedDB exist simultaneously: `RPG_Tabletop_DB` implemented with Dexie ORM (`src/db/RPGDatabase.ts`), and `RPG_AudioDB` implemented with raw native `window.indexedDB` callbacks (`src/features/audio/AudioRepository.ts`).
- Files: `src/db/RPGDatabase.ts`, `src/features/audio/AudioRepository.ts`
- Impact: Fragmented database management, redundant connection opening logic, and lack of reactive hooks for audio data.
- Fix approach: Migrate `tracks` store into the existing `RPGDatabase` Dexie schema as an entity table.

**LocalStorage Quota Depletion Risk:**
- Issue: Character sheets, custom monsters, adventure records, and session roll logs are serialized into `localStorage` (`rpg_char_*`, `rpg_adv_*`, `rpg_custom_monsters`).
- Files: `src/features/character/characterRepository.ts`, `src/features/adventure/adventureRepository.ts`, `src/features/monsters/MonsterRepository.ts`, `src/services/CampaignStorage.ts`
- Impact: Browser `localStorage` is strictly limited to ~5MB per origin. An active campaign with dozens of character revisions, custom monsters with embedded base64 avatars, and roll histories will exceed quota, causing `QuotaExceededError` crashes during saving.
- Fix approach: Move character and monster documents into IndexedDB tables in `src/db/RPGDatabase.ts`.

**Monolithic Mega-Components:**
- Issue: `CharacterBuilder.tsx` (61 KB) and `CharacterSheet.tsx` (44 KB) contain massive inline state management, form handlers, and nested JSX within single files.
- Files: `src/features/character/CharacterBuilder.tsx`, `src/features/character/CharacterSheet.tsx`
- Impact: High cognitive load, difficult maintainability, and frequent merge conflicts.
- Fix approach: Extract wizard steps in `CharacterBuilder` and feature tabs in `CharacterSheet` into isolated subcomponents.

## Known Bugs

**Same-Machine Multi-Tab Session Identity Collision:**
- Symptoms: Opening GM and Player tabs in the same browser causes both tabs to share the same player identity and user ID (`rpg_my_id`).
- Files: `src/features/multiplayer/FirebaseContext.tsx:L68-L78`
- Trigger: Testing multiplayer locally on a single machine across two regular browser tabs.
- Workaround: Users must run the second role (Player) in an Incognito / Private browsing window.

**D10 Physics Die Shape Approximation:**
- Symptoms: D10 rolls do not match the exact geometry of standard tabletop 10-sided dice.
- Files: `src/features/dice/PhysicsDie.tsx:L13`
- Trigger: Rolling 10-sided dice.
- Workaround: Currently proxied by a regular dodecahedron shape.

## Security Considerations

**Hardcoded Firebase Client Credentials in Source:**
- Risk: Firebase project identifiers and client API keys are hardcoded in source code rather than loaded from environment variables.
- Files: `src/services/firebase.ts:L4-L13`
- Current mitigation: Standard Firebase client keys are meant to be public, but project settings rely solely on Firebase security rules.
- Recommendations: Extract configuration to `.env.local` / `import.meta.env` and implement strict Firebase Realtime Database Security Rules verifying room membership and role validation.

**Unrestricted Realtime Database Writes:**
- Risk: Any connected client who knows a `roomId` can broadcast arbitrary `MAP_UPDATE`, `PLAYER_UPDATE`, or `COMBAT_ACTION` messages without backend signature or schema validation.
- Files: `src/features/multiplayer/FirebaseContext.tsx:L360-L450`
- Current mitigation: Basic UI gating hides GM buttons from non-host players.
- Recommendations: Enforce Firebase Database Rules restricting write permissions on `/rooms/{roomId}/host` and `/rooms/{roomId}/map` exclusively to the host's authenticated UID.

## Performance Bottlenecks

**Main-Thread 2D Raycasting with Many Walls:**
- Problem: Calculating visibility polygons for dynamic fog of war casts rays to all wall vertices for every moving token on each frame.
- Files: `src/features/map/LightingSystem.ts:L9-L81`, `src/features/map/FogOfWarLayer.tsx`
- Cause: O(N * M) segment intersection checks running on the browser main thread during token drag.
- Improvement path: Implement spatial partitioning (quadtree / bounding box pre-filtering) or offload raycasting calculations to a Web Worker or WebGL fragment shader.

**3D Rigid-Body Physics Simulation Overhead:**
- Problem: Multiple concurrent dice rolls (>10 dice) can drop frame rates on low-end hardware.
- Files: `src/features/dice/DiceScene.tsx`, `src/features/dice/PhysicsDie.tsx`
- Cause: Cannon physics calculations and Three.js shadow maps updating inside the React render cycle.
- Improvement path: Throttle collision listeners and sleep inactive physics bodies promptly after rest detection.

## Fragile Areas

**Remote vs Local Character Sheet Synchronization:**
- Files: `src/features/character/CharacterSheet.tsx:L50-L175`, `src/features/multiplayer/FirebaseContext.tsx:L310-L330`
- Why fragile: If a player is actively typing into their sheet while the GM edits an attribute or applies damage, race conditions can cause text to revert or edits to be dropped. The logic relies on delicate `dirtyRef`, time-locking, and component unmount flushes.
- Safe modification: Any modifications to `CharacterSheet.tsx` must preserve the `dirtyRef` checks and debounce timeouts.
- Test coverage: Zero automated tests; requires manual multi-window testing during changes.

**Fog of War Canvas Compositing:**
- Files: `src/features/map/FogOfWarLayer.tsx`, `src/features/map/EphemeralLayer.tsx`
- Why fragile: Relies on `globalCompositeOperation` canvas modes (`destination-out`, `source-over`) layered with scale and offset transformations. Changing canvas transform orders easily breaks token vision clipping.
- Safe modification: Verify pan, zoom, darkvision, and asset occlusion in both GM view and Player view after any edit.
- Test coverage: Zero automated tests.

## Scaling Limits

**Firebase Realtime Database Bandwidth:**
- Current capacity: Free Spark plan limits (~100 simultaneous connections, 1 GB storage, 10 GB/month bandwidth).
- Limit: Streaming continuous pen strokes via `EPHEMERAL_GESTURE` or high-frequency token drag coordinates can exhaust RTDB bandwidth quotas during long sessions.
- Scaling path: Throttle gesture point broadcasts (`stream_points`) to 30ms intervals; upgrade to Blaze pay-as-you-go plan if hosting public games.

**Local Storage Limit:**
- Current capacity: ~5MB.
- Limit: ~50 detailed character sheets or custom monsters before quota errors.
- Scaling path: Migrate to IndexedDB via Dexie (`src/db/RPGDatabase.ts`).

## Dependencies at Risk

**`peerjs`:**
- Risk: Unused dependency that has known maintenance gaps and deprecation warnings in modern bundlers.
- Impact: Increases `package-lock.json` bloat.
- Migration plan: Safely uninstall via `npm uninstall peerjs`.

**`@react-three/cannon`:**
- Risk: Built on `cannon-es`, which receives infrequent updates compared to modern physics engines like Rapier.
- Impact: Potential compatibility issues with future React / Three.js releases.
- Migration plan: Consider migrating to `@react-three/rapier` if advanced physics or performance scaling becomes necessary.

## Missing Critical Features

**Automated Test Suite:**
- Problem: No automated tests (unit, integration, or E2E) exist anywhere in the codebase.
- Blocks: Confident refactoring of critical systems (multiplayer sync, dice physics, raycasting).

**Persistent Cloud Authentication:**
- Problem: Players and GMs have no permanent cloud user accounts; all identity is ephemeral local UUIDs.
- Blocks: Accessing campaigns from different devices or restoring lost browser data.

**Map Asset Library Browser:**
- Problem: Adding maps and tokens currently relies on local files or external URLs without a unified cloud asset manager.
- Blocks: Seamless in-game map switching for GMs without manual URL inputs.

## Test Coverage Gaps

**Multiplayer Event Handling & Sanitization:**
- What's not tested: Message payload serialization, undefined property stripping, network dropouts, presence disconnection handlers.
- Files: `src/features/multiplayer/FirebaseContext.tsx`
- Risk: Malformed payloads causing unhandled exceptions across all connected peers.
- Priority: High

**2D Dynamic Lighting & Raycasting:**
- What's not tested: Wall endpoint intersection math, corner cases, parallel line division by zero.
- Files: `src/features/map/LightingSystem.ts`
- Risk: Visual artifacts, infinite light leaks, or application crashes when walls overlap.
- Priority: High

**Character Repository Data Integrity:**
- What's not tested: Deep cloning, level progression modifiers, skill recalculation, localStorage fallback.
- Files: `src/features/character/characterRepository.ts`, `src/features/character/characterTypes.ts`
- Risk: Corrupted character sheets or lost player progress.
- Priority: High

**Combat Turn Order & Round Advancements:**
- What's not tested: Initiative tie-breaking, combatant removal mid-round, status updates.
- Files: `src/features/combat/InitiativeTracker.tsx`, `src/features/combat/CombatContext.tsx`
- Risk: Turn order freezing or desynchronizing between host and players.
- Priority: Medium

---

*Concerns audit: 2026-09-30*
