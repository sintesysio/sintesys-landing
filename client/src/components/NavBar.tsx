import { Link, useLocation } from "wouter";

const BRAIN_ICON = "https://d2xsxph8kpxj0f.cloudfront.net/310519663033619872/TAqDaeLFTUVVb7FZ3dEW9K/brain-icon_a74d4c28.png";

export default function NavBar() {
  const [location] = useLocation();

  const isGiornaleActive = location === "/giornale";
  const isChiSiamoActive = location === "/chi-siamo";
  const isContattaciActive = location === "/contattaci";

  return (
    <nav
      className="container"
      style={{ backgroundColor: "#FAFAF7" }}
      role="navigation"
      aria-label="Navigazione principale"
    >
      {/* Top rule */}
      <div className="rule-thick mt-0" />

      {/* Nav bar — always visible, no hamburger */}
      <div className="flex items-center justify-between py-3">
        {/* Logo — links to Landing Page */}
        <Link href="/" className="flex items-center gap-2 no-underline">
          <img
            src={BRAIN_ICON}
            alt="Sintesys.io"
            className="h-8 w-8 rounded-full"
            loading="eager"
          />
        </Link>

        {/* Always-visible nav links */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Il Giornale — link to editorial portal */}
          <Link
            href="/giornale"
            className="no-underline px-3 sm:px-4 py-1.5 text-[0.65rem] sm:text-xs tracking-[0.12em] sm:tracking-[0.15em] uppercase transition-colors"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: isGiornaleActive ? 600 : 500,
              color: isGiornaleActive ? "#1B2A4A" : "#444",
              borderBottom: isGiornaleActive ? "2px solid #1B2A4A" : "2px solid transparent",
            }}
          >
            Il Giornale
          </Link>

          {/* Chi Siamo — visible link style */}
          <Link
            href="/chi-siamo"
            className="no-underline hidden sm:inline-block px-3 sm:px-4 py-1.5 text-[0.65rem] sm:text-xs tracking-[0.12em] sm:tracking-[0.15em] uppercase transition-colors"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: isChiSiamoActive ? 600 : 500,
              color: isChiSiamoActive ? "#1B2A4A" : "#444",
              borderBottom: isChiSiamoActive ? "2px solid #1B2A4A" : "2px solid transparent",
            }}
          >
            Chi Siamo
          </Link>

          {/* Contattaci — CTA button style, always prominent */}
          <Link
            href="/contattaci"
            className="no-underline px-4 sm:px-6 py-2 sm:py-2.5 text-[0.65rem] sm:text-xs tracking-[0.12em] sm:tracking-[0.15em] uppercase transition-all"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              color: isContattaciActive ? "#1B2A4A" : "#FAFAF7",
              backgroundColor: isContattaciActive ? "transparent" : "#C4704B",
              border: isContattaciActive ? "2px solid #1B2A4A" : "2px solid #C4704B",
            }}
          >
            Analisi Gratuita
          </Link>
        </div>
      </div>

      {/* Bottom rule */}
      <div className="rule-thin" />
    </nav>
  );
}
