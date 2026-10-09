import React, { useState, useEffect } from 'react';
import { MonsterRepository } from '../../monsters/MonsterRepository';
import type { Monster } from '../../monsters/monsterTypes';
import { ITEMS } from '../data/items';
import { useDice } from '../../dice/DiceContext';
import type { Character } from '../characterTypes';
import { BookOpen, FlaskConical, Shield, Compass } from 'lucide-react';

interface PlayerBestiaryPanelProps {
    character?: Character;
}

export const PlayerBestiaryPanel: React.FC<PlayerBestiaryPanelProps> = ({ character }) => {
    const { triggerRoll } = useDice();
    const [activeTab, setActiveTab] = useState<'monsters' | 'alchemy'>('monsters');
    const [monsters, setMonsters] = useState<Monster[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewingMonster, setViewingMonster] = useState<Monster | null>(null);

    useEffect(() => {
        setMonsters(MonsterRepository.getAll());
    }, []);

    // --- MONSTERS LOGIC (Strictly Witcher for Witcher Lore) ---
    const filteredMonsters = monsters.filter(m => {
        if (m.source !== 'Witcher') return false;
        const isHumanoid = m.category === 'NPC' || m.category === 'Humanoid' || m.category.includes('Humanoide') || m.category.includes('Civil');
        if (isHumanoid) return false;
        const matchSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || (m.category || '').toLowerCase().includes(searchTerm.toLowerCase());
        return matchSearch;
    }).sort((a, b) => a.name.localeCompare(b.name));

    // --- ALCHEMY LOGIC ---
    // Filter items that have toxicity defined
    const potions = ITEMS.filter(i => i.toxicity !== undefined).sort((a, b) => a.name.localeCompare(b.name));
    const filteredPotions = potions.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div style={{ height: '600px', display: 'flex', color: '#e0e0e0', background: '#121212', borderRadius: '8px', overflow: 'hidden', border: '1px solid #333', flexDirection: 'column' }}>

            {/* TOP TABS */}
            <div style={{ display: 'flex', borderBottom: '1px solid #333', background: '#1a1a1a' }}>
                <button
                    onClick={() => setActiveTab('monsters')}
                    style={{ flex: 1, padding: '15px', background: activeTab === 'monsters' ? '#222' : 'transparent', color: activeTab === 'monsters' ? '#c5a059' : '#888', border: 'none', cursor: 'pointer', fontWeight: 'bold', borderBottom: activeTab === 'monsters' ? '2px solid #c5a059' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                    <BookOpen size={15} />
                    <span>Bestiário</span>
                </button>
                <button
                    onClick={() => setActiveTab('alchemy')}
                    style={{ flex: 1, padding: '15px', background: activeTab === 'alchemy' ? '#222' : 'transparent', color: activeTab === 'alchemy' ? '#5f5' : '#888', border: 'none', cursor: 'pointer', fontWeight: 'bold', borderBottom: activeTab === 'alchemy' ? '2px solid #5f5' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                    <FlaskConical size={15} />
                    <span>Alquimia & Poções</span>
                </button>
            </div>

            {/* CONTENT AREA */}
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

                {/* ---------------- MONSTERS TAB ---------------- */}
                {activeTab === 'monsters' && (
                    <>
                        {/* Left List */}
                        <div style={{ width: '300px', borderRight: '1px solid #333', display: 'flex', flexDirection: 'column', background: '#1a1a1a' }}>
                            <div style={{ padding: '15px', borderBottom: '1px solid #333', background: '#222', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <input type="text" placeholder="Pesquisar Bestiário..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #444', background: '#000', color: '#fff', fontSize: '0.9rem' }} />
                            </div>
                            <div className="monster-list custom-scroll" style={{ flex: 1, overflowY: 'auto' }}>
                                {filteredMonsters.map(monster => (
                                    <div key={monster.id} onClick={() => setViewingMonster(monster)} style={{ padding: '12px 15px', borderBottom: '1px solid #2a2a2a', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', background: viewingMonster?.id === monster.id ? '#2a3b4c' : 'transparent', transition: 'background 0.2s' }} className="hover:bg-gray-800">
                                        <img src={MonsterRepository.getTokenUrl(monster)} alt={monster.name} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #555' }} />
                                        <div>
                                            <div style={{ color: viewingMonster?.id === monster.id ? '#4dabf7' : '#c5a059', fontWeight: 'bold', fontSize: '0.9rem' }}>{monster.name}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#888' }}>{monster.category}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Detail Pane */}
                        <div style={{ flex: 1, padding: '0', display: 'flex', flexDirection: 'column', background: '#121212', overflowY: 'auto' }}>
                            {viewingMonster ? (
                                <div className="animate-fade-in" style={{ padding: '30px', maxWidth: '800px', margin: '0 auto' }}>
                                    <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', marginBottom: '30px', borderBottom: '1px solid #333', paddingBottom: '20px' }}>
                                        <img src={MonsterRepository.getTokenUrl(viewingMonster)} alt={viewingMonster.name} style={{ width: '100px', height: '100px', borderRadius: '8px', objectFit: 'cover', border: '2px solid #c5a059', boxShadow: '0 4px 15px rgba(0,0,0,0.5)' }} />
                                        <div>
                                            <h1 style={{ margin: '0 0 5px 0', fontSize: '2rem', color: '#c5a059', fontFamily: 'serif' }}>{viewingMonster.name}</h1>
                                            <div style={{ display: 'inline-block', padding: '4px 12px', background: '#333', borderRadius: '12px', fontSize: '0.85rem', color: '#ccc' }}>{viewingMonster.category} • {viewingMonster.size}</div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 2fr) 1fr', gap: '30px' }}>
                                        <div>
                                            <h3 style={{ borderBottom: '1px solid #444', paddingBottom: '5px', color: '#aaa', marginTop: 0 }}>Conhecimento & Lore</h3>
                                            <p style={{ lineHeight: '1.6', color: '#ddd', fontSize: '1rem', whiteSpace: 'pre-wrap' }}>{viewingMonster.description || 'Nenhum registro encontrado...'}</p>
                                            <div style={{ marginTop: '20px' }}><h4 style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '5px' }}>Sentidos Conhecidos</h4><p style={{ color: '#ccc' }}>{viewingMonster.senses?.join(', ') || 'Nenhum registro.'}</p></div>
                                        </div>
                                        <div style={{ background: '#1e1e1e', padding: '20px', borderRadius: '8px', border: '1px solid #333', alignSelf: 'start' }}>
                                            <h3 style={{ color: '#e74c3c', marginTop: 0, borderBottom: '1px solid #e74c3c', paddingBottom: '5px' }}>Óleo & Fraquezas</h3>
                                            <div style={{ marginTop: '15px' }}><strong style={{ display: 'block', color: '#ff6b6b', marginBottom: '5px', fontSize: '0.9rem' }}>Vulnerabilidades:</strong>{viewingMonster.damageVulnerabilities && viewingMonster.damageVulnerabilities.length > 0 ? <ul style={{ margin: '0', paddingLeft: '20px', color: '#ffaaaa' }}>{viewingMonster.damageVulnerabilities.map(v => <li key={v}>{v}</li>)}</ul> : <span style={{ color: '#666', fontStyle: 'italic' }}>Nenhuma.</span>}</div>
                                            <div style={{ marginTop: '15px' }}><strong style={{ display: 'block', color: '#feca57', marginBottom: '5px', fontSize: '0.9rem' }}>Resistências:</strong>{viewingMonster.damageResistances && viewingMonster.damageResistances.length > 0 ? <ul style={{ margin: '0', paddingLeft: '20px', color: '#ffeaa7' }}>{viewingMonster.damageResistances.map(r => <li key={r}>{r}</li>)}</ul> : <span style={{ color: '#666', fontStyle: 'italic' }}>Nenhuma.</span>}</div>
                                            <div style={{ marginTop: '15px' }}><strong style={{ display: 'block', color: '#54a0ff', marginBottom: '5px', fontSize: '0.9rem' }}>Imunidades:</strong><div style={{ color: '#9ecaff', fontSize: '0.9rem' }}>{[...(viewingMonster.damageImmunities || []), ...(viewingMonster.conditionImmunities || [])].join(', ') || <span style={{ color: '#666', fontStyle: 'italic' }}>Nenhuma.</span>}</div></div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#444' }}>
                                    <Shield size={48} color="#444" style={{ marginBottom: '16px' }} />
                                    <p style={{ fontSize: '1.2rem' }}>Selecione uma criatura para consultar o bestiário.</p>
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* ---------------- ALCHEMY TAB ---------------- */}
                {activeTab === 'alchemy' && (
                    <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
                        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h2 style={{ color: '#5f5', margin: 0 }}>Receitas de Poções de Bruxo</h2>
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                    {character && (
                                        <button
                                            onClick={() => {
                                                let bonus = 0;
                                                const survival = character.skills?.find(s => s.name === 'Sobrevivência');
                                                if (survival) {
                                                    bonus = survival.value;
                                                } else {
                                                    // Fallback if skills not initialized
                                                    bonus = character.attributes.wis.modifier;
                                                }

                                                triggerRoll({ d20: 1 }, bonus, 'Coleta de Ingredientes (CD 15)');
                                            }}
                                            style={{
                                                padding: '8px 16px',
                                                background: '#2ecc71',
                                                color: '#000',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                fontWeight: 'bold',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '5px'
                                            }}
                                        >
                                            <Compass size={14} />
                                            <span>Coletar (CD 15)</span>
                                        </button>
                                    )}
                                    <input type="text" placeholder="Buscar poção..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #444', background: '#000', color: '#fff' }} />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                                {filteredPotions.map(potion => (
                                    <div key={potion.id} style={{ background: '#1e1e1e', border: '1px solid #333', borderRadius: '8px', padding: '15px', position: 'relative', overflow: 'hidden' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
                                            <h3 style={{ margin: '0 0 5px 0', color: '#c5a059' }}>{potion.name}</h3>
                                            <div style={{ background: '#000', color: '#5f5', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', border: '1px solid #5f5' }}>
                                                Tox: {potion.toxicity}
                                            </div>
                                        </div>

                                        <p style={{ color: '#ccc', fontSize: '0.9rem', lineHeight: '1.5', minHeight: '60px' }}>
                                            {potion.description}
                                        </p>

                                        <div style={{ marginTop: '15px', borderTop: '1px solid #333', paddingTop: '10px', fontSize: '0.8rem', color: '#888' }}>
                                            <strong>Receita (Sugestão):</strong>
                                            <div style={{ marginTop: '5px', color: '#aaa' }}>
                                                Necessita Kit de Alquimia + Álcool + Ingredientes Específicos.
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};
