# `labels` component

A component that renders labels based on the visual output of other components.

Since this component depends on other referenced component, it is important that the `displayOrder` of this component is set to a larger value than all of the referenced components.

## Component settings

```js
settings: {
  sources: { // 
    component: 'foo', // 
    selector: 'foo', // 
    strategy: , // 
  },
}
```

## Strategies

### `bars`

A strategy used primarily for labeling the rectangles in a bar chart, histogram, waterfall or similar.

```js
settings: {
  direction: 'up', // The direction in which the bars are growing: 'up', or 'down'. Default: 'up'. Optional.
  fontFamily: 'Arial', //  Default: 'Arial'. Optional.
  fontSize: 12, //  Default: 12. Optional.
  labels: { // 
    label: 'foo', // The text value.
    placements: { // 
      position,: 'foo', // 
      justify: 0, // Placement of the label along the direction of the bar. Default: 0. Optional.
      align: 0.5, // Placement of the label along the perpendicular direction of the bar. Default: 0.5. Optional.
      fill: '#333', // Color of the label. Default: '#333'. Optional.
    },
  },
}
```

## Example

```js
components: [
  {
    type: 'box-marker',
    key: 'bars',
    displayOrder: 1,
    /* ... */
  },
  {
    type: 'labels',
    displayOrder: 2 // must be larger than the displayOrder for the 'bars' component
    settings: {
      sources: [{
        component: 'bars',
        selector: 'rect', // select all 'rect' shapes from the 'bars' component
        strategy: {
          type: 'bar', // the strategy type
          settings: {
            direction: function({ data }) { // data argument is the data bound to the shape in the referenced component
              return data && data.end.value > data.start.value ? 'up' : 'down'
            },
            fontFamily: 'Helvetica',
            fontSize: 14,
            align: 0.5,
            justify: 1,
            labels: [{
              label({ data }) {
                return data ? data.end.label : '';
              },
              placements: [ // label placements in prio order, label will be placed in the first place it fits into
                { position: 'inside', fill: '#fff' },
                { position: 'outside', fill: '#666' }
              ]
            }]
          }
        }
      }]
    }
  }
]
