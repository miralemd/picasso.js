import { resolveForDataObject } from '../../style';
import { labelItem, resolveMargin } from './label-item';

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
  }
};

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
function processLabelItems({ settings, scale, HORIZONTAL, ALIGN, renderer, rect, chart }) {
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

  // Items
  domain.forEach((cat, i, all) => {
    nextXitem += prevContainer.width || 0;
    nextYitem += prevContainer.height || 0;

    let data = {
      value: cat,
      index: i,
      color: scale(cat)
    };

    let labelItemDef = resolveForDataObject(settings.item, data, i, all);
    if (typeof settings.item.shape === 'object') {
      labelItemDef.shape = resolveForDataObject(settings.item.shape, data, i, all); // TODO resolveForDataObject for probably handle deep structures...
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
  });

  return {
    labels,
    maxX,
    maxY
  };
}

/**
 * Categorical Color Legend Component
 * @type {Object}
 * @ignore
 */
const categoricalLegend = {
  require: ['chart', 'settings', 'renderer'],
  defaultSettings,
  preferredSize() {
    const scale = this.chart.scale(this.settings.scale);
    const DOCK = this.settings.dock || 'center';
    const DIRECTION = this.settings.direction || ((DOCK === 'top' || DOCK === 'bottom') ? 'horizontal' : 'vertical');
    const HORIZONTAL = (DIRECTION === 'horizontal');

    const {
      settings,
      renderer,
      chart
    } = this;

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
    const scale = this.chart.scale(this.settings.scale);
    const DOCK = this.settings.dock || 'center';
    const ALIGN = this.settings.align;
    const DIRECTION = this.settings.direction || ((DOCK === 'top' || DOCK === 'bottom') ? 'horizontal' : 'vertical');
    const HORIZONTAL = (DIRECTION === 'horizontal');

    const {
      settings,
      renderer,
      rect,
      chart
    } = this;

    const {
      labels
    } = processLabelItems({ settings, scale, HORIZONTAL, ALIGN, renderer, rect, chart });

    return labels;
  }
};

export default categoricalLegend;
