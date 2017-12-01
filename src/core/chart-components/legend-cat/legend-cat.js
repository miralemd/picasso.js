import extend from 'extend';
import { resolveForDataObject } from '../../style';
import { labelItem, resolveMargin } from './label-item';
import createButton from './buttons';
import NarrowPhaseCollision from '../../math/narrow-phase-collision';

const DEFAULT_SETTINGS = {
  settings: {
    direction: null,
    anchor: 'left',
    layout: {
      mode: 'stack'
    },
    item: {
      show: true,
      justify: 0.5,
      align: 0.5,
      symbolPadding: 8,
      label: {
        fontSize: '12px',
        fontFamily: 'Arial',
        fill: '#595959',
        wordBreak: 'none',
        hyphens: 'auto',
        maxLines: 2,
        maxWidth: 136,
        lineHeight: 1.2
      },
      shape: {
        type: 'square',
        strokeWidth: 0,
        size: 8
      },
      margin: {
        top: 0,
        bottom: 8,
        left: 8,
        right: 8
      }
    },
    title: {
      show: true,
      fontSize: '16px',
      fontFamily: 'Arial',
      fill: '#595959',
      wordBreak: 'none',
      hyphens: 'auto',
      maxLines: 2,
      maxWidth: 156,
      lineHeight: 1.25,
      margin: {
        top: 4,
        bottom: 8,
        left: 8,
        right: 4
      }
    },
    buttons: {
      show: false,
      buttonSpacing: 8,
      spacing: 0,
      width: 32,
      height: 24,
      rect: {
        fill: 'transparent',
        stroke: 'transparent',
        strokeWidth: 0
      },
      symbol: {
        fill: 'grey',
        stroke: 'grey',
        strokeWidth: 0,
        size: 0.5
      },
      'rect:disabled': {
        fill: 'transparent',
        stroke: 'transparent',
        strokeWidth: 0
      },
      'symbol:disabled': {
        fill: 'lightgrey',
        stroke: 'lightgrey',
        strokeWidth: 0,
        size: 0.5
      }
    }
  }
};

function createButtons({
  HORIZONTAL,
  rect,
  state,
  buttonRectMinus,
  buttonRectPlus,
  buttonSymbolMinus,
  buttonSymbolPlus,
  anchor
}) {
  const buttons = [];
  const width = state.buttonDefs.width;
  const height = state.buttonDefs.height;
  const buttonSpacing = state.buttonDefs.buttonSpacing / 2;
  const isLeft = anchor === 'left';

  if (HORIZONTAL) {
    const middle = (state.maxOuterHeight || rect.height) / 2;
    const x = isLeft ? rect.width - state.buttonDefs.spacing - width : state.buttonDefs.spacing;
    buttons.push(createButton({
      x,
      y: middle + buttonSpacing,
      width,
      height,
      action: '-',
      direction: isLeft ? 'left' : 'right',
      rect: buttonRectMinus,
      symbol: buttonSymbolMinus
    }));

    buttons.push(createButton({
      x,
      y: middle - height - buttonSpacing,
      width,
      height,
      action: '+',
      direction: isLeft ? 'right' : 'left',
      rect: buttonRectPlus,
      symbol: buttonSymbolPlus
    }));
  } else {
    const middle = (state.maxOuterWidth || rect.width) / 2;
    const y = rect.height - state.buttonDefs.spacing - height;
    buttons.push(createButton({
      x: isLeft ? middle + buttonSpacing : rect.width - middle - buttonSpacing - width,
      y,
      width,
      height,
      action: '-',
      direction: 'up',
      rect: buttonRectMinus,
      symbol: buttonSymbolMinus
    }));

    buttons.push(createButton({
      x: isLeft ? middle - buttonSpacing - width : (rect.width - middle) + buttonSpacing,
      y,
      width,
      height,
      action: '+',
      direction: 'down',
      rect: buttonRectPlus,
      symbol: buttonSymbolPlus
    }));
  }

  return buttons;
}

