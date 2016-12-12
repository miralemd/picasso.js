import extend from 'extend';
import nodeBuilder from './axis-node-builder';
import { discreteDefaultSettings, continuousDefaultSettings } from './axis-default-settings';
import { generateContinuousTicks, generateDiscreteTicks } from './axis-tick-generators';
import dockConfig from '../../dock-layout/dock-config';
import calcRequiredSize from './axis-size-calculator';
import resolveSettingsForPath from '../settings-setup';
import { resolveForDataValues } from '../../style';

function alignTransform({ align, inner }) {
  if (align === 'left') {
    return { x: inner.width + inner.x };
  } else if (align === 'right' || align === 'bottom') {
    return inner;
  } else {
    return { y: inner.y + inner.height };
  }
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
  const nodes = [];
  const dataScale = composer.scale(axisConfig);
  const scale = dataScale.scale;
  const type = dataScale.type;
  const formatter = composer.formatter(axisConfig.formatter || { source: dataScale.sources[0] });
  let data;
  let concreteNodeBuilder;
  let settings;
  let styleSettings;
  let ticksFn;
  const layoutConfig = dockConfig();

  const init = function () {
    styleSettings = resolveInitialStyle(axisConfig.settings, styleSettings, composer);
    extend(true, settings, axisConfig.settings, styleSettings);
    concreteNodeBuilder = nodeBuilder(type);
    dockAlignSetup(settings, type);
    layoutConfig.dock(settings.dock);
    layoutConfig.requiredSize(calcRequiredSize({ type, data, formatter, renderer, scale, settings, ticksFn, layoutConfig }));
    layoutConfig.displayOrder(settings.displayOrder);
    layoutConfig.prioOrder(settings.prioOrder);

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
    data = scale.domain();
    init();

    return discrete;
  };

  const render = function () {
    const ticks = ticksFn({ settings, innerRect, scale, data, formatter });

    nodes.push(...concreteNodeBuilder.build({ settings, scale, innerRect, outerRect, renderer, ticks }));
    renderer.render(nodes);
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
  continuous.onData = onData;
  continuous.resize = resize;
  continuous.dockConfig = layoutConfig;

  discrete.render = render;
  discrete.onData = onData;
  discrete.resize = resize;
  discrete.dockConfig = layoutConfig;

  return type === 'ordinal' ? discrete : continuous;
}

export function axis(...a) {
  const ax = abstractAxis(...a);
  return ax();
}
