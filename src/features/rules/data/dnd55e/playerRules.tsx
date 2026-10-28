import type { RuleSection } from '../../RulebookViewer';
import { DND55E_CORE_PLAYER_SECTIONS } from './corePlayerRules';
import { DND55E_SPECIES_SECTIONS } from './speciesRules';
import { DND55E_CLASSES_SECTIONS } from './classesRules';
import { DND55E_EQUIPMENT_SECTIONS } from './phbEquipmentRules';
import { DND55E_SPELLS_SECTIONS } from './phbSpellsRules';

export const DND55E_PLAYER_SECTIONS: RuleSection[] = [
    // 1. Cenário e Criação
    DND55E_CORE_PLAYER_SECTIONS[0], // Greyhawk & Oerth
    DND55E_CORE_PLAYER_SECTIONS[1], // Criação Passo a Passo

    // 2. Regras Centrais e Combate
    DND55E_CORE_PLAYER_SECTIONS[2], // Testes de d20 & Vantagem/Desvantagem
    DND55E_CORE_PLAYER_SECTIONS[3], // Combate e Ataque Desarmado
    DND55E_CORE_PLAYER_SECTIONS[4], // Condições e Exaustão
    DND55E_CORE_PLAYER_SECTIONS[5], // Maestria de Armas (Visão Geral)

    // 3. As 10 Espécies Canônicas Ilustradas
    ...DND55E_SPECIES_SECTIONS,

    // 4. As 12 Classes Oficiais Ilustradas com Subclasses
    ...DND55E_CLASSES_SECTIONS,

    // 5. Antecedentes & Talentos
    DND55E_CORE_PLAYER_SECTIONS[6], // 16 Antecedentes e Talentos de Origem

    // 6. Equipamentos, Armas, Armaduras & Veículos (PHB Expandido)
    ...DND55E_EQUIPMENT_SECTIONS,

    // 7. Regras de Magia, Conjuração & Grimório Canônico (PHB Expandido)
    ...DND55E_SPELLS_SECTIONS
];
