import json
import re
import os

with open('extracted_tables.json', 'r', encoding='utf-8') as f:
    tables = json.load(f)

# Comprehensive feature text cleaner for Portuguese
REPLACEMENTS = {
    r'F\ufffdria': 'Fúria',
    r'f\ufffdria': 'fúria',
    r'N\ufffdvel': 'Nível',
    r'n\ufffdvel': 'nível',
    r'N\ufffdveis': 'Níveis',
    r'n\ufffdveis': 'níveis',
    r'voc\ufffd': 'você',
    r'Voc\ufffd': 'Você',
    r't\ufffdm': 'têm',
    r'tamb\ufffdm': 'também',
    r'al\ufffdm': 'além',
    r'Al\ufffdm': 'Além',
    r'b\ufffdnus': 'bônus',
    r'B\ufffdnus': 'Bônus',
    r'Inspira\ufffdo': 'Inspiração',
    r'inspira\ufffdo': 'inspiração',
    r'Invoca\ufffdes': 'Invocações',
    r'invoca\ufffdes': 'invocações',
    r'Invoca\ufffdo': 'Invocação',
    r'invoca\ufffdo': 'invocação',
    r'Conjura\ufffdo': 'Conjuração',
    r'conjura\ufffdo': 'conjuração',
    r'A\ufffdo': 'Ação',
    r'a\ufffdo': 'ação',
    r'A\ufffdes': 'Ações',
    r'a\ufffdes': 'ações',
    r'Subclasse B\ufffdrbaro': 'Subclasse de Bárbaro',
    r'B\ufffdrbaro': 'Bárbaro',
    r'b\ufffdrbaro': 'bárbaro',
    r'For\ufffda': 'Força',
    r'for\ufffda': 'força',
    r'Aumento no Valor de Atributo': 'Aumento no Valor de Atributo (ASI / Talento)',
    r'D\ufffddiva \ufffdpica': 'Dádiva Épica (Epic Boon)',
    r'Caracter\ufffdstica de Subclasse': 'Característica de Subclasse',
    r'Caracter\ufffdstica de subclasse': 'Característica de Subclasse',
    r'Caracter\ufffdsticas de Subclasse': 'Características de Subclasse',
    r'Caracter\ufffdstica': 'Característica',
    r'caracter\ufffdstica': 'característica',
    r'Especializa\ufffdo': 'Especialização',
    r'especializa\ufffdo': 'especialização',
    r'Percep\ufffdo': 'Percepção',
    r'percep\ufffdo': 'percepção',
    r'Intimida\ufffdo': 'Intimidação',
    r'intimida\ufffdo': 'intimidação',
    r'Constitui\ufffdo': 'Constituição',
    r'constitui\ufffdo': 'constituição',
    r'Condi\ufffdo': 'Condição',
    r'condi\ufffdo': 'condição',
    r'Feiti\ufffcaria': 'Feitiçaria',
    r'feiti\ufffcaria': 'feitiçaria',
    r'Feiti\ufffco': 'Feitiço',
    r'feiti\ufffco': 'feitiço',
    r'Feitieira': 'Feiticeira',
    r'Aben\ufffdoada': 'Abençoada',
    r'aben\ufffdoada': 'abençoada',
    r'Aben\ufffdoado': 'Abençoado',
    r'abenoado': 'abençoado',
    r'Aben\ufffdoados': 'Abençoados',
    r'aben\ufffdoados': 'abençoados',
    r'Prote\ufffdo': 'Proteção',
    r'prote\ufffdo': 'proteção',
    r'Destrui\ufffdo': 'Destruição',
    r'destrui\ufffdo': 'destruição',
    r'Interven\ufffdo': 'Intervenção',
    r'interven\ufffdo': 'intervenção',
    r'Recupera\ufffdo': 'Recuperação',
    r'recupera\ufffdo': 'recuperação',
    r'Restaura\ufffdo': 'Restauração',
    r'restaura\ufffdo': 'restauração',
    r'Cria\ufffdo': 'Criação',
    r'cria\ufffdo': 'criação',
    r'Evas\ufffdo': 'Evasão',
    r'evas\ufffdo': 'evasão',
    r'Confi\ufffdvel': 'Confiável',
    r'confi\ufffdvel': 'confiável',
    r'Implac\ufffdvel': 'Implacável',
    r'implac\ufffdvel': 'implacável',
    r'Indom\ufffdvel': 'Indomável',
    r'indom\ufffdvel': 'indomável',
    r'Resili\ufffdncia': 'Resiliência',
    r'resili\ufffdncia': 'resiliência',
    r'Apar\ufffdncia': 'Aparência',
    r'apar\ufffdncia': 'aparência',
    r'Presen\ufffda': 'Presença',
    r'presen\ufffda': 'presença',
    r'M\ufffdgica': 'Mágica',
    r'm\ufffdgica': 'mágica',
    r'M\ufffdgico': 'Mágico',
    r'm\ufffdgico': 'mágico',
    r'M\ufffdgicos': 'Mágicos',
    r'm\ufffdgicos': 'mágico',
    r'M\ufffdgicas': 'Mágicas',
    r'm\ufffdgicas': 'mágicas',
    r'M\ufffdstica': 'Mística',
    r'm\ufffdstica': 'mística',
    r'M\ufffdstico': 'Místico',
    r'm\ufffdstico': 'místico',
    r'M\ufffdsticos': 'Místicos',
    r'm\ufffdsticos': 'místicos',
    r'M\ufffdsticas': 'Místicas',
    r'm\ufffdsticas': 'místicas',
    r'T\ufffdtica': 'Tática',
    r't\ufffdtica': 'tática',
    r'T\ufffdtico': 'Tático',
    r't\ufffdtico': 'tático',
    r'T\ufffdticos': 'Táticos',
    r't\ufffdticos': 'táticos',
    r'Acr\ufffdscimo': 'Acréscimo',
    r'acr\ufffdscimo': 'acréscimo',
    r'Espa\ufffdo': 'Espaço',
    r'espa\ufffdo': 'espaço',
    r'Espa\ufffdos': 'Espaços',
    r'espa\ufffdos': 'espaços',
    r'C\ufffdrculo': 'Círculo',
    r'c\ufffdrculo': 'círculo',
    r'G\ufffdria dos Ladr\ufffdes': 'Gíria dos Ladrões',
    r'G\ufffdria': 'Gíria',
    r'g\ufffdria': 'gíria',
    r'Ladr\ufffdes': 'Ladrões',
    r'ladr\ufffdes': 'ladrões',
    r'M\ufffdos Consagradas': 'Imposição das Mãos',
    r'M\ufffdos': 'Mãos',
    r'm\ufffdos': 'mãos',
    r'M\ufffdo': 'Mão',
    r'm\ufffdo': 'mão',
    r'N\ufffdo': 'Não',
    r'n\ufffdo': 'não',
    r'S\ufffdo': 'São',
    r's\ufffdo': 'são',
    r'Est\ufffd': 'Está',
    r'est\ufffd': 'está',
    r'Est\ufffdo': 'Estão',
    r'est\ufffdo': 'estão',
    r'At\ufffd': 'Até',
    r'at\ufffd': 'até',
    r'J\ufffd': 'Já',
    r'j\ufffd': 'já',
    r'D\ufffd': 'Dá',
    r'd\ufffd': 'dá',
    r'H\ufffd': 'Há',
    r'h\ufffd': 'há',
    r'S\ufffd': 'Só',
    r's\ufffd': 'só',
    r'F\ufffdlego': 'Fôlego',
    r'f\ufffdlego': 'fôlego',
    r'Drudico': 'Druídico',
    r'Dru\ufffddico': 'Druídico',
    r'drudico': 'druídico',
    r'dru\ufffddico': 'druídico',
    r'Clrigo': 'Clérigo',
    r'Cl\ufffdrigo': 'Clérigo',
    r'clrigo': 'clérigo',
    r'cl\ufffdrigo': 'clérigo',
    r'Subclasse Cl\ufffdrigo': 'Subclasse de Clérigo',
    r'Subclasse Ladino': 'Subclasse de Ladino',
    r'R\ufffdpido': 'Rápido',
    r'r\ufffdpido': 'rápido',
    r'H\ufffdbil': 'Hábil',
    r'h\ufffdbil': 'hábil',
    r'Incans\ufffdvel': 'Incansável',
    r'incans\ufffdvel': 'incansável',
    r'V\ufffdu da Natureza': 'Véu da Natureza',
    r'V\ufffdu': 'Véu',
    r'v\ufffdu': 'véu',
    r'Tr\ufffds': 'Três',
    r'tr\ufffds': 'três',
    r'Acrob\ufffdtico': 'Acrobático',
    r'acrob\ufffdtico': 'acrobático',
    r'Campe\ufffdo': 'Campeão',
    r'campe\ufffdo': 'campeão',
    r'Ast\ufffdcia': 'Astúcia',
    r'ast\ufffdcia': 'astúcia',
    r'Guardi\ufffdo': 'Guardião',
    r'guardi\ufffdo': 'guardião',
    r'Acad\ufffdmico': 'Acadêmico',
    r'acad\ufffdmico': 'acadêmico',
    r'Subclasse Feiticeiro': 'Subclasse de Feiticeiro',
    r'Subclasse Guerreiro': 'Subclasse de Guerreiro',
    r'Subclasse Monge': 'Subclasse de Monge',
    r'Subclasse Paladino': 'Subclasse de Paladino',
    r'Subclasse Mago': 'Subclasse de Mago',
    r'Subclasse Druida': 'Subclasse de Druida',
    r'Subclasse Bardo': 'Subclasse de Bardo',
    r'Subclasse Bruxo': 'Subclasse de Bruxo',
    r'Subclasse Guardi\ufffdo': 'Subclasse de Guardião',
    r'Subclasse Ladino': 'Subclasse de Ladino'
}

