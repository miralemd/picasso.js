import { scaleLinear } from 'd3-scale';
import notNumber from '../utils/undef';

const AVAILABLE_SETTINGS = ['min', 'max', 'expand', 'include', 'invert'];

function applyFormat(formatter) {
  return typeof formatter === 'undefined' ? t => t : t => formatter(t);
}

function evalSetting(fields, settings, name) {
  if (typeof settings[name] === 'function') {
    return settings[name](fields);
  }

  return settings[name];
}

function generateSettings(fields, settings) {
  const calcSettings = {};
  AVAILABLE_SETTINGS.forEach((s) => {
    calcSettings[s] = evalSetting(fields, settings, s);
  });
  return calcSettings;
}

function getMinMax(fields, settings) {
  const min = Number(settings.min);
  const max = Number(settings.max);
  let fieldMin = Math.min(...fields.map(m => m.min()));
  let fieldMax = Math.max(...fields.map(m => m.max()));

  if (isNaN(fieldMin) || isNaN(fieldMax)) {
    fieldMin = -1;
    fieldMax = 1;
  } else if (fieldMin === fieldMax && fieldMin === 0) {
    fieldMin = -1;
    fieldMax = 1;
  } else if (fieldMin === fieldMax && fieldMin) {
    fieldMin -= Math.abs(fieldMin * 0.1);
    fieldMax += Math.abs(fieldMax * 0.1);
  } else if (!isNaN(settings.expand)) {
    const range = fieldMax - fieldMin;
    fieldMin -= range * settings.expand;
    fieldMax += range * settings.expand;
  }

  if (Array.isArray(settings.include)) {
    const i = settings.include.filter(n => !isNaN(n));
    fieldMin = Math.min(...i, fieldMin);
    fieldMax = Math.max(...i, fieldMax);
  }

  return {
    mini: !isNaN(min) ? min : fieldMin,
    maxi: !isNaN(max) ? max : fieldMax
  };
}

 /**
 * @alias linear
 * @memberof picasso.scales
 * @param { Array } fields
 * @param { Object } settings
 * @return { linearScale } Instance of linear scale
 */

export default function linear(fields, settings) {
  const d3Scale = scaleLinear();
  let tG;
  let tickCache;

  /**
   * @alias linearScale
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
   * {@link https://github.com/d3/d3-scale#continuous_invert }
   * @param { Number } value The inverted value
   * @return { Number } The inverted scaled value
   */
  fn.invert = function invert(value) {
    return d3Scale.invert(value);
  };

  /**
   * {@link https://github.com/d3/d3-scale#continuous_rangeRound }
   * @param { Number[] } values Range values
   * @return { linearScale } The instance this method was called on
   */
  fn.rangeRound = function rangeRound(values) {
    d3Scale.rangeRound(values);
    return fn;
  };

  /**
   * {@link https://github.com/d3/d3-scale#continuous_clamp }
   * @param { Boolean } [ value=true ] TRUE if clamping should be enabled
   * @return { linearScale } The instance this method was called on
   */
  fn.clamp = function clamp(value = true) {
    d3Scale.clamp(value);
    return fn;
  };

  /**
   * Get cached ticks (if any)
   * @return { Number | Undefined }
   */
  fn.cachedTicks = function fnCachedTicks() {
    return tickCache;
  };

  /**
   * Clear the tick cache
   * @return {Number | Undefined}
   */
  fn.clearTicksCache = function fnClearTicks() {
    tickCache = undefined;
    return this;
  };

  /**
   * {@link https://github.com/d3/d3-scale#continuous_ticks }
   * @param { Object } input Number of ticks to generate or an object passed to tick generator
   * @return { Number[] | Object } Array of ticks or any type the custom tick generator returns
   */
  fn.ticks = function ticks(input) {
    if (typeof tG === 'function') {
      tickCache = tG.call(null, input);
      return tickCache;
    }
    tickCache = d3Scale.ticks(input);
    return tickCache;
  };

  /**
   * {@link https://github.com/d3/d3-scale#continuous_nice }
   * @param { Number } count
   * @return { linearScale } The instance this method was called on
   */
  fn.nice = function nice(count) {
    d3Scale.nice(count);

    return fn;
  };

  // TODO Support this?
  fn.tickFormat = function tickFormat(count, format) {
    return d3Scale.tickFormat(count, format);
  };

  // TODO Support this?
  fn.interpolate = function interpolate(func) {
    d3Scale.interpolate(func);
  };

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

  /**
   * {@link https://github.com/d3/d3-scale#_continuous }
   * @param { Number } value A value within the domain value span
   * @return { Number } Interpolated from the range
   */
  fn.get = function get(value) {
    return notNumber(value) ? NaN : d3Scale(value);
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
    return fn.domain()[this.domain().length - 1];
  };

  /**
   * Get the minimum value of the domain
   * @return { Number }
   */
  fn.min = function min() {
    return Math.min(this.start(), this.end());
  };

  /**
   * Get the maximum value of the domain
   * @return { Number }
   */
  fn.max = function max() {
    return Math.max(this.start(), this.end());
  };

  /**
   * Assign a tick generator. Will be used when calling ticks function
   * @param  { Function } generator Tick generator function
   * @return { function } The instance this method was called on
   */
  fn.tickGenerator = function tickGenerator(generator) {
    tG = generator;
    return fn;
  };

  /**
   * Divides the domain and range into uniform segments, based on start and end value
   * @param  { Number } segments The number of segments
   * @return { function } The instance this method was called on
   * @example
   * let s = linear();
   * s.domain([0, 10]);
   * s.range([0, 1]);
   * s.classify( 2 );
   * s.domain(); // [10, 5, 5, 0]
   * s.range(); // [0.75, 0.75, 0.25, 0.25]
   */
  fn.classify = function classify(segments) {
    let valueRange = (fn.start() - fn.end()) / segments,
      domain = [fn.end()],
      range = [],
      samplePos = valueRange / 2;

    for (let i = 0; i < segments; i++) {
      let lastVal = domain[domain.length - 1] || 0,
        calIntervalPos = lastVal + valueRange,
        calSamplePos = lastVal + samplePos,
        sampleColValue = fn.get(calSamplePos);

      domain.push(...[calIntervalPos, calIntervalPos]);
      range.push(...[sampleColValue, sampleColValue]);
    }
    domain.pop();
    fn.domain(domain);
    fn.range(range);

    return fn;
  };

  fn.copy = function copy() {
    const cop = linear(fields, settings);
    cop.domain(fn.domain());
    cop.range(fn.range());
    cop.clamp(d3Scale.clamp());
    return cop;
  };
  if (fields) {
    const stgns = generateSettings(fields, settings);
    const { mini, maxi } = getMinMax(fields, stgns);

    fn.domain([mini, maxi]);
    fn.range(stgns.invert ? [1, 0] : [0, 1]);
  }
  return fn;
}

