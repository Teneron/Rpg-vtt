import React, { useEffect, useRef, useState } from 'react';
import { useMap } from './MapContext';
import { usePeer } from '../multiplayer/SocketContext';
import { useCombat } from '../combat/CombatContext';
import { GridLayer } from './GridLayer';
import { Token } from './Token';
import { MeasurementOverlay } from './MeasurementOverlay';
import { EphemeralLayer } from './EphemeralLayer';
import { WallLayer } from './WallLayer';
import { FogOfWarLayer, computeMapVisionZones, isTokenVisibleInZones } from './FogOfWarLayer';
import { TokenSettingsModal } from './TokenSettingsModal';
import { AssetSettingsModal } from './AssetSettingsModal';
import { MonsterRepository } from '../monsters/MonsterRepository';
import { EditableMonsterSheet } from '../monsters/EditableMonsterSheet';
import { playSynthSound } from '../audio/audioSynth';
import { Ruler, Plus, Minus } from 'lucide-react';
import type { MapPing } from './mapTypes';

const btnStyle = {
    background: '#333', color: '#fff', border: '1px solid #555',
    padding: '5px 10px', borderRadius: '4px', cursor: 'pointer'
};

const MemoizedGridLayer = React.memo(GridLayer);
const MemoizedWallLayer = React.memo(WallLayer);
const MemoizedFogOfWarLayer = React.memo(FogOfWarLayer);

