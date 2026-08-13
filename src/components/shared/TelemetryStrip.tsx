import React, { useEffect, useState } from "react";

/**
 * Signature instrument-panel element: a live scrolling tick strip used in the
 * topbar-adjacent hero regions to reinforce the "oscilloscope" identity of MedTwin.
 */
export function TelemetryStrip({ seed = 1 }: { seed?: number }) {
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setOffset((o) => (o + 1) % 1000), 90);
    return () => clearInterval(id);
  }, []);
  const points = Array.from({ length: 48 }, (_, i) => {
    const v = Math.sin((i + offset * 0.4 + seed * 7) / 3.1) * 0.5 + Math.sin((i + offset * 0.7) / 1.3) * 0.2;
    return v;
  });
  return (
    <svg viewBox="0 0 480 40" className="h-8 w-full opacity-70" preserveAspectRatio="none">
      <polyline
        fill="none"
        stroke="#4FD1C5"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points.map((v, i) => `${(i / (points.length - 1)) * 480},${20 - v * 16}`).join(" ")}
      />
    </svg>
  );
}
