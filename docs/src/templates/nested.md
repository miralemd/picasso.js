{{#if skip}}
{{else}}
* `{{name}}` *{{#each type.names}}{{ this }}{{#unless @last}} | {{/unless}}{{/each}}* - {{description}}.{{#if optional}} *Optional.*{{/if}}
  {{#if _nested}}
  {{#each _nested}}
  {{>nested this}}
  {{/each}}
  {{/if}}
{{/if}}