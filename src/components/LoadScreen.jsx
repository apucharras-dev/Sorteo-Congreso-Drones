import { useRef, useState } from 'react';
import { readExcelFile } from '../utils/participants';
import { useRaffle } from '../context/RaffleContext';
import Logo from './Logo';

export default function LoadScreen({ onViewList }) {
  const { loadParticipants, loadDemo } = useRaffle();
  const fileRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [warning, setWarning] = useState(null);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validExts = ['.xlsx', '.xls', '.csv'];
    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    if (!validExts.includes(ext)) {
      setError('Formato no válido. Usá archivos .xlsx, .xls o .csv');
      return;
    }

    setLoading(true);
    setError(null);
    setWarning(null);

    try {
      const { participants, duplicates } = await readExcelFile(file);
      if (duplicates.length > 0) {
        setWarning(
          `Se detectaron ${duplicates.length} participante(s) duplicado(s) que fueron omitidos.`
        );
      }
      loadParticipants(participants, duplicates);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleDemo = () => {
    loadDemo();
  };

  return (
    <div className="load-screen">
      <Logo size="large" />
      <p className="hero-subtitle">Tucumán, Argentina</p>
      <h1 className="hero-heading">
        <span className="hero-heading__sorteo">Sorteo</span>
        <span className="hero-heading__oficial">Oficial</span>
      </h1>

      <div className="load-screen__actions">
        <div className="btn-group">
          <label className="btn btn--cta btn--large load-btn">
            <input
              ref={fileRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFile}
              hidden
              disabled={loading}
            />
            {loading ? 'Procesando...' : 'Cargar listado de participantes'}
          </label>

          <button className="btn btn--secondary btn--large" onClick={handleDemo}>
            Modo demo
          </button>
        </div>
      </div>

      {error && <div className="alert alert--error">{error}</div>}
      {warning && <div className="alert alert--warning">{warning}</div>}

      <p className="load-screen__hint">
        Formatos aceptados: .xlsx, .xls, .csv
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
      <button className="btn btn--ghost btn--small" onClick={onViewList}>
        Ver listado →
      </button>
    </div>
  );
}
