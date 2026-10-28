import React, { useRef, useEffect, useState } from 'react';
import { useMap } from './MapContext';
import { usePeer } from '../multiplayer/SocketContext';
import { LightingSystem } from './LightingSystem';
import type { MapConfig, MapToken, Wall } from './mapTypes';

export interface VisionZone {
    px: number;
    py: number;
    radiusPx: number;
    innerStop: number;
    polygon: { x: number; y: number }[];
    marksExplored: boolean;
    visibleToPlayer: boolean;
}

export function isPointInPolygon(x: number, y: number, poly: { x: number; y: number }[]): boolean {
    if (!poly || poly.length < 3) return false;
    let inside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
        const xi = poly[i].x;
        const yi = poly[i].y;
        const xj = poly[j].x;
        const yj = poly[j].y;
        const intersect = ((yi > y) !== (yj > y)) &&
            (x < ((xj - xi) * (y - yi)) / ((yj - yi) || 1e-9) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
}

export function isTokenVisibleInZones(token: MapToken, gridSize: number, zones: VisionZone[]): boolean {
    if (!zones || zones.length === 0) return false;

    const cx = (token.position.x + token.size / 2) * gridSize;
    const cy = (token.position.y + token.size / 2) * gridSize;
    if (!Number.isFinite(cx) || !Number.isFinite(cy)) return false;

    const rSample = Math.min(token.size * gridSize * 0.28, gridSize * 0.6);
    const samplePoints = [
        { x: cx, y: cy },
        { x: cx - rSample, y: cy - rSample },
        { x: cx + rSample, y: cy - rSample },
        { x: cx - rSample, y: cy + rSample },
        { x: cx + rSample, y: cy + rSample }
    ];

    for (let zIdx = 0; zIdx < zones.length; zIdx++) {
        const zone = zones[zIdx];
        if (!zone.visibleToPlayer || zone.radiusPx <= 0) continue;
        const rSq = zone.radiusPx * zone.radiusPx;

        for (let pIdx = 0; pIdx < samplePoints.length; pIdx++) {
            const pt = samplePoints[pIdx];
            const dx = pt.x - zone.px;
            const dy = pt.y - zone.py;
            if (dx * dx + dy * dy > rSq) continue;

            if (zone.polygon.length === 0 || isPointInPolygon(pt.x, pt.y, zone.polygon)) {
                return true;
            }
        }
    }

    return false;
}

export function computeMapVisionZones(
    config: MapConfig,
    tokens: MapToken[],
    walls: Wall[],
    isHost: boolean,
    myCharacter: any,
    connectedPlayersData: Record<string, any>,
    selectedTokenId?: string | null,
    previewMode: boolean = false
): VisionZone[] {
    if (config.fogEnabled === false || config.globalLight === 'bright') {
        return [];
    }

    const width = Math.max(1, config.width * config.gridSize);
    const height = Math.max(1, config.height * config.gridSize);
    const effectivePreview = Boolean(isHost && previewMode && selectedTokenId);

    const wallSegments = (walls || [])
        .filter(w =>
            w && !w.isOpen && w.type !== 'window' &&
            w.start && w.end &&
            Number.isFinite(w.start.x) && Number.isFinite(w.start.y) &&
            Number.isFinite(w.end.x) && Number.isFinite(w.end.y) &&
            (w.start.x !== w.end.x || w.start.y !== w.end.y)
        )
        .map(w => ({
            a: { x: w.start.x * config.gridSize, y: w.start.y * config.gridSize },
            b: { x: w.end.x * config.gridSize, y: w.end.y * config.gridSize }
        }));

    const zones: VisionZone[] = [];

    // 1. Universal Light Sources (torches, lanterns, campfires)
    (tokens || []).forEach(token => {
        if (token.lightRadius && token.lightRadius > 0 && token.lightEnabled !== false) {
            // Invisible tokens should not leak light or explored masks to players
            if (token.invisible && !isHost) return;

            const px = (token.position.x + token.size / 2) * config.gridSize;
            const py = (token.position.y + token.size / 2) * config.gridSize;
            const radiusPx = (token.lightRadius / 1.5) * config.gridSize;

            if (!Number.isFinite(px) || !Number.isFinite(py) || !Number.isFinite(radiusPx) || radiusPx <= 0) return;

            const polygon = LightingSystem.calculateVisibilityPolygon({ x: px, y: py }, wallSegments, width, height, radiusPx);
            if (polygon.length >= 3) {
                zones.push({
                    px,
                    py,
                    radiusPx,
                    innerStop: 0.2,
                    polygon,
                    marksExplored: !token.invisible,
                    visibleToPlayer: !token.invisible
                });
            }
        }
    });

    // 2. Personal Vision (Darkvision & Dim Ambient Sight)
    let visionTokens: MapToken[] = [];
    if (isHost) {
        visionTokens = effectivePreview
            ? (tokens || []).filter(t => t.id === selectedTokenId)
            : (tokens || []);
    } else {
        visionTokens = (tokens || []).filter(t =>
            Boolean(t.characterId && myCharacter && t.characterId === myCharacter.id) ||
            Boolean(t.ownerId && myCharacter && t.ownerId === myCharacter.id)
        );
    }

    visionTokens.forEach(token => {
        const isPcToken = Boolean(token.characterId) || Boolean(token.ownerId);
        let vision = token.visionRange || 0;

        if (vision === 0 && token.characterId) {
            const onlinePlayer = Object.values(connectedPlayersData || {}).find((p: any) => p.character?.id === token.characterId);
            if (onlinePlayer && onlinePlayer.character) {
                vision = onlinePlayer.character.visionRange || 0;
            } else if (myCharacter && token.characterId === myCharacter.id) {
                vision = myCharacter.visionRange || 0;
            }
        } else if (vision === 0 && token.ownerId && myCharacter && token.ownerId === myCharacter.id) {
            const comp = myCharacter.companions?.find((c: any) => c.id === token.companionId);
            if (comp && comp.visionRange) {
                vision = comp.visionRange;
            }
        }

        // In 'dim' (Penumbra), PCs without Darkvision still perceive immediate surroundings (9m / 6 cells),
        // whereas in 'dark' (Escuridão Total), only Darkvision or active light sources reveal the dungeon.
        if (vision === 0 && isPcToken && config.globalLight === 'dim') {
            vision = 9;
        }

        if (vision > 0) {
            const px = (token.position.x + token.size / 2) * config.gridSize;
            const py = (token.position.y + token.size / 2) * config.gridSize;
            const radiusPx = (vision / 1.5) * config.gridSize;

            if (Number.isFinite(px) && Number.isFinite(py) && Number.isFinite(radiusPx) && radiusPx > 0) {
                const polygon = LightingSystem.calculateVisibilityPolygon({ x: px, y: py }, wallSegments, width, height, radiusPx);
                if (polygon.length >= 3) {
                    zones.push({
                        px,
                        py,
                        radiusPx,
                        innerStop: 0.4,
                        polygon,
                        // Only PC tokens mark shared explored fog on Host so monsters in secret rooms never leak
                        marksExplored: isPcToken && !token.invisible,
                        visibleToPlayer: true
                    });
                }
            }
        }

        // Personal Token Body Circle (excluding map prop assets)
        if (!token.isAsset) {
            const bodyPx = (token.position.x + token.size / 2) * config.gridSize;
            const bodyPy = (token.position.y + token.size / 2) * config.gridSize;
            const bodyRadius = (token.size / 2) * config.gridSize;

            if (Number.isFinite(bodyPx) && Number.isFinite(bodyPy) && Number.isFinite(bodyRadius) && bodyRadius > 0) {
                zones.push({
                    px: bodyPx,
                    py: bodyPy,
                    radiusPx: bodyRadius,
                    innerStop: 1,
                    polygon: [],
                    marksExplored: isPcToken && !token.invisible,
                    visibleToPlayer: true
                });
            }
        }
    });

    return zones;
}

interface FogOfWarLayerProps {
    selectedTokenId?: string | null;
    previewMode?: boolean;
    visionZones?: VisionZone[];
}

export const FogOfWarLayer: React.FC<FogOfWarLayerProps> = ({
    selectedTokenId,
    previewMode = false,
    visionZones
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const exploredCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const { config, setConfig, tokens, walls } = useMap();
    const { myCharacter, isHost, connectedPlayersData } = usePeer();

    // Tick used solely to trigger a re-render after async offscreen Image hydration completes
    const [hydrationTick, setHydrationTick] = useState(0);

    const latestConfigRef = useRef(config);
    useEffect(() => { latestConfigRef.current = config; }, [config]);

    const setConfigRef = useRef(setConfig);
    useEffect(() => { setConfigRef.current = setConfig; }, [setConfig]);

    const lastSelfSavedFogDataRef = useRef<string>('');
    const lastHydratedFogDataRef = useRef<string | undefined>(undefined);
    const lastStampedSignatureRef = useRef<string>('');
    const isExploredDirtyRef = useRef<boolean>(false);
    const fogSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const sceneSignatureRef = useRef<string>('');

    const ensureExploredCanvas = (worldWidth: number, worldHeight: number): HTMLCanvasElement => {
        if (!exploredCanvasRef.current) {
            exploredCanvasRef.current = document.createElement('canvas');
        }
        const expCanvas = exploredCanvasRef.current;
        // Compact resolution (<= 512px and <= 0.25x world px) keeps PNG DataURL around ~5-15 KB
        const scaleFactor = Math.min(0.25, 512 / Math.max(worldWidth, worldHeight, 1));
        const targetW = Math.max(16, Math.round(worldWidth * scaleFactor));
        const targetH = Math.max(16, Math.round(worldHeight * scaleFactor));

        if (expCanvas.width !== targetW || expCanvas.height !== targetH) {
            const prevW = expCanvas.width;
            const prevH = expCanvas.height;
            let snapshot: HTMLCanvasElement | null = null;
            if (prevW > 0 && prevH > 0) {
                snapshot = document.createElement('canvas');
                snapshot.width = prevW;
                snapshot.height = prevH;
                const snapCtx = snapshot.getContext('2d');
                snapCtx?.drawImage(expCanvas, 0, 0);
            }
            expCanvas.width = targetW;
            expCanvas.height = targetH;
            if (snapshot) {
                const ctx = expCanvas.getContext('2d');
                ctx?.drawImage(snapshot, 0, 0, targetW, targetH);
            }
            lastStampedSignatureRef.current = '';
        }

        return expCanvas;
    };

    // Hydrate or Reset offscreen Explored Mask whenever config.fogData or scene changes
    useEffect(() => {
        const worldWidth = Math.max(1, config.width * config.gridSize);
        const worldHeight = Math.max(1, config.height * config.gridSize);
        const expCanvas = ensureExploredCanvas(worldWidth, worldHeight);
        const expCtx = expCanvas.getContext('2d');
        if (!expCtx) return;

        const currentSceneSig = `${config.backgroundImage || ''}|${config.width}x${config.height}`;
        if (sceneSignatureRef.current !== currentSceneSig) {
            sceneSignatureRef.current = currentSceneSig;
            // Cancel any pending debounce save from a previous scene so it never leaks across scenes
            if (fogSaveTimerRef.current) {
                clearTimeout(fogSaveTimerRef.current);
                fogSaveTimerRef.current = null;
            }
            isExploredDirtyRef.current = false;
            lastStampedSignatureRef.current = '';
            if (!config.fogData) {
                expCtx.clearRect(0, 0, expCanvas.width, expCanvas.height);
                lastHydratedFogDataRef.current = '';
                lastSelfSavedFogDataRef.current = '';
            }
        }

        const incomingFogData = config.fogData;

        // Explicit reset ('' or undefined)
        if (!incomingFogData) {
            if (fogSaveTimerRef.current) {
                clearTimeout(fogSaveTimerRef.current);
                fogSaveTimerRef.current = null;
            }
            isExploredDirtyRef.current = false;
            if (lastHydratedFogDataRef.current !== '') {
                expCtx.clearRect(0, 0, expCanvas.width, expCanvas.height);
                lastHydratedFogDataRef.current = '';
                lastSelfSavedFogDataRef.current = '';
                lastStampedSignatureRef.current = '';
                setHydrationTick(t => t + 1);
            }
            return;
        }

        // Skip redundant decode if Host itself just produced this exact DataURL
        if (incomingFogData === lastSelfSavedFogDataRef.current || incomingFogData === lastHydratedFogDataRef.current) {
            return;
        }

        let cancelled = false;
        const img = new Image();
        img.onload = () => {
            if (cancelled || latestConfigRef.current.fogData !== incomingFogData) return;
            const c = exploredCanvasRef.current;
            const cCtx = c?.getContext('2d');
            if (!c || !cCtx) return;

            // Atomically replace offscreen explored mask inside onload (zero blink gap)
            cCtx.globalCompositeOperation = 'source-over';
            cCtx.globalAlpha = 1.0;
            cCtx.clearRect(0, 0, c.width, c.height);
            cCtx.drawImage(img, 0, 0, c.width, c.height);

            lastHydratedFogDataRef.current = incomingFogData;
            lastStampedSignatureRef.current = '';
            setHydrationTick(t => t + 1);
        };
        img.src = incomingFogData;

        return () => {
            cancelled = true;
        };
    }, [config.fogData, config.backgroundImage, config.width, config.height, config.gridSize]);

    // Cleanup debounce timer on unmount
    useEffect(() => {
        return () => {
            if (fogSaveTimerRef.current) {
                clearTimeout(fogSaveTimerRef.current);
                fogSaveTimerRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rafId = requestAnimationFrame(() => {
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const width = Math.max(1, config.width * config.gridSize);
            const height = Math.max(1, config.height * config.gridSize);
            if (canvas.width !== width || canvas.height !== height) {
                canvas.width = width;
                canvas.height = height;
            } else {
                ctx.clearRect(0, 0, width, height);
            }

            ctx.globalAlpha = 1.0;
            ctx.globalCompositeOperation = 'source-over';
            ctx.imageSmoothingEnabled = true;

            // If Fog is disabled or Global Light is Bright ("Dia"), keep canvas clear
            if (config.fogEnabled === false || config.globalLight === 'bright') {
                return;
            }

            const expCanvas = ensureExploredCanvas(width, height);
            const expCtx = expCanvas.getContext('2d');

            const activeZones = visionZones ?? computeMapVisionZones(
                config,
                tokens,
                walls,
                isHost,
                myCharacter,
                connectedPlayersData,
                selectedTokenId,
                previewMode
            );

            // --- 1. Update Offscreen Explored Mask with Current Vision Polygons ---
            const exploredZones = activeZones.filter(z => z.marksExplored);
            const signature = exploredZones.length > 0
                ? exploredZones.map(z => `${Math.round(z.px)},${Math.round(z.py)},${Math.round(z.radiusPx)}`).join(';') + `|w:${(walls || []).length}`
                : '';

            if (expCtx && exploredZones.length > 0 && signature !== lastStampedSignatureRef.current) {
                const sx = expCanvas.width / width;
                const sy = expCanvas.height / height;

                expCtx.save();
                expCtx.globalCompositeOperation = 'source-over';
                expCtx.globalAlpha = 1.0;

                exploredZones.forEach(zone => {
                    const ex = zone.px * sx;
                    const ey = zone.py * sy;
                    const er = Math.max(1, zone.radiusPx * Math.max(sx, sy));

                    if (zone.polygon.length >= 3) {
                        expCtx.save();
                        expCtx.beginPath();
                        expCtx.moveTo(zone.polygon[0].x * sx, zone.polygon[0].y * sy);
                        for (let i = 1; i < zone.polygon.length; i++) {
                            expCtx.lineTo(zone.polygon[i].x * sx, zone.polygon[i].y * sy);
                        }
                        expCtx.closePath();
                        expCtx.clip();

                        const expGrad = expCtx.createRadialGradient(ex, ey, er * 0.78, ex, ey, er);
                        expGrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
                        expGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
                        expCtx.fillStyle = expGrad;
                        expCtx.beginPath();
                        expCtx.arc(ex, ey, er, 0, Math.PI * 2);
                        expCtx.fill();
                        expCtx.restore();
                    } else {
                        expCtx.fillStyle = 'rgba(255, 255, 255, 1)';
                        expCtx.beginPath();
                        expCtx.arc(ex, ey, er, 0, Math.PI * 2);
                        expCtx.fill();
                    }
                });

                expCtx.restore();
                lastStampedSignatureRef.current = signature;

                // Schedule debounced persistence on Host (~2.5s) only when dirty
                if (isHost) {
                    isExploredDirtyRef.current = true;
                    if (!fogSaveTimerRef.current) {
                        fogSaveTimerRef.current = setTimeout(() => {
                            fogSaveTimerRef.current = null;
                            if (!isExploredDirtyRef.current) return;
                            isExploredDirtyRef.current = false;

                            const curExpCanvas = exploredCanvasRef.current;
                            const curCfg = latestConfigRef.current;
                            if (!curExpCanvas || curCfg.fogEnabled === false) return;

                            try {
                                const dataUrl = curExpCanvas.toDataURL('image/png');
                                if (dataUrl && dataUrl.length < 150 * 1024 && dataUrl !== curCfg.fogData) {
                                    lastSelfSavedFogDataRef.current = dataUrl;
                                    lastHydratedFogDataRef.current = dataUrl;
                                    setConfigRef.current({ ...curCfg, fogData: dataUrl });
                                }
                            } catch (err) {
                                console.warn('[FogOfWarLayer] Unable to persist explored fog mask:', err);
                            }
                        }, 2500);
                    }
                }
            }

            // --- 2. Base Unexplored Darkness ---
            // Players / Preview: pitch black rgba(0,0,0,1.0)
            // GM (Normal): translucent rgba(0,0,0,0.68)
            const effectivePreview = isHost && previewMode && selectedTokenId;
            const isGmTranslucent = isHost && !effectivePreview;

            ctx.globalCompositeOperation = 'source-over';
            ctx.globalAlpha = 1.0;
            ctx.fillStyle = isGmTranslucent ? 'rgba(0, 0, 0, 0.68)' : 'rgba(0, 0, 0, 1.0)';
            ctx.fillRect(0, 0, width, height);

            // --- 3. Shrouded Dim Memory for Previously Explored Areas ---
            // Porter-Duff destination-out: alpha_out = alpha_base * (1 - eraseAlpha)
            // Players: 1.0 * (1 - 0.32) = 0.68  -> rgba(0,0,0,0.68)
            // GM:      0.68 * (1 - 0.4853) = 0.35 -> rgba(0,0,0,0.35)
            ctx.globalCompositeOperation = 'destination-out';
            ctx.globalAlpha = isGmTranslucent ? ((0.68 - 0.35) / 0.68) : 0.32;
            ctx.drawImage(expCanvas, 0, 0, width, height);
            ctx.globalAlpha = 1.0;

            // --- 4. Cut Out Current Live Sight & Active Light Polygons ---
            activeZones.forEach(zone => {
                if (zone.polygon.length >= 3) {
                    const gradient = ctx.createRadialGradient(
                        zone.px,
                        zone.py,
                        zone.radiusPx * zone.innerStop,
                        zone.px,
                        zone.py,
                        zone.radiusPx
                    );
                    gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
                    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

                    ctx.save();
                    ctx.beginPath();
                    ctx.moveTo(zone.polygon[0].x, zone.polygon[0].y);
                    for (let i = 1; i < zone.polygon.length; i++) {
                        ctx.lineTo(zone.polygon[i].x, zone.polygon[i].y);
                    }
                    ctx.closePath();
                    ctx.clip();

                    ctx.fillStyle = gradient;
                    ctx.beginPath();
                    ctx.arc(zone.px, zone.py, zone.radiusPx, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                } else {
                    ctx.beginPath();
                    ctx.arc(zone.px, zone.py, zone.radiusPx, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(0, 0, 0, 1)';
                    ctx.fill();
                }
            });
        });

        return () => {
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, [
        config,
        tokens,
        walls,
        isHost,
        myCharacter,
        connectedPlayersData,
        selectedTokenId,
        previewMode,
        visionZones,
        hydrationTick
    ]);

    const zIndex = (isHost && !(previewMode && selectedTokenId)) ? 30 : 150;

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                pointerEvents: 'none',
                zIndex,
                filter: 'blur(2px)'
            }}
        />
    );
};
