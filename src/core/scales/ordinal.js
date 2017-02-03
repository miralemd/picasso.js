import { scaleBand } from 'd3-scale';

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

function evalSetting(fields, settings, name) {
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
  const fn = v => d3Scale('label' in v ? v.label : v.value);

  fn.data = function data() {
    return dataset ? dataset.map({ self: { source: settings.source, type: 'qual' } }, { source: settings.source }) : [];
  };

 /**
 * @param { Object[] } [values] Set or Get domain values
 * @return { ordinalScale | Object[] } The instance this method was called on if a parameter is provided, otherwise the current domain is returned
 */
  fn.domain = function domain(v) {
    if (arguments.length) {
      d3Scale.domain(v);
      return fn;
    }
    return d3Scale.domain();
  };
  /**
   * @param { Number[] } [values] Set or Get range values
   * @return { ordinalScale | Number[] } The instance this method was called on if a parameter is provided, otherwise the current range is returned
   */
  fn.range = function range(v) {
    if (arguments.length) {
      d3Scale.range(v);
      return fn;
    }
    return d3Scale.range();
  };
  /**
   * {@link https://github.com/d3/d3-scale#band_paddingOuter }
   * @param { Number } value A value within 0-1
   * @return { ordinalScale } The instance this method was called on
   */
  fn.paddingOuter = function paddingOuter(p = 0) {
    d3Scale.paddingOuter(p);
    return fn;
  };
  /**
   * {@link https://github.com/d3/d3-scale#band_paddingInner }
   * @param { Number } value A value within 0-1
   * @return { ordinalScale } The instance this method was called on
   */
  fn.paddingInner = function paddingInner(p = 0) {
    d3Scale.paddingInner(p);
    return fn;
  };
  /**
   * {@link https://github.com/d3/d3-scale#band_padding }
   * @param { Number } value A value within 0-1
   * @return { ordinalScale } The instance this method was called on
   */
  fn.padding = function padding(p = 0) {
    d3Scale.padding(p);
    return fn;
  };
  /**
   * {@link https://github.com/d3/d3-scale#band_padding }
   * @param { Number } value A value within 0-1
   * @return { ordinalScale } The instance this method was called on
   */
  fn.align = function align(a) {
    d3Scale.align(a);
    return fn;
  };
  /**
   * {@link https://github.com/d3/d3-scale#band_align }
   * @return { Number } Bandwith of each band
   */
  fn.bandWidth = function bandWidth() {
    return d3Scale.bandwidth();
  };
  /**
   * {@link https://github.com/d3/d3-scale#band_step }
   * @return { Number } Step distance
   */
  fn.step = function step() {
    return d3Scale.step();
  };
  /**
   * {@link https://github.com/d3/d3-scale#_ordinal }
   * @param { Number } value
   * @return { Number }
   */
  fn.get = function get(value) {
    return d3Scale(value);
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

  if (fields && fields[0]) {
    const values = fields[0].values();
    const stgns = generateSettings(settings, fields);
    const uniq = unique(values).map(v => v.label);

    fn.domain(uniq);
    fn.range(stgns.invert ? [1, 0] : [0, 1]);

    fn.padding(isNaN(stgns.padding) ? 1 : stgns.padding);
    if (!isNaN(stgns.paddingInner)) { fn.paddingInner(stgns.paddingInner); }
    if (!isNaN(stgns.paddingOuter)) { fn.paddingOuter(stgns.paddingOuter); }
    fn.align(isNaN(stgns.align) ? 0.5 : stgns.align);
  }
  return fn;
}
