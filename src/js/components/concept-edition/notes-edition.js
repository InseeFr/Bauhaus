import React from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab } from 'react-bootstrap';
import NoteEdition from './note-edition';
import { dictionary } from 'js/utils/dictionary';
import { propTypes as notePropTypes } from 'js/utils/concepts/notes';
import { maxLengthScopeNote } from 'config/config';

const noteTypes = [
  {
    title: dictionary.notes.scopeNote,
    //TODO should be highlighted only if
    //`disseminationStatus.includes('Public')`
    highlightIfFrEmpty: true,
    noteFrName: 'definitionCourteFr',
    noteEnName: 'definitionCourteEn',
    maxLength: maxLengthScopeNote,
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

//TODO handle red warnings for note tabs (see below)
//TODO handle `scopeNoteTabLabel`

// const scopeNoteTabLabel =
//   !isDefinitionCourteFr && disseminationStatus.includes('Public')
//     ? <div className="red">
//         {dictionary.notes.scopeNote}
//       </div>
//     : dictionary.notes.scopeNote;
// const definitionTabLabel = !isDefinitionFr
//   ? <div className="red">
//       {dictionary.notes.definition}
//     </div>
//   : dictionary.notes.definition;

// const versioningIsPossible =
//   isChangeNoteFr && isChangeNoteFrChanged ? true : false;
// const disabledVersioningButton = !versioningIsPossible;

//TODO structuring data in the state to make `fr` and `en` two attributes of an
//object might be a better option to organize the code efficiently.

const handleFieldChange = handleChange =>
  noteTypes.reduce((handlers, { noteFrName, noteEnName }) => {
    handlers[noteFrName] = value => handleChange({ [noteFrName]: value });
    handlers[noteEnName] = value => handleChange({ [noteEnName]: value });
    return handlers;
  }, {});

function NotesEdition({ notes, handleChange }) {
  const handlers = handleFieldChange(handleChange);
  return (
    <ul className="nav nav-tabs nav-justified">
      <Tabs defaultActiveKey={0} id="kindOfNote">
        {noteTypes.map(({ title, noteFrName, noteEnName, maxLength }, i) =>
          <Tab
            key={noteFrName}
            eventKey={i}
            title={title}
            style={{ marginTop: '20px' }}>
            <NoteEdition
              noteFr={notes[noteFrName]}
              noteEn={notes[noteEnName]}
              handleChangeFr={handlers[noteFrName]}
              handleChangeEn={handlers[noteEnName]}
              maxLength={maxLength}
            />
          </Tab>
        )}
      </Tabs>
    </ul>
  );
}

NotesEdition.propTypes = {
  conceptGeneral: notePropTypes,
  handleChange: PropTypes.func.isRequired,
};

export default NotesEdition;
