# Markers

{{#each registry}}
* <a href="#{{ this}}">{{ this }}</a>
{{/each}}

## Point marker
{{>magic ctx='core.chart-components.markers.point.index-js' parent='test'}}

## Box marker
{{>magic ctx='core.chart-components.markers.box-js'}}
