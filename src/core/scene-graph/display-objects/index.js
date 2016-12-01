import { create as stage } from './stage';
import { create as container } from './container';
import { create as rect } from './rect';
import { create as circle } from './circle';
import { create as line } from './line';
import { create as text } from './text';
import { registry } from '../../utils/registry';

const reg = registry();

reg.add('rect', rect);
reg.add('circle', circle);
reg.add('text', text);
reg.add('line', line);
reg.add('stage', stage);
reg.add('container', container);

export function create(type, input) { // eslint-disable-line import/prefer-default-export
  return reg.get(type)(input);
}
