#### {{anchor longname}} {{ name }}

{{#if properties}}
|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
{{#each properties}}
| {{ name }} | {{#each type.names}}{{ this }}{{/each}} | {{no description }} | {{>bool optional}} | {{no defaultvalue}} |
{{/each}}
{{else}}
Can be one of the following types: {{#each type.names}}{{ this }}{{#unless @last}}, {{/unless}}{{/each}}
{{/if}}

{{nocust description 'No description'}}  
{{>examples examples}}
