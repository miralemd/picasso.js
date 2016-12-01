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


export default function components(obj, composer) {
  return reg.build(obj, composer);
}
