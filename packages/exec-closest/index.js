#!/usr/bin/env node

const execSync = require('child_process').execSync;
const patheExists = require('path-exists');
const path = require('path');

const curwd = process.cwd();

let args = process.argv.slice(2).map((item) => {
  if (item.indexOf(' ') >= 0) {
    return `"${item.replace('"', '\\"')}"`;
  }
  return item;
});

let result = false;

['.', '..', '../../', '../../../', '../../../../'].forEach((item) => {
  if (!result) {
    let trypath = path.resolve(curwd, item, './node_modules/.bin/', args[0]);
    if (patheExists.sync(trypath)) {
      result = path.relative(curwd, trypath);
    }
  }
});

if (result) {
  args[0] = result;

  const cmd = `${args.join(' ')}`;

  execSync(cmd, {
    cwd: curwd,
    env: process.env,
    stdio: 'inherit'
  });
} else {
  console.log('Could not find any package');
  process.exit(1);
}
