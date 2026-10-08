import React, { useState } from 'react';
import { useCombat } from './CombatContext';
import { usePeer } from '../multiplayer/FirebaseContext';
import { rollInitiative } from './combatUtils';
import type { TacticalStatus } from './combatTypes';
import './InitiativeTracker.css';

export const InitiativeTracker: React.FC = () => {
    const {
        combatState,
        nextTurn,
        previousTurn,
        addCombatant,
        removeCombatant,
        updateCombatant,
        sortCombatants,
        resetRound,
        startCombat,
        endCombat,
        setTarget
    } = useCombat();
    const { isHost, myCharacter } = usePeer();

    const [npcName, setNpcName] = useState('');
    const [npcInit, setNpcInit] = useState('');

    // Check if my character is already in combat
    const isMyCharacter = !!myCharacter;
    const safeCombatants = combatState.combatants || [];

    // Find "My" Participation
    const myCombatant = safeCombatants.find(c => c.characterId === myCharacter?.id);
    const hasRolled = myCombatant ? myCombatant.initiative > 0 : false;

    // Is it My Turn?
    const isMyTurn = myCombatant && combatState.activeTurnId === myCombatant.id;

    // Find Active Combatant Name
    const activeCombatant = safeCombatants.find(c => c.id === combatState.activeTurnId);

    // --- HANDLERS ---
    const handleAddNPC = () => {
        if (!npcName) return;
        addCombatant({
            id: `npc-${Date.now()}`,
            name: npcName,
            initiative: Number(npcInit) || 0,
            isNPC: true,
            status: 'normal'
        });
        setNpcName('');
        setNpcInit('');
    };

    const handleRollInitiative = () => {
        if (!myCharacter) return;

        // Agnostic initiative calculation (supports 5e, Witcher, generic sheets safely)
        const { bonus, roll, total, formula } = rollInitiative(myCharacter);

        // Broadcast Roll for 3D dice, chat and history sync
        const event = new CustomEvent('rpg_broadcast_roll', {
            detail: {
                formula,
                total,
                rolls: [roll],
                modifier: bonus,
                reason: 'Iniciativa'
            }
        });
        window.dispatchEvent(event);

        if (myCombatant) {
            updateCombatant(myCombatant.id, { initiative: total, roll, bonus });
        } else {
            addCombatant({
                id: myCharacter.id,
                characterId: myCharacter.id,
                name: myCharacter.name,
                initiative: total,
                roll,
                bonus,
                isNPC: false,
                status: 'normal',
                imageUrl: myCharacter.imageUrl
            });
        }
    };

    const handleAction = (action: 'dodge' | 'dash' | 'hide' | 'help' | 'ready' | 'defending') => {
        if (!myCombatant) return;

        const statusMap: Record<string, TacticalStatus> = {
            dodge: 'dodging',
            dash: 'dashing',
            hide: 'hiding',
            help: 'help',
            ready: 'ready',
            defending: 'defending'
        };

        updateCombatant(myCombatant.id, { status: statusMap[action] || 'normal' });
    };

    // --- RENDER INACTIVE ---
    if (!combatState.isActive) {
        if (isHost) {
            return (
                <div className="initiative-tracker inactive">
                    <div style={{ padding: '20px', textAlign: 'center' }}>
                        <p style={{ color: '#888' }}>Combate Inativo</p>
                        <button className="control-btn primary" onClick={startCombat}>
                            ⚔️ Iniciar Combate
                        </button>
                    </div>
                </div>
            );
        }
        return (
            <div className="inactive-message">
                Aguardando Início do Combate...
            </div>
        );
    }

    // --- RENDER ACTIVE ---
    // Privacy: Players only see themselves. Host sees everyone.
    const viewList = isHost
        ? safeCombatants
        : safeCombatants.filter(c => myCharacter && (c.id === myCharacter.id || c.characterId === myCharacter.id));

    return (
        <div className="initiative-tracker">
            <div className="tracker-header">
                <h3>Iniciativa</h3>
                <span className="round-counter">Round {combatState.round}</span>
            </div>

            {/* ACTIVE TURN BANNER */}
            {activeCombatant && (
                <div className="turn-banner">
                    {activeCombatant.id === myCombatant?.id
                        ? 'SEU TURNO!'
                        : (isHost ? `Turno de: ${activeCombatant.name}` : `Turno: ${activeCombatant.isNPC ? 'Inimigo/NPC' : activeCombatant.name}`)}
                </div>
            )}

            <ul className="combatant-list">
                {viewList.map(c => {
                    const isMe = myCharacter && (c.id === myCharacter.id || c.characterId === myCharacter.id);
                    const isActive = combatState.activeTurnId === c.id;
                    const isTargeted = combatState.currentTargetId === c.id;

                    return (
                        <li key={c.id} className={`combatant-item ${isActive ? 'active' : ''} ${isMe ? 'is-me' : ''} ${isTargeted ? 'targeted' : ''}`}>
                            {isHost ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <input
                                        className="combatant-init-input"
                                        type="number"
                                        value={c.initiative}
                                        onChange={(e) => updateCombatant(c.id, { initiative: Number(e.target.value) })}
                                    />
                                    <button
                                        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                                        title="Rolar d20"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const roll = Math.floor(Math.random() * 20) + 1;
                                            updateCombatant(c.id, { initiative: roll, roll, bonus: c.bonus || 0 });
                                        }}
                                    >
                                        🎲
                                    </button>
                                </div>
                            ) : (
                                <div className="combatant-init-display">
                                    <span className="combatant-init">
                                        {isMe ? c.initiative : (c.initiative > 0 ? '?' : '-')}
                                    </span>
                                </div>
                            )}

                            <div className="combatant-info">
                                <span className="combatant-name">{c.name}</span>
                                <div className="combatant-status">
                                    {c.status === 'dodging' && <span className="status-tag dodging">Esquiva</span>}
                                    {c.status === 'dashing' && <span className="status-tag dashing">Disparada</span>}
                                    {c.status === 'hiding' && <span className="status-tag hiding">Escondido</span>}
                                    {c.status === 'ready' && <span className="status-tag ready">Preparado</span>}
                                    {c.status === 'defending' && <span className="status-tag defending">Defesa</span>}
                                </div>
                            </div>

                            <button
                                type="button"
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '1rem',
                                    opacity: isTargeted ? 1 : 0.4,
                                    marginRight: '6px'
                                }}
                                title={isTargeted ? 'Remover mira' : 'Mirar neste alvo'}
                                onClick={() => setTarget(isTargeted ? null : c.id)}
                            >
                                🎯
                            </button>

                            {isHost && (
                                <button className="remove-btn" onClick={() => removeCombatant(c.id)}>×</button>
                            )}
                        </li>
                    );
                })}
            </ul>

            {/* PLAYER CONTROLS (ACTIONS & END TURN) */}
            {isMyTurn && (
                <div className="tracker-controls">
                    <label style={{ color: '#c5a059', fontSize: '0.8rem', textTransform: 'uppercase' }}>Ações de Combate</label>
                    <div className="action-grid">
                        <button className="control-btn" onClick={() => handleAction('dodge')}>🛡️ Esquivar</button>
                        <button className="control-btn" onClick={() => handleAction('dash')}>💨 Disparada</button>
                        <button className="control-btn" onClick={() => handleAction('hide')}>👁️ Esconder</button>
                        <button className="control-btn" onClick={() => handleAction('help')}>🤝 Ajudar</button>
                    </div>
                    <button
                        className="control-btn primary"
                        style={{ marginTop: '8px', width: '100%', background: '#2c5e3b', borderColor: '#438a56' }}
                        onClick={nextTurn}
                        title="Passar vez para o próximo combatente"
                    >
                        ⏭️ Encerrar Meu Turno
                    </button>
                </div>
            )}

            {!hasRolled && isMyCharacter && !isMyTurn && (
                <div className="tracker-controls">
                    <button className="control-btn primary" onClick={handleRollInitiative}>
                        🎲 Rolar Iniciativa
                    </button>
                </div>
            )}

            {/* GM CONTROLS */}
            {isHost && (
                <div className="tracker-controls">
                    <div className="control-row">
                        <button className="control-btn" onClick={previousTurn}>Prev</button>
                        <button className="control-btn primary" onClick={nextTurn}>Próximo Turno (Next)</button>
                    </div>
                    <div className="control-row">
                        <button className="control-btn" onClick={sortCombatants}>Ordenar (Sort)</button>
                        <button className="control-btn danger" onClick={resetRound}>Reset</button>
                    </div>

                    <div className="npc-input-row">
                        <input className="npc-input" placeholder="NPC Nome" value={npcName} onChange={e => setNpcName(e.target.value)} />
                        <input className="npc-input" type="number" placeholder="Inic." style={{ width: '60px' }} value={npcInit} onChange={e => setNpcInit(e.target.value)} />
                        <button className="control-btn" onClick={handleAddNPC}>+</button>
                    </div>

                    <button className="control-btn danger" style={{ marginTop: 5 }} onClick={endCombat}>Parar Combate</button>
                </div>
            )}
        </div>
    );
};
