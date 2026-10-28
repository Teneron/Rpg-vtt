import React, { useState, useEffect } from 'react';
import { CLASSES, type ClassData } from '../data/classes';
import { CLASS_PROGRESSIONS, type FullClassProgression } from '../data/classProgressions';
import { CLASS_FEATURE_DESCRIPTIONS, type FeatureRuleInfo } from '../data/classFeatureDescriptions';
import { Table, Wand2, Shield, BookOpen, Dices, Star, Swords } from 'lucide-react';
import './ClassProgression.css';

interface ClassProgressionProps {
    classData: ClassData;
    characterLevel?: number;
    onClose: () => void;
}

export const ClassProgression: React.FC<ClassProgressionProps> = ({ classData, characterLevel, onClose }) => {
    const isWitcher = classData.system === 'witcher';
    const availableClasses = React.useMemo(() => {
        return CLASSES.filter(c => isWitcher ? c.system === 'witcher' : c.system !== 'witcher');
    }, [isWitcher]);

    const [selectedClassId, setSelectedClassId] = useState<string>(classData.id);
    const activeClass: ClassData = availableClasses.find(c => c.id === selectedClassId) || classData;
    const [activeTab, setActiveTab] = useState<'full' | 'spells' | 'subclasses' | 'compendium'>('full');
    const [selectedFeature, setSelectedFeature] = useState<{ name: string; info: FeatureRuleInfo } | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const progression: FullClassProgression | undefined = CLASS_PROGRESSIONS[activeClass.id];

    // Close on Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (selectedFeature) {
                    setSelectedFeature(null);
                } else {
                    onClose();
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedFeature, onClose]);

    const getProficiencyBonus = (level: number) => {
        return Math.ceil(1 + (level / 4));
    };

    const handleFeatureClick = (featureName: string) => {
        const trimmed = featureName.trim();
        // Lookup in dictionary
        let found = CLASS_FEATURE_DESCRIPTIONS[trimmed];
        if (!found) {
            // Partial match
            const key = Object.keys(CLASS_FEATURE_DESCRIPTIONS).find(k => k.toLowerCase() === trimmed.toLowerCase() || trimmed.toLowerCase().includes(k.toLowerCase()));
            if (key) found = CLASS_FEATURE_DESCRIPTIONS[key];
        }

        if (!found && activeClass.features) {
            const classFeat = activeClass.features.find(f => f.name.toLowerCase().includes(trimmed.toLowerCase()) || trimmed.toLowerCase().includes(f.name.toLowerCase()));
            if (classFeat) {
                found = {
                    name: classFeat.name,
                    type: classFeat.type,
                    description: classFeat.description
                };
            }
        }

        if (found) {
            setSelectedFeature({ name: trimmed, info: found });
        } else {
            setSelectedFeature({
                name: trimmed,
                info: {
                    name: trimmed,
                    type: 'passive',
                    description: `Habilidade de classe concedida no nível indicado. Consulte os detalhes no Livro do Jogador (D&D 5.5e) ou nas regras de campanha.`
                }
            });
        }
    };

    // Columns for the full table
    const columns = progression?.columns || [];
    const rows = progression?.rows || Array.from({ length: 20 }, (_, i) => {
        const level = i + 1;
        const features = activeClass.features.filter(f => f.level === level).map(f => f.name);
        return {
            level,
            pb: `+${getProficiencyBonus(level)}`,
            features,
            values: {}
        };
    });

    const isCaster = progression?.hasSpellcasting || activeClass.spellcastingConfig !== undefined;

    // Filtered features for compendium tab
    const compendiumEntries = React.useMemo(() => {
        const entries: Array<{ level: number; name: string; info: FeatureRuleInfo }> = [];
        const seen = new Set<string>();

        rows.forEach(r => {
            r.features.forEach(fName => {
                const clean = fName.trim();
                if (clean && !seen.has(clean) && clean !== '—') {
                    seen.add(clean);
                    const info = CLASS_FEATURE_DESCRIPTIONS[clean] || {
                        name: clean,
                        type: 'passive',
                        description: activeClass.features?.find(f => f.name.toLowerCase().includes(clean.toLowerCase()))?.description || 'Habilidade oficial de classe de D&D 5.5e.'
                    };
                    entries.push({ level: r.level, name: clean, info });
                }
            });
        });

        if (!searchTerm.trim()) return entries;
        const term = searchTerm.toLowerCase();
        return entries.filter(e => e.name.toLowerCase().includes(term) || e.info.description.toLowerCase().includes(term));
    }, [rows, activeClass, searchTerm]);

    return (
        <div className="class-progression-overlay" onClick={onClose}>
            <div className="class-progression-modal" onClick={e => e.stopPropagation()}>
                
                {/* HEADER */}
                <div className="class-progression-header">
                    <div className="class-header-left">
                        <span className="class-header-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {activeClass.system === 'witcher' ? <Shield size={24} color="#c5a059" /> : <Swords size={24} color="#f43f5e" />}
                        </span>
                        <div>
                            <h2>Tabela de Progressão: {activeClass.name}</h2>
                            <div className="class-badges-row">
                                <span className="meta-badge hit-die" title="Dado de Vida" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Dices size={12} />
                                    <span>{progression?.hitDie || activeClass.hitDie}</span>
                                </span>
                                <span className="meta-badge ability" title="Atributo Primário" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Star size={12} />
                                    <span>{progression?.primaryAbility || activeClass.primaryAbility}</span>
                                </span>
                                <span className="meta-badge saves" title="Salvaguardas" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Shield size={12} />
                                    <span>{progression?.savingThrows ? progression.savingThrows.join(', ') : activeClass.savingThrows?.join(', ')}</span>
                                </span>
                                {isWitcher ? (
                                    <span className="meta-badge universe-witcher">The Witcher</span>
                                ) : (
                                    <span className="meta-badge universe-dnd">D&D 5.5e</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="class-header-right" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div className="class-selector-box" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '0.82rem', color: '#c5a059', fontWeight: 'bold' }}>Classe:</span>
                            <select
                                className="class-selector-select"
                                value={selectedClassId}
                                onChange={(e) => {
                                    setSelectedClassId(e.target.value);
                                    setActiveTab('full');
                                }}
                                style={{
                                    background: '#151522',
                                    color: '#ffd700',
                                    border: '1px solid rgba(255, 215, 0, 0.4)',
                                    padding: '6px 12px',
                                    borderRadius: '6px',
                                    fontSize: '0.9rem',
                                    fontWeight: 'bold',
                                    cursor: 'pointer'
                                }}
                            >
                                {availableClasses.map(c => (
                                    <option key={c.id} value={c.id}>
                                        {c.name} ({c.hitDie})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button className="close-btn" onClick={onClose} title="Fechar (Esc)">&times;</button>
                    </div>
                </div>

                {/* NAVIGATION TABS */}
                <div className="progression-tabs-bar">
                    <button
                        className={`tab-btn ${activeTab === 'full' ? 'active' : ''}`}
                        onClick={() => setActiveTab('full')}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                        <Table size={14} />
                        <span>Tabela Completa (Níveis 1–20)</span>
                    </button>
                    {isCaster && (
                        <button
                            className={`tab-btn ${activeTab === 'spells' ? 'active' : ''}`}
                            onClick={() => setActiveTab('spells')}
                            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                        >
                            <Wand2 size={14} />
                            <span>Matriz de Espaços de Magia</span>
                        </button>
                    )}
                    {progression?.subclasses && progression.subclasses.length > 0 && (
                        <button
                            className={`tab-btn ${activeTab === 'subclasses' ? 'active' : ''}`}
                            onClick={() => setActiveTab('subclasses')}
                            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                        >
                            <Shield size={14} />
                            <span>Subclasses ({progression.subclasses.length})</span>
                        </button>
                    )}
                    <button
                        className={`tab-btn ${activeTab === 'compendium' ? 'active' : ''}`}
                        onClick={() => setActiveTab('compendium')}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                        <BookOpen size={14} />
                        <span>Compêndio de Habilidades</span>
                    </button>
                </div>

                {/* CONTENT AREA */}
                <div className="class-progression-content">
                    
                    {/* TAB 1: TABELA GERAL COMPLETA */}
                    {activeTab === 'full' && (
                        <div className="table-responsive-wrapper">
                            <table className="progression-table">
                                <thead>
                                    <tr>
                                        <th className="level-col">Nível</th>
                                        <th className="pb-col">Bônus Prof.</th>
                                        <th className="features-col-header">Características de Classe</th>
                                        {columns.map(col => (
                                            <th
                                                key={col.key}
                                                className={`resource-col-header ${col.isSpellSlot ? 'spell-col' : ''}`}
                                                style={{ textAlign: col.align || 'center' }}
                                                title={col.tooltip || col.label}
                                            >
                                                {col.label}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.map(row => {
                                        const isCurrentLevel = characterLevel === row.level;
                                        return (
                                            <tr
                                                key={row.level}
                                                className={`progression-row ${isCurrentLevel ? 'current-level-row' : ''}`}
                                            >
                                                <td className="level-col">
                                                    <span className="level-pill">{row.level}</span>
                                                    {isCurrentLevel && <span className="current-level-tag">Atual</span>}
                                                </td>
                                                <td className="pb-col">{row.pb}</td>
                                                <td className="features-cell">
                                                    {row.features.length > 0 ? (
                                                        <div className="features-tags-list">
                                                            {row.features.map((featName, fIdx) => (
                                                                <button
                                                                    key={fIdx}
                                                                    type="button"
                                                                    className="feature-badge"
                                                                    onClick={() => handleFeatureClick(featName)}
                                                                    title="Clique para ler o efeito completo"
                                                                >
                                                                    {featName}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <span className="no-features">—</span>
                                                    )}
                                                </td>
                                                {columns.map(col => {
                                                    const val = row.values ? row.values[col.key] : '—';
                                                    const isBlank = !val || val === '—';
                                                    return (
                                                        <td
                                                            key={col.key}
                                                            className={`resource-cell ${col.isSpellSlot ? 'spell-slot-cell' : ''} ${isBlank ? 'cell-empty' : 'cell-active'}`}
                                                            style={{ textAlign: col.align || 'center' }}
                                                        >
                                                            {val || '—'}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* TAB 2: MATRIZ DE ESPAÇOS DE MAGIA (SE FOR CONJURADOR) */}
                    {activeTab === 'spells' && isCaster && (
                        <div className="spellcasting-tab-view">
                            <div className="spell-matrix-callout">
                                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Wand2 size={18} color="#a855f7" />
                                    <span>Progressão de Conjuração: {activeClass.name}</span>
                                </h3>
                                <p>
                                    Como conjurador, você utiliza sua reserva de magia para canalizar magias preparadas.
                                    Espaços de magia são recuperados após um Descanso Longo (ou Descanso Curto para Bruxos).
                                </p>
                            </div>

                            <div className="table-responsive-wrapper">
                                <table className="progression-table spell-matrix-table">
                                    <thead>
                                        <tr>
                                            <th className="level-col">Nível</th>
                                            <th className="pb-col">Bônus</th>
                                            {columns.filter(c => c.isSpellSlot || c.key.includes('cantrips') || c.key.includes('prepSpells') || c.key.includes('pactSlots') || c.key.includes('slotLevel')).map(col => (
                                                <th key={col.key} title={col.tooltip || col.label}>
                                                    {col.label}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rows.map(row => (
                                            <tr key={row.level} className={characterLevel === row.level ? 'current-level-row' : ''}>
                                                <td className="level-col">{row.level}</td>
                                                <td className="pb-col">{row.pb}</td>
                                                {columns.filter(c => c.isSpellSlot || c.key.includes('cantrips') || c.key.includes('prepSpells') || c.key.includes('pactSlots') || c.key.includes('slotLevel')).map(col => {
                                                    const val = row.values ? row.values[col.key] : '—';
                                                    return (
                                                        <td key={col.key} className={val && val !== '—' ? 'spell-val-active' : 'cell-empty'}>
                                                            {val || '—'}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* TAB 3: SUBCLASSES */}
                    {activeTab === 'subclasses' && (activeClass.subclasses || progression?.subclasses) && (
                        <div className="subclasses-grid">
                            {(activeClass.subclasses || []).map(sub => (
                                <div key={sub.id} className="subclass-card">
                                    <div className="subclass-card-header">
                                        <span className="subclass-icon" style={{ display: 'flex', alignItems: 'center' }}>
                                            <Shield size={16} color="#c5a059" />
                                        </span>
                                        <div>
                                            <h4>{sub.name}</h4>
                                            <span className="milestones-pill">
                                                Subclasse Oficial D&D 5.5e
                                            </span>
                                        </div>
                                    </div>
                                    <p className="subclass-desc" style={{ marginBottom: '10px' }}>{sub.description}</p>
                                    {sub.features && sub.features.length > 0 && (
                                        <div style={{ marginTop: '8px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '8px' }}>
                                            <strong style={{ fontSize: '0.8rem', color: '#c5a059', display: 'block', marginBottom: '6px' }}>Habilidades Concedidas:</strong>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                                {sub.features.map(f => (
                                                    <div key={f.name} style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: '1.3' }}>
                                                        <strong style={{ color: '#ffd700' }}>Nv {f.level} - {f.name}:</strong> {f.description}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* TAB 4: COMPÊNDIO DE HABILIDADES */}
                    {activeTab === 'compendium' && (
                        <div className="compendium-view">
                            <div className="search-bar-row">
                                <input
                                    type="text"
                                    className="compendium-search-input"
                                    placeholder="Pesquisar habilidade (ex: Ataque Imprudente, Fúria, Evasão)..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                                {searchTerm && (
                                    <button className="clear-search-btn" onClick={() => setSearchTerm('')}>Limpar</button>
                                )}
                            </div>

                            <div className="compendium-list">
                                {compendiumEntries.map((item, idx) => (
                                    <div key={idx} className="compendium-item-card">
                                        <div className="compendium-item-header">
                                            <div className="compendium-title-area">
                                                <span className="compendium-level-badge">{item.level}º Nível</span>
                                                <h4 className="compendium-item-name">{item.name}</h4>
                                            </div>
                                            {item.info.type && (
                                                <span className={`action-type-pill type-${item.info.type}`}>
                                                    {item.info.type === 'action' ? 'Ação' : item.info.type === 'bonus_action' ? 'Ação Bônus' : item.info.type === 'reaction' ? 'Reação' : 'Passiva'}
                                                </span>
                                            )}
                                        </div>
                                        <p className="compendium-item-desc">{item.info.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* MODAL / POPUP DE DETALHES DE HABILIDADE */}
                {selectedFeature && (
                    <div className="feature-detail-modal-backdrop" onClick={() => setSelectedFeature(null)}>
                        <div className="feature-detail-modal" onClick={e => e.stopPropagation()}>
                            <div className="feature-detail-header">
                                <div>
                                    <span className="feature-detail-tag">Característica de Classe</span>
                                    <h3>{selectedFeature.info.name}</h3>
                                </div>
                                <button className="detail-close-btn" onClick={() => setSelectedFeature(null)}>&times;</button>
                            </div>
                            <div className="feature-detail-body">
                                {selectedFeature.info.type && (
                                    <div style={{ marginBottom: '12px' }}>
                                        <span className={`action-type-pill type-${selectedFeature.info.type}`}>
                                            Tipo: {selectedFeature.info.type === 'action' ? 'Ação' : selectedFeature.info.type === 'bonus_action' ? 'Ação Bônus' : selectedFeature.info.type === 'reaction' ? 'Reação' : 'Passiva'}
                                        </span>
                                    </div>
                                )}
                                <p className="feature-rule-text">{selectedFeature.info.description}</p>
                            </div>
                            <div className="feature-detail-footer">
                                <button type="button" className="detail-btn-ok" onClick={() => setSelectedFeature(null)}>
                                    Entendido
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};
