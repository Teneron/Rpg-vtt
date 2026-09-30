import React from 'react';
import type { Skill } from './characterTypes';
import './SkillsList.css';

interface SkillsListProps {
    skills: Skill[];
    onToggleProficiency: (id: string) => void;
    onRoll?: (name: string, modifier: number) => void;
}

export const SkillsList: React.FC<SkillsListProps> = ({ skills, onToggleProficiency, onRoll }) => {
    return (
        <div className="skills-block">
            <h3>Perícias</h3>
            <ul className="skills-list">
                {(skills || []).map((skill) => (
                    <li key={skill.name} className="skill-row">
                        <div
                            className="skill-prof-toggle"
                            onClick={() => onToggleProficiency(skill.name)}
                            title="Clique para alternar: Nada -> Proficiente -> Especialista"
                        >
                            <div className={`prof-dot ${skill.proficient ? 'active' : ''} ${skill.expertise ? 'expert' : ''}`} />
                        </div>

                        <span
                            className="skill-val"
                            onClick={() => onRoll?.(skill.name, skill.value)}
                            style={{ cursor: 'pointer', textDecoration: 'underline' }}
                            title="Clique para Rolar"
                        >
                            {skill.value >= 0 ? '+' : ''}{skill.value}
                        </span>

                        <span className="skill-name">{skill.name}</span>
                        <span className="skill-attr">({skill.attribute.substring(0, 3).toUpperCase()})</span>
                    </li>
                ))}
                {(skills || []).length === 0 && <li className="empty-msg">Nenhuma perícia calculada</li>}
            </ul>
        </div>
    );
};
