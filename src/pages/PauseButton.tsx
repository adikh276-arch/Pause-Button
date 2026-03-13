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
    title: "Mindful / Calming",
    options: ["Take a deep breath", "Take 5 slow breaths", "Close your eyes for a moment", "Sit quietly", "Listen to calming music"],
  },
  {
    title: "Physical Reset",
    options: ["Stretch your body", "Go for a short walk", "Do 10 jumping jacks", "Wash your face", "Step outside for fresh air"],
  },
  {
    title: "Distraction / Refocus",
    options: ["Start a small task", "Organize a small space", "Read something short", "Watch a short video"],
  },
  {
    title: "Connection",
    options: ["Call a friend", "Text a friend", "Talk to a family member", "Check in with someone"],
  },
  {
    title: "Grounding",
    options: ["Name 5 things you see", "Focus on your breathing", "Hold something cold", "Notice sounds around you"],
  },
];

const PauseButton = () => {
  const [screen, setScreen] = useState(1);
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [customEmotion, setCustomEmotion] = useState("");
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const navigate = useNavigate();

  const toggleEmotion = (e: string) => {
    setSelectedEmotions((prev) =>
      prev.includes(e) ? prev.filter((x) => x !== e) : [...prev, e]
    );
  };

  const handleConfirmAction = () => {
    const allEmotions = [...selectedEmotions];
    if (customEmotion.trim()) allEmotions.push(customEmotion.trim());
    saveEntry({ emotions: allEmotions, action: selectedAction || "" });
    setScreen(5);
  };

  const handleReset = () => {
    setScreen(1);
    setSelectedEmotions([]);
    setCustomEmotion("");
    setSelectedAction(null);
  };

  const allEmotions = [...selectedEmotions, ...(customEmotion.trim() ? [customEmotion.trim()] : [])];

  return (
    <ActivityLayout onBack={screen > 1 ? () => setScreen(screen - 1) : undefined}>
      {/* Screen 1 — Introduction */}
      {screen === 1 && (
        <div className="flex-1 flex flex-col animate-fade-in-up">
          <h1 className="text-2xl font-heading font-bold text-foreground mt-4 mb-4">
            Pause Button ⏸️
          </h1>

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
              <div className="w-32 h-32 rounded-full bg-accent flex items-center justify-center">
                <div className="flex gap-3">
                  <div className="w-4 h-14 rounded-full bg-primary" />
                  <div className="w-4 h-14 rounded-full bg-primary" />
                </div>
              </div>
            </div>
          </div>

          <Button size="lg" className="w-full mt-4" onClick={() => setScreen(2)}>
            Activate Pause
          </Button>
        </div>
      )}

      {/* Screen 2 — Pause Moment */}
      {screen === 2 && (
        <div className="flex-1 flex flex-col animate-fade-in-up">
          <h1 className="text-2xl font-heading font-bold text-foreground mt-4 mb-4">
            Take a moment
          </h1>

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

          <Button size="lg" className="w-full mt-4" onClick={() => setScreen(3)}>
            Next
          </Button>
        </div>
      )}

      {/* Screen 3 — Emotion Check */}
      {screen === 3 && (
        <div className="flex-1 flex flex-col animate-fade-in-up">
          <h1 className="text-2xl font-heading font-bold text-foreground mt-4 mb-4">
            What are you feeling?
          </h1>

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
                placeholder="Write your own feeling..."
                className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                rows={2}
              />
            </div>
          </div>

          <Button
            size="lg"
            className="w-full mt-4"
            onClick={() => setScreen(4)}
            disabled={selectedEmotions.length === 0 && !customEmotion.trim()}
          >
            Next
          </Button>
        </div>
      )}

      {/* Screen 4 — Choose an Action */}
      {screen === 4 && (
        <div className="flex-1 flex flex-col animate-fade-in-up">
          <h1 className="text-2xl font-heading font-bold text-foreground mt-4 mb-4">
            What will you do next?
          </h1>

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
            Confirm
          </Button>
        </div>
      )}

      {/* Screen 5 — Positive Reinforcement */}
      {screen === 5 && (
        <div className="flex-1 flex flex-col animate-fade-in-up">
          <h1 className="text-2xl font-heading font-bold text-foreground mt-4 mb-4">
            Nice pause! 🌸
          </h1>

          <div className="flex-1 space-y-4">
            <p className="text-justified text-foreground font-body leading-relaxed">
              You just gave yourself an important moment of awareness.
            </p>
            <p className="text-justified text-foreground font-body leading-relaxed">
              Every pause you take makes it easier to stay in control.
            </p>
            <p className="text-justified text-foreground font-body leading-relaxed">
              Small steps build big changes.
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
              Confirm
            </Button>
            <Button size="lg" variant="secondary" className="w-full" onClick={handleReset}>
              Try Another Pause
            </Button>
            <Button size="lg" variant="outline" className="w-full" onClick={() => navigate("/pause-history")}>
              View History
            </Button>
          </div>
        </div>
      )}
    </ActivityLayout>
  );
};

export default PauseButton;
