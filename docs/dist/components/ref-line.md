# `ref-line` (Reference Lines) component

A component that renders reference lines according to configuration

## Component settings

```js
settings: {
  style: refline-generic-style, // x coordinate. Default: refline-generic-style. Optional.
  x: refline-line[], // lines along X. Default: refline-line[]. Optional.
  y: refline-line[], // lines along Y. Default: refline-line[]. Optional.
}
```
```js
refline-generic-style: {
  oob: refline-oob-style, // Style for out of bounds object (oob). Default: refline-oob-style. Optional.
  line: refline-line, // Generic style for lines. Default: refline-line. Optional.
}
```
```js
refline-oob-style: {
  show: true, // Show out of bounds items. Default: true. Optional.
  type: 'foo', // EXPERIMENTAL:  Set this to 'arc' for an experimental out of bounds shape (only works with SVG). Optional.
  width: 10, // Width of the out of bounds object. Default: 10. Optional.
  fill: '#1A1A1A', // Fill color of the OOB object. Default: '#1A1A1A'. Optional.
  stroke: 'transparent', // Stroke of the OOB object. Default: 'transparent'. Optional.
  strokeWidth: 0, // Stroke width of the OOB object. Default: 0. Optional.
  opacity: 1, // Opacity of the OOB object. Default: 1. Optional.
  opacity: refline-generic-text, // Text configuration for out of bounds. Default: refline-generic-text. Optional.
  triangle: refline-generic-object, // The triangle in OOB. Default: refline-generic-object. Optional.
  padding: { // Padding on X. Optional.
    x: 28, // Padding on X. Default: 28. Optional.
    y: 5, // Padding on X. Default: 5. Optional.
  },
}
```
```js
refline-generic-text: {
  text: '', // Text (if applicable). Default: ''. Optional.
  fontSize: '12px', // Font size (if applicable). Default: '12px'. Optional.
  fontFamily: 'Arial', // Font family. Default: 'Arial'. Optional.
  fill: '#fff', // Fill color. Default: '#fff'. Optional.
  stroke: 'transparent', // Stroke. Default: 'transparent'. Optional.
  strokeWidth: 0, // Stroke width. Default: 0. Optional.
  opacity: 1, // Opacity. Default: 1. Optional.
}
```
```js
refline-line: {
  value: , // The value of the reference line. If a scale is specified, it is applied..
  scale: , // Scale to use (if undefined will use normalized value 0-1). Optional.
  style: refline-generic-object, // The style of the line. Default: refline-generic-object. Optional.
  style: refline-line-label, // The label style of the line. Default: refline-line-label. Optional.
}
```
```js
refline-line-label: {
  padding: 5, // Padding inside the label. Default: 5.
  text: '', // Text. Default: ''. Optional.
  fontSize: '12px', // Font size. Default: '12px'. Optional.
  fontFamily: 'Arial', // Font family. Default: 'Arial'. Optional.
  stroke: 'transparent', // Stroke. Default: 'transparent'. Optional.
  strokeWidth: 0, // Stroke width. Default: 0. Optional.
  opacity: 1, // Opacity. Default: 1. Optional.
  align: 0, // Alignment property left to right (0 = left, 1 = right). Also supports string ('left', 'center', 'middle', 'right'). Default: 0. Optional.
  vAlign: 0, // Alignment property top to bottom (0 = top, 1 = bottom). Also supports string ('top', 'center', 'middle', 'bottom'). Default: 0. Optional.
  background: refline-line-label-background, // The background style (rect behind text). Default: refline-line-label-background. Optional.
}
```
```js
refline-line-label-background: {
  fill: '#fff', // Fill color. Default: '#fff'. Optional.
  stroke: 'transparent', // Stroke. Default: 'transparent'. Optional.
  strokeWidth: 0, // Stroke width. Default: 0. Optional.
  opacity: 0.5, // Opacity. Default: 0.5. Optional.
}
```
```js
refline-generic-object: {
  fill: '#fff', // Fill color. Default: '#fff'. Optional.
  stroke: 'transparent', // Stroke. Default: 'transparent'. Optional.
  strokeWidth: 0, // Stroke width. Default: 0. Optional.
  opacity: 1, // Opacity. Default: 1. Optional.
}
```

