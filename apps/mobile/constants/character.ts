/**
 * Main character — canonical name and display helpers.
 * [TRACE: DOCU/MASTER_DESIGN_DOC.md §II Character System — The Anchor]
 *
 * The protagonist is "The Anchor" — someone whose soul is unusually heavy in the cosmic sense.
 * The player chooses a nickname on first start; NPCs and UI use it for a personal touch.
 */

/** Canonical name of the main character (from lore). Used when no nickname is set. */
export const PROTAGONIST_CANONICAL_NAME = 'The Anchor';

/** Legacy default before nickname system; treat as "no nickname" and show canonical. */
const LEGACY_DEFAULT_NAME = 'Adventurer';

/**
 * Returns the display name: player's nickname if set and meaningful, else canonical name.
 */
export function getDisplayName(nickname: string | undefined): string {
    const n = (nickname ?? '').trim();
    if (n.length > 0 && n !== LEGACY_DEFAULT_NAME) return n;
    return PROTAGONIST_CANONICAL_NAME;
}
