# `legend-cat` (Static categorical Color Legend) component [*EXPERIMENTAL*]

A component that renders a static categorical color legend

## Component settings

{{>struct definitions.component--legend-cat}}

## Events

The categorical color legend component handles two type of events by default, `tap` and `resetindex` (*DEPRECATED*).

### `tap` event

Requires an event with `center: { x: 0, y: 0 }`-object for evaluating button presses.

```js
  picassoInstance.component('<key value of legend-cat>').emit('tap', { center: { x: 0, y: 0 } });
  ```

### `scroll` event

Trigger a manual scroll by passing the scroll length as a parameter (default length is 3).
This event is to allow mousewheel scroll and scroll on panning.

  ```js
  picassoInstance.component('<key value of legend-cat>').emit('scroll', 3);
  ```

### `resetindex` event *DEPRECATED*

Will reset the paging index, but will *NOT* re-render the component, needs to be done by itself.
To use this, make sure the component has a `key` (it needs that for the paging to work anyway), and use it like this:

```js
const instance = picasso.chart({ /* settings */ });

window.pic.component('<key value of legend-cat>').emit('resetindex');
```

Please note that this event is *DEPRECATED* and will be removed in future releases.