function resolveSizes(state, local) {
  const defs = state.defs;
  const titleDef = state.titleDef;
  let maxOuterWidth = 0;
  let maxOuterHeight = 0;
  let maxItemOuterWidth = 0;
  let maxItemOuterHeight = 0;
  let maxInnerWidth = 0;
  let maxInnerHeight = 0;
  let maxShapeSize = 0;
  let titleWidth = 0;
  let titleHeight = 0;
  let buttonWidth = 0;
  let buttonHeight = 0;

  if (titleDef.show) {
    titleWidth = titleDef.margin.left + titleDef.margin.right + titleDef.labelBounds.width;
    titleHeight = titleDef.margin.top + titleDef.margin.bottom + titleDef.labelBounds.height;
    maxOuterWidth = titleWidth;
    maxOuterHeight = titleHeight;
  }

  if (state.buttonDefs.show) {
    buttonWidth = (local.isHorizontal ? state.buttonDefs.spacing : 0) + state.buttonDefs.buttonSpacing + (2 * state.buttonDefs.width);
    buttonHeight = (local.isHorizontal ? 0 : state.buttonDefs.spacing) + state.buttonDefs.buttonSpacing + (2 * state.buttonDefs.height);
    maxOuterWidth = local.isHorizontal ? maxOuterWidth : Math.max(maxOuterWidth, buttonWidth); // Presume width is not relevant if horizontal
    maxOuterHeight = local.isHorizontal ? Math.max(maxOuterHeight, buttonHeight) : maxOuterHeight;
  }

  defs.forEach((def) => {
    maxShapeSize = Math.max(maxShapeSize, def.shapeSize || 0);
  });

  for (let i = 0, len = defs.length; i < len; i++) {
    const def = defs[i];
    if (!def.show) {
      continue;
    }
    const innerWidth = def.labelBounds.width + maxShapeSize + def.symbolPadding; // Use max size because text is adjusted to align along y-axis based on the largest shape size
    const innerHeight = Math.max(def.labelBounds.height, maxShapeSize);
    const outerWidth = def.margin.left + def.margin.right + innerWidth;
    const outerHeight = def.margin.top + def.margin.bottom + innerHeight;
    maxInnerWidth = Math.max(maxInnerWidth, innerWidth);
    maxInnerHeight = Math.max(maxInnerHeight, innerHeight);
    maxItemOuterWidth = Math.max(maxItemOuterWidth, outerWidth);
    maxItemOuterHeight = Math.max(maxItemOuterHeight, outerHeight);
    maxOuterWidth = Math.max(maxOuterWidth, outerWidth + (local.isHorizontal ? titleWidth + buttonWidth : 0));
    maxOuterHeight = Math.max(maxOuterHeight, outerHeight + (local.isHorizontal ? 0 : titleHeight + buttonHeight));
  }

  return {
    maxOuterWidth,
    maxOuterHeight,
    maxItemOuterWidth,
    maxItemOuterHeight,
    maxInnerWidth,
    maxInnerHeight,
    maxShapeSize
  };
}

function resolveButtonDefs(settings) {
  const buttonRect = resolveForDataObject(settings.buttons.rect, {}, 0, []);
  const buttonSymbol = resolveForDataObject(settings.buttons.symbol, {}, 0, []);
  const buttonRectDisabled = resolveForDataObject(settings.buttons['rect:disabled'], {}, 0, []);
  const buttonSymbolDisabled = resolveForDataObject(settings.buttons['symbol:disabled'], {}, 0, []);

  return extend({}, settings.buttons, {
    rect: buttonRect,
    symbol: buttonSymbol,
    'rect:disabled': buttonRectDisabled,
    'symbol:disabled': buttonSymbolDisabled
  });
}

function resolveTitleDef({
  settings,
  local,
  renderer
}) {
  let title;
  if (settings.title.text) {
    title = settings.title.text;
  } else {
    title = local.sourceTitle;
  }

  const def = {
    show: settings.title.show,
    margin: resolveMargin(settings.title.margin),
    label: {
      text: title,
      fontSize: settings.title.fontSize,
      fontFamily: settings.title.fontFamily,
      fill: settings.title.fill,
      wordBreak: settings.title.wordBreak,
      hyphens: settings.title.hyphens,
      maxLines: settings.title.maxLines,
      lineHeight: settings.title.lineHeight,
      maxWidth: settings.title.maxWidth,
      anchor: local.anchor === 'left' ? 'start' : 'end'
    }
  };

  def.labelMeasure = renderer.measureText(def.label);
  def.labelBounds = renderer.textBounds(def.label);

  return def;
}

