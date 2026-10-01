import React, { useState, useEffect } from 'react';
import { MonsterRepository } from './MonsterRepository';
import type { Monster } from './monsterTypes';
import { useCombat } from '../combat/CombatContext';
import { MonsterEditor } from './MonsterEditor';
import { MonsterDetailsModal } from './MonsterDetailsModal';

// Helper for safe ID generation
const generateId = (prefix: string) => {
    return typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const BestiarySidebar: React.FC = () => {
    const [monsters, setMonsters] = useState<Monster[]>([]);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterSource, setFilterSource] = useState<string>('All');
    const [sortBy, setSortBy] = useState<'Name' | 'CR'>('Name');
    const { addCombatant } = useCombat();
    const [editingMonster, setEditingMonster] = useState<Monster | null | undefined>(undefined);
    const [viewingMonster, setViewingMonster] = useState<Monster | null>(null);

    const loadMonsters = () => {
        try {
            console.log("Attempting to load monsters...");
            const data = MonsterRepository.getAll();
            if (!Array.isArray(data)) throw new Error("Repository returned non-array");
            console.log("Monsters loaded:", data.length);
            setMonsters(data);
            setErrorMsg(null);

            MonsterRepository.getAllAsync().then(asyncData => {
                if (Array.isArray(asyncData)) {
                    setMonsters(asyncData);
                }
            }).catch(console.error);
        } catch (e: any) {
            console.error("Critical: Failed to load monsters", e);
            setErrorMsg(e.message || "Unknown error loading monsters");
        }
    };

    useEffect(() => {
        loadMonsters();
    }, []);

    const [sources, setSources] = useState<string[]>(['All']);

    useEffect(() => {
        try {
            const loaded = MonsterRepository.listSources();
            setSources(['All', ...loaded]);
        } catch (e) {
            console.error("Failed to load sources", e);
        }
    }, [monsters]);

    const [activeTab, setActiveTab] = useState<'Bestiary' | 'NPCs'>('Bestiary');

    const filteredMonsters = monsters
        .filter(m => {
            const name = m.name || '';
            const cat = m.category || '';
            const matchSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                cat.toLowerCase().includes(searchTerm.toLowerCase());
            const matchSource = filterSource === 'All' || m.source === filterSource;

            // Tab Logic
            // NPCs = Humanoids (excluding obvious monsters like Goblins/Orcs if preferred, but simpler to include all Humanoids or specific list)
            // For now: NPC Tab = category includes 'Humanoide'. Bestiary = !includes 'Humanoide' OR includes 'Goblin'/'Orc'/'Kobold' (Hybrid approach?)
            // Let's go strict: NPC Tab = Civilized Humanoids (Guard, Knight, Witcher). Bestiary = Everything else.
            // Simplified: NPC Tab = category 'Humanoide' or 'Humanoid'. Bestiary = All others.

            const isHumanoid = cat.toLowerCase().includes('humanoide') || cat.toLowerCase().includes('humanoid');
            // Exceptions for monstrous humanoids that should be in Bestiary
            const monstrousRaces = ['goblin', 'orc', 'kobold', 'gnoll', 'bullywug', 'sahuagin', 'troglodyte', 'bugbear', 'hobgoblin'];
            const isMonstrousRace = monstrousRaces.some(r => name.toLowerCase().includes(r));

            let matchTab = true;
            if (activeTab === 'NPCs') {
                matchTab = isHumanoid && !isMonstrousRace;
            } else {
                // Bestiary
                matchTab = !isHumanoid || isMonstrousRace;
            }

            return matchSearch && matchSource && matchTab;
        })
        .sort((a, b) => {
            if (sortBy === 'Name') return a.name.localeCompare(b.name);
            if (sortBy === 'CR') return b.cr - a.cr; // Highest CR first
            return 0;
        });

    const handleAdd = (monster: Monster) => {
        addCombatant({
            id: generateId('npc'),
            name: monster.name,
            initiative: 0,
            isNPC: true,
            hp: { current: monster.hp.current, max: monster.hp.max },
            monsterId: monster.id
        });
        // alert(`${monster.name} adicionado ao combate!`); // Removed alert for smoother flow
    };

    const handleDeleteCustom = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('Deletar monstro customizado?')) {
            MonsterRepository.deleteCustomMonster(id);
            loadMonsters();
        }
    };

    // Removed local getMonsterTokenUrl in favor of MonsterRepository.getTokenUrl

    return (
        <div style={{ padding: '10px', height: '100%', display: 'flex', flexDirection: 'column', color: '#fff', position: 'relative' }}>
            {errorMsg && (
                <div style={{ background: '#500', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #f00' }}>
                    <strong>Erro ao carregar bestiário:</strong> {errorMsg}
                </div>
            )}

            {/* Header & Tabs */}
            <div style={{ borderBottom: '1px solid #444', paddingBottom: '10px', marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <h3 style={{ margin: 0 }}>
                        {activeTab === 'Bestiary' ? 'Bestiário' : 'NPCs'}
                    </h3>
                    <button
                        onClick={() => setEditingMonster(null)}
                        style={{ fontSize: '0.8rem', background: '#225522', border: 'none', color: '#fff', cursor: 'pointer', padding: '5px 10px', borderRadius: '4px' }}
                    >
                        + Novo
                    </button>
                </div>

                <div style={{ display: 'flex', gap: '5px' }}>
                    <button
                        onClick={() => setActiveTab('Bestiary')}
                        style={{
                            flex: 1,
                            padding: '6px',
                            background: activeTab === 'Bestiary' ? '#444' : '#222',
                            border: activeTab === 'Bestiary' ? '1px solid #666' : '1px solid #333',
                            color: activeTab === 'Bestiary' ? '#fff' : '#888',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        🐲 Monstros
                    </button>
                    <button
                        onClick={() => setActiveTab('NPCs')}
                        style={{
                            flex: 1,
                            padding: '6px',
                            background: activeTab === 'NPCs' ? '#444' : '#222',
                            border: activeTab === 'NPCs' ? '1px solid #666' : '1px solid #333',
                            color: activeTab === 'NPCs' ? '#fff' : '#888',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        💂 NPCs
                    </button>
                </div>
            </div>

            {/* Editor Modal */}
            {editingMonster !== undefined && (
                <MonsterEditor
                    existingMonster={editingMonster}
                    onSave={() => {
                        setEditingMonster(undefined);
                        loadMonsters();
                    }}
                    onCancel={() => setEditingMonster(undefined)}
                />
            )}

            {/* View Details Modal */}
            {viewingMonster && (
                <MonsterDetailsModal
                    monster={viewingMonster}
                    onClose={() => setViewingMonster(null)}
                />
            )}

            {/* Controls */}
            <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
                <input
                    type="text"
                    placeholder={activeTab === 'Bestiary' ? "Buscar monstro..." : "Buscar NPC..."}
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    style={{ flex: 1, padding: '5px', borderRadius: '4px', border: '1px solid #444', background: '#222', color: '#fff' }}
                />
                <select
                    value={filterSource}
                    onChange={e => setFilterSource(e.target.value)}
                    style={{ padding: '5px', borderRadius: '4px', border: '1px solid #444', background: '#222', color: '#fff', width: '90px' }}
                >
                    {sources.map(s => <option key={s} value={s}>{s === 'All' ? 'Tudo' : s}</option>)}
                </select>
                <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value as 'Name' | 'CR')}
                    style={{ padding: '5px', borderRadius: '4px', border: '1px solid #444', background: '#222', color: '#fff', width: '80px' }}
                >
                    <option value="Name">Nome</option>
                    <option value="CR">CR</option>
                </select>
            </div>

            {/* List */}
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {filteredMonsters.map(monster => (
                    <div key={monster.id} style={{
                        background: 'rgba(255,255,255,0.05)',
                        padding: '10px',
                        borderRadius: '6px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        position: 'relative'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <img
                                    src={MonsterRepository.getTokenUrl(monster)}
                                    alt="Token"
                                    style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid #555', background: '#222' }}
                                />
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <strong style={{ fontSize: '1.1rem', color: monster.source === 'Custom' ? '#55ff55' : '#c5a059' }}>{monster.name}</strong>
                                </div>
                                <button
                                    onClick={() => setViewingMonster(monster)}
                                    title="Ver Detalhes"
                                    style={{
                                        cursor: 'pointer',
                                        background: 'none',
                                        border: '1px solid #555',
                                        color: '#fff',
                                        borderRadius: '50%',
                                        width: '20px',
                                        height: '20px',
                                        fontSize: '0.7rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginLeft: '5px'
                                    }}
                                >
                                    ℹ️
                                </button>
                            </div>
                            <div style={{ display: 'flex', gap: '5px' }}>
                                <span style={{ fontSize: '0.8rem', background: '#333', padding: '2px 6px', borderRadius: '4px' }}>
                                    CR {monster.cr}
                                </span>
                                {monster.source === 'Custom' && (
                                    <>
                                        <button onClick={() => setEditingMonster(monster)} title="Editar" style={{ cursor: 'pointer', background: 'none', border: 'none', color: '#aaa' }}>✏️</button>
                                        <button onClick={(e) => handleDeleteCustom(monster.id, e)} title="Deletar" style={{ cursor: 'pointer', background: 'none', border: 'none', color: '#f55' }}>🗑️</button>
                                    </>
                                )}
                            </div>
                        </div>

                        <div style={{ fontSize: '0.85rem', color: '#aaa', margin: '4px 0' }}>
                            {monster.category} • AC {monster.ac} • HP {monster.hp.max}
                        </div>

                        <div style={{ fontSize: '0.8rem', fontStyle: 'italic', marginBottom: '8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {monster.description || 'Sem descrição.'}
                        </div>

                        {/* Actions Preview */}
                        <div style={{ marginBottom: '8px' }}>
                            {monster.actions.slice(0, 2).map((action, idx) => (
                                <div key={idx} style={{ fontSize: '0.8rem', color: '#ddd' }}>
                                    • <strong style={{ color: '#fff' }}>{action.name}:</strong> {action.damage || (action.description ? action.description.substring(0, 30) + '...' : '')}
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'flex', gap: '5px' }}>
                            <button
                                onClick={() => handleAdd(monster)}
                                style={{
                                    flex: 1,
                                    background: '#442222',
                                    border: '1px solid #666',
                                    color: '#ffaaaa',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    padding: '5px'
                                }}
                            >
                                ⚔️ Combate
                            </button>
                            <button
                                draggable
                                onDragStart={(e) => {
                                    // Make sure we send the data format BattleMap expects
                                    e.dataTransfer.setData('monster_data', JSON.stringify({
                                        id: monster.id, // Added ID
                                        name: monster.name,
                                        imageUrl: MonsterRepository.getTokenUrl(monster),
                                        size: monster.size, // 'Medium', 'Large', etc. or handle mapping
                                        // Pass stats so BattleMap can init the token with them
                                        hp: monster.hp,
                                        ac: monster.ac
                                    }));
                                }}
                                style={{
                                    flex: 1,
                                    background: '#224422',
                                    border: '1px solid #666',
                                    color: '#aaffaa',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    padding: '5px'
                                }}
                                title="Arraste para o mapa"
                            >
                                🗺️ Arrastar
                            </button>
                        </div>
                    </div>
                ))}

                {filteredMonsters.length === 0 && (
                    <div style={{ textAlign: 'center', color: '#666', marginTop: '20px' }}>
                        Nenhum monstro encontrado.
                    </div>
                )}
            </div>
        </div>
    );
};
