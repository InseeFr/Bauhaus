import React from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab } from 'react-bootstrap';
import NoteEdition from './note-edition';
import { dictionary } from 'js/utils/dictionary';
import { propTypes as notePropTypes } from 'js/utils/concepts/notes';
import { maxLengthScopeNote } from 'config/config';
import isEmpty from 'js/utils/is-empty-html';

const noteTypes = [
  {
    rawTitle: dictionary.notes.scopeNote,
    // should be highlighted only if `definitionCourteFr` is empty and
    //`disseminationStatus.includes('Public')`
    redFrEmpty: disseminationStatus => disseminationStatus.includes('Public'),
    noteFrName: 'definitionCourteFr',
    noteEnName: 'definitionCourteEn',
    maxLength: maxLengthScopeNote,
  },
  {
    rawTitle: dictionary.notes.definition,
    redFrEmpty: () => true,
    noteFrName: 'definitionFr',
    noteEnName: 'definitionEn',
  },

  {
    rawTitle: dictionary.notes.editorialeNote,
    noteFrName: 'noteEditorialeFr',
    noteEnName: 'noteEditorialeEn',
  },
  {
    rawTitle: dictionary.notes.changeNote,
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

function NotesEdition({ notes, disseminationStatus, handleChange }) {
  const handlers = handleFieldChange(handleChange);
  return (
    <ul className="nav nav-tabs nav-justified">
      <Tabs defaultActiveKey={0} id="kindOfNote">
        {noteTypes.map(
          ({ rawTitle, noteFrName, noteEnName, redFrEmpty, maxLength }, i) => {
            const noteFr = notes[noteFrName];
            const noteEn = notes[noteEnName];
            //note fr empty and we value the `redFrEmptpy` function to know if
            //given the dissemination status, it should be highlighted or not
            const highlight =
              redFrEmpty && isEmpty(noteFr) && redFrEmpty(disseminationStatus);
            const title = highlight
              ? <div className="red">
                  {rawTitle}
                </div>
              : rawTitle;
            return (
              <Tab
                key={noteFrName}
                eventKey={i}
                title={title}
                style={{ marginTop: '20px' }}>
                <NoteEdition
                  noteFr={noteFr}
                  noteEn={noteEn}
                  handleChangeFr={handlers[noteFrName]}
                  handleChangeEn={handlers[noteEnName]}
                  maxLength={maxLength}
                />
              </Tab>
            );
          }
        )}
      </Tabs>
    </ul>
  );
}

NotesEdition.propTypes = {
  conceptGeneral: notePropTypes,
  disseminationStatus: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default NotesEdition;
