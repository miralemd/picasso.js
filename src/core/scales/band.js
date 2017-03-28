import { scaleBand as d3ScaleBand } from 'd3-scale';
import { generateDiscreteTicks } from './ticks/tick-generators';

const AVAILABLE_SETTINGS = [
  'padding',
  'paddingOuter',
  'paddingInner',
  'align',
  'invert',
  'maxPxStep'
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
 * @alias scaleBand
 * @memberof picasso
 * @private
 * @param { Object } settings
 * @param { fields[] } [fields]
 * @param { dataset } [dataset]
 * @return { band }
 */

export default function scaleBand(settings, fields, dataset) {
  /**
   * An augmented {@link https://github.com/d3/d3-scale#_band|d3 band scale}
   * @alias band
   * @kind function
   * @param { Object } value
   * @return { number }
   */
  const band = d3ScaleBand();

  // I would like to define this outside of scaleBand but it cause the documentation to be in the wrong order
  function augmentScaleBand(band, settings, dataset) { // eslint-disable-line no-shadow
    band.data = function data() {
      return dataset ? dataset.map({ self: { source: settings.source, type: 'qual' } }, { source: settings.source }) : [];
    };

    /**
     * Get the first value of the domain
     * @return { number }
     */
    band.start = function start() {
      return band.domain()[0];
    };

    /**
     * Get the last value of the domain
     * @return { number }
     */
    band.end = function end() {
      return band.domain()[band.domain().length - 1];
    };

    /**
     * Generate discrete ticks
     * @return {Object[]} Array of ticks
     */
    band.ticks = function ticks(input = {}) {
      input.scale = band;
      return generateDiscreteTicks(input);
    };
  }
  augmentScaleBand(band, settings, dataset);

  const stgns = generateSettings(settings || {}, fields);

  /**
   * if required creates a new scale with a restricted range
   * so that step size is at most maxPxStep
   * otherwise it returns itself
   * @param { number } size
   * @return { band }
   */
  band.pxScale = function pxScale(size) {
    const max = stgns.maxPxStep;
    if (isNaN(max)) {
      return band;
    }
    const n = band.domain().length;
    const sizeRelativeToStep = Math.max(1, (n - band.paddingInner()) + (2 * band.paddingOuter()));

    if (sizeRelativeToStep * max >= size) {
      return band;
    }

    const newBand = band.copy();
    augmentScaleBand(newBand, settings, dataset);
    const t = (sizeRelativeToStep * max) / size;
    const offset = (1 - t) * band.align();
    newBand.range(stgns.invert ? [t + offset, offset] : [offset, t + offset]);

    return newBand;
  };


  if (fields && fields[0]) {
    const values = fields[0].values();
    const uniq = unique(values).map(v => v.label);

    band.domain(uniq);
    band.range(stgns.invert ? [1, 0] : [0, 1]);

    band.padding(isNaN(stgns.padding) ? 0 : stgns.padding);
    if (!isNaN(stgns.paddingInner)) { band.paddingInner(stgns.paddingInner); }
    if (!isNaN(stgns.paddingOuter)) { band.paddingOuter(stgns.paddingOuter); }
    band.align(isNaN(stgns.align) ? 0.5 : stgns.align);
  }
  return band;
}
