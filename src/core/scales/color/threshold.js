import { scaleThreshold, scaleLinear } from 'd3-scale';
import { notNumber, minmax } from '../../utils/math';
import sequential from './sequential';

const DEFAULT_COLORS = ['rgb(180,221,212)', 'rgb(34, 83, 90)'];

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

function generateNiceDomain(range, min, max) {
  let numPoints = range.length === 2 ? 10 : Math.max(1, range.length);
  let lin = scaleLinear().domain([min, max]).nice([numPoints]);
  let domain = lin.ticks([numPoints]);

  if (!range || !range.length) {
    return domain;
  }

  if (domain.length >= range.length) {
    // remove values from endpoints
    let num = Math.max(0, range.length - 1);
    while (domain.length > num) {
      if (domain[0] - min <= max - domain[domain.length - 1]) {
        domain.shift();
      } else {
        domain.pop();
      }
    }
  }

  return domain;
}

/**
 * @alias threshold
 * @memberof picasso.scales
 * @param { Object } [settings] Settings for this scale. If both domain and range are specified, they have to fulfill domain.length === range.length + 1,  otherwise they will be overriden.
 * @param { number[] } [settings.domain] Values defining the thresholds.
 * @param { color[] } [settings.range] CSS color values of the output.
 * @param { number } [settings.max] Max value for the domain. Overrides dynamically calculated max value from fields.
 * @param { number } [settings.min] Min value for the domain. Overrides dynamically calculated min value from fields.
 * @param { field[] } [fields] Fields to dynamically calculate the thresholds.
 * @return { thresholdScale } Instance of threshold scale
 *
 * @example
 * let t = threshold({
 *   range: ['black', 'white'],
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
   * @alias thresholdScale
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

  const [min, max] = minmax(settings, fields);
  let range = settings.range || DEFAULT_COLORS;
  let domain = settings.domain || (settings.nice ? generateNiceDomain(range, min, max) : [min + ((max - min) / 2)]);

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
