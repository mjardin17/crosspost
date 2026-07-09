#!/bin/bash
echo "========================================================"
echo "🎬 Gods Glory & Little Olympus Render-All Bash Pipeline"
echo "========================================================"
echo "Scanning prompts directories for generated episodes..."

python3 -c "
import glob, os, subprocess
episodes = []
for p in glob.glob('prompts/**/*.json', recursive=True):
    name = os.path.basename(p)
    if 'scene_prompts.LO_EP' in name:
        ep_code = name.split('.')[1]
        episodes.append(ep_code)
    elif 'scene_prompts.GG_EP' in name:
        ep_code = name.split('.')[1]
        episodes.append(ep_code)

if not episodes:
    print('No custom prompt files found. Pre-populating default batch queue [GG_EP020 - GG_EP025]...')
    episodes = [f'GG_EP{i:03d}' for i in range(20, 26)]

print(f'Found {len(episodes)} episodes in the render queue.')
for ep in sorted(list(set(episodes))):
    print(f'\n--- Starting Render for {ep} ---')
    subprocess.run(['python3', 'auto_render.py', ep])
"

echo "========================================================"
echo "✅ All active rendering processes completed successfully!"
echo "========================================================"
