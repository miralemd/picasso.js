import getComponentFactory from '../../chart-components/index';
import buildData from '../../data/index';
import createDockLayout from '../../dock-layout/dock-layout';
import buildFormatters, { getOrCreateFormatter } from './formatter';
import buildScales, { getOrCreateScale } from './scales';

function flattenComponents(c) {
  const chartComponents = [];
  for (const prop in c) {
    if (Object.prototype.hasOwnProperty.call(c, prop)) {
      if (Array.isArray(c[prop])) {
        c[prop].forEach(cc => chartComponents.push(cc));
      } else {
        chartComponents.push(c[prop]);
      }
    }
  }
  return chartComponents;
}

const findComponentByKey = (arr, key) => arr.filter(item => item.key === key)[0];

function diff(componentsObj, newComponentsObj) {
  const added = [];
  const unknown = [];
  const removed = [];

  const components = flattenComponents(componentsObj);
  const newComponents = flattenComponents(newComponentsObj);

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
      unknown.push(newComp);
    }
  });

  return {
    added,
    unknown,
    removed
  };
}

export default function composer(element) {
  let currentData = null;
  let currentScales = null;
  let currentFormatters = null;
  let currentComponents = {};

  let dataset = [];
  let comps = {};
  let dockLayout = null;

  function render() {
    const cc = flattenComponents(comps);
    cc.forEach((c) => { dockLayout.addComponent(c); });

    const { visible, hidden } = dockLayout.layout(element);
    visible.forEach((c) => {
      c.render();
    });
    hidden.forEach((c) => {
      if (c.hide) {
        c.hide();
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
    currentScales = buildScales(scales, fn);
    currentFormatters = buildFormatters(formatters, fn);

    let keyIdx = 0;
    components.forEach((component) => {
      if (!component.key) {
        // throw new Error('No key found on component');
        component.key = keyIdx; // TODO sync in update function
        keyIdx++;
      }
      const factoryFn = getComponentFactory(component.type);
      const componentInstance = factoryFn(component, fn);
      comps[component.key] = componentInstance;
    });
    currentComponents = components;

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

  fn.container = function () {
    return element;
  };

  fn.scale = function (v) {
    return getOrCreateScale(v, currentScales, dataset);
  };

  // Only works for arrays of components
  fn.update = function (data, settings) {
    const {
      formatters,
      scales,
      components
    } = settings;

    dockLayout = createDockLayout();
    dockLayout.settings(settings.dockLayout);

    if (data !== currentData) {
      currentData = data;
      dataset = buildData(data);
    }

    if (data !== currentData || formatters !== currentFormatters) {
      currentFormatters = buildFormatters(formatters, fn);
    }
    if (data !== currentData || scales !== currentScales) {
      currentScales = buildScales(scales, fn);
    }

    const {
      added,
      unknown,
      removed
    } = diff(currentComponents, components);

    // console.log('added', added);
    // console.log('unknown', unknown);
    // console.log('removed', removed);

    added.forEach((compSettings) => {
      const factoryFn = getComponentFactory(compSettings.type);
      const componentInstance = factoryFn(compSettings, fn);
      comps[compSettings.key] = componentInstance;
    });
    unknown.forEach((compSettings) => {
      const componentInstance = comps[compSettings.key];
      componentInstance.update({
        settings: compSettings,
        scales,
        formatters,
        dataset
      });
    });
    removed.forEach((compSettings) => {
      const componentInstance = comps[compSettings.key];
      componentInstance.destroy();
    });
  };

  fn.destroy = () => {
    Object.keys(comps).forEach((key) => {
      const comp = comps[key];
      comp.destroy();
    });
  };

  fn.formatter = function (v) {
    return getOrCreateFormatter(v, currentFormatters, fn.table());
  };

  return fn;
}
