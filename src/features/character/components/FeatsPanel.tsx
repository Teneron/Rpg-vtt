import React, { useState } from 'react';
import type { Character } from '../characterTypes';
import type { Feat } from '../data/feats';
import { useChat } from '../../chat/ChatContext';
import { Scroll } from 'lucide-react';
import './FeatsPanel.css';


interface FeatsPanelProps {
    character: Character;
}

export const FeatsPanel: React.FC<FeatsPanelProps> = ({ character }) => {
    const { sendMessage } = useChat();
    const [expandedFeat, setExpandedFeat] = useState<string | null>(null);

    const toggleExpand = (id: string) => {
        setExpandedFeat(prev => prev === id ? null : id);
    };

    const handleAnnounce = (feat: Feat) => {
        sendMessage(
            `mostra seu talento **${feat.name}**: \n\n_${feat.description}_`,
            'text'
        );
    };

    return (
        <div className="feats-panel-book">
            <div className="book-header-row">
                <h3>Talentos e Feitos</h3>
            </div>

            <div className="feats-list-book">
                {character.feats.length === 0 && (
                    <div className="empty-book-msg">
                        Nenhum talento adquirido. Aventure-se ou treine para ganhar novos poderes.
                    </div>
                )}

                {character.feats.map((feat, i) => (
                    <div
                        key={i}
                        className={`feat-card-book ${expandedFeat === feat.id ? 'expanded' : ''}`}
                        onClick={() => toggleExpand(feat.id)}
                    >
                        <div className="feat-header-book">
                            <span className="feat-name-book">{feat.name}</span>
                            {feat.prerequisite && <span className="feat-meta-book">Pré-req: {feat.prerequisite}</span>}
                        </div>

                        {expandedFeat === feat.id ? (
                            <div className="feat-body-book animate-slide-down" onClick={e => e.stopPropagation()}>
                                <p className="feat-desc-book full">{feat.descriptionFull || feat.description}</p>
                                <div className="feat-actions-book">
                                    <button className="book-btn simple" onClick={() => handleAnnounce(feat)} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <Scroll size={13} />
                                        <span>Anunciar</span>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <p className="feat-desc-book short">{feat.description}</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
