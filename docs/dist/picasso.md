# Picasso

## In this file:

* <a href="#Chart.Props">Chart.Props</a>
* <a href="#Chart.SettingsProps">Chart.SettingsProps</a>
* <a href="#Chart.ScaleProps">Chart.ScaleProps</a>
* <a href="#createInstance">createInstance</a>
* <a href="#createInstance~instance.update">createInstance~instance.update</a>
* <a href="#createInstance~instance.brush">createInstance~instance.brush</a>
* <a href="#picasso.chart">picasso.chart</a>


#### <a name='Chart.Props' href='#Chart.Props'>#</a> Props

|Name(s)|Type(s)|Description|Optional|
|-------|-------|-----------|--------|
| data | Chart.DataProps | Chart data | No |
| settings | Chart.SettingsProps | Chart settings | No |
| element | HTMLElement | Element to mount the chart into | No |
| mounted | function | Lifecycle function called when the chart instance has been mounted into an element. | No |
| updated | function | Lifecycle function called when the chart instance has been updated. | No |
| on | Object | Event listeners | No |

#### <a name='Chart.SettingsProps' href='#Chart.SettingsProps'>#</a> SettingsProps

|Name(s)|Type(s)|Description|Optional|
|-------|-------|-----------|--------|
| scales | Chart.ScaleProps |  | No |
| components | object |  | No |
| components.markers, | Array.&lt;marker&gt; |  | No |
| components.axes | Array.&lt;axis&gt; |  | No |

#### <a name='Chart.ScaleProps' href='#Chart.ScaleProps'>#</a> ScaleProps

|Name(s)|Type(s)|Description|Optional|
|-------|-------|-----------|--------|
| source | string | The data source used as input when creating the scale | No |
| type | string | The type of scale to create | Yes |
| invert | boolean | Whether to invert the scale&#x27;s output | No |

#### <a name='createInstance' href='#createInstance'>#</a> **createInstance**()

|Name|Type|Description|Optional|
|----|----|-----------|--------|

Chart instance factory function  
#### <a name='createInstance~instance.update' href='#createInstance~instance.update'>#</a> createInstance.**update**(* chart*)

|Name|Type|Description|Optional|
|----|----|-----------|--------|
| chart |  | Chart definition |No|

Update the chart with new settings and / or data  
#### <a name='createInstance~instance.brush' href='#createInstance~instance.brush'>#</a> createInstance.**brush**()

|Name|Type|Description|Optional|
|----|----|-----------|--------|
| Returns | data-brush |  | ... |

The brush context for this chart  
#### <a name='picasso.chart' href='#picasso.chart'>#</a> **chart**(*Chart.Props settings*)

|Name|Type|Description|Optional|
|----|----|-----------|--------|
| settings | Chart.Props | Settings |No|
| Returns | Chart |  | ... |

The chart creator  
