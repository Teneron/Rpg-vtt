# Quick Task Summary: 261012-s4a-performance-e-bundle

## Ações Executadas
1. **Isolamento de `three-vendor` do Bundle Inicial:**
   - Detectado que Rollup inseria o `__vitePreload` helper dentro do chunk `three-vendor`, forçando o `index.html` a carregar 1.49 MB de Three.js antecipadamente.
   - Ajustado `manualChunks` em `vite.config.ts` com normalização de barras e atribuição explícita de `preload-helper` e `react` para `react-vendor`.
   - `three-vendor` foi 100% removido das tags `<link rel="modulepreload">` de `dist/index.html`.
2. **Lazy-loading de `DiceScene`:**
   - Em `src/features/dice/DiceRoller.tsx`, a montagem do Three.js / Cannon rigid body foi encapsulada em `React.lazy(() => import('./DiceScene'))`, garantindo que o sidebar de botões 2D não carregue o motor 3D.
3. **Otimização do `FogOfWarLayer`:**
   - Implementado agendamento com `requestAnimationFrame` e cancelamento no unmount (`cancelAnimationFrame`).
   - Adicionada checagem dirty de largura/altura antes de zerar ou redimensionar o canvas, evitando recriações custosas do framebuffer e flickering.

## Verificações
- `npm test`: 5/5 suítes passando (Combat, Map, Dexie Storage, Server Client, Server Hardening).
- `npx tsc -b`: 0 erros de tipagem.
- `dist/index.html`: Livre de `three-vendor`.
