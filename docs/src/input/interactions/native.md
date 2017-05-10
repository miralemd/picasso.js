# `native` interaction component

A interaction component that binds browser's native events.

## Native interaction settings

{{>magic ctx='web.interactions.native.index-js.settings'}}

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
