import pointMarkerComponent from './point';

/**
 * @typedef {object} component--point-marker
 * @definition
 */

/**
 * @type {string}
 * @memberof component--point-marker
 */
const type = 'point-marker';

export default function pointMarker(picasso) {
  picasso.component(type, pointMarkerComponent);
}

