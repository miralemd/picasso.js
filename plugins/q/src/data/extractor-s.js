import {
  getPropsInfo
} from './util';

function getFieldAccessor(field, page, { cache }) {
  if (!field) {
    return -1;
  }
  let fieldIdx = cache.fields.indexOf(field);
  let attrIdx = -1;
  let attrDimIdx = -1;
  if (fieldIdx === -1) {
    for (let i = 0; i < cache.attributeDimensionFields.length; i++) {
      attrDimIdx = cache.attributeDimensionFields[i] ? cache.attributeDimensionFields[i].indexOf(field) : -1;
      if (attrDimIdx !== -1) {
        fieldIdx = i;
        break;
      }
    }
  }
  if (fieldIdx === -1) {
    for (let i = 0; i < cache.attributeExpressionFields.length; i++) {
      attrIdx = cache.attributeExpressionFields[i] ? cache.attributeExpressionFields[i].indexOf(field) : -1;
      if (attrIdx !== -1) {
        fieldIdx = i;
        break;
      }
    }
  }

  fieldIdx -= page.qArea.qLeft;
  if (fieldIdx < 0 || fieldIdx >= page.qArea.qWidth) {
    // throw new Error('Field out of range');
    return -1;
  }

  let path = `row[${fieldIdx}]`;

  if (attrDimIdx >= 0) {
    return Function('row', `return ${path}.qAttrDims.qValues[${attrDimIdx}];`); // eslint-disable-line no-new-func
  } else if (attrIdx >= 0) {
    return Function('row', `return ${path}.qAttrExps.qValues[${attrIdx}];`); // eslint-disable-line no-new-func
  }

  return Function('row', `return ${path};`); // eslint-disable-line no-new-func
}

// TODO - handle 'other' value
// const specialTextValues = {
//   '-3': (meta) => {
//     if ('othersLabel' in meta) {
//       return meta.othersLabel;
//     }
//     return '';
//   }
// };

function datumExtract(propCfg, cell, {
  key
}) {
  // {
  //   value: typeof main.value === 'function' ? main.value(mainCell) : typeof main.value !== 'undefined' ? main.value : mainCell,  // eslint-disable-line no-nested-ternary
  //   source: {
  //     field: cfg.field
  //   }
  // }

  const datum = {
    value: typeof propCfg.value === 'function' ? propCfg.value(cell) : typeof propCfg.value !== 'undefined' ? propCfg.value : cell  // eslint-disable-line no-nested-ternary
  };
  if (propCfg.source) {
    datum.source = {
      key,
      field: propCfg.source
    };
  }

  return datum;
}

export default function extract(config, dataset, cache) {
  const cfgs = Array.isArray(config) ? config : [config];
  let dataItems = [];
  cfgs.forEach((cfg) => {
    if (cfg.field) {
      const cube = dataset.raw();
      const sourceKey = dataset.key();
      const f = typeof cfg.field === 'object' ? cfg.field : dataset.field(cfg.field);
      if (!f) {
        throw Error(`Field '${cfg.field}' not found`);
      }
      const { props, main } = getPropsInfo(cfg, cube, cache);
      const propsArr = Object.keys(props);

      const track = !!cfg.trackBy;
      const tracker = {};
      const trackedItems = [];
      const items = [];
      let trackId;

      cube.qDataPages.forEach((page) => {
        const fn = getFieldAccessor(f, page, { cache });
        if (fn === -1) {
          return;
        }
        page.qMatrix.forEach((row, i) => {
          const rowIdx = page.qArea.qTop + i;
          const mainCell = { qRow: rowIdx, ...fn(row) };
          const ret = datumExtract(main, mainCell, { key: sourceKey });

          // loop through all props that need to be mapped and
          // assign 'value' and 'source' to each property
          propsArr.forEach((prop) => {
            const p = props[prop];
            let propCell = mainCell;
            if (p.field) {
              const propCellFn = getFieldAccessor(p.field, page, { cache });
              if (propCellFn === -1) {
                return;
              }
              propCell = { qRow: rowIdx, ...propCellFn(row) };
            }
            ret[prop] = datumExtract(p, propCell, { key: sourceKey });
          });

          // collect items based on the trackBy value
          // items with the same trackBy value are placed in an array and reduced later
          if (track) {
            trackId = mainCell[cfg.trackBy];
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

          items.push(ret);
        });
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
