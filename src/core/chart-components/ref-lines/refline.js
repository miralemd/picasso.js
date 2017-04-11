import extend from 'extend';
import { transposer } from '../../transposer/transposer';
import { oobManager } from './oob';
import { createLineWithLabel } from './lines-and-labels';

/**
 * @typedef settings
 * @type {object}
 * @property {refline-generic-style} [style=refline-generic-style] - x coordinate
 * @property {reflines-x[]} [x=refline-line[]] - lines along X
 * @property {reflines-y[]} [y=refline-line[]] - lines along Y
 */

/**
 * @typedef refline-generic-style
 * @property {refline-oob-style} [oob=refline-oob-style] - Style for out of bounds object (oob)
 * @property {refline-line} [line=refline-line] - Generic style for lines
 */

/**
 * @typedef refline-oob-style
 * @property {boolean} [show=true] - Show out of bounds items
 * @property {string} [type=undefined] - EXPERIMENTAL:  Set this to 'arc' for an experimental out of bounds shape (only works with SVG)
 * @property {integer} [width=10] - Width of the out of bounds object
 * @property {string} [fill='#1A1A1A'] - Fill color of the OOB object
 * @property {string} [stroke='transparent'] - Stroke of the OOB object
 * @property {integer} [strokeWidth=0] - Stroke width of the OOB object
 * @property {integer} [opacity=1] - Opacity of the OOB object
 * @property {refline-generic-text} [opacity=refline-generic-text] - Text configuration for out of bounds
 * @property {refline-generic-object} [triangle=refline-generic-object] - The triangle in OOB
 * @property {object} [padding] - Padding on X
 * @property {number} [padding.x=28] - Padding on X
 * @property {number} [padding.y=5] - Padding on X
 */

/**
 * @typedef refline-generic-text
 * @property {string} [text=''] - Text (if applicable)
 * @property {string} [fontSize='12px'] - Font size (if applicable)
 * @property {string} [fontFamily='Arial'] - Font family
 * @property {string} [fill='#fff'] - Fill color
 * @property {string} [stroke='transparent'] - Stroke
 * @property {integer} [strokeWidth=0] - Stroke width
 * @property {integer} [opacity=1] - Opacity
 */

/**
 * @typedef refline-line
 * @property {integer} value - The value of the reference line. If a scale is specified, it is applied.
 * @property {Scale} [scale=undefined] - Scale to use (if undefined will use normalized value 0-1)
 * @property {refline-generic-object} [style=refline-generic-object] - The style of the line
 * @property {refline-line-label} [style=refline-line-label] - The label style of the line
 */

/**
 * @typedef refline-line-label
 * @property {integer} padding=5 - Padding inside the label
 * @property {string} [text=''] - Text
 * @property {string} [fontSize='12px'] - Font size
 * @property {string} [fontFamily='Arial'] - Font family
 * @property {string} [stroke='transparent'] - Stroke
 * @property {integer} [strokeWidth=0] - Stroke width
 * @property {integer} [opacity=1] - Opacity
 * @property {number|string} [align=0] - Alignment property left to right (0 = left, 1 = right). Also supports string ('left', 'center', 'middle', 'right')
 * @property {number|string} [vAlign=0] - Alignment property top to bottom (0 = top, 1 = bottom). Also supports string ('top', 'center', 'middle', 'bottom')
 * @property {refline-line-label-background} [background=refline-line-label-background] - The background style (rect behind text)
 */

 /**
  * @typedef refline-line-label-background
  * @property {string} [fill='#fff'] - Fill color
  * @property {string} [stroke='transparent'] - Stroke
  * @property {integer} [strokeWidth=0] - Stroke width
  * @property {integer} [opacity=0.5] - Opacity
  */

 /**
  * @typedef refline-generic-object
  * @property {string} [fill='#fff'] - Fill color
  * @property {string} [stroke='transparent'] - Stroke
  * @property {integer} [strokeWidth=0] - Stroke width
  * @property {integer} [opacity=1] - Opacity
  */

const refLineComponent = {
  require: ['chart', 'renderer', 'dockConfig'],
  defaultSettings: {
    displayOrder: 0,
    style: {
      oob: {
        show: true,
        width: 10,
        fill: '#1A1A1A',
        stroke: 'transparent',
        strokeWidth: 0,
        opacity: 1,
        text: {
          fontFamily: 'Arial',
          stroke: 'transparent',
          fill: '#fff',
          strokeWidth: 0,
          opacity: 1
        },
        triangle: {
          fill: '#4D4D4D',
          stroke: 'transparent',
          strokeWidth: 0,
          opacity: 1
        },
        padding: {
          x: 28,
          y: 5
        }
      },
      line: {
        stroke: '#000'
      }
    }
  },

  preferredSize() {
    return 30;
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
    let settings = this.settings;

    // Setup lines for X and Y
    this.lines = {
      x: [],
      y: []
    };

    this.lines.x = (settings.lines && settings.lines.x) || [];
    this.lines.y = (settings.lines && settings.lines.y) || [];

    if (this.lines.x.length === 0 && this.lines.y.length === 0) {
      return [];
    }

    let oob = {
      x0: 0,
      x1: 0,
      y0: 0,
      y1: 0
    };

    // Convert a value to an actual position using the scale
    this.lines.x = this.lines.x.map((line) => {
      if (line.scale) {
        let scale = this.chart.scale(line.scale);
        return extend(line, { position: scale(line.value) });
      }

      return extend(line, { position: line.value });
    });
    // Set all Y lines to flipXY by default
    // This makes the transposer flip them individually
    this.lines.y = this.lines.y.map((line) => {
      if (line.scale) {
        let scale = this.chart.scale(line.scale);
        return extend(line, { position: scale(line.value), flipXY: true });
      }

      return extend(line, { position: line.value, flipXY: true });
    });

    // Move out of bounds lines (OOB) to separate rendering
    this.lines.x = this.lines.x.filter((line) => {
      if (line.position < 0 || line.position > 1) {
        oob[`x${line.position > 1 ? 1 : 0}`]++;
        return false;
      }
      return true;
    });

    this.lines.y = this.lines.y.filter((line) => {
      if (line.position < 0 || line.position > 1) {
        oob[`y${line.position > 1 ? 1 : 0}`]++;
        return false;
      }
      return true;
    });

    let items = [];

    // Loop through all X and Y lines
    [...this.lines.x, ...this.lines.y].forEach((p) => {
      let show = p.show === true || typeof p.show === 'undefined';

      if (show) {
        // Create line with labels
        createLineWithLabel({ blueprint: this.blueprint, renderer: this.renderer, p, settings, items });
      }
    });

    // Handle out of bounds
    if (settings.style.oob.show) {
      oobManager({ blueprint: this.blueprint, oob, settings, items });
    }

    return items;
  }
};

export default refLineComponent;
