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
      const horizontal = dock === 'top' || dock === 'bottom';
      const containerRect = event.currentTarget.getBoundingClientRect();
      const containerStart = containerRect[horizontal ? 'left' : 'top'];
      const lengthAttr = horizontal ? 'width' : 'height';
      const length = this.rect[lengthAttr];
      const scroll = this.composer.scroll(this.settings.scroll);
      let currentMove;

      { // local scope to allow reuse of variable names later
        const offset = event[horizontal ? 'clientX' : 'clientY'] - containerStart;
        const scrollState = scroll.getState();
        currentMove = {
          startOffset: offset,
          startScroll: scrollState.start,
          swipe: false
        };
      }

      const mousemove = (e) => {
        const offset = e[horizontal ? 'clientX' : 'clientY'] - containerStart;
        if (!currentMove.swipe) {
          if (Math.abs(currentMove.startOffset - offset) <= 1) {
            return;
          }
          currentMove.swipe = true;
        }

        const scrollState = scroll.getState();
        const scrollMove = ((offset - currentMove.startOffset) / length) * scrollState.max;
        const scrollStart = currentMove.startScroll + scrollMove;
        scroll.moveTo(scrollStart);
      };
      const mouseup = (e) => {
        document.removeEventListener('mousemove', mousemove);
        document.removeEventListener('mouseup', mouseup);

        const offset = e[horizontal ? 'clientX' : 'clientY'] - containerStart;
        const scrollState = scroll.getState();
        if (currentMove.swipe) {
          const scrollMove = ((offset - currentMove.startOffset) / length) * scrollState.max;
          const scrollStart = currentMove.startScroll + scrollMove;
          scroll.moveTo(scrollStart);
        } else {
          const scrollCenter = (offset / length) * scrollState.max;
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

  beforeRender: function beforeRender(opts) {
    const inner = opts.inner;
    this.rect = inner;
    return inner;
  },

  render: function render(h) {
    const dock = this.settings.dock;
    const horizontal = dock === 'top' || dock === 'bottom';
    const lengthAttr = horizontal ? 'width' : 'height';

    const _rect = this.rect;
    const length = _rect[lengthAttr];

    const scrollState = this.composer.scroll(this.settings.scroll).getState();
    const thumbStart = Math.max((length * scrollState.start) / scrollState.max, scrollState.min);
    const thumbRange = Math.min((length * scrollState.viewSize) / (scrollState.max - scrollState.min), scrollState.max);

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
