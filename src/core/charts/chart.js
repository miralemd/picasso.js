import render from './render';

/**
 * @typedef Chart.Props
 * @property {Chart.DataProps} data - Chart data
 * @property {Chart.SettingsProps} settings - Chart settings
 * @property {Function} mounted - Lifecycle function called when the chart instance has been mounted into an element.
 * @property {Function} updated - Lifecycle function called when the chart instance has been updated.
 * @property {Object} on - Event listeners
 * @example
 * {
 *   data: {
 *     ...
 *   },
 *   settings: {
 *     ...
 *   },
 *   mounted: function(element) {
 *
 *   },
 *   on: {
 *     click: function(e) {
 *
 *     }
 *   }
 * }
 */

/**
 * @typedef Chart.SettingsProps
 * @property {Chart.ScaleProps} scales
 * @property {object} components
 * @property {marker[]} components.markers,
 * @property {axis[]} components.axes
 * @example
 * {
 *   scales: {
 *     x: {...}
 *   },
 *   components: {
 *     axes: [...]
 *     markers: [...]
 *   }
 * }
 */

/**
 * @typedef Chart.ScaleProps
 * @property {string} source - The data source used as input when creating the scale
 * @property {string} [type] - The type of scale to create
 * @property {boolean} invert - Whether to invert the scale's output
 * @example
 * {
 *   source: "whatever is accepted by the data parser",
 *   type: "color",
 *   invert: true
 * }
 */

/**
 * Chart class holding the definition of a chart
 */
export default class Chart {
  /**
   * @constructor
   * @param {HTMLElement} element
   * @param {Chart.Props} props - Chart properties
   * @returns {Chart}
   */
  constructor(props = {}) {
    Object.keys(props).forEach((key) => {
      this[key] = props[key];
    });
    if (!this.data) {
      this.data = {};
    }
    if (!this.settings) {
      this.settings = {};
    }
  }
}

/**
 * The chart creator
 * @memberof picasso
 * @alias chart
 * @param  {Chart.SettingsProps} settings - Settings
 * @return {Chart}
 * @example
 * picasso.chart({
 *   scales: {
 *     x: {
 *       source: "/qHyperCube/qMeasureInfo/0"
 *     },
 *     y: {
 *       source: "/qHyperCube/qDimensionInfo/0"
 *     }
 *   },
 *   components: {
 *     markers: [
 *       {
 *         type: "point",
 *         settings: {
 *           fill: 'red'
 *         }
 *       }
 *     ]
 *   }
 * });
 */
function chartFn(definition, data, settings) {
  if (definition.toString().match(/[HTML[\w\W]*?Element/)) {
    // Backward compatibility
    const element = definition;
    const chart = new Chart({
      data,
      settings
    });
    render(element, chart);
    return null;
  } else {
    return new Chart(definition || {});
  }
}

export const chart = chartFn;
