import * as XLSX from 'xlsx';

const COLUMN_MAP = {
  nombre: ['nombre', 'name', 'first name', 'firstname', 'nombres'],
  apellido: ['apellido', 'lastname', 'last name', 'surname', 'apellidos'],
  nombreCompleto: ['nombre completo', 'nombre y apellido', 'full name', 'fullname', 'participante'],
  dni: ['dni', 'documento', 'doc', 'cedula', 'cédula', 'nro documento', 'nro. documento', 'numero documento', 'número documento', 'id'],
  email: ['email', 'e-mail', 'correo', 'mail'],
  empresa: ['empresa', 'company', 'organizacion', 'organización', 'institucion', 'institución', 'institution'],
};

function normalizeHeader(header) {
  if (!header) return '';
  return String(header).toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function findColumnIndex(headers, aliases) {
  const normalized = headers.map(normalizeHeader);
  for (const alias of aliases) {
    const idx = normalized.findIndex((h) => h === alias || h.includes(alias));
    if (idx !== -1) return idx;
  }
  return -1;
}

function detectColumns(headers) {
  const cols = {};
  for (const [key, aliases] of Object.entries(COLUMN_MAP)) {
    cols[key] = findColumnIndex(headers, aliases);
  }
  return cols;
}

function getCellValue(row, index) {
  if (index === -1 || index >= row.length) return '';
  const val = row[index];
  if (val === null || val === undefined) return '';
  return String(val).trim();
}

function buildNombre(row, cols) {
  const nombreCompleto = getCellValue(row, cols.nombreCompleto);
  if (nombreCompleto) return nombreCompleto;

  const nombre = getCellValue(row, cols.nombre);
  const apellido = getCellValue(row, cols.apellido);

  if (nombre && apellido) return `${nombre} ${apellido}`;
  if (nombre) return nombre;
  if (apellido) return apellido;

  return '';
}

function generateId(nombre, dni, index) {
  if (dni) return `dni-${dni.replace(/\D/g, '')}`;
  return `name-${nombre.toLowerCase().replace(/\s+/g, '-')}-${index}`;
}

export function parseParticipantsFromSheet(data) {
  if (!data || data.length === 0) {
    throw new Error('El archivo está vacío o no contiene datos.');
  }

  const headers = data[0].map((h) => String(h ?? '').trim());
  const cols = detectColumns(headers);
  const participants = [];
  const seenIds = new Set();
  const duplicates = [];

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row || row.every((cell) => !cell && cell !== 0)) continue;

    const nombre = buildNombre(row, cols);
    if (!nombre) continue;

    const dni = getCellValue(row, cols.dni) || null;
    const email = getCellValue(row, cols.email) || null;
    const empresa = getCellValue(row, cols.empresa) || null;

    const id = generateId(nombre, dni, i);

    if (seenIds.has(id)) {
      duplicates.push(nombre);
      continue;
    }
    seenIds.add(id);

    participants.push({ id, nombre, dni, email, empresa });
  }

  if (participants.length === 0) {
    throw new Error(
      'No se encontraron participantes válidos. Verificá que el archivo tenga una columna de Nombre o Nombre completo.'
    );
  }

  return { participants, duplicates };
}

export function readExcelFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
        const result = parseParticipantsFromSheet(jsonData);
        resolve(result);
      } catch (err) {
        reject(new Error('No se pudo leer el archivo. Verificá que sea un Excel o CSV válido.'));
      }
    };

    reader.onerror = () => reject(new Error('Error al leer el archivo.'));
    reader.readAsArrayBuffer(file);
  });
}

export function maskDni(dni) {
  if (!dni) return null;
  const cleaned = dni.replace(/\D/g, '');
  if (cleaned.length < 3) return dni;
  const visible = cleaned.slice(-3);
  const masked = '•'.repeat(Math.max(cleaned.length - 3, 3));
  return `${masked}${visible}`;
}

export function createParticipantsFromDemo(demoList) {
  return demoList.map((p, i) => ({
    id: generateId(p.nombre, p.dni, i),
    nombre: p.nombre,
    dni: p.dni,
    email: null,
    empresa: null,
  }));
}
