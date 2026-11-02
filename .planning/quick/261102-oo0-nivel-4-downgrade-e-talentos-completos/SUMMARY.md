---
phase: quick
plan: 261102-oo0
subsystem: character-progression-and-feats
tags: [level-up, level-down, feats, asi, invocations, dnd-2024, multiplayer-sync]
completed: 2026-11-02
---

# Quick Task 261102-oo0 Summary: Progressão Nível 4+, Reversão de Nível (Downgrade) e Catálogo Completo de Talentos D&D 5.5e (2024)

## Objetivo
Corrigir todos os gargalos de subida para o Nível 4 (e marcos ASI subsequentes), implementar reversão real e completa ao diminuir nível (ex: Nv 4 → Nv 3) tanto na ficha quanto no Escudo do Mestre, expandir o catálogo de Talentos, Invocações Místicas e Habilidades de Nível 6–20 para o padrão oficial D&D 5.5e (2024), e sincronizar ganhos/reversões de PV no multiplayer sem falsos bloqueios.

## Principais Entregas
1. **Catálogo Completo D&D 5.5e (`src/features/character/data/feats.ts`, `warlockInvocations.ts`, `progression.ts`):**
   - **72 Talentos oficiais**: 10 de Origem, 40 Gerais (todos *half-feats* com opções `+1` de atributo e proficiência de Salvaguarda em *Resiliente*), 10 Estilos de Luta e 12 Dádivas Épicas de Nível 19+ (`maxAttributeCap: 30`, incluindo *Dádiva da Fortitude* `+40 PV` e *Dádiva da Velocidade* `+9m`).
   - **Invocações Místicas expandidas**: *Lâmina Sedenta*, *Destruição Mística*, *Sugador de Vida*, *Lâmina Devoradora*, *Visão da Bruxa*, *Dádiva dos Protetores*, *Mestre de Miríades de Formas*, *Visões de Reinos Distantes* e *Investidura do Mestre da Corrente*.
   - **Círculos reais de magia e descrições Nv 6–20**: `getMaxSpellCircleForLevel` corrige o teto de círculos para meio-conjuradores (Paladino/ Guardião Nv 4 = 1º círculo) e Arcanum Místico do Bruxo; `getFeaturesForLevel` vincula descrições completas em português de `CLASS_FEATURE_DESCRIPTIONS` e `getClassResourcesForLevel` limpa recursos bloqueados ao reduzir nível.
2. **Assistente de Level Up e Gerenciador de Talentos (`LevelUpModal.tsx`, `LevelUpModal.css`, `FeatsPanel.tsx`):**
   - Seleção funcional e estilizada de **Talentos** (filtros por categoria, busca, seletor obrigatório de `+1` atributo nos *half-feats*) e **Aumento de Atributo (ASI)** (`+2` em um atributo ou `+1/+1` em dois atributos), com resumo detalhado na etapa final e gravação automática de `levelHistory[newLevel]`.
   - Liberação de novos Truques (*Cantrips*) desbloqueados nos níveis 4 e 10 e cálculo retroativo exato de PV para aumento de CON, *Vigoroso (Tough)* e *Dádiva da Fortitude*.
   - Aba **"Talentos"** sempre visível na ficha com botão `+ Adicionar Talento` e `Remover`, além do alerta **"Configurar Nível X!"** visível tanto para o Jogador quanto para o Mestre.
3. **Reversão Completa de Nível (`levelUtils.ts`, `LevelDownModal.tsx`, `CharacterSheet.tsx`, `GMScreen.tsx`):**
   - Novo modal interativo `<LevelDownModal>` acionado pelo selo de Nível na ficha ou pelo botão `-` no Escudo do Mestre.
   - Reversão exata automática via `levelHistory` para subidas futuras e reversão assistida para fichas legadas (subtração automática/editável da média de PV, remoção de talentos de Nv 4+ com reversão do `+1` de atributo e seletor de `-2` / `-1/-1` de ASI).
4. **Sincronização Multiplayer de PV em Progressão/Descanso (`server/server.js`, `SocketContext.tsx`):**
   - Aceita atualizações legítimas de PV vindas do jogador ao concluir `pendingLevelUp`, alterar nível, curar via Dados de Vida em Descanso Curto ou alterar PV máximo via CON/Talentos, mantendo intacta a autoridade de PV do Mestre contra *auto-saves* defasados.

## Verificação
- `node --check server/server.js`: OK
- `npx vitest run`: 21/21 testes aprovados (`progression.test.ts`)
- `npx tsc -b` & `npx vite build`: Compilação limpa sem erros
- `node server/test-hardening.js`: 100% aprovado
