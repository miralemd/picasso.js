function element(name, rect = { x: 0, y: 0, width: 100, height: 100 }) {
  const e = {
    name,
    attributes: {},
    style: {},
    children: [],
    listeners: [],
    parentNode: null,
    parentElement: null,
    ownerDocument: {
      createElementNS(ns, tag) {
        return element(`${ns}:${tag}`);
      },
      createElement(tag) {
        return element(tag);
      }
    },
    cloneNode(b) {
      const ret = element(this.name);
      if (b) {
        ret.children = b.children.slice();
      }
      return ret;
    },
    replaceChild(add, remove) {
      this.children.splice(this.children.indexOf(remove), 1, add);
    },
    setAttribute(attr, value) {
      this.attributes[attr] = value;
    },
    appendChild(el) {
      this.children.push(el);
      el.parentNode = this;
      el.parentElement = this;
    },
    get firstChild() {
      return this.children[0];
    },
    removeChild(el) {
      this.children.splice(this.children.indexOf(el), 1);
      el.parentNode = null;
      el.parentElement = this;
    },
    addEventListener(key, val) {
      const obj = {};
      obj[key] = val;
      this.listeners.push(obj);
    },
    trigger(listenerKey, arg) {
      this.listeners
        .filter(l => typeof l[listenerKey] !== 'undefined')
        .forEach(l => l[listenerKey].call(this, arg));
    },
    getBoundingClientRect() {
      return {
        left: rect.x,
        top: rect.y,
        width: rect.width,
        height: rect.height
      };
    }
  };

  if (name === 'canvas') {
    e.getContext = () => ({
      save: () => {},
      beginPath: () => {},
      moveTo: () => {},
      arc: () => {},
      fill: () => {},
      restore: () => {},
      rect: () => {},
      measureText: text => ({ width: text.length })
    });
  }

  return e;
}

export default element;
