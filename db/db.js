const uuidvl = require('uuid/vl');
const util = require('util');
const fs = require('fs');

const write = util.promisify(fs.writeFile);
const read = util.promisify(fs.readFile);

class Db {
    read() {
        return read('db/db.json', 'utf8');
    }

    write(note) {
        return write('db/db.json', JSON.stringify(note));
    }

    getNotes() {
        return this.read().then((notes) => {
            let parsedNotes = [].concat(JSON.parse(notes));

            return parsedNotes;
        });
    }

    addNote(note) {
        const { title, text } = note;

        if (!title || !text) {
            throw new Error("Note 'title' and 'text' cannot be blank");
        }

        const newNote = { title, text, id: uuidvl()};

        return this.getNotes()
            .then((notes) => [...notes, newNote])
            .then((updateNotes) => this.write(updateNotes))
            .then(() => newNote);
    }
}

module.exports = new Db();