import extend from 'extend';

import createComponentFactory from './component';
import { registry } from '../utils/registry';
import markersFactory from './markers/index';
import gridFactory from './grid/index';
import axisFactory from './axis/index';
import textFactory from './text/index';

const reg = registry();

reg.register('markers', markersFactory);
reg.register('grid', gridFactory);
reg.register('axes', axisFactory);
reg.register('texts', textFactory);

reg.register('box-marker', (settings, composer) => markersFactory([extend({}, settings, { type: 'box' })], composer)[0]);
reg.register('point-marker', (settings, composer) => markersFactory([extend({}, settings, { type: 'point' })], composer)[0]);
reg.register('grid-line', (settings, composer) => gridFactory([extend({}, settings, { type: 'line' })], composer)[0]);
reg.register('axis', (settings, composer) => axisFactory([settings], composer)[0]);
reg.register('text', (settings, composer) => textFactory([settings], composer)[0]);

export function register(name, componentFactory) {
  reg.register(name, componentFactory);
}

export function getComponent(name) {
  return reg.get(name);
}

export function component(name, definition) {
  reg.register(name, createComponentFactory(definition));
}

export default function components(obj, composer) {
  return reg.build(obj, composer);
}
