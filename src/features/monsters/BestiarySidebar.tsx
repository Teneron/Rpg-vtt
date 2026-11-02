import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MonsterRepository } from './MonsterRepository';
import type { Monster } from './monsterTypes';
import { useCombat } from '../combat/CombatContext';
import { useMap } from '../map/MapContext';
import { MonsterEditor } from './MonsterEditor';
import { MonsterDetailsModal } from './MonsterDetailsModal';
import { compressTokenImage } from '../../utils/imageUtils';
import { Edit2, Trash2, Swords, Move, Info, Camera, MapPin } from 'lucide-react';

import { usePeer } from '../multiplayer/SocketContext';
import { useAdventure } from '../adventure/AdventureContext';

// Helper for safe ID generation
const generateId = (prefix: string) => {
    return typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const normalizeSystem = (sys?: string | null): string => {
    if (!sys) return '';
    const lower = sys.toLowerCase();
    if (lower === 'dnd5e' || lower === 'dnd55e' || lower === '5e' || lower === '5.5e') {
        return 'dnd55e';
    }
    return lower;
};

export const BestiarySidebar: React.FC = () => {
    const { roomSystem, currentAdventureId } = usePeer();
    const { currentAdventure } = useAdventure();
    const { tokens, addToken, updateToken, config } = useMap();
    const { addCombatant, combatState, updateCombatant } = useCombat();

    const effectiveAdventureId = currentAdventureId || currentAdventure?.id || null;

    const activeSystem: 'witcher' | 'dnd55e' = (
        roomSystem === 'witcher' ||
        currentAdventure?.system === 'witcher' ||
        effectiveAdventureId?.toUpperCase().startsWith('WTC') ||
        (typeof window !== 'undefined' && localStorage.getItem('rpg_selected_system') === 'witcher')
    ) ? 'witcher' : 'dnd55e';

    const [monsters, setMonsters] = useState<Monster[]>([]);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterSource, setFilterSource] = useState<string>('All');
    const [sortBy, setSortBy] = useState<'Name' | 'CR'>('Name');
    const [editingMonster, setEditingMonster] = useState<Monster | null | undefined>(undefined);
    const [viewingMonster, setViewingMonster] = useState<Monster | null>(null);
    const quickImageInputRef = useRef<HTMLInputElement>(null);
    const quickImageTargetRef = useRef<Monster | null>(null);

    const loadMonsters = useCallback(() => {
        try {
            const data = MonsterRepository.getAll();
            if (!Array.isArray(data)) throw new Error('Repository returned non-array');
            setMonsters([...data]);
            setErrorMsg(null);

            MonsterRepository.getAllAsync().then(asyncData => {
                if (Array.isArray(asyncData)) {
                    setMonsters([...asyncData]);
                }
            }).catch(console.error);
        } catch (e: any) {
            console.error('Critical: Failed to load monsters', e);
            setErrorMsg(e.message || 'Unknown error loading monsters');
        }
    }, []);

    useEffect(() => {
        loadMonsters();
        const handleMonstersUpdated = () => {
            loadMonsters();
        };
        window.addEventListener('rpg_monsters_updated', handleMonstersUpdated);
        return () => {
            window.removeEventListener('rpg_monsters_updated', handleMonstersUpdated);
        };
    }, [loadMonsters]);

    const isCustomMonsterVisible = useCallback((m: Monster): boolean => {
        if (m.source !== 'Custom') return false;
        const sysMatch = !m.system || normalizeSystem(m.system) === normalizeSystem(activeSystem);
        if (!sysMatch) return false;
        if (m.campaignId && m.campaignId !== 'default') {
            return !!effectiveAdventureId && m.campaignId === effectiveAdventureId;
        }
        return true;
    }, [activeSystem, effectiveAdventureId]);

    const availableSources = React.useMemo(() => {
        const list = ['All'];
        if (activeSystem === 'witcher') {
            list.push('Witcher');
        } else {
            list.push('5e');
        }
        if (monsters.some(m => isCustomMonsterVisible(m))) {
            list.push('Custom');
        }
        return list;
    }, [activeSystem, monsters, isCustomMonsterVisible]);

    const [activeTab, setActiveTab] = useState<'Bestiary' | 'NPCs'>('Bestiary');

    const filteredMonsters = monsters
        .filter(m => {
            // Campaign & System isolation
            if (m.source === 'Custom') {
                if (!isCustomMonsterVisible(m)) return false;
            } else {
                if (m.campaignId && m.campaignId !== 'default' && m.campaignId !== effectiveAdventureId) {
                    return false;
                }
                const normSys = normalizeSystem(m.system);
                const isSystemMatch = activeSystem === 'witcher'
                    ? (m.source === 'Witcher' || normSys === 'witcher')
                    : (m.source === '5e' || m.source === 'DnD5e' || normSys === 'dnd55e');
                if (!isSystemMatch) return false;
            }

            const name = m.name || '';
            const cat = m.category || '';
            const matchSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                cat.toLowerCase().includes(searchTerm.toLowerCase());

            let matchSource = filterSource === 'All';
            if (!matchSource) {
                const effSource = m.originalSource || m.source;
                if (filterSource === '5e') {
                    matchSource = effSource === '5e' || effSource === 'DnD5e';
                } else if (filterSource === 'Custom') {
                    matchSource = m.source === 'Custom';
                } else {
                    matchSource = effSource === filterSource;
                }
            }

            const isHumanoid = cat.toLowerCase().includes('humanoide') || cat.toLowerCase().includes('humanoid');
            const monstrousRaces = ['goblin', 'orc', 'kobold', 'gnoll', 'bullywug', 'sahuagin', 'troglodyte', 'bugbear', 'hobgoblin'];
            const isMonstrousRace = monstrousRaces.some(r => name.toLowerCase().includes(r));

            let matchTab = true;
            if (activeTab === 'NPCs') {
                matchTab = isHumanoid && !isMonstrousRace;
            } else {
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
            imageUrl: MonsterRepository.getTokenUrl(monster),
            ac: monster.ac,
            hp: { current: monster.hp.current, max: monster.hp.max },
            monsterId: monster.id
        });
    };

    const handleSpawnOnMap = (monster: Monster) => {
        const sizeMap: Record<string, number> = { Tiny: 0.5, Small: 1, Medium: 1, Large: 2, Huge: 3, Gargantuan: 4 };
        const tokenSize = (monster.size && sizeMap[monster.size]) || 1;
        const occupied = new Set(tokens.map(t => `${t.position.x},${t.position.y}`));
        let posX = Math.max(1, Math.min((config.width || 20) - 2, 4));
        let posY = Math.max(1, Math.min((config.height || 20) - 2, 4));
        while (occupied.has(`${posX},${posY}`)) {
            posX += 1;
            if (posX > Math.min((config.width || 20) - 2, 14)) {
                posX = 4;
                posY += 1;
            }
        }

        const tokenId = generateId('token');
        const tokenUrl = MonsterRepository.getTokenUrl(monster);

        addToken({
            id: tokenId,
            combatantId: tokenId,
            monsterId: monster.id,
            name: monster.name,
            position: { x: posX, y: posY },
            color: activeTab === 'NPCs' ? '#3b82f6' : '#dd0000',
            imageUrl: tokenUrl,
            size: tokenSize,
            hp: { current: monster.hp.max, max: monster.hp.max },
            ac: monster.ac,
            invisible: activeTab !== 'NPCs'
        });

        addCombatant({
            id: tokenId,
            name: monster.name,
            initiative: Math.floor(Math.random() * 20) + 1,
            isNPC: true,
            imageUrl: tokenUrl,
            ac: monster.ac,
            hp: { current: monster.hp.max, max: monster.hp.max },
            monsterId: monster.id
        });
    };

    const handleQuickTokenUploadClick = (monster: Monster, e: React.MouseEvent) => {
        e.stopPropagation();
        quickImageTargetRef.current = monster;
        quickImageInputRef.current?.click();
    };

    const handleQuickTokenFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        const target = quickImageTargetRef.current;
        if (!file || !target) return;

        try {
            const compressedUrl = await compressTokenImage(file);
            const preservedOriginalSource = target.originalSource ||
                (target.source !== 'Custom' ? target.source : undefined);

            const updatedMonster: Monster = {
                ...target,
                imageUrl: compressedUrl,
                source: 'Custom',
                ...(preservedOriginalSource ? { originalSource: preservedOriginalSource } : {}),
                campaignId: target.campaignId || effectiveAdventureId || 'default',
                system: target.system || activeSystem
            };

            MonsterRepository.saveCustomMonster(updatedMonster);

            // Sincroniza imediatamente tokens e combatentes desse monstro/NPC já em mesa
            tokens.forEach(t => {
                if (t.monsterId === updatedMonster.id) {
                    updateToken(t.id, { imageUrl: compressedUrl });
                }
            });
            (combatState.combatants || []).forEach(c => {
                if (c.monsterId === updatedMonster.id) {
                    updateCombatant(c.id, { imageUrl: compressedUrl });
                }
            });

            loadMonsters();
        } catch (err: any) {
            console.error('[BestiarySidebar] Erro ao atualizar imagem do token:', err);
            alert(err?.message || 'Erro ao processar a imagem do token.');
        } finally {
            quickImageTargetRef.current = null;
            e.target.value = '';
        }
    };

    const handleDeleteCustom = (monster: Monster, e: React.MouseEvent) => {
        e.stopPropagation();
        const isOverride = Boolean(monster.originalSource);
        const promptMsg = isOverride
            ? `Restaurar "${monster.name}" para a arte e atributos oficiais padrão?`
            : `Deletar "${monster.name}" customizado?`;
        if (confirm(promptMsg)) {
            MonsterRepository.deleteCustomMonster(monster.id);
            loadMonsters();
        }
    };

    return (
        <div style={{ padding: '10px', height: '100%', display: 'flex', flexDirection: 'column', color: '#fff', position: 'relative' }}>
            <input
                ref={quickImageInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleQuickTokenFileChange}
            />

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
                        + Novo {activeTab === 'NPCs' ? 'NPC' : 'Monstro'}
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
                        Monstros
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
                        NPCs
                    </button>
                </div>
            </div>

            {/* Editor Modal */}
            {editingMonster !== undefined && (
                <MonsterEditor
                    existingMonster={editingMonster}
                    campaignId={effectiveAdventureId}
                    system={activeSystem}
                    defaultCategory={activeTab === 'NPCs' ? 'Humanoide' : 'Monstrosidade'}
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
                    placeholder={activeTab === 'Bestiary' ? 'Buscar monstro...' : 'Buscar NPC...'}
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    style={{ flex: 1, padding: '5px', borderRadius: '4px', border: '1px solid #444', background: '#222', color: '#fff' }}
                />
                <select
                    value={filterSource}
                    onChange={e => setFilterSource(e.target.value)}
                    style={{ padding: '5px 8px', borderRadius: '4px', border: '1px solid #444', background: '#222', color: '#fff', minWidth: '125px' }}
                >
                    {availableSources.map(s => {
                        let label = s;
                        if (s === 'All') label = activeSystem === 'witcher' ? 'Todas as Criaturas' : 'Todos os Monstros';
                        else if (s === '5e' || s === 'DnD5e') label = 'D&D 5.5e (Oficial)';
                        else if (s === 'Witcher') label = 'The Witcher (Oficial)';
                        else if (s === 'Custom') label = 'Customizado';
                        return <option key={s} value={s}>{label}</option>;
                    })}
                </select>
                <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value as 'Name' | 'CR')}
                    style={{ padding: '5px', borderRadius: '4px', border: '1px solid #444', background: '#222', color: '#fff', width: '80px' }}
                >
                    <option value="Name">Nome</option>
                    <option value="CR">CR / Nv</option>
                </select>
            </div>

            {/* List */}
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {filteredMonsters.map(monster => {
                    const hasCustom = monster.source === 'Custom' || MonsterRepository.hasCustomOverride(monster.id);
                    return (
                        <div key={monster.id} style={{
                            background: 'rgba(255,255,255,0.05)',
                            padding: '10px',
                            borderRadius: '6px',
                            border: '1px solid rgba(255,255,255,0.1)',
                            position: 'relative'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <button
                                        type="button"
                                        onClick={(e) => handleQuickTokenUploadClick(monster, e)}
                                        title="Clique para enviar imagem do token (Monstro / NPC)"
                                        style={{
                                            position: 'relative',
                                            width: '38px',
                                            height: '38px',
                                            padding: 0,
                                            borderRadius: '50%',
                                            border: monster.imageUrl ? '2px solid #c5a059' : '2px solid #555',
                                            background: '#222',
                                            cursor: 'pointer',
                                            overflow: 'hidden',
                                            flexShrink: 0
                                        }}
                                    >
                                        <img
                                            src={MonsterRepository.getTokenUrl(monster)}
                                            alt="Token"
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                        />
                                        <span style={{
                                            position: 'absolute',
                                            right: 0,
                                            bottom: 0,
                                            background: 'rgba(0,0,0,0.75)',
                                            borderRadius: '50%',
                                            padding: '2px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <Camera size={9} color="#c5a059" />
                                        </span>
                                    </button>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                                            <strong style={{ fontSize: '1rem', color: monster.source === 'Custom' && !monster.originalSource ? '#55ff55' : '#f8fafc' }}>
                                                {monster.name}
                                            </strong>
                                            <span style={{
                                                fontSize: '0.65rem',
                                                padding: '1px 5px',
                                                borderRadius: '8px',
                                                border: '1px solid',
                                                borderColor: monster.source === 'Custom' && !monster.originalSource ? '#10b981' : (activeSystem === 'witcher' ? '#c5a059' : '#e11d48'),
                                                color: monster.source === 'Custom' && !monster.originalSource ? '#34d399' : (activeSystem === 'witcher' ? '#fde047' : '#fb7185'),
                                                backgroundColor: 'rgba(0,0,0,0.3)',
                                                fontWeight: 'bold'
                                            }}>
                                                {monster.source === 'Custom' && !monster.originalSource ? 'Custom' : (activeSystem === 'witcher' ? 'Witcher' : '5.5e')}
                                            </span>
                                        </div>
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
                                            marginLeft: '2px'
                                        }}
                                    >
                                        <Info size={12} color="#aaa" />
                                    </button>
                                </div>
                                <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.78rem', background: '#333', padding: '2px 6px', borderRadius: '4px' }}>
                                        CR {monster.cr}
                                    </span>
                                    <button
                                        onClick={() => setEditingMonster(monster)}
                                        title="Editar ficha ou imagem do token"
                                        style={{ cursor: 'pointer', background: 'none', border: 'none', color: '#cbd5e1', padding: '2px' }}
                                    >
                                        <Edit2 size={13} />
                                    </button>
                                    {hasCustom && (
                                        <button
                                            onClick={(e) => handleDeleteCustom(monster, e)}
                                            title={monster.originalSource ? 'Restaurar padrão oficial' : 'Deletar customizado'}
                                            style={{ cursor: 'pointer', background: 'none', border: 'none', color: '#f55', padding: '2px' }}
                                        >
                                            <Trash2 size={13} />
                                        </button>
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
                                        padding: '5px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '4px',
                                        fontSize: '0.78rem'
                                    }}
                                    title="Adicionar somente à Iniciativa"
                                >
                                    <Swords size={13} />
                                    <span>Combate</span>
                                </button>
                                <button
                                    onClick={() => handleSpawnOnMap(monster)}
                                    style={{
                                        flex: 1,
                                        background: '#1e3a5f',
                                        border: '1px solid #3b82f6',
                                        color: '#bfdbfe',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        padding: '5px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '4px',
                                        fontSize: '0.78rem'
                                    }}
                                    title="Colocar token direto no Mapa e na Iniciativa"
                                >
                                    <MapPin size={13} />
                                    <span>No Mapa</span>
                                </button>
                                <button
                                    draggable
                                    onDragStart={(e) => {
                                        e.dataTransfer.setData('monster_data', JSON.stringify({
                                            id: monster.id,
                                            name: monster.name,
                                            imageUrl: MonsterRepository.getTokenUrl(monster),
                                            size: monster.size,
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
                                        padding: '5px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '4px',
                                        fontSize: '0.78rem'
                                    }}
                                    title="Arraste para escolher a posição no mapa"
                                >
                                    <Move size={13} />
                                    <span>Arrastar</span>
                                </button>
                            </div>
                        </div>
                    );
                })}

                {filteredMonsters.length === 0 && (
                    <div style={{ textAlign: 'center', color: '#666', marginTop: '20px' }}>
                        Nenhum {activeTab === 'NPCs' ? 'NPC' : 'monstro'} encontrado.
                    </div>
                )}
            </div>
        </div>
    );
};
