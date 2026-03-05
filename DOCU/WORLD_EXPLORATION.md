# World Exploration — Design for Arteria (Idle RPG)

> **Purpose:** Design the explorative world structure for Arteria. The world must feel like an actual place (towns, regions, seasonal areas) while being **specifically tailored for an idle game** — no real-time travel, no walking sim, instant selection-based navigation.
> **Last updated:** 2026-03-05
> **See also:** MASTER_DESIGN_DOC (Valdoria regions), ROADMAP (Explore tab), STORYLINE (lore)

---

## 1. Core Principle: Idle-Friendly Exploration

**What exploration is NOT in Arteria:**
- Real-time walking or travel
- Movement speed, distance, or travel time
- Open-world free roam

**What exploration IS:**
- **Location selection** — Tap a place → you're there. Instant.
- **Locations** — Distinct areas with their own NPCs, ambiance, shops, quests.
- **Unlocks** — Some locations gated by quest flags, levels, or calendar (seasonal).
- **Discovery** — Unlocking a new location feels like opening a new chapter.

**Design mantra:** *"Where do you want to be?" not "How do you get there?"*

---

## 2. World Structure

### 2.1 Hub: The Crownlands (Current Town)

The **Crownlands** is the player's home base — the central hub. This is where we are now:
- NPCs in Town (Guard, Nick, Bianca, Kate)
- Shop (Nick)
- Daily quests, lore, skills (global — not location-locked)

**Implementation:** Quests tab "NPCs in Town" = Crownlands NPCs. Shop = Nick's Crownlands stall.

### 2.2 Locations (Explorable Areas)

Each **Location** is a distinct area the player can "travel" to by tapping. Travel is instant.

| Location ID | Name | Theme | Unlock | Notes |
|-------------|------|-------|--------|-------|
| `crownlands` | Crownlands | Central hub, market, gates | Always | Default. Current town. |
| `frostvale` | Frostvale | Christmas, snow, lights, Voidmas | Seasonal (Dec) or quest | MASTER_DESIGN: Voidmas. Gift-giving, festive NPCs. |
| `whispering_woods` | Whispering Woods | Enchanted forest, sentient trees | Quest or level | MASTER_DESIGN: Gossiping trees. |
| `fey_markets` | Fey Markets | Planar crossover, otherworldly traders | Timed event or quest | MASTER_DESIGN: Limited-time traders. |
| `scorched_reach` | Scorched Reach | Volcanic, Voidmire pools | Level / quest | MASTER_DESIGN: Void-Touched Collective. |
| `skyward_peaks` | Skyward Peaks | Mountains, Celestial Spires | Late-game | MASTER_DESIGN: Celestial Bureaucracy. |

### 2.3 Seasonal Locations

**Frostvale** (Christmas-themed town):
- **Availability:** December (real-world) or "Voidmas" event window. Alternatively: always available but *enhanced* in December (extra NPCs, shop items, quests).
- **Ambiance:** Snow, lights, cozy. Void-Touched twist: "Voidmas" — ominous but festive. Eldritch wrapping paper.
- **NPCs:** Festival host, gift-giver, maybe a Void-Touched caroler.
- **Shop:** Seasonal items (cosmetics, limited recipes, Voidmas-exclusive).
- **Quests:** "Deliver gifts," "Light the Voidmas tree," etc.

**Fey Markets:**
- **Availability:** Rotating (e.g. weekends, or random 48h windows).
- **Ambiance:** Planar crossover, otherworldly stalls.
- **Shop:** Rare materials, unique recipes.

---

## 3. Navigation Model

### 3.1 Explore Tab = World Map

The **Explore** tab (currently hidden) becomes the **World Map**:
- List or grid of **Location cards**
- Each card: name, emoji, short description, lock state (locked / available / current)
- Tap card → navigate to that location's screen

### 3.2 Location Screen

