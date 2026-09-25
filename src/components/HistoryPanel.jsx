export default function HistoryPanel({ history, premios, onClose }) {
  const grouped = premios.map((premio) => ({
    premio,
    entries: history.filter((h) => h.prizeId === premio.id),
  }));

  const formatTime = (ts) => new Date(ts).toLocaleTimeString('es-AR');

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal history-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h2>Historial del Sorteo</h2>
          <button className="modal__close" onClick={onClose}>✕</button>
        </div>

        <div className="modal__body">
          {grouped.map(({ premio, entries }) => (
            <div key={premio.id} className="history-group">
              <h3 className="history-group__title">{premio.nombre}</h3>
              {entries.length === 0 ? (
                <p className="history-group__empty">Sin intentos registrados</p>
              ) : (
                <ul className="history-list">
                  {entries.map((entry, i) => (
                    <li key={i} className={`history-item history-item--${entry.status}`}>
                      <div className="history-item__attempt">Intento {entry.attempt}</div>
                      <div className="history-item__name">{entry.participant.nombre}</div>
                      <div className="history-item__status">
                        {entry.status === 'confirmed' ? '✅ Ganador confirmado' : '❌ Ausente'}
                      </div>
                      <div className="history-item__time">{formatTime(entry.timestamp)}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
