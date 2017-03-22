function index(boundaries, point, after) {
  let i = 0;
  while (i < boundaries.length && point > boundaries[i]) {
    ++i;
  }
  if (boundaries[i] === point && after) {
    ++i;
  }
  return i;
}

function contains(boundaries, point) {
  const len = boundaries.length;

  for (let i = 1; i < len; i += 2) {
    if (boundaries[i - 1] <= point && point <= boundaries[i]) {
      return true;
    }
  }
  return false;
}

export default function rangeCollection() {
  let boundaries = [];

  function fn() {}

  fn.add = (range) => {
    const min = range.min;
    const max = range.max;

    const i0 = index(boundaries, min);
    const i1 = index(boundaries, max, true);

    const args = [i0, i1 - i0];
    if (i0 % 2 === 0) {
      args.push(min);
    }
    if (i1 % 2 === 0) {
      args.push(max);
    }
    boundaries.splice(...args);
  };

  fn.remove = (range) => {
    const min = range.min;
    const max = range.max;

    const i0 = index(boundaries, min);
    const i1 = index(boundaries, max, true);

    const args = [i0, i1 - i0];
    if (i0 % 2 === 1) {
      args.push(min);
    }
    if (i1 % 2 === 1) {
      args.push(max);
    }
    boundaries.splice(...args);
  };

  fn.set = (range) => {
    boundaries = [];
    if (Array.isArray(range)) {
      range.forEach(fn.add);
    } else {
      fn.add(range);
    }
  };

  fn.clear = () => (boundaries = []);

  fn.containsValue = value => contains(boundaries, value);

  fn.ranges = () => {
    const collection = [];
    for (let i = 1; i < boundaries.length; i += 2) {
      collection.push({
        min: boundaries[i - 1],
        max: boundaries[i]
      });
    }
    return collection;
  };

  return fn;
}
