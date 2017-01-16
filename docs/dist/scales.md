# Scales

## API referece - Table of contents:
* <a href="#linear">linear</a>
* <a href="#linear~fn">linear~fn</a>
* <a href="#linear~fn.invert">linear~fn.invert</a>
* <a href="#linear~fn.rangeRound">linear~fn.rangeRound</a>
* <a href="#linear~fn.clamp">linear~fn.clamp</a>
* <a href="#linear~fn.ticks">linear~fn.ticks</a>
* <a href="#linear~fn.nice">linear~fn.nice</a>
* <a href="#linear~fn.domain">linear~fn.domain</a>
* <a href="#linear~fn.range">linear~fn.range</a>
* <a href="#linear~fn.get">linear~fn.get</a>
* <a href="#linear~fn.start">linear~fn.start</a>
* <a href="#linear~fn.end">linear~fn.end</a>
* <a href="#linear~fn.min">linear~fn.min</a>
* <a href="#linear~fn.max">linear~fn.max</a>
* <a href="#linear~fn.tickGenerator">linear~fn.tickGenerator</a>
* <a href="#linear~fn.classify">linear~fn.classify</a>
* <a href="#looseDistanceBasedGenerator">looseDistanceBasedGenerator</a>
* <a href="#tightDistanceBasedGenerator">tightDistanceBasedGenerator</a>
* <a href="#ordinal">ordinal</a>
* <a href="#ordinal~fn">ordinal~fn</a>
* <a href="#ordinal~fn.domain">ordinal~fn.domain</a>
* <a href="#ordinal~fn.range">ordinal~fn.range</a>
* <a href="#ordinal~fn.paddingOuter">ordinal~fn.paddingOuter</a>
* <a href="#ordinal~fn.paddingInner">ordinal~fn.paddingInner</a>
* <a href="#ordinal~fn.padding">ordinal~fn.padding</a>
* <a href="#ordinal~fn.align">ordinal~fn.align</a>
* <a href="#ordinal~fn.bandWidth">ordinal~fn.bandWidth</a>
* <a href="#ordinal~fn.step">ordinal~fn.step</a>
* <a href="#ordinal~fn.get">ordinal~fn.get</a>
* <a href="#ordinal~fn.start">ordinal~fn.start</a>
* <a href="#ordinal~fn.end">ordinal~fn.end</a>


## Linear scale

#### <a name='linear' href='#linear'>#</a> **linear**(*Array fields, Object settings*)

|Name|Type|Description|Optional|
|----|----|-----------|--------|
| fields | Array |  |No|
| settings | Object |  |No|
| Returns | function | Instance of linear scale | ... |

  
#### <a name='linear~fn' href='#linear~fn'>#</a> linear.**fn**(*Object Object*)

|Name|Type|Description|Optional|
|----|----|-----------|--------|
| Object | Object | item with value |No|
| Returns | Number | The scaled value | ... |

  
#### <a name='linear~fn.invert' href='#linear~fn.invert'>#</a> linear.**invert**(*Number value*)

|Name|Type|Description|Optional|
|----|----|-----------|--------|
| value | Number | The inverted value |No|
| Returns | Number | The inverted scaled value | ... |

