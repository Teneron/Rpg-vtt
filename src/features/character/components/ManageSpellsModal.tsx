import React, { useState, useMemo } from 'react';
import { SPELLS, type Spell } from '../data/spells';
import type { Character } from '../characterTypes';

interface ManageSpellsModalProps {
    character: Character;
    onLearnSpell: (spell: Spell) => void;
    onForgetSpell: (spellId: string) => void;
    onClose: () => void;
}

export const ManageSpellsModal: React.FC<ManageSpellsModalProps> = ({ character, onLearnSpell, onForgetSpell, onClose }) => {
    const [search, setSearch] = useState('');
    const [filterLevel, setFilterLevel] = useState<number | 'all'>('all');
    // const [filterClass, setFilterClass] = useState<string>('all'); // Future use

    const knownSpellIds = useMemo(() => new Set((character.spells || []).map(s => s.id)), [character.spells]);

    const filteredSpells = useMemo(() => {
        return SPELLS.filter(spell => {
            const matchSearch = spell.name.toLowerCase().includes(search.toLowerCase());
            const matchLevel = filterLevel === 'all' || spell.level === filterLevel;
            // Class filtering is tricky if data doesn't have it, but usually spells have 'classes' array? 
            // Checking SPELLS data structure needed. Assuming they might not have class tags yet, or we ignore for now.
            return matchSearch && matchLevel;
        }).sort((a, b) => a.level - b.level || a.name.localeCompare(b.name));
    }, [search, filterLevel]);

    return (
        <div className="modal-overlay" style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.85)', zIndex: 1100, display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
            <div className="modal-content animate-fade-in" style={{
                background: '#1a1a1a', width: '900px', maxWidth: '95%', height: '85vh',
                borderRadius: '8px', display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid #444'
            }}>
                {/* HEAD */}
                <div style={{ padding: '15px', borderBottom: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#222' }}>
                    <h2 style={{ margin: 0, color: '#c5a059' }}>Gerenciar Grimório</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                </div>

                {/* FILTERS */}
                <div style={{ padding: '15px', display: 'flex', gap: '10px', background: '#111', borderBottom: '1px solid #333' }}>
                    <input
                        className="premium-input"
                        placeholder="Buscar magia..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{ flex: 1 }}
                    />
                    <select
                        className="premium-input"
                        value={filterLevel}
                        onChange={e => setFilterLevel(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                        style={{ width: '150px' }}
                    >
                        <option value="all">Todos Níveis</option>
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(l => <option key={l} value={l}>{l === 0 ? 'Truque' : `Nível ${l}`}</option>)}
                    </select>
                </div>

                {/* CONTENT */}
                <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                    {/* LEFT: SPELL LIST */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
                        {filteredSpells.map(spell => {
                            const known = knownSpellIds.has(spell.id);
                            return (
                                <div key={spell.id} style={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    padding: '10px', marginBottom: '5px', background: '#222', borderRadius: '4px',
                                    border: known ? '1px solid #2ecc71' : '1px solid #333'
                                }}>
                                    <div>
                                        <div style={{ fontWeight: 'bold', color: known ? '#2ecc71' : '#eee' }}>{spell.name}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#888' }}>
                                            {spell.level === 0 ? 'Truque' : `Nível ${spell.level}`} • {spell.school}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => known ? onForgetSpell(spell.id) : onLearnSpell(spell)}
                                        style={{
                                            background: known ? '#e74c3c' : '#2ecc71',
                                            color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer',
                                            fontSize: '0.9rem', fontWeight: 'bold'
                                        }}
                                    >
                                        {known ? 'Esquecer' : 'Aprender'}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};
