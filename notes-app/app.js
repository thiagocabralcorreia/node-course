const validator = require('validator');
const chalk = require('chalk')

const getNotes = require('./notes.js');

const msg = getNotes();

console.log(msg);

console.log(validator.isEmail('tcc@email.com'));

const greenMsg = chalk.bold.green('Success!')
console.log(greenMsg)