When you "travel" to a location, you see:
- **Header:** Location name, theme emoji, ambiance line
- **NPCs:** List of NPCs in this location (Talk buttons)
- **Shop (if any):** Location-specific catalog (e.g. Frostvale seasonal shop)
- **Quests (if any):** Location-specific quests or radiant offers
- **Back:** Return to World Map (Explore tab)

### 3.3 No Travel Time

- No "You are traveling..." delay
- No stamina or cost for switching locations (unless we add a "travel ticket" for premium locations later)
- Switching is instant — like changing tabs

---

## 4. Unlock Model

| Unlock Type | Example |
|-------------|---------|
| **Always** | Crownlands |
| **Quest flag** | Whispering Woods after `knows_about_sneeze_cult` |
| **Level** | Scorched Reach at Mining 40 |
| **Calendar** | Frostvale in December |
| **Event** | Fey Markets during "Fey Market Weekend" |
| **Lumina** | Optional: "Travel pass" for early access to seasonal |

---

## 5. Implementation Phases

### Phase A: Foundation (Low effort) — ✅ Done 2026-03-05
- [x] Define `LOCATIONS` constant: id, name, emoji, description, unlockType, unlockValue (`constants/locations.ts`)
- [x] Unhide Explore tab; replace stub with World Map (location cards)
- [x] "Travel" = navigate to `/location/[id]`; location screen shows NPCs, Shop, Quests
- [x] Crownlands = NPCs (Talk) + Shop link. Other locations: "Coming soon" banners for NPCs, Shop, Quests

### Phase B: Frostvale (Christmas Town)
- [ ] Add `frostvale` location
- [ ] Frostvale screen: NPCs, seasonal shop (if Dec), ambiance
- [ ] Unlock: December only, or always with Dec enhancement
- [ ] Kate's dialogue already teases Frostvale

### Phase C: More Locations
- [ ] Whispering Woods, Fey Markets, Scorched Reach
- [ ] Per-location NPCs, shops, quests
- [ ] Unlock logic in `meetsLocationRequirement(player, locationId)`

### Phase D: Seasonal / Event System
- [ ] `getActiveEvents()` — returns current events (Voidmas, Fey Market, etc.)
- [ ] Location availability depends on event
- [ ] "Coming soon" for locked seasonal locations

---

## 6. Content Per Location (Template)

For each location, define:
- **id:** string
- **name:** string
- **emoji:** string (e.g. 🎄 Frostvale, 🌲 Whispering Woods)
- **description:** One-line flavor
- **unlockType:** 'always' | 'quest' | 'level' | 'calendar' | 'event'
- **unlockValue:** questId, level, date range, or eventId
- **npcIds:** string[] — NPCs present here
- **shopId:** string | null — location-specific shop (optional)
- **questIds:** string[] — location-specific quests (optional)

---

## 7. Frostvale (Christmas Town) — Detailed Spec

**Theme:** Cozy winter, snow, lights. Void-Touched twist: Voidmas — slightly ominous but festive. Cosmic comedy.

**NPCs (candidates):**
- **Festival Host** — Runs Voidmas events, explains the holiday
- **Gift-Giver** — Exchange items for Voidmas presents
- **Void-Touched Caroler** — Sings in echoes, gives lore

**Shop:**
- Voidmas wrapping paper (cosmetic)
- Seasonal recipes (e.g. Voidmas fruitcake — food buff)
- Limited-time items

**Quests:**
- "Light the Voidmas Tree" — gather X items, reward Lumina
- "Deliver Gifts" — bring Y to Z NPCs

**Unlock:** December 1–31 (real-world). Or: always visible, "enhanced" in December.

---

## 8. Doc References

- **MASTER_DESIGN_DOC** §I — Valdoria regions, Fey Markets, Voidmas
- **ROADMAP** — Explore tab, Phase 6 (Story)
- **STORYLINE** — Lore for regions
- **PEOPLE_TO_ADD** — Kate (Traveler) teases Frostvale

---

*Append new locations and refinements; do not delete.*
