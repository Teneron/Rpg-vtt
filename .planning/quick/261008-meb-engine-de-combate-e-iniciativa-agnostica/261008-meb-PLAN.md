# Quick Plan: Engine de Combate & Iniciativa Agnóstica

**ID:** `261008-meb`
**Slug:** `engine-de-combate-e-iniciativa-agnostica`
**Data:** 2026-10-08

## Objetivo
Tornar o motor de combate e rastreador de iniciativa completamente agnóstico de regras (suportando D&D 5e, The Witcher TTRPG e futuros sistemas de RPG sem crashes), garantindo autoridade central do Mestre na fila de turnos, sincronização bidirecional de alvos (`setTarget`) e limpeza resiliente de combatentes.

## Tarefas

### Tarefa 1: Helper Agnóstico de Iniciativa e Controles de Turno no Tracker
- **Arquivos:** `src/features/combat/combatUtils.ts`, `src/features/combat/InitiativeTracker.tsx`
- **Ações:**
  1. Criar `src/features/combat/combatUtils.ts` com função `calculateInitiativeBonus(character: any)` que detecta bônus dinamicamente:
     - Bônus direto (`initiativeBonus` / `initiativeMod`)
     - D&D 5e (`attributes?.dex?.value`)
     - The Witcher / Cyberpunk (`stats?.ref?.value`, `attributes?.ref?.value`, `reflexes`)
     - Fallback seguro para 0, eliminando exceções `Cannot read properties of undefined`.
  2. Em `InitiativeTracker.tsx`:
     - Utilizar `calculateInitiativeBonus` em `handleRollInitiative`.
     - Permitir que o jogador ativo passe seu próprio turno ("Encerrar Turno"), emitindo `nextTurn()` com delegação para o Mestre.
     - Suportar status táticos ampliados e desempates visíveis.

### Tarefa 2: Sincronização Autoritativa do Mestre e Alvos no CombatContext
- **Arquivos:** `src/features/combat/combatTypes.ts`, `src/features/combat/CombatContext.tsx`
- **Ações:**
  1. Em `combatTypes.ts`:
     - Tornar `Combatant.status` string extensível.
     - Adicionar `systemId?: string` e `customStats?: Record<string, any>` opcionais.
  2. Em `CombatContext.tsx`:
     - Corrigir `setTarget`: emitir `COMBAT_ACTION: 'SET_TARGET'` se for jogador para que o Mestre atualize o alvo global da mesa e todos vejam o anel de mira.
     - Suportar `COMBAT_ACTION: 'NEXT_TURN'` para que jogadores ativos possam encerrar seu turno autoritativamente via Mestre.
     - Tratar `removeCombatant` com fallback de `activeTurnId` (não apontar para combatente deletado) e limpeza de `currentTargetId`.
     - No `endCombat()`, limpar `activeTurnId` e `currentTargetId`.
     - No `sortCombatants()`, usar o bônus como desempate (`b.initiative - a.initiative || (b.bonus || 0) - (a.bonus || 0)`).

### Tarefa 3: Otimização no BattleMap e Testes Automatizados
- **Arquivos:** `src/features/map/BattleMap.tsx`, `test-combat-engine.mjs`
- **Ações:**
  1. Em `BattleMap.tsx`: corrigir hook `useCombat` chamado dentro de `renderToken`, movendo `combatState` para o topo do componente.
  2. Criar script de testes `test-combat-engine.mjs` testando:
     - Cálculo de iniciativa com fichas de D&D, Witcher e fichas genéricas/vazias sem crash.
     - Ciclo de turnos, avanço de rodada e desempate.
     - Sincronização de target (`SET_TARGET`) e encerramento de turno via `COMBAT_ACTION`.
  3. Executar `node test-combat-engine.mjs` e `npm run build` (`tsc -b && vite build`) garantindo 0 erros.
