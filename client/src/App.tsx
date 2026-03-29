import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import LandingPage from "./pages/LandingPage";
import Giornale from "./pages/Giornale";
import ChiSiamo from "./pages/ChiSiamo";
import Contattaci from "./pages/Contattaci";
import Grazie from "./pages/Grazie";
import NewsletterPopup from "./components/NewsletterPopup";

/**
 * Popup logic:
 * - DESATIVADO na Landing Page (/) e Grazie (/grazie) — já tem formulário próprio
 * - ATIVO no Giornale (/giornale), Chi Siamo (/chi-siamo), e outras páginas
 */
function ConditionalPopup() {
  const [location] = useLocation();
  // Desativar popup na LP e na Thank You page
  const noPopupRoutes = ["/", "/grazie"];
  if (noPopupRoutes.includes(location)) return null;
  return <NewsletterPopup />;
}

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={LandingPage} />
      <Route path={"/giornale"} component={Giornale} />
      <Route path={"/chi-siamo"} component={ChiSiamo} />
      <Route path={"/contattaci"} component={Contattaci} />
      <Route path={"/grazie"} component={Grazie} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
      >
        <TooltipProvider>
          <Toaster />
          <ConditionalPopup />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
