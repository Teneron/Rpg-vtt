import type { Character, CharacterAttributes } from '../characterTypes';
import { calculateModifier, getMinXPForLevel, regenerateCharacterStats } from '../characterTypes';
import { FEATS, type AbilityScoreKey } from '../data/feats';
import { CLASSES } from '../data/classes';
import {
    getAsiLevels,
    getClassResourcesForLevel,
    getMaxSpellCircleForLevel,
    getProficiencyBonus,
    getSpellSlotsForLevel,
    getSubclassLevel
} from '../data/progression';

const ATTR_KEYS: AbilityScoreKey[] = ['str', 'dex', 'con', 'int', 'wis', 'cha'];

export interface LevelDownAnalysis {
    fromLevel: number;
    toLevel: number;
    hasFullHistory: boolean;
    wasOnlyPendingUnconfigured: boolean;
    exactRestoredHpMax: number | null;
    exactRestoredAttributes: CharacterAttributes | null;
    suggestedLegacyHpReduction: number;
    crossedLegacyAsiCount: number;
    crossedLegacyAsiLevels: number[];
    autoDetectedFeatIndicesToRemove: number[];
    lostFeaturesNames: string[];
    highCircleSpellNames: string[];
}

export interface LevelDownOverrides {
    /** Total de PV Máximo a subtrair dos níveis sem histórico (ignorado se hasFullHistory=true, a menos que manualHpMax seja passado) */
    legacyHpReduction?: number;
    /** Índices de `character.feats` a remover */
    featIndicesToRemove?: number[];
    /** Pontos de atributo a subtrair manualmente (para níveis de ASI antigos sem snapshot) */
    attributeReductions?: Partial<Record<AbilityScoreKey, number>>;
    /** Remover magias de círculo superior ao permitido no novo nível */
    removeHigherCircleSpells?: boolean;
}

/**
 * Prepara a subida de nível (1 ou múltiplos níveis em fila) preservando consistência.
 */
export function prepareCharacterLevelUp(char: Character, targetLevel: number): Character {
    const safeTarget = Math.max(1, Math.min(20, Math.floor(targetLevel)));
    const currentLvl = char.level || 1;
    if (safeTarget <= currentLvl) return char;

    const firstStepLevel = char.pendingLevelUp ? currentLvl : currentLvl + 1;
    const newXP = getMinXPForLevel(firstStepLevel);
    const nextXP = getMinXPForLevel(firstStepLevel + 1) || newXP;

    const updated: Character = {
        ...char,
        level: firstStepLevel,
        experience: newXP,
        nextLevelExperience: nextXP,
        pendingLevelUp: true,
        levelUpTarget: safeTarget > firstStepLevel ? safeTarget : undefined,
        lastModified: Date.now()
    };

    return regenerateCharacterStats(updated);
}

/**
 * Calcula a média oficial de PV por nível acima do 1º para a ficha atual.
 */
export function getAverageHpGainPerLevel(char: Character, attrsOverride?: CharacterAttributes): number {
    const attrs = attrsOverride || char.attributes;
    const classData = CLASSES.find(c => c.id === char.class || c.name === char.class);
    const faces = parseInt((classData?.hitDie || char.hitDice?.dieFace || 'd8').replace('d', ''), 10) || 8;
    const conMod = calculateModifier(attrs?.con?.value ?? 10);
    const isDwarf = /an[ãa]o|dwarf/i.test(char.race || '');
    const featPerLvl = (char.feats || []).reduce((sum, feat) => {
        const canonical = FEATS.find(f => f.id === feat.id);
        const effects = canonical?.effects || feat.effects;
        const hpEff = effects?.find(e => e.type === 'hp_per_level');
        return sum + (hpEff ? hpEff.value : 0);
    }, 0);

    return Math.max(1, Math.floor(faces / 2) + 1 + conMod + (isDwarf ? 1 : 0) + featPerLvl);
}

/**
 * Estima o PV máximo esperado no nível `targetLevel` usando média oficial (útil para detectar se uma ficha Nv 4 pendente ainda tem PV de Nv 3).
 */
export function estimateExpectedMaxHpAtLevel(char: Character, targetLevel: number): number {
    const classData = CLASSES.find(c => c.id === char.class || c.name === char.class);
    const faces = parseInt((classData?.hitDie || char.hitDice?.dieFace || 'd8').replace('d', ''), 10) || 8;
    const conMod = calculateModifier(char.attributes?.con?.value ?? 10);
    const isDwarf = /an[ãa]o|dwarf/i.test(char.race || '');
    const featPerLvl = (char.feats || []).reduce((sum, feat) => {
        const canonical = FEATS.find(f => f.id === feat.id);
        const effects = canonical?.effects || feat.effects;
        const hpEff = effects?.find(e => e.type === 'hp_per_level');
        return sum + (hpEff ? hpEff.value : 0);
    }, 0);

    const lvl1Hp = Math.max(1, faces + conMod + (isDwarf ? 1 : 0) + featPerLvl);
    if (targetLevel <= 1) return lvl1Hp;
    const avgPerLvl = getAverageHpGainPerLevel(char);
    return lvl1Hp + (targetLevel - 1) * avgPerLvl;
}

