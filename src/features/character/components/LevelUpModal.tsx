import React, { useState } from 'react';
import type { Character, ClassFeature, Spell, CharacterAttributes } from '../characterTypes';
import { CLASSES } from '../data/classes';
import { SPELLS } from '../data/spells';
import { FEATS, type Feat } from '../data/feats';
import './LevelUpModal.css';

interface LevelUpModalProps {
    character: Character;
    onUpdate: (char: Character) => void;
    onClose: () => void;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({ character, onUpdate, onClose }) => {
    const newLevel = character.level;
    const classData = CLASSES.find(c => c.id === character.class || c.name === character.class);

    // Steps state
    const [step, setStep] = useState<'summary' | 'hp' | 'spells' | 'feat' | 'finish'>('summary');

    // Choices state
    const [hpChoice, setHpChoice] = useState<'avg' | 'roll'>('avg');
    const [rolledHp, setRolledHp] = useState<number | null>(null);
    const [selectedSpells, setSelectedSpells] = useState<Spell[]>([]);

    // Feat / ASI State
    const [progressionType, setProgressionType] = useState<'feat' | 'asi'>('feat');
    const [selectedFeat, setSelectedFeat] = useState<Feat | null>(null);
    const [asiTargets, setAsiTargets] = useState<{ attr1: keyof CharacterAttributes; attr2: keyof CharacterAttributes | null }>({ attr1: 'str', attr2: null });

    if (!classData) return null;

    // Derived Constants
    const modCon = Math.floor((character.attributes.con.value - 10) / 2);
    const hitDieValue = parseInt(classData.hitDie.replace('d', ''));
    const avgHp = Math.floor(hitDieValue / 2) + 1 + modCon;

    // Features gained this level
    const newFeatures = classData.features.filter(f => f.level === newLevel) as unknown as ClassFeature[];
    const isCaster = !!classData.spellcastingConfig;
    const isAsiLevel = newLevel % 4 === 0 || newLevel === 19; // Basic rule

    // Spell Logic
    const newSpellsCount = 1;

    const handleRollHp = () => {
        const roll = Math.floor(Math.random() * hitDieValue) + 1;
        setRolledHp(roll + modCon);
    };

    const handleConfirmHp = () => {
        // Just move next, we calculate final HP at the end
        if (isCaster) setStep('spells');
        else if (isAsiLevel) setStep('feat');
        else handleFinish();
    };

    const handleFinish = () => {
        // 1. Calculate HP
        const hpGain = hpChoice === 'avg' ? avgHp : (rolledHp || avgHp);
        const newMaxHp = character.hp.max + hpGain;
        const newCurrentHp = character.hp.current + hpGain;

        // 2. Features
        const existingFeatNames = character.features.map(f => f.name);
        const featuresToAdd = newFeatures.filter(f => !existingFeatNames.includes(f.name));

        // 3. Prepare Base
        const finalChar: Character = {
            ...character,
            hp: { ...character.hp, max: newMaxHp, current: newCurrentHp },
            features: [...character.features, ...featuresToAdd],
            pendingLevelUp: false,
            hpRolled: hpChoice === 'roll' ? (rolledHp || avgHp) : false
        };

        // 4. Spells
        if (selectedSpells.length > 0) {
            finalChar.spells = [...finalChar.spells, ...selectedSpells];
        }

        // 5. Feat / ASI
        if (isAsiLevel) {
            if (progressionType === 'feat' && selectedFeat) {
                finalChar.feats = [...finalChar.feats, selectedFeat];
            } else if (progressionType === 'asi') {
                // Apply ASI
                // Deep clone attributes to avoid mutation issues
                const newAttrs = JSON.parse(JSON.stringify(finalChar.attributes));

                // +2 to one or +1 to two?
                if (asiTargets.attr2 === null) {
                    // +2 to attr1
                    newAttrs[asiTargets.attr1].value += 2;
                    newAttrs[asiTargets.attr1].modifier = Math.floor((newAttrs[asiTargets.attr1].value - 10) / 2);
                } else {
                    // +1 to both
                    newAttrs[asiTargets.attr1].value += 1;
                    newAttrs[asiTargets.attr1].modifier = Math.floor((newAttrs[asiTargets.attr1].value - 10) / 2);

                    newAttrs[asiTargets.attr2].value += 1;
                    newAttrs[asiTargets.attr2].modifier = Math.floor((newAttrs[asiTargets.attr2].value - 10) / 2);
                }
                finalChar.attributes = newAttrs;
            }
        }

        onUpdate(finalChar);
        onClose();
    };

    const attrOptions: { key: keyof CharacterAttributes; label: string }[] = [
        { key: 'str', label: 'Força' },
        { key: 'dex', label: 'Destreza' },
        { key: 'con', label: 'Constituição' },
        { key: 'int', label: 'Inteligência' },
        { key: 'wis', label: 'Sabedoria' },
        { key: 'cha', label: 'Carisma' },
    ];

    return (
        <div className="lvl-modal-overlay">
            <div className="lvl-modal">
                <div className="lvl-header">
                    <h2>Nível {newLevel}: {classData.name}</h2>
                </div>

                <div className="lvl-body">
                    {step === 'summary' && (
                        <div className="step-summary">
                            <h3>Parabéns! Você alcançou o nível {newLevel}.</h3>
                            <div className="features-preview">
                                <h4>Novas Habilidades:</h4>
                                {newFeatures.length > 0 ? (
                                    <ul>
                                        {newFeatures.map((f, i) => (
                                            <li key={i}><strong>{f.name}</strong>: {f.description}</li>
                                        ))}
                                    </ul>
                                ) : <p className="text-muted">Nenhuma habilidade de classe automática neste nível.</p>}
                            </div>
                            <button className="lvl-btn" onClick={() => setStep('hp')}>Avançar (HP)</button>
                        </div>
                    )}

                    {step === 'hp' && (
                        <div className="step-hp">
                            <h3>Aumentar Vida</h3>
                            <p>Dado: {classData.hitDie} | Con: {modCon >= 0 ? `+${modCon}` : modCon}</p>

                            <div className="hp-options">
                                <div className={`hp-card ${hpChoice === 'avg' ? 'selected' : ''}`} onClick={() => setHpChoice('avg')}>
                                    <h4>Média Fixa</h4>
                                    <span className="hp-val">+{avgHp} HP</span>
                                    <small className="hp-desc">Valor seguro e garantido. (Recomendado)</small>
                                </div>
                                <div className={`hp-card ${hpChoice === 'roll' ? 'selected' : ''}`} onClick={() => setHpChoice('roll')}>
                                    <h4>Rolar Dado</h4>
                                    {rolledHp === null ? (
                                        <button className="lvl-btn small" onClick={handleRollHp}>Rolar (1d{hitDieValue})</button>
                                    ) : (
                                        <span className="hp-val">+{rolledHp} HP</span>
                                    )}
                                    <small className="hp-desc">Pode ser maior ou menor que a média. (Arriscado)</small>
                                </div>
                            </div>

                            <div style={{ marginTop: '15px', color: '#888', fontStyle: 'italic', fontSize: '0.9rem' }}>
                                Aumentar sua Constituição também aumenta seus pontos de vida retroativamente!
                            </div>

                            <button className="lvl-btn" onClick={handleConfirmHp} disabled={hpChoice === 'roll' && rolledHp === null}>
                                {isCaster || isAsiLevel ? 'Próximo' : 'Concluir'}
                            </button>
                        </div>
                    )}

                    {step === 'spells' && (
                        <div className="step-spells">
                            <h3>Aprender Nova Magia</h3>
                            <p>Selecione 1 nova magia da lista de {classData.name}.</p>

                            <div className="spells-selector-container">
                                <div className="spells-selector">
                                    {SPELLS.filter(s => s.classes.includes(classData.id) && s.level <= Math.ceil(newLevel / 2) && s.level > 0).map(spell => {
                                        const isOwned = character.spells.some(cs => cs.id === spell.id);
                                        const isSelected = selectedSpells.find(s => s.id === spell.id);
                                        return (
                                            <div
                                                key={spell.id}
                                                className={`spell-item ${isSelected ? 'selected' : ''} ${isOwned ? 'disabled' : ''}`}
                                                onClick={() => {
                                                    // Toggle selection logic or preview? 
                                                    // Let's make click = select, but also show details.
                                                    if (isOwned) return;

                                                    if (isSelected) {
                                                        setSelectedSpells(prev => prev.filter(s => s.id !== spell.id));
                                                    } else {
                                                        // Replace selection if limit reached (1)? Or strict limit?
                                                        // Code was allowing array up to count.
                                                        if (selectedSpells.length < newSpellsCount) {
                                                            setSelectedSpells(prev => [...prev, spell]);
                                                        } else {
                                                            // Auto-switch for better UX if count is 1
                                                            if (newSpellsCount === 1) {
                                                                setSelectedSpells([spell]);
                                                            }
                                                        }
                                                    }
                                                }}
                                                onMouseEnter={() => { }} // Could track hover for preview
                                                title={spell.description}
                                            >
                                                <div className="spell-item-header">
                                                    <strong>{spell.name}</strong>
                                                    <span className="spell-level">{spell.level}º</span>
                                                </div>
                                                {isOwned && <small>✔ Aprendido</small>}
                                                {isSelected && <small className="selection-mark">⚡ Selecionado</small>}
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Spell Description Preview */}
                                <div className="spell-preview-pnl">
                                    {selectedSpells.length > 0 ? (
                                        selectedSpells.map(s => (
                                            <div key={s.id} className="preview-card">
                                                <h4>{s.name}</h4>
                                                <div className="spell-meta">
                                                    <span>{s.school}</span> • <span>{s.castingTime}</span> • <span>{s.range}</span>
                                                </div>
                                                <p>{s.description}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="preview-placeholder">
                                            Selecione uma magia para ver os detalhes.
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button
                                className="lvl-btn"
                                onClick={() => isAsiLevel ? setStep('feat') : handleFinish()}
                            >
                                {isAsiLevel ? 'Próximo' : 'Concluir'}
                            </button>
                        </div>
                    )}

                    {step === 'feat' && (
                        <div className="step-feat">
                            <div className="feat-type-selector">
                                <button
                                    className={`fts-btn ${progressionType === 'feat' ? 'active' : ''}`}
                                    onClick={() => setProgressionType('feat')}
                                >
                                    Novo Talento
                                </button>
                                <button
                                    className={`fts-btn ${progressionType === 'asi' ? 'active' : ''}`}
                                    onClick={() => setProgressionType('asi')}
                                >
                                    Melhorar Atributos
                                </button>
                            </div>

                            {progressionType === 'feat' ? (
                                <div className="feat-selector">
                                    {FEATS.map(feat => {
                                        const isOwned = character.feats.some(cf => cf.id === feat.id);
                                        return (
                                            <div
                                                key={feat.id}
                                                className={`feat-item ${selectedFeat?.id === feat.id ? 'selected' : ''} ${isOwned ? 'disabled' : ''}`}
                                                onClick={() => !isOwned && setSelectedFeat(feat)}
                                                style={isOwned ? { opacity: 0.5, pointerEvents: 'none' } : {}}
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
                                                checked={asiTargets.attr2 === null}
                                                onChange={() => setAsiTargets({ attr1: asiTargets.attr1, attr2: null })}
                                            />
                                            Focar (+2 em um)
                                        </label>
                                        <label>
                                            <input
                                                type="radio"
                                                checked={asiTargets.attr2 !== null}
                                                onChange={() => {
                                                    const second = attrOptions.find(o => o.key !== asiTargets.attr1)?.key || 'dex';
                                                    setAsiTargets({ attr1: asiTargets.attr1, attr2: second });
                                                }}
                                            />
                                            Distribuir (+1 em dois)
                                        </label>
                                    </div>

                                    <div className="asi-controls">
                                        <div className="asi-row">
                                            <span>Atributo 1:</span>
                                            <select
                                                value={asiTargets.attr1}
                                                onChange={e => setAsiTargets({ ...asiTargets, attr1: e.target.value as keyof CharacterAttributes })}
                                            >
                                                {attrOptions.map(o => (
                                                    <option key={o.key} value={o.key}>{o.label} ({character.attributes[o.key].value})</option>
                                                ))}
                                            </select>
                                            <span className="badge">+{asiTargets.attr2 === null ? 2 : 1}</span>
                                        </div>

                                        {asiTargets.attr2 !== null && (
                                            <div className="asi-row">
                                                <span>Atributo 2:</span>
                                                <select
                                                    value={asiTargets.attr2}
                                                    onChange={e => setAsiTargets({ ...asiTargets, attr2: e.target.value as keyof CharacterAttributes })}
                                                >
                                                    {attrOptions.filter(o => o.key !== asiTargets.attr1).map(o => (
                                                        <option key={o.key} value={o.key}>{o.label} ({character.attributes[o.key].value})</option>
                                                    ))}
                                                </select>
                                                <span className="badge">+1</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            <button className="lvl-btn" onClick={() => handleFinish()}>Concluir Evolução</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

