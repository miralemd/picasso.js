import extend from 'extend';
import nodeBuilder from './axis-node-builder';
import { discreteDefaultSettings, continuousDefaultSettings } from './axis-default-settings';
import { generateContinuousTicks, generateDiscreteTicks } from './axis-tick-generators';
import dockConfig from '../../dock-layout/dock-config';
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

function dockAlignSetup(settings, type) {
  if (settings.dock && !settings.align) {
    settings.align = settings.dock;
  } else if (!settings.dock && !settings.align) {
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

export function abstractAxis(axisConfig, composer, renderer) {
  const innerRect = { width: 0, height: 0, x: 0, y: 0 };
  const outerRect = { width: 0, height: 0, x: 0, y: 0 };
  let dataScale = composer.scale(axisConfig);
  let scale = dataScale.scale;
  let type = dataScale.type;
  let formatter;
  let data;
  let concreteNodeBuilder;
  let settings;
  let styleSettings;
  let ticksFn;
  let layoutConfig = dockConfig();

  const init = function () {
    formatter = composer.formatter(axisConfig.formatter || { source: dataScale.sources[0] });
    styleSettings = resolveInitialStyle(axisConfig.settings, styleSettings, composer);

    if (type === 'ordinal') {
      data = scale.domain();
    }

    extend(true, settings, axisConfig.settings, styleSettings);
    concreteNodeBuilder = nodeBuilder(type);
    dockAlignSetup(settings, type);

    layoutConfig.dock(settings.dock);
    layoutConfig.requiredSize(calcRequiredSize({ type, data, formatter, renderer, scale, settings, ticksFn, layoutConfig }));
    layoutConfig.displayOrder(settings.displayOrder);
    layoutConfig.prioOrder(settings.prioOrder);
    layoutConfig.minimumLayoutMode(settings.minimumLayoutMode);

    Object.keys(styleSettings).forEach((a) => {
      settings[a] = resolveForDataValues(settings[a]);
    });
  };

  const continuous = function () {
    [settings, styleSettings] = continuousDefaultSettings();
    ticksFn = generateContinuousTicks;
    init();

    return continuous;
  };

  const discrete = function () {
    [settings, styleSettings] = discreteDefaultSettings();
    ticksFn = generateDiscreteTicks;
    init();

    return discrete;
  };

  const render = function () {
    const ticks = ticksFn({ settings, innerRect, scale, data, formatter });

    const nodes = [];
    nodes.push(...concreteNodeBuilder.build({ settings, scale, innerRect, outerRect, renderer, ticks }));

    crispify.multiple(nodes);

    renderer.render(nodes);
  };

  const update = function (opts = {}) {
    axisConfig = opts.settings;
    layoutConfig = dockConfig();
    continuous.dockConfig = layoutConfig;
    discrete.dockConfig = layoutConfig;
    dataScale = composer.scale(axisConfig);
    scale = dataScale.scale;
    type = dataScale.type;
    init();
    render();
  };

  const onData = function () {
        // Do something
  };

  const resize = function (inner, outer) {
    renderer.size(outer);
    extend(inner, alignTransform({ align: settings.align, inner }));
    outer = outer || inner;
    extend(innerRect, inner);
    extend(outerRect, outer);
  };

  // Declare public API
  continuous.render = render;
  continuous.update = update;
  continuous.onData = onData;
  continuous.resize = resize;
  continuous.dockConfig = layoutConfig;

  discrete.render = render;
  discrete.update = update;
  discrete.onData = onData;
  discrete.resize = resize;
  discrete.dockConfig = layoutConfig;

  return type === 'ordinal' ? discrete : continuous;
}

export function axis(...a) {
  const ax = abstractAxis(...a);
  return ax();
}
