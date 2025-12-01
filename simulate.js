// simulate.js - Standalone battle simulation for Windows
// Run with: node simulate.js

// Configuration (same as in game_logic.js)
const DIFFICULTY_CONFIG = {
    NORMAL: { multiplier: 1.0, bossHP: 10000 },
    HARD: { multiplier: 1.5, bossHP: 15000 },
    EXTREME: { multiplier: 2.0, bossHP: 20000 },
};

const NEXT_DIFF = {
    NORMAL: 'HARD',
    HARD: 'EXTREME',
    EXTREME: null,
};

// Simple random damage generator for demo purposes
function simulateBattle(difficulty) {
    const config = DIFFICULTY_CONFIG[difficulty];
    let damage = 0;
    let bossHP = config.bossHP;
    const attacks = 20; // number of attack ticks
    for (let i = 0; i < attacks; i++) {
        // Random damage per tick (5%~15% of max HP)
        const dmg = Math.floor(config.bossHP * (0.05 + Math.random() * 0.10));
        damage += dmg;
        bossHP -= dmg;
        if (bossHP <= 0) break; // boss defeated
    }
    const damagePercent = ((damage / config.bossHP) * 100).toFixed(2);
    const finalScore = Math.floor(damage * config.multiplier);
    const bossDefeated = bossHP <= 0;
    return { damage, damagePercent, finalScore, bossDefeated, difficulty };
}

function runSimulation() {
    const difficulties = Object.keys(DIFFICULTY_CONFIG);
    for (const diff of difficulties) {
        console.log('=== Simulating difficulty:', diff, '===');
        const result = simulateBattle(diff);
        console.log('Damage:', result.damage.toLocaleString());
        console.log('Damage %:', result.damagePercent + '%');
        console.log('Multiplier:', DIFFICULTY_CONFIG[diff].multiplier);
        console.log('Final Score:', result.finalScore.toLocaleString());
        console.log('Boss Defeated:', result.bossDefeated ? 'YES' : 'NO');
        console.log('---');
    }
}

runSimulation();
