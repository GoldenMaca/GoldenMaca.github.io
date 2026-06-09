// Solar System Data
const SOLAR_SYSTEM = {
    sun: {
        name: 'Sun',
        mass: 1.7565459e28,
        radius: 261600000,
        color: '#ffdd44',
        glowColor: '#ffaa00',
        atmosphere: false,
        soi: Infinity
    },
    planets: [
        {
            name: 'Moho',
            mass: 2.5263314e21,
            radius: 250000,
            color: '#8B7355',
            semiMajorAxis: 5263138304,
            eccentricity: 0.2,
            inclination: 7.0,
            atmosphere: false,
            atmosphereHeight: 0,
            soi: 9646663,
            parent: 'sun'
        },
        {
            name: 'Eve',
            mass: 1.2243980e23,
            radius: 700000,
            color: '#8B4789',
            semiMajorAxis: 9832684544,
            eccentricity: 0.01,
            inclination: 2.1,
            atmosphere: true,
            atmosphereHeight: 90000,
            atmospherePressure: 5.0,
            soi: 85109365,
            parent: 'sun'
        },
        {
            name: 'Kerbin',
            mass: 5.2915158e22,
            radius: 600000,
            color: '#4a90d9',
            semiMajorAxis: 13599840256,
            eccentricity: 0.0,
            inclination: 0.0,
            atmosphere: true,
            atmosphereHeight: 70000,
            atmospherePressure: 1.0,
            soi: 84159286,
            parent: 'sun'
        },
        {
            name: 'Mun',
            mass: 9.7599066e20,
            radius: 200000,
            color: '#aaaaaa',
            semiMajorAxis: 12000000,
            eccentricity: 0.0,
            inclination: 0.0,
            atmosphere: false,
            atmosphereHeight: 0,
            soi: 2429559,
            parent: 'Kerbin'
        },
        {
            name: 'Minmus',
            mass: 2.6457580e19,
            radius: 60000,
            color: '#aaffaa',
            semiMajorAxis: 47000000,
            eccentricity: 0.0,
            inclination: 6.0,
            atmosphere: false,
            atmosphereHeight: 0,
            soi: 2247428,
            parent: 'Kerbin'
        },
        {
            name: 'Duna',
            mass: 4.5154270e21,
            radius: 320000,
            color: '#c1440e',
            semiMajorAxis: 20726155264,
            eccentricity: 0.051,
            inclination: 0.06,
            atmosphere: true,
            atmosphereHeight: 50000,
            atmospherePressure: 0.2,
            soi: 47921949,
            parent: 'sun'
        },
        {
            name: 'Ike',
            mass: 2.7821615e20,
            radius: 130000,
            color: '#777777',
            semiMajorAxis: 3200000,
            eccentricity: 0.03,
            inclination: 0.2,
            atmosphere: false,
            atmosphereHeight: 0,
            soi: 1049598,
            parent: 'Duna'
        },
        {
            name: 'Dres',
            mass: 3.2190937e20,
            radius: 138000,
            color: '#8B8680',
            semiMajorAxis: 40839348203,
            eccentricity: 0.145,
            inclination: 5.0,
            atmosphere: false,
            atmosphereHeight: 0,
            soi: 32832840,
            parent: 'sun'
        },
        {
            name: 'Jool',
            mass: 4.2332127e24,
            radius: 6000000,
            color: '#7cb342',
            semiMajorAxis: 68773560320,
            eccentricity: 0.05,
            inclination: 1.304,
            atmosphere: true,
            atmosphereHeight: 200000,
            atmospherePressure: 15.0,
            soi: 2455987000,
            parent: 'sun'
        },
        {
            name: 'Laythe',
            mass: 2.9397311e22,
            radius: 500000,
            color: '#5c8bc4',
            semiMajorAxis: 27184000,
            eccentricity: 0.0,
            inclination: 0.0,
            atmosphere: true,
            atmosphereHeight: 50000,
            atmospherePressure: 0.8,
            soi: 3723645,
            parent: 'Jool'
        },
        {
            name: 'Vall',
            mass: 3.1087655e21,
            radius: 300000,
            color: '#dddddd',
            semiMajorAxis: 43152000,
            eccentricity: 0.0,
            inclination: 0.0,
            atmosphere: false,
            atmosphereHeight: 0,
            soi: 2406401,
            parent: 'Jool'
        },
        {
            name: 'Tylo',
            mass: 4.2332127e22,
            radius: 600000,
            color: '#cccccc',
            semiMajorAxis: 68500000,
            eccentricity: 0.0,
            inclination: 0.025,
            atmosphere: false,
            atmosphereHeight: 0,
            soi: 10856518,
            parent: 'Jool'
        },
        {
            name: 'Bop',
            mass: 3.7261089e19,
            radius: 65000,
            color: '#8B7355',
            semiMajorAxis: 128500000,
            eccentricity: 0.235,
            inclination: 15.0,
            atmosphere: false,
            atmosphereHeight: 0,
            soi: 1221060,
            parent: 'Jool'
        },
        {
            name: 'Pol',
            mass: 1.0813507e19,
            radius: 44000,
            color: '#d4c44a',
            semiMajorAxis: 179890000,
            eccentricity: 0.171,
            inclination: 4.25,
            atmosphere: false,
            atmosphereHeight: 0,
            soi: 1042138,
            parent: 'Jool'
        },
        {
            name: 'Eeloo',
            mass: 1.1149224e21,
            radius: 210000,
            color: '#e0e0e0',
            semiMajorAxis: 90118820000,
            eccentricity: 0.26,
            inclination: 6.15,
            atmosphere: false,
            atmosphereHeight: 0,
            soi: 119081000,
            parent: 'sun'
        }
    ]
};

