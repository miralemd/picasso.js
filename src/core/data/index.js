import { registry } from '../utils/registry';

const reg = registry();

export function data(obj) {
  if (obj.type in reg.registry) {
    return reg.registry[obj.type]()(obj.data);
  }
  return null;
}

export function register(type, qTable) {
  return reg.add(type, qTable);
}
