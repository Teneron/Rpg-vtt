# Quick Task Summary: 261008-n1f - Engine de Mapa, Tokens & Raycasting (Fase 3)

## Executed Changes
1. **Otimização do Raycasting 2D (`LightingSystem.ts`)**:
   - Implementado **Culling Espacial por Bounding Box (`maxRadius`)**: paredes distantes fora do raio de visão/luz do token são ignoradas antes do traçado de raios, reduzindo a complexidade de $O(N)$ paredes globais para apenas paredes locais.
   - Proteção estrita contra divisão por zero e paredes degeneradas (comprimento 0 ou coordenadas `NaN`/`Infinity`).
   - Todos os vértices de saída do polígono de visibilidade são validados com `isFinite` e limitados estritamente às dimensões do canvas do mapa `[0, width]` e `[0, height]`.
2. **Prevenção de Falhas de Renderização na Névoa (`FogOfWarLayer.tsx`)**:
   - Sanitização de segmentos de parede antes do cálculo de iluminação.
   - Passagem de `radiusPx` como 5º parâmetro para ativar culling espacial tanto na luz emitida por tokens quanto na visão pessoal (Darkvision).
   - Verificação de vértices finitos antes de invocar `ctx.createRadialGradient` e `ctx.arc`, prevenindo exceções do browser (`TypeError: The provided double value is non-finite`).
3. **Módulo de Utilidades do Mapa (`src/features/map/mapUtils.ts`)**:
   - Criadas funções puras e agnósticas: `isValidCoord`, `sanitizeWall`, `sanitizeToken`, `clampTokenPosition`.
   - Limitação automática de coordenadas de tokens para não ultrapassarem os limites do grid considerando o tamanho do token (`size`).
4. **Resiliência do Estado do Mapa (`MapContext.tsx`)**:
   - Sanitização na inserção e movimentação de tokens (`addToken`, `updateTokenPosition`).
   - Sanitização de paredes (`addWall`) rejeitando linhas de comprimento zero ou coordenadas nulas/NaN.
   - Filtragem e expurgo de dados corrompidos durante carregamento do IndexedDB (`loadMapData`) e durante sincronizações em rede (`full_sync` e `move`).
5. **Suíte de Testes Automatizada (`test-map-engine.mjs`)**:
   - Teste de polígono de sala com paredes normais.
   - Teste de resiliência contra paredes nulas, degeneradas e coordenadas `NaN`/`Infinity`.
   - Teste de culling espacial (200 paredes distantes filtradas).
   - Teste de sanitização e clamp de tokens e paredes.
   - Adicionado script `npm run test:map` e integrado no `npm test`.

## Verification
- `npm run test:map`: Todos os testes passaram com sucesso (0 falhas).
- `npx tsc -b`: 0 erros de compilação TypeScript.
- `npm run build`: Build do Vite para produção completado com sucesso em 9s.
