import extend from 'extend';
import dockConfig from './dock-config';
import resolveLayout, { resolveSettings } from './dock-settings-resolver';
import { getRectVertices, pointsToRect } from '../math/intersection';

function validateComponent(component) {
  const expectedProperties = ['resize'];

  expectedProperties.forEach((p) => {
    if (typeof component[p] !== 'function') {
      throw new Error(`Component is missing required function "${p}"`);
    }
  });
}

function cacheSize(c, reducedRect, containerRect) {
  if (typeof c.cachedSize === 'undefined') {
    const size = c.config.requiredSize()(reducedRect, containerRect);
    if (typeof size === 'object') {
      c.cachedSize = Math.ceil(size.size);
      c.edgeBleed = size.edgeBleed;
    } else {
      c.cachedSize = Math.ceil(size);
    }
  }
  return c.cachedSize;
}

function validateReduceRect(logicalContainerRect, reducedRect, settings) {
  // Absolute value for width/height should have predence over relative value
  const minReduceWidth = Math.min(settings.center.minWidth, logicalContainerRect.width) || Math.max(logicalContainerRect.width * settings.center.minWidthRatio, 1);
  const minReduceHeight = Math.min(settings.center.minHeight, logicalContainerRect.height) || Math.max(logicalContainerRect.height * settings.center.minHeightRatio, 1);
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
  const edgeBleed = c.edgeBleed;
  if (!edgeBleed) { return; }
  currentEdgeBleed.left = Math.max(currentEdgeBleed.left, edgeBleed.left || 0);
  currentEdgeBleed.right = Math.max(currentEdgeBleed.right, edgeBleed.right || 0);
  currentEdgeBleed.top = Math.max(currentEdgeBleed.top, edgeBleed.top || 0);
  currentEdgeBleed.bottom = Math.max(currentEdgeBleed.bottom, edgeBleed.bottom || 0);
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

function reduceSingleLayoutRect(logicalContainerRect, reducedRect, edgeBleed, c, settings) {
  const newReduceRect = extend({}, reducedRect);
  const newEdgeBeed = extend({}, edgeBleed);
  reduceDocRect(newReduceRect, c);
  addEdgeBleed(newEdgeBeed, c);
  reduceEdgeBleed(logicalContainerRect, newReduceRect, newEdgeBeed);

  const isValid = validateReduceRect(logicalContainerRect, newReduceRect, settings);
  if (!isValid) {
    return false;
  }

  reduceDocRect(reducedRect, c);
  addEdgeBleed(edgeBleed, c);
  return true;
}

function reduceLayoutRect(logicalContainerRect, components, hiddenComponents, settings) {
  const reducedRect = {
    x: logicalContainerRect.x,
    y: logicalContainerRect.y,
    width: logicalContainerRect.width,
    height: logicalContainerRect.height
  };
  const edgeBleed = { left: 0, right: 0, top: 0, bottom: 0 };

  const sortedComponents = components.slice();
  sortedComponents.sort((a, b) => a.config.prioOrder() - b.config.prioOrder()); // lower prioOrder will have higher prio

  for (let i = 0; i < sortedComponents.length; ++i) {
    const c = sortedComponents[i];
    cacheSize(c, reducedRect, logicalContainerRect);

    if (!reduceSingleLayoutRect(logicalContainerRect, reducedRect, edgeBleed, c, settings)) {
      sortedComponents.splice(i, 1);
      hiddenComponents.push(c.instance);
      --i;
    }
  }

  const filteredUnsortedComps = components.filter(c => sortedComponents.indexOf(c) !== -1);
  components.length = 0;
  components.push(...filteredUnsortedComps);
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

function boundingBox(rects) {
  const points = [].concat(...rects.map(getRectVertices));
  return pointsToRect(points);
}

function positionComponents(components, logicalContainerRect, reducedRect, containerRect) {
  const vRect = { x: reducedRect.x, y: reducedRect.y, width: reducedRect.width, height: reducedRect.height };
  const hRect = { x: reducedRect.x, y: reducedRect.y, width: reducedRect.width, height: reducedRect.height };

  const referencedComponents = {};

  components.sort((a, b) => {
    if (/^@/.test(b.config.dock())) {
      return -1;
    } else if (/^@/.test(a.config.dock())) {
      return 1;
    }
    return a.config.displayOrder() - b.config.displayOrder();
  }).forEach((c) => {
    let outerRect = {};
    let rect = {};
    const d = c.config.dock();
    switch (d) {
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
    if (/^@/.test(d)) {
      const refs = d.split(',').map(r => referencedComponents[r.replace('@', '')]).filter(r => !!r);
      if (refs.length > 0) {
        outerRect = boundingBox(refs.map(r => r.outerRect));
        rect = boundingBox(refs.map(r => r.rect));
      }
    } else {
      appendScaleRatio(rect, outerRect, logicalContainerRect, containerRect);
      if (c.key) {
        referencedComponents[c.key] = { // store the size of this component
          rect,
          outerRect
        };
      }
    }
    c.instance.resize(rect, outerRect, logicalContainerRect);
    c.cachedSize = undefined;
  });
}

function checkShowSettings(components, hiddenComponents, settings, logicalContainerRect) {
  const layoutModes = settings.layoutModes || {};
  for (let i = 0; i < components.length; ++i) {
    const c = components[i];
    const minimumLayoutMode = c.config.minimumLayoutMode();
    let show = c.config.show();
    if (show && typeof minimumLayoutMode === 'object') {
      show = layoutModes[minimumLayoutMode.width] &&
        layoutModes[minimumLayoutMode.height] &&
        logicalContainerRect.width >= layoutModes[minimumLayoutMode.width].width &&
        logicalContainerRect.height >= layoutModes[minimumLayoutMode.height].height;
    } else if (show && minimumLayoutMode !== undefined) {
      show = layoutModes[minimumLayoutMode] &&
        logicalContainerRect.width >= layoutModes[minimumLayoutMode].width &&
        logicalContainerRect.height >= layoutModes[minimumLayoutMode].height;
    }
    if (!show) {
      components.splice(i, 1);
      hiddenComponents.push(c.instance);
      --i;
    }
  }
}

/**
 * @typedef dockLayout
 * @type {object}
 * @property {object} [size] - Physical size
 * @property {number} [size.width] - Width in pixels
 * @property {number} [size.height]- Height in pixels
 * @property {object} [logicalSize] - Logical size
 * @property {number} [logicalSize.width] - Width in pixels
 * @property {number} [logicalSize.height] - Height in pixels
 * @property {boolean} [logicalSize.preserveAspectRatio=false] - If true, takes the smallest ratio of width/height between logical and physical size ( physical / logical ).
 * @property {object} [center]
 * @property {number} [center.minWidthRatio=0.5] - Value between 0 and 1
 * @property {number} [center.minHeightRatio=0.5] - Value between 0 and 1
 * @property {number} [center.minWidth] - Width in pixels
 * @property {number} [center.minHeight] - Height in pixels
 */

export default function dockLayout(initialSettings) {
  const components = [];
  const hiddenComponents = [];
  let settings = resolveSettings(initialSettings);

  const docker = function docker() {};

  docker.addComponent = function addComponent(component, key) {
    validateComponent(component);
    docker.removeComponent(component);

    // component.dockConfig can be undefined, a function or an object:
    // if undefined: use default values from dockConfig()
    // if function: use the function
    // if object: wrap in dockConfig() function
    components.push({
      instance: component,
      key,
      config: typeof component.dockConfig === 'function' ? component.dockConfig : dockConfig(component.dockConfig)
    });
  };

  docker.removeComponent = function removeComponent(component) {
    const idx = components.map(c => c.instance).indexOf(component);
    if (idx > -1) {
      components.splice(idx, 1);
    }
  };

  docker.layout = function layout(container) {
    const [logicalContainerRect, containerRect] = resolveLayout(container, settings);
    checkShowSettings(components, hiddenComponents, settings, logicalContainerRect);
    const reduced = reduceLayoutRect(logicalContainerRect, components, hiddenComponents, settings);
    positionComponents(components, logicalContainerRect, reduced, containerRect);
    return {
      visible: components.map(c => c.instance),
      hidden: hiddenComponents
    };
  };

  docker.settings = function settingsFn(s) {
    settings = resolveSettings(s);
  };

  return docker;
}
