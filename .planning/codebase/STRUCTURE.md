# Codebase Structure

**Analysis Date:** 2026-09-30

## Directory Layout

```
rpg-tabletop/
├── .agents/                 # GSD framework tools, workflows, skills, and agents
├── .planning/               # GSD planning directory and codebase maps
│   └── codebase/            # 7 structured codebase documentation files
├── public/                  # Static assets served at root
│   ├── assets/              # Audio files, battle maps, sfx
│   │   ├── maps/            # Preloaded battle map images
│   │   ├── music/           # Ambient background tracks
│   │   └── sfx/             # Sound effect audio files
│   └── tokens/              # Circular creature and character token graphics
├── src/                     # Application TypeScript and React source code
│   ├── assets/              # Bundled assets (dice textures, shaders)
│   ├── components/          # Shared reusable UI components
│   ├── db/                  # IndexedDB database schemas and ORM clients
│   ├── features/            # Feature-sliced domain modules
│   │   ├── adventure/       # Campaign and adventure session management
│   │   ├── audio/           # Ambient music player, soundboard, and Web Audio
│   │   ├── character/       # Character sheet, builder, leveling, inventory, rules
│   │   ├── chat/            # In-game chat, messaging, and dice roll cards
│   │   ├── combat/          # Turn-based initiative tracker and status tracking
│   │   ├── dice/            # 3D Three.js/Cannon physics dice roller and history
│   │   ├── gm/              # Dungeon Master tools and screen panel
│   │   ├── map/             # 2D battle map canvas, tokens, walls, lighting, fog
│   │   ├── monsters/        # Bestiary, monster repository, stats blocks, editor
│   │   ├── multiplayer/     # Firebase Realtime synchronization and lobby
│   │   └── rules/           # Player and GM rulebook viewers and reference text
│   ├── services/            # Backend service clients and storage adapters
│   ├── styles/              # Global CSS themes and variables
│   ├── utils/               # Common helper functions (images, Firebase)
│   ├── App.tsx              # Root component and view state routing
│   ├── App.css              # Main application styling
│   ├── ErrorBoundary.tsx    # Root error handling wrapper
│   ├── index.css            # Base typography, layout, and global theme tokens
│   └── main.tsx             # React DOM mount point
├── cors.json                # Google Cloud / Firebase Storage CORS config
├── eslint.config.js         # ESLint flat configuration
├── firebase.json            # Firebase Hosting configuration
├── index.html               # Single-page HTML shell
├── package.json             # Project dependencies and npm scripts
├── process_token_v14.ps1    # PowerShell token image cropping utility
├── tsconfig.app.json        # TypeScript compiler options for application
├── tsconfig.json            # Root TypeScript solution configuration
├── tsconfig.node.json       # TypeScript configuration for build tools
└── vite.config.ts           # Vite development and bundle configuration
```

## Directory Purposes

**`src/features/map/`:**
- Purpose: Core virtual tabletop interactive battle map canvas
- Contains: Canvas rendering layers, pan/zoom handlers, token placement, dynamic lighting calculations, wall drawing tools
- Key files: `src/features/map/BattleMap.tsx`, `src/features/map/LightingSystem.ts`, `src/features/map/FogOfWarLayer.tsx`, `src/features/map/Token.tsx`, `src/features/map/MapContext.tsx`

**`src/features/character/`:**
- Purpose: Player character management, 5e / custom RPG mechanics, and inventory
- Contains: Character sheet tabs, character creation wizard, spell management, leveling modals, static class/race/feat rules data
- Key files: `src/features/character/CharacterSheet.tsx`, `src/features/character/CharacterBuilder.tsx`, `src/features/character/characterRepository.ts`, `src/features/character/characterTypes.ts`

**`src/features/multiplayer/`:**
- Purpose: Real-time peer-to-peer room state synchronization via Firebase
- Contains: Connection screen, room state synchronization hooks, presence handling, message broadcasting
- Key files: `src/features/multiplayer/FirebaseContext.tsx`, `src/features/multiplayer/ConnectionScreen.tsx`, `src/features/multiplayer/usePlayerSync.ts`

**`src/features/dice/`:**
- Purpose: 3D interactive physics dice roller and history logger
- Contains: Three.js canvas, Cannon physics colliders for polyhedral dice, roll history list, dice icon components
- Key files: `src/features/dice/DiceScene.tsx`, `src/features/dice/PhysicsDie.tsx`, `src/features/dice/DiceRoller.tsx`, `src/features/dice/DiceContext.tsx`

**`src/features/combat/`:**
- Purpose: Tactical encounter tracking and initiative order
- Contains: Initiative order queue, round counter, condition tracker, combatant HP modification
- Key files: `src/features/combat/InitiativeTracker.tsx`, `src/features/combat/CombatContext.tsx`, `src/features/combat/combatTypes.ts`

