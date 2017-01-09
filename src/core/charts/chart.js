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
 * @property {object} components
 * @property {marker[]} components.markers,
 * @property {axis[]} components.axes
 */

/**
 * @typedef Chart.ScaleProps
 * @property {string} source - The data source used as input when creating the scale
 * @property {string} [type] - The type of scale to create
 * @property {boolean} invert - Whether to invert the scale's output
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
  let dockLayout = null;
  let currentComponents = []; // Augmented components

  function renderComponents() {
    currentComponents.forEach((c) => { dockLayout.addComponent(c.instance); });

    const { visible, hidden } = dockLayout.layout(element);
    visible.forEach((compInstance) => {
      const comp = currentComponents.filter(c => c.instance === compInstance)[0];
      if (comp.shouldUpdate) {
        compInstance.update(comp.updateWith);
        delete comp.shouldUpdate;
        delete comp.updateWith;
      } else {
        compInstance.render();
      }
    });
    hidden.forEach((compInstance) => {
      compInstance.hide();
    });
  }

  function render(isInitial) {
    const {
      components = []
    } = settings;
    dockLayout = createDockLayout();
    dockLayout.settings(settings.dockLayout);

    composer.set(data, settings);

    if (isInitial) {
      currentComponents = components.map(component => (
        composer.createComponent(component, element)
      ));
    }

    renderComponents();
  }

  function instance() {}

  // Browser only
  const mount = () => {
    element.innerHTML = '';

    render(true);

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
  instance.update = (newProps) => {
    if (newProps.data) {
      data = newProps.data;
    }
    if (newProps.settings) {
      settings = newProps.settings;
    }

    composer.set(data, settings);

    const {
      formatters,
      scales,
      components = []
    } = settings;

    dockLayout = createDockLayout();
    dockLayout.settings(settings.dockLayout);

    for (let i = currentComponents.length - 1; i >= 0; i--) {
      const currComp = currentComponents[i];
      // TODO warn when there is no key
      if (!components.some(c => currComp.hasKey && currComp.key === c.key)) {
        // Component is removed
        // console.log('Remove', currComp);
        currComp.instance.destroy();
        currentComponents.splice(i, 1);
      }
    }

    for (let i = 0; i < components.length; i++) {
      let idx = -1;
      const comp = components[i];
      for (let j = 0; j < currentComponents.length; j++) {
        const currComp = currentComponents[j];
        // TODO warn when there is no key
        if (currComp.hasKey && currComp.key === comp.key) {
          idx = j;
          break;
        }
      }
      if (idx === -1) {
        // Component is added
        // console.log('Add', comp);
        currentComponents.push(composer.createComponent(comp, element));
      } else {
        // Component is (potentially) updated
        // console.log('Update', comp);
        currentComponents[idx].shouldUpdate = true;
        currentComponents[idx].updateWith = {
          formatters,
          scales,
          data,
          settings: comp
        };
      }
    }

    render(false);

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
