/* global document */
import createComponentFactory from './component';

/**
 * @typedef scrollbar-settings
 * @property {boolean} [backgroundColor = '#eee']
 * @property {boolean} [thumbColor = '#ccc']
 * @property {boolean} [width = 16]
 */

const scrollbar = {
  require: ['composer'],
  on: {
    mousedown(event) {
      event.preventDefault();
      const dock = this.settings.dock;
      const invert = this.settings.settings.invert;
      const horizontal = dock === 'top' || dock === 'bottom';
      const containerRect = event.currentTarget.getBoundingClientRect();
      const containerStart = containerRect[horizontal ? 'left' : 'top'];
      const lengthAttr = horizontal ? 'width' : 'height';
      const length = this.rect[lengthAttr];
      const scroll = this.composer.scroll(this.settings.scroll);
      let currentMove;

      { // local scope to allow reuse of variable names later
        let offset = event[horizontal ? 'clientX' : 'clientY'] - containerStart;
        if (invert) {
          offset = length - offset;
        }
        const scrollState = scroll.getState();

        currentMove = {
          startOffset: offset,
          startScroll: scrollState.start,
          swipe: false
        };

        // Detect swipe start outsize the thumb & change startScroll to jump the scroll there.
        const scrollPoint = ((offset / length) * (scrollState.max - scrollState.min)) + scrollState.min;
        if (scrollPoint < scrollState.start) {
          currentMove.startScroll = scrollPoint;
        } else if (scrollPoint > scrollState.start + scrollState.viewSize) {
          currentMove.startScroll = scrollPoint - scrollState.viewSize;
        }
      }

      const mousemove = (e) => {
        let offset = e[horizontal ? 'clientX' : 'clientY'] - containerStart;
        if (invert) {
          offset = length - offset;
        }
        if (!currentMove.swipe) {
          if (Math.abs(currentMove.startOffset - offset) <= 1) {
            return;
          }
          currentMove.swipe = true;
        }

        const scrollState = scroll.getState();
        const scrollMove = ((offset - currentMove.startOffset) / length) * (scrollState.max - scrollState.min);
        const scrollStart = currentMove.startScroll + scrollMove;
        scroll.moveTo(scrollStart);
      };
      const mouseup = (e) => {
        document.removeEventListener('mousemove', mousemove);
        document.removeEventListener('mouseup', mouseup);

        let offset = e[horizontal ? 'clientX' : 'clientY'] - containerStart;
        if (invert) {
          offset = length - offset;
        }
        const scrollState = scroll.getState();
        if (currentMove.swipe) {
          const scrollMove = ((offset - currentMove.startOffset) / length) * (scrollState.max - scrollState.min);
          const scrollStart = currentMove.startScroll + scrollMove;
          scroll.moveTo(scrollStart);
        } else {
          const scrollCenter = ((offset / length) * (scrollState.max - scrollState.min)) + scrollState.min;
          const scrollStart = scrollCenter - (scrollState.viewSize / 2);
          scroll.moveTo(scrollStart);
        }
      };
      document.addEventListener('mousemove', mousemove);
      document.addEventListener('mouseup', mouseup);
    }
  },
  defaultSettings: {
    settings: {
      backgroundColor: '#eee',
      thumbColor: '#ccc',
      width: 16 // 32 for touch
    }
  },
  created: function created() {
    this.rect = {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    };
  },

  preferredSize: function preferredSize() {
    return this.settings.settings.width;
  },

  resize: function resize(opts) {
    const inner = opts.inner;
    this.rect = inner;
    return inner;
  },

  render: function render(h) {
    const dock = this.settings.dock;
    const invert = this.settings.settings.invert;
    const horizontal = dock === 'top' || dock === 'bottom';
    const lengthAttr = horizontal ? 'width' : 'height';

    const _rect = this.rect;
    const length = _rect[lengthAttr];

    const scrollState = this.composer.scroll(this.settings.scroll).getState();
    let thumbStart = (length * (scrollState.start - scrollState.min)) / (scrollState.max - scrollState.min);
    const thumbRange = (length * scrollState.viewSize) / (scrollState.max - scrollState.min);

    if (invert) {
      thumbStart = length - thumbStart - thumbRange;
    }

    return h(
      'div',
      {
        style: {
          position: 'relative',
          width: '100%',
          height: '100%',
          background: this.settings.settings.backgroundColor
        }
      },
      [].concat(h('div', {
        class: {
          scroller: true
        },
        style: {
          position: 'absolute',
          [horizontal ? 'left' : 'top']: `${thumbStart}px`,
          [horizontal ? 'top' : 'left']: '25%',
          [horizontal ? 'height' : 'width']: '50%', // ${width}px
          [lengthAttr]: `${thumbRange}px`,
          background: this.settings.settings.thumbColor
        }
      }))
    );
  },

  renderer: 'dom'
};

export default createComponentFactory(scrollbar);