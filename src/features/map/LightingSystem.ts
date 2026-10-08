// LightingSystem.ts
// Raycasting 2D visibility polygon generator with spatial culling and vertex validation

interface Point { x: number; y: number; }
interface Segment { a: Point; b: Point; }

export class LightingSystem {

    /**
     * Computes the 2D visibility polygon from a light/vision origin against blocking walls.
     * 
     * @param origin Point where the light or vision originates (in canvas pixels)
     * @param walls Array of line segments blocking light
     * @param widthCanvas Full width of the map canvas
     * @param heightCanvas Full height of the map canvas
     * @param maxRadius Optional vision/light radius for spatial culling (huge performance gain)
     */
    static calculateVisibilityPolygon(
        origin: Point,
        walls: { a: Point; b: Point }[],
        widthCanvas: number,
        heightCanvas: number,
        maxRadius?: number
    ): Point[] {
        if (!origin || !isFinite(origin.x) || !isFinite(origin.y)) {
            return [];
        }

        // 1. Sanitize walls (filter out degenerate or invalid coordinates)
        let relevantWalls = (walls || []).filter(w =>
            w && w.a && w.b &&
            isFinite(w.a.x) && isFinite(w.a.y) &&
            isFinite(w.b.x) && isFinite(w.b.y) &&
            (w.a.x !== w.b.x || w.a.y !== w.b.y)
        );

        // 2. Spatial Culling by bounding box if maxRadius is provided
        const hasRadius = typeof maxRadius === 'number' && maxRadius > 0 && isFinite(maxRadius);
        const effectiveRadius = hasRadius ? maxRadius * 1.05 : null;

        const bMinX = effectiveRadius ? Math.max(0, origin.x - effectiveRadius) : 0;
        const bMaxX = effectiveRadius ? Math.min(widthCanvas, origin.x + effectiveRadius) : widthCanvas;
        const bMinY = effectiveRadius ? Math.max(0, origin.y - effectiveRadius) : 0;
        const bMaxY = effectiveRadius ? Math.min(heightCanvas, origin.y + effectiveRadius) : heightCanvas;

        if (effectiveRadius) {
            relevantWalls = relevantWalls.filter(w => {
                const segMinX = Math.min(w.a.x, w.b.x);
                const segMaxX = Math.max(w.a.x, w.b.x);
                const segMinY = Math.min(w.a.y, w.b.y);
                const segMaxY = Math.max(w.a.y, w.b.y);

                return !(segMinX > bMaxX || segMaxX < bMinX || segMinY > bMaxY || segMaxY < bMinY);
            });
        }

        // 3. Collect unique endpoints and boundary corners
        const points: Point[] = [];
        const uniquePointsStr = new Set<string>();

        const addPoint = (p: Point) => {
            const cx = Math.max(bMinX, Math.min(bMaxX, p.x));
            const cy = Math.max(bMinY, Math.min(bMaxY, p.y));
            const s = `${cx.toFixed(1)},${cy.toFixed(1)}`;
            if (!uniquePointsStr.has(s)) {
                uniquePointsStr.add(s);
                points.push({ x: cx, y: cy });
            }
        };

        relevantWalls.forEach(w => {
            addPoint(w.a);
            addPoint(w.b);
        });

        // Add Local Bounding Box Corners
        addPoint({ x: bMinX, y: bMinY });
        addPoint({ x: bMaxX, y: bMinY });
        addPoint({ x: bMaxX, y: bMaxY });
        addPoint({ x: bMinX, y: bMaxY });

        // 4. Cast rays to all points (+/- epsilon angles)
        const angles: number[] = [];
        points.forEach(p => {
            const angle = Math.atan2(p.y - origin.y, p.x - origin.x);
            if (isFinite(angle)) {
                angles.push(angle - 0.00001, angle, angle + 0.00001);
            }
        });

        const allSegments: Segment[] = [
            ...relevantWalls,
            { a: { x: bMinX, y: bMinY }, b: { x: bMaxX, y: bMinY } },
            { a: { x: bMaxX, y: bMinY }, b: { x: bMaxX, y: bMaxY } },
            { a: { x: bMaxX, y: bMaxY }, b: { x: bMinX, y: bMaxY } },
            { a: { x: bMinX, y: bMaxY }, b: { x: bMinX, y: bMinY } }
        ];

        angles.sort((a, b) => a - b);

        const polygonPoints: Point[] = [];

        for (const angle of angles) {
            const dx = Math.cos(angle);
            const dy = Math.sin(angle);

            let closestDist = Infinity;
            let closestPoint: Point | null = null;

            for (const seg of allSegments) {
                const intersect = this.getRaySegmentIntersection(origin, { dx, dy }, seg);
                if (intersect && intersect.param < closestDist) {
                    closestDist = intersect.param;
                    closestPoint = intersect.point;
                }
            }

            if (closestPoint && isFinite(closestPoint.x) && isFinite(closestPoint.y)) {
                polygonPoints.push({
                    x: Math.max(0, Math.min(widthCanvas, closestPoint.x)),
                    y: Math.max(0, Math.min(heightCanvas, closestPoint.y))
                });
            }
        }

        return polygonPoints;
    }

    private static getRaySegmentIntersection(
        rayOrigin: Point,
        rayDir: { dx: number; dy: number },
        segment: Segment
    ): { point: Point; param: number } | null {
        const r_px = rayOrigin.x;
        const r_py = rayOrigin.y;
        const r_dx = rayDir.dx;
        const r_dy = rayDir.dy;

        const s_px = segment.a.x;
        const s_py = segment.a.y;
        const s_dx = segment.b.x - segment.a.x;
        const s_dy = segment.b.y - segment.a.y;

        const mag = s_dx * r_dy - s_dy * r_dx;
        if (Math.abs(mag) < 0.000001) return null; // Parallel or degenerate

        const t2 = (r_dx * (s_py - r_py) + r_dy * (r_px - s_px)) / mag;

        let t1_robust: number;
        if (Math.abs(r_dx) > Math.abs(r_dy)) {
            t1_robust = (s_px + s_dx * t2 - r_px) / r_dx;
        } else {
            t1_robust = (s_py + s_dy * t2 - r_py) / r_dy;
        }

        if (t1_robust > 0 && t2 >= 0 && t2 <= 1) {
            const ix = r_px + r_dx * t1_robust;
            const iy = r_py + r_dy * t1_robust;

            if (isFinite(ix) && isFinite(iy)) {
                return {
                    point: { x: ix, y: iy },
                    param: t1_robust
                };
            }
        }

        return null;
    }
}
