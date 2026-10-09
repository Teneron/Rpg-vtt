import React, { useState } from 'react';
import type { Character, ClassFeature } from '../characterTypes';
import { useChat } from '../../chat/ChatContext';
import { Table, Scroll } from 'lucide-react';
import './AbilitiesPanel.css';

interface AbilitiesPanelProps {
    character: Character;
    onOpenProgression?: () => void;
}

export const AbilitiesPanel: React.FC<AbilitiesPanelProps> = ({ character, onOpenProgression }) => {
    const { sendMessage } = useChat();
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const toggleExpand = (name: string) => {
        setExpandedId(prev => prev === name ? null : name);
    };

    const handleAnnounce = (feature: ClassFeature) => {
        sendMessage(
            `destaca sua habilidade **${feature.name}**: \n\n_${feature.description}_`,
            'text'
        );
    };

    // Group features if needed, for now flat list sorted by level
    const sortedFeatures = [...character.features].sort((a, b) => a.level - b.level);

    return (
        <div className="abilities-panel-book">
            <div className="book-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>Habilidades de Classe & Raça</h3>
                {onOpenProgression && (
                    <button
                        className="book-btn simple"
                        onClick={onOpenProgression}
                        title="Ver Tabela Oficial de Progressão de Níveis 1 a 20"
                        style={{ fontSize: '0.78rem', padding: '4px 8px', color: '#c5a059', borderColor: '#c5a059', display: 'flex', alignItems: 'center', gap: '5px' }}
                    >
                        <Table size={13} />
                        <span>Progressão 1–20</span>
                    </button>
                )}
            </div>

            <div className="abilities-list">
                {sortedFeatures.length === 0 && (
                    <div className="empty-book-msg">Nenhuma habilidade registrada.</div>
                )}

                {sortedFeatures.map((feature, index) => {
                    // Use name + index as key just in case of duplicates
                    const key = `${feature.name}-${index}`;
                    const isExpanded = expandedId === key;

                    return (
                        <div
                            key={key}
                            className={`ability-card-book ${isExpanded ? 'expanded' : ''}`}
                            onClick={() => toggleExpand(key)}
                        >
                            <div className="ability-header">
                                <span className="ability-name">{feature.name}</span>
                                <span className="ability-meta">
                                    {feature.level === 0 ? 'Início' : `Nível ${feature.level}`}
                                    {feature.type && ` • ${feature.type === 'passive' ? 'Passiva' :
                                        feature.type === 'action' ? 'Ação' :
                                            feature.type === 'bonus_action' ? 'Ação Bônus' : 'Reação'}`}
                                </span>
                            </div>

                            {isExpanded && (
                                <div className="ability-body animate-slide-down" onClick={e => e.stopPropagation()}>
                                    <div className="ability-description">
                                        {feature.description}
                                    </div>
                                    <div className="ability-actions">
                                        <button className="book-btn simple" onClick={() => handleAnnounce(feature)} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            <Scroll size={13} />
                                            <span>Anunciar no Chat</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
