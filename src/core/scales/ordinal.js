import {
  scaleOrdinal
} from 'd3-scale';

// function unique(values) {
//   const exists = {};
//   return values.filter((v) => {
//     if (exists[v.id]) {
//       return false;
//     }
//     return (exists[v.id] = true);
//   });
// }

 /**
 * @alias scaleOrdinal
 * @memberof picasso
 * @param { Object } settings
 * @param { field[] } [fields]
 * @param { dataset } dataset
 * @return { ordinal }
 */
export default function ordinal(settings = {}, fields) {
  /**
   * An augmented {@link https://github.com/d3/d3-scale#_ordinal|d3 ordinal scale}
   * @alias ordinal
   * @param { Object }
   * @return { number }
   */
  const fn = scaleOrdinal();
  let domainToDataMapping = {};
  let dataValues;
  let trackBy = settings.trackBy || 'label';

  if (fields && fields[0]) {
    dataValues = fields[0].values();
    dataValues.forEach((v) => {
      domainToDataMapping[v[trackBy]] = v;
    });
  }

  fn.data = function data(domainValue) {
    if (domainValue in domainToDataMapping) {
      let d = domainToDataMapping[domainValue];
      return {
        value: d[trackBy],
        source: {
          field: settings.source,
          type: 'qual'
        }
      };
    }
    return {};
  };

  fn.label = function label(domainValue) {
    if (domainValue in domainToDataMapping) {
      let d = domainToDataMapping[domainValue];
      return d.label;
    }
    return '';
  };

  if (settings.range) {
    fn.range(settings.range);
  }

  if (settings.domain) {
    fn.domain(settings.domain);
  } else if (dataValues) {
    const ids = dataValues.map(d => d[trackBy]);
    fn.domain(ids);
  }
  return fn;
}
