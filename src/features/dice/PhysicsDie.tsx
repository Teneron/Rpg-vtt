import { useRef, useMemo, useEffect, useState } from 'react';
import { useBox, useConvexPolyhedron } from '@react-three/cannon';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Float32BufferAttribute } from 'three';
import witcherSkin from '../../assets/textures/witcher_dice_skin.png';

// --- GEOMETRY GENERATORS ---
const createD6Geometry = () => new THREE.BoxGeometry(1.0, 1.0, 1.0);
const createD4Geometry = () => new THREE.TetrahedronGeometry(1.2, 0);
const createD8Geometry = () => new THREE.OctahedronGeometry(0.8, 0);
const createD12Geometry = () => new THREE.DodecahedronGeometry(0.8, 0);
// TODO: Real Pentagonal Trapezohedron for D10. Currently proxied by Dodecahedron.
const createD10Geometry = () => new THREE.DodecahedronGeometry(0.8, 0);
const createD20Geometry = () => new THREE.IcosahedronGeometry(0.8, 0);

// --- HELPER: Convex Args ---
const toConvexProps = (bufferGeometry: THREE.BufferGeometry) => {
    const geo = bufferGeometry.toNonIndexed();
    const pos = geo.getAttribute('position') as Float32BufferAttribute;
    const vertices: number[][] = [];
    const faces: number[][] = [];
    for (let i = 0; i < pos.count; i++) vertices.push([pos.getX(i), pos.getY(i), pos.getZ(i)]);
    for (let i = 0; i < pos.count; i += 3) faces.push([i, i + 1, i + 2]);
    return [vertices, faces] as any;
};

// --- FACE EXTRACTION ---
const extractFaceData = (geometry: THREE.BufferGeometry) => {
    const nonIndexed = geometry.toNonIndexed();
    const pos = nonIndexed.getAttribute('position');
    const faces: { normal: THREE.Vector3, center: THREE.Vector3, count: number }[] = [];
    const TOLERANCE = 0.98;
    for (let i = 0; i < pos.count; i += 3) {
        const v1 = new THREE.Vector3().fromBufferAttribute(pos, i);
        const v2 = new THREE.Vector3().fromBufferAttribute(pos, i + 1);
        const v3 = new THREE.Vector3().fromBufferAttribute(pos, i + 2);
        const triCenter = new THREE.Vector3().addVectors(v1, v2).add(v3).divideScalar(3);
        const triNormal = new THREE.Vector3().crossVectors(new THREE.Vector3().subVectors(v2, v1), new THREE.Vector3().subVectors(v3, v1)).normalize();
        let matched = false;
        for (const f of faces) { if (f.normal.dot(triNormal) > TOLERANCE) { f.center.add(triCenter); f.count++; matched = true; break; } }
        if (!matched) faces.push({ normal: triNormal, center: triCenter, count: 1 });
    }
    return faces.map((f, i) => ({ normal: f.normal, center: f.center, value: i + 1 }));
};

// --- TEXTURE ---
const materialCache: Record<string, THREE.MeshStandardMaterial> = {};
const witcherImg = new Image();
witcherImg.src = witcherSkin;
let isWitcherLoaded = false;
witcherImg.onload = () => { isWitcherLoaded = true; };

