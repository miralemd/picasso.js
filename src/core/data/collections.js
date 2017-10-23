import extract from './extractor';

function create(config, d, opts) {
  const collections = {};

  (config || []).forEach((cfg) => {
    if (!cfg.key) {
      throw new Error('Data collection is missing "key" property');
    }
    if ('collection' in cfg.data) {
      throw new Error('Data config for collections may not reference other collections');
    }
    collections[cfg.key] = extract(cfg.data, d, opts);
  });

  const fn = (key) => {
    if (collections[key]) {
      return collections[key];
    }
    throw new Error(`Unknown data collection: ${key}`);
  };

  return fn;
}

export {
  create as default
};
