const TARGET_SIZE = 5;
const VERTICAL = 0;
const HORIZONTAL = 1;

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

function addRangeElements(els, state, vStart, vEnd) {
  const start = state.scale(vStart) * state.size;
  const end = state.scale(vEnd) * state.size;
  const height = Math.abs(start - end);
  const top = Math.min(start, end);
  const bottom = top + height;

  const borderHit = TARGET_SIZE;

  let cssTop;
  let cssLeft;
  let cssWidth;
  let cssHeight;

  const isVertical = state.direction === VERTICAL;

  if (isVertical) {
    cssTop = `${Math.min(start, end)}px`;
    cssLeft = 0;
    cssWidth = '100%';
    cssHeight = `${height}px`;
  } else {
    cssTop = '0';
    cssLeft = `${Math.min(start, end)}px`;
    cssWidth = `${height}px`;
    cssHeight = '100%';
  }

  // active range area
  els.push(state.h('div', {
    style: {
      backgroundColor: '#ccc',
      opacity: 0.2,
      position: 'absolute',
      left: cssLeft,
      top: cssTop,
      height: cssHeight,
      width: cssWidth
    }
  }, []));

  // edge
  els.push(state.h('div', {
    on: {
      mouseover() {
        this.children[0].elm.style.backgroundColor = '#000';
        this.children[0].elm.style[isVertical ? 'height' : 'width'] = '2px';
      },
      mouseout() {
        this.children[0].elm.style.backgroundColor = 'rgba(50, 50, 50, 0.8)';
        this.children[0].elm.style[isVertical ? 'height' : 'width'] = '1px';
      }
    },
    attrs: {
      'data-value': start < end ? vStart : vEnd
    },
    style: {
      cursor: state.direction === VERTICAL ? 'ns-resize' : 'ew-resize',
      position: 'absolute',
      left: cssLeft,
      top: cssTop,
      height: isVertical ? `${borderHit}px` : '100%',
      width: isVertical ? '100%' : `${borderHit}px`
    }
  }, [
    // line
    state.h('div', {
      style: {
        backgroundColor: 'rgba(50, 50, 50, 0.8)',
        position: 'absolute',
        left: '0',
        top: '0',
        height: isVertical ? `${1}px` : '100%',
        width: isVertical ? '100%' : `${1}px`
      }
    })
  ]));

  // bubble
  // els.push(state.h('div', {
  //   style: {
  //     position: 'absolute',
  //     borderRadius: '6px',
  //     border: '1px solid #666',
  //     backgroundColor: '#fff',
  //     padding: '5px 9px',
  //     textAlign: 'center',
  //     overflow: 'hidden',
  //     textOverflow: 'ellipsis',
  //     whiteSpace: 'nowrap',
  //     maxWidth: '150px',
  //     minWidth: '50px',
  //     minHeight: '1em',
  //     right: '8px',
  //     top: `calc(${cssTop} - 12px)`
  //   }
  // }, [
  //   `${state.format(start < end ? vStart : vEnd)}`
  // ]));

  // edge
  els.push(state.h('div', {
    on: {
      mouseover() {
        this.children[0].elm.style.backgroundColor = '#000';
        this.children[0].elm.style[isVertical ? 'height' : 'width'] = '2px';
      },
      mouseout() {
        this.children[0].elm.style.backgroundColor = 'rgba(50, 50, 50, 0.8)';
        this.children[0].elm.style[isVertical ? 'height' : 'width'] = '1px';
      }
    },
    attrs: {
      'data-value': start < end ? vEnd : vStart
    },
    style: {
      cursor: isVertical ? 'ns-resize' : 'ew-resize',
      position: 'absolute',
      left: isVertical ? '0' : '',
      right: isVertical ? '' : `${state.size - parseInt(cssLeft, 10) - parseInt(cssWidth, 10)}px`,
      top: isVertical ? `${bottom - borderHit}px` : '0',
      height: isVertical ? `${borderHit}px` : '100%',
      width: isVertical ? '100%' : `${borderHit}px`
    }
  }, [
    state.h('div', {
      style: {
        backgroundColor: 'rgba(50, 50, 50, 0.8)',
        position: 'absolute',
        left: isVertical ? '0' : '',
        right: isVertical ? '' : '0',
        bottom: isVertical ? '0' : '',
        top: isVertical ? '' : '0',
        height: isVertical ? `${1}px` : '100%',
        width: isVertical ? '100%' : `${1}px`
      }
    })
  ]));

  // bubble
  // els.push(state.h('div', {
  //   style: {
  //     position: 'absolute',
  //     borderRadius: '6px',
  //     border: '1px solid #666',
  //     backgroundColor: '#fff',
  //     padding: '5px 9px',
  //     textAlign: 'center',
  //     overflow: 'hidden',
  //     textOverflow: 'ellipsis',
  //     whiteSpace: 'nowrap',
  //     maxWidth: '150px',
  //     minWidth: '50px',
  //     minHeight: '1em',
  //     right: '8px',
  //     top: `calc(${bottom - borderHit}px - 12px)`
  //   }
  // }, [
  //   `${state.format(start < end ? vEnd : vStart)}`
  // ]));
}

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

  // add active range
  addRangeElements(els, state, vStart, vEnd);

  // add all other ranges
  state.ranges.forEach((r, i) => {
    if (i !== state.active.idx) {
      addRangeElements(els, state, Math.min(r.min, r.max), Math.max(r.min, r.max));
    }
  });

  return els;
}

function render(state) {
  state.renderer.render(nodes(state));
}

