import React, { useState, useEffect, useRef } from 'react';
import { useMap } from './MapContext';
import { usePeer } from '../multiplayer/FirebaseContext';
import type { MapToken } from './mapTypes';
import '../../Layout.css';
import { useCombat } from '../combat/CombatContext';

interface TokenSettingsModalProps {
    tokenId: string | null;
    onClose: () => void;
    onOpenSheet?: () => void;
}

export const TokenSettingsModal: React.FC<TokenSettingsModalProps> = ({ tokenId, onClose, onOpenSheet }) => {
    const { tokens, updateToken, removeToken, config } = useMap();
    const { connectedPlayersData, myCharacter, isHost, broadcastCharacterUpdate, updateRemotePlayerCharacter } = usePeer();
    const { addCombatant, removeCombatant, updateCombatant, combatState } = useCombat(); // Import Combat Hooks

    const [token, setToken] = useState<MapToken | null>(null);
    const [activeTab, setActiveTab] = useState<'identity' | 'stats' | 'vision' | 'appearance'>('identity');

    // ... (State setup remains check line 20+)

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
            let initialTokenState = { ...t };

            // If there is a linked combatant, prioritize its health/AC status because that's what is shown on map
            const linkedCombatant = (combatState.combatants || []).find(c => c.id === t.id || c.id === t.combatantId || (t.characterId && c.characterId === t.characterId));
            if (linkedCombatant) {
                console.log("Loading stats from Linked Combatant for Editor:", linkedCombatant);
                if (linkedCombatant.hp) initialTokenState.hp = { ...linkedCombatant.hp };
                if (linkedCombatant.ac) initialTokenState.ac = linkedCombatant.ac;
            }

            // Only load external character data if we haven't touched the form yet
            // (Note: Since we are guarding by ID now, we handle the 'first load' here)
            if (t.characterId) {
                let charData = Object.values(connectedPlayersData).find(p => p.character?.id === t.characterId)?.character;
                // If not found in players, check if it's my own character
                if (!charData && myCharacter && myCharacter.id === t.characterId) charData = myCharacter;

                if (charData) {
                    setEditedCharData(JSON.parse(JSON.stringify(charData)));

                    // AUTO-VISION SYNC
                    if (!initialTokenState.visionRange && charData.visionRange && charData.visionRange > 0) {
                        console.log("Auto-Syncing Vision directly from Character Sheet:", charData.visionRange);
                        initialTokenState.visionRange = charData.visionRange;
                    }
                }
            }
            setToken(initialTokenState);
        }
    }, [tokenId, tokens, connectedPlayersData, myCharacter, combatState]); // Dependencies kept, but guarded by initializedTokenId

    if (!tokenId || !token) return null;

    // Check if token is already in combat
    // Check if token is already in combat
    // We use Token ID as Combatant ID for map tokens (unless strictly character linked)
    // Actually, usually we prefer Link by CharacterID if available, but for generic monsters, TokenID is safer.
    // Let's check both or generic.
    const isInCombat = (combatState.combatants || []).some(c => c.id === token.id || c.id === token.combatantId || (token.characterId && c.characterId === token.characterId));

    const handleToggleCombat = () => {
        if (isInCombat) {
            // Remove
            const c = (combatState.combatants || []).find(c => c.id === token.id || c.id === token.combatantId || (token.characterId && c.characterId === token.characterId));
            if (c) removeCombatant(c.id);
        } else {
            // Add
            // Determine Stats
            let hpCurrent = token.hp?.current ?? 10;
            let hpMax = token.hp?.max ?? 10;
            let ac = token.ac ?? 10;
            let name = token.name;

            // If Character Link, use that data preferred?
            if (editedCharData) {
                hpCurrent = editedCharData.hp.current;
                hpMax = editedCharData.hp.max;
                ac = editedCharData.bg?.armorClass || editedCharData.ac || 10;
                name = editedCharData.name;
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
        // ... (existing save logic)
        updateToken(tokenId, token);

        // SYNC WITH COMBATANT (Fix for HP Priority Issue)
        // If the token is in combat, we MUST update the combatant entry as well,
        // because Token.tsx prioritizes combatant data over token data.
        const linkedCombatant = (combatState.combatants || []).find(c => c.id === token.id || c.id === token.combatantId || (token.characterId && c.characterId === token.characterId));

        if (linkedCombatant) {
            console.log("Syncing edits to Combatant:", linkedCombatant.id);

            // Prepare updates
            // Use local state 'token' which has the fresh edits
            let hpCurrent = token.hp?.current ?? 10;
            let hpMax = token.hp?.max ?? 10;
            let ac = token.ac ?? 10;

            // If Character Link active + Edited Data, prefer that?
            // Actually, if we are in this modal, we might have edited 'editedCharData'.
            // If it is a character, we should use 'editedCharData' if available.
            if (token.characterId && editedCharData) {
                hpCurrent = editedCharData.hp.current;
                hpMax = editedCharData.hp.max;
                ac = editedCharData.bg?.armorClass || editedCharData.ac || 10;
            }

            updateCombatant(linkedCombatant.id, {
                hp: { current: hpCurrent, max: hpMax },
                ac: ac
            });
        }

        if (token.characterId && editedCharData) {
            // ... (existing character save logic, kept identical)
            console.log("Saving Linked Character Data...", editedCharData);
            const ownerEntry = Object.values(connectedPlayersData).find(p => p.character?.id === token.characterId);
            const targetPeerId = ownerEntry?.peerId || 'unknown';

            if (myCharacter && myCharacter.id === token.characterId) {
                broadcastCharacterUpdate(editedCharData);
            } else if (isHost) {
                if (targetPeerId && targetPeerId !== 'unknown') {
                    updateRemotePlayerCharacter(targetPeerId, editedCharData);
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
                <h2 style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
                    🛠️ Editar Token: {token.name}
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            onClick={handleToggleCombat}
                            title={isInCombat ? "Remover do Combate" : "Adicionar ao Combate"}
                            style={{
                                fontSize: '1.2rem', padding: '0 8px',
                                background: isInCombat ? '#442222' : '#224422',
                                border: `1px solid ${isInCombat ? '#884444' : '#448844'}`,
                                color: '#fff', cursor: 'pointer', borderRadius: '4px'
                            }}
                        >
                            {isInCombat ? '⚔️✅' : '⚔️'}
                        </button>

                        {token.characterId && (
                            <button
                                onClick={() => {
                                    window.dispatchEvent(new CustomEvent('request_open_sheet', { detail: token.characterId }));
                                    onClose();
                                }}
                                style={{ fontSize: '0.8rem', padding: '5px', background: '#444', border: '1px solid #666', color: '#fff', cursor: 'pointer', borderRadius: '4px' }}
                            >
                                📄 Abrir Ficha
                            </button>
                        )}
                        {onOpenSheet && !token.characterId && isHost && (
                            <button
                                onClick={onOpenSheet}
                                style={{ fontSize: '0.8rem', padding: '5px', background: '#444', border: '1px solid #666', color: '#fff', cursor: 'pointer', borderRadius: '4px' }}
                            >
                                📄 Abrir Ficha
                            </button>
                        )}
                        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>✕</button>
                    </div>
                </h2>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px' }}>
                    <button
                        className={`glass-button small ${activeTab === 'identity' ? 'active' : ''}`}
                        onClick={() => setActiveTab('identity')}
                    >👤 Identidade</button>
                    <button
                        className={`glass-button small ${activeTab === 'stats' ? 'active' : ''}`}
                        onClick={() => setActiveTab('stats')}
                    >📊 Stats</button>
                    <button
                        className={`glass-button small ${activeTab === 'vision' ? 'active' : ''}`}
                        onClick={() => setActiveTab('vision')}
                    >👁️ Visão/Luz</button>
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
                                        <span>👻 Invisível para Jogadores</span>
                                    </label>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            checked={token.visibleStats || false}
                                            onChange={e => setToken({ ...token, visibleStats: e.target.checked })}
                                        />
                                        <span>❤️ Barra de Vida Pública (Todos Veem)</span>
                                    </label>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            checked={token.isLocked || false}
                                            onChange={e => setToken({ ...token, isLocked: e.target.checked })}
                                        />
                                        <span>🔒 Travar Movimento</span>
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
                                    const canEdit = isHost; // Or Owner (but owner usually edits sheet)

                                    return (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                            {!canEdit && <div style={{ fontSize: '0.8rem', color: '#aaa', marginBottom: '5px' }}>🔒 Visualização apenas (Edite na Ficha)</div>}
                                            {canEdit && <div style={{ fontSize: '0.8rem', color: '#cfc', marginBottom: '5px' }}>🔓 Modo GM: Editando Ficha Linkada</div>}



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
                                                            console.log("Changing HP:", e.target.value);
                                                            setEditedCharData({
                                                                ...editedCharData,
                                                                hp: { ...editedCharData.hp, current: Number(e.target.value) }
                                                            })
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
                                                    value={editedCharData.bg?.armorClass || editedCharData.ac || 10}
                                                    readOnly={!canEdit}
                                                    onChange={(e) => {
                                                        // AC usually lives in 'bg' metadata or root depending on structure
                                                        // We'll update root 'ac' for simplicity or 'bg.armorClass' if that's the convention
                                                        setEditedCharData({
                                                            ...editedCharData,
                                                            bg: { ...editedCharData.bg, armorClass: Number(e.target.value) },
                                                            ac: Number(e.target.value) // Fallback
                                                        })
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
                                                📝 Modo NPC: Edição manual de stats.
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
                                    <span>💡 Emitir Luz</span>
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
                                        ⚠️ Luz Global está 'Clara' (Bright). Luzes individuais não serão visíveis no mapa. Mude para 'Dim' ou 'Dark' nas Configurações do Mapa.
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
                    <button className="glass-button" style={{ color: '#ff4444', borderColor: '#ff4444' }} onClick={handleDelete}>🗑️ Deletar</button>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button className="glass-button" onClick={onClose}>Cancelar</button>
                        <button className="glass-button active" onClick={handleSave}>Salvar</button>
                    </div>
                </div>
            </div>
        </div >
    );
};
