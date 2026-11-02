import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useMap } from './MapContext';
import { useCombat } from '../combat/CombatContext';
import { compressTokenImage } from '../../utils/imageUtils';
import { Upload, UserPlus, Package } from 'lucide-react';

interface AddAssetModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const PRESETS = [
    { label: 'Barril', url: 'https://i.imgur.com/7bQ5zX0.png' },
    { label: 'Mesa', url: 'https://i.imgur.com/Kz6Z9X0.png' },
    { label: 'Baú', url: 'https://i.imgur.com/Qz7W9X0.png' },
    { label: 'Fogueira', url: 'https://i.imgur.com/5z6Z9X0.png' },
];

const MAX_PROP_DATAURL_CHARS = Math.floor(2.5 * 1024 * 1024);

export const AddAssetModal: React.FC<AddAssetModalProps> = ({ isOpen, onClose }) => {
    const { addToken, tokens, config } = useMap();
    const { addCombatant } = useCombat();

    // Mode: 'token' (Monster / NPC creature token) or 'asset' (Scenery prop)
    const [mode, setMode] = useState<'token' | 'asset'>('token');

    // Shared Form State
    const [name, setName] = useState('Novo Monstro / NPC');
    const [url, setUrl] = useState('');
    const [size, setSize] = useState(1);
    const [uploading, setUploading] = useState(false);

    // Creature / NPC Specific State
    const [hpMax, setHpMax] = useState(20);
    const [ac, setAc] = useState(12);
    const [borderColor, setBorderColor] = useState('#dd0000');
    const [startInvisible, setStartInvisible] = useState(false);
    const [addToInitiative, setAddToInitiative] = useState(true);

    if (!isOpen) return null;

    const compressPropToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;
                img.onload = () => {
                    const MAX_WIDTH = 1024;
                    const MAX_HEIGHT = 1024;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height = Math.max(1, Math.round(height * (MAX_WIDTH / width)));
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width = Math.max(1, Math.round(width * (MAX_HEIGHT / height)));
                            height = MAX_HEIGHT;
                        }
                    }

                    const encodeWebp = (w: number, h: number, q: number): string => {
                        const canvas = document.createElement('canvas');
                        canvas.width = Math.max(1, Math.round(w));
                        canvas.height = Math.max(1, Math.round(h));
                        const ctx = canvas.getContext('2d');
                        if (!ctx) throw new Error('Canvas context is null');
                        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                        return canvas.toDataURL('image/webp', q);
                    };

                    try {
                        let dataUrl = encodeWebp(width, height, 0.82);
                        if (dataUrl.length > MAX_PROP_DATAURL_CHARS) {
                            dataUrl = encodeWebp(width * 0.7, height * 0.7, 0.72);
                        }
                        if (dataUrl.length > MAX_PROP_DATAURL_CHARS) {
                            reject(new Error('O arquivo excedeu o limite seguro de 2,5 MB mesmo após compressão WebP. Use uma imagem menor ou cole uma URL externa.'));
                            return;
                        }
                        resolve(dataUrl);
                    } catch (err) {
                        reject(err);
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
        const cleanFileName = file.name.replace(/\.[^/.]+$/, '');
        if (!name || name === 'Novo Asset' || name === 'Novo Monstro / NPC') {
            setName(cleanFileName);
        }

        try {
            const base64Url = mode === 'token'
                ? await compressTokenImage(file)
                : await compressPropToBase64(file);
            setUrl(base64Url);
        } catch (error: any) {
            console.error('Compression failed', error);
            alert(error?.message || 'Erro ao processar imagem.');
            setUrl('');
            e.target.value = '';
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const effectiveUrl = url.trim() || (mode === 'token' ? '/tokens/token_default.png' : '');
        if (!effectiveUrl) {
            alert('Insira uma URL ou faça upload de uma imagem.');
            return;
        }

        if (effectiveUrl.startsWith('data:') && effectiveUrl.length > MAX_PROP_DATAURL_CHARS) {
            alert('A imagem em Base64 excede o limite seguro de 2,5 MB. Escolha uma imagem menor ou use uma URL externa.');
            return;
        }

        const occupied = new Set(tokens.map(t => `${t.position.x},${t.position.y}`));
        let posX = Math.floor(config.width / 2);
        let posY = Math.floor(config.height / 2);
        while (occupied.has(`${posX},${posY}`)) {
            posX += 1;
            if (posX >= config.width - 1) {
                posX = Math.max(1, Math.floor(config.width / 2) - 3);
                posY = Math.min(config.height - 1, posY + 1);
                break;
            }
        }

        const tokenId = crypto.randomUUID();

        if (mode === 'token') {
            const safeHp = Math.max(1, Number(hpMax) || 10);
            const safeAc = Math.max(1, Number(ac) || 10);

            addToken({
                id: tokenId,
                combatantId: addToInitiative ? tokenId : undefined,
                name: name || 'Monstro / NPC',
                position: { x: posX, y: posY },
                size: size,
                imageUrl: effectiveUrl,
                color: borderColor,
                hp: { current: safeHp, max: safeHp },
                ac: safeAc,
                visibleStats: false,
                invisible: startInvisible,
                isAsset: false,
                lightEnabled: false,
                lightRadius: 0
            });

            if (addToInitiative) {
                addCombatant({
                    id: tokenId,
                    name: name || 'Monstro / NPC',
                    initiative: Math.floor(Math.random() * 20) + 1,
                    isNPC: true,
                    imageUrl: effectiveUrl,
                    ac: safeAc,
                    hp: { current: safeHp, max: safeHp },
                    status: 'normal'
                });
            }
        } else {
            addToken({
                id: tokenId,
                name: name || 'Asset',
                position: { x: posX, y: posY },
                size: size,
                imageUrl: effectiveUrl,
                color: '#888888',
                visibleStats: false,
                invisible: false,
                isAsset: true,
                lightEnabled: false,
                lightRadius: 0
            });
        }

        onClose();
        setName(mode === 'token' ? 'Novo Monstro / NPC' : 'Novo Asset');
        setUrl('');
    };

    return createPortal(
        <div style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            overflowY: 'auto',
            padding: '20px'
        }}>
            <div className="glass-panel" style={{
                margin: 'auto',
                width: '100%', maxWidth: '470px',
                maxHeight: '92vh',
                overflowY: 'auto',
                padding: '22px',
                background: '#222', border: '1px solid #444', borderRadius: '8px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.8)'
            }}>
                {/* Mode Selector */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                    <button
                        type="button"
                        onClick={() => {
                            setMode('token');
                            if (name === 'Novo Asset') setName('Novo Monstro / NPC');
                        }}
                        style={{
                            flex: 1,
                            padding: '9px',
                            borderRadius: '6px',
                            border: mode === 'token' ? '1px solid #c5a059' : '1px solid #444',
                            background: mode === 'token' ? 'rgba(197, 160, 89, 0.2)' : '#1a1a1a',
                            color: mode === 'token' ? '#fde047' : '#aaa',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px'
                        }}
                    >
                        <UserPlus size={15} />
                        <span>Token (Monstro / NPC)</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setMode('asset');
                            if (name === 'Novo Monstro / NPC') setName('Novo Asset');
                        }}
                        style={{
                            flex: 1,
                            padding: '9px',
                            borderRadius: '6px',
                            border: mode === 'asset' ? '1px solid #38bdf8' : '1px solid #444',
                            background: mode === 'asset' ? 'rgba(56, 189, 248, 0.18)' : '#1a1a1a',
                            color: mode === 'asset' ? '#bae6fd' : '#aaa',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px'
                        }}
                    >
                        <Package size={15} />
                        <span>Asset / Cenário</span>
                    </button>
                </div>

                {mode === 'asset' && (
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '15px', overflowX: 'auto', paddingBottom: '5px' }}>
                        {PRESETS.map((p, i) => (
                            <button key={i} type="button" onClick={() => {
                                setName(p.label);
                                setUrl(p.url);
                            }} className="glass-button small" style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                                {p.label}
                            </button>
                        ))}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '13px' }}>
                    {mode === 'token' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#191919', padding: '10px', borderRadius: '6px', border: '1px solid #333' }}>
                            <img
                                src={url || '/tokens/token_default.png'}
                                alt="Preview Token"
                                style={{
                                    width: '58px',
                                    height: '58px',
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    border: `3px solid ${borderColor}`,
                                    background: '#111',
                                    flexShrink: 0
                                }}
                            />
                            <div style={{ fontSize: '0.8rem', color: '#bbb' }}>
                                Envie qualquer imagem do seu PC ou cole uma URL para criar o token redondo de <strong style={{ color: '#fff' }}>Monstro</strong> ou <strong style={{ color: '#fff' }}>NPC</strong> direto no mapa.
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="label-text">Nome</label>
                        <input
                            type="text"
                            className="input-dark"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder={mode === 'token' ? 'Ex: Guarda da Cidade, Carniçal...' : 'Ex: Mesa de Pedra'}
                        />
                    </div>

                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '6px', border: '1px dashed #555' }}>
                        <label className="label-text" style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Upload size={14} />
                            <span>Upload de Imagem Local</span>
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            disabled={uploading}
                            style={{ color: '#ccc', width: '100%' }}
                        />
                        {uploading && <div style={{ color: '#ffcc00', marginTop: '5px', fontSize: '0.9em' }}>Processando Imagem (WebP)...</div>}
                    </div>

                    <div style={{ textAlign: 'center', color: '#666', fontSize: '0.8em' }}>- OU -</div>

                    <div>
                        <label className="label-text">URL da Imagem</label>
                        <input
                            type="text"
                            className="input-dark"
                            value={url.startsWith('data:') ? '' : url}
                            onChange={e => setUrl(e.target.value)}
                            placeholder="https://..."
                            onFocus={(e) => e.target.select()}
                        />
                        {url.startsWith('data:') && (
                            <div style={{ fontSize: '0.75rem', color: '#4ade80', marginTop: '4px' }}>
                                Arquivo local carregado com sucesso.
                            </div>
                        )}
                    </div>

                    {mode === 'token' && (
                        <>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                                <div>
                                    <label className="label-text">PV (Vida)</label>
                                    <input
                                        type="number"
                                        className="input-dark"
                                        min={1}
                                        value={hpMax}
                                        onChange={e => setHpMax(Math.max(1, Number(e.target.value) || 1))}
                                    />
                                </div>
                                <div>
                                    <label className="label-text">CA (Defesa)</label>
                                    <input
                                        type="number"
                                        className="input-dark"
                                        min={1}
                                        value={ac}
                                        onChange={e => setAc(Math.max(1, Number(e.target.value) || 10))}
                                    />
                                </div>
                                <div>
                                    <label className="label-text">Cor da Borda</label>
                                    <select
                                        className="input-dark"
                                        value={borderColor}
                                        onChange={e => setBorderColor(e.target.value)}
                                    >
                                        <option value="#dd0000">Inimigo (Vermelho)</option>
                                        <option value="#3b82f6">NPC / Aliado (Azul)</option>
                                        <option value="#c5a059">Neutro / Chefe (Ouro)</option>
                                        <option value="#10b981">Amigável (Verde)</option>
                                    </select>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '0.85rem', color: '#ddd' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={addToInitiative}
                                        onChange={e => setAddToInitiative(e.target.checked)}
                                    />
                                    <span>Adicionar à Iniciativa</span>
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={startInvisible}
                                        onChange={e => setStartInvisible(e.target.checked)}
                                    />
                                    <span>Iniciar Oculto p/ Jogadores</span>
                                </label>
                            </div>
                        </>
                    )}

                    <div>
                        <label className="label-text">Tamanho (Quadrados)</label>
                        <select
                            className="input-dark"
                            value={size}
                            onChange={e => setSize(Number(e.target.value))}
                        >
                            <option value={0.5}>Mínimo (0.5x0.5)</option>
                            <option value={1}>Médio (1x1)</option>
                            <option value={2}>Grande (2x2)</option>
                            <option value={3}>Enorme (3x3)</option>
                            <option value={4}>Imenso (4x4)</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                        <button type="button" onClick={onClose} style={{
                            padding: '8px 16px', background: '#333', color: '#ccc', border: '1px solid #555', borderRadius: '4px', cursor: 'pointer'
                        }}>
                            Cancelar
                        </button>
                        <button type="submit" disabled={uploading || (mode === 'asset' && !url)} style={{
                            padding: '8px 16px',
                            background: (uploading || (mode === 'asset' && !url)) ? '#444' : '#0066cc',
                            color: '#fff',
                            border: '1px solid #004488',
                            borderRadius: '4px',
                            cursor: (uploading || (mode === 'asset' && !url)) ? 'not-allowed' : 'pointer',
                            fontWeight: 'bold'
                        }}>
                            {uploading ? 'Processando...' : (mode === 'token' ? 'Criar Token no Mapa' : 'Adicionar Asset')}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};
