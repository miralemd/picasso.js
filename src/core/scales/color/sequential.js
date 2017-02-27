import { interpolateRgb } from 'd3-interpolate';
import extend from 'extend';
import { minmax } from '../../utils/math';
import linear from '../linear';

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
 * @param { Object } settings Settings for this scale. If both colors and limit are declared, they have to fulfill numColors == numLimits else they will be overrided.
 * @param { Object } settings.range Explicit limits indicating breaks between colors.
 * @param { Object } settings.domain Colors to use in the scale.
 * @param { field[] } fields
 * @return { sequentialScale } Instance of sequential scale
 */

export default function sequential(settings = {}, fields) {
  const s = linear(fields, settings).clamp(true).interpolate(interpolateRgb);

  /**
   * @alias sequentialScale
   * @param { object } v Object containing a 'value' property
   * @return { string } The blended color
   */
  const fn = function fn(v) {
    return s(v);
  };

  extend(true, fn, s);
  const [min, max] = minmax(settings, fields);
  fn.range(settings.range || ['red', 'blue']);
  fn.domain(settings.domain || generateDomain(fn.range(), min, max));

  return fn;
}
