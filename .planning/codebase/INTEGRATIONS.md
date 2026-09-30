# External Integrations

**Analysis Date:** 2026-09-30

## APIs & External Services

**Real-time Multiplayer & Database:**
- Firebase Realtime Database - Manages live room state, player presence, dice roll broadcasts, chat messages, token movements, drawing gestures, and combat tracking
  - SDK/Client: `firebase/database` (from `firebase` v12.7.0 package)
  - Configuration: Defined in `src/services/firebase.ts`
  - Active Protocol: Broadcasts and subscribes to room channels under `/rooms/{roomId}/...` via `src/features/multiplayer/FirebaseContext.tsx`

**Cloud Asset Storage:**
- Firebase Storage - Cloud storage bucket for remote map graphics, player avatars, and custom campaign imagery
  - SDK/Client: `firebase/storage` (from `firebase` package)
  - Configuration: Defined in `src/services/firebase.ts`
  - Utility Wrapper: `src/utils/firebaseUtils.ts` (upload and URL retrieval)
  - Access Controls: Cross-Origin Resource Sharing policy configured in `cors.json`

**Streaming Media Playback:**
- External Audio/Video Providers (YouTube, SoundCloud, direct MP3/OGG streams)
  - SDK/Client: `react-player` (v3.4.0) in `src/features/audio/MusicPlayer.tsx`
  - Controls: Embedded iframe and HTML5 audio player supporting stream URLs and looped background ambience

## Data Storage

**Remote Database:**
- Firebase Realtime Database
  - Connection: Instantiated in `src/services/firebase.ts`
  - Data Structure:
    - `/rooms/{roomId}/host`: Host metadata and state
    - `/rooms/{roomId}/players/{peerId}`: Connected player status, presence heartbeat (`onDisconnect`), active character data
    - `/rooms/{roomId}/messages`: Real-time chat and roll log stream
    - `/rooms/{roomId}/map`: Real-time token coordinates, wall configurations, and fog mask updates
    - `/rooms/{roomId}/combat`: Shared initiative queue and combatant states

**Local Client Databases (IndexedDB):**
- `RPG_Tabletop_DB` (Dexie ORM)
  - File: `src/db/RPGDatabase.ts`
  - Tables:
    - `campaigns`: Primary key `id`, indexes on `name`, `createdAt`, `updatedAt`
    - `maps`: Auto-increment key `++id`, indexed by `campaignId`
    - `scenes`: Primary key `id` (UUID), indexed by `campaignId`
    - `assets`: Auto-increment key `++id`, indexed by `campaignId, type` (stores image and audio Blobs)
- `RPG_AudioDB` (Native IndexedDB API)
  - File: `src/features/audio/AudioRepository.ts`
  - Object Stores:
    - `tracks`: Key path `id`, stores binary `Blob` audio payloads alongside playback metadata (`title`, `loop`, `volume`, `type`)

**Key-Value Local Storage (Browser LocalStorage):**
- Scoped Campaign Storage (`src/services/CampaignStorage.ts`):
  - Keys formatted as `rpg_{adventureId}_{key}`
- Scoped Character Repository (`src/features/character/characterRepository.ts`):
  - Index keys: `rpg_char_index_{owner}_{adventureId}`
  - Data keys: `rpg_char_{characterId}`
- Adventure Repository (`src/features/adventure/adventureRepository.ts`):
  - Index key: `rpg_adv_index`
  - Data keys: `rpg_adv_{adventureId}`
- Custom Monster Repository (`src/features/monsters/MonsterRepository.ts`):
  - Key: `rpg_custom_monsters`
- Session Identity:
  - Key: `rpg_my_id` (persistent client UUID)

**File Storage:**
- Public static assets served from local filesystem: `public/assets/` (`maps/`, `music/`, `sfx/`, `tokens/`)

**Caching:**
- Browser Cache: Disabled for Firebase Hosting in `firebase.json` (`Cache-Control: no-cache, no-store, must-revalidate`) to prevent stale multiplayer clients

## Authentication & Identity

**Auth Provider:**
- Custom Anonymous Session Identity
  - Implementation: `getMyId()` in `src/features/multiplayer/FirebaseContext.tsx`
  - Unique client UUID generated using `crypto.randomUUID()` with fallback polyfill, persisted to `localStorage.getItem('rpg_my_id')`
  - Session Role: Host (GM) or Client (Player) determined at connection initialization (`ConnectionScreen.tsx`)
  - No external auth provider (Firebase Auth, OAuth, JWT) currently enforced; room access managed by Room ID / Invite Code

## Monitoring & Observability

**Error Tracking:**
- None detected - No Sentry, Datadog, or external telemetry provider

**Logs:**
- Browser console logging (`console.log`, `console.warn`, `console.error`) with domain prefixes:
  - `[DiceScene]`, `[AdventureRepo]`, `[CharacterSheet]`, `[FirebaseContext]`
- React Error Boundaries:
  - `src/ErrorBoundary.tsx` - Root error boundary
  - `src/components/ErrorBoundary.tsx` - Component-level error boundary wrapping panels (`BattleMap`, `DiceOverlay`, `SidebarContent`)

## CI/CD & Deployment

**Hosting:**
- Firebase Hosting (Project ID `rpg-vtt-a9684`)
  - Configured in `firebase.json` targeting the `dist` directory

**CI Pipeline:**
- None detected - No `.github/workflows/` or CI configuration present in repository; builds and deployments are performed manually via `npm run build` and `firebase deploy`

## Environment Configuration

**Required Configurations:**
- Static configuration object in `src/services/firebase.ts` (API key, project ID, RTDB URL, Storage bucket)
- No `.env` or `.env.local` file requirements (configs bundled directly into client)

**Secrets Location:**
- Public Firebase client keys embedded directly in source code (`src/services/firebase.ts`)

## Webhooks & Callbacks

**Incoming:**
- None detected - Pure client-driven architecture

**Outgoing:**
- None detected - Client communicates via Firebase Realtime Database SDK websockets / long-polling

---

*Integration audit: 2026-09-30*
