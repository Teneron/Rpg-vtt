import React, { useState, useEffect } from 'react';
import type { Monster } from './monsterTypes';
import { useMap } from '../map/MapContext';
import { useCombat } from '../combat/CombatContext';

interface EditableMonsterSheetProps {
    tokenId: string;
    monster: Monster;
    onClose: () => void;
}

export const EditableMonsterSheet: React.FC<EditableMonsterSheetProps> = ({ tokenId, monster, onClose }) => {
    const { tokens, updateToken } = useMap();
    const { combatState, updateCombatant } = useCombat();

    // Local State for Editing
    const [hpCurrent, setHpCurrent] = useState(0);
    const [hpMax, setHpMax] = useState(10);
    const [ac, setAc] = useState(10);

    // Identify Source of Truth
    const token = tokens.find(t => t.id === tokenId);
    const combatant = (combatState.combatants || []).find(c =>
        (token && (c.id === token.id || c.id === token.combatantId)) ||
        (token?.characterId && c.characterId === token.characterId)
    );

    // Ref to track external values and prevent overwriting local edits
    // unless the external value ACTUALLY changed (e.g. damage taken).
    const prevExternalState = React.useRef({
        hpCurrent: -999,
        hpMax: -999,
        ac: -999
    });

    // Initial Load & Sync Logic
    useEffect(() => {
        let newHpCurrent, newHpMax, newAc;

        if (combatant) {
            newHpCurrent = combatant.hp?.current ?? (monster.hp.max || 10);
            newHpMax = combatant.hp?.max ?? (monster.hp.max || 10);
            newAc = combatant.ac ?? monster.ac;
        } else if (token) {
            newHpCurrent = token.hp?.current ?? (monster.hp.max || 10);
            newHpMax = token.hp?.max ?? (monster.hp.max || 10);
            newAc = token.ac ?? monster.ac;
        } else {
            newHpCurrent = monster.hp.max || 10;
            newHpMax = monster.hp.max || 10;
            newAc = monster.ac;
        }

        // Only update local state if EXTERNAL value changed from what we last saw
        const prev = prevExternalState.current;

        if (newHpCurrent !== prev.hpCurrent) {
            setHpCurrent(newHpCurrent);
            prev.hpCurrent = newHpCurrent;
        }
        if (newHpMax !== prev.hpMax) {
            setHpMax(newHpMax);
            prev.hpMax = newHpMax;
        }
        if (newAc !== prev.ac) {
            setAc(newAc);
            prev.ac = newAc;
        }

    }, [tokenId, combatant, token, monster]);

    const handleSave = () => {
        // Update Ref so we don't re-trigger ourselves when the prop comes back
        prevExternalState.current = {
            hpCurrent,
            hpMax,
            ac
        };

        // 1. Update Combatant (if exists)
        if (combatant) {
            updateCombatant(combatant.id, {
                hp: { current: hpCurrent, max: hpMax },
                ac: ac
            });
        }

        // 2. Update Map Token (Always)
        if (token) {
            updateToken(tokenId, {
                ...token,
                hp: { current: hpCurrent, max: hpMax },
                ac: ac
            });
        }
    };

    // Auto-save on blur logic
    const handleBlur = () => {
        handleSave();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            (e.target as HTMLInputElement).blur(); // Trigger blur to save
        }
    };

    return (
        <div style={{
            background: '#1a1a1a',
            border: '1px solid #8B0000',
            borderRadius: '8px',
            padding: '15px',
            color: '#eee',
            fontFamily: 'Segoe UI, sans-serif',
            width: '320px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.8)',
            position: 'relative'
        }}>
            <button
                onClick={onClose}
                style={{
                    position: 'absolute', top: '5px', right: '5px',
                    background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer'
                }}
            >
                ✕
            </button>

            {/* Header */}
            <div style={{ borderBottom: '2px solid #8B0000', paddingBottom: '10px', marginBottom: '15px' }}>
                <h2 style={{ margin: 0, color: '#c5a059', fontSize: '1.4rem' }}>{monster.name}</h2>
                <div style={{ fontSize: '0.9rem', color: '#aaa', marginTop: '4px' }}>
                    {monster.size} {monster.category} • CR {monster.cr}
                </div>
            </div>

            {/* Editable Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>

                {/* HP Section */}
                <div style={{ background: '#222', padding: '10px', borderRadius: '6px', textAlign: 'center' }}>
                    <label style={{ display: 'block', color: '#8B0000', fontWeight: 'bold', marginBottom: '5px' }}>HP (Vida)</label>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                        <input
                            type="number"
                            value={hpCurrent}
                            onChange={(e) => setHpCurrent(Number(e.target.value))}
                            onBlur={handleBlur}
                            onKeyDown={handleKeyDown}
                            style={{
                                width: '50px', background: '#333', border: '1px solid #555', color: '#fff',
                                textAlign: 'center', fontSize: '1.1rem', borderRadius: '4px', padding: '4px'
                            }}
                        />
                        <span style={{ color: '#aaa' }}>/</span>
                        <input
                            type="number"
                            value={hpMax}
                            onChange={(e) => setHpMax(Number(e.target.value))}
                            onBlur={handleBlur}
                            onKeyDown={handleKeyDown}
                            style={{
                                width: '50px', background: '#333', border: '1px solid #555', color: '#aaa',
                                textAlign: 'center', fontSize: '1rem', borderRadius: '4px', padding: '4px'
                            }}
                        />
                    </div>
                </div>

                {/* AC Section */}
                <div style={{ background: '#222', padding: '10px', borderRadius: '6px', textAlign: 'center' }}>
                    <label style={{ display: 'block', color: '#8B0000', fontWeight: 'bold', marginBottom: '5px' }}>AC (Defesa)</label>
                    <input
                        type="number"
                        value={ac}
                        onChange={(e) => setAc(Number(e.target.value))}
                        onBlur={handleBlur}
                        onKeyDown={handleKeyDown}
                        style={{
                            width: '60px', background: '#333', border: '1px solid #555', color: '#fff',
                            textAlign: 'center', fontSize: '1.4rem', fontWeight: 'bold', borderRadius: '4px', padding: '4px'
                        }}
                    />
                </div>
            </div>

            {/* Sync Indicator */}
            <div style={{ fontSize: '0.8rem', color: '#666', textAlign: 'center', fontStyle: 'italic' }}>
                {combatant ? "🔄 Sincronizado com Combate" : "📝 Editando Token (Fora de Combate)"}
            </div>

            <hr style={{ borderColor: '#333', margin: '15px 0' }} />

            {/* Quick Actions (Read Only for Reference) */}
            <div>
                <h3 style={{ borderBottom: '1px solid #444', color: '#8B0000', margin: '0 0 10px 0', fontSize: '1.1rem' }}>Ações ({monster.actions?.length || 0})</h3>
                <div style={{ maxHeight: '150px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {monster.actions?.map((action, idx) => (
                        <div key={idx}>
                            <div style={{ marginBottom: '2px' }}>
                                <strong style={{ color: '#fff' }}>{action.name}.</strong>
                            </div>
                            <div style={{ fontSize: '0.85rem', color: '#ccc' }}>
                                {action.description}
                            </div>
                        </div>
                    ))}
                    {(!monster.actions || monster.actions.length === 0) && (
                        <div style={{ color: '#777', fontStyle: 'italic' }}>Sem ações cadastradas.</div>
                    )}
                </div>
            </div>

        </div>
    );
};
