import React, { useState, useEffect } from 'react';
import { CharacterRepository, type CharacterSummary } from './characterRepository';
import { usePeer } from '../multiplayer/FirebaseContext';
import './CharacterSelection.css'; // We'll create this css next

interface CharacterSelectionProps {
    onSelect: (characterId: string) => void;
}

export const CharacterSelection: React.FC<CharacterSelectionProps> = ({ onSelect }) => {
    const { username, currentAdventureId, currentAdventureName } = usePeer(); // Get current player name and campaign ID
    const [characters, setCharacters] = useState<CharacterSummary[]>([]);

    useEffect(() => {
        console.log('[CharacterSelection] Hook Triggered. Username:', username, 'AdvID:', currentAdventureId);
        loadList();
    }, [username, currentAdventureId]);

    const loadList = async () => {
        if (username) {
            // "default" fallback is handled by Repo, but explicit is fine too
            const advId = currentAdventureId || 'default';
            console.log('[CharacterSelection] Loading list for:', username, 'scope:', advId);
            const list = await CharacterRepository.listAllAsync(username, advId);
            setCharacters(list);

            // Auto-create if empty (User Request: Open builder direct)
            if (list.length === 0) {
                console.log("No characters found for this adventure, auto-creating for builder...");
                const newChar = CharacterRepository.create(username, advId);
                // We need to pass the ID up. But we just created it.
                // Calling onSelect immediately might be too fast for React state updates if we relied on 'characters' state,
                // but here we have the ID.
                onSelect(newChar.id);
            }
        }
    };

    const handleCreate = () => {
        if (!username) return;
        const advId = currentAdventureId || 'default';
        const newChar = CharacterRepository.create(username, advId);
        onSelect(newChar.id);
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (confirm('Tem certeza que deseja apagar este personagem para sempre?')) {
            const advId = currentAdventureId || 'default';
            await CharacterRepository.deleteAsync(id, username, advId);
            await loadList();
        }
    };

    return (
        <div className="char-selection-container">
            <h1 className="main-title">Selecione seu Personagem</h1>
            <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '10px 20px',
                borderRadius: '50px',
                marginBottom: '30px',
                fontSize: '0.9rem',
                color: '#aaa',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'inline-block'
            }}>
                <span style={{ marginRight: '15px' }}>👤 {username}</span>
                <span>📜 Campanha: <strong style={{ color: '#fff' }}>{currentAdventureName || 'Padrão'}</strong></span>
                <span style={{ marginLeft: '10px', fontSize: '0.8rem', opacity: 0.5 }}>(ID: {currentAdventureId?.substring(0, 6)})</span>
            </div>

            <div className="char-list">
                {characters.map(char => (
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
                        <h2 className="char-card-name">{char.name}</h2>
                        <div className="char-card-info">
                            <span>Lvl {char.level} {char.class}</span>
                            <span>{char.race}</span>
                            <span style={{ fontSize: '0.7rem', color: '#666' }}>ID da Aventura: {char.adventureId?.substring(0, 8)}</span>
                        </div>
                        <button className="delete-btn" onClick={(e) => handleDelete(e, char.id)}>✖</button>
                    </div>
                ))}

                {/* Create New Card */}
                <div className="char-card new-char" onClick={handleCreate}>
                    <div className="plus-icon">+</div>
                    <span>Novo Personagem</span>
                </div>
            </div>
        </div>
    );
};
