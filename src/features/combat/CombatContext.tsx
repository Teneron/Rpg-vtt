import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { usePeer } from '../multiplayer/FirebaseContext';
import type { CombatState, Combatant } from './combatTypes';

interface CombatContextType {
    combatState: CombatState;
    addCombatant: (combatant: Combatant) => void;
    removeCombatant: (id: string) => void;
    updateCombatant: (id: string, updates: Partial<Combatant>) => void;
    nextTurn: () => void;
    previousTurn: () => void;
    startCombat: () => void;
    endCombat: () => void;
    sortCombatants: () => void;
    resetRound: () => void;
    setTarget: (targetId: string | null) => void;
}

const CombatContext = createContext<CombatContextType | undefined>(undefined);

export const CombatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { broadcast, isHost } = usePeer();

    const [combatState, setCombatState] = useState<CombatState>({
        isActive: false,
        round: 1,
        activeTurnId: null,
        currentTargetId: null,
        combatants: []
    });

    const combatStateRef = useRef(combatState);
    useEffect(() => { combatStateRef.current = combatState; }, [combatState]);

    const isHostRef = useRef(isHost);
    useEffect(() => { isHostRef.current = isHost; }, [isHost]);

    const broadcastUpdate = useCallback((newState: CombatState) => {
        broadcast({
            type: 'COMBAT_UPDATE',
            payload: newState
        });
    }, [broadcast]);

    // Host Functions (Source of Truth)
    const updateState = useCallback((newState: CombatState) => {
        setCombatState(newState);
        if (isHostRef.current) {
            broadcastUpdate(newState);
        }
    }, [broadcastUpdate]);

    const addCombatant = useCallback((combatant: Combatant) => {
        if (isHostRef.current) {
            const currentList = combatStateRef.current.combatants || [];

            // Check for existing ID or CharacterID
            const exists = currentList.some(c =>
                c.id === combatant.id ||
                (combatant.characterId && c.characterId === combatant.characterId)
            );

            if (exists) {
                console.warn('[CombatContext] Combatant already exists, ignoring duplicate add.');
                return;
            }

            const next = { ...combatStateRef.current, combatants: [...currentList, combatant] };
            updateState(next);
        } else {
            // Request Host to add
            broadcast({
                type: 'COMBAT_ACTION',
                payload: { action: 'ADD_COMBATANT', value: combatant }
            });
        }
    }, [broadcast, updateState]);

    const removeCombatant = useCallback((id: string) => {
        if (isHostRef.current) {
            const current = combatStateRef.current;
            const currentList = current.combatants || [];
            const remaining = currentList.filter(c => c.id !== id);

            let nextActiveTurnId = current.activeTurnId;
            if (current.activeTurnId === id) {
                nextActiveTurnId = remaining.length > 0 ? remaining[0].id : null;
            }

            const nextTargetId = current.currentTargetId === id ? null : current.currentTargetId;

            updateState({
                ...current,
                combatants: remaining,
                activeTurnId: nextActiveTurnId,
                currentTargetId: nextTargetId
            });
        } else {
            broadcast({
                type: 'COMBAT_ACTION',
                payload: { action: 'REMOVE_COMBATANT', combatantId: id }
            });
        }
    }, [broadcast, updateState]);

    const updateCombatant = useCallback((id: string, updates: Partial<Combatant>) => {
        if (isHostRef.current) {
            const current = combatStateRef.current;
            const currentList = current.combatants || [];
            const next = {
                ...current,
                combatants: currentList.map(c => c.id === id ? { ...c, ...updates } : c)
            };
            updateState(next);
        } else {
            // Request Host to update
            broadcast({
                type: 'COMBAT_ACTION',
                payload: { action: 'UPDATE_COMBATANT', combatantId: id, value: updates }
            });
        }
    }, [broadcast, updateState]);

    const sortCombatants = useCallback(() => {
        if (isHostRef.current) {
            const current = combatStateRef.current;
            const sorted = [...(current.combatants || [])].sort((a, b) => {
                // Primary: initiative descending
                if (b.initiative !== a.initiative) {
                    return b.initiative - a.initiative;
                }
                // Secondary: bonus descending (tie-breaker)
                const bonusB = b.bonus ?? 0;
                const bonusA = a.bonus ?? 0;
                if (bonusB !== bonusA) {
                    return bonusB - bonusA;
                }
                // Tertiary: alphabetical name
                return a.name.localeCompare(b.name);
            });
            updateState({ ...current, combatants: sorted });
        }
    }, [updateState]);

    const startCombat = useCallback(() => {
        if (isHostRef.current) {
            const current = combatStateRef.current;
            const resetCombatants = (current.combatants || []).map(c => ({
                ...c,
                initiative: 0,
                roll: 0,
                bonus: 0
            }));
            updateState({
                ...current,
                isActive: true,
                round: 1,
                activeTurnId: null,
                combatants: resetCombatants
            });
        }
    }, [updateState]);

    const endCombat = useCallback(() => {
        if (isHostRef.current) {
            updateState({
                ...combatStateRef.current,
                isActive: false,
                round: 1,
                activeTurnId: null,
                currentTargetId: null
            });
        }
    }, [updateState]);

    const nextTurn = useCallback(() => {
        if (!isHostRef.current) {
            // Player sends request to Host
            broadcast({
                type: 'COMBAT_ACTION',
                payload: { action: 'NEXT_TURN' }
            });
            return;
        }

        const current = combatStateRef.current;
        const list = current.combatants || [];
        if (list.length === 0) return;

        let nextIndex = 0;
        const currentIndex = list.findIndex(c => c.id === current.activeTurnId);

        if (currentIndex !== -1) {
            nextIndex = currentIndex + 1;
        }

        let nextRound = current.round;

        if (nextIndex >= list.length) {
            nextIndex = 0;
            nextRound++;
        }

        updateState({
            ...current,
            activeTurnId: list[nextIndex].id,
            round: nextRound
        });
    }, [broadcast, updateState]);

    const previousTurn = useCallback(() => {
        if (!isHostRef.current) {
            broadcast({
                type: 'COMBAT_ACTION',
                payload: { action: 'PREVIOUS_TURN' }
            });
            return;
        }

        const current = combatStateRef.current;
        const list = current.combatants || [];
        if (list.length === 0) return;

        let prevIndex = 0;
        const currentIndex = list.findIndex(c => c.id === current.activeTurnId);

        if (currentIndex !== -1) {
            prevIndex = currentIndex - 1;
        }

        let prevRound = current.round;

        if (prevIndex < 0) {
            prevIndex = list.length - 1;
            prevRound = Math.max(1, prevRound - 1);
        }

        updateState({
            ...current,
            activeTurnId: list[prevIndex].id,
            round: prevRound
        });
    }, [broadcast, updateState]);

    const resetRound = useCallback(() => {
        if (isHostRef.current) {
            const current = combatStateRef.current;
            const firstId = (current.combatants && current.combatants.length > 0) ? current.combatants[0].id : null;
            updateState({ ...current, round: 1, activeTurnId: firstId });
        }
    }, [updateState]);

    const setTarget = useCallback((targetId: string | null) => {
        if (isHostRef.current) {
            updateState({ ...combatStateRef.current, currentTargetId: targetId });
        } else {
            // Update locally for immediate responsiveness
            setCombatState(prev => ({ ...prev, currentTargetId: targetId }));
            // Broadcast request to host so the whole room syncs
            broadcast({
                type: 'COMBAT_ACTION',
                payload: { action: 'SET_TARGET', value: targetId }
            });
        }
    }, [broadcast, updateState]);

    // Peer Sync Listener
    useEffect(() => {
        const handlePeerEvent = (e: CustomEvent) => {
            const msg = e.detail;
            if (msg.type === 'COMBAT_UPDATE') {
                console.log('[CombatContext] Received Sync:', msg.payload);
                setCombatState(msg.payload);
            } else if (msg.type === 'COMBAT_ACTION') {
                if (isHostRef.current) {
                    const action = msg.payload?.action;
                    if (action === 'ADD_COMBATANT') {
                        const newCombatant = msg.payload.value;
                        const current = combatStateRef.current;
                        const currentList = current.combatants || [];
                        const exists = currentList.some(c =>
                            c.id === newCombatant.id ||
                            (newCombatant.characterId && c.characterId === newCombatant.characterId)
                        );
                        if (!exists) {
                            console.log('[CombatContext] Host received ADD_COMBATANT:', newCombatant);
                            updateState({ ...current, combatants: [...currentList, newCombatant] });
                        }
                    } else if (action === 'UPDATE_COMBATANT') {
                        const { combatantId, value } = msg.payload;
                        console.log('[CombatContext] Host received UPDATE_COMBATANT:', combatantId, value);
                        const current = combatStateRef.current;
                        const currentList = current.combatants || [];
                        const next = {
                            ...current,
                            combatants: currentList.map(c => c.id === combatantId ? { ...c, ...value } : c)
                        };
                        updateState(next);
                    } else if (action === 'REMOVE_COMBATANT') {
                        const { combatantId } = msg.payload;
                        console.log('[CombatContext] Host received REMOVE_COMBATANT:', combatantId);
                        removeCombatant(combatantId);
                    } else if (action === 'SET_TARGET') {
                        const targetId = msg.payload.value ?? null;
                        console.log('[CombatContext] Host received SET_TARGET:', targetId);
                        updateState({ ...combatStateRef.current, currentTargetId: targetId });
                    } else if (action === 'NEXT_TURN') {
                        console.log('[CombatContext] Host received NEXT_TURN request');
                        nextTurn();
                    } else if (action === 'PREVIOUS_TURN') {
                        console.log('[CombatContext] Host received PREVIOUS_TURN request');
                        previousTurn();
                    }
                }
            }
        };

        window.addEventListener('rpg_peer_event' as any, handlePeerEvent);
        return () => window.removeEventListener('rpg_peer_event' as any, handlePeerEvent);
    }, [nextTurn, previousTurn, removeCombatant, updateState]);

    return (
        <CombatContext.Provider value={{
            combatState,
            addCombatant,
            removeCombatant,
            updateCombatant,
            nextTurn,
            previousTurn,
            startCombat,
            endCombat,
            sortCombatants,
            resetRound,
            setTarget
        }}>
            {children}
        </CombatContext.Provider>
    );
};

export const useCombat = () => {
    const context = useContext(CombatContext);
    if (!context) throw new Error('useCombat must be used within CombatProvider');
    return context;
};
