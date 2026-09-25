import { useRef, useState } from 'react';
import { useRaffle } from '../context/RaffleContext';
import { readExcelFile } from '../utils/participants';
import { exportResults } from '../utils/export';

export default function AdminPanel({
  onClose,
  onViewList,
  onHistory,
  onLoadDemo,
}) {
  const {
    state,
    stats,
    resetRaffle,
    toggleSound,
    updatePremios,
    loadParticipants,
  } = useRaffle();

  const fileRef = useRef(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [editingPremios, setEditingPremios] = useState(false);
  const [premioNames, setPremioNames] = useState(
    state.premios.map((p) => ({ ...p }))
  );
  const [loadError, setLoadError] = useState(null);

  const handleReset = () => {
    resetRaffle();
    setShowResetConfirm(false);
    onClose();
  };

  const handleFileReload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const drawing = Object.values(state.prizeStates).some(
      (ps) => ps.status === 'drawing' || ps.status === 'selected'
    );
    if (drawing) {
      setLoadError('No se puede cambiar el archivo durante un sorteo activo.');
      return;
    }

    try {
      const { participants, duplicates } = await readExcelFile(file);
      loadParticipants(participants, duplicates);
      setLoadError(null);
    } catch (err) {
      setLoadError(err.message);
    }
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleSavePremios = () => {
    updatePremios(premioNames);
    setEditingPremios(false);
  };

  const handleExport = () => {
    const discardedHistory = state.history.filter((h) => h.status === 'absent');
    exportResults({
      premios: state.premios,
      winners: state.winners,
      discardedHistory,
    });
  };

  return (
    <div className="modal-overlay admin-overlay" onClick={onClose}>
      <div className="modal admin-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h2>⚙ Panel de Control</h2>
          <button className="modal__close" onClick={onClose}>✕</button>
        </div>

        <div className="modal__body">
          <div className="admin-stats">
            <div className="admin-stat">
              <span className="admin-stat__label">Participantes cargados</span>
              <span className="admin-stat__value">{stats.total}</span>
            </div>
            <div className="admin-stat">
              <span className="admin-stat__label">Disponibles</span>
              <span className="admin-stat__value">{stats.available}</span>
            </div>
            <div className="admin-stat">
              <span className="admin-stat__label">Ganadores</span>
              <span className="admin-stat__value">{stats.winners}</span>
            </div>
            <div className="admin-stat">
              <span className="admin-stat__label">Descartados</span>
              <span className="admin-stat__value">{stats.discarded}</span>
            </div>
          </div>

          {state.demoMode && (
            <div className="alert alert--warning">Modo demo activo</div>
          )}

          <div className="admin-actions">
            <label className="btn btn--secondary admin-action-btn">
              <input
                ref={fileRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileReload}
                hidden
              />
              Cargar otro Excel
            </label>

            <button className="btn btn--secondary admin-action-btn" onClick={onViewList}>
              Ver participantes
            </button>

            <button className="btn btn--secondary admin-action-btn" onClick={onHistory}>
              Ver historial
            </button>

            <button className="btn btn--secondary admin-action-btn" onClick={handleExport}>
              Exportar resultados
            </button>

            <button
              className="btn btn--secondary admin-action-btn"
              onClick={toggleSound}
            >
              {state.soundEnabled ? '🔊 Sonido ON' : '🔇 Sonido OFF'}
            </button>

            <button
              className="btn btn--secondary admin-action-btn"
              onClick={onLoadDemo}
            >
              Modo demo
            </button>

            <button
              className="btn btn--secondary admin-action-btn"
              onClick={() => setEditingPremios(!editingPremios)}
            >
              Editar premios
            </button>
          </div>

          {loadError && <div className="alert alert--error">{loadError}</div>}

          {editingPremios && (
            <div className="admin-premios-edit">
              <h4>Nombres de premios</h4>
              {premioNames.map((p, i) => (
                <input
                  key={p.id}
                  className="admin-input"
                  value={p.nombre}
                  onChange={(e) => {
                    const updated = [...premioNames];
                    updated[i] = { ...p, nombre: e.target.value };
                    setPremioNames(updated);
                  }}
                />
              ))}
              <button className="btn btn--primary btn--small" onClick={handleSavePremios}>
                Guardar
              </button>
            </div>
          )}

          <div className="admin-danger-zone">
            {!showResetConfirm ? (
              <button
                className="btn btn--danger"
                onClick={() => setShowResetConfirm(true)}
              >
                Reiniciar sorteo
              </button>
            ) : (
              <div className="reset-confirm">
                <p>¿Estás seguro de que querés eliminar todos los resultados del sorteo?</p>
                <div className="reset-confirm__actions">
                  <button className="btn btn--danger" onClick={handleReset}>
                    Sí, reiniciar
                  </button>
                  <button
                    className="btn btn--ghost"
                    onClick={() => setShowResetConfirm(false)}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
