import React from 'react';
import { type ClassData } from '../data/classes';
import './ClassProgression.css';

interface ClassProgressionProps {
    classData: ClassData;
    onClose: () => void;
}

export const ClassProgression: React.FC<ClassProgressionProps> = ({ classData, onClose }) => {
    // Helper to calculate proficiency bonus based on level
    const getProficiencyBonus = (level: number) => {
        return Math.ceil(1 + (level / 4));
    };

    const levels = Array.from({ length: 20 }, (_, i) => i + 1);

    return (
        <div className="class-progression-overlay" onClick={onClose}>
            <div className="class-progression-modal" onClick={e => e.stopPropagation()}>
                <div className="class-progression-header">
                    <h2>Progressão: {classData.name}</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <div className="class-progression-content">
                    <table className="progression-table">
                        <thead>
                            <tr>
                                <th className="level-col">Nível</th>
                                <th className="pb-col">Bônus de Prof.</th>
                                <th>Características de Classe</th>
                            </tr>
                        </thead>
                        <tbody>
                            {levels.map(level => {
                                const features = classData.features.filter(f => f.level === level);
                                const pb = getProficiencyBonus(level);

                                return (
                                    <tr key={level} className={features.length === 0 ? 'empty-level' : ''}>
                                        <td className="level-col">{level}</td>
                                        <td className="pb-col">+{pb}</td>
                                        <td className="features-col">
                                            {features.length > 0 ? (
                                                <div className="features-list">
                                                    {features.map((feature, idx) => (
                                                        <div key={idx} className="feature-item">
                                                            <span className="feature-name">{feature.name}</span>
                                                            <span className="feature-desc">{feature.description}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="no-features">-</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
