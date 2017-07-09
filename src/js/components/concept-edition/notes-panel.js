import React from 'react';
import PropTypes from 'prop-types';
import NotesTab from './notes-tab';
import NoteEdition from './note-edition';
const noteTypes = [
  {
    title: dictionary.notes.scopeNote,
    //TODO should be highlighted only if
    //`disseminationStatus.includes('Public')`
    highlightIfFrEmpty: true,
    noteFrName: 'definitionCourteFr',
    noteEnName: 'definitionCourteEn',
  },
  {
    title: dictionary.notes.definition,
    highlightIfFrEmpty: true,
    noteFrName: 'definitionFr',
    noteEnName: 'definitionEn',
  },

  {
    title: dictionary.notes.editorialeNote,
    highlightIfFrEmpty: false,
    noteFrName: 'noteEditorialeFr',
    noteEnName: 'noteEditorialeEn',
  },
  {
    title: dictionary.notes.changeNote,
    highlightIfFrEmpty: false,
    noteFrName: 'changeNoteFr',
    noteEnName: 'changeNoteEn',
  },
];

//TODO structuring data in the state to make `fr` and `en` two attributes of an
//object might be a better option to organize the code efficiently.
function NotesPanel({ conceptGeneral }) {
  const note = <NoteEdtion />;
  return (
    <ul className="nav nav-tabs nav-justified">
      noteTypes.map(({(title, noteFrName, noteEnName)}) =>
      <NotesTab title={title}>
        <NoteEdition
          noteFr={conceptGeneral[noteFrName]}
          noteEn={conceptGeneral[noteEnName]}
          handleChangeFr={handlers[noteFrName]}
          handleChangeEn={handlers[noteEnName]}
        />
      </NotesTab>)
    </ul>
  );
}

NotesPanel.propTypes = {
  conceptGeneral: PropTypes.shape({
    definitionCourteFr: PropTypes.string.isRequired,
    definitionCourteEn: PropTypes.string.isRequired,
    definitionFr: PropTypes.string.isRequired,
    definitionEn: PropTypes.string.isRequired,
    noteEditorialeFr: PropTypes.string.isRequired,
    noteEditoraleEn: PropTypes.string.isRequired,
    changeNoteFr: PropTypes.string.isRequired,
    changeNoteEn: PropTypes.string.isRequired,
  }),
  handlers: PropTypes.shape({
    definitionCourteFr: PropTypes.func.isRequired,
    definitionCourteEn: PropTypes.func.isRequired,
    definitionFr: PropTypes.func.isRequired,
    definitionEn: PropTypes.func.isRequired,
    noteEditorialeFr: PropTypes.func.isRequired,
    noteEditoraleEn: PropTypes.func.isRequired,
    changeNoteFr: PropTypes.func.isRequired,
    changeNoteEn: PropTypes.func.isRequired,
  }),
};

export default NotesPanel;
