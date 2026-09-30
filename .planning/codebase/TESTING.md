# Testing Patterns

**Analysis Date:** 2026-09-30

## Test Framework

**Current State:**
- **Runner:** Not configured. No test dependencies (`vitest`, `jest`) are installed in `package.json`.
- **Assertion Library:** None installed.
- **Run Commands:** No `test` script currently defined in `package.json`.

**Recommended Standard Framework for This Stack:**
- **Runner:** Vitest (native Vite integration, matches Vite 7 pipeline, fast TS transpilation)
- **Component Testing:** `@testing-library/react` and `@testing-library/user-event`
- **DOM Environment:** `jsdom` or `happy-dom`
- **Recommended Setup:**
  ```json
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage"
  }
  ```

## Test File Organization

**Location:**
- Co-locate unit tests alongside target source modules in `src/` (e.g. `src/features/dice/diceUtils.test.ts`, `src/features/map/LightingSystem.test.ts`).
- Place component integration tests in a adjacent `__tests__/` directory within each feature (e.g. `src/features/combat/__tests__/InitiativeTracker.test.tsx`).

**Naming:**
- Unit tests: `<filename>.test.ts` or `<filename>.spec.ts`
- Component tests: `<ComponentName>.test.tsx`

**Structure:**
```
src/
├── features/
│   ├── dice/
│   │   ├── diceUtils.ts
│   │   └── diceUtils.test.ts
│   ├── map/
│   │   ├── LightingSystem.ts
│   │   └── LightingSystem.test.ts
│   └── combat/
│       ├── InitiativeTracker.tsx
│       └── __tests__/
│           └── InitiativeTracker.test.tsx
```

## Test Structure

**Suite Organization Pattern:**
```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { LightingSystem } from './LightingSystem';

describe('LightingSystem', () => {
  beforeEach(() => {
    // Setup clean geometry or state before each test
  });

  describe('calculateVisibilityPolygon', () => {
    it('returns canvas boundary points when no walls exist', () => {
      const origin = { x: 50, y: 50 };
      const walls: any[] = [];
      const polygon = LightingSystem.calculateVisibilityPolygon(origin, walls, 100, 100);

      expect(polygon.length).toBeGreaterThan(0);
      expect(polygon).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ x: 0, y: 0 }),
          expect.objectContaining({ x: 100, y: 100 }),
        ])
      );
    });

    it('blocks visibility rays behind an opaque wall segment', () => {
      const origin = { x: 10, y: 50 };
      const wall = { a: { x: 50, y: 0 }, b: { x: 50, y: 100 } };
      const polygon = LightingSystem.calculateVisibilityPolygon(origin, [wall], 100, 100);

      // Verify no polygon point penetrates beyond x > 50 on direct line of sight
      const occludedPoints = polygon.filter(p => p.x > 50.01);
      expect(occludedPoints.length).toBe(0);
    });
  });
});
```

## Mocking

**Framework:**
- Vitest built-in `vi` utility (`vi.fn()`, `vi.mock()`, `vi.spyOn()`).

**What to Mock:**
- **Firebase Realtime Database:** Mock `firebase/database` (`ref`, `set`, `onValue`, `push`, `onDisconnect`) to avoid network requests and test state synchronization in isolation.
- **IndexedDB / Dexie:** Use `fake-indexeddb` in memory when testing `RPGDatabase.ts` or `AudioRepository.ts`.
- **Canvas 2D Context:** Mock `HTMLCanvasElement.prototype.getContext('2d')` for map rendering and fog-of-war tests.
- **Three.js WebGL Renderer:** Mock `@react-three/fiber` canvas or use headless renderer mock for dice tests.
- **Browser LocalStorage:** Mock `window.localStorage` with a Map-based in-memory implementation.

**What NOT to Mock:**
- Pure math utilities (`LightingSystem.ts`, `diceUtils.ts`).
- Character stat modifier calculations (`src/features/character/characterTypes.ts`).
- React state transitions in simple isolated component units.

**Mocking Pattern (Firebase):**
```typescript
import { vi } from 'vitest';

vi.mock('../../services/firebase', () => ({
  database: {},
  storage: {}
}));

vi.mock('firebase/database', () => ({
  ref: vi.fn(() => ({})),
  set: vi.fn(() => Promise.resolve()),
  onValue: vi.fn((_ref, cb) => {
    cb({ val: () => null });
    return vi.fn(); // Unsubscribe handler
  }),
  onDisconnect: vi.fn(() => ({ remove: vi.fn(), set: vi.fn() })),
  update: vi.fn(() => Promise.resolve()),
}));
```

## Fixtures and Factories

**Test Data Patterns:**
- Utilize `initialCharacter` from `src/features/character/characterTypes.ts` as the base character template.
- Utilize `initialMapConfig` and `defaultScene` from `src/features/map/mapTypes.ts` for map fixtures.

**Fixture Example:**
```typescript
import { initialCharacter } from '../character/characterTypes';
import type { Character } from '../character/characterTypes';

export const createTestCharacter = (overrides: Partial<Character> = {}): Character => ({
  ...JSON.parse(JSON.stringify(initialCharacter)),
  id: 'test-char-1',
  name: 'Geralt of Rivia',
  class: 'Witcher',
  level: 3,
  ...overrides,
});
```

## Coverage

**Requirements:**
- Currently not enforced.
- Recommended initial baseline:
  - 80% coverage on core calculations (`LightingSystem.ts`, `diceUtils.ts`, rules data mappings).
  - 70% coverage on repositories (`characterRepository.ts`, `adventureRepository.ts`).
  - Critical coverage on Firebase message serialization and error sanitization.

**View Coverage (Once Configured):**
```bash
npx vitest run --coverage
```

## Test Types

**Unit Tests:**
- Test individual algorithmic functions in isolation:
  - Raycasting wall intersection calculation (`LightingSystem.getRaySegmentIntersection`)
  - Dice formula evaluation (`diceUtils`)
  - Modifier calculations and proficiency bonuses (`characterTypes`)
  - Deep clone integrity in `CharacterRepository.create`

**Integration Tests:**
- Test Context interactions:
  - `ChatContext` deduplication logic when messages are received
  - `CombatContext` initiative sorting and turn advancement
  - `MapContext` token coordinate updates and boundary clamping

**E2E Tests:**
- Multiplayer synchronization between Host and Player views.
- Recommended framework: Playwright (supports multi-context browsing to test Host and Client simultaneously in two independent browser contexts).

## Common Patterns

**Async Repository Testing:**
```typescript
it('saves and reloads audio tracks from IndexedDB', async () => {
  const mockTrack = { id: 't1', title: 'Battle Theme', type: 'music' as const };
  const mockFile = new File(['mock audio'], 'battle.mp3', { type: 'audio/mp3' });

  await AudioRepository.saveTrack(mockTrack, mockFile);
  const tracks = await AudioRepository.getAllTracks();

  expect(tracks).toHaveLength(1);
  expect(tracks[0].title).toBe('Battle Theme');
});
```

**Error Handling Testing:**
```typescript
it('handles corrupt localStorage data without crashing', () => {
  localStorage.setItem('rpg_char_corrupt', '{invalid-json');
  const result = CharacterRepository.load('corrupt');
  expect(result).toBeNull();
});
```

---

*Testing analysis: 2026-09-30*
