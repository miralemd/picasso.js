"use strict"; // eslint-disable-line

let rimraf = require('rimraf'); // eslint-disable-line import/no-unresolved
let handlebars = require('handlebars'); // eslint-disable-line import/no-unresolved
require('handlebars-helpers')({ handlebars });
let fs = require('fs');
let path = require('path');


let glob = require('glob'); // eslint-disable-line import/no-unresolved

let resolve = require('./json-path-resolver').resolve;

console.log('Generating docs...'); // eslint-disable-line no-console

const JSDOC_INPUT = 'src/docs.json';
const MD_TEMPLATES_FOLDER = 'src/templates/';
const MD_INPUT_FOLDER = 'src/input/';
const MD_OUTPUT_FOLDER = 'dist/';

function fixPath(str) {
  let find = '/picasso.js/src';
  let cut = str.indexOf(find) + find.length;
  return str.length === cut ? '' : str.substr(cut);
}

function domkdir(curpath, skipFile) {
  curpath = curpath.split('/');
  if (skipFile) {
    curpath.pop();
  }

  let rebuiltPath = [];
  for (let i = 0; i < curpath.length; i++) {
    rebuiltPath.push(curpath[i]);
    let tryPath = rebuiltPath.join('/');
    if (!fs.existsSync(tryPath)) {
      fs.mkdirSync(tryPath);
    }
  }
}

function getJSDOCData(inputFile) {
  let data = JSON.parse(fs.readFileSync(inputFile)).docs;

  let output = {};

  data.forEach((i) => {
    let filePath = (i && i.meta && fixPath(i.meta.path)) || '';

    if (filePath) {
      filePath += `/${i.meta.filename}/${i.longname}`;
      filePath = filePath.replace(/\./gi, '-');

      if (filePath.indexOf('~') !== -1) {
        filePath = filePath.replace(/~/gi, '/');
      }
      if (filePath.indexOf('#') !== -1) {
        filePath = filePath.replace(/#/gi, '/');
      }

      resolve(filePath, output, i);

      let parentFilePath = filePath.split('/');
      parentFilePath.pop();
      parentFilePath = parentFilePath.join('/');

      let parent = resolve(parentFilePath, output);
      parent.children = parent.children || [];
      parent.children.push(filePath.replace(`${parentFilePath}/`, ''));
    }
  });

  return output;
}

let jsdoc = getJSDOCData(JSDOC_INPUT);

function registerTemplates(cb) {
  glob(`${MD_TEMPLATES_FOLDER}**/*.md`, {}, (err, files) => {
    files.forEach((file) => {
      let title = file.split('/').pop().replace(/\.md/gi, '');
      let content = `${fs.readFileSync(file)}`;
      handlebars.registerPartial(title, content);
    });
    cb();
  });

  handlebars.registerPartial(undefined, '{{undefinedpartial}}');
}

handlebars.registerHelper('undefinedpartial', () => 'This partial does not exists. This may most certainly be caused by a missing file.');

function compileMarkdownFiles(jsdocdata) {
  glob(`${MD_INPUT_FOLDER}/**/*.md`, {}, (err, files) => {
    files.forEach((file) => {
      file = path.resolve(file);
      let inputBasepath = path.resolve(MD_INPUT_FOLDER);
      let relativePath = file.replace(inputBasepath, '');
      let template = handlebars.compile(`${fs.readFileSync(file)}`);

      domkdir(MD_OUTPUT_FOLDER + relativePath, true);

      jsdocdata.registry = [];
      fs.writeFileSync(MD_OUTPUT_FOLDER + relativePath, template(jsdocdata)); // Yes this is rendered twice,
      fs.writeFileSync(MD_OUTPUT_FOLDER + relativePath, template(jsdocdata)); // To generate the right registry (needs to be re-thought)
    });
  });
}

handlebars.registerHelper('ifCond', function ifCond(v1, operator, v2, options) {
  switch (operator) {
    case '==':
      return (v1 == v2) ? options.fn(this) : options.inverse(this); // eslint-disable-line eqeqeq
    case '===':
      return (v1 === v2) ? options.fn(this) : options.inverse(this);
    case '!=':
      return (v1 != v2) ? options.fn(this) : options.inverse(this);// eslint-disable-line eqeqeq
    case '!==':
      return (v1 !== v2) ? options.fn(this) : options.inverse(this);
    case '<':
      return (v1 < v2) ? options.fn(this) : options.inverse(this);
    case '<=':
      return (v1 <= v2) ? options.fn(this) : options.inverse(this);
    case '>':
      return (v1 > v2) ? options.fn(this) : options.inverse(this);
    case '>=':
      return (v1 >= v2) ? options.fn(this) : options.inverse(this);
    case '&&':
      return (v1 && v2) ? options.fn(this) : options.inverse(this);
    case '||':
      return (v1 || v2) ? options.fn(this) : options.inverse(this);
    default:
      return options.inverse(this);
  }
});

handlebars.registerHelper('anchor', (name) => {
  name = encodeURIComponent(name);
  jsdoc.registry = jsdoc.registry || [];
  jsdoc.registry.push(name);
  return new handlebars.SafeString(
    `<a name='${name}' href='#${name}'>#</a>`
  );
});

rimraf.sync(`${MD_OUTPUT_FOLDER}*`);

// fs.writeFileSync('jsdoc-restruct.json', JSON.stringify(jsdoc));

registerTemplates(() => { compileMarkdownFiles(jsdoc); });
