---
phase: quick
plan: 261102-ppj
type: execute
autonomous: true
files_modified:
  - src/features/character/utils/featPrerequisites.ts
  - src/features/character/characterTypes.ts
  - src/features/character/CharacterBuilder.tsx
  - src/features/character/components/LevelUpModal.tsx
  - src/features/character/utils/levelUtils.ts
  - src/features/character/CharacterSheet.tsx
  - src/features/character/components/FeatsPanel.tsx
  - src/features/character/components/CombatPanel.tsx
  - src/features/character/components/InventoryPanel.tsx
  - src/features/character/components/CompanionModal.tsx
  - src/features/character/components/ManageInvocationsModal.tsx
  - src/features/multiplayer/SocketContext.tsx
  - server/server.js
  - src/features/character/utils/progression.test.ts
---

# Quick Task 261102-ppj: Travas de Dados de Vida, Limite de Talentos vs Atributos, Cálculo de Vigoroso e Permissões

## Objective
Corrigir todos os exploits e bugs de progressão, cálculo de PV e permissões de jogadores identificados na auditoria completa da ficha:
1. **Trava de Rolagem Única do Dado de Vida no Level Up:** Impedir rerrolagem infinita do Dado de Vida, travar a escolha após rolar (persistindo no `character.pendingHpRolls` e `localStorage`) e adicionar trava anti-spam em Descanso Curto e Testes contra a Morte.
2. **Exclusividade Mútua (1 Talento OU ASI no Nível 4+), Limite de Talentos e Pré-requisitos Reais D&D 5.5e:**
   - Remover permissão de jogadores adicionarem/removerem talentos livremente no `FeatsPanel` (`canEdit={isGM}`).
   - No `LevelUpModal`, garantir exclusividade estrita entre escolher **1 Talento** (com o `+1` de meio-talento incluso apenas nos Talentos Gerais elegíveis) **OU** **Aumento de Atributo** (`+2` ou `+1/+1`), limpando o estado da outra aba ao alternar.
   - Implementar validação completa de pré-requisitos (`checkFeatPrerequisites` e `checkInvocationPrerequisites`): Nível (`4+`, `19+`), Atributos mínimos (`13+`), `Característica Estilo de Luta`, `Conjuração ou Magia de Pacto`, Proficiências em Armaduras/Escudos e Pactos de Bruxo.
3. **Cálculo e Autocorreção de PV de Talentos (`Vigoroso` / `Dádiva da Fortitude` / `+1 CON`):**
   - Garantir aplicação de PV no `CharacterBuilder` (mesmo quando `startingLevel > 1`), no `LevelUpModal`, no `FeatsPanel` (Mestre) e adicionar sincronização/autocorreção automática (`hpAppliedFeatIds`) em `regenerateCharacterStats` para curar fichas existentes que já possuam `Vigoroso` sem o PV correspondente, sem duplicar valores.
4. **Blindagem de Permissões da Ficha e Autoridade do Servidor Multiplayer:**
   - Bloquear edição manual de CA (`acOverride`), edição/exclusão de itens do inventário, bypass de pré-requisitos de mascotes, desmarcação livre de invocações fora de level-up, clique manual em caixas de morte e importação de `.json` por jogadores não-Mestre em campanha.
   - Reforçar `server/server.js` e `SocketContext.tsx` para permitir o PV inicial da criação de ficha (`isInitialCharacterBuild`) e impedir saltos de nível, injeção de talentos extras ou `acOverride` vindos de jogadores.
   - Aplicar bônus de Estilos de Luta (`Arquearia` `+2` ataque à distância e `Duelismo` `+2` dano de 1 mão) em `regenerateCharacterStats`.
