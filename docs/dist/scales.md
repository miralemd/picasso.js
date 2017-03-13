# Scales

## API referece - Table of contents:
* <a href="#ticks-settings">ticks-settings</a>
* <a href="#picasso.scaleLinear">picasso.scaleLinear</a>
* <a href="#linear">linear</a>
* <a href="#linear.invert">linear.invert</a>
* <a href="#linear.rangeRound">linear.rangeRound</a>
* <a href="#linear.clamp">linear.clamp</a>
* <a href="#linear.cachedTicks">linear.cachedTicks</a>
* <a href="#linear.clearTicksCache">linear.clearTicksCache</a>
* <a href="#linear.ticks">linear.ticks</a>
* <a href="#linear.nice">linear.nice</a>
* <a href="#linear.domain">linear.domain</a>
* <a href="#linear.range">linear.range</a>
* <a href="#linear.start">linear.start</a>
* <a href="#linear.end">linear.end</a>
* <a href="#linear.min">linear.min</a>
* <a href="#linear.max">linear.max</a>
* <a href="#linear.classify">linear.classify</a>
* <a href="#picasso.scaleBand">picasso.scaleBand</a>
* <a href="#band">band</a>
* <a href="#band.start">band.start</a>
* <a href="#band.end">band.end</a>
* <a href="#band.ticks">band.ticks</a>
* <a href="#picasso.scaleSequentialColor">picasso.scaleSequentialColor</a>
* <a href="#sequentialColor">sequentialColor</a>
* <a href="#picasso.scaleThresholdColor">picasso.scaleThresholdColor</a>
* <a href="#thresholdColor">thresholdColor</a>


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
#### <a name='picasso.scaleLinear' href='#picasso.scaleLinear'>#</a> **picasso.scaleLinear**(*object settings, Array.&lt;field&gt; [fields]*)

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| settings | object | No | No | No |
| fields | Array.&lt;field&gt; | No | Yes | No |
| Returns | linear | No | ... | ... |

No description  
#### <a name='linear' href='#linear'>#</a> **linear**(*Object value*)

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| value | Object | No | No | No |
| Returns | number | No | ... | ... |

No description  
#### <a name='linear.invert' href='#linear.invert'>#</a> **linear.invert**(*number value*)

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| value | number | The inverted value | No | No |
| Returns | number | The inverted scaled value | ... | ... |

