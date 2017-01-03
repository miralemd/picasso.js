import renderer from '../../../renderer';
import doodler from './doodler';
import { transposer } from '../../../transposer/transposer';
import { resolveForDataObject } from '../../../style';
import resolveSettingsForPath from '../../settings-setup';

function resolveInitialStyle(settings, baseStyles, composer) {
  const ret = {};
  Object.keys(baseStyles).forEach((s) => {
    ret[s] = resolveSettingsForPath(settings, baseStyles, composer, s);
  });
  return ret;
}

export default class Dispersion {
  constructor(composer, defaultStyles, rend) {
    this.element = composer.container();
    this.composer = composer;
    // Setup the renderer
    this.renderer = rend || renderer();
    this.renderer.appendTo(this.element);
    this.rect = { x: 0, y: 0, width: 0, height: 0 };

    this.defaultStyles = defaultStyles;
  }

  setOpts(opts) {
    // Setup settings and data
    this.settings = opts.settings;
    this.data = opts.data;
    this.dataset = this.composer.dataset();

    // Setup scales
    this.x = this.settings.x ? this.composer.scale(this.settings.x) : null;
    this.y = this.settings.y ? this.composer.scale(this.settings.y) : null;

    // Set the default bandwidth
    this.bandwidth = 0;

    // Set the minimum data point distance
    this.minDataPointDistance = null;

    // Initialize blueprint and doodler
    this.blueprint = transposer();
    this.doodle = doodler(this.settings);
  }

  update(opts) {
    const {
      settings
    } = opts;

    this.setOpts(settings);
    this.onData();
    this.render();
  }

  onData() {
    this.items = [];
    this.resolvedStyle = resolveInitialStyle(this.settings, this.defaultStyles, this.composer);

    const data = this.dataset.map(this.data.mapTo, this.data.groupBy); // TODO - the mapped data should be sent in as the argument

    const x = this.x;
    const y = this.y;

    // Calculate the minimum data point distance
    if (x && x.scale && !x.scale.step) {
      let pointCoords = data.map(d => d.self.value);

      // Sort values
      pointCoords.sort();

      let minSpace = pointCoords[pointCoords.length - 1];
      for (let i = 0; i < pointCoords.length; i++) {
        if (pointCoords[i] && pointCoords[i - 1]) {
          if (minSpace === null || minSpace > (pointCoords[i] - pointCoords[i - 1])) {
            minSpace = pointCoords[i] - pointCoords[i - 1];
          }
        }
      }

      this.minDataPointDistance = minSpace;
    }

    data.forEach((d, i) => {
      let obj = {};
      Object.keys(this.resolvedStyle).forEach((part) => {
        obj[part] = resolveForDataObject(this.resolvedStyle[part], d, i);
      });

      this.items.push({
        style: obj,
        x: x && d.self ? x(d.self) : 0.5,
        min: y && 'min' in d ? y(d.min) : null,
        max: y && 'max' in d ? y(d.max) : null,
        start: y && 'start' in d ? y(d.start) : null,
        end: y && 'end' in d ? y(d.end) : null,
        med: y && 'med' in d ? y(d.med) : null
      });
    });
  }

  render() {
    if (this.minDataPointDistance !== null) {
      if (this.minDataPointDistance === 0) {
        this.minDataPointDistance = 0.000000001;
      }
      let normalizedWidth = this.x({ value: this.x.scale.domain()[0] }) - this.x({ value: this.x.scale.domain()[0] + this.minDataPointDistance });
      this.bandwidth = Math.abs(normalizedWidth);
    } else {
      this.bandwidth = this.x && this.x.scale.step ? this.x.scale.step() : 0.5;
    }

    // Setup the blueprint
    this.blueprint.reset();
    this.blueprint.width = this.rect.width;
    this.blueprint.height = this.rect.height;
    this.blueprint.x = this.rect.x;
    this.blueprint.y = this.rect.y;
    this.blueprint.vertical = !this.settings.vertical;
    this.blueprint.crisp = true;

    // Setup the doodler
    this.doodle.push = item => this.blueprint.push(item);

    this.items.forEach((item) => {
      this.renderDataPoint(item);
    });

    this.renderer.render(this.blueprint.output());
  }

  static renderDataPoint(item) { // Static marker prevents eslint error
    return item;
  }

  destroy() {
    this.renderer.destroy();
  }

  resize(rect) {
    this.rect = rect;
    this.renderer.size(rect);
  }

}
