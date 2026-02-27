/**
 * formatNumber — Compact number formatting utility.
 * Used everywhere in the UI for XP, gold, and item counts.
 *
 *  < 1,000        → "999"
 *  1,000–999,999  → "12.3K"
 *  1M+            → "1.2M"
 *  1B+            → "1.2B"
 */
export function formatNumber(n: number): string {
    if (n < 1_000) return Math.floor(n).toString();
    if (n < 1_000_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
    if (n < 1_000_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    return (n / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
}

/**
 * formatXpHr — Calculate XP per hour from action parameters.
 * @param xpPerTick XP gained per action
 * @param intervalMs Time per action in milliseconds
 * @param successRate Optional (0–1). Default 1.0.
 */
export function formatXpHr(xpPerTick: number, intervalMs: number, successRate = 1): string {
    const actionsPerHour = 3_600_000 / intervalMs;
    const xpHr = xpPerTick * actionsPerHour * successRate;
    return formatNumber(xpHr) + ' XP/hr';
}
