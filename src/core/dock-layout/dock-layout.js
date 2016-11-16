import extend from 'extend';
import dockConfig from './dock-config';

function validateComponent(component) {
  const expectedProperties = ['resize'];

  expectedProperties.forEach((p) => {
    if (typeof component[p] !== 'function') {
      throw `Component is missing required function "${p}"`;
    }
  });
}

function roundRect(rect) {
  return {
    x: Math.ceil(rect.x),
    y: Math.ceil(rect.y),
    width: Math.ceil(rect.width),
    height: Math.ceil(rect.height)
  };
}

function cacheSize(c, containerRect) {
  c.cachedSize = typeof c.cachedSize === 'undefined' ? Math.ceil(c.config.requiredSize()(containerRect)) : c.cachedSize;
  return c.cachedSize;
}

function validateRequestedReduce(containerRect, reducedRect, requestedReduce) {
  const minReduceWidth = containerRect.width * 0.5;
  const minReduceHeight = containerRect.height * 0.5;
  const verticalReduce = (reducedRect.width - requestedReduce.left - requestedReduce.right) > minReduceWidth;
  const horizontalReduce = (reducedRect.height - requestedReduce.top - requestedReduce.bottom) > minReduceHeight;

  if (verticalReduce && horizontalReduce) {
    return true;
  }
  return false;
}

function reduceLeft(reducedRect, requestedReduce) {
  reducedRect.x += requestedReduce.left;
  reducedRect.width -= requestedReduce.left;
}

function reduceRight(reducedRect, requestedReduce) {
  reducedRect.width -= requestedReduce.right;
}

function reduceTop(reducedRect, requestedReduce) {
  reducedRect.y += requestedReduce.top;
  reducedRect.height -= requestedReduce.top;
}

function reduceBottom(reducedRect, requestedReduce) {
  reducedRect.height -= requestedReduce.bottom;
}

function reduceSingleLayoutRect(containerRect, reducedRect, c) {
  const requestedReduce = { left: 0, right: 0, top: 0, bottom: 0 };

  requestedReduce[c.config.dock()] = c.cachedSize;

  const reduce = validateRequestedReduce(containerRect, reducedRect, requestedReduce);

  if (!reduce) {
    return false;
  }

  reduceLeft(reducedRect, requestedReduce);
  reduceRight(reducedRect, requestedReduce);
  reduceTop(reducedRect, requestedReduce);
  reduceBottom(reducedRect, requestedReduce);
  return true;
}

function reduceLayoutRect(containerRect, components) {
  const reducedRect = {
    x: containerRect.x,
    y: containerRect.y,
    width: containerRect.width,
    height: containerRect.height
  };

  components.sort((a, b) => a.config.prioOrder() - b.config.prioOrder());

  for (let i = 0; i < components.length; ++i) {
    const c = components[i];
    cacheSize(c, containerRect);

    if (!reduceSingleLayoutRect(containerRect, reducedRect, c)) {
      components.splice(i, 1);
      --i;
    }
  }
  return reducedRect;
}

function positionComponents(components, containerRect, reducedRect) {
  let vRect = { x: reducedRect.x, y: reducedRect.y, width: reducedRect.width, height: reducedRect.height },
    hRect = { x: reducedRect.x, y: reducedRect.y, width: reducedRect.width, height: reducedRect.height };

  components.sort((a, b) => a.config.displayOrder() - b.config.displayOrder()).forEach((c) => {
    const outerRect = {};
    const rect = {};

    switch (c.config.dock()) {
      case 'top':
        outerRect.height = rect.height = c.cachedSize;
        outerRect.width = containerRect.width;
        rect.width = vRect.width;
        outerRect.x = containerRect.x;
        rect.x = vRect.x;
        outerRect.y = rect.y = vRect.y - c.cachedSize;

        vRect.y -= c.cachedSize;
        vRect.height += c.cachedSize;
        break;
      case 'bottom':
        outerRect.x = containerRect.x;
        rect.x = vRect.x;
        outerRect.y = rect.y = vRect.y + vRect.height;
        outerRect.width = containerRect.width;
        rect.width = vRect.width;
        outerRect.height = rect.height = c.cachedSize;

        vRect.height += c.cachedSize;
        break;
      case 'left':
        outerRect.x = rect.x = hRect.x - c.cachedSize;
        outerRect.y = containerRect.y;
        rect.y = hRect.y;
        outerRect.width = rect.width = c.cachedSize;
        outerRect.height = containerRect.height;
        rect.height = hRect.height;

        hRect.x -= c.cachedSize;
        hRect.width += c.cachedSize;
        break;
      case 'right':
        outerRect.x = rect.x = hRect.x + hRect.width;
        outerRect.y = containerRect.y;
        rect.y = hRect.y;
        outerRect.width = rect.width = c.cachedSize;
        outerRect.height = containerRect.height;
        rect.height = hRect.height;

        hRect.width += c.cachedSize;
        break;
      default:
        outerRect.x = rect.x = reducedRect.x;
        outerRect.y = rect.y = reducedRect.y;
        outerRect.width = rect.width = reducedRect.width;
        outerRect.height = rect.height = reducedRect.height;
    }

    c.instance.resize(rect, outerRect, containerRect);
    c.cachedSize = undefined;
  });
}

export default function dockLayout() {
  const containerRect = { x: 0, y: 0, width: 0, height: 0 };
  const components = [];

  const docker = function () {};

  docker.addComponent = function (component) {
    validateComponent(component);
    docker.removeComponent(component);
    components.push({
      instance: component,
      config: component.dockConfig || dockConfig()
    });
  };

  docker.removeComponent = function (component) {
    const idx = components.map(c => c.instance).indexOf(component);
    if (idx > -1) {
      components.splice(idx, 1);
    }
  };

  docker.layout = function (rect) {
    extend(containerRect, roundRect(rect));
    const reduced = reduceLayoutRect(containerRect, components);
    positionComponents(components, containerRect, reduced);
  };

  return docker;
}
