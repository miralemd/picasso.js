import { resolve } from '../json-path-resolver';
import { metaToDataPath } from './meta-to-data';

function normalizeMeta(obj) {
  if ('qStateCounts' in obj) { // dimension
    return {
      min: obj.qMin,
      max: obj.qMax,
      count: obj.qStateCounts.qOption + obj.qStateCounts.qLocked + obj.qStateCounts.qSelected,
      title: obj.qFallbackTitle
    };
  } else {
    return {
      min: obj.qMin,
      max: obj.qMax,
      title: obj.qFallbackTitle
    };
  }
}

export default class StraightLayout {
  constructor(Promise, resolver, metaToData) {
    this.Promise = Promise;
    this.resolve = resolver;
    this.metaToData = metaToData;
  }

  metaOf(path) {
    return normalizeMeta(this.resolve(path, this._layout));
  }

  layout(value) {
    if (typeof value === 'undefined') {
      return this._layout;
    }
    this._layout = value;
    return this;
  }

  dataPages() {
    if (!this._layout) {
      return this.Promise.reject();
    }
    return this.Promise.resolve(this._layout.qHyperCube.qDataPages);
  }

  fromSource(source, pageIdx = 0) {
    const fn = (s) => {
      const path = this.metaToData(s, this._layout);
      return this.resolve(path.replace('qDataPages/', `qDataPages/${pageIdx}`), this._layout);
    };
    return Array.isArray(source) ? source.map(fn) : fn(source);
  }
}

export function create() {
  return new StraightLayout(Promise, resolve, metaToDataPath);
}
