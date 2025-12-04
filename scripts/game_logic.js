// Game State
const GAME_STATE = {
    tickets: 3,
    maxTickets: 3,
    selectedDifficulty: 'NORMAL', // Default to NORMAL
    scores: {
        NORMAL: 1234567,  // Has personal best
        HARD: 2500000,    // Has personal best
        INSANE: 0,        // Not cleared yet
        EXTREME: 0        // Not cleared yet
    },
    unlocked: {
        NORMAL: true,
        HARD: true,       // Now unlocked for demo
        INSANE: false,
        EXTREME: false
    },
    // Mock data for "Personal Best" display
    personalBest: 12450999,
    rank: 42
};

// Config
const DIFFICULTY_CONFIG = {
    NORMAL: { recPower: 10000, multiplier: 1.0, traits: ['無特殊屬性', '標準防禦'] },
    HARD: { recPower: 35000, multiplier: 1.5, traits: ['攻擊力 UP', '防禦力 UP'] },
    INSANE: { recPower: 80000, multiplier: 2.5, revive: true, traits: ['復活 (積分戰)', '物理抗性 UP'] },
    EXTREME: { recPower: 150000, multiplier: 4.0, locked: true, traits: ['即死攻擊', '魔法免疫'] }
};

const NEXT_DIFF = {
    'NORMAL': 'HARD',
    'HARD': 'INSANE',
    'INSANE': 'EXTREME',
    'EXTREME': null
};

// Helper Functions
function getRewardsForDifficulty(diffKey) {
    const rewardMap = {
        'NORMAL': ['金幣 x500', '經驗 x200'],
        'HARD': ['金幣 x1,500', '經驗 x600'],
        'INSANE': ['金幣 x5,000', '經驗 x2,000'],
        'EXTREME': ['金幣 x15,000', '經驗 x10,000']
    };
    return rewardMap[diffKey] || ['金幣 x500', '經驗 x200'];
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    initGame();
});

function initGame() {
    updateTicketUI();
    updateMainScreenUI();
    renderDifficultyList();
    selectDifficulty('NORMAL'); // Select default
}

// UI Updates
function updateTicketUI() {
    const ticketCount = document.getElementById('ticket-count');
    if (ticketCount) {
        ticketCount.textContent = GAME_STATE.tickets;
    }
}

function updateMainScreenUI() {
    // Update Personal Best on main screen
    const pbElement = document.querySelector('.leaderboard-entry .font-data');
    if (pbElement) {
        pbElement.textContent = GAME_STATE.personalBest.toLocaleString();
    }
    const rankElement = document.querySelector('.leaderboard-entry .text-grey');
    if (rankElement) {
        rankElement.textContent = `RANK: #${GAME_STATE.rank}`;
    }
}

const DIFFICULTY_ORDER = ['NORMAL', 'HARD', 'INSANE', 'EXTREME'];

function renderDifficultyList() {
    // Deprecated: Old list renderer.
    // New UI uses Carousel, updated via selectDifficulty directly.
    updateCarouselUI();
}

function prevDifficulty() {
    const currentIndex = DIFFICULTY_ORDER.indexOf(GAME_STATE.selectedDifficulty);
    const prevIndex = (currentIndex - 1 + DIFFICULTY_ORDER.length) % DIFFICULTY_ORDER.length;
    selectDifficulty(DIFFICULTY_ORDER[prevIndex]);
}

function nextDifficulty() {
    const currentIndex = DIFFICULTY_ORDER.indexOf(GAME_STATE.selectedDifficulty);
    const nextIndex = (currentIndex + 1) % DIFFICULTY_ORDER.length;
    selectDifficulty(DIFFICULTY_ORDER[nextIndex]);
}

function selectDifficulty(diffKey) {
    // Allow selection even if locked, just show locked state in UI? 
    // Or prevent selection? The wireframe implies we can see "Recommended Power" so maybe we can select it.
    // Let's allow selection but disable "Enter" if locked.

    GAME_STATE.selectedDifficulty = diffKey;
    updateCarouselUI();

    // Update Boss Tags
    const config = DIFFICULTY_CONFIG[diffKey];
    const traits = config.traits || [];
    const traitDisplay = document.getElementById('boss-trait-display');
    if (traitDisplay) {
        traitDisplay.textContent = traits.join(' / ');
    }
}

