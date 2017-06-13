import {
  nodes,
  getMoveDelta
} from './brush-range-node-builder';
import { start, end, move } from './brush-range-interaction';
import linear from '../../../core/scales/linear';
import { scaleWithSize } from '../../../core/scales';
import brushFactory from '../../../core/brush';
import {
  TARGET_SIZE,
  VERTICAL,
  HORIZONTAL
} from './brush-range-const';

function render(state) {
  state.renderer.render(nodes(state));
}

function ranges(state, brush) {
  if (!brush || !brush.isActive()) {
    return [];
  }

  const sources = state.scale.sources;
  const rangeBrush = brush.brushes().filter(f => f.type === 'range' && sources.indexOf(f.id) !== -1)[0];

  if (!rangeBrush) {
    return [];
  }

  return rangeBrush.brush.ranges();
}

function setRanges(state) {
  let rs = state.ranges.map(r => ({ min: r.min, max: r.max }));
  if (state.active.idx !== -1) {
    if (state.active.mode === 'modify') {
      rs[state.active.idx].min = Math.min(state.start, state.current);
      rs[state.active.idx].max = Math.max(state.start, state.current);
    } else {
      const delta = getMoveDelta(state);
      rs[state.active.idx].min += delta;
      rs[state.active.idx].max += delta;
    }
  } else {
    rs.push({
      min: Math.min(state.start, state.current),
      max: Math.max(state.start, state.current)
    });
  }
  state.scale.sources.forEach((s) => {
    if (state.fauxBrushInstance) {
      let ordRS = ranges(state, state.fauxBrushInstance);
      let oldValues = state.findValues(ordRS);
      let values = state.findValues(rs);

      let addedValues = values.filter(v => oldValues.indexOf(v) === -1);
      let removedValues = oldValues.filter(v => values.indexOf(v) === -1);

      let addItems = addedValues.map(v => ({ key: s, value: v }));
      let removeItems = removedValues.map(v => ({ key: s, value: v }));

      state.brushInstance.addAndRemoveValues(addItems, removeItems);

      state.fauxBrushInstance.setRange(s, rs);
    } else {
      state.brushInstance.setRange(s, rs);
    }
  });
}

function findClosest(value, scale) {
  let name;
  let minDist = Infinity;
  const domain = scale.domain();
  const halfBandwidth = scale.bandwidth() / 2;
  for (let i = 0; i < domain.length; ++i) {
    const d = Math.abs(value - halfBandwidth - scale(domain[i]));
    if (d < minDist) {
      minDist = d;
      name = domain[i];
    }
  }
  return name;
}

function findClosestLabel(value, scale) {
  const ticks = scale.ticks();
  const idx = scale.domain().indexOf(findClosest(value, scale));
  return idx !== -1 ? ticks[idx].label : '-';
}

function rangesOverlap(r1, r2) {
  return Math.min(...r1) <= Math.max(...r2) && Math.max(...r1) >= Math.min(...r2);
}

function findValues(rangesValues, scale) {
  const domain = scale.domain();
  const scaleRange = scale.range();
  const values = [];
  rangesValues.forEach((range) => {
    if (!rangesOverlap(scaleRange, [range.min, range.max])) {
      return;
    }
    const startIdx = domain.indexOf(findClosest(range.min, scale));
    const endIdx = domain.indexOf(findClosest(range.max, scale));
    values.push.apply(values, domain.slice(Math.min(startIdx, endIdx), Math.max(startIdx, endIdx) + 1)); /* eslint prefer-spread:0 */
  });

  const dataValues = new Array(values.length);
  const data = scale.data();
  let d;
  let idx;
  for (let i = 0, len = values.length; i < len; i++) {
    idx = domain.indexOf(values[i]);
    d = data[idx];
    dataValues[i] = d.id !== 'undefined' ? d.id.value : values[i];
  }
  return dataValues;
}

const brushRangeComponent = {
  require: ['chart', 'settings', 'renderer'],
  defaultSettings: {
    settings: {
      bubbles: {
        show: true,
        align: 'start',
        fontSize: '14px',
        fontFamily: 'Arial',
        fill: '#595959'
      },
      fill: '#ccc',
      target: {
        fill: '#ccc'
      }
    }
  },
  renderer: 'dom',
  on: {
    rangeStart(e) { this.start(e); },
    rangeMove(e) { this.move(e); },
    rangeEnd(e) { this.end(e); },
    rangeClear(e) { this.clear(e); }
  },
  created() {
    this.rect = { x: 0, y: 0, width: 0, height: 0 };
    this.state = {};
  },
  beforeRender(opts) {
    this.rect = opts.size;
  },
  render(h) {
    this.state.rect = this.rect;

    const stngs = this.settings.settings;
    const direction = stngs.direction === 'vertical' ? VERTICAL : HORIZONTAL;
    const size = this.state.rect[direction === VERTICAL ? 'height' : 'width'];
    const scale = scaleWithSize(this.chart.scale(stngs.scale), size);
    const offset = this.renderer.element().getBoundingClientRect();

    const target = stngs.target ? this.chart.component(stngs.target.component) : null;
    if (target && target.rect) {
      this.state.targetRect = {
        x: target.rect.x - this.rect.x,
        y: target.rect.y - this.rect.y,
        width: target.rect.width,
        height: target.rect.height
      };
    } else {
      this.state.targetRect = null;
    }

    this.state.direction = direction;
    this.state.settings = stngs;
    this.state.offset = offset;
    this.state.brush = stngs.brush;
    this.state.brushInstance = this.chart.brush(this.state.brush);
    this.state.renderer = this.renderer;
    this.state.multi = !!stngs.multiple;
    this.state.h = h;
    this.state.size = size;
    this.state.cssCoord = {
      offset: this.state.direction === VERTICAL ? 'top' : 'left',
      coord: this.state.direction === VERTICAL ? 'y' : 'x',
      pos: this.state.direction === VERTICAL ? 'deltaY' : 'deltaX'
    };

    if (scale.type !== 'linear') {
      this.state.scale = linear();
      this.state.scale.sources = scale.sources;
      this.state.format = (v, r) => {
        if (!rangesOverlap(scale.range(), r)) {
          return '-';
        }
        return findClosestLabel(v, scale);
      };
      this.state.fauxBrushInstance = brushFactory();
      this.state.findValues = valueRanges => findValues(valueRanges, scale);
    } else {
      this.state.fauxBrushInstance = null;
      this.state.findValues = null;
      this.state.scale = scale;
      this.state.format = this.chart.field(this.state.scale.sources[0]).field.formatter();
    }

    return [];
  },
  start(e) {
    start({
      e,
      state: this.state,
      renderer: this.renderer,
      ranges,
      targetSize: TARGET_SIZE
    });
  },
  end() {
    if (!this.state.started) {
      return;
    }
    end(this.state, ranges);
    render(this.state);
  },
  move(e) {
    if (!this.state.started) {
      return;
    }
    move(this.state, e);
    setRanges(this.state);
    render(this.state);
  },
  clear() {
    if (this.state.fauxBrushInstance) {
      this.state.fauxBrushInstance.clear();
    }
    this.state.renderer.render([]);
  }
};

export default brushRangeComponent;
