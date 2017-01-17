#### {{anchor longname}} {{ parent }}{{#if parent}}.{{/if}}**{{ longname }}**{{>params params}}
{{#ifCond params '||' returns }}
|Name(s)|Type(s)|Description|Optional|Default value|
|-------|-------|-----------|--------|-------------|
{{#each params}}
| {{ name }} | {{ type.names.[0] }} | {{no description }} | {{>bool optional}} | {{no defaultvalue}} |
{{/each}}
{{#each returns}}
| Returns | {{ type.names.[0] }} | {{no description }} | ... | ... |
{{/each}}
{{/ifCond}}

{{nocust description 'No description'}}  
{{>examples examples}}
