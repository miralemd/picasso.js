# Picasso

## In this file:

* <a href="#Chart.Props">Chart.Props</a>
* <a href="#Chart.SettingsProps">Chart.SettingsProps</a>
* <a href="#Chart.ScaleProps">Chart.ScaleProps</a>
* <a href="#component-settings">component-settings</a>
* <a href="#dock-layout-settings">dock-layout-settings</a>
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
| components | Array.&lt;component-settings&gt; |  | No |
| dockLayout | dock-layout-settings |  | Yes |


#### <a name='Chart.ScaleProps' href='#Chart.ScaleProps'>#</a> ScaleProps

|Name(s)|Type(s)|Description|Optional|
|-------|-------|-----------|--------|
| source | string | The data source used as input when creating the scale | No |
| type | string | The type of scale to create | Yes |
| invert | boolean | Whether to invert the scale&#x27;s output | No |


#### <a name='component-settings' href='#component-settings'>#</a> component-settings

|Name(s)|Type(s)|Description|Optional|
|-------|-------|-----------|--------|
| type | string | Component type (ex: axis, point-marker, ...) | No |
| preferredSize | function | Function returing preferred size | Yes |
| created | function |  | Yes |
| beforeMount | function |  | Yes |
| mounted | function |  | Yes |
| beforeUpdate | function |  | Yes |
| updated | function |  | Yes |
| beforeRender | function |  | Yes |
| beforeDestroy | function |  | Yes |
| destroyed | function |  | Yes |
| brush | brush-setting | see [brushing](./brushing.md) | Yes |
| displayOrder | number |  | Yes |
| prioOrder | number |  | Yes |
| minimumLayoutMode | stringObject | Refer to layout sizes defined by layoutModes in dockLayout | Yes |
| dock | string | left, right, top or bottom | Yes |
| scale | string | Named scale. Will be provided to the component if it ask for it. | Yes |
| formatter | string | Named formatter. Fallback to create formatter from scale. Will be provided to the component if it ask for it. | Yes |

Will also include component specific settings depending on type
             ex: [marker-point-settings](./markers.md#marker-point-settings),
                 [marker-box-settings](./markers.md#marker-box-settings),
                 [axis-settings](./axis.md#axis-settings),
#### <a name='dock-layout-settings' href='#dock-layout-settings'>#</a> dock-layout-settings

|Name(s)|Type(s)|Description|Optional|
|-------|-------|-----------|--------|
| size | object | Phyiscal size. Default to size of the container | Yes |
| size.width | number |  | Yes |
| size.height | number |  | Yes |
| logicalSize | object | Logical size represent the size given to the dock layout to work with. | Yes |
| logicalSize.width | number |  | Yes |
| logicalSize.height | number |  | Yes |
| logicalSize.preserveAspectRatio | boolean |  | Yes |
| layoutModes | Object.&lt;string, {width: number, height: number}&gt; | Dictionary with named sizes | Yes |


#### <a name='createInstance' href='#createInstance'>#</a> **createInstance**()

|Name|Type|Description|Optional|
|----|----|-----------|--------|

Chart instance factory function  
#### <a name='createInstance~instance.update' href='#createInstance~instance.update'>#</a> createInstance.**createInstance~instance.update**(* chart*)

|Name|Type|Description|Optional|
|----|----|-----------|--------|
| chart |  | Chart definition |No|

Update the chart with new settings and / or data  
#### <a name='createInstance~instance.brush' href='#createInstance~instance.brush'>#</a> createInstance.**createInstance~instance.brush**()

|Name|Type|Description|Optional|
|----|----|-----------|--------|
| Returns | data-brush |  | ... |

The brush context for this chart  
#### <a name='picasso.chart' href='#picasso.chart'>#</a> **picasso.chart**(*Chart.Props settings*)

|Name|Type|Description|Optional|
|----|----|-----------|--------|
| settings | Chart.Props | Settings |No|
| Returns | Chart |  | ... |

The chart creator  

## Example

```js
picasso.chart({	
  element: document.getElementById('chart-container'),
  data: { ... },
  settings: {
    scales: {
      x: {
        source: "/qHyperCube/qMeasureInfo/0"
      },
      y: {
        source: "/qHyperCube/qDimensionInfo/0"
      }
    },
    components: [{
      type: "point-marker",
      settings: {
        fill: 'red'
      }
    }]
  },
  created: function() {
    console.log('Chart was created');
  },
  mounted: function() {
    console.log('Chart was mounted');
  },
  on: {
    click: function(e) {
      console.log('Click', e);
    }
  }
});
```
