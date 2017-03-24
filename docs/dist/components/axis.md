# `axis` component

## Component settings

```js
settings: {
  labels: { // Labels settings. Optional.
    show: true, //  Default: true. Optional.
    tilted: true, // Only supported on a horizontal axis. Optional.
    tiltAngle: 40, // Angle in degrees, capped between -90 and 90. Default: 40. Optional.
    maxEdgeBleed: Infinity, //  Default: Infinity. Optional.
    fontFamily: 'Arial', //  Default: 'Arial'. Optional.
    fontSize: '12px', //  Default: '12px'. Optional.
    fill: '#595959', //  Default: '#595959'. Optional.
    margin: 6 (discrete) or 4 (continuous), // Space between tick and label. Default: 6 (discrete) or 4 (continuous). Optional.
    layered: true, // Only supported on a horizontal axis. If true forces tilted to false. Optional.
    maxSize: 250, //  Default: 250. Optional.
  },
  line: { //  Optional.
    show: true, //  Default: true. Optional.
    strokeWidth: 1, //  Default: 1. Optional.
    stroke: '#cccccc', //  Default: '#cccccc'. Optional.
  },
  ticks: { //  Optional.
    show: true, //  Default: true. Optional.
    margin: 3.14, //  Optional.
    tickSize: 4 (discrete) or 8 (continuous), //  Default: 4 (discrete) or 8 (continuous). Optional.
    stroke: '#cccccc', //  Default: '#cccccc'. Optional.
    strokeWidth: 1, //  Default: 1. Optional.
  },
  minorTicks: { // Only on a continuous axis. Optional.
    show: true, //  Default: true. Optional.
    margin: 3.14, //  Optional.
    tickSize: 3, //  Default: 3. Optional.
    stroke: '#E6E6E6', //  Default: '#E6E6E6'. Optional.
    strokeWidth: 1, //  Default: 1. Optional.
  },
}
```
