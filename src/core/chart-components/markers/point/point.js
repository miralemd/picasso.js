import extend from 'extend';
import shapeFactory from './shapes';
import { resolveSettings } from '../../settings-setup';
import { resolveForDataObject } from '../../../style';
import { notNumber } from '../../../utils/math';
import { updateScaleSize } from '../../../scales';

const DEFAULT_DATA_SETTINGS = {
  shape: 'circle',
  label: '',
  fill: '#999',
  stroke: '#ccc',
  strokeWidth: 0,
  opacity: 1,
  x: 0.5,
  y: 0.5,
  size: 1
};

const SIZE_LIMITS = {
  maxPx: 10000,
  minPx: 1,
  maxRel: 1,
  minRel: 0.1
};

const DEFAULT_ERROR_SETTINGS = {
  errorShape: {
    opacity: 1,
    shape: 'saltire',
    size: 0.2,
    fill: undefined,
    stroke: undefined,
    strokeWidth: 2
  }
};

/**
 * @typedef settings
 * @type {object}
 * @property {marker-point-number} [x=0.5] - x coordinate
 * @property {marker-point-number} [y=0.5] - y coordinate
 * @property {marker-point-string} [fill="#999"] - fill color
 * @property {marker-point-string} [stroke="#ccc"] - stroke color
 * @property {marker-point-number} [strokeWidth=0] - stroke width
 * @property {marker-point-number} [size=1] - size of shape
 * @property {marker-point-number} [opacity=1] - opacity of shape
 * @property {marker-point-string} [shape="circle"] - type of shape
 * @property {object} [sizeLimits]
 * @property {number} [sizeLimits.maxPx=10000] - maximum size in pixels
 * @property {number} [sizeLimits.minPx=1] - minimum size in pixels
 * @property {number} [sizeLimits.maxRel=1] - maximum size relative calculated bounding box of allowed size
 * @property {number} [sizeLimits.minRel=0.1] - minimum size relative calculated bounding box of allowed size
 */

/**
 * @typedef marker-point
 * @property {string} type - "point"
 * @property {marker-point-data} data - Point data mapping.
 * @property {settings} settings - Marker settings
 */

/**
 * @typedef {(string|marker-point-data-accessor|marker-point-setting)} marker-point-string
 */

 /**
  * @typedef {(number|marker-point-data-accessor|marker-point-setting)} marker-point-number
  */

 /**
  * @callback marker-point-data-accessor
  * @param {object} datum - The datum object
  * @param {number|string} datum.value - Value of datum
  * @param {integer} index - Index of datum in the data
  * @this {marker-point-data-accessor-context}
  */

 /**
  * typedef marker-point-data-accessor-context
  * @property {object} data - The mapped data
  * @property {object} scale - The referenced scale
  */

/**
 * The specified definition will provide the point marker with data.
 *
 * @typedef marker-point-data
 * @property {object} mapTo - Object containing the definition of how to map data
 * @property {string} mapTo.source - Data field
 * @property {object} groupBy - The data source to group data
 * @property {string} groupBy.source - Reference to a data source
 */

 /**
  * The data to use for encoding a property of the point.
  *
  * The specified source will provide the point marker with data.
  * @typedef marker-point-setting
  * @property {string} ref - A reference to a property in the mapped data.
  * @property {object|string} scale - Object containing the definition of a scale. If a string is provided it is assumed to be a reference to an already existing scale.
  * @property {string} scale.source - Data source
  * @property {string} scale.type - Scale type
  * @property {marker-point-data-accessor} [fn] - Data accessor. Custom data accessor which will be called for each datum. The return value is used for the specified property.
  */

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
  let maxSizePx = Math.min(xSpacePx.value, ySpacePx.value) * limits.maxRel;
  let minSizePx = Math.min(xSpacePx.value, ySpacePx.value) * limits.minRel;
  // if (!xSpacePx.isBandwidth && !ySpacePx.isBandwidth) {
  //   maxSizePx = maxSizePx;
  // }
  const min = Math.max(1, Math.floor(minSizePx));
  const max = Math.max(1, Math.floor(maxSizePx));
  return { min, max, maxGlobal: limits.maxPx, minGlobal: limits.minPx };
}

function calculateLocalSettings(stngs, chart) {
  const local = resolveSettings(stngs, DEFAULT_DATA_SETTINGS, chart);
  local.errorShape = resolveSettings(stngs.errorShape, DEFAULT_ERROR_SETTINGS.errorShape, chart);
  return local;
}

function createDisplayPoints(dataPoints, { x, y, width, height }, pointSize, shapeFn) {
  return dataPoints.filter(p =>
   !isNaN(p.x + p.y)
  ).map((p) => {
    const s = notNumber(p.size) ? p.errorShape : p;
    const size = pointSize.min + (s.size * (pointSize.max - pointSize.min));
    const shape = shapeFn(s.shape, {
      label: p.label,
      x: p.x * width,
      y: p.y * height,
      fill: p.fill,
      size: Math.min(pointSize.maxGlobal, Math.max(pointSize.minGlobal, size)),
      stroke: s.stroke,
      strokeWidth: s.strokeWidth,
      opacity: p.opacity
    });

    shape.data = p.dataIndex;
    return shape;
  });
}

const pointMarkerComponent = {
  require: ['chart'],
  defaultSettings: {
    settings: {},
    data: {}
  },
  created() {
    this.rect = { x: 0, y: 0, width: 0, height: 0 };
    this.updateSettings(this.settings);
  },
  updateSettings(settings) {
    const chart = this.chart;
    this.local = calculateLocalSettings(settings.settings, chart);
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
    const points = data.map((p, i) => {
      const obj = resolveForDataObject(this.local, p, i);
      obj.errorShape = resolveForDataObject(this.local.errorShape, p, i);
      obj.dataIndex = i;
      return obj;
    });
    const pointSize = getPointSizeLimits(this.local.x, this.local.y, width, height, limits);
    return createDisplayPoints(points, this.rect, pointSize, this.settings.shapeFn || shapeFactory);
  }
};

export default pointMarkerComponent;
