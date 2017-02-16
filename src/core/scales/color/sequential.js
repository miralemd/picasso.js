import { interpolateRgb } from 'd3-interpolate';
import extend from 'extend';
import notNumber from '../../utils/undef';
import linear from '../linear';

function getMinMax(settings, fields) {
  const ret = { min: settings.min, max: settings.max };

  if (notNumber(settings.min)) {
    ret.min = (fields ? Math.min(...fields.map(m => m.min())) : 0);
  }

  if (notNumber(settings.max)) {
    ret.max = (fields ? Math.max(...fields.map(m => m.max())) : 1);
  }

  return ret;
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
