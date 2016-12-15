import extend from 'extend';
import dockConfig from './dock-config';
import resolveLayout, { resolveSettings } from './dock-settings-resolver';

function validateComponent(component) {
  const expectedProperties = ['resize'];

  expectedProperties.forEach((p) => {
    if (typeof component[p] !== 'function') {
      throw `Component is missing required function "${p}"`;
    }
  });
}


function cacheSize(c, containerRect) {
  c.cachedSize = typeof c.cachedSize === 'undefined' ? Math.ceil(c.config.requiredSize()(containerRect)) : c.cachedSize;
  return c.cachedSize;
}

function validateReduceRect(logicalContainerRect, reducedRect) {
  const minReduceWidth = logicalContainerRect.width * 0.5;
  const minReduceHeight = logicalContainerRect.height * 0.5;
  return reducedRect.width >= minReduceWidth && reducedRect.height >= minReduceHeight;
}

function reduceDocRect(reducedRect, c) {
  switch (c.config.dock()) {
    case 'top':
      reducedRect.y += c.cachedSize;
      reducedRect.height -= c.cachedSize;
      break;
    case 'bottom':
      reducedRect.height -= c.cachedSize;
      break;
    case 'left':
      reducedRect.x += c.cachedSize;
      reducedRect.width -= c.cachedSize;
      break;
    case 'right':
      reducedRect.width -= c.cachedSize;
      break;
    default:
  }
}
function addEdgeBleed(currentEdgeBleed, c) {
  const edgeBleed = c.config.edgeBleed();
  currentEdgeBleed.left = Math.max(currentEdgeBleed.left, edgeBleed.left);
  currentEdgeBleed.right = Math.max(currentEdgeBleed.right, edgeBleed.right);
  currentEdgeBleed.top = Math.max(currentEdgeBleed.top, edgeBleed.top);
  currentEdgeBleed.bottom = Math.max(currentEdgeBleed.bottom, edgeBleed.bottom);
}
function reduceEdgeBleed(logicalContainerRect, reducedRect, edgeBleed) {
  if (reducedRect.x < edgeBleed.left) {
    reducedRect.width -= edgeBleed.left - reducedRect.x;
    reducedRect.x = edgeBleed.left;
  }
  const reducedRectRightBoundary = logicalContainerRect.width - (reducedRect.x + reducedRect.width);
  if (reducedRectRightBoundary < edgeBleed.right) {
    reducedRect.width -= edgeBleed.right - reducedRectRightBoundary;
  }
  if (reducedRect.y < edgeBleed.top) {
    reducedRect.height -= edgeBleed.top - reducedRect.y;
    reducedRect.y = edgeBleed.top;
  }
  const reducedRectBottomBoundary = logicalContainerRect.height - (reducedRect.y + reducedRect.height);
  if (reducedRectBottomBoundary < edgeBleed.bottom) {
    reducedRect.height -= edgeBleed.bottom - reducedRectBottomBoundary;
  }
}

function reduceSingleLayoutRect(logicalContainerRect, reducedRect, edgeBleed, c) {
  const newReduceRect = extend({}, reducedRect);
  const newEdgeBeed = extend({}, edgeBleed);
  reduceDocRect(newReduceRect, c);
  addEdgeBleed(newEdgeBeed, c);
  reduceEdgeBleed(logicalContainerRect, newReduceRect, newEdgeBeed);

  const isValid = validateReduceRect(logicalContainerRect, newReduceRect);
  if (!isValid) {
    return false;
  }

  reduceDocRect(reducedRect, c);
  addEdgeBleed(edgeBleed, c);
  return true;
}

