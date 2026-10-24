import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { usePeer } from '../multiplayer/SocketContext';
import { db } from '../../db/RPGDatabase';
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

const DEFAULT_COMBAT_STATE: CombatState = {
    isActive: false,
    round: 1,
    activeTurnId: null,
    currentTargetId: null,
    combatants: []
};

const sortCombatantList = (list: Combatant[]): Combatant[] => {
    return [...list].sort((a, b) => {
        if (b.initiative !== a.initiative) {
            return b.initiative - a.initiative;
        }
        const bonusB = b.bonus ?? 0;
        const bonusA = a.bonus ?? 0;
        if (bonusB !== bonusA) {
            return bonusB - bonusA;
        }
        return (a.name || '').localeCompare(b.name || '');
    });
};

const CombatContext = createContext<CombatContextType | undefined>(undefined);

export const CombatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { broadcast, isHost, currentAdventureId, connectedPlayersData } = usePeer();

    const [combatState, setCombatState] = useState<CombatState>(DEFAULT_COMBAT_STATE);
    const [loadedAdventureId, setLoadedAdventureId] = useState<string | null>(null);

    const safeAdventureId = currentAdventureId || 'default';

    const combatStateRef = useRef(combatState);
    useEffect(() => { combatStateRef.current = combatState; }, [combatState]);

    const isHostRef = useRef(isHost);
    useEffect(() => { isHostRef.current = isHost; }, [isHost]);

    const connectedPlayersRef = useRef(connectedPlayersData);
    useEffect(() => { connectedPlayersRef.current = connectedPlayersData; }, [connectedPlayersData]);

    // Hydrate persisted combat state from Dexie campaign on load / adventure switch
    useEffect(() => {
        let cancelled = false;
        const hydrateCombat = async () => {
            if (safeAdventureId === 'default') {
                if (!cancelled) setLoadedAdventureId('default');
                return;
            }
            try {
                const campaign = await db.campaigns.get(safeAdventureId);
                if (cancelled) return;
                if (campaign?.combatState && typeof campaign.combatState === 'object') {
                    const saved = campaign.combatState as CombatState;
                    setCombatState(prev => {
                        // Do not clobber an already-synced live combat if a player just got server state
                        if (!isHostRef.current && prev.isActive && (prev.combatants?.length || 0) > 0) {
                            return prev;
                        }
                        return {
                            isActive: Boolean(saved.isActive),
                            round: Number(saved.round) || 1,
                            activeTurnId: saved.activeTurnId ?? null,
                            currentTargetId: saved.currentTargetId ?? null,
                            combatants: Array.isArray(saved.combatants) ? saved.combatants : []
                        };
                    });
                } else if (isHostRef.current) {
                    setCombatState(DEFAULT_COMBAT_STATE);
                }
            } catch (err) {
                console.warn('[CombatContext] Failed to hydrate combatState from Dexie:', err);
            } finally {
                if (!cancelled) {
                    setLoadedAdventureId(safeAdventureId);
                }
            }
        };

        hydrateCombat();
        return () => { cancelled = true; };
    }, [safeAdventureId]);

    // Debounced persistence of combatState into Dexie campaign (Host authoritative store)
    useEffect(() => {
        if (!isHost || safeAdventureId === 'default' || loadedAdventureId !== safeAdventureId) return;

        const timer = setTimeout(() => {
            db.campaigns.update(safeAdventureId, {
                combatState,
                updatedAt: Date.now()
            }).catch(err => {
                console.warn('[CombatContext] Failed to persist combatState to Dexie:', err);
            });
        }, 350);

        return () => clearTimeout(timer);
    }, [combatState, isHost, safeAdventureId, loadedAdventureId]);

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

    // Re-sync combat state to server after Host reconnects (e.g. Render cold-start or Wi-Fi blip)
    useEffect(() => {
        const handleHostReconnected = () => {
            if (isHostRef.current && loadedAdventureId === safeAdventureId) {
                broadcastUpdate(combatStateRef.current);
            }
        };
        window.addEventListener('rpg_host_reconnected', handleHostReconnected);
        return () => window.removeEventListener('rpg_host_reconnected', handleHostReconnected);
    }, [broadcastUpdate, loadedAdventureId, safeAdventureId]);

    // Sync combatant HP/AC whenever a Character sheet updates locally or via PLAYER_UPDATE (P1)
    const syncCharacterToCombatants = useCallback((char: any) => {
        if (!char || !char.id || !char.hp) return;
        const current = combatStateRef.current;
        const list = current.combatants || [];
        let changed = false;

        const updatedList = list.map(c => {
            if (c.characterId === char.id || c.id === char.id) {
                const newCur = Number(char.hp.current ?? c.hp?.current ?? 0);
                const newMax = Number(char.hp.max ?? c.hp?.max ?? 10);
                const newAc = char.acOverride ?? char.armorClass ?? c.ac;
                if (c.hp?.current !== newCur || c.hp?.max !== newMax || c.ac !== newAc) {
                    changed = true;
                    return {
                        ...c,
                        hp: { current: newCur, max: newMax },
                        ac: newAc
                    };
                }
            }
            return c;
        });

        if (changed) {
            const next = { ...current, combatants: updatedList };
            setCombatState(next);
            if (isHostRef.current) {
                broadcastUpdate(next);
            }
        }
    }, [broadcastUpdate]);

    useEffect(() => {
        const handleLocalCharSave = (e: Event) => {
            const char = (e as CustomEvent).detail;
            syncCharacterToCombatants(char);
        };
        window.addEventListener('rpg_local_char_save', handleLocalCharSave);
        return () => window.removeEventListener('rpg_local_char_save', handleLocalCharSave);
    }, [syncCharacterToCombatants]);

    const addCombatant = useCallback((combatant: Combatant) => {
        if (isHostRef.current) {
            const currentList = combatStateRef.current.combatants || [];

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
            const removedIndex = currentList.findIndex(c => c.id === id);
            const remaining = currentList.filter(c => c.id !== id);

            let nextActiveTurnId = current.activeTurnId;
            if (current.activeTurnId === id) {
                if (remaining.length === 0) {
                    nextActiveTurnId = null;
                } else {
                    const nextIndex = (removedIndex >= 0 && removedIndex < remaining.length) ? removedIndex : 0;
                    nextActiveTurnId = remaining[nextIndex].id;
                }
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
            broadcast({
                type: 'COMBAT_ACTION',
                payload: { action: 'UPDATE_COMBATANT', combatantId: id, value: updates }
            });
        }
    }, [broadcast, updateState]);

    const sortCombatants = useCallback(() => {
        if (isHostRef.current) {
            const current = combatStateRef.current;
            const sorted = sortCombatantList(current.combatants || []);
            updateState({ ...current, combatants: sorted });
        }
    }, [updateState]);

    const startCombat = useCallback(() => {
        if (isHostRef.current) {
            const current = combatStateRef.current;
            // D2: Preserva iniciativas já roladas (ex.: monstros arrastados para o mapa) e ordena decrescente
            const prepared = sortCombatantList(
                (current.combatants || []).map(c =>
                    c.initiative > 0
                        ? c
                        : { ...c, initiative: 0, roll: 0, bonus: c.bonus ?? 0 }
                )
            );
            const firstActive = prepared.length > 0 && prepared[0].initiative > 0 ? prepared[0].id : null;
            updateState({
                ...current,
                isActive: true,
                round: 1,
                activeTurnId: firstActive,
                combatants: prepared
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
            broadcast({
                type: 'COMBAT_ACTION',
                payload: {
                    action: 'NEXT_TURN',
                    value: { expectedTurnId: combatStateRef.current.activeTurnId }
                }
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
        } else {
            prevIndex = list.length - 1;
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
            setCombatState(prev => ({ ...prev, currentTargetId: targetId }));
            broadcast({
                type: 'COMBAT_ACTION',
                payload: { action: 'SET_TARGET', value: targetId }
            });
        }
    }, [broadcast, updateState]);

    // Peer Sync Listener with Host Authorization for COMBAT_ACTION (C2 / CB1)
    useEffect(() => {
        const doesSenderOwnCombatant = (senderUserId: string | undefined, senderIsHost: boolean | undefined, c: Combatant | undefined): boolean => {
            if (senderIsHost) return true;
            if (!senderUserId || !c) return false;
            const senderCharId = connectedPlayersRef.current[senderUserId]?.character?.id;
            return (
                c.id === senderUserId ||
                Boolean(senderCharId && (c.characterId === senderCharId || c.id === senderCharId))
            );
        };

        const handlePeerEvent = (e: CustomEvent) => {
            const msg = e.detail;
            if (!msg) return;

            if (msg.type === 'COMBAT_UPDATE') {
                setCombatState(msg.payload);
            } else if (msg.type === 'PLAYER_UPDATE') {
                if (msg.payload?.character) {
                    syncCharacterToCombatants(msg.payload.character);
                }
            } else if (msg.type === 'COMBAT_ACTION') {
                if (!isHostRef.current) return;

                const action = msg.payload?.action;
                const senderUserId: string | undefined = msg.senderUserId;
                const senderIsHost: boolean = Boolean(msg.senderIsHost);

                if (action === 'ADD_COMBATANT') {
                    const newCombatant = msg.payload?.value as Combatant | undefined;
                    if (!newCombatant || !newCombatant.id) return;
                    // Non-host players can only add non-NPC combatants linked to their own character
                    if (!senderIsHost) {
                        const senderCharId = senderUserId ? connectedPlayersRef.current[senderUserId]?.character?.id : undefined;
                        if (newCombatant.isNPC) return;
                        if (senderCharId && newCombatant.characterId && newCombatant.characterId !== senderCharId) return;
                    }
                    const current = combatStateRef.current;
                    const currentList = current.combatants || [];
                    const exists = currentList.some(c =>
                        c.id === newCombatant.id ||
                        (newCombatant.characterId && c.characterId === newCombatant.characterId)
                    );
                    if (!exists) {
                        updateState({ ...current, combatants: [...currentList, newCombatant] });
                    }
                } else if (action === 'UPDATE_COMBATANT') {
                    const { combatantId, value } = msg.payload || {};
                    if (!combatantId || !value || typeof value !== 'object') return;
                    const current = combatStateRef.current;
                    const currentList = current.combatants || [];
                    const target = currentList.find(c => c.id === combatantId);
                    if (!doesSenderOwnCombatant(senderUserId, senderIsHost, target)) {
                        console.warn('[CombatContext] Unauthorized UPDATE_COMBATANT ignored from:', senderUserId);
                        return;
                    }
                    const next = {
                        ...current,
                        combatants: currentList.map(c => c.id === combatantId ? { ...c, ...value } : c)
                    };
                    updateState(next);
                } else if (action === 'REMOVE_COMBATANT') {
                    if (!senderIsHost) return;
                    const { combatantId } = msg.payload || {};
                    if (combatantId) removeCombatant(combatantId);
                } else if (action === 'SET_TARGET') {
                    const targetId = msg.payload?.value ?? null;
                    updateState({ ...combatStateRef.current, currentTargetId: targetId });
                } else if (action === 'NEXT_TURN') {
                    const current = combatStateRef.current;
                    const activeCombatant = (current.combatants || []).find(c => c.id === current.activeTurnId);
                    // Prevent double-click turn skipping across cloud latency (CB1)
                    const expectedTurnId = msg.payload?.value?.expectedTurnId;
                    if (expectedTurnId && current.activeTurnId && expectedTurnId !== current.activeTurnId) {
                        return;
                    }
                    if (!doesSenderOwnCombatant(senderUserId, senderIsHost, activeCombatant)) {
                        console.warn('[CombatContext] Unauthorized NEXT_TURN ignored from:', senderUserId);
                        return;
                    }
                    nextTurn();
                } else if (action === 'PREVIOUS_TURN') {
                    if (!senderIsHost) return;
                    previousTurn();
                }
            }
        };

        window.addEventListener('rpg_peer_event' as any, handlePeerEvent);
        return () => window.removeEventListener('rpg_peer_event' as any, handlePeerEvent);
    }, [nextTurn, previousTurn, removeCombatant, syncCharacterToCombatants, updateState]);

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