function resolveLabelItemDefs({
  scale,
  settings,
  renderer,
  local
}) {
  const defs = [];
  const DEFS_TO_RESOLVE = 1500;
  const domain = scale.domain();
  const dataset = scale.data();

  for (let i = 0; i < (Math.min(DEFS_TO_RESOLVE, domain.length)); i++) {
    let cat = domain[i];
    let text = scale.label ? scale.label(cat) : '';
    let data = scale.datum ? scale.datum(cat) : {};

    if (local.isThreshold) {
      data = {
        value: [cat, domain[i + 1]],
        source: {
          field: local.sourceField.id()
        }
      };
      if (!scale.label && local.formatter) {
        text = local.formatter(cat);
      }
    }

    let labelItemDef = resolveForDataObject(settings.item, data, i, dataset, { formatter: local.formatter });
    if (labelItemDef.show === false) {
      continue;
    }

    if (typeof settings.item.shape === 'object') {
      labelItemDef.shape = resolveForDataObject(settings.item.shape, data, i, dataset);
      labelItemDef.shapeSize = labelItemDef.shape.size;
    }

    labelItemDef.margin = resolveMargin(labelItemDef.margin);

    labelItemDef.label = extend({}, labelItemDef.label);
    labelItemDef.label.anchor = local.anchor === 'left' ? 'start' : 'end';
    labelItemDef.label.text = text || cat;

    labelItemDef.labelMeasure = renderer.measureText(labelItemDef.label);
    labelItemDef.shapeSize = labelItemDef.shapeSize || labelItemDef.labelMeasure.height; // Fallback to label height as the shape definition is not guaranteed to contain a size
    labelItemDef.labelBounds = renderer.textBounds(labelItemDef.label);

    labelItemDef.color = scale(cat);
    labelItemDef.data = data;

    defs.push(labelItemDef);
  }

  return defs;
}

