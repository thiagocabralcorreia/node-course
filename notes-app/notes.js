const fs = require('fs');
const chalk = require('chalk');

const loadNotes = () => {
  try {
    const dataBuffer = fs.readFileSync('notes.json');
    const dataJSON = dataBuffer.toString();
    return JSON.parse(dataJSON);
  } catch (e) {
    return [];
  }
};

const notes = loadNotes();

const addNotes = (title, body) => {
  const duplicateNote = notes.find((note) => {
    return note.title === title;
  });

  if (!duplicateNote) {
    notes.push({
      title,
      body,
    })
    console.log(chalk.green.inverse('Note added.'));
  } else {
    console.log(chalk.red.inverse('Note title taken.'));
  }

  saveNotes(notes);
};

const removeNotes = (title) => {
  const notesToKeep = notes.filter((note) => {
    return note.title !== title;
  });

  if (notes.length > notesToKeep.length) {
    console.log(chalk.green.inverse('Note removed.'));
    saveNotes(notesToKeep);
  } else {
    console.log(chalk.red.inverse('No note found.'));
  }
};

const listNotes = () => {
  console.log(chalk.green.inverse('Your notes:'));

  notes.forEach((note) => {
    console.log(note.title);
  });
};

const readNotes = (title) => {
  const note = notes.find((note) => note.title === title);

  if (note) {
    console.log(chalk.inverse(note.title));
    console.log(note.body);
  } else {
    console.log(chalk.red.inverse('Note not found!'));
  }
};

const saveNotes = (notes) => {
  const dataJSON = JSON.stringify(notes);
  fs.writeFileSync('notes.json', dataJSON);
};

module.exports = {
  addNotes: addNotes,
  removeNotes: removeNotes,
  listNotes: listNotes,
  readNotes: readNotes
};
