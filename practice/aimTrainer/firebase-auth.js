// Firebase Authentication System
// Uses localStorage for offline support, Firebase when available

const firebaseAuthConfig = {
    apiKey: "AIzaSyBLnHaXUJsxsimqH1o6KJ8TEEGqRQ0Wcak",
    authDomain: "octoaim.firebaseapp.com",
    projectId: "octoaim",
    storageBucket: "octoaim.firebasestorage.app",
    messagingSenderId: "629745818659",
    appId: "1:629745818659:web:eb0f7be2f095dd0284a596"
};

// Game names
const gameNamesMap = {
    '360Aim': '360° Aim Tracker', 'flick': '360° Flick Trainer',
    'bounceTracker': 'Bounce Tracker', 'reactionTrainer': 'Reaction Trainer',
    'microflick': 'Micro Flick Trainer', 'glider': 'Glider Trainer',
    'staticPrecision': 'Static Precision', 'jumppeek': 'Jump Peek Trainer'
};

// Auth state
let auth = null;
let db = null;
let currentUser = null;
let userProfile = null;
let firebaseReady = false;

// Skins
const SKINS = {
    default: { id: 'default', name: 'Default Red', price: 0, color: 0xff2244, emissive: 0xff1122 },
    neonBlue: { id: 'neonBlue', name: 'Neon Blue', price: 100, color: 0x00ccff, emissive: 0x0088ff },
    fireRed: { id: 'fireRed', name: 'Fire Red', price: 150, color: 0xff4400, emissive: 0xff2200 },
    golden: { id: 'golden', name: 'Golden', price: 300, color: 0xffd700, emissive: 0xffaa00 },
    rainbow: { id: 'rainbow', name: 'Rainbow', price: 500, color: 0xff00ff, emissive: 0xaa00ff },
    toxic: { id: 'toxic', name: 'Toxic Green', price: 200, color: 0x00ff44, emissive: 0x00ff22 },
    purple: { id: 'purple', name: 'Purple Rain', price: 250, color: 0x8800ff, emissive: 0x6600ff },
    white: { id: 'white', name: 'Pure White', price: 175, color: 0xffffff, emissive: 0xaaaaaa },
    black: { id: 'black', name: 'Midnight', price: 125, color: 0x222222, emissive: 0x111111 },
    orange: { id: 'orange', name: 'Sunset Orange', price: 180, color: 0xff6600, emissive: 0xff4400 }
};

// Quests
const QUESTS = {
    daily: [
        { id: 'play_3', name: 'Play 3 Games', desc: 'Complete 3 hard mode games', target: 3, reward: 25, claimed: false },
        { id: 'score_1000', name: 'Score Master', desc: 'Score over 1000 in any game', target: 1000, reward: 50, claimed: false },
        { id: 'play_specific', name: 'Variety Pack', desc: 'Play 2 different trainers', target: 2, reward: 35, claimed: false }
    ],
    weekly: [
        { id: 'play_20', name: 'Dedicated', desc: 'Complete 20 hard mode games', target: 20, reward: 150, claimed: false },
        { id: 'score_5000', name: 'High Scorer', desc: 'Score over 5000 in any game', target: 5000, reward: 300, claimed: false },
        { id: 'all_games', name: 'Full Practice', desc: 'Play all 8 trainers at least once', target: 8, reward: 200, claimed: false }
    ]
};

// Initialize Firebase
async function initFirebaseAuth() {
    try {
        // Load Firebase compat version (provides global firebase object)
        const script1 = document.createElement('script');
        script1.src = 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js';
        document.head.appendChild(script1);
        await new Promise(resolve => script1.onload = resolve);
        
        const script2 = document.createElement('script');
        script2.src = 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth-compat.js';
        document.head.appendChild(script2);
        await new Promise(resolve => script2.onload = resolve);
        
        const script3 = document.createElement('script');
        script3.src = 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js';
        document.head.appendChild(script3);
        await new Promise(resolve => script3.onload = resolve);
        
        // Initialize Firebase
        const app = firebase.initializeApp(firebaseAuthConfig);
        auth = firebase.auth();
        db = firebase.firestore();
        
        firebase.auth().onAuthStateChanged(async (user) => {
            if (user) {
                currentUser = user;
                await loadUserProfile(user.uid);
                updateAuthUI(true);
            } else {
                currentUser = null;
                userProfile = null;
                updateAuthUI(false);
            }
        });
        
        firebaseReady = true;
        console.log('Firebase connected!');
        return true;
    } catch (e) {
        console.log('Firebase not available, using local-only mode:', e);
        firebaseReady = false;
        return false;
    }
}

