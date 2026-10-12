import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { usePeer } from '../multiplayer/FirebaseContext';
import { playSynthSound } from './audioSynth';
import type { SynthSoundType } from './audioSynth';

export type AudioTrack = {
    id: string;
    url: string;
    title: string;
    type: 'music' | 'sfx';
    loop?: boolean;
    volume?: number; // 0-1
    synthType?: SynthSoundType;
};

interface AudioContextState {
    currentMusic: AudioTrack | null;
    isPlaying: boolean;
    volume: number; // Master volume
    playMusic: (track: AudioTrack) => void;
    stopMusic: () => void;
    playSfx: (track: AudioTrack) => void;
    setVolume: (vol: number) => void;
    togglePlay: () => void;
    audioBlocked: boolean;
    unlockAudio: () => void;
}

// Helper unificado para tocar sons de rolagem (crítico, falha crítica, impacto)
const handleRollSfx = (roll: any, currentVolume: number) => {
    if (!roll) return;
    const formula = String(roll.formula || '').toLowerCase();
    const rolls: number[] = Array.isArray(roll.rolls) ? roll.rolls : [];
    const diceArray: any[] = Array.isArray(roll.dice) ? roll.dice : [];

    const hasD20InDice = diceArray.some(d => String(d.type || '').toLowerCase().includes('20'));
    const isD20 = formula.includes('d20') || hasD20InDice || (rolls.length === 1 && formula.includes('20'));

    let has20 = false;
    let has1 = false;

    if (diceArray.length > 0) {
        diceArray.forEach(d => {
            const isDieD20 = String(d.type || '').toLowerCase().includes('20');
            if (isDieD20) {
                if (d.value === 20) has20 = true;
                if (d.value === 1) has1 = true;
            }
        });
    }

    if (!has20 && !has1 && isD20) {
        has20 = rolls.includes(20);
        has1 = rolls.includes(1);
    }

    if (isD20 && has20) {
        playSynthSound('crit', currentVolume * 0.85);
    } else if (isD20 && has1) {
        playSynthSound('fumble', currentVolume * 0.85);
    } else {
        playSynthSound('dice', currentVolume * 0.7);
    }
};

