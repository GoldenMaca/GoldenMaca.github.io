// 3D Aim Trainer - Single File Implementation
// Uses Three.js for 3D rendering

// ============================================
// CONFIGURATION & STATE
// ============================================

const CONFIG = {
    defaultSensitivity: 1.0,
    minSensitivity: 0.1,
    maxSensitivity: 5.0,
    targetRadius: 0.5,
    arenaSize: 20,
    targetSpawnDistance: 15,
    defaultTimeLimit: 30,
    colors: {
        primary: 0x00ff88,
        secondary: 0xff0066,
        accent: 0x00ccff,
        background: 0x1a1a2e,
        grid: 0x333366,
        target: 0xff4444,
        targetHit: 0x44ff44,
        menu: 0x0a0a15,
        text: '#00ff88',
        textSecondary: '#ffffff'
    }
};

const STATE = {
    currentScreen: 'menu', // menu, game, leaderboard, settings
    currentScenario: null,
    score: 0,
    hits: 0,
    misses: 0,
    timeRemaining: 0,
    isPlaying: false,
    sensitivity: CONFIG.defaultSensitivity,
    targets: [],
    personalBests: {},
    mouseSensitivity: 1.0
};

// ============================================
// SCENARIOS
// ============================================

const SCENARIOS = {
    static: {
        name: "Static Targets",
        description: "Click on static targets as fast as you can",
        duration: 30,
        spawnRate: 1000,
        targetType: 'static'
    },
    tracking: {
        name: "Tracking",
        description: "Follow the moving target with your cursor",
        duration: 30,
        spawnRate: 1,
        targetType: 'tracking'
    },
    flick: {
        name: "Quick Flick",
        description: "React and flick to targets quickly",
        duration: 45,
        spawnRate: 800,
        targetType: 'flick'
    },
    reflex: {
        name: "Reflex Test",
        description: "Click targets the moment they appear",
        duration: 20,
        spawnRate: 600,
        targetType: 'reflex'
    },
    chaos: {
        name: "Chaos Mode",
        description: "Multiple targets appear everywhere",
        duration: 60,
        spawnRate: 400,
        targetType: 'chaos'
    }
};

// ============================================
// THREE.JS SETUP
// ============================================

let scene, camera, renderer, raycaster, mouse;
let targetMeshes = [];

function initThreeJS() {
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(CONFIG.colors.background);
    scene.fog = new THREE.Fog(CONFIG.colors.background, 10, 50);

    // Create camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);

    // Raycaster for mouse picking
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    // Create environment
    createEnvironment();

    // Handle resize
    window.addEventListener('resize', onWindowResize);
}

