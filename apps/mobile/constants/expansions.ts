export type ExpansionId = 'exp1' | 'exp2' | 'exp3' | 'exp4';

export interface ExpansionPack {
    id: ExpansionId;
    title: string;
    price: string;
    description: string;
    features: string[];
}

export const EXPANSION_PACKS: Record<ExpansionId, ExpansionPack> = {
    exp1: {
        id: 'exp1',
        title: "Exp. 1: Patron's Pack",
        price: "$5.99",
        description: "The foundational expansion pack.",
        features: ["7-day offline cap", "+20% XP bonus", "100 bank slots", "Patron badge"],
    },
    exp2: {
        id: 'exp2',
        title: "Exp. 2",
        price: "$5.99",
        description: "The second major expansion to Aetheria.",
        features: ["New Skill: Navigation", "New Dungeon: The Abyss", "+50 Bank Slots"],
    },
    exp3: {
        id: 'exp3',
        title: "Exp. 3",
        price: "$5.99",
        description: "The third major expansion to Aetheria.",
        features: ["New Skill: Summoning", "New Boss: The Titan", "+50 Bank Slots"],
    },
    exp4: {
        id: 'exp4',
        title: "Exp. 4",
        price: "$5.99",
        description: "The fourth major expansion to Aetheria.",
        features: ["New Continent", "Level Cap Increased to 120", "+50 Bank Slots"],
    }
};

/* 
// --- FUTURE RAG: GATING EXAMPLE ---
// Use this snippet in your UI or Engine to gate content based on unlocked expansions.
//
// 1. In a React Component:
// const unlockedExpansions = useAppSelector((s) => s.game.player.settings?.unlockedExpansions ?? {});
// const hasExp1 = unlockedExpansions['exp1'];
// if (!hasExp1) return <Text>Purchase Exp. 1 to access!</Text>;
//
// 2. In the Engine / Reducer (gameSlice.ts):
// const hasExp2 = state.player.settings?.unlockedExpansions?.['exp2'];
// if (!hasExp2) return; // Prevent action
*/

