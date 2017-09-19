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

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|

The brush context  
#### <a name='brush.start' href='#brush.start'>#</a> **brush.start**()


Starts this brush context

Starts this brush context and emits a &#x27;start&#x27; event if it is not already started.  
#### <a name='brush.end' href='#brush.end'>#</a> **brush.end**()


Ends this brush context

Ends this brush context and emits an &#x27;end&#x27; event if it is not already ended.  
#### <a name='brush.isActive' href='#brush.isActive'>#</a> **brush.isActive**()

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| Returns | boolean | No | ... | ... |

Checks if this brush is activated

Returns true if started, false otherwise  
#### <a name='brush.clear' href='#brush.clear'>#</a> **brush.clear**()


Clears this brush context  
#### <a name='brush.brushes' href='#brush.brushes'>#</a> **brush.brushes**()

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| Returns | object | No | ... | ... |

Returns all brushes within this context  
#### <a name='brush.addValue' href='#brush.addValue'>#</a> **brush.addValue**(*string key, string value*)

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| key | string | An identifier that represents the data source of the value | No | No |
| value | string | The value to add | No | No |

Adds a primitive value to this brush context

If this brush context is not started, a &#x27;start&#x27; event is emitted.
If the state of the brush changes, ie. if the added value does not already exist, an &#x27;update&#x27; event is emitted.  
#### Examples

```js
brush.addValue('countries', 'Sweden');
brush.addValue('/qHyperCube/qDimensionInfo/0', 3);
```
#### <a name='brush.addValues' href='#brush.addValues'>#</a> **brush.addValues**(*Array.&lt;object&gt; items*)

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| items | Array.&lt;object&gt; | Items to add | No | No |

No description  
#### <a name='brush.setValues' href='#brush.setValues'>#</a> **brush.setValues**(*Array.&lt;object&gt; items*)

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| items | Array.&lt;object&gt; | Items to set | No | No |

No description  
#### <a name='brush.removeValue' href='#brush.removeValue'>#</a> **brush.removeValue**(*string key, string value*)

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| key | string | An identifier that represents the data source of the value | No | No |
| value | string | The value to remove | No | No |

Removes a primitive values from this brush context

If the state of the brush changes, ie. if the removed value does exist, an &#x27;update&#x27; event is emitted.  
#### Examples

```js
brush.removeValue('countries', 'Sweden');
```
#### <a name='brush.removeValues' href='#brush.removeValues'>#</a> **brush.removeValues**(*Array.&lt;object&gt; items*)

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| items | Array.&lt;object&gt; | Items to remove | No | No |

No description  
#### <a name='brush.addAndRemoveValues' href='#brush.addAndRemoveValues'>#</a> **brush.addAndRemoveValues**(*Array.&lt;object&gt; addItems, Array.&lt;object&gt; removeItems*)

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| addItems | Array.&lt;object&gt; | Items to add | No | No |
| removeItems | Array.&lt;object&gt; | Items to remove | No | No |

Add and remove values in a single operation
almost the same as calling addValues and removeValues but only triggers one &#x27;update&#x27; event

If the state of the brush changes, an &#x27;update&#x27; event is emitted.  
#### <a name='brush.toggleValue' href='#brush.toggleValue'>#</a> **brush.toggleValue**(*string key, string value*)

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| key | string | An identifier that represents the data source of the value | No | No |
| value | string | The value to toggle | No | No |

Toggles a primitive value in this brush context

If the given value exist in this brush context, it will be removed. If it does not exist it will be added.  
#### Examples

```js
brush.toggleValue('countries', 'Sweden');
```
#### <a name='brush.toggleValues' href='#brush.toggleValues'>#</a> **brush.toggleValues**(*Array.&lt;object&gt; items*)

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| items | Array.&lt;object&gt; | Items to toggle | No | No |

No description  
#### <a name='brush.containsValue' href='#brush.containsValue'>#</a> **brush.containsValue**(*string key, string value*)

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| key | string | An identifier that represents the data source of the value | No | No |
| value | string | The value to check for | No | No |
| Returns | boolean | No | ... | ... |

Checks if a certain value exists in this brush context

Returns true if the values exists for the provided key, returns false otherwise.  
#### Examples

```js
brush.addValue('countries', 'Sweden');
brush.containsValue('countries', 'Sweden'); // true
brush.toggleValue('countries', 'Sweden'); // remove 'Sweden'
brush.containsValue('countries', 'Sweden'); // false
```
#### <a name='brush.addRange' href='#brush.addRange'>#</a> **brush.addRange**(*string key, object range, number range.min, number range.max*)

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| key | string | An identifier that represents the data source of the range | No | No |
| range | object | The range to add to this brush | No | No |
| range.min | number | Min value of the range | No | No |
| range.max | number | Max value of the range | No | No |

Adds a numeric range to this brush context  
#### Examples

