// Main Game
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.renderer = new Renderer(this.canvas, this);
        this.solarSystem = new SolarSystem();
        this.physics = new PhysicsEngine(this.solarSystem);
        this.builder = new Builder(this);
        this.controls = new Controls(this);
        
        this.mode = 'builder';
        this.rocket = null;
        this.timeWarp = 1;
        this.running = false;
        this.lastTime = 0;
        
        this.setup();
    }

    setup() {
        this.renderer.resize();
        window.addEventListener('resize', () => this.renderer.resize());
        
        this.setMode('builder');
        this.start();
    }

    start() {
        this.running = true;
        this.lastTime = performance.now();
        requestAnimationFrame((t) => this.loop(t));
    }

    loop(timestamp) {
        if (!this.running) return;
        
        const dt = Math.min((timestamp - this.lastTime) / 1000, 0.1);
        this.lastTime = timestamp;

        this.update(dt);
        this.render();

        requestAnimationFrame((t) => this.loop(t));
    }

    update(dt) {
        // Save click state before controls.update resets it
        const justClicked = this.controls.mouse.justClicked;
        this.controls.update();
        this.solarSystem.update(dt * this.timeWarp);

        switch (this.mode) {
            case 'builder':
                this.builder.update(justClicked);
                break;
            case 'flight':
                this.updateFlight(dt);
                break;
            case 'map':
                this.updateMap(dt);
                break;
        }
    }

    updateFlight(dt) {
        if (!this.rocket || this.rocket.crashed) return;

        const gravityBody = this.solarSystem.getBodyAtPosition(this.rocket.position);
        
        if (gravityBody) {
            const altitude = this.solarSystem.getAltitude(gravityBody, this.rocket.position);
            const atmosphereDensity = this.solarSystem.getAtmosphericDensity(gravityBody, altitude);

            // Initialize acceleration
            this.rocket.acceleration = { x: 0, y: 0 };

            // Apply thrust
            const thrust = this.rocket.getThrust(atmosphereDensity);
            this.rocket.acceleration = Vec2.add(
                this.rocket.acceleration,
                Vec2.div(thrust, this.rocket.mass)
            );

            // Consume fuel
            this.rocket.consumeFuel(dt, atmosphereDensity);
        }

        // Update physics (applies gravity + integrates)
        this.physics.update(dt);

        // Update camera
        this.renderer.camera.target = this.rocket.position;

        // Update UI
        this.updateFlightUI(gravityBody);
        this.renderer.drawNavball(this.rocket);

        // Check crash
        if (this.rocket.crashed) {
            this.showNotification('Rocket crashed!', 'error');
        }
    }

    updateMap(dt) {
        if (this.rocket) {
            this.renderer.camera.target = this.rocket.position;
        }
    }

    render() {
        this.renderer.clear();

        switch (this.mode) {
            case 'builder':
                this.builder.render();
                break;
            case 'flight':
                this.renderFlight();
                break;
            case 'map':
                this.renderMap();
                break;
        }
    }

    renderFlight() {
        this.renderer.updateCamera();
        this.renderer.drawSolarSystem(this.solarSystem, 'flight');

        if (this.rocket) {
            const gravityBody = this.solarSystem.getBodyAtPosition(this.rocket.position);
            
            // Draw trajectory
            if (gravityBody) {
                const trajectory = this.physics.predictTrajectory(this.rocket, gravityBody, 200, 2);
                this.renderer.drawTrajectory(trajectory);
                
                // Draw orbit
                const orbitalElements = this.physics.calculateOrbitalElements(this.rocket, gravityBody);
                this.renderer.drawOrbit(this.rocket, gravityBody, orbitalElements);
            }

            // Draw rocket
            this.renderer.drawRocket(this.rocket, 'flight');
        }
    }

    renderMap() {
        this.renderer.updateCamera();
        this.renderer.drawMapView(this.rocket, this.solarSystem);
    }

    setMode(mode) {
        this.mode = mode;
        
        // Update UI visibility
        document.getElementById('builder-ui').classList.toggle('hidden', mode !== 'builder');
        document.getElementById('flight-ui').classList.toggle('hidden', mode !== 'flight');
        document.getElementById('map-ui').classList.toggle('hidden', mode !== 'map');
        
        // Update buttons
        document.getElementById('mode-builder').classList.toggle('active', mode === 'builder');
        document.getElementById('mode-flight').classList.toggle('active', mode === 'flight');
        document.getElementById('mode-map').classList.toggle('active', mode === 'map');

        // Reset camera for builder
        if (mode === 'builder') {
            this.renderer.setCamera(0, 0);
            this.renderer.camera.zoom = 1;
        } else if (mode === 'flight') {
            this.renderer.camera.zoom = 2;
        } else if (mode === 'map') {
            this.renderer.camera.zoom = 0.001;
        }
    }

    launchRocket() {
        const rocket = this.builder.buildRocket();
        if (!rocket) {
            this.showNotification('Build a rocket first!', 'warning');
            return;
        }

        this.rocket = rocket;
        
        // Launch from Kerbin
        const kerbin = this.solarSystem.bodies.Kerbin;
        if (kerbin) {
            const launchAltitude = kerbin.radius + 100;
            this.rocket.position = {
                x: kerbin.position.x,
                y: kerbin.position.y - launchAltitude
            };
            this.rocket.velocity = {
                x: kerbin.velocity?.x || 0,
                y: kerbin.velocity?.y || 0
            };
            this.rocket.rotation = -Math.PI / 2;
        }

        this.physics.addBody(this.rocket);
        this.setMode('flight');
        this.showNotification('Launch!', 'success');
    }

    stageRocket() {
        if (this.rocket && this.rocket.stage()) {
            this.showNotification('Stage separated!', 'warning');
            
            // Create debris from discarded parts
            for (const part of this.rocket.parts) {
                if (part.decoupled) {
                    const debris = {
                        position: { ...this.rocket.position },
                        velocity: {
                            x: this.rocket.velocity.x + (Math.random() - 0.5) * 10,
                            y: this.rocket.velocity.y + (Math.random() - 0.5) * 10
                        },
                        mass: part.mass,
                        rotation: Math.random() * Math.PI * 2,
                        angularVelocity: (Math.random() - 0.5) * 2,
                        dragCoefficient: 0.5,
                        crossSectionalArea: 0.5
                    };
                    this.physics.addBody(debris);
                }
            }
        }
    }

    setTimeWarp(warp) {
        this.timeWarp = warp;
        this.physics.timeWarp = warp;
    }

    updateFlightUI(gravityBody) {
        if (!this.rocket) return;

        const altitude = gravityBody ? 
            this.solarSystem.getAltitude(gravityBody, this.rocket.position) : 0;
        const vel = Vec2.mag(this.rocket.velocity);
        const fuel = this.rocket.getTotalFuel();
        
        // TWR
        const gravity = gravityBody ? 
            CONSTANTS.G * gravityBody.mass / Math.pow(Vec2.dist(this.rocket.position, gravityBody.position), 2) : 0;
        const thrust = this.rocket.getThrust(0);
        const twr = Vec2.mag(thrust) / (this.rocket.mass * gravity);

        document.getElementById('altitude').textContent = formatNumber(altitude);
        document.getElementById('velocity').textContent = formatNumber(vel);
        document.getElementById('twr').textContent = twr.toFixed(2);
        document.getElementById('fuel-pct').textContent = Math.round(fuel.percentage);

        // Orbital elements
        if (gravityBody) {
            const orbitalElements = this.physics.calculateOrbitalElements(this.rocket, gravityBody);
            if (orbitalElements) {
                document.getElementById('apoapsis').textContent = formatNumber(orbitalElements.apoapsis);
                document.getElementById('periapsis').textContent = formatNumber(orbitalElements.periapsis);
                
                document.getElementById('map-apo').textContent = formatNumber(orbitalElements.apoapsis / 1000);
                document.getElementById('map-peri').textContent = formatNumber(orbitalElements.periapsis / 1000);
                document.getElementById('map-period').textContent = formatNumber(orbitalElements.period);
                document.getElementById('map-inc').textContent = orbitalElements.inclination.toFixed(1);
            }
            
            document.getElementById('soi-body').textContent = gravityBody.name;
        }
    }

    showNotification(message, type = 'info') {
        const container = document.getElementById('notifications');
        const el = document.createElement('div');
        el.className = `notification ${type}`;
        el.textContent = message;
        container.appendChild(el);

        setTimeout(() => {
            el.remove();
        }, 3000);
    }
}

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.game = new Game();
});


