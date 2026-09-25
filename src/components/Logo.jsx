import LogoIcon from './LogoIcon';

export default function Logo({ size = 'large' }) {
  return (
    <div className={`logo logo--${size}`}>
      <div className="logo__icon" aria-hidden="true">
        <LogoIcon className="logo__svg" />
      </div>
      <div className="logo__text">
        <span className="logo__congress">CONGRESO INTERNACIONAL DE</span>
        <span className="logo__drones">
          <span className="logo__drones-word">DRONES</span>
          <span className="logo__year">2026</span>
        </span>
      </div>
    </div>
  );
}
