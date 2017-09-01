# `legend-seq` component

## Example

```js
{
  type: 'legend-seq',
  scale: 'color',
  dock: 'top', 
  settings: {
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

## API reference - Table of contents



```js
settings: {
  padding: { //  Optional.
    left: 5, //  Default: 5. Optional.
    right: 5, //  Default: 5. Optional.
    top: 5, //  Default: 5. Optional.
    bottom: 5, //  Default: 5. Optional.
  },
  legend: { // Legend gradient settings. Optional.
    size: 15, // Size in pixels of the legend, if vertical is the width and height otherwise. Default: 15. Optional.
    length: 1, // A value in the range 0-1 indicating the length of the legend node. Default: 1. Optional.
    maxLengthPx: 250, // Max length in pixels. Default: 250. Optional.
    align: 0.5, // A value in the range 0-1 indicating horizontal alignment of the legend's content. 0 aligns to the left, 1 to the right.. Default: 0.5. Optional.
    justify: 0, // A value in the range 0-1 indicating vertical alignment of the legend's content. 0 aligns to the top, 1 to the bottom.. Default: 0. Optional.
  },
  ticks: { //  Optional.
    label: () => {}, // Function applied to all tick values, returned values are used as labels. Optional.
    fill: '#595959', //  Default: '#595959'. Optional.
    fontSize: '12px', //  Default: '12px'. Optional.
    fontFamily: 'Arial', //  Default: 'Arial'. Optional.
    maxLengthPx: 150, // Max length in pixels. Default: 150. Optional.
    anchor: 'right', // Where to anchor the ticks in relation to the legend node, supported values are [top, bottom, left and right]. Default: 'right'. Optional.
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
  },
}
```
