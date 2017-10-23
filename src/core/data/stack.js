import fieldFn from './field';

function stack(data, config) {
  const stackIds = {};
  const stackFn = config.stackKey;
  const valueFn = config.value;
  const startProp = config.startProp || 'start';
  const endProp = config.endProp || 'end';

  for (let i = 0; i < data.items.length; i++) {
    let p = data.items[i];
    let sid = stackFn(p);
    stackIds[sid] = stackIds[sid] || { positive: 0, negative: 0 };

    let value = valueFn(p);
    let stackTotal = value >= 0 ? stackIds[sid].positive : stackIds[sid].negative;
    p[startProp] = { value: stackTotal };
    p[endProp] = { value: stackTotal + value };

    if (value === 'NaN') {
      continue;
    }
    stackIds[sid][value >= 0 ? 'positive' : 'negative'] += value;
  }

  const values = [];

  Object.keys(stackIds).forEach(s => values.push(stackIds[s].positive, stackIds[s].negative));

  const field = fieldFn({
    title: '__stack',
    min: Math.min(...values),
    max: Math.max(...values),
    type: 'measure',
    formatter: data.fields[0].formatter
  });
  data.fields.unshift(field);
}

export {
  stack as default
};
