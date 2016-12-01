import { registry } from '../utils/registry';

let prio = [];

let reg = registry();

export default function renderer(type = prio[0]) {
  if (!reg.has(type)) {
    throw new Error(`Renderer of type '${type}' does not exist`);
  }
  return reg.get(type)();
}

renderer.register = function (type, fn) {
  if (reg.add(type, fn)) {
    prio.push(type);
  }
  return this;
};

renderer.deregister = function (type) {
  reg.remove(type);
  let idx = prio.indexOf(type);
  if (idx !== -1) {
    prio.splice(idx, 1);
  }
  return this;
};

renderer.types = function () {
  return reg.getKeys().slice();
};

renderer.prio = function (p) {
  if (p) {
    prio = p.slice();
    return this;
  }
  return prio.slice();
};
