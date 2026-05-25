/**
 * MappaGraziePage — Redirect 301 to /masterclass/grazie
 * The Mappa is now free (included with lead signup).
 * Old /mappa/grazie links redirect to the Masterclass thank you page.
 */

import { useEffect } from "react";
import { useLocation } from "wouter";

export default function MappaGraziePage() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Redirect to masterclass grazie page, preserving any query params
    const params = window.location.search;
    setLocation(`/masterclass/grazie${params}`, { replace: true });
  }, [setLocation]);

  return (
    <div className="min-h-screen bg-[#FAFAF7] flex items-center justify-center">
      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", color: "#666" }}>
        Reindirizzamento in corso...
      </p>
    </div>
  );
}
