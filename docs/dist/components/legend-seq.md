# `legend-seq` component

## Example

```js
{
  type: 'legend-seq',
  dock: 'top', 
  settings: {
    fill: 'colorScale',
    major: 'measureScale',
    ticks: {
      label: (val, i, ary) => {
        let temp = ['Cold', 'Hot'];
        return temp[i % 2];
      },
    },
    title: { 
      text: 'ALL YOUR BASES BELONG TO US'
    }
  }
}
```

## Example - Enable range selection

To enable range selelection on a sequential legend, the legend component exposes two nodes that can be reference by the brush-range component as a target.
This reference enables the brush-range component to limit the target area to a sub-area of the legends dock area.

```js
chartSettings = {
  interactions: [
    ... // Setup required brush-range interactions here.
  ],
  scales: {
    myColorScale: { source: '0/1', type: 'color' },
    myLinearScale: { source: '0/1', type: 'linear' },
  },
  components: [
    {
      type: 'legend-seq',
      dock: 'right',
      key: 'myLegend' // Reference by brush-range component,
      settings: {
        fill: 'myColorScale',
        major: 'myLinearScale'
      }
    },
    {
      type: 'brush-range',
      key: 'myBrushRange',
      dock: '@myLegend', // Legend reference
      settings: {
        brush: 'highlight',
        scale: 'myLinearScale',
        direction: 'vertical',
        bubbles: {
          align: 'start',
          placement: 'outside' // Render bubbles outside the @myLegend dock area
        },
        target: {
          selector: '[id="legend-seq-target"]', // Define the target area. Must be reference a node from @myLegend
          fillSelector: '[id="legend-seq-ticks"]', // Define the target fill area. Must be reference a node from @myLegend
          fill: 'rgba(82,204,82,0.3)',
        }
      },
  }]
}
```

## API reference - Table of contents



```js
settings: {
  fill: 'foo', // Reference to definition of sequential color scale.
  major: 'foo', // Reference to definition of linear scale.
  size: 15, // Size in pixels of the legend, if vertical is the width and height otherwise. Default: 15. Optional.
  length: 1, // A value in the range 0-1 indicating the length of the legend node. Default: 1. Optional.
  maxLengthPx: 250, // Max length in pixels. Default: 250. Optional.
  align: 0.5, // A value in the range 0-1 indicating horizontal alignment of the legend's content. 0 aligns to the left, 1 to the right.. Default: 0.5. Optional.
  justify: 0, // A value in the range 0-1 indicating vertical alignment of the legend's content. 0 aligns to the top, 1 to the bottom.. Default: 0. Optional.
  padding: { //  Optional.
    left: 5, //  Default: 5. Optional.
    right: 5, //  Default: 5. Optional.
    top: 5, //  Default: 5. Optional.
    bottom: 5, //  Default: 5. Optional.
  },
  tick: { //  Optional.
    label: () => {}, // Function applied to all tick values, returned values are used as labels. Optional.
    fill: '#595959', //  Default: '#595959'. Optional.
    fontSize: '12px', //  Default: '12px'. Optional.
    fontFamily: 'Arial', //  Default: 'Arial'. Optional.
    maxLengthPx: 150, // Max length in pixels. Default: 150. Optional.
    anchor: 'right', // Where to anchor the tick in relation to the legend node, supported values are [top, bottom, left and right]. Default: 'right'. Optional.
    padding: 5, // padding in pixels to the legend node. Default: 5. Optional.
  },
  title: { // Title settings. Optional.
    show: true, // Toggle title on/off. Default: true. Optional.
    text: '', // The value of the title. Default: ''. Optional.
    fill: '#595959', //  Default: '#595959'. Optional.
    fontSize: '12px', //  Default: '12px'. Optional.
    fontFamily: 'Arial', //  Default: 'Arial'. Optional.
    maxLengthPx: 100, // Max length in pixels. Default: 100. Optional.
    padding: 5, // padding in pixels to the legend node. Default: 5. Optional.
    anchor: 'top', // Where to anchor the title in relation to the legend node, supported values are [top, left and right]. Default: 'top'. Optional.
    wordBreak: 'none', // How overflowing title is handled, if it should insert line breaks at word boundries (break-word) or character boundries (break-all). Default: 'none'. Optional.
    hyphens: 'auto', // How words should be hyphenated when text wraps across multiple lines (only applicable with wordBreak). Default: 'auto'. Optional.
    maxLines: 2, // Number of allowed lines if title contains line breaks (only applicable with wordBreak). Default: 2. Optional.
    lineHeight: 1.2, // A multiplier defining the distance between lines (only applicable with wordBreak). Default: 1.2. Optional.
  },
}
```
