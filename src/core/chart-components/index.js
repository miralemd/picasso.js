import extend from 'extend';

import createComponentFactory from './component';
import { registry } from '../utils/registry';
import markersFactory from './markers/index';
import gridFactory from './grid/index';
import axisComponent from './axis/index';
import textComponent from './text/index';

const reg = registry();

// 'old' components

reg.register('box-marker', (settings, composer) => markersFactory([extend({}, settings, { type: 'box' })], composer)[0]);
reg.register('point-marker', (settings, composer) => markersFactory([extend({}, settings, { type: 'point' })], composer)[0]);
reg.register('grid-line', (settings, composer) => gridFactory([extend({}, settings, { type: 'line' })], composer)[0]);

// 'new' components
reg.register('text', textComponent);
reg.register('axis', axisComponent);

function register(name, componentFactory) {
  reg.register(name, componentFactory);
}

function component(name, definition) {
  reg.register(name, createComponentFactory(definition));
}

function getComponent(name) {
  return reg.get(name);
}

export {
  component,
  getComponent,
  register
};

