import extend from 'extend';

import createComponentFactory from '../component';
import nodeBuilder from './axis-node-builder';
import { discreteDefaultSettings, continuousDefaultSettings } from './axis-default-settings';
import { generateContinuousTicks, generateDiscreteTicks } from './axis-tick-generators';
import calcRequiredSize from './axis-size-calculator';
import resolveSettingsForPath from '../settings-setup';
import { resolveForDataValues } from '../../style';
import crispify from '../../transposer/crispifier';

/**
 * @typedef axis-settings
 * @property {boolean} [labels] Labels settings
 * @property {boolean} [labels.show = true]
 * @property {boolean} [labels.tilted = false] Only supported on a horizontal axis
 * @property {boolean} [labels.tiltAngle = 40]
 * @property {boolean} [labels.fontFamily = 'Arial']
 * @property {boolean} [labels.fontSize = '12px']
 * @property {boolean} [labels.fill = '#595959']
 * @property {boolean} [labels.margin = 6 (discrete) or 4 (continuous)] Space between tick and label
 * @property {boolean} [labels.layered = false] Only supported on a horizontal axis. If true forces tilted to false
 * @property {boolean} [labels.maxSize = 250]
 * @property {boolean} [line]
 * @property {boolean} [line.show = true]
 * @property {boolean} [line.strokeWidth = 1]
 * @property {boolean} [line.stroke = '#cccccc']
 * @property {boolean} [ticks]
 * @property {boolean} [ticks.show = true]
 * @property {boolean} [ticks.margin = 0]
 * @property {boolean} [ticks.tickSize = 4 (discrete) or 8 (continuous)]
 * @property {boolean} [ticks.stroke = '#cccccc']
 * @property {boolean} [ticks.strokeWidth = 1]
 * @property {boolean} [ticks.tight = false] Only on a continuous axis
 * @property {boolean} [ticks.forceBounds = false] Only on a continuous axis
 * @property {boolean} [ticks.distance = 100] Approximate distance between each tick. Only on a continuous axis
 * @property {boolean} [minorTicks] Only on a continuous axis
 * @property {boolean} [minorTicks.show = true]
 * @property {boolean} [minorTicks.margin = 0]
 * @property {boolean} [minorTicks.tickSize = 3]
 * @property {boolean} [minorTicks.stroke = '#E6E6E6']
 * @property {boolean} [minorTicks.strokeWidth = 1]
 * @property {boolean} [minorTicks.count = 3]
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
    return type === 'ordinal' ? 'bottom' : 'left';
  }
  return align;
}

function resolveInitialStyle(settings, baseStyles, composer) {
  const ret = {};
  Object.keys(baseStyles).forEach((s) => {
    ret[s] = resolveSettingsForPath(settings, baseStyles, composer, s);
  });
  return ret;
}

const axisComponent = {
  require: ['composer', 'renderer', 'dockConfig'],
  defaultSettings: {
    displayOrder: 0,
    prioOrder: 0,
    paddingStart: 0,
    paddingEnd: 10
  },
  created() {
    this.innerRect = { width: 0, height: 0, x: 0, y: 0 };
    this.outerRect = { width: 0, height: 0, x: 0, y: 0 };

    if (this.scale.type === 'ordinal') {
      this.defaultStyleSettings = discreteDefaultSettings();
      this.defaultDock = 'bottom';
      this.ticksFn = generateDiscreteTicks;
    } else {
      this.defaultStyleSettings = continuousDefaultSettings();
      this.defaultDock = 'left';
      this.ticksFn = generateContinuousTicks;
    }

    this.init(this.settings);
  },
  init(settings) {
    const styleSettings = resolveInitialStyle(settings.settings, this.defaultStyleSettings, this.composer);
    const axisSettings = extend(true, {}, this.settings, settings.settings, styleSettings);

    const dock = typeof axisSettings.dock !== 'undefined' ? axisSettings.dock : this.defaultDock;
    const align = getAlign(dock, axisSettings.align, this.scale.type);

    if (this.scale.type === 'ordinal') {
      this.domain = this.scale.domain();
    }

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
      ticksFn,
      axisSettings
    } = this;
    const reqSize = calcRequiredSize({
      type: this.scale.type,
      rect: opts.inner,
      data: this.domain,
      formatter,
      measureText: this.renderer.measureText,
      scale: this.scale,
      settings: axisSettings,
      ticksFn,
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
  beforeRender(opts) {
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

    const {
      formatter,
      ticksFn,
      axisSettings
    } = this;

    this.ticks = ticksFn({
      settings: axisSettings,
      innerRect: this.innerRect,
      scale: this.scale,
      data: this.domain,
      formatter
    });

    return outer;
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

export default createComponentFactory(axisComponent);
