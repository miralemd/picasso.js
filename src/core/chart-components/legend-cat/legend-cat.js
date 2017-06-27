import { labelItem, resolvePadding } from './label-item';

const categoricalLegend = {
  require: ['chart', 'settings', 'renderer'],
  defaultSettings: {
    items: {
      fontSize: '12px',
      fontFamily: 'Arial',
      fill: '#595959',
      padding: {
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
      padding: {
        top: 0,
        right: 5,
        bottom: 5
      }
    }
  },
  preferredSize() {
    const scale = this.chart.scale(this.settings.scale);
    const domain = scale.domain();
    const DOCK = this.settings.dock || 'center';
    let title = '';

    if (this.settings.title.text) {
      title = this.settings.title.text;
    } else if (scale && scale.sources && scale.sources[0]) {
      title = this.chart.field(scale.sources[0]).field.title();
    }

    const padding = resolvePadding(this.settings.items.padding);
    const titlePadding = resolvePadding(this.settings.title.padding);

    let prevContainer = {};
    let nextXitem = 0;
    let nextYitem = 0;
    let maxX = 0;
    let maxY = 0;

    if (this.settings.title.show) {
      // Title
      prevContainer = labelItem({
        x: DOCK === 'top' || DOCK === 'bottom' ? nextXitem : 0,
        y: DOCK === 'left' || DOCK === 'right' ? nextYitem : 0,
        fontSize: this.settings.title.fontSize,
        fontFamily: this.settings.title.fontFamily,
        labelText: title,
        renderer: this.renderer,
        renderingArea: this.rect,
        padding: titlePadding,
        symbolPadding: -parseFloat(this.settings.title.fontSize) // This is too hacky. FIXME
      });

      maxX = prevContainer.x + prevContainer.width;
      maxY = prevContainer.y + prevContainer.height;
    }

    // Items
    domain.forEach((cat) => {
      nextXitem += prevContainer.width || 0;
      nextYitem += prevContainer.height || 0;

      const labelItemDef = {
        x: DOCK === 'top' || DOCK === 'bottom' ? nextXitem : 0,
        y: DOCK === 'left' || DOCK === 'right' ? nextYitem : 0,
        fontSize: this.settings.items.fontSize,
        fontFamily: this.settings.items.fontFamily,
        labelText: cat,
        renderer: this.renderer,
        renderingArea: this.rect,
        padding
      };

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
    const ALIGN = this.settings.align || (DOCK === 'left' || DOCK === 'right' ? DOCK : 'left');
    let title = '';

    if (this.settings.title.text) {
      title = this.settings.title.text;
    } else if (scale && scale.sources && scale.sources[0]) {
      title = this.chart.field(scale.sources[0]).field.title();
    }

    let padding = resolvePadding(this.settings.items.padding);
    let titlePadding = resolvePadding(this.settings.title.padding);

    const labels = [];
    let prevContainer = {};
    let nextXitem = 0;
    let nextYitem = 0;

    if (this.settings.title.show) {
      // Title
      prevContainer = labelItem({
        x: DOCK === 'top' || DOCK === 'bottom' ? nextXitem : 0,
        y: DOCK === 'left' || DOCK === 'right' ? nextYitem : 0,
        maxWidth: this.rect.width,
        color: 'transparent',
        fill: this.settings.title.fill,
        fontSize: this.settings.title.fontSize,
        fontFamily: this.settings.title.fontFamily,
        labelText: title,
        renderer: this.renderer,
        align: ALIGN,
        renderingArea: this.rect,
        padding: titlePadding,
        symbolPadding: -parseFloat(this.settings.title.fontSize) // This is too hacky. FIXME
      });

      labels.push(prevContainer);
    }

    // Items
    domain.forEach((cat) => {
      nextXitem += prevContainer.width || 0;
      nextYitem += prevContainer.height || 0;

      const labelItemDef = {
        x: DOCK === 'top' || DOCK === 'bottom' ? nextXitem : 0,
        y: DOCK === 'left' || DOCK === 'right' ? nextYitem : 0,
        maxWidth: this.rect.width,
        color: scale(cat),
        fill: this.settings.items.fill,
        fontSize: this.settings.items.fontSize,
        fontFamily: this.settings.items.fontFamily,
        labelText: cat,
        renderer: this.renderer,
        align: ALIGN,
        renderingArea: this.rect,
        padding
      };

      prevContainer = labelItem(labelItemDef);

      labels.push(prevContainer);
    });

    return labels;
  }
};

export default categoricalLegend;
