import re
import pprint

files = {
    'mining': 'apps/mobile/constants/mining.ts',
    'logging': 'apps/mobile/constants/logging.ts',
    'fishing': 'apps/mobile/constants/fishing.ts',
    'harvesting': 'apps/mobile/constants/harvesting.ts',
    'scavenging': 'apps/mobile/constants/scavenging.ts',
    'runecrafting': 'apps/mobile/constants/runecrafting.ts',
    'smithing': 'apps/mobile/constants/smithing.ts',
    'forging': 'apps/mobile/constants/forging.ts',
    'cooking': 'apps/mobile/constants/cooking.ts',
    'herblore': 'apps/mobile/constants/herblore.ts',
}

def extract_nodes(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        return []
    
    # We will look for { id: '...', name: '...', levelReq: ... }
    # Using a simple regex to capture properties
    pattern = re.compile(r"\{\s*(id:\s*'[^']+',?\s*name:\s*'[^']+'.*?)\s*\}", re.DOTALL)
    items = []
    
    for match in pattern.finditer(content):
        text = match.group(1)
        
        name_m = re.search(r"name:\s*'([^']+)'", text)
        lvl_m = re.search(r"levelReq:\s*(\d+)", text)
        xp_m = re.search(r"xpPer(?:Tick|Essence):\s*([\d.]+)", text)
        
        if name_m and lvl_m and xp_m:
            items.append({
                'name': name_m.group(1),
                'levelReq': lvl_m.group(1),
                'xp': xp_m.group(1)
            })
    return items

modals_html = []
modals_html.append('<!-- SKILL MODALS -->')
modals_html.append('<div id="skill-modal-overlay" class="skill-modal-overlay" onclick="closeSkillModal()">')
modals_html.append('  <div class="skill-modal" onclick="event.stopPropagation()">')
modals_html.append('    <button class="skill-modal-close" onclick="closeSkillModal()">×</button>')
modals_html.append('    <h2 id="skill-modal-title">Skill</h2>')
modals_html.append('    <div id="skill-modal-content"></div>')
modals_html.append('  </div>')
modals_html.append('</div>')

modals_html.append('<script>')
modals_html.append('const SKILL_DATA = {')
for skill, path in files.items():
    nodes = extract_nodes(path)
    if not nodes:
        continue
    modals_html.append(f"  '{skill}': [")
    for n in nodes:
        modals_html.append(f"    {{ name: '{n['name']}', level: {n['levelReq']}, xp: {n['xp']} }},")
    modals_html.append("  ],")
modals_html.append('};')

modals_html.append('''
function showSkillModal(skillId) {
    const data = SKILL_DATA[skillId];
    if (!data) return;
    
    const titleCap = skillId.charAt(0).toUpperCase() + skillId.slice(1);
    document.getElementById('skill-modal-title').textContent = titleCap + ' Nodes';
    
    let html = '<table class="skill-modal-table">';
    html += '<tr><th>Level</th><th>Name</th><th>XP / Action</th></tr>';
    data.forEach(node => {
        html += `<tr><td>${node.level}</td><td>${node.name}</td><td>${node.xp}</td></tr>`;
    });
    html += '</table>';
    
    document.getElementById('skill-modal-content').innerHTML = html;
    document.getElementById('skill-modal-overlay').classList.add('active');
}

function closeSkillModal() {
    document.getElementById('skill-modal-overlay').classList.remove('active');
}
</script>
''')

# Now inject this before </body> in wiki.html
style_injection = '''
        /* --- Skill Modal --- */
        .skill-modal-overlay {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            z-index: 999;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
            backdrop-filter: blur(4px);
        }
        .skill-modal-overlay.active {
            opacity: 1;
            pointer-events: auto;
        }
        .skill-modal {
            background: var(--bg-card);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 32px;
            width: 90%;
            max-width: 600px;
            max-height: 80vh;
            overflow-y: auto;
            position: relative;
            transform: translateY(20px);
            transition: transform 0.3s ease;
        }
        .skill-modal-overlay.active .skill-modal {
            transform: translateY(0);
        }
        .skill-modal-close {
            position: absolute;
            top: 16px; right: 24px;
            font-size: 2rem;
            color: var(--text-muted);
            background: none; border: none; cursor: pointer;
            transition: color 0.2s;
        }
        .skill-modal-close:hover {
            color: var(--accent);
        }
        .skill-modal-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 16px;
        }
        .skill-modal-table th {
            text-align: left;
            padding: 12px;
            border-bottom: 2px solid var(--border);
            color: var(--gold);
            font-family: 'Cinzel', serif;
        }
        .skill-modal-table td {
            padding: 12px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            color: var(--text-main);
        }
'''

with open('wiki.html', 'r', encoding='utf-8') as f:
    content = f.read()

# insert styles
if '.skill-modal-overlay' not in content:
    content = content.replace('</style>', style_injection + '\n    </style>')

# update onclicks in the skill pillar section
def update_card(match):
    before = match.group(1)
    title = match.group(2).lower()
    return f'<div class="wiki-card" onclick="showSkillModal(\'{title}\')">{before}<div class="wiki-card-title">{title.capitalize()}</div>'

# find <div class="wiki-card">\s*<div class="wiki-card-icon">...</div>\s*<div class="wiki-card-title">Mining</div>
content = re.sub(r'<div class="wiki-card">\s*(<div class="wiki-card-icon">[^<]+</div>)\s*<div class="wiki-card-title">([^<]+)</div>', update_card, content)

# insert modals before </body>
if 'SKILL MODALS' not in content:
    content = content.replace('</body>', "\\n".join(modals_html) + '\\n</body>')

with open('wiki.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Wiki updated successfully!")
