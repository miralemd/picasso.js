# `range` component [*EXPERIMENTAL*] 

A component that renders active `brush` ranges.

## Component settings

{{>magic ctx='core.chart-components.range.range-js'}}

The component can be docked to the same area as another component by referencing the `key` value:

```js
components: [
  {
    type: 'some-component',
    key: 'here',
    ...
  },
  {
    type: 'range',
    dock: '@here', // dock to same area as component with key: 'here'
    ...
  }
]
```
