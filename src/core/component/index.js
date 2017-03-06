import componentFactory from './component-factory';
import * as mixins from './component-mixins';
import { registry } from '../utils/registry';

const reg = registry();

function component(name, definition) {
  if (definition) {
    reg.register(name, componentFactory(definition));
  }
  return reg.get(name);
}

component.mixin = mixins.add;

export default component;
