import extend from 'extend';

import dispersion from '../generic/dispersion';
import { notNumber } from '../../../utils/math';

const DEFAULT_STYLE_SETTINGS = {
  line: {
    show: true,
    stroke: '#000',
    strokeWidth: 1
  },
  median: {
    show: true,
    stroke: '#000',
    strokeWidth: 1
  },
  whisker: {
    show: true,
    stroke: '#000',
    strokeWidth: 1,
    fill: '',
    type: 'line',
    width: 1
  },
  box: {
    show: true,
    fill: '#fff',
    stroke: '#000',
    strokeWidth: 1,
    width: 1,
    maxWidthPx: 100,
    minWidthPx: 1,
    minHeightPx: 1
  }
};

function cap(min, max, value) {
  return Math.max(min, Math.min(max, value));
}

const boxMarkerComponent = {
  require: ['chart'],
  defaultSettings: {
    settings: {},
    data: {}
  },
  created() {
    this.rect = { x: 0, y: 0, width: 0, height: 0 };
    this.dispersion = dispersion(this.chart, DEFAULT_STYLE_SETTINGS, this.settings.settings);
    this.updateSettings(this.settings);
  },
  updateSettings(settings) {
    this.dispersion.updateSettings(settings);

    // Default to vertical
    if (this.settings.settings.orientation === undefined) {
      this.settings.settings.orientation = 'vertical';
    }

    // Default to show whiskers
    if (this.settings.settings.whiskers === undefined) {
      this.settings.settings.whiskers = true;
    }
  },
  beforeRender(opts) {
    this.rect = opts.size;
  },
  render({ data }) {
    // Filter out points we cannot render
    /* const items = this.items.filter(item =>
      [item.min, item.max].indexOf(null) === -1 || [item.start, item.end].indexOf(null) === -1
    );*/

    // Calculate box width
    this.boxWidth = this.dispersion.bandwidth() * this.rect.width;

    this.dispersion.onData(data, this.rect);

    return this.dispersion.render(this.rect, this.buildShapes);
  },
  beforeUpdate(opts) {
    const {
      settings
    } = opts;

    this.updateSettings(settings);
  },
  buildShapes({ item, blueprint, doodle }) {
    if (notNumber(item.major)) {
      return [];
    }

    const shapes = [];

    let bandwidth = this.dispersion.bandwidth();
    const span = item.majorEnd - item.majorStart;
    let majorStart = item.major;
    if (item.majorStart !== null && !isNaN(span)) {
      majorStart = item.majorStart + (span * 0.5);
      bandwidth = Math.abs(span);
    }

    function getCommonStuff(width) {
      const majorStartModified = Math.floor(majorStart * width);
      const majorEnd = Math.floor((majorStart + (item.style.box.width * bandwidth)) * width);
      const boxWidth = cap(item.style.box.minWidthPx, item.style.box.maxWidthPx, majorEnd - majorStartModified);

      return {
        majorStartModified,
        majorEnd,
        boxWidth
      };
    }

    // Draw the box
    if (item.style.box.show && !notNumber(item.start) && !notNumber(item.end)) {
      const high = Math.max(item.start, item.end);
      const low = Math.min(item.start, item.end);

      shapes.push(blueprint.processItem({
        fn: ({ width, height }) => {
          const highModified = cap(-100, height + 200, Math.floor(high * height));
          const lowModified = cap(-100, height + 200, Math.floor(low * height));

          const {
            majorStartModified,
            boxWidth
          } = getCommonStuff(width);

          const wantedHeight = highModified - lowModified;
          const boxHeight = Math.max(item.style.box.minHeightPx, wantedHeight);
          const yModifier = (boxHeight - wantedHeight) / 2;

          return extend(doodle.style({}, 'box', item.style), {
            type: 'rect',
            x: majorStartModified - Math.floor(boxWidth / 2),
            y: lowModified - yModifier,
            height: boxHeight,
            width: boxWidth
          });
        },
        crisp: true
      }));
    }

    if (item.style.line.show && !notNumber(item.min) && !notNumber(item.start)) {
      // Draw the line min - start
      // shapes.push(blueprint.processItem(doodle.verticalLine(item.major, item.start, item.min, 'line', item.style, item.data)));
      shapes.push(blueprint.processItem({
        fn: ({ width, height }) => {
          const {
            majorStartModified
          } = getCommonStuff(width);

          return extend(doodle.style({}, 'line', item.style), {
            type: 'line',
            y1: Math.floor(item.start * height),
            x1: majorStartModified,
            y2: Math.floor(item.min * height),
            x2: majorStartModified
          });
        },
        crisp: true
      }));
    }
    if (item.style.line.show && !notNumber(item.max) && !notNumber(item.end)) {
      // Draw the line end - max (high)
      // shapes.push(blueprint.processItem(doodle.verticalLine(item.major, item.max, item.end, 'line', item.style, item.data)));
      shapes.push(blueprint.processItem({
        fn: ({ width, height }) => {
          const {
            majorStartModified
          } = getCommonStuff(width);

          return extend(doodle.style({}, 'line', item.style), {
            type: 'line',
            y1: Math.floor(item.max * height),
            x1: majorStartModified,
            y2: Math.floor(item.end * height),
            x2: majorStartModified
          });
        },
        crisp: true
      }));
    }

    // Draw the median line
    if (item.style.median.show && !notNumber(item.med)) {
      shapes.push(blueprint.processItem({
        fn: ({ width, height }) => {
          const {
            majorStartModified,
            boxWidth
          } = getCommonStuff(width);

          return extend(doodle.style({}, 'median', item.style), {
            type: 'line',
            y1: item.med * height,
            x1: majorStartModified - Math.floor(boxWidth / 2),
            y2: item.med * height,
            x2: majorStartModified + Math.floor(boxWidth / 2)
          });
        },
        crisp: true
      }));
    }

    // Draw the whiskers
    if (item.style.whisker.show) {
      // Low whisker
      if (!notNumber(item.min)) {
        shapes.push(blueprint.processItem({
          fn: ({ width, height }) => {
            const {
              majorStartModified,
              boxWidth
            } = getCommonStuff(width);
            const whiskerWidth = boxWidth * item.style.whisker.width;

            return extend(doodle.style({ type: 'line' }, 'whisker', item.style), {
              y1: Math.floor(item.min * height),
              x1: majorStartModified - Math.floor(whiskerWidth / 2),
              y2: Math.floor(item.min * height),
              x2: majorStartModified + Math.floor(whiskerWidth / 2),
              cx: majorStartModified,
              cy: Math.floor(item.min * height),
              width: whiskerWidth,
              r: whiskerWidth / 2
            });
          },
          crisp: true
        }));
      }

      if (!notNumber(item.max)) {
        // High whisker
        shapes.push(blueprint.processItem({
          fn: ({ width, height }) => {
            const {
              majorStartModified,
              boxWidth
            } = getCommonStuff(width);
            const whiskerWidth = boxWidth * item.style.whisker.width;

            return extend(doodle.style({ type: 'line' }, 'whisker', item.style), {
              y1: Math.floor(item.max * height),
              x1: majorStartModified - Math.floor(whiskerWidth / 2),
              y2: Math.floor(item.max * height),
              x2: majorStartModified + Math.floor(whiskerWidth / 2),
              cx: majorStartModified,
              cy: Math.floor(item.max * height),
              width: whiskerWidth,
              r: whiskerWidth / 2
            });
          },
          crisp: true
        }));
      }
    }

    return shapes;
  }
};

export default boxMarkerComponent;
