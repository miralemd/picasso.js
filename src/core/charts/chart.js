import composerFn from './composer';
import createDockLayout from '../dock-layout/dock-layout';
import { detectPointerSupport, detectTouchSupport } from '../utils/event-type';

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
  let visibleComponents = [];

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

  const render = () => {
    const {
      components = []
    } = settings;

    composer.set(data, settings);

    currentComponents = components.map(component => (
      composer.createComponent(component, element)
    ));

    const { visible, hidden } = layout(currentComponents);
    visibleComponents = visible;

    hidden.forEach((component) => {
      component.instance.hide();
      component.visible = false;
    });

    visible.forEach(component => component.instance.beforeMount());
    visible.forEach(component => component.instance.mount());
    visible.forEach(component => component.instance.beforeRender());

    visible.forEach(component => component.instance.render());
    visible.forEach(component => component.instance.mounted());
    visible.forEach((component) => { component.visible = true; });
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

    const onBrushTap = (e) => {
      if (e.type === 'touchstart') {
        e.preventDefault();
      }

      for (let i = visibleComponents.length - 1; i >= 0; i--) {
        const comp = visibleComponents[i];

        comp.instance.onBrushTap(e);

        if (composer.stopBrushing) {
          composer.stopBrushing = false;
          break;
        }
      }
    };

    const onBrushOver = (e) => {
      for (let i = visibleComponents.length - 1; i >= 0; i--) {
        const comp = visibleComponents[i];

        comp.instance.onBrushOver(e);

        if (composer.stopBrushing) {
          composer.stopBrushing = false;
          break;
        }
      }
    };

    const onBrushOverLeave = () => {
      for (let i = visibleComponents.length - 1; i >= 0; i--) {
        const comp = visibleComponents[i];

        comp.instance.onBrushOverLeave();
      }
    };

    const brushEventList = [];

    if (detectPointerSupport(element)) {
      brushEventList.push({ key: 'pointerdown', listener: onBrushTap });
    } else {
      brushEventList.push({ key: 'click', listener: onBrushTap });

      if (detectTouchSupport(element)) {
        brushEventList.push({ key: 'touchstart', listener: onBrushTap });
      }
    }

    brushEventList.push({ key: 'mousemove', listener: onBrushOver });
    brushEventList.push({ key: 'mouseleave', listener: onBrushOverLeave });

    brushEventList.forEach((event) => {
      element.addEventListener(event.key, event.listener);
      listeners.push(event);
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
    currentComponents = components.map((component, i) => {
      const comp = components[i];
      const idx = findComponentIndexByKey(comp.key);
      if (idx === -1) {
        // Component is added
        return composer.createComponent(comp, element);
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

    currentComponents.forEach((component) => {
      if (component.updateWith) {
        component.instance.set(component.updateWith);
      }
    });
    currentComponents.forEach((component) => {
      if (component.updateWith) {
        component.instance.beforeUpdate();
      }
    });

    let toUpdate = [];
    let toRender = [];
    if (partialData) {
      currentComponents.forEach((component) => {
        if (component.updateWith && component.visible) {
          toUpdate.push(component);
        } else {
          toRender.push(component);
        }
      });
    } else {
      const { visible, hidden } = layout(currentComponents); // Relayout
      visibleComponents = visible;
      visible.forEach((component) => {
        if (component.updateWith && component.visible) {
          toUpdate.push(component);
        } else {
          toRender.push(component);
        }
      });

      hidden.forEach((component) => {
        component.instance.hide();
        component.visible = false;
        delete component.updateWith;
      });
    }

    toRender.forEach(component => component.instance.beforeMount());
    toRender.forEach(component => component.instance.mount());

    toRender.forEach(component => component.instance.beforeRender());
    toUpdate.forEach(component => component.instance.beforeRender());

    toRender.forEach(component => component.instance.render());
    toUpdate.forEach(component => component.instance.update());

    toRender.forEach(component => component.instance.mounted());
    toUpdate.forEach(component => component.instance.updated());

    visibleComponents.forEach((component) => {
      delete component.updateWith;
      component.visible = true;
    });

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

  /**
   * Get a field associated with the provided brush
   * @param {String} path path to the field to fetch
   * @return {data-field}
   */
  instance.field = path =>
     composer.dataset().findField(path)
  ;

  /**
   * Get all shapes associated with the provided context
   * @param {String} context The brush context
   * @param {String} mode Property comparasion mode.
   * @param {Array} props Which specific data properties to compare
   * @param {String} key Which component to get shapes from. Default gives shapes from all components.
   * @return {Object[]} Array of objects containing shape and parent element
   */
  instance.getAffectedShapes = (context, mode = 'and', props, key) => {
    const shapes = [];
    currentComponents.filter(comp => key === undefined || key === null || comp.key === key).forEach((comp) => {
      shapes.push(...comp.instance.getBrushedShapes(context, mode, props));
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
