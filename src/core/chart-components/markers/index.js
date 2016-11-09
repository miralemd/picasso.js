import { registry } from '../../utils/registry';
import { point } from './point';
import { box } from './box';

const reg = registry();

reg.register('point', point);
reg.register('box', box);

/**
 * Marker settings
 * @typedef {(marker-point|marker-box)} marker
 */

/**
 * Data reference object
 * @typedef {object} data-ref
 * @property {string} source - Data field
 * @example
 * {
 *   source: "/qDimensionInfo/0"
 * }
 */

export function create(arr, composer) {
  const markers = [];
  arr.forEach((marker) => {
    if (marker.type in reg.registry) {
      markers.push(reg.registry[marker.type](marker, composer));
    }
  });
  return markers;
}
