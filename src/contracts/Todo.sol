// SPDX-License-Identifier: UNLICENSE

pragma solidity >=0.8.0;

/// @notice Todo contract
contract Todo {

    event CreateNote(address indexed author, uint256 noteId);
    event UpdateNote(address indexed author, uint256 noteId);
    event DeleteNote(address indexed author, uint256 noteId);

    struct Note {
        uint256 lastModified;
        string title;
        string note;
        bool completed;
        string tag;
    }

    mapping(address => Note[]) notes;

    /// @notice Add a new note to contract
    /// @param _title Title of new note to add
    /// @param _note Note content of new note to add
    /// @param _tag Category of new note
    function addNote(
        string calldata _title, 
        string calldata _note, 
        string calldata _tag
    ) external {
        require(bytes(_title).length > 0, "Invalid title entered");
        require(bytes(_note).length > 0, "Invalid note entered");
        require(bytes(_tag).length > 0, "Invalid tag entered");
        Note memory newNote = Note(block.timestamp, _title, _note, false, _tag);
        notes[msg.sender].push(newNote);
        emit CreateNote(msg.sender, (notes[msg.sender].length - 1));
    }

    /// @notice Set the `completed` property of a note to true
    /// @param _noteId Index of note to update
    function setCompleted(uint256 _noteId) external {
        Note[] storage privateNotes = notes[msg.sender];
        require(!privateNotes[_noteId].completed, "Note status is already set to completed.");
        privateNotes[_noteId].completed = true;
        privateNotes[_noteId].lastModified = block.timestamp;
        emit UpdateNote(msg.sender, _noteId);
    }

    /// @notice Deletes a note from contract
    /// @param _noteId Index of note to delete
    function deleteNote(uint256 _noteId) external {
        Note[] storage privateNotes = notes[msg.sender];
        privateNotes[_noteId] = privateNotes[privateNotes.length - 1];
        privateNotes.pop();
        emit DeleteNote(msg.sender, _noteId);  
    }

    /// @notice Returns all notes belonging to msg sender
    /// @return An array of Notes
    function getNotes() external view returns (Note[] memory) {
        Note[] memory _notes = notes[msg.sender];
        return _notes;
    }

}