/**
 * Analisa o impacto de reduzir um personagem de `char.level` para `targetLevel`.
 */
export function analyzeLevelDown(char: Character, targetLevel: number): LevelDownAnalysis {
    const fromLevel = char.level || 1;
    const toLevel = Math.max(1, Math.min(fromLevel - 1, Math.floor(targetLevel)));
    const history = char.levelHistory || {};
    const asiLevels = getAsiLevels(char.class);

    let legacyConfiguredLevels = 0;
    const crossedLegacyAsiLevels: number[] = [];
    let allConfiguredHaveHistory = true;
    let earliestSnapshotLevel: number | null = null;

    for (let lvl = fromLevel; lvl > toLevel; lvl--) {
        const isPendingUnapplied = lvl === fromLevel && Boolean(char.pendingLevelUp) && !history[lvl];
        if (isPendingUnapplied) {
            continue;
        }
        if (history[lvl]) {
            earliestSnapshotLevel = lvl;
        } else {
            allConfiguredHaveHistory = false;
            legacyConfiguredLevels += 1;
            if (asiLevels.includes(lvl) && lvl !== 3) {
                crossedLegacyAsiLevels.push(lvl);
            }
        }
    }

    const wasOnlyPendingUnconfigured = legacyConfiguredLevels === 0 && earliestSnapshotLevel === null;
    const hasFullHistory = allConfiguredHaveHistory && (earliestSnapshotLevel !== null || wasOnlyPendingUnconfigured);

    const exactRestoredHpMax = hasFullHistory
        ? (wasOnlyPendingUnconfigured ? char.hp.max : history[earliestSnapshotLevel!]!.previousHpMax)
        : null;

    const exactRestoredAttributes = hasFullHistory
        ? (wasOnlyPendingUnconfigured
            ? JSON.parse(JSON.stringify(char.attributes))
            : JSON.parse(JSON.stringify(history[earliestSnapshotLevel!]!.previousAttributes)))
        : null;

    // Para níveis antigos sem histórico, evita sugerir redução caso o PV atual já seja igual ou menor ao PV esperado no nível destino
    const avgGain = getAverageHpGainPerLevel(char);
    const expectedAtTarget = estimateExpectedMaxHpAtLevel(char, toLevel);
    let suggestedLegacyHpReduction = 0;
    if (legacyConfiguredLevels > 0) {
        if ((char.hp?.max || 10) > expectedAtTarget) {
            suggestedLegacyHpReduction = Math.min(
                Math.max(0, (char.hp?.max || 10) - 1),
                legacyConfiguredLevels * avgGain
            );
        }
    }

    // Identifica talentos adquiridos acima do nível destino
    const autoDetectedFeatIndicesToRemove: number[] = [];
    const targetSnapshotFeatIds = earliestSnapshotLevel && hasFullHistory && Array.isArray(history[earliestSnapshotLevel]?.previousFeatIds)
        ? new Set(history[earliestSnapshotLevel]!.previousFeatIds)
        : null;

    (char.feats || []).forEach((feat, idx) => {
        if (targetSnapshotFeatIds) {
            if (!targetSnapshotFeatIds.has(feat.id)) {
                autoDetectedFeatIndicesToRemove.push(idx);
            }
            return;
        }
        const canonical = FEATS.find(f => f.id === feat.id);
        const category = feat.category || canonical?.category;
        if (typeof feat.acquiredAtLevel === 'number' && feat.acquiredAtLevel > toLevel) {
            autoDetectedFeatIndicesToRemove.push(idx);
        } else if (category === 'Dádiva Épica' && toLevel < 19) {
            autoDetectedFeatIndicesToRemove.push(idx);
        } else if (category === 'Geral' && toLevel < 4) {
            autoDetectedFeatIndicesToRemove.push(idx);
        }
    });

    const lostFeaturesNames = (char.features || [])
        .filter(f => f.level > toLevel)
        .map(f => f.name);

    const maxSpellCircle = getMaxSpellCircleForLevel(char.class, toLevel);
    const highCircleSpellNames = (char.spells || [])
        .filter(s => s.level > 0 && s.level > maxSpellCircle)
        .map(s => s.name);

    return {
        fromLevel,
        toLevel,
        hasFullHistory,
        wasOnlyPendingUnconfigured,
        exactRestoredHpMax,
        exactRestoredAttributes,
        suggestedLegacyHpReduction,
        crossedLegacyAsiCount: crossedLegacyAsiLevels.length,
        crossedLegacyAsiLevels,
        autoDetectedFeatIndicesToRemove,
        lostFeaturesNames,
        highCircleSpellNames
    };
}

