import React from 'react';
import type { MapConfig } from './mapTypes';
import './GridLayer.css';

interface GridLayerProps {
    config: MapConfig;
}

export const GridLayer: React.FC<GridLayerProps> = ({ config }) => {
    const { gridSize, width, height } = config;

    return (
        <>
            {/* Background Image Layer */}
            {config.backgroundImage && (
                <div
                    style={{
                        position: 'absolute',
                        top: 0, left: 0,
                        width: width * gridSize,
                        height: height * gridSize,
                        backgroundImage: `url(${config.backgroundImage})`,
                        backgroundSize: '100% 100%',
                        zIndex: 1
                    }}
                />
            )}
            {/* Grid Lines Layer */}
            <div
                className="grid-layer"
                style={{
                    width: width * gridSize,
                    height: height * gridSize,
                    backgroundSize: `${gridSize}px ${gridSize}px`,
                    // No inline backgroundImage, let CSS handle the gradients
                    zIndex: 2
                }}
            />
        </>
    );
};
