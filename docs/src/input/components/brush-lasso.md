# `brush-lasso` component [*EXPERIMENTAL*] 

## Definition

Is experimental and doesn't currently support actually brushing, only visualising a lasso pattern.

```js
{ 
  type: 'brush-lasso',
  key: 'lassoComp', // component identifier
  settings: {
    snapIndicator: {
      threshold: 75, // Minimum distance in pixel before the snap indicator is displayed the lasso is closed
      strokeDasharray: '5, 5',
      stroke: 'black',
      strokeWidth: 2,
      opacity: 0.5
    },
    lasso: {
      fill: 'transparent',
      stroke: 'black',
      strokeWidth: 2,
      opacity: 0.7
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
  // attach event handlers to chart (assume picasso-hammer plugin is used)
  on: {
    panstart: function(e) {
      this.component(lassoRef).instance.def.start(e);
    },
    panmove: function(e) {
      this.component(lassoRef).instance.def.move(e);
    },
    panend: function(e) {
      this.component(lassoRef).instance.def.end(e);
    }
  },
  element: element,
  data: data, 
  settings: {
    components: [
      { 
        type: 'brush-lasso',
        key: 'lassoComp'
      }
    ]
  }
});

```

