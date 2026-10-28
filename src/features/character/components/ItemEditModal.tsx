import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { Item } from '../characterTypes';

interface ItemEditModalProps {
    item?: Item; // If provided, we are editing. If null, creating.
    onSave: (item: Item) => void;
    onClose: () => void;
}

export const ItemEditModal: React.FC<ItemEditModalProps> = ({ item, onSave, onClose }) => {
    // Default State
    const [formData, setFormData] = useState<Partial<Item>>({
        id: crypto.randomUUID(),
        name: '',
        type: 'gear',
        quantity: 1,
        weight: 0,
        description: '',
        equipped: false,
        properties: []
    });

    useEffect(() => {
        if (item) {
            setFormData({ ...item });
        }
    }, [item]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData as Item);
        onClose();
    };

    const handleChange = (field: keyof Item, value: any) => {
        setFormData((prev: Partial<Item>) => ({ ...prev, [field]: value }));
    };

    const modalContent = (
        <div className="modal-overlay" style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center',
            zIndex: 100100, backdropFilter: 'blur(4px)'
        }}>
            <div className="modal-content animate-fade-in" style={{
                background: '#1a1a1a', padding: '25px', borderRadius: '12px',
                width: '500px', maxWidth: '95%', border: '1px solid #c5a059',
                boxShadow: '0 0 20px rgba(197, 160, 89, 0.2)'
            }}>
                <h2 style={{
                    color: '#c5a059', marginTop: 0, borderBottom: '1px solid #444',
                    paddingBottom: '15px', marginBottom: '20px'
                }}>
                    {item ? 'Editar Item' : 'Novo Item'}
                </h2>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

                    {/* Name */}
                    <div className="form-group">
                        <label style={{ display: 'block', color: '#aaa', marginBottom: '5px', fontSize: '0.9rem' }}>Nome</label>
                        <input
                            required
                            style={{
                                width: '100%', padding: '10px', background: '#222', border: '1px solid #444',
                                color: '#fff', borderRadius: '4px', fontSize: '1rem'
                            }}
                            value={formData.name}
                            onChange={e => handleChange('name', e.target.value)}
                            placeholder="Ex: Espada Longa"
                        />
                    </div>

                    {/* Type & Quantity Row */}
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label style={{ display: 'block', color: '#aaa', marginBottom: '5px', fontSize: '0.9rem' }}>Tipo</label>
                            <select
                                style={{
                                    width: '100%', padding: '10px', background: '#222', border: '1px solid #444',
                                    color: '#fff', borderRadius: '4px'
                                }}
                                value={formData.type}
                                onChange={e => handleChange('type', e.target.value)}
                            >
                                <option value="gear">Equipamento</option>
                                <option value="weapon">Arma</option>
                                <option value="armor">Armadura</option>
                                <option value="consumable">Consumível</option>
                                <option value="loot">Tesouro</option>
                            </select>
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label style={{ display: 'block', color: '#aaa', marginBottom: '5px', fontSize: '0.9rem' }}>Qtd.</label>
                            <input
                                type="number"
                                min="1"
                                style={{
                                    width: '100%', padding: '10px', background: '#222', border: '1px solid #444',
                                    color: '#fff', borderRadius: '4px'
                                }}
                                value={formData.quantity}
                                onChange={e => handleChange('quantity', parseInt(e.target.value) || 1)}
                            />
                        </div>
                    </div>

                    {/* Stats Row */}
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', color: '#aaa', marginBottom: '5px', fontSize: '0.8rem' }}>Peso (kg)</label>
                            <input
                                type="number" step="0.1"
                                style={{ width: '100%', padding: '8px', background: '#222', border: '1px solid #444', color: '#fff', borderRadius: '4px' }}
                                value={formData.weight}
                                onChange={e => handleChange('weight', parseFloat(e.target.value) || 0)}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', color: '#aaa', marginBottom: '5px', fontSize: '0.8rem' }}>Dano (Ex: 1d8)</label>
                            <input
                                style={{ width: '100%', padding: '8px', background: '#222', border: '1px solid #444', color: '#fff', borderRadius: '4px' }}
                                value={formData.damage || ''}
                                onChange={e => handleChange('damage', e.target.value)}
                                placeholder="--"
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', color: '#aaa', marginBottom: '5px', fontSize: '0.8rem' }}>CA Bonus</label>
                            <input
                                type="number"
                                style={{ width: '100%', padding: '8px', background: '#222', border: '1px solid #444', color: '#fff', borderRadius: '4px' }}
                                value={formData.ac || 0}
                                onChange={e => handleChange('ac', parseInt(e.target.value) || 0)}
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="form-group">
                        <label style={{ display: 'block', color: '#aaa', marginBottom: '5px', fontSize: '0.9rem' }}>Descrição</label>
                        <textarea
                            style={{
                                width: '100%', padding: '10px', background: '#222', border: '1px solid #444',
                                color: '#ccc', borderRadius: '4px', minHeight: '80px', resize: 'vertical'
                            }}
                            value={formData.description || ''}
                            onChange={e => handleChange('description', e.target.value)}
                        />
                    </div>

                    {/* Buttons */}
                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px', justifyContent: 'flex-end' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                padding: '10px 20px', background: 'transparent', color: '#aaa',
                                border: '1px solid #444', borderRadius: '4px', cursor: 'pointer'
                            }}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            style={{
                                padding: '10px 20px', background: 'linear-gradient(45deg, #c5a059, #b08d45)',
                                color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            {item ? 'Salvar Alterações' : 'Adicionar Item'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    if (typeof document === 'undefined') return null;
    return createPortal(modalContent, document.body);
};
