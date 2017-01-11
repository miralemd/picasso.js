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


## {{anchor 'interceptions' }} Manipulation interceptions

Some of the manipulation methods can be intercepted and have its data filtered before being handled further, this could be useful when e.g. it is desirable to block certain values from being brushed.

### Block certain values from getting added

Values can be blocked from being added to the brush by intercepting the `add-values` event and filtering out the unwanted values.
The following will remove the value 'Bike': 

```js
brush.intercept('add-values', items => {
  return items.filter(item => item.value !== 'Bike');
});
```

The values returned from the interceptor are used as the argument to the next interceptor in the chain:

```js
brush.intercept('add-values', items => {
  // items === [{ key: 'products', value: 'Cars' }]
  return items.concat([{ key: 'products', 'Always me' }]);
});
```

When calling `addValues`, the interceptors above will be called, which will remove 'Bike' and add 'Always me':
```js
brush.addValues([
  { key: 'products', 'Bike' },
  { key: 'products', 'Cars' }
]);
```

## API reference

{{>magic ctx='core.brush.brush-js'}}
