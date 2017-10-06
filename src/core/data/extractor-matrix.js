import {
  getPropsInfo
} from './util';

function datumExtract(propCfg, cell, {
  key
}) {
  const datum = {
    value: typeof propCfg.value === 'function' ? propCfg.value(cell) : typeof propCfg.value !== 'undefined' ? propCfg.value : cell  // eslint-disable-line no-nested-ternary
  };

  if (propCfg.field) {
    datum.source = {
      key,
      field: propCfg.field.key()
    };
  }

  return datum;
}

export default function extract(config, dataset) {
  const cfgs = Array.isArray(config) ? config : [config];
  let dataItems = [];
  cfgs.forEach((cfg) => {
    if (typeof cfg.field !== 'undefined') {
      const f = dataset.field(cfg.field);
      const sourceKey = dataset.key();
      if (!f) {
        throw Error(`Field '${cfg.field}' not found`);
      }
      const { props, main } = getPropsInfo(cfg, dataset);
      const propsArr = Object.keys(props);

      const track = !!cfg.trackBy;
      const trackFn = typeof cfg.trackBy === 'function' ? cfg.trackBy : null;
      const tracker = {};
      const trackedItems = [];
      let trackId;

      const items = f.items().map((v, idx) => {
        const mainCell = v;
        const ret = datumExtract(main, mainCell, { key: sourceKey });

        // loop through all props that need to be mapped and
        // assign 'value' and 'source' to each property
        propsArr.forEach((prop) => {
          const p = props[prop];
          let propCell = p.field ? p.field.items()[idx] : mainCell;
          ret[prop] = datumExtract(p, propCell, { key: sourceKey });
        });

        // collect items based on the trackBy value
        // items with the same trackBy value are placed in an array and reduced later
        if (track) {
          trackId = trackFn ? trackFn(v) : v[cfg.trackBy];
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
          let mainValues = t.items.map(item => item.value);
          const mainReduce = main.reduce;
          const ret = {
            value: mainReduce ? mainReduce(mainValues) : mainValues,
            source: t.items[0].source
          };
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
