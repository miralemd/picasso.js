import extend from 'extend';
import { normalizeSettings, resolveForItem } from '../../property-resolver';
import { notNumber } from '../../../utils/math';
import { updateScaleSize } from '../../../scales';
import shapeFactory from '../../../symbols';

const DEFAULT_ERROR_SETTINGS = {
  errorShape: {
    shape: 'saltire',
    width: 2,
    size: 0.5,
    fill: '#333',
    stroke: '#333',
    strokeWidth: 0
  }
};

 /**
  * @typedef {object}
  * @alias component--point-marker.settings
  */
const DEFAULT_DATA_SETTINGS = {
  /** Type of shape
   * @type {datum-string=} */
  shape: 'circle',
  label: '',
  /** Fill color
   * @type {datum-string=} */
  fill: '#333',
  /** Stroke color
   * @type {datum-string=} */
  stroke: '#ccc',
  /** Stroke width
   * @type {datum-number=} */
  strokeWidth: 0,
  /** Opacity of shape
   * @type {datum-number=} */
  opacity: 1,
  /** Normalized x coordinate
   * @type {datum-number=} */
  x: 0.5,
  /** Normalized y coordinate
   * @type {datum-number=} */
  y: 0.5,
  /** Normalized size of shape
   * @type {datum-number=} */
  size: 1,
  strokeDasharray: ''
};

 /**
  * @typedef {object}
  * @alias component--point-marker.settings.sizeLimits
  */
const SIZE_LIMITS = {
  /** Maximum size of shape, in pixels
   * @type {number=} */
  maxPx: 10000,
  /** Minimum size of shape, in pixels
   * @type {number=} */
  minPx: 1,
  /** Maximum size relative linear scale extent
   * @type {number=} */
  maxRelExtent: 0.1,
  /** Minimum size relative linear scale extent
   * @type {number=} */
  minRelExtent: 0.01,
  /** Maximum size relative discrete scale banwidth
   * @type {number=} */
  maxRelDiscrete: 1,
  /** Minimum size relative discrete scale banwidth
   * @type {number=} */
  minRelDiscrete: 0.1
};

function getPxSpaceFromScale(s, space) {
  if (s && typeof s.bandwidth === 'function') { // some kind of ordinal scale
    return {
      isBandwidth: true,
      value: Math.max(1, s.bandwidth() * space)
    };
  }
  return {
    isBandwidth: false,
    value: Math.max(1, space)
  };
}

function getPointSizeLimits(x, y, width, height, limits) {
  const xSpacePx = getPxSpaceFromScale(x ? x.scale : undefined, width, limits);
  const ySpacePx = getPxSpaceFromScale(y ? y.scale : undefined, height, limits);
  let maxSizePx = Math.min(xSpacePx.value * limits[xSpacePx.isBandwidth ? 'maxRelDiscrete' : 'maxRelExtent'], ySpacePx.value * limits[ySpacePx.isBandwidth ? 'maxRelDiscrete' : 'maxRelExtent']);
  let minSizePx = Math.min(xSpacePx.value * limits[xSpacePx.isBandwidth ? 'minRelDiscrete' : 'minRelExtent'], ySpacePx.value * limits[ySpacePx.isBandwidth ? 'minRelDiscrete' : 'minRelExtent']);
  const min = Math.max(1, Math.floor(minSizePx));
  const max = Math.max(1, Math.floor(maxSizePx));
  return { min, max, maxGlobal: limits.maxPx, minGlobal: limits.minPx };
}

function calculateLocalSettings(stngs, chart, style = {}) {
  const local = normalizeSettings(stngs, extend({}, DEFAULT_DATA_SETTINGS, style.item), chart);
  local.errorShape = normalizeSettings(stngs.errorShape, DEFAULT_ERROR_SETTINGS.errorShape, chart);
  return local;
}

function createDisplayPoints(dataPoints, { x, y, width, height }, pointSize, shapeFn) {
  return dataPoints.filter(p =>
   !isNaN(p.x + p.y)
  ).map((p) => {
    const s = notNumber(p.size) ? p.errorShape : p;
    const size = pointSize.min + (s.size * (pointSize.max - pointSize.min));
    const shapeSpec = {
      type: s.shape === 'rect' ? 'square' : s.shape,
      label: p.label,
      x: p.x * width,
      y: p.y * height,
      fill: s.fill,
      size: Math.min(pointSize.maxGlobal, Math.max(pointSize.minGlobal, size)),
      stroke: s.stroke,
      strokeWidth: s.strokeWidth,
      strokeDasharray: s.strokeDasharray,
      opacity: s.opacity
    };
    if (s === p.errorShape) {
      shapeSpec.width = s.width;
    }
    const shape = shapeFn(shapeSpec);

    shape.data = p.data;
    return shape;
  });
}

const pointMarkerComponent = {
  require: ['chart'],
  defaultSettings: {
    settings: {},
    data: {},
    animations: {
      enabled: false,
      trackBy: node => node.data.value
    },
    style: {
      item: '$shape'
    }
  },
  created() {
    this.rect = { x: 0, y: 0, width: 0, height: 0 };
    this.updateSettings(this.settings);
  },
  updateSettings(settings) {
    const chart = this.chart;
    this.local = calculateLocalSettings(settings.settings, chart, this.style);
  },
  beforeUpdate(opts) {
    this.updateSettings(opts.settings);
  },
  beforeRender(opts) {
    this.rect = opts.size;
  },
  render({ data }) {
    const { width, height } = this.rect;
    updateScaleSize(this.local, 'x', width);
    updateScaleSize(this.local, 'y', height);
    const limits = extend({}, SIZE_LIMITS, this.settings.settings.sizeLimits);
    const points = (data.items || []).map((p, i, all) => {
      const obj = resolveForItem(p, this.local, all);
      obj.errorShape = resolveForItem(p, this.local.errorShape, all);
      obj.data = p;
      return obj;
    });
    const pointSize = getPointSizeLimits(this.local.x, this.local.y, width, height, limits);
    return createDisplayPoints(points, this.rect, pointSize, this.settings.shapeFn || shapeFactory);
  }
};

export default pointMarkerComponent;
