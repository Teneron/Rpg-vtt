import React, { useState, useEffect } from 'react';
import { useAudio } from './AudioContext';
import type { AudioTrack } from './AudioContext';
import { usePeer } from '../multiplayer/SocketContext';
import { Play, Pause, Square, Music, Volume2, Trash2, VolumeX, Upload, ChevronDown } from 'lucide-react';
import { AudioRepository } from './AudioRepository';

const DEFAULT_MUSIC: AudioTrack[] = [
    { id: 'm1', title: 'Taverna (Minstrels)', url: '/assets/music/tavern.ogg', type: 'music', loop: true },
    { id: 'm2', title: 'Batalha (Frantic)', url: '/assets/music/battle.ogg', type: 'music', loop: true },
    { id: 'm3', title: 'Floresta (Elf Land)', url: '/assets/music/forest.ogg', type: 'music', loop: true },
];

export const MusicPlayer: React.FC = () => {
    const { currentMusic, isPlaying, playMusic, stopMusic, togglePlay, volume, setVolume, audioBlocked, unlockAudio } = useAudio();
    const { isHost } = usePeer();
    const [isExpanded, setIsExpanded] = useState(false);
    const [playlist, setPlaylist] = useState<AudioTrack[]>(DEFAULT_MUSIC);

    // Load saved tracks on mount
    useEffect(() => {
        const loadTracks = async () => {
            try {
                const savedTracks = await AudioRepository.getAllTracks();
                // Merge defaults and saved. Use a Map to avoid duplicates if IDs conflict (though they shouldn't)
                const allTracks = [...DEFAULT_MUSIC, ...savedTracks];
                setPlaylist(allTracks);
            } catch (e) {
                console.error("Failed to load tracks:", e);
            }
        };
        loadTracks();
    }, []);

    // Initial minimized view
    if (!isExpanded) {
        return (
            <div
                onClick={() => setIsExpanded(true)}
                style={{
                    position: 'fixed', bottom: '20px', left: '20px',
                    background: 'rgba(0,0,0,0.8)', border: '1px solid #555', borderRadius: '30px',
                    padding: '8px 15px', display: 'flex', alignItems: 'center', gap: '10px',
                    cursor: 'pointer', zIndex: 1000, color: '#fff'
                }}
            >
                <Music size={16} />
                <span style={{ fontSize: '0.9rem' }}>
                    {isHost ? (isPlaying ? 'Tocando...' : 'Música') : 'Volume'}
                </span>
            </div>
        );
    }

    return (
        <div
            style={{
                position: 'fixed', bottom: '20px', left: '20px',
                width: '300px', background: 'rgba(20,20,30,0.95)',
                border: '1px solid #777', borderRadius: '10px',
                padding: '15px', zIndex: 1000, color: '#fff',
                display: 'flex', flexDirection: 'column', gap: '10px',
                boxShadow: '0 5px 20px rgba(0,0,0,0.8)'
            }}
        >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Music size={16} /> Player de Música
                </span>
                <button
                    onClick={() => setIsExpanded(false)}
                    style={{ background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    title="Minimizar"
                >
                    <ChevronDown size={16} />
                </button>
            </div>

            {/* Now Playing info - HOST ONLY */}
            {isHost && (
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '5px', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.8rem', color: '#aaa', marginBottom: '4px' }}>Tocando Agora:</div>
                    <div style={{ color: '#FFD700', fontWeight: 'bold' }}>
                        {currentMusic?.title || "Nenhuma Selecionada"}
                    </div>
                </div>
            )}

            {/* Audio Blocked Warning */}
            {audioBlocked && (
                <button
                    onClick={() => unlockAudio?.()}
                    style={{
                        background: '#ff4444', color: 'white', border: 'none',
                        padding: '10px', borderRadius: '5px', fontWeight: 'bold',
                        cursor: 'pointer', animation: 'pulse 1s infinite',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                    }}
                >
                    <VolumeX size={16} />
                    <span>Áudio Bloqueado - Clique para Ativar</span>
                </button>
            )}

            {/* Controls */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
                {isHost ? (
                    <>
                        <button onClick={togglePlay} className="icon-btn">
                            {isPlaying ? <Pause /> : <Play />}
                        </button>
                        <button onClick={stopMusic} className="icon-btn">
                            <Square size={16} />
                        </button>
                    </>
                ) : null}
            </div>

            {/* Volume */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Volume2 size={16} style={{ color: '#aaa' }} />
                <input
                    type="range" min="0" max="1" step="0.01"
                    value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))}
                    style={{ flex: 1 }}
                    title="Volume Local (Seu Computador)"
                />
            </div>

            {/* Playlist (Host Only) */}
            {isHost && (
                <div style={{ marginTop: '10px', maxHeight: '200px', overflowY: 'auto', borderTop: '1px solid #444', paddingTop: '10px' }}>
                    <div style={{ fontSize: '0.8rem', color: '#aaa', marginBottom: '5px' }}>Playlist</div>

                    {/* File Upload Input */}
                    <div style={{ marginBottom: '10px', background: '#333', padding: '10px', borderRadius: '4px' }}>
                        <div style={{ fontSize: '0.75rem', color: '#aaa', marginBottom: '5px' }}>Enviar Arquivo de Áudio (Local)</div>
                        <label style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            padding: '8px', background: '#444', borderRadius: '4px',
                            cursor: 'pointer', color: '#fff', fontSize: '0.8rem',
                            justifyContent: 'center'
                        }}>
                            <Upload size={16} />
                            <span>Escolher Arquivo (MP3/OGG/WAV)</span>
                            <input
                                type="file"
                                accept="audio/*"
                                style={{ display: 'none' }}
                                onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const objectUrl = URL.createObjectURL(file);
                                        const newTrack: AudioTrack = {
                                            id: 'local-' + Date.now(),
                                            title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
                                            url: objectUrl,
                                            type: 'music',
                                            loop: true
                                        };

                                        // Save to DB
                                        try {
                                            await AudioRepository.saveTrack(newTrack, file);
                                            setPlaylist(prev => [...prev, newTrack]);
                                        } catch (err) {
                                            console.error("Failed to save track:", err);
                                            alert("Erro ao salvar música no banco de dados.");
                                        }
                                    }
                                }}
                            />
                        </label>
                    </div>

                    {playlist.map(track => (
                        <div
                            key={track.id}
                            onClick={() => playMusic(track)}
                            style={{
                                padding: '5px 8px', borderRadius: '4px', cursor: 'pointer',
                                background: currentMusic?.title === track.title ? 'rgba(255,215,0,0.2)' : 'transparent', // Match by title if ID is dynamic
                                color: currentMusic?.title === track.title ? '#FFD700' : '#ddd',
                                fontSize: '0.9rem', marginBottom: '2px',
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                            }}
                            className="playlist-item"
                        >
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {track.title}
                            </span>
                            <button
                                onClick={async (e) => {
                                    e.stopPropagation();
                                    try {
                                        await AudioRepository.deleteTrack(track.id);
                                        setPlaylist(prev => prev.filter(t => t.id !== track.id));
                                        if (currentMusic?.id === track.id) stopMusic();
                                    } catch (err) {
                                        console.error("Failed to delete track:", err);
                                    }
                                }}
                                style={{
                                    background: 'none', border: 'none', color: '#888',
                                    cursor: 'pointer', padding: '2px', display: 'flex',
                                    marginLeft: '5px'
                                }}
                                title="Remover"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <style>{`
                .icon-btn {
                    background: #444; border: none; border-radius: 50%; width: 36px; height: 36px;
                    display: flex; alignItems: center; justifyContent: center; color: white; cursor: pointer;
                    transition: background 0.2s;
                }
                .sfx-btn {
                    background: #3a3a4a; border: 1px solid #555; border-radius: 4px; padding: 8px;
                    color: #ddd; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;
                    font-size: 0.85rem; transition: all 0.1s;
                }
                .sfx-btn:active { transform: scale(0.95); background: #555; }
                .sfx-btn:hover { background: #4a4a5a; border-color: #888; }
                .icon-btn:hover { background: #666; }
                .playlist-item:hover { background: rgba(255,255,255,0.1) !important; }
                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                    100% { transform: scale(1); }
                }
            `}</style>
        </div>
    );
};