function createEnvironment() {
    // Grid floor
    const gridHelper = new THREE.GridHelper(40, 40, CONFIG.colors.grid, CONFIG.colors.grid);
    gridHelper.position.y = -5;
    scene.add(gridHelper);

    // Ambient particles
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 500;
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 40;
        positions[i + 1] = (Math.random() - 0.5) * 40;
        positions[i + 2] = (Math.random() - 0.5) * 40;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({ color: CONFIG.colors.accent, size: 0.05 });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(CONFIG.colors.primary, 1, 100);
    pointLight.position.set(0, 10, 10);
    scene.add(pointLight);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// ============================================
// TARGET SYSTEM
// ============================================

function createTarget(x, y, z, type = 'static') {
    const geometry = new THREE.SphereGeometry(CONFIG.targetRadius, 32, 32);
    const material = new THREE.MeshPhongMaterial({
        color: CONFIG.colors.target,
        emissive: CONFIG.colors.target,
        emissiveIntensity: 0.3,
        shininess: 100
    });

    const target = new THREE.Mesh(geometry, material);
    target.position.set(x, y, z);
    target.userData = {
        type: type,
        createdAt: Date.now(),
        isHit: false,
        velocity: new THREE.Vector3()
    };

    scene.add(target);
    targetMeshes.push(target);
    STATE.targets.push(target);

    return target;
}

function spawnTarget(scenario) {
    const angle = Math.random() * Math.PI * 2;
    const distance = CONFIG.targetSpawnDistance + (Math.random() - 0.5) * 5;
    const x = Math.cos(angle) * distance * 0.5;
    const y = Math.sin(angle) * distance * 0.5;
    const z = -CONFIG.targetSpawnDistance + (Math.random() - 0.5) * 5;

    const target = createTarget(x, y, z, scenario.targetType);

    if (scenario.targetType === 'tracking') {
        target.userData.velocity.set(
            (Math.random() - 0.5) * 0.1,
            (Math.random() - 0.5) * 0.1,
            0
        );
    }

    return target;
}

function updateTargets() {
    const toRemove = [];

    targetMeshes.forEach((target, index) => {
        // Update tracking targets
        if (target.userData.type === 'tracking') {
            target.position.add(target.userData.velocity);
            
            // Bounce off boundaries
            if (Math.abs(target.position.x) > 10) target.userData.velocity.x *= -1;
            if (Math.abs(target.position.y) > 7) target.userData.velocity.y *= -1;
        }

        // Update flick targets - move toward center slightly
        if (target.userData.type === 'flick') {
            target.position.x *= 0.98;
            target.position.y *= 0.98;
        }
    });
}

function removeTarget(target) {
    const index = targetMeshes.indexOf(target);
    if (index > -1) {
        targetMeshes.splice(index, 1);
        scene.remove(target);
        target.geometry.dispose();
        target.material.dispose();
    }
}

function clearAllTargets() {
    targetMeshes.forEach(target => {
        scene.remove(target);
        target.geometry.dispose();
        target.material.dispose();
    });
    targetMeshes = [];
    STATE.targets = [];
}

// ============================================
// GAME LOGIC
// ============================================

let gameInterval = null;
let spawnInterval = null;

function startGame(scenarioKey) {
    STATE.currentScenario = SCENARIOS[scenarioKey];
    STATE.score = 0;
    STATE.hits = 0;
    STATE.misses = 0;
    STATE.timeRemaining = STATE.currentScenario.duration;
    STATE.isPlaying = true;

    showGameUI();
    clearAllTargets();

    // Start game loop
    gameInterval = setInterval(() => {
        STATE.timeRemaining--;
        updateGameUI();

        if (STATE.timeRemaining <= 0) {
            endGame();
        }
    }, 1000);

    // Spawn targets based on scenario
    if (STATE.currentScenario.targetType === 'tracking') {
        spawnTarget(STATE.currentScenario);
    } else {
        spawnInterval = setInterval(() => {
            if (STATE.isPlaying) {
                const targetCount = STATE.currentScenario.targetType === 'chaos' ? 3 : 1;
                for (let i = 0; i < targetCount; i++) {
                    spawnTarget(STATE.currentScenario);
                }
            }
        }, STATE.currentScenario.spawnRate);
        
        // Initial spawn
        spawnTarget(STATE.currentScenario);
    }

    updateCameraPosition();
}

function endGame() {
    STATE.isPlaying = false;
    clearInterval(gameInterval);
    clearInterval(spawnInterval);

    // Calculate final score
    const accuracy = STATE.hits / (STATE.hits + STATE.misses) * 100 || 0;
    const finalScore = Math.round(STATE.score * (accuracy / 100));

    // Update personal best
    updatePersonalBest(STATE.currentScenario.name, finalScore);

    showGameOver(finalScore, accuracy);
}

function handleHit(target) {
    STATE.hits++;
    STATE.score += 100 * STATE.sensitivity;

    // Visual feedback
    target.material.color.setHex(CONFIG.colors.targetHit);
    target.material.emissive.setHex(CONFIG.colors.targetHit);

    setTimeout(() => removeTarget(target), 100);
}

function handleMiss() {
    STATE.misses--;
    STATE.score = Math.max(0, STATE.score - 10);
}

// ============================================
// CAMERA & CONTROLS
// ============================================

let cameraRotationX = 0;
let cameraRotationY = 0;

function updateCameraPosition() {
    // Subtle camera movement based on mouse
    camera.position.x += (mouse.x * 2 - camera.position.x) * 0.05;
    camera.position.y += (mouse.y * 2 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, -10);
}

function onMouseMove(event) {
    // Normalize mouse position
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    if (STATE.isPlaying) {
        updateCameraPosition();
    }
}

function onMouseClick(event) {
    if (!STATE.isPlaying) return;

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(targetMeshes);

    if (intersects.length > 0) {
        handleHit(intersects[0].object);
    } else {
        handleMiss();
    }
}

// ============================================
// UI MANAGEMENT
// ============================================

function createUI() {
    // Main container
    const container = document.createElement('div');
    container.id = 'game-container';
    container.innerHTML = `
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                overflow: hidden;
                font-family: 'Courier New', monospace;
                background: ${'#0a0a15'};
            }
            
            #game-container {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 1000;
            }
            
            .screen {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                display: none;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                background: linear-gradient(135deg, rgba(10,10,21,0.95) 0%, rgba(20,20,40,0.95) 100%);
            }
            
            .screen.active {
                display: flex;
            }
            
            h1 {
                font-size: 4rem;
                color: ${'#00ff88'};
                text-shadow: 0 0 20px ${'#00ff88'}, 0 0 40px ${'#00ff88'};
                margin-bottom: 0.5rem;
                letter-spacing: 0.2rem;
                animation: glow 2s ease-in-out infinite;
            }
            
            @keyframes glow {
                0%, 100% { text-shadow: 0 0 20px #00ff88, 0 0 40px #00ff88; }
                50% { text-shadow: 0 0 30px #00ff88, 0 0 60px #00ff88, 0 0 80px #00ff88; }
            }
            
            h2 {
                font-size: 2rem;
                color: ${'#00ccff'};
                margin-bottom: 1rem;
                text-shadow: 0 0 10px ${'#00ccff'};
            }
            
            .subtitle {
                font-size: 1rem;
                color: ${'#666'};
                margin-bottom: 2rem;
            }
            
            .menu-buttons {
                display: flex;
                flex-direction: column;
                gap: 1rem;
                width: 300px;
            }
            
            .btn {
                padding: 1rem 2rem;
                font-size: 1.2rem;
                font-family: inherit;
                background: transparent;
                border: 2px solid ${'#00ff88'};
                color: ${'#00ff88'};
                cursor: pointer;
                transition: all 0.3s ease;
                text-transform: uppercase;
                letter-spacing: 0.1rem;
            }
            
            .btn:hover {
                background: ${'#00ff88'};
                color: ${'#0a0a15'};
                box-shadow: 0 0 20px ${'#00ff88'};
                transform: scale(1.05);
            }
            
            .btn.secondary {
                border-color: ${'#00ccff'};
                color: ${'#00ccff'};
            }
            
            .btn.secondary:hover {
                background: ${'#00ccff'};
                color: ${'#0a0a15'};
                box-shadow: 0 0 20px ${'#00ccff'};
            }
            
            .btn.danger {
                border-color: ${'#ff0066'};
                color: ${'#ff0066'};
            }
            
            .btn.danger:hover {
                background: ${'#ff0066'};
                color: ${'#0a0a15'};
                box-shadow: 0 0 20px ${'#ff0066'};
            }
            
            .scenarios {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 1rem;
                max-width: 900px;
                margin: 1rem;
            }
            
            .scenario-card {
                background: rgba(0,255,136,0.05);
                border: 1px solid ${'#00ff88'};
                padding: 1.5rem;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .scenario-card:hover {
                background: rgba(0,255,136,0.15);
                transform: translateY(-5px);
                box-shadow: 0 10px 30px rgba(0,255,136,0.2);
            }
            
            .scenario-card h3 {
                color: ${'#00ff88'};
                margin-bottom: 0.5rem;
            }
            
            .scenario-card p {
                color: ${'#888'};
                font-size: 0.9rem;
            }
            
            .scenario-card .duration {
                color: ${'#00ccff'};
                margin-top: 0.5rem;
                font-size: 0.8rem;
            }
            
            .leaderboard {
                background: rgba(0,0,0,0.5);
                border: 1px solid ${'#00ff88'};
                padding: 2rem;
                max-width: 500px;
                width: 100%;
            }
            
            .leaderboard-entry {
                display: flex;
                justify-content: space-between;
                padding: 0.5rem;
                border-bottom: 1px solid ${'#333'};
                color: ${'#fff'};
            }
            
            .leaderboard-entry:first-child {
                color: ${'#ffd700'};
                font-weight: bold;
            }
            
            .leaderboard-entry .score {
                color: ${'#00ff88'};
            }
            
            .settings-panel {
                background: rgba(0,0,0,0.5);
                border: 1px solid ${'#00ff88'};
                padding: 2rem;
                max-width: 400px;
                width: 100%;
            }
            
            .setting-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1.5rem;
            }
            
            .setting-row label {
                color: ${'#fff'};
            }
            
            .setting-row input[type="range"] {
                width: 150px;
                accent-color: ${'#00ff88'};
            }
            
            .setting-value {
                color: ${'#00ff88'};
                min-width: 50px;
                text-align: right;
            }
            
            .game-hud {
                position: fixed;
                top: 20px;
                left: 20px;
                right: 20px;
                display: none;
                justify-content: space-between;
                z-index: 1001;
                pointer-events: none;
            }
            
            .game-hud.active {
                display: flex;
            }
            
            .hud-item {
                background: rgba(10,10,21,0.8);
                border: 1px solid ${'#00ff88'};
                padding: 1rem 1.5rem;
                color: ${'#00ff88'};
                font-size: 1.2rem;
            }
            
            .hud-item span {
                color: ${'#fff'};
            }
            
            .game-over-screen {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(10,10,21,0.95);
                display: none;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                z-index: 1002;
            }
            
            .game-over-screen.active {
                display: flex;
            }
            
            .final-score {
                font-size: 6rem;
                color: ${'#00ff88'};
                text-shadow: 0 0 30px ${'#00ff88'};
                margin: 1rem 0;
            }
            
            .accuracy {
                font-size: 1.5rem;
                color: ${'#00ccff'};
                margin-bottom: 2rem;
            }
            
            .new-record {
                color: ${'#ffd700'};
                font-size: 1.5rem;
                animation: pulse 1s infinite;
            }
            
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }
            
            .crosshair {
                position: fixed;
                pointer-events: none;
                z-index: 1003;
                width: 20px;
                height: 20px;
                transform: translate(-50%, -50%);
            }
            
            .crosshair::before,
            .crosshair::after {
                content: '';
                position: absolute;
                background: ${'#00ff88'};
            }
            
            .crosshair::before {
                width: 2px;
                height: 100%;
                left: 50%;
                transform: translateX(-50%);
            }
            
            .crosshair::after {
                width: 100%;
                height: 2px;
                top: 50%;
                transform: translateY(-50%);
            }
            
            .back-btn {
                position: fixed;
                top: 20px;
                left: 20px;
                z-index: 1001;
            }
            
            .instructions {
                color: ${'#666'};
                margin-top: 2rem;
                font-size: 0.9rem;
                text-align: center;
            }
        </style>
        
        <!-- Menu Screen -->
        <div id="menu-screen" class="screen active">
            <h1>AIM TRAINER</h1>
            <p class="subtitle">3D Performance Tracker</p>
            <div class="menu-buttons">
                <button class="btn" onclick="showScenarioSelect()">Play</button>
                <button class="btn secondary" onclick="showLeaderboard()">Leaderboard</button>
                <button class="btn secondary" onclick="showSettings()">Settings</button>
            </div>
            <p class="instructions">Move mouse to look around • Click to shoot</p>
        </div>
        
        <!-- Scenario Select Screen -->
        <div id="scenario-screen" class="screen">
            <h2>Select Scenario</h2>
            <div class="scenarios" id="scenario-list"></div>
            <button class="btn danger back-btn" onclick="showMenu()">Back</button>
        </div>
        
        <!-- Leaderboard Screen -->
        <div id="leaderboard-screen" class="screen">
            <h2>Personal Bests</h2>
            <div class="leaderboard" id="leaderboard-content"></div>
            <button class="btn danger back-btn" onclick="showMenu()">Back</button>
        </div>
        
        <!-- Settings Screen -->
        <div id="settings-screen" class="screen">
            <h2>Settings</h2>
            <div class="settings-panel">
                <div class="setting-row">
                    <label>Sensitivity</label>
                    <input type="range" id="sensitivity-slider" min="0.1" max="5" step="0.1" value="1">
                    <span class="setting-value" id="sensitivity-value">1.0</span>
                </div>
                <div class="setting-row">
                    <label>Mouse Sensitivity</label>
                    <input type="range" id="mouse-sensitivity-slider" min="0.1" max="3" step="0.1" value="1">
                    <span class="setting-value" id="mouse-sensitivity-value">1.0</span>
                </div>
                <button class="btn" onclick="saveSettings()">Save</button>
            </div>
            <button class="btn danger back-btn" onclick="showMenu()">Back</button>
        </div>
        
        <!-- Game HUD -->
        <div id="game-hud" class="game-hud">
            <div class="hud-item">Score: <span id="hud-score">0</span></div>
            <div class="hud-item">Time: <span id="hud-time">30</span></div>
            <div class="hud-item">Hits: <span id="hud-hits">0</span></div>
        </div>
        
        <!-- Game Over Screen -->
        <div id="game-over-screen" class="game-over-screen">
            <h2>Game Over</h2>
            <div class="final-score" id="final-score">0</div>
            <div class="accuracy" id="accuracy">Accuracy: 0%</div>
            <div id="new-record" class="new-record" style="display: none;">🎉 NEW PERSONAL BEST! 🎉</div>
            <div class="menu-buttons">
                <button class="btn" onclick="restartGame()">Play Again</button>
                <button class="btn secondary" onclick="showScenarioSelect()">Change Scenario</button>
                <button class="btn danger" onclick="showMenu()">Menu</button>
            </div>
        </div>
        
        <!-- Custom Crosshair -->
        <div class="crosshair" id="crosshair"></div>
    `;

    document.body.appendChild(container);

    // Add event listeners
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('click', onMouseClick);
    document.addEventListener('mousemove', (e) => {
        const crosshair = document.getElementById('crosshair');
        if (crosshair) {
            crosshair.style.left = e.clientX + 'px';
            crosshair.style.top = e.clientY + 'px';
        }
    });

    // Slider event listeners
    document.getElementById('sensitivity-slider').addEventListener('input', (e) => {
        document.getElementById('sensitivity-value').textContent = parseFloat(e.target.value).toFixed(1);
        STATE.sensitivity = parseFloat(e.target.value);
    });

    document.getElementById('mouse-sensitivity-slider').addEventListener('input', (e) => {
        document.getElementById('mouse-sensitivity-value').textContent = parseFloat(e.target.value).toFixed(1);
        STATE.mouseSensitivity = parseFloat(e.target.value);
    });

    // Load saved settings
    loadSettings();

    // Populate scenarios
    populateScenarios();
}

// ============================================
// SCREEN MANAGEMENT
// ============================================

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

function showMenu() {
    showScreen('menu-screen');
    STATE.currentScreen = 'menu';
}

function showScenarioSelect() {
    showScreen('scenario-screen');
    STATE.currentScreen = 'scenarios';
}

function showLeaderboard() {
    showScreen('leaderboard-screen');
    updateLeaderboardDisplay();
    STATE.currentScreen = 'leaderboard';
}

function showSettings() {
    showScreen('settings-screen');
    STATE.currentScreen = 'settings';
    
    // Load current values
    document.getElementById('sensitivity-slider').value = STATE.sensitivity;
    document.getElementById('sensitivity-value').textContent = STATE.sensitivity.toFixed(1);
    document.getElementById('mouse-sensitivity-slider').value = STATE.mouseSensitivity;
    document.getElementById('mouse-sensitivity-value').textContent = STATE.mouseSensitivity.toFixed(1);
}

function showGameUI() {
    document.getElementById('game-hud').classList.add('active');
    document.getElementById('menu-screen').classList.remove('active');
}

function hideGameUI() {
    document.getElementById('game-hud').classList.remove('active');
}

function showGameOver(score, accuracy) {
    hideGameUI();
    clearAllTargets();
    
    const gameOverScreen = document.getElementById('game-over-screen');
    gameOverScreen.classList.add('active');
    
    document.getElementById('final-score').textContent = score;
    document.getElementById('accuracy').textContent = `Accuracy: ${accuracy.toFixed(1)}%`;
    
    // Check for new personal best
    const scenario = STATE.currentScenario.name;
    const isNewRecord = STATE.personalBests[scenario] === score;
    document.getElementById('new-record').style.display = isNewRecord ? 'block' : 'none';
}

function updateGameUI() {
    document.getElementById('hud-score').textContent = STATE.score;
    document.getElementById('hud-time').textContent = STATE.timeRemaining;
    document.getElementById('hud-hits').textContent = STATE.hits;
}

// ============================================
// SCENARIO MANAGEMENT
// ============================================

function populateScenarios() {
    const container = document.getElementById('scenario-list');
    container.innerHTML = '';

    Object.entries(SCENARIOS).forEach(([key, scenario]) => {
        const card = document.createElement('div');
        card.className = 'scenario-card';
        card.innerHTML = `
            <h3>${scenario.name}</h3>
            <p>${scenario.description}</p>
            <div class="duration">Duration: ${scenario.duration}s</div>
        `;
        card.onclick = () => startGame(key);
        container.appendChild(card);
    });
}

// ============================================
// LEADERBOARD / PERSONAL BESTS
// ============================================

function loadPersonalBests() {
    try {
        const saved = localStorage.getItem('aimtrainer_personalbests');
        if (saved) {
            STATE.personalBests = JSON.parse(saved);
        }
    } catch (e) {
        console.log('Could not load personal bests');
    }
}

function savePersonalBests() {
    try {
        localStorage.setItem('aimtrainer_personalbests', JSON.stringify(STATE.personalBests));
    } catch (e) {
        console.log('Could not save personal bests');
    }
}

function updatePersonalBest(scenario, score) {
    const current = STATE.personalBests[scenario] || 0;
    if (score > current) {
        STATE.personalBests[scenario] = score;
        savePersonalBests();
        return true;
    }
    return false;
}

function updateLeaderboardDisplay() {
    const container = document.getElementById('leaderboard-content');
    
    if (Object.keys(STATE.personalBests).length === 0) {
        container.innerHTML = '<p style="color: #666; text-align: center;">No records yet. Play some games!</p>';
        return;
    }

    let html = '';
    Object.entries(STATE.personalBests)
        .sort((a, b) => b[1] - a[1])
        .forEach(([scenario, score], index) => {
            html += `
                <div class="leaderboard-entry" style="${index === 0 ? 'color: #ffd700;' : ''}">
                    <span>${scenario}</span>
                    <span class="score">${score}</span>
                </div>
            `;
        });
    
    container.innerHTML = html;
}

// ============================================
// SETTINGS
// ============================================

function loadSettings() {
    try {
        const saved = localStorage.getItem('aimtrainer_settings');
        if (saved) {
            const settings = JSON.parse(saved);
            STATE.sensitivity = settings.sensitivity || CONFIG.defaultSensitivity;
            STATE.mouseSensitivity = settings.mouseSensitivity || 1.0;
        }
    } catch (e) {
        console.log('Could not load settings');
    }
    loadPersonalBests();
}

function saveSettings() {
    try {
        localStorage.setItem('aimtrainer_settings', JSON.stringify({
            sensitivity: STATE.sensitivity,
            mouseSensitivity: STATE.mouseSensitivity
        }));
    } catch (e) {
        console.log('Could not save settings');
    }
    showMenu();
}

function restartGame() {
    document.getElementById('game-over-screen').classList.remove('active');
    if (STATE.currentScenario) {
        startGame(Object.keys(SCENARIOS).find(key => SCENARIOS[key] === STATE.currentScenario));
    }
}

// ============================================
// ANIMATION LOOP
// ============================================

function animate() {
    requestAnimationFrame(animate);

    if (STATE.isPlaying) {
        updateTargets();
        
        // Apply mouse sensitivity to camera movement
        const sensitivityFactor = STATE.mouseSensitivity;
        camera.rotation.x += mouse.y * 0.001 * sensitivityFactor;
        camera.rotation.y += mouse.x * 0.001 * sensitivityFactor;
    }

    // Rotate scene slightly for visual effect
    scene.rotation.y += 0.0005;

    renderer.render(scene, camera);
}

// ============================================
// INITIALIZATION
// ============================================

function init() {
    initThreeJS();
    createUI();
    animate();
}

// Start the game when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Make functions globally accessible
window.showMenu = showMenu;
window.showScenarioSelect = showScenarioSelect;
window.showLeaderboard = showLeaderboard;
window.showSettings = showSettings;
window.startGame = startGame;
window.saveSettings = saveSettings;
window.restartGame = restartGame;

