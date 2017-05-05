import extend from 'extend';
import EventEmitter from '../utils/event-emitter';
import { list as listMixins } from './component-mixins';
import rendererFn from '../renderer/index';
import {
  styler,
  resolveTapEvent,
  resolveOverEvent,
  brushFromSceneNodes
} from './brushing';

const isReservedProperty = prop => [
  'on', 'preferredSize', 'created', 'beforeMount', 'mounted', 'resize',
  'beforeUpdate', 'updated', 'beforeRender', 'render', 'beforeDestroy',
  'destroyed', 'defaultSettings', 'data', 'settings', 'formatter',
  'scale', 'chart', 'dockConfig', 'mediator'
].some(name => name === prop);

function prepareContext(ctx, definition, opts) {
  const {
    require = []
  } = definition;
  const mediatorSettings = definition.mediator || {};
  const {
    settings,
    formatter,
    scale,
    data,
    renderer,
    chart,
    dockConfig,
    mediator,
    instance
  } = opts;

  // TODO add setters and log warnings / errors to console
  Object.defineProperty(ctx, 'settings', {
    get: settings
  });
  Object.defineProperty(ctx, 'data', {
    get: data
  });
  Object.defineProperty(ctx, 'formatter', {
    get: formatter
  });
  Object.defineProperty(ctx, 'scale', {
    get: scale
  });
  Object.defineProperty(ctx, 'mediator', {
    get: mediator
  });

  Object.keys(definition).forEach((key) => {
    if (!isReservedProperty(key)) {
      // Add non-lifecycle methods to the context
      if (typeof definition[key] === 'function') {
        ctx[key] = definition[key].bind(ctx);
      } else {
        ctx[key] = definition[key];
      }
    }
  });

  // Add properties to context
  require.forEach((req) => {
    if (req === 'renderer') {
      Object.defineProperty(ctx, 'renderer', {
        get: renderer
      });
    } else if (req === 'chart') {
      Object.defineProperty(ctx, 'chart', {
        get: chart
      });
    } else if (req === 'dockConfig') {
      Object.defineProperty(ctx, 'dockConfig', {
        get: dockConfig
      });
    } else if (req === 'instance') {
      Object.defineProperty(ctx, 'instance', {
        get: instance
      });
    }
  });

  Object.keys(mediatorSettings).forEach((eventName) => {
    ctx.mediator.on(eventName, mediatorSettings[eventName].bind(ctx));
  });
}

function updateDockConfig(config, settings) {
  config.displayOrder = settings.displayOrder;
  config.dock = settings.dock;
  config.prioOrder = settings.prioOrder;
  config.minimumLayoutMode = settings.minimumLayoutMode;
  config.show = settings.show;
  return config;
}

function setUpEmitter(ctx, emitter, settings) {
  // Object.defineProperty(ctx, 'emitter', )
  Object.keys(settings.on || {}).forEach((event) => {
    ctx.eventListeners = ctx.eventListeners || [];
    const listener = settings.on[event].bind(ctx);
    ctx.eventListeners.push({ event, listener });
    emitter.on(event, listener);
  });
  ctx.emit = (name, event) => emitter.emit(name, event);
}

// First render
// preferredSize -> resize -> beforeRender -> render -> mounted

// Normal update
// beforeUpdate -> preferredSize -> resize -> beforeRender -> render -> updated

// Update without relayout
// beforeUpdate -> beforeRender -> render -> updated

