# `box-marker` component

## Component settings

### Data definition

{{>struct entries.component--box-marker.entries.data name='data'}}

### Settings

{{>struct entries.component--box-marker.entries.settings name='settings'}}

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
