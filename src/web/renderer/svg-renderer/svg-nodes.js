import { measureText } from '../text-metrics';
import { ellipsText } from '../text-manipulation';
import { detectTextDirection, flipTextAnchor } from '../../../core/utils/rtl-util';

const svgNs = 'http://www.w3.org/2000/svg';

const creator = (type, parent) => {
  if (!type || typeof type !== 'string') {
    throw new Error(`Invalid type: ${type}`);
  }

  const el = parent.ownerDocument.createElementNS(svgNs, type === 'container' ? 'g' : type);

  parent.appendChild(el);
  return el;
};

const destroyer = (el) => {
  if (el.parentNode) {
    el.parentNode.removeChild(el);
  }
};

const maintainer = (element, item) => {
  for (const attr in item.attrs) {
    if (attr === 'text') {
      element.setAttribute('style', 'white-space: pre');
      element.textContent = ellipsText(item.attrs, measureText);
      const dir = detectTextDirection(item.attrs.text);
      if (dir === 'rtl') {
        element.setAttribute('direction', 'rtl');
        element.setAttribute('dir', 'rtl');
        element.setAttribute('text-anchor', flipTextAnchor(element.getAttribute('text-anchor'), dir));
      }
    } else {
      element.setAttribute(attr, item.attrs[attr]);
    }
  }

  if (typeof item.data === 'string' || typeof item.data === 'number' || typeof item.data === 'boolean') {
    element.setAttribute('data', item.data);
  } else if (typeof item.data === 'object' && item.data !== null) {
    for (const d in item.data) {
      if (typeof item.data[d] === 'string' || typeof item.data[d] === 'number' || typeof item.data[d] === 'boolean') {
        element.setAttribute(`data-${d}`, item.data[d]);
      }
    }
  }
};

export {
  svgNs,
  creator,
  maintainer,
  destroyer
};