def clean_text(text):
    if not text:
        return ''
    for pattern, rep in REPLACEMENTS.items():
        text = re.sub(pattern, rep, text)
    # clean remaining weird characters
    text = text.replace('\ufffd', '')
    return text.strip()

METADATA = {
    'barbarian': {
        'className': 'Bárbaro',
        'system': 'dnd55e',
        'hitDie': 'd12',
        'primaryAbility': 'Força',
        'savingThrows': ['Força', 'Constituição'],
        'armorProficiencies': ['Leve', 'Média', 'Escudos'],
        'weaponProficiencies': ['Simples', 'Marciais'],
        'hasSpellcasting': False,
        'columns': [
            {'key': 'rages', 'label': 'Fúrias', 'tooltip': 'Usos de Fúria por Descanso Longo', 'align': 'center'},
            {'key': 'rageDamage', 'label': 'Dano de Fúria', 'tooltip': 'Bônus somado a jogadas de dano corpo a corpo com Força', 'align': 'center'},
            {'key': 'weaponMastery', 'label': 'Maestrias em Armas', 'tooltip': 'Propriedades de Maestria de armas ativas', 'align': 'center'}
        ],
        'col_map': {3: 'rages', 4: 'rageDamage', 5: 'weaponMastery'},
        'subclasses': [
            {'id': 'berserker', 'name': 'Berserker', 'description': 'Frenesi violento com dano extra colossal por turno, Ataque Retaliatório com Reação e imunidade a Medo e Encantamento.', 'milestoneLevels': [3, 6, 10, 14]},
            {'id': 'wild_heart', 'name': 'Coração Selvagem', 'description': 'Sintonia espiritual com animais totêmicos (Urso, Águia, Lobo) concedendo resistências a quase todo tipo de dano e fúrias místicas.', 'milestoneLevels': [3, 6, 10, 14]},
            {'id': 'world_tree', 'name': 'Árvore do Mundo', 'description': 'Canaliza a energia cósmica de Yggdrasil: concede PV temporários vitalícios para aliados e teletransporta através de raízes planares.', 'milestoneLevels': [3, 6, 10, 14]},
            {'id': 'zealot', 'name': 'Fanático', 'description': 'Fúria sagrada imbuída de poder radiante ou necrótico dos deuses, transcendendo a própria morte enquanto estiver em fúria.', 'milestoneLevels': [3, 6, 10, 14]}
        ]
    },
    'bard': {
        'className': 'Bardo',
        'system': 'dnd55e',
        'hitDie': 'd8',
        'primaryAbility': 'Carisma',
        'savingThrows': ['Destreza', 'Carisma'],
        'armorProficiencies': ['Leve'],
        'weaponProficiencies': ['Simples'],
        'hasSpellcasting': True,
        'spellcastingType': 'full',
        'columns': [
            {'key': 'bardicDie', 'label': 'Dado de Inspiração', 'tooltip': 'Dado concedido a aliados com Inspiração de Bardo', 'align': 'center'},
            {'key': 'cantrips', 'label': 'Truques', 'tooltip': 'Truques de bardo conhecidos', 'align': 'center'},
            {'key': 'prepSpells', 'label': 'Magias Prep.', 'tooltip': 'Número de magias preparadas disponíveis', 'align': 'center'},
            {'key': 'slot1', 'label': '1º', 'isSpellSlot': True, 'align': 'center'},
            {'key': 'slot2', 'label': '2º', 'isSpellSlot': True, 'align': 'center'},
            {'key': 'slot3', 'label': '3º', 'isSpellSlot': True, 'align': 'center'},
            {'key': 'slot4', 'label': '4º', 'isSpellSlot': True, 'align': 'center'},
            {'key': 'slot5', 'label': '5º', 'isSpellSlot': True, 'align': 'center'},
            {'key': 'slot6', 'label': '6º', 'isSpellSlot': True, 'align': 'center'},
            {'key': 'slot7', 'label': '7º', 'isSpellSlot': True, 'align': 'center'},
            {'key': 'slot8', 'label': '8º', 'isSpellSlot': True, 'align': 'center'},
            {'key': 'slot9', 'label': '9º', 'isSpellSlot': True, 'align': 'center'}
        ],
        'col_map': {3: 'bardicDie', 4: 'cantrips', 5: 'prepSpells', 6: 'slot1', 7: 'slot2', 8: 'slot3', 9: 'slot4', 10: 'slot5', 11: 'slot6', 12: 'slot7', 13: 'slot8', 14: 'slot9'},
        'subclasses': [
            {'id': 'dance', 'name': 'Colégio da Dança', 'description': 'Combate desarmado ágil, esquiva rítmica e bônus de iniciativa compartilhados com aliados.', 'milestoneLevels': [3, 6, 14]},
            {'id': 'glamour', 'name': 'Colégio do Glamour', 'description': 'Presença feérica deslumbrante que hipnotiza multidões e concede manto de inspiração régia.', 'milestoneLevels': [3, 6, 14]},
            {'id': 'lore', 'name': 'Colégio do Conhecimento', 'description': 'Palavras cortantes que atrapalham inimigos e segredos mágicos adicionais de qualquer lista de magias.', 'milestoneLevels': [3, 6, 14]},
            {'id': 'valor', 'name': 'Colégio da Bravura', 'description': 'Proficiência em armaduras médias, escudos, armas marciais e ataques adicionais canalizando magias de combate.', 'milestoneLevels': [3, 6, 14]}
        ]
    },
    'warlock': {
        'className': 'Bruxo',
        'system': 'dnd55e',
        'hitDie': 'd8',
        'primaryAbility': 'Carisma',
        'savingThrows': ['Sabedoria', 'Carisma'],
        'armorProficiencies': ['Leve'],
        'weaponProficiencies': ['Simples'],
        'hasSpellcasting': True,
        'spellcastingType': 'pact',
        'columns': [
            {'key': 'invocations', 'label': 'Invocações', 'tooltip': 'Invocações Místicas conhecidas ativas', 'align': 'center'},
            {'key': 'cantrips', 'label': 'Truques', 'tooltip': 'Truques de bruxo conhecidos', 'align': 'center'},
            {'key': 'prepSpells', 'label': 'Magias Prep.', 'tooltip': 'Magias preparadas de bruxo', 'align': 'center'},
            {'key': 'pactSlots', 'label': 'Espaços de Pacto', 'tooltip': 'Espaços de magia que recarregam em Descanso Curto', 'align': 'center'},
            {'key': 'slotLevel', 'label': 'Círculo do Espaço', 'tooltip': 'Círculo máximo em que todos os espaços de pacto são conjurados', 'align': 'center'}
        ],
        'col_map': {3: 'invocations', 4: 'cantrips', 5: 'prepSpells', 6: 'pactSlots', 7: 'slotLevel'},
        'subclasses': [
            {'id': 'archfey', 'name': 'A Arquifada', 'description': 'Passo nebuloso aprimorado com efeitos feéricos, teletransporte defensivo e charme ilusório.', 'milestoneLevels': [3, 6, 10, 14]},
            {'id': 'celestial', 'name': 'O Celestial', 'description': 'Luz curativa radiante, feixes sagrados e resiliência celestial com pontos de vida temporários.', 'milestoneLevels': [3, 6, 10, 14]},
            {'id': 'fiend', 'name': 'O Corruptor', 'description': 'Bênção do Obscuro que suga vitalidade de criaturas abatidas e sorte infernal em rolagens de dados.', 'milestoneLevels': [3, 6, 10, 14]},
            {'id': 'great_old_one', 'name': 'O Grande Antigo', 'description': 'Telepatia mental desperta, feitiços psíquicos do Reino Distante e proteção contra leitura mental.', 'milestoneLevels': [3, 6, 10, 14]}
        ]
    },
    'cleric': {
        'className': 'Clérigo',
        'system': 'dnd55e',
        'hitDie': 'd8',
        'primaryAbility': 'Sabedoria',
        'savingThrows': ['Sabedoria', 'Carisma'],
        'armorProficiencies': ['Leve', 'Média', 'Escudos (Pesada com Protetor)'],
        'weaponProficiencies': ['Simples (Marciais com Protetor)'],
        'hasSpellcasting': True,
        'spellcastingType': 'full',
        'columns': [
            {'key': 'channelDivinity', 'label': 'Canalizar Divindade', 'tooltip': 'Usos de Canalizar Divindade por descanso', 'align': 'center'},
            {'key': 'cantrips', 'label': 'Truques', 'tooltip': 'Truques divinos conhecidos', 'align': 'center'},
            {'key': 'prepSpells', 'label': 'Magias Prep.', 'tooltip': 'Número de magias divinas preparadas', 'align': 'center'},
            {'key': 'slot1', 'label': '1º', 'isSpellSlot': True, 'align': 'center'},
            {'key': 'slot2', 'label': '2º', 'isSpellSlot': True, 'align': 'center'},
            {'key': 'slot3', 'label': '3º', 'isSpellSlot': True, 'align': 'center'},
            {'key': 'slot4', 'label': '4º', 'isSpellSlot': True, 'align': 'center'},
            {'key': 'slot5', 'label': '5º', 'isSpellSlot': True, 'align': 'center'},
            {'key': 'slot6', 'label': '6º', 'isSpellSlot': True, 'align': 'center'},
            {'key': 'slot7', 'label': '7º', 'isSpellSlot': True, 'align': 'center'},
            {'key': 'slot8', 'label': '8º', 'isSpellSlot': True, 'align': 'center'},
            {'key': 'slot9', 'label': '9º', 'isSpellSlot': True, 'align': 'center'}
        ],
        'col_map': {3: 'channelDivinity', 4: 'cantrips', 5: 'prepSpells', 6: 'slot1', 7: 'slot2', 8: 'slot3', 9: 'slot4', 10: 'slot5', 11: 'slot6', 12: 'slot7', 13: 'slot8', 14: 'slot9'},
        'subclasses': [
            {'id': 'life', 'name': 'Domínio da Vida', 'description': 'Discípulo da vida que potencializa curas, restaura vitalidade de aliados caídos e recebe armaduras pesadas.', 'milestoneLevels': [3, 6, 17]},
            {'id': 'light', 'name': 'Domínio da Luz', 'description': 'Luz ofuscante que impõe desvantagem em ataques contra você e magias devastadoras de fogo e radiação solar.', 'milestoneLevels': [3, 6, 17]},
            {'id': 'trickery', 'name': 'Domínio da Trapaça', 'description': 'Bênção do trapaceiro, duplicata ilusória perfeita que canaliza magias à distância e furtividade sobrenatural.', 'milestoneLevels': [3, 6, 17]},
            {'id': 'war', 'name': 'Domínio da Guerra', 'description': 'Sacerdote da Guerra com ataques adicionais de ação bônus, precisão guiada divinamente e armas marciais.', 'milestoneLevels': [3, 6, 17]}
        ]
    },
    'druid': {
        'className': 'Druida',
        'system': 'dnd55e',
        'hitDie': 'd8',
        'primaryAbility': 'Sabedoria',
        'savingThrows': ['Inteligência', 'Sabedoria'],
        'armorProficiencies': ['Leve', 'Média', 'Escudos'],
        'weaponProficiencies': ['Simples'],
        'hasSpellcasting': True,
        'spellcastingType': 'full',
        'columns': [
            {'key': 'wildShape', 'label': 'Forma Selvagem', 'tooltip': 'Usos de Forma Selvagem por descanso', 'align': 'center'},
            {'key': 'cantrips', 'label': 'Truques', 'tooltip': 'Truques primordiais conhecidos', 'align': 'center'},
            {'key': 'prepSpells', 'label': 'Magias Prep.', 'tooltip': 'Magias primordiais preparadas', 'align': 'center'},
            {'key': 'slot1', 'label': '1º', 'isSpellSlot': True, 'align': 'center'},
            {'key': 'slot2', 'label': '2º', 'isSpellSlot': True, 'align': 'center'},
            {'key': 'slot3', 'label': '3º', 'isSpellSlot': True, 'align': 'center'},
            {'key': 'slot4', 'label': '4º', 'isSpellSlot': True, 'align': 'center'},
            {'key': 'slot5', 'label': '5º', 'isSpellSlot': True, 'align': 'center'},
            {'key': 'slot6', 'label': '6º', 'isSpellSlot': True, 'align': 'center'},
            {'key': 'slot7', 'label': '7º', 'isSpellSlot': True, 'align': 'center'},
            {'key': 'slot8', 'label': '8º', 'isSpellSlot': True, 'align': 'center'},
            {'key': 'slot9', 'label': '9º', 'isSpellSlot': True, 'align': 'center'}
        ],
        'col_map': {3: 'wildShape', 4: 'cantrips', 5: 'prepSpells', 6: 'slot1', 7: 'slot2', 8: 'slot3', 9: 'slot4', 10: 'slot5', 11: 'slot6', 12: 'slot7', 13: 'slot8', 14: 'slot9'},
        'subclasses': [
            {'id': 'land', 'name': 'Círculo da Terra', 'description': 'Recuperação natural de espaços de magia em descanso curto e listas temáticas de biomas (Ártico, Deserto, Floresta, etc.).', 'milestoneLevels': [3, 6, 10, 14]},
            {'id': 'moon', 'name': 'Círculo da Lua', 'description': 'Mestre supremo da Forma Selvagem: feras colossais com CA aprimorada, cura com ação bônus e ataques radiantes.', 'milestoneLevels': [3, 6, 10, 14]},
            {'id': 'sea', 'name': 'Círculo do Mar', 'description': 'Fúria dos oceanos, tempestades elétricas ao redor do corpo e ondas impetuosas que repelem adversários.', 'milestoneLevels': [3, 6, 10, 14]},
            {'id': 'stars', 'name': 'Círculo das Estrelas', 'description': 'Mapeamento celestial e Formas Estelares (Arqueiro, Cálice, Dragão) que potencializam ataques, curas e concentração.', 'milestoneLevels': [3, 6, 10, 14]}
        ]
    },
    'sorcerer': {
        'className': 'Feiticeiro',
        'system': 'dnd55e',
        'hitDie': 'd6',
        'primaryAbility': 'Carisma',
        'savingThrows': ['Constituição', 'Carisma'],
        'armorProficiencies': ['Nenhuma'],
        'weaponProficiencies': ['Simples'],
        'hasSpellcasting': True,
        'spellcastingType': 'full',
        'columns': [
            {'key': 'sorceryPoints', 'label': 'Pontos de Feitiçaria', 'tooltip': 'Pontos de metamagia e criação de espaços', 'align': 'center'},
            {'key': 'cantrips', 'label': 'Truques', 'tooltip': 'Truques inatos conhecidos', 'align': 'center'},
            {'key': 'prepSpells', 'label': 'Magias Prep.', 'tooltip': 'Magias inatas preparadas', 'align': 'center'},
            {'key': 'slot1', 'label': '1º', 'isSpellSlot': True, 'align': 'center'},
            {'key': 'slot2', 'label': '2º', 'isSpellSlot': True, 'align': 'center'},
            {'key': 'slot3', 'label': '3º', 'isSpellSlot': True, 'align': 'center'},
            {'key': 'slot4', 'label': '4º', 'isSpellSlot': True, 'align': 'center'},
            {'key': 'slot5', 'label': '5º', 'isSpellSlot': True, 'align': 'center'},
            {'key': 'slot6', 'label': '6º', 'isSpellSlot': True, 'align': 'center'},
            {'key': 'slot7', 'label': '7º', 'isSpellSlot': True, 'align': 'center'},
            {'key': 'slot8', 'label': '8º', 'isSpellSlot': True, 'align': 'center'},
            {'key': 'slot9', 'label': '9º', 'isSpellSlot': True, 'align': 'center'}
        ],
        'col_map': {3: 'sorceryPoints', 4: 'cantrips', 5: 'prepSpells', 6: 'slot1', 7: 'slot2', 8: 'slot3', 9: 'slot4', 10: 'slot5', 11: 'slot6', 12: 'slot7', 13: 'slot8', 14: 'slot9'},
        'subclasses': [
            {'id': 'draconic', 'name': 'Feitiçaria Dracônica', 'description': 'Escamas de dragão (CA 10 + Des + Car), asas membranosas para voo e afinidade elemental devastadora.', 'milestoneLevels': [3, 6, 14, 18]},
            {'id': 'wild_magic', 'name': 'Magia Selvagem', 'description': 'Surtos de caos imprevisíveis na Tabela de Magia Selvagem, manipulação de probabilidades e Marés do Caos.', 'milestoneLevels': [3, 6, 14, 18]},
            {'id': 'aberrant', 'name': 'Mente Aberrante', 'description': 'Poderes psiônicos do Reino Distante, telepatia alienígena e conjuração sutil sem componentes verbais ou somáticos.', 'milestoneLevels': [3, 6, 14, 18]},
            {'id': 'clockwork', 'name': 'Alma Mecânica', 'description': 'Ordem cósmica de Mechanus: anulação de vantagem/desvantagem, armadura de engrenagens protetoras e restauração.', 'milestoneLevels': [3, 6, 14, 18]}
        ]
    },
    'ranger': {
        'className': 'Guardião',
        'system': 'dnd55e',
        'hitDie': 'd10',
        'primaryAbility': 'Destreza e Sabedoria',
        'savingThrows': ['Força', 'Destreza'],
        'armorProficiencies': ['Leve', 'Média', 'Escudos'],
        'weaponProficiencies': ['Simples', 'Marciais'],
        'hasSpellcasting': True,
        'spellcastingType': 'half',
        'columns': [
            {'key': 'weaponMastery', 'label': 'Maestrias em Armas', 'tooltip': 'Propriedades de Maestria de armas ativas', 'align': 'center'},
            {'key': 'prepSpells', 'label': 'Magias Prep.', 'tooltip': 'Magias da natureza preparadas', 'align': 'center'},
            {'key': 'slot1', 'label': '1º', 'isSpellSlot': True, 'align': 'center'},
            {'key': 'slot2', 'label': '2º', 'isSpellSlot': True, 'align': 'center'},
            {'key': 'slot3', 'label': '3º', 'isSpellSlot': True, 'align': 'center'},
            {'key': 'slot4', 'label': '4º', 'isSpellSlot': True, 'align': 'center'},
            {'key': 'slot5', 'label': '5º', 'isSpellSlot': True, 'align': 'center'}
        ],
        'col_map': {3: 'weaponMastery', 4: 'prepSpells', 5: 'slot1', 6: 'slot2', 7: 'slot3', 8: 'slot4', 9: 'slot5'},
        'subclasses': [
            {'id': 'beast_master', 'name': 'Mestre das Feras', 'description': 'Companheiro primal leal (Terra, Céu ou Mar) que ataca coordenadamente e divide suas defesas.', 'milestoneLevels': [3, 7, 11, 15]},
            {'id': 'hunter', 'name': 'Caçador', 'description': 'Táticas versáteis contra hordas ou presas gigantescas: Matador de Colossos, Quebrador de Hordas e Esquiva Defensiva.', 'milestoneLevels': [3, 7, 11, 15]},
            {'id': 'gloom_stalker', 'name': 'Senhor das Sombras', 'description': 'Terror da escuridão: invisível para criaturas com visão no escuro, emboscada voraz e iniciativa letal.', 'milestoneLevels': [3, 7, 11, 15]},
            {'id': 'fey_wanderer', 'name': 'Andarilho Feérico', 'description': 'Graça sobrenatural somando Sabedoria em testes de Carisma, dano psíquico adicional e conjuração de fadas.', 'milestoneLevels': [3, 7, 11, 15]}
        ]
    },
    'fighter': {
        'className': 'Guerreiro',
        'system': 'dnd55e',
        'hitDie': 'd10',
        'primaryAbility': 'Força ou Destreza',
        'savingThrows': ['Força', 'Constituição'],
        'armorProficiencies': ['Leve', 'Média', 'Pesada', 'Escudos'],
        'weaponProficiencies': ['Simples', 'Marciais'],
        'hasSpellcasting': False,
        'columns': [
            {'key': 'secondWind', 'label': 'Retomar o Fôlego', 'tooltip': 'Usos de cura e dados táticos por descanso', 'align': 'center'},
            {'key': 'weaponMastery', 'label': 'Maestrias em Armas', 'tooltip': 'Número de armas com propriedades de Maestria dominadas', 'align': 'center'}
        ],
        'col_map': {3: 'secondWind', 4: 'weaponMastery'},
        'subclasses': [
            {'id': 'battle_master', 'name': 'Mestre da Batalha', 'description': 'Especialista em manobras táticas (Aparar, Riposte, Desarmar, Rasteira) impulsionadas por Dados de Superioridade d8.', 'milestoneLevels': [3, 7, 10, 15, 18]},
            {'id': 'champion', 'name': 'Campeão', 'description': 'Foco no poder atlético puro: acertos críticos ampliados em 19-20, sobrevivente resiliente e estilo de luta heroico.', 'milestoneLevels': [3, 7, 10, 15, 18]},
            {'id': 'eldritch_knight', 'name': 'Cavaleiro Arcano', 'description': 'Mescla maestria marcial com magia arcana: conjura magias de Mago enquanto desfere ataques com armas.', 'milestoneLevels': [3, 7, 10, 15, 18]},
            {'id': 'psi_warrior', 'name': 'Guerreiro Psíquico', 'description': 'Poder mental telecinético que ergue escudos psiônicos, arremessa armas mentais e propulsiona saltos aéreos.', 'milestoneLevels': [3, 7, 10, 15, 18]}
        ]
    },
    'rogue': {
        'className': 'Ladino',
        'system': 'dnd55e',
        'hitDie': 'd8',
        'primaryAbility': 'Destreza',
        'savingThrows': ['Destreza', 'Inteligência'],
        'armorProficiencies': ['Leve'],
        'weaponProficiencies': ['Simples', 'Marciais com Acuidade'],
        'hasSpellcasting': False,
        'columns': [
            {'key': 'sneakAttack', 'label': 'Ataque Furtivo', 'tooltip': 'Dano adicional ao atacar com vantagem ou aliado próximo', 'align': 'center'},
            {'key': 'weaponMastery', 'label': 'Maestrias em Armas', 'tooltip': '2 armas simples ou marciais dominadas', 'align': 'center'}
        ],
        'col_map': {3: 'sneakAttack'},
        'subclasses': [
            {'id': 'assassin', 'name': 'Assassino', 'description': 'Letalidade implacável no primeiro turno: vantagem em alvos que não agiram, golpes críticos garantidos e venenos.', 'milestoneLevels': [3, 9, 13, 17]},
            {'id': 'thief', 'name': 'Ladrão', 'description': 'Mãos rápidas para usar objetos ou ferramentas como Ação Bônus, escalada ágil e segundo turno no início do combate.', 'milestoneLevels': [3, 9, 13, 17]},
            {'id': 'arcane_trickster', 'name': 'Trapaceiro Arcano', 'description': 'Mão mágica invisível para furtos à distância, magias de ilusão e encantamento de Mago.', 'milestoneLevels': [3, 9, 13, 17]},
            {'id': 'soulknife', 'name': 'Lâmina Espiritual', 'description': 'Manifesta adagas de pura energia psíquica que não deixam marcas e telepatia secreta com a equipe.', 'milestoneLevels': [3, 9, 13, 17]}
        ]
    },
    'wizard': {
        'className': 'Mago',
        'system': 'dnd55e',
        'hitDie': 'd6',
        'primaryAbility': 'Inteligência',
        'savingThrows': ['Inteligência', 'Sabedoria'],
        'armorProficiencies': ['Nenhuma'],
        'weaponProficiencies': ['Simples'],
        'hasSpellcasting': True,
        'spellcastingType': 'full',
        'columns': [
            {'key': 'cantrips', 'label': 'Truques', 'tooltip': 'Truques arcanos conhecidos', 'align': 'center'},
            {'key': 'prepSpells', 'label': 'Magias Prep.', 'tooltip': 'Magias preparadas do grimório', 'align': 'center'},
            {'key': 'slot1', 'label': '1º', 'isSpellSlot': True, 'align': 'center'},
            {'key': 'slot2', 'label': '2º', 'isSpellSlot': True, 'align': 'center'},
            {'key': 'slot3', 'label': '3º', 'isSpellSlot': True, 'align': 'center'},
            {'key': 'slot4', 'label': '4º', 'isSpellSlot': True, 'align': 'center'},
            {'key': 'slot5', 'label': '5º', 'isSpellSlot': True, 'align': 'center'},
            {'key': 'slot6', 'label': '6º', 'isSpellSlot': True, 'align': 'center'},
            {'key': 'slot7', 'label': '7º', 'isSpellSlot': True, 'align': 'center'},
            {'key': 'slot8', 'label': '8º', 'isSpellSlot': True, 'align': 'center'},
            {'key': 'slot9', 'label': '9º', 'isSpellSlot': True, 'align': 'center'}
        ],
        'col_map': {3: 'cantrips', 4: 'prepSpells', 5: 'slot1', 6: 'slot2', 7: 'slot3', 8: 'slot4', 9: 'slot5', 10: 'slot6', 11: 'slot7', 12: 'slot8', 13: 'slot9'},
        'subclasses': [
            {'id': 'abjuration', 'name': 'Escola de Abjuração', 'description': 'Guardião arcano com Barreira Arcana que absorve dano direcionado a você e a aliados próximos.', 'milestoneLevels': [3, 6, 10, 14]},
            {'id': 'divination', 'name': 'Escola de Adivinhação', 'description': 'Presságio que rola dados de d20 no início do dia e substitui qualquer teste futuro seu ou de inimigos.', 'milestoneLevels': [3, 6, 10, 14]},
            {'id': 'evocation', 'name': 'Escola de Evocação', 'description': 'Molda magias para criar bolsões de segurança protegendo aliados de bolas de fogo e explosões arcanas.', 'milestoneLevels': [3, 6, 10, 14]},
            {'id': 'illusion', 'name': 'Escola de Ilusão', 'description': 'Ilusões maleáveis que parecem sólidas e reais, confundindo sentidos com projeções fantasmagóricas.', 'milestoneLevels': [3, 6, 10, 14]}
        ]
    },
    'monk': {
        'className': 'Monge',
        'system': 'dnd55e',
        'hitDie': 'd8',
        'primaryAbility': 'Destreza e Sabedoria',
        'savingThrows': ['Força', 'Destreza'],
        'armorProficiencies': ['Nenhuma'],
        'weaponProficiencies': ['Simples', 'Armas Marciais com Acuidade'],
        'hasSpellcasting': False,
        'columns': [
            {'key': 'martialArts', 'label': 'Artes Marciais', 'tooltip': 'Dado de dano dos ataques desarmados', 'align': 'center'},
            {'key': 'focusPoints', 'label': 'Pontos de Foco', 'tooltip': 'Pontos de energia para Rajada de Golpes, Passo do Vento e Defesa Paciente', 'align': 'center'},
            {'key': 'unarmoredSpeed', 'label': 'Mov. Sem Armadura', 'tooltip': 'Bônus de deslocamento enquanto desarmado e sem armadura', 'align': 'center'}
        ],
        'col_map': {3: 'martialArts', 4: 'focusPoints', 5: 'unarmoredSpeed'},
        'subclasses': [
            {'id': 'open_hand', 'name': 'Caminho da Mão Aberta', 'description': 'Técnica da mão aberta que derruba caídos, empurra a 4,5m e golpe da palma trêmula que causa morte instantânea.', 'milestoneLevels': [3, 6, 11, 17]},
            {'id': 'shadow', 'name': 'Caminho da Sombra', 'description': 'Assassino ninja que se teletransporta entre sombras na penumbra e conjura manto de escuridão mágica.', 'milestoneLevels': [3, 6, 11, 17]},
            {'id': 'elements', 'name': 'Caminho dos Elementos', 'description': 'Canaliza chamas, gelo e relâmpagos através de ataques desarmados com alcance estendido de 4,5m.', 'milestoneLevels': [3, 6, 11, 17]},
            {'id': 'mercy', 'name': 'Caminho da Misericórdia', 'description': 'Mãos da cura e mãos do dano necrótico: médico de combate com máscaras espirituais de restauração.', 'milestoneLevels': [3, 6, 11, 17]}
        ]
    },
    'paladin': {
        'className': 'Paladino',
        'system': 'dnd55e',
        'hitDie': 'd10',
        'primaryAbility': 'Força e Carisma',
        'savingThrows': ['Sabedoria', 'Carisma'],
        'armorProficiencies': ['Leve', 'Média', 'Pesada', 'Escudos'],
        'weaponProficiencies': ['Simples', 'Marciais'],
        'hasSpellcasting': True,
        'spellcastingType': 'half',
        'columns': [
            {'key': 'channelDivinity', 'label': 'Canalizar Divindade', 'tooltip': 'Usos de Canalizar Divindade sagrada por descanso', 'align': 'center'},
            {'key': 'prepSpells', 'label': 'Magias Prep.', 'tooltip': 'Magias sagradas preparadas', 'align': 'center'},
            {'key': 'slot1', 'label': '1º', 'isSpellSlot': True, 'align': 'center'},
            {'key': 'slot2', 'label': '2º', 'isSpellSlot': True, 'align': 'center'},
            {'key': 'slot3', 'label': '3º', 'isSpellSlot': True, 'align': 'center'},
            {'key': 'slot4', 'label': '4º', 'isSpellSlot': True, 'align': 'center'},
            {'key': 'slot5', 'label': '5º', 'isSpellSlot': True, 'align': 'center'}
        ],
        'col_map': {3: 'channelDivinity', 4: 'prepSpells', 5: 'slot1', 6: 'slot2', 7: 'slot3', 8: 'slot4', 9: 'slot5'},
        'subclasses': [
            {'id': 'devotion', 'name': 'Juramento da Devoção', 'description': 'Arma sagrada brilhante com bônus de Carisma no ataque, aura de devoção contra encantos e pureza.', 'milestoneLevels': [3, 7, 15, 20]},
            {'id': 'glory', 'name': 'Juramento da Glória', 'description': 'Façanhas heroicas hercúleas, atletismo lendário, velocidade estendida para o grupo e presença gloriosa.', 'milestoneLevels': [3, 7, 15, 20]},
            {'id': 'ancients', 'name': 'Juramento dos Anciões', 'description': 'Guardião da luz e da natureza: aura que concede resistência a dano de magias para você e aliados.', 'milestoneLevels': [3, 7, 15, 20]},
            {'id': 'vengeance', 'name': 'Juramento da Vingança', 'description': 'Voto de inimizade que garante vantagem constante em ataques contra um alvo marcado e perseguição implacável.', 'milestoneLevels': [3, 7, 15, 20]}
        ]
    }
}

