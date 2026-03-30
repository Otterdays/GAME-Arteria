# CROSS-SKILL SYNERGY SYSTEM
## Arteria Deep Design — Synergies v2.0

> **Version:** 1.0 — Initial Design  
> **Date:** 2026-03-21  
> **Status:** Design Document — Not Yet Implemented  
> **Author:** Claude (new agent analysis)  
> **Supersedes:** `constants/synergies.ts` stub (5 synergies, level-25 unlock, no mechanics) and `MASTER_DESIGN_DOC.md` Chapter 6.4 (TODO: "15+ combos, skill chain bonuses, cross-pillar synergies")  
> **KISS · YAGNI · DOTI**

---

## 1. RATIONALE & PHILOSOPHY

### 1.1 Why Synergies Exist

Arteria's skills are intentionally **interdependent** — you cannot progress any skill in isolation. The Ore Chain alone requires Mining → Smithing → Forging. The Food Chain requires Fishing → Cooking. The Herb Chain requires Harvesting → Herblore.

This interdependence is the game's backbone, but the current synergy system is **cosmetic**: five entries in `constants/synergies.ts` with level thresholds and flavor text. Nothing actually happens.

Cross-skill synergies fix this by:

1. **Rewarding breadth**: Players who diversify their skill profile get tangible mechanical benefits beyond the sum of their parts.
2. **Creating "aha" moments**: Discovering that Mining + Astrology produces "Deep Vein Resonance" (asteroid mining) makes the world feel connected.
3. **Adding strategic depth**: Players must choose which skill pairs to develop, not just which nodes to grind.
4. **Feeding the crossover economy**: Every synergy connects two skills that were already related, reinforcing the "Runescape-like" planning loop.

### 1.2 Design Constraints

| Constraint | Implication |
|-------------|-------------|
| **Idle game philosophy** | Synergies must not require active play to benefit from. |
| **No predatory power purchase** | All synergy value must be earned through gameplay. |
| **Keep mastery simple** | Synergies are separate from mastery upgrades. Do not combine systems. |
| **Visually show power** | Synergies need UI real estate: discovery modal, active bonus display, progress tracking. |
| **Math must be clean** | Bonus formulas must be auditable, predictable, and not stack-overflow unexpectedly. |

### 1.3 What's Wrong with the Current System

The existing `synergies.ts` has five entries:

```
ore_insight       → Mining 25 + Smithing 25
forest_father     → Logging 25 + Forging 25 (note: wrong skill, Construction placeholder)
gourmet_brew      → Cooking 25 + Herblore 25
fresh_catch       → Fishing 25 + Cooking 25
scrap_knight      → Scavenging 25 + Forging 25
```

**Problems:**
1. No mechanical implementation — `isSynergyUnlocked` and `canUnlockSynergy` exist but nothing uses their output.
2. Level-25 threshold is arbitrary and feels low for an "advanced" system.
3. No scaling — the bonus is binary (unlocked or not), not progressive.
4. No discovery moment — synergies auto-unlock with no fanfare or explanation.
5. `forest_father` references Construction which doesn't exist yet.
6. The descriptions are vague ("Rich veins glow") — no concrete mechanical effect.
7. No UI for synergies at all.
8. Only 2-skill pairs — no chain synergies or 3-skill combos.

---

## 2. CORE MECHANICS

### 2.1 Synergy Types

There are three synergy types, differentiated by **skill count** and **complexity**:

#### Type A — Pair Synergies (2 skills)
The foundation. Any two related skills can form a Pair Synergy. Unlock when both skills reach `minLevel`. Most of the initial 25 synergies are Type A.

#### Type B — Chain Synergies (3 skills)
A full production chain (e.g., Mining → Smithing → Forging) unlocks a Chain Synergy when all three reach `minLevel`. Chain Synergies provide a **global bonus** that applies to the entire chain, not just one link. More powerful than Type A but rarer.

#### Type C — Cross-Pillar Synergies (2 skills from different pillars)
A Gathering + Crafting or Combat + Support pairing. These are the most strategic because they require investing across pillars. Higher `minLevel` but stronger thematic flavor.

#### Type D — Meta Synergies (2 skills, unlocked by having other synergies)
Advanced synergies that require **two unlocked synergies** as prerequisites. Think of these as "the universe notices you're good at many things." Unlock when both prerequisite synergies are active and their skills are at high levels.

### 2.2 Synergy Power: The Affinity Score

Synergies are not binary on/off — they have **power levels** based on how high the constituent skills are.

```
affinity = (skill1_level + skill2_level) / 2
synergy_power = affinity - minLevel
```

