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

{{>magic ctx='core.scales.linear-js'}}

## Band scale

{{>magic ctx='core.scales.band-js'}}

## [*EXPERIMENTAL*] Hierachical Band scale

{{>magic ctx='core.scales.h-band-js'}}

## Sequential color scale

{{>magic ctx='core.scales.color.sequential-js'}}

## Threshold color scale

{{>magic ctx='core.scales.color.threshold-js'}}

## Categorical color scale

{{>magic ctx='core.scales.color.categorical-js'}}
