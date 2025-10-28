let coins = 1000;
let gems = 0;
let packs = 0;
let prizeMultiplier = 1;
let prizes = [];
let boxesRevealed = [];
let killboxIndex = -1;
let gameActive = false;
let hasCosmeticSkin = false;

const boxesContainer = document.getElementById('boxes-container');
const coinsDisplay = document.getElementById('coins-display');
const gemsDisplay = document.getElementById('gems-display');
const packsDisplay = document.getElementById('pack-list');
const prizeListDisplay = document.getElementById('prize-list');
const gameStatus = document.getElementById('game-status');
const startGameBtn = document.getElementById('start-game-btn');
const endRoundBtn = document.getElementById('end-round-btn');

function updateDisplays() {
    coinsDisplay.textContent = coins;
    gemsDisplay.textContent = gems;
    prizeListDisplay.innerHTML = prizes.map(p => `<li>${p}</li>`).join('');
    packsDisplay.innerHTML = `<li>Prize Multiplier Packs: ${packs}</li>`;
    endRoundBtn.disabled = prizes.length === 0 || !gameActive;
}

function startGame() {
    if (coins < 50) {
        gameStatus.textContent = 'Not enough coins to play! You need 1000 coins.';
        return;
    }

    coins -= 50;
    prizes = [];
    boxesRevealed = [];
    killboxIndex = Math.floor(Math.random() * 4);
    gameActive = true;
    
    gameStatus.textContent = 'Game started! Click a box.';
    startGameBtn.disabled = true;
    
    renderBoxes();
    updateDisplays();
}

function renderBoxes() {
    boxesContainer.innerHTML = '';
    for (let i = 0; i < 4; i++) {
        const box = document.createElement('div');
        box.classList.add('box');
        if (hasCosmeticSkin) {
            box.classList.add('cosmetic-skin');
        }
        box.dataset.index = i;
        box.textContent = '?';
        box.addEventListener('click', handleBoxClick);
        boxesContainer.appendChild(box);
    }
}

function handleBoxClick(event) {
    if (!gameActive) return;

    const box = event.target;
    const index = parseInt(box.dataset.index);

    if (boxesRevealed.includes(index)) {
        return;
    }

    boxesRevealed.push(index);
    box.classList.add('revealed');
    box.removeEventListener('click', handleBoxClick);

    if (index === killboxIndex) {
        box.textContent = 'Killbox!';
        box.classList.add('killbox');
        gameOver();
    } else {
        box.textContent = 'Prize!';
        box.classList.add('prize-box');
        const prize = generatePrize();
        prizes.push(prize);
        gameStatus.textContent = 'You found a prize! Click another box or collect your prizes.';
        updateDisplays();
        checkWinCondition();
    }
}

function generatePrize() {
    const prizeType = Math.random();
    if (prizeType < 0.6) {
        return `+${100 * prizeMultiplier} Coins`;
    } else if (prizeType < 0.9) {
        return `+${10 * prizeMultiplier} Gems`;
    } else {
        return `+${1 * prizeMultiplier} Pack`;
    }
}

function checkWinCondition() {
    if (boxesRevealed.length === 3 && !boxesRevealed.includes(killboxIndex)) {
        // Player has clicked all three prize boxes
        setTimeout(() => {
            collectPrizes(true); // Automatically collect prizes and reward bonus
        }, 1000);
    }
}

function collectPrizes(passedAll = false) {
    if (!gameActive) return;

    prizes.forEach(prize => {
        const value = parseInt(prize.match(/\d+/)[0]);
        if (prize.includes('Coins')) {
            coins += value;
        } else if (prize.includes('Gems')) {
            gems += value;
        } else if (prize.includes('Pack')) {
            packs += value;
        }
    });

    if (passedAll) {
        // Bonus for clicking all prize boxes
        const bonusCoins = 500;
        const bonusGems = 25;
        coins += bonusCoins;
        gems += bonusGems;
        gameStatus.textContent = `You passed the round and collected your prizes! Bonus: ${bonusCoins} Coins and ${bonusGems} Gems!`;
    } else {
        gameStatus.textContent = 'Prizes collected!';
    }
    
    resetGame();
}

function gameOver() {
    gameStatus.textContent = 'Game Over! You hit the Killbox and lost your current prizes.';
    prizes = []; // Lose all prizes
    resetGame();
}

function resetGame() {
    gameActive = false;
    startGameBtn.disabled = false;
    const boxes = document.querySelectorAll('.box');
    boxes.forEach(box => {
        box.removeEventListener('click', handleBoxClick);
        box.textContent = '?';
        box.className = 'box';
        if (hasCosmeticSkin) {
            box.classList.add('cosmetic-skin');
        }
    });
    updateDisplays();
}

function buyPack() {
    if (gems >= 50) {
        gems -= 50;
        packs += 1;
        gameStatus.textContent = 'You bought a Prize Multiplier Pack!';
        updateDisplays();
    } else {
        gameStatus.textContent = 'Not enough gems!';
    }
}

function openPack() {
    if (packs > 0) {
        packs -= 1;
        prizeMultiplier += 1;
        gameStatus.textContent = `You opened a pack! Prize multiplier is now x${prizeMultiplier}.`;
        updateDisplays();
    } else {
        gameStatus.textContent = 'You have no packs to open.';
    }
}

function buySkin() {
    if (gems >= 20) {
        gems -= 20;
        hasCosmeticSkin = true;
        gameStatus.textContent = 'New box skin unlocked!';
        renderBoxes();
        updateDisplays();
    } else {
        gameStatus.textContent = 'Not enough gems!';
    }
}

// Event listener for opening packs (packs list items)
packsDisplay.addEventListener('click', (event) => {
    if (event.target.tagName === 'LI') {
        openPack();
    }
});

// Initial game setup
updateDisplays();
renderBoxes();
