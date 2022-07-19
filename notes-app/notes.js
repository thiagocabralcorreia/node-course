const fs = require('fs');

const getNotes = () => {
  return 'Your notes...';
};

const addNotes = (title, body) => {
  const notes = loadNotes();
  const duplicateNotes = notes.filter(function (note) {
    return note.title === title;
  })

  if (duplicateNotes.length === 0) {
    notes.push({
      title,
      body,
    })
    console.log('Note added.');
  } else {
    console.log('Note title taken.');
  }

  saveNotes(notes);
};

const saveNotes = (notes) => {
  const dataJSON = JSON.stringify(notes);
  fs.writeFileSync('notes.json', dataJSON);
};

const loadNotes = () => {
  try {
    const dataBuffer = fs.readFileSync('notes.json');
    const dataJSON = dataBuffer.toString();
    return JSON.parse(dataJSON);
  } catch (e) {
    return [];
  }
};

module.exports = {
  getNotes: getNotes,
  addNotes: addNotes
};
