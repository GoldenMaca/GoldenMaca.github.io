// Physics Engine
class PhysicsEngine {
    constructor(solarSystem) {
        this.solarSystem = solarSystem;
        this.bodies = [];
        this.timeWarp = 1;
    }

    addBody(body) {
        this.bodies.push(body);
    }

    removeBody(body) {
        const idx = this.bodies.indexOf(body);
        if (idx >= 0) this.bodies.splice(idx, 1);
    }

    update(dt) {
        const stepDt = dt * this.timeWarp;

        for (const body of this.bodies) {
            if (body.static) continue;

            // Reset acceleration
            body.acceleration = { x: 0, y: 0 };

            // Get dominant gravity body
            const gravityBody = this.solarSystem.getBodyAtPosition(body.position);
            if (gravityBody) {
                const altitude = this.solarSystem.getAltitude(gravityBody, body.position);
                
                // Gravity
                const toBody = Vec2.sub(gravityBody.position, body.position);
                const dist = Vec2.mag(toBody);
                const gravityDir = Vec2.norm(toBody);
                const gravityForce = CONSTANTS.G * gravityBody.mass / (dist * dist);
                
                body.acceleration.x += gravityDir.x * gravityForce;
                body.acceleration.y += gravityDir.y * gravityForce;

                // Atmospheric drag
                if (gravityBody.atmosphere && altitude < gravityBody.atmosphereHeight) {
                    const density = this.solarSystem.getAtmosphericDensity(gravityBody, altitude);
                    const vMag = Vec2.mag(body.velocity);
                    const dragCoeff = body.dragCoefficient || 0.2;
                    const area = body.crossSectionalArea || 1.0;
                    const dragForce = 0.5 * density * vMag * vMag * dragCoeff * area;
                    const dragDir = Vec2.norm({ x: -body.velocity.x, y: -body.velocity.y });
                    
                    body.acceleration.x += dragDir.x * dragForce / body.mass;
                    body.acceleration.y += dragDir.y * dragForce / body.mass;
                }

                // Ground collision
                if (altitude <= 0) {
                    const normal = Vec2.norm(Vec2.sub(body.position, gravityBody.position));
                    const vDotN = Vec2.dot(body.velocity, normal);
                    
                    if (vDotN < 0) {
                        // Bounce or crash
                        if (Math.abs(vDotN) < 5) {
                            // Stop
                            body.velocity = { x: 0, y: 0 };
                            body.position = {
                                x: gravityBody.position.x + normal.x * gravityBody.radius,
                                y: gravityBody.position.y + normal.y * gravityBody.radius
                            };
                            body.landed = true;
                        } else {
                            // Crash if too fast
                            if (Math.abs(vDotN) > 20) {
                                body.crashed = true;
                            } else {
                                body.velocity = Vec2.sub(body.velocity, Vec2.mul(normal, vDotN * 0.3));
                            }
                        }
                    }
                } else {
                    body.landed = false;
                }
            }

            // Integrate
            body.velocity.x += body.acceleration.x * stepDt;
            body.velocity.y += body.acceleration.y * stepDt;
            body.position.x += body.velocity.x * stepDt;
            body.position.y += body.velocity.y * stepDt;

            // Update rotation
            if (body.angularVelocity !== undefined) {
                body.rotation += body.angularVelocity * stepDt;
                body.angularVelocity *= 0.995; // Damping
            }
        }
    }