function updateCarouselUI() {
    const diffKey = GAME_STATE.selectedDifficulty;
    const config = DIFFICULTY_CONFIG[diffKey];
    const isUnlocked = GAME_STATE.unlocked[diffKey];
    const bestScore = GAME_STATE.scores[diffKey];

    // Update difficulty name
    const nameEl = document.getElementById('carousel-diff-name');
    if (nameEl) nameEl.textContent = diffKey;

    // Update recommended power
    const powerEl = document.getElementById('carousel-rec-power');
    if (powerEl) {
        powerEl.textContent = config.recPower.toLocaleString();
    }

    // Show/hide locked overlay
    const lockedOverlay = document.getElementById('diff-locked-overlay');
    if (lockedOverlay) {
        lockedOverlay.style.display = isUnlocked ? 'none' : 'flex';
    }

    // Show/hide best score (using visibility to maintain layout)
    const bestScoreValueEl = document.getElementById('carousel-best-score-value');
    if (bestScoreValueEl) {
        if (bestScore > 0) {
            bestScoreValueEl.style.visibility = 'visible';
            bestScoreValueEl.textContent = bestScore.toLocaleString();
        } else {
            bestScoreValueEl.style.visibility = 'hidden';
            bestScoreValueEl.textContent = '---';
        }
    }

    // Update rewards based on difficulty
    const reward1El = document.getElementById('carousel-reward-1');
    const reward2El = document.getElementById('carousel-reward-2');
    const rewards = getRewardsForDifficulty(diffKey);
    if (reward1El) reward1El.textContent = rewards[0];
    if (reward2El) reward2El.textContent = rewards[1];
}

function updateActionButton() {
    const btnSweep = document.getElementById('btn-sweep');
    const btnEnter = document.getElementById('btn-enter');
    const diffKey = GAME_STATE.selectedDifficulty;
    const isUnlocked = GAME_STATE.unlocked[diffKey];
    const hasScore = GAME_STATE.scores[diffKey] > 0;

    // Enter Button: Disable if locked
    if (btnEnter) {
        if (isUnlocked) {
            btnEnter.style.opacity = '1';
            btnEnter.style.pointerEvents = 'all';
            btnEnter.style.borderColor = '#262';
            btnEnter.style.color = '#262';
        } else {
            btnEnter.style.opacity = '0.5';
            btnEnter.style.pointerEvents = 'none';
            btnEnter.style.borderColor = '#999';
            btnEnter.style.color = '#999';
        }
    }

    // Sweep Button: Show only if cleared
    if (btnSweep) {
        if (hasScore && isUnlocked) {
            btnSweep.style.opacity = '1';
            btnSweep.style.pointerEvents = 'all';
        } else {
            btnSweep.style.opacity = '0.3';
            btnSweep.style.pointerEvents = 'none';
        }
    }
}

// ... existing functions ...

// Expose functions to global scope for HTML onclick
window.selectDifficulty = selectDifficulty;
window.prevDifficulty = prevDifficulty;
window.nextDifficulty = nextDifficulty;
window.openTeamFormation = openTeamFormation;
window.goBack = goBack;
window.goHome = goHome;
window.startBattle = startBattle;
window.sweep = sweep;
window.endBattleSimulation = endBattleSimulation;
window.closeResult = closeResult;
window.openLeaderboard = openLeaderboard;
window.closeLeaderboard = closeLeaderboard;
window.handleMainAction = handleMainAction;
window.openBossDetail = openBossDetail;
window.closeBossDetail = closeBossDetail;
window.handleSweepAction = handleSweepAction;

function handleSweepAction() {
    const diffKey = GAME_STATE.selectedDifficulty;
    sweep(diffKey);
}

function handleMainAction() {
    // Deprecated, kept for safety
    openTeamFormation();
}

// Boss Skills Data
const BOSS_SKILLS = {
    NORMAL: [
        { name: '重擊', level: 1, type: '主動', cd: '5s', range: '3m', desc: '對前方單體造成 150% 物理傷害。' },
        { name: '怒吼', level: 1, type: '被動', cd: '-', range: '-', desc: '戰鬥開始時，提升自身攻擊力 10%。' }
    ],
    HARD: [
        { name: '重擊 II', level: 3, type: '主動', cd: '5s', range: '3m', desc: '對前方單體造成 200% 物理傷害，並附加暈眩 1 秒。' },
        { name: '震地波', level: 2, type: '主動', cd: '12s', range: '8m', desc: '對周圍造成 120% 範圍傷害，並降低目標防禦力。' },
        { name: '怒吼 II', level: 3, type: '被動', cd: '-', range: '-', desc: '戰鬥開始時，提升自身攻擊力 20%。' }
    ],
    INSANE: [
        { name: '毀滅打擊', level: 5, type: '奧義', cd: '20s', range: 'Global', desc: '對全體敵人造成 300% 真實傷害，若目標血量低於 30% 則直接斬殺。' },
        { name: '不死之身', level: 5, type: '被動', cd: '60s', range: '-', desc: '受到致命傷害時，免疫死亡並恢復 50% 血量 (每場戰鬥限一次)。' },
        { name: '恐懼靈氣', level: 4, type: '被動', cd: '-', range: '10m', desc: '周圍敵人攻擊速度降低 30%。' },
        { name: '連擊', level: 4, type: '主動', cd: '8s', range: '3m', desc: '快速進行 3 次攻擊，每次造成 80% 傷害。' }
    ],
    EXTREME: [
        { name: '虛空吞噬', level: 'MAX', type: '奧義', cd: '30s', range: 'Global', desc: '吞噬場上所有召喚物，每吞噬一個恢復 10% 血量並提升 5% 全屬性。' },
        { name: '維度崩壞', level: 'MAX', type: '主動', cd: '15s', range: '15m', desc: '製造黑洞，持續牽引敵人並每秒造成 100% 魔法傷害。' },
        { name: '神性護盾', level: 'MAX', type: '被動', cd: '20s', range: '-', desc: '每 20 秒獲得一個吸收 500% 攻擊力傷害的護盾，護盾存在時免疫控制。' },
        { name: '終焉時刻', level: 'MAX', type: '被動', cd: '-', range: '-', desc: '戰鬥時間超過 180 秒後，每秒對全體敵人造成 10% 最大生命值的真實傷害。' }
    ]
};

