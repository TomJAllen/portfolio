// Hero orrery: each orbit is one of Tom's identities circling the TJA model.
import type { CSSProperties } from "react";

const C = 320;

type Orbit = {
  r: number;
  label: string;
  color: string;
  size: number;
  hollow?: boolean;
  angle: number; // resting angle in degrees
  period: number; // seconds per revolution
  dashed?: boolean;
};

const ORBITS: Orbit[] = [
  { r: 104, label: "product", color: "var(--ultramarine)", size: 9, angle: 210, period: 48 },
  { r: 152, label: "ai platforms", color: "var(--teal)", size: 12, angle: 320, period: 72 },
  { r: 200, label: "build", color: "var(--ochre)", size: 10, angle: 40, period: 100, dashed: true },
  { r: 248, label: "play", color: "var(--text)", size: 8, hollow: true, angle: 150, period: 136 },
  { r: 290, label: "endurance", color: "var(--red)", size: 11, angle: 255, period: 180, dashed: true },
];

function circlePath(r: number) {
  // Full circle starting at 9 o'clock, clockwise, so labels read along the top.
  return `M ${C - r},${C} a ${r},${r} 0 1,1 ${2 * r},0 a ${r},${r} 0 1,1 ${-2 * r},0`;
}

function polar(r: number, deg: number) {
  const a = ((deg - 90) * Math.PI) / 180;
  return { x: C + r * Math.cos(a), y: C + r * Math.sin(a) };
}

export default function Orrery() {
  const ticks = Array.from({ length: 120 }, (_, i) => i * 3);

  return (
    <svg className="orrery" viewBox="0 0 640 640" role="img" aria-labelledby="orrery-title orrery-desc">
      <title id="orrery-title">The TJA orrery</title>
      <desc id="orrery-desc">
        A schematic orrery. The TJA monogram sits at the centre, with five orbits around it for
        product, AI platforms, build, play and endurance.
      </desc>
      <defs>
        {ORBITS.map((o) => (
          <path key={o.label} id={`orbit-${o.r}`} d={circlePath(o.r)} fill="none" />
        ))}
      </defs>

      {/* Construction lines */}
      <g className="construction">
        <line x1={C} y1={8} x2={C} y2={632} />
        <line x1={8} y1={C} x2={632} y2={C} />
        <line x1={C - 226} y1={C - 226} x2={C + 226} y2={C + 226} />
        <line x1={C + 226} y1={C - 226} x2={C - 226} y2={C + 226} />
      </g>

      {/* Outer dial: settles into place on load, then drifts very slowly */}
      <g className="dial">
        <g className="dial-spin">
          {ticks.map((deg) => {
            const long = deg % 30 === 0;
            const a = polar(306, deg);
            const b = polar(long ? 318 : 312, deg);
            return <line key={deg} x1={a.x} y1={a.y} x2={b.x} y2={b.y} className={long ? "tick long" : "tick"} />;
          })}
        </g>
      </g>

      {/* Orbits, each with its planet. Hovering an orbit lights it in its planet's colour. */}
      {ORBITS.map((o, i) => {
        const p = polar(o.r, o.angle);
        const vars = {
          "--c": o.color,
          "--i": i,
          "--period": `${o.period}s`,
        } as CSSProperties;
        return (
          <g key={o.label} className="orbit" style={vars}>
            <circle cx={C} cy={C} r={o.r} className="hit" />
            <circle cx={C} cy={C} r={o.r} className={o.dashed ? "ring dashed" : "ring"} />
            <text className="ring-label">
              <textPath href={`#orbit-${o.r}`} startOffset="25%" textAnchor="middle">
                {o.label}
              </textPath>
            </text>
            <g className="revolve">
              <g className="arrive">
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={o.size}
                  className="body"
                  fill={o.hollow ? "var(--ground)" : o.color}
                  stroke={o.color}
                  strokeWidth={o.hollow ? 2.5 : 0}
                />
              </g>
            </g>
          </g>
        );
      })}

      {/* The model at the centre */}
      <g className="core-group">
        <circle cx={C} cy={C} r={54} className="core" />
        <text x={C} y={C + 1} className="core-mark" textAnchor="middle" dominantBaseline="central">
          TJA
        </text>
      </g>
      <g className="tittle" style={{ "--period": "18s" } as CSSProperties}>
        <circle cx={C + 66} cy={C - 30} r={5} fill="var(--red)" />
      </g>
    </svg>
  );
}
