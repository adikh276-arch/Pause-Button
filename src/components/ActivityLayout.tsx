import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ActivityLayoutProps {
  children: React.ReactNode;
  onBack?: () => void;
  hideBack?: boolean;
}

const ActivityLayout = ({ children, onBack }: ActivityLayoutProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto">
      <div className="px-4 pt-4 pb-2">
        <button
          onClick={onBack || (() => navigate(-1))}
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft size={20} />
          <span className="text-sm font-body">Back</span>
        </button>
      </div>
      <div className="flex-1 flex flex-col px-5 pb-8">
        {children}
      </div>
    </div>
  );
};

export default ActivityLayout;
