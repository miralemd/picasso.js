import Dispersion from './generic/dispersion';
import notNumber from '../../utils/undef';
/*
const DEFAULT_DATA_SETTINGS = {
  x: 0.5,
  y: 0.5,
  min: 0,
  start: 0,
  med: 0.5,
  end: 1,
  max: 1,
  vertical: false,
}*/

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
    width: 0.75,
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
 *   data: {
 *    mapTo: {
 *     min: { source: "/qHyperCube/qMeasureInfo/0" },
 *     start: { source: "/qHyperCube/qMeasureInfo/1" },
 *     med: { source: "/qHyperCube/qMeasureInfo/2" },
 *     end: { source: "/qHyperCube/qMeasureInfo/3" },
 *     max: { source: "/qHyperCube/qMeasureInfo/4" },
 *    },
 *    groupBy: {
 *     source: "/qHyperCube/qDimensionInfo/0"
 *     }
 *  },
 *  settings: {
 *    x: {
 *      scale: { source: "/qHyperCube/qDimensionInfo/0" }
 *    },
 *    y: {
 *      scale: { source: ["/qHyperCube/qMeasureInfo/0",
 *               "/qHyperCube/qMeasureInfo/1",
 *               "/qHyperCube/qMeasureInfo/2",
 *               "/qHyperCube/qMeasureInfo/3",
 *               "/qHyperCube/qMeasureInfo/4"] }
 *    }
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
    if (notNumber(item.x)) {
      return;
    }

    item.style.box.width = Math.max(item.style.box.minWidth,
      Math.min(item.style.box.maxWidth,
        item.style.box.width * this.bandwidth * this.rect.width))
      / this.rect.width;

    item.style.whisker.width = Math.max(item.style.box.minWidth,
      Math.min(item.style.box.maxWidth,
        item.style.whisker.width * this.bandwidth * 0.5 * this.rect.width))
      / this.rect.width;

    if (item.style.line.show && !notNumber(item.min) && !notNumber(item.start)) {
      // Draw the line min - start
      this.doodle.verticalLine(item.x, item.start, item.min, 'line', item.style);
    }
    if (item.style.line.show && !notNumber(item.max) && !notNumber(item.end)) {
      // Draw the line end - max (high)
      this.doodle.verticalLine(item.x, item.max, item.end, 'line', item.style);
    }
    // Draw the box
    if (item.style.box.show && !notNumber(item.start) && !notNumber(item.end)) {
      const high = Math.max(item.start, item.end);
      const low = Math.min(item.start, item.end);
      this.doodle.box(
        item.x,
        low,
        (high - low),
        item.style
      );
    }

    // Draw the median line
    if (item.style.median.show && !notNumber(item.med)) {
      this.doodle.median(item.x, item.med, item.style);
    }

    // Draw the whiskers
    if (item.style.whisker.show && !notNumber(item.min) && !notNumber(item.max)) {
      // Low whisker
      this.doodle.whisker(item.x, item.min, item.style);

      // High whisker
      this.doodle.whisker(item.x, item.max, item.style);
    }
  }
}

export function box(...args) {
  return new Box(...args);
}
