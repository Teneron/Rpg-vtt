# Technology Stack

**Analysis Date:** 2026-09-30

## Languages

**Primary:**
- TypeScript ~5.9.3 - Core application logic, React components, state contexts, physics simulations, and data models across `src/`
- TSX (React JSX) - Component rendering and template syntax in all UI modules

**Secondary:**
- JavaScript (ES2020 / ES Modules) - Tooling configurations (`eslint.config.js`, `.agents/gsd-core/bin/gsd-tools.cjs`)
- CSS3 (Vanilla CSS with CSS Custom Properties) - Styling across `src/index.css`, `src/styles/theme.css`, and feature-specific component stylesheets
- HTML5 - Base markup structure and entry point in `index.html`
- PowerShell - Token image automation utility script (`process_token_v14.ps1`)

## Runtime

**Environment:**
- Browser: Modern evergreen browsers (Chrome, Edge, Firefox, Safari) supporting WebGL2, Web Audio API, Canvas 2D, IndexedDB, and ES2022+ features
- Development/Build: Node.js (v20+ / v24+ verified during inspection)

**Package Manager:**
- npm
- Lockfile: `package-lock.json` present (npm v10+ lockfileVersion 3)

## Frameworks

**Core:**
- React 19.2.0 (`react`, `react-dom`) - Client-side UI component tree, hook lifecycle, and context-based state management
- Vite 7.2.4 (`vite`, `@vitejs/plugin-react`) - Development server with Hot Module Replacement (HMR) and production bundling via Rollup/ESBuild

**3D Graphics & Physics:**
- Three.js 0.182.0 (`three`, `@types/three`) - 3D scene rendering, lighting, materials, and geometries
- @react-three/fiber 9.4.2 - Declarative React wrapper for Three.js render pipeline
- @react-three/drei 10.7.7 - Helpers and abstractions for Three.js scene environments
- @react-three/cannon 6.6.0 - Real-time rigid-body physics engine for 3D dice rolls in `src/features/dice/DiceScene.tsx`

**Audio & Video:**
- react-player 3.4.0 - Embedded stream playback component in `src/features/audio/`
- Web Audio API (Native browser) - Low-latency positional and soundboard effects in `src/features/audio/AudioContext.tsx`

**Testing:**
- None detected - No test runner (`vitest`, `jest`, `playwright`) configured in `package.json`

**Build/Dev:**
- TypeScript compiler (`tsc -b`) - Type checking and build orchestration in `package.json`
- ESLint 9.39.1 (`eslint`, `@eslint/js`, `typescript-eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`) - Static code analysis and linting

## Key Dependencies

**Critical:**
- `firebase` (v12.7.0) - Realtime Database (`firebase/database`) and Cloud Storage (`firebase/storage`) for live multiplayer synchronization and media hosting in `src/features/multiplayer/FirebaseContext.tsx`
- `dexie` (v4.2.1) & `dexie-react-hooks` (v4.2.0) - IndexedDB client wrapper for persistent local campaign scenes, maps, walls, and asset storage in `src/db/RPGDatabase.ts`
- `lucide-react` (v0.562.0) - Icon library utilized across headers, toolbar controls, character panels, and GM screen

**Legacy / Transitional:**
- `peerjs` (v1.5.5) - Previously used WebRTC P2P mesh library; listed in `package.json` dependencies but superseded by Firebase Realtime Database in active runtime paths

## Configuration

**Environment:**
- Local storage and IndexedDB keys:
  - `RPG_Tabletop_DB` (Dexie database name in `src/db/RPGDatabase.ts`)
  - `RPG_AudioDB` (IndexedDB database name in `src/features/audio/AudioRepository.ts`)
  - `rpg_char_*`, `rpg_char_index_*`, `rpg_adv_*`, `rpg_custom_monsters`, `rpg_my_id` (Browser LocalStorage)
- Firebase configuration defined in `src/services/firebase.ts` (API key, auth domain, database URL, project ID, storage bucket)
- CORS settings for Firebase Storage / assets defined in `cors.json`

**Build:**
- `vite.config.ts`:
  - `server.host: true` - Exposes dev server on 0.0.0.0 for LAN / Radmin VPN multiplayer testing
  - `build.sourcemap: false` - Minimizes build output size
- `tsconfig.json` & `tsconfig.app.json`:
  - Target `ES2022`, module `ESNext`, `moduleResolution: "bundler"`, `allowImportingTsExtensions: true`, strict type-checking enabled
- `eslint.config.js`:
  - Flat config style combining ESLint recommended, TypeScript-ESLint recommended, and React Hooks rules
- `firebase.json`:
  - Firebase Hosting configuration targeting `dist/` with single-page app rewrite (`/** -> /index.html`) and cache-control disabling

## Platform Requirements

**Development:**
- Node.js 18+ (Node.js 20 or 24 recommended)
- Modern web browser with WebGL2 and Web Audio support
- PowerShell (for image processing script `process_token_v14.ps1`)

**Production:**
- Firebase Hosting (configured in `firebase.json`) or static web server serving the `dist/` directory
- Firebase Realtime Database and Firebase Storage backend instances

---

*Stack analysis: 2026-09-30*