{@link https://github.com/d3/d3-scale#continuous_invert }  
#### <a name='linear.rangeRound' href='#linear.rangeRound'>#</a> **linear.rangeRound**(*Array.&lt;number&gt; values*)

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| values | Array.&lt;number&gt; | Range values | No | No |
| Returns | linear | The instance this method was called on | ... | ... |

{@link https://github.com/d3/d3-scale#continuous_rangeRound }  
#### <a name='linear.clamp' href='#linear.clamp'>#</a> **linear.clamp**(*boolean [value]*)

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| value | boolean | TRUE if clamping should be enabled | Yes | true |
| Returns | linear | The instance this method was called on | ... | ... |

{@link https://github.com/d3/d3-scale#continuous_clamp }  
#### <a name='linear.cachedTicks' href='#linear.cachedTicks'>#</a> **linear.cachedTicks**()

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| Returns | number | No | ... | ... |

Get cached ticks (if any)  
#### <a name='linear.clearTicksCache' href='#linear.clearTicksCache'>#</a> **linear.clearTicksCache**()

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| Returns | number | No | ... | ... |

Clear the tick cache  
#### <a name='linear.ticks' href='#linear.ticks'>#</a> **linear.ticks**(*Object input*)

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| input | Object | Number of ticks to generate or an object passed to tick generator | No | No |
| Returns | Array.&lt;number&gt; | Array of ticks or any type the custom tick generator returns | ... | ... |

{@link https://github.com/d3/d3-scale#continuous_ticks }  
#### <a name='linear.nice' href='#linear.nice'>#</a> **linear.nice**(*number count*)

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| count | number | No | No | No |
| Returns | linear | The instance this method was called on | ... | ... |

{@link https://github.com/d3/d3-scale#continuous_nice }  
#### <a name='linear.domain' href='#linear.domain'>#</a> **linear.domain**(*Array.&lt;number&gt; [values]*)

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| values | Array.&lt;number&gt; | Set or Get domain values | Yes | No |
| Returns | linear | The instance this method was called on if a parameter is provided, otherwise the current domain is returned | ... | ... |

No description  
#### <a name='linear.range' href='#linear.range'>#</a> **linear.range**(*Array.&lt;number&gt; [values]*)

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| values | Array.&lt;number&gt; | Set or Get range values | Yes | No |
| Returns | linear | The instance this method was called on if a parameter is provided, otherwise the current range is returned | ... | ... |

No description  
#### <a name='linear.start' href='#linear.start'>#</a> **linear.start**()

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| Returns | number | No | ... | ... |

Get the first value of the domain  
#### <a name='linear.end' href='#linear.end'>#</a> **linear.end**()

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| Returns | number | No | ... | ... |

Get the last value of the domain  
#### <a name='linear.min' href='#linear.min'>#</a> **linear.min**()

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| Returns | number | No | ... | ... |

Get the minimum value of the domain  
#### <a name='linear.max' href='#linear.max'>#</a> **linear.max**()

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| Returns | number | No | ... | ... |

Get the maximum value of the domain  
#### <a name='linear.classify' href='#linear.classify'>#</a> **linear.classify**(*number segments*)

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| segments | number | The number of segments | No | No |
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

## Band scale

#### <a name='picasso.scaleBand' href='#picasso.scaleBand'>#</a> **picasso.scaleBand**(*Object settings, Array.&lt;fields&gt; [fields, ]dataset [dataset]*)

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| settings | Object | No | No | No |
| fields | Array.&lt;fields&gt; | No | Yes | No |
| dataset | dataset | No | Yes | No |
| Returns | band | No | ... | ... |

No description  
#### <a name='band' href='#band'>#</a> **band**(*Object value*)

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| value | Object | No | No | No |
| Returns | number | No | ... | ... |

An augmented {@link https://github.com/d3/d3-scale#_band|d3 band scale}  
#### <a name='band.start' href='#band.start'>#</a> **band.start**()

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| Returns | number | No | ... | ... |

Get the first value of the domain  
#### <a name='band.end' href='#band.end'>#</a> **band.end**()

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| Returns | number | No | ... | ... |

Get the last value of the domain  
#### <a name='band.ticks' href='#band.ticks'>#</a> **band.ticks**()

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| Returns | Array.&lt;Object&gt; | Array of ticks | ... | ... |

Generate discrete ticks  


# Color Scales

## Sequential scale

#### <a name='picasso.scaleSequentialColor' href='#picasso.scaleSequentialColor'>#</a> **picasso.scaleSequentialColor**(*Object [settings, ]Array.&lt;number&gt; [settings.domain, ]Array.&lt;color&gt; [settings.range, ]Array.&lt;field&gt; [fields]*)

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| settings | Object | Settings for this scale. If both range and domain are specified, they have to fulfill range.length &#x3D;&#x3D;&#x3D; domain.length, otherwise they will be overriden. | Yes | No |
| settings.domain | Array.&lt;number&gt; | Numeric values indicating stop limits between start and end values. | Yes | No |
| settings.range | Array.&lt;color&gt; | CSS color values indicating stop colors between start and end values. | Yes | No |
| fields | Array.&lt;field&gt; | Fields to dynamically calculate the domain extent. | Yes | No |
| Returns | sequentialColor | No | ... | ... |

No description  
#### Examples

```js
picasso.scaleSequentialColor({
 range: ['red', '#fc6', 'green'],
 domain: [-40, 0, 100]
});
```
#### <a name='sequentialColor' href='#sequentialColor'>#</a> **sequentialColor**(*Object v*)

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| v | Object | Object containing a &#x27;value&#x27; property | No | No |
| Returns | string | The blended color | ... | ... |

No description  

## Threshold scale

#### <a name='picasso.scaleThresholdColor' href='#picasso.scaleThresholdColor'>#</a> **picasso.scaleThresholdColor**(*object [settings, ]Array.&lt;number&gt; [settings.domain, ]Array.&lt;color&gt; [settings.range, ]boolean [settings.nice, ]number [settings.min, ]number [settings.max, ]Array.&lt;field&gt; [fields]*)

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| settings | object | Settings for this scale. If both domain and range are specified, they have to fulfill domain.length &#x3D;&#x3D;&#x3D; range.length + 1,  otherwise they will be overriden. | Yes | No |
| settings.domain | Array.&lt;number&gt; | Values defining the thresholds. | Yes | No |
| settings.range | Array.&lt;color&gt; | CSS color values of the output range. | Yes | No |
| settings.nice | boolean | If set to true, will generate &#x27;nice&#x27; domain values. Ignored if domain is set. | Yes | No |
| settings.min | number | Minimum value to generate domain extent from. Ignored if domain is set. | Yes | No |
| settings.max | number | Maximum value to generate domain extend from. Ignored if domain is set. | Yes | No |
| fields | Array.&lt;field&gt; | Fields to dynamically calculate the domain extent from. Ignored if min/max are set. | Yes | No |
| Returns | thresholdColor | No | ... | ... |

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
#### <a name='thresholdColor' href='#thresholdColor'>#</a> **thresholdColor**(*object v*)

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| v | object | Object literal containing a &#x27;value&#x27; property. | No | No |
| Returns | string | A CSS color from the scale&#x27;s range. | ... | ... |

No description  
