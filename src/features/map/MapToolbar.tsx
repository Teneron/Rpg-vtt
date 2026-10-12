import React from 'react';
import { useMap } from './MapContext';
import { usePeer } from '../multiplayer/SocketContext';
import { MapSettingsModal } from './MapSettingsModal';
import { AddAssetModal } from './AddAssetModal';
import { Hand, Ruler, Sparkles, Box, Eye, EyeOff, RefreshCw, Settings, Image } from 'lucide-react';

export const MapHeaderControls: React.FC = () => {
    const {
        interactionMode,
        setInteractionMode,
        config,
        setConfig,
        forceSync
    } = useMap();
    const { isHost } = usePeer();
    const [isConfigOpen, setIsConfigOpen] = React.useState(false);
    const [isAssetModalOpen, setIsAssetModalOpen] = React.useState(false);

    return (
        <>
            <div className="map-header-controls" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '4px', gap: '4px' }}>
                    <button
                        className={`glass-button small ${interactionMode === 'select' ? 'active' : ''}`}
                        onClick={() => setInteractionMode('select')}
                        title="Mover (S)"
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <Hand size={14} />
                    </button>

                    <button
                        className={`glass-button small ${interactionMode === 'measure' ? 'active' : ''}`}
                        onClick={() => setInteractionMode('measure')}
                        title="Régua (M)"
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <Ruler size={14} />
                    </button>

                    <button
                        className={`glass-button small ${interactionMode === 'draw' ? 'active' : ''}`}
                        onClick={() => setInteractionMode('draw')}
                        title="Laser (L)"
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <Sparkles size={14} />
                    </button>
                </div>

                {isHost && (
                    <>
                        <div style={{ width: '1px', height: '24px', background: 'var(--glass-border)' }} />

                        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '4px', gap: '4px' }}>
                            <button
                                className={`glass-button small ${interactionMode === 'wall' ? 'active' : ''}`}
                                onClick={() => setInteractionMode('wall')}
                                title="Paredes (W)"
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                <Box size={14} />
                            </button>

                            <button
                                className={`glass-button small`}
                                onClick={() => setConfig({ ...config, fogEnabled: !config.fogEnabled })}
                                title={config.fogEnabled !== false ? "Desativar Fog Global" : "Ativar Fog Global"}
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                {config.fogEnabled !== false ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                        </div>

                        <button
                            className={`glass-button small`}
                            onClick={() => {
                                if (confirm('Forçar sincronia do mapa com todos os jogadores?')) {
                                    forceSync();
                                }
                            }}
                            title="Forçar Sincronia (Use apenas se houver bugs)"
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                            <RefreshCw size={14} />
                        </button>
                        <button
                            className={`glass-button small`}
                            onClick={() => setIsConfigOpen(true)}
                            title="Configurações do Mapa"
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                            <Settings size={14} />
                        </button>

                        <div style={{ width: '1px', height: '24px', background: 'var(--glass-border)' }} />

                        <button
                            className={`glass-button small`}
                            onClick={() => setIsAssetModalOpen(true)}
                            title="Adicionar Asset / Imagem"
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                            <Image size={14} />
                        </button>
                    </>
                )}
            </div>

            <MapSettingsModal isOpen={isConfigOpen} onClose={() => setIsConfigOpen(false)} />
            <AddAssetModal isOpen={isAssetModalOpen} onClose={() => setIsAssetModalOpen(false)} />
        </>
    );
};
