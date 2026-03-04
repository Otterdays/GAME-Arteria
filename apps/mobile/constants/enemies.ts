/**
 * Enemy definitions for combat and random events.
 * [TRACE: ROADMAP Phase 4 — Combat; first enemy: Goblin from goblin_1.svg]
 */

export interface EnemyMeta {
    id: string;
    name: string;
    /** Asset path relative to assets/images (e.g. goblin_1.svg). Used when combat/bestiary UI is built. */
    assetPath: string;
    level?: number;
    description?: string;
}

/** First random enemy — appears in "Goblin Peek" random event. Asset: goblin_1.svg */
export const ENEMY_GOBLIN: EnemyMeta = {
    id: 'enemy_goblin',
    name: 'Goblin',
    assetPath: 'goblin_1.svg',
    level: 1,
    description: 'A green goblin that sometimes peeks out from the shadows while you train. Combat not yet implemented.',
};

export const ENEMIES: Record<string, EnemyMeta> = {
    [ENEMY_GOBLIN.id]: ENEMY_GOBLIN,
};
