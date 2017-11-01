# Data

* <a href="#module.exports">module.exports</a>
* <a href="#dataset.key">dataset.key</a>
* <a href="#dataset.raw">dataset.raw</a>
* <a href="#dataset.field">dataset.field</a>
* <a href="#dataset.fields">dataset.fields</a>
* <a href="#dataset.extract">dataset.extract</a>
* <a href="#dataset.hierarchy">dataset.hierarchy</a>
* <a href="#module.exports">module.exports</a>
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


## Dataset

#### <a name='module.exports' href='#module.exports'>#</a> **module.exports**()

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| Returns | dataset | No | ... | ... |

Create a new dataset with default settings  
```js
dataset: {
}
```
#### <a name='dataset.key' href='#dataset.key'>#</a> **dataset.key**()

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| Returns | string | No | ... | ... |

Get the key identifying this dataset  
#### <a name='dataset.raw' href='#dataset.raw'>#</a> **dataset.raw**()

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| Returns | any | No | ... | ... |

Get the raw data  
#### <a name='dataset.field' href='#dataset.field'>#</a> **dataset.field**(*string query*)

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| query | string | The field to find | No | No |
| Returns | field | No | ... | ... |

Find a field within this dataset  
#### <a name='dataset.fields' href='#dataset.fields'>#</a> **dataset.fields**()

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| Returns | Array.&lt;field&gt; | No | ... | ... |

Get all fields within this dataset  
#### <a name='dataset.extract' href='#dataset.extract'>#</a> **dataset.extract**(*data-extract-config config*)

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| config | data-extract-config | No | No | No |
| Returns | Array.&lt;datum-extract&gt; | No | ... | ... |

Extract data items from this dataset  
#### <a name='dataset.hierarchy' href='#dataset.hierarchy'>#</a> **dataset.hierarchy**()

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| Returns | null | No | ... | ... |

No description  
```js
data-extract-config: {
  field: 'foo', // The field to extract data from.
  value: () => {}, // The field value accessor.
  props: , // Additional properties to add to the extracted item.
}
```
```js
datum-extract: {
  value: , // The extracted value.
  source: { // The data source of the extracted data.
    key: 'foo', // The data-source key.
    field: 'foo', // The source field.
  },
}
```

## Field

#### <a name='module.exports' href='#module.exports'>#</a> **module.exports**()

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| Returns | field | Data field | ... | ... |

Create a new field with default settings  
```js
field: {
}
```
#### <a name='field.id' href='#field.id'>#</a> **field.id**()

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| Returns | string | No | ... | ... |

Returns this field&#x27;s id  
#### <a name='field.key' href='#field.key'>#</a> **field.key**()

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| Returns | string | No | ... | ... |

Returns this field&#x27;s key  
#### <a name='field.raw' href='#field.raw'>#</a> **field.raw**()

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| Returns | any | No | ... | ... |

Returns the input data  
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
#### <a name='field.items' href='#field.items'>#</a> **field.items**()

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| Returns | Array.&lt;datum-extract&gt; | No | ... | ... |

Returns the values of this field.  
#### <a name='field.formatter' href='#field.formatter'>#</a> **field.formatter**()


Returns a formatter adapted to the content of this field.  
