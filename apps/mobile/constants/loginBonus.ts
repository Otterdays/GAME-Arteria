/**
 * Login bonus — 7-day escalating rewards. Resets streak if a day is missed.
 * [TRACE: ROADMAP Phase 7 — Retention]
 */

export const LOGIN_BONUS_DAYS: Array<{ gold: number; lumina?: number }> = [
    { gold: 100 },
    { gold: 200 },
    { gold: 300 },
    { gold: 400 },
    { gold: 500 },
    { gold: 600 },
    { gold: 500, lumina: 10 },
];

export function getTodayDateString(): string {
    return new Date().toISOString().slice(0, 10);
}

export function getYesterdayDateString(): string {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().slice(0, 10);
}

export function getLoginBonusStatus(
    lastClaimDate: string | null,
    consecutiveDays: number
): { canClaim: boolean; day: number; reward: { gold: number; lumina?: number } } {
    const today = getTodayDateString();
    const yesterday = getYesterdayDateString();
    if (lastClaimDate === today) {
        return { canClaim: false, day: consecutiveDays, reward: LOGIN_BONUS_DAYS[Math.min(consecutiveDays, 7) - 1]! };
    }
    if (lastClaimDate === null || lastClaimDate < yesterday) {
        return { canClaim: true, day: 1, reward: LOGIN_BONUS_DAYS[0]! };
    }
    const nextDay = Math.min(7, consecutiveDays + 1);
    return { canClaim: true, day: nextDay, reward: LOGIN_BONUS_DAYS[nextDay - 1]! };
}
