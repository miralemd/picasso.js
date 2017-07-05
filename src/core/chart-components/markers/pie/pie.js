import { pie, arc } from 'd3-shape';
import { resolveSettings } from '../../settings-setup';
import { resolveForDataObject } from '../../../style';

const DEFAULT_DATA_SETTINGS = {
  shape: 'pie',
  label: '',
  fill: '#999',
  stroke: '#ccc',
  strokeWidth: 1,
  opacity: 1,
  arc: 0.25,
  innerRadius: 0,
  outerRadius: 0.5,
  cornerRadius: 1,
  offset: 0
};

/**
 * @typedef settings
 * @type {object}
 * @property {number} [startAngle=0] - If angle is specified, sets the overall start angle of the pie to the specified function or number
 * @property {number} [endAngle=2*Math.PI] - If angle is specified, sets the overall end angle of the pie to the specified function or number
 * @property {number} [padAngle=0] - The pad angle here means the angular separation between each adjacent arc
 * @property {object} [slice]
 * @property {boolean} [slice.show=true]
 * @property {string} [slice.fill='#fff']
 * @property {string} [slice.stroke='#000']
 * @property {number} [slice.strokeWidth=1]
 * @property {number} [slice.opacity=1]
 * @property {number} [slice.innerRadius=0] - The inner radius of the pie slice
 * @property {number} [slice.outerRadius=1] - The outer radius of the pie slice
 * @property {number} [slice.cornerRadius=0] - The corner radius of the pie slices corners in pixels
 * @property {number|function} [slice.offset=0] - The relative radial offset of the slice
 */

/**
 * @typedef pie
 * @property {string} type - "pie"
 * @property {pie-data} data - Pie data
 * @property {pie-settings} settings - Pie settings
 * @example
 * {
 *   type: 'pie',
 *   data: {
 *     mapTo: {
 *       arc: { source: '/qHyperCube/qMeasureInfo/0' }
 *     },
 *     groupBy: { source: '/qHyperCube/qDimensionInfo/0' }
 *   },
 *   startAngle: Math.PI / 2,
 *   endAngle: -Math.PI / 2,
 *   slice: {
 *     fill: 'green',
 *     stroke: 'red',
 *     strokeWidth: 2,
 *     innerRadius: 0.6,
 *     outerRadius 0.8,
 *     opacity: 0.8,
 *     offset: function(v) {
 *       return ix === 1 ? 0.3 : 0;
 *     }
 *   }
 * }
 */

/**
 * @typedef data
 * @type {object}
 * @property {number} arc - value that represents the size of the arc
 */

function offsetSlice(centroid, offset, outerRadius, innerRadius) {
  let [vx, vy] = centroid;
  const vlen = Math.sqrt((vx * vx) + (vy * vy));
  vx /= vlen;
  vy /= vlen;
  const diff = outerRadius - innerRadius;
  return { x: vx * offset * diff, y: vy * offset * diff };
}

function createDisplayPies(arcData, { x, y, width, height }, slices) {
  const arcGen = arc();
  const center = { x: x + (width / 2), y: y + (height / 2) };
  const innerRadius = (Math.min(width, height) / 2);
  const outerRadius = (Math.min(width, height) / 2);
  const cornerRadius = outerRadius / 100;
  return arcData.map((a, i) => {
    const slice = slices[i];
    slice.type = 'path';
    const or = outerRadius * slice.outerRadius;
    const ir = innerRadius * slice.innerRadius;
    arcGen.innerRadius(ir);
    arcGen.outerRadius(or);
    arcGen.cornerRadius(cornerRadius * slice.cornerRadius);
    slice.d = arcGen(a);
    const centroid = arcGen.centroid(a);
    const offset = slice.offset ? offsetSlice(centroid, slice.offset, or, ir) : { x: 0, y: 0 };
    slice.transform = `translate(${offset.x}, ${offset.y}) translate(${center.x}, ${center.y})`;
    return slice;
  });
}

const pieComponent = {
  require: ['chart'],
  defaultSettings: {
    startAngle: 0,
    endAngle: 2 * Math.PI,
    padAngle: 0,
    settings: {},
    data: {}
  },
  created() {
    this.rect = { x: 0, y: 0, width: 0, height: 0 };
    this.updateSettings(this.settings);
  },
  updateSettings(settings) {
    const chart = this.chart;
    this.local = resolveSettings(settings.slice, DEFAULT_DATA_SETTINGS, chart);
  },
  beforeUpdate(settings) {
    this.updateSettings(settings);
  },
  beforeRender(opts) {
    this.rect = opts.size;
  },
  render({ data }) {
    const arcValues = [];
    const slices = data.map((s, i) => {
      const obj = resolveForDataObject(this.local, s, i);
      obj.dataIndex = i;
      arcValues.push(s.arc.value);
      return obj;
    });
    const pieGen = pie();
    pieGen.startAngle(this.settings.startAngle);
    pieGen.endAngle(this.settings.endAngle);
    pieGen.padAngle(this.settings.padAngle);
    const arcData = pieGen(arcValues);
    return createDisplayPies(arcData, this.rect, slices);
  }
};

export default pieComponent;

/*
{
  type: 'pie',
  data: {
    mapTo: {
      arc: {
        source: 'meas'
      }
    },
    groupBy: {
      source: 'dim'
    }
  },
  startAngle: Math.PI,
  endAngle: Math.PI / 4,
  slice: {
    fill: 'red',
    stroke: 'green',
    offset: function(v) {
      return this.data.arc.value > Math.PI / 6 ? 0.1 : 0;
    },
    radius: {
      scale: 'r', ref: 'arc'
    }
  }
}
*/
