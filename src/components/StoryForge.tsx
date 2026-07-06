import React, { useState } from "react";
import {
  BookOpen, Sparkles, Wand2, Terminal, Plus, Trash, Check, Sliders, Play, Film, MessageSquare, Save, RefreshCw
} from "lucide-react";

export default function StoryForge() {
  const [theme, setTheme] = useState<string>("A lone developer uncovers an artificial intelligence entity running inside an obsolete 1980s mainframe.");
  const [audience, setAudience] = useState<string>("Tech enthusiasts & sci-fi readers");
  const [tone, setTone] = useState<string>("Mysterious & Cerebral");
  const [pacing, setPacing] = useState<string>("Fast-paced, suspenseful");

  const [loading, setLoading] = useState<boolean>(false);
  const [generatedScript, setGeneratedScript] = useState<any | null>(null);
  
  const [savedStories, setSavedStories] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem("empire_saved_stories");
      return saved ? JSON.parse(saved) : [
        { id: 1, title: "The Mainframe Ghost", theme: "Obsolete mainframe AI", created: "Yesterday" }
      ];
    } catch {
      return [];
    }
  });

  const [newTitle, setNewTitle] = useState<string>("");

  const handleGenerateStory = async () => {
    if (!theme.trim()) return;
    setLoading(true);
    setGeneratedScript(null);

    try {
      const response = await fetch("/api/storyforge/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          theme,
          audience,
          tone,
          pacing,
          newTitle
        })
      });
      const data = await response.json();
      if (data.success && data.project) {
        setGeneratedScript(data.project);
      } else {
        throw new Error(data.error || "Story generation failed.");
      }
    } catch (err: any) {
      console.error("StoryForge Generation Error:", err);
      alert(`StoryForge failed to generate the story package: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveStory = () => {
    if (!generatedScript) return;
    const story = {
      id: Date.now(),
      title: generatedScript.title,
      theme: generatedScript.logline,
      created: "Just now"
    };
    const updated = [story, ...savedStories];
    setSavedStories(updated);
    localStorage.setItem("empire_saved_stories", JSON.stringify(updated));
    alert("Story project saved into local workspace index successfully.");
  };

  const handleSendToVideoPipeline = () => {
    if (!generatedScript) return;
    
    // Construct a beautiful initial VideoProject template!
    const videoProjectTemplate = {
      id: `vid_${Date.now()}`,
      name: generatedScript.title,
      topic: `${generatedScript.logline}\n\nCharacters:\n${generatedScript.characters.map((c: any) => `- ${c.name}: ${c.role}`).join("\n")}`,
      status: "idle" as const,
      steps: [
        { id: "research", name: "Deep Niche Research", description: "Querying Gemini API for comprehensive facts, background insights, and tech definitions.", status: "idle", outputFile: "research.md", category: "research" },
        { id: "fact_verification", name: "Fact Verification Audit", description: "Analyzing sources, historical accuracy, dates, and names using specialized filters.", status: "idle", outputFile: "fact_audit.md", category: "research" },
        { id: "script_writing", name: "Narration Screenplay", description: "Drafting narrator dialogue and cinematic scene visual directions.", status: "idle", outputFile: "script.md", category: "script" },
        { id: "scene_breakdown", name: "Scene Breakdown Timeline", description: "Parsing the screenplay into chronologically ordered video frames.", status: "idle", outputFile: "scenes.json", category: "script" },
        { id: "storyboard", name: "Cinematic Storyboard", description: "Generating camera framing, angle, lighting, and mood guidelines for every frame.", status: "idle", outputFile: "storyboard.json", category: "script" },
        { id: "character_selection", name: "Avatar Character Casting", description: "Casting suitable characters and outfits matching Character Bible parameters.", status: "idle", outputFile: "cast.json", category: "script" },
        { id: "image_prompts", name: "Image Generation Prompts", description: "Assembling stable, production-ready prompts with continuous styles.", status: "idle", outputFile: "image_prompts.json", category: "script" },
        { id: "video_prompts", name: "Video Generation Prompts", description: "Adding temporal motion, frame rate, and action vectors for model execution.", status: "idle", outputFile: "video_prompts.json", category: "script" },
        { id: "voice_generation", name: "Narration Voice Over", description: "Triggering synthetic actor node rendering raw WAV audio files.", status: "idle", outputFile: "narration.wav", category: "voice" },
        { id: "music_selection", name: "Background Music Score", description: "Selecting ambient thematic tracks matching emotional velocity peaks.", status: "idle", outputFile: "music.mp3", category: "voice" },
        { id: "sound_effects", name: "Atmospheric Sound Design", description: "Laying SFX stems, spot effects, echoes, and volume automation curves.", status: "idle", outputFile: "sound_effects.json", category: "voice" },
        { id: "subtitle_generation", name: "Timed Closed Captions", description: "Aligning text transcripts with audio timestamps using speech models.", status: "idle", outputFile: "subtitles.srt", category: "voice" },
        { id: "video_rendering", name: "Composite Video Render", description: "Stitching scenes, audio stems, and subtitle overlays in standard container.", status: "idle", outputFile: "output.mp4", category: "render" },
        { id: "thumbnail_generation", name: "A/B Cover Art Rendering", description: "Creating optimized 16:9 cinematic clickbait image composites.", status: "idle", outputFile: "thumbnail.jpg", category: "seo" },
        { id: "youtube_metadata", name: "SEO Metadata Pack", description: "Generating viral metadata, titles, structured description, and hashtags.", status: "idle", outputFile: "seo_metadata.json", category: "seo" },
        { id: "shorts_generation", name: "YouTube Shorts Extraction", description: "Cutting key punchy vertical highlights with auto-cropped focus vectors.", status: "idle", outputFile: "shorts_highlights.json", category: "seo" },
        { id: "export_folder", name: "Consolidated Export Drive", description: "Writing all master assets, scripts, audio, and visual packs to the workspace.", status: "idle", outputFile: "export_log.txt", category: "render" }
      ],
      assets: {
        research: `Title: ${generatedScript.title}\nLogline: ${generatedScript.logline}`,
        script: generatedScript.scenes.map((s: any) => `${s.scene}\n${s.description}`).join("\n\n"),
        title: generatedScript.title,
        description: generatedScript.logline,
        tags: generatedScript.characters.map((c: any) => c.name)
      },
      currentStepIndex: 0
    };
    
    localStorage.setItem("active_video_project", JSON.stringify(videoProjectTemplate));
    alert("Narrative sent to Video Creator! Head over to the 'Video Intelligence' workspace and open the 'Auto-Pilot Production Studio' tab to begin automated video pipeline production.");
  };

  return (
    <div className="bg-zinc-900 border border-zinc-850 rounded-xl p-5 space-y-6 animate-fade-in font-sans">
      
      {/* Header */}
      <div className="border-b border-zinc-850 pb-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-mono font-black text-slate-200 uppercase tracking-tight">
              StoryForge Publishing Engine
            </h3>
          </div>
          <span className="text-[9px] font-mono font-bold text-indigo-400 bg-indigo-950/40 border border-indigo-900/30 px-2 py-0.5 rounded">
            NARRATIVE SYNTHESIS
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Draft scripts, map character matrices, and generate multi-scene script outlines in seconds. StoryForge integrates with your cognitive routing layer to deliver publish-ready scripts and social storylines.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Col: Setup & Controls */}
        <div className="lg:col-span-5 bg-zinc-950/50 border border-zinc-850 rounded-lg p-5 space-y-4">
          <div className="space-y-1">
            <h4 className="text-xs font-mono font-black text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-zinc-500" />
              Story Parameters
            </h4>
            <p className="text-[10px] text-slate-500 font-sans">Configure narrative tone and audience pacing guidelines.</p>
          </div>

          <div className="space-y-3.5 pt-2">
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Story Working Title (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Obsolete Consciousness"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-850 rounded p-2 text-xs font-mono text-slate-200 placeholder-slate-750 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-bold text-slate-400 uppercase">Core Premise / Theme</label>
              <textarea
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder="Draft the core concept of your story..."
                className="w-full bg-zinc-950 border border-zinc-850 rounded p-2 text-xs font-mono text-slate-200 placeholder-slate-750 min-h-[90px] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[9px] font-mono font-bold text-slate-400 uppercase">Target Audience</label>
                <input
                  type="text"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-850 rounded p-2 text-xs font-mono text-slate-200 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-mono font-bold text-slate-400 uppercase">Tone Profile</label>
                <input
                  type="text"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-850 rounded p-2 text-xs font-mono text-slate-200 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-mono font-bold text-slate-400 uppercase">Narrative Pacing</label>
              <select
                value={pacing}
                onChange={(e) => setPacing(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-850 rounded p-2 text-xs font-mono text-slate-200 focus:outline-none"
              >
                <option value="Fast-paced, suspenseful">Fast-paced, suspenseful</option>
                <option value="Slow burn, introspective">Slow burn, introspective</option>
                <option value="Epic, dramatic arches">Epic, dramatic arches</option>
                <option value="Punchy, educational snippets">Punchy, educational snippets</option>
              </select>
            </div>

            <button
              onClick={handleGenerateStory}
              disabled={loading || !theme.trim()}
              className="w-full bg-indigo-650 hover:bg-indigo-600 text-white font-mono text-xs font-bold uppercase tracking-wider py-2.5 px-4 rounded-md cursor-pointer transition flex justify-center items-center gap-1.5 disabled:opacity-50 shadow-md"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  FORGING STORY ARCS...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  GENERATE FULL TREATMENT
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Col: Treatment Output & Visual Storyboard */}
        <div className="lg:col-span-7 space-y-4">
          
          {generatedScript ? (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-zinc-950 border border-zinc-850 rounded-lg p-5 space-y-4">
                
                <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                  <div>
                    <span className="text-[9px] font-mono text-indigo-400 uppercase block font-bold">Generated Narrative Treatment</span>
                    <h4 className="text-sm font-bold text-slate-200 uppercase">{generatedScript.title}</h4>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleSendToVideoPipeline}
                      className="text-[10px] font-mono font-bold text-rose-400 hover:text-rose-300 bg-rose-950/20 border border-rose-900/30 px-2.5 py-1 rounded cursor-pointer transition flex items-center gap-1"
                    >
                      <Play className="w-3.5 h-3.5 animate-pulse" />
                      Send to Video Creator
                    </button>
                    <button
                      onClick={handleSaveStory}
                      className="text-[10px] font-mono font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-950/20 border border-emerald-900/30 px-2.5 py-1 rounded cursor-pointer transition flex items-center gap-1"
                    >
                      <Save className="w-3.5 h-3.5" />
                      Save Story
                    </button>
                  </div>
                </div>

                {/* Logline */}
                <div className="space-y-1 text-xs">
                  <span className="text-[9px] font-mono text-slate-500 uppercase block font-bold">NARRATIVE LOGLINE</span>
                  <p className="text-slate-300 italic font-sans leading-relaxed">"{generatedScript.logline}"</p>
                </div>

                {/* Characters */}
                <div className="space-y-2 pt-1">
                  <span className="text-[9px] font-mono text-slate-500 uppercase block font-bold">Character Profiles</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {generatedScript.characters.map((char: any, i: number) => (
                      <div key={i} className="bg-zinc-900 p-2.5 border border-zinc-850 rounded text-xs">
                        <span className="font-bold text-indigo-400 block font-mono">{char.name}</span>
                        <p className="text-slate-400 text-[11px] font-sans mt-0.5">{char.role}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Scene Outlines */}
                <div className="space-y-3 pt-2">
                  <span className="text-[9px] font-mono text-slate-500 uppercase block font-bold">Scene Storyboard Scripts</span>
                  
                  <div className="space-y-2.5">
                    {generatedScript.scenes.map((scene: any, i: number) => (
                      <div key={i} className="bg-zinc-900 p-3.5 border border-zinc-850 rounded-lg space-y-1 text-xs">
                        <div className="flex justify-between items-center text-[10px] font-mono font-bold text-indigo-300">
                          <span>{scene.scene}</span>
                          <span className="text-[9px] text-slate-500">SCENE 0{i+1} PROMPT</span>
                        </div>
                        <p className="text-slate-300 leading-relaxed font-sans">{scene.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          ) : (
            <div className="bg-zinc-950/20 border border-dashed border-zinc-850 rounded-lg p-12 text-center space-y-3 min-h-[360px] flex flex-col justify-center items-center">
              <Film className="w-10 h-10 text-slate-700 animate-pulse" />
              <h4 className="text-xs font-mono font-bold text-slate-400 uppercase">Narrative Canvas Idle</h4>
              <p className="text-[11px] text-slate-500 max-w-sm font-sans">
                Input your story premise, configure target parameters, and trigger the forge algorithm to output full script blueprints and scene cue structures.
              </p>
            </div>
          )}

          {/* Saved stories history */}
          <div className="bg-zinc-950/30 border border-zinc-850 rounded-lg p-4 space-y-2.5">
            <span className="text-[9px] font-mono text-slate-500 uppercase block font-bold">Story Archives</span>
            <div className="space-y-2 text-xs font-mono">
              {savedStories.map((story) => (
                <div key={story.id} className="bg-zinc-950 p-2.5 rounded border border-zinc-900 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-300 block">{story.title}</span>
                    <span className="text-[10px] text-slate-500 truncate max-w-[280px] block mt-0.5">{story.theme}</span>
                  </div>
                  <span className="text-[9px] text-slate-600 shrink-0">{story.created}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
