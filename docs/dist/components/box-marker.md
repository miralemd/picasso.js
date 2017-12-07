# `box-marker` component

## Component settings

### Data definition

```js
data: {
  min: /* number */, // min // Optional
  max: /* number */, // max // Optional
  start: /* number */, // start // Optional
  end: /* number */, // end // Optional
  med: /* number */, // med // Optional
}
```


### Settings

```js
settings: {
  major: { 
    scale: /* string */, // The scale to use along the major axis
    ref: 'self',  // Optional
  },
  minor: { 
    scale: /* string */, // The scale to use along the minor axis
  },
  orientation: 'vertical', // Optional
  box: {  // Optional
    show: true, // Optional
    fill: '#fff', // Optional
    stroke: '#000', // Optional
    strokeWidth: 1, // Optional
    width: 1, // Optional
    maxWidthPx: 100, // Optional
    minWidthPx: 1, // Optional
    minHeightPx: 1, // Optional
  },
  line: {  // Optional
    show: true, // Optional
  },
  stroke: '#000', // Optional
  strokeWidth: 1, // Optional
  whisker: {  // Optional
    show: true, // Optional
    stroke: '#000', // Optional
    strokeWidth: 1, // Optional
    width: 1, // Optional
  },
  median: {  // Optional
    show: true, // Optional
    stroke: '#000', // Optional
    strokeWidth: 1, // Optional
  },
}
```


## Example

```js
{
  type: "box-marker",
  data: {
   mapTo: {
     min: { source: "lowest sales" },
     start: { source: "low sales" },
     med: { source: "med sales" },
     end: { source: "high sales" },
     max: { source: "highest sales" },
   },
   groupBy: {
     source: "products"
   }
  },
  settings: {
    major: {
      scale: 'x'
    },
    minor: {
      scale: 'y'
    },
    box: {
      stroke: '#fff',
      width: 0.8,
      fill: '#4477aa'
    }
  }
}
```