let currentSelectedSkillIndex = 0;

function openBossDetail() {
    const modal = document.getElementById('boss-detail-modal');
    modal.style.opacity = '1';
    modal.style.pointerEvents = 'all';

    const diff = GAME_STATE.selectedDifficulty || 'NORMAL';
    document.getElementById('modal-diff-display').textContent = diff;

    // Populate Skills
    renderBossSkills(diff);
}

function modalPrevDifficulty() {
    const currentIndex = DIFFICULTY_ORDER.indexOf(GAME_STATE.selectedDifficulty);
    const prevIndex = (currentIndex - 1 + DIFFICULTY_ORDER.length) % DIFFICULTY_ORDER.length;
    const newDiff = DIFFICULTY_ORDER[prevIndex];

    GAME_STATE.selectedDifficulty = newDiff;
    document.getElementById('modal-diff-display').textContent = newDiff;
    renderBossSkills(newDiff);
}

function modalNextDifficulty() {
    const currentIndex = DIFFICULTY_ORDER.indexOf(GAME_STATE.selectedDifficulty);
    const nextIndex = (currentIndex + 1) % DIFFICULTY_ORDER.length;
    const newDiff = DIFFICULTY_ORDER[nextIndex];

    GAME_STATE.selectedDifficulty = newDiff;
    document.getElementById('modal-diff-display').textContent = newDiff;
    renderBossSkills(newDiff);
}

function renderBossSkills(diff) {
    const skills = BOSS_SKILLS[diff] || BOSS_SKILLS['NORMAL'];
    const container = document.getElementById('modal-skill-icons');
    container.innerHTML = '';

    skills.forEach((skill, index) => {
        const icon = document.createElement('div');
        icon.className = `skill-icon ${index === 0 ? 'selected' : ''}`;
        icon.style.cssText = `
            width: 60px; height: 60px; background: #222; border: 1px solid #444; position: relative; cursor: pointer;
            ${index === 0 ? 'border: 2px solid var(--color-accent-gold); background: #333;' : ''}
        `;
        icon.innerHTML = `<div style="position: absolute; bottom: 0; right: 0; background: #000; font-size: 0.7rem; padding: 0 4px;">Lv.${skill.level}</div>`;

        icon.onclick = () => selectBossSkill(index, diff);
        container.appendChild(icon);
    });

    // Select first skill by default
    selectBossSkill(0, diff);
}

function selectBossSkill(index, diff) {
    const skills = BOSS_SKILLS[diff] || BOSS_SKILLS['NORMAL'];
    const skill = skills[index];
    if (!skill) return;

    // Update Icons UI
    const icons = document.querySelectorAll('#modal-skill-icons .skill-icon');
    icons.forEach((icon, i) => {
        if (i === index) {
            icon.style.border = '2px solid var(--color-accent-gold)';
            icon.style.background = '#333';
            icon.classList.add('selected');
        } else {
            icon.style.border = '1px solid #444';
            icon.style.background = '#222';
            icon.classList.remove('selected');
        }
    });

    // Update Info UI
    document.getElementById('modal-skill-level').textContent = `Lv.${skill.level}`;
    document.getElementById('modal-skill-name').textContent = skill.name;

    document.getElementById('modal-skill-tag-type').textContent = skill.type;
    document.getElementById('modal-skill-tag-cd').textContent = `冷卻 ${skill.cd}`;
    document.getElementById('modal-skill-tag-range').textContent = `距離 ${skill.range}`;

    document.getElementById('modal-skill-desc').innerHTML = skill.desc;
}

function closeBossDetail() {
    document.getElementById('boss-detail-modal').style.opacity = '0';
    document.getElementById('boss-detail-modal').style.pointerEvents = 'none';
}

