// =========================================================================
// TABELAS OFICIAIS DE PROGRESSÃO DE CLASSE - D&D 5.5e (2024) & THE WITCHER
// Todos os níveis de 1 a 20 com colunas de recursos, espaços de magia e subclasses
// =========================================================================

export interface ProgressionColumn {
    key: string;
    label: string;
    tooltip?: string;
    align?: "center" | "left" | "right";
    isSpellSlot?: boolean;
}

export interface ProgressionRow {
    level: number;
    pb: string;
    features: string[];
    values: Record<string, string>;
}

export interface ClassSubclassInfo {
    id: string;
    name: string;
    description: string;
    milestoneLevels: number[];
}

export interface FullClassProgression {
    classId: string;
    className: string;
    system: "dnd55e" | "witcher";
    hitDie: string;
    primaryAbility: string;
    savingThrows: string[];
    armorProficiencies: string[];
    weaponProficiencies: string[];
    hasSpellcasting: boolean;
    spellcastingType?: "full" | "half" | "pact" | "none";
    columns: ProgressionColumn[];
    rows: ProgressionRow[];
    subclasses: ClassSubclassInfo[];
}

export const CLASS_PROGRESSIONS: Record<string, FullClassProgression> = {
  "barbarian": {
    "classId": "barbarian",
    "className": "Bárbaro",
    "system": "dnd55e",
    "hitDie": "d12",
    "primaryAbility": "Força",
    "savingThrows": [
      "Força",
      "Constituição"
    ],
    "armorProficiencies": [
      "Leve",
      "Média",
      "Escudos"
    ],
    "weaponProficiencies": [
      "Simples",
      "Marciais"
    ],
    "hasSpellcasting": false,
    "spellcastingType": "none",
    "columns": [
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
    ],
    "rows": [
      {
        "level": 1,
        "pb": "+2",
        "features": [
          "Defesa sem Armadura",
          "Fúria",
          "Maestria em Arma"
        ],
        "values": {
          "rages": "2",
          "rageDamage": "+2",
          "weaponMastery": "2",
          "attacks": "1",
          "brutalStrike": "—"
        }
      },
      {
        "level": 2,
        "pb": "+2",
        "features": [
          "Ataque Imprudente",
          "Sentido de Perigo"
        ],
        "values": {
          "rages": "2",
          "rageDamage": "+2",
          "weaponMastery": "2",
          "attacks": "1",
          "brutalStrike": "—"
        }
      },
      {
        "level": 3,
        "pb": "+2",
        "features": [
          "Conhecimento Primordial",
          "Subclasse Bárbaro"
        ],
        "values": {
          "rages": "3",
          "rageDamage": "+2",
          "weaponMastery": "2",
          "attacks": "1",
          "brutalStrike": "—"
        }
      },
      {
        "level": 4,
        "pb": "+2",
        "features": [
          "Aumento no Valor de Atributo (ASI / Talento)"
        ],
        "values": {
          "rages": "3",
          "rageDamage": "+2",
          "weaponMastery": "3",
          "attacks": "1",
          "brutalStrike": "—"
        }
      },
      {
        "level": 5,
        "pb": "+3",
        "features": [
          "Ataque Extra",
          "Movimento Rápido"
        ],
        "values": {
          "rages": "3",
          "rageDamage": "+2",
          "weaponMastery": "3",
          "attacks": "2",
          "brutalStrike": "—"
        }
      },
      {
        "level": 6,
        "pb": "+3",
        "features": [
          "Característica de Subclasse"
        ],
        "values": {
          "rages": "4",
          "rageDamage": "+2",
          "weaponMastery": "3",
          "attacks": "2",
          "brutalStrike": "—"
        }
      },
      {
        "level": 7,
        "pb": "+3",
        "features": [
          "Bote Instintivo",
          "Instintos Primitivos"
        ],
        "values": {
          "rages": "4",
          "rageDamage": "+2",
          "weaponMastery": "3",
          "attacks": "2",
          "brutalStrike": "—"
        }
      },
      {
        "level": 8,
        "pb": "+3",
        "features": [
          "Aumento no Valor de Atributo (ASI / Talento)"
        ],
        "values": {
          "rages": "4",
          "rageDamage": "+2",
          "weaponMastery": "3",
          "attacks": "2",
          "brutalStrike": "—"
        }
      },
      {
        "level": 9,
        "pb": "+4",
        "features": [
          "Golpe Brutal"
        ],
        "values": {
          "rages": "4",
          "rageDamage": "+3",
          "weaponMastery": "3",
          "attacks": "2",
          "brutalStrike": "+1d10"
        }
      },
      {
        "level": 10,
        "pb": "+4",
        "features": [
          "Característica de Subclasse"
        ],
        "values": {
          "rages": "4",
          "rageDamage": "+3",
          "weaponMastery": "4",
          "attacks": "2",
          "brutalStrike": "+1d10"
        }
      },
      {
        "level": 11,
        "pb": "+4",
        "features": [
          "Fúria Implacável"
        ],
        "values": {
          "rages": "4",
          "rageDamage": "+3",
          "weaponMastery": "4",
          "attacks": "2",
          "brutalStrike": "+1d10"
        }
      },
      {
        "level": 12,
        "pb": "+4",
        "features": [
          "Aumento no Valor de Atributo (ASI / Talento)"
        ],
        "values": {
          "rages": "5",
          "rageDamage": "+3",
          "weaponMastery": "4",
          "attacks": "2",
          "brutalStrike": "+1d10"
        }
      },
      {
        "level": 13,
        "pb": "+5",
        "features": [
          "Golpe Brutal Fortalecido"
        ],
        "values": {
          "rages": "5",
          "rageDamage": "+3",
          "weaponMastery": "4",
          "attacks": "2",
          "brutalStrike": "+1d10 (2 efeitos)"
        }
      },
      {
        "level": 14,
        "pb": "+5",
        "features": [
          "Característica de Subclasse"
        ],
        "values": {
          "rages": "5",
          "rageDamage": "+3",
          "weaponMastery": "4",
          "attacks": "2",
          "brutalStrike": "+1d10 (2 efeitos)"
        }
      },
      {
        "level": 15,
        "pb": "+5",
        "features": [
          "Fúria Persistente"
        ],
        "values": {
          "rages": "5",
          "rageDamage": "+3",
          "weaponMastery": "4",
          "attacks": "2",
          "brutalStrike": "+1d10 (2 efeitos)"
        }
      },
      {
        "level": 16,
        "pb": "+5",
        "features": [
          "Aumento no Valor de Atributo (ASI / Talento)"
        ],
        "values": {
          "rages": "5",
          "rageDamage": "+4",
          "weaponMastery": "4",
          "attacks": "2",
          "brutalStrike": "+1d10 (2 efeitos)"
        }
      },
      {
        "level": 17,
        "pb": "+6",
        "features": [
          "Golpe Brutal Fortalecido"
        ],
        "values": {
          "rages": "6",
          "rageDamage": "+4",
          "weaponMastery": "4",
          "attacks": "2",
          "brutalStrike": "+2d10 (2 efeitos)"
        }
      },
      {
        "level": 18,
        "pb": "+6",
        "features": [
          "Força Indomável"
        ],
        "values": {
          "rages": "6",
          "rageDamage": "+4",
          "weaponMastery": "4",
          "attacks": "2",
          "brutalStrike": "+2d10 (2 efeitos)"
        }
      },
      {
        "level": 19,
        "pb": "+6",
        "features": [
          "Dádiva Épica"
        ],
        "values": {
          "rages": "6",
          "rageDamage": "+4",
          "weaponMastery": "4",
          "attacks": "2",
          "brutalStrike": "+2d10 (2 efeitos)"
        }
      },
      {
        "level": 20,
        "pb": "+6",
        "features": [
          "Campeão Primitivo"
        ],
        "values": {
          "rages": "6",
          "rageDamage": "+4",
          "weaponMastery": "4",
          "attacks": "2",
          "brutalStrike": "+2d10 (2 efeitos)"
        }
      }
    ],
    "subclasses": [
      {
        "id": "berserker",
        "name": "Berserker",
        "description": "Frenesi violento com dano extra colossal por turno, Ataque Retaliatório com Reação e imunidade a Medo e Encantamento.",
        "milestoneLevels": [
          3,
          6,
          10,
          14
        ]
      },
      {
        "id": "wild_heart",
        "name": "Coração Selvagem",
        "description": "Sintonia espiritual com animais totêmicos (Urso, Águia, Lobo) concedendo resistências a quase todo tipo de dano e fúrias místicas.",
        "milestoneLevels": [
          3,
          6,
          10,
          14
        ]
      },
      {
        "id": "world_tree",
        "name": "Árvore do Mundo",
        "description": "Canaliza a energia cósmica de Yggdrasil: concede PV temporários vitalícios para aliados e teletransporta através de raízes planares.",
        "milestoneLevels": [
          3,
          6,
          10,
          14
        ]
      },
      {
        "id": "zealot",
        "name": "Fanático",
        "description": "Fúria sagrada imbuída de poder radiante ou necrótico dos deuses, transcendendo a própria morte enquanto estiver em fúria.",
        "milestoneLevels": [
          3,
          6,
          10,
          14
        ]
      }
    ]
  },
  "bard": {
    "classId": "bard",
    "className": "Bardo",
    "system": "dnd55e",
    "hitDie": "d8",
    "primaryAbility": "Carisma",
    "savingThrows": [
      "Destreza",
      "Carisma"
    ],
    "armorProficiencies": [
      "Leve"
    ],
    "weaponProficiencies": [
      "Simples"
    ],
    "hasSpellcasting": true,
    "spellcastingType": "full",
    "columns": [
      {
        "key": "bardicDie",
        "label": "Dado de Inspiração",
        "tooltip": "Dado concedido a aliados com Inspiração de Bardo",
        "align": "center"
      },
      {
        "key": "cantrips",
        "label": "Truques",
        "tooltip": "Truques de bardo conhecidos",
        "align": "center"
      },
      {
        "key": "prepSpells",
        "label": "Magias Prep.",
        "tooltip": "Número de magias preparadas disponíveis",
        "align": "center"
      },
      {
        "key": "slot1",
        "label": "1º",
        "isSpellSlot": true,
        "align": "center"
      },
      {
        "key": "slot2",
        "label": "2º",
        "isSpellSlot": true,
        "align": "center"
      },
      {
        "key": "slot3",
        "label": "3º",
        "isSpellSlot": true,
        "align": "center"
      },
      {
        "key": "slot4",
        "label": "4º",
        "isSpellSlot": true,
        "align": "center"
      },
      {
        "key": "slot5",
        "label": "5º",
        "isSpellSlot": true,
        "align": "center"
      },
      {
        "key": "slot6",
        "label": "6º",
        "isSpellSlot": true,
        "align": "center"
      },
      {
        "key": "slot7",
        "label": "7º",
        "isSpellSlot": true,
        "align": "center"
      },
      {
        "key": "slot8",
        "label": "8º",
        "isSpellSlot": true,
        "align": "center"
      },
      {
        "key": "slot9",
        "label": "9º",
        "isSpellSlot": true,
        "align": "center"
      }
    ],
    "rows": [
      {
        "level": 1,
        "pb": "+2",
        "features": [
          "Inspiração de Bardo",
          "Conjuração"
        ],
        "values": {
          "bardicDie": "D6",
          "cantrips": "2",
          "prepSpells": "4",
          "slot1": "2",
          "slot2": "—",
          "slot3": "—",
          "slot4": "—",
          "slot5": "—",
          "slot6": "—",
          "slot7": "—",
          "slot8": "—",
          "slot9": "—"
        }
      },
      {
        "level": 2,
        "pb": "+2",
        "features": [
          "Especialista",
          "Pau pra Toda Obra"
        ],
        "values": {
          "bardicDie": "D6",
          "cantrips": "2",
          "prepSpells": "5",
          "slot1": "3",
          "slot2": "—",
          "slot3": "—",
          "slot4": "—",
          "slot5": "—",
          "slot6": "—",
          "slot7": "—",
          "slot8": "—",
          "slot9": "—"
        }
      },
      {
        "level": 3,
        "pb": "+2",
        "features": [
          "Subclasse de Bardo"
        ],
        "values": {
          "bardicDie": "D6",
          "cantrips": "2",
          "prepSpells": "6",
          "slot1": "4",
          "slot2": "2",
          "slot3": "—",
          "slot4": "—",
          "slot5": "—",
          "slot6": "—",
          "slot7": "—",
          "slot8": "—",
          "slot9": "—"
        }
      },
      {
        "level": 4,
        "pb": "+2",
        "features": [
          "Aumento no Valor de Atributo (ASI / Talento)"
        ],
        "values": {
          "bardicDie": "D6",
          "cantrips": "3",
          "prepSpells": "7",
          "slot1": "4",
          "slot2": "3",
          "slot3": "—",
          "slot4": "—",
          "slot5": "—",
          "slot6": "—",
          "slot7": "—",
          "slot8": "—",
          "slot9": "—"
        }
      },
      {
        "level": 5,
        "pb": "+3",
        "features": [
          "Fonte de Inspiração"
        ],
        "values": {
          "bardicDie": "D8",
          "cantrips": "3",
          "prepSpells": "9",
          "slot1": "4",
          "slot2": "3",
          "slot3": "2",
          "slot4": "—",
          "slot5": "—",
          "slot6": "—",
          "slot7": "—",
          "slot8": "—",
          "slot9": "—"
        }
      },
      {
        "level": 6,
        "pb": "+3",
        "features": [
          "Característica de Subclasse"
        ],
        "values": {
          "bardicDie": "D8",
          "cantrips": "3",
          "prepSpells": "10",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "—",
          "slot5": "—",
          "slot6": "—",
          "slot7": "—",
          "slot8": "—",
          "slot9": "—"
        }
      },
      {
        "level": 7,
        "pb": "+3",
        "features": [
          "Contra-Encantamento"
        ],
        "values": {
          "bardicDie": "D8",
          "cantrips": "3",
          "prepSpells": "11",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "1",
          "slot5": "—",
          "slot6": "—",
          "slot7": "—",
          "slot8": "—",
          "slot9": "—"
        }
      },
      {
        "level": 8,
        "pb": "+3",
        "features": [
          "Aumento no Valor de Atributo (ASI / Talento)"
        ],
        "values": {
          "bardicDie": "D8",
          "cantrips": "3",
          "prepSpells": "12",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "2",
          "slot5": "—",
          "slot6": "—",
          "slot7": "—",
          "slot8": "—",
          "slot9": "—"
        }
      },
      {
        "level": 9,
        "pb": "+4",
        "features": [
          "Especialização"
        ],
        "values": {
          "bardicDie": "D8",
          "cantrips": "3",
          "prepSpells": "14",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "3",
          "slot5": "1",
          "slot6": "—",
          "slot7": "—",
          "slot8": "—",
          "slot9": "—"
        }
      },
      {
        "level": 10,
        "pb": "+4",
        "features": [
          "Segredos Mágicos"
        ],
        "values": {
          "bardicDie": "D10",
          "cantrips": "4",
          "prepSpells": "15",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "3",
          "slot5": "2",
          "slot6": "—",
          "slot7": "—",
          "slot8": "—",
          "slot9": "—"
        }
      },
      {
        "level": 11,
        "pb": "+4",
        "features": [],
        "values": {
          "bardicDie": "D10",
          "cantrips": "4",
          "prepSpells": "16",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "3",
          "slot5": "2",
          "slot6": "1",
          "slot7": "—",
          "slot8": "—",
          "slot9": "—"
        }
      },
      {
        "level": 12,
        "pb": "+4",
        "features": [
          "Aumento no Valor de Atributo (ASI / Talento)"
        ],
        "values": {
          "bardicDie": "D10",
          "cantrips": "4",
          "prepSpells": "16",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "3",
          "slot5": "2",
          "slot6": "1",
          "slot7": "—",
          "slot8": "—",
          "slot9": "—"
        }
      },
      {
        "level": 13,
        "pb": "+5",
        "features": [],
        "values": {
          "bardicDie": "D10",
          "cantrips": "4",
          "prepSpells": "17",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "3",
          "slot5": "2",
          "slot6": "1",
          "slot7": "1",
          "slot8": "—",
          "slot9": "—"
        }
      },
      {
        "level": 14,
        "pb": "+5",
        "features": [
          "Característica de Subclasse"
        ],
        "values": {
          "bardicDie": "D10",
          "cantrips": "4",
          "prepSpells": "17",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "3",
          "slot5": "2",
          "slot6": "1",
          "slot7": "1",
          "slot8": "—",
          "slot9": "—"
        }
      },
      {
        "level": 15,
        "pb": "+5",
        "features": [],
        "values": {
          "bardicDie": "D12",
          "cantrips": "4",
          "prepSpells": "18",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "3",
          "slot5": "2",
          "slot6": "1",
          "slot7": "1",
          "slot8": "1",
          "slot9": "—"
        }
      },
      {
        "level": 16,
        "pb": "+5",
        "features": [
          "Aumento no Valor de Atributo (ASI / Talento)"
        ],
        "values": {
          "bardicDie": "D12",
          "cantrips": "4",
          "prepSpells": "18",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "3",
          "slot5": "2",
          "slot6": "1",
          "slot7": "1",
          "slot8": "1",
          "slot9": "—"
        }
      },
      {
        "level": 17,
        "pb": "+6",
        "features": [],
        "values": {
          "bardicDie": "D12",
          "cantrips": "4",
          "prepSpells": "19",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "3",
          "slot5": "2",
          "slot6": "1",
          "slot7": "1",
          "slot8": "1",
          "slot9": "1"
        }
      },
      {
        "level": 18,
        "pb": "+6",
        "features": [
          "Inspiração Superior"
        ],
        "values": {
          "bardicDie": "D12",
          "cantrips": "4",
          "prepSpells": "20",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "3",
          "slot5": "3",
          "slot6": "1",
          "slot7": "1",
          "slot8": "1",
          "slot9": "1"
        }
      },
      {
        "level": 19,
        "pb": "+6",
        "features": [
          "Dádiva Épica"
        ],
        "values": {
          "bardicDie": "D12",
          "cantrips": "4",
          "prepSpells": "21",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "3",
          "slot5": "3",
          "slot6": "2",
          "slot7": "1",
          "slot8": "1",
          "slot9": "1"
        }
      },
      {
        "level": 20,
        "pb": "+6",
        "features": [
          "Palavras de Criação"
        ],
        "values": {
          "bardicDie": "D12",
          "cantrips": "4",
          "prepSpells": "22",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "3",
          "slot5": "3",
          "slot6": "2",
          "slot7": "2",
          "slot8": "1",
          "slot9": "1"
        }
      }
    ],
    "subclasses": [
      {
        "id": "dance",
        "name": "Colégio da Dança",
        "description": "Combate desarmado ágil, esquiva rítmica e bônus de iniciativa compartilhados com aliados.",
        "milestoneLevels": [
          3,
          6,
          14
        ]
      },
      {
        "id": "glamour",
        "name": "Colégio do Glamour",
        "description": "Presença feérica deslumbrante que hipnotiza multidões e concede manto de inspiração régia.",
        "milestoneLevels": [
          3,
          6,
          14
        ]
      },
      {
        "id": "lore",
        "name": "Colégio do Conhecimento",
        "description": "Palavras cortantes que atrapalham inimigos e segredos mágicos adicionais de qualquer lista de magias.",
        "milestoneLevels": [
          3,
          6,
          14
        ]
      },
      {
        "id": "valor",
        "name": "Colégio da Bravura",
        "description": "Proficiência em armaduras médias, escudos, armas marciais e ataques adicionais canalizando magias de combate.",
        "milestoneLevels": [
          3,
          6,
          14
        ]
      }
    ]
  },
  "warlock": {
    "classId": "warlock",
    "className": "Bruxo",
    "system": "dnd55e",
    "hitDie": "d8",
    "primaryAbility": "Carisma",
    "savingThrows": [
      "Sabedoria",
      "Carisma"
    ],
    "armorProficiencies": [
      "Leve"
    ],
    "weaponProficiencies": [
      "Simples"
    ],
    "hasSpellcasting": true,
    "spellcastingType": "pact",
    "columns": [
      {
        "key": "invocations",
        "label": "Invocações",
        "tooltip": "Invocações Místicas conhecidas ativas",
        "align": "center"
      },
      {
        "key": "cantrips",
        "label": "Truques",
        "tooltip": "Truques de bruxo conhecidos",
        "align": "center"
      },
      {
        "key": "prepSpells",
        "label": "Magias Prep.",
        "tooltip": "Magias preparadas de bruxo",
        "align": "center"
      },
      {
        "key": "pactSlots",
        "label": "Espaços de Pacto",
        "tooltip": "Espaços de magia que recarregam em Descanso Curto",
        "align": "center"
      },
      {
        "key": "slotLevel",
        "label": "Círculo do Espaço",
        "tooltip": "Círculo máximo em que todos os espaços de pacto são conjurados",
        "align": "center"
      }
    ],
    "rows": [
      {
        "level": 1,
        "pb": "+2",
        "features": [
          "Invocações Místicas",
          "Magia de Pacto"
        ],
        "values": {
          "invocations": "1",
          "cantrips": "2",
          "prepSpells": "2",
          "pactSlots": "1",
          "slotLevel": "1"
        }
      },
      {
        "level": 2,
        "pb": "+2",
        "features": [
          "Astúcia Mágica"
        ],
        "values": {
          "invocations": "3",
          "cantrips": "2",
          "prepSpells": "3",
          "pactSlots": "2",
          "slotLevel": "1"
        }
      },
      {
        "level": 3,
        "pb": "+2",
        "features": [
          "Subclasse de Bruxo"
        ],
        "values": {
          "invocations": "3",
          "cantrips": "2",
          "prepSpells": "4",
          "pactSlots": "2",
          "slotLevel": "2"
        }
      },
      {
        "level": 4,
        "pb": "+2",
        "features": [
          "Aumento no Valor de Atributo (ASI / Talento)"
        ],
        "values": {
          "invocations": "3",
          "cantrips": "3",
          "prepSpells": "5",
          "pactSlots": "2",
          "slotLevel": "2"
        }
      },
      {
        "level": 5,
        "pb": "+3",
        "features": [],
        "values": {
          "invocations": "5",
          "cantrips": "3",
          "prepSpells": "6",
          "pactSlots": "2",
          "slotLevel": "3"
        }
      },
      {
        "level": 6,
        "pb": "+3",
        "features": [
          "Característica de Subclasse"
        ],
        "values": {
          "invocations": "5",
          "cantrips": "3",
          "prepSpells": "7",
          "pactSlots": "2",
          "slotLevel": "3"
        }
      },
      {
        "level": 7,
        "pb": "+3",
        "features": [],
        "values": {
          "invocations": "6",
          "cantrips": "3",
          "prepSpells": "8",
          "pactSlots": "2",
          "slotLevel": "4"
        }
      },
      {
        "level": 8,
        "pb": "+3",
        "features": [
          "Aumento no Valor de Atributo (ASI / Talento)"
        ],
        "values": {
          "invocations": "6",
          "cantrips": "3",
          "prepSpells": "9",
          "pactSlots": "2",
          "slotLevel": "4"
        }
      },
      {
        "level": 9,
        "pb": "+4",
        "features": [
          "Contatar Patrono"
        ],
        "values": {
          "invocations": "7",
          "cantrips": "3",
          "prepSpells": "10",
          "pactSlots": "2",
          "slotLevel": "5"
        }
      },
      {
        "level": 10,
        "pb": "+4",
        "features": [
          "Característica de Subclasse"
        ],
        "values": {
          "invocations": "7",
          "cantrips": "4",
          "prepSpells": "10",
          "pactSlots": "2",
          "slotLevel": "5"
        }
      },
      {
        "level": 11,
        "pb": "+4",
        "features": [
          "Arcana Mística (6º círculo)"
        ],
        "values": {
          "invocations": "7",
          "cantrips": "4",
          "prepSpells": "11",
          "pactSlots": "3",
          "slotLevel": "5"
        }
      },
      {
        "level": 12,
        "pb": "+4",
        "features": [
          "Aumento no Valor de Atributo (ASI / Talento)"
        ],
        "values": {
          "invocations": "8",
          "cantrips": "4",
          "prepSpells": "11",
          "pactSlots": "3",
          "slotLevel": "5"
        }
      },
      {
        "level": 13,
        "pb": "+5",
        "features": [
          "Arcana Mística (7º círculo)"
        ],
        "values": {
          "invocations": "8",
          "cantrips": "4",
          "prepSpells": "12",
          "pactSlots": "3",
          "slotLevel": "5"
        }
      },
      {
        "level": 14,
        "pb": "+5",
        "features": [
          "Característica de Subclasse"
        ],
        "values": {
          "invocations": "8",
          "cantrips": "4",
          "prepSpells": "12",
          "pactSlots": "3",
          "slotLevel": "5"
        }
      },
      {
        "level": 15,
        "pb": "+5",
        "features": [
          "Arcana Mística (8º círculo)"
        ],
        "values": {
          "invocations": "9",
          "cantrips": "4",
          "prepSpells": "13",
          "pactSlots": "3",
          "slotLevel": "5"
        }
      },
      {
        "level": 16,
        "pb": "+5",
        "features": [
          "Aumento no Valor de Atributo (ASI / Talento)"
        ],
        "values": {
          "invocations": "9",
          "cantrips": "4",
          "prepSpells": "13",
          "pactSlots": "3",
          "slotLevel": "5"
        }
      },
      {
        "level": 17,
        "pb": "+6",
        "features": [
          "Arcana Mística (9º círculo)"
        ],
        "values": {
          "invocations": "9",
          "cantrips": "4",
          "prepSpells": "14",
          "pactSlots": "4",
          "slotLevel": "5"
        }
      },
      {
        "level": 18,
        "pb": "+6",
        "features": [],
        "values": {
          "invocations": "10",
          "cantrips": "4",
          "prepSpells": "14",
          "pactSlots": "4",
          "slotLevel": "5"
        }
      },
      {
        "level": 19,
        "pb": "+6",
        "features": [
          "Dádiva Épica"
        ],
        "values": {
          "invocations": "10",
          "cantrips": "4",
          "prepSpells": "15",
          "pactSlots": "4",
          "slotLevel": "5"
        }
      },
      {
        "level": 20,
        "pb": "+6",
        "features": [
          "Mestre Místico"
        ],
        "values": {
          "invocations": "10",
          "cantrips": "4",
          "prepSpells": "15",
          "pactSlots": "4",
          "slotLevel": "5"
        }
      }
    ],
    "subclasses": [
      {
        "id": "archfey",
        "name": "A Arquifada",
        "description": "Passo nebuloso aprimorado com efeitos feéricos, teletransporte defensivo e charme ilusório.",
        "milestoneLevels": [
          3,
          6,
          10,
          14
        ]
      },
      {
        "id": "celestial",
        "name": "O Celestial",
        "description": "Luz curativa radiante, feixes sagrados e resiliência celestial com pontos de vida temporários.",
        "milestoneLevels": [
          3,
          6,
          10,
          14
        ]
      },
      {
        "id": "fiend",
        "name": "O Corruptor",
        "description": "Bênção do Obscuro que suga vitalidade de criaturas abatidas e sorte infernal em rolagens de dados.",
        "milestoneLevels": [
          3,
          6,
          10,
          14
        ]
      },
      {
        "id": "great_old_one",
        "name": "O Grande Antigo",
        "description": "Telepatia mental desperta, feitiços psíquicos do Reino Distante e proteção contra leitura mental.",
        "milestoneLevels": [
          3,
          6,
          10,
          14
        ]
      }
    ]
  },
  "cleric": {
    "classId": "cleric",
    "className": "Clérigo",
    "system": "dnd55e",
    "hitDie": "d8",
    "primaryAbility": "Sabedoria",
    "savingThrows": [
      "Sabedoria",
      "Carisma"
    ],
    "armorProficiencies": [
      "Leve",
      "Média",
      "Escudos (Pesada com Protetor)"
    ],
    "weaponProficiencies": [
      "Simples (Marciais com Protetor)"
    ],
    "hasSpellcasting": true,
    "spellcastingType": "full",
    "columns": [
      {
        "key": "channelDivinity",
        "label": "Canalizar Divindade",
        "tooltip": "Usos de Canalizar Divindade por descanso",
        "align": "center"
      },
      {
        "key": "cantrips",
        "label": "Truques",
        "tooltip": "Truques divinos conhecidos",
        "align": "center"
      },
      {
        "key": "prepSpells",
        "label": "Magias Prep.",
        "tooltip": "Número de magias divinas preparadas",
        "align": "center"
      },
      {
        "key": "slot1",
        "label": "1º",
        "isSpellSlot": true,
        "align": "center"
      },
      {
        "key": "slot2",
        "label": "2º",
        "isSpellSlot": true,
        "align": "center"
      },
      {
        "key": "slot3",
        "label": "3º",
        "isSpellSlot": true,
        "align": "center"
      },
      {
        "key": "slot4",
        "label": "4º",
        "isSpellSlot": true,
        "align": "center"
      },
      {
        "key": "slot5",
        "label": "5º",
        "isSpellSlot": true,
        "align": "center"
      },
      {
        "key": "slot6",
        "label": "6º",
        "isSpellSlot": true,
        "align": "center"
      },
      {
        "key": "slot7",
        "label": "7º",
        "isSpellSlot": true,
        "align": "center"
      },
      {
        "key": "slot8",
        "label": "8º",
        "isSpellSlot": true,
        "align": "center"
      },
      {
        "key": "slot9",
        "label": "9º",
        "isSpellSlot": true,
        "align": "center"
      }
    ],
    "rows": [
      {
        "level": 1,
        "pb": "+2",
        "features": [
          "Conjuração",
          "Ordem Divina"
        ],
        "values": {
          "channelDivinity": "—",
          "cantrips": "3",
          "prepSpells": "4",
          "slot1": "2",
          "slot2": "—",
          "slot3": "—",
          "slot4": "—",
          "slot5": "—",
          "slot6": "—",
          "slot7": "—",
          "slot8": "—",
          "slot9": "—"
        }
      },
      {
        "level": 2,
        "pb": "+2",
        "features": [
          "Canalizar Divindade"
        ],
        "values": {
          "channelDivinity": "2",
          "cantrips": "3",
          "prepSpells": "5",
          "slot1": "3",
          "slot2": "—",
          "slot3": "—",
          "slot4": "—",
          "slot5": "—",
          "slot6": "—",
          "slot7": "—",
          "slot8": "—",
          "slot9": "—"
        }
      },
      {
        "level": 3,
        "pb": "+2",
        "features": [
          "Subclasse Clérigo"
        ],
        "values": {
          "channelDivinity": "2",
          "cantrips": "3",
          "prepSpells": "6",
          "slot1": "4",
          "slot2": "2",
          "slot3": "—",
          "slot4": "—",
          "slot5": "—",
          "slot6": "—",
          "slot7": "—",
          "slot8": "—",
          "slot9": "—"
        }
      },
      {
        "level": 4,
        "pb": "+2",
        "features": [
          "Aumento no Valor de Atributo (ASI / Talento)"
        ],
        "values": {
          "channelDivinity": "2",
          "cantrips": "4",
          "prepSpells": "7",
          "slot1": "4",
          "slot2": "3",
          "slot3": "—",
          "slot4": "—",
          "slot5": "—",
          "slot6": "—",
          "slot7": "—",
          "slot8": "—",
          "slot9": "—"
        }
      },
      {
        "level": 5,
        "pb": "+3",
        "features": [
          "Fulminar Mortos-Vivos"
        ],
        "values": {
          "channelDivinity": "2",
          "cantrips": "4",
          "prepSpells": "9",
          "slot1": "4",
          "slot2": "3",
          "slot3": "2",
          "slot4": "—",
          "slot5": "—",
          "slot6": "—",
          "slot7": "—",
          "slot8": "—",
          "slot9": "—"
        }
      },
      {
        "level": 6,
        "pb": "+3",
        "features": [
          "Característica de Subclasse"
        ],
        "values": {
          "channelDivinity": "3",
          "cantrips": "4",
          "prepSpells": "10",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "—",
          "slot5": "—",
          "slot6": "—",
          "slot7": "—",
          "slot8": "—",
          "slot9": "—"
        }
      },
      {
        "level": 7,
        "pb": "+3",
        "features": [
          "Golpes Abençoados"
        ],
        "values": {
          "channelDivinity": "3",
          "cantrips": "4",
          "prepSpells": "11",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "1",
          "slot5": "—",
          "slot6": "—",
          "slot7": "—",
          "slot8": "—",
          "slot9": "—"
        }
      },
      {
        "level": 8,
        "pb": "+3",
        "features": [
          "Aumento no Valor de Atributo (ASI / Talento)"
        ],
        "values": {
          "channelDivinity": "3",
          "cantrips": "4",
          "prepSpells": "12",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "2",
          "slot5": "—",
          "slot6": "—",
          "slot7": "—",
          "slot8": "—",
          "slot9": "—"
        }
      },
      {
        "level": 9,
        "pb": "+4",
        "features": [],
        "values": {
          "channelDivinity": "3",
          "cantrips": "4",
          "prepSpells": "14",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "3",
          "slot5": "1",
          "slot6": "—",
          "slot7": "—",
          "slot8": "—",
          "slot9": "—"
        }
      },
      {
        "level": 10,
        "pb": "+4",
        "features": [
          "Intervenção Divina"
        ],
        "values": {
          "channelDivinity": "3",
          "cantrips": "5",
          "prepSpells": "15",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "3",
          "slot5": "2",
          "slot6": "—",
          "slot7": "—",
          "slot8": "—",
          "slot9": "—"
        }
      },
      {
        "level": 11,
        "pb": "+4",
        "features": [],
        "values": {
          "channelDivinity": "3",
          "cantrips": "5",
          "prepSpells": "16",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "3",
          "slot5": "2",
          "slot6": "1",
          "slot7": "—",
          "slot8": "—",
          "slot9": "—"
        }
      },
      {
        "level": 12,
        "pb": "+4",
        "features": [
          "Aumento no Valor de Atributo (ASI / Talento)"
        ],
        "values": {
          "channelDivinity": "3",
          "cantrips": "5",
          "prepSpells": "16",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "3",
          "slot5": "2",
          "slot6": "1",
          "slot7": "—",
          "slot8": "—",
          "slot9": "—"
        }
      },
      {
        "level": 13,
        "pb": "+5",
        "features": [],
        "values": {
          "channelDivinity": "3",
          "cantrips": "5",
          "prepSpells": "17",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "3",
          "slot5": "2",
          "slot6": "1",
          "slot7": "1",
          "slot8": "—",
          "slot9": "—"
        }
      },
      {
        "level": 14,
        "pb": "+5",
        "features": [
          "Golpes Abençoados Aprimorado"
        ],
        "values": {
          "channelDivinity": "3",
          "cantrips": "5",
          "prepSpells": "17",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "3",
          "slot5": "2",
          "slot6": "1",
          "slot7": "1",
          "slot8": "—",
          "slot9": "—"
        }
      },
      {
        "level": 15,
        "pb": "+5",
        "features": [],
        "values": {
          "channelDivinity": "3",
          "cantrips": "5",
          "prepSpells": "18",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "3",
          "slot5": "2",
          "slot6": "1",
          "slot7": "1",
          "slot8": "1",
          "slot9": "—"
        }
      },
      {
        "level": 16,
        "pb": "+5",
        "features": [
          "Aumento no Valor de Atributo (ASI / Talento)"
        ],
        "values": {
          "channelDivinity": "3",
          "cantrips": "5",
          "prepSpells": "18",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "3",
          "slot5": "2",
          "slot6": "1",
          "slot7": "1",
          "slot8": "1",
          "slot9": "—"
        }
      },
      {
        "level": 17,
        "pb": "+6",
        "features": [
          "Característica de Subclasse"
        ],
        "values": {
          "channelDivinity": "3",
          "cantrips": "5",
          "prepSpells": "19",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "3",
          "slot5": "2",
          "slot6": "1",
          "slot7": "1",
          "slot8": "1",
          "slot9": "1"
        }
      },
      {
        "level": 18,
        "pb": "+6",
        "features": [],
        "values": {
          "channelDivinity": "4",
          "cantrips": "5",
          "prepSpells": "20",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "3",
          "slot5": "3",
          "slot6": "1",
          "slot7": "1",
          "slot8": "1",
          "slot9": "1"
        }
      },
      {
        "level": 19,
        "pb": "+6",
        "features": [
          "Dádiva Épica"
        ],
        "values": {
          "channelDivinity": "4",
          "cantrips": "5",
          "prepSpells": "21",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "3",
          "slot5": "3",
          "slot6": "2",
          "slot7": "1",
          "slot8": "1",
          "slot9": "1"
        }
      },
      {
        "level": 20,
        "pb": "+6",
        "features": [
          "Intervenção Divina Maior"
        ],
        "values": {
          "channelDivinity": "4",
          "cantrips": "5",
          "prepSpells": "22",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "3",
          "slot5": "3",
          "slot6": "2",
          "slot7": "2",
          "slot8": "1",
          "slot9": "1"
        }
      }
    ],
    "subclasses": [
      {
        "id": "life",
        "name": "Domínio da Vida",
        "description": "Discípulo da vida que potencializa curas, restaura vitalidade de aliados caídos e recebe armaduras pesadas.",
        "milestoneLevels": [
          3,
          6,
          17
        ]
      },
      {
        "id": "light",
        "name": "Domínio da Luz",
        "description": "Luz ofuscante que impõe desvantagem em ataques contra você e magias devastadoras de fogo e radiação solar.",
        "milestoneLevels": [
          3,
          6,
          17
        ]
      },
      {
        "id": "trickery",
        "name": "Domínio da Trapaça",
        "description": "Bênção do trapaceiro, duplicata ilusória perfeita que canaliza magias à distância e furtividade sobrenatural.",
        "milestoneLevels": [
          3,
          6,
          17
        ]
      },
      {
        "id": "war",
        "name": "Domínio da Guerra",
        "description": "Sacerdote da Guerra com ataques adicionais de ação bônus, precisão guiada divinamente e armas marciais.",
        "milestoneLevels": [
          3,
          6,
          17
        ]
      }
    ]
  },
  "druid": {
    "classId": "druid",
    "className": "Druida",
    "system": "dnd55e",
    "hitDie": "d8",
    "primaryAbility": "Sabedoria",
    "savingThrows": [
      "Inteligência",
      "Sabedoria"
    ],
    "armorProficiencies": [
      "Leve",
      "Média",
      "Escudos"
    ],
    "weaponProficiencies": [
      "Simples"
    ],
    "hasSpellcasting": true,
    "spellcastingType": "full",
    "columns": [
      {
        "key": "wildShape",
        "label": "Forma Selvagem",
        "tooltip": "Usos de Forma Selvagem por descanso",
        "align": "center"
      },
      {
        "key": "cantrips",
        "label": "Truques",
        "tooltip": "Truques primordiais conhecidos",
        "align": "center"
      },
      {
        "key": "prepSpells",
        "label": "Magias Prep.",
        "tooltip": "Magias primordiais preparadas",
        "align": "center"
      },
      {
        "key": "slot1",
        "label": "1º",
        "isSpellSlot": true,
        "align": "center"
      },
      {
        "key": "slot2",
        "label": "2º",
        "isSpellSlot": true,
        "align": "center"
      },
      {
        "key": "slot3",
        "label": "3º",
        "isSpellSlot": true,
        "align": "center"
      },
      {
        "key": "slot4",
        "label": "4º",
        "isSpellSlot": true,
        "align": "center"
      },
      {
        "key": "slot5",
        "label": "5º",
        "isSpellSlot": true,
        "align": "center"
      },
      {
        "key": "slot6",
        "label": "6º",
        "isSpellSlot": true,
        "align": "center"
      },
      {
        "key": "slot7",
        "label": "7º",
        "isSpellSlot": true,
        "align": "center"
      },
      {
        "key": "slot8",
        "label": "8º",
        "isSpellSlot": true,
        "align": "center"
      },
      {
        "key": "slot9",
        "label": "9º",
        "isSpellSlot": true,
        "align": "center"
      }
    ],
    "rows": [
      {
        "level": 1,
        "pb": "+2",
        "features": [
          "Conjuração",
          "Idioma Druídico",
          "Ordem Primal"
        ],
        "values": {
          "wildShape": "—",
          "cantrips": "2",
          "prepSpells": "4",
          "slot1": "2",
          "slot2": "—",
          "slot3": "—",
          "slot4": "—",
          "slot5": "—",
          "slot6": "—",
          "slot7": "—",
          "slot8": "—",
          "slot9": "—"
        }
      },
      {
        "level": 2,
        "pb": "+2",
        "features": [
          "Companheiro Selvagem",
          "Forma Selvagem"
        ],
        "values": {
          "wildShape": "2",
          "cantrips": "2",
          "prepSpells": "5",
          "slot1": "3",
          "slot2": "—",
          "slot3": "—",
          "slot4": "—",
          "slot5": "—",
          "slot6": "—",
          "slot7": "—",
          "slot8": "—",
          "slot9": "—"
        }
      },
      {
        "level": 3,
        "pb": "+2",
        "features": [
          "Subclasse de Druida"
        ],
        "values": {
          "wildShape": "2",
          "cantrips": "2",
          "prepSpells": "6",
          "slot1": "4",
          "slot2": "2",
          "slot3": "—",
          "slot4": "—",
          "slot5": "—",
          "slot6": "—",
          "slot7": "—",
          "slot8": "—",
          "slot9": "—"
        }
      },
      {
        "level": 4,
        "pb": "+2",
        "features": [
          "Aumento no Valor de Atributo (ASI / Talento)"
        ],
        "values": {
          "wildShape": "2",
          "cantrips": "3",
          "prepSpells": "7",
          "slot1": "4",
          "slot2": "3",
          "slot3": "—",
          "slot4": "—",
          "slot5": "—",
          "slot6": "—",
          "slot7": "—",
          "slot8": "—",
          "slot9": "—"
        }
      },
      {
        "level": 5,
        "pb": "+3",
        "features": [
          "Ressurgimento Selvagem"
        ],
        "values": {
          "wildShape": "2",
          "cantrips": "3",
          "prepSpells": "9",
          "slot1": "4",
          "slot2": "3",
          "slot3": "2",
          "slot4": "—",
          "slot5": "—",
          "slot6": "—",
          "slot7": "—",
          "slot8": "—",
          "slot9": "—"
        }
      },
      {
        "level": 6,
        "pb": "+3",
        "features": [
          "Característica de Subclasse"
        ],
        "values": {
          "wildShape": "3",
          "cantrips": "3",
          "prepSpells": "10",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "—",
          "slot5": "—",
          "slot6": "—",
          "slot7": "—",
          "slot8": "—",
          "slot9": "—"
        }
      },
      {
        "level": 7,
        "pb": "+3",
        "features": [
          "Fúria Elemental"
        ],
        "values": {
          "wildShape": "3",
          "cantrips": "3",
          "prepSpells": "11",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "1",
          "slot5": "—",
          "slot6": "—",
          "slot7": "—",
          "slot8": "—",
          "slot9": "—"
        }
      },
      {
        "level": 8,
        "pb": "+3",
        "features": [
          "Aumento no Valor de Atributo (ASI / Talento)"
        ],
        "values": {
          "wildShape": "3",
          "cantrips": "3",
          "prepSpells": "12",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "2",
          "slot5": "—",
          "slot6": "—",
          "slot7": "—",
          "slot8": "—",
          "slot9": "—"
        }
      },
      {
        "level": 9,
        "pb": "+4",
        "features": [],
        "values": {
          "wildShape": "3",
          "cantrips": "3",
          "prepSpells": "14",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "3",
          "slot5": "1",
          "slot6": "—",
          "slot7": "—",
          "slot8": "—",
          "slot9": "—"
        }
      },
      {
        "level": 10,
        "pb": "+4",
        "features": [
          "Característica de Subclasse"
        ],
        "values": {
          "wildShape": "3",
          "cantrips": "4",
          "prepSpells": "15",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "3",
          "slot5": "2",
          "slot6": "—",
          "slot7": "—",
          "slot8": "—",
          "slot9": "—"
        }
      },
      {
        "level": 11,
        "pb": "+4",
        "features": [],
        "values": {
          "wildShape": "3",
          "cantrips": "4",
          "prepSpells": "16",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "3",
          "slot5": "2",
          "slot6": "1",
          "slot7": "—",
          "slot8": "—",
          "slot9": "—"
        }
      },
      {
        "level": 12,
        "pb": "+4",
        "features": [
          "Aumento no Valor de Atributo (ASI / Talento)"
        ],
        "values": {
          "wildShape": "3",
          "cantrips": "4",
          "prepSpells": "16",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "3",
          "slot5": "2",
          "slot6": "1",
          "slot7": "—",
          "slot8": "—",
          "slot9": "—"
        }
      },
      {
        "level": 13,
        "pb": "+5",
        "features": [],
        "values": {
          "wildShape": "3",
          "cantrips": "4",
          "prepSpells": "17",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "3",
          "slot5": "2",
          "slot6": "1",
          "slot7": "1",
          "slot8": "—",
          "slot9": "—"
        }
      },
      {
        "level": 14,
        "pb": "+5",
        "features": [
          "Característica de Subclasse"
        ],
        "values": {
          "wildShape": "3",
          "cantrips": "4",
          "prepSpells": "17",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "3",
          "slot5": "2",
          "slot6": "1",
          "slot7": "1",
          "slot8": "—",
          "slot9": "—"
        }
      },
      {
        "level": 15,
        "pb": "+5",
        "features": [
          "Fúria Elemental Aprimorada"
        ],
        "values": {
          "wildShape": "3",
          "cantrips": "4",
          "prepSpells": "18",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "3",
          "slot5": "2",
          "slot6": "1",
          "slot7": "1",
          "slot8": "1",
          "slot9": "—"
        }
      },
      {
        "level": 16,
        "pb": "+5",
        "features": [
          "Aumento no Valor de Atributo (ASI / Talento)"
        ],
        "values": {
          "wildShape": "3",
          "cantrips": "4",
          "prepSpells": "18",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "3",
          "slot5": "2",
          "slot6": "1",
          "slot7": "1",
          "slot8": "1",
          "slot9": "—"
        }
      },
      {
        "level": 17,
        "pb": "+6",
        "features": [],
        "values": {
          "wildShape": "4",
          "cantrips": "4",
          "prepSpells": "19",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "3",
          "slot5": "2",
          "slot6": "1",
          "slot7": "1",
          "slot8": "1",
          "slot9": "1"
        }
      },
      {
        "level": 18,
        "pb": "+6",
        "features": [
          "Magias Bestiais"
        ],
        "values": {
          "wildShape": "4",
          "cantrips": "4",
          "prepSpells": "20",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "3",
          "slot5": "3",
          "slot6": "1",
          "slot7": "1",
          "slot8": "1",
          "slot9": "1"
        }
      },
      {
        "level": 19,
        "pb": "+6",
        "features": [
          "Dádiva Épica"
        ],
        "values": {
          "wildShape": "4",
          "cantrips": "4",
          "prepSpells": "21",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "3",
          "slot5": "3",
          "slot6": "2",
          "slot7": "1",
          "slot8": "1",
          "slot9": "1"
        }
      },
      {
        "level": 20,
        "pb": "+6",
        "features": [
          "Arquidruida"
        ],
        "values": {
          "wildShape": "4",
          "cantrips": "4",
          "prepSpells": "22",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "3",
          "slot5": "3",
          "slot6": "2",
          "slot7": "2",
          "slot8": "1",
          "slot9": "1"
        }
      }
    ],
    "subclasses": [
      {
        "id": "land",
        "name": "Círculo da Terra",
        "description": "Recuperação natural de espaços de magia em descanso curto e listas temáticas de biomas (Ártico, Deserto, Floresta, etc.).",
        "milestoneLevels": [
          3,
          6,
          10,
          14
        ]
      },
      {
        "id": "moon",
        "name": "Círculo da Lua",
        "description": "Mestre supremo da Forma Selvagem: feras colossais com CA aprimorada, cura com ação bônus e ataques radiantes.",
        "milestoneLevels": [
          3,
          6,
          10,
          14
        ]
      },
      {
        "id": "sea",
        "name": "Círculo do Mar",
        "description": "Fúria dos oceanos, tempestades elétricas ao redor do corpo e ondas impetuosas que repelem adversários.",
        "milestoneLevels": [
          3,
          6,
          10,
          14
        ]
      },
      {
        "id": "stars",
        "name": "Círculo das Estrelas",
        "description": "Mapeamento celestial e Formas Estelares (Arqueiro, Cálice, Dragão) que potencializam ataques, curas e concentração.",
        "milestoneLevels": [
          3,
          6,
          10,
          14
        ]
      }
    ]
  },
  "sorcerer": {
    "classId": "sorcerer",
    "className": "Feiticeiro",
    "system": "dnd55e",
    "hitDie": "d6",
    "primaryAbility": "Carisma",
    "savingThrows": [
      "Constituição",
      "Carisma"
    ],
    "armorProficiencies": [
      "Nenhuma"
    ],
    "weaponProficiencies": [
      "Simples"
    ],
    "hasSpellcasting": true,
    "spellcastingType": "full",
    "columns": [
      {
        "key": "sorceryPoints",
        "label": "Pontos de Feitiçaria",
        "tooltip": "Pontos de metamagia e criação de espaços",
        "align": "center"
      },
      {
        "key": "cantrips",
        "label": "Truques",
        "tooltip": "Truques inatos conhecidos",
        "align": "center"
      },
      {
        "key": "prepSpells",
        "label": "Magias Prep.",
        "tooltip": "Magias inatas preparadas",
        "align": "center"
      },
      {
        "key": "slot1",
        "label": "1º",
        "isSpellSlot": true,
        "align": "center"
      },
      {
        "key": "slot2",
        "label": "2º",
        "isSpellSlot": true,
        "align": "center"
      },
      {
        "key": "slot3",
        "label": "3º",
        "isSpellSlot": true,
        "align": "center"
      },
      {
        "key": "slot4",
        "label": "4º",
        "isSpellSlot": true,
        "align": "center"
      },
      {
        "key": "slot5",
        "label": "5º",
        "isSpellSlot": true,
        "align": "center"
      },
      {
        "key": "slot6",
        "label": "6º",
        "isSpellSlot": true,
        "align": "center"
      },
      {
        "key": "slot7",
        "label": "7º",
        "isSpellSlot": true,
        "align": "center"
      },
      {
        "key": "slot8",
        "label": "8º",
        "isSpellSlot": true,
        "align": "center"
      },
      {
        "key": "slot9",
        "label": "9º",
        "isSpellSlot": true,
        "align": "center"
      }
    ],
    "rows": [
      {
        "level": 1,
        "pb": "+2",
        "features": [
          "Conjuração",
          "Feitiçaria Inata"
        ],
        "values": {
          "sorceryPoints": "—",
          "cantrips": "4",
          "prepSpells": "2",
          "slot1": "2",
          "slot2": "—",
          "slot3": "—",
          "slot4": "—",
          "slot5": "—",
          "slot6": "—",
          "slot7": "—",
          "slot8": "—",
          "slot9": "—"
        }
      },
      {
        "level": 2,
        "pb": "+2",
        "features": [
          "Fonte de Magia",
          "Metamagia",
          "Opções de Metamagia"
        ],
        "values": {
          "sorceryPoints": "2",
          "cantrips": "4",
          "prepSpells": "4",
          "slot1": "3",
          "slot2": "—",
          "slot3": "—",
          "slot4": "—",
          "slot5": "—",
          "slot6": "—",
          "slot7": "—",
          "slot8": "—",
          "slot9": "—"
        }
      },
      {
        "level": 3,
        "pb": "+2",
        "features": [
          "Subclasse de Feiticeiro"
        ],
        "values": {
          "sorceryPoints": "3",
          "cantrips": "4",
          "prepSpells": "6",
          "slot1": "4",
          "slot2": "2",
          "slot3": "—",
          "slot4": "—",
          "slot5": "—",
          "slot6": "—",
          "slot7": "—",
          "slot8": "—",
          "slot9": "—"
        }
      },
      {
        "level": 4,
        "pb": "+2",
        "features": [
          "Aumento no Valor de Atributo (ASI / Talento)"
        ],
        "values": {
          "sorceryPoints": "4",
          "cantrips": "5",
          "prepSpells": "7",
          "slot1": "4",
          "slot2": "3",
          "slot3": "—",
          "slot4": "—",
          "slot5": "—",
          "slot6": "—",
          "slot7": "—",
          "slot8": "—",
          "slot9": "—"
        }
      },
      {
        "level": 5,
        "pb": "+3",
        "features": [
          "Restauração Feiticeira"
        ],
        "values": {
          "sorceryPoints": "5",
          "cantrips": "5",
          "prepSpells": "9",
          "slot1": "4",
          "slot2": "3",
          "slot3": "2",
          "slot4": "—",
          "slot5": "—",
          "slot6": "—",
          "slot7": "—",
          "slot8": "—",
          "slot9": "—"
        }
      },
      {
        "level": 6,
        "pb": "+3",
        "features": [
          "Característica de Subclasse"
        ],
        "values": {
          "sorceryPoints": "6",
          "cantrips": "5",
          "prepSpells": "10",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "—",
          "slot5": "—",
          "slot6": "—",
          "slot7": "—",
          "slot8": "—",
          "slot9": "—"
        }
      },
      {
        "level": 7,
        "pb": "+3",
        "features": [
          "Feitiçaria Encarnada"
        ],
        "values": {
          "sorceryPoints": "7",
          "cantrips": "5",
          "prepSpells": "11",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "1",
          "slot5": "—",
          "slot6": "—",
          "slot7": "—",
          "slot8": "—",
          "slot9": "—"
        }
      },
      {
        "level": 8,
        "pb": "+3",
        "features": [
          "Aumento no Valor de Atributo (ASI / Talento)"
        ],
        "values": {
          "sorceryPoints": "8",
          "cantrips": "5",
          "prepSpells": "12",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "2",
          "slot5": "—",
          "slot6": "—",
          "slot7": "—",
          "slot8": "—",
          "slot9": "—"
        }
      },
      {
        "level": 9,
        "pb": "+4",
        "features": [],
        "values": {
          "sorceryPoints": "9",
          "cantrips": "5",
          "prepSpells": "14",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "3",
          "slot5": "1",
          "slot6": "—",
          "slot7": "—",
          "slot8": "—",
          "slot9": "—"
        }
      },
      {
        "level": 10,
        "pb": "+4",
        "features": [
          "Metamagia"
        ],
        "values": {
          "sorceryPoints": "10",
          "cantrips": "6",
          "prepSpells": "15",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "3",
          "slot5": "2",
          "slot6": "—",
          "slot7": "—",
          "slot8": "—",
          "slot9": "—"
        }
      },
      {
        "level": 11,
        "pb": "+4",
        "features": [],
        "values": {
          "sorceryPoints": "11",
          "cantrips": "6",
          "prepSpells": "16",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "3",
          "slot5": "2",
          "slot6": "1",
          "slot7": "—",
          "slot8": "—",
          "slot9": "—"
        }
      },
      {
        "level": 12,
        "pb": "+4",
        "features": [
          "Aumento no Valor de Atributo (ASI / Talento)"
        ],
        "values": {
          "sorceryPoints": "12",
          "cantrips": "6",
          "prepSpells": "16",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "3",
          "slot5": "2",
          "slot6": "1",
          "slot7": "—",
          "slot8": "—",
          "slot9": "—"
        }
      },
      {
        "level": 13,
        "pb": "+5",
        "features": [],
        "values": {
          "sorceryPoints": "13",
          "cantrips": "6",
          "prepSpells": "17",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "3",
          "slot5": "2",
          "slot6": "1",
          "slot7": "1",
          "slot8": "—",
          "slot9": "—"
        }
      },
      {
        "level": 14,
        "pb": "+5",
        "features": [
          "Característica de Subclasse"
        ],
        "values": {
          "sorceryPoints": "14",
          "cantrips": "6",
          "prepSpells": "17",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "3",
          "slot5": "2",
          "slot6": "1",
          "slot7": "1",
          "slot8": "—",
          "slot9": "—"
        }
      },
      {
        "level": 15,
        "pb": "+5",
        "features": [],
        "values": {
          "sorceryPoints": "15",
          "cantrips": "6",
          "prepSpells": "18",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "3",
          "slot5": "2",
          "slot6": "1",
          "slot7": "1",
          "slot8": "1",
          "slot9": "—"
        }
      },
      {
        "level": 16,
        "pb": "+5",
        "features": [
          "Aumento no Valor de Atributo (ASI / Talento)"
        ],
        "values": {
          "sorceryPoints": "16",
          "cantrips": "6",
          "prepSpells": "18",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "3",
          "slot5": "2",
          "slot6": "1",
          "slot7": "1",
          "slot8": "1",
          "slot9": "—"
        }
      },
      {
        "level": 17,
        "pb": "+6",
        "features": [
          "Metamagia"
        ],
        "values": {
          "sorceryPoints": "17",
          "cantrips": "6",
          "prepSpells": "19",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "3",
          "slot5": "2",
          "slot6": "1",
          "slot7": "1",
          "slot8": "1",
          "slot9": "1"
        }
      },
      {
        "level": 18,
        "pb": "+6",
        "features": [
          "Característica de Subclasse"
        ],
        "values": {
          "sorceryPoints": "18",
          "cantrips": "6",
          "prepSpells": "20",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "3",
          "slot5": "3",
          "slot6": "1",
          "slot7": "1",
          "slot8": "1",
          "slot9": "1"
        }
      },
      {
        "level": 19,
        "pb": "+6",
        "features": [
          "Dádiva Épica"
        ],
        "values": {
          "sorceryPoints": "19",
          "cantrips": "6",
          "prepSpells": "21",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "3",
          "slot5": "3",
          "slot6": "2",
          "slot7": "1",
          "slot8": "1",
          "slot9": "1"
        }
      },
      {
        "level": 20,
        "pb": "+6",
        "features": [
          "Apoteose Arcana"
        ],
        "values": {
          "sorceryPoints": "20",
          "cantrips": "6",
          "prepSpells": "22",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "3",
          "slot5": "3",
          "slot6": "2",
          "slot7": "2",
          "slot8": "1",
          "slot9": "1"
        }
      }
    ],
    "subclasses": [
      {
        "id": "draconic",
        "name": "Feitiçaria Dracônica",
        "description": "Escamas de dragão (CA 10 + Des + Car), asas membranosas para voo e afinidade elemental devastadora.",
        "milestoneLevels": [
          3,
          6,
          14,
          18
        ]
      },
      {
        "id": "wild_magic",
        "name": "Magia Selvagem",
        "description": "Surtos de caos imprevisíveis na Tabela de Magia Selvagem, manipulação de probabilidades e Marés do Caos.",
        "milestoneLevels": [
          3,
          6,
          14,
          18
        ]
      },
      {
        "id": "aberrant",
        "name": "Mente Aberrante",
        "description": "Poderes psiônicos do Reino Distante, telepatia alienígena e conjuração sutil sem componentes verbais ou somáticos.",
        "milestoneLevels": [
          3,
          6,
          14,
          18
        ]
      },
      {
        "id": "clockwork",
        "name": "Alma Mecânica",
        "description": "Ordem cósmica de Mechanus: anulação de vantagem/desvantagem, armadura de engrenagens protetoras e restauração.",
        "milestoneLevels": [
          3,
          6,
          14,
          18
        ]
      }
    ]
  },
  "ranger": {
    "classId": "ranger",
    "className": "Guardião",
    "system": "dnd55e",
    "hitDie": "d10",
    "primaryAbility": "Destreza e Sabedoria",
    "savingThrows": [
      "Força",
      "Destreza"
    ],
    "armorProficiencies": [
      "Leve",
      "Média",
      "Escudos"
    ],
    "weaponProficiencies": [
      "Simples",
      "Marciais"
    ],
    "hasSpellcasting": true,
    "spellcastingType": "half",
    "columns": [
      {
        "key": "attacks",
        "label": "Ataques",
        "tooltip": "Número de ataques realizados com a Ação Atacar",
        "align": "center"
      },
      {
        "key": "weaponMastery",
        "label": "Maestrias em Armas",
        "tooltip": "Propriedades de Maestria de armas ativas",
        "align": "center"
      },
      {
        "key": "prepSpells",
        "label": "Magias Prep.",
        "tooltip": "Magias da natureza preparadas",
        "align": "center"
      },
      {
        "key": "slot1",
        "label": "1º",
        "isSpellSlot": true,
        "align": "center"
      },
      {
        "key": "slot2",
        "label": "2º",
        "isSpellSlot": true,
        "align": "center"
      },
      {
        "key": "slot3",
        "label": "3º",
        "isSpellSlot": true,
        "align": "center"
      },
      {
        "key": "slot4",
        "label": "4º",
        "isSpellSlot": true,
        "align": "center"
      },
      {
        "key": "slot5",
        "label": "5º",
        "isSpellSlot": true,
        "align": "center"
      }
    ],
    "rows": [
      {
        "level": 1,
        "pb": "+2",
        "features": [
          "Conjuração",
          "Inimigo Favorito",
          "Maestria em Arma"
        ],
        "values": {
          "weaponMastery": "2",
          "prepSpells": "2",
          "slot1": "2",
          "slot2": "—",
          "slot3": "—",
          "slot4": "—",
          "slot5": "—",
          "attacks": "1"
        }
      },
      {
        "level": 2,
        "pb": "+2",
        "features": [
          "Estilo de Luta",
          "Explorador Hábil"
        ],
        "values": {
          "weaponMastery": "2",
          "prepSpells": "3",
          "slot1": "2",
          "slot2": "—",
          "slot3": "—",
          "slot4": "—",
          "slot5": "—",
          "attacks": "1"
        }
      },
      {
        "level": 3,
        "pb": "+2",
        "features": [
          "Subclasse de Guardião"
        ],
        "values": {
          "weaponMastery": "2",
          "prepSpells": "4",
          "slot1": "3",
          "slot2": "—",
          "slot3": "—",
          "slot4": "—",
          "slot5": "—",
          "attacks": "1"
        }
      },
      {
        "level": 4,
        "pb": "+2",
        "features": [
          "Aumento no Valor de Atributo (ASI / Talento)"
        ],
        "values": {
          "weaponMastery": "2",
          "prepSpells": "5",
          "slot1": "3",
          "slot2": "—",
          "slot3": "—",
          "slot4": "—",
          "slot5": "—",
          "attacks": "1"
        }
      },
      {
        "level": 5,
        "pb": "+3",
        "features": [
          "Ataque Extra"
        ],
        "values": {
          "weaponMastery": "3",
          "prepSpells": "6",
          "slot1": "4",
          "slot2": "2",
          "slot3": "—",
          "slot4": "—",
          "slot5": "—",
          "attacks": "2"
        }
      },
      {
        "level": 6,
        "pb": "+3",
        "features": [
          "Errante"
        ],
        "values": {
          "weaponMastery": "3",
          "prepSpells": "6",
          "slot1": "4",
          "slot2": "2",
          "slot3": "—",
          "slot4": "—",
          "slot5": "—",
          "attacks": "2"
        }
      },
      {
        "level": 7,
        "pb": "+3",
        "features": [
          "Característica de Subclasse"
        ],
        "values": {
          "weaponMastery": "3",
          "prepSpells": "7",
          "slot1": "4",
          "slot2": "3",
          "slot3": "—",
          "slot4": "—",
          "slot5": "—",
          "attacks": "2"
        }
      },
      {
        "level": 8,
        "pb": "+3",
        "features": [
          "Aumento no Valor de Atributo (ASI / Talento)"
        ],
        "values": {
          "weaponMastery": "3",
          "prepSpells": "7",
          "slot1": "4",
          "slot2": "3",
          "slot3": "—",
          "slot4": "—",
          "slot5": "—",
          "attacks": "2"
        }
      },
      {
        "level": 9,
        "pb": "+4",
        "features": [
          "Especialista"
        ],
        "values": {
          "weaponMastery": "4",
          "prepSpells": "9",
          "slot1": "4",
          "slot2": "3",
          "slot3": "2",
          "slot4": "—",
          "slot5": "—",
          "attacks": "2"
        }
      },
      {
        "level": 10,
        "pb": "+4",
        "features": [
          "Incansável"
        ],
        "values": {
          "weaponMastery": "4",
          "prepSpells": "9",
          "slot1": "4",
          "slot2": "3",
          "slot3": "2",
          "slot4": "—",
          "slot5": "—",
          "attacks": "2"
        }
      },
      {
        "level": 11,
        "pb": "+4",
        "features": [
          "Característica de Subclasse"
        ],
        "values": {
          "weaponMastery": "4",
          "prepSpells": "10",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "—",
          "slot5": "—",
          "attacks": "2"
        }
      },
      {
        "level": 12,
        "pb": "+4",
        "features": [
          "Aumento no Valor de Atributo (ASI / Talento)"
        ],
        "values": {
          "weaponMastery": "4",
          "prepSpells": "10",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "—",
          "slot5": "—",
          "attacks": "2"
        }
      },
      {
        "level": 13,
        "pb": "+5",
        "features": [
          "Predador Implacável"
        ],
        "values": {
          "weaponMastery": "5",
          "prepSpells": "11",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "1",
          "slot5": "—",
          "attacks": "2"
        }
      },
      {
        "level": 14,
        "pb": "+5",
        "features": [
          "Véu da Natureza"
        ],
        "values": {
          "weaponMastery": "5",
          "prepSpells": "11",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "1",
          "slot5": "—",
          "attacks": "2"
        }
      },
      {
        "level": 15,
        "pb": "+5",
        "features": [
          "Característica de Subclasse"
        ],
        "values": {
          "weaponMastery": "5",
          "prepSpells": "12",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "2",
          "slot5": "—",
          "attacks": "2"
        }
      },
      {
        "level": 16,
        "pb": "+5",
        "features": [
          "Aumento no Valor de Atributo (ASI / Talento)"
        ],
        "values": {
          "weaponMastery": "5",
          "prepSpells": "12",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "2",
          "slot5": "—",
          "attacks": "2"
        }
      },
      {
        "level": 17,
        "pb": "+6",
        "features": [
          "Caçador Preciso"
        ],
        "values": {
          "weaponMastery": "6",
          "prepSpells": "14",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "3",
          "slot5": "1",
          "attacks": "2"
        }
      },
      {
        "level": 18,
        "pb": "+6",
        "features": [
          "Sentidos Selvagens"
        ],
        "values": {
          "weaponMastery": "6",
          "prepSpells": "14",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "3",
          "slot5": "1",
          "attacks": "2"
        }
      },
      {
        "level": 19,
        "pb": "+6",
        "features": [
          "Dádiva Épica"
        ],
        "values": {
          "weaponMastery": "6",
          "prepSpells": "15",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "3",
          "slot5": "2",
          "attacks": "2"
        }
      },
      {
        "level": 20,
        "pb": "+6",
        "features": [
          "Matador de Inimigos Favoritos"
        ],
        "values": {
          "weaponMastery": "6",
          "prepSpells": "15",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "3",
          "slot5": "2",
          "attacks": "2"
        }
      }
    ],
    "subclasses": [
      {
        "id": "beast_master",
        "name": "Mestre das Feras",
        "description": "Companheiro primal leal (Terra, Céu ou Mar) que ataca coordenadamente e divide suas defesas.",
        "milestoneLevels": [
          3,
          7,
          11,
          15
        ]
      },
      {
        "id": "hunter",
        "name": "Caçador",
        "description": "Táticas versáteis contra hordas ou presas gigantescas: Matador de Colossos, Quebrador de Hordas e Esquiva Defensiva.",
        "milestoneLevels": [
          3,
          7,
          11,
          15
        ]
      },
      {
        "id": "gloom_stalker",
        "name": "Senhor das Sombras",
        "description": "Terror da escuridão: invisível para criaturas com visão no escuro, emboscada voraz e iniciativa letal.",
        "milestoneLevels": [
          3,
          7,
          11,
          15
        ]
      },
      {
        "id": "fey_wanderer",
        "name": "Andarilho Feérico",
        "description": "Graça sobrenatural somando Sabedoria em testes de Carisma, dano psíquico adicional e conjuração de fadas.",
        "milestoneLevels": [
          3,
          7,
          11,
          15
        ]
      }
    ]
  },
  "fighter": {
    "classId": "fighter",
    "className": "Guerreiro",
    "system": "dnd55e",
    "hitDie": "d10",
    "primaryAbility": "Força ou Destreza",
    "savingThrows": [
      "Força",
      "Constituição"
    ],
    "armorProficiencies": [
      "Leve",
      "Média",
      "Pesada",
      "Escudos"
    ],
    "weaponProficiencies": [
      "Simples",
      "Marciais"
    ],
    "hasSpellcasting": false,
    "spellcastingType": "none",
    "columns": [
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
    ],
    "rows": [
      {
        "level": 1,
        "pb": "+2",
        "features": [
          "Estilo de Luta",
          "Maestria em Arma",
          "Recuperar Fôlego"
        ],
        "values": {
          "secondWind": "2 usos",
          "weaponMastery": "3 armas",
          "attacks": "1",
          "actionSurge": "—",
          "indomitable": "—"
        }
      },
      {
        "level": 2,
        "pb": "+2",
        "features": [
          "Mente Tática",
          "Surto de Ação"
        ],
        "values": {
          "secondWind": "2 usos",
          "weaponMastery": "3 armas",
          "attacks": "1",
          "actionSurge": "1 uso",
          "indomitable": "—"
        }
      },
      {
        "level": 3,
        "pb": "+2",
        "features": [
          "Subclasse de Guerreiro"
        ],
        "values": {
          "secondWind": "2 usos",
          "weaponMastery": "3 armas",
          "attacks": "1",
          "actionSurge": "1 uso",
          "indomitable": "—"
        }
      },
      {
        "level": 4,
        "pb": "+2",
        "features": [
          "Aumento no Valor de Atributo (ASI / Talento)"
        ],
        "values": {
          "secondWind": "3 usos",
          "weaponMastery": "4 armas",
          "attacks": "1",
          "actionSurge": "1 uso",
          "indomitable": "—"
        }
      },
      {
        "level": 5,
        "pb": "+3",
        "features": [
          "Ajuste Tático",
          "Ataque Extra"
        ],
        "values": {
          "secondWind": "3 usos",
          "weaponMastery": "4 armas",
          "attacks": "2",
          "actionSurge": "1 uso",
          "indomitable": "—"
        }
      },
      {
        "level": 6,
        "pb": "+3",
        "features": [
          "Aumento no Valor de Atributo (ASI / Talento)"
        ],
        "values": {
          "secondWind": "3 usos",
          "weaponMastery": "4 armas",
          "attacks": "2",
          "actionSurge": "1 uso",
          "indomitable": "—"
        }
      },
      {
        "level": 7,
        "pb": "+3",
        "features": [
          "Característica de Subclasse"
        ],
        "values": {
          "secondWind": "3 usos",
          "weaponMastery": "4 armas",
          "attacks": "2",
          "actionSurge": "1 uso",
          "indomitable": "—"
        }
      },
      {
        "level": 8,
        "pb": "+3",
        "features": [
          "Aumento no Valor de Atributo (ASI / Talento)"
        ],
        "values": {
          "secondWind": "3 usos",
          "weaponMastery": "4 armas",
          "attacks": "2",
          "actionSurge": "1 uso",
          "indomitable": "—"
        }
      },
      {
        "level": 9,
        "pb": "+4",
        "features": [
          "Indomável",
          "Mestre Tático"
        ],
        "values": {
          "secondWind": "3 usos",
          "weaponMastery": "4 armas",
          "attacks": "2",
          "actionSurge": "1 uso",
          "indomitable": "1 uso (+9)"
        }
      },
      {
        "level": 10,
        "pb": "+4",
        "features": [
          "Característica de Subclasse"
        ],
        "values": {
          "secondWind": "4 usos",
          "weaponMastery": "5 armas",
          "attacks": "2",
          "actionSurge": "1 uso",
          "indomitable": "1 uso (+9)"
        }
      },
      {
        "level": 11,
        "pb": "+4",
        "features": [
          "Dois Ataques Extras"
        ],
        "values": {
          "secondWind": "4 usos",
          "weaponMastery": "5 armas",
          "attacks": "3",
          "actionSurge": "1 uso",
          "indomitable": "1 uso (+9)"
        }
      },
      {
        "level": 12,
        "pb": "+4",
        "features": [
          "Aumento no Valor de Atributo (ASI / Talento)"
        ],
        "values": {
          "secondWind": "4 usos",
          "weaponMastery": "5 armas",
          "attacks": "3",
          "actionSurge": "1 uso",
          "indomitable": "1 uso (+9)"
        }
      },
      {
        "level": 13,
        "pb": "+5",
        "features": [
          "Ataques Estudados",
          "Indomável"
        ],
        "values": {
          "secondWind": "4 usos",
          "weaponMastery": "5 armas",
          "attacks": "3",
          "actionSurge": "1 uso",
          "indomitable": "2 usos (+13)"
        }
      },
      {
        "level": 14,
        "pb": "+5",
        "features": [
          "Aumento no Valor de Atributo (ASI / Talento)"
        ],
        "values": {
          "secondWind": "4 usos",
          "weaponMastery": "5 armas",
          "attacks": "3",
          "actionSurge": "1 uso",
          "indomitable": "2 usos (+13)"
        }
      },
      {
        "level": 15,
        "pb": "+5",
        "features": [
          "Característica de Subclasse"
        ],
        "values": {
          "secondWind": "4 usos",
          "weaponMastery": "5 armas",
          "attacks": "3",
          "actionSurge": "1 uso",
          "indomitable": "2 usos (+13)"
        }
      },
      {
        "level": 16,
        "pb": "+5",
        "features": [
          "Aumento no Valor de Atributo (ASI / Talento)"
        ],
        "values": {
          "secondWind": "4 usos",
          "weaponMastery": "6 armas",
          "attacks": "3",
          "actionSurge": "1 uso",
          "indomitable": "2 usos (+13)"
        }
      },
      {
        "level": 17,
        "pb": "+6",
        "features": [
          "Indomável",
          "Surto de Ação"
        ],
        "values": {
          "secondWind": "4 usos",
          "weaponMastery": "6 armas",
          "attacks": "3",
          "actionSurge": "2 usos",
          "indomitable": "3 usos (+17)"
        }
      },
      {
        "level": 18,
        "pb": "+6",
        "features": [
          "Característica de Subclasse"
        ],
        "values": {
          "secondWind": "4 usos",
          "weaponMastery": "6 armas",
          "attacks": "3",
          "actionSurge": "2 usos",
          "indomitable": "3 usos (+17)"
        }
      },
      {
        "level": 19,
        "pb": "+6",
        "features": [
          "Dádiva Épica"
        ],
        "values": {
          "secondWind": "4 usos",
          "weaponMastery": "6 armas",
          "attacks": "3",
          "actionSurge": "2 usos",
          "indomitable": "3 usos (+17)"
        }
      },
      {
        "level": 20,
        "pb": "+6",
        "features": [
          "Três Ataques Extras"
        ],
        "values": {
          "secondWind": "4 usos",
          "weaponMastery": "6 armas",
          "attacks": "4",
          "actionSurge": "2 usos",
          "indomitable": "3 usos (+17)"
        }
      }
    ],
    "subclasses": [
      {
        "id": "battle_master",
        "name": "Mestre da Batalha",
        "description": "Especialista em manobras táticas (Aparar, Riposte, Desarmar, Rasteira) impulsionadas por Dados de Superioridade d8.",
        "milestoneLevels": [
          3,
          7,
          10,
          15,
          18
        ]
      },
      {
        "id": "champion",
        "name": "Campeão",
        "description": "Foco no poder atlético puro: acertos críticos ampliados em 19-20, sobrevivente resiliente e estilo de luta heroico.",
        "milestoneLevels": [
          3,
          7,
          10,
          15,
          18
        ]
      },
      {
        "id": "eldritch_knight",
        "name": "Cavaleiro Arcano",
        "description": "Mescla maestria marcial com magia arcana: conjura magias de Mago enquanto desfere ataques com armas.",
        "milestoneLevels": [
          3,
          7,
          10,
          15,
          18
        ]
      },
      {
        "id": "psi_warrior",
        "name": "Guerreiro Psíquico",
        "description": "Poder mental telecinético que ergue escudos psiônicos, arremessa armas mentais e propulsiona saltos aéreos.",
        "milestoneLevels": [
          3,
          7,
          10,
          15,
          18
        ]
      }
    ]
  },
  "rogue": {
    "classId": "rogue",
    "className": "Ladino",
    "system": "dnd55e",
    "hitDie": "d8",
    "primaryAbility": "Destreza",
    "savingThrows": [
      "Destreza",
      "Inteligência"
    ],
    "armorProficiencies": [
      "Leve"
    ],
    "weaponProficiencies": [
      "Simples",
      "Marciais com Acuidade"
    ],
    "hasSpellcasting": false,
    "spellcastingType": "none",
    "columns": [
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
    ],
    "rows": [
      {
        "level": 1,
        "pb": "+2",
        "features": [
          "Ataque Furtivo",
          "Especialização",
          "Gíria dos Ladrões",
          "Maestria em Arma"
        ],
        "values": {
          "sneakAttack": "1d6",
          "weaponMastery": "2",
          "cunningStrike": "—",
          "steadyAim": "—"
        }
      },
      {
        "level": 2,
        "pb": "+2",
        "features": [
          "Ação Ardilosa"
        ],
        "values": {
          "sneakAttack": "1d6",
          "weaponMastery": "2",
          "cunningStrike": "—",
          "steadyAim": "—"
        }
      },
      {
        "level": 3,
        "pb": "+2",
        "features": [
          "Mira Firme",
          "Subclasse de Ladino"
        ],
        "values": {
          "sneakAttack": "2d6",
          "weaponMastery": "2",
          "cunningStrike": "—",
          "steadyAim": "Ativo"
        }
      },
      {
        "level": 4,
        "pb": "+2",
        "features": [
          "Aumento no Valor de Atributo (ASI / Talento)"
        ],
        "values": {
          "sneakAttack": "2d6",
          "weaponMastery": "2",
          "cunningStrike": "—",
          "steadyAim": "Ativo"
        }
      },
      {
        "level": 5,
        "pb": "+3",
        "features": [
          "Esquiva Sobrenatural",
          "Golpe Astuto"
        ],
        "values": {
          "sneakAttack": "3d6",
          "weaponMastery": "2",
          "cunningStrike": "Desarmar / Veneno / Derrubar",
          "steadyAim": "Ativo"
        }
      },
      {
        "level": 6,
        "pb": "+3",
        "features": [
          "Especialista"
        ],
        "values": {
          "sneakAttack": "3d6",
          "weaponMastery": "2",
          "cunningStrike": "Desarmar / Veneno / Derrubar",
          "steadyAim": "Ativo"
        }
      },
      {
        "level": 7,
        "pb": "+3",
        "features": [
          "Evasão",
          "Talento Confiável"
        ],
        "values": {
          "sneakAttack": "4d6",
          "weaponMastery": "2",
          "cunningStrike": "Desarmar / Veneno / Derrubar",
          "steadyAim": "Ativo"
        }
      },
      {
        "level": 8,
        "pb": "+3",
        "features": [
          "Aumento no Valor de Atributo (ASI / Talento)"
        ],
        "values": {
          "sneakAttack": "4d6",
          "weaponMastery": "2",
          "cunningStrike": "Desarmar / Veneno / Derrubar",
          "steadyAim": "Ativo"
        }
      },
      {
        "level": 9,
        "pb": "+4",
        "features": [
          "Característica de Subclasse"
        ],
        "values": {
          "sneakAttack": "5d6",
          "weaponMastery": "2",
          "cunningStrike": "Desarmar / Veneno / Derrubar",
          "steadyAim": "Ativo"
        }
      },
      {
        "level": 10,
        "pb": "+4",
        "features": [
          "Aumento no Valor de Atributo (ASI / Talento)"
        ],
        "values": {
          "sneakAttack": "5d6",
          "weaponMastery": "2",
          "cunningStrike": "Desarmar / Veneno / Derrubar",
          "steadyAim": "Ativo"
        }
      },
      {
        "level": 11,
        "pb": "+4",
        "features": [
          "Golpe Astuto Aprimorado"
        ],
        "values": {
          "sneakAttack": "6d6",
          "weaponMastery": "2",
          "cunningStrike": "Aprimorado (1d6)",
          "steadyAim": "Ativo"
        }
      },
      {
        "level": 12,
        "pb": "+4",
        "features": [
          "Aumento no Valor de Atributo (ASI / Talento)"
        ],
        "values": {
          "sneakAttack": "6d6",
          "weaponMastery": "2",
          "cunningStrike": "Aprimorado (1d6)",
          "steadyAim": "Ativo"
        }
      },
      {
        "level": 13,
        "pb": "+5",
        "features": [
          "Característica de Subclasse"
        ],
        "values": {
          "sneakAttack": "7d6",
          "weaponMastery": "2",
          "cunningStrike": "Aprimorado (1d6)",
          "steadyAim": "Ativo"
        }
      },
      {
        "level": 14,
        "pb": "+5",
        "features": [
          "Golpes Sujos"
        ],
        "values": {
          "sneakAttack": "7d6",
          "weaponMastery": "2",
          "cunningStrike": "Golpe Duplo (2 efeitos)",
          "steadyAim": "Ativo"
        }
      },
      {
        "level": 15,
        "pb": "+5",
        "features": [
          "Mente Escorregadia"
        ],
        "values": {
          "sneakAttack": "8d6",
          "weaponMastery": "2",
          "cunningStrike": "Golpe Duplo (2 efeitos)",
          "steadyAim": "Ativo"
        }
      },
      {
        "level": 16,
        "pb": "+5",
        "features": [
          "Aumento no Valor de Atributo (ASI / Talento)"
        ],
        "values": {
          "sneakAttack": "8d6",
          "weaponMastery": "2",
          "cunningStrike": "Golpe Duplo (2 efeitos)",
          "steadyAim": "Ativo"
        }
      },
      {
        "level": 17,
        "pb": "+6",
        "features": [
          "Característica de Subclasse"
        ],
        "values": {
          "sneakAttack": "9d6",
          "weaponMastery": "2",
          "cunningStrike": "Golpe Duplo (2 efeitos)",
          "steadyAim": "Ativo"
        }
      },
      {
        "level": 18,
        "pb": "+6",
        "features": [
          "Elusivo"
        ],
        "values": {
          "sneakAttack": "9d6",
          "weaponMastery": "2",
          "cunningStrike": "Golpe Duplo (2 efeitos)",
          "steadyAim": "Ativo"
        }
      },
      {
        "level": 19,
        "pb": "+6",
        "features": [
          "Dádiva Épica"
        ],
        "values": {
          "sneakAttack": "10d6",
          "weaponMastery": "2",
          "cunningStrike": "Golpe Duplo (2 efeitos)",
          "steadyAim": "Ativo"
        }
      },
      {
        "level": 20,
        "pb": "+6",
        "features": [
          "Golpe de Sorte"
        ],
        "values": {
          "sneakAttack": "10d6",
          "weaponMastery": "2",
          "cunningStrike": "Golpe Duplo (2 efeitos)",
          "steadyAim": "Ativo"
        }
      }
    ],
    "subclasses": [
      {
        "id": "assassin",
        "name": "Assassino",
        "description": "Letalidade implacável no primeiro turno: vantagem em alvos que não agiram, golpes críticos garantidos e venenos.",
        "milestoneLevels": [
          3,
          9,
          13,
          17
        ]
      },
      {
        "id": "thief",
        "name": "Ladrão",
        "description": "Mãos rápidas para usar objetos ou ferramentas como Ação Bônus, escalada ágil e segundo turno no início do combate.",
        "milestoneLevels": [
          3,
          9,
          13,
          17
        ]
      },
      {
        "id": "arcane_trickster",
        "name": "Trapaceiro Arcano",
        "description": "Mão mágica invisível para furtos à distância, magias de ilusão e encantamento de Mago.",
        "milestoneLevels": [
          3,
          9,
          13,
          17
        ]
      },
      {
        "id": "soulknife",
        "name": "Lâmina Espiritual",
        "description": "Manifesta adagas de pura energia psíquica que não deixam marcas e telepatia secreta com a equipe.",
        "milestoneLevels": [
          3,
          9,
          13,
          17
        ]
      }
    ]
  },
  "wizard": {
    "classId": "wizard",
    "className": "Mago",
    "system": "dnd55e",
    "hitDie": "d6",
    "primaryAbility": "Inteligência",
    "savingThrows": [
      "Inteligência",
      "Sabedoria"
    ],
    "armorProficiencies": [
      "Nenhuma"
    ],
    "weaponProficiencies": [
      "Simples"
    ],
    "hasSpellcasting": true,
    "spellcastingType": "full",
    "columns": [
      {
        "key": "cantrips",
        "label": "Truques",
        "tooltip": "Truques arcanos conhecidos",
        "align": "center"
      },
      {
        "key": "prepSpells",
        "label": "Magias Prep.",
        "tooltip": "Magias preparadas do grimório",
        "align": "center"
      },
      {
        "key": "slot1",
        "label": "1º",
        "isSpellSlot": true,
        "align": "center"
      },
      {
        "key": "slot2",
        "label": "2º",
        "isSpellSlot": true,
        "align": "center"
      },
      {
        "key": "slot3",
        "label": "3º",
        "isSpellSlot": true,
        "align": "center"
      },
      {
        "key": "slot4",
        "label": "4º",
        "isSpellSlot": true,
        "align": "center"
      },
      {
        "key": "slot5",
        "label": "5º",
        "isSpellSlot": true,
        "align": "center"
      },
      {
        "key": "slot6",
        "label": "6º",
        "isSpellSlot": true,
        "align": "center"
      },
      {
        "key": "slot7",
        "label": "7º",
        "isSpellSlot": true,
        "align": "center"
      },
      {
        "key": "slot8",
        "label": "8º",
        "isSpellSlot": true,
        "align": "center"
      },
      {
        "key": "slot9",
        "label": "9º",
        "isSpellSlot": true,
        "align": "center"
      }
    ],
    "rows": [
      {
        "level": 1,
        "pb": "+2",
        "features": [
          "Adepto de Ritual",
          "Conjuração",
          "Recuperação Arcana"
        ],
        "values": {
          "cantrips": "3",
          "prepSpells": "4",
          "slot1": "2",
          "slot2": "—",
          "slot3": "—",
          "slot4": "—",
          "slot5": "—",
          "slot6": "—",
          "slot7": "—",
          "slot8": "—",
          "slot9": "—"
        }
      },
      {
        "level": 2,
        "pb": "+2",
        "features": [
          "Acadêmico"
        ],
        "values": {
          "cantrips": "3",
          "prepSpells": "5",
          "slot1": "3",
          "slot2": "—",
          "slot3": "—",
          "slot4": "—",
          "slot5": "—",
          "slot6": "—",
          "slot7": "—",
          "slot8": "—",
          "slot9": "—"
        }
      },
      {
        "level": 3,
        "pb": "+2",
        "features": [
          "Subclasse de Mago"
        ],
        "values": {
          "cantrips": "3",
          "prepSpells": "6",
          "slot1": "4",
          "slot2": "2",
          "slot3": "—",
          "slot4": "—",
          "slot5": "—",
          "slot6": "—",
          "slot7": "—",
          "slot8": "—",
          "slot9": "—"
        }
      },
      {
        "level": 4,
        "pb": "+2",
        "features": [
          "Aumento no Valor de Atributo (ASI / Talento)"
        ],
        "values": {
          "cantrips": "4",
          "prepSpells": "7",
          "slot1": "4",
          "slot2": "3",
          "slot3": "—",
          "slot4": "—",
          "slot5": "—",
          "slot6": "—",
          "slot7": "—",
          "slot8": "—",
          "slot9": "—"
        }
      },
      {
        "level": 5,
        "pb": "+3",
        "features": [
          "Memorizar Magia"
        ],
        "values": {
          "cantrips": "4",
          "prepSpells": "9",
          "slot1": "4",
          "slot2": "3",
          "slot3": "2",
          "slot4": "—",
          "slot5": "—",
          "slot6": "—",
          "slot7": "—",
          "slot8": "—",
          "slot9": "—"
        }
      },
      {
        "level": 6,
        "pb": "+3",
        "features": [
          "Característica de Subclasse"
        ],
        "values": {
          "cantrips": "4",
          "prepSpells": "10",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "—",
          "slot5": "—",
          "slot6": "—",
          "slot7": "—",
          "slot8": "—",
          "slot9": "—"
        }
      },
      {
        "level": 7,
        "pb": "+3",
        "features": [],
        "values": {
          "cantrips": "4",
          "prepSpells": "11",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "1",
          "slot5": "—",
          "slot6": "—",
          "slot7": "—",
          "slot8": "—",
          "slot9": "—"
        }
      },
      {
        "level": 8,
        "pb": "+3",
        "features": [
          "Aumento no Valor de Atributo (ASI / Talento)"
        ],
        "values": {
          "cantrips": "4",
          "prepSpells": "12",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "2",
          "slot5": "—",
          "slot6": "—",
          "slot7": "—",
          "slot8": "—",
          "slot9": "—"
        }
      },
      {
        "level": 9,
        "pb": "+4",
        "features": [],
        "values": {
          "cantrips": "4",
          "prepSpells": "14",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "3",
          "slot5": "1",
          "slot6": "—",
          "slot7": "—",
          "slot8": "—",
          "slot9": "—"
        }
      },
      {
        "level": 10,
        "pb": "+4",
        "features": [
          "Característica de Subclasse"
        ],
        "values": {
          "cantrips": "5",
          "prepSpells": "15",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "3",
          "slot5": "2",
          "slot6": "—",
          "slot7": "—",
          "slot8": "—",
          "slot9": "—"
        }
      },
      {
        "level": 11,
        "pb": "+4",
        "features": [],
        "values": {
          "cantrips": "5",
          "prepSpells": "16",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "3",
          "slot5": "2",
          "slot6": "1",
          "slot7": "—",
          "slot8": "—",
          "slot9": "—"
        }
      },
      {
        "level": 12,
        "pb": "+4",
        "features": [
          "Aumento no Valor de Atributo (ASI / Talento)"
        ],
        "values": {
          "cantrips": "5",
          "prepSpells": "16",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "3",
          "slot5": "2",
          "slot6": "1",
          "slot7": "—",
          "slot8": "—",
          "slot9": "—"
        }
      },
      {
        "level": 13,
        "pb": "+5",
        "features": [],
        "values": {
          "cantrips": "5",
          "prepSpells": "17",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "3",
          "slot5": "2",
          "slot6": "1",
          "slot7": "1",
          "slot8": "—",
          "slot9": "—"
        }
      },
      {
        "level": 14,
        "pb": "+5",
        "features": [
          "Característica de Subclasse"
        ],
        "values": {
          "cantrips": "5",
          "prepSpells": "18",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "3",
          "slot5": "2",
          "slot6": "1",
          "slot7": "1",
          "slot8": "—",
          "slot9": "—"
        }
      },
      {
        "level": 15,
        "pb": "+5",
        "features": [],
        "values": {
          "cantrips": "5",
          "prepSpells": "19",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "3",
          "slot5": "2",
          "slot6": "1",
          "slot7": "1",
          "slot8": "1",
          "slot9": "—"
        }
      },
      {
        "level": 16,
        "pb": "+5",
        "features": [
          "Aumento no Valor de Atributo (ASI / Talento)"
        ],
        "values": {
          "cantrips": "5",
          "prepSpells": "21",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "3",
          "slot5": "2",
          "slot6": "1",
          "slot7": "1",
          "slot8": "1",
          "slot9": "—"
        }
      },
      {
        "level": 17,
        "pb": "+6",
        "features": [],
        "values": {
          "cantrips": "5",
          "prepSpells": "22",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "3",
          "slot5": "2",
          "slot6": "1",
          "slot7": "1",
          "slot8": "1",
          "slot9": "1"
        }
      },
      {
        "level": 18,
        "pb": "+6",
        "features": [
          "Maestria de Magias"
        ],
        "values": {
          "cantrips": "5",
          "prepSpells": "23",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "3",
          "slot5": "3",
          "slot6": "1",
          "slot7": "1",
          "slot8": "1",
          "slot9": "1"
        }
      },
      {
        "level": 19,
        "pb": "+6",
        "features": [
          "Dádiva Épica"
        ],
        "values": {
          "cantrips": "5",
          "prepSpells": "24",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "3",
          "slot5": "3",
          "slot6": "2",
          "slot7": "1",
          "slot8": "1",
          "slot9": "1"
        }
      },
      {
        "level": 20,
        "pb": "+6",
        "features": [
          "Assinatura Mágica"
        ],
        "values": {
          "cantrips": "5",
          "prepSpells": "25",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "3",
          "slot5": "3",
          "slot6": "2",
          "slot7": "2",
          "slot8": "1",
          "slot9": "1"
        }
      }
    ],
    "subclasses": [
      {
        "id": "abjuration",
        "name": "Escola de Abjuração",
        "description": "Guardião arcano com Barreira Arcana que absorve dano direcionado a você e a aliados próximos.",
        "milestoneLevels": [
          3,
          6,
          10,
          14
        ]
      },
      {
        "id": "divination",
        "name": "Escola de Adivinhação",
        "description": "Presságio que rola dados de d20 no início do dia e substitui qualquer teste futuro seu ou de inimigos.",
        "milestoneLevels": [
          3,
          6,
          10,
          14
        ]
      },
      {
        "id": "evocation",
        "name": "Escola de Evocação",
        "description": "Molda magias para criar bolsões de segurança protegendo aliados de bolas de fogo e explosões arcanas.",
        "milestoneLevels": [
          3,
          6,
          10,
          14
        ]
      },
      {
        "id": "illusion",
        "name": "Escola de Ilusão",
        "description": "Ilusões maleáveis que parecem sólidas e reais, confundindo sentidos com projeções fantasmagóricas.",
        "milestoneLevels": [
          3,
          6,
          10,
          14
        ]
      }
    ]
  },
  "monk": {
    "classId": "monk",
    "className": "Monge",
    "system": "dnd55e",
    "hitDie": "d8",
    "primaryAbility": "Destreza e Sabedoria",
    "savingThrows": [
      "Força",
      "Destreza"
    ],
    "armorProficiencies": [
      "Nenhuma"
    ],
    "weaponProficiencies": [
      "Simples",
      "Armas Marciais com Acuidade"
    ],
    "hasSpellcasting": false,
    "spellcastingType": "none",
    "columns": [
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
    ],
    "rows": [
      {
        "level": 1,
        "pb": "+2",
        "features": [
          "Artes Marciais",
          "Defesa sem Armadura"
        ],
        "values": {
          "martialArts": "1d6",
          "focusPoints": "—",
          "unarmoredSpeed": "—",
          "attacks": "1",
          "deflectAttacks": "—"
        }
      },
      {
        "level": 2,
        "pb": "+2",
        "features": [
          "Foco do Monge",
          "Movimento sem Armadura",
          "Metabolismo Incomum"
        ],
        "values": {
          "martialArts": "1d6",
          "focusPoints": "2",
          "unarmoredSpeed": "+3 m",
          "attacks": "1",
          "deflectAttacks": "—"
        }
      },
      {
        "level": 3,
        "pb": "+2",
        "features": [
          "Defletir Ataques",
          "Subclasse de Monge"
        ],
        "values": {
          "martialArts": "1d6",
          "focusPoints": "3",
          "unarmoredSpeed": "+3 m",
          "attacks": "1",
          "deflectAttacks": "1d10 + DES + Nv"
        }
      },
      {
        "level": 4,
        "pb": "+2",
        "features": [
          "Aumento no Valor de Atributo (ASI / Talento)",
          "Queda Lenta"
        ],
        "values": {
          "martialArts": "1d6",
          "focusPoints": "4",
          "unarmoredSpeed": "+3 m",
          "attacks": "1",
          "deflectAttacks": "1d10 + DES + Nv"
        }
      },
      {
        "level": 5,
        "pb": "+3",
        "features": [
          "Ataque Extra",
          "Golpe Atordoante"
        ],
        "values": {
          "martialArts": "1d8",
          "focusPoints": "5",
          "unarmoredSpeed": "+3 m",
          "attacks": "2",
          "deflectAttacks": "1d10 + DES + Nv"
        }
      },
      {
        "level": 6,
        "pb": "+3",
        "features": [
          "Ataques Potencializados",
          "Característica de Subclasse"
        ],
        "values": {
          "martialArts": "1d8",
          "focusPoints": "6",
          "unarmoredSpeed": "+4,5 m",
          "attacks": "2",
          "deflectAttacks": "1d10 + DES + Nv"
        }
      },
      {
        "level": 7,
        "pb": "+3",
        "features": [
          "Evasão"
        ],
        "values": {
          "martialArts": "1d8",
          "focusPoints": "7",
          "unarmoredSpeed": "+4,5 m",
          "attacks": "2",
          "deflectAttacks": "1d10 + DES + Nv"
        }
      },
      {
        "level": 8,
        "pb": "+3",
        "features": [
          "Aumento no Valor de Atributo (ASI / Talento)"
        ],
        "values": {
          "martialArts": "1d8",
          "focusPoints": "8",
          "unarmoredSpeed": "+4,5 m",
          "attacks": "2",
          "deflectAttacks": "1d10 + DES + Nv"
        }
      },
      {
        "level": 9,
        "pb": "+4",
        "features": [
          "Movimento Acrobático"
        ],
        "values": {
          "martialArts": "1d8",
          "focusPoints": "9",
          "unarmoredSpeed": "+4,5 m",
          "attacks": "2",
          "deflectAttacks": "1d10 + DES + Nv"
        }
      },
      {
        "level": 10,
        "pb": "+4",
        "features": [
          "Autocura",
          "Foco Aprimorado"
        ],
        "values": {
          "martialArts": "1d8",
          "focusPoints": "10",
          "unarmoredSpeed": "+6 m",
          "attacks": "2",
          "deflectAttacks": "1d10 + DES + Nv"
        }
      },
      {
        "level": 11,
        "pb": "+4",
        "features": [
          "Característica de subclasse"
        ],
        "values": {
          "martialArts": "1d10",
          "focusPoints": "11",
          "unarmoredSpeed": "+6 m",
          "attacks": "2",
          "deflectAttacks": "1d10 + DES + Nv"
        }
      },
      {
        "level": 12,
        "pb": "+4",
        "features": [
          "Aumento no Valor de Atributo (ASI / Talento)"
        ],
        "values": {
          "martialArts": "1d10",
          "focusPoints": "12",
          "unarmoredSpeed": "+6 m",
          "attacks": "2",
          "deflectAttacks": "1d10 + DES + Nv"
        }
      },
      {
        "level": 13,
        "pb": "+5",
        "features": [
          "Defletir Energia"
        ],
        "values": {
          "martialArts": "1d10",
          "focusPoints": "13",
          "unarmoredSpeed": "+6 m",
          "attacks": "2",
          "deflectAttacks": "1d10 + DES + Nv"
        }
      },
      {
        "level": 14,
        "pb": "+5",
        "features": [
          "Sobrevivente Disciplinado"
        ],
        "values": {
          "martialArts": "1d10",
          "focusPoints": "14",
          "unarmoredSpeed": "+7,5 m",
          "attacks": "2",
          "deflectAttacks": "1d10 + DES + Nv"
        }
      },
      {
        "level": 15,
        "pb": "+5",
        "features": [
          "Foco Perfeito"
        ],
        "values": {
          "martialArts": "1d10",
          "focusPoints": "15",
          "unarmoredSpeed": "+7,5 m",
          "attacks": "2",
          "deflectAttacks": "1d10 + DES + Nv"
        }
      },
      {
        "level": 16,
        "pb": "+5",
        "features": [
          "Aumento no Valor de Atributo (ASI / Talento)"
        ],
        "values": {
          "martialArts": "1d10",
          "focusPoints": "16",
          "unarmoredSpeed": "+7,5 m",
          "attacks": "2",
          "deflectAttacks": "1d10 + DES + Nv"
        }
      },
      {
        "level": 17,
        "pb": "+6",
        "features": [
          "Característica de Subclasse"
        ],
        "values": {
          "martialArts": "1d12",
          "focusPoints": "17",
          "unarmoredSpeed": "+7,5 m",
          "attacks": "2",
          "deflectAttacks": "1d10 + DES + Nv"
        }
      },
      {
        "level": 18,
        "pb": "+6",
        "features": [
          "Defesa Superior"
        ],
        "values": {
          "martialArts": "1d12",
          "focusPoints": "18",
          "unarmoredSpeed": "+9 m",
          "attacks": "2",
          "deflectAttacks": "1d10 + DES + Nv"
        }
      },
      {
        "level": 19,
        "pb": "+6",
        "features": [
          "Dádiva Épica"
        ],
        "values": {
          "martialArts": "1d12",
          "focusPoints": "19",
          "unarmoredSpeed": "+9 m",
          "attacks": "2",
          "deflectAttacks": "1d10 + DES + Nv"
        }
      },
      {
        "level": 20,
        "pb": "+6",
        "features": [
          "Corpo e Mente"
        ],
        "values": {
          "martialArts": "1d12",
          "focusPoints": "20",
          "unarmoredSpeed": "+9 m",
          "attacks": "2",
          "deflectAttacks": "1d10 + DES + Nv"
        }
      }
    ],
    "subclasses": [
      {
        "id": "open_hand",
        "name": "Caminho da Mão Aberta",
        "description": "Técnica da mão aberta que derruba caídos, empurra a 4,5m e golpe da palma trêmula que causa morte instantânea.",
        "milestoneLevels": [
          3,
          6,
          11,
          17
        ]
      },
      {
        "id": "shadow",
        "name": "Caminho da Sombra",
        "description": "Assassino ninja que se teletransporta entre sombras na penumbra e conjura manto de escuridão mágica.",
        "milestoneLevels": [
          3,
          6,
          11,
          17
        ]
      },
      {
        "id": "elements",
        "name": "Caminho dos Elementos",
        "description": "Canaliza chamas, gelo e relâmpagos através de ataques desarmados com alcance estendido de 4,5m.",
        "milestoneLevels": [
          3,
          6,
          11,
          17
        ]
      },
      {
        "id": "mercy",
        "name": "Caminho da Misericórdia",
        "description": "Mãos da cura e mãos do dano necrótico: médico de combate com máscaras espirituais de restauração.",
        "milestoneLevels": [
          3,
          6,
          11,
          17
        ]
      }
    ]
  },
  "paladin": {
    "classId": "paladin",
    "className": "Paladino",
    "system": "dnd55e",
    "hitDie": "d10",
    "primaryAbility": "Força e Carisma",
    "savingThrows": [
      "Sabedoria",
      "Carisma"
    ],
    "armorProficiencies": [
      "Leve",
      "Média",
      "Pesada",
      "Escudos"
    ],
    "weaponProficiencies": [
      "Simples",
      "Marciais"
    ],
    "hasSpellcasting": true,
    "spellcastingType": "half",
    "columns": [
      {
        "key": "attacks",
        "label": "Ataques",
        "tooltip": "Número de ataques realizados com a Ação Atacar",
        "align": "center"
      },
      {
        "key": "channelDivinity",
        "label": "Canalizar Divindade",
        "tooltip": "Usos de Canalizar Divindade sagrada por descanso",
        "align": "center"
      },
      {
        "key": "prepSpells",
        "label": "Magias Prep.",
        "tooltip": "Magias sagradas preparadas",
        "align": "center"
      },
      {
        "key": "slot1",
        "label": "1º",
        "isSpellSlot": true,
        "align": "center"
      },
      {
        "key": "slot2",
        "label": "2º",
        "isSpellSlot": true,
        "align": "center"
      },
      {
        "key": "slot3",
        "label": "3º",
        "isSpellSlot": true,
        "align": "center"
      },
      {
        "key": "slot4",
        "label": "4º",
        "isSpellSlot": true,
        "align": "center"
      },
      {
        "key": "slot5",
        "label": "5º",
        "isSpellSlot": true,
        "align": "center"
      }
    ],
    "rows": [
      {
        "level": 1,
        "pb": "+2",
        "features": [
          "Conjuração",
          "Maestria em Arma",
          "Mãos Consagradas"
        ],
        "values": {
          "channelDivinity": "—",
          "prepSpells": "2",
          "slot1": "2",
          "slot2": "—",
          "slot3": "—",
          "slot4": "—",
          "slot5": "—",
          "attacks": "1"
        }
      },
      {
        "level": 2,
        "pb": "+2",
        "features": [
          "Destruição do Paladino",
          "Estilo de Luta"
        ],
        "values": {
          "channelDivinity": "—",
          "prepSpells": "3",
          "slot1": "2",
          "slot2": "—",
          "slot3": "—",
          "slot4": "—",
          "slot5": "—",
          "attacks": "1"
        }
      },
      {
        "level": 3,
        "pb": "+2",
        "features": [
          "Canalizar Divindade",
          "Subclasse de Paladino"
        ],
        "values": {
          "channelDivinity": "2",
          "prepSpells": "4",
          "slot1": "3",
          "slot2": "—",
          "slot3": "—",
          "slot4": "—",
          "slot5": "—",
          "attacks": "1"
        }
      },
      {
        "level": 4,
        "pb": "+2",
        "features": [
          "Aumento no Valor de Atributo (ASI / Talento)"
        ],
        "values": {
          "channelDivinity": "2",
          "prepSpells": "5",
          "slot1": "3",
          "slot2": "—",
          "slot3": "—",
          "slot4": "—",
          "slot5": "—",
          "attacks": "1"
        }
      },
      {
        "level": 5,
        "pb": "+3",
        "features": [
          "Ataque Extra",
          "Montaria Fiel"
        ],
        "values": {
          "channelDivinity": "2",
          "prepSpells": "6",
          "slot1": "4",
          "slot2": "2",
          "slot3": "—",
          "slot4": "—",
          "slot5": "—",
          "attacks": "2"
        }
      },
      {
        "level": 6,
        "pb": "+3",
        "features": [
          "Aura de Proteção"
        ],
        "values": {
          "channelDivinity": "2",
          "prepSpells": "6",
          "slot1": "4",
          "slot2": "2",
          "slot3": "—",
          "slot4": "—",
          "slot5": "—",
          "attacks": "2"
        }
      },
      {
        "level": 7,
        "pb": "+3",
        "features": [
          "Característica de Subclasse"
        ],
        "values": {
          "channelDivinity": "2",
          "prepSpells": "7",
          "slot1": "4",
          "slot2": "3",
          "slot3": "—",
          "slot4": "—",
          "slot5": "—",
          "attacks": "2"
        }
      },
      {
        "level": 8,
        "pb": "+3",
        "features": [
          "Aumento no Valor de Atributo (ASI / Talento)"
        ],
        "values": {
          "channelDivinity": "2",
          "prepSpells": "7",
          "slot1": "4",
          "slot2": "3",
          "slot3": "—",
          "slot4": "—",
          "slot5": "—",
          "attacks": "2"
        }
      },
      {
        "level": 9,
        "pb": "+4",
        "features": [
          "Repudiar Inimigos"
        ],
        "values": {
          "channelDivinity": "2",
          "prepSpells": "9",
          "slot1": "4",
          "slot2": "3",
          "slot3": "2",
          "slot4": "—",
          "slot5": "—",
          "attacks": "2"
        }
      },
      {
        "level": 10,
        "pb": "+4",
        "features": [
          "Aura de Coragem"
        ],
        "values": {
          "channelDivinity": "2",
          "prepSpells": "9",
          "slot1": "4",
          "slot2": "3",
          "slot3": "2",
          "slot4": "—",
          "slot5": "—",
          "attacks": "2"
        }
      },
      {
        "level": 11,
        "pb": "+4",
        "features": [
          "Golpes Radiantes"
        ],
        "values": {
          "channelDivinity": "3",
          "prepSpells": "10",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "—",
          "slot5": "—",
          "attacks": "2"
        }
      },
      {
        "level": 12,
        "pb": "+4",
        "features": [
          "Aumento no Valor de Atributo (ASI / Talento)"
        ],
        "values": {
          "channelDivinity": "3",
          "prepSpells": "10",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "—",
          "slot5": "—",
          "attacks": "2"
        }
      },
      {
        "level": 13,
        "pb": "+5",
        "features": [],
        "values": {
          "channelDivinity": "3",
          "prepSpells": "11",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "1",
          "slot5": "—",
          "attacks": "2"
        }
      },
      {
        "level": 14,
        "pb": "+5",
        "features": [
          "Toque Restaurador"
        ],
        "values": {
          "channelDivinity": "3",
          "prepSpells": "11",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "1",
          "slot5": "—",
          "attacks": "2"
        }
      },
      {
        "level": 15,
        "pb": "+5",
        "features": [
          "Característica de Subclasse"
        ],
        "values": {
          "channelDivinity": "3",
          "prepSpells": "12",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "2",
          "slot5": "—",
          "attacks": "2"
        }
      },
      {
        "level": 16,
        "pb": "+5",
        "features": [
          "Aumento no Valor de Atributo (ASI / Talento)"
        ],
        "values": {
          "channelDivinity": "3",
          "prepSpells": "12",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "2",
          "slot5": "—",
          "attacks": "2"
        }
      },
      {
        "level": 17,
        "pb": "+6",
        "features": [],
        "values": {
          "channelDivinity": "3",
          "prepSpells": "14",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "3",
          "slot5": "1",
          "attacks": "2"
        }
      },
      {
        "level": 18,
        "pb": "+6",
        "features": [
          "Aura Expandida"
        ],
        "values": {
          "channelDivinity": "3",
          "prepSpells": "14",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "3",
          "slot5": "1",
          "attacks": "2"
        }
      },
      {
        "level": 19,
        "pb": "+6",
        "features": [
          "Dádiva Épica"
        ],
        "values": {
          "channelDivinity": "3",
          "prepSpells": "15",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "3",
          "slot5": "2",
          "attacks": "2"
        }
      },
      {
        "level": 20,
        "pb": "+6",
        "features": [
          "Característica de Subclasse"
        ],
        "values": {
          "channelDivinity": "3",
          "prepSpells": "15",
          "slot1": "4",
          "slot2": "3",
          "slot3": "3",
          "slot4": "3",
          "slot5": "2",
          "attacks": "2"
        }
      }
    ],
    "subclasses": [
      {
        "id": "devotion",
        "name": "Juramento da Devoção",
        "description": "Arma sagrada brilhante com bônus de Carisma no ataque, aura de devoção contra encantos e pureza.",
        "milestoneLevels": [
          3,
          7,
          15,
          20
        ]
      },
      {
        "id": "glory",
        "name": "Juramento da Glória",
        "description": "Façanhas heroicas hercúleas, atletismo lendário, velocidade estendida para o grupo e presença gloriosa.",
        "milestoneLevels": [
          3,
          7,
          15,
          20
        ]
      },
      {
        "id": "ancients",
        "name": "Juramento dos Anciões",
        "description": "Guardião da luz e da natureza: aura que concede resistência a dano de magias para você e aliados.",
        "milestoneLevels": [
          3,
          7,
          15,
          20
        ]
      },
      {
        "id": "vengeance",
        "name": "Juramento da Vingança",
        "description": "Voto de inimizade que garante vantagem constante em ataques contra um alvo marcado e perseguição implacável.",
        "milestoneLevels": [
          3,
          7,
          15,
          20
        ]
      }
    ]
  },
  "witcher": {
    "classId": "witcher",
    "className": "Bruxo",
    "system": "witcher",
    "hitDie": "d10",
    "primaryAbility": "Destreza e Inteligência",
    "savingThrows": [
      "Destreza",
      "Constituição"
    ],
    "armorProficiencies": [
      "Leve",
      "Média"
    ],
    "weaponProficiencies": [
      "Espadas de Prata",
      "Espadas de Aço",
      "Armas Marciais"
    ],
    "hasSpellcasting": false,
    "spellcastingType": "none",
    "columns": [
      {
        "key": "attackBonus",
        "label": "Bônus de Combate",
        "tooltip": "Bônus especial de esgrima e reflexos mutantes",
        "align": "center"
      },
      {
        "key": "vigor",
        "label": "Vigor Máx.",
        "tooltip": "Pontos de Vigor (Stamina) para lançar Sinais",
        "align": "center"
      },
      {
        "key": "toxicity",
        "label": "Tolerância Tóxica",
        "tooltip": "Limiar de toxicidade segura para poções e decocções",
        "align": "center"
      },
      {
        "key": "signs",
        "label": "Sinais Dominados",
        "tooltip": "Sinais de Bruxo prontos para canalização",
        "align": "center"
      }
    ],
    "rows": [
      {
        "level": 1,
        "pb": "+2",
        "features": [
          "Mutação de Bruxo",
          "Sinais Básicos (Aard, Igni, Quen, Yrden, Axii)",
          "Sentidos Aguçados"
        ],
        "values": {
          "attackBonus": "+3",
          "vigor": "12",
          "toxicity": "105%",
          "signs": "5 Sinais"
        }
      },
      {
        "level": 2,
        "pb": "+2",
        "features": [
          "Alquimia & Poções",
          "Óleos de Lâmina"
        ],
        "values": {
          "attackBonus": "+4",
          "vigor": "14",
          "toxicity": "110%",
          "signs": "5 Sinais"
        }
      },
      {
        "level": 3,
        "pb": "+2",
        "features": [
          "Escola de Bruxo (Subclasse)"
        ],
        "values": {
          "attackBonus": "+5",
          "vigor": "16",
          "toxicity": "115%",
          "signs": "5 Sinais"
        }
      },
      {
        "level": 4,
        "pb": "+2",
        "features": [
          "Aumento no Valor de Atributo (ASI / Talento)"
        ],
        "values": {
          "attackBonus": "+6",
          "vigor": "18",
          "toxicity": "120%",
          "signs": "5 Sinais"
        }
      },
      {
        "level": 5,
        "pb": "+3",
        "features": [
          "Golpe Rápido & Aparar Aprimorado"
        ],
        "values": {
          "attackBonus": "+7",
          "vigor": "20",
          "toxicity": "125%",
          "signs": "5 Sinais"
        }
      },
      {
        "level": 6,
        "pb": "+3",
        "features": [
          "Especialização da Escola"
        ],
        "values": {
          "attackBonus": "+8",
          "vigor": "22",
          "toxicity": "130%",
          "signs": "5 Sinais"
        }
      },
      {
        "level": 7,
        "pb": "+3",
        "features": [
          "Modo de Sinal Alternativo"
        ],
        "values": {
          "attackBonus": "+9",
          "vigor": "24",
          "toxicity": "135%",
          "signs": "5 Sinais + Alternativos"
        }
      },
      {
        "level": 8,
        "pb": "+3",
        "features": [
          "Aumento no Valor de Atributo (ASI / Talento)"
        ],
        "values": {
          "attackBonus": "+10",
          "vigor": "26",
          "toxicity": "140%",
          "signs": "5 Sinais + Alternativos"
        }
      },
      {
        "level": 9,
        "pb": "+4",
        "features": [
          "Tolerância à Toxicidade"
        ],
        "values": {
          "attackBonus": "+11",
          "vigor": "28",
          "toxicity": "145%",
          "signs": "5 Sinais + Alternativos"
        }
      },
      {
        "level": 10,
        "pb": "+4",
        "features": [
          "Habilidade Mestra da Escola"
        ],
        "values": {
          "attackBonus": "+12",
          "vigor": "30",
          "toxicity": "150%",
          "signs": "5 Sinais + Alternativos"
        }
      },
      {
        "level": 11,
        "pb": "+4",
        "features": [
          "Fluxo de Adrenalina"
        ],
        "values": {
          "attackBonus": "+13",
          "vigor": "32",
          "toxicity": "155%",
          "signs": "5 Sinais + Alternativos"
        }
      },
      {
        "level": 12,
        "pb": "+4",
        "features": [
          "Aumento no Valor de Atributo (ASI / Talento)"
        ],
        "values": {
          "attackBonus": "+14",
          "vigor": "34",
          "toxicity": "160%",
          "signs": "5 Sinais + Alternativos"
        }
      },
      {
        "level": 13,
        "pb": "+5",
        "features": [
          "Maestria com Espada de Prata"
        ],
        "values": {
          "attackBonus": "+15",
          "vigor": "36",
          "toxicity": "165%",
          "signs": "5 Sinais + Alternativos"
        }
      },
      {
        "level": 14,
        "pb": "+5",
        "features": [
          "Grande Mestre da Escola"
        ],
        "values": {
          "attackBonus": "+16",
          "vigor": "38",
          "toxicity": "170%",
          "signs": "5 Sinais + Alternativos"
        }
      },
      {
        "level": 15,
        "pb": "+5",
        "features": [
          "Vigor Sobrenatural"
        ],
        "values": {
          "attackBonus": "+17",
          "vigor": "40",
          "toxicity": "175%",
          "signs": "5 Sinais + Alternativos"
        }
      },
      {
        "level": 16,
        "pb": "+5",
        "features": [
          "Aumento no Valor de Atributo (ASI / Talento)"
        ],
        "values": {
          "attackBonus": "+18",
          "vigor": "42",
          "toxicity": "180%",
          "signs": "5 Sinais + Alternativos"
        }
      },
      {
        "level": 17,
        "pb": "+6",
        "features": [
          "Alquimia Suprema (Bombas Mestre)"
        ],
        "values": {
          "attackBonus": "+19",
          "vigor": "44",
          "toxicity": "185%",
          "signs": "5 Sinais + Alternativos"
        }
      },
      {
        "level": 18,
        "pb": "+6",
        "features": [
          "Reflexos Relâmpago"
        ],
        "values": {
          "attackBonus": "+20",
          "vigor": "46",
          "toxicity": "190%",
          "signs": "5 Sinais + Alternativos"
        }
      },
      {
        "level": 19,
        "pb": "+6",
        "features": [
          "Dádiva Épica (Epic Boon)"
        ],
        "values": {
          "attackBonus": "+21",
          "vigor": "48",
          "toxicity": "195%",
          "signs": "5 Sinais + Alternativos"
        }
      },
      {
        "level": 20,
        "pb": "+6",
        "features": [
          "Lenda dos Bruxos do Continente"
        ],
        "values": {
          "attackBonus": "+22",
          "vigor": "50",
          "toxicity": "200%",
          "signs": "5 Sinais + Alternativos"
        }
      }
    ],
    "subclasses": [
      {
        "id": "wolf",
        "name": "Escola do Lobo (Kaer Morhen)",
        "description": "Equilíbrio perfeito entre esgrima rápida, uso coordenado de Sinais e versatilidade em combate.",
        "milestoneLevels": [
          3,
          6,
          10,
          14
        ]
      },
      {
        "id": "cat",
        "name": "Escola do Gato",
        "description": "Estilo rápido, focado em agilidade extrema, golpes críticos cirúrgicos e armaduras leves.",
        "milestoneLevels": [
          3,
          6,
          10,
          14
        ]
      },
      {
        "id": "griffin",
        "name": "Escola do Grifo",
        "description": "Especialistas na canalização máxima de Sinais mágicos (Igni e Yrden), armaduras médias e resistência mental.",
        "milestoneLevels": [
          3,
          6,
          10,
          14
        ]
      },
      {
        "id": "bear",
        "name": "Escola do Urso",
        "description": "Tanques imponentes de Skellige com armaduras pesadas, proteção impenetrável de Quen e alta resiliência.",
        "milestoneLevels": [
          3,
          6,
          10,
          14
        ]
      },
      {
        "id": "viper",
        "name": "Escola da Víbora",
        "description": "Mestres de espadas curtas duplas, venenos paralisantes e assassinatos letais silenciosos.",
        "milestoneLevels": [
          3,
          6,
          10,
          14
        ]
      }
    ]
  }
};
