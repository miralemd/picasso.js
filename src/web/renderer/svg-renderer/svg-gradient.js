import { degreesToPoints } from '../../../core/utils/math';
import { hashObject } from '../../../core/utils/crypto';

let gradients = [];
let gradientHashMap = {};

/**
 * If this attr (fill or stroke) has a gradient, apply it.
 *
 * @param  {Object} item Item with item[attr]
 * @param  {String} attr The attribute to search for gradient (fill or stroke)
 * @param  {String} url  URL for handling base href
 */
function checkGradient(item = {}, attr = 'fill', url = '') {
  let gradientHash = hashObject(item[attr]);
  let gradientId = '';

  if (gradientHashMap[gradientHash] !== undefined) {
    gradientId = gradientHashMap[gradientHash];
  } else {
    let { orientation, degree, stops = [] } = item[attr];
    let gradient = {};

    if (degree === undefined) {
      degree = 90;
    }

    // Default to linear
    if (orientation === 'radial') {
      gradient.type = 'radialGradient';
    } else {
      gradient = degreesToPoints(degree);
      gradient.type = 'linearGradient';
    }

    gradient.id = `picasso-gradient-${gradientHash}`;
    gradient.children = stops.map(({ offset, color, opacity }) => ({
      type: 'stop',
      offset: `${offset * 100}%`,
      style: `stop-color:${color};stop-opacity:${opacity || 1}`
    }));

    gradients.push(gradient);
    gradientHashMap[gradientHash] = gradient.id;
    gradientId = gradient.id;
  }

  return `url(${url}#${gradientId})`;
}

/**
 * Reset the gradients between rendering
 */
export function resetGradients() {
  gradients = [];
  gradientHashMap = {};
}

/**
 * Process gradient items
 *
 * @param  {Array} items Items to create gradients (if applicable) for
 * @return {Array}       Modified items
 */
export function processGradients(items) {
  let url = '';
  if (typeof window !== 'undefined') {
    url = window.location.href.split('#')[0];
  }

  if (items && items.length) {
    let item = null;
    for (let i = 0, len = items.length; i !== len; i++) {
      item = items[i];
      if (item.children) {
        processGradients(item.children);
      } else if (item.fill || item.stroke) {
        if (item.fill && typeof item.fill === 'object' && item.fill.type === 'gradient') {
          item.fill = checkGradient(item, 'fill', url);
        }
        if (item.stroke && typeof item.stroke === 'object' && item.stroke.type === 'gradient') {
          item.stroke = checkGradient(item, 'stroke', url);
        }
      }
    }
  }

  if (gradients.length) {
    return [{
      type: 'defs',
      children: gradients
    }].concat(items);
  }

  return items;
}
