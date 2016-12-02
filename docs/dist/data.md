# Data
## In this file:
* <a href="#field">field</a>
* <a href="#field~fn.data">field~fn.data</a>
* <a href="#field~fn.tags">field~fn.tags</a>
* <a href="#field~fn.min">field~fn.min</a>
* <a href="#field~fn.max">field~fn.max</a>
* <a href="#field~fn.title">field~fn.title</a>
* <a href="#field~fn.values">field~fn.values</a>
* <a href="#field~fn.formatter">field~fn.formatter</a>

## Fields
### <a name='field' href='#field'>#</a> **field**(**)

|Name|Type|Description|Optional|
|----|----|-----------|--------|
| Returns | Object | Object with accessors | ... |

Factory-function, constructs a new field accessor with default settings

#### <a name='field~fn.data' href='#field~fn.data'>#</a> field.**data**(*Object [d]*)

|Name|Type|Description|Optional|
|----|----|-----------|--------|
| d | Object | Data object |Yes|
| Returns | function | Field object | ... |
| Returns | Object | Data object | ... |

Get or set the data

#### <a name='field~fn.tags' href='#field~fn.tags'>#</a> field.**tags**(*function [f]*)

|Name|Type|Description|Optional|
|----|----|-----------|--------|
| f | function | Optional accessor function |Yes|
| Returns | function | Field object | ... |
| Returns | Object | Tags | ... |

Get tags from the data or set an accessor for the tags

#### <a name='field~fn.min' href='#field~fn.min'>#</a> field.**min**(*function [f]*)

|Name|Type|Description|Optional|
|----|----|-----------|--------|
| f | function | Optional accessor function |Yes|
| Returns | function | Field object | ... |
| Returns | Integer | The minimum value | ... |

Get the minimum value of the data or set the accessor

#### <a name='field~fn.max' href='#field~fn.max'>#</a> field.**max**(*function [f]*)

|Name|Type|Description|Optional|
|----|----|-----------|--------|
| f | function | Optional accessor function |Yes|
| Returns | function | Field object | ... |
| Returns | Integer | The maximum value | ... |

Get the maximum value of the data or set the accessor

#### <a name='field~fn.title' href='#field~fn.title'>#</a> field.**title**(*function [f]*)

|Name|Type|Description|Optional|
|----|----|-----------|--------|
| f | function | Optional accessor function |Yes|
| Returns | function | Field object | ... |
| Returns | String | Title | ... |

Get the title of the data or set the accessor

#### <a name='field~fn.values' href='#field~fn.values'>#</a> field.**values**(*function [f]*)

|Name|Type|Description|Optional|
|----|----|-----------|--------|
| f | function | Optional accessor function |Yes|
| Returns | function | Field object | ... |
| Returns | Array | Array, array of objects or object of values | ... |

Get the values of the data or set the accessor

#### <a name='field~fn.formatter' href='#field~fn.formatter'>#</a> field.**formatter**(*function [f]*)

|Name|Type|Description|Optional|
|----|----|-----------|--------|
| f | function | Optional formatter function |Yes|
| Returns | function | Field object | ... |
| Returns | String | Formatted data | ... |

Get the formatted data of the data or set the formatter


