import React, { useState } from 'react';
import { useMap } from './MapContext';
import { usePeer } from '../multiplayer/SocketContext';
import type { Wall } from './mapTypes';

interface WallLayerProps {
    scale: number;
}

export const WallLayer: React.FC<WallLayerProps> = ({ scale }) => {
    const { config, addWall, removeWall, walls, interactionMode } = useMap(); // Added removeWall
    const { isHost } = usePeer();
    const { gridSize } = config;

    const [isDrawing, setIsDrawing] = useState(false);
    const [startPos, setStartPos] = useState<{ x: number, y: number } | null>(null);
    const [currentPos, setCurrentPos] = useState<{ x: number, y: number } | null>(null);

    // Only host can edit walls
    const canEdit = isHost && interactionMode === 'wall';

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!canEdit || e.button !== 0) return; // Only Left Click to Draw
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const x = (e.clientX - rect.left) / scale / gridSize;
        const y = (e.clientY - rect.top) / scale / gridSize;

        setIsDrawing(true);
        setStartPos({ x, y });
        setCurrentPos({ x, y });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDrawing || !startPos) return;
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const x = (e.clientX - rect.left) / scale / gridSize;
        const y = (e.clientY - rect.top) / scale / gridSize;

        // Snap to grid intersections
        const snap = (v: number) => Math.round(v * 2) / 2;
        setCurrentPos({ x: snap(x), y: snap(y) });
    };

    const handleMouseUp = () => {
        if (isDrawing && startPos && currentPos) {
            const snap = (v: number) => Math.round(v * 2) / 2;
            const finalStart = { x: snap(startPos.x), y: snap(startPos.y) };
            const finalEnd = { x: snap(currentPos.x), y: snap(currentPos.y) };

            // Only add if length > 0
            if (finalStart.x !== finalEnd.x || finalStart.y !== finalEnd.y) {
                const newWall: Wall = {
                    id: crypto.randomUUID(),
                    start: finalStart,
                    end: finalEnd,
                    type: 'wall',
                    color: 'red'
                };

                // Use addWall from context (Syncs correctly)
                addWall(newWall);
            }
        }
        setIsDrawing(false);
        setStartPos(null);
        setCurrentPos(null);
    };

    const [hoveredWallId, setHoveredWallId] = useState<string | null>(null);

    return (
        <React.Fragment>
            {/* Interaction Layer for Wall Drawing - Only when editing */}
            {canEdit && (
                <div
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 600, cursor: 'crosshair' }}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    // Prevent Context Menu on Draw Layer to allow it to pass through to formatting lines if clicked directly? 
                    // Actually, if this div covers everything, we can't click the lines UNDER it unless we manage events carefully.
                    // The drawing layer captures ALL pointer events. This makes clicking individual walls impossible if this layer is active (Drawing Mode).
                    // FIX: Draw Layer should strictly be for drawing. 
                    // While drawing, we cover. When NOT drawing (just hover), maybe we pass through?
                    // But we are in "Wall Mode".
                    // Let's rely on SVG elements having higher z-index or handle deletion HERE by checking distance to walls?
                    // No, simpler: SVG elements for interaction should be ON TOP of this div if proper z-index is used.
                    // SVG is 601. Div is 600. So SVG lines receive clicks!
                    onContextMenu={(e) => e.preventDefault()}
                />
            )}

            {/* Render Walls only if in Wall Mode (Edit Mode) for Immersion */}
            {interactionMode === 'wall' && (
                <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 601 }}>
                    {(walls || []).map(wall => (
                        <React.Fragment key={wall.id}>
                            {/* Visible Wall */}
                            <line
                                x1={wall.start.x * gridSize} y1={wall.start.y * gridSize}
                                x2={wall.end.x * gridSize} y2={wall.end.y * gridSize}
                                stroke={wall.id === hoveredWallId ? '#ff00ff' : (wall.color || 'red')} // Highlight on Hover
                                strokeWidth={wall.id === hoveredWallId ? 6 : 4}
                                strokeLinecap="round"
                                opacity={0.8}
                                style={{ pointerEvents: 'none' }}
                            />

                            {/* Interaction Hitbox - Only Host can Interact */}
                            {isHost && (
                                <line
                                    x1={wall.start.x * gridSize} y1={wall.start.y * gridSize}
                                    x2={wall.end.x * gridSize} y2={wall.end.y * gridSize}
                                    stroke="transparent"
                                    strokeWidth={30} // HUGE Hitbox
                                    style={{ cursor: 'pointer', pointerEvents: 'all' }} // USE ALL for reliable clicks
                                    onPointerEnter={() => setHoveredWallId(wall.id)}
                                    onPointerLeave={() => setHoveredWallId(null)}
                                    onContextMenu={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        // Confirm deletion
                                        if (window.confirm('Remover esta parede?')) {
                                            console.log('Deleting wall confirmed', wall.id);
                                            removeWall(wall.id);
                                        }
                                    }}
                                />
                            )}
                        </React.Fragment>
                    ))}

                    {/* Preview Drawing Line */}
                    {isDrawing && startPos && currentPos && (
                        <line
                            x1={startPos.x * gridSize} y1={startPos.y * gridSize}
                            x2={currentPos.x * gridSize} y2={currentPos.y * gridSize}
                            stroke="yellow"
                            strokeWidth={4}
                            strokeDasharray="5,5"
                        />
                    )}
                </svg>
            )}
        </React.Fragment>
    );
};
