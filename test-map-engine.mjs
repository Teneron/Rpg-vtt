import assert from 'node:assert';
import { LightingSystem } from './src/features/map/LightingSystem.ts';
import { sanitizeWall, sanitizeToken } from './src/features/map/mapUtils.ts';

console.log('=== RPG TABLETOP - MAP & RAYCASTING ENGINE TESTS ===');

// --- 1. Testing LightingSystem Raycasting ---
console.log('\n--- 1. Testing LightingSystem Raycasting ---');

// 1a. Basic Room Polygon
const origin = { x: 250, y: 250 };
const roomWalls = [
    { a: { x: 100, y: 100 }, b: { x: 400, y: 100 } },
    { a: { x: 400, y: 100 }, b: { x: 400, y: 400 } },
    { a: { x: 400, y: 400 }, b: { x: 100, y: 400 } },
    { a: { x: 100, y: 400 }, b: { x: 100, y: 100 } },
];

const polyBasic = LightingSystem.calculateVisibilityPolygon(origin, roomWalls, 1000, 1000);
assert.ok(polyBasic.length >= 3, 'Visibility polygon must have at least 3 vertices');
polyBasic.forEach(p => {
    assert.ok(Number.isFinite(p.x) && Number.isFinite(p.y), 'All vertices must be finite');
    assert.ok(p.x >= 100 && p.x <= 400, `Vertex X (${p.x}) must stay within room boundaries`);
    assert.ok(p.y >= 100 && p.y <= 400, `Vertex Y (${p.y}) must stay within room boundaries`);
});
console.log(`✓ Basic room polygon successfully generated with ${polyBasic.length} vertices`);

// 1b. Degenerate, zero-length & NaN walls immunity
const corruptedWalls = [
    ...roomWalls,
    { a: { x: 250, y: 250 }, b: { x: 250, y: 250 } }, // Zero-length (degenerate)
    { a: { x: NaN, y: 100 }, b: { x: 200, y: 200 } },  // NaN
    { a: { x: Infinity, y: 100 }, b: { x: 200, y: 200 } }, // Infinity
    null, // Null segment
    { a: null, b: { x: 100, y: 100 } } // Malformed segment
];

const polyCorrupted = LightingSystem.calculateVisibilityPolygon(origin, corruptedWalls, 1000, 1000);
assert.ok(polyCorrupted.length >= 3, 'Visibility polygon must succeed despite corrupted wall segments');
polyCorrupted.forEach(p => {
    assert.ok(Number.isFinite(p.x) && !Number.isNaN(p.x), 'Vertex X must not be NaN');
    assert.ok(Number.isFinite(p.y) && !Number.isNaN(p.y), 'Vertex Y must not be NaN');
});
console.log('✓ Handled degenerate zero-length, NaN, and null wall segments with zero NaN vertices');

// 1c. Spatial Culling (Performance Optimization)
// Create 200 distant walls far outside vision radius
const distantWalls = [];
for (let i = 0; i < 200; i++) {
    distantWalls.push({
        a: { x: 3000 + i * 10, y: 3000 },
        b: { x: 3000 + i * 10, y: 3100 }
    });
}
const allWalls = [...roomWalls, ...distantWalls];

const culledPoly = LightingSystem.calculateVisibilityPolygon(origin, allWalls, 5000, 5000, 200);
assert.ok(culledPoly.length >= 3, 'Culled polygon must compute valid vertices');
// Verify vertices are within local region (origin +- radius)
culledPoly.forEach(p => {
    assert.ok(Number.isFinite(p.x) && Number.isFinite(p.y), 'All culled vertices must be finite');
    assert.ok(p.x < 1000 && p.y < 1000, 'Culled vertices must not test or leak to 3000+ distant walls');
});
console.log('✓ Spatial culling successfully filtered distant walls outside maxRadius');

// 1d. Invalid / Null Raycast Origin
assert.deepStrictEqual(LightingSystem.calculateVisibilityPolygon(null, roomWalls, 1000, 1000), []);
assert.deepStrictEqual(LightingSystem.calculateVisibilityPolygon({ x: NaN, y: 100 }, roomWalls, 1000, 1000), []);
console.log('✓ Invalid / NaN raycast origins safely return empty array without crashing');


// --- 2. Testing MapContext Token & Wall Sanitizers ---
console.log('\n--- 2. Testing Token & Wall Sanitization ---');

// 2a. Wall Sanitizer
const validWall = {
    id: 'w1',
    start: { x: 1, y: 2 },
    end: { x: 5, y: 2 },
    type: 'wall'
};
assert.deepStrictEqual(sanitizeWall(validWall), validWall, 'Valid wall must be preserved');

// Zero length
assert.strictEqual(sanitizeWall({ id: 'w2', start: { x: 3, y: 3 }, end: { x: 3, y: 3 } }), null);

// NaN coordinates
assert.strictEqual(sanitizeWall({ id: 'w3', start: { x: NaN, y: 3 }, end: { x: 5, y: 3 } }), null);

// Missing fields
assert.strictEqual(sanitizeWall(null), null);
assert.strictEqual(sanitizeWall({ id: 'w4' }), null);
console.log('✓ sanitizeWall rejects degenerate, NaN, and missing wall attributes');

// 2b. Token Sanitizer & Bounds Clamping
const normalToken = {
    id: 't1',
    name: 'Geralt',
    position: { x: 5.2, y: 10.7 },
    size: 1
};
const sanitizedNormal = sanitizeToken(normalToken, 30, 30);
assert.strictEqual(sanitizedNormal.position.x, 5, 'Position X rounded to integer');
assert.strictEqual(sanitizedNormal.position.y, 11, 'Position Y rounded to integer');

// Out of bounds (negative)
const negToken = { id: 't2', position: { x: -5, y: -2 }, size: 1 };
const sanitizedNeg = sanitizeToken(negToken, 30, 30);
assert.strictEqual(sanitizedNeg.position.x, 0, 'Negative X clamped to 0');
assert.strictEqual(sanitizedNeg.position.y, 0, 'Negative Y clamped to 0');

// Out of bounds (exceeds map width/height considering token size 2)
const bigToken = { id: 't3', position: { x: 50, y: 100 }, size: 2 };
const sanitizedBig = sanitizeToken(bigToken, 30, 20);
assert.strictEqual(sanitizedBig.position.x, 28, 'Token size 2 clamped to width - size = 28');
assert.strictEqual(sanitizedBig.position.y, 18, 'Token size 2 clamped to height - size = 18');

// NaN token position
const nanToken = { id: 't4', position: { x: NaN, y: 5 } };
assert.strictEqual(sanitizeToken(nanToken, 30, 30), null, 'NaN token rejected');
console.log('✓ sanitizeToken correctly clamps, rounds, and bounds tokens within map dimensions');

console.log('\n🎉 ALL MAP & RAYCASTING ENGINE TESTS PASSED SUCCESSFULLY!\n');