function openTeamFormation() {
    if (GAME_STATE.tickets <= 0) {
        alert("票券不足");
        return;
    }
    document.getElementById('team-screen').style.transform = 'translateX(0)';
}

function startBattle() {
    if (GAME_STATE.tickets > 0) {
        GAME_STATE.tickets--;
        updateTicketUI();

        // Show Battle Screen
        document.getElementById('battle-screen').style.transform = 'translateY(0)';

        // Initialize Battle State
        BATTLE_STATE.hp = 100;
        BATTLE_STATE.damage = 0;
        BATTLE_STATE.timer = 1.0; // Accelerated
        BATTLE_STATE.isRunning = true;

        // Start Loop
        BATTLE_STATE.interval = setInterval(gameLoop, 100);
    } else {
        alert("票券不足");
    }
}

// Battle State
const BATTLE_STATE = {
    hp: 100,
    damage: 0,
    timer: 180,
    isRunning: false,
    interval: null
};

function gameLoop() {
    if (!BATTLE_STATE.isRunning) return;

    // Simulate Damage
    const dps = (Math.random() * 50000 + 10000) * 180;
    BATTLE_STATE.damage += dps;

    // Simulate HP Drop
    const hpDrop = dps / 1000000;
    BATTLE_STATE.hp -= hpDrop;

    // Revive Logic
    if (BATTLE_STATE.hp <= 0) {
        if (GAME_STATE.selectedDifficulty === 'INSANE') {
            BATTLE_STATE.hp = 100;
        } else {
            BATTLE_STATE.hp = 0;
            endBattleSimulation(true);
        }
    }

    // Timer
    BATTLE_STATE.timer -= 0.1;
    if (BATTLE_STATE.timer <= 0) {
        endBattleSimulation(false);
    }

    updateBattleUI();
}

function updateBattleUI() {
    const minutes = Math.floor(BATTLE_STATE.timer / 60);
    const seconds = Math.floor(BATTLE_STATE.timer % 60);
    document.getElementById('battle-timer').textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    document.getElementById('boss-hp-bar').style.width = `${Math.max(0, BATTLE_STATE.hp)}%`;
    document.getElementById('boss-hp-text').textContent = `${Math.max(0, BATTLE_STATE.hp).toFixed(2)}%`;

    document.getElementById('damage-accumulator').textContent = Math.floor(BATTLE_STATE.damage).toLocaleString();

    const multiplier = DIFFICULTY_CONFIG[GAME_STATE.selectedDifficulty || 'NORMAL'].multiplier;
    const score = Math.floor(BATTLE_STATE.damage * multiplier);
    document.getElementById('damage-percent').textContent = `積分: ${score.toLocaleString()}`;
}

function endBattleSimulation(isVictory) {
    clearInterval(BATTLE_STATE.interval);
    BATTLE_STATE.isRunning = false;

    document.getElementById('battle-screen').style.transform = 'translateY(100%)';

    const currentDiff = GAME_STATE.selectedDifficulty || 'NORMAL';
    const multiplier = DIFFICULTY_CONFIG[currentDiff].multiplier;
    const bossMaxHP = DIFFICULTY_CONFIG[currentDiff].bossHP;

    // Calculate damage percentage
    const damagePercent = (BATTLE_STATE.damage / bossMaxHP) * 100;
    const finalScore = Math.floor(BATTLE_STATE.damage * multiplier);

    // Check if boss was defeated (HP reached 0)
    const bossDefeated = BATTLE_STATE.bossHP <= 0;

    // Check if new record
    const isNewRecord = finalScore > (GAME_STATE.scores[currentDiff] || 0);

    const resultScreen = document.getElementById('result-screen');
    resultScreen.style.opacity = '1';
    resultScreen.style.transform = 'scale(1)';
    resultScreen.style.pointerEvents = 'all';

    // Update dynamic title based on boss defeated status
    const resultTitle = document.getElementById('result-title');
    const resultSubtitle = document.getElementById('result-subtitle');
    const bossDefeatedExtra = document.getElementById('boss-defeated-extra');

    if (bossDefeated) {
        resultTitle.textContent = '討伐完成';
        resultSubtitle.textContent = 'MISSION ACCOMPLISHED';
        bossDefeatedExtra.style.display = 'block';
    } else {
        resultTitle.textContent = '行動結束';
        resultSubtitle.textContent = 'OPERATION COMPLETE';
        bossDefeatedExtra.style.display = 'none';
    }

    // Update score calculation elements
    document.getElementById('result-damage-percent').textContent = damagePercent.toFixed(2) + '%';
    document.getElementById('result-multiplier').textContent = 'x ' + multiplier.toFixed(1);
    document.getElementById('result-raid-score').textContent = finalScore.toLocaleString();

    // Show/hide new record indicator
    const newRecordIndicator = document.getElementById('new-record-indicator');
    if (isNewRecord) {
        newRecordIndicator.style.display = 'block';
    } else {
        newRecordIndicator.style.display = 'none';
    }

    // Update total score (add to existing)
    const oldTotalScore = GAME_STATE.personalBest || 0;
    const newTotalScore = oldTotalScore + finalScore;
    document.getElementById('result-total-score').textContent = newTotalScore.toLocaleString();

    // Update rank (placeholder - would need actual ranking logic)
    document.getElementById('result-rank').textContent = '#42';

    // Update rank change indicator (placeholder)
    const rankChange = document.getElementById('rank-change');
    rankChange.style.display = 'none'; // Hide for now

    if (finalScore > GAME_STATE.scores[currentDiff]) {
        GAME_STATE.scores[currentDiff] = finalScore;

        // Unlock next difficulty
        const nextDiff = NEXT_DIFF[currentDiff];
        if (nextDiff && !GAME_STATE.unlocked[nextDiff]) {
            GAME_STATE.unlocked[nextDiff] = true;
            // Optional: Notify user of unlock?
        }

        renderDifficultyList();
        updateActionButton();

        if (finalScore > GAME_STATE.personalBest) {
            GAME_STATE.personalBest = finalScore;
            updateMainScreenUI();
        }
    }
}

