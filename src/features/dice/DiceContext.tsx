import React, { createContext, useContext, useState, useRef, type ReactNode } from 'react';
import { useRollHistory } from './RollHistoryContext';
import { useChat } from '../chat/ChatContext';

interface DiceState {
    rollingDice: Array<{ id: string, type: string, value: number, position?: [number, number, number] }>;
    // Enhanced Roll Result Type
    rollResult: { total: number, breakdown: number[], modifier: number } | null;
    isRolling: boolean;
    triggerRoll: (selectedDice: Record<string, number>, modifier: number, label?: string) => void;
    finishRoll: (results: Record<string, number>) => void;
    clearDice: () => void;
}

const DiceContext = createContext<DiceState | undefined>(undefined);

export const DiceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { addRoll } = useRollHistory();
    // Safe chat usage (optional chaining in case of nesting issues, but App.tsx structure confirms it's ok)
    // Actually, wrap in try/catch or just assume it's there.
    const chat = useChat();
    const sendMessage = chat.sendMessage;

    const [rollingDice, setRollingDice] = useState<Array<{ id: string, type: string, value: number, position?: [number, number, number] }>>([]);
    const [rollResult, setRollResult] = useState<{ total: number, breakdown: number[], modifier: number } | null>(null);
    const [isRolling, setIsRolling] = useState<boolean>(false);
    const [lastModifier, setLastModifier] = useState<number>(0);
    const [lastLabel, setLastLabel] = useState<string>('');

    // Safety Ref to clear timeout if roll finishes early
    const failsafeTimer = useRef<NodeJS.Timeout | null>(null);
    // Cleanup Ref to prevent old roll cleanups from killing new rolls
    const cleanupTimer = useRef<NodeJS.Timeout | null>(null);
    // Duplicate Prevention Ref
    const processingRef = useRef(false);

    // Debug Wrapper for State Updates
    const updateRollingDice = (newDice: any[]) => {
        console.log(`[DiceContext] setRollingDice called with ${newDice.length} dice.`);
        if (newDice.length === 0) console.trace("Trace for Empty Dice Set:");
        setRollingDice(newDice);
    }

    const finishRoll = React.useCallback((results: Record<string, number>) => {
        // Prevent double-firing
        if (processingRef.current) {
            console.warn("[DiceContext] finishRoll called but already processed. Ignoring.");
            return;
        }
        processingRef.current = true; // Lock

        console.log("[DiceContext] finishRoll called with results:", results);
        setIsRolling(false);
        if (failsafeTimer.current) { clearTimeout(failsafeTimer.current); failsafeTimer.current = null; }
        if (cleanupTimer.current) { clearTimeout(cleanupTimer.current); cleanupTimer.current = null; }

        const breakdown = Object.values(results);
        const diceTotal = breakdown.reduce((a, b) => a + b, 0);

        // Ignore Empty/Zero rolls (Ghost Roll Fix)
        if (diceTotal === 0 && breakdown.length === 0) {
            console.warn("[DiceContext] Roll finished with 0 total (Empty?). Ignoring.");
            return;
        }

        const finalTotal = diceTotal + lastModifier;

        setRollResult({ total: finalTotal, breakdown, modifier: lastModifier });

        const rollData = {
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            total: finalTotal,
            // Capture the dice types from the state for history
            dice: rollingDice.map(d => ({ ...d, value: results[d.id] || 0 })),
            modifier: lastModifier,
            label: lastLabel,
            timestamp: Date.now()
        };

        addRoll(rollData);

        // SEND TO CHAT
        if (sendMessage) {
            sendMessage(JSON.stringify({
                total: finalTotal,
                formula: breakdown.length > 1 ? `${breakdown.join('+')} + ${lastModifier}` : `d${rollingDice[0]?.type?.replace('D', '') || '?'} + ${lastModifier}`,
                label: lastLabel,
                details: rollData
            }), 'roll');
        }

        // BROADCAST TO PEERS (For History Sync)
        // We dispatch a custom event that PeerContext picks up?
        // Actually PeerContext listens to window events to SEND? 
        // Or we just dispatch the event here and PeerContext (or App) handles it?
        // Wait, PeerContext exposes 'broadcast'. We can't usePeer() here because DiceProvider is INSIDE PeerProvider? YES.
        // So we can usePeer hook!
        // But to avoid circular deps or complex refactoring, let's use the Event Bus for loose coupling.
        // SENDER logic:
        const broadcastEvent = new CustomEvent('rpg_broadcast_roll', {
            detail: JSON.parse(JSON.stringify(rollData))
        });
        window.dispatchEvent(broadcastEvent);

        // Clear dice after 8 seconds (Visual Cleanup) - Tracked!
        cleanupTimer.current = setTimeout(() => {
            console.log("[DiceContext] Cleanup Timer fired. Clearing dice.");
            updateRollingDice([]);
            cleanupTimer.current = null;
        }, 8000);
    }, [addRoll, lastModifier, lastLabel, rollingDice, sendMessage]);

    // LISTENER LOGIC (Receive Remote Rolls)
    React.useEffect(() => {
        const handleRemoteRoll = (e: CustomEvent) => {
            const msg = e.detail;
            if (msg.type === 'ROLL_RESULT') {
                const { playerName, roll } = msg.payload;
                console.log("[DiceContext] Received Remote Roll:", roll);

                // Filter invalid ghost rolls
                if (!roll || roll.total === 0) {
                    console.warn("[DiceContext] Received invalid/empty roll from peer. Ignoring.");
                    return;
                }

                // Add to history with a name tag?
                // RollHistoryContext might need updating to support 'playerName', 
                // OR we just inject it into the roll object for now.
                addRoll({
                    ...roll,
                    // CRITICAL FIX: Use original ID to allow de-duplication in HistoryContext
                    id: roll.id || `remote-${Date.now()}-${Math.random()}`,
                    playerName: playerName
                });
            }
        };

        window.addEventListener('rpg_peer_event' as any, handleRemoteRoll);
        return () => window.removeEventListener('rpg_peer_event' as any, handleRemoteRoll);
    }, [addRoll]);

    // COMPONENT CLEANUP
    React.useEffect(() => {
        return () => {
            if (cleanupTimer.current) clearTimeout(cleanupTimer.current);
            if (failsafeTimer.current) clearTimeout(failsafeTimer.current);
        };
    }, []);

    const triggerRoll = React.useCallback((selectedDice: Record<string, number>, modifier: number, label?: string) => {
        console.log("[DiceContext] triggerRoll called. Dice:", selectedDice, "Mod:", modifier, "Label:", label);
        setRollResult(null);
        setIsRolling(true);
        setLastModifier(modifier);
        // Store label in a ref or state if needed, but for now lets just capture it in the closure if possible?
        // Actually, finishRoll is a callback that needs access to it. 
        // We should add 'lastLabel' state.
        setLastLabel(label || '');

        processingRef.current = false; // Reset Lock

        if (failsafeTimer.current) clearTimeout(failsafeTimer.current);

        // CRITICAL FIX: Ensure previous cleanup is cancelled so it doesn't kill THIS roll.
        if (cleanupTimer.current) {
            console.log(`[DiceContext] 🛑 Cancelling cleanup timer (ID: ${cleanupTimer.current}) before starting new roll.`);
            clearTimeout(cleanupTimer.current);
            cleanupTimer.current = null;
        }

        const newRolls: Array<{ id: string, type: string, value: number, position?: [number, number, number] }> = [];
        let index = 0;

        Object.entries(selectedDice).forEach(([type, count]) => {
            for (let i = 0; i < count; i++) {
                index++;
                newRolls.push({
                    id: Math.random().toString(36).substr(2, 9),
                    type,
                    value: 0,
                    position: [
                        9 + (Math.random() * 0.5),     // X
                        5 + (index * 0.5),             // Y
                        (Math.random() - 0.5) * 4      // Z
                    ]
                });
            }
        });

        if (newRolls.length > 0) {
            updateRollingDice(newRolls);

            failsafeTimer.current = setTimeout(() => {
                console.warn("DiceContext Failsafe Triggered: Rolling timed out (20s).");
                setIsRolling(false);
                updateRollingDice([]);
                setRollResult({ total: 0, breakdown: [], modifier: modifier });
            }, 20000);

        } else {
            setIsRolling(false);
        }
    }, []);

    const clearDice = React.useCallback(() => {
        console.log("[DiceContext] ClearDice called.");
        updateRollingDice([]);
    }, []);

    // Memoize the value to prevent unnecessary re-renders of consumers
    const value = React.useMemo(() => ({
        rollingDice, rollResult, isRolling, triggerRoll, finishRoll, clearDice
    }), [rollingDice, rollResult, isRolling, triggerRoll, finishRoll, clearDice]);

    return (
        <DiceContext.Provider value={value}>
            {children}
        </DiceContext.Provider>
    );
};

export const useDice = () => {
    const context = useContext(DiceContext);
    if (!context) throw new Error('useDice must be used within a DiceProvider');
    return context;
};
