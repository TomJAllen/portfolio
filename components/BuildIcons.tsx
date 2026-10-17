// Rough line icons for the Building cards. Placeholders until proper marks exist.

export function SurfFlagIcon() {
  // The red-and-yellow patrol flag: swim between these.
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className="build-icon">
      <line x1="12" y1="6" x2="12" y2="44" className="stroke" />
      <rect x="13" y="8" width="26" height="9" fill="var(--red)" />
      <rect x="13" y="17" width="26" height="9" fill="var(--ochre)" />
      <path d="M6 40 q4 -3 8 0 t8 0 t8 0 t8 0 t8 0" className="stroke thin" fill="none" />
    </svg>
  );
}

export function HomeLabIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className="build-icon">
      {[8, 20, 32].map((y) => (
        <g key={y}>
          <rect x="8" y={y} width="32" height="9" rx="2" className="stroke" fill="none" />
          <circle cx="14" cy={y + 4.5} r="1.6" fill="var(--teal)" />
          <line x1="20" y1={y + 4.5} x2="34" y2={y + 4.5} className="stroke thin" />
        </g>
      ))}
    </svg>
  );
}

export function GamesIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className="build-icon">
      <rect x="5" y="14" width="38" height="22" rx="11" className="stroke" fill="none" />
      <line x1="15" y1="20" x2="15" y2="30" className="stroke" />
      <line x1="10" y1="25" x2="20" y2="25" className="stroke" />
      <circle cx="31" cy="22" r="2.4" fill="var(--ultramarine)" />
      <circle cx="36" cy="28" r="2.4" fill="var(--red)" />
    </svg>
  );
}

export function ChatRecapIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className="build-icon">
      <path d="M8 8 h32 a3 3 0 0 1 3 3 v20 a3 3 0 0 1 -3 3 h-20 l-8 7 v-7 h-4 a3 3 0 0 1 -3 -3 v-20 a3 3 0 0 1 3 -3 z" className="stroke" fill="none" />
      <rect x="14" y="22" width="4" height="7" fill="var(--teal)" />
      <rect x="22" y="16" width="4" height="13" fill="var(--ochre)" />
      <rect x="30" y="19" width="4" height="10" fill="var(--red)" />
    </svg>
  );
}
