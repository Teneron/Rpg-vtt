import type { Wall, MapToken } from './mapTypes.ts';

export const isValidCoord = (n: any): n is number => typeof n === 'number' && Number.isFinite(n);

/**
 * Validates and sanitizes a wall segment.
 * Returns null if the wall is null, has non-finite coordinates, or is degenerate (0-length).
 */
export const sanitizeWall = (w: any): Wall | null => {
    if (!w || !w.id || !w.start || !w.end) return null;
    if (!isValidCoord(w.start.x) || !isValidCoord(w.start.y) || !isValidCoord(w.end.x) || !isValidCoord(w.end.y)) return null;
    if (w.start.x === w.end.x && w.start.y === w.end.y) return null;
    return w as Wall;
};

/**
 * Validates and sanitizes a map token position and boundaries.
 * Clamps coordinates to [0, mapWidth - size] and [0, mapHeight - size].
 * Returns null if coordinates are missing or non-finite.
 */
export const sanitizeToken = (t: any, mapWidth: number = 30, mapHeight: number = 30): MapToken | null => {
    if (!t || !t.id || !t.position) return null;
    if (!isValidCoord(t.position.x) || !isValidCoord(t.position.y)) return null;
    const size = typeof t.size === 'number' && Number.isFinite(t.size) && t.size > 0 ? t.size : 1;
    const safeX = Math.max(0, Math.min(Math.round(t.position.x), Math.max(0, mapWidth - size)));
    const safeY = Math.max(0, Math.min(Math.round(t.position.y), Math.max(0, mapHeight - size)));
    return {
        ...t,
        position: { x: safeX, y: safeY }
    };
};

/**
 * Clamps raw (x, y) coordinates for a given token size within map boundaries.
 */
export const clampTokenPosition = (x: number, y: number, tokenSize: number = 1, mapWidth: number = 30, mapHeight: number = 30): { x: number; y: number } => {
    const size = Number.isFinite(tokenSize) && tokenSize > 0 ? tokenSize : 1;
    const safeX = Math.max(0, Math.min(Math.round(x), Math.max(0, mapWidth - size)));
    const safeY = Math.max(0, Math.min(Math.round(y), Math.max(0, mapHeight - size)));
    return { x: safeX, y: safeY };
};
