---
status: complete
quick_id: 261008-meb
slug: engine-de-combate-e-iniciativa-agnostica
date: 2026-10-08
---

# Quick Task Summary: Engine de Combate & Iniciativa Agnóstica

**ID:** `261008-meb`
**Slug:** `engine-de-combate-e-iniciativa-agnostica`
**Data:** 2026-10-08

## O que foi realizado

1. **Cálculo Agnóstico de Iniciativa (`combatUtils.ts`):**
   - Criada a função `calculateInitiativeBonus` que detecta dinamicamente modificadores para:
     - D&D 5e (`attributes.dex.modifier` ou `attributes.dex.value`)
     - The Witcher TTRPG e Cyberpunk (`stats.ref.value`, `attributes.ref.value`, `reflexes`)
     - Bônus explícito ou direto na ficha (`initiative`, `initiativeBonus`)
     - Fallback seguro para 0 em qualquer estrutura de dados ou ficha vazia, eliminando exceções `Cannot read properties of undefined (reading 'dex')`.
   - `rollInitiative` gera roll e fórmula adaptada (`1d20 + bônus` ou dice sides customizados).

2. **Controle de Turno e Ações no `InitiativeTracker.tsx`:**
   - Rolagem de iniciativa usando o novo utilitário agnóstico.
   - Adicionado botão **"⏭️ Encerrar Meu Turno"** para o jogador ativo quando for seu turno, permitindo passar a vez e emitir `NEXT_TURN` para o Mestre.
   - Botão de mira direta (`🎯`) no tracker para definir ou limpar alvos (`setTarget`) sincronizadamente.
   - Suporte a tags de status tático ampliadas (`dodging`, `dashing`, `hiding`, `ready`, `defending`).

3. **Autoridade do Mestre e Sincronização de Alvos (`CombatContext.tsx`):**
   - **Target Sincronizado:** `setTarget(targetId)` agora emite `COMBAT_ACTION: 'SET_TARGET'` se acionado por um jogador, fazendo com que o Mestre atualize `currentTargetId` e propague o anel de mira para todos na mesa.
   - **Ciclo de Turnos Autoritativo:** Suporte a requisição remota de `NEXT_TURN` e `PREVIOUS_TURN` processadas pelo Mestre.
   - **Limpeza Resiliente:** `removeCombatant` agora transfere com segurança o `activeTurnId` para o próximo combatente (em vez de apontar para um combatente deletado) e limpa `currentTargetId` se o combatente removido era o alvo.
   - **Desempate de Iniciativa:** `sortCombatants` agora utiliza o bônus de iniciativa como critério de desempate secundário e ordem alfabética como terciário.
   - **Finalização Limpa:** `endCombat` limpa o turno ativo e mira de alvos.

4. **Otimização no `BattleMap.tsx`:**
   - Removida a chamada interna de hook `useCombat()` dentro da função de renderização `renderToken`.
   - `combatState` e `setTarget` desestruturados no topo do componente.
   - Adicionado atalho `Shift + Click` em tokens do mapa para mirar/desmirar alvos em tempo real.

5. **Testes e Build:**
   - Criado `test-combat-engine.mjs` testando iniciativa agnóstica para 5e, Witcher e fichas genéricas/vazias, ordenação, avanço de turnos e limpeza de alvos.
   - Adicionados scripts `npm test` e `npm run test:combat` ao `package.json`.
   - Todos os testes passando com sucesso.
   - Build de produção (`npm run build`) validado com 0 erros de TypeScript.
