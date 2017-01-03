import config from '../../../config';
import { h, patch } from './vdom';
import { measureText } from '../text-metrics';

const createRect = ({ x, y, width, height, scaleRatio } = {}) => {
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

export default function renderer(opts = {}) {
  const {
    createElement = document.createElement.bind(document)
  } = opts;

  let el;
  let rect = createRect();
  let vnode;

  const dom = function () {};

  dom.element = () => el;

  dom.root = () => el;

  dom.appendTo = (element) => {
    if (!el) {
      el = createElement('div');
      el.style.position = 'absolute';
      el.style['-webkit-font-smoothing'] = 'antialiased';
      el.style['-moz-osx-font-smoothing'] = 'antialiased';
    }
    element.appendChild(el);
    return el;
  };

  dom.render = (node) => {
    if (!el) {
      return config.Promise.reject();
    }

    const scaleX = rect.scaleRatio.x;
    const scaleY = rect.scaleRatio.y;

    el.style.left = `${Math.round(rect.x * scaleX)}px`;
    el.style.top = `${Math.round(rect.y * scaleY)}px`;
    el.setAttribute('width', Math.round(rect.width * scaleX));
    el.setAttribute('height', Math.round(rect.height * scaleY));

    if (vnode) {
      patch(vnode, node);
    } else {
      patch(el, node);
    }
    vnode = node;

    return config.Promise.resolve(true);
  };

  dom.renderArgs = [h]; // Arguments to render functions using the DOM renderer

  dom.clear = () => {
    let first = el.firstChild;

    while (first) {
      el.removeChild(first);
      first = el.firstChild;
    }
  };

  dom.destroy = () => {
    if (el && el.parentElement) {
      el.parentElement.removeChild(el);
    }
    el = null;
  };

  dom.size = (inner) => {
    if (inner) {
      rect = createRect(inner);
    }
    return rect;
  };

  dom.measureText = ({ text, fontSize, fontFamily }) => measureText({ text, fontSize, fontFamily });

  return dom;
}
