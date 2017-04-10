# `point-marker` component

A component that renders points in a designated area.

## Component settings

```js
settings: {
  x: 0.5, // x coordinate. Default: 0.5. Optional.
  y: 0.5, // y coordinate. Default: 0.5. Optional.
  fill: "#999", // fill color. Default: "#999". Optional.
  stroke: "#ccc", // stroke color. Default: "#ccc". Optional.
  strokeWidth: , // stroke width. Optional.
  size: 1, // size of shape. Default: 1. Optional.
  opacity: 1, // opacity of shape. Default: 1. Optional.
  shape: "circle", // type of shape. Default: "circle". Optional.
  sizeLimits: { //  Optional.
    maxPx: 10000, // maximum size in pixels. Default: 10000. Optional.
    minPx: 1, // minimum size in pixels. Default: 1. Optional.
    maxRel: 1, // maximum size relative calculated bounding box of allowed size. Default: 1. Optional.
    minRel: 0.1, // minimum size relative calculated bounding box of allowed size. Default: 0.1. Optional.
  },
}
```

## Dynamics of the settings properties

### Accessing the data

Assuming a `data` mapping of:

```js
{
  x: { source: "sales" }
  label: { source: "products" }
}
```

the data can be accessed in various ways.
The following definitions will all result in the same `x` value:

```js
{
  x: { ref: "x" } // reference the 'x' value in the mapped data
  x: { ref: "x", fn: (d) { return d.value; } }, // the referenced data property 'x' in sent in as the first parameter in the callback
  x: { fn: function() { return this.data.x.value; } }, // the mapped data can be accessed through 'this.data'
  x: function () { return this.data.x.value; } // the mapped data can be accessed through 'this.data'
}
```

### Scale usage

If a reference to a `scale` is defined, the mapped data value will go through the scale, returning a new value.

Assuming a scale 'linX' is defined as:

```js
scales: {
  linX: { source: "sales", expand: 0.2 }
}
```

the following definitions will all result in the same 'x' value:

```js
{
  x: { ref: "x", scale: "linX" }, // automatically sends value 'x' through the scale and returns the scaled value
  x: { ref: "x", scale: "linX", fn: function(d) { return this.scale(d) } }, // the referenced 'scale' is accessible in the callback's 'this' context
  x: { scale: "linX", fn: function(d) { return this.scale(this.data.x.value) } }
}
```

### More expressiveness

Since all mapped data is accessible in property callbacks, the values can be used for more expressive representation of properties:

```js
{
  fill: {
    scale: "linX",
    fn: function() { // color the maximum value red
      return this.scale.max() >= this.data.x.value ? "red" : "grey";
    }
  }
}
```
## Example

```js
{
  type: "point",
  data: {
    groupBy: {
      source: "products",
    },
    mapTo: {
      color: { source: "margin" },
      opacity: { source: "sales" }
    }
  },
  settings: {
    x: 0.2, // simple number, places all points at the same position along the x-axis (which assumes to have a range of [0,1])
    y: (d) => d.value, // function is called for each datum d
    fill: {
      ref: "color",
      scale: {  // inline scale definition
        source: "margin",
        type: "sequential-color"
      }
    },
    opacity: {
      ref: "opacity",
      fn: ( d ) => d.value
    },
    shape: ( d, i ) => ["rect", "circle"][i % 2]
  }
}
```
