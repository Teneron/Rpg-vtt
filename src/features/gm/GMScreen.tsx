import React from 'react';
import { usePeer } from '../multiplayer/SocketContext';
import { Soundboard } from '../audio/Soundboard';
import { RefreshCw, Shield, Copy, Check, Link2, Trash2, FileText, Users, UserCheck, MapPin, TrendingUp, BookOpen, Download, ChevronDown, ChevronUp, Minus, Plus } from 'lucide-react';
import { getMinXPForLevel, regenerateCharacterStats, type Character } from '../character/characterTypes';
import { playSynthSound } from '../audio/audioSynth';

import { ErrorBoundary } from '../../components/ErrorBoundary';
import { useMap } from '../map/MapContext';
import { useCombat } from '../combat/CombatContext';
import { useAdventure, type Adventure } from '../adventure/AdventureContext';
import { SceneList } from '../map/SceneList';
import { CharacterSheet } from '../character/CharacterSheet';
import './GMScreen.css';

interface CampaignJournalCardProps {
    adventure: Adventure | null;
    fallbackAdventureId: string | null;
    updateAdventureJournal: (journal: string, description?: string) => Promise<void>;
    downloadCampaignBackup: (campaignId: string) => Promise<void>;
}

const CampaignJournalCard: React.FC<CampaignJournalCardProps> = ({
    adventure,
    fallbackAdventureId,
    updateAdventureJournal,
    downloadCampaignBackup
}) => {
    const [isExpanded, setIsExpanded] = React.useState(true);
    const [descriptionText, setDescriptionText] = React.useState<string>(() => adventure?.description || '');
    const [journalText, setJournalText] = React.useState<string>(() => adventure?.journal || '');
    const [saveStatus, setSaveStatus] = React.useState<'saved' | 'saving' | 'error'>('saved');
    const [isExporting, setIsExporting] = React.useState(false);

    const journalRef = React.useRef(journalText);
    const descriptionRef = React.useRef(descriptionText);
    const isDirtyRef = React.useRef(false);
    const debounceTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    const scheduleAutoSave = (nextJournal: string, nextDesc: string) => {
        journalRef.current = nextJournal;
        descriptionRef.current = nextDesc;
        isDirtyRef.current = true;
        setSaveStatus('saving');

        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        debounceTimerRef.current = setTimeout(async () => {
            debounceTimerRef.current = null;
            isDirtyRef.current = false;
            try {
                await updateAdventureJournal(journalRef.current, descriptionRef.current);
                setSaveStatus('saved');
            } catch (err) {
                console.error('[GMScreen] Erro ao salvar Diário da Campanha:', err);
                setSaveStatus('error');
            }
        }, 600);
    };

    // Flush any pending unsaved journal edits if the GM switches tabs before 600ms
    React.useEffect(() => {
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
                debounceTimerRef.current = null;
            }
            if (isDirtyRef.current) {
                isDirtyRef.current = false;
                updateAdventureJournal(journalRef.current, descriptionRef.current).catch(console.error);
            }
        };
    }, [updateAdventureJournal]);

    const handleExportBackup = async (e: React.MouseEvent) => {
        e.stopPropagation();
        const targetId = adventure?.id || fallbackAdventureId;
        if (!targetId) return;

        try {
            setIsExporting(true);
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
                debounceTimerRef.current = null;
            }
            if (isDirtyRef.current) {
                isDirtyRef.current = false;
                await updateAdventureJournal(journalRef.current, descriptionRef.current);
                setSaveStatus('saved');
            }
            await downloadCampaignBackup(targetId);
        } catch (err: any) {
            alert('Erro ao exportar backup da campanha: ' + (err?.message || 'falha ao gerar JSON'));
        } finally {
            setIsExporting(false);
        }
    };

    const canPersist = !!(adventure?.id || fallbackAdventureId);

    return (
        <div className="gm-journal-card">
            <div
                className="gm-journal-header"
                onClick={() => setIsExpanded(prev => !prev)}
                title={isExpanded ? 'Recolher Diário da Campanha' : 'Expandir Diário da Campanha'}
            >
                <div className="gm-journal-title">
                    <BookOpen size={15} color="#c5a059" />
                    <span>📖 Diário da Campanha & História</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {canPersist && (
                        <span className={`gm-journal-status ${saveStatus}`}>
                            {saveStatus === 'saving'
                                ? 'Salvando...'
                                : saveStatus === 'error'
                                    ? 'Erro ao salvar'
                                    : '✓ Salvo no navegador'}
                        </span>
                    )}
                    {isExpanded ? <ChevronUp size={15} color="#c5a059" /> : <ChevronDown size={15} color="#c5a059" />}
                </div>
            </div>

            {isExpanded && (
                <div className="gm-journal-body">
                    {adventure?.name && (
                        <div style={{ fontSize: '0.78rem', color: '#aaa', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>Campanha: <strong style={{ color: '#e6c67c' }}>{adventure.name}</strong></span>
                        </div>
                    )}

                    <div className="gm-journal-field">
                        <label htmlFor="gm-campaign-premise">Resumo / Premissa da Aventura</label>
                        <input
                            id="gm-campaign-premise"
                            type="text"
                            className="gm-journal-premise-input"
                            placeholder="Ex: Os heróis investigam o desaparecimento da caravana real e cultistas nas ruínas..."
                            value={descriptionText}
                            disabled={!canPersist}
                            onChange={(e) => {
                                const nextDesc = e.target.value;
                                setDescriptionText(nextDesc);
                                scheduleAutoSave(journalText, nextDesc);
                            }}
                        />
                    </div>

                    <div className="gm-journal-field">
                        <label htmlFor="gm-campaign-journal">Diário da História, Quests, NPCs & Anotações de Sessão</label>
                        <textarea
                            id="gm-campaign-journal"
                            className="gm-journal-textarea"
                            placeholder={'Registre aqui o histórico das sessões, pistas descobertas, segredos de NPCs, ganchos de quests e eventos importantes da mesa...\n\nTudo é salvo automaticamente no navegador (IndexedDB) e incluído no Backup (.json) da campanha.'}
                            value={journalText}
                            disabled={!canPersist}
                            onChange={(e) => {
                                const nextJournal = e.target.value;
                                setJournalText(nextJournal);
                                scheduleAutoSave(nextJournal, descriptionText);
                            }}
                        />
                    </div>

                    <div className="gm-journal-footer">
                        <span style={{ fontSize: '0.72rem', color: '#888' }}>
                            {journalText.length.toLocaleString('pt-BR')} caracteres • Incluído automaticamente no Backup
                        </span>
                        <button
                            type="button"
                            className="gm-journal-export-btn"
                            disabled={!canPersist || isExporting}
                            onClick={handleExportBackup}
                            title="Baixar arquivo completo de backup da campanha (.json) incluindo mapas, cenas, fichas, monstros e este diário"
                        >
                            <Download size={13} />
                            <span>{isExporting ? 'Exportando...' : 'Exportar Backup (.json)'}</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export const GMScreen: React.FC = () => {
    const { connectedPlayersData, removePlayer, peerId, triggerForceRefresh, currentAdventureId, updateRemotePlayerCharacter, roomSettings, updateRoomSettings } = usePeer();
    const { currentAdventure, updateAdventureJournal, downloadCampaignBackup, updateAdventurePatch } = useAdventure();
    const [editingPlayer, setEditingPlayer] = React.useState<{ peerId: string; name: string; character: any } | null>(null);
    const [copiedCode, setCopiedCode] = React.useState(false);
    const [copiedLink, setCopiedLink] = React.useState(false);

    const currentStartingLevel = roomSettings?.startingLevel || currentAdventure?.settings?.startingLevel || 1;

    const handleUpdateStartingLevel = async (newLevel: number) => {
        const clamped = Math.max(1, Math.min(20, newLevel));
        updateRoomSettings({ startingLevel: clamped });
        if (currentAdventure) {
            await updateAdventurePatch({
                settings: {
                    ...(currentAdventure.settings || {}),
                    startingLevel: clamped
                }
            });
        }
    };

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

            {/* CARD DE CONFIGURAÇÃO DE NÍVEL INICIAL */}
            <div style={{
                background: 'linear-gradient(135deg, rgba(20, 22, 30, 0.95) 0%, rgba(12, 14, 20, 0.95) 100%)',
                border: '1px solid rgba(255, 215, 0, 0.3)',
                borderRadius: '10px',
                padding: '14px',
                marginBottom: '16px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.4)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.82rem', color: '#ffd700', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <TrendingUp size={14} color="#ffd700" />
                        <span>Nível Inicial da Campanha</span>
                    </span>
                    <span style={{
                        fontSize: '0.82rem',
                        fontWeight: 'bold',
                        color: '#ffd700',
                        background: 'rgba(255, 215, 0, 0.15)',
                        border: '1px solid #ffd700',
                        padding: '2px 10px',
                        borderRadius: '12px'
                    }}>
                        Nível {currentStartingLevel}
                    </span>
                </div>

                <p style={{ margin: '0 0 10px 0', fontSize: '0.78rem', color: '#94a3b8' }}>
                    Ajuste o nível inicial para novos personagens criados nesta mesa. (Fichas já existentes mantêm seus níveis atuais).
                </p>

                {/* Stepper Controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <button
                        type="button"
                        onClick={() => handleUpdateStartingLevel(currentStartingLevel - 1)}
                        disabled={currentStartingLevel <= 1}
                        style={{
                            width: '36px', height: '36px', borderRadius: '6px',
                            background: currentStartingLevel <= 1 ? '#222' : '#333344',
                            border: '1px solid #555', color: currentStartingLevel <= 1 ? '#666' : '#fff',
                            fontSize: '1.1rem', cursor: currentStartingLevel <= 1 ? 'not-allowed' : 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                        title="Diminuir Nível Inicial"
                    >
                        <Minus size={14} />
                    </button>

                    <input
                        type="range"
                        min={1}
                        max={20}
                        value={currentStartingLevel}
                        onChange={e => handleUpdateStartingLevel(parseInt(e.target.value) || 1)}
                        style={{ flex: 1, accentColor: '#ffd700', cursor: 'pointer' }}
                    />

                    <button
                        type="button"
                        onClick={() => handleUpdateStartingLevel(currentStartingLevel + 1)}
                        disabled={currentStartingLevel >= 20}
                        style={{
                            width: '36px', height: '36px', borderRadius: '6px',
                            background: currentStartingLevel >= 20 ? '#222' : '#333344',
                            border: '1px solid #555', color: currentStartingLevel >= 20 ? '#666' : '#fff',
                            fontSize: '1.1rem', cursor: currentStartingLevel >= 20 ? 'not-allowed' : 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                        title="Aumentar Nível Inicial"
                    >
                        <Plus size={14} />
                    </button>
                </div>

                {/* Quick Select Chips */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {[1, 3, 5, 10, 15, 20].map(lvl => (
                        <button
                            key={lvl}
                            type="button"
                            onClick={() => handleUpdateStartingLevel(lvl)}
                            style={{
                                flex: '1 1 auto',
                                padding: '4px 8px',
                                fontSize: '0.72rem',
                                fontWeight: currentStartingLevel === lvl ? 'bold' : 'normal',
                                borderRadius: '4px',
                                border: currentStartingLevel === lvl ? '1px solid #ffd700' : '1px solid rgba(255,255,255,0.15)',
                                background: currentStartingLevel === lvl ? 'rgba(255, 215, 0, 0.2)' : 'rgba(255,255,255,0.05)',
                                color: currentStartingLevel === lvl ? '#ffd700' : '#ddd',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease'
                            }}
                        >
                            {lvl === 1 ? 'Nv. 1' : lvl === 3 ? 'Nv. 3' : lvl === 5 ? 'Nv. 5' : `Nv. ${lvl}`}
                        </button>
                    ))}
                </div>
            </div>

            <ErrorBoundary name="CampaignJournal">
                <CampaignJournalCard
                    key={currentAdventure ? `adv-${currentAdventure.id}` : 'adv-loading'}
                    adventure={currentAdventure}
                    fallbackAdventureId={currentAdventureId}
                    updateAdventureJournal={updateAdventureJournal}
                    downloadCampaignBackup={downloadCampaignBackup}
                />
            </ErrorBoundary>

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
