#### {{anchor longname}} {{ parent }}{{#if parent}}.{{/if}}**{{ name }}**{{>params params}}
{{#ifCond params '||' returns }}

|Name|Type|Description|Optional|
|----|----|-----------|--------|
{{#each params}}
| {{ name }} | {{ type.names.[0] }} | {{ description }} |{{>bool optional}}|
{{/each}}
{{#each returns}}
| Returns | {{ type.names.[0] }} | {{ description }} | ... |
{{/each}}
{{/ifCond}}

{{ description }}  
{{>examples examples}}
