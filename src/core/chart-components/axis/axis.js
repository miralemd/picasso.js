import extend from 'extend';

import nodeBuilder from './axis-node-builder';
import { discreteDefaultSettings, continuousDefaultSettings } from './axis-default-settings';
import calcRequiredSize from './axis-size-calculator';
import resolveSettingsForPath from '../settings-setup';
import { resolveForDataValues } from '../../style';
import crispify from '../../transposer/crispifier';

/**
 * @typedef axis-settings
 * @property {object} [labels] Labels settings
 * @property {boolean} [labels.show = true]
 * @property {boolean} [labels.tilted = false] Only supported on a horizontal axis
 * @property {number} [labels.tiltAngle = 40]
 * @property {number} [labels.maxEdgeBleed = Infinity]
 * @property {string} [labels.fontFamily = 'Arial']
 * @property {string} [labels.fontSize = '12px']
 * @property {string} [labels.fill = '#595959']
 * @property {number} [labels.margin = 6 (discrete) or 4 (continuous)] Space between tick and label
 * @property {boolean} [labels.layered = false] Only supported on a horizontal axis. If true forces tilted to false
 * @property {number} [labels.maxSize = 250]
 * @property {object} [line]
 * @property {boolean} [line.show = true]
 * @property {number} [line.strokeWidth = 1]
 * @property {string} [line.stroke = '#cccccc']
 * @property {object} [ticks]
 * @property {boolean} [ticks.show = true]
 * @property {number} [ticks.margin = 0]
 * @property {number} [ticks.tickSize = 4 (discrete) or 8 (continuous)]
 * @property {string} [ticks.stroke = '#cccccc']
 * @property {number} [ticks.strokeWidth = 1]
 * @property {object} [minorTicks] Only on a continuous axis
 * @property {boolean} [minorTicks.show = true]
 * @property {number} [minorTicks.margin = 0]
 * @property {number} [minorTicks.tickSize = 3]
 * @property {string} [minorTicks.stroke = '#E6E6E6']
 * @property {number} [minorTicks.strokeWidth = 1]
 */

function alignTransform({ align, inner }) {
  if (align === 'left') {
    return { x: inner.width + inner.x };
  } else if (align === 'right' || align === 'bottom') {
    return inner;
  }
  return { y: inner.y + inner.height };
}

function getAlign(dock, align, type) {
  if (dock && !align) {
    return dock;
  } else if (!dock && !align) {
    return type === 'band' ? 'bottom' : 'left';
  }
  return align;
}

function resolveInitialStyle(settings, baseStyles, chart) {
  const ret = {};
  Object.keys(baseStyles).forEach((s) => {
    ret[s] = resolveSettingsForPath(settings, baseStyles, chart, s);
  });
  return ret;
}

const axisComponent = {
  require: ['chart', 'renderer', 'dockConfig'],
  defaultSettings: {
    displayOrder: 0,
    prioOrder: 0,
    paddingStart: 0,
    paddingEnd: 10
  },
  created() {
    this.innerRect = { width: 0, height: 0, x: 0, y: 0 };
    this.outerRect = { width: 0, height: 0, x: 0, y: 0 };

    if (this.scale.type === 'band') {
      this.defaultStyleSettings = discreteDefaultSettings();
      this.defaultDock = 'bottom';
    } else {
      this.defaultStyleSettings = continuousDefaultSettings();
      this.defaultDock = 'left';
    }

    this.init(this.settings);
  },
  init(settings) {
    const styleSettings = resolveInitialStyle(settings.settings, this.defaultStyleSettings, this.chart);
    const axisSettings = extend(true, {}, this.settings, settings.settings, styleSettings);

    const dock = typeof axisSettings.dock !== 'undefined' ? axisSettings.dock : this.defaultDock;
    const align = getAlign(dock, axisSettings.align, this.scale.type);

    this.concreteNodeBuilder = nodeBuilder(this.scale.type);

    axisSettings.dock = dock;
    axisSettings.align = align;
    this.dockConfig.dock = dock; // Override the dock setting (TODO should be removed)
    this.align = align;

    Object.keys(styleSettings).forEach((a) => {
      axisSettings[a] = resolveForDataValues(axisSettings[a]);
    });

    this.axisSettings = axisSettings;
  },
  preferredSize(opts) {
    const {
      formatter,
      axisSettings
    } = this;
    const reqSize = calcRequiredSize({
      type: this.scale.type,
      rect: opts.inner,
      formatter,
      measureText: this.renderer.measureText,
      scale: this.scale,
      settings: axisSettings,
      setEdgeBleed: (val) => {
        this.dockConfig.edgeBleed = val;
      }
    });

    return reqSize;
  },
  beforeUpdate(opts = {}) {
    const {
      settings
    } = opts;
    this.init(settings);
  },
  resize(opts) {
    const {
      inner,
      outer
    } = opts;

    const extendedInner = {};
    extend(extendedInner, inner, alignTransform({
      align: this.align,
      inner
    }));

    const finalOuter = outer || extendedInner;
    extend(this.innerRect, extendedInner);
    extend(this.outerRect, finalOuter);

    return outer;
  },
  beforeRender() {
    const {
      innerRect,
      scale,
      formatter
    } = this;

    const distance = this.align === 'top' || this.align === 'bottom' ? innerRect.width : innerRect.height;

    this.ticks = scale.ticks({
      distance,
      formatter
    });
  },
  render() {
    const {
      axisSettings,
      innerRect,
      outerRect,
      ticks
    } = this;

    const nodes = [];
    nodes.push(...this.concreteNodeBuilder.build({
      settings: axisSettings,
      scale: this.scale,
      innerRect,
      outerRect,
      measureText: this.renderer.measureText,
      ticks
    }));

    crispify.multiple(nodes);

    return nodes;
  }
};

export default axisComponent;
