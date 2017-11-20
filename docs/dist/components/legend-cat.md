# `legend-cat` (Static categorical Color Legend) component [*EXPERIMENTAL*]

A component that renders a static categorical color legend

## Component settings

```js
component: {
  type: 'legend-cat', // Required. Default: 'legend-cat'.
  scale: 'A_scale', // A scale. Required. Default: 'A_scale'.
  dock: 'center', // Docking of the component, top, right, bottom or left. Default: 'center'. Optional.
  settings: { //  Optional.
    anchor: 'left', // Is used to align items in the component, left or right. Default: 'left'. Optional.
    direction: 'vertical', // Direction of rendering, 'horizontal' or 'vertical'.. Default: 'vertical'. Optional.
    layout: { // Layout setting for the items. Optional.
      mode: 'stack', // Use `stack` to let each item only take as much space a required or else each item will take a fixed amount of space to give each item equal distance between each other. Default: 'stack'. Optional.
      size: 1, // Only enabled non-stack mode. Is either row or column count, depending on the directional setting (i.e. vertical direction and size is column count). Default: 1. Optional.
    },
    item: { // Items settings. Optional.
      label: { // Label settings, the value is derived from the scale. Optional.
        maxWidth: 136, // Maximum width of each label in px. Default: 136. Optional.
        fontSize: '12px', // Font size of label items. Default: '12px'. Optional.
        fontFamily: 'Arial', // Font family of label items. Default: 'Arial'. Optional.
        fill: '#595959', // Font color of label items. Default: '#595959'. Optional.
        breakWord: 'none', // Word break rule, how to apply line break if label text overflow it's maxWidth prop. Either `break-word` or `break-all`. Default: 'none'. Optional.
        maxLines: 2, // Max number of lines allowed if label is broken into multiple lines (only applicable with wordBreak). Default: 2. Optional.
        hyphens: 'auto', // How words should be hyphenated when text wraps across multiple lines (only applicable with wordBreak). Default: 'auto'. Optional.
        lineHeight: 1.2, // A multiplier defining the distance between lines (only applicable with wordBreak). Default: 1.2. Optional.
      },
      margin: { // Margin settings. Optional.
        top: 0, // Top margin. Default: 0. Optional.
        right: 5, // Right margin. Default: 5. Optional.
        bottom: 5, // Bottom margin. Default: 5. Optional.
        left: 5, // Left margin. Default: 5. Optional.
      },
      shape: { // Shape definition or shape type. Each shape may have their own unique properties that can also be set as part of the shape object.. Optional.
        type: 'square', // Shape type. Default: 'square'. Optional.
        fill: 'foo', // Fill of shape. Defaults to scale color if avaiable.. Optional.
        stroke: 'foo', // Stroke of shape. Defaults to scale color if avaiable.. Optional.
        strokeWidth: 1, // Stroke width of shape.. Default: 1. Optional.
      },
      show: true, // Set to 'false' to hide the current item. Default: true. Optional.
    },
    title: { // Title settings. Optional.
      maxWidth: 156, // Maximum width of each label in px. Default: 156. Optional.
      fontSize: '12px', // Font size of label items. Default: '12px'. Optional.
      fontFamily: 'Arial', // Font family of label items. Default: 'Arial'. Optional.
      fill: '#595959', // Font color of label items. Default: '#595959'. Optional.
      breakWord: 'none', // Word break rule, how to apply line break if label text overflow it's maxWidth prop. Either `break-word` or `break-all`. Default: 'none'. Optional.
      maxLines: 2, // Max number of lines allowed if label is broken into multiple lines (only applicable with wordBreak). Default: 2. Optional.
      hyphens: 'auto', // How words should be hyphenated when text wraps across multiple lines (only applicable with wordBreak). Default: 'auto'. Optional.
      lineHeight: 1.2, // A multiplier defining the distance between lines (only applicable with wordBreak). Default: 1.2. Optional.
      text: 'foo', // Override title text. Defaults to the title of the data field. Optional.
      margin: { // Margin settings. Optional.
        top: 0, // Top margin. Default: 0. Optional.
        right: 5, // Right margin. Default: 5. Optional.
        bottom: 5, // Bottom margin. Default: 5. Optional.
        left: 5, // Left margin. Default: 5. Optional.
      },
    },
    buttons: { // Button settings. Optional.
      show: true, // Show the scroll/paging buttons (will still auto hide when not needed). Default: true. Optional.
      rect: { // Settings for the rect of the buttons. Optional.
        fill: 'transparent', // Fill color. Default: 'transparent'. Optional.
        stroke: 'grey', // Stroke color. Default: 'grey'. Optional.
        strokeWidth: 0, // Stroke width in pixels. Default: 0. Optional.
      },
      symbol: { // Settings for the symbol of the buttons. Optional.
        fill: 'grey', // Symbol fill color. Default: 'grey'. Optional.
        stroke: 'grey', // Stroke color. Default: 'grey'. Optional.
        strokeWidth: 2, // Stroke width in pixels. Default: 2. Optional.
      },
      'rect:disabled': { // Settings for the disabled rect of the buttons. Optional.
        fill: 'transparent', // Fill color. Default: 'transparent'. Optional.
        stroke: 'lightgrey', // Stroke color. Default: 'lightgrey'. Optional.
        strokeWidth: 0, // Stroke width in pixels. Default: 0. Optional.
      },
      'symbol:disabled': { // Settings for the disabled symbol of the buttons. Optional.
        fill: 'lightgrey', // Symbol fill color. Default: 'lightgrey'. Optional.
        stroke: 'grey', // Stroke color. Default: 'grey'. Optional.
        strokeWidth: 2, // Stroke width in pixels. Default: 2. Optional.
      },
    },
  },
}
```

## Events

The categorical color legend component handles two type of events by default, `tap` and `resetindex` (*DEPRECATED*).

### `tap` event

Requires an event with `center: { x: 0, y: 0 }`-object for evaluating button presses.

```js
  picassoInstance.component('<key value of legend-cat>').emit('tap', { center: { x: 0, y: 0 } });
  ```

### `scroll` event

Trigger a manual scroll by passing the scroll length as a parameter (default length is 3).
This event is to allow mousewheel scroll and scroll on panning.

  ```js
  picassoInstance.component('<key value of legend-cat>').emit('scroll', 3);
  ```

### `resetindex` event *DEPRECATED*

Will reset the paging index, but will *NOT* re-render the component, needs to be done by itself.
To use this, make sure the component has a `key` (it needs that for the paging to work anyway), and use it like this:

```js
const instance = picasso.chart({ /* settings */ });

window.pic.component('<key value of legend-cat>').emit('resetindex');
```

Please note that this event is *DEPRECATED* and will be removed in future releases.
