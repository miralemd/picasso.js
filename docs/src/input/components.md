# Components

Components make up the visual parts of a chart, these typically include axis, grid-lines and data points encoded in various ways.

## Using components in a chart

Each component has a `type` property which identifies the type of component to create.

To use components, add them in the `components` array:

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

* `dock` *string*. Dock setting. Any of `top` | `right` | `bottom` | `left`
* `show` *boolean*. True if component should be rendered.
* `displayOrder` *number*. The order in which components are rendered (similar to css z-index).
* `prioOrder` *number*. The order in which components are docked from the center area,
* `minimumLayoutMode` *string*. 
* `data` *object*. See [data section](./data.md).
* `settings` *object*.
* `created` *function*. Lifecycle hook.
* `beforeMount` *function*. Lifecycle hook.
* `mounted` *function*. Lifecycle hook.
* `beforeRender` *function*. Lifecycle hook.
* `beforeUpdate` *function*. Lifecycle hook.
* `updated` *function*. Lifecycle hook.
* `beforeDestroy` *function*. Lifecycle hook.
* `destroyed` *function*. Lifecycle hook.

**`displayOrder`**

The `displayOrder` property is used by the layout engine to lay out components. Components are interpreted in the ascending order of the `displayOrder` value. The layout engine apply the value in two ways, the first is the order in which components are rendererd. The second is the area components are laid out in when they have a direction, i.e. docked to either top, bottom, left or right.

If docked at the same area, the component with a higher `displayOrder` will be rendered on top of the component with a lower `displayOrder`. It can be seen as defining a z-index. A lower `displayOrder` also means that a component will be laid out first in a given direction, i.e. laid out closer to the central area (non-directional area) then a component with a higher `displayOrder`. It can it this case be seen as the x-index or y-index.

**`prioOrder`**

The `prioOrder` property is used to define the order in which components are added to the layout engine, this is done before any components are laid out. When there is not enough space to add any more components to a given area, all components not already added, are then discarded. The value of `prioOrder` is in ascending order, such that a lower value is added to the layout engine first.

**`settings`**

Most components use a `settings` object that is specific to the component itself.

## Bundled components

picasso.js comes with a pre-bundled set of components:

- [box-marker](./components/box-marker.md)
- [point-marker](./components/point-marker.md)
- [pie](./components/pie.md)
- [line/area](./components/line.md)
- [labels](./components/labels.md)
- [legend-cat](./components/legend-cat.md)
- [legend-seq](./components/legend-seq.md)
- [axis](./components/axis.md)
- [grid-line](./components/grid-line.md)
- [text](./components/text.md)
- [ref-line](./components/ref-line.md)
- [range](./components/range.md)
- [brush-range](./components/brush-range.md)
- [brush-lasso](./components/brush-lasso.md)
- [interaction](./components/interaction.md)

## Registering a custom component

A custom component can be registered using the `picasso.component` registry:

**`picasso.component(name, definition)`**

- `name` *string*. Name of the component to register.
- `definition` *object*
  * `dock` *string* (optional).
  * `displayOrder` *number* (optional).
  * `prioOrder` *number* (optional). 
  * `minimumLayoutMode` *string* (optional). 
  * `created` *function* (optional). Lifecycle hook.
  * `beforeMount` *function* (optional). Lifecycle hook.
  * `mounted` *function* (optional). Lifecycle hook.
  * `beforeRender` *function* (optional). Lifecycle hook.
  * `render` *function* (optional). Lifecycle hook.
  * `beforeUpdate` *function* (optional). Lifecycle hook.
  * `updated` *function* (optional). Lifecycle hook.
  * `beforeDestroy` *function* (optional). Lifecycle hook.
  * `destroyed` *function* (optional). Lifecycle hook.

### A draw line component

Let's make a component that draws a red line across its entire display area:

```js
picasso.component('drawLine', {
  beforeRender(opts) {
    this.rect = opts.size;
  },
  render() {
    return [{
      type: 'line',
      stroke: 'red',
      strokeWidth: 4,
      x1: this.rect.x,
      y1: this.rect.y,
      x2: this.rect.width,
      y2: this.rect.height
    }];
  }
});
```

It can then be used like any other component:

```js
picasso.chart({
  element,
  settings: {
    components: [{
      type: 'drawLine'
    }]
  }
});
```

## Component lifecycle hooks

__TODO__

(Note that the lifecycle hooks in the component definition __do not__ share the same context as hooks used in the component settings of a chart).

