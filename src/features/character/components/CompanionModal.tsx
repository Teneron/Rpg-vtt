import React, { useState } from 'react';
import type { Character, Companion, CompanionAttack, CompanionFeature } from '../characterTypes';
import { COMPANION_PRESETS, instantiateCompanion, createCustomCompanion } from '../data/companionPresets';
import { useMap } from '../../map/MapContext';
import { useCombat } from '../../combat/CombatContext';
import {
    PawPrint, Shield, Heart, Swords, Plus, Trash2,
    Eye, Sparkles, X, Check, Dices, ChevronRight, Edit2
} from 'lucide-react';

interface CompanionModalProps {
    character: Character;
    onUpdateCharacter: (updates: Partial<Character>) => void;
    onClose: () => void;
    onRoll?: (title: string, modifier: number) => void;
    onRollDiceFormula?: (formula: string, title: string) => void;
}

export const CompanionModal: React.FC<CompanionModalProps> = ({
    character,
    onUpdateCharacter,
    onClose,
    onRoll,
    onRollDiceFormula
}) => {
    const companions = character.companions || [];
    const [selectedCompanionId, setSelectedCompanionId] = useState<string>(
        companions[0]?.id || ''
    );
    const [showPresetPicker, setShowPresetPicker] = useState(companions.length === 0);
    const [editingDetails, setEditingDetails] = useState(false);

    // Map & Combat contexts for spawning & initiative
    const { tokens, addToken, removeToken, updateToken } = useMap();
    const { addCombatant, combatState } = useCombat();

    const activeCompanion = companions.find(c => c.id === selectedCompanionId) || companions[0];

    // Check if token exists on map
    const activeTokenOnMap = activeCompanion
        ? tokens.find(t => t.isCompanion && t.companionId === activeCompanion.id)
        : null;

    // Check if in combat tracker
    const isInCombat = activeCompanion
        ? combatState.combatants.some(cb => cb.id === `comp_${activeCompanion.id}` || cb.name === activeCompanion.name)
        : false;

    // Save helpers
    const saveCompanions = (nextList: Companion[]) => {
        onUpdateCharacter({ companions: nextList });
    };

    const updateActiveCompanion = (updates: Partial<Companion>) => {
        if (!activeCompanion) return;
        const nextList = companions.map(c => {
            if (c.id === activeCompanion.id) {
                const updated = { ...c, ...updates };
                // Also sync with map token if on map
                if (activeTokenOnMap) {
                    const tokenUpdates: any = {};
                    if (updates.name) tokenUpdates.name = updates.name;
                    if (updates.avatarUrl) tokenUpdates.imageUrl = updates.avatarUrl;
                    if (updates.hp) tokenUpdates.hp = updates.hp;
                    if (updates.ac) tokenUpdates.ac = updates.ac;
                    updateToken(activeTokenOnMap.id, tokenUpdates);
                }
                return updated;
            }
            return c;
        });
        saveCompanions(nextList);
    };

    // Preset addition
    const handleAddPreset = (presetId: string) => {
        const wisMod = character.attributes?.wis?.modifier ?? 2;
        const charLevel = character.level || 1;
        const profBonus = character.proficiencyBonus || 2;

        const newComp = instantiateCompanion(presetId, charLevel, wisMod, profBonus);
        const nextList = [...companions, newComp];
        saveCompanions(nextList);
        setSelectedCompanionId(newComp.id);
        setShowPresetPicker(false);
    };

    // Custom addition
    const handleAddCustom = () => {
        const custom = createCustomCompanion();
        const nextList = [...companions, custom];
        saveCompanions(nextList);
        setSelectedCompanionId(custom.id);
        setShowPresetPicker(false);
        setEditingDetails(true);
    };

    // Remove companion
    const handleRemoveCompanion = (id: string) => {
        const compToRemove = companions.find(c => c.id === id);
        if (!compToRemove) return;
        if (!confirm(`Deseja realmente remover ${compToRemove.name}?`)) return;

        // If on map, despawn token
        const mapToken = tokens.find(t => t.isCompanion && t.companionId === id);
        if (mapToken) {
            removeToken(mapToken.id);
        }

        const nextList = companions.filter(c => c.id !== id);
        saveCompanions(nextList);
        if (selectedCompanionId === id) {
            setSelectedCompanionId(nextList[0]?.id || '');
        }
    };

    // Spawn / Despawn Token on Battle Map
    const handleToggleMapToken = () => {
        if (!activeCompanion) return;

        if (activeTokenOnMap) {
            // Despawn
            removeToken(activeTokenOnMap.id);
        } else {
            // Spawn near character token or center
            const pcToken = tokens.find(t => t.characterId === character.id);
            const targetX = pcToken ? Math.max(0, pcToken.position.x + 1) : 4;
            const targetY = pcToken ? Math.max(0, pcToken.position.y) : 4;

            const sizeNum = activeCompanion.size === 'Grande' ? 2 : activeCompanion.size === 'Enorme' ? 3 : 1;

            addToken({
                id: `comp_token_${activeCompanion.id}`,
                name: activeCompanion.name,
                imageUrl: activeCompanion.avatarUrl || '',
                color: '#38bdf8',
                size: sizeNum,
                position: { x: targetX, y: targetY },
                ownerId: character.id,
                isCompanion: true,
                companionId: activeCompanion.id,
                hp: { ...activeCompanion.hp },
                ac: activeCompanion.ac,
                visionRange: activeCompanion.visionRange || 0
            });
        }
    };

    // Enter Combat Tracker
    const handleEnterCombat = () => {
        if (!activeCompanion) return;
        const dexMod = activeCompanion.attributes?.dex?.modifier || 0;
        const roll = Math.floor(Math.random() * 20) + 1;
        const initTotal = roll + dexMod;

        addCombatant({
            id: `comp_${activeCompanion.id}`,
            name: `${activeCompanion.name} (${character.name})`,
            initiative: initTotal,
            bonus: dexMod,
            hp: {
                current: activeCompanion.hp.current,
                max: activeCompanion.hp.max
            },
            ac: activeCompanion.ac,
            isNPC: false,
            characterId: character.id,
            imageUrl: activeCompanion.avatarUrl
        });

        if (onRoll) {
            onRoll(`Iniciativa de ${activeCompanion.name}`, dexMod);
        }
    };

    // HP Adjustments
    const handleAdjustHp = (delta: number) => {
        if (!activeCompanion) return;
        const current = activeCompanion.hp.current;
        const max = activeCompanion.hp.max;
        const nextVal = Math.max(0, Math.min(max, current + delta));
        updateActiveCompanion({
            hp: { ...activeCompanion.hp, current: nextVal }
        });
    };

    return (
        <div
            className="modal-overlay"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(5, 7, 12, 0.88)',
                backdropFilter: 'blur(6px)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 2100,
                padding: '16px'
            }}
            onClick={onClose}
        >
            <div
                className="modal-content animate-scale-up"
                style={{
                    background: '#12141c',
                    width: '95%',
                    maxWidth: '920px',
                    maxHeight: '90vh',
                    borderRadius: '12px',
                    border: '1px solid #2a3142',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 20px rgba(56, 189, 248, 0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    color: '#e2e8f0'
                }}
                onClick={e => e.stopPropagation()}
            >
                {/* MODAL HEADER */}
                <div
                    style={{
                        padding: '16px 20px',
                        background: 'linear-gradient(90deg, #161a26 0%, #1a2234 100%)',
                        borderBottom: '1px solid #2a3142',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div
                            style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '8px',
                                background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 2px 8px rgba(2, 132, 199, 0.4)'
                            }}
                        >
                            <PawPrint size={20} color="#fff" />
                        </div>
                        <div>
                            <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#f8fafc', fontWeight: 700, letterSpacing: '0.5px' }}>
                                Companheiros, Familiares & Pets
                            </h2>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>
                                Gerencie fichas de pets, controle de token exclusivo no mapa e ações de combate
                            </p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <button
                            onClick={() => setShowPresetPicker(true)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                background: '#0284c7',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '6px 12px',
                                fontSize: '0.82rem',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                transition: 'background 0.2s'
                            }}
                        >
                            <Plus size={15} />
                            <span>Novo Pet / Preset</span>
                        </button>

                        <button
                            onClick={onClose}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#94a3b8',
                                cursor: 'pointer',
                                padding: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                borderRadius: '4px'
                            }}
                        >
                            <X size={22} />
                        </button>
                    </div>
                </div>

                {/* MODAL BODY */}
                <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>
                    {/* LEFT SIDEBAR: LIST OF PETS */}
                    <div
                        style={{
                            width: '240px',
                            background: '#0d0f17',
                            borderRight: '1px solid #1f2533',
                            padding: '12px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                            overflowY: 'auto'
                        }}
                    >
                        <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
                            Seus Companheiros ({companions.length})
                        </span>

                        {companions.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '24px 10px', color: '#64748b', fontSize: '0.85rem' }}>
                                <PawPrint size={32} style={{ margin: '0 auto 10px', opacity: 0.4 }} />
                                Nenhum companheiro adicionado ainda.
                            </div>
                        )}

                        {companions.map(comp => {
                            const isSelected = activeCompanion?.id === comp.id;
                            const hasMapToken = tokens.some(t => t.isCompanion && t.companionId === comp.id);

                            return (
                                <button
                                    key={comp.id}
                                    onClick={() => {
                                        setSelectedCompanionId(comp.id);
                                        setShowPresetPicker(false);
                                        setEditingDetails(false);
                                    }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        padding: '10px',
                                        borderRadius: '8px',
                                        background: isSelected ? '#1e2638' : '#141824',
                                        border: isSelected ? '1px solid #38bdf8' : '1px solid #1f2636',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        color: isSelected ? '#f8fafc' : '#cbd5e1',
                                        position: 'relative',
                                        transition: 'all 0.15s ease'
                                    }}
                                >
                                    <div
                                        style={{
                                            width: '36px',
                                            height: '36px',
                                            borderRadius: '50%',
                                            background: '#0f172a',
                                            border: '1px solid #38bdf8',
                                            overflow: 'hidden',
                                            flexShrink: 0,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '14px'
                                        }}
                                    >
                                        {comp.avatarUrl ? (
                                            <img src={comp.avatarUrl} alt={comp.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            '🐾'
                                        )}
                                    </div>

                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontWeight: 'bold', fontSize: '0.88rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {comp.name}
                                        </div>
                                        <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                                            PV: {comp.hp.current}/{comp.hp.max} • CA: {comp.ac}
                                        </div>
                                    </div>

                                    {hasMapToken && (
                                        <span title="Token no Mapa" style={{ fontSize: '10px', color: '#38bdf8' }}>
                                            🗺️
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* RIGHT MAIN AREA */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', background: '#12141c', padding: '20px' }}>
                        {showPresetPicker ? (
                            /* PRESET PICKER VIEW */
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#38bdf8' }}>
                                            Escolha um Modelo de Companheiro
                                        </h3>
                                        <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#94a3b8' }}>
                                            Estatísticas ajustadas automaticamente de acordo com o nível e sabedoria de {character.name}.
                                        </p>
                                    </div>
                                    {companions.length > 0 && (
                                        <button
                                            onClick={() => setShowPresetPicker(false)}
                                            style={{
                                                background: 'transparent',
                                                border: '1px solid #475569',
                                                color: '#cbd5e1',
                                                borderRadius: '6px',
                                                padding: '5px 12px',
                                                cursor: 'pointer',
                                                fontSize: '0.8rem'
                                            }}
                                        >
                                            Voltar à Ficha
                                        </button>
                                    )}
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px', marginBottom: '20px' }}>
                                    {COMPANION_PRESETS.map(preset => (
                                        <div
                                            key={preset.id}
                                            onClick={() => handleAddPreset(preset.id)}
                                            style={{
                                                background: '#161b28',
                                                border: '1px solid #283348',
                                                borderRadius: '10px',
                                                padding: '14px',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'space-between'
                                            }}
                                            onMouseEnter={e => {
                                                e.currentTarget.style.borderColor = '#38bdf8';
                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                            }}
                                            onMouseLeave={e => {
                                                e.currentTarget.style.borderColor = '#283348';
                                                e.currentTarget.style.transform = 'translateY(0)';
                                            }}
                                        >
                                            <div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                                    <div
                                                        style={{
                                                            width: '44px',
                                                            height: '44px',
                                                            borderRadius: '50%',
                                                            overflow: 'hidden',
                                                            border: '2px solid #38bdf8',
                                                            flexShrink: 0
                                                        }}
                                                    >
                                                        <img src={preset.avatarUrl} alt={preset.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: 'bold', fontSize: '0.98rem', color: '#f8fafc' }}>
                                                            {preset.name}
                                                        </div>
                                                        <div style={{ fontSize: '0.75rem', color: '#38bdf8' }}>
                                                            {preset.creatureType}
                                                        </div>
                                                    </div>
                                                </div>

                                                <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.4, margin: '0 0 10px' }}>
                                                    {preset.description}
                                                </p>

                                                <div style={{ display: 'flex', gap: '8px', fontSize: '0.75rem', color: '#cbd5e1', marginBottom: '8px' }}>
                                                    <span style={{ background: '#0f172a', padding: '2px 6px', borderRadius: '4px' }}>
                                                        Tam: {preset.size}
                                                    </span>
                                                    <span style={{ background: '#0f172a', padding: '2px 6px', borderRadius: '4px' }}>
                                                        Vel: {preset.speed}
                                                    </span>
                                                    <span style={{ background: '#0f172a', padding: '2px 6px', borderRadius: '4px' }}>
                                                        CA: {preset.baseAc}{preset.acAddsPb ? ' + PB' : ''}
                                                    </span>
                                                </div>
                                            </div>

                                            <button
                                                style={{
                                                    marginTop: '8px',
                                                    background: '#0284c7',
                                                    color: '#fff',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    padding: '6px 12px',
                                                    fontWeight: 'bold',
                                                    fontSize: '0.8rem',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '6px'
                                                }}
                                            >
                                                <span>Adicionar à Ficha</span>
                                                <ChevronRight size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div style={{ borderTop: '1px solid #1f2533', paddingTop: '16px', textAlign: 'center' }}>
                                    <button
                                        onClick={handleAddCustom}
                                        style={{
                                            background: '#1e293b',
                                            color: '#cbd5e1',
                                            border: '1px dashed #475569',
                                            borderRadius: '8px',
                                            padding: '10px 20px',
                                            cursor: 'pointer',
                                            fontSize: '0.85rem',
                                            fontWeight: 'bold',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}
                                    >
                                        <Plus size={16} />
                                        <span>Criar Companheiro / Pet Personalizado do Zero</span>
                                    </button>
                                </div>
                            </div>
                        ) : activeCompanion ? (
                            /* ACTIVE COMPANION SHEET VIEW */
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {/* TOP BANNER WITH STATS & CONTROLS */}
                                <div
                                    style={{
                                        background: 'linear-gradient(135deg, #182032 0%, #131928 100%)',
                                        border: '1px solid #28364f',
                                        borderRadius: '10px',
                                        padding: '16px',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        flexWrap: 'wrap',
                                        gap: '14px'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                        <div
                                            style={{
                                                width: '60px',
                                                height: '60px',
                                                borderRadius: '50%',
                                                overflow: 'hidden',
                                                border: '2px solid #38bdf8',
                                                flexShrink: 0,
                                                background: '#090d16',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                                            }}
                                        >
                                            {activeCompanion.avatarUrl ? (
                                                <img src={activeCompanion.avatarUrl} alt={activeCompanion.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <PawPrint size={28} color="#38bdf8" />
                                            )}
                                        </div>

                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                {editingDetails ? (
                                                    <input
                                                        type="text"
                                                        value={activeCompanion.name}
                                                        onChange={e => updateActiveCompanion({ name: e.target.value })}
                                                        style={{
                                                            background: '#0f172a',
                                                            border: '1px solid #38bdf8',
                                                            color: '#f8fafc',
                                                            borderRadius: '4px',
                                                            padding: '2px 8px',
                                                            fontSize: '1.15rem',
                                                            fontWeight: 'bold'
                                                        }}
                                                    />
                                                ) : (
                                                    <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#f8fafc', fontWeight: 'bold' }}>
                                                        {activeCompanion.name}
                                                    </h3>
                                                )}

                                                <button
                                                    onClick={() => setEditingDetails(!editingDetails)}
                                                    style={{
                                                        background: 'none',
                                                        border: 'none',
                                                        color: '#64748b',
                                                        cursor: 'pointer',
                                                        padding: '4px'
                                                    }}
                                                    title={editingDetails ? 'Concluir Edição' : 'Editar Nome & Detalhes'}
                                                >
                                                    {editingDetails ? <Check size={16} color="#4ade80" /> : <Edit2 size={14} />}
                                                </button>
                                            </div>

                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', flexWrap: 'wrap' }}>
                                                <span style={{ fontSize: '0.75rem', background: '#0f172a', color: '#38bdf8', padding: '2px 8px', borderRadius: '4px', border: '1px solid #1e293b' }}>
                                                    {activeCompanion.creatureType}
                                                </span>
                                                <span style={{ fontSize: '0.75rem', background: '#0f172a', color: '#94a3b8', padding: '2px 8px', borderRadius: '4px' }}>
                                                    Tamanho: {activeCompanion.size}
                                                </span>
                                                <span style={{ fontSize: '0.75rem', background: '#0f172a', color: '#94a3b8', padding: '2px 8px', borderRadius: '4px' }}>
                                                    Velocidade: {activeCompanion.speed}
                                                </span>
                                                {activeCompanion.visionRange && (
                                                    <span style={{ fontSize: '0.75rem', background: '#0f172a', color: '#cbd5e1', padding: '2px 8px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        <Eye size={12} color="#38bdf8" />
                                                        Visão: {activeCompanion.visionRange}m
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* MAP & COMBAT INTEGRATION BUTTONS */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        {/* TOKEN SPAWN BUTTON */}
                                        <button
                                            onClick={handleToggleMapToken}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                background: activeTokenOnMap ? '#15803d' : '#0284c7',
                                                color: '#fff',
                                                border: 'none',
                                                borderRadius: '6px',
                                                padding: '8px 14px',
                                                fontWeight: 'bold',
                                                fontSize: '0.82rem',
                                                cursor: 'pointer',
                                                boxShadow: activeTokenOnMap ? '0 0 10px rgba(34, 197, 94, 0.4)' : 'none',
                                                transition: 'all 0.2s'
                                            }}
                                            title={activeTokenOnMap ? 'Clique para dispensar o token do mapa' : 'Clique para invocar o token no mapa de batalha'}
                                        >
                                            <PawPrint size={15} />
                                            <span>{activeTokenOnMap ? 'Token no Mapa ✓' : 'Invocar no Mapa'}</span>
                                        </button>

                                        {/* COMBAT TRACKER BUTTON */}
                                        <button
                                            onClick={handleEnterCombat}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                background: isInCombat ? '#475569' : '#dc2626',
                                                color: '#fff',
                                                border: 'none',
                                                borderRadius: '6px',
                                                padding: '8px 14px',
                                                fontWeight: 'bold',
                                                fontSize: '0.82rem',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s'
                                            }}
                                            title="Rolar iniciativa e adicionar ao Rastreador de Combate"
                                        >
                                            <Swords size={15} />
                                            <span>{isInCombat ? 'Em Combate' : 'Rolar Iniciativa'}</span>
                                        </button>

                                        {/* DELETE COMPANION */}
                                        <button
                                            onClick={() => handleRemoveCompanion(activeCompanion.id)}
                                            style={{
                                                background: 'none',
                                                border: '1px solid #7f1d1d',
                                                color: '#f87171',
                                                borderRadius: '6px',
                                                padding: '7px 10px',
                                                cursor: 'pointer'
                                            }}
                                            title="Remover Companheiro"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                </div>

                                {editingDetails && (
                                    /* AVATAR URL & SPEED EDITING */
                                    <div style={{ background: '#161d2b', border: '1px solid #29354a', borderRadius: '8px', padding: '12px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                        <div style={{ flex: 1, minWidth: '200px' }}>
                                            <label style={{ fontSize: '0.75rem', color: '#94a3b8' }}>URL da Imagem / Avatar:</label>
                                            <input
                                                type="text"
                                                value={activeCompanion.avatarUrl || ''}
                                                onChange={e => updateActiveCompanion({ avatarUrl: e.target.value })}
                                                placeholder="https://..."
                                                style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '4px', padding: '4px 8px', fontSize: '0.8rem' }}
                                            />
                                        </div>
                                        <div style={{ width: '130px' }}>
                                            <label style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Deslocamento:</label>
                                            <input
                                                type="text"
                                                value={activeCompanion.speed}
                                                onChange={e => updateActiveCompanion({ speed: e.target.value })}
                                                style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '4px', padding: '4px 8px', fontSize: '0.8rem' }}
                                            />
                                        </div>
                                        <div style={{ width: '100px' }}>
                                            <label style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Visão (m):</label>
                                            <input
                                                type="number"
                                                value={activeCompanion.visionRange || 0}
                                                onChange={e => updateActiveCompanion({ visionRange: Number(e.target.value) })}
                                                style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '4px', padding: '4px 8px', fontSize: '0.8rem' }}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* VITALS & COMBAT STATS ROW */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
                                    {/* CA (ARMOR CLASS) */}
                                    <div
                                        style={{
                                            background: '#161b28',
                                            border: '1px solid #283348',
                                            borderRadius: '8px',
                                            padding: '14px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between'
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <Shield size={24} color="#38bdf8" />
                                            <div>
                                                <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Classe de Armadura</div>
                                                <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#f8fafc' }}>{activeCompanion.ac}</div>
                                            </div>
                                        </div>
                                        {editingDetails && (
                                            <input
                                                type="number"
                                                value={activeCompanion.ac}
                                                onChange={e => updateActiveCompanion({ ac: Number(e.target.value) })}
                                                style={{ width: '50px', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '4px', padding: '4px', textAlign: 'center', fontSize: '1rem', fontWeight: 'bold' }}
                                            />
                                        )}
                                    </div>

                                    {/* HP (VITALITY) */}
                                    <div
                                        style={{
                                            background: '#161b28',
                                            border: '1px solid #283348',
                                            borderRadius: '8px',
                                            padding: '14px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '8px'
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <Heart size={20} color="#f43f5e" />
                                                <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Pontos de Vida</span>
                                            </div>
                                            <span style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#f8fafc' }}>
                                                {activeCompanion.hp.current} / {activeCompanion.hp.max}
                                            </span>
                                        </div>

                                        <div style={{ width: '100%', height: '6px', background: '#0f172a', borderRadius: '3px', overflow: 'hidden' }}>
                                            <div
                                                style={{
                                                    height: '100%',
                                                    width: `${Math.min(100, (activeCompanion.hp.current / activeCompanion.hp.max) * 100)}%`,
                                                    background: activeCompanion.hp.current > (activeCompanion.hp.max / 2) ? '#22c55e' : (activeCompanion.hp.current > 0 ? '#eab308' : '#ef4444'),
                                                    transition: 'width 0.2s'
                                                }}
                                            />
                                        </div>

                                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', marginTop: '2px' }}>
                                            <button onClick={() => handleAdjustHp(-5)} style={{ background: '#334155', color: '#fff', border: 'none', borderRadius: '4px', padding: '2px 8px', fontSize: '0.75rem', cursor: 'pointer' }}>-5</button>
                                            <button onClick={() => handleAdjustHp(-1)} style={{ background: '#334155', color: '#fff', border: 'none', borderRadius: '4px', padding: '2px 8px', fontSize: '0.75rem', cursor: 'pointer' }}>-1</button>
                                            <button onClick={() => handleAdjustHp(+1)} style={{ background: '#334155', color: '#fff', border: 'none', borderRadius: '4px', padding: '2px 8px', fontSize: '0.75rem', cursor: 'pointer' }}>+1</button>
                                            <button onClick={() => handleAdjustHp(+5)} style={{ background: '#334155', color: '#fff', border: 'none', borderRadius: '4px', padding: '2px 8px', fontSize: '0.75rem', cursor: 'pointer' }}>+5</button>
                                            <button onClick={() => handleAdjustHp(999)} style={{ background: '#15803d', color: '#fff', border: 'none', borderRadius: '4px', padding: '2px 8px', fontSize: '0.75rem', cursor: 'pointer' }} title="Descanso Longo (Curar Tudo)">Total</button>
                                        </div>
                                    </div>
                                </div>

                                {/* ATTRIBUTES GRID */}
                                <div style={{ background: '#161b28', border: '1px solid #283348', borderRadius: '8px', padding: '14px' }}>
                                    <div style={{ fontSize: '0.78rem', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '10px' }}>
                                        Atributos & Modificadores (Clique para rolar teste)
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px' }}>
                                        {(['str', 'dex', 'con', 'int', 'wis', 'cha'] as const).map(attrKey => {
                                            const labels: Record<string, string> = {
                                                str: 'FOR', dex: 'DES', con: 'CON', int: 'INT', wis: 'SAB', cha: 'CAR'
                                            };
                                            const attr = activeCompanion.attributes[attrKey];
                                            const modStr = attr.modifier >= 0 ? `+${attr.modifier}` : `${attr.modifier}`;

                                            return (
                                                <button
                                                    key={attrKey}
                                                    onClick={() => onRoll && onRoll(`Teste de ${labels[attrKey]} (${activeCompanion.name})`, attr.modifier)}
                                                    style={{
                                                        background: '#0d111a',
                                                        border: '1px solid #232d40',
                                                        borderRadius: '6px',
                                                        padding: '8px 4px',
                                                        textAlign: 'center',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.15s'
                                                    }}
                                                    onMouseEnter={e => e.currentTarget.style.borderColor = '#38bdf8'}
                                                    onMouseLeave={e => e.currentTarget.style.borderColor = '#232d40'}
                                                    title={`Clique para rolar teste de ${labels[attrKey]} (1d20 ${modStr})`}
                                                >
                                                    <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 'bold' }}>{labels[attrKey]}</div>
                                                    <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#38bdf8' }}>{modStr}</div>
                                                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>({attr.value})</div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* ATTACKS & ACTIONS */}
                                <div style={{ background: '#161b28', border: '1px solid #283348', borderRadius: '8px', padding: '14px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Swords size={18} color="#f43f5e" />
                                            <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#f8fafc' }}>
                                                Ataques & Ações de Combate
                                            </span>
                                        </div>

                                        <button
                                            onClick={() => {
                                                const nextAttacks: CompanionAttack[] = [
                                                    ...activeCompanion.attacks,
                                                    { name: 'Novo Ataque', attackBonus: 3, damage: '1d6 + 2', damageType: 'Físico', range: '1,5m' }
                                                ];
                                                updateActiveCompanion({ attacks: nextAttacks });
                                            }}
                                            style={{
                                                background: '#1e293b',
                                                border: '1px solid #334155',
                                                color: '#cbd5e1',
                                                borderRadius: '4px',
                                                padding: '4px 8px',
                                                fontSize: '0.75rem',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px'
                                            }}
                                        >
                                            <Plus size={13} />
                                            <span>Adicionar Ataque</span>
                                        </button>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {activeCompanion.attacks.map((atk, index) => (
                                            <div
                                                key={index}
                                                style={{
                                                    background: '#0d111a',
                                                    border: '1px solid #232d40',
                                                    borderRadius: '6px',
                                                    padding: '10px 12px',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    gap: '10px'
                                                }}
                                            >
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <span style={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#f8fafc' }}>
                                                            {atk.name}
                                                        </span>
                                                        <span style={{ fontSize: '0.75rem', color: '#38bdf8', background: '#0f172a', padding: '1px 6px', borderRadius: '4px' }}>
                                                            {atk.attackBonus >= 0 ? `+${atk.attackBonus}` : atk.attackBonus} para acertar
                                                        </span>
                                                        <span style={{ fontSize: '0.75rem', color: '#fca5a5' }}>
                                                            {atk.damage} ({atk.damageType})
                                                        </span>
                                                    </div>
                                                    {atk.description && (
                                                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px', lineHeight: 1.3 }}>
                                                            {atk.description}
                                                        </div>
                                                    )}
                                                </div>

                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <button
                                                        onClick={() => onRoll && onRoll(`Ataque de ${atk.name} (${activeCompanion.name})`, atk.attackBonus)}
                                                        style={{
                                                            background: '#0284c7',
                                                            color: '#fff',
                                                            border: 'none',
                                                            borderRadius: '4px',
                                                            padding: '6px 10px',
                                                            fontSize: '0.75rem',
                                                            fontWeight: 'bold',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '4px'
                                                        }}
                                                        title="Rolar d20 + bônus de ataque"
                                                    >
                                                        <Dices size={14} />
                                                        <span>Rolar Ataque</span>
                                                    </button>

                                                    {onRollDiceFormula && (
                                                        <button
                                                            onClick={() => onRollDiceFormula(atk.damage, `Dano de ${atk.name} (${activeCompanion.name})`)}
                                                            style={{
                                                                background: '#e11d48',
                                                                color: '#fff',
                                                                border: 'none',
                                                                borderRadius: '4px',
                                                                padding: '6px 10px',
                                                                fontSize: '0.75rem',
                                                                fontWeight: 'bold',
                                                                cursor: 'pointer',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '4px'
                                                            }}
                                                            title="Rolar dados de dano"
                                                        >
                                                            <span>Rolar Dano</span>
                                                        </button>
                                                    )}

                                                    <button
                                                        onClick={() => {
                                                            const nextAttacks = activeCompanion.attacks.filter((_, i) => i !== index);
                                                            updateActiveCompanion({ attacks: nextAttacks });
                                                        }}
                                                        style={{
                                                            background: 'none',
                                                            border: 'none',
                                                            color: '#64748b',
                                                            cursor: 'pointer',
                                                            padding: '4px'
                                                        }}
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* FEATURES & SPECIAL TRAITS */}
                                <div style={{ background: '#161b28', border: '1px solid #283348', borderRadius: '8px', padding: '14px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Sparkles size={18} color="#eab308" />
                                            <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#f8fafc' }}>
                                                Características Especiais & Habilidades
                                            </span>
                                        </div>

                                        <button
                                            onClick={() => {
                                                const nextFeatures: CompanionFeature[] = [
                                                    ...activeCompanion.features,
                                                    { name: 'Nova Habilidade', description: 'Descrição dos efeitos da habilidade.' }
                                                ];
                                                updateActiveCompanion({ features: nextFeatures });
                                            }}
                                            style={{
                                                background: '#1e293b',
                                                border: '1px solid #334155',
                                                color: '#cbd5e1',
                                                borderRadius: '4px',
                                                padding: '4px 8px',
                                                fontSize: '0.75rem',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px'
                                            }}
                                        >
                                            <Plus size={13} />
                                            <span>Adicionar Habilidade</span>
                                        </button>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {activeCompanion.features.map((feat, index) => (
                                            <div
                                                key={index}
                                                style={{
                                                    background: '#0d111a',
                                                    border: '1px solid #232d40',
                                                    borderRadius: '6px',
                                                    padding: '10px 12px'
                                                }}
                                            >
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                    <span style={{ fontWeight: 'bold', fontSize: '0.88rem', color: '#f1c40f' }}>
                                                        {feat.name}
                                                    </span>
                                                    <button
                                                        onClick={() => {
                                                            const nextFeatures = activeCompanion.features.filter((_, i) => i !== index);
                                                            updateActiveCompanion({ features: nextFeatures });
                                                        }}
                                                        style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '2px' }}
                                                    >
                                                        <Trash2 size={13} />
                                                    </button>
                                                </div>
                                                <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.4 }}>
                                                    {feat.description}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
};
