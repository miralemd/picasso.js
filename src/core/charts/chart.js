import extend from 'extend';

import * as mixins from './chart-mixins';
import createDockLayout from '../dock-layout/dock-layout';
import {
  detectTouchSupport,
  isValidTapEvent
} from '../utils/event-type';
import { getShapeType } from '../utils/shapes';
import dataRegistry from '../data/index';
import buildFormatters, { getOrCreateFormatter } from './formatter';
import buildScales, { getOrCreateScale } from './scales';
import buildScroll, { getOrCreateScrollApi } from './scroll-api';
import brush from '../brush';
import component from '../component';
import componentFactory from '../component/component-factory';
import interaction from '../interaction';
import mediatorFactory from '../mediator';
import NarrowPhaseCollision from '../math/narrow-phase-collision';
import loggerFn from '../utils/logger';
import styleResolver from '../style/resolver';

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
 * @property {boolean} [show = true] If the component should be rendered
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

function addComponentDelta(shape, containerBounds, componentBounds) {
  const dx = containerBounds.left - componentBounds.left;
  const dy = containerBounds.top - componentBounds.top;
  const type = getShapeType(shape);
  const deltaShape = extend(true, {}, shape);

  switch (type) {
    case 'circle':
      deltaShape.cx += dx;
      deltaShape.cy += dy;
      break;
    case 'polygon':
      for (let i = 0, num = deltaShape.vertices.length; i < num; i++) {
        const v = deltaShape.vertices[i];
        v.x += dx;
        v.y += dy;
      }
      break;
    case 'line':
      deltaShape.x1 += dx;
      deltaShape.y1 += dy;
      deltaShape.x2 += dx;
      deltaShape.y2 += dy;
      break;
    case 'point':
    case 'rect':
      deltaShape.x += dx;
      deltaShape.y += dy;
      break;
    default:
      break;
  }

  return deltaShape;
}

/**
 * The chart creator
 * @memberof picasso
 * @alias chart
 * @param  {Chart.Props} settings - Settings
 * @return {Chart}
 */
