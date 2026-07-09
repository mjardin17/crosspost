import json
import os
import argparse
from datetime import datetime
from pathlib import Path

class ClaudeGodsGloryController:
    def __init__(self):
        self.output_dir = Path("prompts/gods_glory")
        self.output_dir.mkdir(parents=True, exist_ok=True)
        print("🤖 Gods & Glory Controller Ready for Claude")

    def generate_episode(self, episode_num: int, custom_title: str = None):
        ep_code = f"GG_EP{episode_num:03d}"
        title = custom_title or f"Episode {ep_code} - Legendary Rise"
        
        scenes = []
        for i in range(1, 58):  # 57+ scenes
            scene = {
                "scene_number": i,
                "type": "history",
                "title": f"Chapter {i}",
                "narration": f"In the ancient world, a pivotal moment unfolded. A leader made a decision that would echo through history. This is the story of power, strategy, and destiny.",
                "visual_prompt": "Gods & Glory cinematic documentary. Epic historical scene with dramatic lighting, ancient warriors, cinematic composition, 16:9.",
                "bg_colors": ["#0F172A", "#1E2937", "#334155"],
                "duration_sec": 52
            }
            scenes.append(scene)
        
        data = {
            "episode": ep_code,
            "title": title,
            "scenes": scenes,
            "generated_at": datetime.now().isoformat(),
            "total_scenes": len(scenes)
        }
        
        filename = self.output_dir / f"scene_prompts.{ep_code}.final.json"
        with open(filename, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
        
        print(f"✅ Generated {filename.name}")
        return str(filename)

    def generate_from_content(self, episode_num: int, title: str, battle: str, key_facts: list):
        ep_code = f"GG_EP{episode_num:03d}"
        
        scenes = []
        # Create rich intro
        scenes.append({
            "scene_number": 1,
            "type": "history_intro",
            "title": "A Great Battle Looming",
            "narration": f"History was written in blood and gold, but few tales are as legendary as {battle}. Today we chronicle {title}, a turning point of strategy and raw power.",
            "visual_prompt": f"Gods & Glory style. Dramatic wide shot of {battle} battlefield, mist rising, cinematic composition, photorealistic, 16:9.",
            "bg_colors": ["#020617", "#0f172a", "#1e293b"],
            "duration_sec": 60
        })
        
        # Build scenes for each key fact
        for idx, fact in enumerate(key_facts, start=2):
            scenes.append({
                "scene_number": idx,
                "type": "history_fact",
                "title": f"Core Fact: {fact[:25]}...",
                "narration": f"Crucial to the timeline was this undeniable truth: {fact}. Strategists and soldiers alike were forced to adapt as the reality of {battle} transformed in real-time.",
                "visual_prompt": f"Gods & Glory dynamic historical scene. Detailed action of historical figures during {battle}, focusing on {fact[:40]}, realistic lighting, cinematic 16:9.",
                "bg_colors": ["#0f172a", "#111827", "#1f2937"],
                "duration_sec": 55
            })
            
        # Build standard filler up to 57 scenes to reach the 45-minute mark/high count
        for i in range(len(scenes) + 1, 58):
            scenes.append({
                "scene_number": i,
                "type": "history_tactical",
                "title": f"Tactical Chapter {i}",
                "narration": f"As the conflict of {battle} intensified, maneuvers across the field became increasingly desperate, sealing the ultimate fate of those involved.",
                "visual_prompt": "Gods & Glory tactical map display, ancient parchment style with moving warm lighting, realistic detailed markers, 16:9.",
                "bg_colors": ["#111827", "#030712", "#0f172a"],
                "duration_sec": 52
            })
            
        data = {
            "episode": ep_code,
            "title": title,
            "battle": battle,
            "key_facts": key_facts,
            "scenes": scenes,
            "generated_at": datetime.now().isoformat(),
            "total_scenes": len(scenes),
            "total_duration_sec": sum(s["duration_sec"] for s in scenes)
        }
        
        filename = self.output_dir / f"scene_prompts.{ep_code}.final.json"
        with open(filename, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
            
        print(f"✅ Custom Content Script Generated: {filename.name}")
        return str(filename)

    def generate_batch(self, start: int = 20, end: int = 25):
        for ep in range(start, end + 1):
            self.generate_episode(ep)
        return "Batch generation complete"

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Gods & Glory CLI Controller")
    parser.add_argument("--action", type=str, choices=["episode", "batch", "generate_from_content"], required=True, help="Action to execute")
    parser.add_argument("--episode", type=int, default=26, help="Episode number (e.g., 26)")
    parser.add_argument("--title", type=str, default=None, help="Optional custom title")
    parser.add_argument("--start", type=int, default=20, help="Batch start episode")
    parser.add_argument("--end", type=int, default=25, help="Batch end episode")
    parser.add_argument("--battle", type=str, default="", help="Battle name for content generation")
    parser.add_argument("--key-facts", type=str, default="[]", help="JSON string of key facts array")

    args = parser.parse_args()
    controller = ClaudeGodsGloryController()

    if args.action == "episode":
        filepath = controller.generate_episode(args.episode, args.title)
        print(f"SUCCESS: {filepath}")
    elif args.action == "batch":
        result = controller.generate_batch(args.start, args.end)
        print(f"SUCCESS: {result}")
    elif args.action == "generate_from_content":
        try:
            facts = json.loads(args.key_facts)
        except Exception:
            facts = [args.key_facts] if args.key_facts else ["A critical historical confrontation occurred."]
        filepath = controller.generate_from_content(args.episode, args.title or f"Battle of {args.battle}", args.battle, facts)
        print(f"SUCCESS: {filepath}")