const getNumberMaterial = (val: number, isWitcher: boolean = true) => {
    if (!isWitcherLoaded && witcherImg.complete && witcherImg.naturalWidth !== 0) {
        isWitcherLoaded = true;
    }

    const key = `num_${val}_${isWitcher ? 'w' : 'd'}`;
    if (materialCache[key]) return materialCache[key];

    const canvas = document.createElement('canvas');
    canvas.width = 128; canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.MeshStandardMaterial({ color: '#950740' });

    if (isWitcher) {
        if (isWitcherLoaded) {
            ctx.drawImage(witcherImg, 0, 0, 128, 128);
            ctx.fillStyle = 'rgba(0,0,0,0.6)';
            ctx.fillRect(0, 0, 128, 128);
        } else {
            ctx.fillStyle = '#500000';
            ctx.fillRect(0, 0, 128, 128);
            const tempTex = new THREE.CanvasTexture(canvas);
            return new THREE.MeshStandardMaterial({ map: tempTex });
        }
    } else {
        ctx.fillStyle = '#1a1a1a'; ctx.fillRect(0, 0, 128, 128);
        ctx.strokeStyle = '#aaaaaa'; ctx.lineWidth = 5; ctx.strokeRect(0, 0, 128, 128);
    }

    ctx.translate(64, 64);
    ctx.shadowColor = "#00eaff"; ctx.shadowBlur = 8;
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 40px "Cinzel", "Times New Roman", serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(val.toString(), 0, 0);

    if (val === 6 || val === 9) ctx.fillRect(-10, 20, 20, 3);

    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 4;
    const mat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.3, metalness: 0.7, flatShading: true });
    materialCache[key] = mat;
    return mat;
};

// --- GEOMETRY CACHE & UV FIX ---
const geometryCache: Record<string, { geometry: THREE.BufferGeometry, convexArgs: any, faceData: any[], materials: THREE.Material[] }> = {};

const getCachedGeometry = (type: string) => {
    if (geometryCache[type]) return geometryCache[type];
    let geo: THREE.BufferGeometry;
    switch (type) {
        case 'd4': geo = createD4Geometry(); break;
        case 'd8': geo = createD8Geometry(); break;
        case 'd10': geo = createD10Geometry(); break;
        case 'd12': geo = createD12Geometry(); break;
        case 'd20': geo = createD20Geometry(); break;
        default: geo = createD20Geometry(); break;
    }

    const faceData = extractFaceData(geo);
    geo = geo.toNonIndexed();
    geo.clearGroups();

    const pos = geo.getAttribute('position');
    const uv = geo.getAttribute('uv');
    const faceCount = pos.count / 3;

    if (uv && pos) {
        for (let i = 0; i < faceCount; i++) {
            const i3 = i * 3;
            const v1 = new THREE.Vector3().fromBufferAttribute(pos, i3);
            const v2 = new THREE.Vector3().fromBufferAttribute(pos, i3 + 1);
            const v3 = new THREE.Vector3().fromBufferAttribute(pos, i3 + 2);
            const triNormal = new THREE.Vector3().crossVectors(new THREE.Vector3().subVectors(v2, v1), new THREE.Vector3().subVectors(v3, v1)).normalize();

            let bestFace = faceData[0];
            let maxDot = -Infinity;
            for (const f of faceData) {
                const dot = f.normal.dot(triNormal);
                if (dot > maxDot) { maxDot = dot; bestFace = f; }
            }

            if (!bestFace || !bestFace.center) continue;

            const normal = bestFace.normal.clone();
            let up = new THREE.Vector3(0, 1, 0);
            if (Math.abs(normal.dot(up)) > 0.9) up.set(0, 0, 1);

            const right = new THREE.Vector3().crossVectors(up, normal).normalize();
            const realUp = new THREE.Vector3().crossVectors(normal, right).normalize();

            let maxDist = 0;
            [v1, v2, v3].forEach(v => {
                const relative = new THREE.Vector3().subVectors(v, bestFace.center);
                const x = relative.dot(right);
                const y = relative.dot(realUp);
                const dist = Math.sqrt(x * x + y * y);
                if (dist > maxDist) maxDist = dist;
            });

            const scale = (maxDist * 2.0) || 1.0;

            [v1, v2, v3].forEach((v, idx) => {
                const relative = new THREE.Vector3().subVectors(v, bestFace.center);
                const x = relative.dot(right);
                const y = relative.dot(realUp);

                const u = 0.5 + (x / scale);
                const v_coord = 0.5 + (y / scale);

                uv.setXY(i3 + idx, u, v_coord);
            });
        }
        uv.needsUpdate = true;
    }

    const materials: THREE.Material[] = [];
    materials.push(new THREE.MeshStandardMaterial({ color: '#2b2b2b' }));
    for (let i = 1; i <= 20; i++) materials.push(getNumberMaterial(i, true));

    for (let i = 0; i < faceCount; i++) {
        const i3 = i * 3;
        const v1 = new THREE.Vector3().fromBufferAttribute(pos, i3);
        const v2 = new THREE.Vector3().fromBufferAttribute(pos, i3 + 1);
        const v3 = new THREE.Vector3().fromBufferAttribute(pos, i3 + 2);
        const triNormal = new THREE.Vector3().crossVectors(new THREE.Vector3().subVectors(v2, v1), new THREE.Vector3().subVectors(v3, v1)).normalize();

        let bestVal = 0; let maxDot = -Infinity;
        for (const f of faceData) {
            const dot = f.normal.dot(triNormal);
            if (dot > maxDot) { maxDot = dot; bestVal = f.value; }
        }
        geo.addGroup(i3, 3, bestVal);
    }

    const convexArgs = toConvexProps(geo);
    geometryCache[type] = { geometry: geo, convexArgs, faceData, materials };
    return geometryCache[type];
};

