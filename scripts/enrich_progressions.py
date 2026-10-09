import json
import re

with open('src/features/character/data/classProgressions.ts', 'r', encoding='utf-8') as f:
    text = f.read()

m = re.search(r'export const CLASS_PROGRESSIONS: Record<string, FullClassProgression> = (\{[\s\S]*?\n\};)', text)
if not m:
    print('Failed to find CLASS_PROGRESSIONS')
    exit(1)

json_str = m.group(1).rstrip(';')
data = json.loads(json_str)

# 1. FIGHTER
fighter = data['fighter']
# Keep existing columns or replace with enriched set
fighter['columns'] = [
    {
        "key": "attacks",
        "label": "Ataques",
        "tooltip": "Número de ataques realizados com a Ação Atacar",
        "align": "center"
    },
    {
        "key": "secondWind",
        "label": "Retomar Fôlego",
        "tooltip": "Usos de Retomar o Fôlego por descanso (recupera 1d10 + nível em PV)",
        "align": "center"
    },
    {
        "key": "actionSurge",
        "label": "Surto de Ação",
        "tooltip": "Ação adicional no turno (recupera em descanso curto/longo)",
        "align": "center"
    },
    {
        "key": "indomitable",
        "label": "Indomável",
        "tooltip": "Re-rolar salvaguarda com bônus igual ao seu nível de guerreiro",
        "align": "center"
    },
    {
        "key": "weaponMastery",
        "label": "Maestrias em Armas",
        "tooltip": "Número de armas com propriedades de maestria dominadas simultaneamente",
        "align": "center"
    }
]

for row in fighter['rows']:
    lvl = row['level']
    # attacks
    if lvl >= 20:
        row['values']['attacks'] = "4"
    elif lvl >= 11:
        row['values']['attacks'] = "3"
    elif lvl >= 5:
        row['values']['attacks'] = "2"
    else:
        row['values']['attacks'] = "1"

    # actionSurge
    if lvl >= 17:
        row['values']['actionSurge'] = "2 usos"
    elif lvl >= 2:
        row['values']['actionSurge'] = "1 uso"
    else:
        row['values']['actionSurge'] = "—"

    # indomitable
    if lvl >= 17:
        row['values']['indomitable'] = "3 usos (+17)"
    elif lvl >= 13:
        row['values']['indomitable'] = "2 usos (+13)"
    elif lvl >= 9:
        row['values']['indomitable'] = "1 uso (+9)"
    else:
        row['values']['indomitable'] = "—"

    # secondWind
    if lvl >= 10:
        row['values']['secondWind'] = "4 usos"
    elif lvl >= 4:
        row['values']['secondWind'] = "3 usos"
    else:
        row['values']['secondWind'] = "2 usos"

    # weaponMastery
    if lvl >= 16:
        row['values']['weaponMastery'] = "6 armas"
    elif lvl >= 10:
        row['values']['weaponMastery'] = "5 armas"
    elif lvl >= 4:
        row['values']['weaponMastery'] = "4 armas"
    else:
        row['values']['weaponMastery'] = "3 armas"

# 2. BARBARIAN
barb = data['barbarian']
barb['columns'] = [
    {
        "key": "attacks",
        "label": "Ataques",
        "tooltip": "Número de ataques realizados com a Ação Atacar",
        "align": "center"
    },
    {
        "key": "rages",
        "label": "Fúrias",
        "tooltip": "Usos de Fúria por Descanso Longo",
        "align": "center"
    },
    {
        "key": "rageDamage",
        "label": "Dano de Fúria",
        "tooltip": "Bônus somado a jogadas de dano corpo a corpo com Força",
        "align": "center"
    },
    {
        "key": "brutalStrike",
        "label": "Golpe Brutal",
        "tooltip": "Dano e controle concedidos ao abrir mão de Vantagem no Ataque Imprudente",
        "align": "center"
    },
    {
        "key": "weaponMastery",
        "label": "Maestrias",
        "tooltip": "Propriedades de Maestria de armas ativas",
        "align": "center"
    }
]

