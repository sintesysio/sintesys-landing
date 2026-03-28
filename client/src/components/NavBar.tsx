import { useState } from "react";
import { Link, useLocation } from "wouter";

const BRAIN_ICON = "https://d2xsxph8kpxj0f.cloudfront.net/310519663033619872/TAqDaeLFTUVVb7FZ3dEW9K/brain-icon_a74d4c28.png";

const NAV_ITEMS = [
  { label: "Prima Pagina", href: "/" },
  { label: "Chi Siamo", href: "/chi-siamo" },
  { label: "Contattaci", href: "/contattaci" },
];

export default function NavBar() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav
      className="container"
      style={{ backgroundColor: "#FAFAF7" }}
      role="navigation"
      aria-label="Navigazione principale"
    >
      {/* Top rule */}
      <div className="rule-thick mt-0" />

      {/* Desktop nav */}
      <div className="flex items-center justify-between py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 no-underline">
          <img
            src={BRAIN_ICON}
            alt="Sintesys.io"
            className="h-8 w-8 rounded-full"
            loading="eager"
          />
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = location === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="no-underline px-4 py-1.5 text-xs tracking-[0.15em] uppercase transition-colors"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? "#1B2A4A" : "#666",
                  borderBottom: isActive ? "2px solid #1B2A4A" : "2px solid transparent",
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1 p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Chiudi menu" : "Apri menu"}
          aria-expanded={mobileOpen}
        >
          <span
            className="block w-5 h-0.5 transition-all duration-300"
            style={{
              backgroundColor: "#1B2A4A",
              transform: mobileOpen ? "rotate(45deg) translate(2px, 4px)" : "none",
            }}
          />
          <span
            className="block w-5 h-0.5 transition-all duration-300"
            style={{
              backgroundColor: "#1B2A4A",
              opacity: mobileOpen ? 0 : 1,
            }}
          />
          <span
            className="block w-5 h-0.5 transition-all duration-300"
            style={{
              backgroundColor: "#1B2A4A",
              transform: mobileOpen ? "rotate(-45deg) translate(2px, -4px)" : "none",
            }}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden pb-4">
          <div className="rule-thin mb-3" />
          {NAV_ITEMS.map((item) => {
            const isActive = location === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="block no-underline py-2 text-xs tracking-[0.15em] uppercase"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? "#1B2A4A" : "#666",
                }}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      )}

      {/* Bottom rule */}
      <div className="rule-thin" />
    </nav>
  );
}
