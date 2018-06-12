const colors = require('colors');

const makeRed = (txt) => colors.red(txt);
const makeGreen = (txt) => colors.green(txt);

module.exports = { makeRed, makeGreen};
