import renderer from '../../../web/renderer/svg-renderer/svg-renderer';

export default class Line {
  constructor(obj, composer) {
    this.element = composer.element;

    this.renderer = renderer();
    this.renderer.appendTo(this.element);

    this.settings = obj.settings;
    this.data = composer.data;
    this.obj = obj;

    this.x = this.settings.x ? composer.scales[this.settings.x.scale] : null;
    this.y = this.settings.y ? composer.scales[this.settings.y.scale] : null;

    this.onData();
  }

  onData() {
    this.lines = [];

    /* eslint no-unused-expressions: 0*/
    this.x && this.x.update();
    this.y && this.y.update();

    this.resize();
  }

  resize() {
    this.renderer.rect.width = this.element.clientWidth;
    this.renderer.rect.height = this.element.clientHeight;
    this.render();
  }

  render() {
    const { width, height } = this.renderer.rect;

    this.lines.x = (this.x && this.x.scale.magicTicks(this.renderer.rect.width - this.renderer.rect.x)) || [];
    this.lines.y = (this.y && this.y.scale.magicTicks(this.renderer.rect.height - this.renderer.rect.y)) || [];

    if (!Object.keys(this.settings.styles)[0]) {
      return;
    }

    let style = {};

    const displayLinesX = this.lines.x.map((p) => {
      style = p.isMinor ? this.settings.styles.minor : this.settings.styles.major;

      return {
        type: 'line',
        x1: p.position * width,
        y1: 0,
        x2: p.position * width,
        y2: height,
        style: `stroke: ${style.color}; stroke-width: ${style.lineWidth}`
      };
    });

    const displayLinesY = this.lines.y.map((p) => {
      style = p.isMinor ? this.settings.styles.minor : this.settings.styles.major;

      return {
        type: 'line',
        x1: 0,
        y1: (1 - p.position) * height,
        x2: width,
        y2: (1 - p.position) * height,
        style: `stroke: ${style.color}; stroke-width: ${style.lineWidth}`
      };
    });

    this.renderer.render([...displayLinesX, ...displayLinesY]);
  }

}

export function line(obj, composer) {
  return new Line(obj, composer);
}
