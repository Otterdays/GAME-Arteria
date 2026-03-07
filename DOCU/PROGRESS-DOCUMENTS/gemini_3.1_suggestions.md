# Gemini 3.1 UX/Visual Enhancements Guide

> **Purpose:** A checklist of high-impact, low-effort UX and visual improvements utilizing existing project dependencies (`expo-audio`, `react-native-reanimated`, `expo-haptics`, `expo-linear-gradient`).
> **Usage:** Check off items as they are implemented. Refer to this document for future polish passes.

---

## 1. Audio Immersion (Top Priority)
*Dependency: `expo-audio`*

- [ ] **Ambient Loops:** Implement background audio loops per skill screen (e.g., waves for Fishing, clanking for Smithing, forest for Logging) using the existing `useIdleSoundscape` hook.
- [ ] **UI SFX:** Add subtle UI sound effects for button presses, tab changes, and modal opens.
- [ ] **Event SFX:** Add rewarding sound effects for Level Ups, Pet Drops, and Daily Quest completions.

## 2. Animations & Micro-interactions
*Dependency: `react-native-reanimated`*

- [ ] **Smooth Progress Bars:** Animate XP and action progress bars to fill smoothly rather than snapping to the new value.
- [ ] **Button Press States:** Add subtle scale-down animations (e.g., `0.95x`) to primary and secondary buttons when pressed.
- [ ] **Toast Notifications:** Implement smooth slide-in/slide-out animations for Level Up and Item Drop toast notifications.
- [ ] **List Transitions:** Add layout animations when items are added to or removed from the Bank/Inventory.

## 3. Tactile Feedback
*Dependency: `expo-haptics`*

- [ ] **Action Toggles:** Trigger light haptic feedback when starting or stopping a skill task.
- [ ] **Success States:** Trigger success/heavy haptic feedback on Level Up, Mastery unlock, or Daily Quest completion.
- [ ] **Warning States:** Trigger warning haptic feedback when attempting an action without sufficient resources (e.g., out of essence).
- [ ] **Navigation:** Trigger subtle selection haptics when switching main navigation tabs.

## 4. Visual Depth & Thematic Styling
*Dependencies: `expo-linear-gradient`, `@expo-google-fonts/cinzel`, `useTheme()`*

- [ ] **Typography Consistency:** Audit UI to ensure `FontCinzel` is strictly used for screen titles, modal headers, and skill names, while standard sans-serif is used for body text.
- [ ] **Active State Glows:** Expand `CardStyle` to include a subtle colored border (`borderGlow` token) when a skill or task is actively running.
- [ ] **High-Value Highlights:** Use `expo-linear-gradient` backgrounds for high-value items, active mastery cards, or rare drops to make them pop.
- [ ] **Locked States:** Ensure locked skill nodes or features use proper desaturation/grayscale styling combined with the `reqBadgeLocked` style.


=======================================================================================================================================================


App Expansion Plan: "Carpet Bombing with Features"
This document outlines a series of systemic enhancements to deepen existing gameplay loops, add meaningful interconnectivity, and flesh out the groundwork laid in recent updates.

Proposed Changes
1. Slayer Expansion: Shop & Combat Integration
Concept: Transform Slayer from a simple task tracker into a fully integrated combat gameplay loop with an economy.
Implementation:
[MODIFY] 
packages/engine/src/types.ts
: Add slayerCoins to the player state and slayerItemLevel to combat logic.
[MODIFY] 
apps/mobile/store/gameSlice.ts
: Update 
processCombatTick
 to grant Slayer Coins upon killing a Slayer Task target and apply a 15% damage bonus if the player wears the Slayer Helmet.
[MODIFY] 
apps/mobile/app/skills/slayer.tsx
: Implement a "Slayer Shop" tab where players can spend coins to buy a Slayer Helmet (equipment) and Broad Arrows (future ranged ammo).
[NEW] apps/mobile/components/SlayerShop.tsx: UI component for purchasing Slayer rewards.
2. Summoning Expansion: Active Familiars
Concept: Summoning pouches currently sit in the inventory. This feature allows players to equip a familiar for global passive buffs.
Implementation:
[MODIFY] 
packages/engine/src/types.ts
: Add activeFamiliar (itemId or null) to 
PlayerState
.
[MODIFY] 
apps/mobile/store/gameSlice.ts
: Handle the equipFamiliar and unequipFamiliar actions. Bind familiar buffs (Wolf = +1 Max Hit, Spider = +5% Loot Chance, Dreadfowl = +1 Magic Defense) to 
CombatStats
 and processOffline gathering calculations.
