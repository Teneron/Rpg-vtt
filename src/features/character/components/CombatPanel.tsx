import React, { useState } from 'react';
import type { Character } from '../characterTypes';
import { useDice } from '../../dice/DiceContext';
import { playSynthSound } from '../../audio/audioSynth';
import { Sparkles, Moon, Sun, AlertCircle, X, Lock } from 'lucide-react';

interface CombatPanelProps {
    character: Character;
    onUpdateHP: (current: number, temp: number) => void;
    onUpdateMaxHP?: (max: number) => void;
    onUpdateAC?: (ac: number) => void;
    onRollAttack: (name: string, bonus: number) => void;
    onUpdateResource?: (index: number, value: number) => void;
    onUpdateCharacter?: (patch: Partial<Character>) => void;
    isGM?: boolean;
}

const CONDITIONS_5E = [
    'Amedrontado',
    'Caído',
    'Cego',
    'Contido',
    'Envenenado',
    'Incapacitado',
    'Invisível',
    'Agarrado',
    'Paralisado',
    'Atordoado',
    'Petrificado',
    'Exaustão'
];

export const CombatPanel: React.FC<CombatPanelProps> = React.memo(({
    character,
    onUpdateHP,
    onUpdateMaxHP,
    onUpdateAC,
    onRollAttack,
    onUpdateResource,
    onUpdateCharacter,
    isGM
}) => {
    const { triggerRoll } = useDice();
    const [customAmount, setCustomAmount] = useState('');
    const [showConditionsModal, setShowConditionsModal] = useState(false);

    // Quick HP Damage / Heal adjustments
    const applyDelta = (delta: number) => {
        if (!isGM) {
            console.warn('[CombatPanel] Tentativa de alteração de PV bloqueada: apenas o GM pode alterar PV.');
            return;
        }
        if (delta < 0) {
            // Damage: Absorbed first by Temp HP, then subtracted from current HP
            const dmg = Math.abs(delta);
            const curTemp = character.hp.temp || 0;
            const tempAbsorb = Math.min(curTemp, dmg);
            const remainingDmg = dmg - tempAbsorb;
            const newTemp = curTemp - tempAbsorb;
            const newCurrent = Math.max(0, character.hp.current - remainingDmg);
            onUpdateHP(newCurrent, newTemp);
            playSynthSound(newCurrent === 0 ? 'fumble' : 'sword');
        } else if (delta > 0) {
            // Healing: Adds to current HP up to max HP
            const newCurrent = Math.min(character.hp.max, character.hp.current + delta);
            onUpdateHP(newCurrent, character.hp.temp || 0);
            playSynthSound('heal');
            if (character.hp.current === 0 && onUpdateCharacter) {
                onUpdateCharacter({ deathSaves: { successes: 0, failures: 0 } });
            }
        }
    };

    const handleCustomDamage = () => {
        const val = parseInt(customAmount, 10);
        if (!isNaN(val) && val > 0) {
            applyDelta(-val);
            setCustomAmount('');
        }
    };

    const handleCustomHeal = () => {
        const val = parseInt(customAmount, 10);
        if (!isNaN(val) && val > 0) {
            applyDelta(val);
            setCustomAmount('');
        }
    };

    // Heroic Inspiration Toggle
    const toggleInspiration = () => {
        if (!onUpdateCharacter) return;
        const nextVal = !character.inspiration;
        onUpdateCharacter({ inspiration: nextVal });
        playSynthSound(nextVal ? 'crit' : 'magic');
    };

    // Death Saves
    const toggleDeathSaveSuccess = (index: number) => {
        if (!onUpdateCharacter) return;
        const cur = character.deathSaves?.successes || 0;
        const next = cur === index ? index - 1 : index;
        onUpdateCharacter({
            deathSaves: {
                successes: Math.max(0, Math.min(3, next)),
                failures: character.deathSaves?.failures || 0
            }
        });
    };

    const toggleDeathSaveFailure = (index: number) => {
        if (!onUpdateCharacter) return;
        const cur = character.deathSaves?.failures || 0;
        const next = cur === index ? index - 1 : index;
        onUpdateCharacter({
            deathSaves: {
                successes: character.deathSaves?.successes || 0,
                failures: Math.max(0, Math.min(3, next))
            }
        });
    };

    const rollDeathSave = () => {
        const roll = Math.floor(Math.random() * 20) + 1;
        triggerRoll({ d20: 1 }, 0, 'Teste contra a Morte');

        if (roll === 20) {
            // Nat 20: Character regains 1 HP immediately and revives
            if (onUpdateCharacter) {
                onUpdateCharacter({
                    hp: {
                        ...character.hp,
                        current: 1
                    },
                    deathSaves: { successes: 0, failures: 0 }
                });
            }
            playSynthSound('crit');
            alert('20 Natural no Teste contra a Morte! O personagem recupera 1 PV e recobra a consciência!');
        } else if (roll >= 10) {
            // Success
            const nextSuccesses = (character.deathSaves?.successes || 0) + 1;
            playSynthSound('heal');
            if (onUpdateCharacter) {
                onUpdateCharacter({
                    deathSaves: {
                        successes: Math.min(3, nextSuccesses),
                        failures: character.deathSaves?.failures || 0
                    }
                });
            }
            if (nextSuccesses >= 3) {
                alert('Sucesso! O personagem estabilizou com 3 sucessos!');
            }
        } else if (roll === 1) {
            // Nat 1: Two failures
            const nextFailures = (character.deathSaves?.failures || 0) + 2;
            playSynthSound('fumble');
            if (onUpdateCharacter) {
                onUpdateCharacter({
                    deathSaves: {
                        successes: character.deathSaves?.successes || 0,
                        failures: Math.min(3, nextFailures)
                    }
                });
            }
            if (nextFailures >= 3) {
                alert('Falha Crítica! 3 falhas acumuladas. O personagem sucumbiu.');
            }
        } else {
            // 2-9: One failure
            const nextFailures = (character.deathSaves?.failures || 0) + 1;
            playSynthSound('fumble');
            if (onUpdateCharacter) {
                onUpdateCharacter({
                    deathSaves: {
                        successes: character.deathSaves?.successes || 0,
                        failures: Math.min(3, nextFailures)
                    }
                });
            }
            if (nextFailures >= 3) {
                alert('3 falhas acumuladas nos Testes contra a Morte. O personagem sucumbiu.');
            }
        }
    };

    // Short Rest (Spend 1 Hit Die to Heal)
    const handleShortRest = () => {
        if (!isGM) {
            alert('Apenas o Mestre (GM) pode autorizar descansos curtos.');
            return;
        }
        const curHd = character.hitDice?.current ?? 0;
        if (curHd <= 0) {
            alert('Sem Dados de Vida disponíveis para gastar no Descanso Curto.');
            return;
        }

        const dieFace = parseInt((character.hitDice?.dieFace || 'd8').replace('d', ''), 10) || 8;
        const conMod = character.attributes.con.modifier;
        const roll = Math.floor(Math.random() * dieFace) + 1;
        const healTotal = Math.max(1, roll + conMod);
        const dieKey = character.hitDice?.dieFace || 'd8';
        triggerRoll({ [dieKey]: 1 }, conMod, 'Descanso Curto (Dado de Vida)');
        applyDelta(healTotal);

        if (onUpdateCharacter) {
            onUpdateCharacter({
                hitDice: {
                    ...character.hitDice,
                    current: Math.max(0, curHd - 1)
                }
            });
        }
    };

    // Long Rest (Full Recovery per 2024 Rules)
    const handleLongRest = () => {
        if (!isGM) {
            alert('Apenas o Mestre (GM) pode autorizar descansos longos.');
            return;
        }
        if (!confirm('Realizar Descanso Longo? (Restaura todo o PV, metade dos Dados de Vida, espaços de magia e recursos)')) return;

        const maxHd = character.hitDice?.max ?? character.level ?? 1;
        const curHd = character.hitDice?.current ?? 0;
        const recoveredHd = Math.max(1, Math.floor(maxHd / 2));
        const newHd = Math.min(maxHd, curHd + recoveredHd);

        // Reset Spell Slots
        const newSlots = { ...(character.spellSlots || {}) };
        Object.keys(newSlots).forEach(k => {
            newSlots[Number(k)] = { max: newSlots[Number(k)]?.max || 0, used: 0 };
        });

        // Reset Class Resources
        const newResources = (character.classResources || []).map(r => ({ ...r, current: r.max }));

        onUpdateHP(character.hp.max, 0);
        if (onUpdateCharacter) {
            onUpdateCharacter({
                deathSaves: { successes: 0, failures: 0 },
                hitDice: {
                    ...character.hitDice,
                    current: newHd
                },
                spellSlots: newSlots,
                classResources: newResources
            });
        }
        playSynthSound('rest');
    };

    // Conditions Toggle
    const toggleCondition = (cond: string) => {
        if (!onUpdateCharacter) return;
        const activeConds = character.conditions || [];
        const next = activeConds.includes(cond)
            ? activeConds.filter(c => c !== cond)
            : [...activeConds, cond];
        onUpdateCharacter({ conditions: next });
    };

    return (
        <div className="combat-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* TOP BAR: CA, INICIATIVA, DESLOCAMENTO & INSPIRAÇÃO HEROICA */}
            <div className="top-stats-row">
                <div
                    className="shield-stat-container"
                    title={character.acBreakdown ? `Classe de Armadura: ${character.armorClass}\nFórmula Oficial: ${character.acBreakdown}\n\n(Clique para ver detalhes ou definir valor manual)` : `Classe de Armadura: ${character.armorClass}`}
                    onClick={() => {
                        const current = character.armorClass;
                        const msg = character.acBreakdown
                            ? `Cálculo de Classe de Armadura (CA):\n\n${character.acBreakdown}\n\nDeseja definir um valor manual temporário? (Deixe em branco ou cancele para manter o cálculo automático)`
                            : `Definir valor manual temporário de CA:`;
                        const res = prompt(msg, character.acOverride !== undefined ? String(character.acOverride) : String(current));
                        if (res === null) return;
                        if (res.trim() === '') {
                            if (onUpdateCharacter) onUpdateCharacter({ acOverride: undefined });
                            else if (onUpdateAC) onUpdateAC(current);
                        } else {
                            const val = parseInt(res, 10);
                            if (!isNaN(val) && val > 0) {
                                if (onUpdateCharacter) onUpdateCharacter({ acOverride: val });
                                else if (onUpdateAC) onUpdateAC(val);
                            }
                        }
                    }}
                    style={{ cursor: 'pointer' }}
                >
                    <svg className="shield-svg" viewBox="0 0 100 120">
                        <path d="M50,0 C90,0 95,20 100,40 C100,80 80,110 50,120 C20,110 0,80 0,40 C5,20 10,0 50,0 Z" fill="#181920" stroke={character.acOverride !== undefined ? '#f59e0b' : '#c5a059'} strokeWidth="3" />
                    </svg>
                    <div className="shield-content">
                        <span className="shield-label" style={{ color: character.acOverride !== undefined ? '#f59e0b' : '#c5a059' }}>
                            CA {character.acOverride !== undefined ? '*' : ''}
                        </span>
                        {isGM ? (
                            <input
                                className="shield-val"
                                type="number"
                                value={character.armorClass}
                                onChange={e => onUpdateAC && onUpdateAC(Number(e.target.value))}
                                onClick={e => e.stopPropagation()}
                                style={{
                                    width: '60px', background: 'transparent', border: 'none', color: '#fff',
                                    textAlign: 'center', fontSize: '2rem', fontWeight: 'bold', zIndex: 10, position: 'relative'
                                }}
                            />
                        ) : (
                            <span className="shield-val">{character.armorClass}</span>
                        )}
                        {character.acBreakdown && (
                            <span
                                style={{
                                    fontSize: '0.62rem',
                                    color: character.acOverride !== undefined ? '#f59e0b' : '#c5a059',
                                    display: 'block',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    maxWidth: '80px',
                                    margin: '0 auto',
                                    opacity: 0.9
                                }}
                            >
                                {character.acOverride !== undefined ? 'Ajustado' : 'Fórmula'}
                            </span>
                        )}
                    </div>
                </div>

                <div className="stat-box-premium">
                    <span className="stat-label">Iniciativa</span>
                    <span className="stat-val">{(character.attributes.dex.modifier >= 0 ? '+' : '') + character.attributes.dex.modifier}</span>
                </div>

                <div className="stat-box-premium">
                    <span className="stat-label">Desloc.</span>
                    <span className="stat-val">{character.speed}m</span>
                </div>

                {/* INSPIRAÇÃO HEROICA (D&D 2024 OFICIAL) */}
                <button
                    type="button"
                    className="stat-box-premium"
                    onClick={toggleInspiration}
                    title="Inspiração Heroica 2024: Clique para ativar ou gastar para rerolar um d20"
                    style={{
                        cursor: 'pointer',
                        background: character.inspiration ? 'linear-gradient(135deg, rgba(212,175,55,0.3) 0%, rgba(255,215,0,0.15) 100%)' : '#1e1f28',
                        borderColor: character.inspiration ? '#ffd700' : '#333644',
                        boxShadow: character.inspiration ? '0 0 12px rgba(255, 215, 0, 0.4)' : 'none',
                        transition: 'all 0.2s ease'
                    }}
                >
                    <span className="stat-label" style={{ color: character.inspiration ? '#ffd700' : '#888' }}>Inspiração</span>
                    <span className="stat-val" style={{ fontSize: '1rem', color: character.inspiration ? '#ffd700' : '#666', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Sparkles size={14} color={character.inspiration ? '#ffd700' : '#666'} />
                        <span>{character.inspiration ? 'ATIVA' : '---'}</span>
                    </span>
                </button>
            </div>

            {/* VITALITY / PONTOS DE VIDA */}
            <div className="vitality-container panel-box premium-box">
                <div className="hp-header-grid">
                    <div className="hp-group">
                        <label>PV MÁXIMO</label>
                        <input
                            className="premium-input"
                            type="number"
                            value={character.hp.max}
                            onChange={e => isGM && onUpdateMaxHP && onUpdateMaxHP(Number(e.target.value))}
                            readOnly={!isGM}
                            title={!isGM ? "Apenas GM ou Level Up pode alterar PV Max" : ""}
                            style={{ cursor: !isGM ? 'not-allowed' : 'text', opacity: !isGM ? 0.8 : 1, borderColor: isGM ? '#4CAF50' : undefined }}
                        />
                    </div>
                    <div className="hp-group main">
                        <label>PV ATUAL</label>
                        <input
                            className="premium-input large"
                            type="number"
                            value={character.hp.current}
                            onChange={e => isGM && onUpdateHP(Math.max(0, parseInt(e.target.value) || 0), character.hp.temp || 0)}
                            readOnly={!isGM}
                            title={!isGM ? "Apenas o Mestre (GM) pode alterar o PV Atual" : "PV Atual (Editável pelo Mestre)"}
                            style={{
                                color: character.hp.current === 0 ? '#ef4444' : character.hp.current <= Math.floor(character.hp.max / 2) ? '#f59e0b' : '#10b981',
                                fontWeight: 'bold',
                                cursor: !isGM ? 'not-allowed' : 'text',
                                opacity: !isGM ? 0.9 : 1,
                                borderColor: isGM ? '#4CAF50' : undefined
                            }}
                        />
                    </div>
                    <div className="hp-group">
                        <label>PV TEMP</label>
                        <input
                            className="premium-input"
                            type="number"
                            value={character.hp.temp || 0}
                            onChange={e => isGM && onUpdateHP(character.hp.current, Math.max(0, parseInt(e.target.value) || 0))}
                            readOnly={!isGM}
                            title={!isGM ? "Apenas o Mestre (GM) pode alterar o PV Temporário" : "PV Temporário (Editável pelo Mestre)"}
                            style={{
                                color: (character.hp.temp || 0) > 0 ? '#38bdf8' : '#aaa',
                                cursor: !isGM ? 'not-allowed' : 'text',
                                opacity: !isGM ? 0.85 : 1,
                                borderColor: isGM ? '#4CAF50' : undefined
                            }}
                        />
                    </div>
                </div>

                {/* QUICK ADJUST BUTTONS */}
                {isGM ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px', margin: '10px 0 6px 0', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', gap: '4px' }}>
                            <button type="button" onClick={() => applyDelta(-5)} className="hp-adjust-btn dmg" title="Receber 5 de dano">-5</button>
                            <button type="button" onClick={() => applyDelta(-1)} className="hp-adjust-btn dmg" title="Receber 1 de dano">-1</button>
                            <button type="button" onClick={() => applyDelta(1)} className="hp-adjust-btn heal" title="Curar 1 PV">+1</button>
                            <button type="button" onClick={() => applyDelta(5)} className="hp-adjust-btn heal" title="Curar 5 PV">+5</button>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <input
                                type="number"
                                placeholder="Qtd"
                                value={customAmount}
                                onChange={e => setCustomAmount(e.target.value)}
                                style={{ width: '48px', padding: '3px 4px', background: '#14141c', border: '1px solid #444', borderRadius: '4px', color: '#fff', fontSize: '0.82rem', textAlign: 'center' }}
                            />
                            <button type="button" onClick={handleCustomDamage} className="hp-adjust-btn dmg" style={{ padding: '3px 7px', fontSize: '0.75rem' }}>Dano</button>
                            <button type="button" onClick={handleCustomHeal} className="hp-adjust-btn heal" style={{ padding: '3px 7px', fontSize: '0.75rem' }}>Curar</button>
                        </div>
                    </div>
                ) : (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        margin: '10px 0 6px 0',
                        padding: '6px 10px',
                        background: 'rgba(0, 0, 0, 0.25)',
                        border: '1px dashed rgba(255, 255, 255, 0.12)',
                        borderRadius: '6px',
                        color: '#94a3b8',
                        fontSize: '0.78rem'
                    }}>
                        <Lock size={13} style={{ color: '#f59e0b' }} />
                        <span>Alteração de PV gerenciada exclusivamente pelo Mestre (GM)</span>
                    </div>
                )}

                {/* HIT DICE & DEATH SAVES */}
                <div className="hp-footer is-flex" style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.08)', gap: '14px' }}>
                    {/* DADOS DE VIDA (HIT DICE) */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', fontWeight: 600 }}>Dados de Vida</span>
                            <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#ffd700' }}>
                                {character.hitDice?.current ?? character.level}/{character.hitDice?.max ?? character.level} {character.hitDice?.dieFace || 'd8'}
                            </span>
                        </div>
                        <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                            <button
                                type="button"
                                onClick={handleShortRest}
                                disabled={!isGM}
                                className="btn-small-outline"
                                title={!isGM ? "Apenas o Mestre (GM) pode autorizar Descanso Curto" : "Descanso Curto: Gasta 1 Dado de Vida + CON para curar"}
                                style={{
                                    flex: 1, padding: '4px 6px', fontSize: '0.72rem',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid #555',
                                    color: !isGM ? '#666' : '#eee',
                                    borderRadius: '4px',
                                    cursor: !isGM ? 'not-allowed' : 'pointer',
                                    opacity: !isGM ? 0.6 : 1,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px'
                                }}
                            >
                                <Sun size={12} color={!isGM ? '#666' : '#f59e0b'} />
                                <span>Curto (1 DV)</span>
                            </button>
                            <button
                                type="button"
                                onClick={handleLongRest}
                                disabled={!isGM}
                                className="btn-small-outline"
                                title={!isGM ? "Apenas o Mestre (GM) pode autorizar Descanso Longo" : "Descanso Longo: Recupera todo o PV, metade dos dados de vida, magias e recursos"}
                                style={{
                                    flex: 1, padding: '4px 6px', fontSize: '0.72rem',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid #555',
                                    color: !isGM ? '#666' : '#eee',
                                    borderRadius: '4px',
                                    cursor: !isGM ? 'not-allowed' : 'pointer',
                                    opacity: !isGM ? 0.6 : 1,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px'
                                }}
                            >
                                <Moon size={12} color={!isGM ? '#666' : '#818cf8'} />
                                <span>Longo</span>
                            </button>
                        </div>
                    </div>

                    {/* TESTES CONTRA A MORTE (DEATH SAVES) */}
                    <div className="ds-box flex-1">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label style={{ margin: 0, fontSize: '0.75rem' }}>Testes de Morte</label>
                            {character.hp.current === 0 && (
                                <button
                                    type="button"
                                    onClick={rollDeathSave}
                                    style={{ background: '#7f1d1d', border: '1px solid #ef4444', color: '#fff', fontSize: '0.65rem', padding: '1px 5px', borderRadius: '3px', cursor: 'pointer', fontWeight: 'bold' }}
                                    title="Rolar d20 contra a morte"
                                >
                                    Rolar d20
                                </button>
                            )}
                        </div>
                        <div className="death-saves-row" style={{ marginTop: '4px' }}>
                            <span style={{ fontSize: '0.75rem', width: '28px' }}>Suc:</span>
                            <div className="checks">
                                {[1, 2, 3].map(i => (
                                    <div
                                        key={i}
                                        onClick={() => toggleDeathSaveSuccess(i)}
                                        className={`check-box ${(character.deathSaves?.successes || 0) >= i ? 'filled success' : ''}`}
                                        title={`Sucesso ${i} (Clique para marcar)`}
                                        style={{ cursor: 'pointer' }}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="death-saves-row">
                            <span style={{ fontSize: '0.75rem', width: '28px' }}>Fal:</span>
                            <div className="checks">
                                {[1, 2, 3].map(i => (
                                    <div
                                        key={i}
                                        onClick={() => toggleDeathSaveFailure(i)}
                                        className={`check-box ${(character.deathSaves?.failures || 0) >= i ? 'filled fail' : ''}`}
                                        title={`Falha ${i} (Clique para marcar)`}
                                        style={{ cursor: 'pointer' }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CONDIÇÕES DE COMBATE (OFICIAL D&D 2024) */}
            <div className="panel-box premium-box">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <h4 className="box-header-gold" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <AlertCircle size={14} />
                        <span>Condições ({character.conditions?.length || 0})</span>
                    </h4>
                    <button
                        type="button"
                        onClick={() => setShowConditionsModal(!showConditionsModal)}
                        style={{ background: 'none', border: 'none', color: '#c5a059', fontSize: '0.75rem', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                        {showConditionsModal ? 'Ocultar' : 'Alterar'}
                    </button>
                </div>

                {showConditionsModal && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', padding: '8px', background: '#12131a', borderRadius: '6px', marginBottom: '8px', border: '1px solid #333' }}>
                        {CONDITIONS_5E.map(cond => {
                            const active = (character.conditions || []).includes(cond);
                            return (
                                <button
                                    key={cond}
                                    type="button"
                                    onClick={() => toggleCondition(cond)}
                                    style={{
                                        padding: '3px 8px',
                                        fontSize: '0.75rem',
                                        borderRadius: '12px',
                                        border: active ? '1px solid #ef4444' : '1px solid #444',
                                        background: active ? '#7f1d1d' : '#222',
                                        color: active ? '#fca5a5' : '#aaa',
                                        cursor: 'pointer',
                                        fontWeight: active ? 'bold' : 'normal',
                                        transition: 'all 0.15s ease'
                                    }}
                                >
                                    {cond}
                                </button>
                            );
                        })}
                    </div>
                )}

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', minHeight: '26px' }}>
                    {(character.conditions || []).length === 0 ? (
                        <span style={{ fontSize: '0.8rem', color: '#666', fontStyle: 'italic' }}>Nenhuma condição ativa.</span>
                    ) : (
                        character.conditions?.map(cond => (
                            <span
                                key={cond}
                                onClick={() => toggleCondition(cond)}
                                title="Clique para remover condição"
                                style={{
                                    background: '#7f1d1d',
                                    color: '#fca5a5',
                                    border: '1px solid #ef4444',
                                    padding: '2px 8px',
                                    borderRadius: '12px',
                                    fontSize: '0.75rem',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                }}
                            >
                                <span>{cond}</span>
                                <X size={11} />
                            </span>
                        ))
                    )}
                </div>
            </div>

            {/* RECURSOS DE CLASSE */}
            {character.classResources && character.classResources.length > 0 && (
                <div className="panel-box premium-box">
                    <h4 className="box-header-gold">Recursos de Classe</h4>
                    <div className="resources-list" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {character.classResources.map((res, i) => (
                            <div key={res.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#1c1d26', padding: '6px 12px', borderRadius: '4px', border: '1px solid #2e3040' }}>
                                <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{res.name}</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <button
                                        onClick={() => onUpdateResource && onUpdateResource(i, Math.max(0, res.current - 1))}
                                        style={{ width: '24px', height: '24px', cursor: 'pointer', background: '#333644', border: 'none', color: '#fff', borderRadius: '4px', fontWeight: 'bold' }}
                                    >-</button>
                                    <span style={{ minWidth: '30px', textAlign: 'center', fontWeight: 'bold', color: '#ffd700' }}>{res.current}</span>
                                    <span style={{ color: '#666' }}>/</span>
                                    <span style={{ minWidth: '20px', textAlign: 'center', color: '#888' }}>{res.max}</span>
                                    <button
                                        onClick={() => onUpdateResource && onUpdateResource(i, Math.min(res.max, res.current + 1))}
                                        style={{ width: '24px', height: '24px', cursor: 'pointer', background: '#333644', border: 'none', color: '#fff', borderRadius: '4px', fontWeight: 'bold' }}
                                    >+</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ATAQUES & MAGIAS */}
            <div className="panel-box premium-box">
                <h4 className="box-header-gold">Ataques & Ações</h4>
                <div className="attacks-table">
                    <div className="atk-row header">
                        <span>Nome</span>
                        <span>Bônus</span>
                        <span>Dano</span>
                    </div>
                    {(character.attacks || []).map(atk => (
                        <div
                            key={atk.id}
                            className="atk-row item"
                            onClick={() => {
                                onRollAttack(atk.name, atk.attackBonus);
                                playSynthSound('sword');
                            }}
                            title="Clique para rolar ataque com arma"
                        >
                            <span className="atk-name">{atk.name}</span>
                            <span className="atk-bonus">{(atk.attackBonus >= 0 ? '+' : '') + atk.attackBonus}</span>
                            <span className="atk-dmg">{atk.damageDice} {atk.damageType}</span>
                        </div>
                    ))}
                    {(!character.attacks || character.attacks.length === 0) && (
                        <div className="empty-msg" style={{ padding: '10px', textAlign: 'center', color: '#777' }}>
                            Sem armas equipadas no inventário
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
});
