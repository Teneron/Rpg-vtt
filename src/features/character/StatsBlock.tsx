import React from 'react';
import type { Attribute } from './characterTypes';
import './StatsBlock.css';

interface StatsBlockProps {
    attributes: Record<string, Attribute>;
    onUpdate: (key: string, value: number) => void;
    onToggleSave: (key: string) => void;
    onRoll?: (name: string, modifier: number) => void;
}

export const StatsBlock: React.FC<StatsBlockProps> = ({ attributes, onUpdate, onToggleSave, onRoll }) => {
    return (
        <div className="stats-block">
            <h3>Atributos & Salvaguardas</h3>
            <div className="stats-grid">
                {Object.entries(attributes || {}).map(([key, attr]) => (
                    <div key={key} className="stat-card">
                        <div className="stat-header">
                            <span className="stat-name">{attr.name}</span>
                            <span className="stat-abbr">{key.toUpperCase()}</span>
                        </div>

                        <div className="stat-value-container">
                            <input
                                type="number"
                                value={attr.value}
                                onChange={(e) => onUpdate(key, parseInt(e.target.value) || 10)}
                                className="stat-input"
                            />
                            <div
                                className="stat-modifier"
                                onClick={() => onRoll?.(attr.name, attr.modifier)}
                                style={{ cursor: 'pointer' }}
                                title="Clique para Rolar"
                            >
                                {attr.modifier >= 0 ? '+' : ''}{attr.modifier}
                            </div>
                        </div>

                        <label className="save-toggle" title="Proficiência em Salvaguarda">
                            <input
                                type="checkbox"
                                checked={attr.saveProficiency}
                                onChange={() => onToggleSave(key)}
                            />
                            <span className="save-label">Save</span>
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
};
