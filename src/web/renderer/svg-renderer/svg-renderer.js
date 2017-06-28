import { tree as treeFactory } from './svg-tree';
import { svgNs } from './svg-nodes';
import sceneFactory from '../../../core/scene-graph/scene';
import { measureText } from '../text-metrics';
import { processGradients, resetGradients } from './svg-gradient';
import createRendererBox from '../renderer-box';

export default function renderer(treeFn = treeFactory, ns = svgNs, sceneFn = sceneFactory) {
  const tree = treeFn();
  let el;
  let group;
  let hasChangedRect = false;
  let rect = createRendererBox();
  let scene;

  const svg = function svg() {};

  svg.element = () => el;

  svg.root = () => group;

  svg.appendTo = (element) => {
    if (!el) {
      el = element.ownerDocument.createElementNS(ns, 'svg');
      el.style.position = 'absolute';
      el.style['-webkit-font-smoothing'] = 'antialiased';
      el.style['-moz-osx-font-smoothing'] = 'antialiased';
      el.style.pointerEvents = 'none';
      el.setAttribute('xmlns', ns);
      group = element.ownerDocument.createElementNS(ns, 'g');
      group.style.pointerEvents = 'auto';
      el.appendChild(group);
    }

    element.appendChild(el);

    return el;
  };

  svg.render = (items) => {
    if (!el) {
      return false;
    }

    const scaleX = rect.scaleRatio.x;
    const scaleY = rect.scaleRatio.y;

    if (hasChangedRect) {
      el.style.left = `${Math.round(rect.margin.left + (rect.x * scaleX))}px`;
      el.style.top = `${Math.round(rect.margin.top + (rect.y * scaleY))}px`;
      el.setAttribute('width', Math.round(rect.width * scaleX));
      el.setAttribute('height', Math.round(rect.height * scaleY));
    }

    resetGradients();
    items = processGradients(items);

    const sceneContainer = {
      type: 'container',
      children: items
    };

    if (scaleX !== 1 || scaleY !== 1) {
      sceneContainer.transform = `scale(${scaleX}, ${scaleY})`;
    }

    const newScene = sceneFn({ items: [sceneContainer] });
    const hasChangedScene = scene ? !newScene.equals(scene) : true;

    const doRender = hasChangedRect || hasChangedScene;
    if (doRender) {
      svg.clear();
      tree.render(newScene.children, group);
    }

    hasChangedRect = false;
    scene = newScene;
    return doRender;
  };

  svg.itemsAt = options => (scene ? scene.getItemsFrom(options) : []);

  svg.findShapes = (selector) => {
    if (scene) {
      return scene.findShapes(selector).map((s) => {
        s.element = svg.element();
        return s;
      });
    }
    return [];
  };

  svg.clear = () => {
    if (!group) {
      return svg;
    }
    const g = group.cloneNode(false);
    el.replaceChild(g, group);
    group = g;
    return svg;
  };

  svg.destroy = () => {
    if (el && el.parentElement) {
      el.parentElement.removeChild(el);
    }
    el = null;
    group = null;
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
  svg.size = (opts) => {
    if (opts) {
      const newRect = createRendererBox(opts);

      if (JSON.stringify(rect) !== JSON.stringify(newRect)) {
        hasChangedRect = true;
        rect = newRect;
      }
    }

    return rect;
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
  svg.measureText = ({ text, fontSize, fontFamily }) => measureText({ text, fontSize, fontFamily });

  return svg;
}
