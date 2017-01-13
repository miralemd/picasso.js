# Brushing in components

Brushing in a component is handled in two ways; _trigger_ and _consume_.

## Observe actions on the component

`trigger` controls how the component reacts to various user actions like 'tapping on a shape':

* `action`: type of action to react to
* `contexts`: name of the brushing contexts to affect
* `data`: the mapped data properties to add to the brush. _Optional_

```js
trigger: [{
  action: 'tap',
  contexts: ['selection', 'tooltip'],
  data: ['x']
}],
```

## Observe changes of a brush context

 `consume` controls how the component uses active brushes.

* `context`: name of the brush context to observe
* `data`: the mapped data properties to observe. _Optional_
* `style`: the style to apply to the shapes of the component
  * `active`: the style of _active_ data points
  * `inactive`: the style of _inactive_ data points

```js
consume: [{
  context: 'selection',
  data: ['x'],
  style: {
    active: {
      fill: 'red',
      stroke: '#333',
      strokeWidth: 2
    },
    inactive: {
      fill: 
    }
  }
}]
```
## Programmatic changes

Brushes can be controlled programatically by accessing a certain brush from the picasso instance:

```js

const pic = picasso.chart(...);
const highlighter = pic.brush('highlight');
highlighter.addValue('products', 'Bike');

```

when `addValue` is called, components that are _consuming_ the _highlight_ brushing context will react automatically and apply the specified style.


## Scenarios

**Scenario**: Tapping on a data point in a component should activate a brush called _highlight_, add the relevant data to the brush, and finally highlight the point in the component.

```js
{
  type: 'point-marker',
  data: {...},
  settings: {...},
  brush: {
    trigger: [{
      action: 'tap',
      contexts: ['highlight']
    }],
    consume: [{
      context: 'highlight',
      style: {
        inactive: {
          opacity: 0.3
        }
      }
    }]
  }
}

```

To make the component react to a 'tap', we add a _trigger object_ with an `action` of type 'tap' and set the brush `contexts` we want to affect.

To have the component listen to brush changes and update itself, we add a _consume object_ with the name of the `context` we want it to observe, and set the `style` of `inactive` points.

**Related**

* [data-brush](./data-brush.md)
