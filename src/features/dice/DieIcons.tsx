import { Triangle, Square, Hexagon } from 'lucide-react';

// Simple SVG Wrappers for Dice Icons
// In a real app we might use custom SVGs, but Lucide shapes + text works for a clean UI.

export const D4Icon = () => <Triangle className="w-6 h-6" />;
export const D6Icon = () => <Square className="w-6 h-6" />;
export const D8Icon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 22h20L12 2z" /> {/* Triangle variant */}
        <path d="M12 2v20" />
    </svg>
);
export const D10Icon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l10 10-10 10L2 12 12 2z" /> {/* Kite shape */}
    </svg>
);
export const D12Icon = () => <Hexagon className="w-6 h-6" />;
export const D20Icon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l8.5 5v10L12 22l-8.5-5V7L12 2z" />
        <path d="M12 22V12" />
        <path d="M12 12L3.5 7" />
        <path d="M12 12l8.5-5" />
    </svg>
);
