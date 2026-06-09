// Rocket Parts Database
const PARTS_DB = {
    // Command Modules
    'command-mk1': {
        id: 'command-mk1',
        name: 'Mk1 Command Pod',
        category: 'command',
        size: 'SMALL',
        width: 1,
        height: 1,
        mass: 0.8,
        cost: 600,
        icon: '🚀',
        description: 'Basic command pod for single kerbal',
        attachPoints: [{ x: 0, y: 1 }, { x: 0, y: -1 }]
    },
    'command-mk1-2': {
        id: 'command-mk1-2',
        name: 'Mk1-2 Command Pod',
        category: 'command',
        size: 'MEDIUM',
        width: 2,
        height: 1,
        mass: 1.5,
        cost: 1200,
        icon: '🛸',
        description: 'Advanced command pod for crew of 2-3',
        attachPoints: [{ x: 0, y: 1 }, { x: 0, y: -1 }]
    },
    'probe-core': {
        id: 'probe-core',
        name: 'Probodobodyne',
        category: 'command',
        size: 'TINY',
        width: 1,
        height: 1,
        mass: 0.1,
        cost: 200,
        icon: '📡',
        description: 'Unmanned probe core',
        attachPoints: [{ x: 0, y: 1 }, { x: 0, y: -1 }, { x: 1, y: 0 }, { x: -1, y: 0 }]
    },

    // Fuel Tanks
    'tank-flt100': {
        id: 'tank-flt100',
        name: 'FL-T100',
        category: 'fuel',
        size: 'SMALL',
        width: 1,
        height: 1,
        mass: 0.0625,
        fuelMass: 0.5,
        fuelCapacity: 45,
        cost: 150,
        icon: '🛢️',
        description: 'Small fuel tank',
        attachPoints: [{ x: 0, y: 1 }, { x: 0, y: -1 }]
    },
    'tank-flt200': {
        id: 'tank-flt200',
        name: 'FL-T200',
        category: 'fuel',
        size: 'SMALL',
        width: 1,
        height: 2,
        mass: 0.125,
        fuelMass: 1.0,
        fuelCapacity: 90,
        cost: 275,
        icon: '🛢️',
        description: 'Medium fuel tank',
        attachPoints: [{ x: 0, y: 1 }, { x: 0, y: -1 }]
    },
    'tank-flt400': {
        id: 'tank-flt400',
        name: 'FL-T400',
        category: 'fuel',
        size: 'SMALL',
        width: 1,
        height: 2,
        mass: 0.25,
        fuelMass: 2.0,
        fuelCapacity: 180,
        cost: 500,
        icon: '🛢️',
        description: 'Large fuel tank',
        attachPoints: [{ x: 0, y: 1 }, { x: 0, y: -1 }]
    },
    'tank-x2008': {
        id: 'tank-x2008',
        name: 'X200-8',
        category: 'fuel',
        size: 'MEDIUM',
        width: 2,
        height: 1,
        mass: 0.5,
        fuelMass: 4.0,
        fuelCapacity: 360,
        cost: 800,
        icon: '🛢️',
        description: 'Medium diameter tank',
        attachPoints: [{ x: 0, y: 1 }, { x: 0, y: -1 }]
    },
    'tank-x20016': {
        id: 'tank-x20016',
        name: 'X200-16',
        category: 'fuel',
        size: 'MEDIUM',
        width: 2,
        height: 2,
        mass: 1.0,
        fuelMass: 8.0,
        fuelCapacity: 720,
        cost: 1550,
        icon: '🛢️',
        description: 'Large medium tank',
        attachPoints: [{ x: 0, y: 1 }, { x: 0, y: -1 }]
    },
    'tank-s3-3600': {
        id: 'tank-s3-3600',
        name: 'S3-3600',
        category: 'fuel',
        size: 'LARGE',
        width: 3,
        height: 2,
        mass: 2.0,
        fuelMass: 16.0,
        fuelCapacity: 1440,
        cost: 3000,
        icon: '🛢️',
        description: 'Large diameter tank',
        attachPoints: [{ x: 0, y: 1 }, { x: 0, y: -1 }]
    },

    // Engines
    'engine-reliant': {
        id: 'engine-reliant',
        name: 'LV-T30 Reliant',
        category: 'engine',
        size: 'SMALL',
        width: 1,
        height: 1,
        mass: 1.25,
        cost: 1100,
        icon: '🔥',
        thrust: 205.16,
        ispSea: 265,
        ispVac: 310,
        description: 'First stage engine',
        attachPoints: [{ x: 0, y: 1 }]
    },
    'engine-terrier': {
        id: 'engine-terrier',
        name: 'LV-909 Terrier',
        category: 'engine',
        size: 'SMALL',
        width: 1,
        height: 1,
        mass: 0.5,
        cost: 390,
        icon: '🔥',
        thrust: 60,
        ispSea: 85,
        ispVac: 345,
        description: 'Vacuum optimized engine',
        attachPoints: [{ x: 0, y: 1 }]
    },
    'engine-swivel': {
        id: 'engine-swivel',
        name: 'LV-T45 Swivel',
        category: 'engine',
        size: 'SMALL',
        width: 1,
        height: 1,
        mass: 1.5,
        cost: 1200,
        icon: '🔥',
        thrust: 167.97,
        ispSea: 250,
        ispVac: 320,
        gimbal: 3.0,
        description: 'Gimbaled engine for steering',
        attachPoints: [{ x: 0, y: 1 }]
    },
    'engine-mainsail': {
        id: 'engine-mainsail',
        name: 'RE-M3 Mainsail',
        category: 'engine',
        size: 'MEDIUM',
        width: 2,
        height: 1,
        mass: 6.0,
        cost: 5650,
        icon: '🔥',
        thrust: 1379.03,
        ispSea: 285,
        ispVac: 330,
        description: 'Heavy lifter engine',
        attachPoints: [{ x: 0, y: 1 }]
    },
    'engine-poodle': {
        id: 'engine-poodle',
        name: 'RE-I5 Poodle',
        category: 'engine',
        size: 'MEDIUM',
        width: 2,
        height: 1,
        mass: 1.75,
        cost: 1300,
        icon: '🔥',
        thrust: 220,
        ispSea: 90,
        ispVac: 350,
        description: 'Upper stage vacuum engine',
        attachPoints: [{ x: 0, y: 1 }]
    },
    'engine-nerv': {
        id: 'engine-nerv',
        name: 'LV-N Nerv',
        category: 'engine',
        size: 'MEDIUM',
        width: 2,
        height: 2,
        mass: 3.0,
        cost: 10000,
        icon: '⚛️',
        thrust: 60,
        ispSea: 185,
        ispVac: 800,
        description: 'Nuclear thermal engine - excellent ISP',
        attachPoints: [{ x: 0, y: 1 }]
    },
    'engine-hammer': {
        id: 'engine-hammer',
        name: 'RT-10 Hammer',
        category: 'engine',
        size: 'SMALL',
        width: 1,
        height: 1,
        mass: 0.75,
        cost: 400,
        icon: '🧨',
        thrust: 227.0,
        ispSea: 170,
        ispVac: 195,
        solidFuel: 375,
        description: 'Solid rocket booster',
        attachPoints: [{ x: 0, y: 1 }]
    },

    // Decouplers
    'decoupler-tr18a': {
        id: 'decoupler-tr18a',
        name: 'TR-18A',
        category: 'structural',
        size: 'SMALL',
        width: 1,
        height: 1,
        mass: 0.05,
        cost: 400,
        icon: '⚡',
        description: 'Stack decoupler',
        type: 'decoupler',
        attachPoints: [{ x: 0, y: 1 }, { x: 0, y: -1 }]
    },
    'decoupler-tr2c': {
        id: 'decoupler-tr2c',
        name: 'TR-2C',
        category: 'structural',
        size: 'MEDIUM',
        width: 2,
        height: 1,
        mass: 0.1,
        cost: 550,
        icon: '⚡',
        description: 'Medium stack decoupler',
        type: 'decoupler',
        attachPoints: [{ x: 0, y: 1 }, { x: 0, y: -1 }]
    },
    'decoupler-tt38k': {
        id: 'decoupler-tt38k',
        name: 'TT-38K',
        category: 'structural',
        size: 'SMALL',
        width: 1,
        height: 1,
        mass: 0.025,
        cost: 600,
        icon: '⚡',
        description: 'Radial decoupler',
        type: 'radial-decoupler',
        attachPoints: [{ x: 0, y: 0 }]
    },

    // Fairings
    'fairing-aeff1': {
        id: 'fairing-aeff1',
        name: 'AE-FF1',
        category: 'aero',
        size: 'SMALL',
        width: 1,
        height: 1,
        mass: 0.03,
        cost: 300,
        icon: '🔺',
        description: 'Small fairing',
        type: 'fairing',
        attachPoints: [{ x: 0, y: 1 }, { x: 0, y: -1 }]
    },
    'fairing-aeff2': {
        id: 'fairing-aeff2',
        name: 'AE-FF2',
        category: 'aero',
        size: 'MEDIUM',
        width: 2,
        height: 1,
        mass: 0.06,
        cost: 500,
        icon: '🔺',
        description: 'Medium fairing',
        type: 'fairing',
        attachPoints: [{ x: 0, y: 1 }, { x: 0, y: -1 }]
    },

    // Structural
    'adapter-fla': {
        id: 'adapter-fla',
        name: 'FL-A Adapter',
        category: 'structural',
        size: 'SMALL',
        width: 1,
        height: 1,
        mass: 0.05,
        cost: 100,
        icon: '⬡',
        description: 'Structural adapter',
        attachPoints: [{ x: 0, y: 1 }, { x: 0, y: -1 }]
    },
    'strut-cubic': {
        id: 'strut-cubic',
        name: 'Cubic Strut',
        category: 'structural',
        size: 'TINY',
        width: 1,
        height: 1,
        mass: 0.01,
        cost: 20,
        icon: '⬛',
        description: 'Tiny structural piece',
        attachPoints: [{ x: 0, y: 1 }, { x: 0, y: -1 }, { x: 1, y: 0 }, { x: -1, y: 0 }]
    },

    // Landing Gear & Utility
    'landing-leg': {
        id: 'landing-leg',
        name: 'LT-1 Leg',
        category: 'structural',
        size: 'SMALL',
        width: 1,
        height: 1,
        mass: 0.05,
        cost: 200,
        icon: '🦵',
        description: 'Landing leg',
        attachPoints: [{ x: 0, y: 0 }]
    },
    'parachute': {
        id: 'parachute',
        name: 'Mk16 Parachute',
        category: 'aero',
        size: 'SMALL',
        width: 1,
        height: 1,
        mass: 0.1,
        cost: 400,
        icon: '🪂',
        description: 'Drogue parachute',
        attachPoints: [{ x: 0, y: -1 }]
    }
};

function getPartsByCategory(category) {
    return Object.values(PARTS_DB).filter(p => p.category === category);
}

function getPart(id) {
    return PARTS_DB[id];
}

function getSizeMultiplier(size) {
    const multipliers = {
        'TINY': 0.5,
        'SMALL': 1,
        'MEDIUM': 2,
        'LARGE': 3,
        'XLARGE': 4
    };
    return multipliers[size] || 1;
}

