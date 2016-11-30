export function notNumber(value) {
  return typeof value !== 'number' || isNaN(value);
}
