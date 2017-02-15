import { interpolateRgb } from 'd3-interpolate';
import extend from 'extend';
import linear from '../linear';

function getMinMax(settings, fields) {
  return {
    min: settings.min || (fields ? Math.min(...fields.map(m => m.min())) : 0),
    max: settings.max || (fields ? Math.max(...fields.map(m => m.max())) : 1)
  };
}

function generateDomain(range, min, max) {
  const len = range.length;
  if (len === 2) {
    return [min, max];
  }
  const domain = [];
  const part = (max - min) / (len - 1);

  domain.push(min);
  for (let i = 1; i < len - 1; i++) {
    domain.push(min + (part * i));
  }
  domain.push(max);

  return domain;
}

/**
 * @alias sequential
 * @memberof picasso.scales
 * @param { Array } fields
 * @param { Object } settings
 * @return { sequentialScale } Instance of sequential scale
 */

export default function sequential(settings = {}, fields) {
  const s = linear(fields, settings).interpolate(interpolateRgb);

  /**
   * @alias sequential
   * @param { Object } Item item object with value property
   * @return { string } The blended color
   */
  const fn = function fn(v) {
    return s(v);
  };

  extend(true, fn, s);
  const { min, max } = getMinMax(settings, fields);
  fn.range(settings.colors || settings.range || ['red', 'blue']);
  fn.domain(settings.limits || settings.domain || generateDomain(fn.range(), min, max));

  return fn;
}
