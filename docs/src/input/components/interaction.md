# `interaction` component [*EXPERIMENTAL*]

## Definition

Experimental functional component with no UI that adds interaction events to the chart. This component requires that HammerJS has been loaded before usage since it's using HammerJS to bind events and recognize gestures. http://hammerjs.github.io/api/

```js
{
  type: 'interaction',
  actions: [{
    type: 'Tap', // Type of Hammer recognizer. Pan, Pinch, Press, Rotate, Swipe, Tap, Click(same as tap)
    options: {   // Options passed down to the Hammer recognizer
      event: 'theTap' // name the event this recognizer generates. Defaults to recognizer's lowercased name (e.g. tap)
      ...
    },
    recognizeWith: 'otherEvent1 otherEvent2', // space separated list of recognizers that should run simultaneously
    requireFailure: 'otherEvent', // space separated list of recognizers that needs to fail before this one gets recognized
    handlers: { // callback functions for events emitted from hammer
      theTap: function tap(e) {
        // event handler
      }
    }
  }]
}
```

## Example usage

```js

'use strict';

var settings = {
  components: [{
    type: 'interaction',
    actions: [{
      // triple tap
      type: 'Tap', // Recognizer type in Hammer
      options: { // options passed to Hammer event recognizer
        event: 'tripletap', // name of event to bind, defaults to recognizer type lowercased
        taps: 3
      },
      recognizeWith: 'doubletap tap', // specify which event gestures this should be recognized together with
      handlers: {
        tripletap: function tripletap(e) {
          // handle triple tap event
        }
      }
    }, {
      type: 'Tap',
      options: {
        event: 'doubletap',
        taps: 2
      },
      recognizeWith: 'tap',
      requireFailure: 'tripletap',
      handlers: {
        doubletap: function doubletap(e) {
          // handle double tap event
        }
      }
    }, {
      // single tap
      type: 'Tap',
      requireFailure: 'tripletap doubletap',
      handlers: {
        tap: function tap(e) {
          // handle tap event
        }
      }
    }, {
      type: 'Pan',
      handlers: {
        panstart: function onPanStart(e) {
          // handle pan start
        },
        pan: function onPan(e) {
          // handle pan
        },
        panend: function onPanEnd(e) {
          // handle pan end
        }
      }
    }]
  }]
};

picasso.chart({
  element,
  data,
  settings
});

```

