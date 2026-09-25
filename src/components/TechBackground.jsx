export default function TechBackground() {
  return (
    <div className="tech-bg" aria-hidden="true">
      <div className="tech-bg__gradient" />
      <div className="tech-bg__pattern">
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} className="tech-bg__x" style={{ '--i': i }}>
            ✕
          </span>
        ))}
      </div>
      <div className="tech-bg__grid" />
      <div className="tech-bg__drone-network">
        <svg viewBox="0 0 200 200" className="drone-network-svg">
          <circle cx="50" cy="50" r="18" className="drone-node" />
          <circle cx="150" cy="50" r="18" className="drone-node" />
          <circle cx="50" cy="150" r="18" className="drone-node" />
          <circle cx="150" cy="150" r="18" className="drone-node" />
          <line x1="50" y1="50" x2="150" y2="150" className="drone-line" />
          <line x1="150" y1="50" x2="50" y2="150" className="drone-line" />
          <text x="50" y="55" className="drone-x">✕</text>
          <text x="150" y="55" className="drone-x">✕</text>
          <text x="50" y="155" className="drone-x">✕</text>
          <text x="150" y="155" className="drone-x">✕</text>
        </svg>
      </div>
      <div className="tech-bg__glow tech-bg__glow--1" />
      <div className="tech-bg__glow tech-bg__glow--2" />
    </div>
  );
}
