# picasso
## In this file:
* <a href="#Chart.SettingsProps">Chart.SettingsProps</a>
* <a href="#Chart.ScaleProps">Chart.ScaleProps</a>
* <a href="#Chart">Chart</a>
* <a href="#picasso.chart">picasso.chart</a>

#### <a name='Chart.SettingsProps' href='#Chart.SettingsProps'>#</a> SettingsProps
|Name(s)|Type(s)|Description|Optional|
|-------|-------|-----------|--------|
| scales | Chart.ScaleProps |  | No |
| components | object |  | No |
| components.markers, | Array.&lt;marker&gt; |  | No |
| components.axes | Array.&lt;axis&gt; |  | No |

#### Examples
```js
{
  scales: {
    x: {...}
  },
  components: {
    axes: [...]
    markers: [...]
  }
}
```
#### <a name='Chart.ScaleProps' href='#Chart.ScaleProps'>#</a> ScaleProps
|Name(s)|Type(s)|Description|Optional|
|-------|-------|-----------|--------|
| source | string | The data source used as input when creating the scale | No |
| type | string | The type of scale to create | Yes |
| invert | boolean | Whether to invert the scale&#x27;s output | No |

#### Examples
```js
{
  source: "whatever is accepted by the data parser",
  type: "color",
  invert: true
}
```
#### <a name='Chart' href='#Chart'>#</a> **Chart**(*HTMLElement element, Chart.DataProps data, Chart.SettingsProps settings*)


|Name|Type|Description|Optional|
|----|----|-----------|--------|
| element | HTMLElement |  |No|
| data | Chart.DataProps |  |No|
| settings | Chart.SettingsProps |  |No|
| Returns | Chart |  | ... |

  
#### <a name='picasso.chart' href='#picasso.chart'>#</a> **chart**(*Chart.SettingsProps settings*)


|Name|Type|Description|Optional|
|----|----|-----------|--------|
| settings | Chart.SettingsProps | Settings |No|
| Returns | Chart |  | ... |

The chart creator  
#### Examples
```js
picasso.chart({
  scales: {
    x: {
      source: "/qHyperCube/qMeasureInfo/0"
    },
    y: {
      source: "/qHyperCube/qDimensionInfo/0"
    }
  },
  components: {
    markers: [
      {
        type: "point",
        settings: {
          fill: 'red'
        }
      }
    ]
  }
});
```
