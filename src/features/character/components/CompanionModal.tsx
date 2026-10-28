import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import type { Character, Companion } from '../characterTypes';
import {
    COMPANION_PRESETS,
    instantiateCompanion,
    checkMeetsRequirement,
    type CompanionPreset
} from '../data/companionPresets';
import { useMap } from '../../map/MapContext';
import { useCombat } from '../../combat/CombatContext';
import {
    PawPrint, Shield, Heart, Swords, Plus, Trash2,
    Eye, Sparkles, X, Check, Dices, ChevronRight, AlertCircle, Info, Lock
} from 'lucide-react';

interface CompanionModalProps {
    character: Character;
    onUpdateCharacter: (updates: Partial<Character>) => void;
    onClose: () => void;
    onRoll?: (title: string, modifier: number) => void;
    onRollDiceFormula?: (formula: string, title: string) => void;
    isGM?: boolean;
}

export const CompanionModal: React.FC<CompanionModalProps> = ({
    character,
    onUpdateCharacter,
    onClose,
    onRoll,
    onRollDiceFormula,
    isGM = false
}) => {
    const companions = character.companions || [];
    const [selectedCompanionId, setSelectedCompanionId] = useState<string>(
        companions[0]?.id || ''
    );
    const [showPresetPicker, setShowPresetPicker] = useState(companions.length === 0);
    const [categoryFilter, setCategoryFilter] = useState<'all' | 'beast_master' | 'chain_warlock' | 'find_familiar' | 'steed' | 'market_animal'>('all');

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

    // Preset addition strictly following official rules
    const handleSelectPreset = (preset: CompanionPreset) => {
        const check = checkMeetsRequirement(character, preset);
        if (!check.meets && !isGM) {
            const proceed = confirm(
                `Aviso de Regras Oficiais do D&D:\n\n${check.reason}\n\nO jogador só pode ter este companheiro com a classe/magia exigida ou autorização expressa do Mestre.\n\nDeseja prosseguir mesmo assim?`
            );
            if (!proceed) return;
        }

        const wisMod = character.attributes?.wis?.modifier ?? 2;
        const charLevel = character.level || 1;
        const profBonus = character.proficiencyBonus || 2;

        const newComp = instantiateCompanion(preset.id, charLevel, wisMod, profBonus);
        const nextList = [...companions, newComp];
        saveCompanions(nextList);
        setSelectedCompanionId(newComp.id);
        setShowPresetPicker(false);
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
            // Spawn near character token or safe map position
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

    // HP Adjustments (Taking Damage or Healing in play)
    const handleAdjustHp = (delta: number) => {
        if (!activeCompanion) return;
        const current = activeCompanion.hp.current;
        const max = activeCompanion.hp.max;
        const nextVal = Math.max(0, Math.min(max, current + delta));
        updateActiveCompanion({
            hp: { ...activeCompanion.hp, current: nextVal }
        });
    };

    // Filter presets
    const filteredPresets = COMPANION_PRESETS.filter(p => {
        if (categoryFilter === 'all') return true;
        return p.category === categoryFilter;
    });

    const modalContent = (
        <div
            className="modal-overlay companion-modal-overlay"
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
                zIndex: 100050,
                padding: '16px'
            }}
            onClick={onClose}
        >
            <div
                className="modal-content animate-scale-up"
                style={{
                    background: '#12141c',
                    width: '95%',
                    maxWidth: '940px',
                    maxHeight: '92vh',
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
                        padding: '14px 20px',
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
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#f8fafc', fontWeight: 700, letterSpacing: '0.5px' }}>
                                    Pets, Familiares & Montarias (Regras Oficiais D&D)
                                </h2>
                                <span style={{ fontSize: '0.7rem', background: '#0284c7', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>
                                    PHB 2024 / 5e
                                </span>
                            </div>
                            <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: '#94a3b8' }}>
                                Estatísticas e opções vinculadas estritamente aos recursos de classe e magias do livro
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
                            <span>Adicionar Companheiro Oficial</span>
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
                            width: '230px',
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
                            Companheiros Ativos ({companions.length})
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
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', background: '#12141c', padding: '18px 20px' }}>
                        {showPresetPicker ? (
                            /* OFFICIAL PRESET PICKER VIEW */
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#38bdf8' }}>
                                            Companheiros Oficiais do Livro do Jogador (PHB)
                                        </h3>
                                        <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>
                                            Selecione o modelo concedido pela sua classe, subclasse ou magia. As estatísticas e fórmulas são travadas nas regras do D&D.
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
                                                padding: '4px 10px',
                                                cursor: 'pointer',
                                                fontSize: '0.8rem'
                                            }}
                                        >
                                            Voltar à Ficha
                                        </button>
                                    )}
                                </div>

                                {/* CATEGORY FILTER BUTTONS */}
                                <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', marginBottom: '16px', paddingBottom: '4px' }}>
                                    {[
                                        { id: 'all', label: 'Todos Oficiais' },
                                        { id: 'beast_master', label: 'Mestre das Bestas (Guardião)' },
                                        { id: 'chain_warlock', label: 'Pacto da Corrente (Bruxo)' },
                                        { id: 'find_familiar', label: 'Encontrar Familiar' },
                                        { id: 'steed', label: 'Montaria (Paladino)' },
                                        { id: 'market_animal', label: 'Mercado (PHB Cap. 5)' }
                                    ].map(f => (
                                        <button
                                            key={f.id}
                                            onClick={() => setCategoryFilter(f.id as any)}
                                            style={{
                                                background: categoryFilter === f.id ? '#0284c7' : '#161b28',
                                                color: categoryFilter === f.id ? '#fff' : '#94a3b8',
                                                border: categoryFilter === f.id ? '1px solid #38bdf8' : '1px solid #283348',
                                                borderRadius: '6px',
                                                padding: '4px 10px',
                                                fontSize: '0.75rem',
                                                fontWeight: 'bold',
                                                cursor: 'pointer',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            {f.label}
                                        </button>
                                    ))}
                                </div>

                                {/* PRESET CARDS GRID */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '14px' }}>
                                    {filteredPresets.map(preset => {
                                        const reqCheck = checkMeetsRequirement(character, preset);

                                        return (
                                            <div
                                                key={preset.id}
                                                onClick={() => handleSelectPreset(preset)}
                                                style={{
                                                    background: '#161b28',
                                                    border: reqCheck.meets ? '1px solid #1e3a5f' : '1px solid #283348',
                                                    borderRadius: '10px',
                                                    padding: '14px',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    justifyContent: 'space-between',
                                                    position: 'relative'
                                                }}
                                                onMouseEnter={e => {
                                                    e.currentTarget.style.borderColor = reqCheck.meets ? '#38bdf8' : '#eab308';
                                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                                }}
                                                onMouseLeave={e => {
                                                    e.currentTarget.style.borderColor = reqCheck.meets ? '#1e3a5f' : '#283348';
                                                    e.currentTarget.style.transform = 'translateY(0)';
                                                }}
                                            >
                                                <div>
                                                    {/* TOP AVATAR & NAME */}
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                                        <div
                                                            style={{
                                                                width: '44px',
                                                                height: '44px',
                                                                borderRadius: '50%',
                                                                overflow: 'hidden',
                                                                border: reqCheck.meets ? '2px solid #38bdf8' : '2px solid #475569',
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

                                                    {/* REQUIREMENT BADGE */}
                                                    <div
                                                        style={{
                                                            fontSize: '0.72rem',
                                                            borderRadius: '4px',
                                                            padding: '4px 8px',
                                                            marginBottom: '8px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '5px',
                                                            background: reqCheck.meets ? 'rgba(34, 197, 94, 0.12)' : 'rgba(234, 179, 8, 0.1)',
                                                            border: reqCheck.meets ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(234, 179, 8, 0.3)',
                                                            color: reqCheck.meets ? '#4ade80' : '#facc15'
                                                        }}
                                                    >
                                                        {reqCheck.meets ? <Check size={12} /> : <AlertCircle size={12} />}
                                                        <span>{preset.requiredSource}</span>
                                                    </div>

                                                    <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.4, margin: '0 0 10px' }}>
                                                        {preset.description}
                                                    </p>

                                                    <div style={{ display: 'flex', gap: '6px', fontSize: '0.72rem', color: '#cbd5e1', marginBottom: '8px', flexWrap: 'wrap' }}>
                                                        <span style={{ background: '#0f172a', padding: '2px 6px', borderRadius: '4px' }}>
                                                            Tam: {preset.size}
                                                        </span>
                                                        <span style={{ background: '#0f172a', padding: '2px 6px', borderRadius: '4px' }}>
                                                            Vel: {preset.speed}
                                                        </span>
                                                        <span style={{ background: '#0f172a', padding: '2px 6px', borderRadius: '4px' }}>
                                                            CA: {preset.baseAc}{preset.acAddsPb ? ' + PB' : ''}
                                                        </span>
                                                        {preset.canAttack === false && (
                                                            <span style={{ background: '#3b0764', color: '#d8b4fe', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>
                                                                Apoio (Não ataca)
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <button
                                                    style={{
                                                        marginTop: '8px',
                                                        background: reqCheck.meets ? '#0284c7' : '#334155',
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
                                                    <span>{reqCheck.meets ? 'Adicionar à Ficha' : 'Adicionar com Autorização'}</span>
                                                    <ChevronRight size={14} />
                                                </button>
                                            </div>
                                        );
                                    })}
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
                                                <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#f8fafc', fontWeight: 'bold' }}>
                                                    {activeCompanion.name}
                                                </h3>
                                                <span title="Estatísticas protegidas pelas regras oficiais do D&D" style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.72rem', background: '#0f172a', color: '#38bdf8', border: '1px solid #1e293b', padding: '2px 6px', borderRadius: '4px' }}>
                                                    <Lock size={11} /> Regra Oficial
                                                </span>
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

                                {/* VITALS & COMBAT STATS ROW */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
                                    {/* CA (ARMOR CLASS - COM FÓRMULA OFICIAL E AJUSTE MANUAL) */}
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
                                                <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <span>Classe de Armadura</span>
                                                    {activeCompanion.acOverride !== undefined && (
                                                        <span style={{ fontSize: '0.65rem', color: '#f59e0b', background: '#3b2505', padding: '1px 5px', borderRadius: '3px', fontWeight: 'bold' }}>
                                                            Ajustado
                                                        </span>
                                                    )}
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                                                    <span style={{ fontSize: '1.4rem', fontWeight: 'bold', color: activeCompanion.acOverride !== undefined ? '#f59e0b' : '#f8fafc' }}>
                                                        {activeCompanion.ac}
                                                    </span>
                                                    {activeCompanion.acBreakdown && (
                                                        <span style={{ fontSize: '0.75rem', color: '#38bdf8' }} title={activeCompanion.acBreakdown}>
                                                            ({activeCompanion.acBreakdown})
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', gap: '6px' }}>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const current = activeCompanion.ac;
                                                    const res = prompt(
                                                        `Ajustar CA do companheiro (Barda / Magia / Armadura Arcana / Bônus):\nValor atual: ${current}`,
                                                        String(current)
                                                    );
                                                    if (res === null) return;
                                                    const val = parseInt(res, 10);
                                                    if (!isNaN(val) && val > 0) {
                                                        updateActiveCompanion({ acOverride: val, ac: val });
                                                    }
                                                }}
                                                style={{
                                                    background: '#1e293b',
                                                    border: '1px solid #334155',
                                                    color: '#38bdf8',
                                                    borderRadius: '4px',
                                                    padding: '4px 8px',
                                                    fontSize: '0.75rem',
                                                    cursor: 'pointer'
                                                }}
                                                title="Ajustar CA (ex: se equipou barda ou recebeu magia)"
                                            >
                                                Ajustar
                                            </button>
                                            {activeCompanion.acOverride !== undefined && (
                                                <button
                                                    type="button"
                                                    onClick={() => updateActiveCompanion({ acOverride: undefined })}
                                                    style={{
                                                        background: '#1e293b',
                                                        border: '1px solid #334155',
                                                        color: '#94a3b8',
                                                        borderRadius: '4px',
                                                        padding: '4px 8px',
                                                        fontSize: '0.75rem',
                                                        cursor: 'pointer'
                                                    }}
                                                    title="Restaurar fórmula padrão do livro"
                                                >
                                                    Reset
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* HP (VITALITY - DANO E CURA EM JOGO) */}
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
                                                <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>Pontos de Vida</span>
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

                                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', marginTop: '2px', flexWrap: 'wrap' }}>
                                            <button onClick={() => handleAdjustHp(-5)} style={{ background: '#334155', color: '#fff', border: 'none', borderRadius: '4px', padding: '2px 8px', fontSize: '0.75rem', cursor: 'pointer' }}>-5</button>
                                            <button onClick={() => handleAdjustHp(-1)} style={{ background: '#334155', color: '#fff', border: 'none', borderRadius: '4px', padding: '2px 8px', fontSize: '0.75rem', cursor: 'pointer' }}>-1</button>
                                            <button onClick={() => handleAdjustHp(+1)} style={{ background: '#334155', color: '#fff', border: 'none', borderRadius: '4px', padding: '2px 8px', fontSize: '0.75rem', cursor: 'pointer' }}>+1</button>
                                            <button onClick={() => handleAdjustHp(+5)} style={{ background: '#334155', color: '#fff', border: 'none', borderRadius: '4px', padding: '2px 8px', fontSize: '0.75rem', cursor: 'pointer' }}>+5</button>
                                            <button onClick={() => handleAdjustHp(999)} style={{ background: '#15803d', color: '#fff', border: 'none', borderRadius: '4px', padding: '2px 8px', fontSize: '0.75rem', cursor: 'pointer' }} title="Descanso Longo (Curar Tudo)">Curar Total</button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const cur = activeCompanion.hp.max;
                                                    const res = prompt(`Ajustar Pontos de Vida Máximos:\nValor atual: ${cur}`, String(cur));
                                                    if (res === null) return;
                                                    const val = parseInt(res, 10);
                                                    if (!isNaN(val) && val > 0) {
                                                        updateActiveCompanion({
                                                            hp: {
                                                                ...activeCompanion.hp,
                                                                max: val,
                                                                current: Math.min(activeCompanion.hp.current, val)
                                                            }
                                                        });
                                                    }
                                                }}
                                                style={{ background: '#1e293b', color: '#94a3b8', border: '1px solid #334155', borderRadius: '4px', padding: '2px 8px', fontSize: '0.75rem', cursor: 'pointer' }}
                                                title="Ajustar PV Máximo"
                                            >
                                                Editar Máx
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* ATTRIBUTES GRID */}
                                <div style={{ background: '#161b28', border: '1px solid #283348', borderRadius: '8px', padding: '14px' }}>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
                                        <span>Atributos & Salvaguardas (Clique para rolar teste)</span>
                                        <span style={{ color: '#64748b' }}><Lock size={11} style={{ verticalAlign: 'middle' }} /> Travado pelo Livro</span>
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

                                {/* ATTACKS & COMBAT ACTIONS */}
                                <div style={{ background: '#161b28', border: '1px solid #283348', borderRadius: '8px', padding: '14px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Swords size={18} color="#f43f5e" />
                                            <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#f8fafc' }}>
                                                Ações de Combate Oficiais
                                            </span>
                                        </div>
                                    </div>

                                    {activeCompanion.attacks.length === 0 ? (
                                        <div
                                            style={{
                                                padding: '12px 14px',
                                                background: '#1e2433',
                                                borderRadius: '6px',
                                                border: '1px solid #334155',
                                                color: '#cbd5e1',
                                                fontSize: '0.82rem',
                                                lineHeight: 1.5,
                                                display: 'flex',
                                                alignItems: 'flex-start',
                                                gap: '10px'
                                            }}
                                        >
                                            <Info size={18} color="#38bdf8" style={{ flexShrink: 0, marginTop: '2px' }} />
                                            <div>
                                                <strong style={{ color: '#38bdf8' }}>Regra Oficial do D&D (Livro do Jogador / PHB):</strong>
                                                <p style={{ margin: '4px 0 0', color: '#94a3b8' }}>
                                                    Familiares comuns <strong>não realizam jogadas de ataque</strong> em combate. Eles operam no turno usando as ações:
                                                    <br />• <strong>Ajudar (Help):</strong> Concede Vantagem na próxima jogada de ataque de você ou um aliado contra um alvo.
                                                    <br />• <strong>Sobrevoo / Flyby:</strong> Voa para perto, ajuda e se afasta sem sofrer ataques de oportunidade.
                                                    <br />• <strong>Descarregar Magias:</strong> Conjuradores podem transmitir magias com alcance de toque através do familiar.
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
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
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* FEATURES & SPECIAL TRAITS */}
                                <div style={{ background: '#161b28', border: '1px solid #283348', borderRadius: '8px', padding: '14px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                                        <Sparkles size={18} color="#eab308" />
                                        <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#f8fafc' }}>
                                            Características Especiais & Habilidades (Livro de Regras)
                                        </span>
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
                                                <span style={{ fontWeight: 'bold', fontSize: '0.88rem', color: '#f1c40f' }}>
                                                    {feat.name}
                                                </span>
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

    if (typeof document === 'undefined') return null;
    return createPortal(modalContent, document.body);
};
