/**
 * Calculates expiration date from the current moment
 * @param expiration expiration time in ms
 * @returns expiration date (Date.now() + expiration)
 */
export function calculateExpirationDate(expiration: number) {
  return new Date(Date.now() + expiration);
}
