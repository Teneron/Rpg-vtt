import type { RuleSection } from '../../RulebookViewer';
import { DND55E_CORE_PLAYER_SECTIONS } from './corePlayerRules';
import { DND55E_SPECIES_SECTIONS } from './speciesRules';
import { DND55E_CLASSES_SECTIONS } from './classesRules';

export const DND55E_PLAYER_SECTIONS: RuleSection[] = [
    // 1. Cenário e Criação
    DND55E_CORE_PLAYER_SECTIONS[0], // Greyhawk
    DND55E_CORE_PLAYER_SECTIONS[1], // Criação Passo a Passo

    // 2. Regras Centrais e Combate
    DND55E_CORE_PLAYER_SECTIONS[2], // Testes de d20
    DND55E_CORE_PLAYER_SECTIONS[3], // Combate e Ataque Desarmado
    DND55E_CORE_PLAYER_SECTIONS[4], // Condições e Exaustão
    DND55E_CORE_PLAYER_SECTIONS[5], // Maestria de Armas

    // 3. As 10 Espécies Canônicas Ilustradas
    ...DND55E_SPECIES_SECTIONS,

    // 4. As 12 Classes Oficiais Ilustradas com Subclasses
    ...DND55E_CLASSES_SECTIONS,

    // 5. Antecedentes, Equipamentos e Magia
    DND55E_CORE_PLAYER_SECTIONS[6], // 16 Antecedentes e Talentos de Origem
    DND55E_CORE_PLAYER_SECTIONS[7], // Equipamento, Armaduras e Armas
    DND55E_CORE_PLAYER_SECTIONS[8], // Regras de Magia e Rituais
];
