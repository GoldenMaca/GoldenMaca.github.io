// Game Constants
const CONSTANTS = {
    // Physics
    G: 6.67430e-11,
    SCALE: 1e-6,
    TIME_STEP: 1/60,
    
    // Grid
    GRID_SIZE: 40,
    GRID_SNAP: 40,
    
    // Part sizes (in meters, for physics)
    PART_SIZES: {
        TINY: 0.625,
        SMALL: 1.25,
        MEDIUM: 2.5,
        LARGE: 3.75,
        XLARGE: 5.0
    },
    
    // Atmosphere settings
    ATMOSPHERE_SCALE: 1.2,
    
    // Camera
    MIN_ZOOM: 0.1,
    MAX_ZOOM: 5.0,
    
    // Colors
    COLORS: {
        GRID: '#2a2a3e',
        GRID_HIGHLIGHT: '#3a3a5e',
        SELECTION: '#44aa66',
        PART_OUTLINE: '#6a6a8a',
        TRAJECTORY: '#ffaa44',
        ORBIT: '#44aaff',
        APOAPSIS: '#ff6644',
        PERIAPSIS: '#44ff66'
    }
};

// Math helpers
const Vec2 = {
    add: (a, b) => ({ x: a.x + b.x, y: a.y + b.y }),
    sub: (a, b) => ({ x: a.x - b.x, y: a.y - b.y }),
    mul: (v, s) => ({ x: v.x * s, y: v.y * s }),
    div: (v, s) => ({ x: v.x / s, y: v.y / s }),
    mag: (v) => Math.sqrt(v.x * v.x + v.y * v.y),
    norm: (v) => {
        const m = Math.sqrt(v.x * v.x + v.y * v.y);
        return m > 0 ? { x: v.x / m, y: v.y / m } : { x: 0, y: 0 };
    },
    dot: (a, b) => a.x * b.x + a.y * b.y,
    cross: (a, b) => a.x * b.y - a.y * b.x,
    rotate: (v, angle) => ({
        x: v.x * Math.cos(angle) - v.y * Math.sin(angle),
        y: v.x * Math.sin(angle) + v.y * Math.cos(angle)
    }),
    dist: (a, b) => Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2),
    angle: (v) => Math.atan2(v.y, v.x)
};

function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
}

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function formatNumber(n, decimals = 1) {
    if (Math.abs(n) >= 1e9) return (n / 1e9).toFixed(decimals) + 'B';
    if (Math.abs(n) >= 1e6) return (n / 1e6).toFixed(decimals) + 'M';
    if (Math.abs(n) >= 1e3) return (n / 1e3).toFixed(decimals) + 'K';
    return n.toFixed(decimals);
}

