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

## API reference

### Discrete settings

```js
{
  labels: { 
    show: true, // Toggle labels on/off // Optional
    tiltAngle: 40, // Tilting angle in degrees. Capped between -90 and 90. Only applicable when labels are in `tilted` mode. // Optional
    maxEdgeBleed: /* number */, // Control the amount of space (in pixels) that labes can occupy outside their docking area. Only applicable when labels are in `tilted` mode. // Optional
    margin: 4, // Space in pixels between the tick and label. // Optional
    maxLengthPx: 150, // Max length of labels in pixels // Optional
    minLengthPx: 0, // Min length of labels in pixels. Labels will always at least require this much space // Optional
    mode: 'auto', // Control how labels arrange themself. Availabe modes are `auto`, `horizontal`, `layered` and `tilted`. When set to `auto` the axis determines the best possible layout in the current context. // Optional
    maxGlyphCount: /* number */, // When only a sub-set of data is available, ex. when paging. This property can be used to let the axis estimate how much space the labels will consume, allowing it to give a consistent space estimate over the entire dataset when paging. // Optional
    align: 0.5, // Align act as a slider for the text bounding rect over the item bandwidth, given that the item have a bandwidth. Except when labels are tilted, then the align is a pure align that shifts the position of the label anchoring point. // Optional
  },
  ticks: { 
    show: false, // Toggle ticks on/off // Optional
    margin: 0, // Space in pixels between the ticks and the line. // Optional
    tickSize: 4, // Size of the ticks in pixels. // Optional
  },
  line: { 
    show: false, // Toggle line on/off // Optional
  },
  paddingStart: 0, // Padding in direction perpendicular to the axis // Optional
  paddingEnd: 10, // Padding in direction perpendicular to the axis // Optional
}
```


### Continuous settings

```js
{
  labels: { 
    show: true, // Toggle labels on/off // Optional
    margin: 4, // Space in pixels between the tick and label. // Optional
    maxLengthPx: 150, // Max length of labels in pixels // Optional
    minLengthPx: 0, // Min length of labels in pixels. Labels will always at least require this much space // Optional
    align: 0.5, // Align act as a slider for the text bounding rect over the item bandwidth, given that the item have a bandwidth. // Optional
  },
  ticks: { 
    show: true, // Toggle ticks on/off // Optional
    margin: 0, // Space in pixels between the ticks and the line. // Optional
    tickSize: 8, // Size of the ticks in pixels. // Optional
  },
  minorTicks: { 
    show: false, // Toggle minor-ticks on/off // Optional
    tickSize: 3, // Size of the ticks in pixels. // Optional
    margin: 0, // Space in pixels between the ticks and the line. // Optional
  },
  line: { 
    show: true, // Toggle line on/off // Optional
  },
  paddingStart: 0, // Padding in direction perpendicular to the axis // Optional
  paddingEnd: 10, // Padding in direction perpendicular to the axis // Optional
}
```

