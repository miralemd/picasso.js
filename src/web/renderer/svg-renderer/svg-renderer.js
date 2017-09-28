import { tree as treeFactory } from './svg-tree';
import { svgNs } from './svg-nodes';
import sceneFactory from '../../../core/scene-graph/scene';
import {
  measureText,
  textBounds,
  onLineBreak
} from '../../text-manipulation';
import {
  resetGradients,
  onGradient,
  createDefsNode
} from './svg-gradient';
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

  svg.render = (nodes) => {
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
    nodes.push(createDefsNode());

    const sceneContainer = {
      type: 'container',
      children: nodes
    };

    if (scaleX !== 1 || scaleY !== 1) {
      sceneContainer.transform = `scale(${scaleX}, ${scaleY})`;
    }

    const newScene = sceneFn({
      items: [sceneContainer],
      on: {
        create: [
          onGradient,
          onLineBreak(measureText)
        ]
      }
    });
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

  /**
 * Calculates the bounding rectangle of a text node. Including any potential line breaks.
 * @param {object} node
 * @param {string} node.text - Text to measure
 * @param {number} [node.x=0] - X-coordinate
 * @param {number} [node.y=0] - Y-coordinate
 * @param {number} [node.dx=0] - Delta x-coordinate
 * @param {number} [node.dy=0] - Delta y-coordinate
 * @param {string} [node.anchor='start'] - Text anchor
 * @param {string} [node.fontSize] - Font size
 * @param {string} [node.fontFamily] - Font family
 * @param {string} [node['font-size']] - Font size
 * @param {string} [node['font-family']] - Font family
 * @param {string} [node.wordBreak] - Word-break option
 * @param {number} [node.maxWidth] - Maximum allowed text width
 * @param {number} [node.maxHeight] - Maximum allowed text height. If both maxLines and maxHeight are set, the property that results in the fewest number of lines is used
 * @param {number} [node.maxLines] - Maximum number of lines allowed
 * @param {number} [node.lineHeight=1.2] - Line height
 * @return {object} The bounding rectangle
 */
  svg.textBounds = node => textBounds(node);

  return svg;
}

export function rendererComponent(picasso) {
  picasso.renderer('svg', renderer);
}
