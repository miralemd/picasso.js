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
      element.textContent = ellipsText(item.attrs, measureText);
      let dir = detectTextDirection(item.attrs.text);
      if (dir === 'rtl') {
        element.setAttribute('direction', 'rtl');
        element.setAttribute('text-anchor', flipTextAnchor(element.getAttribute('text-anchor'), dir));
      }
      continue;
    } else {
      element.setAttribute(attr, item.attrs[attr]);
    }
  }
};

export {
  svgNs,
  creator,
  maintainer,
  destroyer
};
