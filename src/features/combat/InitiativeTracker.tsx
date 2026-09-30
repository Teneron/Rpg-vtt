import React, { useState } from 'react';
import { useCombat } from './CombatContext';
import { usePeer } from '../multiplayer/FirebaseContext';
import './InitiativeTracker.css';

export const InitiativeTracker: React.FC = () => {
    const { combatState, nextTurn, previousTurn, addCombatant, removeCombatant, updateCombatant, sortCombatants, resetRound, startCombat, endCombat } = useCombat();
    const { isHost } = usePeer();

    const [npcName, setNpcName] = useState('');
    const [npcInit, setNpcInit] = useState('');

    const { myCharacter } = usePeer();

    // Check if my character is already in combat
    const isMyCharacter = !!myCharacter;
    // Safety check
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

        const dex = myCharacter.attributes.dex.value;
        const mod = Math.floor((dex - 10) / 2);
        const roll = Math.floor(Math.random() * 20) + 1;
        const total = roll + mod;

        // Broadcast Roll (Still good to have in DiceHistory, even if we don't spam Chat with "Turns")
        const event = new CustomEvent('rpg_broadcast_roll', {
            detail: {
                formula: '1d20 + DEX',
                total,
                rolls: [roll],
                modifier: mod,
                reason: 'Iniciativa'
            }
        });
        window.dispatchEvent(event);

        if (myCombatant) {
            updateCombatant(myCombatant.id, { initiative: total, roll, bonus: mod });
        } else {
            addCombatant({
                id: myCharacter.id,
                characterId: myCharacter.id,
                name: myCharacter.name,
                initiative: total,
                roll,
                bonus: mod,
                isNPC: false,
                status: 'normal',
                imageUrl: myCharacter.imageUrl
            });
        }
    };

    const handleAction = (action: 'dodge' | 'dash' | 'hide' | 'help' | 'ready') => {
        if (!myCombatant) return;

        const statusMap = {
            dodge: 'dodging',
            dash: 'dashing',
            hide: 'hiding',
            help: 'help',
            ready: 'ready'
        };

        // Update my status
        updateCombatant(myCombatant.id, { status: statusMap[action] as any });
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
    // STRICT PRIVACY: Players only see themselves. Host sees everyone.
    const viewList = isHost
        ? safeCombatants
        : safeCombatants.filter(c => myCharacter && (c.id === myCharacter.id || c.characterId === myCharacter.id));

    return (
        <div className="initiative-tracker">
            <div className="tracker-header">
                <h3>Iniciativa</h3>
                <span className="round-counter">Round {combatState.round}</span>
            </div>

            {/* ACTIVE TURN BANNER with Privacy */}
            {activeCombatant && (
                <div className="turn-banner">
                    {/* If Host: Show Name. If Me: Show "SEU TURNO!". If Other: Show "Turno de: [Generic]" depending on desire, 
                        BUT User said "nao enxergar quem esta no combate". 
                        Maybe "Turno de: Outro Combatente"? Or just keep "Turno de: [Name]"?
                        Actually, "Quem está no combate" usually refers to the roster. 
                        Knowing WHO makes the move is crucial (narrative).
                        Let's keep the name for now, as "Who is acting" is public info usually.
                        Wait, if "não enxergar quem está", maybe even the name is hidden?
                        Let's default to "Turno em Andamento" if not me/host?
                        Let's stick to showing name unless instructed otherwise, strict privacy usually means just the list/stats.
                        But I will respect "apenas a propria iniciativa".
                    */}
                    {activeCombatant.id === myCombatant?.id
                        ? "SEU TURNO!"
                        : (isHost ? `Turno de: ${activeCombatant.name}` : `Turno: ${activeCombatant.isNPC ? 'Inimigo/NPC' : activeCombatant.name}`)}
                </div>
            )}

            <ul className="combatant-list">
                {viewList.map(c => {
                    const isMe = myCharacter && (c.id === myCharacter.id || c.characterId === myCharacter.id);
                    const isActive = combatState.activeTurnId === c.id;

                    return (
                        <li key={c.id} className={`combatant-item ${isActive ? 'active' : ''} ${isMe ? 'is-me' : ''}`}>
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
                                            updateCombatant(c.id, { initiative: roll });
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
                                </div>
                            </div>

                            {isHost && (
                                <button className="remove-btn" onClick={() => removeCombatant(c.id)}>×</button>
                            )}
                        </li>
                    );
                })}
            </ul>

            {/* PLAYER CONTROLS (ACTIONS) */}
            {isMyTurn && (
                <div className="tracker-controls">
                    <label style={{ color: '#c5a059', fontSize: '0.8rem', textTransform: 'uppercase' }}>Ações de Combate</label>
                    <div className="action-grid">
                        <button className="control-btn" onClick={() => handleAction('dodge')}>🛡️ Esquivar</button>
                        <button className="control-btn" onClick={() => handleAction('dash')}>💨 Disparada</button>
                        <button className="control-btn" onClick={() => handleAction('hide')}>👁️ Esconder</button>
                        <button className="control-btn" onClick={() => handleAction('help')}>🤝 Ajudar</button>
                    </div>
                    {/* Add End Turn button for player? Usually GM controls flow, but nice to notify "Done" */}
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
