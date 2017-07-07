# `range` component [*EXPERIMENTAL*]

A component that renders active `brush` ranges.

## Component settings

```js
settings: {
  brush: 'foo', // Name of brush instance.
  scale: 'foo', // Name of a scale.
  direction: 'horizontal', // Direction of the brush. Default: 'horizontal'. Optional.
  fill: '#ccc', // Fill color. Default: '#ccc'. Optional.
  opacity: 1, // Layer opacity. Default: 1. Optional.
}
```

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
