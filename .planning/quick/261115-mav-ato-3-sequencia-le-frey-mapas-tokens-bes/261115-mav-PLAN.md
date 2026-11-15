---
phase: quick-261115-mav
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - public/assets/maps/battlemap_estrada_emboscada.jpg
  - public/assets/maps/battlemap_taverna_valecorvo.jpg
  - public/assets/maps/battlemap_mansao_alistair.jpg
  - public/tokens/token_npc_barao_alistair.jpg
  - public/tokens/token_enemy_capitao_falcao.jpg
  - public/tokens/token_enemy_guarda_elite.jpg
  - public/tokens/token_enemy_batedor_falcao.jpg
  - public/tokens/token_npc_patrona_arquifada.jpg
  - src/features/map/MapSettingsModal.tsx
  - src/features/monsters/data/monsters5e.ts
autonomous: true
requirements:
  - ACT3-MAPS
  - ACT3-TOKENS
  - ACT3-BESTIARY

must_haves:
  truths:
    - "All 3 Act III battlemaps exist in public/assets/maps/ and appear in CAMPAIGN_MAP_PRESETS in MapSettingsModal.tsx"
    - "All 5 new Act III tokens exist in public/tokens/ and their pixel dimensions are verified"
    - "All 6 missing campaign monsters/NPCs (avatar_pacto_sangue, barao_cedric_alistair, capitao_kaelen_falcao, guarda_elite_penedo, cacador_falcao, dama_espinhos_negros) are registered in MONSTERS_5E with valid token URLs and stat blocks matching GUIA_MESTRE_HIPOGEU_DOS_SUSSURROS.md"
    - "TypeScript build (`npx tsc -b`) passes with zero errors"
  artifacts:
    - path: "src/features/map/MapSettingsModal.tsx"
      provides: "Updated CAMPAIGN_MAP_PRESETS with 3 Act III maps (32x18)"
      contains: "battlemap_estrada_emboscada.jpg"
    - path: "src/features/monsters/data/monsters5e.ts"
      provides: "Act III NPCs/enemies + Avatar do Pacto de Sangue in MONSTERS_5E"
      contains: "barao_cedric_alistair"
---

<objective>
Integrate the Act III campaign battlemaps, circular VTT tokens, and Bestiary/NPC stat blocks into the RPG Tabletop codebase so the DM can load all 3 Act III scenes and spawn every Act III enemy/NPC (plus the missing Boss Avatar) directly inside the VTT.

Purpose: Complete the VTT runtime integration of Act III ("Pós-Masmorra, A Marca da Bruxa & A Queda do Barão").
Output: 3 battlemaps in `public/assets/maps/`, 5 tokens in `public/tokens/`, updated `CAMPAIGN_MAP_PRESETS`, updated `MONSTERS_5E`, verified via `npx tsc -b`.
</objective>

<execution_context>
@C:\Users\blakm\OneDrive\Desktop\RPG\rpg-tabletop\.agents\gsd-core\workflows\execute-plan.md
</execution_context>

<context>
@.planning/STATE.md
@src/features/map/MapSettingsModal.tsx
@src/features/monsters/monsterTypes.ts
@src/features/monsters/data/monsters5e.ts
@src/features/monsters/BestiarySidebar.tsx
</context>

<tasks>

<task type="auto">
  <name>Task 1: Copy Act III battlemaps and tokens to public/ and verify asset dimensions</name>
  <files>
    public/assets/maps/battlemap_estrada_emboscada.jpg
    public/assets/maps/battlemap_taverna_valecorvo.jpg
    public/assets/maps/battlemap_mansao_alistair.jpg
    public/tokens/token_npc_barao_alistair.jpg
    public/tokens/token_enemy_capitao_falcao.jpg
    public/tokens/token_enemy_guarda_elite.jpg
    public/tokens/token_enemy_batedor_falcao.jpg
    public/tokens/token_npc_patrona_arquifada.jpg
  </files>
  <action>
