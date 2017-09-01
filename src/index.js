import {
  chart,
  renderer,
  data,
  formatter,
  dataset,
  field,
  table,
  component,
  interaction
} from './core';
import './web';

// import chartComponent from './core/charts';
import boxMarkerComponent from './core/chart-components/markers/box';
import pointMarkerComponent from './core/chart-components/markers/point';
import gridLineComponent from './core/chart-components/grid';
import refLineComponent from './core/chart-components/ref-line';
import axisComponent from './core/chart-components/axis';
import textComponent from './core/chart-components/text';
import scrollbarComponent from './core/chart-components/scrollbar';
import brushRangeComponent from './web/components/brush-range';
import rangeComponent from './core/chart-components/range';
import brushLassoComponent from './core/chart-components/brush-lasso';
import labelsComponent from './core/chart-components/labels';
import categoricalLegend from './core/chart-components/legend-cat';
import sequentialLegend from './core/chart-components/legend-seq';

// Plugin API
function use(plugin, options = {}) {
  plugin({
    chart,
    renderer,
    data,
    dataset,
    field,
    table,
    formatter,
    component,
    interaction
  }, options);
}

// Register components
// use(chartComponent);
use(textComponent);
use(axisComponent);
use(boxMarkerComponent);
use(pointMarkerComponent);
use(gridLineComponent);
use(refLineComponent);
use(scrollbarComponent);
use(brushRangeComponent);
use(rangeComponent);
use(brushLassoComponent);
use(labelsComponent);
use(categoricalLegend);
use(sequentialLegend);

/**
 * The mother of all namespaces
 * @namespace picasso
 */
export {
  chart,
  renderer,
  data,
  formatter,
  dataset,
  field,
  table,
  use,
  component,
  interaction
};
