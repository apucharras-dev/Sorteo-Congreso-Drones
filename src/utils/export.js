import * as XLSX from 'xlsx';

export function exportResults({ premios, winners, discardedHistory, filename }) {
  const wb = XLSX.utils.book_new();

  const winnersData = [
    ['PREMIO', 'NOMBRE GANADOR', 'DNI', 'FECHA', 'HORA'],
    ...premios
      .filter((p) => winners[p.id])
      .map((p) => {
        const w = winners[p.id];
        const date = w.confirmedAt ? new Date(w.confirmedAt) : new Date();
        return [
          p.nombre,
          w.participant.nombre,
          w.participant.dni || '',
          date.toLocaleDateString('es-AR'),
          date.toLocaleTimeString('es-AR'),
        ];
      }),
  ];

  const absentData = [
    ['NOMBRE', 'DNI', 'PREMIO', 'HORA DEL SORTEO'],
    ...discardedHistory.map((entry) => [
      entry.participant.nombre,
      entry.participant.dni || '',
      entry.premioNombre,
      new Date(entry.timestamp).toLocaleTimeString('es-AR'),
    ]),
  ];

  const wsWinners = XLSX.utils.aoa_to_sheet(winnersData);
  const wsAbsent = XLSX.utils.aoa_to_sheet(absentData);

  XLSX.utils.book_append_sheet(wb, wsWinners, 'Ganadores');
  XLSX.utils.book_append_sheet(wb, wsAbsent, 'Ausentes');

  XLSX.writeFile(wb, filename || 'Resultados_Sorteo_Congreso_Drones_Tucuman.xlsx');
}
