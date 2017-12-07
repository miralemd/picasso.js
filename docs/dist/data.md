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

**Stacking**

Extracted items can be stacked using a `stack` configuration:

```js
data: {
  extract: [{
    source: 'Products',
    field: 'Product',
    value: d => d.name,
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
    value: 'Boots', source: {}
    year: { value: 2015, source: {} },
    num: { value: 45, source: {} },
    start: { value: 0, source: {} },
    end: { value: 45, source: {} },
  },
  {
    value: 'Sneakers', source: {}
    year: { value: 2016, source: {} },
    num: { value: 49, source: {} },
    start: { value: 0, source: {} },
    end: { value: 49, source: {} },
  },
  {
    value: 'Sandals', source: {}
    year: { value: 2017, source: {} },
    num: { value: 42, source: {} },
    start: { value: 0, source: {} },
    end: { value: 42, source: {} },
  },
  {
    value: 'White socks', source: {}
    year: { value: 2016, source: {} },
    num: { value: 14, source: {} },
    start: { value: 49, source: {} },
    end: { value: 63, source: {} },
  },
  {
    value: 'Blue socks', source: {}
    year: { value: 2015, source: {} },
    num: { value: 15, source: {} },
    start: { value: 42, source: {} },
    end: { value: 67, source: {} },
  }
]
```

## API reference

* <a href="#dataset.key">dataset.key</a>
* <a href="#dataset.raw">dataset.raw</a>
* <a href="#dataset.field">dataset.field</a>
* <a href="#dataset.fields">dataset.fields</a>
* <a href="#dataset.extract">dataset.extract</a>
* <a href="#dataset.hierarchy">dataset.hierarchy</a>
* <a href="#field.id">field.id</a>
* <a href="#field.key">field.key</a>
* <a href="#field.raw">field.raw</a>
* <a href="#field.tags">field.tags</a>
* <a href="#field.type">field.type</a>
* <a href="#field.min">field.min</a>
* <a href="#field.max">field.max</a>
* <a href="#field.title">field.title</a>
* <a href="#field.items">field.items</a>
* <a href="#field.formatter">field.formatter</a>


### Dataset

<a name='dataset.key' href='#dataset.key'># </a>*dataset*.**key**() *:string*

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| Returns |  *string*  | No | ... | ... |

Get the key identifying this dataset

<a name='dataset.raw' href='#dataset.raw'># </a>*dataset*.**raw**() *:any*

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| Returns |  *any*  | No | ... | ... |

Get the raw data

<a name='dataset.field' href='#dataset.field'># </a>*dataset*.**field**(query *:string*) *:field*

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| query |  *string*  | The field to find | No | No |
| Returns |  *field*  | No | ... | ... |

Find a field within this dataset

<a name='dataset.fields' href='#dataset.fields'># </a>*dataset*.**fields**() *:Array&lt;field&gt;*

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| Returns |  *Array&lt;field&gt;*  | No | ... | ... |

Get all fields within this dataset

<a name='dataset.extract' href='#dataset.extract'># </a>*dataset*.**extract**(config *:data-extract-config*) *:Array&lt;datum-extract&gt;*

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| config |  *data-extract-config*  | No | No | No |
| Returns |  *Array&lt;datum-extract&gt;*  | No | ... | ... |

Extract data items from this dataset

<a name='dataset.hierarchy' href='#dataset.hierarchy'># </a>*dataset*.**hierarchy**() *:null*

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| Returns |  *null*  | No | ... | ... |

No description


### Field

<a name='field.id' href='#field.id'># </a>*field*.**id**() *:string*

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| Returns |  *string*  | No | ... | ... |

Returns this field&#x27;s id

<a name='field.key' href='#field.key'># </a>*field*.**key**() *:string*

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| Returns |  *string*  | No | ... | ... |

Returns this field&#x27;s key

<a name='field.raw' href='#field.raw'># </a>*field*.**raw**() *:any*

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| Returns |  *any*  | No | ... | ... |

Returns the input data

<a name='field.tags' href='#field.tags'># </a>*field*.**tags**() *:Array&lt;string&gt;*

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| Returns |  *Array&lt;string&gt;*  | No | ... | ... |

Returns the tags.

<a name='field.type' href='#field.type'># </a>*field*.**type**() *:string*

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| Returns |  *string*  | No | ... | ... |

Returns this field&#x27;s type: &#x27;dimension&#x27; or &#x27;measure&#x27;.

<a name='field.min' href='#field.min'># </a>*field*.**min**() *:number*

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| Returns |  *number*  | No | ... | ... |

Returns the min value of this field.

<a name='field.max' href='#field.max'># </a>*field*.**max**() *:number*

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| Returns |  *number*  | No | ... | ... |

Returns the max value of this field.

<a name='field.title' href='#field.title'># </a>*field*.**title**() *:string*

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| Returns |  *string*  | No | ... | ... |

Returns this field&#x27;s title.

<a name='field.items' href='#field.items'># </a>*field*.**items**() *:Array&lt;datum-extract&gt;*

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| Returns |  *Array&lt;datum-extract&gt;*  | No | ... | ... |

Returns the values of this field.

<a name='field.formatter' href='#field.formatter'># </a>*field*.**formatter**()


Returns a formatter adapted to the content of this field.

