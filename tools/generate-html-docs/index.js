const path = require('path');
const fs = require('fs');

const generateFile = require('./generator').generateFile;

const files = fs.readdirSync(path.resolve(__dirname, '../../docs/dist/')).filter(f => /\.md$/.test(f)).map(f => f.replace(/\.md$/, ''));

files.forEach(file => generateFile({
  src: path.resolve(__dirname, `../../docs/dist/${file}.md`),
  dest: path.resolve(__dirname, `./dist/${file}.html`),
  files
}));

generateFile({
  src: path.resolve(__dirname, '../../README.md'),
  dest: path.resolve(__dirname, './dist/index.html'),
  files
});
