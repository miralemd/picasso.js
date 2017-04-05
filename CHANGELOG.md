# Changelog

## Unreleased

### Fixed

- PIC-120 Property displayOrder of text component should be set to default value instead of 99

## [BREAKING] 0.13.0

### Breaking changes

- Removed `layered` & `tilted` properties from `axis` component and replaced them with a `mode` property taking either `auto`, `horizontal`, `layered` or `tilted`

    ```js
    {
      type: 'axis',
      settings : {
        labels: {
          mode: 'tilted' // Default is auto
        }
      }
    }
    ```

### Added

- PIC-117 Automagically switch to tilted labels when appropriate
- Added `maxGlyphCount` on axis component.

    ```js
    {
      type: 'axis',
      settings : {
        labels: {
          maxGlyphCount: 20
        }
      }
    }
    ```

### Fixed

- PIC-119 Update doesn't trigger re-resolving of scale type
- PIC-122 Batch brush items

## 0.12.4

### Fixed

- PIC-113 globalPropagation property doesn't work on brush trigger

## 0.12.3

### Fixed

- PIC-112 - Discrete axis doesn't hide when labels overlap
- Event handlers for brush stylers are not cleared during update

## 0.12.2

### Fixed

- q plugin exports don't work in AMD

## 0.12.1

- ?

### Fixed

- PIC-112 Discrete axis doesn't hide when labels overlap

## [BREAKING] 0.12.0

### Breaking changes

- Move `q` on the public API into a separate plugin. This change requires registering of the `q` plugin to make it available. Also, the brush helper function has been renamed.

  _Usage in ES2015_

    ```js
    import picasso from '@qlik/picasso';
    import q, { qBrushHelper } from '@qlik/picasso/plugins/q';

    picasso.use(q);

    qBrushHelper(/* ... */);
    ```

  _Usage in AMD_

    ```js
    define(['@qlik/picasso', '@qlik/picasso/plugins/q/dist/picasso-q'], function(picasso, q) {
      picasso.use(q);

      qBrushHelper(/* ... */);
    });
    ```

- Initializing formatters, data etc. has changed from picasso.data('q')()(data) to picasso.data('q')(data).
- Scale types have changed name (if any of the following are used explicitly, they need to be updated):
  - `ordinal` → `band`
  - `color-threshold` → `threshold-color`
  - `color-sequential` → `sequential-color`

### Added

- PIC-4 Categorical color scale
- PIC-6 QIX attribute dimension support
- PIC-104 Control visibility of components
 
    ```js
    components: [
      {
        type: 'axis',
        show: false
      }
    ]
    ```

- Expose the following methods on the public API: `formatter`, `dataset`, `field` and `table`.
- Flatten formatters (keeping backward compatibility). Example: `picasso.formatter('d3')('number')` → `picasso.formatter('d3-number')`.


## [BREAKING] 0.11.0

### Breaking changes

- scale ticks settings `count` & `values` now only accept primitive numbers:

    ```js
    scales: {
      x: {
        ticks: {
          count: 5,
          values: [1, 2, 3, 4, 5]
        },
        minorTicks: {
          count: 3
        }
      }
    }
    ```

### Fixed

- PIC-55 Can crash browser by setting a short ticks distance
- PIC-96 Tooltips doesn't align correctly for canvas

### Added

- PIC-2 Sequential scale
- PIC-3 Threshold color scale

## [BREAKING] 0.10.0

### Breaking changes

- brushing: the `action` in brush triggers now refers to which action to run `on` event:

    ```js
    trigger: [{
      on: 'tap',
      action: 'set'
    }]
    ```

### Added

- PIC-82 Default to bounds container collider on box-marker
- PIC-85 Add trigger options for different actions

    ```js
    action: 'set' // Sets the brushed values, replacing any previous ones (default for hover brush)
    action: 'toggle' // Toggles the brushed values, adding and removing from the brush (default for tap brush)
    action: 'add' // Adds the brushed values
    action: 'remove' // Removes the brushed values
    action: function(e) { return e.ctrlKey ? 'set' : 'toggle' }
    ```

### Fixed

- PIC-83 'click' trigger at start of gesture

## 0.9.2

### Fixed

- dom-renderer clear method

### Added

- PIC-84 Add interceptor removal methods:

    ```js
    brush.removeAllInterceptors('toggle-values');
    brush.removeAllInterceptors();
    ```

## 0.9.1

### Fixed

- Box-marker without major scale falls back to `minWidth` setting due to `bandwith` defaulting to `0` - should default to `1`

## [BREAKING] 0.9.0

### Breaking changes

- `chart.getAffectedShapes()` now returns an array of `sceneObjects`
- `attribute` has changed name to `trackBy` in `data.mapTo.groupBy`
- `type: 'qual:id'` has been removed in favor of `property: 'id'`
- Settings for generating ticks has been moved to the scale instead

### Added

- PIC-25 Sense selections by row and column:

    ```js
    data: {
      mapTo: {
        groupBy: '/qDimensionInfo/1', trackBy: '$index', property: '$index'
      }
    }

    picasso.brush(chart.brush('selection', { byCells: true }))
    ```

- PIC-60 Basic sequential color scale:

    ```js
    fill: {
      ref: 'a',
      scale: {
        source: '/qHyperCube/qDimensionInfo/0/qAttrExprInfo/0',
        type: 'color-sequential',
        range: ['darkred', 'orange', 'green']
      }
    }
    ```

- PIC-64 `chart.findShapes()` takes a css selector and return shapes in a chart, as an array of `sceneObjects`

    ```js
    chart.findShapes('circle');
    chart.findShapes('circle[fill="red"]');
    ```

