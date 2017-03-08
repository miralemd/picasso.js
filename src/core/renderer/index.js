import { registry } from '../utils/registry';

let prio = [];

const reg = registry();

export default function renderer(type = prio[0]) {
  if (!reg.has(type)) {
    throw new Error(`Renderer of type '${type}' does not exist`);
  }
  return reg.get(type)();
}

renderer.register = function register(type, fn) {
  if (reg.add(type, fn)) {
    prio.push(type);
  }
  return this;
};

renderer.deregister = function deregister(type) {
  reg.remove(type);
  const idx = prio.indexOf(type);
  if (idx !== -1) {
    prio.splice(idx, 1);
  }
  return this;
};

renderer.types = function types() {
  return reg.getKeys().slice();
};

renderer.prio = function prioFn(p) {
  if (p) {
    prio = p.slice();
    return this;
  }
  return prio.slice();
};
