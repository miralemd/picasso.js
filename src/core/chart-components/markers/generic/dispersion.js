import { renderer } from '../../../renderer';
import doodler from './doodler';
import { transposer } from '../../../transposer/transposer';
import { resolveForDataValues } from '../../../style';
import resolveInitialSettings from './settings-setup';

function values(table, setting) {
  if (setting && setting.source) {
    const field = table.findField(setting.source);
    return field ? field.values() : null;
  }
  return null;
}

function resolveInitialStyle(settings, baseStyles, composer) {
  return resolveInitialSettings(settings, baseStyles, composer);
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

    if (x.scale.step) {
      this.bandwidth = x ? x.scale.step() * 0.75 : 0.5;
    } else {
      this.bandwidth = 0.1;
    }

    const dataValues = {};
    Object.keys(this.resolvedStyle).forEach((s) => {
      dataValues[s] = {};
      Object.keys(this.resolvedStyle[s]).forEach((p) => {
        dataValues[s][p] = values(this.table, this.resolvedStyle[s][p]) || data;
      });
    });

    let lastPoint;
    let curPoint;
    let minSpace = null;

    data.forEach((d, i) => {
      const obj = {};
      Object.keys(this.resolvedStyle).forEach((part) => {
        obj[part] = resolveForDataValues(this.resolvedStyle[part], dataValues[part], i);
      });

      lastPoint = curPoint;
      curPoint = x(d);

      if (curPoint && lastPoint) {
        if ((lastPoint - curPoint) < minSpace || minSpace === null) {
          minSpace = lastPoint - curPoint;
        }
      }

      this.items.push({
        style: obj,
        x: x ? curPoint : 0.5,
        min: y && minValues ? y(minValues[i]) : null,
        max: y && maxValues ? y(maxValues[i]) : null,
        start: y && startValues ? y(startValues[i]) : y({ value: 0 }),
        end: y && endValues ? y(endValues[i]) : y({ value: 0 }),
        med: y && medValues ? y(medValues[i]) : null
      });
    });
  }

  render() {
    // Setup the blueprint
    this.blueprint.width = this.rect.width;
    this.blueprint.height = this.rect.height;
    this.blueprint.x = this.rect.x;
    this.blueprint.y = this.rect.y;
    this.blueprint.vertical = this.settings.vertical;

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
