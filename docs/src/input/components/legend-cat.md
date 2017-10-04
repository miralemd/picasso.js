# `legend-cat` (Static categorical Color Legend) component [*EXPERIMENTAL*]

A component that renders a static categorical color legend

## Component settings

{{>magic ctx='core.chart-components.legend-cat.index-js'}}

## Events

The categorical color legend component handles two type of events by default, `tap` and `resetindex` (*DEPRECATED*).

### `tap` event
Requires an event with `center: { x: 0, y: 0 }`-object for evaluating button presses.

### `resetindex` event *DEPRECATED*
Will reset the paging index, but will *NOT* re-render the component, needs to be done by itself.
To use this, make sure the component has a `key` (it needs that for the paging to work anyway), and use it like this:

```js
const instance = picasso.chart({ /* settings */ });

window.pic.component('<key value of legend-cat>').emit('resetindex');
```

Please note that this event is *DEPRECATED* and will be removed in future releases.
