import React from 'react';
import { SKILL_RULES } from './data/rules';

export const SkillDescriptionPreview: React.FC<{ defaultText: string, hoveredSkill: string | null }> = ({ defaultText, hoveredSkill }) => {
    const rule = hoveredSkill ? SKILL_RULES[hoveredSkill] : null;

    if (!rule) {
        return <div className="info-box" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', fontStyle: 'italic' }}>{defaultText}</div>
    }

    return (
        <div className="info-box animate-fade" style={{ height: '100%' }}>
            <h4 style={{ color: '#c5a059', borderBottom: '1px solid #444', paddingBottom: '5px' }}>{rule.name} ({rule.attribute.toUpperCase()})</h4>
            <p style={{ marginTop: '10px', lineHeight: '1.5' }}>{rule.description}</p>

            <div style={{ marginTop: '15px' }}>
                <strong>Exemplos de uso:</strong>
                <ul style={{ marginTop: '5px', paddingLeft: '20px', color: '#ccc' }}>
                    {rule.examples.map((ex, i) => <li key={i}>{ex}</li>)}
                </ul>
            </div>
        </div>
    );
};
