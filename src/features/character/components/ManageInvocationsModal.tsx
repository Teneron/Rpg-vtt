import React, { useState, useMemo } from 'react';
import type { Character, ClassFeature } from '../characterTypes';
import { WARLOCK_INVOCATIONS, getMaxInvocations, type WarlockInvocation } from '../data/warlockInvocations';
import { Sparkles, Check, Search } from 'lucide-react';
import './ManageInvocationsModal.css';

interface ManageInvocationsModalProps {
    character: Character;
    onUpdateCharacter: (updates: Partial<Character>) => void;
    onClose: () => void;
}

export const ManageInvocationsModal: React.FC<ManageInvocationsModalProps> = ({
    character,
    onUpdateCharacter,
    onClose
}) => {
    const maxAllowed = getMaxInvocations(character.level);
    const [search, setSearch] = useState('');
    const [filterLevel, setFilterLevel] = useState<number | 'all'>('all');

    // Extract currently selected invocation IDs from character.features
    const currentSelectedIds = useMemo(() => {
        const ids = new Set<string>();
        const features = character.features || [];
        for (const feat of features) {
            const featName = feat.name.toLowerCase();
            for (const inv of WARLOCK_INVOCATIONS) {
                if (featName.includes(inv.id) || featName.includes(inv.name.toLowerCase()) || featName.includes(inv.nameEn.toLowerCase())) {
                    ids.add(inv.id);
                }
            }
        }
        return ids;
    }, [character.features]);

    const [selectedIds, setSelectedIds] = useState<Set<string>>(currentSelectedIds);

    const filteredInvocations = useMemo(() => {
        return WARLOCK_INVOCATIONS.filter(inv => {
            const matchesSearch = inv.name.toLowerCase().includes(search.toLowerCase()) ||
                inv.nameEn.toLowerCase().includes(search.toLowerCase()) ||
                inv.description.toLowerCase().includes(search.toLowerCase());
            const matchesLevel = filterLevel === 'all' || inv.minLevel === filterLevel;
            return matchesSearch && matchesLevel;
        });
    }, [search, filterLevel]);

    const toggleInvocation = (inv: WarlockInvocation) => {
        if (inv.minLevel > character.level) return;

        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(inv.id)) {
                next.delete(inv.id);
            } else {
                if (next.size >= maxAllowed) {
                    alert(`Limite atingido! No Nível ${character.level}, um Bruxo pode ter no máximo ${maxAllowed} Invocações Místicas ativas.`);
                    return prev;
                }
                next.add(inv.id);
            }
            return next;
        });
    };

    const handleSave = () => {
        const otherFeatures = (character.features || []).filter(f => {
            const fn = f.name.toLowerCase();
            const isInvFeature = fn.startsWith('invocação mística:') ||
                WARLOCK_INVOCATIONS.some(inv => fn.includes(inv.name.toLowerCase()) || fn.includes(inv.nameEn.toLowerCase()));
            return !isInvFeature;
        });

        const newInvFeatures: ClassFeature[] = [];
        for (const inv of WARLOCK_INVOCATIONS) {
            if (selectedIds.has(inv.id)) {
                newInvFeatures.push({
                    name: `Invocação Mística: ${inv.name}`,
                    level: Math.max(1, inv.minLevel),
                    description: inv.description,
                    type: 'passive'
                });
            }
        }

        const updatedFeatures = [...otherFeatures, ...newInvFeatures];

        // Also update darkvision visionRange if Devil's Sight was added/removed
        let updatedVision = character.visionRange;
        if (selectedIds.has('devils_sight')) {
            updatedVision = Math.max(36, character.visionRange || 0);
        } else if (currentSelectedIds.has('devils_sight') && !selectedIds.has('devils_sight')) {
            // Revert to race vision if Devil's sight removed
            const hasRacialDarkvision = /elfo|dwarf|an[ãa]o|gnomo|gnome|tiefling|draconato|meio-elfo/i.test(character.race || '');
            updatedVision = hasRacialDarkvision ? 18 : 0;
        }

        onUpdateCharacter({
            features: updatedFeatures,
            visionRange: updatedVision
        });

        onClose();
    };

    return (
        <div className="modal-overlay" style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.85)', zIndex: 1200, display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
            <div className="modal-content animate-fade-in" style={{
                background: '#15171e', width: '920px', maxWidth: '96%', height: '88vh',
                borderRadius: '12px', display: 'flex', flexDirection: 'column', overflow: 'hidden',
                border: '1px solid #7c3aed', boxShadow: '0 10px 40px rgba(124, 58, 237, 0.25)'
            }}>
                {/* HEADER */}
                <div style={{
                    padding: '16px 20px', borderBottom: '1px solid #2d2645',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    background: 'linear-gradient(135deg, #1e1338 0%, #15171e 100%)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ background: '#7c3aed', padding: '8px', borderRadius: '8px', color: '#fff', display: 'flex' }}>
                            <Sparkles size={20} />
                        </div>
                        <div>
                            <h2 style={{ margin: 0, color: '#f3e8ff', fontSize: '1.25rem' }}>Invocações Místicas (Eldritch Invocations)</h2>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: '#a78bfa' }}>
                                D&D 2024 / 5.5e Oficial • Bruxo Nível {character.level}
                            </p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{
                            background: selectedIds.size === maxAllowed ? '#064e3b' : '#312e81',
                            border: `1px solid ${selectedIds.size === maxAllowed ? '#10b981' : '#6366f1'}`,
                            padding: '6px 14px', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 'bold',
                            color: selectedIds.size === maxAllowed ? '#a7f3d0' : '#e0e7ff'
                        }}>
                            Ativas: {selectedIds.size} / {maxAllowed}
                        </div>
                        <button onClick={onClose} style={{
                            background: 'transparent', border: 'none', color: '#94a3b8',
                            fontSize: '1.6rem', cursor: 'pointer', lineHeight: 1
                        }}>×</button>
                    </div>
                </div>

                {/* FILTERS & SEARCH */}
                <div style={{
                    padding: '12px 20px', display: 'flex', gap: '12px', background: '#0e1017',
                    borderBottom: '1px solid #242235'
                }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <Search size={16} style={{ position: 'absolute', left: '12px', top: '11px', color: '#6b7280' }} />
                        <input
                            placeholder="Buscar invocação por nome, magia concedida ou efeito..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            style={{
                                width: '100%', boxSizing: 'border-box', padding: '9px 12px 9px 36px',
                                background: '#1c1e29', border: '1px solid #374151', borderRadius: '6px',
                                color: '#f3f4f6', fontSize: '0.88rem'
                            }}
                        />
                    </div>
                    <select
                        value={filterLevel}
                        onChange={e => setFilterLevel(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                        style={{
                            padding: '9px 14px', background: '#1c1e29', border: '1px solid #374151',
                            borderRadius: '6px', color: '#f3f4f6', fontSize: '0.88rem'
                        }}
                    >
                        <option value="all">Todos os Níveis</option>
                        <option value={1}>Nível 1 (Pactos)</option>
                        <option value={2}>Nível 2</option>
                        <option value={5}>Nível 5</option>
                        <option value={9}>Nível 9</option>
                    </select>
                </div>

                {/* INVOCATIONS LIST */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {filteredInvocations.map(inv => {
                        const isSelected = selectedIds.has(inv.id);
                        const isLocked = inv.minLevel > character.level;

                        return (
                            <div
                                key={inv.id}
                                onClick={() => !isLocked && toggleInvocation(inv)}
                                style={{
                                    padding: '14px 16px', borderRadius: '8px',
                                    background: isSelected ? 'rgba(124, 58, 237, 0.15)' : '#191b24',
                                    border: `1px solid ${isSelected ? '#8b5cf6' : (isLocked ? '#2e303d' : '#333748')}`,
                                    cursor: isLocked ? 'not-allowed' : 'pointer',
                                    opacity: isLocked ? 0.5 : 1,
                                    transition: 'all 0.15s ease',
                                    display: 'flex', gap: '14px', alignItems: 'flex-start'
                                }}
                            >
                                <div style={{
                                    width: '24px', height: '24px', borderRadius: '6px',
                                    border: `2px solid ${isSelected ? '#8b5cf6' : '#4b5563'}`,
                                    background: isSelected ? '#8b5cf6' : 'transparent',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    marginTop: '2px', flexShrink: 0
                                }}>
                                    {isSelected && <Check size={16} color="#ffffff" strokeWidth={3} />}
                                </div>

                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                                        <span style={{
                                            fontWeight: 'bold', fontSize: '0.98rem',
                                            color: isSelected ? '#e9d5ff' : '#f3f4f6'
                                        }}>
                                            {inv.name}
                                        </span>
                                        <span style={{
                                            fontSize: '0.72rem', padding: '2px 8px', borderRadius: '4px',
                                            background: isLocked ? '#374151' : '#312e81', color: isLocked ? '#9ca3af' : '#c7d2fe'
                                        }}>
                                            {inv.minLevel === 1 ? 'Nível 1 (Pacto)' : `Nível ${inv.minLevel}+`}
                                        </span>
                                        {inv.prerequisite && (
                                            <span style={{
                                                fontSize: '0.72rem', padding: '2px 8px', borderRadius: '4px',
                                                background: '#451a03', color: '#fcd34d'
                                            }}>
                                                Requisito: {inv.prerequisite}
                                            </span>
                                        )}
                                    </div>
                                    <p style={{ margin: 0, fontSize: '0.86rem', color: '#9ca3af', lineHeight: 1.45 }}>
                                        {inv.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* FOOTER */}
                <div style={{
                    padding: '14px 20px', borderTop: '1px solid #242235',
                    background: '#11131a', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                    <div style={{ fontSize: '0.85rem', color: '#9ca3af' }}>
                        {selectedIds.size > maxAllowed ? (
                            <span style={{ color: '#f87171' }}>⚠️ Você selecionou {selectedIds.size - maxAllowed} a mais do que o permitido!</span>
                        ) : selectedIds.size < maxAllowed ? (
                            <span style={{ color: '#fbbf24' }}>ℹ️ Você ainda pode escolher mais {maxAllowed - selectedIds.size} invocação(ões).</span>
                        ) : (
                            <span style={{ color: '#34d399' }}>✓ Quantidade exata de invocações selecionadas ({maxAllowed}/{maxAllowed}).</span>
                        )}
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            onClick={onClose}
                            style={{
                                padding: '8px 16px', background: '#262936', border: '1px solid #374151',
                                borderRadius: '6px', color: '#d1d5db', cursor: 'pointer', fontSize: '0.88rem'
                            }}
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={selectedIds.size > maxAllowed}
                            style={{
                                padding: '8px 20px',
                                background: selectedIds.size > maxAllowed ? '#4b5563' : 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                                border: 'none', borderRadius: '6px', color: '#ffffff', fontWeight: 'bold',
                                cursor: selectedIds.size > maxAllowed ? 'not-allowed' : 'pointer', fontSize: '0.88rem',
                                boxShadow: selectedIds.size > maxAllowed ? 'none' : '0 2px 10px rgba(124, 58, 237, 0.4)'
                            }}
                        >
                            Confirmar & Salvar Invocações
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
