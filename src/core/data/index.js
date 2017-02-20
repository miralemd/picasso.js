import { registry } from '../utils/registry';
import dataset from './dataset';

const reg = registry();

export default function data(obj) {
  if (obj.type in reg.registry) {
    return reg.registry[obj.type]()(obj.data);
  } else if (obj.data) {
    return dataset()(obj.data);
  }
  return null;
}

export function register(type, qTable) {
  return reg.add(type, qTable);
}
