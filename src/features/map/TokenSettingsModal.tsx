import React, { useState, useEffect, useRef } from 'react';
import { useMap } from './MapContext';
import { usePeer } from '../multiplayer/SocketContext';
import { CharacterRepository } from '../character/characterRepository';
import type { MapToken } from './mapTypes';
import '../../Layout.css';
import { useCombat } from '../combat/CombatContext';
import { Settings, Swords, Check, FileText, X, User, BarChart2, Eye, EyeOff, Heart, Lock, Unlock, Sun, Trash2, ArrowUp, ShieldAlert } from 'lucide-react';

interface TokenSettingsModalProps {
    tokenId: string | null;
    onClose: () => void;
    onOpenSheet?: () => void;
}

const resolveCharacterAC = (char: any): number => {
    return char?.acOverride ?? char?.armorClass ?? char?.bg?.armorClass ?? char?.ac ?? 10;
};

export const TokenSettingsModal: React.FC<TokenSettingsModalProps> = ({ tokenId, onClose, onOpenSheet }) => {
    const { tokens, updateToken, removeToken, config } = useMap();
    const { connectedPlayersData, myCharacter, isHost, broadcastCharacterUpdate, updateRemotePlayerCharacter } = usePeer();
    const { addCombatant, removeCombatant, updateCombatant, combatState } = useCombat(); // Import Combat Hooks

    const [token, setToken] = useState<MapToken | null>(null);
    const [activeTab, setActiveTab] = useState<'identity' | 'stats' | 'vision' | 'appearance'>('identity');

    const [editedCharData, setEditedCharData] = useState<any>(null);
    const [uploading, setUploading] = useState(false); // New state for upload status

    const compressAndConvertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    // Max dimensions (same as AddAssetModal)
                    const MAX_WIDTH = 512; // Tokens don't need to be huge, 512 is plenty for zoom
                    const MAX_HEIGHT = 512;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;

                    if (ctx) {
                        ctx.drawImage(img, 0, 0, width, height);
                        const dataUrl = canvas.toDataURL('image/png');
                        resolve(dataUrl);
                    } else {
                        reject(new Error("Canvas context is null"));
                    }
                };
                img.onerror = (err) => reject(err);
            };
            reader.onerror = (err) => reject(err);
        });
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        setUploading(true);

        try {
            const base64Url = await compressAndConvertToBase64(file);
            setToken(prev => prev ? ({ ...prev, imageUrl: base64Url }) : null);
        } catch (error) {
            console.error("Compression failed", error);
            alert("Erro ao processar imagem.");
        } finally {
            setUploading(false);
        }
    };


    const initializedTokenId = useRef<string | null>(null);

    useEffect(() => {
        if (!tokenId) {
            initializedTokenId.current = null;
            return;
        }

        // Se já inicializamos este token, não sobrescrever com dados globais (evita reset durante edição)
        if (initializedTokenId.current === tokenId) return;

        const t = tokens.find(tk => tk.id === tokenId);
        if (t) {
            initializedTokenId.current = tokenId;

            // Initialize Form State
            const initialTokenState = { ...t };

            // If there is a linked combatant, prioritize its health/AC status because that's what is shown on map
            const linkedCombatant = (combatState.combatants || []).find(
                c => c.id === t.id || c.id === t.combatantId || (t.characterId && (c.characterId === t.characterId || (c as any).sourceId === t.characterId))
            );
            if (linkedCombatant) {
                console.log("Loading stats from Linked Combatant for Editor:", linkedCombatant);
                if (linkedCombatant.hp) initialTokenState.hp = { ...linkedCombatant.hp };
                if (linkedCombatant.ac !== undefined) initialTokenState.ac = linkedCombatant.ac;
            }

            // Only load external character data if we haven't touched the form yet
            if (t.characterId) {
                let charData = Object.values(connectedPlayersData).find(p => p.character?.id === t.characterId)?.character;
                // If not found in players, check if it's my own character or saved locally in repository
                if (!charData && myCharacter && myCharacter.id === t.characterId) charData = myCharacter;
                if (!charData) charData = CharacterRepository.load(t.characterId) || undefined;

                if (charData) {
                    setEditedCharData(JSON.parse(JSON.stringify(charData)));
                    initialTokenState.ac = resolveCharacterAC(charData);
                    if (charData.hp) {
                        initialTokenState.hp = { ...charData.hp };
                    }

                    // AUTO-VISION SYNC
                    if (!initialTokenState.visionRange && charData.visionRange && charData.visionRange > 0) {
                        console.log("Auto-Syncing Vision directly from Character Sheet:", charData.visionRange);
                        initialTokenState.visionRange = charData.visionRange;
                    }
                    if ((!initialTokenState.conditions || initialTokenState.conditions.length === 0) && charData.conditions) {
                        initialTokenState.conditions = [...charData.conditions];
                    }
                }
            }
            setToken(initialTokenState);
        }
    }, [tokenId, tokens, connectedPlayersData, myCharacter, combatState]); // Dependencies kept, but guarded by initializedTokenId

    if (!tokenId || !token) return null;

    // Check if token is already in combat
    const isInCombat = (combatState.combatants || []).some(
        c => c.id === token.id || c.id === token.combatantId || (token.characterId && (c.characterId === token.characterId || (c as any).sourceId === token.characterId))
    );

    const handleToggleCombat = () => {
        if (isInCombat) {
            // Remove
            const c = (combatState.combatants || []).find(
                cb => cb.id === token.id || cb.id === token.combatantId || (token.characterId && (cb.characterId === token.characterId || (cb as any).sourceId === token.characterId))
            );
            if (c) removeCombatant(c.id);
        } else {
            // Add
            let hpCurrent = token.hp?.current ?? 10;
            let hpMax = token.hp?.max ?? 10;
            let ac = token.ac ?? 10;
            let name = token.name;

            if (editedCharData) {
                hpCurrent = editedCharData.hp?.current ?? hpCurrent;
                hpMax = editedCharData.hp?.max ?? hpMax;
                ac = resolveCharacterAC(editedCharData);
                name = editedCharData.name || name;
            }

            // AUTO-ROLL LOGIC:
            // NPCs: Auto-roll (d20).
            // Players: Set to 0 (Manual Roll required).
            const isNPC = !token.characterId;
            const initRoll = isNPC ? Math.floor(Math.random() * 20) + 1 : 0;

            addCombatant({
                id: token.id, // Use Token ID
                characterId: token.characterId,
                name: name,
                initiative: initRoll,
                roll: isNPC ? initRoll : 0,
                bonus: 0,
                imageUrl: token.imageUrl,
                hp: { current: hpCurrent, max: hpMax },
                ac: ac,
                isNPC: isNPC,
                status: 'normal'
            });
        }
        // Don't close, user might want to edit more
    };

    const handleSave = () => {
        const tokenToSave: MapToken = { ...token };

        if (token.characterId && editedCharData) {
            const resolvedAc = resolveCharacterAC(editedCharData);
            const resolvedHpCurrent = editedCharData.hp?.current ?? token.hp?.current ?? 10;
            const resolvedHpMax = editedCharData.hp?.max ?? token.hp?.max ?? 10;
            tokenToSave.ac = resolvedAc;
            tokenToSave.hp = {
                current: resolvedHpCurrent,
                max: resolvedHpMax,
                temp: editedCharData.hp?.temp ?? token.hp?.temp ?? 0
            };
        }

        updateToken(tokenId, tokenToSave);

        // SYNC WITH COMBATANT (Fix for HP & AC Priority Issue)
        const linkedCombatant = (combatState.combatants || []).find(
            c => c.id === token.id || c.id === token.combatantId || (token.characterId && (c.characterId === token.characterId || (c as any).sourceId === token.characterId))
        );

        if (linkedCombatant) {
            console.log("Syncing edits to Combatant:", linkedCombatant.id);

            let hpCurrent = tokenToSave.hp?.current ?? 10;
            let hpMax = tokenToSave.hp?.max ?? 10;
            let ac = tokenToSave.ac ?? 10;

            if (token.characterId && editedCharData) {
                hpCurrent = editedCharData.hp?.current ?? hpCurrent;
                hpMax = editedCharData.hp?.max ?? hpMax;
                ac = resolveCharacterAC(editedCharData);
            }

            updateCombatant(linkedCombatant.id, {
                hp: { current: hpCurrent, max: hpMax },
                ac: ac
            });
        }

        if (token.characterId && editedCharData) {
            const updatedChar = {
                ...editedCharData,
                ...(token.conditions ? { conditions: [...token.conditions] } : {}),
                lastModified: Date.now()
            };

            console.log("Saving Linked Character Data...", updatedChar);

            // Persist locally & notify MapContext, CombatContext, and CharacterSheet
            CharacterRepository.save(updatedChar);
            if (isHost) {
                sessionStorage.setItem(`last_gm_edit_${token.characterId}`, Date.now().toString());
            }
            window.dispatchEvent(new CustomEvent('rpg_local_char_save', { detail: updatedChar }));

            const ownerEntry = Object.values(connectedPlayersData).find(p => p.character?.id === token.characterId);
            const targetPeerId = ownerEntry?.peerId || 'unknown';

            if (myCharacter && myCharacter.id === token.characterId) {
                broadcastCharacterUpdate(updatedChar);
            } else if (isHost) {
                if (targetPeerId && targetPeerId !== 'unknown') {
                    updateRemotePlayerCharacter(targetPeerId, updatedChar);
                }
            }
        }
        onClose();
    };

    const handleDelete = () => {
        if (confirm("Tem certeza que deseja apagar este token?")) {
            removeToken(tokenId);
            onClose();
        }
    };

    return (
        <div className="modal-overlay" style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000
        }}>
            <div className="glass-panel" style={{ width: '500px', flexDirection: 'column', gap: '20px' }}>
                <h2 style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Settings size={18} />
                        <span>Editar Token: {token.name}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <button
                            onClick={handleToggleCombat}
                            title={isInCombat ? "Remover do Combate" : "Adicionar ao Combate"}
                            style={{
                                fontSize: '0.85rem', padding: '4px 8px',
                                background: isInCombat ? '#442222' : '#224422',
                                border: `1px solid ${isInCombat ? '#884444' : '#448844'}`,
                                color: '#fff', cursor: 'pointer', borderRadius: '4px',
                                display: 'flex', alignItems: 'center', gap: '4px'
                            }}
                        >
                            {isInCombat ? <Check size={14} /> : <Swords size={14} />}
                            <span>{isInCombat ? 'Em Combate' : 'Combate'}</span>
                        </button>

                        {token.characterId && (
                            <button
                                onClick={() => {
                                    window.dispatchEvent(new CustomEvent('request_open_sheet', { detail: token.characterId }));
                                    onClose();
                                }}
                                style={{ fontSize: '0.8rem', padding: '5px 8px', background: '#444', border: '1px solid #666', color: '#fff', cursor: 'pointer', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}
                            >
                                <FileText size={14} />
                                <span>Abrir Ficha</span>
                            </button>
                        )}
                        {onOpenSheet && !token.characterId && isHost && (
                            <button
                                onClick={onOpenSheet}
                                style={{ fontSize: '0.8rem', padding: '5px 8px', background: '#444', border: '1px solid #666', color: '#fff', cursor: 'pointer', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}
                            >
                                <FileText size={14} />
                                <span>Abrir Ficha</span>
                            </button>
                        )}
                        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                            <X size={16} />
                        </button>
                    </div>
                </h2>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px' }}>
                    <button
                        className={`glass-button small ${activeTab === 'identity' ? 'active' : ''}`}
                        onClick={() => setActiveTab('identity')}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                        <User size={13} />
                        <span>Identidade</span>
                    </button>
                    <button
                        className={`glass-button small ${activeTab === 'stats' ? 'active' : ''}`}
                        onClick={() => setActiveTab('stats')}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                        <BarChart2 size={13} />
                        <span>Stats</span>
                    </button>
                    <button
                        className={`glass-button small ${activeTab === 'vision' ? 'active' : ''}`}
                        onClick={() => setActiveTab('vision')}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                        <Eye size={13} />
                        <span>Visão/Luz</span>
                    </button>
                </div>

                {/* Content */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

                    {/* IDENTITY TAB */}
                    {activeTab === 'identity' && (
                        <>
                            <div className="form-group">
                                <label>Nome do Token</label>
                                <input
                                    className="glass-input"
                                    value={token.name}
                                    onChange={e => setToken({ ...token, name: e.target.value })}
                                    style={{ width: '100%', padding: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: '#fff', borderRadius: '4px' }}
                                />
                            </div>

                            <div className="form-group">
                                <label>Upload Imagem (Local)</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    disabled={uploading}
                                    className="glass-input"
                                    style={{ width: '100%', padding: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: '#fff', borderRadius: '4px' }}
                                />
                                {uploading && <div style={{ color: '#ffcc00', fontSize: '0.8rem', marginTop: '5px' }}>Processando...</div>}
                            </div>
                            <div className="form-group">
                                <label>Imagem (URL)</label>
                                <input
                                    className="glass-input"
                                    value={token.imageUrl || ''}
                                    onChange={e => setToken({ ...token, imageUrl: e.target.value })}
                                    placeholder="https://..."
                                    style={{ width: '100%', padding: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: '#fff', borderRadius: '4px' }}
                                />
                            </div>
                            <div className="form-group">
                                <label>Tamanho (Células)</label>
                                <select
                                    value={token.size}
                                    onChange={e => setToken({ ...token, size: Number(e.target.value) })}
                                    style={{ width: '100%', padding: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: '#fff', borderRadius: '4px' }}
                                >
                                    <option value={0.5}>Tiny (0.5)</option>
                                    <option value={1}>Medium / Small (1x1)</option>
                                    <option value={2}>Large (2x2)</option>
                                    <option value={3}>Huge (3x3)</option>
                                    <option value={4}>Gargantuan (4x4)</option>
                                </select>
                            </div>

                            {/* VISIBILITY CONTROLS (GM ONLY) */}
                            {isHost && (
                                <div style={{ borderTop: '1px solid #444', paddingTop: '10px', marginTop: '10px' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            checked={token.invisible || false}
                                            onChange={e => setToken({ ...token, invisible: e.target.checked })}
                                        />
                                        <EyeOff size={14} />
                                        <span>Invisível para Jogadores</span>
                                    </label>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            checked={token.visibleStats || false}
                                            onChange={e => setToken({ ...token, visibleStats: e.target.checked })}
                                        />
                                        <Heart size={14} color="#f43f5e" />
                                        <span>Barra de Vida Pública (Todos Veem)</span>
                                    </label>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            checked={token.isLocked || false}
                                            onChange={e => setToken({ ...token, isLocked: e.target.checked })}
                                        />
                                        <Lock size={14} />
                                        <span>Travar Movimento</span>
                                    </label>
                                </div>
                            )}
                        </>
                    )}

                    {/* STATS TAB */}
                    {activeTab === 'stats' && (
                        <div style={{ padding: '10px' }}>
                            {(() => {
                                if (editedCharData) {
                                    // --- LINKED CHARACTER (EDITABLE BY GM) ---
                                    const canEdit = isHost;

                                    return (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                            {!canEdit && <div style={{ fontSize: '0.8rem', color: '#aaa', marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '4px' }}><Lock size={12} /> <span>Visualização apenas (Edite na Ficha)</span></div>}
                                            {canEdit && <div style={{ fontSize: '0.8rem', color: '#cfc', marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '4px' }}><Unlock size={12} /> <span>Modo GM: Editando Ficha Linkada</span></div>}

                                            <div className="form-group">
                                                <label>Vida (HP) {canEdit ? '(Editável)' : '(Ficha)'}</label>
                                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                                    {canEdit && <button className="glass-button small" onClick={() => setEditedCharData({ ...editedCharData, hp: { ...editedCharData.hp, current: Math.max(0, editedCharData.hp.current - 1) } })}>-</button>}
                                                    <input
                                                        className="glass-input"
                                                        type="number"
                                                        value={editedCharData.hp.current}
                                                        readOnly={!canEdit}
                                                        onChange={(e) => {
                                                            setEditedCharData({
                                                                ...editedCharData,
                                                                hp: { ...editedCharData.hp, current: Number(e.target.value) }
                                                            });
                                                        }}
                                                        style={{ width: '60px', textAlign: 'center', borderColor: canEdit ? '#4CAF50' : '' }}
                                                    />
                                                    {canEdit && <button className="glass-button small" onClick={() => setEditedCharData({ ...editedCharData, hp: { ...editedCharData.hp, current: editedCharData.hp.current + 1 } })}>+</button>}

                                                    <span>/</span>

                                                    <input
                                                        className="glass-input"
                                                        type="number"
                                                        value={editedCharData.hp.max}
                                                        readOnly={!canEdit}
                                                        onChange={(e) => setEditedCharData({
                                                            ...editedCharData,
                                                            hp: { ...editedCharData.hp, max: Number(e.target.value) }
                                                        })}
                                                        style={{ width: '60px', textAlign: 'center', borderColor: canEdit ? '#4CAF50' : '' }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label>Classe de Armadura (AC)</label>
                                                <input
                                                    className="glass-input"
                                                    type="number"
                                                    value={resolveCharacterAC(editedCharData)}
                                                    readOnly={!canEdit}
                                                    onChange={(e) => {
                                                        const val = Number(e.target.value);
                                                        if (editedCharData.attributes || editedCharData.armorClass !== undefined) {
                                                            setEditedCharData({
                                                                ...editedCharData,
                                                                armorClass: val,
                                                                acOverride: val
                                                            });
                                                        } else {
                                                            setEditedCharData({
                                                                ...editedCharData,
                                                                armorClass: val,
                                                                ac: val,
                                                                bg: editedCharData.bg ? { ...editedCharData.bg, armorClass: val } : undefined
                                                            });
                                                        }
                                                    }}
                                                    style={{ width: '60px', height: '50px', fontSize: '1.2rem', textAlign: 'center', fontWeight: 'bold', borderColor: canEdit ? '#4CAF50' : '' }}
                                                />
                                            </div>
                                        </div>
                                    );
                                } else {
                                    // --- NPC / GENERIC TOKEN (EDITABLE LOCAL STATS) ---
                                    return (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                            <div style={{ background: '#332', color: '#ddb', padding: '8px', borderRadius: '4px', fontSize: '0.85rem', marginBottom: '10px' }}>
                                                Modo NPC: Edição manual de stats.
                                            </div>

                                            <div className="form-group">
                                                <label>Vida (HP)</label>
                                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                                    <button className="glass-button small" onClick={() => setToken({ ...token, hp: { ...token.hp!, current: Math.max(0, (token.hp?.current || 0) - 1) } })}>-</button>
                                                    <input
                                                        className="glass-input"
                                                        type="number"
                                                        value={token.hp?.current ?? 10}
                                                        onChange={e => setToken({
                                                            ...token,
                                                            hp: {
                                                                max: token.hp?.max ?? 10,
                                                                current: Number(e.target.value)
                                                            }
                                                        })}
                                                        style={{ width: '60px', textAlign: 'center' }}
                                                    />
                                                    <button className="glass-button small" onClick={() => setToken({ ...token, hp: { ...token.hp!, current: (token.hp?.current || 0) + 1 } })}>+</button>

                                                    <span>/</span>

                                                    <input
                                                        className="glass-input"
                                                        type="number"
                                                        value={token.hp?.max ?? 10}
                                                        onChange={e => setToken({
                                                            ...token,
                                                            hp: {
                                                                current: token.hp?.current ?? 10,
                                                                max: Number(e.target.value)
                                                            }
                                                        })}
                                                        style={{ width: '60px', textAlign: 'center' }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label>Classe de Armadura (AC)</label>
                                                <input
                                                    className="glass-input"
                                                    type="number"
                                                    value={token.ac ?? 10}
                                                    onChange={e => setToken({ ...token, ac: Number(e.target.value) })}
                                                    style={{ width: '60px', textAlign: 'center', fontSize: '1.2rem', padding: '10px' }}
                                                />
                                            </div>
                                        </div>
                                    );
                                }
                            })()}

                            {/* ELEVATION & CONDITIONS */}
                            <div style={{ marginTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                <div className="form-group">
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', marginBottom: '6px', color: '#e2e8f0' }}>
                                        <ArrowUp size={14} color="#38bdf8" />
                                        <span>Elevação / Altitude de Voo (metros)</span>
                                    </label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <input
                                            className="glass-input"
                                            type="number"
                                            min={0}
                                            step={1.5}
                                            value={token.elevation ?? 0}
                                            onChange={e => setToken({ ...token, elevation: Math.max(0, Number(e.target.value)) })}
                                            style={{ width: '80px', padding: '6px 10px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: '#fff', borderRadius: '4px', textAlign: 'center' }}
                                        />
                                        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>m (0 = no solo / chão)</span>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', marginBottom: '8px', color: '#e2e8f0' }}>
                                        <ShieldAlert size={14} color="#f87171" />
                                        <span>Condições Ativas (D&amp;D 2024 / TTRPG)</span>
                                    </label>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                        {['Amedrontado', 'Caído', 'Cego', 'Contido', 'Envenenado', 'Incapacitado', 'Invisível', 'Agarrado', 'Paralisado', 'Atordoado', 'Petrificado', 'Exaustão'].map(c => {
                                            const isSelected = (token.conditions || []).includes(c);
                                            return (
                                                <button
                                                    key={c}
                                                    type="button"
                                                    onClick={() => {
                                                        const current = token.conditions || [];
                                                        const updated = isSelected ? current.filter(x => x !== c) : [...current, c];
                                                        setToken({ ...token, conditions: updated });
                                                        if (editedCharData) {
                                                            setEditedCharData({ ...editedCharData, conditions: updated });
                                                        }
                                                    }}
                                                    style={{
                                                        padding: '4px 8px',
                                                        fontSize: '0.75rem',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer',
                                                        border: isSelected ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.15)',
                                                        background: isSelected ? 'rgba(239, 68, 68, 0.25)' : 'rgba(0,0,0,0.3)',
                                                        color: isSelected ? '#fca5a5' : '#aaa',
                                                        fontWeight: isSelected ? 600 : 400,
                                                        transition: 'all 0.15s ease'
                                                    }}
                                                >
                                                    {c}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* VISION TAB */}
                    {activeTab === 'vision' && (
                        <>
                            <div className="form-group">
                                <label>Alcance de Visão (Darkvision in Cells)</label>
                                <input
                                    type="number"
                                    value={token.visionRange || 0}
                                    onChange={e => setToken({ ...token, visionRange: Number(e.target.value) })}
                                    style={{ width: '100%', padding: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: '#fff', borderRadius: '4px' }}
                                />
                                <small style={{ color: '#aaa' }}>0 = Usa o da ficha do personagem</small>
                            </div>

                            <div className="form-group" style={{ borderTop: '1px solid #444', paddingTop: '10px', marginTop: '10px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={token.lightEnabled !== false}
                                        onChange={e => setToken({ ...token, lightEnabled: e.target.checked })}
                                    />
                                    <Sun size={14} color="#ffd700" />
                                    <span>Emitir Luz</span>
                                </label>
                            </div>

                            <div className="form-group">
                                <label>Emite Luz (Raio em Células)</label>
                                <input
                                    type="number"
                                    value={token.lightRadius || 0}
                                    onChange={e => setToken({ ...token, lightRadius: Number(e.target.value) })}
                                    style={{ width: '100%', padding: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: '#fff', borderRadius: '4px' }}
                                />
                                <small style={{ color: '#aaa' }}>Ex: Tocha = 6 células (30ft)</small>

                                {(config?.globalLight === 'bright') && (
                                    <div style={{
                                        marginTop: '5px', padding: '5px',
                                        background: 'rgba(255, 200, 0, 0.2)',
                                        border: '1px solid #eba', color: '#feb',
                                        fontSize: '0.8rem', borderRadius: '4px'
                                    }}>
                                        Aviso: Luz Global está 'Clara' (Bright). Luzes individuais não serão visíveis no mapa. Mude para 'Dim' ou 'Dark' nas Configurações do Mapa.
                                    </div>
                                )}
                            </div>

                            <div className="form-group">
                                <label>Cor da Luz</label>
                                <input
                                    type="color"
                                    value={token.lightColor || '#ffaa00'}
                                    onChange={e => setToken({ ...token, lightColor: e.target.value })}
                                    style={{ width: '100%', height: '40px', background: 'none', border: 'none' }}
                                />
                            </div>
                        </>
                    )}

                </div>

                {/* Footer */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', borderTop: '1px solid var(--glass-border)', paddingTop: '15px' }}>
                    <button className="glass-button" style={{ color: '#ff4444', borderColor: '#ff4444', display: 'flex', alignItems: 'center', gap: '6px' }} onClick={handleDelete}>
                        <Trash2 size={14} />
                        <span>Deletar</span>
                    </button>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button className="glass-button" onClick={onClose}>Cancelar</button>
                        <button className="glass-button active" onClick={handleSave}>Salvar</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
