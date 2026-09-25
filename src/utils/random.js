/**
 * Selección aleatoria robusta usando crypto.getRandomValues
 */
export function getSecureRandomIndex(max) {
  if (max <= 0) return -1;
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0] % max;
}

export function pickRandomParticipant(participants) {
  if (!participants || participants.length === 0) return null;
  const index = getSecureRandomIndex(participants.length);
  return participants[index];
}

export function shuffleArray(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = getSecureRandomIndex(i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
