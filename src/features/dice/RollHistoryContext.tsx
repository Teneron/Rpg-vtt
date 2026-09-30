import React, { createContext, useContext, useState, type ReactNode } from 'react';

// Define the shape of a single roll event
export interface RollEvent {
    id: string;
    total: number;
    dice: Array<{ type: string; value: number }>;
    timestamp: number;
    playerName?: string; // Added for multiplayer
    modifier?: number; // Added for history display
    label?: string; // e.g. "Attack Roll", "Skill Check"
}

interface RollHistoryContextType {
    history: RollEvent[];
    addRoll: (roll: RollEvent) => void;
    clearHistory: () => void;
}

const RollHistoryContext = createContext<RollHistoryContextType | undefined>(undefined);

import { useAdventure } from '../adventure/AdventureContext';
import { AdventureRepository } from '../adventure/adventureRepository';

export const RollHistoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [history, setHistory] = useState<RollEvent[]>([]);
    const { currentAdventure } = useAdventure();

    // Load history when adventure changes
    React.useEffect(() => {
        if (currentAdventure) {
            console.log("[RollHistory] Loading logs from adventure:", currentAdventure.name);
            setHistory(currentAdventure.logs);
        } else {
            setHistory([]);
        }
    }, [currentAdventure]);



    // Effect to auto-save when history changes? 
    // No, addRoll is better because it's the trigger.

    // Reworked addRoll with dependency
    const addRollWithSave = React.useCallback((roll: RollEvent) => {
        // 1. Update Local State
        setHistory(prev => {
            if (prev.some(r => r.id === roll.id)) return prev;
            return [roll, ...prev];
        });

        // 2. Persist safely (outside of state updater)
        if (currentAdventure) {
            // We use a try-catch block or just fire-and-forget, but ensure we don't block render.
            // AdventureRepository is sync or async? It is synchronous in the mockup usually, but let's assume sync.
            try {
                AdventureRepository.appendLog(currentAdventure.id, roll);
            } catch (err) {
                console.error("Failed to save roll log:", err);
            }
        }
    }, [currentAdventure]);

    const clearHistory = () => {
        setHistory([]);
    };

    return (
        <RollHistoryContext.Provider value={{ history, addRoll: addRollWithSave, clearHistory }}>
            {children}
        </RollHistoryContext.Provider>
    );
};

export const useRollHistory = () => {
    const context = useContext(RollHistoryContext);
    if (!context) {
        throw new Error('useRollHistory must be used within a RollHistoryProvider');
    }
    return context;
};
