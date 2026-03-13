import { useNavigate } from "react-router-dom";
import ActivityLayout from "@/components/ActivityLayout";
import { getHistory } from "@/lib/pauseHistory";
import { format } from "date-fns";

const PauseHistory = () => {
  const navigate = useNavigate();
  const history = getHistory();

  return (
    <ActivityLayout onBack={() => navigate("/pause-button")}>
      <h1 className="text-2xl font-heading font-bold text-foreground mt-4 mb-4">
        Pause History 📋
      </h1>

      {history.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground font-body text-sm text-center">
            No pauses logged yet. Complete your first pause to see it here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((entry) => (
            <div key={entry.id} className="bg-card rounded-2xl p-5 shadow-md space-y-3">
              <p className="text-xs text-muted-foreground font-body">
                {format(new Date(entry.date), "MMM d, yyyy · h:mm a")}
              </p>
              <div>
                <p className="text-xs text-muted-foreground font-body uppercase tracking-wide mb-1">Emotions</p>
                <div className="flex flex-wrap gap-1.5">
                  {entry.emotions.map((e, i) => (
                    <span key={i} className="bg-accent text-accent-foreground text-xs px-3 py-1 rounded-full font-body">
                      {e}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-body uppercase tracking-wide mb-1">Action</p>
                <p className="text-sm font-body text-foreground">{entry.action}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </ActivityLayout>
  );
};

export default PauseHistory;
