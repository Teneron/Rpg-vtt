import React, { useRef, useEffect } from 'react';
import { useMap } from './MapContext';
import { usePeer } from '../multiplayer/SocketContext';
import { LightingSystem } from './LightingSystem';

interface FogOfWarLayerProps {
    selectedTokenId?: string | null;
    previewMode?: boolean;
}

export const FogOfWarLayer: React.FC<FogOfWarLayerProps> = ({ selectedTokenId, previewMode = false }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { config, tokens, walls } = useMap();
    const { myCharacter, isHost, connectedPlayersData } = usePeer();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rafId = requestAnimationFrame(() => {
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            // Reset Canvas with dimension check to avoid tearing & excessive buffer reallocations
            const width = Math.max(1, config.width * config.gridSize);
            const height = Math.max(1, config.height * config.gridSize);
            if (canvas.width !== width || canvas.height !== height) {
                canvas.width = width;
                canvas.height = height;
            } else {
                ctx.clearRect(0, 0, width, height);
            }

            // Ensure defaults
            ctx.globalAlpha = 1.0;
            ctx.globalCompositeOperation = 'source-over';


        // se Fog desativado ou Luz Brilhante Global (tudo visível)
        if (config.fogEnabled === false || config.globalLight === 'bright') {
            return;
        }

        // --- Renderizar Escuridão (Base) ---
        ctx.globalCompositeOperation = 'source-over';

        // Host Logic for transparency
        const effectivePreview = isHost && previewMode && selectedTokenId;

        // Premium Fog Color Logic
        // Host (No Preview): Semi-transparent (0.6) so they can build
        if (isHost && !effectivePreview) {
            ctx.fillStyle = 'rgba(10, 15, 30, 0.6)';
        } else {
            // Player / Preview Mode
            // Force opaque black for FOW to ensure secrets are hidden
            // User requested: "arrume a nevoa tbm" (fix the fog too)
            ctx.fillStyle = '#000000'; // Pure Black
        }
        ctx.fillRect(0, 0, width, height);

        // --- Cortar Buracos (Visão/Luz) ---
        ctx.globalCompositeOperation = 'destination-out';

        // Prepare Wall Segments for Raycasting (sanitized and filtered)
        const wallSegments = (walls || [])
            .filter(w => w && w.start && w.end &&
                Number.isFinite(w.start.x) && Number.isFinite(w.start.y) &&
                Number.isFinite(w.end.x) && Number.isFinite(w.end.y) &&
                (w.start.x !== w.end.x || w.start.y !== w.end.y)
            )
            .map(w => ({
                a: { x: w.start.x * config.gridSize, y: w.start.y * config.gridSize },
                b: { x: w.end.x * config.gridSize, y: w.end.y * config.gridSize }
            }));

        // 1. Fontes de Luz de TODOS os tokens (Universal)
        (tokens || []).forEach(token => {
            if (token.lightRadius && token.lightRadius > 0 && token.lightEnabled !== false) {
                const px = (token.position.x + token.size / 2) * config.gridSize;
                const py = (token.position.y + token.size / 2) * config.gridSize;
                const radiusPx = (token.lightRadius / 1.5) * config.gridSize;

                if (!Number.isFinite(px) || !Number.isFinite(py) || !Number.isFinite(radiusPx) || radiusPx <= 0) return;

                // Soft Light Gradient
                const gradient = ctx.createRadialGradient(px, py, radiusPx * 0.2, px, py, radiusPx);
                gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

                // Calculate Polygon with spatial culling (radiusPx)
                const polygon = LightingSystem.calculateVisibilityPolygon({ x: px, y: py }, wallSegments, width, height, radiusPx);

                if (polygon.length >= 3) {
                    ctx.save();
                    ctx.beginPath();
                    ctx.moveTo(polygon[0].x, polygon[0].y);
                    for (let i = 1; i < polygon.length; i++) ctx.lineTo(polygon[i].x, polygon[i].y);
                    ctx.closePath();
                    ctx.clip(); // Restrict light to walls

                    ctx.fillStyle = gradient;
                    ctx.beginPath();
                    ctx.arc(px, py, radiusPx, 0, Math.PI * 2);
                    ctx.fill();

                    ctx.restore();
                }
            }
        });

        // 2. Visão Pessoal (Darkvision)
        // Lógica: Se sou PLAYER, vejo meus tokens.
        // Se sou GM e estou em PREVIEW, vejo apenas o token selecionado.
        // Se sou GM sem PREVIEW, vejo tudo (mas na vdd GM sem preview já vê transparente, então não precisa cavar luz extra, exceto pra debug).
        // Mas o sistema "Darkvision" deve revelar a área para quem tem a visão.

        let visionTokens = tokens || [];

        if (isHost) {
            if (effectivePreview) {
                visionTokens = (tokens || []).filter(t => t.id === selectedTokenId);
            } else {
                // Se GM não está em preview, ele não precisa "recortar" visão pessoal (ele já vê através do fog 0.6)
                // POREM, se quisermos mostrar a visão dos players para o GM ver "onde eles enxergam" (como linhas brancas?), seria outra feature.
                // Por enquanto: se GM normal, não recorta visão pessoal (para não confundir o que é luz real vs visão pessoal).
                // Mas espera, se o token tem 'Darkvision', ele ilumina pra si mesmo.
                // Vamos manter o comportamento: GM vê a luz pessoal de todos se quiser simular.
                visionTokens = tokens || [];
            }
        } else {
            // Player: Só meus tokens
            visionTokens = (tokens || []).filter(t =>
                (t.characterId && myCharacter && t.characterId === myCharacter.id)
            );
        }

        visionTokens.forEach(token => {
            let vision = token.visionRange || 0;

            // Auto-detect Vision from Linked Character (if not overridden on token)
            if (vision === 0 && token.characterId) {
                // Find stats in Connected Players (Online)
                const onlinePlayer = Object.values(connectedPlayersData).find(p => p.character?.id === token.characterId);
                if (onlinePlayer && onlinePlayer.character) {
                    vision = onlinePlayer.character.visionRange || 0;
                }
                // If I am the owner, check my local char
                else if (myCharacter && token.characterId === myCharacter.id) {
                    vision = myCharacter.visionRange || 0;
                }
            }

            if (vision > 0) {
                const px = (token.position.x + token.size / 2) * config.gridSize;
                const py = (token.position.y + token.size / 2) * config.gridSize;
                const radiusPx = (vision / 1.5) * config.gridSize;

                if (!Number.isFinite(px) || !Number.isFinite(py) || !Number.isFinite(radiusPx) || radiusPx <= 0) return;

                const gradient = ctx.createRadialGradient(px, py, radiusPx * 0.4, px, py, radiusPx);
                gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

                const polygon = LightingSystem.calculateVisibilityPolygon({ x: px, y: py }, wallSegments, width, height, radiusPx);

                if (polygon.length >= 3) {
                    ctx.save();
                    ctx.beginPath();
                    ctx.moveTo(polygon[0].x, polygon[0].y);
                    for (let i = 1; i < polygon.length; i++) ctx.lineTo(polygon[i].x, polygon[i].y);
                    ctx.closePath();
                    ctx.clip();

                    ctx.fillStyle = gradient;
                    ctx.beginPath();
                    ctx.arc(px, py, radiusPx, 0, Math.PI * 2);
                    ctx.fill();

                    ctx.restore();
                }
            }

            // Body always visible (Personal)
            // Body always visible (Personal)
            // Fix: Assets shouldn't punch a hole in the Fog (creating a "glow"), they should just sit under the semi-transparent fog for GM.
            if (!token.isAsset) {
                const bodyPx = (token.position.x + token.size / 2) * config.gridSize;
                const bodyPy = (token.position.y + token.size / 2) * config.gridSize;
                const bodyRadius = (token.size / 2) * config.gridSize;

                ctx.beginPath();
                ctx.arc(bodyPx, bodyPy, bodyRadius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(0,0,0,1)';
                ctx.fill();
            }
        });
        });

        return () => {
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, [config, tokens, walls, isHost, myCharacter, connectedPlayersData, selectedTokenId, previewMode]);

    // Z-INDEX LOGIC
    // Above walls/tokens (usually z=10-20), but needs to allow clicks through?
    // pointerEvents: none handles clicks.
    // Z-Index needs to be high to obscure map.
    const zIndex = (isHost && !(previewMode && selectedTokenId)) ? 30 : 150;

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                pointerEvents: 'none',
                zIndex: zIndex,
                filter: 'blur(2px)' // Premium Blur
            }}
        />
    );
};
