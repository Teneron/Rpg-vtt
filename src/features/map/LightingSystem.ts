// LightingSystem.ts
// Wall type used implicitly through geometry types or not needed for basic calculation

interface Point { x: number; y: number; }
interface Segment { a: Point; b: Point; }

export class LightingSystem {

    static calculateVisibilityPolygon(origin: Point, walls: { a: Point, b: Point }[], widthCanvas: number, heightCanvas: number): Point[] {
        // 1. Collect all unique points (endpoints of walls) and map boundaries
        const points: Point[] = [];
        const uniquePointsStr = new Set<string>();

        const addPoint = (p: Point) => {
            const s = `${p.x.toFixed(2)},${p.y.toFixed(2)}`;
            if (!uniquePointsStr.has(s)) {
                uniquePointsStr.add(s);
                points.push(p);
            }
        };

        // Add Wall Endpoints
        walls.forEach(w => {
            addPoint(w.a);
            addPoint(w.b);
        });

        // Add Canvas Corners (to ensure light doesn't clip weirdly at infinity)
        addPoint({ x: 0, y: 0 });
        addPoint({ x: widthCanvas, y: 0 });
        addPoint({ x: widthCanvas, y: heightCanvas });
        addPoint({ x: 0, y: heightCanvas });

        // 2. Cast Rays to all points (+/- small epsilon angle)
        const angles: number[] = [];
        points.forEach(p => {
            const angle = Math.atan2(p.y - origin.y, p.x - origin.x);
            angles.push(angle - 0.00001, angle, angle + 0.00001);
        });

        // 3. For each angle, find closest intersection
        const polygonPoints: Point[] = [];

        // Include boundaries as segments for intersection checks
        const allSegments = [
            ...walls,
            { a: { x: 0, y: 0 }, b: { x: widthCanvas, y: 0 } },
            { a: { x: widthCanvas, y: 0 }, b: { x: widthCanvas, y: heightCanvas } },
            { a: { x: widthCanvas, y: heightCanvas }, b: { x: 0, y: heightCanvas } },
            { a: { x: 0, y: heightCanvas }, b: { x: 0, y: 0 } }
        ];

        // Sort angles to draw polygon in order
        angles.sort((a, b) => a - b);

        for (const angle of angles) {
            // Ray: Origin + Vector(cos, sin) * HUGE_DISTANCE
            const dx = Math.cos(angle);
            const dy = Math.sin(angle);

            // Find closest intersection
            let closestDist = Infinity;
            let closestPoint: Point | null = null;

            for (const seg of allSegments) {
                const intersect = this.getRaySegmentIntersection(origin, { dx, dy }, seg);
                if (intersect) {
                    if (intersect.param < closestDist) {
                        closestDist = intersect.param;
                        closestPoint = intersect.point;
                    }
                }
            }

            if (closestPoint) {
                polygonPoints.push(closestPoint);
            }
        }

        return polygonPoints;
    }

    private static getRaySegmentIntersection(rayOrigin: Point, rayDir: { dx: number, dy: number }, segment: Segment): { point: Point, param: number } | null {
        const r_px = rayOrigin.x;
        const r_py = rayOrigin.y;
        const r_dx = rayDir.dx;
        const r_dy = rayDir.dy;

        const s_px = segment.a.x;
        const s_py = segment.a.y;
        const s_dx = segment.b.x - segment.a.x;
        const s_dy = segment.b.y - segment.a.y;

        // r_px + r_dx * T1 = s_px + s_dx * T2
        // r_py + r_dy * T1 = s_py + s_dy * T2

        const mag = s_dx * r_dy - s_dy * r_dx;
        if (Math.abs(mag) < 0.000001) return null; // Parallel

        const t2 = (r_dx * (s_py - r_py) + r_dy * (r_px - s_px)) / mag;

        // Check if T1 > 0 (Ray forward) and 0 <= T2 <= 1 (Segment bounds)
        // Need to robustly calc T1.
        let t1_robust;
        if (Math.abs(r_dx) > Math.abs(r_dy)) {
            t1_robust = (s_px + s_dx * t2 - r_px) / r_dx;
        } else {
            t1_robust = (s_py + s_dy * t2 - r_py) / r_dy;
        }

        if (t1_robust > 0 && t2 >= 0 && t2 <= 1) {
            return {
                point: {
                    x: r_px + r_dx * t1_robust,
                    y: r_py + r_dy * t1_robust
                },
                param: t1_robust
            };
        }
        return null;
    }
}