**`src/features/monsters/`:**
- Purpose: Bestiary directory, custom monster creation, and token spawning
- Contains: Monster stat block viewers, editor modals, 5e and Witcher monster datasets
- Key files: `src/features/monsters/BestiarySidebar.tsx`, `src/features/monsters/MonsterRepository.ts`, `src/features/monsters/MonsterStatBlock.tsx`

**`src/features/audio/`:**
- Purpose: Audio atmosphere management (ambient music and sound effects)
- Contains: Web Audio soundboard, streaming music player, IndexedDB track caching
- Key files: `src/features/audio/AudioContext.tsx`, `src/features/audio/AudioRepository.ts`, `src/features/audio/MusicPlayer.tsx`, `src/features/audio/Soundboard.tsx`

**`src/features/rules/`:**
- Purpose: In-app rulebook reading and reference guides
- Contains: Table of contents navigation, section renderer, Player and GM reference rules
- Key files: `src/features/rules/RulebookViewer.tsx`, `src/features/rules/PlayerRulebook.tsx`, `src/features/rules/GMRulebook.tsx`

**`src/db/`:**
- Purpose: Client-side persistent relational storage
- Contains: Dexie IndexedDB database configuration and table definitions
- Key files: `src/db/RPGDatabase.ts`

**`src/services/`:**
- Purpose: External backend bindings and storage adapters
- Contains: Firebase app instance, Realtime Database reference, Cloud Storage reference, LocalStorage campaign helper
- Key files: `src/services/firebase.ts`, `src/services/CampaignStorage.ts`

## Key File Locations

**Entry Points:**
- `src/main.tsx`: Browser entry point mounting React root
- `src/App.tsx`: Central coordinator managing views (`connection`, `character-setup`, `game`) and context provider hierarchy

**Configuration:**
- `vite.config.ts`: Vite dev server and build configuration
- `tsconfig.app.json`: TypeScript compiler settings
- `eslint.config.js`: Linting rules
- `firebase.json`: Hosting and single-page routing configuration
- `cors.json`: Firebase Storage cross-origin configuration

**Core Logic:**
- `src/features/map/LightingSystem.ts`: 2D visibility raycaster
- `src/features/character/characterRepository.ts`: Character persistence and cloning
- `src/features/multiplayer/FirebaseContext.tsx`: Multiplayer network state machine
- `src/features/dice/DiceScene.tsx`: 3D physics collision environment

**Testing:**
- Currently unconfigured (no test files present)

## Naming Conventions

**Files:**
- React components: PascalCase with `.tsx` extension (e.g. `CharacterSheet.tsx`, `BattleMap.tsx`, `InitiativeTracker.tsx`)
- TypeScript modules, utilities, and services: camelCase with `.ts` extension (e.g. `characterRepository.ts`, `firebaseUtils.ts`, `diceUtils.ts`)
- Component-specific styles: Matching component name with `.css` extension (e.g. `CharacterSheet.css`, `BattleMap.css`, `DiceRoller.css`)
- Type definitions: camelCase or feature name with `Types.ts` suffix (e.g. `characterTypes.ts`, `mapTypes.ts`, `combatTypes.ts`)

**Directories:**
- Feature modules: Lowercase single words or kebab-case under `src/features/` (e.g. `character`, `combat`, `monsters`, `multiplayer`)
- Shared directories: Lowercase plural names under `src/` (e.g. `components`, `services`, `styles`, `utils`)

## Where to Add New Code

**New Feature (e.g., Weather System, Quest Log):**
- Create folder: `src/features/<feature-name>/`
- Add types: `src/features/<feature-name>/<feature>Types.ts`
- Add context if state is shared: `src/features/<feature-name>/<Feature>Context.tsx`
- Add main UI component: `src/features/<feature-name>/<Feature>Panel.tsx`
- Add styling: `src/features/<feature-name>/<Feature>Panel.css`
- Wrap in `src/App.tsx` context provider tree and add navigation tab in `AppContent`

**New Shared UI Component (e.g., Tooltip, Modal Dialog):**
- Place in `src/components/<ComponentName>.tsx`
- Keep component generic, styling with CSS classes referencing CSS variables in `src/index.css`

**New Database Entity or Asset Type:**
- Update schema definition and version upgrade in `src/db/RPGDatabase.ts`
- If session-specific key-value data, add accessors in `src/services/CampaignStorage.ts`

**Utilities & Helpers:**
- Mathematical or generic browser helpers: `src/utils/`
- Domain-specific calculations (e.g., dice math): inside corresponding feature directory (e.g. `src/features/dice/diceUtils.ts`)

## Special Directories

**`.planning/`:**
- Purpose: GSD workflow planning, codebase maps, research documents, and state tracking
- Generated: Semi-automated by GSD commands
- Committed: Yes (tracked in version control)

**`dist/`:**
- Purpose: Production bundle compiled by `npm run build` (`vite build`)
- Generated: Yes
- Committed: No (ignored via `.gitignore`)

**`public/`:**
- Purpose: Static image, map, and audio assets served directly by Vite
- Generated: No
- Committed: Yes

---

*Structure analysis: 2026-09-30*
