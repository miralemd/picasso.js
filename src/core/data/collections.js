import extract from './extractor';

function create(config, d, opts, extractor = extract) {
  const collections = {};

  (config || []).forEach((cfg) => {
    if (!cfg.key) {
      throw new Error('Data collection is missing "key" property');
    }
    if (typeof cfg.data === 'object' && 'collection' in cfg.data) {
      throw new Error('Data config for collections may not reference other collections');
    }
    collections[cfg.key] = extractor(cfg.data, d, opts);
  });

  const fn = (key) => {
    if (key in collections) {
      return collections[key];
    }
    throw new Error(`Unknown data collection: ${key}`);
  };

  return fn;
}

export {
  create as default
};
