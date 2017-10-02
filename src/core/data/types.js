import registry from '../utils/registry';
import dataset from './dataset';

const reg = registry();

export default function data(type, obj) {
  if (obj) {
    reg.add(type, obj);
  }
  if (type) {
    return reg.get(type);
  }
  return reg.get('default');
}

data('default', dataset);