WITCHER_CLASS = {
    'className': 'Bruxo',
    'system': 'witcher',
    'hitDie': 'd10',
    'primaryAbility': 'Destreza e Inteligência',
    'savingThrows': ['Destreza', 'Constituição'],
    'armorProficiencies': ['Leve', 'Média'],
    'weaponProficiencies': ['Espadas de Prata', 'Espadas de Aço', 'Armas Marciais'],
    'hasSpellcasting': False,
    'columns': [
        {'key': 'attackBonus', 'label': 'Bônus de Combate', 'tooltip': 'Bônus especial de esgrima e reflexos mutantes', 'align': 'center'},
        {'key': 'vigor', 'label': 'Vigor Máx.', 'tooltip': 'Pontos de Vigor (Stamina) para lançar Sinais', 'align': 'center'},
        {'key': 'toxicity', 'label': 'Tolerância Tóxica', 'tooltip': 'Limiar de toxicidade segura para poções e decocções', 'align': 'center'},
        {'key': 'signs', 'label': 'Sinais Dominados', 'tooltip': 'Sinais de Bruxo prontos para canalização', 'align': 'center'}
    ],
    'subclasses': [
        {'id': 'wolf', 'name': 'Escola do Lobo (Kaer Morhen)', 'description': 'Equilíbrio perfeito entre esgrima rápida, uso coordenado de Sinais e versatilidade em combate.', 'milestoneLevels': [3, 6, 10, 14]},
        {'id': 'cat', 'name': 'Escola do Gato', 'description': 'Estilo rápido, focado em agilidade extrema, golpes críticos cirúrgicos e armaduras leves.', 'milestoneLevels': [3, 6, 10, 14]},
        {'id': 'griffin', 'name': 'Escola do Grifo', 'description': 'Especialistas na canalização máxima de Sinais mágicos (Igni e Yrden), armaduras médias e resistência mental.', 'milestoneLevels': [3, 6, 10, 14]},
        {'id': 'bear', 'name': 'Escola do Urso', 'description': 'Tanques imponentes de Skellige com armaduras pesadas, proteção impenetrável de Quen e alta resiliência.', 'milestoneLevels': [3, 6, 10, 14]},
        {'id': 'viper', 'name': 'Escola da Víbora', 'description': 'Mestres de espadas curtas duplas, venenos paralisantes e assassinatos letais silenciosos.', 'milestoneLevels': [3, 6, 10, 14]}
    ]
}

