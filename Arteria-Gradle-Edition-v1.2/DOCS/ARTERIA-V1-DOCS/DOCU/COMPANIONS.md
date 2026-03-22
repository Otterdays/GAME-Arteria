# COMPANIONS (Wandering Souls)

> [!WARNING]
> **ATTENTION:** Do NOT remove or delete existing content. Only append, compact, or update.

> **Source of truth** for companion design. See MASTER_DESIGN_DOC §Companion System for high-level overview; ROADMAP §5.3 for implementation tasks.

---

## 1. Overview

**Wandering Souls** are hireable NPCs who assist the player in gathering, crafting, combat, and inventory management. They are gated by the **Leadership** skill (Support pillar), which dictates how many companions can be active at once.

**Unlock requirements** use Leadership levels (not a vague "Level 20") so progression is concrete:
- **Barnaby the Uncertain** — Leadership 20
- **Scholar Yvette** — Leadership 35
- **Sir Reginald Pomp** — Leadership 50

---

## 2. Companion Progression: Levels Like a Player

**Design decision (2026-03-04):** Companions gain levels just like the player. They have their own skill levels and use them for skilling, crafting, and collecting.

### 2.1 How It Works

- Each companion has a **skill profile** (XP and levels per skill, similar to `SkillState`).
- When assigned to a task (Auto-Gather, Auto-Craft, Auto-Combat), the companion earns XP in the relevant skill(s).
- Companion skill levels gate what they can do:
  - **Skilling/Gathering:** Companion can only gather from nodes they meet the level requirement for (e.g. Mining 30 → can mine up to Mithril).
  - **Crafting:** Companion can only craft recipes they meet the level requirement for.
  - **Collecting:** Same logic for Harvesting, Fishing, Logging, Scavenging, etc.
- Higher companion levels = better yields, faster ticks, or access to higher-tier content when assigned.

### 2.2 Implications

- Companions are a **parallel progression system** — they level up as they work.
- Assigning a companion to Mining 50 nodes while they are Mining 20 means they train Mining until they can access those nodes.
- Players may choose to "train" companions on easier content first to unlock harder content later.
- Companion levels do **not** contribute to player Total Level; they are separate.

---

## 3. Design Uncertainties (TBD)

All open questions and unresolved design decisions. Resolve before or during implementation.

### 3.A Progression & Leveling

- Do companions share the same XP curve as the player (RuneScape-style)?
- Can companions be assigned to multiple skills/tasks at once, or one task at a time?
- Do companion levels cap at 99?
- Do companions have a "primary" skill they excel at (e.g. Barnaby → Attack/Strength)?
- Do companions start at level 1 in all skills, or with some baseline?
- In combat: Do companions earn XP in Attack/Strength/Defence/etc.? Which combat skills apply?

### 3.B Auto-Gather & Auto-Craft

- Do yields and speed scale with companion level? If so, by how much?
- Where do gathered resources go? Player bank directly, or a "companion inventory" that must be collected?
- Offline: Do companions continue gathering/crafting while the player is offline? Same 24h cap as player?
- Auto-Craft queue: Does the companion use the player's materials from the bank, or a separate stash?

### 3.C Roster & Traits

- **Yvette:** Can she be assigned to Runecrafting, Alchemy, or other research-adjacent skills? Which skills is she best at?
- **Reginald:** Does his knight archetype affect combat (e.g. tank, loot filtering)? Or is he purely passive (auto-sell)?
- **Barnaby:** Does his trait apply only in combat, or also when assigned to gathering (e.g. 2× yield, 50% chance to "drop" the resource)?

### 3.D Leadership & Economy

- Exact Leadership → companion cap mapping (e.g. L20→1, L35→2, L50→3). Is this the final curve?
- What are "Companion buffs" from Leadership? Global multipliers? Unlock perks?
- Is there any cost to hire or maintain companions (gold, Lumina, upkeep)?

### 3.E UI & UX

- Companion detail panel: What stats are shown? (Levels per skill? XP to next? Trait description? Current task?)
- Can the player swap a companion's task mid-session, or only when idle?
- PvP defense: How are companion levels/traits used when defending? Mirror live state or snapshot?

