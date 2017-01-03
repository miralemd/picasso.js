import extend from 'extend';

import createComponentFactory from './component';
import { registry } from '../utils/registry';
import markersFactory from './markers/index';
import gridLineComponent from './grid/index';
import axisComponent from './axis/index';
import textComponent from './text/index';

const reg = registry();

// 'old' components

reg.register('box-marker', (settings, composer) => markersFactory([extend({}, settings, { type: 'box' })], composer)[0]);
reg.register('point-marker', (settings, composer) => markersFactory([extend({}, settings, { type: 'point' })], composer)[0]);

// 'new' components
reg.register('text', textComponent);
reg.register('axis', axisComponent);
reg.register('grid-line', gridLineComponent);

export default function component(name, definition) {
  if (definition) {
    reg.register(name, createComponentFactory(definition));
  }
  return reg.get(name);
}
