import React from 'react';
import type { RollResult } from './diceUtils';
import './RollHistory.css'; // We'll create this

interface RollHistoryProps {
    history: RollResult[];
    clearHistory: () => void;
}

export const RollHistory: React.FC<RollHistoryProps> = ({ history, clearHistory }) => {
    return (
        <div className="roll-history">
            <div className="history-header">
                <h3>Histórico</h3>
                <button onClick={clearHistory} className="clear-btn">Limpar</button>
            </div>
            <ul className="history-list">
                {history.slice().reverse().map((roll) => (
                    <li key={roll.id} className="history-item">
                        <span className="timestamp">
                            {new Date(roll.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                        <span className="roll-details">
                            Rolou <strong>{roll.dieType}</strong>: <span className="value">{roll.value}</span>
                        </span>
                    </li>
                ))}
                {history.length === 0 && <li className="empty-message">Nenhuma rolagem ainda.</li>}
            </ul>
        </div>
    );
};
