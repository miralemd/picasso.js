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
    settings,
    key: settings.key,
    hasKey: typeof settings.key !== 'undefined'
  };
};

const findComponentByKey = (arr, key) => arr.filter(item => item.key === key)[0];

function diff(components, newComponents) {
  const added = [];
  const updated = [];
  const removed = [];

  components.forEach((comp) => {
    // if(newComponents.indexOf(comp) === -1) {
    if (!findComponentByKey(newComponents, comp.key)) {
      removed.push(comp);
    }
  });

  newComponents.forEach((newComp) => {
    // if(components.indexOf(newComp) === -1) {
    if (!findComponentByKey(components, newComp.key)) {
      added.push(newComp);
    } else {
      updated.push(newComp);
    }
  });

  return {
    added,
    updated,
    removed
  };
}

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
    visible.forEach((c) => {
      if (c.shouldUpdate) {
        c.instance.update({
          data: currentData,
          settings: c.settings,
          formatters: currentFormatters
        });
        delete c.shouldUpdate;
      } else {
        c.instance.render();
      }
    });
    hidden.forEach((c) => {
      if (c.instance.hide) {
        c.instance.hide();
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

    currentComponents = components.map(component => createComponent(component));

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
      components
    } = settings;

    dockLayout = createDockLayout();
    dockLayout.settings(settings.dockLayout);

    currentData = data;
    dataset = buildData(data);
    currentFormatters = buildFormatters(formatters, fn);
    currentScales = buildScales(scales, fn);

    const {
      added,
      updated,
      removed
    } = diff(currentComponents.map(comp => comp.settings), components);

    // console.log('added', added);
    // console.log('updated', updated);
    // console.log('removed', removed);

    removed.forEach((comp) => {
      let idx = currentComponents.map(cc => cc.settings).indexOf(comp);
      if (idx > -1) {
        currentComponents[idx].instance.destroy();
        currentComponents.splice(idx, 1);
      }
    });
    added.forEach((component) => {
      currentComponents.push(createComponent(component));
    });
    updated.forEach((comp) => {
      let idx = currentComponents.map(cc => cc.settings).indexOf(comp);
      if (idx > -1) {
        currentComponents[idx].settings = comp;
        currentComponents[idx].shouldUpdate = true;
      }
    });
    currentComponents = components;

    render();
  };

  fn.destroy = () => {
    currentComponents.forEach(comp => comp.instance.destroy());
  };

  fn.formatter = function (v) {
    return getOrCreateFormatter(v, currentFormatters, fn.table());
  };

  return fn;
}
