
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

export default function buildRange({ borderHit, els, isVertical, state, vStart, vEnd, idx }) {
  const start = state.scale(vStart) * state.size;
  const end = state.scale(vEnd) * state.size;
  const height = Math.abs(start - end);
  const top = Math.min(start, end);
  const bottom = top + height;

  let cssTop;
  let cssLeft;
  let cssWidth;
  let cssHeight;

  if (isVertical) {
    cssTop = `${top}px`;
    cssLeft = 0;
    cssWidth = '100%';
    cssHeight = `${height}px`;
  } else {
    cssTop = '0';
    cssLeft = `${top}px`;
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

  if (state.bubbles && state.bubbles.show) {
    const fontSize = state.bubbles.fontSize;
    const fontFamily = state.bubbles.fontFamily;
    const fill = state.bubbles.fill;
    const style = {
      fontSize,
      fontFamily,
      color: fill
    };

    els.push(buildBubble({
      h: state.h,
      isVertical,
      align: state.bubbles.align,
      style,
      idx,
      otherValue: start < end ? vEnd : vStart,
      label: `${state.format(start < end ? vStart : vEnd)}`,
      pos: top
    }));

    els.push(buildBubble({
      h: state.h,
      isVertical,
      align: state.bubbles.align,
      style,
      idx,
      otherValue: start < end ? vStart : vEnd,
      label: `${state.format(start < end ? vEnd : vStart)}`,
      pos: bottom
    }));
  }
}