    calculateOrbitalElements(body, gravityBody) {
        if (!gravityBody) return null;

        const mu = CONSTANTS.G * gravityBody.mass;
        const r = Vec2.sub(body.position, gravityBody.position);
        const v = body.velocity;
        const rMag = Vec2.mag(r);
        const vMag = Vec2.mag(v);

        // Specific orbital energy
        const energy = (vMag * vMag) / 2 - mu / rMag;

        // Semi-major axis
        const a = -mu / (2 * energy);

        // Eccentricity vector
        const h = Vec2.cross(r, v); // In 2D, this is scalar
        const e = {
            x: (v.y * h / mu) - (r.x / rMag),
            y: (-v.x * h / mu) - (r.y / rMag)
        };
        const eMag = Vec2.mag(e);

        // Apoapsis and periapsis
        const apoapsis = a * (1 + eMag) - gravityBody.radius;
        const periapsis = a * (1 - eMag) - gravityBody.radius;

        // Orbital period
        const period = 2 * Math.PI * Math.sqrt(Math.abs(a * a * a) / mu);

        // True anomaly
        const trueAnomaly = Math.acos(clamp(Vec2.dot(e, r) / (eMag * rMag), -1, 1));

        return {
            semiMajorAxis: a,
            eccentricity: eMag,
            apoapsis: Math.max(0, apoapsis),
            periapsis: Math.max(0, periapsis),
            period: period,
            trueAnomaly: trueAnomaly,
            energy: energy,
            inclination: 0 // 2D only
        };
    }

    predictTrajectory(body, gravityBody, steps = 200, dt = 1) {
        if (!gravityBody) return [];

        const points = [];
        let pos = { ...body.position };
        let vel = { ...body.velocity };
        const mu = CONSTANTS.G * gravityBody.mass;

        for (let i = 0; i < steps; i++) {
            points.push({ ...pos });

            const r = Vec2.sub(pos, gravityBody.position);
            const dist = Vec2.mag(r);
            
            if (dist < gravityBody.radius) break;

            const acc = Vec2.mul(Vec2.norm(r), mu / (dist * dist));
            vel = Vec2.sub(vel, Vec2.mul(acc, dt));
            pos = Vec2.add(pos, Vec2.mul(vel, dt));
        }

        return points;
    }
}

class Rocket {
    constructor(parts = []) {
        this.parts = parts;
        this.position = { x: 0, y: 0 };
        this.velocity = { x: 0, y: 0 };
        this.acceleration = { x: 0, y: 0 };
        this.rotation = -Math.PI / 2; // Point up
        this.angularVelocity = 0;
        this.mass = 0;
        this.dragCoefficient = 0.2;
        this.crossSectionalArea = 1.0;
        this.landed = false;
        this.crashed = false;
        this.static = false;
        
        this.stages = [];
        this.currentStage = 0;
        this.throttle = 0;
        this.fuelMap = new Map();
        
        this.calculateMass();
        this.initFuel();
    }

    calculateMass() {
        this.mass = 0;
        this.crossSectionalArea = 0;
        
        for (const part of this.parts) {
            if (part.decoupled) continue;
            
            let partMass = part.mass;
            if (part.currentFuel !== undefined) {
                partMass += part.currentFuel;
            }
            this.mass += partMass;
            
            // Cross-sectional area based on size
            const size = getSizeMultiplier(part.size);
            this.crossSectionalArea = Math.max(this.crossSectionalArea, size * size * 0.5);
        }
    }

    initFuel() {
        for (const part of this.parts) {
            if (part.fuelCapacity !== undefined) {
                part.currentFuel = part.fuelMass || 0;
                part.fuelMass = part.fuelMass || 0;
            }
            if (part.solidFuel !== undefined) {
                part.currentFuel = part.solidFuel;
            }
        }
    }

    buildStages() {
        // Group parts by stage based on decouplers
        this.stages = [];
        let currentStage = { parts: [], engines: [] };
        
        // Simple staging: work from bottom up
        const sortedParts = [...this.parts].sort((a, b) => b.gridY - a.gridY);
        
        for (const part of sortedParts) {
            if (part.type === 'decoupler' || part.type === 'radial-decoupler') {
                if (currentStage.parts.length > 0) {
                    this.stages.push(currentStage);
                    currentStage = { parts: [], engines: [] };
                }
            }
            currentStage.parts.push(part);
            if (part.category === 'engine') {
                currentStage.engines.push(part);
            }
        }
        
        if (currentStage.parts.length > 0) {
            this.stages.push(currentStage);
        }
        
        this.currentStage = this.stages.length - 1;
    }