function buildNodes({
  settings,
  chart,
  rect,
  local,
  state
}) {
  const nodes = [];
  let prevContainer = {};
  let titleContainer = {};
  let nextXitem = 0;
  let nextYitem = 0;
  let availableSpace = local.isHorizontal ? rect.width - state.buttonDefs.width - state.buttonDefs.spacing : rect.height - state.buttonDefs.height - state.buttonDefs.spacing;

  if (state.titleDef.show) {
    prevContainer = labelItem(extend(state.titleDef, {
      x: prevContainer.width || nextXitem,
      y: prevContainer.height || nextYitem,
      anchor: local.anchor,
      renderingArea: rect,
      isStacked: true,
      isHorizontal: local.isHorizontal,
      maxInnerWidth: state.titleDef.labelBounds.width,
      maxInnerHeight: state.titleDef.labelBounds.height
    }));

    titleContainer = prevContainer;

    nodes.push(prevContainer);
    availableSpace -= local.isHorizontal ? prevContainer.width : prevContainer.height;
  }

  let createScrollButtons = false;
  state.pageSize = 0;

  let dirX = 0;
  let dirY = 0;
  const initAvailableSpace = availableSpace;
  for (let d = 0; d < local.size; d++) {
    // Items
    for (let i = state.index + state.pageSize; i < state.defs.length; i++) {
      const labelItemDef = state.defs[i];
      nextXitem += prevContainer.width || 0;
      nextYitem += prevContainer.height || 0;

      labelItemDef.x = local.isHorizontal ? nextXitem : dirX;
      labelItemDef.y = !local.isHorizontal ? nextYitem : dirY;
      labelItemDef.maxInnerWidth = state.maxInnerWidth;
      labelItemDef.maxInnerHeight = state.maxInnerHeight;

      prevContainer = labelItem(extend(labelItemDef, {
        anchor: local.anchor,
        renderingArea: rect,
        maxShapeSize: state.maxShapeSize,
        isStacked: local.isStacked,
        isHorizontal: local.isHorizontal
      }));

      availableSpace -= local.isHorizontal ? prevContainer.width : prevContainer.height;
      if (availableSpace < 0) {
        if (local.size <= 1) {
          createScrollButtons = true;
        }
        break;
      }

      nodes.push(prevContainer);
      state.pageSize++;
    }

    if (state.index + state.pageSize >= state.defs.length && state.pageSize < state.defs.length) { // If last item and have scrolled
      createScrollButtons = true;
      break;
    }

    if (local.isHorizontal) {
      dirY += state.maxItemOuterHeight;
    } else {
      dirX += state.maxItemOuterWidth;
    }

    availableSpace = initAvailableSpace;
    prevContainer = titleContainer;
    nextYitem = 0;
    nextXitem = 0;

    // Check if there are more items and if able to fit more in row/column
    if (state.index + state.pageSize < state.defs.length) {
      if (dirX + state.maxItemOuterWidth > rect.width) {
        createScrollButtons = true;
        break;
      } else if (dirY + state.maxItemOuterHeight > rect.height) {
        createScrollButtons = true;
        break;
      }
    }
  }

  if (settings.buttons.show && !local.hasKey) {
    chart.logger().warn('legend-cat requires a key for the index to be preserved when paging. Disable buttons or add a key to the item.');
  }

  state.pageMax = Math.max(0, state.defs.length - state.pageSize);
  state.pageMin = 0;

  if (createScrollButtons && settings.buttons.show) {
    nodes.push(...createButtons({
      HORIZONTAL: local.isHorizontal,
      rect,
      state,
      buttonRectMinus: state.index <= 0 ? state.buttonDefs['rect:disabled'] : state.buttonDefs.rect,
      buttonRectPlus: state.index >= state.pageMax ? state.buttonDefs['rect:disabled'] : state.buttonDefs.rect,
      buttonSymbolMinus: state.index <= 0 ? state.buttonDefs['symbol:disabled'] : state.buttonDefs.symbol,
      buttonSymbolPlus: state.index >= state.pageMax ? state.buttonDefs['symbol:disabled'] : state.buttonDefs.symbol,
      anchor: local.anchor
    }));
  }

  return nodes;
}

function estimateSize(local, state, rect) {
  if (local.size <= 1) {
    return 1;
  }

  if (local.isHorizontal) {
    const requiredWidth = (state.maxItemOuterWidth * state.defs.length);
    const availableWidth = rect.width;
    const requiredRows = Math.min(local.size, Math.ceil(requiredWidth / availableWidth));

    return requiredRows * state.maxItemOuterHeight;
  }

  const requiredHeight = (state.maxItemOuterHeight * state.defs.length);
  const availableHeight = rect.height;
  const requiredColumns = Math.min(local.size, Math.ceil(requiredHeight / availableHeight));

  return requiredColumns * state.maxItemOuterWidth;
}

function doScroll(context, scrollLength = 3) {
  const state = context.state;
  const len = isNaN(scrollLength) ? 3 : Math.round(scrollLength);
  state.index = Math.max(state.pageMin, Math.min(state.pageMax, state.index + len));

  const nodes = buildNodes({
    chart: context.chart,
    settings: context.settings.settings,
    scale: context.scale,
    rect: context.rect,
    local: context.local,
    state: context.state
  });

  context.update(nodes);
}

