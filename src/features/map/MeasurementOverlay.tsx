import React, { useState } from 'react';
import { useMap } from './MapContext';

interface MeasurementOverlayProps {
    scale: number;
}

export const MeasurementOverlay: React.FC<MeasurementOverlayProps> = ({ scale }) => {
    const { config, interactionMode } = useMap();
    const [startPoint, setStartPoint] = useState<{ x: number, y: number } | null>(null);
    const [currentPoint, setCurrentPoint] = useState<{ x: number, y: number } | null>(null);
    const [isMeasuring, setIsMeasuring] = useState(false);

    if (interactionMode !== 'measure') return null;

    const handleMouseDown = (e: React.MouseEvent) => {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const x = (e.clientX - rect.left) / scale;
        const y = (e.clientY - rect.top) / scale;
        setStartPoint({ x, y });
        setCurrentPoint({ x, y });
        setIsMeasuring(true);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isMeasuring) return;
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const x = (e.clientX - rect.left) / scale;
        const y = (e.clientY - rect.top) / scale;
        setCurrentPoint({ x, y });
    };

    const handleMouseUp = () => {
        setIsMeasuring(false);
        setStartPoint(null);
        setCurrentPoint(null);
    };

    // Calculate metrics
    let distanceMeters = 0;
    let distanceSquares = 0;

    if (startPoint && currentPoint) {
        // Convert pixels to grid coords
        const startGX = Math.floor(startPoint.x / config.gridSize);
        const startGY = Math.floor(startPoint.y / config.gridSize);
        const endGX = Math.floor(currentPoint.x / config.gridSize);
        const endGY = Math.floor(currentPoint.y / config.gridSize);

        const dx = Math.abs(endGX - startGX);
        const dy = Math.abs(endGY - startGY);

        // Chebyshev (D&D 5e standard variant) or Euclidean? 
        // User asked for "igual outros vtt", usually euclidean for free ruler, but grid-snap for movement.
        // Let's use Euclidean for the line length visualization, but display grid squares too.

        // Grid Distance (Chebyshev)
        const squares = Math.max(dx, dy);
        distanceSquares = squares;
        distanceMeters = squares * 1.5;

        // Exact Euclidean distance in meters (optional, for precision)
        // const pixelDist = Math.sqrt(Math.pow(currentPoint.x - startPoint.x, 2) + Math.pow(currentPoint.y - startPoint.y, 2));
        // const exactMeters = (pixelDist / config.gridSize) * 1.5;
    }

    return (
        <div
            style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                zIndex: 500, cursor: 'crosshair',
                pointerEvents: 'auto' // Capture events
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            {isMeasuring && startPoint && currentPoint && (
                <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
                    {/* Line */}
                    <line
                        x1={startPoint.x} y1={startPoint.y}
                        x2={currentPoint.x} y2={currentPoint.y}
                        stroke="#00d2ff"
                        strokeWidth="3"
                        strokeDasharray="10, 5"
                    />
                    {/* Start Dot */}
                    <circle cx={startPoint.x} cy={startPoint.y} r="4" fill="#00d2ff" />
                    {/* End Dot */}
                    <circle cx={currentPoint.x} cy={currentPoint.y} r="4" fill="#00d2ff" />

                    {/* Label */}
                    {(Math.abs(currentPoint.x - startPoint.x) > 5 || Math.abs(currentPoint.y - startPoint.y) > 5) && (
                        <foreignObject
                            x={Math.min(startPoint.x, currentPoint.x) + Math.abs(currentPoint.x - startPoint.x) / 2}
                            y={Math.min(startPoint.y, currentPoint.y) + Math.abs(currentPoint.y - startPoint.y) / 2}
                            width="150" height="50"
                            style={{ overflow: 'visible' }}
                        >
                            <div style={{
                                background: 'rgba(0,0,0,0.8)', color: '#fff',
                                padding: '4px 8px', borderRadius: '4px',
                                fontSize: '14px', whiteSpace: 'nowrap',
                                border: '1px solid #00d2ff',
                                transform: 'translate(-50%, -50%)',
                                textAlign: 'center'
                            }}>
                                <strong>{distanceMeters.toFixed(1)}m</strong>
                                <div style={{ fontSize: '10px', color: '#ccc' }}>{distanceSquares} sq</div>
                            </div>
                        </foreignObject>
                    )}
                </svg>
            )}
        </div>
    );
};
