export default function SessionModal({ onContinue, onNew }) {
  return (
    <div className="modal-overlay session-overlay">
      <div className="modal session-modal">
        <div className="modal__header">
          <h2>Sesión anterior detectada</h2>
        </div>
        <div className="modal__body">
          <p className="session-modal__text">
            Existe una sesión de sorteo anterior. ¿Qué deseás hacer?
          </p>
          <div className="session-modal__actions">
            <button className="btn btn--primary btn--large" onClick={onContinue}>
              CONTINUAR SORTEO
            </button>
            <button className="btn btn--ghost btn--large" onClick={onNew}>
              INICIAR NUEVO SORTEO
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
