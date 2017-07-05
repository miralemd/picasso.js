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

const categoricalLegend = {
  require: ['chart', 'settings', 'renderer'],
  defaultSettings,
  preferredSize() {
    const scale = this.chart.scale(this.settings.scale);
    const domain = scale.domain();
    const DOCK = this.settings.dock || 'center';
    const DIRECTION = this.settings.direction || ((DOCK === 'top' || DOCK === 'bottom') ? 'horizontal' : 'vertical');
    const HORIZONTAL = (DIRECTION === 'horizontal');
    let title = '';

    if (this.settings.title.text) {
      title = this.settings.title.text;
    } else if (scale && scale.sources && scale.sources[0]) {
      title = this.chart.field(scale.sources[0]).field.title();
    }

    const titleMargin = resolveMargin(this.settings.title.margin);

    let prevContainer = {};
    let nextXitem = 0;
    let nextYitem = 0;
    let maxX = 0;
    let maxY = 0;

    if (this.settings.title.show) {
      // Title
      prevContainer = labelItem({
        x: HORIZONTAL ? nextXitem : 0,
        y: !HORIZONTAL ? nextYitem : 0,
        maxWidth: this.settings.title.maxWidthPx,
        fontSize: this.settings.title.fontSize,
        fontFamily: this.settings.title.fontFamily,
        labelText: title,
        renderer: this.renderer,
        renderingArea: this.rect,
        margin: titleMargin,
        symbolPadding: -parseFloat(this.settings.title.fontSize) // This is too hacky. FIXME
      });

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

      let labelItemDef = resolveForDataObject(this.settings.item, data, i, all);

      labelItemDef.x = HORIZONTAL ? nextXitem : 0;
      labelItemDef.y = !HORIZONTAL ? nextYitem : 0;
      labelItemDef.maxWidth = labelItemDef.maxWidthPx;
      labelItemDef.color = scale(cat);
      labelItemDef.labelText = cat;
      labelItemDef.renderer = this.renderer;
      labelItemDef.renderingArea = this.rect;
      labelItemDef.margin = resolveMargin(labelItemDef.margin);

      prevContainer = labelItem(labelItemDef);

      maxX = Math.max(maxX, prevContainer.x + prevContainer.width);
      maxY = Math.max(maxY, prevContainer.y + prevContainer.height);
    });

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
    const domain = scale.domain();
    const DOCK = this.settings.dock || 'center';
    const ALIGN = this.settings.align;
    const DIRECTION = this.settings.direction || ((DOCK === 'top' || DOCK === 'bottom') ? 'horizontal' : 'vertical');
    const HORIZONTAL = (DIRECTION === 'horizontal');
    let title = '';

    if (this.settings.title.text) {
      title = this.settings.title.text;
    } else if (scale && scale.sources && scale.sources[0]) {
      title = this.chart.field(scale.sources[0]).field.title();
    }

    const titleMargin = resolveMargin(this.settings.title.margin);

    const labels = [];
    let prevContainer = {};
    let nextXitem = 0;
    let nextYitem = 0;

    if (this.settings.title.show) {
      // Title
      prevContainer = labelItem({
        x: HORIZONTAL ? nextXitem : 0,
        y: !HORIZONTAL ? nextYitem : 0,
        maxWidth: Math.min(this.rect.width, this.settings.title.maxWidthPx),
        color: 'transparent',
        fill: this.settings.title.fill,
        fontSize: this.settings.title.fontSize,
        fontFamily: this.settings.title.fontFamily,
        labelText: title,
        renderer: this.renderer,
        align: ALIGN,
        renderingArea: this.rect,
        margin: titleMargin,
        symbolPadding: -parseFloat(this.settings.title.fontSize) // This is too hacky. FIXME
      });

      labels.push(prevContainer);
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

      let labelItemDef = resolveForDataObject(this.settings.item, data, i, all);

      labelItemDef.x = HORIZONTAL ? nextXitem : 0;
      labelItemDef.y = !HORIZONTAL ? nextYitem : 0;
      labelItemDef.maxWidth = Math.min(this.rect.width, labelItemDef.maxWidthPx);
      labelItemDef.color = scale(cat);
      labelItemDef.labelText = cat;
      labelItemDef.renderer = this.renderer;
      labelItemDef.align = ALIGN;
      labelItemDef.renderingArea = this.rect;
      labelItemDef.margin = resolveMargin(labelItemDef.margin);

      prevContainer = labelItem(labelItemDef);

      labels.push(prevContainer);
    });

    return labels;
  }
};

export default categoricalLegend;
