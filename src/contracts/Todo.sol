// SPDX-License-Identifier: UNLICENSE

pragma solidity >=0.8.0;

contract Todo {
    event CreateNote(address indexed author, uint256 noteId);
    event UpdateNote(address indexed author, uint256 noteId);
    event DeleteNote(address indexed author, uint256 noteId);

    struct Note {
        uint256 noteId;
        uint256 lastModified;
        string title;
        string note;
        bool completed;
        string tag;
    }

    // keep track of fall the notes
    mapping(address => Note[]) notes;
    // generate new id for each note
    uint256 idController;

    // add new note
    function addNote(
        string calldata _title, 
        string calldata _note, 
        string calldata _tag
    ) external {
        Note memory newNote = Note(idController, block.timestamp, _title, _note, false, _tag);
        notes[msg.sender].push(newNote);
        idController++;
        emit CreateNote(msg.sender, idController);
    }

    // set a note to completed
    function setCompleted(uint256 _noteId) external returns (bool) {
        Note[] storage privateNotes = notes[msg.sender];
        for (uint i = 0; i < privateNotes.length; i++) {
            if (privateNotes[i].noteId == _noteId) {
                privateNotes[i].completed = true;

                notes[msg.sender] = privateNotes;
                emit UpdateNote(msg.sender, _noteId);
                return true;
            }
        }

        return false;
    }

    // delete a note
    function deleteNote(uint256 _noteId) external returns (bool) {
        Note[] storage privateNotes = notes[msg.sender];
        for (uint i = 0; i < privateNotes.length; i++) {
            if (privateNotes[i].noteId == _noteId) {
                privateNotes[i] = privateNotes[privateNotes.length - 1];
                privateNotes.pop();                
                
                notes[msg.sender] = privateNotes;
                emit DeleteNote(msg.sender, _noteId);
                return true;
            }
        }
        return false;
    }

    // get note belonging to message sender
    function getNotes() external view returns (Note[] memory) {
        Note[] memory _notes = notes[msg.sender];
        return _notes;
    }

}