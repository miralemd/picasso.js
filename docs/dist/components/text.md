# `text` component

## Basic example

```js
{
  type: 'text',
  text: 'my title',
  dock: 'left',
  settings: {
    paddingStart: 15,
    anchor: 'left',
    style: {
      fill: 'red'
    }
  }
}
```

## API reference - Table of contents



```js
text-component: {
  type: 'foo', // "text".
  text: 'foo', // 
  settings: , // Text settings.
}
```
```js
settings: {
  settings: { // Labels settings. Optional.
    paddingStart: 5, //  Default: 5. Optional.
    paddingEnd: 5, //  Default: 5. Optional.
    paddingLeft: 0, //  Default: 0. Optional.
    paddingRight: 0, //  Default: 0. Optional.
    anchor: 'center', // Where to v- or h-align the text. Supports `left`, `right`, `top`, `bottom` and `center`. Default: 'center'. Optional.
    join: ', ', // String to add when joining titles from multiple sources. Default: ', '. Optional.
    maxLengthPx: 3.14, // Limit the text length to this value in pixels. Optional.
    style: { // Style properties for the text. Optional.
      fontSize: 'foo', //  Optional.
      fontFamily: 'foo', //  Optional.
      fill: 'foo', //  Optional.
    },
  },
}
```