    getThrust(atmosphereDensity = 0) {
        if (this.currentStage < 0 || this.currentStage >= this.stages.length) return { x: 0, y: 0 };
        
        const stage = this.stages[this.currentStage];
        let totalThrust = 0;
        
        for (const engine of stage.engines) {
            if (engine.decoupled) continue;
            
            // Check fuel
            if (!this.hasFuel(engine)) continue;
            
            // Interpolate ISP based on atmosphere
            const isp = lerp(engine.ispVac, engine.ispSea, atmosphereDensity);
            const thrust = engine.thrust * (isp / engine.ispVac);
            totalThrust += thrust;
        }
        
        const thrustMag = totalThrust * this.throttle;
        return {
            x: Math.cos(this.rotation) * thrustMag,
            y: Math.sin(this.rotation) * thrustMag
        };
    }

    hasFuel(engine) {
        // Check connected fuel tanks
        for (const part of this.parts) {
            if (part.decoupled) continue;
            if (part.currentFuel !== undefined && part.currentFuel > 0) {
                // Simple check - in reality would check fuel line connections
                return true;
            }
        }
        return false;
    }

    consumeFuel(dt, atmosphereDensity = 0) {
        if (this.currentStage < 0 || this.currentStage >= this.stages.length) return;
        
        const stage = this.stages[this.currentStage];
        const activeEngines = stage.engines.filter(e => !e.decoupled && this.hasFuel(e));
        
        if (activeEngines.length === 0 || this.throttle <= 0) return;
        
        let totalFuelConsumption = 0;
        
        for (const engine of activeEngines) {
            const isp = lerp(engine.ispVac, engine.ispSea, atmosphereDensity);
            const thrust = engine.thrust * (isp / engine.ispVac) * this.throttle;
            // Fuel consumption = thrust / (ISP * g0)
            const g0 = 9.80665;
            const consumption = thrust / (isp * g0);
            totalFuelConsumption += consumption;
        }
        
        // Distribute fuel consumption across tanks
        const fuelToConsume = totalFuelConsumption * dt;
        let remaining = fuelToConsume;
        
        for (const part of this.parts) {
            if (part.decoupled) continue;
            if (part.currentFuel !== undefined && part.currentFuel > 0) {
                const consumed = Math.min(part.currentFuel, remaining);
                part.currentFuel -= consumed;
                remaining -= consumed;
                
                if (remaining <= 0) break;
            }
        }
        
        // Recalculate mass
        this.calculateMass();
    }

    stage() {
        if (this.currentStage < 0) return false;
        
        // Decouple parts in current stage
        const stage = this.stages[this.currentStage];
        for (const part of stage.parts) {
            part.decoupled = true;
        }
        
        this.currentStage--;
        this.calculateMass();
        
        return true;
    }

    getCenterOfMass() {
        let totalX = 0, totalY = 0;
        
        for (const part of this.parts) {
            if (part.decoupled) continue;
            const partMass = part.mass + (part.currentFuel || 0);
            totalX += part.worldX * partMass;
            totalY += part.worldY * partMass;
        }
        
        return {
            x: totalX / this.mass,
            y: totalY / this.mass
        };
    }

    getTotalFuel() {
        let total = 0;
        let capacity = 0;
        
        for (const part of this.parts) {
            if (part.decoupled) continue;
            if (part.currentFuel !== undefined) {
                total += part.currentFuel;
                capacity += part.fuelMass || part.solidFuel || 0;
            }
        }
        
        return { current: total, capacity, percentage: capacity > 0 ? (total / capacity) * 100 : 0 };
    }

    copy() {
        const newRocket = new Rocket();
        newRocket.parts = this.parts.map(p => ({...p}));
        newRocket.initFuel();
        newRocket.buildStages();
        return newRocket;
    }
}


