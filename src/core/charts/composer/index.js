import extend from 'extend';

import getComponentFactory from '../../chart-components/index';
import buildData from '../../data/index';
import createDockLayout from '../../dock-layout/dock-layout';
import buildFormatters, { getOrCreateFormatter } from './formatter';
import buildScales, { getOrCreateScale } from './scales';
import brush from '../../brush';

const createComponent = (settings, fn) => {
  const factoryFn = getComponentFactory(settings.type);
  const instance = factoryFn(settings, fn);
  return {
    instance,
    settings: extend(true, {}, settings),
    key: settings.key,
    hasKey: typeof settings.key !== 'undefined'
  };
};

export default function composer(element) {
  let currentData = null; // Unmodified data
  let currentScales = null; // Built scales
  let currentFormatters = null; // Built formatters
  let currentComponents = []; // Augmented components

  let dataset = [];
  let brushes = {};
  let dockLayout = null;

  function render() {
    currentComponents.forEach((c) => { dockLayout.addComponent(c.instance); });

    const { visible, hidden } = dockLayout.layout(element);
    visible.forEach((instance) => {
      const comp = currentComponents.filter(c => c.instance === instance)[0];
      if (comp.shouldUpdate) {
        instance.update(comp.updateWith);
        delete comp.shouldUpdate;
        delete comp.updateWith;
      } else {
        instance.render();
      }
    });
    hidden.forEach((instance) => {
      if (instance.hide) {
        instance.hide();
      }
    });
  }

  const fn = function () {};

  fn.render = function (data, settings) {
    const {
      formatters = {},
      scales = {},
      components = []
    } = settings;
    dockLayout = createDockLayout();
    dockLayout.settings(dockLayout);

    currentData = data;
    dataset = buildData(data);
    brushes = {};
    currentScales = buildScales(scales, fn);
    currentFormatters = buildFormatters(formatters, fn);

    currentComponents = components.map(component => createComponent(component, fn));

    render();
  };

  fn.table = function () {
    return dataset.tables()[0];
  };

  fn.dataset = function () {
    return dataset;
  };

  fn.scales = function () {
    return currentScales;
  };

  fn.formatters = function () {
    return currentFormatters;
  };

  fn.brush = function (name = 'default') {
    if (!brushes[name]) {
      brushes[name] = brush();
    }
    return brushes[name];
  };

  fn.container = function () {
    return element;
  };

  fn.scale = function (v) {
    return getOrCreateScale(v, currentScales, dataset);
  };

  fn.update = function (data, settings) {
    const {
      formatters,
      scales,
      components = []
    } = settings;

    dockLayout = createDockLayout();
    dockLayout.settings(settings.dockLayout);

    currentData = data;
    dataset = buildData(data);
    currentFormatters = buildFormatters(formatters, fn);
    currentScales = buildScales(scales, fn);

    for (let i = currentComponents.length - 1; i >= 0; i--) {
      const currComp = currentComponents[i];
      // TODO warn when there is no key
      if (!components.some(c => currComp.hasKey && currComp.key === c.key)) {
        // Component is removed
        console.log('Remove', currComp);
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
        console.log('Add', comp);
        currentComponents.push(createComponent(comp, fn));
      } else {
        // Component is (potentially) updated
        console.log('Update', comp);
        currentComponents[idx].shouldUpdate = true;
        currentComponents[idx].updateWith = {
          formatters,
          scales,
          data,
          settings: comp
        };
      }
    }

    render();
  };

  fn.destroy = () => {
    currentComponents.forEach(comp => comp.instance.destroy());
    currentComponents = [];
  };

  fn.formatter = function (v) {
    return getOrCreateFormatter(v, currentFormatters, fn.table());
  };

  return fn;
}
