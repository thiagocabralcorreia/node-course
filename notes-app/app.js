const yargs = require('yargs');
const validator = require('validator');
const notes = require('./notes');

// Customize yargs version
yargs.version('1.1.0');

// Create add command
yargs.command({
  command: 'add',
  describe: 'Add a note',
  builder: {
    title: {
      describe: 'Note title',
      demandOption: true,
      type: 'string'
    },
    body: {
      describe: 'Note body',
      demandOption: true,
      type: 'string'
    }
  },
  handler(argv) {
    notes.addNotes(argv.title, argv.body);
  }
});

// Create remove command
yargs.command({
  command: 'remove',
  describe: 'Remove a note',
  builder: {
    title: {
      describe: 'Note title',
      demandOption: true,
      type: 'string'
    }
  },
  handler(argv)  {
    notes.removeNotes(argv.title);
  }
});

// Create list command
yargs.command({
  command: 'list',
  describe: 'List your notes',
  builder: {
    title: {
      describe: 'Note title',
      demandOption: true,
      type: 'string'
    }
  },
  handler() {
    notes.listNotes();
  }
});

// Create read command
yargs.command({
  command: 'read',
  describe: 'Read a note',
  handler(argv) {
    notes.readNotes(argv.title);
  }
});

yargs.parse();
