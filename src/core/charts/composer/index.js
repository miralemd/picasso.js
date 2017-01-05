import getComponentFactory from '../../chart-components/index';
import buildData from '../../data/index';
import createDockLayout from '../../dock-layout/dock-layout';
import buildFormatters, { getOrCreateFormatter } from './formatter';
import buildScales, { getOrCreateScale } from './scales';
import brush from '../../brush';

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

const createComponentInstance = (component, fn) => {
  const factoryFn = getComponentFactory(component.type);
  const instance = factoryFn(component, fn);
  instance.key = component.key;
  return instance;
};

const findComponentByKey = (arr, key) => arr.filter(item => item.key === key)[0];

function diff(componentsObj, newComponentsObj) {
  const added = [];
  const updated = [];
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
  let currentData = null;
  let currentScales = null;
  let currentFormatters = null;
  let currentComponents = [];

  let dataset = [];
  let comps = {};
  let brushes = {};
  let dockLayout = null;

  function render() {
    const cc = flattenComponents(comps);
    cc.forEach((c) => { dockLayout.addComponent(c); });

    const { visible, hidden } = dockLayout.layout(element);
    visible.forEach((c) => {
      if (c.shouldUpdate) {
        c.update({
          data: currentData,
          settings: currentComponents.filter(comp => comp.key === c.key)[0],
          formatters: currentFormatters
        });
        delete c.shouldUpdate;
      } else {
        c.render();
      }
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
    brushes = {};
    currentScales = buildScales(scales, fn);
    currentFormatters = buildFormatters(formatters, fn);

    let keyIdx = 0;
    components.forEach((component) => {
      if (typeof component.key === 'undefined') {
        component.key = keyIdx; // TODO sync in update function
        keyIdx++;
      }
      comps[component.key] = createComponentInstance(component, fn);
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
      updated,
      removed
    } = diff(currentComponents, components);

    console.log('added', added);
    console.log('updated', updated);
    console.log('removed', removed);

    removed.forEach((compSettings) => {
      const componentInstance = comps[compSettings.key];
      componentInstance.destroy();
      delete comps[compSettings.key];
    });
    let keyIdx = currentComponents.reduce((comp, nextComp) => {
      const maxKey = Math.max(comp.key || Number.MIN_VALUE, nextComp.key || Number.MIN_VALUE);
      return maxKey === Number.MIN_VALUE ? 0 : maxKey;
    }, {});
    added.forEach((component) => {
      if (typeof component.key === 'undefined') {
        component.key = keyIdx; // TODO sync in update function
        keyIdx++;
      }
      comps[component.key] = createComponentInstance(component, fn);
    });
    updated.forEach((compSettings) => {
      const componentInstance = comps[compSettings.key];
      // extend(comps[compSettings.key], );
      // componentInstance.key = compSettings.key;
      componentInstance.shouldUpdate = true;
    });
    currentComponents = components;

    render();
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
