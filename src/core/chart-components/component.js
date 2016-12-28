import rendererFn from '../renderer/index';

export default function componentFactory(definition) {
  return (config, composer) => {
    const {
      on = {},
      renderer,
      preferredSize = () => 0,
      created = () => {},
      beforeMount = () => {},
      mounted = () => {},
      beforeUpdate = () => {},
      updated = () => {},
      beforeRender = () => {},
      render
    } = definition;

    let element;
    let hasRendered = false;
    let {
      dock
    } = config;

    const context = {
      settings: config,
      scales: composer.scales(),
      formatters: composer.formatters(),
      dataset: composer.dataset()
    };

    const rend = rendererFn(renderer);

    created.call(context);

    // TODO skip for SSR
    beforeMount.call(context);

    element = rend.appendTo(composer.container());

    Object.keys(on).forEach((key) => {
      const listener = (e) => {
        on[key].call(context, e); // TODO cleanup
      };
      element.addEventListener(key, listener);
    });
    // end skip

    const fn = () => {};

    fn.dockConfig = {
      requiredSize: inner => preferredSize.call(context, {
        inner
      }),
      dock
    };

    fn.resize = (inner) => {
      const newSize = beforeRender.call(context, {
        inner
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

    fn.update = (opts) => {
      const {
        settings,
        scales,
        formatters,
        dataset
      } = opts;
      beforeUpdate.call(context, {
        settings,
        scales,
        formatters,
        dataset
      });

      context.scales = scales;
      context.formatters = formatters;
      context.dataset = dataset;

      const nodes = render.call(context);
      rend.render(nodes);

      updated.call(context);
    };

    return fn;
  };
}