class SolarSystem {
    constructor() {
        this.bodies = {};
        this.initBodies();
        this.time = 0;
    }

    initBodies() {
        // Sun
        this.bodies.sun = {
            ...SOLAR_SYSTEM.sun,
            position: { x: 0, y: 0 },
            velocity: { x: 0, y: 0 },
            angle: 0
        };

        // Planets and moons
        for (const planetData of SOLAR_SYSTEM.planets) {
            const body = {
                ...planetData,
                position: { x: 0, y: 0 },
                velocity: { x: 0, y: 0 },
                angle: Math.random() * Math.PI * 2,
                moons: []
            };
            this.bodies[planetData.name] = body;
        }

        // Link moons to parents
        for (const name in this.bodies) {
            const body = this.bodies[name];
            if (body.parent && body.parent !== 'sun') {
                const parent = this.bodies[body.parent];
                if (parent) {
                    if (!parent.moons) parent.moons = [];
                    parent.moons.push(body);
                }
            }
        }
    }

    update(dt) {
        this.time += dt;

        // Update all orbital positions
        for (const name in this.bodies) {
            const body = this.bodies[name];
            if (name === 'sun') continue;

            const parent = this.bodies[body.parent];
            if (!parent) continue;

            const orbitalPeriod = this.getOrbitalPeriod(body);
            const meanMotion = 2 * Math.PI / orbitalPeriod;
            body.angle += meanMotion * dt;

            const r = body.semiMajorAxis * (1 - body.eccentricity * body.eccentricity) / 
                      (1 + body.eccentricity * Math.cos(body.angle));
            
            body.position.x = parent.position.x + r * Math.cos(body.angle);
            body.position.y = parent.position.y + r * Math.sin(body.angle);
        }
    }

    getOrbitalPeriod(body) {
        const parent = this.bodies[body.parent];
        if (!parent) return 0;
        return 2 * Math.PI * Math.sqrt(
            Math.pow(body.semiMajorAxis, 3) / (CONSTANTS.G * parent.mass)
        );
    }

    getBodyAtPosition(position) {
        let closest = null;
        let closestDist = Infinity;

        for (const name in this.bodies) {
            const body = this.bodies[name];
            const dist = Vec2.dist(position, body.position);
            if (dist < body.soi && dist < closestDist) {
                closestDist = dist;
                closest = body;
            }
        }
        return closest;
    }

    getGravityAt(position, excludeBody = null) {
        let acceleration = { x: 0, y: 0 };

        for (const name in this.bodies) {
            const body = this.bodies[name];
            if (body === excludeBody) continue;

            const diff = Vec2.sub(body.position, position);
            const dist = Vec2.mag(diff);
            if (dist < body.radius) continue;

            const force = CONSTANTS.G * body.mass / (dist * dist);
            const dir = Vec2.norm(diff);
            acceleration.x += dir.x * force;
            acceleration.y += dir.y * force;
        }

        return acceleration;
    }

    getAtmosphericDensity(body, altitude) {
        if (!body.atmosphere || altitude > body.atmosphereHeight) return 0;
        
        const normalizedAlt = altitude / body.atmosphereHeight;
        // Exponential atmosphere model
        return body.atmospherePressure * Math.exp(-normalizedAlt * 5);
    }

    getAltitude(body, position) {
        return Vec2.dist(position, body.position) - body.radius;
    }
}

