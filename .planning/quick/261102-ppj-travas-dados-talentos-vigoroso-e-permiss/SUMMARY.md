---
phase: quick
plan: 261102-ppj
status: complete
completed: 2026-11-02
files_modified:
  - src/features/character/utils/featPrerequisites.ts
  - src/features/character/characterTypes.ts
  - src/features/character/CharacterBuilder.tsx
  - src/features/character/components/LevelUpModal.tsx
  - src/features/character/components/LevelUpModal.css
  - src/features/character/utils/levelUtils.ts
  - src/features/character/CharacterSheet.tsx
  - src/features/character/components/FeatsPanel.tsx
  - src/features/character/components/CombatPanel.tsx
  - src/features/character/components/InventoryPanel.tsx
  - src/features/character/components/CompanionModal.tsx
  - src/features/character/components/ManageInvocationsModal.tsx
  - src/features/multiplayer/SocketContext.tsx
  - server/server.js
  - src/features/character/data/progression.test.ts
---

# Quick Task 261102-ppj Summary

## Entregas Concluídas
1. **Trava de Rolagem Única do Dado de Vida no Level Up (`LevelUpModal.tsx`, `characterTypes.ts`, `levelUtils.ts`):**
   - Removido o botão de rerrolagem para jogadores; ao rolar o Dado de Vida, o resultado fica travado em `pendingHpRolls` + `localStorage` e persistido imediatamente na ficha, bloqueando também a volta para `Média Fixa` (apenas o Mestre possui botão de liberar nova rolagem).
   - Adicionada trava anti-spam `isRollingAction` em Descanso Curto e Teste contra a Morte no `CombatPanel.tsx`.
2. **Exclusividade Estrita (1 Talento OU ASI no Nível 4+) e Validação Oficial de Pré-requisitos (`featPrerequisites.ts`, `LevelUpModal.tsx`, `FeatsPanel.tsx`):**
   - Removida a edição livre de talentos por jogadores na ficha (`canEdit={isGM}` no `FeatsPanel.tsx` + bloqueio em `CharacterSheet.updateCharacter` e `server/server.js`).
   - Exclusividade mútua no `LevelUpModal.tsx` entre **1 Talento** (com o `+1` de meio-talento nos Talentos Gerais) **OU** **Aumento de Atributo (`+2` / `+1+1`)**, limpando o estado da outra opção ao alternar.
   - Implementado `checkFeatPrerequisites` e `checkInvocationPrerequisites` validando nível (`4+`, `19+`), atributos mínimos (`13+`), `Característica Estilo de Luta`, `Conjuração ou Magia de Pacto`, treinamento em armaduras/escudos, salvaguardas não proficientes em *Resiliente* e pré-requisitos de Pactos/Rajada Mística do Bruxo.
3. **Cálculo e Autocorreção Automática de *Vigoroso (Tough)* e Talentos de PV (`characterTypes.ts`, `CharacterBuilder.tsx`, `FeatsPanel.tsx`, `LevelUpModal.tsx`):**
   - Corrigido `CharacterBuilder.tsx` para calcular o PV base de Nível 1 + *Tenacidade Anã* + *Vigoroso* incondicionalmente (mesmo quando `startingLevel > 1`).
   - Implementada sincronização e autocorreção automática via `hpAppliedFeatIds` em `regenerateCharacterStats`: fichas existentes que já tinham `Vigoroso` sem o PV somado são curadas automaticamente ao abrir a ficha e sincronizadas com o servidor sem duplicação.
4. **Correções Adicionais de Regras, Permissões e Servidor (`CombatPanel.tsx`, `InventoryPanel.tsx`, `CompanionModal.tsx`, `ManageInvocationsModal.tsx`, `server/server.js`, `SocketContext.tsx`):**
   - Bloqueado override manual de CA (`acOverride`), edição/remoção de itens do inventário, bypass de pré-requisitos de mascotes, troca livre de invocações já aprendidas, marcação manual de caixas de morte e importação de `.json` sobre fichas em andamento por jogadores não-Mestre.
   - Exibição correta de `character.initiative` (incluindo *Alerta*) no `CombatPanel.tsx` e aplicação automática dos Estilos de Luta *Arquearia* (`+2` ataque à distância) e *Duelismo* (`+2` dano de 1 mão) em `regenerateCharacterStats`.
   - Validação de autoridade no `server/server.js` impedindo saltos de nível, injeção de talentos extras ou acúmulo ilegal de Talento + ASI por pacotes de jogadores.

## Verificação
- `node --check server/server.js`: OK
- `npx vitest run`: 24/24 testes aprovados
- `npx tsc -b`: 0 erros TypeScript
- `npx vite build`: Build de produção gerado com sucesso
- `node server/test-hardening.js`: 30/30 verificações de segurança aprovadas
