/**
 * Farming — Patches, crops, and growth config.
 * [TRACE: DOCU/SKILLS_ARCHITECTURE.md §1 Farming]
 * Plant seeds → wait (growth timer) → harvest crops.
 */

export interface FarmingPatch {
    id: string;
    name: string;
    locationId: string;
    levelReq: number;
    cropType?: 'all' | 'herb' | 'grain';
}

export interface FarmingCrop {
    id: string;
    seedId: string;
    outputId: string;
    outputQty: number;
    levelReq: number;
    growthMs: number;
    xpPerHarvest: number;
    emoji: string;
}

export const FARMING_PATCHES: FarmingPatch[] = [
    { id: 'crownlands_farm_1', name: 'Crownlands Farm (North)', locationId: 'crownlands', levelReq: 1, cropType: 'all' },
    { id: 'crownlands_farm_2', name: 'Crownlands Farm (South)', locationId: 'crownlands', levelReq: 1, cropType: 'all' },
    { id: 'frostvale_greenhouse', name: 'Frostvale Greenhouse', locationId: 'frostvale', levelReq: 15, cropType: 'all' },
];

export const FARMING_CROPS: FarmingCrop[] = [
    { id: 'wheat', seedId: 'wheat_seed', outputId: 'wheat', outputQty: 3, levelReq: 1, growthMs: 5 * 60 * 1000, xpPerHarvest: 15, emoji: '🌾' },
    { id: 'cabbage', seedId: 'cabbage_seed', outputId: 'cabbage', outputQty: 3, levelReq: 10, growthMs: 8 * 60 * 1000, xpPerHarvest: 28, emoji: '🥬' },
    { id: 'tomato', seedId: 'tomato_seed', outputId: 'tomato', outputQty: 3, levelReq: 20, growthMs: 12 * 60 * 1000, xpPerHarvest: 50, emoji: '🍅' },
    { id: 'sweetcorn', seedId: 'sweetcorn_seed', outputId: 'sweetcorn', outputQty: 3, levelReq: 35, growthMs: 15 * 60 * 1000, xpPerHarvest: 75, emoji: '🌽' },
    { id: 'strawberry', seedId: 'strawberry_seed', outputId: 'strawberry', outputQty: 3, levelReq: 50, growthMs: 20 * 60 * 1000, xpPerHarvest: 110, emoji: '🍓' },
    { id: 'snape_grass', seedId: 'snape_grass_seed', outputId: 'snape_grass', outputQty: 2, levelReq: 65, growthMs: 25 * 60 * 1000, xpPerHarvest: 160, emoji: '🌿' },
    { id: 'void_cap', seedId: 'void_cap_seed', outputId: 'void_cap_mushroom', outputQty: 2, levelReq: 80, growthMs: 30 * 60 * 1000, xpPerHarvest: 250, emoji: '🍄' },
];

export function getCropById(cropId: string): FarmingCrop | undefined {
    return FARMING_CROPS.find((c) => c.id === cropId);
}

export function getCropBySeedId(seedId: string): FarmingCrop | undefined {
    return FARMING_CROPS.find((c) => c.seedId === seedId);
}

export function getPatchById(patchId: string): FarmingPatch | undefined {
    return FARMING_PATCHES.find((p) => p.id === patchId);
}
