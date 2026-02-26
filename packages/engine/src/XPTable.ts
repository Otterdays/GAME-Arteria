/**
 * XP Table — maps levels to cumulative XP requirements.
 *
 * Uses the classic RuneScape-style exponential curve:
 *   XP(level) = floor( sum_{i=1}^{level-1} floor(i + 300 * 2^(i/7)) / 4 )
 *
 * Level 1 = 0 XP, Level 2 = 83 XP ... Level 99 = ~13,034,431 XP.
 */

const MAX_LEVEL = 99;
const xpTable: number[] = [];

function buildXPTable(): void {
    xpTable.length = 0;
    xpTable.push(0); // Level 1 requires 0 XP

    let cumulative = 0;
    for (let lvl = 1; lvl < MAX_LEVEL; lvl++) {
        cumulative += Math.floor(lvl + 300 * Math.pow(2, lvl / 7)) / 4;
        xpTable.push(Math.floor(cumulative));
    }
}

// Build the table at module load
buildXPTable();

export const XPTable = {
    /**
     * Get the total XP required to reach a given level.
     * @param level - target level (1–99)
     */
    xpForLevel(level: number): number {
        if (level <= 1) return 0;
        if (level > MAX_LEVEL) return xpTable[MAX_LEVEL - 1];
        return xpTable[level - 1];
    },

    /**
     * Given a total XP value, determine the current level.
     */
    levelForXP(xp: number): number {
        for (let lvl = MAX_LEVEL; lvl >= 1; lvl--) {
            if (xp >= xpTable[lvl - 1]) return lvl;
        }
        return 1;
    },

    /**
     * XP remaining to reach the next level.
     */
    xpToNextLevel(currentXP: number): number {
        const currentLevel = XPTable.levelForXP(currentXP);
        if (currentLevel >= MAX_LEVEL) return 0;
        return XPTable.xpForLevel(currentLevel + 1) - currentXP;
    },

    /**
     * Progress percentage toward the next level (0–100).
     */
    progressPercent(currentXP: number): number {
        const currentLevel = XPTable.levelForXP(currentXP);
        if (currentLevel >= MAX_LEVEL) return 100;
        const xpThisLevel = XPTable.xpForLevel(currentLevel);
        const xpNextLevel = XPTable.xpForLevel(currentLevel + 1);
        const range = xpNextLevel - xpThisLevel;
        if (range <= 0) return 100;
        return Math.min(100, ((currentXP - xpThisLevel) / range) * 100);
    },

    /** The maximum level in the game. */
    maxLevel: MAX_LEVEL,
};
