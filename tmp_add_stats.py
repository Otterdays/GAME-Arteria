import re

with open(r"c:\Users\home\Desktop\Arteria\apps\mobile\constants\items.ts", "r", encoding="utf-8") as f:
    lines = f.readlines()

TIERS = {
    'bronze': 1,
    'iron': 2,
    'steel': 3,
    'mithril': 5,
    'adamant': 8,
    'runite': 14
}

for i in range(len(lines)):
    line = lines[i]
    if "type: 'equipment'" in line:
        match = re.search(r'([a-z]+)_(dagger|shortsword|longsword|scimitar|2h_longblade|half_helmet|full_helmet|platebody|shield):', line)
        if match:
            tier_name = match.group(1)
            item_type = match.group(2)
            tier_mult = TIERS.get(tier_name, 1)

            slot = ""
            stats = ""
            if item_type == "dagger":
                slot = "weapon"
                stats = f"attackSpeed: 1800, accuracy: {2*tier_mult}, maxHit: {1*tier_mult}"
            elif item_type == "shortsword":
                slot = "weapon"
                stats = f"attackSpeed: 2400, accuracy: {3*tier_mult}, maxHit: {2*tier_mult}"
            elif item_type == "longsword":
                slot = "weapon"
                stats = f"attackSpeed: 3000, accuracy: {4*tier_mult}, maxHit: {3*tier_mult}"
            elif item_type == "scimitar":
                slot = "weapon"
                stats = f"attackSpeed: 2400, accuracy: {4*tier_mult}, maxHit: {2*tier_mult}"
            elif item_type == "2h_longblade":
                slot = "weapon"
                stats = f"attackSpeed: 3600, accuracy: {5*tier_mult}, maxHit: {5*tier_mult}"
            elif item_type == "half_helmet":
                slot = "head"
                stats = f"meleeDefence: {2*tier_mult}, rangedDefence: {1*tier_mult}, magicDefence: 0"
            elif item_type == "full_helmet":
                slot = "head"
                stats = f"meleeDefence: {3*tier_mult}, rangedDefence: {2*tier_mult}, magicDefence: {-1*tier_mult}"
            elif item_type == "platebody":
                slot = "body"
                stats = f"meleeDefence: {8*tier_mult}, rangedDefence: {6*tier_mult}, magicDefence: {-4*tier_mult}"
            elif item_type == "shield":
                slot = "shield"
                stats = f"meleeDefence: {6*tier_mult}, rangedDefence: {5*tier_mult}, magicDefence: {-3*tier_mult}"
            
            new_line = line.replace("type: 'equipment' }", f"type: 'equipment', equipSlot: '{slot}', equipmentStats: {{ {stats} }} }}")
            lines[i] = new_line

with open(r"c:\Users\home\Desktop\Arteria\apps\mobile\constants\items.ts", "w", encoding="utf-8") as f:
    f.writelines(lines)
