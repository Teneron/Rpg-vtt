import React, { useState } from 'react';
import type { Character } from './characterTypes';
import { Edit2 } from 'lucide-react';
import '../../Layout.css';

interface CharacterAvatarProps {
    character: Character;
    onUpdate: (url: string) => void;
}

export const CharacterAvatar: React.FC<CharacterAvatarProps> = ({ character, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempUrl, setTempUrl] = useState(character.imageUrl || '');

    // Sync local state when prop changes (e.g. initial load or external update)
    React.useEffect(() => {
        setTempUrl(character.imageUrl || '');
    }, [character.imageUrl]);

    const handleSave = () => {
        onUpdate(tempUrl);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setTempUrl(character.imageUrl || '');
        setIsEditing(false);
    };

    const displayUrl = character.imageUrl || '/tokens/token_default.png';

    return (
        <div className="char-avatar-container" style={{ position: 'relative', width: '100px', height: '100px' }}>
            <img
                src={displayUrl}
                alt={character.name}
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '50%',
                    border: '3px solid var(--glass-border)',
                    boxShadow: '0 0 15px rgba(0,0,0,0.5)',
                    background: '#222'
                }}
                onError={(e) => { (e.target as HTMLImageElement).src = '/tokens/token_default.png'; }}
            />

            <button
                onClick={() => setIsEditing(true)}
                title="Alterar Imagem"
                style={{
                    position: 'absolute',
                    bottom: '0',
                    right: '0',
                    background: '#333',
                    border: '1px solid #666',
                    color: '#fff',
                    borderRadius: '50%',
                    width: '28px',
                    height: '28px',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '12px'
                }}
            >
                <Edit2 size={13} />
            </button>

            {isEditing && (
                <div style={{
                    position: 'absolute', top: '110%', left: '-50px', width: '200px',
                    background: 'var(--glass-bg)', border: '1px solid var(--glass-border)',
                    padding: '10px', borderRadius: '8px', zIndex: 100, backdropFilter: 'blur(10px)'
                }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '5px' }}>URL da Imagem</label>
                    <input
                        className="glass-input"
                        value={tempUrl}
                        onChange={e => setTempUrl(e.target.value)}
                        placeholder="https://..."
                        style={{ width: '100%', marginBottom: '8px', fontSize: '0.8rem' }}
                    />
                    <div style={{ display: 'flex', gap: '5px' }}>
                        <button className="glass-button small active" onClick={handleSave} style={{ flex: 1 }}>Salvar</button>
                        <button className="glass-button small" onClick={handleCancel} style={{ flex: 1 }}>Cancelar</button>
                    </div>
                </div>
            )}
        </div>
    );
};
