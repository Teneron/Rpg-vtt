
import { useEffect, useRef } from 'react';
import { usePeer } from './FirebaseContext';
import type { Character } from '../character/characterTypes';

/**
 * Hook to automatically sync local character state to the Host.
 * Uses debounce to avoid network spam.
 */
export const usePlayerSync = (character: Character) => {
    const { broadcastCharacterUpdate, isConnected, updateMyCharacter, myCharacter } = usePeer();
    const lastSynced = useRef<string>('');

    // Update local context ref immediately for visual feedback on tokens
    useEffect(() => {
        // CRITICAL: Only update "My Character" if this IS my character.
        // If GM is editing someone else, we don't want to replace GM's identity with the target's.
        if (myCharacter?.id === character.id) {
            updateMyCharacter(character);
        }
    }, [character, updateMyCharacter, myCharacter?.id]);

    useEffect(() => {
        if (!isConnected) return;

        const sync = () => {
            // Simple serialization check to detect changes
            // Optimizations: Only check specific fields (HP, Slots, etc.)
            const json = JSON.stringify(character);

            if (json !== lastSynced.current) {
                console.log('[PlayerSync] Syncing character state...');
                lastSynced.current = json;
                broadcastCharacterUpdate(character);
            }
        };

        // Debounce: Wait 500ms after last change before sending
        const timer = setTimeout(sync, 500);

        return () => clearTimeout(timer);
    }, [character, isConnected, broadcastCharacterUpdate]);
};
