import { useRef, useState } from 'react';
import { useRaffle } from '../context/RaffleContext';
import { readExcelFile } from '../utils/participants';

const VALID_EXTENSIONS = ['.xlsx', '.xls', '.csv'];

function isDrawingActive(prizeStates) {
  return Object.values(prizeStates).some(
    (ps) => ps.status === 'drawing' || ps.status === 'selected'
  );
}

export default function ExcelLoadButton({
  className = 'btn btn--secondary',
  label = 'Cargar Excel',
  loadingLabel = 'Procesando...',
  disabled = false,
  onLoaded,
}) {
  const { state, loadParticipants } = useRaffle();
  const fileRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    if (!VALID_EXTENSIONS.includes(ext)) {
      setError('Formato no válido. Usá archivos .xlsx, .xls o .csv');
      return;
    }

    if (isDrawingActive(state.prizeStates)) {
      setError('No se puede cambiar el listado durante un sorteo activo.');
      if (fileRef.current) fileRef.current.value = '';
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { participants, duplicates, missingDniColumn, withoutDni } =
        await readExcelFile(file);
      loadParticipants(participants, duplicates, false, { missingDniColumn, withoutDni });
      onLoaded?.({
        count: participants.length,
        duplicates,
        missingDniColumn,
        withoutDni,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <span className="excel-load-button">
      <label className={`${className}${loading || disabled ? ' btn--disabled' : ''}`}>
        <input
          ref={fileRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleFile}
          hidden
          disabled={loading || disabled}
        />
        {loading ? loadingLabel : label}
      </label>
      {error && <span className="excel-load-button__error">{error}</span>}
    </span>
  );
}
