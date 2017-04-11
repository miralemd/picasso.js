{{#if (get ctx this)}}
{{#with (get ctx this) parent=parent}}
{{#if this.children}}
{{#if this.name}}
{{>factory this }}
{{else}}
{{#each children }}
{{#with (lookup .. this)}}
{{>magic this parent=../../parent}}
{{/with}}
{{/each}}
{{/if}}
{{else}}
{{#if this.kind}}
{{>(lookup . 'kind') this parent=parent}}
{{else}}
Magic resolution of this file, function or object is not possible.
{{/if}}
{{/if}}
{{/with}}
{{else}}
Context {{ ctx }} is not available {{get ctx this}}
{{error 'Context unavailable ' ctx}}
{{/if}}