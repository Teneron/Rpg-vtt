---
phase: quick-261115-mav
plan: 01
subsystem: vtt-campaign-assets
tags: [act3, battlemaps, tokens, bestiary, dnd55e, le-freyyy]
requires: []
provides:
  - "3 Act III widescreen 32x18 battlemaps in public/assets/maps/ and CAMPAIGN_MAP_PRESETS"
  - "5 new Act III circular tokens in public/tokens/"
  - "6 campaign monsters/NPCs added to MONSTERS_5E (Avatar do Pacto de Sangue + 5 Act III NPCs/enemies)"
affects:
  - src/features/map/MapSettingsModal.tsx
  - src/features/monsters/data/monsters5e.ts
tech-stack:
  added: []
  patterns:
    - "Humanoide categorization in MONSTERS_5E routes NPCs/guards to NPCs tab; Constructo/Fada routes to Bestiary tab"
key-files:
  created:
    - public/assets/maps/battlemap_estrada_emboscada.jpg
    - public/assets/maps/battlemap_taverna_valecorvo.jpg
    - public/assets/maps/battlemap_mansao_alistair.jpg
    - public/tokens/token_npc_barao_alistair.jpg
    - public/tokens/token_enemy_capitao_falcao.jpg
    - public/tokens/token_enemy_guarda_elite.jpg
    - public/tokens/token_enemy_batedor_falcao.jpg
    - public/tokens/token_npc_patrona_arquifada.jpg
  modified:
    - src/features/map/MapSettingsModal.tsx
    - src/features/monsters/data/monsters5e.ts
    - .planning/STATE.md
decisions:
  - "Fixed tsc strict check by including required skills array on avatar_pacto_sangue (['Atletismo +7', 'Intimidação +5']) and recording saving throws inside description."
  - "Preserved existing asset path /assets/tokens/token_enemy_avatar_pacto_sangue.jpg for avatar_pacto_sangue and standardized new Act III tokens under /tokens/."
duration: ~5m
completed: 2026-11-15
---

# Quick Task 261115-mav Summary

**Act III Post-Dungeon Campaign Assets, Map Presets, and Bestiary Integration**

## What Was Built
1. **Copied & Verified Campaign Images (`public/assets/maps/` & `public/tokens/`):**
   - `public/assets/maps/battlemap_estrada_emboscada.jpg` — `1376x768` (1,081,673 bytes)
   - `public/assets/maps/battlemap_taverna_valecorvo.jpg` — `1376x768` (1,043,565 bytes)
   - `public/assets/maps/battlemap_mansao_alistair.jpg` — `1376x768` (943,927 bytes)
   - `public/tokens/token_npc_barao_alistair.jpg` — `1024x1024` (1,010,882 bytes)
   - `public/tokens/token_enemy_capitao_falcao.jpg` — `1024x1024` (928,002 bytes)
   - `public/tokens/token_enemy_guarda_elite.jpg` — `1024x1024` (954,157 bytes)
   - `public/tokens/token_enemy_batedor_falcao.jpg` — `1024x1024` (866,403 bytes)
   - `public/tokens/token_npc_patrona_arquifada.jpg` — `1024x1024` (948,820 bytes)
   - Verified pre-existing `public/assets/tokens/token_enemy_avatar_pacto_sangue.jpg` — `1024x1024` (967,694 bytes)

2. **VTT Map Quick Presets (`src/features/map/MapSettingsModal.tsx`):**
   - Appended 3 Act III presets (all `32x18`) to `CAMPAIGN_MAP_PRESETS`:
     - `🌉 Ponte da Garganta (Ato III)` -> `/assets/maps/battlemap_estrada_emboscada.jpg`
     - `🍺 Taverna & Forja (Valecorvo)` -> `/assets/maps/battlemap_taverna_valecorvo.jpg`
     - `🏰 Banquete Mansão Alistair` -> `/assets/maps/battlemap_mansao_alistair.jpg`

3. **VTT Bestiary & NPC Catalog (`src/features/monsters/data/monsters5e.ts`):**
   - Added 6 entries matching `GUIA_MESTRE_HIPOGEU_DOS_SUSSURROS.md`:
     - `avatar_pacto_sangue` (`O Avatar do Pacto de Sangue`, ND 5, `Constructo`, 95 PV, CA 15)
     - `barao_cedric_alistair` (`Barão Cedric Alistair`, ND 4, `Humanoide`, 65 PV, CA 16, reaction `Aparar com Anel do Sinete`)
     - `capitao_kaelen_falcao` (`Capitão Kaelen (Falcão)`, ND 3, `Humanoide`, 58 PV, CA 17)
     - `guarda_elite_penedo` (`Guarda de Elite de Penedo Alto`, ND 1, `Humanoide`, 26 PV, CA 16 / 18 em formação)
     - `cacador_falcao` (`Caçador do Falcão`, ND 0.5, `Humanoide`, 19 PV, CA 14)
     - `dama_espinhos_negros` (`Dama dos Espinhos Negros (Patrona)`, ND 5, `Fada`, 84 PV, CA 16)

## Deviations from Plan
- `gsd-executor` failed to construct in the current harness (`unknown component: tool "glob" not found in registry`), so execution proceeded directly under the already-initialized GSD quick task `261115-mav`.
- Caught missing required `skills` property on `avatar_pacto_sangue` during `npx tsc -b` and added `skills: ['Atletismo +7', 'Intimidação +5']`.

## Verification
- `npx tsc -b` -> exited `0` (zero errors)
- Node asset path & JPEG dimension check -> all 9 map presets in `CAMPAIGN_MAP_PRESETS` and all 6 new `MONSTERS_5E` `imageUrl` targets verified present under `public/`
- `npx eslint src/features/map/MapSettingsModal.tsx src/features/monsters/data/monsters5e.ts` -> exited `0` (0 errors; 4 pre-existing warnings in untouched lines of `MapSettingsModal.tsx`)
- Committed implementation as `5268e79`.
