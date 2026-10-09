import React, { useState } from 'react';
import { useScene } from './SceneContext';
import { Save, Trash2 } from 'lucide-react';

export const SceneList: React.FC = () => {
    const { scenes, activeSceneId, createScene, activateScene, deleteScene, saveCurrentStateAsScene } = useScene();
    // Removed unused config
    const [newSceneName, setNewSceneName] = useState('');

    const handleCreate = () => {
        if (!newSceneName.trim()) return;
        createScene(newSceneName); // removed unused return variable
        setNewSceneName('');
    };

    return (
        <div className="scene-list-container">
            <h3>Gerenciador de Cenas</h3>

            <div className="scene-create-row">
                <input
                    value={newSceneName}
                    onChange={e => setNewSceneName(e.target.value)}
                    placeholder="Nome da Nova Cena"
                    className="premium-input"
                />
                <button onClick={handleCreate} className="btn-premium">Criar</button>
            </div>

            <div className="scenes-grid">
                {scenes.map(scene => {
                    const isActive = scene.id === activeSceneId;
                    return (
                        <div key={scene.id} className={`scene-card ${isActive ? 'active' : ''}`}>
                            <div className="scene-info" onClick={() => activateScene(scene.id)}>
                                <span className="scene-name">{scene.name}</span>
                                <small>{scene.config.width}x{scene.config.height}</small>
                            </div>
                            <div className="scene-actions">
                                {isActive && (
                                    <button
                                        className="btn-icon"
                                        title="Salvar Estado Atual nesta Cena"
                                        onClick={() => saveCurrentStateAsScene(scene.id)}
                                        style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                                    >
                                        <Save size={13} />
                                    </button>
                                )}
                                <button
                                    className="btn-icon danger"
                                    onClick={(e) => { e.stopPropagation(); deleteScene(scene.id); }}
                                    style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                                    title="Excluir Cena"
                                >
                                    <Trash2 size={13} />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            <style>{`
                .scene-list-container {
                    padding: 15px;
                    background: #111;
                    border: 1px solid #333;
                    border-radius: 8px;
                    color: #eee;
                }
                .scene-create-row {
                    display: flex; gap: 10px; margin-bottom: 15px;
                }
                .scenes-grid {
                    display: grid; grid-template-columns: 1fr; gap: 10px;
                    max-height: 300px; overflow-y: auto;
                }
                .scene-card {
                    display: flex; justify-content: space-between; align-items: center;
                    background: #222; padding: 10px; border-radius: 4px;
                    border-left: 3px solid transparent;
                    cursor: pointer;
                    transition: background 0.2s;
                }
                .scene-card:hover { background: #2a2a2a; }
                .scene-card.active { border-left-color: #c5a059; background: #332b1a; }
                
                .scene-info { flex: 1; display: flex; flex-direction: column; }
                .scene-name { font-weight: bold; color: #fff; }
                .scene-actions { display: flex; gap: 5px; }

                .btn-icon {
                    background: transparent; border: none; cursor: pointer;
                    font-size: 1.2rem; padding: 5px; border-radius: 4px;
                }
                .btn-icon:hover { background: rgba(255,255,255,0.1); }
                .btn-icon.danger:hover { background: rgba(255,0,0,0.2); }
            `}</style>
        </div>
    );
};