// --- HELPERS PARA ROLAGEM SEGURA (Fase 2) ---
export const getDieSides = (type: string): number => {
    switch (type.toLowerCase()) {
        case 'd4': return 4;
        case 'd6': return 6;
        case 'd8': return 8;
        case 'd10': return 10;
        case 'd12': return 12;
        case 'd20': return 20;
        case 'd100': return 100;
        default: return 20;
    }
};

export const getRandomDieValue = (type: string): number => {
    const sides = getDieSides(type);
    return Math.floor(Math.random() * sides) + 1;
};

// --- COMPONENTS ---
interface CommonDieProps {
    id: string; position: [number, number, number]; onRest: (id: string, val: number) => void;
}

const BoxDie: React.FC<CommonDieProps> = ({ id, position, onRest }) => {
    const onRestRef = useRef(onRest);
    useEffect(() => { onRestRef.current = onRest; }, [onRest]);

    const materials = useMemo(() => [1, 6, 2, 5, 3, 4].map(n => getNumberMaterial(n, true)), []);
    const geometry = useMemo(() => createD6Geometry(), []);

    // TUNED PHYSICS: BoxDie
    const meshRef = useRef<THREE.Mesh>(null);
    const [ref, api] = useBox(() => ({
        mass: 2,
        position,
        args: [0.5, 0.5, 0.5],
        linearDamping: 0.5,
        angularDamping: 0.5,
        allowSleep: true,
        sleepSpeedLimit: 0.5,
        sleepTimeLimit: 0.5,
        collisionFilterGroup: 2,
        collisionFilterMask: 1,
        material: { friction: 0.5, restitution: 0.1 }
    }), meshRef);
    const isFinished = useRef(false);

    // DEBUG: Mount/Unmount Tracking
    useEffect(() => {
        console.log(`[BoxDie:${id}] MOUNTED at ${position}`);
        return () => console.log(`[BoxDie:${id}] UNMOUNTED`);
    }, [id, position]);

    // SAFETY: Void Check
    useFrame(() => {
        if (!ref.current || isFinished.current) return;
        if (ref.current.position.y < -20) {
            console.warn(`[BoxDie:${id}] Fell into void. Forcing stop.`);
            isFinished.current = true;
            setTimeout(() => onRestRef.current(id, getRandomDieValue('d6')), 0);
        }
    });

    useEffect(() => {
        if (ref.current) {
            ref.current.rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2);
        }
        api.velocity.set(-(10 + Math.random() * 10), 5 + Math.random() * 8, (Math.random() - 0.5) * 8);
        api.angularVelocity.set((Math.random() - 0.5) * 50, (Math.random() - 0.5) * 50, (Math.random() - 0.5) * 50);
    }, [api]);

    useEffect(() => {
        const resolve = () => {
            if (ref.current) {
                console.log(`[BoxDie:${id}] RESOLVING via Position Check.`);
                const q = new THREE.Quaternion();
                ref.current.getWorldQuaternion(q);
                const up = new THREE.Vector3(0, 1, 0);
                const localUp = up.clone().applyQuaternion(q.invert());

                let bestVal = 1;
                let maxDot = -Infinity;
                const faces = [
                    { dir: new THREE.Vector3(1, 0, 0), val: 1 },
                    { dir: new THREE.Vector3(-1, 0, 0), val: 6 },
                    { dir: new THREE.Vector3(0, 1, 0), val: 2 },
                    { dir: new THREE.Vector3(0, -1, 0), val: 5 },
                    { dir: new THREE.Vector3(0, 0, 1), val: 3 },
                    { dir: new THREE.Vector3(0, 0, -1), val: 4 }
                ];

                faces.forEach(f => {
                    const dot = f.dir.dot(localUp);
                    if (dot > maxDot) { maxDot = dot; bestVal = f.val; }
                });

                console.log(`[BoxDie:${id}] Result Identified: ${bestVal}`);
                setTimeout(() => onRestRef.current(id, bestVal), 0);
            } else {
                setTimeout(() => onRestRef.current(id, getRandomDieValue('d6')), 0);
            }
        };

        // NEW STOP DETECTION: Position Delta
        // FIX: Use simple object, NOT useRef inside useEffect (React Error #321)
        const lastPos = { current: new THREE.Vector3(0, -100, 0) };
        let stableFrames = 0;

        console.log(`[BoxDie:${id}] Monitor Active.`);

        const sub = api.position.subscribe(p => {
            if (!isFinished.current) {
                const currentPos = new THREE.Vector3(p[0], p[1], p[2]);
                const dist = currentPos.distanceTo(lastPos.current);

                if (dist < 0.01) {
                    stableFrames++;
                    // console.debug(`[BoxDie:${id}] Stable Frame ${stableFrames}`);
                    if (stableFrames > 30) {
                        console.log(`[BoxDie:${id}] Position stable (>30 frames). Stopping.`);
                        isFinished.current = true; resolve();
                    }
                } else {
                    stableFrames = 0;
                    lastPos.current.copy(currentPos);
                }
            }
        });

        const tm = setTimeout(() => {
            if (!isFinished.current) {
                console.warn(`[PhysicsDie:${id}] Timeout (8s). Forcing stop.`);
                isFinished.current = true; resolve();
            }
        }, 8000);
        return () => { sub(); clearTimeout(tm); };
    }, [api, id]);

    return <mesh ref={ref} geometry={geometry} material={materials} />;
};

