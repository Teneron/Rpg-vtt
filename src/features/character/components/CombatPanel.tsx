
import React from 'react';
import type { Character } from '../characterTypes';

interface CombatPanelProps {
    character: Character;
    onUpdateHP: (current: number, temp: number) => void;
    onUpdateMaxHP?: (max: number) => void;
    onUpdateAC?: (ac: number) => void;
    onRollAttack: (name: string, bonus: number) => void;
    // Equipment
    onUpdateResource?: (index: number, value: number) => void;
    isGM?: boolean;
}

export const CombatPanel: React.FC<CombatPanelProps> = React.memo(({
    character, onUpdateHP, onUpdateMaxHP, onUpdateAC, onRollAttack, onUpdateResource, isGM
}) => {
    return (
        <div className="combat-panel" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* TOP BAR: AC, INIT, SPEED */}
            <div className="top-stats-row">
                <div className="shield-stat-container">
                    {/* CSS-drawn Shield or SVG */}
                    <svg className="shield-svg" viewBox="0 0 100 120">
                        <path d="M50,0 C90,0 95,20 100,40 C100,80 80,110 50,120 C20,110 0,80 0,40 C5,20 10,0 50,0 Z" fill="#1a1a1a" stroke="#c5a059" strokeWidth="3" />
                    </svg>
                    <div className="shield-content">
                        <span className="shield-label">CA</span>
                        {isGM ? (
                            <input
                                className="shield-val"
                                type="number"
                                value={character.armorClass}
                                onChange={e => onUpdateAC && onUpdateAC(Number(e.target.value))}
                                style={{
                                    width: '60px', background: 'transparent', border: 'none', color: '#fff',
                                    textAlign: 'center', fontSize: '2rem', fontWeight: 'bold', zIndex: 10, position: 'relative'
                                }}
                            />
                        ) : (
                            <span className="shield-val">{character.armorClass}</span>
                        )}
                    </div>
                </div>

                <div className="stat-box-premium">
                    <span className="stat-label">Iniciativa</span>
                    <span className="stat-val">{(character.attributes.dex.modifier >= 0 ? '+' : '') + character.attributes.dex.modifier}</span>
                </div>

                <div className="stat-box-premium">
                    <span className="stat-label">Desloc.</span>
                    <span className="stat-val">{character.speed}m</span>
                </div>
            </div>

            {/* VITALITY */}
            <div className="vitality-container panel-box premium-box">
                <div className="hp-header-grid">
                    <div className="hp-group">
                        <label>PV MÁXIMO</label>
                        <input
                            className="premium-input"
                            value={character.hp.max}
                            onChange={e => isGM && onUpdateMaxHP && onUpdateMaxHP(Number(e.target.value))}
                            readOnly={!isGM}
                            title={!isGM ? "Apenas GM ou Level Up pode alterar PV Max" : ""}
                            style={{ cursor: !isGM ? 'not-allowed' : 'text', opacity: !isGM ? 0.8 : 1, borderColor: isGM ? '#4CAF50' : '' }}
                        />
                    </div>
                    <div className="hp-group main">
                        <label>PV ATUAL</label>
                        <input
                            className="premium-input large"
                            type="number"
                            value={character.hp.current}
                            onChange={e => onUpdateHP(parseInt(e.target.value), character.hp.temp)}
                            readOnly={!isGM}
                            title={!isGM ? "Apenas GM pode editar PV diretamente." : ""}
                            style={{ cursor: !isGM ? 'not-allowed' : 'text', opacity: !isGM ? 0.8 : 1 }}
                        />
                    </div>
                    <div className="hp-group">
                        <label>TEMP</label>
                        <input
                            className="premium-input"
                            type="number"
                            value={character.hp.temp}
                            onChange={e => onUpdateHP(character.hp.current, parseInt(e.target.value))}
                            readOnly={!isGM}
                            title={!isGM ? "Apenas GM pode editar PV Temp." : ""}
                            style={{ cursor: !isGM ? 'not-allowed' : 'text', opacity: !isGM ? 0.8 : 1 }}
                        />
                    </div>
                </div>

                <div className="hp-footer is-flex">
                    <div className="ds-box flex-1">
                        <label>Testes de Morte</label>
                        <div className="death-saves-row">
                            <span>Suc:</span>
                            <div className="checks">
                                {[1, 2, 3].map(i => <div key={i} className={`check-box ${character.deathSaves.successes >= i ? 'filled success' : ''}`} />)}
                            </div>
                        </div>
                        <div className="death-saves-row">
                            <span>Fal:</span>
                            <div className="checks">
                                {[1, 2, 3].map(i => <div key={i} className={`check-box ${character.deathSaves.failures >= i ? 'filled fail' : ''}`} />)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* RESOURCES */}
            {character.classResources && character.classResources.length > 0 && (
                <div className="panel-box premium-box">
                    <h4 className="box-header-gold">Recursos de Classe</h4>
                    <div className="resources-list" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {character.classResources.map((res, i) => (
                            <div key={res.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#222', padding: '5px 10px', borderRadius: '4px' }}>
                                <span style={{ fontWeight: 'bold' }}>{res.name}</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <button
                                        onClick={() => onUpdateResource && onUpdateResource(i, Math.max(0, res.current - 1))}
                                        style={{ width: '24px', height: '24px', cursor: 'pointer', background: '#444', border: 'none', color: '#fff', borderRadius: '4px' }}
                                    >-</button>
                                    <span style={{ minWidth: '30px', textAlign: 'center' }}>{res.current}</span>
                                    <span style={{ color: '#666' }}>/</span>
                                    <span style={{ minWidth: '20px', textAlign: 'center', color: '#888' }}>{res.max}</span>
                                    <button
                                        onClick={() => onUpdateResource && onUpdateResource(i, Math.min(res.max, res.current + 1))}
                                        style={{ width: '24px', height: '24px', cursor: 'pointer', background: '#444', border: 'none', color: '#fff', borderRadius: '4px' }}
                                    >+</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ATTACKS & SPELLCASTING */}
            <div className="panel-box premium-box">
                <h4 className="box-header-gold">Ataques & Magias</h4>
                <div className="attacks-table">
                    <div className="atk-row header">
                        <span>Nome</span>
                        <span>Bônus</span>
                        <span>Dano</span>
                    </div>
                    {(character.attacks || []).map(atk => (
                        <div key={atk.id} className="atk-row item" onClick={() => onRollAttack(atk.name, atk.attackBonus)}>
                            <span className="atk-name">{atk.name}</span>
                            <span className="atk-bonus">+{atk.attackBonus}</span>
                            <span className="atk-dmg">{atk.damageDice} {atk.damageType}</span>
                        </div>
                    ))}
                    {(!character.attacks || character.attacks.length === 0) && <div className="empty-msg">Sem armas equipadas</div>}
                </div>
            </div>


        </div>
    );
});
