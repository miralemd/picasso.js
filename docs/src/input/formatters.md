# Formatters


## Chart configuration

```js
formatters: {
  <name>: { /* formatter config */ }
}
```

## Examples

### Creating a formatter of a specific type

```js
{
  myFormatter: {
    type: 'd3-number', // the type
    format: '1.0%' // format pattern - this is propagated as argument to the type constructor
  }
}
```

### Creating a formatter from data

```js
{
  myFormatter: {
    data: {
      fields: ['Sales']
    }
  }
}
```

The above configuration will use the formatter defined on the _Sales_ `field` instance, see [field.formatter](./data.md#field.formatter).
