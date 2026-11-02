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
const createD20Geometry = () => new THREE.IcosahedronGeometry(0.8, 0);

/**
 * Geometria real de Trapezoedro Pentagonal (10 faces coplanares em formato de pipa/kite).
 * A relação h = H * (1 - cos(36°)) / (1 + cos(36°)) garante que os dois triângulos de cada
 * uma das 10 faces sejam estritamente coplanares e que faces opostas sejam paralelas.
 * As 5 faces superiores (0..4) são seguidas pelas 5 faces inferiores opostas (5..9).
 */
const createD10Geometry = (): THREE.BufferGeometry => {
    const R = 0.85;
    const H = 0.85;
    const alpha = Math.PI / 5; // 36°
    const cosAlpha = Math.cos(alpha);
    const h = H * ((1 - cosAlpha) / (1 + cosAlpha));

    const top = new THREE.Vector3(0, H, 0);
    const bottom = new THREE.Vector3(0, -H, 0);
    const upper: THREE.Vector3[] = [];
    const lower: THREE.Vector3[] = [];

    for (let k = 0; k < 5; k++) {
        const theta = (2 * Math.PI * k) / 5;
        const phi = theta + alpha;
        upper.push(new THREE.Vector3(R * Math.cos(theta), h, R * Math.sin(theta)));
        lower.push(new THREE.Vector3(R * Math.cos(phi), -h, R * Math.sin(phi)));
    }

    const positions: number[] = [];
    const pushTri = (a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3) => {
        positions.push(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z);
    };

    // 5 faces superiores (k = 0..4)
    for (let k = 0; k < 5; k++) {
        const uNext = upper[(k + 1) % 5];
        const uCurr = upper[k];
        const lCurr = lower[k];
        pushTri(top, uNext, lCurr);
        pushTri(top, lCurr, uCurr);
    }

    // 5 faces inferiores opostas na mesma ordem (m = (k + 3) % 5 é paralela oposta à superior k)
    for (let k = 0; k < 5; k++) {
        const m = (k + 3) % 5;
        const lPrev = lower[(m + 4) % 5];
        const uCurr = upper[m];
        const lCurr = lower[m];
        pushTri(bottom, lPrev, uCurr);
        pushTri(bottom, uCurr, lCurr);
    }

    const vertexCount = positions.length / 3;
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new Float32BufferAttribute(positions, 3));
    geo.setAttribute('uv', new Float32BufferAttribute(new Float32Array(vertexCount * 2), 2));
    geo.computeVertexNormals();
    return geo;
};

// Valores oficiais balanceados (faces opostas somam 11 no d10 e 90 no d100_tens)
const D10_FACE_VALUES = [1, 3, 5, 7, 9, 10, 8, 6, 4, 2];
const D100_TENS_VALUES = [0, 20, 40, 60, 80, 90, 70, 50, 30, 10];
const D100_TENS_LABELS = ['00', '20', '40', '60', '80', '90', '70', '50', '30', '10'];
const D100_SINGLE_VALUES = [10, 30, 50, 70, 90, 100, 80, 60, 40, 20];

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

interface ExtractedFace {
    normal: THREE.Vector3;
    center: THREE.Vector3;
    value: number;
    label: string;
    materialIndex: number;
    d4Corners?: Array<{ u: number; v: number; label: string }>;
}

// --- FACE EXTRACTION ---
const extractFaceData = (
    geometry: THREE.BufferGeometry,
    customValues?: number[],
    customLabels?: string[]
): ExtractedFace[] => {
    const nonIndexed = geometry.toNonIndexed();
    const pos = nonIndexed.getAttribute('position');
    const faces: { normal: THREE.Vector3; center: THREE.Vector3; count: number }[] = [];
    const TOLERANCE = 0.98;
    for (let i = 0; i < pos.count; i += 3) {
        const v1 = new THREE.Vector3().fromBufferAttribute(pos, i);
        const v2 = new THREE.Vector3().fromBufferAttribute(pos, i + 1);
        const v3 = new THREE.Vector3().fromBufferAttribute(pos, i + 2);
        const triCenter = new THREE.Vector3().addVectors(v1, v2).add(v3).divideScalar(3);
        const triNormal = new THREE.Vector3()
            .crossVectors(new THREE.Vector3().subVectors(v2, v1), new THREE.Vector3().subVectors(v3, v1))
            .normalize();
        let matched = false;
        for (const f of faces) {
            if (f.normal.dot(triNormal) > TOLERANCE) {
                f.center.add(triCenter);
                f.count++;
                matched = true;
                break;
            }
        }
        if (!matched) faces.push({ normal: triNormal, center: triCenter.clone(), count: 1 });
    }
    return faces.map((f, i) => {
        const val = customValues && customValues[i] !== undefined ? customValues[i] : i + 1;
        const lbl = customLabels && customLabels[i] !== undefined ? customLabels[i] : val.toString();
        return {
            normal: f.normal,
            // FIX: Divide pela contagem de triângulos da face para centralizar UVs em pipas (d10) e pentágonos (d12)
            center: f.center.clone().divideScalar(f.count),
            value: val,
            label: lbl,
            materialIndex: i + 1
        };
    });
};

