import transformH from './transform-k';
import kExtractor from './extractor-k';
import SExtractor from './extractor-s';
import { findField } from './util';
import field from './field';

function hierarchy(config = {}, cube, cache) {
  if (!cube.qMode === 'K') {
    return null;
  }
  return transformH(config, cube, cache);
}

function extractData(cfg, cube, cache) {
  if (cube.qMode === 'K') {
    return kExtractor(cfg, cube, cache);
  } else if (cube.qMode === 'S') {
    return SExtractor(cfg, cube, cache);
  }
  return [];
}

function createAttrFields(idx, d, {
  cache,
  cube,
  pages,
  fieldExtractor
}) {
  if (d.qAttrDimInfo) {
    cache.attributeDimensionFields[idx] = d.qAttrDimInfo.map(attrDim => (attrDim ? field({
      meta: attrDim,
      cube,
      pages,
      fieldExtractor
    }) : undefined));
  }
  if (d.qAttrExprInfo) {
    cache.attributeExpressionFields[idx] = d.qAttrExprInfo.map(attrExpr => (attrExpr ? field({
      meta: attrExpr,
      cube,
      pages,
      fieldExtractor
    }) : undefined));
  }
}

export default function q({
  key,
  data
} = {}) {
  const cache = {
    attributeDimensionFields: [],
    attributeExpressionFields: [],
    fields: []
  };

  const cube = data;

  if (!cube.qDimensionInfo) { // assume old data format
    throw new Error('The data input is not recognized as a hypercube');
  }

  const pages = cube.qMode === 'K' ? cube.qStackedDataPages : cube.qDataPages;

  let fieldExtractor;

  if (cube.qMode === 'K') {
    fieldExtractor = f => kExtractor({ field: f }, cube, cache);
  } else if (cube.qMode === 'S') {
    fieldExtractor = f => SExtractor({ field: f }, cube, cache);
  } else {
    fieldExtractor = () => []; // TODO - throw unsupported error?
  }

  const dimensions = cube.qDimensionInfo;
  dimensions.forEach((d, i) => {
    cache.fields.push(field({
      meta: d,
      cube,
      pages,
      fieldExtractor
    }));
    createAttrFields(i, d, { cache, cube, pages, fieldExtractor });
  });

  cube.qMeasureInfo.forEach((d, i) => {
    cache.fields.push(field({
      meta: d,
      cube,
      pages,
      fieldExtractor
    }));
    createAttrFields(dimensions.length + i, d, { cache, cube, pages, fieldExtractor });
  });

  const dataset = {
    key: () => key,
    raw: () => cube,
    field: query => findField(query, {
      cache,
      cube,
      pages
    }),
    fields: () => cache.fields.slice(),
    extract: extractionConfig => extractData(extractionConfig, cube, cache),
    hierarchy: hierarchyConfig => hierarchy(hierarchyConfig, cube, cache)
  };

  return dataset;
}
