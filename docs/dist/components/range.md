# `range` component

A simple component that renders active `brush` ranges.

## Component definition:

```js
{    
  type: 'range',
  settings: {
    brush: 'highlight', // name of brush instance
    scale: 'y', // name of scale
    direction: 'vertical' // direction of the brush - default: 'horizontal'
    fill: 'red', // optional - default: '#ccc'
    opacity: 0.2 // optional - default: 1
  } 
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
