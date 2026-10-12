import React, { useState } from 'react';
import { useCombat } from './CombatContext';
import { usePeer } from '../multiplayer/SocketContext';
import { useMap } from '../map/MapContext';
import { rollInitiative } from './combatUtils';
import type { TacticalStatus } from './combatTypes';
import { Shield, FastForward, Eye, Users, SkipForward, Dices, Swords, Crosshair, X } from 'lucide-react';
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
    const { isHost, myCharacter, connectedPlayersData, updateRemotePlayerCharacter } = usePeer();
    const { tokens, updateToken } = useMap();

    const [npcName, setNpcName] = useState('');
    const [npcInit, setNpcInit] = useState('');
    const [npcHp, setNpcHp] = useState('10');

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
        const hpVal = Math.max(1, Number(npcHp) || 10);
        addCombatant({
            id: `npc-${Date.now()}`,
            name: npcName,
            initiative: Number(npcInit) || 0,
            isNPC: true,
            hp: { current: hpVal, max: hpVal },
            status: 'normal'
        });
        setNpcName('');
        setNpcInit('');
        setNpcHp('10');
    };

    const handleCombatantHpDelta = (c: any, delta: number) => {
        const linkedPlayer = c.characterId
            ? Object.values(connectedPlayersData).find(p => p.character?.id === c.characterId)
            : null;
        const linkedChar = linkedPlayer?.character || (myCharacter?.id === c.characterId ? myCharacter : null);
        const max = c.hp?.max ?? linkedChar?.hp?.max ?? 10;
        const cur = c.hp?.current ?? linkedChar?.hp?.current ?? max;
        const newCurrent = Math.max(0, Math.min(max, cur + delta));

        // 1. Atualiza combatente no rastreador (sincroniza COMBAT_UPDATE para todos)
        updateCombatant(c.id, {
            hp: { current: newCurrent, max }
        });

        // 2. Se for personagem de jogador, atualiza a ficha remota (sincroniza PLAYER_UPDATE)
        if (linkedPlayer && linkedPlayer.character) {
            const updatedChar = {
                ...linkedPlayer.character,
                hp: {
                    ...linkedPlayer.character.hp,
                    current: newCurrent,
                    max
                },
                lastModified: Date.now()
            };
            updateRemotePlayerCharacter(linkedPlayer.peerId, updatedChar as any);
        }

        // 3. Se houver token correspondente no mapa de batalha, sincroniza PV do token
        if (tokens && updateToken) {
            const matchingToken = tokens.find(t =>
                t.id === c.id ||
                t.combatantId === c.id ||
                (c.characterId && t.characterId === c.characterId)
            );
            if (matchingToken) {
                updateToken(matchingToken.id, {
                    hp: { current: newCurrent, max }
                });
            }
        }
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
                        <button className="control-btn primary" onClick={startCombat} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                            <Swords size={14} />
                            <span>Iniciar Combate</span>
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
    // All participants see the combat turn order
    const viewList = safeCombatants;

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
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        title="Rolar d20"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const roll = Math.floor(Math.random() * 20) + 1;
                                            updateCombatant(c.id, { initiative: roll, roll, bonus: c.bonus || 0 });
                                        }}
                                    >
                                        <Dices size={14} color="#ffd700" />
                                    </button>
                                </div>
                            ) : (
                                <div className="combatant-init-display">
                                    <span className="combatant-init">
                                        {c.initiative > 0 ? c.initiative : '-'}
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

                            {(() => {
                                const linkedPlayer = c.characterId
                                    ? Object.values(connectedPlayersData).find(p => p.character?.id === c.characterId)
                                    : null;
                                const linkedChar = linkedPlayer?.character || (myCharacter?.id === c.characterId ? myCharacter : null);
                                const hpCurrent = c.hp?.current ?? linkedChar?.hp?.current;
                                const hpMax = c.hp?.max ?? linkedChar?.hp?.max;
                                const hasHp = hpCurrent !== undefined && hpMax !== undefined && hpMax > 0;

                                if (!hasHp) return null;

                                const percent = Math.max(0, Math.min(100, (hpCurrent / hpMax) * 100));
                                const hpBarColor = percent > 50 ? '#4caf50' : percent > 20 ? '#ff9800' : '#f44336';

                                return (
                                    <div className="combatant-hp-section">
                                        <div className="hp-bar-mini" title={`PV: ${hpCurrent}/${hpMax}`}>
                                            <div
                                                className="hp-bar-mini-fill"
                                                style={{ width: `${percent}%`, background: hpBarColor }}
                                            />
                                            <span className="hp-mini-text">{hpCurrent}/{hpMax}</span>
                                        </div>
                                        {isHost && (
                                            <div className="hp-quick-adjust">
                                                <button
                                                    type="button"
                                                    onClick={() => handleCombatantHpDelta(c, -5)}
                                                    title="Dano -5"
                                                    className="hp-adjust-btn dmg"
                                                >-5</button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleCombatantHpDelta(c, -1)}
                                                    title="Dano -1"
                                                    className="hp-adjust-btn dmg"
                                                >-1</button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleCombatantHpDelta(c, 1)}
                                                    title="Cura +1"
                                                    className="hp-adjust-btn heal"
                                                >+1</button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleCombatantHpDelta(c, 5)}
                                                    title="Cura +5"
                                                    className="hp-adjust-btn heal"
                                                >+5</button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })()}

                            <button
                                type="button"
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    opacity: isTargeted ? 1 : 0.4,
                                    marginRight: '6px'
                                }}
                                title={isTargeted ? 'Remover mira' : 'Mirar neste alvo'}
                                onClick={() => setTarget(isTargeted ? null : c.id)}
                            >
                                <Crosshair size={16} color={isTargeted ? '#ef4444' : '#aaa'} />
                            </button>

                            {isHost && (
                                <button className="remove-btn" onClick={() => removeCombatant(c.id)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <X size={12} />
                                </button>
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
                        <button className="control-btn" onClick={() => handleAction('dodge')}>
                            <Shield size={13} style={{ marginRight: '5px' }} /> Esquivar
                        </button>
                        <button className="control-btn" onClick={() => handleAction('dash')}>
                            <FastForward size={13} style={{ marginRight: '5px' }} /> Disparada
                        </button>
                        <button className="control-btn" onClick={() => handleAction('hide')}>
                            <Eye size={13} style={{ marginRight: '5px' }} /> Esconder
                        </button>
                        <button className="control-btn" onClick={() => handleAction('help')}>
                            <Users size={13} style={{ marginRight: '5px' }} /> Ajudar
                        </button>
                    </div>
                    <button
                        className="control-btn primary"
                        style={{ marginTop: '8px', width: '100%', background: '#2c5e3b', borderColor: '#438a56', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                        onClick={nextTurn}
                        title="Passar vez para o próximo combatente"
                    >
                        <SkipForward size={14} /> Encerrar Meu Turno
                    </button>
                </div>
            )}

            {!hasRolled && isMyCharacter && !isMyTurn && (
                <div className="tracker-controls">
                    <button className="control-btn primary" onClick={handleRollInitiative} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', width: '100%' }}>
                        <Dices size={14} /> Rolar Iniciativa
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
                        <input className="npc-input" type="number" placeholder="Inic." style={{ width: '50px' }} value={npcInit} onChange={e => setNpcInit(e.target.value)} />
                        <input className="npc-input" type="number" placeholder="PV" style={{ width: '50px' }} value={npcHp} onChange={e => setNpcHp(e.target.value)} />
                        <button className="control-btn" onClick={handleAddNPC} title="Adicionar NPC ao Combate">+</button>
                    </div>

                    <button className="control-btn danger" style={{ marginTop: 5 }} onClick={endCombat}>Parar Combate</button>
                </div>
            )}
        </div>
    );
};