/**
 * Aplica a redução de nível completa (PV, Atributos, Talentos, Habilidades, Subclasse, Magias e Recursos).
 */
export function applyCharacterLevelDown(
    char: Character,
    targetLevel: number,
    overrides: LevelDownOverrides = {}
): Character {
    const currentLvl = char.level || 1;
    const toLevel = Math.max(1, Math.min(currentLvl - 1, Math.floor(targetLevel)));
    if (toLevel >= currentLvl) return char;

    const analysis = analyzeLevelDown(char, toLevel);
    const history = { ...(char.levelHistory || {}) };

    // 1. Determina atributos restaurados
    let nextAttrs: CharacterAttributes = JSON.parse(JSON.stringify(char.attributes));
    let nextFeats = [...(char.feats || [])];
    let nextFeatures = (char.features || []).filter(f => f.level <= toLevel);
    let nextSpells = [...(char.spells || [])];
    let nextSubclass = char.subclass;
    let nextSkills = [...(char.skills || [])];
    let nextHpMax = char.hp?.max || 10;

    if (analysis.hasFullHistory) {
        if (!analysis.wasOnlyPendingUnconfigured) {
            // Reverte passo a passo do nível atual até toLevel + 1 usando snapshots exatos
            for (let lvl = currentLvl; lvl > toLevel; lvl--) {
                const snap = history[lvl];
                if (!snap) continue;
                nextHpMax = snap.previousHpMax;
                nextAttrs = JSON.parse(JSON.stringify(snap.previousAttributes));
                if (Array.isArray(snap.previousFeatIds)) {
                    const allowedFeatIds = new Set(snap.previousFeatIds);
                    nextFeats = nextFeats.filter(f => allowedFeatIds.has(f.id) && (f.acquiredAtLevel === undefined || f.acquiredAtLevel <= toLevel));
                } else {
                    nextFeats = nextFeats.filter(f => f.acquiredAtLevel === undefined || f.acquiredAtLevel <= toLevel);
                }
                if (Array.isArray(snap.previousFeatureNames)) {
                    const allowedFeatureNames = new Set(snap.previousFeatureNames);
                    nextFeatures = nextFeatures.filter(f => f.level <= toLevel && allowedFeatureNames.has(f.name));
                }
                if (Array.isArray(snap.previousSpellIds)) {
                    const allowedSpellIds = new Set(snap.previousSpellIds);
                    nextSpells = nextSpells.filter(s => allowedSpellIds.has(s.id));
                }
                if ('previousSubclass' in snap) {
                    nextSubclass = snap.previousSubclass;
                }
                if (Array.isArray(snap.previousSkillExpertises)) {
                    const prevExpertSet = new Set(snap.previousSkillExpertises);
                    nextSkills = nextSkills.map(sk => ({
                        ...sk,
                        expertise: prevExpertSet.has(sk.name)
                    }));
                }
            }
        }
    } else {
        // Caso híbrido / legado (ex: ficha já estava no Nível 4 antes de existir levelHistory)
        // Primeiro aplica quaisquer snapshots existentes no topo da pilha
        for (let lvl = currentLvl; lvl > toLevel; lvl--) {
            const snap = history[lvl];
            if (snap) {
                nextHpMax = Math.max(1, nextHpMax - snap.hpGained);
                nextAttrs = JSON.parse(JSON.stringify(snap.previousAttributes));
            }
        }

        const oldConModBeforeManual = calculateModifier(nextAttrs.con?.value || 10);

        // Remove talentos marcados (e reverte bônus de half-feat se registrado)
        const indicesToRemove = new Set(
            overrides.featIndicesToRemove ?? analysis.autoDetectedFeatIndicesToRemove
        );

        let featFlatHpRemoved = 0;
        nextFeats = nextFeats.filter((feat, idx) => {
            if (!indicesToRemove.has(idx)) return true;

            if (feat.chosenAbilityBonus && nextAttrs[feat.chosenAbilityBonus]) {
                const dec = feat.abilityBonusAmount || 1;
                nextAttrs[feat.chosenAbilityBonus].value = Math.max(1, (nextAttrs[feat.chosenAbilityBonus].value || 10) - dec);
                nextAttrs[feat.chosenAbilityBonus].modifier = calculateModifier(nextAttrs[feat.chosenAbilityBonus].value);
                if (feat.grantsSaveProficiency) {
                    nextAttrs[feat.chosenAbilityBonus].saveProficiency = false;
                }
            }

            const canonical = FEATS.find(f => f.id === feat.id);
            const effects = canonical?.effects || feat.effects;
            const perLvl = effects?.find(e => e.type === 'hp_per_level')?.value || 0;
            const flat = effects?.find(e => e.type === 'hp_flat')?.value || 0;
            if (perLvl > 0) {
                featFlatHpRemoved += perLvl * toLevel;
            }
            if (flat > 0) {
                featFlatHpRemoved += flat;
            }
            return false;
        });

        // Aplica reduções manuais de atributos (ASI -2 ou -1/-1)
        if (overrides.attributeReductions) {
            ATTR_KEYS.forEach(key => {
                const dec = overrides.attributeReductions?.[key] || 0;
                if (dec > 0 && nextAttrs[key]) {
                    nextAttrs[key].value = Math.max(1, (nextAttrs[key].value || 10) - dec);
                    nextAttrs[key].modifier = calculateModifier(nextAttrs[key].value);
                }
            });
        }

        const newConModAfterManual = calculateModifier(nextAttrs.con?.value || 10);
        const conModDrop = oldConModBeforeManual - newConModAfterManual; // Positivo se CON caiu
        const conRetroactiveLossOnRemainingLevels = conModDrop !== 0 ? conModDrop * toLevel : 0;

        const hpRed = overrides.legacyHpReduction ?? analysis.suggestedLegacyHpReduction;
        nextHpMax = Math.max(1, nextHpMax - hpRed - featFlatHpRemoved - conRetroactiveLossOnRemainingLevels);
    }

    // Garante modificadores canônicos nos atributos antes de chamar regenerateCharacterStats (evitando duplo desconto de CON)
    ATTR_KEYS.forEach(k => {
        if (nextAttrs[k]) {
            nextAttrs[k].modifier = calculateModifier(nextAttrs[k].value);
        }
    });

    // Subclasse removida se descer abaixo do nível de subclasse (Nível 3 em D&D 5.5e)
    const subclassMinLvl = getSubclassLevel(char.class);
    if (toLevel < subclassMinLvl) {
        nextSubclass = undefined;
    }

    // Magias de círculo superior opcionalmente removidas
    if (overrides.removeHigherCircleSpells !== false && !analysis.hasFullHistory) {
        const maxCircle = getMaxSpellCircleForLevel(char.class, toLevel);
        nextSpells = nextSpells.filter(s => s.level === 0 || s.level <= maxCircle);
    }

    // Limpa snapshots acima do novo nível
    Object.keys(history).forEach(k => {
        const lvlNum = Number(k);
        if (lvlNum > toLevel) {
            delete history[lvlNum];
        }
    });

    // Recalcula espaços de magia e recursos de classe para o novo nível
    const baseSlots = getSpellSlotsForLevel(char.class, toLevel);
    const updatedSpellSlots: Character['spellSlots'] = {};
    for (let circle = 1; circle <= 9; circle++) {
        const max = baseSlots[circle]?.max || 0;
        const prevUsed = char.spellSlots?.[circle]?.used || 0;
        updatedSpellSlots[circle] = {
            max,
            used: Math.min(max, prevUsed)
        };
    }

    const updatedResources = getClassResourcesForLevel(
        char.class,
        toLevel,
        char.classResources,
        nextAttrs.cha?.modifier ?? 1,
        nextSubclass
    );

    const profBonus = getProficiencyBonus(toLevel);
    const recalculatedSkills = nextSkills.map(s => {
        const mod = nextAttrs[s.attribute]?.modifier ?? 0;
        let val = mod;
        if (s.proficient) val += profBonus;
        if (s.expertise) val += profBonus;
        return { ...s, value: val };
    });

    const newXP = getMinXPForLevel(toLevel);
    const nextXP = getMinXPForLevel(toLevel + 1) || newXP;

    const downgraded: Character = {
        ...char,
        level: toLevel,
        experience: newXP,
        nextLevelExperience: nextXP,
        pendingLevelUp: false,
        levelUpTarget: undefined,
        levelHistory: Object.keys(history).length > 0 ? history : undefined,
        attributes: nextAttrs,
        feats: nextFeats,
        features: nextFeatures,
        spells: nextSpells,
        subclass: nextSubclass,
        skills: recalculatedSkills,
        spellSlots: updatedSpellSlots,
        classResources: updatedResources,
        hp: {
            ...char.hp,
            max: Math.max(1, nextHpMax),
            current: Math.min(Math.max(1, nextHpMax), char.hp?.current ?? nextHpMax)
        },
        hitDice: {
            ...char.hitDice,
            max: toLevel,
            current: Math.min(toLevel, char.hitDice?.current ?? toLevel)
        },
        lastModified: Date.now()
    };

    return regenerateCharacterStats(downgraded);
}
