# Dock Layout

The dock layout is the engine that controls how different components are positioned and if there is enough space to render a component or not, i.e. the responsiveness.

There are 5 different layout areas, with the `center` area being the primary one. It is typically where the visual marker components are positioned. On each side of the center area, there is another area on which a component can be positioned (docked) at. They are referred to as `top`, `bottom`, `left` and `right`.

Most components should be built to be positioned at any of the 5 different areas, but it may make more sense for certain components to be primarily either in the center or at the sides.

## Size (physical size)

The default physical size is equal to that of the container (element) for the chart.

By explicitly setting a size it is possible to override both width and height of the container. Either width or height, or both can be specified.

The input value is specified as a number and represent the size in pixels.

## Logical size

Logical size represent the size given to the dock layout to work with. If the logical size is different then the physical size (size of the container or the size property), then scaling is applied to the components to fit into the physical size.

The default logical size is equal to the physical size.

The input value is specified as a number and represent the size in pixels.

## Dock area

Each of the side areas can take a certain amount of space from the center area. If there is not enough space available for the center area, either in vertical or horizontal direction, the layout engine must remove one or more of the components docked at the side.

It is possible to control the amount of space required by the center area with properties. By setting `minWidthRatio` and/or `minHeightRatio` to a value between 0 and 1, the available size is set as a ratio of the logical size. With 1 meaning all logical size will go the center area, as such no components docked at the side will be rendered. 0 means that components docked at the side take as much space as needed from the center area.

When configured with either `minWidth/minHeight` or `minWidthRatio/minHeightRatio`, the minimum required space of the center area is set to that size. However the center area can never be larger then logical size and will clamp to logical size. If `minWidth` and `minWidthRatio` are set, the absolute size from `minWidth` has precedence over `minWidthRatio`.

## Example

```js
dockLayout: {
  logicalSize: {
    width: 150,
    height: 150,
    preserveAspectRatio: false
  },
  size: {
    width: 100,
    height: 100
  },
  dock: {
    center: {
      minWidthRatio: 0.5,
      minHeightRatio: 0.5
    }
  }
}
```

## API reference - Table of contents

```js
dockLayout: {
  size: { // Physical size. Optional.
    width: 3.14, // Width in pixels. Optional.
    height: 3.14, // Height in pixels. Optional.
  },
  logicalSize: { // Logical size. Optional.
    width: 3.14, // Width in pixels. Optional.
    height: 3.14, // Height in pixels. Optional.
    preserveAspectRatio: false, // If true, takes the smallest ratio of width/height between logical and physical size ( physical / logical ).. Default: false. Optional.
  },
  center: { //  Optional.
    minWidthRatio: 0.5, // Value between 0 and 1. Default: 0.5. Optional.
    minHeightRatio: 0.5, // Value between 0 and 1. Default: 0.5. Optional.
    minWidth: 3.14, // Width in pixels. Optional.
    minHeight: 3.14, // Height in pixels. Optional.
  },
}
```
