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

## Configuration

```js
{
  type: 'text', // Optional
  text: /* string | function */, 
  settings: { 
    paddingStart: 5, // Optional
    paddingEnd: 5, // Optional
    paddingLeft: 0, // Optional
    paddingRight: 0, // Optional
    anchor: 'center', // Where to v- or h-align the text. Supports `left`, `right`, `top`, `bottom` and `center` // Optional
    join: ', ', // String to add when joining titles from multiple sources // Optional
    maxLengthPx: /* number */, // Limit the text length to this value in pixels // Optional
    style: {  // Optional
      // Style properties for the text
      fontSize: /* string */, // Optional
      fontFamily: /* string */, // Optional
      fill: /* string */, // Optional
    },
  },
}
```

