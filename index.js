#!/usr/bin/env node

const glob = require('glob');
const { File } = require('./far');

function loadFile (fn) {
  return new File(fn);
}

if (process.argv.length < 3) {
  console.error('Usage: far [path|glob|file] [expr]');
  process.exit(1);
}
const path = process.argv[2] === '-' ? '/dev/stdin' : process.argv[2];
const expr = process.argv[3] || '.help()';

if (path === '-h') {
  loadFile().help();
  process.exit(0);
}

glob(path, (err, files) => {
  if (err) {
    throw err;
  }
  files.forEach((fileName) => {
    try {
      eval('loadFile(fileName)' + expr);
    } catch (e) {
      console.error(fileName + ': ' + e.toString());
      process.exitValue = 1;
    }
  });
});
