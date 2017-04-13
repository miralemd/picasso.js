import buildRange from './brush-range-node-builder';
import { start, end, move } from './brush-range-interaction';
import linear from '../../../core/scales/linear';
import { scaleWithSize } from '../../../core/scales';

const TARGET_SIZE = 5;
const VERTICAL = 0;
const HORIZONTAL = 1;

function nodes(state) {
  if (!state.active) {
    return [];
  }
  let vStart = state.start;
  let vEnd = state.current;
  if (state.active.idx !== -1) {
    if (state.active.mode === 'foo') {
      vStart = Math.min(state.active.start, state.active.end);
      vEnd = Math.max(state.active.start, state.active.end);
    } else if (state.active.mode === 'modify') {
      vStart = Math.min(state.start, state.current);
      vEnd = Math.max(state.start, state.current);
    } else {
      const posDelta = state.active.limitHigh - state.active.end;
      const negDelta = state.active.limitLow - state.active.start;
      let delta = state.current - state.start;
      if (delta < 0) {
        delta = Math.max(delta, negDelta);
      } else {
        delta = Math.min(delta, posDelta);
      }
      vStart = state.active.start + delta;
      vEnd = state.active.end + delta;
    }
  }

  let els = [];

  const isVertical = state.direction === VERTICAL;

  // add all other ranges
  state.ranges.forEach((r, i) => {
    if (i !== state.active.idx) {
      buildRange({
        borderHit: TARGET_SIZE,
        els,
        isVertical,
        state,
        vStart: Math.min(r.min, r.max),
        vEnd: Math.max(r.min, r.max),
        idx: i
      });
    }
  });

  // add active range
  buildRange({
    borderHit: TARGET_SIZE,
    els,
    isVertical,
    state,
    vStart,
    vEnd,
    idx: state.active.idx
  });

  return els;
}

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
      const posDelta = state.active.limitHigh - state.active.end;
      const negDelta = state.active.limitLow - state.active.start;
      let delta = state.current - state.start;
      if (delta < 0) {
        delta = Math.max(delta, negDelta);
      } else {
        delta = Math.min(delta, posDelta);
      }
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
    state.brushInstance.setRange(s, rs);
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
      }
    }
  },
  renderer: 'dom',
  // on: {
  //   panstart(e) {
  //     this.start(e);
  //   },
  //   panend(e) {
  //     this.end(e);
  //   },
  //   panmove(e) {
  //     this.move(e);
  //   }
  // },
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

    this.state.direction = direction;
    this.state.bubbles = stngs.bubbles;
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
      this.state.format = v => findClosest(v, scale);
    } else {
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
    end(this.state, ranges);
    render(this.state);
  },
  move(e) {
    move(this.state, e);
    setRanges(this.state);
    render(this.state);
  }
};

export default brushRangeComponent;
