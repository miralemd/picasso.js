import {
  createTitleNode,
  generateStopNodes,
  createLegendRectNode,
  createTickNodes
} from './node-builder';


function resolveAnchor(dock, anchor, map) {
  const mapped = map[dock];
  if (typeof mapped === 'object') {
    if (mapped.valid.indexOf(anchor) !== -1) {
      return anchor;
    }
    return mapped.default;
  }

  return map.default;
}

function resolveTickAnchor(settings) {
  const dock = settings.dock;
  const anchor = settings.settings.tick.anchor;

  const dockAnchorMap = {
    left: { valid: ['left', 'right'], default: 'left' },
    right: { valid: ['left', 'right'], default: 'right' },
    top: { valid: ['top', 'bottom'], default: 'top' },
    bottom: { valid: ['top', 'bottom'], default: 'bottom' },
    default: 'right'
  };

  return resolveAnchor(dock, anchor, dockAnchorMap);
}

function resolveTitleAnchor(settings) {
  const dockAnchorMap = {
    left: { valid: ['top'], default: 'top' },
    right: { valid: ['top'], default: 'top' },
    top: { valid: ['left', 'right'], default: 'left' },
    bottom: { valid: ['left', 'right'], default: 'left' },
    default: 'top'
  };

  const dock = settings.dock;
  const anchor = settings.settings.title.anchor;

  return resolveAnchor(dock, anchor, dockAnchorMap);
}

function initRect(ctx, size) {
  const rect = { x: 0, y: 0, width: 0, height: 0 };
  const padding = ctx.stgns.padding;
  rect.x = padding.left;
  rect.y = padding.top;
  rect.width = size.width - padding.left - padding.right;
  rect.height = size.height - padding.top - padding.bottom;

  return rect;
}

function getTicks(ctx, majorScale) {
  const values = majorScale.domain();
  let labels = values;
  const labelFn = ctx.stgns.tick.label ||
    ctx.chart.formatter({ source: majorScale.sources[0] }) ||
    ctx.formatter;
  if (typeof labelFn === 'function') {
    labels = values.map(labelFn).map(String);
  }

  const ticks = values.map((value, i) => {
    const label = labels[i];
    return {
      value,
      label,
      pos: majorScale.norm(parseFloat(value, 10)),
      textMetrics: ctx.renderer.measureText({
        text: label,
        fontSize: ctx.stgns.tick.fontSize,
        fontFamily: ctx.stgns.tick.fontFamily
      })
    };
  });

  return ticks;
}

function initState(ctx) {
  const isVertical = ctx.settings.dock !== 'top' && ctx.settings.dock !== 'bottom';
  const titleStgns = ctx.stgns.title;
  const titleTextMetrics = ctx.renderer.measureText({
    text: titleStgns.text,
    fontSize: titleStgns.fontSize,
    fontFamily: titleStgns.fontFamily
  });

  const fillScale = ctx.chart.scale(ctx.stgns.fill);
  const majorScale = ctx.chart.scale(ctx.stgns.major);
  const tickValues = getTicks(ctx, majorScale);
  const tickAnchor = resolveTickAnchor(ctx.settings);

  const state = {
    isVertical,
    nodes: [],
    title: {
      anchor: resolveTitleAnchor(ctx.settings),
      textMetrics: titleTextMetrics,
      requiredWidth: () => {
        if (!titleStgns.show) {
          return 0;
        }
        let w = titleTextMetrics.width;
        let mw = titleStgns.maxLengthPx;
        if (!isVertical) {
          w += titleStgns.padding;
          mw += titleStgns.padding;
        }
        return Math.min(w, mw, state.rect.width);
      },
      requiredHeight: () => {
        if (!titleStgns.show) {
          return 0;
        }
        let h = titleTextMetrics.height;
        if (isVertical) {
          h += titleStgns.padding;
        }
        return Math.min(h, state.rect.height);
      }
    },
    ticks: {
      values: tickValues,
      anchor: tickAnchor,
      length: Math.min(Math.max(...tickValues.map(t => t.textMetrics.width)), ctx.stgns.tick.maxLengthPx),
      requiredHeight: () => (tickAnchor === 'top' ? Math.max(...state.ticks.values.map(t => t.textMetrics.height)) + ctx.stgns.tick.padding : 0)
    },
    legend: {
      fillScale,
      majorScale,
      length: () => {
        const pos = isVertical ? 'height' : 'width';
        const fnPos = isVertical ? 'requiredHeight' : 'requiredWidth';
        const len = Math.min(state.rect[pos], state.rect[pos] * ctx.stgns.length) - state.title[fnPos]();
        return Math.max(0, Math.min(len, ctx.stgns.maxLengthPx));
      }
    }
  };

  return state;
}