function reduceLayoutRect(logicalContainerRect, components) {
  const reducedRect = {
    x: logicalContainerRect.x,
    y: logicalContainerRect.y,
    width: logicalContainerRect.width,
    height: logicalContainerRect.height
  };
  const edgeBleed = { left: 0, right: 0, top: 0, bottom: 0 };

  components.sort((a, b) => a.config.prioOrder() - b.config.prioOrder());

  for (let i = 0; i < components.length; ++i) {
    const c = components[i];
    cacheSize(c, logicalContainerRect);

    if (!reduceSingleLayoutRect(logicalContainerRect, reducedRect, edgeBleed, c)) {
      components.splice(i, 1);
      --i;
    }
  }
  reduceEdgeBleed(logicalContainerRect, reducedRect, edgeBleed);
  return reducedRect;
}

function appendScaleRatio(rect, outerRect, logicalContainerRect, containerRect) {
  const scaleX = containerRect.width / logicalContainerRect.width;
  const scaleY = containerRect.height / logicalContainerRect.height;
  const scaleRatio = {
    x: logicalContainerRect.preserveAspectRatio ? Math.min(scaleX, scaleY) : scaleX,
    y: logicalContainerRect.preserveAspectRatio ? Math.min(scaleX, scaleY) : scaleY
  };

  rect.scaleRatio = scaleRatio;
  outerRect.scaleRatio = scaleRatio;
  logicalContainerRect.scaleRatio = scaleRatio;
}

function positionComponents(components, logicalContainerRect, reducedRect, containerRect) {
  let vRect = { x: reducedRect.x, y: reducedRect.y, width: reducedRect.width, height: reducedRect.height };
  let hRect = { x: reducedRect.x, y: reducedRect.y, width: reducedRect.width, height: reducedRect.height };

  components.sort((a, b) => a.config.displayOrder() - b.config.displayOrder()).forEach((c) => {
    const outerRect = {};
    const rect = {};

    switch (c.config.dock()) {
      case 'top':
        outerRect.height = rect.height = c.cachedSize;
        outerRect.width = logicalContainerRect.width;
        rect.width = vRect.width;
        outerRect.x = logicalContainerRect.x;
        rect.x = vRect.x;
        outerRect.y = rect.y = vRect.y - c.cachedSize;

        vRect.y -= c.cachedSize;
        vRect.height += c.cachedSize;
        break;
      case 'bottom':
        outerRect.x = logicalContainerRect.x;
        rect.x = vRect.x;
        outerRect.y = rect.y = vRect.y + vRect.height;
        outerRect.width = logicalContainerRect.width;
        rect.width = vRect.width;
        outerRect.height = rect.height = c.cachedSize;

        vRect.height += c.cachedSize;
        break;
      case 'left':
        outerRect.x = rect.x = hRect.x - c.cachedSize;
        outerRect.y = logicalContainerRect.y;
        rect.y = hRect.y;
        outerRect.width = rect.width = c.cachedSize;
        outerRect.height = logicalContainerRect.height;
        rect.height = hRect.height;

        hRect.x -= c.cachedSize;
        hRect.width += c.cachedSize;
        break;
      case 'right':
        outerRect.x = rect.x = hRect.x + hRect.width;
        outerRect.y = logicalContainerRect.y;
        rect.y = hRect.y;
        outerRect.width = rect.width = c.cachedSize;
        outerRect.height = logicalContainerRect.height;
        rect.height = hRect.height;

        hRect.width += c.cachedSize;
        break;
      default:
        outerRect.x = rect.x = reducedRect.x;
        outerRect.y = rect.y = reducedRect.y;
        outerRect.width = rect.width = reducedRect.width;
        outerRect.height = rect.height = reducedRect.height;
    }

    appendScaleRatio(rect, outerRect, logicalContainerRect, containerRect);
    c.instance.resize(rect, outerRect, logicalContainerRect);
    c.cachedSize = undefined;
  });
}

export default function dockLayout() {
  const components = [];
  let settings = {};

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

  docker.layout = function (container) {
    const [logicalContainerRect, containerRect] = resolveLayout(container, settings);
    const reduced = reduceLayoutRect(logicalContainerRect, components);
    positionComponents(components, logicalContainerRect, reduced, containerRect);
  };

  docker.settings = function (s) {
    settings = resolveSettings(s);
  };

  return docker;
}
