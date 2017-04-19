# `brush-lasso` component

## Definition

The brush-lasso component have 4 different types of listeners that can be utilized to visulize a lasso and brush on components.

* lassoStart - Initilize the lasso. This will make the other listeners active. If a start has not been triggered, the other listerers have no effect.
* lassoMove - To create a lasso, at least one lassoMove has to be triggered. On each lassoMove a draw call is performed and a brush is trigged on the line segment created between the previous lasso coordinate and the current cooridnate.
* lassoEnd - If within snap threshold - the lasso is closed and a brush on is trigged on the area of the enclosed lasso, if not - no brush is triggered.
* lassoCancel - Cancel the current lasso by removing the visual parts and trigger an end event the brushes.

```js
{ 
  type: 'brush-lasso',
  key: 'lassoComp', // component identifier
  settings: {
    brush: {
      components: [
        key: 'key1' // Component key to trigger brush on
        contexts: ['brushLasso'],
        data: ['self'],
        action: 'add'
      ]
    }
    snapIndicator: {
      threshold: 75, // Minimum distance in pixel before the snap indicator is displayed and the lasso is closed
      strokeDasharray: '5, 5',
      stroke: 'black',
      strokeWidth: 2,
      opacity: 0.5
    },
    lasso: {
      fill: 'transparent',
      stroke: 'black',
      strokeWidth: 2,
      opacity: 0.7,
      strokeDasharray: '15, 5',
    },
    startPoint: {
      r: 10,
      fill: 'green',
      stroke: 'black',
      strokeWidth: 1,
      opacity: 1
    }
  }
}
```

## Example usage

```js
var lassoRef;

picasso.chart({
  element: element,
  data: data, 
  settings: {
    components: [
      {
        key: 'key1',
        type: 'point-marker',
        brush: {
          consume: [
            {
              context: 'myLassoContext',
              style: {
                inactive: {
                  opacity: 0.3
                }
              }
            }
          ]
        },
        ...
      },
      {
        type: 'interaction',
        require: ['chart'],
        actions: [
          {
            type: 'Pan',
            handlers: {
              panstart: function onPanStart(e) {
                this.chart.component('lassoComp').emit('lassoStart', e); // If it should on trigger on a specific component, use chartInstance.componentsFromPoint() to determine if start is valid or not
              },
              pan: function onPan(e) {
                this.chart.component('lassoComp').emit('lassoMove', e);
              },
              panend: function onPanEnd(e) {
                this.chart.component('lassoComp').emit('lassoEnd', e);
              }
            }
          }
        ]
      },
      { 
        key: 'lassoComp',
        type: 'brush-lasso',
        brush: {
          components: [
            { 
              key: 'key1',
              contexts: ['myLassoContext'],
              data: ['self']
            }
          ]
        }
      }

    ]
  }
});

```