function findActive(state, value) {
  let rs = state.ranges;
  const limits = {
    min: state.scale.min(),
    max: state.scale.max()
  };
  let i;
  let activeIdx = -1;
  for (i = 0; i < rs.length; i++) {
    if (rs[i].min <= value && value <= rs[i].max) {
      activeIdx = i;
      limits.min = i ? rs[i - 1].max : limits.min;
      limits.max = i + 1 < rs.length ? rs[i + 1].min : limits.max;
      break;
    } else if (value < rs[i].min) {
      limits.max = rs[i].min;
      limits.min = i ? rs[i - 1].max : limits.min;
      break;
    }
  }
  if (activeIdx === -1 && rs.length && i >= rs.length) {
    limits.min = rs[rs.length - 1].max;
  }

  let activeRange;

  if (activeIdx !== -1) {
    activeRange = {
      idx: activeIdx,
      start: rs[activeIdx].min,
      end: rs[activeIdx].max,
      limitLow: limits.min,
      limitHigh: limits.max,
      mode: 'foo'
    };
  }
  state.active = activeRange;
}

const brushRangeComponent = {
  require: ['chart', 'settings', 'renderer'],
  defaultSettings: {
    settings: {}
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
    const scale = this.chart.scale(stngs.scale);
    const offset = this.renderer.element().getBoundingClientRect();

    this.state.direction = stngs.direction === 'vertical' ? VERTICAL : HORIZONTAL;
    this.state.scale = scale;
    this.state.offset = offset;
    this.state.brush = stngs.brush;
    this.state.brushInstance = this.chart.brush(this.state.brush);
    this.state.renderer = this.renderer;
    this.state.format = this.chart.field(this.state.scale.sources[0]).field.formatter();
    this.state.multi = !!stngs.multiple;
    this.state.h = h;
    this.state.size = this.state.rect[this.state.direction === VERTICAL ? 'height' : 'width'];
    this.state.cssCoord = {
      offset: this.state.direction === VERTICAL ? 'top' : 'left',
      coord: this.state.direction === VERTICAL ? 'y' : 'x',
      pos: this.state.direction === VERTICAL ? 'deltaY' : 'deltaX'
    };
    return [];
  },
  start(e) {
    if (this.state.started) {
      return;
    }
    this.state.offset = this.renderer.element().getBoundingClientRect();
    this.state.ranges = ranges(this.state, this.state.brushInstance);
    this.state.started = true;
    const startPoint = (e.center[this.state.cssCoord.coord] - e[this.state.cssCoord.pos]) - this.state.offset[this.state.cssCoord.offset];
    const relStart = (e.center[this.state.cssCoord.coord]) - this.state.offset[this.state.cssCoord.offset];
    const rel = relStart / this.state.size;
    let v = this.state.scale.invert(rel);
    let vStart = this.state.scale.invert(startPoint / this.state.size);

    this.state.start = vStart;

    let rs = this.state.ranges;
    const limits = {
      min: this.state.scale.min(),
      max: this.state.scale.max()
    };
    let i;
    let activeIdx = -1;
    for (i = 0; i < rs.length; i++) {
      if (rs[i].min <= vStart && vStart <= rs[i].max) {
        activeIdx = i;
        limits.min = i ? rs[i - 1].max : limits.min;
        limits.max = i + 1 < rs.length ? rs[i + 1].min : limits.max;
        break;
      } else if (vStart < rs[i].min) {
        limits.max = rs[i].min;
        limits.min = i ? rs[i - 1].max : limits.min;
        break;
      }
    }
    if (activeIdx === -1 && rs.length && i >= rs.length) {
      limits.min = rs[rs.length - 1].max;
    }

    if (activeIdx === -1 && !this.state.multi) {
      this.state.ranges = [];
      limits.min = this.state.scale.min();
      limits.max = this.state.scale.max();
    }
    let activeRange;

    if (activeIdx !== -1) {
      activeRange = {
        idx: activeIdx,
        start: rs[activeIdx].min,
        end: rs[activeIdx].max,
        limitLow: limits.min,
        limitHigh: limits.max,
        mode: 'move'
      };

      this.state.current = v;
      let pxStart = this.state.scale(activeRange.start) * this.state.size;
      let pxEnd = this.state.scale(activeRange.end) * this.state.size;
      if (Math.abs(startPoint - pxStart) <= TARGET_SIZE) {
        this.state.start = activeRange.end;
        activeRange.mode = 'modify';
      } else if (Math.abs(startPoint - pxEnd) <= TARGET_SIZE) {
        this.state.start = activeRange.start;
        activeRange.mode = 'modify';
      }
      // }
    } else {
      activeRange = {
        idx: -1,
        start: vStart,
        end: v,
        limitLow: limits.min,
        limitHigh: limits.max,
        mode: 'current'
      };
    }

    this.state.active = activeRange;
  },
  end() {
    if (!this.state.started) {
      return;
    }

    this.state.started = false;
    this.state.ranges = ranges(this.state, this.state.brushInstance);
    findActive(this.state, this.state.current);
    render(this.state);
  },
  move(e) {
    const relY = e.center[this.state.cssCoord.coord] - this.state.offset[this.state.cssCoord.offset];
    const rel = relY / this.state.size;
    const v = this.state.scale.invert(rel);
    this.state.current = Math.max(Math.min(v, this.state.active.limitHigh), this.state.active.limitLow);

    setRanges(this.state);
    render(this.state);
  }
};

export default brushRangeComponent;