def parse_features(raw_text):
    if not raw_text:
        return []
    parts = raw_text.replace('\n', ' ').split(',')
    res = []
    for p in parts:
        c = clean_text(p)
        if c and c != '—' and c != '-' and len(c) > 1:
            res.append(c)
    return res

output = {}

for cid, meta in METADATA.items():
    raw_rows = tables[cid]
    rows = []
    for r in raw_rows:
        lvl = int(r[0])
        pb = r[1].strip()
        if not pb.startswith('+'):
            pb = f"+{pb}"
        feats = parse_features(r[2])
        values = {}
        for col_idx, col_key in meta['col_map'].items():
            if col_idx < len(r):
                raw_val = r[col_idx].strip()
                # Clean dash or empty
                if not raw_val or raw_val in ['—', '-', '–', '\ufffd', '']:
                    values[col_key] = '—'
                else:
                    values[col_key] = raw_val.replace('\ufffd', '')
            else:
                values[col_key] = '—'
        if cid == 'rogue':
            values['weaponMastery'] = '2'
        rows.append({
            'level': lvl,
            'pb': pb,
            'features': feats,
            'values': values
        })
    output[cid] = {
        'classId': cid,
        'className': meta['className'],
        'system': meta['system'],
        'hitDie': meta['hitDie'],
        'primaryAbility': meta['primaryAbility'],
        'savingThrows': meta['savingThrows'],
        'armorProficiencies': meta['armorProficiencies'],
        'weaponProficiencies': meta['weaponProficiencies'],
        'hasSpellcasting': meta['hasSpellcasting'],
        'spellcastingType': meta.get('spellcastingType', 'none'),
        'columns': meta['columns'],
        'rows': rows,
        'subclasses': meta['subclasses']
    }