function chart(definition) {
  let {
    element,
    data = {},
    settings = {},
    on = {}
  } = definition;

  const chartMixins = mixins.list();
  const listeners = [];
  const instance = {
    ...definition,
    ...chartMixins.filter(mixinName => !isReservedProperty(mixinName))
  };
  const mediator = mediatorFactory();
  let currentComponents = []; // Augmented components
  let visibleComponents = [];

  let currentScales = null; // Built scales
  let currentFormatters = null; // Built formatters
  let currentScrollApis = null; // Build scroll apis
  let currentInteractions = [];

  let dataset = [];
  const brushes = {};
  let stopBrushing = false;
  let chartStyle;

  const styler = {
    resolve: s => styleResolver(s, chartStyle)
  };

  const createComponent = (compSettings, container) => {
    const componentDefinition = component(compSettings.type);
    const compInstance = componentFactory(componentDefinition, {
      settings: compSettings,
      chart: instance,
      mediator,
      styler,
      container
    });
    return {
      instance: compInstance,
      settings: extend(true, {}, compSettings),
      key: compSettings.key,
      hasKey: typeof compSettings.key !== 'undefined'
    };
  };

  // Create a callback that calls lifecycle functions in the definition and config (if they exist).
  function createCallback(method, defaultMethod = () => {}) {
    return function cb(...args) {
      const inDefinition = typeof definition[method] === 'function';

      let returnValue;
      if (inDefinition) {
        returnValue = definition[method].call(instance, ...args);
      } else {
        returnValue = defaultMethod.call(instance, ...args);
      }
      chartMixins.forEach((mixin) => {
        if (mixin[method]) {
          mixin[method].call(instance, ...args);
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
    components.forEach((c) => { dockLayout.addComponent(c.instance, c.key); });

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

  const logger = loggerFn();

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

    dataset = dataRegistry(_data.type)(_data.data);
    if (!partialData) {
      Object.keys(brushes).forEach(b => brushes[b].clear());
    }
    if (settings.logger) {
      logger.level(settings.logger.level);
    }
    chartStyle = settings.style || {};
    currentScales = buildScales(scales, dataset);
    currentFormatters = buildFormatters(formatters, dataset);
    currentScrollApis = buildScroll(scroll, currentScrollApis);
  };

  const render = () => {
    const {
      components = []
    } = settings;

    beforeRender();

    set(data, settings);

    currentComponents = components.map(compSettings => (
      createComponent(compSettings, element)
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

  function setInteractions(interactions = []) {
    const current = {};
    const newKeys = interactions.filter(it => !!it.key).map(it => it.key);
    currentInteractions.forEach((cit) => {
      if (cit.key && newKeys.indexOf(cit.key) !== -1) { // keep old instance
        current[cit.key] = cit;
      } else {
        cit.destroy();
      }
    });
    currentInteractions = interactions.map((intSettings) => {
      const intDefinition = intSettings.key && current[intSettings.key] ? current[intSettings.key] : interaction(intSettings.type)(instance, mediator, element);
      intDefinition.set(intSettings);
      return intDefinition;
    });
  }

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

        if (stopBrushing) {
          stopBrushing = false;
          break;
        }
      }
    };

    const onBrushOver = (e) => {
      for (let i = visibleComponents.length - 1; i >= 0; i--) {
        const comp = visibleComponents[i];

        comp.instance.onBrushOver(e);

        if (stopBrushing) {
          stopBrushing = false;
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
    setInteractions(settings.interactions);
  };

  const unmount = () => {
    listeners.forEach(({ key, listener }) => element.removeEventListener(key, listener));
    setInteractions();
  };

  /**
   * Update the chart with new settings and / or data
   * @param {Object} [chart] - Chart definition
   */
  instance.update = (newProps = {}) => {
    const { partialData } = newProps;
    if (newProps.data) {
      data = newProps.data;
    }
    if (newProps.settings) {
      settings = newProps.settings;
      setInteractions(newProps.settings.interactions);
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
        return createComponent(comp, element);
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

    const toUpdate = [];
    const toRender = [];
    if (partialData) {
      currentComponents.forEach((comp) => {
        if (comp.updateWith && comp.visible) {
          toUpdate.push(comp);
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

  /**
   * Destroy the chart instance.
   */
  instance.destroy = () => {
    beforeDestroy();
    currentComponents.forEach(comp => comp.instance.destroy());
    currentComponents = [];
    unmount();
    delete instance.update;
    delete instance.destroy;
    destroyed();
  };

  /**
   * Get a field associated with the provided brush
   * @param {string} path path to the field to fetch
   * @return {data-field}
   */
  instance.field = path => instance.dataset().findField(path);

  /**
   * The data set for this chart
   * @return {dataset}
   */
  instance.data = () => instance.dataset();

  /**
   * Get all shapes associated with the provided context
   * @param {String} context The brush context
   * @param {String} mode Property comparasion mode.
   * @param {Array} props Which specific data properties to compare
   * @param {String} key Which component to get shapes from. Default gives shapes from all components.
   * @return {Object[]} Array of objects containing shape and parent element
   */
  instance.getAffectedShapes = (ctx, mode = 'and', props, key) => {
    const shapes = [];
    currentComponents.filter(comp => key === undefined || key === null || comp.key === key).forEach((comp) => {
      shapes.push(...comp.instance.getBrushedShapes(ctx, mode, props));
    });
    return shapes;
  };

  /**
   * Get all nodes matching the provided selector
   * @param {string} selector CSS selector [type, attribute or universal]
   * @returns {Object[]} Array of objects containing matching nodes
   *
   * @example
   * chart.findShapes('Circle') // [<CircleNode>, <CircleNode>]
   * chart.findShapes('Circle[fill="red"][stroke!="black"]') // [CircleNode, CircleNode]
   * chart.findShapes('Container Rect') // [Rect, Rect]
   */
  instance.findShapes = (selector) => {
    const shapes = [];
    visibleComponents.forEach((c) => {
      shapes.push(...c.instance.findShapes(selector));
    });
    return shapes;
  };

  /**
   * Get components overlapping a point.
   * @param {Object} p - Point with x- and y-cooridnate. The coordinate is relative to the browser viewport.
   * @returns {Object[]} Array of component contexts
   */
  instance.componentsFromPoint = (p) => {
    const br = element.getBoundingClientRect();
    const tp = { x: p.x - br.left, y: p.y - br.top };
    const ret = [];
    visibleComponents.forEach((c) => {
      const r = c.instance.getRect();
      if (NarrowPhaseCollision.testRectPoint(r, tp)) {
        ret.push(c.instance.ctx);
      }
    });
    return ret;
  };

  /**
   * Get all nodes colliding with a geometrical shape (circle, line, rectangle, point, polygon).
   *
   * The input shape is identified based on the geometrical attributes in the following order: circle => line => rectangle => point => polygon.
   * Note that not all nodes on a scene have collision detection enabled.
   * @param {Object} shape - A geometrical shape. Coordinates are relative to the top-left corner of the chart instance container.
   * @param {Object} opts - Options
   * @param {Object[]} [opts.components] - Array of components to include in the lookup. If no components are specified, all components will be included.
   * @param {string} [opts.components.component.key] - Component key
   * @param {string} [opts.components.component.propagation] - if set to `stop`, will start lookup on top visible shape and propagate downwards until a shape is found.
   * @param {string} [opts.propagation] - if set to `stop`, will start lookup on top visible component and propagate downwards until a component has at least a match.
   * @returns {Object[]} Array of objects containing colliding nodes
   *
   * @example
   * chart.shapesAt(
   *  {
   *    x: 0,
   *    y: 0,
   *    width: 100,
   *    height: 100
   *  },
   *  {
   *    components: [
   *      { key: 'key1', propagation: 'stop' },
   *      { key: 'key2' }
   *    ],
   *    propagation: 'stop'
   *  }
   * );
   */
  instance.shapesAt = (shape, opts = {}) => {
    const result = [];
    const containerBounds = element.getBoundingClientRect();
    let comps = visibleComponents; // Assume that visibleComponents is ordererd according to displayOrder

    if (Array.isArray(opts.components) && opts.components.length > 0) {
      const compKeys = opts.components.map(c => c.key);
      comps = visibleComponents
        .filter(c => compKeys.indexOf(c.key) !== -1)
        .map(c => ({
          instance: c.instance,
          opts: opts.components[compKeys.indexOf(c.key)]
        }));
    }

    for (let i = comps.length - 1; i >= 0; i--) {
      const c = comps[i];
      const componentBounds = c.instance.renderer().element().getBoundingClientRect();
      const deltaShape = addComponentDelta(shape, containerBounds, componentBounds);
      const shapes = c.instance.shapesAt(deltaShape, c.opts);
      const stopPropagation = shapes.length > 0 && opts.propagation === 'stop';

      result.push(...shapes);

      if (result.length > 0 && stopPropagation) {
        return result;
      }
    }
    return result;
  };


  /**
   * Brush data by providing a collection of data bound shapes.
   * @param {Array[]} shapes - An array of data bound shapes.
   * @param {Object} config - Options
   * @param {Object[]} opts.components - Array of components to include in the lookup.
   * @param {string} [opts.components.component.key] - Component key
   * @param {string[]} [opts.components.component.contexts] - Name of the brushing contexts to affect
   * @param {string[]} [opts.components.component.data] - The mapped data properties to add to the brush
   * @param {string} [opts.components.component.action] - Type of action to respond with
   *
   * @example
   * const shapes = chartInstance.shapesAt(...);
   * const config = {
   *  components:[
   *    {
   *      key: 'key1',
   *      contexts: ['myContext'],
   *      data: ['self'],
   *      action: 'add'
   *    }
   *  ]
   * };
   * chartInstance.brushFromShapes(shapes, config);
   */
  instance.brushFromShapes = (shapes, config = { components: [] }) => {
    const configKeys = config.components.map(conf => conf.key);
    visibleComponents.forEach((c) => {
      const configIndex = configKeys.indexOf(c.key);
      if (configIndex !== -1) {
        const compShapes = [];
        for (let i = 0, num = shapes.length; i < num; i++) {
          const shape = shapes[i];
          if (shape.key === c.key) {
            compShapes.push(shape);
          }
        }
        c.instance.brushFromShapes(compShapes, config.components[configIndex]);
      }
    });
  };

  /**
   * @param {string} name - Name of scroll api
   * @returns {scroll-api}
   */
  instance.scroll = function scroll(name = 'default') {
    return getOrCreateScrollApi(name, currentScrollApis);
  };

  /**
   * The data set for this chart
   * @returns {Object}
   */
  instance.dataset = function datasetFn() {
    return dataset;
  };

  /**
   * Get the all registered scales
   * @returns {Object[]} Array of scales
   */
  instance.scales = function scales() {
    return currentScales;
  };

  /**
   * Get the all registered formatters
   * @returns {Object[]} Array of formatters
   */
  instance.formatters = function formatters() {
    return currentFormatters;
  };

  /**
   * Get or create brush context for this chart
   * @param {string} name - Name of the brush context. If no match is found, a new brush context is created and returned.
   * @returns {data-brush}
   */
  instance.brush = function brushFn(name = 'default') {
    if (!brushes[name]) {
      brushes[name] = brush();
    }
    return brushes[name];
  };

  /**
   * Get or create a scale for this chart
   * @param {string|Object} v - Scale reference or scale options
   * @returns {Object} A scale
   * @example
   * instance.scale('nameOfMyScale'); // Fetch an existing scale by name
   * instance.scale({ scale: 'nameOfMyScale' }); // Fetch an existing scale by name
   * instance.scale({ source: '0/1', type: 'linear' }); // Create a new scale
   */
  instance.scale = function scale(v) {
    return getOrCreateScale(v, currentScales, dataset);
  };

  /**
   * Get or create a formatter for this chart
   * @param {string|Object} v - Formatter reference or formatter options
   * @returns {Object} A formatter
   * @example
   * instance.formatter('nameOfMyFormatter'); // Fetch an existing formatter by name
   * instance.formatter({ formatter: 'nameOfMyFormatter' }); // Fetch an existing formatter by name
   * instance.formatter({ type: 'q' }); // Fetch an existing formatter by type
   * instance.formatter({
   *  formatter: 'd3',
   *  type: 'number',
   *  format: '1.0.%'
   * }); // Create a new formatter
   */
  instance.formatter = function formatter(v) {
    return getOrCreateFormatter(v, currentFormatters, dataset);
  };

  /**
   * @param {boolean} [val] - Toggle brushing on or off. If value is ommited, a toggle action is applied to the current state.
   */
  instance.toggleBrushing = function toggleBrushing(val) {
    if (typeof val !== 'undefined') {
      stopBrushing = val;
    } else {
      stopBrushing = !stopBrushing;
    }
  };

  /**
   * Get a component context
   * @param {string} key - Component key
   * @returns {Object} Component context
   */
  instance.component = (key) => {
    const idx = findComponentIndexByKey(key);
    if (idx !== -1) {
      return currentComponents[idx].instance.ctx;
    }
    return undefined;
  };

  instance.logger = () => logger;

  /**
   * Get the all interactions instances
   * @returns {Object} All interactions and properties to toggle them on or off
   * @example
   * instance.interactions.instances; // Array of all interaction instances
   * instance.interactions.on(); // Toggle on all interactions instances
   * instance.interactions.off(); // Toggle off all interactions instances
   */
  Object.defineProperty(instance, 'interactions', {
    get() {
      return {
        instances: currentInteractions,
        on() {
          currentInteractions.forEach(i => i.on());
        },
        off() {
          currentInteractions.forEach(i => i.off());
        }
      };
    }
  });

  created();

  if (element) {
    beforeMount();
    mount(element);
    mounted(element);
    instance.element = element;
  }

  return instance;
}

chart.mixin = mixins.add; // Expose mixin registering function

export default chart;
