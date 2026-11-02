import React, { useState, useEffect, useRef } from 'react';
import type { Monster } from './monsterTypes';
import { MonsterRepository } from './MonsterRepository';
import { useMap } from '../map/MapContext';
import { useCombat } from '../combat/CombatContext';
import { compressTokenImage } from '../../utils/imageUtils';
import { X, RefreshCw, Edit2, Camera, Upload } from 'lucide-react';

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
    const [showImagePanel, setShowImagePanel] = useState(false);
    const [urlDraft, setUrlDraft] = useState('');
    const [uploadingImage, setUploadingImage] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Identify Source of Truth
    const token = tokens.find(t => t.id === tokenId);
    const combatant = (combatState.combatants || []).find(c =>
        (token && (c.id === token.id || c.id === token.combatantId)) ||
        (token?.characterId && c.characterId === token.characterId)
    );

    const prevExternalState = useRef({
        hpCurrent: -999,
        hpMax: -999,
        ac: -999
    });

    // Initial Load & Sync Logic
    useEffect(() => {
        let newHpCurrent: number;
        let newHpMax: number;
        let newAc: number;

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
                hp: { current: hpCurrent, max: hpMax },
                ac: ac
            });
        }
    };

    const handleClose = () => {
        handleSave();
        onClose();
    };

    const applyTokenImage = (newImageUrl: string) => {
        if (token) {
            updateToken(tokenId, { imageUrl: newImageUrl });
        }
        if (combatant) {
            updateCombatant(combatant.id, { imageUrl: newImageUrl });
        }
        // Se for um monstro/NPC catalogado no Bestiário, salva também a arte para futuros spawns
        if (monster.id && monster.id !== 'generic') {
            const existing = MonsterRepository.getById(monster.id) || monster;
            const preservedOriginal = existing.originalSource || (existing.source !== 'Custom' ? existing.source : undefined);
            MonsterRepository.saveCustomMonster({
                ...existing,
                imageUrl: newImageUrl,
                source: 'Custom',
                ...(preservedOriginal ? { originalSource: preservedOriginal } : {})
            });
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadingImage(true);
        try {
            const compressed = await compressTokenImage(file);
            applyTokenImage(compressed);
            setShowImagePanel(false);
        } catch (err: any) {
            console.error('[EditableMonsterSheet] Erro ao enviar imagem do token:', err);
            alert(err?.message || 'Erro ao processar imagem do token.');
        } finally {
            setUploadingImage(false);
            e.target.value = '';
        }
    };

    const handleBlur = () => {
        handleSave();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            (e.target as HTMLInputElement).blur();
        }
    };

    const currentTokenImage = token?.imageUrl || MonsterRepository.getTokenUrl(monster);

    return (
        <div style={{
            background: '#1a1a1a',
            border: '1px solid #8B0000',
            borderRadius: '8px',
            padding: '15px',
            color: '#eee',
            fontFamily: 'Segoe UI, sans-serif',
            width: '335px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.8)',
            position: 'relative'
        }}>
            <button
                onClick={handleClose}
                title="Salvar e Fechar"
                style={{
                    position: 'absolute', top: '8px', right: '8px',
                    background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center'
                }}
            >
                <X size={18} />
            </button>

            {/* Header with Token Avatar */}
            <div style={{ borderBottom: '2px solid #8B0000', paddingBottom: '10px', marginBottom: '12px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button
                    type="button"
                    onClick={() => {
                        setUrlDraft(token?.imageUrl && !token.imageUrl.startsWith('data:') ? token.imageUrl : '');
                        setShowImagePanel(v => !v);
                    }}
                    title="Alterar imagem do token"
                    style={{
                        position: 'relative',
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        border: '2px solid #c5a059',
                        padding: 0,
                        background: '#111',
                        cursor: 'pointer',
                        overflow: 'hidden',
                        flexShrink: 0
                    }}
                >
                    <img
                        src={currentTokenImage}
                        alt={monster.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                    <span style={{
                        position: 'absolute', right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.8)', borderRadius: '50%', padding: '3px', display: 'flex'
                    }}>
                        <Camera size={10} color="#c5a059" />
                    </span>
                </button>
                <div style={{ flex: 1, paddingRight: '18px' }}>
                    <h2 style={{ margin: 0, color: '#c5a059', fontSize: '1.25rem', lineHeight: 1.2 }}>{token?.name || monster.name}</h2>
                    <div style={{ fontSize: '0.82rem', color: '#aaa', marginTop: '3px' }}>
                        {monster.size} {monster.category} • CR {monster.cr}
                    </div>
                </div>
            </div>

            {showImagePanel && (
                <div style={{
                    background: '#242424',
                    border: '1px solid #444',
                    borderRadius: '6px',
                    padding: '10px',
                    marginBottom: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                }}>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploadingImage}
                            style={{
                                flex: 1,
                                background: '#334155',
                                border: '1px solid #64748b',
                                color: '#fff',
                                padding: '5px 8px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '0.78rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '5px'
                            }}
                        >
                            <Upload size={13} />
                            <span>{uploadingImage ? 'Enviando...' : 'Upload Imagem Local'}</span>
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleFileUpload}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '5px' }}>
                        <input
                            type="text"
                            placeholder="Ou cole URL da imagem..."
                            value={urlDraft}
                            onChange={e => setUrlDraft(e.target.value)}
                            style={{
                                flex: 1,
                                background: '#161616',
                                border: '1px solid #444',
                                borderRadius: '4px',
                                color: '#fff',
                                padding: '4px 8px',
                                fontSize: '0.78rem'
                            }}
                        />
                        <button
                            type="button"
                            onClick={() => {
                                if (urlDraft.trim()) {
                                    applyTokenImage(urlDraft.trim());
                                    setShowImagePanel(false);
                                }
                            }}
                            style={{
                                background: '#28a745',
                                border: 'none',
                                color: '#fff',
                                borderRadius: '4px',
                                padding: '4px 10px',
                                cursor: 'pointer',
                                fontSize: '0.78rem',
                                fontWeight: 'bold'
                            }}
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}

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
            <div style={{ fontSize: '0.8rem', color: '#888', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                {combatant ? (
                    <>
                        <RefreshCw size={12} color="#4caf50" />
                        <span>Sincronizado com Combate</span>
                    </>
                ) : (
                    <>
                        <Edit2 size={12} color="#aaa" />
                        <span>Editando Token (Fora de Combate)</span>
                    </>
                )}
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
