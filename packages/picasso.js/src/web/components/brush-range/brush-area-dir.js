import {
  getMoveDelta,
  nodes
} from './brush-range-node-builder';
import {
  startArea,
  moveArea,
  endArea
} from './brush-range-interaction';
import rangeCollection from '../../../core/brush/range-collection';
import {
  TARGET_SIZE,
  VERTICAL,
  HORIZONTAL
} from './brush-range-const';

function render(state) {
  state.renderer.render(nodes(state));
}

function ranges(state) {
  return state.rc.ranges();
}

function shapesFromRange(state, brushRange) {
  const shapeAt = {
    x: state.direction ? brushRange.min + state.rect.x : state.rect.x,
    y: state.direction ? state.rect.y : brushRange.min + state.rect.y,
    width: state.direction ? brushRange.max - brushRange.min : state.rect.width + state.rect.x,
    height: state.direction ? state.rect.height + state.rect.y : brushRange.max - brushRange.min
  };
  return state.chart.shapesAt(shapeAt, state.settings.brush);
}

function brushFromShape(state, newShapes) {
  state.chart.brushFromShapes(newShapes, state.settings.brush);
}

function setRanges(state) {
  const rs = state.ranges.map(r => ({ min: r.min, max: r.max }));

  if (state.active.idx !== -1) {
    if (state.active.mode === 'modify') {
      rs[state.active.idx].min = Math.min(state.start, state.current);
      rs[state.active.idx].max = Math.max(state.start, state.current);
    } else {
      const delta = getMoveDelta(state);
      rs[state.active.idx].min = state.active.start + delta;
      rs[state.active.idx].max = state.active.end + delta;
    }
  } else {
    rs.push({
      min: Math.min(state.start, state.current),
      max: Math.max(state.start, state.current)
    });
  }

  state.rc.set(rs);

  const shapes = [];
  rs.forEach((range) => {
    shapes.push(...shapesFromRange(state, range));
  });

  brushFromShape(state, shapes);
}

function getBubbleLabel(state, value, range) {
  const min = Math.min(...range);
  const max = Math.max(...range);
  const shapeAt = {
    x: state.direction ? min + state.rect.x : state.rect.x,
    y: state.direction ? state.rect.y : min + state.rect.y,
    width: state.direction ? max - min : state.rect.width + state.rect.x,
    height: state.direction ? state.rect.height + state.rect.y : max - min
  };

  const shapes = state.chart.shapesAt(shapeAt, state.settings.brush);

  if (shapes.length === 0) {
    return '-';
  }

  const labelShape = shapes.reduce((s0, s1) => {
    // Min value
    if (value === min) {
      if (s0.collider[state.cssCoord.coord] <= s1.collider[state.cssCoord.coord]) {
        return s0;
      }
      return s1;
    }

    // Max value
    if (s0.collider[state.cssCoord.coord] + s0.collider[state.cssCoord.area] >= s1.collider[state.cssCoord.coord] + s1.collider[state.cssCoord.area]) {
      return s0;
    }
    return s1;
  });

  const compConfig = state.settings.brush.components.reduce((c0, c1) => (c0.key === labelShape.key ? c0 : c1));
  const dataConfig = compConfig.data || ['self'];

  if (typeof state.settings.bubbles.label === 'function') {
    return state.settings.bubbles.label(labelShape.data);
  }

  return labelShape.data[dataConfig[0]].label;
}

const brushAreaDirectionalComponent = {
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
    areaStart(e) { this.start(e); },
    areaMove(e) { this.move(e); },
    areaEnd(e) { this.end(e); },
    areaClear(e) { this.clear(e); }
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
    const offset = this.renderer.element().getBoundingClientRect();

    const target = stngs.target ? this.chart.component(stngs.target.component) : null;
    if (target && target.rect) {
      this.state.targetRect = {
        x: (target.rect.x - this.rect.x),
        y: (target.rect.y - this.rect.y),
        width: target.rect.width,
        height: target.rect.height
      };
    } else {
      this.state.targetRect = null;
    }
    this.state.chart = this.chart;
    this.state.direction = direction;
    this.state.settings = stngs;
    this.state.offset = offset;
    this.state.rc = rangeCollection();
    this.state.renderer = this.renderer;
    this.state.multi = !!stngs.multiple;
    this.state.h = h;
    this.state.size = size;
    this.state.cssCoord = {
      offset: this.state.direction === VERTICAL ? 'top' : 'left',
      coord: this.state.direction === VERTICAL ? 'y' : 'x',
      pos: this.state.direction === VERTICAL ? 'deltaY' : 'deltaX',
      area: this.state.direction === VERTICAL ? 'height' : 'width'
    };

    this.state.format = function getFormat(v, r) {
      return getBubbleLabel(this, v, r);
    };

    return [];
  },
  start(e) {
    startArea({
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
    endArea(this.state, ranges);
    render(this.state);
  },
  move(e) {
    if (!this.state.started) {
      return;
    }
    moveArea(this.state, e);
    setRanges(this.state);
    render(this.state);
  },
  clear() {
    if (this.state.rc) {
      this.state.rc.clear();
    }
    this.state.renderer.render([]);
  }
};

export default brushAreaDirectionalComponent;