```js
brush.addRange('Sales', { min: 20, max: 50 });
```
#### <a name='brush.addRanges' href='#brush.addRanges'>#</a> **brush.addRanges**(*Array.&lt;object&gt; items, string items[].key, object items[].range*)

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| items | Array.&lt;object&gt; | Items containing the ranges to remove | No | No |
| items[].key | string | No | No | No |
| items[].range | object | No | No | No |

No description  
#### <a name='brush.removeRange' href='#brush.removeRange'>#</a> **brush.removeRange**(*string key, object range, number range.min, number range.max*)

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| key | string | An identifier that represents the data source of the range | No | No |
| range | object | The range to remove from this brush | No | No |
| range.min | number | Min value of the range | No | No |
| range.max | number | Max value of the range | No | No |

Removes a numeric range from this brush context  
#### <a name='brush.removeRanges' href='#brush.removeRanges'>#</a> **brush.removeRanges**(*Array.&lt;object&gt; items*)

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| items | Array.&lt;object&gt; | Items containing the ranges to remove | No | No |

No description  
#### <a name='brush.setRange' href='#brush.setRange'>#</a> **brush.setRange**(*string key, object range, number range.min, number range.max*)

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| key | string | An identifier that represents the data source of the range | No | No |
| range | object | The range to set on this brush | No | No |
| range.min | number | Min value of the range | No | No |
| range.max | number | Max value of the range | No | No |

Sets a numeric range to this brush context

Overwrites any active ranges identified by &#x60;key&#x60;  
#### <a name='brush.setRanges' href='#brush.setRanges'>#</a> **brush.setRanges**(*Array.&lt;object&gt; items*)

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| items | Array.&lt;object&gt; | Items containing the ranges to set | No | No |

No description  
#### <a name='brush.toggleRange' href='#brush.toggleRange'>#</a> **brush.toggleRange**(*string key, object range, number range.min, number range.max*)

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| key | string | An identifier that represents the data source of the range | No | No |
| range | object | The range to toggle in this brush | No | No |
| range.min | number | Min value of the range | No | No |
| range.max | number | Max value of the range | No | No |

Toggles a numeric range in this brush context

Removes the range if it&#x27;s already contained within the given identifier,
otherwise the given range is added to the brush.  
#### <a name='brush.toggleRanges' href='#brush.toggleRanges'>#</a> **brush.toggleRanges**(*Array.&lt;object&gt; items*)

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| items | Array.&lt;object&gt; | Items containing the ranges to toggle | No | No |

No description  
#### <a name='brush.containsRangeValue' href='#brush.containsRangeValue'>#</a> **brush.containsRangeValue**(*string key, number value*)

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| key | string | An identifier that represents the data source of the value | No | No |
| value | number | The value to check for | No | No |
| Returns | boolean | No | ... | ... |

Checks if a value is contained within a range in this brush context

Returns true if the values exists for the provided key, returns false otherwise.  
#### Examples

```js
brush.addRange('Sales', { min: 10, max: 50 });
brush.containsRangeValue('Sales', 30); // true
brush.containsRangeValue('Sales', 5); // false
```
#### <a name='brush.containsRange' href='#brush.containsRange'>#</a> **brush.containsRange**(*string key, object range, number range.min, number range.max*)

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| key | string | An identifier that represents the data source of the value | No | No |
| range | object | The range to check for | No | No |
| range.min | number | Min value of the range | No | No |
| range.max | number | Max value of the range | No | No |
| Returns | boolean | No | ... | ... |

Checks if a range segment is contained within this brush context

Returns true if the range segment exists for the provided key, returns false otherwise.  
#### Examples

```js
brush.addRange('Sales', { min: 10, max: 50 });
brush.containsRange('Sales', { min: 15, max: 20 }); // true - the range segment is fully contained within [10, 50]
brush.containsRange('Sales', { min: 5, max: 20 }); // false - part of the range segment is outside [10, 50]
brush.containsRange('Sales', { min: 30, max: 80 }); // false - part of the range segment is outside [10, 50]
```
#### <a name='brush.intercept' href='#brush.intercept'>#</a> **brush.intercept**(*string name, function ic*)

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| name | string | Name of the event to intercept | No | No |
| ic | function | Handler to call before event is triggered | No | No |

Adds an event interceptor  
#### Examples

```js
brush.intercept('add-values', items => {
 console.log('about to add the following items', items);
 return items;
});
```
#### <a name='brush.removeInterceptor' href='#brush.removeInterceptor'>#</a> **brush.removeInterceptor**(*string name, function ic*)

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| name | string | Name of the event to intercept | No | No |
| ic | function | Handler to remove | No | No |

Removes an interceptor  
#### <a name='brush.removeAllInterceptors' href='#brush.removeAllInterceptors'>#</a> **brush.removeAllInterceptors**(*string [name]*)

|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
| name | string | Name of the event to remove interceptors for. If not provided, removes all interceptors. | Yes | No |

Removes all interceptors  
