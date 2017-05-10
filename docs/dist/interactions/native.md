# `native` interaction component

A interaction component that binds browser's native events.

## Native interaction settings

```js
settings: {
  type: 'foo', // The interaction type. Is 'native' for this component. Optional.
  enable: true, // Should the interactions defined here be enabled or not.
  This is only run when adding event handlers. In effect at startup, update or during on/off.
  It does not run during every event loop.. Default: true. Optional.
  gestures: , // The keys in this object is the names of native events
  that should be added to the chart element and they should all point to function which
  will be the corresponding event handler.. Optional.
}
```

```js
interactions: [
  {
    type: 'native',
    key: 'here',
    enable: function() {  // bool or function
      this.chart /*...*/;
      return true;
    },
    events: {
      mousemove: function(e) { // key should point to a native event
        // handle event here
      },
      keydown: function(e) {
        // handle event here
      }
    }
  }
]
```
