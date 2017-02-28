import { scaleThreshold } from 'd3-scale';
import { notNumber } from '../../utils/math';
import sequential from './sequential';

function getMinMax(settings, fields) {
  const ret = { min: settings.min, max: settings.max };

  if (notNumber(settings.min)) {
    ret.min = (fields && fields.length ? Math.min(...fields.map(m => m.min())) : 0);
  }

  if (notNumber(settings.max)) {
    ret.max = (fields && fields.length ? Math.max(...fields.map(m => m.max())) : 1);
  }

  return ret;
}

function generateDomain(range, min, max) {
  const len = range.length;
  if (len === 2) {
    return [min + ((max - min) / 2)];
  }
  const domain = [];
  const part = (max - min) / len;

  for (let i = 1; i < len; i++) {
    domain.push(min + (part * i));
  }
  return domain;
}

function getBreaks(domain) {
  const ret = [];
  for (let i = 0; i < domain.length - 1; i++) {
    ret.push((domain[i] + domain[i + 1]) / 2);
  }
  return ret;
}

function generateRange(domain, colors, min, max) {
  const seq = sequential().domain([min, max]).range(colors);
  const values = [min, ...getBreaks(domain), max];
  return values.map(v => seq({ value: v }));
}

/**
 * @alias threshold
 * @memberof picasso.scales
 * @param { Object } settings Settings for this scale. If both colors and limit are declared, they have to fulfill numColors == numLimits + 1 else they will be overrided.
 * @param { Array } settings.limits Explicit limits indicating breaks between colors.
 * @param { Array } settings.domain Alias for settings.limits
 * @param { Array } settings.colors Colors to use in the scale.
 * @param { Array } settings.range Alias for settings.colors
 * @param { Number } settings.max Max value for the scale. Overrides field max.
 * @param { Number } settings.min Min value for the scale. Overrides field min.
 * @param { Array } fields
 * @return { thresholdScale } Instance of threshold scale
 * @example
 * let t = threshold({
 *   colors: ['black', 'white'],
 *   domain: [25,50,75],
 *   max: 100,
 *   min: 0
 * });
 * t.domain(); // [25,50,75]
 * t.range(); // Generates from colors and domain: ['rgb(0,0,0)','rgb(85,85,85)','rgb(170,170,170)','rgb(255,255,255)']
 */

export default function threshold(settings = {}, fields) {
  const d3Scale = scaleThreshold();

  /**
   * @alias threshold
   * @param { Object } Item item object with value property
   * @return { String } The color from the appropriate band
   */
  function fn(v) {
    if (notNumber(v.value)) {
      return NaN;
    }
    return d3Scale(v.value);
  }

  /**
 * @param { Number[] } [values] Set or Get domain values
 * @return { thresholdScale | Number[] } The instance this method was called on if a parameter is provided, otherwise the current domain is returned
 */
  fn.domain = function domain(values) {
    if (arguments.length) {
      d3Scale.domain(values);

      return fn;
    }
    return d3Scale.domain();
  };

  /**
   * @param { Number[] } [values] Set or Get range values
   * @return { thresholdScale | Number[] } The instance this method was called on if a parameter is provided, otherwise the current range is returned
   */
  fn.range = function range(values) {
    if (arguments.length) {
      d3Scale.range(values);

      return fn;
    }
    return d3Scale.range();
  };

  const { min, max } = getMinMax(settings, fields);
  let domain = settings.limits || settings.domain || [min + ((max - min) / 2)];
  let range = settings.colors || settings.range || ['red', 'blue'];
  if (range.length > domain.length + 1) {
    // Generate limits from range
    domain = generateDomain(range, min, max);
  } else if (range.length < domain.length + 1) {
    // Generate additional colors
    range = generateRange(domain, range, min, max);
  }
  fn.range(range);
  fn.domain(domain);

  return fn;
}
