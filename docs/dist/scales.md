# Scales

## API referece - Table of contents:
* <a href="#picasso.scales.linear">picasso.scales.linear</a>
* <a href="#linearScale">linearScale</a>
* <a href="#linearScale.invert">linearScale.invert</a>
* <a href="#linearScale.rangeRound">linearScale.rangeRound</a>
* <a href="#linearScale.clamp">linearScale.clamp</a>
* <a href="#linearScale.cachedTicks">linearScale.cachedTicks</a>
* <a href="#linearScale.clearTicksCache">linearScale.clearTicksCache</a>
* <a href="#linearScale.ticks">linearScale.ticks</a>
* <a href="#linearScale.nice">linearScale.nice</a>
* <a href="#linearScale.domain">linearScale.domain</a>
* <a href="#linearScale.range">linearScale.range</a>
* <a href="#linearScale.get">linearScale.get</a>
* <a href="#linearScale.start">linearScale.start</a>
* <a href="#linearScale.end">linearScale.end</a>
* <a href="#linearScale.min">linearScale.min</a>
* <a href="#linearScale.max">linearScale.max</a>
* <a href="#linearScale.tickGenerator">linearScale.tickGenerator</a>
* <a href="#linearScale.classify">linearScale.classify</a>
* <a href="#looseDistanceBasedGenerator">looseDistanceBasedGenerator</a>
* <a href="#tightDistanceBasedGenerator">tightDistanceBasedGenerator</a>
* <a href="#picasso.scales.ordinal">picasso.scales.ordinal</a>
* <a href="#ordinalScale">ordinalScale</a>
* <a href="#ordinalScale.domain">ordinalScale.domain</a>
* <a href="#ordinalScale.range">ordinalScale.range</a>
* <a href="#ordinalScale.paddingOuter">ordinalScale.paddingOuter</a>
* <a href="#ordinalScale.paddingInner">ordinalScale.paddingInner</a>
* <a href="#ordinalScale.padding">ordinalScale.padding</a>
* <a href="#ordinalScale.align">ordinalScale.align</a>
* <a href="#ordinalScale.bandWidth">ordinalScale.bandWidth</a>
* <a href="#ordinalScale.step">ordinalScale.step</a>
* <a href="#ordinalScale.get">ordinalScale.get</a>
* <a href="#ordinalScale.start">ordinalScale.start</a>
* <a href="#ordinalScale.end">ordinalScale.end</a>


## Linear scale

#### <a name='picasso.scales.linear' href='#picasso.scales.linear'>#</a> **picasso.scales.linear**(*Array fields, Object settings*)

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| fields | Array | No | No | No |
| settings | Object | No | No | No |
| Returns | linearScale | Instance of linear scale | ... | ... |

No description  
#### <a name='linearScale' href='#linearScale'>#</a> **linearScale**(*Object Item*)

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| Item | Object | item object with value property | No | No |
| Returns | Number | The scaled value | ... | ... |

No description  
#### <a name='linearScale.invert' href='#linearScale.invert'>#</a> **linearScale.invert**(*Number value*)

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| value | Number | The inverted value | No | No |
| Returns | Number | The inverted scaled value | ... | ... |

