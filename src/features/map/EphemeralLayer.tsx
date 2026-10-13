import React, { useState, useEffect, useRef } from 'react';
import { useMap } from './MapContext';
import { usePeer } from '../multiplayer/SocketContext';
import { playSynthSound } from '../audio/audioSynth';
import type { MapPing } from './mapTypes';

interface EphemeralLayerProps {
    scale: number;
}

export const EphemeralLayer: React.FC<EphemeralLayerProps> = ({ scale }) => {
    const { interactionMode, config } = useMap();
    const { broadcast, isConnected } = usePeer();

    interface Point { x: number; y: number; t: number; }
    const [traces, setTraces] = useState<Record<string, Point[]>>({});
    const [isDrawing, setIsDrawing] = useState(false);

    // Laser Cursor Position
    const [cursorPos, setCursorPos] = useState<{ x: number, y: number } | null>(null);

    // Active Pings on Map
    const [pings, setPings] = useState<MapPing[]>([]);

    const myColor = useRef('#' + Math.floor(Math.random() * 16777215).toString(16)).current;

    // Throttling for broadcast
    const lastBroadcast = useRef(0);
    const pendingPoints = useRef<Point[]>([]);

    // --- Time Loop (Animation, Laser & Ping Pruning) ---
    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now();

            // 1. Prune traces older than 500ms
            setTraces(prev => {
                const next = { ...prev };
                let changed = false;

                Object.keys(next).forEach(key => {
                    const filtered = next[key].filter(p => now - p.t < 500);
                    if (filtered.length !== next[key].length) {
                        next[key] = filtered;
                        changed = true;
                    }
                    if (filtered.length === 0) {
                        delete next[key];
                        changed = true;
                    }
                });

                return changed ? next : prev;
            });

            // 2. Prune pings older than 3500ms (3.5s)
            setPings(prev => {
                const active = prev.filter(p => now - p.timestamp < 3500);
                return active.length !== prev.length ? active : prev;
            });
        }, 40);
        return () => clearInterval(interval);
    }, []);

    // --- Networking & Events ---
    useEffect(() => {
        const handlePeerEvent = (e: CustomEvent) => {
            const msg = e.detail;
            if (msg.type === 'EPHEMERAL_GESTURE' && msg.payload.type === 'stream_points') {
                const key = msg.payload.id || 'unknown';
                const newPoints = msg.payload.points.map((p: any) => ({ ...p, t: Date.now() }));

                setTraces(prev => ({
                    ...prev,
                    [key]: [...(prev[key] || []), ...newPoints]
                }));
            } else if (msg.type === 'MAP_PING') {
                setPings(prev => [...prev, msg.payload]);
                playSynthSound('magic', 0.2);
            }
        };

        const handleLocalPing = (e: CustomEvent<MapPing>) => {
            setPings(prev => [...prev, e.detail]);
        };

        window.addEventListener('rpg_peer_event' as any, handlePeerEvent);
        window.addEventListener('rpg_map_ping' as any, handleLocalPing);
        return () => {
            window.removeEventListener('rpg_peer_event' as any, handlePeerEvent);
            window.removeEventListener('rpg_map_ping' as any, handleLocalPing);
        };
    }, []);

    const handleMouseDown = () => setIsDrawing(true);

    const handleMouseMove = (e: React.MouseEvent) => {
        // Always track cursor for Laser Dot if in draw mode
        if (interactionMode === 'draw') {
            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
            const x = (e.clientX - rect.left) / scale;
            const y = (e.clientY - rect.top) / scale;
            setCursorPos({ x, y });
        }

        if (!isDrawing && interactionMode !== 'draw') return;
        if (!isDrawing) return;

        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const x = (e.clientX - rect.left) / scale;
        const y = (e.clientY - rect.top) / scale;

        const now = Date.now();
        const p = { x, y, t: now };

        // 1. Add locally
        setTraces(prev => ({
            ...prev,
            'local': [...(prev['local'] || []), p]
        }));

        // 2. Queue for broadcast
        pendingPoints.current.push({ x, y, t: 0 });

        // 3. Broadcast throttled
        if (now - lastBroadcast.current > 50) {
            flushPoints();
            lastBroadcast.current = now;
        }
    };

    const flushPoints = () => {
        if (pendingPoints.current.length === 0) return;
        if (isConnected) {
            broadcast({
                type: 'EPHEMERAL_GESTURE',
                payload: {
                    type: 'stream_points',
                    id: myColor,
                    points: pendingPoints.current,
                    color: myColor
                }
            });
        }
        pendingPoints.current = [];
    };

    const handleMouseUp = () => {
        setIsDrawing(false);
        flushPoints();
    };

    if (interactionMode !== 'draw') {
        return <LayerRender traces={traces} pings={pings} gridSize={config.gridSize} scale={scale} />;
    }

    return (
        <div
            style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                zIndex: 600, cursor: 'none', // Hide default cursor for Laser effect
                pointerEvents: 'auto'
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => { handleMouseUp(); setCursorPos(null); }}
        >
            <LayerRender traces={traces} pings={pings} gridSize={config.gridSize} scale={scale} />

            {/* Custom Laser Cursor */}
            {cursorPos && (
                <div style={{
                    position: 'absolute',
                    left: cursorPos.x, top: cursorPos.y,
                    width: '8px', height: '8px',
                    borderRadius: '50%',
                    background: 'red',
                    boxShadow: '0 0 10px 4px rgba(255, 0, 0, 0.6), 0 0 4px white',
                    pointerEvents: 'none',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 602
                }} />
            )}
        </div>
    );
};

