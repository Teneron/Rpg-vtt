# Coding Conventions

**Analysis Date:** 2026-09-30

## Naming Patterns

**Files:**
- Use PascalCase for React component files: `CharacterSheet.tsx`, `BattleMap.tsx`, `InitiativeTracker.tsx`
- Use camelCase for TypeScript modules, utilities, and repositories: `characterRepository.ts`, `imageUtils.ts`, `diceUtils.ts`
- Use PascalCase for database classes and complex math systems: `RPGDatabase.ts`, `LightingSystem.ts`
- Use matching PascalCase with `.css` extension for component-scoped stylesheets: `CharacterSheet.css`, `BattleMap.css`, `StatsBlock.css`
- Use suffix `Types.ts` for domain type definitions: `characterTypes.ts`, `mapTypes.ts`, `combatTypes.ts`

**Functions:**
- Use camelCase for standard functions, methods, and hooks: `calculateVisibilityPolygon`, `updateTokenPosition`, `useMultiplayer`, `saveCustomMonster`
- Prefix custom React hooks with `use`: `useMultiplayer`, `usePeer`, `useMap`, `useCombat`
- Prefix boolean state accessors and getters with `is`, `has`, or `can`: `isConnected`, `isHost`, `hasNotified`, `isOnline`
- Prefix event handler callbacks with `handle` or `on`: `handleDieRest`, `handleOpenRequest`, `handleSpawnToken`, `onRollComplete`

**Variables:**
- Use camelCase for local variables and state identifiers: `selectedCharacterId`, `activeTab`, `connectedPlayersData`
- Use UPPER_SNAKE_CASE for top-level constants, lookup maps, and default configs: `STORAGE_KEY_PREFIX`, `INDEX_KEY`, `INITIAL_CHARACTER`, `MONSTERS_5E`

**Types:**
- Use PascalCase for TypeScript interfaces and type aliases: `MapToken`, `Character`, `PeerMessage`, `Combatant`, `RollEvent`
- Avoid `I` prefixes for interfaces (prefer `MapConfig` over `IMapConfig`)
- Use discriminated union string literals in lowercase or UPPER_SNAKE_CASE:
  ```typescript
  export type PeerMessage =
    | { type: 'JOIN_REQUEST'; payload: { name: string } }
    | { type: 'ROLL_RESULT'; payload: { playerName: string; roll: any } }
    | { type: 'MAP_UPDATE'; payload: { type: 'move' | 'add'; data: any } };
  ```

## Code Style

**Formatting:**
- Indentation: 2 spaces or 4 spaces (consistent within individual files; 4 spaces prevalent in older services, 2 spaces prevalent in newer components)
- Quotes: Single quotes preferred for TypeScript imports and string literals (`'react'`, `'#c5a059'`); double quotes accepted in JSON and JSX attributes
- Semicolons: Semicolons used consistently throughout TypeScript codebases
- Line Length: Soft limit of ~100 characters; long SVG or math pipelines broken across multiple lines

**Linting:**
- Tool: ESLint v9 flat config (`eslint.config.js`)
- Rules:
  - `@eslint/js` recommended configuration
  - `typescript-eslint` recommended configuration
  - `eslint-plugin-react-hooks` flat recommended (enforcing hook dependency consistency)
  - `eslint-plugin-react-refresh` (Vite fast refresh safety)
- TypeScript Strictness: `strict: true`, `noUnusedLocals: true`, `noUnusedParameters: true` in `tsconfig.app.json`

## Import Organization

**Order:**
1. React core and standard hooks:
   ```typescript
   import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
   ```
2. External packages and libraries (Three.js, Firebase, Dexie, Lucide):
   ```typescript
   import { Canvas } from '@react-three/fiber';
   import { ref, onValue, set } from 'firebase/database';
   import { Shield, Sword, Heart } from 'lucide-react';
   ```
3. Internal domain contexts and custom hooks:
   ```typescript
   import { useMultiplayer } from '../multiplayer/FirebaseContext';
   import { useMap } from '../map/MapContext';
   ```
