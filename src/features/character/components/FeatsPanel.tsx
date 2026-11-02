import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import type { Character, CharacterAttributes } from '../characterTypes';
import { calculateModifier } from '../characterTypes';
import { FEATS, type Feat, type FeatCategory, type AbilityScoreKey } from '../data/feats';
import { useChat } from '../../chat/ChatContext';
import { Scroll, Plus, Trash2, X, Search, Check, Award } from 'lucide-react';
import './FeatsPanel.css';

interface FeatsPanelProps {
    character: Character;
    onUpdateCharacter?: (updates: Partial<Character>) => void;
    canEdit?: boolean;
}

const ATTR_KEYS: AbilityScoreKey[] = ['str', 'dex', 'con', 'int', 'wis', 'cha'];

const ATTR_NAMES: Record<AbilityScoreKey, { short: string; full: string }> = {
    str: { short: 'FOR', full: 'Força' },
    dex: { short: 'DES', full: 'Destreza' },
    con: { short: 'CON', full: 'Constituição' },
    int: { short: 'INT', full: 'Inteligência' },
    wis: { short: 'SAB', full: 'Sabedoria' },
    cha: { short: 'CAR', full: 'Carisma' }
};

export const FeatsPanel: React.FC<FeatsPanelProps> = ({
    character,
    onUpdateCharacter,
    canEdit = false
}) => {
    const { sendMessage } = useChat();
    const [expandedFeat, setExpandedFeat] = useState<string | null>(null);
    const [showPicker, setShowPicker] = useState(false);
    const [categoryFilter, setCategoryFilter] = useState<'all' | FeatCategory>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFeatToAdd, setSelectedFeatToAdd] = useState<Feat | null>(null);
    const [selectedBonusAttr, setSelectedBonusAttr] = useState<AbilityScoreKey | null>(null);

    const toggleExpand = (key: string) => {
        setExpandedFeat(prev => prev === key ? null : key);
    };

    const handleAnnounce = (feat: Feat) => {
        sendMessage(
            `mostra seu talento **${feat.name}**: \n\n_${feat.description}_`,
            'text'
        );
    };

    const filteredFeats = useMemo(() => {
        return FEATS.filter(feat => {
            if (categoryFilter !== 'all' && feat.category !== categoryFilter) return false;
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                return (
                    feat.name.toLowerCase().includes(q) ||
                    feat.description.toLowerCase().includes(q) ||
                    (feat.prerequisite || '').toLowerCase().includes(q)
                );
            }
            return true;
        });
    }, [categoryFilter, searchQuery]);

    const handleSelectCandidate = (feat: Feat) => {
        setSelectedFeatToAdd(feat);
        if (!feat.abilityBonusOptions) {
            setSelectedBonusAttr(null);
            return;
        }
        const opts = feat.abilityBonusOptions === 'any' ? ATTR_KEYS : feat.abilityBonusOptions;
        const cap = feat.maxAttributeCap || 20;
        const valid = opts.filter(k => (character.attributes[k]?.value || 10) < cap || (feat.grantsSaveProficiency && !character.attributes[k]?.saveProficiency));
        setSelectedBonusAttr(valid[0] || opts[0] || null);
    };

    const handleConfirmAddFeat = () => {
        if (!selectedFeatToAdd || !onUpdateCharacter) return;

        const nextAttrs: CharacterAttributes = JSON.parse(JSON.stringify(character.attributes));
        const oldConMod = calculateModifier(nextAttrs.con?.value || 10);

        if (selectedBonusAttr && nextAttrs[selectedBonusAttr] && selectedFeatToAdd.abilityBonusOptions) {
            const cap = selectedFeatToAdd.maxAttributeCap || 20;
            const inc = selectedFeatToAdd.abilityBonusAmount || 1;
            nextAttrs[selectedBonusAttr].value = Math.min(cap, (nextAttrs[selectedBonusAttr].value || 10) + inc);
            nextAttrs[selectedBonusAttr].modifier = calculateModifier(nextAttrs[selectedBonusAttr].value);
            if (selectedFeatToAdd.grantsSaveProficiency) {
                nextAttrs[selectedBonusAttr].saveProficiency = true;
            }
        }

        const newConMod = calculateModifier(nextAttrs.con?.value || 10);
        const conModDelta = newConMod - oldConMod;

        let hpDelta = conModDelta * (character.level || 1);
        if (selectedFeatToAdd.id === 'tough' && !(character.feats || []).some(f => f.id === 'tough')) {
            hpDelta += 2 * (character.level || 1);
        }
        if (selectedFeatToAdd.id === 'boon_of_fortitude' && !(character.feats || []).some(f => f.id === 'boon_of_fortitude')) {
            hpDelta += 40;
        }

        const storedFeat: Feat = {
            ...selectedFeatToAdd,
            chosenAbilityBonus: selectedBonusAttr || undefined,
            acquiredAtLevel: character.level
        };

        const updates: Partial<Character> = {
            attributes: nextAttrs,
            feats: [...(character.feats || []), storedFeat]
        };

        if (hpDelta !== 0) {
            const nextMax = Math.max(1, (character.hp?.max || 10) + hpDelta);
            updates.hp = {
                ...character.hp,
                max: nextMax,
                current: Math.min(nextMax, Math.max(0, (character.hp?.current || 0) + Math.max(0, hpDelta)))
            };
        }

        onUpdateCharacter(updates);
        setSelectedFeatToAdd(null);
        setSelectedBonusAttr(null);
        setShowPicker(false);
    };

    const handleRemoveFeat = (index: number) => {
        if (!onUpdateCharacter) return;
        const feat = character.feats[index];
        if (!feat) return;
        if (!confirm(`Remover o talento "${feat.name}" da ficha?`)) return;

        const nextAttrs: CharacterAttributes = JSON.parse(JSON.stringify(character.attributes));
        const oldConMod = calculateModifier(nextAttrs.con?.value || 10);

        if (feat.chosenAbilityBonus && nextAttrs[feat.chosenAbilityBonus]) {
            const dec = feat.abilityBonusAmount || 1;
            nextAttrs[feat.chosenAbilityBonus].value = Math.max(1, (nextAttrs[feat.chosenAbilityBonus].value || 10) - dec);
            nextAttrs[feat.chosenAbilityBonus].modifier = calculateModifier(nextAttrs[feat.chosenAbilityBonus].value);
            if (feat.grantsSaveProficiency) {
                nextAttrs[feat.chosenAbilityBonus].saveProficiency = false;
            }
        }

        const newConMod = calculateModifier(nextAttrs.con?.value || 10);
        const conModDelta = newConMod - oldConMod;

        let hpDelta = conModDelta * (character.level || 1);
        const canonical = FEATS.find(f => f.id === feat.id);
        const effects = canonical?.effects || feat.effects;
        if (effects?.some(e => e.type === 'hp_per_level')) {
            const perLvl = effects.find(e => e.type === 'hp_per_level')?.value || 0;
            hpDelta -= perLvl * (character.level || 1);
        }
        if (effects?.some(e => e.type === 'hp_flat')) {
            const flat = effects.find(e => e.type === 'hp_flat')?.value || 0;
            hpDelta -= flat;
        }

        const nextFeats = character.feats.filter((_, idx) => idx !== index);
        const updates: Partial<Character> = {
            attributes: nextAttrs,
            feats: nextFeats
        };

        if (hpDelta !== 0) {
            const nextMax = Math.max(1, (character.hp?.max || 10) + hpDelta);
            updates.hp = {
                ...character.hp,
                max: nextMax,
                current: Math.min(nextMax, character.hp?.current || nextMax)
            };
        }

        onUpdateCharacter(updates);
    };

    return (
        <div className="feats-panel-book">
            <div className="book-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h3 style={{ margin: 0 }}>Talentos e Feitos ({character.feats?.length || 0})</h3>
                {canEdit && onUpdateCharacter && (
                    <button
                        type="button"
                        onClick={() => setShowPicker(true)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            background: '#58180d',
                            color: '#f2eecb',
                            border: '1px solid #c5a059',
                            borderRadius: '5px',
                            padding: '5px 10px',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                        }}
                    >
                        <Plus size={14} />
                        <span>Adicionar Talento</span>
                    </button>
                )}
            </div>

            <div className="feats-list-book">
                {(!character.feats || character.feats.length === 0) && (
                    <div className="empty-book-msg" style={{ padding: '16px', color: '#666', fontStyle: 'italic' }}>
                        Nenhum talento adquirido ainda. Talentos são ganhos na Origem (1º nível) e nos marcos de evolução (Níveis 4, 8, 12, 16 e 19).
                    </div>
                )}

                {(character.feats || []).map((feat, i) => {
                    const cardKey = `${feat.id}_${i}`;
                    const canonical = FEATS.find(f => f.id === feat.id);
                    const fullDesc = feat.descriptionFull || canonical?.descriptionFull || feat.description;
                    const category = feat.category || canonical?.category;

                    return (
                        <div
                            key={cardKey}
                            className={`feat-card-book ${expandedFeat === cardKey ? 'expanded' : ''}`}
                            onClick={() => toggleExpand(cardKey)}
                        >
                            <div className="feat-header-book">
                                <div>
                                    <span className="feat-name-book">{feat.name}</span>
                                    {feat.chosenAbilityBonus && (
                                        <span style={{
                                            marginLeft: '8px',
                                            fontSize: '0.72rem',
                                            background: 'rgba(88, 24, 13, 0.12)',
                                            color: '#58180d',
                                            padding: '2px 6px',
                                            borderRadius: '4px',
                                            fontWeight: 700
                                        }}>
                                            +1 {ATTR_NAMES[feat.chosenAbilityBonus]?.short || feat.chosenAbilityBonus.toUpperCase()}
                                        </span>
                                    )}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {category && <span className="feat-meta-book">{category}</span>}
                                    {feat.prerequisite && <span className="feat-meta-book">• {feat.prerequisite}</span>}
                                </div>
                            </div>

                            {expandedFeat === cardKey ? (
                                <div className="feat-body-book animate-slide-down" onClick={e => e.stopPropagation()}>
                                    <p className="feat-desc-book full">{fullDesc}</p>
                                    <div className="feat-actions-book" style={{ gap: '8px' }}>
                                        {canEdit && onUpdateCharacter && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveFeat(i)}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '4px',
                                                    background: 'rgba(185, 28, 28, 0.1)',
                                                    color: '#991b1b',
                                                    border: '1px solid rgba(185, 28, 28, 0.35)',
                                                    borderRadius: '4px',
                                                    padding: '4px 10px',
                                                    fontSize: '0.78rem',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <Trash2 size={13} />
                                                <span>Remover</span>
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            className="book-btn simple"
                                            onClick={() => handleAnnounce(feat)}
                                            style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
                                        >
                                            <Scroll size={13} />
                                            <span>Anunciar no Chat</span>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <p className="feat-desc-book short">{feat.description}</p>
                            )}
                        </div>
                    );
                })}
            </div>

            {showPicker && typeof document !== 'undefined' && createPortal(
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(4, 6, 12, 0.88)',
                        backdropFilter: 'blur(6px)',
                        zIndex: 100070,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '16px'
                    }}
                    onClick={() => setShowPicker(false)}
                >
                    <div
                        style={{
                            background: '#12131a',
                            color: '#e2e8f0',
                            width: '820px',
                            maxWidth: '95vw',
                            maxHeight: '88vh',
                            borderRadius: '12px',
                            border: '1px solid rgba(197, 160, 89, 0.45)',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.9)',
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden'
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div style={{
                            padding: '16px 20px',
                            borderBottom: '1px solid rgba(197, 160, 89, 0.3)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            background: 'rgba(30, 24, 15, 0.9)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Award size={20} color="#ffd700" />
                                <h3 style={{ margin: 0, color: '#ffd700', fontSize: '1.15rem' }}>
                                    Compêndio de Talentos (D&D 5.5e / 2024)
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowPicker(false)}
                                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div style={{ padding: '16px 20px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
                                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                    {(['all', 'Geral', 'Origem', 'Estilo de Luta', 'Dádiva Épica'] as const).map(cat => (
                                        <button
                                            key={cat}
                                            type="button"
                                            onClick={() => setCategoryFilter(cat)}
                                            style={{
                                                background: categoryFilter === cat ? 'rgba(255, 215, 0, 0.2)' : 'rgba(255,255,255,0.05)',
                                                border: `1px solid ${categoryFilter === cat ? '#ffd700' : 'rgba(255,255,255,0.12)'}`,
                                                color: categoryFilter === cat ? '#ffd700' : '#cbd5e1',
                                                borderRadius: '16px',
                                                padding: '5px 12px',
                                                fontSize: '0.76rem',
                                                fontWeight: 600,
                                                cursor: 'pointer'
                                            }}
                                        >
                                            {cat === 'all' ? `Todos (${FEATS.length})` : cat}
                                        </button>
                                    ))}
                                </div>

                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    background: 'rgba(0,0,0,0.45)',
                                    border: '1px solid rgba(255,255,255,0.15)',
                                    borderRadius: '6px',
                                    padding: '5px 10px',
                                    minWidth: '220px'
                                }}>
                                    <Search size={14} color="#94a3b8" />
                                    <input
                                        type="text"
                                        placeholder="Buscar talento..."
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        style={{ background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '0.82rem', width: '100%' }}
                                    />
                                </div>
                            </div>

                            {selectedFeatToAdd && selectedFeatToAdd.abilityBonusOptions && (
                                <div style={{
                                    background: 'rgba(197, 160, 89, 0.14)',
                                    border: '1px solid #ffd700',
                                    borderRadius: '8px',
                                    padding: '12px'
                                }}>
                                    <div style={{ fontSize: '0.84rem', color: '#ffd700', fontWeight: 700, marginBottom: '8px' }}>
                                        Escolha o atributo que receberá +1 por "{selectedFeatToAdd.name}"
                                        {selectedFeatToAdd.grantsSaveProficiency ? ' (+ Proficiência na Salvaguarda)' : ''}:
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                        {(selectedFeatToAdd.abilityBonusOptions === 'any' ? ATTR_KEYS : selectedFeatToAdd.abilityBonusOptions).map(k => {
                                            const cur = character.attributes[k]?.value || 10;
                                            const cap = selectedFeatToAdd.maxAttributeCap || 20;
                                            const next = Math.min(cap, cur + 1);
                                            const isChosen = selectedBonusAttr === k;
                                            return (
                                                <button
                                                    key={k}
                                                    type="button"
                                                    onClick={() => setSelectedBonusAttr(k)}
                                                    style={{
                                                        background: isChosen ? '#ffd700' : 'rgba(0,0,0,0.5)',
                                                        color: isChosen ? '#000' : '#e2e8f0',
                                                        border: '1px solid #ffd700',
                                                        borderRadius: '6px',
                                                        padding: '6px 12px',
                                                        fontWeight: 700,
                                                        fontSize: '0.8rem',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    {ATTR_NAMES[k].short}: {cur} → {next}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(245px, 1fr))',
                                gap: '10px',
                                overflowY: 'auto',
                                paddingRight: '4px'
                            }}>
                                {filteredFeats.map(feat => {
                                    const isOwned = !feat.repeatable && (character.feats || []).some(f => f.id === feat.id);
                                    const isSelected = selectedFeatToAdd?.id === feat.id;
                                    return (
                                        <div
                                            key={feat.id}
                                            onClick={() => !isOwned && handleSelectCandidate(feat)}
                                            style={{
                                                background: isSelected ? 'rgba(197, 160, 89, 0.16)' : 'rgba(0,0,0,0.35)',
                                                border: `1px solid ${isSelected ? '#ffd700' : 'rgba(255,255,255,0.1)'}`,
                                                borderRadius: '8px',
                                                padding: '12px',
                                                opacity: isOwned ? 0.45 : 1,
                                                cursor: isOwned ? 'not-allowed' : 'pointer'
                                            }}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '6px' }}>
                                                <strong style={{ color: isSelected ? '#ffd700' : '#f8fafc', fontSize: '0.88rem' }}>{feat.name}</strong>
                                                {isOwned ? (
                                                    <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Adquirido</span>
                                                ) : isSelected ? (
                                                    <Check size={16} color="#ffd700" />
                                                ) : (
                                                    <span style={{ fontSize: '0.66rem', color: '#cbd5e1', background: 'rgba(255,255,255,0.08)', padding: '2px 6px', borderRadius: '8px' }}>
                                                        {feat.category}
                                                    </span>
                                                )}
                                            </div>
                                            {feat.prerequisite && (
                                                <div style={{ fontSize: '0.72rem', color: '#eab308', marginTop: '3px' }}>
                                                    Pré-req: {feat.prerequisite}
                                                </div>
                                            )}
                                            <p style={{ margin: '6px 0 0 0', fontSize: '0.79rem', color: '#94a3b8', lineHeight: 1.4 }}>
                                                {isSelected && feat.descriptionFull ? feat.descriptionFull : feat.description}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div style={{
                            padding: '14px 20px',
                            borderTop: '1px solid rgba(255,255,255,0.08)',
                            background: 'rgba(10, 11, 16, 0.95)',
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: '10px'
                        }}>
                            <button
                                type="button"
                                onClick={() => setShowPicker(false)}
                                style={{
                                    background: 'rgba(255,255,255,0.06)',
                                    border: '1px solid rgba(255,255,255,0.15)',
                                    color: '#cbd5e1',
                                    padding: '8px 16px',
                                    borderRadius: '6px',
                                    cursor: 'pointer'
                                }}
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                disabled={!selectedFeatToAdd}
                                onClick={handleConfirmAddFeat}
                                style={{
                                    background: 'linear-gradient(135deg, #ffd700 0%, #b8860b 100%)',
                                    border: 'none',
                                    color: '#000',
                                    fontWeight: 800,
                                    padding: '8px 20px',
                                    borderRadius: '6px',
                                    cursor: selectedFeatToAdd ? 'pointer' : 'not-allowed',
                                    opacity: selectedFeatToAdd ? 1 : 0.4
                                }}
                            >
                                Confirmar Talento
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};