const LayerRender: React.FC<{
    traces: Record<string, any[]>;
    pings: MapPing[];
    gridSize: number;
    scale: number;
}> = ({ traces, pings, gridSize, scale }) => (
    <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
        <defs>
            <style>{`
                @keyframes sonarPulse {
                    0% {
                        r: 6px;
                        opacity: 0.95;
                        stroke-width: 3.5px;
                    }
                    60% {
                        opacity: 0.6;
                        stroke-width: 2px;
                    }
                    100% {
                        r: 60px;
                        opacity: 0;
                        stroke-width: 1px;
                    }
                }
                @keyframes badgeFade {
                    0% { opacity: 0; transform: translateY(4px) scale(0.9); }
                    10% { opacity: 1; transform: translateY(0) scale(1); }
                    80% { opacity: 1; transform: translateY(0) scale(1); }
                    100% { opacity: 0; transform: translateY(-4px) scale(0.95); }
                }
                .sonar-ring {
                    transform-origin: center;
                    animation: sonarPulse 1.8s cubic-bezier(0.2, 0.6, 0.35, 1) infinite;
                }
                .ring-delay-1 { animation-delay: 0s; }
                .ring-delay-2 { animation-delay: 0.6s; }
                .ring-delay-3 { animation-delay: 1.2s; }
            `}</style>
        </defs>

        {/* 1. Traces do Laser */}
        {Object.entries(traces).map(([key, points]) => {
            if (points.length < 2) return null;
            const color = key === 'local' ? 'red' : (key.startsWith('#') ? key : 'red');

            return (
                <polyline
                    key={key}
                    points={points.map(p => `${p.x},${p.y}`).join(' ')}
                    fill="none"
                    stroke={color}
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.8"
                />
            );
        })}

        {/* 2. Pings Sonar/Radar */}
        {pings.map(ping => {
            const pixelX = ping.x * gridSize;
            const pixelY = ping.y * gridSize;

            return (
                <g key={ping.id} transform={`translate(${pixelX}, ${pixelY})`}>
                    <circle className="sonar-ring ring-delay-1" cx="0" cy="0" fill="none" stroke={ping.color} />
                    <circle className="sonar-ring ring-delay-2" cx="0" cy="0" fill="none" stroke={ping.color} />
                    <circle className="sonar-ring ring-delay-3" cx="0" cy="0" fill="none" stroke={ping.color} />
                    <circle
                        cx="0" cy="0" r="5"
                        fill={ping.color}
                        style={{ filter: `drop-shadow(0 0 6px ${ping.color})` }}
                    />
                    <foreignObject
                        x="-100"
                        y="-45"
                        width="200"
                        height="40"
                        style={{ overflow: 'visible', pointerEvents: 'none' }}
                    >
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            transform: `scale(${1 / Math.max(scale, 0.4)})`,
                            transformOrigin: 'bottom center',
                            animation: 'badgeFade 3.5s ease forwards'
                        }}>
                            <div style={{
                                background: 'rgba(15, 16, 24, 0.9)',
                                border: `1px solid ${ping.color}`,
                                borderRadius: '12px',
                                padding: '3px 8px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px',
                                boxShadow: `0 0 10px ${ping.color}44, 0 4px 12px rgba(0,0,0,0.6)`,
                                backdropFilter: 'blur(4px)',
                                whiteSpace: 'nowrap'
                            }}>
                                <span style={{
                                    width: '6px', height: '6px',
                                    borderRadius: '50%',
                                    background: ping.color,
                                    boxShadow: `0 0 5px ${ping.color}`
                                }} />
                                <span style={{
                                    color: '#ffffff',
                                    fontSize: '11px',
                                    fontWeight: 'bold',
                                    letterSpacing: '0.3px'
                                }}>
                                    {ping.senderName}
                                </span>
                            </div>
                        </div>
                    </foreignObject>
                </g>
            );
        })}
    </svg>
);