/**
 * @typedef settings
 * @type {object}
 * @property {string|object} fill - Reference to definition of sequential color scale
 * @property {string|object} major - Reference to definition of linear scale
 * @property {number} [size=15] - Size in pixels of the legend, if vertical is the width and height otherwise
 * @property {number} [length=1] - A value in the range 0-1 indicating the length of the legend node
 * @property {number} [maxLengthPx=250] - Max length in pixels
 * @property {number} [align=0.5] - A value in the range 0-1 indicating horizontal alignment of the legend's content. 0 aligns to the left, 1 to the right.
 * @property {number} [justify=0] - A value in the range 0-1 indicating vertical alignment of the legend's content. 0 aligns to the top, 1 to the bottom.
 * @property {object} [padding]
 * @property {number} [padding.left=5]
 * @property {number} [padding.right=5]
 * @property {number} [padding.top=5]
 * @property {number} [padding.bottom=5]
 * @property {object} [tick]
 * @property {function} [tick.label] - Function applied to all tick values, returned values are used as labels
 * @property {string} [tick.fill='#595959']
 * @property {string} [tick.fontSize='12px']
 * @property {string} [tick.fontFamily='Arial']
 * @property {number} [tick.maxLengthPx=150] - Max length in pixels
 * @property {string} [tick.anchor='right'] - Where to anchor the tick in relation to the legend node, supported values are [top, bottom, left and right]
 * @property {number} [tick.padding=5] - padding in pixels to the legend node
 * @property {object} [title] - Title settings
 * @property {boolean} [title.show=true] - Toggle title on/off
 * @property {string} [title.text=''] - The value of the title
 * @property {string} [title.fill='#595959']
 * @property {string} [title.fontSize='12px']
 * @property {string} [title.fontFamily='Arial']
 * @property {number} [title.maxLengthPx=100] - Max length in pixels
 * @property {number} [title.padding=5] - padding in pixels to the legend node
 * @property {string} [title.anchor='top'] - Where to anchor the title in relation to the legend node, supported values are [top, left and right]
 */

const legendDef = {
  require: ['chart', 'settings', 'renderer'],
  defaultSettings: {
    displayOrder: 0,
    dock: 'right',
    settings: {
      size: 15,
      length: 0.5,
      maxLengthPx: 250,
      align: 0.5,
      justify: 0,
      padding: {
        left: 5,
        right: 5,
        top: 5,
        bottom: 5
      },
      tick: {
        label: null,
        fill: '#595959',
        fontSize: '12px',
        fontFamily: 'Arial',
        maxLengthPx: 100,
        anchor: null, // Use default based on dock
        padding: 5
      },
      title: {
        show: true,
        text: '',
        fill: '#595959',
        fontSize: '12px',
        fontFamily: 'Arial',
        maxLengthPx: 100,
        padding: 5,
        anchor: null // Use default based on dock
      }
    }
  },
  preferredSize(opts) {
    const state = this.state;
    state.rect = initRect(this, opts.inner);

    // Init with size of legend
    let prefSize = this.stgns.size;

    // Append paddings
    const paddings = state.isVertical ? this.stgns.padding.left + this.stgns.padding.right : this.stgns.padding.top + this.stgns.padding.bottom;
    prefSize += paddings;

    // Append tick size
    const maxSize = Math.max(opts.inner.width, opts.inner.height);
    if ((state.ticks.anchor === 'left' || state.ticks.anchor === 'right')) {
      const tHeight = state.ticks.values.reduce((sum, t) => sum + t.textMetrics.height, 0);
      if (tHeight > this.state.legend.length()) {
        return maxSize;
      }
      prefSize += state.ticks.length;
    } else {
      const tWidth = state.ticks.length;
      if (tWidth > this.state.legend.length()) {
        return maxSize;
      }
      prefSize += Math.max(...state.ticks.values.map(t => t.textMetrics.height));
    }
    prefSize += this.stgns.tick.padding;

    // Append or use title size
    if (this.stgns.title.show) {
      if (state.title.anchor === 'left' || state.title.anchor === 'right') {
        prefSize = Math.max(state.title.textMetrics.height, prefSize);
      } else {
        prefSize = Math.max(prefSize, state.title.requiredWidth() + paddings);
      }
    }

    this.state.preferredSize = prefSize;
    return prefSize;
  },
  created() {
    this.stgns = this.settings.settings;

    this.state = initState(this);
  },
  beforeUpdate(opts) {
    this.stgns = opts.settings.settings;

    this.state = initState(this);
  },
  beforeRender(opts) {
    this.state.nodes = [];
    this.state.rect = initRect(this, opts.size);

    if (this.stgns.title.show) {
      const titleNode = createTitleNode(this);
      this.state.nodes.push(titleNode);
    }

    const stopNodes = generateStopNodes(this);
    const rectNode = createLegendRectNode(this, stopNodes);
    const tickNodes = createTickNodes(this, rectNode);

    const targetNode = { // The target node enables range selection component to limit its range to a specific area
      id: 'legend-seq-target',
      type: 'container',
      children: [rectNode, tickNodes]
    };

    this.state.nodes.push(targetNode);
  },
  render() {
    return this.state.nodes;
  }
};

export default legendDef;