# `brush-area-dir` component [*EXPERIMENTAL*]

## Definition

```js
{
  type: 'brush-area-dir',
  key: 'area', // component identifier
  preferredSize: () => 50,
  settings: {
    brush: {
      components: {
        key: 'key1', // Component key to trigger brush on
        contexts: ['highlight'],
        data: ['self'],
        action: 'add'
      }
    },
    direction: 'vertical',
    bubbles: {
      show: true,
      align: 'start', // or end
      fontSize: '14px',
      fontFamily: 'Arial',
      fill: '#595959',
      label: data => data.self.label
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
    interactions: [{
      type: 'hammer',
      gestures: [{
        type: 'Pan',
        options: {
          direction: Hammer.DIRECTION_VERTICAL,
          event: 'minor'
        },
        events: {
          minorstart: function(e) {
            this.chart.component('area').emit('areaStart', e);
          },
          minormove: function(e) {
            this.chart.component('area').emit('areaMove', e);
          },
          minorend: function(e) {
            this.chart.component('area').emit('areaEnd', e);
          }
        }
      }
    }],
    components: [
      {
        type: 'point-marker',
        key: 'pm',
        ...
      },
      {
        key: 'x-axis',
        type: 'axis',
        scale: 'x',
      },
      {
        type: 'brush-area-dir',
        key: 'area'
        settings: {
          brush: {
            components: {
              key: 'pm'
              contexts: ['highlight'],
              data: ['self'],
              action: 'add'
            }
          },
          direction: 'vertical',
          target: {
            component: 'x-axis'
          }
        }
      }
    ]
  }
});

```

