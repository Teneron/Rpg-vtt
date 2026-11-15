---
phase: quick-261115-qqg
plan: 01
subsystem: vtt-campaign-assets
tags: [valecorvo, dormitories, ambush, battlemap, presets]
requires: []
provides:
  - "2nd-floor dormitories midnight battlemap in public/assets/maps/battlemap_dormitorios_valecorvo.jpg (1376x768)"
  - "VTT preset '🌙 Dormitórios (Valecorvo)' (32x18) in CAMPAIGN_MAP_PRESETS"
  - "Vertical scroll protection (maxHeight: '90vh', overflowY: 'auto') on MapSettingsModal dialog"
affects:
  - src/features/map/MapSettingsModal.tsx
tech-stack:
  added: []
  patterns: []
key-files:
  created:
    - public/assets/maps/battlemap_dormitorios_valecorvo.jpg
  modified:
    - src/features/map/MapSettingsModal.tsx
    - .planning/STATE.md
duration: ~4m
completed: 2026-11-15
---

# Quick Task 261115-qqg Summary

**O Corvo Dourado 2nd-Floor Dormitories Ambush Battlemap & VTT Preset**

## What Was Built
1. Generated and visually verified top-down 16:9 gridless VTT battlemap (`1376x768`, 944,174 bytes) of the 2nd-floor upstairs guest rooms of *"O Corvo Dourado"* inn at midnight (`battlemap_dormitorios_valecorvo.jpg`): 5 furnished bedrooms (2 north, 3 south including a 3-bed shared southeast room), central oak corridor, northeast stairwell ascending from the tavern common room, and snow-dusted exterior balconies with casement windows for stealth entry.
2. Copied asset to `public/assets/maps/battlemap_dormitorios_valecorvo.jpg`.
3. Added `🌙 Dormitórios (Valecorvo)` (`32x18`) preset right after `🍺 Taverna & Forja (Valecorvo)` in `CAMPAIGN_MAP_PRESETS` and added `maxHeight: '90vh', overflowY: 'auto'` to `.glass-panel` in `src/features/map/MapSettingsModal.tsx`.
4. Expanded `ROTEIRO_ATO_3_FORA_DO_TEMPLO.md` with playable **Cena 4: Invasão Noturna nos Dormitórios de "O Corvo Dourado"** (per-room layout guide, Stealth vs. Passive Perception DCs, night armor/donning mechanics, Black Book heist routes, enemy tactics, and Penedo Alto clues).

## Verification
- `npm run build` (`tsc -b && vite build`) -> exited `0` (2446 modules transformed, built in 9.40s)
- `npx eslint src/features/map/MapSettingsModal.tsx` -> exited `0` (0 errors; 4 pre-existing warnings)
- Node preset script verified all 11 presets in `CAMPAIGN_MAP_PRESETS` exist under both `public/` and `dist/`
- Committed implementation as `4b6bc88`.