witcher_rows = []
witcher_feats_by_level = {
    1: ['Mutação de Bruxo', 'Sinais Básicos (Aard, Igni, Quen, Yrden, Axii)', 'Sentidos Aguçados'],
    2: ['Alquimia & Poções', 'Óleos de Lâmina'],
    3: ['Escola de Bruxo (Subclasse)'],
    4: ['Aumento no Valor de Atributo (ASI / Talento)'],
    5: ['Golpe Rápido & Aparar Aprimorado'],
    6: ['Especialização da Escola'],
    7: ['Modo de Sinal Alternativo'],
    8: ['Aumento no Valor de Atributo (ASI / Talento)'],
    9: ['Tolerância à Toxicidade'],
    10: ['Habilidade Mestra da Escola'],
    11: ['Fluxo de Adrenalina'],
    12: ['Aumento no Valor de Atributo (ASI / Talento)'],
    13: ['Maestria com Espada de Prata'],
    14: ['Grande Mestre da Escola'],
    15: ['Vigor Sobrenatural'],
    16: ['Aumento no Valor de Atributo (ASI / Talento)'],
    17: ['Alquimia Suprema (Bombas Mestre)'],
    18: ['Reflexos Relâmpago'],
    19: ['Dádiva Épica (Epic Boon)'],
    20: ['Lenda dos Bruxos do Continente']
}