interface PolyDieProps extends CommonDieProps { type: string; }
const PolyDie: React.FC<PolyDieProps> = ({ id, position, type, onRest }) => {
    const onRestRef = useRef(onRest);
    useEffect(() => { onRestRef.current = onRest; }, [onRest]);

    const [_, setTick] = useState(0);
    useEffect(() => {
        if (!isWitcherLoaded) {
            const interval = setInterval(() => {
                if (witcherImg.complete) { isWitcherLoaded = true; setTick(t => t + 1); clearInterval(interval); }
            }, 100);
            return () => clearInterval(interval);
        }
    }, []);

    const { geometry, convexArgs, faceData, materials: cachedMats } = getCachedGeometry(type);

    const materials = useMemo(() => {
        if (isWitcherLoaded) {
            const mats = [];
            mats.push(new THREE.MeshStandardMaterial({ color: '#2b2b2b' }));
            for (let i = 1; i <= 20; i++) mats.push(getNumberMaterial(i, true));
            return mats;
        }
        return cachedMats;
    }, [cachedMats, _]);

    // TUNED PHYSICS: Same as BoxDie (Mass 2, Damping 0.5)
    const [ref, api] = useConvexPolyhedron(() => ({ mass: 2, position, args: convexArgs, linearDamping: 0.5, angularDamping: 0.5, material: { friction: 0.5, restitution: 0.1 }, collisionFilterGroup: 2, collisionFilterMask: 1 }), useRef<THREE.Mesh>(null));
    const isFinished = useRef(false);

    useFrame(() => {
        if (!ref.current || isFinished.current) return;
        if (ref.current.position.y < -20) {
            console.warn(`[PhysicsDie:${id}] ${type} fell into void. Forcing stop.`);
            isFinished.current = true;
            setTimeout(() => onRestRef.current(id, getRandomDieValue(type)), 0);
        }
    });

    useEffect(() => {
        if (ref.current) {
            ref.current.rotation.set(
                Math.random() * Math.PI * 2,
                Math.random() * Math.PI * 2,
                Math.random() * Math.PI * 2
            );
        }

        api.velocity.set(-(10 + Math.random() * 10), 5 + Math.random() * 8, (Math.random() - 0.5) * 8);
        api.angularVelocity.set(
            (Math.random() - 0.5) * 50,
            (Math.random() - 0.5) * 50,
            (Math.random() - 0.5) * 50
        );
    }, [api]);

    useEffect(() => {
        const resolve = () => {
            if (ref.current) {
                console.log(`[PhysicsDie:${id}] ${type} RESOLVING via Position Check.`);
                const q = new THREE.Quaternion(); ref.current.getWorldQuaternion(q);
                const up = new THREE.Vector3(0, 1, 0); const localUp = up.clone().applyQuaternion(q.invert());
                let max = -Infinity; let val = 1;
                faceData.forEach(f => { const d = f.normal.dot(localUp); if (d > max) { max = d; val = f.value; } });
                console.log(`[PhysicsDie:${id}] ${type} Result: ${val}`);
                setTimeout(() => onRestRef.current(id, val), 0);
            } else {
                setTimeout(() => onRestRef.current(id, getRandomDieValue(type)), 0);
            }
        };

        // NEW STOP DETECTION: Position Delta
        // FIX: Use simple object, NOT useRef inside useEffect
        const lastPos = { current: new THREE.Vector3(0, -100, 0) };
        let stableFrames = 0;

        console.log(`[PolyDie:${id}] Monitor Active.`);

        const sub = api.position.subscribe(p => {
            if (!isFinished.current) {
                const currentPos = new THREE.Vector3(p[0], p[1], p[2]);
                const dist = currentPos.distanceTo(lastPos.current);

                if (dist < 0.01) { // Very small movement (vibration)
                    stableFrames++;
                    if (stableFrames > 30) { // ~0.5s of no movement
                        console.log(`[PolyDie:${id}] Position stable (>30 frames). Stopping.`);
                        isFinished.current = true; resolve();
                    }
                } else {
                    stableFrames = 0;
                    lastPos.current.copy(currentPos);
                }
            }
        });

        const tm = setTimeout(() => {
            if (!isFinished.current) {
                console.warn(`[PhysicsDie:${id}] ${type} Timeout (8s). Forcing stop.`);
                isFinished.current = true; resolve();
            }
        }, 8000);

        return () => { sub(); clearTimeout(tm); };
    }, [api, id, faceData, type]);
    return <mesh ref={ref} geometry={geometry} material={materials} />;
};

export interface PhysicsDieProps { id: string; position: [number, number, number]; type: string; onRest: (id: string, value: number) => void; }
const PhysicsDie: React.FC<PhysicsDieProps> = (props) => {
    if (props.type === 'd6') return <BoxDie {...props} />;
    return <PolyDie {...props} />;
};
export default PhysicsDie;
