# Data

Data in picasso.js generally flows from top to bottom: one or more datasets of various types are provided to a chart instance, each component can then use those datasets or parts of them.

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
  items: [{ num: 1, label: 'one' }, { num: 2, label: 'two' }, { num: 3, label: 'three' }],
  value: v => v.num
}
```

The data input is then normalized to ensure the structure consumed by a component is always the same, regardless of input. So both of the above configurations will result in the following output:

```js
data: {
  items: [{ value: 1 }, { value: 2 }, { value: 3 }]
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
      value: 'Shoes', source: { key: 'Products', field: 'Product' },
      x: { value: 136, source: { key: 'Products', field: 'Sales' } },
      y: { value: 0.23, source: { key: 'Products', field: 'Margin' } }
    },
    {
      value: 'Socks', source: { key: 'Products', field: 'Product' },
      x: { value: 29, source: { key: 'Products', field: 'Sales' } },
      y: { value: 0.415, source: { key: 'Products', field: 'Margin' } }
    }
  ],
  fields: [{/* a 'field' instance */}]
}
```

> Notice that the data `source` for each value is stored in the output, this plays a key part in enabling _brushing_. [TODO - explain brushing in picasso]



- data as array
- data items
- collections
- fields,
- hierarchy
- extraction
  - main field
  - trackBy
  - value
  - props
    - field
    - reduce
    - value
  - amend
- stack

## Types

### `matrix`

### `q`



## API reference

{{postprocess 'index'}}

### Dataset

{{>magic ctx='core.data.dataset-js'}}

### Field

{{>magic ctx='core.data.field-js'}}
