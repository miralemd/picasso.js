import { scaleBand } from 'd3-scale';
import { generateDiscreteTicks } from './ticks/tick-generators';

const AVAILABLE_SETTINGS = [
  'padding',
  'paddingOuter',
  'paddingInner',
  'align',
  'invert'
];

function unique(values) {
  const exists = {};
  return values.filter((v) => {
    if (exists[v.id]) {
      return false;
    }
    return (exists[v.id] = true);
  });
}

function evalSetting(settings, fields, name) {
  if (typeof settings[name] === 'function') {
    return settings[name](fields);
  }

  return settings[name];
}


function generateSettings(settings, fields) {
  const calcSettings = {};
  AVAILABLE_SETTINGS.forEach((s) => {
    calcSettings[s] = evalSetting(settings, fields, s);
  });
  return calcSettings;
}

 /**
 * @alias ordinal
 * @memberof picasso.scales
 * @param { Array } fields
 * @param { Object } settings
 * @return { ordinalScale } Instance of ordinal scale
 */

export default function ordinal(settings, fields, dataset) {
  const d3Scale = scaleBand();

  /**
   * @alias ordinalScale
   * @param { Object } Object item with value
   * @return { Number } Value position in scale
   */
  const fn = d3Scale;

  fn.data = function data() {
    return dataset ? dataset.map({ self: { source: settings.source, type: 'qual' } }, { source: settings.source }) : [];
  };

  /**
   * Get the first value of the domain
   * @return { Number }
   */
  fn.start = function start() {
    return fn.domain()[0];
  };

  /**
   * Get the last value of the domain
   * @return { Number }
   */
  fn.end = function end() {
    return fn.domain()[fn.domain().length - 1];
  };

  /**
   * Generate discrete ticks
   * @return {Array} Array of ticks
   */
  fn.ticks = function ticks(input = {}) {
    input.scale = fn;
    return generateDiscreteTicks(input);
  };

  if (fields && fields[0]) {
    const values = fields[0].values();
    const stgns = generateSettings(settings, fields);
    const uniq = unique(values).map(v => v.label);

    fn.domain(uniq);
    fn.range(stgns.invert ? [1, 0] : [0, 1]);

    fn.padding(isNaN(stgns.padding) ? 0 : stgns.padding);
    if (!isNaN(stgns.paddingInner)) { fn.paddingInner(stgns.paddingInner); }
    if (!isNaN(stgns.paddingOuter)) { fn.paddingOuter(stgns.paddingOuter); }
    fn.align(isNaN(stgns.align) ? 0.5 : stgns.align);
  }
  return fn;
}
