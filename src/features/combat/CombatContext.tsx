import React, { createContext, useContext, useState, useEffect } from 'react';
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
        combatants: []
    });

    const broadcastUpdate = (newState: CombatState) => {
        broadcast({
            type: 'COMBAT_UPDATE',
            payload: newState
        });
    };

    // Host Functions (Source of Truth)
    const updateState = (newState: CombatState) => {
        setCombatState(newState);
        if (isHost) {
            broadcastUpdate(newState);
        }
    };

    const addCombatant = (combatant: Combatant) => {
        if (isHost) {
            const currentList = combatState.combatants || [];

            // Check for existing ID or CharacterID
            const exists = currentList.some(c =>
                c.id === combatant.id ||
                (combatant.characterId && c.characterId === combatant.characterId)
            );

            if (exists) {
                console.warn("[CombatContext] Combatant already exists, ignoring add.");
                return;
            }

            const next = { ...combatState, combatants: [...currentList, combatant] };
            updateState(next);
        } else {
            // Request Host to add
            broadcast({
                type: 'COMBAT_ACTION',
                payload: { action: 'ADD_COMBATANT', value: combatant }
            });
            // Optimistic update removed to avoid desync
        }
    };

    const removeCombatant = (id: string) => {
        if (isHost) {
            const currentList = combatState.combatants || [];
            const next = { ...combatState, combatants: currentList.filter(c => c.id !== id) };
            updateState(next);
        }
    };

    const updateCombatant = (id: string, updates: Partial<Combatant>) => {
        if (isHost) {
            const currentList = combatState.combatants || [];
            const next = {
                ...combatState,
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
    };

    const startCombat = () => {
        if (isHost) {
            // Reset all initiatives to 0 to force reroll
            const resetCombatants = (combatState.combatants || []).map(c => ({
                ...c,
                initiative: 0,
                roll: 0,
                bonus: 0
            }));
            updateState({
                ...combatState,
                isActive: true,
                round: 1,
                combatants: resetCombatants
            });
        }
    };

    const endCombat = () => {
        if (isHost) updateState({ ...combatState, isActive: false, round: 1, activeTurnId: null });
    };

    const sortCombatants = () => {
        if (isHost) {
            const sorted = [...(combatState.combatants || [])].sort((a, b) => b.initiative - a.initiative);
            updateState({ ...combatState, combatants: sorted });
        }
    };

    const nextTurn = () => {
        const list = combatState.combatants || [];
        if (!isHost || list.length === 0) return;

        let nextIndex = 0;
        const currentIndex = list.findIndex(c => c.id === combatState.activeTurnId);

        if (currentIndex !== -1) {
            nextIndex = currentIndex + 1;
        }

        let nextRound = combatState.round;

        if (nextIndex >= list.length) {
            nextIndex = 0;
            nextRound++;
        }

        updateState({
            ...combatState,
            activeTurnId: list[nextIndex].id,
            round: nextRound
        });
    };

    const previousTurn = () => {
        const list = combatState.combatants || [];
        if (!isHost || list.length === 0) return;

        let prevIndex = 0;
        const currentIndex = list.findIndex(c => c.id === combatState.activeTurnId);

        if (currentIndex !== -1) {
            prevIndex = currentIndex - 1;
        }

        let prevRound = combatState.round;

        if (prevIndex < 0) {
            prevIndex = list.length - 1;
            prevRound = Math.max(1, prevRound - 1);
        }

        updateState({
            ...combatState,
            activeTurnId: list[prevIndex].id,
            round: prevRound
        });
    };

    const resetRound = () => {
        if (isHost) updateState({ ...combatState, round: 1, activeTurnId: null });
    };

    const setTarget = (targetId: string | null) => {
        // ANYONE can set target (local or global?)
        // Design Decision: Targeting is Global for now (Simpler)
        // Or maybe per-user? "myTarget". 
        // For "Combat Automation", usually we want the Active Player to set a target 
        // and identifying "I am attacking THAT".
        // Let's make it Global State so everyone sees who is being targeted (Red Circle).
        updateState({ ...combatState, currentTargetId: targetId });
    };

    // Peer Sync Listener
    useEffect(() => {
        const handlePeerEvent = (e: CustomEvent) => {
            const msg = e.detail;
            if (msg.type === 'COMBAT_UPDATE') {
                console.log('[CombatContext] Received Sync:', msg.payload);
                setCombatState(msg.payload);
            } else if (msg.type === 'COMBAT_ACTION') {
                if (isHost) {
                    if (msg.payload.action === 'ADD_COMBATANT') {
                        const newCombatant = msg.payload.value;
                        // Avoid duplicates
                        const exists = (combatState.combatants || []).some(c => c.id === newCombatant.id);
                        if (!exists) {
                            console.log('[CombatContext] Host received ADD_COMBATANT:', newCombatant);
                            const currentList = combatState.combatants || [];
                            const next = { ...combatState, combatants: [...currentList, newCombatant] };
                            updateState(next);
                        }
                    } else if (msg.payload.action === 'UPDATE_COMBATANT') {
                        const { combatantId, value } = msg.payload;
                        console.log('[CombatContext] Host received UPDATE_COMBATANT:', combatantId, value);

                        const currentList = combatState.combatants || [];
                        const next = {
                            ...combatState,
                            combatants: currentList.map(c => c.id === combatantId ? { ...c, ...value } : c)
                        };
                        updateState(next);
                    }
                }
            }
        };
        window.addEventListener('rpg_peer_event' as any, handlePeerEvent);
        return () => window.removeEventListener('rpg_peer_event' as any, handlePeerEvent);
    }, [isHost, combatState]);

    return (
        <CombatContext.Provider value={{
            combatState,
            addCombatant, removeCombatant, updateCombatant,
            nextTurn, previousTurn, startCombat, endCombat, sortCombatants, resetRound,
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
