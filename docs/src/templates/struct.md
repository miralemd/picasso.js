{{#if skip}}
{{else}}
{{#if _nested}}
{{name}}: { // {{#if description}}{{description}}.{{/if}}{{#if defaultvalue}} Default: {{{defaultvalue}}}.{{/if}}{{#if optional}} Optional.{{/if}}
{{#each _nested}}
  {{>struct this}}
{{/each}}
},
{{else}}
{{name}}: {{>sample this}}, // {{#if description}}{{description}}.{{/if}}{{#if defaultvalue}} Default: {{{defaultvalue}}}.{{/if}}{{#if optional}} Optional.{{/if}}
{{/if}}
{{/if}}
