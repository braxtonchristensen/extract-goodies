#!/usr/bin/env node

const program = require('commander');
const path = require('path');
const walk = require('walk');
const readChunk = require('read-chunk');
const fileType = require('file-type');
const fs = require('fs');
const { makeGreen, makeRed } = require('./colorize');

const acceptedMimeTypes = [
  'image/jpeg',
  'image/png',
  'video/quicktime',
  'video/mpeg'
];

const updateFileName = (target) => {
  const pathArr = target.split('/');
  const fileName = pathArr.slice(-1)[0].split('.');
  fileName.splice(fileName.length - 1, 0, ` ${Date.now()}.`);
  const newFileName = fileName.join('');
  pathArr.pop();

  return [...pathArr, newFileName].join('/');
}

const writeFile = ({path, target, file}) => {
  fs.createReadStream(path)
    .pipe(fs.createWriteStream(target));

  console.log(makeGreen(`Extracting ${file.name}`));
}

const handleExisting = (writeOptions, {overwrite, keep}) => {
  if (keep) {
    const { target, ...rest } = writeOptions;
    return writeFile({target: updateFileName(target), ...rest})
  }
  if (overwrite) {
    return writeFile(writeOptions);
  }

  console.log(makeRed(`${writeOptions.file.name} exists, skipping for now.`));
}

program
  .version('0.0.1')
  .command('imgs <input> <output>')
  .option('-o, --overwrite', 'Overwrite duplicates')
  .option('-k, --keep', 'Keep duplicates')
  .action((input, output, cmd) => {
    const abs = path.resolve(process.cwd(), input);
    const walker = walk.walk(abs);
    if (!fs.existsSync(path.resolve(process.cwd(), output))) {
      fs.mkdirSync(path.resolve(process.cwd(), output));
    }

    walker.on('file', (root, file, next) => {
      const target = path.resolve(process.cwd(), output, file.name);
      const filePath = path.resolve(root, file.name);
      const buffer = readChunk.sync(filePath, 0, 262);
      const type = fileType(buffer);
      const exists = fs.existsSync(target);
      const writeOptions = {
        file,
        target,
        path: filePath,
      };

      if (type !== null && acceptedMimeTypes.indexOf(type.mime) !== -1) {
        if (exists) {
          handleExisting(writeOptions, cmd);
          return next();
        }

        writeFile(writeOptions);
      }
      next();
    });

    walker.on('error', (root, stats, next) => {
      stats.forEach((n) => {
        console.error('[ERROR] ' + n.name);
        console.error(n.error.message || (n.error.code + ': ' + n.error.path));
      });
      next();
    });

    walker.on('end', () => {
      console.log('Photo extractification complete!');
    });

  });


program.parse(process.argv);
