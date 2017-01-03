function element(name) {
  const e = {
    name,
    attributes: {},
    style: {},
    children: [],
    listeners: {},
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
      this.listeners[key] = val;
    },
    trigger(listenerKey, arg) {
      this.listeners[listenerKey].call(this, arg);
    }
  };

  if (name === 'canvas') {
    e.getContext = () => ({});
  }

  return e;
}

export default element;
