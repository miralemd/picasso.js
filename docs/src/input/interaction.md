# Interaction

Interactions provides an api to bind events to a picasso chart in a declaritive way.

## Using interactions in a chart

Each interaction component has a `type` property which identifies the type of interaction to add to the chart.

To use interaction components, you need to add them in the `interactions` array:

```js
picasso.chart({
  settings: {
    interactions: [{
      type: 'native',
      key: 'aKey',
      enable: /* ... */,
      events: { /* ... */ }
    }, {
      type: 'hammer',
      key: 'anotherKey',
      enable: /* ... */,
      gestures: { /* ... */ }
    }]
  }
});
```

## Bundled interactions

picasso.js comes with one pre-bundled interaction component:

- [native](./interactions/native.md)

and together with picasso the following interaction component plugin is shipped:

- [hammer](./interactions/hammer.md)

## Register a custom interaction

To register a interaction component, use the `picasso.interaction` registry.

**`picasso.interaction(name, definition)`**

- `name` *string*. Name of the interaction component to register.
- `definition` *object*
  * `key` *getter* (optional) Returns the key identifier for this interaction component. Used for making updates with changes to the interaction compnents a smooth ride.
  * `set` *function* Set interaction settings and add/update event handlers to the chart element.
  * `off` *function* Turn off interactions.
  * `on` *function* Turn on interactions.
  * `destroy` *function* Remove all bound events.
