import React from 'react';
import type { Monster } from './monsterTypes';

interface MonsterDetailsModalProps {
    monster: Monster;
    onClose: () => void;
}

export const MonsterDetailsModal: React.FC<MonsterDetailsModalProps> = ({ monster, onClose }) => {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.85)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2000,
            backdropFilter: 'blur(5px)'
        }} onClick={onClose}>
            <div style={{
                background: '#1a1a1a',
                border: '1px solid #444',
                color: '#e0e0e0',
                width: '600px',
                maxWidth: '90%',
                maxHeight: '90vh',
                overflowY: 'auto',
                borderRadius: '8px',
                padding: '25px',
                position: 'relative',
                boxShadow: '0 0 20px rgba(0,0,0,0.8)'
            }} onClick={e => e.stopPropagation()}>

                <h2 style={{
                    marginTop: 0,
                    borderBottom: '2px solid #555',
                    paddingBottom: '10px',
                    color: monster.source === 'Custom' ? '#55ff55' : '#c5a059',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    {monster.name}
                    <span style={{ fontSize: '0.6em', background: '#333', padding: '4px 8px', borderRadius: '4px', color: '#fff' }}>
                        CR {monster.cr}
                    </span>
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                    <div>
                        <p><strong>Categoria:</strong> {monster.category}</p>
                        <p><strong>Fonte:</strong> {monster.source}</p>
                        <p><strong>HP:</strong> {monster.hp.max}</p>
                        <p><strong>CA (AC):</strong> {monster.ac}</p>
                        <p><strong>Deslocamento:</strong> {monster.speed}m</p>
                    </div>
                    <div>
                        <p><strong>Iniciativa:</strong> {(monster.initiativeModifier || 0) >= 0 ? '+' : ''}{monster.initiativeModifier || 0}</p>
                        <p><strong>Visão:</strong> {monster.visionRange}m</p>
                    </div>
                </div>

                <div style={{ background: '#252525', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                    <h3 style={{ marginTop: 0, borderBottom: '1px solid #444', paddingBottom: '5px' }}>Atributos</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', textAlign: 'center' }}>
                        {Object.entries(monster.attributes).map(([key, attr]) => (
                            <div key={key}>
                                <div style={{ fontWeight: 'bold', textTransform: 'uppercase', color: '#aaa' }}>{key}</div>
                                <div style={{ fontSize: '1.2em' }}>{attr.value}</div>
                                <div style={{ fontSize: '0.8em', color: attr.modifier >= 0 ? '#4f4' : '#f44' }}>
                                    {attr.modifier >= 0 ? '+' : ''}{attr.modifier}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {(monster.skills?.length > 0 || monster.senses?.length > 0) && (
                    <div style={{ marginBottom: '20px' }}>
                        {monster.skills && monster.skills.length > 0 && (
                            <p><strong>Perícias:</strong> {monster.skills.join(', ')}</p>
                        )}
                        {monster.senses && monster.senses.length > 0 && (
                            <p><strong>Sentidos:</strong> {monster.senses.join(', ')}</p>
                        )}
                    </div>
                )}

                <div style={{ marginBottom: '20px' }}>
                    <h3 style={{ borderBottom: '1px solid #444', paddingBottom: '5px' }}>Descrição</h3>
                    <p style={{ fontStyle: 'italic', lineHeight: '1.5', color: '#ccc' }}>
                        {monster.description || 'Nenhuma descrição disponível.'}
                    </p>
                </div>

                <div>
                    <h3 style={{ borderBottom: '1px solid #444', paddingBottom: '5px' }}>Ações</h3>
                    {monster.actions.map((action, idx) => (
                        <div key={idx} style={{ marginBottom: '15px' }}>
                            <div style={{ fontWeight: 'bold', color: '#fff', marginBottom: '2px' }}>
                                {action.name}
                                {action.type === 'melee' && ' ⚔️'}
                                {action.type === 'ranged' && ' 🏹'}
                                {action.type === 'spell' && ' ✨'}
                            </div>
                            <div style={{ fontSize: '0.9em', color: '#ddd' }}>{action.description}</div>
                            {action.damage && (
                                <div style={{ fontSize: '0.85em', color: '#ffaaaa', marginTop: '2px' }}>
                                    Dano: {action.damage}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '15px',
                        right: '15px',
                        background: 'transparent',
                        border: 'none',
                        color: '#aaa',
                        fontSize: '1.5rem',
                        cursor: 'pointer'
                    }}
                >
                    &times;
                </button>
            </div>
        </div>
    );
};
