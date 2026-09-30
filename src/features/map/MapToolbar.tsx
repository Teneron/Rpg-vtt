import React from 'react';
import { useMap } from './MapContext';
import { usePeer } from '../multiplayer/FirebaseContext';
import { MapSettingsModal } from './MapSettingsModal';
import { AddAssetModal } from './AddAssetModal';

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
                    >
                        ✋
                    </button>

                    <button
                        className={`glass-button small ${interactionMode === 'measure' ? 'active' : ''}`}
                        onClick={() => setInteractionMode('measure')}
                        title="Régua (M)"
                    >
                        📏
                    </button>

                    <button
                        className={`glass-button small ${interactionMode === 'draw' ? 'active' : ''}`}
                        onClick={() => setInteractionMode('draw')}
                        title="Laser (L)"
                    >
                        🔦
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
                            >
                                🧱
                            </button>

                            <button
                                className={`glass-button small ${config.fogEnabled === false ? '' : ''}`}
                                onClick={() => setConfig({ ...config, fogEnabled: !config.fogEnabled })}
                                title={config.fogEnabled !== false ? "Desativar Fog Global" : "Ativar Fog Global"}
                            >
                                {config.fogEnabled !== false ? '🌑' : '☀️'}
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
                        >
                            🔄
                        </button>
                        <button
                            className={`glass-button small`}
                            onClick={() => setIsConfigOpen(true)}
                            title="Configurações do Mapa"
                        >
                            ⚙️
                        </button>

                        <div style={{ width: '1px', height: '24px', background: 'var(--glass-border)' }} />

                        <button
                            className={`glass-button small`}
                            onClick={() => setIsAssetModalOpen(true)}
                            title="Adicionar Asset / Imagem"
                        >
                            🖼️
                        </button>
                    </>
                )}
            </div>

            <MapSettingsModal isOpen={isConfigOpen} onClose={() => setIsConfigOpen(false)} />
            <AddAssetModal isOpen={isAssetModalOpen} onClose={() => setIsAssetModalOpen(false)} />
        </>
    );
};
