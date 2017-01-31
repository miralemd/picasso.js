import composerFn from './composer';
import createDockLayout from '../dock-layout/dock-layout';

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

/**
 * Chart instance factory function
 */
function createInstance(definition) {
  let {
    element,
    data = {},
    settings = {},
    on = {},
    created = () => {},
    updated = () => {},
    mounted = () => {}
  } = definition;

  const listeners = [];
  let composer = composerFn();
  let currentComponents = []; // Augmented components

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

    return dockLayout.layout(element);
  };

  const render = () => {
    const {
      components = []
    } = settings;

    composer.set(data, settings);

    currentComponents = components.map(component => (
      composer.createComponent(component, element)
    ));

    const { visible, hidden } = layout(currentComponents);
    visible.forEach((compInstance) => {
      compInstance.render();
      findComponent(compInstance).visible = true;
    });
    hidden.forEach((compInstance) => {
      compInstance.hide();
      findComponent(compInstance).visible = false;
    });
  };

  function instance() {} // The chart instance

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
  instance.update = (newProps = {}) => {
    const { partialData } = newProps;
    if (newProps.data) {
      data = newProps.data;
    }
    if (newProps.settings) {
      settings = newProps.settings;
    }

    composer.set(data, settings, { partialData });

    const {
      formatters,
      scales,
      components = []
    } = settings;

    if (partialData) {
      // Update without relayouting - assumes the compoents array has been left intact (no additions, removals or moving of items)
      for (let i = 0; i < components.length; i++) {
        currentComponents[i].instance.beforeUpdate({
          formatters,
          scales,
          data,
          settings: components[i]
        });
        if (currentComponents[i].visible) {
          currentComponents[i].instance.update();
        }
      }
    } else {
      for (let i = currentComponents.length - 1; i >= 0; i--) {
        const currComp = currentComponents[i];
        // TODO warn when there is no key
        if (!components.some(c => currComp.hasKey && currComp.key === c.key)) {
          // Component is removed
          currentComponents.splice(i, 1);
          currComp.instance.destroy();
        }
      }

      for (let i = 0; i < components.length; i++) {
        const comp = components[i];
        const idx = findComponentIndexByKey(comp.key);
        if (idx === -1) {
          // Component is added
          const currComp = composer.createComponent(comp, element);
          currentComponents.push(currComp);
        } else {
          // Component is (potentially) updated
          currentComponents[idx].shouldUpdate = true;
          currentComponents[idx].instance.beforeUpdate({
            formatters,
            scales,
            data,
            settings: comp
          });
        }
      }

      const { visible, hidden } = layout(currentComponents);
      visible.forEach((compInstance) => {
        const comp = findComponent(compInstance);
        if (comp.shouldUpdate) {
          compInstance.update();
          delete comp.shouldUpdate;
        } else {
          compInstance.render();
        }
        comp.visible = true;
      });
      hidden.forEach((compInstance) => {
        compInstance.hide();
        const comp = findComponent(compInstance);
        comp.visible = false;
        delete comp.updateWith;
      });
    }

    if (typeof updated === 'function') {
      updated.call(instance);
    }
  };

  instance.destroy = () => {
    currentComponents.forEach(comp => comp.instance.destroy());
    currentComponents = [];
    unmount();
    delete instance.update;
    delete instance.destroy;
  };

  /**
   * The brush context for this chart
   * @return {data-brush}
   */
  instance.brush = (...v) => composer.brush(...v);

  instance.getAffectedShapes = (context, key, mode = 'and') => {
    const shapes = [];
    currentComponents.filter(comp => key === undefined || comp.key === key).forEach((comp) => {
      shapes.push(...comp.instance.getBrushedShapes(context, mode));
    });
    return shapes;
  };

  /**
   * @return {scroll-api}
   */
  instance.scroll = (...v) => composer.scroll(...v);

  created.call(instance);

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
 */
export default function chart(definition) {
  return createInstance(definition);
}