function sweep(diffKey) {
    if (GAME_STATE.tickets <= 0) {
        alert("票券不足");
        return;
    }

    if (!GAME_STATE.scores[diffKey]) {
        alert("無此難度通關記錄");
        return;
    }

    if (confirm(`掃蕩 ${diffKey}? \n消耗: 1 票券\n將獲得最高紀錄分數: ${GAME_STATE.scores[diffKey].toLocaleString()}`)) {
        GAME_STATE.tickets--;
        updateTicketUI();
        alert(`掃蕩完成！ \n獲得積分: ${GAME_STATE.scores[diffKey].toLocaleString()}`);
    }
}


function closeResult() {
    const resultScreen = document.getElementById('result-screen');
    resultScreen.style.opacity = '0';
    resultScreen.style.transform = 'scale(0.9)';
    resultScreen.style.pointerEvents = 'none';

    // Also close team formation screen to return to main screen
    const teamScreen = document.getElementById('team-screen');
    if (teamScreen) {
        teamScreen.style.transform = 'translateX(100%)';
    }

    // Check if tickets are depleted
    if (GAME_STATE.tickets <= 0) {
        showEventEndedLobby();
    }
}

// Leaderboard Data
const LEADERBOARD_DATA = [
    { rank: 1, name: '玩家_ONE', level: 85, score: 99999999, avatar: 'assets/avatar_placeholder.png', team: [1, 1, 1, 1] },
    { rank: 2, name: '玩家_TWO', level: 82, score: 88500000, avatar: 'assets/avatar_placeholder.png', team: [2, 2, 1, 1] },
    { rank: 3, name: '玩家_THREE', level: 79, score: 75200000, avatar: 'assets/avatar_placeholder.png', team: [3, 2, 2, 1] },
    { rank: 4, name: '玩家_FOUR', level: 80, score: 65000000, avatar: 'assets/avatar_placeholder.png', team: [1, 2, 3, 1] },
    { rank: 5, name: '玩家_FIVE', level: 78, score: 58000000, avatar: 'assets/avatar_placeholder.png', team: [2, 1, 1, 3] },
    { rank: 6, name: '玩家_SIX', level: 76, score: 50000000, avatar: 'assets/avatar_placeholder.png', team: [3, 3, 2, 2] },
    { rank: 7, name: '玩家_SEVEN', level: 75, score: 45000000, avatar: 'assets/avatar_placeholder.png', team: [1, 1, 2, 2] },
    { rank: 8, name: '玩家_EIGHT', level: 77, score: 40000000, avatar: 'assets/avatar_placeholder.png', team: [2, 2, 3, 3] },
    { rank: 9, name: '玩家_NINE', level: 74, score: 35000000, avatar: 'assets/avatar_placeholder.png', team: [3, 1, 1, 1] },
    { rank: 10, name: '玩家_TEN', level: 73, score: 30000000, avatar: 'assets/avatar_placeholder.png', team: [1, 2, 2, 1] },
    { rank: 11, name: '玩家_ELEVEN', level: 72, score: 28000000, avatar: 'assets/avatar_placeholder.png', team: [2, 3, 1, 2] },
    { rank: 12, name: '玩家_TWELVE', level: 71, score: 26000000, avatar: 'assets/avatar_placeholder.png', team: [3, 1, 3, 3] },
    { rank: 13, name: '玩家_THIRTEEN', level: 70, score: 24000000, avatar: 'assets/avatar_placeholder.png', team: [1, 2, 1, 1] },
    { rank: 14, name: '玩家_FOURTEEN', level: 69, score: 22000000, avatar: 'assets/avatar_placeholder.png', team: [2, 3, 2, 2] },
    { rank: 15, name: '玩家_FIFTEEN', level: 68, score: 20000000, avatar: 'assets/avatar_placeholder.png', team: [3, 1, 3, 1] },
    { rank: 16, name: '玩家_SIXTEEN', level: 67, score: 18000000, avatar: 'assets/avatar_placeholder.png', team: [1, 2, 1, 2] },
    { rank: 17, name: '玩家_SEVENTEEN', level: 66, score: 16000000, avatar: 'assets/avatar_placeholder.png', team: [2, 3, 2, 3] },
    { rank: 18, name: '玩家_EIGHTEEN', level: 65, score: 15000000, avatar: 'assets/avatar_placeholder.png', team: [3, 1, 3, 2] },
    { rank: 19, name: '玩家_NINETEEN', level: 64, score: 14000000, avatar: 'assets/avatar_placeholder.png', team: [1, 2, 1, 3] },
    { rank: 20, name: '玩家_TWENTY', level: 63, score: 13000000, avatar: 'assets/avatar_placeholder.png', team: [2, 3, 2, 1] },
    { rank: 42, name: 'Daniel', level: 85, score: 12450999, avatar: 'assets/avatar_placeholder.png', isMe: true, team: [1, 1, 1, 1] },
];

