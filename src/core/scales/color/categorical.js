import ordinal from '../ordinal';

const DEFAULT_COLORS = [ // breeze colors
  '#a54343',
  '#d76c6c',
  '#ec983d',
  '#ecc43d',
  '#f9ec86',
  '#cbe989',
  '#70ba6e',
  '#578b60',
  '#79d69f',
  '#26a0a7',
  '#138185',
  '#65d3da'
];
const UNKNOWN_COLOR = '#d2d2d2';
 /**
 * An ordinal scale with the output range set to default colors, as defined by *scaleCategorical.range*
 * @alias scaleCategorical
 * @memberof picasso
 * @param { Object } settings
 * @param { field[] } [fields]
 * @param { dataset } [dataset]
 * @return { ordinal }
 */
export default function scaleCategorical(settings = {}, fields, dataset) {
  const s = ordinal(settings, fields, dataset)
    .unknown(UNKNOWN_COLOR);

  if (!settings.range) {
    s.range(scaleCategorical.range);
  }

  return s;
}

/**
 * Default range of colors
 * @memberof picasso
 * @type {string[]}
 */
scaleCategorical.range = DEFAULT_COLORS.slice();

/**
 * Default color for unknown values
 * @memberof picasso
 * @type {string}
 */
scaleCategorical.unknown = UNKNOWN_COLOR;
