import {
  scaleOrdinal
} from 'd3-scale';

function unique(values) {
  const exists = {};
  return values.filter((v) => {
    if (exists[v.id]) {
      return false;
    }
    return (exists[v.id] = true);
  });
}

 /**
 * @alias scaleOrdinal
 * @memberof picasso
 * @param { Object } settings
 * @param { field[] } [fields]
 * @param { dataset } dataset
 * @return { ordinal }
 */
export default function ordinal(settings = {}, fields, dataset) {
  /**
   * An augmented {@link https://github.com/d3/d3-scale#_ordinal|d3 ordinal scale}
   * @alias ordinal
   * @param { Object }
   * @return { number }
   */
  const fn = scaleOrdinal();

  fn.data = function data() {
    return dataset ? dataset.map(
      {
        self: { source: settings.source, type: 'qual' }
      },
      { source: settings.source }) : [];
  };

  if (settings.range) {
    fn.range(settings.range);
  }

  if (settings.domain) {
    fn.domain(settings.domain);
  } else if (fields && fields[0]) {
    const values = fields[0].values();
    const uniq = unique(values).map(v => v.label);

    fn.domain(uniq);
  }
  return fn;
}