for lvl in range(1, 21):
    pb = f"+{2 + (lvl - 1) // 4}"
    atk = f"+{lvl + 2}"
    vigor = f"{10 + lvl * 2}"
    tox = f"{100 + lvl * 5}%"
    signs = "5 Sinais" if lvl < 7 else "5 Sinais + Alternativos"
    witcher_rows.append({
        'level': lvl,
        'pb': pb,
        'features': witcher_feats_by_level.get(lvl, []),
        'values': {
            'attackBonus': atk,
            'vigor': vigor,
            'toxicity': tox,
            'signs': signs
        }
    })

output['witcher'] = {
    'classId': 'witcher',
    'className': WITCHER_CLASS['className'],
    'system': WITCHER_CLASS['system'],
    'hitDie': WITCHER_CLASS['hitDie'],
    'primaryAbility': WITCHER_CLASS['primaryAbility'],
    'savingThrows': WITCHER_CLASS['savingThrows'],
    'armorProficiencies': WITCHER_CLASS['armorProficiencies'],
    'weaponProficiencies': WITCHER_CLASS['weaponProficiencies'],
    'hasSpellcasting': False,
    'spellcastingType': 'none',
    'columns': WITCHER_CLASS['columns'],
    'rows': witcher_rows,
    'subclasses': WITCHER_CLASS['subclasses']
}

