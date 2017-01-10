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
  created() {
    this.innerRect = { width: 0, height: 0, x: 0, y: 0 };
    this.outerRect = { width: 0, height: 0, x: 0, y: 0 };

    let defaultSettings;
    let styleSettings;
    if (this.scale.type === 'ordinal') {
      [defaultSettings, styleSettings] = discreteDefaultSettings();
      this.ticksFn = generateDiscreteTicks;
    } else {
      [defaultSettings, styleSettings] = continuousDefaultSettings();
      this.ticksFn = generateContinuousTicks;
    }
    this.settings = extend(true, {}, defaultSettings, this.settings);
    this.styleSettings = styleSettings;

    this.init(this.settings);
  },
  init(settings) {
    // formatter = composer.formatter(axisConfig.formatter || { source: dataScale.sources[0] });
    this.styleSettings = resolveInitialStyle(settings.settings, this.styleSettings, this.composer);

    if (this.scale.type === 'ordinal') {
      this.data = this.scale.scale.domain();
    }

    extend(true, this.settings, settings.settings, this.styleSettings);

    ['dock', 'displayOrder', 'prioOrder'].forEach((prop) => {
      // Override the dock config (TODO should be refactored)
      this.dockConfig[prop] = this.settings[prop];
    });

    this.concreteNodeBuilder = nodeBuilder(this.scale.type);

    this.settings.align = getAlign(this.settings.dock, this.settings.align, this.scale.type);

    // Override the dock settings (TODO should be removed)
    ['dock', 'displayOrder', 'prioOrder'].forEach((prop) => {
      this.dockConfig[prop] = this.settings[prop];
    });

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
      align: this.settings.align,
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
  }
};

export default createComponentFactory(axisComponent);
