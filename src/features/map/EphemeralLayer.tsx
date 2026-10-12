import React, { useState, useEffect, useRef } from 'react';
import { useMap } from './MapContext';
import { usePeer } from '../multiplayer/SocketContext';

interface EphemeralLayerProps {
    scale: number;
}

export const EphemeralLayer: React.FC<EphemeralLayerProps> = ({ scale }) => {
    const { interactionMode } = useMap();
    const { broadcast, isConnected } = usePeer();

    interface Point { x: number; y: number; t: number; }
    const [traces, setTraces] = useState<Record<string, Point[]>>({});
    const [isDrawing, setIsDrawing] = useState(false);

    // Laser Cursor Position
    const [cursorPos, setCursorPos] = useState<{ x: number, y: number } | null>(null);

    const myColor = useRef('#' + Math.floor(Math.random() * 16777215).toString(16)).current;

    // Throttling for broadcast
    const lastBroadcast = useRef(0);
    const pendingPoints = useRef<Point[]>([]);

    // --- Time Loop (Animation & Pruning) ---
    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now();
            setTraces(prev => {
                const next = { ...prev };
                let changed = false;

                Object.keys(next).forEach(key => {
                    // Prune points older than 500ms
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
        }, 30);
        return () => clearInterval(interval);
    }, []);

    // --- Networking ---
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
            }
        };
        window.addEventListener('rpg_peer_event' as any, handlePeerEvent);
        return () => window.removeEventListener('rpg_peer_event' as any, handlePeerEvent);
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
        return <LayerRender traces={traces} />;
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
            <LayerRender traces={traces} />

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

const LayerRender: React.FC<{ traces: Record<string, any[]> }> = ({ traces }) => (
    <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
        {Object.entries(traces).map(([key, points]) => {
            if (points.length < 2) return null;
            const color = key === 'local' ? 'red' : (key.startsWith('#') ? key : 'red'); // Default local to red laser too

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
    </svg>
);
