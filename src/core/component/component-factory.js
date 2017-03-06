import extend from 'extend';

import { list as listMixins } from './component-mixins';
import rendererFn from '../renderer/index';
import {
  styler,
  resolveTapEvent,
  resolveOverEvent
} from './brushing';

const isReservedProperty = prop => [
  'on', 'preferredSize', 'created', 'beforeMount', 'mounted', 'resize',
  'beforeUpdate', 'updated', 'beforeRender', 'render', 'beforeDestroy',
  'destroyed', 'defaultSettings', 'data', 'settings', 'formatter',
  'scale', 'chart', 'dockConfig'
].some(name => name === prop);

const isNativeEvent = name => (
  !/^tap|^swipe|^press|^rotate|^pinch|^pan/.test(name)
);

function prepareContext(ctx, definition, opts) {
  const {
    require = []
  } = definition;
  const {
    settings,
    formatter,
    scale,
    data,
    renderer,
    chart,
    dockConfig
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
      ctx.chart = chart;
      Object.defineProperty(ctx, 'chart', {
        get: chart
      });
    } else if (req === 'dockConfig') {
      Object.defineProperty(ctx, 'dockConfig', {
        get: dockConfig
      });
    }
  });
}

function updateDockConfig(config, settings) {
  config.displayOrder = settings.displayOrder;
  config.dock = settings.dock;
  config.prioOrder = settings.prioOrder;
  config.minimumLayoutMode = settings.minimumLayoutMode;
  return config;
}

// First render
// preferredSize -> resize -> beforeRender -> render -> mounted

// Normal update
// beforeUpdate -> preferredSize -> resize -> beforeRender -> render -> updated

// Update without relayout
// beforeUpdate -> beforeRender -> render -> updated

// TODO support es6 classes
export default function componentFactory(definition) {
  const {
    defaultSettings = {}
  } = definition;

  return (config = {}, chart, container, options = {}) => {
    let settings = extend(true, {}, defaultSettings, config);
    let data = [];
    let listeners = [];
    let scale;
    let formatter;
    let element;
    let size;

    const brushArgs = {
      nodes: [],
      chart,
      config: config.brush || {},
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

    Object.defineProperty(brushArgs, 'data', {
      get: () => data
    });

    const rend = definition.renderer ? rendererFn(definition.renderer) : options.renderer || rendererFn();
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
    };

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
      dockConfig: () => dockConfig
    });

    prepareContext(instanceContext, config, {
      settings: () => settings,
      data: () => data,
      scale: () => scale,
      formatter: () => formatter,
      renderer: () => rend,
      chart: () => chart,
      dockConfig: () => dockConfig
    });

    fn.getBrushedShapes = function getBrushedShapes(context, mode, props) {
      const shapes = [];
      if (config.brush && config.brush.trigger) {
        const brusher = chart.brush(context);
        const sceneObjects = rend.findShapes('*');
        config.brush.trigger.forEach((b) => {
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

    fn.findShapes = selector => rend.findShapes(selector);

    fn.mount = () => {
      element = rend.element && rend.element() ? element : rend.appendTo(container);

      if (config.brush) {
        (config.brush.consume || []).forEach((b) => {
          if (b.context && b.style) {
            brushStylers.push(styler(brushArgs, b));
          }
        });

        (config.brush.trigger || []).forEach((t) => {
          if (t.on === 'over') {
            brushTriggers.over.push(t);
          } else {
            brushTriggers.tap.push(t);
          }
        });
      }

      Object.keys(definition.on || {}).forEach((key) => {
        if (isNativeEvent(key)) {
          const listener = (e) => {
            definition.on[key].call(definitionContext, e);
          };
          element.addEventListener(key, listener);
          listeners.push({
            key,
            listener
          });
        }
      });

      Object.keys(config.on || {}).forEach((key) => {
        if (isNativeEvent(key)) {
          const listener = (e) => {
            config.on[key].call(instanceContext, e);
          };
          element.addEventListener(key, listener);
          listeners.push({
            key,
            listener
          });
        }
      });
    };

    fn.mounted = () => mounted(element);

    fn.unmount = () => {
      if (element) {
        listeners.forEach(({ key, listener }) => {
          element.removeEventListener(key, listener);
        });
        listeners = [];
      }

      brushTriggers.tap = [];
      brushTriggers.over = [];
      brushStylers.forEach((brushStyler) => {
        brushStyler.cleanUp();
      });
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

    fn.renderer = () => rend;

    fn.set({ settings: config });
    created();

    return fn;
  };
}
