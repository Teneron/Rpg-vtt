import type { Character } from '../characterTypes';
import { CLASSES } from '../data/classes';
import type { AbilityScoreKey, Feat } from '../data/feats';
import type { WarlockInvocation } from '../data/warlockInvocations';

export interface PrerequisiteCheckResult {
    met: boolean;
    reason?: string;
}

function normalizeStr(val: string | undefined | null): string {
    return (val || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim();
}

function resolveCharacterClass(character: Character) {
    const raw = normalizeStr(character.class);
    return CLASSES.find(
        c => normalizeStr(c.id) === raw || normalizeStr(c.name) === raw
    );
}

export function hasFightingStyleFeature(character: Character, targetLevel: number): boolean {
    const cls = resolveCharacterClass(character);
    const clsId = cls?.id || normalizeStr(character.class);

    // Guerreiro recebe Estilo de Luta no Nv 1; Paladino e Patrulheiro no Nv 2 (D&D 2024)
    if (clsId === 'fighter' && targetLevel >= 1) return true;
    if ((clsId === 'paladin' || clsId === 'ranger') && targetLevel >= 2) return true;

    return (character.features || []).some(f => {
        const name = normalizeStr(f?.name);
        return name.includes('estilo de luta') || name.includes('fighting style');
    });
}

export function hasSpellcastingOrPactMagic(character: Character, targetLevel: number): boolean {
    const cls = resolveCharacterClass(character);
    const clsId = cls?.id || normalizeStr(character.class);

    const fullOrHalfCasters = new Set([
        'bard',
        'cleric',
        'druid',
        'paladin',
        'ranger',
        'sorcerer',
        'warlock',
        'wizard'
    ]);

    if (fullOrHalfCasters.has(clsId) || Boolean(cls?.spellcastingConfig)) {
        return true;
    }

    const subNorm = normalizeStr(character.subclass);
    if (
        targetLevel >= 3 &&
        (subNorm.includes('eldritch_knight') ||
            subNorm.includes('cavaleiro arcano') ||
            subNorm.includes('arcane_trickster') ||
            subNorm.includes('trapaceiro arcano'))
    ) {
        return true;
    }

    return (character.features || []).some(f => {
        const name = normalizeStr(f?.name);
        return (
            name.includes('conjuracao') ||
            name.includes('magia de pacto') ||
            name.includes('spellcasting') ||
            name.includes('pact magic')
        );
    });
}

export function hasArmorOrShieldTraining(
    character: Character,
    targetLevel: number,
    kind: 'leve' | 'media' | 'pesada' | 'escudos'
): boolean {
    const cls = resolveCharacterClass(character);
    const classArmors = (cls?.armorProficiency || []).map(normalizeStr);
    const charProfs = (character.proficiencies || []).map(normalizeStr);
    const ownedFeatIds = new Set((character.feats || []).map(f => f.id));
    const subNorm = normalizeStr(character.subclass);

    const hasAllArmor =
        classArmors.some(a => a.includes('todas')) ||
        charProfs.some(p => p.includes('todas as armaduras'));

    if (kind === 'leve') {
        return (
            hasAllArmor ||
            classArmors.some(a => a.includes('leve')) ||
            charProfs.some(p => p.includes('leve')) ||
            ownedFeatIds.has('lightly_armored')
        );
    }

    if (kind === 'media') {
        const isValorBard =
            (cls?.id === 'bard' || normalizeStr(character.class) === 'bardo') &&
            targetLevel >= 3 &&
            (subNorm.includes('valor') || subNorm.includes('bravura'));
        return (
            hasAllArmor ||
            isValorBard ||
            classArmors.some(a => a.includes('media')) ||
            charProfs.some(p => p.includes('media')) ||
            ownedFeatIds.has('moderately_armored')
        );
    }

    if (kind === 'pesada') {
        const hasHeavyFeature = (character.features || []).some(f => {
            const txt = normalizeStr(`${f?.name || ''} ${f?.description || ''}`);
            return txt.includes('armadura pesada') || txt.includes('armaduras pesadas') || txt.includes('ordem divina: protetor');
        });
        const isHeavyClericSub =
            cls?.id === 'cleric' && (subNorm.includes('life') || subNorm.includes('vida') || subNorm.includes('war') || subNorm.includes('guerra'));
        return (
            hasAllArmor ||
            isHeavyClericSub ||
            hasHeavyFeature ||
            classArmors.some(a => a.includes('pesada')) ||
            charProfs.some(p => p.includes('pesada'))
        );
    }

    // escudos
    const isValorBard =
        (cls?.id === 'bard' || normalizeStr(character.class) === 'bardo') &&
        targetLevel >= 3 &&
        (subNorm.includes('valor') || subNorm.includes('bravura'));
    return (
        isValorBard ||
        classArmors.some(a => a.includes('escudo')) ||
        charProfs.some(p => p.includes('escudo')) ||
        ownedFeatIds.has('lightly_armored')
    );
}

export function getValidFeatAbilityOptions(feat: Feat, character: Character): AbilityScoreKey[] {
    if (!feat.abilityBonusOptions) return [];
    const allKeys: AbilityScoreKey[] = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
    const baseList: AbilityScoreKey[] =
        feat.abilityBonusOptions === 'any' ? allKeys : [...feat.abilityBonusOptions];

    if (feat.grantsSaveProficiency) {
        const unproficient = baseList.filter(k => !character.attributes?.[k]?.saveProficiency);
        if (unproficient.length > 0) return unproficient;
    }

    return baseList;
}

/**
 * Valida todos os pré-requisitos oficiais do D&D 5.5e (2024) para um Talento.
 */
export function checkFeatPrerequisites(
    feat: Feat,
    character: Character,
    targetLevel: number
): PrerequisiteCheckResult {
    const safeLevel = Math.max(1, Math.floor(targetLevel || character.level || 1));
    const prereqNorm = normalizeStr(feat.prerequisite);

    // 1. Nível mínimo
    if (feat.category === 'Dádiva Épica' || prereqNorm.includes('nivel 19+')) {
        if (safeLevel < 19) {
            return { met: false, reason: `Requer Nível 19+ (atual: ${safeLevel})` };
        }
    }
    if (feat.category === 'Geral' || prereqNorm.includes('nivel 4+')) {
        if (safeLevel < 4) {
            return { met: false, reason: `Requer Nível 4+ (atual: ${safeLevel})` };
        }
    }

    // 2. Característica Estilo de Luta
    if (feat.category === 'Estilo de Luta' || prereqNorm.includes('estilo de luta')) {
        if (!hasFightingStyleFeature(character, safeLevel)) {
            return {
                met: false,
                reason: 'Requer Característica Estilo de Luta (Guerreiro, Paladino ou Patrulheiro)'
            };
        }
    }

    // 3. Conjuração ou Magia de Pacto
    if (prereqNorm.includes('conjuracao') || prereqNorm.includes('magia de pacto')) {
        if (!hasSpellcastingOrPactMagic(character, safeLevel)) {
            return {
                met: false,
                reason: 'Requer Característica Conjuração ou Magia de Pacto'
            };
        }
    }

    // 4. Treinamento em Armaduras / Escudos
    if (prereqNorm.includes('armadura pesada') && !hasArmorOrShieldTraining(character, safeLevel, 'pesada')) {
        return { met: false, reason: 'Requer Treinamento em Armadura Pesada' };
    }
    if (prereqNorm.includes('armadura media') && !hasArmorOrShieldTraining(character, safeLevel, 'media')) {
        return { met: false, reason: 'Requer Treinamento em Armadura Média' };
    }
    if (prereqNorm.includes('armadura leve') && !hasArmorOrShieldTraining(character, safeLevel, 'leve')) {
        return { met: false, reason: 'Requer Treinamento em Armadura Leve' };
    }
    if (prereqNorm.includes('treinamento em escudos') && !hasArmorOrShieldTraining(character, safeLevel, 'escudos')) {
        return { met: false, reason: 'Requer Treinamento em Escudos' };
    }

    // 5. Atributos mínimos (13+)
    const str = Number(character.attributes?.str?.value ?? 10);
    const dex = Number(character.attributes?.dex?.value ?? 10);
    const con = Number(character.attributes?.con?.value ?? 10);
    const int = Number(character.attributes?.int?.value ?? 10);
    const wis = Number(character.attributes?.wis?.value ?? 10);
    const cha = Number(character.attributes?.cha?.value ?? 10);

    if (prereqNorm.includes('int, sab ou car 13+') || prereqNorm.includes('inteligencia, sabedoria ou carisma 13+')) {
        if (int < 13 && wis < 13 && cha < 13) {
            return { met: false, reason: `Requer INT, SAB ou CAR 13+ (INT ${int} / SAB ${wis} / CAR ${cha})` };
        }
    } else if (prereqNorm.includes('forca ou destreza 13+')) {
        if (str < 13 && dex < 13) {
            return { met: false, reason: `Requer Força ou Destreza 13+ (FOR ${str} / DES ${dex})` };
        }
    } else if (prereqNorm.includes('destreza ou constituicao 13+')) {
        if (dex < 13 && con < 13) {
            return { met: false, reason: `Requer Destreza ou Constituição 13+ (DES ${dex} / CON ${con})` };
        }
    } else if (prereqNorm.includes('sabedoria ou carisma 13+')) {
        if (wis < 13 && cha < 13) {
            return { met: false, reason: `Requer Sabedoria ou Carisma 13+ (SAB ${wis} / CAR ${cha})` };
        }
    } else if (prereqNorm.includes('inteligencia ou sabedoria 13+')) {
        if (int < 13 && wis < 13) {
            return { met: false, reason: `Requer Inteligência ou Sabedoria 13+ (INT ${int} / SAB ${wis})` };
        }
    } else {
        if (prereqNorm.includes('forca 13+') && str < 13) {
            return { met: false, reason: `Requer Força 13+ (atual: ${str})` };
        }
        if (prereqNorm.includes('destreza 13+') && dex < 13) {
            return { met: false, reason: `Requer Destreza 13+ (atual: ${dex})` };
        }
        if (prereqNorm.includes('constituicao 13+') && con < 13) {
            return { met: false, reason: `Requer Constituição 13+ (atual: ${con})` };
        }
        if (prereqNorm.includes('inteligencia 13+') && int < 13) {
            return { met: false, reason: `Requer Inteligência 13+ (atual: ${int})` };
        }
        if (prereqNorm.includes('sabedoria 13+') && wis < 13) {
            return { met: false, reason: `Requer Sabedoria 13+ (atual: ${wis})` };
        }
        if (prereqNorm.includes('carisma 13+') && cha < 13) {
            return { met: false, reason: `Requer Carisma 13+ (atual: ${cha})` };
        }
    }

    // 6. Resiliente exige pelo menos uma Salvaguarda ainda sem proficiência
    if (feat.grantsSaveProficiency) {
        const allKeys: AbilityScoreKey[] = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
        const hasAnyUnproficient = allKeys.some(k => !character.attributes?.[k]?.saveProficiency);
        if (!hasAnyUnproficient) {
            return { met: false, reason: 'Já possui proficiência em todas as Salvaguardas' };
        }
    }

    return { met: true };
}

/**
 * Valida pré-requisitos de Invocações Místicas do Bruxo (nível, pactos e truques).
 */
export function checkInvocationPrerequisites(
    inv: WarlockInvocation,
    character: Character,
    targetLevel: number,
    activeInvocationIds?: Iterable<string>
): PrerequisiteCheckResult {
    const safeLevel = Math.max(1, Math.floor(targetLevel || character.level || 1));

    if (safeLevel < inv.minLevel) {
        return { met: false, reason: `Requer Bruxo Nível ${inv.minLevel}+` };
    }

    const prereqNorm = normalizeStr(inv.prerequisite);
    if (!prereqNorm) return { met: true };

    const activeSet = new Set<string>(activeInvocationIds ? Array.from(activeInvocationIds) : []);
    for (const f of character.features || []) {
        const fName = normalizeStr(f?.name);
        if (fName.includes('pacto da lamina') || fName.includes('pact of the blade')) activeSet.add('pact_of_the_blade');
        if (fName.includes('pacto da corrente') || fName.includes('pact of the chain')) activeSet.add('pact_of_the_chain');
        if (fName.includes('pacto do tomo') || fName.includes('pact of the tome')) activeSet.add('pact_of_the_tome');
        if (fName.includes('lamina sedenta') || fName.includes('thirsting blade')) activeSet.add('thirsting_blade');
    }

    if (prereqNorm.includes('pacto da lamina') && !activeSet.has('pact_of_the_blade')) {
        return { met: false, reason: 'Requer invocação Pacto da Lâmina' };
    }
    if (prereqNorm.includes('pacto da corrente') && !activeSet.has('pact_of_the_chain')) {
        return { met: false, reason: 'Requer invocação Pacto da Corrente' };
    }
    if (prereqNorm.includes('pacto do tomo') && !activeSet.has('pact_of_the_tome')) {
        return { met: false, reason: 'Requer invocação Pacto do Tomo' };
    }
    if (prereqNorm.includes('lamina sedenta') && !activeSet.has('thirsting_blade')) {
        return { met: false, reason: 'Requer invocação Lâmina Sedenta' };
    }

    if (prereqNorm.includes('truque rajada mistica')) {
        const hasEldritchBlast = (character.spells || []).some(s => {
            const sNorm = normalizeStr(s?.name);
            return s?.id === 'eldritch_blast' || sNorm.includes('rajada mistica') || sNorm.includes('eldritch blast');
        });
        if (!hasEldritchBlast) {
            return { met: false, reason: 'Requer conhecer o truque Rajada Mística' };
        }
    } else if (prereqNorm.includes('truque de bruxo')) {
        const hasAnyCantrip = (character.spells || []).some(s => Number(s?.level) === 0);
        if ((character.spells || []).length > 0 && !hasAnyCantrip) {
            return { met: false, reason: 'Requer conhecer ao menos 1 Truque de Bruxo' };
        }
    }

    return { met: true };
}
