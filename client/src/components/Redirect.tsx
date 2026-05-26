import { useEffect } from "react";
import { useLocation } from "wouter";

/**
 * Client-side redirect component.
 * Immediately navigates to the target path on mount.
 */
export default function Redirect({ to }: { to: string }) {
  const [, setLocation] = useLocation();

  useEffect(() => {
    setLocation(to, { replace: true });
  }, [to, setLocation]);

  return null;
}
