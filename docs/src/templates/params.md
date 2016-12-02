({{#if this}}*{{#each this}}{{ type.names.[0] }} {{#if optional}}[{{/if}}{{ name }}{{#unless @last}}, {{/unless}}{{#if optional}}]{{/if}}{{/each}}*{{/if}})
