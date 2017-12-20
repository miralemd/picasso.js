# `legend-seq` component

## Example

```js
{
  type: 'legend-seq',
  dock: 'top', 
  settings: {
    fill: 'colorScale',
    major: 'measureScale',
    ticks: {
      label: (val, i, ary) => {
        let temp = ['Cold', 'Hot'];
        return temp[i % 2];
      },
    },
    title: { 
      text: 'ALL YOUR BASES BELONG TO US'
    }
  }
}
```

## Example - Enable range selection

To enable range selelection on a sequential legend, the legend component exposes two nodes that can be reference by the brush-range component as a target.
This reference enables the brush-range component to limit the target area to a sub-area of the legends dock area.

```js
chartSettings = {
  interactions: [
    ... // Setup required brush-range interactions here.
  ],
  scales: {
    myColorScale: { source: '0/1', type: 'color' },
    myLinearScale: { source: '0/1', type: 'linear' },
  },
  components: [
    {
      type: 'legend-seq',
      dock: 'right',
      key: 'myLegend' // Reference by brush-range component,
      settings: {
        fill: 'myColorScale',
        major: 'myLinearScale'
      }
    },
    {
      type: 'brush-range',
      key: 'myBrushRange',
      dock: '@myLegend', // Legend reference
      settings: {
        brush: 'highlight',
        scale: 'myLinearScale',
        direction: 'vertical',
        bubbles: {
          align: 'start',
          placement: 'outside' // Render bubbles outside the @myLegend dock area
        },
        target: {
          selector: '[id="legend-seq-target"]', // Define the target area. Must be reference a node from @myLegend
          fillSelector: '[id="legend-seq-ticks"]', // Define the target fill area. Must be reference a node from @myLegend
          fill: 'rgba(82,204,82,0.3)',
        }
      },
  }]
}
```

## Component settings

{{>struct definitions.component--legend-seq}}
