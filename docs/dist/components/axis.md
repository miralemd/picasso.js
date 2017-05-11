# `axis` component

## Basic definition

The axis need only a scale defined to generate either a continuous or discrete axis depending on scale type.

```js
{
  type: 'axis',
  scale: 'x'
}
```

## Example

### Discrete axis

Limit the label length to 80px and use a angle of 35 degrees on the labels.

```js
{
  type: 'axis',
  scale: 'x',
  dock: 'top'
  settings: {
    labels: {
      mode: 'tilted',
      fontSize: '15px',
      tiltAngle: 35,
      maxLengthPx: 80,
      maxEdgeBleed: 50
    },
    line: {
      show: true
    },
    ticks: {
      show: false
    }
  }
}
```

### Continuous axis

```js
{
  type: 'axis',
  scale: 'y',
  dock: 'left'
  settings: {
    labels: {
      mode: 'horizontal',
      fontSize: '15px',
    },
    line: {
      show: false
    },
    ticks: {
      show: true
    },
    minorTicks: {
      show: true,
      tickSize: 3
    }
  }
}
```

### Using maxGlyphCount

The `maxGlyphCount` property is used to measure the largest possible size a label. The size of a label affect the primarly two things - when we determine the required size to render an axis (this can also be limited via the `maxSize` property). Secondly when the `mode` is set to `auto`, it is used to calculate the threshold for switching between horizontal and tilted labels.

Under the hood - `maxGlyphCount` is a multipler on the size of the character `M`, as measured using the `fontSize` and `fontFamily`.

```js
{
  type: 'axis',
  scale: 'x',
  settings: {
    labels: {
      mode: 'auto',
      maxGlyphCount: 20
    }
  }
}
```

## API reference - Table of contents



```js
settings: {
  labels: { // Labels settings. Optional.
    show: true, //  Default: true. Optional.
    mode: 'auto', // Control how labels arrange themself. Availabe modes are auto, horizontal, layered and tilted. Only horizontal is supported on a continuous axis. Default: 'auto'. Optional.
    tiltAngle: 40, // Angle in degrees, capped between -90 and 90. Default: 40. Optional.
    maxEdgeBleed: Infinity, //  Default: Infinity. Optional.
    fontFamily: 'Arial', //  Default: 'Arial'. Optional.
    fontSize: '12px', //  Default: '12px'. Optional.
    fill: '#595959', //  Default: '#595959'. Optional.
    margin: 3.14, // Space between tick and label. Default to 6 (discrete) or 4 (continuous). Optional.
    maxLengthPx: 150, // Max length of labels in pixels. Default: 150. Optional.
    minLengthPx: 0, // Min length of labels in pixels. Labels will always at least require this much space. Default: 0. Optional.
    maxGlyphCount: , // Is used to measure the largest possible size a label. Default: . Optional.
  },
  line: { //  Optional.
    show: true, //  Default: true. Optional.
    strokeWidth: 1, //  Default: 1. Optional.
    stroke: '#cccccc', //  Default: '#cccccc'. Optional.
  },
  ticks: { //  Optional.
    show: true, //  Default: true. Optional.
    margin: 0, //  Default: 0. Optional.
    tickSize: 3.14, // Default to 4 (discrete) or 8 (continuous). Optional.
    stroke: '#cccccc', //  Default: '#cccccc'. Optional.
    strokeWidth: 1, //  Default: 1. Optional.
  },
  minorTicks: { // Only on a continuous axis. Optional.
    show: true, //  Default: true. Optional.
    margin: 0, //  Default: 0. Optional.
    tickSize: 3, //  Default: 3. Optional.
    stroke: '#e6e6e6', //  Default: '#e6e6e6'. Optional.
    strokeWidth: 1, //  Default: 1. Optional.
  },
}
```
