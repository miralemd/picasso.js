const path = require('path').posix;
const fs = require('fs');

const generateFile = require('./generator').generateFile;

const files = fs.readdirSync(path.resolve(__dirname, '../../docs/dist/')).filter(f => /\.md$/.test(f)).map(f => f.replace(/\.md$/, ''));

const filesToPrint = ['index', ...files];

files.forEach(file => generateFile({
  src: path.resolve(__dirname, `../../docs/dist/${file}.md`),
  dest: path.resolve(__dirname, `./dist/${file}.html`),
  files: filesToPrint,
  title: file
}));

generateFile({
  src: path.resolve(__dirname, '../../README.md'),
  dest: path.resolve(__dirname, './dist/index.html'),
  files: filesToPrint,
  title: 'Index'
});
