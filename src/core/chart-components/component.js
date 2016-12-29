// import extend from 'extend';

import rendererFn from '../renderer/index';

const isReservedProperty = prop => ['on', 'dock', 'displayOrder', 'prioOrder', 'minimumLayoutMode', 'renderer', 'preferredSize', 'created', 'beforeMount', 'mounted',
  'beforeUpdate', 'updated', 'beforeRender', 'render', 'beforeDestroy', 'destroyed'
].some(name => name === prop);

export default function componentFactory(definition) {
  return (config, composer) => {
    const {
      on = {},
      require = [],
      renderer,
      preferredSize = () => 0,
      created = () => {},
      beforeMount = () => {},
      mounted = () => {},
      beforeUpdate = () => {},
      updated = () => {},
      beforeRender = () => {},
      beforeDestroy = () => {},
      destroyed = () => {},
      render
    } = definition;

    let settings = config;
    let element;
    let hasRendered = false;

    // General settings variables (reserved properties)
    let {
      dock = definition.dock,
      displayOrder = definition.displayOrder,
      prioOrder = definition.prioOrder,
      minimumLayoutMode = definition.minimumLayoutMode
    } = settings;

    const rend = renderer ? rendererFn(renderer) : composer.renderer || rendererFn();

    const context = {
      dock,
      dataset: composer.dataset()
      // measureText: rend.measureText,
      // forceUpdate: () => {}
    };

    Object.keys(definition).forEach((key) => {
      if (!isReservedProperty(key)) {
        // Add non-lifecycle methods to the context
        context[key] = definition[key];
      }
    });

    if (typeof settings.scale === 'string') {
      context.scale = composer.scale(settings.scale);
    }
    if (typeof settings.formatter === 'string') {
      context.formatter = composer.formatter(settings.formatter);
    } else if (context.scale) {
      context.formatter = composer.formatter({ source: context.scale.sources[0] });
    }

    const fn = () => {};

    fn.dockConfig = {
      requiredSize: (inner, outer) => preferredSize.call(context, {
        inner,
        outer
      }),
      displayOrder,
      prioOrder,
      minimumLayoutMode,
      dock
    };

    fn.resize = (inner, outer) => {
      const newSize = beforeRender.call(context, {
        inner,
        outer
      });
      if (newSize) { // TODO temporary
        rend.size(newSize);
      }
    };

    fn.render = () => {
      const nodes = render.call(context);
      rend.render(nodes);

      if (!hasRendered) {
        hasRendered = true;
        mounted.call(context, element);
      }
    };

    fn.update = (opts = {}) => {
      if (opts.settings) {
        settings = opts.settings;
      }
      if (opts.dataset) {
        context.dataset = opts.dataset;
      }

      beforeUpdate.call(context, {
        settings,
        dataset: context.dataset
      });

      const nodes = render.call(context);
      rend.render(nodes);

      updated.call(context);
    };

    fn.destroy = () => {
      beforeDestroy.call(context, element);
      rend.destroy();
      destroyed.call(context);
    };

    // Add properties to context

    require.forEach((req) => {
      if (req === 'measureText') {
        context.measureText = rend.measureText;
      } else if (req === 'forceUpdate') {
        context.forceUpdate = fn.update;
      } else if (req === 'composer') {
        context.composer = composer;
      } else if (req === 'dockConfig') {
        context.dockConfig = fn.dockConfig;
      }
    });

    created.call(context, {
      settings
    });

    // TODO skip for SSR
    beforeMount.call(context);

    element = rend.appendTo(composer.container());

    Object.keys(on).forEach((key) => {
      const listener = (e) => {
        on[key].call(context, e);
      };
      element.addEventListener(key, listener);
    });
    // end skip

    return fn;
  };
}
