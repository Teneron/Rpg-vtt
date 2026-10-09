import React from 'react';
import type { MapToken, MapConfig } from './mapTypes';
import './Token.css';

interface TokenProps {
    token: MapToken;
    config: MapConfig;
    isDragging?: boolean;
    onPointerDown?: (e: React.PointerEvent) => void;

    // New Props to avoid Context Lookups
    isHost: boolean;
    isOwner: boolean;
    isActiveTurn: boolean;
    isTargeted: boolean;
}

// MEMOIZED TOKEN COMPONENT
// export const Token = React.memo<TokenProps>(({
export const Token: React.FC<TokenProps> = ({
    token, config, isDragging, onPointerDown,
    isHost, isOwner, isActiveTurn, isTargeted
}) => {
    const { gridSize } = config;
    const [hasError, setHasError] = React.useState(false);

    // Reset error if URL changes
    React.useEffect(() => {
        setHasError(false);
    }, [token.imageUrl]);

    // Determine current HP and Max HP from the token prop (already merged by parent)
    const currentHp = token.hp?.current || 0;
    const maxHp = token.hp?.max || 10;
    const hasHpData = !!token.hp;

    const hpPercent = maxHp > 0 ? (currentHp / maxHp) * 100 : 0;

    // Show HP if: (Admin OR Owner OR Publicly Visible) AND Data Exists
    const showHpBar = hasHpData && (isHost || isOwner || token.visibleStats);

    // Visibility Logic
    if (token.invisible && !isHost) return null; // HIDDEN FOR PLAYERS

    // Premium Feel: Cursor
    const cursorStyle = onPointerDown ? (isDragging ? 'grabbing' : (token.isLocked ? 'default' : 'grab')) : 'default';

    return (
        <div
            className={`map-token ${isActiveTurn ? 'active-turn' : ''}`}
            onPointerDown={(e) => onPointerDown && onPointerDown(e)}
            style={{
                width: token.size * gridSize,
                height: token.size * gridSize,
                // Round to avoid sub-pixel blurring
                left: Math.round(token.position.x * gridSize),
                top: Math.round(token.position.y * gridSize),
                backgroundColor: token.isAsset ? 'transparent' : token.color,
                fontSize: Math.max(12, gridSize * 0.4),
                cursor: cursorStyle,
                zIndex: isDragging ? 100 : (isActiveTurn ? 25 : (token.isAsset ? 1 : 10)),
                opacity: (token.invisible && isHost) ? 0.5 : 1, // GHOST MODE FOR GM
                filter: (token.invisible && isHost) ? 'grayscale(100%)' : 'none',
                // Optimize transition: remove 'left/top' transition if it causes blur during movement end? 
                // Actually, the cubic-bezier might end in sub-pixels? No, React handles the final value.
                transition: isDragging
                    ? 'box-shadow 0.2s, transform 0.2s'
                    : 'left 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), top 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.2s, transform 0.2s',
                boxShadow: isDragging
                    ? '0 15px 30px rgba(0,0,0,0.6)'
                    : (isActiveTurn ? '0 0 15px #ffd700, 0 0 30px #ffaa00' : '0 2px 5px rgba(0,0,0,0.4)'),
                transform: isDragging
                    ? 'scale(1.15) translateY(-5px)'
                    : `scale(1) rotate(${token.rotation || 0}deg) translateZ(0)`, // Force GPU but keep sharp?
                // Optimization: Will Change for transforms
                willChange: isDragging ? 'transform, left, top' : 'auto',

                // Asset overrides
                borderRadius: token.isAsset ? '0' : undefined, // CSS handles 50% default
                border: token.isAsset ? 'none' : undefined, // CSS handles 2px solid #fff default

                // FORCE SHARPNESS
                imageRendering: 'auto', // '-webkit-optimize-contrast' is often better but non-standard in TS. 'auto' usually valid. 
                // We'll add the webkit one via style cast or global CSS if needed.
                backfaceVisibility: 'hidden',
                WebkitFontSmoothing: 'subpixel-antialiased'
            }}
            title={(hasHpData && (isHost || isOwner)) ? `${token.name} (HP: ${currentHp}/${maxHp})` : token.name}
        >
            {/* HP Bar Overlay */}
            {showHpBar && (
                <div style={{
                    position: 'absolute',
                    top: '-6px',
                    left: '0',
                    width: '100%',
                    height: '4px',
                    background: 'red',
                    border: '1px solid #000',
                    pointerEvents: 'none',
                    zIndex: 50
                }}>
                    <div style={{
                        width: `${hpPercent}%`,
                        height: '100%',
                        background: hpPercent > 50 ? '#00ff00' : hpPercent > 20 ? '#ffff00' : '#ff0000',
                        transition: 'width 0.3s ease'
                    }} />
                </div>
            )}

            {token.imageUrl && !hasError ? (
                <img
                    src={token.imageUrl}
                    alt={token.name}
                    onError={() => setHasError(true)}
                    style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: token.isAsset ? '0' : '50%',
                        objectFit: 'contain',
                        pointerEvents: 'none', // Prevent dragging image ghost
                        // Ensure image itself is rendered nicely
                        transform: 'translateZ(0)',
                        backfaceVisibility: 'hidden',
                    }}
                    loading="lazy"
                />
            ) : (
                <div style={{
                    width: '100%', height: '100%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: token.color, borderRadius: '50%',
                    color: '#fff', fontWeight: 'bold', fontSize: '1.2em',
                    border: '2px solid rgba(255,255,255,0.5)'
                }}>
                    {token.name.substring(0, 2).toUpperCase()}
                </div>
            )}

            {/* Active Turn Indicator (Arrow) */}
            {isActiveTurn && (
                <div style={{
                    position: 'absolute',
                    top: '-35px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '0',
                    height: '0',
                    borderLeft: '12px solid transparent',
                    borderRight: '12px solid transparent',
                    borderTop: '20px solid #ffd700',
                    filter: 'drop-shadow(0 0 5px #ffaa00)',
                    zIndex: 30,
                    animation: 'bounce 1s infinite'
                }} />
            )}

            {/* Target Reticle */}
            {isTargeted && (
                <div style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    width: '100%',
                    height: '100%',
                    border: '3px solid #ff0000',
                    borderRadius: token.isAsset ? '4px' : '50%',
                    boxShadow: '0 0 10px #ff0000, inset 0 0 10px #ff0000',
                    zIndex: 20,
                    pointerEvents: 'none',
                    animation: 'pulse-target 1.5s infinite'
                }}>
                    <div style={{ position: 'absolute', top: '50%', left: '-10%', width: '120%', height: '2px', background: 'rgba(255,0,0,0.5)' }} />
                    <div style={{ position: 'absolute', top: '-10%', left: '50%', width: '2px', height: '120%', background: 'rgba(255,0,0,0.5)' }} />
                </div>
            )}

            {/* Elevation Badge */}
            {typeof token.elevation === 'number' && token.elevation > 0 && (
                <div style={{
                    position: 'absolute',
                    bottom: '-6px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'rgba(30, 64, 175, 0.92)',
                    color: '#93c5fd',
                    border: '1px solid #60a5fa',
                    borderRadius: '8px',
                    padding: '1px 6px',
                    fontSize: '0.62rem',
                    fontWeight: 'bold',
                    pointerEvents: 'none',
                    zIndex: 40,
                    whiteSpace: 'nowrap',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.6)'
                }}>
                    ↑ {token.elevation}m
                </div>
            )}

            {/* Conditions Badges */}
            {token.conditions && token.conditions.length > 0 && (
                <div style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-6px',
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    maxWidth: '80px',
                    gap: '2px',
                    pointerEvents: 'none',
                    zIndex: 45
                }}>
                    {token.conditions.map(cond => (
                        <span
                            key={cond}
                            style={{
                                background: '#7f1d1d',
                                color: '#fca5a5',
                                border: '1px solid #ef4444',
                                borderRadius: '4px',
                                padding: '1px 4px',
                                fontSize: '0.55rem',
                                fontWeight: 'bold',
                                lineHeight: 1,
                                boxShadow: '0 1px 4px rgba(0,0,0,0.7)'
                            }}
                        >
                            {cond}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};
/*, (prev, next) => {
    // Custom Comparison Function
    // Return true if equal (do not re-render)

    // 1. Primitive checks
    if (prev.isDragging !== next.isDragging) return false;
    if (prev.isActiveTurn !== next.isActiveTurn) return false;
    if (prev.isTargeted !== next.isTargeted) return false;
    if (prev.isHost !== next.isHost) return false;
    if (prev.isOwner !== next.isOwner) return false;
    if (prev.config.gridSize !== next.config.gridSize) return false;

    // 2. Token Data checks
    const t1 = prev.token;
    const t2 = next.token;

    if (t1.id !== t2.id) return false;
    if (t1.name !== t2.name) return false;
    if (t1.color !== t2.color) return false;
    if (t1.size !== t2.size) return false;
    if (t1.imageUrl !== t2.imageUrl) return false;
    if (t1.rotation !== t2.rotation) return false;
    if (t1.invisible !== t2.invisible) return false;

    // Position
    if (t1.position.x !== t2.position.x || t1.position.y !== t2.position.y) return false;

    // HP - Deep check needed?
    // Parent merges HP, so checks if object reference is different?
    // If parent creates new object every time, t1.hp !== t2.hp always.
    // So we must check values.
    if (t1.hp?.current !== t2.hp?.current) return false;
    if (t1.hp?.max !== t2.hp?.max) return false;
    if (t1.hp?.temp !== t2.hp?.temp) return false;

    return true; // Everything relevant is same
});*/
