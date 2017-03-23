# Data

* <a href="#picasso.data.dataset">picasso.data.dataset</a>
* <a href="#dataset">dataset</a>
* <a href="#dataset.tables">dataset.tables</a>
* <a href="#dataset.table">dataset.table</a>
* <a href="#dataset.map">dataset.map</a>
* <a href="#picasso.data.table">picasso.data.table</a>
* <a href="#table">table</a>
* <a href="#table.data">table.data</a>
* <a href="#table.id">table.id</a>
* <a href="#table.fields">table.fields</a>
* <a href="#table.findField">table.findField</a>
* <a href="#picasso.data.field">picasso.data.field</a>
* <a href="#field">field</a>
* <a href="#field.data">field.data</a>
* <a href="#field.tags">field.tags</a>
* <a href="#field.type">field.type</a>
* <a href="#field.min">field.min</a>
* <a href="#field.max">field.max</a>
* <a href="#field.title">field.title</a>
* <a href="#field.values">field.values</a>
* <a href="#field.formatter">field.formatter</a>


## Dataset

#### <a name='picasso.data.dataset' href='#picasso.data.dataset'>#</a> **picasso.data.dataset**()

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| Returns | dataset | No | ... | ... |

Create a new dataset with default settings  
#### <a name='dataset' href='#dataset'>#</a> **dataset**(*object d*)

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| d | object | The data | No | No |

No description  
#### <a name='dataset.tables' href='#dataset.tables'>#</a> **dataset.tables**()

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| Returns | Array.&lt;table&gt; | All tables found in this dataset | ... | ... |

Get all tables in this dataset  
#### <a name='dataset.table' href='#dataset.table'>#</a> **dataset.table**(*string query*)

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| query | string | Table identifier | No | No |
| Returns | table | A table | ... | ... |

Find a table in this dataset  
#### <a name='dataset.map' href='#dataset.map'>#</a> **dataset.map**(*data-map mapper, data-repeater repeater*)

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| mapper | data-map | An object specifing how to map the data | No | No |
| repeater | data-repeater | An object specifing which data to loop over when aggregating | No | No |
| Returns | Array.&lt;object&gt; | Mapped data | ... | ... |

Map data from multiple sources into a specified structure  
#### Examples

```js
ds.map({
 x: { field: '/qHyperCube/qMeasureInfo/1', reducer: 'sum' }
 y: { field: '/qHyperCube/qMeasureInfo/2', reducer: 'avg' },
 me: { field: '/qHyperCube/qDimensionInfo/1', reducer: 'first', type: 'qual' },
 parent: { field: '/qHyperCube/qDimensionInfo/0', reducer: 'first', type: 'qual' }
}, {
 field: '/qHyperCube/qDimensionInfo/1'
});
// output:
// [
//   {
//     x: { value: 234, source: {...} },
//     y: { value: 12, source: {...} },
//     me: { value: 'Jan', source: {...} },
//     parent: { value: '2012', source: {...} },
//   },
//   {
//     x: { value: 212, source: {...} },
//     y: { value: 5, source: {...} },
//     me: { value: 'Feb', source: {...} },
//     parent: { value: '2012', source: {...} },
//   }
// ]
```
```js
data-map: {
  field: 'foo', // Path to a field.
  reducer: 'sum', // Option to specify how to reduce values. Default: 'sum'. Optional.
}
```
```js
data-repeater: {
  field: 'foo', // Path to a field.
  attribute: 'foo', // Attribute to use as identifier when collecting data. Optional.
}
```

## Table

#### <a name='picasso.data.table' href='#picasso.data.table'>#</a> **picasso.data.table**()

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| Returns | table | No | ... | ... |

Create a new table with default acessors  
#### <a name='table' href='#table'>#</a> **table**(*object d*)

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| d | object | Sets data content for this table | No | No |

No description  
#### <a name='table.data' href='#table.data'>#</a> **table.data**()

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| Returns | object | No | ... | ... |

Returns this table&#x27;s data  
#### <a name='table.id' href='#table.id'>#</a> **table.id**()

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| Returns | string | No | ... | ... |

Returns this table&#x27;s id  
#### <a name='table.fields' href='#table.fields'>#</a> **table.fields**()

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| Returns | Array.&lt;field&gt; | No | ... | ... |

Returns the fields in this table  
#### <a name='table.findField' href='#table.findField'>#</a> **table.findField**()

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| Returns | field | No | ... | ... |

Finds the field based on the specified query  


## Field

#### <a name='picasso.data.field' href='#picasso.data.field'>#</a> **picasso.data.field**()

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| Returns | field | Data field | ... | ... |

Create a new field with default settings  
#### <a name='field' href='#field'>#</a> **field**(*object d*)

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| d | object | Field data | No | No |

No description  
#### <a name='field.data' href='#field.data'>#</a> **field.data**()

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| Returns | object | No | ... | ... |

Returns the current data used in this field.  
#### <a name='field.tags' href='#field.tags'>#</a> **field.tags**()

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| Returns | Array.&lt;string&gt; | No | ... | ... |

Returns the tags.  
#### <a name='field.type' href='#field.type'>#</a> **field.type**()

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| Returns | string | No | ... | ... |

Returns this field&#x27;s type: &#x27;dimension&#x27; or &#x27;measure&#x27;.  
#### <a name='field.min' href='#field.min'>#</a> **field.min**()

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| Returns | number | No | ... | ... |

Returns the min value of this field.  
#### <a name='field.max' href='#field.max'>#</a> **field.max**()

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| Returns | number | No | ... | ... |

Returns the max value of this field.  
#### <a name='field.title' href='#field.title'>#</a> **field.title**()

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| Returns | string | [description] | ... | ... |

Returns this field&#x27;s title.  
#### <a name='field.values' href='#field.values'>#</a> **field.values**()

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| Returns | Array.&lt;object&gt; | No | ... | ... |

Returns the values of this field.  
#### <a name='field.formatter' href='#field.formatter'>#</a> **field.formatter**()


Returns a formatter adapted to the content of this field.  
