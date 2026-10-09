import os

def clean_file(path, replacements):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    for old, new in replacements:
        content = content.replace(old, new)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'Cleaned {path}')

# 1. speciesRules.tsx
clean_file('src/features/rules/data/dnd55e/speciesRules.tsx', [
    ("category: 'Espécies de D&D 2024 (Cap. 4)'", "category: 'Espécies de D&D (Cap. 4)'"),
    ("Traços Raciais Canônicos (2024)", "Traços Raciais Canônicos"),
    ("Oficial D&D 2024", "Oficial D&D 5.5e"),
    ("(ampliado nas regras 2024!)", "(9 metros)"),
    ("(Breath Weapon - Grande Mudança 2024):", "(Breath Weapon):"),
    ("(atualizado em 2024!)", "(9 metros)")
])

# 2. classesRules.tsx
clean_file('src/features/rules/data/dnd55e/classesRules.tsx', [
    ("category: 'Classes de D&D 2024 (Cap. 3)'", "category: 'Classes de D&D (Cap. 3)'"),
    ("Oficial D&D 2024", "Oficial D&D 5.5e"),
    ("(Cunning Strike - A Grande Inovação 2024 no Nv 5!)", "(Cunning Strike)"),
    ("Assassinar 2024", "Assassinar"),
    ("(Memorize Spell - Regra Oficial 2024 no Nv 2)", "(Memorize Spell)"),
    ("(Martial Arts - 1d6 no 1º Nível no 2024!)", "(Martial Arts - 1d6 no 1º Nível)"),
    ("Defesa Paciente 2024", "Defesa Paciente"),
    ("Passo do Vento 2024", "Passo do Vento"),
    ("(Deflect Attacks - A Grande Revolução 2024 no Nv 3)", "(Deflect Attacks)"),
    ("(Lay on Hands 2024)", "(Lay on Hands)"),
    ("Punição Divina Oficial 2024 (Divine Smite)", "Punição Divina (Divine Smite)"),
    ("(Vow of Enmity 2024)", "(Vow of Enmity)")
])

# 3. corePlayerRules.tsx
clean_file('src/features/rules/data/dnd55e/corePlayerRules.tsx', [
    ("Inspiração Heroica (Heroic Inspiration - Regra Oficial 2024)", "Inspiração Heroica (Heroic Inspiration)"),
    ("Ataque Desarmado (Unarmed Strike - Regra Oficial 2024 Sem Rolagem Contestada!)", "Ataque Desarmado (Unarmed Strike)"),
    ("As 15 Condições Oficiais de D&D 2024", "As 15 Condições Oficiais"),
    ("(Exhaustion - A Nova Regra Oficial 2024 de 10 Níveis)", "(Exhaustion - Regra de 10 Níveis)"),
    ("Tabela Oficial dos 16 Antecedentes (PHB 2024)", "Tabela Oficial dos 16 Antecedentes"),
    ("PHB 2024", "PHB Oficial"),
    ("D&D 2024", "D&D 5.5e"),
    ("Dungeons & Dragons 2024", "Dungeons & Dragons 5.5e")
])

# 4. gmRules.tsx
clean_file('src/features/rules/data/dnd55e/gmRules.tsx', [
    ("DMG 2024", "Guia do Mestre"),
    ("Bastião Oficial D&D 2024", "Bastião Oficial"),
    ("Dragão Negro Guardando Tesouro DMG 2024", "Dragão Negro Guardando Tesouro"),
    ("Catálogo de Itens Mágicos Icônicos de 2024", "Catálogo de Itens Mágicos Icônicos")
])

# 5. classFeatureDescriptions.ts
clean_file('src/features/character/data/classFeatureDescriptions.ts', [
    ("No D&D 2024, ", "No D&D 5.5e, "),
    ("no D&D 2024", "no D&D 5.5e"),
    ("No D&D 2024", "No D&D 5.5e"),
    ("D&D 5.5e (2024)", "D&D 5.5e")
])

print('All files cleaned successfully!')
