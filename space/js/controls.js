// Input Controls
class Controls {
    constructor(game) {
        this.game = game;
        this.keys = {};
        this.mouse = {
            x: 0,
            y: 0,
            down: false,
            rightDown: false,
            justClicked: false
        };
        this.canvas = game.canvas;
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Keyboard
        window.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            this.handleKeyDown(e);
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });

        // Mouse
        this.canvas.addEventListener('mousedown', (e) => {
            if (e.button === 0) {
                this.mouse.down = true;
                this.mouse.justClicked = true;
            } else if (e.button === 2) {
                this.mouse.rightDown = true;
            }
            this.updateMousePos(e);
        });

        this.canvas.addEventListener('mouseup', (e) => {
            if (e.button === 0) this.mouse.down = false;
            if (e.button === 2) this.mouse.rightDown = false;
        });

        this.canvas.addEventListener('mousemove', (e) => {
            this.updateMousePos(e);
        });

        this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());

        // Wheel
        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            this.game.handleZoom(e.deltaY * -0.001);
        }, { passive: false });

        // UI Buttons
        this.setupUIButtons();
    }

    setupUIButtons() {
        // Mode switching
        document.getElementById('mode-builder').addEventListener('click', () => {
            this.game.setMode('builder');
        });
        document.getElementById('mode-flight').addEventListener('click', () => {
            this.game.setMode('flight');
        });
        document.getElementById('mode-map').addEventListener('click', () => {
            this.game.setMode('map');
        });

        // Builder buttons
        document.getElementById('launch-btn').addEventListener('click', () => {
            this.game.launchRocket();
        });
        document.getElementById('clear-rocket-btn').addEventListener('click', () => {
            this.game.builder.clearRocket();
        });
        document.getElementById('save-rocket-btn').addEventListener('click', () => {
            this.game.builder.saveRocket();
        });
        document.getElementById('load-rocket-btn').addEventListener('click', () => {
            this.game.builder.loadRocket();
        });
        document.getElementById('add-stage-btn').addEventListener('click', () => {
            this.game.builder.addStage();
        });

        // Flight controls
        document.getElementById('stage-btn').addEventListener('click', () => {
            if (this.game.rocket) {
                this.game.stageRocket();
            }
        });

        const throttleSlider = document.getElementById('throttle-slider');
        throttleSlider.addEventListener('input', (e) => {
            if (this.game.rocket) {
                this.game.rocket.throttle = e.target.value / 100;
                document.getElementById('throttle-value').textContent = e.target.value + '%';
            }
        });

        // Time warp
        document.querySelectorAll('.warp-buttons button').forEach(btn => {
            btn.addEventListener('click', () => {
                const warp = parseInt(btn.dataset.warp);
                this.game.setTimeWarp(warp);
                document.querySelectorAll('.warp-buttons button').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });

        // Map
        document.getElementById('map-close').addEventListener('click', () => {
            this.game.setMode('flight');
        });

        // Help
        document.getElementById('help-toggle').addEventListener('click', () => {
            document.getElementById('help-content').classList.toggle('hidden');
        });
    }

    updateMousePos(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;
    }

    handleKeyDown(e) {
        switch(e.code) {
            case 'Space':
                e.preventDefault();
                if (this.game.mode === 'flight' && this.game.rocket) {
                    this.game.stageRocket();
                }
                break;
            case 'KeyM':
                if (this.game.mode === 'map') {
                    this.game.setMode('flight');
                } else if (this.game.mode === 'flight') {
                    this.game.setMode('map');
                }
                break;
            case 'KeyV':
                this.game.setMode('builder');
                break;
            case 'KeyR':
                if (this.game.mode === 'builder') {
                    this.game.builder.rotateSelectedPart();
                }
                break;
            case 'Delete':
            case 'Backspace':
                if (this.game.mode === 'builder') {
                    this.game.builder.deleteSelectedPart();
                }
                break;
            case 'KeyZ':
                if (e.ctrlKey || e.metaKey) {
                    if (e.shiftKey) {
                        this.game.builder.redo();
                    } else {
                        this.game.builder.undo();
                    }
                }
                break;
            case 'KeyL':
                if (this.game.mode === 'builder') {
                    this.game.launchRocket();
                }
                break;
        }
    }

    update() {
        if (this.game.mode === 'flight' && this.game.rocket && !this.game.rocket.landed) {
            // Steering
            const torque = 1.5;
            if (this.keys['KeyA'] || this.keys['ArrowLeft']) {
                this.game.rocket.angularVelocity -= torque * 0.016;
            }
            if (this.keys['KeyD'] || this.keys['ArrowRight']) {
                this.game.rocket.angularVelocity += torque * 0.016;
            }

            // Throttle
            const throttleStep = 0.02;
            if (this.keys['ShiftLeft'] || this.keys['ShiftRight']) {
                this.game.rocket.throttle = Math.min(1, this.game.rocket.throttle + throttleStep);
                document.getElementById('throttle-slider').value = Math.round(this.game.rocket.throttle * 100);
                document.getElementById('throttle-value').textContent = Math.round(this.game.rocket.throttle * 100) + '%';
            }
            if (this.keys['ControlLeft'] || this.keys['ControlRight']) {
                this.game.rocket.throttle = Math.max(0, this.game.rocket.throttle - throttleStep);
                document.getElementById('throttle-slider').value = Math.round(this.game.rocket.throttle * 100);
                document.getElementById('throttle-value').textContent = Math.round(this.game.rocket.throttle * 100) + '%';
            }

            // Kill rotation
            if (this.keys['KeyX']) {
                this.game.rocket.angularVelocity *= 0.9;
            }

            // Max throttle
            if (this.keys['KeyZ']) {
                this.game.rocket.throttle = 1;
                document.getElementById('throttle-slider').value = 100;
                document.getElementById('throttle-value').textContent = '100%';
            }
        }

        // Reset justClicked
        this.mouse.justClicked = false;
    }

    isKeyDown(code) {
        return !!this.keys[code];
    }
}


