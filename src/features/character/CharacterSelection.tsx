import React, { useState, useEffect } from 'react';
import { CharacterRepository, type CharacterSummary } from './characterRepository';
import { usePeer } from '../multiplayer/SocketContext';
import { useAdventure } from '../adventure/AdventureContext';
import { User, Scroll, Shield, Plus, X, ArrowRight, Swords, Upload, Download } from 'lucide-react';
import './CharacterSelection.css';

interface CharacterSelectionProps {
    onSelect: (characterId: string) => void;
}

export const CharacterSelection: React.FC<CharacterSelectionProps> = ({ onSelect }) => {
    const { username, currentAdventureId, currentAdventureName, roomSystem } = usePeer();
    const { currentAdventure } = useAdventure();
    const [characters, setCharacters] = useState<CharacterSummary[]>([]);

    // Detect active game system strictly (witcher if room begins with WTC- or adventure is witcher, otherwise dnd55e)
    const activeSystem: 'witcher' | 'dnd55e' = (
        roomSystem === 'witcher' ||
        currentAdventureId?.toUpperCase().startsWith('WTC') ||
        currentAdventure?.system === 'witcher'
    ) ? 'witcher' : 'dnd55e';

    useEffect(() => {
        loadList();
    }, [username, currentAdventureId]);

    const loadList = async () => {
        if (username) {
            const advId = currentAdventureId || 'default';
            const list = await CharacterRepository.listAllAsync(username, advId);
            // Strict isolation: only show characters belonging to the active table's game system
            const filtered = list.filter(c => {
                const charSys = (c.system === 'witcher') ? 'witcher' : 'dnd55e';
                return charSys === activeSystem;
            });
            setCharacters(filtered);
        }
    };

    const fileInputRef = React.useRef<HTMLInputElement | null>(null);

    const handleCreateNew = () => {
        if (!username) return;
        const advId = currentAdventureId || 'default';
        const newChar = CharacterRepository.create(username, advId, activeSystem);
        onSelect(newChar.id);
    };

    const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const text = await file.text();
            const imported = await CharacterRepository.importCharacter(
                text,
                username || 'Jogador',
                currentAdventureId || 'default'
            );
            await loadList();
            onSelect(imported.id);
        } catch (err: any) {
            alert('Erro ao importar ficha: ' + (err?.message || 'Arquivo inválido'));
        } finally {
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (confirm('Tem certeza que deseja apagar este personagem para sempre?')) {
            const advId = currentAdventureId || 'default';
            await CharacterRepository.deleteAsync(id, username, advId);
            await loadList();
        }
    };

    const getSystemBadgeColor = (sys?: string) => {
        switch (sys) {
            case 'witcher':
                return '#c5a059';
            case 'dnd55e':
            case 'dnd5e':
            default:
                return '#e11d48';
        }
    };

    const getSystemLabel = (sys?: string) => {
        switch (sys) {
            case 'witcher':
                return 'The Witcher';
            case 'dnd55e':
            case 'dnd5e':
            default:
                return 'D&D 5.5e';
        }
    };

    return (
        <div className="char-selection-container">
            {/* Header / Session pill */}
            <div className="char-selection-header">
                <h1 className="main-title">Selecione seu Herói</h1>
                <p className="subtitle">
                    {activeSystem === 'witcher'
                        ? 'Crie seu Bruxo caçador de monstros ou selecione uma ficha existente no Continente'
                        : 'Crie seu aventureiro pelas regras oficiais de D&D 5.5e ou selecione uma ficha existente'}
                </p>

                <div className="session-info-pill">
                    <span className="info-user" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <User size={13} />
                        <span>{username || 'Jogador'}</span>
                    </span>
                    <span className="info-camp" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Scroll size={13} />
                        <span>Mesa: <strong>{currentAdventureName || (activeSystem === 'witcher' ? 'The Witcher' : 'D&D 5.5e')}</strong></span>
                    </span>
                    <span className="info-id" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'monospace', color: '#ffd700', letterSpacing: '1px' }}>
                        <Shield size={13} color="#ffd700" />
                        <span>Sala: <strong>{currentAdventureId || 'local'}</strong></span>
                    </span>
                    <span className="info-system" style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: activeSystem === 'witcher' ? 'rgba(197, 160, 89, 0.2)' : 'rgba(225, 29, 72, 0.2)',
                        border: `1px solid ${activeSystem === 'witcher' ? '#c5a059' : '#e11d48'}`,
                        color: activeSystem === 'witcher' ? '#e0c070' : '#ff4d6d',
                        fontWeight: 'bold',
                        fontSize: '0.85rem'
                    }}>
                        {activeSystem === 'witcher' ? 'The Witcher' : 'D&D 5.5e'}
                    </span>
                </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="actions-bar" style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                    className="btn-action-primary"
                    onClick={handleCreateNew}
                    style={{
                        padding: '12px 28px',
                        fontSize: '1.05rem',
                        fontWeight: 'bold',
                        background: activeSystem === 'witcher'
                            ? 'linear-gradient(135deg, #8a6d2b 0%, #c5a059 100%)'
                            : 'linear-gradient(135deg, #991b1b 0%, #dc2626 100%)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                >
                    <Plus size={18} />
                    <span>Criar Novo Personagem</span>
                </button>

                <button
                    type="button"
                    className="btn-action-secondary"
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                        padding: '12px 24px',
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: '#f3f4f6',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.2s ease'
                    }}
                >
                    <Upload size={17} />
                    <span>Importar Ficha (.json)</span>
                </button>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    style={{ display: 'none' }}
                    onChange={handleFileImport}
                />
            </div>

            {/* Existing Characters Grid */}
            <div className="char-list">
                {characters.map(char => {
                    const badgeColor = getSystemBadgeColor(char.system);
                    return (
                        <div
                            key={char.id}
                            className="char-card"
                            onClick={() => onSelect(char.id)}
                            draggable
                            onDragStart={(e) => {
                                e.dataTransfer.setData('application/json', JSON.stringify({
                                    type: 'character',
                                    id: char.id
                                }));
                            }}
                        >
                            <div className="char-system-badge" style={{ backgroundColor: `${badgeColor}25`, borderColor: badgeColor, color: badgeColor }}>
                                {getSystemLabel(char.system)}
                            </div>

                            <div className="char-avatar-circle" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {char.system === 'witcher' ? <Shield size={24} color="#c5a059" /> : <Swords size={24} color="#e11d48" />}
                            </div>

                            <h2 className="char-card-name">{char.name}</h2>

                            <div className="char-card-info">
                                <span className="char-class-level">Nv {char.level} {char.class || 'Aventureiro'}</span>
                                <span className="char-race">{char.race || 'Sem Raça'}</span>
                            </div>

                            {/* Export Button */}
                            <button
                                className="export-char-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const fullChar = CharacterRepository.load(char.id);
                                    if (fullChar) {
                                        CharacterRepository.downloadCharacterFile(fullChar);
                                    }
                                }}
                                title="Exportar Ficha (.json)"
                                style={{
                                    position: 'absolute',
                                    top: '8px',
                                    right: '38px',
                                    background: 'rgba(0, 0, 0, 0.45)',
                                    border: '1px solid rgba(255, 215, 0, 0.3)',
                                    color: '#ffd700',
                                    borderRadius: '50%',
                                    width: '26px',
                                    height: '26px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <Download size={13} />
                            </button>

                            <button
                                className="delete-btn"
                                onClick={(e) => handleDelete(e, char.id)}
                                title="Excluir Personagem"
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                <X size={14} />
                            </button>

                            <button className="btn-play-char" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                <span>Entrar na Mesa</span>
                                <ArrowRight size={14} />
                            </button>
                        </div>
                    );
                })}

                {/* Create New Card */}
                <div className="char-card new-char" onClick={handleCreateNew}>
                    <div className="plus-icon">+</div>
                    <span>Criar Novo Herói</span>
                </div>
            </div>
        </div>
    );
};
