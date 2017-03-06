import extend from 'extend';

import * as mixins from './chart-mixins';
import createDockLayout from '../dock-layout/dock-layout';
import {
  detectTouchSupport,
  isValidTapEvent
} from '../utils/event-type';

import buildData from '../data/index';
import buildFormatters, { getOrCreateFormatter } from './formatter';
import buildScales, { getOrCreateScale } from './scales';
import buildScroll, { getScrollApi } from './scroll-api';
import brush from '../brush';
import component from '../component';

/**
 * @typedef Chart.Props
 * @property {Chart.DataProps} data - Chart data
 * @property {Chart.SettingsProps} settings - Chart settings
 * @property {HTMLElement} element - Element to mount the chart into
 * @property {Function} mounted - Lifecycle function called when the chart instance has been mounted into an element.
 * @property {Function} updated - Lifecycle function called when the chart instance has been updated.
 * @property {Object} on - Event listeners
 */

/**
 * @typedef Chart.SettingsProps
 * @property {Chart.ScaleProps} scales
 * @property {component-settings[]} components
 * @property {dock-layout-settings} [dockLayout]
 */

/**
 * @typedef Chart.ScaleProps
 * @property {string} source - The data source used as input when creating the scale
 * @property {string} [type] - The type of scale to create
 * @property {boolean} invert - Whether to invert the scale's output
 */

/**
 * @typedef component-settings
 * @description Will also include component specific settings depending on type
 *              ex: [marker-point-settings](./markers.md#marker-point-settings),
 *                  [marker-box-settings](./markers.md#marker-box-settings),
 *                  [axis-settings](./axis.md#axis-settings),
 * @property {string} type - Component type (ex: axis, point-marker, ...)
 * @property {function} [preferredSize] Function returing preferred size
 * @property {function} [created]
 * @property {function} [beforeMount]
 * @property {function} [mounted]
 * @property {function} [beforeUpdate]
 * @property {function} [updated]
 * @property {function} [beforeRender]
 * @property {function} [beforeDestroy]
 * @property {function} [destroyed]
 * @property {brush-setting} [brush] see [brushing](./brushing.md)
 * @property {number} [displayOrder = 0]
 * @property {number} [prioOrder = 0]
 * @property {string | {width: string, height: string}} [minimumLayoutMode] Refer to layout sizes defined by layoutModes in dockLayout
 * @property {string} [dock] left, right, top or bottom
 * @property {string} [scale] Named scale. Will be provided to the component if it ask for it.
 * @property {string} [formatter] Named formatter. Fallback to create formatter from scale. Will be provided to the component if it ask for it.
 */

/**
 * @typedef dock-layout-settings
 * @property {object} [size] Phyiscal size. Default to size of the container
 * @property {number} [size.width]
 * @property {number} [size.height]
 * @property {object} [logicalSize] Logical size represent the size given to the dock layout to work with.
 * @property {number} [logicalSize.width]
 * @property {number} [logicalSize.height]
 * @property {boolean} [logicalSize.preserveAspectRatio = false]
 * @property {Object.<string, {width: number, height: number}>} [layoutModes={}] Dictionary with named sizes
 */

const isReservedProperty = prop => [
  'on', 'created', 'beforeMount', 'mounted', 'resize',
  'beforeUpdate', 'updated', 'beforeRender', 'render', 'beforeDestroy',
  'destroyed', 'data', 'settings'
].some(name => name === prop);

/**
 * Chart instance factory function
 */
