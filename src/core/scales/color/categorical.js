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
    .unknown(settings.unknown || UNKNOWN_COLOR);

  let range = (settings.range || scaleCategorical.range).slice();
  if (settings.explicit && settings.explicit.domain) {
    let domain = s.domain().slice();
    let explicitDomain = (settings.explicit.domain || []);
    if (explicitDomain.length) {
      // duplicate range values to cover entire domain
      let numCopies = Math.floor(domain.length / range.length);
      for (let i = 1; i < numCopies + 1; i *= 2) {
        range = range.concat(range);
      }
      // inject explicit colors
      let explicitRange = (settings.explicit.range || []);
      const order = explicitDomain.map((d, i) => [domain.indexOf(d), d, explicitRange[i]]).sort((a, b) => a[0] - b[0]);
      order.forEach((v) => {
        const idx = domain.indexOf(v[1]);
        if (idx !== -1) {
          range.splice(idx, 0, v[2]);
        }
      });
      // cutoff excess range values
      range.length = domain.length;
    }
  }
  s.range(range);

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
