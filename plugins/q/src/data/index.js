import transformStraight from './transform-s';
import { transformStacked, transformH } from './transform-k';
import { findField } from './util';
import picker from '../json-path-resolver';
import field from './field';

function hierarchy(config = {}, cube, cache) {
  if (!cube.qMode === 'K') {
    return null;
  }
  return transformH(config, cube, cache);
}

function transform(cfg, cube, cache) {
  if (cube.qMode === 'K') {
    return transformStacked(cfg, cube, cache);
  } else if (cube.qMode === 'S') {
    return transformStraight(cfg, cube, cache);
  }
  return [];
}

function createAttrFields(idx, d, {
  cache,
  cube,
  pages
}) {
  if (d.qAttrDimInfo) {
    cache.attributeDimensionFields[idx] = d.qAttrDimInfo.map((attrDim, attrDimIdx) => (attrDim ? field({
      meta: attrDim,
      idx,
      cube,
      pages,
      attrDimIdx
    }) : undefined));
  }
  if (d.qAttrExprInfo) {
    cache.attributeExpressionFields[idx] = d.qAttrExprInfo.map((attrExpr, attrIdx) => (attrExpr ? field({
      meta: attrExpr,
      idx,
      cube,
      pages,
      attrIdx
    }) : undefined));
  }
}

export default function q(cube) {
  const cache = {
    attributeDimensionFields: [],
    attributeExpressionFields: [],
    fields: []
  };

  const data = {
    raw: () => cube,
    extract: mapper => transform(mapper, cube, cache),
    hierarchy: hierarchyConfig => hierarchy(hierarchyConfig, cube, cache)
  };

  if (!cube.qDimensionInfo) { // assume old data format
    throw new Error('The data input is not recognized as a hypercube');
  }

  const pages = cube.qMode === 'K' ? cube.qStackedDataPages : cube.qDataPages;

  const dimensions = picker('/qDimensionInfo', cube);
  dimensions.forEach((d, i) => {
    cache.fields.push(field({
      meta: d,
      idx: i,
      cube,
      pages
    }));
    createAttrFields(i, d, { cache, cube, pages });
  });

  picker('/qMeasureInfo', cube).forEach((d, i) => {
    cache.fields.push(field({
      meta: d,
      idx: dimensions.length + i,
      cube,
      pages
    }));
    createAttrFields(dimensions.length + i, d, { cache, cube, pages });
  });

  data.field = query => findField(query, {
    cache,
    cube,
    pages
  });

  return data;
}
