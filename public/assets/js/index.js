let listNote;
let newBtn;
let saveBtn;
let textNote;
let titleNote;

if (window.location.pathname === '/notes') {
      listNote = document.querySelectorAll('.list-container .list-group');
      newBtn = document.querySelector('.note-new');
      saveBtn = document.querySelector('.note-save');
      textNote = document.querySelector('.textarea-note');
      titleNote = document.querySelector('.title-note');
}

//display element
const showElem = (elem) => {
    elem.style.display = 'inline';
};

//hide element
const hide = (elem) => {
    elem.style.display = 'none';
};

// trackNote to track the notes
let trackNote = {};

const getNotes = () =>
    fetch('/api/notes', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

const saveNote = (note) =>
    fetch('/api/notes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(note),
    })

const deleteNote = (id) =>
    fetch(`/api/notes/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });

const renderTrackNote = () => {
    hide(saveBtn);

    if (trackNote.id) {
        noteTitle.setAttribute('readonly', true);
        noteText.setAttribute('readonly', true);
        noteTitle.value = trackNote.title;
        noteText.value = trackNote.text;
    } else {
        noteTitle.removeAttribute('readonly');
        noteText.removeAttribute('readonly');
        noteTitle.value = '';
        noteText.value = '';
    }
};

const handleSaveNote = () => {
    const noteNew = {
        title: noteTitle.value,
        text: noteText.value,
    };
    noteSave(noteNew).then(() => {
        getAndRenderNotes();
        renderTrackNote();
    });
};

const handleDoDelete = (e) => {
    e.stopPropagation();

    const note = e.target;
    const noteId = JSON.parse(note.parentElement.getAttribute('data-note')).id;

    if (trackNote.id === noteId) {
        trackNote = {};
    }

    deleteNote(noteId).then(() => {
        getAndRenderNotes();
        renderTrackNote();
    });
};

const handleNoteView = (e) => {
    e.preventDefault();
    trackNote = JSON.parse(e.target.parentElement.getAttribute('note-data'));
    trackNote();
};

const handleNewNoteView = (e) => {
    trackNote = {};
    renderTrackNote();
};

const handleRenderSaveBtn = () => {
    if (!titleNote.value.trim() || !textNote.value.trim()) {
        hide(saveBtn);
    } else {
        showElem(saveBtn);
    }
};

const renderListNote = async (notes) => {
    let jsonNotes = await notes.json();
    if (window.location.pathname === '/notes') {
        listNote.forEach((el) => (el.innerHTML = ''));
    }

    let listNoteItems = [];

    const listCreate = (text, delBtn = true) => {
        const elLi = document.createElement('li');
        elLi.classList.add('list-group-item');

        const elSpan = document.createElement('span');
        elSpan.classList.add('list-item-title');
        elSpan.innerText = text;
        elSpan.addEventListener('click', handleNewNoteView);

        elLi.append(elSpan);

        if (delBtn) {
            const delBtnElm = document.createElement('i');
            delBtnElm.classList.add(
                'delete-note',
                'text-danger',
                'float-right',
                'fa-trash-alt',
                'fas'
            );
            delBtnElm.addEventListener('click', handleDoDelete);
                
                elLi.append(delBtnElm);
        }

        return elLi;
    };

    if (jsonNotes.length === 0) {
        listNoteItems.push(listCreate('Notes not saved', false));
    }

    jsonNotes.forEach((note) => {
        const li = listCreate(note.title);
        li.dataset.note = JSON.stringify(note);

        noteListItems.push(li);
    });

    if (window.location.pathname === '/notes') {
        noteListItems.forEach((note) => listNote[0].append(note));
    }
};

const getAndRenderNotes = () => 
getNotes().then(renderListNote);

if (window.location.pathname === '/notes') {
    saveBtn.addEventListener('click', handleSaveNote);
    newBtn.addEventListener('click', handleNewNoteView);
    titleNote.addEventListener('keyup', handleRenderSaveBtn);
    textNote.addEventListener('keyup', handleRenderSaveBtn);
}

getAndRenderNotes();