function minorTicksGenerator(count, start, end) {
  const r = Math.abs(start - end);
  const interval = r / (count + 1);
  const ticks = [];
  for (let i = 1; i <= count; i++) {
    const v = i * interval;
    ticks.push(start < end ? start + v : start - v);
  }
  return ticks;
}

function appendMinorTicks(majorTicks, minorCount, scale) {
  if (majorTicks.length === 1) return majorTicks;

  const ticks = majorTicks.concat([]);

  for (let i = 0; i < majorTicks.length; i++) {
    let start = majorTicks[i];
    let end = majorTicks[i + 1];

    if (i === 0 && start !== scale.start()) { // Before and after first major tick
      ticks.push(...minorTicksGenerator(minorCount, start, end));
      start -= end - start;
      end = majorTicks[i];
      ticks.push(...minorTicksGenerator(minorCount, start, end));
    } else if (i === majorTicks.length - 1 && end !== scale.end()) { // After last major tick
      end = start + (start - majorTicks[i - 1]);
      ticks.push(...minorTicksGenerator(minorCount, start, end));
    } else {
      ticks.push(...minorTicksGenerator(minorCount, start, end));
    }
  }

  return ticks.filter(t => t >= scale.min() && t <= scale.max()).sort();
}

/**
* Generate ticks based on a distance, for each 100th unit, one additional tick may be added
* @private
* @param  {Number} distance       Distance between each tick
* @param  {Number} scale         The scale instance
* @param  {Number} [minorCount=0]     Number of tick added between each distance
* @param  {Number} [unitDivider=100]   Number to divide distance with
* @return {Array}               Array of ticks
*/
export function looseDistanceBasedGenerator({ distance, scale, minorCount = 0, unitDivider = 100, formatter = undefined }) {
  const isNumber = v => typeof v === 'number' && !isNaN(v);
  const count = isNumber(unitDivider) ? Math.max(Math.round(distance / unitDivider), 2) : 2;
  let majorTicks = scale.ticks(count);
  if (majorTicks.length <= 1) {
    majorTicks = scale.ticks(count + 1);
  }

  const ticks = minorCount > 0 ? appendMinorTicks(majorTicks, minorCount, scale) : majorTicks;

  const ticksFormatted = ticks.map(applyFormat(formatter));

  return ticks.map((tick, i) => ({
    position: scale.get(tick),
    label: ticksFormatted[i],
    value: tick,
    isMinor: majorTicks.indexOf(tick) === -1,
    scale
  }));
}

/**
* Generate ticks based on a distance, for each 100th unit, one additional tick may be added.
* Will attempt to round the bounds of domain to even values and generate ticks hitting the domain bounds.
* @private
* @param  {Number} distance       Distance between each tick
* @param  {Number} scale         The scale instance
* @param  {Number} [minorCount=0]     Number of tick added between each distance
* @param  {Number} [unitDivider=100]   Number to divide distance with
* @return {Array}               Array of ticks
*/
export function tightDistanceBasedGenerator({ distance, scale, minorCount = 0, unitDivider = 100, formatter = undefined }) {
  const isNumber = v => typeof v === 'number' && !isNaN(v);
  const count = isNumber(unitDivider) ? Math.max(Math.round(distance / unitDivider), 2) : 2;
  const n = count > 10 ? 10 : count;
  scale.nice(n);

  const majorTicks = scale.ticks(count);
  const ticks = minorCount > 0 ? appendMinorTicks(majorTicks, minorCount, scale) : majorTicks;

  const ticksFormatted = ticks.map(applyFormat(formatter));

  return ticks.map((tick, i) => ({
    position: scale.get(tick),
    label: ticksFormatted[i],
    value: tick,
    isMinor: majorTicks.indexOf(tick) === -1,
    scale
  }));
}
