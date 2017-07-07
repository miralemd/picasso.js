# `brush-range` component [*EXPERIMENTAL*]

## Definition

```js
{
  type: 'brush-range',
  key: 'rangeSelectionY', // component identifier
  preferredSize: () => 50,
  settings: {
    brush: 'highlight', // brush to apply changes to
    scale: 'y', // scale to extract data from
    direction: 'vertical',
    bubbles: {
      show: true
      align: 'start', // or end
      fontSize: '14px',
      fontFamily: 'Arial',
      fill: '#595959'
    },
    target: { // render matching overlay on target component (optional)
      component: 'y-axis',
      fill: 'rgba(82,204,82,0.2)',
      fillActive: 'rgba(82,204,82,0.4)' // target area color on hover
    }
  }
}
```

## Example usage

```js
var rangeRef;

picasso.chart({
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
        },
        target: {
          component: 'y-axis'
        }
      },
      {
        type: 'brush-range',
        key: 'rangeSelectionX'
        settings: {
          brush: 'highlight',
          scale: 'x',
          direction: 'horizontal'
        },
        target: {
          component: 'x-axis'
        }
      },
      {
        type: 'interaction',
        actions: [{
          type: 'Pan',
          options: {
            event: 'range'
          },
          handlers: {
            rangestart: function(e) {
              if (e.direction === 2 || e.direction === 4) {
                rangeRef = 'rangeSelectionX'
              } else {
                rangeRef = 'rangeSelectionY'
              }
              // delegate 'start' event to relevant brush-range component
              this.component(rangeRef).emit('rangeStart', e);
            },
            rangemove: function(e) {
              this.component(rangeRef).emit('rangeMove', e);
            },
            rangend: function(e) {
              this.component(rangeRef).emit('rangeEnd', e);
            }
          }
        }]
      }
    ]
  }
});

```