{@link https://github.com/d3/d3-scale#continuous_invert }  
#### <a name='linearScale.rangeRound' href='#linearScale.rangeRound'>#</a> **linearScale.rangeRound**(*Array.&lt;Number&gt; values*)

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| values | Array.&lt;Number&gt; | Range values | No | No |
| Returns | linearScale | The instance this method was called on | ... | ... |

{@link https://github.com/d3/d3-scale#continuous_rangeRound }  
#### <a name='linearScale.clamp' href='#linearScale.clamp'>#</a> **linearScale.clamp**(*Boolean [value]*)

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| value | Boolean | TRUE if clamping should be enabled | Yes | true |
| Returns | linearScale | The instance this method was called on | ... | ... |

{@link https://github.com/d3/d3-scale#continuous_clamp }  
#### <a name='linearScale.cachedTicks' href='#linearScale.cachedTicks'>#</a> **linearScale.cachedTicks**()

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| Returns | Number | No | ... | ... |

Get cached ticks (if any)  
#### <a name='linearScale.clearTicksCache' href='#linearScale.clearTicksCache'>#</a> **linearScale.clearTicksCache**()

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| Returns | Number | No | ... | ... |

Clear the tick cache  
#### <a name='linearScale.ticks' href='#linearScale.ticks'>#</a> **linearScale.ticks**(*Object input*)

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| input | Object | Number of ticks to generate or an object passed to tick generator | No | No |
| Returns | Array.&lt;Number&gt; | Array of ticks or any type the custom tick generator returns | ... | ... |

{@link https://github.com/d3/d3-scale#continuous_ticks }  
#### <a name='linearScale.nice' href='#linearScale.nice'>#</a> **linearScale.nice**(*Number count*)

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| count | Number | No | No | No |
| Returns | linearScale | The instance this method was called on | ... | ... |

{@link https://github.com/d3/d3-scale#continuous_nice }  
#### <a name='linearScale.domain' href='#linearScale.domain'>#</a> **linearScale.domain**(*Array.&lt;Number&gt; [values]*)

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| values | Array.&lt;Number&gt; | Set or Get domain values | Yes | No |
| Returns | linearScale | The instance this method was called on if a parameter is provided, otherwise the current domain is returned | ... | ... |

No description  
#### <a name='linearScale.range' href='#linearScale.range'>#</a> **linearScale.range**(*Array.&lt;Number&gt; [values]*)

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| values | Array.&lt;Number&gt; | Set or Get range values | Yes | No |
| Returns | linearScale | The instance this method was called on if a parameter is provided, otherwise the current range is returned | ... | ... |

No description  
#### <a name='linearScale.get' href='#linearScale.get'>#</a> **linearScale.get**(*Number value*)

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| value | Number | A value within the domain value span | No | No |
| Returns | Number | Interpolated from the range | ... | ... |

{@link https://github.com/d3/d3-scale#_continuous }  
#### <a name='linearScale.start' href='#linearScale.start'>#</a> **linearScale.start**()

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| Returns | Number | No | ... | ... |

Get the first value of the domain  
#### <a name='linearScale.end' href='#linearScale.end'>#</a> **linearScale.end**()

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| Returns | Number | No | ... | ... |

Get the last value of the domain  
#### <a name='linearScale.min' href='#linearScale.min'>#</a> **linearScale.min**()

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| Returns | Number | No | ... | ... |

Get the minimum value of the domain  
#### <a name='linearScale.max' href='#linearScale.max'>#</a> **linearScale.max**()

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| Returns | Number | No | ... | ... |

Get the maximum value of the domain  
#### <a name='linearScale.tickGenerator' href='#linearScale.tickGenerator'>#</a> **linearScale.tickGenerator**(*function generator*)

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| generator | function | Tick generator function | No | No |
| Returns | function | The instance this method was called on | ... | ... |

Assign a tick generator. Will be used when calling ticks function  
#### <a name='linearScale.classify' href='#linearScale.classify'>#</a> **linearScale.classify**(*Number segments*)

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| segments | Number | The number of segments | No | No |
| Returns | function | The instance this method was called on | ... | ... |

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

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| distance | Number | Distance between each tick | No | No |
| scale | Number | The scale instance | No | No |
| minorCount | Number | Number of tick added between each distance | Yes | No |
| unitDivider | Number | Number to divide distance with | Yes | 100 |
| Returns | Array | Array of ticks | ... | ... |

Generate ticks based on a distance, for each 100th unit, one additional tick may be added  
#### <a name='tightDistanceBasedGenerator' href='#tightDistanceBasedGenerator'>#</a> **tightDistanceBasedGenerator**(*Number distance, Number scale, Number [minorCount, ]Number [unitDivider]*)

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| distance | Number | Distance between each tick | No | No |
| scale | Number | The scale instance | No | No |
| minorCount | Number | Number of tick added between each distance | Yes | No |
| unitDivider | Number | Number to divide distance with | Yes | 100 |
| Returns | Array | Array of ticks | ... | ... |

Generate ticks based on a distance, for each 100th unit, one additional tick may be added.
Will attempt to round the bounds of domain to even values and generate ticks hitting the domain bounds.  

## Ordinal scale

#### <a name='picasso.scales.ordinal' href='#picasso.scales.ordinal'>#</a> **picasso.scales.ordinal**(*Array fields, Object settings*)

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| fields | Array | No | No | No |
| settings | Object | No | No | No |
| Returns | ordinalScale | Instance of ordinal scale | ... | ... |

No description  
#### <a name='ordinalScale' href='#ordinalScale'>#</a> **ordinalScale**(*Object Object*)

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| Object | Object | item with value | No | No |
| Returns | Number | Value position in scale | ... | ... |

No description  
#### <a name='ordinalScale.domain' href='#ordinalScale.domain'>#</a> **ordinalScale.domain**(*Array.&lt;Object&gt; [values]*)

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| values | Array.&lt;Object&gt; | Set or Get domain values | Yes | No |
| Returns | ordinalScale | The instance this method was called on if a parameter is provided, otherwise the current domain is returned | ... | ... |

No description  
#### <a name='ordinalScale.range' href='#ordinalScale.range'>#</a> **ordinalScale.range**(*Array.&lt;Number&gt; [values]*)

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| values | Array.&lt;Number&gt; | Set or Get range values | Yes | No |
| Returns | ordinalScale | The instance this method was called on if a parameter is provided, otherwise the current range is returned | ... | ... |

No description  
#### <a name='ordinalScale.paddingOuter' href='#ordinalScale.paddingOuter'>#</a> **ordinalScale.paddingOuter**(*Number value*)

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| value | Number | A value within 0-1 | No | No |
| Returns | ordinalScale | The instance this method was called on | ... | ... |

{@link https://github.com/d3/d3-scale#band_paddingOuter }  
#### <a name='ordinalScale.paddingInner' href='#ordinalScale.paddingInner'>#</a> **ordinalScale.paddingInner**(*Number value*)

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| value | Number | A value within 0-1 | No | No |
| Returns | ordinalScale | The instance this method was called on | ... | ... |

{@link https://github.com/d3/d3-scale#band_paddingInner }  
#### <a name='ordinalScale.padding' href='#ordinalScale.padding'>#</a> **ordinalScale.padding**(*Number value*)

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| value | Number | A value within 0-1 | No | No |
| Returns | ordinalScale | The instance this method was called on | ... | ... |

{@link https://github.com/d3/d3-scale#band_padding }  
#### <a name='ordinalScale.align' href='#ordinalScale.align'>#</a> **ordinalScale.align**(*Number value*)

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| value | Number | A value within 0-1 | No | No |
| Returns | ordinalScale | The instance this method was called on | ... | ... |

{@link https://github.com/d3/d3-scale#band_padding }  
#### <a name='ordinalScale.bandWidth' href='#ordinalScale.bandWidth'>#</a> **ordinalScale.bandWidth**()

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| Returns | Number | Bandwith of each band | ... | ... |

{@link https://github.com/d3/d3-scale#band_align }  
#### <a name='ordinalScale.step' href='#ordinalScale.step'>#</a> **ordinalScale.step**()

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| Returns | Number | Step distance | ... | ... |

{@link https://github.com/d3/d3-scale#band_step }  
#### <a name='ordinalScale.get' href='#ordinalScale.get'>#</a> **ordinalScale.get**(*Number value*)

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| value | Number | No | No | No |
| Returns | Number | No | ... | ... |

{@link https://github.com/d3/d3-scale#_ordinal }  
#### <a name='ordinalScale.start' href='#ordinalScale.start'>#</a> **ordinalScale.start**()

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| Returns | Number | No | ... | ... |

Get the first value of the domain  
#### <a name='ordinalScale.end' href='#ordinalScale.end'>#</a> **ordinalScale.end**()

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| Returns | Number | No | ... | ... |

Get the last value of the domain  

