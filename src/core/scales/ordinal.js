import {
  scaleOrdinal
} from 'd3-scale';

 /**
 * @alias scaleOrdinal
 * @memberof picasso
 * @param { Object } settings
 * @param { field[] } [fields]
 * @param { dataset } dataset
 * @return { ordinal }
 */
export default function ordinal(settings = {}, dataset) {
  /**
   * An augmented {@link https://github.com/d3/d3-scale#_ordinal|d3 ordinal scale}
   * @alias ordinal
   * @param { Object }
   * @return { number }
   */
  const fn = scaleOrdinal();
  // let domainToDataMapping = {};
  // let dataValues;
  // let trackBy = settings.trackBy || 'label';

  const valueFn = typeof settings.value === 'function' ? settings.value : d => d.value;
  const labelFn = typeof settings.label === 'function' ? settings.label : valueFn;
  const items = dataset.items || [];
  let values = [];
  let labels = [];
  for (let i = 0; i < items.length; i++) {
    let v = valueFn(items[i]);
    if (values.indexOf(v) === -1) {
      values.push(v);
      labels.push(labelFn(items[i]));
    }
  }

  fn.data = () => dataset;

  fn.labels = () => labels;

  // if (fields && fields[0]) {
  //   dataValues = fields[0].values();
  //   dataValues.forEach((v) => {
  //     domainToDataMapping[v[trackBy]] = v;
  //   });
  // }

  // fn.data = function data(domainValue) {
  //   if (domainValue in domainToDataMapping) {
  //     let d = domainToDataMapping[domainValue];
  //     return {
  //       value: d[trackBy],
  //       source: {
  //         field: settings.source,
  //         type: 'qual'
  //       }
  //     };
  //   }
  //   return {};
  // };

  // fn.label = function label(domainValue) {
  //   if (domainValue in domainToDataMapping) {
  //     let d = domainToDataMapping[domainValue];
  //     return d.label;
  //   }
  //   return '';
  // };

  if (settings.range) {
    fn.range(settings.range);
  }

  if (settings.domain) {
    fn.domain(settings.domain);
  } else {
    fn.domain(values);
  }
  return fn;
}
