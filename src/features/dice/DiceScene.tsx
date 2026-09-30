import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics, usePlane, useBox } from '@react-three/cannon';
import { Environment } from '@react-three/drei';
import PhysicsDie from './PhysicsDie';

import { useThree } from '@react-three/fiber';

// Dynamic Physics Walls based on Viewport (Screen Edges)
const ScreenWalls = () => {
    const { viewport } = useThree();

    // SAFETY: Thicker walls to prevent tunneling
    const thickness = 500;
    const height = 100; // Tall walls

    // Viewport dimensions at z=0 
    const width = viewport.width;
    const vHeight = viewport.height;

    // Left Wall
    useBox(() => ({
        position: [-width / 2 - thickness / 2, 0, 0],
        args: [thickness, height, 100],
        material: { friction: 1, restitution: 0 } // No Bounce
    }));

    // Right Wall (MOVED FAR AWAY to allow entry)
    useBox(() => ({
        position: [width / 2 + thickness / 2 + 100, 0, 0], // Gap for spawning
        args: [thickness, height, 100],
        material: { friction: 1, restitution: 0 }
    }));

    // Top Wall
    useBox(() => ({
        position: [0, vHeight / 2 + thickness / 2, 0],
        args: [width * 2, thickness, 100],
        material: { friction: 1, restitution: 0 }
    }));

    // Bottom Wall
    useBox(() => ({
        position: [0, -vHeight / 2 - thickness / 2, 0],
        args: [width * 2, thickness, 100],
        material: { friction: 1, restitution: 0 }
    }));

    // Ceiling (invisible lid to prevent flying out Z-axis)
    useBox(() => ({
        position: [0, 0, 20], // High ceiling
        args: [width * 4, vHeight * 4, 2]
    }));

    // Floor - Invisible collider (z=0 for VTT feel)
    usePlane(() => ({
        position: [0, 0, 0],
        rotation: [-Math.PI / 2, 0, 0],
        material: { friction: 0.5, restitution: 0.3 } // Grippy Floor (Stops dice)
    }));

    return null;
}

interface DiceSceneProps {
    dice: Array<{ id: string, type: string, value: number, position?: [number, number, number] }>;
    onRollComplete: (results: Record<string, number>) => void;
}

export const DiceScene: React.FC<DiceSceneProps> = ({ dice, onRollComplete }) => {
    const [results, setResults] = React.useState<Record<string, number>>({});

    const handleDieRest = React.useCallback((id: string, value: number) => {
        console.log(`[DiceScene] Die ${id} reported value ${value}`);
        setResults(prev => ({ ...prev, [id]: value }));
    }, []);

    const hasNotified = React.useRef(false);

    // Reset notified state when new dice arrive
    // FIX: Depend on IDs string to avoid reference checks resetting state unnecessarily
    const diceIds = dice.map(d => d.id).join(',');

    React.useEffect(() => {
        console.log("[DiceScene] Dice IDs changed:", diceIds);
        setResults({});
        hasNotified.current = false;
    }, [diceIds]);

    // Monitor results for completion
    React.useEffect(() => {

        const resultIds = Object.keys(results);
        const count = resultIds.length;

        // STRICT CHECK: Ensure results belong to CURRENT dice
        const allPresent = dice.length > 0 && dice.every(d => results[d.id] !== undefined);

        console.debug(`[DiceScene] Progress: ${count}/${dice.length} results.`);

        if (allPresent && !hasNotified.current) {
            console.log("[DiceScene] All dice settled (IDs Verified). Calling onRollComplete.", results);
            hasNotified.current = true;
            onRollComplete(results);
        }
    }, [results, dice, onRollComplete]);

    // MASTER FAILSAFE: Force finish after 12 seconds if not done
    React.useEffect(() => {
        const tm = setTimeout(() => {
            if (!hasNotified.current && dice.length > 0) {
                console.warn("[DiceScene] Master Failsafe Triggered.");
                hasNotified.current = true;
                const finalResults = { ...dice.reduce((acc, d) => ({ ...acc, [d.id]: 1 }), {}) };
                onRollComplete(finalResults);
            }
        }, 12000);
        return () => clearTimeout(tm);
    }, [onRollComplete, dice]); // this resets timer if dice changes, which is correct

    return (
        <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, pointerEvents: 'none', zIndex: 999 }}>
            <Canvas
                style={{ pointerEvents: 'none' }}
                dpr={[1, 1.5]}
                gl={{ alpha: true, antialias: true }}
                camera={{ position: [0, 30, 0], fov: 25 }} // Higher camera, less perspective distortion
                onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
            >
                <ambientLight intensity={1.5} />
                <pointLight position={[10, 20, 10]} intensity={1.5} />
                <pointLight position={[-10, 20, -10]} intensity={1.0} />

                <Suspense fallback={null}>
                    <Physics
                        gravity={[0, -25, 0]}
                        allowSleep={true} // Allow bodies to sleep (stop simulating)
                        broadphase="SAP" // Sweep and Prune (Better for flat floors)
                        defaultContactMaterial={{
                            restitution: 0.3,
                            friction: 0.3,
                            contactEquationRelaxation: 4, // Reduce jitter
                            contactEquationStiffness: 1e8
                        }}
                        stepSize={1 / 60}
                    >
                        <ScreenWalls />
                        {dice.map((die) => (
                            <PhysicsDie
                                key={die.id}
                                id={die.id}
                                type={die.type as any}
                                onRest={handleDieRest}
                                position={die.position || [0, 10, 0]}
                            />
                        ))}
                    </Physics>
                    <Environment preset="city" />
                </Suspense>
            </Canvas>
        </div>
    );
};
