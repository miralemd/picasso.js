import createComponentFactory from './component';
import { registry } from '../utils/registry';
import boxMarkerComponent from './markers/box';
import pointMarkerComponent from './markers/point';
import gridLineComponent from './grid/index';
import axisComponent from './axis/index';
import textComponent from './text/index';

const reg = registry();

reg.register('text', textComponent);
reg.register('axis', axisComponent);
reg.register('box-marker', boxMarkerComponent);
reg.register('point-marker', pointMarkerComponent);
reg.register('grid-line', gridLineComponent);

export default function component(name, definition) {
  if (definition) {
    reg.register(name, createComponentFactory(definition));
  }
  return reg.get(name);
}
