## Summary

A generic implementation to track brushed values.

## {{anchor 'events'}} Events

Three types of events are emitted:

```js
brush.on('start', () => {
  console.log('started')
});

brush.on('update', () => {
  console.log('updated')
});

brush.on('end', () => {
  console.log('ended')
});
```

## API reference

{{>magic ctx='core.brush.brush-js'}}
