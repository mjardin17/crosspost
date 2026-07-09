import json
import os
from datetime import datetime
from pathlib import Path

class LittleOlympusController:
    def __init__(self):
        self.output_dir = Path("prompts/little_olympus")
        self.output_dir.mkdir(parents=True, exist_ok=True)
        print("🌥️ Little Olympus Controller Ready (Toddler Gods Edition)")

    def generate_episode(self, episode_num: int, custom_title: str = None):
        ep_code = f"LO_EP{episode_num:03d}"
        title = custom_title or self._get_cute_title(episode_num)
        
        scenes = self._generate_toddler_scenes(episode_num, 55)
        
        data = {
            "episode": ep_code,
            "title": title,
            "scenes": scenes,
            "generated_at": datetime.now().isoformat(),
            "total_scenes": len(scenes),
            "total_duration_min": round(sum(s["duration_sec"] for s in scenes) / 60, 1),
            "style": "toddler_friendly_educational",
            "theme": "friendship_and_responsibility"
        }
        
        filename = self.output_dir / f"scene_prompts.{ep_code}.final.json"
        with open(filename, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        
        print(f"✅ Little Olympus Episode Generated: {filename.name}")
        return str(filename)

    def generate_batch(self, start: int = 1, end: int = 6):
        for ep in range(start, end + 1):
            self.generate_episode(ep)
        return f"Generated Little Olympus Episodes {start} to {end}"

    def _get_cute_title(self, ep_num):
        titles = [
            "Baby Zeus Learns to Share His Thunder",
            "Little Hercules and the Friendly Lion",
            "Baby Athena's Big Brain Adventure",
            "Poseidon and the Magic Seashell",
            "Baby Apollo and the Sunny Song",
            "Hera's Rainbow Friendship Day"
        ]
        return titles[(ep_num - 1) % len(titles)]

    def _generate_toddler_scenes(self, ep_num, count=55):
        scenes = []
        for i in range(1, count + 1):
            scene = {
                "scene_number": i,
                "type": "story",
                "title": f"Lesson {i}",
                "narration": "In Cloud Kingdom, Baby Zeus and his friends were playing when something exciting happened! They learned that using their powers with friendship makes everything better.",
                "visual_prompt": "Little Olympus cute toddler animation style. Adorable baby Greek god with big eyes, colorful Cloud Kingdom background, Pixar-style, very cute, soft lighting, 16:9.",
                "bg_colors": ["#87CEEB", "#E0F6FF", "#FFB6C1"],
                "duration_sec": 48
            }
            scenes.append(scene)
        return scenes

# =============== READY FOR CLAUDE ===============
if __name__ == "__main__":
    controller = LittleOlympusController()
    print("Little Olympus Controller Loaded!")
    print("Use: controller.generate_batch(1, 6)")
