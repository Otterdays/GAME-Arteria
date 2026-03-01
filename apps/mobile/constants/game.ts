/**
 * Game constants — caps, limits, and config values.
 * [TRACE: ROADMAP.md] V. Inventory Full Warning
 * [TRACE: Patron's Pack] Offline caps and premium benefits
 */

/** Offline progression cap (F2P). */
export const OFFLINE_CAP_F2P_MS = 24 * 60 * 60 * 1000;

/** Offline progression cap (Patron's Pack). */
export const OFFLINE_CAP_PATRON_MS = 7 * 24 * 60 * 60 * 1000;

/** Max unique item types in bank (F2P). */
export const INVENTORY_SLOT_CAP_F2P = 50;

/** Max unique item types in bank (Patron's Pack). */
export const INVENTORY_SLOT_CAP_PATRON = 100;

/** XP multiplier when Patron is active (20% bonus). */
export const XP_BONUS_PATRON = 1.2;

/** @deprecated Use INVENTORY_SLOT_CAP_F2P. Kept for backward compatibility. */
export const INVENTORY_SLOT_CAP = INVENTORY_SLOT_CAP_F2P;
