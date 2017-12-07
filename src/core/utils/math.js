
const minAccessor = v => v.min();
const maxAccessor = v => v.max();
const numericFilter = v => typeof v === 'number' && !isNaN(v);

/**
 * Calculate the min/max value based on various inputs.
 *
 * Provided min/max setting takes presedence over all other inputs. If not provided, the respective values are calculated
 * from the given arr input, where each item in the array is expected to have a min/max accessor.
 *
 * @private
 * @param {object} [settings]
 * @param {number} [settings.min] The minimum value. Defaults to 0 if not provided.
 * @param {number} [settings.max] The maximum value. Defaults to 1 if not provided.
 * @param {object} [arr]
 * @returns { object[] } An array containing the min and max values.
 *
 * @example
 * minmax(); // [0, 1]
 *
 * minmax({}, [
 * { min: () => 13, max: () => 15 },
 * { min: () => NaN, max: () => 17 },
 * ]); // [13, 17]
 *
 * minmax({ min: -5, max: 4 }, [
 * { min: () => -20, max: () => 15 },
 * ]); // [-5, 4]
 */
export function minmax(settings, arr) {
  const definedMin = settings && typeof settings.min !== 'undefined';
  const definedMax = settings && typeof settings.max !== 'undefined';

  let min = definedMin ? +settings.min : 0;
  let max = definedMax ? +settings.max : 1;

  if (arr && arr.length) {
    if (!definedMin) {
      const arrMin = arr.map(minAccessor).filter(numericFilter);
      min = arrMin.length ? Math.min(...arrMin) : min;
    }

    if (!definedMax) {
      const arrMax = arr.map(maxAccessor).filter(numericFilter);
      max = arrMax.length ? Math.max(...arrMax) : max;
    }
  }

  return [min, max];
}

export function notNumber(value) {
  return typeof value !== 'number' || isNaN(value);
}

/**
 * Get x1, y1, x2, y2 point from angle
 * Source: {@link https://codepen.io/NV/pen/jcnmK}
 * @private
 *
 * @param  {Number} angle Radians
 * @return {Object}       Point with x1, y2, x2, y2.
 */
export function angleToPoints(angle) {
  let segment = Math.floor((angle / Math.PI) * 2) + 2;
  let diagonal = ((0.5 * segment) + 0.25) * Math.PI;
  let op = Math.cos(Math.abs(diagonal - angle)) * Math.sqrt(2);
  let x = op * Math.cos(angle);
  let y = op * Math.sin(angle);

  return {
    x1: x < 0 ? 1 : 0,
    y1: y < 0 ? 1 : 0,
    x2: x >= 0 ? x : x + 1,
    y2: y >= 0 ? y : y + 1
  };
}

/**
 * Turns degrees into radians
 * @private
 *
 * @param  {Number} degrees Degrees
 * @return {Number}         Radians
 */
export function toRadians(d) {
  return ((-d) / 180) * Math.PI;
}

/**
 * Get x1, y1, x2, y2 point from degree
 * @private
 *
 * @param  {Number} d Degree
 * @return {Object}   Point with x1, y2, x2, y2.
 */
export function degreesToPoints(d) {
  return angleToPoints(toRadians(d));
}
