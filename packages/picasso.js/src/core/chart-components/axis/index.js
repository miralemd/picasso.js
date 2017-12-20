import axisComponent from './axis';

/**
 * @typedef {object} component--axis
 * @definition
 */

/**
 * @type {string}
 * @memberof component--axis
 */

const type = 'axis';

export default function axis(picasso) {
  picasso.component(type, axisComponent);
}
