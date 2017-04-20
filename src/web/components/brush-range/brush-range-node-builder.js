
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

function buildArea({ h, isVertical, top, height, color }) {
  return h('div', {
    style: {
      backgroundColor: color,
      opacity: 0.2,
      position: 'absolute',
      left: isVertical ? 0 : `${top}px`,
      top: isVertical ? `${top}px` : 0,
      height: isVertical ? `${height}px` : '100%',
      width: isVertical ? '100%' : `${height}px`
    }
  }, []);
}

export default function buildRange({ borderHit, els, isVertical, state, vStart, vEnd, idx }) {
  const start = state.scale(vStart) * state.size;
  const end = state.scale(vEnd) * state.size;
  const height = Math.abs(start - end);
  const top = Math.min(start, end);
  const bottom = top + height;

  if (state.targetRect) {
    const targetSize = isVertical ? state.targetRect.height : state.targetRect.width;
    const targetStart = state.scale(vStart) * targetSize;
    const targetEnd = state.scale(vEnd) * targetSize;
    const targetHeight = Math.abs(targetStart - targetEnd);
    const targetTop = Math.min(targetStart, targetEnd);
    els.push(state.h('div', {
      style: {
        position: 'absolute',
        left: `${state.targetRect.x}px`,
        top: `${state.targetRect.y}px`,
        height: `${state.targetRect.height}px`,
        width: `${state.targetRect.width}px`
      }
    }, [
      buildArea({
        h: state.h,
        isVertical,
        top: targetTop,
        height: targetHeight,
        color: state.settings.target.fill
      })
    ]));
  }

  // active range area
  els.push(buildArea({
    h: state.h,
    isVertical,
    top,
    height,
    color: state.settings.fill
  }));

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

    els.push(buildBubble({
      h: state.h,
      isVertical,
      align: bubbles.align,
      style,
      idx,
      otherValue: start < end ? vEnd : vStart,
      label: `${state.format(start < end ? vStart : vEnd)}`,
      pos: top
    }));

    els.push(buildBubble({
      h: state.h,
      isVertical,
      align: bubbles.align,
      style,
      idx,
      otherValue: start < end ? vStart : vEnd,
      label: `${state.format(start < end ? vEnd : vStart)}`,
      pos: bottom
    }));
  }
}
