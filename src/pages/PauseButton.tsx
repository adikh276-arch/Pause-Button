import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ActivityLayout from "@/components/ActivityLayout";
import BreathingCircle from "@/components/BreathingCircle";
import EmotionChip from "@/components/EmotionChip";
import ActionCategory from "@/components/ActionCategory";
import { Button } from "@/components/ui/button";
import { saveEntry } from "@/lib/pauseHistory";

const EMOTIONS = ["Stressed", "Anxious", "Restless", "Bored", "Frustrated", "Lonely", "Calm", "Happy"];

const ACTION_CATEGORIES = [
  {
    title: "🧘 Mindful / Calming",
    options: ["Take a deep breath", "Take 5 slow breaths", "Close your eyes for a moment", "Sit quietly", "Listen to calming music"],
  },
  {
    title: "💪 Physical Reset",
    options: ["Stretch your body", "Go for a short walk", "Do 10 jumping jacks", "Wash your face", "Step outside for fresh air"],
  },
  {
    title: "🎯 Distraction / Refocus",
    options: ["Start a small task", "Organize a small space", "Read something short", "Watch a short video"],
  },
  {
    title: "💬 Connection",
    options: ["Call a friend", "Text a friend", "Talk to a family member", "Check in with someone"],
  },
  {
    title: "🌍 Grounding",
    options: ["Name 5 things you see", "Focus on your breathing", "Hold something cold", "Notice sounds around you"],
  },
];

