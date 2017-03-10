import { scaleLinear } from 'd3-scale';
import extend from 'extend';

import { notNumber } from '../utils/math';
import { generateContinuousTicks } from './ticks/tick-generators';
import { continuousDefaultSettings } from './ticks/default-settings';

const AVAILABLE_SETTINGS = ['min', 'max', 'expand', 'include', 'invert'];

/**
 * @typedef ticks-settings
 * @property {object} [ticks]
 * @property {boolean} [ticks.tight = false]
 * @property {boolean} [ticks.forceBounds = false]
 * @property {number} [ticks.distance = 100] Approximate distance between each tick.
 * @property {object} [minorTicks]
 * @property {number} [minorTicks.count = 3]
 */

/*
function applyFormat(formatter) {
  return typeof formatter === 'undefined' ? t => t : t => formatter(t);
}
*/

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

function getMinMax(settings, fields) {
  const min = +settings.min;
  const max = +settings.max;
  let fieldMin = 0;
  let fieldMax = 1;
  if (fields && fields[0]) {
    const minValues = fields.map(m => m.min()).filter(v => !isNaN(v));
    const maxValues = fields.map(m => m.max()).filter(v => !isNaN(v));
    fieldMin = minValues.length ? Math.min(...minValues) : Number.NaN;
    fieldMax = maxValues.length ? Math.max(...maxValues) : Number.NaN;

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
  }

  return {
    mini: !isNaN(min) ? min : fieldMin,
    maxi: !isNaN(max) ? max : fieldMax
  };
}

 /**
 * @alias linear
 * @memberof picasso.scales
 * @param { field[] } fields
 * @param { object } settings
 * @return { linearScale } Instance of linear scale
 */

export default function linear(settings, fields/* , dataset*/) {
  const d3Scale = scaleLinear();
  let tickCache;

  /**
   * @alias linearScale
   * @param { Object } Item item object with value property
   * @return { Number } The scaled value
   */
  function fn(v) {
    if (notNumber(v)) {
      return NaN;
    }
    return d3Scale(v);
  }

  fn.data = function data() {
    return [];
  };

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
    if (input !== null && typeof input === 'object') {
      input.settings = input.settings || {};
      input.settings = extend(true, continuousDefaultSettings(), settings, input.settings);
      input.scale = fn;
      tickCache = generateContinuousTicks(input);
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
    return fn;
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
  // fn.get = function get(value) {
  //   return notNumber(value) ? NaN : d3Scale(value);
  // };

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
        sampleColValue = fn(calSamplePos);

      domain.push(...[calIntervalPos, calIntervalPos]);
      range.push(...[sampleColValue, sampleColValue]);
    }
    domain.pop();
    fn.domain(domain);
    fn.range(range);

    return fn;
  };

  fn.copy = function copy() {
    const cop = linear(settings, fields);
    cop.domain(fn.domain());
    cop.range(fn.range());
    cop.clamp(d3Scale.clamp());
    return cop;
  };
  if (settings) {
    const stgns = generateSettings(settings, fields);
    const { mini, maxi } = getMinMax(stgns, fields);

    fn.domain([mini, maxi]);
    fn.range(stgns.invert ? [1, 0] : [0, 1]);
  }
  return fn;
}
