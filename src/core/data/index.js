import { qTable } from './q/q-table';
import { registry } from '../utils/registry';

const reg = registry();

reg.add('q', qTable);

export function data(obj) {
  if (obj.type in reg.registry) {
    return reg.registry[obj.type]().data(obj.data);
  }
  return null;
}
