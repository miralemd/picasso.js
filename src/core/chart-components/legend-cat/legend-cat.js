import { resolveForDataObject } from '../../style';
import { labelItem, resolveMargin } from './label-item';
import createButton from './buttons';

const defaultSettings = {
  align: 'left',
  item: {
    fontSize: '12px',
    fontFamily: 'Arial',
    fill: '#595959',
    maxWidthPx: 150,
    margin: {
      top: 5,
      right: 5,
      bottom: 0
    },
    shape: {
      type: 'square',
      strokeWidth: 0
    }
  },
  title: {
    show: true,
    fontSize: '18px',
    fontFamily: 'Arial',
    fill: '#595959',
    maxWidthPx: 200,
    margin: {
      top: 0,
      right: 5,
      bottom: 5
    }
  },
  buttons: {
    show: true,
    rect: {
      fill: 'transparent',
      stroke: 'transparent',
      strokeWidth: 0
    },
    symbol: {
      fill: 'grey',
      stroke: 'grey',
      strokeWidth: 2
    }
  }
};

/**
 * Create scrolling buttons
 *
 * @param {boolean} HORIZONTAL - If the rendering is horizontal, this is true
 * @param {object} rect - Rendering area
 * @param {object} buttonRect - The button rect styling
 * @param {object} buttonSymbol - Button line styling
 * @param {number} min - Minimum value (often 0, as arrays are 0-indexed)
 * @param {number} max - Maximum value, often the total length of values minus the available slots
 * @param {number} pagingValue - How much to page with every action
 * @return {object[]} - Nodes to render
 */
function createButtons({ HORIZONTAL, rect, buttonRect, buttonSymbol, min, max, pagingValue }) {
  const buttons = [];
  const dataPlus = { action: '+', min, max, value: pagingValue };
  const dataMinus = { action: '-', min, max, value: pagingValue };

  if (HORIZONTAL) {
    buttons.push(createButton({
      x: rect.width - 45,
      y: rect.height * 0.125,
      width: 20,
      height: rect.height * 0.75,
      data: dataMinus,
      direction: 'left',
      rect: buttonRect,
      symbol: buttonSymbol
    }));

    buttons.push(createButton({
      x: rect.width - 25,
      y: rect.height * 0.125,
      width: 20,
      height: rect.height * 0.75,
      data: dataPlus,
      direction: 'right',
      rect: buttonRect,
      symbol: buttonSymbol
    }));
  } else {
    buttons.push(createButton({
      x: rect.width * 0.5,
      y: rect.height - 15,
      width: rect.width * 0.25,
      height: 15,
      data: dataMinus,
      direction: 'up',
      rect: buttonRect,
      symbol: buttonSymbol
    }));

    buttons.push(createButton({
      x: rect.width * 0.25,
      y: rect.height - 15,
      width: rect.width * 0.25,
      height: 15,
      data: dataPlus,
      direction: 'down',
      rect: buttonRect,
      symbol: buttonSymbol
    }));
  }

  return buttons;
}

/**
 * Process label items from scale & domain to calculate prefSize or render items
 *
 * @param  {object} settings - Settings from the component
 * @param  {Scale} scale - Scale from the component
 * @param  {boolean} HORIZONTAL - True if the labels are going to be rendered horizontally
 * @param  {string} ALIGN - Alignment of the labels, 'left' or 'right'
 * @param  {Renderer} renderer - Current SVG/Canvas renderer for measuring text
 * @param  {object} rect - Rendering area rect, X, Y, Width and Height
 * @param  {object} chart - The chart object
 * @return {object} - returns labels, maxX and maxY for computing renderable area
 */
