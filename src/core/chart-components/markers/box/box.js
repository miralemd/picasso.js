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
    maxWidth: 100,
    minWidth: 5
  }
};

/**
 * @typedef settings
 * @type {object}
 * @property {object} major
 * @property {string} major.scale - The scale to use along the major axis
 * @property {object} minor
 * @property {string} minor.scale - The scale to use along the minor axis
 * @property {string} [orientation='vertical']
 * @property {object} [box]
 * @property {boolean} [box.show=true]
 * @property {string} [box.fill='#fff']
 * @property {string} [box.stroke='#000']
 * @property {number} [box.strokeWidth=1]
 * @property {number} [box.width=1]
 * @property {number} [box.maxWidth=100]
 * @property {number} [box.minWidth=5]
 * @property {object} [line]
 * @property {boolean} [line.show=true]
 * @property {string} [stroke='#000']
 * @property {number} [strokeWidth=1]
 * @property {object} [whisker]
 * @property {boolean} [whisker.show=true]
 * @property {string} [whisker.stroke='#000']
 * @property {number} [whisker.strokeWidth=1]
 * @property {number} [whisker.width=1]
 * @property {object} [median]
 * @property {number} [median.show=true]
 * @property {number} [median.stroke='#000']
 * @property {number} [median.strokeWidth=1]
 */

/**
 * @typedef box-marker
 * @property {string} type - "box"
 * @property {marker-box-data} data - Box data
 * @property {marker-box-settings} settings - Box marker settings
 * @example
 * {
 *   type: "box",
 *   data: {
 *    mapTo: {
 *      min: { source: "/qHyperCube/qMeasureInfo/0" },
 *      start: { source: "/qHyperCube/qMeasureInfo/1" },
 *      med: { source: "/qHyperCube/qMeasureInfo/2" },
 *      end: { source: "/qHyperCube/qMeasureInfo/3" },
 *      max: { source: "/qHyperCube/qMeasureInfo/4" },
 *    },
 *    groupBy: {
 *      source: "/qHyperCube/qDimensionInfo/0"
 *    }
 *  },
 *  settings: {
 *    major: {
 *      scale: { source: "/qHyperCube/qDimensionInfo/0" }
 *    },
 *    minor: {
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
 * @typedef data
 * @type {object}
 * @property {number} [min] - min
 * @property {number} [max] - max
 * @property {number} [start] - start
 * @property {number} [end] - end
 * @property {number} [med] - med
 */

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

    this.dispersion.onData(data);

    return this.dispersion.render(this.rect, this.buildShapes);
  },
  beforeUpdate(opts) {
    const {
      settings
    } = opts;

    this.updateSettings(settings);
  },
  buildShapes(item) {
    if (notNumber(item.major)) {
      return [];
    }

    const doodle = this.dispersion.doodle();
    const shapes = [];

    const measureWidth = this.dispersion.blueprint().flipXY ? this.rect.height : this.rect.width;

    function computeWidth(minWidth, maxWidth, multiplier, bandwidth) {
      let width = (bandwidth * measureWidth) * multiplier;

      width = Math.max(minWidth, Math.min(maxWidth, width));

      return width / measureWidth;
    }

    item.style.box.width = computeWidth(item.style.box.minWidth, item.style.box.maxWidth, item.style.box.width, this.dispersion.bandwidth());
    item.style.whisker.width = computeWidth(item.style.box.minWidth, item.style.box.maxWidth, item.style.whisker.width, this.dispersion.bandwidth());

    // Draw the box
    if (item.style.box.show && !notNumber(item.start) && !notNumber(item.end)) {
      const high = Math.max(item.start, item.end);
      const low = Math.min(item.start, item.end);
      shapes.push(doodle.box(
        item.major,
        low,
        (high - low),
        item.style,
        item.data
      ));
    }

    if (item.style.line.show && !notNumber(item.min) && !notNumber(item.start)) {
      // Draw the line min - start
      shapes.push(doodle.verticalLine(item.major, item.start, item.min, 'line', item.style, item.data));
    }
    if (item.style.line.show && !notNumber(item.max) && !notNumber(item.end)) {
      // Draw the line end - max (high)
      shapes.push(doodle.verticalLine(item.major, item.max, item.end, 'line', item.style, item.data));
    }

    // Draw the median line
    if (item.style.median.show && !notNumber(item.med)) {
      shapes.push(doodle.median(item.major, item.med, item.style, item.data));
    }

    // Draw the whiskers
    if (item.style.whisker.show && !notNumber(item.min) && !notNumber(item.max)) {
      // Low whisker
      shapes.push(doodle.whisker(item.major, item.min, item.style, item.data));

      // High whisker
      shapes.push(doodle.whisker(item.major, item.max, item.style, item.data));
    }

    return shapes;
  }
};

export default boxMarkerComponent;
