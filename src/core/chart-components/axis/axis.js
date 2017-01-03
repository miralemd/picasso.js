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

function dockAlignSetup(dock, settings, type) {
  if (dock && !settings.align) {
    settings.align = dock;
  } else if (!dock && !settings.align) {
    settings.align = type === 'ordinal' ? 'bottom' : 'left';
  }
}

function resolveInitialStyle(settings, baseStyles, composer) {
  const ret = {};
  Object.keys(baseStyles).forEach((s) => {
    ret[s] = resolveSettingsForPath(settings, baseStyles, composer, s);
  });
  return ret;
}

// (axisConfig, composer, renderer)
const axisComponent = {
  created(opts) {
    this.innerRect = { width: 0, height: 0, x: 0, y: 0 };
    this.outerRect = { width: 0, height: 0, x: 0, y: 0 };

    /*
    let dataScale = composer.scale(axisConfig);
    let scale = dataScale.scale;
    let type = dataScale.type;
    let data;
    let concreteNodeBuilder;
    let settings;
    let styleSettings;
    let ticksFn;
    */

    let settings;
    let styleSettings;
    if (this.scale.type === 'ordinal') {
      [settings, styleSettings] = discreteDefaultSettings();
      this.ticksFn = generateDiscreteTicks;
    } else {
      [settings, styleSettings] = continuousDefaultSettings();
      this.ticksFn = generateContinuousTicks;
    }
    this.settings = settings;
    this.styleSettings = styleSettings;

     // Override the dock setting (TODO should be removed)
    if (typeof settings.dock !== 'undefined') {
      this.dock = settings.dock;
    }
    this.dockConfig.dock = this.dock;

    this.init(opts.settings);
  },
  require: ['composer', 'measureText', 'dockConfig'],
  init(axisConfig) {
    // formatter = composer.formatter(axisConfig.formatter || { source: dataScale.sources[0] });
    this.styleSettings = resolveInitialStyle(axisConfig.settings, this.styleSettings, this.composer);

    if (this.scale.type === 'ordinal') {
      this.data = this.scale.scale.domain();
    }

    extend(true, this.settings, axisConfig.settings, this.styleSettings);
    this.concreteNodeBuilder = nodeBuilder(this.scale.type);
    dockAlignSetup(this.dock, this.settings, this.scale.type);

    Object.keys(this.styleSettings).forEach((a) => {
      this.settings[a] = resolveForDataValues(this.settings[a]);
    });
  },
  preferredSize(opts) {
    const {
      formatter,
      ticksFn,
      settings,
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
      settings,
      ticksFn,
      setEdgeBleed: (val) => {
        this.dockConfig.edgeBleed = val;
      }
    });

    return reqSize;
  },
  render() {
    const {
      formatter,
      ticksFn,
      settings,
      data,
      innerRect,
      outerRect,
      measureText
    } = this;
    const ticks = ticksFn({
      settings,
      innerRect,
      scale: this.scale.scale,
      data,
      formatter
    });

    const nodes = [];
    nodes.push(...this.concreteNodeBuilder.build({
      settings,
      scale: this.scale.scale,
      innerRect,
      outerRect,
      measureText,
      ticks
    }));

    crispify.multiple(nodes);

    return nodes;
  },
  update(opts = {}) {
    // axisConfig = opts.settings;
    // layoutConfig = dockConfig();
    // continuous.dockConfig = layoutConfig;
    // discrete.dockConfig = layoutConfig;
    // dataScale = composer.scale(axisConfig);
    // scale = dataScale.scale;
    // type = dataScale.type;
    this.init(opts.settings);
  },
  beforeRender(opts) {
    const {
      inner,
      outer
    } = opts;
    const extendedInner = {};
    extend(extendedInner, inner, alignTransform({
      align: this.settings.align,
      inner
    }));
    const finalOuter = outer || extendedInner;
    extend(this.innerRect, extendedInner);
    extend(this.outerRect, finalOuter);
    return outer;
  }
};

export default createComponentFactory(axisComponent);
