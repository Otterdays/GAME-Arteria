# Skill Capes — Master Reference

> **Purpose:** Single source of truth for the Skill Cape system. All capes are purchasable from the Ascended Master in the Shop tab upon reaching Level 99 in a skill.
> **Last updated:** 2026-03-13
> **See also:** [SKILLS_ARCHITECTURE.md](SKILLS_ARCHITECTURE.md) §14, [SUMMARY.md](SUMMARY.md)

---

## 1. Overview

| Aspect | Design |
|--------|--------|
| **Requirement** | Reach Level 99 (max) in any given skill |
| **Vendor** | The Ascended Master (Shop tab) |
| **Cost** | 99,000 gold per cape |
| **Equip slot** | `cape` |
| **Base stats** | meleeDefence: 15, rangedDefence: 15, magicDefence: 15 |

---

## 2. Cape Registry (All Skills)

| Skill | Item ID | Status |
|-------|---------|--------|
| Mining | `skill_cape_mining` | ✅ |
| Logging | `skill_cape_logging` | ✅ |
| Harvesting | `skill_cape_harvesting` | ✅ |
| Scavenging | `skill_cape_scavenging` | ✅ |
| Fishing | `skill_cape_fishing` | ✅ |
| Astrology | `skill_cape_astrology` | ✅ |
| Runecrafting | `skill_cape_runecrafting` | ✅ |
| Smithing | `skill_cape_smithing` | ✅ |
| Forging | `skill_cape_forging` | ✅ |
| Cooking | `skill_cape_cooking` | ✅ |
| Herblore | `skill_cape_herblore` | ✅ |
| Crafting | `skill_cape_crafting` | ✅ |
| Woodworking | `skill_cape_woodworking` | ✅ |
| Agility | `skill_cape_agility` | ✅ |
| Leadership | `skill_cape_leadership` | ✅ |
| Summoning | `skill_cape_summoning` | ✅ |
| Slayer | `skill_cape_slayer` | ✅ |
| Thieving | `skill_cape_thieving` | ✅ |
| Firemaking | `skill_cape_firemaking` | ✅ |
| Exploration | `skill_cape_exploration` | ✅ |
| Wizardry | `skill_cape_wizardry` | ✅ |
| Sorcery | `skill_cape_sorcery` | ✅ |
| Resonance | `skill_cape_resonance` | ✅ |
| Farming | `skill_cape_farming` | ✅ |
| Fletching | `skill_cape_fletching` | ✅ |
| Tailoring | `skill_cape_tailoring` | ✅ |

---

## 3. Shop Logic

- **Location:** Shop tab → Ascended Master section
- **Visibility:** Capes appear only for skills where `player.skills[skillId].level >= 99`
- **Source:** `IMPLEMENTED_SKILLS` drives which capes can appear; item IDs follow `skill_cape_${skillId}`
- **Code:** `apps/mobile/app/(tabs)/shop.tsx` — `eligibleCapes` filters by level 99

---

## 4. Future: Passive Perks (Planned)

Per SKILLS_ARCHITECTURE §14.4, each cape may eventually grant a unique passive:

| Cape | Planned Perk |
|------|--------------|
| Mining | +5% double-ore chance |
| Logging | +10% chance to not deplete tree |
| Forging | +15% chance to forge without consuming bars |
| Runecrafting | 10% chance to craft Void Rune alongside standard |
| Harvesting | Auto-replant seeds if owned |

*Not yet implemented; capes currently provide base stats only.*

---

## 5. Future: Emote System (Phase 2)

Per SKILLS_ARCHITECTURE §14.5: "Emote" button while cape equipped plays unique animation and logs *"The player flexes their mastery of [Skill]!"* — not yet implemented.

---

## 6. Data Locations

| Resource | Path |
|----------|------|
| Item definitions | `apps/mobile/constants/items.ts` |
| Shop eligibility | `apps/mobile/app/(tabs)/shop.tsx` |
| IMPLEMENTED_SKILLS | `apps/mobile/constants/skills.ts` |
