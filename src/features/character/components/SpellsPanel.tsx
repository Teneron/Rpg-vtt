import React, { useState, useMemo } from 'react';
import type { Character } from '../characterTypes';
import type { Spell } from '../data/spells';
import { useChat } from '../../chat/ChatContext';
import './SpellsPanel.css'; // New CSS file for book-style

interface SpellsPanelProps {
    character: Character;
    onUpdateSlot: (level: number, used: number) => void;
    onOpenManage?: () => void;
}

export const SpellsPanel: React.FC<SpellsPanelProps> = ({ character, onUpdateSlot, onOpenManage }) => {
    const { sendMessage } = useChat();
    const [expandedSpell, setExpandedSpell] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeLevel, setActiveLevel] = useState<number>(0);

    // Filter spells by search query
    const filteredSpells = useMemo(() => {
        if (!searchQuery) return character.spells;
        return character.spells.filter(s =>
            s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.school.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [character.spells, searchQuery]);

    // Group by level
    const spellsByLevel = useMemo(() => {
        const groups: Record<number, Spell[]> = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [] };
        filteredSpells.forEach(spell => {
            if (!groups[spell.level]) groups[spell.level] = [];
            groups[spell.level].push(spell);
        });
        return groups;
    }, [filteredSpells]);

    const toggleExpand = (id: string) => {
        setExpandedSpell(prev => prev === id ? null : id);
    };

    const handleSlotClick = (level: number, index: number) => {
        const slots = character.spellSlots[level];
        if (!slots) return;
        const newUsed = index < slots.used ? index : index + 1;
        onUpdateSlot(level, newUsed);
    };

    const handleCast = (spell: Spell) => {
        // Simple Cast: Deduct Slot if leveled, Announce to chat
        // Level 0 (Cantrips) usually don't consume slots
        if (spell.level > 0) {
            const slots = character.spellSlots[spell.level];
            if (slots && slots.used < slots.max) {
                onUpdateSlot(spell.level, slots.used + 1);
            } else if (slots && slots.used >= slots.max) {
                // No slots left warning? Allowed for now (maybe upcasting?)
            }
        }

        // Send to Chat
        sendMessage(
            `conjurou **${spell.name}**!`,
            'system' // Or 'spell' type if we had it
        );
        // We could send a rich embed, but text is fine for now.
        sendMessage(spell.description, 'text');
    };

    const handleAnnounce = (spell: Spell) => {
        sendMessage(
            `compartilhou os detalhes de **${spell.name}**: \n\n_${spell.description}_`,
            'text'
        );
    };

    // Determine max spell level known to show relevant tabs could be dynamic, 
    // but for now we iterate a fixed range or check content directly in the render loop.

    const renderSpellCard = (spell: Spell) => (
        <div
            key={spell.id}
            className={`spell-card-book ${expandedSpell === spell.id ? 'expanded' : ''}`}
            onClick={() => toggleExpand(spell.id)}
        >
            <div className="spell-header-book">
                <span className="spell-name-book">{spell.name}</span>
                <span className="spell-meta-book">
                    {spell.school} {spell.level === 0 ? 'Truque' : `Nv ${spell.level}`}
                </span>
            </div>

            <div className="spell-mini-info">
                <span>⏱ {spell.castingTime}</span>
                <span>📏 {spell.range}</span>
            </div>

            {expandedSpell === spell.id && (
                <div className="spell-body-book animate-slide-down" onClick={e => e.stopPropagation()}>
                    <div className="spell-stats-grid">
                        <div className="stat-entry">
                            <span className="label">Tempo de Conjuração:</span>
                            <span className="value">{spell.castingTime}</span>
                        </div>
                        <div className="stat-entry">
                            <span className="label">Alcance:</span>
                            <span className="value">{spell.range}</span>
                        </div>
                        <div className="stat-entry">
                            <span className="label">Componentes:</span>
                            <span className="value">{spell.components}</span>
                        </div>
                        <div className="stat-entry">
                            <span className="label">Duração:</span>
                            <span className="value">{spell.duration}</span>
                        </div>
                    </div>

                    <div className="spell-description-book">
                        {spell.description}
                    </div>

                    <div className="spell-actions-book">
                        <button className="book-btn simple" onClick={() => handleAnnounce(spell)}>
                            📜 Mostrar no Chat
                        </button>
                        <button className="book-btn magic" onClick={() => handleCast(spell)}>
                            ✨ Conjurar {spell.level > 0 ? `(Gastar Slot ${spell.level})` : '(Truque)'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div className="spells-panel-container">
            {/* Search Bar & Manage Button */}
            <div className="spells-search-bar" style={{ display: 'flex', gap: '10px' }}>
                <input
                    type="text"
                    placeholder="Buscar magia por nome ou escola..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="book-input"
                    style={{ flex: 1 }}
                />
                {onOpenManage && (
                    <button
                        onClick={onOpenManage}
                        className="btn-glow"
                        style={{ padding: '5px 15px', whiteSpace: 'nowrap', height: '40px' }}
                    >
                        + Magias
                    </button>
                )}
            </div>

            {/* Level Tabs */}
            <div className="level-tabs">
                {[0, 1, 2, 3, 4, 5].map(lvl => {
                    // Only show tabs if we have spells or slots for it (or it's low level)
                    if (lvl > 3 && !spellsByLevel[lvl]?.length && !character.spellSlots[lvl]?.max) return null;

                    return (
                        <button
                            key={lvl}
                            className={`tab-btn ${activeLevel === lvl ? 'active' : ''}`}
                            onClick={() => setActiveLevel(lvl)}
                        >
                            {lvl === 0 ? 'Truques' : `Nível ${lvl}`}
                        </button>
                    );
                })}
            </div>

            {/* Active Level Content */}
            <div className="level-content-book">
                <div className="level-header-row">
                    <h3>{activeLevel === 0 ? 'Truques (0)' : `Nível ${activeLevel}`}</h3>
                    {activeLevel > 0 && character.spellSlots[activeLevel]?.max > 0 && (
                        <div className="slots-visualizer">
                            <span className="slots-label">Slots:</span>
                            {Array.from({ length: character.spellSlots[activeLevel].max }).map((_, i) => (
                                <div
                                    key={i}
                                    className={`slot-checkbox ${i < character.spellSlots[activeLevel].used ? 'used' : ''}`}
                                    onClick={() => handleSlotClick(activeLevel, i)}
                                    title={i < character.spellSlots[activeLevel].used ? "Recuperar" : "Gastar"}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div className="spells-grid-book">
                    {spellsByLevel[activeLevel]?.length > 0 ? (
                        spellsByLevel[activeLevel].map(renderSpellCard)
                    ) : (
                        <div className="empty-book-msg">Nenhuma magia conhecida neste círculo.</div>
                    )}
                </div>
            </div>

            {/* Stats Footer (DC/Attack) - Keeping it minimal or at top? */}
            <div className="spellbook-footer-stats">
                <div className="footer-stat">
                    <span className="fs-label">CD de Resistência</span>
                    <span className="fs-val">{character.spellSaveDC}</span>
                </div>
                <div className="footer-stat">
                    <span className="fs-label">Bônus de Ataque</span>
                    <span className="fs-val">+{character.spellAttackBonus}</span>
                </div>
            </div>
        </div>
    );
};
