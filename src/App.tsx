import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import PauseButton from "./pages/PauseButton.tsx";
import PauseHistory from "./pages/PauseHistory.tsx";
import NotFound from "./pages/NotFound.tsx";

import "@/i18n";
import { LanguageSelector } from "./components/LanguageSelector";
import AuthGuard from "./components/AuthGuard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename="/pause_button">
        <LanguageSelector />
        <AuthGuard>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/pause-button" element={<PauseButton />} />
            <Route path="/pause-history" element={<PauseHistory />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthGuard>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