async function loadUserProfile(uid) {
    try {
        const doc = await db.collection('users').doc(uid).get();
        if (doc.exists) {
            userProfile = doc.data();
        } else {
            userProfile = {
                uid: uid,
                username: currentUser.displayName || currentUser.email.split('@')[0],
                email: currentUser.email,
                coins: 50,
                skins: ['default'],
                equippedSkin: 'default'
            };
            await db.collection('users').doc(uid).set(userProfile);
        }
        localStorage.setItem('aimtrainer_coins', userProfile.coins);
        localStorage.setItem('aimtrainer_skins', JSON.stringify(userProfile.skins));
        localStorage.setItem('aimtrainer_equipped_skin', userProfile.equippedSkin);
        return userProfile;
    } catch (e) {
        userCoins = parseInt(localStorage.getItem('aimtrainer_coins') || '0');
        return null;
    }
}

async function signUp(email, password, username) {
    if (!firebaseReady) {
        return { success: false, error: 'Firebase not loaded. Try refreshing.' };
    }
    try {
        const usernameCheck = await db.collection('users')
            .where('usernameLower', '==', username.toLowerCase())
            .limit(1).get();
        
        if (!usernameCheck.empty) {
            return { success: false, error: 'Username already taken. Choose a different one.' };
        }
        
        const cred = await firebase.auth().createUserWithEmailAndPassword(email, password);
        
        const urlParams = new URLSearchParams(window.location.search);
        const refCode = urlParams.get('ref');
        const userReferralCode = 'OCTO' + Math.random().toString(36).substr(2, 6).toUpperCase();
        
        await db.collection('users').doc(cred.user.uid).set({
            uid: cred.user.uid,
            username: username,
            usernameLower: username.toLowerCase(),
            email: email,
            coins: 50,
            skins: ['default'],
            equippedSkin: 'default',
            referralCode: userReferralCode,
            referrals: 0
        });
        
        if (refCode) {
            await applyReferralCode(refCode);
        }
        
        localStorage.setItem('aimtrainer_referral_code', userReferralCode);
        
        return { success: true, user: cred.user };
    } catch (e) {
        return { success: false, error: e.message };
    }
}

async function signIn(email, password) {
    if (!firebaseReady) {
        return { success: false, error: 'Firebase not loaded. Try refreshing.' };
    }
    try {
        const cred = await firebase.auth().signInWithEmailAndPassword(email, password);
        return { success: true, user: cred.user };
    } catch (e) {
        return { success: false, error: e.message };
    }
}

async function signInWithGoogle() {
    if (!firebaseReady) {
        return { success: false, error: 'Firebase not loaded. Try refreshing.' };
    }
    try {
        const provider = new firebase.auth.GoogleAuthProvider();
        const cred = await firebase.auth().signInWithPopup(provider);
        return { success: true, user: cred.user };
    } catch (e) {
        return { success: false, error: e.message };
    }
}

async function logOut() {
    if (firebaseReady && auth) {
        await firebase.auth().signOut();
    }
    currentUser = null;
    userProfile = null;
}

function updateAuthUI(isLoggedIn) {
    const authSection = document.getElementById('auth-section');
    if (!authSection) return;
    
    const coins = parseInt(localStorage.getItem('aimtrainer_coins') || '0');
    const username = localStorage.getItem('aimtrainer_username') || 'Player';
    
    if (isLoggedIn && userProfile) {
        authSection.innerHTML = `
            <div class="user-info">
                <span class="username">${userProfile.username || username}</span>
                <span class="coins">🪙 ${coins}</span>
            </div>
            <button class="auth-btn logout" onclick="handleLogout()">Sign Out</button>
        `;
    } else {
        authSection.innerHTML = `<button class="auth-btn" onclick="showAuthModal()">Sign In</button>`;
    }
}

function getCurrentSkin() {
    const skinId = localStorage.getItem('aimtrainer_equipped_skin') || 'default';
    return SKINS[skinId] || SKINS.default;
}

async function submitGlobalScore(gameId, score, difficulty) {
    if (!firebaseReady || !currentUser || difficulty !== 'hard') return false;
    try {
        await db.collection('leaderboard').add({
            gameId, score: parseInt(score), userId: currentUser.uid,
            username: userProfile?.username || 'Player', timestamp: Date.now()
        });
        return true;
    } catch (e) { return false; }
}

async function getGlobalLeaderboard(gameId, count = 5) {
    if (!firebaseReady) return [];
    try {
        const snapshot = await db.collection('leaderboard')
            .where('gameId', '==', gameId)
            .orderBy('score', 'desc')
            .limit(count).get();
        const results = [];
        let rank = 1;
        snapshot.forEach(doc => {
            const d = doc.data();
            results.push({ rank: rank++, username: d.username || 'Anonymous', score: d.score, isMe: currentUser && d.userId === currentUser.uid });
        });
        return results;
    } catch (e) { return []; }
}

async function getUserPercentile(gameId, score) {
    if (!firebaseReady || !score) return null;
    try {
        const snapshot = await db.collection('leaderboard').where('gameId', '==', gameId).get();
        const total = snapshot.size;
        if (total === 0) return null;
        let higher = 0;
        snapshot.forEach(d => { if (d.data().score > score) higher++; });
        return Math.max(1, Math.round((1 - higher/total) * 100));
    } catch (e) { return null; }
}

