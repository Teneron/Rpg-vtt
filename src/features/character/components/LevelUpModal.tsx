import React, { useState, useMemo } from 'react';
import type { Character, Spell, Skill, CharacterAttributes, LevelUpSnapshot } from '../characterTypes';
import { regenerateCharacterStats, calculateModifier, XP_TABLE } from '../characterTypes';
import { CLASSES } from '../data/classes';
import { SPELLS } from '../data/spells';
import { FEATS, type Feat, type FeatCategory, type AbilityScoreKey } from '../data/feats';
import { playSynthSound } from '../../audio/audioSynth';
import {
    getSpellSlotsForLevel,
    getMaxSpellCircleForLevel,
    getCantripsKnownCount,
    getClassResourcesForLevel,
    getFeaturesForLevel,
    getProficiencyBonus,
    isAsiLevel as checkIsAsiLevel,
    getSubclassLevel,
    getSubclassGrantedSpells
} from '../data/progression';
import {
    Check,
    Shield,
    Sparkles,
    ArrowRight,
    ArrowLeft,
    Star,
    Award,
    Dices,
    X,
    UserCheck,
    Flame,
    Search
} from 'lucide-react';
import './LevelUpModal.css';

interface LevelUpModalProps {
    character: Character;
    onUpdate: (char: Character) => void;
    onClose: () => void;
}

const ATTR_KEYS: AbilityScoreKey[] = ['str', 'dex', 'con', 'int', 'wis', 'cha'];

const ATTR_LABELS: Record<AbilityScoreKey, { short: string; full: string }> = {
    str: { short: 'FOR', full: 'Força' },
    dex: { short: 'DES', full: 'Destreza' },
    con: { short: 'CON', full: 'Constituição' },
    int: { short: 'INT', full: 'Inteligência' },
    wis: { short: 'SAB', full: 'Sabedoria' },
    cha: { short: 'CAR', full: 'Carisma' }
};

// 10 Estilos de Luta Oficiais (D&D 5.5e / 2024)
export const FIGHTING_STYLES = [
    {
        id: 'archery',
        name: 'Arquearia (Archery)',
        category: 'Ataque à Distância',
        description: 'Você ganha um bônus de +2 em jogadas de ataque realizadas com armas de ataque à distância.'
    },
    {
        id: 'defense',
        name: 'Defesa (Defense)',
        category: 'Defesa',
        description: 'Enquanto estiver vestindo qualquer armadura, você ganha um bônus de +1 na Classe de Armadura (CA).'
    },
    {
        id: 'dueling',
        name: 'Duelismo (Dueling)',
        category: 'Corpo a Corpo',
        description: 'Ao empunhar uma arma de ataque corpo a corpo em uma mão e nenhuma outra arma, ganhe +2 de dano com essa arma.'
    },
    {
        id: 'great_weapon',
        name: 'Combate com Armas Grandes (Great Weapon)',
        category: 'Armas Pesadas',
        description: 'Em armas corpo a corpo de Duas Mãos ou Versáteis com ambas as mãos, qualquer 1 ou 2 no dado de dano conta como 3.'
    },
    {
        id: 'two_weapon',
        name: 'Combate com Duas Armas (Two-Weapon)',
        category: 'Duas Armas',
        description: 'Você adiciona seu modificador de atributo também ao dano do ataque extra feito com arma Leve.'
    },
    {
        id: 'protection',
        name: 'Proteção (Protection)',
        category: 'Suporte & Reação',
        description: 'Quando uma criatura visível ataca um aliado a até 1,5m, use sua Reação com escudo para impor Desvantagem nos ataques contra ele até seu próximo turno.'
    },
    {
        id: 'interception',
        name: 'Interceptação (Interception)',
        category: 'Redução de Dano',
        description: 'Quando uma criatura acertar um ataque em um aliado a até 1,5m, use sua Reação para reduzir o dano sofrido por ele em 1d10 + seu PB (exige escudo ou arma).'
    },
    {
        id: 'blind_fighting',
        name: 'Luta às Cegas (Blind Fighting)',
        category: 'Sentidos Aguçados',
        description: 'Você ganha Visão às Cegas em raio de 3 metros (10 pés), enxergando na escuridão e alvos invisíveis sem cobertura total.'
    },
    {
        id: 'thrown_weapon',
        name: 'Armas de Arremesso (Thrown Weapon)',
        category: 'Arremesso',
        description: 'Sempre que atingir um ataque à distância usando uma arma com a propriedade Arremesso, você ganha +2 de bônus no dano.'
    },
    {
        id: 'unarmed',
        name: 'Combate Desarmado (Unarmed Fighting)',
        category: 'Artes Marciais',
        description: 'Seus golpes desarmados causam 1d6 + FOR (ou 1d8 + FOR de mãos livres) e causam 1d4 automático no início do turno em alvo agarrado.'
    }
];

import { WARLOCK_INVOCATIONS } from '../data/warlockInvocations';
export { WARLOCK_INVOCATIONS };

