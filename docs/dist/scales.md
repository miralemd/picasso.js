# Scales

## API referece - Table of contents:
* <a href="#ticks-settings">ticks-settings</a>
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
* <a href="#linearScale.classify">linearScale.classify</a>
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
* <a href="#ordinalScale.ticks">ordinalScale.ticks</a>
* <a href="#picasso.scales.sequential">picasso.scales.sequential</a>
* <a href="#sequentialScale">sequentialScale</a>
* <a href="#picasso.scales.threshold">picasso.scales.threshold</a>
* <a href="#thresholdScale">thresholdScale</a>
* <a href="#thresholdScale.domain">thresholdScale.domain</a>
* <a href="#thresholdScale.range">thresholdScale.range</a>


## Linear scale

#### <a name='ticks-settings' href='#ticks-settings'>#</a> ticks-settings

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| ticks | object | No | Yes | No |
| ticks.tight | boolean | No | Yes | No |
| ticks.forceBounds | boolean | No | Yes | No |
| ticks.distance | number | Approximate distance between each tick. | Yes | 100 |
| minorTicks | object | No | Yes | No |
| minorTicks.count | number | No | Yes | 3 |

No description  
#### <a name='picasso.scales.linear' href='#picasso.scales.linear'>#</a> **picasso.scales.linear**(*Array.&lt;field&gt; fields, object settings*)

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| fields | Array.&lt;field&gt; | No | No | No |
| settings | object | No | No | No |
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
#### <a name='ordinalScale.ticks' href='#ordinalScale.ticks'>#</a> **ordinalScale.ticks**()

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| Returns | Array | Array of ticks | ... | ... |

Generate discrete ticks  


# Color Scales

## Sequential scale

#### <a name='picasso.scales.sequential' href='#picasso.scales.sequential'>#</a> **picasso.scales.sequential**(*Object [settings, ]Array.&lt;number&gt; [settings.domain, ]Array.&lt;color&gt; [settings.range, ]Array.&lt;field&gt; [fields]*)

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| settings | Object | Settings for this scale. If both range and domain are specified, they have to fulfill range.length &#x3D;&#x3D;&#x3D; domain.length, otherwise they will be overriden. | Yes | No |
| settings.domain | Array.&lt;number&gt; | Numeric values indicating stop limits between start and end values. | Yes | No |
| settings.range | Array.&lt;color&gt; | CSS color values indicating stop colors between start and end values. | Yes | No |
| fields | Array.&lt;field&gt; | Fields to dynamically calculate the domain extent. | Yes | No |
| Returns | sequentialScale | Instance of sequential scale | ... | ... |

No description  
#### Examples

```js
sequential({
 range: ['red', '#fc6', 'green'],
 domain: [-40, 0, 100]
});
```
#### <a name='sequentialScale' href='#sequentialScale'>#</a> **sequentialScale**(*Object v*)

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| v | Object | Object containing a &#x27;value&#x27; property | No | No |
| Returns | string | The blended color | ... | ... |

No description  

## Threshold scale

#### <a name='picasso.scales.threshold' href='#picasso.scales.threshold'>#</a> **picasso.scales.threshold**(*object [settings, ]Array.&lt;number&gt; [settings.domain, ]Array.&lt;color&gt; [settings.range, ]boolean [settings.nice, ]number [settings.min, ]number [settings.max, ]Array.&lt;field&gt; [fields]*)

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| settings | object | Settings for this scale. If both domain and range are specified, they have to fulfill domain.length &#x3D;&#x3D;&#x3D; range.length + 1,  otherwise they will be overriden. | Yes | No |
| settings.domain | Array.&lt;number&gt; | Values defining the thresholds. | Yes | No |
| settings.range | Array.&lt;color&gt; | CSS color values of the output range. | Yes | No |
| settings.nice | boolean | If set to true, will generate &#x27;nice&#x27; domain values. Ignored if domain is set. | Yes | No |
| settings.min | number | Minimum value to generate domain extent from. Ignored if domain is set. | Yes | No |
| settings.max | number | Maximum value to generate domain extend from. Ignored if domain is set. | Yes | No |
| fields | Array.&lt;field&gt; | Fields to dynamically calculate the domain extent from. Ignored if min/max are set. | Yes | No |
| Returns | thresholdScale | Instance of threshold scale | ... | ... |

No description  
#### Examples

```js
let t = threshold({
  range: ['black', 'white'],
  domain: [25,50,75],
  max: 100,
  min: 0
});
t.domain(); // [25,50,75]
t.range(); // Generates from colors and domain: ['rgb(0,0,0)','rgb(85,85,85)','rgb(170,170,170)','rgb(255,255,255)']
```
#### <a name='thresholdScale' href='#thresholdScale'>#</a> **thresholdScale**(*object v*)

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| v | object | Object literal containing a &#x27;value&#x27; property. | No | No |
| Returns | string | A CSS color from the scale&#x27;s range. | ... | ... |

No description  
#### <a name='thresholdScale.domain' href='#thresholdScale.domain'>#</a> **thresholdScale.domain**(*Array.&lt;number&gt; [values]*)

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| values | Array.&lt;number&gt; | Set or get domain values. | Yes | No |
| Returns | thresholdScale | The instance this method was called on if a parameter is provided, otherwise the current domain is returned. | ... | ... |

No description  
#### <a name='thresholdScale.range' href='#thresholdScale.range'>#</a> **thresholdScale.range**(*Array.&lt;number&gt; [values]*)

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| values | Array.&lt;number&gt; | Set or get range values. | Yes | No |
| Returns | thresholdScale | The instance this method was called on if a parameter is provided, otherwise the current range is returned. | ... | ... |

No description  