function createInstance(definition) {
  let {
    element,
    data = {},
    settings = {},
    on = {}
  } = definition;

  const chartMixins = mixins.list();
  const listeners = [];
  const context = {
    ...definition,
    ...chartMixins.filter(mixinName => !isReservedProperty(mixinName))
  };
  let currentComponents = []; // Augmented components
  let visibleComponents = [];

  let currentScales = null; // Built scales
  let currentFormatters = null; // Built formatters
  let currentScrollApis = null; // Build scroll apis

  let dataset = [];
  let brushes = {};

  const chart = {
    dataset: function datasetFn() {
      return dataset;
    },
    scales: function scales() {
      return currentScales;
    },
    formatters: function formatters() {
      return currentFormatters;
    },
    createComponent: (compSettings, container) => {
      const factoryFn = component(compSettings.type);
      const compInstance = factoryFn(compSettings, chart, container);
      return {
        instance: compInstance,
        settings: extend(true, {}, compSettings),
        key: compSettings.key,
        hasKey: typeof compSettings.key !== 'undefined'
      };
    },
    brush: function brushFn(name = 'default') {
      if (!brushes[name]) {
        brushes[name] = brush();
      }
      return brushes[name];
    },
    scroll: function scrollFn(name = 'default') {
      return getScrollApi(name, currentScrollApis);
    },
    scale: function scale(v) {
      return getOrCreateScale(v, currentScales, dataset);
    },
    formatter: function formatter(v) {
      return getOrCreateFormatter(v, currentFormatters, chart.dataset());
    },
    stopBrushing: false
  };

  function instance() {} // The chart instance

  // Create a callback that calls lifecycle functions in the definition and config (if they exist).
  function createCallback(method, defaultMethod = () => {}) {
    return function cb(...args) {
      const inDefinition = typeof definition[method] === 'function';

      let returnValue;
      if (inDefinition) {
        returnValue = definition[method].call(context, ...args);
      } else {
        returnValue = defaultMethod.call(context, ...args);
      }
      chartMixins.forEach((mixin) => {
        if (mixin[method]) {
          mixin[method].call(context, ...args);
        }
      });
      return returnValue;
    };
  }

  const findComponent = (componentInstance) => {
    for (let i = 0; i < currentComponents.length; i++) {
      if (currentComponents[i].instance === componentInstance) {
        return currentComponents[i];
      }
    }
    return null;
  };

  const findComponentIndexByKey = (key) => {
    for (let i = 0; i < currentComponents.length; i++) {
      const currComp = currentComponents[i];
      if (currComp.hasKey && currComp.key === key) {
        return i;
      }
    }
    return -1;
  };

  const layout = (components) => {
    const dockLayout = createDockLayout(settings.dockLayout);
    components.forEach((c) => { dockLayout.addComponent(c.instance); });

    const { visible, hidden } = dockLayout.layout(element);
    return {
      visible: visible.map(v => findComponent(v)),
      hidden: hidden.map(h => findComponent(h))
    };
  };

  const moveToPosition = (comp, index) => {
    const el = comp.instance.renderer().element();
    if (isNaN(index) || !el || !element || !element.childNodes) { return; }
    const nodes = element.childNodes;
    const i = Math.min(nodes.length - 1, Math.max(index, 0));
    const node = nodes[i];
    if (element.insertBefore && typeof node !== 'undefined') {
      element.insertBefore(el, nodes[i]);
    }
  };

  const created = createCallback('created');
  const beforeMount = createCallback('beforeMount');
  const mounted = createCallback('mounted');
  const beforeUpdate = createCallback('beforeUpdate');
  const updated = createCallback('updated');
  const beforeRender = createCallback('beforeRender');
  const beforeDestroy = createCallback('beforeDestroy');
  const destroyed = createCallback('destroyed');

  const set = (_data, _settings, { partialData } = {}) => {
    const {
      formatters = {},
      scales = {},
      scroll = {}
    } = _settings;

    dataset = buildData(_data);
    if (!partialData) {
      Object.keys(brushes).forEach(b => brushes[b].clear());
    }
    currentScales = buildScales(scales, chart);
    currentFormatters = buildFormatters(formatters, chart);
    currentScrollApis = buildScroll(scroll, chart, currentScrollApis, partialData);
  };

  const render = () => {
    const {
      components = []
    } = settings;

    beforeRender();

    set(data, settings);

    currentComponents = components.map(compSettings => (
      chart.createComponent(compSettings, element)
    ));

    const { visible, hidden } = layout(currentComponents);
    visibleComponents = visible;

    hidden.forEach((comp) => {
      comp.instance.hide();
      comp.visible = false;
    });

    visible.forEach(comp => comp.instance.beforeMount());
    visible.forEach(comp => comp.instance.mount());
    visible.forEach(comp => comp.instance.beforeRender());

    visible.forEach(comp => comp.instance.render());
    visible.forEach(comp => comp.instance.mounted());
    visible.forEach((comp) => { comp.visible = true; });
  };

  // Browser only
  const mount = () => {
    element.innerHTML = '';

    render();

    Object.keys(on).forEach((key) => {
      const listener = on[key].bind(instance);
      element.addEventListener(key, listener);
      listeners.push({
        key,
        listener
      });
    });

    const eventInfo = {};
    const onTapDown = (e) => {
      if (e.touches) {
        eventInfo.x = e.touches[0].clientX;
        eventInfo.y = e.touches[0].clientY;
        eventInfo.multiTouch = e.touches.length > 1;
      } else {
        eventInfo.x = e.clientX;
        eventInfo.y = e.clientY;
        eventInfo.multiTouch = false;
      }
      eventInfo.time = Date.now();
    };

    const onBrushTap = (e) => {
      if (e.type === 'touchend') {
        e.preventDefault();
      }
      if (!isValidTapEvent(e, eventInfo)) {
        return;
      }

      for (let i = visibleComponents.length - 1; i >= 0; i--) {
        const comp = visibleComponents[i];

        comp.instance.onBrushTap(e);

        if (chart.stopBrushing) {
          chart.stopBrushing = false;
          break;
        }
      }
    };

    const onBrushOver = (e) => {
      for (let i = visibleComponents.length - 1; i >= 0; i--) {
        const comp = visibleComponents[i];

        comp.instance.onBrushOver(e);

        if (chart.stopBrushing) {
          chart.stopBrushing = false;
          break;
        }
      }
    };

    const brushEventList = [];

    brushEventList.push({ key: 'mousedown', listener: onTapDown });
    brushEventList.push({ key: 'mouseup', listener: onBrushTap });

    if (detectTouchSupport(element)) {
      brushEventList.push({ key: 'touchstart', listener: onTapDown });
      brushEventList.push({ key: 'touchend', listener: onBrushTap });
    }

    brushEventList.push({ key: 'mousemove', listener: onBrushOver });

    brushEventList.forEach((event) => {
      element.addEventListener(event.key, event.listener);
      listeners.push(event);
    });
  };

  const unmount = () => {
    listeners.forEach(({ key, listener }) => element.removeEventListener(key, listener));
  };

  /**
   * Update the chart with new settings and / or data
   * @param {} chart - Chart definition
   */
  instance.update = context.update = (newProps = {}) => {
    const { partialData } = newProps;
    if (newProps.data) {
      data = newProps.data;
    }
    if (newProps.settings) {
      settings = newProps.settings;
    }

    beforeUpdate();

    set(data, settings, { partialData });

    const {
      formatters,
      scales,
      components = []
    } = settings;

    for (let i = currentComponents.length - 1; i >= 0; i--) {
      const currComp = currentComponents[i];
      // TODO warn when there is no key
      if (!components.some(c => currComp.hasKey && currComp.key === c.key)) {
        // Component is removed
        currentComponents.splice(i, 1);
        currComp.instance.destroy();
      }
    }

    // Let the "components" array determine order of components
    currentComponents = components.map((comp) => {
      const idx = findComponentIndexByKey(comp.key);
      if (idx === -1) {
        // Component is added
        return chart.createComponent(comp, element);
      }
      // Component is (potentially) updated
      currentComponents[idx].updateWith = {
        formatters,
        scales,
        data,
        settings: comp
      };
      return currentComponents[idx];
    });

    currentComponents.forEach((comp) => {
      if (comp.updateWith) {
        comp.instance.set(comp.updateWith);
      }
    });
    currentComponents.forEach((comp) => {
      if (comp.updateWith) {
        comp.instance.beforeUpdate();
      }
    });

    let toUpdate = [];
    let toRender = [];
    if (partialData) {
      currentComponents.forEach((comp) => {
        if (comp.updateWith && comp.visible) {
          toUpdate.push(comp);
        } else {
          toRender.push(comp);
        }
      });
    } else {
      const { visible, hidden } = layout(currentComponents); // Relayout
      visibleComponents = visible;

      visible.forEach((comp) => {
        if (comp.updateWith && comp.visible) {
          toUpdate.push(comp);
        } else {
          toRender.push(comp);
        }
      });

      hidden.forEach((comp) => {
        comp.instance.hide();
        comp.visible = false;
        delete comp.updateWith;
      });
    }

    toRender.forEach(comp => comp.instance.beforeMount());
    toRender.forEach(comp => comp.instance.mount());

    toRender.forEach(comp => comp.instance.beforeRender());
    toUpdate.forEach(comp => comp.instance.beforeRender());

    toRender.forEach(comp => comp.instance.render());
    toUpdate.forEach(comp => comp.instance.update());

    // Ensure that displayOrder is keept
    visibleComponents.forEach((comp, i) => moveToPosition(comp, i));

    toRender.forEach(comp => comp.instance.mounted());
    toUpdate.forEach(comp => comp.instance.updated());

    visibleComponents.forEach((comp) => {
      delete comp.updateWith;
      comp.visible = true;
    });

    updated();
  };

  instance.destroy = context.destroy = () => {
    beforeDestroy();
    currentComponents.forEach(comp => comp.instance.destroy());
    currentComponents = [];
    unmount();
    delete instance.update;
    delete instance.destroy;
    destroyed();
  };

  /**
   * The brush context for this chart
   * @return {data-brush}
   */
  instance.brush = context.brush = (...v) => chart.brush(...v);

  /**
   * Get a field associated with the provided brush
   * @param {String} path path to the field to fetch
   * @return {data-field}
   */
  instance.field = path =>
     chart.dataset().findField(path)
  ;

  /**
   * The data set for this chart
   * @return {dataset}
   */
  instance.data = context.data = () => chart.dataset();

  /**
   * Get all shapes associated with the provided context
   * @param {String} context The brush context
   * @param {String} mode Property comparasion mode.
   * @param {Array} props Which specific data properties to compare
   * @param {String} key Which component to get shapes from. Default gives shapes from all components.
   * @return {Object[]} Array of objects containing shape and parent element
   */
  instance.getAffectedShapes = context.getAffectedShapes = (ctx, mode = 'and', props, key) => {
    const shapes = [];
    currentComponents.filter(comp => key === undefined || key === null || comp.key === key).forEach((comp) => {
      shapes.push(...comp.instance.getBrushedShapes(ctx, mode, props));
    });
    return shapes;
  };

  /**
   * Get all nodes matching the provided selector
   * @param {String} selector CSS selector [type, attribute or universal]
   * @return {Object[]} Array of objects containing matching nodes
   *
   * @example
   * chart.findShapes('Circle') // [<CircleNode>, <CircleNode>]
   * chart.findShapes('Circle[fill="red"][stroke!="black"]') // [CircleNode, CircleNode]
   * chart.findShapes('Container Rect') // [Rect, Rect]
   */
  instance.findShapes = context.findShapes = (selector) => {
    const shapes = [];
    visibleComponents.forEach((c) => {
      shapes.push(...c.instance.findShapes(selector));
    });
    return shapes;
  };

  /**
   * @return {scroll-api}
   */
  instance.scroll = context.scroll = (...v) => chart.scroll(...v);

  created();

  if (element) {
    beforeMount();
    mount(element);
    mounted(element);
    instance.element = element;
    context.element = element;
  }

  return instance;
}

/**
 * The chart creator
 * @memberof picasso
 * @alias chart
 * @param  {Chart.Props} settings - Settings
 * @return {Chart}
 */
function chartFactory(definition) {
  return createInstance(definition);
}

chartFactory.mixin = mixins.add; // Expose mixin registering function

export default chartFactory;
