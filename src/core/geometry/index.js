import { create as rect } from './rect';
import { create as circle } from './circle';
import { create as line } from './line';
import { registry } from '../utils/registry';

const reg = registry();

reg.add('rect', rect);
reg.add('circle', circle);
reg.add('line', line);

export function create(type, ...input) { // eslint-disable-line import/prefer-default-export
  return reg.get(type)(...input);
}
