import React from 'react';
import type { Monster } from '../monsters/monsterTypes';

interface MonsterStatBlockProps {
    monster: Monster;
    compact?: boolean;
}

export const MonsterStatBlock: React.FC<MonsterStatBlockProps> = ({ monster, compact = false }) => {
    return (
        <div style={{
            background: '#1a1a1a',
            border: '1px solid #444',
            borderRadius: '8px',
            padding: '15px',
            color: '#eee',
            fontFamily: 'Segoe UI, sans-serif',
            maxWidth: compact ? '300px' : '100%'
        }}>
            {/* Header */}
            <div style={{ borderBottom: '2px solid #8B0000', paddingBottom: '10px', marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ margin: 0, color: '#c5a059', fontSize: '1.4rem' }}>{monster.name}</h2>
                    <span style={{ background: '#333', padding: '2px 6px', borderRadius: '4px', fontSize: '0.9rem' }}>
                        CR {monster.cr}
                    </span>
                </div>
                <div style={{ fontStyle: 'italic', fontSize: '0.9rem', color: '#aaa', marginTop: '4px' }}>
                    {monster.size} {monster.category}
                </div>
            </div>

            {/* Core Stats */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', gap: '15px' }}>
                <div title="Armor Class" style={{ textAlign: 'center' }}>
                    <div style={{ color: '#8B0000', fontWeight: 'bold' }}>AC</div>
                    <div style={{ fontSize: '1.2rem' }}>{monster.ac}</div>
                </div>
                <div title="Hit Points" style={{ textAlign: 'center' }}>
                    <div style={{ color: '#8B0000', fontWeight: 'bold' }}>HP</div>
                    <div style={{ fontSize: '1.2rem' }}>{monster.hp?.max || 10}</div>
                </div>
                {/* Removed Speed since it might not be in the basic type, or check type def */}
            </div>

            {/* Actions */}
            <div>
                <h3 style={{ borderBottom: '1px solid #444', color: '#8B0000', margin: '0 0 10px 0', fontSize: '1.1rem' }}>Ações</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {monster.actions.map((action, idx) => (
                        <div key={idx}>
                            <div style={{ marginBottom: '2px' }}>
                                <strong style={{ color: '#fff' }}>{action.name}.</strong>
                                {/* Simplified action display since strict types are missing props */}
                            </div>
                            <div style={{ fontSize: '0.9rem', color: '#ccc' }}>
                                {action.description}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
