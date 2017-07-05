# `pie` component

A component that renders pie slices in a designated area.

### Data definition

{{>magic ctx='core.chart-components.markers.pie.pie-js.data'}}


### Settings

{{>magic ctx='core.chart-components.markers.pie.pie-js.settings'}}

## Example

```js
{
  type: 'pie',
  data: {
    mapTo: {
      arc: { source: '/qHyperCube/qMeasureInfo/0' }
    },
    groupBy: {
      source: '/qHyperCube/qDimensionInfo/0'
    }
  },
  startAngle: Math.PI / 2,
  endAngle: -Math.PI / 2,
  padAngle: 0.01,
  slice: {
    outerRadius: 0.8,
    innerRadius: 0.6,
    cornerRadius: 2,
    opacity: 0.8,
    offset: function offset(e, ix) {
      return ix === 2 ? 0.3 : 0;
    },
    fill: {
      scale: 'color',
      ref: 'arc'
    },
    strokeWidth: function strokeWidth(e, ix) {
      return ix === 2 ? 2 : 0;
    },
    stroke: 'red'
  }
}
```
