const fs = require('fs');
const path = require('path');

const Handlebars = require('handlebars');
const marked = require('marked');

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false
});

function readFile(file) {
  return fs.readFileSync(file, 'utf-8');
}

function writeFile(file, contents) {
  fs.writeFileSync(file, contents, 'utf-8');
}

const template = Handlebars.compile(readFile(path.resolve(__dirname, 'template.html')));

function kebabToCamelCase(value) {
  return value[0].toUpperCase() + value.substr(1).replace(/-([a-z])/g, g => ` ${g[1].toUpperCase()}`);
}

function generateFile(opts) {
  const markdown = readFile(opts.src);
  const content = marked(markdown);

  const sidebarItems = opts.files.map(filename => (
`<li>
  <a href="./${filename}.html">${kebabToCamelCase(filename)}</a>
</li>
`
  ));

  const html = template({
    content,
    sidebar: `<ul>${sidebarItems.join('')}</ul>`
  });
  writeFile(opts.dest, html);
}


module.exports = {
  generateFile
};
