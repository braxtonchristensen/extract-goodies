#!/usr/bin/env node

const program = require('commander');
const path = require('path');
const walk = require('walk');
const readChunk = require('read-chunk');
const fileType = require('file-type');
const fs = require('fs');
const acceptedMimeTypes = [
  'image/jpeg',
  'image/png',
  'video/quicktime',
  'video/mpeg'
];

program
  .version('0.0.1')
  .command('extract <dir> <output>')
  .action((dir, output) => {
    const abs = path.resolve(process.cwd(), dir);
    const walker = walk.walk(abs);
    const target = fs.mkdirSync(path.resolve(process.cwd(), output));

    walker.on('file', (root, file, next) => {
      const filePath = path.resolve(root, file.name);
      const buffer = readChunk.sync(filePath, 0, 262);
      const type = fileType(buffer);
      if (type !== null && acceptedMimeTypes.indexOf(type.mime) !== -1) {
        fs.createReadStream(filePath)
          .pipe(fs.createWriteStream(path.resolve(process.cwd(), output, file.name)));

        console.log(`Extracting ${file.name}`);
      }
      next();
    });

    walker.on('error', (root, stats, next) => {
      stats.forEach(function (n) {
        console.error('[ERROR] ' + n.name)
        console.error(n.error.message || (n.error.code + ': ' + n.error.path));
      });
      next();
    });

    walker.on('end', () => {
      console.log('Photo extractification complete!');
    });

  });


program.parse(process.argv);
