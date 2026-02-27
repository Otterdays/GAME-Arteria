import { XPTable } from '../XPTable';

describe('XPTable', () => {
    it('returns correct level 1 XP', () => {
        expect(XPTable.xpForLevel(1)).toBe(0);
    });

    it('returns correct level 2 XP', () => {
        expect(XPTable.xpForLevel(2)).toBe(83);
    });

    it('returns correct level 99 XP', () => {
        // Classic OSRS level 99 is 13,034,431
        expect(XPTable.xpForLevel(99)).toBe(13034431);
    });

    it('calculates correct level for given XP', () => {
        expect(XPTable.levelForXP(0)).toBe(1);
        expect(XPTable.levelForXP(83)).toBe(2);
        expect(XPTable.levelForXP(13034431)).toBe(99);
        expect(XPTable.levelForXP(200000000)).toBe(99); // Maxes out at 99
    });

    it('calculates XP to next level', () => {
        expect(XPTable.xpToNextLevel(0)).toBe(83); // Level 1 to 2

        // At max level, remaining should be 0
        expect(XPTable.xpToNextLevel(13034431)).toBe(0);
    });

    it('calculates correct progress percentage', () => {
        expect(XPTable.progressPercent(0)).toBe(0);

        // Exact halfway point between Lvl 1 (0) and Lvl 2 (83)
        expect(XPTable.progressPercent(41.5)).toBe(50);

        expect(XPTable.progressPercent(83)).toBe(0); // Starts over at level 2
    });
});
