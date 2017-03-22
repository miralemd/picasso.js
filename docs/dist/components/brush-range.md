# [*EXPERIMENTAL*] `brush-range` component

## Definition

```js
{ 
  type: 'brush-range',
  key: 'rangeSelectionY', // component identifier
  preferredSize: () => 50,
  settings: {
    brush: 'highlight', // brush to apply changes to 
    scale: 'y', // scale to extract data from 
    direction: 'vertical'
  }
}
```

## Example usage

```js
var rangeRef;

picasso.chart({
  // attach event handlers to chart (assume picasso-hammer plugin is used)
  on: {
    panstart: function(e) {
      if (e.direction === 2 || e.direction === 4) {
        rangeRef = 'rangeSelectionX'
      } else {
        rangeRef = 'rangeSelectionY'
      }
      // delegate 'start' event to relevant brush-range component
      this.component(rangeRef).instance.def.start(e);
    },
    panmove: function(e) {
      this.component(rangeRef).instance.def.move(e);
    },
    panend: function(e) {
      this.component(rangeRef).instance.def.end(e);
    }
  },
  element: element,
  data: data, 
  settings: {
    scales: {
      x: { source: x, expand: 0.2 }
      y: { source: y, expand: 0.2 }
    },
    components: [
      {
        type: 'point-marker',
        ...
      },
      { 
        type: 'brush-range',
        key: 'rangeSelectionY'
        settings: {
          brush: 'highlight', 
          scale: 'y',
          direction: 'vertical'
        }
      },
      { 
        type: 'brush-range',
        key: 'rangeSelectionX'
        settings: {
          brush: 'highlight', 
          scale: 'x',
          direction: 'horizontal'
        }
      }
    ]
  }
});

```