ts_lines = [
    '// =========================================================================',
    '// TABELAS OFICIAIS DE PROGRESSÃO DE CLASSE - D&D 5.5e (2024) & THE WITCHER',
    '// Todos os níveis de 1 a 20 com colunas de recursos, espaços de magia e subclasses',
    '// =========================================================================',
    '',
    'export interface ProgressionColumn {',
    '    key: string;',
    '    label: string;',
    '    tooltip?: string;',
    '    align?: "center" | "left" | "right";',
    '    isSpellSlot?: boolean;',
    '}',
    '',
    'export interface ProgressionRow {',
    '    level: number;',
    '    pb: string;',
    '    features: string[];',
    '    values: Record<string, string>;',
    '}',
    '',
    'export interface ClassSubclassInfo {',
    '    id: string;',
    '    name: string;',
    '    description: string;',
    '    milestoneLevels: number[];',
    '}',
    '',
    'export interface FullClassProgression {',
    '    classId: string;',
    '    className: string;',
    '    system: "dnd55e" | "witcher";',
    '    hitDie: string;',
    '    primaryAbility: string;',
    '    savingThrows: string[];',
    '    armorProficiencies: string[];',
    '    weaponProficiencies: string[];',
    '    hasSpellcasting: boolean;',
    '    spellcastingType?: "full" | "half" | "pact" | "none";',
    '    columns: ProgressionColumn[];',
    '    rows: ProgressionRow[];',
    '    subclasses: ClassSubclassInfo[];',
    '}',
    '',
    'export const CLASS_PROGRESSIONS: Record<string, FullClassProgression> = ' + json.dumps(output, ensure_ascii=False, indent=2) + ';',
    ''
]

with open(r'src\features\character\data\classProgressions.ts', 'w', encoding='utf-8') as f:
    f.write('\n'.join(ts_lines))

print('Cleaned classProgressions.ts written successfully!')
