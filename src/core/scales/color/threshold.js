import { scaleThreshold } from 'd3-scale';
import notNumber from '../../utils/undef';
import sequential from './sequential';

function getMinMax(fields) {
  return {
    min: Math.min(...fields.map(m => m.min())),
    max: Math.max(...fields.map(m => m.max()))
  };
}

function generateDomain(range, min, max) {
  const l = range.length;
  if (l === 2) {
    return [min + ((max - min) / 2)];
  }
  const domain = [];
  const part = (max - min) / l;

  for (let i = 1; i < l; i++) {
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

export default function threshold(settings, fields) {
  const d3Scale = scaleThreshold();

  /**
   * @alias threshold
   * @param { Object } Item item object with value property
   * @return { Number } The scaled value
   */
  function fn(v) {
    if (notNumber(v.value)) {
      return NaN;
    }
    return d3Scale(v.value);
  }

  /**
 * @param { Number[] } [values] Set or Get domain values
 * @return { linearScale | Number[] } The instance this method was called on if a parameter is provided, otherwise the current domain is returned
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
   * @return { linearScale | Number[] } The instance this method was called on if a parameter is provided, otherwise the current range is returned
   */
  fn.range = function range(values) {
    if (arguments.length) {
      d3Scale.range(values);

      return fn;
    }
    return d3Scale.range();
  };

  if (settings && fields) {
    const { min, max } = getMinMax(fields);
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
  }
  return fn;
}