[MODIFY] 
apps/mobile/app/skills/summoning.tsx
: Add UI for "Active Familiar" at the top of the screen, allowing players to select and equip an available pouch.
3. Companions (Leadership) Deepening: Passive Missions
Concept: Companions (Barnaby, Garry) can currently be hired but have no ongoing utility. We will allow players to deploy them on resource-gathering missions.
Implementation:
[MODIFY] 
apps/mobile/store/gameSlice.ts
: In processOffline and 
useGameLoop
, if a companion has an assignedTaskId, generate background resources (e.g., Copper Ore, Shrimp) at 50% of the player's rate based on their skills. Add assignCompanionTask action.
[MODIFY] 
apps/mobile/app/skills/leadership.tsx
: Add a "Deploy" button on the Companion card to open a modal for selecting a passive gathering node (Tier 1 nodes only initially).
4. Item Mastery Deepening: Tier Bonuses
Concept: The architecture document outlines Item Mastery (Tier I to IV) based on the number of items crafted. The UI currently shows standard crafting without applying these bonuses.
Implementation:
[MODIFY] 
apps/mobile/store/gameSlice.ts
: Integrate itemMastery.totalCrafted into the ACTION_DEFS speed and yield calculations.
Tier I (100+): +5% Speed
Tier II (500+): +10% Yield (Chance for double loot)
[MODIFY] apps/mobile/components/ItemDetailModal.tsx: Add a progress bar or badge denoting the current Mastery Tier (I, II, III, Perfect) when inspecting a crafted item.
5. Cooking & Harvesting Synergy: Gourmet Meals
Concept: The "Food Chain" crossover is currently limited to Fishing -> Cooking. This adds Harvesting into the mix to create high-tier food.
Implementation:
[MODIFY] 
apps/mobile/constants/skills.ts
: Add new complex recipes to COOKING_RECIPES. E.g., "Salmon Salad" (Requires 1 Raw Salmon + 1 Cabbage).
[MODIFY] 
apps/mobile/store/gameSlice.ts
: Update cooking verification logic to check for multiple ingredients. Give these Gourmet Meals 2x or 3x healing and duration buffs compared to standalone fish.
[MODIFY] 
apps/mobile/app/skills/cooking.tsx
: Update the recipe UI to display secondary ingredient requirements elegantly.
Verification Plan
Automated Tests
Currently, the mobile app heavily relies on Expo manually. There are no automated e2e tests integrated via Playwright for Arteria-dev.

Manual Verification
The following manual testing steps will be performed dynamically using the local Expo environment (or requested from the user if environmental components cannot be mocked):

Slayer Shop: Assign a Slayer task, use a test script/action to give the player 500 Slayer Coins, and attempt to purchase the Slayer Helmet. Equip it and verify the 
CombatStats
 UI updates or damage logs reflect the 15% increase against the task target.
Active Familiars: Craft a Spirit Spider pouch. Equip it. Check the global state to ensure activeFamiliar is set. Verify that loot drop rates (simulated or logged via 
useGameLoop
) accurately reflect the +5% buff.
Companion Missions: Hire Garry the Guard. Assign him to "Mine Copper". Wait 60 seconds (or manually fast-forward ticks via test action) and verify the player's bank receives Copper Ore independently of the player's active task.
Item Mastery: Set the player.itemMastery['bronze_bar'].totalCrafted to 105 (Tier I). Start smelting Bronze Bars. Watch the tick timer and confirm it completes 5% faster than base speed.
Gourmet Cooking: Add Raw Salmon and Cabbage to the bank via test action. Successfully cook a Salmon Salad and verify both items are consumed from the bank. Consume the food in Combat and verify the boosted heal amount applies to Hitpoints.