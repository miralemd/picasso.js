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

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| data | Chart.DataProps | Chart data | No | No |
| settings | Chart.SettingsProps | Chart settings | No | No |
| element | HTMLElement | Element to mount the chart into | No | No |
| mounted | function | Lifecycle function called when the chart instance has been mounted into an element. | No | No |
| updated | function | Lifecycle function called when the chart instance has been updated. | No | No |
| on | Object | Event listeners | No | No |

No description  
#### <a name='Chart.SettingsProps' href='#Chart.SettingsProps'>#</a> SettingsProps

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| scales | Chart.ScaleProps | No | No | No |
| components | Array.&lt;component-settings&gt; | No | No | No |
| dockLayout | dock-layout-settings | No | Yes | No |

No description  
#### <a name='Chart.ScaleProps' href='#Chart.ScaleProps'>#</a> ScaleProps

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| source | string | The data source used as input when creating the scale | No | No |
| type | string | The type of scale to create | Yes | No |
| invert | boolean | Whether to invert the scale&#x27;s output | No | No |

No description  
#### <a name='component-settings' href='#component-settings'>#</a> component-settings

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| type | string | Component type (ex: axis, point-marker, ...) | No | No |
| preferredSize | function | Function returing preferred size | Yes | No |
| created | function | No | Yes | No |
| beforeMount | function | No | Yes | No |
| mounted | function | No | Yes | No |
| beforeUpdate | function | No | Yes | No |
| updated | function | No | Yes | No |
| beforeRender | function | No | Yes | No |
| beforeDestroy | function | No | Yes | No |
| destroyed | function | No | Yes | No |
| brush | brush-setting | see [brushing](./brushing.md) | Yes | No |
| displayOrder | number | No | Yes | No |
| prioOrder | number | No | Yes | No |
| minimumLayoutMode | stringObject | Refer to layout sizes defined by layoutModes in dockLayout | Yes | No |
| dock | string | left, right, top or bottom | Yes | No |
| scale | string | Named scale. Will be provided to the component if it ask for it. | Yes | No |
| formatter | string | Named formatter. Fallback to create formatter from scale. Will be provided to the component if it ask for it. | Yes | No |

Will also include component specific settings depending on type
             ex: [marker-point-settings](./markers.md#marker-point-settings),
                 [marker-box-settings](./markers.md#marker-box-settings),
                 [axis-settings](./axis.md#axis-settings),  
#### <a name='dock-layout-settings' href='#dock-layout-settings'>#</a> dock-layout-settings

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| size | object | Phyiscal size. Default to size of the container | Yes | No |
| size.width | number | No | Yes | No |
| size.height | number | No | Yes | No |
| logicalSize | object | Logical size represent the size given to the dock layout to work with. | Yes | No |
| logicalSize.width | number | No | Yes | No |
| logicalSize.height | number | No | Yes | No |
| logicalSize.preserveAspectRatio | boolean | No | Yes | No |
| layoutModes | Object.&lt;string, {width: number, height: number}&gt; | Dictionary with named sizes | Yes | {} |

No description  
#### <a name='createInstance' href='#createInstance'>#</a> **createInstance**()

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|

Chart instance factory function  
#### <a name='createInstance~instance.update' href='#createInstance~instance.update'>#</a> createInstance.**createInstance~instance.update**(* chart*)

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| chart |  | Chart definition | No | No |

Update the chart with new settings and / or data  
#### <a name='createInstance~instance.brush' href='#createInstance~instance.brush'>#</a> createInstance.**createInstance~instance.brush**()

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| Returns | data-brush | No | ... | ... |

The brush context for this chart  
#### <a name='picasso.chart' href='#picasso.chart'>#</a> **picasso.chart**(*Chart.Props settings*)

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| settings | Chart.Props | Settings | No | No |
| Returns | Chart | No | ... | ... |

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
