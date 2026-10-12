import React from 'react';
import { usePeer } from '../multiplayer/SocketContext';
import { Soundboard } from '../audio/Soundboard';
import { RefreshCw, Shield, Copy, Check, Link2, Trash2, FileText, Users, UserCheck, MapPin, TrendingUp } from 'lucide-react';
import { getMinXPForLevel, regenerateCharacterStats, type Character } from '../character/characterTypes';
import { playSynthSound } from '../audio/audioSynth';

import { ErrorBoundary } from '../../components/ErrorBoundary';
import { useMap } from '../map/MapContext';
import { useCombat } from '../combat/CombatContext';
import { SceneList } from '../map/SceneList';
import { CharacterSheet } from '../character/CharacterSheet';
import './GMScreen.css';

export const GMScreen: React.FC = () => {
    const { connectedPlayersData, removePlayer, peerId, triggerForceRefresh, currentAdventureId, updateRemotePlayerCharacter } = usePeer();
    const [editingPlayer, setEditingPlayer] = React.useState<{ peerId: string; name: string; character: any } | null>(null);
    const [copiedCode, setCopiedCode] = React.useState(false);
    const [copiedLink, setCopiedLink] = React.useState(false);

    const { addToken, updateToken, tokens } = useMap();
    const { combatState, updateCombatant } = useCombat();

    // Filtra exclusivamente os jogadores reais na mesa (exclui o próprio Mestre)
    const players = React.useMemo(() => {
        const allPlayers = Object.values(connectedPlayersData).filter(p => p.peerId !== peerId && !p.isHost);

        // Deduplica por peerId ou id de ficha para evitar sessões fantasmas
        const deduplicatedMap: Record<string, typeof allPlayers[0]> = {};
        allPlayers.forEach(p => {
            const key = p.peerId || p.character?.id || p.name;
            const existing = deduplicatedMap[key];
            if (!existing || (!existing.isOnline && p.isOnline)) {
                deduplicatedMap[key] = p;
            }
        });

        return Object.values(deduplicatedMap).sort((a, b) => {
            if (a.isOnline === b.isOnline) {
                return (a.name || '').localeCompare(b.name || '');
            }
            return a.isOnline ? -1 : 1;
        });
    }, [connectedPlayersData, peerId]);

    const onlinePlayers = React.useMemo(() => {
        return players.filter(p => p.isOnline);
    }, [players]);

    const playersWithSheets = React.useMemo(() => {
        return players.filter(p => !!p.character);
    }, [players]);

    const handleSpawnToken = (character: any) => {
        if (!character) return;

        // Calcula uma coordenada livre para não sobrepor tokens existentes
        const occupied = new Set(tokens.map(t => `${t.position.x},${t.position.y}`));
        let posX = 2;
        let posY = 2;
        while (occupied.has(`${posX},${posY}`)) {
            posX += 1;
            if (posX > 12) {
                posX = 2;
                posY += 1;
            }
        }

        addToken({
            id: crypto.randomUUID(),
            characterId: character.id,
            name: character.name,
            color: '#c5a059',
            position: { x: posX, y: posY },
            size: 1,
            imageUrl: character.imageUrl || '',
            hp: character.hp || { current: 10, max: 10 },
            ac: character.armorClass || 10
        });
    };

    const handleQuickHp = (p: typeof players[0], delta: number) => {
        if (!p.character) return;
        const currentHp = p.character.hp?.current ?? 0;
        const maxHp = p.character.hp?.max ?? 1;
        const newCurrent = Math.max(0, Math.min(maxHp, currentHp + delta));
        const updatedChar = {
            ...p.character,
            hp: {
                ...p.character.hp,
                current: newCurrent,
                max: maxHp
            },
            lastModified: Date.now()
        };

        // 1. Sincroniza a ficha remota do jogador
        updateRemotePlayerCharacter(p.peerId, updatedChar as any);

        // 2. Sincroniza tokens correspondentes no tabuleiro de batalha
        if (tokens && updateToken) {
            tokens.forEach(t => {
                if (t.characterId === p.character?.id) {
                    updateToken(t.id, {
                        hp: { current: newCurrent, max: maxHp }
                    });
                }
            });
        }

        // 3. Sincroniza combatente na iniciativa se houver combate ativo
        if (combatState?.combatants && updateCombatant) {
            combatState.combatants.forEach(c => {
                if (c.characterId === p.character?.id) {
                    updateCombatant(c.id, {
                        hp: { current: newCurrent, max: maxHp }
                    });
                }
            });
        }
    };

    const handleFullHeal = (p: typeof players[0]) => {
        if (!p.character) return;
        const maxHp = p.character.hp?.max ?? 1;
        const currentHp = p.character.hp?.current ?? 0;
        handleQuickHp(p, maxHp - currentHp);
    };

    const handleLevelChange = (p: typeof players[0], delta: number) => {
        if (!p.character) return;
        const currentLvl = p.character.level || 1;
        const nextLvl = Math.max(1, Math.min(20, currentLvl + delta));
        if (nextLvl === currentLvl) return;

        const actionText = delta > 0
            ? `Subir nível de "${p.character.name || p.name}" para o Nível ${nextLvl}?\n\nO jogador receberá aviso para configurar seus novos Pontos de Vida, Perícias e Habilidades de Classe.`
            : `Reduzir nível de "${p.character.name || p.name}" para o Nível ${nextLvl}?`;
        if (!confirm(actionText)) return;

        const newXP = getMinXPForLevel(nextLvl);
        const nextXP = getMinXPForLevel(nextLvl + 1) || newXP;

        const updatedChar: Character = {
            ...p.character,
            level: nextLvl,
            experience: newXP,
            nextLevelExperience: nextXP,
            pendingLevelUp: delta > 0,
            hitDice: {
                ...p.character.hitDice,
                max: nextLvl,
                current: delta > 0 ? Math.min(nextLvl, (p.character.hitDice?.current || 1) + 1) : Math.min(nextLvl, p.character.hitDice?.current || 1)
            }
        };

        const regened = regenerateCharacterStats(updatedChar);
        updateRemotePlayerCharacter(p.peerId, regened as any);

        if (tokens && updateToken) {
            tokens.forEach(t => {
                if (t.characterId === p.character?.id) {
                    updateToken(t.id, {
                        hp: regened.hp
                    });
                }
            });
        }

        playSynthSound(delta > 0 ? 'crit' : 'dice');
    };

    const handleClearOffline = () => {
        players.filter(p => !p.isOnline).forEach(p => {
            removePlayer(p.peerId);
        });
    };

    return (
        <div className="gm-screen-panel">
            <h2 style={{ color: '#c5a059', borderBottom: '1px solid #444', paddingBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Escudo do Mestre</span>
                <button
                    onClick={() => triggerForceRefresh && triggerForceRefresh()}
                    title="Forçar todos os jogadores a recarregar a página (usar após atualização de versão)"
                    style={{ fontSize: '0.8rem', padding: '4px 8px', background: '#442', border: '1px solid #774', color: '#ffc', cursor: 'pointer', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '5px' }}
                >
                    <RefreshCw size={12} />
                    <span>Atualizar Mesa</span>
                </button>
            </h2>

            {/* CARD DE SESSÃO & CÓDIGO DA SALA DO MESTRE */}
            <div style={{
                background: 'linear-gradient(135deg, rgba(25, 20, 30, 0.9) 0%, rgba(15, 12, 18, 0.95) 100%)',
                border: '1px solid rgba(255, 215, 0, 0.35)',
                borderRadius: '10px',
                padding: '14px',
                marginBottom: '16px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.4)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.82rem', color: '#ffd700', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Shield size={14} color="#ffd700" />
                        <span>Sala da Mesa</span>
                    </span>
                    <span style={{ fontSize: '0.78rem', color: onlinePlayers.length > 0 ? '#4caf50' : '#eab308', fontWeight: 'bold' }}>
                        ● {onlinePlayers.length > 0 ? `${onlinePlayers.length} jogador${onlinePlayers.length !== 1 ? 'es' : ''} online` : 'Mesa Aberta (Aguardando jogadores)'}
                    </span>
                </div>

                <div style={{
                    background: '#09090f',
                    border: '1px dashed #ffd700',
                    borderRadius: '8px',
                    padding: '8px 10px',
                    textAlign: 'center',
                    marginBottom: '10px'
                }}>
                    <div style={{ fontSize: '0.72rem', color: '#888', marginBottom: '2px', letterSpacing: '0.5px' }}>
                        CÓDIGO PARA OS JOGADORES:
                    </div>
                    <div style={{ fontSize: '1.5rem', fontFamily: 'monospace', fontWeight: 'bold', color: '#ffd700', letterSpacing: '3px', userSelect: 'all' }}>
                        {currentAdventureId || peerId || '---'}
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        type="button"
                        onClick={() => {
                            const code = currentAdventureId || peerId;
                            if (code) {
                                navigator.clipboard.writeText(code);
                                setCopiedCode(true);
                                setTimeout(() => setCopiedCode(false), 2000);
                            }
                        }}
                        style={{
                            flex: 1,
                            background: '#ffd700',
                            color: '#000',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '8px 10px',
                            fontSize: '0.78rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '5px'
                        }}
                    >
                        {copiedCode ? <Check size={13} /> : <Copy size={13} />}
                        <span>{copiedCode ? 'Copiado!' : 'Copiar Código'}</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            const code = currentAdventureId || peerId;
                            if (code) {
                                const inviteUrl = `${window.location.origin}${window.location.pathname}?sala=${encodeURIComponent(code)}`;
                                navigator.clipboard.writeText(inviteUrl);
                                setCopiedLink(true);
                                setTimeout(() => setCopiedLink(false), 2000);
                            }
                        }}
                        style={{
                            flex: 1,
                            background: '#2563eb',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '8px 10px',
                            fontSize: '0.78rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '5px'
                        }}
                    >
                        {copiedLink ? <Check size={13} /> : <Link2 size={13} />}
                        <span>{copiedLink ? 'Link Copiado!' : 'Copiar Link'}</span>
                    </button>
                </div>
            </div>

            <ErrorBoundary name="Soundboard">
                <Soundboard />
            </ErrorBoundary>

            <ErrorBoundary name="SceneList">
                <SceneList />
            </ErrorBoundary>

            {/* RESUMO DE ESTATÍSTICAS DA MESA */}
            <div className="gm-stats-summary" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', margin: '16px 0' }}>
                <div className="stat-card">
                    <span className="label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Users size={12} /> Conectados
                    </span>
                    <span className="value">{onlinePlayers.length}</span>
                </div>
                <div className="stat-card">
                    <span className="label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <UserCheck size={12} /> Fichas Prontas
                    </span>
                    <span className="value">{playersWithSheets.length}</span>
                </div>
                <div className="stat-card">
                    <span className="label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={12} /> Tokens no Mapa
                    </span>
                    <span className="value">{tokens.length}</span>
                </div>
            </div>

            <h3 style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#c5a059', borderBottom: '1px solid #333', paddingBottom: '6px', marginTop: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>Jogadores ({onlinePlayers.length} online{players.length > onlinePlayers.length ? ` / ${players.length} total` : ''})</span>
                </div>
                {players.some(p => !p.isOnline) && (
                    <button
                        type="button"
                        onClick={handleClearOffline}
                        title="Limpar jogadores desconectados da lista"
                        style={{ fontSize: '0.72rem', padding: '3px 8px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#fca5a5', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        Limpar Offline
                    </button>
                )}
            </h3>

            {players.length === 0 ? (
                <div style={{
                    padding: '24px 16px',
                    color: '#aaa',
                    fontStyle: 'italic',
                    textAlign: 'center',
                    background: 'rgba(25, 20, 30, 0.6)',
                    borderRadius: '8px',
                    border: '1px dashed #554433',
                    marginBottom: '20px'
                }}>
                    Nenhum jogador conectado no momento. Compartilhe o código ou o link da sala acima para que os jogadores entrem na sua mesa.
                </div>
            ) : (
                <div className="gm-players-grid">
                    {players.map(p => {
                        const { character } = p;
                        const tokenCount = character ? tokens.filter(t => t.characterId === character.id).length : 0;

                        if (!character) {
                            return (
                                <div key={p.peerId} className="gm-player-card" style={{ opacity: p.isOnline ? 0.9 : 0.45 }}>
                                    <div className="card-header">
                                        <strong>{p.name}</strong>
                                        <small style={{ color: '#eab308' }}>(Sem Ficha)</small>
                                    </div>
                                    <div style={{ padding: '10px', fontSize: '0.8rem', color: '#888', fontStyle: 'italic' }}>
                                        {p.isOnline ? 'Jogador conectado na sala, aguardando seleção de personagem.' : 'Jogador desconectado.'}
                                    </div>
                                    <div className="card-actions">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (confirm(`Remover "${p.name}" da mesa?`)) {
                                                    removePlayer(p.peerId);
                                                }
                                            }}
                                            title="Remover Jogador da Mesa"
                                            style={{ background: '#500', borderColor: '#700', color: '#faa', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                                        >
                                            <Trash2 size={13} />
                                            <span>Remover da Mesa</span>
                                        </button>
                                    </div>
                                </div>
                            );
                        }

                        const hpCurrent = character.hp?.current ?? 0;
                        const hpMax = character.hp?.max ?? 1;
                        const hpPercent = Math.max(0, Math.min(100, (hpCurrent / hpMax) * 100));
                        const hpColor = hpPercent > 50 ? '#4caf50' : hpPercent > 20 ? '#ff9800' : '#f44336';

                        return (
                            <div key={p.peerId} className="gm-player-card" style={{ opacity: p.isOnline ? 1 : 0.6 }}>
                                <div className="card-header">
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <strong>{character.name || p.name}</strong>
                                        <span style={{ fontSize: '0.72rem', color: '#888' }}>({p.name})</span>
                                    </div>
                                    <small>
                                        {!p.isOnline ? (
                                            <span style={{ color: '#ef4444', fontWeight: 'bold' }}>Offline</span>
                                        ) : (
                                            <span style={{ color: '#22c55e', fontWeight: 'bold' }}>Online</span>
                                        )}
                                        <div style={{ color: '#aaa', fontSize: '0.72rem', marginTop: '2px' }}>
                                            {character.race || ''} {character.class || ''}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '4px' }}>
                                            <span style={{
                                                background: '#ffd700',
                                                color: '#000',
                                                fontWeight: 'bold',
                                                fontSize: '0.72rem',
                                                padding: '1px 6px',
                                                borderRadius: '8px'
                                            }}>
                                                Nv {character.level || 1}
                                            </span>
                                            {character.pendingLevelUp && (
                                                <span style={{ fontSize: '0.68rem', color: '#ffd700', fontWeight: 'bold' }} title="Evolução pendente no jogador">
                                                    (Pendente)
                                                </span>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => handleLevelChange(p, 1)}
                                                title="Subir Nível do Jogador (+1)"
                                                style={{
                                                    background: 'rgba(34, 197, 94, 0.2)',
                                                    border: '1px solid #22c55e',
                                                    color: '#86efac',
                                                    padding: '2px 6px',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer',
                                                    fontSize: '0.7rem',
                                                    fontWeight: 'bold',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '2px'
                                                }}
                                            >
                                                <TrendingUp size={11} />
                                                <span>Subir Nv</span>
                                            </button>
                                            {(character.level || 1) > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleLevelChange(p, -1)}
                                                    title="Reduzir Nível (-1)"
                                                    style={{
                                                        background: 'rgba(239, 68, 68, 0.15)',
                                                        border: '1px solid rgba(239, 68, 68, 0.4)',
                                                        color: '#fca5a5',
                                                        padding: '2px 5px',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer',
                                                        fontSize: '0.7rem'
                                                    }}
                                                >
                                                    -1 Nv
                                                </button>
                                            )}
                                        </div>
                                    </small>
                                </div>

                                <div className="card-body">
                                    <div className="gm-stat-row">
                                        <label style={{ fontSize: '0.75rem', color: '#aaa' }}>Pontos de Vida (PV)</label>
                                        <div className="hp-bar-container">
                                            <div className="hp-bar-fill" style={{ width: `${hpPercent}%`, background: hpColor }}></div>
                                            <span className="hp-text">{hpCurrent} / {hpMax}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
                                            <span style={{ fontSize: '0.72rem', color: '#888' }}>Ajustar PV:</span>
                                            <div style={{ display: 'flex', gap: '3px' }}>
                                                <button
                                                    type="button"
                                                    onClick={() => handleQuickHp(p, -5)}
                                                    title="Dano -5"
                                                    style={{ padding: '2px 6px', fontSize: '0.72rem', background: '#500', color: '#ffb', border: '1px solid #800', borderRadius: '3px', cursor: 'pointer', fontWeight: 'bold' }}
                                                >
                                                    -5
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleQuickHp(p, -1)}
                                                    title="Dano -1"
                                                    style={{ padding: '2px 6px', fontSize: '0.72rem', background: '#422', color: '#ffc', border: '1px solid #733', borderRadius: '3px', cursor: 'pointer', fontWeight: 'bold' }}
                                                >
                                                    -1
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleQuickHp(p, 1)}
                                                    title="Cura +1"
                                                    style={{ padding: '2px 6px', fontSize: '0.72rem', background: '#242', color: '#cff', border: '1px solid #373', borderRadius: '3px', cursor: 'pointer', fontWeight: 'bold' }}
                                                >
                                                    +1
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleQuickHp(p, 5)}
                                                    title="Cura +5"
                                                    style={{ padding: '2px 6px', fontSize: '0.72rem', background: '#050', color: '#bff', border: '1px solid #080', borderRadius: '3px', cursor: 'pointer', fontWeight: 'bold' }}
                                                >
                                                    +5
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleFullHeal(p)}
                                                    title="Cura Total (Recupera todos os PVs)"
                                                    style={{ padding: '2px 5px', fontSize: '0.72rem', background: '#044', color: '#dff', border: '1px solid #088', borderRadius: '3px', cursor: 'pointer', fontWeight: 'bold' }}
                                                >
                                                    Max
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="gm-stat-grid">
                                        <div className="gm-stat-box" title="Classe de Armadura / Defesa">
                                            <label>CA</label>
                                            <span>{character.armorClass || 10}</span>
                                        </div>
                                        <div className="gm-stat-box" title="Percepção Passiva">
                                            <label>PP</label>
                                            <span>{10 + ((character.skills || []).find((s: any) => s.name === 'Percepção')?.value || 0)}</span>
                                        </div>
                                        <div className="gm-stat-box" title="Classe de Dificuldade de Magia (CD)">
                                            <label>CD</label>
                                            <span>{character.spellSaveDC || 10}</span>
                                        </div>
                                        <div className="gm-stat-box" title="Deslocamento / Velocidade">
                                            <label>Vel</label>
                                            <span>{character.speed || 9}m</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="card-actions" style={{ display: 'flex', gap: '6px' }}>
                                    <button
                                        type="button"
                                        onClick={() => setEditingPlayer(p)}
                                        title="Abrir e Editar Ficha Completa do Jogador"
                                        style={{ flex: 1, background: '#1e3a5f', borderColor: '#2b5282', color: '#90cdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}
                                    >
                                        <FileText size={13} />
                                        <span>Ficha</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleSpawnToken(character)}
                                        title={tokenCount > 0 ? `Já possui ${tokenCount} token no mapa. Clique para criar outro.` : 'Criar Token no Mapa de Batalha'}
                                        style={{
                                            flex: 1,
                                            background: tokenCount > 0 ? '#2d3748' : '#333',
                                            borderColor: tokenCount > 0 ? '#4a5568' : '#555',
                                            color: tokenCount > 0 ? '#e2e8f0' : '#ccc',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '4px'
                                        }}
                                    >
                                        <MapPin size={12} color={tokenCount > 0 ? '#ffd700' : '#888'} />
                                        <span>{tokenCount > 0 ? `Token (${tokenCount})` : 'Spawn Token'}</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (confirm(`Remover "${character.name || p.name}" da mesa?`)) {
                                                removePlayer(p.peerId);
                                            }
                                        }}
                                        title="Remover Jogador da Mesa"
                                        style={{ background: '#500', borderColor: '#700', color: '#faa', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 8px' }}
                                    >
                                        <Trash2 size={13} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* MODAL DE EDIÇÃO DE FICHA PELO MESTRE */}
            {editingPlayer && editingPlayer.character && (
                <div className="modal-overlay" style={{ zIndex: 2000 }}>
                    <div style={{ width: '95vw', height: '95vh', background: '#111', border: '1px solid #444', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                        <CharacterSheet
                            characterId={editingPlayer.character.id}
                            initialData={editingPlayer.character}
                            isGM={true}
                            onExit={() => setEditingPlayer(null)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};