// --- TEXTURE ---
const materialCache: Record<string, THREE.MeshStandardMaterial> = {};
const witcherImg = new Image();
witcherImg.src = witcherSkin;
let isWitcherLoaded = false;
witcherImg.onload = () => { isWitcherLoaded = true; };

const getNumberMaterial = (labelOrVal: number | string, isWitcher: boolean = true) => {
    if (!isWitcherLoaded && witcherImg.complete && witcherImg.naturalWidth !== 0) {
        isWitcherLoaded = true;
    }

    const text = String(labelOrVal);
    const key = `num_${text}_${isWitcher ? 'w' : 'd'}`;
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
            ctx.save();
            ctx.translate(64, 64);
            ctx.fillStyle = '#ffffff';
            ctx.font = text.length >= 3 ? 'bold 30px "Cinzel", "Times New Roman", serif' : 'bold 40px "Cinzel", "Times New Roman", serif';
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText(text, 0, 0);
            ctx.restore();
            const tempTex = new THREE.CanvasTexture(canvas);
            return new THREE.MeshStandardMaterial({ map: tempTex, roughness: 0.3, metalness: 0.7, flatShading: true });
        }
    } else {
        ctx.fillStyle = '#1a1a1a'; ctx.fillRect(0, 0, 128, 128);
        ctx.strokeStyle = '#aaaaaa'; ctx.lineWidth = 5; ctx.strokeRect(0, 0, 128, 128);
    }

    ctx.translate(64, 64);
    ctx.shadowColor = '#00eaff'; ctx.shadowBlur = 8;
    ctx.fillStyle = '#ffffff';
    ctx.font = text.length >= 3 ? 'bold 30px "Cinzel", "Times New Roman", serif' : 'bold 38px "Cinzel", "Times New Roman", serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(text, 0, 0);

    if (text === '6' || text === '9') ctx.fillRect(-10, 20, 20, 3);

    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 4;
    const mat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.3, metalness: 0.7, flatShading: true });
    materialCache[key] = mat;
    return mat;
};

const getD4FaceMaterial = (
    faceIdx: number,
    corners: Array<{ u: number; v: number; label: string }>,
    isWitcher: boolean = true
) => {
    if (!isWitcherLoaded && witcherImg.complete && witcherImg.naturalWidth !== 0) {
        isWitcherLoaded = true;
    }

    const sig = corners.map(c => c.label).join('-');
    const key = `d4_${faceIdx}_${sig}_${isWitcher ? 'w' : 'd'}`;
    if (materialCache[key]) return materialCache[key];

    const canvas = document.createElement('canvas');
    canvas.width = 128; canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.MeshStandardMaterial({ color: '#950740' });

    const canCache = !isWitcher || isWitcherLoaded;
    if (isWitcher && isWitcherLoaded) {
        ctx.drawImage(witcherImg, 0, 0, 128, 128);
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(0, 0, 128, 128);
    } else {
        ctx.fillStyle = '#500000';
        ctx.fillRect(0, 0, 128, 128);
    }

    ctx.shadowColor = '#00eaff';
    ctx.shadowBlur = 6;
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 26px "Cinzel", "Times New Roman", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Desenha o número de cada vértice próximo à respectiva ponta do triângulo
    corners.forEach(c => {
        const cu = 0.5 + (c.u - 0.5) * 0.58;
        const cv = 0.5 + (c.v - 0.5) * 0.58;
        const px = cu * 128;
        const py = (1 - cv) * 128;
        ctx.fillText(c.label, px, py);
    });

    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 4;
    const mat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.3, metalness: 0.7, flatShading: true });
    if (canCache) {
        materialCache[key] = mat;
    }
    return mat;
};

// --- GEOMETRY CACHE & UV FIX ---
const geometryCache: Record<string, { geometry: THREE.BufferGeometry; convexArgs: any; faceData: ExtractedFace[]; materials: THREE.Material[] }> = {};

const buildMaterialsForFaces = (type: string, faceData: ExtractedFace[]): THREE.Material[] => {
    const mats: THREE.Material[] = [new THREE.MeshStandardMaterial({ color: '#2b2b2b' })];
    faceData.forEach((f, idx) => {
        if (type === 'd4' && f.d4Corners && f.d4Corners.length === 3) {
            mats.push(getD4FaceMaterial(idx, f.d4Corners, true));
        } else {
            mats.push(getNumberMaterial(f.label, true));
        }
    });
    return mats;
};

