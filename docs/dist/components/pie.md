# `pie` component

> Experimental

A component that renders pie slices in a designated area.

### Settings

```js
{
  type: 'pie', // Optional
  settings: { 
    startAngle: 0, // If angle is specified, sets the overall start angle of the pie to the specified function or number // Optional
    endAngle: '2*Math.PI', // If angle is specified, sets the overall end angle of the pie to the specified function or number // Optional
    padAngle: 0, // The pad angle here means the angular separation between each adjacent arc // Optional
    slice: {  // Optional
      show: true, // Optional
      fill: '#fff', // Optional
      stroke: '#000', // Optional
      strokeWidth: 1, // Optional
      opacity: 1, // Optional
      innerRadius: 0, // The inner radius of the pie slice // Optional
      outerRadius: 1, // The outer radius of the pie slice // Optional
      cornerRadius: 0, // The corner radius of the pie slices corners in pixels // Optional
      offset: 0,  // Optional
    },
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
