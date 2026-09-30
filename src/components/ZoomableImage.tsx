import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ZoomIn, ZoomOut, Maximize, Move } from 'lucide-react';

interface ZoomableImageProps {
    src: string;
    alt: string;
}

export const ZoomableImage: React.FC<ZoomableImageProps> = ({ src, alt }) => {
    const [scale, setScale] = useState(0.5); // Start zoomed out
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);

    // Calculate bounds based on current scale and dimensions
    const getBounds = useCallback(() => {
        if (!containerRef.current || !imgRef.current) return { x: 0, y: 0 };

        const { clientWidth: cw, clientHeight: ch } = containerRef.current;
        const { naturalWidth, naturalHeight } = imgRef.current;

        if (!naturalWidth) return { x: 0, y: 0 };

        const sw = naturalWidth * scale; // Scaled Width
        const sh = naturalHeight * scale; // Scaled Height

        // Range allows moving up to the edge difference from center
        // If scaled image > container: range = (sw - cw) / 2
        // If scaled image < container: range = 0 (force center)
        const rangeX = sw > cw ? (sw - cw) / 2 : 0;
        const rangeY = sh > ch ? (sh - ch) / 2 : 0;

        return { x: rangeX, y: rangeY };
    }, [scale]);

    // Clamp position whenever scale changes to ensure we don't end up out of bounds on zoom out
    useEffect(() => {
        const bounds = getBounds();
        setPosition(prev => ({
            x: Math.max(-bounds.x, Math.min(prev.x, bounds.x)),
            y: Math.max(-bounds.y, Math.min(prev.y, bounds.y))
        }));
    }, [scale, getBounds]);

    const handleWheel = (e: React.WheelEvent) => {
        e.preventDefault();
        const delta = e.deltaY * -0.001;
        const newScale = Math.min(Math.max(0.1, scale + delta), 4);
        setScale(newScale);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);
        // Record click position relative to current image position
        setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging) {
            e.preventDefault();
            const rawX = e.clientX - dragStart.x;
            const rawY = e.clientY - dragStart.y;

            // Apply Bounds
            const bounds = getBounds();
            const clampedX = Math.max(-bounds.x, Math.min(rawX, bounds.x));
            const clampedY = Math.max(-bounds.y, Math.min(rawY, bounds.y));

            setPosition({ x: clampedX, y: clampedY });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const zoomIn = () => setScale(s => Math.min(s + 0.2, 4));
    const zoomOut = () => setScale(s => Math.max(s - 0.2, 0.1));
    const reset = () => {
        setScale(0.5);
        setPosition({ x: 0, y: 0 });
    };

    return (
        <div
            style={{
                position: 'relative',
                width: '100%',
                height: '80vh',
                overflow: 'hidden',
                background: '#050505',
                border: '1px solid #444',
                borderRadius: '8px',
                cursor: isDragging ? 'grabbing' : 'grab'
            }}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            ref={containerRef}
        >
            {/* Controls */}
            <div style={{
                position: 'absolute', top: 10, right: 10, zIndex: 10,
                display: 'flex', flexDirection: 'column', gap: '5px',
                background: 'rgba(0,0,0,0.6)', padding: '5px', borderRadius: '8px'
            }}>
                <button onClick={zoomIn} style={btnStyle} title="Zoom In"><ZoomIn size={20} /></button>
                <button onClick={zoomOut} style={btnStyle} title="Zoom Out"><ZoomOut size={20} /></button>
                <button onClick={reset} style={btnStyle} title="Reset"><Maximize size={20} /></button>
                <div style={{ textAlign: 'center', color: '#fff', fontSize: '0.7rem' }}>{Math.round(scale * 100)}%</div>
            </div>

            <div style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                transformOrigin: 'center center',
                transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                width: '100%', height: '100%',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
                <img
                    ref={imgRef}
                    src={src}
                    alt={alt}
                    style={{
                        maxWidth: 'none',
                        pointerEvents: 'none',
                        display: 'block',
                        boxShadow: '0 0 20px rgba(0,0,0,0.5)' // Shadow to visualize edges
                    }}
                    draggable={false}
                    onLoad={() => {
                        // Force a re-calc of bounds when image loads
                        setScale(s => s);
                    }}
                />
            </div>

            <div style={{
                position: 'absolute', bottom: 10, left: 10,
                background: 'rgba(0,0,0,0.5)', padding: '5px 10px', borderRadius: '4px',
                color: '#aaa', fontSize: '0.8rem', pointerEvents: 'none'
            }}>
                <Move size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 5 }} />
                Arraste para mover • Scroll para Zoom
            </div>
        </div>
    );
};

const btnStyle = {
    background: 'none', border: 'none', color: '#fff',
    padding: '8px', cursor: 'pointer', borderRadius: '4px',
    display: 'flex', alignItems: 'center', justifyContent: 'center'
};