const AudioContext = createContext<AudioContextState | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { broadcast, isHost, onMessage, peerId } = usePeer();

    // State
    const [currentMusic, setCurrentMusic] = useState<AudioTrack | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const [audioBlocked, setAudioBlocked] = useState(false);

    // Native Audio Ref
    const musicRef = useRef<HTMLAudioElement | null>(null);

    // Initialize Native Audio
    useEffect(() => {
        musicRef.current = new Audio();
        musicRef.current.loop = true;
        return () => {
            if (musicRef.current) musicRef.current.pause();
        };
    }, []);

    const isYouTube = useCallback((url: string) => {
        const lower = url.toLowerCase();
        return lower.includes('youtube') || lower.includes('youtu.be');
    }, []);

    // 1. Handle Volume
    useEffect(() => {
        if (musicRef.current) {
            musicRef.current.volume = volume * (currentMusic?.volume ?? 1.0);
        }
    }, [volume, currentMusic]);

    // 2. Main Playback Logic
    useEffect(() => {
        let isCancelled = false;

        const handleNativeAudio = async () => {
            if (!musicRef.current || !currentMusic) return;

            // Debug Log
            console.log("Audio Processing:", currentMusic.url, "IsYouTube:", isYouTube(currentMusic.url));

            // If it's YouTube, NATIVE stops, ReactPlayer takes over
            if (isYouTube(currentMusic.url)) {
                musicRef.current.pause();
                musicRef.current.src = ""; // Clear source to prevent ghost errors
                return;
            }

            // If Local, Check if source changed
            // We use endsWith to compare /assets/... with http://localhost.../assets/...
            if (!musicRef.current.src.endsWith(currentMusic.url)) {
                // Safety: Don't set external HTTP links to native audio unless we are sure
                // (But we want to allow user-hosted MP3s... let's just trust isYouTube filter for now)
                musicRef.current.src = currentMusic.url;
            }

            if (isPlaying) {
                try {
                    if (!isCancelled) {
                        await musicRef.current.play();
                        setAudioBlocked(false);
                    }
                } catch (e: any) {
                    // Ignore AbortError (interrupted by pause)
                    if (e.name === 'AbortError') return;

                    console.error("Native Audio Error:", e);
                    setAudioBlocked(true);
                }
            } else {
                musicRef.current.pause();
            }
        };

        if (currentMusic) {
            handleNativeAudio();
        } else {
            musicRef.current?.pause();
        }

        return () => { isCancelled = true; };
    }, [currentMusic, isPlaying, isYouTube]);

    // Track processed events to prevent re-triggers/echoes (Idempotency)
    const processedEvents = useRef<Set<string>>(new Set());

    // P2P Listener
    useEffect(() => {
        const cleanup = onMessage((data: any) => {
            // IGNORE SELF-SENT MESSAGES (Prevents Echo and Re-triggers on React updates)
            if (data.senderId === peerId) {
                // console.log("[Audio] Ignored self-sent message");
                return;
            }

            // IDEMPOTENCY CHECK
            // Use timestamp + type + identifier as unique key if no specific ID provided
            const msgId = data.timestamp ? `${data.type}-${data.timestamp}-${data.senderId}` : null;
            if (msgId && processedEvents.current.has(msgId)) {
                console.warn("[Audio] Prevented Duplicate Event Replay:", msgId);
                return;
            }
            if (msgId) {
                processedEvents.current.add(msgId);
                // Cleanup old IDs periodically? Keep set usage low.
                if (processedEvents.current.size > 50) {
                    const it = processedEvents.current.values();
                    processedEvents.current.delete(it.next().value!);
                }
            }

            if (data.type === 'AUDIO_UPDATE') {
                const { track, playing } = data.payload;
                console.log("[Audio] Rx Music Update:", track?.title);
                setCurrentMusic(track);
                setIsPlaying(playing);
                setAudioBlocked(false);
            } else if (data.type === 'SFX_TRIGGER') {
                const { track } = data.payload;
                console.log("[Audio] Rx SFX Trigger:", track?.title);
                playSfxLocal(track);
            } else if (data.type === 'ROLL_RESULT') {
                const roll = data.payload?.roll;
                if (roll) {
                    handleRollSfx(roll, volume);
                }
            }
        });
        return cleanup;
    }, [onMessage, peerId, volume]);

    const playMusic = useCallback(async (track: AudioTrack) => {
        setCurrentMusic(track);
        setIsPlaying(true);
        setAudioBlocked(false);

        if (isHost) {
            let urlToSend = track.url;
            // Convert Blob to DataURL for peers (syncing uploaded music)
            if (track.url.startsWith('blob:')) {
                try {
                    const blob = await fetch(track.url).then(r => r.blob());
                    if (blob.size < 5 * 1024 * 1024) { // 5MB limit for music (PeerJS can handle it, but it takes bandwidth)
                        urlToSend = await new Promise((resolve) => {
                            const reader = new FileReader();
                            reader.onloadend = () => resolve(reader.result as string);
                            reader.readAsDataURL(blob);
                        });
                    } else {
                        console.warn("Music file too large to sync P2P:", blob.size);
                    }
                } catch (e) {
                    console.error("Failed to convert Music blob:", e);
                }
            }

            broadcast({
                type: 'AUDIO_UPDATE',
                payload: { track: { ...track, url: urlToSend }, playing: true }
            } as any);
        }
    }, [isHost, broadcast]);

    const stopMusic = useCallback(() => {
        setIsPlaying(false);
        if (isHost) {
            broadcast({
                type: 'AUDIO_UPDATE',
                payload: { track: currentMusic, playing: false }
            } as any);
        }
    }, [isHost, broadcast, currentMusic]);

    const togglePlay = useCallback(() => {
        const newState = !isPlaying;
        setIsPlaying(newState);
        if (isHost) {
            broadcast({
                type: 'AUDIO_UPDATE',
                payload: { track: currentMusic, playing: newState }
            } as any);
        }
    }, [isPlaying, isHost, broadcast, currentMusic]);

    const playSfxLocal = (track: AudioTrack) => {
        console.log("[Audio] Playing SFX Local:", track.title);
        if (track.synthType) {
            playSynthSound(track.synthType, volume * (track.volume ?? 1.0));
            return;
        }
        if (!track.url) return;
        try {
            const sfx = new Audio(track.url);
            sfx.volume = Math.max(0, Math.min(1, volume * (track.volume ?? 1.0)));
            sfx.onended = () => { sfx.src = ''; };
            sfx.play().catch(e => {
                console.error("SFX Play Error:", e);
                setAudioBlocked(true);
            });
        } catch (e) {
            console.error("SFX Init Error:", e);
        }
    };

    // Automatic Local Roll Audio Listener (Dice impact & Crit/Fumble chimes)
    useEffect(() => {
        const handleRollAudio = (e: Event) => {
            const customEvent = e as CustomEvent;
            const rollData = customEvent.detail;
            if (rollData) {
                handleRollSfx(rollData, volume);
            }
        };

        window.addEventListener('rpg_broadcast_roll', handleRollAudio);
        return () => window.removeEventListener('rpg_broadcast_roll', handleRollAudio);
    }, [volume]);

    const playSfx = useCallback(async (track: AudioTrack) => {
        playSfxLocal(track); // Play immediately for self
        if (isHost) {
            let urlToSend = track.url;

            // If it's a local Blob, we must convert to DataURL for peers to hear it
            if (track.url.startsWith('blob:')) {
                try {
                    const blob = await fetch(track.url).then(r => r.blob());
                    // Limit: prevent sending massive files via this method (e.g. > 1MB) to avoid channel crash
                    if (blob.size < 1.5 * 1024 * 1024) { // 1.5MB limit
                        urlToSend = await new Promise((resolve) => {
                            const reader = new FileReader();
                            reader.onloadend = () => resolve(reader.result as string);
                            reader.readAsDataURL(blob);
                        });
                    } else {
                        console.warn("SFX too large to broadcast:", blob.size);
                        // Fallback: Send original (will fail on peer, but prevents crash)
                    }
                } catch (e) {
                    console.error("Failed to convert SFX blob:", e);
                }
            }

            broadcast({
                type: 'SFX_TRIGGER',
                payload: { track: { ...track, url: urlToSend } }
            } as any);
        }
    }, [isHost, broadcast, volume]);

    const unlockAudio = useCallback(() => {
        setAudioBlocked(false);
        if (currentMusic && !isYouTube(currentMusic.url)) {
            // Force native play attempt
            musicRef.current?.play().catch(() => setAudioBlocked(true));
        }
        setIsPlaying(true);
    }, [currentMusic, isYouTube]);



    return (
        <AudioContext.Provider value={{
            currentMusic,
            isPlaying,
            volume,
            playMusic,
            stopMusic,
            playSfx,
            setVolume,
            togglePlay,
            audioBlocked,
            unlockAudio
        }}>
            {children}
        </AudioContext.Provider>
    );
};

export const useAudio = () => {
    const context = useContext(AudioContext);
    if (!context) throw new Error("useAudio must be used within AudioProvider");
    return context;
};
