export default function ParticipantsModal({ participants, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal participants-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h2>
            Lista de Participantes
            <span className="participants-modal__count">({participants.length})</span>
          </h2>
          <button className="modal__close" onClick={onClose}>✕</button>
        </div>

        <div className="modal__body participants-list">
          <table className="participants-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>DNI</th>
              </tr>
            </thead>
            <tbody>
              {participants.map((p, i) => (
                <tr key={p.id}>
                  <td className="participants-table__num">{i + 1}</td>
                  <td className="participants-table__name">{p.nombre}</td>
                  <td className="participants-table__dni">{p.dni || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {participants.length === 0 && (
            <p className="participants-empty">No hay participantes cargados</p>
          )}
        </div>
      </div>
    </div>
  );
}
