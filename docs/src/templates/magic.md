{{#if this.children}}
{{#if this.name}}
{{>factory this }}
{{else}}
{{#each children }}
{{#with (lookup .. this)}}
{{>magic this }}
{{/with}}
{{/each}}
{{/if}}
{{else}}
{{>(lookup . 'kind') this parent=parent}}
{{/if}}
