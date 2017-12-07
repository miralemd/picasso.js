# Scales

## Linear scale

### Example - Custom ticks with start, end and label

To have a tick representing a range, it is possible to define a set of custom ticks with a value (the tick) and its start and end values.

  ```js
  scale: {
    domain: [0, 10],
    ticks: {
      values: [
        { value: 3, start: 2, end: 4, label: '3kr' },
        { value: 6, start: 5, end: 7, label: '6kr' }
      ]
    }
  }
  ```

### Settings

```js
{
  expand: /* number */, // Expand the output range // Optional
  invert: false, // Invert the output range // Optional
  include: [  // Optional
    : /* number */,
  ],
  ticks: {  // Optional
    tight: false, // Optional
    forceBounds: false, // Optional
    distance: 100, // Approximate distance between each tick // Optional
    values: /* Array<number> | Array<object> */,  // Optional
    count: /* number */, // Optional
  },
  minorTicks: {  // Optional
    count: 3, // Optional
  },
}
```


## Band scale


## [*EXPERIMENTAL*] Hierachical Band scale


## Sequential color scale


## Threshold color scale


## Categorical color scale

