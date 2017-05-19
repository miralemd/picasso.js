import extend from 'extend';

function parseTitle(text, join, table, scale) {
  let title = '';
  if (typeof text === 'function') {
    title = text(table);
  } else if (typeof text === 'string') {
    title = text;
  } else if (scale && scale.sources) {
    if (Array.isArray(scale.sources)) {
      const titles = scale.sources.map(s => table.findField(s).title());
      title = titles.join(join);
    } else {
      title = table.findField(scale.sources).title();
    }
  }

  return title;
}

function getTextAnchor(dock, anchor) {
  let val = 'middle';
  if (dock === 'left') {
    if (anchor === 'top') {
      val = 'end';
    } else if (anchor === 'bottom') {
      val = 'start';
    }
  } else if (dock === 'right') {
    if (anchor === 'top') {
      val = 'start';
    } else if (anchor === 'bottom') {
      val = 'end';
    }
  } else if (anchor === 'left') {
    val = 'start';
  } else if (anchor === 'right') {
    val = 'end';
  }
  return val;
}

function generateTitle({
  title,
  definitionSettings,
  dock,
  rect,
  measureText
}) {
  const struct = {
    type: 'text',
    text: title,
    x: 0,
    y: 0,
    dx: 0,
    dy: 0,
    anchor: getTextAnchor(dock, definitionSettings.anchor),
    baseline: 'alphabetical'
  };

  extend(struct, definitionSettings.style);
  const textRect = measureText(struct);

  if (dock === 'top' || dock === 'bottom') {
    let x = rect.width / 2;
    if (definitionSettings.anchor === 'left') {
      x = definitionSettings.paddingLeft || 0;
    } else if (definitionSettings.anchor === 'right') {
      x = rect.width - (definitionSettings.paddingRight || 0);
    }

    struct.x = x;
    struct.y = dock === 'top' ? rect.height - definitionSettings.paddingStart : definitionSettings.paddingStart + textRect.height;
    struct.dy = dock === 'top' ? -(textRect.height / 6) : -(textRect.height / 3);
    struct.maxWidth = rect.width * 0.8;
  } else {
    let y = rect.height / 2;
    if (definitionSettings.anchor === 'top') {
      y = definitionSettings.paddingStart;
    } else if (definitionSettings.anchor === 'bottom') {
      y = rect.height - definitionSettings.paddingStart;
    }

    struct.y = y;
    struct.x = dock === 'left' ? rect.width - definitionSettings.paddingStart : definitionSettings.paddingStart;
    struct.dx = dock === 'left' ? -(textRect.height / 3) : (textRect.height / 3);
    const rotation = dock === 'left' ? 270 : 90;
    struct.transform = `rotate(${rotation}, ${struct.x + struct.dx}, ${struct.y + struct.dy})`;
    struct.maxWidth = rect.height * 0.8;
  }

  if (!isNaN(definitionSettings.maxLengthPx)) {
    struct.maxWidth = Math.min(struct.maxWidth, definitionSettings.maxLengthPx);
  }

  return struct;
}

/**
 * @typedef text-component
 * @type {object}
 * @property {string} type - "text"
 * @property {string|function} text
 * @property {settings} settings - Text settings
 * @example
 * {
 *  type: 'text',
 *  text: 'my title',
 *  dock: 'left',
 *  settings: {
 *    anchor: 'left',
 *    style: {
 *      fill: 'red'
 *    }
 *  }
 * }
 */

/**
 * @typedef settings
 * @type {object}
 * @property {object} [settings] Labels settings
 * @property {number} [settings.paddingStart=5]
 * @property {number} [settings.paddingEnd=5]
 * @property {number} [settings.paddingLeft=0]
 * @property {number} [settings.paddingRight=0]
 * @property {string} [settings.anchor='center'] - Where to v- or h-align the text. Supports `left`, `right`, `top`, `bottom` and `center`
 * @property {string} [settings.join=', '] - String to add when joining titles from multiple sources
 * @property {number} [settings.maxLengthPx] - Limit the text length to this value in pixels
 * @property {object} [settings.style] - Style properties for the text
 * @property {string} [settings.style.fontSize]
 * @property {string} [settings.style.fontFamily]
 * @property {string} [settings.style.fill]
 */
const textComponent = {
  require: ['renderer', 'chart'],
  defaultSettings: {
    dock: 'bottom',
    displayOrder: 0,
    prioOrder: 0,
    settings: {
      paddingStart: 5,
      paddingEnd: 5,
      paddingLeft: 0,
      paddingRight: 0,
      anchor: 'center',
      join: ', ',
      maxLengthPx: NaN,
      style: {
        fontSize: '15px',
        fontFamily: 'Arial',
        fill: '#999'
      }
    }
  },

  created() {
    this.rect = {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    };

    this.definitionSettings = this.settings.settings;

    this.dataset = this.chart.dataset();
    const table = this.dataset.tables()[0];
    const text = this.settings.text;
    const join = this.definitionSettings.join;
    this.title = parseTitle(text, join, table, this.scale);
  },

  preferredSize() {
    const height = this.renderer.measureText({
      text: this.title,
      fontSize: this.definitionSettings.style.fontSize,
      fontFamily: this.definitionSettings.style.fontFamily
    }).height;
    return height + this.definitionSettings.paddingStart + this.definitionSettings.paddingEnd;
  },

  beforeRender(opts) {
    extend(this.rect, opts.size);
  },

  render() {
    const {
      title,
      definitionSettings,
      rect
    } = this;
    const nodes = [];
    nodes.push(generateTitle({
      title,
      dock: this.settings.dock,
      definitionSettings,
      rect,
      measureText: this.renderer.measureText
    }));
    return nodes;
  },

  beforeUpdate(opts) {
    if (opts.settings) {
      extend(this.settings, opts.settings);
      this.definitionSettings = opts.settings.settings;
    }
    const table = this.dataset.tables()[0];
    const text = this.settings.text;
    const join = this.definitionSettings.join;
    this.title = parseTitle(text, join, table, this.scale);
  }
};

export default textComponent;
