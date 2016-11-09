import { registry } from '../../utils/registry';
import { line } from './line';

const reg = registry();

reg.register('line', line);

export function creategrid(arr, composer) {
  const items = [];
  arr.forEach((item) => {
    if (item.type in reg.registry) {
      items.push(reg.registry[item.type](item, composer));
    }
  });
  return items;
}
