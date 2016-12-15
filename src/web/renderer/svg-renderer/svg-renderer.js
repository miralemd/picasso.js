import config from '../../../config';
import { tree as treeFactory } from './svg-tree';
import { svgNs } from './svg-nodes';
import scene from '../../../core/scene-graph/scene';
import { measureText } from '../text-metrics';

export default function renderer(treeFn = treeFactory, ns = svgNs, sceneFn = scene) {
  let tree = treeFn();
  let el;
  let group;
  let rect = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    scaleRatio: {
      x: 1,
      y: 1
    }
  };

  const svg = function () {};

  svg.element = () => el;

  svg.root = () => group;

  svg.appendTo = (element) => {
    if (!el) {
      el = element.ownerDocument.createElementNS(ns, 'svg');
      el.style.position = 'absolute';
      el.style['-webkit-font-smoothing'] = 'antialiased';
      el.style['-moz-osx-font-smoothing'] = 'antialiased';
      el.setAttribute('xmlns', ns);
      group = element.ownerDocument.createElementNS(ns, 'g');
      el.appendChild(group);
    }
    element.appendChild(el);
  };

  svg.render = (items) => {
    if (!el) {
      return config.Promise.reject();
    }

    const scaleX = rect.scaleRatio.x;
    const scaleY = rect.scaleRatio.y;
    el.style.left = `${Math.round(rect.x * scaleX)}px`;
    el.style.top = `${Math.round(rect.y * scaleY)}px`;
    el.setAttribute('width', Math.round(rect.width * scaleX));
    el.setAttribute('height', Math.round(rect.height * scaleY));

    svg.clear();

    const sceneContainer = {
      type: 'container',
      children: items
    };

    if (scaleX !== 1 || scaleY !== 1) {
      sceneContainer.transform = `scale(${scaleX}, ${scaleY})`;
    }
    const s = sceneFn({ items: [sceneContainer] });
    tree.render(s.children, group);

    return config.Promise.resolve();
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

  svg.size = ({ x, y, width, height, scaleRatio } = {}) => {
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

  svg.measureText = ({ text, fontSize, fontFamily }) => measureText({ text, fontSize, fontFamily });

  return svg;
}