---

## 4. Companion Roles & Uses

### 4.1 Auto-Gather (Skilling / Collecting)

- Assign a companion to a gathering skill (Mining, Logging, Fishing, Harvesting, Scavenging).
- Companion gathers resources while the player is offline or doing something else.
- Companion's level in that skill determines which nodes/recipes they can access.
- Yields and speed may scale with companion level (see §3.B).

### 4.2 Auto-Craft (Crafting)

- Assign a companion to a crafting skill (Smithing, Forging, Runecrafting, Cooking, etc.).
- Companion crafts items in a queue while offline.
- Scholar Yvette specifically: +30% crafting speed, 5% chance per craft to "explode" (partial resource refund + funny quote).
- Companion's level gates which recipes they can craft.

### 4.3 Auto-Combat

- Assign a companion to accompany the player in combat instances.
- Companions join the player in dungeons, wilderness, etc.
- Combat flow: **Scout → Prepare (loadout, companions, consumables) → Engage → Resolve**.
- Companion traits apply during combat (e.g. Barnaby's 2× damage / 50% hit-self).
- **The Warden** combat style: Pet/companion focused, tactical positioning.

### 4.4 Passive / Inventory

- **Sir Reginald Pomp:** Automatically sells grey-tier (junk) items for gold. Delivers long speeches about each one (flavor).
- No assignment needed; passive effect when he is in the roster.

---

## 5. Roster: Barnaby, Yvette, Reginald

| Companion | Role | Unlock | Trait |
|-----------|------|--------|-------|
| **Barnaby the Uncertain** | Warrior | Leadership 20 | 2× damage, 50% chance to hit himself instead. Optimistic regardless. |
| **Scholar Yvette** | Researcher | Leadership 35 | +30% crafting speed. 5% chance per craft to explode — partial resource refund + funny quote. |
| **Sir Reginald Pomp** | Knight | Leadership 50 | Auto-sells grey junk for gold. Long speeches per item (flavor). |

### 5.1 Barnaby

- **Combat:** Joins in combat; deals 2× damage but 50% chance to hit himself.
- **Active combat flavor:** "I'm feeling confident! (50% confidence buff)"
- **Character quest:** "Barnaby's Confidence" — 10-quest chain unlocks his "Certain" form (no self-damage).

### 5.2 Scholar Yvette

- **Crafting:** Speeds up crafting queues; occasional lab explosions (partial refund).
- **Skilling:** Can be assigned to Runecrafting, Alchemy, or other research-adjacent skills (see §3.C).

### 5.3 Sir Reginald Pomp

- **Inventory:** Auto-sells junk items. Aristocratic knight who delivers eloquent speeches about each discarded item.
- **Combat:** Can join combat (knight archetype); trait may affect loot or selling (see §3.C).

---

## 6. Leadership & Cap

- **Leadership** skill gates the maximum number of active companions (e.g. Leadership 20 → 1 companion, 35 → 2, 50 → 3).
- UI: "Companions: 2/3" style display.
- Leadership also provides "Companion buffs" (future); guild bonuses (future). See §3.D for uncertainties.

---

## 7. UI & Implementation Notes

- **Companion Tasks UI:** Drag-and-drop or select menu to assign companions to Auto-Gather or Auto-Combat (ROADMAP).
- **Companion detail panel:** Tap companion to see stats, trait description, current task.
- **Unlock teaser:** "Unlock Barnaby at Leadership 20" style messaging.
- **PvP:** Companions can be part of "defense team" loadout for async PvP attacks (Phase 8). See §3.E for uncertainties.

---

## 8. Cross-References

| Doc | Section |
|-----|---------|
| MASTER_DESIGN_DOC | §Companion System, §Combat Flow, §Character Quests |
| ROADMAP | §5.3 Companion System (Wandering Souls), §8.3 PvP |
| STORYLINE | Fey Markets (Barnaby intro) |
| index.html | Companions section (website) |

---

*Last updated: 2026-03-04. Added §3 Design Uncertainties; consolidated all TBD/open questions.*
