import component from './line';

/**
 * @typedef {object} component--line
 * @definition
 */

/**
 * @type {string}
 * @memberof component--line
 */
const type = 'line';

export default function pointMarker(picasso) {
  picasso.component(type, component);
}

