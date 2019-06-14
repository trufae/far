#!/usr/bin/env node

const glob = require('glob');
const { File } = require('./far');

function loadFile (fn) {
  return new File(fn);
}

if (process.argv.length < 3) {
  console.error('Usage: far [expr] [path|glob|file]');
  process.exit(1);
}
const path = process.argv[3] === '-' ? ['/dev/stdin'] : process.argv.slice(3);
const expr = process.argv[3]?process.argv[2] : '.help()';

if (path === '-h') {
  loadFile().help();
  process.exit(0);
}

for (let p of path) {
  glob(p, (err, files) => {
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
}
