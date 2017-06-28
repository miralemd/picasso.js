import sceneFactory from '../../../core/scene-graph/scene';
import { registry } from '../../../core/utils/registry';
import { measureText } from '../text-metrics';
import createCanvasGradient from './canvas-gradient';
import createRendererBox from '../renderer-box';

const reg = registry();

function toLineDash(p) {
  if (Array.isArray(p)) {
    return p;
  } else if (typeof p === 'string') {
    if (p.indexOf(',') !== -1) {
      return p.split(',');
    }
    return p.split(' ');
  }
  return [];
}

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

function applyContext(g, s, shapeToCanvasMap, computed = {}) {
  const computedKeys = Object.keys(computed);

  for (let i = 0, len = shapeToCanvasMap.length; i < len; i++) {
    let cmd = shapeToCanvasMap[i];

    const shapeCmd = cmd[0];
    const canvasCmd = cmd[1];
    const convertCmd = cmd[2];

    if ((shapeCmd in s.attrs && !(canvasCmd in computed)) && g[canvasCmd] !== s.attrs[shapeCmd]) {
      const val = convertCmd ? convertCmd(s.attrs[shapeCmd]) : s.attrs[shapeCmd];
      if (typeof g[canvasCmd] === 'function') {
        g[canvasCmd](val);
      } else {
        g[canvasCmd] = val;
      }
    }
  }

  for (let i = 0, len = computedKeys.length; i < len; i++) {
    const key = computedKeys[i];
    g[key] = computed[key];
  }
}

function renderShapes(shapes, g, shapeToCanvasMap) {
  for (let i = 0, len = shapes.length; i < len; i++) {
    let shape = shapes[i];
    let computed = {};
    g.save();

    // Gradient check
    if (shape.attrs && (shape.attrs.fill || shape.attrs.stroke)) {
      if (shape.attrs.fill && typeof shape.attrs.fill === 'object' && shape.attrs.fill.type === 'gradient') {
        computed.fillStyle = createCanvasGradient(g, shape.attrs, shape.attrs.fill);
      }
      if (shape.attrs.stroke && typeof shape.attrs.stroke === 'object' && shape.attrs.stroke.type === 'gradient') {
        computed.strokeStyle = createCanvasGradient(g, shape.attrs, shape.attrs.stroke);
      }
    }

    applyContext(g, shape, shapeToCanvasMap, computed);

    if (shape.modelViewMatrix) {
      resolveMatrix(shape.modelViewMatrix.elements, g);
    }

    if (reg.has(shape.type)) {
      reg.get(shape.type)(shape.attrs, {
        g,
        doFill: 'fill' in shape.attrs,
        doStroke: 'stroke' in shape.attrs && shape.attrs['stroke-width'] !== 0
      });
    }
    if (shape.children) {
      renderShapes(shape.children, g, shapeToCanvasMap);
    }
    g.restore();
  }
}

export function renderer(sceneFn = sceneFactory) {
  let el;
  let scene;
  let hasChangedRect = false;
  let rect = createRendererBox();
  const shapeToCanvasMap = [
    ['fill', 'fillStyle'],
    ['stroke', 'strokeStyle'],
    ['opacity', 'globalAlpha'],
    ['globalAlpha', 'globalAlpha'],
    ['stroke-width', 'lineWidth'],
    ['stroke-dasharray', 'setLineDash', toLineDash]
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
      el.style.pointerEvents = 'none';
    }

    element.appendChild(el);

    return el;
  };

  canvasRenderer.render = (shapes) => {
    if (!el) {
      return false;
    }

    const g = el.getContext('2d');
    const dpiRatio = dpiScale(g);
    const scaleX = rect.scaleRatio.x;
    const scaleY = rect.scaleRatio.y;

    if (hasChangedRect) {
      el.style.left = `${Math.round(rect.margin.left + (rect.x * scaleX))}px`;
      el.style.top = `${Math.round(rect.margin.top + (rect.y * scaleY))}px`;
      el.style.width = `${Math.round(rect.width * scaleX)}px`;
      el.style.height = `${Math.round(rect.height * scaleY)}px`;
      el.width = Math.round(rect.width * dpiRatio * scaleX);
      el.height = Math.round(rect.height * dpiRatio * scaleY);
    }

    const sceneContainer = {
      type: 'container',
      children: shapes
    };

    if (dpiRatio !== 1 || scaleX !== 1 || scaleY !== 1) {
      sceneContainer.transform = `scale(${dpiRatio * scaleX}, ${dpiRatio * scaleY})`;
    }

    const newScene = sceneFn({ items: [sceneContainer], dpi: dpiRatio });
    const hasChangedScene = scene ? !newScene.equals(scene) : true;

    const doRender = hasChangedRect || hasChangedScene;
    if (doRender) {
      canvasRenderer.clear();
      renderShapes(newScene.children, g, shapeToCanvasMap);
    }

    hasChangedRect = false;
    scene = newScene;
    return doRender;
  };

  canvasRenderer.itemsAt = options => (scene ? scene.getItemsFrom(options) : []);

  canvasRenderer.findShapes = (selector) => {
    if (scene) {
      return scene.findShapes(selector).map((s) => {
        s.element = canvasRenderer.element();
        return s;
      });
    }
    return [];
  };

  canvasRenderer.clear = () => {
    if (!el) {
      return;
    }
    el.width = el.width;
  };

  /**
   * Set or Get the size definition of the renderer container
   * @param {object} [opts] - Size definition
   * @param {number} [opts.x] - x-coordinate
   * @param {number} [opts.y] - y-coordinate
   * @param {number} [opts.width] - Width
   * @param {number} [opts.height] - Height
   * @param {object} [opts.scaleRatio]
   * @param {number} [opts.scaleRatio.x] - Scale ratio on x-axis
   * @param {number} [opts.scaleRatio.y] - Scale ratio on y-axis
   * @param {object} [opts.margin]
   * @param {number} [opts.margin.left] - Left margin
   * @param {number} [opts.margin.top] - Top margin
   * @return {object} The current size definition
   */
  canvasRenderer.size = (opts) => {
    if (opts) {
      const newRect = createRendererBox(opts);

      if (JSON.stringify(rect) !== JSON.stringify(newRect)) {
        hasChangedRect = true;
        rect = newRect;
      }
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

  /**
   * @param {object} opts
   * @param {string} opts.text - Text to measure
   * @param {string} opts.fontSize - Font size with a unit definition, ex. 'px' or 'em'
   * @param {string} opts.fontFamily - Font family
   * @return {object} Width and height of text
   * @example
   * measureText({
   *  text: 'my text',
   *  fontSize: '12px',
   *  fontFamily: 'Arial'
   * }); // returns { width: 20, height: 12 }
   */
  canvasRenderer.measureText = ({ text, fontSize, fontFamily }) => measureText({ text, fontSize, fontFamily });

  return canvasRenderer;
}

export function register(type, renderFn) {
  reg.add(type, renderFn);
}
