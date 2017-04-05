# `box-marker` component

## Component settings

### Data definition

{{>magic ctx='core.chart-components.markers.box.box-js.data'}}


### Settings

{{>magic ctx='core.chart-components.markers.box.box-js.settings'}}

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