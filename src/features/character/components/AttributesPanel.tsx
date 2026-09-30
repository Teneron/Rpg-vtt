
import React from 'react';
import type { CharacterAttributes, Skill } from '../characterTypes';
import { calculateProficiencyBonus } from '../characterTypes';

interface AttributesPanelProps {
    attributes: CharacterAttributes;
    skills: Skill[];
    level: number;
    proficiencies: string[];
    languages: string[];
    onUpdateAttribute: (key: string, value: number) => void;
    onToggleSave: (key: string) => void;
    onToggleSkill: (skillName: string) => void;
    onRoll: (name: string, modifier: number) => void;
    isGM?: boolean;
}

export const AttributesPanel: React.FC<AttributesPanelProps> = React.memo(({
    attributes, skills, level, proficiencies, languages,
    onUpdateAttribute, onToggleSave, onToggleSkill, onRoll, isGM
}) => {
    const profBonus = calculateProficiencyBonus(level);
    const passivePerception = 10 + ((skills || []).find(s => s.name === 'Percepção')?.value || 0);

    return (
        <div className="attributes-panel" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* ABILITY SCORES (Vertical) */}
            <div className="ability-scores-column">
                {Object.entries(attributes).map(([key, attr]) => {
                    const labelMap: Record<string, string> = {
                        str: 'FOR', dex: 'DES', con: 'CON',
                        int: 'INT', wis: 'SAB', cha: 'CAR'
                    };
                    return (
                        <div key={key} className="ability-box-premium">
                            <div className="ability-header">
                                {labelMap[key] || key.toUpperCase()}
                            </div>

                            <div className="ability-content">
                                {/* Score */}
                                <div className="score-container">
                                    <div className="score-label">VALOR</div>
                                    {isGM ? (
                                        <input
                                            className="score-val premium"
                                            type="number"
                                            value={attr.value}
                                            onChange={e => onUpdateAttribute(key, Number(e.target.value))}
                                            style={{
                                                width: '40px', background: 'transparent', border: 'none', color: '#aaa',
                                                textAlign: 'center', fontFamily: 'inherit', fontSize: '1.1rem'
                                            }}
                                        />
                                    ) : (
                                        <div className="score-val premium">{attr.value}</div>
                                    )}
                                </div>

                                {/* Divider */}
                                <div className="ability-divider"></div>

                                {/* Modifier */}
                                <div className="mod-container" onClick={() => onRoll(attr.name, attr.modifier)}>
                                    <div className="mod-label">MOD</div>
                                    <div className="mod-val premium">
                                        {attr.modifier >= 0 ? '+' : ''}{attr.modifier}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* SAVING THROWS (unchanged logic, just style tweaks if needed, but omitted for scope) */}
            <div className="panel-box">
                <h4 className="box-header">Salvaguardas</h4>
                {Object.entries(attributes).map(([key, attr]) => {
                    const saveMod = attr.modifier + (attr.saveProficiency ? profBonus : 0);
                    return (
                        <div key={key} className="skill-row-5e">
                            <div
                                className={`prof-dot ${attr.saveProficiency ? 'active' : ''}`}
                                onClick={() => isGM && onToggleSave(key)}
                                style={{ cursor: isGM ? 'pointer' : 'default', opacity: isGM ? 1 : 0.7 }}
                            />
                            <span className="skill-mod" onClick={() => onRoll(`Save ${attr.name}`, saveMod)}>
                                {saveMod >= 0 ? '+' : ''}{saveMod}
                            </span>
                            <span className="skill-name">{attr.name}</span>
                        </div>
                    );
                })}
            </div>

            {/* SKILLS */}
            <div className="panel-box" style={{ flex: 1 }}>
                <h4 className="box-header">Perícias</h4>
                {(skills || []).map(skill => (
                    <div key={skill.name} className="skill-row-5e">
                        <div
                            className={`prof-dot ${skill.proficient ? 'active' : ''} ${skill.expertise ? 'expert' : ''}`}
                            onClick={() => isGM && onToggleSkill(skill.name)}
                            style={{ cursor: isGM ? 'pointer' : 'default', opacity: isGM ? 1 : 0.7 }}
                        />
                        <span className="skill-mod" onClick={() => onRoll(skill.name, skill.value)}>
                            {skill.value >= 0 ? '+' : ''}{skill.value}
                        </span>
                        <span className="skill-name">
                            {skill.name} <span className="attr-sub">({skill.attribute.substring(0, 3).toUpperCase()})</span>
                        </span>
                    </div>
                ))}
            </div>

            {/* PASSIVE PERCEPTION */}
            <div className="panel-box passive-box">
                <span className="passive-val">{passivePerception}</span>
                <span className="passive-lbl">Percepção Passiva (Sabedoria)</span>
            </div>

            {/* PROFICIENCIES */}
            <div className="panel-box">
                <h4 className="box-header">Proficiências & Idiomas</h4>
                <div className="prof-tags">
                    {(proficiencies || []).map((p, i) => <span key={i} className="tag">{p}</span>)}
                    {(languages || []).map((l, i) => <span key={i} className="tag lang">{l}</span>)}
                </div>
            </div>

            <style>{`
                /* Premium Ability Box */
                .ability-box-premium {
                    background: linear-gradient(135deg, #1f1f1f 0%, #141414 100%);
                    border: 1px solid #333;
                    border-radius: 6px;
                    margin-bottom: 8px;
                    position: relative;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                    transition: border-color 0.2s, transform 0.2s;
                    overflow: hidden;
                }
                .ability-box-premium:hover {
                    border-color: #555;
                }
                .ability-box-premium::before {
                    content: '';
                    position: absolute; left: 0; top: 0; bottom: 0; width: 4px;
                    background: #333;
                }
                .ability-box-premium:hover::before {
                    background: #c5a059;
                }

                .ability-header {
                    font-size: 0.9rem; font-weight: 800; color: #888; letter-spacing: 1px;
                    padding: 4px 10px 0 12px;
                    text-align: left;
                }

                .ability-content {
                    display: flex; align-items: center; justify-content: space-between;
                    padding: 4px 12px 8px 12px;
                }

                .score-container, .mod-container {
                    display: flex; flexDirection: column; alignItems: center;
                }

                .score-label, .mod-label {
                    font-size: 0.55rem; color: #555; font-weight: bold; text-transform: uppercase; margin-bottom: 2px;
                }

                .score-val.premium {
                    font-size: 1.1rem; color: #aaa; font-family: 'Roboto Mono', monospace;
                }

                .mod-container {
                    cursor: pointer;
                    background: #252525;
                    padding: 2px 10px;
                    border-radius: 6px;
                    border: 1px solid #333;
                    min-width: 50px;
                    transition: all 0.2s;
                }
                .mod-container:hover {
                    background: #c5a059;
                    border-color: #e5c079;
                }
                .mod-container:hover .mod-val.premium, .mod-container:hover .mod-label {
                    color: #111;
                }

                .mod-val.premium {
                    font-size: 1.5rem; font-weight: bold; color: #fff;
                }

                .ability-divider {
                    width: 1px; height: 30px; background: #333; margin: 0 10px;
                }

                /* Panel Generals */
                .panel-box { background: #1a1a1a; padding: 10px; border: 1px solid #333; border-radius: 4px; }
                .box-header { margin: 0 0 10px 0; border-bottom: 1px solid #444; font-size: 0.75rem; font-weight: bold; text-transform: uppercase; color: #c5a059; letter-spacing: 0.5px; }

                /* Skills refined */
                .skill-row-5e {
                    display: flex; align-items: center; gap: 8px; font-size: 0.85rem;
                    padding: 3px 6px; border-radius: 4px;
                }
                .skill-row-5e:hover {
                    background: #222;
                }
                .prof-dot { width: 8px; height: 8px; border: 1px solid #555; border-radius: 50%; opacity: 0.5; }
                .prof-dot.active { background: #c5a059; border-color: #c5a059; opacity: 1; }
                .prof-dot.expert { box-shadow: 0 0 4px #c5a059; }

                .skill-mod {
                    font-family: 'Roboto Mono', monospace; color: #ccc; width: 22px; text-align: right;
                }
                .skill-name { color: #ddd; flex: 1; }
                .attr-sub { color: #555; font-size: 0.7rem; margin-left: auto; }

                /* Passive */
                .passive-box { border-left: 2px solid #555; }
                .passive-val { color: #fff; border-color: #555; }

                /* Tags */
                .tag { background: #222; border: 1px solid #333; padding: 2px 8px; border-radius: 10px; font-size: 0.75rem; color: #aaa; margin: 2px; }
                .tag.lang { border-color: #334; background: #1a1a20; color: #88a; }
            `}</style>
        </div>
    );
});
