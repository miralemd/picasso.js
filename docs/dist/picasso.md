# Picasso

## In this file:

* <a href="#Chart.Props">Chart.Props</a>
* <a href="#Chart.SettingsProps">Chart.SettingsProps</a>
* <a href="#Chart.ScaleProps">Chart.ScaleProps</a>
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

#### <a name='Chart.SettingsProps' href='#Chart.SettingsProps'>#</a> SettingsProps

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| scales | Chart.ScaleProps | No | No | No |
| components | object | No | No | No |
| components.markers | Array.&lt;marker&gt; | No | No | No |
| components.axes | Array.&lt;axis&gt; | No | No | No |
| dockLayout | dock-layout-settings | No | Yes | No |

#### <a name='Chart.ScaleProps' href='#Chart.ScaleProps'>#</a> ScaleProps

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| source | string | The data source used as input when creating the scale | No | No |
| type | string | The type of scale to create | Yes | No |
| invert | boolean | Whether to invert the scale&#x27;s output | No | No |

#### <a name='dock-layout-settings' href='#dock-layout-settings'>#</a> dock-layout-settings

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| size | boolean | Phyiscal size. Default to size of the container | Yes | No |
| size.width | boolean | No | Yes | No |
| size.height | boolean | No | Yes | No |
| logicalSize | boolean | Logical size represent the size given to the dock layout to work with. | Yes | No |
| logicalSize.width | boolean | No | Yes | No |
| logicalSize.height | boolean | No | Yes | No |
| logicalSize.preserveAspectRatio | boolean | No | Yes | No |
| layoutModes | Object.&lt;string, {width: number, height: number}&gt; | Dictionary with named sizes | Yes | {} |

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
