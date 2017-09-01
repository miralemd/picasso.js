import { interpolateRgb } from 'd3-interpolate';
import extend from 'extend';
import { minmax } from '../../utils/math';
import linear from '../linear';

const DEFAULT_COLORS = ['rgb(180,221,212)', 'rgb(34, 83, 90)'];

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
 * @alias scaleSequentialColor
 * @memberof picasso
 * @param { Object } [settings] Settings for this scale. If both range and domain are specified, they have to fulfill range.length === domain.length, otherwise they will be overriden.
 * @param { number[] } [settings.domain] Numeric values indicating stop limits between start and end values.
 * @param { color[] } [settings.range] CSS color values indicating stop colors between start and end values.
 * @param { field[] } [fields] Fields to dynamically calculate the domain extent.
 * @return { sequentialColor }
 *
 * @example
 * picasso.scaleSequentialColor({
 *  range: ['red', '#fc6', 'green'],
 *  domain: [-40, 0, 100]
 * });
 */

export default function scaleSequentialColor(settings = {}, fields) {
  const s = linear(fields, settings).clamp(true).interpolate(interpolateRgb);

  /**
   * @alias sequentialColor
   * @kind function
   * @param { Object } v Object containing a 'value' property
   * @return { string } The blended color
   */
  const fn = s;

  extend(true, fn, s);
  const [min, max] = minmax(settings, fields);
  fn.range(settings.range || DEFAULT_COLORS);
  fn.range(settings.invert ? fn.range().reverse() : fn.range());
  fn.domain(settings.domain || generateDomain(fn.range(), min, max));

  return fn;
}
