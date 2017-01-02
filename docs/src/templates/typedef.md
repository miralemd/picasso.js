#### {{anchor longname}} {{ name }}

{{#if properties}}
|Name(s)|Type(s)|Description|Optional|
|-------|-------|-----------|--------|
{{#each properties}}
| {{ name }} | {{#each type.names}}{{ this }}{{/each}} | {{ description }} | {{>bool optional}} |
{{/each}}
{{else}}
Can be one of the following types: {{#each type.names}}{{ this }}{{#unless @last}}, {{/unless}}{{/each}}
{{/if}}

{{>examples examples}}
