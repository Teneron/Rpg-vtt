import React from 'react';
import './Die.css'; // We'll create this for styling

interface DieProps {
    type: string;
    value: number | null;
    rolling: boolean;
    onClick: () => void;
}

export const Die: React.FC<DieProps> = ({ type, value, rolling, onClick }) => {
    return (
        <button
            className={`die`} // Container for layout
            onClick={onClick}
            disabled={rolling}
            aria-label={`Roll ${type}`}
        >
            <div className={`die-shape ${type} ${rolling ? 'rolling' : ''}`}>
                {value !== null && !rolling ? (
                    <span className="die-value">{value}</span>
                ) : (
                    <span className="die-label">{type.toUpperCase()}</span>
                )}
            </div>
        </button>
    );
};
