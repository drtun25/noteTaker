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


const handleNoteView = function() {
  activeNote = $(this).data();
  renderActiveNote();
};

const handleNewNoteView = function() {
  activeNote = {};
  renderActiveNote();
};

const handleRenderSaveBtn = function() {
  if (!$noteTitle.val().trim() || !$noteText.val().trim()) {
    $saveNoteBtn.hide();
  } else {
    $saveNoteBtn.show();
  }
};

// Render's the list of note titles
const renderNoteList = function(notes) {
  $noteList.empty();

  const noteListItems = [];

  for (let i = 0; i < notes.length; i++) {
    const note = notes[i];

    const $li = $("<li class='list-group-item'>").data(note);
    const $span = $('<span>').text(note.title);
    const $delBtn = $(
      "<i class='fas fa-trash-alt float-right text-danger delete-note'>"
    );

    $li.append($span, $delBtn);
    noteListItems.push($li);
  }

  $noteList.append(noteListItems);
};


let getAndRenderNotes = function() {
  return getNotes().then(function(data) {
    renderNoteList(data);
  });
};

$saveNoteBtn.on('click', handleNoteSave);
$noteList.on('click', '.list-group-item', handleNoteView);
$newNoteBtn.on('click', handleNewNoteView);
$noteList.on('click', '.delete-note', handleNoteDelete);
$noteTitle.on('keyup', handleRenderSaveBtn);
$noteText.on('keyup', handleRenderSaveBtn);

// Gets and renders the initial list of notes
getAndRenderNotes();

