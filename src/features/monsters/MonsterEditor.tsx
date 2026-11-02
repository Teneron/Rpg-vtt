import React, { useState, useRef } from 'react';
import type { Monster, MonsterAction } from './monsterTypes';
import { MonsterRepository } from './MonsterRepository';
import { useMultiplayer } from '../multiplayer/SocketContext';
import { useMap } from '../map/MapContext';
import { useCombat } from '../combat/CombatContext';
import { compressTokenImage } from '../../utils/imageUtils';
import { Upload, Trash2 } from 'lucide-react';

interface MonsterEditorProps {
    existingMonster?: Monster | null;
    campaignId?: string | null;
    system?: string;
    defaultCategory?: string;
    onSave: () => void;
    onCancel: () => void;
}

const defaultMonster: Monster = {
    id: '',
    name: 'Novo Monstro',
    category: 'Monstrosidade',
    size: 'Medium',
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

export const MonsterEditor: React.FC<MonsterEditorProps> = ({
    existingMonster,
    campaignId,
    system,
    defaultCategory,
    onSave,
    onCancel
}) => {
    const { currentAdventureId, roomSystem } = useMultiplayer();
    const { tokens, updateToken } = useMap();
    const { combatState, updateCombatant } = useCombat();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadingImage, setUploadingImage] = useState(false);

    const [data, setData] = useState<Monster>(() => {
        if (existingMonster) {
            return JSON.parse(JSON.stringify(existingMonster));
        }
        const isNpcDefault = (defaultCategory || '').toLowerCase().includes('human');
        return {
            ...defaultMonster,
            id: generateId('custom'),
            name: isNpcDefault ? 'Novo NPC' : 'Novo Monstro',
            category: defaultCategory || defaultMonster.category,
            source: 'Custom'
        };
    });

    const handleChange = (field: string, value: any) => {
        setData(prev => ({ ...prev, [field]: value }));
    };

    const handleTokenFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadingImage(true);
        try {
            const compressed = await compressTokenImage(file);
            setData(prev => ({ ...prev, imageUrl: compressed }));
        } catch (err: any) {
            console.error('[MonsterEditor] Falha ao comprimir imagem do token:', err);
            alert(err?.message || 'Erro ao processar a imagem do token.');
        } finally {
            setUploadingImage(false);
            e.target.value = '';
        }
    };

    const handleHpChange = (val: number) => {
        const safeHp = Number.isFinite(val) ? Math.max(1, val) : 10;
        setData(prev => ({ ...prev, hp: { current: safeHp, max: safeHp } }));
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
        if (!data.name) return alert('Nome é obrigatório');
        const preservedOriginalSource = existingMonster?.originalSource ||
            (existingMonster?.source && existingMonster.source !== 'Custom' ? existingMonster.source : undefined);

        const monsterToSave: Monster = {
            ...data,
            id: data.id || generateId('custom'),
            source: 'Custom' as const,
            ...(preservedOriginalSource ? { originalSource: preservedOriginalSource } : {}),
            campaignId: existingMonster?.campaignId || data.campaignId || campaignId || currentAdventureId || 'default',
            system: existingMonster?.system || data.system || system || roomSystem || 'dnd55e'
        };

        MonsterRepository.saveCustomMonster(monsterToSave);

        // Sincroniza tokens e combatentes ativos vinculados a este monstro/NPC
        const resolvedTokenUrl = MonsterRepository.getTokenUrl(monsterToSave);
        tokens.forEach(t => {
            if (t.monsterId === monsterToSave.id) {
                updateToken(t.id, {
                    name: monsterToSave.name,
                    imageUrl: resolvedTokenUrl,
                    ac: monsterToSave.ac
                });
            }
        });
        (combatState.combatants || []).forEach(c => {
            if (c.monsterId === monsterToSave.id) {
                updateCombatant(c.id, {
                    name: monsterToSave.name,
                    imageUrl: resolvedTokenUrl,
                    ac: monsterToSave.ac
                });
            }
        });

        onSave();
    };

    const previewTokenUrl = MonsterRepository.getTokenUrl(data);

    return (
        <div style={{
            padding: '20px', background: '#2b2b2b', color: '#fff',
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            zIndex: 100, overflowY: 'auto'
        }}>
            <h3 style={{ marginTop: 0, borderBottom: '1px solid #444', paddingBottom: '8px' }}>
                {existingMonster ? `Editar: ${existingMonster.name}` : 'Criar Monstro / NPC'}
            </h3>

            {/* Token Image Upload & URL Section */}
            <div style={{
                background: '#202020',
                border: '1px solid #444',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '14px',
                display: 'flex',
                gap: '12px',
                alignItems: 'center'
            }}>
                <img
                    src={previewTokenUrl}
                    alt="Preview do Token"
                    style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid #c5a059',
                        background: '#111',
                        flexShrink: 0
                    }}
                />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#c5a059' }}>
                        Imagem do Token (Monstro / NPC)
                    </div>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploadingImage}
                            style={{
                                background: '#334155',
                                border: '1px solid #64748b',
                                color: '#fff',
                                padding: '4px 10px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '0.78rem',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px'
                            }}
                        >
                            <Upload size={13} />
                            <span>{uploadingImage ? 'Processando...' : 'Upload Arquivo'}</span>
                        </button>
                        {data.imageUrl && (
                            <button
                                type="button"
                                onClick={() => handleChange('imageUrl', '')}
                                title="Restaurar imagem padrão da categoria"
                                style={{
                                    background: '#451a1a',
                                    border: '1px solid #7f1d1d',
                                    color: '#fca5a5',
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '0.78rem',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                }}
                            >
                                <Trash2 size={12} />
                                <span>Limpar</span>
                            </button>
                        )}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleTokenFileUpload}
                        />
                    </div>
                    <input
                        type="text"
                        placeholder="Ou cole a URL da imagem (https://...)"
                        value={data.imageUrl && !data.imageUrl.startsWith('data:') ? data.imageUrl : ''}
                        onChange={e => handleChange('imageUrl', e.target.value)}
                        style={{
                            width: '100%',
                            padding: '5px 8px',
                            background: '#161616',
                            border: '1px solid #444',
                            borderRadius: '4px',
                            color: '#fff',
                            fontSize: '0.78rem',
                            boxSizing: 'border-box'
                        }}
                    />
                    {data.imageUrl?.startsWith('data:') && (
                        <span style={{ fontSize: '0.7rem', color: '#4ade80' }}>
                            Imagem local carregada (WebP otimizado)
                        </span>
                    )}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <label style={{ fontSize: '0.85rem' }}>
                    Nome:
                    <input style={{ width: '95%', marginTop: '3px' }} value={data.name} onChange={e => handleChange('name', e.target.value)} />
                </label>
                <label style={{ fontSize: '0.85rem' }}>
                    Categoria (ex: Humanoide p/ NPC):
                    <input style={{ width: '95%', marginTop: '3px' }} value={data.category} onChange={e => handleChange('category', e.target.value)} />
                </label>
            </div>

            <div style={{ display: 'flex', gap: '6px', marginTop: '6px', flexWrap: 'wrap' }}>
                <button
                    type="button"
                    onClick={() => handleChange('category', 'Humanoide')}
                    style={{ fontSize: '0.72rem', padding: '2px 8px', background: data.category.toLowerCase().includes('human') ? '#1e3a8a' : '#333', border: '1px solid #555', color: '#fff', borderRadius: '4px', cursor: 'pointer' }}
                >
                    NPC (Humanoide)
                </button>
                <button
                    type="button"
                    onClick={() => handleChange('category', 'Monstrosidade')}
                    style={{ fontSize: '0.72rem', padding: '2px 8px', background: data.category === 'Monstrosidade' ? '#7f1d1d' : '#333', border: '1px solid #555', color: '#fff', borderRadius: '4px', cursor: 'pointer' }}
                >
                    Monstro
                </button>
                <button
                    type="button"
                    onClick={() => handleChange('category', 'Morto-Vivo')}
                    style={{ fontSize: '0.72rem', padding: '2px 8px', background: data.category === 'Morto-Vivo' ? '#4c1d95' : '#333', border: '1px solid #555', color: '#fff', borderRadius: '4px', cursor: 'pointer' }}
                >
                    Morto-Vivo
                </button>
                <button
                    type="button"
                    onClick={() => handleChange('category', 'Besta')}
                    style={{ fontSize: '0.72rem', padding: '2px 8px', background: data.category === 'Besta' ? '#14532d' : '#333', border: '1px solid #555', color: '#fff', borderRadius: '4px', cursor: 'pointer' }}
                >
                    Besta
                </button>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                <label style={{ fontSize: '0.85rem' }}>HP Max: <input type="number" value={data.hp.max} onChange={e => handleHpChange(parseInt(e.target.value))} style={{ width: '58px' }} /></label>
                <label style={{ fontSize: '0.85rem' }}>AC: <input type="number" value={data.ac} onChange={e => handleChange('ac', parseInt(e.target.value) || 10)} style={{ width: '52px' }} /></label>
                <label style={{ fontSize: '0.85rem' }}>Speed (m): <input type="number" value={data.speed} onChange={e => handleChange('speed', parseInt(e.target.value) || 9)} style={{ width: '52px' }} /></label>
                <label style={{ fontSize: '0.85rem' }}>CR: <input type="number" value={data.cr} onChange={e => handleChange('cr', parseFloat(e.target.value) || 0)} style={{ width: '52px' }} /></label>
                <label style={{ fontSize: '0.85rem' }}>
                    Tam.:{' '}
                    <select value={data.size || 'Medium'} onChange={e => handleChange('size', e.target.value)} style={{ padding: '2px 4px', background: '#1e1e1e', color: '#fff', border: '1px solid #555' }}>
                        <option value="Tiny">Mínimo (0.5)</option>
                        <option value="Small">Pequeno (1x1)</option>
                        <option value="Medium">Médio (1x1)</option>
                        <option value="Large">Grande (2x2)</option>
                        <option value="Huge">Enorme (3x3)</option>
                        <option value="Gargantuan">Imenso (4x4)</option>
                    </select>
                </label>
            </div>

            <h4>Atributos</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '5px' }}>
                {(Object.keys(data.attributes) as Array<keyof typeof data.attributes>).map(attr => {
                    const attrData = data.attributes[attr];
                    if (attr === 'ref' || attr === 'will' || !attrData) return null;
                    return (
                        <div key={attr} style={{ textAlign: 'center' }}>
                            <div style={{ textTransform: 'uppercase', fontSize: '0.8rem' }}>{attr}</div>
                            <input
                                type="number"
                                value={attrData.value}
                                onChange={e => handleAttrChange(attr, parseInt(e.target.value) || 10)}
                                style={{ width: '100%', textAlign: 'center' }}
                            />
                            <div style={{ fontSize: '0.8rem', color: '#aaa' }}>
                                {attrData.modifier >= 0 ? '+' : ''}{attrData.modifier}
                            </div>
                        </div>
                    );
                })}
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
                        <button type="button" onClick={() => removeAction(idx)} style={{ background: '#500', color: '#fff', border: 'none', padding: '2px 8px', cursor: 'pointer' }}>X</button>
                    </div>
                    <textarea
                        value={action.description}
                        onChange={e => updateAction(idx, { description: e.target.value })}
                        style={{ width: '100%', height: '40px' }}
                        placeholder="Descrição"
                    />
                </div>
            ))}
            <button type="button" onClick={addAction} style={{ marginBottom: '20px' }}>+ Adicionar Ação</button>

            <div style={{ display: 'flex', gap: '10px', borderTop: '1px solid #555', paddingTop: '10px' }}>
                <button type="button" onClick={handleSave} style={{ background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', padding: '10px 20px', cursor: 'pointer', fontWeight: 'bold' }}>Salvar</button>
                <button type="button" onClick={onCancel} style={{ background: '#666', color: '#fff', border: 'none', borderRadius: '4px', padding: '10px 20px', cursor: 'pointer' }}>Cancelar</button>
            </div>
        </div>
    );
};