const getCachedGeometry = (type: string) => {
    if (geometryCache[type]) return geometryCache[type];
    let geo: THREE.BufferGeometry;
    let customValues: number[] | undefined;
    let customLabels: string[] | undefined;

    switch (type) {
        case 'd4':
            geo = createD4Geometry();
            break;
        case 'd8':
            geo = createD8Geometry();
            break;
        case 'd10':
            geo = createD10Geometry();
            customValues = D10_FACE_VALUES;
            break;
        case 'd100_tens':
            geo = createD10Geometry();
            customValues = D100_TENS_VALUES;
            customLabels = D100_TENS_LABELS;
            break;
        case 'd100':
            geo = createD10Geometry();
            customValues = D100_SINGLE_VALUES;
            break;
        case 'd12':
            geo = createD12Geometry();
            break;
        case 'd20':
        default:
            geo = createD20Geometry();
            break;
    }

    const faceData = extractFaceData(geo, customValues, customLabels);
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
            const triNormal = new THREE.Vector3()
                .crossVectors(new THREE.Vector3().subVectors(v2, v1), new THREE.Vector3().subVectors(v3, v1))
                .normalize();

            let bestFace = faceData[0];
            let maxDot = -Infinity;
            for (const f of faceData) {
                const dot = f.normal.dot(triNormal);
                if (dot > maxDot) { maxDot = dot; bestFace = f; }
            }

            if (!bestFace || !bestFace.center) continue;

            const normal = bestFace.normal.clone();
            const up = new THREE.Vector3(0, 1, 0);
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
            const d4Corners: Array<{ u: number; v: number; label: string }> = [];

            [v1, v2, v3].forEach((v, idx) => {
                const relative = new THREE.Vector3().subVectors(v, bestFace.center);
                const x = relative.dot(right);
                const y = relative.dot(realUp);

                const u = 0.5 + (x / scale);
                const v_coord = 0.5 + (y / scale);

                uv.setXY(i3 + idx, u, v_coord);

                if (type === 'd4') {
                    // O vértice v é oposto à única face cuja normal aponta na direção contrária a v (dot mínimo)
                    let oppFace = faceData[0];
                    let minCornerDot = Infinity;
                    for (const candidate of faceData) {
                        const d = v.dot(candidate.normal);
                        if (d < minCornerDot) {
                            minCornerDot = d;
                            oppFace = candidate;
                        }
                    }
                    d4Corners.push({ u, v: v_coord, label: oppFace.label });
                }
            });

            if (type === 'd4' && d4Corners.length === 3) {
                bestFace.d4Corners = d4Corners;
            }
        }
        uv.needsUpdate = true;
    }

    const materials = buildMaterialsForFaces(type, faceData);

    for (let i = 0; i < faceCount; i++) {
        const i3 = i * 3;
        const v1 = new THREE.Vector3().fromBufferAttribute(pos, i3);
        const v2 = new THREE.Vector3().fromBufferAttribute(pos, i3 + 1);
        const v3 = new THREE.Vector3().fromBufferAttribute(pos, i3 + 2);
        const triNormal = new THREE.Vector3()
            .crossVectors(new THREE.Vector3().subVectors(v2, v1), new THREE.Vector3().subVectors(v3, v1))
            .normalize();

        let bestMatIdx = 1;
        let maxDot = -Infinity;
        for (const f of faceData) {
            const dot = f.normal.dot(triNormal);
            if (dot > maxDot) {
                maxDot = dot;
                bestMatIdx = f.materialIndex;
            }
        }
        geo.addGroup(i3, 3, bestMatIdx);
    }

    const convexArgs = toConvexProps(geo);
    geometryCache[type] = { geometry: geo, convexArgs, faceData, materials };
    return geometryCache[type];
};

// --- HELPERS PARA ROLAGEM SEGURA ---
export const getDieSides = (type: string): number => {
    switch (type.toLowerCase()) {
        case 'd4': return 4;
        case 'd6': return 6;
        case 'd8': return 8;
        case 'd10': return 10;
        case 'd100_tens': return 10;
        case 'd12': return 12;
        case 'd20': return 20;
        case 'd100': return 100;
        default: return 20;
    }
};

export const getRandomDieValue = (type: string): number => {
    const lower = type.toLowerCase();
    if (lower === 'd100_tens') {
        return Math.floor(Math.random() * 10) * 10;
    }
    const sides = getDieSides(lower);
    return Math.floor(Math.random() * sides) + 1;
};

// --- COMPONENTS ---
interface CommonDieProps {
    id: string;
    position: [number, number, number];
    onRest: (id: string, val: number) => void;
}

