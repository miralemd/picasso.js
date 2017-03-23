# `box-marker` component

## Component settings

### Data definition

```js
data: {
  min: 3.14, // min. Optional.
  max: 3.14, // max. Optional.
  start: 3.14, // start. Optional.
  end: 3.14, // end. Optional.
  med: 3.14, // med. Optional.
}
```


### Settings

```js
settings: {
  major: { // 
    scale: 'foo', // The scale to use along the major axis.
  },
  minor: { // 
    scale: 'foo', // The scale to use along the minor axis.
  },
  orientation: 'vertical', //  Default: 'vertical'. Optional.
  box: { //  Optional.
    show: true, //  Default: true. Optional.
    fill: '#fff', //  Default: '#fff'. Optional.
    stroke: '#000', //  Default: '#000'. Optional.
    strokeWidth: 1, //  Default: 1. Optional.
    width: 1, //  Default: 1. Optional.
    maxWidth: 100, //  Default: 100. Optional.
    minWidth: 5, //  Default: 5. Optional.
  },
  line: { //  Optional.
    show: true, //  Default: true. Optional.
  },
  stroke: '#000', //  Default: '#000'. Optional.
  strokeWidth: 1, //  Default: 1. Optional.
  whisker: { //  Optional.
    show: true, //  Default: true. Optional.
    stroke: '#000', //  Default: '#000'. Optional.
    strokeWidth: 1, //  Default: 1. Optional.
    width: 1, //  Default: 1. Optional.
  },
  median: { //  Optional.
    show: true, //  Default: true. Optional.
    stroke: '#000', //  Default: '#000'. Optional.
    strokeWidth: 1, //  Default: 1. Optional.
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
