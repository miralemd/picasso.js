import { pie, arc } from 'd3-shape';
// import shapeFactory from '../point/shapes';
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

// const SIZE_LIMITS = {
//   minRadiusPx: 1,
//   radiusOffset: 0.1
// };

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
    const offset = offsetSlice(centroid, slice.offset, or, ir);
    slice.transform = `translate(${offset.x}, ${offset.y}) translate(${center.x}, ${center.y})`;
    return slice;
  });
}

const pieComponent = {
  require: ['chart'],
  defaultSettings: {
    angularStart: 0,
    angularDistance: 2 * Math.PI,
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
    pieGen.startAngle(this.settings.angularStart);
    pieGen.endAngle(this.settings.angularStart + this.settings.angularDistance);
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
  angularStart: Math.PI,
  angularDistance: Math.PI / 4,
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
