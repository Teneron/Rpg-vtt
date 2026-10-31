import React, { useState, useMemo } from 'react';
import type { Character, Spell, Skill, CharacterAttributes } from '../characterTypes';
import { regenerateCharacterStats, calculateModifier, XP_TABLE } from '../characterTypes';
import { CLASSES } from '../data/classes';
import { SPELLS } from '../data/spells';
import { FEATS, type Feat } from '../data/feats';
import { playSynthSound } from '../../audio/audioSynth';
import {
    getSpellSlotsForLevel,
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
    Flame
} from 'lucide-react';
import './LevelUpModal.css';

interface LevelUpModalProps {
    character: Character;
    onUpdate: (char: Character) => void;
    onClose: () => void;
}

// 8 Estilos de Luta Oficiais (D&D 5.5e / 2024 & 5e)
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
        description: 'Ao tirar 1 ou 2 em qualquer dado de dano com arma de duas mãos ou versátil empunhada com ambas as mãos, você pode re-rolar o dado.'
    },
    {
        id: 'two_weapon',
        name: 'Combate com Duas Armas (Two-Weapon)',
        category: 'Duas Armas',
        description: 'Você adiciona seu modificador de atributo à jogada de dano do ataque adicional realizado com a mão inábil.'
    },
    {
        id: 'protection',
        name: 'Proteção (Protection)',
        category: 'Suporte & Reação',
        description: 'Quando uma criatura que você vê ataca um aliado a até 1,5m, use sua Reação para impor Desvantagem no ataque (exige escudo).'
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
    }
];

import { WARLOCK_INVOCATIONS } from '../data/warlockInvocations';
export { WARLOCK_INVOCATIONS };