{@link https://github.com/d3/d3-scale#continuous_invert }  
#### <a name='linear~fn.rangeRound' href='#linear~fn.rangeRound'>#</a> linear.**rangeRound**(*Array.&lt;Number&gt; values*)

|Name|Type|Description|Optional|
|----|----|-----------|--------|
| values | Array.&lt;Number&gt; | Range values |No|
| Returns | function | The instance this method was called on | ... |

{@link https://github.com/d3/d3-scale#continuous_rangeRound }  
#### <a name='linear~fn.clamp' href='#linear~fn.clamp'>#</a> linear.**clamp**(*Boolean [value]*)

|Name|Type|Description|Optional|
|----|----|-----------|--------|
| value | Boolean | TRUE if clamping should be enabled |Yes|
| Returns | function | The instance this method was called on | ... |

{@link https://github.com/d3/d3-scale#continuous_clamp }  
#### <a name='linear~fn.ticks' href='#linear~fn.ticks'>#</a> linear.**ticks**(*Object input*)

|Name|Type|Description|Optional|
|----|----|-----------|--------|
| input | Object | Number of ticks to generate or an object passed to tick generator |No|
| Returns | Array.&lt;Number&gt; | Array of ticks or any type the custom tick generator returns | ... |

{@link https://github.com/d3/d3-scale#continuous_ticks }  
#### <a name='linear~fn.nice' href='#linear~fn.nice'>#</a> linear.**nice**(*Number count*)

|Name|Type|Description|Optional|
|----|----|-----------|--------|
| count | Number |  |No|
| Returns | function | The instance this method was called on | ... |

{@link https://github.com/d3/d3-scale#continuous_nice }  
#### <a name='linear~fn.domain' href='#linear~fn.domain'>#</a> linear.**domain**(*Array.&lt;Number&gt; [values]*)

|Name|Type|Description|Optional|
|----|----|-----------|--------|
| values | Array.&lt;Number&gt; | Set or Get domain values |Yes|
| Returns | function | The instance this method was called on if a parameter is provided, otherwise the current domain is returned | ... |

  
#### <a name='linear~fn.range' href='#linear~fn.range'>#</a> linear.**range**(*Array.&lt;Number&gt; [values]*)

|Name|Type|Description|Optional|
|----|----|-----------|--------|
| values | Array.&lt;Number&gt; | Set or Get range values |Yes|
| Returns | function | The instance this method was called on if a parameter is provided, otherwise the current range is returned | ... |

  
#### <a name='linear~fn.get' href='#linear~fn.get'>#</a> linear.**get**(*Number value*)

|Name|Type|Description|Optional|
|----|----|-----------|--------|
| value | Number | A value within the domain value span |No|
| Returns | Number | Interpolated from the range | ... |

{@link https://github.com/d3/d3-scale#_continuous }  
#### <a name='linear~fn.start' href='#linear~fn.start'>#</a> linear.**start**()

|Name|Type|Description|Optional|
|----|----|-----------|--------|
| Returns | Number |  | ... |

Get the first value of the domain  
#### <a name='linear~fn.end' href='#linear~fn.end'>#</a> linear.**end**()

|Name|Type|Description|Optional|
|----|----|-----------|--------|
| Returns | Number |  | ... |

Get the last value of the domain  
#### <a name='linear~fn.min' href='#linear~fn.min'>#</a> linear.**min**()

|Name|Type|Description|Optional|
|----|----|-----------|--------|
| Returns | Number |  | ... |

Get the minimum value of the domain  
#### <a name='linear~fn.max' href='#linear~fn.max'>#</a> linear.**max**()

|Name|Type|Description|Optional|
|----|----|-----------|--------|
| Returns | Number |  | ... |

Get the maximum value of the domain  
#### <a name='linear~fn.tickGenerator' href='#linear~fn.tickGenerator'>#</a> linear.**tickGenerator**(*function generator*)

|Name|Type|Description|Optional|
|----|----|-----------|--------|
| generator | function | Tick generator function |No|
| Returns | function | The instance this method was called on | ... |

Assign a tick generator. Will be used when calling ticks function  
#### <a name='linear~fn.classify' href='#linear~fn.classify'>#</a> linear.**classify**(*Number segments*)

|Name|Type|Description|Optional|
|----|----|-----------|--------|
| segments | Number | The number of segments |No|
| Returns | function | The instance this method was called on | ... |

Divides the domain and range into uniform segments, based on start and end value  
#### Examples

```js
let s = linear();
s.domain([0, 10]);
s.range([0, 1]);
s.classify( 2 );
s.domain(); // [10, 5, 5, 0]
s.range(); // [0.75, 0.75, 0.25, 0.25]
```
#### <a name='looseDistanceBasedGenerator' href='#looseDistanceBasedGenerator'>#</a> **looseDistanceBasedGenerator**(*Number distance, Number scale, Number [minorCount, ]Number [unitDivider]*)

|Name|Type|Description|Optional|
|----|----|-----------|--------|
| distance | Number | Distance between each tick |No|
| scale | Number | The scale instance |No|
| minorCount | Number | Number of tick added between each distance |Yes|
| unitDivider | Number | Number to divide distance with |Yes|
| Returns | Array | Array of ticks | ... |

Generate ticks based on a distance, for each 100th unit, one additional tick may be added  
#### <a name='tightDistanceBasedGenerator' href='#tightDistanceBasedGenerator'>#</a> **tightDistanceBasedGenerator**(*Number distance, Number scale, Number [minorCount, ]Number [unitDivider]*)

|Name|Type|Description|Optional|
|----|----|-----------|--------|
| distance | Number | Distance between each tick |No|
| scale | Number | The scale instance |No|
| minorCount | Number | Number of tick added between each distance |Yes|
| unitDivider | Number | Number to divide distance with |Yes|
| Returns | Array | Array of ticks | ... |

Generate ticks based on a distance, for each 100th unit, one additional tick may be added.
Will attempt to round the bounds of domain to even values and generate ticks hitting the domain bounds.  

## Ordinal scale

#### <a name='ordinal' href='#ordinal'>#</a> **ordinal**(*Array fields, Object settings*)

|Name|Type|Description|Optional|
|----|----|-----------|--------|
| fields | Array |  |No|
| settings | Object |  |No|
| Returns | function | Instance of ordinal scale | ... |

  
#### <a name='ordinal~fn' href='#ordinal~fn'>#</a> ordinal.**fn**(*Object Object*)

|Name|Type|Description|Optional|
|----|----|-----------|--------|
| Object | Object | item with value |No|
| Returns | Number | Value position in scale | ... |

  
#### <a name='ordinal~fn.domain' href='#ordinal~fn.domain'>#</a> ordinal.**domain**(*Array.&lt;Object&gt; [values]*)

|Name|Type|Description|Optional|
|----|----|-----------|--------|
| values | Array.&lt;Object&gt; | Set or Get domain values |Yes|
| Returns | function | The instance this method was called on if a parameter is provided, otherwise the current domain is returned | ... |

  
#### <a name='ordinal~fn.range' href='#ordinal~fn.range'>#</a> ordinal.**range**(*Array.&lt;Number&gt; [values]*)

|Name|Type|Description|Optional|
|----|----|-----------|--------|
| values | Array.&lt;Number&gt; | Set or Get range values |Yes|
| Returns | function | The instance this method was called on if a parameter is provided, otherwise the current range is returned | ... |

  
#### <a name='ordinal~fn.paddingOuter' href='#ordinal~fn.paddingOuter'>#</a> ordinal.**paddingOuter**(*Number value*)

|Name|Type|Description|Optional|
|----|----|-----------|--------|
| value | Number | A value within 0-1 |No|
| Returns | function | The instance this method was called on | ... |

{@link https://github.com/d3/d3-scale#band_paddingOuter }  
#### <a name='ordinal~fn.paddingInner' href='#ordinal~fn.paddingInner'>#</a> ordinal.**paddingInner**(*Number value*)

|Name|Type|Description|Optional|
|----|----|-----------|--------|
| value | Number | A value within 0-1 |No|
| Returns | function | The instance this method was called on | ... |

{@link https://github.com/d3/d3-scale#band_paddingInner }  
#### <a name='ordinal~fn.padding' href='#ordinal~fn.padding'>#</a> ordinal.**padding**(*Number value*)

|Name|Type|Description|Optional|
|----|----|-----------|--------|
| value | Number | A value within 0-1 |No|
| Returns | function | The instance this method was called on | ... |

{@link https://github.com/d3/d3-scale#band_padding }  
#### <a name='ordinal~fn.align' href='#ordinal~fn.align'>#</a> ordinal.**align**(*Number value*)

|Name|Type|Description|Optional|
|----|----|-----------|--------|
| value | Number | A value within 0-1 |No|
| Returns | function | The instance this method was called on | ... |

{@link https://github.com/d3/d3-scale#band_padding }  
#### <a name='ordinal~fn.bandWidth' href='#ordinal~fn.bandWidth'>#</a> ordinal.**bandWidth**()

|Name|Type|Description|Optional|
|----|----|-----------|--------|
| Returns | Number | Bandwith of each band | ... |

{@link https://github.com/d3/d3-scale#band_align }  
#### <a name='ordinal~fn.step' href='#ordinal~fn.step'>#</a> ordinal.**step**()

|Name|Type|Description|Optional|
|----|----|-----------|--------|
| Returns | Number | Step distance | ... |

{@link https://github.com/d3/d3-scale#band_step }  
#### <a name='ordinal~fn.get' href='#ordinal~fn.get'>#</a> ordinal.**get**(*Number value*)

|Name|Type|Description|Optional|
|----|----|-----------|--------|
| value | Number |  |No|
| Returns | Number |  | ... |

{@link https://github.com/d3/d3-scale#_ordinal }  
#### <a name='ordinal~fn.start' href='#ordinal~fn.start'>#</a> ordinal.**start**()

|Name|Type|Description|Optional|
|----|----|-----------|--------|
| Returns | Number |  | ... |

Get the first value of the domain  
#### <a name='ordinal~fn.end' href='#ordinal~fn.end'>#</a> ordinal.**end**()

|Name|Type|Description|Optional|
|----|----|-----------|--------|
| Returns | Number |  | ... |

Get the last value of the domain  

