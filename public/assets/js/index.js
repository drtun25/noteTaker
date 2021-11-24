const $noteTitle = $('.title-note');
const $noteText = $('.textarea-note');
const $saveNoteBtn = $('.note-new');
const $newNoteBtn = $('.note-save');
const $noteList = $('.list-container .list-group');

let activeNote = {};

//get notes from db
const getNotes = function() {
  return $.ajax({
    url: '/api/notes',
    method: 'GET',
  });
};

//save
const saveNote = function(note) {
    return $.ajax({
      url: '/api/notes',
      data: note,
      method: 'POST',
    });
  };

// delete
const deleteNote = function(id) {
    return $.ajax({
      url: `api/notes/${id}`,
      method: 'DELETE',
    });
  };

const renderActiveNote = function() {
  $saveNoteBtn.hide();

  if (activeNote.id) {
    $noteTitle.attr('readonly', true);
    $noteText.attr('readonly', true);
    $noteTitle.val(activeNote.title);
    $noteText.val(activeNote.text);
  } else {
    $noteTitle.attr('readonly', false);
    $noteText.attr('readonly', false);
    $noteTitle.val('');
    $noteText.val('');
  }
};


const handleNoteSave = function() {
    const newNote = {
      title: $noteTitle.val(),
      text: $noteText.val(),
    };
  
    saveNote(newNote).then(function(data) {
      getAndRenderNotes();
      renderActiveNote();
    });
  };

const handleNoteDelete = function(event) {
  // prevents the click listener for the list from being called when the button inside of it is clicked
  event.stopPropagation();

  const note = $(this)
    .parent('.list-group-item')
    .data();

  if (activeNote.id === note.id) {
    activeNote = {};
  }

  deleteNote(note.id).then(function() {
    getAndRenderNotes();
    renderActiveNote();
  });
};

