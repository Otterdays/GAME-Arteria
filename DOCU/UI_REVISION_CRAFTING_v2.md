# Crafting UI v2.0 — Radial Mastery Design

**Date:** 2026-03-13  
**Skill:** Crafting  
**Previous Design:** Category-based card list  
**New Design:** Radial recipe wheel with gestural selection

---

## The Redesign

Completely replaced the old category-card layout with a **radial/arc recipe selector** paradigm:

### Visual Changes

| Before | After |
|--------|-------|
| Vertical scroll of category sections | Circular recipe wheel with center orb |
| Card list with tier headers | Recipe nodes positioned in concentric circles |
| Linear XP bar at top | Circular XP ring around center orb |
| "Forge" button on each card | Single detail panel at bottom |
| Category filtering (Materials/Armour/Jewelry) | Tier visualization (Novice→Expert) |

### New Components

1. **Center Orb** — Shows active recipe emoji, skill level, floating XP pop
2. **XP Ring** — Circular progress bar around the wheel
3. **Recipe Nodes** — Positioned by tier in concentric circles:
   - Tier 1 (Novice, Lv 1-10): Inner circle
   - Tier 2 (Apprentice, Lv 11-25): Second ring
   - Tier 3 (Journeyman, Lv 26-40): Third ring
   - Tier 4 (Expert, Lv 41+): Outer ring
4. **Detail Panel** — Bottom sheet showing selected recipe info, materials, action button

### Interactions

- **Tap a node** — Select recipe, show in detail panel
- **Tap center orb** — Nothing (visual anchor)
- **Bottom craft button** — Start/stop selected recipe
- **Swipe detail panel** — Could be extended to dismiss (future)

### Visual States

| State | Indicator |
|-------|-----------|
| Selected | Gold border + scale up |
| Active (crafting) | Skill-colored glow + progress bar |
| Locked | Grayed out, 50% opacity |
| Affordable (materials ready) | Green border hint |

---

## Why This Competes with Woodworking

| Woodworking Workbench | Crafting Radial |
|----------------------|-----------------|
| Category rail (Furniture/Combat/Utility) | Tier rings (Novice→Expert) |
| Input/output slots visible | Materials in detail panel only |
| Sticky dock with action | Floating detail panel |
| "Workspace" metaphor | "Skill tree" metaphor |
| Good for 5-10 recipes | Scales to 20+ recipes |

The radial design is more **visual and spatial** — players see their progression as distance from center. It works better for Crafting because:
- More recipes than Woodworking
- Clear level-tier progression
- Jewelry/Armor/Leather are tier-unlocked, not category-browsed

---

## Technical Notes

- **File:** `apps/mobile/app/skills/crafting.tsx`
- **New helpers:** `getRecipeTier()`, `getTierColor()`, `getNodePosition()`
- **Dependencies:** Same as Woodworking (BouncyButton, SmoothProgressBar, etc.)
- **No new components** — pure layout change within existing primitives

---

## Future Enhancements

1. **Rotation gesture** — Spin the wheel to browse
2. **Zoom** — Pinch to see outer tiers
3. **Unlock animation** — Node flies from center when level reached
4. **Path visualization** — Show line connecting unlocked nodes
