# Markers

## In this file:

* <a href="#marker-point">marker-point</a>
* <a href="#marker-point-settings">marker-point-settings</a>
* <a href="#marker-point-string">marker-point-string</a>
* <a href="#marker-point-number">marker-point-number</a>
* <a href="#marker-point-data-accessor">marker-point-data-accessor</a>
* <a href="#marker-point-data">marker-point-data</a>
* <a href="#marker-box">marker-box</a>
* <a href="#marker-box-settings">marker-box-settings</a>
* <a href="#marker-box-data">marker-box-data</a>

## Point marker

#### <a name='marker-point' href='#marker-point'>#</a> marker-point

|Name(s)|Type(s)|Description|Optional|
|-------|-------|-----------|--------|
| type | string | &quot;point&quot; | No |
| data | data-ref | Point data. | No |
| settings | marker-point-settings | Marker settings | No |

#### Examples

```js
{
  type: "point",
  data: { source: "/qDimensionInfo/0" },
 settings: {
   x: 0.2, // simple number, places all points at the same position along the x-axis (which assumes to have a range of [0,1])
   y: ( d, i, arr ) => i / arr.length, // function is called for each datum `d`
   fill: { source: "/qMeasureInfo/0", type: "color" }, // auto-constructs a color scale from the specified source
   opacity: { source: "/qMeasureInfo/1", fn: ( d, i ) => d.value },
   shape: ( d, i ) => ["rect", "circle"][i % 2]
 }
}
```
#### <a name='marker-point-settings' href='#marker-point-settings'>#</a> marker-point-settings

|Name(s)|Type(s)|Description|Optional|
|-------|-------|-----------|--------|
| x | marker-point-number | x coordinate | Yes |
| y | marker-point-number | y coordinate | Yes |
| fill | marker-point-string | fill color | Yes |
| stroke | marker-point-string | stroke color | Yes |
| strokeWidth | marker-point-number | stroke width | Yes |
| size | marker-point-number | size of shape | Yes |
| opacity | marker-point-number | opacity of shape | Yes |
| shape | marker-point-string | type of shape | Yes |

#### <a name='marker-point-string' href='#marker-point-string'>#</a> marker-point-string

Can be one of the following types: string, marker-point-data-accessor, marker-point-data

#### <a name='marker-point-number' href='#marker-point-number'>#</a> marker-point-number

Can be one of the following types: number, marker-point-data-accessor, marker-point-data

#### <a name='marker-point-data-accessor' href='#marker-point-data-accessor'>#</a> marker-point-data-accessor

Can be one of the following types: function

#### <a name='marker-point-data' href='#marker-point-data'>#</a> marker-point-data

|Name(s)|Type(s)|Description|Optional|
|-------|-------|-----------|--------|
| source | string | Data field | No |
| fn | marker-point-data-accessor | Data accessor. Custom data accessor which will be called for each datum. The return value is used for the specified property. | Yes |
| scale | string | Name of a predefined scale. Not used if fn is defined. | Yes |

#### Examples

```js
// the following definition will provide data from the first measure in the form: [{value: 3, label: "$3", id: 0}, ...]
{
  source: "/qMeasureInfo/0"
}
```

## Box marker

#### <a name='marker-box' href='#marker-box'>#</a> marker-box

|Name(s)|Type(s)|Description|Optional|
|-------|-------|-----------|--------|
| type | string | &quot;box&quot; | No |
| data | data-ref | Box data | No |
| settings | marker-box-settings | Box marker settings | No |

#### Examples

```js
{
  type: "box",
  data: { source: "/qDimensionInfo/0" },
 settings: {
   x: { source: "/qDimensionInfo/0" },
   y: { source: ["/qMeasureInfo/0",
                 "/qMeasureInfo/1",
                 "/qMeasureInfo/2",
                 "/qMeasureInfo/3",
                 "/qMeasureInfo/4"] },
   min: { source: "/qMeasureInfo/0" },
   max: { source: "/qMeasureInfo/1" },
   start: { source: "/qMeasureInfo/2" },
   end: { source: "/qMeasureInfo/3" },
   med: { source: "/qMeasureInfo/4" }
 }
}
```
#### <a name='marker-box-settings' href='#marker-box-settings'>#</a> marker-box-settings

|Name(s)|Type(s)|Description|Optional|
|-------|-------|-----------|--------|
| min | marker-box-data | min | No |
| max | marker-box-data | max | No |
| start | marker-box-data | start | No |
| end | marker-box-data | end | No |
| med | marker-box-data | med | No |

#### <a name='marker-box-data' href='#marker-box-data'>#</a> marker-box-data

Can be one of the following types: 

