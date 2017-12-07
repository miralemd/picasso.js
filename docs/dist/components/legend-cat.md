# `legend-cat` (Static categorical Color Legend) component [*EXPERIMENTAL*]

A component that renders a static categorical color legend

## Component settings

```js
{
  type: 'legend-cat', // Required
  scale: 'A_scale', // A scale. Required
  dock: 'center', // Docking of the component, top, right, bottom or left // Optional
  settings: {  // Optional
    anchor: 'left', // Is used to align items in the component, left or right // Optional
    direction: 'vertical', // Direction of rendering, 'horizontal' or 'vertical'. // Optional
    layout: {  // Optional
      // Layout setting for the items
      mode: 'stack', // Use `stack` to let each item only take as much space a required or else each item will take a fixed amount of space to give each item equal distance between each other // Optional
      size: 1, // Only enabled non-stack mode. Is either row or column count, depending on the directional setting (i.e. vertical direction and size is column count) // Optional
    },
    item: {  // Optional
      // Items settings
      label: {  // Optional
        // Label settings, the value is derived from the scale
        maxWidth: 136, // Maximum width of each label in px // Optional
        fontSize: '12px', // Font size of label items // Optional
        fontFamily: 'Arial', // Font family of label items // Optional
        fill: '#595959', // Font color of label items // Optional
        breakWord: 'none', // Word break rule, how to apply line break if label text overflow it's maxWidth prop. Either `break-word` or `break-all` // Optional
        maxLines: 2, // Max number of lines allowed if label is broken into multiple lines (only applicable with wordBreak) // Optional
        hyphens: 'auto', // How words should be hyphenated when text wraps across multiple lines (only applicable with wordBreak) // Optional
        lineHeight: 1.2, // A multiplier defining the distance between lines (only applicable with wordBreak) // Optional
      },
      margin: {  // Optional
        // Margin settings
        top: 0, // Top margin // Optional
        right: 5, // Right margin // Optional
        bottom: 5, // Bottom margin // Optional
        left: 5, // Left margin // Optional
      },
      shape: /* object | string */,  // Optional
      show: true,  // Optional
    },
    title: {  // Optional
      // Title settings
      maxWidth: 156, // Maximum width of each label in px // Optional
      fontSize: '12px', // Font size of label items // Optional
      fontFamily: 'Arial', // Font family of label items // Optional
      fill: '#595959', // Font color of label items // Optional
      breakWord: 'none', // Word break rule, how to apply line break if label text overflow it's maxWidth prop. Either `break-word` or `break-all` // Optional
      maxLines: 2, // Max number of lines allowed if label is broken into multiple lines (only applicable with wordBreak) // Optional
      hyphens: 'auto', // How words should be hyphenated when text wraps across multiple lines (only applicable with wordBreak) // Optional
      lineHeight: 1.2, // A multiplier defining the distance between lines (only applicable with wordBreak) // Optional
      text: /* string */, // Override title text. Defaults to the title of the data field // Optional
      margin: {  // Optional
        // Margin settings
        top: 0, // Top margin // Optional
        right: 5, // Right margin // Optional
        bottom: 5, // Bottom margin // Optional
        left: 5, // Left margin // Optional
      },
    },
    buttons: {  // Optional
      // Button settings
      show: true, // Show the scroll/paging buttons (will still auto hide when not needed) // Optional
      buttonSpacing: 8, // The margin between the two buttons // Optional
      spacing: 0, // The margin between the start or end of the legend and the buttons, depending if the button are position to the left, right or bottom // Optional
      width: 32, // The width of the buttons // Optional
      height: 24, // The height of the buttons // Optional
      rect: {  // Optional
        // Settings for the rect of the buttons
        fill: 'transparent', // Fill color // Optional
        stroke: 'grey', // Stroke color // Optional
        strokeWidth: 0, // Stroke width in pixels // Optional
      },
      symbol: {  // Optional
        // Settings for the symbol of the buttons
        fill: 'grey', // Symbol fill color // Optional
        stroke: 'grey', // Stroke color // Optional
        strokeWidth: 2, // Stroke width in pixels // Optional
      },
      &#x27;rect:disabled&#x27;: {  // Optional
        // Settings for the disabled rect of the buttons
        fill: 'transparent', // Fill color // Optional
        stroke: 'lightgrey', // Stroke color // Optional
        strokeWidth: 0, // Stroke width in pixels // Optional
      },
      &#x27;symbol:disabled&#x27;: {  // Optional
        // Settings for the disabled symbol of the buttons
        fill: 'lightgrey', // Symbol fill color // Optional
        stroke: 'grey', // Stroke color // Optional
        strokeWidth: 2, // Stroke width in pixels // Optional
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
