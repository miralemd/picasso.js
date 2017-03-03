# Picasso.js documentation

## Getting started

Install by running the command:

`npm install @qlik/picasso`

Import the picasso module in your code:

`import picasso from '@qlik/picasso'`


## Top-level API

Picasso exposes the following API:

### `picasso.chart({ /* ... */ })`

Creates and renders a chart. [More about charts](./chart.md).

### `picasso.component(name, definition)`

Registers a component. [More about components](./component.md).

### `picasso.renderer(name, definition)`
  
Registers a renderer. [More about renderers](./renderer.md).

### `picasso.data`

TODO

[More about data](./data).

### `picasso.q`

TODO

### `picasso.use(plugin)`

* `plugin` - Function

Register and use a plugin.

The plugin function will be called with `picasso` as its single parameter. A plugin example:

_my-plugin.js_

```js
export default function(picasso) {
  picasso.component('my-component-1', { /* ... */ });
  picasso.component('my-component-2', { /* ... */ });
}
```

_init-picasso.js_

```js
import picasso from '@qlik/picasso';
import myPlugin from './my-plugin';

// Initialize picasso plugins
picasso.use(myPlugin);

// Do regular picasso stuff
picasso.chart({ /* ... */ });
```