export const BattleMap: React.FC = () => {
    const {
        config,
        tokens,
        walls,
        updateTokenPosition,
        addToken,
        interactionMode,
        setInteractionMode
    } = useMap();

    const { isHost, myCharacter, connectedPlayersData, broadcast, isConnected, username } = usePeer();

    // Map View State
    const [scale, setScale] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const lastPingTimeRef = useRef<number>(0);

    // Return to 'select' mode when pressing Escape in tool modes
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (
                    interactionMode === 'ping' ||
                    interactionMode === 'measure' ||
                    interactionMode === 'draw' ||
                    interactionMode === 'wall'
                ) {
                    setInteractionMode('select');
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [interactionMode, setInteractionMode]);

    const triggerPing = (clientX: number, clientY: number) => {
        const now = Date.now();
        if (now - lastPingTimeRef.current < 400) return;

        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;

        const rawX = (clientX - rect.left - offset.x) / scale;
        const rawY = (clientY - rect.top - offset.y) / scale;

        const gridX = rawX / config.gridSize;
        const gridY = rawY / config.gridSize;
        if (!Number.isFinite(gridX) || !Number.isFinite(gridY)) return;

        lastPingTimeRef.current = now;

        const playerName = myCharacter?.name || username || (isHost ? 'Mestre' : 'Jogador');
        const playerColor = isHost ? '#ef4444' : '#38bdf8';

        const pingPayload: MapPing = {
            id: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `ping-${now}-${Math.random().toString(36).slice(2, 8)}`,
            x: gridX,
            y: gridY,
            color: playerColor,
            senderName: playerName,
            timestamp: now
        };

        // 1. Emite localmente
        window.dispatchEvent(new CustomEvent('rpg_map_ping', { detail: pingPayload }));
        playSynthSound('magic', 0.25);

        // 2. Transmite aos outros jogadores via socket
        if (isConnected) {
            broadcast({
                type: 'MAP_PING',
                payload: pingPayload
            });
        }
    };

    // Panning State
    const [isPanning, setIsPanning] = useState(false);
    const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });

    const containerRef = useRef<HTMLDivElement>(null);

    // --- ZOOM/PAN ---
    const handleWheel = (e: React.WheelEvent) => {
        const zoomSensitivity = 0.001;
        const newScale = Math.min(Math.max(0.1, scale - e.deltaY * zoomSensitivity), 5);
        setScale(newScale);
    };

    // --- PREMIUM INTERACTION STATE ---
    const [selectedTokenId, setSelectedTokenId] = useState<string | null>(null);
    const [draggingTokenId, setDraggingTokenId] = useState<string | null>(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 }); // Offset within the token
    const [tempTokenPos, setTempTokenPos] = useState({ x: 0, y: 0 }); // Visual pos during drag (pixels)

    // --- DRAG RULER & LIMITS ---
    const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 }); // Pixel positions (center of token)
    const [dragMaxMovement, setDragMaxMovement] = useState<number | null>(null); // In Grid Units (ft or m)

    // --- MOUSE / POINTER HANDLERS ---

    // 1. Pan / Zoom (Wrapper)
    const handleWrapperPointerDown = (e: React.PointerEvent) => {
        // Disparo de Ping no Mapa via Alt + Clique ou Modo Ping
        if ((e.altKey && e.button === 0) || (interactionMode === 'ping' && e.button === 0)) {
            e.preventDefault();
            e.stopPropagation();
            triggerPing(e.clientX, e.clientY);
            return;
        }

        // If middle click or spacebar mode (future), or strictly background
        if (e.button === 1 || (interactionMode === 'select' && !draggingTokenId)) {
            e.preventDefault();
            setIsPanning(true);
            setLastMousePos({ x: e.clientX, y: e.clientY });
            (e.target as Element).setPointerCapture(e.pointerId);
        }
    };

    const handleWrapperPointerMove = (e: React.PointerEvent) => {
        // A. Panning
        if (isPanning) {
            const dx = e.clientX - lastMousePos.x;
            const dy = e.clientY - lastMousePos.y;
            setOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
            setLastMousePos({ x: e.clientX, y: e.clientY });
            return;
        }

        // B. Dragging Token
        if (draggingTokenId) {
            const rect = containerRef.current?.getBoundingClientRect();
            if (!rect) return;

            // Calculate raw map position
            const rawX = (e.clientX - rect.left - offset.x) / scale;
            const rawY = (e.clientY - rect.top - offset.y) / scale;

            // Apply internal offset so we drag from where we clicked
            let newX = rawX - dragOffset.x;
            let newY = rawY - dragOffset.y;

            // --- BOUNDARY CONSTRAINT ---
            const token = (tokens || []).find(t => t.id === draggingTokenId);
            const tokenUtfSize = (token?.size || 1) * config.gridSize; // Token size in pixels

            // Clamp to Map Edges (0 to width*gridSize - tokenSize)
            const mapWidthPx = config.width * config.gridSize;
            const mapHeightPx = config.height * config.gridSize;

            newX = Math.max(0, Math.min(newX, mapWidthPx - tokenUtfSize));
            newY = Math.max(0, Math.min(newY, mapHeightPx - tokenUtfSize));

            // --- MOVEMENT LIMIT CLAMPING (PREMIUM FEEL) ---
            if (dragMaxMovement !== null) {
                // Calculate vector from start
                const dx = newX - dragStartPos.x;
                const dy = newY - dragStartPos.y;
                const currentPxDist = Math.sqrt(dx * dx + dy * dy);

                // Max pixels allowed
                // If speed is 9m, grid is 1.5m -> 6 cells -> 6 * gridSize px
                const maxPx = (dragMaxMovement / 1.5) * config.gridSize;

                if (currentPxDist > maxPx) {
                    // Clamp to the max radius
                    const ratio = maxPx / currentPxDist;
                    newX = dragStartPos.x + dx * ratio;
                    newY = dragStartPos.y + dy * ratio;
                }
            }

            setTempTokenPos({ x: newX, y: newY });
        }
    };

    const handleWrapperPointerUp = (e: React.PointerEvent) => {
        if (isPanning) {
            setIsPanning(false);
            try {
                (e.target as Element).releasePointerCapture(e.pointerId);
            } catch {
                // Ignore if pointer was not captured
            }
        }

        if (draggingTokenId) {
            // Commit Move
            const token = (tokens || []).find(t => t.id === draggingTokenId);
            if (token) {
                // Snap to Grid
                const gridX = Math.round(tempTokenPos.x / config.gridSize);
                const gridY = Math.round(tempTokenPos.y / config.gridSize);

                if (token.position.x !== gridX || token.position.y !== gridY) {
                    playSynthSound('dice', 0.2);
                }
                updateTokenPosition(draggingTokenId, gridX, gridY);
            }

            setDraggingTokenId(null);
            setDragMaxMovement(null); // Reset limit
        }
    };

    // 2. Token Interaction
    const handleTokenPointerDown = (e: React.PointerEvent, token: any) => {
        // Disparo de Ping no Mapa sobre Token
        if ((e.altKey && e.button === 0) || (interactionMode === 'ping' && e.button === 0)) {
            e.preventDefault();
            e.stopPropagation();
            triggerPing(e.clientX, e.clientY);
            return;
        }

        // Prevent Right-Click from triggering Map Panning
        if (e.button === 2) {
            e.stopPropagation();
            return;
        }

        if (
            e.button !== 0 ||
            interactionMode === 'wall' ||
            interactionMode === 'fog' ||
            interactionMode === 'measure' ||
            interactionMode === 'draw'
        ) {
            return;
        }

        if (e.shiftKey) {
            e.stopPropagation();
            setTarget(combatState.currentTargetId === token.id ? null : token.id);
            return;
        }

        setSelectedTokenId(token.id); // Select on click

        const isOwner = myCharacter?.id === token.characterId;

        if (!isHost && !isOwner) {
            console.warn("Permission denied: You do not own this token.");
            return;
        }

        e.stopPropagation(); // Don't pan

        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;

        // Calc offset within token
        const rawX = (e.clientX - rect.left - offset.x) / scale;
        const rawY = (e.clientY - rect.top - offset.y) / scale;

        const tX = token.position.x * config.gridSize;
        const tY = token.position.y * config.gridSize;

        setDragOffset({ x: rawX - tX, y: rawY - tY });

        if (!token.isLocked) {
            setDraggingTokenId(token.id);
            setTempTokenPos({ x: tX, y: tY });
            setDragStartPos({ x: tX, y: tY }); // Track start for ruler
        }

        // --- FETCH SPEED LIMIT ---
        let moveLimit = 0;
        const linkedWrapper = Object.values(connectedPlayersData).find(p => p.character?.id === token.characterId);

        if (isHost) {
            moveLimit = 999; // GM has unlimited movement
        } else if (linkedWrapper) {
            moveLimit = linkedWrapper.character.speed;
        } else if (myCharacter && myCharacter.id === token.characterId) {
            moveLimit = myCharacter.speed;
        } else if (token.hp) {
            // Default for tokens without sheet
            moveLimit = 9;
        }

        setDragMaxMovement(moveLimit);
    };


    // Drag & Drop State
    const [isDragOver, setIsDragOver] = useState(false);

    // Side Bar Drop (HTML5 - Only for new tokens)
    const getGridPos = (clientX: number, clientY: number) => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return { x: 0, y: 0 };
        const rawX = (clientX - rect.left - offset.x) / scale;
        const rawY = (clientY - rect.top - offset.y) / scale;
        return {
            x: Math.floor(rawX / config.gridSize),
            y: Math.floor(rawY / config.gridSize)
        };
    };

    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        if (!isHost) {
            e.dataTransfer.dropEffect = 'none';
            return;
        }
        e.dataTransfer.dropEffect = 'copy';
    };

    const { addCombatant, combatState, setTarget } = useCombat();

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);

        if (!isHost) return;

        const { x: gridX, y: gridY } = getGridPos(e.clientX, e.clientY);

        // Only handle new monsters
        const monsterDataStr = e.dataTransfer.getData('monster_data');
        if (monsterDataStr) {
            try {
                const data = JSON.parse(monsterDataStr);
                const sizeMap: Record<string, number> = { 'Tiny': 0.5, 'Small': 1, 'Medium': 1, 'Large': 2, 'Huge': 3, 'Gargantuan': 4 };
                const size = (typeof data.size === 'string' ? sizeMap[data.size] : data.size) || 1;

                const tokenId = crypto.randomUUID();
                const combatantId = tokenId; // Use same ID for consistency

                // 1. Add Token to Map
                addToken({
                    id: tokenId,
                    combatantId: combatantId,
                    monsterId: data.id, // Ensure BestiarySidebar sends this
                    name: data.name,
                    position: { x: gridX, y: gridY },
                    color: '#dd0000',
                    imageUrl: data.imageUrl,
                    size: size,
                    hp: data.hp || { current: 10, max: 10 },
                    ac: data.ac || 10,
                    invisible: true // Default to Invisible for GM ease
                });

                // 2. Add to Combat Tracker (Auto-Roll Initiative or 0)
                addCombatant({
                    id: combatantId,
                    name: data.name,
                    initiative: Math.floor(Math.random() * 20) + 1, // Auto-roll simple init
                    isNPC: true,
                    hp: data.hp || { current: 10, max: 10 },
                    monsterId: data.id
                });

            } catch (err) {
                console.error("Error dropping monster:", err);
            }
        }
    };

    // --- TOKEN EDITING ---
    const [editingTokenId, setEditingTokenId] = useState<string | null>(null);

    // Helper: Calculate Distance for Ruler
    const getDragDistanceInfo = () => {
        if (!draggingTokenId) return null;

        const dx = tempTokenPos.x - dragStartPos.x;
        const dy = tempTokenPos.y - dragStartPos.y;
        const pxDist = Math.sqrt(dx * dx + dy * dy);

        // Cells moved (float)
        const cellDist = pxDist / config.gridSize;

        // Meters (assuming 1 cell = 1.5m)
        const meters = Math.round(cellDist * 1.5 * 10) / 10;

        // Check Limit
        const limitMeters = dragMaxMovement || 999;
        const isExceeded = meters > limitMeters;

        return { x: tempTokenPos.x, y: tempTokenPos.y, startX: dragStartPos.x, startY: dragStartPos.y, meters, isExceeded, limit: limitMeters };
    };

    const rulerInfo = getDragDistanceInfo();

    // Shared live vision zones (used both by FogOfWarLayer canvas and to hide unseen monsters inside explored shroud)
    const liveVisionZones = React.useMemo(() => {
        return computeMapVisionZones(
            config,
            tokens,
            walls,
            isHost,
            myCharacter,
            connectedPlayersData
        );
    }, [
        config.width,
        config.height,
        config.gridSize,
        config.fogEnabled,
        config.globalLight,
        tokens,
        walls,
        isHost,
        myCharacter,
        connectedPlayersData
    ]);

    // --- MEMOIZED TOKENS FOR PERFORMANCE ---
    // Prepare display tokens only when dependencies change
    const displayTokens = React.useMemo(() => {
        return (tokens || []).map((item) => {
            const isDragging = draggingTokenId === item.id;

            // Sync with peer data OR local myCharacter (for instant feedback)
            const isMe = myCharacter?.id === item.characterId;
            const linkedPeer = Object.values(connectedPlayersData).find(p => p.character?.id === item.characterId);
            const sourceChar = isMe ? myCharacter : linkedPeer?.character;

            return {
                ...item,
                ...(sourceChar && {
                    hp: sourceChar.hp || item.hp || { current: 10, max: 10, temp: 0 },
                    ac: sourceChar.armorClass || item.ac || 10,
                    name: sourceChar.name || item.name || 'Unknown',
                    imageUrl: sourceChar.imageUrl || item.imageUrl
                }),
                position: isDragging ? {
                    x: tempTokenPos.x / config.gridSize,
                    y: tempTokenPos.y / config.gridSize
                } : item.position,
                isDragging // Explicit flag for the component
            };
        });
    }, [tokens, connectedPlayersData, myCharacter, draggingTokenId, tempTokenPos.x, tempTokenPos.y, config.gridSize]);

    const isFogRestrictingPlayerSight = !isHost && config.fogEnabled !== false && config.globalLight !== 'bright';

    // Helper to render a single token (so we don't inline the function in JSX)
    const renderToken = (displayToken: any) => {
        const isOwner = myCharacter?.id === displayToken.characterId;
        const isAlliedPlayerToken = Boolean(displayToken.characterId) || isOwner;

        // Hide enemy/NPC creature tokens outside live sight so explored fog shroud (0.68 alpha) reveals terrain ONLY, never monsters!
        const isHiddenByFog = isFogRestrictingPlayerSight &&
            !isAlliedPlayerToken &&
            !displayToken.isAsset &&
            !isTokenVisibleInZones(displayToken, config.gridSize, liveVisionZones);

        const isActiveTurn = combatState.isActive && (
            combatState.activeTurnId === displayToken.id ||
            combatState.activeTurnId === displayToken.combatantId ||
            (displayToken.characterId && combatState.activeTurnId === displayToken.characterId)
        );
        const isTargeted = combatState.currentTargetId === displayToken.id ||
            (displayToken.characterId && combatState.currentTargetId === displayToken.characterId) ||
            (displayToken.combatantId && combatState.currentTargetId === displayToken.combatantId);

        return (
            <div
                key={`${displayToken.id}-${displayToken.imageUrl || 'default'}`}
                onContextMenu={(e) => {
                    e.preventDefault();
                    if (isHost) {
                        setEditingTokenId(displayToken.id);
                    }
                }}
                style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: 0,
                    height: 0,
                    pointerEvents: isHiddenByFog ? 'none' : undefined
                }}
            >
                <Token
                    token={displayToken}
                    config={config}
                    isDragging={displayToken.isDragging}
                    onPointerDown={(e) => handleTokenPointerDown(e, displayToken)}
                    isHost={isHost}
                    isOwner={isOwner}
                    isActiveTurn={!!isActiveTurn}
                    isTargeted={isTargeted}
                    isHiddenByFog={isHiddenByFog}
                />
                {/* PREMIUM RULER LABEL */}
                {displayToken.isDragging && rulerInfo && (
                    <div style={{
                        position: 'absolute',
                        left: tempTokenPos.x + config.gridSize / 2,
                        top: tempTokenPos.y - 20,
                        transform: `translate(-50%, -100%) scale(${1 / scale})`,
                        background: rulerInfo.isExceeded
                            ? 'rgba(220, 20, 20, 0.85)'
                            : 'rgba(20, 20, 30, 0.85)',
                        color: '#fff',
                        padding: '6px 12px',
                        borderRadius: '12px',
                        fontSize: '14px',
                        fontWeight: '600',
                        backdropFilter: 'blur(4px)',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
                        border: rulerInfo.isExceeded ? '1px solid #ffaaaa' : '1px solid #55aaff',
                        pointerEvents: 'none',
                        zIndex: 9999,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        whiteSpace: 'nowrap',
                        transition: 'background 0.3s ease, border-color 0.3s ease'
                    }}>
                        <Ruler size={14} style={{ opacity: 0.8 }} />
                        <span>{rulerInfo.meters}m</span>
                        {rulerInfo.limit < 999 && (
                            <span style={{
                                opacity: 0.8,
                                fontSize: '0.9em',
                                marginLeft: '4px',
                                color: rulerInfo.isExceeded ? '#ffcccc' : '#aaccff'
                            }}>
                                / {rulerInfo.limit}m
                            </span>
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div
            className="battle-map-container"
            onWheel={handleWheel}
            onPointerDown={handleWrapperPointerDown}
            onPointerMove={handleWrapperPointerMove}
            onPointerUp={handleWrapperPointerUp}
            onPointerLeave={handleWrapperPointerUp}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            ref={containerRef}
            style={{
                width: '100%', height: '100%',
                background: '#151520',
                overflow: 'hidden',
                position: 'relative',
                cursor: isPanning ? 'grabbing' : (interactionMode === 'select' ? 'default' : 'crosshair'),
                touchAction: 'none',
                boxShadow: isDragOver ? 'inset 0 0 0 2px #44ff44' : 'none',
                transition: 'box-shadow 0.2s',
                willChange: isPanning ? 'cursor' : 'auto'
            }}
        >
            <div
                className="map-transform-layer"
                style={{
                    transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${scale})`,
                    transformOrigin: '0 0',
                    width: config.width * config.gridSize,
                    height: config.height * config.gridSize,
                    position: 'absolute',
                    background: config.backgroundImageType !== 'video' && config.backgroundImage ? `url(${config.backgroundImage})` : '#222',
                    backgroundSize: 'cover',
                    border: '1px solid #333',
                    willChange: 'transform'
                }}
            >
                {/* 0. Video Background Layer */}
                {config.backgroundImageType === 'video' && config.backgroundImage && (
                    <video
                        src={config.backgroundImage}
                        autoPlay
                        loop
                        muted
                        playsInline
                        style={{
                            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                            objectFit: 'cover', pointerEvents: 'none'
                        }}
                    />
                )}
                {/* 1. Grid */}
                <MemoizedGridLayer config={config} />

                {/* 2. Walls */}
                <MemoizedWallLayer scale={scale} />

                {/* DRAG RULER LINE */}
                {rulerInfo && (
                    <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 10 }}>
                        <defs>
                            <filter id="glow-ruler" x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>
                        <line
                            x1={rulerInfo.startX + config.gridSize / 2}
                            y1={rulerInfo.startY + config.gridSize / 2}
                            x2={rulerInfo.x + config.gridSize / 2}
                            y2={rulerInfo.y + config.gridSize / 2}
                            stroke="rgba(0,0,0,0.5)"
                            strokeWidth={(4 / scale)}
                            strokeLinecap="round"
                        />
                        <line
                            x1={rulerInfo.startX + config.gridSize / 2}
                            y1={rulerInfo.startY + config.gridSize / 2}
                            x2={rulerInfo.x + config.gridSize / 2}
                            y2={rulerInfo.y + config.gridSize / 2}
                            stroke={rulerInfo.isExceeded ? "#ff4444" : "#44ffff"}
                            strokeWidth={(2 / scale)}
                            strokeDasharray={rulerInfo.isExceeded ? "0" : "8,4"}
                            strokeLinecap="round"
                            style={{ transition: 'stroke 0.3s ease' }}
                        />
                        <circle
                            cx={rulerInfo.startX + config.gridSize / 2}
                            cy={rulerInfo.startY + config.gridSize / 2}
                            r={3 / scale}
                            fill="rgba(255,255,255,0.8)"
                        />
                        <circle
                            cx={rulerInfo.x + config.gridSize / 2}
                            cy={rulerInfo.y + config.gridSize / 2}
                            r={4 / scale}
                            fill={rulerInfo.isExceeded ? "#ff4444" : "#44ffff"}
                        />
                    </svg>
                )}

                {/* 3. Tokens */}
                {displayTokens.map(renderToken)}

                {/* 4. Overlays */}
                <MeasurementOverlay scale={scale} />
                <EphemeralLayer scale={scale} />

                {/* 5. Unified Fog/Lighting (Top) */}
                <MemoizedFogOfWarLayer visionZones={liveVisionZones} />
            </div>

            {/* 6. Monster Stat Block Overlay (Right Side) */}
            {selectedTokenId && isHost && (() => {
                const token = (tokens || []).find(t => t.id === selectedTokenId);
                if (token?.monsterId) {
                    const monster = MonsterRepository.getById(token.monsterId);
                    if (monster) {
                        return (
                            <div style={{
                                position: 'absolute',
                                top: '20px',
                                right: '20px',
                                width: '300px',
                                zIndex: 2000,
                                boxShadow: '0 0 20px rgba(0,0,0,0.8)'
                            }}
                                onPointerDown={(e: React.PointerEvent) => e.stopPropagation()}
                            >
                                <EditableMonsterSheet
                                    tokenId={selectedTokenId}
                                    monster={monster}
                                    onClose={() => setSelectedTokenId(null)}
                                />
                            </div>
                        );
                    }
                }
                return null;
            })()}

            {/* UI Zoom Controls — positioned cleanly above floating Chat Toggle button (bottom: 20px, 60x60) */}
            <div style={{ position: 'absolute', bottom: '92px', right: '20px', zIndex: 500, display: 'flex', gap: 10 }}>
                <button onClick={() => setScale(s => s * 1.2)} style={{ ...btnStyle, display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Aproximar">
                    <Plus size={14} />
                </button>
                <button onClick={() => setScale(1)} style={btnStyle} title="Resetar Zoom">100%</button>
                <button onClick={() => setScale(s => s * 0.8)} style={{ ...btnStyle, display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Afastar">
                    <Minus size={14} />
                </button>
            </div>

            {/* Modals */}
            {(() => {
                if (!editingTokenId) return null;
                const editingToken = tokens.find(t => t.id === editingTokenId);
                if (editingToken?.isAsset) {
                    return (
                        <AssetSettingsModal
                            tokenId={editingTokenId}
                            onClose={() => setEditingTokenId(null)}
                        />
                    );
                } else {
                    return (
                        <TokenSettingsModal
                            tokenId={editingTokenId}
                            onClose={() => setEditingTokenId(null)}
                            onOpenSheet={() => {
                                if (editingTokenId) {
                                    setSelectedTokenId(editingTokenId); // Select the token to show sheet
                                    setEditingTokenId(null); // Close the editor
                                }
                            }}
                        />
                    );
                }
            })()}
        </div>
    );
};