const categoricalLegend = {
  require: ['chart', 'settings', 'renderer', 'update'],
  defaultSettings: DEFAULT_SETTINGS,
  on: {
    tap(e, scrollLength = 3) {
      const boundingRect = this.renderer.element().getBoundingClientRect();
      const buttons = this.renderer.findShapes('.scroll-button');

      for (let i = 0; i < buttons.length; i++) {
        const node = buttons[i];
        const hit = NarrowPhaseCollision.testRectPoint(node.bounds, {
          x: e.center.x - boundingRect.left,
          y: e.center.y - boundingRect.top
        });

        if (hit) {
          const action = node.desc.action;
          const len = action === '+' ? scrollLength : -scrollLength;

          doScroll(this, len);
          break;
        }
      }
    },
    scroll(scrollLength = 3) {
      doScroll(this, scrollLength);
    },
    resetindex() {
      this.state.index = 0;
    }
  },
  createLocal() {
    const SETTINGS = this.settings.settings;
    const DOCK = this.settings.dock || 'center';
    const DIRECTION = SETTINGS.direction || ((DOCK === 'top' || DOCK === 'bottom') ? 'horizontal' : 'vertical');
    const HORIZONTAL = (DIRECTION === 'horizontal');
    const ANCHOR = SETTINGS.anchor;
    const THRESHOLD = this.scale.type === 'threshold-color';
    const LAYOUT = typeof SETTINGS.layout === 'object' ? SETTINGS.layout : {};
    const STACKED_LAYOUT = LAYOUT.mode === 'stack';

    let sourceField;
    if (this.scale) {
      sourceField = (this.scale.data().fields || [])[0];
    }

    this.local = {
      direction: DIRECTION,
      anchor: ANCHOR,
      isHorizontal: HORIZONTAL,
      isThreshold: THRESHOLD,
      isStacked: STACKED_LAYOUT,
      sourceTitle: sourceField ? sourceField.title() : '',
      sourceField,
      formatter: sourceField ? sourceField.formatter() : this.formatter,
      hasKey: !!this.settings.key,
      size: STACKED_LAYOUT || isNaN(LAYOUT.size) ? 1 : Math.max(Math.round(LAYOUT.size), 1)
    };
  },
  initState() {
    this.state = {
      index: 0
    };
  },
  resolveNodeDefs() {
    const {
      settings,
      renderer,
      local,
      state,
      scale
    } = this;

    state.defs = resolveLabelItemDefs({
      scale,
      settings: settings.settings,
      renderer,
      local
    });
    state.titleDef = resolveTitleDef({ settings: settings.settings, local, renderer });
    state.buttonDefs = resolveButtonDefs(settings.settings);

    const {
      maxOuterWidth,
      maxOuterHeight,
      maxItemOuterWidth,
      maxItemOuterHeight,
      maxInnerWidth,
      maxInnerHeight,
      maxShapeSize
    } = resolveSizes(state, local);

    this.state.maxInnerWidth = maxInnerWidth;
    this.state.maxInnerHeight = maxInnerHeight;
    this.state.maxOuterWidth = maxOuterWidth;
    this.state.maxOuterHeight = maxOuterHeight;
    this.state.maxItemOuterWidth = maxItemOuterWidth;
    this.state.maxItemOuterHeight = maxItemOuterHeight;
    this.state.maxShapeSize = maxShapeSize;
  },
  preferredSize(opts) {
    if (this.settings.dock === 'left' || this.settings.dock === 'right') {
      this.state.preferredSize = Math.max(this.state.maxOuterWidth, estimateSize(this.local, this.state, opts.inner));
    } else {
      this.state.preferredSize = Math.max(this.state.maxOuterHeight, estimateSize(this.local, this.state, opts.inner));
    }

    if (this.local.isHorizontal && this.state.maxOuterWidth > opts.inner.width) {
      return Math.max(opts.inner.width, opts.inner.height);
    } else if (!this.local.isHorizontal && this.state.maxOuterHeight > opts.inner.height) {
      return Math.max(opts.inner.width, opts.inner.height);
    }

    return this.state.preferredSize;
  },
  beforeUpdate() {
    this.createLocal();
    this.resolveNodeDefs();
  },
  created() {
    this.createLocal();
    this.initState();
    this.resolveNodeDefs();
    this.rect = { x: 0, y: 0, width: 0, height: 0 };
  },
  beforeRender(opts) {
    this.rect = opts.size;
  },
  render() {
    return buildNodes({
      chart: this.chart,
      settings: this.settings.settings,
      scale: this.scale,
      rect: this.rect,
      local: this.local,
      state: this.state
    });
  }
};

export default categoricalLegend;
