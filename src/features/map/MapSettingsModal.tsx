import React, { useEffect, useRef, useState } from 'react';
import { useMap } from './MapContext';
import { compressImage } from '../../utils/imageUtils';
import { Settings, X, Map, Ruler, Lightbulb, AlertTriangle, Cloud, RotateCcw } from 'lucide-react';
import type { MapConfig } from './mapTypes';
import '../../Layout.css';

interface MapSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const MAX_LOCAL_VIDEO_BYTES = Math.floor(4.5 * 1024 * 1024); // 4.5 MB raw (~6 MB Base64, safely < 10 MB Socket.io limit)

export const MapSettingsModal: React.FC<MapSettingsModalProps> = ({ isOpen, onClose }) => {
    const { config, setConfig } = useMap();
    const [activeTab, setActiveTab] = useState<'general' | 'grid' | 'lighting'>('general');

    // Local preview draft so 60Hz color-picker / typing inputs feel instant without flooding Socket.io
    const [draft, setDraft] = useState<MapConfig>(config);

    const latestConfigRef = useRef(config);
    useEffect(() => { latestConfigRef.current = config; }, [config]);

    const setConfigRef = useRef(setConfig);
    useEffect(() => { setConfigRef.current = setConfig; }, [setConfig]);

    const pendingUpdatesRef = useRef<Partial<MapConfig> | null>(null);
    const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Sync local draft whenever modal opens or external config changes while idle
    useEffect(() => {
        if (!pendingUpdatesRef.current) {
            setDraft(config);
        }
    }, [config, isOpen]);

    const flushPendingUpdates = () => {
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
            debounceTimerRef.current = null;
        }
        if (pendingUpdatesRef.current) {
            const updates = pendingUpdatesRef.current;
            pendingUpdatesRef.current = null;
            setConfigRef.current({
                ...latestConfigRef.current,
                ...updates
            });
        }
    };

    useEffect(() => {
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
                debounceTimerRef.current = null;
            }
        };
    }, []);

    if (!isOpen) return null;

    // Debounced update (200ms) for high-frequency inputs (color picker, URL typing, numeric inputs)
    const updateDebounced = (updates: Partial<MapConfig>) => {
        setDraft(prev => ({ ...prev, ...updates }));
        pendingUpdatesRef.current = {
            ...(pendingUpdatesRef.current || {}),
            ...updates
        };

        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        debounceTimerRef.current = setTimeout(() => {
            flushPendingUpdates();
        }, 200);
    };

    // Immediate update for discrete toggles/selects/uploads
    const updateImmediate = (updates: Partial<MapConfig>) => {
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
            debounceTimerRef.current = null;
        }
        const mergedUpdates = {
            ...(pendingUpdatesRef.current || {}),
            ...updates
        };
        pendingUpdatesRef.current = null;
        const nextConfig: MapConfig = {
            ...latestConfigRef.current,
            ...mergedUpdates
        };
        setDraft(nextConfig);
        setConfigRef.current(nextConfig);
    };

    const handleModalClose = () => {
        flushPendingUpdates();
        onClose();
    };

    return (
        <div className="modal-overlay" style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000
        }}>
            <div className="glass-panel" style={{ width: '500px', maxWidth: '94vw', flexDirection: 'column', gap: '20px' }}>
                <h2 style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Settings size={18} color="#c5a059" />
                        <span>Configurações do Mapa</span>
                    </span>
                    <button onClick={handleModalClose} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
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
                                        value={draft.backgroundImage || ''}
                                        onChange={e => {
                                            const val = e.target.value;
                                            const inferredType = /\.(webm|mp4|ogg)(\?.*)?$/i.test(val) ? 'video' : 'image';
                                            updateDebounced({
                                                backgroundImage: val,
                                                backgroundImageType: val.startsWith('data:video/') ? 'video' : inferredType
                                            });
                                        }}
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

                                                if (isVideo && file.size > MAX_LOCAL_VIDEO_BYTES) {
                                                    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
                                                    alert(
                                                        `O vídeo selecionado (${sizeMb} MB) excede o limite seguro de 4,5 MB para transmissão local.\n\n` +
                                                        `Para evitar desconexão da sala no Socket.io, use um arquivo WebM comprimido (< 4,5 MB) ou cole uma URL externa direta no campo acima.`
                                                    );
                                                    e.target.value = '';
                                                    return;
                                                }

                                                try {
                                                    let result: string;

                                                    if (isVideo) {
                                                        result = await new Promise((resolve, reject) => {
                                                            const reader = new FileReader();
                                                            reader.onload = (ev) => resolve(ev.target?.result as string);
                                                            reader.onerror = (err) => reject(err);
                                                            reader.readAsDataURL(file);
                                                        });
                                                    } else {
                                                        // Compress Image to fit smoothly in IndexedDB & Socket broadcast
                                                        result = await compressImage(file, 2048, 0.75);
                                                    }

                                                    updateImmediate({
                                                        backgroundImage: result,
                                                        backgroundImageType: isVideo ? 'video' : 'image'
                                                    });

                                                } catch (err: any) {
                                                    console.error("Erro ao processar mídia:", err);
                                                    alert("Erro ao processar/enviar mídia: " + (err?.message || err));
                                                    e.target.value = '';
                                                }
                                            }
                                        }}
                                        className="glass-input"
                                        style={{ width: '100%', padding: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: '#fff', borderRadius: '4px', cursor: 'pointer' }}
                                    />
                                    <small style={{ color: '#aaa', display: 'block', marginTop: '5px' }}>
                                        Suporta JPG, PNG, WEBM, MP4 (vídeo local até 4,5 MB). <br />
                                        <span style={{ color: '#e6bd45', display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                                            <AlertTriangle size={12} color="#e6bd45" />
                                            <span>Dica: Para vídeos maiores, cole uma URL externa direta!</span>
                                        </span>
                                    </small>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '20px' }}>
                                <div className="form-group">
                                    <label>Largura (Células)</label>
                                    <input
                                        type="number"
                                        min={4}
                                        max={200}
                                        className="glass-input"
                                        value={draft.width}
                                        onChange={e => {
                                            const n = Number(e.target.value);
                                            if (Number.isFinite(n) && n >= 1) {
                                                updateDebounced({ width: Math.min(200, Math.max(4, Math.round(n))) });
                                            }
                                        }}
                                        style={{ width: '100%', padding: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: '#fff', borderRadius: '4px' }}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Altura (Células)</label>
                                    <input
                                        type="number"
                                        min={4}
                                        max={200}
                                        className="glass-input"
                                        value={draft.height}
                                        onChange={e => {
                                            const n = Number(e.target.value);
                                            if (Number.isFinite(n) && n >= 1) {
                                                updateDebounced({ height: Math.min(200, Math.max(4, Math.round(n))) });
                                            }
                                        }}
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
                                    min={15}
                                    max={250}
                                    value={draft.gridSize}
                                    onChange={e => {
                                        const n = Number(e.target.value);
                                        if (Number.isFinite(n) && n >= 10) {
                                            updateDebounced({ gridSize: Math.min(250, Math.max(15, Math.round(n))) });
                                        }
                                    }}
                                    style={{ width: '100%', padding: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', color: '#fff', borderRadius: '4px' }}
                                />
                            </div>
                            <div className="form-group">
                                <label>Cor do Grid</label>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <input
                                        type="color"
                                        value={/^#[0-9a-fA-F]{6}$/.test(draft.gridColor) ? draft.gridColor : '#444444'}
                                        onChange={e => updateDebounced({ gridColor: e.target.value })}
                                        style={{ background: 'none', border: 'none', width: '50px', height: '40px', cursor: 'pointer' }}
                                    />
                                    <input
                                        type="text"
                                        value={draft.gridColor}
                                        onChange={e => updateDebounced({ gridColor: e.target.value })}
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
                                    value={draft.globalLight}
                                    onChange={e => updateImmediate({ globalLight: e.target.value as any })}
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

                            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={draft.fogEnabled !== false}
                                        onChange={e => updateImmediate({ fogEnabled: e.target.checked })}
                                        style={{ width: '18px', height: '18px' }}
                                    />
                                    <Cloud size={16} color="#888" />
                                    <span>Ativar Névoa de Guerra (Fog of War)</span>
                                </label>

                                {draft.fogEnabled !== false && (
                                    <button
                                        type="button"
                                        className="glass-button small"
                                        onClick={() => updateImmediate({ fogData: '' })}
                                        style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '6px' }}
                                    >
                                        <RotateCcw size={13} />
                                        <span>Resetar Névoa Explorada</span>
                                    </button>
                                )}
                            </div>
                        </>
                    )}

                </div>

                {/* Footer */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px', borderTop: '1px solid var(--glass-border)', paddingTop: '15px' }}>
                    <button className="glass-button active" onClick={handleModalClose}>Fechar</button>
                </div>
            </div>
        </div>
    );
};
