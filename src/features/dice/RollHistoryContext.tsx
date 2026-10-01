import React, { createContext, useContext, useState, type ReactNode } from 'react';
import { db } from '../../db/RPGDatabase';
import { useAdventure } from '../adventure/AdventureContext';

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

export const RollHistoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [history, setHistory] = useState<RollEvent[]>([]);
    const { currentAdventure } = useAdventure();

    // Load history when adventure changes
    React.useEffect(() => {
        if (currentAdventure) {
            console.log('[RollHistory] Loading logs from adventure:', currentAdventure.name);
            setHistory(currentAdventure.logs || []);
        } else {
            setHistory([]);
        }
    }, [currentAdventure]);

    // Add roll with safe Dexie persistence (IndexedDB)
    const addRollWithSave = React.useCallback((roll: RollEvent) => {
        // 1. Update Local State
        setHistory(prev => {
            if (prev.some(r => r.id === roll.id)) return prev;
            return [roll, ...prev];
        });

        // 2. Persist to Dexie (IndexedDB)
        if (currentAdventure) {
            try {
                // Save to dedicated rollLogs table
                db.rollLogs.put({ ...roll, campaignId: currentAdventure.id }).catch(err => {
                    console.error('[RollHistory] Failed to save roll to Dexie rollLogs:', err);
                });

                // Also update campaign logs in campaigns table
                db.campaigns.get(currentAdventure.id).then(camp => {
                    if (camp) {
                        const existingLogs = camp.logs || [];
                        if (!existingLogs.some(r => r.id === roll.id)) {
                            const updatedLogs = [roll, ...existingLogs];
                            db.campaigns.update(currentAdventure.id, {
                                logs: updatedLogs,
                                updatedAt: Date.now()
                            });
                        }
                    }
                }).catch(err => {
                    console.error('[RollHistory] Failed to update campaign logs in Dexie:', err);
                });
            } catch (err) {
                console.error('[RollHistory] Failed to persist roll log:', err);
            }
        }
    }, [currentAdventure]);

    const clearHistory = () => {
        setHistory([]);
        if (currentAdventure) {
            db.campaigns.update(currentAdventure.id, { logs: [] }).catch(console.error);
        }
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
