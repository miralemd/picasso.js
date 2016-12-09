import composer from './composer';

/**
 * @typedef Chart.DataProps
 * @property {string} type - the type of data parser to use
 * @property {object} data - data property to send to data parser
 * @example
 * {
 *   type: "q",
 *   data: {...}
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
 * The chart creator
 * @memberof picasso
 * @alias chart
 * @param  {DOMElement} element - Element to draw the chart in
 * @param  {Chart.DataProps} data - Data
 * @param  {Chart.SettingsProps} settings - Settings
 * @return {Chart}
 * @example
 * picasso.chart( element,
 * {
 *   type: "q",
 *   data: layout.qHyperCube
 * },
 * {
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
 * } );
 */
export default function render(element, chart) {
  // TODO validation of chart props
  const {
    data,
    settings,
    mounted,
    on
  } = chart;

  element.innerHTML = '';

  const comp = composer();
  comp.build(element, data, settings);

  if (typeof mounted === 'function') {
    mounted.call(chart, element);
  }

  if (typeof on === 'object') {
    Object.keys(on).forEach((key) => {
      const listener = on[key].bind(chart);
      element.addEventListener(key, listener);
    });
  }
}