export const LevelUpModal: React.FC<LevelUpModalProps> = ({ character, onUpdate, onClose }) => {
    const newLevel = character.level;
    const classData = useMemo(() => {
        return CLASSES.find(c => c.id === character.class || c.name === character.class) || CLASSES[0];
    }, [character.class]);

    const classId = classData?.id || character.class;
    const classNameLower = (classData?.name || character.class || '').toLowerCase();
    const isFighter = /guerreiro|fighter/i.test(classNameLower);
    const isPaladin = /paladino|paladin/i.test(classNameLower);
    const isRanger = /guardi[ãa]o|ranger/i.test(classNameLower);
    const isWarlock = /bruxo|warlock/i.test(classNameLower) && !/witcher/i.test(classNameLower);
    const isBard = /bardo|bard/i.test(classNameLower);
    const isRogue = /ladino|rogue/i.test(classNameLower);
    const isWizard = /mago|wizard/i.test(classNameLower);

    const maxSpellCircle = useMemo(() => getMaxSpellCircleForLevel(classId, newLevel), [classId, newLevel]);
    const cantripsAtPrevLevel = useMemo(() => getCantripsKnownCount(classId, Math.max(0, newLevel - 1)), [classId, newLevel]);
    const cantripsAtNewLevel = useMemo(() => getCantripsKnownCount(classId, newLevel), [classId, newLevel]);
    const cantripsGainedCount = Math.max(0, cantripsAtNewLevel - cantripsAtPrevLevel);

    const isCaster = maxSpellCircle > 0 || cantripsGainedCount > 0 || !!classData?.spellcastingConfig || isPaladin || isRanger;
    const isAsiLevel = checkIsAsiLevel(classId, newLevel);

    // Em D&D 5.5e (2024): Guerreiro escolhe Estilo de Luta no Nv 1 (ou 2 se ainda não escolheu), Paladino e Guardião no Nv 2
    const alreadyHasFightingStyle = useMemo(() => {
        return (character.features || []).some(f => /estilo de luta|fighting style/i.test(f.name)) ||
            (character.feats || []).some(f => f.category === 'Estilo de Luta' || f.id.startsWith('fighting_style_'));
    }, [character.features, character.feats]);

    const hasFightingStyleChoice = ((isFighter || isPaladin || isRanger) && newLevel === 2 && !alreadyHasFightingStyle);
    const hasInvocationChoice = isWarlock && [2, 5, 7, 9, 12, 15, 18].includes(newLevel);
    const subclassLevel = getSubclassLevel(classId);
    const hasSubclassChoice = !character.subclass && newLevel >= subclassLevel && (classData?.subclasses?.length || 0) > 0;
    const hasClassSpecialChoice = hasFightingStyleChoice || hasInvocationChoice || hasSubclassChoice;

    // Allowed expertise gains strictly according to official D&D 5.5e (2024) rules
    const allowedExpertiseGains = useMemo(() => {
        if (isBard && (newLevel === 2 || newLevel === 9)) return 2;
        if (isRogue && newLevel === 6) return 2;
        if (isRanger && newLevel === 2) return 1;
        if (isRanger && newLevel === 9) return 2;
        return 0;
    }, [isBard, isRogue, isRanger, newLevel]);

    // Steps Pipeline
    type StepId = 'summary' | 'hp' | 'skills' | 'choices' | 'spells' | 'feat' | 'finish';
    const steps = useMemo<{ id: StepId; label: string }[]>(() => {
        const list: { id: StepId; label: string }[] = [
            { id: 'summary', label: '1. Visão Geral' },
            { id: 'hp', label: '2. Pontos de Vida' }
        ];
        if (allowedExpertiseGains > 0) {
            list.push({ id: 'skills', label: `${list.length + 1}. Especialização` });
        }
        if (hasClassSpecialChoice) {
            list.push({ id: 'choices', label: `${list.length + 1}. Escolha de Classe` });
        }
        if (isCaster && maxSpellCircle > 0) {
            list.push({ id: 'spells', label: `${list.length + 1}. Magias` });
        }
        if (isAsiLevel) {
            list.push({ id: 'feat', label: `${list.length + 1}. Talento / Atributos` });
        }
        list.push({ id: 'finish', label: `${list.length + 1}. Concluir` });
        return list;
    }, [allowedExpertiseGains, hasClassSpecialChoice, isCaster, maxSpellCircle, isAsiLevel]);

    const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
    const currentStep = steps[currentStepIdx]?.id || 'summary';

    // HP State
    const [hpChoice, setHpChoice] = useState<'avg' | 'roll'>('avg');
    const [rolledHp, setRolledHp] = useState<number | null>(null);

    // Expertise Selection State
    const [selectedNewExpertises, setSelectedNewExpertises] = useState<string[]>([]);
    const eligibleSkillsForExpertise = useMemo(() => {
        return (character.skills || []).filter(s => s.proficient && !s.expertise);
    }, [character.skills]);
    const maxEligibleExpertises = Math.min(allowedExpertiseGains, eligibleSkillsForExpertise.length);

    const toggleSelectExpertise = (skillName: string) => {
        setSelectedNewExpertises(prev => {
            if (prev.includes(skillName)) {
                return prev.filter(name => name !== skillName);
            }
            if (prev.length < maxEligibleExpertises) {
                return [...prev, skillName];
            }
            return prev;
        });
    };

    // Special Choices State
    const [selectedFightingStyle, setSelectedFightingStyle] = useState<string>('');
    const [selectedInvocation, setSelectedInvocation] = useState<string>('');
    const [selectedSubclass, setSelectedSubclass] = useState<string>('');

    // Spells State
    const [selectedSpells, setSelectedSpells] = useState<Spell[]>([]);
    const [previewSpell, setPreviewSpell] = useState<Spell | null>(null);
    const [spellSearch, setSpellSearch] = useState<string>('');
    const [spellCircleFilter, setSpellCircleFilter] = useState<'all' | number>('all');

    const maxLeveledSpellsAllowed = isWizard ? 2 : 1;
    const selectedCantripsCount = selectedSpells.filter(s => s.level === 0).length;
    const selectedLeveledCount = selectedSpells.filter(s => s.level > 0).length;

    // Feat / ASI State
    const [progressionType, setProgressionType] = useState<'feat' | 'asi'>('feat');
    const [featCategoryFilter, setFeatCategoryFilter] = useState<'all' | FeatCategory>(newLevel >= 19 ? 'Dádiva Épica' : 'Geral');
    const [featSearch, setFeatSearch] = useState<string>('');
    const [selectedFeat, setSelectedFeat] = useState<Feat | null>(null);
    const [featAbilityChoice, setFeatAbilityChoice] = useState<AbilityScoreKey | null>(null);

    const [asiMode, setAsiMode] = useState<'plus2' | 'plus1_plus1'>('plus2');
    const [asiSingleAttr, setAsiSingleAttr] = useState<AbilityScoreKey>(() => {
        // Pre-select the character's highest upgradeable attribute (< 20)
        const sorted = [...ATTR_KEYS].sort((a, b) => (character.attributes[b]?.value || 10) - (character.attributes[a]?.value || 10));
        return sorted.find(k => (character.attributes[k]?.value || 10) < 20) || 'str';
    });
    const [asiSplitAttrs, setAsiSplitAttrs] = useState<AbilityScoreKey[]>([]);

    // Eligible ability options for selected half-feat / epic boon
    const featMaxCap = selectedFeat?.maxAttributeCap || 20;
    const featBonusCandidates = useMemo<AbilityScoreKey[]>(() => {
        if (!selectedFeat?.abilityBonusOptions) return [];
        const raw = selectedFeat.abilityBonusOptions === 'any' ? ATTR_KEYS : selectedFeat.abilityBonusOptions;
        return raw;
    }, [selectedFeat]);

    const upgradeableFeatBonusAttrs = useMemo<AbilityScoreKey[]>(() => {
        return featBonusCandidates.filter(k => {
            const val = character.attributes[k]?.value || 10;
            if (selectedFeat?.grantsSaveProficiency) {
                // Em Resiliente, prioriza atributos sem proficiência em Salvaguarda
                return !character.attributes[k]?.saveProficiency || val < featMaxCap;
            }
            return val < featMaxCap;
        });
    }, [featBonusCandidates, character.attributes, featMaxCap, selectedFeat]);

    const handleSelectFeat = (feat: Feat) => {
        setSelectedFeat(feat);
        const cap = feat.maxAttributeCap || 20;
        if (!feat.abilityBonusOptions) {
            setFeatAbilityChoice(null);
            return;
        }
        const opts = feat.abilityBonusOptions === 'any' ? ATTR_KEYS : feat.abilityBonusOptions;
        const validOpts = opts.filter(k => {
            if (feat.grantsSaveProficiency) {
                return !character.attributes[k]?.saveProficiency;
            }
            return (character.attributes[k]?.value || 10) < cap;
        });
        if (validOpts.length === 1) {
            setFeatAbilityChoice(validOpts[0]);
        } else if (featAbilityChoice && validOpts.includes(featAbilityChoice)) {
            // Keep current valid choice
        } else {
            setFeatAbilityChoice(validOpts[0] || null);
        }
    };

    const toggleSplitAsiAttr = (key: AbilityScoreKey) => {
        const currentVal = character.attributes[key]?.value || 10;
        if (currentVal >= 20) return;
        setAsiSplitAttrs(prev => {
            if (prev.includes(key)) {
                return prev.filter(k => k !== key);
            }
            if (prev.length < 2) {
                return [...prev, key];
            }
            return [prev[1], key];
        });
    };

    // Preview of resulting attributes after Feat/ASI
    const previewAttributes = useMemo<CharacterAttributes>(() => {
        const nextAttrs: CharacterAttributes = JSON.parse(JSON.stringify(character.attributes));
        if (!isAsiLevel || newLevel === 3) return nextAttrs;

        if (progressionType === 'feat' && selectedFeat && featAbilityChoice && nextAttrs[featAbilityChoice]) {
            const cap = selectedFeat.maxAttributeCap || 20;
            const inc = selectedFeat.abilityBonusAmount || 1;
            nextAttrs[featAbilityChoice].value = Math.min(cap, (nextAttrs[featAbilityChoice].value || 10) + inc);
            nextAttrs[featAbilityChoice].modifier = calculateModifier(nextAttrs[featAbilityChoice].value);
            if (selectedFeat.grantsSaveProficiency) {
                nextAttrs[featAbilityChoice].saveProficiency = true;
            }
        } else if (progressionType === 'asi') {
            if (asiMode === 'plus2' && asiSingleAttr && nextAttrs[asiSingleAttr]) {
                nextAttrs[asiSingleAttr].value = Math.min(20, (nextAttrs[asiSingleAttr].value || 10) + 2);
                nextAttrs[asiSingleAttr].modifier = calculateModifier(nextAttrs[asiSingleAttr].value);
            } else if (asiMode === 'plus1_plus1') {
                asiSplitAttrs.forEach(k => {
                    if (nextAttrs[k]) {
                        nextAttrs[k].value = Math.min(20, (nextAttrs[k].value || 10) + 1);
                        nextAttrs[k].modifier = calculateModifier(nextAttrs[k].value);
                    }
                });
            }
        }
        return nextAttrs;
    }, [character.attributes, isAsiLevel, newLevel, progressionType, selectedFeat, featAbilityChoice, asiMode, asiSingleAttr, asiSplitAttrs]);

    // Derived Math (HP, CON delta, Tough, Boon of Fortitude)
    const oldModCon = calculateModifier(character.attributes.con?.value || 10);
    const newModCon = calculateModifier(previewAttributes.con?.value || 10);
    const conModDelta = newModCon - oldModCon;

    const hitDieValue = parseInt(classData?.hitDie?.replace('d', '') || '8', 10) || 8;
    const isDwarf = character.race?.toLowerCase().includes('anão') || character.race?.toLowerCase().includes('dwarf');
    const racialHpBonusPerLevel = isDwarf ? 1 : 0;
    const featBonusPerLevel = (character.feats || []).reduce((acc, feat) => {
        const canonicalFeat = FEATS.find(f => f.id === feat.id);
        const effects = canonicalFeat?.effects || feat.effects;
        const hpEffect = effects?.find(e => e.type === 'hp_per_level');
        return acc + (hpEffect ? hpEffect.value : 0);
    }, 0);
    const totalBonus = featBonusPerLevel + racialHpBonusPerLevel;
    const avgHp = Math.max(1, Math.floor(hitDieValue / 2) + 1 + oldModCon + totalBonus);
    const baseHpGain = hpChoice === 'avg' ? avgHp : (rolledHp !== null ? rolledHp : avgHp);

    const isNewToughSelected = isAsiLevel && newLevel !== 3 && progressionType === 'feat' && selectedFeat?.id === 'tough' && !(character.feats || []).some(f => f.id === 'tough');
    const isNewFortitudeBoonSelected = isAsiLevel && newLevel !== 3 && progressionType === 'feat' && selectedFeat?.id === 'boon_of_fortitude' && !(character.feats || []).some(f => f.id === 'boon_of_fortitude');

    const retroactiveConHpBonus = conModDelta !== 0 ? conModDelta * newLevel : 0;
    const retroactiveFeatHpBonus = (isNewToughSelected ? 2 * newLevel : 0) + (isNewFortitudeBoonSelected ? 40 : 0);
    const totalHpAdded = Math.max(1, baseHpGain + retroactiveConHpBonus + retroactiveFeatHpBonus);

    const profBonus = getProficiencyBonus(newLevel);
    const newFeatures = getFeaturesForLevel(classId, newLevel);

    // Filtered Feats for Step 6
    const availableFeats = useMemo(() => {
        return FEATS.filter(feat => {
            if (feat.category === 'Dádiva Épica' && newLevel < 19) return false;
            if (featCategoryFilter !== 'all' && feat.category !== featCategoryFilter) return false;
            if (featSearch.trim()) {
                const q = featSearch.toLowerCase();
                return (
                    feat.name.toLowerCase().includes(q) ||
                    feat.description.toLowerCase().includes(q) ||
                    (feat.prerequisite || '').toLowerCase().includes(q)
                );
            }
            return true;
        });
    }, [newLevel, featCategoryFilter, featSearch]);

    // Roll HP Handler
    const handleRollHp = () => {
        const roll = Math.floor(Math.random() * hitDieValue) + 1;
        const total = Math.max(1, roll + oldModCon + totalBonus);
        setRolledHp(total);
        playSynthSound('dice');
    };

    // Step Validation Handler
    const isNextDisabled = useMemo(() => {
        if (currentStep === 'hp') {
            return hpChoice === 'roll' && rolledHp === null;
        }
        if (currentStep === 'skills') {
            return selectedNewExpertises.length < maxEligibleExpertises;
        }
        if (currentStep === 'choices') {
            if (hasSubclassChoice && !selectedSubclass) return true;
            if (hasFightingStyleChoice && !selectedFightingStyle) return true;
            if (hasInvocationChoice && !selectedInvocation) return true;
            return false;
        }
        if (currentStep === 'feat') {
            if (progressionType === 'feat') {
                if (!selectedFeat) return true;
                if (upgradeableFeatBonusAttrs.length > 0 && !featAbilityChoice) return true;
                return false;
            }
            if (progressionType === 'asi') {
                const anyBelow20 = ATTR_KEYS.some(k => (character.attributes[k]?.value || 10) < 20);
                if (!anyBelow20) return false;
                if (asiMode === 'plus2') {
                    return !asiSingleAttr || (character.attributes[asiSingleAttr]?.value || 10) >= 20;
                }
                const under20Count = ATTR_KEYS.filter(k => (character.attributes[k]?.value || 10) < 20).length;
                if (under20Count === 1) {
                    return asiSplitAttrs.length < 1;
                }
                return asiSplitAttrs.length !== 2 || asiSplitAttrs[0] === asiSplitAttrs[1];
            }
        }
        return false;
    }, [
        currentStep,
        hpChoice,
        rolledHp,
        selectedNewExpertises.length,
        maxEligibleExpertises,
        hasSubclassChoice,
        selectedSubclass,
        hasFightingStyleChoice,
        selectedFightingStyle,
        hasInvocationChoice,
        selectedInvocation,
        progressionType,
        selectedFeat,
        upgradeableFeatBonusAttrs.length,
        featAbilityChoice,
        asiMode,
        asiSingleAttr,
        asiSplitAttrs,
        character.attributes
    ]);

    // Finish & Apply Progression
    const handleFinish = () => {
        // 0. Snapshot before applying newLevel for exact future Level Down restoration
        const snapshot: LevelUpSnapshot = {
            level: newLevel,
            previousHpMax: character.hp.max,
            hpGained: totalHpAdded,
            previousAttributes: JSON.parse(JSON.stringify(character.attributes)),
            previousFeatIds: (character.feats || []).map(f => f.id),
            previousFeatureNames: (character.features || []).map(f => f.name),
            previousSpellIds: (character.spells || []).map(s => s.id),
            previousSubclass: character.subclass,
            previousSkillExpertises: (character.skills || []).filter(s => s.expertise).map(s => s.name)
        };

        // 1. HP Updates (including retroactive CON / Tough / Fortitude bonus)
        const newMaxHp = character.hp.max + totalHpAdded;
        const newCurrentHp = Math.min(newMaxHp, character.hp.current + totalHpAdded);

        // 2. Hit Dice Updates
        const updatedHitDice = {
            dieFace: classData?.hitDie || character.hitDice?.dieFace || 'd8',
            max: newLevel,
            current: Math.min(newLevel, (character.hitDice?.current || 1) + 1)
        };

        // 3. Features
        const existingNames = new Set((character.features || []).map(f => f.name));
        const featuresToAdd = newFeatures.filter(f => !existingNames.has(f.name));

        if (hasFightingStyleChoice && selectedFightingStyle) {
            const fs = FIGHTING_STYLES.find(f => f.id === selectedFightingStyle);
            if (fs && !existingNames.has(`Estilo de Luta: ${fs.name}`)) {
                featuresToAdd.push({
                    name: `Estilo de Luta: ${fs.name}`,
                    level: newLevel,
                    description: fs.description,
                    type: 'passive'
                });
            }
        }

        if (hasInvocationChoice && selectedInvocation) {
            const inv = WARLOCK_INVOCATIONS.find(i => i.id === selectedInvocation);
            if (inv && !existingNames.has(`Invocação Mística: ${inv.name}`)) {
                featuresToAdd.push({
                    name: `Invocação Mística: ${inv.name}`,
                    level: newLevel,
                    description: inv.description,
                    type: 'passive'
                });
            }
        }

        // Subclass Resolution
        const chosenSubclass = classData?.subclasses?.find(s => s.id === selectedSubclass);
        const finalSubclassName = chosenSubclass?.name || (hasSubclassChoice ? selectedSubclass : character.subclass);

        const matchedSubclass = classData?.subclasses?.find(
            s => s.name === finalSubclassName || s.id === finalSubclassName || s.id === selectedSubclass
        );
        if (matchedSubclass) {
            (matchedSubclass.features || []).filter(f => f.level <= newLevel).forEach(f => {
                if (!existingNames.has(f.name)) {
                    featuresToAdd.push({
                        ...f,
                        type: f.type || 'passive'
                    });
                }
            });
        }

        // 4. Spell Slots calculation from official 1 to 20 progression (preserving currently used slots where valid)
        const baseSlots = getSpellSlotsForLevel(classId, newLevel);
        const updatedSpellSlots: Character['spellSlots'] = {};
        for (let circle = 1; circle <= 9; circle++) {
            const max = baseSlots[circle]?.max || 0;
            const prevUsed = character.spellSlots?.[circle]?.used || 0;
            updatedSpellSlots[circle] = {
                max,
                used: Math.min(max, prevUsed)
            };
        }

        // 5. Class Resources calculation from official 1 to 20 progression
        const updatedResources = getClassResourcesForLevel(
            classId,
            newLevel,
            character.classResources,
            previewAttributes.cha ? previewAttributes.cha.modifier : 1,
            finalSubclassName
        );

        // 6. Recalculate Skills with new Proficiency Bonus and newly chosen expertises
        const updatedSkills: Skill[] = (character.skills || []).map(s => {
            const isNewlyExpert = selectedNewExpertises.includes(s.name);
            const hasExpertise = !!s.expertise || isNewlyExpert;
            const attrMod = previewAttributes[s.attribute]?.modifier ?? 0;
            let val = attrMod;
            if (s.proficient) val += profBonus;
            if (hasExpertise) val += profBonus;
            return {
                ...s,
                expertise: hasExpertise,
                value: val
            };
        });

        // 7. Base Character Update (Queue aware)
        const targetLevel = character.levelUpTarget;
        const isEndOfQueue = !targetLevel || newLevel >= targetLevel;

        const nextChar: Character = {
            ...character,
            level: isEndOfQueue ? newLevel : newLevel + 1,
            experience: XP_TABLE[isEndOfQueue ? newLevel : newLevel + 1] ?? character.experience,
            nextLevelExperience: XP_TABLE[isEndOfQueue ? newLevel + 1 : newLevel + 2] ?? character.nextLevelExperience,
            pendingLevelUp: !isEndOfQueue,
            levelUpTarget: isEndOfQueue ? undefined : targetLevel,
            levelHistory: {
                ...(character.levelHistory || {}),
                [newLevel]: snapshot
            },
            attributes: previewAttributes,
            hp: { ...character.hp, max: newMaxHp, current: newCurrentHp },
            hitDice: updatedHitDice,
            skills: updatedSkills,
            features: [...(character.features || []), ...featuresToAdd],
            subclass: finalSubclassName,
            spellSlots: updatedSpellSlots,
            classResources: updatedResources,
            hpRolled: hpChoice === 'roll' ? baseHpGain : false
        };

        // 8. Add Selected Spells & Subclass Granted Spells
        const allNewSpells: Spell[] = [...selectedSpells];
        if (finalSubclassName) {
            const scSpells = getSubclassGrantedSpells(finalSubclassName, newLevel);
            scSpells.forEach(scSpell => {
                if (!allNewSpells.some(s => s.id === scSpell.id)) {
                    allNewSpells.push(scSpell);
                }
            });
        }

        if (allNewSpells.length > 0) {
            const existingSpellIds = new Set((character.spells || []).map(s => s.id));
            const newSpells = allNewSpells.filter(s => !existingSpellIds.has(s.id));
            nextChar.spells = [...(character.spells || []), ...newSpells];
        }

        // 9. Add Feat if chosen at ASI level
        if (isAsiLevel && newLevel !== 3 && progressionType === 'feat' && selectedFeat) {
            const storedFeat: Feat = {
                ...selectedFeat,
                chosenAbilityBonus: featAbilityChoice || undefined,
                acquiredAtLevel: newLevel
            };
            nextChar.feats = [...(character.feats || []), storedFeat];
        }

        // Regenerate derived stats (AC, DC, PB, attacks — note conDelta === 0 since previewAttributes already has updated CON modifier)
        const finalChar = regenerateCharacterStats(nextChar);

        playSynthSound('crit');
        onUpdate(finalChar);
        if (isEndOfQueue) {
            onClose();
        } else {
            setCurrentStepIdx(0);
            setSelectedSpells([]);
            setPreviewSpell(null);
            setSelectedFeat(null);
            setFeatAbilityChoice(null);
            setAsiSplitAttrs([]);
            setRolledHp(null);
            setSelectedNewExpertises([]);
            setSelectedSubclass('');
            setSelectedFightingStyle('');
            setSelectedInvocation('');
        }
    };

    const nextStep = () => {
        if (currentStepIdx < steps.length - 1) {
            setCurrentStepIdx(prev => prev + 1);
        } else {
            handleFinish();
        }
    };

    const prevStep = () => {
        if (currentStepIdx > 0) {
            setCurrentStepIdx(prev => prev - 1);
        }
    };

    return (
        <div className="lvl-modal-overlay">
            <div className="lvl-modal">
                {/* Header */}
                <div className="lvl-header">
                    <div className="lvl-header-title">
                        <span className="lvl-badge-level">Nível {newLevel}</span>
                        <h2>Evolução: {classData?.name}</h2>
                        {character.levelUpTarget && character.levelUpTarget > 1 && (
                            <span style={{
                                background: 'rgba(255, 215, 0, 0.15)',
                                border: '1px solid #ffd700',
                                color: '#ffd700',
                                padding: '2px 8px',
                                borderRadius: '12px',
                                fontSize: '0.75rem',
                                fontWeight: 'bold',
                                marginLeft: '6px'
                            }}>
                                Meta da Campanha: Nível {character.levelUpTarget}
                            </span>
                        )}
                    </div>
                    <button type="button" className="lvl-close-btn" onClick={onClose} title="Fechar">
                        <X size={18} />
                    </button>
                </div>

                {/* Stepper Tabs */}
                <div className="lvl-stepper">
                    {steps.map((st, idx) => (
                        <button
                            key={st.id}
                            type="button"
                            className={`lvl-step-tab ${currentStepIdx === idx ? 'active' : ''} ${currentStepIdx > idx ? 'completed' : ''}`}
                            onClick={() => {
                                if (idx <= currentStepIdx || !isNextDisabled) {
                                    setCurrentStepIdx(idx);
                                }
                            }}
                        >
                            <span>{st.label}</span>
                            {currentStepIdx > idx && <Check size={12} color="#22c55e" />}
                        </button>
                    ))}
                </div>

                {/* Modal Body */}
                <div className="lvl-body">

                    {/* 1. SUMMARY STEP */}
                    {currentStep === 'summary' && (
                        <div>
                            <div className="lvl-overview-hero">
                                <div>
                                    <h3 style={{ margin: '0 0 6px 0', color: '#ffd700', fontSize: '1.25rem' }}>
                                        Parabéns! Você alcançou o Nível {newLevel}.
                                    </h3>
                                    <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.88rem' }}>
                                        Seu personagem cresce em poder, desbloqueando novos dados de vida, habilidades e recursos de combate.
                                    </p>
                                </div>
                                <Sparkles size={36} color="#ffd700" />
                            </div>

                            <div className="lvl-overview-stats">
                                <div className="lvl-stat-pill">
                                    <span className="label">Bônus de Proficiência</span>
                                    <span className="val">+{profBonus}</span>
                                </div>
                                <div className="lvl-stat-pill">
                                    <span className="label">Novo Dado de Vida</span>
                                    <span className="val">+1d{hitDieValue} (Total: {newLevel}d{hitDieValue})</span>
                                </div>
                                <div className="lvl-stat-pill">
                                    <span className="label">Modificador de CON</span>
                                    <span className="val">{oldModCon >= 0 ? `+${oldModCon}` : oldModCon}</span>
                                </div>
                            </div>

                            {isAsiLevel && newLevel !== 3 && (
                                <div style={{
                                    marginTop: '14px',
                                    padding: '12px 14px',
                                    background: 'rgba(197, 160, 89, 0.1)',
                                    border: '1px solid rgba(255, 215, 0, 0.35)',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px'
                                }}>
                                    <Award size={24} color="#ffd700" style={{ flexShrink: 0 }} />
                                    <div>
                                        <strong style={{ color: '#ffd700', fontSize: '0.9rem', display: 'block' }}>
                                            {newLevel >= 19 ? 'Marco Épico (19º Nível): Dádiva Épica ou Talento!' : `Marco do ${newLevel}º Nível: Talento Geral ou Aumento de Atributo!`}
                                        </strong>
                                        <span style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>
                                            Nesta evolução você poderá escolher qualquer Talento (incluindo o bônus de +1 no atributo dos Talentos Gerais de D&D 5.5e) ou aumentar seus atributos em +2 ou +1/+1!
                                        </span>
                                    </div>
                                </div>
                            )}

                            {hasSubclassChoice && (
                                <div style={{
                                    marginTop: '14px',
                                    padding: '12px 14px',
                                    background: 'rgba(255, 215, 0, 0.08)',
                                    border: '1px solid rgba(255, 215, 0, 0.35)',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px'
                                }}>
                                    <Sparkles size={24} color="#ffd700" style={{ flexShrink: 0 }} />
                                    <div>
                                        <strong style={{ color: '#ffd700', fontSize: '0.9rem', display: 'block' }}>
                                            Marco do 3º Nível: Escolha de Subclasse!
                                        </strong>
                                        <span style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>
                                            Nesta evolução você escolherá a especialização definitiva do seu {classData?.name || character.class}, desbloqueando poderes e arquétipos exclusivos de D&D 5.5e (2024).
                                        </span>
                                    </div>
                                </div>
                            )}

                            <div style={{ marginTop: '20px' }}>
                                <h4 style={{ color: '#e2e8f0', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Award size={16} color="#ffd700" />
                                    <span>Habilidades Desbloqueadas no Nível {newLevel}:</span>
                                </h4>
                                {newFeatures.length > 0 ? (
                                    <div className="lvl-features-list">
                                        {newFeatures.map((f, i) => (
                                            <div key={i} className="lvl-feature-card">
                                                <div className="lvl-feature-card-header">
                                                    <span className="lvl-feature-name">{f.name}</span>
                                                    <span className={`lvl-type-badge ${f.type || 'passive'}`}>
                                                        {f.type === 'action' ? 'Ação' : f.type === 'bonus_action' ? 'Ação Bônus' : f.type === 'reaction' ? 'Reação' : 'Passiva'}
                                                    </span>
                                                </div>
                                                <p className="lvl-feature-desc">{f.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p style={{ color: '#888', fontStyle: 'italic' }}>
                                        Nenhuma habilidade de classe automática adicional neste nível.
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* 2. HP STEP */}
                    {currentStep === 'hp' && (
                        <div>
                            <h3 style={{ margin: '0 0 6px 0', color: '#ffd700' }}>Aumento de Pontos de Vida (HP)</h3>
                            <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: 0 }}>
                                Escolha se prefere o aumento seguro pela média fixa ou arriscar uma rolagem de dado (1d{hitDieValue}).
                            </p>

                            <div className="lvl-hp-grid">
                                <div
                                    className={`lvl-hp-card ${hpChoice === 'avg' ? 'selected' : ''}`}
                                    onClick={() => setHpChoice('avg')}
                                >
                                    <Shield size={24} color="#ffd700" />
                                    <h4 style={{ margin: '8px 0 2px 0' }}>Média Fixa (Recomendado)</h4>
                                    <span className="lvl-hp-val">+{avgHp} PV</span>
                                    <small style={{ color: '#888' }}>
                                        Metade do dado ({Math.floor(hitDieValue / 2) + 1}) + Mod. Con ({oldModCon >= 0 ? `+${oldModCon}` : oldModCon})
                                        {featBonusPerLevel > 0 && ` + Vigoroso (+${featBonusPerLevel})`}
                                        {racialHpBonusPerLevel > 0 && ` + Tenacidade Anã (+${racialHpBonusPerLevel})`}
                                    </small>
                                </div>

                                <div
                                    className={`lvl-hp-card ${hpChoice === 'roll' ? 'selected' : ''}`}
                                    onClick={() => setHpChoice('roll')}
                                >
                                    <Dices size={24} color="#60a5fa" />
                                    <h4 style={{ margin: '8px 0 2px 0' }}>Rolar Dado (1d{hitDieValue})</h4>
                                    {rolledHp !== null ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                            <span className="lvl-hp-val">+{rolledHp} PV</span>
                                            <button
                                                type="button"
                                                className="lvl-btn-back"
                                                style={{ fontSize: '0.72rem', padding: '3px 10px', marginBottom: '4px' }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRollHp();
                                                }}
                                            >
                                                Rerrolar
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            type="button"
                                            className="lvl-btn-primary"
                                            style={{ margin: '10px 0', padding: '6px 16px', fontSize: '0.85rem' }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setHpChoice('roll');
                                                handleRollHp();
                                            }}
                                        >
                                            <Dices size={14} /> Rolar 1d{hitDieValue}
                                        </button>
                                    )}
                                    <small style={{ color: '#888' }}>
                                        Resultado do d{hitDieValue} + Mod. Con ({oldModCon >= 0 ? `+${oldModCon}` : oldModCon})
                                        {featBonusPerLevel > 0 && ` + Vigoroso (+${featBonusPerLevel})`}
                                        {racialHpBonusPerLevel > 0 && ` + Tenacidade Anã (+${racialHpBonusPerLevel})`}
                                    </small>
                                </div>
                            </div>

                            <div className="lvl-hp-preview-bar">
                                <div>
                                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>PV Máximo Anterior:</span>
                                    <strong style={{ display: 'block', fontSize: '1.2rem', color: '#fff' }}>{character.hp.max}</strong>
                                </div>
                                <ArrowRight size={20} color="#ffd700" />
                                <div>
                                    <span style={{ fontSize: '0.75rem', color: '#ffd700', textTransform: 'uppercase' }}>Novo PV Máximo:</span>
                                    <strong style={{ display: 'block', fontSize: '1.4rem', color: '#4ade80' }}>
                                        {character.hp.max + totalHpAdded} (+{totalHpAdded})
                                    </strong>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 3. SKILLS & EXPERTISE STEP */}
                    {currentStep === 'skills' && (
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                <div>
                                    <h3 style={{ margin: 0, color: '#ffd700' }}>Especialização em Perícias (Expertise)</h3>
                                    <p style={{ margin: '4px 0 0 0', color: '#94a3b8', fontSize: '0.85rem' }}>
                                        {isBard && newLevel === 2 ? 'Bardo Nível 2: Escolha 2 perícias treinadas para Especialização (dobra o bônus de proficiência).' :
                                         isBard && newLevel === 9 ? 'Bardo Nível 9: Escolha 2 perícias treinadas adicionais para Especialização.' :
                                         isRanger && newLevel === 2 ? 'Guardião Nível 2 (Explorador Hábil): Escolha 1 perícia treinada para Especialização.' :
                                         isRanger && newLevel === 9 ? 'Guardião Nível 9: Escolha 2 perícias treinadas adicionais para Especialização.' :
                                         isRogue && newLevel === 6 ? 'Ladino Nível 6: Escolha 2 perícias treinadas adicionais para Especialização.' :
                                         `Escolha ${allowedExpertiseGains} perícia(s) já treinada(s) para receber Especialização.`}
                                    </p>
                                    <div style={{
                                        marginTop: '6px',
                                        fontSize: '0.82rem',
                                        fontWeight: 600,
                                        color: selectedNewExpertises.length === maxEligibleExpertises ? '#4ade80' : '#f59e0b'
                                    }}>
                                        Perícias Selecionadas: {selectedNewExpertises.length} de {maxEligibleExpertises}
                                    </div>
                                </div>
                                <UserCheck size={28} color="#ffd700" />
                            </div>

                            {eligibleSkillsForExpertise.length === 0 ? (
                                <div style={{ padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', color: '#94a3b8', textAlign: 'center' }}>
                                    Nenhuma perícia treinada disponível para receber especialização.
                                </div>
                            ) : (
                                <div className="lvl-skills-grid">
                                    {(character.skills || []).map(skill => {
                                        const alreadyHasExpertise = !!skill.expertise;
                                        const isSelected = selectedNewExpertises.includes(skill.name);
                                        const isEligible = skill.proficient && !alreadyHasExpertise;
                                        const canSelect = isSelected || selectedNewExpertises.length < maxEligibleExpertises;

                                        const attrMod = previewAttributes[skill.attribute]?.modifier ?? 0;
                                        let displayBonus = attrMod;
                                        if (skill.proficient) displayBonus += profBonus;
                                        if (alreadyHasExpertise || isSelected) displayBonus += profBonus;

                                        return (
                                            <div
                                                key={skill.name}
                                                className={`lvl-skill-item ${alreadyHasExpertise || isSelected ? 'has-expertise' : ''}`}
                                                style={{
                                                    opacity: !skill.proficient ? 0.4 : 1,
                                                    cursor: isEligible && canSelect ? 'pointer' : 'default',
                                                    borderColor: isSelected ? '#ffd700' : undefined
                                                }}
                                                onClick={() => {
                                                    if (isEligible) toggleSelectExpertise(skill.name);
                                                }}
                                            >
                                                <div className="lvl-skill-info">
                                                    <span className="lvl-skill-name">{skill.name}</span>
                                                    <span className="lvl-skill-attr">{skill.attribute}</span>
                                                </div>

                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    {!skill.proficient && (
                                                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                                            Não treinado
                                                        </span>
                                                    )}

                                                    {skill.proficient && !alreadyHasExpertise && (
                                                        <button
                                                            type="button"
                                                            className={`lvl-skill-btn-toggle ${isSelected ? 'active' : ''}`}
                                                            style={{
                                                                background: isSelected ? '#ffd700' : 'rgba(255,215,0,0.1)',
                                                                color: isSelected ? '#000' : '#ffd700',
                                                                borderColor: '#ffd700',
                                                                cursor: canSelect ? 'pointer' : 'not-allowed'
                                                            }}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                toggleSelectExpertise(skill.name);
                                                            }}
                                                        >
                                                            {isSelected ? '✓ Selecionada' : '+ Especializar'}
                                                        </button>
                                                    )}

                                                    {alreadyHasExpertise && (
                                                        <span style={{
                                                            fontSize: '0.75rem',
                                                            background: 'rgba(255,215,0,0.15)',
                                                            color: '#ffd700',
                                                            padding: '2px 6px',
                                                            borderRadius: '4px',
                                                            border: '1px solid rgba(255,215,0,0.3)'
                                                        }}>
                                                            Já Especialista
                                                        </span>
                                                    )}

                                                    <span className="lvl-skill-bonus">
                                                        {displayBonus >= 0 ? `+${displayBonus}` : displayBonus}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {/* 4. CLASS CHOICES STEP */}
                    {currentStep === 'choices' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {hasFightingStyleChoice && (
                                <div>
                                    <h3 style={{ margin: '0 0 6px 0', color: '#ffd700' }}>Escolha um Estilo de Luta</h3>
                                    <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '14px' }}>
                                        {classData?.name} adota uma postura marcial especializada para combate.
                                    </p>

                                    <div className="lvl-choices-grid">
                                        {FIGHTING_STYLES.map(fs => {
                                            const isSelected = selectedFightingStyle === fs.id;
                                            return (
                                                <div
                                                    key={fs.id}
                                                    className={`lvl-choice-card ${isSelected ? 'selected' : ''}`}
                                                    onClick={() => setSelectedFightingStyle(fs.id)}
                                                >
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <h4>{fs.name}</h4>
                                                        {isSelected && <Check size={16} color="#ffd700" />}
                                                    </div>
                                                    <span style={{ fontSize: '0.72rem', color: '#eab308', textTransform: 'uppercase' }}>
                                                        {fs.category}
                                                    </span>
                                                    <p>{fs.description}</p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {hasInvocationChoice && (
                                <div>
                                    <h3 style={{ margin: '0 0 6px 0', color: '#ffd700' }}>Escolha uma Invocação Mística</h3>
                                    <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '14px' }}>
                                        Seu patrono concede fragmentos de poder oculto e segredos eldritch desbloqueados até o {newLevel}º nível.
                                    </p>

                                    <div className="lvl-choices-grid">
                                        {WARLOCK_INVOCATIONS.filter(inv => inv.minLevel <= newLevel).map(inv => {
                                            const alreadyOwned = (character.features || []).some(f => f.name.toLowerCase().includes(inv.name.toLowerCase()));
                                            const isSelected = selectedInvocation === inv.id;
                                            return (
                                                <div
                                                    key={inv.id}
                                                    className={`lvl-choice-card ${isSelected ? 'selected' : ''}`}
                                                    style={alreadyOwned ? { opacity: 0.45, pointerEvents: 'none' } : undefined}
                                                    onClick={() => !alreadyOwned && setSelectedInvocation(inv.id)}
                                                >
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                                                        <h4>{inv.name}</h4>
                                                        {alreadyOwned ? (
                                                            <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Adquirida</span>
                                                        ) : (
                                                            isSelected && <Check size={16} color="#ffd700" />
                                                        )}
                                                    </div>
                                                    {inv.prerequisite && (
                                                        <span style={{ fontSize: '0.72rem', color: '#eab308' }}>
                                                            Pré-req: {inv.prerequisite}
                                                        </span>
                                                    )}
                                                    <p>{inv.description}</p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {hasSubclassChoice && (
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                        <h3 style={{ margin: 0, color: '#ffd700', fontSize: '1.15rem' }}>
                                            Escolha sua Subclasse ({subclassLevel}º Nível)
                                        </h3>
                                        <span style={{
                                            fontSize: '0.8rem',
                                            fontWeight: 600,
                                            color: selectedSubclass ? '#4ade80' : '#f59e0b',
                                            background: selectedSubclass ? 'rgba(74, 222, 128, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                            padding: '3px 10px',
                                            borderRadius: '12px',
                                            border: `1px solid ${selectedSubclass ? '#4ade80' : '#f59e0b'}`
                                        }}>
                                            {selectedSubclass ? '✓ Subclasse Selecionada' : 'Seleção Obrigatória'}
                                        </span>
                                    </div>
                                    <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '14px' }}>
                                        Selecione o arquétipo definitivo da sua classe ({classData?.name || character.class}).
                                    </p>

                                    <div className="lvl-choices-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                                        {(classData?.subclasses || []).map(sc => {
                                            const isSelected = selectedSubclass === sc.id;
                                            return (
                                                <div
                                                    key={sc.id}
                                                    className={`lvl-choice-card ${isSelected ? 'selected' : ''}`}
                                                    onClick={() => setSelectedSubclass(sc.id)}
                                                    style={{
                                                        padding: '14px',
                                                        borderRadius: '8px',
                                                        border: isSelected ? '2px solid #ffd700' : '1px solid rgba(255,255,255,0.1)',
                                                        background: isSelected ? 'rgba(255, 215, 0, 0.08)' : 'rgba(0,0,0,0.3)',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        gap: '8px'
                                                    }}
                                                >
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <h4 style={{ margin: 0, color: isSelected ? '#ffd700' : '#fff', fontSize: '1rem' }}>
                                                            {sc.name}
                                                        </h4>
                                                        {isSelected ? (
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ffd700', fontSize: '0.75rem', fontWeight: 'bold' }}>
                                                                <Check size={16} />
                                                                <span>Escolhida</span>
                                                            </div>
                                                        ) : (
                                                            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Clique para escolher</span>
                                                        )}
                                                    </div>
                                                    <p style={{ margin: 0, fontSize: '0.84rem', color: '#cbd5e1', lineHeight: '1.4' }}>
                                                        {sc.description}
                                                    </p>

                                                    {sc.features && sc.features.length > 0 && (
                                                        <div style={{
                                                            marginTop: '6px',
                                                            paddingTop: '8px',
                                                            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            gap: '6px'
                                                        }}>
                                                            <span style={{ fontSize: '0.75rem', color: '#ffd700', fontWeight: 600, textTransform: 'uppercase' }}>
                                                                Habilidades do Arquétipo:
                                                            </span>
                                                            {sc.features.map(f => (
                                                                <div key={f.name} style={{
                                                                    fontSize: '0.8rem',
                                                                    color: '#94a3b8',
                                                                    lineHeight: '1.35',
                                                                    padding: '4px 8px',
                                                                    background: 'rgba(255,255,255,0.03)',
                                                                    borderRadius: '4px'
                                                                }}>
                                                                    <strong style={{ color: '#f1f5f9' }}>Nv {f.level} - {f.name}: </strong>
                                                                    <span>{f.description}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* 5. SPELLS STEP */}
                    {currentStep === 'spells' && (
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '10px', flexWrap: 'wrap' }}>
                                <div>
                                    <h3 style={{ margin: 0, color: '#ffd700' }}>Aprender Novas Magias</h3>
                                    <p style={{ margin: '4px 0 0 0', color: '#94a3b8', fontSize: '0.85rem' }}>
                                        {cantripsGainedCount > 0
                                            ? `Você desbloqueou +${cantripsGainedCount} novo Truque (Selecionados: ${selectedCantripsCount}/${cantripsGainedCount}) e até ${maxLeveledSpellsAllowed} magia(s) de até ${maxSpellCircle}º círculo (Selecionadas: ${selectedLeveledCount}/${maxLeveledSpellsAllowed}).`
                                            : `Selecione até ${maxLeveledSpellsAllowed} nova(s) magia(s) de até ${maxSpellCircle}º círculo. (Selecionadas: ${selectedLeveledCount}/${maxLeveledSpellsAllowed})`}
                                    </p>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Buscar magias..."
                                    value={spellSearch}
                                    onChange={e => setSpellSearch(e.target.value)}
                                    style={{
                                        background: 'rgba(0,0,0,0.4)',
                                        border: '1px solid rgba(255,255,255,0.15)',
                                        color: '#fff',
                                        padding: '6px 12px',
                                        borderRadius: '6px',
                                        fontSize: '0.82rem',
                                        minWidth: '200px'
                                    }}
                                />
                            </div>

                            {/* Circle Filter Pills */}
                            <div className="feat-filter-bar" style={{ marginBottom: '12px' }}>
                                <button
                                    type="button"
                                    className={`feat-filter-pill ${spellCircleFilter === 'all' ? 'active' : ''}`}
                                    onClick={() => setSpellCircleFilter('all')}
                                >
                                    Todas
                                </button>
                                {cantripsGainedCount > 0 && (
                                    <button
                                        type="button"
                                        className={`feat-filter-pill ${spellCircleFilter === 0 ? 'active' : ''}`}
                                        onClick={() => setSpellCircleFilter(0)}
                                    >
                                        Truques (+{cantripsGainedCount})
                                    </button>
                                )}
                                {Array.from({ length: maxSpellCircle }, (_, i) => i + 1).map(circle => (
                                    <button
                                        key={circle}
                                        type="button"
                                        className={`feat-filter-pill ${spellCircleFilter === circle ? 'active' : ''}`}
                                        onClick={() => setSpellCircleFilter(circle)}
                                    >
                                        {circle}º Círculo
                                    </button>
                                ))}
                            </div>

                            <div className="lvl-spells-layout">
                                <div className="lvl-spells-picker">
                                    {SPELLS
                                        .filter(s => {
                                            if (!s.classes.includes(classData?.id)) return false;
                                            if (s.level === 0) return cantripsGainedCount > 0;
                                            return s.level <= maxSpellCircle;
                                        })
                                        .filter(s => spellCircleFilter === 'all' || s.level === spellCircleFilter)
                                        .filter(s => !spellSearch || s.name.toLowerCase().includes(spellSearch.toLowerCase()) || s.school.toLowerCase().includes(spellSearch.toLowerCase()))
                                        .map(spell => {
                                            const isOwned = (character.spells || []).some(cs => cs.id === spell.id);
                                            const isSelected = selectedSpells.some(s => s.id === spell.id);
                                            return (
                                                <div
                                                    key={spell.id}
                                                    className={`lvl-spell-row ${isSelected ? 'selected' : ''}`}
                                                    style={isOwned ? { opacity: 0.5 } : {}}
                                                    onClick={() => {
                                                        setPreviewSpell(spell);
                                                        if (isOwned) return;
                                                        if (isSelected) {
                                                            setSelectedSpells(prev => prev.filter(s => s.id !== spell.id));
                                                        } else if (spell.level === 0) {
                                                            if (selectedCantripsCount < cantripsGainedCount) {
                                                                setSelectedSpells(prev => [...prev, spell]);
                                                            } else if (cantripsGainedCount === 1) {
                                                                setSelectedSpells(prev => [...prev.filter(s => s.level !== 0), spell]);
                                                            }
                                                        } else {
                                                            if (selectedLeveledCount < maxLeveledSpellsAllowed) {
                                                                setSelectedSpells(prev => [...prev, spell]);
                                                            } else if (maxLeveledSpellsAllowed === 1) {
                                                                setSelectedSpells(prev => [...prev.filter(s => s.level === 0), spell]);
                                                            }
                                                        }
                                                    }}
                                                >
                                                    <div>
                                                        <strong style={{ display: 'block', fontSize: '0.88rem' }}>{spell.name}</strong>
                                                        <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                                                            {spell.level === 0 ? 'Truque' : `${spell.level}º Círculo`} • {spell.school}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        {isOwned ? (
                                                            <span style={{ fontSize: '0.75rem', color: '#888' }}>Aprendida</span>
                                                        ) : isSelected ? (
                                                            <Check size={16} color="#ffd700" />
                                                        ) : (
                                                            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>+ Adicionar</span>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>

                                <div className="lvl-spell-preview">
                                    {(previewSpell || selectedSpells[selectedSpells.length - 1]) ? (() => {
                                        const sp = previewSpell || selectedSpells[selectedSpells.length - 1];
                                        return (
                                            <div>
                                                <h4 style={{ margin: '0 0 4px 0', color: '#ffd700' }}>{sp.name}</h4>
                                                <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '8px' }}>
                                                    {sp.level === 0 ? 'Truque' : `${sp.level}º Círculo`} • {sp.school} • Tempo: {sp.castingTime} • Alcance: {sp.range}
                                                </div>
                                                <p style={{ fontSize: '0.82rem', color: '#e2e8f0', lineHeight: 1.5 }}>
                                                    {sp.description}
                                                </p>
                                            </div>
                                        );
                                    })() : (
                                        <div style={{ color: '#64748b', textAlign: 'center', marginTop: '60px', fontStyle: 'italic' }}>
                                            Clique em uma magia para ver sua descrição completa e adicioná-la à sua ficha.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 6. FEAT / ASI STEP */}
                    {currentStep === 'feat' && isAsiLevel && (
                        <div className="lvl-feat-step-container">
                            <div className="feat-type-selector">
                                <button
                                    type="button"
                                    className={`fts-btn ${progressionType === 'feat' ? 'active' : ''}`}
                                    onClick={() => setProgressionType('feat')}
                                >
                                    <Award size={16} />
                                    <span>Novo Talento (D&D 5.5e)</span>
                                </button>
                                <button
                                    type="button"
                                    className={`fts-btn ${progressionType === 'asi' ? 'active' : ''}`}
                                    onClick={() => setProgressionType('asi')}
                                >
                                    <Sparkles size={16} />
                                    <span>Aumento no Atributo (+2 ou +1/+1)</span>
                                </button>
                            </div>

                            {progressionType === 'feat' ? (
                                <div>
                                    {/* Category Filter & Search */}
                                    <div className="feat-toolbar">
                                        <div className="feat-filter-bar">
                                            {newLevel >= 19 && (
                                                <button
                                                    type="button"
                                                    className={`feat-filter-pill ${featCategoryFilter === 'Dádiva Épica' ? 'active' : ''}`}
                                                    onClick={() => setFeatCategoryFilter('Dádiva Épica')}
                                                >
                                                    Dádivas Épicas (Nv 19)
                                                </button>
                                            )}
                                            <button
                                                type="button"
                                                className={`feat-filter-pill ${featCategoryFilter === 'Geral' ? 'active' : ''}`}
                                                onClick={() => setFeatCategoryFilter('Geral')}
                                            >
                                                Gerais (Nv 4+)
                                            </button>
                                            <button
                                                type="button"
                                                className={`feat-filter-pill ${featCategoryFilter === 'Origem' ? 'active' : ''}`}
                                                onClick={() => setFeatCategoryFilter('Origem')}
                                            >
                                                Origem
                                            </button>
                                            <button
                                                type="button"
                                                className={`feat-filter-pill ${featCategoryFilter === 'Estilo de Luta' ? 'active' : ''}`}
                                                onClick={() => setFeatCategoryFilter('Estilo de Luta')}
                                            >
                                                Estilos de Luta
                                            </button>
                                            <button
                                                type="button"
                                                className={`feat-filter-pill ${featCategoryFilter === 'all' ? 'active' : ''}`}
                                                onClick={() => setFeatCategoryFilter('all')}
                                            >
                                                Todos ({FEATS.filter(f => f.category !== 'Dádiva Épica' || newLevel >= 19).length})
                                            </button>
                                        </div>

                                        <div className="feat-search-box">
                                            <Search size={14} color="#94a3b8" />
                                            <input
                                                type="text"
                                                placeholder="Buscar talento por nome ou efeito..."
                                                value={featSearch}
                                                onChange={e => setFeatSearch(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {/* Half-Feat +1 Ability Score Selector when selectedFeat grants +1 */}
                                    {selectedFeat && featBonusCandidates.length > 0 && (
                                        <div className="feat-bonus-picker">
                                            <div className="feat-bonus-header">
                                                <strong>
                                                    Bônus do Talento "{selectedFeat.name}": Escolha +1 em Atributo
                                                    {selectedFeat.grantsSaveProficiency ? ' + Salvaguarda' : ''}
                                                </strong>
                                                <span>
                                                    {featAbilityChoice
                                                        ? `✓ +1 ${ATTR_LABELS[featAbilityChoice].full}`
                                                        : 'Selecione 1 atributo abaixo'}
                                                </span>
                                            </div>
                                            <div className="feat-bonus-options">
                                                {featBonusCandidates.map(attrKey => {
                                                    const curVal = character.attributes[attrKey]?.value || 10;
                                                    const alreadySaved = !!character.attributes[attrKey]?.saveProficiency;
                                                    const atCap = curVal >= featMaxCap && (!selectedFeat.grantsSaveProficiency || alreadySaved);
                                                    const nextVal = Math.min(featMaxCap, curVal + (selectedFeat.abilityBonusAmount || 1));
                                                    const nextMod = calculateModifier(nextVal);
                                                    const isChosen = featAbilityChoice === attrKey;

                                                    return (
                                                        <button
                                                            key={attrKey}
                                                            type="button"
                                                            disabled={atCap}
                                                            className={`feat-bonus-attr-btn ${isChosen ? 'selected' : ''}`}
                                                            onClick={() => setFeatAbilityChoice(attrKey)}
                                                        >
                                                            <span className="attr-code">{ATTR_LABELS[attrKey].short}</span>
                                                            <span className="attr-math">
                                                                {atCap ? `${curVal} (Máx)` : `${curVal} → ${nextVal} (${nextMod >= 0 ? `+${nextMod}` : nextMod})`}
                                                            </span>
                                                            {selectedFeat.grantsSaveProficiency && !alreadySaved && (
                                                                <span className="attr-save-tag">+Save</span>
                                                            )}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* Feats Grid */}
                                    <div className="feat-selector">
                                        {availableFeats.map(feat => {
                                            const isOwned = !feat.repeatable && (character.feats || []).some(cf => cf.id === feat.id);
                                            const isSelected = selectedFeat?.id === feat.id;
                                            return (
                                                <div
                                                    key={feat.id}
                                                    className={`feat-item ${isSelected ? 'selected' : ''} ${isOwned ? 'owned' : ''}`}
                                                    onClick={() => !isOwned && handleSelectFeat(feat)}
                                                >
                                                    <div className="feat-item-top">
                                                        <strong>{feat.name}</strong>
                                                        {isOwned ? (
                                                            <span className="feat-badge-owned">Adquirido</span>
                                                        ) : isSelected ? (
                                                            <Check size={16} color="#ffd700" />
                                                        ) : (
                                                            feat.category && <span className="feat-badge-cat">{feat.category}</span>
                                                        )}
                                                    </div>
                                                    {feat.prerequisite && (
                                                        <div className="feat-prereq">Pré-req: {feat.prerequisite}</div>
                                                    )}
                                                    <p>{isSelected && feat.descriptionFull ? feat.descriptionFull : feat.description}</p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ) : (
                                <div className="asi-selector">
                                    <div className="asi-mode-cards">
                                        <div
                                            className={`asi-mode-card ${asiMode === 'plus2' ? 'selected' : ''}`}
                                            onClick={() => setAsiMode('plus2')}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <strong>Focar (+2 em 1 Atributo)</strong>
                                                {asiMode === 'plus2' && <Check size={16} color="#ffd700" />}
                                            </div>
                                            <span>Aumenta um único atributo em +2 pontos (até o máximo de 20).</span>
                                        </div>

                                        <div
                                            className={`asi-mode-card ${asiMode === 'plus1_plus1' ? 'selected' : ''}`}
                                            onClick={() => setAsiMode('plus1_plus1')}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <strong>Distribuir (+1 em 2 Atributos)</strong>
                                                {asiMode === 'plus1_plus1' && <Check size={16} color="#ffd700" />}
                                            </div>
                                            <span>Aumenta dois atributos diferentes em +1 ponto cada (até o máximo de 20).</span>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '14px 0 10px 0' }}>
                                        <span style={{ fontSize: '0.86rem', color: '#cbd5e1', fontWeight: 600 }}>
                                            {asiMode === 'plus2'
                                                ? 'Clique no atributo que receberá +2:'
                                                : `Clique em 2 atributos diferentes para receberem +1 (${asiSplitAttrs.length}/2 selecionados):`}
                                        </span>
                                        {retroactiveConHpBonus > 0 && (
                                            <span style={{ fontSize: '0.8rem', color: '#4ade80', fontWeight: 700 }}>
                                                +{retroactiveConHpBonus} PV Máximo retroativo por Constituição!
                                            </span>
                                        )}
                                    </div>

                                    <div className="asi-attr-grid">
                                        {ATTR_KEYS.map(key => {
                                            const curVal = character.attributes[key]?.value || 10;
                                            const curMod = calculateModifier(curVal);
                                            const isMaxed = curVal >= 20;

                                            const isSelected = asiMode === 'plus2'
                                                ? asiSingleAttr === key && !isMaxed
                                                : asiSplitAttrs.includes(key);

                                            const bonus = isSelected ? (asiMode === 'plus2' ? 2 : 1) : 0;
                                            const newVal = Math.min(20, curVal + bonus);
                                            const newMod = calculateModifier(newVal);

                                            return (
                                                <button
                                                    key={key}
                                                    type="button"
                                                    disabled={isMaxed}
                                                    className={`asi-attr-card ${isSelected ? 'selected' : ''} ${isMaxed ? 'maxed' : ''}`}
                                                    onClick={() => {
                                                        if (isMaxed) return;
                                                        if (asiMode === 'plus2') {
                                                            setAsiSingleAttr(key);
                                                        } else {
                                                            toggleSplitAsiAttr(key);
                                                        }
                                                    }}
                                                >
                                                    <div className="asi-attr-card-header">
                                                        <span className="asi-attr-short">{ATTR_LABELS[key].short}</span>
                                                        {isMaxed ? (
                                                            <span className="asi-attr-badge max">Máx 20</span>
                                                        ) : isSelected ? (
                                                            <span className="asi-attr-badge active">+{newVal - curVal}</span>
                                                        ) : null}
                                                    </div>
                                                    <div className="asi-attr-fullname">{ATTR_LABELS[key].full}</div>
                                                    <div className="asi-attr-values">
                                                        <span className="cur">{curVal} ({curMod >= 0 ? `+${curMod}` : curMod})</span>
                                                        {isSelected && newVal > curVal && (
                                                            <>
                                                                <ArrowRight size={14} color="#ffd700" />
                                                                <span className="next">{newVal} ({newMod >= 0 ? `+${newMod}` : newMod})</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* 7. FINISH / REVIEW STEP */}
                    {currentStep === 'finish' && (
                        <div>
                            <div className="lvl-overview-hero" style={{ marginBottom: '16px' }}>
                                <div>
                                    <h3 style={{ margin: '0 0 4px 0', color: '#ffd700' }}>Revisão da Evolução para o Nível {newLevel}</h3>
                                    <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.85rem' }}>
                                        Confira todas as melhorias escolhidas e confirme a evolução do seu personagem.
                                    </p>
                                </div>
                                <Star size={32} color="#ffd700" />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
                                <div className="lvl-stat-pill">
                                    <span className="label">Pontos de Vida (HP)</span>
                                    <span className="val">
                                        {character.hp.max} → {character.hp.max + totalHpAdded} (+{totalHpAdded} PV)
                                    </span>
                                    {(retroactiveConHpBonus > 0 || retroactiveFeatHpBonus > 0) && (
                                        <small style={{ color: '#4ade80', marginTop: '2px' }}>
                                            Inclui {retroactiveConHpBonus > 0 ? `+${retroactiveConHpBonus} CON` : ''}
                                            {retroactiveConHpBonus > 0 && retroactiveFeatHpBonus > 0 ? ' e ' : ''}
                                            {retroactiveFeatHpBonus > 0 ? `+${retroactiveFeatHpBonus} Talento` : ''}
                                        </small>
                                    )}
                                </div>
                                <div className="lvl-stat-pill">
                                    <span className="label">Dados de Vida</span>
                                    <span className="val">{newLevel}d{hitDieValue}</span>
                                </div>
                                <div className="lvl-stat-pill">
                                    <span className="label">Bônus de Proficiência</span>
                                    <span className="val">+{profBonus}</span>
                                </div>
                                <div className="lvl-stat-pill">
                                    <span className="label">Novas Habilidades de Classe</span>
                                    <span className="val">{newFeatures.length + (selectedFightingStyle ? 1 : 0) + (selectedInvocation ? 1 : 0)} nova(s)</span>
                                </div>
                            </div>

                            {isAsiLevel && newLevel !== 3 && (
                                <div style={{ marginTop: '14px', background: 'rgba(197, 160, 89, 0.1)', padding: '12px 14px', borderRadius: '6px', border: '1px solid #ffd700' }}>
                                    {progressionType === 'feat' && selectedFeat ? (
                                        <div>
                                            <strong style={{ color: '#ffd700' }}>Talento Adquirido:</strong> {selectedFeat.name}
                                            {featAbilityChoice && (
                                                <span style={{ color: '#4ade80', marginLeft: '8px', fontWeight: 600 }}>
                                                    (+1 {ATTR_LABELS[featAbilityChoice].full}: {character.attributes[featAbilityChoice].value} → {previewAttributes[featAbilityChoice].value}
                                                    {selectedFeat.grantsSaveProficiency ? ' + Salvaguarda' : ''})
                                                </span>
                                            )}
                                        </div>
                                    ) : (
                                        <div>
                                            <strong style={{ color: '#ffd700' }}>Aumento no Valor de Atributo:</strong>{' '}
                                            {asiMode === 'plus2'
                                                ? `+2 ${ATTR_LABELS[asiSingleAttr].full} (${character.attributes[asiSingleAttr].value} → ${previewAttributes[asiSingleAttr].value})`
                                                : asiSplitAttrs.map(k => `+1 ${ATTR_LABELS[k].full} (${character.attributes[k].value} → ${previewAttributes[k].value})`).join(' e ')}
                                        </div>
                                    )}
                                </div>
                            )}

                            {selectedFightingStyle && (
                                <div style={{ marginTop: '12px', background: 'rgba(0,0,0,0.3)', padding: '10px 14px', borderRadius: '6px', border: '1px solid #ffd700' }}>
                                    <strong style={{ color: '#ffd700' }}>Estilo de Luta Escolhido:</strong> {FIGHTING_STYLES.find(f => f.id === selectedFightingStyle)?.name}
                                </div>
                            )}

                            {selectedInvocation && (
                                <div style={{ marginTop: '12px', background: 'rgba(0,0,0,0.3)', padding: '10px 14px', borderRadius: '6px', border: '1px solid #ffd700' }}>
                                    <strong style={{ color: '#ffd700' }}>Invocação Mística:</strong> {WARLOCK_INVOCATIONS.find(i => i.id === selectedInvocation)?.name}
                                </div>
                            )}

                            {selectedSubclass && (
                                <div style={{ marginTop: '12px', background: 'rgba(0,0,0,0.3)', padding: '10px 14px', borderRadius: '6px', border: '1px solid #ffd700' }}>
                                    <strong style={{ color: '#ffd700' }}>Subclasse Escolhida:</strong> {classData?.subclasses?.find(s => s.id === selectedSubclass)?.name || selectedSubclass}
                                </div>
                            )}

                            {selectedNewExpertises.length > 0 && (
                                <div style={{ marginTop: '12px', background: 'rgba(0,0,0,0.3)', padding: '10px 14px', borderRadius: '6px', border: '1px solid #4ade80' }}>
                                    <strong style={{ color: '#4ade80' }}>Novas Especializações (Expertise):</strong> {selectedNewExpertises.join(', ')}
                                </div>
                            )}

                            {selectedSpells.length > 0 && (
                                <div style={{ marginTop: '12px', background: 'rgba(0,0,0,0.3)', padding: '10px 14px', borderRadius: '6px', border: '1px solid #60a5fa' }}>
                                    <strong style={{ color: '#60a5fa' }}>Novas Magias Aprendidas:</strong> {selectedSpells.map(s => s.name).join(', ')}
                                </div>
                            )}
                        </div>
                    )}

                </div>

                {/* Footer */}
                <div className="lvl-footer">
                    <div>
                        {currentStepIdx > 0 && (
                            <button type="button" className="lvl-btn-back" onClick={prevStep}>
                                <ArrowLeft size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                                Voltar
                            </button>
                        )}
                    </div>

                    <div>
                        {currentStepIdx < steps.length - 1 ? (
                            <button
                                type="button"
                                className="lvl-btn-primary"
                                onClick={nextStep}
                                disabled={isNextDisabled}
                            >
                                <span>Avançar</span>
                                <ArrowRight size={14} />
                            </button>
                        ) : (
                            <button
                                type="button"
                                className="lvl-btn-primary"
                                onClick={handleFinish}
                            >
                                <Flame size={16} />
                                <span>Confirmar Evolução do Personagem</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
