import config from '../../../config';
import sceneFactory from '../../../core/scene-graph/scene';
import { registry } from '../../../core/utils/registry';
import { measureText } from '../text-metrics';

const reg = registry();

function dpiScale(g) {
  const dpr = typeof window === 'undefined' ? 1 : window.devicePixelRatio || 1;
  const backingStorePixelRatio = g.webkitBackingStorePixelRatio ||
    g.mozBackingStorePixelRatio ||
    g.msBackingStorePixelRatio ||
    g.oBackingStorePixelRatio ||
    g.backingStorePixelRatio || 1;
  return dpr / backingStorePixelRatio;
}

function resolveMatrix(p, g) {
  g.setTransform(p[0][0], p[1][0], p[0][1], p[1][1], p[0][2], p[1][2]);
}

function applyContext(g, s, shapeToCanvasMap) {
  shapeToCanvasMap.forEach((cmd) => {
    const shapeCmd = cmd[0];
    const canvasCmd = cmd[1];
    if (shapeCmd in s && g[canvasCmd] !== s[shapeCmd]) {
      g[canvasCmd] = s[shapeCmd];
    }
  });
}

function renderShapes(shapes, g, shapeToCanvasMap) {
  shapes.forEach((s) => {
    g.save();
    applyContext(g, s, shapeToCanvasMap);

    if (s.modelViewMatrix) {
      resolveMatrix(s.modelViewMatrix.elements, g);
    }

    if (reg.has(s.type)) {
      reg.get(s.type)(s, {
        g,
        doFill: 'fill' in s,
        doStroke: 'stroke' in s && s['stroke-width'] !== 0
      });
    }
    if (s.children) {
      renderShapes(s.children, g, shapeToCanvasMap);
    }
    g.restore();
  });
}

export function renderer(sceneFn = sceneFactory) {
  let el;
  let scene;
  const rect = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    scaleRatio: {
      x: 1,
      y: 1
    }
  };
  const shapeToCanvasMap = [
    ['fill', 'fillStyle'],
    ['stroke', 'strokeStyle'],
    ['opacity', 'globalAlpha'],
    ['globalAlpha', 'globalAlpha'],
    ['stroke-width', 'lineWidth']
  ];

  const canvasRenderer = () => {};

  canvasRenderer.element = () => el;

  canvasRenderer.root = () => el;

  canvasRenderer.appendTo = (element) => {
    if (!el) {
      el = element.ownerDocument.createElement('canvas');
      el.style.position = 'absolute';
      el.style['-webkit-font-smoothing'] = 'antialiased';
      el.style['-moz-osx-font-smoothing'] = 'antialiased';
    }

    element.appendChild(el);
  };

  canvasRenderer.render = (shapes) => {
    if (!el) {
      return config.Promise.reject();
    }

    const g = el.getContext('2d');
    const dpiRatio = dpiScale(g);
    const scaleX = rect.scaleRatio.x;
    const scaleY = rect.scaleRatio.y;
    el.style.left = `${Math.round(rect.x * scaleX)}px`;
    el.style.top = `${Math.round(rect.y * scaleY)}px`;
    el.style.width = `${Math.round(rect.width * scaleX)}px`;
    el.style.height = `${Math.round(rect.height * scaleY)}px`;
    el.width = Math.round(rect.width * dpiRatio * scaleX);
    el.height = Math.round(rect.height * dpiRatio * scaleY);

    const sceneContainer = {
      type: 'container',
      children: shapes
    };

    if (dpiRatio !== 1 || scaleX !== 1 || scaleY !== 1) {
      sceneContainer.transform = `scale(${dpiRatio * scaleX}, ${dpiRatio * scaleY})`;
    }

    scene = sceneFn({ items: [sceneContainer], dpi: dpiRatio });
    renderShapes(scene.children, g, shapeToCanvasMap);

    return config.Promise.resolve();
  };

  canvasRenderer.clear = () => {
    if (!el) {
      return;
    }
    el.width = el.width;
  };

  canvasRenderer.size = ({ x, y, width, height, scaleRatio } = {}) => {
    rect.x = isNaN(x) ? rect.x : x;
    rect.y = isNaN(y) ? rect.y : y;
    rect.width = isNaN(width) ? rect.width : width;
    rect.height = isNaN(height) ? rect.height : height;
    if (typeof scaleRatio !== 'undefined') {
      rect.scaleRatio.x = isNaN(scaleRatio.x) ? rect.scaleRatio.x : scaleRatio.x;
      rect.scaleRatio.y = isNaN(scaleRatio.y) ? rect.scaleRatio.y : scaleRatio.y;
    }

    return rect;
  };

  canvasRenderer.destroy = () => {
    if (el) {
      if (el.parentElement) {
        el.parentElement.removeChild(el);
      }
      el = null;
    }
    scene = null;
  };

  canvasRenderer.measureText = ({ text, fontSize, fontFamily }) =>
     measureText({ text, fontSize, fontFamily })
  ;

  return canvasRenderer;
}

export function register(type, renderFn) {
  reg.add(type, renderFn);
}
