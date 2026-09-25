export default function LogoIcon({ className }) {
  const c = 30;
  const o = 70;
  const r = 15;

  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <line x1={c} y1={c} x2={o} y2={o} className="logo-icon__arm" />
      <line x1={o} y1={c} x2={c} y2={o} className="logo-icon__arm" />
      <circle cx={c} cy={c} r={r} className="logo-icon__ring" />
      <circle cx={o} cy={c} r={r} className="logo-icon__ring" />
      <circle cx={c} cy={o} r={r} className="logo-icon__ring" />
      <circle cx={o} cy={o} r={r} className="logo-icon__ring" />
      <line x1={c - 6} y1={c - 6} x2={c + 6} y2={c + 6} className="logo-icon__mark" />
      <line x1={c + 6} y1={c - 6} x2={c - 6} y2={c + 6} className="logo-icon__mark" />
      <line x1={o - 6} y1={o - 6} x2={o + 6} y2={o + 6} className="logo-icon__mark" />
      <line x1={o + 6} y1={o - 6} x2={o - 6} y2={o + 6} className="logo-icon__mark" />
    </svg>
  );
}