const PauseButton = () => {
  const [screen, setScreen] = useState(1);
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [customEmotion, setCustomEmotion] = useState("");
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const navigate = useNavigate();

  const goTo = (next: number) => {
    setTransitioning(true);
    setTimeout(() => {
      setScreen(next);
      setTransitioning(false);
    }, 300);
  };

  const toggleEmotion = (e: string) => {
    setSelectedEmotions((prev) =>
      prev.includes(e) ? prev.filter((x) => x !== e) : [...prev, e]
    );
  };

  const handleConfirmAction = () => {
    const allEmotions = [...selectedEmotions];
    if (customEmotion.trim()) allEmotions.push(customEmotion.trim());
    saveEntry({ emotions: allEmotions, action: selectedAction || "" });
    goTo(5);
  };

  const handleReset = () => {
    setTransitioning(true);
    setTimeout(() => {
      setScreen(1);
      setSelectedEmotions([]);
      setCustomEmotion("");
      setSelectedAction(null);
      setTransitioning(false);
    }, 300);
  };

  const allEmotions = [...selectedEmotions, ...(customEmotion.trim() ? [customEmotion.trim()] : [])];

  // Only show back on screen 1 (navigates to home)
  const showBack = screen === 1;

  return (
    <ActivityLayout onBack={showBack ? () => navigate("/") : undefined} hideBack={!showBack}>
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          transitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
        }`}
        key={screen}
      >
        {/* Screen 1 — Introduction */}
        {screen === 1 && (
          <>
            <h1 className="text-2xl font-heading font-bold text-foreground mt-4 mb-2">
              Pause Button ⏸️
            </h1>
            <p className="text-sm text-secondary font-body mb-4">Every pause is a superpower.</p>

            <div className="flex-1 space-y-4">
              <p className="text-justified text-foreground font-body leading-relaxed">
                Cravings can sneak up on anyone.
              </p>
              <p className="text-justified text-foreground font-body leading-relaxed">
                Sometimes the best action is to stop, breathe, and notice what is happening.
              </p>
              <p className="text-justified text-foreground font-body leading-relaxed">
                This quick pause can help you regain control and clarity.
              </p>

              {/* Pause illustration */}
              <div className="flex justify-center py-8">
                <div className="w-32 h-32 rounded-full bg-accent flex items-center justify-center animate-pulse">
                  <div className="flex gap-3">
                    <div className="w-4 h-14 rounded-full bg-primary" />
                    <div className="w-4 h-14 rounded-full bg-primary" />
                  </div>
                </div>
              </div>
            </div>

            <Button size="lg" className="w-full mt-4" onClick={() => goTo(2)}>
              Activate Pause ✨
            </Button>
          </>
        )}

        {/* Screen 2 — Pause Moment */}
        {screen === 2 && (
          <>
            <h1 className="text-2xl font-heading font-bold text-foreground mt-4 mb-2">
              Take a moment 🌊
            </h1>
            <p className="text-sm text-secondary font-body mb-4">Let's slow things down together.</p>

            <div className="flex-1 space-y-4">
              <p className="text-justified text-foreground font-body leading-relaxed">
                Close your eyes for a few seconds.
              </p>
              <p className="text-justified text-foreground font-body leading-relaxed">
                Breathe in… and breathe out.
              </p>
              <p className="text-justified text-foreground font-body leading-relaxed">
                Notice your surroundings, your feelings, and your body.
              </p>

              <BreathingCircle />
            </div>

            <Button size="lg" className="w-full mt-4" onClick={() => goTo(3)}>
              I'm Ready 🙌
            </Button>
          </>
        )}

        {/* Screen 3 — Emotion Check */}
        {screen === 3 && (
          <>
            <h1 className="text-2xl font-heading font-bold text-foreground mt-4 mb-2">
              What are you feeling? 💭
            </h1>
            <p className="text-sm text-secondary font-body mb-4">No judgement — just awareness.</p>

            <div className="flex-1 space-y-4">
              <p className="text-justified text-foreground font-body leading-relaxed">
                Pausing is a chance to check in.
              </p>
              <p className="text-justified text-foreground font-body leading-relaxed">
                Choose any emotions that match how you feel right now.
              </p>

              <div className="flex flex-wrap gap-2 pt-2">
                {EMOTIONS.map((e) => (
                  <EmotionChip
                    key={e}
                    label={e}
                    selected={selectedEmotions.includes(e)}
                    onToggle={() => toggleEmotion(e)}
                  />
                ))}
              </div>

              <div className="pt-2">
                <textarea
                  value={customEmotion}
                  onChange={(e) => setCustomEmotion(e.target.value)}
                  placeholder="Or write your own feeling... ✍️"
                  className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  rows={2}
                />
              </div>
            </div>

            <Button
              size="lg"
              className="w-full mt-4"
              onClick={() => goTo(4)}
              disabled={selectedEmotions.length === 0 && !customEmotion.trim()}
            >
              Next Step 👣
            </Button>
          </>
        )}

        {/* Screen 4 — Choose an Action */}
        {screen === 4 && (
          <>
            <h1 className="text-2xl font-heading font-bold text-foreground mt-4 mb-2">
              What will you do next? 🚀
            </h1>
            <p className="text-sm text-secondary font-body mb-4">Pick one small action to move forward.</p>

            <div className="flex-1 space-y-4 overflow-y-auto">
              <p className="text-justified text-foreground font-body leading-relaxed">
                Now that you have paused and noticed how you feel, choose one action that can help you move forward.
              </p>

              <div className="space-y-2 pt-2">
                {ACTION_CATEGORIES.map((cat) => (
                  <ActionCategory
                    key={cat.title}
                    title={cat.title}
                    options={cat.options}
                    selectedAction={selectedAction}
                    onSelect={setSelectedAction}
                  />
                ))}
              </div>
            </div>

            <Button
              size="lg"
              className="w-full mt-4"
              onClick={handleConfirmAction}
              disabled={!selectedAction}
            >
              Confirm ✅
            </Button>
          </>
        )}

        {/* Screen 5 — Positive Reinforcement */}
        {screen === 5 && (
          <>
            <h1 className="text-2xl font-heading font-bold text-foreground mt-4 mb-2">
              Nice pause! 🌸
            </h1>
            <p className="text-sm text-secondary font-body mb-4">You're doing amazing.</p>

            <div className="flex-1 space-y-4">
              <p className="text-justified text-foreground font-body leading-relaxed">
                You just gave yourself an important moment of awareness.
              </p>
              <p className="text-justified text-foreground font-body leading-relaxed">
                Every pause you take makes it easier to stay in control.
              </p>
              <p className="text-justified text-foreground font-body leading-relaxed">
                Small steps build big changes. 🌱
              </p>

              {/* Summary Card */}
              <div className="bg-card rounded-2xl p-5 shadow-md space-y-3 mt-4">
                <div>
                  <p className="text-xs text-muted-foreground font-body uppercase tracking-wide mb-1">Emotions Logged</p>
                  <div className="flex flex-wrap gap-1.5">
                    {allEmotions.map((e) => (
                      <span key={e} className="bg-accent text-accent-foreground text-xs px-3 py-1 rounded-full font-body">
                        {e}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-body uppercase tracking-wide mb-1">Action Chosen</p>
                  <p className="text-sm font-body text-foreground">{selectedAction}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3 mt-4">
              <Button size="lg" className="w-full" onClick={() => navigate("/")}>
                Done 🎉
              </Button>
              <Button size="lg" variant="secondary" className="w-full" onClick={handleReset}>
                Try Another Pause 🔄
              </Button>
              <Button size="lg" variant="outline" className="w-full" onClick={() => navigate("/pause-history")}>
                View History 📖
              </Button>
            </div>
          </>
        )}
      </div>
    </ActivityLayout>
  );
};

export default PauseButton;
