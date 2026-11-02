import React, { createContext, useContext, useState, useRef, useEffect, type ReactNode } from 'react';
import { useRollHistory } from './RollHistoryContext';
import { useChat } from '../chat/ChatContext';
import { getRandomDieValue } from './PhysicsDie';

export interface DiceRollResult {
    total: number;
    breakdown: number[];
    modifier: number;
}

interface DiceState {
    rollingDice: Array<{ id: string; type: string; value: number; position?: [number, number, number] }>;
    rollResult: DiceRollResult | null;
    isRolling: boolean;
    triggerRoll: (
        selectedDice: Record<string, number>,
        modifier: number,
        label?: string,
        onComplete?: (result: DiceRollResult) => void
    ) => void;
    finishRoll: (results: Record<string, number>) => void;
    clearDice: () => void;
}

const DiceContext = createContext<DiceState | undefined>(undefined);

export const DiceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { addRoll } = useRollHistory();
    const chat = useChat();
    const sendMessage = chat.sendMessage;

    const [rollingDice, setRollingDice] = useState<Array<{ id: string; type: string; value: number; position?: [number, number, number] }>>([]);
    const [rollResult, setRollResult] = useState<DiceRollResult | null>(null);
    const [isRolling, setIsRolling] = useState<boolean>(false);
    const [lastModifier, setLastModifier] = useState<number>(0);
    const [lastLabel, setLastLabel] = useState<string>('');

    const rollingDiceRef = useRef(rollingDice);
    const lastModifierRef = useRef(lastModifier);
    const lastLabelRef = useRef(lastLabel);
    const onCompleteRef = useRef<((result: DiceRollResult) => void) | null>(null);

    useEffect(() => { rollingDiceRef.current = rollingDice; }, [rollingDice]);
    useEffect(() => { lastModifierRef.current = lastModifier; }, [lastModifier]);
    useEffect(() => { lastLabelRef.current = lastLabel; }, [lastLabel]);

    // Safety Ref to clear timeout if roll finishes early
    const failsafeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    // Cleanup Ref to prevent old roll cleanups from killing new rolls
    const cleanupTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    // Duplicate Prevention Ref
    const processingRef = useRef(false);

    const updateRollingDice = (newDice: Array<{ id: string; type: string; value: number; position?: [number, number, number] }>) => {
        rollingDiceRef.current = newDice;
        setRollingDice(newDice);
    };

    const finishRoll = React.useCallback((results: Record<string, number>) => {
        if (processingRef.current) {
            console.warn('[DiceContext] finishRoll called but already processed. Ignoring.');
            return;
        }
        processingRef.current = true;

        console.log('[DiceContext] finishRoll called with results:', results);
        setIsRolling(false);
        if (failsafeTimer.current) { clearTimeout(failsafeTimer.current); failsafeTimer.current = null; }
        if (cleanupTimer.current) { clearTimeout(cleanupTimer.current); cleanupTimer.current = null; }

        const currentDice = rollingDiceRef.current;
        const orderedBreakdown = currentDice.length > 0
            ? currentDice.map(d => (results[d.id] !== undefined ? results[d.id] : getRandomDieValue(d.type)))
            : Object.values(results);

        const diceTotal = orderedBreakdown.reduce((a, b) => a + b, 0);

        if (orderedBreakdown.length === 0) {
            console.warn('[DiceContext] Roll finished with empty dice list. Ignoring.');
            return;
        }

        const modifier = lastModifierRef.current;
        const label = lastLabelRef.current;
        const finalTotal = diceTotal + modifier;
        const finalResult: DiceRollResult = { total: finalTotal, breakdown: orderedBreakdown, modifier };

        setRollResult(finalResult);

        // Executa callback vinculado (ex: Descanso Curto ou Teste contra a Morte) com o resultado exato do dado 3D
        const completionCallback = onCompleteRef.current;
        onCompleteRef.current = null;
        if (completionCallback) {
            try {
                completionCallback(finalResult);
            } catch (cbErr) {
                console.error('[DiceContext] Error in onComplete callback:', cbErr);
            }
        }

        const modSuffix = modifier === 0 ? '' : (modifier > 0 ? ` + ${modifier}` : ` - ${Math.abs(modifier)}`);
        const formulaStr = orderedBreakdown.length > 1
            ? `${orderedBreakdown.join(' + ')}${modSuffix}`
            : `${currentDice[0]?.type || 'd20'} (${orderedBreakdown[0]})${modSuffix}`;

        const rollData = {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
            total: finalTotal,
            formula: formulaStr,
            rolls: orderedBreakdown,
            dice: currentDice.map((d, idx) => ({ ...d, value: orderedBreakdown[idx] ?? 0 })),
            modifier,
            label,
            timestamp: Date.now()
        };

        addRoll(rollData);

        if (sendMessage) {
            sendMessage(JSON.stringify({
                total: finalTotal,
                formula: formulaStr,
                label,
                details: rollData
            }), 'roll');
        }

        const broadcastEvent = new CustomEvent('rpg_broadcast_roll', {
            detail: JSON.parse(JSON.stringify(rollData))
        });
        window.dispatchEvent(broadcastEvent);

        cleanupTimer.current = setTimeout(() => {
            updateRollingDice([]);
            cleanupTimer.current = null;
        }, 8000);
    }, [addRoll, sendMessage]);

    // LISTENER LOGIC (Receive Remote Rolls)
    React.useEffect(() => {
        const handleRemoteRoll = (e: CustomEvent) => {
            const msg = e.detail;
            if (msg.type === 'ROLL_RESULT') {
                const { playerName, roll } = msg.payload;
                if (!roll || (roll.total === 0 && (!Array.isArray(roll.rolls) || roll.rolls.length === 0))) {
                    return;
                }

                addRoll({
                    ...roll,
                    id: roll.id || `remote-${Date.now()}-${Math.random()}`,
                    playerName
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

    const triggerRoll = React.useCallback((
        selectedDice: Record<string, number>,
        modifier: number,
        label?: string,
        onComplete?: (result: DiceRollResult) => void
    ) => {
        console.log('[DiceContext] triggerRoll called. Dice:', selectedDice, 'Mod:', modifier, 'Label:', label);
        setRollResult(null);
        setIsRolling(true);
        lastModifierRef.current = modifier;
        lastLabelRef.current = label || '';
        onCompleteRef.current = onComplete || null;
        setLastModifier(modifier);
        setLastLabel(label || '');

        processingRef.current = false;

        if (failsafeTimer.current) clearTimeout(failsafeTimer.current);

        if (cleanupTimer.current) {
            clearTimeout(cleanupTimer.current);
            cleanupTimer.current = null;
        }

        const newRolls: Array<{ id: string; type: string; value: number; position?: [number, number, number] }> = [];
        let index = 0;

        const pushSingleDie = (dieType: string) => {
            index++;
            newRolls.push({
                id: Math.random().toString(36).slice(2, 11),
                type: dieType,
                value: 0,
                position: [
                    9 + (Math.random() * 0.5),
                    5 + (index * 0.5),
                    (Math.random() - 0.5) * 4
                ]
            });
        };

        Object.entries(selectedDice).forEach(([rawType, count]) => {
            const cleanType = rawType.toLowerCase();
            for (let i = 0; i < count; i++) {
                if (cleanType === 'd100') {
                    // d100 real: dezena (00..90) + unidade (1..10) = distribuição uniforme exata de 1 a 100
                    pushSingleDie('d100_tens');
                    pushSingleDie('d10');
                } else {
                    pushSingleDie(cleanType);
                }
            }
        });

        if (newRolls.length > 0) {
            updateRollingDice(newRolls);

            failsafeTimer.current = setTimeout(() => {
                console.warn('[DiceContext] Failsafe Triggered: Rolling timed out (12s). Resolving safely.');
                const fallbackMap: Record<string, number> = {};
                rollingDiceRef.current.forEach(d => {
                    fallbackMap[d.id] = getRandomDieValue(d.type);
                });
                finishRoll(fallbackMap);
            }, 12000);
        } else {
            setIsRolling(false);
            onCompleteRef.current = null;
        }
    }, [finishRoll]);

    const clearDice = React.useCallback(() => {
        updateRollingDice([]);
    }, []);

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
    if (!context) {
        return {
            rollingDice: [],
            rollResult: null,
            isRolling: false,
            triggerRoll: () => {},
            finishRoll: () => {},
            clearDice: () => {}
        };
    }
    return context;
};
