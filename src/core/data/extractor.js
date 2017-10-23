import stack from './stack';

export default function extract(dataConfig, data = {}, opts = {}) {
  const extracted = {
    // items: [],
    // fields: [],
    // source: null,
    // value: null,
    // label: null,
    // children: null,
    // root: null,
    // graph: null
  };

  const logger = opts.logger;

  if (Array.isArray(dataConfig)) { // if data is an array, assume it's manual data input -> normalize
    extracted.items = dataConfig.map(v => ({ value: v }));
  } else if (dataConfig) {
    if ('collection' in dataConfig) {
      return data.collection(dataConfig.collection);
    }
    const source = data.dataset ? data.dataset(dataConfig.source) : null;
    let valueFn = dataConfig.value || (d => d);
    // let labelFn = dataConfig.label || (d => d);

    if (dataConfig.groupBy || dataConfig.mapTo) { // DEPRECATION
      logger.warn('Deprecated "data" configuration', dataConfig);
      extracted.items = [];
    } else if (dataConfig.hierarchy) {
      extracted.root = source.hierarchy ? source.hierarchy(dataConfig.hierarchy) : null;
    } else if (dataConfig.items) {
      extracted.items = dataConfig.items.map(v => ({ value: valueFn(v) }));
    } else if (source) {
      extracted.source = source;
      if (dataConfig.extract) {
        extracted.items = source.extract(dataConfig.extract);
        const sourceFields = [];
        (Array.isArray(dataConfig.extract) ? dataConfig.extract : [dataConfig.extract]).forEach((ex) => {
          if (ex.field) {
            sourceFields.push(source.field(ex.field));
          }
        });
        if (sourceFields.length) {
          extracted.fields = sourceFields;
        }
      } else if (dataConfig.fields) {
        dataConfig.fields.forEach((id) => {
          const f = source.field(id);
          if (f) {
            if (!extracted.fields) {
              extracted.fields = [];
            }
            extracted.fields.push(f);
          }
        });
      } else if (typeof dataConfig.field !== 'undefined') {
        const f = source.field(dataConfig.field);
        if (f) {
          if (!extracted.fields) {
            extracted.fields = [];
          }
          extracted.fields.push(f);
          if (!('value' in dataConfig)) {
            valueFn = f.value || (v => v);
            extracted.value = valueFn;
          }
          extracted.items = f.items().map(v => ({ value: valueFn(v), source: { field: dataConfig.field } }));
          // TODO - add source: { key: dataConfig.source, field: dataConfig.field, data: v }
        }
      }
    }

    if (extracted.items && dataConfig.map) {
      extracted.items = extracted.items.map(dataConfig.map);
    }
  }

  if (dataConfig && dataConfig.stack) {
    stack(extracted, dataConfig.stack);
  }
  return extracted;
}
