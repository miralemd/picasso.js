# Data

* <a href="#picasso.data.dataset">picasso.data.dataset</a>
* <a href="#dataset">dataset</a>
* <a href="#dataset.tables">dataset.tables</a>
* <a href="#dataset.table">dataset.table</a>
* <a href="#dataset.map">dataset.map</a>
* <a href="#data-map">data-map</a>
* <a href="#data-repeater">data-repeater</a>
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

|Name|Type|Description|Optional|
|----|----|-----------|--------|
| Returns | dataset |  | ... |

Create a new dataset with default settings  
#### <a name='dataset' href='#dataset'>#</a> **dataset**(*object d*)

|Name|Type|Description|Optional|
|----|----|-----------|--------|
| d | object | The data |No|

  
#### <a name='dataset.tables' href='#dataset.tables'>#</a> **dataset.tables**()

|Name|Type|Description|Optional|
|----|----|-----------|--------|
| Returns | Array.&lt;table&gt; | All tables found in this dataset | ... |

Get all tables in this dataset  
#### <a name='dataset.table' href='#dataset.table'>#</a> **dataset.table**(*string query*)

|Name|Type|Description|Optional|
|----|----|-----------|--------|
| query | string | Table identifier |No|
| Returns | table | A table | ... |

Find a table in this dataset  
#### <a name='dataset.map' href='#dataset.map'>#</a> **dataset.map**(*data-map mapper, data-repeater repeater*)

|Name|Type|Description|Optional|
|----|----|-----------|--------|
| mapper | data-map | An object specifing how to map the data |No|
| repeater | data-repeater | An object specifing which data to loop over when aggregating |No|
| Returns | Array.&lt;object&gt; | Mapped data | ... |

Map data from multiple sources into a specified structure  
#### Examples

```js
ds.map({
 x: { field: '/qHyperCube/qMeasureInfo/1', reducer: 'sum' }
 y: { field: '/qHyperCube/qMeasureInfo/2', reducer: 'avg' },
 me: { field: '/qHyperCube/qDimensionInfo/1', reducer: 'first', type: 'qual' },
 parent: { field: '/qHyperCube/qDimensionInfo/0', reducer: 'first', type: 'qual' }
}, {
 field: '/qHyperCube/qDimensionInfo/1
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
#### <a name='data-map' href='#data-map'>#</a> data-map

|Name(s)|Type(s)|Description|Optional|
|-------|-------|-----------|--------|
| field | string | Path to a field | No |
| reducer | string | Option to specify how to reduce values | Yes |


#### <a name='data-repeater' href='#data-repeater'>#</a> data-repeater

|Name(s)|Type(s)|Description|Optional|
|-------|-------|-----------|--------|
| field | string | Path to a field | No |
| attribute | string | Attribute to use as identifier when collecting data | Yes |



## Table

#### <a name='picasso.data.table' href='#picasso.data.table'>#</a> **picasso.data.table**()

|Name|Type|Description|Optional|
|----|----|-----------|--------|
| Returns | table |  | ... |

Create a new table with default acessors  
#### <a name='table' href='#table'>#</a> **table**(*object d*)

|Name|Type|Description|Optional|
|----|----|-----------|--------|
| d | object | Sets data content for this table |No|

  
#### <a name='table.data' href='#table.data'>#</a> **table.data**()

|Name|Type|Description|Optional|
|----|----|-----------|--------|
| Returns | object |  | ... |

Returns this table&#x27;s data  
#### <a name='table.id' href='#table.id'>#</a> **table.id**()

|Name|Type|Description|Optional|
|----|----|-----------|--------|
| Returns | string |  | ... |

Returns this table&#x27;s id  
#### <a name='table.fields' href='#table.fields'>#</a> **table.fields**()

|Name|Type|Description|Optional|
|----|----|-----------|--------|
| Returns | Array.&lt;field&gt; |  | ... |

Returns the fields in this table  
#### <a name='table.findField' href='#table.findField'>#</a> **table.findField**()

|Name|Type|Description|Optional|
|----|----|-----------|--------|
| Returns | field |  | ... |

Finds the field based on the specified query  


## Field

#### <a name='picasso.data.field' href='#picasso.data.field'>#</a> **picasso.data.field**()

|Name|Type|Description|Optional|
|----|----|-----------|--------|
| Returns | field | Data field | ... |

Create a new field with default settings  
#### <a name='field' href='#field'>#</a> **field**(*object d*)

|Name|Type|Description|Optional|
|----|----|-----------|--------|
| d | object | Field data |No|

  
#### <a name='field.data' href='#field.data'>#</a> **field.data**()

|Name|Type|Description|Optional|
|----|----|-----------|--------|
| Returns | object |  | ... |

Returns the current data used in this field.  
#### <a name='field.tags' href='#field.tags'>#</a> **field.tags**()

|Name|Type|Description|Optional|
|----|----|-----------|--------|
| Returns | Array.&lt;string&gt; |  | ... |

Returns the tags.  
#### <a name='field.type' href='#field.type'>#</a> **field.type**()

|Name|Type|Description|Optional|
|----|----|-----------|--------|
| Returns | string |  | ... |

Returns this field&#x27;s type: &#x27;dimension&#x27; or &#x27;measure&#x27;.  
#### <a name='field.min' href='#field.min'>#</a> **field.min**()

|Name|Type|Description|Optional|
|----|----|-----------|--------|
| Returns | number |  | ... |

Returns the min value of this field.  
#### <a name='field.max' href='#field.max'>#</a> **field.max**()

|Name|Type|Description|Optional|
|----|----|-----------|--------|
| Returns | number |  | ... |

Returns the max value of this field.  
#### <a name='field.title' href='#field.title'>#</a> **field.title**()

|Name|Type|Description|Optional|
|----|----|-----------|--------|
| Returns | string | [description] | ... |

Returns this field&#x27;s title.  
#### <a name='field.values' href='#field.values'>#</a> **field.values**()

|Name|Type|Description|Optional|
|----|----|-----------|--------|
| Returns | Array.&lt;object&gt; |  | ... |

Returns the values of this field.  
#### <a name='field.formatter' href='#field.formatter'>#</a> **field.formatter**()


Returns a formatter adapted to the content of this field.  
