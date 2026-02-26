This is a comprehensive research breakdown and baseline feature sheet for a mobile application like **Melvor Idle**.

Melvor Idle is essentially a deconstructed RPG (Role-Playing Game) stripped of the exploration and real-time action, focusing entirely on the math, progression, and resource management systems found in games like *RuneScape*.

Below is a structured baseline sheet divided by functional modules.

### **1. Core Engine & Math Architecture**
*This is the "brain" of the app. Melvor is not a graphical action game; it is a math simulator.*

| Feature | Description | Data Requirements |
| :--- | :--- | :--- |
| **Game Loop Type** | **Passive/Idle (Real-Time).** The game calculates actions based on time elapsed, even when the app is closed. | Global Timer variable; Timestamps for action start/end. |
| **Offline Progression** | The critical feature. Upon app open, the system calculates `CurrentTime - LastSaveTime` and simulates the results of that duration instantly. | Requires robust save-state system (JSON or Local Database). |
| **Tick System** | Actions occur on "ticks" (e.g., every 0.6 seconds or custom intervals). | Action Interval timers; Accumulator variables (for partial actions). |
| **RNG (Random Number Gen)** | Used for drops, fishing success, mining chance, and hit accuracy. | Seed-based algorithms; Drop tables (Weighted probability lists). |

---

### **2. Player Stat System (The RPG Framework)**
*The player character is essentially a container for numerical values.*

| Feature | Description | Data Requirements |
| :--- | :--- | :--- |
| **Skills System** | Individual levels for specific activities (e.g., Mining, Fishing, Woodcutting). Each level increases efficiency or unlocks items. | `SkillID`, `CurrentXP`, `Level`, `MasteryXP`. |
| **XP Curves** | Exponential scaling. Level 1 requires 83 XP; Level 99 requires 13 million XP. | XP Lookup Table (Array/Dictionary). |
| **Player Stats** | Combat stats (Hitpoints, Attack, Strength, Defense, Speed) and non-combat stats (Skill Mastery). | Stat Dictionary; Buff/Debuff modifiers. |
| **Mastery System** | A "skill-within-a-skill." You don't just level Mining; you level mastery over specific rocks (e.g., Copper Mastery). | Nested data structures: `Skill -> Item -> MasteryXP`. |

---

### **3. Skill Categories (Gameplay Loops)**

#### **A. Gathering Skills (Resource Acquisition)**
*The player selects a resource; the game rolls for success over time.*
*   **Mining:** Select rock type -> Wait for tick -> Roll for success -> Receive Ore + XP.
*   **Woodcutting:** Select tree type -> Wait -> Receive Logs + XP.
*   **Fishing:** Select fish type -> Wait -> Receive Fish + XP.
*   **Farming:** (Time-based) Plant seed -> Wait X hours -> Harvest. Requires timing management.

#### **B. Artisan Skills (Resource Conversion)**
*The player converts Resource A into Resource B for XP.*
*   **Smithing:** Ore -> Bars -> Equipment. (Requires specific quantities).
*   **Cooking:** Raw Fish -> Cooked Fish. (Chance to burn food based on level).
*   **Crafting / Fletching:** Materials -> Ranged Armor / Arrows / Bows.

#### **C. Support Skills**
*   **Herblore:** Combining herbs with secondaries to create potions (Buffs).
*   **Agility:** Building obstacle courses to provide permanent passive buffs to other skills.

---

### **4. Combat System**
*Melvor combat is automated "Auto-Battler" style.*

| Feature | Description | Data Requirements |
| :--- | :--- | :--- |
| **Combat Styles** | Melee, Ranged, Magic. Triangle of advantages (Accuracy/Defense calculations). | Weapon Type definitions; Ammo requirements (Arrows/Runes). |
| **Enemy AI** | Enemies have specific stats (HP, Attack Speed, Max Hit). They attack the player automatically. | Enemy Database; Attack speed timers. |
| **Loot Tables** | Upon enemy defeat, the game rolls a table to determine what items drop. | Loot Table (ItemID, DropChanceWeight). |
| **Slayer System** | A task-based system. "Kill 50 Crabs." Grants bonus rewards upon completion. | Task generation logic; Kill counters. |
| **Dungeons** | A sequence of fights. Defeat 5 enemies in a row to open a chest. | Dungeon configuration (EnemyID array). |

---

### **5. Economy & Inventory**

| Feature | Description | Data Requirements |
| :--- | :--- | :--- |
| **Bank System** | Infinite or expandable storage for all items. Unlike MMOs, there is no weight limit usually, just slot limits. | `Inventory[]` Array; ItemID & Quantity. |
| **Shop System** | An NPC vendor to sell items for Gold and buy basic supplies. | Buy/Sell price multipliers (e.g., sell for 10% of value). |
| **Equipment System** | Paper-doll slots (Head, Body, Legs, Weapon, Shield, Boots, Ring, Amulet). Items provide stat bonuses. | EquipReq (Level requirements); StatBonus struct. |

---

### **6. UI/UX Requirements (Mobile Specific)**
*Since the game is largely menus and numbers, the UI is the product.*

| Feature | Description |
| :--- | :--- |
| **Navigation** | Sidebar or Bottom Nav bar for switching between Skills, Combat, and Bank. |
| **Visual Feedback** | Minimal animations. Progress bars are king (Filling up as an action completes). |
| **Tooltips** | Long-press or tap to see detailed stats on items (e.g., "Dragon Scimitar: +66 Slash Accuracy"). |
| **Skilling Interface** | Skill selection menu -> Recipe selection (e.g., "Smith Bronze Dagger"). |
| **Combat Interface** | HP Bars (Player vs Enemy), Auto-attack logs (scrolling text of damage dealt), and Potion indicators. |

---

### **7. Technical & Monetization Data**

| Feature | Implementation Note |
| :--- | :--- |
| **Save System** | **Crucial.** Must handle large JSON files. Cloud sync (Google Play Games / iCloud) is highly recommended to prevent save loss. |
| **Modding API** | Melvor thrives on community mods. Consider structuring your data (Items, Enemies) in external JSON files rather than hardcoding them, so users can add their own content. |
| **Monetization** | **Freemium / B2P.** Melvor offers a free version (limited skills) and a paid version (Full game + Expansions). **No Ads/No IAP Currency** is a key selling point for this genre. |

---

### **Summary: MVP (Minimum Viable Product) Feature List**

If you are building a prototype, you need these absolute basics:

1.  **The Engine:** A timer that runs while the app is closed.
2.  **One Gathering Skill:** (e.g., Mining). Data: Rock Object, Ore Item, XP rates.
3.  **One Artisan Skill:** (e.g., Smithing). Data: Recipe (Ore -> Bar), XP rates.
4.  **Inventory System:** A list to store the Ore and Bars.
5.  **Combat:** One monster to fight automatically.
6.  **UI:** A way to view the Inventory and start the Skills.

### **Suggested Tech Stack for Development**

*   **Engine:** **Unity** (C#) or **Godot**. Both handle UI-heavy games well. Melvor actually started as a web app (JavaScript/HTML5).
*   **Data Format:** JSON for all game data (Items, Monsters, Skill definitions).
*   **Database:** Local SQLite or JSON serialization for saves; Firebase or PlayFab for cloud saves.