// Reward Data
const RANK_REWARDS = [
    { rank: '1', rewards: ['鑽石 x5000', '傳說裝備箱 x1', '專屬稱號'] },
    { rank: '2-3', rewards: ['鑽石 x3000', '史詩裝備箱 x1'] },
    { rank: '4-10', rewards: ['鑽石 x1500', '稀有裝備箱 x1'] },
    { rank: '11-50', rewards: ['鑽石 x800', '金幣 x100,000'] },
    { rank: '51-100', rewards: ['鑽石 x500', '金幣 x50,000'] },
    { rank: '101+', rewards: ['金幣 x20,000'] }
];

const SCORE_REWARDS = [
    { score: 100000, rewards: ['金幣 x10,000'], claimed: true },
    { score: 500000, rewards: ['鑽石 x100'], claimed: true },
    { score: 1000000, rewards: ['高級召喚券 x1'], claimed: true },
    { score: 5000000, rewards: ['史詩強化石 x5'], claimed: false },
    { score: 10000000, rewards: ['傳說裝備碎片 x10'], claimed: false },
    { score: 50000000, rewards: ['專屬頭像框'], claimed: false }
];

// Render Leaderboard
function renderLeaderboard() {
    const listContainer = document.getElementById('leaderboard-list');
    if (!listContainer) return;

    listContainer.innerHTML = '';

    LEADERBOARD_DATA.forEach(player => {
        const item = document.createElement('div');
        item.className = 'rank-item chamfered-right';

        // Special styles for top 3
        if (player.rank === 1) item.classList.add('rank-1');
        if (player.rank === 2) item.classList.add('rank-2');
        if (player.rank === 3) item.classList.add('rank-3');
        if (player.isMe) item.classList.add('is-me');

        item.innerHTML = `
            <div class="rank-badge font-header" style="font-size: 1.5rem; font-weight: bold; min-width: 40px; text-align: center;">${String(player.rank).padStart(2, '0')}</div>
            <div class="avatar-container" style="width: 48px; height: 48px; border-radius: 50%; overflow: hidden; border: 2px solid #444; background: #333;">
                <img src="${player.avatar}" alt="${player.name}" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <div class="player-info" style="flex: 1;">
                <div class="player-name font-header" style="font-size: 1rem; color: #fff;">${player.name}</div>
                <div class="player-level font-data text-grey" style="font-size: 0.8rem;">LV. ${player.level}</div>
            </div>
            <div style="display: flex; align-items: center; gap: 10px;">
                <div class="player-score font-data text-gold" style="font-size: 1.2rem;">${player.score.toLocaleString()}</div>
                <div class="btn-inspect chamfered" onclick="openTeamDetail(${player.rank})">
                    <span>🔍</span>
                </div>
            </div>
        `;

        // Item styles
        item.style.cssText += `
            display: flex;
            align-items: center;
            gap: 15px;
            padding: 15px;
            background: #1a1a1a;
            border-left: 4px solid transparent;
        `;

        // Rank-specific coloring
        if (player.rank === 1) {
            item.style.background = '#2a2416';
            item.style.borderLeftColor = 'var(--color-accent-gold)';
            item.querySelector('.rank-badge').style.color = 'var(--color-accent-gold)';
        } else if (player.rank === 2) {
            item.style.background = '#1f1f21';
            item.style.borderLeftColor = '#ccc';
            item.querySelector('.rank-badge').style.color = '#ccc';
        } else if (player.rank === 3) {
            item.style.background = '#241e1a';
            item.style.borderLeftColor = '#cd7f32';
            item.querySelector('.rank-badge').style.color = '#cd7f32';
        } else {
            item.querySelector('.rank-badge').style.color = '#999';
        }

        // Highlight player's own rank
        if (player.isMe) {
            item.style.background = 'rgba(200, 160, 80, 0.15)';
            item.style.border = '2px solid var(--color-accent-gold)';
            item.style.borderLeft = '4px solid var(--color-accent-gold)';
        }

        listContainer.appendChild(item);
    });

    updatePlayerRankFixed();
}

