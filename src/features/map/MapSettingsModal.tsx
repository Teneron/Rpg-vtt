import React, { useState } from 'react';
import { useMap } from './MapContext';
import { compressImage } from '../../utils/imageUtils';
import { Settings, X, Map, Ruler, Lightbulb, AlertTriangle, Cloud } from 'lucide-react';
import '../../Layout.css';

interface MapSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const MapSettingsModal: React.FC<MapSettingsModalProps> = ({ isOpen, onClose }) => {
    const { config, setConfig } = useMap();
    const [activeTab, setActiveTab] = useState<'general' | 'grid' | 'lighting'>('general');

    if (!isOpen) return null;

    // Helper to update config immediately (Live Preview)
    const update = (updates: Partial<typeof config>) => {
        setConfig({ ...config, ...updates });
    };

    return (
        <div className="modal-overlay" style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000
        }}>
            <div className="glass-panel" style={{ width: '500px', flexDirection: 'column', gap: '20px' }}>
                <h2 style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Settings size={18} color="#c5a059" />
                        <span>Configurações do Mapa</span>
                    </span>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                        <X size={18} />
                    </button>
                </h2>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px' }}>
                    <button
                        className={`glass-button small ${activeTab === 'general' ? 'active' : ''}`}
                        onClick={() => setActiveTab('general')}
                        style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
                    >
                        <Map size={13} />
                        <span>Geral</span>
                    </button>
                    <button
                        className={`glass-button small ${activeTab === 'grid' ? 'active' : ''}`}
                        onClick={() => setActiveTab('grid')}
                        style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
                    >
                        <Ruler size={13} />
                        <span>Grid</span>
                    </button>
                    <button
                        className={`glass-button small ${activeTab === 'lighting' ? 'active' : ''}`}
                        onClick={() => setActiveTab('lighting')}
                        style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
                    >
                        <Lightbulb size={13} />
                        <span>Iluminação</span>
                    </button>
                </div>

                {/* Content */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

                    {/* GENERAL TAB */}
                    {activeTab === 'general' && (
                        <>
                            <div className="form-group">
                                <label>Imagem/Vídeo de Fundo</label>
                                <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                                    {/* URL Input */}
                                    <input
                                        className="glass-input"
                                        value={config.backgroundImage || ''}
                                        onChange={e => update({ backgroundImage: e.target.value })}
                                        placeholder="URL da imagem ou vídeo..."
                                        style={{ width: '100%', padding: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: '#fff', borderRadius: '4px' }}
                                    />

                                    {/* Divider */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem', color: '#999' }}>
                                        <hr style={{ flex: 1, borderColor: '#444' }} />
                                        <span>OU ARQUIVO LOCAL</span>
                                        <hr style={{ flex: 1, borderColor: '#444' }} />
                                    </div>

                                    {/* File Input */}
                                    <input
                                        type="file"
                                        accept="image/*,video/*"
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const isVideo = file.type.startsWith('video/');

                                                try {
                                                    let result: string;

                                                    // Process and compress image for local storage & broadcast
                                                    if (isVideo) {
                                                        result = await new Promise((resolve) => {
                                                            const reader = new FileReader();
                                                            reader.onload = (ev) => resolve(ev.target?.result as string);
                                                            reader.readAsDataURL(file);
                                                        });
                                                    } else {
                                                        // Compress Image to fit smoothly in IndexedDB & Socket broadcast
                                                        result = await compressImage(file, 2048, 0.75);
                                                    }

                                                    update({
                                                        backgroundImage: result,
                                                        backgroundImageType: isVideo ? 'video' : 'image'
                                                    });

                                                } catch (err) {
                                                    console.error("Erro ao processar imagem:", err);
                                                    alert("Erro ao processar/enviar imagem: " + err);
                                                }
                                            }
                                        }}
                                        className="glass-input"
                                        style={{ width: '100%', padding: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: '#fff', borderRadius: '4px', cursor: 'pointer' }}
                                    />
                                    <small style={{ color: '#aaa', display: 'block', marginTop: '5px' }}>
                                        Suporta JPG, PNG, WEBM, MP4. <br />
                                        <span style={{ color: '#e6bd45', display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                                            <AlertTriangle size={12} color="#e6bd45" />
                                            <span>Dica: Para melhor performance, use URLs externas ou arquivos pequenos!</span>
                                        </span>
                                    </small>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '20px' }}>
                                <div className="form-group">
                                    <label>Largura (Células)</label>
                                    <input
                                        type="number"
                                        className="glass-input"
                                        value={config.width}
                                        onChange={e => update({ width: Number(e.target.value) })}
                                        style={{ width: '100%', padding: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: '#fff', borderRadius: '4px' }}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Altura (Células)</label>
                                    <input
                                        type="number"
                                        className="glass-input"
                                        value={config.height}
                                        onChange={e => update({ height: Number(e.target.value) })}
                                        style={{ width: '100%', padding: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: '#fff', borderRadius: '4px' }}
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {/* GRID TAB */}
                    {activeTab === 'grid' && (
                        <>
                            <div className="form-group">
                                <label>Tamanho da Célula (px)</label>
                                <input
                                    type="number"
                                    value={config.gridSize}
                                    onChange={e => update({ gridSize: Number(e.target.value) })}
                                    style={{ width: '100%', padding: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: '#fff', borderRadius: '4px' }}
                                />
                            </div>
                            <div className="form-group">
                                <label>Cor do Grid</label>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <input
                                        type="color"
                                        value={config.gridColor}
                                        onChange={e => update({ gridColor: e.target.value })}
                                        style={{ background: 'none', border: 'none', width: '50px', height: '40px' }}
                                    />
                                    <input
                                        type="text"
                                        value={config.gridColor}
                                        onChange={e => update({ gridColor: e.target.value })}
                                        style={{ flex: 1, padding: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: '#fff', borderRadius: '4px' }}
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {/* LIGHTING TAB */}
                    {activeTab === 'lighting' && (
                        <>
                            <div className="form-group">
                                <label>Luz Global do Mapa</label>
                                <select
                                    value={config.globalLight}
                                    onChange={e => update({ globalLight: e.target.value as any })}
                                    style={{ width: '100%', padding: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: '#fff', borderRadius: '4px' }}
                                >
                                    <option value="bright">Dia (Tudo Visível)</option>
                                    <option value="dim">Penumbra (Sombra Suave)</option>
                                    <option value="dark">Noite (Escuridão Total)</option>
                                </select>
                                <p style={{ fontSize: '0.8em', color: '#aaa', marginTop: '5px' }}>
                                    Em 'Noite', jogadores só veem o que suas luzes iluminam (ou Visão no Escuro).
                                </p>
                            </div>

                            <div className="form-group">
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={config.fogEnabled !== false}
                                        onChange={e => update({ fogEnabled: e.target.checked })}
                                        style={{ width: '18px', height: '18px' }}
                                    />
                                    <Cloud size={16} color="#888" />
                                    <span>Ativar Névoa de Guerra (Fog of War)</span>
                                </label>
                            </div>
                        </>
                    )}

                </div>

                {/* Footer */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px', borderTop: '1px solid var(--glass-border)', paddingTop: '15px' }}>
                    <button className="glass-button active" onClick={onClose}>Fechar</button>
                </div>
            </div>
        </div>
    );
};
