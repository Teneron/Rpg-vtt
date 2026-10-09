import React, { useState, useEffect } from 'react';
import { useMap } from './MapContext';
import type { MapToken } from './mapTypes';
import { Box, X, Lightbulb, Trash2 } from 'lucide-react';
import '../../Layout.css';

interface AssetSettingsModalProps {
    tokenId: string | null;
    onClose: () => void;
}

export const AssetSettingsModal: React.FC<AssetSettingsModalProps> = ({ tokenId, onClose }) => {
    const { tokens, updateToken, removeToken } = useMap();
    const [asset, setAsset] = useState<MapToken | null>(null);
    const initializedId = React.useRef<string | null>(null);

    useEffect(() => {
        if (!tokenId) {
            initializedId.current = null;
            return;
        }

        // Prevent overwrite if already editing this token
        if (initializedId.current === tokenId) return;

        const found = tokens.find(t => t.id === tokenId);
        if (found) {
            initializedId.current = tokenId;
            setAsset({ ...found });
        }
    }, [tokenId, tokens]);

    if (!tokenId || !asset) return null;

    const handleSave = () => {
        if (asset) {
            // Sanitize undefined values for Firebase
            const updates = { ...asset };
            if (updates.lightRadius === undefined) updates.lightRadius = 0;
            if (updates.lightColor === undefined) updates.lightColor = '#ffaa00';
            if (updates.lightEnabled === undefined) updates.lightEnabled = true;

            updateToken(tokenId, updates);
        }
        onClose();
    };

    const handleDelete = () => {
        if (confirm("Tem certeza que deseja apagar este asset/prop?")) {
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
            <div className="glass-panel" style={{ width: '400px', maxHeight: '90vh', overflowY: 'auto', flexDirection: 'column', gap: '20px', padding: '25px' }}>
                <h2 style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#ffcc00' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Box size={18} color="#ffcc00" />
                        <span>Editar Asset / Prop</span>
                    </span>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                        <X size={18} />
                    </button>
                </h2>

                <div className="form-group">
                    <label>Nome</label>
                    <input
                        className="glass-input"
                        value={asset.name}
                        onChange={e => setAsset({ ...asset, name: e.target.value })}
                        style={{ width: '100%', padding: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: '#fff', borderRadius: '4px' }}
                    />
                </div>

                <div className="form-group">
                    <label>Imagem (URL)</label>
                    <input
                        className="glass-input"
                        value={asset.imageUrl || ''}
                        onChange={e => setAsset({ ...asset, imageUrl: e.target.value })}
                        placeholder="https://..."
                        style={{ width: '100%', padding: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: '#fff', borderRadius: '4px' }}
                    />
                </div>

                <div className="form-group">
                    <label>Rotação (Graus)</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <input
                                type="range"
                                min="0"
                                max="360"
                                step="15"
                                value={asset.rotation || 0}
                                onChange={e => setAsset({ ...asset, rotation: Number(e.target.value) })}
                                style={{ flex: 1 }}
                            />
                            <input
                                type="number"
                                value={asset.rotation || 0}
                                onChange={e => setAsset({ ...asset, rotation: Number(e.target.value) })}
                                style={{ width: '60px', padding: '5px', textAlign: 'center', background: 'rgba(0,0,0,0.3)', border: '1px solid #555', color: '#fff', borderRadius: '4px' }}
                            />
                            <span>°</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '5px' }}>
                            {[0, 45, 90, 180, 270].map(deg => (
                                <button
                                    key={deg}
                                    type="button"
                                    onClick={() => setAsset({ ...asset, rotation: deg })}
                                    style={{
                                        flex: 1, padding: '4px', background: '#333', border: '1px solid #555',
                                        color: '#ccc', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem'
                                    }}
                                >
                                    {deg}°
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="form-group">
                    <label>Tamanho (Células)</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <button
                                type="button"
                                onClick={() => setAsset({ ...asset, size: Math.max(0.5, (asset.size || 1) - 0.5) })}
                                style={{ width: '30px', height: '30px', background: '#444', border: '1px solid #666', color: '#fff', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >-</button>

                            <input
                                type="number"
                                step="0.1"
                                value={asset.size}
                                onChange={e => setAsset({ ...asset, size: Number(e.target.value) })}
                                style={{ width: '60px', padding: '8px', textAlign: 'center', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: '#fff', borderRadius: '4px' }}
                            />

                            <button
                                type="button"
                                onClick={() => setAsset({ ...asset, size: (asset.size || 1) + 0.5 })}
                                style={{ width: '30px', height: '30px', background: '#444', border: '1px solid #666', color: '#fff', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >+</button>
                        </div>
                        <input
                            type="range"
                            min="0.5"
                            max="5"
                            step="0.5"
                            value={asset.size || 1}
                            onChange={e => setAsset({ ...asset, size: Number(e.target.value) })}
                            style={{ width: '100%' }}
                        />
                    </div>
                </div>

                <div className="form-group" style={{
                    borderTop: '1px solid #444',
                    padding: '15px',
                    marginTop: '10px',
                    background: 'rgba(255, 200, 0, 0.05)',
                    borderRadius: '8px',
                    border: '1px solid #664400'
                }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', cursor: 'pointer', fontWeight: 'bold', color: '#ffcc00' }}>
                        <input
                            type="checkbox"
                            checked={asset.lightEnabled !== false}
                            onChange={e => {
                                const isEnabled = e.target.checked;
                                setAsset({
                                    ...asset,
                                    lightEnabled: isEnabled,
                                    // Auto-set radius to 5 if enabling and it was 0
                                    lightRadius: (isEnabled && !asset.lightRadius) ? 5 : asset.lightRadius
                                });
                            }}
                        />
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Lightbulb size={15} color="#ffd700" />
                            <span>Emitir Luz (Iluminação)</span>
                        </span>
                    </label>

                    {(asset.lightEnabled !== false) && (
                        <div style={{ marginLeft: '10px', display: 'flex', flexDirection: 'column', gap: '10px', borderLeft: '2px solid #664400', paddingLeft: '15px' }}>
                            <div className="form-group">
                                <label style={{ fontSize: '0.9rem', color: '#ddd' }}>Raio de Luz (Metros/Células)</label>
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                    <button
                                        type="button"
                                        onClick={() => setAsset({ ...asset, lightRadius: Math.max(0, (asset.lightRadius || 0) - 5) })}
                                        style={{ width: '30px', height: '30px', background: '#444', border: '1px solid #666', color: '#fff', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    >-</button>
                                    <input
                                        type="number"
                                        value={asset.lightRadius || 0}
                                        onChange={e => setAsset({ ...asset, lightRadius: Number(e.target.value) })}
                                        style={{ width: '70px', padding: '6px', background: 'rgba(0,0,0,0.5)', border: '1px solid #666', color: '#fff', borderRadius: '4px', textAlign: 'center' }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setAsset({ ...asset, lightRadius: (asset.lightRadius || 0) + 5 })}
                                        style={{ width: '30px', height: '30px', background: '#444', border: '1px solid #666', color: '#fff', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    >+</button>
                                    <span style={{ fontSize: '0.8rem', color: '#aaa' }}>Células</span>
                                </div>
                            </div>
                            <div className="form-group">
                                <label style={{ fontSize: '0.9rem', color: '#ddd' }}>Cor da Luz</label>
                                <input
                                    type="color"
                                    value={asset.lightColor || '#ffaa00'}
                                    onChange={e => setAsset({ ...asset, lightColor: e.target.value })}
                                    style={{ width: '100%', height: '40px', background: '#222', border: '1px solid #444', borderRadius: '4px', padding: '2px', cursor: 'pointer' }}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div style={{ marginTop: '10px' }}>
                    <details style={{ fontSize: '0.7em', color: '#666', marginBottom: '10px' }}>
                        <summary>Dados brutos (Debug)</summary>
                        <pre style={{ background: '#000', padding: '5px', borderRadius: '4px', overflowX: 'auto' }}>
                            {JSON.stringify(asset, null, 2)}
                        </pre>
                    </details>
                </div>

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
