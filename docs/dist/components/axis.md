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
{
  settings: { 
    labels: {  // Optional
      // Labels settings
      show: true, // Optional
      mode: 'auto', // Control how labels arrange themself. Availabe modes are auto, horizontal, layered and tilted. Only horizontal is supported on a continuous axis // Optional
      tiltAngle: 40, // Angle in degrees, capped between -90 and 90 // Optional
      maxEdgeBleed: 'Infinity', // Optional
      fontFamily: 'Arial', // Optional
      fontSize: '12px', // Optional
      fill: '#595959', // Optional
      margin: /* number */, // Space between tick and label. Default to 6 (discrete) or 4 (continuous) // Optional
      maxLengthPx: 150, // Max length of labels in pixels // Optional
      minLengthPx: 0, // Min length of labels in pixels. Labels will always at least require this much space // Optional
      maxGlyphCount: null, // Is used to measure the largest possible size a label // Optional
    },
    line: {  // Optional
      show: true, // Optional
      strokeWidth: 1, // Optional
      stroke: '#cccccc', // Optional
    },
    ticks: {  // Optional
      show: true, // Optional
      margin: 0, // Optional
      tickSize: /* number */, // Default to 4 (discrete) or 8 (continuous) // Optional
      stroke: '#cccccc', // Optional
      strokeWidth: 1, // Optional
    },
    minorTicks: {  // Optional
      // Only on a continuous axis
      show: true, // Optional
      margin: 0, // Optional
      tickSize: 3, // Optional
      stroke: '#e6e6e6', // Optional
      strokeWidth: 1, // Optional
    },
  },
}
```

