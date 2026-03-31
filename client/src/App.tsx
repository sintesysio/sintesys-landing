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
import Links from "./pages/Links";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import DataDeletion from "./pages/DataDeletion";
import NewsletterPopup from "./components/NewsletterPopup";
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLeads from "./pages/admin/AdminLeads";
import AdminPipeline from "./pages/admin/AdminPipeline";
import AdminCampanhas from "./pages/admin/AdminCampanhas";
import AdminFinanceiro from "./pages/admin/AdminFinanceiro";

/**
 * Popup logic:
 * - ATIVO somente no Giornale (/giornale)
 * - DESATIVADO em todas as outras páginas
 */
function ConditionalPopup() {
  const [location] = useLocation();
  if (location !== "/giornale") return null;
  return <NewsletterPopup />;
}

function AdminRouter() {
  return (
    <AdminLayout>
      <Switch>
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/admin/leads" component={AdminLeads} />
        <Route path="/admin/pipeline" component={AdminPipeline} />
        <Route path="/admin/campanhas" component={AdminCampanhas} />
        <Route path="/admin/financeiro" component={AdminFinanceiro} />
        <Route component={AdminDashboard} />
      </Switch>
    </AdminLayout>
  );
}

function Router() {
  const [location] = useLocation();

  // Admin routes use their own layout
  if (location.startsWith("/admin")) {
    return <AdminRouter />;
  }

  return (
    <Switch>
      <Route path={"/"} component={LandingPage} />
      <Route path={"/giornale"} component={Giornale} />
      <Route path={"/chi-siamo"} component={ChiSiamo} />
      <Route path={"/contattaci"} component={Contattaci} />
      <Route path={"/grazie"} component={Grazie} />
      <Route path={"/links"} component={Links} />
      <Route path={"/privacy-policy"} component={PrivacyPolicy} />
      <Route path={"/terms-of-service"} component={TermsOfService} />
      <Route path={"/data-deletion"} component={DataDeletion} />
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
