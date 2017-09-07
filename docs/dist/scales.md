# Scales

## Linear scale

```js
settings: {
  expand: 3.14, // Expand the output range. Optional.
  invert: false, // Invert the output range. Default: false. Optional.
  include: [3, 7], // Include specified numbers in the output range. Optional.
  ticks: { //  Optional.
    tight: false, //  Default: false. Optional.
    forceBounds: false, //  Default: false. Optional.
    distance: 100, // Approximate distance between each tick. Default: 100. Optional.
  },
  minorTicks: { //  Optional.
    count: 3, //  Default: 3. Optional.
  },
}
```
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
#### <a name='linear.norm' href='#linear.norm'>#</a> **linear.norm**(*number d*)

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| d | number | A domain value | No | No |
| Returns | number | A normalized range output given in range 0-1 | ... | ... |

No description  
#### Examples

```js
const scale = scaleLinear().domain([0, 10]).range([0, 10000]);
scale.norm(5); // Returns 0.5
scale(5); // Returns 5000

scale.domain([0, 2, 10]);
scale.norm(5); // Returns 0.5
```
#### <a name='linear.normInvert' href='#linear.normInvert'>#</a> **linear.normInvert**(*number d*)

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| d | number | A normalized value in range 0-1 | No | No |
| Returns | number | A corresponding domain value | ... | ... |

No description  
#### Examples

```js
const scale = scaleLinear().domain([0, 10]).range([0, 10000]);
scale.normInvert(0.5); // Returns 5
scale.invert(5000); // Returns 5
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
#### <a name='band.pxScale' href='#band.pxScale'>#</a> **band.pxScale**(*number size*)

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| size | number | No | No | No |
| Returns | band | No | ... | ... |

if required creates a new scale with a restricted range
so that step size is at most maxPxStep
otherwise it returns itself  

## Sequential color scale

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

## Threshold color scale

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

## Categorical color scale

#### <a name='picasso.scaleCategorical' href='#picasso.scaleCategorical'>#</a> **picasso.scaleCategorical**(*Object settings, Array.&lt;field&gt; [fields, ]dataset [dataset]*)

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| settings | Object | No | No | No |
| fields | Array.&lt;field&gt; | No | Yes | No |
| dataset | dataset | No | Yes | No |
| Returns | ordinal | No | ... | ... |

An ordinal scale with the output range set to default colors, as defined by *scaleCategorical.range*  

#### <a name='picasso.scaleCategorical.range' href='#picasso.scaleCategorical.range'>#</a> **picasso.scaleCategorical.range** *Array.&lt;string&gt;*

Default range of colors 

#### <a name='picasso.scaleCategorical.unknown' href='#picasso.scaleCategorical.unknown'>#</a> **picasso.scaleCategorical.unknown** *string*

Default color for unknown values 
