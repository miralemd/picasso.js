# `legend-cat` (Static categorical Color Legend) component [*EXPERIMENTAL*]

A component that renders a static categorical color legend

## Component settings

```js
component: {
  type: 'legend-cat', // Required. Default: 'legend-cat'.
  scale: 'A_scale', // A scale. Required. Default: 'A_scale'.
  dock: 'center', // Docking of the component, top, right, bottom or left. Default: 'center'. Optional.
  align: 'left', // Alignment of items in the component, left or right. Default: 'left'. Optional.
  direction: 'vertical', // Direction of rendering, 'horizontal' or 'vertical'.. Default: 'vertical'. Optional.
  item: { // Items settings. Optional.
    maxWidthPx: 150, // Maximum width of each item in px. Default: 150. Optional.
    fontSize: '12px', // Font size of label items. Default: '12px'. Optional.
    fontFamily: 'Arial', // Font family of label items. Default: 'Arial'. Optional.
    fill: '#595959', // Font color of label items. Default: '#595959'. Optional.
    margin: { // Margin settings. Optional.
      top: 0, // Top margin. Default: 0. Optional.
      right: 5, // Right margin. Default: 5. Optional.
      bottom: 5, // Bottom margin. Default: 5. Optional.
      left: 5, // Left margin. Default: 5. Optional.
    },
  },
  title: { // Title settings. Optional.
    show: true, // Show the title. Default: true. Optional.
    maxWidthPx: 200, // Maximum width of the title item. Default: 200. Optional.
    fontSize: '12px', // Font size of title. Default: '12px'. Optional.
    fontFamily: 'Arial', // Font family of title. Default: 'Arial'. Optional.
    fill: '#595959', // Font color of title. Default: '#595959'. Optional.
    text: 'foo', // Override title text. Defaults to the title of the data field. Optional.
    margin: { // Margin settings. Optional.
      top: 0, // Top margin. Default: 0. Optional.
      right: 5, // Right margin. Default: 5. Optional.
      bottom: 5, // Bottom margin. Default: 5. Optional.
      left: 5, // Left margin. Default: 5. Optional.
    },
  },
}
```

