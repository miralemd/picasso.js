import extend from 'extend';

import nodeBuilder from './axis-node-builder';
import { discreteDefaultSettings, continuousDefaultSettings } from './axis-default-settings';
import calcRequiredSize from './axis-size-calculator';
import resolveSettingsForPath from '../settings-setup';
import { resolveForDataValues } from '../../style';
import crispify from '../../transposer/crispifier';
import { scaleWithSize } from '../../scales';

/**
 * @typedef {object} component--axis
 *
 */

/**
 * @typedef {object} component--axis.settings
 * @property {object} [labels] - Labels settings
 * @property {boolean} [labels.show=true]
 * @property {string} [labels.mode='auto'] - Control how labels arrange themself. Availabe modes are auto, horizontal, layered and tilted. Only horizontal is supported on a continuous axis
 * @property {number} [labels.tiltAngle=40] - Angle in degrees, capped between -90 and 90
 * @property {number} [labels.maxEdgeBleed=Infinity]
 * @property {string} [labels.fontFamily='Arial']
 * @property {string} [labels.fontSize='12px']
 * @property {string} [labels.fill='#595959']
 * @property {number} [labels.margin] - Space between tick and label. Default to 6 (discrete) or 4 (continuous)
 * @property {number} [labels.maxLengthPx=150] - Max length of labels in pixels
 * @property {number} [labels.minLengthPx=0] - Min length of labels in pixels. Labels will always at least require this much space
 * @property {number} [labels.maxGlyphCount=NaN] - Is used to measure the largest possible size a label
 * @property {object} [line]
 * @property {boolean} [line.show=true]
 * @property {number} [line.strokeWidth=1]
 * @property {string} [line.stroke='#cccccc']
 * @property {object} [ticks]
 * @property {boolean} [ticks.show=true]
 * @property {number} [ticks.margin=0]
 * @property {number} [ticks.tickSize] - Default to 4 (discrete) or 8 (continuous)
 * @property {string} [ticks.stroke='#cccccc']
 * @property {number} [ticks.strokeWidth=1]
 * @property {object} [minorTicks] - Only on a continuous axis
 * @property {boolean} [minorTicks.show=true]
 * @property {number} [minorTicks.margin=0]
 * @property {number} [minorTicks.tickSize=3]
 * @property {string} [minorTicks.stroke='#e6e6e6']
 * @property {number} [minorTicks.strokeWidth=1]
 */

function alignTransform({ align, inner }) {
  if (align === 'left') {
    return { x: inner.width + inner.x };
  } else if (align === 'right' || align === 'bottom') {
    return inner;
  }
  return { y: inner.y + inner.height };
}

function resolveAlign(align, dock) {
  const horizontal = ['top', 'bottom'];
  const vertical = ['left', 'right'];
  if (horizontal.indexOf(align) !== -1 && vertical.indexOf(dock) === -1) {
    return align;
  } else if (vertical.indexOf(align) !== -1 && horizontal.indexOf(dock) === -1) {
    return align;
  }
  return dock; // Invalid align, return current dock as default
}

function resolveInitialStyle(settings, baseStyles, chart) {
  const ret = {};
  Object.keys(baseStyles).forEach((s) => {
    ret[s] = resolveSettingsForPath(settings, baseStyles, chart, s);
  });
  return ret;
}

function updateActiveMode(state, settings, isDiscrete) {
  const mode = settings.labels.mode;

  if (!isDiscrete || !state.isHorizontal) {
    return 'horizontal';
  }

  if (mode === 'auto') {
    return state.labels.activeMode;
  } else if (['layered', 'tilted'].indexOf(settings.labels.mode) !== -1 && ['top', 'bottom'].indexOf(settings.dock) !== -1) {
    return mode;
  }
  return 'horizontal';
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
    // State is a representation of properties that are private to this component defintion and may be modified by only in this context.
    this.state = {
      isDiscrete: !!this.scale.bandwidth,
      isHorizontal: false,
      labels: {
        activeMode: 'horizontal'
      },
      ticks: [],
      innerRect: { width: 0, height: 0, x: 0, y: 0 },
      outerRect: { width: 0, height: 0, x: 0, y: 0 },
      defaultStyleSettings: undefined,
      defaultDock: undefined,
      concreteNodeBuilder: undefined,
      settings: undefined
    };

    if (this.state.isDiscrete) {
      this.state.defaultStyleSettings = discreteDefaultSettings();
      this.state.defaultDock = 'bottom';
    } else {
      this.state.defaultStyleSettings = continuousDefaultSettings();
      this.state.defaultDock = 'left';
    }

    this.setState(this.settings);
  },
  setState(settings) {
    this.state.isDiscrete = !!this.scale.bandwidth;
    const styleSettings = resolveInitialStyle(settings.settings, this.state.defaultStyleSettings, this.chart);
    this.state.settings = extend(true, {}, this.settings, settings.settings, styleSettings);

    const dock = typeof this.state.settings.dock !== 'undefined' ? this.state.settings.dock : this.state.defaultDock;

    this.state.concreteNodeBuilder = nodeBuilder(this.state.isDiscrete);

    this.state.settings.dock = dock;
    this.state.settings.align = resolveAlign(this.state.settings.align, dock);
    this.state.settings.labels.tiltAngle = Math.max(-90, Math.min(this.state.settings.labels.tiltAngle, 90));
    this.dockConfig.dock = dock; // Override the dock setting (TODO should be removed)

    Object.keys(styleSettings).forEach((a) => {
      this.state.settings[a] = resolveForDataValues(this.state.settings[a]);
    });

    this.state.isHorizontal = this.state.settings.align === 'top' || this.state.settings.align === 'bottom';
    this.state.labels.activeMode = updateActiveMode(this.state, this.state.settings, this.state.isDiscrete);
  },
  preferredSize(opts) {
    const {
      formatter,
      state,
      scale
    } = this;

    const distance = this.state.isHorizontal ? opts.inner.width : opts.inner.height;

    this.state.pxScale = scaleWithSize(scale, distance);

    const reqSize = calcRequiredSize({
      isDiscrete: this.state.isDiscrete,
      rect: opts.inner,
      formatter,
      measureText: this.renderer.measureText,
      scale: this.state.pxScale,
      settings: this.state.settings,
      state
    });

    return reqSize;
  },
  beforeUpdate(opts = {}) {
    const {
      settings
    } = opts;
    this.setState(settings);
  },
  resize(opts) {
    const {
      inner,
      outer
    } = opts;

    const extendedInner = extend({}, inner, alignTransform({
      align: this.state.settings.align,
      inner
    }));

    const finalOuter = outer || extendedInner;
    extend(this.state.innerRect, extendedInner);
    extend(this.state.outerRect, finalOuter);

    return outer;
  },
  beforeRender() {
    const {
      scale,
      formatter
    } = this;

    const distance = this.state.isHorizontal ? this.state.innerRect.width : this.state.innerRect.height;

    this.state.pxScale = scaleWithSize(scale, distance);
    this.state.ticks = this.state.pxScale.ticks({
      distance,
      formatter
    });
  },
  render() {
    const {
      state
    } = this;

    const nodes = [];
    nodes.push(...this.state.concreteNodeBuilder.build({
      settings: this.state.settings,
      scale: this.state.pxScale,
      innerRect: this.state.innerRect,
      outerRect: this.state.outerRect,
      measureText: this.renderer.measureText,
      textBounds: this.renderer.textBounds,
      ticks: this.state.ticks,
      state
    }));

    crispify.multiple(nodes);

    return nodes;
  }
};

export default axisComponent;
