---
phase: quick-261115-qqg
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - public/assets/maps/battlemap_dormitorios_valecorvo.jpg
  - src/features/map/MapSettingsModal.tsx
autonomous: true
requirements:
  - VALECORVO-DORMITORIES-AMBUSH
must_haves:
  truths:
    - "public/assets/maps/battlemap_dormitorios_valecorvo.jpg exists on disk (16:9 VTT battlemap)"
    - "CAMPAIGN_MAP_PRESETS includes '🌙 Dormitórios (Valecorvo)' pointing to /assets/maps/battlemap_dormitorios_valecorvo.jpg (32x18)"
    - "MapSettingsModal dialog supports vertical scrolling via maxHeight and overflowY: auto so all 11 presets stay accessible"
    - "npm run build (tsc -b + vite build) and eslint pass with zero errors"
  artifacts:
    - path: "src/features/map/MapSettingsModal.tsx"
      provides: "2nd-floor dormitories preset in CAMPAIGN_MAP_PRESETS and scrollable modal container"
      contains: "battlemap_dormitorios_valecorvo.jpg"
---

<objective>
Create and integrate the 2nd-floor dormitories night-invasion battlemap (`battlemap_dormitorios_valecorvo.jpg`, `32x18`) for *"O Corvo Dourado"* inn in Valecorvo, add it to `CAMPAIGN_MAP_PRESETS` (alongside modal vertical scroll protection), and update the Act III DM guide (`ROTEIRO_ATO_3_FORA_DO_TEMPLO.md`) with the full midnight ambush encounter.
</objective>

<tasks>

<task type="auto">
  <name>Task 1: Integrate Valecorvo dormitories battlemap asset and VTT preset</name>
  <files>
    public/assets/maps/battlemap_dormitorios_valecorvo.jpg
    src/features/map/MapSettingsModal.tsx
  </files>
  <action>
Inspect the generated battlemap JPEG visually and verify dimensions, copy it to `public/assets/maps/battlemap_dormitorios_valecorvo.jpg`, insert the `'🌙 Dormitórios (Valecorvo)'` (`32x18`) preset right after `'🍺 Taverna & Forja (Valecorvo)'` in `CAMPAIGN_MAP_PRESETS`, and add `maxHeight: '90vh', overflowY: 'auto'` to the `.glass-panel` container in `MapSettingsModal.tsx`.
  </action>
  <verify>
    <automated>npm run build && npx eslint src/features/map/MapSettingsModal.tsx</automated>
  </verify>
  <done>Battlemap asset copied, preset registered, modal scrolls cleanly, and Vite + TypeScript + ESLint checks pass cleanly.</done>
</task>

</tasks>