- PIC-67 Basic quantized color scale:

    ```js
    fill: {
      ref: 'a',
      scale: {
        source: '/qHyperCube/qDimensionInfo/0/qAttrExprInfo/0',
        type: 'color-threshold',
        range: ['red', 'green', 'blue'],
        domain: [100, 200]
      }
    }
    ```

- PIC-70 Support for attribute expressions on measures and dimensions:

    ```js
    source: '/qHyperCube/qMeasureInfo/1/qAttrExprInfo/0'
    ```

- PIC-77 Values are abbreviated when format type is inconclusive


### Fixed

- Ordinal scale does not use provided settings
- Ordinal scale changed to behave as a band scale
- Components respect the ordinal scale properly and use bandwidth to handle default sizing
- PIC-72 Components do not update dock property
- PIC-75 `NaN` values on measures messes up the min/max on the scale
- PIC-43 When less then half of a label is visible then the axes will not be visible

## 0.8.0

### Added

- Support for touch/hybrid when brushing
- Optional setting to control touch area:

     ```js
     trigger: [{
       contexts: [],
       action: 'tap',
       touchRadius: 24
     }]
     ```

### Fixed

 - PIC-69 EffectiveInterColumnSortOrder not taken into account

## [BREAKING] 0.7.0

### Breaking changes

- Box marker's scales has changed from x to major and y to minor. The vertical parameter has been replaced with "orientation" with possible values "vertical" and "horizontal". Defaults to vertical.

### Added

- Allow creation of scales without data source

### Fixed

- Some brushing issues has been fixed

## 0.6.0

### Added

- Scrollbar component
- Partial update flag
- Brush support on SVG and Canvas renderer.
- Brush through multiple layers of components. Control propagation via optional settings:

    ```js
    trigger: [{
      contexts: [],
      action: 'tap',
      propagation 'stop', // 'stop' => only trigger on first shape || 'data' => only trigger on shapes with unique data values
      globalPropagation: 'stop', // 'stop' => if triggered, do not run triggers on other components
    }]
    ```

### Fixed

- QLIK-70268 Width/Size are not in sync nor logical
- QLIK-70627 Ratio between point and box are not kept
- QLIK-71779 Labels on top of each other if "forced axis values" close to each others are used in the wrong order
- QLIK-72315 forceBounds setting should filter neighbor if it's to close
- QLIK-72348 Update chart from layered true to false renders the axis wrong
- QLIK-72378 Update data in the update chart example sometimes makes the x axes disappear and it will never come back
- Formatter source lookup on dataset


## 0.5.0

### Added

- Support for qHyperCube in "K" mode
- Support primitive values in data mapping:

    ```js
    data: {
      mapTo: {
        start: 0,
        parent: 'Zeus'
      }
    }
    ```

- Support brushing in discrete axis

### Fixed

- Crash when traversing 'null'
- Grid lines actually work again, a basic grid line can be added to components like this:

    ```js
    {
      type: 'grid-line',
      x: { scale: 'x' },
      y: { scale: 'y' }
    }
    ```
- Crispifier now produces non-fuzzy rects even if the strokeWidth is even
- "Sponge-effect" bug in the boxplot has been removed

## 0.4.1

### Changes

- Transpile es6 versions of d3 modules

## [BREAKING] 0.4.0

### Breaking changes

- `picasso.chart` now takes an object as its single parameter

    ```js
    // before
    var settings = {
      components: {
        markers: [
          type: 'box',
          settings: {
            dock: 'left',
            anotherSetting: 'x'
          }
        ]
      }
    };
    picasso.chart(element, data, settings);

    //after
    var settings = {
      components: [
        type: 'box-marker',
        key: 0, // unique identifier per component to improve performance on update
        dock: 'left',
        settings: {
          anotherSetting: 'x'
      }
    ]
    };
    var chartInstance = picasso.chart({
      element: element,
      data: data,
      settings: settings
    }};
    ```

- `components` is now a flat array
- `dock` property has been moved out one level (the same applies for `displayOrder` and `prioOrder`)

### Added

- DOM renderer
- `update` method on the chart instance can be used to update settings and/or data

   ```js
   var pic = picasso.chart({...});
   pic.update({
     data: {...}
   });
   ```

- Event listeners can be bound on component and chart level

    ```js
    {
      type: 'point-marker',
      on: {
        click: function() {
          console.log('clicked');
        }
      }
    }
    ```

- Lifecycle hooks on components:

    ```js
    {
      type: 'point-marker',
      created: () => {},
      mounted: () => {},
      beforeRender: () => {},
      beforeUpdate: () => {},
      updated: () => {},
      beforeDestroy: () => {},
      destroyed: () => {}
    }
    ```

- Brushing supported by components:

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

- Data brushing API

    ```js
      var pic = picasso.chart(...);
      pic.brush('highlight').addValue('products', 'Bike');
    ```

## [BREAKING] 0.3.0

### Added

- Scale settings
  - Expand
  - Include
- Null data fallback
- Data mapping
- Crispifier
  - Crisp setting for transposer
- Documentation
- RTL text rendering and ellipsis
- Style inheritance

### Changed

- [BREAKING] - Marker configurations

### Fixed

- Scale invert now works as it is supposed to
- Scale with same min and max automatically expands the values to ensure a range exists
- Stroke-width works as intended on canvas

## [BREAKING] 0.2.0

### Added

- Axis component
- Box marker component
- Improved point marker component
- Canvas rendering

### Changed

- [BREAKING] Point marker configuration

## 0.1.0

- Initial release
