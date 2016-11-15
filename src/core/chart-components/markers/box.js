import Dispersion from './generic/dispersion';

const DEFAULT_STYLE_SETTINGS = {
  line: {
    stroke: '#000',
    strokeWidth: 1
  },
  med: {
    stroke: '#000',
    strokeWidth: 1
  },
  whisker: {
    stroke: '#000',
    strokeWidth: 1,
    fill: '',
    type: 'line',
    width: 1
  },
  box: {
    fill: '#fff',
    stroke: '#000',
    strokeWidth: 1,
    width: 1,
    maxWidth: 100,
    minWidth: 5
  }
};

/**
 * @typedef marker-box
 * @property {string} type - "box"
 * @property {data-ref} data - Box data
 * @property {marker-box-settings} settings - Box marker settings
 * @example
 * {
 *   type: "box",
 *   data: { source: "/qDimensionInfo/0" },
 *  settings: {
 *    x: { source: "/qDimensionInfo/0" },
 *    y: { source: ["/qMeasureInfo/0",
 *                  "/qMeasureInfo/1",
 *                  "/qMeasureInfo/2",
 *                  "/qMeasureInfo/3",
 *                  "/qMeasureInfo/4"] },
 *    min: { source: "/qMeasureInfo/0" },
 *    max: { source: "/qMeasureInfo/1" },
 *    start: { source: "/qMeasureInfo/2" },
 *    end: { source: "/qMeasureInfo/3" },
 *    med: { source: "/qMeasureInfo/4" }
 *  }
 * }
 */

/**
 * @typedef marker-box-settings
 * @property {marker-box-data} min - min
 * @property {marker-box-data} max - max
 * @property {marker-box-data} start - start
 * @property {marker-box-data} end - end
 * @property {marker-box-data} med - med
 */

/**
 * @typedef marker-box-data
 */

export default class Box extends Dispersion {
  constructor(obj, composer) {
    super(obj, composer, DEFAULT_STYLE_SETTINGS);

    // Default to vertical
    if (this.settings.vertical === undefined) {
      this.settings.vertical = true;
    }

    // Default to show whiskers
    if (this.settings.whiskers === undefined) {
      this.settings.whiskers = true;
    }
    this.onData(); // to be removed?
  }

  render() {
    // Filter out points we cannot render
    const items = this.items.filter(item =>
      [item.min, item.max].indexOf(null) === -1 || [item.start, item.end].indexOf(null) === -1
    );

    // Calculate box width
    this.boxWidth = this.bandwidth * this.rect.width;

    super.render(items);
  }

  renderDataPoint(item) {
    item.style.box.width = Math.max(item.style.box.minWidth,
      Math.min(item.style.box.maxWidth,
        item.style.box.width * this.bandwidth * this.rect.width))
        / this.rect.width;

    item.style.whisker.width = Math.max(item.style.box.minWidth,
      Math.min(item.style.box.maxWidth,
        item.style.whisker.width * this.bandwidth * 0.5 * this.rect.width))
        / this.rect.width;

    if (item.min !== null && item.max !== null) {
      // Draw the line min - start
      this.doodle.verticalLine(item.x, item.start, item.min, 'line', item.style);

      // Draw the line end - max (high)
      this.doodle.verticalLine(item.x, item.max, item.end, 'line', item.style);
    }

    // Draw the box
    const high = Math.max(item.start, item.end);
    const low = Math.min(item.start, item.end);

    this.doodle.box(
      item.x,
      low,
      (high - low),
      item.style
    );

    // Draw the whiskers
    if (this.settings.whiskers && item.min !== null && item.max !== null) {
      // Low whisker
      this.doodle.whisker(item.x, item.min, item.style);

      // High whisker
      this.doodle.whisker(item.x, item.max, item.style);
    }

    // Draw the median line
    if (item.med !== null) {
      this.doodle.median(item.x, item.med, item.style);
    }
  }
}

export function box(...args) {
  return new Box(...args);
}
