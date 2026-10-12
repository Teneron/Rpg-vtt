import React, { useState } from 'react';
import type { Monster, MonsterAction } from './monsterTypes';
import { MonsterRepository } from './MonsterRepository';

interface MonsterEditorProps {
    existingMonster?: Monster | null;
    onSave: () => void;
    onCancel: () => void;
}

const defaultMonster: Monster = {
    id: '',
    name: 'Novo Monstro',
    category: 'Humanoid',
    source: 'Custom',
    cr: 1,
    ac: 10,
    hp: { current: 10, max: 10 },
    speed: 9,
    attributes: {
        str: { value: 10, modifier: 0 },
        dex: { value: 10, modifier: 0 },
        con: { value: 10, modifier: 0 },
        int: { value: 10, modifier: 0 },
        wis: { value: 10, modifier: 0 },
        cha: { value: 10, modifier: 0 }
    },
    visionRange: 0,
    actions: [],
    skills: [],
    senses: []
};

// Helper for safe ID generation
const generateId = (prefix: string) => {
    return typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const MonsterEditor: React.FC<MonsterEditorProps> = ({ existingMonster, onSave, onCancel }) => {
    const [data, setData] = useState<Monster>(() => {
        if (existingMonster) {
            return JSON.parse(JSON.stringify(existingMonster));
        }
        return {
            ...defaultMonster,
            id: generateId('custom'),
            source: 'Custom'
        };
    });

    const handleChange = (field: string, value: any) => {
        setData(prev => ({ ...prev, [field]: value }));
    };

    const handleHpChange = (val: number) => {
        setData(prev => ({ ...prev, hp: { current: val, max: val } }));
    };

    const handleAttrChange = (attr: keyof typeof data.attributes, val: number) => {
        const mod = Math.floor((val - 10) / 2);
        setData(prev => ({
            ...prev,
            attributes: {
                ...prev.attributes,
                [attr]: { value: val, modifier: mod }
            }
        }));
    };

    const addAction = () => {
        const newAction: MonsterAction = {
            id: generateId('action'),
            name: 'Novo Ataque',
            type: 'melee',
            description: 'Descrição do ataque',
            damage: '1d6'
        };
        setData(prev => ({ ...prev, actions: [...prev.actions, newAction] }));
    };

    const updateAction = (idx: number, updates: Partial<MonsterAction>) => {
        const newActions = [...data.actions];
        newActions[idx] = { ...newActions[idx], ...updates };
        setData(prev => ({ ...prev, actions: newActions }));
    };

    const removeAction = (idx: number) => {
        setData(prev => ({ ...prev, actions: prev.actions.filter((_, i) => i !== idx) }));
    };

    const handleSave = () => {
        if (!data.name) return alert("Nome é obrigatório");
        const monsterToSave = {
            ...data,
            id: data.id || generateId('custom'),
            source: 'Custom' as const
        };

        MonsterRepository.saveCustomMonster(monsterToSave);
        onSave();
    };

    return (
        <div style={{
            padding: '20px', background: '#2b2b2b', color: '#fff',
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            zIndex: 100, overflowY: 'auto'
        }}>
            <h2>{existingMonster ? 'Editar Monstro' : 'Criar Monstro'}</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <label>
                    Nome:
                    <input style={{ width: '95%' }} value={data.name} onChange={e => handleChange('name', e.target.value)} />
                </label>
                <label>
                    Categoria:
                    <input style={{ width: '95%' }} value={data.category} onChange={e => handleChange('category', e.target.value)} />
                </label>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <label>HP Max: <input type="number" value={data.hp.max} onChange={e => handleHpChange(parseInt(e.target.value))} style={{ width: '60px' }} /></label>
                <label>AC: <input type="number" value={data.ac} onChange={e => handleChange('ac', parseInt(e.target.value))} style={{ width: '60px' }} /></label>
                <label>Speed (m): <input type="number" value={data.speed} onChange={e => handleChange('speed', parseInt(e.target.value))} style={{ width: '60px' }} /></label>
                <label>CR: <input type="number" value={data.cr} onChange={e => handleChange('cr', parseFloat(e.target.value))} style={{ width: '60px' }} /></label>
            </div>

            <h4>Atributos</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '5px' }}>
                {(Object.keys(data.attributes) as Array<keyof typeof data.attributes>).map(attr => (
                    (attr !== 'ref' && attr !== 'will') && (
                        <div key={attr} style={{ textAlign: 'center' }}>
                            <div style={{ textTransform: 'uppercase', fontSize: '0.8rem' }}>{attr}</div>
                            <input
                                type="number"
                                value={data.attributes[attr].value}
                                onChange={e => handleAttrChange(attr, parseInt(e.target.value) || 10)}
                                style={{ width: '100%', textAlign: 'center' }}
                            />
                            <div style={{ fontSize: '0.8rem', color: '#aaa' }}>
                                {data.attributes[attr].modifier >= 0 ? '+' : ''}{data.attributes[attr].modifier}
                            </div>
                        </div>
                    )
                ))}
            </div>

            <h4>Ações</h4>
            {data.actions.map((action, idx) => (
                <div key={idx} style={{ background: '#333', padding: '10px', marginBottom: '5px', borderRadius: '5px' }}>
                    <div style={{ display: 'flex', gap: '5px', marginBottom: '5px' }}>
                        <input value={action.name} onChange={e => updateAction(idx, { name: e.target.value })} placeholder="Nome do Ataque" />
                        <select value={action.type} onChange={e => updateAction(idx, { type: e.target.value as any })}>
                            <option value="melee">Melee</option>
                            <option value="ranged">Ranged</option>
                            <option value="spell">Spell</option>
                        </select>
                        <input value={action.damage || ''} onChange={e => updateAction(idx, { damage: e.target.value })} placeholder="Dano (ex: 1d6+2)" style={{ width: '80px' }} />
                        <button onClick={() => removeAction(idx)} style={{ background: '#500' }}>X</button>
                    </div>
                    <textarea
                        value={action.description}
                        onChange={e => updateAction(idx, { description: e.target.value })}
                        style={{ width: '100%', height: '40px' }}
                        placeholder="Descrição"
                    />
                </div>
            ))}
            <button onClick={addAction} style={{ marginBottom: '20px' }}>+ Adicionar Ação</button>

            <div style={{ display: 'flex', gap: '10px', borderTop: '1px solid #555', paddingTop: '10px' }}>
                <button onClick={handleSave} style={{ background: '#28a745', padding: '10px 20px' }}>Salvar</button>
                <button onClick={onCancel} style={{ background: '#666', padding: '10px 20px' }}>Cancelar</button>
            </div>
        </div>
    );
};
