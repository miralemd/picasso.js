import extend from 'extend';

import createComponentFactory from '../component';
import nodeBuilder from './axis-node-builder';
import { discreteDefaultSettings, continuousDefaultSettings } from './axis-default-settings';
import { generateContinuousTicks, generateDiscreteTicks } from './axis-tick-generators';
import calcRequiredSize from './axis-size-calculator';
import resolveSettingsForPath from '../settings-setup';
import { resolveForDataValues } from '../../style';
import crispify from '../../transposer/crispifier';

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
  require: ['composer', 'measureText', 'dockConfig'],
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
      this.data = this.scale.scale.domain();
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
      axisSettings,
      data,
      measureText
    } = this;
    const reqSize = calcRequiredSize({
      type: this.scale.type,
      rect: opts.inner,
      data,
      formatter,
      measureText,
      scale: this.scale.scale,
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
    return outer;
  },
  render() {
    const {
      formatter,
      ticksFn,
      axisSettings,
      data,
      innerRect,
      outerRect,
      measureText
    } = this;
    const ticks = ticksFn({
      settings: axisSettings,
      innerRect,
      scale: this.scale.scale,
      data,
      formatter
    });

    const nodes = [];
    nodes.push(...this.concreteNodeBuilder.build({
      settings: axisSettings,
      scale: this.scale.scale,
      innerRect,
      outerRect,
      measureText,
      ticks
    }));

    crispify.multiple(nodes);

    return nodes;
  }
};

export default createComponentFactory(axisComponent);
