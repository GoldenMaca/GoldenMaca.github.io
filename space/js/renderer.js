// Renderer
class Renderer {
    constructor(canvas, game) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.game = game;
        this.width = canvas.width;
        this.height = canvas.height;
        
        this.camera = {
            x: 0,
            y: 0,
            zoom: 1,
            target: null,
            smoothSpeed: 0.1
        };

        this.navballCanvas = document.getElementById('navball');
        this.navballCtx = this.navballCanvas.getContext('2d');
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
    }

    updateCamera(target) {
        if (target) {
            this.camera.target = target;
        }
        
        if (this.camera.target) {
            this.camera.x += (this.camera.target.x - this.camera.x) * this.camera.smoothSpeed;
            this.camera.y += (this.camera.target.y - this.camera.y) * this.camera.smoothSpeed;
        }
    }

    setCamera(x, y) {
        this.camera.x = x;
        this.camera.y = y;
        this.camera.target = null;
    }

    worldToScreen(x, y) {
        return {
            x: (x - this.camera.x) * this.camera.zoom + this.width / 2,
            y: (y - this.camera.y) * this.camera.zoom + this.height / 2
        };
    }

    screenToWorld(x, y) {
        return {
            x: (x - this.width / 2) / this.camera.zoom + this.camera.x,
            y: (y - this.height / 2) / this.camera.zoom + this.camera.y
        };
    }

    clear() {
        this.ctx.fillStyle = '#0a0a0f';
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    drawGrid() {
        const gridSize = CONSTANTS.GRID_SIZE * this.camera.zoom;
        const offsetX = (this.width / 2 - this.camera.x * this.camera.zoom) % gridSize;
        const offsetY = (this.height / 2 - this.camera.y * this.camera.zoom) % gridSize;

        this.ctx.strokeStyle = CONSTANTS.COLORS.GRID;
        this.ctx.lineWidth = 0.5;

        for (let x = offsetX; x < this.width; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.height);
            this.ctx.stroke();
        }

        for (let y = offsetY; y < this.height; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.width, y);
            this.ctx.stroke();
        }
    }

    drawBuilderGrid() {
        const centerX = this.width / 2;
        const centerY = this.height / 2;
        const gridSize = CONSTANTS.GRID_SIZE;

        this.ctx.strokeStyle = CONSTANTS.COLORS.GRID;
        this.ctx.lineWidth = 1;

        // Draw center lines
        this.ctx.strokeStyle = CONSTANTS.COLORS.GRID_HIGHLIGHT;
        this.ctx.beginPath();
        this.ctx.moveTo(centerX, 0);
        this.ctx.lineTo(centerX, this.height);
        this.ctx.moveTo(0, centerY);
        this.ctx.lineTo(this.width, centerY);
        this.ctx.stroke();

        // Draw grid
        this.ctx.strokeStyle = CONSTANTS.COLORS.GRID;
        for (let x = centerX % gridSize; x < this.width; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.height);
            this.ctx.stroke();
        }
        for (let y = centerY % gridSize; y < this.height; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.width, y);
            this.ctx.stroke();
        }
    }

    drawSolarSystem(solarSystem, mode) {
        // Draw sun
        const sun = solarSystem.bodies.sun;
        const sunScreen = this.worldToScreen(sun.position.x, sun.position.y);
        const sunRadius = Math.max(sun.radius * CONSTANTS.SCALE * this.camera.zoom, 10);

        // Sun glow
        const glowRadius = sunRadius * 3;
        const gradient = this.ctx.createRadialGradient(
            sunScreen.x, sunScreen.y, sunRadius,
            sunScreen.x, sunScreen.y, glowRadius
        );
        gradient.addColorStop(0, sun.glowColor);
        gradient.addColorStop(1, 'transparent');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(sunScreen.x - glowRadius, sunScreen.y - glowRadius, glowRadius * 2, glowRadius * 2);

        // Sun body
        this.ctx.fillStyle = sun.color;
        this.ctx.beginPath();
        this.ctx.arc(sunScreen.x, sunScreen.y, sunRadius, 0, Math.PI * 2);
        this.ctx.fill();

        // Draw planets
        for (const name in solarSystem.bodies) {
            if (name === 'sun') continue;
            const body = solarSystem.bodies[name];
            const screen = this.worldToScreen(body.position.x, body.position.y);
            const radius = Math.max(body.radius * CONSTANTS.SCALE * this.camera.zoom, 3);

            // Planet body
            this.ctx.fillStyle = body.color;
            this.ctx.beginPath();
            this.ctx.arc(screen.x, screen.y, radius, 0, Math.PI * 2);
            this.ctx.fill();

            // Atmosphere glow
            if (body.atmosphere) {
                const atmoRadius = radius * 1.2;
                const atmoGrad = this.ctx.createRadialGradient(
                    screen.x, screen.y, radius,
                    screen.x, screen.y, atmoRadius
                );
                atmoGrad.addColorStop(0, body.color + '40');
                atmoGrad.addColorStop(1, 'transparent');
                this.ctx.fillStyle = atmoGrad;
                this.ctx.fillRect(screen.x - atmoRadius, screen.y - atmoRadius, atmoRadius * 2, atmoRadius * 2);
            }

            // Label in map mode
            if (mode === 'map' && this.camera.zoom < 2) {
                this.ctx.fillStyle = '#aaa';
                this.ctx.font = '12px sans-serif';
                this.ctx.fillText(body.name, screen.x + radius + 5, screen.y);
            }

            // SOI circle in map mode
            if (mode === 'map' && body.soi < 1e12) {
                const soiRadius = body.soi * CONSTANTS.SCALE * this.camera.zoom;
                if (soiRadius > 5 && soiRadius < this.width / 2) {
                    this.ctx.strokeStyle = body.color + '30';
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.arc(screen.x, screen.y, soiRadius, 0, Math.PI * 2);
                    this.ctx.stroke();
                }
            }
        }
    }

    drawRocket(rocket, mode) {
        if (!rocket || rocket.parts.length === 0) return;

        const pos = this.worldToScreen(rocket.position.x, rocket.position.y);
        const scale = this.camera.zoom * 0.5;

        this.ctx.save();
        this.ctx.translate(pos.x, pos.y);
        this.ctx.rotate(rocket.rotation + Math.PI / 2);
        this.ctx.scale(scale, scale);

        for (const part of rocket.parts) {
            if (part.decoupled) continue;
            this.drawPart(part);
        }

        this.ctx.restore();

        // Draw thrust particles
        if (mode === 'flight' && rocket.throttle > 0) {
            this.drawThrustParticles(rocket);
        }
    }

    drawPart(part) {
        const w = part.width * CONSTANTS.GRID_SIZE;
        const h = part.height * CONSTANTS.GRID_SIZE;
        const x = -w / 2;
        const y = -h / 2;

        // Part body
        this.ctx.fillStyle = this.getPartColor(part);
        this.ctx.strokeStyle = CONSTANTS.COLORS.PART_OUTLINE;
        this.ctx.lineWidth = 2;

        if (part.category === 'fuel') {
            // Tank shape
            this.roundRect(x, y, w, h, 4);
        } else if (part.category === 'engine') {
            // Engine shape (nozzle)
            this.ctx.beginPath();
            this.ctx.moveTo(x, y);
            this.ctx.lineTo(x + w, y);
            this.ctx.lineTo(x + w * 0.7, y + h);
            this.ctx.lineTo(x + w * 0.3, y + h);
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.stroke();
        } else if (part.type === 'fairing') {
            // Fairing shape
            this.ctx.beginPath();
            this.ctx.moveTo(x, y + h);
            this.ctx.lineTo(x + w * 0.5, y);
            this.ctx.lineTo(x + w, y + h);
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.stroke();
        } else if (part.type === 'decoupler') {
            // Decoupler shape
            this.ctx.fillStyle = '#cc4444';
            this.roundRect(x, y, w, h, 2);
        } else {
            // Default shape
            this.roundRect(x, y, w, h, 4);
        }

        // Part icon
        if (part.icon) {
            this.ctx.fillStyle = '#fff';
            this.ctx.font = `${Math.min(w, h) * 0.6}px sans-serif`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(part.icon, 0, 0);
        }

        // Selection highlight
        if (part.selected) {
            this.ctx.strokeStyle = CONSTANTS.COLORS.SELECTION;
            this.ctx.lineWidth = 3;
            this.ctx.strokeRect(x - 2, y - 2, w + 4, h + 4);
        }

        // Fuel indicator
        if (part.fuelCapacity !== undefined && part.currentFuel !== undefined) {
            const fuelPct = part.currentFuel / (part.fuelMass || 1);
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            this.ctx.fillRect(x + 2, y + h - 6, w - 4, 4);
            this.ctx.fillStyle = fuelPct > 0.2 ? '#44aa66' : '#aa4444';
            this.ctx.fillRect(x + 2, y + h - 6, (w - 4) * fuelPct, 4);
        }
    }

    getPartColor(part) {
        const colors = {
            command: '#4488cc',
            fuel: '#ccaa44',
            engine: '#cc6644',
            structural: '#888888',
            aero: '#44ccaa'
        };
        return colors[part.category] || '#888888';
    }

    roundRect(x, y, w, h, r) {
        this.ctx.beginPath();
        this.ctx.moveTo(x + r, y);
        this.ctx.lineTo(x + w - r, y);
        this.ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        this.ctx.lineTo(x + w, y + h - r);
        this.ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        this.ctx.lineTo(x + r, y + h);
        this.ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        this.ctx.lineTo(x, y + r);
        this.ctx.quadraticCurveTo(x, y, x + r, y);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
    }

    drawThrustParticles(rocket) {
        const pos = this.worldToScreen(rocket.position.x, rocket.position.y);
        const stage = rocket.stages[rocket.currentStage];
        if (!stage) return;

        for (const engine of stage.engines) {
            if (engine.decoupled) continue;
            
            const particleCount = Math.floor(rocket.throttle * 10);
            for (let i = 0; i < particleCount; i++) {
                const angle = rocket.rotation + Math.PI / 2 + (Math.random() - 0.5) * 0.5;
                const speed = Math.random() * 50 + 20;
                const dist = Math.random() * 30;
                
                const px = pos.x + Math.cos(angle) * dist;
                const py = pos.y + Math.sin(angle) * dist;
                
                const alpha = 1 - (dist / 30);
                this.ctx.fillStyle = `rgba(255, ${Math.floor(150 + Math.random() * 105)}, 0, ${alpha})`;
                this.ctx.beginPath();
                this.ctx.arc(px, py, Math.random() * 4 + 2, 0, Math.PI * 2);
                this.ctx.fill();
            }
        }
    }

    drawTrajectory(points, color = CONSTANTS.COLORS.TRAJECTORY) {
        if (points.length < 2) return;

        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([5, 5]);
        this.ctx.beginPath();

        const first = this.worldToScreen(points[0].x, points[0].y);
        this.ctx.moveTo(first.x, first.y);

        for (let i = 1; i < points.length; i++) {
            const p = this.worldToScreen(points[i].x, points[i].y);
            this.ctx.lineTo(p.x, p.y);
        }

        this.ctx.stroke();
        this.ctx.setLineDash([]);
    }

    drawOrbit(rocket, gravityBody, orbitalElements) {
        if (!orbitalElements || !gravityBody) return;
        if (orbitalElements.eccentricity >= 1) return; // Hyperbolic

        const bodyScreen = this.worldToScreen(gravityBody.position.x, gravityBody.position.y);
        const a = orbitalElements.semiMajorAxis * CONSTANTS.SCALE * this.camera.zoom;
        const e = orbitalElements.eccentricity;
        const b = a * Math.sqrt(1 - e * e);

        this.ctx.strokeStyle = CONSTANTS.COLORS.ORBIT;
        this.ctx.lineWidth = 1.5;
        this.ctx.beginPath();
        this.ctx.ellipse(bodyScreen.x, bodyScreen.y, a, b, 0, 0, Math.PI * 2);
        this.ctx.stroke();

        // Apoapsis marker
        if (orbitalElements.apoapsis > 0) {
            const apoDist = (orbitalElements.apoapsis + gravityBody.radius) * CONSTANTS.SCALE * this.camera.zoom;
            const apoX = bodyScreen.x + apoDist;
            const apoY = bodyScreen.y;
            
            this.ctx.fillStyle = CONSTANTS.COLORS.APOAPSIS;
            this.ctx.beginPath();
            this.ctx.moveTo(apoX, apoY - 8);
            this.ctx.lineTo(apoX - 6, apoY + 4);
            this.ctx.lineTo(apoX + 6, apoY + 4);
            this.ctx.closePath();
            this.ctx.fill();
        }

        // Periapsis marker
        if (orbitalElements.periapsis > 0) {
            const periDist = (orbitalElements.periapsis + gravityBody.radius) * CONSTANTS.SCALE * this.camera.zoom;
            const periX = bodyScreen.x - periDist;
            const periY = bodyScreen.y;
            
            this.ctx.fillStyle = CONSTANTS.COLORS.PERIAPSIS;
            this.ctx.beginPath();
            this.ctx.moveTo(periX, periY + 8);
            this.ctx.lineTo(periX - 6, periY - 4);
            this.ctx.lineTo(periX + 6, periY - 4);
            this.ctx.closePath();
            this.ctx.fill();
        }
    }

    drawBuilderRocket(parts, ghostPart = null) {
        const centerX = this.width / 2;
        const centerY = this.height / 2;

        this.ctx.save();
        this.ctx.translate(centerX, centerY);

        for (const part of parts) {
            this.drawBuilderPart(part);
        }

        if (ghostPart) {
            this.ctx.globalAlpha = 0.5;
            this.drawBuilderPart(ghostPart);
            this.ctx.globalAlpha = 1;
        }

        this.ctx.restore();
    }

    drawBuilderPart(part) {
        const x = part.gridX * CONSTANTS.GRID_SIZE;
        const y = -part.gridY * CONSTANTS.GRID_SIZE;
        const w = part.width * CONSTANTS.GRID_SIZE;
        const h = part.height * CONSTANTS.GRID_SIZE;

        this.ctx.fillStyle = this.getPartColor(part);
        this.ctx.strokeStyle = CONSTANTS.COLORS.PART_OUTLINE;
        this.ctx.lineWidth = 2;

        if (part.category === 'engine') {
            this.ctx.beginPath();
            this.ctx.moveTo(x - w/2, y - h/2);
            this.ctx.lineTo(x + w/2, y - h/2);
            this.ctx.lineTo(x + w*0.35, y + h/2);
            this.ctx.lineTo(x - w*0.35, y + h/2);
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.stroke();
        } else if (part.type === 'fairing') {
            this.ctx.beginPath();
            this.ctx.moveTo(x - w/2, y + h/2);
            this.ctx.lineTo(x, y - h/2);
            this.ctx.lineTo(x + w/2, y + h/2);
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.stroke();
        } else {
            this.roundRect(x - w/2, y - h/2, w, h, 4);
        }

        if (part.icon) {
            this.ctx.fillStyle = '#fff';
            this.ctx.font = `${Math.min(w, h) * 0.6}px sans-serif`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(part.icon, x, y);
        }

        if (part.selected) {
            this.ctx.strokeStyle = CONSTANTS.COLORS.SELECTION;
            this.ctx.lineWidth = 3;
            this.ctx.strokeRect(x - w/2 - 2, y - h/2 - 2, w + 4, h + 4);
        }

        // Attach points
        this.ctx.fillStyle = '#88ff88';
        for (const ap of part.attachPoints) {
            const apx = x + ap.x * CONSTANTS.GRID_SIZE / 2;
            const apy = y - ap.y * CONSTANTS.GRID_SIZE / 2;
            this.ctx.beginPath();
            this.ctx.arc(apx, apy, 4, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    drawNavball(rocket) {
        const ctx = this.navballCtx;
        const w = this.navballCanvas.width;
        const h = this.navballCanvas.height;
        const cx = w / 2;
        const cy = h / 2;
        const r = w / 2 - 5;

        ctx.clearRect(0, 0, w, h);

        if (!rocket) return;

        // Background
        ctx.fillStyle = '#1a1a2e';
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#4a4a6a';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Artificial horizon
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rocket.rotation + Math.PI / 2);

        // Sky
        ctx.fillStyle = '#4488cc';
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI, false);
        ctx.fill();

        // Ground
        ctx.fillStyle = '#44aa66';
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI, true);
        ctx.fill();

        // Pitch lines
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        for (let i = -3; i <= 3; i++) {
            if (i === 0) continue;
            const y = i * 15;
            ctx.beginPath();
            ctx.moveTo(-20, y);
            ctx.lineTo(20, y);
            ctx.stroke();
        }

        ctx.restore();

        // Markers
        ctx.fillStyle = '#ff4444';
        ctx.beginPath();
        ctx.moveTo(cx - 8, cy - r + 15);
        ctx.lineTo(cx, cy - r + 5);
        ctx.lineTo(cx + 8, cy - r + 15);
        ctx.closePath();
        ctx.fill();

        // Prograde indicator
        if (Vec2.mag(rocket.velocity) > 1) {
            const velAngle = Vec2.angle(rocket.velocity) - rocket.rotation - Math.PI / 2;
            const px = cx + Math.sin(velAngle) * (r - 15);
            const py = cy - Math.cos(velAngle) * (r - 15);
            ctx.fillStyle = '#44ff44';
            ctx.beginPath();
            ctx.arc(px, py, 5, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    drawMapView(rocket, solarSystem) {
        this.clear();
        this.drawSolarSystem(solarSystem, 'map');

        if (rocket) {
            // Draw rocket trajectory
            const gravityBody = solarSystem.getBodyAtPosition(rocket.position);
            if (gravityBody) {
                const trajectory = this.game.physics.predictTrajectory(rocket, gravityBody, 300, 5);
                this.drawTrajectory(trajectory);
                
                const orbitalElements = this.game.physics.calculateOrbitalElements(rocket, gravityBody);
                this.drawOrbit(rocket, gravityBody, orbitalElements);
            }

            // Draw rocket
            const pos = this.worldToScreen(rocket.position.x, rocket.position.y);
            this.ctx.fillStyle = '#fff';
            this.ctx.beginPath();
            this.ctx.arc(pos.x, pos.y, 4, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
}