- **Power 0–4** (just unlocked): Base bonus only.
- **Power 5–14**: Base + Tier 1 scaling bonus.
- **Power 15–29**: Tier 1 + Tier 2 scaling bonus.
- **Power 30+**: Tier 1 + Tier 2 + Tier 3 scaling bonus (capped at Power 50).

This means a Mining 60 + Smithing 60 player gets a noticeably stronger Ore Insight than a Mining 25 + Smithing 25 player. The synergy **grows with your investment**, not just unlocks.

### 2.3 The Synergy Unlock Moment

When a synergy becomes unlockable (both skills meet `minLevel` AND it hasn't been unlocked yet), the player receives a **Discovery Modal**:

1. **Title**: "New Synergy Discovered: [Synergy Name]"
2. **Flavor text**: A 2–3 sentence thematic description of why these skills connect.
3. **Active bonus**: The concrete mechanical effect (e.g., "+8% ore yield").
4. **Current power**: Show the current power level and what the next tier unlocks.
5. **Affirm button**: "Embrace the Flow" — actually unlocks it.
6. **Sound**: Special "discovery" SFX, distinct from level-up.

This is the **"aha moment"** — it must feel significant.

### 2.4 Synergy Categories

Organize synergies into categories for UI clarity:

| Category | Icon | Synergies Included |
|----------|------|--------------------|
| **Production** | ⚙️ | Ore Chain, Food Chain, Herb Chain, Wood Chain, Magic Chain |
| **Efficiency** | ⏱️ | Time-saving combos (Cooking + Firemaking = faster cooking) |
| **Discovery** | 🔍 | Knowledge combos (Astrology + any = better yields) |
| **Resilience** | 🛡️ | Risk-reduction combos (Cooking + Herblore = safer food) |
| **Meta** | ✨ | High-level cross-pillar combos |

---

## 3. SYNERGY DEFINITIONS (25 Synergies)

### 3.1 Production Chain Synergies

These connect full production chains. Each provides a **chain-wide passive bonus** to all skills in the chain.

#### S1 — Ore Insight
- **Skills**: Mining + Smithing
- **Type**: Type A (Pair)
- **minLevel**: 25
- **Category**: Production
- **Flavor**: "The deeper you dig, the more you understand the forge's hunger."
- **Effect**: `+[2 + floor(synergy_power * 0.3)]% ore yield` (Mining). Additionally, `+[1 + floor(synergy_power * 0.2)]% bar quality` (Smithing) — chance for higher-tier bar output.
- **Unlocks at Power 5+**: Rich veins glow with a faint light, indicating higher-quality deposits.

#### S2 — Fresh Catch
- **Skills**: Fishing + Cooking
- **Type**: Type A (Pair)
- **minLevel**: 25
- **Category**: Production
- **Flavor**: "The freshest fish know they're already dead. Best to cook them quickly."
- **Effect**: `+[5 + floor(synergy_power * 0.5)]% food buff duration`. Burn chance on fish is reduced by `floor(synergy_power * 0.2)%`.
- **Unlocks at Power 10+**: Raw fish from Fishing can be eaten directly for a smaller heal (survival bonus).

#### S3 — Gourmet Brew
- **Skills**: Cooking + Herblore
- **Type**: Type A (Pair)
- **minLevel**: 25
- **Category**: Production + Resilience
- **Flavor**: "The best medicine tastes like a five-course meal."
- **Effect**: Potions created by Herblore restore `floor(synergy_power * 0.3)` HP when consumed. Additionally, cooked food from Cooking gains `+[1 + floor(synergy_power * 0.1)]%` chance to gain a minor herblore buff (e.g., "Spiced Salmon grants +2% Mining yield for 5 minutes").
- **Unlocks at Power 10+**: "Feast Potions" — cooking recipes that grant temporary Herblore XP.

#### S4 — Scrap Knight
- **Skills**: Scavenging + Forging
- **Type**: Type A (Pair)
- **minLevel**: 30
- **Category**: Production
- **Flavor**: "One person's cosmic debris is another person's armor."
- **Effect**: Forging consumes `max(1, 2 - floor(synergy_power * 0.05))` bars instead of the normal recipe requirement, minimum 1 bar. Additionally, cursed items from Scavenging have `floor(synergy_power * 0.3)%` chance to auto-cleanse into clean items.
- **Unlocks at Power 15+**: Scavenging has a chance to find "Forging Blueprints" — rare items that unlock cosmetic variants of equipment.

#### S5 — Forest Father
- **Skills**: Logging + Woodworking
- **Type**: Type A (Pair)
- **minLevel**: 25
- **Category**: Production
- **Flavor**: "The trees know their own wood. The craftsman learns to ask."
- **Effect**: `+[3 + floor(synergy_power * 0.3)]% log yield` from Logging. Woodworking recipes cost `max(1, input_qty - floor(synergy_power * 0.02))` logs, minimum 1.
- **Note**: This replaces the broken `forest_father` entry in the existing `synergies.ts` (which referenced Forging instead of Woodworking).
- **Unlocks at Power 10+**: "Sustainable Logging" — trees have a `floor(synergy_power * 0.2)%` chance to regrow instantly after being chopped.

#### S6 — Flame & Feast
- **Skills**: Firemaking + Cooking
- **Type**: Type A (Pair)
- **minLevel**: 20
- **Category**: Production + Efficiency
- **Flavor**: "A cook's best friend is a well-maintained fire."
- **Effect**: Cooking speed is increased by `min(15, floor(synergy_power * 0.4))%`. Additionally, the chance of burning food is reduced by `floor(synergy_power * 0.3)%`.
- **Unlocks at Power 5+**: Cooking near an active Firemaking task grants a `+5% XP bonus` to both skills.

#### S7 — Runic Amplification
- **Skills**: Runecrafting + Astrology
- **Type**: Type A (Pair)
- **minLevel**: 30
- **Category**: Production + Discovery
- **Flavor**: "The stars write in runes you haven't invented yet."
- **Effect**: Runecrafting yield increased by `+[2 + floor(synergy_power * 0.2)]%`. Astrology study grants Stardust at a rate of `floor(synergy_power * 0.05)` per action tick (this is a passive trickle, not a primary Stardust source).
- **Unlocks at Power 15+**: "Stellar Runes" — once per day, the player can craft a rune with double yield.

#### S8 — Herb Garden
- **Skills**: Harvesting + Farming
- **Type**: Type A (Pair)
- **minLevel**: 20
- **Category**: Production
- **Flavor**: "Wild herbs and cultivated crops tell each other secrets."
- **Effect**: `+[2 + floor(synergy_power * 0.25)]%` yield from both Harvesting and Farming. Farming growth time reduced by `min(10, floor(synergy_power * 0.2))%`.
- **Unlocks at Power 10+**: "Companion Planting" — harvesting has a chance to yield Farming seeds.

#### S9 — Adept Scholar
- **Skills**: Wizardry + Research (placeholder for Astrology)
- **Type**: Type A (Pair)
- **minLevel**: 25
- **Category**: Discovery
- **Flavor**: "Books whisper to those who listen. The wizardry student hears best."
- **Effect**: Wizardry study speed increased by `min(15, floor(synergy_power * 0.4))%`. Additionally, the chance to discover new Wizardry nodes is `floor(synergy_power * 0.5))%`.
- **Note**: When Research skill is implemented, this upgrades to a true Scholar's Path synergy.

#### S10 — Elemental Fusion
- **Skills**: Herblore + Astrology
- **Type**: Type A (Pair)
- **minLevel**: 35
- **Category**: Production + Discovery
- **Flavor**: "Align the herbs with the stars, and the potion's power knows no bounds."
- **Effect**: Herblore potion potency (healing/duration) increased by `+[5 + floor(synergy_power * 0.5)]%`. Astrology Stardust gain increased by `+floor(synergy_power * 0.3)%`.
- **Unlocks at Power 15+**: "Astrological Elixirs" — potions brewed during specific real-world times (lunar phases) have enhanced effects.

### 3.2 Efficiency Synergies

These save resources or reduce failure chances.

#### S11 — Steady Hands
- **Skills**: Mining + Agility
- **Type**: Type A (Pair)
- **minLevel**: 20
- **Category**: Efficiency
- **Flavor**: "A nimble hand finds the ore's sweet spot."
- **Effect**: Mining has a `min(20, floor(synergy_power * 0.4))%` chance to not deplete a vein tick (extends vein lifetime). Additionally, Mining speed increased by `min(8, floor(synergy_power * 0.2))%`.
- **Unlocks at Power 10+**: Agility courses have a chance to reveal mining shortcuts (hidden ore veins).

#### S12 — Iron Will
- **Skills**: Smithing + Agility
- **Type**: Type A (Pair)
- **minLevel**: 30
- **Category**: Efficiency
- **Flavor**: "The patient smith hammers once. The agile smith hammers twice."
- **Effect**: Smithing has a `min(25, floor(synergy_power * 0.5))%` chance to not consume fuel (coal). Additionally, `min(15, floor(synergy_power * 0.3))%` chance to produce double bars.
- **Unlocks at Power 10+**: "Forging Stamina" — active forging sessions grant a small Agility XP trickle.

#### S13 — Seamstress
- **Skills**: Crafting + Tailoring
- **Type**: Type A (Pair)
- **minLevel**: 25
- **Category**: Efficiency
- **Flavor**: "The needle knows the cloth. The cloth knows the needle."
- **Effect**: Crafting recipes consume `max(1, input_qty - floor(synergy_power * 0.03))` materials, minimum 1. Additionally, `min(20, floor(synergy_power * 0.4))%` chance to produce an extra crafted item.
- **Unlocks at Power 15+**: Tailored items have a chance to gain cosmetic color variants.

#### S14 — Double Duty
- **Skills**: Fletching + Woodworking
- **Type**: Type A (Pair)
- **minLevel**: 25
- **Category**: Efficiency
- **Flavor**: "A fletcher who knows wood builds better arrows."
- **Effect**: Fletching has `min(25, floor(synergy_power * 0.5))%` chance to produce double arrows/bows. Woodworking recipes gain `min(15, floor(synergy_power * 0.3))%` speed bonus.
- **Unlocks at Power 10+**: "Artisan Arrows" — arrows produced have a chance to be "Fletched Masterpiece" (decorative but tradeable).

#### S15 — Swift Sorcery
- **Skills**: Runecrafting + Sorcery
- **Type**: Type A (Pair)
- **minLevel**: 30
- **Category**: Efficiency
- **Flavor**: "The sorcerer who makes runes is never caught without magic."
- **Effect**: Runes crafted are consumed `min(20, floor(synergy_power * 0.4))%` slower when casting spells (preservation). Additionally, spell casting speed increased by `min(10, floor(synergy_power * 0.2))%`.
- **Unlocks at Power 15+**: "Rune Efficiency" — spell costs reduced by `floor(synergy_power * 0.1)` runes per cast.

### 3.3 Cross-Pillar Synergies

These connect different pillars (Gathering ↔ Crafting, Combat ↔ Support, etc.).

#### S16 — Armorsmith
- **Skills**: Mining + Smithing + Forging
- **Type**: Type B (Chain — Ore Chain)
- **minLevel**: 40
- **Category**: Production
- **Flavor**: "From vein to vanguard. The metal knows where it belongs."
- **Effect**: **Chain-wide passive**. All three skills (Mining, Smithing, Forging) gain `+[3 + floor(synergy_power * 0.3)]%` XP. Equipment produced by Forging has a `min(15, floor(synergy_power * 0.3))%` chance to gain a "Well-Forged" bonus (+5 to a random stat).
- **Requires**: Ore Insight (S1) to be unlocked as a prerequisite.
- **Unlocks at Power 20+**: "Masterwork" — one item per day can be designated as a Masterwork, gaining significantly enhanced stats.

#### S17 — Master Chef
- **Skills**: Fishing + Cooking + Herblore
- **Type**: Type B (Chain — Food + Herb Chain)
- **minLevel**: 40
- **Category**: Production + Resilience
- **Flavor**: "A chef who understands poison makes the best medicine."
- **Effect**: **Chain-wide passive**. All three skills gain `+[2 + floor(synergy_power * 0.25)]%` XP. Cooked food has a `min(30, floor(synergy_power * 0.6))%` chance to gain a random buff from the Herblore potion list (e.g., Brain Food effect).
- **Requires**: Fresh Catch (S2) + Gourmet Brew (S3) as prerequisites.
- **Unlocks at Power 20+**: "Gourmet Potions" — potions can be cooked into food form, granting both HP and potion effects.

#### S18 — Lumberjack
- **Skills**: Logging + Woodworking + Construction
- **Type**: Type B (Chain — Wood Chain)
- **minLevel**: 35
- **Category**: Production
- **Flavor**: "From seed to sanctuary. The forest builds its own monuments."
- **Effect**: **Chain-wide passive** (Construction is placeholder). All three skills gain `+[2 + floor(synergy_power * 0.2)]%` XP. Woodworking recipes have `min(20, floor(synergy_power * 0.4))%` chance to produce a "Masterwork" item that grants bonus Construction XP when used.
- **Requires**: Forest Father (S5) to be unlocked.
- **Note**: Construction is not yet implemented. This synergy has reduced effect until Construction is live.
- **Unlocks at Power 15+**: "Sustainable Lumber" — Logging has a chance to plant replacement trees (passive Construction XP).

#### S19 — Runesmith
- **Skills**: Mining + Runecrafting + Magic
- **Type**: Type B (Chain — Magic Chain)
- **minLevel**: 50
- **Category**: Production
- **Flavor**: "Runes carved from cosmic ore sing louder than paper-scroll spells."
- **Effect**: **Chain-wide passive**. All three skills gain `+[3 + floor(synergy_power * 0.3)]%` XP. Runes from Runecrafting have `min(25, floor(synergy_power * 0.5))%` chance to be "Ancient" quality (2× spell effect).
- **Requires**: Runic Amplification (S7) as prerequisite.
- **Unlocks at Power 20+**: "Elemental Mastery" — spells of the same element as mined ore gain bonus damage.

#### S20 — The Alchemist
- **Skills**: Harvesting + Herblore + Astrology
- **Type**: Type B (Chain)
- **minLevel**: 45
- **Category**: Production + Discovery
- **Flavor**: "The stars align the herbs. The herbs align the stars."
- **Effect**: **Chain-wide passive**. All three skills gain `+[2 + floor(synergy_power * 0.3)]%` XP. Herblore has `min(15, floor(synergy_power * 0.3))%` chance to produce a "Stellar Potion" with double potency.
- **Requires**: Herb Garden (S8) + Elemental Fusion (S10) as prerequisites.
- **Unlocks at Power 20+**: "Astrological Alchemy" — stellar potions grant bonus Astrology XP when consumed.

### 3.4 Meta Synergies

These are the most powerful synergies, unlocked by having other synergies active at high levels.

#### S21 — The Well-Rounded Anchor
- **Skills**: Mining + Fishing
- **Type**: Type D (Meta)
- **minLevel**: 50
- **Category**: Meta
- **Flavor**: "An Anchor who gathers everything grounds reality faster."
- **Effect**: **Global XP bonus** of `floor(synergy_power * 0.1)%` to all Gathering skills (Mining, Logging, Fishing, Harvesting, Scavenging).
- **Prerequisites**: Ore Insight (S1) AND Fresh Catch (S2) must both be unlocked.
- **Unlocks at Power 15+**: Global Gathering speed increased by `min(10, floor(synergy_power * 0.2))%`.

#### S22 — Cosmic Polymath
- **Skills**: Astrology + Any (highest-level skill not already in a synergy)
- **Type**: Type D (Meta)
- **minLevel**: 60
- **Category**: Meta + Discovery
- **Flavor**: "The stars favor those who study everything."
- **Effect**: The paired non-Astrology skill gains `+[5 + floor(synergy_power * 0.4)]%` XP. Additionally, Stardust gain from Astrology is boosted by `+floor(synergy_power * 0.5)%`.
- **Prerequisites**: Runic Amplification (S7) AND any two other Astrology synergies must be active.
- **Note**: This is a "flex" synergy — the second skill is chosen by the player from their highest unpaired skill.

#### S23 — Adept Crafter
- **Skills**: Smithing + Crafting
- **Type**: Type A (Pair)
- **minLevel**: 35
- **Category**: Production
- **Flavor**: "The smith who crafts accessories knows metal from the inside."
- **Effect**: Smithing bar quality bonus increased by `+[3 + floor(synergy_power * 0.3)]%`. Crafting recipes that use bars have `min(20, floor(synergy_power * 0.4))%` chance to not consume the bar.
- **Unlocks at Power 15+**: "Crafted Masterwork" — bars produced by Smithing have a chance to be "Refined" (use 1 less bar in Crafting).

#### S24 — Void Walker
- **Skills**: Scavenging + Exploration
- **Type**: Type A (Pair)
- **minLevel**: 40
- **Category**: Discovery
- **Flavor**: "The void-touched scavenger finds paths others cannot see."
- **Effect**: Exploration has `min(30, floor(synergy_power * 0.6))%` chance to discover a "Void Fragment" (crafting material). Scavenging in high-level zones finds `+[2 + floor(synergy_power * 0.2)]%` more materials.
- **Unlocks at Power 15+**: "Void Navigation" — Exploration expeditions complete `min(15, floor(synergy_power * 0.3))%` faster.

#### S25 — Resonance Adept
- **Skills**: Resonance + Any Gathering skill
- **Type**: Type A (Pair)
- **minLevel**: 20
- **Category**: Meta + Efficiency
- **Flavor**: "The Anchor who resonates with the earth hears its heartbeat."
- **Effect**: Momentum decay rate reduced by `min(25, floor(synergy_power * 0.5))%`. The paired Gathering skill gains `+[1 + floor(synergy_power * 0.15)]%` XP from Resonance's global Haste.
- **Unlocks at Power 10+**: "Deep Resonance" — Resonance has a chance to boost a random gathering action to 2× yield.
- **Note**: This is a flex synergy similar to Cosmic Polymath — the paired skill is chosen by the player.

---

## 4. SYNERGY PROGRESSION TRACKING

### 4.1 Synergy XP System (Optional Enhancement)

> **Design decision point**: Should synergies have their own progression track (earn "Synergy XP" toward synergy-specific upgrades), or should the existing skill level + power model be sufficient?
>
> **Recommended**: Start with the power model only. Add Synergy XP if player engagement data shows synergies feel binary. YAGNI.

### 4.2 Synergy Journal

A new screen (accessible from Settings or the Stats tab) called the **Synergy Journal**:

- Shows all 25 synergies organized by category
- Each entry: icon, name, skills involved, current power level, active bonus
- Unlocked synergies glow; locked ones show requirements (skills needed, minLevel, prerequisites)
- "Near unlock" progress bar for each locked synergy showing how close each constituent skill is to minLevel
- Flavor text for each synergy
- "Total active synergies" counter and combined bonus contribution displayed at the top

### 4.3 Synergy HUD Integration

On each skill screen header:

- If the active skill has any unlocked synergies, show a small synergy badge: e.g., "⚡ Ore Insight (PWR 12) +15% ore"
- Badge is tappable — shows a modal with all synergies affecting this skill and their current power
- On level-up, check if the new level triggers any synergy unlockable state and trigger the Discovery Modal

---

## 5. TECHNICAL IMPLEMENTATION

### 5.1 Data Structure Changes

**`constants/synergies.ts`** — Replace current stub:

```ts
export type SynergyType = 'pair' | 'chain' | 'meta' | 'flex';

export type SynergyCategory = 
    | 'production' 
    | 'efficiency' 
    | 'discovery' 
    | 'resilience' 
    | 'meta';

export interface SynergyDef {
    id: string;
    label: string;
    type: SynergyType;
    category: SynergyCategory;
    skills: [SkillId, SkillId] | [SkillId, SkillId, SkillId]; // 2 or 3 skills
    minLevel: number;
    /** Flex synergies have a dynamic second skill chosen by the player */
    flexSkillIndex?: number; // 0 or 1 — which skill slot is flex
    description: string;
    /** Long-form flavor text shown in the Discovery Modal */
    flavorText: string;
    /** Prerequisites: synergy IDs that must be unlocked first */
    prerequisites?: string[];
    /** Active mechanical effects as a function of power level */
    effects: SynergyEffect[];
    /** Icon emoji */
    emoji: string;
}

export interface SynergyEffect {
    /** Which skill(s) this affects: skillId, 'chain' (all chain skills), 'global' */
    target: SkillId | 'chain' | 'global' | 'all_gathering' | 'all_crafting';
    /** 'yield', 'xp', 'speed', 'preserve', 'double_drop', 'special' */
    type: string;
    /** Base value (at power 0) */
    base: number;
    /** Additional value per power level beyond 0 */
    perPower: number;
    /** Hard cap on the bonus value */
    cap?: number;
    /** Flavor description of the effect (e.g., "% ore yield") */
    unit: string; // e.g., "% ore yield", "% speed", "HP restored"
}

export interface SynergyState {
    id: string;
    unlockedAt?: number; // timestamp
    power: number; // current power level
    flexSkillId?: SkillId; // for flex synergies, which skill is paired
}
```

**`store/gameSlice.ts`** — Update PlayerState:

```ts
// Replace unlockedSynergies: string[] with:
synergies: Record<string, SynergyState>;
// SynergyState.power updates every time a constituent skill levels up.
// SynergyState.unlockedAt is set when the player clicks "Embrace the Flow" in the Discovery Modal.
```

### 5.2 Engine Integration

**`packages/engine/src/SynergyEngine.ts`** (new file):

```ts
/**
 * SynergyEngine — computes active synergy bonuses.
 * 
 * This is pure TypeScript, no UI dependencies.
 * It reads PlayerState and returns a SynergyBonusSet.
 */

export interface SynergyBonusSet {
    // Per-skill multipliers
    xpMultipliers: Partial<Record<SkillId, number>>;
    yieldMultipliers: Partial<Record<SkillId, number>>;
    speedMultipliers: Partial<Record<SkillId, number>>;
    preserveChances: Partial<Record<SkillId, number>>;
    doubleDropChances: Partial<Record<SkillId, number>>;
    // Global effects
    globalGatheringXPBonus: number;
    globalCraftingXPBonus: number;
    globalSpeedBonus: number;
    // Special effects (by ID)
    specials: Partial<Record<string, number>>; // e.g., { ore_insight_double_ore: 0.08 }
}

export class SynergyEngine {
    private synergyDefs: SynergyDef[];

    constructor(synergyDefs: SynergyDef[]) {
        this.synergyDefs = synergyDefs;
    }

    computePower(synergy: SynergyDef, player: PlayerState): number {
        const skills = this.getActiveSkillIds(synergy, player);
        const avgLevel = skills.reduce((sum, s) => sum + (player.skills[s]?.level ?? 0), 0) / skills.length;
        return Math.max(0, Math.min(50, Math.floor(avgLevel - synergy.minLevel)));
    }

    getActiveSkillIds(synergy: SynergyDef, player: PlayerState): SkillId[] {
        if (synergy.type === 'flex') {
            const state = player.synergies[synergy.id];
            const flexSkill = state?.flexSkillId ?? this.inferFlexSkill(synergy, player);
            return [flexSkill, synergy.skills[synergy.flexSkillIndex === 0 ? 1 : 0]];
        }
        return synergy.skills as SkillId[];
    }

    computeBonuses(player: PlayerState): SynergyBonusSet {
        // Iterate all synergies, compute their effects at current power
        // Aggregate into SynergyBonusSet
        // Apply caps and stacking rules
    }
}
```

### 5.3 Bonus Stacking Rules

**Critical design decision**: How do multiple synergies stack?

**Rule**: Additive within a category, multiplicative across categories.

```
total_xp_multiplier(skill) = 
    base_multiplier 
    * (1 + sum_of_all_synergy_xp_bonuses_for_this_skill / 100)
    * mastery_xp_multiplier
    * patron_xp_multiplier
    * global_haste_multiplier
```

This prevents exponential stacking (5 synergies × 5% XP = 25% bonus, not 1.05^5 = 28%). Clean, auditable, and satisfying.

### 5.4 Integration Points

| Location | Change |
|----------|--------|
| `useGameLoop.ts` | Call `SynergyEngine.computeBonuses(player)` on state change. Pass bonus set to tick processing. Apply `yieldMultipliers` and `xpMultipliers` to all skill gains. |
| `gameSlice.ts` | Replace `unlockedSynergies?: string[]` with `synergies: Record<string, SynergyState>`. Add `unlockSynergy(id)`, `setFlexSkill(synergyId, skillId)` actions. |
| `constants/synergies.ts` | Replace stub with full 25-synergy definition set. |
| `SkillHeroHeader.tsx` | Add synergy badge component (shows active synergies for this skill). |
| New: `SynergyJournalScreen.tsx` | Full synergy journal UI. |
| New: `SynergyDiscoveryModal.tsx` | Shown when a synergy becomes unlockable. |
| `WelcomeBackModal.tsx` | Include synergy unlocks in the "While You Were Away" summary if any unlocked while offline. |
| `LevelUpToast.tsx` | Check on level-up: if the new level triggers any synergy unlockable state, queue the Discovery Modal. |
| `MASTER_DESIGN_DOC.md` §6.4 | Update to reference this document. Mark synergies as implemented. |

### 5.5 Flex Synergy UX

For S22 (Cosmic Polymath) and S25 (Resonance Adept), the player must choose which skill to pair:

1. When the synergy becomes unlockable, show the Discovery Modal.
2. Instead of "Embrace the Flow", show a skill picker: "Choose which skill to synergize with [Skill]:"
3. List all eligible skills (not already in a synergy, not the primary skill).
4. Sort by level (highest first).
5. On selection, unlock the synergy with the chosen `flexSkillId`.
6. The synergy can be re-paired once per week (in Settings → Synergies → "Re-pair").

---

## 6. IMPLEMENTATION ROADMAP

### Phase 1 — Foundation (1–2 days)
1. Expand `constants/synergies.ts` with full 25-synergy definitions (data entry, no logic).
2. Update `gameSlice.ts` PlayerState: `synergies: Record<string, SynergyState>`.
3. Create `SynergyEngine.ts` in packages/engine (pure TS, no UI).
4. Add helper functions: `computeSynergyPower`, `getActiveSynergies`, `getSynergiesForSkill`.

### Phase 2 — Engine Integration (1–2 days)
5. Hook `SynergyEngine` into `useGameLoop.ts`: apply bonuses to XP, yield, speed.
6. Add `unlockSynergy` action to `gameSlice.ts`.
7. Wire synergy state to skill tick processing.
8. Test: verify Mining + Smithing 25+ gives visible ore yield bonus.

### Phase 3 — UI Layer (2–3 days)
9. Build `SynergyBadge` component (small icon + bonus shown in skill header).
10. Build `SynergyDiscoveryModal` (flavor text, effects, affirm button).
11. Build `SynergyJournalScreen` (full list, categories, near-unlock progress).
12. Add synergy badges to all skill screens.
13. Trigger Discovery Modal on level-up when synergy becomes unlockable.

### Phase 4 — Polish (1 day)
14. Add synergy unlock sound (distinct from level-up).
15. Add synergy count to Stats screen.
16. Add synergies to WelcomeBackModal if unlocked while offline.
17. Add "Re-pair" for flex synergies in Settings.

---

## 7. SYNERGY QUICK REFERENCE TABLE

| # | ID | Skills | Type | minLv | Category | Primary Effect |
|---|----|--------|------|-------|----------|----------------|
| S1 | ore_insight | Mining + Smithing | Pair | 25 | Production | +ore yield |
| S2 | fresh_catch | Fishing + Cooking | Pair | 25 | Production | +food buff duration, -burn |
| S3 | gourmet_brew | Cooking + Herblore | Pair | 25 | Production | potions restore HP |
| S4 | scrap_knight | Scavenging + Forging | Pair | 30 | Production | -bars consumed, auto-cleanse |
| S5 | forest_father | Logging + Woodworking | Pair | 25 | Production | +log yield, -logs consumed |
| S6 | flame_feast | Firemaking + Cooking | Pair | 20 | Efficiency | +cooking speed, -burn |
| S7 | runic_amplification | Runecrafting + Astrology | Pair | 30 | Discovery | +rune yield |
| S8 | herb_garden | Harvesting + Farming | Pair | 20 | Production | +yield both, -growth time |
| S9 | adept_scholar | Wizardry + Astrology | Pair | 25 | Discovery | +wizardry speed |
| S10 | elemental_fusion | Herblore + Astrology | Pair | 35 | Discovery | +potion potency |
| S11 | steady_hands | Mining + Agility | Pair | 20 | Efficiency | vein longevity |
| S12 | iron_will | Smithing + Agility | Pair | 30 | Efficiency | -fuel consumed, double bars |
| S13 | seamstress | Crafting + Tailoring | Pair | 25 | Efficiency | -materials consumed |
| S14 | double_duty | Fletching + Woodworking | Pair | 25 | Efficiency | double arrows |
| S15 | swift_sorcery | Runecrafting + Sorcery | Pair | 30 | Efficiency | rune preservation |
| S16 | armorsmith | Mining + Smithing + Forging | Chain | 40 | Production | +XP chain-wide |
| S17 | master_chef | Fishing + Cooking + Herblore | Chain | 40 | Production | +XP chain-wide, food buffs |
| S18 | lumberjack | Logging + Woodworking + Construction | Chain | 35 | Production | +XP chain-wide (partial) |
| S19 | runesmith | Mining + Runecrafting + Magic | Chain | 50 | Production | +XP chain-wide |
| S20 | the_alchemist | Harvesting + Herblore + Astrology | Chain | 45 | Discovery | +XP chain-wide |
| S21 | well_anchored | Mining + Fishing | Meta | 50 | Meta | global gathering XP |
| S22 | cosmic_polymath | Astrology + Flex | Meta/Flex | 60 | Meta | +paired skill XP |
| S23 | adept_crafter | Smithing + Crafting | Pair | 35 | Production | +bar quality, -bar consumed |
| S24 | void_walker | Scavenging + Exploration | Pair | 40 | Discovery | void fragments |
| S25 | resonance_adept | Resonance + Flex | Meta/Flex | 20 | Meta | -momentum decay |

---

## 8. OPEN QUESTIONS

1. **Should Chain Synergies (Type B) require all three skills at `minLevel`, or just any two of three?**  
   Recommendation: Any two of three. This makes chains more accessible while still rewarding full investment.

2. **Should synergies ever be re-selectable?**  
   For fixed synergies: no. For flex synergies (S22, S25): yes, but with a weekly cooldown to prevent exploit farming.

3. **Should synergy power decay if a constituent skill drops below minLevel?**  
   No. Synergies are permanent unlocks. The power level reflects your current skill levels, but the synergy itself cannot be "un-synergized."

4. **Should there be a cap on total synergy bonuses?**  
   Yes — cap total additive XP bonus from all synergies at +50% per skill. This prevents the "everything gives XP" problem.

5. **Should the Synergy Journal have a "theorycraft" mode showing potential bonuses at hypothetical levels?**  
   Nice-to-have. Not in initial implementation (YAGNI).

---

## 9. RELATIONSHIP TO EXISTING SYSTEMS

| System | Relationship |
|--------|-------------|
| **Mastery** | Synergies are separate from mastery upgrades. A skill with maxed mastery AND an active synergy gets both bonuses. |
| **Mini-Specs** | Synergies do not interact with mini-specs (level 25 choice). |
| **Specializations** | Synergies do not interact with specializations (level 50 choice). |
| **Transcendence** | After transcendence (level 99 → 1), synergies remain unlocked. Their power will be low (skills reset to 1) but the synergy bonus is always active when skills rebuild. |
| **Item Mastery** | Synergies provide global/per-skill multipliers. Item Mastery provides per-item bonuses. They are fully orthogonal and stack. |
| **Astrology** | Astrology has three synergies (S7, S10, S22). This makes Astrology the "synergy enabler" skill — high Astrology unlocks meta synergies across all other skills. |
| **Resonance** | S25 (Resonance Adept) bridges the clicker mechanic with passive skilling, reinforcing the "clicking powers everything" loop. |
