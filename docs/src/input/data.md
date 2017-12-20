# Data

Data in picasso.js generally flows from top to bottom: one or more data sources of various types are provided to a chart instance, each component can then use those data sources or parts of them.

## Providing data to a picasso instance

```js
picasso.chart({
  data: [{
    key: 'table 1',
    type: 'matrix',
    data: [/* */]
  }, {
    key: 'table2',
    type: 'matrix',
    data: [/* */]
  }]
});
```

## Providing and using data in components

You can provide data to a component in a few different ways, depending on how you want to visualize it. You should always strive to create a data structure that as closely as possible resembles the visual output of the component, to ensure as little manipulation as possible of the data in the actual component.

**Manual input**

The simplest way to provide data to a component is an array of data values:

```js
// input
data: [1, 2, 3]

// or
data: {
  items: [{ num: 1, text: 'one' }, { num: 2, text: 'two' }, { num: 3, text: 'three' }],
  value: v => v.num,
  label: v => v.text
}
```

The data input is then normalized to ensure the structure consumed by a component is always the same, regardless of input. So both of the above configurations will result in the following output:

```js
data: {
  items: [{ value: 1, label: 'one' }, { value: 2, label: 'two' }, { value: 3, label: 'three' }]
}
```

**Extracting data from datasets**

Assuming we have the following dataset input:

```js
picasso.chart({
  data: [{
    key: 'Products',
    type: 'matrix',
    data: [
      ['Product', 'Year', 'Sales', 'Margin'],
      [{ name: 'Boots', group: 'Shoes' }, 2015, 45, 0.23],
      [{ name: 'Sneakers', group: 'Shoes' }, 2016, 49, 0.21],
      [{ name: 'Sandals', group: 'Shoes' }, 2017, 42, 0.25],
      [{ name: 'White socks', group: 'Socks' }, 2016, 14, 0.42],
      [{ name: 'Blue socks', group: 'Socks' }, 2017, 15, 0.41]
    ]
  }]
});
```

and want to create a scatter plot where each bubble represents a _Product group_, and _Sales_ and _Margin_ are mapped to a bubble's `x` and `y` properties. Since there are only two product groups we want to **extract** those data points, aggregate the values for _Sales_ and _Margin_, and ignore the fields we are not interested in (_Year_).

How to extract data points and how the resulting data output looks like is determined by each dataset _type_. For the `matrix` type we can do the following:

```js
data: {
  extract: [{
    source: 'Products',
    field: 'Product',
    trackBy: v => v.group, // collect products based on the 'group' property
    reduce: values => values[0].group, // use the group property as value for the group
    props: { // each property config is attached as a property to the main item
      x: { field: 'Sales', reduce: 'sum' },
      y: { field: 'Margin', reduce: 'avg' }
    }
  }]
}
```

which would result in the following data struct:

```js
data: {
  items: [
    {
      value: 'Shoes', label: 'Shoes', source: { key: 'Products', field: 'Product' },
      x: { value: 136, label: '136', source: { key: 'Products', field: 'Sales' } },
      y: { value: 0.23, label: '0.23', source: { key: 'Products', field: 'Margin' } }
    },
    {
      value: 'Socks', label: 'Socks', source: { key: 'Products', field: 'Product' },
      x: { value: 29, label: '29', source: { key: 'Products', field: 'Sales' } },
      y: { value: 0.415, label: '0.415', source: { key: 'Products', field: 'Margin' } }
    }
  ],
  fields: [{/* a 'field' instance */}]
}
```

> Notice that the data `source` for each value is stored in the output, this plays a key part in enabling _brushing_. [TODO - explain brushing in picasso]

**Filtering**

A `filter` function can be used to exclude certain values in the data source:

```js
data: {
  extract: [{
    source: 'Products',
    field: 'Product',
    filter: d => d.name !== 'Sandals' // exclude 'Sandals'
  }]
}
```

**Stacking**

Extracted items can be stacked using a `stack` configuration:

```js
data: {
  extract: [{
    source: 'Products',
    field: 'Product',
    value: d => d.name,
    label: d => `<${d.name}>`
    props: {
      year: { field: 'Year' }
      num: { field: 'Sales' }
    }
  }],
  stack: {
    stackKey: d =>  d.year.value, // stack by year
    value: d => d.num.value // stack using the num value for each product
  }
}

// output
[
  {
    value: 'Boots', label: '<Boots>', source: {}
    year: { value: 2015, source: {} },
    num: { value: 45, source: {} },
    start: { value: 0, source: {} },
    end: { value: 45, source: {} },
  },
  {
    value: 'Sneakers', label: '<Sneakers>', source: {}
    year: { value: 2016, source: {} },
    num: { value: 49, source: {} },
    start: { value: 0, source: {} },
    end: { value: 49, source: {} },
  },
  {
    value: 'Sandals', label: '<Sandals>', source: {}
    year: { value: 2017, source: {} },
    num: { value: 42, source: {} },
    start: { value: 0, source: {} },
    end: { value: 42, source: {} },
  },
  {
    value: 'White socks', label: '<White socks>', source: {}
    year: { value: 2016, source: {} },
    num: { value: 14, source: {} },
    start: { value: 49, source: {} },
    end: { value: 63, source: {} },
  },
  {
    value: 'Blue socks', label: '<Blue socks>', source: {}
    year: { value: 2015, source: {} },
    num: { value: 15, source: {} },
    start: { value: 42, source: {} },
    end: { value: 67, source: {} },
  }
]
```

## API reference

{{postprocess 'index'}}

### Dataset

{{>magic ctx='definitions.dataset' parent='dataset'}}

### Field

{{>magic ctx='definitions.field' parent='field'}}
