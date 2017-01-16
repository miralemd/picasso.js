# Changelog

## [Unreleased]

### Changed

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

## 0.3.0

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

## 0.2.0

### Added

- Axis component
- Box marker component
- Improved point marker component
- Canvas rendering

### Changed

- [BREAKING] Point marker configuration

## 0.1.0

- Initial release
