import createComponentFactory from '../component';
import dispersion from './generic/dispersion';
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

const boxMarker = {
  require: ['composer'],
  defaultSettings: {
    settings: {},
    data: {}
  },
  created() {
    this.rect = { x: 0, y: 0, width: 0, height: 0 };
    this.dispersion = dispersion(this.composer, DEFAULT_STYLE_SETTINGS, this.settings.settings);
    this.updateSettings(this.settings);
  },
  updateSettings(settings) {
    this.dispersion.updateSettings(settings);

    // Default to vertical
    if (this.settings.settings.vertical === undefined) {
      this.settings.settings.vertical = true;
    }

    // Default to show whiskers
    if (this.settings.settings.whiskers === undefined) {
      this.settings.settings.whiskers = true;
    }
  },
  beforeRender(opts) {
    const {
      inner
    } = opts;
    this.rect = inner;
    return inner;
  },
  render({ data }) {
    // Filter out points we cannot render
    /* const items = this.items.filter(item =>
      [item.min, item.max].indexOf(null) === -1 || [item.start, item.end].indexOf(null) === -1
    );*/

    // Calculate box width
    this.boxWidth = this.dispersion.bandwidth() * this.rect.width;

    this.dispersion.onData(data);

    return this.dispersion.render(this.rect, this.renderDataPoint);
  },
  beforeUpdate(opts) {
    const {
      settings
    } = opts;

    this.updateSettings(settings);
  },
  renderDataPoint(item) {
    if (notNumber(item.x)) {
      return;
    }

    item.style.box.width = Math.max(item.style.box.minWidth,
      Math.min(item.style.box.maxWidth,
        item.style.box.width * this.dispersion.bandwidth() * this.rect.width))
      / this.rect.width;

    item.style.whisker.width = Math.max(item.style.box.minWidth,
      Math.min(item.style.box.maxWidth,
        item.style.whisker.width * this.dispersion.bandwidth() * 0.5 * this.rect.width))
      / this.rect.width;

    if (item.style.line.show && !notNumber(item.min) && !notNumber(item.start)) {
      // Draw the line min - start
      this.dispersion.doodle().verticalLine(item.x, item.start, item.min, 'line', item.style);
    }
    if (item.style.line.show && !notNumber(item.max) && !notNumber(item.end)) {
      // Draw the line end - max (high)
      this.dispersion.doodle().verticalLine(item.x, item.max, item.end, 'line', item.style);
    }
    // Draw the box
    if (item.style.box.show && !notNumber(item.start) && !notNumber(item.end)) {
      const high = Math.max(item.start, item.end);
      const low = Math.min(item.start, item.end);
      this.dispersion.doodle().box(
        item.x,
        low,
        (high - low),
        item.style
      );
    }

    // Draw the median line
    if (item.style.median.show && !notNumber(item.med)) {
      this.dispersion.doodle().median(item.x, item.med, item.style);
    }

    // Draw the whiskers
    if (item.style.whisker.show && !notNumber(item.min) && !notNumber(item.max)) {
      // Low whisker
      this.dispersion.doodle().whisker(item.x, item.min, item.style);

      // High whisker
      this.dispersion.doodle().whisker(item.x, item.max, item.style);
    }
  }
};

export default createComponentFactory(boxMarker);
