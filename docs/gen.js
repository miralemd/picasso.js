"use strict"; // eslint-disable-line

const rimraf = require('rimraf'); // eslint-disable-line import/no-unresolved
const handlebars = require('handlebars'); // eslint-disable-line import/no-unresolved
require('handlebars-helpers')({ handlebars }); // eslint-disable-line import/no-unresolved
const fs = require('fs');
const path = require('path');


const glob = require('glob'); // eslint-disable-line import/no-unresolved

const resolve = require('./json-path-resolver').resolve;

function log(msg) {
  console.log(msg);// eslint-disable-line no-console
}

log('Generating docs...');

const JSDOC_INPUT = 'src/docs.json';
const MD_TEMPLATES_FOLDER = 'src/templates/';
const MD_INPUT_FOLDER = 'src/input/';
const MD_OUTPUT_FOLDER = 'dist/';
const POSTPROCESS_ROOT = 'src/';

const toPostProcess = [];

function fixPath(str) {
  if (path.sep === '\\') {
    // change path separator for windows paths
    str = str.replace(/\\/g, '/');
  }
  const find = '/picasso.js/src';
  const cut = str.indexOf(find) + find.length;
  return str.length === cut ? '' : str.substr(cut);
}

function domkdir(curpath, skipFile) {
  curpath = curpath.split('/');
  if (skipFile) {
    curpath.pop();
  }

  const rebuiltPath = [];
  for (let i = 0; i < curpath.length; i++) {
    rebuiltPath.push(curpath[i]);
    const tryPath = rebuiltPath.join('/');
    if (!fs.existsSync(tryPath)) {
      fs.mkdirSync(tryPath);
    }
  }
}

function getJSDOCData(inputFile) {
  const data = JSON.parse(fs.readFileSync(inputFile)).docs;

  const output = {};

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

      const parent = resolve(parentFilePath, output);
      parent.children = parent.children || [];
      parent.children.push(filePath.replace(`${parentFilePath}/`, ''));
    }
  });

  return output;
}

const jsdoc = getJSDOCData(JSDOC_INPUT);

/**
 * TEMPLATES
 */
function registerTemplates(cb) {
  glob(`${MD_TEMPLATES_FOLDER}**/*.md`, {}, (err, files) => {
    files.forEach((file) => {
      const title = file.split('/').pop().replace(/\.md/gi, '');
      const content = `${fs.readFileSync(file)}`;
      handlebars.registerPartial(title, content);
    });
    cb();
  });

  handlebars.registerPartial(undefined, '{{undefinedpartial}}');
}

handlebars.registerHelper('undefinedpartial', () => 'This partial does not exists. This may most certainly be caused by a missing file.');

/**
 * POSTPROCESS
 */
function postProcessTemplate(item) {
  return `#%#%#%#%# DOCS-GEN-POSTPROCESS: ${item} #%#%#%#%#`;
}

handlebars.registerHelper('postprocess', (item) => {
  toPostProcess.push(item);

  return postProcessTemplate(item);
});

function doPostProcess(content, jsdocdata) {
  toPostProcess.forEach((item) => {
    const itemTemplate = handlebars.compile(fs.readFileSync(path.resolve(`${POSTPROCESS_ROOT}${item}.md`)).toString());

    content = content.replace(postProcessTemplate(item), itemTemplate(jsdocdata));
  });
  return content;
}

/**
 * COMPILATION OF INPUT FOLDER FILES
 */
function compileMarkdownFiles(jsdocdata) {
  glob(`${MD_INPUT_FOLDER}/**/*.md`, {}, (err, files) => {
    files.forEach((file) => {
      file = path.resolve(file);
      const inputBasepath = path.resolve(MD_INPUT_FOLDER);
      const relativePath = file.replace(inputBasepath, '');
      const template = handlebars.compile(`${fs.readFileSync(file)}`);
      let title = path.basename(file, '.md');

      title = title.charAt(0).toUpperCase() + title.substr(1);

      domkdir(MD_OUTPUT_FOLDER + relativePath, true);

      jsdocdata.registry = [];
      jsdocdata.title = title;

      log(`Processing file ${relativePath}`);

      let output = template(jsdocdata);

      output = doPostProcess(output, jsdocdata);

      fs.writeFileSync(MD_OUTPUT_FOLDER + relativePath, output);
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

handlebars.registerHelper('no', v => v || 'No');
handlebars.registerHelper('nocust', (v, fb) => v || (fb || 'No'));

handlebars.registerHelper('helperMissing', (context) => {
  log(`Template defines {{ ${context.name} }}, but not provided in context`);
  return '';
});

rimraf.sync(`${MD_OUTPUT_FOLDER}*`);

fs.writeFileSync('src/jsdoc-restruct.json', JSON.stringify(jsdoc));

registerTemplates(() => { compileMarkdownFiles(jsdoc); });
