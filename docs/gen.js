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
const CODE_FOLDER = '../src/';

const toPostProcess = [];

function fixPath(str) {
  return path.relative(CODE_FOLDER, str);
}

function domkdir(curpath, skipFile) {
  let tryPath = curpath;
  if (skipFile) {
    tryPath = path.dirname(tryPath);
  }
  // find missing directories
  let dirs = [];
  while (tryPath && !fs.existsSync(tryPath)) {
    dirs.push(tryPath);
    tryPath = path.dirname(tryPath);
  }
  // create them
  for (let i = dirs.length - 1; i >= 0; --i) {
    fs.mkdirSync(dirs[i]);
  }
}

function traverseTypdef(def) {
  let nested = {};
  if (!def.properties) {
    return;
  }
  def.properties.forEach((prop) => {
    if (prop.type.names[0] === 'object') { // might have nested props
      nested[prop.name] = prop;
      prop._nested = [];
    }
    if (/\./gi.test(prop.name)) {
      let names = prop.name.split('.');
      let pp = {
        name: names[names.length - 1],
        description: prop.description,
        type: prop.type,
        defaultvalue: prop.defaultvalue,
        optional: prop.optional
      };

      let container = nested[names[0]];
      if (names.length === 2) {
        nested[names[0]]._nested.push(pp);
      } else {
        for (let n = 0; n < names.length - 1; n++) {
          if (!container._nested) {
            container._nested = [];
          }
          let foo = container._nested.filter(f => f.name === names[n + 1])[0];
          if (foo) {
            container = foo;
          }
        }
        container._nested.push(pp);
      }
      prop.skip = true;
    }
  });
}

function getJSDOCData(inputFile) {
  const data = JSON.parse(fs.readFileSync(inputFile)).docs;

  const output = {};

  data.forEach((i) => {
    let filePath = (i && i.meta && fixPath(i.meta.path)) || '';

    if (filePath) {
      filePath = path.join(filePath, i.meta.filename, i.longname);
      filePath = filePath.replace(/\./gi, '-');

      if (filePath.indexOf('~') !== -1) {
        filePath = filePath.replace(/~/gi, path.sep);
      }
      if (filePath.indexOf('#') !== -1) {
        filePath = filePath.replace(/#/gi, path.sep);
      }

      resolve(filePath, output, i);

      let parentFilePath = path.dirname(filePath);

      const parent = resolve(parentFilePath, output);
      parent.children = parent.children || [];
      parent.children.push(path.basename(filePath));
    }
    if (i.kind === 'typedef') {
      traverseTypdef(i);
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
      const title = path.basename(file, '.md');
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
      const relativePath = path.relative(MD_INPUT_FOLDER, file);
      const template = handlebars.compile(`${fs.readFileSync(file)}`);
      let title = path.basename(file, '.md');

      title = title.charAt(0).toUpperCase() + title.substr(1);

      domkdir(path.join(MD_OUTPUT_FOLDER, relativePath), true);

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

handlebars.registerHelper('ifDefined', function ifDefined(value, options) {
  return typeof value !== 'undefined' ? options.fn(this) : options.inverse(this);
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
