import LogoIcon from './LogoIcon';

export default function Logo({ size = 'large', onClick, title }) {
  const className = `logo logo--${size}${onClick ? ' logo--clickable' : ''}`;

  const content = (
    <>
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
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        className={className}
        onClick={onClick}
        title={title ?? 'Volver al inicio'}
      >
        {content}
      </button>
    );
  }

  return <div className={className}>{content}</div>;
}
