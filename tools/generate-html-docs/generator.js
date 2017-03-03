const fs = require('fs');
const path = require('path').posix;

const Handlebars = require('handlebars');
const marked = require('marked');

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false
});

function readFile(file) {
  return fs.readFileSync(file, 'utf-8');
}

function writeFile(file, contents) {
  fs.writeFileSync(file, contents, 'utf-8');
}

function recursiveDirectoryBuilder(pathToBuild) {
  let paths = pathToBuild.split('/');
  paths.pop();
  let dir = [];
  let compiledDir = '';

  while (paths.length) {
    dir.push(paths.shift());
    compiledDir = dir.join('/');

    if (compiledDir && !fs.existsSync(compiledDir)) {
      fs.mkdirSync(compiledDir);
    }
  }
}

function toTitleCase(input) {
  if (input && input.length > 2) {
    return input.split(' ')
     .map(i => i[0].toUpperCase() + i.substr(1).toLowerCase())
     .join(' ');
  }
  return input;
}

const template = Handlebars.compile(readFile(path.resolve(__dirname, 'template.html')));

function kebabToCamelCase(value) {
  value = value.split('/').join(' / ');
  return value[0].toUpperCase() + value.substr(1).replace(/-([a-z])/g, g => ` ${g[1].toUpperCase()}`);
}

function generateFile(opts) {
  const rootPath = Array(opts.dest.replace(path.resolve(__dirname, '.'), '').split('/').length - 2).fill('../').join('');
  const distPath = `${rootPath}dist/`;
  const markdown = readFile(opts.src);
  const content = marked(markdown);

  const sidebarItems = opts.files.map(filename => (
`<li>
  <a href="${distPath}${filename}.html">${kebabToCamelCase(filename)}</a>
</li>
`
  ));

  const html = template({
    content,
    sidebar: `<ul>${sidebarItems.join('')}</ul>`,
    title: toTitleCase(opts.title),
    rootPath
  });

  recursiveDirectoryBuilder(opts.dest);

  writeFile(opts.dest, html);
}


module.exports = {
  generateFile
};
