import {
  TARGET_SIZE,
  VERTICAL
} from './brush-range-const';

function buildLine({ h, isVertical, value, pos, align, borderHit }) {
  const isAlignStart = align !== 'end';
  const alignStart = { left: '0', top: '0' };
  const alignEnd = { right: '0', bottom: '0' };
  const alignStyle = isAlignStart ? alignStart : alignEnd;

  if (!isAlignStart) {
    pos -= borderHit;
  }

  // edge
  return h('div', {
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
      'data-value': value
    },
    style: {
      cursor: isVertical ? 'ns-resize' : 'ew-resize',
      position: 'absolute',
      left: isVertical ? '0' : `${pos}px`,
      top: isVertical ? `${pos}px` : '0',
      height: isVertical ? `${borderHit}px` : '100%',
      width: isVertical ? '100%' : `${borderHit}px`,
      pointerEvents: 'auto'
    }
  }, [
    // line
    h('div', {
      style: {
        backgroundColor: 'rgba(50, 50, 50, 0.8)',
        position: 'absolute',
        height: isVertical ? `${1}px` : '100%',
        width: isVertical ? '100%' : `${1}px`,
        ...alignStyle
      }
    })
  ]);
}

function buildBubble({ h, isVertical, label, otherValue, idx, pos, align, style }) {
  const isAlignStart = align !== 'end';
  let bubbleDock;
  if (isVertical) {
    bubbleDock = isAlignStart ? 'left' : 'right';
  } else {
    bubbleDock = isAlignStart ? 'top' : 'bottom';
  }

  // bubble wrapper
  return h('div', {
    style: {
      position: 'absolute',
      [bubbleDock]: '0',
      [isVertical ? 'top' : 'left']: `${pos}px`
    }
  }, [
    // bubble
    h('div', {
      attrs: {
        'data-other-value': otherValue,
        'data-idx': idx
      },
      style: {
        position: 'relative',
        borderRadius: '6px',
        border: '1px solid #666',
        backgroundColor: '#fff',
        padding: '5px 9px',
        textAlign: 'center',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        maxWidth: '150px',
        minWidth: '50px',
        minHeight: '1em',
        pointerEvents: 'auto',
        transform: isVertical ? 'translate(0,-50%)' : 'translate(-50%,0)',
        ...style
      }
    }, [label])
  ]);
}

function buildArea({ h, isVertical, top, height, color, on }) {
  return h('div', {
    style: {
      backgroundColor: color,
      // opacity: 0.2,
      position: 'absolute',
      left: isVertical ? 0 : `${top}px`,
      top: isVertical ? `${top}px` : 0,
      height: isVertical ? `${height}px` : '100%',
      width: isVertical ? '100%' : `${height}px`,
      pointerEvents: 'auto'
    },
    on
  }, []);
}

export default function buildRange({ borderHit, els, isVertical, state, vStart, vEnd, idx }) {
  const hasScale = !!state.scale;
  const start = hasScale ? state.scale(vStart) * state.size : vStart;
  const end = hasScale ? state.scale(vEnd) * state.size : vEnd;
  const height = Math.abs(start - end);
  const top = Math.min(start, end);
  const bottom = top + height;

  if (state.targetRect) {
    const targetSize = isVertical ? state.targetRect.height : state.targetRect.width;
    const targetStart = hasScale ? state.scale(vStart) * targetSize : vStart;
    const targetEnd = hasScale ? state.scale(vEnd) * targetSize : vEnd;
    const targetHeight = Math.abs(targetStart - targetEnd);
    const targetTop = Math.min(targetStart, targetEnd);
    const targetArea = {
      h: state.h,
      isVertical,
      top: targetTop,
      height: targetHeight,
      color: state.settings.target.fill
    };
    if (typeof state.settings.target.fillActive !== 'undefined') {
      targetArea.on = {
        mouseover() {
          this.elm.style.backgroundColor = state.settings.target.fillActive || state.settings.target.fill;
        },
        mouseout() {
          this.elm.style.backgroundColor = state.settings.target.fill;
        }
      };
    }
    els.push(state.h('div', {
      style: {
        position: 'absolute',
        left: `${state.targetRect.x}px`,
        top: `${state.targetRect.y}px`,
        height: `${state.targetRect.height}px`,
        width: `${state.targetRect.width}px`
      }
    }, [
      buildArea(targetArea)
    ]));
  }

  // active range area
  // els.push(buildArea({
  //   h: state.h,
  //   isVertical,
  //   top,
  //   height,
  //   color: state.settings.fill
  // }));

  els.push(buildLine({
    h: state.h,
    isVertical,
    borderHit,
    value: start < end ? vStart : vEnd,
    pos: top,
    align: 'start'
  }));

  els.push(buildLine({
    h: state.h,
    isVertical,
    borderHit,
    value: start < end ? vEnd : vStart,
    pos: bottom,
    align: 'end'
  }));

  const bubbles = state.settings.bubbles;
  if (bubbles && bubbles.show) {
    const fontSize = bubbles.fontSize;
    const fontFamily = bubbles.fontFamily;
    const fill = bubbles.fill;
    const style = {
      fontSize,
      fontFamily,
      color: fill
    };

    const range = [vStart, vEnd];
    els.push(buildBubble({
      h: state.h,
      isVertical,
      align: bubbles.align,
      style,
      idx,
      otherValue: start < end ? vEnd : vStart,
      label: `${state.format(start < end ? vStart : vEnd, range)}`,
      pos: top
    }));

    els.push(buildBubble({
      h: state.h,
      isVertical,
      align: bubbles.align,
      style,
      idx,
      otherValue: start < end ? vStart : vEnd,
      label: `${state.format(start < end ? vEnd : vStart, range)}`,
      pos: bottom
    }));
  }
}

export function getMoveDelta(state) {
  const posDelta = state.active.limitHigh - state.active.end;
  const negDelta = state.active.limitLow - state.active.start;
  let delta = state.current - state.start;
  if (delta < 0) {
    delta = Math.max(delta, negDelta);
  } else {
    delta = Math.min(delta, posDelta);
  }

  return delta;
}

export function nodes(state) {
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
      const delta = getMoveDelta(state);
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