Copy the 8 generated JPEG assets from the conversation artifact directory (`C:\Users\blakm\.gemini\antigravity\brain\27110b8d-271c-4184-b187-1a3eb9c4e87a\`) into the project's `public/` directories (creating directories if needed):

Maps (`public/assets/maps/`):
- `battlemap_estrada_emboscada_1794769051383.jpg` -> `public/assets/maps/battlemap_estrada_emboscada.jpg`
- `battlemap_taverna_valecorvo_1794769072473.jpg` -> `public/assets/maps/battlemap_taverna_valecorvo.jpg`
- `battlemap_mansao_alistair_1794769056888.jpg` -> `public/assets/maps/battlemap_mansao_alistair.jpg`

Tokens (`public/tokens/`):
- `token_npc_barao_alistair_1794769057373.jpg` -> `public/tokens/token_npc_barao_alistair.jpg`
- `token_enemy_capitao_falcao_1794769054437.jpg` -> `public/tokens/token_enemy_capitao_falcao.jpg`
- `token_enemy_guarda_elite_1794769184365.jpg` -> `public/tokens/token_enemy_guarda_elite.jpg`
- `token_enemy_batedor_falcao_1794769060508.jpg` -> `public/tokens/token_enemy_batedor_falcao.jpg`
- `token_npc_patrona_arquifada_1794769068579.jpg` -> `public/tokens/token_npc_patrona_arquifada.jpg`

Also verify that `public/assets/tokens/token_enemy_avatar_pacto_sangue.jpg` exists on disk.
Run a quick Node.js script that reads SOF0/SOF2 markers of all 8 copied JPEGs and prints each filename, byte size, and pixel dimensions (`width x height`) to confirm all files are non-empty valid JPEGs.
  </action>
  <verify>
    <automated>node -e "const fs=require('fs'),path=require('path');const files=['public/assets/maps/battlemap_estrada_emboscada.jpg','public/assets/maps/battlemap_taverna_valecorvo.jpg','public/assets/maps/battlemap_mansao_alistair.jpg','public/tokens/token_npc_barao_alistair.jpg','public/tokens/token_enemy_capitao_falcao.jpg','public/tokens/token_enemy_guarda_elite.jpg','public/tokens/token_enemy_batedor_falcao.jpg','public/tokens/token_npc_patrona_arquifada.jpg','public/assets/tokens/token_enemy_avatar_pacto_sangue.jpg'];function getJpg(b){let i=2;while(i<b.length){const m=b.readUInt16BE(i);i+=2;if(m>=0xFFC0&&m<=0xFFC3)return{h:b.readUInt16BE(i+3),w:b.readUInt16BE(i+5)};const l=b.readUInt16BE(i);i+=l;}return null;}for(const f of files){if(!fs.existsSync(f))throw new Error('Missing: '+f);const buf=fs.readFileSync(f);const d=getJpg(buf);console.log(f,buf.length,d?d.w+'x'+d.h:'unknown');}"</automated>
  </verify>
  <done>All 8 new JPEG files copied to `public/`, `token_enemy_avatar_pacto_sangue.jpg` verified present, and valid JPEG dimensions printed for all files.</done>
</task>

<task type="auto">
  <name>Task 2: Add Act III map presets to MapSettingsModal.tsx and Act III monsters/NPCs + Boss Avatar to monsters5e.ts</name>
  <files>
    src/features/map/MapSettingsModal.tsx
    src/features/monsters/data/monsters5e.ts
  </files>
  <action>
1. In `src/features/map/MapSettingsModal.tsx`, append the following 3 Act III presets to the end of `CAMPAIGN_MAP_PRESETS`:
   - `{ name: '🌉 Ponte da Garganta (Ato III)', url: '/assets/maps/battlemap_estrada_emboscada.jpg', width: 32, height: 18, desc: 'Ponte de pedra na garganta, carroça destroçada e emboscada dos mercenários do Falcão' }`
   - `{ name: '🍺 Taverna & Forja (Valecorvo)', url: '/assets/maps/battlemap_taverna_valecorvo.jpg', width: 32, height: 18, desc: 'Estalagem O Corvo Dourado com pátio da forja anã para compras e encaixe de Quartzo Vivo' }`
   - `{ name: '🏰 Banquete Mansão Alistair', url: '/assets/maps/battlemap_mansao_alistair.jpg', width: 32, height: 18, desc: 'Salão nobre de mármore com colunas e estrado do Barão Cedric Alistair em Penedo Alto' }`

2. First inspect `src/features/monsters/monsterTypes.ts` and the existing campaign monster entries in `src/features/monsters/data/monsters5e.ts` so field names, union values, `source: 'DnD5e'`, `system: 'dnd5e'`, and `BestiarySidebar.tsx` Humanoide/NPCs tab rules are respected verbatim.

3. Append 6 campaign entries to `MONSTERS_5E` in `src/features/monsters/data/monsters5e.ts`:
   - `avatar_pacto_sangue`: `O Avatar do Pacto de Sangue`, category `'Constructo'`, cr `5`, size `'Huge'`, imageUrl `'/assets/tokens/token_enemy_avatar_pacto_sangue.jpg'`, hp `95`, ac `15`, speed `9`, initiativeModifier `0`, attributes `FOR 19(+4), DES 10(0), CON 17(+3), INT 10(0), SAB 12(+1), CAR 14(+2)`, damageResistances `['Cortante/Perfurante não-mágico', 'Fogo', 'Necrótico']`, damageVulnerabilities `['Radiante', 'Concussão mágica']`, conditionImmunities `['Amedrontado', 'Enfeitiçado', 'Envenenado', 'Paralisado']`, actions: `Ataque Múltiplo`, `Punho Sísmico de Basalto` (+7, 2d8+4 concussão, FOR CD 14 ou Caído), `Descarga de Quartzo Carmesim` (+5, 18m, 2d10 necrótico/força), `Coração Pulsante / Vozes do Sacrifício` (ability), `Onda Sísmica / Correntes Espectrais (Lendárias)` (ability).
   - `barao_cedric_alistair`: `Barão Cedric Alistair`, category `'Humanoide'`, cr `4`, size `'Medium'`, imageUrl `'/tokens/token_npc_barao_alistair.jpg'`, hp `65`, ac `16`, speed `9`, initiativeModifier `3`, attributes `FOR 10(0), DES 16(+3), CON 14(+2), INT 14(+2), SAB 12(+1), CAR 17(+3)`, skills `['Enganação +7', 'Persuasão +7', 'Intimidação +5', 'Intuição +3']`, actions: `Ataque Múltiplo`, `Rapieira do Pacto de Sinete` (+6, 1d8+3 perfurante + 1d6 necrótico), `Orbe de Sangue do Falcão` (+6, 18m, 2d10 necrótico), `Livro Negro (Fraqueza Narrativa)` (ability), reactions: `Aparar com Anel do Sinete (3/Dia)` (+3 CA contra um ataque, type `'reaction'`).
   - `capitao_kaelen_falcao`: `Capitão Kaelen (Falcão)`, category `'Humanoide'`, cr `3`, size `'Medium'`, imageUrl `'/tokens/token_enemy_capitao_falcao.jpg'`, hp `58`, ac `17`, speed `9`, initiativeModifier `1`, attributes `FOR 16(+3), DES 12(+1), CON 15(+2), INT 11(0), SAB 12(+1), CAR 13(+1)`, skills `['Atletismo +5', 'Intimidação +3', 'Percepção +3']`, actions: `Ataque Múltiplo`, `Alabarda Pesada` (+6, 3m, 1d10+3 cortante), `Besta Pesada` (+4, 30/120m, 1d10+1 perfurante), `Ordem de Execução (Recarrega 5-6)` (ability).
   - `guarda_elite_penedo`: `Guarda de Elite de Penedo Alto`, category `'Humanoide'`, cr `1`, size `'Medium'`, imageUrl `'/tokens/token_enemy_guarda_elite.jpg'`, hp `26`, ac `16`, speed `9`, initiativeModifier `1`, attributes `FOR 14(+2), DES 12(+1), CON 14(+2), INT 10(0), SAB 11(0), CAR 10(0)`, actions: `Lança Pesada de Penedo` (+4, 1,5m / 6-18m, 1d8+2 perfurante), `Formação em Falange (CA 18)` (ability).
   - `cacador_falcao`: `Caçador do Falcão`, category `'Humanoide'`, cr `0.5`, size `'Medium'`, imageUrl `'/tokens/token_enemy_batedor_falcao.jpg'`, hp `19`, ac `14`, speed `10.5`, initiativeModifier `3`, attributes `FOR 11(0), DES 16(+3), CON 12(+1), INT 11(0), SAB 13(+1), CAR 10(0)`, skills `['Furtividade +5', 'Percepção +3', 'Sobrevivência +3']`, actions: `Besta de Caça` (+5, 24/96m, 1d8+3 perfurante + 1d6 com aliado a 1,5m), `Adaga Envenenada` (+5, 1d4+3 perfurante + 1d4 veneno), `Tática Ardilosa (Ação Bônus)` (ability).
   - `dama_espinhos_negros`: `Dama dos Espinhos Negros (Patrona)`, category `'Fada'`, cr `5`, size `'Medium'`, imageUrl `'/tokens/token_npc_patrona_arquifada.jpg'`, hp `84`, ac `16`, speed `9`, initiativeModifier `4`, attributes `FOR 10(0), DES 18(+4), CON 14(+2), INT 16(+3), SAB 15(+2), CAR 20(+5)`, skills `['Arcanismo +7', 'Enganação +9', 'Intimidação +9', 'Percepção +6']`, conditionImmunities `['Enfeitiçado', 'Amedrontado']`, actions: `Marca do Espinho Negro (Narrativa — Le Freyyy)` (ability, 1d6 psíquico/turno ao fugir e bloqueio dos 3 Passos Feéricos até redenção), `Chicote de Rosas Sombrias` (+8, 3m, 2d6+4 cortante + 2d6 psíquico), `Passo das Brumas Lunares` (ability).
   *(Note: Use valid `MonsterAction` property shapes checked from `monsterTypes.ts` and `monsters5e.ts` so `npx tsc -b` passes cleanly.)*

4. Run `npx tsc -b` (and `npm run lint` if helpful, checking only touched files for errors) to confirm clean compilation.
  </action>
  <verify>
    <automated>npx tsc -b</automated>
  </verify>
  <done>`MapSettingsModal.tsx` has the 3 Act III presets, `monsters5e.ts` has all 6 new entries pointing to existing public tokens, and `npx tsc -b` succeeds cleanly.</done>
</task>

</tasks>

<verification>
- Verify every `imageUrl` added to `monsters5e.ts` and every `url` added to `MapSettingsModal.tsx` corresponds to an existing file in `public/`.
- `npx tsc -b` exits 0 with zero TypeScript errors.
</verification>

<success_criteria>
- 3 battlemaps copied to `public/assets/maps/` and selectable in `CAMPAIGN_MAP_PRESETS`
- 5 new tokens copied to `public/tokens/`
- 6 monster/NPC entries added to `MONSTERS_5E`
- `npx tsc -b` passes cleanly
- `261115-mav-SUMMARY.md` created and `.planning/STATE.md` updated
</success_criteria>

<output>
After completion, create `.planning/quick/261115-mav-ato-3-sequencia-le-frey-mapas-tokens-bes/261115-mav-SUMMARY.md`, update `.planning/STATE.md` quick-task table/counters, and commit code/asset/doc changes atomically.
</output>
