import resolve from './json-path-resolver';
import field from './field';

import {
  findField,
  getPropsInfo
} from './util';

const filters = {
  numeric: values => values.filter(v => typeof v === 'number' && !isNaN(v))
};

function createFields(matrix, { cache }) {
  if (!matrix) {
    return;
  }
  const headers = matrix[0]; // assume headers are in first row TODO - add headers config

  const content = matrix.slice(1);

  headers.forEach((a, i) => {
    const values = resolve(`//${i}`, content);
    const numericValues = filters.numeric(values);
    const isMeasure = numericValues.length > 0;
    const type = isMeasure ? 'measure' : 'dimension';
    const min = isMeasure ? Math.min(...numericValues) : NaN;
    const max = isMeasure ? Math.max(...numericValues) : NaN;
    // TODO Deal with tags

    cache.fields.push(field({
      title: headers[i],
      values,
      min,
      max,
      type,
      value: v => v
    }));
  });
}

function extract(config, rawData, cache) {
  const cfgs = Array.isArray(config) ? config : [config];
  let dataItems = [];
  cfgs.forEach((cfg) => {
    if (typeof cfg.field !== 'undefined') {
      const f = findField(cfg.field, { cache });
      if (!f) {
        throw Error(`Field '${cfg.field}' not found`);
      }
      const { props, main } = getPropsInfo(cfg, rawData, cache);
      const propsArr = Object.keys(props);

      const track = !!cfg.trackBy;
      const tracker = {};
      const trackedItems = [];
      let trackId;

      const items = f.items().map((v, idx) => {
        const ret = {
          value: typeof main.value === 'function' ? main.value(v) : typeof main.value !== 'undefined' ? main.value : v,  // eslint-disable-line no-nested-ternary
          source: {
            field: cfg.field
          }
        };

        // loop through all props that need to be mapped and
        // assign 'value' and 'source' to each property
        propsArr.forEach((prop) => {
          const p = props[prop];
          const value = p.field ? p.field.items()[idx] : v;
          ret[prop] = {
            value: typeof p.value === 'function' ? p.value(value) : typeof p.value !== 'undefined' ? p.value : value  // eslint-disable-line no-nested-ternary
          };
          if (typeof p.source !== 'undefined') {
            ret[prop].source = { field: p.source };
          }
        });

        // collect items based on the trackBy value
        // items with the same trackBy value are placed in an array and reduced later
        if (track) {
          trackId = v[cfg.trackBy];
          let trackedItem = tracker[trackId];
          if (!trackedItem) {
            trackedItem = tracker[trackId] = {
              items: [],
              id: trackId
            };
            trackedItems.push(trackedItem);
          }
          trackedItem.items.push(ret);
        }

        return ret;
      });

      // reduce if items have been grouped
      if (track) {
        dataItems.push(...trackedItems.map((t) => {
          const ret = {};
          propsArr.forEach((prop) => {
            let values = t.items.map(item => item[prop].value);
            const reduce = props[prop].reduce;
            ret[prop] = {
              value: reduce ? reduce(values) : values
            };
            if (t.items[0][prop].source) {
              ret[prop].source = t.items[0][prop].source;
            }
          });
          return ret;
        }));
      } else {
        dataItems.push(...items);
      }
    }
  });
  return dataItems;
}

/**
 * Create a new dataset with default settings
 * @alias dataset
 * @memberof picasso.data
 * @ignore
 * @return {dataset}
 */
export default function dataset(matrix) {
  const cache = {
    fields: []
  };

  const data = {
    raw: () => matrix,
    field: query => findField(query, {
      cache,
      matrix
    }),
    extract: config => extract(config, matrix, cache),
    hierarchy: () => null
  };

  createFields(matrix, {
    cache
  });

  return data;
}
