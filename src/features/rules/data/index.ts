import type { RuleSection } from '../RulebookViewer';
import { WITCHER_PLAYER_SECTIONS, WITCHER_GM_SECTIONS } from './rulesWitcher';
import { DND55E_PLAYER_SECTIONS, DND55E_GM_SECTIONS } from './rulesDnd55e';

export interface SystemRulebookInfo {
    id: string;
    name: string;
    shortName: string;
    badgeIcon: string;
    accentColor: string;
    publisher: string;
    license: string;
    playerSections: RuleSection[];
    gmSections: RuleSection[];
}

export const SYSTEM_RULEBOOKS: Record<string, SystemRulebookInfo> = {
    witcher: {
        id: 'witcher',
        name: 'The Witcher (Adaptado 5e)',
        shortName: 'The Witcher 5e',
        badgeIcon: 'WITCHER',
        accentColor: '#c5a059',
        publisher: 'RPG Tabletop (VTT Adaptado)',
        license: 'Regras de Mesa Integradas',
        playerSections: WITCHER_PLAYER_SECTIONS,
        gmSections: WITCHER_GM_SECTIONS
    },
    dnd55e: {
        id: 'dnd55e',
        name: 'D&D 5.5e (Regras Oficiais)',
        shortName: 'D&D 5.5e',
        badgeIcon: 'D&D 5.5e',
        accentColor: '#e11d48',
        publisher: 'Wizards of the Coast (Regras Oficiais)',
        license: 'Regras Oficiais Integradas',
        playerSections: DND55E_PLAYER_SECTIONS,
        gmSections: DND55E_GM_SECTIONS
    }
};

export const getSystemRulebook = (systemId?: string | null): SystemRulebookInfo => {
    if (!systemId) return SYSTEM_RULEBOOKS.dnd55e;
    if (systemId === 'dnd5e' || systemId === 'dnd55e') return SYSTEM_RULEBOOKS.dnd55e;
    return SYSTEM_RULEBOOKS[systemId] || SYSTEM_RULEBOOKS.dnd55e;
};

export {
    WITCHER_PLAYER_SECTIONS,
    WITCHER_GM_SECTIONS,
    DND55E_PLAYER_SECTIONS,
    DND55E_GM_SECTIONS
};
