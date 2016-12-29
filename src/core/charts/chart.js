import composerFn from './composer';

/**
 * @typedef Chart.Props
 * @property {Chart.DataProps} data - Chart data
 * @property {Chart.SettingsProps} settings - Chart settings
 * @property {HTMLElement} element - Element to mount the chart into
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
 * Chart instance factory function
 */
function createInstance(definition) {
  const {
    element,
    data = {},
    settings = {},
    on = {},
    updated = () => {},
    mounted = () => {}
  } = definition;

  const listeners = [];
  let composer;
  let currentData = data;
  let currentSettings = settings;

  function instance() {}

  // Browser only
  const mount = () => {
    element.innerHTML = '';

    composer = composerFn(element);
    composer.render(data, settings);

    Object.keys(on).forEach((key) => {
      const listener = on[key].bind(instance);
      element.addEventListener(key, listener);
      listeners.push({
        key,
        listener
      });
    });

    if (typeof mounted === 'function') {
      mounted.call(instance, element);
    }
  };

  const unmount = () => {
    listeners.forEach(({ key, listener }) => element.removeEventListener(key, listener));
  };

  /**
   * Update the chart with new settings and / or data
   * @param {} chart - Chart definition
   */
  instance.update = (newProps) => {
    if (newProps.data) {
      currentData = newProps.data;
    }
    if (newProps.settings) {
      currentSettings = newProps.settings;
    }

    composer.update(currentData, currentSettings);

    if (typeof updated === 'function') {
      updated.call(instance);
    }
  };

  instance.destroy = () => {
    composer.destroy();
    unmount();
    delete instance.update;
    delete instance.destroy;
  };

  if (element) {
    mount(element);
    instance.element = element;
  }

  return instance;
}

/**
 * The chart creator
 * @memberof picasso
 * @alias chart
 * @param  {Chart.Props} settings - Settings
 * @return {Chart}
 * @example
 * picasso.chart({
 *   element: document.getElementById('chart-container'),
 *   data: { ... },
 *   settings: {
 *     scales: {
 *         x: {
 *           source: "/qHyperCube/qMeasureInfo/0"
 *         },
 *         y: {
 *           source: "/qHyperCube/qDimensionInfo/0"
 *         }
 *       },
 *       components: {
 *         markers: [
 *           {
 *             type: "point",
 *             settings: {
 *               fill: 'red'
 *             }
 *           }
 *         ]
 *       }
 *     }
 *   }
 * );
 */
export default function chart(definition) {
  return createInstance(definition);
}
