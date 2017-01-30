import extend from 'extend';

import rendererFn from '../renderer/index';
import {
  styler,
  observeBrushOnElement
} from './brushing';

const isReservedProperty = prop => [
  'on', 'preferredSize', 'created', 'beforeMount', 'mounted', 'resize',
  'beforeUpdate', 'updated', 'beforeRender', 'render', 'beforeDestroy',
  'destroyed', 'defaultSettings', 'data', 'settings', 'formatter',
  'scale', 'composer', 'dockConfig'
].some(name => name === prop);

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
    composer,
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
    } else if (req === 'composer') {
      ctx.composer = composer;
      Object.defineProperty(ctx, 'composer', {
        get: composer
      });
    } else if (req === 'dockConfig') {
      Object.defineProperty(ctx, 'dockConfig', {
        get: dockConfig
      });
    }
  });
}

// TODO support es6 classes
export default function componentFactory(definition) {
  const {
    defaultSettings = {}
  } = definition;

  return (config = {}, composer, container) => {
    let settings = extend(true, {}, defaultSettings, config);
    let data = [];
    let listeners = [];
    let scale;
    let formatter;

    const definitionContext = {};
    const instanceContext = {};

    // Create a callback that calls lifecycle functions in the definition and config (if they exist).
    function createCallback(method, defaultReturnValue) {
      return function cb(...args) {
        let returnValue = defaultReturnValue;
        if (typeof definition[method] === 'function') {
          returnValue = definition[method].call(definitionContext, ...args);
        }
        if (typeof config[method] === 'function') {
          returnValue = config[method].call(instanceContext, ...args);
        }
        return returnValue;
      };
    }

    const preferredSize = createCallback('preferredSize', 0);
    const created = createCallback('created');
    const beforeMount = createCallback('beforeMount');
    const mounted = createCallback('mounted');
    const beforeUpdate = createCallback('beforeUpdate');
    const updated = createCallback('updated');
    const beforeRender = createCallback('beforeRender');
    const beforeDestroy = createCallback('beforeDestroy');
    const destroyed = createCallback('destroyed');
     // Do not allow overriding of these function§
    const resize = definition.resize || function defaultResize({ inner }) { return inner; };
    const render = definition.render; // Do not allow overriding of this function

    let element;
    let brushArgs = {
      nodes: [],
      composer,
      config: config.brush || {},
      renderer: null
    };
    Object.defineProperty(brushArgs, 'data', {
      get: () => data
    });

    const rend = definition.renderer ? rendererFn(definition.renderer) : composer.renderer || rendererFn();
    brushArgs.renderer = rend;

    const dockConfig = {
      requiredSize: (inner, outer) => preferredSize({
        inner,
        outer,
        dock: dockConfig.dock
      }),
      displayOrder: settings.displayOrder,
      prioOrder: settings.prioOrder,
      minimumLayoutMode: settings.minimumLayoutMode,
      dock: settings.dock
    };

    function set(opts = {}) {
      if (opts.settings) {
        settings = extend(true, {}, defaultSettings, opts.settings);
      }

      if (settings.data) {
        data = composer.dataset().map(settings.data.mapTo, settings.data.groupBy);
      } else {
        data = [];
      }

      if (typeof settings.scale === 'string') {
        scale = composer.scale(settings.scale);
      }

      if (typeof settings.formatter === 'string') {
        formatter = composer.formatter(settings.formatter);
      } else if (typeof settings.scale === 'string') {
        formatter = composer.formatter({ source: scale.sources[0] });
      }
    }

    const fn = () => {
      fn.init({ settings: config });
      return fn;
    };

    fn.dockConfig = dockConfig;

    fn.resize = (inner, outer) => {
      const newSize = resize.call(definitionContext, {
        inner,
        outer
      });
      if (newSize) {
        rend.size(newSize);
      } else {
        rend.size(inner);
      }
    };

    const getRenderArgs = () => {
      const renderArgs = rend.renderArgs ? rend.renderArgs.slice(0) : [];
      renderArgs.push({
        data
      });
      return renderArgs;
    };

    fn.init = (opts) => {
      set(opts);

      created({
        settings
      });
    };

    fn.render = () => {
      beforeMount();

      element = rend.element && rend.element() ? element : rend.appendTo(container);
      beforeRender();

      const nodes = brushArgs.nodes = render.call(definitionContext, ...getRenderArgs());
      rend.render(nodes);

      fn.mount();
      mounted(element);
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

    fn.beforeUpdate = (opts) => {
      set(opts);

      beforeUpdate({
        settings,
        data
      });
    };

    fn.update = () => {
      element = rend.element && rend.element() ? element : rend.appendTo(container);

      beforeRender();

      const nodes = brushArgs.nodes = render.call(definitionContext, ...getRenderArgs());
      rend.render(nodes);

      updated();
    };

    fn.destroy = () => {
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
      composer: () => composer,
      dockConfig: () => dockConfig
    });
    definitionContext.update = fn.update;

    prepareContext(instanceContext, config, {
      settings: () => settings,
      data: () => data,
      scale: () => scale,
      formatter: () => formatter,
      renderer: () => rend,
      composer: () => composer,
      dockConfig: () => dockConfig
    });
    instanceContext.update = fn.update;

    fn.getBrushedShapes = function getBrushedShapes(context, mode) {
      const shapes = [];
      if (config.brush && config.brush.trigger) {
        const brusher = composer.brush(context);
        const nodes = brushArgs.nodes;
        const len = nodes.length;
        config.brush.trigger.forEach((b) => {
          for (let i = 0; i < len; i++) {
            let nodeData = data[nodes[i].data];
            if (nodeData && brusher.containsMappedData(nodeData, b.data, mode)) {
              shapes.push({ shape: nodes[i], parent: element });
            }
          }
        });
      }
      return shapes;
    };

    fn.mount = () => {
      if (config.brush && config.brush.consume) {
        config.brush.consume.forEach((b) => {
          if (b.context && b.style) {
            styler(brushArgs, b);
          }
        });
      }

      Object.keys(definition.on || {}).forEach((key) => {
        const listener = (e) => {
          definition.on[key].call(definitionContext, e);
        };
        element.addEventListener(key, listener);
        listeners.push({
          key,
          listener
        });
      });

      Object.keys(config.on || {}).forEach((key) => {
        const listener = (e) => {
          config.on[key].call(instanceContext, e);
        };
        element.addEventListener(key, listener);
        listeners.push({
          key,
          listener
        });
      });

      // ===== temporary solution to try out interactive brushing (assuming svg renderer)
      if (brushArgs.config.trigger) {
        observeBrushOnElement({ element, config: brushArgs });
      }
      // ===== end temporary solution
    };

    fn.unmount = () => {
      if (element) {
        listeners.forEach(({ key, listener }) => element.removeEventListener(key, listener));
        listeners = [];
      }
    };

    return fn;
  };
}
