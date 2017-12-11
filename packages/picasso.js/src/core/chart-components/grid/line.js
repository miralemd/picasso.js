import extend from 'extend';
import { transposer } from '../../transposer/transposer';
import { continuousDefaultSettings } from '../axis/axis-default-settings';
import { updateScaleSize } from '../../scales';

/**
 * Generate array of lines (ticks) from scale
 *
 * @param {object} scale - A scale supplied by the chart
 * @param {object} settings - The settings object from the grid line component
 * @param {object} rect - The rect containing width and height to renderer in
 * @returns {array} - Returns an array of ticks
 * @ignore
 */
function lineGen(scale, distance) {
  if (!scale || !distance) {
    return [];
  }
  return (scale.cachedTicks && scale.cachedTicks()) || scale.ticks({ distance });
}

const gridLineComponent = {
  created() {
  },

  require: ['chart', 'renderer'],
  defaultSettings: {
    displayOrder: 0,
    styles: {}
  },

  beforeRender(opts) {
    this.rect = opts.size;

    this.blueprint = transposer();

    this.blueprint.width = this.rect.width;
    this.blueprint.height = this.rect.height;
    this.blueprint.x = this.rect.x;
    this.blueprint.y = this.rect.y;
    this.blueprint.crisp = true;
  },

  render() {
    // Setup scales
    this.x = this.settings.x ? this.chart.scale(this.settings.x) : null;
    this.y = this.settings.y ? this.chart.scale(this.settings.y) : null;
    updateScaleSize(this, 'x', this.rect.width);
    updateScaleSize(this, 'y', this.rect.height);

    // Return an empty array to abort rendering when no scales are available to renderer
    if (!this.x && !this.y) {
      return [];
    }

    // Base the styling upon the axis defaults
    const axisDefaults = continuousDefaultSettings();
    this.settings.ticks = extend({}, axisDefaults.ticks, this.settings.ticks || {});
    this.settings.minorTicks = extend({}, axisDefaults.minorTicks, this.settings.minorTicks || {});

    // Setup lines for X and Y
    this.lines = {
      x: [],
      y: []
    };

    // Use the lineGen function to generate appropriate ticks
    this.lines.x = lineGen(this.x, this.rect.width);
    this.lines.y = lineGen(this.y, this.rect.height);

    // Set all Y lines to flipXY by default
    // This makes the transposer flip them individually
    this.lines.y = this.lines.y.map(i => extend(i, { flipXY: true }));

    // Define a style that differs between major and minor ticks.
    let style = {};

    // Loop through all X and Y lines
    [...this.lines.x, ...this.lines.y].forEach((p) => {
      style = p.isMinor ? this.settings.minorTicks : this.settings.ticks;

      // If the style's show is falsy, don't renderer this item (to respect axis settings).
      if (style.show) {
        // Use the transposer to handle actual positioning
        this.blueprint.push({
          type: 'line',
          x1: p.position,
          y1: 0,
          x2: p.position,
          y2: 1,
          stroke: style.stroke || 'black',
          strokeWidth: style.strokeWidth || 1,
          flipXY: p.flipXY || false // This flips individual points (Y-lines)
        });
      }
    });

    return this.blueprint.output();
  }
};

export default gridLineComponent;