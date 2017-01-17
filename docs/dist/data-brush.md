## Summary

A generic implementation to track brushed values.

## <a name='events' href='#events'>#</a> Events

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


## <a name='interceptions' href='#interceptions'>#</a> Manipulation interceptions

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

#### <a name='brush' href='#brush'>#</a> **brush**()

|Name|Type|Description|Optional|
|----|----|-----------|--------|

The brush context  
#### <a name='brush.start' href='#brush.start'>#</a> **brush.start**()


Starts this brush context

Starts this brush context and emits a &#x27;start&#x27; event if it is not already started.  
#### <a name='brush.end' href='#brush.end'>#</a> **brush.end**()


Ends this brush context

Ends this brush context and emits an &#x27;end&#x27; event if it is not already ended.  
#### <a name='brush.isActive' href='#brush.isActive'>#</a> **brush.isActive**()

|Name|Type|Description|Optional|
|----|----|-----------|--------|
| Returns | boolean |  | ... |

Checks if this brush is activated

Returns true if started, false otherwise  
#### <a name='brush.clear' href='#brush.clear'>#</a> **brush.clear**()


Clears this brush context  
#### <a name='brush.brushes' href='#brush.brushes'>#</a> **brush.brushes**()

|Name|Type|Description|Optional|
|----|----|-----------|--------|
| Returns | object |  | ... |

Returns all brushes within this context  
#### <a name='brush.addValue' href='#brush.addValue'>#</a> **brush.addValue**(*string key, string value*)

|Name|Type|Description|Optional|
|----|----|-----------|--------|
| key | string | An identifier that represents the data source of the value |No|
| value | string | The value to add |No|

Adds a primitive value to this brush context

If this brush context is not started, a &#x27;start&#x27; event is emitted.
If the state of the brush changes, ie. if the added value does not already exist, an &#x27;update&#x27; event is emitted.  
#### Examples

```js
brush.addValue('countries', 'Sweden');
brush.addValue('/qHyperCube/qDimensionInfo/0', 3);
```
#### <a name='brush.addValues' href='#brush.addValues'>#</a> **brush.addValues**(*Array.&lt;object&gt; items*)

|Name|Type|Description|Optional|
|----|----|-----------|--------|
| items | Array.&lt;object&gt; | Items to add |No|

  
#### <a name='brush.setValues' href='#brush.setValues'>#</a> **brush.setValues**(*Array.&lt;object&gt; items*)

|Name|Type|Description|Optional|
|----|----|-----------|--------|
| items | Array.&lt;object&gt; | Items to set |No|

  
#### <a name='brush.removeValue' href='#brush.removeValue'>#</a> **brush.removeValue**(*string key, string value*)

|Name|Type|Description|Optional|
|----|----|-----------|--------|
| key | string | An identifier that represents the data source of the value |No|
| value | string | The value to remove |No|

Removes a primitive values from this brush context

If the state of the brush changes, ie. if the removed value does exist, an &#x27;update&#x27; event is emitted.  
#### Examples

```js
brush.removeValue('countries', 'Sweden');
```
#### <a name='brush.removeValues' href='#brush.removeValues'>#</a> **brush.removeValues**(*Array.&lt;object&gt; items*)

|Name|Type|Description|Optional|
|----|----|-----------|--------|
| items | Array.&lt;object&gt; | Items to remove |No|

  
#### <a name='brush.toggleValue' href='#brush.toggleValue'>#</a> **brush.toggleValue**(*string key, string value*)

|Name|Type|Description|Optional|
|----|----|-----------|--------|
| key | string | An identifier that represents the data source of the value |No|
| value | string | The value to toggle |No|

Toggles a primitive value in this brush context

If the given value exist in this brush context, it will be removed. If it does not exist it will be added.  
#### Examples

```js
brush.toggleValue('countries', 'Sweden');
```
#### <a name='brush.toggleValues' href='#brush.toggleValues'>#</a> **brush.toggleValues**(*Array.&lt;object&gt; items*)

|Name|Type|Description|Optional|
|----|----|-----------|--------|
| items | Array.&lt;object&gt; | Items to toggle |No|

  
#### <a name='brush.containsValue' href='#brush.containsValue'>#</a> **brush.containsValue**(*string key, string value*)

|Name|Type|Description|Optional|
|----|----|-----------|--------|
| key | string | An identifier that represents the data source of the value |No|
| value | string | The value to check for |No|
| Returns | boolean |  | ... |

Checks if a certain value exists in this brush context

Returns true if the values exists for the provided key, returns false otherwise.  
#### Examples

```js
brush.addValue('countries', 'Sweden');
brush.containsValue('countries', 'Sweden'); // true
brush.toggleValue('countries', 'Sweden'); // remove 'Sweden'
brush.containsValue('countries', 'Sweden'); // false
```
#### <a name='brush.intercept' href='#brush.intercept'>#</a> **brush.intercept**(*string name, function ic*)

|Name|Type|Description|Optional|
|----|----|-----------|--------|
| name | string | Name of the event to intercept |No|
| ic | function | Handler to call before event is triggered |No|

Adds an event interceptor  
#### Examples

```js
brush.intercept('add-values', items => {
 console.log('about to add the following items', items);
 return items;
});
```
