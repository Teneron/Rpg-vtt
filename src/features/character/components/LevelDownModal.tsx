import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { Character } from '../characterTypes';
import { getMinXPForLevel } from '../characterTypes';
import type { AbilityScoreKey } from '../data/feats';
import {
    analyzeLevelDown,
    applyCharacterLevelDown,
    prepareCharacterLevelUp
} from '../utils/levelUtils';
import { ArrowDownCircle, ArrowUpCircle, ArrowRight, Check, Minus, Plus, RotateCcw, ShieldAlert, Sparkles, X } from 'lucide-react';

interface LevelDownModalProps {
    character: Character;
    initialTargetLevel?: number;
    onApply: (updatedCharacter: Character, openLevelUpWizard?: boolean) => void;
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

export const LevelDownModal: React.FC<LevelDownModalProps> = ({
    character,
    initialTargetLevel,
    onApply,
    onClose
}) => {
    const currentLevel = character.level || 1;
    const [targetLevel, setTargetLevel] = useState<number>(() => {
        if (typeof initialTargetLevel === 'number' && initialTargetLevel >= 1 && initialTargetLevel <= 20) {
            return initialTargetLevel;
        }
        return currentLevel < 20 ? currentLevel + 1 : Math.max(1, currentLevel - 1);
    });

    const isLevelDown = targetLevel < currentLevel;
    const isLevelUp = targetLevel > currentLevel;

    const analysis = useMemo(() => {
        if (!isLevelDown) return null;
        return analyzeLevelDown(character, targetLevel);
    }, [character, targetLevel, isLevelDown]);

    const [legacyHpReduction, setLegacyHpReduction] = useState<number>(0);
    const [featIndicesToRemove, setFeatIndicesToRemove] = useState<number[]>([]);
    const [attrReductions, setAttrReductions] = useState<Partial<Record<AbilityScoreKey, number>>>({});
    const [removeHighSpells, setRemoveHighSpells] = useState<boolean>(true);

    // Sync defaults whenever targetLevel changes
    useEffect(() => {
        if (analysis) {
            setLegacyHpReduction(analysis.suggestedLegacyHpReduction);
            setFeatIndicesToRemove(analysis.autoDetectedFeatIndicesToRemove);
            setAttrReductions({});
            setRemoveHighSpells(true);
        }
    }, [analysis]);

    const previewDowngraded = useMemo(() => {
        if (!isLevelDown) return null;
        return applyCharacterLevelDown(character, targetLevel, {
            legacyHpReduction,
            featIndicesToRemove,
            attributeReductions: attrReductions,
            removeHigherCircleSpells: removeHighSpells
        });
    }, [character, targetLevel, isLevelDown, legacyHpReduction, featIndicesToRemove, attrReductions, removeHighSpells]);

    const totalAttrPointsReverted = useMemo(() => {
        return ATTR_KEYS.reduce((sum, k) => sum + (attrReductions[k] || 0), 0);
    }, [attrReductions]);

    const toggleFeatRemove = (idx: number) => {
        setFeatIndicesToRemove(prev =>
            prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
        );
    };

    const adjustAttrReduction = (key: AbilityScoreKey, delta: number) => {
        setAttrReductions(prev => {
            const currentRed = prev[key] || 0;
            const maxAllowed = Math.max(0, (character.attributes[key]?.value || 10) - 1);
            const nextRed = Math.max(0, Math.min(maxAllowed, currentRed + delta));
            return { ...prev, [key]: nextRed };
        });
    };

    const handleConfirm = () => {
        if (targetLevel === currentLevel) {
            onClose();
            return;
        }
        if (isLevelUp) {
            const updated = prepareCharacterLevelUp(character, targetLevel);
            onApply(updated, true);
            return;
        }
        if (isLevelDown && previewDowngraded) {
            onApply(previewDowngraded, false);
        }
    };

    if (typeof document === 'undefined') return null;

    return createPortal(
        <div
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(4, 5, 10, 0.88)',
                backdropFilter: 'blur(7px)',
                zIndex: 100080,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '16px'
            }}
            onClick={onClose}
        >
            <div
                style={{
                    background: '#12131a',
                    color: '#e2e8f0',
                    width: '680px',
                    maxWidth: '95vw',
                    maxHeight: '90vh',
                    borderRadius: '12px',
                    border: '1px solid rgba(197, 160, 89, 0.45)',
                    boxShadow: '0 24px 60px rgba(0, 0, 0, 0.9)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden'
                }}
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div style={{
                    padding: '16px 22px',
                    borderBottom: '1px solid rgba(197, 160, 89, 0.3)',
                    background: 'linear-gradient(135deg, rgba(30, 24, 15, 0.95) 0%, rgba(18, 19, 26, 0.98) 100%)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {isLevelDown ? <ArrowDownCircle size={22} color="#f87171" /> : <ArrowUpCircle size={22} color="#ffd700" />}
                        <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#f8fafc' }}>
                            Ajustar Nível: {character.name}
                        </h3>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div style={{ padding: '20px 22px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* Level Picker Bar */}
                    <div style={{
                        background: 'rgba(0, 0, 0, 0.4)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '10px',
                        padding: '14px 18px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '12px'
                    }}>
                        <div>
                            <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Nível Atual</span>
                            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#cbd5e1' }}>
                                Nível {currentLevel}
                            </div>
                        </div>

                        <ArrowRight size={20} color="#ffd700" />

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <button
                                type="button"
                                onClick={() => setTargetLevel(l => Math.max(1, l - 1))}
                                disabled={targetLevel <= 1}
                                style={{
                                    width: '34px',
                                    height: '34px',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(255,255,255,0.18)',
                                    background: 'rgba(255,255,255,0.06)',
                                    color: '#fff',
                                    cursor: targetLevel <= 1 ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <Minus size={16} />
                            </button>

                            <div style={{ textAlign: 'center', minWidth: '100px' }}>
                                <span style={{ fontSize: '0.72rem', color: '#ffd700', textTransform: 'uppercase', fontWeight: 700 }}>
                                    Novo Nível
                                </span>
                                <div style={{
                                    fontSize: '1.5rem',
                                    fontWeight: 900,
                                    color: isLevelDown ? '#f87171' : isLevelUp ? '#4ade80' : '#94a3b8'
                                }}>
                                    Nível {targetLevel}
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => setTargetLevel(l => Math.min(20, l + 1))}
                                disabled={targetLevel >= 20}
                                style={{
                                    width: '34px',
                                    height: '34px',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(255,255,255,0.18)',
                                    background: 'rgba(255,255,255,0.06)',
                                    color: '#fff',
                                    cursor: targetLevel >= 20 ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                    </div>

                    {/* LEVEL UP PREVIEW */}
                    {isLevelUp && (
                        <div style={{
                            background: 'rgba(74, 222, 128, 0.08)',
                            border: '1px solid rgba(74, 222, 128, 0.35)',
                            borderRadius: '8px',
                            padding: '14px 16px',
                            display: 'flex',
                            gap: '12px',
                            alignItems: 'flex-start'
                        }}>
                            <Sparkles size={22} color="#4ade80" style={{ flexShrink: 0, marginTop: '2px' }} />
                            <div style={{ fontSize: '0.86rem', color: '#e2e8f0', lineHeight: 1.5 }}>
                                <strong style={{ color: '#4ade80', display: 'block', marginBottom: '4px' }}>
                                    Evolução guiada para o Nível {targetLevel} (XP mínimo: {getMinXPForLevel(targetLevel)})
                                </strong>
                                Ao confirmar, a ficha habilitará o assistente de evolução passo a passo (Pontos de Vida, Habilidades de Classe, Subclasse, Magias e Talentos / Atributos).
                            </div>
                        </div>
                    )}

                    {/* LEVEL DOWN DETAILS */}
                    {isLevelDown && analysis && previewDowngraded && (
                        <>
                            {analysis.hasFullHistory ? (
                                <div style={{
                                    background: 'rgba(34, 197, 94, 0.1)',
                                    border: '1px solid rgba(34, 197, 94, 0.4)',
                                    borderRadius: '8px',
                                    padding: '12px 14px',
                                    fontSize: '0.84rem',
                                    color: '#dcfce7',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px'
                                }}>
                                    <Check size={18} color="#4ade80" style={{ flexShrink: 0 }} />
                                    <span>
                                        {analysis.wasOnlyPendingUnconfigured
                                            ? 'A subida anterior ainda estava pendente de configuração: nenhum PV ou atributo extra havia sido somado.'
                                            : 'Histórico exato encontrado! Pontos de Vida, Atributos, Talentos, Magias e Habilidades serão restaurados automaticamente para o estado exato do Nível ' + targetLevel + '.'}
                                    </span>
                                </div>
                            ) : (
                                <div style={{
                                    background: 'rgba(245, 158, 11, 0.1)',
                                    border: '1px solid rgba(245, 158, 11, 0.4)',
                                    borderRadius: '8px',
                                    padding: '12px 14px',
                                    fontSize: '0.82rem',
                                    color: '#fef3c7',
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '10px'
                                }}>
                                    <ShieldAlert size={18} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
                                    <span>
                                        Esta ficha subiu de nível antes do histórico automático existir. Confira ou ajuste abaixo a redução de PV, Talentos e Atributos para o Nível {targetLevel}:
                                    </span>
                                </div>
                            )}

                            {/* Live Summary Pills */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                                <div style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '10px 12px' }}>
                                    <span style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase' }}>PV Máximo</span>
                                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc', marginTop: '2px' }}>
                                        {character.hp.max} → <span style={{ color: '#ffd700' }}>{previewDowngraded.hp.max}</span>
                                    </div>
                                </div>
                                <div style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '10px 12px' }}>
                                    <span style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase' }}>Dados de Vida</span>
                                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc', marginTop: '2px' }}>
                                        {currentLevel}{character.hitDice?.dieFace || 'd8'} → <span style={{ color: '#ffd700' }}>{targetLevel}{character.hitDice?.dieFace || 'd8'}</span>
                                    </div>
                                </div>
                                <div style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '10px 12px' }}>
                                    <span style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase' }}>Bônus Prof.</span>
                                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc', marginTop: '2px' }}>
                                        +{character.proficiencyBonus} → <span style={{ color: '#ffd700' }}>+{previewDowngraded.proficiencyBonus}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Legacy Controls (HP, Feats, Attributes) when no exact snapshot exists */}
                            {!analysis.hasFullHistory && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                    {/* HP Adjustment */}
                                    <div style={{
                                        background: 'rgba(0,0,0,0.32)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '8px',
                                        padding: '12px 14px',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        gap: '12px',
                                        flexWrap: 'wrap'
                                    }}>
                                        <div>
                                            <strong style={{ fontSize: '0.88rem', color: '#f8fafc', display: 'block' }}>
                                                Redução de Pontos de Vida dos níveis removidos
                                            </strong>
                                            <span style={{ fontSize: '0.76rem', color: '#94a3b8' }}>
                                                Sugestão pela média da classe: -{analysis.suggestedLegacyHpReduction} PV (ajuste se rolou dado ou se o PV ainda não havia subido)
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <button
                                                type="button"
                                                onClick={() => setLegacyHpReduction(v => Math.max(0, v - 1))}
                                                style={{ width: '28px', height: '28px', borderRadius: '6px', border: '1px solid #444', background: '#1e293b', color: '#fff', cursor: 'pointer' }}
                                            >
                                                -
                                            </button>
                                            <input
                                                type="number"
                                                min={0}
                                                max={Math.max(0, character.hp.max - 1)}
                                                value={legacyHpReduction}
                                                onChange={e => setLegacyHpReduction(Math.max(0, parseInt(e.target.value || '0', 10) || 0))}
                                                style={{
                                                    width: '64px',
                                                    textAlign: 'center',
                                                    background: '#090a0f',
                                                    border: '1px solid #ffd700',
                                                    borderRadius: '6px',
                                                    color: '#ffd700',
                                                    fontWeight: 800,
                                                    padding: '4px'
                                                }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setLegacyHpReduction(v => Math.min(Math.max(0, character.hp.max - 1), v + 1))}
                                                style={{ width: '28px', height: '28px', borderRadius: '6px', border: '1px solid #444', background: '#1e293b', color: '#fff', cursor: 'pointer' }}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    {/* Feats Checkboxes */}
                                    {(character.feats || []).length > 0 && (
                                        <div style={{
                                            background: 'rgba(0,0,0,0.32)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '8px',
                                            padding: '12px 14px'
                                        }}>
                                            <strong style={{ fontSize: '0.88rem', color: '#f8fafc', display: 'block', marginBottom: '8px' }}>
                                                Talentos na ficha (marque os que devem ser removidos ao voltar para o Nível {targetLevel}):
                                            </strong>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                                {(character.feats || []).map((feat, idx) => {
                                                    const marked = featIndicesToRemove.includes(idx);
                                                    return (
                                                        <label
                                                            key={`${feat.id}_${idx}`}
                                                            style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'space-between',
                                                                padding: '6px 10px',
                                                                borderRadius: '6px',
                                                                background: marked ? 'rgba(239, 68, 68, 0.14)' : 'rgba(255,255,255,0.03)',
                                                                border: `1px solid ${marked ? 'rgba(239, 68, 68, 0.45)' : 'rgba(255,255,255,0.08)'}`,
                                                                cursor: 'pointer',
                                                                fontSize: '0.82rem'
                                                            }}
                                                        >
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                <input
                                                                    type="checkbox"
                                                                    checked={marked}
                                                                    onChange={() => toggleFeatRemove(idx)}
                                                                />
                                                                <span>{feat.name}</span>
                                                            </div>
                                                            <span style={{ fontSize: '0.72rem', color: marked ? '#fca5a5' : '#94a3b8' }}>
                                                                {marked ? 'Será removido' : 'Manter'}
                                                            </span>
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* Attribute Reduction Controls */}
                                    <div style={{
                                        background: 'rgba(0,0,0,0.32)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '8px',
                                        padding: '12px 14px'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
                                            <strong style={{ fontSize: '0.88rem', color: '#f8fafc' }}>
                                                Reverter Pontos de Atributo (ASI / Bônus de Nível {analysis.crossedLegacyAsiLevels.join(', ') || 'anterior'}):
                                            </strong>
                                            {totalAttrPointsReverted > 0 && (
                                                <button
                                                    type="button"
                                                    onClick={() => setAttrReductions({})}
                                                    style={{
                                                        background: 'none',
                                                        border: 'none',
                                                        color: '#ffd700',
                                                        fontSize: '0.76rem',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '4px'
                                                    }}
                                                >
                                                    <RotateCcw size={12} /> Limpar ({totalAttrPointsReverted} pt)
                                                </button>
                                            )}
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                                            {ATTR_KEYS.map(key => {
                                                const orig = character.attributes[key]?.value || 10;
                                                const finalVal = previewDowngraded.attributes[key]?.value || orig;
                                                const manualRed = attrReductions[key] || 0;
                                                return (
                                                    <div
                                                        key={key}
                                                        style={{
                                                            background: manualRed > 0 ? 'rgba(248, 113, 113, 0.12)' : 'rgba(0,0,0,0.4)',
                                                            border: `1px solid ${manualRed > 0 ? '#f87171' : 'rgba(255,255,255,0.1)'}`,
                                                            borderRadius: '6px',
                                                            padding: '8px 10px',
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center'
                                                        }}
                                                    >
                                                        <div>
                                                            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#ffd700' }}>{ATTR_LABELS[key].short}</div>
                                                            <div style={{ fontSize: '0.84rem', color: '#e2e8f0' }}>
                                                                {orig} {finalVal !== orig ? `→ ${finalVal}` : ''}
                                                            </div>
                                                        </div>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                            <button
                                                                type="button"
                                                                title="Reduzir 1 ponto deste atributo"
                                                                onClick={() => adjustAttrReduction(key, 1)}
                                                                style={{ width: '24px', height: '24px', borderRadius: '4px', border: '1px solid #555', background: '#26171a', color: '#fca5a5', cursor: 'pointer', fontWeight: 800 }}
                                                            >
                                                                -1
                                                            </button>
                                                            {manualRed > 0 && (
                                                                <button
                                                                    type="button"
                                                                    title="Desfazer redução"
                                                                    onClick={() => adjustAttrReduction(key, -1)}
                                                                    style={{ width: '24px', height: '24px', borderRadius: '4px', border: '1px solid #555', background: '#17261c', color: '#86efac', cursor: 'pointer', fontWeight: 800 }}
                                                                >
                                                                    +1
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {analysis.highCircleSpellNames.length > 0 && (
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#cbd5e1', cursor: 'pointer' }}>
                                            <input
                                                type="checkbox"
                                                checked={removeHighSpells}
                                                onChange={e => setRemoveHighSpells(e.target.checked)}
                                            />
                                            <span>
                                                Remover automaticamente magias de círculo superior ao permitido no Nível {targetLevel} ({analysis.highCircleSpellNames.join(', ')})
                                            </span>
                                        </label>
                                    )}
                                </div>
                            )}

                            {/* Exact Attribute Diff Summary when hasFullHistory */}
                            {analysis.hasFullHistory && ATTR_KEYS.some(k => previewDowngraded.attributes[k].value !== character.attributes[k].value) && (
                                <div style={{
                                    background: 'rgba(0,0,0,0.32)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '8px',
                                    padding: '10px 14px',
                                    fontSize: '0.84rem'
                                }}>
                                    <strong style={{ color: '#ffd700' }}>Atributos Restaurados Automaticamente: </strong>
                                    {ATTR_KEYS
                                        .filter(k => previewDowngraded.attributes[k].value !== character.attributes[k].value)
                                        .map(k => `${ATTR_LABELS[k].short}: ${character.attributes[k].value} → ${previewDowngraded.attributes[k].value}`)
                                        .join(' • ')}
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Footer */}
                <div style={{
                    padding: '14px 22px',
                    borderTop: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(10, 11, 16, 0.95)',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '10px'
                }}>
                    <button
                        type="button"
                        onClick={onClose}
                        style={{
                            background: 'rgba(255,255,255,0.06)',
                            border: '1px solid rgba(255,255,255,0.15)',
                            color: '#cbd5e1',
                            padding: '8px 18px',
                            borderRadius: '6px',
                            fontWeight: 600,
                            cursor: 'pointer'
                        }}
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        disabled={targetLevel === currentLevel}
                        onClick={handleConfirm}
                        style={{
                            background: isLevelDown
                                ? 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)'
                                : 'linear-gradient(135deg, #ffd700 0%, #b8860b 100%)',
                            border: 'none',
                            color: isLevelDown ? '#fff' : '#000',
                            fontWeight: 800,
                            padding: '9px 22px',
                            borderRadius: '6px',
                            cursor: targetLevel === currentLevel ? 'not-allowed' : 'pointer',
                            opacity: targetLevel === currentLevel ? 0.4 : 1
                        }}
                    >
                        {isLevelDown
                            ? `Confirmar Redução para Nível ${targetLevel}`
                            : isLevelUp
                                ? `Subir para Nível ${targetLevel}`
                                : 'Mesmo Nível'}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};
