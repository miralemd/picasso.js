# `legend-seq` component

## Example

```js
{
  type: 'legend-seq',
  scale: 'color',
  dock: 'top', 
  settings: {
    ticks: {
      label: (val, i, ary) => {
        let temp = ['Cold', 'Hot'];
        return temp[i % 2];
      },
    },
    title: { 
      text: 'ALL YOUR BASES BELONG TO US'
    }
  }
}
```

## API reference - Table of contents

{{postprocess 'index'}}

{{>magic ctx='core.chart-components.legend-seq.legend-seq-js'}}
