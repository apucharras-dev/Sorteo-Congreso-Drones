import ExcelLoadButton from './ExcelLoadButton';
import Logo from './Logo';

export default function LoadScreen() {
  return (
    <div className="load-screen">
      <Logo size="large" />
      <p className="hero-subtitle">Tucumán, Argentina</p>
      <h1 className="hero-heading">
        <span className="hero-heading__sorteo">Iniciar</span>
        <span className="hero-heading__oficial">Sorteo</span>
      </h1>

      <div className="load-screen__actions">
        <ExcelLoadButton
          className="btn btn--cta btn--large load-btn"
          label="Cargar Excel (nombre y DNI)"
        />
      </div>

      <p className="load-screen__hint">
        Subí un archivo .xlsx, .xls o .csv con columnas <strong>Nombre</strong> (o Nombre completo)
        y <strong>DNI</strong> (también acepta Documento, Cédula, etc.).
      </p>
    </div>
  );
}

export function LoadedBanner({ count, onViewList }) {
  return (
    <div className="loaded-banner">
      <div className="loaded-banner__count">
        <span className="loaded-banner__number">{count}</span>
        <span className="loaded-banner__label">participantes habilitados para el sorteo</span>
      </div>
      <button className="btn btn--ghost btn--small" type="button" onClick={onViewList}>
        Ver listado →
      </button>
    </div>
  );
}
