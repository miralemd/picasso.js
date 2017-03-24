{{#if defaultvalue ~}}
  {{~{defaultvalue}~}}
{{~else~}}
  {{~#ifCond type.names.[0] '===' 'string'}}'foo'{{/ifCond~}}
  {{~#ifCond type.names.[0] '===' 'boolean'}}true{{/ifCond~}}
  {{~#ifCond type.names.[0] '===' 'number'}}3.14{{/ifCond~}}
  {{~#ifCond type.names.[0] '===' 'function'}}() => {}{{/ifCond~}}
  {{~#ifCond type.names.[0] '===' 'Array.<string>'}}['a', 'b']{{/ifCond~}}
  {{~#ifCond type.names.[0] '===' 'Array.<number>'}}[3, 7]{{/ifCond~}}
{{~/if~}}
