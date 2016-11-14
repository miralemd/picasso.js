import { default as extend } from 'extend';
import { dockConfig } from './dock-config';

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

function reduceSingleLayoutRect(containerRect, reducedRect, c) {
  switch (c.config.dock()) {
    case 'top':
      if (reducedRect.height >= c.cachedSize + (containerRect.height * 0.5)) {
        reducedRect.y += c.cachedSize;
        reducedRect.height -= c.cachedSize;
        return true;
      } else {
        return false;
      }
    case 'bottom':
      if (reducedRect.height >= c.cachedSize + (containerRect.height * 0.5)) {
        reducedRect.height -= c.cachedSize;
        return true;
      } else {
        return false;
      }
    case 'left':
      if (reducedRect.width >= c.cachedSize + (containerRect.width * 0.5)) {
        reducedRect.x += c.cachedSize;
        reducedRect.width -= c.cachedSize;
        return true;
      } else {
        return false;
      }
    case 'right':
      if (reducedRect.width >= c.cachedSize + (containerRect.width * 0.5)) {
        reducedRect.width -= c.cachedSize;
        return true;
      } else {
        return false;
      }
    default:
      return true;
  }
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
    c.cachedSize = Math.ceil(c.config.requiredSize()(containerRect));

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
    c.cachedSize = c.cachedSize === undefined ? Math.ceil(c.config.requiredSize()(containerRect)) : c.cachedSize;
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

export function dockLayout() {
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
