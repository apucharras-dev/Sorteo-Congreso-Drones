const STORAGE_KEY = 'sorteo-congreso-drones';

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Error guardando en localStorage:', err);
  }
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearState() {
  localStorage.removeItem(STORAGE_KEY);
}

export function hasExistingSession() {
  const state = loadState();
  return state !== null && (state.participants?.length > 0 || Object.keys(state.winners || {}).length > 0);
}
