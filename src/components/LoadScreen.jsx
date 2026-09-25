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
    </div>
  );
}