// Update fixed player rank info at bottom
function updatePlayerRankFixed() {
    const myData = LEADERBOARD_DATA.find(p => p.isMe);
    if (!myData) return;

    const fixedArea = document.querySelector('.player-rank-fixed');
    if (!fixedArea) return;

    const rankBadge = fixedArea.querySelector('.rank-badge');
    const playerName = fixedArea.querySelector('.player-name');
    const playerLevel = fixedArea.querySelector('.player-level');
    const playerScore = fixedArea.querySelector('.player-score');
    const avatarImg = fixedArea.querySelector('.avatar-container img');

    if (rankBadge) rankBadge.textContent = String(myData.rank).padStart(2, '0');
    if (playerName) playerName.textContent = myData.name;
    if (playerLevel) playerLevel.textContent = `LV. ${myData.level}`;
    if (playerScore) playerScore.textContent = myData.score.toLocaleString();
    if (avatarImg) avatarImg.src = myData.avatar;
}

function openLeaderboard() {
    renderLeaderboard();
    document.getElementById('leaderboard-panel').style.transform = 'translateX(0)';
}

function closeLeaderboard() {
    document.getElementById('leaderboard-panel').style.transform = 'translateX(100%)';
}

// Navigation
function goBack() {
    const teamScreen = document.getElementById('team-screen');
    // Check if team screen is open
    if (teamScreen.style.transform === 'translateX(0px)' || teamScreen.style.transform === 'translateX(0)') {
        teamScreen.style.transform = 'translateX(100%)';
        return;
    }

    // Check if leaderboard is open
    const leaderboard = document.getElementById('leaderboard-panel');
    if (leaderboard.style.transform === 'translateX(0px)' || leaderboard.style.transform === 'translateX(0)') {
        closeLeaderboard();
        return;
    }
}

function goHome() {
    document.getElementById('team-screen').style.transform = 'translateX(100%)';
    closeLeaderboard();
    closeResult();
    closeTeamDetail();
    closeRewardModal();
}

// --- New Features Logic ---

// Team Detail
function openTeamDetail(rank) {
    const player = LEADERBOARD_DATA.find(p => p.rank === rank);
    if (!player) return;

    const modal = document.getElementById('team-detail-modal');
    const nameEl = document.getElementById('team-detail-player-name');
    const slotsContainer = document.querySelector('.team-slots-readonly');

    nameEl.textContent = player.name;
    modal.style.opacity = '1';
    modal.style.pointerEvents = 'all';

    // Generate Team Slots (Mock)
    slotsContainer.innerHTML = '';
    const teamConfig = player.team || [1, 1, 1, 1]; // Default mock

    teamConfig.forEach(type => {
        const group = document.createElement('div');
        group.className = 'slot-group';
        group.innerHTML = `
            <div class="main-slot chamfered"></div>
            <div style="display: flex; gap: 5px;">
                <div class="sub-slot"></div>
                <div class="sub-slot"></div>
            </div>
        `;
        slotsContainer.appendChild(group);
    });
}

function closeTeamDetail() {
    const modal = document.getElementById('team-detail-modal');
    modal.style.opacity = '0';
    modal.style.pointerEvents = 'none';
}

// Reward Modal
function openRewardModal() {
    const modal = document.getElementById('reward-modal');
    modal.style.opacity = '1';
    modal.style.pointerEvents = 'all';
    switchRewardTab('rank'); // Default to rank
}

function closeRewardModal() {
    const modal = document.getElementById('reward-modal');
    modal.style.opacity = '0';
    modal.style.pointerEvents = 'none';
}

function switchRewardTab(tab) {
    const rankTab = document.getElementById('tab-rank-reward');
    const scoreTab = document.getElementById('tab-score-reward');
    const rankList = document.getElementById('rank-reward-list');
    const scoreList = document.getElementById('score-reward-list');

    if (tab === 'rank') {
        rankTab.classList.add('active');
        scoreTab.classList.remove('active');
        rankList.style.display = 'flex';
        scoreList.style.display = 'none';
        renderRankRewards();
    } else {
        rankTab.classList.remove('active');
        scoreTab.classList.add('active');
        rankList.style.display = 'none';
        scoreList.style.display = 'flex';
        renderScoreRewards();
    }
}

