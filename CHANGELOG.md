# Changelog

## [BREAKING] [Unreleased]

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
