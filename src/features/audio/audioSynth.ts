// Procedural Sound Synthesizer using Web Audio API
// Generates responsive, zero-latency RPG sound effects without external file dependencies

let synthAudioContext: AudioContext | null = null;

function getSynthContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    try {
        if (!synthAudioContext) {
            const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioCtx) {
                synthAudioContext = new AudioCtx();
            }
        }
        if (synthAudioContext && synthAudioContext.state === 'suspended') {
            synthAudioContext.resume().catch(() => {});
        }
        return synthAudioContext;
    } catch {
        return null;
    }
}

export type SynthSoundType = 'dice' | 'magic' | 'crit' | 'fumble' | 'heal' | 'sword' | 'rest';

export function playSynthSound(type: SynthSoundType, volume = 0.5): void {
    const ctx = getSynthContext();
    if (!ctx) return;

    const masterGain = ctx.createGain();
    const safeVol = Math.max(0, Math.min(1, volume));
    masterGain.gain.setValueAtTime(safeVol, ctx.currentTime);
    masterGain.connect(ctx.destination);

    const now = ctx.currentTime;

    switch (type) {
        case 'dice': {
            // Simulate 4 rapid dice impacts / clicks on wood/felt
            const numBounces = 4;
            for (let i = 0; i < numBounces; i++) {
                const bounceTime = now + (i * 0.055) + (Math.random() * 0.02);
                const decay = 0.035 + (i * 0.01);

                // Noise burst
                const bufferSize = Math.floor(ctx.sampleRate * decay);
                const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
                const data = buffer.getChannelData(0);
                for (let j = 0; j < bufferSize; j++) {
                    data[j] = (Math.random() * 2 - 1) * Math.exp(-j / (bufferSize * 0.25));
                }

                const noise = ctx.createBufferSource();
                noise.buffer = buffer;

                // Bandpass filter to sound like resin/plastic dice
                const filter = ctx.createBiquadFilter();
                filter.type = 'bandpass';
                filter.frequency.setValueAtTime(800 + (Math.random() * 600), bounceTime);
                filter.Q.setValueAtTime(3.0, bounceTime);

                const gain = ctx.createGain();
                const bounceVol = Math.max(0.1, 1 - (i * 0.22));
                gain.gain.setValueAtTime(bounceVol, bounceTime);
                gain.gain.exponentialRampToValueAtTime(0.001, bounceTime + decay);

                noise.connect(filter);
                filter.connect(gain);
                gain.connect(masterGain);

                noise.start(bounceTime);
            }
            break;
        }

        case 'magic': {
            // Arcane spell sweep: dual sine oscillators sweeping up with subtle modulation
            const osc1 = ctx.createOscillator();
            const osc2 = ctx.createOscillator();
            const gain = ctx.createGain();

            osc1.type = 'sine';
            osc2.type = 'triangle';

            osc1.frequency.setValueAtTime(260, now);
            osc1.frequency.exponentialRampToValueAtTime(880, now + 0.35);

            osc2.frequency.setValueAtTime(390, now);
            osc2.frequency.exponentialRampToValueAtTime(1320, now + 0.4);

            gain.gain.setValueAtTime(0.001, now);
            gain.gain.exponentialRampToValueAtTime(0.6, now + 0.08);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

            osc1.connect(gain);
            osc2.connect(gain);
            gain.connect(masterGain);

            osc1.start(now);
            osc2.start(now);
            osc1.stop(now + 0.6);
            osc2.stop(now + 0.6);
            break;
        }

        case 'crit': {
            // Natural 20 Triumph: crystalline major triad bell chime (C5, E5, G5, C6)
            const freqs = [523.25, 659.25, 783.99, 1046.50];
            freqs.forEach((freq, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now + (idx * 0.04));

                gain.gain.setValueAtTime(0.001, now + (idx * 0.04));
                gain.gain.linearRampToValueAtTime(0.4, now + (idx * 0.04) + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.001, now + (idx * 0.04) + 0.9);

                osc.connect(gain);
                gain.connect(masterGain);

                osc.start(now + (idx * 0.04));
                osc.stop(now + (idx * 0.04) + 1.0);
            });
            break;
        }

        case 'fumble': {
            // Natural 1 Critical Failure: heavy low descending dissonant thud
            const osc1 = ctx.createOscillator();
            const osc2 = ctx.createOscillator();
            const gain = ctx.createGain();

            osc1.type = 'sawtooth';
            osc2.type = 'square';

            osc1.frequency.setValueAtTime(140, now);
            osc1.frequency.exponentialRampToValueAtTime(45, now + 0.5);

            osc2.frequency.setValueAtTime(148, now); // Detuned for harsh dissonance
            osc2.frequency.exponentialRampToValueAtTime(42, now + 0.5);

            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(500, now);
            filter.frequency.exponentialRampToValueAtTime(100, now + 0.5);

            gain.gain.setValueAtTime(0.4, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

            osc1.connect(filter);
            osc2.connect(filter);
            filter.connect(gain);
            gain.connect(masterGain);

            osc1.start(now);
            osc2.start(now);
            osc1.stop(now + 0.6);
            osc2.stop(now + 0.6);
            break;
        }

        case 'heal': {
            // Restorative soothing chime: warm ascending pentatonic swell
            const freqs = [329.63, 392.00, 493.88, 659.25];
            freqs.forEach((freq, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now + (idx * 0.08));

                gain.gain.setValueAtTime(0.001, now + (idx * 0.08));
                gain.gain.linearRampToValueAtTime(0.35, now + (idx * 0.08) + 0.04);
                gain.gain.exponentialRampToValueAtTime(0.001, now + (idx * 0.08) + 0.8);

                osc.connect(gain);
                gain.connect(masterGain);

                osc.start(now + (idx * 0.08));
                osc.stop(now + (idx * 0.08) + 0.9);
            });
            break;
        }

        case 'sword': {
            // Sharp steel slash & blade resonance
            const osc = ctx.createOscillator();
            const oscGain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(1400, now);
            osc.frequency.exponentialRampToValueAtTime(400, now + 0.12);

            oscGain.gain.setValueAtTime(0.4, now);
            oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

            osc.connect(oscGain);
            oscGain.connect(masterGain);
            osc.start(now);
            osc.stop(now + 0.15);

            // High friction swish
            const bufferSize = Math.floor(ctx.sampleRate * 0.12);
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let j = 0; j < bufferSize; j++) {
                data[j] = (Math.random() * 2 - 1) * Math.exp(-j / (bufferSize * 0.3));
            }
            const noise = ctx.createBufferSource();
            noise.buffer = buffer;

            const filter = ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(2200, now);
            filter.Q.setValueAtTime(2.5, now);

            const noiseGain = ctx.createGain();
            noiseGain.gain.setValueAtTime(0.5, now);
            noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

            noise.connect(filter);
            filter.connect(noiseGain);
            noiseGain.connect(masterGain);
            noise.start(now);
            break;
        }

        case 'rest': {
            // Campfire peaceful harmonic progression (F3, A3, C4, E4)
            const freqs = [174.61, 220.00, 261.63, 329.63];
            freqs.forEach(freq => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now);

                gain.gain.setValueAtTime(0.001, now);
                gain.gain.linearRampToValueAtTime(0.2, now + 0.3);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

                osc.connect(gain);
                gain.connect(masterGain);

                osc.start(now);
                osc.stop(now + 1.3);
            });
            break;
        }
    }
}