const BoxDie: React.FC<CommonDieProps> = ({ id, position, onRest }) => {
    const onRestRef = useRef(onRest);
    useEffect(() => { onRestRef.current = onRest; }, [onRest]);

    // FIX: Re-renderiza textura do d6 caso a imagem de fundo termine de carregar após a 1ª montagem
    const [texTick, setTexTick] = useState(0);
    useEffect(() => {
        if (!isWitcherLoaded) {
            const interval = setInterval(() => {
                if (witcherImg.complete && witcherImg.naturalWidth !== 0) {
                    isWitcherLoaded = true;
                    setTexTick(t => t + 1);
                    clearInterval(interval);
                }
            }, 100);
            return () => clearInterval(interval);
        }
    }, []);

    const materials = useMemo(
        () => [1, 6, 2, 5, 3, 4].map(n => getNumberMaterial(n, true)),
        [texTick]
    );
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

        // STOP DETECTION: Position Delta
        const lastPos = { current: new THREE.Vector3(0, -100, 0) };
        let stableFrames = 0;

        const sub = api.position.subscribe(p => {
            if (!isFinished.current) {
                const currentPos = new THREE.Vector3(p[0], p[1], p[2]);
                const dist = currentPos.distanceTo(lastPos.current);

                if (dist < 0.01) {
                    stableFrames++;
                    if (stableFrames > 30) {
                        isFinished.current = true;
                        resolve();
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
                isFinished.current = true;
                resolve();
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

    const [texTick, setTexTick] = useState(0);
    useEffect(() => {
        if (!isWitcherLoaded) {
            const interval = setInterval(() => {
                if (witcherImg.complete && witcherImg.naturalWidth !== 0) {
                    isWitcherLoaded = true;
                    setTexTick(t => t + 1);
                    clearInterval(interval);
                }
            }, 100);
            return () => clearInterval(interval);
        }
    }, []);

    const { geometry, convexArgs, faceData, materials: cachedMats } = getCachedGeometry(type);

    const materials = useMemo(() => {
        if (isWitcherLoaded) {
            return buildMaterialsForFaces(type, faceData);
        }
        return cachedMats;
    }, [cachedMats, faceData, type, texTick]);

    // TUNED PHYSICS: Same as BoxDie (Mass 2, Damping 0.5)
    const [ref, api] = useConvexPolyhedron(() => ({
        mass: 2,
        position,
        args: convexArgs,
        linearDamping: 0.5,
        angularDamping: 0.5,
        material: { friction: 0.5, restitution: 0.1 },
        collisionFilterGroup: 2,
        collisionFilterMask: 1
    }), useRef<THREE.Mesh>(null));
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
                const q = new THREE.Quaternion();
                ref.current.getWorldQuaternion(q);
                const up = new THREE.Vector3(0, 1, 0);
                const localUp = up.clone().applyQuaternion(q.invert());

                let val = faceData[0]?.value ?? 1;
                if (type === 'd4') {
                    // FIX: No tetraedro (d4), a ponta fica para cima e a única face determinística é a apoiada no chão (menor dot com +Y)
                    let minDot = Infinity;
                    faceData.forEach(f => {
                        const d = f.normal.dot(localUp);
                        if (d < minDot) {
                            minDot = d;
                            val = f.value;
                        }
                    });
                } else {
                    let maxDot = -Infinity;
                    faceData.forEach(f => {
                        const d = f.normal.dot(localUp);
                        if (d > maxDot) {
                            maxDot = d;
                            val = f.value;
                        }
                    });
                }

                console.log(`[PhysicsDie:${id}] ${type} Result: ${val}`);
                setTimeout(() => onRestRef.current(id, val), 0);
            } else {
                setTimeout(() => onRestRef.current(id, getRandomDieValue(type)), 0);
            }
        };

        const lastPos = { current: new THREE.Vector3(0, -100, 0) };
        let stableFrames = 0;

        const sub = api.position.subscribe(p => {
            if (!isFinished.current) {
                const currentPos = new THREE.Vector3(p[0], p[1], p[2]);
                const dist = currentPos.distanceTo(lastPos.current);

                if (dist < 0.01) {
                    stableFrames++;
                    if (stableFrames > 30) {
                        isFinished.current = true;
                        resolve();
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
                isFinished.current = true;
                resolve();
            }
        }, 8000);

        return () => { sub(); clearTimeout(tm); };
    }, [api, id, faceData, type]);

    return <mesh ref={ref} geometry={geometry} material={materials} />;
};

export interface PhysicsDieProps {
    id: string;
    position: [number, number, number];
    type: string;
    onRest: (id: string, value: number) => void;
}

const PhysicsDie: React.FC<PhysicsDieProps> = (props) => {
    if (props.type === 'd6') return <BoxDie {...props} />;
    return <PolyDie {...props} />;
};

export default PhysicsDie;
