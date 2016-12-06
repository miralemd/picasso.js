import renderer from '../../../renderer';
import doodler from './doodler';
import { transposer } from '../../../transposer/transposer';
import { resolveForDataValues } from '../../../style';
import resolveSettingsForPath from '../../settings-setup';

function values(table, setting) {
  if (setting && setting.source) {
    const field = table.findField(setting.source);
    return field ? field.values() : null;
  }
  return null;
}

function resolveInitialStyle(settings, baseStyles, composer) {
  const ret = {};
  Object.keys(baseStyles).forEach((s) => {
    ret[s] = resolveSettingsForPath(settings, baseStyles, composer, s);
  });
  return ret;
}

export default class Dispersion {
  constructor(obj, composer, defaultStyles, render) {
    this.element = composer.container();
    this.composer = composer;
    // Setup the renderer
    this.renderer = render || renderer();
    this.renderer.appendTo(this.element);
    this.rect = { x: 0, y: 0, width: 0, height: 0 };

    // Setup settings and data
    this.settings = obj.settings;
    this.table = composer.table();
    this.obj = obj;
    this.defaultStyles = defaultStyles;

    // Setup scales
    this.x = this.settings.x ? composer.scale(this.settings.x) : null;
    this.y = this.settings.y ? composer.scale(this.settings.y) : null;

    // Set the default bandwidth
    this.bandwidth = 0;

    // Set the minimum data point distance
    this.minDataPointDistance = null;

    // Initialize blueprint and doodler
    this.blueprint = transposer();
    this.doodle = doodler(this.settings);
  }

  onData() {
    this.items = [];
    this.resolvedStyle = resolveInitialStyle(this.settings, this.defaultStyles, this.composer);

    const data = values(this.table, this.obj.data);
    const startValues = values(this.table, this.settings.start);
    const endValues = values(this.table, this.settings.end);
    const minValues = values(this.table, this.settings.min);
    const maxValues = values(this.table, this.settings.max);
    const medValues = values(this.table, this.settings.med);

    const x = this.x;
    const y = this.y;

    // Calculate the minimum data point distance
    if (!x.scale.step) {
      let pointCoords = data.map(d => d.value);

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

    const dataValues = {};
    Object.keys(this.resolvedStyle).forEach((s) => {
      dataValues[s] = {};
      Object.keys(this.resolvedStyle[s]).forEach((p) => {
        dataValues[s][p] = values(this.table, this.resolvedStyle[s][p]) || data;
      });
    });

    data.forEach((d, i) => {
      const obj = {};
      Object.keys(this.resolvedStyle).forEach((part) => {
        obj[part] = resolveForDataValues(this.resolvedStyle[part], dataValues[part], i);
      });

      this.items.push({
        style: obj,
        x: x ? x(d) : 0.5,
        min: y && minValues ? y(minValues[i]) : null,
        max: y && maxValues ? y(maxValues[i]) : null,
        start: y && startValues ? y(startValues[i]) : null,
        end: y && endValues ? y(endValues[i]) : null,
        med: y && medValues ? y(medValues[i]) : null
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
    this.blueprint.width = this.rect.width;
    this.blueprint.height = this.rect.height;
    this.blueprint.x = this.rect.x;
    this.blueprint.y = this.rect.y;
    this.blueprint.vertical = !this.settings.vertical;

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

  resize(rect) {
    this.rect = rect;
    this.renderer.size(rect);
  }

  remap(input, output) {
    this.settings[output] = this.settings[input];
    delete this.settings[input];
  }
}
