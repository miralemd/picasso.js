import config from '../../../config';
import { scene as sceneFactory } from '../../../core/scene-graph/scene';
import { registry } from '../../../core/utils/registry';
import { measureText } from './text-metrics';

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
        doStroke: 'stroke' in s && g.lineWidth !== 0
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
  const rect = { x: 0, y: 0, width: 0, height: 0 };
  const shapeToCanvasMap = [
    ['fill', 'fillStyle'],
    ['stroke', 'strokeStyle'],
    ['opacity', 'globalAlpha'],
    ['globalAlpha', 'globalAlpha'],
    ['stroke-width', 'lineWidth']
  ];

  const canvasRenderer = function () {};

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
    el.style.left = `${rect.x}px`;
    el.style.top = `${rect.y}px`;
    el.style.width = `${rect.width}px`;
    el.style.height = `${rect.height}px`;
    el.width = rect.width * dpiRatio;
    el.height = rect.height * dpiRatio;

    if (dpiRatio === 1) {
      scene = sceneFn(shapes);
    } else {
      const scaledShapes = [{
        type: 'container',
        children: shapes,
        transform: `scale(${dpiRatio}, ${dpiRatio})`
      }];
      scene = sceneFn(scaledShapes);
    }

    renderShapes(scene.children, g, shapeToCanvasMap);

    return config.Promise.resolve();
  };

  canvasRenderer.clear = () => {
    if (!el) {
      return;
    }
    el.width = el.width;
  };

  canvasRenderer.size = ({ x, y, width, height } = {}) => {
    rect.x = isNaN(x) ? rect.x : x;
    rect.y = isNaN(x) ? rect.y : y;
    rect.width = isNaN(width) ? rect.width : width;
    rect.height = isNaN(height) ? rect.height : height;
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