// TODO support es6 classes
function componentFactory(definition, options = {}) {
  const {
    defaultSettings = {}
  } = definition;
  const {
    chart,
    container,
    mediator,
    renderer // Used by tests
  } = options;
  const config = options.settings || {};
  const emitter = EventEmitter.mixin({});
  let settings = extend(true, {}, defaultSettings, config);
  let data = [];
  let scale;
  let formatter;
  let element;
  let size;

  const brushArgs = {
    nodes: [],
    chart,
    config: settings.brush || {},
    renderer: null
  };
  const brushTriggers = {
    tap: [],
    over: []
  };
  const brushStylers = [];
  const componentMixins = listMixins(settings.type);
  const definitionContext = {};
  const instanceContext = { ...config, ...componentMixins.filter(mixinName => !isReservedProperty(mixinName)) };

  // Create a callback that calls lifecycle functions in the definition and config (if they exist).
  function createCallback(method, defaultMethod = () => {}) {
    return function cb(...args) {
      const inDefinition = typeof definition[method] === 'function';
      const inConfig = typeof config[method] === 'function';

      let returnValue;
      if (inDefinition) {
        returnValue = definition[method].call(definitionContext, ...args);
      }
      if (typeof config[method] === 'function') {
        returnValue = config[method].call(instanceContext, ...args);
      }
      if (!inDefinition && !inConfig) {
        returnValue = defaultMethod.call(definitionContext, ...args);
      }
      componentMixins.forEach((mixin) => {
        if (mixin[method]) {
          mixin[method].call(instanceContext, ...args);
        }
      });
      return returnValue;
    };
  }

  const preferredSize = createCallback('preferredSize', () => 0);
  const resize = createCallback('resize', ({ inner }) => inner);
  const created = createCallback('created');
  const beforeMount = createCallback('beforeMount');
  const mounted = createCallback('mounted');
  const beforeUpdate = createCallback('beforeUpdate');
  const updated = createCallback('updated');
  const beforeRender = createCallback('beforeRender');
  const beforeDestroy = createCallback('beforeDestroy');
  const destroyed = createCallback('destroyed');
  const render = definition.render; // Do not allow overriding of this function

  const addBrushStylers = () => {
    if (settings.brush) {
      (settings.brush.consume || []).forEach((b) => {
        if (b.context && b.style) {
          brushStylers.push(styler(brushArgs, b));
        }
      });
    }
  };

  const addBrushTriggers = () => {
    if (settings.brush) {
      (settings.brush.trigger || []).forEach((t) => {
        if (t.on === 'over') {
          brushTriggers.over.push(t);
        } else {
          brushTriggers.tap.push(t);
        }
      });
    }
  };

  Object.defineProperty(brushArgs, 'data', {
    get: () => data
  });

  const rend = definition.renderer ? rendererFn(definition.renderer) : renderer || rendererFn();
  brushArgs.renderer = rend;

  const dockConfig = {
    requiredSize: (inner, outer) => preferredSize({
      inner,
      outer,
      dock: dockConfig.dock
    })
  };
  updateDockConfig(dockConfig, settings);

  const fn = () => {};

  fn.dockConfig = dockConfig;

  // Set new settings - will trigger mapping of data and creation of scale / formatter.
  fn.set = (opts = {}) => {
    if (opts.settings) {
      settings = extend(true, {}, defaultSettings, opts.settings);
      updateDockConfig(dockConfig, settings);
    }

    if (typeof settings.scale === 'string') {
      scale = chart.scale(settings.scale);
    }

    if (settings.data) {
      data = chart.dataset().map(settings.data.mapTo, settings.data.groupBy);
    } else if (scale) {
      data = scale.data();
    } else {
      data = [];
    }

    if (typeof settings.formatter === 'string') {
      formatter = chart.formatter(settings.formatter);
    } else if (typeof settings.formatter === 'object') {
      formatter = chart.formatter(settings.formatter);
    } else if (typeof settings.scale === 'string') {
      formatter = chart.formatter({ source: scale.sources[0] });
    }
  };

  fn.resize = (inner, outer) => {
    const newSize = resize({
      inner,
      outer
    });
    if (newSize) {
      rend.size(newSize);
      size = newSize;
    } else {
      rend.size(inner);
      size = inner;
    }
    instanceContext.rect = inner;
  };

  fn.getRect = () => instanceContext.rect;

  const getRenderArgs = () => {
    const renderArgs = rend.renderArgs ? rend.renderArgs.slice(0) : [];
    renderArgs.push({
      data
    });
    return renderArgs;
  };

  fn.beforeMount = beforeMount;

  fn.beforeRender = () => {
    beforeRender({
      size
    });
  };

  fn.render = () => {
    const nodes = brushArgs.nodes = render.call(definitionContext, ...getRenderArgs());
    rend.render(nodes);
  };

  fn.hide = () => {
    fn.unmount();
    rend.size({
      x: 0,
      y: 0,
      width: 0,
      height: 0
    });
    rend.clear();
  };

  fn.beforeUpdate = () => {
    beforeUpdate({
      settings,
      data
    });
  };

  fn.update = () => {
    const nodes = brushArgs.nodes = render.call(definitionContext, ...getRenderArgs());

    // Reset brush stylers and triggers
    brushStylers.forEach(b => b.cleanUp());
    brushStylers.length = 0;
    brushTriggers.tap = [];
    brushTriggers.over = [];

    if (settings.brush) {
      addBrushStylers();
      addBrushTriggers();
    }

    brushStylers.forEach((brushStyler) => {
      if (brushStyler.isActive()) {
        brushStyler.update();
      }
    });

    rend.render(nodes);
  };

  fn.updated = updated;

  fn.destroy = () => {
    fn.unmount();
    beforeDestroy(element);
    rend.destroy();
    destroyed();
    element = null;
  };

  // Set contexts, note that the definition and instance need different contexts (for example if they have different 'require' props)
  prepareContext(definitionContext, definition, {
    settings: () => settings,
    data: () => data,
    scale: () => scale,
    formatter: () => formatter,
    renderer: () => rend,
    chart: () => chart,
    dockConfig: () => dockConfig,
    mediator: () => mediator,
    instance: () => instanceContext
  });

  prepareContext(instanceContext, config, {
    settings: () => settings,
    data: () => data,
    scale: () => scale,
    formatter: () => formatter,
    renderer: () => rend,
    chart: () => chart,
    dockConfig: () => dockConfig,
    mediator: () => mediator
  });

  fn.getBrushedShapes = function getBrushedShapes(context, mode, props) {
    const shapes = [];
    if (settings.brush && settings.brush.trigger) {
      const brusher = chart.brush(context);
      const sceneObjects = rend.findShapes('*');
      settings.brush.trigger.forEach((b) => {
        sceneObjects.forEach((sceneObject) => {
          const nodeData = data[sceneObject.data];
          if (nodeData && brusher.containsMappedData(nodeData, props || b.data, mode)) {
            shapes.push(sceneObject);
          }
        });
      });
    }
    return shapes;
  };

  fn.findShapes = (selector) => {
    const shapes = rend.findShapes(selector);
    for (let i = 0, num = shapes.length; i < num; i++) {
      shapes[i].key = settings.key;
    }

    return shapes;
  };

  fn.shapesAt = (shape, opts = {}) => {
    const items = rend.itemsAt(shape);
    let shapes;

    if (opts && opts.propagation === 'stop' && items.length > 0) {
      shapes = [items.pop().node];
    } else {
      shapes = items.map(i => i.node);
    }

    for (let i = 0, num = shapes.length; i < num; i++) {
      shapes[i].key = settings.key;
    }

    return shapes;
  };

  fn.brushFromShapes = (shapes, trigger = {}) => {
    trigger.contexts = Array.isArray(trigger.contexts) ? trigger.contexts : [];
    const action = trigger.action || 'toggle';

    brushFromSceneNodes({
      nodes: shapes,
      action,
      trigger,
      chart,
      data: brushArgs.data
    });
  };

  fn.mount = () => {
    element = rend.element && rend.element() ? element : rend.appendTo(container);

    if (settings.brush) {
      addBrushStylers();
      addBrushTriggers();
    }

    setUpEmitter(instanceContext, emitter, config);
    setUpEmitter(definitionContext, emitter, definition);
  };

  fn.mounted = () => mounted(element);

  fn.unmount = () => {
    [instanceContext, definitionContext].forEach((ctx) => {
      (ctx.eventListeners || []).forEach(({ event, listener }) => {
        emitter.removeListener(event, listener);
      });
    });
    brushTriggers.tap = [];
    brushTriggers.over = [];
    brushStylers.forEach((brushStyler) => {
      brushStyler.cleanUp();
    });
    brushStylers.length = 0;
  };

  fn.onBrushTap = (e) => {
    brushTriggers.tap.forEach((t) => {
      if (resolveTapEvent({ e, t, config: brushArgs }) && t.globalPropagation === 'stop') {
        chart.toggleBrushing(true);
      }
    });
  };

  fn.onBrushOver = (e) => {
    brushTriggers.over.forEach((t) => {
      if (resolveOverEvent({ e, t, config: brushArgs }) && t.globalPropagation === 'stop') {
        chart.toggleBrushing(true);
      }
    });
  };

  /**
   * Expose definition on instance
   * @experimental
   */
  fn.def = definitionContext;

  /**
   * Expose instanceCtx on "instance"
   * @experimental
   */
  fn.ctx = instanceContext;

  fn.renderer = () => rend;

  fn.set({ settings: config });
  created();

  return fn;
}

export default componentFactory;
