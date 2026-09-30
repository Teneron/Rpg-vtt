import React from 'react';
import { usePeer } from '../multiplayer/FirebaseContext';
import { Soundboard } from '../audio/Soundboard';

import { ErrorBoundary } from '../../components/ErrorBoundary';
import { useMap } from '../map/MapContext';
import { SceneList } from '../map/SceneList';
import { CharacterSheet } from '../character/CharacterSheet';
import './GMScreen.css';

export const GMScreen: React.FC = () => {
    const { connectedPlayersData, connections, removePlayer, peerId, triggerForceRefresh } = usePeer(); // Keeping connections as it's used later in the original file
    const [editingCharacterId, setEditingCharacterId] = React.useState<string | null>(null);

    const { addToken } = useMap();

    const players = React.useMemo(() => {
        const allPlayers = Object.values(connectedPlayersData);

        // Group by Name to find duplicates (Ghost sessions vs Active session)
        const groupedByName: Record<string, typeof allPlayers> = {};
        allPlayers.forEach(p => {
            const name = p.character?.name || p.name || 'Unknown';
            if (!groupedByName[name]) groupedByName[name] = [];
            groupedByName[name].push(p);
        });

        const deduplicated: typeof allPlayers = [];
        Object.values(groupedByName).forEach(group => {
            // If group has only 1, keep it.
            if (group.length === 1) {
                deduplicated.push(group[0]);
                return;
            }

            // If duplicates, prefer Online.
            const online = group.find(p => p.isOnline);
            if (online) {
                deduplicated.push(online);
            } else {
                // All offline? Just keep the latest one (or first).
                deduplicated.push(group[0]);
            }
        });

        return deduplicated.sort((a, b) => {
            if (a.isOnline === b.isOnline) return 0;
            return a.isOnline ? -1 : 1;
        });
    }, [connectedPlayersData]);

    const handleSpawnToken = (character: any) => {
        // Check if already exists?
        // Let's allow multiples for now, or check by ID.

        addToken({
            id: crypto.randomUUID(),
            characterId: character.id,
            name: character.name,
            color: '#c5a059', // Class color?
            position: { x: 2, y: 2 }, // Default spawn
            size: 1, // Size based on size?
            imageUrl: '' // TODO: Avatar URL if we have it
        });


    };

    return (
        <div className="gm-screen-panel">
            <h2 style={{ color: '#c5a059', borderBottom: '1px solid #444', paddingBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Escudo do Mestre</span>
                <button
                    onClick={() => triggerForceRefresh && triggerForceRefresh()}
                    title="Forçar todos os jogadores a recarregar (usar após Deploy)"
                    style={{ fontSize: '0.8rem', padding: '4px 8px', background: '#442', border: '1px solid #774', color: '#ffc', cursor: 'pointer', borderRadius: '4px' }}
                >
                    🔄 Update
                </button>
            </h2>

            <ErrorBoundary name="Soundboard">
                <Soundboard />
            </ErrorBoundary>

            <ErrorBoundary name="SceneList">
                <SceneList />
            </ErrorBoundary>

            <div className="gm-stats-summary">
                <div className="stat-card">
                    <span className="label">Jogadores Conectados</span>
                    <span className="value">{connections.length + 1}</span>
                </div>
                {/* Future: Add more campaign stats here */}
            </div>

            <h3>Jogadores ({players.length})</h3>

            {players.length === 0 ? (
                <div style={{ padding: '20px', color: '#666', fontStyle: 'italic' }}>
                    Nenhum dado de jogador sincronizado ainda. Peça para eles abrirem a ficha.
                </div>
            ) : (
                <div className="gm-players-grid">
                    {players.map(p => {
                        const { character } = p;
                        if (!character) return (
                            <div key={p.peerId} className="gm-player-card" style={{ opacity: 0.5 }}>
                                <div className="card-header">
                                    <strong>{p.name}</strong>
                                    <small>(Sem Ficha)</small>
                                </div>
                                <div className="card-actions">
                                    {p.peerId !== peerId && (
                                        <button
                                            onClick={() => removePlayer(p.peerId)}
                                            title="Remover Jogador da Campanha"
                                            style={{ background: '#500', borderColor: '#700', color: '#faa', width: '100%' }}
                                        >
                                            🗑️ Remover
                                        </button>
                                    )}
                                </div>
                            </div>
                        );

                        const hpCurrent = character.hp?.current || 0;
                        const hpMax = character.hp?.max || 1;
                        const hpPercent = (hpCurrent / hpMax) * 100;
                        const hpColor = hpPercent > 50 ? '#4caf50' : hpPercent > 20 ? '#ff9800' : '#f44336';

                        return (
                            <div key={p.peerId} className="gm-player-card" style={{ opacity: p.isOnline ? 1 : 0.5 }}>
                                <div className="card-header">
                                    <strong>{character.name || p.name}</strong>
                                    <small>
                                        {!p.isOnline && <span style={{ color: '#ff4444', marginRight: '5px' }}>[OFF]</span>}
                                        {character.race} {character.class} {character.level}
                                    </small>
                                </div>

                                <div className="card-body">
                                    <div className="gm-stat-row">
                                        <label>PV</label>
                                        <div className="hp-bar-container">
                                            <div className="hp-bar-fill" style={{ width: `${hpPercent}%`, background: hpColor }}></div>
                                            <span className="hp-text">{hpCurrent} / {hpMax}</span>
                                        </div>
                                    </div>

                                    <div className="gm-stat-grid">
                                        <div className="gm-stat-box" title="Armor Class">
                                            <label>CA</label>
                                            <span>{character.armorClass || 10}</span>
                                        </div>
                                        <div className="gm-stat-box" title="Passive Perception">
                                            <label>PP</label>
                                            <span>{10 + ((character.skills || []).find(s => s.name === 'Percepção')?.value || 0)}</span>
                                        </div>
                                        <div className="gm-stat-box" title="Spell Save DC">
                                            <label>CD</label>
                                            <span>{character.spellSaveDC || 10}</span>
                                        </div>
                                        <div className="gm-stat-box" title="Speed">
                                            <label>Vel</label>
                                            <span>{character.speed || 9}m</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="card-actions">
                                    <button
                                        onClick={() => handleSpawnToken(character)}
                                        title="Criar Token no Mapa"
                                    >
                                        Spawn Token
                                    </button>
                                    {p.peerId !== peerId && (
                                        <button
                                            onClick={() => removePlayer(p.peerId)}
                                            title="Remover Ficha da Campanha"
                                            style={{ background: '#500', borderColor: '#700', color: '#faa' }}
                                        >
                                            🗑️
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* EDIT MODAL */}
            {
                editingCharacterId && (
                    <div className="modal-overlay" style={{ zIndex: 2000 }}>
                        <div style={{ width: '95vw', height: '95vh', background: '#111', border: '1px solid #444', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                            <CharacterSheet
                                characterId={editingCharacterId}
                                isGM={true}
                                onExit={() => setEditingCharacterId(null)}
                            />
                        </div>
                    </div>
                )
            }
        </div >
    );
};
