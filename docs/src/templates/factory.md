{{>function this }}
{{#each children }}
{{#with (lookup .. this)}}
{{>magic this parent=../../name}}
{{/with}}
{{/each}}