for row in barb['rows']:
    lvl = row['level']
    row['values']['attacks'] = "2" if lvl >= 5 else "1"
    if lvl >= 17:
        row['values']['brutalStrike'] = "+2d10 (2 efeitos)"
    elif lvl >= 13:
        row['values']['brutalStrike'] = "+1d10 (2 efeitos)"
    elif lvl >= 9:
        row['values']['brutalStrike'] = "+1d10"
    else:
        row['values']['brutalStrike'] = "—"

# 3. ROGUE
rogue = data['rogue']
rogue['columns'] = [
    {
        "key": "sneakAttack",
        "label": "Ataque Furtivo",
        "tooltip": "Dano adicional ao acertar com Vantagem ou aliado adjacente",
        "align": "center"
    },
    {
        "key": "cunningStrike",
        "label": "Golpe Ladino (Cunning Strike)",
        "tooltip": "Efeitos táticos aplicados sacrificando dados de dano furtivo",
        "align": "center"
    },
    {
        "key": "steadyAim",
        "label": "Mira Firme",
        "tooltip": "Ação Bônus para Vantagem na jogada de ataque (deslocamento 0)",
        "align": "center"
    },
    {
        "key": "weaponMastery",
        "label": "Maestrias",
        "tooltip": "Armas com propriedades de Maestria ativas",
        "align": "center"
    }
]

for row in rogue['rows']:
    lvl = row['level']
    if lvl >= 14:
        row['values']['cunningStrike'] = "Golpe Duplo (2 efeitos)"
    elif lvl >= 11:
        row['values']['cunningStrike'] = "Aprimorado (1d6)"
    elif lvl >= 5:
        row['values']['cunningStrike'] = "Desarmar / Veneno / Derrubar"
    else:
        row['values']['cunningStrike'] = "—"

    row['values']['steadyAim'] = "Ativo" if lvl >= 3 else "—"

# 4. MONK
monk = data['monk']
monk['columns'] = [
    {
        "key": "attacks",
        "label": "Ataques",
        "tooltip": "Número de ataques realizados com a Ação Atacar",
        "align": "center"
    },
    {
        "key": "martialArts",
        "label": "Artes Marciais",
        "tooltip": "Dado de dano dos ataques desarmados",
        "align": "center"
    },
    {
        "key": "focusPoints",
        "label": "Pontos de Foco",
        "tooltip": "Pontos de energia para Rajada de Golpes, Passo do Vento e Defesa Paciente",
        "align": "center"
    },
    {
        "key": "deflectAttacks",
        "label": "Aparar Ataques",
        "tooltip": "Redução de dano de ataques corpo a corpo e à distância como Reação",
        "align": "center"
    },
    {
        "key": "unarmoredSpeed",
        "label": "Mov. Sem Armadura",
        "tooltip": "Bônus de deslocamento enquanto desarmado e sem armadura",
        "align": "center"
    }
]

for row in monk['rows']:
    lvl = row['level']
    row['values']['attacks'] = "2" if lvl >= 5 else "1"
    row['values']['deflectAttacks'] = "1d10 + DES + Nv" if lvl >= 3 else "—"

# 5. PALADIN
paladin = data['paladin']
# Insert attacks column as first or after channelDivinity
paladin['columns'] = [
    {
        "key": "attacks",
        "label": "Ataques",
        "tooltip": "Número de ataques realizados com a Ação Atacar",
        "align": "center"
    }
] + paladin['columns']

for row in paladin['rows']:
    lvl = row['level']
    row['values']['attacks'] = "2" if lvl >= 5 else "1"

# 6. RANGER
ranger = data['ranger']
ranger['columns'] = [
    {
        "key": "attacks",
        "label": "Ataques",
        "tooltip": "Número de ataques realizados com a Ação Atacar",
        "align": "center"
    }
] + ranger['columns']

for row in ranger['rows']:
    lvl = row['level']
    row['values']['attacks'] = "2" if lvl >= 5 else "1"

# Serialize back
new_json = json.dumps(data, ensure_ascii=False, indent=2)
new_content = text[:m.start(1)] + new_json + ';\n'

with open('src/features/character/data/classProgressions.ts', 'w', encoding='utf-8') as f:
    f.write(new_content)

print('Enriched all class progressions successfully!')
