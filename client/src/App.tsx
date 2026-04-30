import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

// Lazy-loaded pages for code splitting (reduces initial JS bundle)
const LandingPage = lazy(() => import("./pages/LandingPage"));
const Giornale = lazy(() => import("./pages/Giornale"));
const ChiSiamo = lazy(() => import("./pages/ChiSiamo"));
const Contattaci = lazy(() => import("./pages/Contattaci"));
const Grazie = lazy(() => import("./pages/Grazie"));
const Links = lazy(() => import("./pages/Links"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const DataDeletion = lazy(() => import("./pages/DataDeletion"));
const MappaLandingPage = lazy(() => import("./pages/MappaLandingPage"));
const MappaGraziePage = lazy(() => import("./pages/MappaGraziePage"));
const NewsletterPopup = lazy(() => import("./components/NewsletterPopup"));
const AdminLayout = lazy(() => import("./components/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminLeads = lazy(() => import("./pages/admin/AdminLeads"));
const AdminPipeline = lazy(() => import("./pages/admin/AdminPipeline"));
const AdminCampanhas = lazy(() => import("./pages/admin/AdminCampanhas"));
const AdminFinanceiro = lazy(() => import("./pages/admin/AdminFinanceiro"));

/**
 * Popup logic:
 * - ATIVO somente no Giornale (/giornale)
 * - DESATIVADO em todas as outras páginas (homepage, vendas, admin, etc.)
 */
function ConditionalPopup() {
  const [location] = useLocation();
  if (location !== "/giornale") return null;
  return (
    <Suspense fallback={null}>
      <NewsletterPopup />
    </Suspense>
  );
}

function AdminRouter() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
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
    </Suspense>
  );
}

function Router() {
  const [location] = useLocation();

  // Admin routes use their own layout
  if (location.startsWith("/admin")) {
    return <AdminRouter />;
  }

  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <Switch>
        <Route path={"/"} component={LandingPage} />
        <Route path={"/giornale"} component={Giornale} />
        <Route path={"/chi-siamo"} component={ChiSiamo} />
        <Route path={"/contattaci"} component={Contattaci} />
        <Route path={"/grazie"} component={Grazie} />
        <Route path={"/links"} component={Links} />
        <Route path={"/mappa"} component={MappaLandingPage} />
        <Route path={"/mappa/grazie"} component={MappaGraziePage} />
        <Route path={"/privacy-policy"} component={PrivacyPolicy} />
        <Route path={"/terms-of-service"} component={TermsOfService} />
        <Route path={"/data-deletion"} component={DataDeletion} />
        <Route path={"/404"} component={NotFound} />
        {/* Final fallback route */}
        <Route component={NotFound} />
      </Switch>
    </Suspense>
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