async function buySkin(skinId) {
    const skin = SKINS[skinId];
    if (!skin || skin.price === 0) return { success: false, error: 'Invalid skin' };
    
    const coins = parseInt(localStorage.getItem('aimtrainer_coins') || '0');
    const skins = JSON.parse(localStorage.getItem('aimtrainer_skins') || '["default"]');
    
    if (coins < skin.price) return { success: false, error: 'Not enough coins' };
    if (skins.includes(skinId)) return { success: false, error: 'Already owned' };
    
    skins.push(skinId);
    localStorage.setItem('aimtrainer_skins', JSON.stringify(skins));
    localStorage.setItem('aimtrainer_coins', coins - skin.price);
    return { success: true };
}

async function equipSkin(skinId) {
    localStorage.setItem('aimtrainer_equipped_skin', skinId);
    return { success: true };
}

async function addCoins(amount) {
    const coins = parseInt(localStorage.getItem('aimtrainer_coins') || '0');
    localStorage.setItem('aimtrainer_coins', coins + amount);
    return true;
}

function addPlayToHistory(gameId, score) {
    const data = { gameId, score, date: Date.now() };
    let history = JSON.parse(localStorage.getItem('aimtrainer_play_history') || '[]');
    history.push(data);
    if (history.length > 50) history = history.slice(-50);
    localStorage.setItem('aimtrainer_play_history', JSON.stringify(history));
    return history;
}

function getPlayHistory(gameId = null) {
    let history = JSON.parse(localStorage.getItem('aimtrainer_play_history') || '[]');
    if (gameId) history = history.filter(h => h.gameId === gameId);
    return history.slice(-20);
}

function getQuests() { 
    const referralCode = localStorage.getItem('aimtrainer_referral_code');
    const referrals = parseInt(localStorage.getItem('aimtrainer_referrals') || '0');
    const allQuests = JSON.parse(JSON.stringify(QUESTS));
    
    if (referralCode) {
        allQuests.daily.push({
            id: 'referral',
            name: 'Share & Earn',
            desc: 'Share your referral link and get coins for each sign-up!',
            target: referrals,
            reward: 50,
            claimed: false,
            isReferral: true
        });
    }
    return allQuests; 
}

function generateReferralCode() {
    const code = 'OCTO' + Math.random().toString(36).substr(2, 6).toUpperCase();
    localStorage.setItem('aimtrainer_referral_code', code);
    return code;
}

function getReferralCode() {
    let code = localStorage.getItem('aimtrainer_referral_code');
    if (!code) {
        code = generateReferralCode();
    }
    return code;
}

async function applyReferralCode(code) {
    if (!code || code.length < 6) return false;
    
    try {
        const snapshot = await db.collection('users')
            .where('referralCode', '==', code.toUpperCase())
            .limit(1).get();
        
        if (!snapshot.empty) {
            const referrerDoc = snapshot.docs[0];
            const referrerData = referrerDoc.data();
            
            const currentReferrals = referrerData.referrals || 0;
            await db.collection('users').doc(referrerDoc.id).update({
                referrals: currentReferrals + 1,
                coins: referrerData.coins + 50
            });
            return true;
        }
    } catch (e) {
        console.log('Referral code error:', e);
    }
    return false;
}

function reportBug() {
    const subject = encodeURIComponent('OctoAim Bug Report');
    const body = encodeURIComponent(
        'Describe the bug:\n\n\nSteps to reproduce:\n1. \n2. \n3. \n\nExpected behavior:\n\n\nActual behavior:\n\n\nBrowser/Device:\n'
    );
    window.location.href = 'mailto:goldenmacaroni12@gmail.com?subject=' + subject + '&body=' + body;
}

function shareReferral() {
    const code = getReferralCode();
    const link = 'https://octoaim.gamer.gd.site?ref=' + code;
    
    navigator.clipboard.writeText(link).then(function() {
        alert('Referral link copied to clipboard!\n\n' + link + '\n\nShare it with friends to earn 50 coins per sign-up!');
    }).catch(function() {
        prompt('Copy this referral link:', link);
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Make global
window.initFirebaseAuth = initFirebaseAuth;
window.signUp = signUp;
window.signIn = signIn;
window.signInWithGoogle = signInWithGoogle;
window.logOut = logOut;
window.submitGlobalScore = submitGlobalScore;
window.getGlobalLeaderboard = getGlobalLeaderboard;
window.getUserPercentile = getUserPercentile;
window.buySkin = buySkin;
window.equipSkin = equipSkin;
window.addCoins = addCoins;
window.addPlayToHistory = addPlayToHistory;
window.getPlayHistory = getPlayHistory;
window.getCurrentSkin = getCurrentSkin;
window.getQuests = getQuests;
window.getReferralCode = getReferralCode;
window.applyReferralCode = applyReferralCode;
window.reportBug = reportBug;
window.shareReferral = shareReferral;
window.SKINS = SKINS;
window.escapeHtml = escapeHtml;

console.log('Firebase Auth System loaded!');
