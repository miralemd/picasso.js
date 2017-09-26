# `pie` component

> Experimental

A component that renders pie slices in a designated area.

### Data definition

```js
data: {
  arc: 3.14, // value that represents the size of the arc.
}
```


### Settings

```js
settings: {
  startAngle: 0, // If angle is specified, sets the overall start angle of the pie to the specified function or number. Default: 0. Optional.
  endAngle: 2*Math.PI, // If angle is specified, sets the overall end angle of the pie to the specified function or number. Default: 2*Math.PI. Optional.
  padAngle: 0, // The pad angle here means the angular separation between each adjacent arc. Default: 0. Optional.
  slice: { //  Optional.
    show: true, //  Default: true. Optional.
    fill: '#fff', //  Default: '#fff'. Optional.
    stroke: '#000', //  Default: '#000'. Optional.
    strokeWidth: 1, //  Default: 1. Optional.
    opacity: 1, //  Default: 1. Optional.
    innerRadius: 0, // The inner radius of the pie slice. Default: 0. Optional.
    outerRadius: 1, // The outer radius of the pie slice. Default: 1. Optional.
    cornerRadius: 0, // The corner radius of the pie slices corners in pixels. Default: 0. Optional.
    offset: 0, // The relative radial offset of the slice. Default: 0. Optional.
  },
}
```

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
  settings: {
    startAngle: Math.PI / 2,
    endAngle: -Math.PI / 2,
    padAngle: 0.01,
    slice: {
      outerRadius: 0.8,
      innerRadius: 0.6,
      cornerRadius: 2,
      opacity: 0.8,
      offset: (e, ix) => {
        return ix === 2 ? 0.3 : 0;
      },
      fill: {
        scale: 'color',
        ref: 'arc'
      },
      strokeWidth: (e, ix) => {
        return ix === 2 ? 2 : 0;
      },
      stroke: 'red'
    }
  }
}
```
