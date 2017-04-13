# Chart

## Render a chart

The `picasso.chart` function will create and render a chart.

### `picasso.chart(definition)`

* `definition` Object
  * `element` HTMLElement. The element to render the chart into.
  * `data` Object. The data to render. [More](./data.md).
  * `settings` Object. The element to render the chart into.
    * `components` Array - The element to render the chart into. [More](./component.md).
    * `scales` Object (optional). Scales to use when rendering. [More](./scales.md).
    * `formatters` Object (optional). The element to render the chart into. [More](./formatters.md).
    * `brush` Object (optional). Brushes to use. [More](./brush.md).
  * `on` Object (optional). Event listeners to bind.
  * `created` Function (optional). Lifecycle hook.
  * `beforeMount` Function (optional). Lifecycle hook.
  * `mounted` Function (optional). Lifecycle hook.
  * `beforeRender` Function (optional). Lifecycle hook.
  * `beforeUpdate` Function (optional). Lifecycle hook.
  * `updated` Function (optional). Lifecycle hook.
  * `beforeDestroy` Function (optional). Lifecycle hook.
  * `destroyed` Function (optional). Lifecycle hook.


## Chart lifecycle hooks

Use the lifecycle hooks to add and remove functionality when certain events are triggered.

If you have used frameworks such as React or VueJS you are familiar with the lifecycle concept. There are basically three use cases:

__Rendering a chart the first time__

This will trigger lifecycle events in the following order:

`created -> beforeRender -> beforeMount -> mounted`

__Updating a chart__

This will trigger lifecycle events in the following order:

`beforeUpdate -> beforeRender -> updated`

__Tearing down a chart__

This will trigger lifecycle events in the following order:

`beforeDestroy -> destroyed`


### `created()`

Called when the chart has been created. Use to initialize state variables that should be bound to the chart instance.

```js
picasso.chart({
  created() {
    this.dataPage = 1;
  }
});
```


### `beforeMount()`

Called before the chart has been mounted. Use to set initial state that server rendered charts may not need.

```js
picasso.chart({
  beforeMount() {
    this.clickCount = 0;
  }
});
```

_This hook is client-side only_


### `mounted(element)`

* `element` HTMLElement - The element the chart was rendered in.

Called after the chart has been mounted. Use to bind custom event handlers or other operations requiring the element.

```js
picasso.chart({
  mounted(element) {
    // Bind a tap listener using the Touche library (https://github.com/stoffeastrom/touche)
    Touche(element).tap({
        options: {
            areaThreshold: 5
        },
        end: function(e, data) {
            console.log("tap");
        }
    });
  }
});
```

_This hook is client-side only_


### `beforeRender()`

Called when the chart has been created. Use to initialize state variables that should be bound to the chart instance.

```js
picasso.chart({
  created() {
    this.dataPage = 1;
  }
});
```


### `beforeUpdate()`

Called before the chart will be updated. Use to initialize state variables that should be bound to the chart instance.

```js
picasso.chart({
  created() {
    this.dataPage = 1;
  }
});
```


### `updated()`

Called when the chart has been created. Use to initialize state variables that should be bound to the chart instance.

```js
picasso.chart({
  created() {
    this.dataPage = 1;
  }
});
```


### `beforeDestroy()`

Called before the chart has been destroyed. Use to unbind custom event listeners and do cleanup work requiring the element.

```js
picasso.chart({
  beforeDestroy() {
    this.dataPage = 1;
  }
});
```

_This hook is client-side only_


### `destroyed()`

Called when the chart has been destroyed. At this point all event handlers have been unbound and references to elements etc. are not available.

```js
chart({
  destroyed() {
    this. = 1;
  }
});
```

_This hook is client-side only_


## Chart instance functions

### `instance.update({ data, settings })`

Update a chart with new `data` and / or `settings`. Will trigger updates of all chart components.

```js
const chartInstance = picasso.chart({ /* ... */ });
chartInstance.update({
  settings: newSettings,

});
```

### `instance.destroy()`


### `instance.getAffectedShapes()`


### `instance.scroll()`


### `instance.findShapes()`


### `instance.shapesAt()`


### `instance.brush()`


### `instance.field()`


### `instance.data()`


## Binding events

Event listeners that are put inside the `on` object will automatically be bound when mounting the chart.


```js
const chartInstance = picasso.chart({
  on: {
    click: function(e) {
      console.log('Click', e);
    }
  }
});
```

_Note that you should not use arrow functions to let the `this` context inside methods to be bound to the instance_

## Example

```js
const chartInstance = picasso.chart({
  element: document.getElementById('chart-container'),
  data: { ... },
  settings: {
    scales: {
      x: {
        source: "/qHyperCube/qMeasureInfo/0"
      },
      y: {
        source: "/qHyperCube/qDimensionInfo/0"
      }
    },
    components: [{
      type: "point-marker",
      settings: {
        fill: 'red'
      }
    }]
  },
  created: function() {
    console.log('Chart was created');
  },
  mounted: function() {
    console.log('Chart was mounted');
  },
  on: {
    click: function(e) {
      console.log('Click', e);
    }
  }
});

chartInstance.update({
  data: { /* . */ }
});
```
