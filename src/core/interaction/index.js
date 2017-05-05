import { registry } from '../utils/registry';
import native from '../../web/interactions/native';

const reg = registry();

function interaction(name, definition) {
  if (definition) {
    reg.register(name, definition);
  }
  return reg.get(name);
}

interaction('native', native);

export default interaction;
