import React, { useState } from 'react';
import type { Character, Item } from '../characterTypes';
import { ITEMS } from '../data/items';
import { ItemEditModal } from './ItemEditModal';

interface InventoryPanelProps {
    character: Character;
    onEquipToggle: (itemId: string, equipped: boolean) => void;
    onRemoveItem?: (itemId: string) => void;
    onConsumeItem?: (itemId: string) => void;
    isGM?: boolean;
    onAddItem?: (item: Item) => void;
    onUpdateItem?: (item: Item) => void;
}

export const InventoryPanel: React.FC<InventoryPanelProps> = ({
    character,
    onEquipToggle,
    onRemoveItem,
    onConsumeItem,
    isGM = false,
    onAddItem,
    onUpdateItem
}) => {
    const [filter, setFilter] = useState<'all' | 'weapon' | 'armor' | 'gear' | 'consumable'>('all');
    const [editingItem, setEditingItem] = useState<Item | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    const getEnhancedItem = (item: any) => {
        // Try precise ID match first
        let def = ITEMS.find(i => i.id === item.id);

        // If not found, try name match (case-insensitive)
        if (!def) {
            const normName = (item.name || '').toLowerCase().trim();
            def = ITEMS.find(i => i.name.toLowerCase() === normName);
        }

        // Helper to get normalized type
        const type = (item.type || def?.type || 'gear').toLowerCase();

        // Smart Weight: If item has weight > 0, use it. Otherwise use def weight. 
        // If both 0, check if it's a known "heavy" item types that shouldn't be 0? 
        // Actually, just checking > 0 is good. If custom item weight is 0, it stays 0 unless def exists.
        const baseWeight = (item.weight && item.weight > 0) ? item.weight : (def?.weight || 0);

        return {
            ...(def || {}),
            ...item,
            weight: baseWeight,
            description: item.description || def?.description,
            type: type,
            properties: item.properties || def?.properties,
            damage: item.damage || def?.damage,
            ac: item.ac || def?.ac
        };
    };

    const enhancedInventory = (character.inventory || []).map(getEnhancedItem);

    const filteredItems = enhancedInventory.filter(item => {
        const t = item.type;
        if (filter === 'all') return true;
        if (filter === 'weapon') return t === 'weapon' || t === 'arma';
        if (filter === 'armor') return t === 'armor' || t === 'armadura' || t === 'shield' || t === 'escudo';
        if (filter === 'consumable') return t === 'consumable' || t === 'consumivel';
        return !['weapon', 'arma', 'armor', 'armadura', 'shield', 'consumable'].includes(t);
    });

    const totalWeight = enhancedInventory.reduce((acc, item) => acc + ((item.weight || 0) * (item.quantity || 1)), 0);
    const equippedWeight = enhancedInventory
        .filter(i => i.equipped)
        .reduce((acc, item) => acc + ((item.weight || 0) * (item.quantity || 1)), 0);

    const maxWeight = (character.attributes?.str?.value || 10) * 7.5;
    const weightPercent = Math.min(100, (totalWeight / maxWeight) * 100);

    const getIcon = (type: string) => {
        const t = (type || '').toLowerCase();
        if (t.includes('weapon') || t.includes('arma')) return '⚔️';
        if (t.includes('armor') || t.includes('armadura') || t.includes('shield') || t.includes('escudo')) return '🛡️';
        if (t.includes('consumable') || t.includes('pot') || t.includes('food')) return '🧪';
        if (t.includes('gear') || t.includes('equip')) return '🎒';
        return '📦';
    };

    return (
        <div className="inventory-panel animate-fade-in" style={{ color: '#e0e0e0' }}>
            {/* Header / Stats */}
            <div style={{ background: '#222', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #333' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.9rem', color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px' }}>Carga Total</span>
                        <span style={{ fontSize: '0.8rem', color: '#666' }}>(Equipado: {equippedWeight.toFixed(1)} kg)</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: totalWeight > maxWeight ? '#ff6b6b' : '#c5a059' }}>
                            {totalWeight.toFixed(1)} / {maxWeight.toFixed(1)} kg
                        </span>

                        {/* GM ADD BUTTON */}
                        {isGM && onAddItem && (
                            <button
                                onClick={() => setIsCreating(true)}
                                style={{
                                    background: '#4caf50', color: '#fff', border: 'none', borderRadius: '4px',
                                    padding: '5px 10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem',
                                    display: 'flex', alignItems: 'center', gap: '5px'
                                }}
                            >
                                <span>➕</span> Novo Item
                            </button>
                        )}
                    </div>
                </div>
                <div style={{ height: '6px', width: '100%', background: '#111', borderRadius: '3px', overflow: 'hidden' }}>
                    <div
                        style={{
                            height: '100%',
                            width: `${weightPercent}%`,
                            background: totalWeight > maxWeight ? '#e74c3c' : 'linear-gradient(90deg, #c5a059, #f1c40f)',
                            transition: 'width 0.3s ease'
                        }}
                    />
                </div>
            </div>

            {/* Filters */}
            <div className="inv-filters" style={{ display: 'flex', gap: '8px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '5px' }}>
                {[
                    { id: 'all', label: 'Todos', icon: '♾️' },
                    { id: 'weapon', label: 'Armas', icon: '⚔️' },
                    { id: 'armor', label: 'Armaduras', icon: '🛡️' },
                    { id: 'consumable', label: 'itens', icon: '🧪' },
                    { id: 'gear', label: 'Mochila', icon: '🎒' }
                ].map(f => (
                    <button
                        key={f.id}
                        onClick={() => setFilter(f.id as any)}
                        style={{
                            background: filter === f.id ? 'linear-gradient(45deg, #c5a059, #b08d45)' : '#1a1a1a',
                            color: filter === f.id ? '#1a1a1a' : '#888',
                            border: filter === f.id ? '1px solid #d4ac0d' : '1px solid #333',
                            padding: '8px 16px',
                            borderRadius: '20px',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            fontWeight: filter === f.id ? 'bold' : 'normal',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            transition: 'all 0.2s',
                            boxShadow: filter === f.id ? '0 0 10px rgba(197, 160, 89, 0.3)' : 'none'
                        }}
                    >
                        <span>{f.icon}</span>
                        <span>{f.label}</span>
                    </button>
                ))}
            </div>

            {/* Grid List */}
            <div className="inv-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '15px' }}>
                {filteredItems.map((item, idx) => {
                    const isEquipped = item.equipped;
                    return (
                        <div
                            key={`${item.id}-${idx}`}
                            className="inv-card"
                            style={{
                                background: isEquipped ? 'linear-gradient(135deg, #2a2a2a 0%, #1e1e1e 100%)' : '#1a1a1a',
                                border: isEquipped ? '1px solid #c5a059' : '1px solid #333',
                                borderRadius: '8px',
                                padding: '15px',
                                position: 'relative',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                boxShadow: isEquipped ? '0 4px 12px rgba(0,0,0,0.3)' : 'none'
                            }}
                        >
                            {/* Card Header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                    <div style={{
                                        width: '40px', height: '40px',
                                        background: '#111', borderRadius: '6px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '1.2rem', border: '1px solid #333'
                                    }}>
                                        {getIcon(item.type)}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 'bold', color: isEquipped ? '#c5a059' : '#e0e0e0', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            {item.name}
                                            {isGM && onUpdateItem && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setEditingItem(item);
                                                    }}
                                                    style={{
                                                        background: 'none', border: '1px solid #444', borderRadius: '4px',
                                                        color: '#888', cursor: 'pointer', fontSize: '0.7rem', padding: '2px 6px'
                                                    }}
                                                    title="Editar Item"
                                                >
                                                    ✏️
                                                </button>
                                            )}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: '#666' }}>
                                            {item.type?.toUpperCase()} {item.quantity > 1 ? `• x${item.quantity}` : ''}
                                        </div>
                                    </div>
                                </div>
                                {isEquipped && <span style={{ fontSize: '1.2rem', marginRight: '10px' }}>✅</span>}
                                {onRemoveItem && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onRemoveItem(item.id);
                                        }}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            cursor: 'pointer',
                                            fontSize: '1.1rem',
                                            color: '#666',
                                            padding: '0 5px',
                                            transition: 'color 0.2s'
                                        }}
                                        className="hover:text-red-500"
                                        title="Remover Item"
                                    >
                                        🗑️
                                    </button>
                                )}
                            </div>

                            {/* Properties (Tags) */}
                            {item.properties && item.properties.length > 0 && (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '8px' }}>
                                    {item.properties.map((p: string, i: number) => (
                                        <span key={i} style={{ fontSize: '0.7rem', background: '#333', color: '#aaa', padding: '2px 6px', borderRadius: '4px' }}>
                                            {p}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Stats/Desc */}
                            <div style={{ fontSize: '0.85rem', color: '#aaa', minHeight: '30px', marginBottom: '10px', lineHeight: '1.4' }}>
                                {item.description && item.description.length > 60
                                    ? item.description.substring(0, 60) + '...'
                                    : (item.description || '')}
                            </div>

                            <div style={{ background: '#111', borderRadius: '4px', padding: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#888', marginBottom: '15px' }}>
                                {item.damage && <span>⚔️ {item.damage}</span>}
                                {item.ac && <span>🛡️ +{item.ac}</span>}
                                <span>⚖️ {(item.weight || 0).toFixed(1)}kg</span>
                            </div>

                            {/* Actions */}
                            {(item.type.includes('weapon') || item.type.includes('arma') || item.type.includes('armor') || item.type.includes('shield')) && (
                                <button
                                    onClick={() => onEquipToggle(item.id, !item.equipped)}
                                    style={{
                                        width: '100%',
                                        padding: '8px',
                                        background: isEquipped ? '#333' : '#c5a059',
                                        color: isEquipped ? '#ccc' : '#000',
                                        border: 'none',
                                        borderRadius: '4px',
                                        fontWeight: 'bold',
                                        cursor: 'pointer',
                                        textTransform: 'uppercase',
                                        fontSize: '0.8rem',
                                        letterSpacing: '0.5px',
                                        transition: 'background 0.2s'
                                    }}
                                >
                                    {isEquipped ? 'Desequipar' : 'Equipar'}
                                </button>
                            )}
                            {/* Potion Drink Button */}
                            {item.toxicity !== undefined && onConsumeItem && (
                                <button
                                    onClick={() => onConsumeItem(item.id)}
                                    style={{
                                        width: '100%',
                                        padding: '8px',
                                        marginTop: '5px',
                                        background: '#2ecc71',
                                        color: '#000',
                                        border: 'none',
                                        borderRadius: '4px',
                                        fontWeight: 'bold',
                                        cursor: 'pointer',
                                        textTransform: 'uppercase',
                                        fontSize: '0.8rem',
                                        letterSpacing: '0.5px'
                                    }}
                                >
                                    🧪 Beber (☠ {item.toxicity})
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
            {filteredItems.length === 0 && (
                <div style={{ padding: '40px', textAlign: 'center', color: '#666', fontStyle: 'italic' }}>
                    Nenhum item encontrado nesta categoria.
                </div>
            )}

            {/* MODALS */}
            {isCreating && onAddItem && (
                <ItemEditModal
                    onSave={(newItem) => {
                        onAddItem(newItem);
                        setIsCreating(false);
                    }}
                    onClose={() => setIsCreating(false)}
                />
            )}

            {editingItem && onUpdateItem && (
                <ItemEditModal
                    item={editingItem}
                    onSave={(updatedItem) => {
                        onUpdateItem(updatedItem);
                        setEditingItem(null);
                    }}
                    onClose={() => setEditingItem(null)}
                />
            )}
        </div>
    );
};
