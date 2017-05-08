import Collisions from '../../../core/math/narrow-phase-collision';

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

export function start({ state, e, renderer, ranges, targetSize }) {
  if (state.started) {
    return;
  }
  const x = (e.center.x - e.deltaX);
  const y = (e.center.y - e.deltaY);
  let target = document.elementFromPoint(x, y);
  if (!renderer.element().contains(target)) {
    target = null;
  }

  const tempState = {
    started: true
  };

  state.offset = renderer.element().getBoundingClientRect();
  state.ranges = ranges(state, state.fauxBrushInstance || state.brushInstance);
  const relX = x - state.offset.left; // coordinate relative renderer
  const relY = y - state.offset.top;
  const startPoint = (e.center[state.cssCoord.coord] - e[state.cssCoord.pos]) - state.offset[state.cssCoord.offset];
  const relStart = (e.center[state.cssCoord.coord]) - state.offset[state.cssCoord.offset];
  const rel = relStart / state.size;
  let v = state.scale.invert(rel);
  let vStart = state.scale.invert(startPoint / state.size);

  tempState.start = vStart;
  tempState.current = v;

  let rs = state.ranges;
  const limits = {
    min: state.scale.min(),
    max: state.scale.max()
  };
  let i;
  let activeIdx = -1;
  if (target && target.hasAttribute('data-idx')) {
    activeIdx = parseInt(target.getAttribute('data-idx'), 10);
    limits.min = activeIdx > 0 ? rs[activeIdx - 1].max : limits.min;
    limits.max = activeIdx + 1 < rs.length ? rs[activeIdx + 1].min : limits.max;
  } else {
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
  }

  if (activeIdx === -1 && !state.multi) {
    tempState.ranges = [];
    limits.min = state.scale.min();
    limits.max = state.scale.max();
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

    if (target && target.hasAttribute('data-other-value')) {
      tempState.start = parseFloat(target.getAttribute('data-other-value'));
      activeRange.mode = 'modify';
    } else {
      let pxStart = state.scale(activeRange.start) * state.size;
      let pxEnd = state.scale(activeRange.end) * state.size;
      if (Math.abs(startPoint - pxStart) <= targetSize) {
        tempState.start = activeRange.end;
        activeRange.mode = 'modify';
      } else if (Math.abs(startPoint - pxEnd) <= targetSize) {
        tempState.start = activeRange.start;
        activeRange.mode = 'modify';
      }
    }
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

  tempState.active = activeRange;

  if (activeRange.mode !== 'modify' && state.targetRect && !Collisions.testRectPoint(state.targetRect, { x: relX, y: relY })) {
    // do nothing
  } else {
    Object.keys(tempState).forEach(key => (state[key] = tempState[key]));
  }
}
export function end(state, ranges) {
  state.started = false;
  state.ranges = ranges(state, state.fauxBrushInstance || state.brushInstance);
  findActive(state, state.current);
}
export function move(state, e) {
  const relY = e.center[state.cssCoord.coord] - state.offset[state.cssCoord.offset];
  const rel = relY / state.size;
  const v = state.scale.invert(rel);
  state.current = Math.max(Math.min(v, state.active.limitHigh), state.active.limitLow);
}
