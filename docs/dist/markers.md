# Markers

## Table of contents:
* <a href="#marker-point">marker-point</a>
* <a href="#marker-point-settings">marker-point-settings</a>
* <a href="#marker-point-string">marker-point-string</a>
* <a href="#marker-point-number">marker-point-number</a>
* <a href="#marker-point-data-accessor">marker-point-data-accessor</a>
* <a href="#marker-point-data">marker-point-data</a>
* <a href="#marker-point-setting">marker-point-setting</a>
* <a href="#marker-box">marker-box</a>
* <a href="#marker-box-settings">marker-box-settings</a>
* <a href="#marker-box-data">marker-box-data</a>


## Point marker

#### <a name='marker-point' href='#marker-point'>#</a> marker-point

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| type | string | &quot;point&quot; | No | No |
| data | marker-point-data | Point data mapping. | No | No |
| settings | marker-point-settings | Marker settings | No | No |

No description  
#### Examples

```js
{
 type: "point",
 data: {
   groupBy: {
     source: "/qHyperCube/qDimensionInfo/0",
   },
   mapTo: {
     color: { source: "/qHyperCube/qMeasureInfo/0" },
     opacity: { source: "/qHyperCube/qMeasureInfo/1" }
   }
 },
 settings: {
  x: 0.2, // simple number, places all points at the same position along the x-axis (which assumes to have a range of [0,1])
  y: ( d, i, arr ) => i / arr.length, // function is called for each datum `d`
  fill: { ref: "color", scale: { source: "/qHyperCube/qMeasureInfo/0", type: "color" }, // auto-constructs a color scale from the specified source
  opacity: { ref: "opacity", fn: ( d ) => d.value },
  shape: ( d, i ) => ["rect", "circle"][i % 2]
 }
}
```
#### <a name='marker-point-settings' href='#marker-point-settings'>#</a> marker-point-settings

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| x | marker-point-number | x coordinate | Yes | 0.5 |
| y | marker-point-number | y coordinate | Yes | 0.5 |
| fill | marker-point-string | fill color | Yes | &quot;#999&quot; |
| stroke | marker-point-string | stroke color | Yes | &quot;#ccc&quot; |
| strokeWidth | marker-point-number | stroke width | Yes | No |
| size | marker-point-number | size of shape | Yes | 1 |
| opacity | marker-point-number | opacity of shape | Yes | 1 |
| shape | marker-point-string | type of shape | Yes | &quot;circle&quot; |

No description  
#### <a name='marker-point-string' href='#marker-point-string'>#</a> marker-point-string

Can be one of the following types: string, marker-point-data-accessor, marker-point-setting

No description  
#### <a name='marker-point-number' href='#marker-point-number'>#</a> marker-point-number

Can be one of the following types: number, marker-point-data-accessor, marker-point-setting

No description  
#### <a name='marker-point-data-accessor' href='#marker-point-data-accessor'>#</a> marker-point-data-accessor

Can be one of the following types: function

No description  
#### <a name='marker-point-data' href='#marker-point-data'>#</a> marker-point-data

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| mapTo | object | Object containing the definition of how to map data | No | No |
| mapTo.source | string | Data field | No | No |
| groupBy | object | The data source to group data | No | No |
| groupBy.source | string | Reference to a data source | No | No |

The specified definition will provide the point marker with data.  
#### Examples

```js
{
  mapTo: {
   x: { source: "/qHyperCube/qMeasureInfo/0" },
   y: { source: "/qHyperCube/qMeasureInfo/1", reducer: "avg" },
   parent: { source: "/qHyperCube/qDimensionInfo/0", type: "qual", reducer: "first" }
  },
  groupBy: {
   source: "/qHyperCube/qDimensionInfo/1"
  }
}

// will provide an output:
[
 {
   x: { value: 3.2, source: {...} },
   y: { value: 16.2, source: {...} },
   parent: { value: 'Europe', source: {...} }
 },
 ...
]
```
#### <a name='marker-point-setting' href='#marker-point-setting'>#</a> marker-point-setting

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| ref | string | A reference to a property in the mapped data. | No | No |
| scale | objectstring | Object containing the definition of a scale. If a string is provided it is assumed to be a reference to an already existing scale. | No | No |
| scale.source | string | Data source | No | No |
| scale.type | string | Scale type | No | No |
| fn | marker-point-data-accessor | Data accessor. Custom data accessor which will be called for each datum. The return value is used for the specified property. | Yes | No |

The data to use for encoding a property of the point.

The specified source will provide the point marker with data.  
#### Examples

```js
// assuming a data mapping of:
// {
//  x: { source: "/qHyperCube/qMeasureInfo/0" }
//  label: { source: "/qHyperCube/qDimensionInfo/0" }
// }
//
// the data can be accessed in various ways:
// the following definitions will all result in the same 'x' value
{
  x: { ref: "x" } // reference the 'x' value in the mapped data
  x: { ref: "x", fn: (d) { return d.value; } }, // the referenced value in sent in as the first parameter in the callback
  x: { fn: function(d) { return this.data.x.value; } }, // the mapped data can be accessed through <code>this.data</code>
  x: function (d) { return this.data.x.value; }
}
```
```js
// a scale will in some cases automatically be used when provided,
// the following definitions will all result in the same 'x' value:
{
  x: { ref: "x", scale: "x" }, // automatically sends the 'x' value through the scale and returns that value
  x: { ref: "x", scale: "x", fn: function(d) { return this.scale(d) } }, // the referenced 'scale' is accessible in the callback's 'this' context
  x: { scale: "x", fn: function(d) { return this.scale(this.data.x) } },
}
```
```js
// since all mapped data is accessible in all settings, the values can be used for more expressive representation of properties
{
  fill: { scale: "x", fn: function() { // color the maximum value red
    return this.scale.max() >= this.data.x.value ? "red" : "grey";
  } }
}
```

## Box marker

#### <a name='marker-box' href='#marker-box'>#</a> marker-box

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| type | string | &quot;box&quot; | No | No |
| data | data-ref | Box data | No | No |
| settings | marker-box-settings | Box marker settings | No | No |

No description  
#### Examples

```js
{
  type: "box",
  data: {
   mapTo: {
    min: { source: "/qHyperCube/qMeasureInfo/0" },
    start: { source: "/qHyperCube/qMeasureInfo/1" },
    med: { source: "/qHyperCube/qMeasureInfo/2" },
    end: { source: "/qHyperCube/qMeasureInfo/3" },
    max: { source: "/qHyperCube/qMeasureInfo/4" },
   },
   groupBy: {
    source: "/qHyperCube/qDimensionInfo/0"
    }
 },
 settings: {
   x: {
     scale: { source: "/qHyperCube/qDimensionInfo/0" }
   },
   y: {
     scale: { source: ["/qHyperCube/qMeasureInfo/0",
              "/qHyperCube/qMeasureInfo/1",
              "/qHyperCube/qMeasureInfo/2",
              "/qHyperCube/qMeasureInfo/3",
              "/qHyperCube/qMeasureInfo/4"] }
   }
 }
}
```
#### <a name='marker-box-settings' href='#marker-box-settings'>#</a> marker-box-settings

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| min | marker-box-data | min | No | No |
| max | marker-box-data | max | No | No |
| start | marker-box-data | start | No | No |
| end | marker-box-data | end | No | No |
| med | marker-box-data | med | No | No |

No description  
#### <a name='marker-box-data' href='#marker-box-data'>#</a> marker-box-data

Can be one of the following types: 

No description  