function renderRankRewards() {
    const container = document.getElementById('rank-reward-list');
    container.innerHTML = '';

    RANK_REWARDS.forEach(item => {
        const el = document.createElement('div');
        el.className = 'reward-item chamfered';

        let rewardsHtml = item.rewards.map(r => `<div class="reward-pill chamfered">${r}</div>`).join('');

        el.innerHTML = `
            <div class="reward-rank-badge font-header">${item.rank}</div>
            <div class="reward-content">
                ${rewardsHtml}
            </div>
        `;
        container.appendChild(el);
    });
}

function renderScoreRewards() {
    const container = document.getElementById('score-reward-list');
    container.innerHTML = '';

    SCORE_REWARDS.forEach(item => {
        const el = document.createElement('div');
        el.className = `reward-item chamfered ${item.claimed ? 'claimed' : ''}`;

        let rewardsHtml = item.rewards.map(r => `<div class="reward-pill chamfered">${r}</div>`).join('');
        let btnHtml = item.claimed
            ? `<div class="font-data text-grey" style="font-size: 0.8rem;">已領取</div>`
            : `<div class="font-data text-gold" style="font-size: 0.8rem;">未達成</div>`;

        // If score reached but not claimed (mock logic: if score < personalBest)
        if (!item.claimed && GAME_STATE.personalBest >= item.score) {
            btnHtml = `<div class="font-data text-gold" style="font-size: 0.8rem;">可領取</div>`;
        }

        el.innerHTML = `
            <div class="score-milestone">${item.score.toLocaleString()}</div>
            <div class="reward-content">
                ${rewardsHtml}
            </div>
            ${btnHtml}
        `;
        container.appendChild(el);
    });
}

function claimAllRewards() {
    alert('已領取所有可獲得獎勵！');
}

// Event Ended Lobby Logic
function showEventEndedLobby() {
    // Hide main screen content
    const mainScreen = document.getElementById('main-screen');
    if (mainScreen) mainScreen.style.display = 'none';

    // Show event ended lobby
    const lobby = document.getElementById('event-ended-lobby');
    if (!lobby) return;

    lobby.style.display = 'block';

    // Update data
    const totalScoreEl = document.getElementById('final-total-score');
    const rankEl = document.getElementById('final-rank');
    const rankTierEl = document.getElementById('final-rank-tier');

    // Use personal best score
    if (totalScoreEl) {
        // Animate score count up
        animateValue(totalScoreEl, 0, GAME_STATE.personalBest, 1500);
    }

    // Use mock rank or calculate (here we use a fixed mock rank for demo)
    const mockRank = 2572;
    if (rankEl) rankEl.textContent = mockRank.toLocaleString();

    if (rankTierEl) {
        rankTierEl.textContent = "2501-3000 名";
    }

    // Fade in
    setTimeout(() => {
        lobby.style.opacity = '1';
    }, 50);
}

function hideEventEndedLobby() {
    const lobby = document.getElementById('event-ended-lobby');
    if (lobby) {
        lobby.style.opacity = '0';
        setTimeout(() => {
            lobby.style.display = 'none';
            // Show main screen again
            const mainScreen = document.getElementById('main-screen');
            if (mainScreen) mainScreen.style.display = 'block';
        }, 300);
    }
}

// Helper for score animation
function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start).toLocaleString();
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Expose functions to global scope for HTML onclick
window.selectDifficulty = selectDifficulty;
window.prevDifficulty = prevDifficulty;
window.nextDifficulty = nextDifficulty;
window.openTeamFormation = openTeamFormation;
window.goBack = goBack;
window.goHome = goHome;
window.startBattle = startBattle;
window.sweep = sweep;
window.endBattleSimulation = endBattleSimulation;
window.closeResult = closeResult;
window.openLeaderboard = openLeaderboard;
window.closeLeaderboard = closeLeaderboard;
window.handleMainAction = handleMainAction;
window.openBossDetail = openBossDetail;
window.closeBossDetail = closeBossDetail;
window.handleSweepAction = handleSweepAction;
window.modalPrevDifficulty = modalPrevDifficulty;
window.modalNextDifficulty = modalNextDifficulty;
window.openTeamDetail = openTeamDetail;
window.closeTeamDetail = closeTeamDetail;
window.openRewardModal = openRewardModal;
window.closeRewardModal = closeRewardModal;
window.switchRewardTab = switchRewardTab;
window.claimAllRewards = claimAllRewards;
window.showEventEndedLobby = showEventEndedLobby;
window.hideEventEndedLobby = hideEventEndedLobby;

// Placeholder function for closeTeamRecord (if team-record-modal exists)
function closeTeamRecord() {
    const modal = document.getElementById('team-record-modal');
    if (modal) {
        modal.style.opacity = '0';
        modal.style.pointerEvents = 'none';
    }
}
window.closeTeamRecord = closeTeamRecord;
