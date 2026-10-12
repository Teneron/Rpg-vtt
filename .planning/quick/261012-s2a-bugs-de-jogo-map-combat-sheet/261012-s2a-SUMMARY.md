# Quick Task Summary: 261012-s2a - Bugs de Jogo / Map / Combat / Sheet (Fase 2 da auditoria)

## Execution Details
- **Data:** 2026-10-12
- **Escopo:** Fase 2 do plano `auditoria_e_plano.md` (Correções de estado no Mapa, Combate, Física de Dados, Áudio, Chat e Ficha de Personagem).

## Changes Implemented
1. **Map Engine (`MapContext.tsx`):**
   - Extraído `sendUpdate` do updater de `setTokens` utilizando `tokensRef` (M1).
   - Adicionado guard contra save prematuro antes da hidratação (`loadedAdventureId === safeAdventureId`) e debounce de 300ms com checagem de mapa existente para impedir duplicação no Dexie (M2).
2. **Combat Engine (`CombatContext.tsx` & `test-combat-engine.mjs`):**
   - Corrigida a transição de turno em `removeCombatant` para passar para o combatente seguinte em vez de resetar no índice 0 (D1).
   - Corrigido `previousTurn` com combatente ativo nulo para retroceder para o último da lista (D2).
   - Adicionados testes de regressão automatizados para remoção do meio da ordem em `test-combat-engine.mjs`.
3. **Dados 3D & Áudio (`PhysicsDie.tsx`, `DiceScene.tsx`, `DiceContext.tsx`, `AudioContext.tsx`):**
   - Queda no vácuo (`y < -20`) e timeout de repouso agora sorteiam valores uniformes de acordo com o dado (`1..sides`) via `getRandomDieValue` em vez de fixar `1` (D4/D5).
   - Padronizado `rollData` com `formula`, `rolls` e `dice` emitido no `rpg_broadcast_roll` (D3).
   - Unificada detecção de crítico (20 natural) e falha crítica (1 natural) em `AudioContext.tsx` via `handleRollSfx` para jogadores locais e remotos.
4. **Chat (`ChatContext.tsx`):**
   - `unreadCount` só incrementa se a mensagem for realmente inédita e não for enviada pelo próprio remetente (C5).
   - Teto de retenção de 250 mensagens para evitar vazamento de memória em sessões longas.
5. **Ficha de Personagem (`CharacterSheet.tsx` & `characterTypes.ts`):**
   - `handleSave` tornado imutável (`{ ...base, lastModified: Date.now() }`) (R1).
   - `handleSaveRef` implementado e acionado no cleanup de desmontagem (R2).
   - CSS inline do toast corrigido para remover espaços inválidos (R3).
   - `extraSpeed` aplicado ao retorno de `regenerateCharacterStats` e campo `speedOverride` suportado (R4).
   - Formatação correta de bônus de dano sem gerar `+ -1` e seleção da maior CA em casos de múltiplas armaduras corporais equipadas (R5).

## Verification
- `npm test`: 5/5 suítes de teste passando (Combat, Map, Dexie Storage, Server Client, Server Hardening).
- `npx tsc -b`: 0 erros de tipo.
- `npm run build`: Bundling de produção gerado com sucesso em 7.66s.
