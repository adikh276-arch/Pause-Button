import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-5">
      <div className="text-center max-w-md">
        <h1 className="text-3xl font-heading font-bold text-foreground mb-3">
          Mindful Moments 🌿
        </h1>
        <p className="text-justified text-muted-foreground font-body mb-8 leading-relaxed">
          Take a mindful pause whenever you need it. Build awareness, manage cravings, and stay in control through small daily practices.
        </p>
        <Button size="lg" className="w-full" onClick={() => navigate("/pause-button")}>
          Start Pause Button ⏸️
        </Button>
        <Button size="lg" variant="outline" className="w-full mt-3" onClick={() => navigate("/pause-history")}>
          View History 📖
        </Button>
      </div>
    </div>
  );
};

export default Index;
