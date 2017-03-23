# `grid-line` component

## Basic grid

The grid as a component is pretty easy to set up, to get started, you'll suffice with:

```js
{
  type: 'grid-line',
  x: {
    scale: 'x'
  },
  y: {
    scale: 'y'
  }
}
```

This will work fine for a scatter plot or other chart with two linear scales.
You do not have to specify both the X and Y in case you're drawing a box plot or distribution chart.

## Advanced example

```js
{
  type: 'grid-line',
  x: {
    scale: 'x'
  },
  y: {
    scale: 'y'
  },
  ticks: {
    show: true,
    stroke: 'red',
    strokeWidth: 5,
  },
  minorTicks: {
    show: false,
    stroke: 'blue',
    strokeWidth: 1
  }
}
```

In this example we're using both X and Y scales, we're showing major ticks as a red, 5px line, and the settings for minor ticks are a blue 1px line.
However, since the minor ticks have the variable show: false, they will not be rendered.

## Component settings

TODO
