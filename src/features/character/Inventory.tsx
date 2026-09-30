import React, { useState } from 'react';
import type { Item } from './characterTypes';
import './Inventory.css';

interface InventoryProps {
    items: Item[];
    addItem: (item: Item) => void;
    removeItem: (id: string) => void;
}

export const Inventory: React.FC<InventoryProps> = ({ items, addItem, removeItem }) => {
    const [newItemName, setNewItemName] = useState('');

    const handleAdd = () => {
        if (newItemName.trim()) {
            addItem({
                id: crypto.randomUUID(),
                name: newItemName,
                quantity: 1,
                description: '',
            });
            setNewItemName('');
        }
    };

    return (
        <div className="inventory-block">
            <h3>Inventário</h3>
            <div className="add-item">
                <input
                    type="text"
                    placeholder="Nome do Item"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                />
                <button onClick={handleAdd}>Adicionar</button>
            </div>
            <ul className="item-list">
                {items.map((item) => (
                    <li key={item.id} className="item-row">
                        <span className="item-name">{item.name}</span>
                        <span className="item-qty">x{item.quantity}</span>
                        <button onClick={() => removeItem(item.id)} className="delete-btn">×</button>
                    </li>
                ))}
                {items.length === 0 && <li className="empty-msg">Inventário vazio</li>}
            </ul>
        </div>
    );
};
