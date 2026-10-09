
import React, { useState } from 'react';
import { D4Icon, D6Icon, D8Icon, D10Icon, D12Icon, D20Icon } from './DieIcons';
import { useDice } from './DiceContext';
import './DiceRoller.css';
import { DiceScene } from './DiceScene';
import { usePeer } from '../multiplayer/FirebaseContext';
import { Users } from 'lucide-react';


interface DieDefinition {
    type: string;
    sides: number;
    icon: React.FC<any>;
    label: string;
}

const DICE_TYPES: DieDefinition[] = [
    { type: 'd4', sides: 4, icon: D4Icon, label: 'D4' },
    { type: 'd6', sides: 6, icon: D6Icon, label: 'D6' },
    { type: 'd8', sides: 8, icon: D8Icon, label: 'D8' },
    { type: 'd10', sides: 10, icon: D10Icon, label: 'D10' },
    { type: 'd12', sides: 12, icon: D12Icon, label: 'D12' },
    { type: 'd20', sides: 20, icon: D20Icon, label: 'D20' },
];

/**
 * GLOBAL OVERLAY: Renders the 3D Scene and Floating Notifications.
 * Should be mounted once at App root.
 */
export const DiceOverlay: React.FC = () => {
    const { rollingDice, finishRoll } = useDice();

    // Only mount/render the scene if there are dice to show.
    // This improves performance when not rolling.
    if (rollingDice.length === 0) return null;

    return (
        <div style={{ pointerEvents: 'none', position: 'fixed', inset: 0, zIndex: 9999 }}>
            <DiceScene dice={rollingDice} onRollComplete={finishRoll} />
        </div>
    );
};

/**
 * SIDEBAR CONTROLS: Renders the Dice Selection and Roll Button.
 * Should be mounted in the Sidebar.
 */
export const DiceSidebar: React.FC = () => {
    const { triggerRoll, rollResult, isRolling } = useDice();
    const { connections } = usePeer();
    const [selectedDice, setSelectedDice] = useState<Record<string, number>>({});
    const [modifier, setModifier] = useState<number>(0);

    const toggleDie = (type: string, increment: boolean) => {
        setSelectedDice(prev => {
            const current = prev[type] || 0;
            const newValue = increment ? current + 1 : Math.max(0, current - 1);
            if (newValue === 0) {
                const { [type]: _, ...rest } = prev;
                return rest;
            }
            return { ...prev, [type]: newValue };
        });
    };

    const handleRoll = () => {
        triggerRoll(selectedDice, modifier);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', color: '#fff' }}>
            {/* Header / Player Count */}
            <div style={{
                textAlign: 'center', padding: '10px',
                borderBottom: '1px solid #444', background: '#222',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
                <span style={{ fontWeight: 'bold', color: '#ffaa00' }}>BANDEJA DE DADOS</span>
                <div style={{ fontSize: '0.8rem', color: '#888', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Users size={14} color="#22c55e" />
                    <span>{connections.length + 1} {connections.length + 1 === 1 ? 'Jogador' : 'Jogadores'}</span>
                </div>
            </div>

            <div style={{ flex: 1, padding: '15px', display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto' }}>

                {/* Result Box */}
                <div style={{
                    background: '#111', border: '1px solid #555', borderRadius: '4px',
                    padding: '15px', textAlign: 'center', minHeight: '100px',
                    display: 'flex', flexDirection: 'column', justifyContent: 'center'
                }}>
                    {rollResult !== null ? (
                        <>
                            <div style={{ fontSize: '0.9rem', color: '#888', textTransform: 'uppercase' }}>Resultado</div>

                            {/* Breakdown Equation */}
                            <div style={{ fontSize: '1rem', color: '#ccc', marginBottom: '5px' }}>
                                {rollResult.breakdown?.join(' + ') || rollResult.total}
                                {rollResult.modifier !== 0 && (
                                    <span style={{ color: rollResult.modifier > 0 ? '#4caf50' : '#f44336' }}>
                                        {rollResult.modifier > 0 ? ` + ${rollResult.modifier}` : ` - ${Math.abs(rollResult.modifier)}`}
                                    </span>
                                )}
                                {' ='}
                            </div>

                            <div style={{ fontSize: '3.5rem', fontWeight: 'bold', color: '#fff', lineHeight: '1.1' }}>
                                {rollResult.total}
                            </div>
                        </>
                    ) : (
                        <div style={{ color: '#444' }}>Pronto</div>
                    )}
                </div>

                {/* Dice Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                    {DICE_TYPES.map(type => (
                        <button
                            key={type.type}
                            onClick={() => toggleDie(type.type, true)}
                            onContextMenu={(e) => { e.preventDefault(); toggleDie(type.type, false); }}
                            style={{
                                aspectRatio: '1',
                                background: selectedDice[type.type] > 0 ? '#4a5d7e' : '#2b2b2b',
                                border: '1px solid #000',
                                color: '#fff',
                                borderRadius: '3px',
                                cursor: 'pointer',
                                position: 'relative',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                            }}
                        >
                            <span style={{ fontWeight: 'bold' }}>{type.label}</span>
                            {selectedDice[type.type] > 0 &&
                                <span style={{
                                    position: 'absolute', top: '2px', right: '2px',
                                    fontSize: '0.7rem', background: '#000', padding: '0 4px', borderRadius: '4px'
                                }}>
                                    {selectedDice[type.type]}
                                </span>
                            }
                        </button>
                    ))}
                </div>

                {/* Modifier Row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#222', padding: '5px 10px', border: '1px solid #444', borderRadius: '3px' }}>
                    <span style={{ fontSize: '0.9rem', color: '#ccc' }}>Modificador</span>
                    <input
                        type="number" value={modifier}
                        onChange={(e) => setModifier(parseInt(e.target.value) || 0)}
                        style={{ width: '50px', background: 'transparent', border: 'none', color: '#fff', textAlign: 'right', fontWeight: 'bold' }}
                    />
                </div>

                <div style={{ flex: 1 }} />

                {/* Roll Button */}
                <button
                    onClick={handleRoll}
                    disabled={isRolling || Object.keys(selectedDice).length === 0}
                    style={{
                        padding: '12px',
                        background: 'linear-gradient(to bottom, #ffaa00, #cc8800)',
                        color: '#000', fontWeight: 'bold', fontSize: '1.1rem',
                        border: '1px solid #ffaa00', borderRadius: '3px',
                        cursor: 'pointer', textTransform: 'uppercase',
                        opacity: isRolling ? 0.6 : 1
                    }}
                >
                    {isRolling ? 'Rolando...' : 'Rolar Dados'}
                </button>

                {/* HISTORY MOVED TO CHAT */}
                <div style={{ marginTop: '20px', borderTop: '1px solid #444', paddingTop: '10px' }}>
                    <div style={{ textAlign: 'center', color: '#666', fontSize: '0.8rem' }}>
                        Os resultados agora aparecem no Chat Global para todos verem.
                    </div>
                </div>

            </div>
        </div>
    );
};

