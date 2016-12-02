# Data
## In this file:
{{#each registry}}
* <a href="#{{ this}}">{{ this }}</a>
{{/each}}

## Fields
{{>function core.data.field-js.module-exports name="field"}}
{{>magic core.data.field-js.field parent="field"}}
