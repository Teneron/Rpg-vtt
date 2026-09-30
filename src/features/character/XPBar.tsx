import React, { useState } from 'react';


interface XPBarProps {
    current: number;
    max: number;
    onUpdate: (val: number) => void;
    readOnly?: boolean;
}

export const XPBar: React.FC<XPBarProps> = ({ current, max, onUpdate, readOnly = false }) => {
    const [isEditing, setIsEditing] = useState(false);
    const percentage = Math.min(100, Math.max(0, (current / max) * 100));

    return (
        <div
            className="xp-bar-container"
            style={{
                position: 'relative', height: '8px', background: '#111',
                borderRadius: '4px', overflow: 'hidden', marginTop: '5px',
                cursor: readOnly ? 'default' : 'pointer'
            }}
            title={`XP: ${current} / ${max}`}
            onClick={() => !readOnly && setIsEditing(!isEditing)}
        >
            <div
                style={{
                    width: `${percentage}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #6a1b9a, #AB47BC)', // Roxo Místico
                    transition: 'width 0.5s ease-out',
                    boxShadow: '0 0 8px #AB47BC'
                }}
            />

            {/* Quick XP Input Overlay */}
            {isEditing && (
                <div style={{
                    position: 'absolute', top: '10px', left: '0',
                    background: '#222', border: '1px solid #444',
                    padding: '5px', borderRadius: '4px', zIndex: 10,
                    display: 'flex', gap: '5px', alignItems: 'center'
                }} onClick={e => e.stopPropagation()}>
                    <span style={{ fontSize: '0.7em', color: '#aaa' }}>XP:</span>
                    <input
                        type="number"
                        value={current}
                        onChange={e => onUpdate(parseInt(e.target.value) || 0)}
                        style={{ width: '60px', background: '#000', border: 'none', color: '#fff', fontSize: '0.8rem' }}
                        autoFocus
                    />
                    <span style={{ fontSize: '0.7em', color: '#666' }}>/ {max}</span>
                </div>
            )}
        </div>
    );
};