4. Internal repositories, utilities, and components:
   ```typescript
   import { CharacterRepository } from '../character/characterRepository';
   import { ErrorBoundary } from '../../components/ErrorBoundary';
   ```
5. Type definitions (`import type`):
   ```typescript
   import type { Character } from '../character/characterTypes';
   import type { MapConfig, MapToken } from '../map/mapTypes';
   ```
6. Stylesheets:
   ```typescript
   import './CharacterSheet.css';
   ```

**Path Aliases:**
- Relative path imports used throughout (`../`, `../../`); no `@/` path alias currently configured in `tsconfig.json` or `vite.config.ts`. Always use clean relative paths.

## Error Handling

**Defensive Parsing:**
- Always wrap `localStorage.getItem` and `JSON.parse` operations in `try/catch` blocks, returning sensible fallbacks (`null`, `[]`, or initial objects) to prevent application crashes from corrupted client cache:
  ```typescript
  try {
    const json = localStorage.getItem(key);
    return json ? JSON.parse(json) : [];
  } catch (e) {
    console.error("Error reading key " + key, e);
    return [];
  }
  ```

**UI Boundary Containment:**
- Wrap standalone panels in `<ErrorBoundary name="...">` (see `src/App.tsx:L216-L253` and `src/components/ErrorBoundary.tsx`), so a crash in 3D dice or battle map canvas does not crash the chat or character sheet.

**Multiplayer Data Sanitization:**
- Firebase Realtime Database throws errors when receiving `undefined` properties. Always sanitize payloads before transmitting (`FirebaseContext.tsx:L394`):
  ```typescript
  const cleanData = JSON.parse(JSON.stringify(data, (key, value) => {
    return value === undefined ? null : value;
  }));
  ```

## Logging

**Framework:**
- Native browser `console` (`console.log`, `console.warn`, `console.error`, `console.debug`).

**Patterns:**
- Prefix log statements with component or service domain tags for easy filtering in developer tools:
  - `console.log("[DiceScene] Die " + id + " reported value " + value);`
  - `console.error("[AdventureRepo] Error saving adventure", err);`
  - `console.warn("[FirebaseContext] Connection dropped, reconnecting...");`

## Comments

**When to Comment:**
- Explain the **why** behind race condition mitigations, synchronization guards, or mathematical edge cases:
  - Explain dirty state tracking during simultaneous local editing and remote broadcast.
  - Explain collision margins and wall thicknesses in 3D physics engines.
- Add `// FIX:` or `// CRITICAL FIX:` notes when resolving a subtle cross-tab or multiplayer synchronization bug.

**JSDoc/TSDoc:**
- Use interface documentation for shared data contracts (e.g. `src/features/map/mapTypes.ts`).
- Avoid redundant JSDoc comments on self-explanatory React components.

## Function Design

**Size:**
- Aim for focused components under 200 lines where practical.
- When complex UI components grow large (e.g. `CharacterSheet.tsx`, `CharacterBuilder.tsx`), extract distinct tabs or panels into subcomponents located in a `components/` subdirectory (e.g. `src/features/character/components/InventoryPanel.tsx`).

**Parameters:**
- For components, define an explicit `Props` interface:
  ```typescript
  interface CharacterSheetProps {
    characterId: string;
    isGM: boolean;
    onExit: () => void;
  }
  ```
- Use object parameter destructuring with default fallback values.

**Return Values:**
- Explicitly type return values on public repository and calculation methods (`calculateVisibilityPolygon(...): Point[]`, `listAll(): CharacterSummary[]`).

## Module Design

**Exports:**
- Use named exports for components and context hooks (`export const BattleMap: React.FC = ...`, `export const useMap = ...`).
- Use default export for the root `App` component (`export default App`).

**Barrel Files:**
- Avoid sprawling index barrel re-exports; import directly from the implementing module file to ensure fast Vite HMR and clean dependency graphs.

---

*Convention analysis: 2026-09-30*