export const LevelUpModal: React.FC<LevelUpModalProps> = ({ character, onUpdate, onClose }) => {
    const newLevel = character.level;
    const classData = useMemo(() => {
        return CLASSES.find(c => c.id === character.class || c.name === character.class) || CLASSES[0];
    }, [character.class]);

    const classNameLower = (classData?.name || character.class || '').toLowerCase();
    const isFighter = /guerreiro|fighter/i.test(classNameLower);
    const isPaladin = /paladino|paladin/i.test(classNameLower);
    const isRanger = /guardi[ãa]o|ranger/i.test(classNameLower);
    const isWarlock = /bruxo|warlock/i.test(classNameLower);
    const isBard = /bardo|bard/i.test(classNameLower);
    const isRogue = /ladino|rogue/i.test(classNameLower);
    const isWizard = /mago|wizard/i.test(classNameLower);
    const isCaster = !!classData?.spellcastingConfig || isPaladin || isRanger;
    const isAsiLevel = checkIsAsiLevel(classData?.id || character.class, newLevel);

    const hasFightingStyleChoice = (isFighter && newLevel === 2) || (isPaladin && newLevel === 2) || (isRanger && newLevel === 2);
    const hasInvocationChoice = isWarlock && (newLevel === 2 || newLevel === 5 || newLevel === 7 || newLevel === 9 || newLevel === 12 || newLevel === 15 || newLevel === 18);
    const subclassLevel = getSubclassLevel(classData?.id || character.class);
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
            list.push({ id: 'skills', label: `${list.length + 1}. Especialização (Expertise)` });
        }
        if (hasClassSpecialChoice) {
            list.push({ id: 'choices', label: `${list.length + 1}. Escolha de Classe` });
        }
        if (isCaster) {
            list.push({ id: 'spells', label: `${list.length + 1}. Magias` });
        }
        if (isAsiLevel) {
            list.push({ id: 'feat', label: `${list.length + 1}. Talento / Atributos` });
        }
        list.push({ id: 'finish', label: `${list.length + 1}. Concluir` });
        return list;
    }, [allowedExpertiseGains, hasClassSpecialChoice, isCaster, isAsiLevel]);

    const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
    const currentStep = steps[currentStepIdx]?.id || 'summary';

    // HP State
    const [hpChoice, setHpChoice] = useState<'avg' | 'roll'>('avg');
    const [rolledHp, setRolledHp] = useState<number | null>(null);

    // Expertise Selection State (gained only at official milestone levels)
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
    const [spellSearch, setSpellSearch] = useState<string>('');
    const maxSpellsAllowed = isWizard ? 2 : 1;

    // Feat / ASI State
    const [progressionType, setProgressionType] = useState<'feat' | 'asi'>('feat');
    const [selectedFeat, setSelectedFeat] = useState<Feat | null>(null);
    const [asiTargets, setAsiTargets] = useState<{ attr1: keyof CharacterAttributes; attr2: keyof CharacterAttributes | null }>({ attr1: 'str', attr2: null });

    // Derived Math
    const modCon = Math.floor((character.attributes.con.value - 10) / 2);
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
    const avgHp = Math.max(1, Math.floor(hitDieValue / 2) + 1 + modCon + totalBonus);
    const finalHpGain = hpChoice === 'avg' ? avgHp : (rolledHp !== null ? rolledHp : avgHp);

    const isNewToughSelected = isAsiLevel && newLevel !== 3 && progressionType === 'feat' && selectedFeat?.id === 'tough' && !(character.feats || []).some(f => f.id === 'tough');
    const retroactiveHpBonus = isNewToughSelected ? 2 * newLevel : 0;

    const profBonus = getProficiencyBonus(newLevel);
    const newFeatures = getFeaturesForLevel(classData?.id || character.class, newLevel);

    // Roll HP Handler
    const handleRollHp = () => {
        const roll = Math.floor(Math.random() * hitDieValue) + 1;
        const total = Math.max(1, roll + modCon + totalBonus);
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
            if (progressionType === 'feat') return !selectedFeat;
            if (progressionType === 'asi') return !asiTargets.attr1 || !asiTargets.attr2;
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
        asiTargets
    ]);

    // Finish & Apply Progression
    const handleFinish = () => {
        // 1. HP Updates (including retroactive HP from new Tough feat if chosen at this level)
        const newMaxHp = character.hp.max + finalHpGain + retroactiveHpBonus;
        const newCurrentHp = character.hp.current + finalHpGain + retroactiveHpBonus;

        // 2. Hit Dice Updates
        const updatedHitDice = {
            dieFace: classData?.hitDie || character.hitDice?.dieFace || 'd8',
            max: newLevel,
            current: Math.min(newLevel, (character.hitDice?.current || 1) + 1)
        };

        // 3. Features
        const existingNames = new Set((character.features || []).map(f => f.name));
        const featuresToAdd = newFeatures.filter(f => !existingNames.has(f.name));

        // Add special choices as features if selected
        if (hasFightingStyleChoice && selectedFightingStyle) {
            const fs = FIGHTING_STYLES.find(f => f.id === selectedFightingStyle);
            if (fs && !existingNames.has(fs.name)) {
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
            if (inv && !existingNames.has(inv.name)) {
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

        // Add Subclass features (both for newly chosen subclass and future milestone levels)
        const activeSubclassName = finalSubclassName;
        const matchedSubclass = classData?.subclasses?.find(
            s => s.name === activeSubclassName || s.id === activeSubclassName || s.id === selectedSubclass
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

        // 4. Spell Slots calculation from official 1 to 20 progression
        const updatedSpellSlots = getSpellSlotsForLevel(classData?.id || character.class, newLevel);

        // 5. Class Resources calculation from official 1 to 20 progression (including Subclass)
        const updatedResources = getClassResourcesForLevel(
            classData?.id || character.class,
            newLevel,
            character.classResources,
            character.attributes.cha ? character.attributes.cha.modifier : 1,
            finalSubclassName
        );

        // 6. Recalculate Skills with new Proficiency Bonus and newly chosen expertises
        const updatedSkills: Skill[] = (character.skills || []).map(s => {
            const isNewlyExpert = selectedNewExpertises.includes(s.name);
            const hasExpertise = !!s.expertise || isNewlyExpert;
            const attrMod = character.attributes[s.attribute]?.modifier ?? 0;
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
            experience: XP_TABLE[isEndOfQueue ? newLevel : newLevel + 1] || character.experience,
            nextLevelExperience: XP_TABLE[isEndOfQueue ? newLevel + 1 : newLevel + 2] || character.nextLevelExperience,
            pendingLevelUp: !isEndOfQueue,
            levelUpTarget: isEndOfQueue ? undefined : targetLevel,
            hp: { ...character.hp, max: newMaxHp, current: newCurrentHp },
            hitDice: updatedHitDice,
            skills: updatedSkills,
            features: [...(character.features || []), ...featuresToAdd],
            subclass: finalSubclassName,
            spellSlots: updatedSpellSlots,
            classResources: updatedResources,
            hpRolled: hpChoice === 'roll' ? finalHpGain : false
        };

        // 7. Add Selected Spells & Subclass Granted Spells
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

        // 8. Add Feat / ASI if applicable (STRICT: Never applied at Level 3 or non-ASI levels)
        if (isAsiLevel && newLevel !== 3) {
            if (progressionType === 'feat' && selectedFeat) {
                nextChar.feats = [...(character.feats || []), selectedFeat];
            } else if (progressionType === 'asi') {
                const newAttrs = JSON.parse(JSON.stringify(nextChar.attributes));
                if (asiTargets.attr2 === null) {
                    newAttrs[asiTargets.attr1].value = Math.min(20, (newAttrs[asiTargets.attr1].value || 10) + 2);
                    newAttrs[asiTargets.attr1].modifier = calculateModifier(newAttrs[asiTargets.attr1].value);
                } else {
                    newAttrs[asiTargets.attr1].value = Math.min(20, (newAttrs[asiTargets.attr1].value || 10) + 1);
                    newAttrs[asiTargets.attr1].modifier = calculateModifier(newAttrs[asiTargets.attr1].value);
                    if (asiTargets.attr2) {
                        newAttrs[asiTargets.attr2].value = Math.min(20, (newAttrs[asiTargets.attr2].value || 10) + 1);
                        newAttrs[asiTargets.attr2].modifier = calculateModifier(newAttrs[asiTargets.attr2].value);
                    }
                }
                nextChar.attributes = newAttrs;
            }
        }

        // Regenerate derived stats (AC, DC, PB, attacks)
        const finalChar = regenerateCharacterStats(nextChar);

        playSynthSound('crit');
        onUpdate(finalChar);
        if (isEndOfQueue) {
            onClose();
        } else {
            setCurrentStepIdx(0);
            setSelectedSpells([]);
            setSelectedFeat(null);
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
                                        Seu personagem cresce em poder, desbloqueando novos dados de vida, perícias aprimoradas e recursos de combate.
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
                                    <span className="val">{modCon >= 0 ? `+${modCon}` : modCon}</span>
                                </div>
                            </div>

                            {hasSubclassChoice && (
                                <div style={{
                                    marginTop: '16px',
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
                                        Nenhuma habilidade de classe automática neste nível.
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
                                Escolha se prefere o aumento seguro pela média fixa ou arriscar uma rolagem física de dado (1d{hitDieValue}).
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
                                        Metade do dado ({Math.floor(hitDieValue / 2) + 1}) + Mod. Con ({modCon >= 0 ? `+${modCon}` : modCon})
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
                                        <span className="lvl-hp-val">+{rolledHp} PV</span>
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
                                        Resultado do d{hitDieValue} + Mod. Con ({modCon >= 0 ? `+${modCon}` : modCon})
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
                                        {character.hp.max + finalHpGain} (+{finalHpGain})
                                    </strong>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 3. SKILLS & EXPERTISE STEP (Only active on official Expertise milestone levels) */}
                    {currentStep === 'skills' && (
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                <div>
                                    <h3 style={{ margin: 0, color: '#ffd700' }}>Especialização em Perícias (Expertise)</h3>
                                    <p style={{ margin: '4px 0 0 0', color: '#94a3b8', fontSize: '0.85rem' }}>
                                        {isBard && newLevel === 2 ? 'Bardo Nível 2: Escolha 2 perícias treinadas para Especialização (dobra o bônus de proficiência).' :
                                         isBard && newLevel === 9 ? 'Bardo Nível 9: Escolha 2 perícias treinadas adicionais para Especialização.' :
                                         isRanger && newLevel === 2 ? 'Guardião Nível 2 (Explorador Nato): Escolha 1 perícia treinada para Especialização.' :
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

                                        const attrMod = character.attributes[skill.attribute]?.modifier ?? 0;
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
                                                            title={isSelected ? 'Clique para remover especialização' : 'Clique para conceder especialização'}
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

                    {/* 4. CLASS CHOICES STEP (FIGHTING STYLE / INVOCATIONS / SUBCLASSES) */}
                    {currentStep === 'choices' && (
                        <div>
                            {hasFightingStyleChoice && (
                                <div>
                                    <h3 style={{ margin: '0 0 6px 0', color: '#ffd700' }}>Escolha um Estilo de Luta</h3>
                                    <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '14px' }}>
                                        No 2º nível, {classData?.name} adota uma postura marcial especializada para combate.
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
                                        No 2º nível, seu patrono concede fragmentos de poder oculto e segredos eldritch.
                                    </p>

                                    <div className="lvl-choices-grid">
                                        {WARLOCK_INVOCATIONS.filter(inv => inv.minLevel <= newLevel).map(inv => {
                                            const isSelected = selectedInvocation === inv.id;
                                            return (
                                                <div
                                                    key={inv.id}
                                                    className={`lvl-choice-card ${isSelected ? 'selected' : ''}`}
                                                    onClick={() => setSelectedInvocation(inv.id)}
                                                >
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <h4>{inv.name}</h4>
                                                        {isSelected && <Check size={16} color="#ffd700" />}
                                                    </div>
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
                                            Escolha sua Subclasse (3º Nível)
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
                                        Selecione o arquétipo definitivo da sua classe ({classData?.name || character.class}). Esta escolha desbloqueia características exclusivas e define seu estilo de jogo no D&D 5.5e.
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
                                                        gap: '8px',
                                                        transition: 'all 0.2s ease'
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
                                                            <span style={{ fontSize: '0.75rem', color: '#ffd700', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
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
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                <div>
                                    <h3 style={{ margin: 0, color: '#ffd700' }}>Aprender Novas Magias</h3>
                                    <p style={{ margin: '4px 0 0 0', color: '#94a3b8', fontSize: '0.85rem' }}>
                                        Selecione até {maxSpellsAllowed} nova(s) magia(s) para o seu repertório/grimório. (Selecionadas: {selectedSpells.length}/{maxSpellsAllowed})
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
                                        fontSize: '0.82rem'
                                    }}
                                />
                            </div>

                            <div className="lvl-spells-layout">
                                <div className="lvl-spells-picker">
                                    {SPELLS
                                        .filter(s => s.classes.includes(classData?.id) && s.level <= Math.ceil(newLevel / 2) && s.level > 0)
                                        .filter(s => !spellSearch || s.name.toLowerCase().includes(spellSearch.toLowerCase()) || s.school.toLowerCase().includes(spellSearch.toLowerCase()))
                                        .map(spell => {
                                            const isOwned = (character.spells || []).some(cs => cs.id === spell.id);
                                            const isSelected = selectedSpells.some(s => s.id === spell.id);
                                            return (
                                                <div
                                                    key={spell.id}
                                                    className={`lvl-spell-row ${isSelected ? 'selected' : ''}`}
                                                    style={isOwned ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                                                    onClick={() => {
                                                        if (isOwned) return;
                                                        if (isSelected) {
                                                            setSelectedSpells(prev => prev.filter(s => s.id !== spell.id));
                                                        } else {
                                                            if (selectedSpells.length < maxSpellsAllowed) {
                                                                setSelectedSpells(prev => [...prev, spell]);
                                                            } else if (maxSpellsAllowed === 1) {
                                                                setSelectedSpells([spell]);
                                                            }
                                                        }
                                                    }}
                                                >
                                                    <div>
                                                        <strong style={{ display: 'block', fontSize: '0.88rem' }}>{spell.name}</strong>
                                                        <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{spell.level}º Círculo • {spell.school}</span>
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
                                    {selectedSpells.length > 0 ? (
                                        <div>
                                            <h4 style={{ margin: '0 0 4px 0', color: '#ffd700' }}>{selectedSpells[selectedSpells.length - 1].name}</h4>
                                            <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '8px' }}>
                                                {selectedSpells[selectedSpells.length - 1].school} • Tempo: {selectedSpells[selectedSpells.length - 1].castingTime} • Alcance: {selectedSpells[selectedSpells.length - 1].range}
                                            </div>
                                            <p style={{ fontSize: '0.82rem', color: '#e2e8f0', lineHeight: 1.5 }}>
                                                {selectedSpells[selectedSpells.length - 1].description}
                                            </p>
                                        </div>
                                    ) : (
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
                        <div>
                            <div className="feat-type-selector">
                                <button
                                    type="button"
                                    className={`fts-btn ${progressionType === 'feat' ? 'active' : ''}`}
                                    onClick={() => setProgressionType('feat')}
                                >
                                    Novo Talento
                                </button>
                                <button
                                    type="button"
                                    className={`fts-btn ${progressionType === 'asi' ? 'active' : ''}`}
                                    onClick={() => setProgressionType('asi')}
                                >
                                    Aumento no Atributo (+2 ou +1/+1)
                                </button>
                            </div>

                            {progressionType === 'feat' ? (
                                <div className="feat-selector">
                                    {FEATS.map(feat => {
                                        const isOwned = (character.feats || []).some(cf => cf.id === feat.id);
                                        const isSelected = selectedFeat?.id === feat.id;
                                        return (
                                            <div
                                                key={feat.id}
                                                className={`feat-item ${isSelected ? 'selected' : ''}`}
                                                style={isOwned ? { opacity: 0.5, pointerEvents: 'none' } : {}}
                                                onClick={() => !isOwned && setSelectedFeat(feat)}
                                            >
                                                <strong>{feat.name}</strong> {isOwned && <small>(Adquirido)</small>}
                                                <p>{feat.description}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="asi-selector">
                                    <p>Escolha aumentar um atributo em +2 ou dois atributos em +1.</p>
                                    <div className="asi-mode-toggle">
                                        <label>
                                            <input
                                                type="radio"
                                                name="asi_mode"
                                                checked={asiTargets.attr2 === null}
                                                onChange={() => setAsiTargets({ attr1: asiTargets.attr1, attr2: null })}
                                            />
                                            Focar (+2 em um)
                                        </label>
                                        <label>
                                            <input
                                                type="radio"
                                                name="asi_mode"
                                                checked={asiTargets.attr2 !== null}
                                                onChange={() => setAsiTargets({ attr1: asiTargets.attr1, attr2: 'dex' })}
                                            />
                                            Distribuir (+1 em dois)
                                        </label>
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
                                        Confira as melhorias e confirme a evolução do seu personagem.
                                    </p>
                                </div>
                                <Star size={32} color="#ffd700" />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
                                <div className="lvl-stat-pill">
                                    <span className="label">Pontos de Vida (HP)</span>
                                    <span className="val">
                                        {character.hp.max} → {character.hp.max + finalHpGain + retroactiveHpBonus} (+{finalHpGain + retroactiveHpBonus} PV
                                        {retroactiveHpBonus > 0 ? ` [inclui +${retroactiveHpBonus} de Vigoroso retroativo]` : ''})
                                    </span>
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

                            {selectedFightingStyle && (
                                <div style={{ marginTop: '14px', background: 'rgba(0,0,0,0.3)', padding: '10px 14px', borderRadius: '6px', border: '1px solid #ffd700' }}>
                                    <strong style={{ color: '#ffd700' }}>Estilo de Luta Escolhido:</strong> {FIGHTING_STYLES.find(f => f.id === selectedFightingStyle)?.name}
                                </div>
                            )}

                            {selectedInvocation && (
                                <div style={{ marginTop: '14px', background: 'rgba(0,0,0,0.3)', padding: '10px 14px', borderRadius: '6px', border: '1px solid #ffd700' }}>
                                    <strong style={{ color: '#ffd700' }}>Invocação Mística:</strong> {WARLOCK_INVOCATIONS.find(i => i.id === selectedInvocation)?.name}
                                </div>
                            )}

                            {selectedSubclass && (
                                <div style={{ marginTop: '14px', background: 'rgba(0,0,0,0.3)', padding: '10px 14px', borderRadius: '6px', border: '1px solid #ffd700' }}>
                                    <strong style={{ color: '#ffd700' }}>Subclasse Escolhida:</strong> {classData?.subclasses?.find(s => s.id === selectedSubclass)?.name || selectedSubclass}
                                </div>
                            )}

                            {selectedNewExpertises.length > 0 && (
                                <div style={{ marginTop: '14px', background: 'rgba(0,0,0,0.3)', padding: '10px 14px', borderRadius: '6px', border: '1px solid #4ade80' }}>
                                    <strong style={{ color: '#4ade80' }}>Novas Especializações (Expertise):</strong> {selectedNewExpertises.join(', ')}
                                </div>
                            )}

                            {selectedSpells.length > 0 && (
                                <div style={{ marginTop: '14px', background: 'rgba(0,0,0,0.3)', padding: '10px 14px', borderRadius: '6px', border: '1px solid #60a5fa' }}>
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
