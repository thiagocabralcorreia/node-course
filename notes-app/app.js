const validator = require('validator');
const chalk = require('chalk');

const command = process.argv[2];

if (command === 'add') {
  console.log('Adding note.');
} else if (command === 'remove') {
  console.log('Removing note.');
}

console.log(process.argv);
