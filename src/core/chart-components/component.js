import extend from 'extend';

import rendererFn from '../renderer/index';
import {
  styler,
  observeBrushOnElement
} from './brushing';

const isReservedProperty = prop => [
  'on', 'preferredSize', 'created', 'beforeMount', 'mounted',
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

  return (config, composer, container) => {
    let settings = extend(true, {}, defaultSettings, config);
    let data = [];
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
    let hasRendered = false;

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

    const updateScale = () => {
      if (typeof settings.scale === 'string') {
        scale = composer.scale(settings.scale);
      }
    };
    const updateFormatter = () => {
      if (typeof settings.formatter === 'string') {
        formatter = composer.formatter(settings.formatter);
      } else if (typeof settings.scale === 'string') {
        formatter = composer.formatter({ source: scale.sources[0] });
      }
    };

    updateScale();
    updateFormatter();

    const fn = () => { };

    fn.dockConfig = dockConfig;

    // Treated as beforeRender
    fn.resize = (inner, outer) => {
      if (settings.data) {
        data = composer.dataset().map(settings.data.mapTo, settings.data.groupBy);
      } else {
        data = [];
      }

      const newSize = beforeRender({
        inner,
        outer
      });
      if (newSize) { // TODO temporary
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

    fn.render = () => {
      const nodes = brushArgs.nodes = render.call(definitionContext, ...getRenderArgs());
      rend.render(nodes);

      if (!hasRendered) {
        hasRendered = true;
        if (config.brush && config.brush.consume) {
          config.brush.consume.forEach((b) => {
            if (b.context && b.style) {
              styler(brushArgs, b);
            }
          });
        }
        mounted(element);
      }
    };

    fn.hide = () => {
      rend.size({
        x: 0,
        y: 0,
        width: 0,
        height: 0
      });
      rend.clear();
    };

    fn.update = (opts = {}) => {
      if (opts.settings) {
        settings = extend(true, {}, defaultSettings, opts.settings);
      }

      updateScale();
      updateFormatter();

      beforeUpdate({
        settings,
        data
      });

      const nodes = brushArgs.nodes = render.call(definitionContext, ...getRenderArgs());
      rend.render(nodes);

      updated();
    };

    fn.destroy = () => {
      beforeDestroy.call(element);
      rend.destroy();
      destroyed();
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

    fn.getBrushedShapes = function getBrushedShapes(context, all) {
      const shapes = [];
      if (config.brush && config.brush.trigger) {
        const brusher = composer.brush(context);
        const nodes = brushArgs.nodes;
        const len = nodes.length;
        config.brush.trigger.forEach((b) => {
          for (let i = 0; i < len; i++) {
            let nodeData = data[nodes[i].data];
            if (nodeData && brusher.containsMappedData(nodeData, b.data, all)) {
              shapes.push(nodes[i]);
            }
          }
        });
      }
      return shapes;
    };

    // Start calling lifecycle methods
    created({
      settings
    });

    // TODO skip for SSR
    beforeMount();

    element = rend.appendTo(container);

    // Bind event listeners
    Object.keys(definition.on || {}).forEach((key) => {
      const listener = (e) => {
        definition.on[key].call(definitionContext, e);
      };
      element.addEventListener(key, listener);
    });
    Object.keys(config.on || {}).forEach((key) => {
      const listener = (e) => {
        config.on[key].call(instanceContext, e);
      };
      element.addEventListener(key, listener);
    });

    // ===== temporary solution to try out interactive brushing (assuming svg renderer)
    if (brushArgs.config.trigger) {
      observeBrushOnElement({ element, config: brushArgs });
    }
    // ===== end temporary solution

    // end skip

    return fn;
  };
}
