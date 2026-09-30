import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { useAudio } from './AudioContext';
import { usePeer } from '../multiplayer/FirebaseContext';
import { Zap, Plus, Trash2 } from 'lucide-react';
import { db } from '../../db/RPGDatabase';

export const Soundboard: React.FC = () => {
    const { playSfx, playMusic, stopMusic } = useAudio();
    const { isHost, currentAdventureId } = usePeer();
    const [isExpanded, setIsExpanded] = useState(false);
    const [tab, setTab] = useState<'sfx' | 'music'>('sfx');
    const [showAddForm, setShowAddForm] = useState(false);

    // Form State
    const [newItemName, setNewItemName] = useState('');
    const [newItemUrl, setNewItemUrl] = useState(''); // For external links
    const [newItemFile, setNewItemFile] = useState<File | null>(null);

    // Live Query for Assets
    const safeAdventureId = currentAdventureId || 'default';
    const assets = useLiveQuery(
        () => db.assets.where('campaignId').equals(safeAdventureId).toArray(),
        [safeAdventureId]
    ) || [];

    // Filter by type
    const sfxAssets = assets.filter(a => a.type === 'audio' && a.category === 'sfx');
    const musicAssets = assets.filter(a => a.type === 'audio' && a.category === 'music');

    // Only GM can see the soundboard
    if (!isHost) return null;

    const handleAddAsset = async () => {
        if (!newItemName) return alert("Nome é obrigatório");
        if (!newItemUrl && !newItemFile) return alert("URL ou Arquivo é obrigatório");

        let data: Blob | string = newItemUrl;
        if (newItemFile) {
            data = newItemFile; // Blob
        }

        try {
            await db.assets.add({
                campaignId: safeAdventureId,
                name: newItemName,
                type: 'audio',
                category: tab, // 'sfx' or 'music'
                data: data
            });
            setShowAddForm(false);
            setNewItemName('');
            setNewItemUrl('');
            setNewItemFile(null);
        } catch (e) {
            console.error("Error adding asset:", e);
            alert("Erro ao salvar áudio.");
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm("Deletar este áudio?")) {
            await db.assets.delete(id);
        }
    };

    const playAsset = (asset: any) => {
        let url = '';
        if (asset.data instanceof Blob) {
            url = URL.createObjectURL(asset.data);
        } else {
            url = asset.data as string;
        }

        const track = {
            id: `custom-${asset.id}`,
            title: asset.name,
            url: url,
            type: asset.category,
            volume: 0.8
        };

        if (asset.category === 'music') {
            playMusic(track);
        } else {
            playSfx(track);
        }
    };

    if (!isExpanded) {
        return (
            <div
                onClick={() => setIsExpanded(true)}
                style={{
                    position: 'fixed', bottom: '20px', right: '100px', // Next to other floating controls
                    background: 'rgba(0,0,0,0.8)', border: '1px solid #ffaa00', borderRadius: '30px',
                    padding: '8px 15px', display: 'flex', alignItems: 'center', gap: '8px',
                    cursor: 'pointer', zIndex: 1000, color: '#ffaa00',
                    boxShadow: '0 0 10px rgba(255,170,0,0.3)'
                }}
            >
                <Zap size={16} />
                <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>SFX</span>
            </div>
        );
    }

    return (
        <div
            style={{
                position: 'fixed', bottom: '80px', right: '20px',
                width: '300px', maxHeight: '500px', background: 'rgba(20,15,10,0.95)',
                border: '1px solid #ffaa00', borderRadius: '10px',
                padding: '15px', zIndex: 1000, color: '#fff',
                display: 'flex', flexDirection: 'column', gap: '10px',
                boxShadow: '0 5px 20px rgba(0,0,0,0.8)',
                overflowY: 'auto'
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', color: '#ffaa00' }}>
                    <Zap size={16} /> Soundboard
                </span>
                <button
                    onClick={() => setIsExpanded(false)}
                    style={{ background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', fontSize: '1.2rem' }}
                >
                    ×
                </button>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid #443322', marginBottom: '10px' }}>
                <button
                    onClick={() => setTab('sfx')}
                    style={{ flex: 1, padding: '8px', background: tab === 'sfx' ? '#443322' : 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}
                >
                    SFX
                </button>
                <button
                    onClick={() => setTab('music')}
                    style={{ flex: 1, padding: '8px', background: tab === 'music' ? '#443322' : 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}
                >
                    Música
                </button>
            </div>

            {/* Default SFX (Only in SFX tab) */}
            {tab === 'sfx' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '15px', borderBottom: '1px solid #332211', paddingBottom: '10px' }}>
                    <button onClick={() => playSfx({ id: 'sfx-sword', title: 'Espada', url: '/assets/sfx/sword.mp3', type: 'sfx', volume: 0.6 })} className="sfx-btn">
                        ⚔️ Espada
                    </button>
                    <button onClick={() => playSfx({ id: 'sfx-explosion', title: 'Explosão', url: '/assets/sfx/explosion.mp3', type: 'sfx', volume: 0.8 })} className="sfx-btn">
                        💥 Explosão
                    </button>
                    <button onClick={() => playSfx({ id: 'sfx-door', title: 'Porta', url: '/assets/sfx/door.wav?t=3', type: 'sfx', volume: 0.9 })} className="sfx-btn">
                        🚪 Porta
                    </button>
                    <button onClick={() => playSfx({ id: 'sfx-arrow', title: 'Flecha', url: '/assets/sfx/arrow.ogg?t=3', type: 'sfx', volume: 0.8 })} className="sfx-btn">
                        🏹 Flecha
                    </button>
                </div>
            )}

            {/* Stop Music Button */}
            {tab === 'music' && (
                <button
                    onClick={stopMusic}
                    style={{ background: '#552222', border: 'none', color: '#fff', padding: '8px', borderRadius: '4px', cursor: 'pointer', marginBottom: '10px' }}
                >
                    ⏹️ Parar Música
                </button>
            )}

            {/* Custom Assets List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <small style={{ color: '#aaa' }}>{tab === 'sfx' ? 'Efeitos Personalizados' : 'Playlists'}</small>
                {(tab === 'sfx' ? sfxAssets : musicAssets).map(asset => (
                    <div key={asset.id} style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#2a1a0a', padding: '5px', borderRadius: '4px' }}>
                        <button
                            onClick={() => playAsset(asset)}
                            style={{ flex: 1, background: 'none', border: 'none', color: '#ffd', textAlign: 'left', cursor: 'pointer', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                            title={asset.name}
                        >
                            {tab === 'music' ? '🎵' : '🔊'} {asset.name}
                        </button>
                        <button onClick={() => handleDelete(asset.id!)} style={{ background: 'none', border: 'none', color: '#f55', cursor: 'pointer' }}>
                            <Trash2 size={14} />
                        </button>
                    </div>
                ))}
                {(tab === 'sfx' ? sfxAssets : musicAssets).length === 0 && <span style={{ color: '#666', fontSize: '0.8rem' }}>Vazio</span>}
            </div>

            {/* Add New */}
            {!showAddForm ? (
                <button
                    onClick={() => setShowAddForm(true)}
                    style={{ marginTop: '10px', background: '#333', border: '1px dashed #666', color: '#aaa', padding: '8px', cursor: 'pointer', borderRadius: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px' }}
                >
                    <Plus size={16} /> Adicionar {tab === 'sfx' ? 'Som' : 'Música'}
                </button>
            ) : (
                <div style={{ marginTop: '10px', background: '#332211', padding: '10px', borderRadius: '5px' }}>
                    <input
                        placeholder="Nome"
                        value={newItemName} onChange={e => setNewItemName(e.target.value)}
                        style={{ width: '100%', marginBottom: '5px', padding: '5px', background: '#111', border: '1px solid #444', color: '#fff' }}
                    />
                    <div style={{ fontSize: '0.8rem', color: '#aaa', marginBottom: '5px' }}>Escolha Arquivo OU Url (YouTube/MP3):</div>
                    <input
                        type="file"
                        accept="audio/*"
                        onChange={e => {
                            if (e.target.files?.[0]) {
                                setNewItemFile(e.target.files[0]);
                                setNewItemUrl('');
                            }
                        }}
                        style={{ width: '100%', marginBottom: '5px', fontSize: '0.8rem' }}
                    />
                    <input
                        placeholder="OU Cole URL..."
                        value={newItemUrl} onChange={e => { setNewItemUrl(e.target.value); setNewItemFile(null); }}
                        style={{ width: '100%', marginBottom: '5px', padding: '5px', background: '#111', border: '1px solid #444', color: '#fff' }}
                        disabled={!!newItemFile}
                    />
                    <div style={{ display: 'flex', gap: '5px', marginTop: '5px' }}>
                        <button onClick={handleAddAsset} style={{ flex: 1, background: '#4a4', border: 'none', color: '#fff', padding: '5px', cursor: 'pointer' }}>Salvar</button>
                        <button onClick={() => setShowAddForm(false)} style={{ flex: 1, background: '#555', border: 'none', color: '#fff', padding: '5px', cursor: 'pointer' }}>Cancelar</button>
                    </div>
                </div>
            )}

            <style>{`
                .sfx-btn {
                    background: #3a2a1a; border: 1px solid #664422; border-radius: 6px; padding: 12px 8px;
                    color: #ffd; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;
                    font-size: 0.85rem; transition: all 0.1s; font-weight: 500;
                }
                .sfx-btn:active { transform: scale(0.95); background: #553311; border-color: #ffaa00; }
                .sfx-btn:hover { background: #4a3a2a; border-color: #aa7733; color: #fff; }
                
                /* Scrollbar */
                ::-webkit-scrollbar { width: 5px; }
                ::-webkit-scrollbar-track { background: #1a1a1a; }
                ::-webkit-scrollbar-thumb { background: #443322; border-radius: 3px; }
            `}</style>
        </div>
    );
};