function processLabelItems({ settings, scale, HORIZONTAL, ALIGN, renderer, rect, chart, index = 0 }) {
  let title;
  const domain = scale.domain();

  if (settings.title.text) {
    title = settings.title.text;
  } else if (scale && scale.sources && scale.sources[0]) {
    title = chart.field(scale.sources[0]).field.title();
  }

  const titleMargin = resolveMargin(settings.title.margin);

  const labels = [];
  let prevContainer = {};
  let nextXitem = 0;
  let nextYitem = 0;
  let maxX = 0;
  let maxY = 0;

  if (settings.title.show) {
    // Title
    prevContainer = labelItem({
      x: HORIZONTAL ? nextXitem : 0,
      y: !HORIZONTAL ? nextYitem : 0,
      maxWidth: rect ? Math.min(rect.width, settings.title.maxWidthPx) : settings.title.maxWidthPx,
      color: 'transparent',
      fill: settings.title.fill,
      fontSize: settings.title.fontSize,
      fontFamily: settings.title.fontFamily,
      labelText: title,
      renderer,
      align: ALIGN,
      renderingArea: rect,
      margin: titleMargin,
      symbolPadding: -parseFloat(settings.title.fontSize) // This is too hacky. FIXME
    });

    labels.push(prevContainer);
    maxX = prevContainer.x + prevContainer.width;
    maxY = prevContainer.y + prevContainer.height;
  }

  let availableSlots = Infinity;
  let createScrollButtons = false;

  // Items
  for (let i = index; i < (Math.min(index + availableSlots, domain.length)); i++) {
    let cat = domain[i];

    nextXitem += prevContainer.width || 0;
    nextYitem += prevContainer.height || 0;

    let data = {
      value: cat,
      index: i,
      color: scale(cat)
    };

    let labelItemDef = resolveForDataObject(settings.item, data, i, domain);
    if (typeof settings.item.shape === 'object') {
      labelItemDef.shape = resolveForDataObject(settings.item.shape, data, i, domain); // TODO resolveForDataObject for probably handle deep structures...
    }

    labelItemDef.x = HORIZONTAL ? nextXitem : 0;
    labelItemDef.y = !HORIZONTAL ? nextYitem : 0;
    labelItemDef.maxWidth = rect ? Math.min(rect.width, labelItemDef.maxWidthPx) : labelItemDef.maxWidthPx;
    labelItemDef.color = scale(cat);
    labelItemDef.labelText = cat;
    labelItemDef.renderer = renderer;
    labelItemDef.align = ALIGN;
    labelItemDef.renderingArea = rect;
    labelItemDef.margin = resolveMargin(labelItemDef.margin);
    labelItemDef.data = data;

    prevContainer = labelItem(labelItemDef);

    labels.push(prevContainer);
    maxX = Math.max(maxX, prevContainer.x + prevContainer.width);
    maxY = Math.max(maxY, prevContainer.y + prevContainer.height);

    if (rect) {
      availableSlots = Math.min(availableSlots, (HORIZONTAL ? Math.floor((rect.width - maxX) / prevContainer.width) : Math.floor((rect.height - maxY) / prevContainer.height)) + (i - index));
    }

    if (availableSlots < domain.length && !createScrollButtons) {
      createScrollButtons = true;
      // availableSlots--;
    }
  }

  if (createScrollButtons && settings.buttons.show) {
    const buttonRect = resolveForDataObject(settings.buttons.rect, {}, 0, []);
    const buttonSymbol = resolveForDataObject(settings.buttons.symbol, {}, 0, []);

    labels.push(...createButtons({
      HORIZONTAL,
      rect,
      buttonRect,
      buttonSymbol,
      min: 0,
      max: (domain.length - availableSlots),
      pagingValue: availableSlots
    }));
  }

  return {
    labels,
    maxX,
    maxY
  };
}

/**
 * Render the legend
 *
 * @param  {object} context Context of categorical legend to render in, pass it usualy ass { context: this }
 * @param  {integer} [index=0] Current index
 * @return {object[]} Array of objects to be rendered
 */
function renderLegend({ context, index = 0 }) {
  const scale = context.chart.scale(context.settings.scale);
  const DOCK = context.settings.dock || 'center';
  const ALIGN = context.settings.align;
  const DIRECTION = context.settings.direction || ((DOCK === 'top' || DOCK === 'bottom') ? 'horizontal' : 'vertical');
  const HORIZONTAL = (DIRECTION === 'horizontal');

  const {
    settings,
    renderer,
    rect,
    chart
  } = context;

  const {
    labels
  } = processLabelItems({ settings, scale, HORIZONTAL, ALIGN, renderer, rect, chart, index });

  return labels;
}

/**
 * Categorical Color Legend Component
 * @type {Object}
 * @ignore
 */
const categoricalLegend = {
  require: ['chart', 'settings', 'renderer'],
  defaultSettings,
  on: {
    tap(e) {
      const shapes = this.chart.shapesAt({
        x: e.center.x - this.chart.element.getBoundingClientRect().left,
        y: e.center.y - this.chart.element.getBoundingClientRect().top
      }, {});

      if (shapes[0] && shapes[0].data && shapes[0].data.action) {
        const action = shapes[0].data.action;
        const min = shapes[0].data.min || 0;
        const max = shapes[0].data.max || Infinity;
        const value = shapes[0].data.value || 1;

        if (action === '+') {
          this.index = (this.index || 0) + value;
        } else {
          this.index = (this.index || 0) - value;
        }

        this.index = Math.max(min, Math.min(max, this.index));

        this.renderer.render(renderLegend({ context: this, index: this.index }));
      }
    }
  },
  preferredSize() {
    const context = this;
    const scale = context.chart.scale(context.settings.scale);
    const DOCK = context.settings.dock || 'center';
    const DIRECTION = context.settings.direction || ((DOCK === 'top' || DOCK === 'bottom') ? 'horizontal' : 'vertical');
    const HORIZONTAL = (DIRECTION === 'horizontal');

    const {
      settings,
      renderer,
      chart
    } = context;

    const {
      maxX,
      maxY
    } = processLabelItems({ settings, scale, HORIZONTAL, renderer, chart });

    return DOCK === 'left' || DOCK === 'right' ? maxX : maxY;
  },
  created() {
    this.rect = { x: 0, y: 0, width: 0, height: 0 };
  },
  beforeRender(opts) {
    this.rect = opts.size;
  },
  render() {
    return renderLegend({ context: this });
  }
};

export default categoricalLegend;
