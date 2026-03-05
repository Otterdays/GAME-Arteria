I have completed a comprehensive research and audit of the Crafting and Skills systems in Arteria. My research covered the master design documents, the current phased roadmap, core engine logic, and the specific implementations of all gathering and crafting skills.

🛠️ Crafting & Skills Audit Summary
1. Implementation Status
The game is currently in Phase 3 (The Crafting Engine). Most gathering skills are functional, and the core processing skills (Smithing, Forging, Cooking) have been implemented with a consistent "Node-Card" UI pattern.

Skill Pillar	Implemented Skills	Unimplemented / Planned
Gathering	Mining, Logging, Fishing	Harvesting, Scavenging
Crafting	Smithing, Forging, Cooking	Runecrafting (Refining), Alchemy, Tailoring, Fletching
Support	Mastery System, Pets	Leadership (Companions), Construction
2. Core Mechanics & Architecture
Tick-Based Engine: The @arteria/engine package handles the core logic (

TickSystem.ts
, 

GameEngine.ts
). Ticks represent discrete actions (mining an ore, smelting a bar) that produce XP and items.
Offline Progression: The game calculates "While You Were Away" progress by simulating ticks based on elapsed time (clamped to a 24-hour cap for F2P or 7 days for Patrons).
Progressive Dependencies: The crafting loop is now closed for metals: Mining (Ore) → Smithing (Bars) → Forging (Equipment). Cooking follows a similar loop: Fishing (Raw Fish) → Cooking (Cooked Food).
Mastery System: A separate progression layer grants permanent buffs (e.g., +XP%) by spending points earned during level-ups.
3. Improvement Opportunities (Technical & UX)
While the foundation is solid, I've identified several areas for optimization and expansion:

[Technical] Engine Consolidation: Currently, 

useGameLoop.ts
 contains inlined engine math (XP tables, tick processing) to avoid workspace linking issues. Transitioning to a direct import from @arteria/engine would improve maintainability.
[Implementation] Crafting Queue (Phase 3.1): The Roadmap explicitly lists a "Crafting Queue Architecture" supporting up to 8 hours of queued actions. This is currently not implemented and represents the biggest missing piece of the crafting pillar.
[UX] Resource Discovery: The "Used in" feature in the Bank is a great start, but adding a "Go to Recipe" shortcut within the Bank item detail modal would significantly close the loop for players.
[Logic] Heat Management (Future): Smithing is slated for an "Active Mechanic" where tapping to keep heat in a green zone grants multipliers. This would move crafting from purely passive to hybrid active/passive.
🗺️ Roadmap Outlook
The next major focus areas based on the 

ROADMAP.md
 and 

IMPROVEMENTS.md
 are:

Crafting Queue Logic: Enabling multi-task processing while offline.
Leadership Skill & Companions: Implementing "Wandering Souls" (Barnaby, Yvette, Reginald) as hireable NPCs who can auto-gather/craft for the player.
Combat Pillar (Phase 4): Transitioning from the current Bestiary groundwork (enemy spotting) to active loadouts and combat encounters.
TIP

Priority Recommendation: Focus on the Crafting Queue Architecture (Phase 3.1) next. It's the most requested feature in the roadmap and would fundamentally change how players interact with processing skills like Smithing and Cooking.

I have updated the 

SCRATCHPAD.md
 (active memory) and 

My_Thoughts.md
 to reflect these research findings and ensure persistent context for our next development session.