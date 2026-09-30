
import React from 'react';
import type { Character } from '../characterTypes';

interface BioPanelProps {
    character: Character;
    onUpdateTrait: (field: 'personalityTraits' | 'ideals' | 'bonds' | 'flaws', value: string) => void;
}

export const BioPanel: React.FC<BioPanelProps> = ({ character, onUpdateTrait }) => {
    return (
        <div className="bio-panel" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* PERSONALITY TRAITS */}
            <div className="panel-box traits-box">
                <div className="trait-field">
                    <label>Traços de Personalidade</label>
                    <textarea
                        value={character.personalityTraits || ''}
                        onChange={e => onUpdateTrait('personalityTraits', e.target.value)}
                    />
                </div>
                <div className="trait-field">
                    <label>Ideais</label>
                    <textarea
                        value={character.ideals || ''}
                        onChange={e => onUpdateTrait('ideals', e.target.value)}
                    />
                </div>
                <div className="trait-field">
                    <label>Vínculos</label>
                    <textarea
                        value={character.bonds || ''}
                        onChange={e => onUpdateTrait('bonds', e.target.value)}
                    />
                </div>
                <div className="trait-field">
                    <label>Defeitos</label>
                    <textarea
                        value={character.flaws || ''}
                        onChange={e => onUpdateTrait('flaws', e.target.value)}
                    />
                </div>
            </div>

            {/* FEATURES & TRAITS (Scrollable List) */}
            <div className="panel-box" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h4 className="box-header">Características & Talentos</h4>
                <div className="features-list">
                    {(character.features || []).map((feat, i) => (
                        <div key={i} className="feature-item">
                            <div className="feat-name">
                                {feat.name} <span className="feat-lvl">Lv {feat.level}</span>
                            </div>
                            <div className="feat-desc">{feat.description}</div>
                        </div>
                    ))}
                    {(!character.features || character.features.length === 0) && <span style={{ color: '#666' }}>Nenhum talento.</span>}
                </div>
            </div>

            <style>{`
                .trait-field { margin-bottom: 5px; background: #222; padding: 5px; border-radius: 4px; border: 1px solid #333; }
                .trait-field label { font-size: 0.7rem; text-transform: uppercase; color: #888; display: block; margin-bottom: 2px; }
                .trait-field textarea { 
                    width: 100%; height: 40px; background: transparent; border: none; 
                    color: #eee; font-size: 0.85rem; resize: none; 
                }
                
                .features-list { overflow-y: auto; flex: 1; padding-right: 5px; }
                .feature-item { margin-bottom: 12px; border-bottom: 1px solid #333; padding-bottom: 8px; }
                .feat-name { font-weight: bold; color: #ddd; display: flex; justify-content: space-between; }
                .feat-lvl { font-size: 0.7rem; background: #444; padding: 1px 5px; border-radius: 3px; }
                .feat-desc { font-size: 0.85rem; color: #aaa; margin-top: 4px; line-height: 1.4; }
            `}</style>
        </div>
    );
};
