import {
  getPropsInfo,
  findField
} from './util';

export default function transformStraight(config, cube, cache) {
  const cfgs = Array.isArray(config) ? config : [config];
  let dataItems = [];
  cfgs.forEach((cfg) => {
    if (cfg.field) {
      const f = findField(cfg.field, { cube, cache });
      if (!f) {
        throw Error(`Field '${cfg.field}' not found`);
      }
      const { props, main } = getPropsInfo(cfg, cube, cache);
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
          if (p.source) {
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
