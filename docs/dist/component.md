# Component

## Using components in a chart

To use components, you need to add them in the `components` array:

```js
picasso.chart({
  settings: {
    components: [{
      type: 'point-marker',
      data: { /* ... */ },
      settings: { /* ... */ }
    }, {
      type: 'axis',
      dock: 'bottom',
      scale: 'x'
    }]
  }
});
```

Some properties are general and can be used on all components:

* `dock` String. Dock setting. Any of `top` | `right` | `bottom` | `left`
* `displayOrder` Number. 
* `prioOrder` Number. 
* `minimumLayoutMode` String. 
* `created` Function. Lifecycle hook.
* `beforeMount` Function. Lifecycle hook.
* `mounted` Function. Lifecycle hook.
* `beforeRender` Function. Lifecycle hook.
* `beforeUpdate` Function. Lifecycle hook.
* `updated` Function. Lifecycle hook.
* `beforeDestroy` Function. Lifecycle hook.
* `destroyed` Function. Lifecycle hook.


## Bundled components

Picasso.js comes with a pre-bundled set of components:

- [Box marker](./markers.md#Box%20marker)
- [Point marker](./markers.md#Point%20marker)
- [Axis](./axis.md)
- [Grid](./grid.md)
- [Text](./text.md)


## Register a custom component

To register a component, use the `picasso.component` function.

### `picasso.component(name, definition)`

- `name` String. Name of the component to register.
- `definition` Object
  * `dock` String. 
  * `displayOrder` Number. 
  * `prioOrder` Number. 
  * `minimumLayoutMode` String. 
  * `created` Function (optional). Lifecycle hook.
  * `beforeMount` Function (optional). Lifecycle hook.
  * `mounted` Function (optional). Lifecycle hook.
  * `beforeRender` Function (optional). Lifecycle hook.
  * `beforeUpdate` Function (optional). Lifecycle hook.
  * `updated` Function (optional). Lifecycle hook.
  * `beforeDestroy` Function (optional). Lifecycle hook.
  * `destroyed` Function (optional). Lifecycle hook.

## Component lifecycle hooks

__TODO__

(Note that the lifecycle hooks in the component definition __does not__ share the same context as hooks used in the component settings of a chart).
