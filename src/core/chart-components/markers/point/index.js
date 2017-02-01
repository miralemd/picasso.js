import createComponentFactory from '../../component';
import shapeFactory from './shapes';
import { resolveSettings } from '../../settings-setup';
import { resolveForDataObject } from '../../../style';
import notNumber from '../../../utils/undef';

const DEFAULT_DATA_SETTINGS = {
  shape: 'circle',
  label: '',
  fill: '#999',
  stroke: '#ccc',
  strokeWidth: 0,
  opacity: 1,
  x: 0.5,
  y: 0.5,
  size: 0.75,
  maxSize: 100,
  minSize: 5
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
 * @typedef marker-point
 * @property {string} type - "point"
 * @property {marker-point-data} data - Point data mapping.
 * @property {marker-point-settings} settings - Marker settings
 * @example
 * {
 *  type: "point",
 *  data: {
 *    groupBy: {
 *      source: "/qHyperCube/qDimensionInfo/0",
 *    },
 *    mapTo: {
 *      color: { source: "/qHyperCube/qMeasureInfo/0" },
 *      opacity: { source: "/qHyperCube/qMeasureInfo/1" }
 *    }
 *  },
 *  settings: {
 *   x: 0.2, // simple number, places all points at the same position along the x-axis (which assumes to have a range of [0,1])
 *   y: ( d, i, arr ) => i / arr.length, // function is called for each datum `d`
 *   fill: { ref: "color", scale: { source: "/qHyperCube/qMeasureInfo/0", type: "color" }, // auto-constructs a color scale from the specified source
 *   opacity: { ref: "opacity", fn: ( d ) => d.value },
 *   shape: ( d, i ) => ["rect", "circle"][i % 2]
 *  }
 * }
 */

/**
 * @typedef marker-point-settings
 * @property {marker-point-number} [x=0.5] - x coordinate
 * @property {marker-point-number} [y=0.5] - y coordinate
 * @property {marker-point-string} [fill="#999"] - fill color
 * @property {marker-point-string} [stroke="#ccc"] - stroke color
 * @property {marker-point-number} [strokeWidth=0] - stroke width
 * @property {marker-point-number} [size=1] - size of shape
 * @property {marker-point-number} [opacity=1] - opacity of shape
 * @property {marker-point-string} [shape="circle"] - type of shape
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
 * @example
 * {
 *   mapTo: {
 *    x: { source: "/qHyperCube/qMeasureInfo/0" },
 *    y: { source: "/qHyperCube/qMeasureInfo/1", reducer: "avg" },
 *    parent: { source: "/qHyperCube/qDimensionInfo/0", type: "qual", reducer: "first" }
 *   },
 *   groupBy: {
 *    source: "/qHyperCube/qDimensionInfo/1"
 *   }
 * }
 *
 * // will provide an output:
 * [
 *  {
 *    x: { value: 3.2, source: {...} },
 *    y: { value: 16.2, source: {...} },
 *    parent: { value: 'Europe', source: {...} }
 *  },
 *  ...
 * ]
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
  * @example
  * // assuming a data mapping of:
  * // {
  * //  x: { source: "/qHyperCube/qMeasureInfo/0" }
  * //  label: { source: "/qHyperCube/qDimensionInfo/0" }
  * // }
  * //
  * // the data can be accessed in various ways:
  * // the following definitions will all result in the same 'x' value
  * {
  *   x: { ref: "x" } // reference the 'x' value in the mapped data
  *   x: { ref: "x", fn: (d) { return d.value; } }, // the referenced value in sent in as the first parameter in the callback
  *   x: { fn: function(d) { return this.data.x.value; } }, // the mapped data can be accessed through <code>this.data</code>
  *   x: function (d) { return this.data.x.value; }
  * }
  * @example
  * // a scale will in some cases automatically be used when provided,
  * // the following definitions will all result in the same 'x' value:
  * {
  *   x: { ref: "x", scale: "x" }, // automatically sends the 'x' value through the scale and returns that value
  *   x: { ref: "x", scale: "x", fn: function(d) { return this.scale(d) } }, // the referenced 'scale' is accessible in the callback's 'this' context
  *   x: { scale: "x", fn: function(d) { return this.scale(this.data.x) } },
  * }
  *
  * @example
  * // since all mapped data is accessible in all settings, the values can be used for more expressive representation of properties
  * {
  *   fill: { scale: "x", fn: function() { // color the maximum value red
  *     return this.scale.max() >= this.data.x.value ? "red" : "grey";
  *   } }
  * }
  */

function getSpaceFromScale(s, space) {
  if (s && typeof s.step === 'function') { // some kind of ordinal scale
    return Math.max(1, s.step() * space);
  }
  return Math.max(1, space / 10);
}

function getPointSizeLimits(x, y, width, height) {
  const xSpace = getSpaceFromScale(x ? x.scale : undefined, width);
  const ySpace = getSpaceFromScale(y ? y.scale : undefined, height);
  const space = Math.min(xSpace, ySpace);
  const min = Math.max(1, Math.floor(space / 10)); // set min size to be 10 (arbitrary choice) times smaller than allowed space
  const max = Math.max(min, Math.min(Math.floor(space)));
  return [min, max];
}

function calculateLocalSettings(stngs, composer) {
  let local = resolveSettings(stngs, DEFAULT_DATA_SETTINGS, composer);
  local.errorShape = resolveSettings(stngs.errorShape, DEFAULT_ERROR_SETTINGS.errorShape, composer);
  return local;
}

function createDisplayPoints(dataPoints, { x, y, width, height }, pointSize, shapeFn) {
  return dataPoints.filter(p =>
   !isNaN(p.x + p.y)
  ).map((p) => {
    const s = notNumber(p.size) ? p.errorShape : p;
    const size = pointSize[0] + (s.size * (pointSize[1] - pointSize[0])); // TODO - replace with scale
    let shape = shapeFn(s.shape, {
      label: p.label,
      x: p.x * width,
      y: p.y * height,
      fill: p.fill,
      size: Math.min(p.maxSize, Math.max(p.minSize, size)),
      stroke: s.stroke,
      strokeWidth: s.strokeWidth,
      opacity: p.opacity
    });

    shape.data = p.dataIndex;
    return shape;
  });
}

const pointMarker = {
  require: ['composer'],
  defaultSettings: {
    settings: {},
    data: {}
  },
  created() {
    this.rect = { x: 0, y: 0, width: 0, height: 0 };
    this.updateSettings(this.settings);
  },
  updateSettings(settings) {
    const composer = this.composer;
    this.local = calculateLocalSettings(settings.settings, composer);
  },
  beforeUpdate(opts) {
    this.updateSettings(opts.settings);
  },
  beforeRender(opts) {
    this.rect = opts.size;
  },
  render({ data }) {
    const { width, height } = this.rect;
    const points = data.map((p, i) => {
      const obj = resolveForDataObject(this.local, p, i);
      obj.errorShape = resolveForDataObject(this.local.errorShape, p, i);
      obj.dataIndex = i;
      return obj;
    });
    const pointSize = getPointSizeLimits(this.local.x, this.local.y, width, height);
    return createDisplayPoints(points, this.rect, pointSize, this.settings.shapeFn || shapeFactory);
  }
};

export default createComponentFactory(pointMarker);

/*
export function point(obj, composer) {
  return pointFn(rendererFactory, shapeFactory)(obj, composer);
}
*/
